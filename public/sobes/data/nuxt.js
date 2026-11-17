window.SOBES = window.SOBES || { topics: [] };

/* ===================== Nuxt — Основы ===================== */
window.SOBES.topics.push(
  {
    id: 'nuxt-rendering',
    section: 'nuxt',
    group: 'Основы',
    title: 'Режимы рендеринга: SSR, CSR, SSG, гибридный',
    level: 'middle',
    summary: 'Режим определяет, где и когда собирается HTML: на сервере на каждый запрос (SSR), в браузере (CSR) или заранее при сборке (SSG). В Nuxt их смешивают по адресам через `routeRules`.',
    points: [
      { title: 'По умолчанию SSR: сервер отдаёт готовый HTML, браузер его гидратирует', text: 'На каждый запрос сервер выполняет компоненты и отдаёт HTML, затем Vue в браузере подключает реактивность и обработчики. Это даёт быстрый первый экран и нормальное SEO, но нужен сервер и код должен работать в двух средах.', code: `// nuxt.config.ts — ничего указывать не нужно
export default defineNuxtConfig({
  ssr: true // значение по умолчанию
})`, lang: 'ts' },
      { title: '`ssr: false` — SPA, `nuxi generate` — статика на весь сайт', text: 'Без SSR сервер отдаёт почти пустой HTML и JS, страница строится в браузере. `generate` пререндерит все страницы в `.output/public`, их можно положить на любой хостинг.', code: `// весь сайт как SPA — для админки за логином
export default defineNuxtConfig({ ssr: false })

// статика на весь сайт:
// npx nuxi generate  -> .output/public`, lang: 'ts' },
      { title: 'Гибридный рендеринг: свой режим для каждого адреса через `routeRules`', text: 'Там же задают кеш, редиректы и заголовки. Выбор режима — компромисс между SEO, свежестью данных и нагрузкой на сервер, и гибрид позволяет не выбирать один на весь сайт.', code: `export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },       // HTML при сборке
    '/blog/**': { isr: 3600 },      // кеш на CDN платформы
    '/catalog/**': { swr: 600 },    // кеш Nitro, обновление в фоне
    '/account/**': { ssr: false },  // только в браузере
    '/old-page': { redirect: '/new-page' }
  }
})`, lang: 'ts' },
      { title: '`swr` кеширует в Nitro, `isr` — на CDN платформы', text: 'Оба отдают страницу из кеша и после истечения срока обновляют её в фоне. `swr` работает на любом сервере, включая обычный Node. `isr` рассчитан на Vercel, Netlify и похожие платформы: кеш живёт на их CDN и переживает перезапуск; на других пресетах поведение зависит от платформы.' },
      { title: 'Ловушка: `swr`/`isr` на странице с личными данными', text: 'Кеш общий для всех. Один пользователь получит страницу, отрендеренную для другого. Кешировать можно только то, что не зависит от пользователя.', code: `routeRules: {
  '/catalog/**': { swr: 600 },  // ок: одинаково для всех
  '/account/**': { swr: 600 }   // нельзя: чужой кабинет из кеша
}`, lang: 'ts' },
      { title: 'Prerender замораживает данные на момент сборки', text: 'HTML готов до деплоя, сервер при запросе не участвует. Всё, что получено через `useFetch`, обновится только пересборкой. А `ssr: false` на публичных страницах «для простоты» оставляет поисковики и превью в мессенджерах с пустым HTML.' }
    ],
    takeaway: 'SSR — публичные страницы с меняющимися данными, prerender — редко меняющийся контент, CSR — кабинеты и админки, `swr`/`isr` — только для страниц, одинаковых для всех.',
    questions: [
      { q: 'Какие режимы рендеринга есть в Nuxt и как выбрать подходящий?', a: 'По умолчанию Nuxt работает в режиме SSR: HTML собирается на сервере, а браузер его гидратирует. Можно выключить SSR и получить SPA или пререндерить страницы при сборке. На практике режимы смешивают через `routeRules`: лендинг пререндерю, каталог отдаю через SSR с `swr`, кабинет делаю без SSR. Выбираю по трём вопросам: нужно ли SEO, как часто меняются данные и зависит ли страница от пользователя.' },
      { q: 'Чем swr отличается от isr в routeRules?', a: 'Идея одна: отдать страницу из кеша, а по истечении срока обновить её в фоне. Разница в том, где живёт кеш. `swr` кеширует на стороне Nitro и работает на обычном Node-сервере. `isr` рассчитан на платформы вроде Vercel или Netlify, где страница кешируется на их CDN и переживает перезапуск сервера. В обоих случаях нельзя кешировать страницы, которые зависят от пользователя.' },
      { q: 'Зачем вообще SSR, если есть SPA?', a: 'Главное — первый экран и SEO. В SPA браузер сначала получает почти пустую страницу и ждёт загрузки JS, а краулеры и превью ссылок видят мало контента. SSR сразу отдаёт готовый HTML, контент появляется раньше и надёжно индексируется. Цена — нужен сервер, растёт нагрузка, и код должен корректно работать в двух средах. Для закрытых кабинетов SPA обычно достаточно.' }
    ]
  },
  {
    id: 'nuxt-hydration',
    section: 'nuxt',
    group: 'Основы',
    title: 'Гидратация и hydration mismatch',
    level: 'middle',
    summary: 'Гидратация — Vue в браузере «подхватывает» HTML с сервера, не пересоздавая DOM. Mismatch — браузерный рендер дал не то, что серверный.',
    points: [
      { title: 'При гидратации `setup` выполняется ещё раз, а DOM переиспользуется', text: 'Vue заново строит виртуальное дерево, сопоставляет его с готовой разметкой и только навешивает обработчики и реактивность. Если результат не совпал, в dev будет предупреждение, а у пользователя — мигание, перерисовки или битая разметка. В обычном SPA mismatch не бывает: сравнивать не с чем.' },
      { title: 'Mismatch дают значения, которые отличаются между средами', text: 'Время, случайные числа, `window`, `localStorage`, размер экрана, часовой пояс и локаль. Проверка `typeof window` прямо в `setup` тоже: сервер и браузер выберут разные ветки.', code: `<script setup>
const now = new Date().toLocaleTimeString() // разное время
const rnd = Math.random()                   // разные числа
const theme = typeof window !== 'undefined'
  ? localStorage.getItem('theme') : null    // разные ветки
</script>`, lang: 'vue' },
      { title: 'Невалидный HTML — тоже mismatch', text: 'Браузер чинит разметку при парсинге ещё до гидратации, например выталкивает `div` из `p`. DOM уже не тот, что ожидает Vue.', code: `<p><div>блок внутри параграфа</div></p>  <!-- mismatch -->
<div><div>так можно</div></div>`, lang: 'html' },
      { title: 'Браузерные данные — в `onMounted`, серверное значение — через `useState`', text: 'Первая отрисовка в браузере должна совпасть с серверной, значит показывает значение по умолчанию. Реальное читаем после монтирования — это обычное обновление. Значение, посчитанное на сервере, `useState` передаёт в браузер через payload.', code: `const theme = ref('light')
onMounted(() => {
  theme.value = localStorage.getItem('theme') ?? 'light'
})

const renderedAt = useState('rendered-at', () => Date.now())`, lang: 'ts' },
      { title: 'id для `label` и `aria-*` — только через `useId()`', text: '`Math.random()` разойдётся между средами, а глобальный счётчик на сервере ещё и растёт между запросами. `useId()` строит id из положения компонента в дереве. В самом Vue он есть с 3.5.', code: `<script setup>
const inputId = useId()
</script>
<template>
  <label :for="inputId">Имя</label>
  <input :id="inputId">
</template>`, lang: 'vue' },
      { title: 'Ловушка: лечить всё через `<ClientOnly>`', text: 'Контент пропадает из серверного HTML, страдает SEO, вёрстка прыгает. `<ClientOnly>` — для чисто браузерных блоков, и с заглушкой того же размера. Если значение нужно уже на сервере (тема, язык) — держите его в cookie. Для заведомо допустимых расхождений в Vue 3.5+ есть атрибут `data-allow-mismatch`.', code: `<ClientOnly>
  <LocalClock />
  <template #fallback><span class="clock-skeleton" /></template>
</ClientOnly>

<time data-allow-mismatch="text">{{ localTime }}</time>`, lang: 'vue' }
    ],
    takeaway: 'Первый рендер должен быть одинаковым на сервере и в браузере: всё браузерное — после `onMounted`, общее с сервером — через `useState`, `useCookie`, `useId`.',
    questions: [
      { q: 'Что такое гидратация и откуда берётся hydration mismatch?', a: 'Гидратация — это когда Vue в браузере «подхватывает» серверный HTML: заново выполняет компоненты и сопоставляет результат с существующим DOM, не пересоздавая его, а только навешивая обработчики и реактивность. Mismatch — когда браузерный рендер дал другое. Типичные причины — значения, различающиеся между средами: время, случайные числа, `window` или `localStorage` прямо в рендере. Ещё одна причина — невалидный HTML, например `div` внутри `p`: браузер исправляет такую разметку при парсинге ещё до гидратации.' },
      { q: 'Как исправить mismatch, если компонент показывает данные из localStorage?', a: 'Сервер не видит `localStorage`, поэтому первая отрисовка в браузере должна совпасть с серверной, то есть показать значение по умолчанию. Реальное значение читаю в `onMounted` — это уже обычное обновление после гидратации. Если блок целиком браузерный, оборачиваю его в `<ClientOnly>` с заглушкой того же размера. А если значение нужно уже на сервере, как тема или язык, храню его в cookie через `useCookie` — её видят обе стороны.' },
      { q: 'Зачем нужен useId, почему не сгенерировать id самому?', a: 'Стабильные id нужны для доступности: связать `label` и `input`, `aria-describedby` и подсказку. `Math.random()` даст разные значения на сервере и в браузере, а глобальный счётчик на сервере ещё и растёт между запросами. `useId()` строит id из положения компонента в дереве, поэтому он совпадает в обеих средах. В Nuxt он появился раньше, в самом Vue — с версии 3.5.' }
    ]
  },
  {
    id: 'nuxt-server-client-components',
    section: 'nuxt',
    group: 'Основы',
    title: 'Серверные и клиентские компоненты, ClientOnly, islands',
    level: 'middle+',
    summary: '`.client.vue` рендерится только в браузере. `.server.vue` (island) — только на сервере, его код в бандл не попадает; это экспериментальная возможность.',
    points: [
      { title: '`.client.vue` — компонент только для браузера, его модуль не грузится на сервере', text: 'В серверном HTML на его месте пусто, компонент монтируется после гидратации. Подходит для карт, графиков, редакторов и всего, что трогает `window` при импорте.', code: `<!-- components/MapView.client.vue -->
<script setup lang="ts">
import L from 'leaflet' // на сервере не выполнится
const el = useTemplateRef<HTMLDivElement>('map')
onMounted(() => L.map(el.value!).setView([55.75, 37.6], 10))
</script>
<template><div ref="map" class="map" /></template>`, lang: 'vue' },
      { title: '`<ClientOnly>` ставят в месте использования, и он умеет заглушку', text: 'Результат похож на `.client.vue`, но импорт обёрнутого компонента всё равно выполнится при SSR. Если библиотека трогает `window` при импорте, сервер упадёт — нужен `.client.vue` или `import()` в `onMounted`.', code: `<ClientOnly>
  <ChartWidget :data="stats" />
  <!-- заглушка того же размера, чтобы не прыгала вёрстка -->
  <template #fallback><div class="skeleton" style="height: 300px" /></template>
</ClientOnly>`, lang: 'vue' },
      { title: '`.server.vue` (island) рендерится только на сервере, без JS в браузере', text: 'Браузер получает HTML, а код компонента и его тяжёлые зависимости в бандл не попадают. Хорошо для markdown, подсветки кода, больших статичных блоков. Нужен флаг `experimental.componentIslands`; низкоуровневый вариант — `<NuxtIsland>`.', code: `<!-- components/ArticleBody.server.vue -->
<script setup lang="ts">
import { marked } from 'marked' // не попадёт в браузер
const props = defineProps<{ source: string }>()
const html = marked.parse(props.source)
</script>
<template><article v-html="html" /></template>`, lang: 'vue' },
      { title: 'Ловушка: островок статичен, а каждая смена пропсов — запрос к серверу', text: 'Внутри `.server.vue` нет обработчиков и реактивности: браузер получает готовую разметку. При смене пропсов Nuxt отдельным запросом забирает новый HTML. Встроить интерактивные клиентские части в островок можно, но это тоже экспериментальная опция `selectiveClient`.' },
      { title: 'Nuxt vs React Server Components: по умолчанию всё наоборот', text: 'В Next App Router компоненты серверные по умолчанию, а клиентские помечают `\'use client\'`. В Nuxt компоненты универсальные, а серверные островки включают явно, и API пока экспериментальный — строить на нём критичную часть рискованно.' }
    ],
    takeaway: 'Не работает на сервере — `.client.vue`. Тяжёлый статичный блок — можно `.server.vue`, помня, что это эксперимент.',
    questions: [
      { q: 'Есть ли в Nuxt аналог React Server Components?', a: 'Ближайший аналог — серверные компоненты (islands): файлы `.server.vue` или `<NuxtIsland>`. Они рендерятся только на сервере, браузер получает HTML, а код компонента и его зависимости в бандл не попадают. Принципиальное отличие от Next — что по умолчанию: там всё серверное, а клиентское помечают явно; в Nuxt всё универсальное, а островки включают явно. Это экспериментальная фича под флагом `experimental.componentIslands`. Ещё нюанс: при смене пропсов островок перезапрашивает HTML с сервера отдельным запросом.' },
      { q: 'Чем .client.vue отличается от обёртки ClientOnly?', a: 'Результат похожий: в серверном HTML контента нет, в браузере он появляется после гидратации. `.client.vue` — свойство самого компонента: его модуль вообще не выполняется на сервере. `<ClientOnly>` ставится в месте использования и умеет `fallback`, но если обёрнутый компонент при импорте трогает `window`, сервер всё равно упадёт. Поэтому если компонент в принципе не работает на сервере, делаю его `.client.vue`.' }
    ]
  },
  {
    id: 'nuxt-structure',
    section: 'nuxt',
    group: 'Основы',
    title: 'Структура приложения и автоимпорты',
    level: 'junior',
    summary: 'Роль файла задаёт папка: `pages/` — маршруты, `server/` — бэкенд, а компоненты, composables и utils импортируются автоматически.',
    points: [
      { title: 'Папка определяет назначение файла', text: 'Роутер, регистрация компонентов и импорты не пишутся руками, а любой Nuxt-разработчик сразу ориентируется в чужом проекте.', code: `app.vue        # корень: <NuxtLayout><NuxtPage/></NuxtLayout>
pages/         # страницы = маршруты
layouts/       # default.vue, admin.vue
components/    # ui/Button.vue -> <UiButton>
composables/   # useCart.ts -> useCart()
utils/         # formatPrice.ts -> formatPrice()
middleware/    # auth.ts, analytics.global.ts
plugins/       # api.ts, 01.sentry.client.ts
server/        # api/, middleware/, utils/ — Nitro`, lang: 'bash' },
      { title: 'В Nuxt 4 клиентский код по умолчанию лежит в `app/`', text: 'Это отличие от Nuxt 3, где всё лежало в корне. В `app/` переехали `pages`, `components`, `composables`, `layouts`, `plugins`, `assets`, `app.vue`. В корне остались `server/`, `public/` и `nuxt.config.ts`, плюс появилась `shared/` для кода, общего для клиента и сервера.', code: `app/
  pages/  components/  composables/  app.vue
server/
shared/
public/
nuxt.config.ts`, lang: 'bash' },
      { title: 'Автоимпорт подставляет импорты при сборке, а не регистрирует глобально', text: 'Nuxt сканирует папки и подставляет импорт там, где имя используется, поэтому неиспользуемое в бандл не попадает. Типы генерируются в `.nuxt/`, IDE их видит. API Vue (`ref`, `computed`) тоже импортируется сам.', code: `<script setup lang="ts">
// ни одного import
const { items, total } = useCart()
const count = computed(() => items.value.length)
</script>
<template>
  <UiButton>{{ count }} на {{ formatPrice(total) }}</UiButton>
</template>`, lang: 'vue' },
      { title: 'Ловушка: composable во вложенной папке не импортируется', text: 'По умолчанию сканируется верхний уровень `composables/` и `utils/` плюс `index`-файлы подпапок. Остальное добавляют через `imports.dirs`.', code: `// nuxt.config.ts
export default defineNuxtConfig({
  imports: { dirs: ['composables/**'] }
})`, lang: 'ts' },
      { title: '`public/` отдаётся как есть, `assets/` обрабатывает сборщик', text: '`public/` — favicon, `robots.txt`, доступны от корня сайта. Файлы из `assets/` импортируют из кода и стилей, при сборке они получают хеш в имени.', code: `<img src="/logo.png">                 <!-- public/logo.png -->
<img src="~/assets/hero.jpg">          <!-- через сборщик -->`, lang: 'html' },
      { title: 'composables vs utils vs server/utils', text: 'Первые два автоимпортируются, разница смысловая: composable — функция с реактивностью и контекстом Nuxt (`useXxx`), util — обычный помощник. `server/utils` видны только в серверном коде и в бандл не попадают; импортировать код из `server/` в клиент нельзя.' },
      { title: 'Ловушка: состояние в переменной модуля composable', text: 'На сервере модуль загружается один раз на процесс, и такая переменная общая для всех запросов. Состояние — внутрь функции через `useState`.', code: `const cart = ref([])          // общий для всех пользователей на сервере
export const useCart = () => {
  const cart = useState('cart', () => []) // ок: свой на запрос
  return { cart }
}`, lang: 'ts' }
    ],
    takeaway: 'Следуй соглашениям папок; в Nuxt 4 клиентское — в `app/`, серверное — в `server/`, общее — в `shared/`.',
    questions: [
      { q: 'Расскажи про структуру Nuxt-проекта. Что где лежит?', a: 'Nuxt строится на соглашениях: роль файла определяет папка. `pages/` превращаются в маршруты, `layouts/` оборачивают страницы, `app.vue` — корень. `components/`, `composables/` и `utils/` автоимпортируются. `middleware/` — проверки перед переходом, `plugins/` — инициализация вроде API-клиента или Sentry. В `server/` живёт бэкенд на Nitro: эндпоинты, серверные middleware и утилиты. Статика делится на `public/`, которая отдаётся как есть, и `assets/`, которые обрабатывает сборщик. В Nuxt 4 клиентская часть по умолчанию переехала в `app/`, а для общего с сервером кода есть `shared/`.' },
      { q: 'Как работают автоимпорты и какие у них минусы?', a: 'Это не глобальная регистрация: при сборке Nuxt сканирует нужные папки и подставляет импорты там, где имя используется, поэтому неиспользуемое в бандл не попадает. Типы генерируются в `.nuxt/`, так что IDE и TypeScript всё видят. Минусы — меньше явности, возможны конфликты имён, и по умолчанию сканируется только верхний уровень папок composables и utils. Если нужна явность, можно импортировать из `#imports` или отключить автоимпорт в конфиге.' }
    ]
  },
  {
    id: 'nuxt-routing',
    section: 'nuxt',
    group: 'Основы',
    title: 'File-based routing и definePageMeta',
    level: 'junior',
    summary: 'Маршруты генерируются из файлов в `pages/`: `[id]` — параметр, `[...slug]` — catch-all, файл рядом с одноимённой папкой — вложенный маршрут. Под капотом обычный vue-router.',
    points: [
      { title: 'Имя файла задаёт адрес, скобки — параметры', text: '`[id]` — обязательный параметр, `[[page]]` — необязательный, `[...slug]` забирает остаток пути массивом. Корневой `[...slug].vue` удобен для своей 404.', code: `pages/index.vue            -> /
pages/users/[id].vue       -> /users/42     params.id = '42'
pages/blog/[[page]].vue    -> /blog и /blog/2
pages/docs/[...slug].vue   -> /docs/a/b     params.slug = ['a','b']
pages/[...slug].vue        -> всё остальное`, lang: 'bash' },
      { title: 'Вложенный маршрут: файл + папка с тем же именем + `<NuxtPage />`', text: 'Родитель рендерит общую часть, например меню кабинета, а дочерняя страница подставляется в `<NuxtPage />`. Layout — это другое: внешняя обёртка, общая для разных страниц.', code: `pages/account.vue          -> родитель, внутри <NuxtPage />
pages/account/orders.vue   -> /account/orders
pages/account/profile.vue  -> /account/profile`, lang: 'bash' },
      { title: '`definePageMeta` — настройки маршрута: layout, middleware, validate', text: 'Если `validate` вернул `false`, Nuxt покажет 404. Для `<head>` и SEO нужен не он, а `useHead`/`useSeoMeta`.', code: `definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  validate: (route) => /^\\d+$/.test(String(route.params.id))
})`, lang: 'ts' },
      { title: 'Ловушка: в `definePageMeta` нельзя переменные из `setup`', text: 'Это макрос компилятора: при сборке он выносится из компонента. Литералы и импорты работают, локальные переменные — нет.', code: `const role = 'admin'
definePageMeta({ layout: role })     // не сработает
definePageMeta({ layout: 'admin' })  // ок`, lang: 'ts' },
      { title: 'Ловушка: `/users/1` → `/users/2` переиспользует тот же компонент', text: '`setup` второй раз не выполнится. Если запрос не зависит от параметра реактивно, останутся старые данные. Параметры маршрута — всегда строки.', code: `const route = useRoute()
// адрес-функция: при смене id запрос повторится
const { data: user } = await useFetch(() => '/api/users/' + route.params.id)

route.params.id === 42  // всегда false: там строка '42'`, lang: 'ts' },
      { title: 'Ручная донастройка роутера нужна редко', text: 'Для маршрутов из CMS или одного компонента на несколько адресов есть `app/router.options.ts` и хук `pages:extend`.' }
    ],
    takeaway: 'Структура `pages/` и есть карта сайта; настройки маршрута — в `definePageMeta`, данные по параметру — через реактивный адрес.',
    questions: [
      { q: 'Как в Nuxt сделать динамический маршрут и catch-all?', a: 'Имя файла в квадратных скобках делает сегмент параметром: `pages/users/[id].vue` ловит `/users/42`, значение — в `useRoute().params.id`, и это строка. Двойные скобки делают параметр необязательным. Catch-all — `[...slug].vue`: он забирает остаток пути массивом, через него удобно делать вложенные категории или свою 404. Проверить параметр можно через `validate` в `definePageMeta`: при `false` Nuxt отдаст 404.' },
      { q: 'Как сделать вложенные маршруты и что такое definePageMeta?', a: 'Кладу рядом `account.vue` и папку `account/` с дочерними страницами. В `account.vue` рендерю общую часть, например меню, и `<NuxtPage />`, куда подставится дочерняя страница. `definePageMeta` — макрос, через который страница передаёт роутеру настройки: layout, middleware, имя, проверку параметров, произвольные meta. Он обрабатывается при сборке и выносится из компонента, поэтому внутри можно использовать литералы и импорты, но не переменные из `setup`.' }
    ]
  },
  {
    id: 'nuxt-middleware',
    section: 'nuxt',
    group: 'Основы',
    title: 'Route middleware и серверные middleware',
    level: 'middle',
    summary: 'Route middleware выполняется перед переходом на страницу и решает «пустить, перенаправить, отменить». Серверный middleware Nitro — на каждый HTTP-запрос, включая API.',
    points: [
      { title: 'Три вида route middleware: анонимный, именованный, глобальный', text: 'Анонимный пишут прямо в `definePageMeta` для одной страницы. Именованный — файл в `middleware/`, подключается по имени. Глобальный — суффикс `.global`, срабатывает на каждом переходе; порядок глобальных задают префиксом в имени файла.', code: `// middleware/auth.ts -> definePageMeta({ middleware: 'auth' })
// middleware/01.analytics.global.ts -> на каждом переходе
definePageMeta({
  middleware: [(to) => { if (!to.query.ok) return abortNavigation() }]
})`, lang: 'ts' },
      { title: 'Результат — это возвращённое значение, без `return` редирект не сработает', text: '`navigateTo()` — редирект, `abortNavigation()` — отмена, ничего — переход продолжается. Сам вызов `navigateTo` выполнение не прерывает.', code: `export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token')
  if (!token.value) {
    navigateTo('/login')         // не сработает: нет return
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } }) // ок
  }
})`, lang: 'ts' },
      { title: 'При первом заходе route middleware выполняется на сервере и ещё раз при гидратации', text: 'Дальше — только в браузере. Значит, `window` и `localStorage` без проверки среды трогать нельзя, а запрос внутри может уйти дважды; клиентский прогон пропускают по `nuxtApp.isHydrating`.', code: `export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return
  if (useNuxtApp().isHydrating) return // уже отработал на сервере
  window.ym?.(12345, 'hit', to.fullPath)
})`, lang: 'ts' },
      { title: 'Серверный middleware ничего не возвращает — он готовит `event`', text: 'Лежит в `server/middleware/` и вызывается до обработчика на каждый запрос. Обычно кладёт данные в `event.context` или бросает `createError`. Если вернуть значение, оно станет ответом, и обработчик маршрута не вызовется.', code: `// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  if (token) event.context.user = await verifyToken(token)
  if (event.path.startsWith('/api/admin') && !event.context.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})`, lang: 'ts' },
      { title: 'Route middleware в браузере — это UX, а не защита', text: 'Проверку на клиенте легко обойти прямым запросом к API. Права на данные проверяются только на сервере.' }
    ],
    takeaway: 'Страницы закрывает route middleware с `return navigateTo()`, данные — серверный middleware или проверка в обработчике.',
    questions: [
      { q: 'Какие бывают route middleware в Nuxt?', a: 'Три вида. Анонимный пишется прямо в `definePageMeta` и нужен одной странице. Именованный — файл в `middleware/`, подключается по имени, классический пример — `auth`. Глобальный — файл с суффиксом `.global`, срабатывает на каждом переходе, а порядок глобальных задают префиксами в имени. Внутри возвращаю `navigateTo()` для редиректа или `abortNavigation()` для отмены; если ничего не вернуть, переход продолжится.' },
      { q: 'Чем route middleware отличается от серверного middleware в server/middleware?', a: 'Route middleware — часть Vue-приложения: работает на уровне навигации, при первом заходе выполняется на сервере (и ещё раз при гидратации), дальше — в браузере. Серверный middleware — часть Nitro: вызывается на каждый HTTP-запрос, включая API, ничего не знает о страницах и работает с `event`. Обычно он кладёт данные в `event.context` или бросает `createError`, но ответ не возвращает. Для защиты данных нужен серверный уровень, клиентский — только про удобство.' },
      { q: 'Почему редирект в middleware не сработал, хотя navigateTo вызывается?', a: 'Чаще всего забыли `return`. Сам вызов `navigateTo()` выполнение middleware не прерывает: Nuxt смотрит на возвращённое значение, и если оно пустое, переход идёт дальше. Поэтому пишу `return navigateTo(...)`. На сервере это превращается в HTTP-редирект (по умолчанию 302), в браузере — в обычную навигацию.' }
    ]
  },
  {
    id: 'nuxt-plugins',
    section: 'nuxt',
    group: 'Основы',
    title: 'Плагины Nuxt',
    level: 'middle',
    summary: 'Плагин — код, который выполняется при создании приложения, до первого рендера: подключает библиотеки и раздаёт хелперы через `provide`.',
    points: [
      { title: 'Плагин выполняется на сервере на каждый запрос, в браузере — один раз', text: 'Внутри доступен `nuxtApp` и `nuxtApp.vueApp`: можно подключить Vue-плагин, директиву, подписаться на хуки. Vue-плагин и Nuxt-плагин — разные вещи: первый подключают внутри второго.', code: `// plugins/toast.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, { timeout: 3000 })
})`, lang: 'ts' },
      { title: '`provide` раздаёт хелпер как `$имя` с типами', text: 'Хелпер доступен через `useNuxtApp()` и в шаблонах, Nuxt сам выводит типы. На сервере он привязан к конкретному запросу — безопаснее глобальных переменных.', code: `// plugins/api.ts
export default defineNuxtPlugin(() => {
  const token = useCookie('token')
  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiBase,
    onRequest: ({ options }) => { if (token.value) options.headers.set('Authorization', 'Bearer ' + token.value) }
  })
  return { provide: { api } } // const { $api } = useNuxtApp()
})`, lang: 'ts' },
      { title: 'Среду задаёт суффикс `.client` / `.server`', text: 'Библиотека, которая трогает `window`, в универсальном плагине уронит SSR. Нужен `.client` или проверка `import.meta.client`.', code: `plugins/01.sentry.client.ts  // только браузер
plugins/logger.server.ts     // только сервер`, lang: 'bash' },
      { title: 'Порядок алфавитный по имени файла, явный — `enforce` и `dependsOn`', text: 'Ловушка: сортировка строковая, `10.` окажется раньше `2.`, поэтому префиксы пишут с нулём. Независимые асинхронные плагины помечают `parallel: true`, чтобы не ждать друг друга.', code: `export default defineNuxtPlugin({
  name: 'sentry',
  enforce: 'pre',   // раньше обычных
  parallel: true,   // не блокировать следующие
  async setup(nuxtApp) {
    const Sentry = await import('@sentry/vue')
    Sentry.init({ app: nuxtApp.vueApp, dsn: useRuntimeConfig().public.sentryDsn })
  }
})`, lang: 'ts' },
      { title: 'Ловушка: плагин — не место для всего подряд', text: 'Плагины выполняются на каждый SSR-запрос, и долгий `await` задерживает рендер каждой страницы. Логика для части страниц — в composable. Данные пользователя в переменных модуля плагина смешаются между запросами.' },
      { title: '`plugins/` vs `server/plugins/`', text: '`server/plugins` — плагины Nitro: выполняются один раз при старте сервера, а не на каждый запрос, и к Vue-приложению отношения не имеют.' }
    ],
    takeaway: 'Плагин — для глобальной инициализации до рендера (API-клиент, Sentry, Vue-библиотеки); всё остальное — в composables.',
    questions: [
      { q: 'Что такое плагин в Nuxt и зачем там provide?', a: 'Плагин — код инициализации приложения: выполняется до рендера, на сервере на каждый запрос и в браузере один раз. Туда кладу то, что нужно глобально: Vue-плагины, директивы, Sentry, настроенный API-клиент. Если вернуть `provide`, хелпер станет доступен как `$имя` через `useNuxtApp()` и в шаблонах, и Nuxt выведет для него типы. Это безопаснее глобальных переменных, потому что на сервере привязано к конкретному запросу.' },
      { q: 'Как управлять порядком и средой выполнения плагинов?', a: 'По умолчанию порядок алфавитный по имени файла, поэтому ставят префиксы вроде `01.sentry.client.ts`. В объектной записи есть `enforce: \'pre\' | \'post\'` и `dependsOn` с именами других плагинов. Независимые асинхронные плагины можно пометить `parallel: true`, чтобы они не ждали друг друга. Среду задаю суффиксом `.client` или `.server`. И не путаю с `server/plugins` — это плагины Nitro, они выполняются один раз при старте сервера.' }
    ]
  },
  {
    id: 'nuxt-nitro',
    section: 'nuxt',
    group: 'Основы',
    title: 'Nitro и серверные API',
    level: 'middle',
    summary: 'Nitro — серверный движок Nuxt на h3: эндпоинты из `server/`, SSR, кеш и сборка под разные платформы через пресеты.',
    points: [
      { title: 'Путь файла даёт адрес, суффикс — HTTP-метод', text: '`server/api/` даёт адреса с префиксом `/api`, `server/routes/` — без префикса. `server/middleware` выполняется на каждый запрос, `server/plugins` — один раз при старте.', code: `server/api/products/[id].get.ts  -> GET  /api/products/42
server/api/feedback.post.ts      -> POST /api/feedback
server/routes/sitemap.xml.ts     -> GET  /sitemap.xml`, lang: 'bash' },
      { title: 'Обработчик возвращает значение, а не пишет в `res`', text: 'Объект сериализуется в JSON — в отличие от Express, где ответ пишут вручную. Данные запроса достают хелперами h3: `getQuery`, `readBody`, `getRouterParam`, `getCookie`.', code: `export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const product = await db.product.findUnique({ where: { id } })
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }
  return product // станет JSON
})`, lang: 'ts' },
      { title: 'Ошибка — только через `createError` со статусом', text: 'Объект `{ error: ... }` со статусом 200 клиент не распознает как ошибку. С `createError` `useFetch` получит её в `error`, а `$fetch` бросит исключение.' },
      { title: 'Ловушка: `readBody<T>` ничего не проверяет', text: 'Дженерик — только подсказка для TypeScript. Тело валидируют вручную или через `readValidatedBody` со схемой.', code: `const body = await readValidatedBody(event, z.object({
  name: z.string(),
  phone: z.string().min(10)
}).parse)`, lang: 'ts' },
      { title: 'Секреты читаются только на сервере — для этого Nitro и нужен как BFF', text: 'Ключи внешних API не уходят в браузер: фронт зовёт свой `/api`, а тот — внешний сервис.', code: `const { telegramToken, telegramChat } = useRuntimeConfig(event)
await $fetch('https://api.telegram.org/bot' + telegramToken + '/sendMessage', {
  method: 'POST',
  body: { chat_id: telegramChat, text: body.name + ': ' + body.phone }
})
setResponseStatus(event, 201)
return { ok: true }`, lang: 'ts' },
      { title: 'Пресет адаптирует `.output` под платформу', text: 'По умолчанию `node-server`. Для Vercel, Netlify, Cloudflare есть свои пресеты, часть определяется автоматически; вручную — `NITRO_PRESET` или `nitro.preset`. Ловушка: в edge-средах нет части Node API, и не все драйверы БД работают.' }
    ],
    takeaway: 'Nitro — для BFF, прокси с секретами, форм и вебхуков; большой бэкенд с очередями и сложной доменной логикой лучше держать отдельным сервисом.',
    questions: [
      { q: 'Что такое Nitro и как написать API-эндпоинт в Nuxt?', a: 'Nitro — серверный движок Nuxt на h3: он отвечает за SSR, кеширование и API. Чтобы сделать эндпоинт, кладу файл в `server/api/`: путь файла даёт адрес, суффикс `.get` или `.post` — метод. В `defineEventHandler` получаю `event` и достаю данные хелперами: `getQuery`, `readBody`, `getRouterParam`. Возвращаю объект — Nitro отдаст JSON. Для ошибок бросаю `createError` со `statusCode`, и `useFetch` на клиенте получит её в `error`.' },
      { q: 'Что такое деплой-пресеты Nitro?', a: 'Пресет определяет, в каком виде Nitro собирает серверную часть. По умолчанию — `node-server`: обычный Node-процесс из `.output/server`. Для Vercel, Netlify, Cloudflare и других есть свои пресеты, которые превращают обработчики в функции платформы; на ряде платформ нужный пресет определяется автоматически при сборке. Вручную — через `NITRO_PRESET` или `nitro.preset` в конфиге. Важно помнить, что в edge-средах доступна не вся Node API.' }
    ]
  },

  /* ===================== Nuxt — Composables и API ===================== */
  {
    id: 'nuxt-usefetch',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useFetch',
    level: 'middle',
    summary: '`useFetch` грузит данные по URL с поддержкой SSR: запрос идёт на сервере, результат уезжает в браузер через payload, повторного запроса при гидратации нет.',
    points: [
      { title: 'Запрос на сервере, данные в payload — в браузере второго запроса нет', text: 'Payload — данные, которые сервер отправляет вместе с HTML. При гидратации `useFetch` берёт результат оттуда, поэтому нет двойного запроса и mismatch. Запрос в `onMounted` ушёл бы только из браузера, и сервер отдал бы страницу без данных.', code: `const { data, status, error, refresh } = await useFetch('/api/products')`, lang: 'ts' },
      { title: 'Передавай в `query` сами ref-ы, а не `.value`', text: 'Тогда при их изменении запрос повторится сам. Адрес тоже можно задать функцией. Значение, которого нет ни в адресе, ни в опциях, добавляют в `watch`.', code: `const page = ref(1)
const search = ref('')
await useFetch('/api/products', { query: { page, q: search } }) // ок
await useFetch('/api/products', { query: { q: search.value } }) // статичная строка

const { data: post } = await useFetch(() => '/api/posts/' + route.params.id)
await useFetch('/api/comments', { watch: [sort] })`, lang: 'ts' },
      { title: '`pick` и `transform` уменьшают payload', text: 'Payload встраивается в HTML страницы, большой ответ целиком делает её тяжёлой. `default` задаёт значение до загрузки.', code: `await useFetch('/api/products', {
  pick: ['id', 'name', 'price'],  // в payload только эти поля
  default: () => []
})`, lang: 'ts' },
      { title: 'Nuxt 4: `data` — `shallowRef`, а до загрузки `undefined` вместо `null`', text: 'В Nuxt 3 `data` и `error` до загрузки были `null`, в Nuxt 4 — `undefined`, проверки `=== null` надо обновить. Плюс в Nuxt 4 `data` по умолчанию неглубокая: правка вложенного поля не вызовет перерисовку — нужна замена целиком или `deep: true`.', code: `const { data } = await useFetch('/api/user')
data.value.name = 'Аня'                     // Nuxt 4: экран не обновится
data.value = { ...data.value, name: 'Аня' } // ок

await useFetch('/api/user', { deep: true })  // вернуть поведение Nuxt 3`, lang: 'ts' },
      { title: 'Ловушка: `useFetch` в обработчике клика', text: 'Это composable для `setup`, плагинов и middleware: он регистрирует данные в контексте Nuxt. Для действий — `$fetch`. Загрузить по кнопке — `immediate: false` и `execute()`.', code: `const { data: report, execute } = useFetch('/api/report', { immediate: false })
// <button @click="execute()">Построить</button>

async function save() {
  await $fetch('/api/form', { method: 'POST', body: form })
}`, lang: 'ts' },
      { title: '`useFetch` = `useAsyncData` + `$fetch` + ключ по адресу', text: 'Ключ генерируется по адресу и опциям, типы ответа подтягиваются из `server/api`. Для относительных адресов при SSR заголовки входящего запроса, включая cookie, пробрасываются сами. Если нужна своя логика (несколько запросов, SDK) — `useAsyncData`.' }
    ],
    takeaway: '`useFetch` — данные для рендера из одного эндпоинта; `useAsyncData` — своя логика; `$fetch` — действия пользователя.',
    questions: [
      { q: 'Как работает useFetch и чем он лучше fetch в onMounted?', a: '`useFetch` при SSR выполняет запрос на сервере, рендерит страницу с данными и кладёт результат в payload. При гидратации браузер берёт данные из payload, поэтому повторного запроса нет и разметка совпадает. В `onMounted` запрос шёл бы только в браузере: сервер отдал бы страницу без данных, что плохо для SEO и первого экрана. Плюс `useFetch` даёт реактивные `data`, `status`, `error`, умеет `refresh` и сам повторяет запрос при смене реактивного адреса или query.' },
      { q: 'Как сделать, чтобы useFetch перезапрашивал данные при смене фильтра?', a: 'Передать в `query` сами ref-ы или геттеры, а не их значения, — `useFetch` отследит их сам. Адрес тоже можно задать функцией, например с параметром маршрута. Если запрос зависит от значения, которого нет ни в адресе, ни в опциях, добавляю его в `watch`. Для ручного обновления — `refresh()`.' },
      { q: 'Можно ли вызывать useFetch в обработчике кнопки?', a: 'Не стоит. `useFetch` рассчитан на вызов в `setup`, плагине или middleware: он регистрирует данные в контексте Nuxt и связывает их с payload. В обработчике клика этого контекста нет. Для отправки формы использую `$fetch`. А если данные нужно загрузить именно по кнопке, объявляю `useFetch` в `setup` с `immediate: false` и по клику вызываю `execute()`.' },
      { q: 'Что поменялось в useFetch в Nuxt 4?', a: 'Два заметных изменения. `data` по умолчанию стала `shallowRef`: правка вложенного поля больше не вызывает перерисовку, нужно заменять значение целиком или включать `deep: true`. И значение по умолчанию у `data` и `error` теперь `undefined`, а не `null`, так что проверки на `null` при миграции надо поправить. Ещё вызовы с одним ключом делят одни и те же ref-ы, поэтому опции у них должны совпадать.' }
    ]
  },
  {
    id: 'nuxt-useasyncdata',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useAsyncData',
    level: 'middle',
    summary: '`useAsyncData` — базовый механизм загрузки данных с SSR: выполняет любую async-функцию и хранит результат под ключом. На нём построен `useFetch`.',
    points: [
      { title: 'Любая async-функция с теми же гарантиями SSR, что у `useFetch`', text: 'Handler выполняется на сервере, результат уходит в payload под ключом, при гидратации функция повторно не вызывается. Беру, когда нужно несколько запросов, SDK CMS, GraphQL или нетривиальная обработка.', code: `const { data } = await useAsyncData(
  () => 'product-' + route.params.id,   // ключ с id
  async () => {
    const [product, reviews] = await Promise.all([
      $fetch('/api/products/' + route.params.id),
      $fetch('/api/reviews', { query: { productId: route.params.id } })
    ])
    return { product, reviews }
  }
)`, lang: 'ts' },
      { title: 'Ключ — идентификатор данных; параметры всегда включать в ключ', text: 'По ключу результат лежит в payload, и по нему браузер находит то, что получил сервер. Вызовы с одним ключом делят одни `data`, `error`, `status` — удобно для профиля в шапке и на странице, но случайное совпадение покажет чужие данные. Ключ-геттер поддерживается с Nuxt 3.17, и при его смене данные перезапрашиваются.' },
      { title: 'Ловушка: handler ничего не вернул', text: 'В payload сохраняется именно возвращённое значение. Если функция только записала в стор, при гидратации данных нет, и запрос уйдёт второй раз из браузера.', code: `useAsyncData('user', async () => {
  store.user = await $fetch('/api/me')  // вернёт undefined — двойной запрос
})
useAsyncData('user', () => $fetch('/api/me'))  // ок`, lang: 'ts' },
      { title: 'Браузерные данные — с `server: false`', text: 'Handler, который трогает `localStorage` или `window`, уронит SSR. `server: false` переносит запрос в браузер после гидратации, `immediate: false` откладывает его до `execute()`.', code: `const { data: recs } = useAsyncData(
  'recs',
  () => $fetch('/api/recs', { query: { viewed: localStorage.getItem('viewed') } }),
  { server: false, lazy: true }
)`, lang: 'ts' },
      { title: 'Nuxt 4: `data` по умолчанию `shallowRef` (`deep: false`)', text: 'В Nuxt 3 было `deep: true`. Теперь мутация вложенного поля не перерисует экран — заменяй значение целиком или включай `deep: true`. До загрузки `data` и `error` — `undefined`, а не `null`, как в Nuxt 3.', code: `const { data } = await useAsyncData('cart', () => $fetch('/api/cart'))
data.value.items.push(item)                          // Nuxt 4: не перерисует
data.value = { ...data.value, items: [...data.value.items, item] } // ок`, lang: 'ts' },
      { title: '`useAsyncData` vs `useState`', text: '`useState` хранит произвольное общее значение. `useAsyncData` хранит результат загрузки и вдобавок даёт статус, ошибку и `refresh`.' }
    ],
    takeaway: 'Один `$fetch` по адресу — `useFetch`; своя логика или несколько источников — `useAsyncData` с явным ключом, включающим параметры.',
    questions: [
      { q: 'В чём разница между useFetch и useAsyncData?', a: '`useFetch` — надстройка над `useAsyncData`: тот же механизм плюс `$fetch`, ключ по адресу и параметрам и типы из `server/api`. `useAsyncData` принимает любую асинхронную функцию, поэтому его беру для нескольких запросов, SDK вроде клиента CMS или сложной обработки. Ключ в `useAsyncData` задаю явно, потому что по нему хранятся и разделяются данные. Возвращают оба одно и то же.' },
      { q: 'Зачем useAsyncData ключ и что будет, если два компонента используют один ключ?', a: 'Ключ — идентификатор данных: под ним результат сохраняется в payload, и по нему браузер при гидратации находит то, что получил сервер. Вызовы с одним ключом работают с одними `data`, `error` и `status`, и запрос не дублируется — удобно, например, для профиля в шапке и на странице. Опции у таких вызовов должны совпадать. Если ключ случайно совпал у разных данных, компонент покажет чужие данные, поэтому параметры всегда включаю в ключ.' },
      { q: 'Что будет, если в функции useAsyncData ничего не вернуть?', a: 'Nuxt сохраняет в payload именно возвращённое значение. Если handler только записал данные в стор и вернул `undefined`, при гидратации данных по ключу не окажется, и функция выполнится ещё раз в браузере. Получится двойной запрос. Поэтому handler всегда должен возвращать результат. Если данные всё же живут в Pinia, её состояние передаётся отдельно, но handler лучше всё равно заставить что-то вернуть.' }
    ]
  },
  {
    id: 'nuxt-dollar-fetch',
    section: 'nuxt',
    group: 'Composables и API',
    title: '$fetch',
    level: 'middle',
    summary: '`$fetch` — глобальный HTTP-клиент Nuxt на ofetch. Он ничего не знает о payload, поэтому для действий пользователя, а не для данных первого рендера.',
    points: [
      { title: 'Ловушка: `await $fetch` в `setup` — двойной запрос', text: 'При первом заходе `setup` выполняется на сервере и ещё раз при гидратации. `$fetch` — просто промис и в payload ничего не кладёт, поэтому браузер запросит заново. Итог — двойная нагрузка на API, задержка гидратации и mismatch, если данные успели измениться.', code: `const users = await $fetch('/api/users')               // сервер + браузер
const { data } = await useAsyncData('users', () => $fetch('/api/users')) // ок
const { data: u } = await useFetch('/api/users')       // ок, короче`, lang: 'ts' },
      { title: '`$fetch` — для действий: форма, корзина, удаление', text: 'Плюс внутри handler в `useAsyncData`, в серверном коде и в actions Pinia, которые вызываются по событию.', code: `async function submit() {
  await $fetch('/api/feedback', { method: 'POST', body: form })
  await navigateTo('/thanks')
}`, lang: 'ts' },
      { title: '`$fetch` vs `fetch`: сам парсит JSON и бросает ошибку на 4xx/5xx', text: 'Нативный `fetch` на 404 не бросает, `response.json()` зовут вручную. У `$fetch` есть `baseURL`, `query`, `retry` и перехватчики `onRequest`, `onResponse`, `onResponseError`.' },
      { title: 'Текст серверной ошибки — в `e.data`, а не в `e.message`', text: 'Тело ответа с ошибкой лежит в `data` у `FetchError`.', code: `try {
  await $fetch('/api/feedback', { method: 'POST', body: form })
} catch (e: any) {
  errorText.value = e?.data?.statusMessage ?? 'Не удалось отправить'
}`, lang: 'ts' },
      { title: 'На сервере запрос к своему `/api` не идёт по сети', text: 'Nitro вызывает обработчик напрямую. Но cookie пользователя при SSR голый `$fetch` не пробрасывает — для этого `useRequestFetch()`.', code: `const requestFetch = useRequestFetch()
const { data } = await useAsyncData('cart', () => requestFetch('/api/cart'))`, lang: 'ts' },
      { title: 'Для проекта — свой клиент через `$fetch.create` в плагине', text: 'Базовый адрес, токен и обработка 401 в одном месте, раздаётся через `provide` как `$api`.', code: `const api = $fetch.create({
  baseURL: useRuntimeConfig().public.apiBase,
  async onResponseError({ response }) {
    if (response.status === 401) await navigateTo('/login')
  }
})`, lang: 'ts' }
    ],
    takeaway: 'Данные для рендера — `useFetch`/`useAsyncData`, действия по событию — `$fetch`.',
    questions: [
      { q: 'Почему нельзя просто написать await $fetch в script setup?', a: 'Потому что при первом заходе `setup` выполняется дважды: на сервере при SSR и в браузере при гидратации. `$fetch` — обычный промис, он не кладёт результат в payload, и в браузере запрос уйдёт заново. Итог — двойная нагрузка на API, задержка гидратации и возможный mismatch, если данные изменились. `useFetch` и `useAsyncData` решают именно это: запрос на сервере, результат передаётся браузеру.' },
      { q: 'Где уместно использовать $fetch?', a: 'Везде, где запрос — действие, а не данные для первого рендера: отправка формы, добавление в корзину, удаление. Внутри handler в `useAsyncData` — тоже `$fetch`. В серверном коде он удобен тем, что запрос к своему `/api` не идёт по сети: Nitro вызывает обработчик напрямую. Для проекта обычно делаю `$fetch.create` с базовым адресом и перехватчиками и раздаю его через плагин.' }
    ]
  },
  {
    id: 'nuxt-lazy-fetch',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useLazyFetch и useLazyAsyncData',
    level: 'middle',
    summary: '`useLazyFetch` и `useLazyAsyncData` — то же с `lazy: true`: клиентская навигация не ждёт данных, страница открывается сразу.',
    points: [
      { title: '`lazy` влияет только на клиентскую навигацию', text: 'Обычный `await useFetch` держит переход, пока данные не придут. Lazy-версия сразу пускает на страницу, `data` заполняется позже. При SSR Nuxt всё равно ждёт данные перед отправкой HTML, так что на первый заход `lazy` почти не влияет.', code: `// основной контент — ждём
const { data: article } = await useFetch(() => '/api/articles/' + route.params.slug)

// комментарии — не держим переход
const { data: comments, status } = useLazyFetch('/api/comments', {
  query: { slug: () => route.params.slug },
  default: () => []
})`, lang: 'ts' },
      { title: 'Пустые данные и `status` обрабатывают в шаблоне', text: 'При клиентской навигации первый рендер идёт без данных, обращение к полям упадёт. Состояние — в `status`: `idle`, `pending`, `success`, `error`.', code: `<CommentsSkeleton v-if="status === 'pending'" />
<CommentsList v-else :items="comments" />`, lang: 'vue' },
      { title: 'Ловушка: код сразу после `useLazyFetch`, будто данные уже есть', text: 'Их ещё нет. Реагировать на приход — через `watch` или шаблон.', code: `watch(comments, (list) => {
  if (list.length) markAsRead(list)
})`, lang: 'ts' },
      { title: '`lazy` vs `server: false` — разные оси', text: '`lazy` — ждёт ли навигация данных. `server: false` — где идёт запрос: только в браузере, и в серверном HTML этих данных нет. Чисто клиентские данные, которые не должны тормозить ни SSR, ни переход, — обе опции.', code: `const { data: recs, status } = useLazyAsyncData(
  'recs',
  () => $fetch('/api/recommendations'),
  { server: false }
)
// на сервере status = 'idle', в браузере 'pending' -> 'success'`, lang: 'ts' },
      { title: 'Ловушка: основной контент в `lazy` «для скорости»', text: 'Пользователь видит пустую страницу, выигрыш минимальный. `lazy` — для блоков второго плана: комментарии, похожие товары, рекомендации.' }
    ],
    takeaway: 'Главное грузим обычным `useFetch`, второстепенное — `useLazyFetch` со скелетоном.',
    questions: [
      { q: 'Чем useLazyFetch отличается от useFetch?', a: '`useLazyFetch` — это `useFetch` с `lazy: true`. Разница проявляется при клиентской навигации: обычный `await useFetch` держит переход до загрузки данных, а lazy-версия пускает на страницу сразу, и `data` заполняется позже. Поэтому в шаблоне обрабатываю `status === \'pending\'` и пустые данные, обычно скелетоном. При SSR Nuxt всё равно ждёт данные перед отправкой HTML. Использую для второстепенных блоков.' },
      { q: 'В чём разница между lazy: true и server: false?', a: 'Это разные оси. `lazy` — ждёт ли навигация данных: с ним страница открывается сразу. `server: false` — где выполняется запрос: не при SSR, а только в браузере после гидратации, и в серверном HTML этих данных не будет. Если данные чисто клиентские и не должны тормозить ни SSR, ни переход, ставлю обе опции.' }
    ]
  },
  {
    id: 'nuxt-usestate',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useState',
    level: 'middle',
    summary: '`useState` — общее состояние по ключу, своё для каждого запроса на сервере и переданное в браузер через payload.',
    points: [
      { title: 'Ловушка: `ref` на уровне модуля на сервере общий для всех', text: 'В браузере это работает как глобальный стор. На сервере модуль загружается один раз на процесс, и пользователь A увидит данные пользователя B.', code: `// composables/useUser.ts
const user = ref<User | null>(null)  // утечка между запросами
export const useUser = () => ({ user })`, lang: 'ts' },
      { title: '`useState` хранит значение в `nuxtApp` конкретного запроса', text: 'Все вызовы с одним ключом получают одно значение. `init` вызывается, только если значения по ключу ещё нет. Обычно `useState` прячут в свой composable.', code: `export const useUser = () => {
  const user = useState<User | null>('user', () => null)
  const isLoggedIn = computed(() => !!user.value)
  return { user, isLoggedIn }
}`, lang: 'ts' },
      { title: 'Значение уезжает в браузер через payload — пересчёта и mismatch нет', text: 'Посчитанное на сервере браузер получит тем же, а не вычислит заново.', code: `const renderedAt = useState('rendered-at', () => Date.now())
// в браузере — то же число, что на сервере`, lang: 'ts' },
      { title: 'Ловушка: класть в `useState` то, что не сериализуется', text: 'Функции, экземпляры классов, DOM-узлы в payload не попадут. И один ключ для разных по смыслу значений — они перезапишут друг друга.' },
      { title: '`useState` vs Pinia vs `useCookie`', text: 'Pinia тоже создаёт состояние на запрос и передаёт в браузер, но даёт actions, getters, devtools и плагины. `useState` живёт до перезагрузки страницы, а cookie переживает её и видна серверу при следующем запросе.' }
    ],
    takeaway: 'Небольшое общее состояние — `useState` внутри composable; много логики — Pinia; локальное — обычный `ref` в `setup`.',
    questions: [
      { q: 'Зачем useState, если можно сделать ref на уровне модуля?', a: 'В браузере ref на уровне модуля работает как глобальный стор. Но на сервере модуль загружается один раз на весь процесс, и ref становится общим для всех запросов: пользователь A может увидеть данные пользователя B. `useState` хранит значение в `nuxtApp`, который создаётся на каждый запрос, поэтому состояние изолировано. Плюс значение передаётся в браузер через payload, а не вычисляется заново, — нет mismatch.' },
      { q: 'Когда брать useState, а когда Pinia?', a: 'Оба SSR-безопасны: состояние создаётся на запрос и передаётся в браузер. `useState` хорош для простых вещей — тема, флаг меню, текущий пользователь — обёрнутых в небольшой composable. Когда состояния много и вокруг него появляется логика, беру Pinia: понятная структура с actions и getters, devtools, плагины вроде persist. В команде Pinia обычно проще поддерживать.' }
    ]
  },
  {
    id: 'nuxt-route-router',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useRoute, useRouter, navigateTo',
    level: 'junior',
    summary: '`useRoute` — текущий маршрут, `useRouter` — экземпляр vue-router, `navigateTo` — переход, который работает и в браузере, и на сервере.',
    points: [
      { title: '`navigateTo` на сервере отвечает HTTP-редиректом, `router.push` — нет', text: 'В браузере `navigateTo` работает как `push` или `replace`, на сервере — редирект, по умолчанию 302. Поэтому в middleware и `setup` — только `navigateTo`, и его результат возвращают или дожидаются.', code: `// pages/old-catalog/[id].vue — страница переехала
const route = useRoute()
await navigateTo('/catalog/' + route.params.id, { redirectCode: 301 })`, lang: 'ts' },
      { title: 'Внешний адрес — только с `external: true`', text: 'Без опции Nuxt выбросит ошибку. Открыть в новом окне — опция `open`.', code: `navigateTo('https://pay.example.com')                     // ошибка
navigateTo('https://pay.example.com', { external: true }) // ок`, lang: 'ts' },
      { title: 'Ловушка: деструктуризация `useRoute()` теряет реактивность', text: 'При смене маршрута деструктурированное значение не обновится. Читать через `route.params` или `computed`.', code: `const { params } = useRoute()          // застынет
const route = useRoute()
const id = computed(() => route.params.id) // ок`, lang: 'ts' },
      { title: 'Фильтры храним в query: URL — источник правды', text: 'Значения в query — строки, типы приводим. Пишем через `navigateTo` с `replace: true`, чтобы не засорять историю. Такой computed в `useFetch` сам перезапустит запрос.', code: `const page = computed(() => Number(route.query.page ?? 1))

function goToPage(p: number) {
  navigateTo({ query: { ...route.query, page: p } }, { replace: true })
}`, lang: 'ts' },
      { title: '`useRouter` — для того, что умеет только роутер', text: '`back()`, навигационные хуки, `addRoute`. А в route middleware берут аргументы `to` и `from`: `useRoute()` там может ещё указывать на текущий, а не целевой маршрут.', code: `const router = useRouter()
router.back()`, lang: 'ts' }
    ],
    takeaway: 'Переходы из кода — `navigateTo`, чтение адреса — `useRoute` без деструктуризации, `useRouter` — для `back()` и хуков.',
    questions: [
      { q: 'Чем navigateTo отличается от router.push?', a: '`router.push` — клиентская навигация vue-router. `navigateTo` — обёртка Nuxt с учётом SSR: в браузере работает как `push` или `replace`, на сервере отвечает HTTP-редиректом, по умолчанию 302, код меняется через `redirectCode`. Ещё она умеет внешние адреса с `external: true` и новое окно через `open`. Поэтому в middleware и `setup` использую `navigateTo` и возвращаю или дожидаюсь её результат.' },
      { q: 'Как правильно работать с query-параметрами для фильтров?', a: 'Делаю URL источником правды: читаю фильтры из `route.query` через `computed` и привожу типы, потому что там строки. Изменения пишу через `navigateTo` с новым query и `replace: true`, чтобы не засорять историю. Эти computed передаю в `useFetch`, и при смене query запрос повторяется сам. Плюс: ссылкой с фильтрами можно поделиться, и сервер сразу отрендерит ту же выборку.' }
    ]
  },
  {
    id: 'nuxt-usecookie',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useCookie',
    level: 'middle',
    summary: '`useCookie` — ref для cookie, который работает в обеих средах: на сервере читает заголовок `Cookie` и пишет `Set-Cookie`, в браузере — `document.cookie`.',
    points: [
      { title: 'Cookie — единственное браузерное хранилище, которое сервер видит в первом запросе', text: 'Поэтому тему, язык, город держат в cookie: сервер сразу отрендерит нужный вариант, и гидратация совпадёт. `localStorage` сервер не видит — получится mismatch или `<ClientOnly>`.', code: `const theme = useCookie<'light' | 'dark'>('theme', {
  default: () => 'light',
  maxAge: 60 * 60 * 24 * 365,  // в секундах: год
  sameSite: 'lax'
})
useHead({ htmlAttrs: { 'data-theme': theme } }) // без мигания`, lang: 'ts' },
      { title: 'Значение сериализуется в JSON, но cookie маленькая', text: 'Небольшой объект хранить можно. Корзину — нельзя: cookie уходит с каждым запросом, а одна ограничена примерно 4 КБ.' },
      { title: 'Вложенные изменения отслеживаются по умолчанию', text: 'Опция `watch` по умолчанию `true`: правка поля объекта тоже сохранится. При `watch: \'shallow\'` — только замена верхнего уровня, при `false` — не следит вовсе.', code: `const prefs = useCookie('prefs', { default: () => ({ city: 'msk' }) })
prefs.value.city = 'spb'   // сохранится при watch: true (по умолчанию)`, lang: 'ts' },
      { title: 'Токен сессии — `httpOnly`, и выставляет его сервер', text: 'Cookie без `httpOnly` при XSS прочитает любой скрипт. `httpOnly` cookie JS в браузере не видит: её ставят через `setCookie` в Nitro, а клиентский `useCookie` её не прочитает и не изменит.', code: `// server/api/login.post.ts
setCookie(event, 'session', token, {
  httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7
})`, lang: 'ts' },
      { title: 'Cookie поменял сервер — синхронизируй ref через `refreshCookie`', text: 'Клиентский ref сам не узнает, что cookie изменили ответом API.', code: `await $fetch('/api/login', { method: 'POST', body: form })
refreshCookie('user-meta')`, lang: 'ts' },
      { title: '`useCookie` vs `useState`', text: '`useState` живёт до перезагрузки страницы. Cookie переживает перезагрузку и приходит серверу со следующим запросом.' }
    ],
    takeaway: 'Всё небольшое, что нужно серверу для рендера, — в cookie через `useCookie`; секреты сессии — `httpOnly` с сервера.',
    questions: [
      { q: 'Почему в Nuxt тему или токен лучше хранить в cookie, а не в localStorage?', a: 'При SSR сервер знает только то, что пришло в запросе, а cookie отправляются автоматически. Значит, сервер сразу отрендерит тёмную тему или шапку авторизованного пользователя, и гидратация даст тот же результат. `localStorage` сервер не видит: пришлось бы рендерить значение по умолчанию и потом переключать или прятать блок в `<ClientOnly>`. `useCookie` даёт единый API для обеих сред. Для токенов дополнительно ставлю `httpOnly` и выставляю cookie с сервера.' },
      { q: 'Как useCookie работает на сервере?', a: 'На сервере `useCookie` разбирает заголовок `Cookie` текущего запроса и отдаёт значение как ref. Если во время SSR присвоить новое значение, Nuxt добавит в ответ `Set-Cookie`. В браузере тот же ref читает и пишет `document.cookie`. Если cookie изменил сервер, например при логине через API, клиентский ref об этом сам не узнает — для этого есть `refreshCookie(name)`.' }
    ]
  },
  {
    id: 'nuxt-request-headers',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useRequestHeaders и useRequestFetch',
    level: 'middle+',
    summary: 'Запрос, который сервер Nuxt сам делает при SSR, — новый запрос, и cookie пользователя в нём нет. Их пробрасывают через `useRequestFetch` или `useRequestHeaders`.',
    points: [
      { title: 'Голый `$fetch` при SSR идёт к API анонимно', text: 'Пользователь отправил cookie серверу Nuxt, но когда сервер сам вызывает `$fetch`, их там нет, и API видит гостя. В браузере проблемы нет: cookie для своего домена прикладываются сами.', code: `// при SSR /api/cart получит запрос без cookie — корзина пустая
const { data: cart } = await useAsyncData('cart', () => $fetch('/api/cart'))`, lang: 'ts' },
      { title: '`useRequestFetch()` — `$fetch`, который пробрасывает заголовки входящего запроса', text: 'В браузере это обычный `$fetch`. `useFetch` к относительному адресу делает это сам, так что проблема обычно в `$fetch` внутри `useAsyncData` или плагинов.', code: `const requestFetch = useRequestFetch()
const { data: cart } = await useAsyncData('cart', () => requestFetch('/api/cart'))

const { data: orders } = await useFetch('/api/orders') // пробросит сам`, lang: 'ts' },
      { title: '`useRequestHeaders` только читает заголовки, передать их — твоя задача', text: 'На сервере — заголовки входящего запроса, в браузере — пустой объект. Берут явный список нужных.', code: `const headers = useRequestHeaders(['cookie'])
const { data: me } = await useAsyncData('me', () => $fetch('/api/me', { headers }))

const lang = useRequestHeaders(['accept-language'])['accept-language']`, lang: 'ts' },
      { title: 'Ловушка: передать во внешний API все заголовки подряд', text: '`host` и `content-length` сломают запрос, а cookie пользователя уйдут чужому домену. Передают только нужное.', code: `const { authorization } = useRequestHeaders(['authorization'])
await useFetch(config.public.apiBase + '/profile', {
  headers: authorization ? { authorization } : {}
})`, lang: 'ts' },
      { title: 'Ловушка: вызывать их после `await` внутри функции', text: 'Контекст Nuxt может потеряться. Получайте `useRequestFetch()` и `useRequestHeaders()` в начале `setup`. Рядом есть `useRequestEvent()` — `event` h3 при SSR, и `useRequestURL()` — текущий URL в обеих средах.' }
    ],
    takeaway: 'Запрос при SSR от имени пользователя — `useFetch` к своему API или `useRequestFetch()`; во внешний API — только нужные заголовки.',
    questions: [
      { q: 'Почему при SSR API не видит авторизацию пользователя, хотя в браузере всё работает?', a: 'В браузере cookie прикладываются к запросу автоматически. При SSR запрос к API делает уже сервер Nuxt — это отдельный запрос, и cookie пользователя туда сами не попадают. Голый `$fetch` их не пробрасывает, поэтому API видит анонима. Решение — `useRequestFetch()` или явные `headers` из `useRequestHeaders([\'cookie\'])`. `useFetch` к относительному адресу делает это сам, так что проблема обычно в `$fetch` внутри `useAsyncData` или плагинов.' },
      { q: 'Что вернёт useRequestHeaders в браузере и как его правильно использовать?', a: 'В браузере — пустой объект: входящего запроса там нет. На сервере — заголовки запроса, пришедшего от пользователя. Использую с явным списком, например только `cookie` или `accept-language`, и передаю в `headers` своего запроса. Передавать всё подряд не стоит: там служебные заголовки вроде `host`, и можно случайно отдать cookie стороннему домену.' }
    ]
  },
  {
    id: 'nuxt-usenuxtapp',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useNuxtApp',
    level: 'middle',
    summary: '`useNuxtApp()` возвращает контекст приложения: хелперы из `provide`, хуки, payload и `runWithContext`. На сервере он свой у каждого запроса.',
    points: [
      { title: 'В `nuxtApp` лежит всё глобальное', text: 'Хелперы плагинов с префиксом `$`, `vueApp`, `hook`/`callHook`, `payload`, `ssrContext` на сервере, флаг `isHydrating`. В компонентах чаще хватает узких composables: `useState`, `useRuntimeConfig`, `useRoute`.', code: `const nuxtApp = useNuxtApp()
const { $api } = nuxtApp  // из plugins/api.ts: return { provide: { api } }
await $api('/orders/' + id, { method: 'DELETE' })`, lang: 'ts' },
      { title: '`hook` возвращает функцию отписки — в компоненте её надо вызвать', text: 'Иначе обработчики копятся при каждом монтировании.', code: `const off = nuxtApp.hook('page:start', () => { loading.value = true })
onBeforeUnmount(off)`, lang: 'ts' },
      { title: 'Composables Nuxt работают только при активном контексте', text: 'Контекст гарантированно есть синхронно в `setup`, плагине, middleware. После `await` в middleware или плагине, в `setTimeout`, в функции модуля его может не быть — ошибка «nuxt instance unavailable». В `<script setup>` компилятор восстанавливает контекст после `await` сам.' },
      { title: 'После `await` — `runWithContext`', text: '`nuxtApp` берём до первого `await`, а composables после него вызываем внутри `runWithContext`.', code: `export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp()                     // до await
  const status = await $fetch('/api/subscription')
  await nuxtApp.runWithContext(() => {
    useState('subscription').value = status
  })
  if (!status.active) return navigateTo('/pricing')
})`, lang: 'ts' },
      { title: 'Ловушка: сохранить `nuxtApp` в переменную модуля', text: 'На сервере это объект конкретного запроса — получится утечка между пользователями. Если контекста может не быть, есть `tryUseNuxtApp()`: вернёт `null` вместо ошибки.' },
      { title: '`useNuxtApp` vs `getCurrentInstance`', text: '`getCurrentInstance()` — экземпляр одного компонента, `useNuxtApp()` — контекст всего приложения. В отличие от `globalProperties` Vue, `provide` из плагина доступен и через `useNuxtApp()`, и с типами.' }
    ],
    takeaway: '`useNuxtApp` — для хелперов плагинов и хуков; потерялся контекст после `await` — `nuxtApp.runWithContext`.',
    questions: [
      { q: 'Что такое nuxtApp и что в нём есть?', a: '`nuxtApp` — контекст приложения Nuxt. На сервере он создаётся на каждый запрос, в браузере один раз. В нём хелперы, которые плагины отдали через `provide` (например `$api`), `vueApp`, система хуков, `payload` с данными для гидратации, `ssrContext` на сервере и флаг `isHydrating`. Все composables Nuxt опираются на него, поэтому им нужен активный контекст.' },
      { q: 'Откуда ошибка «nuxt instance unavailable» и как её исправить?', a: 'Composables Nuxt находят текущий `nuxtApp` через неявный контекст, который гарантированно доступен синхронно во время `setup`, плагина или middleware. После `await` в middleware или плагине, в таймере или в функции модуля его может уже не быть. Исправляю так: вызываю composables до первого `await` и сохраняю результаты, а если без `await` не обойтись — беру `nuxtApp` заранее и выполняю код через `nuxtApp.runWithContext()`. В `<script setup>` компилятор Vue сам восстанавливает контекст после `await`, поэтому там проблема встречается реже.' }
    ]
  },
  {
    id: 'nuxt-runtime-config',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'runtimeConfig и app.config',
    level: 'middle',
    summary: '`runtimeConfig` — настройки окружения, которые переопределяются переменными `NUXT_*` при запуске; приватная часть видна только серверу. `app.config` — публичные настройки проекта, фиксируемые при сборке.',
    points: [
      { title: 'Верхний уровень приватный, `public` уходит в браузер', text: 'Всё внутри `public` попадает в payload, то есть в HTML каждой страницы. Секрет в `public` — утечка.', code: `export default defineNuxtConfig({
  runtimeConfig: {
    telegramToken: '',      // только сервер
    public: {
      apiBase: '/api'       // и сервер, и браузер
    }
  }
})`, lang: 'ts' },
      { title: '`NUXT_*` переопределяет только объявленные ключи', text: 'Имя — `NUXT_` плюс путь ключа в UPPER_SNAKE_CASE, для публичных — `NUXT_PUBLIC_`. Переменная для ключа, которого нет в конфиге, игнорируется. Так один билд запускается в разных окружениях без пересборки.', code: `NUXT_TELEGRAM_TOKEN=123:abc
NUXT_PUBLIC_API_BASE=https://api.example.com`, lang: 'bash' },
      { title: 'Ловушка: `process.env.X` прямо в `nuxt.config` вычисляется при сборке', text: 'Значение зашьётся в билд, и на другом окружении не поменяется. Для значений времени запуска — `runtimeConfig` с `NUXT_*`.' },
      { title: 'На сервере читаем через `useRuntimeConfig(event)`', text: 'В компонентах — без аргумента. Приватные ключи в браузере — `undefined`.', code: `const config = useRuntimeConfig()
config.public.apiBase   // есть везде
config.telegramToken    // в браузере undefined

// server/api/notify.post.ts
const { telegramToken } = useRuntimeConfig(event)`, lang: 'ts' },
      { title: '`app.config` — для того, что не зависит от окружения', text: 'Всегда публичный, через переменные окружения не меняется, зато реактивен и хранит любые сериализуемые значения: бренд, цвета, настройки UI-библиотеки. То, что отличается между stage и prod, туда класть нельзя.', code: `// app.config.ts
export default defineAppConfig({ brand: { name: 'Shop', primary: '#0a7' } })
// в компоненте: useAppConfig().brand.name`, lang: 'ts' }
    ],
    takeaway: 'Зависит от окружения — `runtimeConfig` (секреты — вне `public`), не зависит — `app.config`.',
    questions: [
      { q: 'Как в Nuxt устроен runtimeConfig и как не утащить секрет на клиент?', a: 'В `nuxt.config` объявляю `runtimeConfig`: ключи верхнего уровня приватные и доступны только на сервере, всё внутри `public` уходит и в браузер через payload. Значения переопределяются при запуске переменными `NUXT_` плюс имя ключа в UPPER_SNAKE_CASE, для публичных — `NUXT_PUBLIC_`; работает только для объявленных ключей. Так один билд запускается в разных окружениях. Секреты держу в приватной части и читаю в `server/api` через `useRuntimeConfig(event)`.' },
      { q: 'Чем runtimeConfig отличается от app.config?', a: '`runtimeConfig` — про окружение: адреса, ключи, секреты, которые отличаются между stage и prod и задаются переменными `NUXT_*` при запуске; у него есть приватная серверная часть. `app.config` — про сам проект: всегда публичный, фиксируется при сборке, через переменные не меняется, зато реактивен и может хранить не только строки. Туда кладу тему, название бренда, настройки UI-библиотеки. Секреты в `app.config` класть нельзя.' }
    ]
  },
  {
    id: 'nuxt-cache',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'Кеширование данных: key, dedupe, getCachedData, payload',
    level: 'middle+',
    summary: 'Данные `useFetch`/`useAsyncData` хранятся в `nuxtApp` по ключу. Брать ли их из кеша вместо запроса, решает `getCachedData`, и в Nuxt 4 правила изменились.',
    points: [
      { title: 'Payload — данные SSR, которые едут в браузер вместе с HTML', text: 'Туда попадают результаты `useAsyncData`/`useFetch`, `useState`, состояние Pinia. Для пререндеренных страниц с payload extraction он выносится в `_payload.json` и подгружается при клиентских переходах. Чем больше payload, тем тяжелее страница.' },
      { title: '`getCachedData` вернул значение — запроса нет, `undefined` — запрос будет', text: 'По умолчанию он отдаёт данные из payload при гидратации (и из `_payload.json` для пререндеренных страниц), а при обычной клиентской навигации идёт новый запрос. Свой `getCachedData` — с Nuxt 3.8.', code: `await useFetch('/api/categories', {
  key: 'categories',
  getCachedData(key, nuxtApp) {
    return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
  }
})`, lang: 'ts' },
      { title: 'Срок жизни кеша добавляют сами', text: 'Храним момент загрузки рядом с данными и возвращаем `undefined`, когда устарело. «Вечный» кеш для цен и остатков покажет устаревшее до перезагрузки.', code: `await useFetch('/api/rates', {
  key: 'rates',
  transform: (r) => ({ ...r, fetchedAt: Date.now() }),
  getCachedData(key, nuxtApp) {
    const c = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
    if (!c || Date.now() - c.fetchedAt > 60_000) return // устарело
    return c
  }
})`, lang: 'ts' },
      { title: 'Nuxt 4: `getCachedData` зовётся и на `refresh`/`watch`, с причиной в `ctx.cause`', text: 'В Nuxt 3 он работал только при начальной загрузке. Перенесённый без правок кеш в Nuxt 4 может заблокировать ручное обновление. Плюс в Nuxt 4 вызовы с одним ключом делят одни ref-ы данных между компонентами.', code: `getCachedData(key, nuxtApp, ctx) {
  if (ctx.cause === 'refresh:manual') return // refresh() — всегда в сеть
  return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
}`, lang: 'ts' },
      { title: 'После мутации — `refreshNuxtData(key)`, при выходе — `clearNuxtData`', text: '`refresh` повторяет один запрос, `refreshNuxtData` — по ключу из любого места. Не очистить данные при выходе — следующий пользователь на том же устройстве увидит чужой профиль из памяти.', code: `await $fetch('/api/cart', { method: 'POST', body: { id } })
await refreshNuxtData('cart')        // шапка обновится

clearNuxtData(['cart', 'me', 'orders']) // при logout`, lang: 'ts' },
      { title: '`dedupe`: `cancel` отменяет идущий запрос, `defer` ждёт его', text: 'По умолчанию `cancel` — подходит для поиска, где новый ввод отменяет старый запрос. Кеш привязан к ключу, а не к адресу: один адрес с разными ключами — разные записи.' },
      { title: 'Это кеш в памяти клиента, а не серверный', text: 'Нагрузку на API при SSR он не снижает. На сервере кешируют `defineCachedEventHandler`, `cachedFunction` и `routeRules` со `swr`/`isr`.' }
    ],
    takeaway: 'Редко меняющиеся данные — свой `getCachedData` со сроком жизни; после изменений — `refreshNuxtData`, при выходе — `clearNuxtData`.',
    questions: [
      { q: 'Как кешируются данные useFetch/useAsyncData и как сделать, чтобы они не перезапрашивались при каждом переходе?', a: 'Результат хранится в `nuxtApp` под ключом, а решение «взять из кеша или запросить» принимает `getCachedData`. По умолчанию он отдаёт данные из payload при гидратации, а при клиентской навигации обычно идёт новый запрос. Исключение — пререндеренные страницы с payload extraction: там при переходах данные могут прийти из статического `_payload.json`. Для редко меняющихся данных задаю свой `getCachedData` (Nuxt 3.8+), который возвращает `nuxtApp.payload.data[key]` или `nuxtApp.static.data[key]`; если вернуть `undefined`, Nuxt сделает запрос, так что легко добавить срок жизни. В Nuxt 4 он вызывается и при `refresh`/`watch`, и в третьем аргументе приходит причина вызова — это надо учитывать.' },
      { q: 'Что делают refresh, refreshNuxtData, clearNuxtData и опция dedupe?', a: '`refresh` из `useFetch` повторяет именно этот запрос. `refreshNuxtData(key)` делает то же по ключу из любого места: после добавления в корзину вызываю его с ключом `cart`, и шапка обновится. `clearNuxtData` сбрасывает данные, ошибку и статус по ключам — нужно при выходе. `dedupe` определяет поведение, если запрос по ключу уже идёт: `cancel` (по умолчанию) отменяет текущий и запускает новый, это подходит для поиска; `defer` не запускает новый и ждёт текущий.' },
      { q: 'Что такое payload в Nuxt?', a: 'Payload — сериализованные данные, которые сервер собрал при SSR и отправил браузеру вместе с HTML: результаты `useAsyncData`/`useFetch`, значения `useState`, состояние Pinia. При гидратации браузер берёт данные оттуда, поэтому не повторяет запросы и рендерит то же самое. Для пререндеренных страниц при включённой payload extraction он выносится в отдельный файл `_payload.json`, который подгружается при клиентских переходах. Чем больше в payload, тем тяжелее страница, поэтому лишнее отрезаю через `pick` и `transform`.' }
    ]
  },
  {
    id: 'nuxt-server-vs-client',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'Где выполняется код: сервер и клиент',
    level: 'middle',
    summary: 'При первом заходе с SSR `setup` выполняется дважды — на сервере и в браузере при гидратации; дальше при переходах — только в браузере. `window` и `onMounted` есть только в браузере.',
    points: [
      { title: 'На сервере из жизненного цикла работают только `setup` и `onServerPrefetch`', text: 'Компонент не монтируется в DOM, поэтому `onBeforeMount`, `onMounted`, `onUnmounted` там не вызываются, и их результат в HTML не попадёт.', code: `<script setup>
console.log('setup')  // сервер при SSR + браузер при гидратации
onMounted(() => {
  console.log('только браузер')
})
</script>`, lang: 'vue' },
      { title: 'Браузерные API — только в `onMounted` и обработчиках', text: '`window`, `document`, `localStorage` прямо в `setup` дают на сервере `window is not defined`.', code: `const saved = localStorage.getItem('draft') // упадёт на сервере
onMounted(() => {
  const saved = localStorage.getItem('draft') // ок
})`, lang: 'ts' },
      { title: 'Ловушка: таймеры и подписки в `setup`', text: 'На сервере `onUnmounted` не вызывается, `setInterval` и слушатели не очистятся и будут копиться. Подписываемся в `onMounted`, отписываемся в `onBeforeUnmount`.', code: `onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))`, lang: 'ts' },
      { title: '`import.meta.client`/`server` вырезают ветку из бандла, `typeof window` — нет', text: 'Флаги сборщик заменяет на `true`/`false`, лишний код удаляется. `typeof window` — проверка во время выполнения, обе ветки остаются. `process.client` — устаревший вариант того же. Если от проверки зависит первый рендер, любая из них даст mismatch.', code: `if (import.meta.server) {
  console.log('только сервер') // нет в браузерном бандле
}`, lang: 'ts' },
      { title: 'Библиотека, которая трогает `window` при импорте, — через `import()` в `onMounted`', text: 'Статический импорт выполнится при SSR и уронит сервер. Другие варианты — `.client.vue` или плагин `.client`, если библиотека нужна глобально.', code: `// import Swiper from 'swiper'  // упадёт при SSR
const el = useTemplateRef<HTMLElement>('slider')
onMounted(async () => {
  const { default: Swiper } = await import('swiper')
  new Swiper(el.value!, { loop: true })
})`, lang: 'ts' },
      { title: 'Секреты и БД — только в `server/`', text: 'Всё, что лежит вне `server/`, может попасть в клиентский бандл.' }
    ],
    takeaway: 'Код компонента универсален: браузерное — в `onMounted`, серверное — в `server/` или под `import.meta.server`.',
    questions: [
      { q: 'Где выполняется код компонента в Nuxt и какие хуки работают на сервере?', a: 'При первом заходе с SSR `setup` выполняется на сервере, чтобы собрать HTML, и ещё раз в браузере при гидратации. При дальнейших клиентских переходах — только в браузере. На сервере из жизненного цикла работают только `setup` и `onServerPrefetch`: компонент не монтируется в DOM, поэтому `onMounted`, `onBeforeMount` и `onUnmounted` там не вызываются. Отсюда правило: всё, что использует браузерные API или требует очистки, делаю в `onMounted` и чищу в `onUnmounted`.' },
      { q: 'Чем import.meta.client отличается от проверки typeof window?', a: '`import.meta.client` и `import.meta.server` — флаги, которые сборщик заменяет на `true` или `false`, и ненужная ветка вырезается из бандла. `typeof window` — обычная проверка во время выполнения, обе ветки остаются в коде. `process.client` делает то же, что `import.meta.client`, но устарел. Важно: любая из этих проверок даёт mismatch, если от неё зависит первый рендер, поэтому такой код всё равно переношу в `onMounted`.' },
      { q: 'Как подключить библиотеку, которая при импорте обращается к window?', a: 'Статический импорт наверху файла выполнится при SSR, и сервер упадёт с `window is not defined`. Варианты: динамический `import()` внутри `onMounted`, отдельный компонент `.client.vue` или плагин с суффиксом `.client`, если библиотека нужна глобально. `<ClientOnly>` помогает, только если сам импорт тоже не выполняется на сервере. В любом случае ставлю заглушку нужного размера, чтобы не прыгала вёрстка.' }
    ]
  }
);
