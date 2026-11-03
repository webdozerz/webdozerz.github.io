// Прайс «Мёд и Соты» (ИП Чурсин А. В., Алтайский край) снят с https://22bee.ru/ в ноябре 2026 (лендинг Megagroup):
// все 9 позиций блока «Мёд весовой в куботейнерах оптом» с лесенкой цен «от 34 кг / от 200 кг», наличием и годом сбора.
// Фото, документы и скриншоты отзывов скопированы в public/redesign/22bee/img/: у Megagroup превью режутся
// под их сетку (550×311, 280×200), а лайтбоксу нужны крупные кадры. Фото сортов — как на сайте, вместе с повторами
// (у «Дягилевого» и «Разнотравья тёмного», «Горного» и «Таёжного» одна картинка) — это пункт для письма.

export interface BzTier {
  from: number
  price: number
}
export interface BzSort {
  id: string
  title: string
  short: string
  img: string
  stock: boolean
  tiers: [BzTier, BzTier]
  // соты продают рамками, остальное — куботейнерами по 34 кг
  frames?: boolean
}

export const bzCube = 34
export const bzBulk = 200
export const bzMinFrames = 10
export const bzYear = 2026

const img = (f: string) => `/redesign/22bee/img/${f}`

export const bzSorts: BzSort[] = [
  { id: 'dyagilevyj', title: 'Мёд «Дягилевый»', short: 'Дягилевый', img: img('sort-dark.jpg'), stock: true, tiers: [{ from: 34, price: 490 }, { from: 200, price: 480 }] },
  { id: 'gornyj', title: 'Мёд «Горный»', short: 'Горный', img: img('sort-gorny.jpg'), stock: true, tiers: [{ from: 34, price: 410 }, { from: 200, price: 390 }] },
  { id: 'grechishnyj', title: 'Мёд «Гречишный»', short: 'Гречишный', img: img('sort-grechka.jpg'), stock: true, tiers: [{ from: 34, price: 260 }, { from: 200, price: 250 }] },
  { id: 'raznotravie', title: 'Мёд «Разнотравье»', short: 'Разнотравье', img: img('sort-raznotravie.jpg'), stock: true, tiers: [{ from: 34, price: 270 }, { from: 200, price: 260 }] },
  { id: 'raznotravie-stepnoe', title: 'Мёд «Разнотравье степное»', short: 'Разнотравье степное', img: img('sort-stepnoe.jpg'), stock: true, tiers: [{ from: 34, price: 250 }, { from: 200, price: 240 }] },
  { id: 'raznotravie-temnoe', title: 'Мёд «Разнотравье тёмное»', short: 'Разнотравье тёмное', img: img('sort-dark.jpg'), stock: true, tiers: [{ from: 34, price: 250 }, { from: 200, price: 230 }] },
  { id: 'taezhnyj', title: 'Мёд «Таёжный»', short: 'Таёжный', img: img('sort-gorny.jpg'), stock: false, tiers: [{ from: 34, price: 320 }, { from: 200, price: 300 }] },
  { id: 'donnikovyj', title: 'Мёд «Донниковый»', short: 'Донниковый', img: img('sort-donnik.jpg'), stock: false, tiers: [{ from: 34, price: 530 }, { from: 200, price: 520 }] },
  { id: 'soty', title: 'Мёд в сотах', short: 'В сотах', img: img('sort-soty.jpg'), stock: true, frames: true, tiers: [{ from: 34, price: 430 }, { from: 200, price: 420 }] },
]

export const bzSort = (id: string) => bzSorts.find((s) => s.id === id)
export const bzMinPrice = Math.min(...bzSorts.map((s) => s.tiers[1].price))
export const bzInStock = bzSorts.filter((s) => s.stock).length

export const bzPath = (p = '') => `/redesign/22bee${p || '/'}`
export const bzSortPath = (id: string) => bzPath(`/med/${id}`)

const rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
export const bzMoney = (n: number) => `${rub.format(Math.round(n))} ₽`
export const bzKg = (n: number) => `${rub.format(n)} кг`

const plural = (n: number, one: string, few: string, many: string) => {
  const a = Math.abs(n) % 100
  const b = a % 10
  if (a > 10 && a < 20) return many
  if (b > 1 && b < 5) return few
  if (b === 1) return one
  return many
}
export const bzCubes = (n: number) => `${n} ${plural(n, 'куботейнер', 'куботейнера', 'куботейнеров')}`
export const bzFramesLabel = (n: number) => `${n} ${plural(n, 'рамка', 'рамки', 'рамок')}`

// Ступень цены по весу сорта: до 200 кг — первая, от 200 кг — вторая
export const bzTierOf = (s: BzSort, kg: number) => (kg >= bzBulk ? s.tiers[1] : s.tiers[0])
// Сколько куботейнеров ещё добрать до цены «от 200 кг»
export const bzCubesToBulk = (cubes: number) => Math.max(0, Math.ceil(bzBulk / bzCube) - cubes)

export const bzContacts = {
  brand: 'Мёд и Соты',
  motto: 'Попробуй настоящее',
  email: 'med22bee@yandex.ru',
  hours: 'Ежедневно с 8:00 до 19:00',
  tz: 'UTC+7 (МСК+4)',
  region: 'Алтайский край, г. Барнаул',
  legal: 'ИП Чурсин Александр Викторович, ИНН 226600036784, ОГРНИП 312226108100010',
  address: '658540, Алтайский край, с. Ребриха',
  original: 'https://22bee.ru/',
}

export const bzAdvantages = [
  { icon: 'hive', title: 'Свои пасеки', text: 'Есть реальные пасеки в собственности' },
  { icon: 'doc', title: 'Уверенность в продукте 100%', text: 'Договор поставки, паспорт пасеки, протокол испытаний мёда в лаборатории, вет. свидетельство' },
  { icon: 'shield', title: 'Меркурий', text: 'Работаем в системе Меркурий' },
  { icon: 'repeat', title: 'Надёжное партнёрство', text: 'Большинство клиентов возвращаются и делают повторные заказы' },
  { icon: 'tag', title: 'Выгодная цена', text: 'Скидки на повторные заказы' },
]

export const bzPayment = [
  'Безналичный расчёт по QR-коду на счёт ИП, оплата по счёту на расчётный счёт ИП',
  'Система быстрых платежей',
  'Предоплата 100%',
]
export const bzDelivery = [
  'Наш мёд находится в деревне, поэтому после оплаты мёд отправляется в течение 2–5 рабочих дней, с ближайшей поездкой в Барнаул',
  'Доставка транспортными компаниями. Стоимость доставки оплачивается покупателем при получении заказа',
  'Срок и стоимость доставки зависят от вашего местоположения. При оформлении заказа подберём наиболее выгодный вариант',
]

export const bzDocs = [
  'Протокол испытания 1',
  'Протокол испытания 2',
  'Протокол испытания 3',
  'Паспорт пасеки',
  'Паспорт пасеки',
  'Паспорт пасеки',
  'Протокол испытаний',
  'Протокол испытаний',
  'Сертификат',
  'Сертификат 2',
  'Результат исследования',
].map((title, i) => ({ title, img: img(`docs/doc-${String(i + 1).padStart(2, '0')}.jpg`) }))

export const bzReviews = Array.from({ length: 27 }, (_, i) => ({
  title: 'Отзыв покупателя',
  img: img(`reviews/r-${String(i + 1).padStart(2, '0')}.jpg`),
}))

export const bzPhotos = [
  { img: img('beekeeper.jpg'), title: 'Осмотр рамок на пасеке', wide: true },
  { img: img('frame-soty.jpg'), title: 'Рамка с запечатанным мёдом' },
  { img: img('pour-light.jpg'), title: 'Светлый мёд' },
  { img: img('hives.jpg'), title: 'Ульи на пасеке' },
  { img: img('jars-field.jpg'), title: 'Мёд нового сбора', wide: true },
  { img: img('pour-dark.jpg'), title: 'Тёмный мёд' },
  { img: img('frame-check.jpg'), title: 'Рамки перед откачкой' },
  { img: img('hives-row.jpg'), title: 'Пасека', wide: true },
]
