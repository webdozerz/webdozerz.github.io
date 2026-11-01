// Прайс-каталог «ИП Аксюченко О.В.» снят с https://aks124.ru/produktsiya/* в ноябре 2026 (Megagroup):
// выборка 242 позиции, по ~15 из каждого из 16 разделов, с реальными ценами за штуку и штуками в упаковке.
// Всего у оригинала ~1315 позиций (1045 с ценой) — числа разделов ниже настоящие, остальное в концепт не выкачивали.
// Листы брендов собраны по страницам оригинала: одна фотография на таблицу марки, как у них.
// Картинки — по URL оригинала (https).

export interface AkSection {
  id: string
  title: string
  count: number
  priced: number
  img: string
}
export interface AkBrand {
  id: string
  title: string
  section: string
  img: string
  url: string
  count: number
  out?: boolean
  pdf?: string
}
export interface AkItem {
  id: string
  name: string
  brand: string
  group?: string
  pack?: number
  price?: number
  per: string
}

export const akSections: AkSection[] = [{"id":"specii-pripravy","title":"Специи и приправы","count":295,"priced":294,"img":"https://aks124.ru/d/vegeta.png"},
  {"id":"konservy","title":"Консервы","count":210,"priced":194,"img":"https://aks124.ru/d/pashtet_pechenochnyy_117g.png"},
  {"id":"shokolad-batonchiki","title":"Шоколад и шоколадные батончики","count":196,"priced":106,"img":"https://aks124.ru/d/agold.jpg"},
  {"id":"rulety-keksy","title":"Рулеты, мини-рулеты, кексы","count":26,"priced":13,"img":"https://aks124.ru/d/rulety-ramenskiy.jpg"},
  {"id":"zhevatelnie-konfety-ledency","title":"Жевательные конфеты, леденцы","count":52,"priced":9,"img":"https://aks124.ru/d/bobs.jpg"},
  {"id":"pechenie-krecker-vafli-torty","title":"Печенье, крекер, вафли, торты","count":52,"priced":52,"img":"https://aks124.ru/d/vafelnyy-tort.jpg"},
  {"id":"south-east-asia-products","title":"Продукты юго-восточной Азии","count":45,"priced":40,"img":"https://aks124.ru/d/ris_midori.jpg"},
  {"id":"produkty-bystrogo-prigotovleniya","title":"Продукты быстрого приготовления","count":49,"priced":49,"img":"https://aks124.ru/d/doshirak_kuritsa.jpg"},
  {"id":"muka-krupy-makaronnye-izdeliya","title":"Мука, макаронные изделия, крупы","count":41,"priced":41,"img":"https://aks124.ru/d/agromast.png"},
  {"id":"drozhzhi-kvas","title":"Дрожжи и квас","count":7,"priced":7,"img":""},
  {"id":"chaj-kofe","title":"Чай и кофе","count":181,"priced":159,"img":"https://aks124.ru/d/torabika-macchiato.jpg"},
  {"id":"zhevatelnaya-rezinka-zamenitel-sahara","title":"Жевательная резинка, заменитель сахара","count":74,"priced":50,"img":"https://aks124.ru/d/dirol.jpg"},
  {"id":"soda-uksus","title":"Сода, уксус","count":4,"priced":0,"img":""},
  {"id":"sahar-sol","title":"Сахар, соль","count":6,"priced":6,"img":""},
  {"id":"rastitelnoe-maslo-majonez","title":"Растительное масло, майонез","count":45,"priced":25,"img":"https://aks124.ru/d/logo-avenu.png"},
  {"id":"chipsy","title":"Чипсы","count":32,"priced":0,"img":""}]

export const akBrands: AkBrand[] = [{"id":"priprava-vegeta","title":"Подравка (Вегета)","section":"specii-pripravy","img":"https://aks124.ru/d/vegeta.png","url":"https://aks124.ru/produktsiya/specii-pripravy/priprava-vegeta","count":9},
  {"id":"cycoria","title":"Цикория","section":"specii-pripravy","img":"https://aks124.ru/d/tsikoriya-1.jpg","url":"https://aks124.ru/produktsiya/specii-pripravy/cycoria","count":66},
  {"id":"prhoreca","title":"Арикон","section":"specii-pripravy","img":"https://aks124.ru/d/2.png","url":"https://aks124.ru/produktsiya/specii-pripravy/aricon/prhoreca","count":5},
  {"id":"specii","title":"Продукция Магия Востока","section":"specii-pripravy","img":"https://aks124.ru/d/anis.jpg","url":"https://aks124.ru/produktsiya/specii-pripravy/aricon/prmvostoka/specii","count":5},
  {"id":"altaspice","title":"Альта Спайс","section":"specii-pripravy","img":"https://aks124.ru/d/vanilin.jpg","url":"https://aks124.ru/produktsiya/specii-pripravy/aricon/prmvostoka/altaspice","count":29},
  {"id":"myasnye-konservy","title":"Мясная","section":"konservy","img":"","url":"https://aks124.ru/produktsiya/konservy/myasnye-konservy","count":33},
  {"id":"rybnyye","title":"Рыбная","section":"konservy","img":"","url":"https://aks124.ru/produktsiya/konservy/rybnyye","count":73},
  {"id":"pashtet-name-khame-117-gr","title":"Паштеты HAME (ХАМЕ)","section":"konservy","img":"https://aks124.ru/d/pashtet_pechenochnyy_117g.png","url":"https://aks124.ru/produktsiya/konservy/myasnye-konservy/hame/pashtet-name-khame-117-gr","count":1},
  {"id":"kukbojr200","title":"Кукуруза","section":"konservy","img":"https://aks124.ru/d/kukuruza_boyarin_200_g_sladkaya.jpg","url":"https://aks124.ru/produktsiya/konservy/konservy-ovoshchnyye-fruktovye/kukuruza/kukbojr200","count":1},
  {"id":"shampbojr425","title":"Грибы","section":"konservy","img":"https://aks124.ru/d/shampinony_boyarin_rez_850_gr_zhb.jpg","url":"https://aks124.ru/produktsiya/konservy/konservy-ovoshchnyye-fruktovye/griby/shampbojr425","count":1},
  {"id":"maslinbojr314bk","title":"Маслины","section":"konservy","img":"https://aks124.ru/d/masliny_boyarin_bk_tselyye_4250ml_zhb.jpg","url":"https://aks124.ru/produktsiya/konservy/konservy-ovoshchnyye-fruktovye/maslin/maslinbojr314bk","count":1},
  {"id":"tpastagm250","title":"Томатная паста","section":"konservy","img":"https://aks124.ru/d/p6.png","url":"https://aks124.ru/produktsiya/konservy/konservy-ovoshchnyye-fruktovye/tomatpast/tpastagm250","count":1},
  {"id":"kornishbojr1415","title":"Огурцы","section":"konservy","img":"https://aks124.ru/d/kornishony_boyarin_3-6_1415sm.jpg","url":"https://aks124.ru/produktsiya/konservy/konservy-ovoshchnyye-fruktovye/ogurci/kornishbojr1415","count":1},
  {"id":"sgushchennoe-moloko","title":"Сгущенное молоко","section":"konservy","img":"","url":"https://aks124.ru/produktsiya/sgushchennoe-moloko","count":21},
  {"id":"rogachev","title":"Рогачёв","section":"konservy","img":"https://aks124.ru/d/rogachev.jpg","url":"https://aks124.ru/produktsiya/sgushchennoe-moloko/rogachev","count":1},
  {"id":"shokolad-batonchiki-all","title":"Альпен Голд","section":"shokolad-batonchiki","img":"","url":"https://aks124.ru/produktsiya/shokolad-batonchiki","count":14},
  {"id":"produktsiya-mars","title":"Продукция Марс","section":"shokolad-batonchiki","img":"https://aks124.ru/d/mars-600x600.jpg","url":"https://aks124.ru/produktsiya/shokolad-batonchiki/produktsiya-mars","count":15},
  {"id":"ramenskiy","title":"Рулеты Раменский","section":"rulety-keksy","img":"https://aks124.ru/d/rulety-ramenskiy.jpg","url":"https://aks124.ru/produktsiya/rulety-keksy/ramenskiy","count":8},
  {"id":"ruskiy-biskvit","title":"Кексы Русский Бисквит","section":"rulety-keksy","img":"https://aks124.ru/d/keks-russkiy-biskvit.jpg","url":"https://aks124.ru/produktsiya/rulety-keksy/ruskiy-biskvit","count":5},
  {"id":"bobs","title":"Леденцы Бобс","section":"zhevatelnie-konfety-ledency","img":"https://aks124.ru/d/bobs.jpg","url":"https://aks124.ru/produktsiya/zhevatelnie-konfety-ledency/bobs","count":5},
  {"id":"mamba","title":"Конфеты Мамба","section":"zhevatelnie-konfety-ledency","img":"https://aks124.ru/d/mamba.jpg","url":"https://aks124.ru/produktsiya/zhevatelnie-konfety-ledency/mamba","count":4},
  {"id":"zhevatelnie-konfety-ledency-all","title":"Жевательные конфеты, леденцы","section":"zhevatelnie-konfety-ledency","img":"","url":"https://aks124.ru/produktsiya/zhevatelnie-konfety-ledency","count":6},
  {"id":"pechenie-krecker-vafli-torty-all","title":"Вафли, Торты","section":"pechenie-krecker-vafli-torty","img":"https://aks124.ru/d/vafelnyy-tort.jpg","url":"https://aks124.ru/produktsiya/pechenie-krecker-vafli-torty","count":11},
  {"id":"krecker-tuc","title":"Крекер TUC","section":"pechenie-krecker-vafli-torty","img":"https://aks124.ru/d/kreker-tuk.jpg","url":"https://aks124.ru/produktsiya/pechenie-krecker-vafli-torty/krecker-tuc","count":3},
  {"id":"lubyatovo","title":"Любятово","section":"pechenie-krecker-vafli-torty","img":"https://aks124.ru/d/kreker-lyubyatovo.jpg","url":"https://aks124.ru/produktsiya/pechenie-krecker-vafli-torty/lubyatovo","count":7},
  {"id":"kokosmol","title":"Мидори","section":"south-east-asia-products","img":"https://aks124.ru/d/ris_midori.jpg","url":"https://aks124.ru/produktsiya/south-east-asia-products/kokosmol","count":2},
  {"id":"risovyye-krekery","title":"Рисовые крекеры","section":"south-east-asia-products","img":"","url":"https://aks124.ru/produktsiya/south-east-asia-products/risovyye-krekery","count":2},
  {"id":"imbir160","title":"Имбирь,редис","section":"south-east-asia-products","img":"https://aks124.ru/d/imbir_mar_160_gr.jpg","url":"https://aks124.ru/produktsiya/south-east-asia-products/imbir/imbir160","count":2},
  {"id":"lapshasobagrech300","title":"Лапша","section":"south-east-asia-products","img":"https://aks124.ru/d/lapsha_soba_grech_300gr.jpg","url":"https://aks124.ru/produktsiya/south-east-asia-products/lapsha/lapshasobagrech300","count":3},
  {"id":"morskkapvkuhqmasle5","title":"Морская капуста,водоросли","section":"south-east-asia-products","img":"https://aks124.ru/d/morskaya_kapusta_v_kunzhmasle_5gr.jpg","url":"https://aks124.ru/produktsiya/south-east-asia-products/mrskkapvod/morskkapvkuhqmasle5","count":4},
  {"id":"pastasoevdm500","title":"Паста","section":"south-east-asia-products","img":"","url":"https://aks124.ru/produktsiya/south-east-asia-products/pasta/pastasoevdm500","count":1},
  {"id":"sousdkurslcili350","title":"Соусы","section":"south-east-asia-products","img":"https://aks124.ru/d/sous_dkuritsy_sladkiy_chili_350_g_stb_midori.jpg","url":"https://aks124.ru/produktsiya/south-east-asia-products/sous/sousdkurslcili350","count":2},
  {"id":"doshir","title":"Доширак","section":"produkty-bystrogo-prigotovleniya","img":"https://aks124.ru/d/doshirak_kuritsa.jpg","url":"https://aks124.ru/produktsiya/produkty-bystrogo-prigotovleniya/doshir","count":7},
  {"id":"rolton","title":"Ролтон","section":"produkty-bystrogo-prigotovleniya","img":"","url":"https://aks124.ru/produktsiya/produkty-bystrogo-prigotovleniya/rolton","count":2},
  {"id":"kartofelnoye-pyure-ris-grechka-chudo-roza","title":"Чудо Роза (Смоленск)","section":"produkty-bystrogo-prigotovleniya","img":"https://aks124.ru/d/kartoshka_5.png","url":"https://aks124.ru/produktsiya/produkty-bystrogo-prigotovleniya/chudo-roza/kartofelnoye-pyure-ris-grechka-chudo-roza","count":11},
  {"id":"krupy-agromaster","title":"Крупы Агромастер","section":"muka-krupy-makaronnye-izdeliya","img":"https://aks124.ru/d/agromast.png","url":"https://aks124.ru/produktsiya/muka-krupy-makaronnye-izdeliya/krupy-agromaster","count":11},
  {"id":"muka-melnik-aleyka-makfa-gudvil","title":"Мука Мельник, Алейка, Макфа","section":"muka-krupy-makaronnye-izdeliya","img":"https://aks124.ru/d/mel11.jpg","url":"https://aks124.ru/produktsiya/muka-krupy-makaronnye-izdeliya/muka-melnik-aleyka-makfa-gudvil","count":8},
  {"id":"makarony-aleyka","title":"Макароны Алейка","section":"muka-krupy-makaronnye-izdeliya","img":"https://aks124.ru/d/makaronal.jpg","url":"https://aks124.ru/produktsiya/muka-krupy-makaronnye-izdeliya/makarony-aleyka","count":10},
  {"id":"drozhzhi-kvas-all","title":"Дрожжи и квас","section":"drozhzhi-kvas","img":"","url":"https://aks124.ru/produktsiya/drozhzhi-kvas","count":7},
  {"id":"kofe-tora-bika-sappuccino","title":"Кофе TORA BIKA Сappuccino и Macchiato","section":"chaj-kofe","img":"https://aks124.ru/d/torabika-macchiato.jpg","url":"https://aks124.ru/produktsiya/chaj-kofe/kofe-tora-bika-sappuccino","count":2},
  {"id":"neskafe","title":"Нескафе","section":"chaj-kofe","img":"https://aks124.ru/d/neskafe_klas_mu_250_gr.jpg","url":"https://aks124.ru/produktsiya/chaj-kofe/neskafe","count":19},
  {"id":"zhokey","title":"Жокей","section":"chaj-kofe","img":"https://aks124.ru/d/zhokey.jpg","url":"https://aks124.ru/produktsiya/chaj-kofe/zhokey","count":15},
  {"id":"yakobs","title":"Якобс","section":"chaj-kofe","img":"https://aks124.ru/d/yakobs.jpg","url":"https://aks124.ru/produktsiya/chaj-kofe/yakobs","count":8},
  {"id":"lavacca","title":"Лавацца","section":"chaj-kofe","img":"","url":"https://aks124.ru/produktsiya/chaj-kofe/lavacca","count":5},
  {"id":"chay-grinfild","title":"Чай Гринфилд","section":"chaj-kofe","img":"https://aks124.ru/d/greenf.png","url":"https://aks124.ru/produktsiya/chaj-kofe/chay-grinfild","count":47},
  {"id":"chay-kandi","title":"Чай Канди","section":"chaj-kofe","img":"https://aks124.ru/d/kandi.jpg","url":"https://aks124.ru/produktsiya/chaj-kofe/chay-kandi","count":6},
  {"id":"chay-nuri","title":"Чай Нури","section":"chaj-kofe","img":"https://aks124.ru/d/nuri.png","url":"https://aks124.ru/produktsiya/chaj-kofe/chay-nuri","count":15},
  {"id":"chay-yava","title":"Чай Ява","section":"chaj-kofe","img":"https://aks124.ru/d/java.png","url":"https://aks124.ru/produktsiya/chaj-kofe/chay-yava","count":8},
  {"id":"chernaya-karta","title":"Черная карта","section":"chaj-kofe","img":"","url":"https://aks124.ru/produktsiya/chaj-kofe/chernaya-karta","count":6},
  {"id":"dirol-1","title":"Дирол","section":"zhevatelnaya-rezinka-zamenitel-sahara","img":"https://aks124.ru/d/dirol.jpg","url":"https://aks124.ru/produktsiya/zhevatelnaya-rezinka-zamenitel-sahara/dirol-1","count":14},
  {"id":"milford-zamenitel-sakhara","title":"MILFORD заменитель сахара","section":"zhevatelnaya-rezinka-zamenitel-sahara","img":"https://aks124.ru/d/milford_650_sht.jpg","url":"https://aks124.ru/produktsiya/zhevatelnaya-rezinka-zamenitel-sahara/milford-zamenitel-sakhara","count":2},
  {"id":"huxol-zamenitel-sakhara","title":"HUXOL заменитель сахара","section":"zhevatelnaya-rezinka-zamenitel-sahara","img":"https://aks124.ru/d/zamsakhara_650.jpg","url":"https://aks124.ru/produktsiya/zhevatelnaya-rezinka-zamenitel-sahara/huxol-zamenitel-sakhara","count":1},
  {"id":"love-is","title":"Love Is","section":"zhevatelnaya-rezinka-zamenitel-sahara","img":"","url":"https://aks124.ru/produktsiya/zhevatelnaya-rezinka-zamenitel-sahara/love-is","count":5},
  {"id":"orbit","title":"Орбит","section":"zhevatelnaya-rezinka-zamenitel-sahara","img":"","url":"https://aks124.ru/produktsiya/zhevatelnaya-rezinka-zamenitel-sahara/orbit","count":10},
  {"id":"soda-uksus-all","title":"Сода, уксус","section":"soda-uksus","img":"","url":"https://aks124.ru/produktsiya/soda-uksus","count":4},
  {"id":"sahar-sol-all","title":"Сахар, соль","section":"sahar-sol","img":"","url":"https://aks124.ru/produktsiya/sahar-sol","count":6},
  {"id":"rastitelnoe-maslo-majonez-all","title":"Авеню вкуса","section":"rastitelnoe-maslo-majonez","img":"","url":"https://aks124.ru/produktsiya/rastitelnoe-maslo-majonez","count":6},
  {"id":"mayonez-gastronom","title":"Майонез Гастроном","section":"rastitelnoe-maslo-majonez","img":"https://aks124.ru/d/logo-ganstronom.png","url":"https://aks124.ru/produktsiya/rastitelnoe-maslo-majonez/mayonez-gastronom","count":4},
  {"id":"rastitelnoye-maslo-0-5l-1l","title":"Растительное масло 0.5л-1л","section":"rastitelnoe-maslo-majonez","img":"","url":"https://aks124.ru/produktsiya/rastitelnoe-maslo-majonez/rastitelnoye-maslo-0-5l-1l","count":13},
  {"id":"lays","title":"Лейз","section":"chipsy","img":"","url":"https://aks124.ru/produktsiya/chipsy/lays","count":20},
  {"id":"holodok","title":"Холодок","section":"zhevatelnaya-rezinka-zamenitel-sahara","img":"","url":"https://aks124.ru/produktsiya/holodok","count":17}]

export const akItems: AkItem[] = [{"id":"p1","name":"\"ВЕГЕТА\" приправа, 1000 гр.*10 шт.","brand":"priprava-vegeta","pack":10,"price":480,"per":"шт"},
  {"id":"p2","name":"Приправа для гуляша 30гр.","brand":"cycoria","group":"Приправы","pack":50,"price":25.3,"per":"шт"},
  {"id":"p3","name":"Приправа для маринов. огурцов 45гр.","brand":"cycoria","group":"Приправы","pack":12,"price":60.5,"per":"шт"},
  {"id":"p4","name":"Приправа для рыбы лимонная 30гр.","brand":"cycoria","group":"Приправы","pack":40,"price":26.1,"per":"шт"},
  {"id":"p5","name":"БУЛЬОН МЯСНОЙ 6*500г АРИКОН","brand":"prhoreca","pack":6,"price":62.4,"per":"шт"},
  {"id":"p6","name":"КИСЛОТА ЛИМОННАЯ пищевая 6*500г АРИКОН","brand":"prhoreca","pack":6,"price":96.7,"per":"шт"},
  {"id":"p7","name":"Сухари панировочные 6*500г АРИКОН","brand":"prhoreca","pack":6,"price":46.1,"per":"шт"},
  {"id":"p8","name":"Крем Клубничный 100гр.*12шт., \"Рr.Preston\"","brand":"prhoreca","group":"КРЕМА,ГЛАЗУРЬ","pack":12,"price":55.8,"per":"шт"},
  {"id":"p9","name":"Для курицы с паприкой (припр. для кур.+пакет) 25 шт.*30гр.,\"PreMIX\"","brand":"prhoreca","group":"НА ВТОРОЕ(с пакетом для запекания)","pack":25,"price":23.3,"per":"шт"},
  {"id":"p10","name":"Мак пищевой \"Люкс\" Магия Востока15*75г","brand":"specii","pack":15,"price":51.2,"per":"шт"},
  {"id":"p11","name":"Эстрагон 4гр.*25 шт.,\"Магия Востока\"","brand":"specii","pack":25,"price":10.3,"per":"шт"},
  {"id":"p12","name":"Приправа для приготовления Долмы 15гр.*40шт.,\" Магия Востока\"","brand":"specii","group":"ПРИПРАВЫ","pack":40,"price":7.5,"per":"шт"},
  {"id":"p13","name":"Приправа для приготовления САМСЫ 15гр.*40шт.,\" Магия Востока\"","brand":"specii","group":"ПРИПРАВЫ","pack":40,"price":7.5,"per":"шт"},
  {"id":"p14","name":"Чесночная соль 130гр.*10 шт.,\"Магия Востока\"","brand":"specii","group":"Соль 110 г-150 г","pack":10,"price":30.3,"per":"шт"},
  {"id":"p15","name":"Лимонная кислота 50гр.","brand":"altaspice","pack":25,"price":16,"per":"шт"},
  {"id":"p16","name":"Говядина туш.\"Бурятмяспром\" ГОСТ 338г*30","brand":"myasnye-konservy","group":"ГОВЯДИНА ТУШЕНАЯ","pack":30,"price":101,"per":"шт"},
  {"id":"p17","name":"Тефтели рыбные в т/соусе \"Хорошие консервы\" 235г*48шт","brand":"rybnyye","group":"КОТЛЕТЫ, ФРИКАДЕЛЬКИ РЫБНЫЕ","pack":48,"price":18.3,"per":"шт"},
  {"id":"p18","name":"Сайра натуральная с добавлением масла \"ДОБРОФЛОТ\" ключ 245г*48шт","brand":"rybnyye","group":"САЙРА","pack":48,"price":77,"per":"шт"},
  {"id":"p19","name":"Тунец РУБЛЕННЫЙ в масле (ключ) \"Доброфлот\" 185г*24","brand":"rybnyye","group":"ТУНЕЦ","pack":24,"price":95.5,"per":"шт"},
  {"id":"p20","name":"ГРОДФУД Свинина тушеная ж/б 97,5% 338г*10 Беларусь","brand":"myasnye-konservy","group":"СВИНИНА,БАРАНИНА ТУШЕНЫЕ","pack":10,"price":160,"per":"шт"},
  {"id":"p21","name":"Килька \"За Родину\" в т\\с СТ\\Б ГОСТ 270г*12","brand":"rybnyye","group":"КИЛЬКА","pack":12,"price":66.5,"per":"шт"},
  {"id":"p22","name":"Печень минтая По-Приморсик Доброфлот 240г*24","brand":"rybnyye","group":"ПЕЧЕНЬ МИНТАЯ, ТРЕСКИ","pack":24,"price":111,"per":"шт"},
  {"id":"p23","name":"Скумбрия с добавлением масла \"Юольшекаменский\" резерв 250г*48","brand":"rybnyye","group":"СКУМБРИЯ, САРДИНА,СТАВРИДА","pack":48,"price":43.5,"per":"шт"},
  {"id":"p24","name":"Меркурий шпроты \"WILKE\" 185г*48шт (ключ)","brand":"rybnyye","group":"ШПРОТЫ","pack":48,"price":69,"per":"шт"},
  {"id":"p25","name":"Паштет \"Hame\" печеночный, ж/б, 117 гр.,1*10 шт.","brand":"pashtet-name-khame-117-gr","pack":10,"price":34,"per":"шт"},
  {"id":"p26","name":"Кукуруза \"Бояринъ\" сладкая 200 гр.(1*12шт.) ж/б","brand":"kukbojr200","pack":12,"price":33.5,"per":"шт"},
  {"id":"p27","name":"Шампиньоны резанные \"Бояринъ\" 425мл. (1*12шт.) ж/б","brand":"shampbojr425","pack":12,"price":56,"per":"шт"},
  {"id":"p28","name":"Маслины \"Бояринъ\" 314мл.(1*12шт.) б/к ж/б","brand":"maslinbojr314bk","pack":12,"price":53.2,"per":"шт"},
  {"id":"p29","name":"Томатная паста ГАСТРОНОМ, 250гр.(1*12шт.)","brand":"tpastagm250","pack":12,"price":35.6,"per":"шт"},
  {"id":"p30","name":"Корнишоны \"Бояринъ\" (3-6см), с/б, 1415мл.(1*6шт.) (сух.вес 760г)","brand":"kornishbojr1415","pack":6,"price":138,"per":"шт"},
  {"id":"p31","name":"Какао Глубокое 7.5% 380г ж\\б*30","brand":"sgushchennoe-moloko","group":"Глубокое","pack":30,"price":78.9,"per":"шт"},
  {"id":"p32","name":"Кофе сгущенное Глубокое 7% 380г ж\\б*30","brand":"sgushchennoe-moloko","group":"Глубокое","pack":30,"price":97.3,"per":"шт"},
  {"id":"p33","name":"Молоко ВАРЕНОЕ Глубокое 8.5% 380г ж\\б*30","brand":"sgushchennoe-moloko","group":"Глубокое","pack":30,"price":82.5,"per":"шт"},
  {"id":"p34","name":"Молоко сгущенное Глубокое ДОЙПАК 8.5% 300г*30","brand":"sgushchennoe-moloko","group":"Глубокое","pack":30,"price":65.9,"per":"шт"},
  {"id":"p35","name":"Молоко сгущен. Рогачев ж/б ГОСТ 8,5 % 380г*30","brand":"sgushchennoe-moloko","group":"Рогачёв","pack":30,"price":83.6,"per":"шт"},
  {"id":"p36","name":"Молоко ВАРЕНОЕ Тяжин ж/б 340г*45","brand":"sgushchennoe-moloko","group":"Тяжин","pack":45,"price":51,"per":"шт"},
  {"id":"p37","name":"Молоко сгущ. 8,5% ТУ, дой-пак Тяжин 260г*32","brand":"sgushchennoe-moloko","group":"Тяжин","pack":32,"price":31.5,"per":"шт"},
  {"id":"p38","name":"КАКАО сгущенное ТЯЖИН ж/б 360г*45шт","brand":"sgushchennoe-moloko","group":"Тяжин","pack":45,"price":51,"per":"шт"},
  {"id":"p39","name":"Молоко сгущенное ТУ Тяжин 8,5% эконом 360г*45","brand":"sgushchennoe-moloko","group":"Тяжин","pack":45,"price":40.2,"per":"шт"},
  {"id":"p40","name":"Молоко сгущенн.ФИЛИМОНОВО 5% ТУ 360г*45шт","brand":"sgushchennoe-moloko","group":"Филимоново","pack":45,"price":57.6,"per":"шт"},
  {"id":"p41","name":"Молоко сгущенн.ФИЛИМОНОВО 8,5% ГОСТ 360г*45шт","brand":"sgushchennoe-moloko","group":"Филимоново","pack":45,"price":71.5,"per":"шт"},
  {"id":"p42","name":"Молоко сгущ. дой-пак Рогачев ГОСТ 8,5 % 300г.*24","brand":"rogachev","group":"Рогачев ВАРЕНОЕ 8,5% сгущ.молоко ж/б ГОСТ 380г*30","pack":24,"price":66.5,"per":"шт"},
  {"id":"p46","name":"Шок. Альпен Голд 90г с арах. и кукур.хлоп. 5*20","brand":"shokolad-batonchiki-all","pack":20,"price":45.6,"per":"шт"},
  {"id":"p47","name":"Шок. Альпен Голд 95г ОРЕО с арах.пастой *19шт/бл","brand":"shokolad-batonchiki-all","pack":19,"price":49.5,"per":"шт"},
  {"id":"p48","name":"Шок. Альпен Голд Максфан (манго,ананас,маракуя) 160г*15 оранж","brand":"shokolad-batonchiki-all","pack":15,"price":105,"per":"шт"},
  {"id":"p49","name":"Шоколад \"МИЛКА\" молочный клубника со сливками 90 гр.*20шт.","brand":"shokolad-batonchiki-all","group":"МИЛКА","pack":20,"price":61.5,"per":"шт"},
  {"id":"p50","name":"Шоколад \"МИЛКА\" с печеньем Mini Tuc 87гр.*18 шт.","brand":"shokolad-batonchiki-all","group":"МИЛКА","pack":18,"price":81.3,"per":"шт"},
  {"id":"p51","name":"М&М^s (арахис) 45г 5*32","brand":"shokolad-batonchiki-all","group":"МАРС","pack":32,"price":32.2,"per":"шт"},
  {"id":"p52","name":"Сникерс батончик 50,5г 6*48","brand":"shokolad-batonchiki-all","group":"МАРС","pack":48,"price":27.9,"per":"шт"},
  {"id":"p53","name":"АЛЕНКА шоколад в стиках 100г 4*17 Кр.Окт.","brand":"shokolad-batonchiki-all","group":"Шоколад 100г","pack":17,"price":66.6,"per":"шт"},
  {"id":"p54","name":"Фирменный Бабаевский 100г. 4*17","brand":"shokolad-batonchiki-all","group":"Шоколад 100г","pack":17,"price":65.5,"per":"шт"},
  {"id":"p55","name":"Темный с цельным орехом Риттер Спорт 100гр*10 7026","brand":"shokolad-batonchiki-all","group":"РИТТЕР СПОРТ","pack":10,"price":104,"per":"шт"},
  {"id":"p56","name":"Молочный с хрустящим печеньем Риттер Спорт 100гр*11 2146","brand":"shokolad-batonchiki-all","group":"РИТТЕР СПОРТ","pack":11,"price":78.8,"per":"шт"},
  {"id":"p57","name":"Кит-Кат шок.батончик 40г*35шт","brand":"shokolad-batonchiki-all","group":"Батончики Нестле","pack":35,"price":26.1,"per":"шт"},
  {"id":"p58","name":"Киндер-Джой (для мальчиков)","brand":"shokolad-batonchiki-all","group":"ФЕРЕРРО","price":59,"per":"шт"},
  {"id":"p59","name":"Чокопай \"Орион\" (4шт) 120г*20","brand":"shokolad-batonchiki-all","group":"ЧОКОПАЙ","pack":20,"price":42,"per":"шт"},
  {"id":"p60","name":"Марс 50г 8*36","brand":"produktsiya-mars","group":"МАРС","pack":36,"price":53.1,"per":"шт"},
  {"id":"p61","name":"Мини-рулеты со вкусом Абрикос \"Домашний\" 150г*20","brand":"ramenskiy","group":"Раменский","pack":20,"price":38.7,"per":"шт"},
  {"id":"p62","name":"Мини-рулеты со вкусом Вареной сгущенки \"Домашний\" 150г*20","brand":"ramenskiy","group":"Раменский","pack":20,"price":38.7,"per":"шт"},
  {"id":"p63","name":"Мини-рулеты со вкусом Клубника \"Домашний\" 150г*20","brand":"ramenskiy","group":"Раменский","pack":20,"price":38.7,"per":"шт"},
  {"id":"p64","name":"Мини-рулеты Ягодный сбор \"Домашний\"150г*20","brand":"ramenskiy","group":"Раменский","pack":20,"price":38.7,"per":"шт"},
  {"id":"p65","name":"Рулеты со вкусом Абрикоса \"Домашний\" 150г*15 468(132)","brand":"ramenskiy","group":"Раменский","pack":15,"price":33.6,"per":"шт"},
  {"id":"p66","name":"Рулеты со вкусом Вареной сгущенки \"Домашний\" 150г*15 471","brand":"ramenskiy","group":"Раменский","pack":15,"price":33.6,"per":"шт"},
  {"id":"p67","name":"Рулеты Клубника Домашний 150г*15 469","brand":"ramenskiy","group":"Раменский","pack":15,"price":33.6,"per":"шт"},
  {"id":"p68","name":"Рулеты Ягодный сбор Домашний 150г*15 470","brand":"ramenskiy","group":"Раменский","pack":15,"price":33.6,"per":"шт"},
  {"id":"p69","name":"Кекс Абрикосовый \"Русский бисквит\" 225г*10","brand":"ruskiy-biskvit","group":"Русский бисквит","pack":10,"price":46.2,"per":"шт"},
  {"id":"p70","name":"Кекс Клубника \"Русский бисквит\" 225г*10","brand":"ruskiy-biskvit","group":"Русский бисквит","pack":10,"price":46.2,"per":"шт"},
  {"id":"p71","name":"Кекс Мраморный \"Русский бисквит\" 225г*10","brand":"ruskiy-biskvit","group":"Русский бисквит","pack":10,"price":46.2,"per":"шт"},
  {"id":"p72","name":"Кекс Сгущенка \"Русский бисквит\" 225г*10","brand":"ruskiy-biskvit","group":"Русский бисквит","pack":10,"price":46.2,"per":"шт"},
  {"id":"p73","name":"Кекс Шоколадный \"Русский бисквит\" 225г*10","brand":"ruskiy-biskvit","group":"Русский бисквит","pack":10,"price":46.2,"per":"шт"},
  {"id":"p76","name":"БОБС леденцы 35г лесные ягоды 12шт*24","brand":"bobs","group":"БОБС","pack":24,"price":16.7,"per":"шт"},
  {"id":"p77","name":"БОБС леденцы 35г мед-лимон 12шт*24","brand":"bobs","group":"БОБС","pack":24,"price":16.7,"per":"шт"},
  {"id":"p78","name":"БОБС леденцы 35г мята-эвкалипт 12шт*24","brand":"bobs","group":"БОБС","pack":24,"price":16.7,"per":"шт"},
  {"id":"p79","name":"БОБС леденцы 35г чай с малиной 12шт*24","brand":"bobs","group":"БОБС","pack":24,"price":16.7,"per":"шт"},
  {"id":"p80","name":"БОБС леденцы 35г Экстра ментол с витамином С черный 12шт*24","brand":"bobs","group":"БОБС","pack":24,"price":16.7,"per":"шт"},
  {"id":"p81","name":"Мамба 2в1 жевательная конфета 48шт*6","brand":"mamba","group":"МАМБА","pack":6,"price":18.1,"per":"шт"},
  {"id":"p82","name":"Мамба Тропик жевательная конфета 48шт*6","brand":"mamba","group":"МАМБА","pack":6,"price":18.1,"per":"шт"},
  {"id":"p83","name":"МАМБА(клуб,малина,вишня,апельсин) 26,5гр жев.кон.48шт*6","brand":"mamba","group":"МАМБА","pack":6,"price":18.1,"per":"шт"},
  {"id":"p84","name":"МАМБА (КОЛА,малина,апельсин,клубника)жев.конфеты 26,5гр*48шт*6","brand":"mamba","group":"МАМБА","pack":48,"price":18.1,"per":"шт"},
  {"id":"p90","name":"БОБС леденцы 35г ледяная свежесть 12шт*24 синий","brand":"zhevatelnie-konfety-ledency-all","group":"руб","pack":24,"per":"шт"},
  {"id":"p91","name":"Вафли \"Коровка\" Топленое молоко 150г*22","brand":"pechenie-krecker-vafli-torty-all","pack":22,"price":34.8,"per":"шт"},
  {"id":"p92","name":"Вафли Топленое молоко \"Коломенское\" 220г*20","brand":"pechenie-krecker-vafli-torty-all","pack":20,"price":45.8,"per":"шт"},
  {"id":"p93","name":"Торт \"Коровка\" Топленое молоко 250гр*15","brand":"pechenie-krecker-vafli-torty-all","pack":15,"price":79.6,"per":"шт"},
  {"id":"p94","name":"Крекер TUK Сыр 100г*24шт","brand":"pechenie-krecker-vafli-torty-all","group":"Крекер TUC","pack":24,"price":47.7,"per":"шт"},
  {"id":"p95","name":"Крекер Сыр \"Янтарный\" 235г*24 Любятово","brand":"pechenie-krecker-vafli-torty-all","group":"Крекер Любятово","pack":24,"price":52.4,"per":"шт"},
  {"id":"p96","name":"Печенье Топленое молоко \"Любятово\" 400г*12","brand":"pechenie-krecker-vafli-torty-all","group":"Печенье Любятово","pack":12,"price":70.5,"per":"шт"},
  {"id":"p97","name":"Печенье ОРЕО со вкусом Ваниль 228г*12","brand":"pechenie-krecker-vafli-torty-all","group":"Печенье ОРЕО","pack":12,"price":95.9,"per":"шт"},
  {"id":"p98","name":"Печенье ОРЕО со вкусом Шоколада 95г*28","brand":"pechenie-krecker-vafli-torty-all","group":"Печенье ОРЕО","pack":28,"price":45.2,"per":"шт"},
  {"id":"p99","name":"Медвежонок Барни пирожное бисквитное с молочной начинкой 150г*20шт","brand":"pechenie-krecker-vafli-torty-all","group":"ПИРОЖНОЕ БАРНИ","pack":20,"price":79.6,"per":"шт"},
  {"id":"p100","name":"Вафли \"Коровка\" Шоколадные 150г*22","brand":"pechenie-krecker-vafli-torty-all","pack":22,"price":34.8,"per":"шт"},
  {"id":"p101","name":"Торт Вафельный Аленка 250гр*15","brand":"pechenie-krecker-vafli-torty-all","pack":15,"price":83.4,"per":"шт"},
  {"id":"p102","name":"Крекер TUK Зеленый лук, семена льна и мака 100г*24шт","brand":"krecker-tuc","pack":24,"price":47.7,"per":"шт"},
  {"id":"p103","name":"Крекер Лук \"Янтарный\" 235г*24 Любятово","brand":"lubyatovo","group":"Крекер Любятово","pack":24,"price":52.4,"per":"шт"},
  {"id":"p104","name":"Печенье Классическое \"Любятово\" 315г*15","brand":"lubyatovo","group":"Печенье Любятово","pack":15,"price":70.5,"per":"шт"},
  {"id":"p105","name":"Печенье Шоколадное \"Любятово\" 335г*15","brand":"lubyatovo","group":"Печенье Любятово","pack":15,"price":70.5,"per":"шт"},
  {"id":"p106","name":"Кокосовое молоко 400 мл(1*24шт.) ж/б Мидори","brand":"kokosmol","pack":24,"price":130,"per":"шт"},
  {"id":"p107","name":"Рис для суши 450г*12 шлифованный в/с Мидори ГОСТ","brand":"kokosmol","pack":12,"price":68,"per":"шт"},
  {"id":"p108","name":"Рисовые крекеры 70г*(20) сладкие Корея","brand":"risovyye-krekery","pack":20,"price":125.6,"per":"шт"},
  {"id":"p109","name":"Имбирь, 160гр.(1*24шт.) маринованный, д/суши, розовый ,ст/б,\"МИДОРИ\"","brand":"imbir160","pack":24,"price":101.5,"per":"шт"},
  {"id":"p110","name":"Имбирь, для суши, маринованный розовый (пакет),1кг.(1*10шт.) Три-С","brand":"imbir160","pack":10,"price":146,"per":"шт"},
  {"id":"p111","name":"Лапша, 300 гр.(1*40 шт.), \"Соба\", гречневая, \"Мидори\" Китай","brand":"lapshasobagrech300","pack":40,"price":58.5,"per":"шт"},
  {"id":"p112","name":"Лапша, рисовая, крупная, 380 гр.(1*20 шт.),\" Мидори\"","brand":"lapshasobagrech300","pack":20,"price":124,"per":"шт"},
  {"id":"p113","name":"Лапша, пшеничная, \"Сомен \",300 гр.(1*40 шт.),\"Мидори\", Китай","brand":"lapshasobagrech300","pack":40,"price":55,"per":"шт"},
  {"id":"p114","name":"Морская капуста, 5 гр.(32*4), жареная в кунжутном масле, Мидори, 128 шт","brand":"morskkapvkuhqmasle5","pack":4,"price":53,"per":"шт"},
  {"id":"p115","name":"Морская капуста, 5 гр. (32*4), жареная с васаби, Мидори,(128 шт.)","brand":"morskkapvkuhqmasle5","pack":4,"price":53,"per":"шт"},
  {"id":"p116","name":"Морская капуста, 5 гр. (32*4),жареная со вкусом \"Кимчи\",\"Мидори\",(128 шт.)","brand":"morskkapvkuhqmasle5","pack":4,"price":53,"per":"шт"},
  {"id":"p117","name":"Морская капуста, 25 гр., для суши, Оригинал Мидори, (50шт/уп)","brand":"morskkapvkuhqmasle5","price":120,"per":"шт"},
  {"id":"p118","name":"Паста соевая, 500 гр.(1*20 шт.),\"Дендян Мэльфуд\", Корея(желтая)","brand":"pastasoevdm500","pack":20,"price":165.4,"per":"шт"},
  {"id":"p119","name":"Соус 350 гр.(1*24 шт.), для курицы, сладкий Чили,ст/б. \"Мидори\"","brand":"sousdkurslcili350","pack":24,"price":166,"per":"шт"},
  {"id":"p120","name":"Соус соевый 150 мл.(1*24 шт.),пл/бут., \"Майл Фудс\", \"Мидори\"","brand":"sousdkurslcili350","pack":24,"price":56,"per":"шт"},
  {"id":"p121","name":"Лапша\"Доширак\" говядина ,90 гр.*24 шт.","brand":"doshir","pack":24,"price":53.2,"per":"шт"},
  {"id":"p122","name":"Лапша \"Доширак\" грибы ,90г*24 шт","brand":"doshir","pack":24,"price":53.2,"per":"шт"},
  {"id":"p123","name":"Квисти курица лапша брикет 70г*48","brand":"doshir","pack":48,"price":21,"per":"шт"},
  {"id":"p124","name":"Лапша \"Роллтон\" говядина, 60 гр.*42 шт.","brand":"rolton","group":"Лапша","pack":42,"price":18.3,"per":"шт"},
  {"id":"p125","name":"Картоф.пюре\"Чудо Роза\"с укропом быстр.пригот. 120 гр.1/24","brand":"kartofelnoye-pyure-ris-grechka-chudo-roza","group":"КАРТОФ.ПЮРЕ, ГРЕЧКА, РИС","pack":24,"price":35,"per":"шт"},
  {"id":"p126","name":"Быстрый обед\"Чудо роза\"картошка с беконом 37гр.пакет*12шт *6 бл.","brand":"kartofelnoye-pyure-ris-grechka-chudo-roza","group":"Пакеты 37-41г","pack":12,"price":14.6,"per":"шт"},
  {"id":"p127","name":"Быстрый обед\"Чудо роза\" рис с курицей 41гр.пакет*12шт *6 бл.","brand":"kartofelnoye-pyure-ris-grechka-chudo-roza","group":"Пакеты 37-41г","pack":12,"price":14.6,"per":"шт"},
  {"id":"p128","name":"Быстрый обед\"Чудо роза\"картошка с беконом 37гр.стакан 1/30.","brand":"kartofelnoye-pyure-ris-grechka-chudo-roza","group":"Стаканы 37г-41г","pack":30,"price":19.7,"per":"шт"},
  {"id":"p129","name":"Быстрый обед\"Чудо роза\" рис с курицей 41гр.стакан 1/30","brand":"kartofelnoye-pyure-ris-grechka-chudo-roza","group":"Стаканы 37г-41г","pack":30,"price":19.7,"per":"шт"},
  {"id":"p130","name":"Овс.каша БАЛАНС ВЕСА с тайской дыней 1/3 120г*16 бл БонАппетит","brand":"kartofelnoye-pyure-ris-grechka-chudo-roza","group":"ПАКЕТЫ","pack":16,"price":34.5,"per":"шт"},
  {"id":"p131","name":"Овсянная каша \"БонАппетит\", с ананасом, 1/5, 40 гр.,1*12 бл.","brand":"kartofelnoye-pyure-ris-grechka-chudo-roza","group":"ПАКЕТЫ","pack":12,"price":61.2,"per":"шт"},
  {"id":"p132","name":"Овсянная каша \"БонАппетит\", с цукатами, 1/5, 40 гр.,1*12 бл.","brand":"kartofelnoye-pyure-ris-grechka-chudo-roza","group":"ПАКЕТЫ","pack":12,"price":61.2,"per":"шт"},
  {"id":"p133","name":"Овсянные хлопья\"OAT FLAKES\" помол №2(варить 5 мин), 350гр.*12 шт.,\"Бон Аппетит\"","brand":"kartofelnoye-pyure-ris-grechka-chudo-roza","group":"ОВСЯННЫЕ ХЛОПЬЯ","pack":12,"price":47.2,"per":"шт"},
  {"id":"p134","name":"Овсянные хлопья №3 (мелкий размер), 500 гр. *10 шт.,\"Бон Аппетит\"","brand":"kartofelnoye-pyure-ris-grechka-chudo-roza","group":"ОВСЯННЫЕ ХЛОПЬЯ","pack":10,"price":46,"per":"шт"},
  {"id":"p135","name":"Суп -пюре из шампиньонов, 28гр.пакет.1/12 шт.*6бл.","brand":"kartofelnoye-pyure-ris-grechka-chudo-roza","group":"Пакеты 28 гр.","pack":12,"price":14.6,"per":"шт"},
  {"id":"p136","name":"Геркулес \"Агромастер\", 800 гр.,1*8 шт.","brand":"krupy-agromaster","pack":8,"price":27,"per":"шт"},
  {"id":"p137","name":"Гречка \"Агромастер\", 800 гр.,1*10 шт.","brand":"krupy-agromaster","pack":10,"price":28.7,"per":"шт"},
  {"id":"p138","name":"Перловка \"Агромастер\", 800 гр.,1*10 шт.","brand":"krupy-agromaster","pack":10,"price":26,"per":"шт"},
  {"id":"p139","name":"Пшено \"Агромастер\",800 гр.,1*10 шт.","brand":"krupy-agromaster","pack":10,"price":59.2,"per":"шт"},
  {"id":"p140","name":"Рис круглый краснодарский \"Агромастер\", 800 гр.,1*10 шт.","brand":"krupy-agromaster","pack":10,"price":50.6,"per":"шт"},
  {"id":"p141","name":"Ячневая крупа \"Агромастер\" 600г*10","brand":"krupy-agromaster","pack":10,"price":20.7,"per":"шт"},
  {"id":"p142","name":"Мука \"МЕЛЬНИК\", 2 кг.,1*6 шт.","brand":"muka-melnik-aleyka-makfa-gudvil","pack":6,"price":55,"per":"шт"},
  {"id":"p143","name":"Мука \"Алейка\", 2 кг.,1*4 шт.","brand":"muka-melnik-aleyka-makfa-gudvil","pack":4,"price":52,"per":"шт"},
  {"id":"p144","name":"Мука Алейка 5 кг","brand":"muka-melnik-aleyka-makfa-gudvil","price":24.9,"per":"шт"},
  {"id":"p145","name":"Мука \"МАКФА\", в/с., 1 кг.,1*10 шт.","brand":"muka-melnik-aleyka-makfa-gudvil","pack":10,"price":40.2,"per":"шт"},
  {"id":"p146","name":"Макароны \"АЛЕЙКА\", Вермишель, 400 гр.,1*20 шт.","brand":"makarony-aleyka","pack":20,"price":16.8,"per":"шт"},
  {"id":"p147","name":"Макароны \"АЛЕЙКА\" Лапша 400г*20","brand":"makarony-aleyka","pack":20,"price":16.8,"per":"шт"},
  {"id":"p148","name":"Макароны \"АЛЕЙКА\", Ракушки, 400 гр.,1*20 шт.","brand":"makarony-aleyka","pack":20,"price":16.8,"per":"шт"},
  {"id":"p149","name":"Макароны \"АЛЕЙКА\" Ромашка 400г*20","brand":"makarony-aleyka","pack":20,"price":16.8,"per":"шт"},
  {"id":"p150","name":"Макароны \"АЛЕЙКА\", Спираль, 400 гр.,1*20 шт.","brand":"makarony-aleyka","pack":20,"price":16.8,"per":"шт"},
  {"id":"p151","name":"Дрожжи \"Саф-Левюр\" 100гр.*80 шт. (4*20 шт.)","brand":"drozhzhi-kvas-all","pack":80,"price":60,"per":"шт"},
  {"id":"p152","name":"Дрожжи \"Саф-Левюр\" 50 гр.*120 шт.(4*30шт.)","brand":"drozhzhi-kvas-all","pack":120,"price":30.5,"per":"шт"},
  {"id":"p153","name":"Дрожжи \"Саф-Момент\" 11гр.*1080шт.(18бл.*60шт.)","brand":"drozhzhi-kvas-all","pack":60,"price":14.7,"per":"шт"},
  {"id":"p154","name":"Дрожжи \"Саф-Момент\" пицца,12гр*480шт.(12бл.*40шт.)","brand":"drozhzhi-kvas-all","pack":480,"price":14,"per":"шт"},
  {"id":"p155","name":"Дрожжи \"Саф-Момент\" сдоба,12гр.*480шт.(12бл.*40шт.)","brand":"drozhzhi-kvas-all","pack":480,"price":14,"per":"шт"},
  {"id":"p156","name":"Дрожжи \"Воронежские\" 100гр.*50шт.(1*50шт.)","brand":"drozhzhi-kvas-all","group":"Дрожжи Бекмая 100гр.*50шт.(1*50шт.)","pack":50,"price":40.6,"per":"шт"},
  {"id":"p157","name":"Дрожжи \"Воронежские\" 500гр.*20шт.(1*20шт.)","brand":"drozhzhi-kvas-all","group":"Дрожжи Бекмая 100гр.*50шт.(1*50шт.)","pack":20,"price":158.6,"per":"шт"},
  {"id":"p158","name":"Кофе \"TORA BIKA Сappuccino\" с пакетиком шоколадной крошки, 25гр.,1*20 шт.","brand":"kofe-tora-bika-sappuccino","price":242,"per":"бл"},
  {"id":"p159","name":"Кофе \"Нескафе\" Классик пак. 2г.*30 пак.*40","brand":"neskafe","pack":30,"price":5.5,"per":"шт"},
  {"id":"p160","name":"Кофе \"Нескафе\"Классик 95г*12 ст/б","brand":"neskafe","pack":12,"price":100.5,"per":"шт"},
  {"id":"p161","name":"Жокей Италиано в/с молотый 250гр*26","brand":"zhokey","pack":26,"price":139,"per":"шт"},
  {"id":"p162","name":"Кофе Якобс Монарх 1,8г*26 пак*20бл","brand":"yakobs","pack":26,"price":5,"per":"шт"},
  {"id":"p163","name":"Кофе Лавацца Крем Густо молотый 250гр*20","brand":"lavacca","pack":20,"price":226,"per":"шт"},
  {"id":"p164","name":"Чай ГРИНФИЛД Классик Брекфаст черн 100 гр.*14 шт. 0353-14","brand":"chay-grinfild","pack":14,"price":79.7,"per":"шт"},
  {"id":"p165","name":"Чай ГРИНФИЛД Барбари Гардэн 25пак*1,5гр*10шт 0710","brand":"chay-grinfild","pack":10,"price":73,"per":"шт"},
  {"id":"p166","name":"Чай ГРИНФИЛД Кениан Санрайз(черный) 25пак*2гр*15шт 0489-15","brand":"chay-grinfild","pack":2,"price":73,"per":"шт"},
  {"id":"p167","name":"Чай ГРИНФИЛД Саммэ Букет с малиной 25пак*2гр*10шт 0433","brand":"chay-grinfild","pack":2,"price":73,"per":"шт"},
  {"id":"p168","name":"Чай ГРИНФИЛД пирамидка Милки Оолонг зеленый 1,8гр*20пак*8 0905","brand":"chay-grinfild","group":"Пирамидки","pack":20,"price":82.05,"per":"шт"},
  {"id":"p169","name":"Чай Принцесса КАНДИ цейлон с/в 50пак.*2гр*18шт","brand":"chay-kandi","group":"КАНДИ","pack":2,"price":51.4,"per":"шт"},
  {"id":"p170","name":"Чай Принцесса НУРИ лимон 25 пак*1,5гр*18с/я","brand":"chay-nuri","group":"НУРИ","pack":18,"price":41,"per":"шт"},
  {"id":"p171","name":"Чай Принцесса ЯВА зеленый double 2гр*100*18шт","brand":"chay-yava","group":"ЯВА","pack":18,"price":108,"per":"шт"},
  {"id":"p172","name":"Кофе \"Черная карта\" GOLD сублимир. м/у 75 гр.*12 шт.","brand":"chernaya-karta","pack":12,"price":102.5,"per":"шт"},
  {"id":"p173","name":"Дирол АРБУЗНАЯ СВЕЖЕСТЬ 30шт/бл, 30 шт./бл.","brand":"dirol-1","pack":30,"price":14.3,"per":"шт"},
  {"id":"p174","name":"Дирол Клубничная поляна отбеливающий 30шт/бл*24","brand":"dirol-1","pack":30,"price":14.3,"per":"шт"},
  {"id":"p175","name":"Дирол МАНГО 30 шт/бл","brand":"dirol-1","pack":30,"price":14.3,"per":"шт"},
  {"id":"p176","name":"Дирол МАРАКУЙЯ 30шт/бл","brand":"dirol-1","pack":30,"price":14.3,"per":"шт"},
  {"id":"p177","name":"Дирол МЯТА И МЕЛИССА 30шт/бл","brand":"dirol-1","pack":30,"price":14.3,"per":"шт"},
  {"id":"p178","name":"Дирол White ПЕРЕЧНАЯ МЯТА 30шт/бл","brand":"dirol-1","pack":30,"price":14.3,"per":"шт"},
  {"id":"p179","name":"Дирол ФРУКТЫ 30шт/бл","brand":"dirol-1","pack":30,"price":14.3,"per":"шт"},
  {"id":"p180","name":"\"MILFORD\" заменитель сахара, 650 таблеток.","brand":"milford-zamenitel-sakhara","pack":12,"price":96,"per":"шт"},
  {"id":"p181","name":"\"HUXOL\" заменитель сахара ,1200 таб.,1*24 шт.","brand":"huxol-zamenitel-sakhara","pack":24,"price":93,"per":"шт"},
  {"id":"p182","name":"Love is жев.резинка банан и клубника 100шт*20 (синий)","brand":"love-is","pack":100,"price":2.2,"per":"шт"},
  {"id":"p183","name":"Love is жев.резинка кокос и ананас 100шт*20 (желтый)","brand":"love-is","pack":100,"price":2.2,"per":"шт"},
  {"id":"p184","name":"Орбит \"БЕЛОСНЕЖНЫЙ БАБЛ МИНТ\" 30шт./бл.","brand":"orbit","price":21,"per":"шт","pack":30},
  {"id":"p185","name":"Орбит \"БЕЛОСНЕЖНЫЙ КЛУБНИЧНАЯ ЭКЗОТИКА\" 30шт./бл.","brand":"orbit","price":21,"per":"шт","pack":30},
  {"id":"p186","name":"Орбит \"БЕЛОСНЕЖНЫЙ ОСВЕЖАЮЩАЯ МЯТА\" 30шт./бл.","brand":"orbit","price":21,"per":"шт","pack":30},
  {"id":"p187","name":"Орбит \"КЛУБНИКА-БАНАН\" 30шт./бл.","brand":"orbit","price":21,"per":"шт","pack":30},
  {"id":"p188","name":"Уксус СТОЛОВЫЙ, 9%, 0.5 л.,1*20 шт.,\"ПРИПРАВЬ-КА\"","brand":"soda-uksus-all","pack":20,"per":"шт"},
  {"id":"p189","name":"Уксус СТОЛОВЫЙ, 9%, 1 л.,1*12 шт.,\"ПРИПРАВЬ-КА\"","brand":"soda-uksus-all","pack":12,"per":"шт"},
  {"id":"p190","name":"Уксусная КИСЛОТА, 70% ,пласт./бут., 180 гр.,1*35 шт.,\"ПРИПРАВЬ-КА\"","brand":"soda-uksus-all","pack":35,"per":"шт"},
  {"id":"p191","name":"Сода пищевая, 0.5 кг.,1*24 шт.","brand":"soda-uksus-all","pack":24,"per":"шт"},
  {"id":"p192","name":"Сахар-рафинад \"РУССКИЙ\" 250г., 1*40 шт.","brand":"sahar-sol-all","group":"САХАР-РАФИНАД","pack":40,"price":35,"per":"шт"},
  {"id":"p193","name":"Сахар-рафинад \"РУССКИЙ\", 0.5 кг.,1*40 шт.","brand":"sahar-sol-all","group":"САХАР-РАФИНАД","pack":40,"price":55.5,"per":"шт"},
  {"id":"p194","name":"Сахар-рафинад \"РУССКИЙ\", 1 кг.,1*20 шт.","brand":"sahar-sol-all","group":"САХАР-РАФИНАД","pack":20,"price":98,"per":"шт"},
  {"id":"p195","name":"Соль \"Сибирская\", 1 кг,1*12 шт.","brand":"sahar-sol-all","group":"СОЛЬ по 1кг","pack":12,"price":20,"per":"шт"},
  {"id":"p196","name":"Соль КРУПНАЯ, 3кг, мешок","brand":"sahar-sol-all","group":"СОЛЬ по 1кг","pack":1,"price":77,"per":"шт"},
  {"id":"p197","name":"Соль ЭКСТРА, 1 кг.,1*20 шт.","brand":"sahar-sol-all","group":"СОЛЬ по 1кг","pack":20,"price":34.4,"per":"шт"},
  {"id":"p198","name":"Майонез \"Авеню вкуса\", 50%, д/пак., 200 гр.*18 шт.","brand":"rastitelnoe-maslo-majonez-all","pack":18,"price":35.7,"per":"шт"},
  {"id":"p199","name":"Майонез \"Авеню вкуса\", 50%, д/пак., 400 гр.*12 шт.","brand":"rastitelnoe-maslo-majonez-all","pack":12,"price":67.5,"per":"шт"},
  {"id":"p200","name":"Майонез \"Авеню вкуса\", 50%, д/пак., 800 гр.*6 шт.","brand":"rastitelnoe-maslo-majonez-all","pack":6,"price":130.6,"per":"шт"},
  {"id":"p201","name":"\"Гастроном\" майонез, 200 гр.*18 шт., д/пак.","brand":"rastitelnoe-maslo-majonez-all","group":"Майонез Гастроном","pack":18,"price":54.1,"per":"шт"},
  {"id":"p202","name":"\"Гастроном\" майонез, 400 гр.*12 шт., д/пак.","brand":"rastitelnoe-maslo-majonez-all","group":"Майонез Гастроном","pack":12,"price":96.3,"per":"шт"},
  {"id":"p203","name":"\"Гастроном\" майонез, 816 гр.*6 шт.,д/пак.","brand":"rastitelnoe-maslo-majonez-all","group":"Майонез Гастроном","pack":6,"price":180.4,"per":"шт"},
  {"id":"p210","name":"\"Гастроном\" майонез 3л пл/ведро","brand":"mayonez-gastronom","pack":2,"price":260,"per":"шт"},
  {"id":"p211","name":"Масло Оливковое \"Blanqueta Extra Virgen нераф. 250 мл*12 ст/бут","brand":"rastitelnoye-maslo-0-5l-1l","pack":12,"price":171,"per":"шт"},
  {"id":"p212","name":"Масло Оливковое \"Blanqueta Extra Virgen 500 мл*12 ст/бут","brand":"rastitelnoye-maslo-0-5l-1l","pack":12,"price":271,"per":"шт"},
  {"id":"p213","name":"Чипсы \"ЛЕЙЗ МАКС\" сметана лук 150 гр.*18 шт.","brand":"lays","group":"Лейз 150 гр.","pack":18,"per":"шт"},
  {"id":"p214","name":"Чипсы \"ЛЕЙЗ\" зеленый лук 150 гр.*18 шт.","brand":"lays","group":"Лейз 150 гр.","pack":18,"per":"шт"},
  {"id":"p215","name":"Чипсы \"ЛЕЙЗ\" краб 150 гр.*18 шт.","brand":"lays","group":"Лейз 150 гр.","pack":18,"per":"шт"},
  {"id":"p216","name":"Чипсы \"ЛЕЙЗ\" натуральные соленые 150 гр.*18 шт.","brand":"lays","group":"Лейз 150 гр.","pack":18,"per":"шт"},
  {"id":"p217","name":"Чипсы \"ЛЕЙЗ\" рифленые нежный сыр с луком 145 гр.*18 шт.","brand":"lays","group":"Лейз 150 гр.","pack":18,"per":"шт"},
  {"id":"p218","name":"Чипсы \"ЛЕЙЗ\" рифленые Лобстер 150 гр.*18 шт.","brand":"lays","group":"Лейз 150 гр.","pack":18,"per":"шт"},
  {"id":"p219","name":"Чипсы \"ЛЕЙЗ\" сметана-зелень 150 гр.,1*18 шт.","brand":"lays","group":"Лейз 150 гр.","pack":18,"per":"шт"},
  {"id":"p220","name":"Чипсы \"ЛЕЙЗ\" зеленый лук 40 гр.*28 шт.","brand":"lays","group":"Лейз 40гр","pack":28,"per":"шт"},
  {"id":"p221","name":"Чипсы \"ЛЕЙЗ\" краб 40 гр.*28 шт.","brand":"lays","group":"Лейз 40гр","pack":28,"per":"шт"},
  {"id":"p222","name":"Чипсы \"ЛЕЙЗ\" сметана-зелень 40 гр.*28 шт.","brand":"lays","group":"Лейз 40гр","pack":28,"per":"шт"},
  {"id":"p223","name":"Чипсы \"ЛЕЙЗ\" сметана-лук 40 гр.*28","brand":"lays","group":"Лейз 40гр","pack":28,"per":"шт"},
  {"id":"p224","name":"Чипсы \"ЛЕЙЗ МАКС\" сметана-лук 80 гр.*24 шт.","brand":"lays","group":"Лейз 80гр","pack":24,"per":"шт"},
  {"id":"p225","name":"Чипсы \"ЛЕЙЗ\" бекон 80 гр.*24 шт.","brand":"lays","group":"Лейз 80гр","pack":24,"per":"шт"},
  {"id":"p226","name":"Чипсы \"ЛЕЙЗ\" грибы 80 гр.*24 шт.","brand":"lays","group":"Лейз 80гр","pack":24,"per":"шт"},
  {"id":"p227","name":"Чипсы \"ЛЕЙЗ\" краб 80 гр.*24 шт.","brand":"lays","group":"Лейз 80гр","pack":24,"per":"шт"},
  {"id":"p228","name":"\"Фрутти\" Сливочное ассорти 12г 100шт/бл*12 CL-071","brand":"holodok","group":"ФРУТТИ Карамель леденцовая на палочке","pack":12,"price":2.25,"per":"шт"},
  {"id":"p229","name":"\"Фрутти\" карамель на палочке Тропическое ассорти 12г 100шт/бл*12 CL-077","brand":"holodok","group":"ФРУТТИ Карамель леденцовая на палочке","pack":12,"price":2.25,"per":"шт"},
  {"id":"p230","name":"\"Фрутти\" карамель на палочке Фруктовое ассорти 12г 100шт/бл*12 CL-070","brand":"holodok","group":"ФРУТТИ Карамель леденцовая на палочке","pack":12,"price":2.25,"per":"шт"},
  {"id":"p231","name":"Жевательная резинка с начинкой АПЕЛЬСИН \"Холодок\",флоупак,3,5 гр 100шт/бл*20 GG-165","brand":"holodok","group":"ХОЛОДОК Жевательная резинка с начинкой","pack":20,"price":1.1,"per":"шт"},
  {"id":"p232","name":"Жевательная резинка с начинкой АРБУЗ \"Холодок\",флоупак,3,5гр 100шт/бл*20 GG-167","brand":"holodok","group":"ХОЛОДОК Жевательная резинка с начинкой","pack":20,"price":1.1,"per":"шт"},
  {"id":"p233","name":"Жевательная резинка с начинкой АРБУЗ-ДЫНЯ \"Холодок\",флоупак,3,5гр 100шт/бл*20 GG-166","brand":"holodok","group":"ХОЛОДОК Жевательная резинка с начинкой","pack":20,"price":1.1,"per":"шт"},
  {"id":"p234","name":"Жевательная резинка с начинкой КЛУБНИКА \"Холодок\",флоупак,3,5гр 100шт/бл*20 GG-168","brand":"holodok","group":"ХОЛОДОК Жевательная резинка с начинкой","pack":20,"price":1.1,"per":"шт"},
  {"id":"p235","name":"Жевательная резинка с начинкой ЛИМОН \"Холодок\",флоупак,3,5гр 100шт/бл*20 GG-169","brand":"holodok","group":"ХОЛОДОК Жевательная резинка с начинкой","pack":20,"price":1.1,"per":"шт"},
  {"id":"p236","name":"Жевательная резинка с начинкой МЯТА \"Холодок\",флоупак,3,5гр 100шт/бл*20 GG-170","brand":"holodok","group":"ХОЛОДОК Жевательная резинка с начинкой","pack":20,"price":1.1,"per":"шт"},
  {"id":"p237","name":"Жевательная резинка с начинкой ВИНОГРАД \"Электрошок\",флоупак,3,5гр 100шт/бл*10 GG-185","brand":"holodok","group":"ЭЛЕКТРОШОК Жевательная резинка с начинкой","pack":10,"price":1.1,"per":"шт"},
  {"id":"p238","name":"Жевательная резинка с начинкой ВИШНЯ \"Электрошок\",флоупак,3,5гр 100шт/бл*20 GG-187","brand":"holodok","group":"ЭЛЕКТРОШОК Жевательная резинка с начинкой","pack":20,"price":1.1,"per":"шт"},
  {"id":"p239","name":"Жевательная резинка с начинкой ГРЕЙПФРУТ \"Электрошок\",флоупак,3,5гр 100шт/бл*20 GG-186","brand":"holodok","group":"ЭЛЕКТРОШОК Жевательная резинка с начинкой","pack":20,"price":1.1,"per":"шт"},
  {"id":"p240","name":"Жевательная резинка с начинкой КОЛА \"Электрошок\",флоупак,3,5гр 100шт/бл*20 GG-188","brand":"holodok","group":"ЭЛЕКТРОШОК Жевательная резинка с начинкой","pack":20,"price":1.1,"per":"шт"},
  {"id":"p241","name":"Конфеты \"Холодок\" со вкусом \"Ассорти\" с витамином С,в диспенсере, 14гр 18шт/бл*24 DE-042","brand":"holodok","group":"Конфеты-дражже","pack":24,"price":11.5,"per":"шт"},
  {"id":"p242","name":"Конфеты \"Холодок\" со вкусом \"Ассорти\" 15гр с витамином С,в стике, 30шт/бл*24 DE-040","brand":"holodok","group":"Конфеты-дражже","pack":24,"price":5.6,"per":"шт"}]

// Бесплатная доставка по Красноярску — от этой суммы
export const akFreeFrom = 2000

export const akTotal = {
  items: 1315,
  priced: 1045,
}

export const akContacts = {
  original: 'https://aks124.ru/',
  company: 'ИП Аксюченко Олег Васильевич',
  phones: [
    { label: '8 (391) 291-85-78', href: 'tel:+73912918578' },
    { label: '8 (391) 292-85-31', href: 'tel:+73912928531' },
  ],
  email: 'aksuchenko@rambler.ru',
  address: 'Красноярск, ул. Дудинская, 6, оф. 2-01',
  addressFull: '660020, г. Красноярск, ул. Дудинская, д. 6, оф. 2-01',
  hours: 'Пн–пт 9:00–18:00',
  geo: [56.02698, 92.89458] as const,
  vk: 'https://vk.com/aks124ru',
  ok: 'https://ok.ru/group/55307079778312',
  requisites: [
    ['ИП', 'Аксюченко Олег Васильевич'],
    ['ИНН', '246500472853'],
    ['ОГРНИП', '304246507800021'],
    ['Зарегистрирован', '18.03.2005'],
    ['Банк', 'Альфа-Банк, филиал «Новосибирский»'],
  ] as const,
}

// «Вид деятельности» — тот же список, что в формах оригинала
export const akKinds = [
  'Оптовая компания',
  'Розничный магазин',
  'Ресторан',
  'Пекарня',
  'Пищевое производство',
  'Кондитерское производство',
  'Частное лицо',
  'Другое',
]

// Блок главной оригинала «Всегда в наличии на складе» — те же 8 разделов
export const akStock = [
  { section: 'specii-pripravy', title: 'Специи и приправы', img: 'https://aks124.ru/d/zastavka_spetsii.jpg' },
  { section: 'konservy', title: 'Консервы', img: 'https://aks124.ru/d/goroshek_zelen_boyarin_212_gr.jpg', pack: true },
  { section: 'produkty-bystrogo-prigotovleniya', title: 'Быстрого приготовления', img: 'https://aks124.ru/d/bystr_prod.jpg' },
  { section: 'south-east-asia-products', title: 'Юго-Восточная Азия', img: 'https://aks124.ru/d/aziya1.jpg' },
  { section: 'rastitelnoe-maslo-majonez', title: 'Масло и майонез', img: 'https://aks124.ru/d/tpl25_jp5.jpg' },
  { section: 'drozhzhi-kvas', title: 'Дрожжи и квас', img: 'https://aks124.ru/d/drozhzhi_2.jpg' },
  { section: 'shokolad-batonchiki', title: 'Шоколад и батончики', img: 'https://aks124.ru/d/shokolad.jpg' },
  { section: 'chaj-kofe', title: 'Чай и кофе', img: 'https://aks124.ru/d/torabika-macchiato.jpg', pack: true },
]

// Карусель «Торговые марки» с главной оригинала
export const akLogos = [
  { title: 'Милка', img: 'https://aks124.ru/d/milka_logo.jpg' },
  { title: 'Nestlé', img: 'https://aks124.ru/d/nestle.jpg' },
  { title: 'Красный Октябрь', img: 'https://aks124.ru/d/kras_okt.png' },
  { title: 'Ritter Sport', img: 'https://aks124.ru/d/ritter_sport.jpg' },
  { title: 'Oreo', img: 'https://aks124.ru/d/oreo-high-definition.jpg' },
  { title: 'Барни', img: 'https://aks124.ru/d/barny_logo1.png' },
  { title: 'Orion', img: 'https://aks124.ru/d/orion-vietnam.jpg' },
  { title: 'Русский Бисквит', img: 'https://aks124.ru/d/kompaniya-russkij-biskvit.png' },
  { title: 'Nescafé', img: 'https://aks124.ru/d/20170306_blog_nescafe.jpg' },
  { title: 'Жокей', img: 'https://aks124.ru/d/tr_zhokej_logo.png' },
  { title: 'MacCoffee', img: 'https://aks124.ru/d/maccoffeerlogo.png' },
  { title: 'Tess', img: 'https://aks124.ru/d/logotip-tess.png' },
  { title: 'Нури', img: 'https://aks124.ru/d/nuri_new.jpg' },
  { title: 'Лисма', img: 'https://aks124.ru/d/logotip_lisma.jpg' },
  { title: 'Золотая Чаша', img: 'https://aks124.ru/d/zolotaya_chasha.jpg' },
  { title: 'Mamba', img: 'https://aks124.ru/d/mamba.png' },
]

export const akQuickQueries = ['Вегета', 'Доширак', 'сгущёнка', 'Нури', 'Альпен Голд']

// Страница «Акции» оригинала: обе позиции — с их страницы (там стоит срок 01.10.18–10.10.18)
export const akPromo = [
  { title: 'Дрожжи «Саф-Момент»', text: 'Цена снижена', price: 9.5, per: 'шт', section: 'drozhzhi-kvas', img: 'https://aks124.ru/d/drozhzhi_2.jpg' },
  { title: 'Кофе 3 в 1 TORA BIKA Cappuccino', text: 'Цена снижена', price: 10, per: 'шт', section: 'chaj-kofe', img: 'https://aks124.ru/d/torabika-macchiato.jpg' },
]

const BASE = '/redesign/aks124'
export const akPath = (p = '') => `${BASE}${p}`
export const akSectionPath = (id?: string) => (id ? `${BASE}/catalog/${id}` : `${BASE}/catalog`)
export const akBrandPath = (b: AkBrand) => `${akSectionPath(b.section)}?brand=${b.id}`

const itemById = new Map(akItems.map((i) => [i.id, i]))
const brandById = new Map(akBrands.map((b) => [b.id, b]))
export const akFind = (id: string) => itemById.get(id)
export const akBrand = (id: string) => brandById.get(id)
export const akSection = (id: string) => akSections.find((s) => s.id === id)
export const akBrandsOf = (section: string) => akBrands.filter((b) => b.section === section)
export const akItemsOf = (brand: string) => akItems.filter((i) => i.brand === brand)
export const akMinPrice = (section: string) => {
  const ids = new Set(akBrandsOf(section).map((b) => b.id))
  const prices = akItems.filter((i) => ids.has(i.brand) && i.price).map((i) => i.price!)
  return prices.length ? Math.min(...prices) : 0
}

const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е').replace(/["«»]/g, '')
// «сгущёнка» ищет «сгущ», «Альпен Голд» — оба слова в любом порядке
const words = (q: string) =>
  norm(q)
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w.length > 5 ? w.slice(0, -2) : w))
export const akSearch = (q: string) => {
  const ws = words(q)
  if (!ws.length) return []
  return akItems.filter((i) => {
    const hay = norm(`${i.name} ${akBrand(i.brand)?.title ?? ''} ${i.group ?? ''}`)
    return ws.every((w) => hay.includes(w))
  })
}
export const akSearchBrands = (q: string) => {
  const ws = words(q)
  return akBrands.filter((b) => ws.every((w) => norm(b.title).includes(w)))
}

const rub = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const rub0 = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
export const akMoney = (n: number) => `${rub.format(n)} ₽`
export const akMoney0 = (n: number) => `${rub0.format(Math.round(n))} ₽`
const plural = (n: number, one: string, few: string, many: string) => {
  const a = n % 10
  const b = n % 100
  if (a === 1 && b !== 11) return one
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few
  return many
}
export const akPositions = (n: number) => `${n} ${plural(n, 'позиция', 'позиции', 'позиций')}`
export const akPacks = (n: number) => `${n} уп.`
