// Концепт редизайна baltikprodukt.ru (ООО «Балтик Продукт», рыбная база в Туле).
// Данные — прайс-таблицы 12 разделов сайта, сняты 31.10.2026: 354 позиции, цены «опт» за кг или штуку,
// стоимость коробки, производитель, примечания («ожидается», «под заказ», «74 от 1 кор»).
// Фото товаров на сайте есть у 5 позиций, остальное — заглушка; баннеры и фото разделов скопированы
// в public/redesign/baltikprodukt/img и ужаты, чтобы концепт не грузил 2-мегабайтные баннеры оригинала.

export type BpSectionId =
  | 'frozen'
  | 'fillet'
  | 'seafood'
  | 'salads'
  | 'dried'
  | 'smoked'
  | 'salted'
  | 'hot'
  | 'preserves'
  | 'beer'
  | 'caviar'
  | 'canned'

export interface BpSection {
  id: BpSectionId
  title: string
  full: string
  img: string
  count: number
}

export interface BpProduct {
  id: string
  section: BpSectionId
  name: string
  // kg — цена за кг, pc — за штуку/упаковку, bucket — за ведро
  kind: 'kg' | 'pc' | 'bucket'
  net?: string
  price: number | null
  // «74 от 1 кор» из примечания: цена штуки при покупке коробкой
  boxPrice?: number
  // в коробке: кг у весовых, штук у штучных
  pack?: number
  blocks?: string
  origin: string | null
  flag?: 'sale' | 'new' | 'order' | 'wait'
  img?: string
}

export type BpMode = 'opt' | 'retail'

export const bpSections: BpSection[] = [
  { id: 'frozen', title: 'Свежемороженая рыба', full: 'Свежемороженая рыба', img: 's-frozen', count: 93 },
  { id: 'fillet', title: 'Филе, фарш, стейки', full: 'Филе рыбное, фарш, стейки, полуфабрикаты, субпродукты, фасованная рыба', img: 's-fillet', count: 40 },
  { id: 'seafood', title: 'Креветки и морепродукты', full: 'Креветки, крабы, морепродукты, деликатесы', img: 's-shrimp', count: 36 },
  { id: 'salads', title: 'Салаты', full: 'Салаты рыбные и овощные', img: 's-salads', count: 8 },
  { id: 'dried', title: 'Вяленая и сушёная', full: 'Вяленая, сушеная рыба', img: 's-dried', count: 9 },
  { id: 'smoked', title: 'Холодное копчение', full: 'Копченая рыба', img: 's-smoked', count: 28 },
  { id: 'salted', title: 'Солёная рыба', full: 'Соленая рыба', img: 's-salted', count: 18 },
  { id: 'hot', title: 'Горячее копчение', full: 'Рыба горячего копчения', img: 's-hot', count: 15 },
  { id: 'preserves', title: 'Пресервы', full: 'Пресервы из рыбы и морепродуктов', img: 's-preserves', count: 33 },
  { id: 'beer', title: 'Вакуум и к пиву', full: 'Вакуумная упаковка, наборы к пиву', img: 's-beer', count: 11 },
  { id: 'caviar', title: 'Икра', full: 'Икра', img: 's-caviar', count: 26 },
  { id: 'canned', title: 'Консервы', full: 'Рыбные консервы', img: 's-canned', count: 37 },
]

export const bpProducts: BpProduct[] = [
  {"id":"frozen-1","section":"frozen","name":"Горбуша н/р крупная япономорская «дальмос»","kind":"kg","price":780,"pack":20,"blocks":"2 × 10 кг","origin":"Дальний Восток"},
  {"id":"frozen-2","section":"frozen","name":"Горбуша потрошеная без головы (сахалин 2026)","kind":"kg","price":1020,"pack":20,"blocks":"2 × 10 кг","origin":"Россия"},
  {"id":"frozen-3","section":"frozen","name":"Горбуша потрошеная без головы штучной зам-ки 0,8+ курильская","kind":"kg","price":950,"pack":28,"origin":"Дальний Восток"},
  {"id":"frozen-4","section":"frozen","name":"Дорадо целый 300-400","kind":"kg","price":970,"pack":5,"origin":"Турция"},
  {"id":"frozen-5","section":"frozen","name":"Зубатка пестрая стейк (хвостовая часть)","kind":"kg","price":200,"pack":7,"origin":"Мурманск"},
  {"id":"frozen-6","section":"frozen","name":"Зубатка пестрая стейк (центральная часть)","kind":"kg","price":510,"pack":7,"origin":"Мурманск"},
  {"id":"frozen-7","section":"frozen","name":"Зубатка полосатая","kind":"kg","price":370,"pack":30,"blocks":"2 × 15 кг","origin":"Мурманск"},
  {"id":"frozen-8","section":"frozen","name":"Зубатка полосатая потр. б/г шт.зам.","kind":"kg","price":345,"pack":7,"origin":"Мурманск"},
  {"id":"frozen-9","section":"frozen","name":"Зубатка полосатая стейк (центральная часть)","kind":"kg","price":420,"pack":7,"origin":"Узловая рыба"},
  {"id":"frozen-10","section":"frozen","name":"Зубатка синяя","kind":"kg","price":210,"pack":21,"origin":"Мурманск"},
  {"id":"frozen-11","section":"frozen","name":"Зубатка синяя стейк (хвостовая часть)","kind":"kg","price":135,"pack":7,"origin":"Узловая рыба"},
  {"id":"frozen-12","section":"frozen","name":"Зубатка синяя стейк (центральная часть)","kind":"kg","price":275,"pack":7,"origin":"Узловая рыба"},
  {"id":"frozen-13","section":"frozen","name":"Икра минтая ястычная зрелая","kind":"kg","price":450,"pack":22.5,"blocks":"3 × 7,5 кг","origin":"Дальний Восток"},
  {"id":"frozen-14","section":"frozen","name":"Икра минтая ястычная зрелая в/у","kind":"kg","price":470,"origin":"Узловая рыба"},
  {"id":"frozen-15","section":"frozen","name":"Икра минтая ястычная зрелая в/у крупная","kind":"kg","price":490,"origin":"Узловая рыба"},
  {"id":"frozen-16","section":"frozen","name":"Икра сельди бмрт анива","kind":"kg","price":800,"pack":25,"blocks":"2 × 12,5 кг","origin":"Дальний Восток"},
  {"id":"frozen-17","section":"frozen","name":"Икра сельди зрелая в/у","kind":"kg","price":875,"origin":"Узловая рыба"},
  {"id":"frozen-18","section":"frozen","name":"Кальмар тушка","kind":"kg","price":450,"pack":22,"blocks":"2 × 11 кг","origin":"Дальний Восток"},
  {"id":"frozen-19","section":"frozen","name":"Камбала б/г дальневосточная «l»","kind":"kg","price":325,"pack":20,"blocks":"2 × 10 кг","origin":"Дальний Восток"},
  {"id":"frozen-20","section":"frozen","name":"Камбала б/г дальневосточная 20+ штучной заморозки","kind":"kg","price":340,"pack":8,"origin":"Дальний Восток"},
  {"id":"frozen-21","section":"frozen","name":"Камбала ерш","kind":"kg","price":570,"origin":"Мурманск"},
  {"id":"frozen-22","section":"frozen","name":"Камбала неразделанная синекорая 30+ штучной заморозки","kind":"kg","price":275,"pack":9,"origin":"Дальний Восток"},
  {"id":"frozen-23","section":"frozen","name":"Камбала северная 0,3-0,5","kind":"kg","price":340,"pack":30,"blocks":"3 × 10 кг","origin":"Мурманск"},
  {"id":"frozen-24","section":"frozen","name":"Камбала северная 0,5-1,0 (орион)","kind":"kg","price":415,"pack":18,"blocks":"3 × 6 кг","origin":"Мурманск"},
  {"id":"frozen-25","section":"frozen","name":"Камбала северная 0,5-1,0 (пинро)","kind":"kg","price":415,"pack":30,"blocks":"2 × 15 кг","origin":"Мурманск"},
  {"id":"frozen-26","section":"frozen","name":"Камбала северная 0,5-1,0 (холмогоры)","kind":"kg","price":415,"origin":"Мурманск"},
  {"id":"frozen-27","section":"frozen","name":"Камбала тушка дальневосточная б/б 15+ штучной заморозки","kind":"kg","price":350,"pack":5,"origin":"Дальний Восток"},
  {"id":"frozen-28","section":"frozen","name":"Камбала тушка дальневосточная б/б 20+ штучной заморозки","kind":"kg","price":370,"pack":5,"origin":"Дальний Восток"},
  {"id":"frozen-29","section":"frozen","name":"Камбала тушка дальневосточная ж/п 15+ штучной заморозки","kind":"kg","price":350,"pack":5,"origin":"Дальний Восток"},
  {"id":"frozen-30","section":"frozen","name":"Камбала тушка дальневосточная ж/п 20+ штучной заморозки","kind":"kg","price":370,"pack":5,"origin":"Дальний Восток"},
  {"id":"frozen-31","section":"frozen","name":"Камбала тушка палтусовидная 15+ штучной заморозки","kind":"kg","price":350,"pack":5,"origin":"Дальний Восток"},
  {"id":"frozen-32","section":"frozen","name":"Килька балтийская","kind":"kg","price":190,"pack":21,"origin":"Калининград"},
  {"id":"frozen-33","section":"frozen","name":"Конгрио 1-","kind":"kg","price":890,"origin":"Южная Африка"},
  {"id":"frozen-34","section":"frozen","name":"Корюшка дв (м 20-25) «святой владимир»\"","kind":"kg","price":860,"pack":26,"blocks":"2 × 13 кг","origin":"Дальний Восток"},
  {"id":"frozen-35","section":"frozen","name":"Лакедра (желтохвост) н/р 500-1000","kind":"kg","price":350,"pack":20,"origin":"Корея"},
  {"id":"frozen-36","section":"frozen","name":"Ледяная крупная 250+ штучной заморозки","kind":"kg","price":1350,"pack":5,"origin":"Китай"},
  {"id":"frozen-37","section":"frozen","name":"Лещ балтийский 0,7-0,8","kind":"kg","price":135,"pack":30,"blocks":"3 × 10 кг","origin":"Калининград"},
  {"id":"frozen-38","section":"frozen","name":"Лещ балтийский 1,2-1,5","kind":"kg","price":220,"pack":30,"blocks":"3 × 10 кг","origin":"Калининград"},
  {"id":"frozen-39","section":"frozen","name":"Минтай б/г 25+ хайлюля","kind":"kg","price":275,"pack":22,"blocks":"2 × 11 кг","origin":"Дальний Восток"},
  {"id":"frozen-40","section":"frozen","name":"Минтай б/г 25+ штучная заморозка","kind":"kg","price":275,"pack":9,"origin":"Дальний Восток"},
  {"id":"frozen-41","section":"frozen","name":"Минтай б/г 30+ невод","kind":"kg","price":280,"pack":22,"blocks":"2 × 11 кг","origin":"Дальний Восток"},
  {"id":"frozen-42","section":"frozen","name":"Минтай б/г 30+ штучная заморозка невод","kind":"kg","price":300,"pack":10,"origin":"Дальний Восток"},
  {"id":"frozen-43","section":"frozen","name":"Минтай б/г 35+ штучная заморозка","kind":"kg","price":310,"pack":13,"origin":"Дальний Восток"},
  {"id":"frozen-44","section":"frozen","name":"Минтай б/г 35+ штучная заморозка","kind":"kg","price":310,"pack":10,"origin":"Дальний Восток"},
  {"id":"frozen-45","section":"frozen","name":"Мойва атлантическая крупная 25-35","kind":"kg","price":475,"pack":26,"blocks":"2 × 13 кг","origin":"Фареры"},
  {"id":"frozen-46","section":"frozen","name":"Мойва атлантическая крупная 30-40","kind":"kg","price":410,"pack":26,"blocks":"2 × 13 кг","origin":"Фареры"},
  {"id":"frozen-47","section":"frozen","name":"Мойва атлантическая крупная 35-45","kind":"kg","price":385,"pack":26,"blocks":"2 × 13 кг","origin":"Фареры"},
  {"id":"frozen-48","section":"frozen","name":"Мойва дальневосточная крупная 25-35","kind":"kg","price":395,"pack":22,"blocks":"2 × 11 кг","origin":"Дальний Восток"},
  {"id":"frozen-49","section":"frozen","name":"Навага потрошеная б/г 23+ l","kind":"kg","price":240,"pack":24,"blocks":"2 × 12 кг","origin":"Дальний Восток"},
  {"id":"frozen-50","section":"frozen","name":"Нерка потрошеная без головы s (1-1,8)","kind":"kg","price":1000,"pack":20,"blocks":"2 × 10 кг","origin":"Дальний Восток"},
  {"id":"frozen-51","section":"frozen","name":"Окунь б/г 150-300","kind":"kg","price":485,"pack":23,"origin":"Мурманск"},
  {"id":"frozen-52","section":"frozen","name":"Окунь б/г 150-300 штучной заморозки","kind":"kg","price":510,"pack":7,"origin":"Мурманск"},
  {"id":"frozen-53","section":"frozen","name":"Окунь б/г 300-500","kind":"kg","price":540,"pack":24,"blocks":"3 × 8 кг","origin":"Мурманск"},
  {"id":"frozen-54","section":"frozen","name":"Окунь японский «сузуки» потрошеный с головой без жабр","kind":"kg","price":530,"pack":5,"origin":"Китай"},
  {"id":"frozen-55","section":"frozen","name":"Омуль арктический н/р","kind":"kg","price":795,"origin":"Россия"},
  {"id":"frozen-56","section":"frozen","name":"Осетр 4-6 потрошеный с головой","kind":"kg","price":1450,"origin":"Россия"},
  {"id":"frozen-57","section":"frozen","name":"Палтус синекорый тушка 1-2","kind":"kg","price":1350,"pack":21,"origin":"Мурманск"},
  {"id":"frozen-58","section":"frozen","name":"Пангасиус тушка","kind":"kg","price":365,"pack":10,"origin":"Вьетнам"},
  {"id":"frozen-59","section":"frozen","name":"Пикша б/г 0,5-1","kind":"kg","price":395,"origin":"Мурманск"},
  {"id":"frozen-60","section":"frozen","name":"Пикша б/г 0,5-1","kind":"kg","price":430,"pack":30,"blocks":"3 × 10 кг","origin":"Мурманск"},
  {"id":"frozen-61","section":"frozen","name":"Путассу агапов","kind":"kg","price":95,"pack":33,"blocks":"3 × 11 кг","origin":"Мурманск"},
  {"id":"frozen-62","section":"frozen","name":"Путассу фареры 23+","kind":"kg","price":115,"pack":30,"blocks":"2 × 15 кг","origin":"Фареры"},
  {"id":"frozen-63","section":"frozen","name":"Салака","kind":"kg","price":180,"pack":20,"blocks":"2 × 10 кг","origin":"Россия"},
  {"id":"frozen-64","section":"frozen","name":"Салака штучной заморозки","kind":"kg","price":215,"pack":15,"origin":"Россия"},
  {"id":"frozen-65","section":"frozen","name":"Сельдь атлантическая 200-300","kind":"kg","price":150,"pack":30,"blocks":"3 × 10 кг","origin":"Россия"},
  {"id":"frozen-66","section":"frozen","name":"Сельдь олюторская 400-500","kind":"kg","price":220,"pack":20,"blocks":"2 × 10 кг","origin":"Дальний Восток"},
  {"id":"frozen-67","section":"frozen","name":"Семга охлажденная с/г потрошеная 4-5 премиум","kind":"kg","price":1600,"origin":"Мурманск"},
  {"id":"frozen-68","section":"frozen","name":"Семга с/г потрошеная 3-4 премиум","kind":"kg","price":1520,"boxPrice":1460,"origin":"Чили"},
  {"id":"frozen-69","section":"frozen","name":"Семга с/г потрошеная 4-5 премиум","kind":"kg","price":1540,"boxPrice":1480,"origin":"Чили"},
  {"id":"frozen-70","section":"frozen","name":"Семга с/г потрошеная 5-6 премиум","kind":"kg","price":1580,"boxPrice":1520,"origin":"Чили"},
  {"id":"frozen-71","section":"frozen","name":"Семга с/г потрошеная 6-7 премиум","kind":"kg","price":1620,"boxPrice":1570,"origin":"Чили"},
  {"id":"frozen-72","section":"frozen","name":"Семга с/г потрошеная 7-8 премиум","kind":"kg","price":1700,"boxPrice":1650,"origin":"Чили"},
  {"id":"frozen-73","section":"frozen","name":"Сибас целый 300-400","kind":"kg","price":1040,"pack":5,"origin":"Турция"},
  {"id":"frozen-74","section":"frozen","name":"Скумбрия атлантическая б/г 300+","kind":"kg","price":650,"pack":30,"blocks":"3 × 10 кг","origin":"Россия"},
  {"id":"frozen-75","section":"frozen","name":"Скумбрия атлантическая б/г 300+","kind":"kg","price":635,"pack":23,"origin":"Россия"},
  {"id":"frozen-76","section":"frozen","name":"Скумбрия атлантическая нр 200-300","kind":"kg","price":430,"pack":22,"origin":"Россия"},
  {"id":"frozen-77","section":"frozen","name":"Скумбрия атлантическая нр 300-600","kind":"kg","price":550,"pack":22,"blocks":"3 × 10 кг","origin":"Россия"},
  {"id":"frozen-78","section":"frozen","name":"Скумбрия атлантическая нр 400/600 мелькарт","kind":"kg","price":620,"pack":18,"blocks":"3 × 6 кг","origin":"Россия"},
  {"id":"frozen-79","section":"frozen","name":"Скумбрия дальновосточная японская 600-900","kind":"kg","price":390,"pack":10,"origin":"Китай"},
  {"id":"frozen-80","section":"frozen","name":"Терпуг неразделанный крупный 2l","kind":"kg","price":355,"pack":18,"origin":"Дальний Восток"},
  {"id":"frozen-81","section":"frozen","name":"Треска дв б/г 1-1,5 «м»","kind":"kg","price":620,"pack":22,"blocks":"2 × 11 кг","origin":"Дальний Восток"},
  {"id":"frozen-82","section":"frozen","name":"Тунец лойн (2-4 кг)","kind":"kg","price":860,"pack":25,"origin":"Китай"},
  {"id":"frozen-83","section":"frozen","name":"Форель б/г потрошеная 0,9-1,3 премиум (морская форель)","kind":"kg","price":1100,"boxPrice":1050,"origin":"Турция"},
  {"id":"frozen-84","section":"frozen","name":"Форель б/г потрошеная 1,4-1,8 премиум (морская форель)","kind":"kg","price":1130,"boxPrice":1080,"origin":"Турция"},
  {"id":"frozen-85","section":"frozen","name":"Форель б/г потрошеная 1,8-2,7 премиум (морская форель)","kind":"kg","price":1200,"boxPrice":1150,"origin":"Турция"},
  {"id":"frozen-86","section":"frozen","name":"Форель б/г потрошеная 2,7-3,6 премиум (морская форель)","kind":"kg","price":1450,"boxPrice":1390,"origin":"Турция"},
  {"id":"frozen-87","section":"frozen","name":"Форель б/г потрошеная 3,6-4,5 премиум (морская форель)","kind":"kg","price":1570,"boxPrice":1500,"origin":"Турция"},
  {"id":"frozen-88","section":"frozen","name":"Форель непотрошеная 0,8-1,2 премиум","kind":"kg","price":840,"boxPrice":810,"origin":"Турция"},
  {"id":"frozen-89","section":"frozen","name":"Форель охлажденная потрошеная с головой 4-5 морская","kind":"kg","price":1600,"origin":"Мурманск"},
  {"id":"frozen-90","section":"frozen","name":"Хамса крупная крымская мешок","kind":"kg","price":120,"pack":33,"blocks":"3 × 11 кг","origin":"Россия"},
  {"id":"frozen-91","section":"frozen","name":"Хек (хубси) тушка 450-600 обернутый","kind":"kg","price":485,"origin":"Аргентина"},
  {"id":"frozen-92","section":"frozen","name":"Хек (хубси) тушка 80-300","kind":"kg","price":390,"pack":20,"blocks":"2 × 10 кг","origin":"Аргентина"},
  {"id":"frozen-93","section":"frozen","name":"Чехонь балтийский","kind":"kg","price":245,"pack":30,"blocks":"3 × 10 кг","origin":"Россия"},
  {"id":"fillet-1","section":"fillet","name":"Кальмар филе гигантский","kind":"kg","price":345,"pack":21,"blocks":"2 × 10,5 кг","origin":"Перу"},
  {"id":"fillet-2","section":"fillet","name":"Кальмар филе чищеный без плавника (коробочка 600 грамм)","kind":"kg","price":520,"pack":14.4,"blocks":"24 × 0,6 кг","origin":"Дальний Восток"},
  {"id":"fillet-3","section":"fillet","name":"Котлеты из филе щуки в кляре (вес)","kind":"kg","price":520,"pack":5,"origin":"Полар Сифуд Раша"},
  {"id":"fillet-4","section":"fillet","name":"Котлеты лососевые в панировке (вес)","kind":"kg","price":372,"pack":5,"origin":"Полар Сифуд Раша","flag":"wait"},
  {"id":"fillet-5","section":"fillet","name":"Котлеты рыбные (тресковые) в панировке (вес)","kind":"kg","price":276,"pack":5,"origin":"Полар Сифуд Раша"},
  {"id":"fillet-6","section":"fillet","name":"Масляная филе 6+","kind":"kg","price":990,"origin":"Россия"},
  {"id":"fillet-7","section":"fillet","name":"Медальоны рыбные","kind":"kg","price":499,"pack":5,"origin":"Узловая рыба"},
  {"id":"fillet-8","section":"fillet","name":"Минтай фарш «восточный» (коробочка 1 кг)","kind":"kg","price":375,"pack":21,"blocks":"21 × 1 кг","origin":"Дальний Восток"},
  {"id":"fillet-9","section":"fillet","name":"Минтай филе без кожи блочной морской заморозки(коробочка 1 кг)","kind":"kg","price":550,"pack":21,"blocks":"2 × 1 кг","origin":"Дальний Восток"},
  {"id":"fillet-10","section":"fillet","name":"Минтай филе без кожи штучной заморозки","kind":"kg","price":470,"pack":8,"origin":"Узловая рыба"},
  {"id":"fillet-11","section":"fillet","name":"Минтай филе мороженое (порционное) кубики","kind":"kg","price":550,"pack":5,"origin":"Узловая рыба"},
  {"id":"fillet-12","section":"fillet","name":"Палочки из филе тресковых в панировке (вес)","kind":"kg","price":499,"pack":5,"origin":"Экспрод"},
  {"id":"fillet-13","section":"fillet","name":"Пангасиус (белый) филе без кожи штучной заморозки","kind":"kg","price":320,"pack":5,"origin":"Вьетнам"},
  {"id":"fillet-14","section":"fillet","name":"Пангасиус (розовый) филе без кожи штучной заморозки","kind":"kg","price":280,"pack":10,"origin":"Вьетнам"},
  {"id":"fillet-15","section":"fillet","name":"Рыбное филе тресковых в кляре(вес)","kind":"kg","price":520,"pack":5,"origin":"Экспрод","img":"p-cod-batter"},
  {"id":"fillet-16","section":"fillet","name":"Рыбное филе тресковых в панировках (вес)","kind":"kg","price":530,"pack":5,"origin":"Экспрод"},
  {"id":"fillet-17","section":"fillet","name":"Сельдь филе атлантическое 4-7 (fo 174)","kind":"kg","price":295,"pack":28,"blocks":"2 × 14 кг","origin":"Фареры"},
  {"id":"fillet-18","section":"fillet","name":"Сельдь филе атлантическое 6-10 (fo 223)","kind":"kg","price":265,"pack":19,"origin":"Фареры"},
  {"id":"fillet-19","section":"fillet","name":"Семга стейк* (пакет 1 кг)","kind":"pc","price":2100,"origin":"Чили"},
  {"id":"fillet-20","section":"fillet","name":"Семга филе на коже шт. замор. (трим д, 4-5 фунта) (пакет вакуум)","kind":"kg","price":2400,"origin":"Чили"},
  {"id":"fillet-21","section":"fillet","name":"Судак филе на коже штучной заморозки 400+","kind":"kg","price":830,"pack":10,"origin":"Россия"},
  {"id":"fillet-22","section":"fillet","name":"Суповой набор (головы горбуши)","kind":"kg","price":null,"pack":15,"origin":"Узловая рыба","flag":"wait"},
  {"id":"fillet-23","section":"fillet","name":"Суповой набор (головы скумбрии)","kind":"kg","price":15,"pack":15,"origin":"Узловая рыба"},
  {"id":"fillet-24","section":"fillet","name":"Суповой набор (масляная)","kind":"pc","price":null,"origin":"Россия","flag":"wait"},
  {"id":"fillet-25","section":"fillet","name":"Суповой набор (семга)","kind":"pc","price":null,"origin":"Россия","flag":"wait"},
  {"id":"fillet-26","section":"fillet","name":"Суповой набор (форель)","kind":"pc","price":null,"origin":"Россия","flag":"wait"},
  {"id":"fillet-27","section":"fillet","name":"Тилапия филе штучной заморозки","kind":"kg","price":440,"pack":10,"origin":"Китай"},
  {"id":"fillet-28","section":"fillet","name":"Треска дальневосточная стейк","kind":"kg","price":670,"pack":8,"origin":"Россия","flag":"wait"},
  {"id":"fillet-29","section":"fillet","name":"Треска северная филе без кожи 450-900","kind":"kg","price":1150,"pack":20.43,"blocks":"3 × 6,810 кг","origin":"Мурманск","img":"p-cod-450"},
  {"id":"fillet-30","section":"fillet","name":"Треска северная филе без кожи 900+","kind":"kg","price":1200,"pack":20.43,"blocks":"3 × 6,810 кг","origin":"Мурманск","img":"p-cod-900"},
  {"id":"fillet-31","section":"fillet","name":"Треугольники кальмара в панировке (вес)","kind":"kg","price":384,"pack":5,"origin":"Полар Сифуд Раша"},
  {"id":"fillet-32","section":"fillet","name":"Треугольники тресковые в панировке (вес)","kind":"kg","price":336,"pack":5,"origin":"Полар Сифуд Раша"},
  {"id":"fillet-33","section":"fillet","name":"Тунец филе-кусочки (стейки) (пакет 0,5 кг)","kind":"kg","price":435,"pack":10,"blocks":"20 × 0,5 кг","origin":"Китай"},
  {"id":"fillet-34","section":"fillet","name":"Фарш рыбный пакет 0,8 кг","kind":"pc","price":300,"origin":"Узловая рыба"},
  {"id":"fillet-35","section":"fillet","name":"Фигурки рыбные (тресковые) (вес)","kind":"kg","price":354,"pack":5,"origin":"Полар Сифуд Раша"},
  {"id":"fillet-36","section":"fillet","name":"Фишдог из филе минтая в кляре (вес)","kind":"kg","price":460,"pack":5,"origin":"Полар Сифуд Раша","flag":"new"},
  {"id":"fillet-37","section":"fillet","name":"Форель стейк (вакуум пакет)","kind":"pc","price":1490,"origin":"Россия"},
  {"id":"fillet-38","section":"fillet","name":"Форель филе на коже (трим b) 0,9-1,25 кг (пакет вакуум)","kind":"kg","price":1850,"origin":"Китай"},
  {"id":"fillet-39","section":"fillet","name":"Хек филе без кожи проложенное 200+","kind":"kg","price":590,"pack":10,"origin":"Аргентина"},
  {"id":"fillet-40","section":"fillet","name":"Чебуреки с горбушей и соусом тартар (вес)","kind":"kg","price":299,"pack":5,"origin":"Экспрод","flag":"sale"},
  {"id":"seafood-1","section":"seafood","name":"Гребешок медальоны 10-20 (фасовка - пакет 500 гр)","kind":"pc","net":"500 г","price":520,"pack":20,"origin":"Китай"},
  {"id":"seafood-2","section":"seafood","name":"Гребешок на половине раковины с икрой (фасовка - пакет 1 кг)","kind":"kg","price":620,"pack":10,"origin":"Китай"},
  {"id":"seafood-3","section":"seafood","name":"Гребешок филе 40-60 (фасовка - пакет 500 гр)","kind":"pc","net":"500 г","price":550,"pack":20,"origin":"Китай"},
  {"id":"seafood-4","section":"seafood","name":"Гребешок филе м (фасовка - пакет 400 гр)","kind":"pc","net":"400 г","price":1300,"origin":"Россия"},
  {"id":"seafood-5","section":"seafood","name":"Кальмар кольца в панировке (фасовка -1 кг)","kind":"kg","price":680,"pack":10,"origin":"Китай"},
  {"id":"seafood-6","section":"seafood","name":"Каракатицы молодые очищенные (фасовка - пакет 1 кг)","kind":"kg","price":990,"pack":10,"origin":"Вьетнам"},
  {"id":"seafood-7","section":"seafood","name":"Краб камчатский, конечности 1+, (вес - короб 10 кг)","kind":"kg","price":4450,"pack":10,"origin":"Россия"},
  {"id":"seafood-8","section":"seafood","name":"Краб камчатский, мясо первой фаланги очищ, вареномор(фасовка-500гр)","kind":"pc","net":"500 г","price":4950,"pack":10,"origin":"Антей"},
  {"id":"seafood-9","section":"seafood","name":"Крабовое мясо (фасовка- 200 гр)","kind":"pc","net":"200 г","price":59,"pack":30,"origin":"Морской замок"},
  {"id":"seafood-10","section":"seafood","name":"Крабовые палочки «гигант» (вес - короб 4,8 кг)","kind":"kg","price":250,"pack":4.8,"origin":"Морской замок"},
  {"id":"seafood-11","section":"seafood","name":"Крабовые палочки (фасовка- 200 гр)","kind":"pc","net":"200 г","price":59,"pack":30,"origin":"Морской замок"},
  {"id":"seafood-12","section":"seafood","name":"Креветка королевская вар/мор 50/70 (вес - короб 5 кг)","kind":"kg","price":550,"pack":5,"origin":"Россия"},
  {"id":"seafood-13","section":"seafood","name":"Креветка королевская вар/мор 50/70 (фасовка - пакет 800 гр)","kind":"pc","net":"800 г","price":530,"origin":"Россия"},
  {"id":"seafood-14","section":"seafood","name":"Креветка северная вар/мор 150+(вес - короб 5 кг)","kind":"kg","price":610,"pack":5,"origin":"Россия"},
  {"id":"seafood-15","section":"seafood","name":"Креветка северная вар/мор 90/120 (вес - короб 2,5 кг)","kind":"kg","price":1115,"pack":2.5,"origin":"Россия"},
  {"id":"seafood-16","section":"seafood","name":"Креветка северная вар/мор 90/120(фасовка - пакет 800гр)","kind":"pc","net":"800 г","price":960,"origin":"Россия"},
  {"id":"seafood-17","section":"seafood","name":"Креветка северная вар/мор 90+ (вес - короб 5 кг)","kind":"kg","price":1100,"pack":5,"origin":"Россия"},
  {"id":"seafood-18","section":"seafood","name":"Креветки очищенные без хвоста 26/30 (фасовка - пакет 1 кг)","kind":"kg","price":1290,"pack":10,"origin":"Индия"},
  {"id":"seafood-19","section":"seafood","name":"Креветки очищенные в панировке (фасовка - пакет 1 кг) fish&more","kind":"kg","price":1260,"pack":4,"origin":"Россия"},
  {"id":"seafood-20","section":"seafood","name":"Креветки очищенные с хвостиком 16/20 (фасовка - пакет 1 кг)","kind":"kg","price":1350,"pack":10,"origin":"Индия"},
  {"id":"seafood-21","section":"seafood","name":"Креветки очищенные с хвостиком 31/40 (фасовка - пакет 1 кг)","kind":"kg","price":1240,"pack":10,"origin":"Индия"},
  {"id":"seafood-22","section":"seafood","name":"Креветки сыр/мор в панцире без головы 26/30 (фасовка - пакет 1 кг)","kind":"kg","price":990,"pack":10,"origin":"Эквадор"},
  {"id":"seafood-23","section":"seafood","name":"Креветки тигровые сыр/мор без головы 13/15 (фасовка - пакет 1 кг)","kind":"kg","price":1760,"pack":10,"origin":"Бангладеш"},
  {"id":"seafood-24","section":"seafood","name":"Креветки тигровые сыр/мор с головой 13/15 (фасовка - пакет 1 кг)","kind":"kg","price":1300,"pack":10,"origin":"Бангладеш"},
  {"id":"seafood-25","section":"seafood","name":"Лангустины (аргентинские креветки) б/г 30-55 (с1) (фасовка - пакет 1кг)","kind":"kg","price":1120,"pack":12,"origin":"Аргентина"},
  {"id":"seafood-26","section":"seafood","name":"Лангустины (аргентинские креветки) с/г 11/20 (l1) (фасовка - короб 2 кг)","kind":"kg","price":980,"pack":12,"origin":"Аргентина"},
  {"id":"seafood-27","section":"seafood","name":"Мидии в половинке раковины","kind":"kg","price":390,"pack":10,"origin":"Китай"},
  {"id":"seafood-28","section":"seafood","name":"Мидии в целой раковине 40/60 (фасовка - пакет 1 кг)","kind":"kg","price":690,"pack":10,"origin":"Чили"},
  {"id":"seafood-29","section":"seafood","name":"Морской коктейль (фасовка - пакет 1 кг)","kind":"kg","price":360,"pack":10,"origin":"Китай"},
  {"id":"seafood-30","section":"seafood","name":"Мясо мидий 200/300 чили (весовые - короб 9,2 кг чистый вес)","kind":"kg","price":850,"pack":9.2,"origin":"Чили"},
  {"id":"seafood-31","section":"seafood","name":"Мясо мидий чили (фасовка - пакет 1 кг)","kind":"kg","price":860,"pack":10,"origin":"Чили"},
  {"id":"seafood-32","section":"seafood","name":"Осьминожки молодые очищенные (фасовка - пакет 1 кг)","kind":"kg","price":1040,"pack":10,"origin":"Вьетнам"},
  {"id":"seafood-33","section":"seafood","name":"Раки вареномороженые 21/24(фасовка - короб 1 кг)","kind":"kg","price":1070,"pack":6,"origin":"Египет"},
  {"id":"seafood-34","section":"seafood","name":"Суп том ям классический (упаковка 370 гр/ 2 порции)","kind":"pc","price":530,"pack":8,"origin":"Россия"},
  {"id":"seafood-35","section":"seafood","name":"Суп том ям острый (упаковка 370 гр/ 2 порции)","kind":"pc","price":530,"pack":8,"origin":"Россия"},
  {"id":"seafood-36","section":"seafood","name":"Суп том ям с крабом и гребешком (упаковка 370 гр/ 2 порции)","kind":"pc","price":610,"pack":8,"origin":"Россия"},
  {"id":"salads-1","section":"salads","name":"Морковь по-корейски","kind":"kg","price":183,"pack":2,"origin":"Брянск М"},
  {"id":"salads-2","section":"salads","name":"Морская капуста с луком сахалинский","kind":"kg","price":185.5,"pack":2,"origin":"Брянск М"},
  {"id":"salads-3","section":"salads","name":"Салат б/к капуста со сладким перцем","kind":"kg","price":263.5,"pack":2,"origin":"Брянск М"},
  {"id":"salads-4","section":"salads","name":"Салат витаминный","kind":"kg","price":185.5,"pack":2,"origin":"Брянск М"},
  {"id":"salads-5","section":"salads","name":"Салат из квашенной капусты классический","kind":"kg","price":173,"pack":2,"origin":"Брянск М"},
  {"id":"salads-6","section":"salads","name":"Салат с кальмаром в масле","kind":"kg","price":327,"pack":2,"origin":"Брянск М"},
  {"id":"salads-7","section":"salads","name":"Салат спаржа соевая по-корейски","kind":"kg","price":422,"pack":2,"origin":"Брянск М"},
  {"id":"salads-8","section":"salads","name":"Салат чука с/м пакет 500 грамм","kind":"pc","price":145,"pack":20,"origin":"Китай"},
  {"id":"dried-1","section":"dried","name":"Вобла средняя астраханская","kind":"kg","price":900,"pack":10,"origin":"Астрахань"},
  {"id":"dried-2","section":"dried","name":"Горбуша соломка вялена","kind":"pc","net":"250 г","price":863,"origin":"Узловая рыба"},
  {"id":"dried-3","section":"dried","name":"Икра минтая вяленая в/у","kind":"pc","net":"500 г","price":750,"origin":"Узловая рыба","img":"p-pollock-roe"},
  {"id":"dried-4","section":"dried","name":"Икра минтая вяленая в/у","kind":"pc","net":"150 г","price":230,"origin":"Узловая рыба","img":"p-pollock-roe"},
  {"id":"dried-5","section":"dried","name":"Икра сельди вяленая в ястычках","kind":"pc","net":"50 г","price":135,"origin":"Узловая рыба"},
  {"id":"dried-6","section":"dried","name":"Корюшка вяленая l","kind":"kg","price":2250,"origin":"Узловая рыба","flag":"order"},
  {"id":"dried-7","section":"dried","name":"Корюшка вяленая m","kind":"kg","price":2000,"origin":"Узловая рыба","flag":"order"},
  {"id":"dried-8","section":"dried","name":"Лещ астраханский","kind":"kg","price":290,"pack":10,"origin":"Астрахань"},
  {"id":"dried-9","section":"dried","name":"Чехонь вяленая","kind":"kg","price":650,"origin":"Узловая рыба"},
  {"id":"smoked-1","section":"smoked","name":"Горбуша балык холодного копчения l","kind":"kg","price":1100,"pack":3,"origin":"Узловая рыба","flag":"wait"},
  {"id":"smoked-2","section":"smoked","name":"Горбуша балык холодного копчения премиум","kind":"kg","price":1450,"pack":3,"origin":"Узловая рыба"},
  {"id":"smoked-3","section":"smoked","name":"Горбуша балык холодного копчения премиум отборная","kind":"kg","price":1500,"pack":3,"origin":"Узловая рыба"},
  {"id":"smoked-4","section":"smoked","name":"Горбуша без головы холодного копчения","kind":"kg","price":1350,"pack":3,"origin":"Узловая рыба"},
  {"id":"smoked-5","section":"smoked","name":"Горбуша без головы холодного копчения премиум","kind":"kg","price":1350,"pack":3,"origin":"Узловая рыба","flag":"wait"},
  {"id":"smoked-6","section":"smoked","name":"Горбуша без головы холодного копчения сахалин (вылов 2026)","kind":"kg","price":1500,"pack":3,"origin":"Узловая рыба"},
  {"id":"smoked-7","section":"smoked","name":"Горбуша теша холодного копчения","kind":"kg","price":750,"pack":2,"origin":"Узловая рыба"},
  {"id":"smoked-8","section":"smoked","name":"Горбуша филе-нарезка холодного копчения","kind":"kg","price":1380,"origin":"Узловая рыба","flag":"order"},
  {"id":"smoked-9","section":"smoked","name":"Масляная филе холодного копчения m","kind":"kg","price":1650,"origin":"Узловая рыба"},
  {"id":"smoked-10","section":"smoked","name":"Масляная филе холодного копчения s","kind":"kg","price":1450,"origin":"Узловая рыба","flag":"wait"},
  {"id":"smoked-11","section":"smoked","name":"Мойва атл.жирная холодного копчения","kind":"kg","price":800,"origin":"Узловая рыба"},
  {"id":"smoked-12","section":"smoked","name":"Нерка балык холодного копчения","kind":"kg","price":1690,"origin":"Узловая рыба","img":"p-nerka"},
  {"id":"smoked-13","section":"smoked","name":"Нерка теша холодного копчения","kind":"kg","price":750,"origin":"Узловая рыба"},
  {"id":"smoked-14","section":"smoked","name":"Палтус кусок , тушка холодного копчения","kind":"kg","price":1700,"origin":"Узловая рыба"},
  {"id":"smoked-15","section":"smoked","name":"Сельдь атл холодного копчения крупная жирная","kind":"kg","price":395,"pack":3,"origin":"Узловая рыба","flag":"order"},
  {"id":"smoked-16","section":"smoked","name":"Сельдь атлантическая холодного копчения","kind":"kg","price":null,"pack":3,"origin":"Узловая рыба","flag":"order"},
  {"id":"smoked-17","section":"smoked","name":"Сельдь т/о холодного копчения крупная жирная","kind":"kg","price":310,"pack":3,"origin":"Узловая рыба","flag":"order"},
  {"id":"smoked-18","section":"smoked","name":"Скумбрия атлант без головы 300/400 холодного копчения","kind":"kg","price":850,"pack":3,"origin":"Узловая рыба"},
  {"id":"smoked-19","section":"smoked","name":"Скумбрия атлант без головы 400+ холодного копчения","kind":"kg","price":920,"pack":3,"origin":"Узловая рыба","flag":"wait"},
  {"id":"smoked-20","section":"smoked","name":"Скумбрия атлант без головы 450+ холодного копчения","kind":"kg","price":960,"pack":3,"origin":"Узловая рыба","flag":"wait"},
  {"id":"smoked-21","section":"smoked","name":"Скумбрия атлант без головы 500+ холодного копчения","kind":"kg","price":990,"pack":3,"origin":"Узловая рыба","flag":"wait"},
  {"id":"smoked-22","section":"smoked","name":"Форель балык холодного копчения s","kind":"kg","price":1750,"origin":"Узловая рыба"},
  {"id":"smoked-23","section":"smoked","name":"Форель балык холодного копчения м","kind":"kg","price":1850,"origin":"Узловая рыба"},
  {"id":"smoked-24","section":"smoked","name":"Форель потрошенная без головы холодного копчения m","kind":"kg","price":1550,"pack":3,"origin":"Узловая рыба","flag":"order"},
  {"id":"smoked-25","section":"smoked","name":"Форель потрошенная без головы холодного копчения s","kind":"kg","price":1520,"pack":3,"origin":"Узловая рыба","flag":"order"},
  {"id":"smoked-26","section":"smoked","name":"Форель филе холодного копчения","kind":"kg","price":2260,"origin":"Узловая рыба","flag":"order"},
  {"id":"smoked-27","section":"smoked","name":"Хамса холодного копчения","kind":"kg","price":null,"origin":"Узловая рыба","flag":"order"},
  {"id":"smoked-28","section":"smoked","name":"Чехонь холодного копчения","kind":"kg","price":450,"origin":"Узловая рыба","flag":"order"},
  {"id":"salted-1","section":"salted","name":"Горбуша кусок в уксусно-масляной заливке","kind":"kg","price":1200,"pack":2.5,"origin":"Узловая рыба"},
  {"id":"salted-2","section":"salted","name":"Икра минтая в масле с зеленью (премиум сырье) мако","kind":"kg","price":670,"pack":1.7,"origin":"Узловая рыба","flag":"new"},
  {"id":"salted-3","section":"salted","name":"Икра сельди в ястыках слабосоленая","kind":"kg","price":1100,"pack":1.3,"origin":"Узловая рыба"},
  {"id":"salted-4","section":"salted","name":"Кальмар (щупальца) в масле с прян. анталия вес 1,3кг","kind":"kg","price":1250,"pack":1.3,"origin":"Узловая рыба","flag":"order"},
  {"id":"salted-5","section":"salted","name":"Килька пряного посола балтийская","kind":"kg","price":285,"pack":2.5,"origin":"Узловая рыба"},
  {"id":"salted-6","section":"salted","name":"Мидии в ароматном масле (из 100-200)","kind":"kg","price":1250,"pack":2,"origin":"Узловая рыба","flag":"order"},
  {"id":"salted-7","section":"salted","name":"Сельдь атлантическая филе в масле","kind":"bucket","price":1188,"origin":"Узловая рыба"},
  {"id":"salted-8","section":"salted","name":"Сельдь кусок в укс/масл.заливке атлантическая крупная","kind":"kg","price":385,"pack":4,"origin":"Узловая рыба"},
  {"id":"salted-9","section":"salted","name":"Сельдь слабосоленая атлантическая жирная (гост)","kind":"kg","price":230,"pack":5,"origin":"Узловая рыба"},
  {"id":"salted-10","section":"salted","name":"Сельдь слабосоленая крупная атлантическая 350+","kind":"kg","price":295,"pack":5,"origin":"Узловая рыба"},
  {"id":"salted-11","section":"salted","name":"Сельдь слабосоленая крупная атлантическая 400+","kind":"kg","price":385,"pack":5,"origin":"Узловая рыба","flag":"wait"},
  {"id":"salted-12","section":"salted","name":"Сельдь слабосоленая олюторская тихоокеанская 400-500","kind":"kg","price":315,"pack":5,"origin":"Узловая рыба"},
  {"id":"salted-13","section":"salted","name":"Сельдь тихоокеанская филе в масле","kind":"bucket","price":1075,"origin":"Узловая рыба"},
  {"id":"salted-14","section":"salted","name":"Скумбрия кусок в винно-уксусной заливке","kind":"kg","price":765,"pack":2.5,"origin":"Узловая рыба"},
  {"id":"salted-15","section":"salted","name":"Скумбрия кусок в маринаде","kind":"kg","price":765,"pack":4,"origin":"Узловая рыба"},
  {"id":"salted-16","section":"salted","name":"Скумбрия кусок в маринаде","kind":"kg","price":765,"pack":2.5,"origin":"Узловая рыба"},
  {"id":"salted-17","section":"salted","name":"Скумбрия тушка в маринаде","kind":"kg","price":765,"pack":4,"origin":"Узловая рыба"},
  {"id":"salted-18","section":"salted","name":"Хамса в маринаде (крымская) крупная","kind":"kg","price":265,"pack":2.5,"origin":"Узловая рыба"},
  {"id":"hot-1","section":"hot","name":"Ветчина (горбуша и скумбрия) филе в/у премиум","kind":"kg","price":1150,"origin":"Узловая рыба"},
  {"id":"hot-2","section":"hot","name":"Горбуша","kind":"kg","price":565,"origin":"Узловая рыба","flag":"sale"},
  {"id":"hot-3","section":"hot","name":"Зубатка пестрая","kind":"kg","price":null,"origin":"Узловая рыба","flag":"order"},
  {"id":"hot-4","section":"hot","name":"Зубатка полосатая","kind":"kg","price":650,"origin":"Узловая рыба"},
  {"id":"hot-5","section":"hot","name":"Кальмар гигантский филе г/к, в/у","kind":"kg","price":null,"origin":"Узловая рыба","flag":"order"},
  {"id":"hot-6","section":"hot","name":"Лещ балтийский крупный","kind":"kg","price":390,"origin":"Узловая рыба"},
  {"id":"hot-7","section":"hot","name":"Окунь б/г","kind":"kg","price":720,"origin":"Узловая рыба","flag":"order"},
  {"id":"hot-8","section":"hot","name":"Омуль","kind":"kg","price":1300,"origin":null},
  {"id":"hot-9","section":"hot","name":"Рулет (скумбрия + горбуша) филе","kind":"kg","price":1150,"origin":"Узловая рыба"},
  {"id":"hot-10","section":"hot","name":"Рулет (скумбрия) филе","kind":"kg","price":590,"origin":"Узловая рыба","flag":"sale"},
  {"id":"hot-11","section":"hot","name":"Рулет (скумбрия) филе кус","kind":"kg","price":610,"origin":"Узловая рыба","flag":"wait"},
  {"id":"hot-12","section":"hot","name":"Сельдь тушка","kind":"kg","price":400,"origin":"Узловая рыба"},
  {"id":"hot-13","section":"hot","name":"Скумбрия б/г","kind":"kg","price":860,"origin":"Узловая рыба"},
  {"id":"hot-14","section":"hot","name":"Форель г/к с/г","kind":"kg","price":1410,"origin":"Узловая рыба","flag":"wait"},
  {"id":"hot-15","section":"hot","name":"Хребты лосося","kind":"kg","price":760,"origin":"Узловая рыба"},
  {"id":"preserves-1","section":"preserves","name":"Ассорти в масле (икра сельди,сельдь филе кусочки)","kind":"pc","net":"200 г","price":135,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-2","section":"preserves","name":"Ассорти рыбное слабосол в масле(горбуша, скумбрия, сельдь)","kind":"pc","net":"230 г","price":245,"pack":10,"origin":"Узловая рыба"},
  {"id":"preserves-3","section":"preserves","name":"Горбуша кусок в уксусно-масляной заливке","kind":"pc","net":"500 г","price":450,"pack":6,"origin":"Узловая рыба"},
  {"id":"preserves-4","section":"preserves","name":"Икра минтая в масле с зеленью (премиум сырье)","kind":"pc","net":"550 г","price":360,"pack":6,"origin":"Узловая рыба"},
  {"id":"preserves-5","section":"preserves","name":"Икра минтая в масле с зеленью (премиум сырье)","kind":"pc","net":"300 г","price":180,"origin":"Узловая рыба"},
  {"id":"preserves-6","section":"preserves","name":"Икра сельди в масле","kind":"pc","net":"500 г","price":400,"origin":"Узловая рыба"},
  {"id":"preserves-7","section":"preserves","name":"Икра сельди в масле","kind":"pc","net":"190 г","price":170,"pack":9,"origin":"Узловая рыба"},
  {"id":"preserves-8","section":"preserves","name":"Икра сельди в масле пробойная","kind":"pc","net":"1000 г","price":1100,"origin":"Узловая рыба","flag":"order"},
  {"id":"preserves-9","section":"preserves","name":"Икра сельди в масле пробойная (чистый вес 190гр)","kind":"pc","net":"190 г","price":200,"pack":9,"origin":"Узловая рыба","flag":"sale"},
  {"id":"preserves-10","section":"preserves","name":"Кальмар филе в майонезе с пряностями","kind":"pc","net":"200 г","price":145,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-11","section":"preserves","name":"Кальмар филе в масле с пряностями","kind":"pc","net":"200 г","price":150,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-12","section":"preserves","name":"Кальмар щупальца в майонезе с пряностями","kind":"pc","net":"200 г","price":149,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-13","section":"preserves","name":"Кальмар щупальца в масле с пряностями «анталия»","kind":"pc","net":"200 г","price":149,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-14","section":"preserves","name":"Килька балтийская в маринаде","kind":"pc","net":"300 г","price":105,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-15","section":"preserves","name":"Мидии в ароматном масле","kind":"pc","net":"280 г","price":225,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-16","section":"preserves","name":"Сельдь атлантическая кусок в уксусно-масляной заливке","kind":"pc","net":"750 г","price":175,"pack":8,"origin":"Узловая рыба"},
  {"id":"preserves-17","section":"preserves","name":"Сельдь атлантическая кусок в уксусно-масляной заливке","kind":"pc","net":"500 г","price":125,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-18","section":"preserves","name":"Сельдь в пряно-солевой заливке","kind":"pc","net":"1500 г","price":295,"pack":5,"origin":"Узловая рыба"},
  {"id":"preserves-19","section":"preserves","name":"Сельдь тихоокеанская кусок в уксусно-масляной заливке","kind":"pc","net":"750 г","price":165,"pack":8,"origin":"Узловая рыба"},
  {"id":"preserves-20","section":"preserves","name":"Сельдь филе в масле","kind":"pc","net":"550 г","price":225,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-21","section":"preserves","name":"Сельдь филе в масле","kind":"pc","net":"1000 г","price":390,"pack":4,"origin":"Узловая рыба"},
  {"id":"preserves-22","section":"preserves","name":"Сельдь филе в масле т/о","kind":"pc","net":"550 г","price":195,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-23","section":"preserves","name":"Сельдь филе кусочки в винно укс заливке","kind":"pc","net":"300 г","price":135,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-24","section":"preserves","name":"Сельдь филе кусочки в винно укс заливке","kind":"pc","net":"200 г","price":97,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-25","section":"preserves","name":"Сельдь филе кусочки в майонезно-горчичной заливке","kind":"pc","net":"300 г","price":135,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-26","section":"preserves","name":"Сельдь филе кусочки в майонезно-горчичной заливке","kind":"pc","net":"200 г","price":97,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-27","section":"preserves","name":"Сельдь филе кусочки в масле","kind":"pc","net":"300 г","price":135,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-28","section":"preserves","name":"Сельдь филе кусочки в масле","kind":"pc","net":"200 г","price":97,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-29","section":"preserves","name":"Сельдь филе т/о в винно-уксусной заливке","kind":"pc","net":"1500 г","price":645,"origin":"Узловая рыба"},
  {"id":"preserves-30","section":"preserves","name":"Сельдь филе т/о в горчичной заливке","kind":"pc","net":"1500 г","price":660,"origin":"Узловая рыба"},
  {"id":"preserves-31","section":"preserves","name":"Скумбрия кусок в уксусно-масляной заливке","kind":"pc","net":"500 г","price":325,"pack":12,"origin":"Узловая рыба"},
  {"id":"preserves-32","section":"preserves","name":"Форель ломтики в масле","kind":"pc","net":"200 г","price":230,"pack":12,"origin":"Узловая рыба","flag":"wait"},
  {"id":"preserves-33","section":"preserves","name":"Хамса пряного посола","kind":"pc","net":"300 г","price":90,"pack":12,"origin":"Узловая рыба"},
  {"id":"beer-1","section":"beer","name":"Масляная холодного копчения ломтики в/у","kind":"pc","net":"150 г","price":null,"origin":"Узловая рыба","flag":"wait"},
  {"id":"beer-2","section":"beer","name":"Мойва холодного копчения (короб)","kind":"pc","net":"200 г","price":170,"origin":"Узловая рыба"},
  {"id":"beer-3","section":"beer","name":"Нерка филе слабосоленое вакуум/упак","kind":"kg","price":1800,"origin":"Узловая рыба"},
  {"id":"beer-4","section":"beer","name":"Сельдь т/о в/у с/с олюторская 500-700","kind":"kg","price":370,"origin":"Узловая рыба","flag":"wait"},
  {"id":"beer-5","section":"beer","name":"Сельдь т/о в/у с/с олюторская крупная","kind":"kg","price":335,"origin":"Узловая рыба"},
  {"id":"beer-6","section":"beer","name":"Сельдь филе слабосоленое вакуум/упак","kind":"kg","price":480,"origin":"Узловая рыба"},
  {"id":"beer-7","section":"beer","name":"Скумбрия атл филе холодного копчения в/у","kind":"kg","price":700,"origin":"Узловая рыба"},
  {"id":"beer-8","section":"beer","name":"Скумбрия атл холодного копчения ломтики,в/у","kind":"pc","net":"100 г","price":95,"origin":"Узловая рыба"},
  {"id":"beer-9","section":"beer","name":"Тунец филе холодного копчения вакуум/упак","kind":"kg","price":1405,"origin":"Узловая рыба"},
  {"id":"beer-10","section":"beer","name":"Форель слабосоленая филе-кусок вакуум/упак","kind":"pc","net":"200 г","price":415,"pack":15,"origin":"Узловая рыба"},
  {"id":"beer-11","section":"beer","name":"Форель слабосоленая филе-пласт вакуум/упак","kind":"kg","price":1850,"origin":"Узловая рыба"},
  {"id":"caviar-1","section":"caviar","name":"Икра лососевая (горбуша) ведро","kind":"kg","price":19800,"pack":10,"origin":"Камчатка"},
  {"id":"caviar-2","section":"caviar","name":"Икра лососевая (горбуша) пластиковая банка","kind":"pc","net":"90 г","price":1910,"origin":"Камчатка"},
  {"id":"caviar-3","section":"caviar","name":"Икра лососевая (горбуша) пластиковая банка","kind":"pc","net":"510 г","price":10350,"origin":"Камчатка"},
  {"id":"caviar-4","section":"caviar","name":"Икра лососевая (горбуша) пластиковая банка","kind":"pc","net":"300 г","price":6190,"origin":"Камчатка"},
  {"id":"caviar-5","section":"caviar","name":"Икра лососевая (горбуша) пластиковая банка","kind":"pc","net":"200 г","price":4170,"origin":"Камчатка"},
  {"id":"caviar-6","section":"caviar","name":"Икра лососевая (горбуша) пластиковая банка","kind":"pc","net":"130 г","price":2730,"origin":"Камчатка"},
  {"id":"caviar-7","section":"caviar","name":"Икра лососевая (горбуша) сол/мор без консервантов ж/б","kind":"pc","net":"125 г","price":2875,"pack":36,"origin":"Восточный берег"},
  {"id":"caviar-8","section":"caviar","name":"Икра лососевая (кета) ведро","kind":"kg","price":19800,"pack":25,"origin":"Камчатка"},
  {"id":"caviar-9","section":"caviar","name":"Икра лососевая (кета) пластиковая банка","kind":"pc","net":"90 г","price":1910,"origin":"Камчатка"},
  {"id":"caviar-10","section":"caviar","name":"Икра лососевая (кета) пластиковая банка","kind":"pc","net":"510 г","price":10350,"origin":"Камчатка"},
  {"id":"caviar-11","section":"caviar","name":"Икра лососевая (кета) пластиковая банка","kind":"pc","net":"300 г","price":6190,"origin":"Камчатка"},
  {"id":"caviar-12","section":"caviar","name":"Икра лососевая (кета) пластиковая банка","kind":"pc","net":"200 г","price":4170,"origin":"Камчатка"},
  {"id":"caviar-13","section":"caviar","name":"Икра лососевая (кета) пластиковая банка","kind":"pc","net":"130 г","price":2730,"origin":"Камчатка"},
  {"id":"caviar-14","section":"caviar","name":"Икра лососевая (кета) сол/мор без консервантов ж/б","kind":"pc","net":"125 г","price":2925,"pack":36,"origin":"Восточный берег"},
  {"id":"caviar-15","section":"caviar","name":"Икра лососевая (нерка) ведро","kind":"kg","price":18500,"pack":25,"origin":"Камчатка"},
  {"id":"caviar-16","section":"caviar","name":"Икра лососевая (нерка) пластиковая банка","kind":"pc","net":"90 г","price":1800,"origin":"Камчатка"},
  {"id":"caviar-17","section":"caviar","name":"Икра лососевая (нерка) пластиковая банка","kind":"pc","net":"510 г","price":9750,"origin":"Камчатка"},
  {"id":"caviar-18","section":"caviar","name":"Икра лососевая (нерка) пластиковая банка","kind":"pc","net":"300 г","price":5840,"origin":"Камчатка","flag":"wait"},
  {"id":"caviar-19","section":"caviar","name":"Икра лососевая (нерка) пластиковая банка","kind":"pc","net":"200 г","price":3920,"origin":"Камчатка"},
  {"id":"caviar-20","section":"caviar","name":"Икра лососевая (нерка) пластиковая банка","kind":"pc","net":"130 г","price":2570,"origin":"Камчатка"},
  {"id":"caviar-21","section":"caviar","name":"Икра осетровая (осетр) стеклянная банка классик","kind":"pc","net":"50 г","price":3920,"origin":"ВРХ"},
  {"id":"caviar-22","section":"caviar","name":"Икра осетровая (осетр) стеклянная банка классик","kind":"pc","net":"100 г","price":7330,"origin":"ВРХ"},
  {"id":"caviar-23","section":"caviar","name":"Икра осетровая (осетр) стеклянная банка премиум","kind":"pc","net":"50 г","price":4290,"origin":"ВРХ"},
  {"id":"caviar-24","section":"caviar","name":"Икра осетровая (осетр) стеклянная банка премиум","kind":"pc","net":"100 г","price":8220,"origin":"ВРХ"},
  {"id":"caviar-25","section":"caviar","name":"Икра осетровая (осетр) стеклянная банка селект","kind":"pc","net":"50 г","price":4630,"origin":"ВРХ"},
  {"id":"caviar-26","section":"caviar","name":"Икра щуки стеклянная банка","kind":"pc","net":"113 г","price":930,"pack":45,"origin":"Астрахань"},
  {"id":"canned-1","section":"canned","name":"Горбуша натуральная в с/с «доброфлот»","kind":"pc","net":"245 г","price":240,"boxPrice":230,"pack":24,"origin":"Дальний Восток"},
  {"id":"canned-2","section":"canned","name":"Килька балтийская в т/с «За родину» ключ","kind":"pc","net":"240 г","price":79,"boxPrice":74,"pack":18,"origin":"Калининград"},
  {"id":"canned-3","section":"canned","name":"Килька балтийская обжар. «по-венгерски» в т/с «За родину» ключ","kind":"pc","net":"240 г","price":89,"boxPrice":84,"pack":18,"origin":"Калининград"},
  {"id":"canned-4","section":"canned","name":"Килька балтийская обжар.«по-гавайски» в т/с «За родину» ключ","kind":"pc","net":"240 г","price":89,"boxPrice":84,"pack":18,"origin":"Калининград"},
  {"id":"canned-5","section":"canned","name":"Килька балтийская обжар.«по-мексикански» в т/с «За родину» ключ","kind":"pc","net":"240 г","price":89,"boxPrice":84,"pack":18,"origin":"Калининград"},
  {"id":"canned-6","section":"canned","name":"Килька балтийская обжаренная в т/с «За родину» ключ","kind":"pc","net":"240 г","price":83,"boxPrice":78,"pack":18,"origin":"Калининград"},
  {"id":"canned-7","section":"canned","name":"Килька балтийская обжаренная в т/с «За родину» стекло","kind":"pc","net":"270 г","price":100,"boxPrice":95,"pack":12,"origin":"Калининград"},
  {"id":"canned-8","section":"canned","name":"Килька балтийская обжаренная в т/с «За родину» ханса, овал","kind":"pc","net":"175 г","price":99,"boxPrice":92,"pack":24,"origin":"Калининград"},
  {"id":"canned-9","section":"canned","name":"Паштет из филе тунца классический «За родину» ключ","kind":"pc","net":"80 г","price":93,"boxPrice":88,"pack":12,"origin":"Калининград"},
  {"id":"canned-10","section":"canned","name":"Печень и икра минтая (ассорти деликатесное)","kind":"pc","net":"195 г","price":240,"boxPrice":230,"pack":24,"origin":"Дальний Восток"},
  {"id":"canned-11","section":"canned","name":"Печень трески натуральная кусковая (сделано в море)","kind":"pc","net":"230 г","price":950,"boxPrice":920,"pack":48,"origin":"Мурманск"},
  {"id":"canned-12","section":"canned","name":"Печень трески натуральная кусковая (сделано в море)","kind":"pc","net":"185 г","price":775,"boxPrice":750,"pack":60,"origin":"Мурманск"},
  {"id":"canned-13","section":"canned","name":"Печень трески по -мурмански","kind":"pc","net":"230 г","price":485,"boxPrice":470,"pack":48,"origin":"Мурманск"},
  {"id":"canned-14","section":"canned","name":"Сайра нат в с/с «доброфлот»","kind":"pc","net":"245 г","price":220,"boxPrice":210,"pack":24,"origin":"Дальний Восток"},
  {"id":"canned-15","section":"canned","name":"Салака тушки бланшированные в масле «За родину» ключ, ханса","kind":"pc","net":"175 г","price":108,"boxPrice":100,"pack":24,"origin":"Калининград"},
  {"id":"canned-16","section":"canned","name":"Салака тушки бланшированные в масле с каперсами «За родину» ключ, ханса","kind":"pc","net":"175 г","price":108,"boxPrice":100,"pack":24,"origin":"Калининград"},
  {"id":"canned-17","section":"canned","name":"Салака тушки бланшированные в масле с маслинами «За родину» ключ, ханса","kind":"pc","net":"175 г","price":108,"boxPrice":100,"pack":24,"origin":"Калининград"},
  {"id":"canned-18","section":"canned","name":"Салака тушки бланшированные в масле с халапенью «За родину» ключ, ханса","kind":"pc","net":"175 г","price":108,"boxPrice":100,"pack":24,"origin":"Калининград"},
  {"id":"canned-19","section":"canned","name":"Салат из морской капусты «дальневосточный» «За родину» ключ","kind":"pc","net":"220 г","price":78,"boxPrice":74,"pack":24,"origin":"Калининград"},
  {"id":"canned-20","section":"canned","name":"Салат из филе тунца в соусе кимчи «За родину» ключ","kind":"pc","net":"160 г","price":95,"pack":24,"origin":"Калининград","flag":"sale"},
  {"id":"canned-21","section":"canned","name":"Салат из филе тунца парижский дижон «За родину» ключ","kind":"pc","net":"160 г","price":100,"boxPrice":95,"pack":24,"origin":"Калининград"},
  {"id":"canned-22","section":"canned","name":"Салат из филе тунца прованс «За родину» ключ","kind":"pc","net":"160 г","price":95,"pack":24,"origin":"Калининград","flag":"sale"},
  {"id":"canned-23","section":"canned","name":"Салат из филе тунца с киноа и томатами «За родину» ключ","kind":"pc","net":"160 г","price":100,"boxPrice":95,"pack":24,"origin":"Калининград"},
  {"id":"canned-24","section":"canned","name":"Салат из филе тунца с киноа и травами «За родину» ключ","kind":"pc","net":"160 г","price":100,"boxPrice":95,"pack":24,"origin":"Калининград"},
  {"id":"canned-25","section":"canned","name":"Сельдь атлант кусочки с овощ гарнир в т/с «За родину» ключ","kind":"pc","net":"185 г","price":83,"boxPrice":78,"pack":32,"origin":"Калининград"},
  {"id":"canned-26","section":"canned","name":"Скумбрия атл кусочки нат с доб масла «За родину» ключ","kind":"pc","net":"230 г","price":125,"boxPrice":119,"pack":24,"origin":"Калининград"},
  {"id":"canned-27","section":"canned","name":"Скумбрия атл кусочки нат с доб масла «За родину» ключ","kind":"pc","net":"185 г","price":115,"boxPrice":110,"pack":32,"origin":"Калининград"},
  {"id":"canned-28","section":"canned","name":"Скумбрия кус в т/с с овощным гарниром «За родину» ключ","kind":"pc","net":"185 г","price":105,"boxPrice":99,"pack":32,"origin":"Калининград"},
  {"id":"canned-29","section":"canned","name":"Тефтели в т/с «За родину» ключ","kind":"pc","net":"240 г","price":70,"boxPrice":66,"pack":18,"origin":"Калининград"},
  {"id":"canned-30","section":"canned","name":"Тунец кусок натуральный «За родину» ключ","kind":"pc","net":"230 г","price":122,"boxPrice":115,"pack":24,"origin":"Калининград"},
  {"id":"canned-31","section":"canned","name":"Тунец филе-кусочки натуральный «За родину» ключ","kind":"pc","net":"170 г","price":165,"boxPrice":155,"pack":24,"origin":"Калининград"},
  {"id":"canned-32","section":"canned","name":"Фрикадельки в т/с «За родину» ключ","kind":"pc","net":"240 г","price":70,"boxPrice":66,"pack":18,"origin":"Калининград"},
  {"id":"canned-33","section":"canned","name":"Шпротный паштет «За родину» ключ","kind":"pc","net":"170 г","price":63,"boxPrice":59,"pack":24,"origin":"Калининград"},
  {"id":"canned-34","section":"canned","name":"Шпроты в масле «за родину!» стекло","kind":"pc","net":"270 г","price":182,"boxPrice":170,"pack":12,"origin":"Калининград"},
  {"id":"canned-35","section":"canned","name":"Шпроты в масле ключ «за родину!»","kind":"pc","net":"160 г","price":115,"boxPrice":109,"pack":24,"origin":"Калининград"},
  {"id":"canned-36","section":"canned","name":"Шпроты в масле ключ «за родину!» ханса, овал","kind":"pc","net":"175 г","price":138,"boxPrice":130,"pack":24,"origin":"Калининград"},
  {"id":"canned-37","section":"canned","name":"Шпроты в масле с прозрачной крышкой «за родину!»","kind":"pc","net":"120 г","price":134,"boxPrice":126,"pack":12,"origin":"Калининград"},
]

export const bpPath = (path = '/') => `/redesign/baltikprodukt${path === '/' ? '/' : path}`
export const bpSectionPath = (id?: string) => bpPath(id ? `/catalog/${id}` : '/catalog')
export const bpImg = (name: string) => `/redesign/baltikprodukt/img/${name}.jpg`
export const bpSection = (id: string) => bpSections.find((s) => s.id === id)
export const bpFind = (id: string) => bpProducts.find((p) => p.id === id)

export const bpContacts = {
  original: 'https://www.baltikprodukt.ru/',
  phones: [
    { label: '+7 (4872) 302-555', href: 'tel:+74872302555' },
    { label: '+7 (4872) 302-333', href: 'tel:+74872302333' },
    { label: '+7 (4872) 21-20-80', href: 'tel:+74872212080' },
    { label: '+7 (4872) 21-20-90', href: 'tel:+74872212090' },
  ],
  email: 'sales@baltikprodukt.ru',
  address: 'Тула, ул. Демонстрации, 197а',
  index: '300013',
  hours: [
    { days: 'Пн–пт', time: '8:00–18:00' },
    { days: 'Суббота', time: '8:00–16:00' },
    { days: 'Воскресенье', time: '8:00–14:00' },
  ],
  max: 'https://max.ru//channel_baltikproukt',
  price: 'https://www.baltikprodukt.ru/upload/optoviy_price.xlsx',
  priceDate: '6 октября 2026',
  map: 'https://yandex.ru/maps/?text=%D0%A2%D1%83%D0%BB%D0%B0%2C%20%D1%83%D0%BB.%20%D0%94%D0%B5%D0%BC%D0%BE%D0%BD%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%2C%20197%D0%B0',
  legal: [
    ['Организация', 'ООО «Балтик Продукт»'],
    ['ОГРН', '1027100747926'],
    ['ИНН', '7106023882'],
    ['КПП', '710601001'],
  ],
}

// Условия — словами с сайта (FAQ, «О компании», «Контакты»).
export const bpTerms = {
  retail: 'В розницу товар продаётся по ценам мелкооптового прайса +3 %.',
  minimum: 'Штучный товар и крупная рыба — от 1 штуки, весовой товар — от 3 кг.',
  payment: ['Наличные', 'Картой — для физических лиц', 'Безналичный расчёт по реквизитам — для юрлиц'],
  delivery: 'Доставка «до порога» по Тульской области и в другие области России.',
  docs: 'На всю продукцию выдаём декларации соответствия и ветеринарные сопроводительные документы.',
}

export const bpFlags: Record<NonNullable<BpProduct['flag']>, string> = {
  sale: 'Акция',
  new: 'Новинка',
  order: 'Под заказ',
  wait: 'Ожидается',
}

export const bpReviews = [
  {
    name: 'Вячеслав',
    text: 'Отличный поставщик свежемороженой рыбы и рыбных консервов. С самого начала сотрудничества не перестают радовать цены. Раньше часто меняли поставщиков, многое не устраивало наших клиентов. С вами всё наладилось, торговля пошла!',
  },
  {
    name: 'Дмитрий',
    text: 'Работаю с «Балтик продукт» уже более 4 лет, за это время никаких конфузов не возникало. Товар приходит всегда в надлежащем качестве, в том весе, который и заказываем. Прозрачное сотрудничество без скрытых нюансов.',
  },
  {
    name: 'Глеб',
    text: 'Благодарю за оперативное сотрудничество и быструю доставку товара в наш город — Рязань. Самое прекрасное — это качество вашего товара. В других близлежащих городах таких продуктов не найти.',
  },
  {
    name: 'Артём',
    text: 'Объёмный заказ пришёл без задержек. Товар отличный, без пересорта. За всё время, пока торгуем вашей рыбой, получаем только положительные эмоции от своих постоянных клиентов.',
  },
  {
    name: 'Виктор',
    text: 'Наша сеть магазинов сотрудничает с «Балтик продукт» всего год. Но за этот небольшой срок могу уверенно сказать, что это лучший поставщик, с которым мы работали за последние годы.',
  },
  {
    name: 'Прохор',
    text: 'Неоднократно делал заказы на поставку свежемороженой рыбы по магазинам Москвы. Доставка партий своевременная, с выдержкой температурного режима и санитарных норм. Отсутствуют обветренные, загрязнённые и перемороженные.',
  },
  {
    name: 'Юлия',
    text: 'Заказываю вашу продукцию для своего магазина более полугода. Солёную рыбу — хамсу, селёдку, салаку, иваси и кильку — покупатели разметают в считанные часы! Спасибо за широкий ассортимент, внимательное обслуживание и быструю доставку в Магнитогорск.',
  },
  {
    name: 'Галина',
    text: 'Сотрудничаю с вами больше 2 лет. Продукция всегда свежайшая, поставляется быстро, в нужном количестве и без пересорта. Отдельное спасибо менеджеру за подробное описание характеристик и деловые советы!',
  },
  {
    name: 'Михаил',
    text: 'Работаю с вами давно, очень доволен, хорошая продукция. За 5 лет ни одной жалобы от покупателей на качество рыбы от вас.',
  },
  { name: 'Александр', text: 'Лучшая рыбная продукция в Туле, отличное обслуживание, предоставление всех документов. Спасибо за работу.' },
  { name: 'Владимир', text: 'Всё понравилось, хороший выбор, отличные цены!' },
]

// Вакансии оригинала (/company/vacancy/): у каждой кнопка «Отправить резюме» с формой.
export const bpVacancies = [
  {
    id: 'loader',
    title: 'Грузчик-карщик',
    salary: 'Зарплата по результатам собеседования',
    text: 'Обращаться в офис.',
    phones: ['21-20-80', '21-20-90', '302-555', '302-333'],
  },
]

export const bpNews = [
  { title: 'Печень трески: польза сквозь века', url: 'https://www.baltikprodukt.ru/info/news/pechen-treski-polza-skvoz-veka/' },
  {
    title: 'Какая вяленая рыба самая вкусная: правила выбора и хранения',
    url: 'https://www.baltikprodukt.ru/info/news/kakaya-vyalenaya-ryba-samaya-vkusnaya-pravila-vybora-i-khraneniya/',
  },
  {
    title: 'Креветки: сыромороженые или варено-мороженые — в чём разница?',
    url: 'https://www.baltikprodukt.ru/info/news/krevetki-syromorozhenye-ili-vareno-morozhenye-v-chem-raznitsa/',
  },
  { title: 'Икра без консервантов: какую выбрать?', url: 'https://www.baltikprodukt.ru/info/news/' },
]

export const bpFaq = [
  { q: 'Можно ли купить товар в розницу?', a: 'Да, конечно. В розницу товар приобретается по ценам мелкооптового прайса +3 %.' },
  { q: 'Есть ли минимальный объём покупки?', a: 'Штучный товар и крупная рыба продаются от 1 штуки, весовой товар — от 3 кг.' },
  { q: 'Где производится переработанная продукция?', a: 'На заводе «Узловая рыба» в Тульской области: солёная, вяленая рыба, холодное и горячее копчение, пресервы.' },
  {
    q: 'Есть ли эксклюзивная продукция?',
    a: 'Дальневосточная углохвостая креветка; пресервы скумбрии, сельди, кильки и хамсы в уксусно-масляной заливке; рыба горячего копчения.',
  },
]

// Спецпредложения оригинала (/info/stock/).
export const bpOffers = [
  {
    title: 'Северная креветка',
    text: 'Без глазури, судовая заморозка. Размеры 250+, 200+, 150+, 120+, 90/120.',
    img: 'shrimp',
    q: 'креветка северная',
  },
  {
    title: 'Форель охлаждённая',
    text: 'Не была заморожена: поступает через 3–4 дня после вылова. Поставки каждую неделю.',
    img: 'trout',
    q: 'форель охлажд',
  },
]

const RETAIL = 1.03
const rub0 = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
const rub2 = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const bpMoney = (n: number) => (Math.abs(n - Math.round(n)) < 0.005 ? rub0.format(Math.round(n)) : rub2.format(n)) + ' ₽'
export const bpMoney0 = (n: number) => rub0.format(Math.round(n)) + ' ₽'
export const bpNum = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',')

// 1 позиция, 3 позиции, 27 позиций
export const bpPlural = (n: number, forms: [string, string, string]) => {
  const a = n % 100
  const c = n % 10
  return forms[a > 10 && a < 20 ? 2 : c === 1 ? 0 : c > 1 && c < 5 ? 1 : 2]
}
export const bpPositions = (n: number) => `${n}\u00a0${bpPlural(n, ['позиция', 'позиции', 'позиций'])}`

export const bpUnit = (p: BpProduct) => (p.kind === 'kg' ? 'кг' : p.kind === 'bucket' ? 'ведро' : 'шт')
export const bpQtyLabel = (p: BpProduct, qty: number) => `${bpNum(qty)} ${bpUnit(p)}`
// Розница — «прайс +3 %», копейки округляем.
export const bpModePrice = (n: number, mode: BpMode) => (mode === 'retail' ? Math.round(n * RETAIL * 100) / 100 : n)
// Цена за единицу при данном количестве: коробкой — по цене «от 1 кор».
export const bpUnitPrice = (p: BpProduct, qty: number, mode: BpMode) => {
  if (!p.price) return 0
  const base = p.boxPrice && p.pack && qty >= p.pack ? p.boxPrice : p.price
  return bpModePrice(base, mode)
}
export const bpBoxCost = (p: BpProduct, mode: BpMode) => (p.price && p.pack ? bpModePrice((p.boxPrice ?? p.price) * p.pack, mode) : 0)
export const bpPackLabel = (p: BpProduct) => {
  if (!p.pack) return ''
  if (p.kind === 'kg') return p.blocks ? `${p.blocks} в коробке` : `${bpNum(p.pack)} кг в коробке`
  return `${bpNum(p.pack)} шт. в коробке`
}
// Минимум по условиям: весовой товар от 3 кг.
export const bpMin = (p: BpProduct) => (p.kind === 'kg' ? 3 : 1)

const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е').replace(/[«»"().,/*]/g, ' ')
const index = bpProducts.map((p) => norm(`${p.name} ${p.origin ?? ''} ${bpSection(p.section)?.title ?? ''}`))
// Поиск по прайсу: все слова запроса, окончания срезаем («креветки» находит «креветка»).
export const bpSearch = (q: string, list: BpProduct[] = bpProducts) => {
  const words = norm(q)
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w.length > 4 ? w.slice(0, w.length - 2) : w))
  if (!words.length) return list
  return list.filter((p) => {
    const text = index[bpProducts.indexOf(p)]
    return words.every((w) => text.includes(w))
  })
}

export const bpQuickQueries = ['Креветки', 'Горбуша', 'Икра', 'Сельдь', 'Скумбрия х/к', 'Килька «За родину»']
export const bpOrigins = [...new Set(bpProducts.map((p) => p.origin).filter(Boolean) as string[])]
  .map((o) => ({ name: o, count: bpProducts.filter((p) => p.origin === o).length }))
  .sort((a, b) => b.count - a.count)
