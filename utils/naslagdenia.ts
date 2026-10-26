// Концепт редизайна кондитерской «Наслаждение» (naslagdenia.com, MODX + miniShop2), Новосибирск.
// Каталог, магазины и отзывы — в naslagdeniaData.ts; здесь разделы, условия со страниц сайта и расчёты.
import { nsProducts, type NsProduct, type NsSectionId, type NsShop } from './naslagdeniaData'

export const nsPath = (p = '/') => `/redesign/naslagdenia${p === '/' ? '/' : p}`

export interface NsSection {
  id: NsSectionId
  title: string
  short: string
  /** Готовые продаются штукой (коробкой), заказные — по весу к дате. */
  kind: 'ready' | 'custom'
  icon: string
  lead: string
}

export const nsSections: NsSection[] = [
  {
    id: 'standard',
    icon: 'slice',
    title: 'Готовые торты',
    short: 'Готовые',
    kind: 'ready',
    lead: 'Свежие торты, которые каждый день есть в наших магазинах. По Новосибирску доставляем бесплатно, кроме Советского и Первомайского районов.',
  },
  {
    id: 'pie',
    icon: 'cupcake',
    title: 'Пирожные',
    short: 'Пирожные',
    kind: 'ready',
    lead: 'На сайте — коробками по 8–12 штук, минимальный заказ 300 ₽. Поштучно — в магазинах.',
  },
  {
    id: 'holiday',
    icon: 'party',
    title: 'Праздничные торты',
    short: 'Праздничные',
    kind: 'custom',
    lead: 'Торты на юбилей, день рождения и любой праздник. На фото — вид будущего торта, начинку выбираете из наших готовых тортов.',
  },
  {
    id: 'wedding',
    icon: 'rings',
    title: 'Свадебные торты',
    short: 'Свадебные',
    kind: 'custom',
    lead: 'Многоярусные и одноярусные торты на свадьбу. Свадебный торт — от 3 кг, заявка за 3–7 дней.',
  },
  {
    id: 'child',
    icon: 'bear',
    title: 'Детские торты',
    short: 'Детские',
    kind: 'custom',
    lead: 'Торты на детский праздник по фото из каталога. Готовность — 3–7 суток.',
  },
  {
    id: 'photo',
    icon: 'camera',
    title: 'Фототорты',
    short: 'Фототорты',
    kind: 'custom',
    lead: 'Печатаем вашу фотографию или картинку на торте. Заявка — за 3–5 дней.',
  },
  {
    id: 'corporate',
    icon: 'briefcase',
    title: 'Корпоративные торты',
    short: 'Корпоративные',
    kind: 'custom',
    lead: 'Торты на корпоратив и юбилей компании по фото из каталога.',
  },
]

export const nsSection = (id: NsSectionId) => nsSections.find((s) => s.id === id)!
export const nsIsCustom = (p: NsProduct) => nsSection(p.section).kind === 'custom'
export const nsCount = (id: NsSectionId) => nsProducts.filter((p) => p.section === id).length
export const nsFind = (id: string) => nsProducts.find((p) => p.id === id)

// «Торт Барбара» → «Барбара», «Пирожное Джаз, 10 шт.» → «Джаз»: раздел и так виден.
export const nsShort = (p: NsProduct) =>
  p.title
    .replace(/^(Торт|Пирожное)\s+/, '')
    .replace(/,\s*\d+\s*шт\.?$/, '')
    .replace(/"/g, '«')
    .replace(/«([^«]*)«/, '«$1»')

// Начинка заказного торта — «из стандартной продукции», т. е. из готовых тортов.
export const nsFillings = nsProducts.filter((p) => p.section === 'standard')

export const nsContacts = {
  name: 'Кондитерская «Наслаждение»',
  phone: '+7 (952) 932-73-09',
  phoneHref: 'tel:+79529327309',
  email: 'lenina9@naslagdenia.com',
  original: 'https://naslagdenia.com/',
  since: 1999,
  reviewLinks: [
    { title: 'Фламп', href: 'https://novosibirsk.flamp.ru/search/%D0%BD%D0%B0%D1%81%D0%BB%D0%B0%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5' },
    { title: '2ГИС', href: 'https://2gis.ru/novosibirsk/branches/141274359280166' },
    { title: 'Яндекс Карты', href: 'https://yandex.ru/maps/65/novosibirsk/chain/naslazhdenie/2891328254/' },
  ],
}

// Условия — цитаты со страницы «Оплата и доставка» и страниц разделов.
export const nsRules = {
  orderFrom: 8,
  orderTo: 17,
  deliveryFrom: 9,
  deliveryTo: 19,
  minDeliveryHours: 2,
  customMin: 1.5,
  weddingMin: 3,
  bigWeight: 7,
  prepay: 0.3,
  pieMinSum: 300,
}

export type NsZoneId = 'left' | 'right' | 'sovetsky' | 'pervomaysky'
export const nsZones: { id: NsZoneId; title: string; short: string; note: string }[] = [
  { id: 'left', title: 'Левый берег', short: 'Левый берег', note: 'Привезём в 2-часовом интервале до указанного времени' },
  { id: 'right', title: 'Правый берег', short: 'Правый берег', note: 'Привезём в 3-часовом интервале до указанного времени' },
  { id: 'sovetsky', title: 'Советский район', short: 'Советский р-н', note: 'Доставка с доплатой, сумму назовёт менеджер' },
  { id: 'pervomaysky', title: 'Первомайский район', short: 'Первомайский р-н', note: 'Доставка с доплатой, сумму назовёт менеджер' },
]

export const nsMoney = (n: number) => `${Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ')} ₽`
export const nsKg = (n: number) => `${String(n).replace('.', ',')} кг`
export const nsPlural = (n: number, one: string, few: string, many: string) => {
  const a = n % 10
  const b = n % 100
  if (a === 1 && b !== 11) return one
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few
  return many
}

// Время Новосибирска (UTC+7) независимо от часового пояса посетителя.
export const nsNow = () => {
  const d = new Date(Date.now() + 7 * 3600 * 1000)
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), h: d.getUTCHours(), min: d.getUTCMinutes(), wd: d.getUTCDay() }
}

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
// Винительный падеж: «приготовим к среде» не нужен — пишем «в среду, 29 октября».
const WD_ACC = ['в воскресенье', 'в понедельник', 'во вторник', 'в среду', 'в четверг', 'в пятницу', 'в субботу']
const WD_SHORT = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']

/** ISO-дата (YYYY-MM-DD) через `days` дней от сегодняшнего дня в Новосибирске. */
export const nsIsoAfter = (days: number) => {
  const n = nsNow()
  const d = new Date(Date.UTC(n.y, n.m, n.d + days))
  return d.toISOString().slice(0, 10)
}
const parseIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}
export const nsDateText = (iso: string, withDay = true) => {
  const d = parseIso(iso)
  const text = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
  return withDay ? `${WD_ACC[d.getUTCDay()]}, ${text}` : text
}
export const nsDateShort = (iso: string) => {
  const d = parseIso(iso)
  return `${WD_SHORT[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Когда привезут готовый торт, если оформить сейчас: заявки 8–17, доставка 9–19, минимум 2 часа. */
export const nsReadyEta = () => {
  const n = nsNow()
  const minutes = n.h * 60 + n.min
  const { orderFrom, orderTo, minDeliveryHours } = nsRules
  if (minutes < orderFrom * 60)
    return { today: true, text: `сегодня с ${orderFrom + minDeliveryHours}:00`, short: `с ${orderFrom + minDeliveryHours}:00` }
  if (minutes >= orderTo * 60) return { today: false, text: `завтра с ${orderFrom + minDeliveryHours}:00`, short: `завтра` }
  const at = Math.ceil((minutes + minDeliveryHours * 60) / 30) * 30
  const t = `${pad(Math.floor(at / 60))}:${pad(at % 60)}`
  return { today: true, text: `сегодня к ${t}`, short: `к ${t}` }
}

export const nsClock = () => {
  const n = nsNow()
  return `${pad(n.h)}:${pad(n.min)}`
}

/** Минимальный вес заказного торта: свадебный — от 3 кг, остальные — от 1,5 кг («Оплата и доставка»). */
export const nsMinWeight = (p: NsProduct) => (p.section === 'wedding' ? nsRules.weddingMin : nsRules.customMin)

/** Срок заявки: до 7 кг — за 3 дня, тяжелее — за 7 дней. */
export const nsLeadDays = (weight: number) => (weight > nsRules.bigWeight ? 7 : 3)

/** Ориентир для расчёта: около 150 г торта на гостя, с шагом 0,5 кг. */
export const nsWeightForGuests = (guests: number, min: number) => Math.max(min, Math.ceil((guests * 0.15) / 0.5) * 0.5)
export const nsGuestsForWeight = (weight: number) => Math.floor(weight / 0.15)

export const nsSlots = ['9:00–11:00', '11:00–13:00', '13:00–15:00', '15:00–17:00', '17:00–19:00']

/** Яндекс-карта без ключа: все магазины метками с номерами, или один магазин крупно. */
export const nsMapUrl = (shops: NsShop[], focus?: NsShop) => {
  const pt = shops.map((s, i) => `${s.lon},${s.lat},pm2rd${focus?.id === s.id ? 'l' : 'm'}${i + 1}`).join('~')
  const ll = focus ? `${focus.lon},${focus.lat}` : '82.92,55.01'
  return `https://yandex.ru/map-widget/v1/?ll=${ll}&z=${focus ? 15 : 10}&pt=${pt}`
}
export const nsRouteUrl = (s: NsShop) => `https://yandex.ru/maps/?rtext=~${s.lat},${s.lon}&rtt=auto`
