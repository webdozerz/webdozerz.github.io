// Данные и константы концепта редизайна «СибирьТрейд» (крупнооптовые поставки продуктов, Новосибирск).
// Источник: https://sibirtreid.ru — каталог (12 разделов, 65 подразделов), карточки позиций,
// контакты, доставка, реквизиты и блог сняты в октябре 2026.
// Позиции — как на сайте: бренд или линейка с объёмами, упаковкой, минимальным заказом и ценой «от»
// за упаковку. В 49 подразделах из 65 у оригинала нет ни одной позиции, только текст, —
// в концепте такие подразделы показаны честно: «позиции у менеджера».
// Вырезанные товары с первого экрана лежат в public/redesign/sibirtreid/img (уменьшены, оригинал весит 2 МБ),
// картинки разделов и логотипы партнёров — по адресам оригинала (https).
// Это концепт, не официальный сайт: цены, тексты и изображения принадлежат ООО «СибирьТрейд».

export type SbSectionId =
  | 'confectionery'
  | 'drinks'
  | 'low-alcohol-drinks'
  | 'goods-for-pets'
  | 'oil-and-fat-products'
  | 'grocery'
  | 'frozen-products'
  | 'snacks'
  | 'coffee-tea'
  | 'preservation'
  | 'non-food-products'
  | 'childens-goods'

export interface SbItem {
  id: string
  sec: SbSectionId
  /** Подраздел; у позиций со страницы раздела его нет. */
  sub?: string
  /** Бренд или линейка — крупно на плитке. */
  brand: string
  name: string
  /** Объёмы или вес одной единицы, как у оригинала: «0,25», «150-3000». */
  vols?: string[]
  /** л, кг или г. */
  unit?: string
  /** Сколько штук в упаковке (у Choco-Pie — коробок). */
  packs?: string[]
  box?: boolean
  taste?: string
  /** Минимальный заказ в упаковках, если не 10. */
  min?: number
  /** Цена «от» за упаковку, ₽. */
  price: number
}

export interface SbSub {
  id: string
  label: string
}

export type SbTone = 'mint' | 'peach' | 'lime'

export interface SbSection {
  id: SbSectionId
  label: string
  /** Как в меню оригинала. */
  full: string
  img: string
  tone: SbTone
  /** Пиво и сидр — только после подтверждения возраста. */
  adult?: boolean
  subs: SbSub[]
}

const U = 'https://sibirtreid.ru/wp-content/uploads'

export const sbSections: SbSection[] = [
  {
    id: 'confectionery',
    label: 'Кондитерские изделия',
    full: 'Кондитерские изделия оптом',
    img: `${U}/2023/06/popular-category-4.png`,
    tone: 'peach',
    subs: [
      { id: 'choco-pie', label: 'Choco-Pie' },
      { id: 'wholesale-dark-chocolate', label: 'Горький шоколад' },
      { id: 'candies-wholesale', label: 'Сладости' },
      { id: 'chocolate-bars', label: 'Шоколадные батончики' },
      { id: 'candy-in-a-box', label: 'Конфеты в коробках' },
      { id: 'candy-by-weight', label: 'Конфеты весовые' },
      { id: 'wholesale-chocolate', label: 'Шоколад' },
      { id: 'candy-bars', label: 'Батончики' },
      { id: 'waffles', label: 'Вафли' },
      { id: 'cookie', label: 'Печенье' },
      { id: 'cake', label: 'Торты' },
    ],
  },
  {
    id: 'drinks',
    label: 'Напитки',
    full: 'Напитки оптом',
    img: `${U}/2025/02/напитки.webp`,
    tone: 'mint',
    subs: [
      { id: 'coca-cola', label: 'Кола' },
      { id: 'sparkling-water', label: 'Газированная вода' },
      { id: 'mineral-water', label: 'Минеральная вода' },
      { id: 'dobryy', label: 'Напитки «Добрый»' },
      { id: 'chernogolovka', label: 'Напитки «Черноголовка»' },
      { id: 'milkis', label: 'Напиток Milkis' },
      { id: 'water', label: 'Вода' },
      { id: 'kvass', label: 'Квас' },
      { id: 'lemonade', label: 'Лимонады' },
      { id: 'juices', label: 'Соки' },
      { id: 'energy', label: 'Энергетики' },
    ],
  },
  {
    id: 'low-alcohol-drinks',
    label: 'Пиво и слабый алкоголь',
    full: 'Слабоалкогольные напитки и пиво оптом',
    img: `${U}/2025/02/алкогольные-напитки.webp`,
    tone: 'lime',
    adult: true,
    subs: [
      { id: 'non-alcoholic-beer', label: 'Безалкогольное пиво' },
      { id: 'beer', label: 'Пиво' },
      { id: 'cider', label: 'Сидр' },
      { id: 'tonics', label: 'Тоники' },
    ],
  },
  {
    id: 'goods-for-pets',
    label: 'Товары для животных',
    full: 'Товары для животных оптом',
    img: `${U}/2023/06/popular-category-6.png`,
    tone: 'peach',
    subs: [
      { id: 'cat-food', label: 'Корм для кошек' },
      { id: 'dog-food', label: 'Корм для собак' },
      { id: 'wet-food', label: 'Влажные корма' },
      { id: 'dainty', label: 'Лакомства для животных' },
      { id: 'dry-food', label: 'Сухие корма' },
    ],
  },
  {
    id: 'oil-and-fat-products',
    label: 'Масло',
    full: 'Масло оптом',
    img: `${U}/2023/06/popular-category-2.png`,
    tone: 'lime',
    subs: [
      { id: 'sunflower', label: 'Масло подсолнечное' },
      { id: 'butter', label: 'Масло сливочное' },
      { id: 'olive', label: 'Оливковое масло' },
      { id: 'vegetable', label: 'Растительное масло' },
    ],
  },
  {
    id: 'grocery',
    label: 'Бакалея',
    full: 'Бакалея оптом',
    img: `${U}/2023/06/popular-category-1.png`,
    tone: 'mint',
    subs: [
      { id: 'sea-salt', label: 'Морская соль' },
      { id: 'extra-salt', label: 'Соль экстра' },
      { id: 'salt', label: 'Соль' },
      { id: 'sugar', label: 'Сахар' },
      { id: 'flour', label: 'Мука' },
      { id: 'cereal', label: 'Крупы' },
      { id: 'macaroni', label: 'Макароны' },
      { id: 'noodles-b-p', label: 'Лапша быстрого приготовления' },
    ],
  },
  {
    id: 'frozen-products',
    label: 'Замороженные продукты',
    full: 'Замороженные продукты оптом',
    img: `${U}/2023/06/зам.png`,
    tone: 'mint',
    subs: [
      { id: 'myaso', label: 'Мясо' },
      { id: 'vegetables-mixes', label: 'Овощи и смеси' },
      { id: 'fruits-berries', label: 'Фрукты и ягоды' },
    ],
  },
  {
    id: 'snacks',
    label: 'Снеки',
    full: 'Снеки оптом',
    img: `${U}/2025/02/чипсы-снеки.webp`,
    tone: 'peach',
    subs: [
      { id: 'nuts-dried-fruits', label: 'Орехи и сухофрукты' },
      { id: 'for-beer', label: 'Снеки к пиву' },
      { id: 'wholesale-chips', label: 'Чипсы' },
      { id: 'seeds', label: 'Семечки' },
      { id: 'nuts', label: 'Орехи' },
    ],
  },
  {
    id: 'coffee-tea',
    label: 'Кофе и чай',
    full: 'Кофе и чай оптом',
    img: `${U}/2023/06/popular-category-3.png`,
    tone: 'lime',
    subs: [
      { id: 'instant-coffee', label: 'Кофе растворимый' },
      { id: 'coffee-beans', label: 'Кофе зерновой' },
      { id: 'tea', label: 'Чай' },
      { id: 'wholesale-cocoa', label: 'Какао' },
    ],
  },
  {
    id: 'preservation',
    label: 'Консервы',
    full: 'Консервы оптом',
    img: `${U}/2025/02/консервы-общая.webp`,
    tone: 'peach',
    subs: [
      { id: 'canned-meat', label: 'Мясные консервы' },
      { id: 'canned-fish', label: 'Рыбные консервы' },
      { id: 'veg', label: 'Овощная консервация' },
      { id: 'fruit', label: 'Фруктовая консервация' },
    ],
  },
  {
    id: 'non-food-products',
    label: 'Непродовольственные товары',
    full: 'Непродовольственные товары оптом',
    img: `${U}/2023/06/прод.png`,
    tone: 'mint',
    subs: [
      { id: 'household-chemicals', label: 'Бытовая химия' },
      { id: 'hygiene-products', label: 'Средства гигиены' },
      { id: 'disposable-tableware-wholesale', label: 'Одноразовая посуда' },
    ],
  },
  {
    id: 'childens-goods',
    label: 'Детские товары',
    full: 'Детские товары оптом',
    img: `${U}/2023/06/детские.png`,
    tone: 'lime',
    subs: [
      { id: 'child-nutrition', label: 'Детское питание' },
      { id: 'diapers-and-hygiene', label: 'Подгузники' },
      { id: 'toys', label: 'Игрушки' },
    ],
  },
]

export const sbItems: SbItem[] = [
  {id: "chokopay-so-vkusom-apelsina", sec: "confectionery", sub: "choco-pie", brand: "Choco-Pie", name: "ЧокоПай со вкусом апельсина", vols: ["2,88"], unit: "кг", packs: ["8"], box: true, taste: "Апельсин", price: 1238.0},
  {id: "chokopay-so-vkusom-venskogo-torta", sec: "confectionery", sub: "choco-pie", brand: "Choco-Pie", name: "ЧокоПай со вкусом венского торта", vols: ["2,88"], unit: "кг", packs: ["8"], box: true, taste: "Венский торт", price: 1456.48},
  {id: "chokopay-so-vkusom-vishni", sec: "confectionery", sub: "choco-pie", brand: "Choco-Pie", name: "ЧокоПай со вкусом вишни", vols: ["2,88"], unit: "кг", packs: ["8"], box: true, taste: "Вишня", price: 1238.0},
  {id: "chokopay-so-vkusom-temnoy-karameli", sec: "confectionery", sub: "choco-pie", brand: "Choco-Pie", name: "ЧокоПай со вкусом темной карамели", vols: ["2,88"], unit: "кг", packs: ["8"], box: true, taste: "Дарк карамель", price: 1456.48},
  {id: "chokopay-dark", sec: "confectionery", sub: "choco-pie", brand: "Choco-Pie", name: "ЧокоПай Дарк", vols: ["2,88"], unit: "кг", packs: ["8"], box: true, taste: "Дарк", price: 1334.4},
  {id: "chokopay-so-vkusom-klubniki", sec: "confectionery", sub: "choco-pie", brand: "Choco-Pie", name: "ЧокоПай со вкусом клубники", vols: ["2,88"], unit: "кг", packs: ["8"], box: true, taste: "Клубника", price: 1456.48},
  {id: "chokopay-so-vkusom-mango", sec: "confectionery", sub: "choco-pie", brand: "Choco-Pie", name: "ЧокоПай со вкусом манго", vols: ["2,88"], unit: "кг", packs: ["8"], box: true, taste: "Манго", price: 1456.48},
  {id: "chokopay-so-vkusom-smorodiny", sec: "confectionery", sub: "choco-pie", brand: "Choco-Pie", name: "ЧокоПай со вкусом смородины", vols: ["2,88"], unit: "кг", packs: ["8"], box: true, taste: "Смородина", price: 1456.48},
  {id: "chokopay-originalnyy", sec: "confectionery", sub: "choco-pie", brand: "Choco-Pie", name: "ЧокоПай оригинальный", vols: ["2,4", "2,88"], unit: "кг", packs: ["8", "16", "20"], box: true, taste: "Оригинальный", price: 1456.48},
  {id: "chaykofskiy", sec: "confectionery", sub: "cookie", brand: "Чайкофский", name: "Чайкофский", vols: ["85", "100", "110", "125", "132", "145"], unit: "г", packs: ["12", "18", "24", "36", "45", "72"], price: 766.2},
  {id: "aleshina", sec: "confectionery", sub: "cookie", brand: "АлешинА", name: "АлешинА", vols: ["150-3000"], unit: "г", packs: ["12", "14", "20", "24"], price: 500.83},
  {id: "kuhmaster", sec: "confectionery", sub: "cookie", brand: "Кухмастер", name: "Кухмастер", vols: ["95", "100", "150", "170", "180", "220", "230", "240", "270", "420", "700"], unit: "г", packs: ["9", "10", "12", "16", "18", "24", "32"], price: 645.12},
  {id: "lyubyatovo", sec: "confectionery", sub: "cookie", brand: "Любятово", name: "Любятово", vols: ["120-5000"], unit: "г", packs: ["3", "5", "8", "10", "12", "14", "15", "16", "20", "24"], price: 706.5},
  {id: "morozovo", sec: "confectionery", sub: "cookie", brand: "МОРОЗОВО", name: "МОРОЗОВО", vols: ["46", "95", "150", "430"], unit: "г", packs: ["12", "25", "28", "48"], price: 653.26},
  {id: "rahat", sec: "confectionery", sub: "cookie", brand: "РАХАТ", name: "РАХАТ", vols: ["1000"], unit: "г", packs: ["5", "5,5"], price: 829.15},
  {id: "sladkaya-sloboda", sec: "confectionery", sub: "cookie", brand: "Сладкая слобода", name: "Сладкая слобода", vols: ["120-8200"], unit: "г", packs: ["6", "8", "9", "10", "12", "14", "15", "16", "18", "21", "23", "42"], price: 548.73},
  {id: "sladonezh", sec: "confectionery", sub: "cookie", brand: "СЛАДОНЕЖ", name: "СЛАДОНЕЖ", vols: ["95", "120", "310", "400", "480", "2500", "3000", "4000", "4300", "4500", "5000"], unit: "г", packs: ["1", "10", "12", "17", "18"], price: 874.8},
  {id: "sibirskiy-konditer", sec: "confectionery", sub: "cookie", brand: "Сибирский Кондитер", name: "Сибирский Кондитер", vols: ["450"], unit: "г", packs: ["12"], price: 1029.6},
  {id: "ritter-sport", sec: "confectionery", sub: "cookie", brand: "Риттер Спорт", name: "Риттер Спорт", vols: ["100"], unit: "г", packs: ["12", "11"], price: 2186.58},
  {id: "rossiya", sec: "confectionery", sub: "cookie", brand: "Россия", name: "Россия", vols: ["80"], unit: "г", packs: ["10"], price: 1628.0},
  {id: "voda-chernogolovka", sec: "drinks", sub: "chernogolovka", brand: "Черноголовка", name: "Вода «Черноголовка»", vols: ["0,25", "0,33", "0,5", "1", "1,5", "5"], unit: "л", packs: ["2", "6", "12", "24"], price: 209.1},
  {id: "napitki-chernogolovka-v-zheleznoy-banke", sec: "drinks", sub: "chernogolovka", brand: "Черноголовка", name: "Напитки «Черноголовка» в железной банке", vols: ["0,33"], unit: "л", packs: ["12"], price: 519.0},
  {id: "napitki-chernogolovka-v-pet", sec: "drinks", sub: "chernogolovka", brand: "Черноголовка", name: "Напитки «Черноголовка» в ПЭТ", vols: ["0,5", "1,0", "1,5", "2,0"], unit: "л", packs: ["6", "12"], price: 482.64},
  {id: "napitki-chernogolovka-v-steklyannyh-buty", sec: "drinks", sub: "chernogolovka", brand: "Черноголовка", name: "Напитки «Черноголовка» в стеклянных бутылках", vols: ["0,33", "0,5", "1,0"], unit: "л", packs: ["6", "12", "26"], price: 584.4},
  {id: "chay-chernogolovka", sec: "drinks", sub: "chernogolovka", brand: "Черноголовка", name: "Чай «Черноголовка»", vols: ["0,5", "1,0"], unit: "л", packs: ["6", "12"], price: 724.62},
  {id: "chillaut-chernogolovka", sec: "drinks", sub: "chernogolovka", brand: "Черноголовка", name: "Чиллаут «Черноголовка»", vols: ["0,33", "0,45", "0,9"], unit: "л", packs: ["12"], price: 608.52},
  {id: "dzhelli-bazilli-chernogolovka", sec: "drinks", sub: "chernogolovka", brand: "Черноголовка", name: "Джелли Базилли «Черноголовка»", vols: ["0,3"], unit: "л", packs: ["12"], price: 482.64},
  {id: "marmell-chernogolovka", sec: "drinks", sub: "chernogolovka", brand: "Черноголовка", name: "Мармелл «Черноголовка»", vols: ["0,32"], unit: "л", packs: ["12"], price: 482.64},
  {id: "munberri-chernogolovka", sec: "drinks", sub: "chernogolovka", brand: "Черноголовка", name: "Мунберри «Черноголовка»", vols: ["0,43", "0,5", "1,5"], unit: "л", packs: ["6", "12", "26"], price: 456.24},
  {id: "energetik-chernogolovka", sec: "drinks", sub: "chernogolovka", brand: "Черноголовка", name: "Энергетик «Черноголовка»", vols: ["0,45"], unit: "л", packs: ["12"], price: 604.8},
  {id: "kola-chernogolovka", sec: "drinks", sub: "coca-cola", brand: "Черноголовка", name: "Кола «Черноголовка»", vols: ["0,33", "0,5", "1,0", "1,5", "2,0"], unit: "л", packs: ["6", "12"], price: 519.0},
  {id: "kola-lava-lava", sec: "drinks", sub: "coca-cola", brand: "LAVA LAVA", name: "Кола «LAVA LAVA»", vols: ["0,5", "1,0"], unit: "л", packs: ["12", "15"], price: 791.76},
  {id: "kola-eu-patsan", sec: "drinks", sub: "coca-cola", brand: "ЭУ, ПАЦАН", name: "Кола «ЭУ, ПАЦАН»", vols: ["0,5"], unit: "л", packs: ["12"], price: 713.76},
  {id: "kola-dobryy", sec: "drinks", sub: "coca-cola", brand: "Добрый", name: "Кола «Добрый»", vols: ["0,25", "0,33", "1,0", "1,5"], unit: "л", packs: ["9", "12", "24"], price: 653.64},
  {id: "kola-rich", sec: "drinks", sub: "coca-cola", brand: "Рич", name: "Кола «Рич»", vols: ["0,33"], unit: "л", packs: ["12"], price: 707.76},
  {id: "kola-lyubimaya-kola", sec: "drinks", sub: "coca-cola", brand: "Любимая Кола", name: "Кола «Любимая Кола»", vols: ["0,33", "0,5", "1,0", "1,5", "2,0"], unit: "л", packs: ["6", "12"], price: 667.2},
  {id: "kola-evervess", sec: "drinks", sub: "coca-cola", brand: "Эвервесс", name: "Кола «Эвервесс»", vols: ["0,33", "1,0"], unit: "л", packs: ["12"], price: 758.64},
  {id: "kola-fresh-bar", sec: "drinks", sub: "coca-cola", brand: "Fresh Bar", name: "Кола «Fresh Bar»", vols: ["0,48", "1,5"], unit: "л", packs: ["6", "12"], price: 437.88},
  {id: "kola-big-gazzi", sec: "drinks", sub: "coca-cola", brand: "Биг Газзи", name: "Кола «Биг Газзи»", vols: ["1,5", "2,0"], unit: "л", packs: ["6"], price: 338.1},
  {id: "kola-bochkari", sec: "drinks", sub: "coca-cola", brand: "Бочкари", name: "Кола «Бочкари»", vols: ["0,45", "0,5", "0,9", "1,3", "1,9"], unit: "л", packs: ["6", "12"], price: 609.96},
  {id: "kola-volchihinskie-napitki", sec: "drinks", sub: "coca-cola", brand: "Волчихинские напитки", name: "Кола «Волчихинские напитки»", vols: ["0,5"], unit: "л", packs: ["12"], price: 528.48},
  {id: "kola-dzhambo", sec: "drinks", sub: "coca-cola", brand: "Джамбо", name: "Кола «Джамбо»", vols: ["0,33", "0,5", "1,0", "2,0"], unit: "л", packs: ["6", "12"], price: 453.12},
  {id: "kola-dzhuzi", sec: "drinks", sub: "coca-cola", brand: "Джузи", name: "Кола «Джузи»", vols: ["1,5"], unit: "л", packs: ["5"], price: 495.24},
  {id: "kola-karachinskiy-istochnik", sec: "drinks", sub: "coca-cola", brand: "Карачинский источник", name: "Кола «Карачинский источник»", vols: ["0,5", "1,5"], unit: "л", packs: ["6", "12"], price: 686.4},
  {id: "kola-mednyy-velikan", sec: "drinks", sub: "coca-cola", brand: "Медный Великан", name: "Кола «Медный Великан»", vols: ["0,45", "0,5", "1,4"], unit: "л", packs: ["6", "12"], price: 265.14},
  {id: "kola-fanki-manki", sec: "drinks", sub: "coca-cola", brand: "Фанки Манки", name: "Кола «Фанки Манки»", vols: ["0,25", "0,45", "0,5"], unit: "г", packs: ["12"], price: 720.6},
  {id: "kola-frutto", sec: "drinks", sub: "coca-cola", brand: "Фрутто", name: "Кола «Фрутто»", vols: ["0,6", "1,5", "2"], unit: "г", packs: ["6", "12"], price: 276.0},
  {id: "sok-dobryy", sec: "drinks", sub: "dobryy", brand: "Добрый", name: "Сок «Добрый»", vols: ["0,2", "0,3", "0,45", "0,9", "1,0", "2,0"], unit: "л", packs: ["6", "12", "27"], price: 587.88},
  {id: "napitok-dobryy-v-zheleznoy-banke", sec: "drinks", sub: "dobryy", brand: "Добрый", name: "Напиток «Добрый» в железной банке", vols: ["0,33"], unit: "л", packs: ["12", "24"], price: 645.6},
  {id: "napitok-dobryy-v-pet", sec: "drinks", sub: "dobryy", brand: "Добрый", name: "Напиток «Добрый» в ПЭТ", vols: ["0,5", "1,0", "1,5"], unit: "л", packs: ["9", "12", "24"], price: 930.72},
  {id: "napitok-dobryy-v-pet-2", sec: "drinks", sub: "dobryy", brand: "Добрый", name: "Напиток «Добрый» в ПЭТ", vols: ["0,25"], unit: "л", packs: ["12"], price: 653.64},
  {id: "energetik-burn", sec: "drinks", sub: "energy", brand: "Burn", name: "Энергетик «Burn»", vols: ["0,449"], unit: "л", packs: ["12"], price: 1208.4},
  {id: "energetik-adrenaline", sec: "drinks", sub: "energy", brand: "Adrenaline", name: "Энергетик «Adrenaline»", vols: ["0,25", "0,449"], unit: "л", packs: ["12"], price: 898.08},
  {id: "energetik-red-bull", sec: "drinks", sub: "energy", brand: "Red Bull", name: "Энергетик «Red Bull»", vols: ["0,25", "0,355", "0,473"], unit: "л", packs: ["12", "24"], price: 2752.2},
  {id: "energetik-flesh", sec: "drinks", sub: "energy", brand: "Флэш", name: "Энергетик «Флэш»", vols: ["0,45", "0,5", "1,0"], unit: "л", packs: ["9", "20", "24"], price: 835.2},
  {id: "energetik-baykal-natural-energy", sec: "drinks", sub: "energy", brand: "Байкал", name: "Энергетик Байкал natural energy»", vols: ["0,45"], unit: "л", packs: ["12"], price: 739.32},
  {id: "energetik-x-turbo-energy", sec: "drinks", sub: "energy", brand: "X-Turbo Energy", name: "Энергетик «X-Turbo Energy»", vols: ["0,45"], unit: "л", packs: ["12"], price: 776.76},
  {id: "energetik-cosmos", sec: "drinks", sub: "energy", brand: "Cosmos", name: "Энергетик «Cosmos»", vols: ["0,45"], unit: "л", packs: ["12"], price: 604.8},
  {id: "energetik-tornado", sec: "drinks", sub: "energy", brand: "Торнадо", name: "Энергетик «Торнадо»", vols: ["0,45", "0,5", "1,0"], unit: "л", packs: ["12"], price: 529.2},
  {id: "energetik-tassay", sec: "drinks", sub: "energy", brand: "Tassay", name: "Энергетик «Tassay»", vols: ["0,45"], unit: "л", packs: ["24"], price: 1636.08},
  {id: "energetik-eazy-energy", sec: "drinks", sub: "energy", brand: "Eazy Energy", name: "Энергетик «Eazy Energy»", vols: ["0,45"], unit: "л", packs: ["12"], price: 758.16},
  {id: "energetik-lifehack", sec: "drinks", sub: "energy", brand: "Lifehack", name: "Энергетик «Lifehack»", vols: ["0,5"], unit: "л", packs: ["12"], price: 708.24},
  {id: "energetik-genesis", sec: "drinks", sub: "energy", brand: "Genesis", name: "Энергетик «Genesis»", vols: ["0,45"], unit: "л", packs: ["12"], price: 1027.68},
  {id: "energetik-lit-energy", sec: "drinks", sub: "energy", brand: "Lit Energy", name: "Энергетик «Lit Energy»", vols: ["0,45"], unit: "л", packs: ["6"], price: 510.0},
  {id: "energetik-target", sec: "drinks", sub: "energy", brand: "Target", name: "Энергетик «Target»", vols: ["0,45"], unit: "л", packs: ["12"], price: 1021.56},
  {id: "energetik-volt-energy", sec: "drinks", sub: "energy", brand: "Volt Energy", name: "Энергетик «Volt Energy»", vols: ["0,45"], unit: "л", packs: ["12"], price: 926.04},
  {id: "energetik-energiya-pervyh", sec: "drinks", sub: "energy", brand: "Энергия Первых", name: "Энергетик «Энергия Первых»", vols: ["0,45"], unit: "л", packs: ["12"], price: 759.36},
  {id: "energetik-jaguar", sec: "drinks", sub: "energy", brand: "Jaguar", name: "Энергетик «Jaguar»", vols: ["0,44", "0,45", "0,47", "1,0"], unit: "л", packs: ["6", "12"], price: 582.12},
  {id: "sok-moya-semya", sec: "drinks", sub: "juices", brand: "Моя Семья", name: "Сок «Моя Семья»", vols: ["0,2", "0,95", "1,93"], unit: "л", packs: ["6", "8", "27"], price: 467.37},
  {id: "sok-rich", sec: "drinks", sub: "juices", brand: "Рич", name: "Сок «Рич»", vols: ["0,2", "0,3", "1"], unit: "л", packs: ["12"], price: 685.92},
  {id: "sok-lyubimyy", sec: "drinks", sub: "juices", brand: "Любимый", name: "Сок «Любимый»", vols: ["0,2", "0,3", "0,95", "1,93"], unit: "л", packs: ["6", "12", "27"], price: 307.92},
  {id: "sok-volzhskiy-posad", sec: "drinks", sub: "juices", brand: "Волжский посад", name: "Сок «Волжский посад»", vols: ["1"], unit: "л", packs: ["12"], price: 724.56},
  {id: "sok-gost", sec: "drinks", sub: "juices", brand: "ГОСТ", name: "Сок ГОСТ", vols: ["0,2", "1"], unit: "л", packs: ["12", "27"], price: 419.31},
  {id: "sok-fruktdrayv", sec: "drinks", sub: "juices", brand: "ФруктДрайв", name: "Сок «ФруктДрайв»", vols: ["0,2", "1"], unit: "л", packs: ["12", "27"], price: 425.52},
  {id: "sok-vkusnosok", sec: "drinks", sub: "juices", brand: "ВкусноСок", name: "Сок «ВкусноСок»", vols: ["0,2", "0,95", "1,5", "1,93"], unit: "л", packs: ["6", "12", "27"], price: 392.34},
  {id: "sok-sady-kubani", sec: "drinks", sub: "juices", brand: "Сады Кубани", name: "Сок «Сады Кубани»", vols: ["0,2", "1", "2"], unit: "л", packs: ["6", "12", "27"], price: 569.97},
  {id: "sok-divnyy-sad", sec: "drinks", sub: "juices", brand: "Дивный Сад", name: "Сок «Дивный Сад»", vols: ["0,2", "0,95", "1,93"], unit: "л", packs: ["6", "12", "27"], price: 530.28},
  {id: "sok-fruktolayn", sec: "drinks", sub: "juices", brand: "Фруктолайн", name: "Сок «Фруктолайн»", vols: ["0,2", "0,95", "1"], unit: "л", packs: ["8", "12", "27"], price: 514.08},
  {id: "sok-rj", sec: "drinks", sub: "juices", brand: "RJ", name: "Сок «RJ»", vols: ["0,33", "1"], unit: "л", packs: ["6", "15"], price: 580.92},
  {id: "sok-moy", sec: "drinks", sub: "juices", brand: "Мой", name: "Сок «Мой»", vols: ["0,125", "0,2", "0,95", "1,93"], unit: "л", packs: ["6", "12", "27"], price: 415.53},
  {id: "sok-sady-pridonya", sec: "drinks", sub: "juices", brand: "Сады Придонья", name: "Сок «Сады Придонья»", vols: ["0,125", "0,2", "0,3", "0,97", "1", "2"], unit: "л", packs: ["6", "8", "12", "18", "27"], price: 345.24},
  {id: "sok-svoy-vkus", sec: "drinks", sub: "juices", brand: "Свой Вкус", name: "Сок «Свой Вкус»", vols: ["0,33", "1"], unit: "л", packs: ["8", "15"], price: 555.04},
  {id: "sok-il-primo", sec: "drinks", sub: "juices", brand: "IL PRIMO", name: "Сок «IL PRIMO»", vols: ["0,2", "1"], unit: "л", packs: ["8", "12"], price: 336.32},
  {id: "sok-j-life", sec: "drinks", sub: "juices", brand: "J.life", name: "Сок «J.life»", vols: ["1"], unit: "л", packs: ["8"], price: 932.8},
  {id: "sok-j7", sec: "drinks", sub: "juices", brand: "J7", name: "Сок «J7»", vols: ["0,2", "0,97"], unit: "л", packs: ["12", "27"], price: 1715.58},
  {id: "sok-ermak", sec: "drinks", sub: "juices", brand: "Ермак", name: "Сок «Ермак»", vols: ["1", "2", "3"], unit: "л", packs: ["4", "8"], price: 519.2},
  {id: "sok-kubanochka", sec: "drinks", sub: "juices", brand: "Кубаночка", name: "Сок «Кубаночка»", vols: ["0,75", "1"], unit: "л", packs: ["6", "12"], price: 693.0},
  {id: "sok-kuhmaster", sec: "drinks", sub: "juices", brand: "Кухмастер", name: "Сок «Кухмастер»", vols: ["0,68"], unit: "л", packs: ["8"], price: 698.88},
  {id: "sok-palma", sec: "drinks", sub: "juices", brand: "Пальма", name: "Сок «Пальма»", vols: ["0,2", "0,95", "1,95"], unit: "л", packs: ["6", "12", "18"], price: 443.52},
  {id: "sok-persona", sec: "drinks", sub: "juices", brand: "Персона", name: "Сок «Персона»", vols: ["1", "2", "3"], unit: "л", packs: ["4", "6"], price: 457.96},
  {id: "sok-priyatnyy-den", sec: "drinks", sub: "juices", brand: "Приятный день", name: "Сок «Приятный день»", vols: ["0,5", "2"], unit: "л", packs: ["6", "12"], price: 455.4},
  {id: "sok-sava", sec: "drinks", sub: "juices", brand: "Сава", name: "Сок «Сава»", vols: ["0,2", "0,5", "2"], unit: "л", packs: ["4", "8", "10", "15", "30", "40"], price: 352.0},
  {id: "sok-sady-altaya", sec: "drinks", sub: "juices", brand: "Сады Алтая", name: "Сок «Сады Алтая»", vols: ["1", "2", "3"], unit: "л", packs: ["4", "8"], price: 391.6},
  {id: "sok-sady-yuga", sec: "drinks", sub: "juices", brand: "Сады Юга", name: "Сок «Сады Юга»", vols: ["1", "2", "3"], unit: "л", packs: ["4", "8"], price: 497.2},
  {id: "sok-sochnyy-mir", sec: "drinks", sub: "juices", brand: "Сочный Мир", name: "Сок «Сочный Мир»", vols: ["0,95"], unit: "л", packs: ["12"], price: 862.8},
  {id: "sok-fruktovyy-ostrov", sec: "drinks", sub: "juices", brand: "Фруктовый Остров", name: "Сок «Фруктовый Остров»", vols: ["0,2", "0,5", "0,93", "1,93"], unit: "л", packs: ["6", "12", "14", "27"], price: 529.2},
  {id: "napitok-milkis-so-vkusom-banana", sec: "drinks", sub: "milkis", brand: "Milkis", name: "Напиток Милкис со вкусом банана", vols: ["0,25"], unit: "л", packs: ["30"], taste: "Банан", price: 1620.0},
  {id: "napitok-milkis-so-vkusom-vinograda", sec: "drinks", sub: "milkis", brand: "Milkis", name: "Напиток Милкис со вкусом винограда", vols: ["0,25"], unit: "л", packs: ["30"], taste: "Виноград", price: 1620.0},
  {id: "napitok-milkis-so-vkusom-dyni", sec: "drinks", sub: "milkis", brand: "Milkis", name: "Напиток Милкис со вкусом дыни", vols: ["0,25"], unit: "л", packs: ["30"], taste: "Дыня", price: 1620.0},
  {id: "napitok-milkis-zero", sec: "drinks", sub: "milkis", brand: "Milkis", name: "Напиток Милкис зеро", vols: ["0,25"], unit: "л", packs: ["30"], taste: "Зеро", price: 1620.0},
  {id: "napitok-milkis-so-vkusom-klubniki", sec: "drinks", sub: "milkis", brand: "Milkis", name: "Напиток Милкис со вкусом клубники", vols: ["0,25"], unit: "л", packs: ["30"], taste: "Клубника", price: 1620.0},
  {id: "napitok-milkis-so-vkusom-mango", sec: "drinks", sub: "milkis", brand: "Milkis", name: "Напиток Милкис со вкусом манго", vols: ["0,25"], unit: "л", packs: ["30"], taste: "Манго", price: 1620.0},
  {id: "napitok-milkis-s-originalnym-vkusom", sec: "drinks", sub: "milkis", brand: "Milkis", name: "Напиток Милкис с оригинальным вкусом", vols: ["0,25", "0,5", "1,5"], unit: "л", packs: ["12", "20", "30"], taste: "Оригинальный", price: 1620.0},
  {id: "napitok-milkis-so-vkusom-persika", sec: "drinks", sub: "milkis", brand: "Milkis", name: "Напиток Милкис со вкусом персика", vols: ["0,25"], unit: "л", packs: ["30"], taste: "Персик", price: 1620.0},
  {id: "napitok-chernogolovka", sec: "drinks", brand: "Черноголовка", name: "Напиток «Черноголовка»", vols: ["0,25", "0,3", "0,32", "0,33", "0,43", "0,45", "0,5", "0,9", "1,0", "1,5", "2,0", "5,0"], unit: "л", packs: ["6", "9", "12", "24"], price: 187.84},
  {id: "napitok-lava-lava", sec: "drinks", brand: "Lava Lava", name: "Напиток «Lava Lava»", vols: ["0,5", "1,0"], unit: "л", packs: ["12", "15"], price: 713.76},
  {id: "napitok-eu-patsan", sec: "drinks", brand: "Эу, пацан", name: "Напиток «Эу, пацан»", vols: ["0,45", "0,5"], unit: "л", packs: ["12"], price: 713.76},
  {id: "napitok-spring", sec: "drinks", brand: "Спринг", name: "Напиток «Спринг»", vols: ["0,5", "1,0", "1,5", "5,0"], unit: "л", packs: ["6", "12"], price: 248.4},
  {id: "napitok-fresh-bar", sec: "drinks", brand: "Fresh Bar", name: "Напиток «Fresh Bar»", vols: ["0,45", "0,48", "1,5"], unit: "л", packs: ["6", "12"], price: 437.88},
  {id: "napitok-extra-tea", sec: "drinks", brand: "Extra Tea", name: "Напиток «Extra Tea»", vols: ["1"], unit: "л", packs: ["6"], price: 291.6},
  {id: "napitok-bona-akva", sec: "drinks", brand: "Бона Аква", name: "Напиток «Бона Аква»", vols: ["0,33", "0,5", "1,0", "5,0"], unit: "л", packs: ["4", "12", "24"], price: 479.76},
  {id: "napitok-dobryy", sec: "drinks", brand: "Добрый", name: "Напиток «Добрый»", vols: ["0,25", "0,33", "0,5", "1,0", "1,5"], unit: "л", packs: ["9", "12", "24"], price: 645.6},
  {id: "napitok-rich", sec: "drinks", brand: "Рич", name: "Напиток «Рич»", vols: ["0,33", "0,5", "1,0", "1,5"], unit: "л", packs: ["6", "12"], price: 707.76},
  {id: "napitok-akva-minerale", sec: "drinks", brand: "Аква Минерале", name: "Напиток «Аква Минерале»", vols: ["0,5", "1,0", "2,0"], unit: "л", packs: ["6", "12"], price: 471.48},
  {id: "energetik-drayv-mi", sec: "drinks", brand: "Драйв Ми", name: "Энергетик «Драйв Ми»", vols: ["0,449", "0,5", "1,0"], unit: "л", packs: ["6", "12"], price: 647.28},
  {id: "napitok-lipton", sec: "drinks", brand: "Липтон", name: "Напиток «Липтон»", vols: ["0,5", "1,0", "1,5"], unit: "л", packs: ["6", "12"], price: 1025.58},
  {id: "napitok-lyubimaya-kola", sec: "drinks", brand: "Любимая Кола", name: "Напиток «Любимая Кола»", vols: ["0,33", "0,5", "1,0", "1,5", "2,0"], unit: "л", packs: ["6", "12"], price: 667.2},
  {id: "napitok-evervess", sec: "drinks", brand: "Эвервесс", name: "Напиток «Эвервесс»", vols: ["0,33", "1,0"], unit: "л", packs: ["12"], price: 758.64},
  {id: "napitok-blagaya-vest", sec: "drinks", brand: "Благая Весть", name: "Напиток «Благая Весть»", vols: ["0,5", "1,5"], unit: "л", packs: ["6", "12"], price: 281.52},
  {id: "napitok-m-m-limonova", sec: "drinks", brand: "М-М Лимонова", name: "Напиток «М-М Лимонова»", vols: ["0,5", "1,5"], unit: "л", packs: ["6", "12"], price: 351.9},
  {id: "napitok-sibirskiy-bor", sec: "drinks", brand: "Сибирский Бор", name: "Напиток «Сибирский Бор»", vols: ["0,5", "1,5", "5,0"], unit: "л", packs: ["2", "6", "12"], price: 196.88},
  {id: "napitok-sokovo", sec: "drinks", brand: "Соково", name: "Напиток «Соково»", vols: ["1,5"], unit: "л", packs: ["6"], price: 386.58},
  {id: "napitok-spring-vkusnyy", sec: "drinks", brand: "Спринг Вкусный", name: "Напиток «Спринг Вкусный»", vols: ["0,5", "1,0"], unit: "л", packs: ["6", "12"], price: 604.62},
  {id: "napitok-spring-chay", sec: "drinks", brand: "Спринг Чай", name: "Напиток «Спринг Чай»", vols: ["0,5", "1,5"], unit: "л", packs: ["6", "12"], price: 441.06},
  {id: "napitok-fruktovo", sec: "drinks", brand: "Фруктово", name: "Напиток «Фруктово»", vols: ["0,5", "1,0"], unit: "л", packs: ["6", "12"], price: 500.58},
  {id: "napitok-tsarskiy-bochonok", sec: "drinks", brand: "Царский Бочонок", name: "Напиток «Царский Бочонок»", vols: ["0,5", "1,5"], unit: "л", packs: ["6", "12"], price: 441.06},
  {id: "abakanskoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Абаканское", name: "Абаканское", vols: ["0,5"], unit: "л", packs: ["20"], price: 1614.4},
  {id: "abakanskoe-legkoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Абаканское легкое", name: "Абаканское легкое", vols: ["0,5"], unit: "л", packs: ["20"], price: 1614.4},
  {id: "altay-han", sec: "low-alcohol-drinks", sub: "beer", brand: "Алтай-Хан", name: "Алтай-Хан", vols: ["0,45"], unit: "л", packs: ["20"], price: 1677.8},
  {id: "alpin-hakan", sec: "low-alcohol-drinks", sub: "beer", brand: "Альпин Хакан", name: "Альпин Хакан", vols: ["0,5"], unit: "л", packs: ["12"], price: 1735.8},
  {id: "alpina", sec: "low-alcohol-drinks", sub: "beer", brand: "Альпина", name: "Альпина", vols: ["0,45"], unit: "л", packs: ["12"], price: 744.12},
  {id: "alpina-belgiyskoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Альпина Бельгийское", name: "Альпина Бельгийское", vols: ["0,5"], unit: "л", packs: ["12"], price: 1666.8},
  {id: "alpina-belgiyskoe-pshenichnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Альпина Бельгийское пшеничное", name: "Альпина Бельгийское пшеничное", vols: ["0,5"], unit: "л", packs: ["12"], price: 1685.28},
  {id: "alpina-zoloto-hakasii", sec: "low-alcohol-drinks", sub: "beer", brand: "Альпина Золото Хакасии", name: "Альпина Золото Хакасии", vols: ["0,45", "1,3"], unit: "л", packs: ["6", "12"], price: 931.86},
  {id: "alpina-klassicheskoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Альпина Классическое", name: "Альпина Классическое", vols: ["0,45"], unit: "л", packs: ["12"], price: 1025.4},
  {id: "alpina-krepost-sibiri", sec: "low-alcohol-drinks", sub: "beer", brand: "Альпина Крепость Сибири", name: "Альпина Крепость Сибири", vols: ["0,45"], unit: "л", packs: ["12"], price: 1067.4},
  {id: "alpina-nemetskoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Альпина Немецкое", name: "Альпина Немецкое", vols: ["0,45", "1,3"], unit: "л", packs: ["6", "12"], price: 931.86},
  {id: "alpina-pilsner", sec: "low-alcohol-drinks", sub: "beer", brand: "Альпина Пилснер", name: "Альпина Пилснер", vols: ["0,45"], unit: "л", packs: ["12"], price: 1025.4},
  {id: "alpina-cheshskoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Альпина Чешское", name: "Альпина Чешское", vols: ["0,45", "1,3"], unit: "л", packs: ["6", "12"], price: 954.6},
  {id: "alpina-pshenichnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Альпина пшеничное", name: "Альпина пшеничное", vols: ["0,45"], unit: "л", packs: ["12"], price: 1053.96},
  {id: "arsenalnoe-krepkoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Арсенальное Крепкое", name: "Арсенальное Крепкое", vols: ["0,45"], unit: "л", packs: ["24"], price: 1815.6},
  {id: "arsenalnoe-krepkoe-spetsialnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Арсенальное Крепкое Специальное", name: "Арсенальное Крепкое Специальное", vols: ["1,1"], unit: "л", packs: ["9"], price: 1208.07},
  {id: "afanasiy-marochnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Афанасий Марочное", name: "Афанасий Марочное", vols: ["0,5"], unit: "л", packs: ["6"], price: 823.74},
  {id: "afanasiy-svetloe-marochnoe-izbrannoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Афанасий Светлое Марочное Избранное", name: "Афанасий Светлое Марочное Избранное", vols: ["0,5"], unit: "л", packs: ["6"], price: 1018.56},
  {id: "afanasiy-temnoe-marochnoe-izbrannoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Афанасий Темное Марочное Избранное", name: "Афанасий Темное Марочное Избранное", vols: ["0,5"], unit: "л", packs: ["6"], price: 1018.62},
  {id: "afanasiy-svetloe-retro", sec: "low-alcohol-drinks", sub: "beer", brand: "Афанасий светлое Ретро", name: "Афанасий светлое Ретро", vols: ["0,75"], unit: "л", packs: ["6"], price: 1321.38},
  {id: "bavarskoe-zolotaya-sova", sec: "low-alcohol-drinks", sub: "beer", brand: "Баварское Золотая Сова", name: "Баварское Золотая Сова", vols: ["0,5"], unit: "л", packs: ["12"], price: 998.52},
  {id: "bad", sec: "low-alcohol-drinks", sub: "beer", brand: "Бад", name: "Бад", vols: ["0,44", "0,45", "0,75"], unit: "л", packs: ["12", "20", "24"], price: 2018.2},
  {id: "bad-layt", sec: "low-alcohol-drinks", sub: "beer", brand: "Бад Лайт", name: "Бад Лайт", vols: ["0,44", "0,45"], unit: "л", packs: ["20", "24"], price: 1615.8},
  {id: "baltika-3-klassicheskoe-traditsionnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Балтика 3 Классическое Традиционное", name: "Балтика 3 Классическое Традиционное", vols: ["0,45"], unit: "л", packs: ["20", "24"], price: 1568.2},
  {id: "kuler", sec: "low-alcohol-drinks", sub: "beer", brand: "Кулер", name: "Кулер", vols: ["0,45", "0,47", "1,2"], unit: "л", packs: ["9", "20", "24"], price: 1262.52},
  {id: "baltika-legendarnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Балтика Легендарное", name: "Балтика Легендарное", vols: ["1,3"], unit: "л", packs: ["9"], price: 1337.67},
  {id: "baltika-7-myagkoe-premium", sec: "low-alcohol-drinks", sub: "beer", brand: "Балтика 7 Мягкое Премиум", name: "Балтика 7 Мягкое Премиум", vols: ["0,44", "0,45"], unit: "л", packs: ["20", "24"], price: 1544.6},
  {id: "baltika-pshenichnoe-0", sec: "low-alcohol-drinks", sub: "beer", brand: "Балтика Пшеничное 0", name: "Балтика Пшеничное 0", vols: ["0,45"], unit: "л", packs: ["24"], price: 1544.88},
  {id: "baltika-0", sec: "low-alcohol-drinks", sub: "beer", brand: "Балтика 0", name: "Балтика 0", vols: ["0,45", "0,47"], unit: "л", packs: ["20", "24"], price: 1349.6},
  {id: "baltika-0-greypfrut", sec: "low-alcohol-drinks", sub: "beer", brand: "Балтика 0 Грейпфрут", name: "Балтика 0 Грейпфрут", vols: ["0,33"], unit: "л", packs: ["24"], price: 1656.72},
  {id: "baltika-2-legkoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Балтика 2 Легкое", name: "Балтика 2 Легкое", vols: ["0,45"], unit: "л", packs: ["24"], price: 1878.24},
  {id: "baltika-3", sec: "low-alcohol-drinks", sub: "beer", brand: "Балтика 3", name: "Балтика 3", vols: ["0,9"], unit: "л", packs: ["12"], price: 1729.56},
  {id: "baltika-7", sec: "low-alcohol-drinks", sub: "beer", brand: "Балтика 7", name: "Балтика 7", vols: ["0,45"], unit: "л", packs: ["20", "24"], price: 1869.4},
  {id: "baltika-7-eksportnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Балтика 7 Экспортное", name: "Балтика 7 Экспортное", vols: ["0,9"], unit: "л", packs: ["12"], price: 2037.12},
  {id: "baltika-9", sec: "low-alcohol-drinks", sub: "beer", brand: "Балтика 9", name: "Балтика 9", vols: ["0,9"], unit: "л", packs: ["12"], price: 1629.84},
  {id: "baltika-9-legendarnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Балтика 9 Легендарное", name: "Балтика 9 Легендарное", vols: ["0,45"], unit: "л", packs: ["24"], price: 1740.72},
  {id: "banka", sec: "low-alcohol-drinks", sub: "beer", brand: "Банька", name: "Банька", vols: ["0,45"], unit: "л", packs: ["12"], price: 880.8},
  {id: "barhatnoe-npk", sec: "low-alcohol-drinks", sub: "beer", brand: "Бархатное НПК", name: "Бархатное НПК", vols: ["0,45"], unit: "л", packs: ["6"], price: 351.78},
  {id: "kryuger-barhatnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Крюгер Бархатное", name: "Крюгер Бархатное", vols: ["1,5"], unit: "л", packs: ["6"], price: 1045.8},
  {id: "barhatnoe-npk-temnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Бархатное НПК темное", name: "Бархатное НПК темное", vols: ["1,15"], unit: "л", packs: ["9"], price: 1007.19},
  {id: "batino-npk", sec: "low-alcohol-drinks", sub: "beer", brand: "Батино НПК", name: "Батино НПК", vols: ["0,45"], unit: "л", packs: ["6"], price: 341.46},
  {id: "belyy-medved", sec: "low-alcohol-drinks", sub: "beer", brand: "Белый Медведь", name: "Белый Медведь", vols: ["1,15"], unit: "л", packs: ["6"], price: 680.94},
  {id: "bogemskoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Богемское", name: "Богемское", vols: ["0,5"], unit: "л", packs: ["12"], price: 1365.96},
  {id: "bavarskoe-bolshaya-kruzhka", sec: "low-alcohol-drinks", sub: "beer", brand: "Баварское Большая Кружка", name: "Баварское Большая Кружка", vols: ["1,1"], unit: "л", packs: ["9"], price: 1422.9},
  {id: "cheshskoe-bolshaya-kruzhka", sec: "low-alcohol-drinks", sub: "beer", brand: "Чешское Большая Кружка", name: "Чешское Большая Кружка", vols: ["1,1"], unit: "л", packs: ["9"], price: 1030.32},
  {id: "borihinskoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Борихинское", name: "Борихинское", vols: ["0,5"], unit: "л", packs: ["12"], price: 1028.52},
  {id: "zhivoy-rozliv-bochkarev", sec: "low-alcohol-drinks", sub: "beer", brand: "Живой Розлив Бочкарев", name: "Живой Розлив Бочкарев", vols: ["0,43"], unit: "л", packs: ["24"], price: 1498.8},
  {id: "holod-i-solod-bochkarev", sec: "low-alcohol-drinks", sub: "beer", brand: "Холод и Солод Бочкарев", name: "Холод и Солод Бочкарев", vols: ["0,95"], unit: "л", packs: ["9"], price: 954.54},
  {id: "brama", sec: "low-alcohol-drinks", sub: "beer", brand: "Брама", name: "Брама", vols: ["0,45"], unit: "л", packs: ["20"], price: 1418.0},
  {id: "vays-berg", sec: "low-alcohol-drinks", sub: "beer", brand: "Вайс Берг", name: "Вайс Берг", vols: ["0,45", "1,25"], unit: "л", packs: ["6", "20"], price: 710.7},
  {id: "vays-berg-malina", sec: "low-alcohol-drinks", sub: "beer", brand: "Вайс Берг Малина", name: "Вайс Берг Малина", vols: ["0,45"], unit: "л", packs: ["20"], price: 1481.2},
  {id: "vays-berg-pshenichnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Вайс Берг Пшеничное", name: "Вайс Берг Пшеничное", vols: ["0,45", "1,25"], unit: "л", packs: ["6", "20"], price: 710.7},
  {id: "vays-berg-vishnya", sec: "low-alcohol-drinks", sub: "beer", brand: "Вайс Берг Вишня", name: "Вайс Берг Вишня", vols: ["0,45"], unit: "л", packs: ["20"], price: 1481.2},
  {id: "vays-berg-laym-limon", sec: "low-alcohol-drinks", sub: "beer", brand: "Вайс Берг Лайм-Лимон", name: "Вайс Берг Лайм-Лимон", vols: ["0,45"], unit: "л", packs: ["20"], price: 1481.2},
  {id: "vaysberg-bezalkogolnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "ВайсБерг Безалкогольное", name: "ВайсБерг Безалкогольное", vols: ["0,45"], unit: "л", packs: ["20"], price: 1380.4},
  {id: "vaysburg", sec: "low-alcohol-drinks", sub: "beer", brand: "Вайсбург", name: "Вайсбург", vols: ["0,5"], unit: "л", packs: ["12", "20"], price: 900.12},
  {id: "vena-temnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Вена Темное", name: "Вена Темное", vols: ["0,5"], unit: "л", packs: ["12"], price: 912.24},
  {id: "venskoe-kraftovoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Венское Крафтовое", name: "Венское Крафтовое", vols: ["0,5"], unit: "л", packs: ["20"], price: 1686.8},
  {id: "venskoe-zelenogorskoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Венское Зеленогорское", name: "Венское Зеленогорское", vols: ["0,5"], unit: "л", packs: ["12"], price: 880.8},
  {id: "vershina-vysota-8848", sec: "low-alcohol-drinks", sub: "beer", brand: "Вершина Высота 8848", name: "Вершина Высота 8848", vols: ["0,45"], unit: "л", packs: ["12"], price: 1046.04},
  {id: "volkovskaya-pivovarnya-svetlyachok", sec: "low-alcohol-drinks", sub: "beer", brand: "Волковская Пивоварня Светлячок", name: "Волковская Пивоварня Светлячок", vols: ["0,45"], unit: "л", packs: ["20"], price: 1888.2},
  {id: "volkovskaya-pivovarnya-mishenka-pod-vish", sec: "low-alcohol-drinks", sub: "beer", brand: "Волковская Пивоварня Мишенька под вишенькой", name: "Волковская Пивоварня Мишенька под вишенькой", vols: ["0,45"], unit: "л", packs: ["20"], price: 1888.2},
  {id: "volkovskaya-pivovarnya-blansh-de-mazay", sec: "low-alcohol-drinks", sub: "beer", brand: "Волковская Пивоварня Бланш де Мазай", name: "Волковская Пивоварня Бланш де Мазай", vols: ["0,45"], unit: "л", packs: ["20"], price: 1888.2},
  {id: "volkovskaya-pivovarnya-ipa", sec: "low-alcohol-drinks", sub: "beer", brand: "Волковская Пивоварня IPA", name: "Волковская Пивоварня IPA", vols: ["0,45"], unit: "л", packs: ["20"], price: 1888.2},
  {id: "volkovskaya-pivovarnya-apa", sec: "low-alcohol-drinks", sub: "beer", brand: "Волковская Пивоварня APA", name: "Волковская Пивоварня APA", vols: ["0,45"], unit: "л", packs: ["20"], price: 1888.2},
  {id: "volzhskaya-pivovarnya-firmennoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Волжская пивоварня Фирменное", name: "Волжская пивоварня Фирменное", vols: ["1,2"], unit: "л", packs: ["9"], price: 911.25},
  {id: "volzhskaya-pivovarnya-krepkoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Волжская пивоварня Крепкое", name: "Волжская пивоварня Крепкое", vols: ["1,2"], unit: "л", packs: ["9"], price: 967.32},
  {id: "volzhskaya-pivovarnya-dubovaya-bochka", sec: "low-alcohol-drinks", sub: "beer", brand: "Волжская пивоварня Дубовая бочка", name: "Волжская пивоварня Дубовая бочка", vols: ["1,2"], unit: "л", packs: ["9"], price: 911.25},
  {id: "volochaevskoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Волочаевское", name: "Волочаевское", vols: ["0,5"], unit: "л", packs: ["20"], price: 1729.8},
  {id: "vorsin-zhigulevskoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Ворсин Жигулевское", name: "Ворсин Жигулевское", vols: ["0,5"], unit: "л", packs: ["12"], price: 911.28},
  {id: "vorsin-lager", sec: "low-alcohol-drinks", sub: "beer", brand: "Ворсин Лагер", name: "Ворсин Лагер", vols: ["0,5"], unit: "л", packs: ["12"], price: 911.28},
  {id: "vostok-17", sec: "low-alcohol-drinks", sub: "beer", brand: "Восток 17", name: "Восток 17", vols: ["0,5"], unit: "л", packs: ["12"], price: 1046.04},
  {id: "vyberi-menya", sec: "low-alcohol-drinks", sub: "beer", brand: "Выбери Меня", name: "Выбери Меня", vols: ["1,2"], unit: "л", packs: ["9"], price: 911.25},
  {id: "derevenskoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Деревенское", name: "Деревенское", vols: ["1,2"], unit: "л", packs: ["9"], price: 911.25},
  {id: "zhigulevskoe-spetsialnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Жигулевское Специальное", name: "Жигулевское Специальное", vols: ["1,2"], unit: "л", packs: ["9"], price: 911.25},
  {id: "zavodskoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Заводское", name: "Заводское", vols: ["1,2"], unit: "л", packs: ["9"], price: 911.25},
  {id: "klassicheskoe-spetsialnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Классическое Специальное", name: "Классическое Специальное", vols: ["1,2"], unit: "л", packs: ["9"], price: 911.25},
  {id: "pshenichnoe-spetsialnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Пшеничное Специальное", name: "Пшеничное Специальное", vols: ["1,2"], unit: "л", packs: ["9"], price: 911.25},
  {id: "svetloe-spetsialnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Светлое Специальное", name: "Светлое Специальное", vols: ["1,2"], unit: "л", packs: ["9"], price: 911.25},
  {id: "cheshskoe-spetsialnoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Чешское Специальное", name: "Чешское Специальное", vols: ["1,2"], unit: "л", packs: ["9"], price: 911.25},
  {id: "yachmennoe-firmennoe-filtrovannoe", sec: "low-alcohol-drinks", sub: "beer", brand: "Ячменное фирменное фильтрованное", name: "Ячменное фирменное фильтрованное", vols: ["1,2"], unit: "л", packs: ["9"], price: 911.25},
  {id: "maslo-ideal", sec: "oil-and-fat-products", sub: "sunflower", brand: "Идеал", name: "Масло «Идеал»", vols: ["1", "2", "5"], unit: "л", packs: ["3", "6", "15"], price: 1834.8},
  {id: "maslo-eleya", sec: "oil-and-fat-products", sub: "sunflower", brand: "Елея", name: "Масло «Елея»", vols: ["0,25", "0,5", "0,9", "1,0", "3,0", "5,0"], unit: "л", packs: ["3", "4", "6", "12"], price: 831.6},
  {id: "maslo-altero", sec: "oil-and-fat-products", sub: "sunflower", brand: "ALTERO", name: "Масло «ALTERO»", vols: ["0,81"], unit: "л", packs: ["15"], price: 2392.5},
  {id: "maslo-aleyka", sec: "oil-and-fat-products", sub: "sunflower", brand: "Алейка", name: "Масло «Алейка»", vols: ["1"], unit: "л", packs: ["12"], price: 1623.6},
  {id: "maslo-krasnodarskoe", sec: "oil-and-fat-products", sub: "sunflower", brand: "Краснодарское", name: "Масло «Краснодарское»", vols: ["0,5"], unit: "л", packs: ["15"], price: 3697.2},
  {id: "maslo-schedroe", sec: "oil-and-fat-products", sub: "sunflower", brand: "Щедрое", name: "Масло «Щедрое»", vols: ["1", "5"], unit: "л", packs: ["3", "15"], price: 1963.5},
  {id: "maslo-solpro", sec: "oil-and-fat-products", sub: "sunflower", brand: "SOLPRO", name: "Масло «SOLPRO»", vols: ["5"], unit: "л", packs: ["3"], price: 2277.0},
  {id: "maslo-kristallina", sec: "oil-and-fat-products", sub: "sunflower", brand: "Кристаллина", name: "Масло «Кристаллина»", vols: ["1", "5"], unit: "л", packs: ["3", "12"], price: 1570.8},
  {id: "maslo-zharko", sec: "oil-and-fat-products", sub: "sunflower", brand: "Жарко", name: "Масло «Жарко»", vols: ["1", "5"], unit: "л", packs: ["3", "12"], price: 1518.0},
  {id: "maslo-zoloto-altaya", sec: "oil-and-fat-products", sub: "sunflower", brand: "Золото Алтая", name: "Масло «Золото Алтая»", vols: ["0,8", "1", "5"], unit: "л", packs: ["3", "12"], price: 1214.4},
  {id: "maslo-kubanochka", sec: "oil-and-fat-products", sub: "sunflower", brand: "Кубаночка", name: "Масло «Кубаночка»", vols: ["0,5", "1"], unit: "л", packs: ["15"], price: 1369.5},
  {id: "maslo-semechka-ivanovna", sec: "oil-and-fat-products", sub: "sunflower", brand: "Семечка Ивановна", name: "Масло «Семечка Ивановна»", vols: ["0,8", "0,9", "1", "5"], unit: "л", packs: ["3", "12"], price: 1214.4},
  {id: "maslo-blago", sec: "oil-and-fat-products", sub: "sunflower", brand: "Благо", name: "Масло «Благо»", vols: ["1"], unit: "л", packs: ["15"], price: 2128.5},
  {id: "maslo-zolotoy-kuvshin", sec: "oil-and-fat-products", sub: "sunflower", brand: "Золотой Кувшин", name: "Масло «Золотой Кувшин»", vols: ["1"], unit: "л", packs: ["15"], price: 1963.5},
  {id: "maslo-urozhaynoe", sec: "oil-and-fat-products", sub: "sunflower", brand: "Урожайное", name: "Масло «Урожайное»", vols: ["1"], unit: "л", packs: ["15"], price: 1963.5},
  {id: "maslo-sloboda", sec: "oil-and-fat-products", sub: "sunflower", brand: "Слобода", name: "Масло «Слобода»", vols: ["1", "1,8", "2,7"], unit: "л", packs: ["6", "15"], price: 1775.4},
  {id: "maslo-efko-food", sec: "oil-and-fat-products", sub: "sunflower", brand: "EFKO FOOD", name: "Масло «EFKO FOOD»", vols: ["5"], unit: "л", packs: ["3"], price: 2475.0},
  {id: "maslo-zolotaya-semechka", sec: "oil-and-fat-products", sub: "sunflower", brand: "Золотая семечка", name: "Масло «Золотая семечка»", vols: ["0,5"], unit: "л", packs: ["24"], price: 1927.2},
  {id: "maslo-zlato", sec: "oil-and-fat-products", sub: "sunflower", brand: "ЗЛАТО", name: "Масло «ЗЛАТО»", vols: ["1", "5"], unit: "л", packs: ["4", "15"], price: 2211.0},
  {id: "maslo-anninskoe", sec: "oil-and-fat-products", sub: "sunflower", brand: "Аннинское", name: "Масло «Аннинское»", vols: ["0,9"], unit: "л", packs: ["15"], price: 2062.5},
  {id: "krupy-passim", sec: "grocery", sub: "cereal", brand: "ПАССИМ", name: "Крупы «ПАССИМ»", vols: ["0,4", "0,5", "0,6", "0,7", "0,8", "1,5", "3,0"], unit: "кг", packs: ["6", "8", "9", "10", "12"], price: 397.44},
  {id: "krupy-prosto", sec: "grocery", sub: "cereal", brand: "PROSTO", name: "Крупы «PROSTO»", vols: ["0,5"], unit: "кг", packs: ["12"], price: 791.4},
  {id: "krupy-agromaster", sec: "grocery", sub: "cereal", brand: "Агромастер", name: "Крупы «Агромастер»", vols: ["0,4", "0,7", "0,8", "1,5"], unit: "кг", packs: ["6", "8", "10"], price: 228.36},
  {id: "krupy-aleyka", sec: "grocery", sub: "cereal", brand: "Алейка", name: "Крупы «Алейка»", vols: ["0,4"], unit: "кг", packs: ["12", "30"], price: 653.4},
  {id: "krupy-vesovye", sec: "grocery", sub: "cereal", brand: "Крупы весовые", name: "Крупы весовые", vols: ["25", "40", "50"], unit: "кг", price: 673.2},
  {id: "krupy-krupyanoy-dar", sec: "grocery", sub: "cereal", brand: "Крупяной Дар", name: "Крупы «Крупяной Дар»", vols: ["0,4", "0,5", "0,7", "1,0", "5,0", "1,0"], unit: "кг", packs: ["5", "15", "20"], price: 461.6},
  {id: "krupy-makfa-krupy", sec: "grocery", sub: "cereal", brand: "Макфа-крупы", name: "Крупы «Макфа-крупы»", vols: ["0,4", "0,7", "0,8"], unit: "кг", packs: ["6", "8", "9", "12"], price: 393.3},
  {id: "krupy-mistral", sec: "grocery", sub: "cereal", brand: "Мистраль", name: "Крупы «Мистраль»", vols: ["0,4", "0,5", "0,9"], unit: "кг", packs: ["1", "6", "12"], price: 436.8},
  {id: "krupy-natsional", sec: "grocery", sub: "cereal", brand: "Националь", name: "Крупы «Националь»", vols: ["0,25", "0,35", "0,4", "0,8", "0,9", "1,5", "3,0"], unit: "кг", packs: ["4", "6", "8", "12"], price: 299.88},
  {id: "krupy-semeynye-zakroma", sec: "grocery", sub: "cereal", brand: "Семейные Закрома", name: "Крупы «Семейные Закрома»", vols: ["0,6", "0,7", "0,8", "1,5", "2,5", "3,0", "5,0"], unit: "кг", packs: ["1", "4", "6", "10", "12"], price: 139.26},
  {id: "krupy-sila-zlakov", sec: "grocery", sub: "cereal", brand: "Сила Злаков", name: "Крупы «Сила Злаков»", vols: ["0,4"], unit: "кг", packs: ["12"], price: 503.28},
  {id: "krupy-uvelka-krupy", sec: "grocery", sub: "cereal", brand: "Увелка-крупы", name: "Крупы «Увелка-крупы»", vols: ["0,8"], unit: "кг", packs: ["6"], price: 428.82},
  {id: "krupy-urozhaynitsa", sec: "grocery", sub: "cereal", brand: "Урожайница", name: "Крупы «Урожайница»", vols: ["0,4", "0,8", "1,0", "10,0", "25,0"], unit: "кг", packs: ["5", "10", "12", "25", "30"], price: 148.5},
  {id: "krupy-chim-chim", sec: "grocery", sub: "cereal", brand: "Чим-Чим", name: "Крупы «Чим-Чим»", vols: ["0,5"], unit: "кг", packs: ["12"], price: 2054.16},
  {id: "krupy-eko", sec: "grocery", sub: "cereal", brand: "ЭКО", name: "Крупы «ЭКО»", vols: ["0,5", "0,6", "0,8"], unit: "кг", packs: ["8", "10"], price: 208.8},
  {id: "muka-aleyka", sec: "grocery", sub: "flour", brand: "Алейка", name: "Мука «Алейка»", vols: ["1", "2", "3", "5", "10", "25", "50"], unit: "кг", packs: ["1", "2", "5", "8"], price: 133.83},
  {id: "muka-belyaevskaya", sec: "grocery", sub: "flour", brand: "Беляевская", name: "Мука «Беляевская»", vols: ["2", "5", "10", "25", "50"], unit: "кг", packs: ["1", "6", "10"], price: 479.16},
  {id: "muka-garnets", sec: "grocery", sub: "flour", brand: "Гарнец", name: "Мука «Гарнец»", vols: ["0,3", "0,4", "0,5", "0,6"], unit: "кг", packs: ["6"], price: 341.58},
  {id: "muka-dobrodeya", sec: "grocery", sub: "flour", brand: "Добродея", name: "Мука «Добродея»", vols: ["1", "2", "5", "10", "25", "50"], unit: "кг", packs: ["1", "6", "10"], price: 412.5},
  {id: "muka-makfa", sec: "grocery", sub: "flour", brand: "Макфа", name: "Мука «Макфа»", vols: ["0,5", "1,0", "2,0"], unit: "кг", packs: ["4", "6", "10"], price: 277.12},
  {id: "muka-melnik", sec: "grocery", sub: "flour", brand: "Мельник", name: "Мука «Мельник»", vols: ["1", "2", "10"], unit: "кг", packs: ["5", "6", "10"], price: 377.6},
  {id: "muka-semeynye-zakroma", sec: "grocery", sub: "flour", brand: "Семейные Закрома", name: "Мука «Семейные Закрома»", vols: ["1", "2"], unit: "кг", packs: ["6", "8"], price: 286.8},
  {id: "sahar-mistral", sec: "grocery", sub: "sugar", brand: "Мистраль", name: "Сахар «Мистраль»", vols: ["0,5", "0,9", "1,0"], unit: "кг", packs: ["8", "12"], price: 4756.88},
  {id: "sahar-krasnodar", sec: "grocery", sub: "sugar", brand: "Краснодар", name: "Сахар «Краснодар»", vols: ["50"], unit: "кг", packs: ["1"], price: 3822.5},
  {id: "sahar-urozhaynika", sec: "grocery", sub: "sugar", brand: "Урожайника", name: "Сахар «Урожайника»", vols: ["1"], unit: "кг", packs: ["10"], price: 817.3},
  {id: "sahar-pesok", sec: "grocery", sub: "sugar", brand: "Сахар-песок", name: "Сахар-песок", vols: ["5", "10", "25"], unit: "кг", packs: ["1"], price: 403.15},
  {id: "aleyka-muka", sec: "grocery", brand: "Алейка-мука", name: "«Алейка-мука»", vols: ["1", "2", "3", "5", "10", "25", "50"], unit: "кг", packs: ["3", "4", "5", "8", "10", "25", "59"], price: 133.83},
  {id: "belyaevskaya-muka", sec: "grocery", brand: "Беляевская-мука", name: "«Беляевская-мука»", vols: ["2", "5", "10", "25", "50"], unit: "кг", packs: ["12", "25", "50"], price: 479.16},
  {id: "garnets", sec: "grocery", brand: "Гарнец", name: "«Гарнец»", vols: ["0,3", "0,4", "0,5", "0,6"], unit: "кг", packs: ["6"], price: 341.58},
  {id: "dobrodeya-muka", sec: "grocery", brand: "Добродея-мука", name: "«Добродея-мука»", vols: ["1", "2", "5", "10", "25", "50"], unit: "кг", packs: ["1", "6", "10"], price: 528.0},
  {id: "makfa-muka", sec: "grocery", brand: "Макфа-мука", name: "«Макфа-мука»", vols: ["0,5", "1", "2"], unit: "кг", packs: ["4", "6", "10"], price: 277.12},
  {id: "melnik-muka", sec: "grocery", brand: "Мельник-мука", name: "«Мельник-мука»", vols: ["1", "2", "10"], unit: "кг", packs: ["5", "6", "10"], price: 377.6},
  {id: "semeynye-zakroma", sec: "grocery", brand: "Семейные Закрома", name: "«Семейные Закрома»", vols: ["1", "2"], unit: "кг", packs: ["6", "8"], price: 286.8},
  {id: "mistral", sec: "grocery", brand: "Мистраль", name: "«Мистраль»", vols: ["0,5", "0,9", "1,0"], unit: "кг", packs: ["8", "12"], price: 4756.88},
  {id: "krasnodar", sec: "grocery", brand: "Краснодар", name: "«Краснодар»", vols: ["50"], unit: "кг", packs: ["1"], price: 3822.5},
  {id: "urozhaynika", sec: "grocery", brand: "Урожайника", name: "«Урожайника»", vols: ["1"], unit: "кг", packs: ["10"], price: 817.3},
  {id: "lava-lava", sec: "grocery", brand: "LAVA LAVA Каша", name: "«LAVA LAVA»", vols: ["0,035"], unit: "кг", packs: ["30"], price: 820.8},
  {id: "eu-patsan", sec: "grocery", brand: "ЭУ, ПАЦАН", name: "«ЭУ, ПАЦАН»", vols: ["0,05"], unit: "кг", packs: ["60"], price: 1774.8},
  {id: "matti", sec: "grocery", brand: "MATTI", name: "«MATTI»", vols: ["0,04", "0,375", "0,25", "0,5"], unit: "кг", packs: ["8", "10", "12", "14", "15"], price: 362.85},
  {id: "preston", sec: "grocery", brand: "Preston", name: "«Preston»", vols: ["0,016", "0,034", "0,037", "0,04"], unit: "кг", packs: ["15", "20", "25", "40"], price: 248.2},
  {id: "big-lanch", sec: "grocery", brand: "Биг Ланч", name: "«Биг Ланч»", vols: ["0,05", "0,075", "0,09"], unit: "кг", packs: ["24", "50", "60"], price: 1494.48},
  {id: "biznes-lanch", sec: "grocery", brand: "Бизнес Ланч", name: "«Бизнес Ланч»", vols: ["0,04", "0,06", "0,09"], unit: "кг", packs: ["24", "100"], price: 993.84},
  {id: "bystrov", sec: "grocery", brand: "Быстров", name: "«Быстров»", vols: ["0,035", "0,04", "0,175", "0,228", "0,24"], unit: "кг", packs: ["8", "17"], price: 570.35},
  {id: "doshirak", sec: "grocery", brand: "Доширак", name: "«Доширак»", vols: ["0,04", "0,08", "0,086", "0,09", "0,105", "0,11", "0,12", "0,2"], unit: "кг", packs: ["16", "20", "24", "44"], price: 971.04},
  {id: "kashka-minutka", sec: "grocery", brand: "Кашка — Минутка", name: "«Кашка — Минутка»", vols: ["0,037", "0,043", "0,185", "0,215"], unit: "кг", packs: ["4", "16"], price: 1487.36},
  {id: "kvisti", sec: "grocery", brand: "Квисти", name: "«Квисти»", vols: ["0,07"], unit: "кг", packs: ["48"], price: 1008.96},
  {id: "knorr", sec: "grocery", brand: "Кнорр", name: "«Кнорр»", vols: ["0,016"], unit: "кг", packs: ["30"], price: 1119.0},
  {id: "kuntsevo", sec: "grocery", brand: "Кунцево", name: "«Кунцево»", vols: ["0,04", "0,24"], unit: "кг", packs: ["18", "24"], price: 806.4},
  {id: "maheev", sec: "grocery", brand: "Махеевъ", name: "«Махеевъ»", vols: ["0,04"], unit: "кг", packs: ["32"], price: 1397.12},
  {id: "mistral-2", sec: "grocery", brand: "Мистраль", name: "«Мистраль»", vols: ["0,04"], unit: "кг", packs: ["12", "25"], price: 702.72},
  {id: "ottogi", sec: "grocery", brand: "Оттоги", name: "«Оттоги»", vols: ["0,065", "0,095", "0,11", "0,111", "0,12"], unit: "кг", packs: ["12", "15", "20"], price: 1598.85},
  {id: "rollton", sec: "grocery", brand: "Роллтон", name: "«Роллтон»", vols: ["0,034", "0,04", "0,045", "0,055", "0,06", "0,065", "0,07", "0,085", "0,09", "0,1", "0,12", "0,24"], unit: "кг", packs: ["10", "24", "28", "40", "42"], price: 663.5},
  {id: "sen-soy", sec: "grocery", brand: "Сэн Сой Фунчоза", name: "«Сэн Сой»", vols: ["0,1", "0,125", "0,2", "0,4"], unit: "кг", packs: ["12", "15", "16", "24"], price: 778.8},
  {id: "uvelka", sec: "grocery", brand: "Увелка-каши", name: "«Увелка»", vols: ["0,04"], unit: "кг", packs: ["20"], price: 442.4},
  {id: "kuntsevo-2", sec: "grocery", brand: "Кунцево", name: "«Кунцево»", vols: ["0,1", "0,15", "0,175", "0,2", "0,3", "0,325", "0,35"], unit: "кг", packs: ["10", "12", "16", "20"], price: 907.2},
  {id: "lyubyatovo-2", sec: "grocery", brand: "Любятово", name: "«Любятово»", vols: ["0,14", "0,19", "0,2", "0,22", "0,25", "0,27", "0,3", "0,42", "0,45", "0,5", "0,6"], unit: "кг", packs: ["6", "7", "8", "9", "10", "12", "24"], price: 789.6},
  {id: "myusli", sec: "grocery", brand: "Мюсли", name: "Мюсли", vols: ["0,27", "0,31"], unit: "кг", packs: ["7"], price: 984.69},
  {id: "ogo", sec: "grocery", brand: "ОГО!", name: "«ОГО!»", vols: ["0,2", "0,28", "0,35"], unit: "кг", packs: ["10"], price: 408.8},
  {id: "super-hruper", sec: "grocery", brand: "Супер Хрупер", name: "«Супер Хрупер»", vols: ["0,18"], unit: "кг", packs: ["16"], price: 985.6},
  {id: "hrutka", sec: "grocery", brand: "Хрутка", name: "«Хрутка»", vols: ["0,027", "0,09", "0,21", "0,22", "0,23", "0,25", "0,3", "0,32", "0,35", "0,46", "0,65", "0,7"], unit: "кг", packs: ["4", "5", "6", "8", "12", "16", "20", "30"], price: 954.54},
  {id: "agrippina", sec: "grocery", brand: "Агриппина", name: "«Агриппина»", vols: ["0,22"], unit: "кг", packs: ["30"], price: 1354.2},
  {id: "kuntsevo-3", sec: "grocery", brand: "Кунцево", name: "«Кунцево»", vols: ["0,02"], unit: "кг", packs: ["30"], price: 411.0},
  {id: "voyal", sec: "grocery", brand: "Воял", name: "«Воял»", vols: ["0,25"], unit: "кг", packs: ["6"], price: 818.4},
  {id: "potapych", sec: "grocery", brand: "Потапычъ", name: "«Потапычъ»", vols: ["0,25"], unit: "кг", packs: ["12"], price: 2403.72},
  {id: "garnets-2", sec: "grocery", brand: "Гарнец", name: "«Гарнец»", vols: ["0,2", "0,3", "0,6"], unit: "кг", packs: ["3", "6"], price: 977.88},
  {id: "testov", sec: "grocery", brand: "ТЕСТОВЪ", name: "«ТЕСТОВЪ»", vols: ["0,2", "0,25", "0,4"], unit: "кг", packs: ["6"], price: 533.58},
  {id: "miratorg", sec: "frozen-products", sub: "myaso", brand: "Мираторг", name: "Мираторг", vols: ["1"], unit: "кг", packs: ["10"], price: 1900.0},
  {id: "ip-arutyunyan-g-k", sec: "frozen-products", sub: "myaso", brand: "ИП Арутюнян Г.К.", name: "ИП Арутюнян Г.К.", vols: ["1"], unit: "кг", packs: ["17"], price: 2992.0},
  {id: "elitgrupp-invest", sec: "frozen-products", sub: "myaso", brand: "ЭЛИТГРУПП ИНВЕСТ", name: "ЭЛИТГРУПП ИНВЕСТ", vols: ["1"], unit: "кг", packs: ["20"], price: 15730.0},
  {id: "nmk", sec: "frozen-products", sub: "myaso", brand: "НМК", name: "НМК", vols: ["1"], unit: "кг", packs: ["20"], price: 13530.0},
  {id: "ishimskiy-mk", sec: "frozen-products", sub: "myaso", brand: "Ишимский МК", name: "Ишимский МК", vols: ["1"], unit: "кг", packs: ["9", "1"], price: 1925.0},
  {id: "iwp", sec: "frozen-products", sub: "myaso", brand: "IWP", name: "IWP", vols: ["1"], unit: "кг", packs: ["10"], price: 7865.0},
  {id: "myasnoy-hit", sec: "frozen-products", sub: "myaso", brand: "Мясной хит", name: "Мясной хит", vols: ["1"], unit: "кг", packs: ["5"], price: 1292.0},
  {id: "sibagro", sec: "frozen-products", sub: "myaso", brand: "СИБАГРО", name: "СИБАГРО", vols: ["1"], unit: "кг", packs: ["9", "1"], price: 825.0},
  {id: "indeya", sec: "frozen-products", sub: "myaso", brand: "Индея", name: "Индея", vols: ["1"], unit: "кг", packs: ["9", "1"], price: 6246.0},
  {id: "vodnyy-mir", sec: "frozen-products", sub: "myaso", brand: "Водный мир", name: "Водный мир", vols: ["1"], unit: "кг", packs: ["12"], price: 6200.0},
  {id: "bogorodskie-delikatesy", sec: "frozen-products", sub: "myaso", brand: "Богородские Деликатесы", name: "Богородские Деликатесы", vols: ["1"], unit: "кг", packs: ["19", "1", "00"], price: 5600.0},
  {id: "vesovaya-produktsiya", sec: "frozen-products", brand: "Весовая Продукция", name: "Весовая Продукция", vols: ["1000", "2500"], unit: "г", packs: ["5", "7", "8", "9", "10", "12", "12,5"], price: 1133.0},
  {id: "4-sezona", sec: "frozen-products", brand: "4 Сезона", name: "4 Сезона", vols: ["300", "400", "450", "600", "900"], unit: "г", packs: ["10", "12", "20"], price: 1367.8},
  {id: "ilinka", sec: "frozen-products", brand: "Ильинка", name: "Ильинка", vols: ["250", "400", "1000"], unit: "г", packs: ["10", "13", "16"], price: 1476.16},
  {id: "planeta-leta", sec: "frozen-products", brand: "ПЛАНЕТА ЛЕТА", name: "ПЛАНЕТА ЛЕТА", vols: ["300", "400"], unit: "г", packs: ["10", "18"], price: 737.0},
  {id: "bystro-vkusno", sec: "frozen-products", brand: "БЫСТРО&ВКУСНО", name: "БЫСТРО&ВКУСНО", vols: ["90", "120", "200", "240", "245", "250", "270", "280", "300"], unit: "г", packs: ["4", "8", "10", "12", "25"], price: 820.4},
  {id: "nashi-traditsii", sec: "frozen-products", brand: "Наши Традиции", name: "Наши Традиции", vols: ["450", "480", "500", "800", "900", "950", "970", "1000"], unit: "г", packs: ["5", "6", "8", "10", "12", "15", "20"], price: 660.0},
  {id: "rastorguevskiy", sec: "frozen-products", brand: "Расторгуевский", name: "Расторгуевский", vols: ["300", "350", "405", "450", "700", "720", "800", "1000", "1200"], unit: "г", packs: ["3", "5", "6", "8", "12"], price: 908.34},
  {id: "salnikov", sec: "frozen-products", brand: "Сальников", name: "Сальников", vols: ["375", "450", "800", "900", "1000", "2000"], unit: "г", packs: ["4", "6", "9", "12"], price: 917.1},
  {id: "sibirskiy-gurman", sec: "frozen-products", brand: "Сибирский Гурман", name: "Сибирский Гурман", vols: ["210", "240", "275", "300", "330", "360", "400", "420", "800", "1000"], unit: "г", packs: ["6", "8", "9", "10", "12"], price: 542.58},
  {id: "domashnie-sekrety", sec: "frozen-products", brand: "Домашние Секреты", name: "Домашние Секреты", vols: ["350", "450", "800", "950"], unit: "г", packs: ["6", "8", "10", "12"], price: 904.5},
  {id: "uralskie-pelmeni", sec: "frozen-products", brand: "Уральские Пельмени", name: "Уральские Пельмени", vols: ["350", "400", "450", "500", "700", "750", "800", "900", "1000", "5000"], unit: "г", packs: ["5", "6", "10", "12", "13"], price: 989.52},
  {id: "goryachaya-shtuchka", sec: "frozen-products", brand: "Горячая Штучка", name: "Горячая Штучка", vols: ["90-6000"], unit: "г", packs: ["1", "4", "6", "8", "10", "12", "14", "16", "24"], price: 289.0},
  {id: "myasnaya-yarmarka", sec: "frozen-products", brand: "Мясная Ярмарка", name: "Мясная Ярмарка", vols: ["800", "900"], unit: "г", packs: ["6", "8"], price: 1225.2},
  {id: "edim-doma", sec: "frozen-products", brand: "Едим Дома", name: "Едим Дома", vols: ["360", "500"], unit: "г", packs: ["7", "8"], price: 662.97},
  {id: "chipsy-lay-s", sec: "snacks", sub: "wholesale-chips", brand: "LAY’S", name: "Чипсы «LAY’S»", vols: ["37", "70", "85", "140", "225"], unit: "г", packs: ["14", "15", "19", "25", "36"], price: 1754.4},
  {id: "chipsy-pringles", sec: "snacks", sub: "wholesale-chips", brand: "Pringles", name: "Чипсы «Pringles»", vols: ["165"], unit: "г", packs: ["19"], price: 5301.0},
  {id: "chipsy-russkaya-kartoshka", sec: "snacks", sub: "wholesale-chips", brand: "Русская Картошка", name: "Чипсы «Русская Картошка»", vols: ["70", "80", "105", "120", "140"], unit: "г", packs: ["9", "10", "16", "20", "28"], price: 1367.3},
  {id: "chipsy-chitos", sec: "snacks", sub: "wholesale-chips", brand: "Читос", name: "Чипсы «Читос»", vols: ["50", "85"], unit: "г", packs: ["16", "24"], price: 1337.04},
  {id: "chipsy-binggrae-bingre", sec: "snacks", sub: "wholesale-chips", brand: "Binggrae (Бингрэ)", name: "Чипсы «Binggrae (Бингрэ)»", vols: ["40", "50", "80", "130"], unit: "г", packs: ["9", "14", "24"], price: 1192.41},
  {id: "chipsy-lorenz", sec: "snacks", sub: "wholesale-chips", brand: "LORENZ", name: "Чипсы «LORENZ»", vols: ["70", "100", "130", "150"], unit: "г", packs: ["14", "18", "20", "25"], price: 1171.94},
  {id: "chipsy-bon-giorno", sec: "snacks", sub: "wholesale-chips", brand: "BON GIORNO", name: "Чипсы «BON GIORNO»", vols: ["80"], unit: "г", packs: ["24"], price: 2003.52},
  {id: "chipsy-fry-s", sec: "snacks", sub: "wholesale-chips", brand: "FRY’S", name: "Чипсы «FRY’S»", vols: ["35", "70", "130"], unit: "г", packs: ["15", "24"], price: 542.55},
  {id: "chipsy-eu-patsan", sec: "snacks", sub: "wholesale-chips", brand: "ЭУ, ПАЦАН", name: "Чипсы «ЭУ, ПАЦАН»", vols: ["50"], unit: "г", packs: ["24"], price: 1486.32},
  {id: "chipsy-easy-peasy", sec: "snacks", sub: "wholesale-chips", brand: "EASY PEASY", name: "Чипсы «EASY PEASY»", vols: ["50"], unit: "г", packs: ["24"], price: 1351.2},
  {id: "chipsy-lava-lava", sec: "snacks", sub: "wholesale-chips", brand: "LAVA LAVA", name: "Чипсы «LAVA LAVA»", vols: ["50"], unit: "г", packs: ["24"], price: 1351.2},
  {id: "chipsy-koronnye", sec: "snacks", sub: "wholesale-chips", brand: "Коронные", name: "Чипсы «Коронные»", vols: ["500"], unit: "г", packs: ["6"], price: 1023.0},
  {id: "chipsy-kracks", sec: "snacks", sub: "wholesale-chips", brand: "Kracks", name: "Чипсы «Kracks»", vols: ["160"], unit: "г", packs: ["14"], price: 3197.6},
  {id: "vatnye-diski", sec: "non-food-products", brand: "Ватные диски", name: "Ватные диски", packs: ["25", "70", "80", "100", "120", "140"], price: 3269.28},
  {id: "vatnye-palochki", sec: "non-food-products", brand: "Ватные палочки", name: "Ватные палочки", packs: ["56", "100", "160", "200", "300", "350"], price: 1481.88},
  {id: "platochki", sec: "non-food-products", brand: "Платочки", name: "Платочки", packs: ["10", "80", "100"], price: 1920.6},
  {id: "prokladki", sec: "non-food-products", brand: "Прокладки", name: "Прокладки", packs: ["12", "15", "16", "20", "60", "70"], price: 1559.0},
  {id: "salfetki", sec: "non-food-products", brand: "Салфетки", name: "Салфетки", packs: ["10", "20", "100", "150"], price: 3755.28},
  {id: "tampony", sec: "non-food-products", brand: "Тампоны", name: "Тампоны", packs: ["8", "16"], price: 4980.8},
  {id: "vlazhnaya-tualetnaya-bumaga", sec: "non-food-products", brand: "Влажная туалетная бумага", name: "Влажная туалетная бумага", packs: ["42"], price: 3004.0},
  {id: "pelenki", sec: "non-food-products", brand: "Пеленки", name: "Пеленки", packs: ["4", "6", "8", "12", "14", "18", "24"], price: 2723.04},
  {id: "podguzniki", sec: "non-food-products", brand: "Подгузники", name: "Подгузники", packs: ["1", "10", "12", "25", "40", "72"], price: 718.4},
  {id: "gel-dlya-dusha", sec: "non-food-products", brand: "Гель для душа", name: "Гель для душа", packs: ["6", "8", "12", "20"], price: 1617.0},
  {id: "dezodorant", sec: "non-food-products", brand: "Дезодорант", name: "Дезодорант", packs: ["6", "12"], price: 806.64},
  {id: "mylo", sec: "non-food-products", brand: "Мыло", name: "Мыло", packs: ["6", "12", "48"], price: 582.48},
  {id: "shampun", sec: "non-food-products", brand: "Шампунь", name: "Шампунь", packs: ["6", "8", "10", "12"], price: 995.34},
  {id: "zubnaya-pasta", sec: "non-food-products", brand: "Зубная паста", name: "Зубная паста", packs: ["12", "24", "30"], price: 683.5},
  {id: "krem", sec: "non-food-products", brand: "Крем", name: "Крем", packs: ["8", "12", "20", "24", "32"], price: 658.08},
  {id: "sredstvo-dlya-mebeli", sec: "non-food-products", brand: "Средство для мебели", name: "Средство для мебели", packs: ["8", "15", "16"], price: 1241.44},
  {id: "sredstvo-dlya-polov", sec: "non-food-products", brand: "Средство для полов", name: "Средство для полов", packs: ["4", "6", "8", "12", "14"], price: 978.7},
  {id: "sredstvo-dlya-posudy", sec: "non-food-products", brand: "Средство для посуды", name: "Средство для посуды", packs: ["4", "8", "12"], price: 581.04},
  {id: "sredstvo-dlya-kuhni", sec: "non-food-products", brand: "Средство для кухни", name: "Средство для кухни", packs: ["6", "8", "15", "20", "40"], price: 1219.52},
  {id: "credstva-dlya-stirki", sec: "non-food-products", brand: "Cредства для стирки", name: "Cредства для стирки", packs: ["4", "6", "8"], price: 901.14},
  {id: "credstva-chistki-kovrov", sec: "non-food-products", brand: "Cредства чистки ковров", name: "Cредства чистки ковров", packs: ["8"], price: 1464.4},
  {id: "dezinfitsiruyuschie-sredstva", sec: "non-food-products", brand: "Дезинфицирующие средства", name: "Дезинфицирующие средства", packs: ["60"], price: 4456.2},
  {id: "ochistitel-stekol", sec: "non-food-products", brand: "Очиститель стекол", name: "Очиститель стекол", packs: ["8"], price: 819.12},
  {id: "avtohimiya", sec: "non-food-products", brand: "Автохимия", name: "Автохимия", packs: ["12", "16"], price: 1754.25},
  {id: "aromatizatory", sec: "non-food-products", brand: "Ароматизаторы", name: "Ароматизаторы", packs: ["12", "16", "18"], price: 2024.48},
  {id: "dlya-bani", sec: "non-food-products", brand: "Для бани", name: "Для бани", packs: ["40"], price: 3596.4},
  {id: "bumaga-ofisnaya", sec: "non-food-products", brand: "Бумага офисная", name: "Бумага офисная", packs: ["50"], price: 16980.0},
  {id: "chekovaya-lenta", sec: "non-food-products", brand: "Чековая лента", name: "Чековая лента", packs: ["72", "240"], price: 6170.4},
  {id: "meshki-dlya-musora", sec: "non-food-products", brand: "Мешки для мусора", name: "Мешки для мусора", packs: ["30"], price: 1792.5},
  {id: "detskoe-pitanie-chernogolovka", sec: "childens-goods", sub: "child-nutrition", brand: "Черноголовка", name: "Детское питание «Черноголовка»", vols: ["85", "200"], unit: "г", packs: ["12", "27"], price: 510.36},
  {id: "detskoe-pitanie-gipopo", sec: "childens-goods", sub: "child-nutrition", brand: "Гипопо", name: "Детское питание «Гипопо»", vols: ["20", "80", "90", "170", "200"], unit: "г", packs: ["6", "8"], price: 234.78},
  {id: "detskoe-pitanie-sady-pridonya", sec: "childens-goods", sub: "child-nutrition", brand: "Сады Придонья", name: "Детское питание «Сады Придонья»", vols: ["80", "120", "125", "170"], unit: "г", packs: ["12", "18"], price: 341.52},
  {id: "detskoe-pitanie-agusha", sec: "childens-goods", sub: "child-nutrition", brand: "Агуша", name: "Детское питание «Агуша»", vols: ["190", "200", "300", "330", "500", "925"], unit: "г", packs: ["6", "10", "12", "18"], price: 380.94},
  {id: "detskoe-pitanie-babushkino-lukoshko", sec: "childens-goods", sub: "child-nutrition", brand: "Бабушкино Лукошко", name: "Детское питание «Бабушкино Лукошко»", vols: ["20", "90", "100", "200"], unit: "г", packs: ["6", "8", "12", "18"], price: 393.9},
  {id: "detskoe-pitanie-kogda-ya-vyrastu", sec: "childens-goods", sub: "child-nutrition", brand: "Когда я вырасту", name: "Детское питание «Когда я вырасту»", vols: ["85", "120", "150", "175", "180", "200", "220"], unit: "г", packs: ["6", "8", "9", "12", "20", "24"], price: 416.34},
  {id: "detskoe-pitanie-fruto-nyanya", sec: "childens-goods", sub: "child-nutrition", brand: "Фруто Няня", name: "Детское питание «Фруто Няня»", vols: ["100", "130", "200", "500"], unit: "г", packs: ["6", "12", "18"], price: 680.52},
  {id: "detskoe-pitanie-bebi-premium", sec: "childens-goods", sub: "child-nutrition", brand: "Беби Премиум", name: "Детское питание «Беби Премиум»", vols: ["200"], unit: "г", packs: ["9"], price: 1852.65},
  {id: "detskoe-pitanie-gerber", sec: "childens-goods", sub: "child-nutrition", brand: "Гербер", name: "Детское питание «Гербер»", vols: ["180"], unit: "г", packs: ["6", "7", "9", "12"], price: 852.32},
  {id: "detskoe-pitanie-malyutka", sec: "childens-goods", sub: "child-nutrition", brand: "Малютка", name: "Детское питание «Малютка»", vols: ["200", "220", "600", "900", "1200"], unit: "г", packs: ["3", "5", "6", "10"], price: 1146.0},
  {id: "detskoe-pitanie-nestle", sec: "childens-goods", sub: "child-nutrition", brand: "Нестле", name: "Детское питание «Нестле»", vols: ["90", "190", "200"], unit: "г", packs: ["8", "9"], price: 675.28},
  {id: "detskoe-pitanie-malysh", sec: "childens-goods", sub: "child-nutrition", brand: "Малыш", name: "Детское питание «Малыш»", vols: ["350"], unit: "г", packs: ["12"], price: 4967.28},
  {id: "detskoe-pitanie-nutrilon", sec: "childens-goods", sub: "child-nutrition", brand: "Нутрилон", name: "Детское питание «Нутрилон»", vols: ["600", "1200"], unit: "г", packs: ["5", "6", "24"], price: 5314.74},
]

// ---------- главная ----------

/** Вырезанные товары с первого экрана оригинала: едут каруселью при прокрутке. */
export const sbStage = [
  { img: 'dobryy-cola.png', label: 'Кола «Добрый»', to: { item: 'kola-dobryy' }, w: 0.5 },
  { img: 'choco-pie.png', label: 'Choco-Pie', to: { item: 'chokopay-originalnyy' }, w: 1 },
  { img: 'lays.png', label: 'Чипсы LAY’S', to: { item: 'chipsy-lay-s' }, w: 0.82 },
  { img: 'milkis.png', label: 'Milkis', to: { item: 'napitok-milkis-so-vkusom-klubniki' }, w: 0.58 },
  { img: 'babyfox.png', label: 'Мармелад babyfox', to: { sec: 'confectionery', sub: 'candies-wholesale' }, w: 0.86 },
  { img: 'maslo.png', label: 'Подсолнечное масло', to: { sec: 'oil-and-fat-products', sub: 'sunflower' }, w: 0.36 },
] as const

/** Факты с первого экрана оригинала — сменяются по мере прокрутки. */
export const sbFacts = [
  { big: '10 000+', text: 'позиций на складе в Новосибирске — закупка под ключ' },
  { big: 'от объёма', text: 'скидка и индивидуальные цены, ежемесячные промо-акции' },
  { big: 'под ключ', text: 'формируем и грузим сборные контейнеры своими силами' },
  { big: 'с 2012', text: 'года на рынке, работаем по договору и через ЭДО' },
]

/** «Часто заказывают» — как на главной оригинала, картинки оттуда же. */
export const sbPopular = [
  { sec: 'drinks', sub: 'juices', label: 'Соки', img: `${U}/2026/02/images-Photoroom.png` },
  { sec: 'drinks', sub: 'energy', label: 'Энергетики', img: `${U}/2026/02/istockphoto-171299489-612x612-no-bg-preview-carve.photos.png` },
  { sec: 'low-alcohol-drinks', sub: 'beer', label: 'Пиво', img: `${U}/2026/02/Без-названия-1-Photoroom.png` },
  { sec: 'snacks', sub: 'wholesale-chips', label: 'Чипсы', img: `${U}/2026/02/images-3-Photoroom.png` },
  { sec: 'confectionery', sub: 'choco-pie', label: 'Choco-Pie', img: `${U}/2026/03/Choco-Pie.png` },
  { sec: 'oil-and-fat-products', sub: 'sunflower', label: 'Масло подсолнечное', img: `${U}/2026/02/Без-названия-Photoroom.png` },
  { sec: 'frozen-products', sub: 'myaso', label: 'Мясо', img: `${U}/2026/03/405497191_c9bfae04-3ba6-44c1-9634-51eaf8795101-Photoroom.png` },
  { sec: 'drinks', sub: 'dobryy', label: 'Напитки «Добрый»', img: `${U}/2026/03/Напитки-Добрый.png` },
  { sec: 'drinks', sub: 'chernogolovka', label: 'Напитки «Черноголовка»', img: `${U}/2026/03/Напитки-_Черноголовка_.png` },
  { sec: 'drinks', sub: 'milkis', label: 'Milkis', img: `${U}/2026/03/Милкис.png` },
  { sec: 'confectionery', sub: 'cookie', label: 'Печенье', img: `${U}/2026/02/241505A0-1346-4089-BCF7-7F7FF0854142-scaled-no-bg-preview-carve.photos.png` },
  { sec: 'grocery', sub: 'sugar', label: 'Сахар', img: `${U}/2026/02/images-4-no-bg-preview-carve.photos.png` },
  { sec: 'grocery', sub: 'flour', label: 'Мука', img: `${U}/2026/02/FygQ3oPUoRB4IZo41hkiLigyy4PYNYYTcoCoG2pl-no-bg-preview-carve.photos.png` },
  { sec: 'grocery', sub: 'cereal', label: 'Крупы', img: `${U}/2026/02/images-5-no-bg-preview-carve.photos.png` },
  { sec: 'childens-goods', sub: 'child-nutrition', label: 'Детское питание', img: `${U}/2026/02/ZtNbYYzcNnTKYVFUoR5tjPtqd2xOvSK0TyytRWEa-no-bg-preview-carve.photos.png` },
] as const

/** Популярные запросы из поиска оригинала. */
export const sbQueries = ['Соль', 'Энергетики', 'Печенье', 'Пиво', 'Сухие корма']

export const sbPartners = [
  '2023/07/Изображение-WhatsApp-2023-06-30-в-15.26.52.jpg',
  '2023/06/brand-2.png',
  '2023/07/милкис-лого.webp',
  '2025/03/экспресс-кубань.jpeg',
  '2023/06/partner-4.png',
  '2023/06/partner-5.png',
  '2025/11/logo.svg',
  '2023/07/Изображение-WhatsApp-2023-06-30-в-15.26.39.jpg',
  '2023/07/Изображение-WhatsApp-2023-07-05-в-15.22.48.webp',
  '2023/06/добрый-лого.webp',
  '2023/07/лого.webp',
  '2023/07/лого-лука.webp',
  '2023/07/добродея-лого.webp',
  '2024/10/трехсосенское.jpeg',
  '2024/10/Белла.png',
  '2025/11/ce6qv3a92qwgl01g77zynvxir2ko522a.png',
  '2024/10/юнилевер.png',
  '2025/11/logo-1.svg',
  '2025/11/logo_2.png',
].map((f) => `${U}/${f}`)

/** Бренды из текста главной оригинала: прямые контракты. */
export const sbBrands = ['Lotte', 'Coca-Cola', 'PepsiCo', 'КДВ', 'Приправыч', 'Сады Придонья']

// ---------- условия ----------

export const SB_MIN_ORDER = 100_000

export const sbAnnouncement =
  'Сбор и отгрузка заказа сейчас занимают до 3 дней: ЭТРН, ЕГАИС, Честный знак, Меркурий и ЭДО стали обязательными, обращений стало больше.'

/** «Как мы работаем» со страницы «Доставка и оплата». */
export const sbSteps = [
  { title: 'Договор', text: 'Подписываем договор и принимаем заказ — по прайсу или по вашему списку.' },
  { title: 'Вес и объём', text: 'Согласовываем вес и объём поставки, собираем сборный контейнер.' },
  { title: 'Счёт', text: 'Выставляем счёт. Условия оплаты обсуждаем с каждым клиентом отдельно.' },
  { title: 'Погрузка', text: 'Выбираете день погрузки и способ доставки: сами, до ТК или до вашего склада.' },
]

export const sbCompliance = ['ЭДО', 'ЕГАИС', 'Честный знак', 'Меркурий', 'ЭТРН']

export const sbDelivery = [
  { title: 'Самовывоз со склада', text: 'Северный проезд, 33. Погрузку делаем своими силами.', price: 'бесплатно' },
  { title: 'До транспортной компании', text: 'Довезём до ТК в Новосибирске, упаковка и погрузка включены.', price: '0 ₽ от 100 000 ₽' },
  { title: 'До вашего склада в Новосибирске', text: 'Привезём «до двери» в день, который выберете.', price: '0 ₽ от 100 000 ₽' },
  { title: 'Якутия и Дальний Восток', text: 'Проверенные ТК, контроль температуры, северный завоз.', price: 'по расчёту' },
]

export const sbCities = [
  { city: 'Якутск', address: 'ул. Кржижановского, 114/3', zip: '677004', phone: '+7 (4112) 35-90-95', phoneHref: 'tel:+74112359095' },
  { city: 'Нерюнгри', address: 'ул. Дружбы Народов, 9', zip: '678960' },
  { city: 'Мирный', address: 'ул. Тихонова, 3', zip: '678175' },
  { city: 'Алдан', address: 'ул. 50 лет ВЛКСМ, 32', zip: '678900' },
  { city: 'Ленск', address: 'ул. Орджоникидзе, 11', zip: '678144' },
  { city: 'Удачный', address: 'Центральная площадь, 3', zip: '678188' },
  { city: 'Вилюйск', address: 'ул. Ленина, 50', zip: '678200' },
  { city: 'Нюрба', address: 'ул. Степана Васильева, 113/1', zip: '678450' },
  { city: 'Олёкминск', address: 'ул. Бровина, 40', zip: '678100' },
]

export const sbContacts = {
  original: 'https://sibirtreid.ru/',
  phone: '+7 (383) 248-33-00',
  phoneHref: 'tel:+73832483300',
  phones: [
    { label: '+7 (383) 248-33-00', note: 'офис в Новосибирске', href: 'tel:+73832483300' },
    { label: '+7 (800) 600-08-64', note: 'бесплатно по России', href: 'tel:+78006000864' },
    { label: '+7 (4112) 35-90-95', note: 'колл-центр в Якутске', href: 'tel:+74112359095' },
  ],
  email: 'info@sibirtreid.ru',
  telegram: 'https://t.me/+79039308715',
  whatsapp: 'https://api.whatsapp.com/send/?phone=79039308715',
  max: 'https://max.ru/u/f9LHodD0cOIrUGTdQWeXWIWbCQiAMgGa1DrRRFrjEMSGd9Y2OnKMiluspjY',
  wb: 'https://www.wildberries.ru/seller/1401425',
  address: 'Новосибирск, Северный проезд, 33, 3 этаж, офис 301Д',
  zip: '630088',
  post: '630119, Новосибирск, а/я 99',
  hours: 'пн–пт 9:00–17:00',
  tz: 'МСК+4',
  departments: [
    { title: 'Отдел продаж', person: 'Александр', phone: '+7 (903) 930-88-15', href: 'tel:+79039308815' },
    { title: 'Отдел закупок', person: 'Ольга Анатольевна', phone: '+7 (903) 930-87-59', href: 'tel:+79039308759' },
    { title: 'Отдел логистики', person: 'Анатолий', phone: '+7 (913) 389-91-45', href: 'tel:+79133899145' },
    { title: 'Бухгалтерия', person: '', phone: '+7 (903) 930-86-92', href: 'tel:+79039308692' },
    { title: 'Директор', person: 'Юсиф Аятдинович', phone: '+7 (923) 151-56-65', href: 'tel:+79231515665' },
  ],
}

export const sbRequisites = [
  { k: 'Полное название', v: 'Общество с ограниченной ответственностью «СибирьТрейд»' },
  { k: 'ИНН', v: '5403078104' },
  { k: 'КПП', v: '540301001' },
  { k: 'ОГРН', v: '1235400020019' },
  { k: 'Юридический адрес', v: '630088, Новосибирская область, г. Новосибирск, проезд Северный, д. 33, офис 301Д' },
  { k: 'Расчётный счёт', v: '40702810523000015925' },
  { k: 'Банк', v: 'Филиал «Новосибирский» АО «Альфа-Банк»' },
  { k: 'БИК', v: '045004774' },
  { k: 'Корр. счёт', v: '30101810600000000774' },
]

export const sbPosts = [
  { date: '2025-12-29', title: 'Как создать идеальный ассортимент снеков для бара или магазина', slug: 'kak-sozdat-idealnyy-assortiment-snekov-dlya-bara-ili-magazina', sec: 'snacks' },
  { date: '2025-05-22', title: 'Как выбрать кофе под ваш бизнес', slug: 'kak-vybrat-kofe-pod-vash-biznes', sec: 'coffee-tea' },
  { date: '2025-05-22', title: 'Как выбрать закуски к пиву', slug: 'kak-vybrat-zakuski-k-pivu', sec: 'snacks' },
  { date: '2025-04-01', title: 'Какие хозтовары должны быть в каждом доме', slug: 'kakie-hoztovary-dolzhny-byt-v-kazhdom-dome', sec: 'non-food-products' },
  { date: '2024-10-12', title: 'Почему оптовые поставки продуктов питания — это ваш ключ к успеху', slug: 'pochemu-optovye-postavki-produktov-pitaniya-eto-vash-klyuch-k-uspehu', sec: 'grocery' },
  { date: '2024-10-12', title: 'Поставщики продуктов для ресторанов: как выбрать лучших партнёров', slug: 'postavshchiki-produktov-dlya-restoranov-kak-vybrat-luchshih-partnerov-dlya-vashego-biznesa', sec: 'frozen-products' },
  { date: '2024-10-12', title: 'Как выбрать надёжных поставщиков продуктов для магазинов', slug: 'kak-vybrat-nadezhnyh-postavshchikov-produktov-dlya-magazinov', sec: 'drinks' },
  { date: '2024-07-30', title: 'Основные принципы правильного хранения замороженных продуктов', slug: 'osnovnye-principy-pravilnogo-hraneniya-zamorozhennyh-produktov', sec: 'frozen-products' },
  { date: '2024-07-30', title: 'Как понять, что вы купили некачественный кофе', slug: 'kak-ponyat-chto-vy-kupili-nekachestvennyy-kofe', sec: 'coffee-tea' },
  { date: '2024-07-30', title: 'Чай: источник пользы и удовольствия, но с ограничениями', slug: 'chay-istochnik-polzy-i-udovolstviya-no-s-ogranicheniyami', sec: 'coffee-tea' },
  { date: '2024-10-12', title: 'Как выбрать лучшие игрушки для детей', slug: 'kak-vybrat-luchshie-igrushki-dlya-detey', sec: 'childens-goods' },
  { date: '2024-07-30', title: 'Как выбрать игрушки для котят', slug: 'kak-vybrat-igrushki-dlya-kotyat', sec: 'goods-for-pets' },
] as const

export const sbRegions = ['Новосибирск', 'Якутск', 'Нерюнгри', 'Мирный', 'Алдан', 'Ленск', 'Удачный', 'Вилюйск', 'Нюрба', 'Олёкминск', 'Другой регион']

// ---------- пути и поиск ----------

const BASE = '/redesign/sibirtreid'
export const sbPath = (sub = '') => `${BASE}${sub}`
export const sbImg = (file: string) => `${BASE}/img/${file}`
export const sbCatalogPath = (sec?: string, sub?: string) =>
  sbPath('/catalog' + (sec ? `/${sec}` : '') + (sub ? `/${sub}` : ''))

export const sbFind = (id: string) => sbItems.find((i) => i.id === id)
export const sbSection = (id: string) => sbSections.find((s) => s.id === id)
export const sbSub = (sec: string, sub: string) => sbSection(sec)?.subs.find((s) => s.id === sub)
export const sbOf = (sec: string, sub?: string) =>
  sbItems.filter((i) => i.sec === sec && (!sub || i.sub === sub))
export const sbCount = (sec: string, sub?: string) => sbOf(sec, sub).length
export const sbFrom = (list: SbItem[]) => (list.length ? Math.min(...list.map((i) => i.price)) : 0)
export const sbMin = (item: SbItem) => item.min ?? 10

const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е').replace(/[«»"’']/g, '')

/** Поиск по позициям и подразделам — для строки в шапке. */
export const sbSearch = (q: string) => {
  const n = norm(q.trim())
  if (n.length < 2) return { items: [] as SbItem[], subs: [] as { sec: SbSection; sub: SbSub }[] }
  const subs = sbSections.flatMap((sec) =>
    sec.subs.filter((s) => norm(s.label).includes(n) || norm(sec.label).includes(n)).map((sub) => ({ sec, sub })),
  )
  const items = sbItems.filter((i) => norm(`${i.brand} ${i.name}`).includes(n))
  return { items, subs }
}

// ---------- деньги и подписи ----------

const rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
const kop = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Целые рубли — для шапки и итогов, чтобы ширина кнопок не прыгала. */
export const sbRub = (value: number) => `${rub.format(Math.round(value))} ₽`
/** С копейками, всегда двумя цифрами — для цены упаковки. */
export const sbKop = (value: number) =>
  Number.isInteger(value) ? sbRub(value) : `${kop.format(value)} ₽`

const UNITS: Record<string, string> = { л: 'л', кг: 'кг', г: 'г' }

/** «0,25 · 0,33 · 0,5 л», длинные списки — диапазоном «0,25–5 л». */
export const sbVols = (item: SbItem, max = 5) => {
  if (!item.vols?.length) return ''
  const unit = UNITS[item.unit ?? ''] ?? ''
  const v = item.vols.map((x) => x.replace('-', '–'))
  if (v.length > max) return `${v[0]}–${v[v.length - 1]} ${unit}`.trim()
  return `${v.join(' · ')} ${unit}`.trim()
}
export const sbVolLabel = (item: SbItem) =>
  item.unit === 'л' ? 'Объём' : 'Вес'
export const sbPacks = (item: SbItem) =>
  item.packs?.length ? `${item.packs.join(' / ')} ${item.box ? 'кор.' : 'шт'}` : ''

export const sbPlural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}
export const sbPositions = (n: number) => `${n} ${sbPlural(n, 'позиция', 'позиции', 'позиций')}`
export const sbPacksWord = (n: number) => `${n} ${sbPlural(n, 'упаковка', 'упаковки', 'упаковок')}`

export const sbDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
