// Концепт редизайна «Мне розы» (https://mnerozy.ru/, OpenCart 1.5, своя тема mnerozy).
// Разделы, их размеры, зоны и цены доставки, оплата, контакты, отзывы — с сайта 26.10.2026.
// Товары — в mnerozyCatalog.ts. Фото грузятся с сайта оригинала (/image/data/, квадрат 650–1000 px).
// Цены доставки — как в меню и оформлении заказа (0/199/349/499 ₽); на странице из подвала
// у оригинала другие (бесплатно/150/300/500 ₽), это расхождение есть в письме.
import { mrProducts } from './mnerozyCatalog'

export interface MrOptValue {
  label: string
  add: number
}

export interface MrProduct {
  id: string
  title: string
  price: number
  sec: string
  img: string
  src: string
  short?: string
  text?: string
  promo?: boolean
  opts?: { title: string; values: MrOptValue[] }[]
}

export interface MrSection {
  id: string
  title: string
  short: string
  count: number
  img: string
}

const img = (path: string) => `https://mnerozy.ru/image/data/${path}`

export const mrPath = (path = '') => `/redesign/mnerozy${path || '/'}`

export const mrSections: MrSection[] = [
  { id: 'bukety-s-rozami', title: 'Розы Эквадор', short: 'Эквадор', count: 115, img: img('instamarkt/buket_iz_51_rozi.jpg') },
  { id: 'rose', title: 'Розы поштучно', short: 'Поштучно', count: 25, img: img('buket_rozy/25_roz_pink_mondial.jpg') },
  { id: 'rozy-gollandiya', title: 'Розы Голландия', short: 'Голландия', count: 18, img: img('rose/buket_21_roza_v_oformlenii.jpg') },
  { id: 'rozy-kenya', title: 'Розы Кения', short: 'Кения', count: 6, img: img('rozy_holland_kenya/25_roz_kenia_v_oformlenii.jpg') },
  {
    id: 'rozy-pionovidnye-premuim',
    title: 'Пионовидные розы Luxury',
    short: 'Пионовидные',
    count: 38,
    img: img('rose/roza_pionovidnaya_sadovaya.jpg'),
  },
  {
    id: 'rozy-kustovye',
    title: 'Кустовые розы',
    short: 'Кустовые',
    count: 62,
    img: img('instamarkt/buket_iz_25_kustovih_roz_v_oformlenii(4).jpg'),
  },
  { id: 'bukety-iz-cvetov', title: 'Сборные букеты', short: 'Сборные', count: 138, img: img('bukety_iz_cvetov/buket_legkost.jpg') },
  { id: 'premium-bukety', title: 'Premium-букеты', short: 'Premium', count: 62, img: img('instamarkt/buket_sofia.jpg') },
  { id: 'bukety-mono', title: 'Монобукеты', short: 'Моно', count: 67, img: img('buket_mono/buket_15_vetok_cvetnoi_gipsofily.jpg') },
  { id: 'bukety-s-pionami', title: 'Букеты с пионами', short: 'Пионы', count: 54, img: img('instamarkt/buket_16.jpg') },
  { id: 'bukety-s-tyulpanami', title: 'Букеты с тюльпанами', short: 'Тюльпаны', count: 45, img: img('tulpan/buket_5_rozovyh_tulpanov.jpeg') },
  {
    id: 'bukety-s-gortenziej',
    title: 'Букеты с гортензией',
    short: 'Гортензии',
    count: 42,
    img: img('instamarkt/5_gortenzii.jpg'),
  },
  {
    id: 'bukety-s-hrizantemoj',
    title: 'Букеты с хризантемой',
    short: 'Хризантемы',
    count: 64,
    img: img('instamarkt/buket_iz_hrizantem_viena.jpg'),
  },
  {
    id: 'buket-s-gerberami',
    title: 'Букеты с герберами',
    short: 'Герберы',
    count: 26,
    img: img('buket_gerbery/buket_iz_7_gerber_s_oformleniem.jpg'),
  },
  { id: 'buket-s-orhideej', title: 'Букеты с орхидеей', short: 'Орхидеи', count: 18, img: img('bukety_iz_cvetov/buket_zamanchiviy.jpg') },
  { id: 'ohapki-cvetov', title: 'Охапки цветов', short: 'Охапки', count: 19, img: img('instamarkt/ohapka_iz_7_yarkih_gortenzii.jpg') },
  { id: 'korobochki-s-cvetami', title: 'Цветы в коробке', short: 'Коробочки', count: 68, img: img('korobochki/korobochka_romantika.jpg') },
  { id: 'korziny-iz-cvetov', title: 'Корзины из цветов', short: 'Корзины', count: 57, img: img('korziny/korzina_35_roz.jpg') },
  { id: 'flowers', title: 'Цветы поштучно', short: 'Цветы', count: 53, img: img('cvety/gortenzia_golubaya.jpg') },
  { id: 'podarki', title: 'Подарки к букету', short: 'Подарки', count: 40, img: img('podarki/mishka_belyi_djon.jpg') },
]

// У оригинала каталог — плоский список из 20 пунктов; в концепте те же разделы тремя группами.
export const mrGroups: { title: string; ids: string[] }[] = [
  {
    title: 'Розы',
    ids: ['bukety-s-rozami', 'rose', 'rozy-gollandiya', 'rozy-kenya', 'rozy-pionovidnye-premuim', 'rozy-kustovye'],
  },
  {
    title: 'Букеты',
    ids: [
      'bukety-iz-cvetov',
      'premium-bukety',
      'bukety-mono',
      'bukety-s-pionami',
      'bukety-s-tyulpanami',
      'bukety-s-gortenziej',
      'bukety-s-hrizantemoj',
      'buket-s-gerberami',
      'buket-s-orhideej',
    ],
  },
  { title: 'Охапки, коробки, подарки', ids: ['ohapki-cvetov', 'korobochki-s-cvetami', 'korziny-iz-cvetov', 'flowers', 'podarki'] },
]

export const mrTotalProducts = 1012
export const mrFindSection = (id: string) => mrSections.find((s) => s.id === id)
export const mrFind = (id: string) => mrProducts.find((p) => p.id === id)

// Варианты: индексы выбранных значений через дефис, «0-2». Цена — база плюс доплаты.
export const mrDefaultPick = (p: MrProduct) => (p.opts ? p.opts.map(() => 0).join('-') : '')
export const mrPickIdx = (p: MrProduct, pick: string) => {
  const parts = pick ? pick.split('-').map(Number) : []
  return (p.opts ?? []).map((o, i) => Math.min(parts[i] ?? 0, o.values.length - 1))
}
export const mrPrice = (p: MrProduct, pick = '') =>
  p.price + mrPickIdx(p, pick).reduce((sum, v, i) => sum + p.opts![i].values[v].add, 0)
export const mrPickLabel = (p: MrProduct, pick = '') =>
  mrPickIdx(p, pick)
    .map((v, i) => p.opts![i].values[v].label)
    .join(' · ')
export const mrHasPaidOpts = (p: MrProduct) => Boolean(p.opts?.some((o) => o.values.some((v) => v.add > 0)))

// Охапка роз Эквадор поштучно. У оригинала это шесть товаров с одним фото: «от 15 шт.» по 169 ₽,
// «от 25 шт.» по 139 ₽, «от 51 шт.» по 99 ₽ (и столько же «Охапок»). Длина 50–60 см — доплата за стебель.
export const mrStems = {
  min: 15,
  max: 301,
  counts: [15, 21, 25, 35, 51, 101],
  tiers: [
    { from: 15, price: 169, long: 30 },
    { from: 25, price: 139, long: 40 },
    { from: 51, price: 99, long: 30 },
  ],
  lengths: ['40–50 см', '50–60 см'],
  colors: [
    { id: 'mix', label: 'Микс', hex: 'conic-gradient(#d81b45 0 25%, #f4c2cf 0 50%, #fff 0 75%, #f08a3c 0)', img: img('buket_rozy/21_roza_mix_premium.jpg') },
    { id: 'red', label: 'Красные', hex: '#c8102e', img: img('buket_rozy/15_krasnyh_roz.jpg') },
    { id: 'white', label: 'Белые', hex: '#fbfaf6', img: img('buket_rozy/25_belyh_roz_mondial.jpg') },
    { id: 'pink', label: 'Розовые', hex: '#f6b8c6', img: img('buket_rozy/25_roz_pink_mondial.jpg') },
    { id: 'hot', label: 'Ярко-розовые', hex: '#e2387a', img: img('buket_rozy/15_roz_pink_floyd.jpg') },
    { id: 'orange', label: 'Оранжевые', hex: '#f0802e', img: img('buket_rozy/21_oranjevaya_roza_orange_crushe.jpg') },
    { id: 'yellow', label: 'Жёлтые', hex: '#f6d23a', img: img('rose/roza_equador.jpg') },
    { id: 'lilac', label: 'Сиреневые', hex: '#b9a0d6', img: img('buket_rozy/51_roza_soulmate.jpg') },
  ],
}
export const mrStemTier = (n: number) => [...mrStems.tiers].reverse().find((t) => n >= t.from) ?? mrStems.tiers[0]
export const mrStemPrice = (n: number, long: boolean) => {
  const t = mrStemTier(n)
  return t.price + (long ? t.long : 0)
}

export type MrZoneId = 'tomsk' | 'near' | 'seversk' | 'far' | 'uchebnaya' | 'usova'

export const mrZones: { id: MrZoneId; title: string; short: string; text: string; price: number; pickup?: boolean }[] = [
  {
    id: 'tomsk',
    title: 'По Томску',
    short: 'Томск',
    text: 'центральное КПП, Степановка, Зелёные горки, Спичфабрика — за час',
    price: 0,
  },
  {
    id: 'near',
    title: 'Окраины Томска',
    short: 'Окраины',
    text: 'Северный парк, Левобережный, Тимирязево, Ветеран-3, Кайдаловка, Нижние склады, Зональный, Предтеченск, Аникино, Заварзино, Мирный, Спутник, Корнилово и др.',
    price: 199,
  },
  {
    id: 'seversk',
    title: 'Северск и пригород',
    short: 'Северск',
    text: 'Северск, Нефтехим, Лоскутово, Апрель, Ключи, Копылово, Воронино, Кисловка, Чёрная речка, Кафтанчиково, Синий утёс, Эушта и др.',
    price: 349,
  },
  {
    id: 'far',
    title: 'Дальний пригород',
    short: 'Пригород',
    text: 'Аэропорт, Богашево, Светлый, Зоркальцево, Калтай, Курлек, Кандинка, Борики, Поросино, Батурино, Вершинино, Некрасово и др.',
    price: 499,
  },
  { id: 'uchebnaya', title: 'Самовывоз: Учебная, 8', short: 'Учебная, 8', text: 'магазин, круглосуточно', price: 0, pickup: true },
  { id: 'usova', title: 'Самовывоз: Усова, 4', short: 'Усова, 4', text: 'Дом Культур, 9:00–21:00', price: 0, pickup: true },
]

export type MrPayId = 'cash' | 'card' | 'online' | 'sbp'

export const mrPayments: { id: MrPayId; title: string; text: string }[] = [
  { id: 'cash', title: 'Наличными', text: 'курьеру или в магазине при самовывозе' },
  { id: 'card', title: 'Картой или СБП курьеру', text: 'терминал у курьера' },
  { id: 'online', title: 'Онлайн картой', text: 'МИР, VISA, MasterCard, SberPay, ЮMoney' },
  { id: 'sbp', title: 'Онлайн по СБП', text: 'Система быстрых платежей' },
]

// «Мы ценим ваше время»: бесплатное к каждому заказу — из блока плюсов в карточке оригинала.
export const mrFree = [
  { icon: 'truck', title: 'Доставка за час', text: 'по Томску бесплатно, круглосуточно' },
  { icon: 'card', title: 'Открытка', text: 'бесплатно к каждому заказу' },
  { icon: 'drop', title: 'Свежие цветы', text: 'поставки каждый день' },
  { icon: 'shield', title: 'Гарантия', text: '100% гарантия свежести цветов' },
]

export const mrRatings = [
  { title: '2ГИС', value: '4,7', href: 'https://go.2gis.com/hvdm3g' },
  { title: 'Google', value: '4,6', href: 'https://goo.gl/maps/Vsi4HresPtvF8URr8' },
  { title: 'Flamp', value: '4,6', href: 'https://tomsk.flamp.ru/firm/mne_rozy_salon_cvetov-422741746602850' },
]

export const mrCities = [
  { title: 'Томск', href: 'https://mnerozy.ru/' },
  { title: 'Москва', href: 'https://moscow.mnerozy.ru/' },
  { title: 'Новосибирск', href: 'https://novosibirsk.mnerozy.ru/' },
  { title: 'Кемерово', href: 'https://kemerovo.mnerozy.ru/' },
  { title: 'Барнаул', href: 'https://barnaul.mnerozy.ru/' },
  { title: 'Омск', href: 'https://omsk.mnerozy.ru/' },
]

const sys = (name: string) => `https://mnerozy.ru/image/data/system/${name}`

export const mrContacts = {
  original: 'https://mnerozy.ru/',
  phone: '+7 (952) 807-25-11',
  phoneHref: 'tel:+79528072511',
  whatsapp: 'https://wa.me/79528072511',
  telegram: 'tg://resolve?domain=79528072511',
  channel: 'https://t.me/mnerozy',
  vk: 'https://vk.com/mnerozy_tomsk',
  shops: [
    { title: 'ул. Учебная, 8', text: 'магазин и офис, круглосуточно', map: 'https://yandex.ru/maps/?text=Томск, Учебная 8' },
    { title: 'ул. Усова, 4', text: 'Дом Культур, самовывоз 9:00–21:00', map: 'https://yandex.ru/maps/?text=Томск, Усова 4' },
  ],
  apps: [
    { title: 'Google Play', img: sys('store-android.svg'), href: 'https://play.google.com/store/apps/details?id=com.saleskit.sk12&hl=ru_RU' },
    { title: 'RuStore', img: sys('store-rustore.svg'), href: 'https://www.rustore.ru/catalog/app/com.saleskit.sk12' },
    { title: 'App Store', img: sys('store-ios.svg'), href: 'https://apps.apple.com/us/app/id1565358132' },
  ],
  icons: {
    whatsapp: sys('icons/whatsapp.svg'),
    telegram: sys('icons/telegram.svg'),
    vk: sys('icons/vk.svg'),
    channel: sys('icons/telegram_ch.svg'),
  },
}

export interface MrReview {
  author: string
  date: string
  rating: number
  title: string
  text: string
}

export const mrReviewsTotal = 208

// Первые отзывы со страницы «Отзывы» оригинала, как написаны.
export const mrReviews: MrReview[] = [
  {
    "author": "Александра",
    "date": "23-05-2026",
    "rating": 5,
    "title": "букет с розами",
    "text": "Заказала букет с розами, сладости и открытку в Мнерозы к дню мамы – всё пришло быстро, красиво упаковано и с душой. Подарок понравился маме, а я получила приятный бонус‑сюрприз. Спасибо за отличный сервис!"
  },
  {
    "author": "Валерия",
    "date": "23-05-2026",
    "rating": 5,
    "title": "21 роза по аукции",
    "text": "Заказала букет роз с плюшевым мишкой и конфетами к дню рождения мамы. Доставили точно в срок, цветы свежие, упаковка красивая, а подарок‑шарик стал сюрпризом. Спасибо Мнерозы за внимательное обслуживание!"
  },
  {
    "author": "Сергей",
    "date": "01-02-2026",
    "rating": 5,
    "title": "Букет 21 роза",
    "text": "Выражаю искреннею благодарность сотрудникам компании за красивый букет роз! Всем гостям очень понравились розы. Отдельное спасибо за быструю доставку и тактичность при передаче букета."
  },
  {
    "author": "Ольга",
    "date": "09-08-2025",
    "rating": 5,
    "title": "Букет 21 роз эквадор",
    "text": "Букет заказала для своего лечащего врача, доставили в назначенное время. Букет очень свежий, я очень довольна"
  },
  {
    "author": "Оксана",
    "date": "29-07-2024",
    "rating": 5,
    "title": "Букет из 11 роз",
    "text": "Заказываю много лет. Всегда очень красивые, свежие цветы! Спасибо большое"
  },
  {
    "author": "Светлана",
    "date": "16-02-2024",
    "rating": 5,
    "title": "букет хризантем",
    "text": "В восторге от оперативности! Доставили моментально, очень благодарна!"
  },
  {
    "author": "Елена",
    "date": "21-11-2023",
    "rating": 5,
    "title": "Букет из белых кустовых хризантем",
    "text": "Спасибо команде, которая работала 20.11.2023.Быс тро и качественно собрали и доставили букет из белых хризантем в санаторий Ключи. Здоров о, что благодаря вам, даже находясь в другом регионе, я смола устроить сюрприз самому близкому человеку.Цены тоже приятные."
  },
  {
    "author": "Елена",
    "date": "21-11-2023",
    "rating": 5,
    "title": "Букет из белых кустовых хризантем",
    "text": "Спасибо команде, которая работала 20.11.2023.Быс тро и качественно собрали и доставили букет из белых хризантем в санаторий Ключи. Здоров о, что благодаря вам, даже находясь в другом регионе, я смола устроить сюрприз самому близкому человеку.Цены тоже приятные."
  },
  {
    "author": "Вячеслав",
    "date": "29-03-2023",
    "rating": 5,
    "title": "Букет 21 роза",
    "text": "Сработали быстро, букет доставили в Северск в срок, цветы простояли долго, девушка адресат довольно, значит я тоже, значит хороший магазин!)"
  },
  {
    "author": "Лариса Федотова",
    "date": "04-12-2022",
    "rating": 4,
    "title": "Букет Легкость + 11 роз, заказ 12289",
    "text": "Добрый день. Обратилась по совету дочери. Заказала два букета на золотую свадьбу. Привезли цветы во время. Букет Легкость был даже красивей и объемней, чем на картинке.Розы тоже порадовали своей свежестью. Мы остались очень довольны и виновники торжества тоже! Спасибо вам огромное, будем теперь обращаться только к вам!"
  },
  {
    "author": "Екатерина",
    "date": "27-11-2022",
    "rating": 5,
    "title": "Букет роз",
    "text": "Цветы всегда свежие, шикарные, хорошо упакованы. Доставка по времени. Долго выбирала доставку цветов в Томске, и очень рада, что нашла такой ответственный магазин! Сама нахожусь в Петербурге, цветы заказываю маме на разные праздники. Я очень довольна, всем советую!"
  },
  {
    "author": "Анна",
    "date": "05-08-2022",
    "rating": 5,
    "title": "Будет",
    "text": "Сделала заказ для поздравления подруги. Всё выполнили на отлично,букети к супер!"
  },
  {
    "author": "Денис",
    "date": "23-02-2022",
    "rating": 5,
    "title": "Гербера 31 шт",
    "text": "Здравствуйте! Неоднократно заказывал различные букеты, всё на высшем уровне, и доставка и сами цветы. Спасибо!"
  },
  {
    "author": "Марина",
    "date": "23-02-2022",
    "rating": 5,
    "title": "Букет из гербер",
    "text": "Очень удобно пользоваться подобной службой доставки. У снохи был день рождения, заказала букетик из гербер. Во-первых, оперативно, доставка бесплатная, во-вторых, цены очень демократичные и цветы свежие. Спасибо."
  },
  {
    "author": "Евгений",
    "date": "23-02-2022",
    "rating": null,
    "title": "Букет роз",
    "text": "Добрый день! Последние лет 7 только у Вас брал букеты с розами. Последнее время качество роз ужасно упало, вянут на второй-третий день. Настоятельно рекомендую сменить поставщика или продавца, который уверяет, что эти цветы свежие. Вот так вы потеряли одного из постоянных клиентов"
  },
  {
    "author": "Олег",
    "date": "22-02-2022",
    "rating": 5,
    "title": "Букет 21 роза",
    "text": "Всё сделано отлично, цветы свежие, букет красив упакован, доставлен в срок"
  },
  {
    "author": "Валерий",
    "date": "21-02-2022",
    "rating": 5,
    "title": "Букет 21 роза",
    "text": "Постоянно заказываю здесь! Розы шикарные, доставка быстрая! Рекомендую!!!! !"
  },
  {
    "author": "Павел",
    "date": "15-02-2022",
    "rating": 1,
    "title": "Букет 21 роза",
    "text": "К сожалению, качество цветов упало! Заказывал розы на 20 лет свадьбы для супруги, обещали самые свежие, в итоге часть не дожила до вечера, утром приуныли ещё несколько (("
  },
  {
    "author": "Светлана",
    "date": "06-02-2022",
    "rating": 5,
    "title": "Букет 21 роза Кения",
    "text": "Заказывала второй раз букет Кения 21 роза, доставка вовремя, цветы свежие, букет очень красивый, получатели очень довольны. Всё отлично, спасибо огромное, буду заказывать ещё!"
  },
  {
    "author": "Наталья",
    "date": "02-10-2021",
    "rating": null,
    "title": "",
    "text": "Доставка во время, но даже не положили открыточку от кого букет."
  },
  {
    "author": "Руслан",
    "date": "29-07-2021",
    "rating": null,
    "title": "Синие розы 11 штук",
    "text": "Заказ сформирован или я что то не так сделал"
  },
  {
    "author": "Татьяна",
    "date": "15-06-2021",
    "rating": null,
    "title": "букет 7 роз",
    "text": "Заказ выполнен отлично. Доставка произведена вовремя. Цветы свежие."
  },
  {
    "author": "Юрий Викторович Гунько",
    "date": "29-05-2021",
    "rating": null,
    "title": "букет из 15 роз",
    "text": "Раньше при заказе выполнено было без замечаний.Сего дня розы разного размера от 60см --5шт и10 по 50см"
  },
  {
    "author": "Андрей",
    "date": "24-05-2021",
    "rating": 5,
    "title": "Букет 25 роз",
    "text": "Демократичные цены, доставка всегда в срок!Заказывал любимой тёщи букет роз с доставкой в офис, тёща осталась довольна и я вместе с ней :) Отличный магазин, успехов Вам в бизнесе!"
  },
  {
    "author": "Сергей",
    "date": "24-05-2021",
    "rating": 5,
    "title": "Букет 21 роза",
    "text": "Не первый раз у вас заказываю букеты,и в очередной раз порадовал ваш букет и доставочка,в том числе спасибо большое консультантам и всему вашему проффесиональн ому коллективу,оче нь довольны,спаси бо вам и дальнейшего процветания!!!"
  }
]

const rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
export const mrRub = (n: number) => `${rub.format(n)} ₽`

export const mrPlural = (n: number, one: string, few: string, many: string) => {
  const a = Math.abs(n) % 100
  const b = a % 10
  if (a > 10 && a < 20) return many
  if (b > 1 && b < 5) return few
  if (b === 1) return one
  return many
}

// Поиск без учёта окончаний: «пионы» находит «пионов», «тюльпаны» — «тюльпанов».
const mrNorm = (s: string) => s.toLowerCase().replace(/ё/g, 'е')
export const mrMatch = (text: string, query: string) => {
  const hay = mrNorm(text)
  return mrNorm(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w.length > 3 ? w.slice(0, Math.max(3, w.length - 1 - Number(w.length > 5))) : w))
}

// «из 21 розы», «из 25 роз» — родительный падеж после «из».
export const mrOfRoses = (n: number) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'розы' : 'роз'}`

export const mrTomskNow = () => new Date(Date.now() + (7 * 60 + new Date().getTimezoneOffset()) * 60000)
export const mrHM = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
export const mrDay = (d: Date) => `${d.getDate()} ${months[d.getMonth()]}`
// «23-05-2026» с сайта → «23 мая 2026»
export const mrReviewDate = (s: string) => {
  const [dd, mm, yy] = s.split('-').map(Number)
  return `${dd} ${months[mm - 1]} ${yy}`
}
