# Этап 4: Vue.js Компоненты - Технические задания

## Задание 4.1: Миграция на Vue.js

### 🎯 Цель

Переписать приложение на Vue.js с использованием Composition API

### 📋 Требования

#### Функциональные требования:

- [ ] Мигрировать все HTML/JS компоненты в Vue SFC
- [ ] Использовать Composition API для логики
- [ ] Создать систему компонентов
- [ ] Настроить Vue Router для навигации
- [ ] Добавить TypeScript поддержку для Vue

#### Технические требования:

- [ ] Single File Components (.vue)
- [ ] Script setup синтаксис
- [ ] Композаблы для переиспользуемой логики
- [ ] Props и emits с типизацией
- [ ] Vite для сборки проекта

### 💡 Подсказки

**Vite конфигурация:**

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
});
```

**Базовый компонент:**

```vue
<!-- components/CryptoCard.vue -->
<script setup lang="ts">
interface Props {
  crypto: CryptoCurrency;
  showDetails?: boolean;
}

interface Emits {
  click: [crypto: CryptoCurrency];
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false,
});

const emit = defineEmits<Emits>();

const formattedPrice = computed(() => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(props.crypto.current_price);
});

const priceChangeClass = computed(() => {
  return props.crypto.price_change_percentage_24h >= 0
    ? "crypto-card__change--positive"
    : "crypto-card__change--negative";
});

function handleClick() {
  emit("click", props.crypto);
}
</script>

<template>
  <article class="crypto-card" @click="handleClick">
    <div class="crypto-card__header">
      <img :src="crypto.image" :alt="crypto.name" class="crypto-card__image" />
      <div>
        <h3 class="crypto-card__name">{{ crypto.name }}</h3>
        <span class="crypto-card__symbol">{{
          crypto.symbol.toUpperCase()
        }}</span>
      </div>
    </div>

    <div class="crypto-card__price">
      {{ formattedPrice }}
    </div>

    <div :class="['crypto-card__change', priceChangeClass]">
      {{ crypto.price_change_percentage_24h.toFixed(2) }}%
    </div>

    <div v-if="showDetails" class="crypto-card__details">
      <div class="crypto-card__market-cap">
        Market Cap: {{ formatLargeNumber(crypto.market_cap) }}
      </div>
    </div>
  </article>
</template>

<style scoped>
.crypto-card {
  background: var(--color-card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.crypto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.crypto-card__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.crypto-card__image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.crypto-card__name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.crypto-card__symbol {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.crypto-card__price {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.crypto-card__change {
  font-weight: 600;
  font-size: 0.9rem;
}

.crypto-card__change--positive {
  color: var(--color-success);
}

.crypto-card__change--negative {
  color: var(--color-error);
}
</style>
```

**Композабл для API:**

```typescript
// composables/useCrypto.ts
export const useCrypto = () => {
  const cryptoList = ref<CryptoCurrency[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const api = new CoinGeckoDataSource();

  const fetchCrypto = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const data = await api.fetchData();
      cryptoList.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error("Error fetching crypto data:", err);
    } finally {
      loading.value = false;
    }
  };

  const findCrypto = (id: string): CryptoCurrency | undefined => {
    return cryptoList.value.find((crypto) => crypto.id === id);
  };

  const sortCrypto = (field: SortField, direction: SortDirection = "asc") => {
    cryptoList.value.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const filterCrypto = (searchQuery: string) => {
    return computed(() => {
      if (!searchQuery) return cryptoList.value;

      return cryptoList.value.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  return {
    cryptoList: readonly(cryptoList),
    loading: readonly(loading),
    error: readonly(error),
    fetchCrypto,
    findCrypto,
    sortCrypto,
    filterCrypto,
  };
};
```

### ❓ Вопросы для изучения

1. **Composition API**: Чем отличается Composition API от Options API?
2. **Reactivity**: Как работает реактивность в Vue 3?
3. **Composables**: Как создавать переиспользуемые композаблы?
4. **SFC**: Что такое Single File Components и их преимущества?

### 🔍 Критерии оценки

- [ ] **Vue компоненты** (30): Правильная структура SFC
- [ ] **Composition API** (25): Использование ref, computed, watch
- [ ] **TypeScript интеграция** (25): Типизация props, emits
- [ ] **Композаблы** (20): Переиспользуемая логика

---

## Задание 4.2: Система UI компонентов

### 🎯 Цель

Создать переиспользуемые UI компоненты

### 📋 Требования

#### Функциональные требования:

- [ ] BaseButton с различными вариантами
- [ ] BaseInput с валидацией
- [ ] BaseModal для модальных окон
- [ ] BaseLoader для состояний загрузки
- [ ] BaseToast для уведомлений

#### Технические требования:

- [ ] Props с default значениями
- [ ] Slots для гибкости
- [ ] События для взаимодействия
- [ ] CSS переменные для кастомизации
- [ ] Accessibility атрибуты

### 💡 Подсказки

**BaseButton компонент:**

```vue
<!-- components/base/BaseButton.vue -->
<script setup lang="ts">
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "small" | "medium" | "large";

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string;
  target?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "medium",
  disabled: false,
  loading: false,
  type: "button",
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClass = computed(() => [
  "base-button",
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    "base-button--disabled": props.disabled,
    "base-button--loading": props.loading,
  },
]);

const isDisabled = computed(() => props.disabled || props.loading);

function handleClick(event: MouseEvent) {
  if (!isDisabled.value) {
    emit("click", event);
  }
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :class="buttonClass"
    :disabled="isDisabled"
    :href="href"
    :target="target"
    :type="!href ? type : undefined"
    @click="handleClick"
  >
    <span v-if="loading" class="base-button__spinner" aria-hidden="true">
      <BaseSpinner size="small" />
    </span>

    <span :class="{ 'base-button__content--hidden': loading }">
      <slot />
    </span>
  </component>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
}

.base-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Sizes */
.base-button--small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.base-button--medium {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.base-button--large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Variants */
.base-button--primary {
  background: var(--color-primary);
  color: white;
}

.base-button--primary:hover:not(.base-button--disabled) {
  background: var(--color-primary-dark);
}

.base-button--secondary {
  background: var(--color-gray-100);
  color: var(--color-gray-900);
  border: 1px solid var(--color-gray-300);
}

.base-button--danger {
  background: var(--color-danger);
  color: white;
}

.base-button--ghost {
  background: transparent;
  color: var(--color-primary);
}

.base-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-button__content--hidden {
  opacity: 0;
}

.base-button__spinner {
  position: absolute;
}
</style>
```

**BaseInput компонент:**

```vue
<!-- components/base/BaseInput.vue -->
<script setup lang="ts">
interface Props {
  modelValue: string | number;
  type?: "text" | "email" | "password" | "number" | "tel";
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
const hasError = computed(() => !!props.error);

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = props.type === "number" ? Number(target.value) : target.value;
  emit("update:modelValue", value);
}
</script>

<template>
  <div class="base-input">
    <label v-if="label" :for="inputId" class="base-input__label">
      {{ label }}
      <span v-if="required" class="base-input__required">*</span>
    </label>

    <div class="base-input__wrapper">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="['base-input__field', { 'base-input__field--error': hasError }]"
        :aria-describedby="
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        "
        :aria-invalid="hasError"
        @input="updateValue"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />
    </div>

    <div v-if="error" :id="`${inputId}-error`" class="base-input__error">
      {{ error }}
    </div>

    <div v-else-if="hint" :id="`${inputId}-hint`" class="base-input__hint">
      {{ hint }}
    </div>
  </div>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.base-input__label {
  font-weight: 500;
  color: var(--color-text);
}

.base-input__required {
  color: var(--color-danger);
}

.base-input__field {
  padding: 0.75rem;
  border: 2px solid var(--color-gray-300);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.base-input__field:focus {
  outline: none;
  border-color: var(--color-primary);
}

.base-input__field--error {
  border-color: var(--color-danger);
}

.base-input__field:disabled {
  background: var(--color-gray-100);
  cursor: not-allowed;
}

.base-input__error {
  color: var(--color-danger);
  font-size: 0.875rem;
}

.base-input__hint {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}
</style>
```

### ❓ Вопросы для изучения

1. **Props Validation**: Как создавать валидацию для props?
2. **Slots**: Когда использовать slots и named slots?
3. **v-model**: Как создать custom компонент с v-model?
4. **Accessibility**: Как обеспечить доступность в компонентах?

---

## Задание 4.3: Продвинутые возможности Vue

### 🎯 Цель

Изучить продвинутые возможности Vue.js

### 📋 Требования

#### Функциональные требования:

- [ ] Анимации и переходы между состояниями
- [ ] Директивы для повторного использования логики
- [ ] Provide/Inject для передачи данных
- [ ] Teleport для модальных окон
- [ ] Suspense для асинхронных компонентов

#### Технические требования:

- [ ] Transition компоненты для анимаций
- [ ] Custom директивы с хуками
- [ ] Правильное использование provide/inject
- [ ] Оптимизация рендеринга

### 💡 Подсказки

**Анимации:**

```vue
<!-- CryptoList.vue -->
<template>
  <TransitionGroup name="crypto-list" tag="div" class="crypto-list">
    <CryptoCard
      v-for="crypto in cryptoList"
      :key="crypto.id"
      :crypto="crypto"
      @click="selectCrypto"
    />
  </TransitionGroup>
</template>

<style>
.crypto-list-enter-active,
.crypto-list-leave-active {
  transition: all 0.3s ease;
}

.crypto-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.crypto-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.crypto-list-move {
  transition: transform 0.3s ease;
}
</style>
```

**Custom директива:**

```typescript
// directives/clickOutside.ts
interface ClickOutsideElement extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void;
}

export const clickOutside = {
  beforeMount(el: ClickOutsideElement, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },

  unmounted(el: ClickOutsideElement) {
    if (el.clickOutsideEvent) {
      document.removeEventListener("click", el.clickOutsideEvent);
    }
  },
};
```

**Provide/Inject:**

```typescript
// composables/useTheme.ts
const themeSymbol = Symbol("theme");

export const useThemeProvider = () => {
  const theme = ref<"light" | "dark">("light");

  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
  };

  provide(themeSymbol, {
    theme: readonly(theme),
    toggleTheme,
  });

  return { theme, toggleTheme };
};

export const useTheme = () => {
  const themeContext = inject(themeSymbol);

  if (!themeContext) {
    throw new Error("useTheme must be used within theme provider");
  }

  return themeContext;
};
```

### ❓ Вопросы для изучения

1. **Performance**: Как оптимизировать рендеринг Vue компонентов?
2. **Transitions**: Какие виды переходов доступны в Vue?
3. **Directives**: Когда создавать custom директивы?
4. **Dependency Injection**: Как работает provide/inject?

---

## 📊 Общая оценка этапа 4

| Критерий                | Баллы   | Описание                            |
| ----------------------- | ------- | ----------------------------------- |
| Vue.js компоненты       | 30      | SFC, Composition API, реактивность  |
| UI система              | 25      | Переиспользуемые компоненты         |
| TypeScript интеграция   | 25      | Типизация Vue компонентов           |
| Продвинутые возможности | 20      | Анимации, директивы, provide/inject |
| **Итого**               | **100** | Минимум 70 для перехода к этапу 5   |

### 🎯 Следующий этап

После завершения этапа 4 переходим к **Этапу 5: Nuxt.js + Роутинг**.
