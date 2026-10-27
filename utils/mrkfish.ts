// Концепт редизайна mrkfish.ru — «Миякинская Рыбная Компания», Миякинский район Башкортостана.
// Данные сняты с оригинала (Платформа LP, одностраничник) в октябре 2026: 58 позиций в четырёх разделах, цен на сайте нет —
// оптовый прайс высылают по заявке. Фото продукции и территории скопированы в public/redesign/mrkfish/ и уменьшены:
// оригиналы весят до 1,8 МБ, на телефоне каталог из 58 таких снимков грузился бы минуты.

export type MfSectionId = 'smoked' | 'salted' | 'dried' | 'frozen'

export interface MfProduct {
  id: string
  section: MfSectionId
  name: string
  note: string
  packs: string[]
  img: string
}

export interface MfSection {
  id: MfSectionId
  title: string
  short: string
  unit: 'кг' | 'уп.'
  cover: string
  where: string
  intro: string
}

export const mfSections: MfSection[] = [
  {
    id: 'smoked',
    title: 'Копчёная рыба',
    short: 'Копчёная',
    unit: 'кг',
    cover: 'hero-trout.jpg',
    where: 'Ерлыково',
    intro:
      'Холодное копчение на натуральном дыме из щепы ольхи и бука и родниковой воде. Рыба теряет половину влаги, но сохраняет полезные свойства и дольше хранится.',
  },
  {
    id: 'salted',
    title: 'Солёная рыба и пресервы',
    short: 'Солёная и пресервы',
    unit: 'уп.',
    cover: '4788952a1072ed67b27d01da78bba83f.jpg',
    where: 'Киргиз-Мияки',
    intro: 'Филе-кусочки в масле и заливке, ассорти, рулеты, морская капуста и малосольная рыба в вёдрах по 3–5 кг.',
  },
  {
    id: 'dried',
    title: 'Вяленая рыба',
    short: 'Вяленая',
    unit: 'кг',
    cover: '7c9e8db3faf9a2f75fc50e658ff9a4ca.jpg',
    where: '',
    intro: 'При вялке рыба приобретает вкус, цвет и аромат и сохраняет фтор, кальций и фосфор.',
  },
  {
    id: 'frozen',
    title: 'Свежемороженая рыба',
    short: 'Свежемороженая',
    unit: 'кг',
    cover: '31cbadf693613c8fb8db26c5248ffda8.jpg',
    where: 'Ерлыково',
    intro: 'Правильная заморозка и хранение: рыба и морепродукты почти не теряют витамины и аминокислоты и долго хранятся.',
  },
]

export const mfProducts: MfProduct[] = [
  { id: 'forel-file-slabosolenaya', section: 'smoked', name: 'Форель филе', note: 'холодного копчения, слабосоленая', packs: [], img: '801d7b0b75f50be53fc55ca11477b7d9.jpg' },
  { id: 'bryushki-semgi-slabosolenye', section: 'smoked', name: 'Брюшки сёмги', note: 'холодного копчения, слабосоленые', packs: [], img: '4929f27942c97ed1dbf512fc06b233a8.jpg' },
  { id: 'gorbusha-file-slabosolenye', section: 'smoked', name: 'Горбуша филе', note: 'холодного копчения, слабосоленые', packs: [], img: '06848dc7d641ee6c3e6b38d641c88275.jpg' },
  { id: 'seld-file-slabosolenye', section: 'smoked', name: 'Сельдь филе', note: 'холодного копчения, слабосоленые', packs: [], img: '81439affb553d87d46703da3d68be820.jpg' },
  { id: 'maslyanaya-file-slabosolenye', section: 'smoked', name: 'Масляная филе', note: 'холодного копчения, слабосоленые', packs: [], img: '870552f18b70fc2debfcbf201688f270.jpg' },
  { id: 'skumbriya-file-kipers-slabosolenoe', section: 'smoked', name: 'Скумбрия филе (киперс)', note: 'холодного копчения, слабосоленое', packs: [], img: 'e26d874f4d12a33640a8ef56aae27240.jpg' },
  { id: 'skumbriya-bez-golovy', section: 'smoked', name: 'Скумбрия', note: 'холодного копчения, слабосоленая, без головы', packs: [], img: '86856ca0536b7a42191c1fbe6da58209.jpg' },
  { id: 'moyva-slabosolenaya', section: 'smoked', name: 'Мойва', note: 'холодного копчения, слабосоленая', packs: [], img: 'c524d7426483259a60be946c5da28475.jpg' },
  { id: 'lesch-slabosolenyy', section: 'smoked', name: 'Лещ', note: 'холодного копчения, слабосоленый', packs: [], img: '1a3ac34af52b44d6620341671d944378.jpg' },
  { id: 'som-slabosolenyy', section: 'smoked', name: 'Сом', note: 'холодного копчения, слабосоленый', packs: [], img: '59563a798cf67bbb63dcf328202560fe.jpg' },
  { id: 'pelyad-slabosolenaya', section: 'smoked', name: 'Пелядь', note: 'холодного копчения, слабосоленая', packs: [], img: '86dfe001659f7195e7add742362bed6c.jpg' },
  { id: 'gorbusha-slabosolenaya', section: 'smoked', name: 'Горбуша', note: 'холодного копчения, слабосоленая', packs: [], img: '64f61066d82e514abe70e66bec14ec17.jpg' },
  { id: 'skumbriya-s-golovoy', section: 'smoked', name: 'Скумбрия', note: 'холодного копчения, слабосоленая, с головой', packs: [], img: '878b520a4d18777ffdbc819b058beb3f.jpg' },
  { id: 'golec-slabosolenyy', section: 'smoked', name: 'Голец', note: 'холодного копчения, слабосоленый', packs: [], img: 'f01ef7c874b0aaa5421c9df6e055c1d9.jpg' },
  { id: 'krasnoglazka-s-golovoy', section: 'smoked', name: 'Красноглазка', note: 'холодного копчения, слабосоленая, с головой', packs: [], img: '3fd78bdeaaa28353f8afe092531858d4.jpg' },
  { id: 'nototeniya-slabosolenaya', section: 'smoked', name: 'Нототения', note: 'холодного копчения, слабосоленая', packs: [], img: '108f5d8dc7679d097fd0d217ef2937d6.jpg' },
  { id: 'sayra-slabosolenaya', section: 'smoked', name: 'Сайра', note: 'холодного копчения, слабосоленая', packs: [], img: 'c680e8a09c1bfc119f3ecbc5ab5323b3.jpg' },
  { id: 'chavycha-bez-golovy', section: 'smoked', name: 'Чавыча', note: 'холодного копчения, слабосоленая, без головы', packs: [], img: '31b0432a797c9edd9ff0eb95d77558c0.jpg' },
  { id: 'polaka-bez-golovy', section: 'smoked', name: 'Полака', note: 'холодного копчения, слабосоленая, без головы', packs: [], img: 'bd4319fd2af4e116ad384ef797345997.jpg' },
  { id: 'assorti-rybnoe-iz-file-kusochkov-seldi-i-gorbush', section: 'salted', name: 'Ассорти рыбное', note: 'из филе кусочков сельди и горбуши в масле', packs: [], img: '0c1c7f5bd0c2945e31655954920c8001.jpg' },
  { id: 'assorti-rybnoe-iz-file-kusochkov-seldi-i-gorbush-2', section: 'salted', name: 'Ассорти рыбное', note: 'из филе-кусочков сельди и горбуши с морской капустой в масле', packs: [], img: '4788952a1072ed67b27d01da78bba83f.jpg' },
  { id: 'gorbusha-file-kusochki-v-masle', section: 'salted', name: 'Горбуша', note: 'филе-кусочки в масле', packs: [], img: '8bcb4886b747225f0ef5e526d8b0e019.jpg' },
  { id: 'nerka-file-kusochki-v-masle', section: 'salted', name: 'Нерка', note: 'филе-кусочки в масле', packs: [], img: '30aee1fe3aedf389f608e5c36c5b02c1.jpg' },
  { id: 'rulet-iz-file-seldi-s-ogurcom', section: 'salted', name: 'Рулет', note: 'из филе сельди с огурцом', packs: [], img: 'bd044208f9d7443a058855ff45babfe2.jpg' },
  { id: 'seld-file-kusochki-v-masle-350-g', section: 'salted', name: 'Сельдь', note: 'филе-кусочки в масле', packs: ['350 г'], img: '602ea1197858761ed34c9a9fb87eb35d.jpg' },
  { id: 'seld-podkopchenaya-150-g', section: 'salted', name: 'Сельдь', note: 'филе-кусочки в масле, подкопчёная', packs: ['150 г'], img: '75fff027b64fbf39cb3171a8fadd7d84.jpg' },
  { id: 'seld-file-kusochki-v-masle-150-g', section: 'salted', name: 'Сельдь', note: 'филе-кусочки в масле', packs: ['150 г'], img: '196ec0edd659adeafa6d7adbc47c1082.jpg' },
  { id: 'ryba-he-iz-file-seldi-v-masle-150-g', section: 'salted', name: 'Рыба ХЕ', note: 'из филе сельди в масле', packs: ['150 г'], img: 'e3d61e9c0e754a3a1af3febb891c0955.jpg' },
  { id: 'seld-s-paprikoy-150-g', section: 'salted', name: 'Сельдь', note: 'филе-кусочки в масле, с паприкой', packs: ['150 г'], img: 'bf1ee7658af6a55e90770d8835a3fe43.jpg' },
  { id: 'seld-s-ukropom-150-g', section: 'salted', name: 'Сельдь', note: 'филе-кусочки в масле, с укропом', packs: ['150 г'], img: 'd7f6143afd638b25fe0e9d6d6c0f7491.jpg' },
  { id: 'seld-s-zernami-gorchicy-150-g', section: 'salted', name: 'Сельдь', note: 'филе-кусочки в масле, с зернами горчицы', packs: ['150 г'], img: '5a7763c19b910c813948f2f580bb3286.jpg' },
  { id: 'seld-file-kusochki-v-masle-500-g', section: 'salted', name: 'Сельдь', note: 'филе-кусочки в масле', packs: ['500 г', '1200 г'], img: 'd23da911356f330e69c040a27a9c2475.jpg' },
  { id: 'skumbriya-v-pryano-solevoy-zalivke-1000-g', section: 'salted', name: 'Скумбрия', note: 'малосоленая, в пряно-солевой заливке', packs: ['1000 г'], img: 'da01c5770d6639ea70f3c2257d22ebd7.jpg' },
  { id: 'seld-v-pryano-solevoy-zalivke-1000-g', section: 'salted', name: 'Сельдь', note: 'малосоленая, в пряно-солевой заливке', packs: ['1000 г'], img: '7a38feacc2e403b032a6556ecb3eab1d.jpg' },
  { id: 'myaso-midiy-v-masle-150-g', section: 'salted', name: 'Мясо мидий', note: 'в масле', packs: ['150 г'], img: 'a7ac36a24fefca4c5a5ad8854946e107.jpg' },
  { id: 'seld-kusochki-v-pryano-solevoy-zalivke-520-g', section: 'salted', name: 'Сельдь кусочки', note: 'в пряно-солевой заливке', packs: ['520 г', '1300 г'], img: 'd471a5f5e91de8a52b8287b18a30ba74.jpg' },
  { id: 'kilka-v-pryano-solevoy-zalivke-400-g', section: 'salted', name: 'Килька', note: 'малосоленая, в пряно-солевой заливке', packs: ['400 г'], img: '4488aae6b952e7cd91940c34998f2527.jpg' },
  { id: 'morskaya-kapusta-v-masle-650-g', section: 'salted', name: 'Морская капуста', note: 'в масле', packs: ['650 г', '1000 г'], img: 'db5a88bd5b67a67a86b3c1f607138ee9.jpg' },
  { id: 'morskaya-kapusta-v-masle-150-g', section: 'salted', name: 'Морская капуста', note: 'с кукурузой, в масле', packs: ['150 г'], img: '80fea085dbdbb1265eb924a9c57cf095.jpg' },
  { id: 'morskaya-kapusta-v-mayoneze-150-g', section: 'salted', name: 'Морская капуста', note: 'с кукурузой, в майонезе', packs: ['150 г'], img: '62a99cecbdd337710aa69461cb130286.jpg' },
  { id: 'seld-malosolenaya-5-kg', section: 'salted', name: 'Сельдь', note: 'малосоленая', packs: ['5 кг'], img: '7ca1f5f2649d74893d9eb44fa100040f.jpg' },
  { id: 'skumbriya-malosolenaya-5-kg', section: 'salted', name: 'Скумбрия', note: 'малосоленая', packs: ['5 кг'], img: 'e478ce9928d6e953e1feaf3fcfbbb7c8.jpg' },
  { id: 'kilka-malosolenaya-3-kg', section: 'salted', name: 'Килька', note: 'малосоленая', packs: ['3 кг', '5 кг'], img: '5707fe552fc42562e9a93a64cea61904.jpg' },
  { id: 'schuka', section: 'dried', name: 'Щука', note: '', packs: [], img: 'fd67bdeff5b30c7dc685bb1f1d5dfa19.jpg' },
  { id: 'lesch', section: 'dried', name: 'Лещ', note: '', packs: [], img: '7c9e8db3faf9a2f75fc50e658ff9a4ca.jpg' },
  { id: 'bumper', section: 'dried', name: 'Бумпер', note: '', packs: [], img: '27f88c05b0ec7346d0e0d2732bd4e93f.jpg' },
  { id: 'pelyad', section: 'dried', name: 'Пелядь', note: '', packs: [], img: 'eaff0b6f3a7e45801f2225f1cd7b3d40.jpg' },
  { id: 'bychki', section: 'dried', name: 'Бычки', note: '', packs: [], img: '3525afdfe6350c1b8fa34d594c682dbe.jpg' },
  { id: 'moyva', section: 'dried', name: 'Мойва', note: '', packs: [], img: '6bc42cec68383eb536cdaccd368407d7.jpg' },
  { id: 'plotva', section: 'dried', name: 'Плотва', note: '', packs: [], img: '749a8dab706c93a22527bfddf6c86a68.jpg' },
  { id: 'semga', section: 'frozen', name: 'Сёмга', note: '', packs: [], img: '31cbadf693613c8fb8db26c5248ffda8.jpg' },
  { id: 'forel', section: 'frozen', name: 'Форель', note: '', packs: [], img: 'eb8eb6c33596dfac9a5c0f323c1ee6ca.jpg' },
  { id: 'nerka', section: 'frozen', name: 'Нерка', note: '', packs: [], img: '13c40aa0d95b3113084a49444df51a40.jpg' },
  { id: 'treska-krasnaya', section: 'frozen', name: 'Треска красная', note: '', packs: [], img: '38df4abd1db71442a8d1fa716cf86fed.jpg' },
  { id: 'skumbriya', section: 'frozen', name: 'Скумбрия', note: '', packs: [], img: '9aeb4ea158ded104ac5b6dccd828e2a3.jpg' },
  { id: 'morskoy-okun', section: 'frozen', name: 'Морской окунь', note: '', packs: [], img: 'c271b05d5a5f43c339f3e41da6fa2d6e.jpg' },
  { id: 'konrio', section: 'frozen', name: 'Конрио', note: '', packs: [], img: '23d376e1301e6ce38d7b713ba4dcb200.jpg' },
  { id: 'navaga', section: 'frozen', name: 'Навага', note: '', packs: [], img: '4e191929cbc975e4ca9bc060a7bc28e9.jpg' },
]

export const mfPath = (path = '/') => `/redesign/mrkfish${path === '/' ? '/' : path}`
export const mfSectionPath = (id?: MfSectionId) => mfPath(id ? `/catalog/${id}` : '/catalog')
export const mfProductPath = (p: MfProduct) => mfPath(`/product/${p.id}`)
export const mfImg = (file: string) => `/redesign/mrkfish/p/${file}`
export const mfFind = (id: string) => mfProducts.find((p) => p.id === id)
export const mfSection = (id: MfSectionId) => mfSections.find((s) => s.id === id)!
export const mfInSection = (id: MfSectionId) => mfProducts.filter((p) => p.section === id)
export const mfUnit = (p: MfProduct) => mfSection(p.section).unit
// В карточке одинаковые «Сельдь» различаются обработкой и фасовкой — их и показываем вторым рядом.
export const mfTitle = (p: MfProduct) => (p.note ? `${p.name}, ${p.note}` : p.name)

const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е')
export const mfSearch = (q: string) => {
  const words = norm(q).split(/\s+/).filter(Boolean)
  if (!words.length) return mfProducts
  return mfProducts.filter((p) => {
    const hay = norm(`${p.name} ${p.note} ${p.packs.join(' ')} ${mfSection(p.section).title}`)
    return words.every((w) => hay.includes(w))
  })
}

// Склонение: 1 позиция, 2 позиции, 5 позиций.
export const mfPlural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}
export const mfPositions = (n: number) => `${n} ${mfPlural(n, 'позиция', 'позиции', 'позиций')}`

export const mfContacts = {
  original: 'https://www.mrkfish.ru/',
  phone: { label: '8 (34788) 3-06-06', href: 'tel:+73478830606' },
  mobile: { label: '8 (917) 37-37-437', href: 'tel:+79173737437' },
  email: 'mrkfish@mail.ru',
  whatsapp: 'https://wa.me/qr/QQTHLPKJMWFPO1',
  vk: 'http://vk.com/mrkfish',
  vkPost: 'https://vk.com/wall299402598_944',
  youtube: 'https://www.youtube.com/channel/UCrKZJXzdvyqXyHH4JWGuwyA',
  answer: '40 мин.',
}

// Две площадки группы компаний — у каждой свой адрес, телефон, почта и карточка в Яндексе.
export const mfSites = [
  {
    id: 'erlykovo',
    title: 'Ерлыково',
    company: 'ООО «Миякинская Рыбная Компания»',
    inn: 'ИНН 0238002886',
    address: 'Республика Башкортостан, Миякинский район, с. Ерлыково, ул. Горная, 3',
    makes: 'Копчёная продукция и свежемороженая рыба',
    phone: { label: '8 (34788) 3-06-06', href: 'tel:+73478830606' },
    email: 'mrkfish@mail.ru',
    rating: '5,0',
    reviews: '116 отзывов · 363 оценки',
    map: 'https://yandex.ru/map-widget/v1/org/miyakinskaya_rybnaya_kompaniya/1722718570/?ll=54.833353%2C53.618910&z=16',
    mapLink: 'https://yandex.ru/maps/org/miyakinskaya_rybnaya_kompaniya/1722718570/',
  },
  {
    id: 'kirgiz-miyaki',
    title: 'Киргиз-Мияки',
    company: 'ИП Зиянгиров Х. Б.',
    inn: '',
    address: 'Республика Башкортостан, Миякинский район, с. Киргиз-Мияки, ул. Дружбы, 10/1',
    makes: 'Солёная продукция и пресервы',
    phone: { label: '8 (34788) 2-29-56', href: 'tel:+73478822956' },
    email: 'zhb11@mail.ru',
    rating: '4,7',
    reviews: '36 отзывов · 123 оценки',
    map: 'https://yandex.ru/map-widget/v1/org/miyakinskaya_rybnaya_kompaniya/56192430673/?ll=54.783484%2C53.644562&z=16',
    mapLink: 'https://yandex.ru/maps/org/miyakinskaya_rybnaya_kompaniya/56192430673/',
  },
]

export const mfRegions = ['Республика Башкортостан', 'Оренбургская область', 'Республика Татарстан']

export const mfFacts = [
  { value: 'с 1993', label: 'производим рыбу в Миякинском районе' },
  { value: '200+', label: 'наименований в ассортименте' },
  { value: '3 региона', label: 'ежедневная доставка своим автопарком' },
  { value: '40 мин.', label: 'среднее время ответа на заявку' },
]

export const mfSmoke = [
  { icon: 'leaf', title: 'Натуральный дым', text: 'из щепы ольхи и бука' },
  { icon: 'drop', title: 'Без жидкого дыма', text: 'и без ароматизаторов «копчения»' },
  { icon: 'ban', title: 'Без красителей', text: 'цвет даёт только дым' },
  { icon: 'shield', title: 'Без консервантов', text: 'срок хранения — за счёт копчения' },
]

export const mfBadges = [
  { img: '2a96de227fe177a4a4c5f1a1e8bf1921.png', title: 'Продукт Башкортостана' },
  { img: '947b89d97e3594f094bbf7c2f9342865.jpg', title: '100 лучших товаров России' },
  { img: 'd484493a61b4a2e799ea64a4d6dc9f1c.png', title: 'Halal' },
  { img: '371ac0989c548c9bbf0834d40f1dd317.png', title: '100% Natural' },
]

export const mfGallery = [
  { img: '23895bd2effc866978843c6c9afd8488.jpg', alt: 'Офис и магазин с вывеской «Продукт Башкортостана»' },
  { img: '49901750322d9ffbed137d0fb07beff8.jpg', alt: 'Въезд на территорию, синий щит компании' },
  { img: '79582df4f335d1d3c5ebfa4f943cf4bd.jpg', alt: 'Двор производства' },
  { img: 'b7c3fec78aab94a29c32f5da2d2c53f2.jpg', alt: 'Вход в офис' },
  { img: '8d69bb1fa783b59075f72ca60569fb2e.jpg', alt: 'Территория производства' },
  { img: 'aaa2f31b0f0a4c1e3c4b69bcd3fae243.jpg', alt: 'Территория производства' },
  { img: 'ac7a728b4bec408eb68c867da2eea11e.jpg', alt: 'Территория производства' },
  { img: 'bf4681f0b1569a72576256d189a1f86b.jpg', alt: 'Территория производства' },
]

// Видео с их сайта: ролики открываются на YouTube, превью — с i.ytimg.com. Кто в каком ролике, сайт не подписывает,
// поэтому партнёры перечислены отдельно, как в блоке «Нам доверяют» оригинала.
export const mfVideos = ['lTH6E0rBW-8', 'Pe-ikZjI9bU', '-VFu2CljPHg', 'obduv533tkY']
export const mfPartners = ['Директор ИП Семенко', 'Айдар Галимов, народный артист', 'Директор сети магазинов «Байрам»']
