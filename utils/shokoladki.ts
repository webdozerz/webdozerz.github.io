// Концепт редизайна shokoladki.ru — кондитерская фабрика «Верность качеству», шоколад APRIORI (Москва, Касимов).
// Данные сняты с сайта в ноябре 2026: выборка каталога и тексты — в shokoladki.data.ts / shokoladki.texts.ts (генерируются скриптом).
// Картинки — по адресам оригинала (контент владельца), локально лежат только логотип, иконка и og.
import { skProducts, skSections } from './shokoladki.data'

export const SK_ORIG = 'https://www.shokoladki.ru/'
export const SK_IMG = 'https://www.shokoladki.ru/upload/iblock/'

export interface SkSection {
  id: string
  n: string
  full: string
  g: 'collection' | 'occasion' | 'whom' | 'holiday' | 'calendar' | 'souvenir'
  count: number
  img: string
}
export interface SkProduct {
  id: string
  n: string
  p: number
  o: number
  c: string
  s: string[]
  img: string
  gal: string[]
  d: string[]
  f: Record<string, string>
  sku: string
  b: number
  r: number
  st: number
}
export interface SkCandy {
  id: string
  n: string
  p: number
  img: string
  t: string[]
}
export interface SkReview {
  n: string
  d: string
  r: number
  t: string
  pn: string
  pid: string
}
export interface SkPost {
  id: string
  k: 'articles' | 'news'
  img: string
  date: string
  views: number
  t: string
  lead: string
  body: string[]
  items: string[]
}
export interface SkFaq {
  q: string
  a: string[]
}

export const skPath = (p = '/') => `/redesign/shokoladki${p}`
export const skLocal = (f: string) => `/redesign/shokoladki/${f}`

export const skContacts = {
  phone: '+7 (495) 211-46-52',
  tel: '+74952114652',
  shopPhone: '+7 (916) 206-64-79',
  shopTel: '+79162066479',
  coopPhone: '+7 (495) 775-15-15',
  coopTel: '+74957751515',
  email: 'shokoladki@shokoladki.ru',
  office: 'Москва, Рябиновая ул., 26, стр. 1, офис В 101',
  officeMetro: 'м. Кунцевская, Озёрная',
  ordersHours: 'Заказы обрабатываем пн–пт 10:00–18:00',
  courierHours: 'Курьеры 9:00–21:00 без выходных',
  vk: 'https://vk.com/vernost_kachestvu',
  vk2: 'https://vk.com/shokoladapriori',
  logoSite: 'https://chocolatevk.ru/',
  pdf: 'https://www.shokoladki.ru/upload/APRIORI_DELUXE_NY_2027.pdf',
  offer: 'https://www.shokoladki.ru/upload/%D0%94%D0%BE%D0%B3%D0%BE%D0%B2%D0%BE%D1%80%20%D0%BF%D1%83%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D0%BE%D0%B9%20%D0%BE%D1%84%D0%B5%D1%80%D1%82%D1%8B.pdf',
}

export const skRequisites = [
  ['Организация', 'ООО «Шоколатье»'],
  ['Юридический адрес', '391300, Рязанская область, г. Касимов, ул. Советская, 199'],
  ['ИНН / КПП', '5075026911 / 622601001'],
  ['ОГРН', '1145075002984'],
  ['ОКПО', '34884016'],
  ['ОКВЭД', '52.24'],
  ['Расчётный счёт', '40702810253000002890'],
  ['Банк', 'Орловское отделение № 8595 ПАО Сбербанк'],
  ['БИК', '045402601'],
  ['Корр. счёт', '30101810300000000601'],
]

export interface SkShop {
  id: string
  city: string
  n: string
  addr: string
  metro?: string
  hours: string
  phone: string
  photo: string
  note?: string
}
export const skShops: SkShop[] = [
  {
    id: 'evropeyskiy',
    city: 'Москва',
    n: 'ТРЦ «Европейский»',
    addr: 'площадь Киевского вокзала, 2, 0 этаж, атриум «Берлин»',
    metro: 'Киевская',
    hours: 'пн–чт 10:00–22:00, пт–сб 10:00–23:00, без выходных',
    phone: '+7 919 962-28-71',
    photo: `${SK_IMG}572/572f60b4e3839ddf63a28379d905468f.jpg`,
  },
  {
    id: 'okeaniya',
    city: 'Москва',
    n: 'ТРЦ «Океания»',
    addr: 'Кутузовский проспект, 57, 1 этаж',
    metro: 'Славянский бульвар',
    hours: 'пн–чт 10:00–22:00, пт–сб 10:00–23:00, без выходных',
    phone: '+7 916 822-57-27',
    photo: `${SK_IMG}579/579bae69b2325495c4c9cd313b74fa58.jpg`,
  },
  {
    id: 'khorosho',
    city: 'Москва',
    n: 'ТРЦ «Хорошо»',
    addr: 'Хорошёвское шоссе, 27',
    metro: 'Полежаевская',
    hours: 'ежедневно 10:00–22:00',
    phone: '+7 916 340-73-64',
    photo: `${SK_IMG}8b2/8b220ef7efbb190211f519486f6d5f8c.jpg`,
  },
  {
    id: 'prostranstvo',
    city: 'Касимов',
    n: 'Шоколадное пространство APRIORI',
    note: 'кафе и фирменный магазин',
    addr: 'Соборная площадь, 10Б',
    hours: 'ежедневно 9:00–20:00',
    phone: '+7 910 638-72-24',
    photo: `${SK_IMG}25b/38rlpgbhiyygaihx30u9rb9jtf6z531c.jpg`,
  },
  {
    id: 'fabrika',
    city: 'Касимов',
    n: 'Магазин при фабрике',
    note: 'фабрика «Верность качеству»',
    addr: 'ул. Советская, 199',
    hours: '9:00–18:00',
    phone: '+7 915 595-38-17',
    photo: `${SK_IMG}79a/79abdd21058e35f4e442c7eee6fa73ce.jpg`,
  },
  {
    id: 'krotbers',
    city: 'Касимов',
    n: 'ТЦ «Кротберс»',
    addr: 'ул. Советская, 11А, 1 этаж',
    hours: 'ежедневно 10:00–20:00',
    phone: '+7 910 637-62-53',
    photo: `${SK_IMG}166/166cee08461218301f6785b34d0f5b48.jpg`,
  },
  {
    id: 'viktoriya',
    city: 'Рязань',
    n: 'ТЦ «Виктория Плаза»',
    addr: 'Первомайский проспект, 70к1, цокольный этаж',
    hours: 'ежедневно 10:00–22:00',
    phone: '+7 910 637-62-54',
    photo: `${SK_IMG}077/0771aaa4b2fb33a70d4184987b94573e.jpg`,
  },
]
export const skTel = (p: string) => '+' + p.replace(/\D/g, '').replace(/^8/, '7')

// Конструктор «Соберите набор»: коробки и цены как в /collect-the-set/ оригинала
export interface SkBox {
  id: string
  n: string
  short: string
  cells: number
  p: number
  lid: string
  shape: 'strip' | 'square' | 'octagon' | 'heart'
  tone: string
}
export const skBoxes: SkBox[] = [
  { id: 'b5', n: 'Коробка 5 шт.', short: '5 шт.', cells: 5, p: 150, lid: `${SK_IMG}ff0/ff0aea2c25ab9fe1c21a2e99e2225bd3.png`, shape: 'strip', tone: '#5a3330' },
  { id: 'h10', n: 'Сердце 10 шт.', short: 'Сердце 10', cells: 10, p: 650, lid: `${SK_IMG}a9b/wpwj65x33kd8ow5jg74p6dx82b1y3s33.jpg`, shape: 'heart', tone: '#6b2a36' },
  { id: 'b13', n: 'Коробка 13 шт.', short: '13 шт.', cells: 13, p: 450, lid: `${SK_IMG}bfa/e1xiqw4snf9w7a54vxgqnnlrpbvp1d3t.jpg`, shape: 'octagon', tone: '#efe3dc' },
  { id: 'q16', n: 'Коробка Квадрат 16 шт.', short: 'Квадрат 16', cells: 16, p: 450, lid: `${SK_IMG}00d/5s542g53uggdme2uh69jt7mbem2tc2u0.jpg`, shape: 'square', tone: '#e0b9a2' },
  { id: 'b24', n: 'Коробка 24 шт.', short: '24 шт.', cells: 24, p: 600, lid: `${SK_IMG}fbb/yx2554g5is01zlf2n7vhs7hsxjc4duh7.jpg`, shape: 'octagon', tone: '#4a2c27' },
  { id: 'h24', n: 'Сердце 24 шт.', short: 'Сердце 24', cells: 24, p: 700, lid: `${SK_IMG}4eb/0ovi2mcke008081swysdlcqgowkg4gey.jpg`, shape: 'heart', tone: '#6b2a36' },
  { id: 'b64', n: 'Коробка 64 шт.', short: '64 шт.', cells: 64, p: 1500, lid: '', shape: 'square', tone: '#4a2c27' },
]
export const SK_RIBBON = 100
export const SK_CARD = 30
export const skCards = [
  { id: 'c1', n: 'Шильдик 9×5 см «Поздравляю, для тебя»', img: 'https://www.shokoladki.ru/upload/resize_cache/iblock/c48/236_236_1/s4m2tuanu6ozsw33ap87ug9voalaiva0.jpeg' },
  { id: 'c2', n: 'Шильдик 9×5 см «Тебе с любовью»', img: 'https://www.shokoladki.ru/upload/resize_cache/iblock/37a/236_236_1/uc22qwj0p8xs2onqa1fnfbmvpcyo75s8.jpeg' },
  { id: 'c3', n: 'Шильдик 9×5 см «Happy Birthday»', img: 'https://www.shokoladki.ru/upload/resize_cache/iblock/22f/236_236_1/6291srssnnc9y44t3qzb2cowa2h927q3.jpeg' },
  { id: 'c4', n: 'Конверт подарочный 9×7 см', img: 'https://www.shokoladki.ru/upload/resize_cache/iblock/edc/236_236_1/zqu9s2tbx2lk57fdru51s5mrtusgtt3b.jpeg' },
]
export const SK_RIBBON_IMG = 'https://www.shokoladki.ru/upload/resize_cache/iblock/99c/236_236_1/4c0nw11kpmo1skmhs81uwkf9u8mqfswc.jpeg'

// Ячейки коробки: координаты центров в долях (0..1) и диаметр ячейки в долях ширины
export const skCells = (box: SkBox): { x: number; y: number }[] => {
  const n = box.cells
  const grid = (cols: number, rows: number, pad = 0.12) => {
    const out: { x: number; y: number }[] = []
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) out.push({ x: pad + ((1 - 2 * pad) * (c + 0.5)) / cols, y: pad + ((1 - 2 * pad) * (r + 0.5)) / rows })
    return out
  }
  if (box.shape === 'strip') return grid(5, 1, 0.07).map((p) => ({ x: p.x, y: 0.5 }))
  if (box.shape === 'heart') {
    // ряды симметрично от оси сердца: верхний ряд обходит выемку между долями, книзу ряды сужаются к острию
    const rows: [number, number[]][] =
      n === 10
        ? [
            [0.3, [0.25, 0.42, 0.58, 0.75]],
            [0.5, [0.33, 0.5, 0.67]],
            [0.68, [0.41, 0.59]],
            [0.84, [0.5]],
          ]
        : [
            [0.21, [0.19, 0.32, 0.68, 0.81]],
            [0.34, [0.15, 0.275, 0.4, 0.6, 0.725, 0.85]],
            [0.47, [0.25, 0.375, 0.5, 0.625, 0.75]],
            [0.6, [0.31, 0.44, 0.56, 0.69]],
            [0.72, [0.375, 0.5, 0.625]],
            [0.83, [0.44, 0.56]],
          ]
    return rows.flatMap(([y, xs]) => xs.map((x) => ({ x, y })))
  }
  if (n === 13) {
    // 4 + 5 + 4 со смещением, как сотами
    const rows = [4, 5, 4]
    const out: { x: number; y: number }[] = []
    rows.forEach((k, r) => {
      for (let c = 0; c < k; c++) out.push({ x: 0.5 + (c - (k - 1) / 2) * 0.175, y: 0.27 + r * 0.23 })
    })
    return out
  }
  if (n === 16) return grid(4, 4, 0.12)
  if (n === 24) return grid(6, 4, 0.1)
  return grid(8, 8, 0.07)
}
export const skCellSize = (box: SkBox) =>
  ({ 5: 0.155, 10: 0.15, 13: 0.14, 16: 0.185, 24: box.shape === 'heart' ? 0.108 : 0.125, 64: 0.1 })[box.cells] || 0.12

// Меню оригинала: группы «Шоколадные подарки»
export const skGiftGroups: { g: SkSection['g']; n: string }[] = [
  { g: 'occasion', n: 'По случаю' },
  { g: 'whom', n: 'Для кого' },
  { g: 'holiday', n: 'Праздники' },
  { g: 'calendar', n: 'Календарь' },
]
export const skSection = (id: string) => skSections.find((s) => s.id === id)
export const skVisible = (g: SkSection['g']) => skSections.filter((s) => s.g === g && s.count > 0)
export const skProduct = (id: string) => skProducts.find((p) => p.id === id)
export const skInSection = (id: string) => skProducts.filter((p) => p.s.includes(id) || p.c === id)

// Деньги и слова
export const skRub = (n: number) => `${Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ')} ₽`
export const skPlural = (n: number, one: string, few: string, many: string) => {
  const a = Math.abs(n) % 100
  const b = a % 10
  if (a > 10 && a < 20) return many
  if (b > 1 && b < 5) return few
  if (b === 1) return one
  return many
}
export const skShortName = (n: string) => n.replace(/\s*,\s*\d+[.,]?\d*\s*(г|гр|кг)\.?$/i, '').replace(/^"|"$/g, '')
export const skWeight = (p: SkProduct) => {
  const m = p.n.match(/(\d+[.,]?\d*)\s*(г|гр|кг)\.?\b/i)
  if (m) return `${m[1]} ${m[2].toLowerCase() === 'кг' ? 'кг' : 'г'}`
  const f = p.f['Вес']
  return f ? f.replace(/\s*(гр|г)\.?$/i, ' г').replace(/(\d)(г)/, '$1 г') : ''
}
export const skDiscount = (p: SkProduct) => (p.o > p.p ? Math.round((1 - p.p / p.o) * 100) : 0)

// Доставка: тарифы со страницы «Доставка и оплата»
export const SK_FREE_FROM = 4000
export const SK_COURIER = 450
export interface SkCity {
  n: string
  r: string
  zone: 'msk' | 'mo' | 'region'
}
export const skCities: SkCity[] = [
  { n: 'Москва', r: 'Москва', zone: 'msk' },
  { n: 'Санкт-Петербург', r: 'Санкт-Петербург', zone: 'msk' },
  { n: 'Химки', r: 'Московская область', zone: 'mo' },
  { n: 'Красногорск', r: 'Московская область', zone: 'mo' },
  { n: 'Балашиха', r: 'Московская область', zone: 'mo' },
  { n: 'Мытищи', r: 'Московская область', zone: 'mo' },
  { n: 'Одинцово', r: 'Московская область', zone: 'mo' },
  { n: 'Подольск', r: 'Московская область', zone: 'mo' },
  { n: 'Люберцы', r: 'Московская область', zone: 'mo' },
  { n: 'Королёв', r: 'Московская область', zone: 'mo' },
  { n: 'Рязань', r: 'Рязанская область', zone: 'region' },
  { n: 'Касимов', r: 'Рязанская область', zone: 'region' },
  { n: 'Тверь', r: 'Тверская область', zone: 'region' },
  { n: 'Тула', r: 'Тульская область', zone: 'region' },
  { n: 'Владимир', r: 'Владимирская область', zone: 'region' },
  { n: 'Нижний Новгород', r: 'Нижегородская область', zone: 'region' },
  { n: 'Казань', r: 'Республика Татарстан', zone: 'region' },
  { n: 'Екатеринбург', r: 'Свердловская область', zone: 'region' },
  { n: 'Новосибирск', r: 'Новосибирская область', zone: 'region' },
  { n: 'Краснодар', r: 'Краснодарский край', zone: 'region' },
  { n: 'Ростов-на-Дону', r: 'Ростовская область', zone: 'region' },
  { n: 'Самара', r: 'Самарская область', zone: 'region' },
  { n: 'Воронеж', r: 'Воронежская область', zone: 'region' },
  { n: 'Ярославль', r: 'Ярославская область', zone: 'region' },
]
export const skDeliveryZones = [
  { n: 'Москва и Санкт-Петербург', price: 'до 3 999 ₽ — 450 ₽, от 4 000 ₽ — бесплатно', time: 'пн–пт 9:00–18:00' },
  { n: 'Ближнее Подмосковье, до 10 км от МКАД', price: 'от 550 ₽, точнее — при подтверждении заказа', time: 'пн–пт 9:00–18:00' },
  { n: 'Дальнее Подмосковье, 10–20 км от МКАД', price: 'оговаривается индивидуально', time: 'по договорённости' },
  { n: 'Другие города и регионы', price: 'до 5 кг — 1 500 ₽, тяжелее — индивидуально', time: 'курьер созвонится по прибытии' },
  { n: 'Юридические лица', price: 'индивидуально: по объёму и удалённости', time: 'по договорённости' },
]
// Цена курьера для суммы заказа; null — «уточнит менеджер»
export const skCourierPrice = (zone: SkCity['zone'], sum: number): number | null => {
  if (zone === 'msk') return sum >= SK_FREE_FROM ? 0 : SK_COURIER
  if (zone === 'mo') return 550
  return 1500
}
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const DAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
export const skDay = (d: Date, withDay = true) => `${withDay ? DAYS[d.getDay()] + ', ' : ''}${d.getDate()} ${MONTHS[d.getMonth()]}`
// Как в карточке оригинала: Москва — со следующего дня, окно 4 дня; регионы — 3–7 дней
export const skDeliveryDates = (zone: SkCity['zone'], now = new Date()) => {
  const a = new Date(now)
  const b = new Date(now)
  if (zone === 'region') {
    a.setDate(a.getDate() + 3)
    b.setDate(b.getDate() + 7)
  } else {
    a.setDate(a.getDate() + 1)
    b.setDate(b.getDate() + 4)
  }
  return `${skDay(a, false)} – ${skDay(b, false)}`
}

export const skCorpScale = [
  { from: 10000, pct: 5, label: 'от 10 000 ₽' },
  { from: 15000, pct: 10, label: 'от 15 000 ₽' },
  { from: 20000, pct: 15, label: 'от 20 000 ₽' },
  { from: 40000, pct: 20, label: 'от 40 000 ₽' },
  { from: 100000, pct: 25, label: 'от 100 000 ₽' },
]

// Мастер именной упаковки: дизайны крышки по поводам (оригинал: теги «Все / День рождения / с фото / без фото / Любовь»)
export const skPackTags = ['Все', 'День рождения', 'С фото', 'Без фото', 'Любовь']
export const skPackDesigns = [
  { id: 'd1', n: 'Золотой ромб', tags: ['Без фото'], bg: '#643335', fg: '#e8c4a8' },
  { id: 'd2', n: 'С днём рождения', tags: ['День рождения', 'Без фото'], bg: '#f3dfd3', fg: '#643335' },
  { id: 'd3', n: 'Фото в рамке', tags: ['С фото', 'День рождения'], bg: '#2b1a19', fg: '#e8c4a8' },
  { id: 'd4', n: 'С любовью', tags: ['Любовь', 'Без фото'], bg: '#7a2638', fg: '#f6d9cf' },
  { id: 'd5', n: 'Фото и сердце', tags: ['Любовь', 'С фото'], bg: '#f6e6e8', fg: '#7a2638' },
  { id: 'd6', n: 'Классика Deluxe', tags: ['Без фото'], bg: '#efe3dc', fg: '#8a5a44' },
]

export const skTopLinks: [string, string][] = [
  ['/korporativnym/', 'Корпоративным клиентам'],
  ['/o-kompanii/', 'О компании'],
  ['/butiki/', 'Бутики'],
  ['/dostavka/', 'Доставка и оплата'],
  ['/loyalnost/', 'Лояльность'],
  ['/blog/', 'Блог'],
  ['/vakansii/', 'Вакансии'],
  ['/kontakty/', 'Контакты'],
  ['/faq/', 'FAQ'],
]

export const skNewYear = {
  title: 'Сияние волшебства',
  lead: 'Новогодняя коллекция подарков',
  section: 'na-novyy-god',
  banner: `${SK_IMG}efe/v5gitf05hmntk9ww4h9t84dib5if76vz.jpg`,
  banners: [
    `${SK_IMG}efe/v5gitf05hmntk9ww4h9t84dib5if76vz.jpg`,
    `${SK_IMG}504/3a8v5eh1u9q1rc5579pq62q3lbew55wi.jpg`,
    `${SK_IMG}fcd/voz2xjmmbj1od5ejw1cbud1ewwr3cfyh.jpg`,
  ],
}
