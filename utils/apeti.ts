// Концепт редизайна apeti.ru (ООО «Апети», Москва). Данные — utils/apetiData.ts, сняты с сайта 10.11.2026.
// Фото товаров и блога грузятся с apeti.ru; логотип, иконки разделов, фото фермеров и кадры баннеров — копии в public/redesign/apeti.
import { apProducts, apSections, apSlots, apZones } from './apetiData'
import type { ApProduct, ApSection } from './apetiData'

export const AP_BASE = '/redesign/apeti'
export const AP_ORIG = 'https://apeti.ru'
export const AP_MIN = 2000 // «Минимальная сумма заказа от 2000 руб.»
export const AP_CUTOFF = 19 // «Все заказы, оформленные до 19:00 приезжают в тот же день»

export const apPath = (p = '/') => `${AP_BASE}${p.startsWith('/') ? p : `/${p}`}`
export const apAsset = (f: string) => `${AP_BASE}/${f}`
export const apImg = (p: ApProduct) => `${AP_ORIG}${p.i}`
export const apIcon = (slug: string) => `${AP_BASE}/icons/${slug}.png`

export const apContacts = {
  phone: '8 (495) 822-07-07',
  phoneHref: 'tel:+74958220707',
  phone2: '+7 (993) 355-94-41',
  phone2Href: 'tel:+79933559441',
  hours: 'Ежедневно: 8:00–20:00',
  address: 'г. Москва, ул. Преображенский Вал, д. 17, с. 11',
  place: 'Преображенский рынок',
  legal: 'ООО «Апети», ИНН 9718281643, ОГРН 1257700249509',
  legalAddress: '107023, Москва, Электрозаводская, 24',
  emails: [
    { mail: 'zakaz@apeti.ru', what: 'Размещение заказов' },
    { mail: 'info@apeti.ru', what: 'По вопросам сотрудничества' },
    { mail: 'kachestvo@apeti.ru', what: 'Контроль качества, претензии' },
    { mail: 'zakupki@apeti.ru', what: 'Отдел закупки, поставщикам' },
  ],
  social: [
    { name: 'Telegram', href: 'https://t.me/Apeti_ru' },
    { name: 'MAX', href: 'https://max.ru/id9718281643_biz' },
    { name: 'ВКонтакте', href: 'https://vk.com/apeti_moscow' },
    { name: 'Дзен', href: 'https://zen.yandex.ru/id/5f47e1a174bcbc5120dcefc1' },
  ],
  map: 'https://yandex.ru/maps/?text=Москва, Преображенский Вал, 17с11',
}

// Верхнее меню оригинала — его словами
export const apTopNav = [
  { to: '/catalog/skidki', name: 'Скидки', hot: true },
  { to: '/sale', name: 'Акции' },
  { to: '/blog', name: 'Блог' },
  { to: '/delivery', name: 'Доставка и Оплата' },
  { to: '/about', name: 'О компании' },
  { to: '/contacts', name: 'Контакты' },
]

// ---- деньги и вес ----
const nf0 = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
const nf2 = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const apMoney = (n: number) => `${Number.isInteger(Math.round(n * 100) / 100) ? nf0.format(n) : nf2.format(n)} ₽`
export const apRub = (n: number) => `${nf0.format(Math.round(n))} ₽`
export const apNum = (n: number) => String(Math.round(n * 1000) / 1000).replace('.', ',')
// количество хранится в порциях: порция весового товара — p.q кг
export const apWeight = (p: ApProduct, n: number) => (p.k ? `${apNum(n * p.q)} кг` : `${n} шт`)
export const apPortion = (p: ApProduct) => (p.k ? `${apNum(p.q)} кг` : 'шт')
export const apDisc = (p: ApProduct) => (p.o > p.p ? Math.round((1 - p.p / p.o) * 100) : 0)

// ---- каталог ----
const byId = new Map(apProducts.map((p) => [p.id, p]))
export const apProduct = (id: string) => byId.get(id)
export const apSection = (slug: string) => apSections.find((s) => s.slug === slug)
export const apParent = (sub: string) => apSections.find((s) => s.sub.some((x) => x.slug === sub))
export const apSaleProducts = () => apProducts.filter((p) => apDisc(p) > 0)
export const apInSection = (slug: string) =>
  apProducts.filter((p) => p.s === slug || (slug === 'produktsiya_khalyal' && p.h === 1))

// Подраздел: у выборки нет привязки ко всем подразделам — ищем по словам названия подраздела
const stems = (name: string) =>
  name
    .toLowerCase()
    .split(/[^a-zа-яё]+/)
    .filter((w) => w.length > 3)
    .map((w) => w.slice(0, Math.min(5, w.length - 1)))
export const apInSub = (sec: ApSection, sub: { slug: string; name: string }) => {
  const all = apInSection(sec.slug)
  const direct = all.filter((p) => p.b === sub.slug)
  if (direct.length) return direct
  const st = stems(sub.name).filter((s) => !['мясо', 'рыба', 'рыбн', 'проду'].includes(s))
  return all.filter((p) => st.some((s) => p.n.toLowerCase().includes(s)))
}

export const apCountText = (s: ApSection) => (s.count ? `${s.approx ? '≈ ' : ''}${nf0.format(s.count)}` : '')

export const apSearch = (q: string, limit = 60) => {
  const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  return apProducts.filter((p) => words.every((w) => p.n.toLowerCase().includes(w) || p.a.toLowerCase() === w)).slice(0, limit)
}

// Полки главной: у оригинала их собирает сервис рекомендаций, здесь — из выборки
const pick = (ids: string[]) => ids.map((id) => byId.get(id)).filter(Boolean) as ApProduct[]
const firstOf = (slugs: string[], from: number, n: number) => slugs.flatMap((s) => apProducts.filter((p) => p.s === s).slice(from, from + n))
export const apShelves = {
  hits: () =>
    pick(['klubnika_otbornaya_rossiya', 'dorado_srednyaya_okhlazhdennaya', 'govyadina_fileynyy_kray_koreyka_okhlazhdennaya_1_kg', 'ikra_kety_na_razves_100_g']).concat(
      firstOf(['molochnaya_produktsiya', 'syry', 'khleb_i_bagety', 'yaytsa', 'sukhofrukty_orekhi', 'eksklyuzivnyy_med'], 3, 1),
    ),
  fresh: () => firstOf(['ovoshchi_frukty_yagody', 'ryba_i_moreprodukty', 'konfety_sladosti', 'chay_kofe', 'polufabrikaty'], 7, 2),
  best: () => firstOf(['myaso_ptitsa', 'moreprodukty', 'ikra', 'bakaleya_1', 'napitki'], 1, 2),
  sale: () => apSaleProducts().slice(0, 12),
}

// Услуги с баннеров главной: «Превратим любое мясо в фарш», «Бесплатно почистим, выпотрошим и нарежем охлаждённую рыбу на стейки»
export const apServices: Record<string, { short: string; text: string; inCart: string }> = {
  farsh: { short: 'Превратить в фарш', text: 'Превратим это мясо в фарш — отметьте здесь или скажите оператору', inCart: 'в фарш' },
  fish: { short: 'Почистить и нарезать на стейки', text: 'Бесплатно почистим, выпотрошим и нарежем на стейки', inCart: 'почистить и нарезать' },
}

// Товары «весов» первого экрана
export const apScaleItems = [
  { id: 'klubnika_otbornaya_rossiya', short: 'Клубника', img: 'scale-klubnika.jpg' },
  { id: 'dorado_srednyaya_okhlazhdennaya', short: 'Дорадо', img: 'scale-dorado.jpg' },
  { id: 'govyadina_fileynyy_kray_koreyka_okhlazhdennaya_1_kg', short: 'Говядина', img: 'scale-govyadina.jpg' },
  { id: 'ikra_kety_na_razves_100_g', short: 'Икра кеты', img: 'scale-ikra.jpg' },
]

// ---- доставка ----
export const apZoneList = apZones.map(([name, min, fee], i) => ({
  i,
  name: name.replace('АО', 'административный округ'),
  short: name,
  min,
  fee,
  region: min >= 5000,
}))
export const apZone = (i: number) => (i >= 0 ? apZoneList[i] : null)

// Время магазина — московское, а не время зрителя
export const apMoscow = (d: Date) => {
  const parts = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(d)
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0)
  return { h: g('hour') % 24, m: g('minute'), s: g('second') }
}
const slotStart = (s: string) => Number(s.slice(0, 2))
const dayName = (d: Date, shift: number) => {
  const x = new Date(d.getTime() + shift * 864e5)
  return new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', day: 'numeric', month: 'long' }).format(x)
}
// Ближайшее окно: до 19:00 — сегодня, первое окно, которое ещё не началось; иначе завтра с 9:00
export const apWhen = (now: Date) => {
  const { h, m, s } = apMoscow(now)
  const todaySlots = h < AP_CUTOFF ? apSlots.filter((x) => slotStart(x) > h) : []
  const today = todaySlots.length > 0
  const left = today ? (AP_CUTOFF - h) * 3600 - m * 60 - s : 0
  return {
    today,
    day: today ? 'сегодня' : 'завтра',
    date: dayName(now, today ? 0 : 1),
    slot: (today ? todaySlots[0] : apSlots[0]).replace(/\s/g, '').replace('-', '–'),
    todaySlots,
    leftH: Math.floor(left / 3600),
    leftM: Math.floor((left % 3600) / 60),
  }
}
export const apSlotText = (s: string) => s.replace(/\s/g, '').replace('-', '–')

export const apPlural = (n: number, forms: [string, string, string]) => {
  const a = Math.abs(n) % 100
  const b = a % 10
  if (a > 10 && a < 20) return forms[2]
  if (b > 1 && b < 5) return forms[1]
  if (b === 1) return forms[0]
  return forms[2]
}

// Закончившиеся акции со страницы /sale/ (действующих на 10.11.2026 нет)
export const apPastSales = [
  { dates: '01.07.2024 – 03.07.2024', title: 'Пучок укропа в подарок!', text: 'Пучок свежего и ароматного укропа в каждом заказе от 3000 рублей!' },
  { dates: '10.06.2024 – 16.06.2024', title: 'Ягодные скидки в Apeti', text: 'Успейте купить свежие летние ягоды со скидкой!' },
  { dates: '03.06.2024 – 05.06.2024', title: 'Бесплатная доставка от 5000 рублей', text: 'Только три дня! Бесплатная доставка от 5000 рублей по Москве в пределах МКАД.' },
  { dates: '14.02.2023', title: 'Дарим печенье с предсказанием', text: 'Печенье с предсказанием в каждом заказе.' },
  { dates: '24.10.2022 – 30.10.2022', title: 'Лимоны в подарок в каждом заказе', text: 'Лимоны в подарок в каждом заказе!' },
]

export const apFarmers = [
  { name: 'Евгений Рошаль', img: 'farmer-roshal.jpg' },
  { name: 'Две деревни', img: 'farmer-dve-derevni.jpg' },
  { name: 'ИП Хайдари', img: 'farmer-haidari.jpg' },
  { name: 'Органик фуд', img: 'farmer-organic.jpg' },
]
export const apNumbers = [
  { n: '1 214', t: 'позиций отмечены зелёным стикером' },
  { n: '38', t: 'производителей прошли отбор по качеству' },
  { n: '68 976', t: 'довольных клиентов' },
]
