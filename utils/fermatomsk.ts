// Данные концепта редизайна сайта семейной фермы FermaTomsk (пос. Рассвет, Томская область).
// Источник: https://fermatomsk.ru (самописный одностраничник), снято 23 октября 2026.
// Это концепт, не официальный сайт. Фото товаров и фермы грузятся с сайта фермы; в папке
// концепта лежат только логотип (красится CSS-маской, нужен свой origin) и og-картинка.
// Разделы и страницы придуманы концептом: на оригинале 9 товаров одним списком без корзины.
// Перепелиное яйцо (140 ₽ / 20 шт) владелец скрыл на сайте — в концепт не переносим.

export type FmGroupId = 'milk' | 'curd' | 'cream' | 'eggs'

export interface FmProduct {
  id: string
  group: FmGroupId
  name: string
  price: number
  // Фасовка из строки «Стоимость: 150 р / 10 шт».
  unit: string
  img: string
  text?: string[]
}

const orig = (file: string) => `https://fermatomsk.ru/content/img/${file}`

export const fmImg = (file: string) => `/redesign/fermatomsk/${file}`

export const fmPath = (path = '') => `/redesign/fermatomsk${path || '/'}`

export const fmGroups: { id: FmGroupId; title: string }[] = [
  { id: 'milk', title: 'Молоко' },
  { id: 'curd', title: 'Творог и сыры' },
  { id: 'cream', title: 'Сметана и масло' },
  { id: 'eggs', title: 'Яйца' },
]

export const fmProducts: FmProduct[] = [
  { id: 'milk-goat', group: 'milk', name: 'Козье молоко', price: 180, unit: '1 л', img: orig('milk_goat.jpeg') },
  { id: 'milk-cow', group: 'milk', name: 'Коровье молоко', price: 100, unit: '1 л', img: orig('milk_cow.jpeg') },
  { id: 'curd', group: 'curd', name: 'Творог', price: 180, unit: '500 г', img: orig('curd.jpeg') },
  { id: 'cheese-adyghe', group: 'curd', name: 'Сыр адыгейский', price: 130, unit: '100 г', img: orig('cheese_adyghe.jpeg') },
  { id: 'cheese-hard', group: 'curd', name: 'Сыр твёрдый', price: 130, unit: '100 г', img: orig('cheese_proc.jpeg') },
  { id: 'sour-cream', group: 'cream', name: 'Сметана', price: 180, unit: '250 г', img: orig('sour_cream.jpeg') },
  { id: 'butter', group: 'cream', name: 'Масло сливочное', price: 300, unit: '200 г', img: orig('butter.jpeg') },
  { id: 'eggs', group: 'eggs', name: 'Яйцо куриное', price: 150, unit: '10 шт', img: orig('egg_k.jpeg') },
  {
    id: 'whey',
    group: 'milk',
    name: 'Сыворотка',
    price: 50,
    unit: '1 л',
    img: orig('sivorotka.jpeg'),
    text: [
      'Сыворотка — жидкость, которая остаётся после сворачивания и процеживания молока. Образуется при производстве твёрдых сыров, кислых сыров и творога. Состоит на 93,7% из воды, остальные 6,3% — всё самое лучшее, что есть в молоке.',
      'В состав молочной сыворотки входит полный набор витаминов B, а также витамин C, никотиновая кислота, холин, витамины A и E, биотин. Сыворотка содержит кальций, магний и пробиотики.',
      'Она благотворно влияет на состояние кожи и волос, поэтому на её основе делают косметику.',
    ],
  },
]

export const fmFindProduct = (id: string) => fmProducts.find((p) => p.id === id)

// Общая строка о продуктах с оригинала — показываем в шторке товара.
export const fmPromise =
  'Продукты нашего производства не содержат консервантов, красителей, усилителей вкуса и ароматов, антибиотиков и гормонов роста.'

export const fmAbout = [
  'Наша ферма находится в 25 км от Томска в посёлке Рассвет.',
  'Наши козы и коровы питаются только натуральными кормами. Каждое животное имеет ветеринарный паспорт.',
  'Наша ферма — это семейное дело, которое основано на любви, уважении и качестве продуктов, которые мы создаём!',
]

export const fmPhotos: { src: string; alt: string; wide: boolean }[] = [
  { src: orig('goat.jpg'), alt: 'Козлёнок во дворе фермы', wide: false },
  { src: orig('v2.jpg'), alt: 'Валерий на дойке', wide: false },
  { src: orig('g6.jpg'), alt: 'Козы и козлята во дворе', wide: true },
  { src: orig('m.jpeg'), alt: 'Марина', wide: false },
  { src: orig('c1.jpg'), alt: 'Корова', wide: true },
  { src: orig('c2.jpg'), alt: 'Телёнок в стойле', wide: true },
  { src: orig('g5.jpg'), alt: 'Козы выглядывают из загона', wide: true },
  { src: orig('g4.jpg'), alt: 'Коза', wide: true },
  { src: orig('sh1.jpg'), alt: 'Овцы и ягнёнок', wide: true },
  { src: orig('r2.jpg'), alt: 'Кролики на сене', wide: false },
  { src: orig('ch1.jpg'), alt: 'Куры в курятнике', wide: true },
]

// Отзывы на оригинале — скриншоты переписки; текст перенесён, скриншот открывается по кнопке.
export const fmReviews = [
  {
    text: 'Совсем забыла написать про сыр. А знаете почему? Потому что он был такой вкусный, что у него один недостаток — его мало)) Мы втроём накинулись и съели его за 5 минут))) Причём и по соли, и по консистенции просто высший пилотаж! И грецкий орех там тоже очень сочетается. Сильно напомнил французские сыры! Вообщем — браво, сыр невероятный! Спасибо вашим родителям и козочкам',
    reply: 'Рада, что понравилось! Обязательно передадим Ваш тёплый отзыв, уверена, что он очень всех вдохновит',
    time: '13:08',
    shot: orig('otz_1.jpg'),
  },
  {
    text: 'Устроили дегустацию сыра «независимыми экспертами» — однозначно супер! Маме передайте, что в восторге! Мнение 4 человек. Когда сказал, что это собственное производство, реально, выше всяких похвал! Сбалансированно и отметили, что натурально. Большое спасибо! Без сомнения бомба!!!',
    reply: 'Спасибо Вам огромное, рада, что понравилось! Сегодня передадим Ваш тёплый отзыв! Он однозначно вдохновит на новые успехи',
    time: '20:39',
    shot: orig('otz_2.jpg'),
  },
]

export const fmContacts = {
  original: 'https://fermatomsk.ru/',
  phone: '+7 (923) 287-57-83',
  phoneHref: 'tel:+79232875783',
  telegram: 'https://t.me/+79232875783',
  max: 'https://max.ru/u/f9LHodD0cOK0qDU_4DsIFKdQB802L-r7qZ3luPSQ_rNEi4Mj0X_c4Iz_pXQ',
  vk: 'https://vk.com/id154895756',
  place: 'пос. Рассвет, 25 км от Томска',
  delivery: 'Действует бесплатная доставка по Томску со вторника по пятницу.',
}

export const fmPrice = (n: number) => `${n.toLocaleString('ru-RU')} ₽`

const tomskParts = (d: Date) => {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tomsk', year: 'numeric', month: 'numeric', day: 'numeric' })
    .formatToParts(d)
    .reduce<Record<string, number>>((acc, x) => (x.type === 'literal' ? acc : { ...acc, [x.type]: Number(x.value) }), {})
  return new Date(Date.UTC(p.year, p.month - 1, p.day))
}

const weekdayIn = ['в воскресенье', 'в понедельник', 'во вторник', 'в среду', 'в четверг', 'в пятницу', 'в субботу']
const weekdayShort = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

export interface FmDay {
  key: string
  short: string
  date: string
  // «во вторник, 27 октября» — для предложения и текста заказа.
  phrase: string
}

// Ближайшие дни доставки (вторник–пятница) по томскому времени, начиная с завтра:
// до скольки принимают заказ на завтра, на сайте не сказано, поэтому сегодняшний день не предлагаем.
export const fmDeliveryDays = (now = new Date(), count = 4): FmDay[] => {
  const days: FmDay[] = []
  const d = tomskParts(now)
  while (days.length < count) {
    d.setUTCDate(d.getUTCDate() + 1)
    const wd = d.getUTCDay()
    if (wd < 2 || wd > 5) continue
    const date = `${d.getUTCDate()} ${months[d.getUTCMonth()]}`
    days.push({ key: d.toISOString().slice(0, 10), short: weekdayShort[wd], date, phrase: `${weekdayIn[wd]}, ${date}` })
  }
  return days
}

// Текст заказа для Telegram или MAX: так владелец получает заказ сейчас, только собранный вручную.
export const fmOrderText = (
  lines: { product: FmProduct; qty: number; sum: number }[],
  form: { address: string; name: string; phone: string; comment: string },
  day?: FmDay,
) => {
  const rows = lines.map((l) => `• ${l.product.name}, ${l.product.unit} × ${l.qty} — ${fmPrice(l.sum)}`)
  const total = lines.reduce((n, l) => n + l.sum, 0)
  return [
    'Здравствуйте! Хочу заказать:',
    ...rows,
    `Итого: ${fmPrice(total)}`,
    '',
    day ? `Доставка ${day.phrase}` : 'Доставка: подскажите ближайший день',
    form.address.trim() ? `Адрес: ${form.address.trim()}` : '',
    [form.name.trim(), form.phone.trim()].filter(Boolean).join(', '),
    form.comment.trim(),
  ]
    .filter((s, i, all) => s !== '' || (i > 0 && all[i - 1] !== ''))
    .join('\n')
    .trim()
}
