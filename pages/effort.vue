<template>
  <div class="min-h-screen">
    <div class="container">
      <div class="card space-y-8">
        <header class="header">
          <h1>Калькулятор трудозатрат</h1>
          <p>
            Рассчитывает трудозатраты в трёх вариантах — оптимистичном, реалистичном и пессимистичном.
          </p>
        </header>

        <form class="form" autocomplete="off">
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

          <BaseSelect
            v-model="state.uiComplex"
            label="Сложность UI"
            :options="[
              { value: 'static', text: 'Статическая' },
              { value: 'interactive', text: 'Интерактивная' }
            ]"
          />

          <BaseSelect
            v-model="state.stateLayer"
            label="Слой состояния"
            :options="[
              { value: 'local', text: 'Локальный' },
              { value: 'global', text: 'Глобальный' }
            ]"
          />

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

          <BaseToggle v-model="state.ssr" label="SSR (Async Data, Изоморфный код)" />
          <BaseToggle v-model="state.seoAdvanced" label="Расширенный SEO" />
          <BaseToggle v-model="state.testsUnit"      label="Unit-тесты" />
          <BaseToggle v-model="state.testsE2E"       label="E2E-тесты" />

          <BaseToggle v-model="state.responsive" label="Адаптивный дизайн (мобильные, планшеты)" />
          <BaseToggle v-model="state.accessibility" label="Доступность (a11y, ARIA)" />
          <BaseToggle v-model="state.codeReview" label="Код-ревью и рефакторинг" />
          <BaseToggle v-model="state.documentation" label="Документация (JSDoc, README)" />
          <BaseToggle v-model="state.deployment" label="Настройка деплоя и CI/CD" />

          <div class="empty-space"/>

          <BaseSelect
            v-model="state.i18n"
            label="Интернационализация (i18n)"
            class="full-width"
            :options="[
              { value: 'none',     text: 'Нет' },
              { value: 'simple',   text: 'Строки' },
              { value: 'advanced', text: 'Склонения / RTL' }
            ]"
          />

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

        <section class="results">
          <BaseResultCard title="Оптимистичная"   color="green" :value="hours.optimistic" />
          <BaseResultCard title="Реалистичная"    color="blue"  :value="hours.realistic"  />
          <BaseResultCard title="Пессимистичная"  color="red"   :value="hours.pessimistic"/>
        </section>

        <div class="buttons-container">
          <div class="buttons-group">
            <button 
              class="btn btn-warning btn-full-width" 
              @click="showCoefficientEditor = true"
            >
              Настроить коэффициенты
            </button>
            <button 
              class="btn btn-info" 
              :disabled="!hasComponents"
              @click="showCalculationDetails = true"
            >
              Детали расчета
            </button>
            <button 
              class="btn btn-success" 
              :disabled="!hasComponents"
              @click="showJiraIntegration = true"
            >
              Экспорт в Jira
            </button>
          </div>
          <div class="buttons-group">
            <button 
              class="btn btn-primary" 
              :disabled="!hasComponents"
              @click="exportToCsv"
            >
              Экспорт в CSV
            </button>
            <button 
              class="btn btn-accent" 
              :disabled="!hasComponents"
              @click="exportToJson"
            >
              Экспорт в JSON
            </button>
          </div>
          <div class="buttons-group">
            <button class="btn btn-secondary" @click="reset">Сбросить</button>
          </div>
        </div>
      </div>
    </div>

    <CoefficientEditModal
      :is-visible="showCoefficientEditor"
      :coefficients="coefficients"
      :default-coefficients="ORIGINAL_DEFAULT_COEFFICIENTS"
      @close="showCoefficientEditor = false"
      @save="updateCoefficients"
    />

    <CalculationDetailsModal
      :is-visible="showCalculationDetails"
      :calculation-details="calculationDetails"
      :hours="hours"
      :form-state="state"
      :base-coeffs="coefficients"
      :level-factor="coefficients.levelFactor"
      @close="showCalculationDetails = false"
    />

    <JiraIntegrationModal
      :is-visible="showJiraIntegration"
      :hours="hours"
      :form-state="state"
      :component-types="componentTypes"
      :labels="labels"
      @close="showJiraIntegration = false"
      @success="handleJiraSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch } from 'vue'
import { useScrollLock } from '~/composables/useScrollLock'

/**
 * БАЗОВЫЕ КОЭФФИЦИЕНТЫ для расчета трудозатрат
 * Каждый коэффициент показывает, сколько дополнительного времени (в часах) добавляет фактор
 * к базовому времени компонента (1 час)
 */
const DEFAULT_BASE_COEFFS = {
  // Влияние наличия базового компонента на время разработки (множитель экономии)
  // Применяется как множитель к базовому времени: экономия 30% при наличии базы
  baseExists: { true: 0.7, false: 1.0 },
  
  // Сложность пользовательского интерфейса
  uiComplex: { static: 0.2, interactive: 0.5 },
  
  // Управление состоянием компонента
  stateLayer: { local: 0.2, global: 0.5 },
  
  // Интеграция с API
  apiType: { none: 0, simple: 0.3, crud: 0.7 },
  
  // Дополнительные требования (фиксированные коэффициенты)
  ssr: 0.4,
  seoAdvanced: 0.2,
  
  // Интернационализация
  i18n: { none: 0, simple: 0.15, advanced: 0.3 },
  
  // Покрытие тестами
  tests: { unit: 0.2, e2e: 0.5 },
  
  // Адаптивный дизайн под разные экраны
  responsive: 0.25,
  
  // Доступность для людей с ограниченными возможностями  
  accessibility: 0.3,
  
  // Время на код-ревью и исправления
  codeReview: 0.15,
  
  // Документация компонента
  documentation: 0.1,

  // Настройка деплоя и CI/CD
  deployment: 0.2,
} as const

/**
 * МНОЖИТЕЛИ СЛОЖНОСТИ для разных типов компонентов
 * Умножают базовое время в зависимости от сложности типа компонента
 */
const DEFAULT_COMPONENT_TYPE_COEFFS = {
  layout: 0.8,    // Макеты и контейнеры (header, footer, sidebar) - проще базового
  ui: 1.0,        // Базовые UI элементы (кнопки, инпуты) - базовый уровень
  form: 1.3,      // Формы с валидацией - сложнее базового
  chart: 1.6,     // Графики и визуализация данных - значительно сложнее
  complex: 2.0,   // Сложные виджеты (календари, таблицы с фильтрами) - максимальная сложность
} as const

const LABELS = {
  layout: "Макет/Контейнер",
  ui: "UI-элемент", 
  form: "Форма",
  chart: "График",
  complex: "Сложный виджет",
} as const

/**
 * МНОЖИТЕЛИ для разных уровней разработчиков
 */
const DEFAULT_LEVEL_FACTOR = { junior: 1.35, middle: 1.15, senior: 0.9 } as const

/**
 * КОЭФФИЦИЕНТЫ для оптимистичной и пессимистичной оценки
 */
const OPT = 0.8   // Оптимистичная: -20% от реалистичной
const PESS = 1.3  // Пессимистичная: +30% от реалистичной

type ComponentType = keyof typeof DEFAULT_COMPONENT_TYPE_COEFFS
const componentTypes = Object.keys(DEFAULT_COMPONENT_TYPE_COEFFS) as ComponentType[]
const labels = LABELS

interface Counts { [k: string]: number }

interface AllCoefficients {
  baseExists: { true: number; false: number }
  uiComplex: { static: number; interactive: number }
  stateLayer: { local: number; global: number }
  apiType: { none: number; simple: number; crud: number }
  ssr: number
  seoAdvanced: number
  i18n: { none: number; simple: number; advanced: number }
  tests: { unit: number; e2e: number }
  responsive: number
  accessibility: number
  codeReview: number
  documentation: number
  deployment: number
  componentTypes: {
    layout: number
    ui: number
    form: number
    chart: number
    complex: number
  }
  levelFactor: {
    junior: number
    middle: number
    senior: number
  }
}

// Дефолтные коэффициенты (неизменяемые)
const ORIGINAL_DEFAULT_COEFFICIENTS: AllCoefficients = {
  ...DEFAULT_BASE_COEFFS,
  componentTypes: { ...DEFAULT_COMPONENT_TYPE_COEFFS },
  levelFactor: { ...DEFAULT_LEVEL_FACTOR }
}

// Дефолтные коэффициенты для начальной инициализации
const defaultCoefficients: AllCoefficients = {
  ...DEFAULT_BASE_COEFFS,
  componentTypes: { ...DEFAULT_COMPONENT_TYPE_COEFFS },
  levelFactor: { ...DEFAULT_LEVEL_FACTOR }
}

// Реактивные коэффициенты (изменяемые)
const coefficients = reactive<AllCoefficients>({
  ...defaultCoefficients
})

/**
 * Состояния формы
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
  
  devLevel: "junior" | "middle" | "senior"    // Уровень разработчика
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
  
  responsive: false,        // Адаптивный дизайн не включен
  accessibility: false,     // Доступность не включена
  codeReview: false,        // Код-ревью не включено
  documentation: false,     // Документация не нужна
  deployment: false,        // Настройка деплоя не включена
  
  devLevel: "middle",      // Средний уровень разработчика
}


const state = reactive<FormState>({ ...initial })

const showCalculationDetails = ref(false)
const showJiraIntegration = ref(false)
const showCoefficientEditor = ref(false)

const { lockScroll, unlockScroll } = useScrollLock()

watch(showCalculationDetails, (isOpen) => {
  if (isOpen) {
    lockScroll()
  } else {
    unlockScroll()
  }
})

watch(showJiraIntegration, (isOpen) => {
  if (isOpen) {
    lockScroll()
  } else {
    unlockScroll()
  }
})

watch(showCoefficientEditor, (isOpen) => {
  if (isOpen) {
    lockScroll()
  } else {
    unlockScroll()
  }
})

/**
 * РАСЧЕТ БАЗОВОГО ВРЕМЕНИ НА ОДИН КОМПОНЕНТ
 * Базовое время (1 час) плюс дополнительные коэффициенты сложности
 * 
 * @param s - состояние формы с параметрами проекта
 * @returns базовое время в часах на один компонент
 */
function baselinePerComponent(s: FormState): number {
  const BASE_TIME = 1.0 // Минимальное базовое время на компонент (1 час)
  
  const additionalTime =
    // Основные факторы (всегда применяются)
    coefficients.uiComplex[s.uiComplex] +
    coefficients.stateLayer[s.stateLayer] +
    coefficients.apiType[s.apiType] +
    
    // Опциональные факторы (применяются только если включены)
    (s.ssr ? coefficients.ssr : 0) +
    (s.seoAdvanced ? coefficients.seoAdvanced : 0) +
    coefficients.i18n[s.i18n] +
    (s.testsUnit ? coefficients.tests.unit : 0) +
    (s.testsE2E ? coefficients.tests.e2e : 0) +
    
    (s.responsive ? coefficients.responsive : 0) +
    (s.accessibility ? coefficients.accessibility : 0) +
    (s.codeReview ? coefficients.codeReview : 0) +
    (s.documentation ? coefficients.documentation : 0) +
    (s.deployment ? coefficients.deployment : 0)

  return BASE_TIME + additionalTime
}

/**
 * ДЕТАЛИЗАЦИЯ РАСЧЕТОВ
 */
const calculationDetails = computed(() => {
  const baseTimePerComponent = baselinePerComponent(state)
  
  // Общее количество компонентов всех типов
  const total = componentTypes.reduce((sum, t) => sum + (state.counts[t] || 0), 0)
  const totalWithBase = componentTypes.reduce((sum, t) => sum + (state.countsWithBase[t] || 0), 0)
  
  // Разбивка по типам компонентов
  const componentBreakdown = componentTypes
    .filter(type => (state.counts[type] || 0) > 0)
    .map(type => {
      const count = state.counts[type] || 0
      const withBase = Math.min(state.countsWithBase[type] || 0, count)
      const withoutBase = count - withBase
      const newProps = state.countsNewProps[type] || 0
      
      // Множитель типа компонента
      const typeMultiplier = coefficients.componentTypes[type]
      
      // Множители экономии от базовых компонентов
      const baseMultiplierWithBase = coefficients.baseExists.true
      const baseMultiplierWithoutBase = coefficients.baseExists.false
      
      // Время для компонентов с базой
      const timeWithBase = baseTimePerComponent * typeMultiplier * baseMultiplierWithBase * withBase
      
      // Время для компонентов без базы
      const timeWithoutBase = baseTimePerComponent * typeMultiplier * baseMultiplierWithoutBase * withoutBase
      
      // Экономия от базовых компонентов (в часах)
      const baseSavings = withBase * baseTimePerComponent * typeMultiplier * (baseMultiplierWithoutBase - baseMultiplierWithBase)
      
      // Время на новые props
      let propsTime = 0
      if (newProps > 0 && count > 0) {
        const simpleProps = Math.min(newProps, 2)
        const complexProps = Math.max(newProps - 2, 0)
        const timePerComponent = simpleProps * 0.1 + complexProps * 0.05
        propsTime = count * timePerComponent
      }
      
      // Общее время для этого типа компонентов
      const totalTime = timeWithBase + timeWithoutBase + propsTime
      
      return {
        type,
        label: labels[type],
        count,
        withBase,
        withoutBase,
        newProps,
        baseTimePerComponent,
        typeMultiplier,
        baseMultiplierWithBase,
        baseMultiplierWithoutBase,
        timeWithBase,
        timeWithoutBase,
        baseSavings,
        propsTime,
        totalTime
      }
    })
  
  // Расчет общего времени без учета грейда
  let totalBaseTime = 0
  componentTypes.forEach(type => {
    const count = state.counts[type] || 0
    if (count === 0) return
    
    const withBaseCount = Math.min(state.countsWithBase[type] || 0, count)
    const withoutBaseCount = count - withBaseCount
    
    const typeMultiplier = coefficients.componentTypes[type]
    const baseMultiplierWithBase = coefficients.baseExists.true
    const baseMultiplierWithoutBase = coefficients.baseExists.false
    
    totalBaseTime += baseTimePerComponent * typeMultiplier * baseMultiplierWithBase * withBaseCount
    totalBaseTime += baseTimePerComponent * typeMultiplier * baseMultiplierWithoutBase * withoutBaseCount
  })
  
  // Расчет времени на новые props
  const propsTime = componentTypes.reduce((sum, t) => {
    const totalCount = state.counts[t] || 0
    const propsPerComponent = state.countsNewProps[t] || 0
    
    if (totalCount > 0 && propsPerComponent > 0) {
      const simpleProps = Math.min(propsPerComponent, 2)
      const complexProps = Math.max(propsPerComponent - 2, 0)
      const timePerComponent = simpleProps * 0.1 + complexProps * 0.05
      
      return sum + totalCount * timePerComponent
    }
    return sum
  }, 0)
  
  // Базовое время без учета грейда
  const baseTime = totalBaseTime + propsTime
  
  // С учетом грейда разработчика
  const withLevelFactor = baseTime * coefficients.levelFactor[state.devLevel]
  
  return {
    totalComponents: total,
    totalWithBase,
    componentBreakdown,
    baseTime,
    withLevelFactor
  }
})

/**
 * ОСНОВНОЙ РАСЧЕТ ТРУДОЗАТРАТ
 * Новая формула: базовое время * множитель типа * множитель базы * количество * уровень + props
 */
const hours = computed(() => {
  // Базовое время на компонент (уже включает все дополнительные коэффициенты)
  const baseTimePerComponent = baselinePerComponent(state)
  
  // Расчет времени по каждому типу компонентов
  let totalTime = 0
  
  componentTypes.forEach(type => {
    const count = state.counts[type] || 0
    if (count === 0) return
    
    const withBaseCount = Math.min(state.countsWithBase[type] || 0, count)
    const withoutBaseCount = count - withBaseCount
    
    // Множитель типа компонента (сложность типа)
    const typeMultiplier = coefficients.componentTypes[type]
    
    // Множитель экономии от базовых компонентов
    const baseMultiplierWithBase = coefficients.baseExists.true
    const baseMultiplierWithoutBase = coefficients.baseExists.false
    
    // Время для компонентов с базой
    const timeWithBase = baseTimePerComponent * typeMultiplier * baseMultiplierWithBase * withBaseCount
    
    // Время для компонентов без базы
    const timeWithoutBase = baseTimePerComponent * typeMultiplier * baseMultiplierWithoutBase * withoutBaseCount
    
    totalTime += timeWithBase + timeWithoutBase
  })
  
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
  const core = (totalTime + propsTime) * coefficients.levelFactor[state.devLevel]
  
  // Возвращаем три варианта оценки с округлением до десятых
  return {
    optimistic: Math.round(core * OPT * 10) / 10,   // Оптимистичная (-20%)
    realistic: Math.round(core * 10) / 10,          // Реалистичная (базовая)
    pessimistic: Math.round(core * PESS * 10) / 10, // Пессимистичная (+30%)
  }
})

/**
 * СБРОС ФОРМЫ к начальным значениям
 */
function reset() {
  // Сбрасываем объекты counts
  componentTypes.forEach(t => {
    state.counts[t] = 0
    state.countsWithBase[t] = 0
    state.countsNewProps[t] = 0
  })
  
  // Сбрасываем простые поля
  state.uiComplex = "static"
  state.stateLayer = "local"
  state.apiType = "none"
  state.ssr = false
  state.seoAdvanced = false
  state.i18n = "none"
  state.testsUnit = false
  state.testsE2E = false
  
  // Сбрасываем новые поля
  state.responsive = false
  state.accessibility = false
  state.codeReview = false
  state.documentation = false
  state.deployment = false
  
  state.devLevel = "middle"
}

// Добавляем функцию экспорта в CSV
function exportToCsv() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('ru-RU').replace(/\./g, '-')
  const timeStr = now.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }).replace(':', '-')
  
  const csvData = [
    ['Параметр', 'Значение'],
    ['Дата расчета', `${dateStr} ${timeStr}`],
  ]
  
  // Количество компонентов
  const nonZeroCounts = componentTypes.filter(type => (state.counts[type] || 0) > 0)
  if (nonZeroCounts.length > 0) {
    csvData.push([''])
    csvData.push(['=== КОЛИЧЕСТВО КОМПОНЕНТОВ ===', ''])
    nonZeroCounts.forEach(type => {
      csvData.push([`${labels[type]}`, String(state.counts[type] || 0)])
    })
  }
  
  // Компоненты с готовой базой
  const componentsWithBase = componentTypes.filter(type => (state.countsWithBase[type] || 0) > 0)
  if (componentsWithBase.length > 0) {
    csvData.push([''])
    csvData.push(['=== КОМПОНЕНТЫ С ГОТОВОЙ БАЗОЙ ===', ''])
    componentsWithBase.forEach(type => {
      csvData.push([`${labels[type]} с базой`, String(state.countsWithBase[type] || 0)])
    })
  }
  
  // Новые props на компонент
  const componentsWithProps = componentTypes.filter(type => (state.countsNewProps[type] || 0) > 0)
  if (componentsWithProps.length > 0) {
    csvData.push([''])
    csvData.push(['=== НОВЫЕ PROPS НА КОМПОНЕНТ ===', ''])
    componentsWithProps.forEach(type => {
      csvData.push([`${labels[type]} - новые props`, String(state.countsNewProps[type] || 0)])
    })
  }
  
  // Основные параметры
  const mainParams = []
  if (state.uiComplex !== 'static') {
    mainParams.push(['Сложность UI', 'Интерактивная'])
  }
  if (state.stateLayer !== 'local') {
    mainParams.push(['Слой состояния', 'Глобальный'])
  }
  if (state.apiType !== 'none') {
    mainParams.push(['Тип API', 
      state.apiType === 'simple' ? 'Простой GET' : 'Полный CRUD'
    ])
  }
  if (state.i18n !== 'none') {
    mainParams.push(['Интернационализация', 
      state.i18n === 'simple' ? 'Строки' : 'Склонения / RTL'
    ])
  }
  if (state.devLevel !== 'middle') {
    mainParams.push(['Грейд разработчика', 
      state.devLevel === 'junior' ? 'Junior' : 'Senior'
    ])
  }
  
  if (mainParams.length > 0) {
    csvData.push([''])
    csvData.push(['=== ОСНОВНЫЕ ПАРАМЕТРЫ ===', ''])
    csvData.push(...mainParams)
  }
  
  // Дополнительные опции
  const enabledOptions = []
  if (state.ssr) enabledOptions.push(['SSR (Async Data, Изоморфный код)', 'Да'])
  if (state.seoAdvanced) enabledOptions.push(['Расширенный SEO', 'Да'])
  if (state.testsUnit) enabledOptions.push(['Unit-тесты', 'Да'])
  if (state.testsE2E) enabledOptions.push(['E2E-тесты', 'Да'])
  if (state.responsive) enabledOptions.push(['Адаптивный дизайн', 'Да'])
  if (state.accessibility) enabledOptions.push(['Доступность (a11y)', 'Да'])
  if (state.codeReview) enabledOptions.push(['Код-ревью и рефакторинг', 'Да'])
  if (state.documentation) enabledOptions.push(['Документация', 'Да'])
  if (state.deployment) enabledOptions.push(['Настройка деплоя и CI/CD', 'Да'])
  
  if (enabledOptions.length > 0) {
    csvData.push([''])
    csvData.push(['=== ДОПОЛНИТЕЛЬНЫЕ ОПЦИИ ===', ''])
    csvData.push(...enabledOptions)
  }
  
  // Результаты
  csvData.push([''])
  csvData.push(['=== РЕЗУЛЬТАТЫ (ЧАСЫ) ===', ''])
  csvData.push(['Оптимистичная оценка', String(hours.value.optimistic)])
  csvData.push(['Реалистичная оценка', String(hours.value.realistic)])
  csvData.push(['Пессимистичная оценка', String(hours.value.pessimistic)])
  
  // Преобразуем в CSV формат
  const csvContent = csvData
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  
  const bom = '\uFEFF'
  const csvWithBom = bom + csvContent
  
  const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `trudozatraty-${dateStr}-${timeStr}.csv`
  document.body.appendChild(link)
  link.click()
  
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Добавляем функцию экспорта в JSON
function exportToJson() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('ru-RU').replace(/\./g, '-')
  const timeStr = now.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }).replace(':', '-')
  
  // Формируем структурированные данные для экспорта
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonData: any = {
    meta: {
      exportDate: now.toISOString(),
      exportDateFormatted: `${dateStr} ${timeStr}`,
      version: '1.0',
      description: 'Экспорт данных калькулятора трудозатрат'
    },
    
    // Исходные данные формы
    rawData: {
      counts: { ...state.counts },
      countsWithBase: { ...state.countsWithBase },
      countsNewProps: { ...state.countsNewProps },
      uiComplex: state.uiComplex,
      stateLayer: state.stateLayer,
      apiType: state.apiType,
      ssr: state.ssr,
      seoAdvanced: state.seoAdvanced,
      i18n: state.i18n,
      testsUnit: state.testsUnit,
      testsE2E: state.testsE2E,
      responsive: state.responsive,
      accessibility: state.accessibility,
      codeReview: state.codeReview,
      documentation: state.documentation,
      deployment: state.deployment,
      devLevel: state.devLevel
    },
    
    // Человекочитаемые данные
    formattedData: {}
  }
  
  // Компоненты
  const nonZeroCounts = componentTypes.filter(type => (state.counts[type] || 0) > 0)
  const componentsWithBase = componentTypes.filter(type => (state.countsWithBase[type] || 0) > 0)
  const componentsWithProps = componentTypes.filter(type => (state.countsNewProps[type] || 0) > 0)
  
  if (nonZeroCounts.length > 0 || componentsWithBase.length > 0 || componentsWithProps.length > 0) {
    jsonData.formattedData.components = {}
    
    if (nonZeroCounts.length > 0) {
      jsonData.formattedData.components.counts = nonZeroCounts.reduce((acc, type) => {
        acc[labels[type]] = state.counts[type] || 0
        return acc
      }, {} as Record<string, number>)
    }
    
    if (componentsWithBase.length > 0) {
      jsonData.formattedData.components.withBase = componentsWithBase.reduce((acc, type) => {
        acc[labels[type]] = state.countsWithBase[type] || 0
        return acc
      }, {} as Record<string, number>)
    }
    
    if (componentsWithProps.length > 0) {
      jsonData.formattedData.components.newProps = componentsWithProps.reduce((acc, type) => {
        acc[labels[type]] = state.countsNewProps[type] || 0
        return acc
      }, {} as Record<string, number>)
    }
  }
  
  // Основные параметры
  const settings: Record<string, string> = {}
  if (state.uiComplex !== 'static') {
    settings.uiComplexity = 'Интерактивная'
  }
  if (state.stateLayer !== 'local') {
    settings.stateManagement = 'Глобальный'
  }
  if (state.apiType !== 'none') {
    settings.apiIntegration = state.apiType === 'simple' ? 'Простой GET' : 'Полный CRUD'
  }
  if (state.i18n !== 'none') {
    settings.internationalization = state.i18n === 'simple' ? 'Строки' : 'Склонения / RTL'
  }
  if (state.devLevel !== 'middle') {
    settings.developerLevel = state.devLevel === 'junior' ? 'Junior' : 'Senior'
  }
  
  if (Object.keys(settings).length > 0) {
    jsonData.formattedData.settings = settings
  }
  
  // Дополнительные опции
  const features: Record<string, boolean> = {}
  if (state.ssr) features.ssr = true
  if (state.seoAdvanced) features.advancedSeo = true
  if (state.testsUnit) features.unitTests = true
  if (state.testsE2E) features.e2eTests = true
  if (state.responsive) features.responsiveDesign = true
  if (state.accessibility) features.accessibility = true
  if (state.codeReview) features.codeReview = true
  if (state.documentation) features.documentation = true
  if (state.deployment) features.deployment = true
  
  if (Object.keys(features).length > 0) {
    jsonData.formattedData.features = features
  }
  
  // Результаты расчетов
  jsonData.results = {
    hours: {
      optimistic: hours.value.optimistic,
      realistic: hours.value.realistic,
      pessimistic: hours.value.pessimistic
    },
    
    // Дополнительная аналитика
    analysis: {
      totalComponents: componentTypes.reduce((sum, t) => sum + (state.counts[t] || 0), 0),
      componentsWithBase: componentTypes.reduce((sum, t) => sum + (state.countsWithBase[t] || 0), 0),
      estimateRange: {
        min: hours.value.optimistic,
        max: hours.value.pessimistic,
        spread: Math.round((hours.value.pessimistic - hours.value.optimistic) * 10) / 10
      }
    }
  }
  
  const jsonContent = JSON.stringify(jsonData, null, 2)
  
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `trudozatraty-${dateStr}-${timeStr}.json`
  document.body.appendChild(link)
  link.click()
  
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Добавляем вычисляемое свойство для проверки наличия компонентов
const hasComponents = computed(() => {
  return Object.values(state.counts).some(count => count > 0)
})

// Добавляем функцию обработки успешного экспорта в Jira
function handleJiraSuccess(result: { key: string; url: string }) {
  showJiraIntegration.value = false
  
  alert(`Задача успешно создана в Jira!\nКлюч: ${result.key}\nСсылка: ${result.url}`)
  
  if (confirm('Открыть созданную задачу в Jira?')) {
    window.open(result.url, '_blank')
  }
}

// Функция обновления коэффициентов
function updateCoefficients(newCoefficients: AllCoefficients) {
  // Обновляем базовые коэффициенты
  coefficients.baseExists.true = newCoefficients.baseExists.true
  coefficients.baseExists.false = newCoefficients.baseExists.false
  
  coefficients.uiComplex.static = newCoefficients.uiComplex.static
  coefficients.uiComplex.interactive = newCoefficients.uiComplex.interactive
  
  coefficients.stateLayer.local = newCoefficients.stateLayer.local
  coefficients.stateLayer.global = newCoefficients.stateLayer.global
  
  coefficients.apiType.none = newCoefficients.apiType.none
  coefficients.apiType.simple = newCoefficients.apiType.simple
  coefficients.apiType.crud = newCoefficients.apiType.crud
  
  coefficients.ssr = newCoefficients.ssr
  coefficients.seoAdvanced = newCoefficients.seoAdvanced
  
  coefficients.i18n.none = newCoefficients.i18n.none
  coefficients.i18n.simple = newCoefficients.i18n.simple
  coefficients.i18n.advanced = newCoefficients.i18n.advanced
  
  coefficients.tests.unit = newCoefficients.tests.unit
  coefficients.tests.e2e = newCoefficients.tests.e2e
  
  coefficients.responsive = newCoefficients.responsive
  coefficients.accessibility = newCoefficients.accessibility
  coefficients.codeReview = newCoefficients.codeReview
  coefficients.documentation = newCoefficients.documentation
  coefficients.deployment = newCoefficients.deployment
  
  // Обновляем коэффициенты типов компонентов
  coefficients.componentTypes.layout = newCoefficients.componentTypes.layout
  coefficients.componentTypes.ui = newCoefficients.componentTypes.ui
  coefficients.componentTypes.form = newCoefficients.componentTypes.form
  coefficients.componentTypes.chart = newCoefficients.componentTypes.chart
  coefficients.componentTypes.complex = newCoefficients.componentTypes.complex
  
  // Обновляем множители уровней
  coefficients.levelFactor.junior = newCoefficients.levelFactor.junior
  coefficients.levelFactor.middle = newCoefficients.levelFactor.middle
  coefficients.levelFactor.senior = newCoefficients.levelFactor.senior
}
</script>

<style scoped>
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

.component-type-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

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

.btn {
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-info {
  background-color: #06b6d4;
  color: white;
}

.btn-info:hover:not(:disabled) {
  background-color: #0891b2;
}

.btn-success {
  background-color: #059669;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #047857;
}

.btn-accent {
  background-color: #8b5cf6;
  color: white;
}

.btn-accent:hover:not(:disabled) {
  background-color: #7c3aed;
}

.btn-warning {
  background-color: #f59e0b;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background-color: #d97706;
}

.btn-full-width {
  @media (max-width: 640px) {
    width: 100%;
    grid-column: 1 / -1;
  }
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

.gap-3 {
  gap: 0.75rem;
}


:deep(.form-group) {
  display: flex;
  flex-direction: column;
}

:deep(.form-group.full-width) {
  grid-column: 1 / -1;
}

:deep(.label) {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #111827;
}

.component-type-group :deep(.form-group:first-child .label) {
  font-weight: 600;
  font-size: 0.875rem;
  color: #111827;
}

.component-type-group :deep(.form-group:not(:first-child) .label) {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
}

:deep(.input),
:deep(.select) {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  height: 2.25rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  background: white;
  color: #111827;
  transition: border-color 0.2s;
  width: 100%;
}

.component-type-group :deep(.form-group:not(:first-child) .input) {
  height: 2rem;
  font-size: 0.8125rem;
}

:deep(.input:focus),
:deep(.select:focus) {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Number Input Wrapper */
:deep(.number-input-wrapper) {
  position: relative;
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  overflow: hidden;
  transition: border-color 0.2s;
}

:deep(.number-input-wrapper:focus-within) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.number-input-wrapper .input) {
  flex: 1;
  padding: 0 0.5rem 0 0.5rem;
  padding-right: 2.5rem;
  text-align: center;
  font-weight: 500;
  border: none;
  border-radius: 0;
  background: transparent;
  height: 2.25rem;
}

:deep(.number-controls) {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #d1d5db;
  width: 2rem;
}

:deep(.number-btn) {
  flex: 1;
  width: 100%;
  background: #f9fafb;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.75rem;
  color: #6b7280;
  transition: all 0.2s;
  line-height: 1;
  font-family: monospace;
}

:deep(.number-btn:hover) {
  background: #e5e7eb;
  color: #374151;
}

:deep(.number-btn.increment) {
  border-bottom: 1px solid #d1d5db;
}

:deep(.number-btn.increment::before) {
  content: '+';
}

:deep(.number-btn.decrement::before) {
  content: '−';
}

:deep(.checkbox-wrapper) {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  color: #111827;
  font-weight: 500;
}

:deep(.checkbox) {
  position: relative;
  width: 3rem;
  height: 1.5rem;
  background-color: #d1d5db;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  appearance: none;
  outline: none;
}

:deep(.checkbox::before) {
  content: '';
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

:deep(.checkbox:checked) {
  background-color: #3b82f6;
}

:deep(.checkbox:checked::before) {
  transform: translateX(1.5rem);
}

:deep(.checkbox:hover) {
  background-color: #9ca3af;
}

:deep(.checkbox:checked:hover) {
  background-color: #2563eb;
}

/* Result Card Styles */
:deep(.result-card) {
  padding: 1rem;
  border-radius: 0.75rem;
}

:deep(.result-card.green) {
  background-color: #dcfce7;
}

:deep(.result-card.blue) {
  background-color: #eff6ff;
}

:deep(.result-card.red) {
  background-color: #fef2f2;
}

:deep(.result-card .title) {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}

:deep(.result-card .value) {
  font-size: 1.25rem;
  font-weight: 500;
  color: #111827;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 0 1.5rem;
  overflow-y: auto;
  flex: 1;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.detail-label {
  font-weight: 500;
  color: #374151;
}

.detail-value {
  font-weight: 600;
  color: #111827;
}

.component-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.breakdown-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f9fafb;
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.breakdown-type {
  font-weight: 600;
  color: #111827;
  font-size: 1rem;
}

.breakdown-count {
  font-weight: 500;
  color: #6b7280;
  background-color: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.breakdown-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.breakdown-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  font-size: 0.875rem;
  color: #374151;
}

.breakdown-line span:first-child {
  color: #4b5563;
}

.breakdown-line span:last-child {
  font-weight: 600;
  color: #111827;
}

.breakdown-line.total {
  border-top: 1px solid #d1d5db;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  font-weight: 600;
  color: #111827;
}

.breakdown-line.total span:first-child {
  color: #111827;
}

.calculation-summary {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.5rem;
  padding: 1rem;
}

.calc-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0f2fe;
}

.calc-line:last-child {
  border-bottom: none;
}

.calc-line.separator {
  border-top: 2px solid #0ea5e9;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 600;
}

.calc-line span:first-child {
  color: #111827;
  font-weight: 500;
}

.calc-line span:last-child {
  font-weight: 600;
  color: #111827;
}

.jira-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  background: white;
  color: #111827;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.jira-preview {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.estimate-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #dcfce7;
  color: #111827;
}

.estimate-item:last-child {
  border-bottom: none;
}

.estimate-item span:first-child {
  font-weight: 500;
  color: #374151;
}

.estimate-item span:last-child {
  font-weight: 600;
  color: #111827;
}

.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 640px) {
  .buttons-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}

@media (min-width: 1024px) {
  .buttons-container {
    justify-content: flex-end;
    flex-wrap: nowrap;
  }
}

.buttons-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

@media (min-width: 640px) {
  .buttons-group {
    justify-content: flex-start;
    flex-wrap: nowrap;
  }
}

@media (max-width: 639px) {
  .btn {
    flex: 1;
    min-width: 0;
    font-size: 0.8125rem;
    padding: 0.625rem 0.75rem;
    text-align: center;
  }
  
  .buttons-group {
    width: 100%;
  }
  
  .buttons-group:nth-child(1),
  .buttons-group:nth-child(2) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  
  .buttons-group:nth-child(3) {
    display: flex;
    margin-top: 0.5rem;
  }
  
  .buttons-group:nth-child(3) .btn {
    width: 100%;
  }
}
</style>
