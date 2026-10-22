// Данные и константы концепта редизайна магазина «Куендатское» (ПСПК «Куендатский»).
// Источник: https://fermertomska.ru (InSales, /collection/all.json), снято 22 октября 2026.
// Это концепт, не официальный сайт. Фото товаров грузятся с CDN InSales; снимок линейки
// на пледе и масло лежат в public/redesign/fermertomska/img/ уменьшенными копиями:
// оригиналы весят по 3 МБ. Разделы и фасовки сгруппированы концептом: на оригинале
// каждая фасовка — отдельный товар, а меню «Каталог» состоит из подборок.

export type FtSectionId = 'milk' | 'smetana' | 'tvorog' | 'kefir' | 'butter' | 'frozen'
export type FtTag = 'new' | 'hit' | 'sale'

export interface FtSection {
  id: FtSectionId
  title: string
  cover: string
}

export interface FtFamily {
  id: string
  section: FtSectionId
  title: string
  text: string
  // Цвет этикетки на упаковке: метка жирности в карточке.
  tone: string
  fat?: string
  shelf?: string
  note?: string
}

export interface FtProduct {
  id: string
  family: string
  // Фасовка или вкус: подпись переключателя в карточке.
  variant: string
  // Название, как на оригинале.
  name: string
  price: number
  unit: 'шт' | 'кг'
  stock?: number
  tags: FtTag[]
  images: string[]
}

const cdn = (path: string) => `https://cdn.insales-shop.ru/images/products/${path.replace(/\/([^/]+)$/, '/large_$1')}`

export const ftImg = (file: string) => `/redesign/fermertomska/img/${file}`

export const ftFamilies: FtFamily[] = [
  { id: 'milk-34', section: 'milk', title: 'Молоко 3,4–4,5%', fat: '3,4–4,5%', tone: '#2f6fd0', shelf: '5 суток', text: 'Цельное пастеризованное молоко без консервантов и усилителей вкуса. Пастеризуем бережно, чтобы сохранить вкус.' },
  { id: 'milk-6', section: 'milk', title: 'Молоко 6%', fat: '6%', tone: '#2f6fd0', shelf: '5 суток', text: 'Пастеризованное молоко повышенной жирности.' },
  { id: 'milk-25', section: 'milk', title: 'Молоко 2,5%', fat: '2,5%', tone: '#2f6fd0', shelf: '5 суток', text: 'Пастеризованное молоко без консервантов, по старым рецептам.' },
  { id: 'smetana-15', section: 'smetana', title: 'Сметана 15%', fat: '15%', tone: '#1c9e93', shelf: '5 суток', text: 'Деревенская сметана из свежего коровьего молока по классическому рецепту. К борщу, щам и блинам.' },
  { id: 'smetana-20', section: 'smetana', title: 'Сметана 20%', fat: '20%', tone: '#d0306f', shelf: '5 суток', text: 'Сметана из сливок и закваски: нежная, с мягким вкусом. Ложка стоит — проверено!' },
  { id: 'tvorog-0', section: 'tvorog', title: 'Творог обезжиренный', fat: '0%', tone: '#d23a2f', shelf: '5 суток', text: 'Рассыпчатый творог, всегда свежий. Для завтрака и сырников.' },
  { id: 'tvorog-5', section: 'tvorog', title: 'Творог 5%', fat: '5%', tone: '#4b52b8', shelf: '5 суток', text: 'Наивкуснейший на планете! Ну, в Томской области точно!' },
  { id: 'tvorog-9', section: 'tvorog', title: 'Творог 9%', fat: '9%', tone: '#d23a2f', shelf: '5 суток', text: 'Рассыпчатый творог, всегда свежий. Для завтрака и сырников.' },
  { id: 'kefir', section: 'kefir', title: 'Кефир 2,5%', fat: '2,5%', tone: '#2f9a4a', shelf: '5 суток', text: 'Кефир из цельного молока. Срок хранения 5 суток — значит, без консервантов.' },
  { id: 'yogurt', section: 'kefir', title: 'Йогурт питьевой 1,5%', fat: '1,5%', tone: '#8a3fa6', shelf: '7 суток', note: 'Изменился объём: теперь 0,3 л', text: 'Йогурт из цельного коровьего молока с кусочками сибирских ягод.' },
  { id: 'snezhok', section: 'kefir', title: 'Снежок 2,5%', fat: '2,5%', tone: '#8a3fa6', text: 'Лёгкий кисломолочный напиток: всего 27 ккал на 100 г.' },
  { id: 'butter', section: 'butter', title: 'Масло Крестьянское 72,5%', fat: '72,5%', tone: '#e0a800', shelf: '35–60 суток', text: 'Наша гордость: победитель конкурса «Лучшие товары и услуги Томской области», серебряная медаль «Молочные продукты Сибири».' },
  { id: 'butter-garlic', section: 'butter', title: 'Масло Крестьянское с чесноком', fat: '72,5%', tone: '#e0a800', text: 'Сливочное масло с чесноком — к завтраку и горячему.' },
  { id: 'butter-herbs', section: 'butter', title: 'Масло Крестьянское с прованскими травами', fat: '72,5%', tone: '#e0a800', text: 'Сливочное масло с прованскими травами — к завтраку и горячему.' },
  { id: 'vareniki-meat', section: 'frozen', title: 'Вареники с капустой и мясом', tone: '#7a5a3a', text: 'Нежные вареники с капустой и мясом. Легко готовятся и радуют семью.' },
  { id: 'vareniki-potato', section: 'frozen', title: 'Вареники с картофелем', tone: '#7a5a3a', text: 'Из отборного картофеля и нежного теста.' },
  { id: 'pelmeni', section: 'frozen', title: 'Пельмени с телятиной', tone: '#7a5a3a', text: 'Пельмени с отборной телятиной.' },
  { id: 'syrniki', section: 'frozen', title: 'Сырники замороженные', tone: '#7a5a3a', text: 'Завтрак или десерт к чаю — без искусственных добавок и консервантов.' },
]

type Row = [id: string, family: string, variant: string, name: string, price: number, images: string[], extra?: Partial<FtProduct>]

const rows: Row[] = [
  ['moloko-34-45-zhirnosti', 'milk-34', 'бутылка', 'Молоко 3,4-4,5% жирности', 120.65, ['1/7053/906247053/RumyantsevaTati-4475.jpg', '1/7180/906247180/RumyantsevaTati-4497.jpg', '1/7384/906247384/RumyantsevaTati-4745.jpg']],
  ['moloko-34-45-zhirnosti-plenka', 'milk-34', 'пакет 1 л', 'Молоко 3,4-4,5% жирности пленка', 99.75, ['1/5645/907843085/RumyantsevaTati-4499.jpg', '1/4976/907842416/RumyantsevaTati-4502.jpg', '1/3806/907841246/RumyantsevaTati-4745.jpg']],
  ['moloko-34-45-zhirnosti-15-l', 'milk-34', '1,5 л', 'Молоко 3,4-4,5% жирности 1,5 л', 168, ['1/7926/906575606/RumyantsevaTati-4708.jpg', '1/5802/906253994/RumyantsevaTati-4745.jpg', '1/6176/906254368/RumyantsevaTati-4836.jpg'], { tags: ['hit'] }],
  ['moloko-6-1l', 'milk-6', '1 л', 'Молоко 6% 1л.', 141.44, ['1/4035/906252227/RumyantsevaTati-4472.jpg', '1/3835/906252027/RumyantsevaTati-4479.jpg', '1/3650/906251842/RumyantsevaTati-4737.jpg']],
  ['moloko-25-zhirnosti-plenka', 'milk-25', 'бутылка', 'Молоко 2,5% жирности бутылка', 99.75, ['1/6660/907844100/RumyantsevaTati-4745.jpg', '1/4715/1022661227/IMG_0115.jpg', '1/4613/1022661125/IMG_3762.jpg']],
  ['smetana-15-200-gr', 'smetana-15', '200 г', 'Сметана 15% 200 гр.', 83.37, ['1/6824/906255016/RumyantsevaTati-4681.jpg', '1/7301/906255493/RumyantsevaTati-4487.jpg', '1/6941/906255133/RumyantsevaTati-4490.jpg', '1/7223/906255415/RumyantsevaTati-4678.jpg'], { tags: ['hit'] }],
  ['smetana-15-500-gr', 'smetana-15', '450 г', 'Сметана 15% 450 гр.', 152.88, ['1/8190/906256382/RumyantsevaTati-4487.jpg', '1/1/906256385/RumyantsevaTati-4678.jpg', '1/0/906256384/RumyantsevaTati-4490.jpg'], { tags: ['new', 'hit', 'sale'] }],
  ['smetana-20-200-gr', 'smetana-20', '200 г', 'Сметана 20% 200 гр.', 90.93, ['1/4215/907415671/RumyantsevaTati-4681.jpg', '1/732/906257116/RumyantsevaTati-4494.jpg', '1/1026/906257410/RumyantsevaTati-4491.jpg', '1/1090/906257474/RumyantsevaTati-4687.jpg', '1/2936/906259320/RumyantsevaTati-4832.jpg']],
  ['smetana-20-500-gr', 'smetana-20', '450 г', 'Сметана 20% 450 гр.', 176.82, ['1/3853/906260237/RumyantsevaTati-4494.jpg', '1/3854/906260238/RumyantsevaTati-4491.jpg', '1/3855/906260239/RumyantsevaTati-4687.jpg', '1/3856/906260240/RumyantsevaTati-4832.jpg']],
  ['tvorog-obezzhirennyy-300-gr', 'tvorog-0', '300 г', 'Творог обезжиренный 300 гр.', 138.92, ['1/5109/906269685/RumyantsevaTati-4668.jpg', '1/5801/906270377/RumyantsevaTati-4663.jpg', '1/6193/906270769/RumyantsevaTati-4467.jpg']],
  ['tvorog-5-300-gr', 'tvorog-5', '300 г', 'Творог 5% 300 гр.', 165.48, ['1/637/906273405/RumyantsevaTati-4464.jpg', '1/696/906273464/RumyantsevaTati-4668.jpg']],
  ['tvorog-5-1000-gr', 'tvorog-5', '1 кг', 'Творог 5% 1000 гр.', 332.85, ['1/1094/906273862/RumyantsevaTati-4464.jpg', '1/1095/906273863/RumyantsevaTati-4668.jpg']],
  ['tvorog-9-300-gr', 'tvorog-9', '300 г', 'Творог 9% 300 гр.', 207.9, ['1/7904/906575584/RumyantsevaTati-4675.jpg', '1/7903/906575583/RumyantsevaTati-4668.jpg', '1/7911/906575591/RumyantsevaTati-4826.jpg', '1/7915/906575595/RumyantsevaTati-4465.jpg']],
  ['kefir-25-10-l', 'kefir', '0,95 л', 'Кефир 2,5% 0,95 л', 109.94, ['1/8019/906575699/RumyantsevaTati-4470.jpg', '1/7993/906575673/RumyantsevaTati-4813.jpg'], { tags: ['hit'] }],
  ['yogurt-fruktovyy-25-pitievoy', 'yogurt', 'клубника', 'Йогурт фруктовый 1,5% питьевой клубника 0,3', 76.65, ['1/8081/906575761/RumyantsevaTati-4455.jpg', '1/8078/906575758/RumyantsevaTati-4597.jpg'], { tags: ['hit'] }],
  ['yogurt-fruktovyy-25-pitievoy-chernika', 'yogurt', 'черника', 'Йогурт фруктовый 1,5% питьевой черника 0,3', 76.65, ['1/1637/906577509/RumyantsevaTati-4446.jpg', '1/1267/906577139/RumyantsevaTati-4619.jpg', '1/1319/906577191/RumyantsevaTati-4454.jpg']],
  ['yogurt-fruktovyy-25-pitievoy-vishnya', 'yogurt', 'вишня', 'Йогурт фруктовый 1,5% питьевой вишня 0,3', 75.6, ['1/6251/907860075/RumyantsevaTati-4619.jpg', '1/5395/907859219/RumyantsevaTati-4597.jpg', '1/6695/907860519/RumyantsevaTati-4454.jpg'], { tags: ['hit'] }],
  ['snezhok-25', 'snezhok', 'классический', 'Снежок 2,5% 0,3 мл', 88.52, ['1/561/907854385/RumyantsevaTati-4650.jpg'], { tags: ['new', 'sale'] }],
  ['snezhok-25-s-klinovym-siropom', 'snezhok', 'кленовый сироп', 'Снежок 2,5% с клиновым сиропом 0,3', 94.5, ['1/2610/907856434/RumyantsevaTati-4650.jpg'], { tags: ['new', 'sale'] }],
  ['maslo-krestyanskoe-725-200gr', 'butter', '200 г', 'Масло Крестьянское 72,5% 200гр.', 276.57, ['1/6148/907409412/RumyantsevaTati-5905.jpg', '1/5971/907409235/RumyantsevaTati-5937.jpg', '1/5972/907409236/RumyantsevaTati-5986.jpg', '1/5973/907409237/RumyantsevaTati-5942.jpg', '1/6143/907409407/RumyantsevaTati-5906.jpg'], { tags: ['hit'] }],
  ['maslo-krestyanskoe-725-400gr', 'butter', '400 г', 'Масло Крестьянское 72,5% 400гр.', 520.28, ['1/469/907403733/RumyantsevaTati-5899.jpg', '1/429/907403693/RumyantsevaTati-5909.jpg', '1/440/907403704/RumyantsevaTati-5937.jpg', '1/442/907403706/RumyantsevaTati-5986.jpg', '1/449/907403713/RumyantsevaTati-5942.jpg', '1/450/907403714/RumyantsevaTati-5958.jpg'], { tags: ['hit'] }],
  ['maslo-krestyanskoe-s-chesnokom-725-150gr', 'butter-garlic', '150 г', 'Масло Крестьянское с чесноком 72,5% 150гр.', 270, ['1/5273/3233502361/et_preview_url.jpeg'], { stock: 9 }],
  ['maslo-krestyanskoe-s-provanskimi-travami-725-150gr', 'butter-herbs', '150 г', 'Масло Крестьянское с прованскими травами 72,5% 150гр.', 285, ['1/4561/3233583569/get_preview_url.jpg'], { stock: 6 }],
  ['vareniki-s-kapustoy-i-myasom', 'vareniki-meat', 'на вес', 'Вареники с капустой и мясом', 450, ['1/7193/2981035033/3BD5CCC6-16B8-4989-AC8C-DD6A0DE3FAEE.jpg', '1/7201/2981035041/1C19376A-F411-4ECC-83A0-25A7323E35F4.jpg', '1/7209/2981035049/24A4FC56-B6C3-40D0-9E71-ABDF1CF72BB9.jpg'], { unit: 'кг', stock: 8, tags: ['new'] }],
  ['vareniki-s-kartofelem', 'vareniki-potato', 'на вес', 'Вареники с картофелем', 400, ['1/6985/2981059401/A170ACAC-7D6F-409F-973F-E6CE45E1AFA6.jpg', '1/6961/2981059377/7DDA8986-23B2-4660-BFCA-FF5EE3476B22.jpg', '1/241/2981060849/06D2C9D5-EBE3-495C-BEBC-CB9CD6014052.jpg'], { unit: 'кг', stock: 15, tags: ['new'] }],
  ['pelmeni-s-telyatinoy', 'pelmeni', 'на вес', 'Пельмени с телятиной', 611, ['1/4481/2981073281/2EE60457-11BB-4655-B895-9ABC30EFDBB5.jpg', '1/4489/2981073289/A0B3943C-3F16-4E00-90A9-0BB297D414D0.jpg', '1/4497/2981073297/052D83A0-5201-417D-BE54-019F48849555.jpg', '1/4513/2981073313/701641C9-7F17-4C77-879A-ED7FB71AE7D1.jpg'], { unit: 'кг', stock: 11, tags: ['new'] }],
  ['syrniki-zamorozhennye-1-kg', 'syrniki', '2 кг', 'Сырники замороженные 2 кг', 996, ['1/2513/3017664977/7B6C6070-6F9E-495A-8571-C62BFEC91F61.jpg'], { stock: 9 }],
]

export const ftProducts: FtProduct[] = rows.map(([id, family, variant, name, price, images, extra]) => ({
  id,
  family,
  variant,
  name,
  price,
  unit: 'шт',
  tags: [],
  ...extra,
  images: images.map(cdn),
}))

export const ftFamilyOf = (id: string) => ftFamilies.find((f) => f.id === id)!
// Название без жирности: жирность показывает цветная метка, как на этикетке.
export const ftShortTitle = (f: FtFamily) => (f.fat ? f.title.replace(` ${f.fat}`, '') : f.title)
export const ftVariantsOf = (familyId: string) => ftProducts.filter((p) => p.family === familyId)
export const ftFindProduct = (id: string) => ftProducts.find((p) => p.id === id)

const coverOf = (id: string) => ftFindProduct(id)!.images[0]

export const ftSections: FtSection[] = [
  { id: 'milk', title: 'Молоко', cover: coverOf('moloko-34-45-zhirnosti-15-l') },
  { id: 'smetana', title: 'Сметана', cover: coverOf('smetana-15-200-gr') },
  { id: 'tvorog', title: 'Творог', cover: coverOf('tvorog-9-300-gr') },
  { id: 'kefir', title: 'Кефир и йогурты', cover: coverOf('kefir-25-10-l') },
  { id: 'butter', title: 'Масло', cover: coverOf('maslo-krestyanskoe-725-200gr') },
  { id: 'frozen', title: 'Полуфабрикаты', cover: coverOf('pelmeni-s-telyatinoy') },
]

export const ftTagTitles: Record<FtTag, string> = { new: 'Новинки', hit: 'Хиты продаж', sale: 'Акции' }

export const ftSectionOf = (id: FtSectionId) => ftSections.find((s) => s.id === id)!

export const ftFamiliesOf = (section?: FtSectionId) =>
  section ? ftFamilies.filter((f) => f.section === section) : ftFamilies

export const ftHasTag = (familyId: string, tag: FtTag) => ftVariantsOf(familyId).some((p) => p.tags.includes(tag))

export const ftMinPrice = (familyId: string) => Math.min(...ftVariantsOf(familyId).map((p) => p.price))

// Точки на снимке линейки (img/picnic.jpg, 3:2): координаты в процентах.
export const ftPicnicSpots: { family: string; product: string; x: number; y: number }[] = [
  { family: 'milk-34', product: 'moloko-34-45-zhirnosti-plenka', x: 57, y: 27 },
  { family: 'yogurt', product: 'yogurt-fruktovyy-25-pitievoy', x: 76, y: 40 },
  { family: 'tvorog-5', product: 'tvorog-5-300-gr', x: 34, y: 39 },
  { family: 'smetana-15', product: 'smetana-15-200-gr', x: 49, y: 40 },
  { family: 'smetana-20', product: 'smetana-20-200-gr', x: 59, y: 52 },
  { family: 'butter', product: 'maslo-krestyanskoe-725-200gr', x: 27, y: 57 },
  { family: 'snezhok', product: 'snezhok-25', x: 34, y: 69 },
  { family: 'milk-6', product: 'moloko-6-1l', x: 47, y: 76 },
  { family: 'kefir', product: 'kefir-25-10-l', x: 63, y: 72 },
]

export const ftPopularQueries = ['творог', 'сметана', 'масло', 'кефир', 'пельмени']

export const ftContacts = {
  original: 'https://fermertomska.ru/',
  phone: '+7 913 885-07-77',
  phoneHref: 'tel:+79138850777',
  office: '+7 (38245) 2-20-70',
  officeHref: 'tel:+73824522070',
  fax: '+7 (38245) 2-29-70',
  email: 'fermertomska@gmail.com',
  pickup: 'Томск, ул. Бердская, 29, склад 17',
  pickupHours: 'пн–пт 9:00–15:00, сб 9:00–13:00, вс — выходной',
  production: 'Томская область, Первомайский район, с. Первомайское, ул. Рабочая, 61, стр. 3',
  officeHours: 'пн–пт 9:00–17:20',
  legal: 'ООО ПСПК «Куендатский»',
  inn: '7012012282',
  ogrn: '1207000006619',
  director: 'Зимнюхов Дмитрий Романович',
}

export const ftDelivery = {
  courier: 300,
  freeFrom: 1200,
  pickupMin: 500,
}

export const ftBenefits = [
  { title: 'Всегда свежее', text: 'Собираем заказы утром и сразу везём к вам домой или в офис. Не копим продукты на складе в ожидании дня доставки.' },
  { title: 'Бережная доставка', text: 'Возим в машинах-рефрижераторах, соблюдаем температурный режим.' },
  { title: 'Контроль качества', text: 'Контролируем качество от фермы до полки. Срок хранения молока — 5 суток.' },
]

export const ftFacts = [
  { value: '47', text: 'человек работают на заводе в Первомайском' },
  { value: '5–6 т', text: 'продукции в сутки' },
  { value: '5 суток', text: 'срок хранения молока, сметаны и творога' },
]

export interface FtReview {
  author: string
  date: string
  text: string
  rating: number
}

export const ftReviews: FtReview[] = [
  { author: 'Булгакова Т.', date: '2024-09-10', rating: 5, text: 'Заказываем продукцию уже больше года. Нареканий ни по одному заказу не было — всегда вовремя и в полном комплекте. Качество продукции отличное.' },
  { author: 'Домбровская С.', date: '2024-04-27', rating: 5, text: 'Соотношение цена и качество. Уже сложилось доверие к этой марке, и цены на продукцию очень радуют.' },
  { author: 'Новицкая С.', date: '2023-12-02', rating: 5, text: 'Всё отлично! Плохо, что нет шоколадного масла, сделайте, пожалуйста, оно у вас очень вкусное!' },
]

export const ftPath = (sub = '') => `/redesign/fermertomska${sub}`

const rub = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const rubInt = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })

// Цены с копейками всегда двумя цифрами; целые суммы — без «,00».
export const ftPrice = (value: number) =>
  `${Number.isInteger(value) ? rubInt.format(value) : rub.format(value)} ₽`
// В шапке и таббаре — целые рубли, чтобы кнопки не меняли ширину.
export const ftPriceRound = (value: number) => `${rubInt.format(Math.round(value))} ₽`

export const ftQtyLabel = (qty: number, unit: FtProduct['unit']) => `${qty} ${unit}`

export const ftDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

// ——— Когда привезут ———
// Расписание с оригинала: заказ до 15:00 по Томску. На понедельник и вторник — в пятницу,
// на среду — в понедельник, на четверг — во вторник, на пятницу — в среду, на субботу —
// в четверг. В воскресенье не возят. Октябрьский район — только вт, чт, сб.

// Сколько дней до доставки нужно сделать заказ (по дню недели доставки, 0 — воскресенье).
const leadDays: Record<number, number> = { 1: 3, 2: 4, 3: 2, 4: 2, 5: 2, 6: 2 }
const octoberDays = [2, 4, 6]

// Текущее время в Томске как «UTC-дата»: дальше считаем через getUTC*.
export const ftTomskNow = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tomsk',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value)
  return new Date(Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute')))
}

export interface FtSlot {
  key: string
  date: Date
  deadline: Date
}

export const ftDeliverySlots = (now: Date, october = false, count = 4): FtSlot[] => {
  const slots: FtSlot[] = []
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  for (let i = 1; i <= 21 && slots.length < count; i++) {
    const date = new Date(today + i * 86_400_000)
    const dow = date.getUTCDay()
    if (dow === 0 || (october && !octoberDays.includes(dow))) continue
    const deadline = new Date(date.getTime() - leadDays[dow] * 86_400_000 + 15 * 3_600_000)
    if (deadline > now) slots.push({ key: date.toISOString().slice(0, 10), date, deadline })
  }
  return slots
}

const shortFmt = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: 'numeric', timeZone: 'UTC' })
const genitive = ['воскресенья', 'понедельника', 'вторника', 'среды', 'четверга', 'пятницы', 'субботы']

const accusative = ['в воскресенье', 'в понедельник', 'во вторник', 'в среду', 'в четверг', 'в пятницу', 'в субботу']
const dateFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', timeZone: 'UTC' })

// «в субботу, 24 октября»
export const ftDayLabel = (date: Date) => `${accusative[date.getUTCDay()]}, ${dateFmt.format(date)}`
export const ftDayShort = (date: Date) => shortFmt.format(date)

export const ftDeadlineLabel = (deadline: Date, now: Date) => {
  const days = Math.round(
    (Date.UTC(deadline.getUTCFullYear(), deadline.getUTCMonth(), deadline.getUTCDate()) -
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) /
      86_400_000,
  )
  if (days === 0) return 'сегодня до 15:00'
  if (days === 1) return 'завтра до 15:00'
  return `до 15:00 ${genitive[deadline.getUTCDay()]}`
}

// Сколько осталось до ближайшего срока заказа, если он сегодня.
export const ftLeftToday = (deadline: Date, now: Date) => {
  const ms = deadline.getTime() - now.getTime()
  if (ms <= 0 || ms > 15 * 3_600_000) return null
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  return h ? `${h} ч ${m} мин` : `${m} мин`
}
