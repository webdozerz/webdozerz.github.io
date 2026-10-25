// Концепт редизайна «Любимые Букеты» (https://bukety.tomsk.ru/, OpenCart 2.x, тема Fastor).
// Разделы, их размеры, условия доставки и оплаты, контакты — с сайта 25.10.2026.
// Товары — в buketyCatalog.ts. Фото грузятся с сайта оригинала: миниатюры 500×625 из /cache/,
// в карточке товара — оригиналы 1000×1250.
// Цены доставки — как в оформлении заказа (их платит покупатель); на странице «Доставка»
// у оригинала другие (150/300/500 ₽), это расхождение есть в письме.

export interface BkOptValue {
  label: string
  price: number
}

export interface BkProduct {
  id: string
  title: string
  // Для товара с вариантами — минимальная цена.
  price: number
  sec: string
  comp: string
  img: string
  photos: string[]
  occ: string[]
  opt?: { title: string; values: BkOptValue[] }
}

export type BkGroupId = 'bouquets' | 'roses' | 'flowers' | 'gifts'

export interface BkSection {
  id: string
  title: string
  // Сколько товаров в разделе на сайте оригинала.
  count: number
}

export const bkPath = (path = '') => `/redesign/bukety${path || '/'}`

export const bkGroups: { id: BkGroupId; title: string; text: string; icon: string; sections: BkSection[] }[] = [
  {
    id: 'roses',
    title: 'Розы',
    text: 'Эквадор, Кения, кустовые, пионовидные',
    icon: 'rose',
    sections: [
      { id: 'rozy-ekvador', title: 'Розы Эквадор', count: 117 },
      { id: 'rozy-ekvador-40sm', title: 'Эквадор 40 см', count: 6 },
      { id: 'rozy-keniya', title: 'Розы Кения', count: 16 },
      { id: 'roza-ekvador-luxury', title: 'Эквадор LUXURY', count: 10 },
      { id: 'rozy-eksklyuzivnye', title: 'Эксклюзивные розы', count: 38 },
      { id: 'francuzskie-rozy', title: 'Французские розы', count: 6 },
      { id: 'rozy-kustovye', title: 'Кустовые розы', count: 47 },
    ],
  },
  {
    id: 'bouquets',
    title: 'Букеты',
    text: 'сборные, моно, PREMIUM и с любимыми цветами',
    icon: 'bouquet',
    sections: [
      { id: 'sostavnye-bukety', title: 'Сборные букеты', count: 153 },
      { id: 'bukety-premium', title: 'Букеты PREMIUM', count: 61 },
      { id: 'eksklyuzivnye-bukety', title: 'Эксклюзивные', count: 7 },
      { id: 'mono-bukety', title: 'Моно-букеты', count: 3 },
      { id: 'bukety-na-novyj-god', title: 'Новогодние', count: 8 },
      { id: 'bukety-s-hrizantemami', title: 'С хризантемами', count: 47 },
      { id: 'bukety-s-eustomoj', title: 'С эустомой', count: 44 },
      { id: 'bukety-s-orhideej', title: 'С орхидеей', count: 43 },
      { id: 'bukety-s-gvozdikami', title: 'С гвоздиками', count: 30 },
      { id: 'bukety-s-irisami', title: 'С ирисами', count: 27 },
      { id: 'bukety-s-pionami', title: 'С пионами', count: 25 },
      { id: 'bukety-s-alstromeriej', title: 'С альстромерией', count: 22 },
      { id: 'bukety-s-gerberami', title: 'С герберами', count: 20 },
      { id: 'bukety-s-gortenziej', title: 'С гортензией', count: 15 },
      { id: 'bukety-s-romashkami', title: 'С ромашками', count: 15 },
      { id: 'bukety-s-tyulpanami', title: 'С тюльпанами', count: 14 },
      { id: 'bukety-s-gipsofiloj', title: 'С гипсофилой', count: 10 },
      { id: 'bukety-s-mattioloj', title: 'С маттиолой', count: 10 },
      { id: 'bukety-s-lyutikami', title: 'С лютиками', count: 7 },
      { id: 'bukety-s-podsolnuhami', title: 'С подсолнухами', count: 7 },
      { id: 'bukety-s-liliej', title: 'С лилией', count: 3 },
    ],
  },
  {
    id: 'flowers',
    title: 'Цветы поштучно',
    text: 'соберите свой букет, роза от 129 ₽',
    icon: 'stem',
    sections: [
      { id: 'rose', title: 'Розы поштучно', count: 18 },
      { id: 'roza-kustovaya', title: 'Роза кустовая', count: 12 },
      { id: 'rose-garden', title: 'Розы пионовидные', count: 12 },
      { id: 'tulips', title: 'Тюльпаны', count: 12 },
      { id: 'hrizantema', title: 'Хризантема', count: 8 },
      { id: 'gerbera', title: 'Герберы', count: 8 },
      { id: 'eustoma', title: 'Эустома', count: 8 },
      { id: 'alstromeriya', title: 'Альстромерия', count: 7 },
      { id: 'flowers', title: 'Другие цветы', count: 31 },
    ],
  },
  {
    id: 'gifts',
    title: 'Подарки',
    text: 'коробки, корзины, игрушки, шары',
    icon: 'gift',
    sections: [
      { id: 'cvety-v-shlyapnyh-korobkah', title: 'Шляпные коробки', count: 15 },
      { id: 'cvetochnye-kompozicii', title: 'Композиции и сумочки', count: 25 },
      { id: 'cvetochnye-korziny', title: 'Цветочные корзины', count: 64 },
      { id: 'serdca-iz-cvetov', title: 'Сердца из цветов', count: 22 },
      { id: 'shariki', title: 'Шарики', count: 16 },
      { id: 'igrushki', title: 'Игрушки', count: 13 },
      { id: 'sladosti-konfety', title: 'Сладости', count: 16 },
      { id: 'fruktovye-korziny', title: 'Фруктовые корзины', count: 9 },
    ],
  },
]

export const bkSections = bkGroups.flatMap((g) => g.sections.map((s) => ({ ...s, group: g.id })))
export const bkFindSection = (id: string) => bkSections.find((s) => s.id === id)
export const bkGroupOf = (secId: string) => bkGroups.find((g) => g.sections.some((s) => s.id === secId))

// Лента под шапкой: самые частые разделы, как зелёная полоса оригинала.
export const bkRibbon: { id: string; title: string; icon: string }[] = [
  { id: 'rozy-ekvador', title: 'Розы', icon: 'rose' },
  { id: 'sostavnye-bukety', title: 'Букеты', icon: 'bouquet' },
  { id: 'bukety-premium', title: 'PREMIUM', icon: 'crown' },
  { id: 'cvety-v-shlyapnyh-korobkah', title: 'В коробке', icon: 'box' },
  { id: 'cvetochnye-korziny', title: 'Корзины', icon: 'basket' },
  { id: 'serdca-iz-cvetov', title: 'Сердца', icon: 'heart' },
  { id: 'rose', title: 'Поштучно', icon: 'stem' },
  { id: 'igrushki', title: 'Игрушки', icon: 'bear' },
  { id: 'shariki', title: 'Шарики', icon: 'balloon' },
]

// «Повод» оригинала разделён на «Кому» и «Повод». «Новый год» на сайте отдаёт 404 —
// вместо него раздел «Новогодние букеты».
export const bkWhom: { id: string; title: string; count: number }[] = [
  { id: 'lyubimoj-devushke', title: 'Любимой', count: 15 },
  { id: 'den-materi', title: 'Маме', count: 30 },
  { id: 'babushke', title: 'Бабушке', count: 15 },
  { id: 'tyoshe', title: 'Тёще', count: 15 },
  { id: 'direktoru', title: 'Директору', count: 15 },
]

export const bkOccasions: { id: string; title: string; count: number }[] = [
  { id: 'den-rozhdeniya', title: 'День рождения', count: 15 },
  { id: '8-marta', title: '8 марта', count: 30 },
  { id: '14-fevralya', title: '14 февраля', count: 15 },
  { id: '1-sentyabrya', title: '1 сентября', count: 15 },
  { id: 'den-materi', title: 'День матери', count: 30 },
  { id: 'vesennie-bukety', title: 'Весенние', count: 22 },
  { id: 'letnie-bukety', title: 'Летние', count: 23 },
]

export const bkOccTitle = (id: string) =>
  bkWhom.find((o) => o.id === id)?.title ?? bkOccasions.find((o) => o.id === id)?.title ?? id

export const bkBudgets: { id: string; title: string; short: string; min: number; max: number; count: number }[] = [
  { id: 'low', title: 'до 2 000 ₽', short: 'до 2 тыс.', min: 0, max: 1999, count: 36 },
  { id: 'mid', title: '2 000 – 5 000 ₽', short: '2–5 тыс.', min: 2000, max: 4999, count: 196 },
  { id: 'high', title: '5 000 – 10 000 ₽', short: '5–10 тыс.', min: 5000, max: 9999, count: 155 },
  { id: 'top', title: 'от 10 000 ₽', short: 'от 10 тыс.', min: 10000, max: Infinity, count: 50 },
]

export const bkTotalProducts = 1061

export const bkFind = (id: string) => bkProducts.find((p) => p.id === id)

// Значение по умолчанию — первое, как предвыбирает OpenCart.
export const bkPrice = (p: BkProduct, pick?: string) =>
  p.opt?.values.find((v) => v.label === pick)?.price ?? p.opt?.values[0].price ?? p.price

export const bkHasChoice = (p: BkProduct) => Boolean(p.opt && new Set(p.opt.values.map((v) => v.price)).size > 1)

export type BkZoneId = 'tomsk' | 'outskirts' | 'seversk' | 'far' | 'pickup'

export const bkZones: { id: BkZoneId; title: string; text: string; price: number | null }[] = [
  {
    id: 'tomsk',
    title: 'Томск',
    text: 'Центральное КПП, Степановка, Академгородок, Зелёные Горки, Спичфабрика, Солнечный',
    price: 0,
  },
  {
    id: 'outskirts',
    title: 'Пригород Томска',
    text: 'Зональный, Предтеченск, Лоскутово, Просторный, Апрель, Геологов, Ключи, Аникино, Басандайка, Росинка, Спутник, Кузовлево, Сосновка, Заварзино, Новомихайловка',
    price: 199,
  },
  {
    id: 'seversk',
    title: 'Северск и посёлки',
    text: 'Северск, Светлый, Чёрная речка, Кисловка, Тахтамышево, Дзержинский, Копылово, Богашево, Аэропорт, Синий утёс, Коларово, Лучаново, Барабинка, Эушта, Протопопово, Воронино, Рассвет',
    price: 349,
  },
  {
    id: 'far',
    title: 'Томская область',
    text: 'Каждые 10 км — 130 ₽, стоимость скажем по телефону',
    price: null,
  },
  { id: 'pickup', title: 'Самовывоз', text: 'Круглосуточно, без выходных', price: 0 },
]

export type BkPayId = 'cash' | 'card' | 'online'

export const bkPayments: { id: BkPayId; title: string; text: string }[] = [
  { id: 'cash', title: 'Наличными курьеру', text: 'При получении заказа' },
  {
    id: 'card',
    title: 'Картой курьеру',
    text: 'В праздничные дни расчёт картой при доставке может быть недоступен',
  },
  { id: 'online', title: 'Онлайн', text: 'СБП, VISA, MasterCard, МИР, Yandex Pay, SberPay — через Альфа-Банк' },
]

// Бесплатно к каждому заказу — со страницы «Доставка».
export const bkFree = [
  { icon: 'card', title: 'Открытка', text: 'к любому заказу, напишем ваш текст' },
  { icon: 'camera', title: 'Фото вручения', text: 'пришлём на почту, в WhatsApp или Telegram' },
  { icon: 'bell', title: 'Уведомления', text: 'e-mail и СМС о каждом шаге заказа' },
  { icon: 'scissors', title: 'Работа флориста', text: 'сборка и оформление букета' },
]

export const bkCare = [
  { icon: 'scissors', title: 'Подрежьте цветы', text: 'Срез наискосок на 2–3 см острым ножом' },
  { icon: 'drop', title: 'Меняйте воду ежедневно', text: 'Прохладная вода, чистая ваза' },
  { icon: 'sun', title: 'Выберите место', text: 'Без прямого солнца, сквозняка и батареи рядом' },
]

export const bkContacts = {
  original: 'https://bukety.tomsk.ru/',
  phone: '+7 903 955-99-28',
  phoneHref: 'tel:+79039559928',
  phone2: '+7 (3822) 22-99-28',
  phone2Href: 'tel:+73822229928',
  email: 'info@bukety.tomsk.ru',
  whatsapp: 'https://wa.me/79039559928',
  telegram: 'https://t.me/buketytomsk',
  vk: 'https://m.vk.com/buketytomskru',
  hours: 'круглосуточно, без выходных',
  coupon: 'lovebuket',
  rating: [
    { title: '2ГИС', value: '4,5' },
    { title: 'Фламп', value: '4,5' },
  ],
}

const rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
export const bkRub = (n: number) => `${rub.format(n)} ₽`

export const bkPlural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few
  return many
}

// Время в Томске (UTC+7) независимо от часового пояса посетителя.
export const bkTomskNow = () => new Date(Date.now() + (7 * 60 + new Date().getTimezoneOffset()) * 60000)
export const bkHM = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
export const bkDay = (d: Date) => `${d.getDate()} ${months[d.getMonth()]}`
