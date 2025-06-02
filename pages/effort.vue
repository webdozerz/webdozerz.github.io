<template>
  <div class="min-h-screen">
    <div class="container">
      <div class="card space-y-8">
        <!-- Заголовок -->
        <header class="header">
          <h1>Калькулятор трудозатрат</h1>
          <p>
            Рассчитывает трудозатраты в трёх вариантах — оптимистичном, реалистичном и пессимистичном.
          </p>
        </header>

        <!-- ===== Форма ===== -->
        <form class="form" autocomplete="off">
          <!-- Кол-во компонентов по типам -->
          <fieldset class="fieldset full-width">
            <legend class="legend">Количество компонентов</legend>
            <div class="grid">
              <div v-for="t in componentTypes" :key="t" class="component-type-group">
                <BaseNumberInput
                  :id="`cnt-${t}`"
                  :label="labels[t]"
                  :model-value="state.counts[t]"
                  :min="0"
                  @update:model-value="state.counts[t] = $event"
                />
                <BaseNumberInput
                  :id="`base-${t}`"
                  :label="`Из них с готовой базой`"
                  :model-value="state.countsWithBase[t]"
                  :min="0"
                  :max="state.counts[t]"
                  @update:model-value="state.countsWithBase[t] = Math.min($event, state.counts[t])"
                />
                <BaseNumberInput
                  :id="`props-${t}`"
                  :label="`Новых props на компонент`"
                  :model-value="state.countsNewProps[t]"
                  :min="0"
                  :max="20"
                  @update:model-value="state.countsNewProps[t] = $event"
                />
              </div>
            </div>
          </fieldset>    

          <!-- Сложность UI -->
          <BaseSelect
            v-model="state.uiComplex"
            label="Сложность UI"
            :options="[
              { value: 'static', text: 'Статическая' },
              { value: 'interactive', text: 'Интерактивная' }
            ]"
          />

          <!-- Слой состояния -->
          <BaseSelect
            v-model="state.stateLayer"
            label="Слой состояния"
            :options="[
              { value: 'local', text: 'Локальный' },
              { value: 'global', text: 'Глобальный' }
            ]"
          />

          <!-- API -->
          <BaseSelect
            v-model="state.apiType"
            label="Тип API"
            class="fieldset full-width"
            :options="[
              { value: 'none', text: 'Нет' },
              { value: 'simple', text: 'Простой GET' },
              { value: 'crud',  text: 'Полный CRUD' }
            ]"
          />

          <!-- SSR, SEO, тесты -->
          <BaseToggle v-model="state.ssr" label="SSR (Async Data, Изоморфный код)" />
          <BaseToggle v-model="state.seoAdvanced" label="Расширенный SEO" />
          <BaseToggle v-model="state.testsUnit"      label="Unit-тесты" />
          <BaseToggle v-model="state.testsE2E"       label="E2E-тесты" />

          <!-- === НОВЫЕ ПОЛЯ === -->
          <BaseToggle v-model="state.responsive" label="Адаптивный дизайн (мобильные, планшеты)" />
          <BaseToggle v-model="state.accessibility" label="Доступность (a11y, ARIA)" />
          <BaseToggle v-model="state.codeReview" label="Код-ревью и рефакторинг" />
          <BaseToggle v-model="state.documentation" label="Документация (JSDoc, README)" />
          <BaseToggle v-model="state.deployment" label="Настройка деплоя и CI/CD" />

          <div class="empty-space"/>

          <!-- i18n -->
          <BaseSelect
            v-model="state.i18n"
            label="Интернационализация"
            class="full-width"
            :options="[
              { value: 'none',     text: 'Нет' },
              { value: 'simple',   text: 'Строки' },
              { value: 'advanced', text: 'Склонения / RTL' }
            ]"
          />

          <!-- Грейд разработчика -->
          <BaseSelect
            v-model="state.devLevel"
            class="full-width"
            label="Грейд разработчика"
            :options="[
              { value: 'middle', text: 'Middle' },
              { value: 'junior', text: 'Junior' },
              { value: 'senior', text: 'Senior' }
            ]"
          />
        </form>

        <!-- ===== Результаты ===== -->
        <section class="results">
          <BaseResultCard title="Оптимистичная"   color="green" :value="hours.optimistic" />
          <BaseResultCard title="Реалистичная"    color="blue"  :value="hours.realistic"  />
          <BaseResultCard title="Пессимистичная"  color="red"   :value="hours.pessimistic"/>
        </section>

        <!-- Сброс -->
        <div class="flex justify-end">
          <button class="btn btn-secondary" @click="reset">Сбросить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'

/**
 * БАЗОВЫЕ КОЭФФИЦИЕНТЫ для расчета трудозатрат
 * Каждый коэффициент показывает, сколько дополнительного времени добавляет фактор
 */
const BASE_COEFFS = {
  // Влияние наличия базового компонента на время разработки
  baseExists: { true: 0.5, false: 1.0 }, // Если есть базовый - экономим 50% времени
  
  // Сложность пользовательского интерфейса
  uiComplex: { static: 0.3, interactive: 0.8 }, // Интерактивный UI значительно сложнее
  
  // Управление состоянием компонента
  stateLayer: { local: 0.3, global: 0.8 }, // Глобальное состояние требует больше времени
  
  // Интеграция с API
  apiType: { none: 0, simple: 0.5, crud: 1.2 }, // CRUD операции существенно сложнее
  
  // Дополнительные требования (фиксированные коэффициенты)
  ssr: 0.6,           // Server-Side Rendering добавляет сложностей
  seoAdvanced: 0.3,   // Продвинутая SEO оптимизация
  
  // Интернационализация
  i18n: { none: 0, simple: 0.2, advanced: 0.5 }, // RTL и plural формы требуют дополнительного времени
  
  // Покрытие тестами
  tests: { unit: 0.3, e2e: 0.8 }, // E2E тесты значительно сложнее unit тестов
  
  // === НОВЫЕ ФАКТОРЫ ===
  // Адаптивный дизайн под разные экраны
  responsive: 0.4,        // Адаптивность добавляет много CSS и тестирования
  
  // Доступность для людей с ограниченными возможностями  
  accessibility: 0.5,     // ARIA, семантика, навигация с клавиатуры
  
  // Время на код-ревью и исправления
  codeReview: 0.2,        // Дополнительное время на ревью и исправления
  
  // Документация компонента
  documentation: 0.15,    // README, JSDoc, Storybook
  
  // Настройка деплоя и CI/CD
  deployment: 0.3,        // Docker, конфиги, пайплайны
} as const

/**
 * ВЕСОВЫЕ КОЭФФИЦИЕНТЫ для разных типов компонентов
 * Показывают относительную сложность каждого типа компонента
 */
const COMPONENT_TYPE_COEFFS = {
  layout: 0.2,    // Макеты и контейнеры (header, footer, sidebar)
  ui: 0.4,        // Базовые UI элементы (кнопки, инпуты)
  form: 0.7,      // Формы с валидацией
  chart: 0.9,     // Графики и визуализация данных
  complex: 1.2,   // Сложные виджеты (календари, таблицы с фильтрами)
} as const

/**
 * ЧЕЛОВЕКОЧИТАЕМЫЕ НАЗВАНИЯ для типов компонентов
 */
const LABELS = {
  layout: "Макет/Контейнер",
  ui: "UI-элемент", 
  form: "Форма",
  chart: "График",
  complex: "Сложный виджет",
} as const

/**
 * МНОЖИТЕЛИ для разных уровней разработчиков
 * Junior тратит больше времени, Senior меньше
 */
const LEVEL_FACTOR = { junior: 1.35, middle: 1.15, senior: 0.9 } as const

/**
 * КОЭФФИЦИЕНТЫ для оптимистичной и пессимистичной оценки
 */
const OPT = 0.8   // Оптимистичная: -20% от реалистичной
const PESS = 1.3  // Пессимистичная: +30% от реалистичной

// Типы TypeScript для безопасности
type ComponentType = keyof typeof COMPONENT_TYPE_COEFFS
const componentTypes = Object.keys(COMPONENT_TYPE_COEFFS) as ComponentType[]
const labels = LABELS

// Интерфейс для счетчиков компонентов
interface Counts { [k: string]: number }

/**
 * ИНТЕРФЕЙС состояния формы
 * Описывает все параметры, влияющие на расчет трудозатрат
 */
interface FormState {
  counts: Counts                              // Количество каждого типа компонентов
  countsWithBase: Counts                      // Количество компонентов с готовой базой по типам
  countsNewProps: Counts                      // Среднее количество новых props на компонент по типам
  uiComplex: "static" | "interactive"         // Сложность UI
  stateLayer: "local" | "global"              // Тип управления состоянием
  apiType: "none" | "simple" | "crud"         // Тип API интеграции
  ssr: boolean                                // Нужен ли SSR
  seoAdvanced: boolean                        // Расширенная SEO оптимизация
  i18n: "none" | "simple" | "advanced"       // Уровень интернационализации
  testsUnit: boolean                          // Unit тесты
  testsE2E: boolean                           // End-to-End тесты
  
  // === НОВЫЕ ПОЛЯ ===
  responsive: boolean                         // Адаптивный дизайн
  accessibility: boolean                     // Доступность (a11y)
  codeReview: boolean                         // Код-ревю включено
  documentation: boolean                      // Нужна документация
  deployment: boolean                         // Настройка деплоя
  
  devLevel: keyof typeof LEVEL_FACTOR         // Уровень разработчика
}

/**
 * НАЧАЛЬНЫЕ ЗНАЧЕНИЯ формы
 * Устанавливаем разумные дефолты для быстрого старта
 */
const initial: FormState = {
  counts: Object.fromEntries(componentTypes.map((t) => [t, 0])), // Все счетчики в 0
  countsWithBase: Object.fromEntries(componentTypes.map((t) => [t, 0])), // Компоненты с базой
  countsNewProps: Object.fromEntries(componentTypes.map((t) => [t, 0])), // Среднее количество новых props на компонент по типам
  uiComplex: "static",     // Простой статический UI
  stateLayer: "local",     // Локальное состояние проще
  apiType: "none",         // Без API интеграции
  ssr: false,              // SSR не нужен
  seoAdvanced: false,      // Базовая SEO достаточна
  i18n: "none",            // Без интернационализации
  testsUnit: false,        // Тесты опциональны
  testsE2E: false,         // E2E тесты тоже опциональны
  
  // === НОВЫЕ ДЕФОЛТЫ ===
  responsive: false,        // Адаптивный дизайн не включен
  accessibility: false,     // Доступность не включена
  codeReview: false,        // Код-ревью не включено
  documentation: false,     // Документация не нужна
  deployment: false,        // Настройка деплоя не включена
  
  devLevel: "middle",      // Средний уровень разработчика
}

/**
 * РЕАКТИВНОЕ СОСТОЯНИЕ формы
 * Vue будет автоматически обновлять интерфейс при изменениях
 */
const state = reactive<FormState>({ ...initial })

// Принудительно устанавливаем дефолтные значения при монтировании
onMounted(() => {
  // Убеждаемся что devLevel установлен правильно
  if (!state.devLevel || !['junior', 'middle', 'senior'].includes(state.devLevel)) {
    state.devLevel = 'middle'
  }
})

/**
 * РАСЧЕТ БАЗОВОГО ВРЕМЕНИ НА ОДИН КОМПОНЕНТ
 * Суммирует все коэффициенты для получения времени на компонент
 * 
 * @param s - состояние формы с параметрами проекта
 * @returns базовое время в часах на один компонент
 */
function baselinePerComponent(s: FormState): number {
  const h =
    // Основные факторы (всегда применяются)
    BASE_COEFFS.uiComplex[s.uiComplex] +
    BASE_COEFFS.stateLayer[s.stateLayer] +
    BASE_COEFFS.apiType[s.apiType] +
    
    // Опциональные факторы (применяются только если включены)
    (s.ssr ? BASE_COEFFS.ssr : 0) +
    (s.seoAdvanced ? BASE_COEFFS.seoAdvanced : 0) +
    BASE_COEFFS.i18n[s.i18n] +
    (s.testsUnit ? BASE_COEFFS.tests.unit : 0) +
    (s.testsE2E ? BASE_COEFFS.tests.e2e : 0) +
    
    // === НОВЫЕ ФАКТОРЫ ===
    (s.responsive ? BASE_COEFFS.responsive : 0) +
    (s.accessibility ? BASE_COEFFS.accessibility : 0) +
    (s.codeReview ? BASE_COEFFS.codeReview : 0) +
    (s.documentation ? BASE_COEFFS.documentation : 0) +
    (s.deployment ? BASE_COEFFS.deployment : 0)

  return h
}

/**
 * ОСНОВНОЙ РАСЧЕТ ТРУДОЗАТРАТ
 * Computed свойство - автоматически пересчитывается при изменении state
 */
const hours = computed(() => {
  const per = baselinePerComponent(state)
  
  // Общее количество компонентов всех типов
  const total = componentTypes.reduce((sum, t) => sum + (state.counts[t] || 0), 0)
  
  // Дополнительное время в зависимости от типов компонентов
  const additive = componentTypes.reduce(
    (sum, t) => sum + (state.counts[t] || 0) * COMPONENT_TYPE_COEFFS[t],
    0
  )
  
  // Расчет экономии времени от базовых компонентов
  const baseEconomy = componentTypes.reduce((sum, t) => {
    const totalCount = state.counts[t] || 0
    const withBaseCount = Math.min(state.countsWithBase[t] || 0, totalCount)
    const withoutBaseCount = totalCount - withBaseCount
    
    // Компоненты с базой экономят время (коэффициент 0.5), без базы используют полный коэффициент (1.0)
    const baseTimeImpact = withBaseCount * BASE_COEFFS.baseExists.true + withoutBaseCount * BASE_COEFFS.baseExists.false
    return sum + baseTimeImpact
  }, 0)
  
  // Расчет времени на новые props/emit для каждого типа компонентов
  const propsTime = componentTypes.reduce((sum, t) => {
    const totalCount = state.counts[t] || 0
    const propsPerComponent = state.countsNewProps[t] || 0
    
    if (totalCount > 0 && propsPerComponent > 0) {
      // Каждый prop добавляет время: первые 2 props = 0.1 часа каждый, дальше = 0.05 часа каждый
      const simpleProps = Math.min(propsPerComponent, 2)
      const complexProps = Math.max(propsPerComponent - 2, 0)
      const timePerComponent = simpleProps * 0.1 + complexProps * 0.05
      
      return sum + totalCount * timePerComponent
    }
    return sum
  }, 0)
  
  // Итоговое время с учетом уровня разработчика
  const core = (per * total + additive + baseEconomy + propsTime) * LEVEL_FACTOR[state.devLevel]
  
  // Возвращаем три варианта оценки с округлением до десятых
  return {
    optimistic: Math.round(core * OPT * 10) / 10,   // Оптимистичная (-20%)
    realistic: Math.round(core * 10) / 10,          // Реалистичная (базовая)
    pessimistic: Math.round(core * PESS * 10) / 10, // Пессимистичная (+30%)
  }
})

/**
 * СБРОС ФОРМЫ к начальным значениям
 * Использует JSON для глубокого копирования объекта
 */
function reset() {
  Object.assign(state, JSON.parse(JSON.stringify(initial)))
}
</script>

<style scoped>
/* Layout utilities */
.container {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
  overflow-x: hidden;
}

.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
}

.min-h-screen {
  min-height: 100vh;
}

.space-y-8 > * + * {
  margin-top: 2rem;
}

/* Header */
.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #111827;
}

.header p {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
}

/* Form elements */
.form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .form {
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .form {
    gap: 1.5rem;
  }
}

.fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

.fieldset.full-width {
  grid-column: 1 / -1;
}

.legend {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
  grid-column: 1 / -1;
  color: #111827;
  font-size: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 480px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media (min-width: 1200px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Component type grouping */
.component-type-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

/* Results section */
.results {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  text-align: center;
}

@media (min-width: 640px) {
  .results {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

/* Button styles */
.btn {
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #111827;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

/* Utility classes */
.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}
</style>
