window.SOBES = window.SOBES || { topics: [] };
window.SOBES.topics.push(
  {
    id: 'js-modules', section: 'js', group: 'Модули, ошибки, итераторы', title: 'ES Modules', level: 'middle',
    summary: 'Стандартные модули JS: статические `import`/`export`, живые привязки, асинхронная загрузка. Весь код Vue/Nuxt-проекта — ESM.',
    points: [
      { title: '`import`/`export` статические — поэтому работает tree shaking', text: 'Объявления разбираются до выполнения кода, граф зависимостей известен заранее, и сборщик выкидывает неиспользуемые экспорты. `import` пишут только на верхнем уровне модуля. Модуль выполняется один раз и всегда в strict mode.', code: `export const a = 1          // именованный: имя фиксировано
export default { name: 'x' } // default: один на модуль, имя при импорте любое

import meta, { a } from './m.js'
if (flag) { import { b } from './b.js' } // SyntaxError: только верхний уровень` },
      { title: 'Импорт — живая привязка, а не копия', text: 'Импортированное имя ссылается на ту же переменную модуля: изменение `export let` видно снаружи. Переприсвоить импорт нельзя.', code: `// counter.js
export let count = 0
export function inc() { count++ }

// main.js
import { count, inc } from './counter.js'
inc(); console.log(count) // 1 — привязка живая
count = 5                 // TypeError` },
      { title: 'ESM vs CommonJS: статика и живые привязки против `require` в рантайме', text: '`require()` — обычный синхронный вызов, путь может быть вычисляемым, возвращает `module.exports` на момент вызова; после деструктуризации у вас копия. Tree shaking с CommonJS работает намного хуже. В ESM нет `__dirname` — есть `import.meta.url`.', code: `const { count } = require('./counter') // копия значения
import { count } from './counter.js'    // живая привязка
const dir = new URL('.', import.meta.url) // вместо __dirname` },
      { title: '`import()` — загрузка по требованию в отдельный чанк', text: 'Выражение, а не объявление: вызывается где угодно и по условию, возвращает промис с объектом модуля. На нём построены ленивые роуты и `defineAsyncComponent`.', code: `const routes = [
  { path: '/report', component: () => import('./pages/Report.vue') },
]
async function exportXlsx(rows) {
  const { utils, writeFile } = await import('xlsx') // тяжёлая либа только по клику
}` },
      { title: 'Ловушка: `export default { a, b, c }` не трясётся', text: 'Сборщик видит один объект и обычно не выкидывает неиспользуемые поля. Мешают и побочные эффекты на верхнем уровне: они выполняются при импорте, а пакет с `sideEffects: false` могут выкинуть вместе с ними.', code: `export default { formatDate, formatPrice } // тянется целиком
export { formatDate, formatPrice }         // ок: лишнее выкинется` },
      { title: 'Ловушка: циклические импорты и top-level `await`', text: 'При цикле модуль может получить ещё не инициализированную привязку и упасть с ReferenceError (TDZ) — общую часть выносят в третий модуль. Top-level `await` блокирует все модули, которые его импортируют: долгий запрос задержит старт приложения.', code: `// config.js
const config = await fetch('/config.json').then(r => r.json())
export default config // импортёры ждут этот fetch` }
    ],
    takeaway: 'Именованные экспорты по умолчанию, `import()` — для тяжёлого и редкого, побочных эффектов на верхнем уровне модуля избегать.',
    questions: [
      { q: 'Чем ES Modules отличаются от CommonJS?', a: 'ESM — стандарт языка, CommonJS — исторический формат Node.js. `import`/`export` статические: граф зависимостей известен до выполнения, поэтому работает tree shaking; `require()` — обычный вызов в рантайме, путь может быть вычисляемым. ESM грузится асинхронно и даёт живые привязки, CommonJS синхронный и отдаёт значение `module.exports` на момент вызова. Ещё в ESM есть top-level `await` и нет `__dirname` — вместо него `import.meta.url`.' },
      { q: 'Что такое tree shaking и что ему мешает?', a: 'Это удаление сборщиком экспортов, которые никто не импортирует. Работает благодаря статической структуре ESM: видно, что именно импортируется. Мешают CommonJS-модули, экспорт одним большим объектом, побочные эффекты на верхнем уровне модуля. Поэтому библиотеки отдают ESM-сборку и ставят `sideEffects: false` в `package.json`.' },
      { q: 'Что значит «живая привязка» у импорта?', a: 'Импортированное имя ссылается на ту же переменную, что и в модуле-источнике, а не на копию. Если модуль изменит свой `export let`, импортёр увидит новое значение. При этом снаружи переприсвоить импорт нельзя — будет TypeError. В CommonJS после деструктуризации `require()` у вас копия, и изменения в модуле не видны.' },
      { q: 'Зачем нужен динамический import()?', a: 'Чтобы загрузить модуль по требованию: он возвращает промис с объектом модуля. Сборщик выносит такой модуль в отдельный чанк, и он не попадает в первоначальный бандл. Во Vue так делаются ленивые роуты и `defineAsyncComponent`. Ещё его используют, когда путь известен только в рантайме или модуль нужен по условию.' }
    ]
  },
  {
    id: 'js-errors', section: 'js', group: 'Модули, ошибки, итераторы', title: 'Обработка ошибок', level: 'middle',
    summary: 'Синхронный код и `await` — `try/catch`, цепочки промисов — `.catch()`, необработанное — глобальные хендлеры. Ловить там, где можешь что-то сделать.',
    points: [
      { title: '`try/catch` ловит промис, только если его ждут через `await`', text: '`try/catch` работает синхронно. Вызов без `await` сразу вернёт промис, а отклонится он позже, вне блока. Ошибку в колбэке `setTimeout` тоже не поймать — это другая задача.', code: `try { save() } catch (e) {}       // мимо: промис без await
try { await save() } catch (e) {} // ок
save().catch(handle)              // ок для цепочек
try { setTimeout(() => { throw e }) } catch {} // мимо` },
      { title: 'Необработанный отклонённый промис — `unhandledrejection`', text: 'В браузере это событие на `window`, последний рубеж для логирования. В Node.js (с 15-й версии) необработанное отклонение по умолчанию роняет процесс.', code: `window.addEventListener('unhandledrejection', (e) => {
  report(e.reason)
})` },
      { title: 'Свои ошибки — наследники `Error`, причина — в `cause`', text: 'Свой класс даёт `instanceof` и поля вроде HTTP-статуса. `super(message, options)` сохраняет стек и `cause` (ES2022) — в логе видна вся цепочка, а не только верхнее сообщение.', code: `class ApiError extends Error {
  constructor(status, message, options) {
    super(message, options); this.name = 'ApiError'; this.status = status
  }
}
throw new Error('Сетевая ошибка', { cause: e }) // исходная причина не теряется` },
      { title: 'Vue: `onErrorCaptured` — граница, `app.config.errorHandler` — глобально', text: '`onErrorCaptured` ловит ошибки потомков компонента; вернув `false`, останавливает всплытие — так делают запасной UI вместо упавшего блока. `errorHandler` — последний обработчик, туда подключают Sentry. Ошибки вне жизненного цикла и обработчиков Vue (например, в `setTimeout`) оба не видят.', code: `app.config.errorHandler = (err, instance, info) => {
  reportToSentry(err, { info }) // info — где случилась ошибка
}
onErrorCaptured((err) => {
  hasError.value = true
  return false // не пускать выше
})`, lang: 'ts' },
      { title: 'Nuxt: `createError` несёт HTTP-статус и показывает `error.vue`', text: 'Брошенная на сервере, она отдаёт нужный статус и рендерит `error.vue`; на клиенте полноэкранная страница ошибки будет только с `fatal: true` или через `showError`. `error.vue` лежит в корне `srcDir`: в Nuxt 3 — в корне проекта, в Nuxt 4 — `app/error.vue`. Локально — `<NuxtErrorBoundary>`.', code: `const { data } = await useFetch(\`/api/product/\${id}\`)
if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Товар не найден', fatal: true })
}
clearError({ redirect: '/' }) // выход со страницы ошибки`, lang: 'ts' },
      { title: 'Ловушки: пустой `catch`, `throw` строки, `return` в `finally`', text: 'Пустой `catch` прячет баг — минимум залогировать или пробросить. Строка вместо `Error` — нет стека и `instanceof`. `finally` выполняется всегда, а `return` в нём перекрывает и результат `try`, и брошенную ошибку.', code: `try { throw new Error('x') }
finally { return 1 }  // ошибка молча исчезла
throw 'oops'          // нет стека
catch {}              // баг стал невидимым` }
    ],
    takeaway: 'Ловить там, где можешь показать сообщение, повторить или подставить запасное значение; иначе пробрасывать до глобального обработчика.',
    questions: [
      { q: 'Поймает ли try/catch ошибку в промисе?', a: 'Только если промис ждут через `await` внутри этого `try`. `try/catch` работает синхронно: вызов асинхронной функции без `await` сразу вернёт промис, а его отклонение случится позже, вне блока. Так же не ловится ошибка в колбэке `setTimeout` — он выполнится в другой задаче. Для цепочек без `await` нужен `.catch()`, а последний рубеж — событие `unhandledrejection`.' },
      { q: 'Как во Vue организовать обработку ошибок?', a: 'Есть два уровня. `app.config.errorHandler` — глобальный обработчик, туда обычно подключают отправку в Sentry. `onErrorCaptured` в компоненте ловит ошибки его потомков — так делают «границу ошибок», которая показывает запасной UI вместо упавшего блока; вернув `false`, ошибку дальше не пускают. Ошибки в асинхронном коде вне жизненного цикла и обработчиков Vue (например, в `setTimeout`) эти механизмы не увидят.' },
      { q: 'Зачем свой класс ошибки и что такое error.cause?', a: 'Свой класс, унаследованный от `Error`, позволяет отличать типы ошибок через `instanceof` и добавлять поля — HTTP-статус, код. Важно задать `name` и вызвать `super(message)`, чтобы был стек. `cause` (ES2022) — штатный способ сохранить исходную ошибку при оборачивании: `new Error(\'...\', { cause: e })`. Так в логе видна вся цепочка, а не только верхнее сообщение.' },
      { q: 'Как в Nuxt показать страницу 404?', a: 'Бросить `createError({ statusCode: 404, statusMessage: \'...\' })`. При SSR это вернёт ответ с нужным статусом и отрисует `error.vue` (в Nuxt 4 — `app/error.vue`); на клиенте полноэкранная страница ошибки показывается, если указан `fatal: true` или вызван `showError`. Компонент `error.vue` получает пропс `error`, а `clearError({ redirect })` сбрасывает ошибку и уводит на другую страницу. Для локальных ошибок внутри страницы есть компонент `<NuxtErrorBoundary>`.' }
    ]
  },
  {
    id: 'js-iterators', section: 'js', group: 'Модули, ошибки, итераторы', title: 'Итераторы и генераторы', level: 'middle+',
    summary: 'Итератор — объект с `next()`, который отдаёт `{ value, done }`. Генератор — функция, которая создаёт такой итератор через `yield` и выполняется по частям.',
    points: [
      { title: 'Iterable — объект с `[Symbol.iterator]()`, который возвращает итератор', text: 'На этом протоколе работают `for...of`, spread, деструктуризация массивов, `Array.from`, `Promise.all`. Итерируемы массивы, строки, `Map`, `Set`, `NodeList` — но не обычные объекты.', code: `const range = {
  from: 1, to: 3,
  *[Symbol.iterator]() { for (let i = this.from; i <= this.to; i++) yield i },
}
;[...range]                  // [1, 2, 3]
for (const x of {}) {}       // TypeError: object is not iterable
for (const [k, v] of Object.entries(obj)) {} // ок` },
      { title: '`for...of` — значения, `for...in` — ключи', text: '`for...in` перебирает строковые ключи перечисляемых свойств, включая унаследованные, — для массивов не подходит.', code: `for (const v of ['a', 'b']) {} // 'a', 'b'
for (const k in ['a', 'b']) {} // '0', '1' — строки` },
      { title: 'Генератор выполняется кусками между `yield` и помнит состояние', text: 'Вызов `function*` не выполняет тело, а возвращает итератор. Каждый `next()` доходит до следующего `yield`. Удобно для ленивых и бесконечных последовательностей и обхода деревьев.', code: `function* ids() {
  let id = 0
  while (true) yield ++id
}
const gen = ids()
gen.next() // { value: 1, done: false }
gen.next() // { value: 2, done: false }` },
      { title: 'Асинхронный генератор + `for await` — пагинация API', text: 'Генератор сам грузит следующую страницу, снаружи — обычный цикл по элементам. `break` завершает генератор, лишние страницы не грузятся. Так же можно читать `response.body` по кускам.', code: `async function* fetchAllOrders() {
  for (let page = 1; ; page++) {
    const { items, hasMore } = await fetch('/api/orders?page=' + page).then(r => r.json())
    yield* items
    if (!hasMore) return
  }
}
for await (const order of fetchAllOrders()) if (order.id === targetId) break` },
      { title: 'Ловушка: итератор одноразовый, бесконечный — не разворачивать', text: 'После `done: true` генератор исчерпан, второй `for...of` ничего не выдаст — вызывают заново. `[...gen]` у бесконечного генератора вешает вкладку.', code: `const g = ids()
;[...g]          // зависание
const it = range[Symbol.iterator]()
;[...it]; [...it] // второй раз — []` }
    ],
    takeaway: 'Генераторы — для ленивых, бесконечных и постраничных данных. Для обычного массива хватает `map`/`filter`.',
    questions: [
      { q: 'Что такое протокол итерации?', a: 'Это соглашение из двух частей. Iterable — объект с методом `[Symbol.iterator]()`, который возвращает итератор. Итератор — объект с методом `next()`, который отдаёт `{ value, done }`. На этом протоколе работают `for...of`, spread, деструктуризация массивов, `Array.from`. Поэтому любую свою структуру можно сделать перебираемой, реализовав `Symbol.iterator`.' },
      { q: 'Что такое генератор и зачем он нужен?', a: 'Это функция `function*`, которая при вызове не выполняет тело, а возвращает итератор. Каждый `next()` выполняет код до следующего `yield` и отдаёт его значение, состояние функции при этом сохраняется. Это удобно для ленивых и бесконечных последовательностей и для обхода сложных структур без ручного итератора. Через `next(value)` можно ещё и передавать значение внутрь, но в прикладном коде это встречается редко.' },
      { q: 'Где на практике нужны асинхронные генераторы?', a: 'Там, где данные приходят порциями асинхронно. Типичный пример — обход постраничного API: генератор сам грузит следующую страницу, а снаружи это обычный `for await...of` по элементам. Если цикл прервать через `break`, генератор завершится, и лишние страницы не загрузятся. Так же можно читать поток ответа `fetch` по кускам.' }
    ]
  },
  {
    id: 'js-abort', section: 'js', group: 'Асинхронность', title: 'Отмена запросов и гонки', level: 'middle+',
    summary: '`AbortController` отменяет `fetch` через `AbortSignal`. Так же решается гонка, когда старый ответ приходит позже нового и перезаписывает его.',
    points: [
      { title: 'Гонка: ответ на «ab» пришёл после ответа на «abc»', text: 'При быстром вводе запросы идут параллельно, а ответы приходят в любом порядке — на экране оказываются устаревшие результаты. Debounce уменьшает число запросов, но гонку не устраняет: его комбинируют с отменой.', code: `watch(query, async (q) => {
  results.value = await api.search(q) // медленный старый ответ затрёт свежий
})` },
      { title: '`abort()` обрывает `fetch` и отклоняет промис с `AbortError`', text: 'Сигнал `controller.signal` передают в `fetch`, `addEventListener`, axios (опция `signal`). Контроллер одноразовый: после `abort()` сигнал отменён навсегда, на каждый запрос — новый.', code: `const controller = new AbortController()
fetch(url, { signal: controller.signal })
controller.abort() // промис -> DOMException AbortError` },
      { title: 'Во Vue отмену вешают на cleanup вотчера', text: '`onCleanup` вызывается перед следующим запуском колбэка и при остановке вотчера (размонтировании). В Vue 3.5+ то же делает `onWatcherCleanup()` — вызывать синхронно, до первого `await`.', code: `watch(query, async (q) => {
  const controller = new AbortController()
  onWatcherCleanup(() => controller.abort())
  try {
    const res = await fetch('/api/search?q=' + encodeURIComponent(q), { signal: controller.signal })
    results.value = await res.json()
  } catch (e) { if (e.name !== 'AbortError') throw e } // отмена — не ошибка
})`, lang: 'ts' },
      { title: '`AbortSignal.timeout(ms)` и `AbortSignal.any([...])`', text: 'Таймаут без своего `setTimeout`: ошибка будет `TimeoutError`, а не `AbortError`. `any` объединяет сигналы — например, ручную отмену и таймаут.', code: `fetch('/api/report', { signal: AbortSignal.timeout(5000) })
const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(5000)])` },
      { title: 'Без `signal` — игнорировать устаревшие ответы по id запроса', text: 'Запрос не обрывается и трафик не экономится, но на экран попадает только последний ответ. Подходит, когда API не принимает сигнал.', code: `let lastId = 0
async function search(q) {
  const id = ++lastId
  const data = await api.search(q)
  if (id !== lastId) return // ответ на старый запрос
  results.value = data
}` },
      { title: 'Ловушка: отменённый `POST` мог уже выполниться', text: 'Отмена на клиенте не откатывает действие на сервере. И `AbortError` нельзя показывать как ошибку — иначе «Ошибка загрузки» на каждое нажатие клавиши.' }
    ],
    takeaway: 'Отмена нужна везде, где запрос устаревает до ответа: ввод, фильтры, навигация. Новый контроллер на каждый запрос, `AbortError` не ошибка.',
    questions: [
      { q: 'Что такое race condition при поиске и как её решить?', a: 'Пользователь быстро вводит текст, на каждое изменение уходит запрос, и ответы приходят в произвольном порядке. Если ответ на «ab» придёт позже ответа на «abc», на экране окажутся неактуальные результаты. Решения два: отменять предыдущий запрос через `AbortController`, или помечать каждый запрос номером и игнорировать ответы, которые не совпадают с последним. Обычно это сочетают с debounce, чтобы ещё и уменьшить число запросов.' },
      { q: 'Как работает AbortController?', a: 'Создаём контроллер, его `signal` передаём в `fetch` или другой API, который принимает сигнал. Вызов `abort()` переводит сигнал в состояние отменённого и вызывает событие `abort`: `fetch` обрывает запрос и отклоняет промис с `AbortError`. Контроллер одноразовый — на каждый новый запрос нужен новый. Для таймаутов есть готовый `AbortSignal.timeout(ms)`.' },
      { q: 'Как связать отмену запроса с watch во Vue?', a: 'Третий аргумент колбэка `watch` — `onCleanup`: зарегистрированная в нём функция вызовется перед следующим запуском колбэка и при остановке вотчера, например при размонтировании компонента. Туда кладут `controller.abort()`, и каждый новый запуск отменяет предыдущий запрос. В Vue 3.5+ то же самое делает `onWatcherCleanup()`, который вызывается внутри колбэка до первого `await`.' }
    ]
  },
  {
    id: 'web-workers', section: 'web', group: 'Браузер и Web API', title: 'Web Workers', level: 'middle+',
    summary: 'Скрипт в отдельном потоке браузера: общается с основным потоком сообщениями, DOM не видит. Нужен, чтобы тяжёлые вычисления не вешали интерфейс.',
    points: [
      { title: 'Воркер — настоящий параллельный поток, `async` — нет', text: 'Промисы и `async/await` всё равно выполняются в основном потоке, и долгая синхронная задача блокирует отрисовку. Воркер выносит её в отдельный поток со своим event loop и глобальным `self`. Есть `fetch`, таймеры, IndexedDB, WebSocket — нет `window` и DOM.', code: `// parser.worker.ts
self.onmessage = (e: MessageEvent<string>) => {
  const rows = e.data.split('\\n').map(l => l.split(';')) // тяжёлая работа
  self.postMessage(rows)
}`, lang: 'ts' },
      { title: 'Общение — `postMessage`, данные копируются (structured clone)', text: 'Глубокая копия с `Map`, `Set`, `Date`, циклическими ссылками, но без функций, DOM-узлов и прототипов классов. В Vite воркер подключают через `new URL(..., import.meta.url)`.', code: `const worker = new Worker(new URL('./parser.worker.ts', import.meta.url), { type: 'module' })
worker.onmessage = (e) => { rows.value = e.data }
worker.onerror = (e) => console.error(e.message)
worker.postMessage(fileText)
onBeforeUnmount(() => worker.terminate()) // иначе поток живёт и держит память`, lang: 'ts' },
      { title: 'Большие бинарные данные — transferable, без копирования', text: '`ArrayBuffer`, `ImageBitmap`, `OffscreenCanvas`, `MessagePort` передают вторым аргументом: владение переходит воркеру, у отправителя буфер пустеет.', code: `const buffer = new ArrayBuffer(50 * 1024 * 1024)
worker.postMessage(buffer, [buffer])
buffer.byteLength // 0 — теперь принадлежит воркеру` },
      { title: 'Ловушка: `reactive` в `postMessage` — DataCloneError', text: 'Proxy не клонируется, как и функции и DOM-узлы. Перед отправкой — `toRaw()` или обычная копия. Реактивного состояния и `document` в воркере нет: результат возвращают сообщением.', code: `worker.postMessage(state)               // DataCloneError
worker.postMessage(toRaw(state))        // ок, если внутри нет Proxy
worker.postMessage(structuredClone(toRaw(state)))` },
      { title: 'Web Worker vs Service Worker vs SharedWorker', text: 'Web Worker — вычисления, принадлежит странице и умирает с ней. Service Worker — сетевой прокси для origin: перехват `fetch`, кэш, офлайн, push, живёт без вкладок. SharedWorker — один на несколько вкладок origin, общение через `port`.' }
    ],
    takeaway: 'Воркер окупается, когда синхронная работа заметно дольше ~50 мс и повторяется. Для запросов и мелочи он не нужен — копирование дороже выигрыша.',
    questions: [
      { q: 'Что такое Web Worker и когда он нужен?', a: 'Это скрипт, который выполняется в отдельном потоке браузера, параллельно основному. Нужен, когда синхронная работа — парсинг, обработка изображений, сложные вычисления — блокирует основной поток и интерфейс начинает тормозить. Общение идёт через `postMessage`, данные копируются. Для обычных запросов и мелких задач воркер не нужен: накладные расходы на передачу данных не окупятся.' },
      { q: 'Почему у воркера нет доступа к DOM?', a: 'DOM не потокобезопасен: если бы два потока меняли его одновременно, пришлось бы вводить блокировки. Поэтому браузер даёт воркеру изолированное окружение без `window` и `document`, а общение идёт только сообщениями с копированием данных. Это избавляет от гонок за общую память. Исключение для общей памяти — `SharedArrayBuffer`, но он требует cross-origin isolation.' },
      { q: 'Чем Web Worker отличается от Service Worker?', a: 'Это разные инструменты. Web Worker нужен для вычислений, принадлежит странице и умирает вместе с ней. Service Worker работает как сетевой прокси для всего origin: перехватывает `fetch`, кэширует ответы, обеспечивает офлайн и push-уведомления, и живёт независимо от открытых вкладок. Общее у них одно: оба работают в отдельном потоке без доступа к DOM.' },
      { q: 'Что такое structured clone и transferable objects?', a: 'Structured clone — алгоритм, которым `postMessage` копирует данные: глубокая копия с поддержкой `Map`, `Set`, `Date`, циклических ссылок, но без функций, DOM-узлов и прототипов классов. Для больших бинарных данных копирование дорого, поэтому есть transferable objects: `ArrayBuffer`, `MessagePort`, `ImageBitmap` и другие. Их передают вторым аргументом `postMessage`, и владение переходит получателю без копирования, а у отправителя объект становится непригодным.' }
    ]
  }
);
