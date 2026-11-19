<script lang="ts" setup>
import '~/assets/scss/home.scss'
import { cases } from '~/data/cases'

useHomeHead()
useSeoMeta({
  title: 'Концепты редизайна | webdozerz',
  robots: 'noindex, nofollow',
})

// В каталоге — только избранные концепты, в этом порядке. Остальные живут по прямым ссылкам (из писем)
// и остаются в allProjects, чтобы любой можно было вернуть сюда одной строкой.
const featured = [
  'olimpfish',
  'domoteka',
  'sovelan',
  'moreland',
  'smolryba',
  'oyster',
  'zdrava22',
  'zolotieluga',
  'rkdon',
  '22bee',
  'fermertomska',
  'sibirtreid',
  'sibprod',
]

const allProjects = [
  {
    to: '/redesign/domoteka/',
    image: '/redesign/domoteka/og.jpg',
    title: 'Домотека',
    text: 'Фабрика кухонных и письменных столов и стульев в Москве с 1989 года: «Собери стол» на первом экране — модель, их образцы столешницы и ножек, снимок меняется на настоящий вариант со склада, план сверху показывает стол сложенным и разложенным; 33 модели и 132 варианта с фильтрами по типу, серии, размеру кухни и механизму раскладки, сравнение и избранное, где купить — маркетплейсы и магазины Москвы на карте, кабинет дилера с регистрацией, инструкции по сборке.',
    source: 'https://domoteka.com/',
    tags: ['Nuxt 3', 'Vue', '1С-Битрикс'],
  },
  {
    to: '/redesign/sovelan/',
    image: '/redesign/sovelan/og.jpg',
    title: 'Созвездие вкуса',
    text: 'Кондитерское производство в Пензе, Ореховые Эланки® и Виланки®: «Календарь праздников» на первом экране — их сезонные коллекции по ближайшим датам с живым «до Нового года N дней»; 574 позиции в 21 коллекции с поиском, фото «изделие ↔ в упаковке», заявка штуками с весом позиции и общим весом заказа, телефон и ИП/ООО как у оригинала, розница — их магазины на Ozon, Wildberries и Яндекс Маркете.',
    source: 'https://sovelan.ru/',
    tags: ['Nuxt 3', 'Vue', 'самописный PHP'],
  },
  {
    to: '/redesign/moreland/',
    image: '/redesign/moreland/og.jpg',
    title: 'Морелэнд',
    text: 'Рыбный цех в Омске с 1998 года, опт от коробки: «В дым» на первом экране — их сельдь сырая и копчёная под шторкой, рядом свежие партии из новостей с ценой; 74 позиции копчёной, вяленой рыбы и пресервов с оптовой ценой за кг и суммой за коробку, датой цены и ссылкой на новость, заявка коробками с готовым текстом в «Написать нам» или на почту, лента новостей с прайс-листами, подписка, вход.',
    source: 'https://moreland.ru/',
    tags: ['Nuxt 3', 'Vue', '1С-Битрикс'],
  },
  {
    to: '/redesign/smolryba/',
    image: '/redesign/smolryba/og.jpg',
    title: 'Рыбная база',
    text: 'Рыба, морепродукты и икра оптом и в розницу со склада в Смоленске: «прайс на сегодня» прямо на первом экране — лист их каталога цен на воде с вкладками разделов и мгновенным поиском, цена за килограмм или штуку, вес и стоимость коробки, список заказа коробками с готовой заявкой в MAX, Telegram или на почту, скачивание прайса .xlsx, «Перезвоните мне» и консультация.',
    source: 'https://смолрыба.рф/',
    tags: ['Nuxt 3', 'Vue', 'October CMS'],
  },
  {
    to: '/redesign/olimpfish/',
    image: '/redesign/olimpfish/og.jpg',
    title: 'Олимп',
    text: 'Рыба, икра и морепродукты от производителя из Москвы: «отрез» на первом экране — нож идёт по куску белуги, балыка нерки или осетра и прилипает к их фасовкам, сумма считается по цене за килограмм; цена за любой вес в карточке и на странице товара, «Быстрая покупка» без регистрации, корзина с тарифами доставки по зонам МКАД и расчётом по километрам, заявка для оптовиков, декларации, вакансии с резюме.',
    source: 'https://olimp-fish.ru',
    tags: ['Nuxt 3', 'Vue', 'WooCommerce'],
  },
  {
    to: '/redesign/apeti/',
    image: '/redesign/apeti/og.jpg',
    title: 'Apeti',
    text: 'Фермерские продукты с Преображенского рынка с доставкой по Москве: «весы» на первом экране — товар на чаше, стрелка идёт шагом порции, сумма считается сразу, мясо можно попросить превратить в фарш, рыбу — почистить; цена за килограмм и порция в карточке, район доставки со своим минимальным заказом в шапке и корзине, окна по три часа, промокод и баллы, «Купить в 1 клик».',
    source: 'https://apeti.ru',
    tags: ['Nuxt 3', 'Vue', '1С-Битрикс'],
  },
  {
    to: '/redesign/kuzbasskay/',
    image: '/redesign/kuzbasskay/og.jpg',
    title: 'Кузбасская птицефабрика',
    text: 'Птицефабрика из Новокузнецкого района с 1966 года: «калибровка яйца» на первом экране — пять категорий в масштабе массы со штампом маркировки, упаковки С0/С1/С2, мясо несушки и полуфабрикаты с «Узнать цену» в отдел продаж (мелкий и крупный опт), 30 комбикормов и премиксов с фильтром по животным, цеха с галереями, вакансии, поиск и карта сайта.',
    source: 'https://www.kuzbasskay.ru',
    tags: ['Nuxt 3', 'Vue', 'самописная CMS'],
  },
  {
    to: '/redesign/oyster/',
    image: '/redesign/oyster/og.jpg',
    title: 'Oyster Market',
    text: 'Живые морепродукты и деликатесы с доставкой по Москве в день заказа: устрицы по размерам с ценой за штуку, «устричная карта» с полудюжиной и дюжиной в один клик, открывание устриц, ежей и гребешка под ценой, живой срок «закажите до 19:00 — привезём сегодня», порог доставки машиной и −5% за самовывоз в корзине, сеты, выездной устричный бар, опт для HoReCa.',
    source: 'https://oyster.market',
    tags: ['Nuxt 3', 'Vue', '1С-Битрикс'],
  },
  {
    to: '/redesign/zdrava22/',
    image: '/redesign/zdrava22/og.jpg',
    title: 'Пасека «Ширяев и сыновья»',
    text: 'Семейная пасека из Алтайского края с 40-летней историей: пять сортов мёда от акациевого до молочаевого в рознице коробкой 12 кг и оптом куботейнером 34 кг с переключателем цен, пыльца, перга, гомогенат и пчелопакеты, форма заказа, которая сама собирает текст заказа, 148 отзывов, 19 видео и фото пасеки.',
    source: 'https://zdrava22.ru',
    tags: ['Nuxt 3', 'Vue', 'MODX'],
  },
  {
    to: '/redesign/dereda/',
    image: '/redesign/dereda/og.jpg',
    title: 'Дереда',
    text: 'Фермерский интернет-магазин из Новосибирска с 2012 года: у каждого товара — фермер, который его сделал, страница и фильтр «Фермеры», доставка по вторникам и пятницам с отсчётом до конца приёма заказов, зоны с порогом бесплатной доставки в корзине, фасовки 0,5/2,5 кг, предзаказ, накопительная скидка и промокод на день рождения.',
    source: 'https://dereda.ru',
    tags: ['Nuxt 3', 'Vue', 'InSales'],
  },
  {
    to: '/redesign/gornyimed/',
    image: '/redesign/gornyimed/og.jpg',
    title: 'Пасеки Соловьёвых',
    text: 'Семейная пасека из Горного Алтая: гречишный и разнотравье 2026 года в банках 1, 1,5 и 3 кг с ценой за килограмм, опт куботейнерами в той же корзине, мёд в стиках для кафе, экспорт, документы, 92 новости и фотогалерея кочевой пасеки.',
    source: 'https://gornyimed.ru',
    tags: ['Nuxt 3', 'Vue', 'Yii'],
  },
  {
    to: '/redesign/mpkchita/',
    image: '/redesign/mpkchita/og.jpg',
    title: 'Маккавеевский пищекомбинат',
    text: 'Мясокомбинат из Читы: колбасы, деликатесы, полуфабрикаты и рыба — у каждой позиции своя страница с составом, сроком годности и фасовкой, «прилавок» по разделам на главной, 39 магазинов «Маккавеевский» по районам со статусом «открыто сейчас» по времени Читы, акции с отсчётом дней, сравнение состава. Без корзины — как у оригинала.',
    source: 'http://mpk-chita.ru',
    tags: ['Nuxt 3', 'Vue', 'OpenCart'],
  },
  {
    to: '/redesign/zolotieluga/',
    image: '/redesign/zolotieluga/og.jpg',
    title: '«Золотые луга»',
    text: 'Молочный комбинат из Тюменской области: 21 продукт марок «Золотые луга» и «Ситниковское» с жирностью, сроком годности, пищевой ценностью и наградами по годам, «Где купить» — 313 магазинов в 9 городах на карте с запоминанием города, партнёрам, вакансии по городам и новости. Без корзины — как у оригинала.',
    source: 'https://zolotie-luga.ru',
    tags: ['Nuxt 3', 'Vue', '1С-Битрикс'],
  },
  {
    to: '/redesign/rkdon/',
    image: '/redesign/rkdon/og.jpg',
    title: 'Рыбокомбинат Донской',
    text: 'Корпоративный сайт производителя рыбных снеков из Ростовской области: 32 позиции весовой рыбы и кальмара с составом и сроком годности, три входа для оптовика, сети под своей маркой и покупателя «Тиксов», 15 пачек с цветом линейки и вкусами, производство, новости и вакансии. Без корзины — как у оригинала: заказ через отдел продаж.',
    source: 'https://rkdon.ru',
    tags: ['Nuxt 3', 'Vue', '1С-Битрикс'],
  },
  {
    to: '/redesign/fermaaltaya/',
    image: '/redesign/fermaaltaya/og.jpg',
    title: 'Ферма Алтая',
    text: 'Фермерские продукты с бесплатной доставкой в Новосибирск и Барнаул: 181 товар в 17 разделах с иконками из логотипа фермы, живая неделя доставки с отсчётом до конца приёма, весовое мясо с суммой «≈ за упаковку», корзина с городом, оплатой, баллами 2 % и минимальным заказом, вход, избранное, 39 магазинов-партнёров.',
    source: 'https://ferma-altaya.ru',
    tags: ['Nuxt 3', 'Vue', '5CMS'],
  },
  {
    to: '/redesign/izyumovskoe/',
    image: '/redesign/izyumovskoe/og.jpg',
    title: 'КФХ «Изюмовское»',
    text: 'Фермерская птица из Омской области: перепел, бройлер и утка с ценой за кг и суммой «≈ за тушку», суточные утята, гусята и цыплята от 10 голов с памятками по содержанию, говядина «Герефорд». Корзина делит заказ на доставку мяса и самовывоз молодняка, сравнение, вход, «в один клик».',
    source: 'https://изюмовское.рф',
    tags: ['Nuxt 3', 'Vue', 'Megagroup'],
  },
  {
    to: '/redesign/22bee/',
    image: '/redesign/22bee/og.jpg',
    title: 'Мёд и Соты',
    text: 'Алтайский мёд оптом с собственных пасек: прайс 9 сортов куботейнерами по 34 кг с ценой от 34 и от 200 кг, подсказка «ещё 3 куботейнера — и 480 ₽/кг», заявка с весом, суммой и готовым письмом, страницы сортов, документы пасеки и 27 отзывов.',
    source: 'https://22bee.ru',
    tags: ['Nuxt 3', 'Vue', 'Megagroup'],
  },
  {
    to: '/redesign/aks124/',
    image: '/redesign/aks124/og.jpg',
    title: 'ИП Аксюченко',
    text: 'Оптовая бакалея, кондитерка, чай и кофе со склада в Красноярске: каталог листами брендов с ценой за штуку и упаковку, поиск по прайсу, бренды А–Я, список заказа упаковками со шкалой до бесплатной доставки и готовым письмом.',
    source: 'https://aks124.ru',
    tags: ['Nuxt 3', 'Vue', 'Megagroup'],
  },
  {
    to: '/redesign/baltikprodukt/',
    image: '/redesign/baltikprodukt/og.jpg',
    title: 'Балтик продукт',
    text: 'Рыбная база в Туле с 1995 года, опт и розница +3 %: прайс на 354 позиции с поиском, цена коробкой с подсказкой «ещё 6 банок — и цена 74 ₽», список заказа с готовым письмом менеджеру, условия и реквизиты на одной странице.',
    source: 'https://www.baltikprodukt.ru',
    tags: ['Nuxt 3', 'Vue', '1С-Битрикс'],
  },
  {
    to: '/redesign/papinalavka/',
    image: '/redesign/papinalavka/og.jpg',
    title: 'Папина лавка',
    text: 'Натуральные продукты с экоферм под заказ, Воронеж: доска ближайших поставок с датами и сроком заказа на первом экране, 34 раздела с круглыми фото и деревянными табличками, поиск с подсказками, корзина с датой привоза у каждой позиции, доставкой или одним из 7 офисов.',
    source: 'https://papinalavka.ru',
    tags: ['Nuxt 3', 'Vue', 'самописная CMS'],
  },
  {
    to: '/redesign/mrkfish/',
    image: '/redesign/mrkfish/og.jpg',
    title: 'Миякинская Рыбная Компания',
    text: 'Производитель копчёной, солёной и вяленой рыбы из Башкортостана, опт без цен на сайте: каталог 58 позиций по разделам вместо одностраничника, фасовки в карточке, «В заявку» в кг или упаковках и готовый запрос прайса в отдел продаж, две площадки с картами.',
    source: 'https://www.mrkfish.ru',
    tags: ['Nuxt 3', 'Vue', 'Платформа LP'],
  },
  {
    to: '/redesign/produkt24/',
    image: '/redesign/produkt24/og.jpg',
    title: '24produkt',
    text: 'Продукты оптом и в розницу со склада в Красноярске: прайс из 1С на 645 позиций с поиском и понятными группами, три колонки цен одним переключателем, список с весом до доставки от 200 кг и крупного опта от 1 т, готовая заявка менеджеру вместо корзины.',
    source: 'https://24-produkt.ru',
    tags: ['Nuxt 3', 'Vue', 'Drupal'],
  },
  {
    to: '/redesign/mnerozy/',
    image: '/redesign/mnerozy/og.jpg',
    title: 'Мне розы',
    text: 'Круглосуточная доставка цветов по Томску: охапка роз Эквадор поштучно на первом экране — число, цвет и длина, цена за розу сама снижается на ступенях 15/25/51; поиск с фото и ценой, варианты оформления с доплатой в карточке, зоны доставки, дата и интервал в оформлении.',
    source: 'https://mnerozy.ru',
    tags: ['Nuxt 3', 'Vue', 'OpenCart'],
  },
  {
    to: '/redesign/naslagdenia/',
    image: '/redesign/naslagdenia/og.jpg',
    title: 'Наслаждение',
    text: 'Сеть кондитерских в Новосибирске: два пути на первом экране — готовый торт сегодня с живым временем доставки и заказной к дате; расчёт заказного торта по числу гостей с начинкой из готовых тортов, ближайшей датой и предоплатой, пирожные с ценой коробки, 12 магазинов на карте.',
    source: 'https://naslagdenia.com',
    tags: ['Nuxt 3', 'Vue', 'MODX'],
  },
  {
    to: '/redesign/bukety/',
    image: '/redesign/bukety/og.jpg',
    title: 'Любимые Букеты',
    text: 'Круглосуточная доставка цветов по Томску: подбор букета по получателю и бюджету на первом экране, живое «привезём к 15:20», состав и варианты с ценой в карточке, открытка с превью, фото вручения, анонимная доставка и выбор интервала в оформлении.',
    source: 'https://bukety.tomsk.ru',
    tags: ['Nuxt 3', 'Vue', 'OpenCart'],
  },
  {
    to: '/redesign/38pchel/',
    image: '/redesign/38pchel/og.jpg',
    title: '38пчёл',
    text: 'Семейная пасека Черепановых под Иркутском: «медовая линейка» из шести сортов от светлого к тёмному, цена каждой фасовки сразу в карточке, прозрачный или севший мёд, пластик или стекло, доставка по зонам Иркутска и фотодневник сезона.',
    source: 'https://38pchel.ru',
    tags: ['Nuxt 3', 'Vue', 'OpenCart'],
  },
  {
    to: '/redesign/lavkafish/',
    image: '/redesign/lavkafish/og.jpg',
    title: 'Лавка Fish',
    text: 'Охлаждённая форель из Хакасии и морепродукты под привоз: каталог из постов Telegram-канала с датами привоза и остатками, цена сама снижается по лесенке «от 3 шт», расчёт суммы по весу и предоплата 1 кг, зоны доставки Томска и Новосибирска.',
    source: 'https://lavkafish.com',
    tags: ['Nuxt 3', 'Vue', 'Tilda'],
  },
  {
    to: '/redesign/fermatomsk/',
    image: '/redesign/fermatomsk/og.jpg',
    title: 'FermaTomsk',
    text: 'Семейная ферма из посёлка Рассвет: история и фото фермы на первом экране, продукты с ценами, список заказа, который сам складывается в сообщение для Telegram или MAX, ближайший день доставки.',
    source: 'https://fermatomsk.ru',
    tags: ['Nuxt 3', 'Vue', 'был одностраничник'],
  },
  {
    to: '/redesign/fermertomska/',
    image: '/redesign/fermertomska/og.jpg',
    title: '«Куендатское»',
    text: 'Молочный завод из Первомайского с доставкой по Томску: снимок всей линейки с ценами по нажатию, фасовки в одной карточке, расчёт дня доставки по расписанию завода, корзина без обязательной регистрации.',
    source: 'https://fermertomska.ru',
    tags: ['Nuxt 3', 'Vue', 'InSales'],
  },
  {
    to: '/redesign/sibirtreid/',
    image: '/redesign/sibirtreid/og.jpg',
    title: '«СибирьТрейд»',
    text: 'Крупнооптовые поставки продуктов из Новосибирска в Якутию: сцена с товарами при прокрутке, каталог из 373 позиций с ценой за упаковку, заявка со шкалой до минимального заказа, цветные формы прайса.',
    source: 'https://sibirtreid.ru',
    tags: ['Nuxt 3', 'Vue', 'WooCommerce'],
  },
  {
    to: '/redesign/rybasibiri/',
    image: '/redesign/rybasibiri/og.jpg',
    title: '«Стиль Продукт»',
    text: 'Рыба и морепродукты из своих цехов в Кемерове: переключатель «Розница / Опт», магазин с понятной ценой за кг и за 100 г, оптовый прайс с заявкой, услуги копчения и заморозки.',
    source: 'https://www.rybasibiri.ru',
    tags: ['Nuxt 3', 'Vue', 'Wix'],
  },
  {
    to: '/redesign/sanych/',
    image: '/redesign/sanych/og.jpg',
    title: 'Мясная лавка «Саныч»',
    text: 'Доставка фермерского мяса по Новосибирску: каталог с ценой за кг и весом куска, выбор разделки, корзина с примерной суммой, опт и рецепты.',
    source: 'http://доставка-мяса.рф',
    tags: ['Nuxt 3', 'Vue', 'конструктор setup.ru'],
  },
  {
    to: '/redesign/tomich/',
    image: '/redesign/tomich/og.jpg',
    title: 'Торговый Дом «Томич»',
    text: 'Мясо, полуфабрикаты и обеды в офис в Томске: меню на завтра, конструктор комплексного обеда, корзина с печатной формой, магазины и кафе.',
    source: 'https://myaso.tomsk.ru',
    tags: ['Nuxt 3', 'Vue', 'самописный сайт'],
  },
  {
    to: '/redesign/foodgood/',
    image: '/redesign/foodgood/og.jpg',
    title: 'FoodGood Tomsk',
    text: 'Магазин здоровой еды на Taplink: 111 товаров по разделам, поиск с подсказками, «Сейчас в сезоне» и корзина, которая собирает заказ для мессенджера.',
    source: 'https://foodgoodtomsk.ru',
    tags: ['Nuxt 3', 'Vue', 'e-commerce'],
  },
  {
    to: '/redesign/sttorg70/',
    image: '/redesign/sttorg70/og.jpg',
    title: 'СТ-ТОРГ70',
    text: 'Продукты оптом и в розницу. Статичные экраны для перекраски WordPress/WooCommerce: главная, каталог, карточка, корзина, доставка.',
    source: 'https://sttorg70.ru',
    tags: ['HTML/CSS', 'WooCommerce', 'только визуал'],
    plain: true,
  },
  {
    to: '/redesign/prodagro/',
    image: '/redesign/prodagro/og.jpg',
    title: 'ПродАгро',
    text: 'Продукты оптом и в розницу в Иркутске: цены за штуку и упаковку, корзина с доставкой от 3 000 ₽, страница для бизнеса.',
    source: 'https://prodmak38.ru',
    tags: ['HTML/CSS', 'Simpla CMS', 'только визуал'],
    plain: true,
  },
  {
    to: '/redesign/sibprod/',
    image: '/redesign/sibprod/og.jpg',
    title: 'Сибирский продукт',
    text: 'Доставка продуктов по Новосибирску: каталог с выпадающим меню, ближайший интервал доставки, своя марка «Сливкин Дом», корзина с выбором дня и времени.',
    source: 'https://sibprod.info',
    tags: ['HTML/CSS', '1С-Битрикс', 'только визуал'],
    plain: true,
  },
]

// Внедрённые — концепты, у которых есть кейс (data/cases.ts): новый дизайн уже работает на сайте клиента.
// Они идут отдельным блоком над концептами, в порядке кейсов.
const slug = (to: string) => to.split('/')[2]
const bySlug = (s: string) => allProjects.find((p) => slug(p.to) === s)
const caseSlugs = cases.map((c) => c.slug)

// Текст и стек — из кейса: клиенту важнее, что концепт стал работающим сайтом, чем перечень функций.
const live = cases
  .filter((c) => bySlug(c.slug))
  .map((c) => ({ ...bySlug(c.slug)!, text: c.lead, tags: c.tags, caseTo: `/cases/${c.slug}/` }))
const projects = featured
  .filter((s) => !caseSlugs.includes(s))
  .map((s) => ({ ...bySlug(s)!, caseTo: '' }))

// Внедрённых две колонки; нечётный последний — во всю ширину горизонтально, чтобы ряд не зиял.
const isWide = (i: number) => i === live.length - 1 && live.length % 2 === 1

const ui = useHomeUi()
onMounted(() => ui.syncTheme())

// Домен без протокола и www; строкой, а не через URL, чтобы кириллица не превратилась в punycode.
const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '')
const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <div class="home catalog">
    <div class="shell">
      <NuxtLink to="/" class="catalog__back">
        ← На сайт
      </NuxtLink>

      <header class="catalog__head">
        <span class="catalog__kicker mono">redesign / {{ pad(live.length + projects.length) }} концептов</span>
        <h1 class="catalog__title">
          Концепты редизайна
        </h1>
        <p class="catalog__lead">
          Демонстрационные версии сайтов местного бизнеса. Это не официальные сайты компаний:
          тексты, цены и изображения принадлежат их владельцам.
        </p>
      </header>

      <section v-if="live.length" class="catalog__section">
        <div class="catalog__section-head">
          <h2 class="catalog__section-title">
            Внедрено у клиентов
          </h2>
          <p class="catalog__section-note">
            Концепт понравился владельцу — и новый дизайн перенесён на их рабочий сайт. Как это было — в кейсе.
          </p>
        </div>

        <ul class="catalog__grid">
          <li
            v-for="(p, i) in live"
            :key="p.to"
            class="concept concept--live"
            :class="{ 'concept--wide': isWide(i) }"
          >
            <span class="concept__badge mono">
              <i class="concept__pulse" aria-hidden="true" />
              Работает на сайте клиента
            </span>
            <NuxtLink :to="p.caseTo" class="concept__preview" tabindex="-1" aria-hidden="true">
              <img :src="p.image" alt="" width="1200" height="630" loading="lazy">
            </NuxtLink>

            <div class="concept__body">
              <div class="concept__meta mono">
                <span>кейс</span>
                <span>{{ host(p.source) }}</span>
              </div>
              <h3 class="concept__title">
                {{ p.title }}
              </h3>
              <p class="concept__text">
                {{ p.text }}
              </p>
              <p class="concept__stack mono">
                {{ p.tags.join(' · ') }}
              </p>
              <div class="concept__actions">
                <NuxtLink :to="p.caseTo" class="h-btn h-btn--primary">
                  Читать кейс
                </NuxtLink>
                <RedesignCatalogLink :to="p.to" :plain="p.plain" class="h-btn">
                  Концепт
                </RedesignCatalogLink>
                <a :href="p.source" target="_blank" rel="noopener" class="h-btn">
                  Сайт клиента
                  <svg class="concept__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" /></svg>
                </a>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <section class="catalog__section">
        <div v-if="live.length" class="catalog__section-head">
          <h2 class="catalog__section-title">
            Концепты
          </h2>
          <p class="catalog__section-note">
            Как мог бы выглядеть сайт — на их товарах, ценах и функциях.
          </p>
        </div>

        <ul class="catalog__grid">
        <li v-for="(p, i) in projects" :key="p.to" class="concept">
          <RedesignCatalogLink :to="p.to" :plain="p.plain" class="concept__preview" tabindex="-1" aria-hidden="true">
            <img v-if="p.image" :src="p.image" alt="" width="1200" height="630" loading="lazy">
            <span v-else class="concept__placeholder">{{ p.title.replace(/[«»]/g, '') }}</span>
          </RedesignCatalogLink>

          <div class="concept__body">
            <div class="concept__meta mono">
              <span>{{ pad(i + 1) }}</span>
              <span>{{ host(p.source) }}</span>
            </div>
            <h3 class="concept__title">
              {{ p.title }}
            </h3>
            <p class="concept__text">
              {{ p.text }}
            </p>
            <p class="concept__stack mono">
              {{ p.tags.join(' · ') }}
            </p>
            <div class="concept__actions">
              <RedesignCatalogLink :to="p.to" :plain="p.plain" class="h-btn h-btn--primary">
                Посмотреть
              </RedesignCatalogLink>
              <a :href="p.source" target="_blank" rel="noopener" class="h-btn">
                Оригинал
                <svg class="concept__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" /></svg>
              </a>
            </div>
          </div>
        </li>
      </ul>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.catalog {
  padding: 32px 0 96px;

  &__back {
    color: var(--h-muted);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--h-text);
    }
  }

  &__head {
    max-width: 680px;
    margin: 56px 0 48px;
  }

  &__kicker {
    color: var(--h-accent);
    font-size: 12px;
  }

  &__title {
    margin: 12px 0 0;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.025em;
  }

  &__lead {
    margin: 16px 0 0;
    color: var(--h-muted);
    font-size: 16px;
    line-height: 1.6;
  }

  &__section + &__section {
    margin-top: 64px;
  }

  &__section-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px 24px;
    margin-bottom: 20px;
  }

  &__section-title {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.015em;
  }

  &__section-note {
    max-width: 520px;
    margin: 0;
    color: var(--h-muted);
    font-size: 14px;
    line-height: 1.5;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
}

.concept {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--h-line);
  border-radius: 14px;
  background: var(--h-surface);
  overflow: hidden;
  transition: border-color 0.2s, transform 0.25s, box-shadow 0.25s;

  &:hover {
    border-color: var(--h-line-strong);
    box-shadow: var(--h-shadow);
    transform: translateY(-3px);
  }

  &__preview {
    display: block;
    aspect-ratio: 1200 / 630;
    border-bottom: 1px solid var(--h-line);
    background: var(--h-raised);
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  &:hover &__preview img {
    transform: scale(1.035);
  }

  &__placeholder {
    display: grid;
    place-items: center;
    height: 100%;
    padding: 24px;
    background:
      radial-gradient(circle at 1px 1px, var(--h-dot) 1px, transparent 0) 0 0 / 18px 18px,
      radial-gradient(120% 90% at 0% 0%, var(--h-accent-glow), transparent 60%);
    color: var(--h-text);
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 600;
    letter-spacing: -0.02em;
    text-align: center;
  }

  &__body {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    padding: 22px 24px 24px;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    color: var(--h-faint);
    font-size: 12px;

    span:first-child {
      color: var(--h-accent);
    }
  }

  &__title {
    margin: 10px 0 0;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  &__text {
    flex-grow: 1;
    margin: 10px 0 0;
    color: var(--h-text-soft);
    font-size: 15px;
    line-height: 1.55;
  }

  &__stack {
    margin: 16px 0 0;
    color: var(--h-faint);
    font-size: 12px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;

    .h-btn {
      gap: 6px;
      height: 40px;
      padding: 0 16px;
      font-size: 14px;
    }
  }

  &__arrow {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

// Внедрённый концепт: переливающаяся рамка, мягкое свечение и плашка «работает на сайте клиента».
@property --concept-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.concept--live {
  position: relative;
  border-color: transparent;
  box-shadow: 0 0 0 1px var(--h-accent-glow), 0 18px 48px -18px var(--h-accent);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 2;
    padding: 2px;
    border-radius: inherit;
    background: conic-gradient(
      from var(--concept-angle),
      var(--h-accent),
      #b06cff,
      #ff6fae,
      #ffb547,
      #3fd8b0,
      var(--h-accent)
    );
    mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
    animation: concept-spin 5s linear infinite;
    pointer-events: none;
  }

  &:hover {
    box-shadow: 0 0 0 1px var(--h-accent-glow), 0 24px 64px -16px var(--h-accent);
  }

  .concept__preview img {
    // Превью внедрённого может быть выше своих 1200×630 — держим левый верх, где заголовок первого экрана.
    object-position: left top;
  }
}

// Одиночный (или нечётный последний) внедрённый — во всю ширину: превью слева, текст справа.
.concept--wide {
  grid-column: 1 / -1;
  flex-direction: row;

  .concept__preview {
    flex: 0 0 56%;
    aspect-ratio: auto;
    min-height: 100%;
    border-right: 1px solid var(--h-line);
    border-bottom: 0;
  }

  .concept__body {
    justify-content: center;
    padding: 32px 36px;
  }

  .concept__title {
    font-size: 26px;
  }
}

.concept__badge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(10, 12, 16, 0.78);
  color: #fff;
  font-size: 12px;
  backdrop-filter: blur(8px);
  pointer-events: none;
}

.concept__pulse {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3fd88a;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #3fd88a;
    animation: concept-ping 1.8s ease-out infinite;
  }
}

@keyframes concept-spin {
  to {
    --concept-angle: 360deg;
  }
}

@keyframes concept-ping {
  from {
    opacity: 0.7;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .concept--live::before,
  .concept__pulse::after {
    animation: none;
  }
}

@media (max-width: 960px) {
  .concept--wide {
    flex-direction: column;

    .concept__preview {
      flex: none;
      aspect-ratio: 1200 / 630;
      min-height: 0;
      border-right: 0;
      border-bottom: 1px solid var(--h-line);
    }

    .concept__body {
      padding: 24px;
    }

    .concept__title {
      font-size: 22px;
    }
  }
}

@media (max-width: 760px) {
  .catalog {
    padding-top: 20px;

    &__head {
      margin: 36px 0 32px;
    }

    &__section + &__section {
      margin-top: 48px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .concept__body,
  .concept--wide .concept__body {
    padding: 18px 18px 20px;
  }

  .concept__badge {
    top: 12px;
    left: 12px;
  }
}

@media (max-width: 420px) {
  .catalog .shell {
    padding: 0 16px;
  }

  .concept__actions .h-btn {
    flex: 1;
    justify-content: center;
    white-space: nowrap;
  }

  // У внедрённого три кнопки: «Читать кейс» отдельной строкой, остальные две под ней.
  .concept--live .concept__actions .h-btn--primary {
    flex-basis: 100%;
  }
}
</style>
