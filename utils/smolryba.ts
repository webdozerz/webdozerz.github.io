// Концепт smolryba — «Рыбная база», Смоленск (https://смолрыба.рф/, October CMS). Разбор 11.11.2026.
// Позиции прайса — utils/smolryba.data.ts (выборка 100 из 259). Тексты — их словами с главной.
import { srItems, srSections, type SrItem } from '~/utils/smolryba.data'

export const SR_ORIG = 'https://смолрыба.рф/'
export const SR_TOTAL = 259
export const SR_DATE = '10.11.2026'
export const SR_XLSX = 'https://xn--80ab3adknd8f.xn--p1ai/storage/app/media/' + encodeURIComponent('КАТАЛОГ ЦЕН на 10.11.2026.xlsx')
export const SR_VIDEO = 'https://xn--80ab3adknd8f.xn--p1ai/storage/app/media/insert-videos/header-main/video.mp4'

export const srPath = (p = '/') => '/redesign/smolryba' + (p === '/' ? '/' : p)
export const srAsset = (f: string) => '/redesign/smolryba/' + f

export const srContacts = {
  phones: [
    { text: '+7 960 590-87-77', tel: '+79605908777' },
    { text: '+7 905 697-47-77', tel: '+79056974777' },
    { text: '+7 (4812) 27-07-54', tel: '+74812270754' },
  ],
  email: 'smolfish@mail.ru',
  address: 'г. Смоленск, ул. Ново-Ленинградская, д. 15',
  addressShort: 'Ново-Ленинградская, 15',
  hours: [
    { d: 'Пн–Пт', t: '8:00–17:00' },
    { d: 'Сб', t: '9:00–13:00' },
    { d: 'Вс', t: 'выходной' },
  ],
  max: 'https://max.ru/chat?phone=79056974777',
  tg: 'https://t.me/smolryba',
  map: 'https://yandex.ru/maps/?text=' + encodeURIComponent('Смоленск, улица Ново-Ленинградская, 15'),
  // точка дома по OpenStreetMap: метка без поисковой выдачи и рекламы виджета
  mapWidget: 'https://yandex.ru/map-widget/v1/?ll=32.050846%2C54.796243&z=16&pt=32.050846%2C54.796243%2Cpm2blm',
}

// Меню оригинала его словами
export const srMenu = [
  { label: 'О компании', to: '/#aboutus' },
  { label: 'Каталог цен', to: '/price/' },
  { label: 'Рыбопродукция', to: '/#fish-production' },
  { label: 'Преимущества', to: '/#advantages' },
  { label: 'Новости', to: '/#news' },
  { label: 'Как нас найти', to: '/#how-to-find-us' },
]

export const srAbout = [
  'Группа компаний «РЫБНАЯ БАЗА» существует на рыбном рынке более 50-ти лет и имеет многолетний опыт по поставкам широкого ассортимента рыбопродукции. Мы являемся экспортером, импортером и крупным трейдером российского и иностранного ассортимента свежемороженой рыбы, морепродуктов и готовой рыбопродукции.',
  'Собственные холодильные мощности находятся в Смоленске и аккредитованы для экспорта на страны Таможенного союза, в том числе и на Республику Беларусь.',
  'Прямые поставки от флотов позволяют нам реализовывать рыбопродукцию по низким ценам и в актуальном ассортименте.',
  'Мы боремся за качество продукции и гарантируем стабильность поставок. Мы стараемся, чтобы каждый клиент остался доволен качеством продукции и нашим обслуживанием. Мы ориентированы на решение вопросов наших покупателей и на долгосрочное взаимовыгодное сотрудничество!',
  'Это наши принципы работы!',
]

export const srAdvantages = [
  { icon: 'adv1', text: 'Гибкий подход к ценообразованию' },
  { icon: 'adv2', text: 'Возможность отсрочки платежа для постоянных клиентов' },
  { icon: 'adv3', text: 'Крупные скидки от объема заказа' },
  { icon: 'adv4', text: 'Бесплатная доставка по городу' },
  { icon: 'adv5', text: 'Аттестованный склад для отгрузок на Беларусь с полным пакетом документов' },
  { icon: 'adv6', text: 'Скидки постоянным клиентам' },
]

// ---- деньги и единицы ----
const nf0 = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
const nf2 = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const srRub = (n: number) => (Number.isInteger(Math.round(n * 100) / 100) ? nf0.format(n) : nf2.format(n)) + ' ₽'
export const srRub0 = (n: number) => nf0.format(Math.round(n)) + ' ₽'
const kg = (n: number) => (Number.isInteger(n) ? String(n) : String(n).replace('.', ','))
const grams = (n: number) => Math.round(n * 1000) + ' г'

export const srSection = (id: string) => srSections.find((s) => s.id === id)

/** Цена за что: кг или штука */
export const srPer = (it: SrItem) => (it.k === 'piece' ? 'за шт' : 'за кг')

/** Тара словами: «коробка 25 кг», «фасовка 110 г», «весовая, место ~26 кг» */
export const srTara = (it: SrItem) => {
  if (it.k === 'box') return `коробка ${kg(it.tara!)} кг`
  if (it.k === 'piece') return it.tara ? `фасовка ${grams(it.tara)}` : 'штучно'
  if (it.k === 'weight') return it.place ? `весовая, место ~${kg(it.place)} кг` : 'весовая'
  return 'на развес, от 1 кг'
}

/** Во что считаем количество в списке */
export const srQtyUnit = (it: SrItem) => (it.k === 'box' ? 'кор.' : it.k === 'piece' ? 'шт' : it.k === 'weight' && it.place ? 'мест' : 'кг')

/** Сумма строки: у весовой — примерно, точную назовут после взвешивания */
export const srLine = (it: SrItem, q: number) => {
  if (it.k === 'box') return { sum: (it.pack ?? it.p * (it.tara ?? 1)) * q, approx: false }
  if (it.k === 'piece') return { sum: it.p * q, approx: false }
  if (it.k === 'weight') return { sum: it.p * (it.place ?? 1) * q, approx: true }
  return { sum: it.p * q, approx: false }
}

/** Количество словами для сообщения: «2 кор. по 25 кг», «12 шт», «1 место ~26 кг» */
export const srQtyText = (it: SrItem, q: number) => {
  if (it.k === 'box') return `${q} кор. по ${kg(it.tara!)} кг`
  if (it.k === 'piece') return `${q} шт`
  if (it.k === 'weight' && it.place) return `${q} ${q === 1 ? 'место' : q < 5 ? 'места' : 'мест'} ~${kg(it.place)} кг`
  return `${q} кг`
}

// ---- поиск ----
const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е')
export const srMatch = (it: SrItem, q: string) => {
  const words = norm(q).split(/[\s,]+/).filter(Boolean)
  if (!words.length) return true
  const hay = norm(it.n + ' ' + (it.t ?? '') + ' ' + (srSection(it.s)?.name ?? ''))
  return words.every((w) => hay.includes(w.length > 4 ? w.slice(0, -1) : w))
}
export const srItem = (id: number) => srItems.find((i) => i.id === id)

/** Источник/производитель из скобок — для фильтра «Откуда» */
export const srOrigins = [...new Set(srItems.map((i) => i.t).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, 'ru'))

// ---- часы склада по Москве ----
export const srNowStatus = (d = new Date()) => {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Moscow', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d)
  const wd = p.find((x) => x.type === 'weekday')!.value
  const m = Number(p.find((x) => x.type === 'hour')!.value) * 60 + Number(p.find((x) => x.type === 'minute')!.value)
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wd)
  const open = (dd: number) => (dd >= 1 && dd <= 5 ? [480, 1020] : dd === 6 ? [540, 780] : null)
  const t = open(day)
  if (t && m >= t[0] && m < t[1]) return { open: true, text: `Склад работает до ${t[1] / 60}:00` }
  if (t && m < t[0]) return { open: false, text: `Откроемся сегодня в ${t[0] / 60}:00` }
  const next = day === 5 ? 'в субботу в 9:00' : day === 6 || day === 0 ? 'в понедельник в 8:00' : 'завтра в 8:00'
  return { open: false, text: `Откроемся ${next}` }
}

/** «72 позиции», «21 позиция», «45 позиций» */
export const srPos = (n: number) => {
  const a = n % 10, b = n % 100
  return `${n} ${a === 1 && b !== 11 ? 'позиция' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'позиции' : 'позиций'}`
}
