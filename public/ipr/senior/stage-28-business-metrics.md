# Этап 28: Business Metrics & Analytics - Технические задания

## Задание 28.1: Система бизнес-метрик и KPI

### 🎯 Цель

Создать комплексную систему отслеживания бизнес-метрик для принятия решений на основе данных

### 📋 Требования

#### Ключевые метрики:

- [ ] **Product Metrics**: DAU, MAU, Retention, Конверсия
- [ ] **Business Metrics**: Выручка, LTV, CAC, Churn Rate
- [ ] **Technical Metrics**: Производительность, Качество, SLA
- [ ] **User Experience**: Время загрузки, Ошибки, Удовлетворенность

#### Компоненты системы:

- [ ] **Сбор данных**: Real-time трекинг событий
- [ ] **Обработка**: ETL пайплайны для метрик
- [ ] **Хранение**: Временные ряды и агрегаты
- [ ] **Визуализация**: Дашборды для стейкхолдеров
- [ ] **Алерты**: Автоматические уведомления об отклонениях

### 💡 Подсказки

**Система метрик с ClickHouse и Grafana:**

```typescript
// business-metrics/src/MetricsCollector.ts
import { ClickHouse } from "@clickhouse/client";
import { z } from "zod";

const BusinessEventSchema = z.object({
  eventType: z.enum([
    "user_registration",
    "transaction",
    "feature_usage",
    "error",
  ]),
  userId: z.string().optional(),
  sessionId: z.string(),
  timestamp: z.number(),
  properties: z.record(z.any()),
  value: z.number().optional(),
});

export class BusinessMetricsCollector {
  private clickhouse: ClickHouse;
  private eventBuffer: any[] = [];
  private flushInterval = 10000; // 10 секунд

  constructor() {
    this.clickhouse = new ClickHouse({
      host: process.env.CLICKHOUSE_HOST || "localhost:8123",
      database: "business_metrics",
    });

    this.startBatchProcessor();
  }

  async trackEvent(event: any): Promise<void> {
    const validatedEvent = BusinessEventSchema.parse(event);
    this.eventBuffer.push(validatedEvent);

    if (this.eventBuffer.length >= 1000) {
      await this.flushEvents();
    }
  }

  private startBatchProcessor(): void {
    setInterval(async () => {
      if (this.eventBuffer.length > 0) {
        await this.flushEvents();
      }
    }, this.flushInterval);
  }

  private async flushEvents(): Promise<void> {
    const events = [...this.eventBuffer];
    this.eventBuffer = [];

    await this.clickhouse.insert({
      table: "business_events",
      values: events,
      format: "JSONEachRow",
    });
  }

  async calculateKPIs(dateFrom: string, dateTo: string): Promise<any> {
    const kpis = await this.clickhouse.query({
      query: `
        WITH user_metrics AS (
          SELECT 
            toDate(timestamp) as date,
            uniq(userId) as dau,
            countIf(eventType = 'user_registration') as new_users,
            countIf(eventType = 'transaction') as transactions,
            sumIf(value, eventType = 'transaction') as revenue
          FROM business_events 
          WHERE date BETWEEN {date_from:String} AND {date_to:String}
          GROUP BY date
        )
        SELECT 
          date,
          dau,
          new_users,
          transactions,
          revenue,
          revenue / nullIf(transactions, 0) as avg_transaction_value
        FROM user_metrics
        ORDER BY date
      `,
      query_params: { date_from: dateFrom, date_to: dateTo },
    });

    return kpis.json();
  }
}
```

### ❓ Вопросы для изучения

1. **Метрики выбора**: Какие метрики наиболее важны для принятия стратегических решений?
2. **Real-time vs Batch**: Когда использовать обработку в реальном времени?
3. **Data Quality**: Как обеспечить качество данных для бизнес-аналитики?
4. **ROI Measurement**: Как измерить возврат инвестиций от технических улучшений?

---

## Задание 28.2: A/B тестирование и эксперименты

### 🎯 Цель

Создать платформу для проведения контролируемых экспериментов и валидации гипотез

### 📋 Требования

#### Функциональные требования:

- [ ] Система разделения трафика
- [ ] Статистический анализ результатов
- [ ] Автоматическое завершение экспериментов
- [ ] Интеграция с метриками продукта
- [ ] Мульти-вариантные тесты (MVT)

### 💡 Подсказки

**A/B Testing Framework:**

```typescript
// ab-testing/src/ExperimentManager.ts
export class ExperimentManager {
  async createExperiment(config: {
    name: string;
    hypothesis: string;
    variants: Array<{ name: string; allocation: number }>;
    metrics: string[];
    duration: number;
  }): Promise<string> {
    // Создание эксперимента
    const experiment = {
      id: crypto.randomUUID(),
      ...config,
      status: "draft",
      createdAt: Date.now(),
    };

    // Сохранение конфигурации
    await this.saveExperiment(experiment);
    return experiment.id;
  }

  async assignUserToVariant(
    experimentId: string,
    userId: string
  ): Promise<string> {
    const experiment = await this.getExperiment(experimentId);

    // Хэш-функция для стабильного распределения
    const hash = this.hashUserId(userId + experimentId);
    const allocation = hash % 100;

    let cumulativeAllocation = 0;
    for (const variant of experiment.variants) {
      cumulativeAllocation += variant.allocation;
      if (allocation < cumulativeAllocation) {
        return variant.name;
      }
    }

    return "control";
  }

  private hashUserId(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Преобразование в 32-битное число
    }
    return Math.abs(hash);
  }
}
```

### 🔍 Критерии оценки

- [ ] **Метрики качества** (40): Полнота и точность бизнес-метрик
- [ ] **Автоматизация** (30): Степень автоматизации сбора и анализа
- [ ] **Визуализация** (20): Качество дашбордов и отчетов
- [ ] **A/B Testing** (10): Статистическая корректность экспериментов

---

## 📊 Общая оценка этапа 28

| Критерий                   | Баллы   | Описание                                |
| -------------------------- | ------- | --------------------------------------- |
| **Система метрик**         | 50      | Полнота сбора и обработки бизнес-данных |
| **Аналитические дашборды** | 40      | Качество визуализации и инсайтов        |
| **A/B тестирование**       | 30      | Платформа экспериментов                 |
| **Data-driven решения**    | 40      | Влияние метрик на бизнес-решения        |
| **Итого**                  | **160** | Минимум 112 для перехода к этапу 29     |

### 🎯 Следующий этап

После завершения этапа 28 переходим к **Этапу 29: Team Platform & Tools**.
