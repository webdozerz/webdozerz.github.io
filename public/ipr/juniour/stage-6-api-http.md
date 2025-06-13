# Этап 6: API + HTTP клиент - Технические задания

## Задание 6.1: Продвинутая работа с HTTP

### 🎯 Цель

Создать профессиональную систему работы с API

### 📋 Требования

#### Функциональные требования:

- [ ] HTTP клиент с перехватчиками (interceptors)
- [ ] Автоматическая обработка ошибок
- [ ] Retry механизм для неудачных запросов
- [ ] Request/Response трансформация
- [ ] Загрузка файлов с progress

#### Технические требования:

- [ ] TypeScript типизация для всех API методов
- [ ] Централизованная обработка ошибок
- [ ] Кэширование запросов
- [ ] AbortController для отмены запросов
- [ ] Rate limiting

### 💡 Подсказки

**HTTP клиент:**

```typescript
// utils/httpClient.ts
interface RequestConfig extends RequestInit {
  url: string;
  timeout?: number;
  retry?: number;
  cache?: boolean;
  cacheTTL?: number;
}

interface ErrorResponse {
  message: string;
  code: string;
  details?: unknown;
}

class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private interceptors: {
    request: Array<
      (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
    >;
    response: Array<(response: Response) => Response | Promise<Response>>;
    error: Array<(error: Error) => Error | Promise<Error>>;
  };
  private cache = new Map<string, { data: unknown; expiry: number }>();

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
    this.interceptors = {
      request: [],
      response: [],
      error: [],
    };
  }

  // Перехватчики
  addRequestInterceptor(
    interceptor: (
      config: RequestConfig
    ) => RequestConfig | Promise<RequestConfig>
  ) {
    this.interceptors.request.push(interceptor);
  }

  addResponseInterceptor(
    interceptor: (response: Response) => Response | Promise<Response>
  ) {
    this.interceptors.response.push(interceptor);
  }

  addErrorInterceptor(interceptor: (error: Error) => Error | Promise<Error>) {
    this.interceptors.error.push(interceptor);
  }

  // Основной метод запроса
  async request<T>(config: RequestConfig): Promise<T> {
    let processedConfig = { ...config };

    // Применяем request interceptors
    for (const interceptor of this.interceptors.request) {
      processedConfig = await interceptor(processedConfig);
    }

    // Проверяем кэш
    if (processedConfig.cache) {
      const cached = this.getCachedData<T>(processedConfig.url);
      if (cached) return cached;
    }

    const url = processedConfig.url.startsWith("http")
      ? processedConfig.url
      : `${this.baseURL}${processedConfig.url}`;

    const requestInit: RequestInit = {
      method: processedConfig.method || "GET",
      headers: {
        ...this.defaultHeaders,
        ...processedConfig.headers,
      },
      body: processedConfig.body,
      signal: this.createAbortSignal(processedConfig.timeout),
    };

    try {
      let response = await this.fetchWithRetry(
        url,
        requestInit,
        processedConfig.retry || 0
      );

      // Применяем response interceptors
      for (const interceptor of this.interceptors.response) {
        response = await interceptor(response);
      }

      if (!response.ok) {
        throw new HttpError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          await this.parseErrorResponse(response)
        );
      }

      const data = await this.parseResponse<T>(response);

      // Кэшируем результат
      if (processedConfig.cache) {
        this.setCachedData(processedConfig.url, data, processedConfig.cacheTTL);
      }

      return data;
    } catch (error) {
      let processedError = error as Error;

      // Применяем error interceptors
      for (const interceptor of this.interceptors.error) {
        processedError = await interceptor(processedError);
      }

      throw processedError;
    }
  }

  // Convenience methods
  get<T>(url: string, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({ ...config, url, method: "GET" });
  }

  post<T>(
    url: string,
    data?: unknown,
    config?: Partial<RequestConfig>
  ): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put<T>(
    url: string,
    data?: unknown,
    config?: Partial<RequestConfig>
  ): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete<T>(url: string, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({ ...config, url, method: "DELETE" });
  }

  // Загрузка файлов с прогрессом
  async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch {
            resolve(xhr.responseText as T);
          }
        } else {
          reject(new HttpError(`Upload failed: ${xhr.statusText}`, xhr.status));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      const fullUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`;
      xhr.open("POST", fullUrl);

      // Добавляем заголовки (кроме Content-Type для FormData)
      Object.entries(this.defaultHeaders).forEach(([key, value]) => {
        if (key.toLowerCase() !== "content-type") {
          xhr.setRequestHeader(key, value);
        }
      });

      xhr.send(formData);
    });
  }

  // Приватные методы
  private async fetchWithRetry(
    url: string,
    init: RequestInit,
    retries: number
  ): Promise<Response> {
    try {
      return await fetch(url, init);
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await this.delay(1000 * (4 - retries)); // Exponential backoff
        return this.fetchWithRetry(url, init, retries - 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return true; // Network error
    }
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private createAbortSignal(timeout = 30000): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller.signal;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json();
    }

    if (contentType?.includes("text/")) {
      return response.text() as T;
    }

    return response.blob() as T;
  }

  private async parseErrorResponse(response: Response): Promise<ErrorResponse> {
    try {
      return await response.json();
    } catch {
      return {
        message: response.statusText,
        code: response.status.toString(),
      };
    }
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiry) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: unknown, ttl = 300000): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }
}

class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: ErrorResponse
  ) {
    super(message);
    this.name = "HttpError";
  }
}

// Экспорт настроенного клиента
export const apiClient = new HttpClient("/api");

// Настройка перехватчиков
apiClient.addRequestInterceptor(async (config) => {
  const authToken = useCookie("auth-token");
  if (authToken.value) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authToken.value}`,
    };
  }
  return config;
});

apiClient.addErrorInterceptor(async (error) => {
  if (error instanceof HttpError && error.status === 401) {
    // Redirect to login
    await navigateTo("/auth/login");
  }
  return error;
});
```

### ❓ Вопросы для изучения

1. **Interceptors**: Как работают перехватчики и зачем они нужны?
2. **Error Handling**: Какие стратегии обработки ошибок HTTP существуют?
3. **Caching**: Когда использовать кэширование HTTP запросов?
4. **AbortController**: Как отменять HTTP запросы?

### 🔍 Критерии оценки

- [ ] **HTTP Client** (30): Полнофункциональный клиент с перехватчиками
- [ ] **Error Handling** (25): Централизованная обработка ошибок
- [ ] **Caching** (20): Эффективное кэширование
- [ ] **TypeScript** (25): Полная типизация API методов

---

## Задание 6.2: API слой с Repository паттерном

### 🎯 Цель

Создать архитектурный слой для работы с API

### 📋 Требования

#### Функциональные требования:

- [ ] Repository классы для каждой сущности
- [ ] DTO (Data Transfer Objects) для API
- [ ] Маппинг между DTO и доменными объектами
- [ ] Абстракция для различных API источников
- [ ] Offline режим с синхронизацией

#### Технические требования:

- [ ] Интерфейсы для всех репозиториев
- [ ] Dependency Injection
- [ ] Validation для входящих/исходящих данных
- [ ] Serialization/Deserialization

### 💡 Подсказки

**DTO и маппинг:**

```typescript
// types/dto.ts
export interface CryptoCurrencyDTO {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

// mappers/cryptoMapper.ts
export class CryptoMapper {
  static toDomain(dto: CryptoCurrencyDTO): CryptoCurrency {
    return {
      id: dto.id,
      symbol: dto.symbol,
      name: dto.name,
      image: dto.image,
      currentPrice: dto.current_price,
      priceChangePercentage24h: dto.price_change_percentage_24h,
      marketCap: dto.market_cap,
      totalVolume: dto.total_volume,
      lastUpdated: new Date(dto.last_updated),
    };
  }

  static fromDomain(crypto: CryptoCurrency): CryptoCurrencyDTO {
    return {
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      image: crypto.image,
      current_price: crypto.currentPrice,
      price_change_percentage_24h: crypto.priceChangePercentage24h,
      market_cap: crypto.marketCap,
      total_volume: crypto.totalVolume,
      last_updated: crypto.lastUpdated.toISOString(),
      // ... остальные поля с default значениями
      market_cap_rank: 0,
      fully_diluted_valuation: null,
      high_24h: 0,
      low_24h: 0,
      price_change_24h: 0,
      market_cap_change_24h: 0,
      market_cap_change_percentage_24h: 0,
      circulating_supply: 0,
      total_supply: null,
      max_supply: null,
      ath: 0,
      ath_change_percentage: 0,
      ath_date: "",
      atl: 0,
      atl_change_percentage: 0,
      atl_date: "",
    };
  }

  static toDomainList(dtos: CryptoCurrencyDTO[]): CryptoCurrency[] {
    return dtos.map(this.toDomain);
  }
}
```

**Repository интерфейс и реализация:**

```typescript
// repositories/interfaces/ICryptoRepository.ts
export interface ICryptoRepository {
  getAll(params?: GetCryptoParams): Promise<CryptoCurrency[]>;
  getById(id: string): Promise<CryptoCurrency | null>;
  search(query: string): Promise<CryptoCurrency[]>;
  getPriceHistory(id: string, days: number): Promise<PriceHistoryItem[]>;
  getMarketData(id: string): Promise<MarketData>;
}

export interface GetCryptoParams {
  page?: number;
  limit?: number;
  sortBy?: SortField;
  sortDirection?: SortDirection;
  category?: string;
}

// repositories/CoinGeckoCryptoRepository.ts
export class CoinGeckoCryptoRepository implements ICryptoRepository {
  constructor(
    private httpClient: HttpClient,
    private cache: ICacheService
  ) {}

  async getAll(params: GetCryptoParams = {}): Promise<CryptoCurrency[]> {
    const {
      page = 1,
      limit = 10,
      sortBy = "market_cap_desc",
      category,
    } = params;

    const cacheKey = `crypto-list-${JSON.stringify(params)}`;

    // Попытка получить из кэша
    const cached = await this.cache.get<CryptoCurrency[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.httpClient.get<CryptoCurrencyDTO[]>(
        "/coins/markets",
        {
          cache: true,
          cacheTTL: 300000, // 5 минут
          query: {
            vs_currency: "usd",
            order: sortBy,
            per_page: limit,
            page,
            category,
            sparkline: false,
          },
        }
      );

      const cryptos = CryptoMapper.toDomainList(response);

      // Кэшируем результат
      await this.cache.set(cacheKey, cryptos, 300); // 5 минут

      return cryptos;
    } catch (error) {
      throw new RepositoryError("Failed to fetch cryptocurrencies", error);
    }
  }

  async getById(id: string): Promise<CryptoCurrency | null> {
    if (!id) {
      throw new ValidationError("ID is required");
    }

    const cacheKey = `crypto-${id}`;
    const cached = await this.cache.get<CryptoCurrency>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.httpClient.get<CryptoCurrencyDTO>(
        `/coins/${id}`
      );
      const crypto = CryptoMapper.toDomain(response);

      await this.cache.set(cacheKey, crypto, 300);

      return crypto;
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        return null;
      }
      throw new RepositoryError(`Failed to fetch cryptocurrency ${id}`, error);
    }
  }

  async search(query: string): Promise<CryptoCurrency[]> {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const response = await this.httpClient.get<{
        coins: CryptoCurrencyDTO[];
      }>("/search", {
        query: { query },
      });

      return CryptoMapper.toDomainList(response.coins);
    } catch (error) {
      throw new RepositoryError("Search failed", error);
    }
  }

  async getPriceHistory(id: string, days: number): Promise<PriceHistoryItem[]> {
    const response = await this.httpClient.get<{ prices: [number, number][] }>(
      `/coins/${id}/market_chart`,
      {
        query: {
          vs_currency: "usd",
          days,
        },
      }
    );

    return response.prices.map(([timestamp, price]) => ({
      timestamp: new Date(timestamp),
      price,
    }));
  }

  async getMarketData(id: string): Promise<MarketData> {
    const response = await this.httpClient.get<any>(`/coins/${id}`);

    return {
      marketCap: response.market_data.market_cap.usd,
      volume24h: response.market_data.total_volume.usd,
      circulatingSupply: response.market_data.circulating_supply,
      maxSupply: response.market_data.max_supply,
      totalSupply: response.market_data.total_supply,
    };
  }
}
```

**Dependency Injection:**

```typescript
// services/ServiceContainer.ts
export class ServiceContainer {
  private services = new Map<string, unknown>();
  private singletons = new Map<string, unknown>();

  register<T>(name: string, factory: () => T, singleton = false): void {
    if (singleton) {
      this.singletons.set(name, factory);
    } else {
      this.services.set(name, factory);
    }
  }

  resolve<T>(name: string): T {
    if (this.singletons.has(name)) {
      const factory = this.singletons.get(name) as () => T;
      const instance = factory();
      this.singletons.set(name, instance);
      return instance;
    }

    const factory = this.services.get(name) as () => T;
    if (!factory) {
      throw new Error(`Service ${name} not found`);
    }

    return factory();
  }
}

// Настройка контейнера
export const container = new ServiceContainer();

container.register(
  "httpClient",
  () => new HttpClient("https://api.coingecko.com/api/v3"),
  true
);

container.register("cacheService", () => new BrowserCacheService(), true);

container.register(
  "cryptoRepository",
  () =>
    new CoinGeckoCryptoRepository(
      container.resolve("httpClient"),
      container.resolve("cacheService")
    ),
  true
);
```

### ❓ Вопросы для изучения

1. **Repository Pattern**: Зачем нужен паттерн Репозиторий?
2. **DTO**: Что такое Data Transfer Objects и их преимущества?
3. **Dependency Injection**: Как работает внедрение зависимостей?
4. **Data Mapping**: Зачем разделять DTO и доменные объекты?

---

## 📊 Общая оценка этапа 6

| Критерий           | Баллы   | Описание                          |
| ------------------ | ------- | --------------------------------- |
| HTTP Client        | 30      | Перехватчики, retry, кэширование  |
| Repository Pattern | 25      | Архитектурная абстракция API      |
| DTO и маппинг      | 25      | Разделение слоев данных           |
| Error Handling     | 20      | Централизованная обработка ошибок |
| **Итого**          | **100** | Минимум 70 для перехода к этапу 7 |

### 🎯 Следующий этап

После завершения этапа 6 переходим к **Этапу 7: Аутентификация + JWT**.
