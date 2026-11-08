// Концепт редизайна zdrava22.ru — пасека «Ширяев и сыновья», пос. Прудской, Алтайский край.
// Данные сняты с сайта 08.11.2026: цены — со страницы «Прайс на мед» (/prajs-na-med) и страниц «в розницу» / «в куботейнере».
// Фото товаров и галерей — по адресам оригинала (https). В репозитории только то, чего на сайте нет отдельным файлом:
// фото Алексея с первого экрана и постер видео (на сайте зашиты base64 в HTML), логотип с вырезанным фоном,
// и несколько снимков галереи, ужатых с 900–5184 px до 900 px (оригиналы медоносов весят по 7–10 МБ).

export const ZD_BASE = '/redesign/zdrava22'
export const zdPath = (p = '/') => `${ZD_BASE}${p === '/' ? '/' : p}`
export const zdImg = (name: string) => `${ZD_BASE}/img/${name}`
const SITE = 'https://zdrava22.ru'
export const zdOrig = (p = '/') => `${SITE}${p.startsWith('/') ? p : `/${p}`}`
const thumb = (file: string) => `${SITE}/assets/components/phpthumbof/cache/${file}`

export const zdMoney = (n: number) => `${Math.round(n).toLocaleString('ru-RU')} ₽`
export const zdKg = (n: number) => `${n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} кг`

export const zdContacts = {
  original: 'https://zdrava22.ru/',
  logo: zdImg('logo.png'),
  phone: '8 (903) 990-88-77',
  tel: '+79039908877',
  owner: 'Алексей Васильевич Ширяев',
  phone2: '8 (961) 980-96-59',
  tel2: '+79619809659',
  owner2: 'Марина Васильевна Ширяева',
  email: 'shiryaevmed@yandex.ru',
  address: 'Алтайский край, Калманский район, пос. Прудской, ул. Центральная, 20',
  addressShort: 'пос. Прудской, Алтайский край',
  legal: 'ИП Ширяев Алексей Васильевич, ИНН 222505339213',
  slogan: 'Алтайский мёд с пасеки «Ширяев и сыновья»',
  motto: 'Критерий нашей работы – Ваше доверие',
  highlight: 'Алтайский мёд натуральный напрямую от производителя',
  season: 'Если Вы хотите заказать продукцию с апреля по ноябрь, то лучше всего это сделать по телефону, так как в это время мы находимся на пасеке и нет возможности ежедневно проверять электронную почту.',
  city: 'При заказе обязательно укажите свой город, чтобы мы не позвонили Вам ночью, в связи с тем, что можем находиться в разных часовых поясах.',
  sorry: 'Заранее прошу извинить меня, если вдруг мой телефон окажется временно недоступен из-за плохой связи в тех местах, где мы держим пчел. Я обязательно всем перезвоню сразу, как только появится связь!',
  map: 'https://yandex.ru/maps/?text=%D0%90%D0%BB%D1%82%D0%B0%D0%B9%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BA%D1%80%D0%B0%D0%B9%2C%20%D0%BF%D0%BE%D1%81%D1%91%D0%BB%D0%BE%D0%BA%20%D0%9F%D1%80%D1%83%D0%B4%D1%81%D0%BA%D0%BE%D0%B9',
}

// ---------- Мёд: 5 сортов, розница коробкой и опт куботейнером ----------
export type ZdTier = 'r' | 'o'
export const zdTare = {
  r: {
    label: 'Розница',
    unit: 'коробка',
    units: ['коробка', 'коробки', 'коробок'] as [string, string, string],
    kg: 12,
    what: 'коробка: 4 ведёрка по 3 кг',
    from: 4,
    fromText: 'от 4 коробок (48 кг)',
    img: `${SITE}/assets/images/uploads/2018/03/2-2.jpg`,
    facts: ['Ведёрки по 3 кг, в коробке 4 штуки — 12 кг', 'Двойная упаковка, груз страхуем', 'От 4 коробок — по мелкооптовой цене'],
  },
  o: {
    label: 'Опт',
    unit: 'куботейнер',
    units: ['куботейнер', 'куботейнера', 'куботейнеров'] as [string, string, string],
    kg: 34,
    what: 'куботейнер 34 кг',
    from: 6,
    fromText: 'от 6 куботейнеров (204 кг)',
    img: `${SITE}/assets/images/smimg/12-1.jpg`,
    facts: ['Вес во всех куботейнерах одинаковый — 34 кг, фактически на 50–500 г больше', 'Куботейнеры новые, стоимость тары не берём', 'От 6 куботейнеров — скидка'],
  },
}

export interface ZdSort {
  id: string
  title: string
  name: string
  tone: string
  rare: boolean
  note: string
  text: string[]
  r: [number, number]
  o: [number, number]
  url: string
}

// От светлого к тёмному. Описания — сжатые факты со страниц сортов оригинала.
export const zdSorts: ZdSort[] = [
  {
    id: 'akacievyj',
    title: 'Акациевый мёд',
    name: 'Акациевый',
    tone: '#f2df96',
    rare: true,
    note: 'С жёлтой акации — караганы, что растёт по склонам у нашей горной пасеки',
    text: [
      'Акациевый мёд относится к редким видам. На Алтае растёт только жёлтая акация — карагана древовидная.',
      'Возле нашей горной пасеки в Чарышском районе карагана растёт дикими зарослями на склонах и по берегам речек и ручьёв.',
    ],
    r: [800, 700],
    o: [600, 500],
    url: '/akaczievyij-med',
  },
  {
    id: 'dyagilevyj',
    title: 'Дягилевый мёд',
    name: 'Дягилевый',
    tone: '#e6c35c',
    rare: true,
    note: 'Дягиль цветёт у горной пасеки с середины июня до середины июля',
    text: [
      'Дягиль — один из лучших медоносов из семейства зонтичных, многолетнее растение с сильным запахом.',
      'Вокруг нашей горной пасеки в Чарышском районе дягиль цветёт с середины июня до середины июля — медосбор длится почти месяц. В хорошую погоду с одного улья за сутки получаем около 6 кг дягилевого мёда.',
    ],
    r: [800, 700],
    o: [600, 500],
    url: '/dyagilevyij-med',
  },
  {
    id: 'gornyj',
    title: 'Горный мёд',
    name: 'Горный',
    tone: '#d7a13f',
    rare: true,
    note: 'Разнотравье: нектар сотен растений, пасека на высоте 620 м',
    text: [
      'Горный мёд — визитная карточка Алтая. Он полифлорный, разнотравный: в нём нектар множества медоносных растений.',
      'Наша пасека в Чарышском районе стоит в долине речки Солоновка на высоте 620 м, вокруг — холмы и горы до 1500 м. По цвету чарышский горный мёд — от светло-жёлтого с зеленоватым оттенком до светло-коричневого, кристаллизуется медленно, иногда остаётся жидким больше года.',
    ],
    r: [800, 700],
    o: [600, 500],
    url: '/gornyij-med',
  },
  {
    id: 'grechishnyj',
    title: 'Гречишный мёд',
    name: 'Гречишный',
    tone: '#8c4a1c',
    rare: false,
    note: 'С пасеки в Калманском районе, у самых посевов гречихи',
    text: [
      'Алтайский край — лидер по выращиванию гречихи в России, здесь собирают около 70 % гречишного мёда страны.',
      'Пасеку в Калманском районе, примерно в 50 км от Барнаула, делим на два-три точка в трёх километрах друг от друга — как можно ближе к посевам гречихи. Для качества мёда сами подсаживаем фацелию и эспарцет.',
    ],
    r: [500, 400],
    o: [250, 200],
    url: '/grechishnyij-med',
  },
  {
    id: 'molochaevyj',
    title: 'Молочаевый мёд',
    name: 'Молочаевый',
    tone: '#5b2814',
    rare: true,
    note: 'Почти чёрный, с красноватым отливом и терпким чайным привкусом',
    text: [
      'Молочаевый мёд — редкий вид степного мёда. На Алтае молочай цветёт с начала мая до сентября.',
      'Мёд получается сиропообразный, насыщенного коричневого, почти чёрного цвета с красноватым отливом, с горьковато-терпким чайным привкусом. Похож на каштановый, но гораздо приятнее.',
    ],
    r: [800, 700],
    o: [600, 500],
    url: '/molochaevyij-med',
  },
]
export const zdSort = (id: string) => zdSorts.find((s) => s.id === id)
export const zdPerKg = (s: ZdSort, t: ZdTier, n: number) => (n >= zdTare[t].from ? s[t][1] : s[t][0])
export const zdPlural = (n: number, f: [string, string, string]) => {
  const a = Math.abs(n) % 100
  const b = a % 10
  if (a > 10 && a < 20) return f[2]
  if (b > 1 && b < 5) return f[1]
  if (b === 1) return f[0]
  return f[2]
}

// ---------- Продукты пчеловодства и пчелопакеты ----------
export interface ZdItem {
  id: string
  title: string
  name: string
  group: 'bee' | 'pack'
  price: number
  per: string
  unit: 'кг' | 'шт' | 'флакон'
  step: number
  min: number
  bulk: { from: number; price: number } | null
  img: string
  note: string
  text: string[]
  url: string
}

export const zdItems: ZdItem[] = [
  {
    id: 'pylca',
    title: 'Цветочная пыльца (обножка)',
    name: 'Цветочная пыльца',
    group: 'bee',
    price: 3000,
    per: 'кг',
    unit: 'кг',
    step: 0.5,
    min: 0.5,
    bulk: { from: 10, price: 1000 },
    img: thumb('pilca.1f7fa128783dba1ee05ecc5da787ee68.jpg'),
    note: 'Собираем с начала мая внешними пыльцесборниками',
    text: [
      'Пыльцу, которую собирают пчёлы, называют пчелиной обножкой. В ней белки, углеводы, аминокислоты, ферменты, микроэлементы и витамины.',
      'На своей пасеке ставим стандартные внешние пыльцесборники. Пыльцу собираем с начала мая и не оставляем в пыльцесборниках на ночь, затем сушим до влажности по стандарту.',
    ],
    url: '/cvetochnaya-pylca-obnozhka',
  },
  {
    id: 'perga',
    title: 'Перга (пчелиный хлеб)',
    name: 'Перга',
    group: 'bee',
    price: 5000,
    per: 'кг',
    unit: 'кг',
    step: 0.05,
    min: 0.05,
    bulk: { from: 10, price: 3000 },
    img: thumb('perga.1f7fa128783dba1ee05ecc5da787ee68.jpg'),
    note: 'Пчелиный хлеб со своей пасеки, можно от\u00a050\u00a0г',
    text: ['Перга — пыльца, которую пчёлы сложили в соты и законсервировали мёдом. Её называют пчелиным хлебом.', 'Для розничных покупателей пергу, как и пыльцу, отправляем в пластиковых банках.'],
    url: '/perga-pchelinyj-xleb',
  },
  {
    id: 'propolis',
    title: 'Прополис, 10 % настойка',
    name: 'Прополис',
    group: 'bee',
    price: 300,
    per: 'флакон 100 мл',
    unit: 'флакон',
    step: 1,
    min: 1,
    bulk: null,
    img: thumb('46.6e9bab2e02ce770e6121f14c6d55a186.jpg'),
    note: 'Настойка 10 %, флакон 100 мл',
    text: ['Прополис — пчелиный клей, которым пчёлы заделывают щели в улье. Делаем 10-процентную настойку и разливаем во флаконы по 100 мл.'],
    url: '/kupit-propolis-ceny',
  },
  {
    id: 'gomogenat-nativnyj',
    title: 'Трутневый гомогенат нативный',
    name: 'Гомогенат нативный',
    group: 'bee',
    price: 20000,
    per: 'кг',
    unit: 'кг',
    step: 0.05,
    min: 0.05,
    bulk: { from: 10, price: 12000 },
    img: thumb('672.6e9bab2e02ce770e6121f14c6d55a186.jpg'),
    note: 'Выжимка трутневых личинок — натуральный белок',
    text: ['Трутневый гомогенат — выжимка личинок трутней, ценный источник натурального и легко усваиваемого белка.', 'Нативный — без добавок, хранится замороженным.'],
    url: '/trutnevyij-gomogenat-nativnyij',
  },
  {
    id: 'gomogenat-adsorbirovannyj',
    title: 'Трутневый гомогенат адсорбированный',
    name: 'Гомогенат адсорбированный',
    group: 'bee',
    price: 10000,
    per: 'кг',
    unit: 'кг',
    step: 0.05,
    min: 0.05,
    bulk: { from: 10, price: 7000 },
    img: thumb('70.6e9bab2e02ce770e6121f14c6d55a186.jpg'),
    note: 'Трутневый гомогенат в сухом виде',
    text: ['Тот же трутневый гомогенат, но в сухом виде — его удобнее хранить и перевозить.'],
    url: '/trutnevyij-gomogenat-adsorbirovannyij',
  },
  {
    id: 'vosk',
    title: 'Воск пчелиный',
    name: 'Воск',
    group: 'bee',
    price: 700,
    per: 'кг',
    unit: 'кг',
    step: 1,
    min: 1,
    bulk: null,
    img: thumb('pchel_vosk.14e0a348b88a5e7ca3d12fc9d5b842b0.jpg'),
    note: 'Пчелиный воск со своей пасеки',
    text: ['Натуральный пчелиный воск со своей пасеки, слитками.'],
    url: '/vosk-pchelinyij',
  },
  {
    id: 'pchelopakety',
    title: 'Пчелопакеты',
    name: 'Пчелопакеты',
    group: 'pack',
    price: 7000,
    per: 'шт',
    unit: 'шт',
    step: 1,
    min: 1,
    bulk: null,
    img: thumb('637.14e0a348b88a5e7ca3d12fc9d5b842b0.jpg'),
    note: 'Для пчеловодов: сроки и количество — по телефону',
    text: ['Пчелопакеты с нашей пасеки для пчеловодов. Цена — 7 000 ₽ за пакет, сроки отправки и количество обсуждаем по телефону.'],
    url: '/pchelopaketyi',
  },
]
export const zdItem = (id: string) => zdItems.find((i) => i.id === id)
export const zdItemPrice = (i: ZdItem, q: number) => (i.bulk && q >= i.bulk.from ? i.bulk.price : i.price)

// Выделенный жёлтый блок оригинала — 7 ссылок его словами
export const zdHighlight = [
  { label: 'Мёд в розницу', to: zdPath('/produkciya') + '?t=r#med', price: 'коробка 12 кг, от 500 ₽/кг', tier: 'r' as ZdTier },
  { label: 'Мёд оптом', to: zdPath('/produkciya') + '?t=o#med', price: 'куботейнер 34 кг, от 250 ₽/кг', tier: 'o' as ZdTier },
  { label: 'Цветочная пыльца', to: zdPath('/produkt/pylca'), price: '3 000 ₽/кг' },
  { label: 'Перга', to: zdPath('/produkt/perga'), price: '5 000 ₽/кг' },
  { label: 'Прополис', to: zdPath('/produkt/propolis'), price: '300 ₽ флакон' },
  { label: 'Трутневый гомогенат нативный', to: zdPath('/produkt/gomogenat-nativnyj'), price: '20 000 ₽/кг' },
  { label: 'Трутневый гомогенат адсорбированный', to: zdPath('/produkt/gomogenat-adsorbirovannyj'), price: '10 000 ₽/кг' },
]

// Меню оригинала: 8 пунктов, 5 с подменю
export interface ZdNav {
  label: string
  to: string
  sub?: { label: string; to: string }[]
}
export const zdNav: ZdNav[] = [
  {
    label: 'Продукция',
    to: zdPath('/produkciya'),
    sub: [
      { label: 'Алтайский мёд в розницу', to: zdPath('/produkciya') + '?t=r#med' },
      { label: 'Мёд оптом', to: zdPath('/produkciya') + '?t=o#med' },
      { label: 'Редкие виды мёда', to: zdPath('/produkciya') + '#redkie' },
      { label: 'Цветочная пыльца', to: zdPath('/produkt/pylca') },
      { label: 'Перга', to: zdPath('/produkt/perga') },
      { label: 'Прополис', to: zdPath('/produkt/propolis') },
      { label: 'Трутневый гомогенат нативный', to: zdPath('/produkt/gomogenat-nativnyj') },
      { label: 'Трутневый гомогенат адсорбированный', to: zdPath('/produkt/gomogenat-adsorbirovannyj') },
      { label: 'Воск пчелиный', to: zdPath('/produkt/vosk') },
      { label: 'Пчелопакеты', to: zdPath('/produkt/pchelopakety') },
      { label: 'Прайс на мёд', to: zdPath('/produkciya') + '#prajs' },
    ],
  },
  {
    label: 'О нас',
    to: zdPath('/o-nas'),
    sub: [
      { label: 'Сертификаты', to: zdPath('/o-nas') + '#sertifikaty' },
      { label: 'Наши достижения', to: zdPath('/o-nas') + '#dostizheniya' },
      { label: 'Наши медоносы', to: zdPath('/o-nas') + '#medonosy' },
      { label: 'Наши гости', to: zdPath('/o-nas') + '#gosti' },
      { label: 'Материальная база', to: zdPath('/o-nas') + '#baza' },
      { label: 'Технология производства', to: zdPath('/o-nas') + '#tehnologiya' },
      { label: 'Месторасположение', to: zdPath('/o-nas') + '#gde' },
    ],
  },
  { label: 'Видео', to: zdPath('/video') },
  {
    label: 'Фото',
    to: zdPath('/foto'),
    sub: [
      { label: 'Наша пасека', to: zdPath('/foto') + '?g=paseka' },
      { label: 'Фото Алтая', to: zdPath('/foto') + '?g=altai' },
      { label: 'Медоносы', to: zdPath('/foto') + '?g=medonosy' },
      { label: 'Дневник пчеловода', to: zdPath('/foto') + '#dnevnik' },
    ],
  },
  {
    label: 'Блог',
    to: zdPath('/blog'),
    sub: [
      { label: 'Вопрос — ответ', to: zdPath('/blog') + '?r=vopros' },
      { label: 'Статьи', to: zdPath('/blog') + '?r=stati' },
      { label: 'Апитерапия', to: zdPath('/blog') + '?r=apiterapiya' },
      { label: 'Технология', to: zdPath('/blog') + '?r=tehnologiya' },
      { label: 'Личное мнение', to: zdPath('/blog') + '?r=mnenie' },
      { label: 'Новости', to: zdPath('/blog') + '?r=novosti' },
    ],
  },
  {
    label: 'Партнёры',
    to: zdPath('/partnery'),
    sub: [
      { label: 'Бийск', to: zdPath('/partnery') + '#bijsk' },
      { label: 'Екатеринбург', to: zdPath('/partnery') + '#ekaterinburg' },
      { label: 'Москва', to: zdPath('/partnery') + '#moskva' },
      { label: 'Омск', to: zdPath('/partnery') + '#omsk' },
      { label: 'Анапа', to: zdPath('/partnery') + '#anapa' },
    ],
  },
  { label: 'Отзывы', to: zdPath('/otzyvy') },
  { label: 'Контакты', to: zdPath('/kontakty') },
]

// ---------- Партнёры ----------
export const zdPartners = [
  { id: 'bijsk', city: 'Бийск', name: 'Савин Виталий Сергеевич', phone: '8 (913) 268-57-27', tel: '+79132685727', url: '/partner-iz-bijska/' },
  { id: 'ekaterinburg', city: 'Екатеринбург', name: 'Копасов Андрей Николаевич', phone: '8 (912) 626-33-73', tel: '+79126263373', url: '/partner-iz-ekaterinburga/' },
  { id: 'moskva', city: 'Москва', name: 'Сергачева Светлана Геннадьевна', phone: '8 (916) 212-34-88', tel: '+79162123488', url: '/partner-iz-g.moskva-svetlana' },
  { id: 'omsk', city: 'Омск', name: 'Корнейчук Дарья Викторовна', phone: '8 (999) 454-47-58', tel: '+79994544758', url: '/partner-iz-omska/' },
  { id: 'omsk-2', city: 'Омск', name: 'Юлия Игоревна', phone: '8 (900) 675-47-29', tel: '+79006754729', url: '/partner-iz-omska-yuliya/' },
  { id: 'anapa', city: 'Анапа', name: '', phone: '', tel: '', url: '/partner-iz-anapyi' },
]

// ---------- Доставка, оплата, порядок заказа (цитаты со страницы «Контакты») ----------
export const zdDelivery = [
  'Доставку товара мы осуществляем в любой город России транспортными компаниями «ПЭК», «Деловые линии», «Желдорэкспедиция», «Кашалот» (ранее «КИТ»), «ВОЗОВОЗ», «СДЕК» и др.',
  'В те небольшие города, в которых нет терминалов транспортных компаний, мы осуществляем доставку Почтой России.',
  'За доставку товара Вы рассчитываетесь при его получении с транспортной компанией. Доставка до подъезда — дороже.',
  'Мы всегда страхуем отправляемый Вам товар. При получении проверьте целостность груза.',
]
export const zdTk = ['ПЭК', 'Деловые линии', 'Желдорэкспедиция', 'Кашалот', 'ВОЗОВОЗ', 'СДЭК', 'Почта России']
export const zdPayment = [
  'Мы работаем по 100% предоплате за товар. С постоянными проверенными покупателями работаем на индивидуальных условиях.',
  'Оплата по реквизитам ИП: в Сбербанк Онлайн — «Платежи» → «Оплата по реквизитам», назначение «За мед». Реквизиты пришлём вместе с подтверждением заказа.',
]
export const zdSteps = [
  { icon: 'phone', title: 'Позвоните, напишите СМС или письмо', text: `Звоните ${'8 (903) 990-88-77'} или оставьте номер — перезвоним.` },
  { icon: 'list', title: 'Назовите товар и количество', text: 'Например: мёд 2 коробки, перга 150 г, прополис 1 флакон, трутневый гомогенат 200 г, пыльца 2,5 кг.' },
  { icon: 'pin', title: 'Город или почтовый адрес', text: 'Город с терминалом ТК, а для Почты России — полный адрес с индексом.' },
  { icon: 'user', title: 'ФИО и телефон получателя', text: 'Транспортной компании нужны ФИО, паспорт и телефон получателя — без них груз не выдадут.' },
  { icon: 'card', title: 'Предоплата 100 %', text: 'Доставку оплачиваете транспортной компании при получении.' },
]

export const zdFacts = [
  { icon: 'hive', b: 'Больше 40 лет', s: 'Алексей Ширяев и сыновья Иван и Василий на собственной пасеке' },
  { icon: 'home', b: '450 пчелосемей', s: 'зимуют в зимовниках на главной усадьбе в Прудском' },
  { icon: 'mountain', b: 'Две пасеки', s: 'в Калманском районе у посевов гречихи и горная — в Чарышском' },
  { icon: 'truck', b: 'По всей России', s: 'транспортными компаниями и Почтой России, груз страхуем' },
]

// ---------- Видео (/video/) ----------
const vid = (file: string) => `${SITE}/assets/doc/${encodeURIComponent(file)}`
export const zdVideos = [
  { title: 'Красота Алтая. Пасека «Ширяев и сыновья»', src: vid('krasota-altaya-paseka-shiryaev-i-synovya.mp4'), main: true },
  { title: 'Холодная весна 2026', src: vid('Холодная весна 2026.mp4') },
  { title: 'Ревизия зимовки пчёл 2025–2026', src: vid('Ревизия зимовки пчел 2025-2026.mp4') },
  { title: 'Новое видео нашей пасеки', src: vid('Novoe video nashei paseki.mp4') },
  { title: 'Отзыв покупателя из Москвы', src: vid('Review Moscow.mp4') },
  { title: 'Заказ, приёмка и дегустация гречишного мёда', src: vid('zakaz-priyomka-degustaciya-grechishnogo-myoda.mp4') },
  { title: 'Технология работы с мёдом', src: vid('tekhnologiya-raboty-s-myodom.mp4') },
  { title: 'Снятие медовых корпусов', src: vid('snyatie-medovyh-korpusov.mp4') },
  { title: 'Медогонка радиальная 60-рамочная «Медуница-60Р»', src: vid('medogonka-radialnogo-tipa-60-ti-ramochnaya-medunica-60r.mp4') },
  { title: 'Станок для распечатки медовых сотов — видеоотзыв', src: vid('stanok-avtomaticheskij-dlya-raspechatki-medovyh-sotov-video-otzyv.mp4') },
  { title: 'Очистка рамок от воска', src: vid('ochistka-ramok-ot-voska.mp4') },
  { title: 'Вынос пчёл из зимовника', src: vid('Вынос пчёл из зимовника.mp4') },
  { title: 'Зимовка пчёл на воле в буртах', src: vid('Зимовка пчел на воле в буртах.mp4') },
  { title: 'Зимовка пчёл на воле 2021, 22 и 23 год', src: vid('Зимовка пчел на воле 2021, 22 и 23 год.mp4') },
  { title: 'Борьба с клещом удалением весной первого расплода', src: vid('Борьба с клещом путем удаления весной первого расплода.mp4') },
  { title: 'Электропастух — защита от медведей и скота', src: vid('Электропастух - защита от медведей и скота.mp4') },
  { title: 'Чем лучше красить ульи', src: vid('Чем лучше красить улья.mp4') },
  { title: 'Скрепы для ульев', src: vid('skrepy-dlya-ulev.mp4') },
  { title: 'Изготовление бокового бруска для рамки', src: vid('Izgotovlenie bokovogo bruska dlya ramki.mp4') },
]

// ---------- Фото (/fotogalereya/) ----------
export interface ZdShot {
  thumb: string
  full: string
}
const shots = (dir: number, hash: string, ids: number[], ext: (id: number) => string = () => 'jpg'): ZdShot[] =>
  ids.map((id) => ({ thumb: thumb(`${id}.${hash}.${ext(id)}`), full: `${SITE}/assets/gallery/${dir}/${id}.${ext(id)}` }))
const range = (a: number, b: number, skip: number[] = []) => Array.from({ length: b - a + 1 }, (_, i) => a + i).filter((n) => !skip.includes(n))

export const zdGalleries = [
  {
    id: 'paseka',
    title: 'Наша пасека',
    shots: [
      ...shots(5,'215d87e9885cf21839cd59482fd786bb', range(133, 165, [134, 135, 158, 164])),
      ...shots(5, '215d87e9885cf21839cd59482fd786bb', [362, 363, 364, 365]),
    ],
  },
  { id: 'medonosy', title: 'Медоносы', shots: shots(6, 'f67b0a1992c611d20b08e288ae8e1698', [...range(168, 206, [184]), 372]) },
  {
    id: 'altai',
    title: 'Фото Алтая',
    shots: [
      ...shots(4, 'f0708b3ce6029214d7427b10caf2ead4', [...range(82, 114), 116, 122, 123, 124, 126, 127, 128, 129, 130]),
      ...shots(4, 'c52145fc7cb7aca28980b4518893afaf', [344], () => 'png'),
      ...shots(4, 'f0708b3ce6029214d7427b10caf2ead4', range(455, 463)),
    ],
  },
]

// ---------- Блог (/blog/) — рубрики и статьи оригинала, ведут на сайт пасеки ----------
export const zdRubrics = [
  { id: 'vopros', label: 'Вопрос — ответ', url: '/vopros-otvet/' },
  { id: 'stati', label: 'Статьи', url: '/stati/' },
  { id: 'apiterapiya', label: 'Апитерапия', url: '/apiterapiya/' },
  { id: 'tehnologiya', label: 'Технология', url: '/texnologiya' },
  { id: 'mnenie', label: 'Личное мнение', url: '/lichnoe-mnenie' },
  { id: 'novosti', label: 'Новости', url: '/news/' },
]
export const zdPosts = [
  { r: 'stati', title: 'Как правильно выбрать мед', lead: 'Я несколько последних лет продаю излишки своего меда на ярмарках и наблюдаю, как доверчивые покупатели проходят мимо настоящих пчеловодов.', url: '/kak-vybrat-myod' },
  { r: 'stati', title: 'Как правильно купить мед по интернету? (как отличить сайт барыги от сайта пчеловода)', lead: 'Сейчас большую популярность приобретает покупка товаров, в том числе и меда, по интернету.', url: '/kak-pravilno-kupit-med-po-internetu-kak-otlichit-sayt-barygi-ot-sayta-pchelovoda' },
  { r: 'vopros', title: 'Чем отличается качественный натуральный мед от некачественного и фальсифицированного', lead: 'После того, когда мы определились, какой сорт меда нам следует приобрести, перед нами встаёт следующий, не менее важный вопрос.', url: '/kak-otlichit-kachestvennyj-i-nekachestvennyj-myod/' },
  { r: 'vopros', title: 'В чем отличие мёда и других продуктов пчеловодства от продуктов питания', lead: 'Прежде чем ответить на вопрос «Как правильно выбрать мед?», следует понять, чем для нас является мед.', url: '/osobennosti-naturalnogo-myoda/' },
  { r: 'apiterapiya', title: 'Лечебные свойства алтайского меда', lead: 'Медицина движется хорошими темпами, предоставляя возможность людям следить за своим здоровьем.', url: '/lechebnyie-svojstva-altajskogo-meda' },
  { r: 'apiterapiya', title: 'Лечебные свойства прополиса', lead: 'Пчеловодство прочно ассоциируется у народа со здоровьем.', url: '/lechebnyie-svojstva-propolisa' },
  { r: 'apiterapiya', title: 'Трутневый гомогенат. Выбираем правильно и лечимся эффективно!', lead: 'Трутневый гомогенат представляет собой выжимку личинок трутней, поэтому он — ценнейший источник натурального протеина.', url: '/trutnevyij-gomogenat.-vyibiraem-pravilno' },
  { r: 'apiterapiya', title: 'Нативный гомогенат. Как принимать и чем запивать?', lead: 'Всем известно, что белок — главный строительный материал нашего организма.', url: '/nativnyij-gomogenat-kak-prinimat-i-chem-zapivat' },
  { r: 'tehnologiya', title: 'Метод Волоховича на моей пасеке', lead: 'Большинство пчеловодов постоянно занимаются поиском приёмов, позволяющих получать больше меда от каждой пчелосемьи.', url: '/metod-voloxovicha-na-moej-paseke' },
  { r: 'tehnologiya', title: 'Теплица или как пчеловоды отдыхают зимой', lead: 'Существует мнение, что пчеловоды работают только летом в период сбора и откачки меда, а всю зиму отдыхают. Это не так.', url: '/teplica-ili-kak-pchelovody-otdyxayut-zimoj/' },
  { r: 'mnenie', title: 'Миграция пасек в Алтайском крае', lead: 'В этой статье попытаюсь раскрыть основные причины миграции пасек алтайских пчеловодов и предложить пути решения.', url: '/migracziya-pasek-v-altajskom-krae' },
  { r: 'novosti', title: 'Форум пчеловодов Томской области', lead: '25 марта 2024 года состоялся Форум пчеловодов Томской области. Условно его можно разделить на два пула вопросов.', url: '/forum-pchelovodov-tomskoj-oblasti-25-marta-2024-goda' },
  { r: 'novosti', title: 'Василий за фрезерным станком', lead: 'Наша столярная мастерская оснащена тремя деревообрабатывающими станками.', url: '/vasilij-za-frezernyim-stankom' },
]
