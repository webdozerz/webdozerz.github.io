// Данные и константы концепта редизайна FoodGood Tomsk.
// Источник: https://foodgoodtomsk.ru (снято в октябре 2026). Это концепт, не официальный сайт.

export type FgCollection = 'in-stock' | 'sale' | 'gift'
export type FgKind = 'Ягоды' | 'Птица' | 'Рыба' | 'Мёд' | 'Сертификат'

export interface FgProduct {
  id: string
  name: string
  price: number
  oldPrice?: number
  priceNote?: string
  image: string
  collection: FgCollection
  kind: FgKind
  lead: string
  details: { label: string; value: string }[]
  note?: string
}

const img = (path: string) => `https://i.taplink.st/p/${path}`

const FARM = 'Томская область, д. Кандинка, КФХ Кузнецов'
const FARM_NOTE = 'Экологически чистое мясо, без добавления химии.'
const CHILLED = 'Охлаждённое / замороженное'

export const fgProducts: FgProduct[] = [
  {
    id: 'malina-polka',
    name: 'Малина сладкая, ароматная «Полька», Киргизия, 3,5 л',
    price: 1300,
    image: img('2/b/4/b/63655979.jpg?0'),
    collection: 'in-stock',
    kind: 'Ягоды',
    lead: 'Сладкая ароматная малина сорта «Полька» прямой поставкой из Киргизии.',
    details: [
      { label: 'Происхождение', value: 'Киргизия' },
      { label: 'Фасовка', value: '3,5 л' },
    ],
  },
  {
    id: 'klubnika-albion-2kg',
    name: 'Клубника «Альбион» сладкая, Киргизия, ~2 кг',
    price: 1300,
    image: img('c/2/c/8/62312798.jpg?0'),
    collection: 'in-stock',
    kind: 'Ягоды',
    lead: 'Ароматная, сладкая, сочная клубника сорта «Альбион».',
    details: [
      { label: 'Происхождение', value: 'Киргизия' },
      { label: 'Фасовка', value: 'Ящик ~2 кг (±200 г)' },
    ],
  },
  {
    id: 'klubnika-albion-500',
    name: 'Клубника «Альбион» Киргизия, сладкая, 500 г',
    price: 500,
    image: img('8/5/c/4/64930330.jpg?0'),
    collection: 'in-stock',
    kind: 'Ягоды',
    lead: 'Сладкая клубника сорта «Альбион» в удобной упаковке на 500 г.',
    details: [
      { label: 'Происхождение', value: 'Киргизия' },
      { label: 'Фасовка', value: '500 г' },
    ],
  },
  {
    id: 'tsyplenok-broiler',
    name: 'Цыплёнок бройлер, тушка 1,5–2,5 кг',
    price: 490,
    priceNote: 'цена за 1 кг',
    image: img('d/5/2/8/66066627.jpg?0'),
    collection: 'in-stock',
    kind: 'Птица',
    lead: 'Потрошёная тушка бройлера от фермерского хозяйства Томской области.',
    details: [
      { label: 'Вес тушки', value: '1,5–2,5 кг' },
      { label: 'Состояние', value: CHILLED },
      { label: 'Хозяйство', value: FARM },
    ],
    note: FARM_NOTE,
  },
  {
    id: 'farsh-kuriny',
    name: 'Фарш куриный фермерский, ручной обвалки, 1 кг',
    price: 650,
    priceNote: 'цена за 1 кг',
    image: img('0/7/8/e/66066659.jpg?0'),
    collection: 'in-stock',
    kind: 'Птица',
    lead: 'Фарш из филе грудки и филе окорочка ручной обвалки.',
    details: [
      { label: 'Состав', value: 'филе грудки + филе окорочка' },
      { label: 'Состояние', value: CHILLED },
      { label: 'Хозяйство', value: FARM },
    ],
    note: FARM_NOTE,
  },
  {
    id: 'yaytso-fermerskoe',
    name: 'Яйцо куриное фермерское, 10 шт',
    price: 190,
    image: img('2/e/5/d/66066649.jpg?0'),
    collection: 'in-stock',
    kind: 'Птица',
    lead: 'Свежее фермерское яйцо.',
    details: [
      { label: 'Фасовка', value: '10 шт' },
      { label: 'Хозяйство', value: FARM },
    ],
    note: 'Экологически чистый продукт, без добавления химии.',
  },
  {
    id: 'file-okoroka',
    name: 'Филе окорочка цыплёнка, без кости, на коже, 1 кг',
    price: 600,
    priceNote: 'цена за 1 кг',
    image: img('e/8/3/a/66066635.png?0'),
    collection: 'in-stock',
    kind: 'Птица',
    lead: 'Филе окорочка без кости, на коже.',
    details: [
      { label: 'Состояние', value: CHILLED },
      { label: 'Хозяйство', value: FARM },
    ],
    note: FARM_NOTE,
  },
  {
    id: 'okorochok',
    name: 'Окорочок цыплёнка, 1 кг',
    price: 550,
    priceNote: 'цена за 1 кг',
    image: img('d/5/e/3/69836483.jpg?0'),
    collection: 'in-stock',
    kind: 'Птица',
    lead: 'Классический куриный окорочок от фермерского хозяйства.',
    details: [
      { label: 'Состояние', value: CHILLED },
      { label: 'Хозяйство', value: FARM },
    ],
    note: FARM_NOTE,
  },
  {
    id: 'blinchiki-shchuka-ris',
    name: 'Блинчики щука и рис, 600 г',
    price: 580,
    image: img('b/4/a/1/70637741.jpg?0'),
    collection: 'in-stock',
    kind: 'Рыба',
    lead: 'Блинчики с начинкой из щуки и риса.',
    details: [{ label: 'Вес', value: '600 г' }],
  },
  {
    id: 'blinchiki-shchuka-tartar',
    name: 'Блинчики щука и соус тар-тар, 600 г',
    price: 650,
    image: img('6/5/8/f/70637723.jpg?0'),
    collection: 'in-stock',
    kind: 'Рыба',
    lead: 'Блинчики с щукой и соусом тар-тар.',
    details: [{ label: 'Вес', value: '600 г' }],
  },
  {
    id: 'rulet-shchuka',
    name: 'Рулет из щуки для запекания, классический, 850 г',
    price: 650,
    image: img('b/e/e/1/68222214.jpg?0'),
    collection: 'in-stock',
    kind: 'Рыба',
    lead: 'Рулет из щуки, готовый к запеканию.',
    details: [
      { label: 'Вес', value: '850 г' },
      {
        label: 'Состав',
        value:
          'филе щуки, лук репчатый, морковь свежая, капуста белокочанная, масло растительное, яйцо куриное, лаваш, сахар, соль',
      },
    ],
  },
  {
    id: 'kotlety-mintay',
    name: 'Котлеты из минтая парабельские, 650 г',
    price: 750,
    image: img('b/8/a/6/70637738.jpg?0'),
    collection: 'in-stock',
    kind: 'Рыба',
    lead: 'Парабельские котлеты из минтая.',
    details: [{ label: 'Вес', value: '650 г' }],
  },
  {
    id: 'med-raznotravye',
    name: 'Мёд «Таёжное разнотравье», 0,5 л / 700 г',
    price: 300,
    oldPrice: 500,
    image: img('6/f/0/7/61128225.jpg?0'),
    collection: 'sale',
    kind: 'Мёд',
    lead:
      'Мёд таёжное разнотравье из Алтайского края. Благодаря высокому содержанию глюкозы, ферментов и микроэлементов хорошо регулирует работу сердечно-сосудистой системы и ЖКТ.',
    details: [
      { label: 'Происхождение', value: 'Алтайский край' },
      { label: 'Фасовка', value: '0,5 л / 700 г' },
    ],
  },
  ...[3000, 5000].map<FgProduct>((value, i) => ({
    id: `sertifikat-${value}`,
    name: `Подарочный сертификат на ${value} ₽`,
    price: value,
    image: img(i === 0 ? 'e/1/5/9/64856314.jpg?0' : 'd/9/e/1/64856316.jpg?0'),
    collection: 'gift',
    kind: 'Сертификат',
    lead: 'Подарок, который выберут сами: любая продукция из наличия в магазине или в интернет-магазине.',
    details: [
      { label: 'В комплекте', value: 'тематическая открытка' },
      { label: 'Доставка', value: 'бесплатно при необходимости' },
      { label: 'Срок действия', value: '6 месяцев с момента покупки' },
    ],
    note: 'Правила: сертификат можно использовать один раз, на всю сумму или на сумму выше номинала с доплатой. Сдача не выдаётся, остаток сгорает, обмен на деньги не предусмотрен. Оплата доставки сертификатом не предусмотрена.',
  })),
]

export const fgCollections: { slug: '' | FgCollection; title: string }[] = [
  { slug: '', title: 'Все товары' },
  { slug: 'in-stock', title: 'В наличии' },
  { slug: 'sale', title: 'Скидки' },
  { slug: 'gift', title: 'Сертификаты' },
]

export const fgPath = (sub = '') => `/redesign/foodgood${sub}`

export const fgFindProduct =(id: string) => fgProducts.find((p) => p.id === id)

export const fgFormatPrice = (value: number) =>
  `${new Intl.NumberFormat('ru-RU').format(value)} ₽`

export const FG_FREE_DELIVERY_FROM = 5000

export interface FgDeliveryOption {
  id: 'pickup' | 'tomsk' | 'near' | 'far'
  title: string
  price: number
  hint: string
}

export const fgDelivery: FgDeliveryOption[] = [
  { id: 'pickup', title: 'Самовывоз', price: 0, hint: 'г. Томск, ул. Герцена 78/1' },
  { id: 'tomsk', title: 'Доставка по Томску', price: 300, hint: 'бесплатно от 5 000 ₽' },
  {
    id: 'near',
    title: 'Ближний пригород',
    price: 350,
    hint: 'Северный парк, Левобережный лайф, Серебряный бор, Южные ворота, Тимирязево',
  },
  {
    id: 'far',
    title: 'Дальний пригород',
    price: 450,
    hint: 'Северск, Кисловка, Дзержинское, Светлый, Зональный, Просторный, Холмы, Ключи, Апрель, Мирный, Корнилово, Сосновка',
  },
]

export const fgTimeSlots = ['День с 12:00 до 18:00', 'Вечер с 19:00 до 22:30']

export const fgContacts = {
  owner: 'ИП Казарцев А.В.',
  phone: '(3822) 22-83-36',
  phoneHref: 'tel:+73822228336',
  address: 'Томск, ул. Герцена 78/1',
  addressNote: 'заезд с Герцена',
  mapHref: 'https://yandex.ru/maps/?text=%D0%A2%D0%BE%D0%BC%D1%81%D0%BA%2C%20%D0%93%D0%B5%D1%80%D1%86%D0%B5%D0%BD%D0%B0%2078%2F1',
  hours: { from: 11, to: 20 },
  messengers: [
    { id: 'telegram', title: 'Telegram', href: 'https://t.me/foodgoodtomsk' },
    { id: 'whatsapp', title: 'WhatsApp', href: 'https://wa.me/79138751929' },
    {
      id: 'max',
      title: 'Max',
      href: 'https://max.ru/u/f9LHodD0cOJ8ycRq86pr8II0_3kBgy2aDGV14FwgwpmuUq97_alxJq3sI9c',
    },
    { id: 'max-channel', title: 'Канал в Max', href: 'https://max.ru/foodgoodtsk' },
    { id: 'vk', title: 'ВКонтакте', href: 'https://vk.com/foodgoodtomsk' },
  ],
}

export const fgImages = {
  logo: 'https://i.taplink.st/a/5/a/9/a/383705.png?9',
  // Без текста и водяных знаков: оригинальная обложка (65748025) — скриншот из Instagram с подписью.
  hero: img('a/8/2/a/65747760.jpg?0'),
  store: img('1/d/8/4/65746659.jpg?0'),
  review: img('8/b/1/0/65746668.jpg?1'),
  leaf: img('1/4/2/1/65746713.jpg?0'),
  reviews: [img('a/8/2/a/65747760.jpg?0'), img('e/3/a/8/65747763.jpg?0')],
}
