// Концепт редизайна domoteka.com — фабрика столов и стульев «Домотека», Москва (Красная Пахра).
// Данные сняты с сайта в ноябре 2026: модели и варианты — в utils/domoteka.data.ts, здесь — справочники и хелперы.
// Цен и корзины у оригинала нет (продажи через дилеров и маркетплейсы) — в концепте их тоже нет.

export interface DmOpt {
  id: string
  n: string
  sw: string
}
export interface DmOffer {
  id: string
  c: string
  l: string
  ph: string[]
}
export interface DmSize {
  l: number
  w: number
  h: number | null
  ext: number | null
}
export interface DmProduct {
  id: string
  n: string
  series: string
  type: string
  sec: 'stoly' | 'stulya'
  size: DmSize | null
  shape: string | null
  mech: string | null
  mk: string | null
  kitchen: string[]
  sk: string | null
  style: string | null
  specs: [string, string][]
  colorLabel: string
  colors: DmOpt[]
  legs: DmOpt[]
  offers: DmOffer[]
  video: string | null
  desc: string | null
  tags: string[]
  url: string
}
export interface DmNews {
  t: string
  d: string
  u: string
}

export const DM_ORIG = 'https://domoteka.com/'
export const dmPath = (p = '/') => `/redesign/domoteka${p}`
export const dmImg = (p: string) => `/redesign/domoteka/img/${p}`
export const dmOrig = (p: string) => (p.startsWith('http') ? p : `https://domoteka.com${p}`)

// Разделы — как в меню «Столы → Тип» оригинала, числа — их счётчики позиций
export const dmTypes = [
  { id: 'ldsp', n: 'Столы из ЛДСП', short: 'Из ЛДСП', count: 144, img: '9670' },
  { id: 'pismennye', n: 'Письменные столы', short: 'Письменные', count: 34, img: '' },
  { id: 'kamen', n: 'Столы с камнем', short: 'С камнем', count: 6, img: '3185' },
  { id: 'keramogranit', n: 'Столы с керамогранитом', short: 'С керамогранитом', count: 4, img: '' },
  { id: 'steklo', n: 'Столы со стеклом', short: 'Со стеклом', count: 14, img: '' },
  { id: 'steklyannye', n: 'Стеклянные столы', short: 'Стеклянные', count: 2, img: '' },
]
export const dmSeries = ['Альфа', 'Блюз', 'Вальс', 'Вита', 'Гамма', 'Дельта', 'Диско', 'Марио', 'Мартин', 'Оскар', 'Романс', 'Румба', 'Танго']
export const dmChairStyles = ['Классический', 'Современный', 'Хай-тек', 'Кантри', 'Прованс']
export const dmKitchen = [
  { id: 's', n: 'до 7 м²', hint: 'компактные' },
  { id: 'm', n: '8–15 м²', hint: 'на семью' },
  { id: 'l', n: 'от 16 м²', hint: 'для гостей' },
]
export const dmSizes = [
  { id: '90x60', n: '90×60' },
  { id: '110x70', n: '110×70' },
  { id: '120x80', n: '120×80' },
  { id: '110x110', n: '110×110' },
]
export const dmMech = [
  { id: 'fixed', n: 'Нераскладной' },
  { id: 'slide', n: 'Раздвижной' },
  { id: 'butterfly', n: 'Синхронно-раздвижной (Butterfly)' },
  { id: 'insert', n: 'Синхронно-раздвижной (вставка цельная)' },
]

export const dmContacts = {
  phone: '+7 (499) 962-40-38',
  tel: '+74999624038',
  claimNote: 'доб. 3 — отдел рекламаций',
  sales: 'sales@domoteka.com',
  emails: [
    { label: 'Оптовый отдел', mail: 'sales@domoteka.com' },
    { label: 'Коммерческий отдел', mail: 'com@domoteka.com' },
    { label: 'Отдел рекламаций', mail: 'claim@domoteka.com' },
    { label: 'Снабжение', mail: 'snab@domoteka.com' },
  ],
  address: '108828, г. Москва, с. Красная Пахра, д. 27',
  addressShort: 'Москва, с. Красная Пахра, д. 27',
  addressNote: 'офис, производство и склад',
  hours: 'Пн\u2060–\u2060Пт 8:00\u2060–\u206017:00, обед 12:00\u2060–\u206013:00',
  hoursShort: 'Пн–Пт 8–17',
  geo: [55.434427, 37.281665] as [number, number],
  requisites: [
    ['Организация', 'ООО «ДОМОТЕКА»'],
    ['ИНН', '5074024767'],
    ['КПП', '775101001'],
    ['БИК', '044525225'],
    ['Банк', 'ПАО «Сбербанк России», г. Москва'],
  ] as [string, string][],
}
export const dmMessengers = [
  { id: 'tg', n: 'Telegram', url: 'https://t.me/DomotekaST' },
  { id: 'wa', n: 'WhatsApp', url: 'https://api.whatsapp.com/send?phone=79920612695' },
  { id: 'max', n: 'MAX', url: 'https://max.ru/u/f9LHodD0cOI4DGUA5ewW6fly1Iksp7gYPG1XW-CByCMaSaL-4uTG63cv3zc' },
  { id: 'vk', n: 'ВКонтакте', url: 'https://vk.com/domotekacom' },
]

export const dmMarkets = [
  { n: 'Ozon', img: 'mp/4.jpg', url: 'https://www.ozon.ru/seller/domoteka-stulya-i-stoly-dlya-kuhni-221051/products/?miniapp=seller_221051' },
  { n: 'Wildberries', img: 'mp/5.jpg', url: 'https://www.wildberries.ru/brands/domoteka' },
  {
    n: 'Яндекс Маркет',
    img: 'mp/6.jpg',
    url: 'https://market.yandex.ru/search?suggest_text=%D0%94%D0%BE%D0%BC%D0%BE%D1%82%D0%B5%D0%BA%D0%B0',
  },
  { n: 'Лемана Про', img: 'mp/2.jpg', url: 'https://lemanapro.ru/brands/domoteka/' },
  { n: 'Лайфмебель', img: 'mp/3.jpg', url: 'https://lifemebel.ru/brand/domoteka/' },
  {
    n: 'Avito',
    img: 'mp/1.jpg',
    url: 'https://www.avito.ru/brands/bc1ebc46ef6bb326c85d110e079120dc/all/mebel_i_interer',
  },
]

// Магазины-дилеры Москвы со страницы /dealers/Moskva; точки — OpenStreetMap по адресу
export const dmDealers = [
  {
    id: 'shokolad',
    n: 'ТРЦ «Шоколад»',
    addr: 'г. Реутов, 2-й км МКАД, ТРЦ «Шоколад», 3-й этаж',
    phone: '8-926-143-97-09',
    tel: '+79261439709',
    geo: [55.762742, 37.845143] as [number, number] | null,
  },
  {
    id: 'moskva',
    n: 'МЦ «Москва»',
    addr: 'г. Москва, Каширское шоссе, д. 61, к. 3А',
    phone: '',
    tel: '',
    geo: [55.616355, 37.716325] as [number, number] | null,
  },
  {
    id: 'interer',
    n: 'Магазин «Интерьер»',
    addr: 'г. Москва, ул. Братиславская, д. 18, к. 1',
    phone: '',
    tel: '',
    geo: [55.657533, 37.759741] as [number, number] | null,
  },
  {
    id: 'lifemebel',
    n: 'Интернет-магазин «Лайфмебель»',
    addr: 'доставка по Москве и области',
    phone: '',
    tel: '',
    geo: null as [number, number] | null,
  },
]
// В шапке оригинала выбор из 268 городов; в концепте — несколько для примера, список Москвы настоящий
export const dmCities = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Новосибирск', 'Краснодар', 'Томск']

// «Почему с нами выгодно сотрудничать» — 10 пунктов оригинала
export const dmAdvantages = [
  { icon: 'horn', t: 'Поддержка вашего бизнеса нашей рекламной продукцией' },
  { icon: 'factory', t: 'Стабильная работа фабрики с 1989 года' },
  { icon: 'table', t: 'Узкая специализация — столы и стулья' },
  { icon: 'tag', t: 'Гибкая система скидок' },
  { icon: 'spark', t: 'Регулярный выпуск новых моделей' },
  { icon: 'truck', t: 'Доставка разными способами' },
  { icon: 'shield', t: 'Высокое качество продукции' },
  { icon: 'pin', t: 'Удобное расположение склада' },
  { icon: 'medal', t: 'Гарантия на продукцию — 1,5 года' },
  { icon: 'box', t: 'Отгрузка товара в день оплаты' },
]

export const dmInstructions = [
  ['Альфа', 'Инструкция Альфа самосборная.pdf'],
  ['Болеро', 'Инструкция Болеро.pdf'],
  ['Вальс О, Вальс ПО', 'Инструкция Вальс О, Вальс ПО.pdf'],
  ['Вальс О (03)', 'Инструкция Вальс О (03).pdf'],
  ['Вита К', 'Инструкция Вита К металлические царги.pdf'],
  ['Вита К (03)', 'Инструкция Вита К (03).pdf'],
  ['Вита К-3', 'Инструкция Вита К-3 металлические царги.pdf'],
  ['Джаз', 'Инструкция Джаз самосборный.pdf'],
  ['Дельта и Гамма', 'Инструкция стола Дельта К - Гамма на 94 и 96 ножке.pdf'],
  ['Дуэт и Квартет', 'Инструкция Дуэт и Квартет 96 ножке.pdf'],
  ['Диско О, Диско К, Диско КВ', 'Инструкция Диско О, Диско К, Диско КВ.pdf'],
  ['Диско К (05)', 'Инструкция Диско К (05 ножка).pdf'],
  ['Марио', 'Инструкция Марио.pdf'],
  ['Мартин', 'Инструкция Мартин.pdf'],
  ['Оскар', 'Инструкция Оскар.pdf'],
  ['Романс К', 'Инструкция Романс К.pdf'],
  ['Романс О, Романс ПО, Блюз О', 'Инструкция Романс О, Романс ПО, Блюз О.pdf'],
  ['Романс О (03)', 'Инструкция Романс О (03).pdf'],
  ['Танго О, Танго К, Танго ПР, Танго ПО', 'Инструкция Танго О, Танго К, Танго ПР, Танго ПО.pdf'],
  ['Томас', 'Инструкция Томас.pdf'],
  ['Твист', 'Инструкция Твист.pdf'],
].map(([n, f]) => ({ n: `Столы ${n}`, series: n.split(/[ ,]/)[0], url: `https://domoteka.com/upload/instructions/${encodeURIComponent(f)}` }))

// Интерьерные кадры слайдера главной: подпись — серия на снимке
export const dmInteriors = [
  ['1', 'Дельта К-1'],
  ['2', 'Гамма ПР'],
  ['3', 'Марио 1'],
  ['4', 'Вальс О-2'],
  ['5', 'Гамма ПР'],
  ['6', 'Альфа ПР'],
  ['7', 'Дуэт'],
  ['8', 'Вита К-2'],
  ['9', 'Дельта К-М'],
  ['10', 'Томас 1'],
  ['11', 'Вита К-3'],
  ['12', 'Оскар 1'],
].map(([i, n]) => ({ img: `i/${i}.jpg`, n }))

// ---------- хелперы ----------
export const dmFindOffer = (p: DmProduct, c?: string, l?: string) =>
  p.offers.find((o) => o.c === c && o.l === l) || p.offers.find((o) => o.c === c) || p.offers.find((o) => o.l === l) || p.offers[0]
export const dmOfferImg = (o?: DmOffer) => (o ? dmImg(`p/${o.id}.jpg`) : '')
export const dmSizeText = (p: DmProduct) => {
  const s = p.size
  if (!s) return ''
  if (p.sec === 'stulya') return `${s.w}×${s.l}${s.h ? `×${s.h}` : ''} см`
  return `${s.l}×${s.w} см`
}
export const dmExtText = (p: DmProduct) => (p.size?.ext ? `${p.size.ext} см` : '')
export const dmMechShort = (p: DmProduct) =>
  ({ fixed: 'нераскладной', slide: 'раздвижной', butterfly: 'бабочка', insert: 'раскладной' })[p.mk || ''] || ''
export const dmTypeName = (id: string) => dmTypes.find((t) => t.id === id)?.n || (id === 'stulya' ? 'Стулья' : '')
// Название цвета без кода: «БЛ (белый)» → «белый», «Бел стп Бел» остаётся
export const dmColorName = (n: string) => {
  const m = n.match(/\(([^)]+)\)/)
  return m ? m[1].toLowerCase() : n
}
export const dmCode = (n: string) => n.replace(/\s*\([^)]*\)/, '')
export const dmInstructionFor = (p: DmProduct) => dmInstructions.find((i) => i.series === p.series)
export const dmYoutubeId = (u: string | null) => u?.match(/embed\/([\w-]+)/)?.[1] || ''
export const dmPlural = (n: number, forms: [string, string, string]) => {
  const a = Math.abs(n) % 100
  const b = a % 10
  if (a > 10 && a < 20) return forms[2]
  if (b > 1 && b < 5) return forms[1]
  if (b === 1) return forms[0]
  return forms[2]
}
