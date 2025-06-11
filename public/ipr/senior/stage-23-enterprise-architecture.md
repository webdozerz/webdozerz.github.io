# Этап 23: Enterprise Architecture - Технические задания

## Задание 23.1: Микросервисная архитектура с Service Mesh

### 🎯 Цель

Трансформировать существующую архитектуру в enterprise-готовую микросервисную систему с Service Mesh

### 📋 Требования

#### Архитектурные требования:

- [ ] Разделение монолитного API на 8+ микросервисов
- [ ] Service Mesh с Istio для service-to-service communication
- [ ] API Gateway с Kong для external traffic
- [ ] Service Discovery с Consul
- [ ] Distributed tracing с Jaeger

#### Микросервисы для создания:

- [ ] **User Service**: Управление пользователями и профилями
- [ ] **Auth Service**: Аутентификация и авторизация
- [ ] **Crypto Service**: Данные о криптовалютах
- [ ] **Portfolio Service**: Управление портфелем
- [ ] **Analytics Service**: Аналитика и метрики
- [ ] **Notification Service**: Уведомления и alerts
- [ ] **Gateway Service**: API Gateway и routing
- [ ] **Configuration Service**: Центральная конфигурация

#### Технические требования:

- [ ] Kubernetes deployment с Helm charts
- [ ] Service mesh с mTLS между сервисами
- [ ] Circuit breakers и retry policies
- [ ] Rate limiting и quota management
- [ ] Health checks и readiness probes

### 💡 Подсказки

**Архитектура микросервисов:**

```yaml
# kubernetes/user-service/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  labels:
    app: user-service
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
        version: v1
      annotations:
        sidecar.istio.io/inject: "true"
    spec:
      containers:
        - name: user-service
          image: crypto-hub/user-service:v1.0.0
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: user-db-secret
                  key: url
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: auth-secret
                  key: jwt-secret
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
  labels:
    app: user-service
spec:
  ports:
    - port: 80
      targetPort: 3000
      name: http
  selector:
    app: user-service
```

**Istio Service Mesh конфигурация:**

```yaml
# istio/virtual-service.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: crypto-hub-gateway
spec:
  hosts:
    - api.crypto-learning-hub.com
  gateways:
    - crypto-hub-gateway
  http:
    - match:
        - uri:
            prefix: /api/v1/users
      route:
        - destination:
            host: user-service
            port:
              number: 80
      fault:
        delay:
          percentage:
            value: 0.1
          fixedDelay: 5s
      retries:
        attempts: 3
        perTryTimeout: 2s
    - match:
        - uri:
            prefix: /api/v1/crypto
      route:
        - destination:
            host: crypto-service
            port:
              number: 80
      timeout: 10s
---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: user-service
spec:
  host: user-service
  trafficPolicy:
    circuitBreaker:
      consecutiveErrors: 3
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
    loadBalancer:
      simple: LEAST_CONN
  subsets:
    - name: v1
      labels:
        version: v1
      trafficPolicy:
        circuitBreaker:
          consecutiveErrors: 5
```

**Микросервис с Nuxt/Nitro:**

```typescript
// services/user-service/server/api/users/index.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { page = 1, limit = 10, search } = query;

  // Добавляем distributed tracing
  const span = tracer.startSpan("get-users");
  span.setAttributes({
    "user.page": page,
    "user.limit": limit,
    "user.search": search || "",
  });

  try {
    // Валидация с Zod
    const validatedQuery = getUsersQuerySchema.parse(query);

    // Business logic
    const users = await userRepository.findMany({
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      search: validatedQuery.search,
    });

    // Метрики
    userMetrics.incrementCounter("users.get.success");
    userMetrics
      .histogram("users.get.duration")
      .observe(Date.now() - requestStart);

    span.setStatus({ code: SpanStatusCode.OK });

    return {
      data: users.map((user) => UserMapper.toPublicDTO(user)),
      pagination: {
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        total: users.length,
      },
    };
  } catch (error) {
    span.recordException(error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });

    userMetrics.incrementCounter("users.get.error");

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch users",
    });
  } finally {
    span.end();
  }
});
```

**Kong API Gateway конфигурация:**

```yaml
# kong/kong.yaml
_format_version: "3.0"

services:
  - name: user-service
    url: http://user-service.default.svc.cluster.local
    plugins:
      - name: rate-limiting
        config:
          minute: 100
          hour: 1000
      - name: jwt
        config:
          secret_is_base64: false
      - name: prometheus
        config:
          per_consumer: true

  - name: crypto-service
    url: http://crypto-service.default.svc.cluster.local
    plugins:
      - name: rate-limiting
        config:
          minute: 200
          hour: 5000
      - name: cors
        config:
          origins:
            - "https://crypto-learning-hub.com"
            - "https://admin.crypto-learning-hub.com"

routes:
  - name: users-route
    service: user-service
    paths:
      - /api/v1/users
    strip_path: true
    plugins:
      - name: request-size-limiting
        config:
          allowed_payload_size: 1

  - name: crypto-route
    service: crypto-service
    paths:
      - /api/v1/crypto
    strip_path: true
    plugins:
      - name: response-caching
        config:
          cache_ttl: 300
          cache_control: true
```

### ❓ Вопросы для изучения

1. **Проектирование микросервисов**: Как определить границы микросервисов? Принципы проблемно-ориентированного проектирования?
2. **Сервисная сеть**: Какие преимущества дает Istio над традиционной балансировкой нагрузки?
3. **Распределенные системы**: Как обеспечить согласованность в распределенной системе?
4. **Наблюдаемость**: Как реализовать эффективный мониторинг микросервисов?

### 🔍 Критерии оценки

- [ ] **Архитектурное решение** (40): Правильное разделение на микросервисы
- [ ] **Service Mesh** (30): Корректная настройка Istio
- [ ] **Observability** (20): Tracing, metrics, logging
- [ ] **Production Readiness** (10): Health checks, graceful shutdown

---

## Задание 23.2: Event-Driven Architecture с Apache Kafka

### 🎯 Цель

Реализовать event-driven communication между микросервисами

### 📋 Требования

#### Функциональные требования:

- [ ] Event Sourcing для критических бизнес-операций
- [ ] Асинхронные events между сервисами
- [ ] Event replay capability
- [ ] Dead letter queues для failed events
- [ ] Event schema evolution

#### Event Types для реализации:

- [ ] **UserRegistered**: Новый пользователь зарегистрирован
- [ ] **PortfolioUpdated**: Изменение портфеля
- [ ] **PriceAlert**: Уведомление о цене
- [ ] **TransactionCompleted**: Завершение транзакции
- [ ] **UserActivity**: Активность пользователя

### 💡 Подсказки

**Event Schema с Avro:**

```json
{
  "type": "record",
  "name": "UserRegistered",
  "namespace": "com.crypto.hub.events",
  "fields": [
    {
      "name": "eventId",
      "type": "string"
    },
    {
      "name": "userId",
      "type": "string"
    },
    {
      "name": "email",
      "type": "string"
    },
    {
      "name": "timestamp",
      "type": "long",
      "logicalType": "timestamp-millis"
    },
    {
      "name": "metadata",
      "type": {
        "type": "map",
        "values": "string"
      }
    }
  ]
}
```

**Event Producer:**

```typescript
// services/user-service/lib/events/UserEventProducer.ts
export class UserEventProducer {
  constructor(
    private kafka: Kafka,
    private schemaRegistry: SchemaRegistry
  ) {}

  async publishUserRegistered(user: User): Promise<void> {
    const event: UserRegisteredEvent = {
      eventId: crypto.randomUUID(),
      userId: user.id,
      email: user.email,
      timestamp: Date.now(),
      metadata: {
        source: "user-service",
        version: "1.0.0",
        correlationId: getCorrelationId(),
      },
    };

    const producer = this.kafka.producer({
      transactionTimeout: 30000,
    });

    await producer.connect();

    try {
      // Используем транзакции для consistency
      await producer.transaction(
        {
          timeout: 30000,
        },
        async ({ send }) => {
          await send({
            topic: "user-events",
            messages: [
              {
                key: user.id,
                value: await this.serializeEvent(event),
                headers: {
                  eventType: "UserRegistered",
                  schemaVersion: "1.0.0",
                },
              },
            ],
          });
        }
      );
    } finally {
      await producer.disconnect();
    }
  }

  private async serializeEvent(event: UserRegisteredEvent): Promise<Buffer> {
    const schema = await this.schemaRegistry.getLatestSchemaMetadata(
      "user-registered-value"
    );
    return this.schemaRegistry.encode(schema.id, event);
  }
}
```

**Event Consumer:**

```typescript
// services/analytics-service/lib/events/UserEventConsumer.ts
export class UserEventConsumer {
  constructor(
    private kafka: Kafka,
    private schemaRegistry: SchemaRegistry,
    private analyticsService: AnalyticsService
  ) {}

  async startConsuming(): Promise<void> {
    const consumer = this.kafka.consumer({
      groupId: "analytics-service",
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });

    await consumer.connect();
    await consumer.subscribe({
      topics: ["user-events", "portfolio-events"],
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const span = tracer.startSpan("process-event");

        try {
          const eventType = message.headers?.eventType?.toString();
          const event = await this.deserializeEvent(message.value!);

          span.setAttributes({
            "event.type": eventType,
            "event.topic": topic,
            "event.partition": partition,
          });

          await this.processEvent(eventType, event);

          // Commit offset after successful processing
          await consumer.commitOffsets([
            {
              topic,
              partition,
              offset: (parseInt(message.offset) + 1).toString(),
            },
          ]);

          span.setStatus({ code: SpanStatusCode.OK });
        } catch (error) {
          span.recordException(error);
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
          });

          // Send to dead letter queue
          await this.sendToDeadLetterQueue(topic, message, error);
        } finally {
          span.end();
        }
      },
    });
  }

  private async processEvent(eventType: string, event: any): Promise<void> {
    switch (eventType) {
      case "UserRegistered":
        await this.analyticsService.trackUserRegistration(event);
        break;
      case "PortfolioUpdated":
        await this.analyticsService.trackPortfolioChange(event);
        break;
      default:
        console.warn(`Unknown event type: ${eventType}`);
    }
  }

  private async sendToDeadLetterQueue(
    originalTopic: string,
    message: KafkaMessage,
    error: Error
  ): Promise<void> {
    const producer = this.kafka.producer();
    await producer.connect();

    try {
      await producer.send({
        topic: `${originalTopic}-dlq`,
        messages: [
          {
            key: message.key,
            value: message.value,
            headers: {
              ...message.headers,
              "error.message": error.message,
              "error.timestamp": Date.now().toString(),
              "original.topic": originalTopic,
            },
          },
        ],
      });
    } finally {
      await producer.disconnect();
    }
  }
}
```

### ❓ Вопросы для изучения

1. **Источники событий**: Когда использовать источники событий против традиционного CRUD?
2. **Эволюция схем**: Как обеспечить обратную/прямую совместимость?
3. **Доставка точно один раз**: Как гарантировать обработку точно один раз?
4. **Упорядочение событий**: Как обеспечить упорядочение событий в распределенной системе?

---

## 📊 Общая оценка этапа 23

| Критерий                       | Баллы   | Описание                            |
| ------------------------------ | ------- | ----------------------------------- |
| **Микросервисная архитектура** | 50      | Service decomposition, API design   |
| **Service Mesh & Gateway**     | 40      | Istio configuration, Kong setup     |
| **Event-Driven Architecture**  | 40      | Kafka integration, event schemas    |
| **Observability**              | 30      | Distributed tracing, metrics        |
| **Production Readiness**       | 40      | Health checks, scaling, monitoring  |
| **Итого**                      | **200** | Минимум 140 для перехода к этапу 24 |

### 🎯 Следующий этап

После завершения этапа 23 переходим к **Этапу 24: Platform Engineering**.

---

## 🔬 Research Questions для Senior уровня

1. **Архитектурные компромиссы**: Как балансировать между консистентностью и доступностью в теореме CAP?

2. **Производительность при масштабировании**: Какие узкие места появляются при масштабировании до 1M+ пользователей?

3. **Оптимизация затрат**: Как оптимизировать расходы на облачную инфраструктуру в микросервисной архитектуре?

4. **Безопасность**: Как обеспечить безопасность в среде микросервисов с нулевым доверием?

5. **Выбор технологий**: Как принимать решения о выборе технологий на корпоративном уровне?

### 📚 Дополнительные материалы

- **Books**: "Microservices Patterns" by Chris Richardson
- **Papers**: "Life beyond Distributed Transactions" by Pat Helland
- **Conferences**: KubeCon, QCon, Craft Conference
- **Blogs**: High Scalability, Netflix Tech Blog, Uber Engineering
