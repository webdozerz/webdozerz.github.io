// Концепт редизайна papinalavka.ru — «Папина лавка», натуральные продукты с экоферм под заказ, Воронеж.
// Данные сняты с оригинала (самописная CMS INTRID) в октябре 2026: товары и разделы — в papinalavkaData.ts,
// описания карточек — в papinalavkaText.ts. Картинки товаров и разделов берутся с papinalavka.ru по https,
// в папке концепта лежат только логотип, гравюры и деревянная планка с их сайта.

import { plProductsRaw, plSectionsRaw } from './papinalavkaData'

export type PlLabel = 'day' | 'hit' | 'new' | 'rec' | 'lent'

export interface PlProduct {
  id: number
  name: string
  price: number
  old: number | null
  unit: string
  stock: boolean
  next: string | null
  label: PlLabel | null
  note: string | null
  sec: number
  img: string
  big: string | null
  kicker: string | null
}

export interface PlSection {
  id: number
  name: string
  count: number
  img: string
}

export interface PlDelivery {
  date: string
  title: string
  what: string
  count: number
  items: string[]
}

export const plProducts = plProductsRaw
export const plSections = plSectionsRaw

export const plBase = '/redesign/papinalavka'
export const plPath = (p = '/') => (p === '/' ? `${plBase}/` : `${plBase}${p}`)
export const plSectionPath = (id?: number) => (id ? plPath(`/catalog/${id}`) : plPath('/catalog'))
export const plProductPath = (id: number) => plPath(`/product/${id}`)
export const plAsset = (f: string) => `${plBase}/${f}`
export const plImg = (f: string) => `https://papinalavka.ru/content/catalog_image/${f}`
export const plSecImg = (f: string) => `https://papinalavka.ru/content/sections/${f}`

export const plFind = (id: number | string) => plProducts.find((p) => p.id === Number(id))
export const plSection = (id: number | string) => plSections.find((s) => s.id === Number(id))
export const plInSection = (id: number) => plProducts.filter((p) => p.sec === id)

export const plLabels: Record<PlLabel, string> = {
  day: 'Товар дня',
  hit: 'Хит продаж',
  new: 'Новинка',
  rec: 'Рекомендуем',
  lent: 'Постное',
}

// Вкладки главной и каталога — как у оригинала: «Есть в наличии / Новинки / Хиты продаж / Товар дня».
export const plTabs = [
  { id: 'stock', label: 'Есть в наличии', test: (p: PlProduct) => p.stock },
  { id: 'day', label: 'Товар дня', test: (p: PlProduct) => p.label === 'day' },
  { id: 'hit', label: 'Хиты продаж', test: (p: PlProduct) => p.label === 'hit' },
  { id: 'new', label: 'Новинки', test: (p: PlProduct) => p.label === 'new' },
] as const

export const plFmt = (n: number) => `${Math.round(n).toLocaleString('ru-RU')} ₽`

// Единица счётчика: для «за кг» — килограммы, для фасовок — штуки.
export const plQtyUnit = (p: PlProduct) => (p.unit === 'за кг' ? 'кг' : p.unit === 'за услугу' ? 'усл.' : 'шт.')
export const plByWeight = (p: PlProduct) => p.unit === 'за кг'

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const WD_ACC = ['в воскресенье', 'в понедельник', 'во вторник', 'в среду', 'в четверг', 'в пятницу', 'в субботу']

// «29 октября 2026» -> Date (полдень, чтобы не съехать на соседний день из-за часового пояса).
export const plParse = (s: string) => {
  const [d, m, y] = s.split(' ')
  return new Date(Number(y), MONTHS.indexOf(m), Number(d), 12)
}
export const plDay = (s: string) => {
  const d = plParse(s)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}
export const plWeekday = (s: string) => WD[plParse(s).getDay()]
export const plWeekdayAcc = (s: string) => WD_ACC[plParse(s).getDay()]

// Заказ на охлаждённое «за сутки до дня поставки (до 13.00)».
export const plDeadline = (s: string) => {
  const d = plParse(s)
  d.setDate(d.getDate() - 1)
  d.setHours(13, 0, 0, 0)
  return d
}
export const plDeadlineLabel = (s: string) => {
  const d = plDeadline(s)
  return `до 13:00, ${d.getDate()} ${MONTHS[d.getMonth()]}`
}
export const plOpen = (s: string, now = new Date()) => now < plDeadline(s)
const MON = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
// Коротко для записок на доске: «до 13:00, 28 окт».
export const plDeadlineShort = (s: string) => {
  const d = plDeadline(s)
  return `до 13:00, ${d.getDate()} ${MON[d.getMonth()]}`
}

// Короткие подписи разделов для табличек главной — полное название в каталоге.
export const plShortNames: Record<number, string> = {
  64: 'Солёная и копчёная',
  35: 'Мясо',
  82: 'Колбасы',
  67: 'Пельмени, вареники',
  41: 'Ягоды и грибы',
  38: 'Птица и яйца',
  61: 'Молочная ферма',
}

export const plDeliveries: PlDelivery[] = [
  {
    date: '27 октября 2026',
    title: 'Молочная поставка с Большой Трещёвской фермы',
    what: 'козье и коровье молоко, брынза',
    count: 3,
    items: ['Молоко козье пастеризованное (с. Большая Трещёвка)', 'Молоко коровье пастеризованное (с. Большая Трещёвка)', 'Сыр Брынза козий (с.Большая Трещёвка)'],
  },
  {
    date: '28 октября 2026',
    title: 'Свежие фейхоа и лимоны из Абхазии',
    what: 'фейхоа, лимоны',
    count: 2,
    items: ['ФЕЙХОА СВЕЖИЕ ЯГОДЫ (Абхазия)', 'Лимоны из Абхазии'],
  },
  {
    date: '29 октября 2026',
    title: 'Охлаждённая морская сёмга из Мурманска и мясо-молочная поставка',
    what: 'молоко, творог, сметана, сыры, домашняя птица, крольчатина, колбасы, сосиски, варенье, мёд, чаи, кофе свежей обжарки',
    count: 321,
    items: [
      'Сёмга морская охлаждённая (Мурманск)',
      'Разделка на филе Сёмги',
      'Сёмга филе порционное охлаждённое (Мурманск)',
      'Форель морская охлаждённая (Мурманск)',
      'Разделка на филе морской Форели',
    ],
  },
  {
    date: '12 ноября 2026',
    title: 'Охлаждённая непотрошёная форель из Осетии',
    what: 'горная форель из Осетии, потрошёная форель из Карелии, разделка на филе и стейки',
    count: 15,
    items: [
      'Форель горная непотрошёная охлаждённая (Осетия)',
      'Форель охлаждённая потрошёная (Карелия)',
      'Разделка на филе потрошёной Форели',
      'Разделка на стейки потрошёной Форели',
      'Форель филе охлаждённое (Карелия)',
    ],
  },
]

const norm = (s: string) => s.toLowerCase().replace(/[\s.,()«»"]+/g, '')
// Товары поставки: сначала названные в анонсе, затем остальные с той же датой привоза.
export const plDeliveryProducts = (d: PlDelivery) => {
  const named = d.items.map((n) => plProducts.find((p) => norm(p.name) === norm(n))).filter(Boolean) as PlProduct[]
  const rest = plProducts.filter((p) => p.next === d.date && !named.includes(p))
  return [...named, ...rest]
}

// Ближайшая поставка, на которую ещё принимают заказы; если все прошли — последняя из анонса.
export const plNextDelivery = (now = new Date()) => plDeliveries.find((d) => plOpen(d.date, now)) ?? plDeliveries[plDeliveries.length - 1]

export const plCities = ['Воронеж', 'Нововоронеж', 'Россошь', 'Липецк', 'Анна', 'Борисоглебск', 'Лиски', 'Бобров, Бутурлиновка', 'Москва', 'Минск', 'Партнёры']

export interface PlOffice {
  street: string
  where: string
  city: string
  phone: string
  hours: string
}

export const plOffices: PlOffice[] = [
  { street: 'ул. Карла Маркса, 94', where: 'вход у арт-объекта «Царь-Рыба»', city: 'Воронеж', phone: '+7 (950) 758-55-05', hours: '9:00–20:00' },
  { street: 'ул. Независимости, 78 к3', where: 'Подгорное', city: 'Воронеж', phone: '+7 (929) 009-50-67', hours: '9:00–20:00' },
  {
    street: 'ул. Загоровского, 1',
    where: 'ТЦ «Пять столиц», вход со стороны ул. Шишкова',
    city: 'Воронеж',
    phone: '+7 (929) 009-40-11',
    hours: '9:00–22:00',
  },
  { street: 'ул. Владимира Невского, 47', where: 'за остановкой «Соборный»', city: 'Воронеж', phone: '+7 (929) 009-50-53', hours: '9:00–20:00' },
  {
    street: 'ул. Ворошилова, 16',
    where: 'за остановкой «Бахметьева», 1 этаж бизнес-центра, вход со стороны заправки ВТК',
    city: 'Воронеж',
    phone: '+7 (929) 009-50-52',
    hours: '9:00–20:00',
  },
  { street: 'ул. Старых Большевиков, 2', where: '', city: 'Воронеж', phone: '+7 (929) 009-50-23', hours: '9:00–20:00' },
  { street: 'ул. Дорожная, 30', where: 'ТК «Южный парк»', city: 'Новая Усмань', phone: '+7 (929) 009-50-57', hours: '9:00–20:00' },
]
export const plMapUrl = (o: PlOffice) => `https://yandex.ru/maps/?text=${encodeURIComponent(`${o.city}, ${o.street}`)}`
export const plTel = (s: string) => `tel:${s.replace(/[^\d+]/g, '').replace(/^8/, '+7')}`

export const plContacts = {
  original: 'https://papinalavka.ru/',
  phone: '+7 (929) 009-50-55',
  phones: [
    { name: 'Светлана', role: 'приём заказов и консультации по продукции', phone: '+7 (929) 009-50-55' },
    { name: 'Анна', role: 'приём заказов', phone: '+7 (929) 009-50-51' },
    { name: 'Ольга', role: 'приём заказов', phone: '+7 (929) 009-50-56' },
  ],
  orders: 'papinalavka@gmail.com',
  head: { name: 'Наталья Владимировна Папина', role: 'руководитель', email: 'mailpapina@gmail.com' },
  vk: 'https://vk.com/papinalavka',
  tg: 'https://t.me/papinalavka',
  legal: 'ИП Папин М. А., ОГРН 310366828700143',
  hours: 'офисы ежедневно 9:00–20:00, заказы с сайта операторы обрабатывают 9:00–19:00',
  subscribers: 29520,
}

// Доставка: «заказы на сумму более 5000 руб. мы доставим по городу БЕСПЛАТНО», в черте Воронежа 400 руб., Нововоронеж 500 руб.
// Портрет и слова Натальи с главной оригинала.
export const plNatalya = {
  photo: 'https://papinalavka.ru/content/main_img/2.jpg',
  quote:
    '«Папина лавка» — проект, созданный для нас и вас. Всё, что мы предлагаем вам, продегустировано и проверено нами, нашими детьми, друзьями и нашими счастливыми клиентами. И мы уверены, что предлагаем вам натуральный, выращенный с любовью продукт.',
}

export const plFreeFrom = 5000
export const plDeliveryFee = (city: string, sum: number): number | null => {
  if (city === 'Воронеж') return sum >= plFreeFrom ? 0 : 400
  if (city === 'Нововоронеж') return sum >= plFreeFrom ? 0 : 500
  return null
}

export const plFarAreas =
  'Отрожка, Репное, Боровое, Отрадное, ВАИ, Машмет, Бабяково, Озерки, Шилово, Придонской, Подгорное, Грин парк, 1 Мая, Тепличный, Семилуки, Никольское, Новая Усмань, Масловка, Ямное, Сомово, Шуберское, Александровка, Дубовка, Новопотклетное, Новоживотинное, Староживотинное'

export const plReviews = [
  {
    name: 'Владимир',
    date: '01 октября 2026',
    text: 'Купил 2 непотрошёные форели по 3,7 кг. Обе оказались с икрой, примерно 500 г получилось. Покупал на Ворошилова. Очень приветливый продавец, помогла с выбором. Спасибо за хороший продукт.',
  },
  {
    name: 'Наталья',
    date: '25 августа 2026',
    text: 'Я постоянная покупательница магазина на ул. Вл. Невского, 47. Сотрудники всегда радушны и улыбчивы, подскажут и помогут в выборе. Недавно был мой день рождения — все гости хором сказали, что было очень вкусно. И дело не в рецептах, а в качестве продуктов!',
  },
  {
    name: 'Ирина',
    date: '26 января 2026',
    text: 'Заказывала рыбный букет на день рождения. Помогли выбрать качественные продукты и оформили в праздничную упаковку. Доставили вовремя! Очень чуткие сотрудники, всем рекомендую.',
  },
  {
    name: 'Наталья',
    date: '20 декабря 2025',
    text: 'Вчера купила две огромные форели на Загоровского, 1. В каждой оказалось по 300 грамм икры. Девочки, спасибо вам огромное!',
  },
  {
    name: 'Лариса',
    date: '09 апреля 2026',
    text: 'Хочу сказать спасибо девочкам-продавцам в магазине у Храма: всегда радуют позитивом и отличным обслуживанием, продукты всегда свежайшие. Икра и креветочки в кляре — топ!',
  },
  {
    name: 'Евгения',
    date: '14 ноября 2025',
    text: 'С 17-го года покупаю здесь рыбку (форель непотрошёная) и всегда с хорошим бонусом в виде икры.',
  },
]

// Поиск по названию: все слова запроса должны встретиться в названии или разделе.
export const plSearch = (q: string, limit = 0) => {
  const words = q.toLowerCase().replace(/ё/g, 'е').split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const hits = plProducts.filter((p) => {
    const hay = `${p.name} ${plSection(p.sec)?.name ?? ''}`.toLowerCase().replace(/ё/g, 'е')
    return words.every((w) => hay.includes(w))
  })
  return limit ? hits.slice(0, limit) : hits
}

export const plPlural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}
export const plGoods = (n: number) => `${n} ${plPlural(n, 'товар', 'товара', 'товаров')}`
