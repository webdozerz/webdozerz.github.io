# Этап 5: Nuxt.js + Роутинг - Технические задания

## Задание 5.1: Миграция на Nuxt.js

### 🎯 Цель

Перевести Vue.js проект на Nuxt.js с SSR и файловым роутингом

### 📋 Требования

#### Функциональные требования:

- [ ] Настроить Nuxt.js проект
- [ ] Мигрировать компоненты в Nuxt структуру
- [ ] Создать страницы с файловым роутингом
- [ ] Настроить layouts для разных типов страниц
- [ ] Добавить middleware для защищенных маршрутов

#### Технические требования:

- [ ] SSR для улучшения SEO
- [ ] Автоимпорт компонентов и композаблов
- [ ] TypeScript настройка для Nuxt
- [ ] Оптимизация bundle размера

### 💡 Подсказки

**nuxt.config.ts:**

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  css: ["~/assets/scss/main.scss"],

  app: {
    head: {
      title: "Crypto Learning Hub",
      meta: [
        {
          name: "description",
          content: "Learn about cryptocurrency and blockchain technology",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },

  runtimeConfig: {
    apiSecret: "", // Private key (server-side only)
    public: {
      apiBase: process.env.API_BASE_URL || "https://api.coingecko.com/api/v3",
    },
  },

  nitro: {
    compressPublicAssets: true,
  },
});
```

**Файловая структура страниц:**

```
pages/
├── index.vue                    # /
├── about.vue                    # /about
├── crypto/
│   ├── index.vue               # /crypto
│   ├── [id].vue                # /crypto/bitcoin
│   └── compare.vue             # /crypto/compare
├── portfolio/
│   ├── index.vue               # /portfolio
│   └── analytics.vue           # /portfolio/analytics
└── auth/
    ├── login.vue               # /auth/login
    └── register.vue            # /auth/register
```

**Layout структура:**

```vue
<!-- layouts/default.vue -->
<template>
  <div class="layout">
    <AppHeader />

    <main class="layout__main">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout__main {
  flex: 1;
  padding: 2rem;
}
</style>
```

**Страница с параметрами:**

```vue
<!-- pages/crypto/[id].vue -->
<script setup lang="ts">
interface CryptoDetailPageData {
  crypto: CryptoCurrency;
  priceHistory: PriceHistoryItem[];
  marketData: MarketData;
}

const route = useRoute();
const cryptoId = route.params.id as string;

// Server-side data fetching
const {
  data: cryptoData,
  pending,
  error,
} = await useFetch<CryptoDetailPageData>(`/api/crypto/${cryptoId}`, {
  key: `crypto-${cryptoId}`,
  server: true,
});

// SEO meta tags
useSeoMeta({
  title: () =>
    cryptoData.value
      ? `${cryptoData.value.crypto.name} - Crypto Learning Hub`
      : "Loading...",
  description: () =>
    cryptoData.value
      ? `Learn about ${cryptoData.value.crypto.name} (${cryptoData.value.crypto.symbol.toUpperCase()}). Current price: $${cryptoData.value.crypto.current_price}`
      : "Loading cryptocurrency information...",
  ogTitle: () => cryptoData.value?.crypto.name,
  ogDescription: () =>
    `Current price: $${cryptoData.value?.crypto.current_price}`,
  ogImage: () => cryptoData.value?.crypto.image,
});

// Error handling
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Cryptocurrency not found",
  });
}

// Breadcrumbs
const breadcrumbs = computed(() => [
  { name: "Home", path: "/" },
  { name: "Cryptocurrencies", path: "/crypto" },
  { name: cryptoData.value?.crypto.name || "Loading...", path: route.path },
]);
</script>

<template>
  <div class="crypto-detail">
    <div v-if="pending" class="crypto-detail__loading">
      <BaseSpinner size="large" />
      <p>Loading cryptocurrency information...</p>
    </div>

    <div v-else-if="cryptoData" class="crypto-detail__content">
      <BreadcrumbNavigation :items="breadcrumbs" />

      <CryptoDetailHeader :crypto="cryptoData.crypto" />

      <div class="crypto-detail__grid">
        <CryptoPriceChart
          :price-history="cryptoData.priceHistory"
          class="crypto-detail__chart"
        />

        <CryptoMarketData
          :market-data="cryptoData.marketData"
          class="crypto-detail__market"
        />
      </div>

      <CryptoDescription :crypto="cryptoData.crypto" />
    </div>
  </div>
</template>
```

### ❓ Вопросы для изучения

1. **SSR vs SPA**: В чем различия и когда использовать каждый подход?
2. **File-based Routing**: Как работает файловый роутинг в Nuxt?
3. **Data Fetching**: Чем отличаются useFetch, useAsyncData, $fetch?
4. **SEO**: Как оптимизировать Nuxt приложение для поисковых систем?

### 🔍 Критерии оценки

- [ ] **Nuxt настройка** (25): Правильная конфигурация проекта
- [ ] **Роутинг** (25): Файловая структура, динамические маршруты
- [ ] **SSR** (25): Серверный рендеринг, SEO оптимизация
- [ ] **Data Fetching** (25): Правильное использование useFetch

---

## Задание 5.2: Серверные API маршруты

### 🎯 Цель

Создать API эндпоинты на сервере Nuxt

### 📋 Требования

#### Функциональные требования:

- [ ] API маршруты для криптовалют
- [ ] Маршруты для портфолио операций
- [ ] Аутентификация API
- [ ] Кэширование ответов
- [ ] Обработка ошибок

#### Технические требования:

- [ ] RESTful API дизайн
- [ ] Валидация входящих данных
- [ ] Rate limiting
- [ ] CORS настройка
- [ ] API документация

### 💡 Подсказки

**API маршрут для криптовалют:**

```typescript
// server/api/crypto/index.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { page = 1, limit = 10, sort = "market_cap_desc" } = query;

  try {
    // Кэширование
    const cacheKey = `crypto-list-${page}-${limit}-${sort}`;
    const cached = await storage.getItem(cacheKey);

    if (cached) {
      return cached;
    }

    // Fetch from external API
    const response = await $fetch<CryptoCurrency[]>(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        query: {
          vs_currency: "usd",
          order: sort,
          per_page: limit,
          page,
          sparkline: false,
        },
      }
    );

    // Transform data
    const transformedData = response.map((crypto) => ({
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      image: crypto.image,
      current_price: crypto.current_price,
      price_change_percentage_24h: crypto.price_change_percentage_24h,
      market_cap: crypto.market_cap,
      total_volume: crypto.total_volume,
    }));

    // Cache for 5 minutes
    await storage.setItem(cacheKey, transformedData, { ttl: 300 });

    return transformedData;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch cryptocurrency data",
    });
  }
});
```

**API маршрут с параметрами:**

```typescript
// server/api/crypto/[id].get.ts
export default defineEventHandler(async (event) => {
  const cryptoId = getRouterParam(event, "id");

  if (!cryptoId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cryptocurrency ID is required",
    });
  }

  try {
    const [cryptoData, priceHistory] = await Promise.all([
      $fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}`),
      $fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`,
        {
          query: { vs_currency: "usd", days: 30 },
        }
      ),
    ]);

    return {
      crypto: {
        id: cryptoData.id,
        symbol: cryptoData.symbol,
        name: cryptoData.name,
        description: cryptoData.description?.en,
        image: cryptoData.image?.large,
        current_price: cryptoData.market_data?.current_price?.usd,
        market_cap: cryptoData.market_data?.market_cap?.usd,
        total_volume: cryptoData.market_data?.total_volume?.usd,
        price_change_percentage_24h:
          cryptoData.market_data?.price_change_percentage_24h,
      },
      priceHistory: priceHistory.prices.map(
        ([timestamp, price]: [number, number]) => ({
          timestamp,
          price,
        })
      ),
      marketData: {
        marketCap: cryptoData.market_data?.market_cap?.usd,
        volume24h: cryptoData.market_data?.total_volume?.usd,
        circulatingSupply: cryptoData.market_data?.circulating_supply,
        maxSupply: cryptoData.market_data?.max_supply,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Cryptocurrency not found",
    });
  }
});
```

**Middleware для аутентификации:**

```typescript
// server/api/portfolio/index.post.ts
export default defineEventHandler(async (event) => {
  // Проверка аутентификации
  const token =
    getCookie(event, "auth-token") || getHeader(event, "authorization");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  // Валидация токена
  const user = await validateAuthToken(token);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid token",
    });
  }

  // Валидация тела запроса
  const body = await readBody(event);
  const validationResult = portfolioItemSchema.safeParse(body);

  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request data",
      data: validationResult.error.issues,
    });
  }

  try {
    // Создание записи в портфолио
    const portfolioItem = await createPortfolioItem(
      user.id,
      validationResult.data
    );

    return {
      success: true,
      data: portfolioItem,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create portfolio item",
    });
  }
});
```

### ❓ Вопросы для изучения

1. **Server Routes**: Как организовать серверные маршруты в Nuxt?
2. **Caching**: Какие стратегии кэширования доступны?
3. **Validation**: Как валидировать данные на сервере?
4. **Error Handling**: Как правильно обрабатывать ошибки в API?

---

## Задание 5.3: Middleware и навигационные хуки

### 🎯 Цель

Реализовать middleware для контроля доступа и навигации

### 📋 Требования

#### Функциональные требования:

- [ ] Auth middleware для защищенных страниц
- [ ] Guest middleware для гостевых страниц
- [ ] Admin middleware для административных функций
- [ ] Loading состояния при навигации
- [ ] Breadcrumbs навигация

#### Технические требования:

- [ ] Типизированные middleware
- [ ] Redirect логика
- [ ] Глобальные и именованные middleware
- [ ] Обработка ошибок навигации

### 💡 Подсказки

**Auth middleware:**

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated.value) {
    return navigateTo("/auth/login", {
      query: { redirect: to.fullPath },
    });
  }
});
```

**Композабл для аутентификации:**

```typescript
// composables/useAuth.ts
interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export const useAuth = () => {
  const user = useState<User | null>("auth.user", () => null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  const login = async (credentials: LoginCredentials) => {
    const { data } = await $fetch<{ user: User; token: string }>(
      "/api/auth/login",
      {
        method: "POST",
        body: credentials,
      }
    );

    user.value = data.user;

    // Set auth cookie
    const authCookie = useCookie("auth-token", {
      default: () => "",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    authCookie.value = data.token;

    return data.user;
  };

  const logout = async () => {
    await $fetch("/api/auth/logout", { method: "POST" });

    user.value = null;

    const authCookie = useCookie("auth-token");
    authCookie.value = "";

    await navigateTo("/auth/login");
  };

  const checkAuth = async () => {
    try {
      const data = await $fetch<{ user: User }>("/api/auth/me");
      user.value = data.user;
    } catch (error) {
      user.value = null;
    }
  };

  return {
    user: readonly(user),
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuth,
  };
};
```

**Plugin для инициализации аутентификации:**

```typescript
// plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
  const { checkAuth } = useAuth();

  // Check authentication status on app initialization
  await checkAuth();
});
```

### ❓ Вопросы для изучения

1. **Middleware Types**: Какие типы middleware существуют в Nuxt?
2. **Navigation Guards**: Как контролировать навигацию в приложении?
3. **State Management**: Как управлять глобальным состоянием в Nuxt?
4. **Cookies**: Как работать с cookies в Nuxt для аутентификации?

---

## 📊 Общая оценка этапа 5

| Критерий            | Баллы   | Описание                           |
| ------------------- | ------- | ---------------------------------- |
| Nuxt.js архитектура | 30      | Layouts, pages, роутинг            |
| Server API          | 25      | API маршруты, обработка данных     |
| Middleware          | 25      | Аутентификация, навигационные хуки |
| SSR/SEO             | 20      | Серверный рендеринг, оптимизация   |
| **Итого**           | **100** | Минимум 70 для перехода к этапу 6  |

### 🎯 Следующий этап

После завершения этапа 5 переходим к **Этапу 6: API + HTTP клиент**.
