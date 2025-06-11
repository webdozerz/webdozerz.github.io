# Этап 14: SSR & Performance Optimization - Детальные задания

## Задание 14.1: Server-Side Rendering с Nuxt.js

### 🎯 Цель

Настроить production-ready SSR для Crypto Learning Hub с оптимизацией SEO, производительности и пользовательского опыта

### 📋 Требования

#### Функциональные требования:

- [ ] Universal/Isomorphic рендеринг
- [ ] SEO оптимизация с meta tags
- [ ] Open Graph и Twitter Cards
- [ ] Structured data (JSON-LD)
- [ ] Sitemap генерация
- [ ] Robots.txt конфигурация

#### Технические требования:

- [ ] Hybrid rendering (SSR + SPA)
- [ ] Route-level rendering mode
- [ ] Data fetching оптимизация
- [ ] State hydration
- [ ] Error handling для SSR

### ⚙️ Nuxt.js Конфигурация

#### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  // SSR Configuration
  ssr: true,

  // Hybrid rendering
  nitro: {
    prerender: {
      routes: [
        "/",
        "/about",
        "/privacy",
        "/terms",
        "/crypto/bitcoin",
        "/crypto/ethereum",
        "/learn/basics",
        "/learn/trading",
      ],
      crawlLinks: true,
    },
    routeRules: {
      // Homepage pre-rendered at build time
      "/": { prerender: true },

      // Static pages pre-rendered
      "/about": { prerender: true },
      "/privacy": { prerender: true },
      "/terms": { prerender: true },

      // Crypto pages ISR (regenerate every hour)
      "/crypto/**": {
        prerender: false,
        index: false,
        headers: { "cache-control": "s-maxage=3600" },
      },

      // Learning pages cached for 15 minutes
      "/learn/**": {
        prerender: false,
        headers: { "cache-control": "s-maxage=900" },
      },

      // API routes
      "/api/**": {
        cors: true,
        headers: { "cache-control": "max-age=300" },
      },

      // Dashboard SPA mode (client-only)
      "/dashboard/**": {
        ssr: false,
        prerender: false,
        index: false,
      },

      // Trading SPA mode
      "/trade/**": {
        ssr: false,
        prerender: false,
        index: false,
      },
    },
  },

  // Performance optimization
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  // Build optimization
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["vue", "vue-router"],
            ui: ["@headlessui/vue", "@heroicons/vue"],
            charts: ["apexcharts"],
            web3: ["ethers", "web3"],
          },
        },
      },
    },
    optimizeDeps: {
      include: ["vue", "vue-router", "@vueuse/core"],
    },
  },

  // CSS optimization
  css: ["@/assets/css/main.css"],

  // Image optimization
  image: {
    provider: "ipx",
    quality: 80,
    format: ["webp", "avif"],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  // SEO configuration
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/manifest.json" },
      ],
    },
  },

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: process.env.API_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,

    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3000",
      appUrl: process.env.NUXT_PUBLIC_APP_URL || "http://localhost:3000",
      environment: process.env.NODE_ENV || "development",
    },
  },

  // Modules
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "nuxt-security",
    "@nuxtjs/web-vitals",
  ],

  // Security headers
  security: {
    headers: {
      contentSecurityPolicy: {
        "base-uri": ["'self'"],
        "font-src": ["'self'", "https:", "data:"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'none'"],
        "img-src": ["'self'", "data:", "https:"],
        "object-src": ["'none'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        "upgrade-insecure-requests": true,
      },
    },
  },

  // Sitemap
  sitemap: {
    hostname: process.env.NUXT_PUBLIC_APP_URL || "http://localhost:3000",
    gzip: true,
    routes: async () => {
      // Динамические маршруты для криптовалют
      const cryptos = await $fetch("/api/crypto/list");
      return cryptos.map(
        (crypto: any) => `/crypto/${crypto.symbol.toLowerCase()}`
      );
    },
  },

  // Robots
  robots: {
    UserAgent: "*",
    Allow: "/",
    Disallow: ["/dashboard", "/trade", "/api"],
    Sitemap: `${process.env.NUXT_PUBLIC_APP_URL}/sitemap.xml`,
  },
});
```

### 🚀 Data Fetching Оптимизация

#### composables/useAsyncSEO.ts

```typescript
import type { CryptoCurrency, MetaData } from "@clh/types";

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  jsonLd: any;
}

export function useAsyncSEO() {
  const { $seoMeta, $jsonLd } = useNuxtApp();
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();

  const generateCryptoSEO = (crypto: CryptoCurrency): SEOData => {
    const title = `${crypto.name} (${crypto.symbol}) Price, Chart & Market Cap`;
    const description = `Get real-time ${crypto.name} price, market cap, trading volume, and price chart. Learn about ${crypto.symbol} cryptocurrency and track its performance.`;
    const keywords = `${crypto.name}, ${crypto.symbol}, cryptocurrency, price, chart, market cap, trading`;
    const ogImage = `${runtimeConfig.public.appUrl}/api/og/crypto/${crypto.symbol.toLowerCase()}`;
    const ogUrl = `${runtimeConfig.public.appUrl}/crypto/${crypto.symbol.toLowerCase()}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      name: crypto.name,
      description: description,
      url: ogUrl,
      image: ogImage,
      provider: {
        "@type": "Organization",
        name: "Crypto Learning Hub",
        url: runtimeConfig.public.appUrl,
      },
      offers: {
        "@type": "Offer",
        price: crypto.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    };

    return {
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogUrl,
      twitterCard: "summary_large_image",
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage,
      jsonLd,
    };
  };

  const generateLearningPageSEO = (lesson: any): SEOData => {
    const title = `${lesson.title} - Crypto Learning Hub`;
    const description =
      lesson.excerpt ||
      `Learn about ${lesson.title} in our comprehensive cryptocurrency education platform.`;
    const keywords = `cryptocurrency, learning, education, ${lesson.tags?.join(", ")}`;
    const ogImage =
      lesson.image ||
      `${runtimeConfig.public.appUrl}/images/default-lesson.jpg`;
    const ogUrl = `${runtimeConfig.public.appUrl}/learn/${lesson.slug}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: lesson.title,
      description: description,
      url: ogUrl,
      image: ogImage,
      provider: {
        "@type": "Organization",
        name: "Crypto Learning Hub",
        url: runtimeConfig.public.appUrl,
      },
      educationalLevel: lesson.difficulty || "Beginner",
      inLanguage: "en",
      isAccessibleForFree: true,
    };

    return {
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogUrl,
      twitterCard: "summary_large_image",
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage,
      jsonLd,
    };
  };

  const applySEO = (seoData: SEOData) => {
    // Set page title
    useHead({
      title: seoData.title,
      meta: [
        { name: "description", content: seoData.description },
        { name: "keywords", content: seoData.keywords },

        // Open Graph
        { property: "og:title", content: seoData.ogTitle },
        { property: "og:description", content: seoData.ogDescription },
        { property: "og:image", content: seoData.ogImage },
        { property: "og:url", content: seoData.ogUrl },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Crypto Learning Hub" },

        // Twitter
        { name: "twitter:card", content: seoData.twitterCard },
        { name: "twitter:title", content: seoData.twitterTitle },
        { name: "twitter:description", content: seoData.twitterDescription },
        { name: "twitter:image", content: seoData.twitterImage },

        // Additional meta
        { name: "robots", content: "index, follow" },
        { name: "author", content: "Crypto Learning Hub" },
        { httpEquiv: "content-language", content: "en" },
      ],
    });

    // Set JSON-LD structured data
    useJsonld(seoData.jsonLd);
  };

  return {
    generateCryptoSEO,
    generateLearningPageSEO,
    applySEO,
  };
}
```

#### pages/crypto/[symbol].vue

```vue
<template>
  <div class="crypto-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="crypto-header">
          <div class="crypto-info">
            <img
              :src="cryptoData.image"
              :alt="`${cryptoData.name} logo`"
              class="crypto-logo"
              loading="eager"
            />
            <div>
              <h1 class="crypto-name">
                {{ cryptoData.name }}
                <span class="crypto-symbol">({{ cryptoData.symbol }})</span>
              </h1>
              <div class="crypto-price">
                ${{ formatPrice(cryptoData.price) }}
                <span
                  class="price-change"
                  :class="{
                    positive: cryptoData.change24h > 0,
                    negative: cryptoData.change24h < 0,
                  }"
                >
                  {{ cryptoData.change24h > 0 ? "+" : ""
                  }}{{ cryptoData.change24h.toFixed(2) }}%
                </span>
              </div>
            </div>
          </div>

          <div class="crypto-actions">
            <LazyTradeButton :symbol="cryptoData.symbol" />
            <LazyWatchlistButton :crypto="cryptoData" />
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="main-content">
      <div class="container">
        <div class="content-grid">
          <!-- Chart Section -->
          <div class="chart-section">
            <LazyAdvancedChart
              :symbol="cryptoData.symbol"
              :height="400"
              class="crypto-chart"
            />
          </div>

          <!-- Stats Section -->
          <div class="stats-section">
            <CryptoStats :crypto="cryptoData" />
          </div>
        </div>

        <!-- Additional Content -->
        <div class="additional-content">
          <LazyMarketData :symbol="cryptoData.symbol" />
          <LazyNewsSection :symbol="cryptoData.symbol" />
          <LazySimilarCryptos :symbol="cryptoData.symbol" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { CryptoCurrency } from "@clh/types";

const route = useRoute();
const { generateCryptoSEO, applySEO } = useAsyncSEO();

// Data fetching with error handling
const { data: cryptoData, error } = await useLazyAsyncData<CryptoCurrency>(
  `crypto-${route.params.symbol}`,
  () => $fetch(`/api/crypto/${route.params.symbol}`),
  {
    key: `crypto-${route.params.symbol}`,
    server: true,
    lazy: false,
    default: () => null,
    transform: (data: any) => ({
      ...data,
      price: parseFloat(data.price),
      change24h: parseFloat(data.change24h),
      volume24h: parseFloat(data.volume24h),
      marketCap: parseFloat(data.marketCap),
    }),
  }
);

// Error handling
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Cryptocurrency ${route.params.symbol} not found`,
  });
}

// SEO optimization
if (cryptoData.value) {
  const seoData = generateCryptoSEO(cryptoData.value);
  applySEO(seoData);
}

// Price formatting utility
const formatPrice = (price: number): string => {
  if (price >= 1) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    return price.toFixed(8);
  }
};

// Page meta for development
definePageMeta({
  layout: "default",
  keepalive: true,
});
</script>

<style scoped>
.crypto-page {
  @apply min-h-screen bg-gray-50 dark:bg-gray-900;
}

.hero-section {
  @apply bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.crypto-header {
  @apply py-8 flex justify-between items-start;
}

.crypto-info {
  @apply flex items-start gap-4;
}

.crypto-logo {
  @apply w-16 h-16 rounded-full;
}

.crypto-name {
  @apply text-3xl font-bold text-gray-900 dark:text-white;
}

.crypto-symbol {
  @apply text-gray-500 dark:text-gray-400 font-normal;
}

.crypto-price {
  @apply text-2xl font-semibold text-gray-900 dark:text-white mt-2;
}

.price-change {
  @apply ml-3 text-lg;
}

.price-change.positive {
  @apply text-green-600;
}

.price-change.negative {
  @apply text-red-600;
}

.crypto-actions {
  @apply flex gap-3;
}

.main-content {
  @apply py-8;
}

.content-grid {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-8;
}

.chart-section {
  @apply lg:col-span-2;
}

.stats-section {
  @apply lg:col-span-1;
}

.additional-content {
  @apply mt-8 space-y-8;
}
</style>
```

### 🔧 Задание 14.2: Performance Optimization

#### Performance Monitoring

```typescript
// plugins/performance.client.ts
export default defineNuxtPlugin(() => {
  if (process.client) {
    // Core Web Vitals monitoring
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getFCP(sendToAnalytics);
      getLCP(sendToAnalytics);
      getTTFB(sendToAnalytics);
    });

    // Custom performance metrics
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "navigation") {
          const navEntry = entry as PerformanceNavigationTiming;

          const metrics = {
            dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
            tcp: navEntry.connectEnd - navEntry.connectStart,
            ssl: navEntry.connectEnd - navEntry.secureConnectionStart,
            ttfb: navEntry.responseStart - navEntry.requestStart,
            download: navEntry.responseEnd - navEntry.responseStart,
            domParse:
              navEntry.domContentLoadedEventStart - navEntry.responseEnd,
            loadComplete: navEntry.loadEventEnd - navEntry.navigationStart,
          };

          sendToAnalytics({
            name: "navigation-timing",
            value: metrics,
          });
        }
      });
    });

    observer.observe({ entryTypes: ["navigation"] });
  }
});

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  console.log("Performance metric:", metric);

  // Example: send to Google Analytics
  if (typeof gtag !== "undefined") {
    gtag("event", metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      custom_parameter: metric.delta,
    });
  }
}
```

#### Image Optimization Component

```vue
<!-- components/OptimizedImage.vue -->
<template>
  <picture v-if="showPicture">
    <source
      v-for="format in supportedFormats"
      :key="format"
      :srcset="generateSrcSet(format)"
      :sizes="sizes"
      :type="`image/${format}`"
    />
    <img
      ref="imgElement"
      :src="fallbackSrc"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      :decoding="decoding"
      :class="imageClasses"
      @load="handleLoad"
      @error="handleError"
    />
  </picture>

  <img
    v-else
    ref="imgElement"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :decoding="decoding"
    :class="imageClasses"
    @load="handleLoad"
    @error="handleError"
  />
</template>

<script setup lang="ts">
interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  quality?: number;
  format?: "webp" | "avif" | "auto";
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  placeholder?: boolean;
  blur?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  quality: 80,
  format: "auto",
  loading: "lazy",
  decoding: "async",
  placeholder: true,
  blur: true,
});

const emit = defineEmits<{
  load: [event: Event];
  error: [event: Event];
}>();

const imgElement = ref<HTMLImageElement>();
const isLoaded = ref(false);
const hasError = ref(false);

// Detect browser support for formats
const supportedFormats = computed(() => {
  if (process.server) return ["webp", "jpg"];

  const formats = [];

  // Check AVIF support
  if (supportsFormat("avif")) {
    formats.push("avif");
  }

  // Check WebP support
  if (supportsFormat("webp")) {
    formats.push("webp");
  }

  // Always include fallback
  formats.push("jpg");

  return formats;
});

const showPicture = computed(() => {
  return props.format === "auto" && supportedFormats.value.length > 1;
});

const fallbackSrc = computed(() => {
  return generateImageUrl(props.src, "jpg");
});

const imageClasses = computed(() => [
  "optimized-image",
  {
    loading: !isLoaded.value && !hasError.value,
    loaded: isLoaded.value,
    error: hasError.value,
    blur: props.blur && !isLoaded.value,
  },
]);

// Generate srcset for responsive images
const generateSrcSet = (format: string): string => {
  const breakpoints = [320, 640, 768, 1024, 1280, 1536];

  return breakpoints
    .map((width) => `${generateImageUrl(props.src, format, width)} ${width}w`)
    .join(", ");
};

const generateImageUrl = (
  src: string,
  format: string,
  width?: number
): string => {
  const params = new URLSearchParams();

  if (width) params.set("w", width.toString());
  if (props.quality) params.set("q", props.quality.toString());
  if (format !== "jpg") params.set("f", format);

  return `${src}?${params.toString()}`;
};

const supportsFormat = (format: string): boolean => {
  if (process.server) return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  try {
    return canvas
      .toDataURL(`image/${format}`)
      .startsWith(`data:image/${format}`);
  } catch {
    return false;
  }
};

const handleLoad = (event: Event) => {
  isLoaded.value = true;
  emit("load", event);
};

const handleError = (event: Event) => {
  hasError.value = true;
  emit("error", event);
};

// Intersection Observer for lazy loading
if (process.client && props.loading === "lazy") {
  const { stop } = useIntersectionObserver(
    imgElement,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        // Image is in viewport, start loading
        stop();
      }
    },
    {
      rootMargin: "50px",
    }
  );
}
</script>

<style scoped>
.optimized-image {
  @apply transition-all duration-300;
}

.optimized-image.loading {
  @apply bg-gray-200 animate-pulse;
}

.optimized-image.blur {
  @apply filter blur-sm;
}

.optimized-image.loaded {
  @apply filter-none;
}

.optimized-image.error {
  @apply bg-gray-300 border border-gray-400;
}
</style>
```

### 📊 Задание 14.3: Кэширование и CDN

#### Cache Strategy Implementation

```typescript
// server/api/crypto/[symbol].ts
export default defineEventHandler(async (event) => {
  const symbol = getRouterParam(event, "symbol");

  if (!symbol) {
    throw createError({
      statusCode: 400,
      statusMessage: "Symbol parameter is required",
    });
  }

  // Set cache headers
  setHeader(event, "Cache-Control", "public, max-age=300, s-maxage=600");
  setHeader(event, "Vary", "Accept-Encoding");

  try {
    // Try to get from cache first
    const cached = await getCachedData(`crypto:${symbol}`);
    if (cached) {
      setHeader(event, "X-Cache", "HIT");
      return cached;
    }

    // Fetch fresh data
    const cryptoData = await fetchCryptoData(symbol);

    // Cache the result
    await setCachedData(`crypto:${symbol}`, cryptoData, 300); // 5 minutes

    setHeader(event, "X-Cache", "MISS");
    return cryptoData;
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: `Cryptocurrency ${symbol} not found`,
    });
  }
});

// Cache utilities
async function getCachedData(key: string) {
  try {
    const redis = useRedis();
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn("Cache read error:", error);
    return null;
  }
}

async function setCachedData(key: string, data: any, ttl: number) {
  try {
    const redis = useRedis();
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.warn("Cache write error:", error);
  }
}

async function fetchCryptoData(symbol: string) {
  // Fetch from external API
  const response = await $fetch(
    `https://api.coingecko.com/api/v3/coins/${symbol}`
  );

  return {
    id: response.id,
    symbol: response.symbol.toUpperCase(),
    name: response.name,
    image: response.image.large,
    price: response.market_data.current_price.usd,
    change24h: response.market_data.price_change_percentage_24h,
    volume24h: response.market_data.total_volume.usd,
    marketCap: response.market_data.market_cap.usd,
    updatedAt: new Date().toISOString(),
  };
}
```

### 📊 Критерии оценки

#### Задание 14.1: SSR Implementation (50 баллов)

- **Отлично (45-50 баллов):**

  - Правильно настроенный hybrid rendering
  - Оптимизированная SEO с structured data
  - Эффективная hydration без ошибок
  - Performance-optimized конфигурация

- **Хорошо (35-44 балла):**

  - Работающий SSR с базовой SEO
  - Корректная hydration
  - Основные meta tags настроены

- **Удовлетворительно (25-34 балла):**

  - SSR работает для основных страниц
  - Базовые meta tags

- **Неудовлетворительно (0-24 балла):**
  - SSR не работает или работает с ошибками
  - Проблемы с hydration

#### Задание 14.2: Performance Optimization (50 баллов)

- **Отлично (45-50 баллов):**

  - Core Web Vitals оптимизированы
  - Эффективное lazy loading
  - Image optimization с modern formats
  - Bundle optimization с code splitting

- **Хорошо (35-44 балла):**

  - Хорошие Core Web Vitals метрики
  - Базовая оптимизация изображений
  - Code splitting настроен

- **Удовлетворительно (25-34 балла):**

  - Приемлемая производительность
  - Минимальная оптимизация

- **Неудовлетворительно (0-24 балла):**
  - Плохие метрики производительности
  - Нет оптимизации

#### Задание 14.3: Caching & CDN (50 баллов)

- **Отлично (45-50 баллов):**

  - Многоуровневое кэширование
  - CDN интеграция
  - Cache invalidation стратегии
  - Performance monitoring

- **Хорошо (35-44 балла):**

  - Базовое кэширование работает
  - Cache headers настроены
  - Минимальная CDN интеграция

- **Удовлетворительно (25-34 балла):**

  - Простое кэширование
  - Основные headers

- **Неудовлетворительно (0-24 балла):**
  - Нет кэширования
  - Проблемы с производительностью

### 🚀 Дополнительные задачи (бонусы)

1. **Service Worker для кэширования** (+20 баллов)
2. **Critical CSS inline** (+15 баллов)
3. **Progressive image loading** (+10 баллов)

### 📚 Материалы для изучения

#### Обязательное чтение:

1. **SSR & Performance:**

   - Nuxt.js SSR Documentation
   - "High Performance Browser Networking"
   - Web.dev Performance guides

2. **SEO:**
   - "SEO for Developers"
   - Google Search Central documentation
   - Structured Data guidelines

### 🎯 Результат этапа

По завершении этого этапа у вас будет:

- ✅ **Production-ready SSR** с оптимизацией
- ✅ **SEO-оптимизированные страницы** с structured data
- ✅ **Высокопроизводительное приложение** с отличными Core Web Vitals
- ✅ **Эффективное кэширование** на всех уровнях
- ✅ **Monitoring и аналитика** производительности
