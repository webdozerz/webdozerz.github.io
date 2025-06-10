# 🐳 Этап 19: DevOps & Deployment - Контейнеризация и автоматизация развертывания

## 📋 Общая информация

**Продолжительность:** 4 недели  
**Сложность:** High  
**Предварительные требования:** Завершенные этапы 11-18

## 🎯 Цели этапа

### Основные задачи:

- ✅ Настроить контейнеризацию приложения с Docker
- ✅ Создать многоэтапные Docker образы для оптимизации
- ✅ Внедрить Docker Compose для локальной разработки
- ✅ Настроить автоматизированное развертывание (CI/CD)
- ✅ Создать Kubernetes манифесты для production
- ✅ Настроить мониторинг и логирование
- ✅ Внедрить Blue-Green или Canary деплой стратегии

## 🛠️ Технологический стек

### Containerization

- **Docker** - контейнеризация приложений
- **Docker Compose** - оркестрация локальной среды
- **Multi-stage builds** - оптимизация образов
- **Distroless images** - безопасные production образы

### Orchestration

- **Kubernetes** - оркестрация контейнеров в production
- **Helm** - управление Kubernetes приложениями
- **Ingress Controllers** - маршрутизация трафика
- **Service Mesh** - коммуникация между сервисами

### CI/CD Platforms

- **GitHub Actions** - автоматизация пайплайнов
- **Vercel** - современные frontend deployments
- **Docker Hub** - реестр Docker образов
- **ArgoCD** - GitOps развертывания

### Monitoring & Logging

- **Prometheus** - метрики
- **Grafana** - визуализация
- **Loki** - логирование
- **Jaeger** - трассировка

## 📚 Функциональные требования

### 🐳 19.1 Docker Configuration

```dockerfile
# Dockerfile.frontend
# Multi-stage build для оптимизации размера
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS production
# Копируем кастомную конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/.output/public /usr/share/nginx/html

# Добавляем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && adduser -S nuxtjs -u 1001
USER nuxtjs

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# Dockerfile.api
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS dependencies
COPY package*.json ./
RUN npm ci

FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs18-debian11 AS production
WORKDIR /app
COPY --from=build /app/.output ./
COPY --from=build /app/node_modules ./node_modules

USER 1001
EXPOSE 3001
CMD ["server/index.mjs"]
```

### 🔧 19.2 Docker Compose для локальной разработки

```yaml
# docker-compose.yml
version: "3.8"

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
      target: development
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - NUXT_API_BASE_URL=http://api:3001
    depends_on:
      - api
      - redis
      - postgres

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
      target: development
    ports:
      - "3001:3001"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://crypto:password@postgres:5432/crypto_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=crypto_db
      - POSTGRES_USER=crypto
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - api

volumes:
  postgres_data:
  redis_data:
```

### ⚙️ 19.3 Nginx Configuration

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream api {
        server api:3001;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=frontend:10m rate=30r/s;

    server {
        listen 80;
        server_name localhost;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # Frontend routes
        location / {
            limit_req zone=frontend burst=20 nodelay;
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API routes
        location /api/ {
            limit_req zone=api burst=10 nodelay;
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket support
        location /ws {
            proxy_pass http://api;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
    }
}
```

### 🚀 19.4 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
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

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
      image-digest: ${{ steps.build.outputs.digest }}

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-

      - name: Build and push
        id: build
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile.frontend
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    if: github.ref == 'refs/heads/staging'
    needs: build
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - name: Deploy to Staging
        uses: azure/k8s-deploy@v1
        with:
          manifests: |
            k8s/staging/deployment.yaml
            k8s/staging/service.yaml
            k8s/staging/ingress.yaml
          images: ${{ needs.build.outputs.image-tag }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Blue-Green Deployment
        run: |
          # Implement blue-green deployment logic
          echo "Deploying to production with blue-green strategy"

      - name: Deploy to Production
        uses: azure/k8s-deploy@v1
        with:
          manifests: |
            k8s/production/deployment.yaml
            k8s/production/service.yaml
            k8s/production/ingress.yaml
          images: ${{ needs.build.outputs.image-tag }}
```

### ☸️ 19.5 Kubernetes Manifests

```yaml
# k8s/production/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: crypto-learning-hub-frontend
  namespace: production
  labels:
    app: crypto-learning-hub
    component: frontend
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: crypto-learning-hub
      component: frontend
  template:
    metadata:
      labels:
        app: crypto-learning-hub
        component: frontend
    spec:
      containers:
        - name: frontend
          image: ghcr.io/username/crypto-learning-hub:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
            - name: NUXT_API_BASE_URL
              value: "https://api.cryptohub.com"
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
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
          securityContext:
            runAsNonRoot: true
            runAsUser: 1001
            allowPrivilegeEscalation: false
            capabilities:
              drop:
                - ALL
```

```yaml
# k8s/production/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: crypto-learning-hub-frontend-service
  namespace: production
spec:
  selector:
    app: crypto-learning-hub
    component: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
```

```yaml
# k8s/production/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: crypto-learning-hub-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
    - hosts:
        - cryptohub.com
        - www.cryptohub.com
      secretName: cryptohub-tls
  rules:
    - host: cryptohub.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: crypto-learning-hub-frontend-service
                port:
                  number: 80
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: crypto-learning-hub-api-service
                port:
                  number: 80
```

### 📊 19.6 Monitoring Setup

```yaml
# k8s/monitoring/prometheus.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'crypto-learning-hub'
      static_configs:
      - targets: ['frontend-service:3000', 'api-service:3001']
      metrics_path: /metrics
      scrape_interval: 5s
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
        - name: prometheus
          image: prom/prometheus:latest
          ports:
            - containerPort: 9090
          volumeMounts:
            - name: config
              mountPath: /etc/prometheus/prometheus.yml
              subPath: prometheus.yml
      volumes:
        - name: config
          configMap:
            name: prometheus-config
```

### 🎯 19.7 Helm Chart

```yaml
# helm/crypto-learning-hub/Chart.yaml
apiVersion: v2
name: crypto-learning-hub
description: Crypto Learning Hub Application
version: 1.0.0
appVersion: "1.0.0"
```

```yaml
# helm/crypto-learning-hub/values.yaml
replicaCount: 3

image:
  repository: ghcr.io/username/crypto-learning-hub
  tag: ""
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: cryptohub.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: cryptohub-tls
      hosts:
        - cryptohub.com

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

monitoring:
  enabled: true
  prometheus:
    enabled: true
  grafana:
    enabled: true
```

## 🚀 Технические требования

### 📋 19.1 Environment Configuration

```bash
# scripts/setup-env.sh
#!/bin/bash

# Create environment files
cat > .env.development <<EOF
NODE_ENV=development
DATABASE_URL=postgres://crypto:password@localhost:5432/crypto_db
REDIS_URL=redis://localhost:6379
NUXT_API_BASE_URL=http://localhost:3001
EOF

cat > .env.staging <<EOF
NODE_ENV=staging
DATABASE_URL=\${DATABASE_URL}
REDIS_URL=\${REDIS_URL}
NUXT_API_BASE_URL=https://api-staging.cryptohub.com
EOF

cat > .env.production <<EOF
NODE_ENV=production
DATABASE_URL=\${DATABASE_URL}
REDIS_URL=\${REDIS_URL}
NUXT_API_BASE_URL=https://api.cryptohub.com
EOF
```

### 🛡️ 19.2 Security Scanning

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main, staging]
  schedule:
    - cron: "0 2 * * 1" # Weekly scan

jobs:
  vulnerability-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: "ghcr.io/${{ github.repository }}:latest"
          format: "sarif"
          output: "trivy-results.sarif"

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: "trivy-results.sarif"

  dependency-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### 📈 19.3 Performance Monitoring

```typescript
// monitoring/metrics.ts
import prometheus from "prom-client";

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

const httpRequestTotal = new prometheus.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

const activeConnections = new prometheus.Gauge({
  name: "websocket_connections_active",
  help: "Number of active WebSocket connections",
});

// Middleware для сбора метрик
export const metricsMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;

    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);

    httpRequestTotal.labels(req.method, route, res.statusCode).inc();
  });

  next();
};

// Endpoint для метрик
export const metricsHandler = async (req: any, res: any) => {
  res.set("Content-Type", prometheus.register.contentType);
  const metrics = await prometheus.register.metrics();
  res.send(metrics);
};
```

## 🎯 Критерии оценки

### ⭐ Обязательные требования (100 баллов)

1. **Docker Configuration (25 баллов)**

   - Multi-stage Docker builds
   - Оптимизированные размеры образов
   - Security best practices
   - Docker Compose для локальной разработки

2. **CI/CD Pipeline (25 баллов)**

   - Автоматизированное тестирование
   - Сборка и публикация образов
   - Automated deployments
   - Environment-specific configurations

3. **Kubernetes Deployment (25 баллов)**

   - Production-ready manifests
   - Health checks и probes
   - Resource limits и requests
   - Security contexts

4. **Monitoring & Logging (15 баллов)**

   - Prometheus метрики
   - Structured logging
   - Health endpoints
   - Performance monitoring

5. **Security Implementation (10 баллов)**
   - Vulnerability scanning
   - Secrets management
   - Network policies
   - RBAC configuration

### 🚀 Дополнительные задания (50 баллов)

1. **Advanced Deployment Strategies (20 баллов)**

   - Blue-Green deployment
   - Canary releases
   - Rolling updates с zero downtime
   - Rollback mechanisms

2. **Infrastructure as Code (15 баллов)**

   - Terraform/Pulumi конфигурация
   - Cloud provider integration
   - Automated infrastructure provisioning

3. **Service Mesh Integration (10 баллов)**

   - Istio/Linkerd setup
   - Traffic management
   - Security policies
   - Observability enhancement

4. **GitOps Implementation (5 баллов)**
   - ArgoCD/Flux setup
   - Git-based deployments
   - Automated sync

## 📊 Процесс выполнения

### Неделя 1: Containerization

- Создание Docker конфигураций
- Настройка Docker Compose
- Оптимизация образов
- Локальное тестирование

### Неделя 2: CI/CD Pipeline

- Настройка GitHub Actions
- Автоматизация тестов и сборки
- Container registry integration
- Environment configurations

### Неделя 3: Kubernetes Deployment

- Создание K8s манифестов
- Настройка Helm charts
- Production deployment
- Health checks и monitoring

### Неделя 4: Production Readiness

- Security hardening
- Performance optimization
- Monitoring setup
- Documentation

## 🔍 Вопросы для изучения

1. **Container Strategy:**

   - Как оптимизировать размер Docker образов?
   - Какие security best practices применять?

2. **Deployment Patterns:**

   - Когда использовать Blue-Green vs Canary deployment?
   - Как обеспечить zero-downtime deployments?

3. **Monitoring & Observability:**

   - Какие метрики наиболее важны для frontend приложений?
   - Как настроить эффективное логирование?

4. **Infrastructure Management:**
   - Как управлять секретами в Kubernetes?
   - Когда использовать Infrastructure as Code?

## 📈 Ожидаемые результаты

По завершении этапа вы получите:

- 🐳 **Production-ready containerization** - оптимизированные и безопасные образы
- 🚀 **Automated CI/CD** - полная автоматизация развертывания
- ☸️ **Kubernetes expertise** - навыки оркестрации контейнеров
- 📊 **Comprehensive monitoring** - полная наблюдаемость системы
- 🛡️ **Security hardening** - защищенная инфраструктура

Этот этап обеспечивает enterprise-уровень операционных возможностей и готовность к работе с production нагрузками.
