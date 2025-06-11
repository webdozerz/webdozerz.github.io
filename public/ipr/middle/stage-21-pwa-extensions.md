# 📱 Этап 21: PWA и расширения - Progressive Web Apps и браузерные расширения

## 📋 Общая информация

**Продолжительность:** 3 недели  
**Сложность:** Высокая  
**Предварительные требования:** Завершенные этапы 11-20

## 🎯 Цели этапа

### Основные задачи:

- ✅ Создать Progressive Web App (PWA) версию приложения
- ✅ Реализовать Service Workers для offline функциональности
- ✅ Внедрить Web Push уведомления
- ✅ Создать браузерное расширение для быстрой торговли
- ✅ Настроить автоматические обновления и кэширование
- ✅ Реализовать фоновую синхронизацию данных
- ✅ Оптимизировать производительность для мобильных устройств

## 🛠️ Технологический стек

### Технологии PWA

- **Service Workers** - фоновые скрипты для offline поддержки
- **Web App Manifest** - метаданные PWA
- **Cache API** - управление кэшированием
- **Background Sync** - синхронизация данных

### Уведомления и синхронизация

- **Web Push API** - push уведомления
- **Notification API** - локальные уведомления
- **IndexedDB** - локальное хранилище данных
- **Workbox** - инструменты для PWA

### Браузерные расширения

- **Manifest V3** - современный стандарт расширений
- **Chrome Extensions API** - API браузера
- **WebExtensions** - кроссбраузерная совместимость
- **Content Scripts** - взаимодействие со страницами

## 📚 Функциональные требования

### 📱 21.1 Конфигурация PWA Manifest

```json
// public/manifest.json
{
  "name": "Crypto Learning Hub",
  "short_name": "CryptoHub",
  "description": "Advanced crypto trading and learning platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a1a",
  "theme_color": "#4f46e5",
  "orientation": "portrait-primary",
  "categories": ["finance", "education", "productivity"],
  "lang": "en",
  "dir": "ltr",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop-1.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile-1.png",
      "sizes": "375x812",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "shortcuts": [
    {
      "name": "Quick Trade",
      "short_name": "Trade",
      "description": "Open trading interface",
      "url": "/trading",
      "icons": [
        {
          "src": "/icons/trade-icon.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Portfolio",
      "short_name": "Portfolio",
      "description": "View portfolio",
      "url": "/portfolio",
      "icons": [
        {
          "src": "/icons/portfolio-icon.png",
          "sizes": "96x96"
        }
      ]
    }
  ],
  "related_applications": [
    {
      "platform": "webapp",
      "url": "https://cryptohub.com/manifest.json"
    }
  ]
}
```

### 🔧 21.2 Реализация Service Worker

```typescript
// sw.ts - Service Worker
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  StaleWhileRevalidate,
  CacheFirst,
  NetworkFirst,
} from "workbox-strategies";
import { BackgroundSync } from "workbox-background-sync";

declare const self: ServiceWorkerGlobalScope;

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Cache strategies for different types of content
registerRoute(
  // Cache API responses
  /^https:\/\/api\.cryptohub\.com\/api\//,
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 5,
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => {
          return `${request.url}?timestamp=${Math.floor(Date.now() / 60000)}`;
        },
      },
    ],
  })
);

registerRoute(
  // Cache crypto price data with short TTL
  /^https:\/\/api\.coingecko\.com\/api\/v3\//,
  new StaleWhileRevalidate({
    cacheName: "crypto-prices",
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          return response.status === 200;
        },
      },
    ],
  })
);

registerRoute(
  // Cache images
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  new CacheFirst({
    cacheName: "images",
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => {
          return request.url;
        },
      },
    ],
  })
);

// Background sync for failed requests
const bgSync = new BackgroundSync("crypto-sync", {
  maxRetentionTime: 24 * 60, // 24 hours
});

registerRoute(
  /^https:\/\/api\.cryptohub\.com\/api\/trading\//,
  async ({ event }) => {
    try {
      const response = await fetch(event.request.clone());
      return response;
    } catch (error) {
      await bgSync.replayRequests();
      throw error;
    }
  },
  "POST"
);

// Push notification handling
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    data: data.data,
    actions: [
      {
        action: "view",
        title: "View Details",
        icon: "/icons/view-icon.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icons/dismiss-icon.png",
      },
    ],
    requireInteraction: data.priority === "high",
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const action = event.action;

  if (action === "view") {
    event.waitUntil(clients.openWindow(notification.data.url || "/"));
  }

  notification.close();
});

// Install and activate events
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});
```

### 🔔 21.3 Push Notifications Implementation

```typescript
// composables/usePushNotifications.ts
export const usePushNotifications = () => {
  const isSupported = ref(false);
  const isSubscribed = ref(false);
  const subscription = ref<PushSubscription | null>(null);

  const checkSupport = () => {
    isSupported.value = "serviceWorker" in navigator && "PushManager" in window;
  };

  const requestPermission = async () => {
    if (!isSupported.value) return false;

    const permission = await Notification.requestPermission();
    return permission === "granted";
  };

  const subscribe = async () => {
    if (!isSupported.value) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(process.env.VAPID_PUBLIC_KEY!),
      });

      // Send subscription to server
      await $fetch("/api/push/subscribe", {
        method: "POST",
        body: {
          subscription: sub.toJSON(),
        },
      });

      subscription.value = sub;
      isSubscribed.value = true;
    } catch (error) {
      console.error("Failed to subscribe:", error);
    }
  };

  const unsubscribe = async () => {
    if (!subscription.value) return;

    try {
      await subscription.value.unsubscribe();
      await $fetch("/api/push/unsubscribe", {
        method: "POST",
        body: {
          endpoint: subscription.value.endpoint,
        },
      });

      subscription.value = null;
      isSubscribed.value = false;
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
    }
  };

  const sendTestNotification = async () => {
    await $fetch("/api/push/test", {
      method: "POST",
    });
  };

  onMounted(() => {
    checkSupport();

    if (isSupported.value) {
      navigator.serviceWorker.ready.then(async (registration) => {
        const sub = await registration.pushManager.getSubscription();
        if (sub) {
          subscription.value = sub;
          isSubscribed.value = true;
        }
      });
    }
  });

  return {
    isSupported: readonly(isSupported),
    isSubscribed: readonly(isSubscribed),
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
  };
};

function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```

### 📊 21.4 Offline Data Management

```typescript
// utils/offlineStorage.ts
import { openDB, DBSchema, IDBPDatabase } from "idb";

interface CryptoDBSchema extends DBSchema {
  prices: {
    key: string;
    value: {
      id: string;
      symbol: string;
      name: string;
      current_price: number;
      price_change_24h: number;
      last_updated: number;
    };
  };
  portfolio: {
    key: string;
    value: {
      id: string;
      symbol: string;
      amount: number;
      avg_price: number;
      last_sync: number;
    };
  };
  trades: {
    key: string;
    value: {
      id: string;
      pair: string;
      type: "buy" | "sell";
      amount: number;
      price: number;
      timestamp: number;
      synced: boolean;
    };
  };
}

class OfflineStorage {
  private db: IDBPDatabase<CryptoDBSchema> | null = null;

  async init() {
    this.db = await openDB<CryptoDBSchema>("crypto-hub-db", 1, {
      upgrade(db) {
        // Create object stores
        if (!db.objectStoreNames.contains("prices")) {
          db.createObjectStore("prices", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("portfolio")) {
          db.createObjectStore("portfolio", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("trades")) {
          const tradesStore = db.createObjectStore("trades", { keyPath: "id" });
          tradesStore.createIndex("synced", "synced");
        }
      },
    });
  }

  // Price data management
  async savePrices(prices: any[]) {
    if (!this.db) await this.init();

    const tx = this.db!.transaction("prices", "readwrite");
    await Promise.all(
      prices.map((price) =>
        tx.store.put({
          ...price,
          last_updated: Date.now(),
        })
      )
    );
  }

  async getPrices() {
    if (!this.db) await this.init();
    return await this.db!.getAll("prices");
  }

  async getCachedPrice(symbol: string) {
    if (!this.db) await this.init();
    return await this.db!.get("prices", symbol);
  }

  // Portfolio management
  async savePortfolio(portfolio: any[]) {
    if (!this.db) await this.init();

    const tx = this.db!.transaction("portfolio", "readwrite");
    await Promise.all(
      portfolio.map((item) =>
        tx.store.put({
          ...item,
          last_sync: Date.now(),
        })
      )
    );
  }

  async getPortfolio() {
    if (!this.db) await this.init();
    return await this.db!.getAll("portfolio");
  }

  // Trades management
  async saveTrade(trade: any) {
    if (!this.db) await this.init();

    await this.db!.put("trades", {
      ...trade,
      id: `trade_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      synced: false,
    });
  }

  async getUnsyncedTrades() {
    if (!this.db) await this.init();
    return await this.db!.getAllFromIndex("trades", "synced", false);
  }

  async markTradeAsSynced(tradeId: string) {
    if (!this.db) await this.init();

    const trade = await this.db!.get("trades", tradeId);
    if (trade) {
      trade.synced = true;
      await this.db!.put("trades", trade);
    }
  }

  // Cleanup old data
  async cleanup() {
    if (!this.db) await this.init();

    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours

    // Clean old prices
    const prices = await this.db!.getAll("prices");
    const oldPrices = prices.filter((p) => p.last_updated < cutoff);

    const tx = this.db!.transaction("prices", "readwrite");
    await Promise.all(oldPrices.map((p) => tx.store.delete(p.id)));
  }
}

export const offlineStorage = new OfflineStorage();
```

### 🔌 21.5 Browser Extension Implementation

```json
// extension/manifest.json
{
  "manifest_version": 3,
  "name": "Crypto Learning Hub - Quick Trader",
  "version": "1.0.0",
  "description": "Quick crypto trading and price monitoring",
  "permissions": [
    "storage",
    "notifications",
    "activeTab",
    "alarms",
    "https://api.cryptohub.com/*",
    "https://api.coingecko.com/*"
  ],
  "host_permissions": ["https://*.cryptohub.com/*"],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["https://*.coinbase.com/*", "https://*.binance.com/*"],
      "js": ["content.js"],
      "css": ["content.css"]
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "Crypto Hub Quick Trader",
    "default_icon": {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  },
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  }
}
```

```typescript
// extension/background.ts
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.sync.set({
    priceAlerts: [],
    refreshInterval: 30000,
    enableNotifications: true,
  });

  // Create periodic price check alarm
  chrome.alarms.create("price-check", { periodInMinutes: 1 });
});

// Handle price check alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "price-check") {
    checkPriceAlerts();
  }
});

async function checkPriceAlerts() {
  const { priceAlerts, enableNotifications } = await chrome.storage.sync.get([
    "priceAlerts",
    "enableNotifications",
  ]);

  if (!enableNotifications || !priceAlerts.length) return;

  for (const alert of priceAlerts) {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${alert.coinId}&vs_currencies=usd`
      );
      const data = await response.json();
      const currentPrice = data[alert.coinId]?.usd;

      if (currentPrice && shouldTriggerAlert(alert, currentPrice)) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon-48.png",
          title: "Price Alert",
          message: `${alert.symbol.toUpperCase()} is now $${currentPrice}`,
        });

        // Update last triggered
        alert.lastTriggered = Date.now();
        await chrome.storage.sync.set({ priceAlerts });
      }
    } catch (error) {
      console.error("Error checking price alert:", error);
    }
  }
}

function shouldTriggerAlert(alert: any, currentPrice: number): boolean {
  const { type, targetPrice, lastTriggered } = alert;
  const cooldownPeriod = 5 * 60 * 1000; // 5 minutes

  // Check cooldown
  if (lastTriggered && Date.now() - lastTriggered < cooldownPeriod) {
    return false;
  }

  switch (type) {
    case "above":
      return currentPrice >= targetPrice;
    case "below":
      return currentPrice <= targetPrice;
    case "change":
      // Implement percentage change logic
      return false;
    default:
      return false;
  }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPrices") {
    fetchLatestPrices().then(sendResponse);
    return true;
  }

  if (request.action === "addAlert") {
    addPriceAlert(request.alert).then(sendResponse);
    return true;
  }
});

async function fetchLatestPrices() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching prices:", error);
    return [];
  }
}

async function addPriceAlert(alert: any) {
  const { priceAlerts = [] } = await chrome.storage.sync.get("priceAlerts");
  priceAlerts.push({
    ...alert,
    id: Date.now().toString(),
    created: Date.now(),
  });
  await chrome.storage.sync.set({ priceAlerts });
}
```

```html
<!-- extension/popup.html -->
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        width: 350px;
        min-height: 400px;
        margin: 0;
        padding: 16px;
        font-family: system-ui, sans-serif;
        background: #1a1a1a;
        color: #fff;
      }

      .header {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
      }

      .header img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }

      .price-list {
        max-height: 300px;
        overflow-y: auto;
      }

      .price-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #333;
      }

      .price-change {
        font-size: 12px;
      }

      .positive {
        color: #10b981;
      }
      .negative {
        color: #ef4444;
      }

      .quick-actions {
        margin-top: 16px;
        display: flex;
        gap: 8px;
      }

      button {
        background: #4f46e5;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      }

      button:hover {
        background: #3730a3;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="icons/icon-32.png" alt="Logo" />
      <h3>Crypto Hub Quick Trader</h3>
    </div>

    <div id="loading">Loading prices...</div>

    <div id="price-list" class="price-list" style="display: none;"></div>

    <div class="quick-actions">
      <button id="open-app">Open App</button>
      <button id="set-alert">Set Alert</button>
      <button id="refresh">Refresh</button>
    </div>

    <script src="popup.js"></script>
  </body>
</html>
```

## 🎯 Критерии оценки

### ⭐ Обязательные требования (100 баллов)

1. **PWA Implementation (30 баллов)**

   - Service Worker с offline поддержкой
   - Web App Manifest
   - Installable PWA
   - Responsive design для мобильных

2. **Offline Functionality (25 баллов)**

   - Offline data storage с IndexedDB
   - Background sync
   - Cache strategies
   - Graceful offline experience

3. **Push Notifications (20 баллов)**

   - Web Push API implementation
   - VAPID keys setup
   - Notification handling
   - Permission management

4. **Browser Extension (15 баллов)**

   - Manifest V3 extension
   - Quick trading popup
   - Price alerts
   - Integration with main app

5. **Performance Optimization (10 баллов)**
   - Lazy loading
   - Code splitting
   - Service Worker caching
   - Mobile optimization

### 🚀 Дополнительные задания (50 баллов)

1. **Advanced PWA Features (20 баллов)**

   - Web Share API
   - File System Access API
   - Background app refresh
   - App shortcuts

2. **Extension Advanced Features (15 баллов)**

   - Content script integration
   - Cross-site price comparison
   - Automated trading triggers
   - Multi-exchange support

3. **Mobile Optimization (10 баллов)**

   - Touch gestures
   - Native-like animations
   - Optimized layouts
   - App-like navigation

4. **Analytics & Monitoring (5 баллов)**
   - PWA performance tracking
   - Extension usage analytics
   - Offline usage metrics

## 📊 Процесс выполнения

### Неделя 1: PWA Implementation

- Настройка Service Worker
- Web App Manifest
- Offline functionality
- Push notifications

### Неделя 2: Browser Extension

- Extension development
- Popup interface
- Background scripts
- Content scripts

### Неделя 3: Optimization & Testing

- Performance optimization
- Cross-platform testing
- Mobile optimization
- Documentation

## 🔍 Вопросы для изучения

1. **PWA Best Practices:**

   - Какие cache strategies использовать для разных типов контента?
   - Как обеспечить seamless offline experience?

2. **Service Workers:**

   - Как правильно управлять lifecycle Service Worker?
   - Когда использовать Background Sync?

3. **Browser Extensions:**

   - Какие ограничения Manifest V3?
   - Как обеспечить security в расширениях?

4. **Mobile Optimization:**
   - Как оптимизировать для различных устройств?
   - Какие mobile-specific features использовать?

## 📈 Ожидаемые результаты

По завершении этапа вы получите:

- 📱 **Production-ready PWA** - полнофункциональное мобильное приложение
- 🔌 **Browser extension** - quick trading tool для браузеров
- 📡 **Offline capabilities** - работа без интернета
- 🔔 **Push notifications** - real-time уведомления
- ⚡ **Mobile optimization** - native-like mobile experience

Этот этап расширяет reach вашего приложения на различные платформы и устройства.
