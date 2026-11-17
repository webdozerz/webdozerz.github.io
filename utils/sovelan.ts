// Концепт редизайна sovelan.ru («Созвездие вкуса», Ореховые Эланки® и Виланки®, Пенза), снято 17.11.2026.
// Картинки — по адресам оригинала (https). Товары — utils/sovelan.data.ts (генерируется), здесь — разделы, контакты, праздники.
// Цен у оригинала нет нигде: опт — по договору, розница — на маркетплейсах. Поэтому в концепте нет ни одной цены.
import { svProducts } from '~/utils/sovelan.data'
import type { SvProduct } from '~/utils/sovelan.data'

export const SV_ORIG = 'https://sovelan.ru/'
export const SV_IMG = 'https://sovelan.ru/images/'
export const svPath = (p = '/') => `/redesign/sovelan${p === '/' ? '/' : p}`
export const svAsset = (f: string) => `/redesign/sovelan/${f}`
export const svImg = (f: string) => `${SV_IMG}${f}`

export const svContacts = {
  phones: [
    { label: '8 (8412) 96-98-66', tel: '+78412969866' },
    { label: '8 (8412) 32-92-66', tel: '+78412329266' },
  ],
  sales: 'trade-sv09@yandex.ru',
  salesNote: 'продажа продукции, закупка сырья и ингредиентов',
  info: 'sovelan@inbox.ru',
  infoNote: 'информация',
  address: 'г. Пенза, ул. Чаадаева, 121Б',
  legal: 'ООО «Созвездие вкуса»',
}

export const svMarkets = [
  { id: 'ozon', name: 'Ozon', icon: 'ozon-icon-logo.svg', url: 'https://ozon.ru/s/4099843' },
  { id: 'wb', name: 'Wildberries', icon: 'wildberries-sign-logo.svg', url: 'https://www.wildberries.ru/seller/250118740' },
  { id: 'ym', name: 'Яндекс Маркет', icon: 'yandex-market-sign-logo.svg', url: 'https://market.yandex.ru/business--konditerskie-izdeliia-elanki-i-vilanki/216943634' },
]

export const svSocial = [
  { name: 'ВКонтакте', icon: 'vk512-512.svg', url: 'https://vk.com/sozvezdiepenza' },
  { name: 'YouTube', icon: 'youtube.svg', url: 'https://www.youtube.com/channel/UCp27ckH2sVeh1ZKSGRziL2A/featured?view_as=subscriber' },
  { name: 'Telegram', icon: 'telegram.svg', url: 'https://t.me/sozvezdie_vkysa_rabota' },
]

// Тексты оригинала (главная, подвал)
export const svNotes = {
  opt: 'Для личного пользования приобрести продукцию можно на маркетплейсах, для оптовой покупки нужно заключить договор.',
  weight: 'Вес продукции, указанный на сайте, может отличаться от фактического на 100 грамм в связи с особенностью технологического процесса.',
  fake: 'Продукция выпускается только в именных коробках и капсулах с логотипом «Созвездие вкуса», продукция без логотипа является подделкой.',
  consent: 'Осуществляя заказ, вы соглашаетесь на обработку ваших персональных данных.',
}

// Разделы в порядке их главной; count — сколько позиций в разделе на сайте
export interface SvCat { id: number; name: string; count: number; img: string }
export const svCats: SvCat[] = [
  { id: 70, name: 'Зима близко', count: 65, img: 'katNG23.jpg' },
  { id: 69, name: 'Новый формат упаковки', count: 19, img: '2market.jpg' },
  { id: 67, name: 'Школьная пора', count: 22, img: '1sentbr.jpg' },
  { id: 66, name: 'Шоколадные Виланки', count: 47, img: 'kat3.jpg' },
  { id: 65, name: 'Летняя ферма', count: 19, img: 'letnya-ferma.jpg' },
  { id: 63, name: 'Лето — маленькая жизнь', count: 44, img: 'leto22.jpg' },
  { id: 62, name: 'Всё гениальное, просто. Ассорти', count: 11, img: 'kat-assorti.jpg' },
  { id: 51, name: 'Суфлейные Эланки', count: 27, img: 'katsyfle-elanki.jpg' },
  { id: 22, name: 'Шоколадные Виланки (батончики)', count: 27, img: 'katbatonchiki.jpg' },
  { id: 18, name: 'Шоколадные Виланки (фигурные)', count: 17, img: 'katfigyrnoe.jpg' },
  { id: 16, name: 'Весна 2026', count: 67, img: 'katDVV.jpg' },
  { id: 14, name: 'Пасхальные', count: 45, img: 'kat-pasha.jpg' },
  { id: 11, name: 'Армейские истории', count: 28, img: 'kat10.jpg' },
  { id: 10, name: 'Разные увлечения', count: 10, img: 'v-pohod.jpg' },
  { id: 7, name: 'Суфлейные Виланки', count: 28, img: 'kat2.jpg' },
  { id: 6, name: 'Ореховые Эланки', count: 52, img: 'kat4.jpg' },
  { id: 5, name: 'Зефир с орнаментом', count: 8, img: 'kat9.jpg' },
  { id: 4, name: 'Мармеладные Виланки', count: 17, img: 'kat5.jpg' },
  { id: 3, name: 'Шоколадные фигурки', count: 4, img: 'kat6.jpg' },
  { id: 2, name: 'Коржики', count: 13, img: 'kat7.jpg' },
  { id: 1, name: 'Разное', count: 4, img: 'kat11.jpg' },
]
export const svCatById = (id: number) => svCats.find((c) => c.id === id)
export const svTotal = svCats.reduce((s, c) => s + c.count, 0)

const byId = new Map<number, SvProduct>(svProducts.map((p) => [p.id, p]))
export const svById = (id: number) => byId.get(id)
export const svInCat = (id: number) => svProducts.filter((p) => p.c.includes(id))
export const svName = (p: SvProduct) => (p.b ? `${p.b} «${p.t}»` : p.t)

// Граммы → «800 г» / «1,2 кг»
export const svWeight = (g: number) => (g >= 1000 ? `${(g / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} кг` : `${g} г`)
export const svPcs = (n: number) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'позиция'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'позиции'
  return 'позиций'
}
export const svDays = (n: number) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'день'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'дня'
  return 'дней'
}

// Календарь праздников первого экрана: их сезонные разделы и дата праздника.
// На CMS — поле «дата» у раздела; Пасха — по таблице православной Пасхи.
const EASTER: Record<number, string> = { 2026: '04-12', 2027: '05-02', 2028: '04-16', 2029: '04-08', 2030: '04-28' }
export interface SvHoliday { id: string; name: string; cat: number; also?: number; md: string | ((y: number) => string) }
export const svHolidays: SvHoliday[] = [
  { id: 'ny', name: 'Новый год', cat: 70, md: '12-31' },
  { id: 'feb23', name: '23 Февраля', cat: 11, md: '02-23' },
  { id: 'mar8', name: '8 Марта', cat: 16, md: '03-08' },
  { id: 'easter', name: 'Пасха', cat: 14, md: (y) => EASTER[y] || '04-20' },
  { id: 'summer', name: 'Лето', cat: 63, also: 65, md: '06-01' },
  { id: 'sep1', name: '1 Сентября', cat: 67, md: '09-01' },
]
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
export const svDateWord = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`

// Ближайшие даты праздников от сегодняшнего дня (по Москве — Пенза МСК+0)
export const svUpcoming = (now: Date) => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return svHolidays
    .map((h) => {
      let y = today.getFullYear()
      let date: Date
      for (;;) {
        const md = typeof h.md === 'function' ? h.md(y) : h.md
        const [m, d] = md.split('-').map(Number)
        date = new Date(y, m - 1, d)
        if (date >= today) break
        y++
      }
      const days = Math.round((date.getTime() - today.getTime()) / 86400000)
      return { ...h, date, days }
    })
    .sort((a, b) => a.days - b.days)
}
export const svMoscowNow = () => {
  const s = new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' })
  return new Date(s)
}
