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
            label="Интернационализация (i18n)"
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
        <div class="flex justify-end gap-3">
          <button class="btn btn-primary" @click="exportToCsv">Экспорт в CSV</button>
          <button class="btn btn-accent" @click="exportToJson">Экспорт в JSON</button>
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
 * Вручную сбрасываем каждое поле для корректной работы с реактивностью Vue
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
  // Получаем текущую дату для названия файла
  const now = new Date()
  const dateStr = now.toLocaleDateString('ru-RU').replace(/\./g, '-')
  const timeStr = now.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }).replace(':', '-')
  
  // Формируем данные для экспорта
  const csvData = [
    ['Параметр', 'Значение'],
    ['Дата расчета', `${dateStr} ${timeStr}`],
    [''],
    
    // Количество компонентов
    ['=== КОЛИЧЕСТВО КОМПОНЕНТОВ ===', ''],
    ...componentTypes.map(type => [
      `${labels[type]}`, 
      state.counts[type] || 0
    ]),
    [''],
    
    // Компоненты с готовой базой
    ['=== КОМПОНЕНТЫ С ГОТОВОЙ БАЗОЙ ===', ''],
    ...componentTypes.map(type => [
      `${labels[type]} с базой`, 
      state.countsWithBase[type] || 0
    ]),
    [''],
    
    // Новые props на компонент
    ['=== НОВЫЕ PROPS НА КОМПОНЕНТ ===', ''],
    ...componentTypes.map(type => [
      `${labels[type]} - новые props`, 
      state.countsNewProps[type] || 0
    ]),
    [''],
    
    // Основные параметры
    ['=== ОСНОВНЫЕ ПАРАМЕТРЫ ===', ''],
    ['Сложность UI', state.uiComplex === 'static' ? 'Статическая' : 'Интерактивная'],
    ['Слой состояния', state.stateLayer === 'local' ? 'Локальный' : 'Глобальный'],
    ['Тип API', 
      state.apiType === 'none' ? 'Нет' : 
      state.apiType === 'simple' ? 'Простой GET' : 'Полный CRUD'
    ],
    ['Интернационализация', 
      state.i18n === 'none' ? 'Нет' : 
      state.i18n === 'simple' ? 'Строки' : 'Склонения / RTL'
    ],
    ['Грейд разработчика', 
      state.devLevel === 'junior' ? 'Junior' : 
      state.devLevel === 'middle' ? 'Middle' : 'Senior'
    ],
    [''],
    
    // Дополнительные опции
    ['=== ДОПОЛНИТЕЛЬНЫЕ ОПЦИИ ===', ''],
    ['SSR (Async Data, Изоморфный код)', state.ssr ? 'Да' : 'Нет'],
    ['Расширенный SEO', state.seoAdvanced ? 'Да' : 'Нет'],
    ['Unit-тесты', state.testsUnit ? 'Да' : 'Нет'],
    ['E2E-тесты', state.testsE2E ? 'Да' : 'Нет'],
    ['Адаптивный дизайн', state.responsive ? 'Да' : 'Нет'],
    ['Доступность (a11y)', state.accessibility ? 'Да' : 'Нет'],
    ['Код-ревью и рефакторинг', state.codeReview ? 'Да' : 'Нет'],
    ['Документация', state.documentation ? 'Да' : 'Нет'],
    ['Настройка деплоя и CI/CD', state.deployment ? 'Да' : 'Нет'],
    [''],
    
    // Результаты
    ['=== РЕЗУЛЬТАТЫ (ЧАСЫ) ===', ''],
    ['Оптимистичная оценка', hours.value.optimistic],
    ['Реалистичная оценка', hours.value.realistic],
    ['Пессимистичная оценка', hours.value.pessimistic],
  ]
  
  // Преобразуем в CSV формат
  const csvContent = csvData
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  
  // Добавляем BOM для корректного отображения русских символов в Excel
  const bom = '\uFEFF'
  const csvWithBom = bom + csvContent
  
  // Создаем blob и ссылку для скачивания
  const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  
  // Создаем временную ссылку и кликаем по ней
  const link = document.createElement('a')
  link.href = url
  link.download = `trudozatraty-${dateStr}-${timeStr}.csv`
  document.body.appendChild(link)
  link.click()
  
  // Очищаем ресурсы
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Добавляем функцию экспорта в JSON
function exportToJson() {
  // Получаем текущую дату для названия файла
  const now = new Date()
  const dateStr = now.toLocaleDateString('ru-RU').replace(/\./g, '-')
  const timeStr = now.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }).replace(':', '-')
  
  // Формируем структурированные данные для экспорта
  const jsonData = {
    meta: {
      exportDate: now.toISOString(),
      exportDateFormatted: `${dateStr} ${timeStr}`,
      version: '1.0',
      description: 'Экспорт данных калькулятора трудозатрат'
    },
    
    // Исходные данные формы (для возможного импорта)
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
    formattedData: {
      components: {
        counts: componentTypes.reduce((acc, type) => {
          acc[labels[type]] = state.counts[type] || 0
          return acc
        }, {} as Record<string, number>),
        
        withBase: componentTypes.reduce((acc, type) => {
          acc[labels[type]] = state.countsWithBase[type] || 0
          return acc
        }, {} as Record<string, number>),
        
        newProps: componentTypes.reduce((acc, type) => {
          acc[labels[type]] = state.countsNewProps[type] || 0
          return acc
        }, {} as Record<string, number>)
      },
      
      settings: {
        uiComplexity: state.uiComplex === 'static' ? 'Статическая' : 'Интерактивная',
        stateManagement: state.stateLayer === 'local' ? 'Локальный' : 'Глобальный',
        apiIntegration: state.apiType === 'none' ? 'Нет' : 
                       state.apiType === 'simple' ? 'Простой GET' : 'Полный CRUD',
        internationalization: state.i18n === 'none' ? 'Нет' : 
                              state.i18n === 'simple' ? 'Строки' : 'Склонения / RTL',
        developerLevel: state.devLevel === 'junior' ? 'Junior' : 
                       state.devLevel === 'middle' ? 'Middle' : 'Senior'
      },
      
      features: {
        ssr: state.ssr,
        advancedSeo: state.seoAdvanced,
        unitTests: state.testsUnit,
        e2eTests: state.testsE2E,
        responsiveDesign: state.responsive,
        accessibility: state.accessibility,
        codeReview: state.codeReview,
        documentation: state.documentation,
        deployment: state.deployment
      }
    },
    
    // Результаты расчетов
    results: {
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
  }
  
  // Преобразуем в JSON с красивым форматированием
  const jsonContent = JSON.stringify(jsonData, null, 2)
  
  // Создаем blob и ссылку для скачивания
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  
  // Создаем временную ссылку и кликаем по ней
  const link = document.createElement('a')
  link.href = url
  link.download = `trudozatraty-${dateStr}-${timeStr}.json`
  document.body.appendChild(link)
  link.click()
  
  // Очищаем ресурсы
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
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

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-accent {
  background-color: #8b5cf6;
  color: white;
}

.btn-accent:hover {
  background-color: #7c3aed;
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

/* === БАЗОВЫЕ КОМПОНЕНТЫ === */

/* Form Group Styles */
:deep(.form-group) {
  display: flex;
  flex-direction: column;
}

:deep(.form-group.full-width) {
  grid-column: 1 / -1;
}

/* Label Styles */
:deep(.label) {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #111827;
}

/* Component type group labels */
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

/* Input and Select Styles */
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

/* Checkbox/Toggle Styles */
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
</style>
