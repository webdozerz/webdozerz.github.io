// Данные концепта редизайна сайта «Лавка Fish» (Томск): охлаждённая рыба под привоз и морепродукты.
// Источник: https://lavkafish.com (Tilda) и Telegram-канал лавки https://t.me/LavkaSP — снято 23 октября 2026.
// Это концепт, не официальный сайт. На сайте 4 товара с ценами за сентябрь, свежий ассортимент
// публикуется постами в канале: цены, даты привоза и остатки взяты оттуда. Фото из постов
// канала лежат в папке концепта (ссылки Telegram временные и истекают), фото с сайта
// грузятся с CDN Tilda. Позиции без цены (курица, прайсы-плитки) показаны как «под заказ».

export type LfGroupId = 'chilled' | 'fish' | 'sea' | 'roe' | 'semi'
export type LfUnit = 'piece' | 'kg' | 'pack'
export type LfCity = 'tomsk' | 'nsk'
export type LfBatchId = 'tue' | 'thu'

export interface LfVariant {
  id: string
  label: string
  // piece и kg — цена за 1 кг, pack — за упаковку или банку.
  price: number
  unit: LfUnit
  // piece: вес одной рыбы, кг; max = null — «от».
  weight?: [number, number | null]
  // pack: подпись фасовки.
  pack?: string
  // Цена от количества: «от 3 шт — 1590 ₽/кг».
  tiers?: { from: number; price: number }[]
  left?: number
  note?: string
}

export interface LfProduct {
  id: string
  group: LfGroupId
  name: string
  img?: string
  origin?: string
  text?: string
  variants: LfVariant[]
  // Каким привозом едет по городам; нет города — туда не возим.
  batch: Partial<Record<LfCity, LfBatchId>>
}

const local = (file: string) => `/redesign/lavkafish/img/${file}`
const tilda = (path: string) => `https://static.tildacdn.com/${path}`

export const lfImg = local

export const lfPath = (path = '') => `/redesign/lavkafish${path || '/'}`

export const lfGroups: { id: LfGroupId; title: string }[] = [
  { id: 'chilled', title: 'Охлаждённая рыба' },
  { id: 'fish', title: 'Филе и заморозка' },
  { id: 'sea', title: 'Морепродукты' },
  { id: 'roe', title: 'Икра' },
  { id: 'semi', title: 'Полуфабрикаты' },
]

const tomsk = { tomsk: 'tue' } as const
const both = { tomsk: 'tue', nsk: 'thu' } as const

export const lfProducts: LfProduct[] = [
  {
    id: 'trout-khakas',
    group: 'chilled',
    name: 'Форель Хакасия, охлаждённая, непотрошёная',
    img: local('trout-roe.jpg'),
    origin: 'Хакасия',
    text: 'Икра уже созрела. Рыбу везём в термобоксах со льдом, не замораживаем. Цена за 1 кг, заказ — в штуках, точную сумму считаем после взвешивания.',
    batch: both,
    variants: [
      {
        id: '3-5',
        label: '3–5 кг',
        price: 1650,
        unit: 'piece',
        weight: [3, 5],
        tiers: [{ from: 3, price: 1590 }],
        left: 6,
        note: 'икорность 70–80%',
      },
      {
        id: '2-3',
        label: '2–3 кг',
        price: 1390,
        unit: 'piece',
        weight: [2, 3],
        left: 2,
        note: 'икорность 10–20%',
      },
    ],
  },
  {
    id: 'murmansk',
    group: 'chilled',
    name: 'Лосось и форель охлаждённые, Мурманск',
    img: tilda('tild3463-6633-4263-b663-356133666432/Genetically-engineer.jpg'),
    origin: 'Мурманск',
    text: 'Жирные, сочные, с нежной текстурой. Цена за 1 кг, заказ — в штуках.',
    batch: { tomsk: 'thu' },
    variants: [
      {
        id: 'salmon',
        label: 'Лосось 3+ кг',
        price: 1990,
        unit: 'piece',
        weight: [3, null],
      },
      {
        id: 'trout',
        label: 'Форель 2+ кг',
        price: 1990,
        unit: 'piece',
        weight: [2, null],
      },
    ],
  },
  {
    id: 'salmon-brick',
    group: 'fish',
    name: 'Брикет сёмги, филе без кожи и костей',
    img: tilda('tild6637-3064-4264-b332-386634626537/photo_2024-10-16_17-.jpg'),
    origin: 'Мурманск',
    text: 'Чистое филе атлантического лосося: солите, запекайте. На развес — цена за 1 кг, пересчёт по факту.',
    batch: both,
    variants: [
      { id: 'kg', label: 'на развес', price: 2170, unit: 'kg' },
      {
        id: 'brick',
        label: 'брикет 7 кг',
        price: 1950,
        unit: 'piece',
        weight: [7, 7],
        left: 3,
        note: 'акция',
      },
    ],
  },
  {
    id: 'trout-fillet',
    group: 'fish',
    name: 'Филе форели свежемороженое',
    img: local('salmon-fillet.jpg'),
    text: 'Упаковка 0,8–1,2 кг. Цена за 1 кг, точную сумму считаем по весу упаковки.',
    batch: both,
    variants: [
      {
        id: 'pack',
        label: 'упаковка 0,8–1,2 кг',
        price: 2090,
        unit: 'piece',
        weight: [0.8, 1.2],
      },
    ],
  },
  {
    id: 'cod',
    group: 'fish',
    name: 'Треска, филе на коже',
    img: local('cod.jpg'),
    batch: tomsk,
    variants: [{ id: 'kg', label: 'филе на коже', price: 1290, unit: 'kg' }],
  },
  {
    id: 'flounder',
    group: 'fish',
    name: 'Камбала',
    img: local('flounder.jpg'),
    text: 'Свежемороженая, нежное мясо без мелких костей. Подходит для жарки, запекания и гриля.',
    batch: tomsk,
    variants: [
      { id: 'steaks', label: 'стейки', price: 860, unit: 'kg' },
      { id: 'pieces', label: 'куски, жёлтопёрая', price: 690, unit: 'kg' },
    ],
  },
  {
    id: 'shrimp',
    group: 'sea',
    name: 'Креветки',
    img: tilda('stor3864-3533-4165-b339-333063363461/766ddf96194cee6fe65bfe2bd9668479.jpg'),
    batch: both,
    variants: [
      {
        id: 'vannamei',
        label: 'ваннамей 31/40, на хвосте',
        price: 1490,
        unit: 'kg',
      },
      { id: 'north', label: 'северная 150+', price: 950, unit: 'kg' },
      { id: 'botan', label: 'шейка ботан', price: 2550, unit: 'kg' },
      {
        id: 'cocktail',
        label: 'коктейльная',
        price: 695,
        unit: 'pack',
        pack: '0,45 кг',
      },
    ],
  },
  {
    id: 'scallop',
    group: 'sea',
    name: 'Гребешок',
    img: local('scallop-baked.jpg'),
    batch: tomsk,
    variants: [
      { id: 'meat', label: 'мясо', price: 1390, unit: 'kg' },
      {
        id: 'laperuza',
        label: 'лаперуза',
        price: 1190,
        unit: 'kg',
        note: 'остатки по 1 кг',
      },
      {
        id: 'shell',
        label: 'на ракушке',
        price: 1590,
        unit: 'kg',
        note: 'остатки по 1 кг',
      },
    ],
  },
  {
    id: 'squid',
    group: 'sea',
    name: 'Кальмар',
    img: local('squid.jpg'),
    batch: tomsk,
    variants: [
      {
        id: 'strips',
        label: 'шинковка',
        price: 690,
        unit: 'pack',
        pack: '0,6 кг',
      },
      { id: 'tubes', label: 'трубки', price: 975, unit: 'kg' },
    ],
  },
  {
    id: 'roe',
    group: 'roe',
    name: 'Икра минтая и щуки',
    img: local('pollock-roe.jpg'),
    text: 'Икра минтая — на тост со сливочным маслом, со страчателлой, с яйцом и зелёным луком.',
    batch: tomsk,
    variants: [
      {
        id: 'pollock',
        label: 'минтая',
        price: 550,
        unit: 'pack',
        pack: 'банка 0,25 кг',
        tiers: [{ from: 5, price: 490 }],
      },
      {
        id: 'pike',
        label: 'щуки пробойная',
        price: 4100,
        unit: 'pack',
        pack: 'банка 0,5 кг',
        left: 1,
      },
    ],
  },
  {
    id: 'cutlets',
    group: 'semi',
    name: 'Котлеты куриные «Вкусные»',
    img: local('cutlets.jpg'),
    text: 'Состав: 100% белое куриное мясо.',
    batch: tomsk,
    variants: [
      {
        id: 'kg',
        label: 'на развес',
        price: 790,
        unit: 'kg',
        tiers: [{ from: 3, price: 690 }],
      },
    ],
  },
  {
    id: 'snacks',
    group: 'semi',
    name: 'Стрипсы, наггетсы, сырные палочки',
    img: local('snacks.jpg'),
    batch: tomsk,
    variants: [
      {
        id: 'strips',
        label: 'стрипсы',
        price: 790,
        unit: 'pack',
        pack: 'упаковка',
      },
      { id: 'nuggets', label: 'наггетсы в темпуре', price: 650, unit: 'kg' },
      { id: 'cheese', label: 'сырные палочки', price: 890, unit: 'kg' },
    ],
  },
]

// Позиции из канала без своего фото — списком под карточками.
export const lfRows: LfProduct[] = [
  {
    id: 'herring',
    group: 'fish',
    name: 'Брикет сельди',
    text: 'Свежая поставка. После разморозки сразу готова для приготовления.',
    batch: tomsk,
    variants: [
      {
        id: 'kg',
        label: 'брикет',
        price: 490,
        unit: 'kg',
        tiers: [{ from: 5, price: 450 }],
      },
    ],
  },
  {
    id: 'mussels',
    group: 'sea',
    name: 'Мясо мидии',
    batch: tomsk,
    variants: [
      {
        id: 'pack',
        label: 'упаковка',
        price: 290,
        unit: 'pack',
        pack: '0,45 кг',
      },
    ],
  },
  {
    id: 'langoustine',
    group: 'sea',
    name: 'Лангустины без головы',
    batch: tomsk,
    variants: [{ id: 'kg', label: 'без головы', price: 1690, unit: 'kg' }],
  },
  {
    id: 'octopus',
    group: 'sea',
    name: 'Щупальца осьминога, с/м',
    batch: tomsk,
    variants: [
      {
        id: 'portion',
        label: 'порция 300–400 г',
        price: 1650,
        unit: 'piece',
        weight: [0.3, 0.4],
      },
    ],
  },
  {
    id: 'barramundi',
    group: 'fish',
    name: 'Баррамунди «бабочка», морская',
    batch: tomsk,
    variants: [
      {
        id: 'piece',
        label: '400–600 г',
        price: 950,
        unit: 'piece',
        weight: [0.4, 0.6],
      },
    ],
  },
  {
    id: 'pollock-brick',
    group: 'fish',
    name: 'Брикет минтая',
    batch: tomsk,
    variants: [{ id: 'pack', label: '0,6 кг', price: 450, unit: 'pack', pack: '0,6 кг' }],
  },
]

export const lfAll = [...lfProducts, ...lfRows]

export const lfFindProduct = (id: string) => lfAll.find((p) => p.id === id)

export const lfUnitLabel = (v: LfVariant) => (v.unit === 'pack' ? 'шт' : v.unit === 'kg' ? 'кг' : 'шт')

// Цена с учётом лесенки «от 3 шт».
export const lfUnitPrice = (v: LfVariant, qty: number) => (v.tiers ?? []).reduce((price, t) => (qty >= t.from ? t.price : price), v.price)

// Цена за кг для сортировки: у упаковок с весом («0,45 кг») пересчитываем, иначе 100 г и килограммы встают вперемешку.
export const lfPerKg = (v: LfVariant) => {
  const kg = v.unit === 'pack' && v.pack ? parseFloat((v.pack.match(/([\d,]+)\s*кг/) ?? [])[1]?.replace(',', '.') ?? '') : NaN
  return Number.isFinite(kg) && kg > 0 ? v.price / kg : v.price
}

export interface LfEstimate {
  min: number
  max: number | null
  // Сколько платим на сайте: за рыбу штучно — 1 кг за каждую, остальное курьеру.
  prepay: number
  exact: boolean
}

export const lfEstimate = (v: LfVariant, qty: number): LfEstimate => {
  const price = lfUnitPrice(v, qty)
  if (v.unit === 'piece' && v.weight) {
    const [a, b] = v.weight
    const fixed = a === b
    return {
      min: Math.round(price * a * qty),
      max: b === null ? null : Math.round(price * b * qty),
      prepay: fixed ? price * a * qty : price * qty,
      exact: fixed,
    }
  }
  const sum = price * qty
  return { min: sum, max: sum, prepay: sum, exact: v.unit === 'pack' }
}

export const lfPrice = (n: number) => `${Math.round(n).toLocaleString('ru-RU')} ₽`

export const lfRange = (e: { min: number; max: number | null }) =>
  e.max === null
    ? `от ${lfPrice(e.min)}`
    : e.max === e.min
      ? lfPrice(e.min)
      : `${Math.round(e.min).toLocaleString('ru-RU')}–${lfPrice(e.max)}`

export const lfKg = (n: number) => `${n.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} кг`

// Привозы. Даты из канала на 23.10.2026: Томск — 27.10 (вторник), Мурманск и Новосибирск — 29.10 (четверг).
// Страница живёт дольше недели: прошедший привоз переносим на ту же дату через 7 дней.
const BATCH_BASE: Record<LfBatchId, string> = {
  tue: '2026-10-27',
  thu: '2026-10-29',
}

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const DAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
const DAYS_ACC = ['в воскресенье', 'в понедельник', 'во вторник', 'в среду', 'в четверг', 'в пятницу', 'в субботу']
const DAYS_SHORT = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']

export interface LfBatchDate {
  id: LfBatchId
  date: Date
  day: string
  dayAcc: string
  short: string
  // «27 октября»
  dm: string
}

export const lfBatchDate = (id: LfBatchId, now = new Date()): LfBatchDate => {
  const date = new Date(`${BATCH_BASE[id]}T22:00:00+07:00`)
  while (date.getTime() < now.getTime()) date.setDate(date.getDate() + 7)
  const d = new Date(date.getTime() + 7 * 3600 * 1000)
  const wd = d.getUTCDay()
  return {
    id,
    date,
    day: DAYS[wd],
    dayAcc: DAYS_ACC[wd],
    short: DAYS_SHORT[wd],
    dm: `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`,
  }
}

// Курицу КФХ принимают до 18:00 накануне привоза.
export const lfChickenStop = (tue: LfBatchDate) => {
  const d = new Date(tue.date.getTime() + 7 * 3600 * 1000 - 24 * 3600 * 1000)
  return `${DAYS_SHORT[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}, до\u00a018:00`
}

export const lfCities: { id: LfCity; title: string; short: string }[] = [
  { id: 'tomsk', title: 'Томск и Северск', short: 'Томск' },
  { id: 'nsk', title: 'Новосибирск и Алтай', short: 'Новосибирск' },
]

export interface LfZone {
  id: string
  title: string
  price: number
  // Цена «от–до»: назовёт менеджер.
  upTo?: number
}

// Зоны Томска — со страницы «Как заказать» (/info). На /forel указано 300 ₽ по городу — расхождение
// оригинала, в концепте взяты более подробные цены с /info.
export const lfZones: Record<LfCity, LfZone[]> = {
  tomsk: [
    { id: 'city', title: 'Томск и Северск', price: 100 },
    { id: 'z150', title: 'Южные ворота, Северный парк', price: 150 },
    {
      id: 'z200',
      title: 'Зональный, Тимирязевское, Светлый, Копылово',
      price: 200,
    },
    {
      id: 'z250',
      title: 'Богашево, Лоскутово, Кисловка, Тахтамышево',
      price: 250,
    },
  ],
  nsk: [
    { id: 'city', title: 'Новосибирск, до подъезда', price: 400 },
    { id: 'far', title: 'Удалённые районы', price: 450, upTo: 700 },
  ],
}

export const lfLift = 50

export const lfDeliveryHours: Record<LfCity, string> = {
  tomsk: 'с 10 до 22, точное время пришлём в WhatsApp',
  nsk: 'с 13 до 22, точное время пришлём в WhatsApp',
}

export const lfPriceLists = [
  {
    id: 'caviar',
    title: 'Красная икра',
    text: 'Икра форели, кеты и горбуши — в наличии.',
    img: tilda('tild3862-6533-4734-b132-356661616432/Opera-Snimok_2018-10.png'),
  },
  {
    id: 'deli',
    title: 'Авторские деликатесы',
    text: 'Стейки и закуски собственного посола.',
    img: tilda('tild3136-6665-4735-b064-633239626236/b01b1953-2f4a-46eb-a.jpeg'),
  },
  {
    id: 'breakfast',
    title: 'Всё для завтрака',
    text: 'Печень трески, икра минтая, тунец, краб, форель и сёмга слабой соли, круассаны, гуакамоле.',
    img: tilda('tild6363-3730-4164-a632-363038313432/c11e34d56f45b63a0c30.jpg'),
  },
]

export const lfFaq = [
  {
    q: 'Есть ли рыба в наличии?',
    a: 'Нет, склада у нас нет. Мы привозим охлаждённую форель, выловленную при нас и упакованную в термобоксы с большим количеством льда, и сразу везём к вам. Поэтому заказ собираем к ближайшему привозу.',
  },
  {
    q: 'Какой вес у рыбы?',
    a: 'Вес указан в карточке: форель Хакасия — 2–3 и 3–5 кг, лосось из Мурманска — от 3 кг, форель — от 2 кг. Заказ делаете в штуках, сумму считаем после взвешивания.',
  },
  {
    q: 'Где забрать рыбу?',
    a: 'Самовывоза нет, только доставка. По Томску и Северску — 100 ₽, в удалённые районы — 150–250 ₽, подъём до квартиры — +50 ₽.',
  },
  {
    q: 'Сколько стоит рыба?',
    a: 'Стоимость зависит от веса. Поэтому на сайте вы оплачиваете 1 кг каждой рыбы, а доплату по весу отдаёте курьеру при получении.',
  },
  {
    q: 'Когда привезут?',
    a: 'Доставка не в день заказа, а в наши дни привоза — дата указана у каждого товара. В течение суток после заказа пришлём в WhatsApp время доставки. Адрес после этого не меняем.',
  },
]

export const lfContacts = {
  original: 'https://lavkafish.com/',
  phone: '8 906 947 02 78',
  phoneHref: 'tel:+79069470278',
  email: 'lavkafish70@gmail.com',
  address: 'Томск, пер. Карский, 28',
  channel: 'https://t.me/LavkaSP',
  channelSubs: '1 700+',
  vk: 'https://vk.com/lavkafishtomsk',
  legal: {
    name: 'ИП Кузнецова Наталия Александровна',
    inn: '702000228632',
    ogrn: '318703100060811',
    bank: 'ПАО Сбербанк, Томское отделение № 8616',
  },
}
