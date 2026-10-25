// Концепт редизайна «38пчёл» (https://38pchel.ru/, OpenCart 2.x). Товары, цены вариантов,
// условия и тексты сняты с сайта 25.10.2026. Цены опций — как в OpenCart: к цене минимальной
// фасовки прибавляется надбавка выбранного значения (вес, стекло +50 ₽, липовый мёд).
// Фото лежат в репозитории: сервер оригинала отдаёт их только в /cache/ и медленно.

export type PcSectionId = 'honey' | 'comb' | 'perga' | 'propolis' | 'health' | 'nature' | 'bees'
export type PcZoneId = 'city' | 'far' | 'pickup' | 'russia'

export interface PcValue {
  id: string
  label: string
  // Короткая подпись для чипа в карточке (до ~12 символов).
  short?: string
  delta: number
}

export interface PcOption {
  id: string
  title: string
  values: PcValue[]
  // Показывать чипами в карточке каталога (обычно вес).
  inCard?: boolean
}

export interface PcHoney {
  shade: string
  order: number
  taste: string
  flower: string
}

export interface PcProduct {
  id: string
  pid: number
  title: string
  short: string
  sections: PcSectionId[]
  img: string
  // Снимок во весь кадр (у оригинала — круг на белом), а не стопка на белом.
  cover?: boolean
  // Подпись к цене минимальной фасовки: «за 250 г».
  per: string
  base: number
  options: PcOption[]
  lead: string
  text: string[]
  reviews: number
  honey?: PcHoney
  origin?: string
  note?: string
  source: string
}

export const pcPath = (path = '') => `/redesign/38pchel${path || '/'}`
export const pcImg = (name: string) => `/redesign/38pchel/img/${name}.jpg`

export const pcSections: { id: PcSectionId; title: string; text: string; icon: string }[] = [
  { id: 'honey', title: 'Мёд', text: 'шесть сортов, с орехами', icon: 'drop' },
  { id: 'comb', title: 'Соты', text: 'мёд и перга в сотах', icon: 'comb' },
  { id: 'perga', title: 'Перга и пыльца', text: 'пчелиный хлеб', icon: 'pollen' },
  { id: 'propolis', title: 'Прополис и воск', text: 'прополис, забрус, воск', icon: 'propolis' },
  { id: 'health', title: 'Подмор и гомогенат', text: 'для настоек', icon: 'bee' },
  { id: 'nature', title: 'Дары природы', text: 'кедр, варенье из шишек', icon: 'cone' },
  { id: 'bees', title: 'Пчелосемьи', text: 'карника, улей «Дадан»', icon: 'hive' },
]

const honeyState = (sat = true, clear = true): PcOption => ({
  id: 'state',
  title: 'Состояние мёда',
  values: [
    ...(clear ? [{ id: 'clear', label: 'Прозрачный. Урожай 2026 года', short: 'прозрачный', delta: 0 }] : []),
    ...(sat ? [{ id: 'sat', label: 'Севший (салообразный). Урожай 2026 года', short: 'севший', delta: 0 }] : []),
  ],
})

const honeyWeight = (prices: [number, number, number, number]): PcOption => ({
  id: 'w',
  title: 'Вес',
  inCard: true,
  values: [
    { id: '250', label: '250 г', delta: 0 },
    { id: '500', label: '500 г', delta: prices[1] - prices[0] },
    { id: '1000', label: '1 кг', delta: prices[2] - prices[0] },
    { id: '1400', label: '1 л (1,4 кг)', short: '1 л', delta: prices[3] - prices[0] },
  ],
})

const tare = (glass = 50): PcOption => ({
  id: 'tare',
  title: 'Тара',
  values: [
    { id: 'plastic', label: 'Пластиковый контейнер (бесплатно)', short: 'пластик', delta: 0 },
    { id: 'glass', label: `Стеклянная банка (+${glass} ₽)`, short: 'стекло', delta: glass },
  ],
})

const nutHoney = (linden: number): PcOption => ({
  id: 'honey',
  title: 'Мёд',
  values: [
    { id: 'donnik', label: 'Донниковый', delta: 0 },
    { id: 'esparcet', label: 'Эспарцетовый', delta: 0 },
    { id: 'meadow', label: 'Цветочный', delta: 0 },
    { id: 'buckwheat', label: 'Гречишный', delta: 0 },
    { id: 'linden', label: 'Липовый', delta: linden },
  ],
})

const weights = (list: [string, string, number][], short?: Record<string, string>): PcOption => ({
  id: 'w',
  title: 'Вес',
  inCard: list.length > 1,
  values: list.map(([id, label, price]) => ({ id, label, short: short?.[id], delta: price - list[0][2] })),
})

const honeyRow = [180, 340, 650, 900] as [number, number, number, number]

export const pcProducts: PcProduct[] = [
  {
    id: 'donnik',
    pid: 51,
    title: 'Мёд донниковый',
    short: 'Донниковый',
    sections: ['honey'],
    img: 'honey-donnik',
    per: 'за 250 г',
    base: 180,
    options: [honeyState(), honeyWeight(honeyRow), tare()],
    lead: 'Донниковый мёд относят к первосортным видам.',
    text: [
      'Свежий мёд имеет янтарный цвет, после кристаллизации теряется прозрачность и становится белым, иногда с кремовым оттенком.',
      'Пчёлы делают этот мёд из нектара жёлтого донника — растения из семейства бобовых. На время медосбора вывозим пчёл на поля донника.',
    ],
    reviews: 19,
    honey: { shade: '#f4d465', order: 1, taste: 'светлый, мягкий, после кристаллизации белый', flower: 'донник' },
    source: 'https://38pchel.ru/honey/donnik',
  },
  {
    id: 'linden',
    pid: 79,
    title: 'Мёд липовый',
    short: 'Липовый',
    sections: ['honey'],
    img: 'honey-linden',
    per: 'за 250 г',
    base: 300,
    options: [honeyState(false), honeyWeight([300, 580, 1150, 1600]), tare()],
    lead: 'Липовый мёд обладает мягким и нежным вкусом, обычно он нравится детям.',
    text: ['Рекомендуется при простудных заболеваниях.'],
    origin: 'Место сбора: Республика Башкортостан.',
    reviews: 6,
    honey: { shade: '#f0c73a', order: 2, taste: 'мягкий и нежный, нравится детям', flower: 'липа, Башкирия' },
    source: 'https://38pchel.ru/honey/lipa',
  },
  {
    id: 'esparcet',
    pid: 53,
    title: 'Мёд эспарцетовый',
    short: 'Эспарцетовый',
    sections: ['honey'],
    img: 'honey-esparcet',
    per: 'за 250 г',
    base: 180,
    options: [honeyState(false), honeyWeight(honeyRow), tare()],
    lead: 'Эспарцетовый мёд обладает приятным, нежным вкусом и тонким ароматом розы.',
    text: [
      'Он не приторный и не горчит. Свежий мёд светло-янтарный, после кристаллизации становится белым, с кремовым оттенком.',
      'Пчёлы собирают его с цветков эспарцета — многолетнего травянистого растения из семейства бобовых.',
    ],
    reviews: 12,
    honey: { shade: '#ecb42c', order: 3, taste: 'нежный, с ароматом розы, не горчит', flower: 'эспарцет' },
    source: 'https://38pchel.ru/honey/esparcet',
  },
  {
    id: 'meadow',
    pid: 50,
    title: 'Мёд цветочный (луговой)',
    short: 'Луговой',
    sections: ['honey'],
    img: 'honey-meadow',
    per: 'за 250 г',
    base: 180,
    options: [honeyState(false), honeyWeight(honeyRow), tare()],
    lead: 'Цветочный мёд, ещё его называют мёд с разнотравья.',
    text: [
      'Пчёлы делают его из нектара, который собирают с цветков разного вида растений, обычно дикорастущих трав. Обладает богатым вкусом и ароматом.',
    ],
    reviews: 7,
    honey: { shade: '#e39c1f', order: 4, taste: 'луговое разнотравье, богатый вкус', flower: 'клевер' },
    source: 'https://38pchel.ru/honey/cvetochniy',
  },
  {
    id: 'forest',
    pid: 85,
    title: 'Мёд цветочный (лесной)',
    short: 'Лесной',
    sections: ['honey'],
    img: 'honey-forest',
    per: 'за 250 г',
    base: 180,
    options: [honeyState(), honeyWeight(honeyRow), tare()],
    lead: 'Цветочный мёд с разнотравья лесных полян.',
    text: [
      'Пчёлы делают его из нектара, который собирают с цветков разного вида растений, обычно дикорастущих трав. Обладает богатым вкусом и ароматом.',
    ],
    reviews: 1,
    honey: { shade: '#c4661a', order: 5, taste: 'лесное разнотравье, тёмный и густой', flower: 'лесные травы' },
    source: 'https://38pchel.ru/index.php?route=product/product&path=59&product_id=85',
  },
  {
    id: 'buckwheat',
    pid: 52,
    title: 'Мёд гречишный',
    short: 'Гречишный',
    sections: ['honey'],
    img: 'honey-buckwheat',
    per: 'за 250 г',
    base: 180,
    options: [honeyState(true, false), honeyWeight(honeyRow), tare()],
    lead: 'Гречишный мёд обладает насыщенным ароматом и ярко выраженным вкусом.',
    text: [
      'В нём одновременно сладость, жгучесть и лёгкая горечь. Про него ещё говорят: «Дерёт горло».',
      'Благодаря большому содержанию железа этот мёд рекомендуют при анемии.',
    ],
    origin: 'Гречишный мёд мы уже несколько лет закупаем у проверенного пчеловода из Бийска (Алтайский край).',
    reviews: 6,
    honey: { shade: '#8c4b1f', order: 6, taste: 'терпкий, с жгучестью — «дерёт горло»', flower: 'гречиха, Алтай' },
    source: 'https://38pchel.ru/honey/grechishniy',
  },
  {
    id: 'comb',
    pid: 55,
    title: 'Мёд в сотах',
    short: 'Мёд в сотах',
    sections: ['honey', 'comb'],
    img: 'honey-comb',
    cover: true,
    per: 'за 250 г',
    base: 300,
    options: [
      honeyState(false),
      weights(
        [
          ['250', '250 г', 300],
          ['500', '500 г', 600],
          ['1000', '1 кг', 1200],
          ['frame', 'рамка 1,6+ кг', 1800],
        ],
        { frame: 'рамка' },
      ),
    ],
    lead: 'Мёд в сотах — очень вкусное и полезное лакомство.',
    text: [
      'Пчелиные соты — идеальная тара для мёда. Созревший мёд пчёлы запечатывают восковыми крышечками, и в сотах он долго остаётся жидким, обычно до весны.',
      'Упаковка сотового мёда — 1/6 рамки, от 250 г; можно взять рамку целиком.',
    ],
    reviews: 16,
    source: 'https://38pchel.ru/soty/honey_sot',
  },
  {
    id: 'hazelnut',
    pid: 81,
    title: 'Мёд с фундуком',
    short: 'С фундуком',
    sections: ['honey'],
    img: 'honey-hazelnut',
    cover: true,
    per: 'за 200 г',
    base: 260,
    options: [
      nutHoney(70),
      weights([
        ['200', '200 г', 260],
        ['450', '450 г', 520],
      ]),
      tare(),
    ],
    lead: 'Натуральный мёд на выбор и жареный лесной орех без кожицы.',
    text: ['Состав: натуральный мёд на выбор — 155 г (350 г); жареный фундук без кожицы — 45 г (100 г).'],
    reviews: 0,
    source: 'https://38pchel.ru/honey/s_fundukom',
  },
  {
    id: 'cedar-honey',
    pid: 68,
    title: 'Мёд с кедровым орехом',
    short: 'С кедровым орехом',
    sections: ['honey'],
    img: 'honey-cedar',
    per: 'за 200 г',
    base: 400,
    options: [
      nutHoney(90),
      weights([
        ['200', '200 г', 400],
        ['450', '450 г', 800],
      ]),
      tare(),
    ],
    lead: 'Натуральный мёд на выбор и ядро кедрового ореха.',
    text: ['Состав: натуральный мёд на выбор — 155 г (350 г); ядро кедрового ореха — 45 г (100 г). Настоящее сибирское лакомство.'],
    origin: 'Кедровые орехи: «Забайкальский Продукт», Забайкальский край, с. Красный Чикой.',
    reviews: 4,
    source: 'https://38pchel.ru/honey/s_kedrovim_orehom',
  },
  {
    id: 'perga',
    pid: 63,
    title: 'Перга',
    short: 'Перга',
    sections: ['perga'],
    img: 'perga',
    cover: true,
    per: 'за 50 г',
    base: 250,
    options: [
      weights([
        ['50', '50 г', 250],
        ['100', '100 г', 500],
      ]),
      tare(),
    ],
    lead: 'Перга — ценнейший продукт, заботливо приготовленный пчёлами из цветочной пыльцы.',
    text: [
      'Вкус перги сладковато-кислый. Обычно её принимают в чистом виде, рассасывая под языком до еды.',
      'Профилактическая доза для взрослых — 5–10 г в сутки, курсами по 30 дней с перерывом 1–2 месяца.',
    ],
    reviews: 5,
    source: 'https://38pchel.ru/perga/perga_chistaya',
  },
  {
    id: 'perga-comb',
    pid: 54,
    title: 'Перга в сотах',
    short: 'Перга в сотах',
    sections: ['perga', 'comb'],
    img: 'perga-comb',
    cover: true,
    per: 'за 100 г',
    base: 400,
    options: [],
    lead: 'Перга прямо в сотах, как её запасают пчёлы.',
    text: [
      'Вкус перги сладковато-кислый. Пергу пчёлы складывают в тёмные рамки, чаще в центральную или нижнюю часть.',
    ],
    origin: 'Урожай 2026 года.',
    reviews: 2,
    source: 'https://38pchel.ru/perga/perga_v_sotah',
  },
  {
    id: 'pollen',
    pid: 56,
    title: 'Цветочная пыльца',
    short: 'Пыльца',
    sections: ['perga'],
    img: 'pollen',
    cover: true,
    per: 'за 100 г',
    base: 300,
    options: [
      weights([
        ['100', '100 г', 300],
        ['500', '500 г', 1500],
      ]),
      tare(),
    ],
    lead: 'Пыльца, которую пчёлы складывают в корзиночки на лапках комочками.',
    text: [
      'Пчёлы вычёсывают пыльцу щёточками ног и складывают в корзиночки на лапках комочками — так получается «обножка».',
      'Пыльца — хороший биостимулятор: увеличивает гемоглобин, вызывает аппетит и бодрость.',
    ],
    reviews: 1,
    source: 'https://38pchel.ru/pilca/pilca_cvetochnaya',
  },
  {
    id: 'propolis',
    pid: 57,
    title: 'Прополис',
    short: 'Прополис',
    sections: ['propolis'],
    img: 'propolis',
    cover: true,
    per: 'за 10 г',
    base: 250,
    options: [
      weights([
        ['10', '10 г', 250],
        ['100', '100 г', 2500],
      ]),
    ],
    lead: 'Прополис, или пчелиный клей, — смолистое вещество, собираемое пчёлами с деревьев.',
    text: [
      'Берёза, сосна, тополь — пчёлы перерабатывают смолу своими ферментами и поддерживают им стерильность в улье.',
      'Обладает антибактериальным и противовоспалительным действием. Из него делают настойки, мази, используют в чистом виде.',
    ],
    reviews: 2,
    source: 'https://38pchel.ru/other/propolis',
  },
  {
    id: 'zabrus',
    pid: 59,
    title: 'Забрус',
    short: 'Забрус',
    sections: ['propolis'],
    img: 'zabrus',
    cover: true,
    per: 'за 100 г',
    base: 100,
    options: [
      weights([
        ['100', '100 г', 100],
        ['500', '500 г', 500],
        ['1000', '1 кг', 900],
      ]),
    ],
    lead: 'Восковые крышечки, которыми пчёлы запечатывают созревший мёд.',
    text: ['В его составе есть вещества, которых в откачанном мёде существенно меньше или нет совсем, — например, лизоцим.'],
    origin: 'Дата производства: июль 2026 года.',
    reviews: 4,
    source: 'https://38pchel.ru/other/zabrus',
  },
  {
    id: 'wax',
    pid: 58,
    title: 'Пчелиный воск',
    short: 'Воск',
    sections: ['propolis'],
    img: 'wax',
    cover: true,
    per: 'за 200 г',
    base: 300,
    options: [
      weights([
        ['200', '200 г', 300],
        ['500', '500 г', 750],
        ['1000', '1 кг', 1500],
      ]),
    ],
    lead: 'Воск выделяется восковыми железами пчёл, из него они строят соты.',
    text: [
      'Твёрдое вещество жёлтого цвета, от светло-жёлтого до бурого, с характерным медовым запахом.',
      'Из него готовят мази и кремы, делают восковые свечи.',
    ],
    reviews: 4,
    source: 'https://38pchel.ru/other/vosk',
  },
  {
    id: 'cloth',
    pid: 78,
    title: 'Прополисный холстик',
    short: 'Холстик',
    sections: ['propolis'],
    img: 'propolis-cloth',
    cover: true,
    per: 'за штуку',
    base: 400,
    options: [],
    lead: 'Отрезок хлопчатобумажной ткани около 50×50 см, которым закрывается гнездо пчёл.',
    text: [
      'Служит защитой от сквозняка и от насекомых из-под крышки и утеплителя: чужих пчёл, ос, восковой моли.',
      'Самый простой способ — повесить холстик на горячую батарею: воздух наполнится ароматом прополиса.',
    ],
    reviews: 1,
    source: 'https://38pchel.ru/other/holstik',
  },
  {
    id: 'podmor',
    pid: 60,
    title: 'Пчелиный подмор',
    short: 'Подмор',
    sections: ['health'],
    img: 'podmor',
    cover: true,
    per: 'за 20 г',
    base: 200,
    options: [
      weights(
        [
          ['20', '20 г (стакан)', 200],
          ['100', '100 г', 700],
        ],
        { '20': '20 г' },
      ),
    ],
    lead: 'Подмор — тела погибших пчёл, которые и после смерти приносят пользу.',
    text: [
      'В хитиновом покрове пчёл содержатся гепарин и гепароиды. Как мазь-линимент подмор помогает при тромбофлебитах и болезнях суставов.',
      'Линимент храните во флаконе из тёмного стекла в холодильнике.',
    ],
    reviews: 0,
    source: 'https://38pchel.ru/other/podmor',
  },
  {
    id: 'homogenate',
    pid: 84,
    title: 'Трутнёвый гомогенат',
    short: 'Гомогенат',
    sections: ['health'],
    img: 'homogenate',
    cover: true,
    per: 'за 30 г',
    base: 300,
    options: [],
    lead: 'Трутнёвое молочко — выжимка трутнёвого расплода.',
    text: [
      'Нативный, замороженный, 2025 год. Богат микроэлементами: калий, натрий, кальций, фосфор, магний, железо, марганец, медь и цинк.',
      'Принимают примерно за 30 минут до еды, рассасывая под языком, лучше утром или днём.',
    ],
    reviews: 0,
    source: 'https://38pchel.ru/other/gomogenat',
  },
  {
    id: 'pine-jam',
    pid: 83,
    title: 'Варенье из сосновых шишек',
    short: 'Варенье из шишек',
    sections: ['nature'],
    img: 'pine-jam',
    per: 'за банку',
    base: 550,
    options: [],
    lead: 'Лакомство с оригинальным вкусом из молодых сосновых шишек.',
    text: ['Незаменимо для зимнего чаепития. Состав: шишки сосновые, сахар, вода. Вес 480 г, стеклянная банка.'],
    reviews: 0,
    source: 'https://38pchel.ru/honey/var_iz_shishki',
  },
  {
    id: 'cedar-nuts',
    pid: 74,
    title: 'Кедровые орехи очищенные',
    short: 'Кедровые орехи',
    sections: ['nature'],
    img: 'cedar-nuts',
    cover: true,
    per: 'за 100 г',
    base: 550,
    options: [],
    lead: 'Ядро кедрового ореха по ГОСТ 31852-2012.',
    text: ['Вакуумная упаковка по 100 г. Ядра содержат кедровое масло, незаменимые аминокислоты, микроэлементы.'],
    origin: 'Производитель: ООО «Дары Сибири», Иркутская область, Заларинский район.',
    reviews: 2,
    source: 'https://38pchel.ru/kedr/yadro_kedrovogo_oreha',
  },
  {
    id: 'bees',
    pid: 62,
    title: 'Пчелосемьи',
    short: 'Пчелосемья',
    sections: ['bees'],
    img: 'bees',
    cover: true,
    per: 'за пчелосемью',
    base: 15000,
    options: [],
    lead: 'Продаём пчёл породы карника: продуктивны, не ройливы, прекрасно зимуют и при этом миролюбивы.',
    text: [
      'Племенных маток завозим из Германии и выводим маток из лучших семей. Весной продаём пчелосемьи, способные дать за сезон 60 кг и более товарного мёда.',
      'Ульи системы «Дадан», высота рамок 300 мм. Комплектация — 10 рамок. Готовность к продаже — начало мая.',
    ],
    reviews: 0,
    note: 'Запись на сезон — по телефону, без предоплаты.',
    source: 'https://38pchel.ru/bee/pchelosemya_v_irkutske',
  },
]

export const pcHoneys = pcProducts.filter((p) => p.honey).sort((a, b) => a.honey!.order - b.honey!.order)

export const pcFindProduct = (id: string) => pcProducts.find((p) => p.id === id)

// Значения по умолчанию — первые в каждой опции, как предвыбирает OpenCart.
export const pcDefaults = (p: PcProduct): Record<string, string> =>
  Object.fromEntries(p.options.map((o) => [o.id, o.values[0].id]))

export const pcPrice = (p: PcProduct, picks: Record<string, string>) =>
  p.options.reduce((sum, o) => sum + (o.values.find((v) => v.id === picks[o.id])?.delta ?? 0), p.base)

export const pcPickLabel = (p: PcProduct, picks: Record<string, string>) =>
  p.options
    .filter((o) => o.values.length > 1)
    .map((o) => o.values.find((v) => v.id === picks[o.id]))
    .filter(Boolean)
    .map((v) => (v!.short ?? v!.label).replace(/\.? ?Урожай 2026 года/, ''))
    .join(' · ') || p.per.replace(/^за /, '')

export const pcCardOption = (p: PcProduct) => p.options.find((o) => o.inCard)

export const pcZones: {
  id: PcZoneId
  title: string
  text: string
  price: number | null
  freeFrom: number | null
  min: number
}[] = [
  {
    id: 'city',
    title: 'Иркутск',
    text: 'Привезём сами, обычно в день заказа',
    price: 200,
    freeFrom: 1000,
    min: 600,
  },
  {
    id: 'far',
    title: 'Ленинский район, Зелёный, тракты, Шелехов',
    text: 'Ленинский район, мкр. Зелёный, Байкальский и Голоустненский тракты, г. Шелехов',
    price: 200,
    freeFrom: 1500,
    min: 600,
  },
  {
    id: 'pickup',
    title: 'Самовывоз',
    text: 'По договорённости: ул. Радищева, 50 — первая остановка от Маратовского кольца',
    price: 0,
    freeFrom: null,
    min: 0,
  },
  {
    id: 'russia',
    title: 'По России',
    text: 'Транспортной компанией или почтой, полная предоплата. Стоимость пересылки сообщим',
    price: null,
    freeFrom: null,
    min: 0,
  },
]

export const pcContacts = {
  original: 'https://38pchel.ru/',
  phone: '+7 (908) 66-15-222',
  phoneHref: 'tel:+79086615222',
  phoneName: 'Сергей',
  phone2: '+7 (908) 66-14-222',
  phone2Href: 'tel:+79086614222',
  email: '38pchel@mail.ru',
  hours: '9:00–22:00',
  pickup: 'г. Иркутск, ул. Радищева, 50',
  apiary: 'Иркутский район, 10 км от п. Оёк',
  vk: 'https://vk.com/38pchel',
  youtube: 'https://www.youtube.com/channel/UCDKz5boLQnOVnFFXHfaGzQg',
  yandex: 'https://yandex.ru/maps/org/38_pchyol/1703912598',
  gis: 'https://2gis.ru/irkutsk/geo/70000001025268113',
  avito: 'https://www.avito.ru/brands/i7990964',
}

const rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
export const pcRub = (n: number) => `${rub.format(n)} ₽`

export const pcPlural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few
  return many
}

export interface PcReview {
  author: string
  date: string
  text: string
  source?: string
  product?: string
}

// Отзывы с https://38pchel.ru/comment (№89–102) и из карточек товаров, тексты как на сайте.
export const pcReviewsTotal = 102
export const pcStoreReviews: PcReview[] = [
  { author: 'Александр', date: '6 февраля 2025', source: 'Авито', text: 'Очень вкусный мёд, брал в рамках. Грамотный пчеловод. Рекомендую!' },
  { author: 'Ольга', date: '28 января 2025', source: 'Авито', text: 'И мёд, и соты понравились. Очень вкусный мёд эспарцетовый. Буду ещё заказывать.' },
  {
    author: 'Валерия Михайлова',
    date: '20 ноября 2024',
    source: '2ГИС',
    text: 'Прекрасный мёд. Очень вкусный, всегда ароматный. Едим всей семьёй. Сергей всегда подробно расскажет о мёде и продуктах пчеловодства. Являюсь постоянным покупателем в течение 4 лет.',
  },
  {
    author: 'Наталья Вихристюк',
    date: '20 ноября 2024',
    source: '2ГИС',
    text: 'Натуральный вкусный мёд. Были на этой пасеке несколько лет назад, экологически чистое место. С тех пор заказываем мёд только в этом интернет-магазине.',
  },
  {
    author: 'Мария Яковлевна',
    date: '26 июня 2024',
    source: 'Яндекс Карты',
    text: 'Покупала мёд, очень понравился. Вкусный и свежий, упакован хорошо, доставка очень быстрая, в тот же день, когда и заказывали.',
  },
  { author: 'Виктория Л.', date: '31 марта 2024', source: '2ГИС', text: 'Любим донниковый, а с орешками кедровыми вообще супер. Пол-баночки уже нет за вечер. Спасибо большое.' },
  { author: 'Николай', date: '7 февраля 2024', source: 'Авито', text: 'Большое спасибо Сергею, откликнулся сразу, доставка до подъезда, весь вечер дегустировали, класс.' },
  { author: 'Вика Наумова', date: '17 декабря 2023', source: 'Яндекс Карты', text: 'Часто беру мёд в сотах. Всегда вкусно, всегда хорошо упаковано. Обожаю и беру только у них.' },
  {
    author: 'Екатерина Фаткулова',
    date: '28 августа 2023',
    source: 'Яндекс Карты',
    text: 'Беру продукты пчеловодства только тут, есть доставка по городу. Доставка в этот же день до дома. Очень удобно.',
  },
  {
    author: 'Евгения',
    date: '20 июля 2023',
    source: 'Яндекс Карты',
    text: 'Часто заказываю здесь мёд с доставкой. Всегда привозят мёд высшего качества. Доставка всегда в день заказа, при условии оформления в первой половине дня. Рекомендую также мёд в сотах.',
  },
  { author: 'simbad1973', date: '20 июля 2023', source: 'Яндекс Карты', text: 'Брал пчелопакеты. Отличное качество.' },
  {
    author: 'Мария',
    date: '18 апреля 2023',
    source: 'Яндекс Карты',
    text: 'Первый раз купили мёд месяц назад. Взяли на пробу три вида и соты. Очень достойный мёд, ничем не разбодяженный. Буду ещё заказывать.',
  },
  {
    author: 'Анастасия Р.',
    date: '18 декабря 2022',
    source: 'Яндекс Карты',
    text: 'Покупаю мёд уже 3 года, очень вкусный, без сахара. Иногда беру небольшие стеклянные баночки с наклейками в подарок.',
  },
]

export const pcProductReviews: (PcReview & { product: string; rating: number })[] = [
  {
    product: 'donnik',
    author: 'Ольга',
    date: '30.07.2022',
    rating: 5,
    text: 'Самый лучший мёд, как из детства. Беру мёд у семьи Черепановых уже лет 10 с благодарностью, держат марку.',
  },
  { product: 'donnik', author: 'Мария', date: '24.11.2021', rating: 5, text: 'Это самый лучший в мире мёд! Такой ароматный! И отдельное спасибо за доставку в г. Братск.' },
  { product: 'donnik', author: 'Ирина', date: '03.08.2021', rating: 5, text: 'Замечательный мёд. Консистенция, аромат, цвет — это настоящее качество. Всем советую.' },
  { product: 'esparcet', author: 'Светлана', date: '04.08.2025', rating: 5, text: 'Мёд с мягкими ароматом и вкусом. Нравится.' },
  {
    product: 'esparcet',
    author: 'Илья',
    date: '17.11.2024',
    rating: 5,
    text: 'Очень хороший эспарцетовый мёд. Вкус обалденный, не горчит. Детям моим очень нравится. Спасибо за бесплатную доставку!',
  },
  { product: 'esparcet', author: 'Андреева Лариса', date: '11.10.2020', rating: 5, text: 'Мёд прекрасен! Бархатный, нежнейший на вкус. Я теперь ваш постоянный покупатель.' },
  {
    product: 'comb',
    author: 'Снежана',
    date: '03.04.2026',
    rating: 5,
    text: 'Каждый год покупаем здесь мёд. Всегда отличный вкус и хорошее качество. Приятно, что можно доверять продавцу.',
  },
  { product: 'comb', author: 'Сергей', date: '17.09.2025', rating: 5, text: 'Мёд в сотах — это тема, такой не подделаешь. Не первый раз уже берём, очень вкусный.' },
  { product: 'comb', author: 'Михаил', date: '08.03.2025', rating: 5, text: 'Очень хорошие, вкусные соты, нам всем в семье понравились.' },
  {
    product: 'perga',
    author: 'Татьяна',
    date: '14.03.2025',
    rating: 5,
    text: 'Отличная перга! Свежая, мягкая, сладкая. Буквально назавтра привезли домой после заявки, благодарна за скорость!',
  },
  { product: 'perga', author: 'Наталья', date: '19.12.2024', rating: 5, text: 'Отличное качество! Использую как витаминное средство. Огромное спасибо вам, Юлия и Сергей!' },
  { product: 'linden', author: 'Алексей', date: '23.11.2022', rating: 5, text: 'Ничего не ел вкуснее в жизни, чем этот мёд.' },
  { product: 'linden', author: 'Елизавета', date: '28.08.2022', rating: 5, text: 'Взяли на пробу. Мёд очень вкусный! Будем брать ещё.' },
  { product: 'linden', author: 'Маргарита', date: '20.02.2022', rating: 5, text: 'Мёд очень вкусный! Спасибо вам и вашим пчёлам за такую вкуснятину.' },
]

// Фотодневник сезона 2026 с https://38pchel.ru/news/2026, подписи владельца.
export const pcSeason: { img: string; date: string; text: string }[] = [
  { img: 'season-1', date: '24 марта', text: 'Выставили пчёл из омшаника' },
  { img: 'season-12', date: '9 июня', text: 'Пасека в Хомутово. Всё ещё цветёт яблоня' },
  { img: 'season-13', date: '11 июня', text: 'Цветёт шиповник' },
  { img: 'season-16', date: '20 июня', text: 'Зацвёл эспарцет' },
  { img: 'season-21', date: '2 июля', text: 'Пик цветения эспарцета' },
  { img: 'season-29', date: '14 июля', text: 'Цветёт донник' },
  { img: 'season-31', date: '15 июля', text: 'Полностью запечатанные рамки — значит, созрел мёд' },
  { img: 'season-42', date: '17 июля', text: 'В наличии два вида мёда урожая 2026 года: эспарцетовый и луговое разнотравье' },
  { img: 'season-44', date: '5 августа', text: 'Лесная герань' },
]

// Вехи с https://38pchel.ru/history_paseka.
export const pcHistory: { year: number; text: string; img?: string }[] = [
  { year: 1991, text: 'Отец купил несколько пчелосемей — с них началась семейная пасека. Сергей познакомился с пчёлами в 11 лет.' },
  { year: 1994, text: 'Пасека в Московщине. Сергею 14 лет, рядом мама и младший брат Женя.', img: 'old-1994' },
  { year: 2004, text: 'Пасека в Хандагае. «Отец и сын».', img: 'old-2004' },
  { year: 2012, text: 'Пасека в 10 км от Оёка.', img: 'old-2012' },
  { year: 2016, text: 'Три поколения Черепановых.', img: 'old-2016' },
]
