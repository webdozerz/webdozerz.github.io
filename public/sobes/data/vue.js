window.SOBES = window.SOBES || { topics: [], quiz: [] };
window.SOBES.topics.push(
  {
    id: 'vue-options-composition',
    section: 'vue',
    group: 'Основы',
    title: 'Options API vs Composition API',
    level: 'junior',
    summary: 'Два способа описать компонент: по типам опций (data, methods) или по смыслу через функции в setup',
    what: 'Options API раскладывает компонент по опциям: data, computed, methods, watch, хуки. Composition API собирает логику внутри setup (обычно через <script setup>) из функций ref, computed, watch и хуков onMounted. Оба API работают на одной реактивной системе и поддерживаются в Vue 3.',
    why: 'Composition API позволяет группировать код по фичам, а не по типам опций, и выносить логику в composables. Плюс он лучше дружит с TypeScript: типы выводятся из обычных переменных, без магии this.',
    when: 'Для нового кода на Vue 3 по умолчанию берут <script setup>. Options API нормален для простых компонентов и легаси, переписывать рабочий код ради моды не нужно.',
    diff: 'В Options API всё висит на this, и логика одной фичи размазана между data, methods и watch. В Composition API это обычные переменные и функции в замыкании, их можно вынести в отдельный файл и переиспользовать. Миксины из Options API Composition API заменяет composables.',
    code: [
      { title: 'Options API', lang: 'vue', src: `<script lang="ts">
export default {
  data() {
    return { count: 0 }
  },
  computed: {
    double(): number { return this.count * 2 }
  },
  methods: {
    inc() { this.count++ }
  },
  mounted() {
    console.log('mounted', this.count)
  }
}
</script>` },
      { title: 'То же на <script setup>', lang: 'vue', src: `<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)
const inc = () => count.value++

onMounted(() => console.log('mounted', count.value))
</script>

<template>
  <button @click="inc">{{ count }} / {{ double }}</button>
</template>` }
    ],
    real: 'В большом компоненте формы заказа логика валидации, загрузки справочников и расчёта цены в Options API перемешана по data/methods/watch. На Composition API каждая часть уезжает в свой useValidation, useDictionaries, usePrice, и компонент становится читаемым.',
    pitfalls: [
      'Смешивать оба API в одном компоненте без причины: часть состояния в data, часть в setup, и непонятно, где искать логику.',
      'Писать <script setup> «как Options API»: все ref сверху, все функции снизу. Тогда главный плюс, группировка по фичам, теряется.',
      'Считать Options API устаревшим и удалённым: он официально поддерживается и нужен для чтения легаси.'
    ],
    questions: [
      {
        id: 'vue-options-composition-q1',
        q: 'Чем Composition API лучше Options API и когда вы бы всё-таки взяли Options API?',
        level: 'junior',
        keys: ['группировка кода по фичам, а не по типам опций', 'переиспользование через composables вместо миксинов', 'нормальная типизация без this', 'Options API годится для простых компонентов и легаси'],
        a: 'В Options API логика одной фичи разбросана по data, computed, methods и watch, а переиспользовать её можно только миксинами, у которых конфликты имён и неявные зависимости. Composition API позволяет держать код фичи рядом и вынести его в composable — обычную функцию с понятным входом и выходом. Ещё TypeScript в setup работает почти без усилий. Options API я бы оставил в старом коде и в совсем простых компонентах, переписывать ради моды смысла нет.'
      },
      {
        id: 'vue-options-composition-q2',
        q: 'Что такое <script setup> и чем он отличается от обычной функции setup()?',
        level: 'middle',
        keys: ['синтаксический сахар, компилируется в setup()', 'переменные и импорты верхнего уровня сразу доступны в шаблоне', 'макросы defineProps/defineEmits/defineModel без импорта', 'меньше кода и лучше производительность шаблона'],
        a: '<script setup> — это сахар компилятора: всё, что объявлено на верхнем уровне, включая импорты компонентов, автоматически доступно в шаблоне, return писать не надо. Пропсы и события объявляются макросами defineProps и defineEmits, которые не импортируются и исчезают при компиляции. Шаблон компилируется в render-функцию внутри той же области видимости, поэтому нет лишнего прокси. По умолчанию такой компонент закрыт: снаружи через ref на него ничего не видно, пока не сделать defineExpose.'
      }
    ]
  },
  {
    id: 'vue-ref-reactive',
    section: 'vue',
    group: 'Основы',
    title: 'ref vs reactive',
    level: 'junior',
    summary: 'ref оборачивает любое значение в объект с .value, reactive делает Proxy над объектом и теряет связь при деструктуризации',
    what: 'ref создаёт объект с полем .value, чтение и запись которого отслеживаются; если положить туда объект, он станет глубоко реактивным через reactive. reactive возвращает Proxy над объектом и работает только с объектами, массивами, Map и Set. В шаблоне ref верхнего уровня разворачивается автоматически, .value не нужен.',
    why: 'Это базовые кирпичи реактивности: из них строятся computed, watch и всё состояние компонентов и сторов.',
    when: 'По умолчанию — ref: работает с примитивами, его можно переприсвоить целиком и безопасно вернуть из composable. reactive удобен для связанной группы полей, например формы, если её не нужно заменять целиком. shallowRef — для больших объектов, которые меняются только заменой.',
    diff: 'ref можно переприсвоить (state.value = новыйОбъект), реактивность сохранится. reactive переприсвоить нельзя: новая переменная — это уже не тот Proxy. Деструктуризация reactive даёт обычные значения без реактивности, поэтому для этого есть toRefs и toRef. shallowRef отслеживает только .value, без вложенных полей.',
    code: [
      { title: 'Потеря реактивности и toRefs', lang: 'ts', src: `import { reactive, toRefs, watch } from 'vue'

const form = reactive({ email: '', agree: false })

// плохо: просто строка и boolean, связь с form потеряна
const { email } = form

// хорошо: каждое поле — ref, связанный с form
const { agree } = toRefs(form)
agree.value = true
console.log(form.agree) // true

// watch на поле reactive — через геттер
watch(() => form.email, (v) => console.log(v))` },
      { title: 'shallowRef для больших данных', lang: 'ts', src: `import { shallowRef, triggerRef } from 'vue'

const rows = shallowRef<Row[]>([])

async function load() {
  rows.value = await api.getRows() // замена — реактивно
}

function patchFirst() {
  rows.value[0].name = 'x' // не отслеживается
  triggerRef(rows)          // форсируем обновление вручную
}` }
    ],
    real: 'Таблица на 10 000 строк из API: если положить её в ref, Vue обернёт в Proxy каждую строку, и это заметно по памяти и времени. shallowRef с заменой массива целиком после загрузки решает проблему.',
    pitfalls: [
      'Деструктурировать reactive или пропсы без toRefs и удивляться, что значения не обновляются.',
      'Переприсвоить reactive-переменную целиком (state = reactive({...})) — шаблон продолжит смотреть на старый Proxy.',
      'Забыть .value в script: сравнение if (isOpen) с ref всегда true, потому что это объект.',
      'Сравнивать reactive-объект с исходным: reactive(obj) !== obj, Proxy и оригинал — разные ссылки.'
    ],
    questions: [
      {
        id: 'vue-ref-reactive-q1',
        q: 'Чем ref отличается от reactive и что вы используете по умолчанию?',
        level: 'junior',
        keys: ['ref работает с любым типом, доступ через .value', 'reactive — Proxy только над объектами', 'reactive нельзя переприсвоить и теряет реактивность при деструктуризации', 'по умолчанию ref'],
        a: 'ref — это контейнер с .value, туда можно положить что угодно, включая примитивы, и его можно заменить целиком. reactive возвращает Proxy над объектом, к полям обращаешься без .value, но переприсвоить переменную нельзя, а деструктуризация рвёт связь. Поэтому я по умолчанию беру ref: меньше сюрпризов, и из composable его можно спокойно вернуть. reactive использую для формы, где удобно писать form.email.'
      },
      {
        id: 'vue-ref-reactive-q2',
        q: 'Почему при деструктуризации reactive теряется реактивность и как это исправить?',
        level: 'middle',
        keys: ['реактивность живёт в Proxy, а деструктуризация читает значение один раз', 'получается обычная переменная-примитив', 'toRefs/toRef создают ref, связанные с исходным объектом', 'в 3.5 деструктуризация defineProps реактивна за счёт компилятора'],
        a: 'Vue отслеживает чтение через get у Proxy. Когда пишешь const { email } = form, get срабатывает один раз, и в переменную попадает строка, никак не связанная с form. Исправляется через toRefs(form) или toRef(form, "email"): получаются ref, которые читают и пишут в исходный объект. С пропсами в Vue 3.5 деструктуризация в defineProps стала реактивной — компилятор подменяет обращения на props.x, но передавать такое значение в watch или composable всё равно надо геттером.'
      },
      {
        id: 'vue-ref-reactive-q3',
        q: 'Когда нужен shallowRef?',
        level: 'middle',
        keys: ['отслеживается только замена .value', 'нет глубокого Proxy — экономия памяти и времени', 'большие списки, внешние объекты (карты, редакторы)', 'изменения внутри — через замену или triggerRef'],
        a: 'shallowRef отслеживает только присваивание в .value, вложенные поля не оборачиваются в Proxy. Это полезно для больших неизменяемых данных, например списка из API, который мы только заменяем, и для экземпляров сторонних библиотек вроде карты или редактора, которым Proxy только мешает. Если всё-таки мутировать внутри, нужно вызвать triggerRef или заменить значение новым объектом.'
      }
    ]
  },
  {
    id: 'vue-computed-watch',
    section: 'vue',
    group: 'Основы',
    title: 'computed vs watch',
    level: 'junior',
    summary: 'computed — кешируемое производное значение без побочных эффектов, watch — реакция на изменение с эффектами',
    what: 'computed вычисляет значение из реактивных источников и кеширует его, пока зависимости не изменились. watch следит за конкретным источником и вызывает колбэк с новым и старым значением. У watch есть опции deep, immediate, once и flush.',
    why: 'computed нужен для отображения производных данных: отфильтрованный список, сумма, флаг. watch — для побочных эффектов: запрос к API при смене фильтра, запись в localStorage, синхронизация с внешней библиотекой.',
    when: 'Если результат — значение для шаблона, это computed. Если надо что-то сделать при изменении, это watch. Писать watch, который только присваивает другое состояние, почти всегда ошибка: это должен быть computed.',
    diff: 'computed ленивый и кешируется, а метод в шаблоне пересчитывается при каждом рендере. watch не возвращает значение и запускается после изменения. По flush: pre (по умолчанию, до обновления DOM), post (после, есть доступ к новому DOM), sync (сразу, дорого).',
    code: [
      { title: 'computed для производных данных', lang: 'vue', src: `<script setup lang="ts">
import { ref, computed } from 'vue'

const items = ref<{ title: string; done: boolean }[]>([])
const filter = ref<'all' | 'done'>('all')

const visible = computed(() =>
  filter.value === 'done' ? items.value.filter(i => i.done) : items.value
)
const doneCount = computed(() => items.value.filter(i => i.done).length)
</script>` },
      { title: 'watch с опциями', lang: 'ts', src: `import { ref, watch } from 'vue'

const query = ref('')
const filters = ref({ city: '', price: [0, 1000] })

watch(query, async (q, prev) => {
  results.value = await search(q)
}, { immediate: true })

watch(filters, () => saveToUrl(filters.value), { deep: true })

// после обновления DOM
watch(results, () => scrollToTop(), { flush: 'post' })` }
    ],
    real: 'В каталоге товаров отфильтрованный список и сумма корзины — computed, а перезапрос товаров при смене фильтров и синхронизация фильтров с query-параметрами URL — watch.',
    pitfalls: [
      'Мутировать состояние или ходить в API внутри computed: он может пересчитаться в непредсказуемый момент или вообще не пересчитаться.',
      'watch, который только копирует одно значение в другое: лишнее состояние и рассинхрон, нужен computed.',
      'Ставить deep: true на огромный объект: Vue обходит его целиком при каждом изменении.',
      'Передать в watch поле reactive напрямую (watch(state.count, ...)) — это число, а не источник; нужен геттер.'
    ],
    questions: [
      {
        id: 'vue-computed-watch-q1',
        q: 'Чем computed отличается от watch и от метода в шаблоне?',
        level: 'junior',
        keys: ['computed возвращает значение и кешируется по зависимостям', 'метод вызывается на каждый рендер', 'watch — для побочных эффектов, ничего не возвращает', 'computed должен быть чистым'],
        a: 'computed — это производное значение: Vue запоминает результат и пересчитывает его, только когда изменились реактивные зависимости. Метод в шаблоне выполняется на каждом рендере, даже если данные не менялись. watch нужен не для значений, а для действий: сходить в API, записать в storage, дёрнуть стороннюю библиотеку. Правило простое: нужно значение — computed, нужно действие — watch.'
      },
      {
        id: 'vue-computed-watch-q2',
        q: 'Расскажите про опции watch: deep, immediate, flush.',
        level: 'middle',
        keys: ['immediate — вызвать колбэк сразу при создании', 'deep — следить за вложенными изменениями, дорого на больших объектах', 'flush pre по умолчанию, post — после обновления DOM, sync — синхронно', 'в 3.5 deep может быть числом глубины, есть once'],
        a: 'immediate запускает колбэк сразу, со старым значением undefined, — удобно для первичной загрузки. deep заставляет следить за изменениями внутри объекта; если передать reactive-объект напрямую, watch и так глубокий. В Vue 3.5 deep можно задать числом — глубиной обхода, и появилась опция once. flush определяет момент вызова: pre — до обновления DOM, это дефолт; post — после, когда нужен доступ к новому DOM; sync — сразу при изменении, без батчинга, им лучше не злоупотреблять.'
      }
    ]
  },
  {
    id: 'vue-watcheffect',
    section: 'vue',
    group: 'Основы',
    title: 'watchEffect vs watch',
    level: 'middle',
    summary: 'watchEffect сам собирает зависимости и запускается сразу, watch следит за явным источником и даёт старое значение',
    what: 'watchEffect выполняет функцию сразу и отслеживает все реактивные значения, прочитанные при выполнении. Когда любое из них меняется, функция запускается снова. Колбэк получает onCleanup, чтобы отменить предыдущую работу перед следующим запуском.',
    why: 'Удобен для эффектов, которые зависят от нескольких источников: не надо перечислять их вручную. onCleanup решает проблему гонок запросов и утечек подписок.',
    when: 'watchEffect — когда зависимостей много и старое значение не нужно. watch — когда нужно точно контролировать, на что реагировать, нужно предыдущее значение или эффект не должен стартовать сразу.',
    diff: 'watch ленивый по умолчанию и следит только за указанным источником. watchEffect запускается сразу и отслеживает только то, что прочитано синхронно — всё, что после первого await, в зависимости не попадёт. В Vue 3.5 появился onWatcherCleanup, который работает и в watch, и в watchEffect.',
    code: [
      { title: 'Отмена устаревшего запроса', lang: 'ts', src: `import { ref, watchEffect } from 'vue'

const userId = ref(1)
const user = ref<User | null>(null)

watchEffect(async (onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())

  // userId прочитан до await — попал в зависимости
  const res = await fetch('/api/users/' + userId.value, {
    signal: controller.signal
  })
  user.value = await res.json()
})` },
      { title: 'Остановка вотчера', lang: 'ts', src: `import { watchEffect } from 'vue'

const stop = watchEffect(() => {
  document.title = 'Корзина: ' + cart.count
})

// вотчеры, созданные синхронно в setup, остановятся сами
// созданные асинхронно — нужно останавливать вручную
onBeforeUnmount(stop)` }
    ],
    real: 'Поле поиска с автодополнением: пользователь быстро печатает, и ответы приходят не по порядку. onCleanup с AbortController отменяет предыдущий запрос, и в списке не появляются подсказки для старой строки.',
    pitfalls: [
      'Читать реактивное значение после await в watchEffect — оно не станет зависимостью, эффект не перезапустится.',
      'Не отменять предыдущий запрос — race condition, старый ответ перетирает новый.',
      'Создавать вотчер в setTimeout или после await в setup — он не привяжется к компоненту и утечёт.',
      'Использовать watchEffect там, где нужно реагировать на одно поле: случайно прочитанное значение тоже станет триггером.'
    ],
    questions: [
      {
        id: 'vue-watcheffect-q1',
        q: 'Чем watchEffect отличается от watch?',
        level: 'middle',
        keys: ['watchEffect запускается сразу', 'зависимости собираются автоматически по чтению', 'нет старого значения', 'отслеживается только синхронная часть до первого await'],
        a: 'watchEffect запускает функцию сразу и подписывается на всё реактивное, что она прочитала. watch ленивый, следит за явно указанным источником и даёт новое и старое значение. watchEffect удобен, когда зависимостей много, но у него ловушка: всё, что прочитано после первого await, в зависимости не попадает. Если нужен точный контроль или предыдущее значение, беру watch.'
      },
      {
        id: 'vue-watcheffect-q2',
        q: 'Зачем нужен onCleanup в вотчерах? Приведите пример.',
        level: 'middle',
        keys: ['вызывается перед следующим запуском эффекта и при остановке', 'отмена запросов, гонки ответов', 'снятие подписок, таймеров', 'в 3.5 есть onWatcherCleanup'],
        a: 'onCleanup регистрирует функцию, которая выполнится перед следующим запуском эффекта или при остановке вотчера. Типичный пример — поиск: на каждый ввод создаю AbortController и в onCleanup делаю abort, тогда устаревший запрос отменится и не перезапишет свежий результат. Так же снимают подписки на сокеты или чистят таймеры. В Vue 3.5 есть onWatcherCleanup, который импортируется из vue и вызывается внутри колбэка синхронно.'
      }
    ]
  },
  {
    id: 'vue-lifecycle',
    section: 'vue',
    group: 'Основы',
    title: 'Хуки жизненного цикла',
    level: 'junior',
    summary: 'setup, монтирование, обновление, размонтирование; на сервере выполняется только setup и onServerPrefetch',
    what: 'Компонент проходит этапы: setup (в Options API это beforeCreate/created), onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted. Есть ещё onErrorCaptured, onActivated/onDeactivated для KeepAlive и onServerPrefetch для SSR. Хуки регистрируются синхронно внутри setup.',
    why: 'Хуки дают точки для работы с DOM, подписок и очистки: инициализировать стороннюю библиотеку после монтирования и уничтожить её перед удалением компонента.',
    when: 'Данные можно начинать грузить прямо в setup. DOM доступен только с onMounted. Очистка — в onBeforeUnmount или onUnmounted. onUpdated используют редко: для реакции на данные лучше watch.',
    diff: 'В setup уже есть реактивное состояние и пропсы, но нет DOM и template ref пустые. В onMounted DOM есть. На сервере при SSR выполняются только setup (и beforeCreate/created) и onServerPrefetch, а onMounted и остальные — только в браузере, поэтому window и document трогают там.',
    code: [
      { title: 'Сторонняя библиотека с очисткой', lang: 'vue', src: `<script setup lang="ts">
import { onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import Chart from 'chart.js/auto'

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
let chart: Chart | null = null

onMounted(() => {
  // DOM уже есть, canvas.value заполнен
  chart = new Chart(canvas.value!, config)
})

onBeforeUnmount(() => {
  chart?.destroy()
})
</script>

<template>
  <canvas ref="canvas" />
</template>` },
      { title: 'Порядок у родителя и ребёнка', lang: 'ts', src: `// Монтирование:
// Parent setup -> Parent onBeforeMount
// Child setup  -> Child onBeforeMount -> Child onMounted
// Parent onMounted
//
// Родитель смонтирован последним: его onMounted
// видит уже смонтированных детей` }
    ],
    real: 'В SSR-приложении разработчик в setup обратился к localStorage, и сервер упал с ReferenceError. Перенос чтения в onMounted (или проверка import.meta.client в Nuxt) решает проблему, потому что onMounted на сервере не вызывается.',
    pitfalls: [
      'Регистрировать хук после await в setup — он не привяжется к компоненту и не сработает.',
      'Обращаться к window/document в setup в SSR-приложении — на сервере их нет.',
      'Не чистить слушатели, таймеры и экземпляры библиотек в onBeforeUnmount — утечки памяти при навигации.',
      'Менять состояние в onUpdated — легко получить бесконечный цикл обновлений.'
    ],
    questions: [
      {
        id: 'vue-lifecycle-q1',
        q: 'Какие хуки жизненного цикла есть в Vue 3 и что доступно в каждом?',
        level: 'junior',
        keys: ['setup — состояние и пропсы, нет DOM', 'onMounted — DOM и template refs доступны', 'onBeforeUpdate/onUpdated — до и после перерисовки', 'onBeforeUnmount/onUnmounted — очистка'],
        a: 'Сначала выполняется setup: там есть пропсы и реактивное состояние, но нет DOM. onBeforeMount вызывается перед первым рендером, onMounted — после, тут уже можно работать с элементами и template ref. onBeforeUpdate и onUpdated срабатывают вокруг перерисовки при изменении данных. onBeforeUnmount и onUnmounted — место для очистки: снять слушатели, остановить таймеры, уничтожить сторонние виджеты. Ещё есть onErrorCaptured, хуки KeepAlive и onServerPrefetch.'
      },
      {
        id: 'vue-lifecycle-q2',
        q: 'Какие хуки вызываются на сервере при SSR и что из этого следует?',
        level: 'middle',
        keys: ['на сервере — только setup (beforeCreate/created) и onServerPrefetch', 'onMounted и последующие — только на клиенте', 'window/document только в onMounted или под проверкой', 'подписки в setup на сервере утекут — их нечем снять'],
        a: 'На сервере выполняется setup, в Options API — beforeCreate и created, и onServerPrefetch, который может вернуть промис, и сервер его дождётся. Монтирования там нет, поэтому onMounted, onUpdated, onUnmounted не вызываются. Отсюда два правила: всё, что трогает браузерные API, делаю в onMounted, и не создаю в setup таймеры и подписки, потому что на сервере не будет onUnmounted, чтобы их снять.'
      }
    ]
  },
  {
    id: 'vue-props-emits',
    section: 'vue',
    group: 'Основы',
    title: 'Props и emits',
    level: 'junior',
    summary: 'Данные идут вниз через props, события вверх через emits; ребёнок не меняет пропсы сам',
    what: 'Props — входные данные компонента, объявляются через defineProps. Emits — события, которыми компонент сообщает родителю об изменениях, объявляются через defineEmits. В TypeScript оба макроса типизируются дженериком.',
    why: 'Однонаправленный поток данных делает понятным, кто владеет состоянием: родитель хранит, ребёнок показывает и просит изменить. Так проще искать баги и переиспользовать компоненты.',
    when: 'Props — для всего, что компонент получает от родителя. Emits — для любых действий пользователя, которые должен обработать родитель. Если данные гоняются через 3+ уровня, стоит посмотреть на provide/inject или стор.',
    diff: 'Props только для чтения, в отличие от локального состояния. Emits в отличие от колбэк-пропсов документируют события компонента и не попадают в $attrs. Валидация пропсов в рантайме работает только в dev и не заменяет TypeScript.',
    code: [
      { title: 'Типизированные props и emits (3.5)', lang: 'vue', src: `<script setup lang="ts">
const { title, count = 0 } = defineProps<{
  title: string
  count?: number
}>()

const emit = defineEmits<{
  change: [value: number]
  close: []
}>()

function inc() {
  emit('change', count + 1) // не count++
}
</script>

<template>
  <h3>{{ title }}</h3>
  <button @click="inc">{{ count }}</button>
</template>` },
      { title: 'Рантайм-валидация', lang: 'ts', src: `const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v: string) => ['sm', 'md', 'lg'].includes(v)
  },
  items: {
    type: Array,
    default: () => [] // фабрика для объектов и массивов
  }
})` }
    ],
    real: 'Компонент карточки товара получает product через props и эмитит add-to-cart. Карточку можно поставить в каталог, в избранное и в рекомендации, а что делать при добавлении, решает родитель.',
    pitfalls: [
      'Мутировать проп напрямую или поле объекта из пропса — Vue предупредит только про первое, а второе тихо сломает поток данных.',
      'Копировать проп в ref при создании и ждать, что копия обновится при изменении пропса.',
      'Задавать default для массива или объекта без фабрики в runtime-объявлении — общий экземпляр на все компоненты.',
      'Передавать деструктурированный проп в watch напрямую — нужен геттер () => count.'
    ],
    questions: [
      {
        id: 'vue-props-emits-q1',
        q: 'Что такое однонаправленный поток данных и почему нельзя менять props?',
        level: 'junior',
        keys: ['данные идут от родителя к ребёнку', 'ребёнок сообщает об изменениях через emit', 'при следующем рендере родитель перезапишет проп', 'понятно, кто владеет состоянием'],
        a: 'Родитель владеет данными и передаёт их вниз через props, а ребёнок, если хочет что-то изменить, эмитит событие, и родитель сам решает, менять ли состояние. Если ребёнок меняет проп напрямую, при следующем рендере родителя значение перезапишется, а если это объект, мутация тихо поменяет данные родителя, и потом не найти, кто это сделал. Если нужно локально редактировать значение, делаю копию в ref или computed с get/set.'
      },
      {
        id: 'vue-props-emits-q2',
        q: 'Что изменилось с деструктуризацией props в Vue 3.5?',
        level: 'middle',
        keys: ['деструктуризация defineProps стала реактивной', 'компилятор заменяет обращения на props.x', 'дефолты через синтаксис JS вместо withDefaults', 'в watch и composables передавать через геттер'],
        a: 'В 3.5 можно писать const { count = 0 } = defineProps<...>(), и count останется реактивным: компилятор переписывает обращения к нему в props.count. Дефолты задаются обычным синтаксисом деструктуризации, withDefaults больше не нужен. Но в watch(count) или в composable значение передаётся как есть, и связь теряется, поэтому туда передаю геттер () => count.'
      }
    ]
  },
  {
    id: 'vue-v-model',
    section: 'vue',
    group: 'Основы',
    title: 'v-model на компонентах',
    level: 'middle',
    summary: 'v-model — сахар над пропсом modelValue и событием update:modelValue; в 3.4+ его объявляют через defineModel',
    what: 'На компоненте v-model разворачивается в проп modelValue и событие update:modelValue. С именем, например v-model:title, — в проп title и событие update:title. Макрос defineModel (Vue 3.4+) объявляет всё это сразу и возвращает ref, запись в который эмитит событие.',
    why: 'Позволяет делать собственные поля ввода, селекты, модалки с двусторонней привязкой так же удобно, как с нативным input.',
    when: 'Для компонентов, которые редактируют значение родителя: инпуты, переключатели, диалог с v-model:open. Если компонент только показывает данные, v-model не нужен.',
    diff: 'defineModel заменяет ручную пару defineProps + defineEmits + computed с get/set. В Vue 2 было value/input и .sync, в Vue 3 это объединено в v-model с аргументом. Модификаторы встроенные (.trim, .number, .lazy) работают на нативных полях, на компоненте их нужно обрабатывать самому.',
    code: [
      { title: 'defineModel и несколько v-model', lang: 'vue', src: `<!-- UserForm.vue -->
<script setup lang="ts">
const firstName = defineModel<string>('firstName', { required: true })
const lastName = defineModel<string>('lastName')
</script>

<template>
  <input v-model="firstName" />
  <input v-model="lastName" />
</template>

<!-- Родитель -->
<UserForm v-model:first-name="user.first" v-model:last-name="user.last" />` },
      { title: 'Свой модификатор', lang: 'vue', src: `<script setup lang="ts">
const [model, modifiers] = defineModel<string, 'capitalize'>({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input v-model="model" />
</template>

<!-- <MyInput v-model.capitalize="name" /> -->` }
    ],
    real: 'Дизайн-система с компонентами BaseInput, BaseSelect, BaseModal: все поддерживают v-model, а модалка — v-model:open, чтобы родитель мог и открыть её, и узнать, что пользователь закрыл её крестиком.',
    pitfalls: [
      'Мутировать вложенное поле объекта из v-model (model.value.name = ...) — событие не эмитится, а объект родителя меняется тихо.',
      'Писать v-model на пропс внутри дочернего компонента — это попытка изменить проп.',
      'Ожидать, что .trim или .number сработают на кастомном компоненте сами по себе.',
      'Если родитель не передал v-model, defineModel работает как локальный ref — это может замаскировать ошибку в использовании.'
    ],
    questions: [
      {
        id: 'vue-v-model-q1',
        q: 'Как работает v-model на компоненте и что делает defineModel?',
        level: 'middle',
        keys: ['разворачивается в modelValue + update:modelValue', 'с аргументом — prop с именем и update:имя', 'defineModel объявляет проп и событие, возвращает ref', 'запись в ref эмитит событие'],
        a: 'v-model на компоненте — это сахар: родитель передаёт проп modelValue и слушает update:modelValue. С аргументом, например v-model:title, будет проп title и событие update:title, так можно повесить несколько v-model на один компонент. defineModel из Vue 3.4 объявляет и проп, и событие и возвращает ref: читаешь — получаешь проп, присваиваешь — эмитится update. Раньше то же самое писали руками через defineProps, defineEmits и computed с get/set.'
      },
      {
        id: 'vue-v-model-q2',
        q: 'Как поддержать модификатор v-model на своём компоненте?',
        level: 'middle+',
        keys: ['модификаторы приходят в проп modelModifiers (или имяModifiers)', 'defineModel возвращает кортеж [model, modifiers]', 'трансформация в опциях get/set', 'встроенные .trim/.number работают на нативных полях'],
        a: 'Модификаторы приходят в компонент отдельным пропом: modelModifiers для обычного v-model или titleModifiers для v-model:title, это объект вида { capitalize: true }. С defineModel удобнее: деструктурируешь [model, modifiers] и в опции set преобразуешь значение перед эмитом. Встроенные trim, number и lazy относятся к нативным полям, поэтому если компонент внутри просто передаёт v-model в input, их можно прокинуть, но логику модификатора решаешь ты.'
      }
    ]
  },
  {
    id: 'vue-slots',
    section: 'vue',
    group: 'Основы',
    title: 'Слоты',
    level: 'junior',
    summary: 'Слоты передают в компонент разметку; именованные — в несколько мест, scoped — с данными от ребёнка',
    what: 'Слот — место в шаблоне компонента, куда родитель вставляет свой контент. Default-слот один, именованные позволяют передать контент в разные области (header, footer). Scoped-слот передаёт данные из ребёнка в разметку родителя через пропсы слота.',
    why: 'Слоты делают компоненты гибкими без десятков пропсов: модалка не знает, что у неё внутри, таблица не знает, как рисовать ячейку.',
    when: 'Когда разметка внутри компонента должна меняться от места к месту. Если вариантов пара и они простые, иногда проще проп. Scoped-слот — когда компонент владеет данными и логикой, а внешний вид решает родитель.',
    diff: 'Props передают данные, слоты — разметку. Scoped-слот отличается от обычного тем, что контент рендерится с данными ребёнка, но в области видимости родителя. Это похоже на render props в React.',
    code: [
      { title: 'Именованные и scoped-слоты', lang: 'vue', src: `<!-- DataList.vue -->
<script setup lang="ts" generic="T extends { id: number }">
defineProps<{ items: T[] }>()
defineSlots<{
  default(props: { item: T; index: number }): any
  empty(): any
}>()
</script>

<template>
  <ul v-if="items.length">
    <li v-for="(item, index) in items" :key="item.id">
      <slot :item="item" :index="index" />
    </li>
  </ul>
  <slot v-else name="empty">Ничего нет</slot>
</template>` },
      { title: 'Использование', lang: 'vue', src: `<DataList :items="users">
  <template #default="{ item }">
    <b>{{ item.name }}</b> — {{ item.email }}
  </template>
  <template #empty>
    <p>Пользователей пока нет</p>
  </template>
</DataList>` }
    ],
    real: 'Компонент таблицы в админке берёт на себя сортировку, пагинацию и выделение строк, а ячейки рисуются через scoped-слоты #cell-status, #cell-actions — у каждого экрана свои бейджи и кнопки.',
    pitfalls: [
      'Пытаться обратиться к данным ребёнка в обычном слоте — контент слота видит только область родителя.',
      'Смешивать v-slot на компоненте и <template #name> внутри — для нескольких слотов все должны быть в template.',
      'Проверять наличие слота через пропс-флаг вместо $slots / useSlots().',
      'Делать проп для каждого варианта разметки вместо слота — API компонента разрастается.'
    ],
    questions: [
      {
        id: 'vue-slots-q1',
        q: 'Что такое scoped-слоты и когда они нужны?',
        level: 'middle',
        keys: ['ребёнок передаёт данные в слот через атрибуты на <slot>', 'родитель получает их через v-slot / #name="props"', 'логика в ребёнке, отображение у родителя', 'пример: таблица, список, автокомплит'],
        a: 'Обычный слот рендерится в области видимости родителя и о данных ребёнка ничего не знает. В scoped-слоте ребёнок пробрасывает данные атрибутами на <slot>, а родитель принимает их через #default="{ item }". Это нужно, когда компонент владеет данными и логикой, например список с пагинацией или таблица, а как рисовать каждый элемент, решает тот, кто использует. В TypeScript слоты можно типизировать через defineSlots.'
      },
      {
        id: 'vue-slots-q2',
        q: 'Как проверить, передан ли слот, и зачем это нужно?',
        level: 'middle',
        keys: ['$slots в шаблоне или useSlots() в setup', 'не рендерить обёртку, если слота нет', 'fallback-контент внутри <slot>'],
        a: 'В шаблоне есть $slots, в script setup — useSlots(). Это нужно, чтобы не рисовать обёртку, если контента нет: например, не выводить пустой footer модалки с отступами через v-if="$slots.footer". Если же нужно просто значение по умолчанию, достаточно положить fallback-контент внутрь тега <slot>.'
      }
    ]
  },
  {
    id: 'vue-provide-inject',
    section: 'vue',
    group: 'Основы',
    title: 'provide / inject',
    level: 'middle',
    summary: 'Передача данных потомкам на любую глубину без пробрасывания пропсов через каждый уровень',
    what: 'provide в предке кладёт значение по ключу, inject в любом потомке его достаёт. Ключом может быть строка или Symbol; в TypeScript используют InjectionKey<T>, чтобы inject знал тип. Если передать ref или reactive, потомки получат реактивные данные.',
    why: 'Убирает prop drilling: тема, текущий пользователь, контекст формы или составного компонента (Tabs и Tab) доступны глубоко внизу без промежуточных пропсов.',
    when: 'Для контекста поддерева: составные компоненты, конфигурация плагина, форма и её поля. Для глобального бизнес-состояния лучше Pinia: у неё есть devtools и понятная точка входа.',
    diff: 'Props явные и видны в шаблоне, inject неявный. Pinia — глобальное состояние, provide/inject — скоупный, у каждого поддерева может быть своё значение. app.provide делает значение доступным во всём приложении, так работают плагины.',
    code: [
      { title: 'Типизированный ключ', lang: 'ts', src: `// form-context.ts
import type { InjectionKey, Ref } from 'vue'

export interface FormContext {
  disabled: Ref<boolean>
  register: (name: string) => void
}

export const FormKey: InjectionKey<FormContext> = Symbol('Form')` },
      { title: 'Provide в форме, inject в поле', lang: 'vue', src: `<!-- AppForm.vue -->
<script setup lang="ts">
import { provide, ref, readonly } from 'vue'
import { FormKey } from './form-context'

const disabled = ref(false)
const fields = new Set<string>()

provide(FormKey, {
  disabled: readonly(disabled),
  register: (name) => fields.add(name)
})
</script>

<!-- AppField.vue -->
<script setup lang="ts">
import { inject } from 'vue'
import { FormKey } from './form-context'

const form = inject(FormKey)
if (!form) throw new Error('AppField должен быть внутри AppForm')
</script>` }
    ],
    real: 'UI-кит с компонентами Tabs/TabPanel или Accordion/AccordionItem: родитель через provide отдаёт активную вкладку и функцию переключения, дети через inject регистрируются и узнают, активны ли они.',
    pitfalls: [
      'Передавать в provide примитив (provide(key, count.value)) — потомки получат снимок без реактивности.',
      'Давать потомкам менять провайдящееся состояние напрямую — лучше отдавать readonly и функции для изменений.',
      'Использовать строковые ключи в большом приложении — коллизии и отсутствие типов; Symbol с InjectionKey надёжнее.',
      'Вызывать inject вне setup или асинхронно — он работает только синхронно в setup.'
    ],
    questions: [
      {
        id: 'vue-provide-inject-q1',
        q: 'Как сохранить реактивность при provide/inject и как его типизировать?',
        level: 'middle',
        keys: ['передавать ref/reactive, а не .value', 'изменения — через функции из провайдера, readonly для данных', 'InjectionKey<T> на Symbol даёт тип', 'inject может вернуть undefined — дефолт или проверка'],
        a: 'Реактивность сохраняется, если в provide передать сам ref или reactive-объект, а не его значение. Чтобы потомки не меняли состояние как попало, отдаю readonly-версию и отдельно функции для изменений — так мутации остаются в одном месте. Для типов создаю ключ как Symbol с типом InjectionKey<T>, тогда inject вернёт T | undefined. Undefined обрабатываю дефолтом вторым аргументом или явной ошибкой, если компонент без провайдера не имеет смысла.'
      },
      {
        id: 'vue-provide-inject-q2',
        q: 'Когда provide/inject, а когда Pinia?',
        level: 'middle',
        keys: ['provide/inject — контекст поддерева, может быть несколько экземпляров', 'Pinia — глобальное состояние приложения', 'Pinia даёт devtools, SSR-сериализацию, плагины', 'provide/inject — для составных компонентов и библиотек'],
        a: 'provide/inject привязан к дереву компонентов: у двух форм на странице будет два разных контекста, и это как раз то, что нужно для составных компонентов вроде Tabs или Form. Pinia — один глобальный экземпляр на приложение с devtools, сериализацией для SSR и плагинами, туда кладу бизнес-данные: пользователя, корзину. Если состояние нужно в разных ветках дерева, это стор, если только внутри одного поддерева — provide/inject.'
      }
    ]
  },
  {
    id: 'vue-dynamic-components',
    section: 'vue',
    group: 'Основы',
    title: 'Динамические компоненты',
    level: 'middle',
    summary: '<component :is> рендерит компонент, выбранный в рантайме; сами компоненты в состоянии хранят без реактивности',
    what: '<component :is="..."> рендерит компонент, переданный объектом или зарегистрированным именем, а также нативный тег строкой. При смене is старый компонент размонтируется, новый монтируется, если не обёрнуто в KeepAlive.',
    why: 'Позволяет выбирать компонент по данным: вкладки, шаги мастера, виджеты из конфига, блоки CMS, полиморфная кнопка, которая бывает a или button.',
    when: 'Когда набор компонентов определяется данными или конфигом. Если вариантов два-три и они фиксированы, v-if/v-else читается проще.',
    diff: 'v-if/v-else описывает варианты явно в шаблоне, :is — по данным. Объект компонента нельзя делать глубоко реактивным: Vue предупредит, а Proxy над компонентом — лишняя работа. Поэтому в ref/reactive компоненты оборачивают в markRaw или хранят в shallowRef.',
    code: [
      { title: 'Вкладки с shallowRef', lang: 'vue', src: `<script setup lang="ts">
import { shallowRef } from 'vue'
import TabProfile from './TabProfile.vue'
import TabOrders from './TabOrders.vue'

const tabs = { profile: TabProfile, orders: TabOrders }
const current = shallowRef(TabProfile)
</script>

<template>
  <button v-for="(c, name) in tabs" :key="name" @click="current = c">
    {{ name }}
  </button>
  <component :is="current" />
</template>` },
      { title: 'Блоки из CMS с markRaw', lang: 'ts', src: `import { reactive, markRaw, defineAsyncComponent } from 'vue'

const registry = {
  hero: markRaw(defineAsyncComponent(() => import('./blocks/Hero.vue'))),
  gallery: markRaw(defineAsyncComponent(() => import('./blocks/Gallery.vue')))
}

const page = reactive({
  blocks: [{ type: 'hero', props: { title: 'Привет' } }]
})
// в шаблоне: <component :is="registry[b.type]" v-bind="b.props" />` }
    ],
    real: 'Конструктор лендингов: страница приходит из CMS как массив блоков с type и props. Компонент-рендерер по type выбирает компонент из реестра и рендерит его через <component :is>, а сами блоки грузятся лениво.',
    pitfalls: [
      'Хранить компоненты в ref или reactive — Vue сделает Proxy над объектом компонента и выдаст предупреждение.',
      'Ожидать, что состояние вкладки сохранится при переключении без KeepAlive.',
      'Передавать в :is строку с именем компонента, который не зарегистрирован глобально, в <script setup> — нужно передавать сам объект.'
    ],
    questions: [
      {
        id: 'vue-dynamic-components-q1',
        q: 'Как работает <component :is> и почему компоненты хранят в shallowRef или markRaw?',
        level: 'middle',
        keys: [':is принимает объект компонента, имя или тег', 'при смене компонент пересоздаётся', 'объект компонента не должен быть реактивным', 'shallowRef отслеживает только замену, markRaw запрещает Proxy'],
        a: '<component :is> рендерит то, что передано: объект компонента, имя зарегистрированного компонента или нативный тег. При смене значения старый экземпляр уничтожается, новый создаётся, состояние теряется, если нет KeepAlive. Сам объект компонента — это статическое описание, следить за его полями незачем, и Vue прямо предупреждает, если сделать его реактивным. Поэтому текущий компонент храню в shallowRef, а если он лежит внутри reactive-структуры, оборачиваю в markRaw.'
      },
      {
        id: 'vue-dynamic-components-q2',
        q: 'Как бы вы сделали полиморфный компонент кнопки, который рендерится как a, RouterLink или button?',
        level: 'middle+',
        keys: ['проп as / tag + <component :is>', 'computed выбирает тег по пропсам (href, to)', 'атрибуты пробрасываются через $attrs', 'для button — type, для ссылки — без него'],
        a: 'Делаю один компонент с <component :is> и computed, который выбирает, что рендерить: если есть to — RouterLink, если href — a, иначе button. Всё остальное пробрасывается через атрибуты, по умолчанию они и так попадают на корень. Для button добавляю type="button", чтобы кнопка в форме случайно не сабмитила её. Так у дизайн-системы одна кнопка со стилями, а семантика правильная в каждом месте.'
      }
    ]
  },
  {
    id: 'vue-teleport',
    section: 'vue',
    group: 'Основы',
    title: 'Teleport',
    level: 'middle',
    summary: 'Рендерит часть шаблона в другом месте DOM, оставляя её в дереве компонентов',
    what: '<Teleport to="body"> переносит содержимое в указанный DOM-узел, но логически это всё ещё дочерняя часть компонента: пропсы, события, provide/inject работают как обычно. Есть disabled, чтобы рендерить на месте, и с Vue 3.5 — defer, чтобы искать цель после монтирования остального.',
    why: 'Модалки, тосты, тултипы и дропдауны внутри контейнера с overflow: hidden или transform ломаются: их обрезает, z-index не помогает. Teleport выносит их в body.',
    when: 'Для всего, что визуально должно быть поверх страницы: модалки, уведомления, контекстные меню. Не нужен для обычного контента.',
    diff: 'В отличие от ручного appendChild, Teleport управляется Vue: реактивность, удаление при размонтировании, связь с родителем. Похоже на порталы в React.',
    code: [
      { title: 'Модалка в body', lang: 'vue', src: `<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="overlay" @click.self="open = false">
      <div class="modal" role="dialog" aria-modal="true">
        <slot />
        <button @click="open = false">Закрыть</button>
      </div>
    </div>
  </Teleport>
</template>` },
      { title: 'Отключение на мобильных', lang: 'vue', src: `<Teleport to="#sidebar" :disabled="isMobile">
  <FiltersPanel />
</Teleport>

<!-- Vue 3.5: цель рендерится в этом же цикле позже -->
<Teleport defer to="#late-container">...</Teleport>` }
    ],
    real: 'Выпадающее меню в строке таблицы с overflow: auto обрезалось краем таблицы. Перенос меню через Teleport в body и позиционирование через floating-ui решили проблему без изменения вёрстки таблицы.',
    pitfalls: [
      'Указывать в to узел, которого ещё нет в DOM на момент монтирования — Vue выдаст предупреждение (с 3.5 помогает defer).',
      'Забывать, что в SSR телепорты рендерятся отдельно и цель вроде body требует особой обработки при гидрации; в Nuxt для этого есть #teleports.',
      'Считать, что CSS scoped родителя не сработает — классы scoped применяются, но наследуемые стили и контекст позиционирования будут от нового места.'
    ],
    questions: [
      {
        id: 'vue-teleport-q1',
        q: 'Зачем нужен Teleport и что происходит с событиями и provide/inject у телепортированного контента?',
        level: 'middle',
        keys: ['перенос в другой узел DOM, например body', 'решает overflow hidden, stacking context, z-index', 'в дереве компонентов остаётся на месте', 'пропсы, emit, inject работают как раньше'],
        a: 'Teleport физически переносит разметку в другой узел DOM, обычно в body. Это нужно для модалок и выпадашек, которые иначе обрежет overflow: hidden или перекроет из-за stacking context родителя с transform. При этом в дереве компонентов контент остаётся там же: он получает пропсы, эмитит события и видит provide родителя. Меняется только расположение в DOM, поэтому нативные DOM-события всплывают уже по новому месту.'
      },
      {
        id: 'vue-teleport-q2',
        q: 'Что делает disabled и defer у Teleport?',
        level: 'middle+',
        keys: ['disabled — рендерить на месте, без переноса', 'можно переключать реактивно, например по брейкпоинту', 'defer (3.5) — искать цель после монтирования текущего цикла', 'нужен, когда целевой узел рендерится тем же Vue-приложением позже'],
        a: 'disabled отключает перенос, и контент рендерится там, где написан. Это удобно, например, для фильтров, которые на десктопе в сайдбаре, а на мобильном прямо в потоке. defer появился в 3.5: Teleport ищет цель не сразу, а после того, как смонтирована остальная часть приложения в этом цикле. Это решает случай, когда целевой контейнер рендерит тот же Vue, но ниже по дереву.'
      }
    ]
  },
  {
    id: 'vue-keepalive',
    section: 'vue',
    group: 'Основы',
    title: 'KeepAlive',
    level: 'middle',
    summary: 'Кеширует экземпляры динамических компонентов, чтобы при переключении не терять состояние',
    what: '<KeepAlive> оборачивает динамический компонент или RouterView и не уничтожает компоненты при переключении, а деактивирует их. include и exclude фильтруют по имени компонента, max ограничивает кеш (выкидывается давно неиспользованный). У закешированных компонентов вызываются onActivated и onDeactivated.',
    why: 'Сохраняет заполненную форму, позицию скролла, загруженные данные во вкладках и при возврате назад по маршрутам. Экономит повторные запросы и монтирование.',
    when: 'Вкладки с формами, список и карточка, где возврат к списку должен сохранить фильтры. Не стоит кешировать всё подряд — растёт память и появляются устаревшие данные.',
    diff: 'v-show тоже сохраняет состояние, но держит DOM в документе всегда. KeepAlive убирает DOM из документа, но хранит экземпляр. Без KeepAlive :is и RouterView пересоздают компонент.',
    code: [
      { title: 'Кеш маршрутов', lang: 'vue', src: `<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive :include="['ProductList', 'OrderForm']" :max="5">
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>` },
      { title: 'Обновление при возврате', lang: 'vue', src: `<script setup lang="ts">
import { onActivated, onDeactivated } from 'vue'

defineOptions({ name: 'ProductList' }) // для include

onActivated(() => {
  // вызывается и при первом монтировании, и при возврате
  refreshIfStale()
  window.addEventListener('scroll', onScroll)
})

onDeactivated(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>` }
    ],
    real: 'В интернет-магазине пользователь листает каталог, применяет фильтры, открывает товар и жмёт «назад». С KeepAlive на странице каталога фильтры, загруженные страницы и скролл на месте, а в onActivated каталог тихо обновляет остатки.',
    pitfalls: [
      'include по имени не срабатывает, потому что у компонента нет имени — в <script setup> имя берётся из имени файла или задаётся через defineOptions.',
      'Подписки, повешенные в onMounted, продолжают работать, пока компонент неактивен — их надо снимать в onDeactivated.',
      'Кешировать без max — при большом числе вариантов память растёт.',
      'Показывать устаревшие данные после возврата, не обновляя их в onActivated.'
    ],
    questions: [
      {
        id: 'vue-keepalive-q1',
        q: 'Как работает KeepAlive и какие хуки появляются у закешированного компонента?',
        level: 'middle',
        keys: ['не уничтожает компонент, а деактивирует', 'include/exclude по имени, max с вытеснением давно неиспользованного', 'onActivated — при монтировании и возврате', 'onDeactivated — при уходе, unmount не вызывается'],
        a: 'KeepAlive при переключении не размонтирует компонент, а убирает его DOM из документа и держит экземпляр в кеше. include и exclude фильтруют по имени компонента, max ограничивает размер кеша — при переполнении выкидывается тот, что дольше всех не использовался. Вместо mounted/unmounted при переключении вызываются onActivated и onDeactivated, причём onActivated срабатывает и при первом монтировании. В них удобно обновлять данные и снимать глобальные слушатели.'
      },
      {
        id: 'vue-keepalive-q2',
        q: 'Чем KeepAlive отличается от v-show?',
        level: 'middle',
        keys: ['v-show держит DOM в документе, переключает display', 'KeepAlive убирает DOM, хранит экземпляр', 'KeepAlive работает с динамическими компонентами и маршрутами', 'v-show рендерит всё сразу'],
        a: 'v-show рендерит элемент сразу и просто прячет его через display: none, DOM остаётся в документе и участвует в селекторах и обновлениях. KeepAlive работает с динамическими компонентами и роутами: неактивный компонент убирается из документа, но экземпляр и его состояние живут в памяти. v-show подходит для частого переключения пары блоков, KeepAlive — для вкладок и страниц, где нужно сохранить состояние и не рендерить всё заранее.'
      }
    ]
  },
  {
    id: 'vue-composables',
    section: 'vue',
    group: 'Архитектура',
    title: 'Composables',
    level: 'middle',
    summary: 'Функции useXxx, которые инкапсулируют реактивное состояние и логику для переиспользования между компонентами',
    what: 'Composable — обычная функция, внутри которой используются ref, computed, watch и хуки жизненного цикла. Она возвращает реактивное состояние и функции. По соглашению называется useЧтоТо и вызывается синхронно в setup.',
    why: 'Выносят логику из компонентов: загрузку данных, работу с формой, подписку на события окна, пагинацию. Компонент становится тоньше, логику можно тестировать отдельно.',
    when: 'Когда одна и та же логика с состоянием нужна в нескольких местах или когда компонент разросся и в нём выделяются независимые куски. Чистые функции без реактивности делать composable не нужно — это просто утилиты.',
    diff: 'В отличие от миксинов, у composable явный вход и выход, нет конфликтов имён и видно, откуда пришла переменная. В отличие от стора, каждый вызов создаёт своё состояние, если не вынести его за пределы функции.',
    code: [
      { title: 'useFetch с отменой', lang: 'ts', src: `import { ref, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  watchEffect(async (onCleanup) => {
    const ctrl = new AbortController()
    onCleanup(() => ctrl.abort())
    loading.value = true
    error.value = null
    try {
      const res = await fetch(toValue(url), { signal: ctrl.signal })
      data.value = await res.json()
    } catch (e) {
      if (!ctrl.signal.aborted) error.value = e as Error
    } finally {
      loading.value = false
    }
  })

  return { data, error, loading }
}` },
      { title: 'Использование', lang: 'vue', src: `<script setup lang="ts">
const { id } = defineProps<{ id: number }>()

const { data: user, loading } = useFetch<User>(() => '/api/users/' + id)
</script>` }
    ],
    real: 'useEventListener, usePagination, useDebouncedRef, usePermissions — типичный набор composables в любом проекте. Многое из этого уже есть в VueUse, и в проекте часто дописывают только доменные: useCart, useOrderForm.',
    pitfalls: [
      'Вызывать composable условно, асинхронно или после await — хуки и вотчеры внутри не привяжутся к компоненту.',
      'Возвращать reactive-объект — потребитель деструктурирует его и потеряет реактивность; лучше возвращать объект из ref.',
      'Принимать только сырое значение вместо MaybeRefOrGetter — composable не реагирует на изменение аргумента.',
      'Не снимать слушатели и таймеры в onUnmounted внутри composable.'
    ],
    questions: [
      {
        id: 'vue-composables-q1',
        q: 'Что такое composable и как правильно его писать?',
        level: 'middle',
        keys: ['функция useXxx с реактивным состоянием и логикой', 'вызывается синхронно в setup', 'возвращает объект из ref, чтобы можно было деструктурировать', 'аргументы принимает как MaybeRefOrGetter и читает через toValue', 'сама убирает за собой в onUnmounted/onCleanup'],
        a: 'Composable — это функция, которая использует Composition API и возвращает состояние и методы. Вызываю её синхронно в setup, иначе хуки и вотчеры внутри не привяжутся к компоненту. Возвращаю обычный объект из ref, чтобы его можно было деструктурировать без потери реактивности. Аргументы принимаю как MaybeRefOrGetter и читаю через toValue внутри watch или watchEffect — тогда composable реагирует на смену параметров. И всё, что composable подписал, он сам же снимает при размонтировании.'
      },
      {
        id: 'vue-composables-q2',
        q: 'Как сделать composable с общим состоянием на всё приложение и чем это рискованно?',
        level: 'middle+',
        keys: ['вынести ref за пределы функции — синглтон модуля', 'в SSR состояние модуля общее между запросами', 'утечка данных между пользователями', 'для общего состояния лучше Pinia или useState в Nuxt'],
        a: 'Если объявить ref на уровне модуля, а не внутри функции, все вызовы будут делить одно состояние — получается мини-стор. В SPA это работает, но в SSR модуль живёт на сервере между запросами, и данные одного пользователя могут попасть к другому. Поэтому для глобального состояния я беру Pinia или useState в Nuxt, которые создают состояние на каждый запрос, а модульный синглтон оставляю для чисто клиентских вещей.'
      }
    ]
  },
  {
    id: 'vue-mixins',
    section: 'vue',
    group: 'Архитектура',
    title: 'Миксины',
    level: 'middle',
    summary: 'Способ переиспользования в Options API: опции миксина сливаются с компонентом; в Vue 3 их заменили composables',
    what: 'Миксин — объект с опциями компонента (data, methods, хуки), который подмешивается в компонент через mixins: [...]. Опции сливаются: data и methods объединяются, при конфликте побеждает компонент, хуки вызываются все по очереди.',
    why: 'В Vue 2 это был основной способ переиспользовать логику между компонентами. Сейчас в основном встречается в легаси-коде и миграциях.',
    when: 'В новом коде не использовать. При работе с легаси — понимать, как они сливаются, и постепенно переносить логику в composables.',
    diff: 'Composable вызывается явно и возвращает именованные значения: видно, откуда что пришло, можно переименовать при деструктуризации, можно передать параметры. Миксин неявно добавляет поля в this, конфликтует по именам и может зависеть от полей другого миксина.',
    code: [
      { title: 'Миксин и его проблемы', lang: 'ts', src: `// paginationMixin.ts
export default {
  data() {
    return { page: 1, loading: false }
  },
  methods: {
    async load() {
      this.loading = true
      // неявно ждёт, что в компоненте есть this.fetchPage
      this.items = await this.fetchPage(this.page)
      this.loading = false
    }
  }
}
// в компоненте: mixins: [paginationMixin, filtersMixin]
// откуда взялся this.loading? а если filtersMixin тоже его объявляет?` },
      { title: 'То же как composable', lang: 'ts', src: `export function usePagination<T>(fetchPage: (p: number) => Promise<T[]>) {
  const page = ref(1)
  const items = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)

  async function load() {
    loading.value = true
    items.value = await fetchPage(page.value)
    loading.value = false
  }

  return { page, items, loading, load }
}

// const { loading: listLoading, load } = usePagination(api.getOrders)` }
    ],
    real: 'При миграции проекта с Vue 2 на Vue 3 миксины authMixin, formMixin и tableMixin постепенно переводят в composables: сначала добавляют composable, затем меняют компоненты по одному, а миксин удаляют последним.',
    pitfalls: [
      'Два миксина объявляют одно поле — тихо побеждает одно из них, баг ищется долго.',
      'Миксин неявно зависит от поля компонента или другого миксина — сломать можно, просто переименовав метод.',
      'Глобальный миксин через app.mixin влияет на все компоненты, включая сторонние.'
    ],
    questions: [
      {
        id: 'vue-mixins-q1',
        q: 'Почему от миксинов отказались в пользу composables?',
        level: 'middle',
        keys: ['неявный источник свойств в this', 'конфликты имён при слиянии', 'неявные зависимости между миксинами и компонентом', 'composable — явный вызов, параметры, переименование, типизация'],
        a: 'У миксинов три главные проблемы. Непонятно, откуда в this взялось свойство, если миксинов несколько. Имена конфликтуют, и при слиянии одно тихо перезаписывает другое. И миксины часто неявно зависят от полей компонента или друг друга. Composable вызывается явно, принимает параметры, возвращает именованные значения, которые можно переименовать при деструктуризации, и нормально типизируется.'
      },
      {
        id: 'vue-mixins-q2',
        q: 'Как сливаются опции миксина и компонента?',
        level: 'middle',
        keys: ['data сливается рекурсивно, при конфликте приоритет у компонента', 'methods/computed — побеждает компонент', 'хуки вызываются все, сначала миксина, потом компонента', 'watch тоже объединяется'],
        a: 'data сливается как объект, и при совпадении ключей приоритет у компонента. С methods и computed то же самое: метод компонента перекрывает метод миксина. Хуки жизненного цикла не перекрываются, а объединяются в массив: сначала вызывается хук миксина, потом компонента. Вотчеры на одно поле тоже срабатывают оба. Из-за этих правил поведение компонента с несколькими миксинами сложно предсказать.'
      }
    ]
  },
  {
    id: 'vue-pinia',
    section: 'vue',
    group: 'Архитектура',
    title: 'Pinia',
    level: 'middle',
    summary: 'Официальный стор Vue: state, getters, actions, devtools, SSR и типизация без лишнего кода',
    what: 'Pinia — библиотека глобального состояния. Стор создаётся через defineStore в двух стилях: options (state, getters, actions) и setup (функция с ref, computed и функциями). Сторы модульные, без мутаций и вложенных модулей, как во Vuex.',
    why: 'Хранит общее для приложения состояние: пользователь, корзина, настройки. Даёт devtools с историей изменений, поддержку SSR, HMR и плагины.',
    when: 'Когда состояние нужно в нескольких несвязанных частях приложения или должно переживать навигацию. Локальное состояние компонента и данные одного поддерева в стор не тащат.',
    diff: 'Во Vuex были mutations, actions и модули с namespace, слабые типы. В Pinia мутаций нет, состояние меняют напрямую или в actions, каждый стор — отдельный модуль, типы выводятся сами. Setup-стор гибче (можно использовать composables и watch), options-стор проще и имеет встроенный $reset.',
    code: [
      { title: 'Setup-стор', lang: 'ts', src: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const total = computed(() =>
    items.value.reduce((s, i) => s + i.price * i.qty, 0)
  )

  async function add(productId: number) {
    const item = await api.addToCart(productId)
    items.value.push(item)
  }

  // всё состояние нужно вернуть — иначе не будет SSR и devtools
  return { items, total, add }
})` },
      { title: 'storeToRefs в компоненте', lang: 'vue', src: `<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const { items, total } = storeToRefs(cart) // state и getters
const { add } = cart                       // actions — напрямую
</script>` },
      { title: 'Плагин', lang: 'ts', src: `const pinia = createPinia()

pinia.use(({ store }) => {
  store.$subscribe((mutation, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state))
  })
})` }
    ],
    real: 'Стор auth хранит пользователя и токен, стор cart — корзину с синхронизацией в localStorage через плагин. Компоненты шапки, корзины и оформления заказа читают одни и те же данные без пробрасывания пропсов.',
    pitfalls: [
      'Деструктурировать стор напрямую (const { total } = useCartStore()) — реактивность теряется, нужен storeToRefs.',
      'Не возвращать часть state из setup-стора — она не попадёт в devtools и не сериализуется при SSR.',
      'Использовать стор вне setup до установки pinia (в модуле на верхнем уровне) — ошибка «getActivePinia was called with no active Pinia».',
      'Складывать в стор всё подряд, включая локальное состояние формы одного компонента.'
    ],
    questions: [
      {
        id: 'vue-pinia-q1',
        q: 'Чем setup-стор отличается от options-стора в Pinia?',
        level: 'middle',
        keys: ['options: state, getters, actions как в Options API', 'setup: ref = state, computed = getters, функции = actions', 'в setup можно использовать composables и watch', '$reset есть из коробки только у options-стора', 'в setup-сторе нужно вернуть всё состояние'],
        a: 'Options-стор описывается объектом с state, getters и actions — привычно для тех, кто пришёл из Vuex, и у него из коробки есть $reset. Setup-стор — это функция, как setup компонента: ref становятся state, computed — getters, функции — actions. Он гибче: внутри можно использовать composables, watch, inject. Нюанс в том, что надо вернуть всё состояние, иначе оно не попадёт в devtools и сериализацию при SSR, а $reset придётся писать самому.'
      },
      {
        id: 'vue-pinia-q2',
        q: 'Зачем нужен storeToRefs?',
        level: 'middle',
        keys: ['стор — reactive-объект, деструктуризация рвёт связь', 'storeToRefs превращает state и getters в ref', 'actions берутся из стора напрямую', 'toRefs на сторе захватил бы лишнее'],
        a: 'Стор в Pinia — это reactive-объект, и если его деструктурировать, получишь значения на момент деструктуризации. storeToRefs превращает state и getters в ref, связанные со стором, и их можно спокойно разбирать. Actions — обычные функции, они берутся из стора напрямую. Обычный toRefs тут хуже: он обернул бы в ref вообще всё, включая служебные поля и методы.'
      },
      {
        id: 'vue-pinia-q3',
        q: 'Что можно сделать плагином Pinia?',
        level: 'middle+',
        keys: ['функция, вызываемая для каждого стора', 'добавить свойства и методы всем сторам', 'подписаться на $subscribe и $onAction', 'пример: persist в localStorage, логирование, сброс'],
        a: 'Плагин — это функция, которую pinia.use вызывает для каждого создаваемого стора, она получает store, app, options. В ней можно добавить всем сторам общие свойства, подписаться на изменения состояния через $subscribe или на вызовы actions через $onAction. Типичные примеры — сохранение состояния в localStorage, логирование действий, отправка ошибок actions в мониторинг. Для persist обычно берут готовый pinia-plugin-persistedstate.'
      }
    ]
  },
  {
    id: 'vue-state',
    section: 'vue',
    group: 'Архитектура',
    title: 'Управление состоянием',
    level: 'middle+',
    summary: 'Состояние живёт на минимально нужном уровне: компонент, поддерево, стор или кеш серверных данных',
    what: 'Состояние в Vue-приложении бывает разных видов: локальное в компоненте, общее для поддерева (provide/inject), глобальное клиентское (Pinia), серверное (данные из API с кешем) и состояние в URL (фильтры, пагинация). У каждого вида свой лучший инструмент.',
    why: 'Если всё складывать в глобальный стор, появляются устаревшие данные, ручная инвалидация и связность между несвязанными экранами. Правильное размещение упрощает код и уменьшает баги синхронизации.',
    when: 'Начинать с локального состояния и поднимать выше, только когда появляется второй потребитель. Данные с сервера — через слой запросов с кешем (TanStack Query, useAsyncData в Nuxt), а не руками в сторе.',
    diff: 'Клиентское состояние принадлежит приложению: открыт ли сайдбар, корзина до оформления. Серверное — это копия чужих данных, которая устаревает: ему нужны кеш, повторные запросы, инвалидация, дедупликация. URL-состояние переживает перезагрузку и шарится ссылкой.',
    code: [
      { title: 'Серверное состояние через TanStack Query', lang: 'ts', src: `import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

export function useOrders(status: Ref<string>) {
  return useQuery({
    queryKey: ['orders', status],
    queryFn: () => api.getOrders(status.value),
    staleTime: 30_000
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.cancelOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] })
  })
}` },
      { title: 'Состояние фильтров в URL', lang: 'ts', src: `import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useQueryParam(name: string, fallback = '') {
  const route = useRoute()
  const router = useRouter()
  return computed({
    get: () => (route.query[name] as string) ?? fallback,
    set: (v) => router.replace({ query: { ...route.query, [name]: v || undefined } })
  })
}` }
    ],
    real: 'В админке список заказов сначала хранили в Pinia и вручную перезагружали после каждой операции. После переноса в TanStack Query с инвалидацией по ключу пропали устаревшие данные на соседних вкладках, а стор остался только для пользователя и настроек интерфейса.',
    pitfalls: [
      'Складывать ответы API в глобальный стор без стратегии инвалидации — устаревшие данные и ручные перезапросы повсюду.',
      'Дублировать одно и то же состояние в двух местах (в сторе и локально) — они расходятся.',
      'Хранить производные данные отдельно вместо computed.',
      'Держать фильтры и пагинацию только в памяти — пользователь не может поделиться ссылкой, а после перезагрузки всё сбрасывается.'
    ],
    questions: [
      {
        id: 'vue-state-q1',
        q: 'Как вы решаете, где хранить состояние во Vue-приложении?',
        level: 'middle+',
        keys: ['начинать с локального, поднимать при втором потребителе', 'поддерево — provide/inject', 'глобальное клиентское — Pinia', 'серверные данные — слой запросов с кешем', 'фильтры и пагинация — в URL'],
        a: 'Я держу состояние на минимально нужном уровне. Если оно нужно одному компоненту, это ref внутри. Если нескольким в одном поддереве — props или provide/inject. Если оно глобальное и клиентское, вроде пользователя или корзины, — Pinia. Данные с сервера отдельно: им нужен кеш, дедупликация и инвалидация, поэтому TanStack Query или useAsyncData в Nuxt. А фильтры и номер страницы кладу в URL, чтобы ссылкой можно было поделиться.'
      },
      {
        id: 'vue-state-q2',
        q: 'Чем серверное состояние отличается от клиентского и почему его не стоит просто класть в Pinia?',
        level: 'middle+',
        keys: ['серверные данные — копия, которая устаревает', 'нужны кеш, повторный запрос, дедупликация, инвалидация', 'в сторе это всё приходится писать руками', 'библиотеки запросов дают это из коробки'],
        a: 'Клиентское состояние принадлежит нам, оно меняется только тогда, когда мы его меняем. Серверное — это снимок данных, которые в любой момент могут измениться на сервере, и у него свои задачи: кешировать по параметрам, не делать два одинаковых запроса, обновлять после мутаций, перезапрашивать при возврате на вкладку. В Pinia всё это приходится писать руками, и обычно получается хуже. Поэтому серверные данные отдаю библиотеке запросов, а в сторе оставляю чистое клиентское состояние.'
      }
    ]
  },
  {
    id: 'vue-separation',
    section: 'vue',
    group: 'Архитектура',
    title: 'Разделение ответственности',
    level: 'middle+',
    summary: 'Компоненты отображают, composables и сервисы держат логику, API-слой изолирует сеть',
    what: 'Разделение ответственности — когда у каждой части кода одна причина меняться. Во Vue это обычно слои: презентационные компоненты (props in, events out), контейнеры (подключают данные и логику), composables (реактивная логика), сервисы и API-слой (запросы, преобразования, чистая бизнес-логика).',
    why: 'Компоненты становятся тонкими и переиспользуемыми, логику можно тестировать без монтирования, а смена API или UI-кита затрагивает одно место.',
    when: 'Как только компонент делает больше одного: ходит в API, валидирует, считает цены и рисует. Для маленьких экранов строгое деление на контейнер и представление может быть избыточным.',
    diff: 'Презентационный компонент не знает, откуда данные, — только props и emits. Контейнер знает про сторы и API, но почти не содержит разметки. SOLID во Vue проявляется так: S — компонент делает одно, O — расширение через слоты и пропсы, а не правку, D — компонент зависит от composable или интерфейса, а не от конкретного fetch.',
    code: [
      { title: 'Слои', lang: 'ts', src: `// api/orders.ts — только сеть и маппинг
export const ordersApi = {
  async list(params: OrderFilter): Promise<Order[]> {
    const dto = await http.get<OrderDto[]>('/orders', { params })
    return dto.map(toOrder)
  }
}

// domain/orders.ts — чистая логика, легко тестировать
export const canCancel = (o: Order) =>
  o.status === 'new' && Date.now() - o.createdAt < 3_600_000

// composables/useOrders.ts — реактивность и связка
export function useOrders(filter: Ref<OrderFilter>) {
  const orders = ref<Order[]>([])
  watch(filter, async (f) => { orders.value = await ordersApi.list(f) },
    { immediate: true, deep: true })
  return { orders }
}` },
      { title: 'Контейнер и презентационный компонент', lang: 'vue', src: `<!-- OrdersPage.vue: контейнер -->
<script setup lang="ts">
const filter = ref<OrderFilter>({ status: 'new' })
const { orders } = useOrders(filter)
</script>

<template>
  <OrderFilters v-model="filter" />
  <OrderTable :orders="orders" @cancel="cancelOrder" />
</template>

<!-- OrderTable.vue: только props и emits, без API и сторов -->` }
    ],
    real: 'Компонент оформления заказа на 800 строк разбили: расчёт доставки и скидок ушёл в чистые функции с юнит-тестами, работа с API — в сервис, состояние шагов — в composable. Сам компонент стал списком из пяти дочерних шагов, а баги со скидками стали ловиться тестами.',
    pitfalls: [
      'Вызывать API прямо из UI-компонентов кнопок и таблиц — их нельзя переиспользовать и тестировать.',
      'Делать «сервисы», которые на самом деле дергают стор и роутер — логика опять завязана на фреймворк.',
      'Слепо дробить всё на контейнеры и представления в маленьких компонентах — лишние файлы без пользы.',
      'Протаскивать DTO с сервера прямо в шаблоны — любое изменение API ломает UI в десятке мест.'
    ],
    questions: [
      {
        id: 'vue-separation-q1',
        q: 'Как вы разделяете ответственность в Vue-приложении?',
        level: 'middle+',
        keys: ['презентационные компоненты: props и emits', 'контейнеры собирают данные и логику', 'composables — реактивная логика', 'сервисы/API — сеть и маппинг DTO', 'чистые функции для бизнес-правил, тестируются отдельно'],
        a: 'Я раскладываю код по слоям. Внизу API-слой: запросы и преобразование DTO в доменные модели, чтобы изменения бэкенда не протекали в шаблоны. Бизнес-правила — чистые функции, их удобно тестировать. Реактивная связка — в composables. Страница или контейнер соединяет composables и сторы и передаёт данные в презентационные компоненты, которые знают только свои props и emits. Так UI-компоненты переиспользуются, а логика тестируется без монтирования.'
      },
      {
        id: 'vue-separation-q2',
        q: 'Как принципы SOLID применяются к Vue-компонентам?',
        level: 'senior',
        keys: ['S — у компонента одна задача, большие дробятся', 'O — расширение через слоты и пропсы без правки исходника', 'L/I — узкий и предсказуемый API компонента, не огромный объект в props', 'D — зависеть от composable/интерфейса, инъекция через provide'],
        a: 'Single responsibility — компонент или рисует, или управляет данными, а не всё сразу. Open/closed — хороший компонент расширяется слотами и пропсами, чтобы новые варианты не требовали правки исходника. Interface segregation — передавать компоненту только нужные поля, а не весь объект заказа. Dependency inversion — компонент зависит от composable или от интерфейса, внедрённого через provide, а не от конкретного HTTP-клиента; так его проще тестировать и подменять реализацию.'
      }
    ]
  },
  {
    id: 'vue-reusable',
    section: 'vue',
    group: 'Архитектура',
    title: 'Переиспользуемые компоненты',
    level: 'middle+',
    summary: 'Хороший переиспользуемый компонент — с маленьким продуманным API, слотами для разметки и прозрачными атрибутами',
    what: 'Переиспользуемый компонент — это компонент с понятным контрактом: props для данных и настроек, emits для событий, slots для разметки, v-model для редактируемых значений. Атрибуты, не объявленные как props (class, id, aria-*, обработчики), по умолчанию падают на корневой элемент — это fallthrough attrs.',
    why: 'Дизайн-система и UI-кит экономят время и делают интерфейс единообразным, но только если компоненты не нужно форкать под каждый случай.',
    when: 'Выносить в общий компонент, когда паттерн повторился 2–3 раза. Делать универсальный «комбайн» с сорока пропсами заранее не стоит.',
    diff: 'Props хороши для данных и вариантов (size, variant), слоты — для произвольной разметки. inheritAttrs: false нужен, когда атрибуты должны попасть не на корень, а на внутренний элемент, например на input внутри обёртки. useAttrs даёт доступ к $attrs в script setup.',
    code: [
      { title: 'Инпут с атрибутами на нужном элементе', lang: 'vue', src: `<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const model = defineModel<string>()
defineProps<{ label: string; error?: string }>()
</script>

<template>
  <label class="field" :class="{ 'field--error': error }">
    <span>{{ label }}</span>
    <!-- placeholder, maxlength, autocomplete, @blur — сюда -->
    <input v-model="model" v-bind="$attrs" />
    <small v-if="error">{{ error }}</small>
  </label>
</template>` },
      { title: 'Пропсы для вариантов, слоты для разметки', lang: 'vue', src: `<BaseButton variant="primary" size="sm" :loading="saving">
  <template #icon><IconSave /></template>
  Сохранить
</BaseButton>` }
    ],
    real: 'Компонент BaseInput с inheritAttrs: false позволяет писать <BaseInput label="Email" type="email" autocomplete="email" @blur="validate" /> — все нативные атрибуты попадают на input, а не на обёртку label, и не нужно объявлять каждый из них пропсом.',
    pitfalls: [
      'Объявлять пропсом каждый нативный атрибут (placeholder, maxlength, name) вместо проброса через $attrs.',
      'Компонент с несколькими корневыми элементами без явного v-bind="$attrs" — Vue предупредит, что атрибуты некуда деть.',
      'Булевы флаги на каждый вариант (isPrimary, isDanger, isGhost) вместо одного пропа variant с union-типом.',
      'Жёстко зашитые тексты и разметка внутри — компонент приходится копировать, а не переиспользовать.'
    ],
    questions: [
      {
        id: 'vue-reusable-q1',
        q: 'Что такое fallthrough-атрибуты и когда нужен inheritAttrs: false?',
        level: 'middle',
        keys: ['атрибуты и слушатели, не объявленные как props/emits', 'по умолчанию падают на корневой элемент', 'class и style сливаются', 'inheritAttrs: false + v-bind="$attrs" на нужный элемент', 'у нескольких корней нужно привязать явно'],
        a: 'Всё, что передали компоненту, но он не объявил в props или emits — class, style, id, aria-атрибуты, слушатели, — Vue автоматически вешает на корневой элемент, а class и style сливаются с собственными. Это удобно, пока корень и есть главный элемент. В обёртке над input корень — label, а атрибуты нужны на input, поэтому ставлю inheritAttrs: false и вручную пишу v-bind="$attrs" на input. При нескольких корневых элементах это нужно делать всегда, иначе Vue предупредит.'
      },
      {
        id: 'vue-reusable-q2',
        q: 'Как вы проектируете API переиспользуемого компонента?',
        level: 'middle+',
        keys: ['минимум пропсов, варианты через union-типы', 'слоты для разметки вместо пропсов-строк', 'v-model для редактируемых значений', 'проброс нативных атрибутов', 'разумные значения по умолчанию'],
        a: 'Начинаю с того, как компонент будут использовать, и стараюсь, чтобы простой случай укладывался в одну строку. Варианты делаю одним пропом с union-типом вроде variant: "primary" | "ghost", а не набором булевых флагов. Всё, что связано с разметкой, — слоты, а не пропсы с HTML. Если компонент редактирует значение, поддерживаю v-model. Нативные атрибуты пробрасываю через $attrs, чтобы не объявлять их пропсами. И не делаю компонент универсальным заранее: обобщаю, когда паттерн повторился несколько раз.'
      }
    ]
  },
  {
    id: 'vue-large-apps',
    section: 'vue',
    group: 'Архитектура',
    title: 'Архитектура больших приложений',
    level: 'senior',
    summary: 'Структура по фичам, слои с правилами импорта, публичный API модулей и ленивые маршруты',
    what: 'В большом приложении код организуют не по типам файлов (components, stores, utils), а по фичам или доменам. Популярный вариант — Feature-Sliced Design: слои app, pages, widgets, features, entities, shared; импортировать можно только из нижележащих слоёв, а модуль отдаёт наружу публичный API через index.ts.',
    why: 'При десятках разработчиков и сотнях экранов структура по типам превращается в свалку: непонятно, что от чего зависит, изменения в одной фиче ломают другую. Границы модулей ограничивают связность и позволяют работать командам параллельно.',
    when: 'Когда проект растёт за пару десятков экранов или над ним работает несколько команд. Маленькому приложению строгая FSD добавляет лишних слоёв.',
    diff: 'Структура по типам проста для старта, но плохо масштабируется. По фичам — всё про фичу лежит рядом. FSD добавляет к этому строгие правила зависимостей между слоями. Микрофронтенды — следующий уровень изоляции с отдельным деплоем, и у них своя цена.',
    code: [
      { title: 'Структура FSD', lang: 'bash', src: `src/
  app/          # инициализация: роутер, pinia, провайдеры, стили
  pages/        # страницы, собирают виджеты
    orders/
  widgets/      # крупные блоки: Header, OrdersTable
  features/     # действия пользователя: cancel-order, add-to-cart
    cancel-order/
      ui/ model/ api/
      index.ts  # публичный API фичи
  entities/     # бизнес-сущности: order, user, product
  shared/       # ui-kit, api-клиент, утилиты, без бизнес-логики` },
      { title: 'Ленивые маршруты по модулям', lang: 'ts', src: `const routes = [
  {
    path: '/orders',
    component: () => import('@/pages/orders/OrdersPage.vue'),
    children: [
      { path: ':id', component: () => import('@/pages/orders/OrderPage.vue') }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/pages/admin/AdminLayout.vue'),
    meta: { requiresRole: 'admin' }
  }
]` }
    ],
    real: 'В продукте с тремя командами фичи «каталог», «заказы» и «биллинг» разнесли по модулям с index.ts и запретили глубокие импорты через ESLint (eslint-plugin-boundaries или steiger для FSD). Команды перестали ломать друг другу код, а каждая страница грузится отдельным чанком.',
    pitfalls: [
      'Импортировать внутренности чужой фичи в обход index.ts — граница модуля перестаёт существовать.',
      'Складывать в shared всё подряд, включая бизнес-логику, — shared становится вторым монолитом.',
      'Перекрёстные импорты между фичами одного слоя — циклические зависимости.',
      'Тянуть FSD в маленький проект целиком — больше церемоний, чем пользы.'
    ],
    questions: [
      {
        id: 'vue-large-apps-q1',
        q: 'Как бы вы организовали структуру большого Vue-приложения?',
        level: 'senior',
        keys: ['по фичам/доменам, а не по типам файлов', 'слои с направлением зависимостей (например FSD)', 'публичный API модуля через index.ts', 'запрет глубоких импортов линтером', 'ленивые маршруты по страницам'],
        a: 'Я группирую код по фичам, а не по типам: всё, что относится к заказам — компоненты, composables, api, типы, — лежит в одном месте. Поверх этого слои с понятным направлением зависимостей, например по FSD: shared ничего не знает о бизнесе, entities описывают сущности, features — действия, pages собирают всё вместе, и импортировать можно только вниз. Каждый модуль отдаёт наружу index.ts, а глубокие импорты запрещены линтером. Страницы подключаются лениво, так каждый раздел — отдельный чанк.'
      },
      {
        id: 'vue-large-apps-q2',
        q: 'Что такое Feature-Sliced Design и какие у него минусы?',
        level: 'senior',
        keys: ['слои app/pages/widgets/features/entities/shared', 'импорт только из нижележащих слоёв', 'слайсы внутри слоя не импортируют друг друга', 'минусы: порог входа, споры, куда положить код, оверхед для небольших проектов'],
        a: 'FSD — методология, где код делится на слои: app, pages, widgets, features, entities, shared. Слой может импортировать только из слоёв ниже, а слайсы внутри одного слоя не знают друг о друге, у каждого есть публичный API. Плюс в том, что зависимости предсказуемы и фичи изолированы. Минусы — высокий порог входа, постоянные споры, это feature или entity, и много церемоний для небольших проектов. Я бы брал из FSD идею слоёв и публичного API, а строгость подбирал под размер команды.'
      }
    ]
  },
  {
    id: 'vue-vdom',
    section: 'vue',
    group: 'Производительность',
    title: 'Virtual DOM и компилятор',
    level: 'middle',
    summary: 'Vue сравнивает деревья VNode, а компилятор шаблонов помечает динамические части, чтобы diff проверял только их',
    what: 'Шаблон компилируется в render-функцию, которая возвращает дерево VNode — лёгких JS-объектов. При изменении данных Vue строит новое дерево и сравнивает его со старым (patch), применяя к реальному DOM только разницу. Компилятор Vue 3 добавляет оптимизации: patch flags, вынос статики и block tree.',
    why: 'Позволяет писать декларативно и не трогать DOM руками, при этом обновлять его минимально. Оптимизации компилятора делают diff близким к точечным обновлениям.',
    when: 'Знание нужно, чтобы правильно ставить key, понимать, почему ререндер дорогой, и не мешать оптимизациям (например, ручными render-функциями без нужды).',
    diff: 'В React diff проходит всё дерево компонента. Во Vue компилятор знает, что статично: patch flags говорят, что у узла меняется только текст или класс, а block tree собирает динамические узлы в плоский массив, и при обновлении обходятся только они. Плюс реактивность Vue точно знает, какой компонент перерендерить, без memo.',
    code: [
      { title: 'Что видит компилятор', lang: 'vue', src: `<template>
  <div class="card">
    <h2>Заголовок</h2>            <!-- статика: выносится, не сравнивается -->
    <p>{{ text }}</p>              <!-- patch flag TEXT -->
    <span :class="cls">x</span>    <!-- patch flag CLASS -->
    <li v-for="i in items" :key="i.id">{{ i.name }}</li>
  </div>
</template>
<!-- посмотреть результат: play.vuejs.org, вкладка JS -->` },
      { title: 'Зачем key в списках', lang: 'vue', src: `<!-- плохо: при удалении первого элемента состояние инпутов «съедет» -->
<TodoItem v-for="(t, i) in todos" :key="i" :todo="t" />

<!-- хорошо: Vue сопоставит узлы по id и переставит их -->
<TodoItem v-for="t in todos" :key="t.id" :todo="t" />` }
    ],
    real: 'Баг в списке задач: при удалении верхней задачи в поле редактирования оставался текст удалённой. Причина — key по индексу: Vue переиспользовал первый компонент для следующей задачи. Замена на :key="todo.id" исправила поведение.',
    pitfalls: [
      'key по индексу в списках, где элементы удаляются или переставляются, — сохранённое внутреннее состояние уезжает к другим элементам.',
      'Случайный key (Math.random()) — компонент пересоздаётся на каждый рендер.',
      'Считать Virtual DOM «быстрее DOM» — это накладные расходы ради удобства, быстрее только по сравнению с наивным пересозданием.',
      'Писать render-функции руками без нужды — теряются оптимизации компилятора.'
    ],
    questions: [
      {
        id: 'vue-vdom-q1',
        q: 'Как работает Virtual DOM во Vue и зачем нужен key?',
        level: 'middle',
        keys: ['render-функция возвращает дерево VNode', 'patch сравнивает старое и новое дерево и применяет разницу', 'key позволяет сопоставить элементы списка между рендерами', 'без стабильного key состояние элементов перепутывается'],
        a: 'Шаблон компилируется в render-функцию, которая возвращает дерево VNode — лёгкие объекты, описывающие DOM. Когда данные меняются, компонент перерендеривается в новое дерево, Vue сравнивает его со старым и применяет к реальному DOM только изменения. В списках key говорит, какой старый узел соответствует новому: по стабильному id Vue переставит элементы вместе с их состоянием. С ключом-индексом при удалении из середины состояние, например текст в инпуте, останется на месте и окажется у соседнего элемента.'
      },
      {
        id: 'vue-vdom-q2',
        q: 'Какие оптимизации делает компилятор шаблонов Vue 3?',
        level: 'middle+',
        keys: ['вынос статических узлов (hoisting), они не пересоздаются', 'patch flags — что именно динамическое у узла', 'block tree — плоский список динамических узлов', 'diff обходит только динамику'],
        a: 'Компилятор анализирует шаблон и знает, что в нём статично. Статические узлы выносятся из render-функции и не создаются заново, а длинные статические куски могут превращаться в одну HTML-строку. Динамическим узлам ставятся patch flags — метка, что у узла меняется, например, только текст или только класс, и при патче проверяется только это. Ещё есть block tree: динамические потомки собираются в плоский массив, и при обновлении Vue проходит его, а не всё дерево. Поэтому шаблоны во Vue обычно быстрее рукописных render-функций.'
      }
    ]
  },
  {
    id: 'vue-render-opt',
    section: 'vue',
    group: 'Производительность',
    title: 'Оптимизация рендеринга',
    level: 'middle+',
    summary: 'Меньше лишних ререндеров и меньше DOM: стабильные пропсы, v-once, v-memo, shallowRef и виртуальные списки',
    what: 'Компонент перерендеривается, когда меняются его реактивные зависимости или пропсы. Оптимизация — это сократить число ререндеров и размер того, что рендерится. Инструменты: разбиение на компоненты, стабильные пропсы, v-once, v-memo, shallowRef/markRaw для больших данных, виртуализация длинных списков.',
    why: 'В таблицах на тысячи строк, дашбордах и живых лентах лишние ререндеры и огромный DOM дают лаги при вводе и скролле.',
    when: 'Сначала измерить в DevTools или Performance, потом оптимизировать узкое место. Применять v-memo и подобное «на всякий случай» не нужно.',
    diff: 'v-once рендерит один раз и больше никогда не обновляет. v-memo пропускает обновление поддерева, пока не изменились указанные зависимости. Виртуальный список рендерит только видимые строки — это сокращает DOM, а не число ререндеров. Разбиение на компоненты сужает область ререндера, потому что Vue обновляет компоненты по отдельности.',
    code: [
      { title: 'Стабильные пропсы и v-memo', lang: 'vue', src: `<!-- плохо: при смене activeId перерендерятся все строки -->
<Row v-for="r in rows" :key="r.id" :row="r" :active-id="activeId" />

<!-- хорошо: у строки меняется проп только у двух элементов -->
<Row v-for="r in rows" :key="r.id" :row="r" :active="r.id === activeId" />

<!-- v-memo: пропускаем обновление строки, если не изменились зависимости -->
<div v-for="r in rows" :key="r.id" v-memo="[r.id === activeId, r.updatedAt]">
  {{ r.title }} <b v-if="r.id === activeId">*</b>
</div>` },
      { title: 'Виртуальный список', lang: 'vue', src: `<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'

const rows = shallowRef<Row[]>([]) // 50 000 строк без глубокого Proxy
const { list, containerProps, wrapperProps } =
  useVirtualList(rows, { itemHeight: 40 })
</script>

<template>
  <div v-bind="containerProps" style="height: 600px">
    <div v-bind="wrapperProps">
      <RowItem v-for="{ data } in list" :key="data.id" :row="data" />
    </div>
  </div>
</template>` }
    ],
    real: 'Таблица заявок на 5000 строк тормозила при наборе в поле поиска: каждая буква перерендеривала всю таблицу из одного большого компонента, и строки были в глубоко реактивном ref. Решение: shallowRef для данных, debounce поиска, отдельный компонент строки с примитивными пропсами и виртуализация.',
    pitfalls: [
      'Передавать в каждую строку значение, которое меняется для всех (activeId), вместо вычисленного булева флага.',
      'Создавать новые объекты и функции в пропсах прямо в шаблоне — у дочернего компонента каждый раз новый проп, и он перерендеривается.',
      'Держать гигантский компонент с формой и таблицей вместе — ввод в форму обновляет таблицу.',
      'Ставить v-memo без измерений и с неполным списком зависимостей — интерфейс перестаёт обновляться.'
    ],
    questions: [
      {
        id: 'vue-render-opt-q1',
        q: 'Как бы вы искали и устраняли лишние ререндеры во Vue?',
        level: 'middle+',
        keys: ['сначала измерить: DevTools, Performance', 'разбить большой компонент, чтобы сузить область обновления', 'стабильные пропсы: примитивы вместо новых объектов, флаг вместо общего id', 'shallowRef/markRaw для больших данных', 'v-memo/v-once точечно'],
        a: 'Сначала измеряю: в Vue DevTools смотрю, какие компоненты обновляются и сколько времени занимает рендер, в Performance — что происходит в целом. Частая причина — большой компонент, где любое изменение перерисовывает всё, поэтому выношу независимые части в дочерние компоненты: Vue обновляет компоненты по отдельности. Дальше слежу за стабильностью пропсов: не передаю во все строки общее значение и не создаю объекты прямо в шаблоне. Большие данные кладу в shallowRef. v-memo и v-once — уже точечные инструменты для горячих мест.'
      },
      {
        id: 'vue-render-opt-q2',
        q: 'Что делают v-once и v-memo?',
        level: 'middle+',
        keys: ['v-once рендерит один раз, дальше элемент статичен', 'v-memo принимает массив зависимостей', 'если зависимости не изменились, обновление поддерева пропускается', 'основное применение v-memo — большие v-for', 'неполные зависимости — интерфейс не обновится'],
        a: 'v-once рендерит элемент или компонент один раз и дальше вообще не обновляет, это для контента, который точно не меняется. v-memo принимает массив значений и пропускает обновление поддерева, пока эти значения те же — что-то вроде мемоизации на уровне шаблона. Главный сценарий — большой v-for, где при выборе элемента меняются только две строки: v-memo по флагу «выбран» позволяет пропустить остальные. Если в зависимостях что-то забыть, строка перестанет обновляться, поэтому применяю его только после замеров.'
      },
      {
        id: 'vue-render-opt-q3',
        q: 'Как отрисовать список из 50 000 элементов без тормозов?',
        level: 'middle+',
        keys: ['виртуализация: рендерить только видимые строки', 'shallowRef для массива — без глубокого Proxy', 'пагинация или бесконечная подгрузка как альтернатива', 'фильтрация и сортировка через computed, тяжёлое — в воркер'],
        a: 'Рендерить 50 000 DOM-узлов нельзя, поэтому использую виртуальный список: в DOM только видимые строки плюс небольшой запас, а остальное имитируется высотой контейнера. Есть useVirtualList из VueUse или vue-virtual-scroller. Сами данные кладу в shallowRef, чтобы Vue не создавал Proxy для каждой строки. Если бизнес позволяет, лучше вообще пагинация или подгрузка с сервера. Тяжёлую фильтрацию можно вынести в computed с debounce на поиске или в Web Worker.'
      }
    ]
  },
  {
    id: 'vue-lazy',
    section: 'vue',
    group: 'Производительность',
    title: 'Lazy loading и code splitting',
    level: 'middle',
    summary: 'Динамический import делит бандл на чанки: ленивые роуты, defineAsyncComponent и Suspense для асинхронных зависимостей',
    what: 'Code splitting — разбиение бандла на части, которые грузятся по требованию. Во Vue это ленивые маршруты (component: () => import(...)) и defineAsyncComponent для отдельных компонентов. Suspense позволяет показать общий fallback, пока внутри дерева разрешаются асинхронные компоненты и async setup.',
    why: 'Уменьшает начальный JS: пользователь главной страницы не скачивает код админки, редактора и графиков. Быстрее первая загрузка и время до интерактивности.',
    when: 'Все страницы, кроме, возможно, главной, — лениво. Тяжёлые редко используемые компоненты (редактор, карта, графики, модалки) — через defineAsyncComponent. Мелкие компоненты дробить не надо: лишние запросы дороже экономии.',
    diff: 'Ленивый роут грузится при навигации, defineAsyncComponent — при первом рендере компонента. Suspense — не про загрузку кода, а про ожидание асинхронных зависимостей в дереве; он до сих пор помечен как экспериментальный. В Vue 3.5 появилась ленивая гидрация: hydrate: hydrateOnVisible() и подобные стратегии для SSR.',
    code: [
      { title: 'defineAsyncComponent с состояниями', lang: 'ts', src: `import { defineAsyncComponent } from 'vue'

const RichEditor = defineAsyncComponent({
  loader: () => import('./RichEditor.vue'),
  loadingComponent: EditorSkeleton,
  errorComponent: LoadError,
  delay: 200,     // не мигать скелетоном при быстрой загрузке
  timeout: 10000
})` },
      { title: 'Suspense для async setup', lang: 'vue', src: `<!-- Dashboard.vue -->
<script setup lang="ts">
const stats = await api.getStats() // async setup
</script>

<!-- Родитель -->
<template>
  <Suspense>
    <Dashboard />
    <template #fallback>
      <Spinner />
    </template>
  </Suspense>
</template>` },
      { title: 'Ленивый роут и предзагрузка', lang: 'ts', src: `const AdminUsers = () => import('@/pages/AdminUsers.vue')

const routes = [{ path: '/admin/users', component: AdminUsers }]

// предзагрузить чанк при наведении на ссылку
function onLinkHover() {
  AdminUsers()
}
// в Vite объединение чанков — build.rollupOptions.output.manualChunks` }
    ],
    real: 'Начальный бандл интернет-магазина весил 1.2 МБ, потому что редактор отзывов с подсветкой и библиотека графиков личного кабинета импортировались статически. Ленивые роуты и defineAsyncComponent для редактора уменьшили его в несколько раз, и время до интерактивности на мобильных заметно упало.',
    pitfalls: [
      'Ленивая загрузка компонента, который виден на первом экране, — он появится с задержкой и сдвинет вёрстку.',
      'Дробить на чанки каждый мелкий компонент — водопад мелких запросов.',
      'Забыть errorComponent и обработку ошибок загрузки чанка — после нового деплоя старые чанки исчезают, и пользователь видит пустое место.',
      'Использовать async setup без Suspense выше по дереву — компонент не отрендерится.'
    ],
    questions: [
      {
        id: 'vue-lazy-q1',
        q: 'Как реализовать code splitting во Vue-приложении?',
        level: 'middle',
        keys: ['динамический import() создаёт отдельный чанк', 'ленивые роуты: component: () => import()', 'defineAsyncComponent для тяжёлых компонентов', 'loading/error-компоненты, delay, timeout', 'не делать ленивым то, что на первом экране'],
        a: 'Основа — динамический import(): сборщик выносит модуль в отдельный чанк и грузит его при первом вызове. Для страниц пишу в роутере component: () => import(...), и каждая страница становится своим чанком. Для тяжёлых компонентов внутри страницы, например редактора или графиков, использую defineAsyncComponent с loadingComponent, errorComponent и delay, чтобы скелетон не мигал при быстрой загрузке. А то, что видно на первом экране, грузится сразу, иначе будут задержка и сдвиг вёрстки.'
      },
      {
        id: 'vue-lazy-q2',
        q: 'Что такое Suspense и когда он нужен?',
        level: 'middle+',
        keys: ['ждёт асинхронные зависимости в дереве: async setup и async-компоненты', 'показывает #fallback, пока не разрешатся', 'один индикатор загрузки вместо множества', 'экспериментальный API', 'ошибки ловить через onErrorCaptured'],
        a: 'Suspense — встроенный компонент, который ждёт, пока разрешатся все асинхронные зависимости внутри: компоненты с await в setup и асинхронные компоненты. Пока они грузятся, показывается слот fallback. Это позволяет вместо пяти спиннеров в разных виджетах показать один общий. Сам Suspense ошибки не обрабатывает, для этого нужен onErrorCaptured в родителе. API до сих пор помечен как экспериментальный, но Nuxt использует его под капотом.'
      }
    ]
  },
  {
    id: 'vue-devtools',
    section: 'vue',
    group: 'Производительность',
    title: 'Vue DevTools',
    level: 'middle',
    summary: 'Инспектор компонентов, сторов и роутера плюс timeline событий и замеры рендера',
    what: 'Vue DevTools — расширение браузера или плагин Vite (vite-plugin-vue-devtools) для отладки Vue-приложений. Показывает дерево компонентов с пропсами, состоянием и setup-данными, Pinia-сторы, маршруты, а на вкладке Timeline — события компонентов, изменения сторов, навигацию и время рендера.',
    why: 'Позволяет понять, что происходит в приложении, без console.log: какие пропсы пришли, какое состояние у стора, какой компонент обновился и сколько это заняло.',
    when: 'При отладке состояния, поиске лишних ререндеров и медленных компонентов, при разборе, какое событие эмитится и кто его слушает. Для общей производительности страницы — вместе с вкладкой Performance браузера.',
    diff: 'Браузерный Performance показывает всё (JS, layout, paint), но без понимания компонентов Vue. DevTools знает про компоненты и сторы, но не заменяет профайлер браузера. В production DevTools по умолчанию недоступен.',
    code: [
      { title: 'Плагин для Vite', lang: 'ts', src: `// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()]
})
// В Nuxt: devtools: { enabled: true } в nuxt.config` },
      { title: 'Замеры рендера в браузерном Performance', lang: 'ts', src: `// main.ts — метки компонентов попадут во вкладку Performance
const app = createApp(App)
app.config.performance = import.meta.env.DEV
app.mount('#app')` }
    ],
    real: 'Жалоба «тормозит ввод в форме». В Timeline DevTools видно, что на каждое нажатие обновляется компонент таблицы на соседней панели, потому что он читает общий reactive-объект формы. После разделения состояния и передачи в таблицу только нужных полей ввод стал плавным.',
    pitfalls: [
      'Отлаживать производительность только по ощущениям, без Timeline и Performance.',
      'Включать app.config.performance в production — лишние накладные расходы.',
      'Править состояние в DevTools и забыть, что это не воспроизводит реальный сценарий пользователя.'
    ],
    questions: [
      {
        id: 'vue-devtools-q1',
        q: 'Что вы смотрите в Vue DevTools при отладке?',
        level: 'middle',
        keys: ['дерево компонентов: props, state, setup-данные, attrs', 'Pinia: состояние сторов, правка на лету', 'Timeline: события компонентов, изменения сторов, навигация', 'роутер: текущий маршрут, params, query', 'подсветка обновлений и время рендера'],
        a: 'В инспекторе компонентов смотрю, какие пропсы реально пришли и какое внутреннее состояние у компонента, — часто проблема видна сразу. Во вкладке Pinia проверяю состояние сторов и могу поправить значение, чтобы проверить гипотезу. Timeline показывает последовательность: какое событие эмитнулось, какой action вызвался, как поменялся стор, какая была навигация. Для роутера — текущий маршрут, params и query. А для производительности есть подсветка обновлений и замеры времени рендера компонентов.'
      },
      {
        id: 'vue-devtools-q2',
        q: 'Как найти медленный компонент?',
        level: 'middle+',
        keys: ['Timeline / performance в DevTools: время рендера и патча компонентов', 'подсветка обновлений — кто перерендеривается лишний раз', 'app.config.performance — метки во вкладке Performance браузера', 'проверять на production-сборке, dev-режим медленнее'],
        a: 'Сначала включаю в DevTools подсветку обновлений и делаю действие, которое тормозит: сразу видно, какие компоненты перерисовываются без причины. Потом смотрю Timeline с замерами производительности, где видно время рендера и патча каждого компонента. Если нужно увидеть картину целиком вместе с layout и paint, включаю app.config.performance и пишу профиль во вкладке Performance браузера. Итоговые замеры делаю на production-сборке, потому что в dev-режиме Vue заметно медленнее из-за проверок.'
      }
    ]
  }
);
window.SOBES.quiz.push(
  {
    id: 'qz-vue-options-composition-1',
    topic: 'vue-options-composition',
    type: 'single',
    q: 'Что из этого главное преимущество Composition API перед Options API?',
    options: ["Логику одной фичи можно держать вместе и выносить в composables", "Он быстрее рендерит шаблоны", "Он не использует Proxy", "Он не требует сборщика"],
    correct: [0],
    explain: 'Оба API работают на одной реактивной системе и рендерятся одинаково. Выигрыш в организации кода: группировка по фичам и переиспользование через функции вместо миксинов.'
  },
  {
    id: 'qz-vue-options-composition-2',
    topic: 'vue-options-composition',
    type: 'multi',
    q: 'Что верно про <script setup>?',
    options: ['Импортированные компоненты доступны в шаблоне без регистрации', 'defineProps нужно импортировать из vue', 'По умолчанию родитель через ref не видит внутренние переменные компонента', 'Переменные верхнего уровня доступны в шаблоне без return'],
    correct: [0, 2, 3],
    explain: 'defineProps — макрос компилятора, импортировать его не нужно. Компонент на <script setup> закрыт: снаружи видно только то, что отдано через defineExpose.'
  },
  {
    id: 'qz-vue-ref-reactive-1',
    topic: 'vue-ref-reactive',
    type: 'output',
    q: 'Что выведет код?',
    code: `const state = reactive({ count: 0 })
let { count } = state
count++
console.log(state.count)`,
    options: ["1", "undefined", "0", "Ошибка: нельзя менять реактивное значение"],
    correct: [2],
    explain: 'Деструктуризация скопировала число 0 в обычную переменную. Увеличение count никак не связано с Proxy, поэтому state.count остаётся 0.'
  },
  {
    id: 'qz-vue-ref-reactive-2',
    topic: 'vue-ref-reactive',
    type: 'output',
    q: 'Что выведет код?',
    code: `const state = reactive({ a: 1 })
const { a } = toRefs(state)
a.value = 5
console.log(state.a)`,
    options: ["1", "undefined", "Ошибка: toRefs возвращает readonly", "5"],
    correct: [3],
    explain: 'toRefs создаёт ref для каждого поля, которые читают и пишут в исходный объект. Запись в a.value меняет state.a.'
  },
  {
    id: 'qz-vue-ref-reactive-3',
    topic: 'vue-ref-reactive',
    type: 'single',
    q: 'С сервера приходит список на 20 000 строк. Отдельные строки никто не меняет: при обновлении весь массив заменяется новым ответом. Как хранить такой список в компоненте, чтобы Vue не делал лишней работы?',
    options: ["reactive([])", "shallowRef([])", "ref([])", "computed(() => [])"],
    correct: [1],
    explain: 'ref и reactive сделают глубокий Proxy над каждой строкой, что дорого по памяти и времени. shallowRef отслеживает только замену .value, а именно так данные и меняются.'
  },
  {
    id: 'qz-vue-computed-watch-1',
    topic: 'vue-computed-watch',
    type: 'output',
    q: 'Сколько раз выведется "calc"?',
    code: `const n = ref(2)
const double = computed(() => {
  console.log('calc')
  return n.value * 2
})
double.value
double.value
n.value = 3
double.value`,
    options: ["3", "1", "2", "0"],
    correct: [2],
    explain: 'computed ленивый и кешируется: первое чтение вычисляет, второе берёт кеш. После изменения n кеш помечается грязным, и третье чтение вычисляет заново. Итого два раза.'
  },
  {
    id: 'qz-vue-computed-watch-2',
    topic: 'vue-computed-watch',
    type: 'single',
    q: 'Какое значение flush у watch по умолчанию и что оно значит?',
    options: ["pre — колбэк вызывается до обновления DOM компонента", "sync — колбэк вызывается сразу при изменении", "post — колбэк вызывается после обновления DOM", "idle — колбэк вызывается в requestIdleCallback"],
    correct: [0],
    explain: 'По умолчанию flush: pre, изменения батчатся, и колбэк вызывается до перерисовки. Чтобы работать с обновлённым DOM, нужен flush: post, а sync используют редко.'
  },
  {
    id: 'qz-vue-computed-watch-3',
    topic: 'vue-computed-watch',
    type: 'single',
    q: 'Почему watch(state.count, cb) не работает, если state — reactive?',
    options: ["watch не поддерживает reactive", "Нужно указать deep: true", "Нужно обернуть в toRaw", "В watch передаётся число, а не реактивный источник; нужен геттер () => state.count"],
    correct: [3],
    explain: 'Выражение state.count вычисляется сразу и даёт примитив. watch принимает ref, reactive-объект, геттер или массив из них, поэтому для поля нужен геттер.'
  },
  {
    id: 'qz-vue-watcheffect-1',
    topic: 'vue-watcheffect',
    type: 'single',
    q: 'Какие значения станут зависимостями этого watchEffect?',
    code: `watchEffect(async () => {
  const res = await fetch('/api?page=' + page.value)
  items.value = await res.json()
  console.log(filter.value)
})`,
    options: ['page и filter', 'Только page', 'Только filter', 'Никакие — async-функции не отслеживаются'],
    correct: [1],
    explain: 'watchEffect отслеживает только синхронную часть до первого await. page.value прочитан до await, filter.value — после, поэтому он в зависимости не попадёт.'
  },
  {
    id: 'qz-vue-watcheffect-2',
    topic: 'vue-watcheffect',
    type: 'multi',
    q: 'Чем watchEffect отличается от watch по умолчанию?',
    options: ['Запускается сразу', 'Даёт старое значение', 'Сам собирает зависимости по чтению', 'Не может быть остановлен'],
    correct: [0, 2],
    explain: 'Старого значения у watchEffect нет, это возможность watch. Остановить оба можно функцией, которую они возвращают.'
  },
  {
    id: 'qz-vue-lifecycle-1',
    topic: 'vue-lifecycle',
    type: 'multi',
    q: 'Какие хуки выполняются на сервере при SSR?',
    options: ['setup', 'onMounted', 'onServerPrefetch', 'onBeforeUnmount'],
    correct: [0, 2],
    explain: 'На сервере компонент не монтируется в DOM, поэтому mount, update и unmount не вызываются. Выполняются setup (и beforeCreate/created в Options API) и onServerPrefetch.'
  },
  {
    id: 'qz-vue-lifecycle-2',
    topic: 'vue-lifecycle',
    type: 'output',
    q: 'В каком порядке выведутся сообщения при первом монтировании Parent с дочерним Child?',
    code: `// Parent
onMounted(() => console.log('parent mounted'))
console.log('parent setup')

// Child
onMounted(() => console.log('child mounted'))
console.log('child setup')`,
    options: ["parent setup, child setup, child mounted, parent mounted", "parent setup, parent mounted, child setup, child mounted", "child setup, parent setup, child mounted, parent mounted", "parent setup, child setup, parent mounted, child mounted"],
    correct: [0],
    explain: 'Родитель начинает setup первым, затем рендер создаёт детей. Ребёнок монтируется раньше, а родитель считается смонтированным, когда смонтированы все дети.'
  },
  {
    id: 'qz-vue-lifecycle-3',
    topic: 'vue-lifecycle',
    type: 'single',
    q: 'Что случится с хуком в этом setup?',
    code: `const data = await api.load()
onMounted(() => initChart(data))`,
    options: ['Сработает как обычно', 'Сработает дважды', 'Может не привязаться к компоненту, потому что зарегистрирован после await', 'Вызовет ошибку компиляции'],
    correct: [2],
    explain: 'Хуки привязываются к текущему экземпляру, который известен синхронно. В <script setup> компилятор восстанавливает контекст после await, но в обычном setup и в composables хук после await теряет экземпляр. Правило — регистрировать хуки до await.'
  },
  {
    id: 'qz-vue-props-emits-1',
    topic: 'vue-props-emits',
    type: 'single',
    q: 'Ребёнку нужно изменить значение пропса count. Как правильно?',
    options: ['props.count++', 'Сделать emit("update:count", count + 1), а родитель обновит своё состояние', 'Скопировать в ref при создании и менять копию, ожидая синхронизации с родителем', 'Использовать inject родителя и изменить там'],
    correct: [1],
    explain: 'Props только для чтения, данные меняет их владелец. Копия в ref отвяжется от пропса, а мутация через inject ломает однонаправленный поток.'
  },
  {
    id: 'qz-vue-props-emits-2',
    topic: 'vue-props-emits',
    type: 'single',
    q: 'Vue 3.5. Как правильно следить за деструктурированным пропом?',
    code: `const { id } = defineProps<{ id: number }>()`,
    options: ["watch(id, load)", "watch(ref(id), load)", "watch(toRef(id), load)", "watch(() => id, load)"],
    correct: [3],
    explain: 'Компилятор переписывает обращения к id на props.id, но watch(id) получит просто число. Геттер () => id превратится в () => props.id и будет отслеживаться.'
  },
  {
    id: 'qz-vue-v-model-1',
    topic: 'vue-v-model',
    type: 'single',
    q: 'Во что разворачивается <MyInput v-model:title="t" />?',
    options: [":title=\"t\" @update:title=\"t = $event\"", ":value=\"t\" @input=\"t = $event\"", ":modelValue=\"t\" @update:modelValue=\"t = $event\"", ":title=\"t\" @change=\"t = $event\""],
    correct: [0],
    explain: 'С аргументом v-model использует проп с этим именем и событие update:имя. Без аргумента — modelValue и update:modelValue.'
  },
  {
    id: 'qz-vue-v-model-2',
    topic: 'vue-v-model',
    type: 'multi',
    q: 'Что верно про defineModel?',
    options: ['Объявляет проп и событие update сразу', 'Возвращает ref, запись в который эмитит событие', 'Работает только с одним v-model на компонент', 'Позволяет получить модификаторы v-model'],
    correct: [0, 1, 3],
    explain: 'defineModel можно вызывать несколько раз с разными именами, по одному на каждый v-model. Модификаторы доступны через деструктуризацию [model, modifiers].'
  },
  {
    id: 'qz-vue-slots-1',
    topic: 'vue-slots',
    type: 'single',
    q: 'Как получить данные item из scoped-слота компонента List?',
    options: ["<List v-bind:item=\"item\">", "<List @slot=\"item => ...\">", "<List><template #default=\"{ item }\">{{ item.name }}</template></List>", "<List :slot-props=\"item\">"],
    correct: [2],
    explain: 'Пропсы слота принимаются через v-slot (сокращённо #) и их можно деструктурировать прямо в объявлении.'
  },
  {
    id: 'qz-vue-slots-2',
    topic: 'vue-slots',
    type: 'single',
    q: 'Как в <script setup> проверить, передали ли слот footer?',
    options: ["props.footer", "useAttrs().footer", "defineSlots().has(\"footer\")", "useSlots().footer"],
    correct: [3],
    explain: 'useSlots возвращает объект слотов — тот же, что $slots в шаблоне. Если слот не передан, соответствующего ключа нет.'
  },
  {
    id: 'qz-vue-provide-inject-1',
    topic: 'vue-provide-inject',
    type: 'single',
    q: 'Родитель делает provide("count", count.value), где count — ref. Что увидит потомок при изменении count?',
    options: ['Новое значение', 'Старое значение, реактивности нет', 'Ошибку', 'undefined'],
    correct: [1],
    explain: 'В provide передан примитив на момент вызова. Чтобы потомок видел изменения, нужно передать сам ref или readonly(ref).'
  },
  {
    id: 'qz-vue-provide-inject-2',
    topic: 'vue-provide-inject',
    type: 'multi',
    q: 'Что верно про InjectionKey?',
    options: ['Это Symbol с привязанным типом', 'inject(key) вернёт T | undefined', 'Ключ гарантирует наличие провайдера в рантайме', 'Помогает избежать коллизий строковых ключей'],
    correct: [0, 1, 3],
    explain: 'InjectionKey — это только типизация. Если провайдера нет, inject вернёт undefined или дефолт, поэтому этот случай надо обрабатывать.'
  },
  {
    id: 'qz-vue-dynamic-components-1',
    topic: 'vue-dynamic-components',
    type: 'single',
    q: 'Почему Vue выдаёт предупреждение при const current = ref(MyComponent)?',
    options: ["ref нельзя использовать с <component :is>", "Компоненты нельзя хранить в переменных", "Объект компонента становится глубоко реактивным, это лишние накладные расходы", "Нужно передавать строку с именем"],
    correct: [2],
    explain: 'ref оборачивает объект в reactive, и Vue создаёт Proxy над описанием компонента. Для компонентов используют shallowRef или markRaw.'
  },
  {
    id: 'qz-vue-dynamic-components-2',
    topic: 'vue-dynamic-components',
    type: 'single',
    q: 'Что произойдёт с состоянием формы во вкладке при переключении <component :is> на другую вкладку и обратно (без KeepAlive)?',
    options: ["Сбросится: компонент размонтируется и создастся заново", "Сохранится", "Сохранится, только если у компонента есть name", "Сохранится только в production"],
    correct: [0],
    explain: 'При смене :is старый экземпляр уничтожается. Чтобы сохранить состояние, оборачивают в KeepAlive или поднимают состояние выше.'
  },
  {
    id: 'qz-vue-teleport-1',
    topic: 'vue-teleport',
    type: 'multi',
    q: 'Что верно про контент внутри <Teleport to="body">?',
    options: ['Он получает пропсы родительского компонента как обычно', 'provide/inject перестают работать', 'Он рендерится внутри body в DOM', 'Его можно временно рендерить на месте через disabled'],
    correct: [0, 2, 3],
    explain: 'Teleport меняет только положение в DOM, а не в дереве компонентов, поэтому inject и события компонента работают как обычно.'
  },
  {
    id: 'qz-vue-teleport-2',
    topic: 'vue-teleport',
    type: 'single',
    q: 'Какую проблему чаще всего решает Teleport для модального окна?',
    options: ["Медленную загрузку модалки", "Потерю реактивности в модалке", "Отсутствие анимаций", "Обрезание overflow: hidden и stacking context родителя"],
    correct: [3],
    explain: 'Если модалка рендерится внутри контейнера с overflow: hidden или transform, её обрезает или перекрывает соседями, и z-index не помогает. Перенос в body выводит её из этого контекста.'
  },
  {
    id: 'qz-vue-keepalive-1',
    topic: 'vue-keepalive',
    type: 'single',
    q: 'Какой хук вызовется у закешированного компонента при возврате на него?',
    options: ['onMounted', 'onActivated', 'onBeforeMount', 'onUpdated'],
    correct: [1],
    explain: 'Закешированный компонент не монтируется заново, поэтому onMounted не вызывается. onActivated срабатывает при первом монтировании и при каждом возврате.'
  },
  {
    id: 'qz-vue-keepalive-2',
    topic: 'vue-keepalive',
    type: 'single',
    q: 'KeepAlive с :max="3" и четыре вкладки. Что произойдёт при открытии четвёртой?',
    options: ["Из кеша будет удалён компонент, который дольше всех не использовался", "Четвёртая не закешируется", "Кеш очистится полностью", "Vue выбросит ошибку"],
    correct: [0],
    explain: 'max включает вытеснение по принципу LRU: уничтожается экземпляр, к которому дольше всех не обращались.'
  },
  {
    id: 'qz-vue-keepalive-3',
    topic: 'vue-keepalive',
    type: 'single',
    q: 'include="UserList" не работает для компонента на <script setup> в файле List.vue. Почему?',
    options: ["include не поддерживает <script setup>", "include работает только с роутером", "Имя компонента выводится из файла — List; нужно defineOptions({ name: \"UserList\" }) или include=\"List\"", "Нужно указать exclude"],
    correct: [2],
    explain: 'include сравнивает с опцией name. У <script setup> имя по умолчанию берётся из имени файла, поэтому его либо задают явно, либо используют в include имя файла.'
  },
  {
    id: 'qz-vue-composables-1',
    topic: 'vue-composables',
    type: 'single',
    q: 'Почему composable лучше возвращать объект из ref, а не reactive?',
    options: ['ref быстрее reactive', 'Потребитель сможет деструктурировать результат без потери реактивности', 'reactive нельзя возвращать из функции', 'ref не нужен .value в шаблоне'],
    correct: [1],
    explain: 'const { data } = useX() — обычная практика. Из обычного объекта с ref деструктуризация сохраняет ref, а из reactive вытаскивает значения без реактивности.'
  },
  {
    id: 'qz-vue-composables-2',
    topic: 'vue-composables',
    type: 'single',
    q: 'Как сделать, чтобы useUser(id) перезагружал данные при смене id из пропса?',
    options: ["Передавать id как число и вызывать useUser снова при изменении", "Вызывать useUser в onUpdated", "Обернуть useUser в computed", "Принимать MaybeRefOrGetter, читать через toValue внутри watch/watchEffect"],
    correct: [3],
    explain: 'Composable вызывается один раз в setup. Чтобы он реагировал на изменение аргумента, нужно принимать ref или геттер и читать его внутри реактивного эффекта.'
  },
  {
    id: 'qz-vue-composables-3',
    topic: 'vue-composables',
    type: 'multi',
    q: 'Что из этого — ошибки при использовании composable?',
    options: ['Вызов внутри if в setup', 'Вызов после await в обычном setup', 'Вызов на верхнем уровне <script setup>', 'Вызов внутри обработчика клика'],
    correct: [0, 1, 3],
    explain: 'Composables с хуками и вотчерами должны вызываться синхронно при setup, иначе они не привяжутся к экземпляру и не очистятся. Условный вызов ломает предсказуемость.'
  },
  {
    id: 'qz-vue-mixins-1',
    topic: 'vue-mixins',
    type: 'output',
    q: 'Что выведет mounted компонента?',
    code: `const mixin = {
  data: () => ({ msg: 'mixin' }),
  mounted() { console.log('mixin mounted') }
}
export default {
  mixins: [mixin],
  data: () => ({ msg: 'component' }),
  mounted() { console.log(this.msg) }
}`,
    options: ["mixin mounted, component", "component", "mixin mounted, mixin", "component, mixin mounted"],
    correct: [0],
    explain: 'Хуки миксина и компонента объединяются, хук миксина вызывается первым. В data при конфликте побеждает компонент, поэтому msg — "component".'
  },
  {
    id: 'qz-vue-mixins-2',
    topic: 'vue-mixins',
    type: 'multi',
    q: 'Какие проблемы миксинов решают composables?',
    options: ['Конфликты имён', 'Неявное происхождение свойств в this', 'Сложность передачи параметров', 'Необходимость реактивности'],
    correct: [0, 1, 2],
    explain: 'Composable возвращает именованные значения, которые можно переименовать, принимает аргументы и явно вызывается. Реактивность нужна в обоих подходах.'
  },
  {
    id: 'qz-vue-pinia-1',
    topic: 'vue-pinia',
    type: 'single',
    q: 'Что не так в коде?',
    code: `const { total, items } = useCartStore()
// в шаблоне {{ total }}`,
    options: ["Ничего, всё реактивно", "useCartStore нельзя вызывать в setup", "total и items потеряли реактивность, нужен storeToRefs", "total нужно вызывать как функцию"],
    correct: [2],
    explain: 'Стор — reactive-объект, деструктуризация копирует значения. storeToRefs превращает state и getters в связанные ref.'
  },
  {
    id: 'qz-vue-pinia-2',
    topic: 'vue-pinia',
    type: 'multi',
    q: 'Что верно про setup-стор в Pinia?',
    options: ['ref становятся state, computed — getters, функции — actions', 'Нужно вернуть всё состояние из функции', '$reset работает из коробки', 'Внутри можно использовать watch и composables'],
    correct: [0, 1, 3],
    explain: 'Встроенный $reset есть только у options-стора: он знает функцию state. В setup-сторе сброс пишут сами.'
  },
  {
    id: 'qz-vue-pinia-3',
    topic: 'vue-pinia',
    type: 'single',
    q: 'Чем Pinia принципиально отличается от Vuex?',
    options: ["Pinia не поддерживает devtools", "Pinia работает только с Options API", "Pinia не поддерживает SSR", "В Pinia нет mutations и вложенных модулей, состояние меняется прямо или в actions"],
    correct: [3],
    explain: 'Pinia убрала mutations и namespace-модули: каждый стор — отдельный модуль, а типы выводятся без дополнительной обвязки. Devtools и SSR поддерживаются.'
  },
  {
    id: 'qz-vue-state-1',
    topic: 'vue-state',
    type: 'single',
    q: 'Где лучше хранить текущую страницу и фильтры каталога?',
    options: ['В localStorage', 'В URL query-параметрах', 'В глобальной переменной', 'В data корневого компонента'],
    correct: [1],
    explain: 'URL переживает перезагрузку, работает кнопка «назад», и ссылкой можно поделиться. Из URL удобно читать через computed с get/set.'
  },
  {
    id: 'qz-vue-state-2',
    topic: 'vue-state',
    type: 'multi',
    q: 'Что даёт библиотека серверного состояния (TanStack Query) по сравнению с хранением ответов в Pinia?',
    options: ['Кеш по ключу запроса', 'Дедупликацию одинаковых запросов', 'Инвалидацию и перезапрос после мутаций', 'Автоматическую генерацию API на бэкенде'],
    correct: [0, 1, 2],
    explain: 'Библиотека управляет жизненным циклом серверных данных на клиенте: кеш, устаревание, повторы, инвалидация. К бэкенду она отношения не имеет.'
  },
  {
    id: 'qz-vue-separation-1',
    topic: 'vue-separation',
    type: 'single',
    q: 'Какой компонент можно назвать презентационным?',
    options: ["Страница, которая вызывает useOrders и стор", "Компонент, который сам делает fetch в onMounted", "Таблица, которая получает orders через props и эмитит cancel", "Компонент, который читает route.params"],
    correct: [2],
    explain: 'Презентационный компонент ничего не знает об источнике данных: props на вход, события на выход. Такой компонент проще переиспользовать и тестировать.'
  },
  {
    id: 'qz-vue-separation-2',
    topic: 'vue-separation',
    type: 'single',
    q: 'Куда лучше вынести правило «заказ можно отменить в течение часа после создания»?',
    options: ["В чистую функцию доменного слоя", "В шаблон компонента через v-if с условием", "В глобальный миксин", "В CSS"],
    correct: [0],
    explain: 'Бизнес-правило не должно зависеть от UI и реактивности. Чистую функцию легко покрыть юнит-тестом и использовать в нескольких местах.'
  },
  {
    id: 'qz-vue-reusable-1',
    topic: 'vue-reusable',
    type: 'single',
    q: 'Компонент BaseInput: корень — label, внутри input. Как сделать, чтобы placeholder и autocomplete попадали на input?',
    options: ["Объявить их все как props", "Использовать provide/inject", "Использовать v-model", "inheritAttrs: false и v-bind=\"$attrs\" на input"],
    correct: [3],
    explain: 'По умолчанию необъявленные атрибуты падают на корень. inheritAttrs: false отключает это, а v-bind="$attrs" направляет их на нужный элемент.'
  },
  {
    id: 'qz-vue-reusable-2',
    topic: 'vue-reusable',
    type: 'single',
    q: 'Какой API кнопки лучше?',
    options: ['<Btn primary small />', '<Btn variant="primary" size="sm" />', '<Btn :config="{ type: 1, s: 2 }" />', '<Btn class-name="btn-primary-sm" />'],
    correct: [1],
    explain: 'Один проп с union-типом исключает невозможные комбинации вроде primary и danger одновременно и хорошо типизируется.'
  },
  {
    id: 'qz-vue-large-apps-1',
    topic: 'vue-large-apps',
    type: 'single',
    q: 'В FSD фича cancel-order хочет использовать компонент из фичи add-to-cart. Как правильно?',
    options: ["Поднять общую часть в нижний слой (entities или shared) или собрать фичи на уровне widgets/pages", "Импортировать напрямую из features/add-to-cart/ui", "Скопировать компонент", "Импортировать через относительный путь"],
    correct: [0],
    explain: 'Слайсы одного слоя не импортируют друг друга. Общую часть опускают ниже, а композицию фич делают на слое выше.'
  },
  {
    id: 'qz-vue-large-apps-2',
    topic: 'vue-large-apps',
    type: 'multi',
    q: 'Что помогает держать границы модулей в большом проекте?',
    options: ['Публичный API модуля через index.ts', 'Линтер, запрещающий глубокие импорты', 'Структура папок по типам: components, stores, utils', 'Ленивые маршруты на уровне страниц'],
    correct: [0, 1],
    explain: 'Структура по типам, наоборот, размывает границы фич. Ленивые маршруты полезны для производительности, но границы кода сами по себе не охраняют.'
  },
  {
    id: 'qz-vue-vdom-1',
    topic: 'vue-vdom',
    type: 'single',
    q: 'Почему :key="index" в v-for с удалением элементов приводит к багам?',
    options: ["Индексы не уникальны", "Vue не принимает числа как key", "После удаления индексы сдвигаются, и Vue переиспользует компоненты не для тех элементов", "Это замедляет первый рендер"],
    correct: [2],
    explain: 'Индексы уникальны, но не стабильны. При удалении первого элемента бывший второй получает key 0, и Vue считает его тем же узлом, сохраняя внутреннее состояние удалённого.'
  },
  {
    id: 'qz-vue-vdom-2',
    topic: 'vue-vdom',
    type: 'multi',
    q: 'Какие оптимизации делает компилятор шаблонов Vue 3?',
    options: ['Вынос статических узлов', 'Patch flags на динамических узлах', 'Block tree с плоским списком динамических потомков', 'Автоматический v-memo на всех списках'],
    correct: [0, 1, 2],
    explain: 'v-memo компилятор сам не ставит: это ручная оптимизация, потому что ему нужны зависимости, которые знает только разработчик.'
  },
  {
    id: 'qz-vue-render-opt-1',
    topic: 'vue-render-opt',
    type: 'single',
    q: 'Какой вариант вызовет меньше ререндеров строк при смене выбранной?',
    options: ['<Row :row="r" :selected-id="selectedId" />', '<Row :row="r" :selected="r.id === selectedId" />', '<Row :row="{ ...r }" :selected="r.id === selectedId" />', '<Row :row="r" :state="{ selectedId }" />'],
    correct: [1],
    explain: 'Булев флаг меняется только у двух строк. selectedId меняется у всех, а новые объекты в шаблоне создаются на каждый рендер родителя и всегда считаются новыми пропсами.'
  },
  {
    id: 'qz-vue-render-opt-2',
    topic: 'vue-render-opt',
    type: 'single',
    q: 'Что делает v-memo="[item.selected]" на элементе v-for?',
    options: ["Рендерит элемент один раз навсегда", "Кеширует элемент в localStorage", "Делает item.selected нереактивным", "Пропускает обновление элемента, пока item.selected не изменится"],
    correct: [3],
    explain: 'v-memo сравнивает массив зависимостей с прошлым рендером и при совпадении пропускает обновление поддерева. Если изменится другое поле, например title, без него в списке строка не обновится.'
  },
  {
    id: 'qz-vue-render-opt-3',
    topic: 'vue-render-opt',
    type: 'single',
    q: 'Что в первую очередь даёт виртуализация длинного списка?',
    options: ["В DOM только видимые элементы, меньше узлов и работы браузера", "Меньше запросов к серверу", "Отключение реактивности", "Автоматическую мемоизацию компонентов"],
    correct: [0],
    explain: 'Виртуальный список рендерит видимую часть с небольшим запасом и подменяет элементы при скролле. Объём данных в памяти и число запросов он не меняет.'
  },
  {
    id: 'qz-vue-lazy-1',
    topic: 'vue-lazy',
    type: 'single',
    q: 'Зачем опция delay в defineAsyncComponent?',
    options: ["Задержать загрузку компонента", "Повторить загрузку после ошибки", "Не показывать loadingComponent, если загрузка уложилась в это время", "Отложить гидрацию"],
    correct: [2],
    explain: 'Если чанк загружается быстрее delay, скелетон не появится и не мигнёт. Повторы и таймаут задаются другими опциями.'
  },
  {
    id: 'qz-vue-lazy-2',
    topic: 'vue-lazy',
    type: 'multi',
    q: 'Что разумно загружать лениво?',
    options: ['Страницу админки', 'Тяжёлый редактор текста в модалке', 'Шапку сайта на первом экране', 'Библиотеку графиков в личном кабинете'],
    correct: [0, 1, 3],
    explain: 'Шапка видна сразу, и ленивая загрузка только задержит её и сдвинет вёрстку. Лениво грузят то, что нужно не всем или не сразу.'
  },
  {
    id: 'qz-vue-lazy-3',
    topic: 'vue-lazy',
    type: 'single',
    q: 'Что нужно, чтобы отрендерился компонент с await на верхнем уровне <script setup>?',
    options: ["Ничего, Vue дождётся сам", "Опция async: true в defineOptions", "Обернуть в KeepAlive", "Обёртка Suspense выше по дереву"],
    correct: [3],
    explain: 'Компонент с top-level await становится асинхронной зависимостью, и рендерить его можно только внутри Suspense, который ждёт разрешения и показывает fallback.'
  },
  {
    id: 'qz-vue-devtools-1',
    topic: 'vue-devtools',
    type: 'single',
    q: 'Где в Vue DevTools удобнее всего увидеть последовательность: событие компонента, вызов action, изменение стора?',
    options: ['Components', 'Timeline', 'Router', 'Assets'],
    correct: [1],
    explain: 'Timeline показывает события по времени на нескольких дорожках: события компонентов, Pinia, роутер, производительность. В Components видно только текущее состояние.'
  },
  {
    id: 'qz-vue-devtools-2',
    topic: 'vue-devtools',
    type: 'single',
    q: 'Почему замеры производительности Vue нужно перепроверять на production-сборке?',
    options: ["В production нет Virtual DOM", "DevTools не работают в dev", "В dev-режиме есть дополнительные проверки и предупреждения, он медленнее", "В production отключена реактивность"],
    correct: [2],
    explain: 'Dev-сборка включает валидацию пропсов, предупреждения и инструменты отладки, поэтому абсолютные цифры там хуже. Найденные узкие места стоит подтверждать на production-сборке.'
  }
);
