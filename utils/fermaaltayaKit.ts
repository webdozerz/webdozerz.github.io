// Справочник концепта «Ферма Алтая»: пути, разделы с иконками, расписание доставки, расчёт весового товара.
// Условия и тексты — с ferma-altaya.ru (ноябрь 2026): приём до 12:00 вс → привоз пн–вт, до 12:00 ср → чт–пт,
// заказ собирают в ночь на пн и чт, минимальный заказ 1 200 ₽, доставка бесплатная, 2 % баллов.

export const FA_BASE = '/redesign/fermaaltaya'
export const faPath = (p = '/') => (p === '/' ? `${FA_BASE}/` : FA_BASE + p)
export const faImg = (f: string) => `https://ferma-altaya.ru/files/products/${f}`
export const faBig = (f: string) => faImg(f.replace('.300x300.', '.800x600w.'))
export const faLocal = (f: string) => `${FA_BASE}/img/${f}`
export const FA_ORIGIN = 'https://ferma-altaya.ru'

export const FA_MIN = 1200
export const FA_BONUS = 0.02
export const FA_PHONE = '+7 (913) 790-00-20'
export const FA_EMAIL = 'manager@ferma-altaya.ru'
export const FA_MAX = 'https://max.ru/id2263028539_biz'
export const FA_B2B = 'https://b2b.ferma-altaya.ru/catalog'
export const FA_HOURS = 'пн–вс 10:00–21:00'

export type FaCity = 'nsk' | 'brn'
export const faCities: Record<FaCity, { title: string; short: string; area: string }> = {
  nsk: { title: 'Новосибирск', short: 'Новосибирск', area: 'Новосибирск, Академгородок, Бердск' },
  brn: { title: 'Барнаул', short: 'Барнаул', area: 'Барнаул, Новоалтайск' },
}

// Иконка раздела: маска из их логотипа (корова, свинья, курица) или линейная иконка FaIcon
export type FaSecIcon = { mask?: 'cow' | 'pig' | 'chicken' | 'sheep'; icon?: string }
export const faSecIcons: Record<string, FaSecIcon> = {
  moloko: { mask: 'cow' },
  jogurty: { icon: 'cup' },
  govyadina: { mask: 'cow' },
  svinina: { mask: 'pig' },
  baranina: { mask: 'sheep' },
  ptitsa: { mask: 'chicken' },
  shashlyk: { icon: 'fire' },
  kolbasy: { icon: 'sausage' },
  polufabrikaty: { icon: 'dumpling' },
  gotovoe: { icon: 'pan' },
  supy: { icon: 'bowl' },
  vtorye: { icon: 'plate' },
  salaty: { icon: 'leaf' },
  hleb: { icon: 'bread' },
  torty: { icon: 'cake' },
  ovoschi: { icon: 'carrot' },
  napitki: { icon: 'bottle' },
}

export const faGroups = [
  { id: 'milk', title: 'Молочное', secs: ['moloko', 'jogurty'] },
  { id: 'meat', title: 'Мясо и птица', secs: ['govyadina', 'svinina', 'baranina', 'ptitsa', 'shashlyk', 'kolbasy'] },
  { id: 'ready', title: 'Готовая еда', secs: ['polufabrikaty', 'supy', 'vtorye', 'gotovoe', 'salaty'] },
  { id: 'bake', title: 'Хлеб, торты, овощи', secs: ['hleb', 'torty', 'ovoschi', 'napitki'] },
]

// Описания разделов («Развернуть…» у оригинала), сжатые без SEO-повторов
const notes: Record<string, string> = {
  supy: 'Свежесваренный суп остужаем и замораживаем в камере шоковой заморозки — так сохраняются все полезные свойства, консерванты не нужны. Вам остаётся разморозить, разогреть — и приятного аппетита :)',
  hleb: 'Хлеб бородинский, раменский, бездрожжевой, чиабатта, сочники. Хлеб едет в холодильной камере, поэтому перед едой рекомендуем разогреть: духовка, микроволновка или сковорода.',
  baranina:
    'Примерные веса: шея — 1–2,5 кг, передняя нога — 1–3 кг, задняя нога — 1,5–5 кг, рёбра — 2–5 кг. После взвешивания цена может немного измениться в большую или меньшую сторону.',
  ptitsa: 'Курицу заказываете штуками, а не килограммами: тушка весит 3–5 кг, цена — за килограмм. После взвешивания пришлём точную сумму.',
  svinina: 'Натуральная фермерская свинина без гормонов роста. Цена — за килограмм, в упаковке примерный вес; точную сумму пришлём после сборки.',
  govyadina: 'Натуральная говядина без гормонов роста. Цена — за килограмм, в упаковке примерный вес; точную сумму пришлём после сборки.',
  ovoschi: 'Очищенные картошка, морковь, свёкла, капуста и готовые наборы для борща и щей.',
  salaty: 'Капуста квашеная без уксуса и маринованная — с клюквой, брусникой и морковью.',
  napitki: 'Морсы из клюквы и брусники, кисель, компоты из сухофруктов — без сахара тоже есть.',
  torty: 'Торты и сладкая выпечка от нашего кондитера.',
  vtorye: 'Плов с бараниной, говядиной и курицей — разогреть и к столу.',
}
export const faNote = (id: string) => notes[id] ?? faSections.find((s) => s.id === id)?.note ?? ''

const byId = new Map(faProducts.map((p) => [p.id, p]))
export const faProduct = (id: string) => byId.get(id)
export const faSection = (id: string) => faSections.find((s) => s.id === id)
export const faInSection = (id: string) => faProducts.filter((p) => p.sec === id)

// «1 товар», «3 товара», «5 товаров»
export const faPlural = (n: number, one: string, few: string, many: string) => {
  const a = n % 10
  const b = n % 100
  return `${n}\u00a0${a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 12 || b > 14) ? few : many}`
}

// ---------- деньги и вес ----------
const nf = new Intl.NumberFormat('ru-RU')
export const faMoney = (n: number) => `${nf.format(Math.round(n))} ₽`
export const faRange = (r: [number, number]) =>
  Math.round(r[0]) === Math.round(r[1]) ? faMoney(r[0]) : `${nf.format(Math.round(r[0]))}–${faMoney(r[1])}`
const r10 = (n: number) => Math.round(n / 10) * 10

// Весовой товар: цена за 1 кг, а продают упаковкой примерного веса — «≈ сумма за упаковку»
export const faWeighed = (p: FaProduct) => p.base === 1 && p.avg !== null
export const faEach = (p: FaProduct): [number, number] => {
  if (!faWeighed(p)) return [p.price, p.price]
  const a = p.avg as number | [number, number]
  return Array.isArray(a) ? [r10(p.price * a[0]), r10(p.price * a[1])] : [r10(p.price * a), r10(p.price * a)]
}
export const faUnitLabel = (p: FaProduct) => (faWeighed(p) ? 'за 1 кг' : p.unit === 'уп' ? 'за упаковку' : p.unit === 'кг' ? 'за 1 кг' : 'за штуку')
export const faCountLabel = (p: FaProduct) => (p.sec === 'ptitsa' && p.unit === 'кг' ? 'шт' : p.unit === 'уп' ? 'уп' : 'шт')

// Вес позиции для «Общий вес» корзины: из примерного веса или из названия («0,5 л», «250 г», «0,8 кг»)
export const faWeight = (p: FaProduct): number | null => {
  if (p.avg !== null) return Array.isArray(p.avg) ? (p.avg[0] + p.avg[1]) / 2 : p.avg
  if (p.base) return p.base
  const m = p.title.match(/(\d+(?:,\d+)?)\s*(кг|г|л|мл)\b/)
  if (!m) return null
  const v = parseFloat(m[1].replace(',', '.'))
  return m[2] === 'г' || m[2] === 'мл' ? v / 1000 : v
}
export const faKg = (n: number) => `${n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} кг`

// Короткие факты из описания: «Состав», «КБЖУ», «Срок»
export const faFacts = (p: FaProduct) => {
  const d = p.desc
  const kcal = d.match(/(\d+(?:[.,]\d+)?)\s*ккал/i)?.[1]
  const term = d.match(/(?:не более|в течение|срок годности[^\d]{0,30})\s*(\d+\s*(?:суток|сут\.?|дн[ея]й|дня|месяц\w*|час\w*))/i)?.[1]
  const gost = d.match(/(ГОСТ\s*[\d\s.-]+\d|ТУ\s*[\d.-]+)/)?.[1]?.replace(/\s+/g, ' ')
  return { kcal, term, gost }
}

// ---------- расписание ----------
// Новосибирск и Барнаул живут в UTC+7: считаем время фермы, а не время зрителя
const TZ = 7 * 3600e3
const DAY = 86400e3
const local = (d: Date) => new Date(d.getTime() + TZ)
const dayNames = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const dayFull = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
// винительный падеж: «привезём в среду», «приём до 12:00 воскресенья» — родительный
const dayAcc = ['воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу']
const dayGen = ['воскресенья', 'понедельника', 'вторника', 'среды', 'четверга', 'пятницы', 'субботы']
const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

export interface FaWave {
  deadline: Date // местное время фермы, хранится как UTC-поля
  days: [Date, Date]
  key: string
}
// Ближайшие волны доставки: заказ до 12:00 вс → пн–вт, до 12:00 ср → чт–пт
export const faWaves = (now: Date, n = 3): FaWave[] => {
  const t = local(now)
  const mid = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate())
  const out: FaWave[] = []
  for (let k = 0; k < 21 && out.length < n; k++) {
    const day = new Date(mid + k * DAY)
    const dow = day.getUTCDay()
    if (dow !== 0 && dow !== 3) continue
    const deadline = new Date(day.getTime() + 12 * 3600e3)
    if (deadline.getTime() <= t.getTime()) continue
    out.push({ deadline, days: [new Date(day.getTime() + DAY), new Date(day.getTime() + 2 * DAY)], key: day.toISOString().slice(0, 10) })
  }
  return out
}
export const faDow = (d: Date) => d.getUTCDay()
export const faDayShort = (d: Date) => dayNames[d.getUTCDay()]
export const faDayFull = (d: Date) => dayFull[d.getUTCDay()]
export const faDayAcc = (d: Date) => dayAcc[d.getUTCDay()]
export const faDayGen = (d: Date) => dayGen[d.getUTCDay()]
export const faDate = (d: Date) => `${d.getUTCDate()} ${months[d.getUTCMonth()]}`
// «пн–вт, 9–10 ноября»
export const faWaveDays = (w: FaWave) => {
  const [a, b] = w.days
  const dates = a.getUTCMonth() === b.getUTCMonth() ? `${a.getUTCDate()}–${faDate(b)}` : `${faDate(a)} – ${faDate(b)}`
  return { days: `${faDayShort(a)}–${faDayShort(b)}`, dates }
}
// «1 д 3 ч», «3 ч 20 мин», «12 мин»
export const faLeft = (ms: number) => {
  const m = Math.max(0, Math.floor(ms / 60000))
  const d = Math.floor(m / 1440)
  const h = Math.floor((m % 1440) / 60)
  const mm = m % 60
  if (d) return `${d} д ${h} ч`
  if (h) return `${h} ч ${mm} мин`
  return `${mm} мин`
}
export const faNowLocal = (now: Date) => local(now)

// Семь дней начиная с сегодняшнего для доски на главной: что происходит в каждый день
export const faWeek = (now: Date) => {
  const t = local(now)
  const mid = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mid + i * DAY)
    const w = d.getUTCDay()
    const role: 'deliver' | 'deadline' | 'rest' = [1, 2, 4, 5].includes(w) ? 'deliver' : w === 0 || w === 3 ? 'deadline' : 'rest'
    return { date: d, short: dayNames[w], num: d.getUTCDate(), role, today: i === 0, past: false }
  })
}

// ---------- прочее ----------
export const faNews = [
  { title: 'До 16 октября акция «Сырники в подарок»!', date: '2026-10-02', slug: 'do-16-oktyabrya-aktsiya-syrniki-v-podarok' },
  { title: 'Скидка на супы −30 %, на хлеб −20 %', date: '2026-08-04', slug: 'skidka-na-supy--30-na-hleb--20' },
  { title: 'Быстрый вход через Яндекс', date: '2026-07-04', slug: 'bystryj-vhod-cherez-yandeks' },
  { title: 'Возможны перебои в работе сайта…', date: '2026-06-19', slug: 'vozmozhny-pereboi-v-rabote-sajta' },
  { title: 'Официальный канал Фермы Алтая в MAX', date: '2026-06-10', slug: 'ofitsialnyj-kanal-fermy-altaya-v-mah' },
  { title: 'О доставках…', date: '2025-12-27', slug: 'o-dostavkah' },
  { title: 'С 1 декабря — переходим на две доставки в неделю', date: '2025-11-21', slug: 's-1-dekabrya---perehodim-na-dve-dostavki-v-nedelyu-' },
  { title: 'Пока будет одна доставка в неделю…', date: '2025-10-27', slug: 'poka-budet-odna-dostavka-v-nedelyu' },
]
export const faNewsDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${months[m - 1]} ${y}`
}

export interface FaReviewItem {
  name: string
  date: string
  text: string
  reply?: string
  stars?: number
}
export const faReviews: FaReviewItem[] = [
  { name: 'Римма', date: '2026-03-03', text: 'Отличное мясо свинины, брала кости для бульона. Бульон получился вкусным, насыщенным!', stars: 5 },
  { name: 'Римма', date: '2026-01-29', text: 'Заказывала свинину, очень довольна качеством мяса — никаких посторонних привкусов и запахов.', stars: 5 },
  {
    name: 'Ирина Викторовна',
    date: '2025-12-18',
    text: 'Постоянный клиент на полуфабрикаты. Последние заказы пельменей разочаровали — много теста, мало мяса.',
    reply: 'Рецептуру не меняли, передам технологу. Спасибо, что написали.',
    stars: 3,
  },
]

export const faStores: { city: string; list: string[] }[] = [
  {
    city: 'Новосибирск',
    list: [
      '«Натуральные продукты», ул. Б. Богаткова, 251а',
      '«Брюкке», ул. Широкая, 113/2',
      '«Брюкке», ул. Ватутина, 21',
      '«Брюкке», ул. Оловозаводская, 18/4',
      '«Брюкке», ул. Шевченко, 25',
      '«Брюкке», ул. Толстого, 71',
      'Продовольственный магазин, с. Марусино, ул. Серова, 13',
      'Магазин ИП Тимербулатова (напротив «Сомелье»), ул. Балтийская, 29',
      '«Белорусские продукты», ул. Кирова, 225',
      '«Татьянин двор», кондитерская, с. Ярково, Советская ул., 1л',
    ],
  },
  {
    city: 'Барнаул',
    list: [
      '«Булкамолоко», Змеиногорский тракт, 104М/5',
      '«Натуральные продукты», Змеиногорский тракт, 104П',
      '«Натуральные продукты», Новый рынок, стол 141',
      '«Сыр», пр. Красноармейский, 64',
      '«Продукты» (павильон), ул. Попова, 188',
      '«Южанин», ул. Чайковского, 19',
      '«Изобилие вкуса», ул. Кленовая, 68/1',
      '«Лэнд», пр. Социалистический, 59',
      '«Алтай фермер», ул. Власихинская, 111',
      '«Алтай фермер», ул. Малахова, 87г',
      '«Алтай фермер», ул. Малахова, 86д',
      '«Продукты», ул. Брестская, 3',
      '«Напитки продукты», ул. Сизова, 26',
      'Продуктовый мини-маркет, ул. Попова, 2а',
      '«Алтайские закрома», пр. Социалистический, 85А',
      '«Семья», 6-я Нагорная ул., 15Г/10',
      '«Путёвый», Каштановая ул., 49, пос. Казённая Заимка',
      '«Вкусные продукты», Партизанская ул., 61',
      '«Вкусные продукты», пр. Социалистический, 128',
      '«Алтайские продукты», ул. Советская, 3',
      '«Здоровая еда от ФАНЦА», Змеиногорский тракт, 49',
    ],
  },
  {
    city: 'Алтайский край',
    list: [
      '«Карамелька», с. Бобровка, ул. Ленина, 71',
      '«Ириска», с. Бобровка, ул. Майская, 2',
      '«Рублик», с. Власиха, ул. Мамонтова, 49',
      '«Изобилие вкуса», Бельмесёво, ул. Белгородская, 8/1',
      '«Почти даром», Новоалтайск, ул. Партизанская, 8',
      '«Фермер’ОК», Новоалтайск, ул. Центральная, 18',
      '«Визит», Новоалтайск, 7-й микрорайон, 15а',
      '«Продуктовый», с. Берёзовка, ул. 40 лет Победы, 43',
    ],
  },
]
