# Этап 11: Продвинутый ТайпСкрипт - Детальные задания

## Задание 11.1: Система продвинутых типов

### 🎯 Цель

Создать комплексную систему типов для Crypto Learning Hub с использованием продвинутых возможностей ТайпСкрипт

### 📋 Требования

#### Функциональные требования:

- [ ] Система обобщенных типов для ответов API
- [ ] Утилитарные типы для преобразования данных
- [ ] Условные типы для динамической типизации
- [ ] Отображаемые типы для создания производных типов
- [ ] Шаблонные литеральные типы для строковых манипуляций

#### Технические требования:

- [ ] TypeScript 5.0+ со строгим режимом
- [ ] Полное покрытие типами всех конечных точек API
- [ ] Type guards для проверок во время выполнения
- [ ] Декораторы для метаданных классов
- [ ] Модульная система типов

#### Критерии качества:

- [ ] Нулевое использование `any` - 100% типизация
- [ ] Безопасность типов на уровне компиляции
- [ ] Читаемость и переиспользуемость типов
- [ ] Производительность компиляции

### 💡 Подсказки

**Базовая структура типов:**

```typescript
// types/api.ts
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

// Условные типы
export type ResponseType<T> =
  T extends Array<infer U> ? PaginatedResponse<U> : APIResponse<T>;

// Утилитарные типы для криптовалют
export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  lastUpdated: string;
}

export type CryptoKeys = keyof CryptoCurrency;
export type CryptoPrice = Pick<
  CryptoCurrency,
  "currentPrice" | "priceChange24h"
>;
export type CryptoInfo = Omit<CryptoCurrency, "currentPrice" | "marketCap">;

// Шаблонные литеральные типы
export type EventType =
  | "price_update"
  | "order_filled"
  | "transaction_confirmed";
export type EventHandler<T extends EventType> = `handle${Capitalize<T>}`;

// Отображаемые типы
export type Optional<T> = {
  [P in keyof T]?: T[P];
};

export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

**Обобщенные классы и интерфейсы:**

```typescript
// services/api-client.ts
export interface Repository<T, K = string> {
  findById(id: K): Promise<T | null>;
  findAll(params?: QueryParams): Promise<T[]>;
  create(entity: Omit<T, "id">): Promise<T>;
  update(id: K, entity: Partial<T>): Promise<T>;
  delete(id: K): Promise<boolean>;
}

export class BaseRepository<T extends { id: string }> implements Repository<T> {
  constructor(private endpoint: string) {}

  async findById(id: string): Promise<T | null> {
    const response = await fetch(`${this.endpoint}/${id}`);
    return response.json();
  }

  // Остальные методы...
}

// Специализированные репозитории
export class CryptoRepository extends BaseRepository<CryptoCurrency> {
  constructor() {
    super("/api/crypto");
  }

  async getBySymbol(symbol: string): Promise<CryptoCurrency | null> {
    // Кастомная логика
  }
}
```

**Декораторы для метаданных:**

```typescript
// decorators/cache.ts
export function Cache(ttl: number = 300) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      private static cache = new Map<string, { data: any; expiry: number }>();

      async getData(key: string): Promise<any> {
        const cached = (constructor as any).cache.get(key);
        if (cached && cached.expiry > Date.now()) {
          return cached.data;
        }

        const data = await super.getData?.(key);
        (constructor as any).cache.set(key, {
          data,
          expiry: Date.now() + ttl * 1000,
        });
        return data;
      }
    };
  };
}

// decorators/validate.ts
export function Validate<T>(schema: (value: any) => value is T) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const [input] = args;
      if (!schema(input)) {
        throw new Error(`Validation failed for ${propertyKey}`);
      }
      return originalMethod.apply(this, args);
    };
  };
}

// Использование декораторов
@Cache(600)
export class CryptoPriceService {
  @Validate(isCryptoCurrency)
  async getPrice(crypto: CryptoCurrency): Promise<number> {
    // Логика получения цены
  }
}
```

### ❓ Вопросы для изучения

#### Теоретические вопросы:

1. **Generic Types**: В чем разница между `T extends string` и `T = string`? Когда использовать каждый подход?
2. **Utility Types**: Объясните разницу между `Pick`, `Omit`, `Partial` и `Required`. Приведите примеры использования.
3. **Conditional Types**: Как работает `infer` в conditional types? Когда это полезно?

#### Практические вопросы:

1. **Type Guards**: Как создать type guard для сложного объекта с вложенными структурами?
2. **Mapped Types**: Как создать mapped type, который делает все свойства объекта optional, кроме определенных?
3. **Декораторы**: В чем преимущества использования декораторов для метаданных в сравнении с обычными функциями?

### 🔍 Критерии оценки

#### TypeScript экспертиза (40 баллов):

- [ ] **Generic Types** (10): Правильное использование дженериков с constraints
- [ ] **Utility Types** (10): Эффективное применение встроенных и кастомных utility types
- [ ] **Conditional Types** (10): Создание сложных conditional types с infer
- [ ] **Mapped Types** (10): Продвинутые mapped types для трансформации

#### Архитектура типов (35 баллов):

- [ ] **Модульность** (10): Логичная организация типов по модулям
- [ ] **Переиспользуемость** (10): Создание универсальных типов
- [ ] **Композиция** (10): Грамотное наследование и композиция типов
- [ ] **Производительность** (5): Оптимизация скорости компиляции

#### Практическое применение (40 баллов):

- [ ] **Type Safety** (15): Полное покрытие типами без any
- [ ] **Runtime Validation** (10): Type guards и runtime проверки
- [ ] **Декораторы** (10): Корректное использование декораторов
- [ ] **Документация** (5): JSDoc комментарии для сложных типов

#### Качество кода (35 баллов):

- [ ] **Читаемость** (15): Понятные названия типов и интерфейсов
- [ ] **Консистентность** (10): Единообразный стиль именования
- [ ] **Ошибкоустойчивость** (10): Обработка edge cases в типах

### 📚 Ресурсы для изучения

**TypeScript Advanced:**

- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - официальная документация
- [Advanced TypeScript](https://github.com/microsoft/TypeScript/wiki/Advanced-Types) - продвинутые типы
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) - глубокое изучение

**Generic Types:**

- [Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

**Декораторы:**

- [Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) - официальная документация
- [Decorator Patterns](https://refactoring.guru/design-patterns/decorator) - паттерны проектирования

### 🎨 Архитектура типов

```
types/
├── api/
│   ├── index.ts              # API типы
│   ├── responses.ts          # Типы ответов
│   └── requests.ts           # Типы запросов
├── entities/
│   ├── crypto.ts             # Криптовалюты
│   ├── user.ts               # Пользователи
│   └── transaction.ts        # Транзакции
├── utils/
│   ├── conditional.ts        # Conditional types
│   ├── mapped.ts             # Mapped types
│   └── template-literal.ts   # Template literal types
└── guards/
    ├── crypto.ts             # Type guards для криптовалют
    └── api.ts                # Type guards для API
```

### 🚀 Дополнительные задачи (бонус)

Для углубленного изучения:

1. **Advanced Mapped Types**: Создать систему для автоматической генерации form types из entity types
2. **Recursive Types**: Реализовать типы для работы с деревовидными структурами данных
3. **Brand Types**: Использовать брендинг типов для создания type-safe ID системы
4. **Plugin System**: Создать type-safe систему плагинов с использованием module augmentation

### 🔄 Процесс выполнения

1. **Анализ требований** (1 день):

   - Изучить существующий код базового проекта
   - Определить области для типизации
   - Спроектировать архитектуру типов

2. **Реализация базовых типов** (3-4 дня):

   - Создать основные entity типы
   - Реализовать API типы с дженериками
   - Добавить utility types

3. **Продвинутые возможности** (3-4 дня):

   - Conditional и mapped types
   - Template literal types
   - Type guards и валидация

4. **Декораторы и метаданные** (2-3 дня):

   - Система кэширования через декораторы
   - Валидация входных данных
   - Логирование и метрики

5. **Тестирование и оптимизация** (2-3 дня):
   - Проверка type coverage
   - Оптимизация производительности компиляции
   - Документирование типов

## Задание 11.2: Type-safe State Management

### 🎯 Цель

Создать type-safe систему управления состоянием с использованием продвинутых TypeScript паттернов

### 📋 Требования

#### Функциональные требования:

- [ ] Строго типизированный store с Pinia
- [ ] Type-safe actions и getters
- [ ] Система событий с типизированными handlers
- [ ] Middleware система с type safety
- [ ] Persistent storage с типизацией

#### Технические требования:

- [ ] Generic store patterns
- [ ] Computed properties с правильной типизацией
- [ ] Type-safe dependency injection
- [ ] Error handling с typed errors
- [ ] DevTools интеграция

### 💡 Подсказки

**Type-safe Store:**

```typescript
// stores/base.ts
export interface StoreState {
  loading: boolean;
  error: string | null;
}

export interface StoreActions<T extends StoreState> {
  setLoading(loading: boolean): void;
  setError(error: string | null): void;
  reset(): void;
}

export interface StoreGetters<T extends StoreState> {
  isLoading: (state: T) => boolean;
  hasError: (state: T) => boolean;
}

export function createBaseStore<T extends StoreState>(initialState: T) {
  return defineStore("base", {
    state: (): T => ({ ...initialState }),
    getters: {
      isLoading: (state) => state.loading,
      hasError: (state) => state.error !== null,
    } as StoreGetters<T>,
    actions: {
      setLoading(loading: boolean) {
        this.loading = loading;
      },
      setError(error: string | null) {
        this.error = error;
      },
      reset() {
        Object.assign(this, initialState);
      },
    } as StoreActions<T>,
  });
}

// stores/crypto.ts
interface CryptoState extends StoreState {
  currencies: CryptoCurrency[];
  selectedCurrency: CryptoCurrency | null;
  prices: Record<string, number>;
}

export const useCryptoStore = createBaseStore<CryptoState>({
  loading: false,
  error: null,
  currencies: [],
  selectedCurrency: null,
  prices: {},
});
```

**Type-safe Events:**

```typescript
// events/system.ts
export interface EventMap {
  "price:update": { symbol: string; price: number; timestamp: number };
  "user:login": { userId: string; email: string };
  "user:logout": { userId: string };
  "transaction:created": { id: string; amount: number; type: "buy" | "sell" };
  "error:api": { endpoint: string; error: string; statusCode: number };
}

export type EventType = keyof EventMap;
export type EventPayload<T extends EventType> = EventMap[T];

export class TypedEventEmitter {
  private listeners = new Map<EventType, Set<Function>>();

  on<T extends EventType>(
    event: T,
    listener: (payload: EventPayload<T>) => void
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  emit<T extends EventType>(event: T, payload: EventPayload<T>): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((listener) => listener(payload));
    }
  }

  off<T extends EventType>(
    event: T,
    listener: (payload: EventPayload<T>) => void
  ): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
    }
  }
}

// Глобальный экземпляр
export const eventBus = new TypedEventEmitter();
```

### ❓ Вопросы для изучения

#### Теоретические вопросы:

1. **Store Patterns**: Какие преимущества дает строгая типизация в state management?
2. **Event System**: Как обеспечить type safety в pub/sub системах?
3. **Dependency Injection**: Как реализовать type-safe DI container?

#### Практические вопросы:

1. **Performance**: Как типизация влияет на производительность Vue/Pinia приложений?
2. **Testing**: Как тестировать сложные generic типы?
3. **Migration**: Как мигрировать с JavaScript на TypeScript в большом проекте?

### 🔍 Критерии оценки (50 баллов)

- [ ] **Store Typing** (15): Полная типизация состояния и действий
- [ ] **Event System** (15): Type-safe события и обработчики
- [ ] **Generic Patterns** (10): Использование продвинутых дженериков
- [ ] **Error Handling** (10): Типизированная обработка ошибок

---

## Задание 11.3: Advanced Patterns и Best Practices

### 🎯 Цель

Реализовать продвинутые TypeScript паттерны для создания maintainable и scalable кода

### 📋 Требования

- [ ] Builder pattern с типизацией
- [ ] Factory pattern для создания объектов
- [ ] Observer pattern с типами
- [ ] Strategy pattern implementation
- [ ] Dependency injection система

### 💡 Подсказки

**Builder Pattern:**

```typescript
// patterns/builder.ts
export class TransactionBuilder {
  private transaction: Partial<Transaction> = {};

  amount(value: number): this {
    this.transaction.amount = value;
    return this;
  }

  currency(value: string): this {
    this.transaction.currency = value;
    return this;
  }

  type(value: "buy" | "sell"): this {
    this.transaction.type = value;
    return this;
  }

  build(): Transaction {
    if (!this.isValid()) {
      throw new Error("Invalid transaction data");
    }
    return this.transaction as Transaction;
  }

  private isValid(): this is { transaction: Transaction } {
    return !!(
      this.transaction.amount &&
      this.transaction.currency &&
      this.transaction.type
    );
  }
}

// Использование
const transaction = new TransactionBuilder()
  .amount(100)
  .currency("BTC")
  .type("buy")
  .build();
```

### 📚 Дополнительные ресурсы

- **Design Patterns in TypeScript** - реализация классических паттернов
- **Advanced TypeScript Performance** - оптимизация больших проектов
- **Type-Driven Development** - разработка через типы

### 🎯 Финальная оценка этапа

**Общая оценка: 150 баллов**

- Задание 11.1 - 50 баллов
- Задание 11.2 - 50 баллов
- Задание 11.3 - 50 баллов

**Минимум для прохождения: 105 баллов (70%)**

### 🚀 Следующий этап

После успешного завершения этого этапа переходите к **Этапу 12: Architecture Setup**, где вы будете настраивать enterprise-архитектуру проекта с нуля.
