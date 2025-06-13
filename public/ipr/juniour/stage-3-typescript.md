# Этап 3: TypeScript + Улучшенная архитектура - Технические задания

## Задание 3.1: Миграция на TypeScript

### 🎯 Цель

Перевести существующий JavaScript код на TypeScript с правильной типизацией

### 📋 Требования

#### Функциональные требования:

- [ ] Мигрировать все JS файлы в TS
- [ ] Настроить TypeScript конфигурацию
- [ ] Создать типы для всех данных
- [ ] Добавить интерфейсы для API ответов
- [ ] Настроить сборку с TypeScript

#### Технические требования:

- [ ] Строгая типизация (strict: true)
- [ ] Отсутствие any типов
- [ ] Правильные типы для DOM элементов
- [ ] Generic типы где необходимо
- [ ] Настройка ESLint для TypeScript

### 💡 Подсказки

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Типы для API:**

```typescript
// types/crypto.ts
export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  last_updated: string;
}

export interface CoinGeckoResponse {
  data: CryptoCurrency[];
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
  };
}

export type SortField =
  | "name"
  | "current_price"
  | "price_change_percentage_24h";
export type SortDirection = "asc" | "desc";
export type CurrencyCode = "usd" | "btc" | "eth" | "ada" | "dot";

export interface CalculatorState {
  fromAmount: number;
  fromCurrency: CurrencyCode;
  toAmount: number;
  toCurrency: CurrencyCode;
  rates: Record<CurrencyCode, number>;
}
```

**Типизированные классы:**

```typescript
// utils/api.ts
class CoinGeckoAPI {
  private readonly baseURL = "https://api.coingecko.com/api/v3";
  private readonly cache = new Map<
    string,
    { data: unknown; timestamp: number }
  >();
  private readonly cacheExpiry = 5 * 60 * 1000;

  async fetchCryptoData(): Promise<CryptoCurrency[]> {
    const cacheKey = "crypto-data";
    const cached = this.getFromCache<CryptoCurrency[]>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(
        `${this.baseURL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1`
      );

      if (!response.ok) {
        throw new APIError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data: CryptoCurrency[] = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError("Network error occurred", 0);
    }
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}

class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "APIError";
  }
}
```

### ❓ Вопросы для изучения

1. **Type vs Interface**: Когда использовать type, а когда interface?
2. **Generics**: Что такое дженерики и как их применять?
3. **Utility Types**: Какие встроенные утилитарные типы существуют?
4. **Type Guards**: Как создавать type guards для проверки типов?

### 🔍 Критерии оценки

- [ ] **Типизация** (40): Все данные имеют типы, отсутствие any
- [ ] **Архитектура** (30): Правильная структура типов и интерфейсов
- [ ] **Конфигурация** (20): Настройка TypeScript и инструментов
- [ ] **Безопасность типов** (10): Строгая типизация, обработка ошибок

---

## Задание 3.2: Система классов и ООП

### 🎯 Цель

Создать объектно-ориентированную архитектуру приложения

### 📋 Требования

#### Функциональные требования:

- [ ] Класс Portfolio для управления портфелем
- [ ] Класс CryptoCalculator для расчетов
- [ ] Абстракция для различных источников данных
- [ ] Система событий между компонентами
- [ ] Валидация данных с помощью классов

#### Технические требования:

- [ ] Использование наследования и композиции
- [ ] Инкапсуляция с private/protected полями
- [ ] Статические методы и свойства
- [ ] Декораторы для методов (опционально)
- [ ] Соблюдение SOLID принципов

### 💡 Подсказки

**Абстрактный базовый класс:**

```typescript
// classes/DataSource.ts
abstract class DataSource<T> {
  protected cache = new Map<string, { data: T; timestamp: number }>();
  protected abstract cacheExpiry: number;

  abstract fetchData(): Promise<T>;

  protected getCachedData(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  protected setCachedData(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

// classes/CoinGeckoDataSource.ts
class CoinGeckoDataSource extends DataSource<CryptoCurrency[]> {
  protected cacheExpiry = 5 * 60 * 1000;
  private readonly baseURL = "https://api.coingecko.com/api/v3";

  async fetchData(): Promise<CryptoCurrency[]> {
    const cacheKey = "coingecko-data";
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await fetch(
      `${this.baseURL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1`
    );
    const data: CryptoCurrency[] = await response.json();

    this.setCachedData(cacheKey, data);
    return data;
  }
}
```

**Класс Portfolio:**

```typescript
// classes/Portfolio.ts
interface PortfolioItem {
  id: string;
  symbol: string;
  amount: number;
  purchasePrice: number;
  currentPrice: number;
}

interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
}

class Portfolio {
  private items: Map<string, PortfolioItem> = new Map();
  private eventEmitter = new EventTarget();

  addItem(item: Omit<PortfolioItem, "currentPrice">): void {
    const portfolioItem: PortfolioItem = {
      ...item,
      currentPrice: 0, // Будет обновлено при следующем обновлении цен
    };

    this.items.set(item.id, portfolioItem);
    this.emitChange();
  }

  removeItem(id: string): boolean {
    const removed = this.items.delete(id);
    if (removed) {
      this.emitChange();
    }
    return removed;
  }

  updatePrices(prices: Record<string, number>): void {
    let hasChanges = false;

    for (const [id, item] of this.items.entries()) {
      if (prices[item.symbol] !== undefined) {
        item.currentPrice = prices[item.symbol];
        hasChanges = true;
      }
    }

    if (hasChanges) {
      this.emitChange();
    }
  }

  getItems(): PortfolioItem[] {
    return Array.from(this.items.values());
  }

  getSummary(): PortfolioSummary {
    let totalValue = 0;
    let totalInvested = 0;

    for (const item of this.items.values()) {
      totalValue += item.amount * item.currentPrice;
      totalInvested += item.amount * item.purchasePrice;
    }

    const totalGainLoss = totalValue - totalInvested;
    const totalGainLossPercentage =
      totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    return {
      totalValue,
      totalInvested,
      totalGainLoss,
      totalGainLossPercentage,
    };
  }

  private emitChange(): void {
    this.eventEmitter.dispatchEvent(
      new CustomEvent("change", {
        detail: { portfolio: this },
      })
    );
  }

  addEventListener(type: "change", listener: EventListener): void {
    this.eventEmitter.addEventListener(type, listener);
  }

  removeEventListener(type: "change", listener: EventListener): void {
    this.eventEmitter.removeEventListener(type, listener);
  }
}
```

**Валидация:**

```typescript
// classes/Validator.ts
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

class PortfolioValidator {
  static validateItem(
    item: Partial<PortfolioItem>
  ): asserts item is PortfolioItem {
    if (!item.id || typeof item.id !== "string") {
      throw new ValidationError("ID обязателен и должен быть строкой", "id");
    }

    if (!item.symbol || typeof item.symbol !== "string") {
      throw new ValidationError(
        "Символ обязателен и должен быть строкой",
        "symbol"
      );
    }

    if (typeof item.amount !== "number" || item.amount <= 0) {
      throw new ValidationError(
        "Количество должно быть положительным числом",
        "amount"
      );
    }

    if (typeof item.purchasePrice !== "number" || item.purchasePrice <= 0) {
      throw new ValidationError(
        "Цена покупки должна быть положительным числом",
        "purchasePrice"
      );
    }
  }
}
```

### ❓ Вопросы для изучения

1. **Принципы ООП**: Объясните принципы SOLID и как их применять?
2. **Наследование vs Композиция**: Когда использовать наследование, а когда композицию?
3. **Модификаторы доступа**: Чем отличаются public, private, protected в TypeScript?
4. **Система событий**: Как реализовать систему событий между классами?

---

## Задание 3.3: Система управления состоянием

### 🎯 Цель

Создать простую систему управления состоянием приложения

### 📋 Требования

#### Функциональные требования:

- [ ] Централизованное хранение состояния
- [ ] Подписка на изменения состояния
- [ ] Immutable обновления состояния
- [ ] Middleware для логирования
- [ ] Persist состояния в localStorage

#### Технические требования:

- [ ] Типизированное состояние
- [ ] Actions для изменения состояния
- [ ] Selectors для получения данных
- [ ] Async actions для API вызовов

### 💡 Подсказки

**State Store:**

```typescript
// store/types.ts
interface AppState {
  crypto: {
    list: CryptoCurrency[];
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
  };
  portfolio: {
    items: PortfolioItem[];
    summary: PortfolioSummary | null;
  };
  ui: {
    theme: "light" | "dark";
    modal: {
      isOpen: boolean;
      content: string | null;
    };
  };
}

type StateListener<T = AppState> = (state: T) => void;
type StateSelector<T> = (state: AppState) => T;

// store/Store.ts
class Store<TState = AppState> {
  private state: TState;
  private listeners: Set<StateListener<TState>> = new Set();
  private middleware: Array<(action: Action, state: TState) => void> = [];

  constructor(initialState: TState) {
    this.state = initialState;
  }

  getState(): TState {
    return this.state;
  }

  subscribe(listener: StateListener<TState>): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  dispatch(action: Action): void {
    // Применяем middleware
    this.middleware.forEach((mw) => mw(action, this.state));

    // Обновляем состояние
    this.state = this.reducer(this.state, action);

    // Уведомляем подписчиков
    this.listeners.forEach((listener) => listener(this.state));
  }

  addMiddleware(middleware: (action: Action, state: TState) => void): void {
    this.middleware.push(middleware);
  }

  select<T>(selector: StateSelector<T>): T {
    return selector(this.state as AppState);
  }

  private reducer(state: TState, action: Action): TState {
    // Реализация reducer логики
    return state;
  }
}
```

**Actions:**

```typescript
// store/actions.ts
interface Action {
  type: string;
  payload?: unknown;
}

// Crypto actions
const cryptoActions = {
  FETCH_CRYPTO_START: "FETCH_CRYPTO_START",
  FETCH_CRYPTO_SUCCESS: "FETCH_CRYPTO_SUCCESS",
  FETCH_CRYPTO_ERROR: "FETCH_CRYPTO_ERROR",
} as const;

interface FetchCryptoStartAction {
  type: typeof cryptoActions.FETCH_CRYPTO_START;
}

interface FetchCryptoSuccessAction {
  type: typeof cryptoActions.FETCH_CRYPTO_SUCCESS;
  payload: CryptoCurrency[];
}

interface FetchCryptoErrorAction {
  type: typeof cryptoActions.FETCH_CRYPTO_ERROR;
  payload: string;
}

type CryptoAction =
  | FetchCryptoStartAction
  | FetchCryptoSuccessAction
  | FetchCryptoErrorAction;

// Action creators
const createCryptoActions = (store: Store) => ({
  fetchCrypto: async (): Promise<void> => {
    store.dispatch({ type: cryptoActions.FETCH_CRYPTO_START });

    try {
      const api = new CoinGeckoDataSource();
      const data = await api.fetchData();

      store.dispatch({
        type: cryptoActions.FETCH_CRYPTO_SUCCESS,
        payload: data,
      });
    } catch (error) {
      store.dispatch({
        type: cryptoActions.FETCH_CRYPTO_ERROR,
        payload: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});
```

### ❓ Вопросы для изучения

1. **State Management**: Зачем нужно централизованное управление состоянием?
2. **Immutability**: Почему важна неизменяемость состояния?
3. **Observer Pattern**: Как работает паттерн Observer в системе подписок?
4. **Middleware**: Что такое middleware и как его использовать?

---

## 📊 Общая оценка этапа 3

| Критерий              | Баллы   | Описание                              |
| --------------------- | ------- | ------------------------------------- |
| TypeScript типизация  | 35      | Правильные типы, интерфейсы, generics |
| ООП архитектура       | 30      | Классы, наследование, инкапсуляция    |
| Управление состоянием | 25      | Store, actions, selectors             |
| Качество кода         | 10      | Clean code, SOLID принципы            |
| **Итого**             | **100** | Минимум 70 для перехода к этапу 4     |

### 🎯 Следующий этап

После завершения этапа 3 переходим к **Этапу 4: Vue.js Компоненты**.
