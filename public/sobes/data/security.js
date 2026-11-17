window.SOBES = window.SOBES || { topics: [] };
window.SOBES.topics.push(
  {
    id: 'security-xss',
    section: 'security',
    group: 'Атаки на страницу',
    title: 'XSS, v-html и санитизация',
    level: 'middle',
    summary: 'XSS — когда чужой скрипт выполняется в контексте вашего сайта и получает всё, что есть у пользователя: DOM, токены из `localStorage`, запросы от его имени.',
    points: [
      { title: 'Три вида: хранимая, отражённая, DOM-based', text: 'Хранимая — скрипт сохранён в базе (комментарий, имя профиля) и показывается всем. Отражённая — пришёл в параметре URL и вернулся в ответе сервера. DOM-based — фронтенд сам берёт данные из `location`, `postMessage` или хранилища и вставляет их в опасное место.', code: `// DOM-based: сервер ни при чём
const q = new URLSearchParams(location.search).get('q')
el.innerHTML = 'Результаты по ' + q   // ?q=<img src=x onerror=alert(1)>
el.textContent = 'Результаты по ' + q // ок`, lang: 'js' },
      { title: 'Vue экранирует `{{ }}` и атрибуты, но не `v-html`', text: 'Интерполяция вставляет текст через `textContent`, и `<script>` в данных останется текстом. `v-html` вставляет как разметку, поэтому туда — только то, что вы сами сгенерировали или очистили.', code: `<p>{{ comment.text }}</p>      <!-- безопасно -->
<div v-html="comment.html" />   <!-- XSS, если html от пользователя -->
<div v-html="safeHtml" />       <!-- после DOMPurify -->`, lang: 'vue' },
      { title: 'Санитизация — allowlist на клиенте при выводе', text: 'DOMPurify разбирает HTML и выкидывает всё, кроме разрешённых тегов и атрибутов. Чистить регулярками бесполезно: обходов десятки. Серверу тоже стоит чистить, но клиент обязан защищать свой вывод сам.', code: `import DOMPurify from 'dompurify'

const safeHtml = computed(() =>
  DOMPurify.sanitize(props.html, { ALLOWED_TAGS: ['b', 'i', 'a', 'p', 'ul', 'li'] })
)`, lang: 'ts' },
      { title: 'Ловушка: опасные места кроме `innerHTML`', text: '`href` и `src` с `javascript:`, `eval`, `new Function`, `setTimeout` со строкой, `document.write`, обработчики `on*` в атрибутах. Vue не проверяет протокол в `:href`.', code: `<a :href="user.site">Сайт</a>  <!-- javascript:alert(1) сработает -->

const safeUrl = (u: string) =>
  /^https?:/i.test(new URL(u, location.origin).protocol) ? u : '#'`, lang: 'vue' },
      { title: 'SSR: данные в `<script>` тоже нужно экранировать', text: 'Строка `</script>` внутри сериализованного состояния закроет тег и откроет место для инъекции. Nuxt сериализует payload через devalue с экранированием, но в самописном SSR про это забывают.', code: `// опасно: JSON.stringify не экранирует </script>
html += '<script>window.__STATE__=' + JSON.stringify(state) + '</script>'`, lang: 'ts' }
    ],
    takeaway: 'Выводите через `{{ }}`, `v-html` — только после DOMPurify, проверяйте протокол в ссылках и добавьте CSP как второй рубеж.',
    questions: [
      { q: 'Какие бывают XSS и как от них защищается Vue?', a: 'Хранимая — вредоносный код лежит в базе и показывается всем, кто открыл страницу. Отражённая — код приходит в параметре запроса и сервер возвращает его в ответе. DOM-based — фронтенд сам берёт данные из URL или `postMessage` и вставляет через `innerHTML`. Vue по умолчанию экранирует интерполяцию и значения атрибутов, поэтому большая часть кода безопасна. Дыры появляются там, где мы сами отключаем защиту: `v-html`, `innerHTML` в директивах, динамический `:href` с `javascript:`, рендер-функции со строками от пользователя.' },
      { q: 'Нужно вывести HTML от пользователя, например из WYSIWYG-редактора. Как сделать безопасно?', a: 'Пропускаю его через санитайзер с allowlist, обычно DOMPurify, разрешая только нужные теги и атрибуты. Результат уже идёт в `v-html`. Чистка регулярками не работает, потому что парсер браузера понимает гораздо больше вариантов разметки. Лучше всего чистить и на сервере при сохранении, и на клиенте при выводе, плюс включить CSP, чтобы даже пропущенный скрипт не выполнился. Если формат позволяет, вообще храню не HTML, а структуру вроде Markdown или JSON-документа и рендерю её компонентами.' }
    ]
  },
  {
    id: 'security-csp',
    section: 'security',
    group: 'Атаки на страницу',
    title: 'Content Security Policy',
    level: 'senior',
    summary: 'CSP — заголовок, который говорит браузеру, откуда можно грузить и выполнять скрипты. Это второй рубеж против XSS: даже внедрённый скрипт не выполнится.',
    points: [
      { title: 'Allowlist доменов обходится — нужен nonce или hash', text: 'Если в `script-src` разрешён CDN, атакующий подключит с него старую библиотеку с гаджетом (JSONP, старый Angular) и выполнит код. Строгая CSP разрешает только скрипты с одноразовым `nonce`, который сервер генерирует на каждый ответ.', code: `Content-Security-Policy:
  script-src 'nonce-r4nd0m' 'strict-dynamic';
  object-src 'none'; base-uri 'none';

<script nonce="r4nd0m" src="/app.js"></script>`, lang: 'text' },
      { title: '`strict-dynamic` — доверие передаётся скриптам, загруженным доверенным', text: 'Бандлер грузит чанки динамически, и ставить на каждый nonce неудобно. С `strict-dynamic` скрипт с nonce может создавать другие скрипты, а allowlist доменов и `self` игнорируются.', code: `// app.js пришёл с nonce — его динамический import разрешён
const Page = () => import('./pages/Catalog.js')`, lang: 'js' },
      { title: '`unsafe-inline` и `unsafe-eval` убивают смысл CSP', text: 'С `unsafe-inline` любой внедрённый `<script>` и `onclick` выполнится. Если в политике есть nonce, браузеры игнорируют `unsafe-inline` — его оставляют только как фолбэк для очень старых.', code: `script-src 'self' 'unsafe-inline'  /* почти не защищает */
script-src 'nonce-abc' 'strict-dynamic' 'unsafe-inline' https: /* фолбэк для старых */`, lang: 'text' },
      { title: 'Внедряют через Report-Only, а не сразу', text: '`Content-Security-Policy-Report-Only` ничего не блокирует, только присылает отчёты о нарушениях. Неделю собирают отчёты, чинят инлайновые скрипты и сторонние виджеты, потом включают боевой заголовок.', code: `Content-Security-Policy-Report-Only:
  script-src 'nonce-abc' 'strict-dynamic'; report-to csp
Reporting-Endpoints: csp="https://example.com/csp-reports"`, lang: 'text' },
      { title: 'Nonce требует серверного рендера на каждый запрос', text: 'Статика с CDN не может выдать новый nonce, тогда используют hash инлайновых скриптов. В Nuxt CSP с nonce обычно включают через модуль безопасности, который проставляет nonce в SSR-ответ.', code: `script-src 'sha256-B2yPHKaXnvFWtRChIbabYmUBFZdVfKKXHbWtWidDVF8='
/* hash содержимого инлайнового скрипта — для статических страниц */`, lang: 'text' }
    ],
    takeaway: 'Строгая CSP — это `nonce` + `strict-dynamic` + `object-src none` + `base-uri none`, внедряется через Report-Only.',
    questions: [
      { q: 'Что такое CSP и почему allowlist доменов недостаточно?', a: 'CSP — заголовок ответа, который ограничивает, откуда страница может загружать и выполнять скрипты, стили, фреймы и куда отправлять запросы. Главная цель — чтобы внедрённый скрипт не выполнился. Классическая политика со списком доменов часто обходится: если разрешён популярный CDN или домен с JSONP, атакующий подключит оттуда то, что выполнит его код. Поэтому сейчас рекомендуют строгую политику на nonce или hash с `strict-dynamic`: выполняется только то, что сервер явно пометил в этом ответе.' },
      { q: 'Как бы вы внедряли CSP в существующий проект?', a: 'Сначала включаю заголовок в режиме `Report-Only` с эндпоинтом для отчётов: он ничего не ломает, но показывает все нарушения. По отчётам убираю инлайновые обработчики вроде `onclick`, переношу инлайновые скрипты на nonce, разбираюсь со сторонними виджетами и аналитикой. Когда отчёты затихают, включаю боевой заголовок, а Report-Only оставляю для следующей, более строгой версии политики. Отчёты продолжаю собирать и после — по ним видно попытки атак и сломанные интеграции.' }
    ]
  },
  {
    id: 'security-csrf',
    section: 'security',
    group: 'Атаки на страницу',
    title: 'CSRF и SameSite',
    level: 'middle+',
    summary: 'CSRF — чужой сайт заставляет браузер пользователя отправить запрос на ваш сервер, и браузер сам прикладывает куки. Атакующий не видит ответа, но действие выполняется.',
    points: [
      { title: 'CSRF возможен только при авторизации через куки', text: 'Браузер автоматически прикладывает куки к запросу на ваш домен, откуда бы он ни был инициирован. Если токен идёт в заголовке `Authorization` из JS, чужая страница его не знает и CSRF не работает.', code: `<!-- на evil.com -->
<form action="https://bank.ru/transfer" method="POST">
  <input name="to" value="hacker"><input name="sum" value="10000">
</form>
<script>document.forms[0].submit()</script>`, lang: 'html' },
      { title: '`SameSite=Lax` — защита по умолчанию в браузерах', text: '`Strict` — кука не уходит ни с какого межсайтового запроса, даже при переходе по ссылке (пользователь придёт «разлогиненным»). `Lax` — уходит только при навигации верхнего уровня методом GET. `None` — всегда, требует `Secure`. Chrome считает куки без атрибута `Lax`, но не все браузеры.', code: `Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax; Path=/`, lang: 'text' },
      { title: 'Ловушка: `SameSite` не защищает от своего же поддомена', text: 'Site — это регистрируемый домен: `blog.example.com` и `app.example.com` — один сайт. XSS или захваченный поддомен обходят `SameSite`. А изменение состояния через GET обходит `Lax`.', code: `GET /api/delete?id=5   // Lax пропустит при переходе по ссылке
DELETE /api/items/5    // ок: только безопасные методы на GET`, lang: 'text' },
      { title: 'Дополнительно: CSRF-токен или проверка `Origin`', text: 'Сервер выдаёт токен, фронт кладёт его в заголовок, чужая страница его не знает (double submit cookie или токен в meta). Простой вариант — сервер отвергает изменяющие запросы с чужим `Origin`. Кастомный заголовок тоже помогает: межсайтовый запрос с ним требует CORS preflight.', code: `const csrf = useCookie('XSRF-TOKEN')
await $fetch('/api/orders', {
  method: 'POST',
  headers: { 'X-XSRF-TOKEN': csrf.value ?? '' },
  body: order,
})`, lang: 'ts' }
    ],
    takeaway: 'Сессия в куке — это `HttpOnly; Secure; SameSite=Lax`, никаких изменений по GET и CSRF-токен или проверка `Origin` для важных действий.',
    questions: [
      { q: 'Что такое CSRF и как от него защищаются?', a: 'Это атака, при которой страница злоумышленника отправляет запрос на наш сервер от имени залогиненного пользователя: браузер сам прикладывает куки сессии. Ответ атакующий не прочитает, но перевод денег или смена email выполнятся. Защита: кука сессии с `SameSite=Lax` или `Strict`, запрет изменений по GET, CSRF-токен, который знает только наш фронт, и проверка заголовка `Origin` на сервере. Если авторизация через токен в заголовке `Authorization`, CSRF в классическом виде не работает, но тогда токен доступен JS и уязвим для XSS.' },
      { q: 'Чем отличаются SameSite Strict, Lax и None?', a: '`Strict` не отправляет куку ни с каким межсайтовым запросом, даже при клике по ссылке с другого сайта, поэтому пользователь придёт как неавторизованный. `Lax` отправляет её только при навигации верхнего уровня безопасным методом, то есть переход по ссылке работает, а POST-форма с чужого сайта и fetch — нет. `None` отправляет всегда и требует `Secure`, нужен для виджетов в iframe на чужих сайтах. Для сессии обычно `Lax`. Важно, что «сайт» — это регистрируемый домен, поэтому поддомены считаются тем же сайтом.' }
    ]
  },
  {
    id: 'security-tokens',
    section: 'security',
    group: 'Авторизация',
    title: 'Где хранить токены: localStorage vs httpOnly cookie, refresh',
    level: 'senior',
    summary: 'Всё, что доступно JS, украдёт XSS. Refresh-токен — в `httpOnly`-куке, короткий access — в памяти или тоже в куке. Refresh ротируется, а параллельные 401 обновляют токен один раз.',
    points: [
      { title: '`localStorage` читает любой скрипт на странице', text: 'Одна XSS или скомпрометированная зависимость — и токен уехал, им можно пользоваться с другой машины до истечения. `httpOnly`-куку JS не видит, украсть её нельзя, хотя XSS всё ещё может делать запросы от имени пользователя, пока он на странице.', code: `localStorage.getItem('token')      // доступен любому скрипту
document.cookie                     // httpOnly-кук тут нет
Set-Cookie: refresh=...; HttpOnly; Secure; SameSite=Strict; Path=/auth`, lang: 'ts' },
      { title: 'Схема: короткий access + долгий refresh', text: 'Access живёт 5–15 минут и уходит с каждым запросом. Refresh живёт дни, лежит в `httpOnly`-куке с узким `Path` и нужен только для получения нового access. Утечка access ограничена минутами.', code: `// access — в памяти (теряется при перезагрузке, тогда сразу refresh)
let accessToken: string | null = null

async function refresh() {
  const r = await $fetch<{ access: string }>('/auth/refresh', { method: 'POST' })
  accessToken = r.access   // refresh-кука ушла сама
}`, lang: 'ts' },
      { title: 'Ротация refresh: каждый refresh одноразовый', text: 'При обновлении сервер выдаёт новый refresh и инвалидирует старый. Если пришёл уже использованный refresh — значит, его украли, и сервер отзывает всю цепочку сессии.', code: `POST /auth/refresh  (cookie: refresh=R1)
→ access=A2, Set-Cookie: refresh=R2   // R1 больше не работает
POST /auth/refresh  (cookie: refresh=R1)
→ 401, вся сессия отозвана            // повтор = кража`, lang: 'text' },
      { title: 'Ловушка: пять запросов получили 401 — обновить токен один раз', text: 'Если каждый запрос сам вызовет refresh, при ротации второй вызов придёт со старым refresh и разлогинит пользователя. Нужен один общий промис обновления, все 401 ждут его и повторяют свой запрос.', code: `let refreshing: Promise<void> | null = null

async function request<T>(url: string, opts = {}): Promise<T> {
  try { return await api<T>(url, opts) }
  catch (e: any) {
    if (e.status !== 401) throw e
    refreshing ??= refresh().finally(() => { refreshing = null })
    await refreshing          // все ждут одного обновления
    return api<T>(url, opts)  // и повторяют запрос
  }
}`, lang: 'ts' },
      { title: 'Несколько вкладок тоже обновляют токен одновременно', text: 'Вкладки не делят память, и каждая получит свой 401. Координируют через `BroadcastChannel` или Web Locks API: одна вкладка обновляет, остальные получают новый access или просто повторяют запрос с обновлённой кукой.', code: `await navigator.locks.request('auth-refresh', async () => {
  if (isFresh(accessToken)) return  // другая вкладка уже обновила
  await refresh()
})`, lang: 'ts' }
    ],
    takeaway: 'Refresh — только в `httpOnly; Secure`-куке с ротацией, access — короткий и в памяти, и один общий промис обновления на все параллельные 401.',
    questions: [
      { q: 'Где хранить JWT: в localStorage или в cookie?', a: 'Всё, что лежит в `localStorage`, `sessionStorage` или обычной куке, читается любым JS на странице, поэтому XSS или заражённая зависимость уносит токен, и им пользуются с другой машины. `httpOnly`-куку JS прочитать не может. Поэтому долгоживущий refresh-токен храню только в `httpOnly; Secure`-куке с узким путём, а короткий access — в памяти приложения. Куки добавляют риск CSRF, его закрываю `SameSite` и проверкой `Origin`. Важно понимать, что `httpOnly` не спасает от XSS полностью: скрипт всё равно может делать запросы, пока пользователь на странице. Он просто не может унести токен.' },
      { q: 'Что такое ротация refresh-токенов?', a: 'Каждый refresh-токен одноразовый: при обмене сервер выдаёт новую пару и помечает старый refresh использованным. Если кто-то приходит с уже использованным refresh, значит, токен утёк и им пользуются двое. Сервер в этом случае отзывает всю цепочку, и разлогинивается и злоумышленник, и пользователь. Так украденный refresh перестаёт быть вечным пропуском.' },
      { q: 'Несколько запросов одновременно получили 401. Как обработать?', a: 'Нельзя, чтобы каждый запрос сам запускал обновление: при ротации второй запрос придёт со старым refresh и сессия будет отозвана. Делаю в интерсепторе одну переменную с промисом обновления: первый 401 создаёт промис, остальные видят, что обновление уже идёт, ждут его и после этого повторяют свой запрос. Если обновление упало — выкидываю на логин. Между вкладками то же самое решается через Web Locks или `BroadcastChannel`.' }
    ]
  },
  {
    id: 'security-cors',
    section: 'security',
    group: 'Авторизация',
    title: 'CORS — не защита от атак',
    level: 'middle+',
    summary: 'CORS не запрещает запросы, а разрешает чтение ответов с другого origin. Это ослабление same-origin policy, а не защита сервера.',
    points: [
      { title: 'Same-origin policy запрещает читать ответ, а не отправлять запрос', text: 'Простой POST с формы или `fetch` с чужого сайта долетает до сервера и выполняется. Браузер только не отдаёт ответ скрипту, если сервер не прислал разрешающий заголовок. Поэтому от CSRF CORS не защищает.', code: `// с evil.com
fetch('https://api.shop.ru/orders', { method: 'POST', body: form, credentials: 'include' })
// запрос ушёл и выполнен; прочитать ответ нельзя`, lang: 'js' },
      { title: 'Preflight `OPTIONS` — для «непростых» запросов', text: 'Методы кроме GET/HEAD/POST, заголовки вроде `Authorization` или `Content-Type: application/json` заставляют браузер сначала спросить сервер. Только для них сервер может отказать до выполнения.', code: `OPTIONS /api/orders
Origin: https://app.shop.ru
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: authorization, content-type`, lang: 'text' },
      { title: 'Куки через CORS — только с конкретным origin', text: 'С `credentials: include` сервер обязан вернуть точный `Access-Control-Allow-Origin` (не `*`) и `Allow-Credentials: true`.', code: `Access-Control-Allow-Origin: https://app.shop.ru
Access-Control-Allow-Credentials: true
Vary: Origin`, lang: 'text' },
      { title: 'Ловушка: отражать любой `Origin` с credentials', text: 'Сервер, который копирует пришедший `Origin` в ответ вместе с `Allow-Credentials`, разрешает любому сайту читать данные пользователя. Это реальная уязвимость, хуже, чем отсутствие CORS.', code: `// плохо
res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
res.setHeader('Access-Control-Allow-Credentials', 'true')
// ок: проверка по списку
if (ALLOWED.has(origin)) res.setHeader('Access-Control-Allow-Origin', origin)`, lang: 'ts' },
      { title: 'CORS ограничивает только браузер', text: 'curl, Postman, сервер злоумышленника CORS не проверяют. Защита API — это авторизация и проверка прав на сервере. В разработке ошибку CORS обходят прокси dev-сервера, а не выключением проверки.', code: `// vite.config.ts — запросы идут с того же origin
server: { proxy: { '/api': 'http://localhost:8080' } }`, lang: 'ts' }
    ],
    takeaway: 'CORS решает, кто может читать ответ в браузере. От CSRF защищают `SameSite` и токены, от остального — авторизация на сервере.',
    questions: [
      { q: 'Защищает ли CORS от атак?', a: 'Нет. CORS — механизм, который ослабляет same-origin policy и разрешает конкретным origin читать ответы. Same-origin policy и так не мешает отправить запрос: форма или простой fetch с чужого сайта дойдёт до сервера и выполнится, браузер лишь не отдаст ответ скрипту. Значит, от CSRF CORS не защищает. И он работает только в браузере — curl или чужой сервер его игнорируют. Защита API — авторизация, проверка прав, `SameSite`, CSRF-токены.' },
      { q: 'Когда браузер отправляет preflight-запрос?', a: 'Когда запрос «непростой»: метод не GET, HEAD или POST, есть нестандартные заголовки вроде `Authorization`, или `Content-Type` не из трёх простых, например `application/json`. Тогда браузер сначала шлёт `OPTIONS` с `Access-Control-Request-Method` и `-Headers`, и только если сервер ответил разрешением, отправляет настоящий запрос. Ответ на preflight можно кешировать через `Access-Control-Max-Age`, чтобы не удваивать количество запросов.' }
    ]
  },
  {
    id: 'security-clickjacking',
    section: 'security',
    group: 'Атаки на страницу',
    title: 'Clickjacking и frame-ancestors',
    level: 'middle',
    summary: 'Ваш сайт грузят в прозрачный iframe поверх приманки, и пользователь нажимает вашу кнопку, думая, что нажимает чужую. Защита — запретить встраивание заголовком.',
    points: [
      { title: 'Атака: прозрачный iframe поверх кнопки «Получить приз»', text: 'Пользователь залогинен на вашем сайте, куки уходят в iframe, и клик попадает в настоящую кнопку «Удалить аккаунт» или «Подтвердить перевод».', code: `<iframe src="https://bank.ru/settings"
  style="opacity:0; position:absolute; top:0; left:0; z-index:2"></iframe>
<button style="position:absolute; top:120px">Получить приз</button>`, lang: 'html' },
      { title: 'CSP `frame-ancestors` — современный способ', text: 'Говорит, какие сайты могут встраивать страницу. `none` — никто, `self` — только свой origin. Работает только как заголовок, в `<meta>` игнорируется.', code: `Content-Security-Policy: frame-ancestors 'none'
Content-Security-Policy: frame-ancestors 'self' https://partner.ru`, lang: 'text' },
      { title: '`X-Frame-Options` — для старых браузеров', text: 'Умеет только `DENY` и `SAMEORIGIN`. Если заданы оба заголовка, современные браузеры следуют `frame-ancestors`.', code: `X-Frame-Options: DENY`, lang: 'text' },
      { title: 'Ловушка: JS-проверка `top !== self` легко обходится', text: 'Старый приём «выпрыгнуть из фрейма» ломается через `sandbox` у iframe, который запрещает скрипты или навигацию родителя. Защита должна быть в заголовке.', code: `if (window.top !== window.self) window.top.location = location.href
// <iframe sandbox="allow-forms" src="..."> — скрипт не выполнится`, lang: 'js' }
    ],
    takeaway: 'Всем страницам — `frame-ancestors \'none\'` (или `self`), исключения — явным списком партнёров.',
    questions: [
      { q: 'Что такое clickjacking и как от него защититься?', a: 'Злоумышленник загружает наш сайт в невидимый iframe и располагает его так, чтобы пользователь, кликая по приманке, нажал нашу кнопку. Так как пользователь залогинен, действие выполняется от его имени. Защита — запретить встраивание: заголовок `Content-Security-Policy: frame-ancestors \'none\'` или `\'self\'`, а для старых браузеров ещё `X-Frame-Options: DENY`. JS-скрипты, которые проверяют `window.top`, ненадёжны, их обходят атрибутом `sandbox`.' },
      { q: 'Чем frame-ancestors отличается от X-Frame-Options?', a: '`X-Frame-Options` — старый заголовок, умеет только `DENY` и `SAMEORIGIN`, список разрешённых сайтов задать нельзя. `frame-ancestors` — директива CSP: можно перечислить несколько origin, например свой и партнёрский, и она проверяет всю цепочку родительских фреймов. Если заданы оба, современные браузеры смотрят на `frame-ancestors`. Я ставлю оба: CSP для актуальных браузеров, `X-Frame-Options` на всякий случай для старых. Важно, что `frame-ancestors` работает только в заголовке, в `<meta>` её игнорируют.' }
    ]
  },
  {
    id: 'security-supply-chain',
    section: 'security',
    group: 'Код и инфраструктура',
    title: 'Зависимости и supply chain',
    level: 'senior',
    summary: 'Каждый npm-пакет выполняется с теми же правами, что и ваш код, а `postinstall` — ещё и на машине разработчика и в CI. Защита — фиксировать версии, ревьюить обновления и сокращать дерево.',
    points: [
      { title: 'Lockfile в репозитории, в CI — `npm ci`', text: 'Lockfile фиксирует точные версии и хеши всего дерева. `npm ci` ставит строго по нему и падает при расхождении с `package.json`, а `npm install` может молча подтянуть новую минорную версию с вредоносным кодом.', code: `npm ci                      # строго по lockfile
pnpm install --frozen-lockfile
yarn install --immutable`, lang: 'bash' },
      { title: 'Скрипты установки — главный вектор атаки', text: 'Взломанный пакет в `postinstall` крадёт токены npm, переменные окружения CI, ключи. В pnpm скрипты зависимостей по умолчанию не выполняются, разрешаются явным списком. В npm можно отключить глобально.', code: `npm config set ignore-scripts true
# pnpm: в package.json
"pnpm": { "onlyBuiltDependencies": ["esbuild"] }`, lang: 'bash' },
      { title: '`npm audit` находит известные уязвимости, но не свежие атаки', text: 'Audit сверяет версии с базой CVE. Только что опубликованный вредоносный релиз в базе ещё не значится. Поэтому полезно выдерживать паузу перед обновлением на свежую версию и смотреть, что изменилось.', code: `npm audit --omit=dev       # что реально попадёт в прод
npm audit fix              # без --force: --force поднимает мажоры`, lang: 'bash' },
      { title: 'Обновления — через PR с ревью, а не скопом', text: 'Бот (Renovate, Dependabot) создаёт PR на каждое обновление, CI гоняет тесты, человек смотрит changelog и смену мейнтейнера. Подозрительно: новый `postinstall`, обфусцированный код, патч-версия с огромным диффом.', code: `// renovate.json
{ "minimumReleaseAge": "3 days", "rangeStrategy": "pin" }`, lang: 'json' },
      { title: 'Сторонние скрипты с CDN — с `integrity`', text: 'Subresource Integrity проверяет хеш файла: если CDN взломали и подменили библиотеку, браузер её не выполнит. Ещё лучше — забандлить зависимость к себе.', code: `<script src="https://cdn.example.com/lib@1.2.3/lib.min.js"
  integrity="sha384-..." crossorigin="anonymous"></script>`, lang: 'html' }
    ],
    takeaway: 'Lockfile + `npm ci`, скрипты установки под контролем, обновления — отдельными PR с паузой и ревью, а лишнюю зависимость лучше не ставить.',
    questions: [
      { q: 'Как вы защищаете проект от атак через npm-зависимости?', a: 'Lockfile всегда в репозитории, в CI установка строго по нему через `npm ci` или `--frozen-lockfile`, чтобы не подтянулась внезапная новая версия. Скрипты установки ограничиваю: в pnpm разрешаю их явным списком. Обновления идут через бота отдельными PR, с небольшой выдержкой после релиза, тестами и просмотром changelog. Регулярно запускаю `npm audit` для известных уязвимостей. И перед добавлением нового пакета смотрю, нужен ли он вообще: часто это пара строк, которые проще написать самому.' },
      { q: 'Почему npm audit недостаточно?', a: 'Он находит только уже известные и описанные уязвимости по базе. Атака через захваченный аккаунт мейнтейнера работает с момента публикации, и в первые часы и дни её нет ни в одной базе — именно тогда она и успевает распространиться. Кроме того, audit много шумит уязвимостями в dev-зависимостях, которые не попадают в прод. Поэтому audit — одна из мер, а основная защита — фиксированные версии, контроль install-скриптов и осознанные обновления.' }
    ]
  },
  {
    id: 'security-secrets',
    section: 'security',
    group: 'Код и инфраструктура',
    title: 'Секреты на фронтенде',
    level: 'middle',
    summary: 'Всё, что попало в бандл, публично. На фронтенде не бывает секретов — только публичные ключи и идентификаторы. Секретный ключ живёт на сервере, фронт ходит через свой API.',
    points: [
      { title: 'Переменные окружения встраиваются в код при сборке', text: '`import.meta.env.VITE_*` заменяется строкой прямо в бандле. Префикс `VITE_` нужен, чтобы случайно не выдать всё окружение, но всё с этим префиксом увидит любой в DevTools.', code: `# .env
VITE_MAPS_KEY=pk_live_xxx       # публичный ключ — ок
VITE_STRIPE_SECRET=sk_live_xxx  # утечка: окажется в JS-файле`, lang: 'bash' },
      { title: 'Nuxt: `runtimeConfig` — на сервере, `runtimeConfig.public` — всем', text: 'Ключи верхнего уровня доступны только в серверном коде (`server/`, серверный рендер). Всё из `public` сериализуется в HTML страницы и видно в браузере. Значения переопределяются переменными `NUXT_*` и `NUXT_PUBLIC_*`.', code: `export default defineNuxtConfig({
  runtimeConfig: {
    paymentSecret: '',               // NUXT_PAYMENT_SECRET, только сервер
    public: { apiBase: '/api' },     // NUXT_PUBLIC_API_BASE, виден всем
  },
})`, lang: 'ts' },
      { title: 'Секретный ключ — через свой серверный маршрут', text: 'Фронт вызывает свой эндпоинт, тот добавляет ключ и ходит к внешнему API. Заодно там можно ограничить частоту и проверить права.', code: `// server/api/geocode.get.ts
export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)
  const { geoSecret } = useRuntimeConfig(event)
  return $fetch('https://geo.example.com/search', { query: { q, key: geoSecret } })
})`, lang: 'ts' },
      { title: 'Ловушка: source maps и закомментированный код тоже в проде', text: 'Публичные source maps отдают исходники целиком, включая комментарии и внутренние URL. Их загружают в систему мониторинга ошибок и не выкладывают публично. Секрет, однажды попавший в git, считается скомпрометированным — его перевыпускают.', code: `// vite.config.ts
build: { sourcemap: 'hidden' } // карты есть для мониторинга, ссылки в бандле нет`, lang: 'ts' },
      { title: 'Публичный ключ тоже ограничивают', text: 'Ключи карт и аналитики видны всем, поэтому в их консоли ставят ограничение по домену (HTTP referrer) и квоты, чтобы ключ не использовали на чужом сайте.' }
    ],
    takeaway: 'Если значение нужно браузеру — оно публичное. Секрет только на сервере, а фронт ходит через свой API.',
    questions: [
      { q: 'Можно ли хранить API-ключ в .env фронтенд-проекта?', a: 'Можно только публичный. Переменные с префиксом `VITE_` или из `runtimeConfig.public` в Nuxt встраиваются в бандл или в HTML и видны любому в DevTools. Секретные ключи — платёжные, к базе, к сторонним API с оплатой — должны жить на сервере. Во фронтенде делаю серверный маршрут, который добавляет ключ и проксирует запрос, а публичным ключам ставлю ограничение по домену и квоты в консоли провайдера.' },
      { q: 'Чем runtimeConfig отличается от runtimeConfig.public в Nuxt?', a: 'Ключи верхнего уровня `runtimeConfig` доступны только на сервере: в `server/`, в серверных плагинах и при SSR. В клиентский бандл и payload они не попадают. Всё из `public` передаётся в браузер вместе со страницей. Оба уровня можно переопределить переменными окружения `NUXT_` и `NUXT_PUBLIC_` при запуске, без пересборки, в отличие от `import.meta.env`, который фиксируется при сборке.' }
    ]
  },
  {
    id: 'security-oauth-pkce',
    section: 'security',
    group: 'Авторизация',
    title: 'OAuth 2 с PKCE для SPA',
    level: 'senior',
    summary: 'SPA — публичный клиент и не может хранить client secret. PKCE заменяет его одноразовым секретом на каждую попытку входа: перехваченный `code` без `code_verifier` бесполезен.',
    points: [
      { title: 'Implicit flow устарел — используют Authorization Code + PKCE', text: 'Implicit отдавал токен прямо во фрагменте URL: он попадал в историю, логи, Referer. В Code flow в URL только короткоживущий `code`, а токен выдаётся отдельным запросом.', code: `1. SPA → /authorize?response_type=code&code_challenge=...&state=...
2. Провайдер → redirect_uri?code=abc&state=...
3. SPA → POST /token { code, code_verifier }
4. ← access_token (+ refresh_token)`, lang: 'text' },
      { title: 'PKCE: `code_verifier` остаётся у клиента, наружу уходит его хеш', text: 'Перед редиректом генерируется случайный verifier, в URL идёт `code_challenge` = SHA-256 от него. При обмене кода сервер проверяет, что verifier совпадает. Кто перехватил `code`, verifier не знает.', code: `const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)))
const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
const challenge = base64url(new Uint8Array(hash))
sessionStorage.setItem('pkce_verifier', verifier)
// ...&code_challenge=\${challenge}&code_challenge_method=S256`, lang: 'ts' },
      { title: '`state` защищает от подмены ответа (CSRF на логин)', text: 'Случайное значение сохраняется до редиректа и сверяется при возврате. Без него атакующий подсунет свой `code`, и пользователь окажется залогинен в чужой аккаунт.', code: `if (params.get('state') !== sessionStorage.getItem('oauth_state')) {
  throw new Error('state mismatch')
}`, lang: 'ts' },
      { title: 'Ещё надёжнее — BFF: токены вообще не попадают в браузер', text: 'Обмен кода делает свой сервер (backend for frontend), токены хранит у себя, а браузеру выдаёт `httpOnly`-куку сессии. В Nuxt это естественно делается на серверных маршрутах.' }
    ],
    takeaway: 'Для SPA — Authorization Code + PKCE (S256) + `state`, без client secret; если есть свой сервер — BFF и сессионная кука.',
    questions: [
      { q: 'Зачем нужен PKCE?', a: 'SPA не может хранить client secret: всё в бандле публично. Без секрета перехваченный `code` — через вредоносное расширение, логи или подмену redirect в мобильном приложении — можно обменять на токен. PKCE решает это одноразовым секретом: перед входом клиент генерирует случайный `code_verifier`, отправляет провайдеру только его SHA-256 хеш, а при обмене кода предъявляет сам verifier. Перехватчик `code` verifier не знает, и обмен не пройдёт. Сейчас PKCE рекомендуют для всех клиентов, не только публичных.' },
      { q: 'Почему не стоит использовать implicit flow?', a: 'В implicit flow токен доступа возвращается прямо во фрагменте URL после редиректа. Оттуда он может утечь в историю браузера, в сторонние скрипты на странице, в логи. Нет и возможности привязать выдачу токена к клиенту. Актуальные рекомендации OAuth для браузерных приложений — Authorization Code с PKCE, а ещё лучше — схема BFF, где токены хранит сервер, а браузер работает с сессионной кукой.' }
    ]
  }
);
