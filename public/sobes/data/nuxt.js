window.SOBES = window.SOBES || { topics: [], quiz: [] };

/* ===================== Nuxt — Основы ===================== */
window.SOBES.topics.push(
  {
    id: 'nuxt-rendering',
    section: 'nuxt',
    group: 'Основы',
    title: 'Режимы рендеринга: SSR, CSR, SSG, гибридный',
    level: 'middle',
    summary: 'Nuxt умеет рендерить на сервере, в браузере и на этапе сборки, а routeRules позволяют смешивать режимы по маршрутам.',
    what: 'SSR (universal rendering) — сервер на каждый запрос рендерит HTML, браузер сразу видит контент, потом Vue «оживляет» страницу (гидратация). CSR — сервер отдаёт пустой HTML и JS, всё рисуется в браузере, как в обычном SPA. SSG (prerender) — HTML генерируется один раз при сборке и раздаётся как статика. Гибридный рендеринг — разные правила для разных маршрутов через routeRules: где-то prerender, где-то SWR/ISR-кеш, где-то чистый CSR.',
    why: 'Выбор режима — это баланс между SEO, скоростью первого экрана, свежестью данных и нагрузкой на сервер. Гибрид позволяет не выбирать один компромисс на весь сайт: лендинг статичный, каталог кешируется, личный кабинет — SPA.',
    when: 'SSR — публичные страницы с динамикой и SEO (каталог, карточка товара). SSG — контент, который меняется редко (блог, лендинг, документация). CSR (ssr: false) — админки и кабинеты за авторизацией, где SEO не нужен. SWR/ISR — страницы, которые можно отдавать из кеша и обновлять в фоне.',
    diff: 'SWR (swr: 60) кеширует ответ на уровне Nitro: отдаёт закешированное и в фоне перегенерирует после истечения TTL. ISR (isr: 60) — то же по смыслу, но кеш живёт на CDN платформы (Vercel, Netlify), поэтому переживает рестарты. Prerender — HTML готов до деплоя, сервер вообще не участвует. В отличие от Next.js, в Nuxt режим задаётся не в коде страницы, а правилами по путям в nuxt.config.',
    code: [
      { title: 'Гибридный рендеринг через routeRules', lang: 'ts', src: `// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },              // SSG: HTML при сборке
    '/blog/**': { isr: 3600 },             // CDN-кеш на час (Vercel/Netlify)
    '/catalog/**': { swr: 600 },           // Nitro-кеш, обновление в фоне
    '/account/**': { ssr: false },         // чистый CSR, SPA-режим
    '/old-page': { redirect: '/new-page' },
    '/api/**': { cors: true, headers: { 'cache-control': 'no-store' } }
  }
})` },
      { title: 'Полностью SPA или полностью статика', lang: 'ts', src: `// nuxt.config.ts — весь проект без SSR
export default defineNuxtConfig({
  ssr: false
})

// статическая генерация всего сайта:
// npx nuxi generate  -> .output/public, можно класть на любой хостинг` }
    ],
    real: 'Интернет-магазин: главная и страницы акций пререндерятся, карточки товаров идут через SSR со swr-кешем на несколько минут, корзина и личный кабинет — ssr: false, потому что там всё завязано на пользователя и SEO не нужен.',
    pitfalls: [
      'Включить swr/isr на страницах с персональными данными — кеш отдаст одному пользователю страницу другого. Кешировать можно только то, что одинаково для всех.',
      'Ждать от isr эффекта на обычном node-сервере — без поддержки платформы он ведёт себя как простой кеш, а не как CDN-кеш.',
      'Ставить ssr: false на публичные SEO-страницы ради «простоты» — поисковик и превью соцсетей увидят пустой HTML.',
      'Забыть, что при prerender данные из useFetch замораживаются на момент сборки — без пересборки они не обновятся.'
    ],
    questions: [
      {
        id: 'nuxt-rendering-q1',
        q: 'Какие режимы рендеринга есть в Nuxt и как выбрать подходящий?',
        level: 'middle',
        keys: ['SSR: HTML на каждый запрос + гидратация', 'CSR: ssr: false, рендер только в браузере', 'SSG: prerender при сборке, nuxi generate', 'гибрид через routeRules по маршрутам', 'критерии: SEO, свежесть данных, персонализация, нагрузка'],
        a: 'По умолчанию Nuxt работает в universal-режиме: сервер рендерит HTML, клиент гидратирует. Можно выключить SSR и получить обычное SPA, а можно пререндерить страницы при сборке. На практике я смешиваю это через routeRules: статичный маркетинг — prerender, каталог — SSR с swr-кешем, кабинет — ssr: false. Выбираю по трём вопросам: нужен ли SEO, как часто меняются данные и персональна ли страница.'
      },
      {
        id: 'nuxt-rendering-q2',
        q: 'Чем swr отличается от isr в routeRules?',
        level: 'middle+',
        keys: ['оба — stale-while-revalidate: отдают кеш и обновляют в фоне', 'swr кеширует в Nitro (storage сервера)', 'isr кеширует на CDN платформы', 'isr работает полноценно на Vercel/Netlify', 'нельзя для персональных страниц'],
        a: 'Идея одна: отдать готовый HTML из кеша, а после истечения TTL перегенерировать в фоне. Разница в том, где лежит кеш. swr — это кеш Nitro, он живёт в storage сервера и работает на любом хостинге. isr рассчитан на платформы вроде Vercel и Netlify: там страница кешируется на CDN, а не в процессе. В обоих случаях нельзя кешировать страницы, которые зависят от пользователя.'
      },
      {
        id: 'nuxt-rendering-q3',
        q: 'Зачем вообще SSR, если есть SPA?',
        level: 'junior',
        keys: ['контент в HTML сразу — SEO и превью ссылок', 'быстрее первый осмысленный экран', 'цена: нагрузка на сервер, гидратация, код должен работать в двух средах'],
        a: 'В SPA пользователь сначала получает пустую страницу и ждёт JS, а поисковик и превью в мессенджерах видят пустоту. SSR сразу отдаёт готовый HTML: контент виден быстрее и индексируется. Цена — нужен сервер, растёт нагрузка, и код пишется с учётом того, что он выполнится и на сервере, и в браузере. Для закрытых кабинетов SPA обычно достаточно.'
      }
    ]
  },
  {
    id: 'nuxt-hydration',
    section: 'nuxt',
    group: 'Основы',
    title: 'Гидратация и hydration mismatch',
    level: 'middle',
    summary: 'Гидратация — клиентский Vue подхватывает серверный HTML; mismatch — когда клиент отрендерил не то же самое, что сервер.',
    what: 'После SSR браузер получает готовый HTML. Гидратация — процесс, в котором Vue на клиенте заново выполняет setup компонентов, строит виртуальный DOM и «привязывается» к существующей разметке: вешает обработчики, подключает реактивность, но не перерисовывает DOM. Hydration mismatch — ситуация, когда клиентский рендер не совпал с серверным HTML. Vue пишет предупреждение в консоль и пытается исправить DOM, но это может дать мигание, потерю обработчиков или кривую разметку.',
    why: 'Понимание гидратации нужно, чтобы писать код, который даёт одинаковый результат на сервере и на клиенте. Это одна из самых частых проблем в SSR-проектах.',
    when: 'Думать о гидратации нужно всякий раз, когда в шаблон попадает что-то, зависящее от среды: время, случайные числа, window, localStorage, размер экрана, часовой пояс, данные авторизации из браузера.',
    diff: 'Mismatch — это не ошибка загрузки данных, а расхождение двух рендеров одного и того же компонента. В CSR-приложении его не бывает в принципе, потому что сервер ничего не рендерит.',
    code: [
      { title: 'Типичные причины mismatch', lang: 'vue', src: `<script setup lang="ts">
// разные значения на сервере и на клиенте
const now = new Date().toLocaleTimeString()
const rnd = Math.random()
const theme = typeof window !== 'undefined'
  ? localStorage.getItem('theme')
  : null
</script>

<template>
  <p>{{ now }} {{ rnd }}</p>
  <div :class="theme">...</div>
  <!-- невалидный HTML: браузер сам перестроит DOM -->
  <p><div>блок внутри параграфа</div></p>
</template>` },
      { title: 'Как чинить', lang: 'vue', src: `<script setup lang="ts">
// 1. значение один раз с сервера, клиент берёт из payload
const renderedAt = useState('rendered-at', () => Date.now())

// 2. браузерные данные — только после монтирования
const theme = ref('light')
onMounted(() => {
  theme.value = localStorage.getItem('theme') ?? 'light'
})

// 3. стабильный id, одинаковый на сервере и клиенте
const inputId = useId()
</script>

<template>
  <label :for="inputId">Имя</label>
  <input :id="inputId">
  <ClientOnly fallback-tag="span" fallback="...">
    <LocalClock />
  </ClientOnly>
</template>` }
    ],
    real: 'Классика — шапка сайта показывает «Войти» на сервере, а на клиенте читает токен из localStorage и рисует аватар. Получаем mismatch и мигание. Решение — хранить авторизацию в cookie (её видит и сервер) или рендерить блок пользователя в ClientOnly со скелетоном.',
    pitfalls: [
      'Проверять typeof window прямо в setup и рендерить по результату — это и есть рецепт mismatch: сервер и клиент выберут разные ветки.',
      'Генерировать id через Math.random или счётчик модуля — на сервере и клиенте получатся разные значения. Нужен useId.',
      'Невалидная вложенность (div в p, a в a, таблица без tbody в некоторых случаях) — браузер перестраивает DOM при парсинге, и Vue находит не те узлы.',
      'Лечить всё подряд через ClientOnly — контент пропадает из SSR, страдает SEO и появляется скачок вёрстки.'
    ],
    questions: [
      {
        id: 'nuxt-hydration-q1',
        q: 'Что такое гидратация и откуда берётся hydration mismatch?',
        level: 'middle',
        keys: ['клиент повторно выполняет setup и привязывается к серверному DOM', 'DOM не пересоздаётся, вешаются обработчики и реактивность', 'mismatch — клиентский рендер не совпал с серверным HTML', 'причины: Date, Math.random, window/localStorage, невалидный HTML', 'последствия: предупреждения, мигание, сломанные обработчики'],
        a: 'Сервер прислал готовый HTML, и Vue на клиенте должен его «оживить»: он снова прогоняет компоненты, строит виртуальное дерево и сопоставляет его с уже существующим DOM, навешивая обработчики. Если клиент получил другой результат, это mismatch. Чаще всего виноваты значения, которые различаются между средами: текущее время, случайные числа, чтение window или localStorage прямо в рендере. Ещё одна причина — невалидный HTML, который браузер исправил по-своему ещё до гидратации.'
      },
      {
        id: 'nuxt-hydration-q2',
        q: 'Как исправить mismatch, если компонент показывает данные из localStorage?',
        level: 'middle',
        keys: ['на сервере localStorage нет — первичный рендер должен совпадать', 'читать в onMounted, до этого показать дефолт', 'или обернуть в ClientOnly с fallback', 'если данные нужны серверу — хранить в cookie (useCookie)'],
        a: 'Сервер про localStorage ничего не знает, поэтому первый клиентский рендер должен быть таким же, как серверный: с дефолтным значением. Реальное значение читаю в onMounted, тогда это обычное обновление после гидратации. Если блок целиком браузерный, оборачиваю его в ClientOnly и даю fallback, чтобы не прыгала вёрстка. А если значение нужно уже при SSR, например тема или язык, переношу его в cookie через useCookie — её видят обе стороны.'
      },
      {
        id: 'nuxt-hydration-q3',
        q: 'Зачем нужен useId, почему не сгенерировать id самому?',
        level: 'middle+',
        keys: ['id должны совпадать на сервере и клиенте', 'Math.random/глобальный счётчик дают разные значения', 'useId генерирует стабильный id для SSR', 'нужно для связки label/input, aria-атрибутов'],
        a: 'Для доступности часто нужны уникальные id: связать label и input, aria-describedby и подсказку. Если генерировать их через Math.random или счётчик в модуле, сервер и клиент получат разные значения, и это mismatch, а счётчик к тому же копится между запросами на сервере. useId выдаёт id, детерминированный по положению компонента в дереве, поэтому он совпадает в обеих средах. В Nuxt есть свой useId, в Vue 3.5 он появился и в самом Vue.'
      }
    ]
  },
  {
    id: 'nuxt-server-client-components',
    section: 'nuxt',
    group: 'Основы',
    title: 'Серверные и клиентские компоненты, ClientOnly, islands',
    level: 'middle+',
    summary: '.client.vue рендерятся только в браузере, .server.vue и NuxtIsland — только на сервере без отправки JS компонента клиенту.',
    what: 'Суффикс .client.vue делает компонент клиентским: на сервере вместо него пустое место, в браузере он монтируется после гидратации. ClientOnly делает то же для любого куска шаблона и умеет показывать fallback. Суффикс .server.vue делает серверный компонент (island): он рендерится на сервере в HTML, а клиент получает только разметку, без JS этого компонента. NuxtIsland — низкоуровневый способ отрендерить такой компонент. Отдельные .server.vue требуют включить experimental.componentIslands.',
    why: 'Клиентские компоненты решают проблему кода, который не может работать на сервере: карты, графики, редакторы, всё, что трогает window. Серверные компоненты уменьшают JS-бандл: тяжёлый рендер (markdown, подсветка кода, большие таблицы) делается на сервере, а клиенту уходит готовый HTML.',
    when: 'ClientOnly / .client.vue — для библиотек, завязанных на DOM и браузерные API, и для блоков, которые всё равно персональны и не нужны в SEO. .server.vue — для статичного, но тяжёлого по зависимостям контента, где интерактивность не нужна. Если в компоненте есть клики и состояние, server-компонент не подходит.',
    diff: 'React Server Components — часть модели React: по умолчанию в Next App Router все компоненты серверные, клиентские помечаются use client, и они могут свободно вкладываться друг в друга. В Nuxt по умолчанию компоненты универсальные (рендерятся на сервере и гидратируются), а серверные — opt-in и экспериментальные: это изолированные островки, которые при смене пропсов перезапрашиваются с сервера отдельным запросом. Внутрь island можно передать клиентские компоненты через слоты или с атрибутом nuxt-client, но это не так прозрачно, как в React.',
    code: [
      { title: 'Клиентский компонент и ClientOnly', lang: 'vue', src: `<!-- components/MapView.client.vue — только в браузере -->
<script setup lang="ts">
import L from 'leaflet'
const el = useTemplateRef<HTMLDivElement>('map')
onMounted(() => {
  L.map(el.value!).setView([55.75, 37.6], 10)
})
</script>
<template><div ref="map" class="map" /></template>

<!-- pages/contacts.vue -->
<template>
  <MapView />
  <ClientOnly>
    <ChartWidget :data="stats" />
    <template #fallback>
      <div class="skeleton" style="height: 300px" />
    </template>
  </ClientOnly>
</template>` },
      { title: 'Серверный компонент (island)', lang: 'vue', src: `<!-- nuxt.config.ts: experimental: { componentIslands: true } -->

<!-- components/ArticleBody.server.vue -->
<script setup lang="ts">
import { marked } from 'marked' // не попадёт в клиентский бандл
const props = defineProps<{ source: string }>()
const html = marked.parse(props.source)
</script>
<template>
  <article v-html="html" />
</template>

<!-- использование как обычного компонента -->
<ArticleBody :source="post.body" />` }
    ],
    real: 'Страница статьи блога: тело статьи рендерится из markdown в .server.vue, и библиотека парсинга с подсветкой синтаксиса не тянется в браузер. Комментарии и кнопка «нравится» — обычные компоненты, а виджет с картой офиса — .client.vue.',
    pitfalls: [
      'Ждать интерактивности от .server.vue — обработчики и реактивность там не работают, клиент получает статичный HTML.',
      'Импортировать браузерную библиотеку на верхнем уровне обычного компонента и прятать его в ClientOnly — импорт всё равно выполнится на сервере и упадёт. Нужен .client.vue или динамический импорт в onMounted.',
      'Забыть fallback у ClientOnly — после гидратации контент появляется резко, вёрстка прыгает (CLS).',
      'Часто менять пропсы серверного компонента — каждое изменение даёт новый запрос к серверу за HTML.'
    ],
    questions: [
      {
        id: 'nuxt-server-client-components-q1',
        q: 'Есть ли в Nuxt аналог React Server Components?',
        level: 'middle+',
        keys: ['да: .server.vue и NuxtIsland (component islands)', 'рендер на сервере, клиенту только HTML, без JS компонента', 'opt-in и экспериментально (componentIslands)', 'в React серверные по умолчанию, в Nuxt — универсальные по умолчанию', 'при смене пропсов island перезапрашивается с сервера'],
        a: 'Ближайший аналог — component islands: компоненты с суффиксом .server.vue или NuxtIsland. Они рендерятся только на сервере, клиент получает готовый HTML, а код компонента и его зависимости в бандл не попадают. Главное отличие от React в модели по умолчанию: в Next App Router всё серверное, а клиентское помечается use client. В Nuxt наоборот, всё универсальное, а серверные островки включаются явно и пока считаются экспериментальной фичей. Плюс island изолирован: при изменении пропсов Nuxt делает отдельный запрос за новым HTML.'
      },
      {
        id: 'nuxt-server-client-components-q2',
        q: 'Чем .client.vue отличается от обёртки ClientOnly?',
        level: 'middle',
        keys: ['оба рендерят только на клиенте', '.client.vue — свойство самого компонента, везде где используется', 'ClientOnly — решение в месте использования, для любого куска шаблона', 'ClientOnly умеет fallback', 'импорт компонента в обычный файл всё равно выполнится на сервере'],
        a: 'Результат похожий: на сервере контента нет, в браузере он монтируется после гидратации. .client.vue — это решение на уровне самого компонента: он клиентский везде, и Nuxt не грузит его код на сервере. ClientOnly — решение в месте использования: можно обернуть что угодно, включая несколько компонентов, и задать fallback-заглушку. Если компонент сам по себе несовместим с сервером, правильнее сделать его .client.vue, чтобы его импорты не исполнялись при SSR.'
      }
    ]
  },
  {
    id: 'nuxt-structure',
    section: 'nuxt',
    group: 'Основы',
    title: 'Структура приложения и автоимпорты',
    level: 'junior',
    summary: 'Nuxt строит приложение по соглашениям о папках: pages, components, composables, layouts, middleware, plugins, server и т.д.',
    what: 'Nuxt — фреймворк на соглашениях: назначение файла определяется папкой. pages — маршруты, components — компоненты (автоимпорт), composables и utils — функции с автоимпортом, layouts — обёртки страниц, middleware — route middleware, plugins — код инициализации, server — бэкенд на Nitro, public — статика как есть, assets — файлы, которые обрабатывает сборщик. Плюс app.vue, nuxt.config.ts и app.config.ts. В Nuxt 4 клиентский код по умолчанию переехал в папку app/, а server остаётся в корне.',
    why: 'Соглашения убирают ручную настройку роутера, регистрацию компонентов и импорты: меньше шаблонного кода, и любой Nuxt-разработчик сразу понимает, где что лежит.',
    when: 'Следовать структуре стоит всегда. Отключать автоимпорты или менять пути имеет смысл только в больших монорепах или при жёстких требованиях к явности импортов.',
    diff: 'public отдаётся как есть по корневому URL без обработки (favicon, robots.txt), assets проходит через Vite: хеширование имён, оптимизация, импорт из CSS/JS. composables и utils оба автоимпортируются, разница смысловая: composables — функции с реактивностью и контекстом Nuxt (useXxx), utils — чистые хелперы. server/utils автоимпортируются только в серверном коде.',
    code: [
      { title: 'Типичная структура', lang: 'bash', src: `my-app/
  app.vue            # корневой компонент, тут <NuxtLayout><NuxtPage/></NuxtLayout>
  nuxt.config.ts
  app.config.ts      # публичный конфиг на этапе сборки (тема и т.п.)
  pages/             # file-based routing
  layouts/           # default.vue, admin.vue
  components/        # автоимпорт: components/ui/Button.vue -> <UiButton>
  composables/       # useCart.ts -> useCart() доступен везде
  utils/             # formatPrice.ts -> formatPrice()
  middleware/        # auth.ts, analytics.global.ts
  plugins/           # 01.sentry.client.ts, api.ts
  server/
    api/             # /api/* эндпоинты
    routes/          # эндпоинты без префикса /api
    middleware/      # серверные middleware Nitro
    utils/           # автоимпорт только на сервере
  public/            # отдаётся как есть: /robots.txt
  assets/            # обрабатывается Vite: стили, шрифты, картинки` },
      { title: 'Автоимпорт в деле', lang: 'vue', src: `<!-- composables/useCart.ts -->
<!-- export const useCart = () => {
       const items = useState<CartItem[]>('cart', () => [])
       const total = computed(() => items.value.reduce((s, i) => s + i.price, 0))
       return { items, total }
     } -->

<script setup lang="ts">
// ни одного import: ref, computed, useFetch, useCart, formatPrice — автоимпорт
const { items, total } = useCart()
const count = computed(() => items.value.length)
</script>

<template>
  <UiButton>Корзина: {{ count }} на {{ formatPrice(total) }}</UiButton>
</template>` }
    ],
    real: 'В проекте общие запросы к API выносят в composables (useProducts, useAuth), форматтеры — в utils, валидацию и работу с БД на сервере — в server/utils. Компоненты раскладывают по подпапкам, и Nuxt сам даёт им префиксы: components/catalog/Card.vue становится CatalogCard.',
    pitfalls: [
      'Класть файлы во вложенные папки composables и удивляться, что они не импортируются — автоимпорт сканирует только верхний уровень composables (и index-файлы подпапок), остальное нужно добавить в imports.dirs.',
      'Путать public и assets: картинку из assets нельзя указать строкой /assets/... в шаблоне без импорта, а файлы из public не хешируются и плохо кешируются при обновлении.',
      'Держать в composables состояние в переменных модуля (const state = ref()) — на сервере оно общее для всех запросов.',
      'Импортировать серверные утилиты из server/ в клиентский код — они не предназначены для бандла и могут утащить секреты.'
    ],
    questions: [
      {
        id: 'nuxt-structure-q1',
        q: 'Расскажи про структуру Nuxt-проекта. Что где лежит?',
        level: 'junior',
        keys: ['pages — маршруты, layouts — обёртки', 'components/composables/utils — автоимпорт', 'middleware и plugins — навигация и инициализация', 'server — API на Nitro', 'public — как есть, assets — через сборщик'],
        a: 'pages превращаются в маршруты, layouts оборачивают страницы, app.vue — корень. components, composables и utils автоимпортируются, поэтому в коде почти нет импортов. middleware — проверки перед переходом по маршруту, plugins — инициализация приложения, например API-клиент или Sentry. В server живёт бэкенд на Nitro: api-эндпоинты, серверные middleware и утилиты. Статика делится на public, которая отдаётся как есть, и assets, которые обрабатывает Vite.'
      },
      {
        id: 'nuxt-structure-q2',
        q: 'Как работают автоимпорты и какие у них минусы?',
        level: 'middle',
        keys: ['Nuxt сканирует папки и генерирует декларации в .nuxt', 'импортируются Vue API, composables Nuxt, свои composables/utils/components', 'tree-shaking сохраняется — импорт подставляется при сборке', 'минусы: неявность, конфликты имён, вложенные папки не сканируются', 'можно явно импортировать из #imports'],
        a: 'При сборке Nuxt сканирует components, composables, utils и подставляет импорты сам, а типы генерирует в папку .nuxt, поэтому IDE всё понимает. Неиспользуемое в бандл не попадает, это не глобальная регистрация. Минусы — меньше явности, возможны конфликты имён, и по умолчанию сканируется только верхний уровень composables и utils. Если нужна явность, можно импортировать из #imports или ограничить автоимпорт в конфиге.'
      }
    ]
  },
  {
    id: 'nuxt-routing',
    section: 'nuxt',
    group: 'Основы',
    title: 'File-based routing и definePageMeta',
    level: 'junior',
    summary: 'Маршруты строятся из файлов в pages: динамические [id], catch-all [...slug], вложенные через папку и NuxtPage.',
    what: 'Каждый .vue в pages становится маршрутом: pages/about.vue — /about, pages/index.vue — /. Квадратные скобки делают сегмент динамическим: pages/users/[id].vue. [[id]] — необязательный параметр. [...slug].vue ловит все оставшиеся сегменты массивом. Если рядом лежат файл parent.vue и папка parent/, получаются вложенные маршруты: в parent.vue нужен NuxtPage для отрисовки дочернего. definePageMeta задаёт метаданные страницы: layout, middleware, name, валидацию параметров, алиасы.',
    why: 'Роутер не нужно описывать руками: структура папок и есть карта маршрутов. Под капотом — vue-router, поэтому все его возможности доступны.',
    when: 'File-based routing подходит почти всегда. Ручная донастройка через router.options.ts или хук pages:extend нужна для редких случаев: генерировать маршруты из CMS, менять порядок, переиспользовать один компонент под разные пути.',
    diff: 'definePageMeta — макрос компилятора, он извлекается при сборке и не может ссылаться на переменные из setup. В отличие от useHead, он не про SEO-теги, а про конфигурацию маршрута. Вложенные маршруты отличаются от layouts: layout — внешняя обёртка, общая для разных страниц, вложенный маршрут — часть URL с собственным родительским компонентом.',
    code: [
      { title: 'Файлы и маршруты', lang: 'bash', src: `pages/
  index.vue               -> /
  about.vue               -> /about
  users/
    index.vue             -> /users
    [id].vue              -> /users/42      route.params.id = '42'
  blog/[[page]].vue       -> /blog и /blog/2
  docs/[...slug].vue      -> /docs/a/b/c    route.params.slug = ['a','b','c']
  [...slug].vue           -> всё остальное, удобно для 404
  account.vue             -> родитель, внутри <NuxtPage />
  account/
    orders.vue            -> /account/orders
    settings.vue          -> /account/settings` },
      { title: 'Динамическая страница с definePageMeta', lang: 'vue', src: `<!-- pages/users/[id].vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  // если вернуть false — Nuxt покажет 404
  validate: (route) => /^\\d+$/.test(String(route.params.id))
})

const route = useRoute()
const { data: user } = await useFetch(() => '/api/users/' + route.params.id)
</script>

<template>
  <h1>{{ user?.name }}</h1>
</template>` }
    ],
    real: 'Каталог: pages/catalog/[...slug].vue принимает любые вложенные категории /catalog/odezhda/kurtki, по массиву slug запрашивает категорию из API, а если её нет — бросает createError со статусом 404.',
    pitfalls: [
      'Использовать в definePageMeta переменные из setup — макрос выносится при сборке, такие ссылки сломаются.',
      'Сделать parent.vue без NuxtPage — дочерние маршруты матчатся, но ничего не рисуется.',
      'Переход между /users/1 и /users/2 переиспользует тот же компонент: если данные грузятся не реактивно (без функции/ref в URL или watch), страница покажет старого пользователя.',
      'Забыть, что параметры — всегда строки (или массив для catch-all): сравнение route.params.id === 42 всегда ложно.'
    ],
    questions: [
      {
        id: 'nuxt-routing-q1',
        q: 'Как в Nuxt сделать динамический маршрут и catch-all?',
        level: 'junior',
        keys: ['[id].vue — параметр, доступен в useRoute().params', '[[id]] — необязательный', '[...slug].vue — массив оставшихся сегментов', 'catch-all используют для 404 и вложенных категорий', 'validate в definePageMeta для проверки параметра'],
        a: 'Имя файла в квадратных скобках делает сегмент параметром: pages/users/[id].vue матчит /users/42, а значение берётся из useRoute().params.id, и это строка. Двойные скобки делают параметр необязательным. Catch-all — [...slug].vue: он забирает все оставшиеся сегменты в массив, им удобно ловить вложенные категории или делать свою 404-страницу. Параметр можно проверить через validate в definePageMeta: если вернуть false, Nuxt отдаст 404.'
      },
      {
        id: 'nuxt-routing-q2',
        q: 'Как сделать вложенные маршруты и что такое definePageMeta?',
        level: 'middle',
        keys: ['файл parent.vue + папка parent/ с дочерними', 'в родителе NuxtPage', 'definePageMeta — макрос компилятора', 'layout, middleware, name, validate, alias, keepalive', 'нельзя ссылаться на переменные setup'],
        a: 'Кладу рядом файл account.vue и папку account с дочерними страницами. В account.vue рисую общую часть, например боковое меню, и NuxtPage, куда подставится дочерняя страница. definePageMeta — это макрос, через который страница сообщает роутеру настройки: какой layout, какие middleware, имя маршрута, валидацию параметров. Он выполняется на этапе сборки, поэтому внутри можно использовать только литералы и импорты, а не реактивные переменные из setup.'
      }
    ]
  },
  {
    id: 'nuxt-middleware',
    section: 'nuxt',
    group: 'Основы',
    title: 'Route middleware и серверные middleware',
    level: 'middle',
    summary: 'Route middleware работают при навигации во Vue-приложении, серверные middleware Nitro — на каждый HTTP-запрос до обработчика.',
    what: 'Route middleware — функции defineNuxtRouteMiddleware(to, from), которые выполняются перед переходом на страницу: при SSR на сервере и при клиентской навигации в браузере. Бывают трёх видов: анонимные (прописаны прямо в definePageMeta), именованные (файл в middleware/, подключаются по имени) и глобальные (файл с суффиксом .global, выполняются на каждом переходе). Серверные middleware лежат в server/middleware и выполняются Nitro на каждый входящий запрос, включая API, до основного обработчика.',
    why: 'Route middleware решают задачи навигации: проверить авторизацию и роль, редиректнуть, отменить переход, собрать аналитику. Серверные middleware — задачи HTTP-уровня: логирование, добавление данных в event.context, проверка токена для всех API.',
    when: 'Защита страниц — именованный route middleware auth на нужных страницах или глобальный с белым списком. Защита API — серверная проверка (в middleware или в утилите внутри обработчиков), потому что клиентский middleware обходится прямым запросом к API.',
    diff: 'Route middleware знает о маршрутах Vue и может вернуть navigateTo или abortNavigation. Серверный middleware ничего не знает о страницах, работает с event (запрос/ответ) и не должен возвращать значение — если вернуть, это станет ответом и запрос дальше не пойдёт. Route middleware в браузере не являются защитой: это UX, настоящая проверка прав всегда на сервере.',
    code: [
      { title: 'Именованный и глобальный route middleware', lang: 'ts', src: `// middleware/auth.ts — подключается через definePageMeta({ middleware: 'auth' })
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token')
  if (!token.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})

// middleware/01.analytics.global.ts — на каждом переходе, порядок по имени файла
export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client && to.path !== from.path) {
    window.ym?.(12345, 'hit', to.fullPath)
  }
})` },
      { title: 'Анонимный middleware и abortNavigation', lang: 'vue', src: `<script setup lang="ts">
definePageMeta({
  middleware: [
    'auth',
    (to) => {
      const { user } = useAuth()
      if (user.value?.role !== 'admin') {
        return abortNavigation(createError({ statusCode: 403, statusMessage: 'Forbidden' }))
      }
    }
  ]
})
</script>` },
      { title: 'Серверный middleware Nitro', lang: 'ts', src: `// server/middleware/auth.ts — на каждый запрос, ничего не возвращаем
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  if (token) {
    event.context.user = await verifyToken(token) // доступно дальше в обработчиках
  }
  if (event.path.startsWith('/api/admin') && !event.context.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})` }
    ],
    real: 'Типичная схема: серверный middleware разбирает cookie и кладёт пользователя в event.context, API-эндпоинты проверяют права через него. На клиенте глобальный route middleware не пускает гостя в /account и редиректит на логин с параметром redirect.',
    pitfalls: [
      'Вызвать navigateTo без return — middleware не прервёт навигацию, переход продолжится.',
      'Считать route middleware защитой данных — его логика есть в бандле, а API доступен напрямую. Права проверяются на сервере.',
      'Вернуть значение из серверного middleware — оно станет ответом на любой запрос, и обработчики дальше не вызовутся.',
      'Обращаться к window или localStorage в route middleware без проверки — при SSR он выполняется на сервере.'
    ],
    questions: [
      {
        id: 'nuxt-middleware-q1',
        q: 'Какие бывают route middleware в Nuxt?',
        level: 'middle',
        keys: ['анонимные — функция прямо в definePageMeta', 'именованные — файл в middleware/, подключение по имени', 'глобальные — суффикс .global, на каждом переходе', 'порядок глобальных — по алфавиту, префиксы 01.', 'возврат navigateTo или abortNavigation, ничего — переход дальше'],
        a: 'Их три вида. Анонимный пишется прямо в definePageMeta и нужен одной странице. Именованный — файл в папке middleware, его подключают по имени на нужных страницах, классика — auth. Глобальный — файл с суффиксом .global, он срабатывает на каждом переходе, а порядок задают числовыми префиксами в имени. Внутри middleware возвращаю navigateTo для редиректа, abortNavigation для отмены, а если ничего не вернуть, навигация продолжится.'
      },
      {
        id: 'nuxt-middleware-q2',
        q: 'Чем route middleware отличается от серверного middleware в server/middleware?',
        level: 'middle',
        keys: ['route — на уровне роутера Vue, при SSR и клиентской навигации', 'серверный — Nitro, каждый HTTP-запрос, включая API', 'серверный работает с event, кладёт данные в event.context', 'серверный не должен ничего возвращать', 'безопасность — только на сервере'],
        a: 'Route middleware — часть Vue-приложения: он срабатывает при переходах между страницами, на сервере при первом заходе и в браузере при клиентской навигации, и умеет редиректить через navigateTo. Серверный middleware — часть Nitro: он вызывается на каждый HTTP-запрос, включая запросы к API и статике, ничего не знает о страницах и работает с event. Обычно он что-то добавляет в event.context или бросает ошибку, но не возвращает ответ. Для защиты данных нужен именно серверный уровень, клиентский — только про удобство.'
      },
      {
        id: 'nuxt-middleware-q3',
        q: 'Почему редирект в middleware не сработал, хотя navigateTo вызывается?',
        level: 'middle',
        keys: ['navigateTo нужно вернуть из middleware', 'без return навигация продолжается', 'в async-коде тоже return await navigateTo', 'на сервере navigateTo даёт 302 редирект'],
        a: 'Скорее всего забыли return. navigateTo внутри middleware не прерывает выполнение сам по себе: middleware смотрит на возвращённое значение, и если там undefined, переход продолжается. Поэтому всегда пишу return navigateTo(...). На сервере такой возврат превращается в HTTP-редирект с кодом 302, на клиенте — в обычную смену маршрута.'
      }
    ]
  },
  {
    id: 'nuxt-plugins',
    section: 'nuxt',
    group: 'Основы',
    title: 'Плагины Nuxt',
    level: 'middle',
    summary: 'defineNuxtPlugin запускает код при старте приложения: подключает библиотеки, отдаёт хелперы через provide, подписывается на хуки.',
    what: 'Плагин — файл в plugins/, который Nuxt выполняет один раз при создании приложения: на сервере для каждого запроса и в браузере при загрузке. Внутри доступен nuxtApp и vueApp: можно зарегистрировать Vue-плагин или директиву, создать API-клиент и отдать его через provide (станет доступен как $name), подписаться на хуки жизненного цикла. Суффиксы .client и .server ограничивают среду. Порядок — по алфавиту имени файла, поэтому используют префиксы 01., 02.',
    why: 'Плагины — место для глобальной инициализации, которую нельзя сделать в отдельном компоненте: Sentry, аналитика, настроенный экземпляр $fetch с базовым URL и токеном, сторонние Vue-библиотеки, глобальные директивы.',
    when: 'Плагин нужен, если код должен выполниться до рендера или один раз на приложение. Если логика нужна только части страниц — лучше composable, плагины выполняются на каждый запрос и замедляют старт. Тяжёлые асинхронные плагины тормозят гидратацию; можно пометить parallel: true.',
    diff: 'Плагин выполняется при создании приложения, middleware — при каждой навигации, composable — когда его вызвали. Плагин Nuxt — не то же самое, что Vue-плагин: Vue-плагин регистрируется внутри Nuxt-плагина через nuxtApp.vueApp.use. Плагины в server/plugins — это плагины Nitro, они про серверный рантайм и выполняются один раз при старте сервера.',
    code: [
      { title: 'API-клиент через provide', lang: 'ts', src: `// plugins/api.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const token = useCookie('token')

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (token.value) {
        options.headers.set('Authorization', 'Bearer ' + token.value)
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await navigateTo('/login')
      }
    }
  })

  return { provide: { api } }   // в компонентах: const { $api } = useNuxtApp()
})` },
      { title: 'Объектный синтаксис, хуки, клиентский плагин', lang: 'ts', src: `// plugins/01.sentry.client.ts — только в браузере, раньше остальных
export default defineNuxtPlugin({
  name: 'sentry',
  enforce: 'pre',
  parallel: true,
  async setup(nuxtApp) {
    const Sentry = await import('@sentry/vue')
    Sentry.init({ app: nuxtApp.vueApp, dsn: useRuntimeConfig().public.sentryDsn })
  },
  hooks: {
    'vue:error'(error) {
      console.error('vue error', error)
    },
    'page:finish'() {
      document.body.classList.remove('loading')
    }
  }
})` }
    ],
    real: 'Почти в каждом проекте есть plugins/api.ts: настроенный $fetch.create с baseURL из runtimeConfig, токеном из cookie и общей обработкой 401. Компоненты и composables используют его через useNuxtApp().$api вместо голого $fetch.',
    pitfalls: [
      'Подключать в универсальном плагине библиотеку, которая трогает window, — упадёт SSR. Нужен суффикс .client или проверка import.meta.client.',
      'Делать в плагине долгий await (запрос профиля, загрузка конфигурации) без нужды — это блокирует рендер каждой страницы.',
      'Рассчитывать на порядок плагинов без префиксов — он алфавитный, и плагин, зависящий от другого, может выполниться раньше. Помогают префиксы или dependsOn.',
      'Хранить пользовательские данные в переменных модуля плагина — на сервере модуль один на все запросы, данные утекут между пользователями.'
    ],
    questions: [
      {
        id: 'nuxt-plugins-q1',
        q: 'Что такое плагин в Nuxt и зачем там provide?',
        level: 'middle',
        keys: ['defineNuxtPlugin, выполняется при создании приложения', 'на сервере — на каждый запрос, на клиенте — один раз', 'provide отдаёт хелпер как $name в nuxtApp и шаблонах', 'типы для provide выводятся автоматически', 'для регистрации Vue-плагинов через nuxtApp.vueApp'],
        a: 'Плагин — код инициализации приложения: он выполняется до рендера, на сервере для каждого запроса и в браузере при загрузке. Туда кладу то, что нужно глобально: Vue-плагины, директивы, Sentry, настроенный API-клиент. Если вернуть из плагина объект provide, хелпер станет доступен как $имя через useNuxtApp и прямо в шаблоне, причём Nuxt сам выведет для него типы. Это удобнее, чем глобальные переменные, и работает корректно при SSR.'
      },
      {
        id: 'nuxt-plugins-q2',
        q: 'Как управлять порядком и средой выполнения плагинов?',
        level: 'middle+',
        keys: ['порядок по алфавиту имени файла, префиксы 01.', 'enforce pre/post или order в объектном синтаксисе', 'dependsOn для явной зависимости, parallel для асинхронных', '.client/.server суффиксы ограничивают среду', 'server/plugins — это плагины Nitro, другое'],
        a: 'По умолчанию плагины выполняются по алфавиту, поэтому для явного порядка добавляют префиксы вроде 01.sentry.client.ts. В объектном синтаксисе есть enforce со значениями pre и post, а также dependsOn, чтобы плагин ждал другой по имени. Асинхронные независимые плагины можно пометить parallel: true, тогда Nuxt не будет ждать их последовательно. Среду задаю суффиксом .client или .server. И важно не путать с server/plugins: это плагины Nitro, они выполняются один раз при старте сервера.'
      }
    ]
  },
  {
    id: 'nuxt-nitro',
    section: 'nuxt',
    group: 'Основы',
    title: 'Nitro и серверные API',
    level: 'middle',
    summary: 'Nitro — серверный движок Nuxt: API-эндпоинты в server/api, обработчики на h3, деплой на разные платформы через пресеты.',
    what: 'Nitro — серверная часть Nuxt на базе h3. Файлы в server/api становятся эндпоинтами /api/..., в server/routes — эндпоинтами без префикса. Обработчик описывается через defineEventHandler(event => ...), а хелперы h3 читают запрос: getQuery, readBody, getRouterParam, getCookie, getHeader. Метод задаётся суффиксом файла: users.get.ts, users.post.ts. Ошибки бросаются через createError. Сборка даёт папку .output, которая под нужный пресет деплоится на node-сервер, Vercel, Netlify, Cloudflare и т.д.',
    why: 'Nitro позволяет держать небольшой бэкенд в одном проекте с фронтом: BFF-слой поверх внешних API, прокси с секретными ключами, вебхуки, формы. Плюс он отвечает за SSR, кеширование и routeRules.',
    when: 'Брать server/api для BFF, проксирования внешних API с приватными ключами, простых CRUD и интеграций. Для большого бэкенда со сложной доменной логикой, очередями и отдельной командой лучше отдельный сервис, а Nitro оставить тонким слоем.',
    diff: 'server/api — префикс /api, server/routes — без префикса (например, /sitemap.xml), server/middleware — на каждый запрос, server/plugins — один раз при старте Nitro. В отличие от Express, обработчик возвращает значение, а не пишет в res: объект сериализуется в JSON автоматически. Типы ответа server/api выводятся и подхватываются useFetch на клиенте.',
    code: [
      { title: 'GET с query и параметром маршрута', lang: 'ts', src: `// server/api/products/index.get.ts -> GET /api/products?page=2
export default defineEventHandler(async (event) => {
  const { page = '1', q } = getQuery(event)
  return await db.product.findMany({
    where: q ? { name: { contains: String(q) } } : {},
    skip: (Number(page) - 1) * 20,
    take: 20
  })
})

// server/api/products/[id].get.ts -> GET /api/products/42
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const product = await db.product.findUnique({ where: { id } })
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }
  return product
})` },
      { title: 'POST с телом и приватным ключом', lang: 'ts', src: `// server/api/feedback.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody<{ name: string; phone: string }>(event)
  if (!body?.phone) {
    throw createError({ statusCode: 400, statusMessage: 'Phone is required' })
  }
  const { telegramToken, telegramChat } = useRuntimeConfig(event)
  await $fetch('https://api.telegram.org/bot' + telegramToken + '/sendMessage', {
    method: 'POST',
    body: { chat_id: telegramChat, text: body.name + ': ' + body.phone }
  })
  setResponseStatus(event, 201)
  return { ok: true }
})` },
      { title: 'Деплой-пресеты', lang: 'bash', src: `# по умолчанию node-server: node .output/server/index.mjs
npx nuxi build

# явный пресет через env или nitro.preset в nuxt.config
NITRO_PRESET=vercel npx nuxi build
NITRO_PRESET=cloudflare-pages npx nuxi build

# полностью статический сайт
npx nuxi generate` }
    ],
    real: 'Форма заявки на сайте: клиент шлёт POST на /api/feedback, Nitro валидирует тело и отправляет сообщение в Telegram или CRM. Токен бота лежит в приватном runtimeConfig и никогда не попадает в браузер.',
    pitfalls: [
      'Не проверять тело запроса: readBody возвращает то, что прислал клиент, типизация через дженерик ничего не валидирует. Нужна проверка руками или через zod (readValidatedBody).',
      'Возвращать ошибки как обычный объект со статусом 200 — клиент не поймёт, что это ошибка. Правильно бросать createError с statusCode.',
      'Звать свой же API из серверного кода через полный URL — лишний HTTP-круг. На сервере $fetch к относительному /api вызывает обработчик напрямую.',
      'Выбрать пресет, не проверив ограничения платформы: на edge-рантаймах нет части Node API, и библиотеки вроде драйверов БД могут не работать.'
    ],
    questions: [
      {
        id: 'nuxt-nitro-q1',
        q: 'Что такое Nitro и как написать API-эндпоинт в Nuxt?',
        level: 'middle',
        keys: ['серверный движок Nuxt на h3', 'server/api/*.ts -> /api/*, суффикс метода .get/.post', 'defineEventHandler, возврат значения сериализуется в JSON', 'getQuery, readBody, getRouterParam', 'createError для ошибок со статусом'],
        a: 'Nitro — серверный рантайм Nuxt, он отвечает за SSR, кеширование и API. Чтобы сделать эндпоинт, кладу файл в server/api, имя файла даёт путь, а суффикс .get или .post — метод. Внутри defineEventHandler, который получает event: из него достаю query через getQuery, тело через readBody, параметры пути через getRouterParam. Возвращаю просто объект — Nitro сам отдаст JSON. Для ошибок бросаю createError со statusCode, и на клиенте useFetch получит её в error.'
      },
      {
        id: 'nuxt-nitro-q2',
        q: 'Что такое деплой-пресеты Nitro?',
        level: 'middle',
        keys: ['сборка .output под конкретную платформу', 'по умолчанию node-server', 'vercel, netlify, cloudflare и др. — выбор через NITRO_PRESET или nitro.preset', 'на многих платформах пресет определяется автоматически', 'edge-пресеты ограничивают Node API'],
        a: 'Nitro умеет собирать серверную часть под разные окружения, и пресет определяет формат результата. По умолчанию это node-server: обычный Node-процесс, который запускается из .output/server. Для Vercel, Netlify, Cloudflare и других есть свои пресеты, которые превращают обработчики в функции платформы; на многих из них Nitro сам определяет пресет при сборке. Задать его можно через NITRO_PRESET или nitro.preset в конфиге. Важно помнить, что edge-окружения не поддерживают часть Node API.'
      }
    ]
  }
);

/* ===================== Nuxt — Composables и API ===================== */
window.SOBES.topics.push(
  {
    id: 'nuxt-usefetch',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useFetch',
    level: 'middle',
    summary: 'useFetch загружает данные SSR-дружелюбно: один запрос на сервере, результат в payload, на клиенте без повторного запроса.',
    what: 'useFetch(url, options) — composable для загрузки данных в компонентах и страницах. По сути это useAsyncData плюс $fetch: ключ генерируется автоматически из URL и опций. Он возвращает реактивные data, status, error, а также refresh, execute и clear. При SSR запрос выполняется на сервере, результат кладётся в payload страницы, и при гидратации клиент берёт данные оттуда без второго запроса. Если URL — функция или ref, а query/params — реактивные, запрос перезапускается при их изменении.',
    why: 'Решает главную проблему загрузки данных в SSR: не делать запрос дважды, не получить mismatch и не писать вручную передачу состояния с сервера на клиент. Плюс типизация ответа из server/api выводится автоматически.',
    when: 'Основной способ получить данные для рендера страницы или компонента из простого HTTP-эндпоинта. Если нужна произвольная логика (несколько запросов, SDK, обработка) — useAsyncData. Для действий пользователя (отправка формы, клик) — $fetch, а не useFetch.',
    diff: 'useFetch — частный случай useAsyncData с $fetch и автоключом. $fetch — просто HTTP-клиент без SSR-магии и реактивности. useLazyFetch — тот же useFetch с lazy: true, не блокирует навигацию. В отличие от axios в onMounted, данные есть уже в серверном HTML.',
    code: [
      { title: 'Базовое использование с реактивным query', lang: 'vue', src: `<script setup lang="ts">
const page = ref(1)
const search = ref('')

const { data: products, status, error, refresh } = await useFetch('/api/products', {
  query: { page, q: search },          // ref-ы: запрос перезапустится при изменении
  pick: ['id', 'name', 'price'],       // в payload уйдут только эти поля
  default: () => []
})
</script>

<template>
  <input v-model.lazy="search" placeholder="Поиск">
  <p v-if="error">Ошибка: {{ error.statusMessage }}</p>
  <p v-else-if="status === 'pending'">Загрузка...</p>
  <ProductCard v-for="p in products" :key="p.id" :product="p" />
  <button @click="page++">Ещё</button>
  <button @click="refresh()">Обновить</button>
</template>` },
      { title: 'Динамический URL, transform, watch', lang: 'ts', src: `const route = useRoute()

// URL как функция: при смене id запрос повторится
const { data: post } = await useFetch(() => '/api/posts/' + route.params.id, {
  key: 'post-' + route.params.id,
  transform: (raw) => ({ ...raw, date: new Date(raw.createdAt).toLocaleDateString('ru') })
})

// явная зависимость от того, чего нет в URL/опциях
const sort = ref('new')
const { data: comments } = await useFetch('/api/comments', {
  query: { postId: () => route.params.id },
  watch: [sort]
})` }
    ],
    real: 'Страница каталога: useFetch с query из фильтров, связанных с route.query. Пользователь меняет фильтр, URL обновляется, useFetch видит новые параметры и перезапрашивает список, а при первом заходе по ссылке всё отрисовывается на сервере.',
    pitfalls: [
      'Использовать useFetch в обработчике клика или после await внутри функции — это composable для setup. Для действий нужен $fetch.',
      'Передавать в query значение ref.value вместо самого ref — запрос не будет реактивным и не перезапустится.',
      'Тащить в payload огромный ответ целиком — он сериализуется в HTML. pick и transform уменьшают объём.',
      'Забыть, что data изначально пустое (null в Nuxt 3, undefined в Nuxt 4), и обращаться к data.value.items без проверки.'
    ],
    questions: [
      {
        id: 'nuxt-usefetch-q1',
        q: 'Как работает useFetch и чем он лучше fetch в onMounted?',
        level: 'middle',
        keys: ['запрос выполняется на сервере при SSR', 'результат передаётся в payload, клиент не повторяет запрос', 'данные уже в HTML — SEO и быстрый первый экран', 'возвращает data, status, error, refresh', 'реактивные URL/query перезапускают запрос'],
        a: 'useFetch при SSR делает запрос на сервере, рендерит с данными и сериализует результат в payload. При гидратации клиент берёт данные из payload, поэтому второго запроса нет и разметка совпадает. В onMounted запрос пошёл бы только в браузере, и сервер отдал бы пустую страницу со спиннером. Плюс useFetch даёт реактивные data, status и error, умеет refresh и сам перезапрашивает данные, если URL или query реактивные и изменились.'
      },
      {
        id: 'nuxt-usefetch-q2',
        q: 'Как сделать, чтобы useFetch перезапрашивал данные при смене фильтра?',
        level: 'middle',
        keys: ['передать ref или getter в query/params, а не .value', 'URL можно задать функцией', 'watch для внешних зависимостей', 'refresh для ручного перезапроса'],
        a: 'Проще всего передать в query сами ref-ы или функции, а не их значения: useFetch отследит их и сделает новый запрос. URL тоже можно задать функцией, например с параметром маршрута. Если запрос зависит от чего-то, чего нет в URL и опциях, добавляю это в watch. А для ручного обновления по кнопке есть refresh.'
      },
      {
        id: 'nuxt-usefetch-q3',
        q: 'Можно ли вызывать useFetch в обработчике кнопки?',
        level: 'middle',
        keys: ['нет, это composable для setup, плагинов и middleware', 'вне setup нет контекста Nuxt, ключ и payload не работают как задумано', 'для действий — $fetch', 'для перезапроса — refresh/execute от useFetch, объявленного в setup'],
        a: 'Не стоит. useFetch рассчитан на вызов в setup, плагине или middleware: он регистрирует данные в контексте Nuxt и связывает их с payload. В обработчике клика контекста нет, и получится как минимум предупреждение, а иногда странное поведение. Для отправки формы или клика использую $fetch. А если нужно по кнопке перезагрузить данные, объявляю useFetch в setup с immediate: false и вызываю execute или refresh.'
      }
    ]
  },
  {
    id: 'nuxt-useasyncdata',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useAsyncData',
    level: 'middle',
    summary: 'useAsyncData оборачивает любую асинхронную функцию в SSR-дружелюбную загрузку с ключом, кешем в payload и реактивным состоянием.',
    what: 'useAsyncData(key, handler, options) — базовый composable для загрузки данных. Он выполняет handler на сервере, кладёт результат в payload под ключом key, а на клиенте при гидратации берёт значение оттуда. Возвращает те же data, status, error, refresh, execute, clear, что и useFetch. Поддерживает опции server, lazy, immediate, default, transform, pick, watch, dedupe, getCachedData.',
    why: 'Нужен, когда данные получаются не одним простым запросом: несколько запросов параллельно, SDK (Supabase, CMS-клиент), запрос к GraphQL, дополнительная обработка. Всё, что угодно асинхронное, получает те же SSR-гарантии, что и useFetch.',
    when: 'Если загрузка — это один $fetch к URL, проще useFetch. Если есть логика, сторонний клиент или комбинация запросов — useAsyncData. Ключ стоит задавать явно и уникально для данных: от него зависит кеш и переиспользование.',
    diff: 'useFetch = useAsyncData + $fetch + автоключ из URL. У useAsyncData ключ задаётся вручную (если не задать, Nuxt сгенерирует его по месту вызова, но для общих данных лучше явный). Одинаковый ключ у двух вызовов означает общие данные — это и фича, и источник багов.',
    code: [
      { title: 'Несколько запросов и SDK', lang: 'vue', src: `<script setup lang="ts">
const route = useRoute()

const { data, status } = await useAsyncData(
  () => 'product-page-' + route.params.id,     // ключ может быть функцией и меняться
  async () => {
    const [product, reviews] = await Promise.all([
      $fetch('/api/products/' + route.params.id),
      $fetch('/api/reviews', { query: { productId: route.params.id } })
    ])
    return { product, rating: avg(reviews.map(r => r.score)), reviews }
  }
)
</script>

<template>
  <ProductHero v-if="data" :product="data.product" :rating="data.rating" />
</template>` },
      { title: 'Ручной запуск и только на клиенте', lang: 'ts', src: `// не грузим при рендере, только по кнопке
const { data: report, execute, status } = useAsyncData(
  'sales-report',
  () => $fetch('/api/reports/sales'),
  { immediate: false }
)
// <button @click="execute()">Построить отчёт</button>

// данные зависят от браузера — грузим только на клиенте
const { data: recs } = useAsyncData(
  'recommendations',
  () => $fetch('/api/recs', { query: { viewed: localStorage.getItem('viewed') } }),
  { server: false, lazy: true }
)` }
    ],
    real: 'Страница товара собирает данные из трёх источников: сам товар, отзывы и остатки на складе. Всё это внутри одного useAsyncData через Promise.all, на сервере, с одним ключом — клиент получает готовую страницу и не делает ни одного запроса при гидратации.',
    pitfalls: [
      'Handler ничего не возвращает (например, только пишет в стор) — данные не попадут в payload, и на клиенте handler выполнится повторно. Нужно возвращать значение.',
      'Одинаковый статический ключ на разных страницах с разными данными — второй компонент получит данные первого. Ключ должен включать параметры.',
      'Использовать один ключ с разными handler или опциями — Nuxt предупреждает, и поведение непредсказуемо.',
      'Писать в handler побочные эффекты, завязанные на браузер, без server: false — handler выполнится на сервере.'
    ],
    questions: [
      {
        id: 'nuxt-useasyncdata-q1',
        q: 'В чём разница между useFetch и useAsyncData?',
        level: 'middle',
        keys: ['useFetch — обёртка над useAsyncData + $fetch', 'useFetch генерирует ключ из URL и опций', 'useAsyncData принимает любой handler, ключ задаётся явно', 'useAsyncData для нескольких запросов, SDK, GraphQL', 'возвращают одинаковый набор: data, status, error, refresh'],
        a: 'useFetch — это сахар над useAsyncData: внутри тот же механизм, плюс $fetch и автоматический ключ из URL и параметров, и типы из server/api. useAsyncData принимает любую асинхронную функцию, поэтому я беру его, когда нужно сделать несколько запросов, использовать SDK вроде CMS-клиента или как-то обработать результат. Ключ в useAsyncData задаю явно, потому что по нему кешируются и разделяются данные. Возвращают оба одно и то же.'
      },
      {
        id: 'nuxt-useasyncdata-q2',
        q: 'Зачем useAsyncData ключ и что будет, если два компонента используют один ключ?',
        level: 'middle+',
        keys: ['по ключу данные хранятся в payload и nuxtApp', 'клиент находит серверные данные при гидратации по ключу', 'один ключ — общие data/status/error между компонентами', 'полезно для переиспользования, опасно при коллизии', 'ключ должен включать параметры (id, страницу)'],
        a: 'Ключ — это адрес данных: под ним результат сохраняется в payload, и по нему клиент при гидратации находит то, что получил сервер. Если два компонента вызывают useAsyncData с одним ключом, они разделяют одно состояние: data, status и error общие, а запрос не дублируется. Это удобно, например, для профиля пользователя в шапке и на странице. Но если ключ случайно совпал у разных данных, один компонент покажет данные другого, поэтому параметры вроде id всегда кладу в ключ.'
      }
    ]
  },
  {
    id: 'nuxt-dollar-fetch',
    section: 'nuxt',
    group: 'Composables и API',
    title: '$fetch',
    level: 'middle',
    summary: '$fetch — HTTP-клиент Nuxt на базе ofetch; для действий пользователя, но не для данных рендера в setup.',
    what: '$fetch — глобальный HTTP-клиент на базе ofetch: автоматически парсит JSON, бросает ошибку на статусах 4xx/5xx, умеет baseURL, query, ретраи и перехватчики (onRequest, onResponse, onResponseError). На сервере вызов $fetch к относительному /api-маршруту не идёт по сети, а напрямую вызывает обработчик Nitro. Сам по себе $fetch ничего не знает о SSR, payload и гидратации.',
    why: 'Нужен для императивных запросов: отправка форм, клики, мутации, запросы в серверных обработчиках и внутри handler у useAsyncData.',
    when: 'Брать $fetch в обработчиках событий, в серверном коде, внутри useAsyncData и в Pinia actions, вызываемых по действию. Не брать $fetch напрямую в setup для данных, которые нужны при рендере, — там нужен useFetch или useAsyncData.',
    diff: 'useFetch — реактивная обёртка с SSR-кешем и payload, $fetch — просто промис. Если вызвать $fetch в setup, он выполнится на сервере при SSR, а потом ещё раз на клиенте при гидратации, потому что результат никуда не передан, — двойной запрос и риск mismatch. В отличие от нативного fetch, $fetch сам парсит JSON и кидает ошибку на плохой статус.',
    code: [
      { title: 'Так нельзя и так правильно', lang: 'vue', src: `<script setup lang="ts">
// Плохо: запрос уйдёт на сервере, а потом ещё раз в браузере
const users = await $fetch('/api/users')

// Хорошо: на сервере запрос, на клиенте данные из payload
const { data: usersOk } = await useAsyncData('users', () => $fetch('/api/users'))
// или короче
const { data: usersShort } = await useFetch('/api/users')
</script>` },
      { title: '$fetch для действий пользователя', lang: 'vue', src: `<script setup lang="ts">
const form = reactive({ name: '', phone: '' })
const sending = ref(false)
const errorText = ref('')

async function submit() {
  sending.value = true
  errorText.value = ''
  try {
    await $fetch('/api/feedback', { method: 'POST', body: form })
    await navigateTo('/thanks')
  } catch (e: any) {
    errorText.value = e?.data?.statusMessage ?? 'Не удалось отправить'
  } finally {
    sending.value = false
  }
}
</script>` }
    ],
    real: 'Карточка товара грузится через useFetch, а кнопка «В корзину» шлёт $fetch POST /api/cart и потом вызывает refresh у данных корзины или refreshNuxtData по её ключу.',
    pitfalls: [
      'Вызвать $fetch в setup для данных рендера — двойной запрос (сервер и клиент) и возможный hydration mismatch, если данные успели измениться.',
      'Ждать, что $fetch на сервере передаст cookie пользователя во внешний API или даже в свой — он этого не делает. Нужен useRequestFetch или ручная передача заголовков.',
      'Ловить ошибку и читать e.message вместо e.data — тело ответа с statusMessage от createError лежит в data.',
      'Использовать useFetch в обработчике клика вместо $fetch — composable вне setup ведёт себя непредсказуемо.'
    ],
    questions: [
      {
        id: 'nuxt-dollar-fetch-q1',
        q: 'Почему нельзя просто написать await $fetch в script setup?',
        level: 'middle',
        keys: ['setup выполняется и на сервере, и на клиенте при гидратации', '$fetch не передаёт результат в payload', 'запрос уйдёт дважды', 'риск hydration mismatch и лишняя нагрузка', 'правильно — useFetch или useAsyncData'],
        a: 'Потому что setup выполняется дважды: при SSR на сервере и при гидратации в браузере. $fetch — просто промис, он не сохраняет результат в payload, поэтому на клиенте запрос пойдёт заново. Получаем двойную нагрузку на API, задержку при гидратации, а если данные успели измениться, ещё и mismatch. useFetch и useAsyncData как раз решают это: делают запрос на сервере и передают результат клиенту.'
      },
      {
        id: 'nuxt-dollar-fetch-q2',
        q: 'Где уместно использовать $fetch?',
        level: 'middle',
        keys: ['обработчики событий: формы, клики, мутации', 'внутри handler useAsyncData', 'серверный код Nitro', '$fetch.create для настроенного клиента с baseURL и перехватчиками', 'на сервере вызов /api идёт напрямую без HTTP'],
        a: 'Везде, где запрос — это действие, а не данные для первого рендера: отправка формы, добавление в корзину, удаление. Ещё внутри handler у useAsyncData — там $fetch и должен быть. В серверном коде тоже $fetch, причём запрос к своему /api на сервере не идёт по сети, Nitro вызывает обработчик напрямую. Для проекта обычно делаю $fetch.create с baseURL и перехватчиками и отдаю его через плагин.'
      }
    ]
  },
  {
    id: 'nuxt-lazy-fetch',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useLazyFetch и useLazyAsyncData',
    level: 'middle',
    summary: 'Lazy-версии не блокируют навигацию: страница открывается сразу, а загрузку показываем через status или pending.',
    what: 'useLazyFetch и useLazyAsyncData — это useFetch и useAsyncData с опцией lazy: true. Обычный вызов с await блокирует клиентскую навигацию, пока данные не придут. Lazy-версия сразу возвращает объект с пустым data, страница рендерится, а data заполняется по мере загрузки. Состояние загрузки видно по status (idle, pending, success, error) или boolean pending.',
    why: 'Делает навигацию отзывчивой: пользователь сразу видит новую страницу со скелетоном вместо ощущения, что клик не сработал. Подходит для второстепенных данных, которые не обязаны быть в первом кадре.',
    when: 'Lazy — для блоков второго плана: рекомендации, комментарии, статистика, тяжёлые списки. Для основного контента страницы и SEO-данных лучше обычный useFetch, чтобы не показывать пустой экран. Если данные вообще не нужны на сервере, lazy сочетают с server: false.',
    diff: 'Lazy влияет на клиентскую навигацию. При SSR Nuxt всё равно дожидается данных (если server не выключен) и кладёт их в payload, так что первый заход по ссылке отрисуется с данными. server: false — другое: запрос вообще не делается на сервере, данные грузятся только в браузере после гидратации.',
    code: [
      { title: 'Lazy с обработкой состояний', lang: 'vue', src: `<script setup lang="ts">
const route = useRoute()

// основной контент — блокирующий
const { data: article } = await useFetch(() => '/api/articles/' + route.params.slug)

// комментарии — не блокируем переход
const { data: comments, status } = useLazyFetch('/api/comments', {
  query: { slug: () => route.params.slug },
  default: () => []
})

// смотрим за приходом данных, если нужно что-то сделать с ними
watch(comments, (list) => {
  if (list.length) markAsRead(list)
})
</script>

<template>
  <ArticleBody :article="article" />
  <CommentsSkeleton v-if="status === 'pending'" />
  <CommentsList v-else :items="comments" />
</template>` },
      { title: 'Lazy + server: false', lang: 'ts', src: `// персональные рекомендации: не нужны в SSR и не должны его задерживать
const { data: recs, status, error } = useLazyAsyncData(
  'recs',
  () => $fetch('/api/recommendations'),
  { server: false }
)
// на сервере status будет idle, в браузере: pending -> success` }
    ],
    real: 'Страница статьи: текст грузится обычным useFetch, потому что это SEO-контент, а блок «Читайте также» и комментарии — через useLazyFetch со скелетонами. Переход из списка статей открывается мгновенно.',
    pitfalls: [
      'Не обрабатывать пустое data в шаблоне — с lazy первый рендер на клиенте почти всегда без данных, и обращение к полям упадёт.',
      'Писать код после useLazyFetch так, будто данные уже пришли, — их ещё нет, нужно watch или работать в шаблоне.',
      'Делать основной контент страницы lazy ради «скорости» — пользователь видит пустую страницу, а выигрыша почти нет.',
      'Ожидать, что lazy уберёт данные из SSR. Для этого нужен server: false.'
    ],
    questions: [
      {
        id: 'nuxt-lazy-fetch-q1',
        q: 'Чем useLazyFetch отличается от useFetch?',
        level: 'middle',
        keys: ['это useFetch с lazy: true', 'не блокирует клиентскую навигацию', 'data сначала пустое, надо обрабатывать status/pending', 'при SSR данные всё равно ждутся и идут в payload', 'для второстепенного контента'],
        a: 'useLazyFetch — то же самое, что useFetch с lazy: true. Разница в навигации: обычный await useFetch держит переход, пока данные не загрузятся, а lazy-версия сразу пускает на страницу, и data заполняется позже. Поэтому в шаблоне обязательно обрабатываю status pending и пустые данные, обычно скелетоном. При этом на сервере при первом заходе Nuxt всё равно дождётся данных, так что SSR не пострадает. Использую для второстепенных блоков вроде комментариев.'
      },
      {
        id: 'nuxt-lazy-fetch-q2',
        q: 'В чём разница между lazy: true и server: false?',
        level: 'middle+',
        keys: ['lazy — про блокировку навигации на клиенте', 'server: false — запрос не выполняется на сервере вообще', 'с server: false данных нет в SSR-HTML', 'часто комбинируют для клиентских второстепенных данных', 'status на сервере с server: false — idle'],
        a: 'Это разные оси. lazy отвечает за то, ждёт ли навигация данных: с lazy переход происходит сразу. server: false отвечает за среду: запрос не делается при SSR, данные загрузятся только в браузере после гидратации, и в серверном HTML их не будет. Если я хочу, чтобы данные грузились только на клиенте и не тормозили ни SSR, ни переход, ставлю обе опции, это и есть useLazyFetch с server: false.'
      }
    ]
  },
  {
    id: 'nuxt-usestate',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useState',
    level: 'middle',
    summary: 'useState — SSR-безопасное общее состояние по ключу: своё на каждый запрос и передаётся с сервера на клиент через payload.',
    what: 'useState(key, init) создаёт реактивное состояние, которое разделяется между всеми компонентами, вызвавшими useState с тем же ключом. На сервере состояние живёт в рамках одного запроса, после рендера сериализуется в payload, а на клиенте восстанавливается при гидратации. Функция init вызывается, только если состояния с таким ключом ещё нет.',
    why: 'Решает две задачи. Первая — общее состояние без утечки между пользователями: обычный ref на уровне модуля на сервере один на весь процесс. Вторая — передача значения, вычисленного на сервере, клиенту без повторного вычисления и без mismatch.',
    when: 'useState — для небольшого общего состояния: текущий пользователь, тема, флаги UI, значения, которые сервер вычислил и клиент должен увидеть такими же. Если логики много (actions, getters, devtools, плагины, модульность) — Pinia, которая в Nuxt тоже SSR-безопасна. Локальное состояние компонента — обычный ref.',
    diff: 'ref в setup — локальное состояние экземпляра. ref на верхнем уровне модуля — синглтон: в браузере это работает как глобальный стор, но на сервере такой ref общий для всех запросов, и данные одного пользователя увидит другой. useState привязан к nuxtApp, который создаётся заново на каждый запрос. Pinia через модуль @pinia/nuxt тоже создаёт стор на запрос и тоже переносит состояние через payload, но даёт структуру и инструменты.',
    code: [
      { title: 'Плохо: состояние в модуле', lang: 'ts', src: `// composables/useUser.ts
// Опасно: на сервере этот ref один на все запросы и всех пользователей
const user = ref<User | null>(null)

export const useUser = () => {
  const setUser = (u: User) => { user.value = u }
  return { user, setUser }
}` },
      { title: 'Хорошо: useState', lang: 'ts', src: `// composables/useUser.ts
export const useUser = () => {
  const user = useState<User | null>('user', () => null)
  const isLoggedIn = computed(() => !!user.value)

  async function fetchUser() {
    user.value = await useRequestFetch()('/api/me').catch(() => null)
  }
  return { user, isLoggedIn, fetchUser }
}

// plugins/user.ts — один раз за запрос на сервере
export default defineNuxtPlugin(async () => {
  const { user, fetchUser } = useUser()
  if (import.meta.server && !user.value) await fetchUser()
})` }
    ],
    real: 'Текущий пользователь загружается на сервере в плагине, кладётся в useState и попадает в payload. Шапка, меню и страницы читают его через useUser без дополнительных запросов и без мигания «Войти» на клиенте.',
    pitfalls: [
      'Держать состояние в ref вне функции composable — на сервере это утечка данных между запросами разных пользователей.',
      'Класть в useState несериализуемое: функции, экземпляры классов, DOM-узлы — payload это не перенесёт.',
      'Использовать один ключ для разных по смыслу состояний — они перезапишут друг друга.',
      'Вызывать useState вне setup, плагинов и middleware — нужен контекст Nuxt.'
    ],
    questions: [
      {
        id: 'nuxt-usestate-q1',
        q: 'Зачем useState, если можно сделать ref на уровне модуля?',
        level: 'middle',
        keys: ['модульный ref на сервере — один на процесс', 'данные утекают между запросами и пользователями', 'useState привязан к nuxtApp, создаётся на каждый запрос', 'значение передаётся в payload и не вычисляется на клиенте заново', 'одинаковое значение на сервере и клиенте — без mismatch'],
        a: 'В браузере модульный ref работает как глобальный стор, и всё выглядит нормально. Но на сервере модуль загружается один раз на весь процесс, и такой ref становится общим для всех запросов: пользователь A может увидеть данные пользователя B. useState хранит состояние в nuxtApp, который создаётся на каждый запрос, поэтому изоляция гарантирована. Плюс значение сериализуется в payload и на клиенте восстанавливается, а не вычисляется заново, так что нет и mismatch.'
      },
      {
        id: 'nuxt-usestate-q2',
        q: 'Когда брать useState, а когда Pinia?',
        level: 'middle',
        keys: ['обе SSR-безопасны и переносят состояние через payload', 'useState — для простых общих значений', 'Pinia — структура: actions, getters, devtools, плагины', 'в больших командах Pinia удобнее поддерживать', 'не хранить в обоих несериализуемое'],
        a: 'Оба варианта корректно работают при SSR: состояние создаётся на запрос и передаётся клиенту. useState хорош для простых вещей вроде темы, флага открытого меню или текущего пользователя, обёрнутых в небольшой composable. Когда состояния становится много и вокруг него появляется логика, беру Pinia: там понятная структура с actions и getters, devtools и плагины, например для persist. Для команды из нескольких человек Pinia обычно проще поддерживать.'
      }
    ]
  },
  {
    id: 'nuxt-route-router',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useRoute, useRouter, navigateTo',
    level: 'junior',
    summary: 'useRoute даёт текущий маршрут, useRouter — экземпляр vue-router, navigateTo — универсальная навигация, которая работает и на сервере.',
    what: 'useRoute() возвращает реактивный объект текущего маршрута: path, params, query, hash, meta, fullPath. useRouter() возвращает экземпляр vue-router с push, replace, back, addRoute и хуками. navigateTo(to, options) — хелпер Nuxt для перехода: на клиенте это router.push, на сервере — HTTP-редирект. Опции: replace, redirectCode, external для внешних URL, open для открытия в новом окне.',
    why: 'navigateTo нужен, потому что один и тот же код (middleware, setup) может выполниться на сервере, где router.push не может «перейти» — нужно ответить редиректом. navigateTo сам выбирает правильное поведение.',
    when: 'navigateTo — по умолчанию для любых переходов в коде, особенно в middleware и setup. useRouter — когда нужно что-то специфичное для роутера: back, хуки beforeEach, динамические маршруты. useRoute — для чтения параметров и query.',
    diff: 'router.push на сервере не делает редирект, navigateTo — делает (302 по умолчанию, можно 301 через redirectCode). Для внешнего URL navigateTo требует external: true, иначе бросит ошибку, а router.push внешние ссылки не умеет вообще. В middleware вместо useRoute используют аргументы to и from.',
    code: [
      { title: 'Чтение маршрута и навигация', lang: 'vue', src: `<script setup lang="ts">
const route = useRoute()
const router = useRouter()

// query как источник правды для фильтров
const page = computed(() => Number(route.query.page ?? 1))

function goToPage(p: number) {
  navigateTo({ query: { ...route.query, page: p } }, { replace: true })
}

async function onSaved(id: number) {
  await navigateTo('/orders/' + id)
}

function payExternal(url: string) {
  return navigateTo(url, { external: true })
}
</script>

<template>
  <button @click="router.back()">Назад</button>
  <Pagination :page="page" @change="goToPage" />
</template>` },
      { title: 'Серверный редирект', lang: 'ts', src: `// pages/old-catalog/[id].vue — переехавшая страница
const route = useRoute()
// на сервере ответит 301, на клиенте просто перейдёт
await navigateTo('/catalog/' + route.params.id, { redirectCode: 301 })

// middleware/guest.ts
export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn } = useUser()
  if (isLoggedIn.value) return navigateTo('/account', { replace: true })
})` }
    ],
    real: 'Фильтры каталога хранятся в route.query: ссылкой можно поделиться, и сервер отрисует ту же выборку. Смена фильтра — navigateTo с replace: true, чтобы каждый клик по чекбоксу не засорял историю браузера.',
    pitfalls: [
      'Использовать useRoute внутри middleware — он может вернуть ещё старый маршрут. В middleware работать с аргументами to и from.',
      'Вызвать navigateTo на внешний сайт без external: true — получите ошибку.',
      'Не возвращать navigateTo в middleware и не дожидаться его в async-функции — редирект не сработает или код после него продолжит выполняться.',
      'Деструктурировать route: const { params } = useRoute() — при смене маршрута params не обновится, теряется реактивность.'
    ],
    questions: [
      {
        id: 'nuxt-route-router-q1',
        q: 'Чем navigateTo отличается от router.push?',
        level: 'middle',
        keys: ['navigateTo работает и на клиенте, и на сервере', 'на сервере даёт HTTP-редирект (302, redirectCode)', 'умеет external для внешних ссылок и open для нового окна', 'в middleware его нужно вернуть', 'router.push — только клиентская навигация vue-router'],
        a: 'router.push — это чистая клиентская навигация vue-router. navigateTo — обёртка Nuxt, которая учитывает SSR: в браузере ведёт себя как push или replace, а на сервере отвечает HTTP-редиректом, по умолчанию 302, код можно поменять через redirectCode. Ещё она умеет переходить на внешние URL с external: true и открывать новое окно через open. Поэтому в middleware и setup я всегда использую navigateTo и не забываю вернуть её результат.'
      },
      {
        id: 'nuxt-route-router-q2',
        q: 'Как правильно работать с query-параметрами для фильтров?',
        level: 'middle',
        keys: ['читать из useRoute().query через computed', 'писать через navigateTo/router с replace', 'query — строки или массивы, нужно приводить типы', 'передавать в useFetch реактивно, чтобы перезапрашивал', 'URL как источник правды — шаринг и SSR'],
        a: 'Делаю URL источником правды: фильтры читаю из route.query через computed и привожу типы, потому что там всегда строки или массивы строк. Изменения записываю через navigateTo с новым query и replace: true, чтобы не плодить записи в истории. В useFetch передаю эти computed, и при смене query запрос перезапускается сам. Плюс в том, что ссылку с фильтрами можно отправить, и сервер сразу отрисует ту же выборку.'
      }
    ]
  }
);

window.SOBES.topics.push(
  {
    id: 'nuxt-usecookie',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useCookie',
    level: 'middle',
    summary: 'useCookie — реактивная cookie для сервера и клиента: при SSR читается из заголовков запроса, в браузере — из document.cookie.',
    what: 'useCookie(name, options) возвращает ref, связанный с cookie. При SSR значение читается из заголовка Cookie входящего запроса, а при изменении Nuxt добавит Set-Cookie в ответ. В браузере ref читает и пишет document.cookie. Опции: maxAge, expires, path, domain, secure, httpOnly, sameSite, default, readonly, watch (следить за глубокими изменениями объекта). Значение сериализуется в JSON, поэтому можно хранить небольшие объекты.',
    why: 'Cookie — единственное клиентское хранилище, которое сервер видит при первом запросе. Поэтому всё, что нужно для SSR-рендера и зависит от пользователя (токен, тема, язык, регион), лучше держать в cookie, а не в localStorage.',
    when: 'Тема, язык, выбранный город, согласие на cookie, токен авторизации (лучше httpOnly и выставлять с сервера). Не для больших данных: cookie уходит с каждым запросом и ограничена примерно 4 КБ.',
    diff: 'localStorage сервер не видит, поэтому всё, что из него читается, даёт mismatch или требует ClientOnly. useState живёт только в рамках одного запроса и сессии вкладки, cookie переживает перезагрузку. httpOnly cookie недоступна из JS в браузере: её можно выставить на сервере (setCookie в Nitro), но изменить клиентским useCookie нельзя.',
    code: [
      { title: 'Тема без мигания при SSR', lang: 'vue', src: `<script setup lang="ts">
const theme = useCookie<'light' | 'dark'>('theme', {
  default: () => 'light',
  maxAge: 60 * 60 * 24 * 365,
  sameSite: 'lax'
})

useHead({ htmlAttrs: { 'data-theme': theme } })

function toggle() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <button @click="toggle">Тема: {{ theme }}</button>
</template>` },
      { title: 'Токен: читает клиент, выставляет сервер', lang: 'ts', src: `// server/api/login.post.ts — httpOnly cookie, JS в браузере её не видит
export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const token = await auth.login(email, password)
  setCookie(event, 'session', token, {
    httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7
  })
  return { ok: true }
})

// после логина обновить cookie-ref, выставленную сервером
await $fetch('/api/login', { method: 'POST', body: form })
refreshCookie('session')` }
    ],
    real: 'Выбор города в интернет-магазине: город хранится в cookie, сервер сразу рендерит цены и наличие для нужного региона, и пользователь не видит, как цены перескакивают после загрузки.',
    pitfalls: [
      'Хранить в useCookie большие объекты (корзину с товарами) — cookie раздувается, уходит с каждым запросом и упирается в лимит около 4 КБ.',
      'Пытаться изменить httpOnly cookie клиентским useCookie — браузер не даст, значение молча не запишется.',
      'Мутировать поле объекта в cookie (cookie.value.a = 1) и ждать сохранения — без опции watch: true глубокие изменения не отслеживаются, нужно присваивать новый объект.',
      'Хранить чувствительный токен в обычной (не httpOnly) cookie — его может прочитать любой скрипт на странице при XSS.'
    ],
    questions: [
      {
        id: 'nuxt-usecookie-q1',
        q: 'Почему в Nuxt тему или токен лучше хранить в cookie, а не в localStorage?',
        level: 'middle',
        keys: ['cookie приходит на сервер с первым запросом', 'сервер рендерит правильный вариант сразу — нет мигания и mismatch', 'localStorage доступен только в браузере', 'useCookie работает одинаково на сервере и клиенте', 'для токена — httpOnly, выставлять с сервера'],
        a: 'Сервер при SSR видит только то, что пришло в запросе, а cookie приходит с ним автоматически. Значит, сервер сразу отрендерит тёмную тему или авторизованную шапку, и клиент при гидратации получит то же самое. localStorage сервер не видит, поэтому пришлось бы либо рендерить дефолт и потом перескакивать, либо прятать блок в ClientOnly. useCookie даёт один API для обеих сред. Для токенов дополнительно ставлю httpOnly и выставляю cookie с сервера, чтобы JS его не видел.'
      },
      {
        id: 'nuxt-usecookie-q2',
        q: 'Как useCookie работает на сервере?',
        level: 'middle+',
        keys: ['читает значение из заголовка Cookie входящего запроса', 'при изменении добавляет Set-Cookie в ответ', 'значение сериализуется (JSON)', 'httpOnly cookie нельзя менять из браузера', 'refreshCookie — перечитать после изменения сервером'],
        a: 'На сервере useCookie парсит заголовок Cookie текущего запроса и отдаёт значение как ref. Если в ходе SSR присвоить новое значение, Nuxt добавит в ответ заголовок Set-Cookie, и браузер сохранит его. На клиенте тот же ref читает и пишет document.cookie. Значение по умолчанию сериализуется в JSON. Если cookie поменял сам сервер, например при логине через API, клиентский ref об этом не знает, и для этого есть refreshCookie.'
      }
    ]
  },
  {
    id: 'nuxt-request-headers',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useRequestHeaders и useRequestFetch',
    level: 'middle+',
    summary: 'На сервере запросы из SSR не несут cookie пользователя сами по себе — их пробрасывают через useRequestHeaders или useRequestFetch.',
    what: 'useRequestHeaders(include?) возвращает заголовки входящего запроса при SSR (на клиенте — пустой объект). useRequestFetch() возвращает версию $fetch, которая автоматически пробрасывает заголовки и контекст входящего запроса в запросы к своему API. Есть ещё useRequestEvent для доступа к h3 event при SSR и useRequestURL для текущего URL на обеих сторонах.',
    why: 'Когда пользователь заходит на страницу, браузер шлёт cookie Nuxt-серверу. Но если сервер при SSR сам делает $fetch к API, это новый запрос с сервера, и cookie туда не попадут — API увидит анонима. Нужно явно пробросить заголовки.',
    when: 'Когда SSR-запрос к API должен быть от имени пользователя: профиль, корзина, персональные цены. useFetch к относительному URL пробрасывает заголовки сам. Голый $fetch внутри useAsyncData или в плагине — нет, туда нужен useRequestFetch или headers: useRequestHeaders([...]). Для внешнего API (другой домен) решать осознанно, какие заголовки передавать.',
    diff: 'useRequestHeaders только читает заголовки, а useRequestFetch — готовый клиент с пробросом. В браузере проблемы нет: браузер сам прикладывает cookie к запросам на тот же домен. Пробрасывать все заголовки подряд во внешний сервис опасно: можно отдать чужому домену cookie пользователя, поэтому лучше передавать только нужные.',
    code: [
      { title: 'Проброс cookie при SSR', lang: 'ts', src: `// Плохо: при SSR /api/cart получит запрос без cookie, корзина пустая
const { data: cart } = await useAsyncData('cart', () => $fetch('/api/cart'))

// Хорошо: useRequestFetch пробрасывает заголовки входящего запроса
const requestFetch = useRequestFetch()
const { data: cartOk } = await useAsyncData('cart', () => requestFetch('/api/cart'))

// Явно, только cookie
const headers = useRequestHeaders(['cookie'])
const { data: me } = await useAsyncData('me', () => $fetch('/api/me', { headers }))

// useFetch к своему API пробрасывает сам
const { data: orders } = await useFetch('/api/orders')` },
      { title: 'Заголовки во внешний API и прочие хелперы', lang: 'ts', src: `// во внешний бэкенд передаём только нужное
const { authorization } = useRequestHeaders(['authorization'])
const config = useRuntimeConfig()
const { data } = await useFetch(config.public.apiBase + '/profile', {
  headers: authorization ? { authorization } : {}
})

// язык браузера для SSR-локализации
const lang = useRequestHeaders(['accept-language'])['accept-language']

// текущий URL на сервере и клиенте
const url = useRequestURL()   // url.origin, url.pathname` }
    ],
    real: 'Классический баг: после логина корзина в шапке на секунду показывает «пусто», а потом заполняется. Причина — при SSR $fetch к /api/cart ушёл без cookie. После замены на useRequestFetch корзина сразу рендерится сервером.',
    pitfalls: [
      'Звать $fetch внутри useAsyncData при SSR и ждать, что API увидит пользователя — без проброса cookie запрос анонимный.',
      'Пробрасывать все заголовки (включая host, content-length) во внешний API — можно сломать запрос и отдать cookie чужому домену.',
      'Использовать useRequestHeaders для логики на клиенте — там он возвращает пустой объект.',
      'Вызывать useRequestFetch или useRequestHeaders внутри handler после await — контекст Nuxt может быть потерян, лучше получить их в начале setup.'
    ],
    questions: [
      {
        id: 'nuxt-request-headers-q1',
        q: 'Почему при SSR API не видит авторизацию пользователя, хотя в браузере всё работает?',
        level: 'middle+',
        keys: ['SSR-запрос делает сервер Nuxt, а не браузер', 'cookie пользователя автоматически не передаются', '$fetch не пробрасывает заголовки', 'useRequestFetch или headers из useRequestHeaders([cookie])', 'useFetch к своему API пробрасывает сам'],
        a: 'В браузере cookie прикладываются к запросу автоматически. А при SSR запрос к API делает уже сервер Nuxt, это отдельный HTTP-клиент, и cookie входящего запроса он сам не знает. Голый $fetch их не передаёт, поэтому API видит анонима. Решение — useRequestFetch, который пробрасывает заголовки входящего запроса, или явная передача headers из useRequestHeaders с cookie. useFetch к относительному адресу делает это сам, проблема чаще всего в $fetch внутри useAsyncData или плагинов.'
      },
      {
        id: 'nuxt-request-headers-q2',
        q: 'Что вернёт useRequestHeaders на клиенте и как его правильно использовать?',
        level: 'middle',
        keys: ['на клиенте — пустой объект', 'на сервере — заголовки входящего запроса', 'передавать список нужных заголовков', 'не пробрасывать все заголовки во внешние сервисы'],
        a: 'На клиенте он вернёт пустой объект: браузер не даёт прочитать заголовки собственного запроса, да и не нужно. На сервере это заголовки запроса, который пришёл от пользователя. Использую его с явным списком, например только cookie или accept-language, и передаю в headers запроса. Пробрасывать всё подряд не стоит: там служебные заголовки вроде host, и можно случайно отдать cookie чужому домену.'
      }
    ]
  },
  {
    id: 'nuxt-usenuxtapp',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'useNuxtApp',
    level: 'middle',
    summary: 'useNuxtApp даёт доступ к контексту приложения: provide-хелперы, vueApp, хуки, payload, ssrContext, runWithContext.',
    what: 'useNuxtApp() возвращает nuxtApp — объект текущего приложения, который создаётся на каждый запрос на сервере и один раз в браузере. В нём: всё, что отдали плагины через provide (с префиксом $), vueApp, hook и callHook для хуков жизненного цикла, payload с сериализуемыми данными, ssrContext на сервере, isHydrating, runWithContext.',
    why: 'Нужен, чтобы достать глобальные хелперы ($api, $i18n), подписаться на хуки приложения (page:finish, app:error), прочитать payload или выполнить код с восстановленным контекстом Nuxt.',
    when: 'Брать в composables, плагинах и middleware, когда нужен доступ к provide-хелперам или хукам. Не тащить nuxtApp во все компоненты без необходимости: большинство задач решают специализированные composables (useState, useRuntimeConfig, useRoute).',
    diff: 'getCurrentInstance даёт экземпляр конкретного компонента, useNuxtApp — экземпляр всего приложения. Глобальные свойства Vue (app.config.globalProperties) видны только в шаблонах и Options API, а provide из Nuxt-плагина доступен и через useNuxtApp, и в шаблонах, причём с типами. tryUseNuxtApp возвращает null вместо ошибки, если контекста нет.',
    code: [
      { title: 'Хелперы и хуки', lang: 'vue', src: `<script setup lang="ts">
const nuxtApp = useNuxtApp()
const { $api } = nuxtApp   // из plugins/api.ts: return { provide: { api } }

const loading = ref(false)
nuxtApp.hook('page:start', () => { loading.value = true })
nuxtApp.hook('page:finish', () => { loading.value = false })

async function remove(id: number) {
  await $api('/orders/' + id, { method: 'DELETE' })
}

const hydrating = nuxtApp.isHydrating
</script>` },
      { title: 'runWithContext после await', lang: 'ts', src: `// middleware/check-subscription.ts
export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp()
  const status = await $fetch('/api/subscription')   // после await контекст может быть потерян

  // composables Nuxt после await вызываем внутри runWithContext
  await nuxtApp.runWithContext(() => {
    const flags = useState('subscription', () => status)
    flags.value = status
  })
  if (!status.active) return navigateTo('/pricing')
})` }
    ],
    real: 'Глобальный индикатор загрузки страниц делают через хуки page:start и page:finish, а глобальный обработчик ошибок — через хук vue:error или app:error в плагине. API-клиент берут из useNuxtApp().$api.',
    pitfalls: [
      'Вызывать useNuxtApp и другие composables Nuxt вне контекста — в произвольной функции модуля, в setTimeout, после await в middleware или плагине. Получите ошибку nuxt instance unavailable. Помогает runWithContext.',
      'Писать в nuxtApp.payload несериализуемые данные — их не получится передать на клиент.',
      'Подписываться через nuxtApp.hook в компоненте и не отписываться — хук возвращает функцию отписки, без неё обработчики копятся при каждом монтировании.',
      'Сохранять nuxtApp в переменную модуля на сервере — это экземпляр конкретного запроса, получится утечка между пользователями.'
    ],
    questions: [
      {
        id: 'nuxt-usenuxtapp-q1',
        q: 'Что такое nuxtApp и что в нём есть?',
        level: 'middle',
        keys: ['контекст приложения: на сервере новый на каждый запрос', 'provide-хелперы с префиксом $', 'vueApp, hook/callHook', 'payload, ssrContext, isHydrating', 'runWithContext для восстановления контекста'],
        a: 'nuxtApp — это контекст приложения Nuxt. На сервере он создаётся заново на каждый запрос, в браузере один раз. Через него доступны хелперы, которые плагины отдали через provide, например $api, сам Vue-инстанс vueApp, система хуков, payload с данными для гидратации, ssrContext на сервере и флаг isHydrating. Все composables Nuxt внутри используют именно его, поэтому им нужен активный контекст.'
      },
      {
        id: 'nuxt-usenuxtapp-q2',
        q: 'Откуда ошибка «nuxt instance unavailable» и как её исправить?',
        level: 'middle+',
        keys: ['composable вызван вне контекста Nuxt', 'частая причина — вызов после await в middleware/плагине', 'или в обычной функции модуля, таймере, сторонней библиотеке', 'вызывать composables до await', 'nuxtApp.runWithContext для кода после await'],
        a: 'Composables Nuxt ищут текущий nuxtApp через неявный контекст, который существует только синхронно во время setup, плагина или middleware. После await в middleware или плагине, а также в таймере или обычной функции модуля этого контекста уже может не быть, и получаем ошибку. Исправляю так: вызываю все composables до первого await и сохраняю результаты в переменные, а если без await никак — получаю nuxtApp в начале и выполняю код через nuxtApp.runWithContext. В script setup компилятор Vue сам восстанавливает контекст после await, поэтому там проблема встречается реже.'
      }
    ]
  },
  {
    id: 'nuxt-runtime-config',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'runtimeConfig и app.config',
    level: 'middle',
    summary: 'runtimeConfig — конфигурация, переопределяемая переменными NUXT_* при запуске; приватные ключи только на сервере, public — везде.',
    what: 'runtimeConfig в nuxt.config описывает настройки приложения. Ключи верхнего уровня приватные: доступны только на сервере. Всё внутри public доступно и на клиенте (попадает в payload). Значения переопределяются переменными окружения при запуске: apiSecret — NUXT_API_SECRET, public.apiBase — NUXT_PUBLIC_API_BASE. Читаются через useRuntimeConfig(), в серверных обработчиках — useRuntimeConfig(event). app.config.ts — отдельный файл с публичной конфигурацией, которая фиксируется на этапе сборки и реактивна во время работы.',
    why: 'Позволяет собрать приложение один раз и запускать его в разных окружениях (stage, prod) с разными адресами и ключами, не пересобирая. И чётко разделяет секреты, которые никогда не должны попасть в браузер.',
    when: 'runtimeConfig — адреса API, ключи, DSN, всё, что зависит от окружения и может меняться без пересборки. Приватная часть — для секретов (токены внешних API, ключи БД). app.config — для публичных настроек проекта, которые не зависят от окружения: тема, цвета, названия, флаги UI.',
    diff: 'Переменные окружения переопределяют только ключи, которые уже объявлены в runtimeConfig, и только с префиксом NUXT_. Прямое чтение process.env в коде на сервере работает, но в рантайме с другим окружением значение может оказаться захардкоженным при сборке. app.config нельзя переопределить через env, зато он может хранить не только строки и обновляется через HMR.',
    code: [
      { title: 'Объявление и переменные окружения', lang: 'ts', src: `// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // приватные — только сервер
    telegramToken: '',          // NUXT_TELEGRAM_TOKEN
    databaseUrl: '',            // NUXT_DATABASE_URL
    public: {
      apiBase: '/api',          // NUXT_PUBLIC_API_BASE
      sentryDsn: ''             // NUXT_PUBLIC_SENTRY_DSN
    }
  }
})

// .env (локально) или переменные окружения на сервере
// NUXT_TELEGRAM_TOKEN=123:abc
// NUXT_PUBLIC_API_BASE=https://api.example.com` },
      { title: 'Чтение на клиенте и сервере, app.config', lang: 'ts', src: `// компонент или composable
const config = useRuntimeConfig()
config.public.apiBase      // доступно
config.telegramToken       // на клиенте undefined

// server/api/notify.post.ts
export default defineEventHandler(async (event) => {
  const { telegramToken } = useRuntimeConfig(event)
  // ...
})

// app.config.ts — публичная конфигурация на этапе сборки
export default defineAppConfig({
  brand: { name: 'Shop', primary: '#0a7' }
})
// в компоненте: const appConfig = useAppConfig(); appConfig.brand.name` }
    ],
    real: 'Один Docker-образ запускается на stage и prod с разными NUXT_PUBLIC_API_BASE и NUXT_PAYMENT_SECRET. Секрет платёжки читается только в server/api, а в браузер уходит лишь публичный адрес API.',
    pitfalls: [
      'Положить секрет в public — он окажется в HTML каждой страницы и в бандле, его увидит любой.',
      'Задать переменную NUXT_SOMETHING для ключа, которого нет в runtimeConfig, — она будет проигнорирована.',
      'Ожидать, что переменная без префикса NUXT_ (например API_BASE) подхватится в рантайме — дефолт в конфиге вычисляется при сборке.',
      'Хранить в app.config то, что зависит от окружения, — его нельзя переопределить без пересборки.'
    ],
    questions: [
      {
        id: 'nuxt-runtime-config-q1',
        q: 'Как в Nuxt устроен runtimeConfig и как не утащить секрет на клиент?',
        level: 'middle',
        keys: ['ключи верхнего уровня — только сервер', 'public — доступно и на клиенте, попадает в payload', 'переопределение через NUXT_* и NUXT_PUBLIC_* при запуске', 'ключ должен быть объявлен в конфиге', 'на сервере useRuntimeConfig(event)'],
        a: 'В nuxt.config объявляю runtimeConfig: всё на верхнем уровне приватно и доступно только на сервере, всё внутри public уходит и на клиент. Значения переопределяются переменными окружения в рантайме по соглашению: NUXT_ плюс имя ключа в верхнем регистре, для публичных NUXT_PUBLIC_. Это позволяет собрать образ один раз и запускать его в разных окружениях. Секреты держу только в приватной части и читаю их в server/api через useRuntimeConfig(event), поэтому в браузер они не попадают.'
      },
      {
        id: 'nuxt-runtime-config-q2',
        q: 'Чем runtimeConfig отличается от app.config?',
        level: 'middle+',
        keys: ['runtimeConfig переопределяется env в рантайме', 'runtimeConfig имеет приватную часть для секретов', 'app.config — только публичный, фиксируется при сборке', 'app.config реактивен и может хранить не только строки', 'app.config — для темы, брендинга, флагов UI'],
        a: 'runtimeConfig про окружение: адреса, ключи, секреты, которые меняются между stage и prod и задаются переменными NUXT_ при запуске. У него есть приватная серверная часть. app.config про сам проект: он всегда публичный, фиксируется при сборке, через env не переопределяется, зато реактивен, обновляется через HMR и может содержать любые значения. Туда кладу тему, название бренда, настройки UI-библиотеки. Секреты в app.config класть нельзя.'
      }
    ]
  },
  {
    id: 'nuxt-cache',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'Кеширование данных: key, dedupe, getCachedData, payload',
    level: 'middle+',
    summary: 'Данные useAsyncData/useFetch кешируются по ключу в nuxtApp и payload; getCachedData, refresh и clearNuxtData управляют кешем.',
    what: 'Результат useAsyncData и useFetch хранится в nuxtApp под ключом. При SSR он сериализуется в payload, и на клиенте getCachedData по умолчанию берёт данные из payload во время гидратации, поэтому повторного запроса нет. При клиентской навигации по умолчанию запрос делается заново. Своя функция getCachedData позволяет переиспользовать уже загруженные данные и между переходами. refresh перезапрашивает данные, refreshNuxtData и clearNuxtData обновляют или очищают данные по ключам глобально. Опция dedupe управляет повторными вызовами, пока предыдущий запрос ещё идёт: cancel (по умолчанию) отменяет старый, defer не запускает новый.',
    why: 'Управление кешем убирает лишние запросы при переходах туда-обратно, делает навигацию мгновенной и позволяет точечно инвалидировать данные после мутаций.',
    when: 'Кастомный getCachedData — для данных, которые меняются редко: справочники, категории, конфигурация. refreshNuxtData — после мутации, чтобы обновить связанные данные в других компонентах. clearNuxtData — при выходе пользователя, чтобы не показывать чужие данные из памяти. Для HTTP-кеширования всей страницы — routeRules swr/isr, это другой уровень.',
    diff: 'Кеш useAsyncData живёт в памяти приложения в браузере и в payload одной страницы, это не HTTP-кеш и не серверный кеш. Серверное кеширование ответов — defineCachedEventHandler или cachedFunction в Nitro и routeRules. useState хранит произвольное состояние, а кеш useAsyncData привязан к результату запроса и ключу.',
    code: [
      { title: 'Кеш между переходами через getCachedData', lang: 'ts', src: `// категории меняются редко — не перезапрашиваем при каждом переходе
const { data: categories } = await useFetch('/api/categories', {
  key: 'categories',
  getCachedData(key, nuxtApp) {
    return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
  }
})

// с TTL: храним время загрузки рядом с данными
const { data: rates } = await useFetch('/api/rates', {
  key: 'rates',
  transform: (input) => ({ ...input, fetchedAt: Date.now() }),
  getCachedData(key, nuxtApp) {
    const cached = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
    if (!cached) return
    if (Date.now() - cached.fetchedAt > 60_000) return   // устарело — запросить
    return cached
  }
})` },
      { title: 'Инвалидация после мутаций, dedupe', lang: 'ts', src: `// после добавления товара обновить корзину везде, где она используется
async function addToCart(id: number) {
  await $fetch('/api/cart', { method: 'POST', body: { id } })
  await refreshNuxtData('cart')
}

// при выходе — очистить персональные данные
async function logout() {
  await $fetch('/api/logout', { method: 'POST' })
  clearNuxtData(['cart', 'me', 'orders'])
  await navigateTo('/')
}

// поиск: новый ввод отменяет предыдущий запрос (это поведение по умолчанию)
const q = ref('')
const { data } = await useFetch('/api/search', { query: { q }, dedupe: 'cancel' })` }
    ],
    real: 'В шапке и в фильтрах каталога используется список категорий с ключом categories. С getCachedData он загружается один раз за сессию, и переходы между страницами каталога не делают лишних запросов. А корзина после каждого изменения обновляется через refreshNuxtData по ключу.',
    pitfalls: [
      'Включить «вечный» getCachedData для данных, которые меняются (цены, остатки), — пользователь видит устаревшее до перезагрузки.',
      'Не очистить кеш при логауте — следующий пользователь на том же устройстве увидит чужой профиль из памяти.',
      'Ждать, что одинаковый URL, но разные ключи, разделят кеш — кеш привязан к ключу, а не к URL.',
      'Путать клиентский кеш данных и серверное кеширование: getCachedData не снижает нагрузку на API при SSR — каждый новый SSR-запрос выполнит handler заново.'
    ],
    questions: [
      {
        id: 'nuxt-cache-q1',
        q: 'Как кешируются данные useFetch/useAsyncData и как сделать, чтобы они не перезапрашивались при каждом переходе?',
        level: 'middle+',
        keys: ['данные хранятся по ключу в nuxtApp и payload', 'по умолчанию кеш используется при гидратации, при навигации запрос заново', 'getCachedData возвращает данные из payload/static — запроса нет', 'если getCachedData вернул undefined — запрос выполняется', 'можно добавить TTL через время загрузки'],
        a: 'Результат хранится в nuxtApp под ключом. По умолчанию getCachedData использует его только при гидратации: клиент берёт серверные данные из payload. При клиентском переходе на страницу запрос идёт заново. Если данные редко меняются, переопределяю getCachedData так, чтобы он возвращал nuxtApp.payload.data по ключу — тогда при повторных переходах запроса не будет. Если функция вернула undefined, Nuxt делает запрос, поэтому несложно добавить TTL, сохраняя время загрузки рядом с данными.'
      },
      {
        id: 'nuxt-cache-q2',
        q: 'Что делают refresh, refreshNuxtData, clearNuxtData и опция dedupe?',
        level: 'middle+',
        keys: ['refresh — перезапрос конкретного useFetch/useAsyncData', 'refreshNuxtData(keys) — перезапрос по ключам из любого места', 'clearNuxtData(keys) — сброс данных и состояния', 'dedupe cancel — отменить предыдущий запрос, defer — не запускать новый', 'refreshNuxtData удобен после мутаций'],
        a: 'refresh, который возвращает useFetch, перезапрашивает именно эти данные. refreshNuxtData делает то же по ключам из любого места, без доступа к исходному вызову: после добавления в корзину вызываю refreshNuxtData с ключом cart, и шапка обновится сама. clearNuxtData сбрасывает данные, ошибку и статус по ключам, это нужно при логауте. dedupe решает, что делать, если запрос по ключу уже идёт: cancel отменяет старый и запускает новый, это поведение по умолчанию и подходит для поиска, а defer просто дожидается текущего.'
      },
      {
        id: 'nuxt-cache-q3',
        q: 'Что такое payload в Nuxt?',
        level: 'middle',
        keys: ['сериализованные данные, которые сервер передаёт клиенту', 'в нём результаты useAsyncData/useFetch и useState', 'встраивается в HTML или отдельный JSON (_payload.json при prerender)', 'клиент гидратируется из него без повторных запросов', 'большой payload раздувает HTML — pick/transform'],
        a: 'Payload — это пакет данных, которые сервер собрал во время SSR и передаёт клиенту вместе с HTML: результаты useAsyncData и useFetch, значения useState, состояние Pinia. Клиент при гидратации берёт данные оттуда, поэтому не делает повторных запросов и рендерит то же самое. Для пререндеренных страниц payload лежит отдельным _payload.json, и при клиентской навигации Nuxt подгружает его. Чем больше данных туда попадает, тем тяжелее страница, поэтому лишнее отрезаю через pick и transform.'
      }
    ]
  },
  {
    id: 'nuxt-server-vs-client',
    section: 'nuxt',
    group: 'Composables и API',
    title: 'Где выполняется код: сервер и клиент',
    level: 'middle',
    summary: 'В universal-режиме setup выполняется дважды — на сервере и при гидратации; браузерные API и хуки монтирования есть только на клиенте.',
    what: 'При первом заходе код компонентов выполняется на сервере (setup, рендер в строку), а потом ещё раз в браузере при гидратации. При дальнейшей клиентской навигации — только в браузере. На сервере нет window, document, localStorage, и не вызываются onBeforeMount, onMounted, onUpdated — только setup и onServerPrefetch. Отличить среду можно через import.meta.server и import.meta.client (старый вариант — process.server и process.client), а также суффиксами .server и .client у плагинов и компонентов.',
    why: 'Понимание двух сред объясняет большинство ошибок в Nuxt: window is not defined, двойные запросы, hydration mismatch, утечки состояния между пользователями и попадание секретов в бандл.',
    when: 'Браузерные API — в onMounted, в обработчиках событий, в .client-плагинах и компонентах. Секреты и доступ к БД — только в server/. В общем коде, где нужно разное поведение, — проверка import.meta.client или import.meta.server, которую сборщик вырезает из ненужного бандла.',
    diff: 'import.meta.client/server — статические флаги, которые заменяются при сборке, и мёртвая ветка удаляется из бандла. typeof window !== undefined — проверка в рантайме, код обеих веток остаётся. process.client и process.server работают, но считаются устаревшими в пользу import.meta. В отличие от server/, код компонентов попадает в клиентский бандл целиком, даже если ветка выполняется только на сервере.',
    code: [
      { title: 'Что где выполняется', lang: 'vue', src: `<script setup lang="ts">
console.log('setup')            // сервер при SSR и клиент при гидратации

if (import.meta.server) {
  console.log('только сервер')   // вырезается из клиентского бандла
}

onServerPrefetch(async () => {
  // только сервер, перед рендером
})

onMounted(() => {
  // только клиент: есть window, document, localStorage
  const saved = localStorage.getItem('draft')
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => window.removeEventListener('resize', onResize))
function onResize() { /* ... */ }
</script>` },
      { title: 'Браузерная библиотека без падения SSR', lang: 'ts', src: `// Плохо: импорт выполнится на сервере, а библиотека трогает window
// import Swiper from 'swiper'

// Хорошо: динамический импорт только в браузере
const el = useTemplateRef<HTMLElement>('slider')
onMounted(async () => {
  const { default: Swiper } = await import('swiper')
  new Swiper(el.value!, { loop: true })
})

// В общем composable
export function useViewport() {
  const width = ref(1280)   // одинаковый дефолт на сервере и при гидратации
  if (import.meta.client) {
    onMounted(() => { width.value = window.innerWidth })
  }
  return { width }
}` }
    ],
    real: 'Подключение слайдера, карты или аналитики: импорт на верхнем уровне компонента роняет SSR ошибкой window is not defined. Лечится переносом инициализации в onMounted с динамическим импортом, .client-компонентом или .client-плагином.',
    pitfalls: [
      'Обращаться к window, document или localStorage в setup — на сервере это падение с window is not defined.',
      'Подписываться на события, ставить setInterval или создавать соединения в setup — на сервере они не очистятся (onUnmounted там не вызывается) и будут копиться, утекая память.',
      'Думать, что код под if (import.meta.server) в компоненте скрыт — проверка вырезает ветку из бандла, но секреты в компонентах держать всё равно нельзя, им место в server/ и приватном runtimeConfig.',
      'Ожидать, что onMounted выполнится при SSR и данные из него попадут в HTML — на сервере он не вызывается вообще.'
    ],
    questions: [
      {
        id: 'nuxt-server-vs-client-q1',
        q: 'Где выполняется код компонента в Nuxt и какие хуки работают на сервере?',
        level: 'middle',
        keys: ['при первом заходе setup на сервере и ещё раз при гидратации', 'при клиентской навигации — только клиент', 'на сервере только setup и onServerPrefetch', 'onMounted и onBeforeMount — только клиент', 'на сервере нет window, document, localStorage'],
        a: 'При первом заходе setup выполняется на сервере, чтобы отрендерить HTML, и ещё раз в браузере при гидратации. При дальнейших переходах внутри приложения — только в браузере. На сервере из хуков жизненного цикла работают только setup и onServerPrefetch: компонент не монтируется в DOM, поэтому onMounted и onBeforeMount не вызываются, как и onUnmounted. Отсюда правило: всё, что трогает браузерные API или требует очистки, делаю в onMounted.'
      },
      {
        id: 'nuxt-server-vs-client-q2',
        q: 'Чем import.meta.client отличается от проверки typeof window?',
        level: 'middle+',
        keys: ['import.meta.client/server заменяются при сборке на константы', 'мёртвая ветка вырезается из соответствующего бандла', 'typeof window — проверка в рантайме, код остаётся', 'process.client — устаревший аналог', 'ветвление по среде в рендере всё равно даёт mismatch'],
        a: 'import.meta.client и import.meta.server — статические флаги: сборщик заменяет их на true или false, и ненужная ветка вырезается из бандла. Поэтому серверный код не попадает в клиентский бандл, и наоборот. typeof window — обычная проверка во время выполнения, обе ветки остаются в коде. process.client делает то же, что import.meta.client, но это старый вариант. И важно: любой из способов, если от него зависит то, что рисуется при первом рендере, даёт hydration mismatch, поэтому такие вещи всё равно переношу в onMounted.'
      },
      {
        id: 'nuxt-server-vs-client-q3',
        q: 'Как подключить библиотеку, которая при импорте обращается к window?',
        level: 'middle',
        keys: ['статический импорт выполнится при SSR и упадёт', 'динамический import() в onMounted', 'или компонент .client.vue / ClientOnly', 'или плагин .client', 'показать fallback, чтобы не прыгала вёрстка'],
        a: 'Если импортировать её на верхнем уровне, импорт выполнится при SSR, и сервер упадёт с window is not defined. Варианты: сделать динамический import внутри onMounted, вынести виджет в компонент с суффиксом .client.vue или подключить библиотеку в плагине с суффиксом .client, если она нужна глобально. ClientOnly помогает только если сам импорт тоже не выполняется на сервере. В любом случае даю заглушку нужного размера, чтобы не было скачка вёрстки.'
      }
    ]
  }
);

/* ===================== Nuxt — квиз ===================== */
window.SOBES.quiz.push(
  {
    id: 'qz-nuxt-rendering-1',
    topic: 'nuxt-rendering',
    type: 'single',
    q: 'Какое правило routeRules подойдёт для личного кабинета, где SEO не нужен, а всё зависит от пользователя?',
    options: ['{ ssr: false }', '{ swr: 600 }', '{ prerender: true }', '{ isr: true }'],
    correct: [0],
    explain: 'Кабинет персональный, поэтому кешировать его через swr/isr нельзя — один пользователь получит страницу другого. Prerender заморозит HTML на момент сборки. ssr: false отдаёт SPA-оболочку, всё рисуется в браузере.'
  },
  {
    id: 'qz-nuxt-rendering-2',
    topic: 'nuxt-rendering',
    type: 'multi',
    q: 'Что верно про swr и isr в routeRules?',
    options: ['isr генерирует страницу только при сборке и больше никогда не обновляет', 'Оба отдают закешированную версию и обновляют её в фоне', 'swr хранит кеш в storage Nitro', 'isr полноценно работает на платформах вроде Vercel и Netlify через их CDN'],
    correct: [1, 2, 3],
    explain: 'Оба построены на stale-while-revalidate. Разница в месте хранения кеша: swr — Nitro, isr — CDN платформы. Генерация только при сборке — это prerender, а не isr.'
  },
  {
    id: 'qz-nuxt-rendering-3',
    topic: 'nuxt-rendering',
    type: 'single',
    q: 'Страница пререндерена через prerender: true и использует useFetch. Что будет с данными после деплоя, если в API они изменились?',
    options: ['Обновятся при каждом заходе, useFetch всегда делает запрос на сервере', 'Обновятся через 60 секунд по умолчанию', 'Останутся такими, какими были при сборке, пока сайт не пересоберут', 'Страница упадёт с ошибкой гидратации'],
    correct: [2],
    explain: 'При prerender HTML и payload генерируются во время сборки, сервер в рантайме не участвует. Данные фиксируются на момент build. Для периодического обновления нужны swr/isr или пересборка.'
  },
  {
    id: 'qz-nuxt-hydration-1',
    topic: 'nuxt-hydration',
    type: 'multi',
    q: 'Что из этого может вызвать hydration mismatch?',
    options: ['Чтение localStorage в onMounted', 'Id, сгенерированный через Math.random в setup', '{{ new Date().toLocaleTimeString() }} в шаблоне', 'div внутри p в шаблоне'],
    correct: [1, 2, 3],
    explain: 'Время и случайные числа различаются между сервером и клиентом. Невалидная вложенность заставляет браузер перестроить DOM ещё до гидратации. onMounted выполняется после гидратации, поэтому изменение там — обычное обновление, а не расхождение.'
  },
  {
    id: 'qz-nuxt-hydration-2',
    topic: 'nuxt-hydration',
    type: 'output',
    q: 'Что увидит пользователь и что будет в консоли браузера в dev-режиме?',
    code: `<script setup lang="ts">
const isClient = typeof window !== 'undefined'
</script>

<template>
  <span>{{ isClient ? 'Браузер' : 'Сервер' }}</span>
</template>`,
    options: ['Всегда Сервер, без предупреждений', 'Всегда Браузер, без предупреждений', 'Ошибка window is not defined на сервере', 'Сервер в HTML, затем Браузер и предупреждение о hydration mismatch'],
    correct: [3],
    explain: 'typeof window безопасен на сервере и даёт false, поэтому в HTML будет Сервер. При гидратации клиент вычисляет true и рендерит другой текст — Vue фиксирует расхождение и пишет предупреждение.'
  },
  {
    id: 'qz-nuxt-hydration-3',
    topic: 'nuxt-hydration',
    type: 'single',
    q: 'Тема сайта хранится в localStorage, и при загрузке страница мигает светлой темой. Какое решение уберёт мигание без потери SSR?',
    options: ['Обернуть всё приложение в ClientOnly', 'Хранить тему в cookie через useCookie и рендерить её на сервере', 'Читать localStorage в setup через проверку import.meta.client', 'Поставить ssr: false для всех страниц'],
    correct: [1],
    explain: 'Cookie приходит с запросом, поэтому сервер сразу рендерит нужную тему. ClientOnly и ssr: false убивают SSR. Чтение localStorage в setup на клиенте даёт расхождение с серверным HTML.'
  },
  {
    id: 'qz-nuxt-server-client-components-1',
    topic: 'nuxt-server-client-components',
    type: 'single',
    q: 'Что получит браузер для компонента ArticleBody.server.vue?',
    options: ['JS компонента и данные для гидратации', 'Ничего, компонент рендерится после монтирования', 'Готовый HTML без JS этого компонента', 'Пустой div, который заполнится после запроса к API'],
    correct: [2],
    explain: 'Серверный компонент (island) рендерится только на сервере, клиенту уходит разметка. Его код и зависимости в бандл не попадают, поэтому интерактивности внутри нет.'
  },
  {
    id: 'qz-nuxt-server-client-components-2',
    topic: 'nuxt-server-client-components',
    type: 'multi',
    q: 'Что верно про серверные компоненты Nuxt в сравнении с React Server Components?',
    options: ['В Nuxt компоненты по умолчанию универсальные, серверные включаются явно', 'В Next App Router компоненты по умолчанию серверные', 'В Nuxt отдельные .server.vue требуют experimental.componentIslands', 'Серверный компонент Nuxt может держать реактивное состояние и обрабатывать клики'],
    correct: [0, 1, 2],
    explain: 'Модели по умолчанию противоположны. Серверные компоненты Nuxt — opt-in и экспериментальные. Клики и реактивность в island не работают, интерактив выносится в клиентские компоненты.'
  },
  {
    id: 'qz-nuxt-server-client-components-3',
    topic: 'nuxt-server-client-components',
    type: 'single',
    q: 'Компонент импортирует leaflet на верхнем уровне, его обернули в ClientOnly, но SSR всё равно падает с window is not defined. Почему?',
    options: ['Модуль компонента всё равно импортируется на сервере, и leaflet исполняется при импорте', 'ClientOnly не работает в dev-режиме', 'ClientOnly нужно подключать как плагин', 'Leaflet нельзя использовать в Nuxt'],
    correct: [0],
    explain: 'ClientOnly не рендерит компонент на сервере, но импорт файла, который его использует, выполняется. Библиотеку нужно импортировать динамически в onMounted или сделать компонент .client.vue.'
  },
  {
    id: 'qz-nuxt-structure-1',
    topic: 'nuxt-structure',
    type: 'single',
    q: 'Файл лежит в public/robots.txt. По какому адресу он будет доступен?',
    options: ['/public/robots.txt', '/_nuxt/robots.txt с хешем в имени', 'Не будет доступен, его нужно импортировать', '/robots.txt'],
    correct: [3],
    explain: 'Содержимое public отдаётся как есть от корня сайта без обработки и хеширования. Хеш в имени и путь /_nuxt — это про файлы из assets, прошедшие через сборщик.'
  },
  {
    id: 'qz-nuxt-structure-2',
    topic: 'nuxt-structure',
    type: 'single',
    q: 'Как будет называться автоимпортированный компонент из файла components/catalog/ProductCard.vue?',
    options: ['ProductCard', 'CatalogProductCard', 'Catalog-ProductCard', 'Его нужно импортировать вручную'],
    correct: [1],
    explain: 'Nuxt добавляет имена вложенных папок в префикс компонента, чтобы избежать конфликтов. Повторяющиеся части имени при этом схлопываются.'
  },
  {
    id: 'qz-nuxt-structure-3',
    topic: 'nuxt-structure',
    type: 'multi',
    q: 'Что автоимпортируется в Nuxt по умолчанию?',
    options: ['Функции из верхнего уровня composables/', 'Функции из composables/forms/useForm.ts без index-файла', 'Компоненты из components/', 'ref, computed, watch из Vue'],
    correct: [0, 2, 3],
    explain: 'Vue API, composables Nuxt, компоненты и верхний уровень composables/utils импортируются сами. Вложенные папки composables по умолчанию не сканируются, их добавляют через imports.dirs или реэкспортируют из index.'
  },
  {
    id: 'qz-nuxt-routing-1',
    topic: 'nuxt-routing',
    type: 'output',
    q: 'Файл pages/docs/[...slug].vue. Пользователь открыл /docs/guide/install. Что вернёт route.params.slug?',
    code: `const route = useRoute()
console.log(route.params.slug)`,
    options: ['[\'guide\', \'install\']', '\'guide/install\'', '\'install\'', 'undefined'],
    correct: [0],
    explain: 'Catch-all параметр собирает все оставшиеся сегменты пути в массив строк. Строку целиком или только последний сегмент он не возвращает.'
  },
  {
    id: 'qz-nuxt-routing-2',
    topic: 'nuxt-routing',
    type: 'single',
    q: 'Есть pages/account.vue и папка pages/account/ с orders.vue. Почему на /account/orders виден только account.vue?',
    options: ['Нужно переименовать account.vue в index.vue', 'Вложенные маршруты в Nuxt не поддерживаются', 'Нужно добавить middleware', 'В account.vue нет NuxtPage, куда рендерится дочерний маршрут'],
    correct: [3],
    explain: 'Файл рядом с одноимённой папкой становится родительским маршрутом. Дочерняя страница рендерится внутри родителя в месте, где стоит NuxtPage.'
  },
  {
    id: 'qz-nuxt-routing-3',
    topic: 'nuxt-routing',
    type: 'single',
    q: 'Что будет, если validate в definePageMeta вернёт false?',
    options: ['Страница отрендерится без данных', 'Пользователя редиректнет на главную', 'Nuxt покажет ошибку 404', 'Навигация молча отменится, URL не изменится'],
    correct: [2],
    explain: 'validate проверяет параметры маршрута. false означает, что маршрут не подходит, и Nuxt отдаёт 404. Можно вернуть и объект с другим statusCode и сообщением.'
  },
  {
    id: 'qz-nuxt-middleware-1',
    topic: 'nuxt-middleware',
    type: 'output',
    q: 'Гость открывает /account. Что произойдёт?',
    code: `// middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('token')
  if (!token.value) {
    navigateTo('/login')
  }
})`,
    options: ['Редирект на /login', 'Откроется /account, редиректа не будет', 'Ошибка navigateTo is not defined', 'Бесконечный редирект'],
    correct: [1],
    explain: 'Middleware смотрит на возвращаемое значение. Без return результат navigateTo теряется, функция возвращает undefined, и навигация продолжается.'
  },
  {
    id: 'qz-nuxt-middleware-2',
    topic: 'nuxt-middleware',
    type: 'multi',
    q: 'Что верно про server/middleware в Nitro?',
    options: ['Если вернуть значение, оно станет ответом, и обработчик не вызовется', 'Подключается к страницам через definePageMeta', 'Выполняется на каждый HTTP-запрос, включая /api', 'Может положить данные в event.context для обработчиков'],
    correct: [0, 2, 3],
    explain: 'Серверный middleware — часть Nitro, он ничего не знает о страницах и definePageMeta. Его задача — подготовить контекст или прервать запрос ошибкой, а не возвращать ответ.'
  },
  {
    id: 'qz-nuxt-middleware-3',
    topic: 'nuxt-middleware',
    type: 'single',
    q: 'Как задать порядок выполнения двух глобальных route middleware?',
    options: ['Префиксами в имени файла: 01.auth.global.ts, 02.analytics.global.ts', 'Через поле order в definePageMeta', 'Порядком импорта в nuxt.config', 'Порядок задать нельзя, они выполняются параллельно'],
    correct: [0],
    explain: 'Глобальные middleware выполняются по алфавиту имени файла, поэтому порядок задают числовыми префиксами. Префикс не попадает в имя middleware.'
  },
  {
    id: 'qz-nuxt-plugins-1',
    topic: 'nuxt-plugins',
    type: 'single',
    q: 'Плагин вернул { provide: { api } }. Как получить api в компоненте?',
    options: ['const { api } = useNuxtApp()', 'inject(api)', 'const { $api } = useNuxtApp()', 'import { api } from plugins/api'],
    correct: [2],
    explain: 'Nuxt добавляет provide-хелперы в nuxtApp с префиксом $. В шаблоне он тоже доступен как $api, а типы выводятся автоматически.'
  },
  {
    id: 'qz-nuxt-plugins-2',
    topic: 'nuxt-plugins',
    type: 'multi',
    q: 'Что верно про плагины Nuxt в plugins/?',
    options: ['Плагины в plugins/ и server/plugins — одно и то же', 'На сервере плагин выполняется на каждый запрос', 'Суффикс .client ограничивает выполнение браузером', 'Порядок по умолчанию — алфавитный по имени файла'],
    correct: [1, 2, 3],
    explain: 'server/plugins — это плагины Nitro, они запускаются один раз при старте сервера и не имеют доступа к Vue-приложению. Плагины в plugins/ инициализируют Nuxt-приложение, которое на сервере создаётся на каждый запрос.'
  },
  {
    id: 'qz-nuxt-plugins-3',
    topic: 'nuxt-plugins',
    type: 'single',
    q: 'Плагин делает await запроса настроек, который отвечает 800 мс. Как это скажется на сайте?',
    options: ['Никак, плагины выполняются в фоне', 'Задержится только первая загрузка после деплоя', 'Nuxt автоматически закеширует результат', 'Каждая SSR-страница и гидратация будут ждать эти 800 мс'],
    correct: [3],
    explain: 'Асинхронные плагины выполняются до рендера, на сервере для каждого запроса. Долгий await в плагине задерживает весь ответ. Лучше кешировать, грузить лениво или пометить плагин parallel, если от него ничего не зависит.'
  },
  {
    id: 'qz-nuxt-nitro-1',
    topic: 'nuxt-nitro',
    type: 'single',
    q: 'Какой файл обработает запрос POST /api/orders?',
    options: ['server/routes/api/orders.ts', 'server/api/orders.post.ts', 'pages/api/orders.post.vue', 'server/middleware/orders.post.ts'],
    correct: [1],
    explain: 'server/api даёт префикс /api, а суффикс .post ограничивает метод. server/routes/api тоже дал бы /api/orders, но без суффикса метода — на любой метод. middleware не обрабатывает конкретные маршруты.'
  },
  {
    id: 'qz-nuxt-nitro-2',
    topic: 'nuxt-nitro',
    type: 'output',
    q: 'Что получит клиент при GET /api/products/999, если товара нет?',
    code: `// server/api/products/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const product = await db.find(id)
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }
  return product
})`,
    options: ['200 и null в теле', '500 Internal Server Error', '404 с JSON-ошибкой, statusMessage Not found', '200 и объект { statusCode: 404 }'],
    correct: [2],
    explain: 'createError, брошенный из обработчика, превращается в HTTP-ответ с указанным статусом и JSON-телом ошибки. На клиенте $fetch бросит исключение, а useFetch положит его в error.'
  },
  {
    id: 'qz-nuxt-nitro-3',
    topic: 'nuxt-nitro',
    type: 'multi',
    q: 'Как задать деплой-пресет Nitro?',
    options: ['Через definePageMeta на главной странице', 'Переменной окружения NITRO_PRESET при сборке', 'Опцией nitro.preset в nuxt.config', 'На многих платформах пресет определяется автоматически'],
    correct: [1, 2, 3],
    explain: 'Пресет — настройка сборки серверной части. Его задают через env или конфиг, а Vercel, Netlify и некоторые другие платформы определяются автоматически. definePageMeta отношения к сборке сервера не имеет.'
  },
  {
    id: 'qz-nuxt-usefetch-1',
    topic: 'nuxt-usefetch',
    type: 'single',
    q: 'Почему при смене page список не обновляется?',
    code: `const page = ref(1)
const { data } = await useFetch('/api/items', {
  query: { page: page.value }
})`,
    options: ['В query передано число, а не ref, поэтому зависимость не отслеживается', 'useFetch не поддерживает query', 'Нужно добавить lazy: true', 'Нужно указать key'],
    correct: [0],
    explain: 'page.value вычисляется один раз при вызове, и useFetch получает обычное число. Нужно передать сам ref или функцию, тогда изменение запустит новый запрос.'
  },
  {
    id: 'qz-nuxt-usefetch-2',
    topic: 'nuxt-usefetch',
    type: 'multi',
    q: 'Что возвращает useFetch?',
    options: ['refresh', 'response с нативным объектом Response', 'data', 'status'],
    correct: [0, 2, 3],
    explain: 'useFetch возвращает реактивные data, status, error и методы refresh, execute, clear. Нативный Response не возвращается, для заголовков ответа есть перехватчик onResponse.'
  },
  {
    id: 'qz-nuxt-usefetch-3',
    topic: 'nuxt-usefetch',
    type: 'single',
    q: 'Зачем опция pick в useFetch?',
    options: ['Выбрать, какие поля отправить в теле запроса', 'Выбрать HTTP-метод', 'Указать, какие query-параметры отслеживать', 'Оставить в data и payload только нужные поля ответа'],
    correct: [3],
    explain: 'pick отрезает лишние поля из ответа. Это уменьшает payload, который сериализуется в HTML. Для сложных преобразований есть transform.'
  },
  {
    id: 'qz-nuxt-useasyncdata-1',
    topic: 'nuxt-useasyncdata',
    type: 'single',
    q: 'Handler в useAsyncData кладёт данные в Pinia и ничего не возвращает. Что будет?',
    options: ['Всё работает как обычно', 'На клиенте при гидратации handler выполнится повторно', 'Nuxt выбросит ошибку при сборке', 'data будет содержать состояние стора'],
    correct: [1],
    explain: 'Nuxt считает, что данных нет, если handler вернул undefined, и при гидратации запускает его снова. Handler должен вернуть значение, например true или сами данные.'
  },
  {
    id: 'qz-nuxt-useasyncdata-2',
    topic: 'nuxt-useasyncdata',
    type: 'single',
    q: 'На странице /users/[id] использован useAsyncData с ключом user. Пользователь перешёл с /users/1 на /users/2. Какой риск?',
    options: ['Данные первого пользователя могут переиспользоваться для второго — ключ должен включать id', 'Никакого, ключ не важен', 'Запрос будет сделан дважды', 'Nuxt покажет 404'],
    correct: [0],
    explain: 'Ключ определяет, где хранятся данные. Статический ключ для разных id даёт коллизию. Правильно включать параметр в ключ или задавать ключ функцией.'
  },
  {
    id: 'qz-nuxt-useasyncdata-3',
    topic: 'nuxt-useasyncdata',
    type: 'multi',
    q: 'Когда useAsyncData удобнее, чем useFetch?',
    options: ['Нужно параллельно сделать несколько запросов и объединить результат', 'Данные берутся через SDK стороннего сервиса', 'Нужен один GET без обработки', 'Нужна дополнительная обработка перед сохранением'],
    correct: [0, 1, 3],
    explain: 'useAsyncData принимает любую асинхронную функцию, поэтому подходит для комбинаций запросов и SDK. Для одного простого GET короче и типизированнее useFetch.'
  },
  {
    id: 'qz-nuxt-dollar-fetch-1',
    topic: 'nuxt-dollar-fetch',
    type: 'output',
    q: 'Сколько запросов к /api/users увидит бэкенд при первом заходе на страницу?',
    code: `<script setup lang="ts">
const users = await $fetch('/api/users')
</script>`,
    options: ['Один на сервере', 'Один в браузере', 'Ноль, $fetch кеширует ответ', 'Два: на сервере при SSR и в браузере при гидратации'],
    correct: [3],
    explain: 'Setup выполняется на сервере и повторно на клиенте при гидратации. $fetch не передаёт результат в payload, поэтому клиент делает запрос снова. useFetch/useAsyncData решают эту проблему.'
  },
  {
    id: 'qz-nuxt-dollar-fetch-2',
    topic: 'nuxt-dollar-fetch',
    type: 'single',
    q: 'Где корректно использовать $fetch напрямую?',
    options: ['В script setup для данных первого рендера', 'В шаблоне через await', 'В обработчике отправки формы', 'В computed'],
    correct: [2],
    explain: 'Отправка формы — действие пользователя, SSR и payload тут не нужны. Для данных первого рендера нужен useFetch или useAsyncData.'
  },
  {
    id: 'qz-nuxt-dollar-fetch-3',
    topic: 'nuxt-dollar-fetch',
    type: 'single',
    q: 'Обработчик бросил createError({ statusCode: 400, statusMessage: \'Phone is required\' }). Где на клиенте искать сообщение после catch (e) у $fetch?',
    options: ['e.message', 'e.data.statusMessage', 'e.response.text()', 'e.body'],
    correct: [1],
    explain: 'ofetch кладёт распарсенное тело ответа в data у ошибки. message содержит общий текст вида «[POST] /api/...: 400», а statusMessage из createError лежит в теле.'
  },
  {
    id: 'qz-nuxt-lazy-fetch-1',
    topic: 'nuxt-lazy-fetch',
    type: 'single',
    q: 'В чём главное отличие useLazyFetch от useFetch?',
    options: ['useLazyFetch не блокирует клиентскую навигацию до получения данных', 'useLazyFetch не делает запрос на сервере', 'useLazyFetch кеширует данные навсегда', 'useLazyFetch работает только в onMounted'],
    correct: [0],
    explain: 'Это useFetch с lazy: true. Запрос на сервере при SSR по-прежнему выполняется, если не указан server: false. Отличие в том, что переход не ждёт данных.'
  },
  {
    id: 'qz-nuxt-lazy-fetch-2',
    topic: 'nuxt-lazy-fetch',
    type: 'output',
    q: 'Что выведет console.log при клиентской навигации на страницу?',
    code: `const { data, status } = useLazyFetch('/api/comments')
console.log(status.value, data.value)`,
    options: ['\'success\' и массив комментариев', '\'idle\' и пустой массив', '\'pending\' и пустое значение (null/undefined)', 'Ошибку: нужно await'],
    correct: [2],
    explain: 'Lazy-вызов возвращает объект сразу, запрос ещё в процессе. Данные появятся позже, поэтому их обрабатывают через watch или в шаблоне со status.'
  },
  {
    id: 'qz-nuxt-lazy-fetch-3',
    topic: 'nuxt-lazy-fetch',
    type: 'single',
    q: 'Нужно, чтобы блок рекомендаций не задерживал ни SSR, ни переход. Что выбрать?',
    options: ['useFetch с await', 'useLazyFetch без опций', '$fetch в setup', 'useLazyFetch с server: false'],
    correct: [3],
    explain: 'lazy убирает блокировку навигации, server: false убирает запрос из SSR. Без server: false сервер дождётся данных и включит их в payload.'
  },
  {
    id: 'qz-nuxt-usestate-1',
    topic: 'nuxt-usestate',
    type: 'single',
    q: 'Что не так с этим composable в SSR-приложении?',
    code: `const cart = ref<Item[]>([])
export const useCart = () => {
  const add = (i: Item) => cart.value.push(i)
  return { cart, add }
}`,
    options: ['Ничего, это стандартный паттерн', 'ref на уровне модуля общий для всех запросов на сервере — корзины пользователей смешаются', 'ref нельзя экспортировать из composable', 'push не реактивен'],
    correct: [1],
    explain: 'Модуль загружается на сервере один раз на процесс, и ref становится синглтоном для всех пользователей. useState или Pinia создают состояние на каждый запрос.'
  },
  {
    id: 'qz-nuxt-usestate-2',
    topic: 'nuxt-usestate',
    type: 'output',
    q: 'Два компонента на странице вызывают этот код. Что будет после клика в первом?',
    code: `// в обоих компонентах
const counter = useState('counter', () => 0)
// в первом по клику
counter.value++`,
    options: ['Изменится только в первом компоненте', 'Второй компонент сбросит значение в 0', 'Изменится в обоих, состояние общее по ключу', 'Ошибка дублирования ключа'],
    correct: [2],
    explain: 'useState с одинаковым ключом возвращает одно и то же состояние. init вызывается только при первом создании, второй вызов просто получает существующее значение.'
  },
  {
    id: 'qz-nuxt-usestate-3',
    topic: 'nuxt-usestate',
    type: 'multi',
    q: 'Что можно безопасно хранить в useState?',
    options: ['Строку с выбранной темой', 'Функцию-обработчик', 'Экземпляр класса WebSocket', 'Объект пользователя из API'],
    correct: [0, 3],
    explain: 'Значение useState сериализуется в payload и восстанавливается на клиенте. Функции и живые объекты вроде WebSocket сериализовать нельзя.'
  },
  {
    id: 'qz-nuxt-route-router-1',
    topic: 'nuxt-route-router',
    type: 'single',
    q: 'Что произойдёт при вызове navigateTo(\'https://pay.example.com\') без опций?',
    options: ['Ошибка: для внешних URL нужно external: true', 'Переход на внешний сайт', 'Откроется новая вкладка', 'Nuxt попробует найти маршрут /https://pay.example.com и покажет 404'],
    correct: [0],
    explain: 'navigateTo защищает от случайных внешних переходов и требует явного external: true. Новую вкладку открывает опция open.'
  },
  {
    id: 'qz-nuxt-route-router-2',
    topic: 'nuxt-route-router',
    type: 'single',
    q: 'Что делает return navigateTo(\'/login\') в middleware при SSR?',
    options: ['Рендерит страницу логина вместо текущей без смены URL', 'Ничего, на сервере навигация невозможна', 'Бросает ошибку', 'Отвечает HTTP-редиректом (302 по умолчанию)'],
    correct: [3],
    explain: 'На сервере navigateTo превращается в ответ с редиректом и заголовком Location. Код можно поменять через redirectCode, например на 301 для переехавших страниц.'
  },
  {
    id: 'qz-nuxt-route-router-3',
    topic: 'nuxt-route-router',
    type: 'output',
    q: 'Пользователь перешёл с /users/1 на /users/2 (тот же компонент). Что покажет шаблон?',
    code: `<script setup lang="ts">
const { params } = useRoute()
</script>
<template>{{ params.id }}</template>`,
    options: ['2', '1, деструктуризация потеряла реактивность', 'undefined', 'Ошибка рендера'],
    correct: [1],
    explain: 'Компонент переиспользуется, а params сохранил ссылку на старый объект. Нужно обращаться к route.params.id через сам объект route или computed.'
  },
  {
    id: 'qz-nuxt-usecookie-1',
    topic: 'nuxt-usecookie',
    type: 'single',
    q: 'Почему тема из useCookie не вызывает мигания при SSR, а из localStorage — вызывает?',
    options: ['Cookie приходит на сервер с запросом, и сервер сразу рендерит нужную тему', 'useCookie быстрее читает данные', 'localStorage не реактивен', 'useCookie отключает гидратацию'],
    correct: [0],
    explain: 'Сервер видит только данные запроса. Cookie в нём есть, localStorage — нет, поэтому сервер при localStorage рендерит дефолт, а клиент потом перерисовывает.'
  },
  {
    id: 'qz-nuxt-usecookie-2',
    topic: 'nuxt-usecookie',
    type: 'multi',
    q: 'Что верно про useCookie?',
    options: ['httpOnly cookie можно изменить из браузера через useCookie', 'Глубокие изменения объекта отслеживаются только с watch: true', 'На сервере значение читается из заголовка Cookie запроса', 'Изменение на сервере добавляет Set-Cookie в ответ'],
    correct: [1, 2, 3],
    explain: 'httpOnly cookie недоступна JS в браузере, её выставляют на сервере через setCookie. Остальное — базовая механика useCookie.'
  },
  {
    id: 'qz-nuxt-request-headers-1',
    topic: 'nuxt-request-headers',
    type: 'single',
    q: 'Почему при SSR корзина пустая, а после загрузки в браузере заполняется?',
    code: `const { data: cart } = await useAsyncData('cart', () => $fetch('/api/cart'))`,
    options: ['useAsyncData не работает на сервере', 'Нужно добавить lazy: true', 'Ключ cart зарезервирован', 'При SSR $fetch не передаёт cookie пользователя, API видит анонима'],
    correct: [3],
    explain: 'Запрос при SSR делает сервер Nuxt, и cookie входящего запроса сами туда не попадают. Нужно useRequestFetch или headers из useRequestHeaders. В браузере cookie прикладываются автоматически.'
  },
  {
    id: 'qz-nuxt-request-headers-2',
    topic: 'nuxt-request-headers',
    type: 'single',
    q: 'Что вернёт useRequestHeaders([\'cookie\']) в браузере?',
    options: ['Объект с cookie текущей страницы', 'Ошибку', 'Пустой объект', 'Заголовки последнего fetch-запроса'],
    correct: [2],
    explain: 'useRequestHeaders имеет смысл только при SSR, где есть входящий запрос. На клиенте он возвращает пустой объект, поэтому код с ним безопасен в обеих средах.'
  },
  {
    id: 'qz-nuxt-usenuxtapp-1',
    topic: 'nuxt-usenuxtapp',
    type: 'single',
    q: 'В async middleware после await вызов useState падает с nuxt instance unavailable. Как исправить?',
    options: ['Заменить useState на ref', 'Обернуть вызов в nuxtApp.runWithContext или вызвать composable до await', 'Перенести middleware в server/middleware', 'Добавить .client к имени файла'],
    correct: [1],
    explain: 'После await неявный контекст Nuxt может быть потерян. runWithContext восстанавливает его. ref уберёт ошибку, но сломает SSR-изоляцию, а server/middleware — другой механизм.'
  },
  {
    id: 'qz-nuxt-usenuxtapp-2',
    topic: 'nuxt-usenuxtapp',
    type: 'multi',
    q: 'Что доступно через useNuxtApp()?',
    options: ['Приватный runtimeConfig на клиенте', 'Хелперы из provide плагинов с префиксом $', 'vueApp', 'hook для подписки на хуки приложения'],
    correct: [1, 2, 3],
    explain: 'nuxtApp даёт provide-хелперы, Vue-инстанс, хуки, payload. Приватные ключи runtimeConfig на клиент не попадают никаким способом.'
  },
  {
    id: 'qz-nuxt-runtime-config-1',
    topic: 'nuxt-runtime-config',
    type: 'output',
    q: 'Что выведет код в браузере?',
    code: `// nuxt.config.ts
runtimeConfig: {
  apiSecret: 'xxx',
  public: { apiBase: '/api' }
}

// компонент, выполняется на клиенте
const config = useRuntimeConfig()
console.log(config.public.apiBase, config.apiSecret)`,
    options: ['\'/api\' undefined', '\'/api\' \'xxx\'', 'undefined undefined', 'Ошибка доступа'],
    correct: [0],
    explain: 'На клиент передаётся только public. Приватные ключи доступны лишь на сервере, на клиенте их просто нет.'
  },
  {
    id: 'qz-nuxt-runtime-config-2',
    topic: 'nuxt-runtime-config',
    type: 'single',
    q: 'Какая переменная окружения переопределит runtimeConfig.public.apiBase при запуске?',
    options: ['API_BASE', 'NUXT_APIBASE', 'NUXT_PUBLIC_API_BASE', 'PUBLIC_API_BASE'],
    correct: [2],
    explain: 'Правило: префикс NUXT_, для публичных — NUXT_PUBLIC_, camelCase превращается в SNAKE_CASE. Переменные без префикса в рантайме не подхватываются.'
  },
  {
    id: 'qz-nuxt-runtime-config-3',
    topic: 'nuxt-runtime-config',
    type: 'single',
    q: 'Куда положить цвет бренда и название проекта, которые не зависят от окружения?',
    options: ['В приватный runtimeConfig', 'В runtimeConfig.public', 'В .env', 'В app.config.ts'],
    correct: [3],
    explain: 'app.config — публичная конфигурация проекта на этапе сборки, она реактивна и подходит для темы и брендинга. runtimeConfig нужен для того, что меняется между окружениями.'
  },
  {
    id: 'qz-nuxt-cache-1',
    topic: 'nuxt-cache',
    type: 'single',
    q: 'Что делает getCachedData по умолчанию?',
    options: ['Кеширует все ответы навсегда', 'Возвращает данные из payload при гидратации, при клиентской навигации запрос делается заново', 'Ничего, кеширования нет', 'Кеширует ответы на 60 секунд'],
    correct: [1],
    explain: 'Встроенная логика использует payload только при гидратации (и static-данные для пререндеренных страниц). Чтобы не перезапрашивать при переходах, getCachedData переопределяют.'
  },
  {
    id: 'qz-nuxt-cache-2',
    topic: 'nuxt-cache',
    type: 'single',
    q: 'Пользователь быстро вводит текст в поиск, query реактивный. Какое поведение dedupe по умолчанию?',
    options: ['defer — новые запросы игнорируются, пока идёт текущий', 'Все запросы выполняются параллельно', 'cancel — предыдущий запрос отменяется, выполняется новый', 'Запросы ставятся в очередь'],
    correct: [2],
    explain: 'По умолчанию dedupe: cancel — для поиска это правильно, нужен только последний результат. defer подходит, когда повторный вызов не должен менять запрос, например двойной клик по обновлению.'
  },
  {
    id: 'qz-nuxt-cache-3',
    topic: 'nuxt-cache',
    type: 'multi',
    q: 'Что из этого — способы обновить или сбросить данные useAsyncData?',
    options: ['useState(key).value = null', 'refresh из результата useAsyncData', 'refreshNuxtData(key)', 'clearNuxtData(key)'],
    correct: [1, 2, 3],
    explain: 'refresh и refreshNuxtData перезапрашивают данные, clearNuxtData сбрасывает их. useState — отдельное хранилище, оно не управляет кешем useAsyncData.'
  },
  {
    id: 'qz-nuxt-server-vs-client-1',
    topic: 'nuxt-server-vs-client',
    type: 'output',
    q: 'Что будет выведено в консоль сервера при SSR этой страницы?',
    code: `<script setup lang="ts">
console.log('A')
onServerPrefetch(() => console.log('B'))
onBeforeMount(() => console.log('C'))
onMounted(() => console.log('D'))
</script>`,
    options: ['A B', 'A B C D', 'A C D', 'A'],
    correct: [0],
    explain: 'На сервере выполняется setup и onServerPrefetch. Хуки монтирования вызываются только в браузере, потому что на сервере компонент не монтируется в DOM.'
  },
  {
    id: 'qz-nuxt-server-vs-client-2',
    topic: 'nuxt-server-vs-client',
    type: 'single',
    q: 'Чем import.meta.client отличается от typeof window !== undefined?',
    options: ['Ничем, это синонимы', 'import.meta.client работает только в плагинах', 'typeof window быстрее и рекомендуется Nuxt', 'import.meta.client заменяется при сборке, и ненужная ветка вырезается из бандла'],
    correct: [3],
    explain: 'import.meta.client — статический флаг: сборщик подставляет true или false и удаляет мёртвый код. typeof window вычисляется в рантайме, код обеих веток остаётся.'
  },
  {
    id: 'qz-nuxt-server-vs-client-3',
    topic: 'nuxt-server-vs-client',
    type: 'single',
    q: 'В setup компонента вызывается setInterval(poll, 5000). Что произойдёт на сервере?',
    options: ['Ничего, таймеры на сервере игнорируются', 'Таймер запустится на каждый SSR-запрос и не будет очищен — утечка памяти и лишние запросы', 'Nuxt выбросит ошибку при сборке', 'Таймер будет перенесён на клиент'],
    correct: [1],
    explain: 'На сервере setup выполняется, а onUnmounted — нет, поэтому интервал никто не очистит. Таймеры и подписки создают в onMounted и чистят в onBeforeUnmount.'
  }
);
