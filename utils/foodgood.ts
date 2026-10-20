// Данные и константы концепта редизайна FoodGood Tomsk.
// Источник: https://foodgoodtomsk.ru (снято 20 октября 2026). Это концепт, не официальный сайт.
// Разделы расставлены концептом: на оригинале все товары идут одной лентой.

export type FgCategoryId =
  | 'fruit'
  | 'frozen'
  | 'fish'
  | 'meat'
  | 'ready'
  | 'pantry'
  | 'icecream'
  | 'health'
  | 'gift'

export interface FgCategory {
  id: FgCategoryId
  title: string
  short: string
  cover: string
}

export interface FgProduct {
  id: string
  category: FgCategoryId
  name: string
  pack: string
  price: number
  oldPrice?: number
  // Весовой товар: цена указана за 1 кг, итог уточнят при сборке.
  perKg?: boolean
  origin?: string
  image: string
}

const img = (path: string) => `https://taplink.st/p/${path}`

type Row = [id: string, category: FgCategoryId, name: string, pack: string, price: number, image: string, extra?: Partial<FgProduct>]

const rows: Row[] = [
  // Фрукты, ягоды, овощи
  ['ba0e6b', 'fruit', 'Клюква свежая, спелая, чистая', '3 л', 1150, 'a/4/f/f/63856700.jpg'],
  ['c8ed71', 'fruit', 'Хурма «свечка» сладкая, некрупная', '1,5 кг', 750, 'd/c/3/e/71157642.png'],
  ['ba91a3', 'fruit', 'Груша лесная красавица', '1,5 кг', 750, 'a/e/1/5/64137142.jpg', { origin: 'Киргизия' }],
  ['bb157e', 'fruit', 'Гранат сладкий', '1 кг', 600, '5/d/7/5/64396409.jpg'],
  ['c03f73', 'fruit', 'Клубника «Альбион» сладкая', '~2 кг', 1300, 'c/2/c/8/62312798.jpg', { origin: 'Киргизия' }],
  ['beafef', 'fruit', 'Клубника «Альбион» сладкая', '500 г', 500, '8/5/c/4/64930330.jpg', { origin: 'Киргизия' }],
  ['b7a23a', 'fruit', 'Яблоко Апорт', '1,5 кг', 600, '7/1/c/1/69785207.png', { origin: 'Киргизия' }],
  ['c14e28', 'fruit', 'Виноград розовый Ризамат', '1 кг', 500, '3/f/5/5/67605996.jpg'],
  ['b7a246', 'fruit', 'Помидоры мясистые, красные, сладкие', 'ящик 1,5 кг', 850, 'e/e/2/b/69944986.webp', { origin: 'Узбекистан' }],
  // Заморозка
  ['b50903', 'frozen', 'Черника лесная', '1 кг', 1000, '3/8/e/3/61141804.jpg'],
  ['b508c3', 'frozen', 'Брусника', '1 кг', 850, 'e/e/1/e/61142016.png'],
  ['acad31', 'frozen', 'Облепиха крупная', '1 кг', 600, '8/3/f/d/56336364.jpg'],
  ['b508c4', 'frozen', 'Вишня без косточки', '1 кг', 890, '3/6/6/8/61141914.jpg'],
  ['b99a9a', 'frozen', 'Малина', '500 г', 500, '8/c/4/6/66932262.jpg', { origin: 'Киргизия' }],
  ['b99a9c', 'frozen', 'Клубника «Чёрный принц»', '500 г', 500, 'c/4/5/2/63613936.jpg', { origin: 'Киргизия' }],
  ['b99a9e', 'frozen', 'Клубника крупная', '500 г', 500, '2/f/d/e/64269462.jpg', { origin: 'Киргизия' }],
  ['b54a22', 'frozen', 'Компотная смесь фруктовая летняя', '1 кг', 550, '3/f/e/b/61138760.jpg'],
  ['acad27', 'frozen', 'Манго слайсы', '1 кг', 550, 'e/d/8/f/56336268.jpg'],
  ['b508fe', 'frozen', 'Спаржа зелёная', '1 кг', 1100, 'f/d/1/0/61138503.jpg'],
  ['b508b2', 'frozen', 'Шпинат', '1 кг', 475, '1/a/b/5/61091301.jpg'],
  ['b508e4', 'frozen', 'Брокколи', '1 кг', 390, '8/9/6/5/61128297.jpg'],
  ['b508fb', 'frozen', 'Цветная капуста', '1 кг', 380, '1/5/d/5/61138963.jpg'],
  ['bd2b08', 'frozen', 'Морковь молодая мини', '1 кг', 580, '0/d/9/0/65432467.jpg'],
  ['c49b6c', 'frozen', 'Фасоль бобы зелёные', '1 кг', 520, '9/5/d/d/69130852.jpg'],
  ['b508fd', 'frozen', 'Стручковая фасоль', '1 кг', 390, '9/e/d/0/61138504.jpg'],
  // Рыба и морепродукты
  ['c4b66c', 'fish', 'Стейки сёмги крупные', '1 кг', 2100, 'c/6/f/8/69173103.jpg'],
  ['c18da4', 'fish', 'Стейки форели морской', '1 кг', 1900, '7/e/2/1/67726253.jpg', { origin: 'Мурманск' }],
  ['b73fc5', 'fish', 'Стейки кижуча', '1 кг', 1650, '9/4/d/9/62224240.jpg'],
  ['b7351d', 'fish', 'Филе форели, вес от 2 кг', 'цена за 1 кг', 2700, '7/b/4/e/69715771.png', { perKg: true }],
  ['c52530', 'fish', 'Сёмга атлантическая, потрошёная, свежемороженая', '1 кг', 1750, 'c/0/a/1/69383900.jpg'],
  ['b60e97', 'fish', 'Форель непотрошёная, 3–5 кг', 'цена за 1 кг', 1870, 'd/6/f/9/61533468.jpg', { perKg: true, origin: 'Мурманск' }],
  ['bc549a', 'fish', 'Форель целая, непотрошёная', '1 кг', 1350, 'b/d/c/1/65014947.jpg', { origin: 'Хакасия' }],
  ['b508f3', 'fish', 'Креветки сыромороженые очищенные, крупные', '1 кг', 1600, '7/f/9/1/61141849.jpg'],
  ['c4b66d', 'fish', 'Гребешок морской, филе', '1 кг', 1400, 'a/1/6/4/69173101.jpg'],
  ['ade6b5', 'fish', 'Фарш лососевый свежемороженый', '1 кг', 1200, '5/0/2/c/70207712.webp'],
  ['c523d8', 'fish', 'Палочки минтая в кляре', '1 кг', 950, '6/8/e/1/69382520.jpg'],
  ['c79b5b', 'fish', 'Палочки кальмара в панировке', '500 г', 750, 'f/5/4/4/70599889.jpg'],
  ['c740a1', 'fish', 'Тунец, филе в собственном соку', '160 г', 500, '8/d/d/1/70442891.jpg'],
  // Мясо и дичь
  ['b6d2fe', 'meat', 'Фарш говяжий фермерский', '1 кг', 800, 'b/0/2/a/61965013.jpg'],
  ['c4a536', 'meat', 'Филе бедра индейки', '1 кг', 880, '0/7/f/9/69170644.jpg'],
  ['c4b66f', 'meat', 'Кролик, тушка', '1 кг', 990, 'a/7/6/d/69173100.jpg'],
  ['c8ed66', 'meat', 'Сардельки из говядины', '1 кг', 690, 'b/a/3/2/71157542.png'],
  ['c8cfe3', 'meat', 'Рулет свиной томлёный', 'цена за 1 кг', 1100, 'c/f/9/a/71102355.jpg', { perKg: true }],
  ['c523da', 'meat', 'Поджарка свиная, мясо и сало', '1 кг', 430, '7/d/c/c/69381845.jpg'],
  ['c05c5f', 'meat', 'Сало бутербродное', '100 г', 250, '2/7/a/7/67138358.jpg'],
  ['c501ed', 'meat', 'Томлёное мясо марала', '250 г', 650, 'e/c/7/8/69314288.jpg'],
  ['c501f0', 'meat', 'Томлёное мясо марала с папоротником', '250 г', 650, 'b/4/8/f/69314298.jpg'],
  ['c501e4', 'meat', 'Паштет из мяса марала', '150 г', 650, '0/7/1/1/69314217.jpg'],
  ['c501e3', 'meat', 'Паштет из мяса марала с грибами', '150 г', 650, '9/1/3/3/69314214.jpg'],
  ['c501eb', 'meat', 'Паштет из печени марала', '150 г', 650, '4/9/3/0/69314275.jpg'],
  ['c501dd', 'meat', 'Каша перловая с маралом', '450 г', 550, '4/e/6/f/69314163.jpg'],
  ['c58041', 'meat', 'Тушёнка из оленины', '338 г', 650, '3/c/9/8/69553603.jpg'],
  // Домашние полуфабрикаты
  ['bbb3ed', 'ready', 'Пельмени домашние', '1 кг', 750, 'c/f/4/1/64693728.jpg'],
  ['b58064', 'ready', 'Пельмени деревенские, куриные', '1 кг', 670, 'e/2/9/7/61202166.jpg'],
  ['c7b575', 'ready', 'Пельмени из щуки парабельские', '500 г', 600, 'c/b/7/d/70637736.jpg', { origin: 'Парабель' }],
  ['bbb3f3', 'ready', 'Вареники с мясом и капустой', '1 кг', 550, '5/4/9/5/64693673.jpg'],
  ['bbb3f8', 'ready', 'Голубцы домашние', '1 кг', 650, '7/a/8/a/64692318.jpg'],
  ['bf83c8', 'ready', 'Перец фаршированный', '1 кг', 650, '7/9/f/b/66679962.jpg'],
  ['bf35b3', 'ready', 'Котлеты куриные', '1 кг', 650, '1/2/7/9/66545686.webp'],
  ['c33b0b', 'ready', 'Фрикадельки мясные', '1 кг', 850, '5/9/2/3/68545914.jpg'],
  ['c7b576', 'ready', 'Котлеты из минтая парабельские', '650 г', 750, 'b/8/a/6/70637738.jpg', { origin: 'Парабель' }],
  ['b508d0', 'ready', 'Котлеты из форели', '720 г', 650, 'd/8/e/d/61141930.jpg'],
  ['b508e8', 'ready', 'Котлеты из щуки', '720 г', 580, '0/6/4/8/61139342.jpg'],
  ['c2950a', 'ready', 'Рулет из щуки для запекания, классический', '850 г', 650, 'b/e/e/1/68222214.jpg'],
  ['c7b577', 'ready', 'Блинчики со щукой и рисом', '600 г', 580, 'b/4/a/1/70637741.jpg'],
  ['b54a18', 'ready', 'Блинчики с творогом', '1 кг', 700, '7/1/b/2/61123612.jpg'],
  ['c33b07', 'ready', 'Блины с печенью', '1 кг', 700, '3/0/d/c/68545900.jpg'],
  ['c2f12f', 'ready', 'Блины с вишней', '1 кг', 700, '8/f/5/5/68554325.jpg'],
  ['be9d01', 'ready', 'Сырники жареные, заморозка', '1 кг', 850, 'e/3/9/a/66211892.jpg'],
  ['c2f132', 'ready', 'Сырники сырые', '1 кг', 650, '3/4/4/9/68398076.jpg'],
  // Мёд, чай, заготовки
  ['b5093e', 'pantry', 'Мёд «Таёжное разнотравье»', '0,5 л / 700 г', 300, '6/f/0/7/61128225.jpg', { oldPrice: 500 }],
  ['c0eebd', 'pantry', 'Мёд луговой', '0,5 л / 700 г', 700, '3/e/2/a/67434813.jpg'],
  ['bb2d06', 'pantry', 'Мёд дягилевый', '0,5 л / 700 г', 1100, '0/c/2/f/67434774.jpg', { origin: 'Алтай' }],
  ['b96a32', 'pantry', 'Соты медовые', '1 шт', 350, '7/6/a/c/63534884.jpg'],
  ['bab116', 'pantry', 'Белый боровой гриб маринованный, мелкий экстра', '1 л', 2200, 'b/a/b/2/64688821.jpg'],
  ['b508b0', 'pantry', 'Грузди малосольные, целые', '1 л', 1500, 'c/9/e/5/67184640.jpg'],
  ['b629ed', 'pantry', 'Капуста ферментированная салатная', '1 л', 250, '8/2/8/7/61590481.jpg'],
  ['acad7a', 'pantry', 'Иван-чай крупнолистовой с саган-дайля', '150 г', 550, 'e/1/1/e/56336790.jpg'],
  ['ba4fbb', 'pantry', 'Иван-чай листовой ферментированный', '150 г', 450, 'e/d/c/a/63991610.jpg'],
  ['b50925', 'pantry', 'Иван-чай «Особый»', '80 г', 400, '8/7/1/9/61141772.jpg'],
  ['b50928', 'pantry', 'Чай саган-дайля с цветком', '40 г', 600, 'f/a/c/9/61139347.jpg'],
  ['c1b73d', 'pantry', 'Напиток «Чага берёзовая»', '100 г', 350, '5/8/2/3/67820064.jpg'],
  ['c5826d', 'pantry', 'Гречишный чай', '1 кг', 700, '9/9/9/c/69556981.jpg'],
  ['c5826f', 'pantry', 'Гречка зелёная алтайская', '1 кг', 480, '5/7/8/d/69556991.jpg', { origin: 'Алтай' }],
  ['c58273', 'pantry', 'Мука из зелёной гречки', '500 г', 200, '0/9/b/f/69557027.jpg'],
  ['c58269', 'pantry', 'Смесь семян для салатов', '1 кг', 750, 'a/f/0/9/69556966.jpg'],
  ['c8e9eb', 'pantry', 'Боярышник сушёный, крупный', '450 г', 390, '7/9/5/5/71151010.jpg', { origin: 'Дальний Восток' }],
  ['c8e9e8', 'pantry', 'Шиповник сушёный, крупный', '450 г', 390, '0/3/5/5/71150994.jpg'],
  ['c57b8d', 'pantry', 'Цукаты сосновой шишки на меду', '90 г', 400, '3/d/7/5/69553800.jpg'],
  ['c07dc0', 'pantry', 'Масло гхи топлёное', '0,5 л', 1200, 'b/e/8/e/67204387.jpg'],
  // Биомороженое
  ['b57992', 'icecream', 'Биомороженое в вафельном рожке', '1 шт', 120, 'f/a/f/d/61190774.jpg'],
  ['b57994', 'icecream', 'Биомороженое «Укрепляйка», ваниль', 'стаканчик', 120, '0/9/7/3/61190768.jpg'],
  ['b57997', 'icecream', 'Биомороженое Biofly без сахара, ваниль', 'стаканчик', 170, '5/f/a/a/61190757.jpg'],
  ['b5a72c', 'icecream', 'Биомороженое Biofly, горький шоколад', '45 г', 170, '6/4/6/f/61292301.jpg'],
  ['b5799a', 'icecream', 'Биомороженое «Семейный актив»', '450 г', 600, 'e/7/1/7/61190741.jpg'],
  ['b5799f', 'icecream', 'Биомороженое «Бифилак» шоколадное без сахара', '315 г', 600, '5/7/8/9/61190988.jpg'],
  ['b5a72b', 'icecream', 'Биомороженое «Бифилак Форте» ванильное', '315 г', 600, 'd/8/1/f/61292285.jpg'],
  // Здоровье: сибирская пихта
  ['bdc2e3', 'health', 'Siberian Red, профилактика железодефицита', '100 мл', 2900, 'c/c/9/4/65749631.png'],
  ['c8ed6f', 'health', 'Хлорофилл хвойный', '50 мл', 2000, 'b/6/a/5/71157616.png'],
  ['bdc2f3', 'health', 'Клеточный сок пихты сибирской', '30 мл', 950, '0/b/5/8/65749765.png'],
  ['be1183', 'health', 'Пихтаминчик, клеточный сок пихты с йодом', '60 мл', 1300, '5/5/6/1/65905542.png'],
  ['be1174', 'health', 'Хвойный концентрат с клеточным соком пихты', '200 мл', 950, '4/e/b/1/65905432.png'],
  ['b50934', 'health', 'Пихтовый концентрат', '250 мл', 800, '9/f/7/8/61128231.jpg'],
  ['bdc2f5', 'health', 'Фитококтейль с клеточным соком пихты', '220 мл', 380, 'd/5/e/3/66070297.jpg'],
  ['be116e', 'health', 'Крем омолаживающий «Бьюти»', '50 мл', 900, '8/e/6/3/65905379.png'],
  ['be116f', 'health', 'Гель заживляющий DOCTOR', '50 мл', 650, 'a/2/c/7/65905388.png'],
  ['be1175', 'health', 'Сибилор, уход за полостью рта и горла', '30 мл', 590, 'e/8/8/e/65905447.png'],
  ['be5eac', 'health', 'Леденцы с мёдом, мятой и хвойным комплексом', '20 шт', 250, '5/9/e/7/66070127.jpg'],
  ['be1176', 'health', 'Леденцы с соком малины и клеточным соком пихты', '10 шт', 150, '2/c/1/5/66070137.jpg'],
  // Сертификаты
  ['bc01f9', 'gift', 'Подарочный сертификат на 3 000 ₽', 'с открыткой', 3000, 'e/1/5/9/64856314.jpg'],
  ['bc01fa', 'gift', 'Подарочный сертификат на 5 000 ₽', 'с открыткой', 5000, 'd/9/e/1/64856316.jpg'],
]

export const fgProducts: FgProduct[] = rows.map(([id, category, name, pack, price, image, extra]) => ({
  id,
  category,
  name,
  pack,
  price,
  image: img(`${image}?0`),
  ...extra,
}))

const cover = (id: string) => fgProducts.find((p) => p.id === id)!.image

export const fgCategories: FgCategory[] = [
  { id: 'fruit', title: 'Фрукты, ягоды, овощи', short: 'Фрукты и ягоды', cover: cover('ba0e6b') },
  { id: 'frozen', title: 'Заморозка: ягоды и овощи', short: 'Заморозка', cover: cover('b50903') },
  { id: 'fish', title: 'Рыба и морепродукты', short: 'Рыба', cover: cover('c4b66c') },
  { id: 'meat', title: 'Мясо и дичь', short: 'Мясо и дичь', cover: cover('c501ed') },
  { id: 'ready', title: 'Домашние полуфабрикаты', short: 'Полуфабрикаты', cover: cover('bbb3ed') },
  { id: 'pantry', title: 'Мёд, чай, заготовки', short: 'Мёд и чай', cover: cover('c0eebd') },
  { id: 'icecream', title: 'Биомороженое', short: 'Биомороженое', cover: cover('b5799a') },
  { id: 'health', title: 'Сибирская пихта и здоровье', short: 'Пихта и здоровье', cover: cover('bdc2f3') },
  { id: 'gift', title: 'Подарочные сертификаты', short: 'Сертификаты', cover: cover('bc01fa') },
]

// «Сейчас в сезоне» на главной: осенняя поставка с оригинала.
export const fgSeason = ['ba0e6b', 'c8ed71', 'ba91a3', 'bb157e']

export const fgPopularQueries = ['клюква', 'форель', 'пельмени', 'иван-чай', 'марал', 'мёд']

export const fgPath = (sub = '') => `/redesign/foodgood${sub}`

export const fgFindProduct = (id: string) => fgProducts.find((p) => p.id === id)

export const fgCategoryOf = (id: FgCategoryId) => fgCategories.find((c) => c.id === id)!

export const fgOf = (id: FgCategoryId) => fgProducts.filter((p) => p.category === id)

export const fgSale = () => fgProducts.filter((p) => p.oldPrice)

export const fgDiscount = (p: FgProduct) =>
  p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0

export const fgOriginalHref = (id: string) => `https://foodgoodtomsk.ru/o/${id}/`

const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е').replace(/-/g, ' ')

export const fgSearch = (query: string) => {
  const words = norm(query).split(/\s+/).filter(Boolean)
  if (!words.length) return []
  return fgProducts.filter((p) => {
    const hay = norm(`${p.name} ${p.origin ?? ''} ${fgCategoryOf(p.category).title}`)
    return words.every((w) => hay.includes(w.slice(0, Math.max(3, w.length - 2))))
  })
}

export const fgFormatPrice = (value: number) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`

export const FG_FREE_DELIVERY_FROM = 5000
export const FG_TODAY_UNTIL = 18

export interface FgDeliveryOption {
  id: 'pickup' | 'tomsk' | 'near' | 'far'
  title: string
  price: number
  hint: string
}

export const fgDelivery: FgDeliveryOption[] = [
  { id: 'pickup', title: 'Самовывоз', price: 0, hint: 'Томск, ул. Герцена 78/1, ежедневно 11:00–20:00' },
  { id: 'tomsk', title: 'По Томску', price: 300, hint: 'бесплатно от 5 000 ₽' },
  {
    id: 'near',
    title: 'Ближний пригород',
    price: 350,
    hint: 'Северный парк, Левобережный лайф, Серебряный бор, Южные ворота, Тимирязево',
  },
  {
    id: 'far',
    title: 'Дальний пригород и Северск',
    price: 450,
    hint: 'Северск, Кисловка, Дзержинское, Светлый, Зональный, Просторный, Ключи, Холмы, Апрель, Мирный, Корнилово, Сосновка — до квартиры',
  },
]

export const fgDeliveryPrice = (option: FgDeliveryOption, subtotal: number) =>
  option.id === 'tomsk' && subtotal >= FG_FREE_DELIVERY_FROM ? 0 : option.price

export const fgTimeSlots = ['День, 12:00–18:00', 'Вечер, 19:00–22:30']

export const fgContacts = {
  owner: 'ИП Казарцев А.В.',
  phone: '+7 (3822) 22-83-36',
  phoneHref: 'tel:+73822228336',
  address: 'Томск, ул. Герцена 78/1',
  addressNote: 'заезд с Герцена',
  mapHref:
    'https://yandex.ru/maps/?text=%D0%A2%D0%BE%D0%BC%D1%81%D0%BA%2C%20%D0%93%D0%B5%D1%80%D1%86%D0%B5%D0%BD%D0%B0%2078%2F1',
  hours: { from: 11, to: 20 },
  original: 'https://foodgoodtomsk.ru',
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
  store: img('1/d/8/4/65746659.jpg?0'),
  reviews: [img('a/8/2/a/65747760.jpg?0'), img('e/3/a/8/65747763.jpg?0'), img('8/b/1/0/65746668.jpg?1')],
}

// Часы и минуты в Томске (UTC+7): от них зависят «Заказ на сегодня» и «Сейчас открыто».
export const fgTomskNow = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tomsk',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date())
  const get = (type: string) => parts.find((p) => p.type === type)!.value
  return {
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday')),
    minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')),
  }
}

// «Доставим сегодня — осталось 2 ч 15 мин» или «Доставим завтра», если 18:00 прошло.
export const fgTodayLabel = () => {
  const { minutes } = fgTomskNow()
  const left = FG_TODAY_UNTIL * 60 - minutes
  if (left <= 0) return { today: false, text: 'Заказ на сегодня закрыт — привезём завтра' }
  const h = Math.floor(left / 60)
  const m = left % 60
  return { today: true, text: `Заказ на сегодня ещё ${h ? `${h} ч ` : ''}${m} мин` }
}

export const fgGoods = (n: number) => {
  const mod10 = n % 10
  const mod100 = n % 100
  const word =
    mod10 === 1 && mod100 !== 11
      ? 'товар'
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? 'товара'
        : 'товаров'
  return `${n} ${word}`
}
