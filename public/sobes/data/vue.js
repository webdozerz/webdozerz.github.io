window.SOBES = window.SOBES || { topics: [] };
window.SOBES.topics.push(
  {
    id: 'vue-options-composition',
    section: 'vue',
    group: 'Основы',
    title: 'Options API vs Composition API',
    level: 'junior',
    summary: 'Два стиля одного компонента: объект с опциями и `this` или `<script setup>` с кодом, сгруппированным по фичам. Реактивность под ними одна и та же.',
    points: [
      { title: 'Options API раскладывает код по типам опций, Composition API — по фичам', text: 'В Options API логика одной фичи размазана по `data`, `computed`, `methods` и `watch`, всё доступно через `this`. В `<script setup>` код фичи пишут подряд, и его легко вынести в composable. TypeScript выводит типы из обычных переменных, без магии `this`.', code: `// Options API
export default {
  data: () => ({ count: 0 }),
  computed: { double() { return this.count * 2 } },
  methods: { inc() { this.count++ } }
}

// <script setup>
const count = ref(0)
const double = computed(() => count.value * 2)
const inc = () => count.value++` },
      { title: '`<script setup>` — сахар над `setup()`: всё верхнего уровня сразу видно в шаблоне', text: 'Компилятор разворачивает его в `setup()`, `return` не нужен, импортированные компоненты доступны без регистрации. `defineProps`, `defineEmits`, `defineModel` — макросы компилятора, их не импортируют.', code: `<script setup lang="ts">
import UserCard from './UserCard.vue' // в шаблоне сразу <UserCard />
const props = defineProps<{ id: number }>() // без импорта
const user = ref(null)                      // без return
</script>`, lang: 'vue' },
      { title: 'Компонент на `<script setup>` закрыт: наружу — только через `defineExpose`', text: 'Родитель через template ref ничего не видит, пока компонент сам не откроет нужное.', code: `// Child.vue
const input = useTemplateRef('input')
defineExpose({ focus: () => input.value?.focus() })

// Parent.vue
const child = useTemplateRef('child')
child.value?.focus() // доступно только то, что в defineExpose`, lang: 'ts' },
      { title: 'После `await` в `<script setup>` хуки и вотчеры ещё можно регистрировать', text: 'Компилятор восстанавливает контекст компонента после `await`. В обычной функции `setup()` после `await` текущего экземпляра уже нет, и хук не привяжется.', code: `<script setup>
const data = await api.load()
onMounted(() => {})   // ок: контекст восстановлен компилятором
</script>

// setup() { await api.load(); onMounted(...) } — не привяжется`, lang: 'vue' },
      { title: 'Миксины заменены composables', text: 'Composable вызывается явно, видно, откуда пришла каждая переменная, а конфликт имён решается переименованием при деструктуризации.', code: `// mixins: [paginationMixin] — откуда this.loading?
const { loading: listLoading, load } = usePagination(api.getOrders)` },
      { title: 'Ловушка: писать `<script setup>` «как Options API»', text: 'Все `ref` сверху, все функции снизу — и главный плюс, группировка по фичам, пропадает. Смешивать оба API в одном компоненте без причины тоже не стоит: непонятно, где что искать.' }
    ],
    takeaway: 'Новый код — `<script setup>`. Options API не удалён: в легаси его читать придётся, а переписывать рабочий код ради стиля не нужно.',
    questions: [
      { q: 'Чем Composition API лучше Options API и когда вы бы всё-таки взяли Options API?', a: 'Главное — код одной фичи лежит рядом, а не размазан по `data`, `methods` и `watch`. Такой фрагмент легко вынести в composable — функцию с явным входом и выходом. В Options API для этого были миксины с конфликтами имён и неявным происхождением полей. Плюс TypeScript в `setup` работает почти без усилий. Options API оставлю в легаси и в совсем простых компонентах — переписывать работающий код смысла нет.' },
      { q: 'Что такое <script setup> и чем он отличается от обычной функции setup()?', a: 'Это синтаксический сахар: компилятор разворачивает его в `setup()`. Всё объявленное на верхнем уровне, включая импорты компонентов, сразу доступно в шаблоне, `return` не нужен. Пропсы и события объявляются макросами `defineProps` и `defineEmits`, их не импортируют. Такой компонент по умолчанию закрыт: родитель через template ref ничего не видит, пока не открыть нужное через `defineExpose`. Ещё одно отличие — после `await` в `<script setup>` компилятор восстанавливает контекст компонента, поэтому хуки и вотчеры там можно регистрировать и после `await`.' }
    ]
  },
  {
    id: 'vue-ref-reactive',
    section: 'vue',
    group: 'Основы',
    title: 'ref vs reactive',
    level: 'junior',
    summary: '`ref` — коробка с `.value` для любого значения. `reactive` — Proxy над объектом, без `.value`.',
    points: [
      { title: '`ref` работает с чем угодно, `reactive` — только с объектами', text: 'Proxy умеет оборачивать только объекты, поэтому для примитива нужна обёртка: объект с геттером и сеттером `value`. Объект внутри `ref` Vue сам превращает в `reactive`. В шаблоне `.value` не пишут, он разворачивается автоматически.', code: `const count = ref(0)          // ок: число в коробке
const user = ref({ name: 'Аня' }) // объект внутри станет reactive
const state = reactive({ count: 0 }) // ок
reactive(0)                   // не работает: нужен объект` },
      { title: 'Деструктуризация `reactive` рвёт связь — нужен `toRefs`', text: 'Деструктуризация один раз читает значения. Примитив превращается в обычную строку или число, реактивности больше нет.', code: `const state = reactive({ email: '' })

const { email } = state           // просто строка, связи нет
const { email: e } = toRefs(state) // ref, пишет в state
e.value = 'a@b.ru'                 // state.email === 'a@b.ru'` },
      { title: '`reactive` нельзя заменить целиком, `ref` — можно', text: 'Новый `reactive` — это другой Proxy, а шаблон и вотчеры продолжают следить за старым.', code: `let state = reactive({ list: [] })
state = reactive({ list: data })  // шаблон показывает старый объект

const list = ref([])
list.value = data                 // ок, все подписчики увидят` },
      { title: 'За полем `reactive` следят через геттер', text: 'В `watch` и composable передают источник, а не значение: `state.count` — это уже просто число.', code: `watch(state.count, cb)        // не сработает: передали число
watch(() => state.count, cb)  // ок
useSomething(() => state.id)  // в composable тоже геттер или ref` },
      { title: 'Большие данные — `shallowRef`, сторонние объекты — `markRaw`', text: '`shallowRef` следит только за заменой `.value` и не оборачивает содержимое в Proxy: дешевле для тысяч строк из API. `markRaw` запрещает делать объект реактивным — для экземпляров графиков, карт, редакторов, которые Proxy ломает.', code: `const rows = shallowRef([])
rows.value = await api.getRows() // замена — Vue заметит
rows.value[0].name = 'x'         // правка внутри — не заметит
triggerRef(rows)                 // уведомить вручную

const chart = markRaw(new Chart(el))` },
      { title: 'Ловушка: `ref` в `if` без `.value` всегда истинен', text: '`ref` — это объект, а объект в условии всегда `true`.', code: `if (isOpen) {}        // всегда true
if (isOpen.value) {}  // ок` }
    ],
    takeaway: 'По умолчанию `ref`. `reactive` — для формы, которую не заменяют целиком.',
    questions: [
      { q: 'Чем ref отличается от reactive и что вы используете по умолчанию?', a: '`ref` — контейнер с `.value`, в него кладут любое значение, включая примитивы, и его можно заменить целиком. `reactive` оборачивает объект в Proxy: к полям обращаешься без `.value`, но саму переменную переприсвоить нельзя, а при деструктуризации теряется связь со свойствами. По умолчанию беру `ref` — меньше сюрпризов, и из composable его безопасно вернуть. `reactive` использую там, где удобно писать `form.email`, например для формы.' },
      { q: 'Что происходит при деструктуризации reactive и как это исправить?', a: 'Деструктуризация один раз читает свойства через Proxy и кладёт результат в обычные переменные, поэтому связь с исходными свойствами теряется. Если значение примитив, в переменной просто строка или число, реактивности нет. Если вложенный объект — Vue возвращает его реактивный Proxy, и изменения вида `user.name` отслеживаются, но замену `state.user` целиком переменная не увидит. Чтобы сохранить связь, использую `toRefs(state)` или `toRef(state, \'email\')` — получаются ref, которые читают и пишут в исходный объект. С пропсами с Vue 3.5 деструктуризация `defineProps` реактивна за счёт компилятора, но в `watch` и composables такие значения всё равно передаю геттером.' },
      { q: 'Когда нужен shallowRef?', a: '`shallowRef` отслеживает только замену `.value` и не оборачивает вложенные объекты в Proxy. Это полезно для больших данных, которые только заменяют целиком, например списка на тысячи строк из API. И для объектов сторонних библиотек — карты, редактора, — которым Proxy только мешает. Если всё-таки поменять что-то внутри, нужно вызвать `triggerRef` или присвоить новый объект.' }
    ]
  },
  {
    id: 'vue-computed-watch',
    section: 'vue',
    group: 'Основы',
    title: 'computed vs watch',
    level: 'junior',
    summary: '`computed` — производное значение с кешем. `watch` — побочный эффект в ответ на изменение источника.',
    points: [
      { title: 'Нужно значение — `computed`, нужно действие — `watch`', text: 'Отфильтрованный список и сумма корзины — `computed`. Перезапрос товаров при смене фильтров, запись в URL или `localStorage` — `watch`.', code: `const visible = computed(() =>
  items.value.filter(i => i.done)
)

watch(query, async (q) => {
  results.value = await search(q)
})`, lang: 'ts' },
      { title: '`computed` кеширует и пересчитывается лениво', text: 'Пересчёт — только когда изменились зависимости, и не сразу, а при следующем чтении. Метод в шаблоне, наоборот, выполняется на каждом рендере компонента.', code: `const total = computed(() => sum(cart.value))
// {{ total }} {{ total }} — один расчёт, дальше кеш
// {{ calcTotal() }} — заново при каждом рендере` },
      { title: 'Ловушка: побочные эффекты внутри `computed`', text: '`computed` вызывается лениво: может не вызваться вовсе или вызваться в неожиданный момент. Запросы и изменение состояния — только в `watch`.', code: `const user = computed(() => {
  fetchUser(id.value)  // нельзя: эффект в computed
  return users.value[id.value]
})` },
      { title: 'Ловушка: `watch`, который копирует одно значение в другое', text: 'Получается лишнее состояние, которое рано или поздно разойдётся с источником. Это должен быть `computed`.', code: `watch(firstName, (v) => {
  fullName.value = v + ' ' + lastName.value  // плохо
})
const fullName = computed(() =>
  firstName.value + ' ' + lastName.value)  // ок` },
      { title: 'Опции `watch`: `immediate`, `deep`, `flush`, `once`', text: '`immediate` вызывает колбэк сразу, старое значение тогда `undefined`. `deep` — реагировать на изменения внутри объекта; с Vue 3.5 можно число, глубину обхода. `flush: \'post\'` — после обновления DOM, `\'sync\'` — синхронно на каждое изменение, им не злоупотреблять. `once` (3.4+) — сработать один раз.', code: `watch(query, load, { immediate: true })
watch(filters, saveToUrl, { deep: true }) // 3.5+: deep: 1
watch(results, scrollToTop, { flush: 'post' })
watch(token, init, { once: true })`, lang: 'ts' },
      { title: 'Поле `reactive` передают в `watch` геттером', text: '`state.count` — это просто число, Vue предупредит. Сам reactive-объект отслеживается глубоко автоматически, а `deep: true` на большом объекте — обход всего дерева при каждом срабатывании.', code: `watch(state.count, cb)                 // не сработает
watch(() => state.count, cb)           // ок
watch([a, () => state.b], ([a, b]) => {}) // несколько источников` }
    ],
    takeaway: 'Значение — `computed`, действие — `watch`. `watch` только для копирования значения — почти всегда ошибка.',
    questions: [
      { q: 'Чем computed отличается от watch и от метода в шаблоне?', a: '`computed` — производное значение: Vue кеширует результат и пересчитывает его, только когда изменились зависимости, причём лениво, при следующем чтении. Метод в шаблоне выполняется при каждом рендере компонента, даже если его данные не менялись. `watch` нужен не для значений, а для побочных эффектов: запрос, запись в storage, вызов сторонней библиотеки. Правило: нужно значение — `computed`, нужно действие — `watch`.' },
      { q: 'Расскажите про опции watch: deep, immediate, flush, once.', a: '`immediate` вызывает колбэк сразу при создании, старое значение при этом `undefined`. `deep` заставляет реагировать на изменения внутри объекта; если передать в `watch` сам reactive-объект, он и так глубокий. С Vue 3.5 `deep` можно задать числом — глубиной обхода. `once` (Vue 3.4+) срабатывает один раз и останавливает вотчер. `flush` задаёт момент вызова: `pre` по умолчанию — до обновления DOM компонента, `post` — после, когда нужен новый DOM, `sync` — синхронно на каждое изменение, им лучше не злоупотреблять.' }
    ]
  },
  {
    id: 'vue-watcheffect',
    section: 'vue',
    group: 'Основы',
    title: 'watchEffect vs watch',
    level: 'middle',
    summary: '`watchEffect` запускается сразу и сам собирает зависимости по ходу выполнения. `watch` ленивый, следит за явным источником и даёт старое значение.',
    points: [
      { title: '`watchEffect` следит за всем, что прочитал, и стартует сразу', text: 'Зависимости не перечисляют: всё реактивное, прочитанное при выполнении, становится поводом для перезапуска. `watch` срабатывает только на изменение указанного источника и отдаёт `(new, old)`.', code: `watchEffect(() => {
  document.title = user.value.name + ' — ' + page.value
})

watch(userId, (id, oldId) => { /* только по userId */ })`, lang: 'ts' },
      { title: 'В async-эффекте отслеживается только то, что прочитано до первого `await`', text: 'Зависимости собираются в синхронной части. Значение, прочитанное после `await`, не перезапустит эффект.', code: `watchEffect(async () => {
  const res = await fetch('/api/users/' + userId.value) // отслеживается
  user.value = localize(await res.json(), lang.value)   // lang — нет
})

watchEffect(async () => {
  const id = userId.value, l = lang.value  // ок: всё до await
  user.value = await getUser(id, l)
})`, lang: 'ts' },
      { title: 'Гонку запросов закрывает очистка с `abort()`', text: 'Очистка вызывается перед следующим запуском и при остановке вотчера. Старый ответ, пришедший позже нового, его не перезапишет. Так же снимают подписки на сокеты и таймеры.', code: `watch(userId, async (id, oldId, onCleanup) => {
  const ctrl = new AbortController()
  onCleanup(() => ctrl.abort())
  const res = await fetch('/api/users/' + id, { signal: ctrl.signal })
  user.value = await res.json()
})`, lang: 'ts' },
      { title: '`onCleanup` работает и после `await`, `onWatcherCleanup` — только до него', text: '`onCleanup` приходит аргументом — первым в эффект `watchEffect`, третьим в колбэк `watch` — и привязан к своему вотчеру. `onWatcherCleanup` (Vue 3.5+) импортируют из `vue`, он находит текущий вотчер неявно, а после `await` его уже нет: очистка не зарегистрируется, в dev будет предупреждение.', code: `import { onWatcherCleanup } from 'vue'

watch(userId, async (id) => {
  const ctrl = new AbortController()
  onWatcherCleanup(() => ctrl.abort()) // ок: до первого await
  await fetch('/api/users/' + id, { signal: ctrl.signal })
})`, lang: 'ts' },
      { title: 'Вотчер, созданный асинхронно, сам не остановится', text: 'Созданный в `setTimeout` или `.then()` вотчер не привязан к компоненту и переживёт его размонтирование. Его останавливают функцией, которую он вернул.', code: `let stop
setTimeout(() => { stop = watchEffect(sync) })
onUnmounted(() => stop?.()) // иначе утечка` },
      { title: 'Ловушка: `watchEffect` ради одного поля', text: 'Любое случайно прочитанное значение тоже станет поводом для перезапуска. Для одного источника понятнее `watch`.' }
    ],
    takeaway: '`watchEffect` — когда зависимостей много, старое значение не нужно и эффект должен выполниться сразу. Иначе `watch` с явным источником.',
    questions: [
      { q: 'Чем watchEffect отличается от watch?', a: '`watchEffect` выполняет функцию сразу и подписывается на всё реактивное, что она прочитала во время выполнения. `watch` ленивый, следит за явно указанным источником и даёт новое и старое значение. Главная ловушка `watchEffect` — зависимости собираются только синхронно: в async-эффекте всё, что прочитано после первого `await`, не отслеживается. Поэтому в async-эффекте читаю всё нужное до первого `await` или беру `watch` с явным источником, особенно если нужен точный контроль или предыдущее значение.' },
      { q: 'Как отменить устаревший запрос в вотчере? Чем onCleanup отличается от onWatcherCleanup?', a: 'В каждом запуске создаю `AbortController` и регистрирую очистку с `abort()`: Vue вызовет её перед следующим запуском и при остановке вотчера, и старый ответ не перезапишет новый. Регистрировать очистку можно двумя способами. `onCleanup` приходит аргументом — первым в эффект `watchEffect` и третьим в колбэк `watch`; он привязан к конкретному вотчеру, поэтому работает и после `await`. `onWatcherCleanup` из Vue 3.5 импортируется из `vue` и находит текущий вотчер неявно, поэтому его надо вызвать синхронно, до первого `await`. Так же снимают подписки на сокеты и чистят таймеры.' }
    ]
  },
  {
    id: 'vue-lifecycle',
    section: 'vue',
    group: 'Основы',
    title: 'Хуки жизненного цикла',
    level: 'junior',
    summary: 'Функции, которые Vue вызывает на этапах жизни компонента: создание, монтирование, обновление, размонтирование.',
    points: [
      { title: 'Порядок: `setup` → `onBeforeMount` → `onMounted` → `onBeforeUpdate`/`onUpdated` → `onBeforeUnmount` → `onUnmounted`', text: '`beforeCreate` и `created` из Options API в Composition API заменяет сам `setup`. Кроме основных есть `onErrorCaptured` (ошибки потомков), `onActivated`/`onDeactivated` для `KeepAlive` и `onServerPrefetch` для SSR.' },
      { title: 'В `setup` нет DOM — элементы доступны с `onMounted`', text: 'В `setup` уже есть пропсы и состояние, но template refs равны `null`. Загрузку данных можно начинать прямо в `setup`, а графики, карты и редакторы создают в `onMounted`.', code: `const canvas = useTemplateRef('canvas') // 3.5+; раньше ref(null)
let chart

onMounted(() => { chart = new Chart(canvas.value, config) })
onBeforeUnmount(() => chart?.destroy())`, lang: 'ts' },
      { title: 'Что создал при монтировании — убери при размонтировании', text: 'Слушатели `scroll` и `resize`, таймеры, сторонние виджеты без очистки утекают с каждой навигацией.', code: `onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))` },
      { title: 'Родитель монтируется последним', text: 'В `onMounted` родителя все дети уже в DOM.', code: `// Parent setup -> Parent onBeforeMount
// Child setup  -> Child onBeforeMount -> Child onMounted
// Parent onMounted`, lang: 'text' },
      { title: 'При SSR на сервере выполняются только `setup` и `onServerPrefetch`', text: 'Монтирования на сервере нет, поэтому `onMounted` и остальные хуки вызываются только в браузере — `window`, `document`, `localStorage` трогают там. Таймер или подписка из `setup` на сервере утечёт: `onUnmounted`, чтобы их снять, не будет.', code: `const width = ref(window.innerWidth)     // на сервере упадёт
const width = ref(0)
onMounted(() => { width.value = window.innerWidth }) // ок
onServerPrefetch(async () => { data.value = await load() }) // сервер ждёт промис`, lang: 'ts' },
      { title: 'Хук регистрируют синхронно во время `setup`', text: 'В `setTimeout`, `.then()` или после `await` в обычной `setup()` текущего экземпляра уже нет: хук не привяжется, Vue предупредит. В `<script setup>` после `await` можно — компилятор восстанавливает контекст.', code: `setTimeout(() => onMounted(init)) // не привяжется
onMounted(init)                    // ок` },
      { title: 'Ловушка: менять состояние в `onUpdated`', text: 'Легко получить бесконечный цикл обновлений. На изменение данных реагируют через `watch`, `onUpdated` нужен редко.' }
    ],
    takeaway: 'Данные — в `setup`, DOM и браузерные API — с `onMounted`, очистка — в `onBeforeUnmount`.',
    questions: [
      { q: 'Какие хуки жизненного цикла есть в Vue 3 и что доступно в каждом?', a: 'Сначала выполняется `setup`: есть пропсы и состояние, но нет DOM. `onBeforeMount` — перед первым рендером в DOM, `onMounted` — после, тут уже можно работать с элементами. `onBeforeUpdate` и `onUpdated` вызываются вокруг повторного рендера при изменении данных. `onBeforeUnmount` и `onUnmounted` — место для очистки: снять слушатели, остановить таймеры, уничтожить сторонние виджеты. Ещё есть `onErrorCaptured`, хуки `KeepAlive` и `onServerPrefetch`.' },
      { q: 'Какие хуки вызываются на сервере при SSR и что из этого следует?', a: 'На сервере выполняется только `setup`, в Options API ещё `beforeCreate` и `created`, и `onServerPrefetch` — он может вернуть промис, и сервер его дождётся. Монтирования на сервере нет, поэтому `onMounted`, `onUpdated` и `onUnmounted` там не вызываются. Отсюда два правила. Всё, что трогает браузерные API, делаю в `onMounted`. И не запускаю в `setup` таймеры и подписки: на сервере не будет `onUnmounted`, чтобы их снять, и они утекут.' }
    ]
  },
  {
    id: 'vue-props-emits',
    section: 'vue',
    group: 'Основы',
    title: 'Props и emits',
    level: 'junior',
    summary: 'Props — данные от родителя к ребёнку, emits — события от ребёнка к родителю. Поток однонаправленный: ребёнок не меняет проп, а просит родителя.',
    points: [
      { title: 'Проп для ребёнка только для чтения — изменение просят событием', text: 'Родитель владеет данными и решает, менять ли их. Объявленные emits документируют события компонента и не попадают в `$attrs`; колбэк в пропсе работает, но во Vue так не принято.', code: `function inc() {
  emit('change', count + 1) // просим родителя
  // count++ — нельзя: это проп
}` },
      { title: 'Типизация — generic-аргументом макроса', text: 'В `<script setup lang="ts">` типы пишут прямо в `defineProps` и `defineEmits`, рантайм-объявление не нужно.', code: `const props = defineProps<{ title: string; count?: number }>()

const emit = defineEmits<{
  change: [value: number]
  close: []
}>()`, lang: 'ts' },
      { title: 'С Vue 3.5 деструктуризация `defineProps` реактивна, дефолты — синтаксисом JS', text: 'Компилятор заменяет обращения к переменной на `props.count`. `withDefaults` больше не нужен.', code: `const { title, count = 0 } = defineProps<{
  title: string
  count?: number
}>()
// раньше: withDefaults(defineProps<...>(), { count: 0 })`, lang: 'ts' },
      { title: 'Деструктурированный проп в `watch` и composable — только геттером', text: 'Иначе туда уйдёт число, а не реактивный источник. Для `watch` Vue 3.5 прямо выдаст ошибку компиляции.', code: `watch(count, cb)          // ошибка компиляции
watch(() => count, cb)    // ок
useCounter(() => count)   // в composable тоже геттер` },
      { title: 'Ловушка: мутация поля объекта из пропса тихо меняет данные родителя', text: 'На присваивание пропсу Vue в dev предупредит, а на `props.user.name = ...` — нет. Потом трудно найти, кто поменял данные. Для локального редактирования — копия или `computed` с `get`/`set`, который отправляет событие.', code: `props.user.name = 'x'   // тихо меняет объект родителя

const name = computed({
  get: () => props.user.name,
  set: (v) => emit('update', { ...props.user, name: v })
})` },
      { title: 'Ловушка: копия пропса в `ref` не обновляется вместе с ним', text: '`ref` один раз берёт начальное значение. Если нужна синхронизация — `computed` или `watch`.', code: `const local = ref(props.value)          // застынет
const shown = computed(() => props.value) // ок` },
      { title: 'Рантайм-объявление: дефолт объекта — фабрикой, `validator` — только в dev', text: 'Без фабрики все экземпляры получат один и тот же массив.', code: `defineProps({
  size: { type: String, default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v) },
  items: { type: Array, default: () => [] } // фабрика
})` }
    ],
    takeaway: 'Данные вниз пропсами, намерения вверх событиями. Если проп протаскивают через 3+ уровня — смотреть на provide/inject или стор.',
    questions: [
      { q: 'Что такое однонаправленный поток данных и почему нельзя менять props?', a: 'Родитель владеет данными и передаёт их вниз через props. Если ребёнок хочет что-то изменить, он отправляет событие, а родитель решает, менять ли. Прямое присваивание пропсу Vue в dev-режиме пресекает с предупреждением, да и при следующем рендере родителя значение перезапишется. А если проп — объект, мутация его полей тихо изменит данные родителя, и потом трудно найти, кто это сделал. Для локального редактирования делаю копию в `ref` или `computed` с `get`/`set`, который отправляет событие.' },
      { q: 'Что изменилось с деструктуризацией props в Vue 3.5?', a: 'Теперь можно писать `const { count = 0 } = defineProps<...>()`, и `count` останется реактивным: компилятор заменит обращения на `props.count`. Значения по умолчанию задаются синтаксисом деструктуризации, `withDefaults` больше не нужен. Но если передать `count` в `watch` или composable как есть, туда уйдёт число, а не реактивный источник. Поэтому туда передаю геттер `() => count`; для `watch` компилятор прямо подскажет ошибкой.' }
    ]
  },
  {
    id: 'vue-v-model',
    section: 'vue',
    group: 'Основы',
    title: 'v-model на компонентах',
    level: 'middle',
    summary: '`v-model` на компоненте — сокращение для пропа `modelValue` и события `update:modelValue`. С Vue 3.4 объявляется одной строкой через `defineModel`.',
    points: [
      { title: '`v-model` = проп `modelValue` + событие `update:modelValue`', text: 'С аргументом `v-model:title` — проп `title` и событие `update:title`, поэтому на одном компоненте может быть несколько `v-model`. Во Vue 2 были `value`/`input` и `.sync`, во Vue 3 всё это — `v-model` с аргументом.', code: `<MyInput v-model="name" />
<!-- то же самое: -->
<MyInput :modelValue="name" @update:modelValue="v => name = v" />`, lang: 'vue' },
      { title: '`defineModel` (3.4+) возвращает ref: чтение даёт проп, запись отправляет событие', text: 'Заменяет связку `defineProps` + `defineEmits` + `computed` с `get`/`set`, которую писали раньше.', code: `<!-- UserForm.vue -->
<script setup lang="ts">
const firstName = defineModel<string>('firstName', { required: true })
const lastName = defineModel<string>('lastName')
</script>

<!-- родитель -->
<UserForm v-model:first-name="user.first" v-model:last-name="user.last" />`, lang: 'vue' },
      { title: 'Модификаторы приходят пропом `modelModifiers` — свои реализуют в `set`', text: 'Для `v-model:title` проп называется `titleModifiers`. `.trim` и `.number` Vue применяет к аргументу `update:*` сам, а `.lazy` и собственные модификаторы надо делать в компоненте.', code: `const [model, modifiers] = defineModel<string, 'capitalize'>({
  set(v) {
    return modifiers.capitalize ? v[0].toUpperCase() + v.slice(1) : v
  }
})
// <MyInput v-model.capitalize="name" />`, lang: 'ts' },
      { title: 'Ловушка: правка вложенного поля обходит событие', text: '`model.value.name = ...` не отправит `update:modelValue`, а объект родителя изменится напрямую. Присваивают новый объект.', code: `model.value.name = 'x'                    // событие не уйдёт
model.value = { ...model.value, name: 'x' } // ок` },
      { title: 'Ловушка: без `v-model` у родителя `defineModel` — просто локальный ref', text: 'Компонент вроде бы работает, но родитель ничего не получает. И нельзя вешать `v-model` на проп внутри ребёнка — это попытка изменить проп.' }
    ],
    takeaway: 'Компонент редактирует значение родителя — `defineModel`. Только показывает — обычный проп.',
    questions: [
      { q: 'Как работает v-model на компоненте и что делает defineModel?', a: '`v-model` на компоненте — сокращение: родитель передаёт проп `modelValue` и слушает `update:modelValue`. С аргументом, например `v-model:title`, будет проп `title` и событие `update:title`, поэтому на одном компоненте может быть несколько `v-model`. `defineModel` из Vue 3.4 объявляет и проп, и событие и возвращает ref: чтение даёт проп, присваивание отправляет событие. Раньше то же самое писали руками через `defineProps`, `defineEmits` и `computed` с `get`/`set`.' },
      { q: 'Как поддержать модификатор v-model на своём компоненте?', a: 'Модификаторы приходят отдельным пропом: `modelModifiers` для обычного `v-model` или `titleModifiers` для `v-model:title`, это объект вида `{ capitalize: true }`. С `defineModel` проще: деструктурирую `[model, modifiers]` и в опции `set` преобразую значение перед отправкой. Для `.trim` и `.number` Vue сам обрабатывает аргумент события `update:*`, а `.lazy` и свои модификаторы реализую в компоненте сам.' }
    ]
  },
  {
    id: 'vue-slots',
    section: 'vue',
    group: 'Основы',
    title: 'Слоты',
    level: 'junior',
    summary: 'Слот — место в шаблоне компонента, куда родитель передаёт разметку. Scoped-слот вдобавок получает данные от ребёнка.',
    points: [
      { title: 'Props передают данные, слоты — разметку', text: 'Модалка не знает, что у неё внутри, таблица не знает, как рисовать ячейку. Вместо пропа под каждый вариант разметки — слот, иначе API компонента разрастается.', code: `<!-- Modal.vue -->
<div class="modal">
  <header><slot name="header" /></header>
  <slot />                       <!-- слот по умолчанию -->
  <footer v-if="$slots.footer"><slot name="footer" /></footer>
</div>`, lang: 'vue' },
      { title: 'Контент слота компилируется в области видимости родителя', text: 'Обычный слот видит только данные родителя. Данные ребёнка туда попадают только через scoped-слот.', code: `<DataList :items="users">
  {{ item.name }}  <!-- ошибка: item — данные ребёнка -->
</DataList>`, lang: 'vue' },
      { title: 'Scoped-слот: ребёнок отдаёт данные атрибутами `<slot>`, родитель берёт через `v-slot`', text: 'Компонент владеет данными и логикой (список, пагинация, таблица), а как рисовать элемент, решает потребитель. Аналог render props в React. Типизируют через `defineSlots`.', code: `<!-- DataList.vue -->
<li v-for="(item, i) in items" :key="item.id">
  <slot :item="item" :index="i" />
</li>
<slot v-if="!items.length" name="empty">Ничего нет</slot>

<!-- родитель -->
<DataList :items="users">
  <template #default="{ item }">{{ item.name }}</template>
  <template #empty>Пользователей пока нет</template>
</DataList>`, lang: 'vue' },
      { title: 'Передан ли слот — `$slots` в шаблоне, `useSlots()` в скрипте', text: 'Так не рендерят пустую обёртку, например футер модалки с отступами. Флаг-проп «есть футер» не нужен. Если нужно просто значение по умолчанию — запасной контент внутри `<slot>`.', code: `<footer v-if="$slots.footer"><slot name="footer" /></footer>
<slot name="empty">Ничего нет</slot> <!-- запасной контент -->`, lang: 'vue' },
      { title: 'Ловушка: `v-slot` на компоненте вместе с `<template #name>`', text: 'Когда слотов несколько, все, включая default, оформляют через `<template>`, иначе ошибка компиляции.' }
    ],
    takeaway: 'Разметка меняется от места к месту — слот. Компонент владеет данными, а вид решает потребитель — scoped-слот.',
    questions: [
      { q: 'Что такое scoped-слоты и когда они нужны?', a: 'Обычный слот рендерится с данными родителя и ничего не знает о данных ребёнка. В scoped-слоте ребёнок передаёт данные атрибутами на `<slot>`, а родитель принимает их через `#default="{ item }"`. Это нужно, когда компонент владеет данными и логикой — список с пагинацией, таблица, — а как рисовать каждый элемент, решает потребитель. В TypeScript слоты типизируют через `defineSlots`.' },
      { q: 'Как проверить, передан ли слот, и зачем это нужно?', a: 'В шаблоне есть `$slots`, в `<script setup>` — `useSlots()`. Это нужно, чтобы не рендерить обёртку без контента: например, не выводить пустой футер модалки с отступами — пишу `v-if="$slots.footer"`. Если нужно просто значение по умолчанию, достаточно положить запасной контент внутрь тега `<slot>`.' }
    ]
  },
  {
    id: 'vue-provide-inject',
    section: 'vue',
    group: 'Основы',
    title: 'provide / inject',
    level: 'middle',
    summary: 'Внедрение зависимостей: предок предоставляет значение по ключу, любой потомок получает его без пропсов. Убирает prop drilling.',
    points: [
      { title: '`inject` ищет ближайшего предка с таким ключом', text: 'Поэтому контекст привязан к поддереву: у двух форм на странице будут два разных контекста. `app.provide` делает значение доступным во всём приложении — так плагины отдают сервисы.', code: `// предок
provide('theme', theme)
// любой потомок, сколько угодно уровней ниже
const theme = inject('theme', 'light') // второй аргумент — дефолт` },
      { title: '`provide` не делает значение реактивным — передают сам ref', text: 'Если передать `.value`, потомки получат снимок, который не обновится.', code: `provide(Key, count.value) // снимок, не обновляется
provide(Key, count)       // ок: потомки видят изменения` },
      { title: 'Наружу — `readonly` и функции для изменений', text: 'Так все правки остаются у владельца, и не нужно искать, какой потомок поменял состояние.', code: `provide(FormKey, {
  disabled: readonly(disabled),         // читать можно, менять нельзя
  register: (name) => fields.add(name)  // менять — только через функцию
})` },
      { title: 'Ключ — `Symbol` с типом `InjectionKey<T>`', text: 'Строковые ключи в большом приложении могут совпасть и не дают типов. С `InjectionKey` `inject` вернёт `T | undefined`; `undefined` закрывают дефолтом или явной ошибкой.', code: `export const FormKey: InjectionKey<FormContext> = Symbol('Form')

const form = inject(FormKey) // FormContext | undefined
if (!form) throw new Error('AppField должен быть внутри AppForm')`, lang: 'ts' },
      { title: '`inject` работает только в `setup` или внутри `app.runWithContext()`', text: 'В обработчике события или `setTimeout` текущего экземпляра нет. Значение достают заранее, в `setup`.', code: `const api = inject(ApiKey)       // ок: в setup
function onClick() { inject(ApiKey) } // не сработает` },
      { title: 'provide/inject vs Pinia: поддерево против одного экземпляра на приложение', text: 'Для составных компонентов (`Tabs`/`Tab`, форма и поля) — provide/inject. Для бизнес-данных, нужных в разных ветках дерева, — стор: devtools, SSR, плагины. Минус inject — неявность: по шаблону не видно, откуда пришли данные.' }
    ],
    takeaway: 'Контекст внутри поддерева — provide/inject с `InjectionKey`, ref и `readonly`. Глобальные бизнес-данные — Pinia.',
    questions: [
      { q: 'Как сохранить реактивность при provide/inject и как его типизировать?', a: '`provide` не делает значение реактивным, поэтому передаю сам `ref` или reactive-объект, а не его текущее значение. Чтобы потомки не меняли состояние как попало, отдаю `readonly`-версию и отдельные функции для изменений — так все правки остаются у владельца. Для типов делаю ключ `Symbol` с типом `InjectionKey<T>`, тогда `inject` вернёт `T | undefined`. `undefined` обрабатываю значением по умолчанию во втором аргументе или явной ошибкой, если без провайдера компонент не имеет смысла.' },
      { q: 'Когда provide/inject, а когда Pinia?', a: 'provide/inject привязан к дереву компонентов: у двух форм на странице будут два разных контекста, и для составных компонентов вроде `Tabs` это то, что нужно. Стор Pinia один на приложение, с devtools, поддержкой SSR и плагинами — туда кладу бизнес-данные: пользователя, корзину. Если состояние нужно в разных ветках дерева — стор. Если только внутри одного поддерева — provide/inject.' }
    ]
  },
  {
    id: 'vue-dynamic-components',
    section: 'vue',
    group: 'Основы',
    title: 'Динамические компоненты',
    level: 'middle',
    summary: '`<component :is>` рендерит компонент, выбранный во время выполнения. Сам объект компонента держат в `shallowRef` или под `markRaw`.',
    points: [
      { title: '`:is` принимает объект компонента, имя зарегистрированного компонента или нативный тег', text: 'Выбор идёт по данным, вариантов сколько угодно: вкладки, шаги мастера, блоки из CMS. Если вариантов два-три и они фиксированы, `v-if`/`v-else` читается проще.', code: `<component :is="current" />          <!-- объект компонента -->
<component :is="'a'" href="/">Ссылка</component> <!-- тег -->`, lang: 'vue' },
      { title: 'Компонент держат в `shallowRef`, а не в `ref`', text: 'Объект компонента — неизменное описание. `ref` сделает его глубоко реактивным, и Vue выдаст предупреждение. `shallowRef` следит только за тем, какой компонент выбран.', code: `const tabs = { profile: TabProfile, orders: TabOrders }
const current = shallowRef(TabProfile) // ок
// ref(TabProfile) — предупреждение` },
      { title: 'Внутри reactive-структуры компонент оборачивают в `markRaw`', text: '`markRaw` запрещает Vue делать объект реактивным, даже если он лежит в reactive.', code: `const registry = {
  hero: markRaw(defineAsyncComponent(() => import('./Hero.vue')))
}
// <component :is="registry[b.type]" v-bind="b.props" />` },
      { title: 'При смене `:is` старый экземпляр размонтируется вместе с состоянием', text: 'Заполненная форма во вкладке пропадёт. Сохранить состояние — обернуть в `<KeepAlive>`.', code: `<KeepAlive>
  <component :is="current" />
</KeepAlive>`, lang: 'vue' },
      { title: 'Ловушка: строка с именем локального компонента в `<script setup>`', text: 'Строка работает только для глобально зарегистрированных компонентов. Импортированный в `<script setup>` компонент передают объектом.', code: `<component is="TabProfile" />   <!-- не найдёт локальный импорт -->
<component :is="TabProfile" />  <!-- ок -->`, lang: 'vue' }
    ],
    takeaway: 'Выбор компонента по данным — `<component :is>` + `shallowRef`/`markRaw`. Нужно сохранить состояние — `KeepAlive`.',
    questions: [
      { q: 'Как работает <component :is> и почему компоненты хранят в shallowRef или markRaw?', a: '`<component :is>` рендерит то, что передано: объект компонента, имя зарегистрированного компонента или нативный тег. При смене значения старый экземпляр размонтируется, новый создаётся, и состояние теряется, если нет `KeepAlive`. Объект компонента — неизменное описание, отслеживать его поля незачем, и Vue предупреждает, если сделать его реактивным. Поэтому текущий компонент держу в `shallowRef`, а если он лежит внутри reactive-структуры — оборачиваю в `markRaw`.' },
      { q: 'Как бы вы сделали полиморфный компонент кнопки, который рендерится как a, RouterLink или button?', a: 'Делаю один компонент с `<component :is>` и `computed`, который выбирает тег: есть `to` — `RouterLink`, есть `href` — `a`, иначе `button`. Остальные атрибуты как fallthrough-атрибуты падают на корневой элемент. Для `button` ставлю `type="button"`, чтобы кнопка внутри формы случайно её не отправила. В итоге в дизайн-системе одна кнопка со стилями, а HTML в каждом месте семантически правильный.' }
    ]
  },
  {
    id: 'vue-teleport',
    section: 'vue',
    group: 'Основы',
    title: 'Teleport',
    level: 'middle',
    summary: '`<Teleport>` рендерит часть шаблона в другой узел DOM, но для Vue она остаётся на своём месте в дереве компонентов.',
    points: [
      { title: 'Модалку выносят в `body`, чтобы её не обрезал `overflow` и не ломал `transform`', text: 'Внутри блока с `overflow: hidden` или `transform` модалка обрезается или съезжает, и `z-index` не спасает из-за контекста наложения. Для модалок, тостов, тултипов, выпадающих меню.', code: `<Teleport to="body">
  <div v-if="open" class="overlay" @click.self="open = false">
    <div class="modal" role="dialog" aria-modal="true"><slot /></div>
  </div>
</Teleport>`, lang: 'vue' },
      { title: 'Для Vue контент остаётся на месте: props, события и provide/inject работают', text: 'Меняется только положение в DOM. Поэтому нативные DOM-события всплывают уже по новому месту, а не через исходного родителя. Ручной `appendChild` Vue не контролирует, а Teleport обновляется и удаляется вместе с компонентом. Аналог `createPortal` в React.' },
      { title: '`disabled` выключает перенос', text: 'Контент рендерится там, где написан. Удобно для блока, который на десктопе в сайдбаре, а на мобильном — в потоке.', code: `<Teleport to="#sidebar" :disabled="isMobile">
  <FiltersPanel />
</Teleport>`, lang: 'vue' },
      { title: 'Цели ещё нет в DOM — предупреждение; если её рендерит Vue, поможет `defer` (3.5+)', text: 'С `defer` Teleport ищет цель после того, как смонтирована остальная часть приложения в этом цикле.', code: `<Teleport defer to="#late-container">...</Teleport>`, lang: 'vue' },
      { title: 'SSR: телепорты рендерятся отдельно', text: 'Цель `body` требует особой обработки при гидрации. В Nuxt телепорты в `body` уходят в контейнер `#teleports`.' },
      { title: 'Ловушка: стили определяются новым местом в DOM', text: 'Scoped-классы работают, но наследуемые стили и позиционирование берутся уже от нового родителя в DOM.' }
    ],
    takeaway: 'Всё, что визуально поверх страницы, — в `<Teleport to="body">`. Для обычного контента не нужен.',
    questions: [
      { q: 'Зачем нужен Teleport и что происходит с событиями и provide/inject у телепортированного контента?', a: 'Teleport физически переносит разметку в другое место DOM, обычно в `body`. Это нужно для модалок и выпадашек, которые иначе обрежет `overflow: hidden` или сломает родитель с `transform`. Для Vue контент остаётся на прежнем месте дерева: получает пропсы, эмитит события родителю и видит его `provide`. Меняется только положение в DOM, поэтому нативные DOM-события всплывают уже по новому месту, а не через исходного родителя.' },
      { q: 'Что делают disabled и defer у Teleport?', a: '`disabled` выключает перенос, и контент рендерится там, где написан. Удобно, например, для фильтров: на десктопе они в сайдбаре, на мобильном — прямо в потоке страницы. `defer` появился в Vue 3.5: Teleport ищет цель не сразу, а после того, как смонтирована остальная часть приложения в этом цикле. Это нужно, когда целевой контейнер рендерит сам Vue, но позже по дереву.' }
    ]
  },
  {
    id: 'vue-keepalive',
    section: 'vue',
    group: 'Основы',
    title: 'KeepAlive',
    level: 'middle',
    summary: '`<KeepAlive>` кеширует экземпляры динамических компонентов: при переключении они деактивируются, а не размонтируются.',
    points: [
      { title: 'Неактивный компонент убирается из DOM, экземпляр с состоянием живёт в памяти', text: 'Сохраняются заполненная форма, прокрутка внутри компонента, загруженные данные. Без `KeepAlive` `:is` и `RouterView` при каждом переключении создают компонент заново.', code: `<RouterView v-slot="{ Component }">
  <KeepAlive :include="['ProductList', 'OrderForm']" :max="5">
    <component :is="Component" />
  </KeepAlive>
</RouterView>`, lang: 'vue' },
      { title: '`include`/`exclude` фильтруют по имени, `max` ограничивает кеш (LRU)', text: 'При переполнении вытесняется давно не использованный экземпляр. Без `max` кеш карточек по id растёт бесконечно. В `<script setup>` имя выводится из имени файла (3.2.34+) или задаётся явно.', code: `defineOptions({ name: 'ProductList' }) // для include`, lang: 'ts' },
      { title: 'Вместо mount/unmount — `onActivated` и `onDeactivated`', text: '`onActivated` срабатывает и при первом монтировании, и при каждом возврате из кеша — тут обновляют устаревшие данные.', code: `onActivated(() => {
  refreshIfStale()
  window.addEventListener('scroll', onScroll)
})
onDeactivated(() => window.removeEventListener('scroll', onScroll))`, lang: 'ts' },
      { title: 'Ловушка: глобальные слушатели из `onMounted` работают и в кеше', text: 'Деактивированный компонент не размонтирован, `onUnmounted` не вызывается. Подписки на `window` снимают в `onDeactivated`.' },
      { title: 'KeepAlive vs `v-show`', text: '`v-show` держит элемент в DOM всегда, скрывая через `display: none`, и он продолжает обновляться. `KeepAlive` убирает DOM из документа и не перерисовывает компонент до активации. `v-show` — для частого переключения пары блоков, `KeepAlive` — для вкладок и страниц.', code: `<Panel v-show="tab === 'a'" />  <!-- в DOM всегда -->
<KeepAlive><component :is="tabs[tab]" /></KeepAlive>`, lang: 'vue' }
    ],
    takeaway: 'Кешировать точечно: вкладки с формами и связку «список — карточка», всегда с `max` и обновлением в `onActivated`.',
    questions: [
      { q: 'Как работает KeepAlive и какие хуки появляются у закешированного компонента?', a: '`KeepAlive` при переключении не размонтирует компонент, а убирает его DOM из документа и держит экземпляр в памяти. `include` и `exclude` фильтруют по имени компонента, `max` ограничивает кеш — при переполнении вытесняется давно не использованный. При переключениях вызываются `onActivated` и `onDeactivated` вместо монтирования и размонтирования, причём `onActivated` срабатывает и при первом монтировании. В них обновляю данные и снимаю глобальные слушатели.' },
      { q: 'Чем KeepAlive отличается от v-show?', a: '`v-show` рендерит элемент сразу и скрывает его через `display: none` — DOM остаётся в документе и продолжает обновляться. `KeepAlive` работает с динамическими компонентами и страницами: неактивный компонент убирается из DOM, но экземпляр и состояние живут в памяти, а реактивные обновления его не перерисовывают до активации. `v-show` хорош для частого переключения пары блоков, `KeepAlive` — для вкладок и страниц, где надо сохранить состояние и не рендерить всё заранее.' }
    ]
  },
  {
    id: 'vue-composables',
    section: 'vue',
    group: 'Архитектура',
    title: 'Composables',
    level: 'middle',
    summary: 'Composable — функция `useXxx`, которая прячет реактивное состояние и логику на Composition API и возвращает их для переиспользования.',
    points: [
      { title: 'Composable — обычная функция с `ref`, `computed`, `watch` и хуками внутри', text: 'Компонент становится тоньше: загрузка данных, форма, подписки уезжают в отдельные функции, которые можно переиспользовать и тестировать. Функцию без реактивности делать composable не нужно — это обычная утилита. Много готового есть в VueUse.', code: `export function useCounter(start = 0) {
  const count = ref(start)
  const inc = () => count.value++
  return { count, inc }
}`, lang: 'ts' },
      { title: 'Вызывать синхронно в `setup`, не по условию и не в колбэке', text: 'Хуки и вотчеры внутри привязываются к текущему компоненту. В `setTimeout`, обработчике или после `await` в обычной `setup()` экземпляра нет. В `<script setup>` после `await` можно: компилятор восстанавливает контекст.', code: `const { data } = useFetch(url)        // ок
function onClick() { useFetch(url) } // не привяжется к компоненту
if (isAdmin) usePermissions()         // плохо: вызов по условию` },
      { title: 'Аргументы — `MaybeRefOrGetter`, читать через `toValue()` внутри вотчера', text: 'Тогда composable заметит смену параметра. Если принять готовое значение, он навсегда запомнит первое. `toValue` есть с Vue 3.3.', code: `export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null)
  watchEffect(async (onCleanup) => {
    const ctrl = new AbortController()
    onCleanup(() => ctrl.abort())
    const u = toValue(url)  // до await — попадёт в зависимости
    data.value = await (await fetch(u, { signal: ctrl.signal })).json()
  })
  return { data }
}

const { data: user } = useFetch(() => '/api/users/' + id)`, lang: 'ts' },
      { title: 'Возвращать обычный объект из ref, а не `reactive`', text: 'Потребитель деструктурирует результат. У `reactive` примитивы при этом потеряют связь, а объект из ref можно разбирать и переименовывать.', code: `return { data, loading }           // ок
return reactive({ data, loading }) // деструктуризация сломает связь` },
      { title: 'Каждый вызов — своё состояние; общее — только если ref на уровне модуля', text: 'Модульный ref — мини-стор, в SPA это работает. Но при SSR модуль живёт на сервере между запросами, и данные одного пользователя утекут другому. Для глобального состояния — Pinia или `useState` в Nuxt.', code: `const user = ref(null)       // уровень модуля: общий на всех
export function useUser() {
  return { user }            // при SSR — утечка между запросами
}` },
      { title: 'Что composable подписал, он сам и снимает', text: 'Слушатели и таймеры убирают в `onUnmounted` внутри composable, тогда потребителю не надо об этом помнить.', code: `export function useEventListener(target, event, cb) {
  onMounted(() => target.addEventListener(event, cb))
  onUnmounted(() => target.removeEventListener(event, cb))
}` }
    ],
    takeaway: 'Синхронный вызов в `setup`, аргументы через `toValue`, на выходе объект из ref, очистка внутри. Глобальное состояние — не модульный ref, а Pinia.',
    questions: [
      { q: 'Что такое composable и как правильно его писать?', a: 'Это функция, которая инкапсулирует реактивное состояние и логику на Composition API и возвращает их. Вызываю её синхронно в `setup`, иначе хуки и вотчеры внутри не привяжутся к компоненту. Возвращаю обычный объект из ref, чтобы потребитель мог деструктурировать его без потери связи. Аргументы принимаю как `MaybeRefOrGetter` и читаю через `toValue` внутри `watch` или `watchEffect` — тогда composable реагирует на смену параметров. И всё, на что composable подписался, он сам снимает при размонтировании.' },
      { q: 'Как сделать composable с общим состоянием на всё приложение и чем это рискованно?', a: 'Если объявить ref не внутри функции, а на уровне модуля, все вызовы будут делить одно состояние — получается мини-стор. В клиентском SPA это работает. Но при SSR модуль живёт на сервере между запросами, и данные одного пользователя могут утечь другому. Поэтому для глобального состояния беру Pinia или `useState` в Nuxt — они создают состояние на каждый запрос. Модульный синглтон оставляю только для чисто клиентских вещей.' }
    ]
  },
  {
    id: 'vue-mixins',
    section: 'vue',
    group: 'Архитектура',
    title: 'Миксины',
    level: 'middle',
    summary: 'Переиспользование в Options API: опции миксина сливаются с опциями компонента. Во Vue 3 поддерживаются, но для нового кода их заменили composables.',
    points: [
      { title: 'Миксин — объект с опциями, который подмешивается через `mixins: [...]`', text: 'Встречается в легаси на Vue 2 и при миграции: `authMixin`, `formMixin`, `tableMixin`. В новом коде не нужен.', code: `export default {
  data: () => ({ page: 1, loading: false }),
  methods: {
    async load() {
      this.items = await this.fetchPage(this.page) // fetchPage — где-то в компоненте?
    }
  }
}` },
      { title: 'Слияние: данные и методы компонента перекрывают миксин, хуки вызываются все', text: 'При совпадении ключей в `data`, `methods`, `computed` побеждает компонент. Хуки и вотчеры не перекрываются: сначала хуки миксинов в порядке подключения, потом компонента. Во Vue 3 `data` сливается поверхностно, во Vue 2 сливался рекурсивно.', code: `// mixin: created() { log('mixin') }, data: { a: 1, b: 1 }
// компонент: created() { log('comp') }, data: { b: 2 }
// -> 'mixin', 'comp'; data = { a: 1, b: 2 }`, lang: 'text' },
      { title: 'Три проблемы миксинов: откуда поле, конфликт имён, неявные зависимости', text: 'При нескольких миксинах непонятно, откуда в `this` взялось свойство. Одно поле молча перекрывает другое. Миксин рассчитывает на поле компонента или другого миксина — переименование ломает всё без ошибок компиляции.', code: `mixins: [paginationMixin, filtersMixin]
// откуда this.loading? а если оба его объявили?` },
      { title: 'Composable решает все три: явный вызов, параметры, переименование', text: 'Зависимость передаётся аргументом, возвращаемые значения видны и нормально типизируются.', code: `const { loading: listLoading, load } = usePagination(api.getOrders)
const { loading: filtersLoading } = useFilters()`, lang: 'ts' },
      { title: 'Ловушка: глобальный миксин через `app.mixin`', text: 'Он влияет на все компоненты, включая компоненты сторонних библиотек.' }
    ],
    takeaway: 'Миксины надо уметь читать в легаси и знать правила слияния. Новый код и рефакторинг — composables.',
    questions: [
      { q: 'Почему от миксинов отказались в пользу composables?', a: 'У миксинов три главные проблемы. Неясное происхождение: при нескольких миксинах непонятно, откуда в `this` взялось свойство. Конфликты имён: одно поле молча перекрывает другое. Неявные зависимости: миксин рассчитывает на поля компонента или другого миксина. Composable вызывается явно, принимает параметры, возвращает именованные значения, которые можно переименовать при деструктуризации, и нормально типизируется.' },
      { q: 'Как сливаются опции миксина и компонента?', a: 'При совпадении ключей в `data` побеждает компонент; во Vue 3 слияние `data` поверхностное, во Vue 2 было рекурсивным. С `methods` и `computed` так же: одноимённый метод компонента перекрывает метод миксина. Хуки жизненного цикла не перекрываются, а вызываются все: сначала хуки миксинов в порядке подключения, потом компонента. Вотчеры на одно поле тоже срабатывают оба. Из-за этих правил поведение компонента с несколькими миксинами трудно предсказать.' }
    ]
  },
  {
    id: 'vue-pinia',
    section: 'vue',
    group: 'Архитектура',
    title: 'Pinia',
    level: 'middle',
    summary: 'Официальная библиотека глобального состояния для Vue: модульные сторы с выводом типов, devtools и поддержкой SSR.',
    points: [
      { title: 'В setup-сторе `ref` — state, `computed` — getter, функция — action', text: 'Каждый стор — отдельный модуль со своим id. Мутаций и вложенных модулей с namespace, как во Vuex, нет: состояние меняют напрямую или в actions, типы выводятся сами.', code: `export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const total = computed(() =>
    items.value.reduce((s, i) => s + i.price * i.qty, 0))
  async function add(id) { items.value.push(await api.addToCart(id)) }
  return { items, total, add }
})`, lang: 'ts' },
      { title: 'Из setup-стора надо вернуть всё состояние', text: 'Невозвращённый ref не попадёт в devtools и не передастся с сервера на клиент при SSR.', code: `const draft = ref('')
return { items, total, add } // draft забыт — нет в devtools и SSR` },
      { title: 'Деструктуризация стора — только через `storeToRefs`', text: 'Стор — reactive-объект, прямая деструктуризация даёт значения на момент вызова. `storeToRefs` делает ref только из state и getters; actions берут напрямую. `toRefs` хуже: обернёт всё подряд, включая служебные свойства.', code: `const cart = useCartStore()
const { total } = cart               // число, связи нет
const { items, total } = storeToRefs(cart) // ок
const { add } = cart                 // actions — напрямую`, lang: 'ts' },
      { title: 'Options-стор проще и умеет `$reset()`, setup-стор гибче', text: 'В setup-сторе можно использовать composables, `watch`, `inject`, но `$reset` придётся написать самому.', code: `defineStore('ui', {
  state: () => ({ theme: 'light' }),
  getters: { isDark: (s) => s.theme === 'dark' },
  actions: { toggle() { this.theme = this.isDark ? 'light' : 'dark' } }
})`, lang: 'ts' },
      { title: 'Стор вызывают после `app.use(pinia)`', text: 'На верхнем уровне модуля, до установки Pinia, будет ошибка об отсутствии активной Pinia. Внутри функций (guard, action) — можно.', code: `const cart = useCartStore()      // верх модуля — ошибка
router.beforeEach(() => {
  const auth = useAuthStore()    // ок: pinia уже установлена
})`, lang: 'ts' },
      { title: 'Плагин — функция, которую `pinia.use()` вызывает для каждого стора', text: 'Получает `{ store, app, pinia, options }`. Через `$subscribe` следит за состоянием, через `$onAction` — за вызовами actions: сохранение в `localStorage`, логирование, ошибки в мониторинг.', code: `pinia.use(({ store }) => {
  store.$subscribe((_, state) =>
    localStorage.setItem(store.$id, JSON.stringify(state)))
})`, lang: 'ts' }
    ],
    takeaway: 'Стор — для данных, нужных в разных частях приложения. Состояние формы одного компонента туда не кладут.',
    questions: [
      { q: 'Чем setup-стор отличается от options-стора в Pinia?', a: 'Options-стор — объект с `state`, `getters` и `actions`, привычный после Vuex, и у него из коробки есть `$reset()`. Setup-стор — функция, как `setup` компонента: `ref` становятся state, `computed` — getters, функции — actions. Он гибче: внутри можно использовать composables, `watch`, `inject`. Нюанс — нужно вернуть всё состояние, иначе оно не попадёт в devtools и не передастся при SSR, а `$reset` придётся написать самому.' },
      { q: 'Зачем нужен storeToRefs?', a: 'Стор в Pinia — reactive-объект, и при деструктуризации получаешь значения на текущий момент без связи со стором. `storeToRefs` превращает state и getters в ref, связанные со стором, и их можно спокойно деструктурировать. Actions — обычные функции, их берут из стора напрямую. Обычный `toRefs` здесь хуже: он обернул бы в ref всё подряд, включая служебные свойства и методы.' },
      { q: 'Что можно сделать плагином Pinia?', a: 'Плагин — функция, которую `pinia.use()` вызывает для каждого стора; она получает контекст с `store`, `app`, `pinia` и `options`. Через него можно добавить всем сторам общие свойства, подписаться на изменения состояния через `$subscribe` или на вызовы actions через `$onAction`. Типичные примеры — сохранение в `localStorage`, логирование действий, отправка ошибок в мониторинг. Для сохранения обычно берут готовый `pinia-plugin-persistedstate`.' }
    ]
  },
  {
    id: 'vue-state',
    section: 'vue',
    group: 'Архитектура',
    title: 'Управление состоянием',
    level: 'middle+',
    summary: 'Состояние бывает разных видов — локальное, поддерева, глобальное клиентское, серверное, URL. Держать на минимально нужном уровне и не дублировать.',
    points: [
      { title: 'Состояние живёт на самом низком уровне, где оно нужно', text: 'Начинают с `ref` в компоненте и поднимают выше, когда появился второй потребитель. Если всё складывать в глобальный стор, появляются устаревшие данные и связи между экранами, которые не должны знать друг о друге.', code: `// флаг модалки        -> ref в компоненте
// контекст формы       -> props / provide-inject
// пользователь, корзина -> Pinia
// заказы из API        -> слой запросов с кешем
// фильтры, страница    -> URL`, lang: 'text' },
      { title: 'Серверное состояние — копия чужих данных, ему нужны кеш и инвалидация', text: 'Клиентское меняется только по действиям приложения. Серверное устаревает само: нужны кеш по параметрам, дедупликация запросов, инвалидация после мутаций, перезапрос при возврате на вкладку. В Pinia это пишется вручную — берут TanStack Query или `useAsyncData`/`useFetch` в Nuxt.', code: `const { data } = useQuery({
  queryKey: ['orders', status],   // кеш по ключу, ref отслеживается
  queryFn: () => api.getOrders(status.value),
  staleTime: 30_000
})`, lang: 'ts' },
      { title: 'После мутации кеш инвалидируют, а не правят руками', text: 'Список помечается устаревшим и перезапрашивается.', code: `useMutation({
  mutationFn: api.cancelOrder,
  onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] })
})`, lang: 'ts' },
      { title: 'Фильтры и пагинацию — в URL', text: 'Переживают перезагрузку, ими можно поделиться ссылкой, работают кнопки «назад» и «вперёд». Удобно обернуть query-параметр в `computed` с `get`/`set`.', code: `export function useQueryParam(name, fallback = '') {
  const route = useRoute(), router = useRouter()
  return computed({
    get: () => route.query[name] ?? fallback,
    set: (v) => router.replace({ query: { ...route.query, [name]: v || undefined } })
  })
}`, lang: 'ts' },
      { title: 'Ловушка: одно состояние в двух местах', text: 'Копия в сторе и в компоненте рано или поздно разойдётся. То, что можно вычислить, не хранят — это `computed`.' }
    ],
    takeaway: 'Локальное — в компоненте, глобальное клиентское — Pinia, серверное — слой запросов с кешем, фильтры — в URL.',
    questions: [
      { q: 'Как вы решаете, где хранить состояние во Vue-приложении?', a: 'Держу состояние на самом низком уровне, где оно нужно. Нужно одному компоненту — `ref` внутри. Нескольким в одном поддереве — props или provide/inject. Глобальное клиентское, вроде пользователя или корзины, — Pinia. Данные с сервера отдельно: им нужны кеш и инвалидация, поэтому TanStack Query или `useAsyncData` в Nuxt. Фильтры и номер страницы кладу в URL, чтобы можно было поделиться ссылкой.' },
      { q: 'Чем серверное состояние отличается от клиентского и почему его не стоит просто класть в Pinia?', a: 'Клиентское состояние принадлежит приложению: оно меняется, только когда мы его меняем. Серверное — снимок данных, которые на сервере могут поменяться в любой момент. У него свои задачи: кеш по параметрам, дедупликация одинаковых запросов, инвалидация после мутаций, перезапрос при возврате на вкладку. В Pinia всё это пишется вручную и обычно получается хуже. Поэтому серверные данные отдаю библиотеке запросов, а в сторе оставляю чисто клиентское.' }
    ]
  },
  {
    id: 'vue-separation',
    section: 'vue',
    group: 'Архитектура',
    title: 'Разделение ответственности',
    level: 'middle+',
    summary: 'Компоненты отображают, composables связывают реактивность, чистые функции считают, API-слой ходит в сеть. У каждой части одна причина меняться.',
    points: [
      { title: 'API-слой переводит ответ сервера в модели приложения', text: 'Если отдавать DTO прямо в шаблоны, любое изменение бэкенда ломает интерфейс в десятке мест.', code: `export const ordersApi = {
  async list(params) {
    const dto = await http.get('/orders', { params })
    return dto.map(toOrder) // наш формат, а не сырой ответ
  }
}`, lang: 'ts' },
      { title: 'Бизнес-правила — чистые функции без Vue', text: 'Их тестируют без монтирования и моков сети. «Сервис», который сам лезет в стор и роутер, снова привязывает логику к фреймворку.', code: `export const canCancel = (o) =>
  o.status === 'new' && Date.now() - o.createdAt < 3_600_000`, lang: 'ts' },
      { title: 'Composable — реактивная связка между API и UI', code: `export function useOrders(filter) {
  const orders = ref([])
  watch(filter, async (f) => { orders.value = await ordersApi.list(f) },
    { immediate: true, deep: true })
  return { orders }
}`, lang: 'ts' },
      { title: 'Контейнер знает про данные, презентационный компонент — только props и события', text: 'Кнопку или таблицу, которая сама зовёт API, не переиспользуешь и не протестируешь. Но дробить так каждый маленький компонент не надо — в небольших экранах это лишние файлы.', code: `<!-- OrdersPage.vue: контейнер -->
<script setup>
const filter = ref({ status: 'new' })
const { orders } = useOrders(filter)
</script>
<template>
  <OrderTable :orders="orders" @cancel="cancelOrder" />
</template>`, lang: 'vue' },
      { title: 'SOLID на компонентах', text: 'S — компонент либо рисует, либо управляет данными. O — расширяется слотами и пропсами без правки исходника. I — получает только нужные поля, а не весь объект. D — зависит от composable или интерфейса через provide, а не от конкретного HTTP-клиента, поэтому легко подменяется в тестах.' }
    ],
    takeaway: 'Зависимости идут от UI к данным: шаблон → composable → чистые правила и API-слой. Делить начинают, когда компонент делает больше одного дела.',
    questions: [
      { q: 'Как вы разделяете ответственность в Vue-приложении?', a: 'Раскладываю код по слоям. Внизу API-слой: запросы и преобразование ответа сервера в модели приложения, чтобы изменения бэкенда не протекали в шаблоны. Бизнес-правила — чистые функции, их легко тестировать. Реактивная связка — в composables. Страница соединяет composables и сторы и передаёт данные презентационным компонентам, которые знают только свои props и события. Так UI переиспользуется, а логика тестируется без монтирования.' },
      { q: 'Как принципы SOLID применяются к Vue-компонентам?', a: 'Single responsibility — компонент либо рисует, либо управляет данными, а не всё сразу. Open/closed — компонент расширяется слотами и пропсами, и новый вариант не требует правки исходника. Interface segregation — передаю компоненту только нужные поля, а не весь объект заказа. Dependency inversion — компонент зависит от composable или от интерфейса, переданного через provide, а не от конкретного HTTP-клиента, поэтому его легко подменить в тестах.' }
    ]
  },
  {
    id: 'vue-reusable',
    section: 'vue',
    group: 'Архитектура',
    title: 'Переиспользуемые компоненты',
    level: 'middle+',
    summary: 'У переиспользуемого компонента небольшой явный контракт: props, события, слоты, `v-model` и проброс атрибутов.',
    points: [
      { title: 'Необъявленные атрибуты падают на корневой элемент (fallthrough)', text: '`class`, `style`, `id`, `aria-*`, слушатели — всё, что не props и не emits, переносится на корень; `class` и `style` сливаются с собственными. Поэтому `placeholder` или `maxlength` не объявляют пропсами.', code: `<BaseButton class="wide" aria-label="Сохранить" @focus="onFocus" />
<!-- всё это окажется на корневом <button> -->`, lang: 'vue' },
      { title: 'Атрибуты нужны не на корне — `inheritAttrs: false` и `v-bind="$attrs"`', text: 'В обёртке над `input` корень — `label`, а атрибуты нужны на `input`. В `<script setup>` их можно получить через `useAttrs()`.', code: `<script setup lang="ts">
defineOptions({ inheritAttrs: false })
const model = defineModel<string>()
defineProps<{ label: string; error?: string }>()
</script>

<template>
  <label class="field">
    <span>{{ label }}</span>
    <input v-model="model" v-bind="$attrs" />
  </label>
</template>`, lang: 'vue' },
      { title: 'Несколько корней — атрибуты не переносятся автоматически', text: 'Без явного `v-bind="$attrs"` на одном из элементов Vue предупредит, что атрибуты некуда перенести.' },
      { title: 'Варианты — одним пропом с union-типом, разметка — слотами', text: 'Не `isPrimary`, `isDanger`, `isGhost`, а `variant`. Тексты и иконки не зашивают внутрь — иначе компонент придётся копировать.', code: `<!-- BaseButton.vue -->
<script setup lang="ts">
defineProps<{ variant?: 'primary' | 'danger' | 'ghost'; size?: 'sm' | 'md' }>()
</script>

<!-- использование -->
<BaseButton variant="primary" size="sm">
  <template #icon><IconSave /></template>
  Сохранить
</BaseButton>`, lang: 'vue' },
      { title: 'Не обобщать заранее', text: 'В общий компонент выносят, когда паттерн повторился 2–3 раза. Универсальный «комбайн» с десятками пропсов заранее не делают: простой случай должен укладываться в одну строку.' }
    ],
    takeaway: 'Props для данных и вариантов, слоты для разметки, `v-model` для редактируемого значения, нативные атрибуты — через `$attrs`.',
    questions: [
      { q: 'Что такое fallthrough-атрибуты и когда нужен inheritAttrs: false?', a: 'Всё, что передали компоненту, но он не объявил в props или emits — `class`, `style`, `id`, aria-атрибуты, слушатели, — Vue переносит на корневой элемент, причём `class` и `style` сливает с собственными. Это удобно, пока корень и есть главный элемент. В обёртке над `input` корень — `label`, а атрибуты нужны на `input`, поэтому ставлю `inheritAttrs: false` и пишу `v-bind="$attrs"` на `input`. При нескольких корневых элементах автоматического переноса нет вообще, и без явной привязки Vue выдаст предупреждение.' },
      { q: 'Как вы проектируете API переиспользуемого компонента?', a: 'Начинаю с того, как его будут использовать: простой случай должен укладываться в одну строку. Варианты делаю одним пропом вроде `variant` с union-типом, а не кучей булевых флагов. Всё, что про разметку, — слоты, а не пропсы с HTML. Если компонент редактирует значение — поддерживаю `v-model`. Нативные атрибуты пробрасываю через `$attrs`. И не обобщаю заранее: выношу, когда паттерн повторился несколько раз.' }
    ]
  },
  {
    id: 'vue-large-apps',
    section: 'vue',
    group: 'Архитектура',
    title: 'Архитектура больших приложений',
    level: 'senior',
    summary: 'Код группируют по фичам, зависимости направлены в одну сторону, у модулей есть публичный API, страницы грузятся лениво.',
    points: [
      { title: 'Группировать по фичам, а не по типам файлов', text: 'Папки `components`, `stores`, `utils` просты на старте, но в большом проекте непонятно, что от чего зависит, и правка одной фичи ломает другую. По фичам всё про заказы — компоненты, composables, API, типы — лежит рядом.', code: `src/features/orders/
  ui/ model/ api/ types.ts
  index.ts`, lang: 'text' },
      { title: 'FSD: слои импортируют только вниз, слайсы одного слоя друг о друге не знают', text: 'Слои `app`, `pages`, `widgets`, `features`, `entities`, `shared`. Перекрёстные импорты внутри слоя дают циклические зависимости. `shared` — без бизнес-логики, иначе он становится вторым монолитом.', code: `src/
  app/       # роутер, pinia, провайдеры
  pages/     # собирают виджеты
  widgets/   # Header, OrdersTable
  features/  # cancel-order, add-to-cart
  entities/  # order, user, product
  shared/    # ui-кит, api-клиент, утилиты`, lang: 'text' },
      { title: 'Модуль отдаёт наружу только `index.ts`, глубокие импорты запрещены линтером', text: 'Иначе граница модуля перестаёт существовать. Проверяют `eslint-plugin-boundaries` или `steiger` для FSD.', code: `import { CancelOrderButton } from '@/features/cancel-order'        // ок
import Btn from '@/features/cancel-order/ui/CancelOrderButton.vue' // нельзя`, lang: 'ts' },
      { title: 'Каждая страница — отдельный чанк', text: 'Ленивые маршруты грузят код раздела при переходе, так что модули ещё и не раздувают стартовый бандл.', code: `{ path: '/orders', component: () => import('@/pages/orders/OrdersPage.vue') },
{ path: '/admin', component: () => import('@/pages/admin/AdminLayout.vue'),
  meta: { requiresRole: 'admin' } }`, lang: 'ts' },
      { title: 'Микрофронтенды — следующий уровень изоляции, и он дорогой', text: 'Независимый деплой частей разными командами, но платой становятся сложность сборки, общие зависимости и интеграция.' },
      { title: 'Ловушка: полная FSD в маленьком проекте', text: 'Церемоний больше, чем пользы, и постоянные споры «это feature или entity». Строгость подбирают под размер проекта и команды.' }
    ],
    takeaway: 'Берут идею слоёв и публичного API, строгость — по размеру: пара десятков экранов или несколько команд — пора.',
    questions: [
      { q: 'Как бы вы организовали структуру большого Vue-приложения?', a: 'Группирую код по фичам, а не по типам: всё про заказы — компоненты, composables, API, типы — лежит в одном месте. Поверх этого слои с одним направлением зависимостей, например по FSD: `shared` ничего не знает о бизнесе, `entities` описывают сущности, `features` — действия пользователя, `pages` собирают всё вместе, импорт только вниз. Каждый модуль отдаёт наружу `index.ts`, глубокие импорты запрещены линтером. Страницы грузятся лениво, так что каждый раздел — отдельный чанк.' },
      { q: 'Что такое Feature-Sliced Design и какие у него минусы?', a: 'FSD — методология, где код делится на слои `app`, `pages`, `widgets`, `features`, `entities`, `shared`, а слои — на слайсы по доменам. Слой импортирует только из нижележащих, слайсы одного слоя друг о друге не знают, у каждого есть публичный API. Плюс — предсказуемые зависимости и изолированные фичи. Минусы — высокий порог входа, постоянные споры «это feature или entity» и много церемоний для небольших проектов. Я бы брал из FSD идею слоёв и публичного API, а строгость подбирал под размер команды.' }
    ]
  },
  {
    id: 'vue-vdom',
    section: 'vue',
    group: 'Производительность',
    title: 'Virtual DOM и компилятор',
    level: 'middle',
    summary: 'Vue строит дерево VNode, сравнивает его с предыдущим и применяет к DOM только разницу. Компилятор заранее помечает, что может меняться, и сокращает сравнение.',
    points: [
      { title: 'Шаблон → render-функция → дерево VNode → patch', text: 'VNode — лёгкие JS-объекты, описывающие разметку. При изменении данных компонент строит новое дерево, Vue сравнивает его со старым (patch, reconciliation) и трогает в реальном DOM только разницу.', code: `// упрощённо, что возвращает render
{ type: 'p', props: { class: 'title' }, children: 'Привет' }`, lang: 'js' },
      { title: 'Компилятор помечает статику и динамику: compiler-informed Virtual DOM', text: 'Статические узлы создаются один раз и переиспользуются, длинная статика может стать одной HTML-строкой. Динамическим узлам ставятся patch flags — что именно может меняться. Block tree собирает динамические узлы в плоский массив, и Vue обходит его, а не всё дерево.', code: `<h2>Заголовок</h2>          <!-- статика: не сравнивается -->
<p>{{ text }}</p>            <!-- flag: только текст -->
<span :class="cls">x</span>  <!-- flag: только class -->
<!-- скомпилированный код — play.vuejs.org, вкладка JS -->`, lang: 'vue' },
      { title: '`key` говорит, какой старый элемент соответствует новому', text: 'По стабильному id Vue переместит элементы вместе с их состоянием. С ключом-индексом при удалении из середины состояние (текст в инпуте, данные дочернего компонента) остаётся на позиции и оказывается у соседа.', code: `<TodoItem v-for="(t, i) in todos" :key="i" :todo="t" />  <!-- плохо -->
<TodoItem v-for="t in todos" :key="t.id" :todo="t" />   <!-- ок -->`, lang: 'vue' },
      { title: 'Ловушка: нестабильный `key`', text: '`Math.random()` или новый id на каждом рендере — элемент пересоздаётся каждый раз.', code: `<Row v-for="r in rows" :key="Math.random()" /> <!-- пересоздаётся всегда -->`, lang: 'vue' },
      { title: 'Virtual DOM не «быстрее DOM»', text: 'Это накладные расходы ради декларативности. Выигрыш — только по сравнению с перерисовкой всего подряд. Рукописные render-функции теряют оптимизации компилятора, поэтому без нужды их не пишут.' },
      { title: 'Vue vs React: Vue знает, какие компоненты обновить', text: 'В React без мемоизации перерендеривается всё поддерево и сравнивается целиком. Во Vue реактивность точно знает, какие компоненты зависят от изменения, а компилятор — что статично, поэтому `memo` обычно не нужен.' }
    ],
    takeaway: 'Стабильный `key` по id, шаблоны вместо ручных render-функций — и компилятор сделает основную работу сам.',
    questions: [
      { q: 'Как работает Virtual DOM во Vue и зачем нужен key?', a: 'Шаблон компилируется в render-функцию, которая возвращает дерево VNode — лёгкие объекты, описывающие разметку. При изменении данных компонент строит новое дерево, Vue сравнивает его со старым и меняет в реальном DOM только разницу. В списках `key` определяет, какой старый элемент соответствует новому: по стабильному id Vue переместит элементы вместе с их состоянием. С ключом-индексом при удалении из середины состояние, например текст в инпуте, останется на позиции и окажется у соседа.' },
      { q: 'Какие оптимизации делает компилятор шаблонов Vue 3?', a: 'Компилятор анализирует шаблон и понимает, что в нём не меняется. Статические узлы создаются один раз и не пересоздаются при обновлениях, а длинные последовательности статики могут превратиться в одну HTML-строку. Динамическим узлам ставятся patch flags — например, «меняется только текст» или «только class», — и при обновлении проверяется только это. Block tree собирает динамические узлы в плоский массив, и Vue обходит его, а не всё дерево. Поэтому шаблоны во Vue обычно эффективнее рукописных render-функций.' }
    ]
  },
  {
    id: 'vue-render-opt',
    section: 'vue',
    group: 'Производительность',
    title: 'Оптимизация рендеринга',
    level: 'middle+',
    summary: 'Сузить область перерендера и уменьшить объём DOM: разбиение на компоненты, стабильные пропсы, `v-once`, `v-memo`, `shallowRef`, виртуализация.',
    points: [
      { title: 'Сначала замер, потом правка', text: 'Компонент перерендеривается, когда меняются реактивные данные, прочитанные при его рендере, или его пропсы. Какие компоненты обновляются и сколько это стоит — в Vue DevTools, общая картина — во вкладке Performance. `v-memo` «на всякий случай» не ставят.' },
      { title: 'Независимые части — в отдельные компоненты', text: 'Vue обновляет дочерние компоненты по отдельности. Форма и большая таблица в одном компоненте — каждый ввод перерендеривает таблицу.', code: `<!-- плохо: всё в одном шаблоне -->
<input v-model="query" />
<tr v-for="r in rows">...</tr>

<!-- ок: таблица не зависит от query -->
<SearchForm v-model="query" />
<OrdersTable :rows="rows" />`, lang: 'vue' },
      { title: 'Пропсы должны быть стабильными', text: 'Общее для всех строк значение обновляет каждую строку — передают вычисленный флаг. Объект или массив, созданный прямо в шаблоне, — новая ссылка на каждом рендере.', code: `<Row v-for="r in rows" :key="r.id" :active-id="activeId" />        <!-- все строки -->
<Row v-for="r in rows" :key="r.id" :active="r.id === activeId" /> <!-- две строки -->
<Chart :options="{ legend: true }" /> <!-- новый объект каждый рендер -->`, lang: 'vue' },
      { title: '`v-once` — отрендерить один раз, `v-memo` — пропускать, пока зависимости те же', text: '`v-memo` (3.2+) — мемоизация прямо в шаблоне, главный сценарий — большой `v-for`, где при выборе меняются две строки. Забыл зависимость — строка перестанет обновляться.', code: `<footer v-once>{{ legal }}</footer>

<div v-for="r in rows" :key="r.id" v-memo="[r.id === activeId, r.updatedAt]">
  {{ r.title }}
</div>`, lang: 'vue' },
      { title: 'Большие данные — `shallowRef`, длинные списки — виртуализация', text: '`shallowRef` не создаёт Proxy на каждую строку. Виртуальный список держит в DOM только видимые строки: он уменьшает число узлов, а не число перерендеров. Готовое — `useVirtualList` из VueUse или `vue-virtual-scroller`.', code: `const rows = shallowRef([]) // 50 000 строк без Proxy
const { list, containerProps, wrapperProps } =
  useVirtualList(rows, { itemHeight: 40 })
// <div v-bind="containerProps" style="height: 600px">
//   <div v-bind="wrapperProps"><Row v-for="{ data } in list" ... /></div>`, lang: 'ts' }
    ],
    takeaway: 'Замерить → разбить на компоненты → стабилизировать пропсы → `shallowRef` и виртуализация. `v-memo` и `v-once` — точечно для горячих мест.',
    questions: [
      { q: 'Как бы вы искали и устраняли лишние ререндеры во Vue?', a: 'Сначала измеряю: в Vue DevTools смотрю, какие компоненты обновляются и сколько это занимает, во вкладке Performance — общую картину. Частая причина — большой компонент, где любое изменение перерендеривает всё, поэтому выношу независимые части в дочерние компоненты: Vue обновляет их по отдельности. Дальше слежу за стабильностью пропсов: не передаю во все строки общее значение и не создаю объекты прямо в шаблоне. Большие данные кладу в `shallowRef`. `v-memo` и `v-once` — точечные инструменты для самых горячих мест.' },
      { q: 'Что делают v-once и v-memo?', a: '`v-once` рендерит элемент или компонент один раз и дальше пропускает его при обновлениях — для контента, который точно не меняется. `v-memo` принимает массив значений и пропускает обновление поддерева, пока они не изменились, — мемоизация прямо в шаблоне. Главный сценарий — большой `v-for`, где при выборе элемента реально меняются две строки: `v-memo` по флагу «выбран» пропускает остальные. Если забыть зависимость, строка перестанет обновляться, поэтому применяю его только после замеров.' },
      { q: 'Как отрисовать список из 50 000 элементов без тормозов?', a: 'Рендерить 50 000 элементов в DOM нельзя, поэтому беру виртуальный список: в DOM только видимые строки с небольшим запасом, а полная высота имитируется размером контейнера. Готовые решения — `useVirtualList` из VueUse или `vue-virtual-scroller`. Данные кладу в `shallowRef`, чтобы Vue не создавал Proxy для каждой строки. Если продукт позволяет, лучше пагинация или подгрузка с сервера. Тяжёлую фильтрацию — в `computed` с debounce на вводе или в Web Worker.' }
    ]
  },
  {
    id: 'vue-lazy',
    section: 'vue',
    group: 'Производительность',
    title: 'Lazy loading и code splitting',
    level: 'middle',
    summary: 'Code splitting делит бандл на чанки, которые грузятся по требованию: ленивые маршруты, `defineAsyncComponent`, `Suspense`.',
    points: [
      { title: 'Основа — динамический `import()`: сборщик выносит модуль в отдельный чанк', text: 'Меньше JS на старте — быстрее первая загрузка и интерактивность, особенно на мобильных. Ленивая страница грузится при переходе на неё.', code: `const routes = [
  { path: '/orders', component: () => import('./pages/Orders.vue') }
]`, lang: 'ts' },
      { title: '`defineAsyncComponent` — для тяжёлых компонентов внутри страницы', text: 'Грузится при первом рендере. `delay` не даёт скелетону мигнуть при быстрой загрузке. Для редактора, карты, графиков, больших модалок.', code: `const RichEditor = defineAsyncComponent({
  loader: () => import('./RichEditor.vue'),
  loadingComponent: EditorSkeleton,
  errorComponent: LoadError,
  delay: 200,
  timeout: 10000
})`, lang: 'ts' },
      { title: 'Ловушка: ошибку загрузки чанка надо обработать', text: 'После нового деплоя старые чанки могут исчезнуть с сервера, и пользователь увидит пустое место. Нужен `errorComponent` или перезагрузка страницы при ошибке импорта.' },
      { title: 'Ловушка: лениво грузить первый экран и дробить мелочь', text: 'Контент первого экрана появится с задержкой и сдвинет вёрстку. Мелкие компоненты в чанки не выносят — цепочка мелких запросов дороже экономии. Предзагрузка: вызвать `() => import(...)` при наведении на ссылку.' },
      { title: '`<Suspense>` не грузит код, а ждёт асинхронные зависимости поддерева', text: 'Ждёт компоненты с `await` в `setup` и асинхронные компоненты, пока показывает `#fallback` — один общий вместо спиннеров в каждом виджете. Ошибки не ловит — для них `onErrorCaptured` выше. API всё ещё экспериментальный, но Nuxt использует его под капотом. Без `Suspense` выше по дереву компонент с `await` в `setup` не отрендерится.', code: `<Suspense>
  <Dashboard />   <!-- внутри: const stats = await api.getStats() -->
  <template #fallback><Spinner /></template>
</Suspense>`, lang: 'vue' },
      { title: 'Vue 3.5: ленивая гидрация асинхронных компонентов при SSR', text: 'Компонент гидрируется не сразу, а по стратегии: когда стал виден, в простое, при взаимодействии.', code: `const Comments = defineAsyncComponent({
  loader: () => import('./Comments.vue'),
  hydrate: hydrateOnVisible()
})`, lang: 'ts' }
    ],
    takeaway: 'Страницы и тяжёлые редкие компоненты — лениво, первый экран — сразу, ошибку загрузки чанка — обработать.',
    questions: [
      { q: 'Как реализовать code splitting во Vue-приложении?', a: 'Основа — динамический `import()`: сборщик выносит модуль в отдельный чанк и загружает его при первом вызове. Для страниц пишу в роутере `component: () => import(...)`, и каждая страница становится своим чанком. Для тяжёлых компонентов внутри страницы, вроде редактора или графиков, беру `defineAsyncComponent` с `loadingComponent`, `errorComponent` и `delay`, чтобы скелетон не мигал при быстрой загрузке. То, что видно на первом экране, грузится сразу, иначе будут задержка и сдвиг вёрстки.' },
      { q: 'Что такое Suspense и когда он нужен?', a: 'Suspense — встроенный компонент, который ждёт асинхронные зависимости в своём поддереве: компоненты с `await` в `setup` и асинхронные компоненты. Пока ждёт, показывает слот `#fallback`. Так вместо нескольких спиннеров в разных виджетах можно показать один общий. Ошибки сам Suspense не обрабатывает — для этого `onErrorCaptured` в родителе. API до сих пор помечен как экспериментальный, но Nuxt использует его под капотом.' }
    ]
  },
  {
    id: 'vue-devtools',
    section: 'vue',
    group: 'Производительность',
    title: 'Vue DevTools',
    level: 'middle',
    summary: 'Отладка в терминах Vue: дерево компонентов с состоянием, сторы Pinia, роутер и timeline событий.',
    points: [
      { title: 'Ставится расширением браузера или плагином Vite', text: 'В Nuxt своя панель Nuxt DevTools, включается в `nuxt.config`.', code: `// vite.config.ts
import vueDevTools from 'vite-plugin-vue-devtools'
export default defineConfig({ plugins: [vue(), vueDevTools()] })

// nuxt.config.ts
export default defineNuxtConfig({ devtools: { enabled: true } })`, lang: 'ts' },
      { title: 'Что смотреть: пропсы и состояние, сторы, timeline, маршрут', text: 'В дереве компонентов видно, какие пропсы реально пришли. Во вкладке Pinia можно поменять значение и проверить гипотезу — но это не воспроизводит реальные действия пользователя. Timeline показывает последовательность: событие → action → изменение стора → переход.' },
      { title: 'DevTools знает про компоненты, Performance — про всё остальное', text: 'Профайлер браузера показывает JS, layout и paint, но не знает про компоненты. `app.config.performance` добавляет во вкладку Performance метки рендера и патча компонентов — только в dev.', code: `const app = createApp(App)
app.config.performance = import.meta.env.DEV // в production — лишняя нагрузка
app.mount('#app')`, lang: 'ts' },
      { title: 'Итоговые замеры — на production-сборке', text: 'В dev Vue заметно медленнее из-за проверок и предупреждений. DevTools в production по умолчанию отключены, включаются флагом сборки `__VUE_PROD_DEVTOOLS__`.' }
    ],
    takeaway: 'Тормоза ищут замерами в DevTools и Performance, а не по ощущениям.',
    questions: [
      { q: 'Что вы смотрите в Vue DevTools при отладке?', a: 'В дереве компонентов смотрю, какие пропсы реально пришли и какое состояние внутри — часто проблема видна сразу. Во вкладке Pinia проверяю сторы и могу поменять значение, чтобы проверить гипотезу. Timeline показывает последовательность: какое событие отправилось, какой action вызвался, как изменился стор, какой был переход. Для роутера — текущий маршрут, `params` и `query`.' },
      { q: 'Как найти медленный компонент?', a: 'Воспроизвожу медленное действие и смотрю в Vue DevTools, какие компоненты обновляются и сколько занимает их рендер — часто видно, что перерендеривается то, что не должно. Если нужна полная картина вместе с layout и paint браузера, включаю `app.config.performance` и записываю профиль во вкладке Performance: там появляются метки рендера и патча компонентов. Итоговые замеры делаю на production-сборке, потому что в dev-режиме Vue заметно медленнее из-за проверок и предупреждений.' }
    ]
  }
);
