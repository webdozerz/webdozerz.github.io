// Данные и константы концепта редизайна «Стиль Продукт» (рыба и морепродукты, Кемерово).
// Источник: https://www.rybasibiri.ru (магазин, «Витрина», услуги, контакты сняты в октябре 2026).
// Картинки — по адресам оригинала на static.wixstatic.com (https, отдаются как есть).
// У части товаров магазина оригинал не пишет, за что цена (минтай 29 ₽, палтус 98 ₽, щука 48 ₽):
// по смыслу это 100 г, в концепте так и подписано — уточнить у владельца.
// Это концепт, не официальный сайт: цены, тексты и фото принадлежат владельцу.

export type RsCategoryId = 'fish' | 'fillet' | 'salted' | 'squid' | 'kale' | 'semi'

/**
 * kg — цена за кг, берут на вес; g100 — цена за 100 г, берут на вес;
 * pack — цена за упаковку; whole — цена за кг, рыба целиком известного веса.
 */
export type RsUnit = 'kg' | 'g100' | 'pack' | 'whole'

export type RsBadge = 'new' | 'hit' | 'sale'

export interface RsProduct {
  id: string
  cat: RsCategoryId
  name: string
  /** Уточнение после названия: «потрошёная с головой». */
  sub?: string
  price: number
  old?: number
  unit: RsUnit
  img: string
  /** Вес упаковки словами: «250 г». */
  pack?: string
  /** Вес одной рыбы, кг: [от, до]. */
  weight?: [number, number]
  note?: string
  badge?: RsBadge
  /** false — «Нет на складе» у оригинала. */
  stock?: boolean
}

export interface RsCategory {
  id: RsCategoryId
  label: string
  short: string
  lead: string
}

export const rsCategories: RsCategory[] = [
  {
    id: 'fish',
    label: 'Свежемороженая рыба',
    short: 'Рыба целиком',
    lead: 'Тушки и потрошёная рыба с Дальнего Востока и из Санкт-Петербурга. Храним в низкотемпературных камерах.',
  },
  {
    id: 'fillet',
    label: 'Филе и стейки',
    short: 'Филе и стейки',
    lead: 'Разделываем в своём рыборазделочном цехе и покрываем глазурью, чтобы филе не теряло влагу.',
  },
  {
    id: 'salted',
    label: 'Слабосолёная рыба',
    short: 'Слабосолёная',
    lead: 'Сельдь и кета собственного посола в вакуумной упаковке.',
  },
  { id: 'squid', label: 'Кальмары', short: 'Кальмары', lead: 'Чистим и режем кальмаров в своём цехе.' },
  {
    id: 'kale',
    label: 'Морская капуста',
    short: 'Морская капуста',
    lead: 'Салаты из морской капусты собственного производства — с морковью или с клюквой.',
  },
  { id: 'semi', label: 'Полуфабрикаты', short: 'Полуфабрикаты', lead: 'Свежемороженые полуфабрикаты из нашего цеха.' },
]

const W = 'https://static.wixstatic.com/media/b851f4_'

export const rsProducts: RsProduct[] = [
  // свежемороженая рыба
  { id: 'semga-5-6', cat: 'fish', name: 'Сёмга', sub: 'потрошёная с головой, 5–6 кг', price: 1080, unit: 'whole', weight: [5, 6], img: 'd4f27e5e43ab415fb5658800985a4db1~mv2.jpeg', note: 'Качество «Премиум», Чили.' },
  { id: 'semga-4-5', cat: 'fish', name: 'Сёмга', sub: 'потрошёная с головой, 4–5 кг', price: 1060, unit: 'whole', weight: [4, 5], img: '4a89eb2890ed42358aa1f936aeb3262f~mv2.jpeg', note: 'Качество «Премиум», Чили.' },
  { id: 'forel', cat: 'fish', name: 'Форель радужная', sub: 'потрошёная с головой', price: 850, unit: 'whole', weight: [0.5, 0.8], img: 'fd42c7a17f07400ab89ca928d1dde99b~mv2.png', note: 'Вакуумная упаковка.' },
  { id: 'sibas', cat: 'fish', name: 'Сибас', sub: 'неразделанный', price: 580, unit: 'whole', weight: [0.4, 0.5], img: '696d7912f7fa4abab71f000c8c683745~mv2.jpeg', note: 'Вакуумная упаковка.' },
  { id: 'kambala', cat: 'fish', name: 'Камбала', sub: 'потрошёная, без головы, плавников и хвоста', price: 390, unit: 'kg', img: '52aa1591050f40079639296b42c4660c~mv2.jpeg', note: 'Ожидаем приход.' },
  { id: 'lakerda', cat: 'fish', name: 'Лакерда японская (желтохвост)', sub: 'неразделанная', price: 340, unit: 'kg', img: '6d685cca6cc840c5a8d67ff2023cffb7~mv2.jpeg' },
  { id: 'saida', cat: 'fish', name: 'Сайда серебристая', sub: 'потрошёная без головы', price: 312, unit: 'kg', img: '650c5fbe69bd4f588ebea09f1979ea73~mv2.jpeg' },
  { id: 'terpug', cat: 'fish', name: 'Терпуг', sub: 'неразделанный', price: 298, unit: 'kg', img: 'ad3fb31c3b44406a9283455ba3405f02~mv2.png' },
  { id: 'piksha', cat: 'fish', name: 'Пикша', sub: 'потрошёная без головы', price: 288, unit: 'kg', img: 'b92db93cae0a41beab57b0fdf90181e7~mv2.jpg' },
  { id: 'gorbusha', cat: 'fish', name: 'Горбуша', sub: 'потрошёная без головы', price: 280, unit: 'kg', img: '6bc763f4e62d4c56b0cd2c3f1c68b650~mv2.jpeg' },
  { id: 'kefal', cat: 'fish', name: 'Кефаль дальневосточная', sub: 'неразделанная', price: 272, unit: 'kg', img: '507feb1331b34e678dd4506771b60dae~mv2.png' },
  { id: 'makrurus', cat: 'fish', name: 'Макрурус северный', sub: 'потрошёный без головы', price: 190, unit: 'kg', img: '86cd5e92b8e04b50a7ac9ccd302da26a~mv2.jpeg' },
  { id: 'kongrio', cat: 'fish', name: 'Конгрио (креветочная рыба)', sub: 'потрошёная без головы', price: 0, unit: 'kg', img: '1e3a16d9063c41daa199eea7e59a3a70~mv2.jpeg', badge: 'new', stock: false },
  { id: 'sig', cat: 'fish', name: 'Сиг сибирский (пыжьян)', sub: 'неразделанный', price: 0, unit: 'kg', img: 'bcc993d266a34b5b88a5998d7b98f2d4~mv2.png', stock: false },
  { id: 'khanos', cat: 'fish', name: 'Ханос (молочная рыба)', sub: 'неразделанная', price: 0, unit: 'kg', img: '439bc77915a542979ef2377c6e61f17e~mv2.jpg', stock: false },
  { id: 'khoki', cat: 'fish', name: 'Хоки (макруронус)', sub: 'потрошёный без головы', price: 0, unit: 'kg', img: 'c8ffe54ab7584e27b156c67ceeacb61c~mv2.jpg', stock: false },

  // филе и стейки
  { id: 'paltus-steiki', cat: 'fillet', name: 'Палтус синекорый', sub: 'стейки', price: 98, unit: 'g100', img: '4a25a8906157413c9e1cd0adbe0124d0~mv2.jpg', badge: 'hit' },
  { id: 'chavycha-steiki', cat: 'fillet', name: 'Чавыча (королевский лосось)', sub: 'стейки', price: 152, unit: 'g100', img: '041b6b0633764ad2a6e927a2079f212b~mv2.jpg' },
  { id: 'semga-steiki', cat: 'fillet', name: 'Сёмга', sub: 'стейки', price: 137, unit: 'g100', img: '3526779e23ef404191a1bd896a2671ad~mv2.jpg' },
  { id: 'forel-file', cat: 'fillet', name: 'Форель радужная', sub: 'филе на коже', price: 112, unit: 'g100', img: '9a668e701efb484dbf5a7f2bfccc70eb~mv2.png' },
  { id: 'sudak-file', cat: 'fillet', name: 'Судак', sub: 'филе на коже', price: 73, unit: 'g100', img: 'dcddad763f47431287bcd0af58ece671~mv2.png' },
  { id: 'treska-steiki', cat: 'fillet', name: 'Треска дальневосточная', sub: 'стейки', price: 67, unit: 'g100', img: 'd81e63a14bbb45958d905ff55ddbc1c5~mv2.jpg', badge: 'new' },
  { id: 'shchuka-file', cat: 'fillet', name: 'Щука', sub: 'филе на коже', price: 48, unit: 'g100', img: '21020e58191a43c79b30f4cccbb523d4~mv2.jpeg' },
  { id: 'mintai-file', cat: 'fillet', name: 'Минтай', sub: 'филе без кожи', price: 29, unit: 'g100', img: 'accee9869aa04b10bdadc7de2b20cfe5~mv2.jpg' },

  // слабосолёная
  { id: 'seld-file-limon', cat: 'salted', name: 'Филе сельди с лимоном', sub: 'слабосолёное', price: 140, unit: 'pack', pack: '250 г', img: '33698d6f46284808901a9d5a5d5bba3a~mv2.jpg' },
  { id: 'keta-file', cat: 'salted', name: 'Кета', sub: 'филе без шкуры, слабосолёная', price: 113, unit: 'g100', img: '6ac8b6303e0b476dbacbd723fdacc392~mv2.jpg' },
  { id: 'seld-tikhookeanskaya', cat: 'salted', name: 'Сельдь тихоокеанская жирная', sub: 'неразделанная, слабосолёная', price: 31, unit: 'g100', img: '18ef6f6ccb6b478cac410d9441829653~mv2.jpg' },

  // кальмары
  { id: 'kalmar-file', cat: 'squid', name: 'Кальмар', sub: 'филе', price: 385, unit: 'kg', img: 'f95093b07d6644ec85c6c804c07bfc5f~mv2.jpg' },
  { id: 'kalmar-koltsa', cat: 'squid', name: 'Кальмар', sub: 'кольца', price: 0, unit: 'kg', img: '88dc45e547f4413985440427d5249912~mv2.jpeg', stock: false },
  { id: 'kalmar-solomka', cat: 'squid', name: 'Кальмар', sub: 'соломка', price: 0, unit: 'kg', img: '3f13f0e06cec4dd089feb3b89e557774~mv2.jpg', stock: false },

  // морская капуста
  { id: 'kapusta-sibiryachka', cat: 'kale', name: 'Морская капуста «Сибирячка»', sub: 'салат с клюквой', price: 210, unit: 'pack', pack: '500 г', img: 'd943853a0741425f935a9e5723f45922~mv2.jpeg' },
  { id: 'kapusta-klassicheskaya', cat: 'kale', name: 'Морская капуста «Классическая»', sub: 'салат с морковью', price: 180, unit: 'pack', pack: '500 г', img: 'd9374e7ade424879bb91e77a80e93973~mv2.jpeg' },

  // полуфабрикаты
  { id: 'rulety-foreli', cat: 'semi', name: 'Рулеты из филе форели', sub: 'с творожным сыром и брокколи', price: 147, old: 155, unit: 'pack', pack: 'упаковка', img: '6371980caf7d44ccaa0852703308b052~mv2.jpeg', badge: 'sale', note: 'Свежемороженый полуфабрикат.' },
]

// ---------- оптовый прайс со страниц «Витрины» ----------

export interface RsOptItem {
  id: string
  name: string
  price: number
  /** За что цена: «1 кг», «400 г», «упаковку 0,4 кг». */
  per: string
  /** В чём считать заявку: кг или упаковки. */
  unit: 'kg' | 'pack'
  pack?: string
}

export interface RsOptGroup {
  id: string
  label: string
  img: string
  note: string
  items: RsOptItem[]
}

const kg = (id: string, name: string, price: number, pack?: string): RsOptItem => ({ id, name, price, per: '1 кг', unit: 'kg', pack })
const pk = (id: string, name: string, price: number, per: string, pack?: string): RsOptItem => ({ id, name, price, per, unit: 'pack', pack })

export const rsOpt: RsOptGroup[] = [
  {
    id: 'fillet',
    label: 'Стейки, филе, камбала, кальмары',
    img: '33e6beebf2884494b9ce55f5d7273080~mv2.jpg',
    note: 'Глазурь 5 %, вакуумная упаковка. Глазируем в тоннельной камере шоковой заморозки Gunther.',
    items: [
      kg('o-file-gorbushi', 'Филе горбуши свежемороженое', 340),
      pk('o-file-gorbushi-press', 'Филе горбуши прессованное', 196, '400 г'),
      kg('o-file-mintaya', 'Филе минтая свежемороженое', 231),
      kg('o-file-mintaya-bez-kozhi', 'Филе минтая без кожи свежемороженое', 255),
      pk('o-file-mintaya-press', 'Филе минтая прессованное', 116, '400 г'),
      kg('o-file-foreli', 'Филе форели без кожи свежемороженое', 532),
      pk('o-file-foreli-press', 'Филе форели прессованное', 298, '400 г'),
      kg('o-steik-gorbushi', 'Стейк горбуши свежемороженой', 290),
      kg('o-steik-zubatki', 'Стейк зубатки свежемороженой', 238),
      kg('o-steik-mintaya', 'Стейк минтая блочный свежемороженый', 180),
      kg('o-steik-treski', 'Стейк трески свежемороженой', 310),
      kg('o-kambala-tushka', 'Камбала тушка очищенная свежемороженая', 211),
      pk('o-kalmar', 'Кальмар чищеный свежемороженый', 196, '500 г'),
    ],
  },
  {
    id: 'fish',
    label: 'Рыба свежемороженая',
    img: '80302793fb2741b59f3f0260d0d9db26~mv2.jpg',
    note: 'В пакетах из пищевой плёнки.',
    items: [
      kg('o-gorbusha', 'Горбуша неразделанная', 260),
      kg('o-gorbusha-potr', 'Горбуша потрошёная, с головой', 280),
      kg('o-kambala', 'Камбала желтопёрая белобрюхая неразделанная', 390),
      kg('o-keta', 'Кета потрошёная, без головы', 305),
      kg('o-kizhuch', 'Кижуч потрошёный, без головы', 346),
      kg('o-koryushka', 'Корюшка зубатка', 378),
      kg('o-mintai', 'Минтай потрошёный, без головы', 150),
      kg('o-nerka', 'Нерка потрошёная, без головы', 622),
      kg('o-okun', 'Окунь красный', 364),
      kg('o-putassu', 'Путассу', 79),
      kg('o-semga', 'Сёмга 4–5 кг', 1060),
      kg('o-seld', 'Сельдь', 98),
    ],
  },
  {
    id: 'smoked',
    label: 'Холодное копчение и слабосолёная рыба',
    img: '0db1bac559bc4517bbc2b91053ca7e49~mv2.png',
    note: 'Коптим на ольховой щепе, без жидкого дыма. Вакуумная упаковка.',
    items: [
      kg('o-seld-hk', 'Сельдь холодного копчения, непотрошёная, с головой', 160),
      kg('o-skumbriya-hk', 'Скумбрия холодного копчения, потрошёная, с головой, 300–500 г', 319),
      kg('o-skumbriya-hk-narezka', 'Скумбрия холодного копчения, нарезка', 550, 'подложка 250–300 г'),
      kg('o-gorbusha-balyk', 'Горбуша холодного копчения, балык', 466),
      kg('o-seld-ss', 'Сельдь слабосолёная, непотрошёная, с головой', 169),
      pk('o-seld-kusochki-450', 'Сельдь кусочками в пряном посоле', 130, '450 г', 'контейнер'),
      pk('o-seld-kusochki-1000', 'Сельдь кусочками в пряном посоле', 260, '1000 г', 'контейнер'),
      kg('o-file-seldi-shkura', 'Филе сельди слабосолёное, на шкуре', 246),
      kg('o-file-seldi', 'Филе сельди слабосолёное, без шкуры', 279),
      kg('o-skumbriya-ss', 'Скумбрия слабосолёная непотрошёная, с головой', 301),
      pk('o-skumbriya-kusochki', 'Скумбрия кусочками в пряном посоле', 180, '450 г', 'контейнер'),
    ],
  },
  {
    id: 'semi',
    label: 'Полуфабрикаты и фарш',
    img: '694edfd27d8b46c3958be2c4cdc0748f~mv2.jpg',
    note: 'Фарш без фосфатов, брикеты 500–600 г.',
    items: [
      kg('o-kotlety-dv', 'Котлеты «Дальневосточные» из лососевых', 257, 'по 10 шт, 100 г каждая'),
      pk('o-kotlety-zdorovie', 'Котлеты «Здоровье» из горбуши с брокколи', 116, 'упаковку 0,4 кг', '4 котлеты'),
      kg('o-farsh-krasnaya', 'Фарш «Красная рыбка» из лососевых', 136),
      kg('o-farsh-belorybie', 'Фарш «Белорыбье»', 92),
      kg('o-farsh-treska', 'Фарш из рыб тресковых пород (светлый)', 133),
    ],
  },
  {
    id: 'kale',
    label: 'Продукция из морской капусты',
    img: '5d674adf3c314cd592705704972527b5~mv2.jpg',
    note: 'В пластиковом контейнере.',
    items: [
      kg('o-kapusta', 'Морская капуста маринованная', 120, 'контейнер 1000 г'),
      pk('o-salat-morkov', 'Салат из морской капусты с морковью и луком', 70, '450 г'),
      pk('o-salat-klyukva', 'Салат из морской капусты с клюквой', 80, '450 г'),
      pk('o-salat-krab', 'Салат из морской капусты с крабовыми палочками', 96, '450 г'),
      pk('o-salat-kukuruza', 'Салат из морской капусты с овощами и кукурузой', 74, '450 г'),
    ],
  },
  {
    id: 'chicken',
    label: 'Окорочка и куриные субпродукты',
    img: 'bcc90590bd4641a3be8463bd8ee5d23b~mv2.jpg',
    note: 'Замороженные, в лотках и фирменных пакетах.',
    items: [
      kg('o-tushka', 'Тушка цыплёнка-бройлера потрошёная, 1 категория', 169),
      kg('o-okorochka', 'Окорочка куриные замороженные', 154, 'пакеты по 2 кг'),
      pk('o-zheludki', 'Желудки цыплёнка-бройлера', 110, '0,9 кг', 'лоток'),
      pk('o-serdtse', 'Сердце цыплёнка-бройлера', 200, '0,9 кг', 'лоток'),
      kg('o-pechen', 'Печень цыплят-бройлеров', 123, 'лоток 1 кг'),
    ],
  },
  {
    id: 'mango',
    label: 'Манго быстрой заморозки',
    img: '282e952386cd483a81f3c055d1ef29d2~mv2.jpg',
    note: 'Цена — по запросу в отделе продаж.',
    items: [kg('o-mango', 'Манго, плоды замороженные', 0)],
  },
]

// ---------- производство и услуги ----------

/** Цеха с главной оригинала; icon — ключ иконки в RsWorkshops. */
export const rsWorkshops = [
  { icon: 'fillet', label: 'Рыборазделочный цех', text: 'фирменное филе и стейки' },
  { icon: 'squid', label: 'Цех кальмаров', text: 'переработка и очистка' },
  { icon: 'smoke', label: 'Коптильный цех', text: 'холодное копчение на ольховой щепе' },
  { icon: 'meat', label: 'Цех мяса', text: 'распил и переработка' },
  { icon: 'salad', label: 'Цех салатов', text: 'морская капуста, филе рыбы с овощами' },
  { icon: 'vacuum', label: 'Вакуумная упаковка', text: 'отдельный цех фасовки' },
  { icon: 'frost', label: 'Холодильный комплекс', text: 'низкотемпературные камеры и шоковая заморозка' },
] as const

export const rsServices = [
  {
    id: 'smoke',
    title: 'Холодное копчение',
    img: 'f6e3fc6af4a44edda55c95ccb0e36ba5~mv2.jpg',
    text: 'Коптим в аппарате «Ижица» только на натуральных опилках, без жидкого дыма. Заказчик может проконтролировать любой этап — от загрузки сырья до дозревания.',
    facts: ['ольховая щепа', 'без «жидкого дыма»', 'вакуум по желанию'],
  },
  {
    id: 'steak',
    title: 'Нарезка на стейки',
    img: '24dfba102b9f4b598fd3f62474195f7c~mv2.jpg',
    text: 'Оборудование из пищевой нержавеющей стали. Делаем ровные стейки и упаковываем их в вакуум — так продукт дольше хранится и меньше места занимает при перевозке.',
    facts: ['толщина 10–45 мм', 'вакуумная упаковка'],
  },
  {
    id: 'fillet',
    title: 'Разделка на филе',
    img: '18dc4a36af704f24b6211084343068bb~mv2.jpg',
    text: 'Филируем рыбу в своём рыборазделочном цехе: на коже, без кожи, прессованное филе.',
    facts: ['на коже и без кожи', 'прессованное филе'],
  },
  {
    id: 'glaze',
    title: 'Глазирование',
    img: '3fbbb09e139d42358a534eabc6e9cbcc~mv2.jpg',
    text: 'Покрываем рыбу тонкой ледяной оболочкой, чтобы она не окислялась и не теряла влагу. Для жирной рыбы по желанию добавляем антиокислители.',
    facts: ['глазурь от 4 %', 'толщина от 4 мм', 'камера Gunther'],
  },
  {
    id: 'freeze',
    title: 'Шоковая заморозка',
    img: '49786fc56ca949f18ca44eed84b0841b~mv2.jpg',
    text: 'Замораживаем в тоннельной камере Gunther (Германия) с интенсивным обдувом. Кристаллы льда не разрушают структуру продукта, вкус сохраняется и после разморозки.',
    facts: ['от −23 до −30 °C', 'сухой способ'],
  },
  {
    id: 'vacuum',
    title: 'Вакуумная упаковка и хранение',
    img: '4d0c76dc94e242fc8556149d2e5133c1~mv2.jpg',
    text: 'Фасуем и вакуумируем продукцию заказчика, храним её в низкотемпературных камерах и доставляем.',
    facts: ['фасовка', 'хранение', 'доставка'],
  },
]

/** Клиенты с главной оригинала — подписи к их логотипам. */
export const rsClients = [
  { name: 'Мария-Ра', img: 'b851f4_3726a5504c4649ef9b3b1ef6f88fe79b~mv2.png' },
  { name: 'ResStar', img: 'b851f4_806aaffe77a34b8da07a5af3bb272cda~mv2.png' },
  { name: 'Бегемот', img: 'b851f4_ffa2593c18954782a8ef28c5999b72ad~mv2.jpg' },
  { name: 'Форелино', img: 'b851f4_55d8d1e36c3f4572baee4896673b9226~mv2.png' },
  { name: 'Здоровое питание Кузбасс', img: 'b851f4_f829afce199d45f0af4e4a5897609191~mv2.gif' },
  { name: 'Санаторий «Кедровый бор»', img: 'b851f4_1c2ebb479d80446bbb48c0edd526c9cc~mv2.png' },
  { name: 'Сибирская инвестиционная группа', img: 'b851f4_ffade002b7164ea684cae9d3a1b127a5~mv2.png' },
  { name: 'КХ Волкова', img: 'b851f4_57711169393c4514b3a97cc8f77a3347~mv2.jpg' },
]

export const rsClientTypes = [
  'Оптовые компании',
  'Перерабатывающие производства',
  'Розничные сети',
  'Рестораны',
  'Санатории',
  'Детские сады и школы',
]

export const rsRegions = ['Кемеровская область', 'Новосибирская область', 'Томская область', 'Алтайский край']

export const rsDocs = [
  { label: 'Декларация ЕАС на замороженную рыбу', href: 'https://www.rybasibiri.ru/_files/ugd/b851f4_50b3eff06b4f4ddf8ed1646f666ca4b6.pdf' },
  { label: 'Декларация ЕАС на рыбные полуфабрикаты', href: 'https://www.rybasibiri.ru/_files/ugd/b851f4_4a7765b0ad56485bb336189906941ee3.pdf' },
  { label: 'Приложение 1', href: 'https://www.rybasibiri.ru/_files/ugd/b851f4_9184926d07fc4dc3b4c6b3950565c24f.pdf' },
  { label: 'Приложение 2', href: 'https://www.rybasibiri.ru/_files/ugd/b851f4_2d6f5232c5e349c8b08fe9625c0488ff.pdf' },
  { label: 'Приложение 3', href: 'https://www.rybasibiri.ru/_files/ugd/b851f4_19e6dc1005104f618894a335e4c17f2a.pdf' },
  { label: 'Приложение 4', href: 'https://www.rybasibiri.ru/_files/ugd/b851f4_b5cfc72dae9b42d7a7ba5a08a00e8dae.pdf' },
  { label: 'Приложение 5', href: 'https://www.rybasibiri.ru/_files/ugd/b851f4_11454528521f4ff6927e1f56300a7b16.pdf' },
]

export const rsContacts = {
  original: 'https://www.rybasibiri.ru/',
  phone: '+7 (3842) 57-90-01',
  phoneHref: 'tel:+73842579001',
  phones: [
    { label: '+7 (3842) 57-90-01', href: 'tel:+73842579001' },
    { label: '+7 (3842) 57-91-01', href: 'tel:+73842579101' },
    { label: '+7 (3842) 33-75-05', href: 'tel:+73842337505' },
    { label: '+7 (923) 488-29-33', href: 'tel:+79234882933' },
  ],
  fax: '(3842) 57-06-53',
  email: 'info@style-product.ru',
  vk: 'https://vk.com/ribka_moia',
  address: 'Кемерово, ул. Невьянская, 1В',
  zip: '650021',
}

// ---------- пути и картинки ----------

const BASE = '/redesign/rybasibiri'
export const rsPath = (sub = '') => `${BASE}${sub}`
/** Картинка оригинала нужного размера через трансформацию Wix: fill кадрирует, fit — вписывает (логотипы). */
export const rsImg = (file: string, w = 600, h = w, mode: 'fill' | 'fit' = 'fill') =>
  `${file.startsWith('b851f4_') || file.startsWith('11062b_') ? 'https://static.wixstatic.com/media/' : W}${file}/v1/${mode}/w_${w},h_${h},al_c,q_85,enc_auto/img.jpg`

export const rsFind = (id: string) => rsProducts.find((p) => p.id === id)
export const rsOf = (cat: RsCategoryId) => rsProducts.filter((p) => p.cat === cat)
export const rsCategory = (id: string) => rsCategories.find((c) => c.id === id)
export const rsOptFind = (id: string) => rsOpt.flatMap((g) => g.items).find((i) => i.id === id)
export const rsInStock = (p: RsProduct) => p.stock !== false

// ---------- количество и деньги ----------

/** Счётчик: кг с шагом 0,5 для весового, штуки для рыбы целиком и упаковок. */
export const rsStep = (p: RsProduct) => (p.unit === 'kg' || p.unit === 'g100' ? 0.5 : 1)
export const rsMin = (p: RsProduct) => (p.unit === 'kg' ? 1 : p.unit === 'g100' ? 0.5 : 1)

/** Цена за кг — чтобы сравнивать товары с разной единицей. */
export const rsPerKg = (p: RsProduct) => (p.unit === 'g100' ? p.price * 10 : p.price)

/** Сумма строки: [от, до]. У рыбы целиком вес известен диапазоном, поэтому и сумма — диапазон. */
export const rsSum = (p: RsProduct, qty: number): [number, number] => {
  if (p.unit === 'whole' && p.weight) return [p.price * p.weight[0] * qty, p.price * p.weight[1] * qty]
  if (p.unit === 'g100') return [p.price * 10 * qty, p.price * 10 * qty]
  return [p.price * qty, p.price * qty]
}

const rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 })

export const rsRub = (value: number) => `${rub.format(Math.round(value))} ₽`
export const rsNum = (value: number) => num.format(value)
export const rsRange = ([a, b]: [number, number]) =>
  Math.round(a) === Math.round(b) ? rsRub(a) : `${rub.format(Math.round(a))}–${rsRub(b)}`

/** Подпись единицы цены, как её покупатель прочитает на ценнике. */
export const rsPer = (p: RsProduct) =>
  ({ kg: 'за 1 кг', g100: 'за 100 г', whole: 'за 1 кг', pack: p.pack && p.pack !== 'упаковка' ? `за упаковку ${p.pack}` : 'за упаковку' })[p.unit]

/** Единица в счётчике. */
export const rsQtyLabel = (p: RsProduct, qty: number) => {
  if (p.unit === 'kg' || p.unit === 'g100') return `${rsNum(qty)} кг`
  if (p.unit === 'pack') return `${qty} уп.`
  return `${qty} шт`
}

/** Вес рыбы словами: «рыба 4–5 кг», «400–500 г». */
export const rsWeightLabel = (p: RsProduct) => {
  if (!p.weight) return ''
  const [a, b] = p.weight
  return b < 1 ? `рыба ${a * 1000}–${b * 1000} г` : `рыба ${rsNum(a)}–${rsNum(b)} кг`
}

export const rsBadges: Record<RsBadge, string> = { new: 'Новинка', hit: 'Лидер продаж', sale: 'Скидка' }

export const rsTitle = (p: RsProduct) => (p.sub ? `${p.name}, ${p.sub}` : p.name)
