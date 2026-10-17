// Данные и константы концепта редизайна «Мясной лавки Саныч».
// Источник: http://доставка-мяса.рф (каталог, цены, условия и тексты сняты в октябре 2026).
// Картинки скопированы в public/redesign/sanych/: хостинг оригинала отдаёт их только по http,
// и на https-странице концепта они бы не загрузились.
// Это концепт, не официальный сайт: цены, тексты и фото принадлежат владельцу.

export type SnCategoryId =
  | 'beef'
  | 'pork'
  | 'lamb'
  | 'chicken'
  | 'duck'
  | 'turkey'
  | 'rabbit'
  | 'sets'
  | 'grill'

/**
 * kg — цена за кг, берут на вес; piece — цена за кг, продаётся куском известного веса;
 * pack — упаковка; set — набор от 12 кг; portion — готовый шашлык.
 */
export type SnUnit = 'kg' | 'piece' | 'pack' | 'set' | 'portion'

export interface SnProduct {
  id: string
  cat: SnCategoryId
  name: string
  price: number
  unit: SnUnit
  img: string
  /** Вес одного куска, кг: [от, до]. */
  piece?: [number, number]
  /** Минимальный заказ, кг. */
  min?: number
  /** Можно выбрать разделку: куском или нарубить. */
  cut?: boolean
  note?: string
}

export interface SnCategory {
  id: SnCategoryId
  label: string
  /** Иконка-голова животного с сайта оригинала. */
  icon?: string
  lead: string
}

export const snCategories: SnCategory[] = [
  {
    id: 'beef',
    label: 'Говядина',
    icon: 'beef',
    lead: 'Бычки-двухлетки голштинской, холмогорской и чёрно-пёстрой породы. Летом на свободном выпасе, зимой — луговое сено.',
  },
  { id: 'pork', label: 'Свинина', icon: 'pork', lead: 'Охлаждённая свинина с малых ферм Новосибирской области: от вырезки до полутуши.' },
  { id: 'lamb', label: 'Баранина', icon: 'lamb', lead: 'Романовская, меринос, эдильбай, карачаевская. Тушки 10–18 кг и отдельные части.' },
  { id: 'chicken', label: 'Курица и яйца', icon: 'chicken', lead: 'Фермерская суповая курица, цыплята-корнишоны и деревенские яйца.' },
  { id: 'duck', label: 'Утка', icon: 'duck', lead: 'Домашняя утка с фермы.' },
  { id: 'turkey', label: 'Индейка', icon: 'turkey', lead: 'Домашняя индейка с фермы.' },
  { id: 'rabbit', label: 'Кролик', icon: 'rabbit', lead: 'Охлаждённые тушки кролика — диетическое мясо.' },
  { id: 'sets', label: 'Мясные наборы', lead: 'Выгоднее, чем по отдельности: набор от 12 кг по цене за кг.' },
  { id: 'grill', label: 'Готовый шашлык', lead: 'Шашлык и люля-кебаб на углях. Привезём за 25–45 минут.' },
]

/** Разделы оригинала без товаров: показываем честно, «под заказ». */
export const snOnRequest: { label: string; icon?: string }[] = [
  { label: 'Телятина', icon: 'veal' },
  { label: 'Конина' },
]

export const snProducts: SnProduct[] = [
  { id: 'beef-bifstroganov', cat: 'beef', name: 'Бифстроганов', price: 750, unit: 'kg', img: 'beef-bifstroganov.jpg', min: 2 },
  { id: 'beef-vyrezka', cat: 'beef', name: 'Вырезка говяжья', price: 1020, unit: 'kg', img: 'beef-vyrezka.jpg', min: 2, cut: true },
  { id: 'beef-grudinka', cat: 'beef', name: 'Грудинка', price: 677, unit: 'kg', img: 'beef-grudinka.jpg', min: 2, cut: true },
  { id: 'beef-grudinka-na-khryaschakh', cat: 'beef', name: 'Грудинка на хрящах', price: 691, unit: 'kg', img: 'beef-grudinka-na-khryaschakh.jpg', min: 2, cut: true },
  { id: 'beef-gulyash', cat: 'beef', name: 'Гуляш', price: 765, unit: 'kg', img: 'beef-gulyash.jpg', min: 2 },
  { id: 'beef-zadnyaya-chetvert', cat: 'beef', name: 'Задняя четверть', price: 670, unit: 'kg', img: 'beef-zadnyaya-chetvert.jpg', min: 2, cut: true },
  { id: 'beef-legkie-govyazhi', cat: 'beef', name: 'Лёгкие говяжьи', price: 383, unit: 'kg', img: 'beef-legkie-govyazhi.jpg' },
  { id: 'beef-liver', cat: 'beef', name: 'Ливер', price: 300, unit: 'kg', img: 'beef-liver.jpg' },
  { id: 'beef-lopatka-na-kosti', cat: 'beef', name: 'Лопатка на кости', price: 814, unit: 'kg', img: 'beef-lopatka-na-kosti.jpg', min: 2, cut: true },
  { id: 'beef-myakot-bedra-zachischennaya', cat: 'beef', name: 'Мякоть бедра зачищенная', price: 835, unit: 'kg', img: 'beef-myakot-bedra-zachischennaya.jpg', min: 2, cut: true },
  { id: 'beef-myakot-bedra-nezachischennaya', cat: 'beef', name: 'Мякоть бедра незачищенная', price: 799, unit: 'kg', img: 'beef-myakot-bedra-nezachischennaya.jpg', min: 2, cut: true },
  { id: 'beef-myakot-dlya-pervogo', cat: 'beef', name: 'Мякоть для первого', price: 692, unit: 'kg', img: 'beef-myakot-dlya-pervogo.jpg', min: 2, cut: true },
  { id: 'beef-pashina', cat: 'beef', name: 'Пашина', price: 372, unit: 'kg', img: 'beef-pashina.jpg', cut: true },
  { id: 'beef-perednyaya-chetvert', cat: 'beef', name: 'Передняя четверть', price: 530, unit: 'kg', img: 'beef-perednyaya-chetvert.jpg', min: 2, cut: true },
  { id: 'beef-pechen', cat: 'beef', name: 'Печень', price: 312, unit: 'kg', img: 'beef-pechen.jpg' },
  { id: 'beef-pochki-govyazhi', cat: 'beef', name: 'Почки говяжьи', price: 180, unit: 'kg', img: 'beef-pochki-govyazhi.jpg' },
  { id: 'beef-rebra-myasnye', cat: 'beef', name: 'Рёбра мясные', price: 685, unit: 'kg', img: 'beef-rebra-myasnye.jpg', min: 2, cut: true },
  { id: 'beef-rulka-myasnaya', cat: 'beef', name: 'Рулька говяжья', price: 434, unit: 'kg', img: 'beef-rulka-myasnaya.jpg', min: 2, cut: true },
  { id: 'beef-serdtce', cat: 'beef', name: 'Сердце', price: 280, unit: 'kg', img: 'beef-serdtce.jpg' },
  { id: 'beef-tolstyy-kray', cat: 'beef', name: 'Толстый край, 6–12 ребро', price: 668, unit: 'kg', img: 'beef-tolstyy-kray-s-6-po-12-rebro.jpg', cut: true },
  { id: 'beef-tonkiy-kray', cat: 'beef', name: 'Тонкий край', price: 690, unit: 'kg', img: 'beef-tonkiy-kray.jpg', cut: true },
  { id: 'beef-farsh', cat: 'beef', name: 'Фарш', price: 470, unit: 'kg', img: 'beef-farsh.jpg', note: 'Крутим под заказ из мякоти задка, минимум жира. Можно добавить свинину, баранину или жир — напишите в комментарии.' },
  { id: 'beef-farsh-domashniy', cat: 'beef', name: 'Фарш домашний', price: 370, unit: 'kg', img: 'beef-farsh-domashniy.jpg', note: 'Из обрезков лопатки, грудинки и шеи, с небольшим количеством жира. Крутим под заказ.' },
  { id: 'beef-yazyk', cat: 'beef', name: 'Язык', price: 600, unit: 'kg', img: 'beef-yazyk.jpg' },
  { id: 'pork-vyrezka', cat: 'pork', name: 'Вырезка зачищенная', price: 720, unit: 'piece', img: 'pork-vyrezka.jpg', piece: [0.6, 1], cut: true },
  { id: 'pork-vyrezka-raw', cat: 'pork', name: 'Вырезка незачищенная', price: 700, unit: 'piece', img: 'pork-vyrezka-2.jpg', piece: [0.6, 1], cut: true },
  { id: 'pork-grudinka', cat: 'pork', name: 'Грудинка на кости', price: 640, unit: 'piece', img: 'pork-zadnyaya-chetvert-2.jpg', piece: [6, 8], cut: true },
  { id: 'pork-gulyash-svinoy', cat: 'pork', name: 'Гуляш свиной', price: 550, unit: 'piece', img: 'pork-gulyash-svinoy.jpg', piece: [1.8, 2] },
  { id: 'pork-zadnyaya-chetvert', cat: 'pork', name: 'Задняя четверть', price: 460, unit: 'kg', img: 'pork-zadnyaya-chetvert.jpg', cut: true },
  { id: 'pork-koreyka-clean', cat: 'pork', name: 'Корейка без кости зачищенная', price: 697, unit: 'piece', img: 'pork-koreyka-na-kosti-2-2.jpg', piece: [4, 6], cut: true },
  { id: 'pork-koreyka-raw', cat: 'pork', name: 'Корейка без кости незачищенная', price: 658, unit: 'piece', img: 'pork-koreyka-na-kosti-2.jpg', piece: [4, 6], cut: true },
  { id: 'pork-koreyka-na-kosti', cat: 'pork', name: 'Корейка на кости', price: 698, unit: 'piece', img: 'pork-koreyka-na-kosti.jpg', piece: [4, 6], cut: true },
  { id: 'pork-kotleta-na-kosti-i-shkure', cat: 'pork', name: 'Котлета на кости и шкуре', price: 720, unit: 'kg', img: 'pork-kotleta-na-kosti-i-shkure.jpg', cut: true },
  { id: 'pork-lopatka', cat: 'pork', name: 'Лопатка', price: 480, unit: 'piece', img: 'pork-lopatka.jpg', piece: [6, 12], cut: true },
  { id: 'pork-lopatochnyy-otrub', cat: 'pork', name: 'Лопаточный отруб', price: 240, unit: 'kg', img: 'pork-lopatochnyy-otrub.jpg', cut: true },
  { id: 'pork-borsch', cat: 'pork', name: 'Набор для борща', price: 370, unit: 'piece', img: 'pork-gulyash-svinoy-2.jpg', piece: [12, 12] },
  { id: 'pork-bulon', cat: 'pork', name: 'Набор для бульона', price: 180, unit: 'piece', img: 'pork-gulyash-svinoy-2-2.jpg', piece: [12, 15] },
  { id: 'pork-hash', cat: 'pork', name: 'Набор для хаша', price: 180, unit: 'piece', img: 'pork-gulyash-svinoy-2-2-2.jpg', piece: [12, 15] },
  { id: 'pork-nozhki-svinye', cat: 'pork', name: 'Ножки свиные', price: 130, unit: 'kg', img: 'pork-nozhki-svinye.jpg' },
  { id: 'pork-okorok-myakot', cat: 'pork', name: 'Окорок мякоть', price: 495, unit: 'piece', img: 'pork-okorok-myakot.jpg', piece: [9, 16], cut: true, note: 'Поросята 4–6 месяцев: мякоть, минимум сала.' },
  { id: 'pork-okorok-otrub', cat: 'pork', name: 'Окорок, отруб', price: 460, unit: 'kg', img: 'pork-okorok-otrub.jpg', cut: true },
  { id: 'pork-otrub-rebro-koreyka', cat: 'pork', name: 'Отруб рёбра-корейка', price: 780, unit: 'kg', img: 'pork-otrub-rebro-koreyka.jpg', cut: true },
  { id: 'pork-polutusha', cat: 'pork', name: 'Полутуша свиная', price: 426, unit: 'piece', img: 'pork-polu-tushi.jpg', piece: [37, 47], cut: true },
  { id: 'pork-rebra', cat: 'pork', name: 'Рёбра свиные', price: 650, unit: 'piece', img: 'pork-rebryshki.jpg', piece: [1, 1.5], cut: true },
  { id: 'pork-rebryshki-na-shkure', cat: 'pork', name: 'Рёбрышки на шкуре', price: 570, unit: 'kg', img: 'pork-rebryshki-na-shkure.jpg', cut: true },
  { id: 'pork-rulka-myasnaya', cat: 'pork', name: 'Рулька свиная', price: 750, unit: 'piece', img: 'pork-rulka-myasnaya.jpg', piece: [0.7, 0.7], cut: true, note: 'Средний вес рульки 0,7 кг.' },
  { id: 'pork-steyki', cat: 'pork', name: 'Стейки', price: 1020, unit: 'kg', img: 'pork-steyki.jpg' },
  { id: 'pork-shashlyk-iz-svininy', cat: 'pork', name: 'Шашлык из свинины', price: 630, unit: 'kg', img: 'pork-shashlyk-iz-svininy.jpg' },
  { id: 'pork-sheyka', cat: 'pork', name: 'Шейка', price: 760, unit: 'kg', img: 'pork-sheyka.jpg', cut: true, note: 'Нежное и сочное мясо для жарки, запекания и шашлыка.' },
  { id: 'lamb-zadnyaya-noga-okorok', cat: 'lamb', name: 'Задняя нога, окорок', price: 672, unit: 'kg', img: 'lamb-zadnyaya-noga-okorok.jpg', min: 2, cut: true },
  { id: 'lamb-koreyka', cat: 'lamb', name: 'Корейка', price: 826, unit: 'kg', img: 'lamb-koreyka.jpg', cut: true, note: 'Только корейка на 8 рёбрах, без седла, шеи и грудинки. Лучшая часть барашка для углей, можно зачистить рёбра.' },
  { id: 'lamb-kurdyuk', cat: 'lamb', name: 'Курдюк', price: 425, unit: 'kg', img: 'lamb-kurdyuk.jpg', note: 'Даёт вкус плову, шашлыку, картофелю и мантам.' },
  { id: 'lamb-myakot-okoroka', cat: 'lamb', name: 'Мякоть окорока', price: 680, unit: 'kg', img: 'lamb-myakot-okoroka-zadney-nogi.jpg', cut: true },
  { id: 'lamb-perednyaya-noga-lopatka', cat: 'lamb', name: 'Передняя нога, лопатка', price: 660, unit: 'kg', img: 'lamb-perednyaya-noga-lopatka.jpg', min: 2, cut: true },
  { id: 'lamb-rebro-grudinka', cat: 'lamb', name: 'Рёбра с грудинкой', price: 758, unit: 'kg', img: 'lamb-rebro-grudinka.jpg', min: 2, cut: true },
  { id: 'lamb-spinka', cat: 'lamb', name: 'Спинка', price: 624, unit: 'kg', img: 'lamb-spinka.jpg', cut: true },
  { id: 'lamb-tushka', cat: 'lamb', name: 'Тушка баранины', price: 590, unit: 'piece', img: 'lamb-tushka.jpg', piece: [10, 18], cut: true, note: 'Вес туши 10–18 кг, без курдюка. Породы: романовская, меринос, эдильбай, карачаевская.' },
  { id: 'lamb-sheya-medalon', cat: 'lamb', name: 'Шея, медальон', price: 890, unit: 'kg', img: 'lamb-sheya-medalon.jpg', cut: true },
  { id: 'chicken-supovaya', cat: 'chicken', name: 'Курица суповая', price: 480, unit: 'kg', img: 'chicken-kuritca-supovaya.jpg', cut: true },
  { id: 'chicken-kornishony', cat: 'chicken', name: 'Цыплята-корнишоны', price: 390, unit: 'piece', img: 'chicken-tcyplyata-kornishony.jpg', piece: [0.5, 0.5], note: 'Средний вес тушки 500 г. Напольное содержание, только натуральный корм.' },
  { id: 'chicken-eggs', cat: 'chicken', name: 'Яйцо куриное домашнее', price: 140, unit: 'pack', img: 'chicken-yaytco-kurinoe-domashnee.jpg', note: 'Деревенские яйца, в упаковке 10 штук.' },
  { id: 'duck', cat: 'duck', name: 'Утка домашняя', price: 380, unit: 'kg', img: 'duck-utka-domashnyaya.jpg', cut: true },
  { id: 'turkey', cat: 'turkey', name: 'Индейка домашняя', price: 450, unit: 'kg', img: 'turkey-indeyka-domashnyaya.jpg', cut: true },
  { id: 'rabbit', cat: 'rabbit', name: 'Кролик', price: 450, unit: 'kg', img: 'rabbit-krolik.jpg', cut: true, note: 'Тушка охлаждённая. Диетическое мясо, подходит для детского питания.' },
  { id: 'set-beef', cat: 'sets', name: 'Мясной набор из говядины', price: 700, unit: 'set', img: 'sets-myasnoy-nabor-iz-govyadiny.jpg', note: 'Края, шея, грудинка, рёбрышки, лопаточная часть. Кости и жир — не больше 30% веса.' },
  { id: 'set-chicken', cat: 'sets', name: 'Мясной набор из курицы', price: 380, unit: 'set', img: 'sets-myasnoy-nabor-iz-govyadiny-2.jpg', note: 'Крыло, голень, бедро, грудка.' },
  { id: 'set-pork', cat: 'sets', name: 'Мясной набор из свинины', price: 390, unit: 'set', img: 'sets-myasnoy-nabor-iz-govyadiny-3.jpg', note: '3 куска грудинки, 2–3 куска корейки, лопатка, 2 куска шеи, 2–3 куска задка, рулька.' },
  { id: 'grill-krylyshki', cat: 'grill', name: 'Крылышки куриные', price: 290, unit: 'portion', img: 'grill-krylyshki-kurinye.jpg' },
  { id: 'grill-lyulya', cat: 'grill', name: 'Люля-кебаб из говядины', price: 450, unit: 'portion', img: 'grill-lyulya-kebab-iz-govyadiny.jpg' },
  { id: 'grill-rebryshki', cat: 'grill', name: 'Ребрышки свиные', price: 520, unit: 'portion', img: 'grill-rebryshki-svinye.jpg' },
  { id: 'grill-serdechki', cat: 'grill', name: 'Сердечки куриные в кунжуте', price: 380, unit: 'portion', img: 'grill-serdechki-kurinye-v-kunzhute.jpg' },
  { id: 'grill-baranina', cat: 'grill', name: 'Шашлык из баранины', price: 460, unit: 'portion', img: 'grill-shashlyk-iz-baraniny.jpg' },
  { id: 'grill-sheya', cat: 'grill', name: 'Шашлык из свиной шеи', price: 420, unit: 'portion', img: 'grill-shashlyk-sheya-svinaya.jpg' },
]

/** «Еженедельные предложения» оригинала: то, что берут каждую неделю. */
export const snWeekly = ['chicken-supovaya', 'lamb-tushka', 'pork-grudinka', 'pork-koreyka-na-kosti', 'pork-sheyka']

const BASE = '/redesign/sanych'
export const snPath = (sub = '') => `${BASE}${sub}`
export const snImg = (file: string) => `${BASE}/img/${file}`
export const snIcon = (name: string) => `${BASE}/icons/${name}.png`

export const snFind = (id: string) => snProducts.find((p) => p.id === id)
export const snOf = (cat: SnCategoryId) => snProducts.filter((p) => p.cat === cat)
export const snCategory = (id: string) => snCategories.find((c) => c.id === id)

// ---------- количество и деньги ----------

/** Шаг и минимум счётчика в единицах товара (кг, куски, упаковки, порции). */
export const snStep = (p: SnProduct) => (p.unit === 'kg' ? 0.5 : 1)
export const snMin = (p: SnProduct) => (p.unit === 'set' ? 12 : p.unit === 'kg' ? (p.min ?? 1) : 1)

/** Сумма строки: [от, до]. У кусков вес известен диапазоном, поэтому и сумма — диапазон. */
export const snSum = (p: SnProduct, qty: number): [number, number] => {
  if (p.unit === 'piece' && p.piece) return [p.price * p.piece[0] * qty, p.price * p.piece[1] * qty]
  return [p.price * qty, p.price * qty]
}

/** Вес строки в кг: [от, до]; у яиц и шашлыка веса нет. */
export const snWeight = (p: SnProduct, qty: number): [number, number] => {
  if (p.unit === 'piece' && p.piece) return [p.piece[0] * qty, p.piece[1] * qty]
  if (p.unit === 'kg' || p.unit === 'set') return [qty, qty]
  return [0, 0]
}

const rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 })

export const snRub = (value: number) => `${rub.format(Math.round(value))} ₽`
export const snNum = (value: number) => num.format(value)
export const snRange = ([a, b]: [number, number]) =>
  Math.round(a) === Math.round(b) ? snRub(a) : `${rub.format(Math.round(a))}–${snRub(b)}`

/** Подпись цены: «за кг», «за упаковку 10 шт». */
export const snPer = (p: SnProduct) =>
  ({ kg: 'за кг', piece: 'за кг', set: 'за кг', pack: 'за 10 шт', portion: 'за порцию' })[p.unit]

/** Единица в счётчике. */
export const snQtyLabel = (p: SnProduct, qty: number) => {
  if (p.unit === 'kg' || p.unit === 'set') return `${snNum(qty)} кг`
  if (p.unit === 'pack') return `${qty} уп.`
  return `${qty} шт`
}

/** Вес куска словами: «кусок 4–6 кг», «≈ 0,7 кг». */
export const snPieceLabel = (p: SnProduct) => {
  if (!p.piece) return ''
  const [a, b] = p.piece
  return a === b ? `≈ ${snNum(a)} кг` : `кусок ${snNum(a)}–${snNum(b)} кг`
}

// ---------- условия ----------

export const snRules = {
  minOrder: 1500,
  freeFrom: 5000,
  freeKg: 10,
  toFlat: 300,
  overweight: 'Перевес возможен на 250–500 г',
}

export const snCuts = [
  { id: 'whole', label: 'Куском', hint: 'для своей разделки' },
  { id: 'chop', label: 'Нарубить', hint: 'порционно, без остатка' },
] as const
export type SnCut = (typeof snCuts)[number]['id']

/** Дата доставки «завтра» по новосибирскому времени, а не по часам зрителя. */
export const snTomorrow = (now = new Date()) => {
  const tomorrow = new Date(now.getTime() + 24 * 3600 * 1000)
  const fmt = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Novosibirsk', ...o }).format(tomorrow)
  return { day: fmt({ day: 'numeric', month: 'long' }), weekday: fmt({ weekday: 'long' }) }
}

export const snContacts = {
  phone: '+7 (913) 062-47-41',
  phoneHref: 'tel:+79130624741',
  whatsapp: 'https://wa.me/79130624741',
  messenger: '+7 (913) 921-98-87',
  messengerHref: 'tel:+79139219887',
  messengerName: 'Александр',
  telegram: 'https://t.me/+79139219887',
  email: 'info@dachnij-dvorik.ru',
  hours: 'с 8:00 до 20:00, без выходных',
  answer: 'Отвечаем с 9:00 до 19:30',
  farm: 'Новосибирская область, Мошковский район, с. Локти',
  farmHours: 'Пн–Пт, 9:00–18:00',
  original: 'http://доставка-мяса.рф',
}

export const snFaq = [
  {
    q: 'Есть ли минимальная сумма заказа?',
    a: 'Да, от 1 500 ₽ — иначе упаковка и доставка не окупаются.',
  },
  {
    q: 'Сколько стоит доставка?',
    a: 'Заказ от 5 000 ₽ или от 10 кг привезём до подъезда бесплатно. Подъём до квартиры — 300 ₽. Четверти и полутуши — до подъезда, с подъёмом поможет экспедитор по договорённости.',
  },
  {
    q: 'Когда привезёте?',
    a: 'На следующий день после заказа. Утром позвоним и согласуем время. Возим по Новосибирску и области с 9:30 до 21:00.',
  },
  {
    q: 'Можно быстрее?',
    a: 'Экспресс-доставка в день заказа — в течение 6 часов, за доплату. Работает для заказов с 9:00 до 18:00, оплата до комплектации.',
  },
  {
    q: 'Почему сумма может измениться?',
    a: 'Тушу не нарубить на одинаковые куски, поэтому реальный вес отличается от заказанного — обычно на 250–500 г. Когда заказ соберём, пришлём SMS с точной суммой.',
  },
  {
    q: 'Можно нарубить мясо?',
    a: 'Да. Выберите «Нарубить» в карточке товара или напишите в комментарии, как разделать: на суп, на плов, порционно.',
  },
  {
    q: 'Что делать, если нужного куска нет на сайте?',
    a: 'Напишите нам — скажем, когда сможем его привезти.',
  },
]

export const snRecipes = [
  {
    title: 'Чайная баранина',
    img: 'recipe-1.jpg',
    meat: 'lamb-koreyka',
    items: ['Бараньи антрекоты — 0,8 кг', 'Лук — 3–4 шт.', 'Чеснок — 5 зубчиков', 'Корица — 2–3 палочки', 'Мёд — 1 ст. л.', 'Крепкий чай — 1 стакан', 'Соль, перец по вкусу'],
  },
  {
    title: 'Зразы фаршированные',
    img: 'recipe-2.jpg',
    meat: 'beef-farsh-domashniy',
    items: ['Фарш говяжий или домашний — 500 г', 'Молоко — 1 стакан', 'Белый хлеб — 2 куска', 'Яйцо — 3 шт.', 'Лук — 1 шт.', 'Майонез — 0,5 ст. л.', 'Соль, перец по вкусу'],
  },
  {
    title: 'Бузы по-бурятски',
    img: 'recipe-3.jpg',
    meat: 'beef-myakot-dlya-pervogo',
    items: ['Говядина — 400 г', 'Свинина — 450 г', 'Лук — 2 шт.', 'Чеснок — 2 зубчика', 'Вода — 0,5 стакана', 'Соль, перец по вкусу'],
  },
  {
    title: 'Гусь праздничный',
    img: 'recipe-4.jpg',
    items: ['Гусь домашний — 1 шт.', 'Приправа для курицы — 2 пакетика', 'Зелёные яблоки — 1,5 кг', 'Чернослив — 300 г', 'Лимон — 1 шт.', 'Соль — 3 ст. л.'],
  },
]
