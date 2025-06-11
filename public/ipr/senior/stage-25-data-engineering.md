# Этап 25: Data Engineering & Analytics - Технические задания

## Задание 25.1: Построение Data Lake архитектуры

### 🎯 Цель

Создать масштабируемую архитектуру озера данных для сбора, обработки и анализа всех данных платформы

### 📋 Требования

#### Архитектурные требования:

- [ ] Многослойная архитектура (Bronze → Silver → Gold)
- [ ] Потоковая и пакетная обработка данных
- [ ] Схема управления и версионирование данных
- [ ] Управление качеством данных
- [ ] Автоматическое масштабирование и партиционирование

#### Слои данных:

- [ ] **Bronze (сырые данные)**: Исходные события и логи
- [ ] **Silver (очищенные)**: Валидированные и структурированные данные
- [ ] **Gold (аналитические)**: Агрегированные данные для бизнес-аналитики
- [ ] **Платиновый (реального времени)**: Потоковые данные для операционных дашбордов

### 💡 Подсказки

**Архитектура Data Lake с Delta Lake:**

```typescript
// data-platform/src/schemas/DataSchema.ts
import { z } from "zod";

// Схемы для различных типов событий
export const UserEventSchema = z.object({
  eventId: z.string().uuid(),
  userId: z.string(),
  eventType: z.enum([
    "registration",
    "login",
    "profile_update",
    "deactivation",
  ]),
  timestamp: z.number(),
  properties: z.record(z.any()),
  sessionId: z.string().optional(),
  deviceInfo: z.object({
    userAgent: z.string(),
    ip: z.string(),
    country: z.string().optional(),
  }),
});

export const CryptoTradeEventSchema = z.object({
  eventId: z.string().uuid(),
  userId: z.string(),
  symbol: z.string(),
  side: z.enum(["buy", "sell"]),
  quantity: z.number().positive(),
  price: z.number().positive(),
  timestamp: z.number(),
  orderId: z.string(),
  fee: z.number().nonnegative(),
  metadata: z.record(z.any()),
});

export const PriceDataSchema = z.object({
  symbol: z.string(),
  price: z.number().positive(),
  volume24h: z.number().nonnegative(),
  marketCap: z.number().nonnegative(),
  priceChange24h: z.number(),
  timestamp: z.number(),
  source: z.string(),
  confidence: z.number().min(0).max(1),
});

// Типы для TypeScript
export type UserEvent = z.infer<typeof UserEventSchema>;
export type CryptoTradeEvent = z.infer<typeof CryptoTradeEventSchema>;
export type PriceData = z.infer<typeof PriceDataSchema>;
```

**ETL процессор с Apache Airflow:**

```python
# dags/crypto_data_pipeline.py
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from airflow.providers.http.operators.http import SimpleHttpOperator
from airflow.models import Variable
import pandas as pd
import delta
from pyspark.sql import SparkSession

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'execution_timeout': timedelta(hours=2),
}

dag = DAG(
    'crypto_data_pipeline',
    default_args=default_args,
    description='Обработка криптовалютных данных Bronze → Silver → Gold',
    schedule_interval=timedelta(hours=1),
    catchup=False,
    max_active_runs=1,
    tags=['crypto', 'data-processing', 'etl'],
)

def bronze_to_silver_transformation(**context):
    """Очистка и валидация сырых данных"""
    spark = SparkSession.builder.appName("BronzeToSilver").getOrCreate()

    # Чтение сырых данных из Bronze слоя
    bronze_df = spark.read.format("delta").load("s3://crypto-datalake/bronze/events/")

    # Валидация и очистка данных
    silver_df = bronze_df.filter(
        bronze_df.timestamp.isNotNull() &
        (bronze_df.timestamp > 0) &
        bronze_df.eventType.isin(['registration', 'login', 'trade', 'price_update'])
    ).withColumn(
        "processed_timestamp",
        col("timestamp").cast("timestamp")
    ).withColumn(
        "date_partition",
        date_format(col("processed_timestamp"), "yyyy-MM-dd")
    )

    # Дедупликация по eventId
    deduplicated_df = silver_df.dropDuplicates(["eventId"])

    # Обогащение геоданными
    enriched_df = deduplicated_df.join(
        broadcast(geo_lookup_df),
        col("deviceInfo.ip") == col("ip_address"),
        "left"
    ).select(
        col("*"),
        col("country_name").alias("user_country"),
        col("city_name").alias("user_city")
    )

    # Запись в Silver слой с партиционированием
    enriched_df.write.format("delta").mode("overwrite").partitionBy(
        "date_partition", "eventType"
    ).option("mergeSchema", "true").save("s3://crypto-datalake/silver/events/")

    spark.stop()

    return f"Обработано {enriched_df.count()} записей в Silver слой"

def silver_to_gold_aggregation(**context):
    """Создание аналитических агрегатов"""
    spark = SparkSession.builder.appName("SilverToGold").getOrCreate()

    # Чтение очищенных данных
    silver_df = spark.read.format("delta").load("s3://crypto-datalake/silver/events/")

    # Дневные агрегаты пользователей
    daily_user_metrics = silver_df.filter(
        col("eventType").isin(['registration', 'login'])
    ).groupBy(
        "date_partition", "user_country", "eventType"
    ).agg(
        countDistinct("userId").alias("unique_users"),
        count("*").alias("total_events"),
        avg("sessionDuration").alias("avg_session_duration")
    )

    # Торговые агрегаты
    trading_metrics = silver_df.filter(
        col("eventType") == "trade"
    ).groupBy(
        "date_partition", "symbol"
    ).agg(
        sum("quantity").alias("total_volume"),
        avg("price").alias("avg_price"),
        count("*").alias("trade_count"),
        countDistinct("userId").alias("active_traders")
    )

    # Запись в Gold слой
    daily_user_metrics.write.format("delta").mode("overwrite").partitionBy(
        "date_partition"
    ).save("s3://crypto-datalake/gold/user_metrics/")

    trading_metrics.write.format("delta").mode("overwrite").partitionBy(
        "date_partition"
    ).save("s3://crypto-datalake/gold/trading_metrics/")

    spark.stop()

def data_quality_check(**context):
    """Проверка качества данных"""
    spark = SparkSession.builder.appName("DataQuality").getOrCreate()

    silver_df = spark.read.format("delta").load("s3://crypto-datalake/silver/events/")

    # Проверки качества
    total_records = silver_df.count()
    null_user_ids = silver_df.filter(col("userId").isNull()).count()
    invalid_timestamps = silver_df.filter(
        col("timestamp") < 1640995200  # 2022-01-01
    ).count()

    quality_score = 1 - (null_user_ids + invalid_timestamps) / total_records

    if quality_score < 0.95:
        raise ValueError(f"Качество данных ниже порога: {quality_score:.2%}")

    # Сохранение метрик качества
    quality_metrics = spark.createDataFrame([{
        "date": context['ds'],
        "total_records": total_records,
        "null_user_ids": null_user_ids,
        "invalid_timestamps": invalid_timestamps,
        "quality_score": quality_score
    }])

    quality_metrics.write.format("delta").mode("append").save(
        "s3://crypto-datalake/monitoring/data_quality/"
    )

    spark.stop()

    return f"Качество данных: {quality_score:.2%}"

# Определение задач
bronze_to_silver = PythonOperator(
    task_id='bronze_to_silver_transformation',
    python_callable=bronze_to_silver_transformation,
    dag=dag,
)

silver_to_gold = PythonOperator(
    task_id='silver_to_gold_aggregation',
    python_callable=silver_to_gold_aggregation,
    dag=dag,
)

quality_check = PythonOperator(
    task_id='data_quality_check',
    python_callable=data_quality_check,
    dag=dag,
)

# Зависимости задач
bronze_to_silver >> quality_check >> silver_to_gold
```

**Потоковая обработка с Apache Kafka и ClickHouse:**

```typescript
// data-platform/src/streaming/RealTimeProcessor.ts
import { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import { ClickHouse } from "@clickhouse/client";
import { z } from "zod";

export class RealTimeEventProcessor {
  private kafka: Kafka;
  private consumer: Consumer;
  private clickhouse: ClickHouse;
  private batchSize = 1000;
  private batchTimeout = 5000; // 5 секунд
  private eventBatch: any[] = [];

  constructor() {
    this.kafka = new Kafka({
      clientId: "real-time-processor",
      brokers: process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"],
    });

    this.consumer = this.kafka.consumer({
      groupId: "real-time-analytics",
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });

    this.clickhouse = new ClickHouse({
      host: process.env.CLICKHOUSE_HOST || "localhost:8123",
      username: process.env.CLICKHOUSE_USER || "default",
      password: process.env.CLICKHOUSE_PASSWORD || "",
      database: "crypto_analytics",
    });
  }

  async start(): Promise<void> {
    await this.consumer.connect();

    await this.consumer.subscribe({
      topics: ["user-events", "trade-events", "price-events"],
      fromBeginning: false,
    });

    // Настройка таймера для принудительной отправки батчей
    setInterval(() => {
      if (this.eventBatch.length > 0) {
        this.flushBatch();
      }
    }, this.batchTimeout);

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.processMessage(payload);
      },
    });
  }

  private async processMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, message } = payload;

    try {
      const event = JSON.parse(message.value?.toString() || "{}");
      const enrichedEvent = await this.enrichEvent(topic, event);

      this.eventBatch.push(enrichedEvent);

      if (this.eventBatch.length >= this.batchSize) {
        await this.flushBatch();
      }
    } catch (error) {
      console.error("Ошибка обработки сообщения:", error);
      // Отправляем в Dead Letter Queue
      await this.sendToDeadLetterQueue(topic, message, error);
    }
  }

  private async enrichEvent(topic: string, event: any): Promise<any> {
    const baseEnrichment = {
      ...event,
      processed_timestamp: new Date().toISOString(),
      topic,
      source: "real-time-processor",
    };

    switch (topic) {
      case "user-events":
        return await this.enrichUserEvent(baseEnrichment);
      case "trade-events":
        return await this.enrichTradeEvent(baseEnrichment);
      case "price-events":
        return await this.enrichPriceEvent(baseEnrichment);
      default:
        return baseEnrichment;
    }
  }

  private async enrichUserEvent(event: any): Promise<any> {
    // Получение дополнительной информации о пользователе
    const userProfile = await this.getUserProfile(event.userId);

    return {
      ...event,
      user_segment: userProfile?.segment || "unknown",
      user_tier: userProfile?.tier || "basic",
      is_premium: userProfile?.isPremium || false,
    };
  }

  private async enrichTradeEvent(event: any): Promise<any> {
    // Обогащение торговых данных текущими рыночными данными
    const marketData = await this.getCurrentMarketData(event.symbol);

    return {
      ...event,
      market_price: marketData?.price,
      price_deviation: marketData
        ? (event.price - marketData.price) / marketData.price
        : null,
      market_volatility: marketData?.volatility,
    };
  }

  private async flushBatch(): Promise<void> {
    if (this.eventBatch.length === 0) return;

    const batch = [...this.eventBatch];
    this.eventBatch = [];

    try {
      // Группировка по типам событий для оптимизации вставки
      const groupedEvents = this.groupEventsByType(batch);

      for (const [eventType, events] of Object.entries(groupedEvents)) {
        await this.insertToClickHouse(eventType, events);
      }

      console.log(`Обработан батч из ${batch.length} событий`);
    } catch (error) {
      console.error("Ошибка записи батча:", error);
      // Возвращаем события обратно в батч для повторной попытки
      this.eventBatch.unshift(...batch);
    }
  }

  private async insertToClickHouse(
    eventType: string,
    events: any[]
  ): Promise<void> {
    const tableName = this.getTableName(eventType);

    await this.clickhouse.insert({
      table: tableName,
      values: events,
      format: "JSONEachRow",
    });
  }

  private getTableName(eventType: string): string {
    const tableMap: Record<string, string> = {
      "user-events": "user_events_realtime",
      "trade-events": "trade_events_realtime",
      "price-events": "price_events_realtime",
    };

    return tableMap[eventType] || "unknown_events";
  }

  private groupEventsByType(events: any[]): Record<string, any[]> {
    return events.reduce(
      (groups, event) => {
        const type = event.topic || "unknown";
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(event);
        return groups;
      },
      {} as Record<string, any[]>
    );
  }

  private async getUserProfile(userId: string): Promise<any> {
    // Кэшированный запрос профиля пользователя
    const cacheKey = `user:${userId}`;
    // Реализация кэширования опущена для краткости
    return { segment: "active", tier: "premium", isPremium: true };
  }

  private async getCurrentMarketData(symbol: string): Promise<any> {
    // Получение текущих рыночных данных
    const result = await this.clickhouse.query({
      query: `
        SELECT 
          price,
          stddevPop(price) OVER (
            ORDER BY timestamp 
            ROWS BETWEEN 100 PRECEDING AND CURRENT ROW
          ) as volatility
        FROM price_events_realtime 
        WHERE symbol = {symbol:String}
        ORDER BY timestamp DESC 
        LIMIT 1
      `,
      query_params: { symbol },
    });

    return result.json().then((data) => data[0]);
  }
}

// Запуск процессора
const processor = new RealTimeEventProcessor();
processor.start().catch(console.error);
```

### ❓ Вопросы для изучения

1. **Архитектура данных**: Какие преимущества дает многослойная архитектура озера данных?
2. **Потоковая обработка**: Когда использовать потоковую обработку вместо пакетной?
3. **Качество данных**: Как автоматизировать проверки качества данных на всех уровнях?
4. **Масштабирование**: Как обеспечить горизонтальное масштабирование обработки данных?

### 🔍 Критерии оценки

- [ ] **Архитектура озера данных** (40): Правильная организация слоев данных
- [ ] **ETL процессы** (30): Надежность и производительность пайплайнов
- [ ] **Потоковая обработка** (20): Обработка данных в реальном времени
- [ ] **Качество данных** (10): Системы валидации и мониторинга

---

## Задание 25.2: Аналитическая платформа с ClickHouse

### 🎯 Цель

Создать высокопроизводительную аналитическую систему для обработки больших объемов данных

### 📋 Требования

#### Функциональные требования:

- [ ] Колоночное хранилище для аналитических запросов
- [ ] Материализованные представления для агрегатов
- [ ] Партиционирование и индексы для производительности
- [ ] Система мониторинга запросов и производительности
- [ ] API для аналитических дашбордов

### 💡 Подсказки

**ClickHouse схемы таблиц:**

```sql
-- Таблица событий пользователей
CREATE TABLE user_events_local (
    event_id String,
    user_id String,
    event_type LowCardinality(String),
    timestamp DateTime64(3),
    properties String,
    session_id Nullable(String),
    device_info String,
    user_country LowCardinality(String),
    user_city String,
    date Date MATERIALIZED toDate(timestamp)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (event_type, user_id, timestamp)
SETTINGS index_granularity = 8192;

-- Распределенная таблица для кластера
CREATE TABLE user_events ON CLUSTER crypto_cluster AS user_events_local
ENGINE = Distributed('crypto_cluster', default, user_events_local, rand());

-- Материализованное представление для дневных метрик
CREATE MATERIALIZED VIEW user_daily_metrics_mv
TO user_daily_metrics
AS SELECT
    toDate(timestamp) as date,
    event_type,
    user_country,
    count() as event_count,
    uniq(user_id) as unique_users,
    uniq(session_id) as unique_sessions,
    avg(JSONExtractFloat(properties, 'session_duration')) as avg_session_duration
FROM user_events_local
GROUP BY date, event_type, user_country;

-- Таблица для хранения агрегатов
CREATE TABLE user_daily_metrics (
    date Date,
    event_type LowCardinality(String),
    user_country LowCardinality(String),
    event_count UInt64,
    unique_users UInt64,
    unique_sessions UInt64,
    avg_session_duration Float64
) ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, event_type, user_country);

-- Таблица торговых событий
CREATE TABLE trade_events_local (
    event_id String,
    user_id String,
    symbol LowCardinality(String),
    side Enum8('buy' = 1, 'sell' = 2),
    quantity Decimal64(8),
    price Decimal64(8),
    timestamp DateTime64(3),
    order_id String,
    fee Decimal64(8),
    market_price Nullable(Decimal64(8)),
    price_deviation Nullable(Float64),
    date Date MATERIALIZED toDate(timestamp)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (symbol, timestamp, user_id)
SETTINGS index_granularity = 8192;

-- Индексы для оптимизации запросов
ALTER TABLE trade_events_local ADD INDEX idx_user_id user_id TYPE bloom_filter(0.01) GRANULARITY 1;
ALTER TABLE trade_events_local ADD INDEX idx_symbol symbol TYPE set(100) GRANULARITY 1;
```

**Аналитический API сервис:**

```typescript
// analytics-service/src/controllers/AnalyticsController.ts
import { ClickHouse } from "@clickhouse/client";
import { z } from "zod";

const AnalyticsQuerySchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  groupBy: z.enum(["day", "week", "month"]).default("day"),
  metrics: z.array(z.enum(["users", "sessions", "trades", "volume"])),
  filters: z
    .object({
      country: z.string().optional(),
      symbol: z.string().optional(),
      userSegment: z.string().optional(),
    })
    .optional(),
});

export class AnalyticsController {
  private clickhouse: ClickHouse;

  constructor() {
    this.clickhouse = new ClickHouse({
      host: process.env.CLICKHOUSE_HOST || "localhost:8123",
      username: process.env.CLICKHOUSE_USER || "default",
      password: process.env.CLICKHOUSE_PASSWORD || "",
      database: "crypto_analytics",
    });
  }

  async getUserMetrics(request: Request): Promise<Response> {
    const queryParams = AnalyticsQuerySchema.parse(request.query);

    const timeGrouping = this.getTimeGrouping(queryParams.groupBy);
    const whereClause = this.buildWhereClause(queryParams);

    const query = `
      SELECT 
        ${timeGrouping} as period,
        ${this.buildMetricsSelection(queryParams.metrics)},
        user_country
      FROM user_daily_metrics
      ${whereClause}
      GROUP BY period, user_country
      ORDER BY period DESC, user_country
      LIMIT 10000
    `;

    const result = await this.clickhouse.query({
      query,
      query_params: {
        date_from: queryParams.dateFrom,
        date_to: queryParams.dateTo,
      },
    });

    const data = await result.json();

    return new Response(
      JSON.stringify({
        data,
        metadata: {
          query_time: result.statistics?.elapsed || 0,
          rows_read: result.statistics?.rows_read || 0,
          total_rows: data.length,
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  async getTradingMetrics(request: Request): Promise<Response> {
    const queryParams = AnalyticsQuerySchema.parse(request.query);

    const query = `
      WITH trading_stats AS (
        SELECT 
          ${this.getTimeGrouping(queryParams.groupBy)} as period,
          symbol,
          count() as trade_count,
          sum(quantity) as total_volume,
          sum(quantity * price) as total_value,
          uniq(user_id) as active_traders,
          avg(price) as avg_price,
          stddevPop(price) as price_volatility
        FROM trade_events_local
        WHERE date BETWEEN {date_from:String} AND {date_to:String}
          ${queryParams.filters?.symbol ? "AND symbol = {symbol:String}" : ""}
        GROUP BY period, symbol
      )
      SELECT 
        period,
        symbol,
        trade_count,
        total_volume,
        total_value,
        active_traders,
        avg_price,
        price_volatility,
        total_value / lag(total_value) OVER (PARTITION BY symbol ORDER BY period) as volume_growth
      FROM trading_stats
      ORDER BY period DESC, total_value DESC
    `;

    const result = await this.clickhouse.query({
      query,
      query_params: {
        date_from: queryParams.dateFrom,
        date_to: queryParams.dateTo,
        ...(queryParams.filters?.symbol && {
          symbol: queryParams.filters.symbol,
        }),
      },
    });

    return new Response(JSON.stringify(await result.json()), {
      headers: { "Content-Type": "application/json" },
    });
  }

  async getRealTimeMetrics(): Promise<Response> {
    // Метрики реального времени за последние 24 часа
    const query = `
      SELECT 
        toStartOfHour(timestamp) as hour,
        count() as events_per_hour,
        uniq(user_id) as unique_users_per_hour,
        avg(JSONExtractFloat(properties, 'response_time')) as avg_response_time
      FROM user_events_local
      WHERE timestamp >= now() - INTERVAL 24 HOUR
      GROUP BY hour
      ORDER BY hour DESC
    `;

    const result = await this.clickhouse.query({ query });

    return new Response(
      JSON.stringify({
        realtime_metrics: await result.json(),
        last_updated: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  private getTimeGrouping(groupBy: string): string {
    switch (groupBy) {
      case "day":
        return "toDate(date)";
      case "week":
        return "toMonday(date)";
      case "month":
        return "toStartOfMonth(date)";
      default:
        return "toDate(date)";
    }
  }

  private buildWhereClause(params: any): string {
    let whereClause =
      "WHERE date BETWEEN {date_from:String} AND {date_to:String}";

    if (params.filters?.country) {
      whereClause += " AND user_country = {country:String}";
    }

    return whereClause;
  }

  private buildMetricsSelection(metrics: string[]): string {
    const metricMap: Record<string, string> = {
      users: "sum(unique_users) as total_users",
      sessions: "sum(unique_sessions) as total_sessions",
      events: "sum(event_count) as total_events",
    };

    return metrics
      .filter((metric) => metricMap[metric])
      .map((metric) => metricMap[metric])
      .join(", ");
  }
}
```

### ❓ Вопросы для изучения

1. **Колоночные хранилища**: Какие преимущества дает ClickHouse для аналитических запросов?
2. **Материализованные представления**: Как использовать MV для реального времени агрегации?
3. **Партиционирование**: Как правильно выбрать стратегию партиционирования для больших данных?
4. **Оптимизация запросов**: Какие техники оптимизации наиболее эффективны в ClickHouse?

---

## 📊 Общая оценка этапа 25

| Критерий                     | Баллы   | Описание                                   |
| ---------------------------- | ------- | ------------------------------------------ |
| **Архитектура озера данных** | 50      | Data Lake layers, схемы, партиционирование |
| **ETL пайплайны**            | 40      | Airflow DAGs, качество данных              |
| **Потоковая обработка**      | 30      | Kafka, real-time processing                |
| **Аналитическая платформа**  | 40      | ClickHouse, производительность запросов    |
| **Итого**                    | **160** | Минимум 112 для перехода к этапу 26        |

### 🎯 Следующий этап

После завершения этапа 25 переходим к **Этапу 26: AI/ML Integration**.
