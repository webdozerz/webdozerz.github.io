window.SOBES = window.SOBES || { topics: [], quiz: [] };

window.SOBES.topics.push(
  // ───────────────────────────── Типы ─────────────────────────────
  {
    id: 'ts-type-interface',
    section: 'ts',
    group: 'Типы',
    title: 'type vs interface',
    level: 'junior',
    summary: 'interface описывает форму объекта и умеет сливаться, type даёт имя любому типу: union, кортежу, условному, mapped.',
    what: 'interface описывает только форму объекта (или функции, класса). type — это псевдоним для любого типа: объекта, union, кортежа, примитива, условного или mapped-типа. Для простых объектов они почти взаимозаменяемы.',
    why: 'Нужны, чтобы дать типу имя и переиспользовать его: пропсы компонента, ответ API, модель домена. Выбор между ними влияет на расширяемость и читаемость ошибок.',
    when: 'interface — для публичных объектных контрактов, которые могут расширять (в том числе через declaration merging в библиотеках). type — когда нужен union, кортеж, utility или условный тип. В команде главное — договориться и быть последовательным.',
    diff: 'interface сливается при повторном объявлении (declaration merging), type с тем же именем даёт ошибку Duplicate identifier. interface расширяется через extends и сразу ругается на несовместимые свойства; type комбинируется через &, и конфликт тихо превращает свойство в never. Union и mapped-типы можно сделать только через type.',
    code: [
      {
        title: 'Declaration merging и расширение',
        lang: 'ts',
        src: `interface User {
  id: number
}
interface User {
  name: string
}
// User = { id: number; name: string } — объявления слились

interface Admin extends User {
  role: 'admin'
}

type Status = 'idle' | 'loading' | 'error' // только через type
type Point = [x: number, y: number]         // кортеж — тоже type`
      },
      {
        title: 'Дополнение чужих типов через merging',
        lang: 'ts',
        src: `// types/vue.d.ts — расширяем глобальные свойства Vue
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $formatPrice: (value: number) => string
  }
}`
      },
      {
        title: 'extends против & при конфликте',
        lang: 'ts',
        src: `interface A { id: string }
// interface B extends A { id: number }
// Ошибка: Interface 'B' incorrectly extends interface 'A'

type C = { id: string } & { id: number }
// Ошибки нет, но C['id'] — never, создать такой объект нельзя`
      }
    ],
    real: 'В Nuxt-проекте модели ответов API и пропсы удобно держать как interface, а статусы, варианты кнопок и состояния запроса — как union через type. Merging нужен, когда типизируешь $-плагины, runtimeConfig или расширяешь типы сторонней библиотеки.',
    pitfalls: [
      'Случайно объявить два interface с одним именем в глобальной области — они молча сольются, и в типе появятся лишние поля.',
      'Комбинировать через & объекты с одноимёнными полями разных типов — получится never вместо ошибки, и проблема всплывёт далеко от места объявления.',
      'Спорить о «правильном» варианте вместо единого правила в команде: смесь без системы хуже любого выбора.'
    ],
    questions: [
      {
        id: 'ts-type-interface-q1',
        q: 'Чем type отличается от interface? Когда что используете?',
        level: 'junior',
        keys: [
          'interface — только объектные формы, type — любой тип',
          'interface сливается (declaration merging), type нет',
          'union, кортежи, mapped и условные типы — только type',
          'extends у interface проверяет совместимость, & у type нет'
        ],
        a: 'interface описывает форму объекта, а type — это имя для любого типа, включая union, кортежи и условные типы. Главное поведенческое отличие — interface с одним именем сливаются, поэтому через них расширяют чужие типы, например ComponentCustomProperties во Vue. Ещё extends у интерфейса сразу ругается на несовместимое поле, а пересечение через & тихо делает его never. Я беру interface для объектных контрактов вроде моделей API, а type — для union, утилит и всего вычисляемого.'
      },
      {
        id: 'ts-type-interface-q2',
        q: 'Что такое declaration merging и где он реально пригождается?',
        level: 'middle',
        keys: [
          'несколько объявлений interface с одним именем объединяются',
          'так расширяют типы библиотек через declare module',
          'во Vue — ComponentCustomProperties для глобальных свойств',
          'с type не работает — будет Duplicate identifier'
        ],
        a: 'Это когда компилятор объединяет несколько объявлений интерфейса с одним именем в один тип. На практике это механизм аугментации: через declare module можно дописать поля в интерфейс библиотеки, не трогая её код. Во Vue так типизируют глобальные свойства через ComponentCustomProperties, в Nuxt похожим образом дополняются типы для плагинов и конфигурации. С type это не сработает — повторное объявление даст ошибку.'
      }
    ]
  },
  {
    id: 'ts-generics',
    section: 'ts',
    group: 'Типы',
    title: 'Generics',
    level: 'middle',
    summary: 'Generics — параметры для типов: функция или тип работает с любым T и сохраняет связь между входом и выходом.',
    what: 'Generic — это тип-параметр, который подставляется при использовании. Функция identity<T>(x: T): T вернёт ровно тот тип, который получила. Ограничение T extends X сужает допустимые типы, а дефолт T = X задаёт значение по умолчанию.',
    why: 'Позволяют писать переиспользуемый код без потери типов: HTTP-клиент, composable, хранилище, утилиту. Без generics пришлось бы либо дублировать код, либо уходить в any.',
    when: 'Когда тип выхода зависит от типа входа или нужно связать несколько параметров между собой. Если T используется в сигнатуре один раз и ничего не связывает, generic лишний — хватит обычного типа.',
    diff: 'В отличие от any, generic сохраняет конкретный тип, и после вызова TS знает, что именно вернулось. В отличие от union, T фиксируется на один конкретный тип для каждого вызова.',
    code: [
      {
        title: 'Ограничение и keyof',
        lang: 'ts',
        src: `function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { id: 1, name: 'Ann' }
const n = getProp(user, 'name') // string
// getProp(user, 'age')          // ошибка: 'age' не ключ user`
      },
      {
        title: 'Дефолт для параметра типа',
        lang: 'ts',
        src: `interface ApiResponse<T = unknown> {
  data: T
  status: number
}

const raw: ApiResponse = { data: null, status: 200 }          // data: unknown
const list: ApiResponse<string[]> = { data: ['a'], status: 200 }`
      },
      {
        title: 'infer: вытащить тип изнутри',
        lang: 'ts',
        src: `type ElementOf<T> = T extends (infer U)[] ? U : never

type A = ElementOf<string[]>      // string
type B = ElementOf<number>        // never

type Unwrap<T> = T extends Promise<infer V> ? V : T
type C = Unwrap<Promise<number>>  // number`
      }
    ],
    real: 'Типичный пример — обёртка над fetch вида request<T>(url): Promise<T>, где T — ожидаемый DTO. Ещё composable useList<T>() для пагинации или таблиц, который возвращает Ref<T[]> и не знает заранее, какие там сущности.',
    pitfalls: [
      'Писать generic без ограничения и потом обращаться к полям T — TS не позволит, нужно T extends { id: number }.',
      'Использовать generic там, где он ничего не связывает (function log<T>(x: T): void) — это лишний шум.',
      'Передавать T явно, когда TS сам выведет его из аргументов, — код длиннее, а пользы нет.'
    ],
    questions: [
      {
        id: 'ts-generics-q1',
        q: 'Зачем нужны generics и чем они лучше any?',
        level: 'junior',
        keys: [
          'параметр типа подставляется при вызове',
          'сохраняется связь между входом и выходом',
          'any отключает проверку, generic сохраняет конкретный тип',
          'переиспользуемый код без дублирования'
        ],
        a: 'Generic — это параметр для типа: я пишу функцию один раз, а конкретный тип подставляется при вызове. Главное — сохраняется связь между входом и выходом: если передал массив User, получу User, а не что-то абстрактное. С any функция тоже «работает с чем угодно», но после вызова TS про результат ничего не знает, и ошибки уходят в рантайм. Поэтому HTTP-клиенты, composables и утилиты я пишу на generics.'
      },
      {
        id: 'ts-generics-q2',
        q: 'Что делает T extends keyof U и зачем нужны ограничения?',
        level: 'middle',
        keys: [
          'extends в generic — ограничение допустимых типов',
          'keyof U — union ключей U',
          'T[K] — тип значения по ключу (indexed access)',
          'без ограничения нельзя обращаться к полям T'
        ],
        a: 'extends в параметре типа — это ограничение: T может быть только тем, что совместимо с указанным типом. keyof U даёт union ключей объекта, поэтому K extends keyof U значит «K — один из ключей U». В связке с T[K] получается функция, которая принимает только существующий ключ и возвращает точный тип значения. Без ограничения TS не даст обратиться к полям T, потому что про T ничего не известно.'
      },
      {
        id: 'ts-generics-q3',
        q: 'Что такое infer и где вы его встречали?',
        level: 'middle+',
        keys: [
          'работает только внутри условного типа',
          'объявляет переменную типа, которую TS выводит сам',
          'на нём построены ReturnType, Parameters, Awaited',
          'пример: достать тип элемента массива или значения Promise'
        ],
        a: 'infer используется внутри условного типа и говорит: «выведи вот этот кусок сам и назови его». Например, T extends Promise<infer V> ? V : T достаёт тип из промиса. На этом построены стандартные ReturnType, Parameters и Awaited. В прикладном коде пишу такое редко, но понимать полезно — например, чтобы вытащить тип элемента из массива, который пришёл из чужого API.'
      }
    ]
  },
  {
    id: 'ts-union-intersection',
    section: 'ts',
    group: 'Типы',
    title: 'Union и intersection',
    level: 'junior',
    summary: 'Union A | B — значение одного из типов, intersection A & B — значение, у которого есть всё сразу.',
    what: 'Union (A | B) значит «либо A, либо B»: пока тип не сужен, доступны только общие свойства. Intersection (A & B) значит «и A, и B одновременно»: у объекта есть поля обоих типов. Для примитивов пересечение несовместимых типов (string & number) даёт never.',
    why: 'Union описывает варианты: статус запроса, разные формы ответа, nullable-значения. Intersection собирает тип из кусочков: базовая модель плюс служебные поля, пропсы плюс атрибуты.',
    when: 'Union — когда значение бывает разных видов, и дальше вы будете сужать тип. Intersection — когда нужно смешать несколько объектных типов в один. Для иерархий объектов интерфейсы с extends часто читаются лучше, чем &.',
    diff: 'Интуиция «union — это больше» верна для множества значений, но не для свойств: у A | B доступно меньше полей (только общие), у A & B — больше. Пересечение одноимённых полей разных типов не ошибка, а never.',
    code: [
      {
        title: 'Union: доступны только общие поля',
        lang: 'ts',
        src: `type Cat = { name: string; meow(): void }
type Dog = { name: string; bark(): void }

function greet(pet: Cat | Dog) {
  pet.name    // ок, есть у обоих
  // pet.bark() // ошибка: у Cat нет bark
  if ('bark' in pet) pet.bark() // после сужения — ок
}`
      },
      {
        title: 'Intersection: сборка типа из частей',
        lang: 'ts',
        src: `type Timestamps = { createdAt: string; updatedAt: string }
type Product = { id: number; title: string }

type ProductRow = Product & Timestamps
// { id; title; createdAt; updatedAt }

type Bad = string & number      // never
type Lit = 'a' | 'b' | string   // string — литералы поглощены`
      }
    ],
    real: 'Состояние запроса удобно описывать union-ом из объектов со статусом: idle, loading, success с data, error с error. А & часто встречается в типах сторонних библиотек и при сборке пропсов: свои пропсы плюс HTMLAttributes.',
    pitfalls: [
      'Ждать, что у A | B доступны поля обоих типов, — доступны только общие, остальное требует сужения.',
      'Объединять литералы с string (\'sm\' | \'md\' | string) — тип схлопнется в string, и автодополнение пропадёт.',
      'Пересекать объекты с одноимёнными полями разных типов и получать never вместо понятной ошибки.'
    ],
    questions: [
      {
        id: 'ts-union-intersection-q1',
        q: 'Чем union отличается от intersection? Какие поля доступны у A | B и у A & B?',
        level: 'junior',
        keys: [
          'union — одно из, intersection — всё сразу',
          'у A | B без сужения доступны только общие поля',
          'у A & B доступны поля обоих типов',
          'string & number = never'
        ],
        a: 'Union — это «или»: значение одного из типов, поэтому без проверки TS разрешает только то, что есть у всех вариантов. Intersection — это «и»: объект одновременно соответствует обоим типам, и у него есть все поля. Звучит контринтуитивно, но union шире по множеству значений и уже по доступным свойствам. Для несовместимых примитивов пересечение вырождается в never.'
      },
      {
        id: 'ts-union-intersection-q2',
        q: 'Как бы вы типизировали состояние асинхронного запроса?',
        level: 'middle',
        keys: [
          'discriminated union по полю status',
          'data есть только в success, error только в error',
          'нельзя попасть в невозможное состояние вроде loading с ошибкой',
          'сужение через switch по status'
        ],
        a: 'Я бы сделал discriminated union: несколько объектных типов с общим литеральным полем status — idle, loading, success, error. data есть только у success, error — только у error. Так невозможно описать бессмысленное состояние вроде «загружается и уже упал», а в switch по status TS сам сузит тип и даст доступ к нужному полю. Это лучше, чем один объект с кучей опциональных полей, где всё может быть undefined.'
      }
    ]
  },
  {
    id: 'ts-utility',
    section: 'ts',
    group: 'Типы',
    title: 'Utility Types',
    level: 'middle',
    summary: 'Встроенные утилиты строят новые типы из существующих: Partial, Pick, Omit, Record, ReturnType, Awaited и другие.',
    what: 'Utility Types — встроенные generic-типы, которые трансформируют другие типы. Partial делает все поля опциональными, Required — обязательными, Readonly — только для чтения. Pick и Omit берут или выкидывают ключи, Record строит объект из ключей и значения. ReturnType, Parameters и Awaited достают типы из функций и промисов, NonNullable убирает null и undefined.',
    why: 'Чтобы не дублировать описания. Модель описана один раз, а форма редактирования, DTO на создание и ответ сервера выводятся из неё. Поменяли модель — производные типы обновились сами.',
    when: 'Когда новый тип — это вариация существующего. Если производный тип сильно отличается по смыслу, лучше описать его отдельно, чем строить цепочку Omit<Partial<Pick<...>>>.',
    diff: 'Большинство утилит — это mapped types ({ [K in keyof T]: ... }) или условные типы с infer, их можно написать самому. Omit не проверяет, что выкидываемый ключ существует, а Pick проверяет.',
    code: [
      {
        title: 'Производные типы от модели',
        lang: 'ts',
        src: `interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

type UserPatch = Partial<Omit<User, 'id'>>   // для PATCH
type UserPreview = Pick<User, 'id' | 'name'>
type UsersById = Record<number, User>
type Roles = Record<'admin' | 'editor', boolean>`
      },
      {
        title: 'Типы из функций',
        lang: 'ts',
        src: `async function fetchUser(id: number, full = false) {
  return { id, name: 'Ann' }
}

type Args = Parameters<typeof fetchUser>        // [id: number, full?: boolean]
type Ret = ReturnType<typeof fetchUser>         // Promise<{ id: number; name: string }>
type Data = Awaited<ReturnType<typeof fetchUser>> // { id: number; name: string }

type Id = NonNullable<string | null | undefined> // string`
      },
      {
        title: 'Свой Partial через mapped type',
        lang: 'ts',
        src: `type MyPartial<T> = { [K in keyof T]?: T[K] }
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }
type MyRequired<T> = { [K in keyof T]-?: T[K] } // -? снимает опциональность

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}`
      }
    ],
    real: 'В админке есть модель Product, из неё выводятся ProductCreate = Omit<Product, \'id\' | \'createdAt\'> и ProductPatch = Partial<ProductCreate>. А Awaited<ReturnType<typeof api.getOrders>> позволяет взять тип ответа функции, не описывая его вручную.',
    pitfalls: [
      'Ждать, что Partial рекурсивный, — он делает опциональным только верхний уровень, вложенные объекты остаются строгими.',
      'Опечататься в ключе Omit<User, \'emial\'> — ошибки не будет, просто ничего не выкинется.',
      'Думать, что Readonly защищает в рантайме, — это только проверка компилятора, объект остаётся изменяемым.',
      'Забыть Awaited с ReturnType async-функции и получить Promise<...> там, где ждали данные.'
    ],
    questions: [
      {
        id: 'ts-utility-q1',
        q: 'Какие Utility Types используете чаще всего и для чего?',
        level: 'junior',
        keys: [
          'Partial — для PATCH и черновиков форм',
          'Pick и Omit — производные DTO от модели',
          'Record — словари и маппинги',
          'ReturnType и Awaited — тип результата функции'
        ],
        a: 'Чаще всего Partial, Pick, Omit и Record. Partial — для PATCH-запросов и форм, где поля заполняются постепенно. Pick и Omit — чтобы из одной модели сделать DTO на создание или превью без дублирования. Record — для словарей вроде «статус → цвет бейджа». А Awaited<ReturnType<typeof fn>> выручает, когда нужен тип того, что вернула async-функция, и описывать его вручную не хочется.'
      },
      {
        id: 'ts-utility-q2',
        q: 'Как написать свой Partial? Что такое mapped types?',
        level: 'middle',
        keys: [
          'mapped type: { [K in keyof T]: ... }',
          'K пробегает все ключи T',
          'модификатор ? делает поле опциональным',
          '-? и -readonly снимают модификаторы',
          'встроенный Partial не рекурсивный'
        ],
        a: 'Partial — это mapped type: { [K in keyof T]?: T[K] }. Конструкция [K in keyof T] перебирает все ключи T, T[K] берёт тип значения, а знак вопроса делает поле опциональным. Модификаторы можно и снимать: -? делает поля обязательными, так устроен Required, а -readonly убирает readonly. Если нужен глубокий Partial, добавляю условный тип: если значение — объект, рекурсивно применяю тот же тип.'
      },
      {
        id: 'ts-utility-q3',
        q: 'Чем Omit отличается от Pick, кроме очевидного?',
        level: 'middle+',
        keys: [
          'Pick требует, чтобы ключи были в T',
          'Omit принимает любые ключи и не ругается на опечатки',
          'Omit на union-типе схлопывает его до общих полей',
          'для union нужен дистрибутивный вариант Omit'
        ],
        a: 'Pick ограничен keyof T, поэтому несуществующий ключ — ошибка. У Omit ограничение шире, любые строки, так что опечатка в ключе молча ничего не выкинет. Второй момент — Omit на union. Внутри он использует keyof от всего union, а это только общие ключи, поэтому варианты discriminated union схлопываются. Если нужно выкинуть поле из каждого варианта, пишут дистрибутивную версию через T extends unknown ? Omit<T, K> : never.'
      }
    ]
  },
  {
    id: 'ts-guards',
    section: 'ts',
    group: 'Типы',
    title: 'Type guards и сужение типов',
    level: 'middle',
    summary: 'Сужение (narrowing) — TS уточняет тип внутри ветки после проверок typeof, instanceof, in, сравнения или своего guard.',
    what: 'Type guard — проверка, после которой TS знает более точный тип. Встроенные: typeof для примитивов, instanceof для классов, in для наличия свойства, сравнение по литеральному полю в discriminated union. Свои guard-функции возвращают x is T, assertion-функции объявляются как asserts x is T и бросают ошибку, если условие не выполнено.',
    why: 'Чтобы безопасно работать с union и unknown: данными из API, ошибками в catch, событиями, вариантами состояния. Без сужения пришлось бы писать as, то есть обманывать компилятор.',
    when: 'Всегда, когда значение может быть разных типов. Свой guard — когда проверка сложная и повторяется. asserts — когда при несоответствии нужно сразу упасть, например при проверке конфигурации или входных данных.',
    diff: 'as только говорит компилятору «поверь мне» и ничего не проверяет. Guard делает реальную проверку в рантайме и на её основе сужает тип. Но пользовательский guard TS не проверяет: если в нём ошибка, вы получите неверный тип.',
    code: [
      {
        title: 'Встроенные способы сужения',
        lang: 'ts',
        src: `function format(v: string | number | Date | null) {
  if (v === null) return '-'
  if (typeof v === 'string') return v.trim()   // string
  if (v instanceof Date) return v.toISOString() // Date
  return v.toFixed(2)                           // number
}

type Res = { ok: true; data: string[] } | { ok: false; error: string }
function handle(r: Res) {
  if (r.ok) r.data.length   // discriminated union
  else console.error(r.error)
}`
      },
      {
        title: 'Пользовательский guard и asserts',
        lang: 'ts',
        src: `interface User { id: number; name: string }

function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x && 'name' in x
}

function assertDefined<T>(v: T, msg: string): asserts v is NonNullable<T> {
  if (v == null) throw new Error(msg)
}

const el = document.querySelector('#app')
assertDefined(el, 'нет #app')
el.classList.add('ready') // дальше el: Element`
      },
      {
        title: 'Сужение в filter (TS 5.5+)',
        lang: 'ts',
        src: `const ids = [1, null, 3, undefined]

const a = ids.filter(x => x != null)
// TS 5.5+: number[] — предикат выводится сам

const b = ids.filter((x): x is number => typeof x === 'number')
// явный guard работает в любой версии`
      }
    ],
    real: 'В catch ошибка имеет тип unknown, и guard вида isAxiosError(e) или e instanceof FetchError позволяет достать статус. В обработке вебсокет-сообщений switch по полю type сужает payload до нужной формы.',
    pitfalls: [
      'typeof x === \'object\' пропускает null: после такой проверки тип object | null.',
      'Неверная реализация x is T: TS доверяет guard на слово, и ошибка в проверке превращается в ложный тип.',
      'Сужение теряется в колбэках: проверили поле объекта снаружи, а внутри setTimeout или .map TS снова считает его широким.',
      'Использовать as вместо guard для данных из API — компилятор доволен, а в рантайме падает.'
    ],
    questions: [
      {
        id: 'ts-guards-q1',
        q: 'Какие способы сужения типов знаете?',
        level: 'middle',
        keys: [
          'typeof для примитивов, instanceof для классов',
          'in для проверки наличия свойства',
          'сравнение по дискриминанту в discriminated union',
          'пользовательский guard x is T и asserts',
          'проверка на null/undefined и truthiness'
        ],
        a: 'Самые частые — typeof для примитивов и instanceof для классов вроде Date или Error. Оператор in проверяет наличие свойства и сужает union объектов. Для discriminated union достаточно сравнить литеральное поле, например status, и в каждой ветке switch будет свой тип. Если проверка сложная, пишу свою функцию с возвращаемым типом x is T, а если нужно упасть при несоответствии — функцию с asserts.'
      },
      {
        id: 'ts-guards-q2',
        q: 'Чем пользовательский type guard отличается от as? Какие у него риски?',
        level: 'middle',
        keys: [
          'as не делает проверок, только приведение',
          'guard выполняет реальную проверку в рантайме',
          'TS не проверяет корректность тела guard',
          'ошибка в guard даёт ложный тип'
        ],
        a: 'as — это просто утверждение для компилятора, в рантайме ничего не происходит. Guard — обычная функция с проверкой, которая возвращает boolean, а сигнатура x is T сообщает TS, как сузить тип при true. Риск в том, что TS не сверяет тело guard с типом: если я проверил только id, а написал x is User, компилятор поверит. Поэтому для данных с внешней границы надёжнее схемы валидации вроде zod, где проверка и тип берутся из одного места.'
      },
      {
        id: 'ts-guards-q3',
        q: 'Что такое assertion-функция и когда она удобнее guard?',
        level: 'middle+',
        keys: [
          'сигнатура asserts x is T или asserts condition',
          'бросает ошибку вместо возврата boolean',
          'после вызова тип сужен до конца области видимости',
          'не нужен if — удобно для инвариантов'
        ],
        a: 'Это функция с возвращаемым типом asserts x is T: она ничего не возвращает, а при несоответствии бросает ошибку. После её вызова TS считает тип суженным до конца блока, без всяких if. Удобно для инвариантов: элемент точно есть в DOM, переменная окружения задана, ответ имеет нужное поле. Есть нюанс — функцию нужно вызывать через явно типизированную ссылку, иначе TS ругнётся, что assertion требует явной аннотации.'
      }
    ]
  },
  {
    id: 'ts-any-unknown',
    section: 'ts',
    group: 'Типы',
    title: 'any vs unknown',
    level: 'junior',
    summary: 'any отключает проверку типов, unknown — безопасный «что угодно»: сначала проверь, потом используй.',
    what: 'any — это выход из системы типов: с ним можно делать что угодно, и он заражает всё, к чему прикасается. unknown тоже принимает любое значение, но пользоваться им нельзя, пока тип не сужен проверкой. Ещё есть never — пустой тип, и object — любое не примитивное значение.',
    why: 'unknown нужен на границах, где тип реально неизвестен: JSON.parse, ответ API, ошибка в catch, данные из postMessage или localStorage. Он заставляет проверить данные перед использованием.',
    when: 'unknown — по умолчанию для всего неизвестного. any — только как временная мера при миграции с JS или в редких местах, где типизация стоит больше, чем даёт. Лучше включить noImplicitAny в strict-режиме.',
    diff: 'any присваивается куда угодно и принимает что угодно. unknown принимает что угодно, но присвоить его можно только в unknown или any. В catch переменная по умолчанию unknown при strict (useUnknownInCatchVariables).',
    code: [
      {
        title: 'any молчит, unknown требует проверки',
        lang: 'ts',
        src: `const a: any = JSON.parse('{"x": 1}')
a.foo.bar()            // компилируется, падает в рантайме
const s: string = a    // тоже ок — any заражает

const u: unknown = JSON.parse('{"x": 1}')
// u.x                  // ошибка: 'u' is of type 'unknown'
// const t: string = u  // ошибка
if (typeof u === 'object' && u !== null && 'x' in u) {
  console.log(u.x)     // ок после сужения
}`
      },
      {
        title: 'Ошибка в catch',
        lang: 'ts',
        src: `try {
  await saveOrder()
} catch (e) {
  // e: unknown в strict-режиме
  const message = e instanceof Error ? e.message : String(e)
  toast.error(message)
}`
      }
    ],
    real: 'Универсальная функция парсинга localStorage возвращает unknown, а дальше вызывающий код проверяет значение схемой. В legacy-проекте при переезде на TS any временно ставят на сложные модули и постепенно заменяют.',
    pitfalls: [
      'Ставить any, чтобы «убрать красное», — ошибка уезжает в рантайм, а any расползается по коду через присваивания.',
      'Делать as SomeType на unknown без проверки — это тот же any, только спрятанный.',
      'Отключать strict ради скорости: без noImplicitAny параметры функций молча становятся any.'
    ],
    questions: [
      {
        id: 'ts-any-unknown-q1',
        q: 'Чем any отличается от unknown?',
        level: 'junior',
        keys: [
          'оба принимают любое значение',
          'any отключает проверки, с unknown ничего нельзя без сужения',
          'unknown нельзя присвоить в конкретный тип',
          'any заражает код через присваивания'
        ],
        a: 'Оба типа принимают любое значение, разница в том, что с ним можно делать дальше. any выключает проверку: можно вызвать любой метод, присвоить в любую переменную, и ошибка всплывёт только в рантайме. unknown говорит «я не знаю, что это», поэтому TS ничего не разрешит, пока я не сузил тип через typeof, instanceof или guard. Я использую unknown для всего, что приходит снаружи, а any стараюсь не писать вовсе.'
      },
      {
        id: 'ts-any-unknown-q2',
        q: 'Какой тип у переменной ошибки в catch и как с ней работать?',
        level: 'middle',
        keys: [
          'в strict-режиме unknown (useUnknownInCatchVariables)',
          'бросить можно что угодно, не только Error',
          'сужать через instanceof Error или свой guard',
          'аннотировать e: Error в catch нельзя'
        ],
        a: 'В strict-режиме это unknown, потому что в JS бросить можно что угодно — строку, объект, промис. Поэтому перед использованием проверяю: e instanceof Error, и тогда доступен message, или специальный guard для ошибок HTTP-клиента, чтобы достать статус. Написать catch (e: Error) нельзя — разрешены только unknown и any. Без strict там был бы any, и e.message компилировался бы без проверки.'
      }
    ]
  },
  {
    id: 'ts-never',
    section: 'ts',
    group: 'Типы',
    title: 'never',
    level: 'middle',
    summary: 'never — пустой тип без значений: функция не возвращается, ветка недостижима, вариант отфильтрован.',
    what: 'never — тип, у которого нет ни одного значения. Его возвращает функция, которая всегда бросает ошибку или зацикливается. Его получает переменная в ветке, куда исполнение не может попасть после всех проверок. never можно присвоить куда угодно, а в never — ничего, кроме never.',
    why: 'Главное практическое применение — exhaustive check: компилятор подскажет, что в switch по union забыли новый вариант. В условных типах never работает как «выкинуть»: в union он исчезает (string | never = string).',
    when: 'В default у switch по discriminated union, в функциях-ошибках вида fail(msg): never, в условных типах для фильтрации. Если never появился там, где вы его не ждали, обычно это признак конфликта типов.',
    diff: 'void — функция завершилась, но ничего полезного не вернула. never — функция не завершается нормально. unknown — множество всех значений, never — пустое множество.',
    code: [
      {
        title: 'Exhaustive check',
        lang: 'ts',
        src: `type Shape =
  | { kind: 'circle'; r: number }
  | { kind: 'square'; side: number }

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.r ** 2
    case 'square': return s.side ** 2
    default: {
      const _exhaustive: never = s
      // добавили 'triangle' в Shape — здесь появится ошибка
      return _exhaustive
    }
  }
}`
      },
      {
        title: 'never в условных типах',
        lang: 'ts',
        src: `type MyExclude<T, U> = T extends U ? never : T

type A = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
type B = string | never                  // string
type C = string & never                  // never

function fail(msg: string): never {
  throw new Error(msg)
}`
      }
    ],
    real: 'В редьюсере событий вебсокета или в маппинге статусов заказа в подписи exhaustive check ловит ситуацию, когда бэкенд добавил новый статус, а фронт забыл его обработать. Ошибка видна на сборке, а не у пользователя.',
    pitfalls: [
      'Писать default: return null вместо проверки на never — новый вариант union тихо уходит в дефолтную ветку.',
      'Не замечать, что тип стал never из-за конфликта в &, — потом всё «вдруг» перестаёт присваиваться.',
      'Путать never с void в типе возврата: функция с return; — это void, а не never.'
    ],
    questions: [
      {
        id: 'ts-never-q1',
        q: 'Что такое never и где он полезен на практике?',
        level: 'middle',
        keys: [
          'тип без значений, пустое множество',
          'функция бросает ошибку или не завершается',
          'exhaustive check в switch',
          'в union исчезает, используется для фильтрации в условных типах'
        ],
        a: 'never — тип, у которого нет значений. Его возвращают функции, которые всегда бросают ошибку, и его получает значение в недостижимой ветке. Практически я использую его для exhaustive check: в default у switch присваиваю значение в переменную типа never, и если кто-то добавит новый вариант в union, сборка упадёт ровно в этом месте. Ещё never — основа фильтрации в условных типах, потому что в union он просто исчезает.'
      },
      {
        id: 'ts-never-q2',
        q: 'Чем never отличается от void?',
        level: 'middle',
        keys: [
          'void — функция завершилась без полезного значения',
          'never — функция не завершается нормально',
          'never присваивается куда угодно, void — нет',
          'never — пустое множество значений'
        ],
        a: 'void значит «функция отработала и вернула управление, но результат не важен» — обычный обработчик клика. never значит «управление не вернётся никогда»: функция бросает исключение или крутится бесконечно. Поэтому never совместим с любым типом — значения всё равно не будет, а void так не работает. В выводе типов TS ставит never, только если явно видит, что конец функции недостижим.'
      }
    ]
  },

  // ───────────────────────── TS во Vue и Nuxt ─────────────────────────
  {
    id: 'ts-api',
    section: 'ts',
    group: 'TS во Vue и Nuxt',
    title: 'Типизация API',
    level: 'middle',
    summary: 'DTO описывают контракт с бэкендом, дженерик-клиент возвращает нужный тип, а на границе данные проверяются схемой.',
    what: 'DTO — типы данных, которые приходят и уходят по сети. Дженерик-клиент вида get<T>(url) возвращает Promise<T>, чтобы каждый вызов знал свой тип. Но тип — это обещание, а не проверка: если бэкенд вернёт другое, TS не узнает. Поэтому на границе данные можно валидировать схемой, например zod, и выводить тип из неё.',
    why: 'Типы ответов дают автодополнение и ловят ошибки при изменении контракта. Валидация на границе превращает «undefined is not a function где-то в шаблоне» в понятную ошибку при парсинге ответа.',
    when: 'Типизировать ответы — всегда. Рантайм-валидацию — для внешних или нестабильных API, форм и критичных данных. Если типы генерируются из OpenAPI и бэкенд свой, полная валидация каждого ответа бывает избыточной.',
    diff: 'Аннотация useFetch<User>() или as User ничего не проверяет. zod-схема проверяет данные в рантайме и через z.infer даёт тот же тип, поэтому тип и проверка не расходятся. В Nuxt useFetch к своим server/api роутам выводит тип ответа сам, без generic.',
    code: [
      {
        title: 'Дженерик-клиент на $fetch',
        lang: 'ts',
        src: `export interface ProductDto {
  id: number
  title: string
  price: number
}

export const api = {
  get<T>(url: string, query?: Record<string, unknown>) {
    return $fetch<T>(url, { baseURL: '/api', query })
  },
  post<T, B = unknown>(url: string, body: B) {
    return $fetch<T>(url, { baseURL: '/api', method: 'POST', body })
  }
}

const list = await api.get<ProductDto[]>('/products') // ProductDto[]`
      },
      {
        title: 'Валидация на границе через zod',
        lang: 'ts',
        src: `import { z } from 'zod'

const Product = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number().nonnegative()
})
export type Product = z.infer<typeof Product>

export async function getProduct(id: number): Promise<Product> {
  const raw: unknown = await $fetch('/api/products/' + id)
  return Product.parse(raw) // бросит ZodError, если формат не тот
}`
      },
      {
        title: 'Типы useFetch',
        lang: 'vue',
        src: `<script setup lang="ts">
import type { ProductDto } from '~/types/api'

const { data, error, status } = await useFetch<ProductDto[]>('/api/products', {
  key: 'products',
  query: { page: 1 }
})
// data: Ref<ProductDto[] | null> в Nuxt 3 (в Nuxt 4 — undefined вместо null)

const { data: titles } = await useFetch<ProductDto[]>('/api/products', {
  transform: items => items.map(p => p.title)
}) // titles: Ref<string[] | null>
</script>`
      }
    ],
    real: 'Типичная схема: типы генерируются из OpenAPI-спецификации бэкенда, поверх них тонкий клиент на $fetch, а для форм и внешних интеграций — zod-схемы. В Nuxt серверные роуты в server/api возвращают типизированные данные, и useFetch на клиенте получает тип автоматически.',
    pitfalls: [
      'Считать, что useFetch<User>() гарантирует формат, — это аннотация, рантайм-проверки нет.',
      'Забывать, что data в useFetch может быть пустым (null в Nuxt 3), и обращаться к data.value.items без проверки.',
      'Дублировать тип вручную рядом с zod-схемой — со временем они разъедутся, тип надо выводить через z.infer.',
      'Использовать одни и те же типы для ответа и для тела запроса — у создания нет id и служебных полей.'
    ],
    questions: [
      {
        id: 'ts-api-q1',
        q: 'Как вы типизируете работу с API на фронтенде?',
        level: 'middle',
        keys: [
          'DTO для запросов и ответов, лучше генерировать из OpenAPI',
          'дженерик-клиент get<T>(): Promise<T>',
          'отдельные типы для создания, обновления и ответа',
          'тип не проверяет данные в рантайме'
        ],
        a: 'Описываю DTO для запросов и ответов, а если есть OpenAPI — генерирую их, чтобы не писать руками. Сверху тонкий клиент на $fetch с generic, и каждый вызов знает свой тип. Для создания и обновления делаю отдельные типы через Omit и Partial, потому что там нет id и служебных полей. При этом помню, что всё это только обещание компилятору: если бэкенд поменяет формат, TS не узнает, поэтому для критичных мест добавляю валидацию.'
      },
      {
        id: 'ts-api-q2',
        q: 'Зачем валидировать ответ API, если есть типы? Как это сделать?',
        level: 'middle+',
        keys: [
          'типы стираются при компиляции, в рантайме их нет',
          'бэкенд может вернуть не то, что описано',
          'схема (zod) проверяет данные и даёт тип через z.infer',
          'ошибка падает на границе, а не в глубине UI'
        ],
        a: 'Типы существуют только до компиляции, в рантайме их нет, и as User ничего не проверяет. Если бэкенд прислал null вместо массива, упадёт где-нибудь в шаблоне, далеко от причины. Схема вроде zod проверяет данные прямо на входе, а тип я получаю через z.infer, так что проверка и тип не расходятся. Проверять всё подряд не обязательно, но внешние API, формы и платёжные данные я бы валидировал.'
      },
      {
        id: 'ts-api-q3',
        q: 'Какой тип у data из useFetch и откуда он берётся?',
        level: 'middle',
        keys: [
          'Ref с типом ответа, плюс null в Nuxt 3 (undefined в Nuxt 4)',
          'для своих server/api роутов тип выводится автоматически',
          'для внешних URL — generic useFetch<T>()',
          'transform меняет итоговый тип data'
        ],
        a: 'data — это Ref с типом ответа, который может быть пустым: в Nuxt 3 это null, в Nuxt 4 поменяли на undefined. Если запрос идёт к своему роуту из server/api, Nuxt выводит тип из того, что возвращает обработчик, и generic не нужен. Для внешних URL указываю тип явно через useFetch<T>(). Если есть transform, тип data становится тем, что вернул transform, а не исходным ответом.'
      }
    ]
  },
  {
    id: 'ts-vue-props-emits',
    section: 'ts',
    group: 'TS во Vue и Nuxt',
    title: 'Типизация props, emits и v-model',
    level: 'middle',
    summary: 'defineProps<T>(), defineEmits<T>() и defineModel<T>() типизируют контракт компонента, а generic="T" делает его обобщённым.',
    what: 'В script setup пропсы описываются типом: defineProps<Props>(). Дефолты задаются через withDefaults или, начиная с Vue 3.5, деструктуризацией с значениями по умолчанию — она остаётся реактивной. События типизируются в defineEmits, v-model — через defineModel<T>(). Атрибут generic на script setup делает компонент дженериком.',
    why: 'Родитель получает автодополнение и ошибки, если передал не тот проп или подписался на несуществующее событие. Внутри компонента типы пропсов и payload событий известны без ручных проверок.',
    when: 'Type-based объявление — по умолчанию в проектах на TS. Runtime-объявление (объект с type: String) нужно, если важны рантайм-предупреждения или проект без TS. Дженерик-компонент — для списков, селектов, таблиц, где тип элемента задаёт родитель.',
    diff: 'withDefaults работает с любой версией Vue 3 и script setup, деструктуризация с дефолтами реактивна только с 3.5. defineModel (стабилен с 3.4) заменяет пару prop modelValue + emit update:modelValue.',
    code: [
      {
        title: 'Props с дефолтами и emits',
        lang: 'vue',
        src: `<script setup lang="ts">
interface Props {
  title: string
  size?: 'sm' | 'md' | 'lg'
  items?: string[]
}

// Vue 3.5+: деструктуризация реактивна, дефолты прямо здесь
const { title, size = 'md', items = () => [] } = defineProps<Props>()
// раньше: withDefaults(defineProps<Props>(), { size: 'md', items: () => [] })

const emit = defineEmits<{
  select: [id: number]
  close: []
}>()

emit('select', 42)
// emit('select', '42') — ошибка типа
</script>`
      },
      {
        title: 'defineModel с типом',
        lang: 'vue',
        src: `<script setup lang="ts">
const query = defineModel<string>({ required: true })   // ModelRef<string>
const page = defineModel<number>('page', { default: 1 }) // v-model:page

function reset() {
  query.value = ''
  page.value = 1
}
</script>

<template>
  <input v-model="query" @keyup.esc="reset" />
</template>`
      },
      {
        title: 'Дженерик-компонент',
        lang: 'vue',
        src: `<script setup lang="ts" generic="T extends { id: number }">
defineProps<{
  items: T[]
  label: (item: T) => string
}>()

const emit = defineEmits<{ pick: [item: T] }>()
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id" @click="emit('pick', item)">
      {{ label(item) }}
    </li>
  </ul>
</template>`
      }
    ],
    real: 'В UI-ките кнопка, инпут и модалка типизированы через defineProps и defineModel, а таблица и селект — дженерик-компоненты: родитель передаёт items: Order[], и в слоте и событии pick автоматически приходит Order.',
    pitfalls: [
      'Деструктурировать пропсы до Vue 3.5 — получите нереактивные копии; в 3.5 деструктуризация реактивна, но передавать её в watch нужно как геттер: watch(() => size, ...).',
      'Задавать дефолт массива или объекта значением, а не фабрикой, в withDefaults — экземпляры будут делить один объект.',
      'defineModel<string>() без required даёт тип string | undefined — потом приходится городить проверки.',
      'Ждать рантайм-валидации от type-based пропсов — TS проверяет только на сборке.'
    ],
    questions: [
      {
        id: 'ts-vue-props-emits-q1',
        q: 'Как типизировать props и задать им значения по умолчанию в script setup?',
        level: 'middle',
        keys: [
          'defineProps<Props>() с интерфейсом',
          'withDefaults для дефолтов',
          'Vue 3.5: дефолты деструктуризацией, она реактивна',
          'для объектов и массивов — фабрика',
          'в watch деструктурированный проп передаётся геттером'
        ],
        a: 'Описываю интерфейс и передаю его в defineProps<Props>(), компилятор Vue сам сгенерирует runtime-объявление. Дефолты раньше задавал через withDefaults, где для массивов и объектов нужна фабрика. С Vue 3.5 можно деструктурировать прямо из defineProps и задать дефолты как в обычном JS — компилятор сохранит реактивность. Единственное — в watch такой проп передаю геттером, иначе Vue ругнётся.'
      },
      {
        id: 'ts-vue-props-emits-q2',
        q: 'Как типизировать события и v-model компонента?',
        level: 'middle',
        keys: [
          'defineEmits<{ event: [args] }>() — синтаксис с кортежами',
          'payload проверяется при вызове emit',
          'defineModel<T>() вместо modelValue + update:modelValue',
          'required: true убирает undefined из типа',
          'именованные модели: defineModel(\'page\')'
        ],
        a: 'Для событий использую defineEmits с объектом, где ключ — имя события, а значение — кортеж аргументов, например select: [id: number]. Тогда emit с неправильным payload не скомпилируется, а родитель получит типы в обработчике. Для v-model с 3.4 есть defineModel<T>(): он возвращает ref, который сам синхронизирован с родителем. Без required тип будет T | undefined, поэтому для обязательных моделей ставлю required: true или дефолт.'
      },
      {
        id: 'ts-vue-props-emits-q3',
        q: 'Что такое дженерик-компоненты во Vue и когда они нужны?',
        level: 'middle+',
        keys: [
          'атрибут generic на script setup',
          'можно задать ограничение: generic="T extends ..."',
          'T выводится из переданных пропсов',
          'типизированы emits и слоты по T',
          'для списков, таблиц, селектов'
        ],
        a: 'Это компонент с параметром типа, объявленным через атрибут generic на script setup, например generic="T extends { id: number }". T выводится из того, что родитель передал в пропсы, и дальше протаскивается в события и слоты. Без этого таблица или селект принимали бы unknown[], и в обработчике пришлось бы делать as. Я использую их для универсальных списков, таблиц и комбобоксов в UI-ките.'
      }
    ]
  },
  {
    id: 'ts-composables',
    section: 'ts',
    group: 'TS во Vue и Nuxt',
    title: 'Типизация composables',
    level: 'middle',
    summary: 'Composable принимает MaybeRefOrGetter<T>, читает его через toValue и возвращает объект из Ref — тип выводится сам.',
    what: 'Composable — функция на Composition API. Хороший composable принимает аргументы гибко: значение, ref или геттер — это тип MaybeRefOrGetter<T> (Vue 3.3+). Внутри значение читается через toValue, которое разворачивает ref и вызывает геттер. Возвращают обычно простой объект с ref-ами, чтобы его можно было деструктурировать.',
    why: 'Так composable реагирует на изменения входных данных: передали computed или геттер от пропса — и запрос перезапускается. Правильные типы возврата дают автодополнение у потребителя.',
    when: 'MaybeRefOrGetter — когда аргумент может меняться и composable должен на это реагировать. Если аргумент статичный (конфиг, ключ), достаточно обычного типа. Явный тип возврата пишут для публичных composables библиотеки, в остальном хватает вывода.',
    diff: 'unref разворачивает только ref, toValue — ещё и вызывает геттер. MaybeRef<T> — это T | Ref<T>, MaybeRefOrGetter<T> добавляет к нему функцию () => T. Ref<T> — изменяемый ref, ComputedRef<T> — только для чтения.',
    code: [
      {
        title: 'Гибкий аргумент и toValue',
        lang: 'ts',
        src: `import { ref, watchEffect, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

export function useProduct(id: MaybeRefOrGetter<number>) {
  const product: Ref<Product | null> = ref(null)
  const loading = ref(false)

  watchEffect(async () => {
    loading.value = true
    product.value = await api.get<Product>('/products/' + toValue(id))
    loading.value = false
  })

  return { product, loading }
}

// работает с числом, ref, computed и геттером:
// useProduct(5); useProduct(idRef); useProduct(() => props.id)`
      },
      {
        title: 'Дженерик-composable',
        lang: 'ts',
        src: `import { ref, computed, type Ref } from 'vue'

export function useSelection<T extends { id: number }>(items: Ref<T[]>) {
  const selectedIds = ref(new Set<number>())

  const selected = computed(() =>
    items.value.filter(i => selectedIds.value.has(i.id))
  ) // ComputedRef<T[]>

  function toggle(item: T) {
    const s = selectedIds.value
    s.has(item.id) ? s.delete(item.id) : s.add(item.id)
  }

  return { selected, toggle }
}`
      }
    ],
    real: 'useProduct(() => route.params.id) в карточке товара перезапрашивает данные при переходе между товарами без перезагрузки компонента. useSelection<Order> в таблице заказов даёт массовые действия с правильным типом выбранных строк.',
    pitfalls: [
      'Принимать просто number и передавать туда props.id — composable получит значение один раз и не отреагирует на изменение.',
      'Использовать unref вместо toValue — геттер не вызовется, и в переменной окажется функция.',
      'Возвращать reactive-объект — при деструктуризации у потребителя реактивность потеряется; лучше объект из ref.',
      'Объявлять ref(null) без типа — получится Ref<null>, и присвоить туда данные не получится.'
    ],
    questions: [
      {
        id: 'ts-composables-q1',
        q: 'Как типизировать аргументы composable, чтобы он работал и со значением, и с ref?',
        level: 'middle',
        keys: [
          'MaybeRefOrGetter<T> = T | Ref<T> | ComputedRef<T> | (() => T)',
          'читать через toValue внутри watch/computed/watchEffect',
          'toValue вызывает геттер, unref нет',
          'так composable реагирует на изменения входа'
        ],
        a: 'Принимаю аргумент как MaybeRefOrGetter<T> — это значение, ref, computed или геттер. Внутри читаю его через toValue, причём внутри watchEffect или computed, чтобы отслеживалась зависимость. Тогда useProduct(() => props.id) перезапросит данные, когда id поменяется. Важно не путать с unref: он разворачивает только ref, а геттер вернёт как функцию.'
      },
      {
        id: 'ts-composables-q2',
        q: 'Что должен возвращать composable и нужно ли явно указывать тип возврата?',
        level: 'middle',
        keys: [
          'обычный объект с ref-ами, а не reactive',
          'так можно деструктурировать без потери реактивности',
          'тип возврата обычно выводится сам',
          'явный тип — для публичного API и библиотек',
          'readonly для состояния, которое нельзя менять снаружи'
        ],
        a: 'Возвращаю обычный объект, в котором лежат ref-ы и функции, — его можно деструктурировать и ничего не потерять. Если вернуть reactive, деструктуризация отвяжет значения. Тип возврата обычно не пишу, TS выведет его точнее, чем я опишу руками. Явно указываю в общих библиотечных composables, чтобы случайно не поменять публичный контракт, а состояние, которое нельзя трогать снаружи, отдаю через readonly или computed.'
      }
    ]
  },
  {
    id: 'ts-pinia',
    section: 'ts',
    group: 'TS во Vue и Nuxt',
    title: 'Типизация Pinia',
    level: 'middle',
    summary: 'Setup store выводит все типы сам, в options store типизируют state() и getters, а storeToRefs сохраняет типы при деструктуризации.',
    what: 'В setup store (функция внутри defineStore) состояние — это ref, геттеры — computed, действия — функции, и TS выводит всё без аннотаций. В options store тип состояния задаётся возвратом state(): State, а геттерам, которые используют this, нужен явный тип возврата. storeToRefs превращает state и getters стора в типизированные ref-ы для деструктуризации.',
    why: 'Стор — общая точка данных для многих компонентов, и ошибка в его типе расползается по всему приложению. Правильные типы дают автодополнение в компонентах и ловят опечатки в полях.',
    when: 'Setup store — по умолчанию в TS-проектах: меньше церемоний, лучше вывод типов, можно использовать composables внутри. Options store — если команда к нему привыкла или нужен $reset из коробки.',
    diff: 'Деструктуризация стора напрямую ломает реактивность state и getters, storeToRefs — нет, а действия берутся прямо со стора. В options store $reset есть из коробки, в setup store его нужно написать самому.',
    code: [
      {
        title: 'Setup store: всё выводится',
        lang: 'ts',
        src: `export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const promo = ref<string | null>(null)

  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.qty, 0)
  ) // ComputedRef<number>

  function add(item: CartItem) {
    items.value.push(item)
  }

  return { items, promo, total, add }
})`
      },
      {
        title: 'Options store: state и getters',
        lang: 'ts',
        src: `interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({ user: null, token: null }),
  getters: {
    isLoggedIn: state => state.token !== null,
    // геттер через this — тип возврата обязателен
    greeting(): string {
      return this.isLoggedIn ? 'Привет, ' + this.user?.name : 'Войдите'
    }
  },
  actions: {
    logout() { this.$reset() }
  }
})`
      },
      {
        title: 'storeToRefs в компоненте',
        lang: 'vue',
        src: `<script setup lang="ts">
import { storeToRefs } from 'pinia'

const cart = useCartStore()
const { items, total } = storeToRefs(cart) // Ref<CartItem[]>, Ref<number>
const { add } = cart                        // действия — напрямую

// const { total } = cart — потеряет реактивность
</script>`
      }
    ],
    real: 'В Nuxt-магазине корзина и авторизация живут в setup stores, внутри которых используются composables вроде useCookie. Компоненты берут state через storeToRefs, а действия вызывают напрямую.',
    pitfalls: [
      'Деструктурировать стор без storeToRefs — значения state и getters станут статичными.',
      'Объявить в setup store ref(null) без типа — state станет Ref<null>, и записать туда пользователя не получится.',
      'Не вернуть ref из setup store — он не попадёт в state, не будет виден в devtools и не сериализуется при SSR.',
      'Геттер с this в options store без явного типа возврата — TS не выведет тип, и стор начнёт терять типизацию.'
    ],
    questions: [
      {
        id: 'ts-pinia-q1',
        q: 'Как типизируется стор в Pinia? Чем отличается setup store от options store?',
        level: 'middle',
        keys: [
          'setup store выводит типы из ref, computed и функций',
          'в options store тип state задаётся возвратом state()',
          'геттерам с this нужен явный тип возврата',
          'в setup store нужно вернуть всё состояние',
          '$reset из коробки только в options store'
        ],
        a: 'В setup store я пишу обычный Composition API: ref для состояния, computed для геттеров, функции для действий — и TS выводит всё сам, главное типизировать ref, если начальное значение null. В options store тип состояния задаю аннотацией возврата state(): AuthState, а геттерам, которые обращаются к this, указываю тип возврата явно, иначе вывод ломается. Я предпочитаю setup store: меньше церемоний и можно использовать composables. Только надо помнить, что всё состояние нужно вернуть из функции, а $reset придётся написать самому.'
      },
      {
        id: 'ts-pinia-q2',
        q: 'Зачем нужен storeToRefs?',
        level: 'junior',
        keys: [
          'стор — reactive-объект, деструктуризация теряет реактивность',
          'storeToRefs превращает state и getters в ref-ы',
          'типы сохраняются',
          'действия берутся прямо со стора'
        ],
        a: 'Стор — это reactive-объект, и если деструктурировать его напрямую, получатся обычные значения, которые не обновляются. storeToRefs оборачивает state и getters в ref-ы с сохранением типов, и деструктуризация становится безопасной. Действия через него не достаются — их берут прямо со стора, они и так привязаны к нему.'
      }
    ]
  }
);

window.SOBES.quiz.push(
  // ts-type-interface
  {
    id: 'qz-ts-type-interface-1',
    topic: 'ts-type-interface',
    type: 'single',
    q: 'Скомпилируется ли код?',
    code: `type User = { id: number }
type User = { name: string }`,
    options: [
      'Да, типы сольются в { id: number; name: string }',
      'Да, второе объявление перезапишет первое',
      'Нет, ошибка Duplicate identifier \'User\'',
      'Да, но User станет never'
    ],
    correct: [2],
    explain: 'Declaration merging работает только для interface (и namespace). Повторный type с тем же именем — ошибка. С двумя interface User код скомпилировался бы, и поля слились бы.'
  },
  {
    id: 'qz-ts-type-interface-2',
    topic: 'ts-type-interface',
    type: 'output',
    q: 'Какой тип будет у T[\'id\']?',
    code: `type A = { id: string }
type B = { id: number }
type T = A & B`,
    options: ['string | number', 'string', 'Ошибка компиляции на строке с &', 'never'],
    correct: [3],
    explain: 'При пересечении объектов типы одноимённых свойств тоже пересекаются: string & number = never. Ошибки на объявлении нет, она появится только при попытке создать значение такого типа. С interface B extends A компилятор сразу сообщил бы о несовместимости.'
  },
  {
    id: 'qz-ts-type-interface-3',
    topic: 'ts-type-interface',
    type: 'multi',
    q: 'Что можно описать только через type, но не через interface?',
    options: [
      'Union литералов \'sm\' | \'md\' | \'lg\'',
      'Объект с методами',
      'Кортеж [number, string]',
      'Mapped type { [K in Keys]: boolean }'
    ],
    correct: [0, 2, 3],
    explain: 'interface описывает объектную форму, в том числе с методами. Union, кортеж как самостоятельный тип и mapped type — это возможности type-алиасов.'
  },

  // ts-generics
  {
    id: 'qz-ts-generics-1',
    topic: 'ts-generics',
    type: 'output',
    q: 'Какой тип у переменной r?',
    code: `function first<T>(arr: T[]): T | undefined {
  return arr[0]
}
const r = first(['a', 'b'])`,
    options: ['string | undefined', '"a" | undefined', 'unknown', 'string[]'],
    correct: [0],
    explain: 'T выводится из аргумента: массив [\'a\', \'b\'] без as const имеет тип string[], значит T = string. Литералы сохранились бы при as const или с модификатором const T в параметре типа (TS 5.0+).'
  },
  {
    id: 'qz-ts-generics-2',
    topic: 'ts-generics',
    type: 'single',
    q: 'Скомпилируется ли вызов getProp(user, \'age\')?',
    code: `function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
const user = { id: 1, name: 'Ann' }
getProp(user, 'age')`,
    options: [
      'Да, вернёт undefined',
      'Да, тип результата unknown',
      'Нет: \'age\' не входит в \'id\' | \'name\'',
      'Нет: obj[key] без индексной сигнатуры запрещён'
    ],
    correct: [2],
    explain: 'K ограничен keyof T, а keyof типа user — это \'id\' | \'name\'. Строка \'age\' не подходит под ограничение. Само обращение obj[key] корректно именно благодаря этому ограничению.'
  },
  {
    id: 'qz-ts-generics-3',
    topic: 'ts-generics',
    type: 'output',
    q: 'Какой тип получится у X?',
    code: `type ToArray<T> = T extends any ? T[] : never
type X = ToArray<string | number>`,
    options: ['string[] | number[]', '(string | number)[]', 'never', 'any[]'],
    correct: [0],
    explain: 'Условный тип с голым параметром T дистрибутивен: он применяется к каждому члену union отдельно. Чтобы получить (string | number)[], параметр оборачивают: [T] extends [any] ? T[] : never.'
  },

  // ts-union-intersection
  {
    id: 'qz-ts-union-intersection-1',
    topic: 'ts-union-intersection',
    type: 'single',
    q: 'Скомпилируется ли функция?',
    code: `type Cat = { name: string; meow(): void }
type Dog = { name: string; bark(): void }

function talk(pet: Cat | Dog) {
  pet.bark()
}`,
    options: [
      'Да, вызов уйдёт в рантайм-проверку',
      'Да, потому что Dog входит в union',
      'Нет: у union нельзя вызывать методы',
      'Нет: свойство bark есть не у всех членов union'
    ],
    correct: [3],
    explain: 'Без сужения у union доступны только общие члены, здесь это name. Нужна проверка, например \'bark\' in pet, после которой тип сузится до Dog.'
  },
  {
    id: 'qz-ts-union-intersection-2',
    topic: 'ts-union-intersection',
    type: 'output',
    q: 'Какой тип у Size?',
    code: `type Size = 'sm' | 'md' | string`,
    options: ['\'sm\' | \'md\' | string', 'string', 'never', '\'sm\' | \'md\''],
    correct: [1],
    explain: 'Литералы \'sm\' и \'md\' — подтипы string, поэтому union схлопывается в string, и подсказки литералов пропадают. Если нужны и подсказки, и произвольная строка, пишут \'sm\' | \'md\' | (string & {}).'
  },
  {
    id: 'qz-ts-union-intersection-3',
    topic: 'ts-union-intersection',
    type: 'output',
    q: 'Какой тип у K?',
    code: `type A = { id: number; title: string }
type B = { id: number; price: number }
type K = keyof (A | B)`,
    options: ['\'id\' | \'title\' | \'price\'', 'never', 'string', '\'id\''],
    correct: [3],
    explain: 'keyof от union — это ключи, которые гарантированно есть у любого члена, то есть общие ключи. Для пересечения A & B keyof дал бы все три ключа.'
  },

  // ts-utility
  {
    id: 'qz-ts-utility-1',
    topic: 'ts-utility',
    type: 'output',
    q: 'Какой тип у R?',
    code: `async function load() {
  return { ok: true }
}
type R = ReturnType<typeof load>`,
    options: [
      'Promise<{ ok: boolean }>',
      '{ ok: boolean }',
      'Promise<{ ok: true }>',
      'Awaited<{ ok: boolean }>'
    ],
    correct: [0],
    explain: 'async-функция всегда возвращает Promise, и ReturnType отдаёт именно его. Литерал true в объекте расширяется до boolean, потому что свойство изменяемое. Чтобы получить сами данные, нужно Awaited<ReturnType<typeof load>>.'
  },
  {
    id: 'qz-ts-utility-2',
    topic: 'ts-utility',
    type: 'single',
    q: 'Скомпилируется ли присваивание?',
    code: `interface Settings {
  theme: string
  notify: { email: boolean; sms: boolean }
}
const patch: Partial<Settings> = {
  notify: { email: false }
}`,
    options: [
      'Да, Partial делает опциональными все поля на любой глубине',
      'Нет: не хватает поля theme',
      'Да, но notify станет типа any',
      'Нет: в notify не хватает обязательного поля sms'
    ],
    correct: [3],
    explain: 'Partial работает только на верхнем уровне: theme и notify стали опциональными, но сам объект notify остался строгим. Для вложенных объектов нужен рекурсивный DeepPartial на mapped и условных типах.'
  },
  {
    id: 'qz-ts-utility-3',
    topic: 'ts-utility',
    type: 'single',
    q: 'Что произойдёт с этим кодом?',
    code: `interface User { id: number; email: string }
type Public = Omit<User, 'emial'>`,
    options: [
      'Ошибка: \'emial\' не является ключом User',
      'Public = { id: number }',
      'Public = { id: number; email: string }, ошибки нет',
      'Public = never'
    ],
    correct: [2],
    explain: 'Второй параметр Omit ограничен string | number | symbol, а не keyof T, поэтому опечатка проходит молча и ничего не выкидывается. Pick<User, \'emial\'> дал бы ошибку.'
  },

  // ts-guards
  {
    id: 'qz-ts-guards-1',
    topic: 'ts-guards',
    type: 'output',
    q: 'Какой тип у v внутри if?',
    code: `function f(v: string | object | null) {
  if (typeof v === 'object') {
    v
  }
}`,
    options: ['object', 'string | object', 'never', 'object | null'],
    correct: [3],
    explain: 'typeof null === \'object\', и TS это учитывает: после такой проверки null остаётся в типе. Нужна дополнительная проверка v !== null.'
  },
  {
    id: 'qz-ts-guards-2',
    topic: 'ts-guards',
    type: 'output',
    q: 'Какой тип у ids в TypeScript 5.5+?',
    code: `const raw = [1, null, 2, undefined]
const ids = raw.filter(x => x != null)`,
    options: [
      '(number | null | undefined)[]',
      'number[]',
      '(number | undefined)[]',
      'unknown[]'
    ],
    correct: [1],
    explain: 'С TS 5.5 компилятор выводит type predicate из простых стрелочных функций вроде x => x != null, и filter сужает тип. В более старых версиях получилось бы (number | null | undefined)[], и нужен был явный guard (x): x is number.'
  },
  {
    id: 'qz-ts-guards-3',
    topic: 'ts-guards',
    type: 'single',
    q: 'Какой тип у s после вызова assertIsString?',
    code: `function assertIsString(v: unknown): asserts v is string {
  if (typeof v !== 'string') throw new Error('not a string')
}

const s: unknown = getValue()
assertIsString(s)
s`,
    options: ['string', 'unknown', 'string | undefined', 'never'],
    correct: [0],
    explain: 'Assertion-функция сужает тип до конца области видимости: если вызов не бросил ошибку, значит v — string. if для этого не нужен, в отличие от обычного guard с x is T.'
  },

  // ts-any-unknown
  {
    id: 'qz-ts-any-unknown-1',
    topic: 'ts-any-unknown',
    type: 'single',
    q: 'Какая строка не скомпилируется?',
    code: `const a: any = 1
const u: unknown = 1

const x: string = a  // 1
a.foo()              // 2
const y: string = u  // 3
const z: unknown = a // 4`,
    options: ['1', '2', '3', '4'],
    correct: [2],
    explain: 'any присваивается куда угодно и разрешает любые обращения, поэтому строки 1 и 2 проходят. В unknown можно положить что угодно (строка 4), но присвоить unknown в string без сужения нельзя.'
  },
  {
    id: 'qz-ts-any-unknown-2',
    topic: 'ts-any-unknown',
    type: 'output',
    q: 'Какой тип у e в strict-режиме и скомпилируется ли e.message?',
    code: `try {
  doWork()
} catch (e) {
  console.log(e.message)
}`,
    options: [
      'e: Error, компилируется',
      'e: any, компилируется',
      'e: unknown, ошибка на e.message',
      'e: Error | undefined, ошибка на e.message'
    ],
    correct: [2],
    explain: 'В strict включён useUnknownInCatchVariables, и переменная catch получает тип unknown, потому что бросить можно что угодно. Нужно сузить: e instanceof Error. Без этого флага было бы any.'
  },

  // ts-never
  {
    id: 'qz-ts-never-1',
    topic: 'ts-never',
    type: 'single',
    q: 'В тип Status добавили \'refunded\'. Что произойдёт с функцией?',
    code: `type Status = 'paid' | 'pending' | 'refunded'

function label(s: Status): string {
  switch (s) {
    case 'paid': return 'Оплачен'
    case 'pending': return 'Ожидает'
    default: {
      const _x: never = s
      return _x
    }
  }
}`,
    options: [
      'Всё скомпилируется, \'refunded\' уйдёт в default',
      'Ошибка: функция не всегда возвращает string',
      'Рантайм-ошибка при вызове с \'refunded\'',
      'Ошибка: \'refunded\' нельзя присвоить в never'
    ],
    correct: [3],
    explain: 'В default тип s сужается до всех необработанных вариантов, теперь это \'refunded\'. Присвоить его в never нельзя, и компилятор показывает, какой case забыли. В этом смысл exhaustive check.'
  },
  {
    id: 'qz-ts-never-2',
    topic: 'ts-never',
    type: 'output',
    q: 'Какой тип у X?',
    code: `type OnlyStrings<T> = T extends string ? T : never
type X = OnlyStrings<'a' | 1 | 'b' | true>`,
    options: ['\'a\' | \'b\'', 'never', '\'a\' | never | \'b\' | never', 'string'],
    correct: [0],
    explain: 'Условный тип распределяется по union: \'a\' и \'b\' остаются, 1 и true превращаются в never. never в union исчезает, поэтому итог — \'a\' | \'b\'. Так устроены Exclude и Extract.'
  },
  {
    id: 'qz-ts-never-3',
    topic: 'ts-never',
    type: 'multi',
    q: 'Какие утверждения о never верны?',
    options: [
      'never можно присвоить в переменную любого типа',
      'Функция без return имеет тип возврата never',
      'string | never — это string',
      'В переменную типа never можно присвоить unknown'
    ],
    correct: [0, 2],
    explain: 'never — пустое множество, поэтому он подтип всего и исчезает в union. Функция без return, которая просто завершается, возвращает void, а не never. В never нельзя присвоить ничего, кроме самого never.'
  },

  // ts-api
  {
    id: 'qz-ts-api-1',
    topic: 'ts-api',
    type: 'single',
    q: 'Бэкенд вернул { items: null }. Что сделает этот код?',
    code: `interface Page { items: string[] }
const page = await $fetch<Page>('/api/list')
console.log(page.items.length)`,
    options: [
      'Ошибка компиляции: items может быть null',
      '$fetch бросит ошибку валидации',
      'Скомпилируется и упадёт в рантайме на .length',
      'Выведет 0'
    ],
    correct: [2],
    explain: 'Generic у $fetch — только аннотация, проверки данных нет. Компилятор уверен, что items — массив, а в рантайме там null. Ловить такое должна валидация на границе, например схема zod с parse.'
  },
  {
    id: 'qz-ts-api-2',
    topic: 'ts-api',
    type: 'output',
    q: 'Какой тип у Product?',
    code: `import { z } from 'zod'

const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  tags: z.array(z.string()).optional()
})
type Product = z.infer<typeof ProductSchema>`,
    options: [
      '{ id: number; title: string; tags?: string[] | undefined }',
      '{ id: number; title: string; tags: string[] }',
      'z.ZodObject<...>',
      'unknown, пока не вызван parse'
    ],
    correct: [0],
    explain: 'z.infer выводит статический тип из схемы, optional превращается в опциональное поле. typeof ProductSchema — это тип самой схемы (ZodObject), а z.infer достаёт из неё тип данных.'
  },
  {
    id: 'qz-ts-api-3',
    topic: 'ts-api',
    type: 'single',
    q: 'Какой тип у data в Nuxt 3?',
    code: `const { data } = await useFetch<User[]>('/external/users', {
  transform: users => users.length
})`,
    options: ['Ref<User[] | null>', 'Ref<number | null>', 'Ref<number>', 'Ref<User[]>'],
    correct: [1],
    explain: 'transform меняет итоговый тип data на то, что он возвращает. До загрузки или при ошибке data пустой, в Nuxt 3 это null (в Nuxt 4 — undefined), поэтому тип nullable.'
  },

  // ts-vue-props-emits
  {
    id: 'qz-ts-vue-props-emits-1',
    topic: 'ts-vue-props-emits',
    type: 'output',
    q: 'Какой тип у model?',
    code: `<script setup lang="ts">
const model = defineModel<string>()
</script>`,
    options: ['Ref<string>', 'string', 'ComputedRef<string>', 'ModelRef<string | undefined>'],
    correct: [3],
    explain: 'Без required и default родитель может не передать v-model, поэтому значение может быть undefined. defineModel<string>({ required: true }) или с default даст ModelRef<string>.'
  },
  {
    id: 'qz-ts-vue-props-emits-2',
    topic: 'ts-vue-props-emits',
    type: 'single',
    q: 'Скомпилируется ли вызов emit?',
    code: `<script setup lang="ts">
const emit = defineEmits<{
  select: [id: number]
}>()

emit('select', '42')
</script>`,
    options: [
      'Да, строка приведётся к числу',
      'Нет: аргумент типа string не подходит к number',
      'Да, emit не проверяет payload',
      'Нет: emit нельзя вызывать на верхнем уровне script setup'
    ],
    correct: [1],
    explain: 'Синтаксис с кортежами (Vue 3.3+) задаёт типы аргументов события, и emit проверяет их как обычную функцию. Вызывать emit на верхнем уровне можно, хотя обычно это делают в обработчиках.'
  },
  {
    id: 'qz-ts-vue-props-emits-3',
    topic: 'ts-vue-props-emits',
    type: 'single',
    q: 'Vue 3.5. Будет ли doubled обновляться при изменении пропа count у родителя?',
    code: `<script setup lang="ts">
const { count = 0 } = defineProps<{ count?: number }>()
const doubled = computed(() => count * 2)
</script>`,
    options: [
      'Нет, деструктуризация копирует значение один раз',
      'Да, компилятор превращает count в обращение к props.count',
      'Только если обернуть в toRefs',
      'Нет, и будет ошибка компиляции из-за дефолта'
    ],
    correct: [1],
    explain: 'С Vue 3.5 деструктуризация defineProps реактивна: компилятор заменяет count на props.count внутри script setup, поэтому computed отслеживает зависимость. До 3.5 это была бы статичная копия.'
  },

  // ts-composables
  {
    id: 'qz-ts-composables-1',
    topic: 'ts-composables',
    type: 'output',
    q: 'Что будет в a и b?',
    code: `import { ref, unref, toValue } from 'vue'

const id = ref(5)
const getter = () => id.value * 2

const a = unref(getter)
const b = toValue(getter)`,
    options: [
      'a = 10, b = 10',
      'a — функция getter, b = 10',
      'a = 10, b — функция getter',
      'a и b — функции'
    ],
    correct: [1],
    explain: 'unref разворачивает только ref, остальное возвращает как есть, поэтому a — сама функция. toValue дополнительно вызывает геттеры, поэтому для MaybeRefOrGetter нужен именно он.'
  },
  {
    id: 'qz-ts-composables-2',
    topic: 'ts-composables',
    type: 'single',
    q: 'Скомпилируется ли присваивание?',
    code: `import { ref } from 'vue'

const user = ref(null)
user.value = { id: 1, name: 'Ann' }`,
    options: [
      'Нет: тип выведен как Ref<null>',
      'Да, ref(null) имеет тип Ref<any>',
      'Да, ref расширяет тип при первом присваивании',
      'Нет: ref нельзя создавать с null'
    ],
    correct: [0],
    explain: 'Тип ref выводится из начального значения, а у null тип null. Нужно указать тип явно: ref<User | null>(null).'
  },
  {
    id: 'qz-ts-composables-3',
    topic: 'ts-composables',
    type: 'multi',
    q: 'Какие значения можно передать в аргумент типа MaybeRefOrGetter<number>?',
    options: ['5', 'ref(5)', 'computed(() => 5)', '() => 5'],
    correct: [0, 1, 2, 3],
    explain: 'MaybeRefOrGetter<T> — это T | Ref<T> | ComputedRef<T> | (() => T). Поэтому composable с таким аргументом работает со значением, ref, computed и геттером вроде () => props.id.'
  },

  // ts-pinia
  {
    id: 'qz-ts-pinia-1',
    topic: 'ts-pinia',
    type: 'single',
    q: 'Что будет с total после cart.add(...)?',
    code: `<script setup lang="ts">
const cart = useCartStore()
const { total } = cart
</script>

<template>{{ total }}</template>`,
    options: [
      'Обновится, Pinia сама следит за деструктуризацией',
      'Не обновится: деструктуризация отвязала значение от стора',
      'Ошибка компиляции: геттер нельзя деструктурировать',
      'Обновится только в dev-режиме'
    ],
    correct: [1],
    explain: 'Стор — reactive-объект, и деструктуризация достаёт текущее значение, а не ссылку. Нужно const { total } = storeToRefs(cart) или обращаться через cart.total.'
  },
  {
    id: 'qz-ts-pinia-2',
    topic: 'ts-pinia',
    type: 'output',
    q: 'Какой тип у count после storeToRefs?',
    code: `const useCounter = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function inc() { count.value++ }
  return { count, double, inc }
})

const { count } = storeToRefs(useCounter())`,
    options: ['number', 'ComputedRef<number>', 'Ref<number> | undefined', 'Ref<number>'],
    correct: [3],
    explain: 'storeToRefs превращает state в Ref<T>, а getters — в ComputedRef<T>. count — это state, поэтому Ref<number>. Действие inc storeToRefs пропускает, его берут прямо со стора.'
  },
  {
    id: 'qz-ts-pinia-3',
    topic: 'ts-pinia',
    type: 'single',
    q: 'Почему в options store рекомендуют явно указывать тип возврата у этого геттера?',
    code: `getters: {
  label() {
    return this.isAdmin ? 'Админ' : 'Пользователь'
  }
}`,
    options: [
      'Иначе геттер не попадёт в devtools',
      'Из-за this TS не может вывести тип возврата, и типизация стора ломается',
      'Геттеры без типа не кешируются',
      'Это требование только для SSR'
    ],
    correct: [1],
    explain: 'Тип this в геттере зависит от типа самого стора, который ещё выводится, — получается циклическая зависимость. Явная аннотация label(): string её разрывает. Геттеры через параметр state такой проблемы не имеют.'
  }
);
