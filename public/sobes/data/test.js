window.SOBES = window.SOBES || { topics: [] };

window.SOBES.topics.push(
  // ───────────────────────────── Основы ─────────────────────────────
  {
    id: 'test-pyramid',
    section: 'test',
    group: 'Основы',
    title: 'Виды тестов и пирамида',
    level: 'middle',
    summary: 'Unit, integration и E2E различаются охватом, скоростью и ценой. Пирамида и «трофей» задают, сколько каких держать.',
    points: [
      { title: 'Unit — одна единица, integration — части вместе, E2E — весь сценарий в браузере', text: 'Unit: утилита, composable, стор. Integration: компонент с детьми и стором, но без настоящего бэкенда (VTU, Testing Library). E2E: собранное приложение в браузере, вход или оформление заказа (Playwright). Чем выше слой, тем медленнее и дороже тест, но ближе к правде.', code: `formatPrice(1500)                  // unit
mount(CartPage, { global: { plugins: [pinia] } }) // integration
await page.getByRole('button', { name: 'Оформить' }).click() // E2E`, lang: 'ts' },
      { title: 'Пирамида — упор на unit, трофей — на integration', text: 'Пирамида: много дешёвых unit, мало E2E. Трофей Кента Доддса: снизу статический анализ (TypeScript, ESLint), самый широкий слой — integration, сверху немного E2E. Для фронтенда трофей обычно ближе к жизни: компонент проще проверить с детьми, чем дробить.' },
      { title: 'Тестировать поведение, а не реализацию', text: 'Проверять то, что видно снаружи: разметку, события, запросы. Такой тест переживает рефакторинг и краснеет только при реальной поломке. Тест на `wrapper.vm` ломается от любого переписывания.', code: `expect(wrapper.vm.isOpen).toBe(true) // плохо: внутреннее состояние

await wrapper.find('[data-testid="toggle"]').trigger('click')
expect(wrapper.find('[data-testid="dropdown"]').isVisible()).toBe(true) // ок`, lang: 'ts' },
      { title: '100% покрытия — не цель, порог — защита от просадки', text: 'Coverage показывает, что строки выполнились, а не что результат проверили. Погоня за цифрой рождает тесты без проверок. Смотрят, покрыта ли критичная логика: деньги, права, формы.', code: `// vitest.config.ts
test: {
  coverage: {
    provider: 'v8',
    thresholds: { lines: 70, branches: 60 }, // разумно, не 100
  },
}`, lang: 'ts' },
      { title: 'Ловушки: всё в E2E и всё замокано в integration', text: 'Покрыть всё E2E — набор медленный и flaky, ему перестают доверять. Замокать всё в integration — получается unit-тест с лишними шагами, ошибки стыковки он не ловит.' }
    ],
    takeaway: 'Много быстрых тестов на логику и компоненты, несколько E2E на сценарии с деньгами и доступом. Проверять поведение.',
    questions: [
      { q: 'Чем unit-тест отличается от integration и E2E?', a: 'Разница в охвате. Unit проверяет одну функцию или composable в изоляции, integration — несколько частей вместе, например компонент со стором, но без настоящего API. E2E поднимает всё приложение в браузере и проходит сценарий как пользователь. Чем выше уровень, тем больше уверенности, но тем медленнее и дороже тест в поддержке.' },
      { q: 'Что такое пирамида тестирования и чем от неё отличается «трофей»?', a: 'Пирамида — рекомендация держать много unit-тестов, меньше integration и совсем немного E2E, потому что верхние слои дорогие и медленные. Трофей Кента Доддса добавляет снизу статический анализ и делает самым широким слоем integration: такие тесты ближе к реальному использованию и при этом достаточно быстрые. Для фронтенда трофей обычно ближе к жизни: компонент проще проверить вместе с его детьми, чем дробить на изолированные куски.' },
      { q: 'Нужно ли 100% покрытие?', a: 'Нет. Покрытие показывает, какие строки выполнились во время тестов, но не то, что результат проверили. Последние проценты обычно даются тестами на тривиальный код или на редкие ветки, которые дорого поддерживать. Порог имеет смысл как защита от сильной просадки, а смотреть лучше на то, покрыта ли критичная логика: деньги, права, формы.' },
      { q: 'Что значит «тестировать поведение, а не реализацию»?', a: 'Тест проверяет то, что видно снаружи: разметку, события, запросы, возвращаемое значение. Внутренние переменные и приватные функции он не трогает. Тогда при рефакторинге, который не меняет поведение, тесты остаются зелёными, а при реальной поломке краснеют. Это главный критерий полезного теста.' }
    ]
  },

  {
    id: 'test-vitest',
    section: 'test',
    group: 'Основы',
    title: 'Vitest',
    level: 'middle',
    summary: 'Тест-раннер на Vite с Jest-совместимым API: та же конфигурация, что у проекта, `.vue`/TS/ESM без доп. настройки, быстрый watch.',
    points: [
      { title: 'Vitest использует конвейер Vite — алиасы и плагины общие с проектом', text: 'Не нужны Babel и ts-jest: `.vue`, TypeScript и ESM работают сразу. Поэтому это стандарт для Vue 3 и Nuxt. Против Jest миграция обычно сводится к `jest.fn` → `vi.fn` и конфигу.', code: `// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  test: { environment: 'jsdom' }, // DOM для компонентов
})`, lang: 'ts' },
      { title: 'API как у Jest: `describe`, `it`, `expect`, хуки, вместо `jest` — `vi`', text: '`globals: false` по умолчанию — функции импортируют явно. Свежее состояние создают в `beforeEach`, иначе тесты зависят от порядка.', code: `import { describe, it, expect, beforeEach } from 'vitest'
describe('cart', () => {
  let cart: Cart
  beforeEach(() => { cart = createCart() })
  it('считает сумму', () => {
    cart.add({ id: 1, price: 100 }, 2)
    expect(cart.total).toBe(200)
  })
})`, lang: 'ts' },
      { title: '`toBe` — по ссылке, `toEqual` — по структуре', text: '`toBe` сравнивает через `Object.is`. `toEqual` рекурсивно сравнивает структуру, `toStrictEqual` ещё учитывает `undefined`-поля и классы.', code: `expect({ a: 1 }).toBe({ a: 1 })          // упадёт: разные объекты
expect({ a: 1 }).toEqual({ a: 1 })       // ок
expect({ a: 1, b: undefined }).toStrictEqual({ a: 1 }) // упадёт`, lang: 'ts' },
      { title: 'По умолчанию Node — для компонентов нужен jsdom или happy-dom', text: 'Это эмуляция DOM, не браузер: нет layout, `getBoundingClientRect` возвращает нули, `IntersectionObserver` приходится мокать. jsdom полнее, happy-dom обычно быстрее. Настоящий браузер — Playwright или Browser Mode Vitest.', code: `// @vitest-environment jsdom   — для одного файла
test: { environment: 'happy-dom' } // для всех`, lang: 'ts' },
      { title: 'Ловушка: асинхронная проверка без `await` проходит ложно', text: 'Тест заканчивается раньше, чем промис отклонится.', code: `expect(load()).rejects.toThrow()       // ложный зелёный
await expect(load()).rejects.toThrow() // ок`, lang: 'ts' },
      { title: 'Snapshot — только маленькие', text: 'Снапшот фиксирует текущий результат, даже если он с ошибкой. Большой снапшот разметки обновляют через `-u` не читая, и тест ничего не проверяет. Хорошо работают маленькие: текст ошибки, сгенерированный объект.', code: `expect(validate('')).toMatchInlineSnapshot(\`"Поле обязательно"\`)`, lang: 'ts' }
    ],
    takeaway: '`vitest` — watch-режим локально, `vitest run` — в CI. Для unit и компонентных тестов в любом проекте на Vite или Nuxt.',
    questions: [
      { q: 'Почему Vitest, а не Jest, в проекте на Vue/Vite?', a: 'Vitest использует ту же конфигурацию Vite, что и проект: алиасы, плагин Vue, обработка TypeScript работают без дублирования. ESM поддерживается нативно, а в Jest для этого нужны трансформеры и настройка. API почти совместим с Jest, поэтому порог входа низкий. Плюс быстрый watch-режим, который перезапускает только затронутые тесты.' },
      { q: 'Что такое snapshot-тесты и в чём их минусы?', a: 'Снапшот сохраняет сериализованный результат, например HTML компонента, в файл, а следующие прогоны сравнивают с ним (`toMatchSnapshot`, `toMatchInlineSnapshot`). Они дёшево ловят неожиданные изменения. Минус в том, что снапшот не говорит, какой результат правильный: он фиксирует текущий, даже если он с ошибкой. Большие снапшоты обновляют через `-u` не читая, и тест теряет смысл. Хорошо работают маленькие снапшоты: сообщение об ошибке, сгенерированный объект.' },
      { q: 'Зачем нужно окружение jsdom или happy-dom?', a: 'Vitest по умолчанию запускает тесты в Node, где нет `document` и `window`. Для монтирования компонентов нужен DOM, и jsdom или happy-dom его эмулируют. Окружение задают в конфиге (`test.environment`) или комментарием `// @vitest-environment jsdom` в отдельном файле. Важно помнить, что это эмуляция: вёрстку, реальные размеры и браузерные особенности так не проверить.' }
    ]
  },

  {
    id: 'test-mocks',
    section: 'test',
    group: 'Основы',
    title: 'Моки, шпионы и фейковые таймеры',
    level: 'middle',
    summary: 'Мок подменяет зависимость управляемой заглушкой: тест изолированный, быстрый и одинаковый при каждом запуске. Мокают границы — сеть, время, случайность.',
    points: [
      { title: '`vi.fn` — новая функция, `vi.spyOn` — обёртка над существующим методом', text: 'Spy по умолчанию вызывает оригинал и записывает вызовы; реализацию можно подменить. После теста — `mockRestore()`, иначе подмена останется.', code: `const onSave = vi.fn().mockResolvedValue({ ok: true })
const spy = vi.spyOn(analytics, 'track')      // оригинал работает
spy.mockImplementation(() => {})              // или подменить
expect(spy).toHaveBeenCalledWith('add_to_cart')
spy.mockRestore()`, lang: 'ts' },
      { title: '`vi.mock` поднимается в начало файла — переменные для фабрики через `vi.hoisted`', text: 'Вызов выполняется раньше импортов, поэтому обычный `const` выше него ещё не инициализирован.', code: `const { search } = vi.hoisted(() => ({ search: vi.fn() }))
vi.mock('./api', () => ({ searchProducts: search }))

const data = []                          // не сработает:
vi.mock('./api', () => ({ list: () => data })) // ещё не объявлена`, lang: 'ts' },
      { title: 'Фейковые таймеры: время двигают вручную', text: '`vi.useFakeTimers()` подменяет `setTimeout`, `setInterval` и `Date`. Debounce проверяют так: до задержки вызова нет, после — ровно один. В конце обязательно `vi.useRealTimers()`, иначе следующие тесты зависнут.', code: `vi.useFakeTimers()
const { query } = useSearch()
query.value = 'сыр'
await nextTick()                 // дать отработать watch
vi.advanceTimersByTime(299)
expect(searchProducts).not.toHaveBeenCalled()
vi.advanceTimersByTime(1)
expect(searchProducts).toHaveBeenCalledOnce()`, lang: 'ts' },
      { title: 'MSW подменяет ответ сети, а код до `fetch` остаётся настоящим', text: 'В отличие от `vi.mock`, ловит ошибки в URL, query, заголовках и разборе ответа. Одни обработчики работают в тестах (`msw/node`) и в браузере при разработке. Обработчики сбрасывают после каждого теста.', code: `const server = setupServer(
  http.get('/api/products', () => HttpResponse.json([{ id: 1, name: 'Сыр' }])),
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
server.use(http.get('/api/products', () => new HttpResponse(null, { status: 500 })))`, lang: 'ts' },
      { title: 'Моки сбрасывать между тестами', text: 'Иначе счётчики вызовов и подменённые реализации переезжают в следующий тест. Хуки или опции конфига.', code: `afterEach(() => vi.restoreAllMocks())
// или в vitest.config: test: { clearMocks: true, restoreMocks: true }`, lang: 'ts' },
      { title: 'Ловушка: мокать собственный код', text: 'Тест проходит, даже если стыковка сломана: сигнатура поменялась, а мок отдаёт старый формат. Замокать стор в тесте самого стора — проверить только мок. Если для теста мокаешь полпроекта — проблема в дизайне кода.' }
    ],
    takeaway: 'Мокать сеть, время, случайность и браузерные API, которых нет в jsdom. Для сети лучше MSW, чем мок модуля.',
    questions: [
      { q: 'Чем `vi.fn` отличается от `vi.spyOn`?', a: '`vi.fn()` создаёт новую функцию-мок с нуля, её передают как колбэк или подставляют в фабрику модуля. `vi.spyOn(obj, \'method\')` оборачивает существующий метод объекта: вызовы записываются, а оригинал по умолчанию продолжает работать. Если нужно, реализацию подменяют через `mockImplementation` или `mockReturnValue`. После теста spy восстанавливают через `mockRestore()`, иначе подмена останется.' },
      { q: 'Как протестировать debounce?', a: 'Включить фейковые таймеры через `vi.useFakeTimers()`, вызвать функцию несколько раз подряд и вручную продвинуть время через `vi.advanceTimersByTime()`. До истечения задержки проверяем, что колбэк не вызван, после — что вызван ровно один раз с последними аргументами. Так тест идёт мгновенно и не зависит от реальных таймаутов. В конце возвращаем реальные таймеры через `vi.useRealTimers()`.' },
      { q: 'Что такое MSW и чем он лучше мока `fetch`?', a: 'MSW перехватывает запросы на сетевом уровне и отвечает по описанным обработчикам, а код приложения выполняется полностью, вплоть до вызова `fetch`. Поэтому тест ловит ошибки в URL, query-параметрах, заголовках и разборе ответа, которые при моке модуля или `fetch` не видны. Одни и те же обработчики можно использовать в тестах (`msw/node`) и в браузере при разработке. Цена — немного больше настройки: сервер нужно запустить, сбрасывать обработчики между тестами и закрыть.' },
      { q: 'Когда моки вредят?', a: 'Когда мокают собственный код, который нужно проверить вместе с тестируемым. Тест тогда проходит, даже если реальная стыковка сломана, — например, поменялась сигнатура функции, а мок по-прежнему возвращает старый формат. Много моков в одном тесте обычно означает сильную связанность кода. Разумное правило — мокать границы системы: сеть, время, случайность, браузерные API.' }
    ]
  },

  // ───────────────────────────── Vue и Nuxt ─────────────────────────────
  {
    id: 'test-vtu',
    section: 'test',
    group: 'Vue и Nuxt',
    title: 'Vue Test Utils и Testing Library',
    level: 'middle',
    summary: 'Vue Test Utils монтирует компонент в тестовый DOM и даёт API для пропсов, слотов, событий и `emitted`. Testing Library поверх него — тесты «как пользователь».',
    points: [
      { title: 'После `trigger`, `setValue`, `setProps` — `await`', text: 'Vue обновляет DOM пакетно в следующем микротаске; эти методы возвращают промис, который резолвится после `nextTick`. Без `await` проверка видит старый DOM. Если в обработчике запрос — нужен `flushPromises()`.', code: `await wrapper.find('[data-testid="inc"]').trigger('click')
expect(wrapper.text()).toContain('2')
await flushPromises() // дождаться промисов из onMounted / обработчиков`, lang: 'ts' },
      { title: '`emitted()` — массив вызовов, каждый вызов — массив аргументов', text: 'Один вызов с аргументом 2 — это `[[2]]`. Не эмитилось — `undefined`. Для `v-model` проверяют `update:modelValue`.', code: `const wrapper = mount(QuantityInput, {
  props: { modelValue: 1, max: 5 },
  slots: { label: 'Количество' },
})
await wrapper.find('[data-testid="inc"]').trigger('click')
expect(wrapper.emitted('update:modelValue')).toEqual([[2]])`, lang: 'ts' },
      { title: '`mount` по умолчанию, заглушки — точечно через `global.stubs`', text: '`shallowMount` заменяет всех детей и не поймает поломку стыковки (ребёнок перестал эмитить событие). Глушат только тяжёлые или внешние компоненты.', code: `mount(ProductPage, {
  global: {
    plugins: [router, createTestingPinia({ createSpy: vi.fn })],
    stubs: { ProductGallery: true }, // тяжёлый ребёнок — заглушка
  },
})`, lang: 'ts' },
      { title: 'Ловушка: без router/pinia в `global.plugins` компонент падает при монтировании', text: 'Ошибка про `inject` или отсутствие активного Pinia — значит, плагин не подключён в тесте.' },
      { title: 'Искать по `data-testid` или роли, а не по CSS-классам и `wrapper.vm`', text: 'Классы меняются при редизайне, `wrapper.vm` — тест на реализацию. Testing Library ищет по роли, тексту и подписи — заодно проверяет доступность: не нашёл кнопку по роли — не найдёт и скринридер.', code: `wrapper.find('.btn-primary')            // хрупко
wrapper.find('[data-testid="submit"]')  // ок
screen.getByRole('button', { name: 'Сохранить' }) // Testing Library`, lang: 'ts' }
    ],
    takeaway: 'VTU гибче (`emitted`, `findComponent`) — удобен для библиотечных компонентов. Testing Library держит тест на уровне пользователя.',
    questions: [
      { q: 'Чем `mount` отличается от `shallowMount`?', a: '`mount` рендерит компонент со всем деревом дочерних компонентов, `shallowMount` заменяет детей заглушками. Shallow быстрее и изолирует компонент, но не поймает ошибку на стыке с детьми: например, если дочерний компонент перестал эмитить событие. Поэтому по умолчанию разумнее `mount`, а заглушки ставить точечно через `global.stubs` для тяжёлых или внешних компонентов.' },
      { q: 'Зачем `await` после `trigger`?', a: 'Vue обновляет DOM не сразу, а пакетно в следующем микротаске. `trigger` возвращает промис, который разрешается после `nextTick`, то есть после перерисовки. Без `await` проверка увидит старый DOM. Если внутри обработчика есть свой асинхронный код, например запрос, одного `nextTick` мало — используют `flushPromises()` из VTU.' },
      { q: 'Как проверить, что компонент эмитит событие?', a: 'Через `wrapper.emitted(\'имя\')`. Метод возвращает массив всех вызовов события, где каждый вызов — массив аргументов, поэтому одиночный вызов с аргументом 2 выглядит как `[[2]]`. Если событие не эмитилось, вернётся `undefined`. Для `v-model` проверяют событие `update:modelValue`.' },
      { q: 'Чем Testing Library отличается от Vue Test Utils?', a: 'Testing Library построена поверх VTU, но ограничивает тест тем, что доступно пользователю: элементы ищут по роли, тексту, подписи (`getByRole`, `getByLabelText`), а не по компонентам и внутреннему состоянию. Это заставляет писать тесты на поведение и заодно проверяет доступность: если кнопку не найти по роли, её не найдёт и скринридер. VTU гибче и даёт доступ к `emitted` и `findComponent`, что удобно для библиотечных компонентов.' }
    ]
  },

  {
    id: 'test-composables-pinia',
    section: 'test',
    group: 'Vue и Nuxt',
    title: 'Тестирование composables и Pinia',
    level: 'middle',
    summary: 'Composable без lifecycle и `inject` тестируют обычным вызовом. Pinia — свежий экземпляр на каждый тест или `createTestingPinia` в компонентных тестах.',
    points: [
      { title: 'Composable на одной реактивности — просто вызвать', text: 'Меняем входные `ref`, проверяем результат. Для `watch` с асинхронным сбросом — `await nextTick()`.', code: `const page = ref(1)
const { offset } = usePagination(page, 20)
page.value = 3
expect(offset.value).toBe(40)`, lang: 'ts' },
      { title: 'С `onMounted` или `inject` — вызывать в `setup` хост-компонента', text: 'Вне компонента хук не сработает (Vue только предупредит), и тест проверит не то. `unmount()` проверяет, что слушатели сняты. Для `inject` — `app.provide` перед монтированием.', code: `function withSetup<T>(composable: () => T) {
  let result!: T
  const app = createApp({ setup() { result = composable(); return () => {} } })
  app.mount(document.createElement('div'))
  return [result, app] as const
}
const [width, app] = withSetup(() => useWindowWidth())
app.unmount()`, lang: 'ts' },
      { title: 'Стор: новый Pinia в `beforeEach`', text: 'Сторы — синглтоны внутри экземпляра Pinia. Один экземпляр на файл — состояние перетекает между тестами. `setActivePinia` нужен, чтобы `useStore()` работал вне компонента; без него — ошибка про `getActivePinia()`.', code: `beforeEach(() => setActivePinia(createPinia()))

it('считает итог', () => {
  const cart = useCartStore()
  cart.add({ id: 1, price: 150 }); cart.add({ id: 1, price: 150 })
  expect(cart.total).toBe(300)
})`, lang: 'ts' },
      { title: '`createTestingPinia` глушит actions шпионами', text: 'Для компонентных тестов: проверяем, что компонент вызвал action, а не что тот сделал. `initialState` задаёт состояние, в Vitest без глобалов нужен `createSpy: vi.fn`. Ловушка: ждать, что заглушённый action изменит состояние; нужна реальная логика — `stubActions: false`.', code: `const wrapper = mount(Cart, {
  global: { plugins: [createTestingPinia({
    createSpy: vi.fn,
    initialState: { cart: { items: [{ id: 1 }] } },
  })] },
})
const cart = useCartStore()
await wrapper.find('[data-testid="clear"]').trigger('click')
expect(cart.clear).toHaveBeenCalled()`, lang: 'ts' }
    ],
    takeaway: 'Логика в composables и сторах — самое выгодное для тестов: не зависит от разметки, тесты быстрые и стабильные.',
    questions: [
      { q: 'Как протестировать composable?', a: 'Если он использует только реактивность, его вызывают как обычную функцию, меняют входные `ref` и проверяют результат; для асинхронных `watch` нужен `await nextTick()`. Если внутри есть lifecycle-хуки или `inject`, нужен экземпляр компонента: composable вызывают в `setup` маленького хост-компонента и монтируют его. Для `inject` в хост передают `provide` через `app.provide` или `global.provide` в `mount`.' },
      { q: 'Зачем `setActivePinia(createPinia())` в `beforeEach`?', a: 'Сторы Pinia — синглтоны внутри экземпляра Pinia. Если экземпляр один на все тесты, изменения из одного теста видны в следующем. Новый Pinia перед каждым тестом даёт чистое состояние, а `setActivePinia` делает его активным, чтобы `useStore()` работал вне компонента.' },
      { q: 'Что делает `createTestingPinia`?', a: 'Это Pinia для компонентных тестов из пакета `@pinia/testing`. По умолчанию все actions заменяются шпионами и не выполняются, поэтому компонент проверяют изолированно: вызвал ли он нужный action с нужными аргументами. Через `initialState` задают состояние сторов перед монтированием. В Vitest без глобальных переменных нужно передать `createSpy: vi.fn`, а если нужна реальная логика — `stubActions: false`.' }
    ]
  },

  {
    id: 'test-nuxt',
    section: 'test',
    group: 'Vue и Nuxt',
    title: 'Тестирование в Nuxt',
    level: 'middle+',
    summary: '`@nuxt/test-utils` даёт Vitest-окружение `nuxt` с автоимпортами, плагинами и рантаймом Nuxt, плюс хелперы для монтирования и моков.',
    points: [
      { title: 'Обычный `mount` не знает контекста Nuxt — компонент падает на `useFetch`', text: 'Окружение `nuxt` поднимает рантайм: автоимпорты, плагины, `useNuxtApp`, `useRuntimeConfig` (под капотом happy-dom или jsdom). Включают в конфиге, комментарием `// @vitest-environment nuxt` или соглашением об именах вроде `*.nuxt.spec.ts`. Способ настройки менялся между версиями пакета — сверяться с документацией своей.', code: `// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'
export default defineVitestConfig({
  test: { environment: 'nuxt' },
})`, lang: 'ts' },
      { title: '`mountSuspended` — монтирует в Nuxt-приложении и ждёт async `setup`', text: 'Оборачивает компонент в Suspense и возвращает промис: без `await` проверки выполнятся до завершения `setup`.', code: `import { mountSuspended } from '@nuxt/test-utils/runtime'
const wrapper = await mountSuspended(ProductCard, {
  props: { product: { id: 1, name: 'Сыр' } },
})
expect(wrapper.text()).toContain('Сыр')`, lang: 'ts' },
      { title: '`registerEndpoint` — ответ для пути, `mockNuxtImport` — подмена автоимпорта', text: 'С `registerEndpoint` код запроса остаётся настоящим — ближе к реальности. `mockNuxtImport` подменяет composable по имени, когда нужен полный контроль; `vi.mock` по пути для автоимпортов неудобен.', code: `registerEndpoint('/api/products/42', () => ({ id: 42, name: 'Сыр' }))
mockNuxtImport('useRoute', () => () => ({ params: { id: '42' } }))`, lang: 'ts' },
      { title: 'Ловушка: `mockNuxtImport` поднимается в начало файла, один раз на имя', text: 'Разные значения для разных тестов — через реализацию в `vi.hoisted`, которую меняют в тесте.', code: `const { useRouteMock } = vi.hoisted(() => ({ useRouteMock: vi.fn() }))
mockNuxtImport('useRoute', () => useRouteMock)

it('товар 42', async () => {
  useRouteMock.mockReturnValue({ params: { id: '42' } })
})`, lang: 'ts' },
      { title: 'Окружение `nuxt` — только тем, кому нужен рантайм', text: 'Оно стартует заметно медленнее. Чистые утилиты и composables без Nuxt-API гоняют в Node или jsdom; наборы разделяют по имени файла или отдельными проектами Vitest. Для E2E — `@nuxt/test-utils/e2e`, он собирает и запускает приложение.' }
    ],
    takeaway: 'Два набора: быстрый для чистой логики и `nuxt`-окружение для страниц и компонентов с `useFetch`, `useRoute`, `useState`.',
    questions: [
      { q: 'Почему компонент Nuxt нельзя просто смонтировать через `mount`?', a: 'Компоненты Nuxt опираются на автоимпорты и контекст приложения: `useFetch`, `useRoute`, `useNuxtApp`, плагины. Обычный `mount` этот контекст не создаёт, и вызовы падают или возвращают пустоту. Окружение nuxt из `@nuxt/test-utils` поднимает рантайм Nuxt, а `mountSuspended` монтирует компонент внутри него и дожидается асинхронного `setup`.' },
      { q: 'Как замокать `useFetch` или запрос к API в Nuxt-тесте?', a: 'Два пути. `registerEndpoint` из `@nuxt/test-utils/runtime` регистрирует ответ для пути, и `$fetch`/`useFetch` получат его вместо реального запроса — сам код запроса остаётся настоящим. Или `mockNuxtImport(\'useFetch\', ...)` подменяет сам composable целиком. Первый вариант ближе к реальности, второй проще, когда нужен полный контроль над возвращаемым состоянием.' },
      { q: 'Как в Nuxt-проекте делят unit и Nuxt-тесты?', a: 'Окружение nuxt тяжелее обычного, поэтому чистую логику тестируют в Node или jsdom, а окружение nuxt включают только там, где нужен рантайм. Делается это комментарием `// @vitest-environment nuxt` в файле, соглашением об именах вроде `*.nuxt.spec.ts` или отдельными проектами в конфигурации Vitest. Точный способ настройки стоит проверить в документации используемой версии `@nuxt/test-utils`.' }
    ]
  },

  // ───────────────────────────── E2E ─────────────────────────────
  {
    id: 'test-playwright',
    section: 'test',
    group: 'E2E',
    title: 'Playwright и E2E',
    level: 'middle',
    summary: 'Playwright гоняет сценарии в настоящих Chromium, Firefox и WebKit с автоожиданием и повторяющимися проверками. Только E2E проверяет сборку, роутинг, SSR и гидратацию вместе.',
    points: [
      { title: 'Локаторы — пользовательские: роль, текст, подпись, `data-testid`', text: 'Локатор не хранит элемент, а описывает, как его найти, и ищет заново при каждом действии — переживает перерисовку. CSS-классы и структура DOM ломаются при любом редизайне.', code: `page.getByRole('button', { name: 'В корзину' })
page.getByLabel('Email')
page.getByTestId('cart-count')
page.locator('.btn > span:nth-child(2)') // хрупко`, lang: 'ts' },
      { title: 'Автоожидание: действие ждёт, пока элемент готов', text: 'Перед `click`/`fill` Playwright проверяет, что элемент есть, видим, не двигается, доступен и не перекрыт. Ручные паузы не нужны.', code: `await page.waitForTimeout(2000) // медленно и всё равно flaky
await page.getByRole('button', { name: 'Оформить' }).click() // ок: ждёт сам`, lang: 'ts' },
      { title: 'Проверки — через `await expect(locator)`, они повторяются', text: 'Web-first assertions ретраят до таймаута (по умолчанию 5 с). Значение, прочитанное заранее, проверяется один раз.', code: `expect(await page.getByTestId('cart-count').textContent()).toBe('1') // без ретраев
await expect(page.getByTestId('cart-count')).toHaveText('1')        // ок`, lang: 'ts' },
      { title: '`page.route` мокает API — но только браузерные запросы', text: '`fulfill` — свой ответ, `continue` — пропустить, `abort` — оборвать. Запросы, которые Nuxt делает на сервере при SSR, так не перехватить.', code: `await page.route('**/api/products*', (route) =>
  route.fulfill({ json: [{ id: 1, name: 'Сыр', price: 300 }] }),
)
await page.route('**/api/order', (r) => r.fulfill({ status: 500 }))`, lang: 'ts' },
      { title: 'Трейс при повторе — разбирать падения в CI', text: 'Trace viewer показывает шаги, снимки DOM, сеть и консоль.', code: `// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
})
// npx playwright show-trace trace.zip`, lang: 'ts' },
      { title: 'Ловушка: тесты, зависящие друг от друга и от общих данных стенда', text: 'Падают при параллельном запуске и в случайном порядке. Каждый тест готовит свои данные или мокает сеть.' },
      { title: 'Playwright vs Cypress', text: 'Cypress выполняет тест внутри браузера рядом с приложением, на своей цепочке команд. Playwright управляет браузером снаружи из Node, на обычном `async/await`, с несколькими браузерами, вкладками и контекстами.' }
    ],
    takeaway: 'E2E — на несколько сценариев, от которых зависят деньги и доступ: вход, корзина, оплата. Граничные случаи — в компонентных тестах.',
    questions: [
      { q: 'Что такое автоожидание в Playwright?', a: 'Перед каждым действием Playwright сам проверяет, что элемент готов: присутствует, видим, не двигается, доступен и не перекрыт другим элементом. Пока условие не выполнено, действие ждёт до таймаута. Похожим образом работают web-first assertions: `await expect(locator).toHaveText()` повторяет проверку, пока она не пройдёт. Благодаря этому не нужны ручные паузы, а тесты меньше зависят от скорости машины.' },
      { q: 'Почему E2E-тестов должно быть мало?', a: 'Каждый E2E-тест поднимает браузер, проходит сценарий через всё приложение и зависит от окружения, данных и сети. Поэтому он медленный, иногда нестабильный, и по упавшему тесту не всегда сразу понятно, где ошибка. Выгодно покрыть E2E несколько ключевых сценариев — вход, оплату, оформление заказа, — а варианты и граничные случаи проверять компонентными и unit-тестами.' },
      { q: 'Как в Playwright замокать API?', a: 'Через `page.route(pattern, handler)`: запросы, подходящие под шаблон, перехватываются, и обработчик отвечает через `route.fulfill` с нужным JSON или статусом, пропускает запрос дальше через `route.continue` или обрывает через `route.abort`. Так можно проверить ошибку сервера или пустой список. Важно понимать, что `page.route` видит только запросы из браузера: запросы, которые Nuxt делает на сервере при SSR, так не перехватить.' },
      { q: 'Чем Playwright отличается от Cypress?', a: 'Cypress выполняет тест внутри браузера вместе с приложением и строит тесты на своей цепочке команд. Playwright управляет браузером снаружи, тесты пишутся на обычном `async/await`, из коробки поддерживаются Chromium, Firefox и WebKit, несколько вкладок и параллельный запуск. На практике выбор часто определяется тем, что уже есть в команде.' }
    ]
  }
);
