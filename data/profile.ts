// Контент главной страницы. Тексты синхронизированы с резюме.

export type Link = { label: string, href: string, internal?: boolean }

export type SketchKind = 'terminal' | 'admin' | 'exchange' | 'cms' | 'kit' | 'tools'

// Кейс в формате «задача → роль → решение → результат»: считывается за несколько секунд.
export type CaseStudy = {
  task: string
  role: string
  decision: string
  result: string
}

export type WorkProject = {
  title: string
  period: string
  stack: string[]
  points: string[] // подробности: на главной под «Подробнее», в /resume целиком
  case?: CaseStudy
  sketch?: SketchKind
  highlights?: string[] // короткие пункты с показателями для /resume и PDF; **…** — выделить жирным
}

export type Job = {
  company: string
  role: string
  period: string
  place: string
  projects?: WorkProject[]
  points?: string[]
  highlights?: string[] // как у проектов: короткие пункты для /resume, **…** — жирным
}

export type PetProject = {
  title: string
  kind: string
  description: string
  stack: string[]
  links: Link[]
  note?: string
}

export const siteUrl = 'https://andryushov.me'

export const contacts = {
  email: 'webdozerz@gmail.com',
  telegram: 'https://t.me/web_dev_ill',
  telegramHandle: '@web_dev_ill',
  github: 'https://github.com/webdozerz',
  linkedin: 'https://www.linkedin.com/in/web-dev-ill/',
}

export const profile = {
  firstName: 'Илья',
  lastName: 'Андрюшов',
  role: 'Frontend-разработчик',
  grade: 'Middle+',
  city: 'Томск',
  stackLine: 'Vue 3 · Nuxt · TypeScript',
  lead: 'Последние годы — торговые терминалы криптобирж, финансовые админ-панели, многоязычные SSR-сайты и Telegram Mini Apps.',
  leadIntro: 'Беру сложный фронтенд целиком: от архитектуры и UI-кита до интеграции с API и realtime-данными.',
  focusLabel: 'Среди проектов:',
  focus: ['торговые терминалы криптобирж', 'финансовые админ-панели', 'многоязычные SSR-сайты', 'Telegram Mini Apps'],
  about: 'В проектах отвечаю за стартовый шаблон, UI-кит, слой API с генерацией типов, realtime на WebSocket, тесты и CI. Выстроил в команде AI-assisted разработку на Claude Code и Cursor. Менторю новых разработчиков и планирую работу на проекте.',
}

export const stats = [
  { value: '7+', label: 'лет в коммерческой разработке' },
  { value: '1M+', label: 'пользователей Telegram Mini Apps' },
  { value: '5+', label: 'криптобирж в портфолио' },
  { value: '4', label: 'коммерческих проекта на моём Starter Kit' },
]

export const jobs: Job[] = [
  {
    company: 'Криптон Студио',
    role: 'Frontend-разработчик (Middle+)',
    period: '01.2022 — сейчас',
    place: 'Томск',
    projects: [
      {
        title: 'Криптобиржа, клиентская платформа',
        period: '2026',
        stack: ['Vue 3', 'TypeScript', 'Pinia', 'TanStack Query', 'Socket.IO', 'PrimeVue 4', 'TradingView', 'Dockview'],
        highlights: [
          'Вёл фронтенд торговой платформы: автор **82%** коммитов в кодовой базе на **90 тыс.** строк',
          'Собрал Pro-терминал из перетаскиваемых панелей на Dockview и отдельный мобильный терминал',
          'Подключил TradingView и стакан в реальном времени через **3** канала Socket.IO',
          'Реализовал **4** типа ордеров (Limit, Market, Stop-Limit, OCO) с точной арифметикой BigNumber',
          'Разработал UI-кит из **31** компонента; интерфейс на **2** языках с RTL, KYC/KYB через Sumsub',
        ],
        sketch: 'terminal',
        case: {
          task: 'Торговая платформа спотовой биржи: простой режим для новичков и профессиональный терминал для трейдеров.',
          role: 'Основной фронтенд-разработчик: UI-кит, терминал, кошелёк, безопасность аккаунта.',
          decision: 'Терминал из перетаскиваемых панелей на Dockview с сохранением раскладок; стакан, сделки и график TradingView живут на трёх каналах Socket.IO; суммы ордеров считаются на BigNumber без ошибок округления.',
          result: 'Pro- и Lite-режимы, мобильный терминал, четыре типа ордеров, KYC/KYB и фиатные платежи в одном интерфейсе на двух языках с RTL.',
        },
        points: [
          'Основной фронтенд-разработчик: 82% коммитов в проекте на 90 тыс. строк кода.',
          'Собрал Pro-версию торгового терминала на Dockview: перетаскиваемые панели (стакан, график, форма ордера, сделки), сохранение раскладок, тёмная тема и отдельный мобильный терминал.',
          'Подключил TradingView Charting Library со своим datafeed по WebSocket и синхронизировал стакан в реальном времени.',
          'Реализовал фиатные и крипто-депозиты и выводы (IBAN, SWIFT, Travel Rule), KYC/KYB через Sumsub, вход через Google с 2FA.',
          'Разработал UI-кит из 31 компонента поверх PrimeVue на дизайн-токенах; интерфейс на английском и арабском с поддержкой RTL.',
        ],
      },
      {
        title: 'Криптобиржа, админ-панель',
        period: '2026',
        stack: ['Vue 3', 'TypeScript', 'TanStack Query', 'ECharts', 'Vitest'],
        highlights: [
          'Разработал дашборд, модули AML, политик и финансов в панели на **95** разделов',
          'Разбил прогон **~3 100** автотестов в CI на **3** параллельных потока и добавил проверку типов',
          'Ввёл подтверждение опасных действий администратора через 2FA',
        ],
        sketch: 'admin',
        case: {
          task: 'Back-office биржи для операционистов, AML и финансов: проверка заявок, риски, комиссии, политики.',
          role: 'Основной разработчик дашборда, модулей AML, политик и финансов; настроил CI.',
          decision: 'Опасные действия администратора подтверждаются через 2FA с указанием причины; таблицы обновляются в реальном времени, но не перерисовываются без изменений и не опрашивают сервер в фоновой вкладке.',
          result: '95 разделов и около 3 100 автотестов; CI прогоняет их в трёх параллельных потоках и проверяет типы до мержа.',
        },
        points: [
          'Основной разработчик: 68% коммитов в проекте на 95 маршрутов и около 3 100 автотестов.',
          'Сделал подтверждение чувствительных действий администратора через 2FA и автообновление таблиц без лишних перерисовок, с учётом видимости вкладки.',
          'Настроил CI: тесты в 3 параллельных шардах, проверка типов, pre-push хук с тестами по изменённым файлам.',
        ],
      },
      {
        title: 'Криптообменник',
        period: '11.2025 — 02.2026',
        stack: ['Vue 3', 'vite-ssg', 'Pinia', 'TanStack Query', 'Socket.IO'],
        highlights: [
          'Сделал с нуля за **4 месяца** клиентскую часть и админ-панель: автор **90%** коммитов',
          'Реализовал обмен с фиксацией курса и таймером, статусы заказа по WebSocket, **3** языка',
        ],
        sketch: 'exchange',
        case: {
          task: 'Сервис мгновенного обмена криптовалюты и фиата с админ-панелью — с нуля.',
          role: 'Ведущий фронтенд-разработчик: клиентская часть и вся админка.',
          decision: 'Курс фиксируется на время сделки с таймером и предупреждением при изменении; статус заказа приходит по WebSocket; лендинг пререндерится для поиска.',
          result: 'От пустого репозитория до клиентской части и админ-панели за 4 месяца; три языка, включая арабский.',
        },
        points: [
          'Ведущий фронтенд-разработчик (90% коммитов): клиентская часть и админ-панель с нуля за 4 месяца.',
          'Лендинг с пререндером, виджет обмена с фиксацией курса, пошаговый обмен со статусами заказа по WebSocket.',
          'Авторизация с 2FA (TOTP, email) и обновлением токенов, KYC через Sumsub, история операций с фильтрами и экспортом.',
        ],
      },
      {
        title: 'Сайт международного брокера',
        period: '07 — 09.2026',
        stack: ['Nuxt 4', 'SSR', 'TypeScript', 'Payload CMS', 'TanStack Query', 'vue-i18n'],
        highlights: [
          'Заложил проект на Nuxt 4 и стал основным автором фронтенда: **~60%** коммитов в команде',
          'Собрал библиотеку из **38** секций; контент, SEO и аналитика управляются из CMS',
          'Поддержал **15** языков с RTL; развернул китайскую и британскую версии за **1–2 дня** каждую',
        ],
        sketch: 'cms',
        case: {
          task: 'Новый сайт международного Forex/CFD-брокера на 15 языках, контент которого ведёт маркетинг через headless CMS.',
          role: 'Заложил проект и стал основным автором фронтенда в команде.',
          decision: 'Страницы собираются из 38 переиспользуемых секций, а контент, SEO-мета и аналитика приходят из CMS; типы API генерируются из OpenAPI.',
          result: 'Маркетинг меняет страницы без разработчиков; китайская и британская версии сайта развёрнуты за 1–2 дня каждая.',
        },
        points: [
          'Развернул проект на базе Starter Kit и перевёл на Nuxt 4; основной автор в команде (около 60% коммитов).',
          'Собрал библиотеку из 38 переиспользуемых секций.',
          'Построил интеграцию с CMS: контент, SEO-мета (canonical, hreflang, Open Graph) и Google Analytics управляются из CMS; 15 языков, включая арабский и фарси (RTL).',
          'Сделал слой API с генерацией типов из OpenAPI и ленту котировок по WebSocket с автопереподключением.',
        ],
      },
      {
        title: 'Starter Kit компании',
        period: '10.2025 — 07.2026',
        stack: ['Vue 3', 'Vite', 'PrimeVue 4', 'TanStack Query', 'Docker'],
        highlights: [
          'Написал **82%** шаблона: UI-компоненты, API-слой с генерацией типов, Docker, релизы',
          'Запустил на шаблоне **4** коммерческих проекта',
          'Описал соглашения в **16** документах и скиллах для AI-агентов',
        ],
        sketch: 'kit',
        case: {
          task: 'Чтобы каждый новый проект студии не начинался с нуля и не изобретал архитектуру заново.',
          role: 'Автор большей части шаблона, соглашений и документации.',
          decision: 'Готовые UI-компоненты, API-слой с генерацией типов, авторизация и релизы из коробки; Docker-образ получает конфиг при старте — одна сборка на все окружения; правила и скиллы для AI-агентов.',
          result: 'На шаблоне запущены 4 коммерческих проекта — каждый стартовал с готовой архитектурой, CI и единым стилем кода.',
        },
        points: [
          'Автор 82% коммитов: базовые UI-компоненты, слой API с генерацией типов из OpenAPI, авторизация, валидация, i18n, тема и типографика.',
          'Docker-образ с nginx, который получает конфиг при старте: одна сборка для всех окружений. Conventional commits, husky, проверка типов перед коммитом, автоматический changelog.',
          '16 документов с соглашениями и скиллы для AI-агентов: вёрстка из Figma, подключение страницы к API, changelog.',
          'На шаблоне запущены 4 коммерческих проекта, включая все перечисленные выше.',
        ],
      },
      {
        title: 'AI-assisted разработка и внутренние инструменты',
        period: '2025 — 2026',
        stack: ['Claude Code', 'Cursor', 'LLM API', 'Python', 'aiogram', 'PostgreSQL'],
        highlights: [
          'Внедрил Claude Code и Cursor в команду: правила и скиллы во всех проектах',
          'Сделал Chrome-расширение Confluence → Jira на LLM и расширение Jira для VS Code',
          'Написал Telegram-боты: согласование отпусков (PostgreSQL, **64** теста, Jira) и заказы еды (**10** парсеров)',
        ],
        sketch: 'tools',
        case: {
          task: 'Убрать рутину в команде: перенос ТЗ в задачи, работа с Jira, согласования.',
          role: 'Инициатор и автор инструментов.',
          decision: 'Claude Code и Cursor со скиллами в каждом проекте; Chrome-расширение превращает страницу Confluence в задачи Jira через LLM; Jira прямо в VS Code; Telegram-боты для отпусков и обедов.',
          result: 'ТЗ из Confluence раскладывается на эпики и задачи за один клик; отпуска согласуются в Telegram и сами попадают в Jira.',
        },
        points: [
          'Внедрил Claude Code и Cursor в работу команды: CLAUDE.md, AGENTS.md, правила и скиллы во всех проектах на Starter Kit.',
          'Chrome-расширение, которое превращает ТЗ из Confluence в эпики, истории и задачи Jira через LLM.',
          'Telegram-бот согласования отпусков на Python: роли от сотрудника до HR, заявки создают задачи в Jira, 64 теста.',
          'Telegram-бот командных заказов еды: 10 парсеров меню, общая корзина, деление стоимости доставки.',
        ],
      },
      {
        title: 'Ранние проекты',
        period: '2022 — 2025',
        stack: ['Vue 2', 'Nuxt', 'TypeScript', 'Telegram Mini Apps'],
        highlights: [
          'Делал Telegram Mini Apps с аудиторией **1M+** пользователей',
          'Участвовал в разработке **5+** криптовалютных бирж',
          'Перевёл проект с Vue 2 на Nuxt и TypeScript',
          'Сократил время загрузки на **40%**',
          'Менторил новых сотрудников; планировал и распределял задачи, отчитывался по проектам',
        ],
        points: [
          'Telegram Mini Apps с аудиторией более 1 млн пользователей.',
          'Участие в разработке более 5 криптовалютных бирж.',
          'Миграция проекта с Vue 2 на Nuxt и TypeScript.',
          'Оптимизация производительности: время загрузки сократилось на 40%.',
          'Менторинг новых сотрудников; планирование, распределение задач, контроль и отчётность по проектам.',
        ],
      },
    ],
  },
  {
    company: 'Astana Prom Design',
    role: 'Frontend-разработчик',
    period: '01.2020 — 01.2022',
    place: 'Астана',
    highlights: [
      'Разрабатывал веб-приложения по заказам партнёров и агентств',
      'Вместе с backend-разработчиками проектировал и интегрировал API',
      'Сделал адаптивную версию корпоративного сайта; трафик вырос на **30%**',
    ],
    points: [
      'Разрабатывал веб-приложения по заказам партнёров и агентств.',
      'Вместе с backend-разработчиками проектировал и интегрировал API.',
      'Сделал адаптивную версию корпоративного сайта; трафик вырос на 30%.',
    ],
  },
]

export const petProjects: PetProject[] = [
  {
    title: 'vue-indexdb-sync',
    kind: 'npm-пакет',
    description: 'Плагин для Vue 3 и Pinia: хранит данные в IndexedDB офлайн и синхронизирует очередь с повторами, когда сеть возвращается.',
    stack: ['Vue 3', 'Pinia', 'IndexedDB', 'Vitest'],
    links: [
      { label: 'npm', href: 'https://www.npmjs.com/package/vue-indexdb-sync' },
      { label: 'GitHub', href: 'https://github.com/webdozerz/vue-indexdb' },
    ],
  },
  {
    title: 'Jira для VS Code',
    kind: 'Расширение VS Code',
    description: 'Задачи Jira Data Center прямо в редакторе: дерево по статусам и спринтам, комментарии, ворклоги, смена статуса и ветка из задачи.',
    stack: ['TypeScript', 'VS Code API', 'esbuild', 'Vitest'],
    links: [{ label: 'GitHub', href: 'https://github.com/webdozerz/jira-vscode' }],
  },
  {
    title: 'Confluence → Jira AI',
    kind: 'Chrome-расширение',
    description: 'Превращает ТЗ из Confluence в эпики, истории и задачи Jira: LLM разбирает страницу и возвращает план задач в JSON.',
    stack: ['Manifest V3', 'LLM API', 'Jira REST'],
    links: [],
    note: 'Внутренний инструмент',
  },
  {
    title: 'PetHub',
    kind: 'Telegram Mini App',
    description: 'Каталог пет-проектов разработчиков с оценками, комментариями и админкой. Вход через Telegram с проверкой подписи.',
    stack: ['Vue 3', 'Firebase', 'Vercel Functions'],
    links: [{ label: '@petpjhub_bot', href: 'https://t.me/petpjhub_bot' }],
  },
  {
    title: 'MindBalance',
    kind: 'Telegram Mini App',
    description: 'Техники саморегуляции при тревоге и стрессе с историей прогресса.',
    stack: ['Vue 3', 'Firebase', 'motion-v'],
    links: [{ label: '@psy_peas_bot', href: 'https://t.me/psy_peas_bot' }],
  },
  {
    title: 'Калькулятор трудозатрат',
    kind: 'Инструмент',
    description: 'Оценка фронтенд-задач с коэффициентами сложности и рисков. Умеет создавать задачи в Jira.',
    stack: ['Nuxt', 'TypeScript'],
    links: [{ label: 'Открыть', href: '/effort', internal: true }],
  },
]

export const skills = [
  { area: 'Языки', items: 'TypeScript, JavaScript, HTML, CSS, SCSS; Python для ботов и автоматизации' },
  { area: 'Фреймворки', items: 'Vue 3, Nuxt 3/4 (SSR, SSG), Vue 2, Pinia, Vue Router, TanStack Query, VueUse; React — базово' },
  { area: 'UI', items: 'PrimeVue 4, дизайн-токены, адаптивная вёрстка, RTL, Tailwind CSS, Figma' },
  { area: 'Данные и realtime', items: 'REST, OpenAPI с генерацией типов, WebSocket, Socket.IO, headless CMS, Firebase' },
  { area: 'Финтех', items: 'TradingView Charting Library, Sumsub (KYC/KYB), 2FA, ролевой доступ, BigNumber' },
  { area: 'Качество', items: 'Vitest, Vue Test Utils, Jest, ESLint, husky, commitlint' },
  { area: 'Сборка и деплой', items: 'Vite, Docker, nginx, GitHub Actions, SonarQube' },
  { area: 'AI-инструменты', items: 'Claude Code, Cursor, MCP, LLM API' },
  { area: 'Процессы', items: 'Jira, Confluence, code review, менторинг, планирование' },
]

export const education = {
  place: 'Томский политехнический университет',
  degree: 'Прикладная математика и информатика, бакалавр',
  period: '2016 — 2020',
}
