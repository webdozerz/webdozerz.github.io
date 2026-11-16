/* Interview plan: the right-hand branch of the "Frontend интервью" board (Опыт работы → Технические вопросы),
   one question per board node with a ready spoken answer and links to cheat-sheet topics.
   Angular and React branches are replaced by Vue 3 and Nuxt equivalents. */
window.SOBES = window.SOBES || { topics: [] };
window.SOBES.plan = {
  tips: [
    'Вспомнить свои достижения заранее и подготовить историю: что за проект, какая была проблема, что сделал лично ты, какой результат в цифрах.',
    'Повторить теорию по своим кейсам: интервьюер часто цепляется за опыт («вы писали про SSR — а как у вас решалась гидратация?»).',
  ],
  branches: [
    /* ---------------------------------------------------------------- */
    {
      id: 'browser', name: 'Браузер', color: 'web',
      groups: [
        {
          name: 'Critical Render Path',
          items: [
            { q: 'Что такое Critical Rendering Path, из каких шагов он состоит?', links: ['web-crp', 'web-reflow'],
              a: 'Это путь от байтов HTML до пикселей на экране: DOM → CSSOM → Render Tree → Layout → Paint → Composite. Оптимизировать его — значит сократить то, что блокирует первый рендер: критический CSS, скрипты с `defer`/`async`, меньше запросов до первой отрисовки.' },
            { q: 'DOM: как строится и что его блокирует?', links: ['web-dom', 'web-crp'],
              a: 'Парсер читает HTML потоково и строит дерево узлов. Обычный `<script>` без `defer`/`async` останавливает парсинг: его надо скачать и выполнить, потому что он может изменить документ. `defer` выполняется после парсинга по порядку, `async` — как только скачался, порядок не гарантирован.' },
            { q: 'CSSOM: почему CSS блокирует рендер?', links: ['web-crp'],
              a: 'CSSOM — дерево стилей. Браузер не рисует страницу, пока не построен CSSOM, иначе показал бы контент без стилей и тут же перерисовал. Ещё CSS блокирует выполнение скриптов, идущих после него: скрипт может читать вычисленные стили. Поэтому критичный CSS встраивают инлайном, остальной грузят без блокировки.' },
            { q: 'Render Tree: что в него попадает?', links: ['web-crp'],
              a: 'Объединение DOM и CSSOM, только видимые узлы с вычисленными стилями. `display: none` и `<head>` в дерево не попадают, а `visibility: hidden` и `opacity: 0` попадают — они занимают место.' },
            { q: 'Layout (reflow): что это и что его вызывает?', links: ['web-reflow'],
              a: 'Расчёт геометрии: размеры и позиции каждого блока. Вызывается изменением размеров, шрифтов, контента, окна. Дорогой случай — layout thrashing: в цикле чередуем запись стилей и чтение `offsetHeight`/`getBoundingClientRect`, и браузер вынужден пересчитывать раскладку синхронно. Лечится группировкой: сначала все чтения, потом все записи.' },
            { q: 'Paint и Composite: чем отличаются?', links: ['web-reflow'],
              a: 'Paint — заливка пикселей: цвета, тени, текст, по слоям. Composite — сборка готовых слоёв на GPU. Анимации `transform` и `opacity` идут только через composite, без layout и paint, поэтому плавные. Анимировать `top`/`width` — значит каждый кадр гонять layout.' },
          ],
        },
        {
          name: 'Асинхронность',
          items: [
            { q: 'Что такое Promise и какие у него состояния?', links: ['js-promises', 'js-async-await', 'js-promise-combinators'],
              a: 'Объект-обещание результата асинхронной операции. Состояния: `pending`, затем один раз `fulfilled` или `rejected`, дальше не меняется. Колбэки `then/catch/finally` всегда выполняются асинхронно, микрозадачей. `async/await` — синтаксис поверх промисов. Комбинаторы: `all` (падает на первой ошибке), `allSettled` (ждёт все), `race` (первый завершившийся), `any` (первый успешный).' },
            { q: 'Как работает Event Loop?', links: ['js-event-loop'],
              a: 'Один поток, call stack. Когда стек пуст, движок берёт одну макрозадачу (таймер, событие, сообщение), выполняет её, затем выполняет все микрозадачи (промисы, `queueMicrotask`, `MutationObserver`) до пустой очереди, затем браузер может отрисовать кадр (перед ним — `requestAnimationFrame`). Поэтому бесконечная цепочка микрозадач вешает страницу, а бесконечные `setTimeout` — нет.' },
            { q: 'setTimeout и setInterval: какие подвохи?', links: ['js-event-loop'],
              a: 'Задержка — минимальная, не точная: колбэк попадёт в очередь не раньше, а выполнится, когда освободится стек. После 5 вложенных таймеров минимум 4 мс, в неактивной вкладке — от 1 секунды. `setInterval` не ждёт окончания колбэка, вызовы могут идти впритык; рекурсивный `setTimeout` гарантирует паузу между запусками. Таймеры надо чистить (`clearTimeout`), иначе утечки и вызовы после размонтирования.' },
            { q: 'Задачка с логами: в каком порядке выведется?', links: ['js-event-loop'],
              a: 'Алгоритм: сначала весь синхронный код, потом все микрозадачи, потом одна макрозадача и снова микрозадачи. Тело `new Promise(fn)` и код `async`-функции до первого `await` выполняются синхронно. Ответ: `1 4 7 3 6 2 5`.',
              code: [{ lang: 'js', title: 'Типичная задача', src: `console.log(1)
setTimeout(() => console.log(2))
Promise.resolve().then(() => console.log(3))
new Promise(res => { console.log(4); res() })
  .then(() => setTimeout(() => console.log(5)))
;(async () => {
  console.log(7)
  await null
  console.log(6)
})()
// 1 4 7 — синхронно
// 3 6  — микрозадачи (then регистрирует таймер 5)
// 2 5  — макрозадачи в порядке постановки` }] },
          ],
        },
        {
          name: 'Хранилища',
          items: [
            { q: 'localStorage: особенности и ограничения', links: ['web-storage'],
              a: 'Ключ-значение, только строки (объекты — через `JSON.stringify`), около 5 МБ на origin, живёт бессрочно. API синхронный, блокирует поток. Общий для всех вкладок одного origin, изменения ловятся событием `storage` в других вкладках. Недоступен в воркерах. Токены сюда класть рискованно: любой XSS их прочитает.' },
            { q: 'sessionStorage: чем отличается от localStorage?', links: ['web-storage'],
              a: 'Тот же API, но данные привязаны к вкладке: переживают перезагрузку, но не закрытие вкладки, и не видны в других вкладках того же сайта. При дублировании вкладки копируются. Подходит для черновиков формы или шага мастера.' },
            { q: 'IndexedDB: когда брать?', links: ['web-storage'],
              a: 'Асинхронная транзакционная база в браузере: объекты (structured clone), индексы, большие объёмы — от сотен МБ, квота зависит от свободного места. Доступна в воркерах. Нужна для офлайна, кеша больших данных, PWA. API неудобный, обычно берут обёртку `idb` или Dexie.' },
            { q: 'Cookie: зачем, если есть localStorage?', links: ['web-storage', 'web-http'],
              a: 'Cookie автоматически уходят на сервер с каждым запросом на свой домен, поэтому ими делают сессии. Ограничение ~4 КБ на куку. Сервер ставит их через `Set-Cookie` и может закрыть от JS флагом `HttpOnly`. Атрибуты: `Domain`, `Path`, `Expires`/`Max-Age`, `Secure`, `HttpOnly`, `SameSite`. Минус — лишний вес каждого запроса и CSRF-риски.' },
          ],
        },
        {
          name: 'Оптимизация',
          items: [
            { q: 'Как работает сборщик мусора в V8?', links: ['js-gc'],
              a: 'Достижимость: живо всё, до чего можно дойти от корней (глобальный объект, стек). Куча разделена на поколения. Молодое — маленькое, чистится часто копированием живых объектов (Scavenger): большинство объектов умирает молодыми. Выжившие переезжают в старое, там mark-sweep-compact, частично параллельно и инкрементально, чтобы не было долгих пауз. Утечка — это объект, который остался достижимым по ошибке: забытый слушатель, таймер, кеш в модуле.' },
            { q: 'Что такое hidden classes (shapes)?', links: [],
              a: 'V8 заводит каждому объекту скрытый класс — описание набора полей и их смещений. Объекты с одинаковыми полями, добавленными в одном порядке, делят один класс, и доступ к полю — это чтение по известному смещению. Добавление полей в разном порядке или `delete` плодят разные классы и ломают оптимизацию. Практика: инициализировать все поля сразу (в конструкторе), одинаковым порядком, не использовать `delete` на горячих объектах.' },
            { q: 'Что такое inline caching?', links: [],
              a: 'В месте доступа `obj.x` движок запоминает: «для объектов такого скрытого класса поле лежит по такому смещению». Если туда всегда приходят объекты одной формы — мономорфный кеш, очень быстро. До ~4 форм — полиморфный, медленнее. Больше — мегаморфный, обычный медленный поиск. Поэтому функции, которые принимают объекты одной формы, работают быстрее.' },
            { q: 'Что такое function inlining?', links: [],
              a: 'Оптимизирующий компилятор TurboFan подставляет тело маленькой горячей функции прямо в место вызова — экономит на вызове и открывает другие оптимизации. Работает на основе собранных типов; если типы поменялись, код деоптимизируется. Отсюда совет держать горячие функции маленькими и мономорфными. Вручную в JS этим не управляют, но понимать стоит.' },
            { q: 'Lazy loading: что и как грузить лениво?', links: ['perf-loading', 'vue-lazy', 'perf-bundle'],
              a: 'Картинки и iframe ниже первого экрана — `loading="lazy"`. Код — динамическим `import()`: маршруты, тяжёлые компоненты (`defineAsyncComponent`, в Nuxt префикс `Lazy` и ленивая гидратация `hydrate-on-visible`). Своё — через `IntersectionObserver`. Важно не лениво грузить то, что на первом экране: ухудшит LCP.' },
            { q: 'preload, preconnect и другие resource hints', links: ['perf-loading'],
              a: '`preload` — скачать сейчас и с высоким приоритетом ресурс, нужный этой странице, но обнаруживаемый поздно (шрифт, LCP-картинка); нужен `as`, для шрифтов `crossorigin`. `preconnect` — заранее открыть соединение (DNS + TCP + TLS) к чужому домену. `dns-prefetch` — только DNS. `prefetch` — низкоприоритетно скачать ресурс для следующей навигации. `modulepreload` — preload для ES-модулей. Лишний preload отбирает полосу у важного.' },
            { q: 'Сжатие статики', links: ['perf-loading', 'perf-bundle'],
              a: 'Текст (JS, CSS, HTML, JSON) сжимают на сервере или заранее при сборке: gzip или Brotli (на 15–20% лучше), заголовок `Content-Encoding`. Плюс минификация, tree shaking, разделение бандла. Картинки — WebP/AVIF и правильные размеры через `srcset`. Статику с хешем в имени отдают с `Cache-Control: max-age=31536000, immutable`.' },
            { q: 'Virtual scroll: как устроен?', links: ['vue-render-opt'],
              a: 'Рендерим только строки в видимой области плюс небольшой запас, а высоту всего списка имитируем отступами или одним высоким контейнером. При скролле пересчитываем, какой срез показать. Тысячи строк превращаются в 20–30 DOM-узлов. Сложности: строки разной высоты (измерять и кешировать), поиск по странице Ctrl+F, доступность. Во Vue: `@tanstack/vue-virtual`, `vue-virtual-scroller`, `useVirtualList` из VueUse.' },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'css', name: 'HTML/CSS', color: 'test',
      groups: [
        {
          name: 'Вёрстка',
          items: [
            { q: 'Значения display и position', links: [],
              a: '`display`: `block`, `inline`, `inline-block`, `flex`, `grid`, `none`, `contents` (элемент исчезает, дети остаются), `flow-root` (новый контекст форматирования без хаков). `position`: `static` по умолчанию; `relative` — сдвиг от своего места, место сохраняется; `absolute` — от ближайшего позиционированного предка, из потока выпадает; `fixed` — от окна, но предок с `transform`/`filter` становится его контейнером; `sticky` — ведёт себя как relative, пока не упрётся в порог внутри прокручиваемого родителя (ломается от `overflow: hidden` у предка).' },
            { q: 'Разница grid и flexbox', links: [],
              a: 'Flex — одномерный: раскладка по одной оси, размеры идут от контента, удобно для строк элементов, выравнивания, навигации. Grid — двумерный: сначала задаём сетку строк и колонок, потом раскладываем элементы; удобно для макетов страниц и карточек, которые должны выровняться и по строкам, и по колонкам. Часто вместе: grid для каркаса, flex внутри блоков. `subgrid` позволяет вложенным элементам выравниваться по сетке родителя.' },
            { q: 'CSS-препроцессоры: зачем и нужны ли сейчас?', links: [],
              a: 'Sass/SCSS, Less, Stylus дают переменные, вложенность, миксины, функции, циклы, импорт частей; компилируются в обычный CSS при сборке. Сейчас многое есть нативно: custom properties (они ещё и живые, меняются в рантайме), вложенность, `@layer`, `color-mix()`, `@container`. PostCSS — не препроцессор, а постобработка (autoprefixer). Во Vue SCSS по-прежнему популярен в `<style lang="scss">`.' },
            { q: 'Приоритеты селекторов (специфичность)', links: [],
              a: 'Каскад сравнивает по порядку: источник и `!important`, каскадные слои `@layer`, специфичность, порядок в коде. Специфичность — тройка (id, классы/атрибуты/псевдоклассы, теги/псевдоэлементы), сравнивается слева направо. Inline-стиль выше любых селекторов, `!important` выше inline. `:where()` даёт ноль, `:is()`, `:not()`, `:has()` берут специфичность самого сильного аргумента. Универсальный селектор `*` и комбинаторы веса не добавляют.' },
            { q: 'Псевдоклассы: какие знаете, чем отличаются от псевдоэлементов?', links: [],
              a: 'Псевдокласс описывает состояние или положение элемента: `:hover`, `:focus-visible`, `:checked`, `:disabled`, `:nth-child(2n)`, `:first-of-type`, `:not()`, `:is()`, `:where()`, `:has()` — «родительский селектор». Псевдоэлемент создаёт виртуальную часть элемента: `::before`, `::after`, `::placeholder`, `::selection`, пишется с двумя двоеточиями. `:focus-visible` лучше `:focus`: подсветка только при навигации с клавиатуры.' },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'net', name: 'Сети', color: 'perf',
      groups: [
        {
          name: 'HTTP / HTTPS',
          items: [
            { q: 'Методы HTTP: какие бывают, что такое идемпотентность?', links: ['web-http'],
              a: '`GET` — получить, `POST` — создать/действие, `PUT` — заменить целиком, `PATCH` — частично изменить, `DELETE` — удалить, `HEAD` — как GET без тела, `OPTIONS` — узнать возможности (preflight в CORS). Безопасные (не меняют состояние): GET, HEAD, OPTIONS. Идемпотентные (повтор даёт тот же результат): безопасные плюс PUT и DELETE. POST и PATCH не идемпотентны — поэтому их нельзя бездумно ретраить.' },
            { q: 'Что такое HTTPS и как работает TLS?', links: ['web-http'],
              a: 'HTTPS — это HTTP поверх TLS. При рукопожатии сервер присылает сертификат, браузер проверяет цепочку до доверенного центра сертификации и домен. Стороны по алгоритму Диффи–Хеллмана (ECDHE) договариваются об общем ключе, не пересылая его, дальше трафик шифруется симметрично. TLS 1.3 укладывает рукопожатие в один round trip. Даёт шифрование, целостность и подлинность сервера.' },
            { q: 'TCP и UDP: разница', links: [],
              a: 'TCP — с установкой соединения (трёхстороннее рукопожатие), гарантирует доставку и порядок, перепосылает потери, регулирует скорость. UDP — просто датаграммы без гарантий и без соединения, зато быстрее: видео, игры, DNS. HTTP/1.1 и HTTP/2 работают на TCP, HTTP/3 — на QUIC поверх UDP: своя надёжность, но потеря одного пакета не тормозит все потоки (нет head-of-line blocking TCP), и быстрее рукопожатие.' },
            { q: 'Флаги кук', links: ['web-storage'],
              a: '`Secure` — только по HTTPS. `HttpOnly` — недоступна из JS, спасает сессию от кражи через XSS. `SameSite`: `Strict` — не уходит при переходах с других сайтов, `Lax` (по умолчанию в Chrome) — уходит только при навигации верхнего уровня GET-запросом, `None` — уходит всегда, требует `Secure`. Плюс `Domain`, `Path`, `Max-Age`/`Expires`; префиксы `__Host-` и `__Secure-` усиливают ограничения.' },
          ],
        },
        {
          name: 'Инфраструктура',
          items: [
            { q: 'Что такое CDN?', links: ['perf-loading'],
              a: 'Сеть серверов по всему миру, которые кешируют контент ближе к пользователю: меньше задержка, разгрузка основного сервера, защита от всплесков и DDoS. Отдаёт в первую очередь статику, но умеет кешировать и HTML/API по заголовкам (`s-maxage`, `stale-while-revalidate`). Инвалидация — через хеши в именах файлов или очистку кеша при деплое.' },
            { q: 'Кеширование в HTTP', links: ['web-http', 'nuxt-cache'],
              a: '`Cache-Control: max-age=N` — свежо N секунд, без запроса. `no-cache` — кешировать можно, но каждый раз сверяться с сервером. `no-store` — не кешировать вообще. `immutable` — не перепроверять. Перепроверка: сервер дал `ETag` или `Last-Modified`, браузер шлёт `If-None-Match`/`If-Modified-Since`, сервер отвечает `304` без тела. Схема для SPA: `index.html` — `no-cache`, ассеты с хешем — на год `immutable`.' },
            { q: 'Как работает DNS?', links: [],
              a: 'Переводит домен в IP. Ищем по кешам: браузер, ОС, роутер; затем рекурсивный резолвер провайдера идёт к корневым серверам, оттуда к серверу зоны (`.ru`), оттуда к авторитативному серверу домена. Ответ кешируется на TTL. Записи: `A`/`AAAA` — IP, `CNAME` — псевдоним, `MX` — почта, `TXT` — проверки. Ускорить на фронте — `dns-prefetch`/`preconnect`.' },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'js', name: 'JavaScript', color: 'js',
      groups: [
        {
          name: 'Типы и структуры',
          items: [
            { q: 'Какие типы данных есть в JS?', links: ['js-types', 'js-coercion'],
              a: 'Семь примитивов: `string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol` — и `object` (массивы, функции, даты — это объекты). Примитивы неизменяемы и сравниваются по значению, объекты — по ссылке. Классика: `typeof null === "object"` (историческая ошибка), `typeof function(){} === "function"`.' },
            { q: 'Как определить тип без typeof?', links: ['js-types'],
              a: '`Object.prototype.toString.call(x)` вернёт `[object Array]`, `[object Date]`, `[object Null]` — самый универсальный способ. Ещё: `Array.isArray`, `x instanceof Date` (не работает между iframe — разные конструкторы), `x === null`, `Number.isNaN`, `x?.constructor?.name`.' },
            { q: 'Object или Map: когда что?', links: ['js-collections'],
              a: 'Map — ключи любого типа (объекты тоже), гарантированный порядок вставки, `size`, итерируется напрямую, быстрее при частых добавлениях и удалениях, нет унаследованных ключей из прототипа. Object — для записей с известными полями и JSON: сериализуется, деструктурируется. Словарь с динамическими ключами — Map.' },
            { q: 'WeakMap и WeakSet: зачем?', links: ['js-collections', 'js-gc'],
              a: 'Ключи — только объекты, и держатся слабо: если на объект больше нет ссылок, запись удалит сборщик мусора. Поэтому коллекции не итерируются и нет `size`. Применение: приватные данные и кеш, привязанный к объекту (к DOM-узлу, к компоненту), — без утечки. На WeakMap устроена реактивность Vue: `targetMap` хранит зависимости объектов. WeakSet — пометить объекты («уже обработан»).' },
          ],
        },
        {
          name: 'Наследование и контекст',
          items: [
            { q: 'Как устроено наследование в JS?', links: ['js-prototypes', 'arch-composition'],
              a: 'Прототипное: у объекта есть скрытая ссылка `[[Prototype]]`, при чтении отсутствующего поля поиск идёт по цепочке прототипов до `null`. `class` и `extends` — синтаксис поверх того же механизма: методы лежат в `Class.prototype`, `extends` связывает прототипы, `super` вызывает родителя. Создать объект с нужным прототипом — `Object.create(proto)`.' },
            { q: 'Что такое this и от чего он зависит?', links: ['js-this'],
              a: 'Определяется в момент вызова, а не объявления. `obj.method()` — `obj`. Просто `fn()` — `undefined` в строгом режиме (в модулях всегда строгий). `new Fn()` — новый объект. `call/apply/bind` — явно заданный. Стрелочная функция своего `this` не имеет и берёт его из внешней области. Классическая ловушка — передать метод колбэком: `setTimeout(obj.method)` теряет контекст.' },
            { q: 'Как можно изменить контекст?', links: ['js-this'],
              a: '`fn.call(ctx, a, b)` и `fn.apply(ctx, [a, b])` вызывают сразу, различаются способом передачи аргументов. `fn.bind(ctx)` возвращает новую функцию с привязанным контекстом, повторный `bind` её уже не перепривяжет. Ещё способ — обернуть в стрелку: `() => obj.method()`.' },
            { q: 'Контекст стрелочных функций', links: ['js-this'],
              a: 'Своего `this`, `arguments`, `super` у стрелки нет — берутся из места объявления, навсегда. `call/apply/bind` контекст не меняют. Нельзя вызвать через `new`, нет `prototype`. Отсюда: стрелка удобна для колбэков внутри методов, но плоха как метод объекта — `this` будет внешним.' },
            { q: 'var, let, const и hoisting', links: ['js-hoisting', 'js-scope', 'js-closures'],
              a: 'Все объявления поднимаются, разница в инициализации. `var` — область функции, сразу `undefined`, можно переобъявить, в цикле одна переменная на все итерации. `let/const` — блочная область, до строки объявления — временная мёртвая зона (ReferenceError). `const` запрещает переприсваивание, но не изменение объекта. Function declaration поднимается целиком, function expression — как переменная.' },
            { q: 'Работа с DOM и событиями', links: ['web-dom', 'web-events', 'web-delegation'],
              a: 'Событие идёт в три фазы: перехват сверху вниз, цель, всплытие снизу вверх. `addEventListener(type, fn, { capture, once, passive, signal })` — `passive` для скролла, `signal` от AbortController снимает слушатель. `event.target` — где произошло, `currentTarget` — на ком висит обработчик. Делегирование — один обработчик на родителе вместо сотни на детях. `stopPropagation` останавливает всплытие, `preventDefault` отменяет действие по умолчанию.' },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'ts', name: 'TypeScript', color: 'ts',
      groups: [
        {
          name: 'Основы',
          items: [
            { q: 'Что такое type (алиас типа)?', links: ['ts-type-interface', 'ts-union-intersection'],
              a: '`type` даёт имя любому типу: примитиву, объединению, кортежу, функции, mapped или conditional типу. Это не новый тип, а псевдоним: `type Id = string` полностью совместим со `string`.' },
            { q: 'type vs interface', links: ['ts-type-interface'],
              a: 'Interface описывает только форму объекта, умеет declaration merging (два объявления сливаются — так расширяют чужие типы, например `ComponentCustomProperties` во Vue) и `extends` с понятными ошибками. Type умеет всё: union, intersection, mapped, conditional, кортежи. Практика: interface для публичных объектных контрактов, type — для всего остального; главное — единообразие в проекте.' },
            { q: 'Type narrowing (сужение типов)', links: ['ts-guards'],
              a: 'Компилятор уточняет тип внутри ветки по проверкам: `typeof x === "string"`, `instanceof`, `"field" in obj`, сравнение с литералом, truthiness, проверка поля-дискриминанта. Анализ потока управления помнит это до конца блока или после раннего `return`. Если встроенных проверок мало — свой type guard.' },
            { q: 'as vs satisfies', links: ['ts-satisfies'],
              a: '`as` — утверждение: «поверь мне», проверка отключается, можно соврать. `satisfies` — проверка: значение должно подходить под тип, но выведенный тип остаётся узким. Пример: конфиг `satisfies Record<Route, string>` — опечатку в ключе поймает, а значения останутся литералами. `as const` — отдельная вещь: делает литералы readonly и максимально узкими.' },
            { q: 'Generics', links: ['ts-generics', 'ts-composables'],
              a: 'Параметр типа, который подставляется при использовании: `function first<T>(arr: T[]): T`. Связывает входы и выходы, не теряя информацию о типе, в отличие от `any`. Ограничения через `extends`: `<T extends { id: string }>`, `<K extends keyof T>`. Во Vue — дженерик-компоненты `<script setup generic="T">` и типизированные composables.' },
          ],
        },
        {
          name: 'Продвинутые типы',
          items: [
            { q: 'Conditional types и extends', links: ['ts-conditional'],
              a: '`T extends U ? X : Y` — тернарник на уровне типов. Если `T` — «голый» параметр и в него пришёл union, условие применяется к каждому члену отдельно (дистрибутивность): так работает `Exclude`. Отключить — обернуть в кортеж: `[T] extends [U]`. `extends` вообще имеет два смысла: ограничение дженерика и проверка совместимости в условном типе.' },
            { q: 'infer', links: ['ts-conditional'],
              a: 'Внутри conditional type объявляет переменную типа, которую компилятор выведет из сопоставления: `type Ret<T> = T extends (...a: any[]) => infer R ? R : never`. Так устроены `ReturnType`, `Parameters`, `Awaited`. Удобно вытаскивать тип элемента массива, тип из промиса, аргументы пропсов.' },
            { q: 'Utility types: какие знаете?', links: ['ts-utility', 'ts-mapped', 'ts-keyof-typeof'],
              a: '`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `Awaited`, `InstanceType`. Внутри это mapped types (`{ [K in keyof T]?: T[K] }`) и conditional types.' },
            { q: 'Задача: напишите свою утилиту', links: ['ts-mapped', 'ts-conditional'],
              a: 'Обычно просят `MyPick`, `MyReadonly`, `DeepPartial` или `MyReturnType`. Порядок рассуждения вслух: какой вход, перебор ключей через `keyof` и `in`, модификаторы `?`/`readonly` (снять — `-?`), рекурсия для вложенных объектов, conditional + infer для вывода.',
              code: [{ lang: 'ts', title: 'Частые варианты', src: `type MyPick<T, K extends keyof T> = { [P in K]: T[P] }

type MyReadonly<T> = { readonly [P in keyof T]: T[P] }

type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T

type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never

type MyExclude<T, U> = T extends U ? never : T // дистрибутивно по union` }] },
            { q: 'Discriminated unions: что это и для чего?', links: ['ts-union-intersection', 'ts-never', 'ts-api'],
              a: 'Union объектов с общим полем-литералом (`type`, `status`, `kind`). Проверка этого поля сужает весь объект: в ветке `status === "error"` доступно `error`, а `data` — нет. Для чего: состояния запроса, события, экшены, ответы API — невозможные комбинации становятся невыразимыми. Плюс exhaustive check: в `default` присваиваем в `never`, и забытый вариант станет ошибкой компиляции.' },
            { q: 'Type guard и is', links: ['ts-guards'],
              a: 'Функция с возвращаемым типом `x is User` — если она вернула `true`, TS сужает тип аргумента. Пример: `const isUser = (x: unknown): x is User => typeof x === "object" && x !== null && "id" in x`. Ответственность за правильность на нас: TS проверку не проверяет. Есть ещё `asserts x is T` — функция бросает ошибку, а после вызова тип сужен. С TS 5.5 простые фильтры типа `arr.filter(x => x !== null)` выводят guard сами.' },
            { q: 'Структурная типизация и excess property checking', links: ['ts-type-interface'],
              a: 'TS сравнивает типы по форме, а не по имени: объект с полями `{ id, name, age }` подходит туда, где ждут `{ id, name }`. Исключение — свежий объектный литерал: при прямой передаче лишнее поле даст ошибку (excess property checking), чтобы ловить опечатки. Если сначала положить объект в переменную — проверки не будет. Номинальность при нужде имитируют branded types: `string & { __brand: "UserId" }`.' },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'tasks', name: 'Задачи', color: 'warn',
      groups: [
        {
          name: 'Live coding',
          items: [
            { q: 'Глубокое копирование объекта', links: ['js-copy'],
              a: 'Сначала назвать готовое: `structuredClone(obj)` — копирует Map, Set, Date, циклические ссылки, но не функции, DOM и прототипы классов. `JSON.parse(JSON.stringify())` теряет `undefined`, функции, Date превращает в строку и падает на циклах. Своя реализация — рекурсия с `WeakMap` для циклов.',
              code: [{ lang: 'js', title: 'Своя реализация', src: `function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value
  if (seen.has(value)) return seen.get(value)          // циклы
  if (value instanceof Date) return new Date(value)
  if (value instanceof Map) {
    const m = new Map(); seen.set(value, m)
    value.forEach((v, k) => m.set(deepClone(k, seen), deepClone(v, seen)))
    return m
  }
  if (value instanceof Set) {
    const s = new Set(); seen.set(value, s)
    value.forEach(v => s.add(deepClone(v, seen)))
    return s
  }
  const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value))
  seen.set(value, copy)
  for (const key of Reflect.ownKeys(value)) copy[key] = deepClone(value[key], seen)
  return copy
}` }] },
            { q: 'throttle / debounce', links: ['js-debounce-throttle'],
              a: 'Debounce — вызвать один раз после паузы в N мс (поиск по вводу, ресайз). Throttle — не чаще раза в N мс (скролл, mousemove). Говорить про сохранение `this` и аргументов, отмену (`cancel`) и чистку таймера при размонтировании.',
              code: [{ lang: 'js', title: 'Реализация', src: `function debounce(fn, ms) {
  let t
  function debounced(...args) {
    clearTimeout(t)
    t = setTimeout(() => fn.apply(this, args), ms)
  }
  debounced.cancel = () => clearTimeout(t)
  return debounced
}

function throttle(fn, ms) {
  let last = 0, t, lastArgs
  return function (...args) {
    const now = Date.now(), left = ms - (now - last)
    lastArgs = args
    if (left <= 0) { last = now; fn.apply(this, args) }
    else if (!t) t = setTimeout(() => { last = Date.now(); t = null; fn.apply(this, lastArgs) }, left) // последний вызов не теряем
  }
}` }] },
            { q: 'Поиск с запросом на сервер', links: ['js-abort', 'js-debounce-throttle', 'vue-watcheffect'],
              a: 'Что нужно проговорить: debounce ввода, минимальная длина запроса, отмена предыдущего запроса через `AbortController` (иначе гонка: старый ответ придёт позже нового и перезапишет результат), состояния загрузки/ошибки/пусто, кеш по строке запроса. Во Vue — `watch` + `onWatcherCleanup` (Vue 3.5) для отмены.',
              code: [{ lang: 'vue', title: 'Vue 3.5', src: `<script setup lang="ts">
import { ref, watch, onWatcherCleanup } from 'vue'
import { useDebounce } from '@vueuse/core'

const query = ref('')
const debounced = useDebounce(query, 300)
const items = ref<string[]>([])
const status = ref<'idle' | 'loading' | 'error'>('idle')

watch(debounced, async q => {
  if (q.trim().length < 2) { items.value = []; return }
  const ctrl = new AbortController()
  onWatcherCleanup(() => ctrl.abort())       // новый ввод отменяет старый запрос
  status.value = 'loading'
  try {
    const res = await fetch('/api/search?q=' + encodeURIComponent(q), { signal: ctrl.signal })
    items.value = await res.json()
    status.value = 'idle'
  } catch (e) {
    if ((e as Error).name !== 'AbortError') status.value = 'error'
  }
})
</script>` }] },
            { q: 'Размен монет: жадный алгоритм', links: [],
              a: 'Берём каждый раз самую крупную монету, которая влезает. Работает для «канонических» наборов вроде 1, 2, 5, 10, но не всегда: для монет [1, 3, 4] и суммы 6 жадный даст 4+1+1 (3 монеты), а оптимум 3+3 (2 монеты). Сложность O(n) после сортировки. На собесе важно самому показать контрпример.',
              code: [{ lang: 'js', title: 'Жадный вариант', src: `function greedyChange(coins, amount) {
  const res = []
  for (const c of [...coins].sort((a, b) => b - a)) {
    while (amount >= c) { amount -= c; res.push(c) }
  }
  return amount === 0 ? res : null // может не найти решение, даже если оно есть
}` }] },
            { q: 'Размен монет: динамическое программирование', links: [],
              a: '`dp[s]` — минимум монет для суммы `s`. `dp[0] = 0`, для каждой суммы перебираем монеты: `dp[s] = min(dp[s], dp[s - c] + 1)`. Время O(сумма × число монет), память O(сумма). Вариация «сколько способов разменять» — `dp[s] += dp[s - c]`, внешний цикл по монетам, чтобы не считать перестановки.',
              code: [{ lang: 'js', title: 'Минимум монет', src: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity)
  dp[0] = 0
  for (let s = 1; s <= amount; s++) {
    for (const c of coins) {
      if (c <= s) dp[s] = Math.min(dp[s], dp[s - c] + 1)
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount]
}

coinChange([1, 3, 4], 6) // 2 (3 + 3)` }] },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'vue', name: 'Vue 3', color: 'vue',
      note: 'На доске здесь Angular и React. Ниже — те же темы в терминах Vue: Change Detection → реактивность, DI → provide/inject, Content Projection → слоты, RxJS → watch и отмена, useEffect → watch/хуки, memo → computed, Fiber → компилятор и Virtual DOM, сторы → Pinia.',
      groups: [
        {
          name: 'Реактивность (вместо Change Detection)',
          items: [
            { q: 'Как Vue узнаёт, что нужно обновить компонент?', links: ['vue-ref-reactive', 'vue-vdom'],
              a: '`reactive` оборачивает объект в Proxy, `ref` — объект с геттером/сеттером `.value`. При чтении во время рендера срабатывает `track` — эффект рендера компонента запоминает зависимость. При записи — `trigger`: все эффекты, читавшие это поле, ставятся в очередь. Очередь сбрасывается в микрозадаче, поэтому несколько изменений подряд дают один рендер; дождаться DOM — `await nextTick()`. Перерисовывается только компонент, чьи зависимости изменились, а не всё дерево.' },
            { q: 'Аналог OnPush: когда перерисовывается дочерний компонент?', links: ['vue-render-opt'],
              a: 'Во Vue «OnPush» по умолчанию: ребёнок перерисуется, только если поменялись его пропсы (поверхностное сравнение) или его собственные реактивные зависимости. Ререндер родителя сам по себе ребёнка не трогает. Ловушки: новый объект/стрелка в пропсе на каждый рендер (`:options="{ a: 1 }"`) и передача большого объекта, где читается одно поле. Для больших неизменяемых данных — `shallowRef`/`markRaw`.' },
            { q: 'Нужен ли Vue что-то вроде zone.js? Что такое Vapor Mode?', links: ['vue-vdom'],
              a: 'Нет: Angular патчил асинхронные API, чтобы узнать «что-то могло измениться» и проверить всё дерево. Vue знает точно, какие данные изменились, через Proxy — отслеживание идёт на уровне данных, а не событий, и после `await` или в `setTimeout` ничего делать не надо. Zoneless в Angular с сигналами — по сути приход к модели Vue. Vapor Mode (Vue 3.6) — компиляция шаблона в прямые DOM-операции без Virtual DOM, включается на уровне компонента.' },
            { q: 'Сигналы, computed, effect: что во Vue вместо них?', links: ['vue-ref-reactive', 'vue-computed-watch', 'vue-watcheffect'],
              a: 'Vue с самого начала построен на этой модели: `ref` — сигнал, `computed` — производный сигнал с кешем, `watchEffect` — эффект с авто-отслеживанием, `watch` — эффект с явными источниками. `shallowRef` ближе всего к сигналу Angular/Solid — реагирует только на замену значения. В Vue 3.6 ядро реактивности переписано на alien-signals ради скорости и памяти.' },
          ],
        },
        {
          name: 'Компоненты (вместо DI и Content Projection)',
          items: [
            { q: 'DI во Vue: provide / inject', links: ['vue-provide-inject', 'arch-di', 'arch-solid-d'],
              a: '`provide(key, value)` в предке, `inject(key, default)` в любом потомке, без прокидывания через пропсы. Ключ лучше делать `InjectionKey<T>` (символ) — получаем типизацию и нет коллизий. На уровне приложения — `app.provide` (в Nuxt — плагины и `useNuxtApp().$x`). Для реактивности передают `ref`/`readonly(ref)`, а изменение — через функцию из провайдера. Не замена стору: для глобального состояния — Pinia.' },
            { q: 'Content Projection → слоты', links: ['vue-slots', 'vue-reusable'],
              a: 'Слот — место, куда родитель вставляет свою разметку. Default и именованные (`<template #header>`), проверка наличия через `$slots`/`useSlots`. Scoped slots — ребёнок передаёт данные наверх: `<slot :item="item" />` → `<template #default="{ item }">`. Так строятся headless-компоненты: логика внутри, разметка снаружи (таблицы, списки, селекты). Типизация — `defineSlots`.' },
            { q: 'ng-template / ng-container → что во Vue?', links: ['vue-slots', 'vue-dynamic-components'],
              a: '`<template>` с `v-if`/`v-for`/`v-slot` — группа элементов без лишней обёртки в DOM (аналог `ng-container`). Отложенный шаблон, который рендерит кто-то другой (аналог `ng-template` + `ngTemplateOutlet`), — scoped slot или render-функция. Динамический выбор компонента — `<component :is="...">`. Компоненты без обёртки возможны: во Vue 3 разрешены фрагменты с несколькими корнями.' },
            { q: 'Props, emits и v-model на компонентах', links: ['vue-props-emits', 'vue-v-model', 'ts-vue-props-emits'],
              a: 'Однонаправленный поток: пропсы вниз, события вверх, мутировать пропс нельзя. `defineProps`/`defineEmits` с типами, деструктуризация пропсов реактивна с Vue 3.5 и задаёт дефолты. `v-model` = проп `modelValue` + событие `update:modelValue`; `defineModel()` (3.4+) делает это одной строкой, можно несколько моделей: `v-model:title`.' },
          ],
        },
        {
          name: 'Асинхронность и подписки (вместо RxJS)',
          items: [
            { q: 'Чем во Vue заменяют потоки RxJS?', links: ['vue-watcheffect', 'vue-composables'],
              a: 'В основном `watch`/`watchEffect` плюс composables. Для операторов есть VueUse: `watchDebounced`, `useThrottleFn`, `useIntervalFn`, `useEventListener`, `refDebounced`. Cold/hot в чистом виде нет: `ref` всегда «горячий» — хранит текущее значение, как `BehaviorSubject`. RxJS во Vue можно подключить (`@vueuse/rxjs`, `useObservable`), но для форм и запросов обычно не нужно.' },
            { q: 'switchMap vs mergeMap → как сделать то же во Vue?', links: ['js-abort', 'vue-watcheffect'],
              a: 'switchMap — новый запрос отменяет предыдущий: в `watch` регистрируем `onWatcherCleanup(() => controller.abort())` (или третий аргумент `onCleanup`), колбэк очистки вызовется перед следующим запуском. mergeMap — все запросы идут параллельно, результаты складываются по мере прихода: просто не отменяем, но защищаемся от устаревших ответов. В Nuxt `useFetch` с реактивным ключом сам отменяет устаревший запрос.' },
            { q: 'shareReplay → как не делать один запрос дважды?', links: ['nuxt-cache', 'vue-pinia'],
              a: 'Общий результат для нескольких потребителей: держать данные в Pinia или в composable с состоянием на уровне модуля (только на клиенте!). В Nuxt — `useAsyncData`/`useFetch` с одинаковым `key`: дедупликация одновременных вызовов, данные кладутся в payload и не перезапрашиваются на клиенте после SSR, `getCachedData` — чтобы брать кеш при навигации.' },
            { q: 'Отписки: что нужно чистить самому?', links: ['vue-lifecycle', 'vue-watcheffect', 'js-gc'],
              a: '`watch`, `computed` и `watchEffect`, созданные синхронно в `setup`, привязаны к компоненту и останавливаются при размонтировании. Чистить вручную: `addEventListener` на `window`/`document`, `setInterval`, WebSocket, сторонние инстансы (карты, графики), `watch`, созданный асинхронно (после `await` вне `<script setup>` или в колбэке) — его `stop()`. Инструменты: `onUnmounted`, `effectScope` для группы эффектов, VueUse-хелперы, которые чистят за собой сами.' },
            { q: 'Утечки памяти во Vue и Nuxt', links: ['js-gc', 'nuxt-server-vs-client', 'vue-keepalive'],
              a: 'Типичное: несброшенные слушатели и таймеры, ссылки на компонент в глобальном объекте или в сторе, огромный `KeepAlive` без `max`. Отдельно в SSR: состояние на уровне модуля (`const cache = ref()` вне функции) живёт в процессе сервера между запросами — и течёт память, и пользователи видят чужие данные (cross-request state pollution). Поэтому в Nuxt — `useState` или Pinia. Ищут через Memory → Heap snapshot и сравнение снимков.' },
            { q: 'async pipe → асинхронные данные в шаблоне', links: ['nuxt-usefetch', 'nuxt-useasyncdata'],
              a: 'Во Vue не нужен: шаблон читает `ref`, и когда промис резолвится и запишет в `ref`, шаблон обновится. Есть `async setup` с `<Suspense>` — компонент ждёт данных до показа. В Nuxt стандарт — `const { data, status, error } = await useFetch(...)`: данные грузятся на сервере, приходят в payload, на клиенте не перезапрашиваются.' },
          ],
        },
        {
          name: 'Хуки и рендер (вместо useState / useEffect)',
          items: [
            { q: 'useState → ref и reactive', links: ['vue-ref-reactive'],
              a: 'Состояние — `ref` (любое значение, `.value` в скрипте, в шаблоне разворачивается) или `reactive` (только объект, без `.value`, но нельзя переприсвоить целиком и нельзя деструктурировать без `toRefs`). В отличие от React, изменение мутацией (`list.value.push(x)`) — нормально, функциональный апдейтер не нужен: значение всегда актуальное, нет «устаревших замыканий».' },
            { q: 'Что вызывает ререндер компонента во Vue?', links: ['vue-render-opt', 'vue-vdom'],
              a: 'Изменение реактивных данных, которые прочитаны в рендере; изменение пропсов; изменение содержимого слотов (передаётся от родителя). Не вызывает: изменение данных, которые не читаются в шаблоне; ререндер родителя без смены пропсов. Принудительно — `$forceUpdate` или смена `key` (пересоздаёт компонент). Отладка — `onRenderTriggered`/`onRenderTracked` и Vue DevTools.' },
            { q: 'Concurrency и StrictMode: есть ли аналоги?', links: ['nuxt-hydration'],
              a: 'Конкурентного рендеринга с прерыванием как в React нет: обновления батчатся в микрозадаче и применяются за один проход, этого хватает благодаря точечной реактивности. StrictMode с двойным вызовом эффектов тоже нет — dev-режим Vue предупреждает в консоли (мутация пропсов, неизвестные атрибуты, ошибки гидратации). Для тяжёлых вычислений — Web Worker или разбиение задачи.' },
            { q: 'Suspense во Vue и Nuxt', links: ['nuxt-usefetch', 'vue-lazy'],
              a: '`<Suspense>` ждёт асинхронных потомков (`async setup` с top-level `await` или асинхронные компоненты) и пока показывает слот `#fallback`. Во Vue он до сих пор помечен экспериментальным, но Nuxt использует его под капотом: страница с `await useFetch()` не отрендерится, пока данные не придут. Ошибки ловят `onErrorCaptured` или `<NuxtErrorBoundary>`.' },
            { q: 'useEffect → watch, watchEffect и хуки жизненного цикла', links: ['vue-watcheffect', 'vue-computed-watch', 'vue-lifecycle'],
              a: '«Эффект при монтировании» — `onMounted`, на клиенте. «Эффект при изменении» — `watch(source, cb)`: источник явный, как массив зависимостей, но его не надо поддерживать вручную. `watchEffect` — запускается сразу и сам собирает зависимости. Очистка — `onWatcherCleanup` или `onUnmounted`, вместо `return () => {}`.' },
            { q: 'Второй аргумент useEffect → источники watch', links: ['vue-computed-watch'],
              a: 'В `watch` источник — `ref`, геттер `() => props.id`, `reactive`-объект (глубоко) или массив источников. Пустому массиву зависимостей соответствует `onMounted`. Нет массива — ближе всего `onUpdated`, но он нужен редко. Опции: `immediate`, `deep` (в 3.5 — число уровней), `once`.' },
            { q: 'Когда вызывается watch?', links: ['vue-computed-watch', 'vue-lifecycle'],
              a: '`watch` ленивый — первый раз при изменении, сразу — с `immediate: true`. `watchEffect` запускается сразу. По времени: по умолчанию `flush: "pre"` — до обновления DOM компонента; `"post"` (или `watchPostEffect`) — после, когда нужен обновлённый DOM; `"sync"` — синхронно при каждом изменении, дорого. На сервере (SSR) вотчеры не срабатывают, `onMounted` тоже.' },
          ],
        },
        {
          name: 'Оптимизации и внутренности (вместо memo и Fiber)',
          items: [
            { q: 'useMemo / memo → computed, v-memo, v-once', links: ['vue-computed-watch', 'vue-render-opt'],
              a: '`computed` кеширует результат и пересчитывается только при изменении зависимостей — это и есть useMemo, но без ручного списка. `memo` для компонентов не нужен — сравнение пропсов встроено. Для шаблонов: `v-once` — отрендерить один раз, `v-memo="[a, b]"` — пропускать обновление поддерева, пока не изменились значения (большие списки). Ещё: `shallowRef` для больших данных, стабильные пропсы, `KeepAlive`, ленивые компоненты, виртуальный скролл.' },
            { q: 'Fiber → как устроен рендер во Vue (Virtual DOM и компилятор)', links: ['vue-vdom'],
              a: 'Шаблон компилируется в render-функцию, которая строит Virtual DOM; при обновлении новое дерево сравнивается со старым и патчится DOM. Компилятор помогает рантайму: статичные узлы выносятся и не сравниваются (static hoisting), у динамических узлов есть patch flags (что именно может меняться — текст, класс, пропсы), block tree — сравниваются только динамические узлы плоским списком. Плюс точечная реактивность: перерисовывается только затронутый компонент. Vapor Mode — следующий шаг, вообще без VDOM.' },
            { q: 'Зачем key в v-for?', links: ['vue-vdom'],
              a: 'По `key` Vue сопоставляет старые и новые узлы при сравнении списков. Без ключа или с индексом при вставке в середину/сортировке состояние (инпуты, локальный стейт компонентов) приклеится не к тем элементам. Ключ — стабильный уникальный id. Смена `key` у компонента — способ принудительно пересоздать его.' },
          ],
        },
        {
          name: 'Сторы',
          items: [
            { q: 'Pinia: почему она, как устроена?', links: ['vue-pinia', 'vue-state', 'ts-pinia'],
              a: 'Официальный стор Vue вместо Vuex: нет мутаций, полноценный TS, модульность — каждый стор отдельный и импортируется где нужен (tree shaking), DevTools с time travel. Два стиля: options (`state/getters/actions`) и setup-store (`ref` = state, `computed` = getters, функции = actions). Деструктуризация — только через `storeToRefs`, иначе потеряем реактивность. В Nuxt — `@pinia/nuxt`, состояние сериализуется в payload и гидратируется на клиенте.' },
            { q: 'Когда стор, а когда локальное состояние или composable?', links: ['vue-state', 'vue-composables'],
              a: 'Локально — что нужно одному компоненту. Composable — переиспользуемая логика, у каждого вызова своё состояние. Стор — данные, общие для разных частей приложения: пользователь, корзина, настройки, кеш справочников. В Nuxt для простого общего значения хватит `useState`. Анти-паттерн — всё подряд в стор: растёт связность, сложно тестировать.' },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'nuxt', name: 'Nuxt', color: 'nuxt',
      note: 'На доске этого раздела нет, но с Nuxt в резюме вопросы по SSR будут почти наверняка.',
      groups: [
        {
          name: 'SSR и гидратация',
          items: [
            { q: 'Режимы рендеринга: SSR, CSR, SSG, гибридный', links: ['nuxt-rendering'],
              a: 'SSR — HTML собирается на сервере на каждый запрос: быстрый первый показ и SEO. CSR — пустой HTML, всё рендерит JS в браузере (`ssr: false`). SSG — HTML генерируется при сборке (`nuxt generate`). Гибрид — `routeRules` задают режим по маршрутам: `prerender`, `swr`/`isr` (кеш с фоновым обновлением), `ssr: false` для кабинета.' },
            { q: 'Что такое гидратация и hydration mismatch?', links: ['nuxt-hydration'],
              a: 'Сервер прислал готовый HTML, клиент запускает то же приложение и «оживляет» разметку — навешивает обработчики, не перерисовывая. Mismatch — клиент на первом рендере получил другой результат, чем сервер: `Date.now()`, `Math.random()`, `window`, `localStorage`, локаль/часовой пояс, невалидный HTML (`<div>` в `<p>`). Лечение: одинаковые данные через payload (`useFetch`, `useState`), браузерное — в `onMounted` или `<ClientOnly>`.' },
            { q: 'Где выполняется код: сервер или клиент?', links: ['nuxt-server-vs-client', 'nuxt-server-client-components'],
              a: '`setup` и `<script setup>` выполняются и на сервере, и на клиенте. Только на клиенте — `onMounted`/`onBeforeMount`, `.client.vue`, `<ClientOnly>`, `import.meta.client`. Только на сервере — `server/` (Nitro), `.server.vue`, `import.meta.server`. Ошибка «window is not defined» — обращение к браузерному API в `setup` на сервере.' },
            { q: 'Cross-request state pollution', links: ['nuxt-usestate', 'nuxt-server-vs-client'],
              a: 'Сервер — один долгоживущий процесс для всех пользователей. Переменная на уровне модуля (`export const user = ref()`) создаётся один раз и общая для всех запросов: данные одного пользователя могут показаться другому. Поэтому состояние — через `useState`, Pinia или `useNuxtApp()`, которые создаются на каждый запрос.' },
          ],
        },
        {
          name: 'Данные',
          items: [
            { q: 'useFetch, useAsyncData и $fetch: в чём разница?', links: ['nuxt-usefetch', 'nuxt-useasyncdata', 'nuxt-dollar-fetch'],
              a: '`$fetch` — просто HTTP-клиент (ofetch): на сервере вызов своего API идёт напрямую, без сети. Если звать его в `setup`, запрос выполнится дважды: на сервере и при гидратации. `useAsyncData(key, fn)` выполняет функцию на сервере, кладёт результат в payload, на клиенте берёт оттуда; возвращает `data`, `status`, `error`, `refresh`. `useFetch(url)` = `useAsyncData` + `$fetch` с ключом из URL. Правило: `useFetch`/`useAsyncData` — для данных при рендере, `$fetch` — в обработчиках событий.' },
            { q: 'useLazyFetch и lazy: true', links: ['nuxt-lazy-fetch'],
              a: 'Не блокирует навигацию: страница показывается сразу, а данные приходят позже — нужно обработать `status === "pending"`. На SSR всё равно ждёт, разница видна при переходах на клиенте. Ещё есть `server: false` — грузить только на клиенте, `immediate: false` — запустить вручную через `execute`.' },
            { q: 'useState в Nuxt', links: ['nuxt-usestate'],
              a: 'Общее реактивное состояние по ключу, безопасное для SSR: создаётся на каждый запрос, сериализуется в payload и восстанавливается на клиенте. `useState("counter", () => 0)` — второй вызов с тем же ключом вернёт тот же `ref`. Значения должны сериализоваться в JSON-подобный формат (devalue): не функции и не классы.' },
            { q: 'Кеширование данных и ключи', links: ['nuxt-cache'],
              a: 'Ключ определяет идентичность данных: одинаковый ключ — общие данные, дедупликация одновременных запросов. `getCachedData` решает, брать ли данные из payload/кеша при навигации на клиенте (по умолчанию — только из гидрации). На уровне сервера — `routeRules` с `swr`, `defineCachedEventHandler` и `cachedFunction` в Nitro.' },
          ],
        },
        {
          name: 'Структура',
          items: [
            { q: 'Роутинг и middleware', links: ['nuxt-routing', 'nuxt-middleware', 'nuxt-route-router'],
              a: 'Маршруты из файлов `pages/`: `[id].vue` — параметр, `[...slug].vue` — catch-all, вложенные через `<NuxtPage>`. `definePageMeta` — layout, middleware, свои мета. Route middleware в `middleware/` — перед навигацией: анонимные, именованные, глобальные `.global.ts`; возвращают `navigateTo()` или `abortNavigation()`. Серверные middleware в `server/middleware` — на каждый HTTP-запрос в Nitro, это другое.' },
            { q: 'Плагины, runtimeConfig, Nitro', links: ['nuxt-plugins', 'nuxt-runtime-config', 'nuxt-nitro'],
              a: 'Плагины в `plugins/` выполняются при создании приложения: подключить библиотеку, `provide` хелпер (`$api`), суффиксы `.client`/`.server`. `runtimeConfig` — настройки из env в рантайме: корень — только сервер (секреты), `public` — уходит на клиент. `app.config` — публичные настройки на этапе сборки. Nitro — серверный движок: API в `server/api`, деплой на Node, serverless, edge.' },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'patterns', name: 'Паттерны проектирования', color: 'arch',
      groups: [
        {
          name: 'Принципы и GoF',
          items: [
            { q: 'SOLID', links: ['arch-solid-s', 'arch-solid-o', 'arch-solid-l', 'arch-solid-i', 'arch-solid-d'],
              a: 'S — одна причина для изменения: компонент не грузит данные, не форматирует и не рисует всё сразу. O — расширять без правки: новый вариант через слот, проп-стратегию или регистрацию, а не новую ветку `if`. L — наследник/реализация заменяет базу без сюрпризов: обёртка над инпутом ведёт себя как инпут. I — узкие интерфейсы: компонент принимает только нужные пропсы, а не весь объект. D — зависеть от абстракций: компонент работает с интерфейсом API, конкретная реализация приходит через provide/inject или параметр.' },
            { q: 'Gang of Four: какие паттерны бывают?', links: ['arch-factory', 'arch-observer', 'arch-strategy', 'arch-adapter', 'arch-facade', 'arch-decorator', 'arch-proxy', 'arch-singleton'],
              a: 'Три группы. Порождающие — как создавать объекты: Singleton, Factory Method, Abstract Factory, Builder, Prototype. Структурные — как собирать: Adapter, Facade, Decorator, Proxy, Composite, Bridge, Flyweight. Поведенческие — как взаимодействовать: Observer, Strategy, Command, State, Iterator, Mediator, Chain of Responsibility, Template Method, Visitor. Во фронтенде встроены: Observer — реактивность и события, Proxy — `reactive`, Iterator — `for...of`, Composite — дерево компонентов, Singleton — модуль ES и стор Pinia.' },
            { q: 'Какие паттерны применяли на практике?', links: ['arch-strategy', 'arch-adapter', 'arch-facade', 'arch-observer'],
              a: 'Ответ — 2–3 своих примера по схеме «задача → паттерн → что дало». Заготовки: Adapter — маппинг ответов API в модели фронта, бэкенд поменял формат, а компоненты не тронуты. Facade — composable или API-клиент, скрывающий запросы, кеш и ошибки за одним вызовом. Strategy — разные правила расчёта или валидации по типу, без длинного `switch`. Observer — шина событий или `watch` на сторе. Подставить реальные кейсы из своих проектов.' },
          ],
        },
      ],
    },
    /* ---------------------------------------------------------------- */
    {
      id: 'security', name: 'Security', color: 'bad',
      groups: [
        {
          name: 'Веб-безопасность',
          items: [
            { q: 'XSS: что это и как защищаться?', links: [],
              a: 'Внедрение чужого скрипта на страницу: хранимый (из базы), отражённый (из URL), DOM-based (наш JS вставил данные в `innerHTML`). Защита: экранирование вывода — Vue делает это для `{{ }}` и атрибутов автоматически; `v-html` и `innerHTML` — только с санитайзером (DOMPurify); не подставлять пользовательский ввод в `href` (`javascript:`), CSP как второй рубеж, `HttpOnly` для сессионных кук.' },
            { q: 'CSRF: что это и как защищаться?', links: [],
              a: 'Чужой сайт заставляет браузер отправить запрос на наш, и браузер сам прикладывает куки пользователя — например, форма с автосабмитом на перевод денег. Защита: `SameSite=Lax/Strict` у кук, CSRF-токен в форме или заголовке, проверка `Origin`/`Referer`, не менять состояние через GET. Если авторизация через заголовок `Authorization`, а не куки, CSRF не страшен, зато токен уязвим для XSS.' },
            { q: 'Cookie flags: SameSite, HttpOnly, Secure', links: ['web-storage'],
              a: '`HttpOnly` — кука не видна в `document.cookie`, XSS её не украдёт. `Secure` — только по HTTPS. `SameSite=Strict` — не отправляется ни с одного чужого сайта, даже при переходе по ссылке (пользователь придёт «разлогиненным»); `Lax` — отправляется только при переходе верхнего уровня GET-запросом, по умолчанию в браузерах; `None` — всегда, только вместе с `Secure` (виджеты, iframe).' },
            { q: 'Content Security Policy', links: [],
              a: 'Заголовок, который говорит браузеру, откуда можно грузить и выполнять ресурсы: `default-src \'self\'`, `script-src` с `nonce` или хешами вместо `unsafe-inline`, `img-src`, `connect-src`, `frame-ancestors` (защита от кликджекинга). Даже если XSS удался, чужой скрипт не выполнится. Внедрять через `Content-Security-Policy-Report-Only`, чтобы сначала собрать нарушения. В Nuxt — модуль `nuxt-security`.' },
            { q: 'CORS', links: ['web-cors'],
              a: 'Браузерный механизм ослабления same-origin policy: JS с одного origin может читать ответ другого, только если сервер разрешил заголовком `Access-Control-Allow-Origin`. Для «непростых» запросов (PUT/DELETE, JSON, свои заголовки) сначала идёт preflight `OPTIONS`. С куками — `credentials: "include"` на клиенте и конкретный origin (не `*`) плюс `Allow-Credentials` на сервере. CORS защищает пользователя в браузере, а не сервер: curl его игнорирует.' },
          ],
        },
      ],
    },
  ],
};
