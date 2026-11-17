// Концепт редизайна moreland.ru (ТК «Морелэнд», Омск), снято 17.11.2026. Картинки — по адресам оригинала.
// Товары и новости — utils/moreland.data.ts (генерируется), здесь — разделы, контакты и помощники.
import { mlNews, mlProducts } from '~/utils/moreland.data'
import type { MlNews, MlProduct } from '~/utils/moreland.data'


export const ML_ORIG = 'https://moreland.ru/'
export const ML_IMG = 'https://moreland.ru/bitrix/templates/moreLand/img/'
export const mlPath = (p = '/') => `/redesign/moreland${p === '/' ? '/' : p}`
export const mlAsset = (f: string) => `/redesign/moreland/${f}`

export const mlContacts = {
  phone: '+7 (3812) 51-41-00',
  tel: '+73812514100',
  email: 'sale@moreland.ru',
  address: '644036, г. Омск, ул. 1-ая Казахстанская, 30',
  addressShort: 'Омск, ул. 1-ая Казахстанская, 30',
  legal: 'ИП Иманов Владимир Александрович (ТК «Морелэнд»)',
  // точка по адресу (OpenStreetMap / Nominatim)
  map: 'https://yandex.ru/maps/?ll=73.297110%2C54.918132&pt=73.297110%2C54.918132%2Cpm2blm&z=16',
  mapWidget: 'https://yandex.ru/map-widget/v1/?ll=73.297110%2C54.918132&pt=73.297110%2C54.918132%2Cpm2blm&z=16',
}

export const mlCities = ['Омск', 'Новосибирск', 'Кемерово', 'Иркутск', 'Красноярск', 'Тюмень', 'Ханты-Мансийск', 'Павлодар', 'Астана']

// Разделы как в их каталоге: Весовая рыба (2 подраздела), Пресервы, Упакованная рыба (3 подраздела)
export interface MlGroup { id: string; name: string; text: string; img: string; subs: { id: string; name: string }[] }
export const mlGroups: MlGroup[] = [
  {
    id: 'vesovaya',
    name: 'Весовая рыба',
    text: 'Полный ассортимент копчёной рыбной продукции, более 20 сортов рыб.',
    img: 'https://moreland.ru/upload/iblock/27c/main2.jpg',
    subs: [
      { id: 'hk', name: 'Х/К, вяленая рыба' },
      { id: 'ss', name: 'Рыба слабосолёная' },
    ],
  },
  {
    id: 'preservy',
    name: 'Пресервы',
    text: 'Сельдь и горбуша в масле и заливках: банки 150–620 г и вёдра.',
    img: 'https://moreland.ru/upload/iblock/0b4/IMG_6378.jpg',
    subs: [{ id: 'pr', name: 'Пресервы рыбные' }],
  },
  {
    id: 'upakovannaya',
    name: 'Упакованная рыба',
    text: 'Фасованная рыба, соломка и наборы к пиву.',
    img: 'https://moreland.ru/upload/iblock/8b1/%D0%BB%D0%B5%D1%89%D1%81%D0%BE%D0%BB%D0%BE%D0%BC%D0%BA%D0%B0500%D0%BF%D0%BF.jpg',
    subs: [
      { id: 'fas', name: 'Фасованная продукция' },
      { id: 'sol', name: 'Соломка рыбная' },
      { id: 'nab', name: 'Рыбные наборы к пиву' },
    ],
  },
]
export const mlSubName = (sec: string) => mlGroups.flatMap((g) => g.subs).find((s) => s.id === sec)?.name ?? ''
export const mlGroupOf = (sec: string) => mlGroups.find((g) => g.subs.some((s) => s.id === sec))!
export const mlInGroup = (gid: string) => {
  const g = mlGroups.find((x) => x.id === gid)
  return g ? mlProducts.filter((p) => g.subs.some((s) => s.id === p.sec)) : []
}

export const mlMenu = [
  { label: 'О компании', to: '/o-kompanii/' },
  { label: 'Новости', to: '/novosti/' },
  { label: 'Продукция', to: '/produkcija/' },
  { label: 'Контакты', to: '/kontakty/' },
]

export const mlProduct = (slug: string) => mlProducts.find((p) => p.slug === slug)
export const mlById = (id: number) => mlProducts.find((p) => p.id === id)

// Деньги: «1 500 ₽», копейки двумя цифрами «98,50 ₽»
export const mlRub = (v: number) => {
  const int = Number.isInteger(v)
  return `${v.toLocaleString('ru-RU', { minimumFractionDigits: int ? 0 : 2, maximumFractionDigits: 2 })} ₽`
}
export const mlRub0 = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
export const mlDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}
export const mlDateShort = (iso: string) => {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y.slice(2)}`
}

// Единица заказа: весовая — коробками (сумма = цена × вес коробки), остальное — штуками/вёдрами
export const mlByBox = (p: MlProduct) => p.unit === 'кг' && !!p.box
export const mlUnitShort = (p: MlProduct) => (p.unit === 'кг' ? 'кг' : p.unit === 'ведро' ? 'ведро' : 'шт')
export const mlQtyWord = (p: MlProduct, q: number) => {
  if (mlByBox(p)) return `${q} кор. (${(q * p.box!).toLocaleString('ru-RU')} кг)`
  return `${q} ${p.unit === 'ведро' ? 'вед.' : 'шт'}`
}
export const mlLineSum = (p: MlProduct, q: number) => (p.price ? (mlByBox(p) ? p.price * p.box! * q : p.price * q) : 0)
// «Свежая партия» — цена из новости последних 30 дней
const TODAY = '2026-11-17'
export const mlFresh = (p: MlProduct) => !!p.src?.startsWith('новость') && !!p.pdate && daysBetween(p.pdate, TODAY) <= 30
export const mlStale = (p: MlProduct) => !!p.pdate && daysBetween(p.pdate, TODAY) > 365
function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(b) - Date.parse(a)) / 864e5)
}
export const mlNewsItem = (id: string) => mlNews.find((n) => n.id === id)
export const mlNewsPath = (n: MlNews) => mlPath(`/novosti/${n.id}/`)
export const mlSrcNews = (p: MlProduct) => (p.srcUrl ? mlNews.find((n) => n.url === p.srcUrl) : undefined)

// Свежие партии из новостей — для первого экрана: новость → товар каталога (если есть)
export const mlBatches = [
  { news: 'balyk-kety-novogo-urozhaya', product: 'keta-balyk', price: 1500, unit: 'кг', box: '10 кг' },
  { news: 'golets-kh-k-1', product: 'golets-kh-k', price: 1200, unit: 'кг', box: '3 кг' },
  { news: 'forel-kusochki', product: '', price: 2600, unit: 'ведёрко', box: '2 кг, нетто 1,5 кг' },
]
