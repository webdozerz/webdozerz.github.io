# 🧪 Этап 18: Testing & Automation - Комплексное тестирование и автоматизация

## 📋 Общая информация

**Продолжительность:** 3 недели  
**Сложность:** High  
**Предварительные требования:** Завершенные этапы 11-17

## 🎯 Цели этапа

### Основные задачи:

- ✅ Настроить полное покрытие unit тестами (минимум 80%)
- ✅ Создать комплексные E2E тесты для критических пользовательских сценариев
- ✅ Внедрить интеграционные тесты для API и блокчейн функций
- ✅ Настроить автоматизированное тестирование в CI/CD
- ✅ Создать тесты производительности и нагрузочные тесты
- ✅ Внедрить визуальное тестирование и тестирование доступности
- ✅ Настроить покрытие кода и качественные метрики

## 🛠️ Технологический стек

### Testing Frameworks

- **Vitest** - быстрые unit тесты
- **Vue Test Utils** - тестирование Vue компонентов
- **Playwright** - современный E2E тестинг
- **Storybook** - тестирование компонентов в изоляции

### Automation & CI/CD

- **GitHub Actions** - CI/CD пайплайны
- **Codecov** - анализ покрытия кода
- **Lighthouse CI** - автоматизированные аудиты производительности
- **Docker** - контейнеризация тестовой среды

### Performance & Load Testing

- **K6** - нагрузочное тестирование
- **Puppeteer** - автоматизация браузера
- **Web Vitals** - метрики производительности

## 📚 Функциональные требования

### 🔧 18.1 Unit Testing Infrastructure

```typescript
// tests/setup.ts
import { vi } from "vitest";
import { config } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

// Mock Web3 providers
vi.mock("@/composables/useWeb3", () => ({
  useWeb3: () => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    account: ref(null),
    isConnected: ref(false),
  }),
}));

// Global test configuration
config.global.plugins = [createTestingPinia({ createSpy: vi.fn })];
```

### 🧪 18.2 Component Testing Strategy

```typescript
// tests/components/CryptoCard.test.ts
import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import CryptoCard from "@/components/CryptoCard.vue";

describe("CryptoCard", () => {
  const mockCrypto = {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    current_price: 45000,
    price_change_percentage_24h: 2.5,
  };

  it("renders crypto information correctly", () => {
    const wrapper = mount(CryptoCard, {
      props: { crypto: mockCrypto },
    });

    expect(wrapper.find('[data-testid="crypto-name"]').text()).toBe("Bitcoin");
    expect(wrapper.find('[data-testid="crypto-price"]').text()).toContain(
      "$45,000"
    );
  });

  it("displays price change with correct styling", () => {
    const wrapper = mount(CryptoCard, {
      props: { crypto: mockCrypto },
    });

    const priceChange = wrapper.find('[data-testid="price-change"]');
    expect(priceChange.classes()).toContain("text-green-500");
  });

  it("emits favorite event when star is clicked", async () => {
    const wrapper = mount(CryptoCard, {
      props: { crypto: mockCrypto },
    });

    await wrapper.find('[data-testid="favorite-btn"]').trigger("click");
    expect(wrapper.emitted("favorite")).toBeTruthy();
    expect(wrapper.emitted("favorite")?.[0]).toEqual([mockCrypto.id]);
  });
});
```

### 🔄 18.3 Composables Testing

```typescript
// tests/composables/useCryptoData.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCryptoData } from "@/composables/useCryptoData";

// Mock fetch API
global.fetch = vi.fn();

describe("useCryptoData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches crypto data successfully", async () => {
    const mockData = [{ id: "bitcoin", name: "Bitcoin", current_price: 45000 }];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { cryptos, loading, error, fetchCryptos } = useCryptoData();

    await fetchCryptos();

    expect(loading.value).toBe(false);
    expect(error.value).toBe(null);
    expect(cryptos.value).toEqual(mockData);
  });

  it("handles fetch errors correctly", async () => {
    (fetch as any).mockRejectedValueOnce(new Error("Network error"));

    const { error, fetchCryptos } = useCryptoData();

    await fetchCryptos();

    expect(error.value).toBe("Network error");
  });
});
```

### 🌐 18.4 E2E Testing Scenarios

```typescript
// tests/e2e/crypto-trading.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Crypto Trading Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Mock MetaMask
    await page.addInitScript(() => {
      window.ethereum = {
        request: async () => ["0x123..."],
        on: () => {},
        removeListener: () => {},
      };
    });
  });

  test("complete trading flow", async ({ page }) => {
    // Connect wallet
    await page.click('[data-testid="connect-wallet"]');
    await expect(page.locator('[data-testid="wallet-address"]')).toBeVisible();

    // Navigate to trading
    await page.click('[data-testid="trading-nav"]');
    await expect(page).toHaveURL(/.*trading/);

    // Select trading pair
    await page.selectOption('[data-testid="pair-select"]', "BTC/USDT");

    // Enter trade amount
    await page.fill('[data-testid="amount-input"]', "0.01");

    // Place buy order
    await page.click('[data-testid="buy-button"]');

    // Confirm transaction
    await page.click('[data-testid="confirm-transaction"]');

    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test("portfolio tracking", async ({ page }) => {
    await page.goto("/portfolio");

    // Check portfolio components load
    await expect(page.locator('[data-testid="total-balance"]')).toBeVisible();
    await expect(page.locator('[data-testid="asset-list"]')).toBeVisible();

    // Test filtering
    await page.fill('[data-testid="search-assets"]', "BTC");
    await expect(page.locator('[data-testid="asset-item"]')).toHaveCount(1);
  });
});
```

### 🔗 18.5 API Integration Testing

```typescript
// tests/integration/api.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { rest } from "msw";

const server = setupServer(
  rest.get("/api/crypto/prices", (req, res, ctx) => {
    return res(ctx.json([{ id: "bitcoin", current_price: 45000 }]));
  }),

  rest.post("/api/trading/order", (req, res, ctx) => {
    return res(
      ctx.json({
        orderId: "123",
        status: "pending",
      })
    );
  })
);

describe("API Integration", () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  it("integrates with crypto pricing API", async () => {
    const response = await fetch("/api/crypto/prices");
    const data = await response.json();

    expect(data).toHaveLength(1);
    expect(data[0].id).toBe("bitcoin");
  });

  it("handles trading orders", async () => {
    const order = {
      pair: "BTC/USDT",
      amount: 0.01,
      type: "buy",
    };

    const response = await fetch("/api/trading/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    const result = await response.json();
    expect(result.orderId).toBeDefined();
    expect(result.status).toBe("pending");
  });
});
```

### ⚡ 18.6 Performance Testing

```typescript
// tests/performance/load-test.js
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "2m", target: 100 }, // Ramp up
    { duration: "5m", target: 100 }, // Stay at 100 users
    { duration: "2m", target: 200 }, // Ramp up to 200
    { duration: "5m", target: 200 }, // Stay at 200
    { duration: "2m", target: 0 }, // Ramp down
  ],
};

export default function () {
  // Test homepage
  let response = http.get("https://crypto-learning-hub.vercel.app/");
  check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });

  // Test API endpoints
  response = http.get(
    "https://crypto-learning-hub.vercel.app/api/crypto/prices"
  );
  check(response, {
    "API status is 200": (r) => r.status === 200,
    "API response time < 200ms": (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

### 📊 18.7 Visual Regression Testing

```typescript
// tests/visual/visual-regression.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test("homepage visual consistency", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Screenshot full page
    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("trading interface components", async ({ page }) => {
    await page.goto("/trading");
    await page.waitForSelector('[data-testid="trading-chart"]');

    // Screenshot trading interface
    await expect(
      page.locator('[data-testid="trading-interface"]')
    ).toHaveScreenshot("trading-interface.png");
  });

  test("responsive design on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(page).toHaveScreenshot("mobile-homepage.png", {
      fullPage: true,
    });
  });
});
```

## 🚀 Технические требования

### 📋 18.1 Test Configuration Setup

```javascript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: ["node_modules/", "tests/", "**/*.d.ts", "**/*.config.*"],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
```

### 🎭 18.2 Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["json", { outputFile: "test-results.json" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

### 🔄 18.3 CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Testing Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: "./lighthouserc.js"
          uploadArtifacts: true

      - name: Run K6 load tests
        uses: grafana/k6-action@v0.2.0
        with:
          filename: tests/performance/load-test.js
```

## 🎯 Критерии оценки

### ⭐ Обязательные требования (100 баллов)

1. **Unit Testing (25 баллов)**

   - Покрытие кода минимум 80%
   - Тесты для всех компонентов
   - Тесты для composables
   - Мокирование внешних зависимостей

2. **E2E Testing (25 баллов)**

   - Критические пользовательские сценарии
   - Кроссбраузерное тестирование
   - Мобильное тестирование
   - Автоматизированные проверки

3. **Integration Testing (20 баллов)**

   - API интеграционные тесты
   - Блокчейн интеграция тесты
   - Тестирование состояния приложения
   - Мокирование внешних сервисов

4. **CI/CD Automation (15 баллов)**

   - Автоматический запуск тестов
   - Отчеты о покрытии
   - Интеграция с GitHub Actions
   - Автоматические проверки качества

5. **Performance Testing (15 баллов)**
   - Нагрузочное тестирование
   - Lighthouse аудиты
   - Web Vitals мониторинг
   - Оптимизация по результатам

### 🚀 Дополнительные задания (50 баллов)

1. **Visual Regression Testing (15 баллов)**

   - Автоматические скриншот тесты
   - Сравнение UI изменений
   - Responsive design проверки

2. **Accessibility Testing (10 баллов)**

   - Автоматизированные a11y тесты
   - Screen reader совместимость
   - Keyboard navigation тесты

3. **Security Testing (15 баллов)**

   - Автоматическое сканирование уязвимостей
   - OWASP проверки
   - Dependency security audit

4. **Test Data Management (10 баллов)**
   - Фикстуры и фабрики
   - Test databases
   - Data seeding стратегии

## 📊 Процесс выполнения

### Неделя 1: Unit & Component Testing

- Настройка Vitest и Vue Test Utils
- Написание unit тестов для компонентов
- Тестирование composables и utils
- Настройка покрытия кода

### Неделя 2: E2E & Integration Testing

- Настройка Playwright
- Создание E2E тест сценариев
- API интеграционные тесты
- Кроссбраузерное тестирование

### Неделя 3: Automation & Performance

- Настройка CI/CD пайплайнов
- Performance и load testing
- Visual regression тесты
- Финальная оптимизация

## 🔍 Вопросы для изучения

1. **Testing Strategy:**

   - Какие типы тестов наиболее важны для frontend приложений?
   - Как правильно структурировать тестовую пирамиду?

2. **Mocking & Stubbing:**

   - Когда использовать моки, а когда реальные зависимости?
   - Как тестировать асинхронный код?

3. **Performance Testing:**

   - Какие метрики производительности наиболее критичны?
   - Как интерпретировать результаты нагрузочных тестов?

4. **CI/CD Integration:**
   - Как балансировать скорость и качество в пайплайнах?
   - Когда блокировать deploy из-за упавших тестов?

## 📈 Ожидаемые результаты

По завершении этапа вы получите:

- 🧪 **Полное покрытие тестами** - надежность и качество кода
- 🔄 **Автоматизированное тестирование** - CI/CD интеграция
- ⚡ **Performance мониторинг** - контроль производительности
- 🎯 **Quality Gates** - автоматические проверки качества
- 📊 **Метрики и аналитика** - данные для принятия решений

Этот этап обеспечивает enterprise-уровень качества и надежности вашего приложения через комплексное тестирование и автоматизацию.
