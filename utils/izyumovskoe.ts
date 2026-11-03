// Каталог КФХ «Изюмовское» (Омская область, д. Гауф) снят с https://изюмовское.рф/ в ноябре 2026 (Megagroup shop2):
// все 25 товаров трёх разделов — мясо птицы, суточная птица, говядина «Герефорд». Цены — как на сайте; у 19 товаров
// там «0 руб.», в концепте это «цена по запросу». Описания сокращены до фактов (вес тушки, возраст, время приготовления),
// полные тексты о содержании молодняка — в izCare (из описаний оригинала).
// Фото скопированы в public/redesign/izyumovskoe/img/ и ужаты: у оригинала кириллический домен и тяжёлые исходники.

export type IzSectionId = 'myaso' | 'molodnyak' | 'govyadina'

export interface IzSection {
  id: IzSectionId
  title: string
  short: string
  motto: string
  icon: string
  tile: string
}
export interface IzGroup {
  id: string
  title: string
  section: IzSectionId
  parent?: string
}
export interface IzProduct {
  id: string
  title: string
  section: IzSectionId
  group: string
  img: string
  // null — «0 руб.» у оригинала: цену называют по телефону
  price: number | null
  unit: 'кг' | 'гол.'
  stock: boolean
  min: number
  // вес тушки, кг — для суммы «≈» при цене за кг
  weight?: [number, number]
  age?: string
  cook?: string
  adult?: string
  label?: string
  isNew?: boolean
  lead: string
}

export const izSections: IzSection[] = [
  { id: 'myaso', title: 'Мясо птицы', short: 'Мясо птицы', motto: 'Качество вкуса', icon: 'ico-ptica.jpg', tile: 'tile-myaso.jpg' },
  { id: 'molodnyak', title: 'Суточные цыплята, утята, гусята', short: 'Молодняк', motto: 'Племенная птица', icon: 'ico-cyplenok.jpg', tile: 'tile-molodnyak.jpg' },
  { id: 'govyadina', title: 'Говядина «Герефорд»', short: 'Говядина', motto: 'Зерновой откорм', icon: 'ico-korova.jpg', tile: 'tile-govyadina.jpg' },
]

export const izGroups: IzGroup[] = [
  { id: 'perepel', title: 'Перепел', section: 'myaso' },
  { id: 'brojler', title: 'Бройлер', section: 'myaso' },
  { id: 'utka', title: 'Утка', section: 'myaso' },
  { id: 'mulard', title: 'Утка «Мулард»', section: 'myaso', parent: 'utka' },
  { id: 'indoutka', title: 'Индоутка', section: 'myaso', parent: 'utka' },
  { id: 'agidel', title: 'Утка «Агидель»', section: 'myaso', parent: 'utka' },
  { id: 'subprodukty', title: 'Субпродукты', section: 'myaso' },
  { id: 'brojler-sut', title: 'Бройлер', section: 'molodnyak' },
  { id: 'utka-sut', title: 'Утка', section: 'molodnyak' },
  { id: 'gus-sut', title: 'Гусь', section: 'molodnyak' },
  { id: 'nesushka', title: 'Несушка', section: 'molodnyak' },
  { id: 'govyadina-all', title: 'Говядина «Герефорд»', section: 'govyadina' },
]

const img = (f: string) => `/redesign/izyumovskoe/img/${f}`

export const izProducts: IzProduct[] = [
  { id: 'perepel', title: 'Перепел', section: 'myaso', group: 'perepel', img: img('perepel.jpg'), price: 800, unit: 'кг', stock: true, min: 1, weight: [0.3, 0.35], cook: '20–30 мин', label: 'Хит продаж', lead: 'Диетическое мясо для тех, кто следит за фигурой и здоровьем. Отлично для запекания.' },
  { id: 'brojler', title: 'Бройлер', section: 'myaso', group: 'brojler', img: img('brojler.jpg'), price: 350, unit: 'кг', stock: true, min: 1, weight: [1.6, 2.5], age: 'от 2 до 2,5 месяца', cook: '40–50 мин', label: 'Хит продаж', lead: 'Птица не моложе 2 месяцев — росла без ускорителей роста, и не старше 2,5 — мясо мягкое и сочное.' },
  { id: 'utka-mulard', title: 'Утка «Мулард»', section: 'myaso', group: 'mulard', img: img('utka-mulard.jpg'), price: null, unit: 'кг', stock: false, min: 1, weight: [2.5, 3], age: '3–3,5 месяца', cook: '2–3 ч', lead: 'Гибрид индоутки и «Агидели»: нежирное и при этом сочное мясо.' },
  { id: 'indoutka', title: 'Индоутка', section: 'myaso', group: 'indoutka', img: img('indoutka.jpg'), price: null, unit: 'кг', stock: false, min: 1, weight: [1.8, 3], age: '3–4 месяца', cook: '2–3 ч', lead: 'Диетическое мясо без лишнего внутреннего жира, плотное — для праздничного ужина.' },
  { id: 'utka-agidel', title: 'Утка «Агидель»', section: 'myaso', group: 'agidel', img: img('utka-agidel.jpg'), price: null, unit: 'кг', stock: false, min: 1, weight: [2, 3], age: '3–3,5 месяца', cook: '2–3 ч', lead: 'Нежное сочное мясо с небольшим жирком. Для плова и запекания.' },
  { id: 'pechen-kurinaya', title: 'Печень куриная', section: 'myaso', group: 'subprodukty', img: img('pechen-kurinaya.jpg'), price: null, unit: 'кг', stock: false, min: 1, lead: 'Субпродукты бройлеров с нашей фермы.' },
  { id: 'serdechki-kurinye', title: 'Сердечки куриные', section: 'myaso', group: 'subprodukty', img: img('serdechki-kurinye.jpg'), price: null, unit: 'кг', stock: false, min: 1, lead: 'Субпродукты бройлеров с нашей фермы.' },
  { id: 'zheludki-kurinye', title: 'Желудки куриные очищенные', section: 'myaso', group: 'subprodukty', img: img('zheludki-kurinye.jpg'), price: null, unit: 'кг', stock: false, min: 1, lead: 'Субпродукты бройлеров с нашей фермы, очищенные.' },
  { id: 'pechen-utinaya', title: 'Печень утиная', section: 'myaso', group: 'subprodukty', img: img('pechen-utinaya.jpg'), price: null, unit: 'кг', stock: false, min: 1, lead: 'Субпродукты уток «Мулард», индоутки и «Агидели».' },
  { id: 'zheludki-utinye', title: 'Желудки утиные потрошёные', section: 'myaso', group: 'subprodukty', img: img('zheludki-utinye.jpg'), price: null, unit: 'кг', stock: false, min: 1, lead: 'Субпродукты уток «Мулард», индоутки и «Агидели».' },
  { id: 'serdechki-utinye', title: 'Сердечки утиные', section: 'myaso', group: 'subprodukty', img: img('serdechki-utinye.jpg'), price: null, unit: 'кг', stock: false, min: 1, lead: 'Субпродукты уток «Мулард», индоутки и «Агидели».' },

  { id: 'utka-star-53', title: 'Утка «Стар-53»', section: 'molodnyak', group: 'utka-sut', img: img('utka-star-53.jpg'), price: 180, unit: 'гол.', stock: true, min: 10, adult: '≈ 3,5 кг', isNew: true, lead: 'Французский кросс мясо-яичного направления: большой вес при малом расходе корма, крепкий иммунитет.' },
  { id: 'cyplenok-brojler', title: 'Цыплёнок-бройлер', section: 'molodnyak', group: 'brojler-sut', img: img('cyplenok-brojler.jpg'), price: 100, unit: 'гол.', stock: true, min: 10, adult: '2,5 кг к двум месяцам', lead: 'Кросс ROSS-308 — выживаемость молодняка 98–99 %. В два месяца набирает оптимальную массу.' },
  { id: 'gus', title: 'Гусь «Крупный серый»', section: 'molodnyak', group: 'gus-sut', img: img('gus.jpg'), price: 370, unit: 'гол.', stock: true, min: 10, adult: 'гусак до 6,5 кг, гусыня 5–5,5 кг', lead: 'Уральские серые гуси крупной конституции, не требуют особого подхода к содержанию.' },
  { id: 'indoutka-sut', title: 'Индоутка', section: 'molodnyak', group: 'utka-sut', img: img('indoutka-sut.jpg'), price: null, unit: 'гол.', stock: true, min: 10, adult: 'самец 4–5,5 кг, самка 2,2–3,4 кг', lead: 'Спокойные, не крякают, обходятся без водоёма. За 3–3,5 месяца набирают 2,5–4 кг.' },
  { id: 'utka-agidel-sut', title: 'Утка «Агидель»', section: 'molodnyak', group: 'utka-sut', img: img('utka-agidel-sut.jpg'), price: null, unit: 'гол.', stock: true, min: 10, lead: 'Российский бройлерный гибрид из Башкортостана: «Благоварская», «Супер М» и индийские бегуны.' },
  { id: 'utka-bashkirskaya', title: 'Утка «Башкирская цветная»', section: 'molodnyak', group: 'utka-sut', img: img('utka-bashkirskaya.jpg'), price: null, unit: 'гол.', stock: true, min: 10, adult: 'утка 3,5 кг, селезень 4–4,5 кг', lead: 'Крепкие утята: встают на лапки через несколько часов после рождения. Мясо — за 1,5–2 месяца.' },
  { id: 'goluboj-favorit', title: 'Утка «Голубой фаворит»', section: 'molodnyak', group: 'utka-sut', img: img('goluboj-favorit.jpg'), price: null, unit: 'гол.', stock: true, min: 10, adult: 'селезень до 5 кг, утка 4 кг', lead: 'Мясная порода с голубым дымчатым пером: скороспелая, мирная, хорошо привыкает к новому месту.' },
  { id: 'utka-mulard-sut', title: 'Утка «Мулард»', section: 'molodnyak', group: 'utka-sut', img: img('utka-mulard-sut.jpg'), price: null, unit: 'гол.', stock: false, min: 10, adult: 'тушка 6–7 кг', lead: 'Крупные скороспелые утки мясного направления, жира около 3 % от массы.' },
  { id: 'cyplyata-nesushki', title: 'Цыплята-несушки «Хайсекс Браун»', section: 'molodnyak', group: 'nesushka', img: img('cyplyata-nesushki.jpg'), price: 120, unit: 'гол.', stock: false, min: 10, lead: 'Яичный кросс: выживаемость 96–97 %, первая кладка примерно в 5 месяцев.' },
  { id: 'nesushka-molodka', title: 'Несушка-молодка «Хайсекс Браун»', section: 'molodnyak', group: 'nesushka', img: img('nesushka-molodka.jpg'), price: null, unit: 'гол.', stock: false, min: 10, lead: 'Подрощенная молодка яичного кросса: несётся хорошо и без петуха в стаде.' },

  { id: 'rebryshki', title: 'Рёбрышки', section: 'govyadina', group: 'govyadina-all', img: img('rebryshki.jpg'), price: null, unit: 'кг', stock: true, min: 1, label: 'Хит продаж', lead: 'Маринованные рёбра, запечённые в духовке в фольге или в рукаве, — для семейного ужина и застолья.' },
  { id: 'okorok', title: 'Окорок (мякоть)', section: 'govyadina', group: 'govyadina-all', img: img('okorok.jpg'), price: null, unit: 'кг', stock: true, min: 1, label: 'Хит продаж', lead: 'Мякоть окорока бычков «Герефорд» на зерновом откорме.' },
  { id: 'grudinka', title: 'Грудинка', section: 'govyadina', group: 'govyadina-all', img: img('grudinka.jpg'), price: null, unit: 'кг', stock: true, min: 1, label: 'Рекомендуем', lead: 'Гордость техасского барбекю: запечь целиком, нарезать кубиками и подпечь с соусом.' },
  { id: 'gulyash', title: 'Гуляш', section: 'govyadina', group: 'govyadina-all', img: img('gulyash.jpg'), price: null, unit: 'кг', stock: true, min: 1, label: 'Быстрый ужин', lead: 'Нарезанная говядина «Герефорд» — сразу в сотейник.' },
]

export const izContacts = {
  original: 'https://изюмовское.рф/',
  company: 'ООО «КФХ «Изюмовское»',
  phones: ['+7 (903) 927-27-17', '+7 (903) 927-38-34'],
  email: 'tema-808@mail.ru',
  address: 'Омская область, Азовский немецкий национальный район, д. Гауф, ул. Промзона, стр. 1',
  short: 'д. Гауф, Азовский район',
  hours: 'Пн–Пт 9:00–20:00',
  tz: 'Омск, UTC+6',
  since: 2007,
  req: { inn: '5509006678', kpp: '550901001', ogrn: '1085509000059', okpo: '82999619', okved: '01.24' },
}

export const izDeliveryCost = 350

export const izWays = [
  { id: 'courier', title: 'Курьером по Омску', price: '350 ₽', text: 'Привезём в удобное для вас время и место. Доставка распространяется только на мясо птицы.' },
  { id: 'meet', title: 'Встреча в согласованном месте', price: 'бесплатно', text: 'Если готовы встретиться в удобное для нас время или на нейтральной территории — место согласуем накануне.' },
  { id: 'pickup', title: 'Самовывоз с фермы', price: 'бесплатно', text: 'Заберите заказ прямо с фермы в д. Гауф, оплата наличными при получении.' },
] as const
export type IzWay = (typeof izWays)[number]['id']

export const izPays = [
  { id: 'cash', title: 'Наличными при получении', text: 'Курьеру, при встрече или на ферме.' },
  { id: 'card', title: 'Картой онлайн', text: 'Visa и MasterCard: кнопка «Оплатить» после оформления.' },
  { id: 'invoice', title: 'Безналичный расчёт', text: '100 % предоплата на расчётный счёт по договору-оферте.' },
] as const
export type IzPay = (typeof izPays)[number]['id']

export const izPath = (p = '') => `/redesign/izyumovskoe${p ? p : '/'}`
export const izProduct = (id: string) => izProducts.find((p) => p.id === id)
export const izSection = (id: string) => izSections.find((s) => s.id === id)
export const izGroup = (id: string) => izGroups.find((g) => g.id === id)
export const izImg = (f: string) => img(f)

export const izMoney = (n: number) => `${Math.round(n).toLocaleString('ru-RU')} ₽`
export const izPriceText = (p: IzProduct) => (p.price === null ? 'Цена по запросу' : `${izMoney(p.price)}/${p.unit === 'кг' ? 'кг' : 'гол.'}`)
export const izKg = (n: number) => `${n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} кг`

// Мясо продаётся за кг, а покупают тушками: «≈ 560–875 ₽ за тушку»
export const izPerCarcass = (p: IzProduct) =>
  p.price !== null && p.weight ? ([Math.round(p.weight[0] * p.price), Math.round(p.weight[1] * p.price)] as [number, number]) : null

// Сколько товаров в разделе / группе (группа-родитель считает детей)
export const izInGroup = (p: IzProduct, g: string) => p.group === g || izGroup(p.group)?.parent === g
export const izCount = (section: IzSectionId) => izProducts.filter((p) => p.section === section).length
export const izFrom = (section: IzSectionId) => {
  const prices = izProducts.filter((p) => p.section === section && p.price !== null && p.stock).map((p) => p.price as number)
  return prices.length ? Math.min(...prices) : null
}

// Склонение: 1 голова, 2 головы, 5 голов
export const izPlural = (n: number, one: string, few: string, many: string) => {
  const a = Math.abs(n) % 100
  const b = a % 10
  if (a > 10 && a < 20) return many
  if (b > 1 && b < 5) return few
  if (b === 1) return one
  return many
}
export const izQtyText = (p: IzProduct, n: number) =>
  p.unit === 'гол.' ? `${n} ${izPlural(n, 'голова', 'головы', 'голов')}` : p.weight ? `${n} ${izPlural(n, 'тушка', 'тушки', 'тушек')}` : izKg(n)
