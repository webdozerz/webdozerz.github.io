# 📊 Этап 20: Мониторинг и аналитика - Мониторинг и аналитика производительности

## 📋 Общая информация

**Продолжительность:** 3 недели  
**Сложность:** Высокая  
**Предварительные требования:** Завершенные этапы 11-19

## 🎯 Цели этапа

### Основные задачи:

- ✅ Настроить комплексный мониторинг производительности приложения
- ✅ Внедрить системы сбора и анализа метрик (Prometheus, Grafana)
- ✅ Создать систему журналирования и трассировки (стек ELK, Jaeger)
- ✅ Настроить мониторинг пользовательского опыта (мониторинг реальных пользователей, основные веб-показатели)
- ✅ Внедрить бизнес-аналитику и отслеживание конверсий
- ✅ Создать предупреждения и уведомления о критических событиях
- ✅ Построить панели мониторинга для различных заинтересованных сторон

## 🛠️ Технологический стек

### Мониторинг инфраструктуры

- **Prometheus** - сбор метрик инфраструктуры
- **Grafana** - визуализация и панели мониторинга
- **AlertManager** - управление предупреждениями
- **Node Exporter** - метрики системы

### Мониторинг производительности приложений

- **Sentry** - отслеживание ошибок и мониторинг производительности
- **New Relic / DataDog** - решения для мониторинга производительности приложений
- **Jaeger** - распределенная трассировка
- **Zipkin** - альтернативная трассировка

### Логирование и поиск

- **Стек ELK** (Elasticsearch, Logstash, Kibana)
- **Fluentd** - сборщик журналов
- **Loki** - облегченное логирование
- **Vector** - конвейер данных наблюдаемости

### Мониторинг пользовательского опыта

- **Google Analytics 4** - веб-аналитика
- **Hotjar** - аналитика поведения пользователей
- **LogRocket** - воспроизведение сессий
- **Web Vitals** - метрики производительности

## 📚 Функциональные требования

### 📈 20.1 Конфигурация Prometheus

```yaml
# monitoring/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"
  - "recording_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

scrape_configs:
  # Application metrics
  - job_name: "crypto-learning-hub-frontend"
    static_configs:
      - targets: ["frontend:3000"]
    metrics_path: /api/_health/metrics
    scrape_interval: 5s

  - job_name: "crypto-learning-hub-api"
    static_configs:
      - targets: ["api:3001"]
    metrics_path: /health/metrics
    scrape_interval: 5s

  # Infrastructure metrics
  - job_name: "node-exporter"
    static_configs:
      - targets: ["node-exporter:9100"]

  # Blockchain metrics
  - job_name: "blockchain-monitor"
    static_configs:
      - targets: ["blockchain-monitor:8080"]
```

```yaml
# monitoring/prometheus/alert_rules.yml
groups:
  - name: application.rules
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile latency is {{ $value }}s"

      - alert: LowDiskSpace
        expr: node_filesystem_free_bytes / node_filesystem_size_bytes < 0.1
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space"
          description: "Disk usage is above 90%"

      - alert: BlockchainConnectionLost
        expr: up{job="blockchain-monitor"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Blockchain connection lost"
          description: "Unable to connect to blockchain network"
```

### 📊 20.2 Grafana Dashboards

```json
// monitoring/grafana/dashboards/application-overview.json
{
  "dashboard": {
    "id": null,
    "title": "Crypto Learning Hub - Application Overview",
    "tags": ["crypto", "application"],
    "timezone": "browser",
    "panels": [
      {
        "title": "Request Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m]))",
            "legendFormat": "Requests/sec"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "reqps",
            "min": 0
          }
        }
      },
      {
        "title": "Error Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m])) * 100",
            "legendFormat": "Error Rate %"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "percent",
            "min": 0,
            "max": 100,
            "thresholds": {
              "steps": [
                { "color": "green", "value": null },
                { "color": "yellow", "value": 1 },
                { "color": "red", "value": 5 }
              ]
            }
          }
        }
      },
      {
        "title": "Response Time Distribution",
        "type": "heatmap",
        "targets": [
          {
            "expr": "increase(http_request_duration_seconds_bucket[5m])",
            "legendFormat": "{{le}}"
          }
        ]
      },
      {
        "title": "Active WebSocket Connections",
        "type": "timeseries",
        "targets": [
          {
            "expr": "websocket_connections_active",
            "legendFormat": "Active Connections"
          }
        ]
      }
    ]
  }
}
```

### 🔍 20.3 Application Metrics Implementation

```typescript
// monitoring/metrics.ts
import { createPrometheusMetrics } from "@prometheus/client";

// Custom metrics for crypto application
const cryptoPriceUpdateCounter = new prometheus.Counter({
  name: "crypto_price_updates_total",
  help: "Total number of crypto price updates",
  labelNames: ["symbol", "source"],
});

const tradingOperationDuration = new prometheus.Histogram({
  name: "trading_operation_duration_seconds",
  help: "Duration of trading operations",
  labelNames: ["operation", "pair"],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

const walletConnectionsGauge = new prometheus.Gauge({
  name: "wallet_connections_active",
  help: "Number of active wallet connections",
  labelNames: ["wallet_type"],
});

const blockchainTransactionCounter = new prometheus.Counter({
  name: "blockchain_transactions_total",
  help: "Total blockchain transactions",
  labelNames: ["network", "status"],
});

// Metrics collection middleware
export const collectMetrics = () => {
  return {
    // Track price updates
    recordPriceUpdate: (symbol: string, source: string) => {
      cryptoPriceUpdateCounter.labels(symbol, source).inc();
    },

    // Track trading operations
    recordTradingOperation: (
      operation: string,
      pair: string,
      duration: number
    ) => {
      tradingOperationDuration.labels(operation, pair).observe(duration);
    },

    // Update wallet connections
    updateWalletConnections: (walletType: string, count: number) => {
      walletConnectionsGauge.labels(walletType).set(count);
    },

    // Track blockchain transactions
    recordBlockchainTransaction: (network: string, status: string) => {
      blockchainTransactionCounter.labels(network, status).inc();
    },
  };
};
```

### 🐛 20.4 Error Tracking with Sentry

```typescript
// monitoring/sentry.ts
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

export const initSentry = (app: any) => {
  Sentry.init({
    app,
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: ["localhost", "cryptohub.com", /^\//],
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      // Filter out non-critical errors
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.type === "ChunkLoadError") {
          return null; // Skip chunk load errors
        }
      }
      return event;
    },
  });

  // Custom error tracking for crypto operations
  const trackCryptoError = (operation: string, error: Error, context?: any) => {
    Sentry.withScope((scope) => {
      scope.setTag("operation", operation);
      scope.setContext("crypto", context);
      Sentry.captureException(error);
    });
  };

  // Performance monitoring for Web3 operations
  const trackWeb3Performance = (operation: string) => {
    const transaction = Sentry.startTransaction({
      name: `Web3 ${operation}`,
      op: "web3",
    });

    return {
      finish: () => transaction.finish(),
      setStatus: (status: string) => transaction.setStatus(status),
    };
  };

  return { trackCryptoError, trackWeb3Performance };
};
```

### 📋 20.5 Structured Logging

```typescript
// monitoring/logger.ts
import winston from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";

const esTransport = new ElasticsearchTransport({
  level: "info",
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  },
  index: "crypto-learning-hub-logs",
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: "crypto-learning-hub",
    environment: process.env.NODE_ENV,
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    esTransport,
  ],
});

// Structured logging for different events
export const logEvents = {
  userAction: (userId: string, action: string, details: any) => {
    logger.info("User action", {
      userId,
      action,
      details,
      category: "user_behavior",
    });
  },

  tradingActivity: (userId: string, operation: string, details: any) => {
    logger.info("Trading activity", {
      userId,
      operation,
      details,
      category: "trading",
    });
  },

  blockchainEvent: (network: string, event: string, details: any) => {
    logger.info("Blockchain event", {
      network,
      event,
      details,
      category: "blockchain",
    });
  },

  securityEvent: (type: string, details: any) => {
    logger.warn("Security event", {
      type,
      details,
      category: "security",
    });
  },
};
```

### 📱 20.6 Real User Monitoring (RUM)

```typescript
// monitoring/rum.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

// Core Web Vitals monitoring
export const initWebVitals = () => {
  const sendToAnalytics = (metric: any) => {
    // Send to Google Analytics
    gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    });

    // Send to custom analytics
    fetch("/api/analytics/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metric),
    });
  };

  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
};

// Custom performance tracking
export const performanceTracker = {
  // Track page load performance
  trackPageLoad: (routeName: string) => {
    const startTime = performance.mark("page-load-start");

    window.addEventListener("load", () => {
      const endTime = performance.mark("page-load-end");
      const measure = performance.measure(
        "page-load",
        "page-load-start",
        "page-load-end"
      );

      // Send to analytics
      gtag("event", "page_load_time", {
        event_category: "Performance",
        event_label: routeName,
        value: Math.round(measure.duration),
      });
    });
  },

  // Track user interactions
  trackInteraction: (element: string, action: string) => {
    const startTime = performance.now();

    return {
      end: () => {
        const duration = performance.now() - startTime;
        gtag("event", "interaction_time", {
          event_category: "UX",
          event_label: `${element}_${action}`,
          value: Math.round(duration),
        });
      },
    };
  },

  // Track API response times
  trackApiCall: (endpoint: string, method: string) => {
    const startTime = performance.now();

    return {
      success: () => {
        const duration = performance.now() - startTime;
        gtag("event", "api_response_time", {
          event_category: "API",
          event_label: `${method}_${endpoint}`,
          value: Math.round(duration),
        });
      },
      error: (status: number) => {
        gtag("event", "api_error", {
          event_category: "API",
          event_label: `${method}_${endpoint}`,
          value: status,
        });
      },
    };
  },
};
```

### 🎯 20.7 Business Analytics

```typescript
// analytics/business.ts
import { ga4 } from "@/plugins/gtag";

export const businessAnalytics = {
  // Track user registration funnel
  trackRegistrationStep: (step: string, userId?: string) => {
    ga4.event("registration_step", {
      step_name: step,
      user_id: userId,
    });
  },

  // Track trading activities
  trackTrade: (details: {
    pair: string;
    amount: number;
    type: "buy" | "sell";
    userId: string;
  }) => {
    ga4.event("trade_executed", {
      currency: details.pair,
      value: details.amount,
      trade_type: details.type,
      user_id: details.userId,
    });
  },

  // Track learning progress
  trackLearningProgress: (userId: string, lesson: string, progress: number) => {
    ga4.event("learning_progress", {
      lesson_name: lesson,
      progress_percentage: progress,
      user_id: userId,
    });
  },

  // Track wallet connections
  trackWalletConnection: (walletType: string, success: boolean) => {
    ga4.event("wallet_connection", {
      wallet_type: walletType,
      success: success,
    });
  },

  // Track conversions
  trackConversion: (type: string, value?: number) => {
    ga4.event("conversion", {
      conversion_type: type,
      value: value,
    });
  },
};
```

## 🚀 Технические требования

### 📋 20.1 Docker Compose Monitoring Stack

```yaml
# docker-compose.monitoring.yml
version: "3.8"

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--web.console.libraries=/etc/prometheus/console_libraries"
      - "--web.console.templates=/etc/prometheus/consoles"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
      - ./monitoring/grafana/dashboards:/var/lib/grafana/dashboards
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

  alertmanager:
    image: prom/alertmanager:latest
    ports:
      - "9093:9093"
    volumes:
      - ./monitoring/alertmanager:/etc/alertmanager

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"
      - "14268:14268"
    environment:
      - COLLECTOR_OTLP_ENABLED=true

volumes:
  prometheus_data:
  grafana_data:
  elasticsearch_data:
```

### 🔔 20.2 Alert Manager Configuration

```yaml
# monitoring/alertmanager/alertmanager.yml
global:
  smtp_smarthost: "localhost:587"
  smtp_from: "alerts@cryptohub.com"

route:
  group_by: ["alertname"]
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: "web.hook"
  routes:
    - match:
        severity: critical
      receiver: "critical-alerts"
    - match:
        severity: warning
      receiver: "warning-alerts"

receivers:
  - name: "web.hook"
    webhook_configs:
      - url: "http://api:3001/webhooks/alerts"

  - name: "critical-alerts"
    slack_configs:
      - api_url: "YOUR_SLACK_WEBHOOK_URL"
        channel: "#critical-alerts"
        title: "Critical Alert"
        text: "{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}"
    email_configs:
      - to: "admin@cryptohub.com"
        subject: "Critical Alert: {{ .GroupLabels.alertname }}"
        body: "{{ range .Alerts }}{{ .Annotations.description }}{{ end }}"

  - name: "warning-alerts"
    slack_configs:
      - api_url: "YOUR_SLACK_WEBHOOK_URL"
        channel: "#warnings"
        title: "Warning"
        text: "{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}"
```

## 🎯 Критерии оценки

### ⭐ Обязательные требования (100 баллов)

1. **Infrastructure Monitoring (25 баллов)**

   - Prometheus метрики для всех сервисов
   - Grafana дашборды с key metrics
   - Alerting для критических событий
   - Resource utilization monitoring

2. **Application Performance Monitoring (25 баллов)**

   - Error tracking с Sentry
   - Performance monitoring
   - Distributed tracing
   - Custom business metrics

3. **Logging & Search (20 баллов)**

   - Structured logging
   - Centralized log collection
   - Log search и analysis
   - Log retention policies

4. **User Experience Monitoring (20 баллов)**

   - Core Web Vitals tracking
   - Real User Monitoring
   - Business analytics
   - Conversion tracking

5. **Alerting & Notifications (10 баллов)**
   - Multi-channel notifications
   - Alert escalation
   - On-call management
   - Alert fatigue prevention

### 🚀 Дополнительные задания (50 баллов)

1. **Advanced Analytics (20 баллов)**

   - Custom analytics platform
   - Predictive analytics
   - Cohort analysis
   - A/B testing framework

2. **Security Monitoring (15 баллов)**

   - Security event correlation
   - Anomaly detection
   - Threat intelligence integration
   - Compliance reporting

3. **Business Intelligence (10 баллов)**

   - Executive dashboards
   - KPI tracking
   - Revenue analytics
   - Customer insights

4. **Automation & ML (5 баллов)**
   - Automated incident response
   - Anomaly detection with ML
   - Predictive scaling

## 📊 Процесс выполнения

### Неделя 1: Infrastructure Monitoring

- Настройка Prometheus и Grafana
- Создание базовых дашбордов
- Настройка алертов
- Интеграция с приложением

### Неделя 2: Application & User Monitoring

- Внедрение Sentry для error tracking
- Настройка RUM и Web Vitals
- Создание custom metrics
- Business analytics integration

### Неделя 3: Advanced Features & Optimization

- Distributed tracing setup
- Advanced dashboards
- Alert fine-tuning
- Documentation и training

## 🔍 Вопросы для изучения

1. **Monitoring Strategy:**

   - Какие метрики наиболее важны для crypto приложения?
   - Как балансировать детализацию и производительность?

2. **Alerting Best Practices:**

   - Как избежать alert fatigue?
   - Когда использовать разные уровни severity?

3. **Performance Analysis:**

   - Как интерпретировать Core Web Vitals?
   - Какие performance patterns искать?

4. **Business Impact:**
   - Как связать технические метрики с бизнес-результатами?
   - Какие KPI отслеживать для crypto платформы?

## 📈 Ожидаемые результаты

По завершении этапа вы получите:

- 📊 **Comprehensive monitoring** - полная наблюдаемость системы
- 🔍 **Deep insights** - детальная аналитика производительности
- 🚨 **Proactive alerting** - раннее обнаружение проблем
- 📈 **Business intelligence** - данные для принятия решений
- 🎯 **User experience optimization** - инструменты для улучшения UX

Этот этап обеспечивает data-driven подход к управлению и оптимизации приложения.
