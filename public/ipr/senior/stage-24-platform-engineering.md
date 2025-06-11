# Этап 24: Platform Engineering - Технические задания

## Задание 24.1: Внутренний портал разработчика с Backstage

### 🎯 Цель

Создать централизованную платформу для улучшения опыта разработчиков и автоматизации процессов

### 📋 Требования

#### Функциональные требования:

- [ ] Каталог сервисов с живой документацией
- [ ] Шаблоны для создания новых проектов
- [ ] Интеграция с системами мониторинга
- [ ] Автоматическое создание репозиториев и CI/CD
- [ ] Дашборд метрик команды разработки

#### Компоненты платформы:

- [ ] **Каталог сервисов**: Все микросервисы с документацией
- [ ] **Конструктор проектов**: Шаблоны для быстрого старта
- [ ] **Мониторинг**: Интеграция с Grafana и Prometheus
- [ ] **Документация**: Автогенерация API документации
- [ ] **Метрики команд**: Производительность разработки

### 💡 Подсказки

**Backstage каталог сервисов:**

```yaml
# backstage/catalog/user-service.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: user-service
  title: Сервис пользователей
  description: Управление профилями и аутентификацией пользователей
  tags:
    - microservice
    - authentication
    - nodejs
    - typescript
  annotations:
    github.com/project-slug: crypto-hub/user-service
    backstage.io/kubernetes-id: user-service
    grafana.com/dashboard-url: https://grafana.crypto-hub.com/d/users
spec:
  type: service
  lifecycle: production
  owner: user-team
  system: crypto-platform
  dependsOn:
    - component:auth-service
    - resource:user-database
  providesApis:
    - user-api
---
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: user-api
  title: API пользователей
  description: REST API для управления пользователями
spec:
  type: openapi
  lifecycle: production
  owner: user-team
  system: crypto-platform
  definition:
    $text: ./openapi.yaml
---
apiVersion: backstage.io/v1alpha1
kind: Resource
metadata:
  name: user-database
  title: База данных пользователей
  description: PostgreSQL база для пользовательских данных
spec:
  type: database
  owner: user-team
  system: crypto-platform
```

**Шаблон для создания нового сервиса:**

```yaml
# backstage/templates/microservice-template.yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: microservice-template
  title: Новый микросервис
  description: Создать новый микросервис с полной настройкой CI/CD
  tags:
    - typescript
    - microservice
    - nuxt
spec:
  owner: platform-team
  type: service
  parameters:
    - title: Основная информация
      required:
        - name
        - description
        - owner
      properties:
        name:
          title: Название сервиса
          type: string
          pattern: "^[a-z0-9-]+$"
          description: Имя должно содержать только строчные буквы, цифры и дефисы
        description:
          title: Описание
          type: string
          description: Краткое описание назначения сервиса
        owner:
          title: Команда-владелец
          type: string
          ui:field: OwnerPicker
          ui:options:
            catalogFilter:
              kind: [Group, User]

    - title: Техническая конфигурация
      properties:
        database:
          title: Требуется база данных
          type: boolean
          default: true
        redis:
          title: Требуется Redis
          type: boolean
          default: false
        queue:
          title: Требуется очередь сообщений
          type: boolean
          default: false

  steps:
    - id: fetch-template
      name: Получение шаблона
      action: fetch:template
      input:
        url: ./skeleton
        values:
          name: ${{ parameters.name }}
          description: ${{ parameters.description }}
          owner: ${{ parameters.owner }}
          database: ${{ parameters.database }}
          redis: ${{ parameters.redis }}
          queue: ${{ parameters.queue }}

    - id: create-repo
      name: Создание репозитория
      action: publish:github
      input:
        allowedHosts: ["github.com"]
        description: ${{ parameters.description }}
        repoUrl: github.com?repo=${{ parameters.name }}&owner=crypto-hub
        defaultBranch: main

    - id: setup-kubernetes
      name: Настройка Kubernetes
      action: kubernetes:apply
      input:
        manifestPath: kubernetes/
        namespace: default

    - id: setup-ci
      name: Настройка CI/CD
      action: github:actions:create
      input:
        repoUrl: github.com?repo=${{ parameters.name }}&owner=crypto-hub
        workflowPath: .github/workflows/ci.yml

    - id: register-catalog
      name: Регистрация в каталоге
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps.create-repo.output.repoContentsUrl }}
        catalogInfoPath: /catalog-info.yaml

  output:
    links:
      - title: Репозиторий
        url: ${{ steps.create-repo.output.remoteUrl }}
      - title: Компонент в каталоге
        url: ${{ steps.register-catalog.output.catalogInfoUrl }}
      - title: CI/CD Pipeline
        url: ${{ steps.create-repo.output.remoteUrl }}/actions
```

**Плагин метрик команды:**

```typescript
// backstage/plugins/team-metrics/src/components/TeamDashboard.tsx
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import { InfoCard, Progress, LineChart } from '@backstage/core-components';

interface TeamMetrics {
  deploymentFrequency: number;
  leadTime: number;
  failureRate: number;
  recoveryTime: number;
  codeQuality: {
    coverage: number;
    duplications: number;
    bugs: number;
  };
}

export const TeamDashboard = ({ team }: { team: string }) => {
  const [metrics, setMetrics] = React.useState<TeamMetrics | null>(null);

  React.useEffect(() => {
    // Загрузка метрик из API
    fetch(`/api/team-metrics/${team}`)
      .then(res => res.json())
      .then(setMetrics);
  }, [team]);

  if (!metrics) {
    return <Progress />;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <InfoCard title="Частота развертываний">
          <Typography variant="h4">
            {metrics.deploymentFrequency} в день
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Цель: 10+ развертываний в день
          </Typography>
        </InfoCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <InfoCard title="Время выполнения задачи">
          <Typography variant="h4">
            {metrics.leadTime} часов
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            От коммита до продакшена
          </Typography>
        </InfoCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <InfoCard title="Частота отказов">
          <Typography variant="h4" style={{
            color: metrics.failureRate > 5 ? 'red' : 'green'
          }}>
            {metrics.failureRate}%
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Процент неудачных развертываний
          </Typography>
        </InfoCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <InfoCard title="Время восстановления">
          <Typography variant="h4">
            {metrics.recoveryTime} минут
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Среднее время до восстановления
          </Typography>
        </InfoCard>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Качество кода
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2">Покрытие тестами</Typography>
                <Typography variant="h5">{metrics.codeQuality.coverage}%</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2">Дублирование кода</Typography>
                <Typography variant="h5">{metrics.codeQuality.duplications}%</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2">Количество багов</Typography>
                <Typography variant="h5">{metrics.codeQuality.bugs}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
```

### ❓ Вопросы для изучения

1. **Опыт разработчика**: Какие метрики позволяют измерить эффективность платформы разработки?
2. **Шаблоны проектов**: Как создать универсальные шаблоны, которые покрывают 80% случаев?
3. **Самообслуживание**: Как дать командам возможность самостоятельно создавать сервисы без участия платформенной команды?
4. **Стандартизация**: Как найти баланс между стандартизацией и гибкостью для команд?

### 🔍 Критерии оценки

- [ ] **Каталог сервисов** (30): Полнота и актуальность информации
- [ ] **Шаблоны** (25): Покрытие основных сценариев
- [ ] **Автоматизация** (25): Степень автоматизации создания проектов
- [ ] **Метрики** (20): Релевантность и полезность дашбордов

---

## Задание 24.2: CI/CD платформа с GitOps

### 🎯 Цель

Создать полностью автоматизированную платформу непрерывной интеграции и развертывания

### 📋 Требования

#### Архитектурные требования:

- [ ] GitOps workflow с ArgoCD
- [ ] Многоэтапные пайплайны (dev → staging → prod)
- [ ] Автоматические откаты при проблемах
- [ ] Сканирование безопасности в CI
- [ ] Автоматическое тестирование производительности

#### Компоненты CI/CD:

- [ ] **Сборка**: Docker образы с многоэтапной сборкой
- [ ] **Тестирование**: Unit, интеграционные, E2E тесты
- [ ] **Безопасность**: SAST, DAST, сканирование зависимостей
- [ ] **Развертывание**: GitOps с проверками качества
- [ ] **Мониторинг**: Отслеживание метрик после развертывания

### 💡 Подсказки

**GitOps репозиторий структура:**

```
gitops-configs/
├── applications/
│   ├── user-service/
│   │   ├── base/
│   │   │   ├── kustomization.yaml
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── configmap.yaml
│   │   ├── overlays/
│   │   │   ├── development/
│   │   │   ├── staging/
│   │   │   └── production/
│   │   └── application.yaml
├── argocd/
│   ├── projects/
│   └── applications/
└── infrastructure/
    ├── monitoring/
    ├── security/
    └── networking/
```

**ArgoCD Application манифест:**

```yaml
# gitops-configs/applications/user-service/application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: user-service
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: crypto-platform
  source:
    repoURL: https://github.com/crypto-hub/gitops-configs
    targetRevision: HEAD
    path: applications/user-service/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
      - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
  revisionHistoryLimit: 10
  info:
    - name: Команда
      value: user-team
    - name: Slack
      value: "#user-service"
---
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: crypto-platform
  namespace: argocd
spec:
  description: Проект для всех сервисов crypto-platform
  sourceRepos:
    - "https://github.com/crypto-hub/*"
  destinations:
    - namespace: "production"
      server: https://kubernetes.default.svc
    - namespace: "staging"
      server: https://kubernetes.default.svc
  clusterResourceWhitelist:
    - group: ""
      kind: Namespace
    - group: rbac.authorization.k8s.io
      kind: ClusterRole
  namespaceResourceWhitelist:
    - group: ""
      kind: ConfigMap
    - group: ""
      kind: Service
    - group: apps
      kind: Deployment
    - group: networking.k8s.io
      kind: Ingress
  roles:
    - name: developer
      description: Разработчики с доступом только на чтение
      policies:
        - p, proj:crypto-platform:developer, applications, get, crypto-platform/*, allow
        - p, proj:crypto-platform:developer, repositories, get, *, allow
      groups:
        - crypto-hub:developers
    - name: admin
      description: Администраторы с полным доступом
      policies:
        - p, proj:crypto-platform:admin, applications, *, crypto-platform/*, allow
        - p, proj:crypto-platform:admin, repositories, *, *, allow
      groups:
        - crypto-hub:platform-team
```

**GitHub Actions workflow с безопасностью:**

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout кода
        uses: actions/checkout@v4

      - name: Настройка Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Установка зависимостей
        run: npm ci

      - name: Проверка типов TypeScript
        run: npm run typecheck

      - name: Линтинг кода
        run: npm run lint

      - name: Модульные тесты
        run: npm run test:unit

      - name: Интеграционные тесты
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

      - name: Сканирование зависимостей
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: Статический анализ безопасности
        uses: github/codeql-action/analyze@v2
        with:
          languages: typescript

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    outputs:
      image-digest: ${{ steps.build.outputs.digest }}
    steps:
      - name: Checkout кода
        uses: actions/checkout@v4

      - name: Настройка Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Вход в Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Извлечение метаданных
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Сборка и push образа
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Сканирование образа на уязвимости
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          format: "sarif"
          output: "trivy-results.sarif"

      - name: Загрузка результатов Trivy
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: "trivy-results.sarif"

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout GitOps репозитория
        uses: actions/checkout@v4
        with:
          repository: crypto-hub/gitops-configs
          token: ${{ secrets.GITOPS_TOKEN }}
          path: gitops

      - name: Обновление образа в GitOps
        run: |
          cd gitops

          # Обновляем тег образа
          sed -i "s|image: .*|image: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}@${{ needs.build.outputs.image-digest }}|" \
            applications/user-service/overlays/production/kustomization.yaml

          # Коммитим изменения
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "feat: обновление ${{ github.repository }} до ${{ github.sha }}"
          git push

  performance-test:
    needs: deploy
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout кода
        uses: actions/checkout@v4

      - name: Нагрузочное тестирование
        uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/performance/load-test.js
        env:
          API_BASE_URL: https://api-staging.crypto-learning-hub.com

      - name: Проверка SLA
        run: |
          # Проверяем метрики производительности
          RESPONSE_TIME=$(curl -s "https://prometheus.crypto-hub.com/api/v1/query?query=http_request_duration_seconds{job='user-service'}" | jq -r '.data.result[0].value[1]')

          if (( $(echo "$RESPONSE_TIME > 0.1" | bc -l) )); then
            echo "❌ Превышено время ответа SLA: ${RESPONSE_TIME}s > 0.1s"
            exit 1
          fi

          echo "✅ SLA выполнено: время ответа ${RESPONSE_TIME}s"
```

### ❓ Вопросы для изучения

1. **GitOps**: Какие преимущества дает GitOps подход по сравнению с push-based развертыванием?
2. **Безопасность**: Как интегрировать проверки безопасности в CI без замедления процесса?
3. **Откаты**: Как реализовать автоматические откаты при обнаружении проблем?
4. **Прогрессивные развертывания**: Как реализовать canary и blue-green развертывания?

---

## 📊 Общая оценка этапа 24

| Критерий                 | Баллы   | Описание                                 |
| ------------------------ | ------- | ---------------------------------------- |
| **Портал разработчика**  | 40      | Backstage каталог, шаблоны, дашборды     |
| **CI/CD автоматизация**  | 40      | GitOps, безопасность, тестирование       |
| **Опыт разработчика**    | 30      | Простота использования, самообслуживание |
| **Метрики и мониторинг** | 30      | Измерение эффективности платформы        |
| **Итого**                | **140** | Минимум 98 для перехода к этапу 25       |

### 🎯 Следующий этап

После завершения этапа 24 переходим к **Этапу 25: Data Engineering & Analytics**.
