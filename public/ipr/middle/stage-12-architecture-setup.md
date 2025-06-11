# Этап 12: Настройка архитектуры и корпоративный проект - Детальные задания

## Задание 12.1: Корпоративная архитектура проекта

### 🎯 Цель

Спроектировать и настроить архитектуру корпоративного уровня для Crypto Learning Hub Advanced с использованием современных подходов к организации кода и инфраструктуры

### 📋 Требования

#### Функциональные требования:

- [ ] Структура единого хранилища с множественными приложениями
- [ ] Модульная архитектура с четким разделением ответственности
- [ ] Готовность к микроинтерфейсам (федерация модулей)
- [ ] Общие библиотеки и разделяемые компоненты
- [ ] Настраиваемая система окружений

#### Технические требования:

- [ ] Nx или Lerna для управления единым хранилищем
- [ ] Ссылки на проекты TypeScript
- [ ] Отображение путей и экспорт-бочки
- [ ] Общая система дизайна
- [ ] Оптимизация сборки и кэширование

### 🏗️ Архитектурная схема

```mermaid
graph TB
    subgraph "Crypto Learning Hub Advanced"
        A[Веб-приложение<br/>@clh/web] --> D[Общий интерфейс<br/>@clh/ui]
        B[Мобильное приложение<br/>@clh/mobile] --> D
        C[Расширение<br/>@clh/extension] --> D

        A --> E[Основные типы<br/>@clh/types]
        B --> E
        C --> E

        A --> F[Утилиты<br/>@clh/utils]
        B --> F
        C --> F

        A --> G[Конфигурация<br/>@clh/config]
        B --> G
        C --> G

        subgraph "Серверные службы"
            H[Служба аутентификации<br/>@clh/auth]
            I[Торговая служба<br/>@clh/trading]
            J[Служба аналитики<br/>@clh/analytics]
        end

        A --> H
        A --> I
        A --> J
    end

    style A fill:#4ecdc4
    style B fill:#ff6b6b
    style C fill:#45b7d1
    style D fill:#f9ca24
```

### 📁 Структура проекта

```
crypto-learning-hub-advanced/
├── apps/
│   ├── web/                    # Основное веб-приложение (Nuxt.js)
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── plugins/
│   │   ├── middleware/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── assets/
│   │   ├── nuxt.config.ts
│   │   └── package.json
│   │
│   ├── mobile/                 # React Native приложение
│   │   ├── src/
│   │   ├── android/
│   │   ├── ios/
│   │   ├── package.json
│   │   └── metro.config.js
│   │
│   └── extension/              # Браузерное расширение
│       ├── src/
│       ├── manifest.json
│       ├── webpack.config.js
│       └── package.json
│
├── packages/
│   ├── ui/                     # Shared компоненты и дизайн-система
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Modal/
│   │   │   │   ├── Chart/
│   │   │   │   ├── Wallet/
│   │   │   │   └── index.ts
│   │   │   ├── icons/
│   │   │   ├── tokens/         # Design tokens
│   │   │   ├── styles/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── types/                  # Общие TypeScript типы
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── blockchain/
│   │   │   ├── user/
│   │   │   ├── trading/
│   │   │   ├── analytics/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── utils/                  # Shared утилиты
│   │   ├── src/
│   │   │   ├── blockchain/
│   │   │   ├── formatting/
│   │   │   ├── validation/
│   │   │   ├── crypto/
│   │   │   ├── math/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── config/                 # Конфигурации и константы
│   │   ├── src/
│   │   │   ├── networks/
│   │   │   ├── tokens/
│   │   │   ├── api-endpoints/
│   │   │   ├── environments/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── api-client/             # API клиент
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── trading/
│   │   │   ├── analytics/
│   │   │   ├── blockchain/
│   │   │   ├── interceptors/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── web3/                   # Web3 интеграция
│       ├── src/
│       │   ├── providers/
│       │   ├── contracts/
│       │   ├── hooks/
│       │   ├── types/
│       │   └── index.ts
│       └── package.json
│
├── tools/
│   ├── build/                  # Build scripts и инструменты
│   │   ├── webpack/
│   │   ├── vite/
│   │   ├── rollup/
│   │   └── scripts/
│   │
│   ├── eslint-config/          # Shared ESLint конфигурация
│   │   ├── index.js
│   │   ├── react.js
│   │   ├── vue.js
│   │   └── package.json
│   │
│   └── tsconfig/               # Shared TypeScript конфигурации
│       ├── base.json
│       ├── nextjs.json
│       ├── react-native.json
│       └── package.json
│
├── docs/                       # Документация проекта
│   ├── architecture/
│   ├── api/
│   ├── deployment/
│   └── contributing/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   └── security.yml
│   └── templates/
│
├── docker/
│   ├── Dockerfile.web
│   ├── Dockerfile.api
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
│
├── nx.json                     # Nx конфигурация
├── workspace.json              # Workspace конфигурация
├── package.json                # Root package.json
├── tsconfig.base.json          # Base TypeScript config
├── .eslintrc.js               # Root ESLint config
├── .prettierrc                # Prettier config
└── turbo.json                 # Turbo конфигурация (альтернатива Nx)
```

### 📦 Package.json конфигурация

#### Root package.json

```json
{
  "name": "crypto-learning-hub-advanced",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*", "tools/*"],
  "scripts": {
    "build": "nx run-many --target=build --all",
    "dev": "nx run-many --target=dev --all --parallel",
    "test": "nx run-many --target=test --all",
    "lint": "nx run-many --target=lint --all",
    "type-check": "nx run-many --target=type-check --all",
    "clean": "nx reset && rm -rf node_modules dist",
    "web:dev": "nx serve web",
    "web:build": "nx build web",
    "mobile:ios": "nx run mobile:ios",
    "mobile:android": "nx run mobile:android",
    "extension:build": "nx build extension",
    "storybook": "nx storybook ui",
    "test:e2e": "nx e2e web-e2e",
    "format": "prettier --write .",
    "prepare": "husky install"
  },
  "devDependencies": {
    "@nx/workspace": "^17.0.0",
    "@nx/vite": "^17.0.0",
    "@nx/eslint-plugin": "^17.0.0",
    "@nx/jest": "^17.0.0",
    "@nx/storybook": "^17.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.50.0",
    "eslint-config-prettier": "^9.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^14.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.2.0",
    "vitest": "^0.34.0"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": ["eslint --fix", "prettier --write"],
    "*.{md,json,yml,yaml}": ["prettier --write"]
  }
}
```

### 🔧 TypeScript конфигурация

#### tsconfig.base.json

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es2015",
    "module": "esnext",
    "lib": ["es2020", "dom"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": ".",
    "paths": {
      "@clh/ui": ["packages/ui/src/index.ts"],
      "@clh/types": ["packages/types/src/index.ts"],
      "@clh/utils": ["packages/utils/src/index.ts"],
      "@clh/config": ["packages/config/src/index.ts"],
      "@clh/api-client": ["packages/api-client/src/index.ts"],
      "@clh/web3": ["packages/web3/src/index.ts"]
    }
  },
  "exclude": ["node_modules", "tmp"]
}
```

### 🎨 Design System Package

#### packages/ui/src/index.ts

```typescript
// Компоненты
export { Button } from './components/Button';
export { Input } from './components/Input';
export { Modal } from './components/Modal';
export { Chart } from './components/Chart';
export { WalletConnector } from './components/Wallet';

// Design tokens
export { theme } from './tokens/theme';
export { colors } from './tokens/colors';
export { spacing } from './tokens/spacing';
export { typography } from './tokens/typography';

// Icons
export * from './icons';

// Styles
export './styles/global.css';
export './styles/components.css';
```

#### packages/ui/src/components/Button/Button.vue

```vue
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <LoadingSpinner v-if="loading" class="mr-2" />
    <Icon v-if="icon && !loading" :name="icon" class="mr-2" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ButtonVariant, ButtonSize } from "@clh/types";

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClasses = computed(() => [
  "btn",
  `btn--${props.variant}`,
  `btn--${props.size}`,
  {
    "btn--disabled": props.disabled,
    "btn--loading": props.loading,
  },
]);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn--primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
  @apply focus:ring-blue-500;
}

.btn--secondary {
  @apply bg-gray-200 text-gray-900 hover:bg-gray-300;
  @apply focus:ring-gray-500;
}

.btn--outline {
  @apply border-2 border-blue-600 text-blue-600 hover:bg-blue-50;
  @apply focus:ring-blue-500;
}

.btn--ghost {
  @apply text-blue-600 hover:bg-blue-50;
  @apply focus:ring-blue-500;
}

.btn--xs {
  @apply px-2 py-1 text-xs;
}

.btn--sm {
  @apply px-3 py-1.5 text-sm;
}

.btn--md {
  @apply px-4 py-2 text-base;
}

.btn--lg {
  @apply px-6 py-3 text-lg;
}

.btn--xl {
  @apply px-8 py-4 text-xl;
}
</style>
```

### 🏗️ Задание 12.2: TypeScript Project References

#### apps/web/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowJs": true,
    "strict": true,
    "jsx": "preserve",
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "references": [
    {
      "path": "../../packages/ui"
    },
    {
      "path": "../../packages/types"
    },
    {
      "path": "../../packages/utils"
    },
    {
      "path": "../../packages/config"
    },
    {
      "path": "../../packages/api-client"
    },
    {
      "path": "../../packages/web3"
    }
  ],
  "include": ["**/*.ts", "**/*.tsx", "**/*.vue"],
  "exclude": ["node_modules", ".nuxt", "dist"]
}
```

### 🔧 Задание 12.3: Build система и оптимизация

#### nx.json

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "npmScope": "clh",
  "affected": {
    "defaultBase": "origin/main"
  },
  "cli": {
    "packageManager": "npm"
  },
  "plugins": [
    {
      "plugin": "@nx/vite/plugin",
      "options": {
        "buildTargetName": "build",
        "testTargetName": "test",
        "serveTargetName": "serve",
        "previewTargetName": "preview",
        "serveStaticTargetName": "serve-static"
      }
    }
  ],
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "cache": true
    },
    "test": {
      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"],
      "cache": true
    },
    "lint": {
      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"],
      "cache": true
    },
    "type-check": {
      "dependsOn": ["^build"],
      "inputs": ["default", "^production"],
      "cache": true
    }
  },
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/jest.config.[jt]s",
      "!{projectRoot}/.eslintrc.json"
    ],
    "sharedGlobals": []
  },
  "generators": {
    "@nx/react": {
      "application": {
        "style": "styled-components",
        "linter": "eslint",
        "bundler": "vite",
        "unitTestRunner": "vitest"
      },
      "component": {
        "style": "styled-components"
      },
      "library": {
        "style": "styled-components",
        "linter": "eslint",
        "unitTestRunner": "vitest"
      }
    },
    "@nx/vue": {
      "application": {
        "linter": "eslint",
        "unitTestRunner": "vitest",
        "e2eTestRunner": "playwright"
      }
    }
  }
}
```

### 🚀 Задание 12.4: Development Environment

#### docker-compose.yml

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: crypto_learning_hub
      POSTGRES_USER: developer
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./sql/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  mongodb:
    image: mongo:6
    environment:
      MONGO_INITDB_ROOT_USERNAME: developer
      MONGO_INITDB_ROOT_PASSWORD: dev_password
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://developer:dev_password@postgres:5432/crypto_learning_hub
      - REDIS_URL=redis://redis:6379
      - MONGODB_URL=mongodb://developer:dev_password@mongodb:27017
    depends_on:
      - postgres
      - redis
      - mongodb

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - web

volumes:
  postgres_data:
  redis_data:
  mongodb_data:
```

### 📊 Критерии оценки

#### Задание 12.1: Корпоративная архитектура (50 баллов)

- **Отлично (45-50 баллов):**

  - Четкая modular архитектура с правильным разделением ответственности
  - Настроенный monorepo с эффективной системой сборки
  - Продуманная организация пакетов и зависимостей
  - Масштабируемая структура проекта

- **Хорошо (35-44 балла):**

  - Базовая monorepo структура работает
  - Есть shared компоненты и типы
  - Настроена система сборки
  - Минимальная документация архитектуры

- **Удовлетворительно (25-34 балла):**

  - Проект разбит на модули
  - Работает базовая сборка
  - Есть shared библиотеки

- **Неудовлетворительно (0-24 балла):**
  - Монолитная структура
  - Нет четкого разделения
  - Проблемы со сборкой

#### Задание 12.2: TypeScript Project References (50 баллов)

- **Отлично (45-50 баллов):**

  - Правильно настроены project references
  - Эффективные path mappings
  - Strict TypeScript конфигурация
  - Быстрая типизация и сборка

- **Хорошо (35-44 балла):**

  - Работают project references
  - Настроен path mapping
  - Базовая TypeScript конфигурация

- **Удовлетворительно (25-34 балла):**

  - Частично работают references
  - Есть типизация

- **Неудовлетворительно (0-24 балла):**
  - Нет project references
  - Проблемы с типизацией

#### Задание 12.3: Build система (50 баллов)

- **Отлично (45-50 баллов):**

  - Оптимизированная система сборки
  - Кэширование и параллелизация
  - Эффективные build команды
  - Мониторинг производительности сборки

- **Хорошо (35-44 балла):**

  - Работает система сборки
  - Есть базовая оптимизация
  - Настроены основные команды

- **Удовлетворительно (25-34 балла):**

  - Базовая сборка работает
  - Минимальная оптимизация

- **Неудовлетворительно (0-24 балла):**
  - Проблемы со сборкой
  - Медленные команды

### 🚀 Дополнительные задачи (бонусы)

1. **Module Federation Setup** (+20 баллов)

   - Настройка Webpack Module Federation
   - Микрофронтенд архитектура
   - Runtime интеграция модулей

2. **Advanced Caching** (+15 баллов)

   - Настройка build кэширования
   - Incremental builds
   - Distributed caching

3. **Workspace Automation** (+10 баллов)
   - Автоматическая генерация компонентов
   - Code scaffolding
   - Workspace utilities

### 📚 Материалы для изучения

#### Обязательное чтение:

1. **Architecture:**

   - "Clean Architecture" - Robert Martin
   - "Building Micro-Frontends" - Luca Mezzalira
   - Nx Documentation

2. **TypeScript:**

   - TypeScript Handbook - Project References
   - "Programming TypeScript" - Boris Cherny
   - Advanced TypeScript patterns

3. **Build Systems:**
   - Nx vs Lerna vs Rush comparison
   - Webpack Module Federation guide
   - Vite optimization techniques

#### Практические ресурсы:

1. **Tools:**

   - [Nx Workspace](https://nx.dev/)
   - [Lerna](https://lerna.js.org/)
   - [Rush](https://rushjs.io/)

2. **Примеры проектов:**
   - [React Monorepo Examples](https://github.com/vercel/next.js/tree/canary/examples)
   - [Vue 3 Enterprise Boilerplate](https://github.com/chrisvfritz/vue-enterprise-boilerplate)

### 🎯 Результат этапа

По завершении этого этапа у вас будет:

- ✅ **Корпоративная архитектура** с четким разделением модулей
- ✅ **Эффективная система сборки** с кэшированием и оптимизацией
- ✅ **Типизированная кодовая база** с project references
- ✅ **Scalable развитие** проекта для команды разработчиков
- ✅ **Development environment** готовый к продуктивной работе

Этот фундамент будет основой для всех последующих этапов и обеспечит качественную разработку приложения корпоративного уровня.
