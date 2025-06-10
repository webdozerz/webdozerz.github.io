# Этап 13: Advanced Vue.js/Nuxt.js Frameworks - Детальные задания

## Задание 13.1: Advanced Composition API & Patterns

### 🎯 Цель

Освоить продвинутые паттерны Vue.js 3 с Composition API, создать переиспользуемые композаблы и реализовать сложную бизнес-логику для Crypto Learning Hub

### 📋 Требования

#### Функциональные требования:

- [ ] Система real-time обновления цен криптовалют
- [ ] Интерактивные графики и чарты
- [ ] Продвинутая система фильтрации и поиска
- [ ] Drag & Drop интерфейс для портфолио
- [ ] Модальные окна и уведомления

#### Технические требования:

- [ ] Кастомные композаблы с типизацией
- [ ] Продвинутые реактивные паттерны
- [ ] Оптимизированные computed свойства
- [ ] Эффективное управление жизненным циклом
- [ ] Memory leak prevention

### 🧩 Кастомные Композаблы

#### composables/useCryptoPrice.ts

```typescript
import { ref, computed, watch, onUnmounted } from "vue";
import type {
  CryptoCurrency,
  PriceData,
  SubscriptionOptions,
} from "@clh/types";

export interface UseCryptoPriceReturn {
  price: Readonly<Ref<number>>;
  change24h: Readonly<Ref<number>>;
  changePercent24h: Readonly<Ref<number>>;
  volume24h: Readonly<Ref<number>>;
  marketCap: Readonly<Ref<number>>;
  lastUpdated: Readonly<Ref<Date | null>>;
  isLoading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  isConnected: Readonly<Ref<boolean>>;
  subscribe: () => void;
  unsubscribe: () => void;
  refresh: () => Promise<void>;
}

export function useCryptoPrice(
  symbol: MaybeRef<string>,
  options: SubscriptionOptions = {}
): UseCryptoPriceReturn {
  const {
    interval = 5000,
    autoSubscribe = true,
    retryAttempts = 3,
    retryDelay = 1000,
  } = options;

  // Reactive state
  const price = ref<number>(0);
  const change24h = ref<number>(0);
  const volume24h = ref<number>(0);
  const marketCap = ref<number>(0);
  const lastUpdated = ref<Date | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const isConnected = ref<boolean>(false);

  // WebSocket connection
  let ws: WebSocket | null = null;
  let reconnectTimer: NodeJS.Timeout | null = null;
  let retryCount = 0;

  // Computed values
  const changePercent24h = computed(() => {
    return price.value > 0
      ? (change24h.value / (price.value - change24h.value)) * 100
      : 0;
  });

  // WebSocket message handler
  const handleMessage = (event: MessageEvent) => {
    try {
      const data: PriceData = JSON.parse(event.data);

      if (data.symbol === unref(symbol)) {
        price.value = data.price;
        change24h.value = data.change24h;
        volume24h.value = data.volume24h;
        marketCap.value = data.marketCap;
        lastUpdated.value = new Date(data.timestamp);
        error.value = null;
        retryCount = 0;
      }
    } catch (err) {
      console.error("Failed to parse price data:", err);
      error.value = "Failed to parse price data";
    }
  };

  // WebSocket connection logic
  const connect = () => {
    if (ws?.readyState === WebSocket.OPEN) return;

    isLoading.value = true;
    error.value = null;

    try {
      ws = new WebSocket(`wss://api.crypto-hub.com/ws/price/${unref(symbol)}`);

      ws.onopen = () => {
        isConnected.value = true;
        isLoading.value = false;
        retryCount = 0;
        console.log(`Connected to price feed for ${unref(symbol)}`);
      };

      ws.onmessage = handleMessage;

      ws.onclose = (event) => {
        isConnected.value = false;
        isLoading.value = false;

        if (!event.wasClean && retryCount < retryAttempts) {
          retryCount++;
          console.log(
            `Reconnecting to price feed... Attempt ${retryCount}/${retryAttempts}`
          );

          reconnectTimer = setTimeout(() => {
            connect();
          }, retryDelay * retryCount);
        } else {
          error.value = "Connection lost";
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        error.value = "Connection failed";
        isLoading.value = false;
      };
    } catch (err) {
      error.value = "Failed to connect";
      isLoading.value = false;
    }
  };

  // Public methods
  const subscribe = () => {
    connect();
  };

  const unsubscribe = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    if (ws) {
      ws.close(1000, "Manual disconnect");
      ws = null;
    }

    isConnected.value = false;
  };

  const refresh = async () => {
    try {
      isLoading.value = true;

      const response = await $fetch<PriceData>(
        `/api/crypto/price/${unref(symbol)}`
      );

      price.value = response.price;
      change24h.value = response.change24h;
      volume24h.value = response.volume24h;
      marketCap.value = response.marketCap;
      lastUpdated.value = new Date(response.timestamp);
      error.value = null;
    } catch (err) {
      error.value = "Failed to refresh price";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Watch symbol changes
  watch(
    () => unref(symbol),
    (newSymbol, oldSymbol) => {
      if (newSymbol !== oldSymbol) {
        unsubscribe();
        if (autoSubscribe) {
          subscribe();
        }
      }
    },
    { immediate: true }
  );

  // Auto-subscribe
  if (autoSubscribe) {
    subscribe();
  }

  // Cleanup on unmount
  onUnmounted(() => {
    unsubscribe();
  });

  return {
    price: readonly(price),
    change24h: readonly(change24h),
    changePercent24h: readonly(changePercent24h),
    volume24h: readonly(volume24h),
    marketCap: readonly(marketCap),
    lastUpdated: readonly(lastUpdated),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isConnected: readonly(isConnected),
    subscribe,
    unsubscribe,
    refresh,
  };
}
```

#### composables/usePortfolioManagement.ts

```typescript
import { ref, computed, nextTick } from "vue";
import { useLocalStorage } from "@vueuse/core";
import type { Portfolio, Asset, Transaction } from "@clh/types";

export interface UsePortfolioReturn {
  portfolio: Ref<Portfolio>;
  totalValue: ComputedRef<number>;
  totalPnL: ComputedRef<number>;
  totalPnLPercent: ComputedRef<number>;
  assets: ComputedRef<Asset[]>;
  transactions: ComputedRef<Transaction[]>;
  addAsset: (asset: Omit<Asset, "id" | "addedAt">) => void;
  removeAsset: (assetId: string) => void;
  updateAsset: (assetId: string, updates: Partial<Asset>) => void;
  reorderAssets: (oldIndex: number, newIndex: number) => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void;
  exportPortfolio: () => string;
  importPortfolio: (data: string) => void;
  calculateAssetValue: (asset: Asset) => number;
  getAssetPnL: (asset: Asset) => { absolute: number; percent: number };
}

export function usePortfolioManagement(): UsePortfolioReturn {
  // Persistent storage
  const portfolio = useLocalStorage<Portfolio>("crypto-portfolio", {
    id: "default",
    name: "My Portfolio",
    assets: [],
    transactions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Computed values
  const assets = computed(() => portfolio.value.assets);
  const transactions = computed(() => portfolio.value.transactions);

  const totalValue = computed(() => {
    return assets.value.reduce((total, asset) => {
      return total + calculateAssetValue(asset);
    }, 0);
  });

  const totalPnL = computed(() => {
    return assets.value.reduce((total, asset) => {
      const pnl = getAssetPnL(asset);
      return total + pnl.absolute;
    }, 0);
  });

  const totalPnLPercent = computed(() => {
    const totalInvested = assets.value.reduce((total, asset) => {
      return total + asset.amount * asset.averagePrice;
    }, 0);

    return totalInvested > 0 ? (totalPnL.value / totalInvested) * 100 : 0;
  });

  // Helper functions
  const calculateAssetValue = (asset: Asset): number => {
    // В реальном приложении здесь будет получение текущей цены
    // Пока используем mock данные
    const currentPrice = asset.currentPrice || asset.averagePrice;
    return asset.amount * currentPrice;
  };

  const getAssetPnL = (asset: Asset): { absolute: number; percent: number } => {
    const currentValue = calculateAssetValue(asset);
    const investedValue = asset.amount * asset.averagePrice;
    const absolute = currentValue - investedValue;
    const percent = investedValue > 0 ? (absolute / investedValue) * 100 : 0;

    return { absolute, percent };
  };

  // Asset management
  const addAsset = (assetData: Omit<Asset, "id" | "addedAt">) => {
    const newAsset: Asset = {
      id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: new Date().toISOString(),
      ...assetData,
    };

    portfolio.value.assets.push(newAsset);
    portfolio.value.updatedAt = new Date().toISOString();
  };

  const removeAsset = (assetId: string) => {
    const index = portfolio.value.assets.findIndex(
      (asset) => asset.id === assetId
    );
    if (index !== -1) {
      portfolio.value.assets.splice(index, 1);
      portfolio.value.updatedAt = new Date().toISOString();
    }
  };

  const updateAsset = (assetId: string, updates: Partial<Asset>) => {
    const asset = portfolio.value.assets.find((a) => a.id === assetId);
    if (asset) {
      Object.assign(asset, updates);
      portfolio.value.updatedAt = new Date().toISOString();
    }
  };

  const reorderAssets = (oldIndex: number, newIndex: number) => {
    const assets = [...portfolio.value.assets];
    const [movedAsset] = assets.splice(oldIndex, 1);
    assets.splice(newIndex, 0, movedAsset);

    portfolio.value.assets = assets;
    portfolio.value.updatedAt = new Date().toISOString();
  };

  // Transaction management
  const addTransaction = (
    transactionData: Omit<Transaction, "id" | "timestamp">
  ) => {
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...transactionData,
    };

    portfolio.value.transactions.push(newTransaction);

    // Update asset if it's a buy/sell transaction
    if (transactionData.type === "buy" || transactionData.type === "sell") {
      updateAssetFromTransaction(newTransaction);
    }

    portfolio.value.updatedAt = new Date().toISOString();
  };

  const updateAssetFromTransaction = (transaction: Transaction) => {
    let asset = portfolio.value.assets.find(
      (a) => a.symbol === transaction.symbol
    );

    if (!asset && transaction.type === "buy") {
      // Create new asset for buy transaction
      addAsset({
        symbol: transaction.symbol,
        name: transaction.symbol, // В реальном приложении получим из API
        amount: transaction.amount,
        averagePrice: transaction.price,
        currentPrice: transaction.price,
      });
    } else if (asset) {
      if (transaction.type === "buy") {
        // Update average price and amount
        const totalValue =
          asset.amount * asset.averagePrice +
          transaction.amount * transaction.price;
        const totalAmount = asset.amount + transaction.amount;

        asset.averagePrice = totalValue / totalAmount;
        asset.amount = totalAmount;
      } else if (transaction.type === "sell") {
        asset.amount = Math.max(0, asset.amount - transaction.amount);

        // Remove asset if amount is 0
        if (asset.amount === 0) {
          removeAsset(asset.id);
        }
      }
    }
  };

  // Import/Export functionality
  const exportPortfolio = (): string => {
    return JSON.stringify(portfolio.value, null, 2);
  };

  const importPortfolio = (data: string) => {
    try {
      const imported = JSON.parse(data) as Portfolio;

      // Validate structure
      if (!imported.assets || !Array.isArray(imported.assets)) {
        throw new Error("Invalid portfolio format");
      }

      portfolio.value = {
        ...imported,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error("Failed to import portfolio: Invalid format");
    }
  };

  return {
    portfolio,
    totalValue,
    totalPnL,
    totalPnLPercent,
    assets,
    transactions,
    addAsset,
    removeAsset,
    updateAsset,
    reorderAssets,
    addTransaction,
    exportPortfolio,
    importPortfolio,
    calculateAssetValue,
    getAssetPnL,
  };
}
```

### 📊 Задание 13.2: Advanced Components с производительностью

#### components/CryptoChart.vue

```vue
<template>
  <div ref="chartContainer" class="crypto-chart">
    <div class="chart-header">
      <h3 class="chart-title">{{ symbol }} Price Chart</h3>
      <div class="chart-controls">
        <ChartTypeSelector v-model="chartType" />
        <TimeframeSelector v-model="timeframe" />
        <button
          v-if="isFullscreen"
          @click="exitFullscreen"
          class="btn-fullscreen"
        >
          Exit Fullscreen
        </button>
        <button v-else @click="enterFullscreen" class="btn-fullscreen">
          Fullscreen
        </button>
      </div>
    </div>

    <div
      ref="chartElement"
      class="chart-canvas"
      :class="{ fullscreen: isFullscreen }"
    />

    <div v-if="isLoading" class="chart-loading">
      <LoadingSpinner />
      <span>Loading chart data...</span>
    </div>

    <div v-if="error" class="chart-error">
      <ErrorIcon />
      <span>{{ error }}</span>
      <button @click="retryLoad" class="btn-retry">Retry</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useElementSize, useEventListener, useThrottleFn } from "@vueuse/core";
import type { ChartData, ChartOptions, ChartType, Timeframe } from "@clh/types";

interface Props {
  symbol: string;
  height?: number;
  autoUpdate?: boolean;
  updateInterval?: number;
}

const props = withDefaults(defineProps<Props>(), {
  height: 400,
  autoUpdate: true,
  updateInterval: 5000,
});

// Refs
const chartContainer = ref<HTMLElement>();
const chartElement = ref<HTMLElement>();
const chartInstance = ref<any>(null);

// State
const chartType = ref<ChartType>("candlestick");
const timeframe = ref<Timeframe>("1h");
const isLoading = ref(false);
const error = ref<string | null>(null);
const isFullscreen = ref(false);
const chartData = ref<ChartData | null>(null);

// Composables
const { width, height: containerHeight } = useElementSize(chartContainer);

// Chart configuration
const chartOptions = computed(
  (): ChartOptions => ({
    chart: {
      type: chartType.value,
      height: isFullscreen.value ? window.innerHeight - 100 : props.height,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      background: "transparent",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    theme: {
      mode: "dark",
    },
    grid: {
      borderColor: "#2d3748",
      strokeDashArray: 3,
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#a0aec0",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#a0aec0",
        },
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
    },
    tooltip: {
      theme: "dark",
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

        if (chartType.value === "candlestick") {
          return `
          <div class="chart-tooltip">
            <div class="tooltip-header">${props.symbol}</div>
            <div class="tooltip-body">
              <div>Open: $${data.y[0].toFixed(2)}</div>
              <div>High: $${data.y[1].toFixed(2)}</div>
              <div>Low: $${data.y[2].toFixed(2)}</div>
              <div>Close: $${data.y[3].toFixed(2)}</div>
            </div>
          </div>
        `;
        } else {
          return `
          <div class="chart-tooltip">
            <div class="tooltip-header">${props.symbol}</div>
            <div class="tooltip-body">
              <div>Price: $${data.y.toFixed(2)}</div>
            </div>
          </div>
        `;
        }
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#00ff88",
          downward: "#ff4757",
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    colors: ["#0088cc", "#00ff88", "#ff4757"],
  })
);

// Data fetching
const fetchChartData = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await $fetch<ChartData>(`/api/crypto/chart`, {
      query: {
        symbol: props.symbol,
        timeframe: timeframe.value,
        type: chartType.value,
      },
    });

    chartData.value = response;

    if (chartInstance.value) {
      await chartInstance.value.updateSeries([
        {
          name: props.symbol,
          data: response.data,
        },
      ]);
    }
  } catch (err) {
    error.value = "Failed to load chart data";
    console.error("Chart data fetch error:", err);
  } finally {
    isLoading.value = false;
  }
};

const retryLoad = () => {
  fetchChartData();
};

// Chart initialization
const initChart = async () => {
  if (!chartElement.value || !chartData.value) return;

  try {
    // Динамический импорт ApexCharts для code splitting
    const ApexCharts = (await import("apexcharts")).default;

    const options = {
      ...chartOptions.value,
      series: [
        {
          name: props.symbol,
          data: chartData.value.data,
        },
      ],
    };

    chartInstance.value = new ApexCharts(chartElement.value, options);
    await chartInstance.value.render();
  } catch (err) {
    error.value = "Failed to initialize chart";
    console.error("Chart initialization error:", err);
  }
};

// Resize handling
const handleResize = useThrottleFn(() => {
  if (chartInstance.value) {
    chartInstance.value.updateOptions({
      chart: {
        width: width.value,
        height: isFullscreen.value ? window.innerHeight - 100 : props.height,
      },
    });
  }
}, 200);

// Fullscreen functionality
const enterFullscreen = async () => {
  if (chartContainer.value?.requestFullscreen) {
    await chartContainer.value.requestFullscreen();
    isFullscreen.value = true;
  }
};

const exitFullscreen = async () => {
  if (document.exitFullscreen) {
    await document.exitFullscreen();
    isFullscreen.value = false;
  }
};

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
  nextTick(() => {
    handleResize();
  });
};

// Auto-update functionality
let updateTimer: NodeJS.Timeout | null = null;

const startAutoUpdate = () => {
  if (!props.autoUpdate) return;

  updateTimer = setInterval(() => {
    fetchChartData();
  }, props.updateInterval);
};

const stopAutoUpdate = () => {
  if (updateTimer) {
    clearInterval(updateTimer);
    updateTimer = null;
  }
};

// Watchers
watch([chartType, timeframe], () => {
  fetchChartData();
});

watch(width, handleResize);

watch(
  () => props.symbol,
  () => {
    fetchChartData();
  }
);

// Event listeners
useEventListener("fullscreenchange", handleFullscreenChange);
useEventListener("resize", handleResize);

// Lifecycle
onMounted(async () => {
  await fetchChartData();
  await nextTick();
  await initChart();
  startAutoUpdate();
});

onUnmounted(() => {
  stopAutoUpdate();

  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
});
</script>

<style scoped>
.crypto-chart {
  @apply bg-gray-800 rounded-lg p-4 relative;
}

.chart-header {
  @apply flex justify-between items-center mb-4;
}

.chart-title {
  @apply text-xl font-semibold text-white;
}

.chart-controls {
  @apply flex gap-2;
}

.chart-canvas {
  @apply relative;
  min-height: 300px;
}

.chart-canvas.fullscreen {
  @apply fixed inset-0 z-50 bg-gray-900;
}

.chart-loading {
  @apply absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75;
  @apply text-white gap-3;
}

.chart-error {
  @apply absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75;
  @apply text-red-400 gap-3;
}

.btn-fullscreen,
.btn-retry {
  @apply px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors;
}

:deep(.chart-tooltip) {
  @apply bg-gray-800 border border-gray-600 rounded p-3 text-white;
}

:deep(.tooltip-header) {
  @apply font-semibold text-blue-400 mb-2;
}

:deep(.tooltip-body) {
  @apply space-y-1 text-sm;
}
</style>
```

### 🔧 Задание 13.3: Pinia Store с продвинутыми паттернами

#### stores/trading.ts

```typescript
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  TradingPair,
  Order,
  OrderBook,
  TradeHistory,
  Portfolio,
  Market,
} from "@clh/types";

export const useTradingStore = defineStore("trading", () => {
  // State
  const selectedPair = ref<TradingPair | null>(null);
  const markets = ref<Market[]>([]);
  const orderBook = ref<OrderBook | null>(null);
  const openOrders = ref<Order[]>([]);
  const tradeHistory = ref<TradeHistory[]>([]);
  const portfolio = ref<Portfolio | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // WebSocket connections
  const connections = new Map<string, WebSocket>();

  // Computed
  const availableMarkets = computed(() =>
    markets.value.filter((market) => market.isActive)
  );

  const sortedOrderBook = computed(() => {
    if (!orderBook.value) return null;

    return {
      bids: orderBook.value.bids.sort((a, b) => b.price - a.price).slice(0, 20),
      asks: orderBook.value.asks.sort((a, b) => a.price - b.price).slice(0, 20),
    };
  });

  const totalPortfolioValue = computed(() => {
    if (!portfolio.value) return 0;

    return portfolio.value.assets.reduce((total, asset) => {
      const market = markets.value.find((m) => m.baseAsset === asset.symbol);
      const price = market?.lastPrice || 0;
      return total + asset.amount * price;
    }, 0);
  });

  const unrealizedPnL = computed(() => {
    if (!portfolio.value) return 0;

    return portfolio.value.assets.reduce((total, asset) => {
      const market = markets.value.find((m) => m.baseAsset === asset.symbol);
      const currentPrice = market?.lastPrice || 0;
      const purchaseValue = asset.amount * asset.averagePrice;
      const currentValue = asset.amount * currentPrice;
      return total + (currentValue - purchaseValue);
    }, 0);
  });

  // Actions
  const fetchMarkets = async () => {
    try {
      isLoading.value = true;

      const response = await $fetch<Market[]>("/api/trading/markets");
      markets.value = response;

      if (!selectedPair.value && response.length > 0) {
        selectedPair.value = {
          base: response[0].baseAsset,
          quote: response[0].quoteAsset,
        };
      }
    } catch (err) {
      error.value = "Failed to fetch markets";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const selectTradingPair = async (pair: TradingPair) => {
    selectedPair.value = pair;

    // Unsubscribe from previous pair
    const oldConnection = connections.get("orderbook");
    if (oldConnection) {
      oldConnection.close();
      connections.delete("orderbook");
    }

    // Subscribe to new pair
    await subscribeToOrderBook(pair);
    await fetchTradeHistory(pair);
  };

  const subscribeToOrderBook = async (pair: TradingPair) => {
    const symbol = `${pair.base}${pair.quote}`;

    try {
      const ws = new WebSocket(`wss://api.trading.com/ws/orderbook/${symbol}`);

      ws.onopen = () => {
        console.log(`Connected to order book for ${symbol}`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "orderbook") {
            orderBook.value = data.orderbook;
          } else if (data.type === "trade") {
            // Update trade history
            tradeHistory.value.unshift(data.trade);
            if (tradeHistory.value.length > 100) {
              tradeHistory.value = tradeHistory.value.slice(0, 100);
            }
          }
        } catch (err) {
          console.error("Failed to parse orderbook data:", err);
        }
      };

      ws.onclose = () => {
        console.log(`Disconnected from order book for ${symbol}`);
      };

      ws.onerror = (error) => {
        console.error("OrderBook WebSocket error:", error);
      };

      connections.set("orderbook", ws);
    } catch (err) {
      console.error("Failed to connect to order book:", err);
    }
  };

  const fetchTradeHistory = async (pair: TradingPair) => {
    try {
      const symbol = `${pair.base}${pair.quote}`;
      const response = await $fetch<TradeHistory[]>(
        `/api/trading/history/${symbol}`
      );
      tradeHistory.value = response;
    } catch (err) {
      console.error("Failed to fetch trade history:", err);
    }
  };

  const placeOrder = async (
    order: Omit<Order, "id" | "timestamp" | "status">
  ) => {
    try {
      isLoading.value = true;

      const response = await $fetch<Order>("/api/trading/orders", {
        method: "POST",
        body: order,
      });

      openOrders.value.push(response);

      // Refresh portfolio
      await fetchPortfolio();

      return response;
    } catch (err) {
      error.value = "Failed to place order";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await $fetch(`/api/trading/orders/${orderId}`, {
        method: "DELETE",
      });

      const index = openOrders.value.findIndex((order) => order.id === orderId);
      if (index !== -1) {
        openOrders.value.splice(index, 1);
      }
    } catch (err) {
      error.value = "Failed to cancel order";
      throw err;
    }
  };

  const fetchOpenOrders = async () => {
    try {
      const response = await $fetch<Order[]>("/api/trading/orders");
      openOrders.value = response;
    } catch (err) {
      console.error("Failed to fetch open orders:", err);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await $fetch<Portfolio>("/api/trading/portfolio");
      portfolio.value = response;
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
    }
  };

  // Market order helper
  const placeMarketOrder = async (
    type: "buy" | "sell",
    amount: number,
    pair: TradingPair = selectedPair.value!
  ) => {
    if (!orderBook.value) {
      throw new Error("Order book not available");
    }

    const orders = type === "buy" ? orderBook.value.asks : orderBook.value.bids;
    if (orders.length === 0) {
      throw new Error("No liquidity available");
    }

    const bestPrice = orders[0].price;

    return await placeOrder({
      type,
      orderType: "market",
      pair,
      amount,
      price: bestPrice,
    });
  };

  // Limit order helper
  const placeLimitOrder = async (
    type: "buy" | "sell",
    amount: number,
    price: number,
    pair: TradingPair = selectedPair.value!
  ) => {
    return await placeOrder({
      type,
      orderType: "limit",
      pair,
      amount,
      price,
    });
  };

  // Stop loss order helper
  const placeStopLossOrder = async (
    type: "buy" | "sell",
    amount: number,
    stopPrice: number,
    pair: TradingPair = selectedPair.value!
  ) => {
    return await placeOrder({
      type,
      orderType: "stopLoss",
      pair,
      amount,
      price: stopPrice,
      stopPrice,
    });
  };

  // Cleanup function
  const cleanup = () => {
    connections.forEach((ws) => {
      ws.close();
    });
    connections.clear();
  };

  return {
    // State
    selectedPair: readonly(selectedPair),
    markets: readonly(markets),
    orderBook: readonly(orderBook),
    openOrders: readonly(openOrders),
    tradeHistory: readonly(tradeHistory),
    portfolio: readonly(portfolio),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    availableMarkets,
    sortedOrderBook,
    totalPortfolioValue,
    unrealizedPnL,

    // Actions
    fetchMarkets,
    selectTradingPair,
    placeOrder,
    cancelOrder,
    fetchOpenOrders,
    fetchPortfolio,
    placeMarketOrder,
    placeLimitOrder,
    placeStopLossOrder,
    cleanup,
  };
});
```

### 📊 Критерии оценки

#### Задание 13.1: Advanced Composition API (50 баллов)

- **Отлично (45-50 баллов):**

  - Эффективные кастомные композаблы с правильной типизацией
  - Оптимизированное управление реактивностью
  - Правильное использование lifecycle hooks
  - Memory leak prevention

- **Хорошо (35-44 балла):**

  - Работающие композаблы с базовой типизацией
  - Корректное использование Composition API
  - Базовая оптимизация производительности

- **Удовлетворительно (25-34 балла):**

  - Простые композаблы работают
  - Основные принципы Composition API соблюдены

- **Неудовлетворительно (0-24 балла):**
  - Композаблы не работают или отсутствуют
  - Неправильное использование API

#### Задание 13.2: Advanced Components (50 баллов)

- **Отлично (45-50 баллов):**

  - Высокопроизводительные компоненты
  - Продвинутые паттерны (virtualization, lazy loading)
  - Правильная обработка ошибок
  - Accessibility поддержка

- **Хорошо (35-44 балла):**

  - Компоненты работают стабильно
  - Базовая оптимизация производительности
  - Хорошая типизация

- **Удовлетворительно (25-34 балла):**

  - Компоненты функциональны
  - Минимальная оптимизация

- **Неудовлетворительно (0-24 балла):**
  - Компоненты не работают
  - Серьезные проблемы с производительностью

#### Задание 13.3: Pinia Store (50 баллов)

- **Отлично (45-50 баллов):**

  - Эффективная архитектура store
  - Продвинутые паттерны (optimistic updates, caching)
  - Правильная типизация всех действий
  - WebSocket интеграция

- **Хорошо (35-44 балла):**

  - Store работает корректно
  - Базовая типизация
  - Основные паттерны применены

- **Удовлетворительно (25-34 балла):**

  - Store функционален
  - Простые операции работают

- **Неудовлетворительно (0-24 балла):**
  - Store не работает
  - Серьезные архитектурные проблемы

### 🚀 Дополнительные задачи (бонусы)

1. **Virtual Scrolling** (+20 баллов)

   - Реализация виртуального скроллинга для больших списков
   - Оптимизация рендеринга

2. **Advanced Charts** (+15 баллов)

   - Интерактивные графики с zoom/pan
   - Real-time обновления

3. **Drag & Drop System** (+10 баллов)
   - Система перетаскивания для портфолио
   - Touch support для мобильных

### 📚 Материалы для изучения

#### Обязательное чтение:

1. **Vue.js 3:**

   - Official Vue.js 3 Documentation
   - "Vue.js 3 Design Patterns and Best Practices"
   - Composition API RFC

2. **Performance:**
   - "Vue.js Performance Optimization"
   - Web Performance Optimization guides
   - Memory leak prevention techniques

### 🎯 Результат этапа

По завершении этого этапа у вас будет:

- ✅ **Продвинутые композаблы** для переиспользуемой бизнес-логики
- ✅ **Высокопроизводительные компоненты** с оптимизацией
- ✅ **Эффективное state management** с Pinia
- ✅ **Real-time функциональность** с WebSocket интеграцией
- ✅ **Enterprise-уровень архитектуры** компонентов
