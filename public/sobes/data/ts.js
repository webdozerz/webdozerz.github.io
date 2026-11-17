window.SOBES = window.SOBES || { topics: [] };

window.SOBES.topics.push(
  // ───────────────────────────── Типы ─────────────────────────────
  {
    id: 'ts-type-interface',
    section: 'ts',
    group: 'Типы',
    title: 'type vs interface',
    level: 'junior',
    summary: '`interface` описывает форму объекта и умеет сливаться. `type` даёт имя любому типу: union, кортежу, условному типу.',
    points: [
      { title: 'Union, кортеж, примитив — только через `type`', text: '`type` — просто имя для любого типа. `interface` описывает только объект, функцию или класс. Для обычного объекта они почти взаимозаменяемы.', code: `type Status = 'idle' | 'loading' | 'error' // union
type Point = [x: number, y: number]         // кортеж
type Id = string | number

interface User { id: number; name: string } // объект — можно и так`, lang: 'ts' },
      { title: 'Одноимённые `interface` сливаются, одноимённые `type` — ошибка', text: 'Это declaration merging. Удобно, чтобы дописать чужие типы, но два глобальных интерфейса с одним именем в разных файлах тоже молча сольются.', code: `interface User { id: number }
interface User { name: string }
// User = { id: number; name: string }

type A = { id: number }
type A = { name: string } // ошибка: Duplicate identifier`, lang: 'ts' },
      { title: 'Через слияние дописывают типы библиотек', text: 'Так во Vue добавляют глобальные свойства в `ComponentCustomProperties`, в Nuxt — типы плагинов и `runtimeConfig`. Файл обязан быть модулем, иначе `declare module` заменит типы библиотеки, а не дополнит.', code: `// types/vue.d.ts
export {} // делает файл модулем

declare module 'vue' {
  interface ComponentCustomProperties {
    $formatPrice: (value: number) => string
  }
}`, lang: 'ts' },
      { title: '`extends` ругается на конфликт полей, `&` тихо делает `never`', text: 'У интерфейса несовместимое поле — ошибка сразу. У пересечения ошибки нет, поле становится `never`, и проблема всплывает далеко от места, где её создали.', code: `interface A { id: string }
interface B extends A { id: number } // ошибка сразу

type C = { id: string } & { id: number }
// ошибки нет, но C['id'] — never: такой объект не создать`, lang: 'ts' },
      { title: 'Ловушка: `interface` не присваивается в `Record<string, unknown>`', text: 'Интерфейс открыт для слияния, поэтому TS не считает набор его ключей известным и не находит у него индексной сигнатуры. С `type` такой проблемы нет.', code: `interface I { a: string }
type T = { a: string }
declare const i: I, t: T

const r1: Record<string, unknown> = t // ок
const r2: Record<string, unknown> = i // ошибка`, lang: 'ts' }
    ],
    takeaway: '`interface` — для объектных моделей и того, что расширяют снаружи. `type` — для union, кортежей и вычисляемых типов. Главное — одно правило в команде.',
    questions: [
      {
        q: 'Чем type отличается от interface? Когда что используете?',
        a: '`interface` описывает форму объекта, а `type` — имя для любого типа, включая union, кортежи и условные типы. По поведению главное отличие — слияние: одноимённые интерфейсы объединяются, поэтому через них дописывают чужие типы, например `ComponentCustomProperties` во Vue. Ещё `extends` у интерфейса сразу ругается на несовместимое поле, а `&` тихо делает его `never`. Я беру `interface` для объектных моделей, `type` — для union, утилит и всего вычисляемого.'
      },
      {
        q: 'Что такое declaration merging и где он реально пригождается?',
        a: 'Это объединение нескольких объявлений с одним именем в одно: так ведут себя интерфейсы, namespace и модули. На практике через `declare module` добавляют поля в интерфейс библиотеки, не трогая её код. Во Vue так типизируют глобальные свойства через `ComponentCustomProperties`, в Nuxt так же расширяют типы плагинов и конфигурации. Важно, чтобы файл с `declare module` был модулем — с `export {}` или импортом, иначе он заменит типы библиотеки, а не дополнит их.'
      }
    ]
  },
  {
    id: 'ts-generics',
    section: 'ts',
    group: 'Типы',
    title: 'Generics',
    level: 'middle',
    summary: 'Generic — параметр типа. Функция получает тип как аргумент и сохраняет связь между входом и выходом: дал `User[]` — получил `User`.',
    points: [
      { title: '`<T>` — аргумент функции, только для типа', text: 'В угловых скобках объявляют параметр типа. При вызове TS подставляет туда конкретный тип, обычно выводит его из аргументов сам.', code: `function first<T>(list: T[]): T | undefined {
  return list[0]
}

first([1, 2])     // T = number → number | undefined
first(['a', 'b']) // T = string → string | undefined`, lang: 'ts' },
      { title: 'Generic сохраняет тип, `any` — теряет', text: 'С `any` функция принимает что угодно, но о результате TS уже ничего не знает. Generic помнит, что пришло на вход. Union тоже не замена: параметр `string | number` и вернёт только union.', code: `function wrapAny(x: any) { return [x] } // any[]
function wrap<T>(x: T) { return [x] }   // T[]

wrapAny(5) // any[] — дальше никаких проверок
wrap(5)    // number[]`, lang: 'ts' },
      { title: 'Явно `T` передают, когда вывести не из чего', text: 'Если `T` есть в аргументах — не пишите его, TS выведет точнее. Явно нужен для запросов и пустых начальных значений. Частично указать нельзя: либо все параметры явно, либо все выводятся. И помните: `request<User>()` — обещание компилятору, а не проверка данных.', code: `const selected = ref<Order | null>(null) // без <> был бы Ref<null>

async function request<T>(url: string): Promise<T> {
  return $fetch<T>(url)
}
const orders = await request<Order[]>('/api/orders') // форму никто не проверил`, lang: 'ts' },
      { title: '`T extends X` — ограничение: «`T` любой, но у него точно есть…»', text: 'Без ограничения о `T` ничего не известно, и обратиться к его полям нельзя. `extends` здесь не наследование, а требование к типу. Лишние поля разрешены.', code: `function getId<T>(x: T) { return x.id } // ошибка: у T может не быть id

function getId<T extends { id: number }>(x: T) {
  return x.id // ок
}
getId({ id: 1, name: 'Ann' }) // ок, лишнее поле можно
getId({ name: 'Ann' })        // ошибка: нет id`, lang: 'ts' },
      { title: '`K extends keyof T` — «`K` — один из ключей `T`», а `T[K]` — тип этого поля', text: 'Читаем по шагам. `keyof T` — union имён полей. `K extends keyof T` — `K` может быть только одним из них. `T[K]` — тип значения под этим ключом, как `obj[key]`, только для типов.', code: `type User = { id: number; name: string }
type Keys = keyof User   // 'id' | 'name'
type N = User['name']    // string

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
getProp(user, 'name') // T = User, K = 'name' → string
getProp(user, 'age')  // ошибка: 'age' не ключ User`, lang: 'ts' },
      { title: 'Длинную сигнатуру читают кусками слева направо', text: 'Сначала параметры типа в `<>`, потом аргументы, потом результат. Каждый кусок проговариваешь словами — и сигнатура перестаёт пугать.', code: `function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>
// T extends object   — T: какой-то объект
// K extends keyof T  — K: имена его полей
// (obj: T, keys: K[]) — объект и массив этих имён
// : Pick<T, K>        — объект только с этими полями

pick(user, ['id']) // { id: number }`, lang: 'ts' },
      { title: 'Дефолт `T = X` и `const`-параметр (TS 5.0+)', text: '`T = unknown` — тип по умолчанию, если не передали и не вывели. `const` перед параметром заставляет выводить литералы, как будто аргумент написан с `as const`.', code: `interface ApiResponse<T = unknown> { data: T; status: number }

function keys<const T extends readonly string[]>(k: T) { return k }
keys(['id', 'name']) // readonly ['id', 'name'], а не string[]`, lang: 'ts' }
    ],
    takeaway: 'Generic нужен, когда тип выхода зависит от типа входа. Если `T` встречается в сигнатуре один раз и ничего не связывает (`log<T>(x: T): void`) — он лишний, хватит `unknown`.',
    questions: [
      {
        q: 'Зачем нужны generics и чем они лучше any?',
        a: 'Generic — параметр типа: функцию пишу один раз, а конкретный тип подставляется при вызове, обычно TS выводит его из аргументов. Главное — сохраняется связь между входом и выходом: передал массив `User`, получил `User`. С `any` функция тоже принимает что угодно, но после вызова TS о результате ничего не знает, и ошибки уезжают в рантайм. Поэтому HTTP-клиенты, composables и утилиты я пишу на generics.'
      },
      {
        q: 'Что делает K extends keyof T и зачем нужны ограничения?',
        a: '`extends` в параметре типа — ограничение: подставить можно только тип, совместимый с указанным. `keyof T` — union ключей `T`, поэтому `K extends keyof T` значит «`K` — один из ключей `T`». Вместе с `T[K]` получается функция, которая принимает только существующий ключ и возвращает точный тип значения. Без ограничения TS не даст обратиться к полям `T`, потому что ничего о нём не знает.'
      },
      {
        q: 'Когда тип-параметр нужно указывать явно, а когда нет?',
        a: 'Если `T` встречается в аргументах, TS выводит его сам, и явное указание только удлиняет код. Явно передаю, когда вывести не из чего: `request<Order[]>(url)` или `ref<User | null>(null)`, где из `null` выведется `Ref<null>`. Если TS выводит слишком широкий тип, вроде `string` вместо литералов, помогает `const`-параметр (TS 5.0+) или `as const` у аргумента. Указать часть параметров нельзя: либо все явно, либо все выводятся.'
      }
    ]
  },
  {
    id: 'ts-union-intersection',
    section: 'ts',
    group: 'Типы',
    title: 'Union и intersection',
    level: 'junior',
    summary: '`A | B` — значение одного из типов, `A & B` — значение, которое подходит под оба сразу.',
    points: [
      { title: 'У `A | B` доступны только общие поля — остальное после проверки', text: 'TS не знает, какой вариант пришёл, поэтому разрешает только то, что есть у всех. После сужения (`in`, `typeof`, метка) открывается остальное.', code: `type Cat = { name: string; meow(): void }
type Dog = { name: string; bark(): void }

function greet(pet: Cat | Dog) {
  pet.name                      // ок, есть у обоих
  pet.bark()                    // ошибка: у Cat нет bark
  if ('bark' in pet) pet.bark() // после проверки — ок
}`, lang: 'ts' },
      { title: '`A & B` — объект со всеми полями обоих типов', text: 'Так собирают тип из готовых кусков без копирования полей: модель плюс служебные поля, свои пропсы плюс HTML-атрибуты.', code: `type Timestamps = { createdAt: string; updatedAt: string }
type Product = { id: number; title: string }
type ProductRow = Product & Timestamps // все четыре поля`, lang: 'ts' },
      { title: 'Union шире по значениям, но уже по полям', text: 'Если смотреть на тип как на множество значений: union — объединение (значений больше, гарантированных полей меньше), intersection — пересечение (наоборот). Несовместимые примитивы дают пустое множество — `never`.', code: `type K = keyof (Cat | Dog) // 'name' — только общие ключи
type Bad = string & number // never`, lang: 'ts' },
      { title: 'Discriminated union: общее поле-метка сужает тип в `switch`', text: 'Варианты различаются литералом в одном поле. Проверил метку — получил поля нужного варианта. Бессмысленное состояние «грузится и уже упал» описать нельзя.', code: `type State =
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: string }

if (s.status === 'success') s.data // тут есть data`, lang: 'ts' },
      { title: 'Ловушка: `\'sm\' | string` схлопывается в `string`', text: 'Литералы поглощаются `string`, и автодополнение пропадает. Чтобы принять любую строку и сохранить подсказки, пишут `string & {}`.', code: `type Size = 'sm' | 'md' | string         // string, подсказок нет
type Size2 = 'sm' | 'md' | (string & {}) // любая строка, подсказки есть`, lang: 'ts' }
    ],
    takeaway: 'Union — для вариантов одного значения, дальше сужение. Intersection — склеить объектные типы; для иерархий `interface extends` читается лучше и раньше ловит конфликты.',
    questions: [
      {
        q: 'Чем union отличается от intersection? Какие поля доступны у A | B и у A & B?',
        a: 'Union — «или»: значение относится к одному из типов, поэтому без сужения доступно только общее для всех вариантов. Intersection — «и»: значение соответствует обоим типам, и у объекта есть все поля. Если смотреть на типы как на множества, union шире по значениям и уже по гарантированным полям, пересечение наоборот. Для несовместимых примитивов пересечение пустое — `never`.'
      },
      {
        q: 'Как бы вы типизировали состояние асинхронного запроса?',
        a: 'Через discriminated union: несколько объектных типов с общим полем-меткой, например `status` со значениями `idle`, `loading`, `success`, `error`. `data` есть только у `success`, `error` — только у варианта ошибки. Так невозможно описать бессмысленное состояние вроде «грузится и уже упал», а в `switch` по `status` TS сужает тип и даёт нужное поле. Это надёжнее одного объекта с кучей опциональных полей, где всё может быть `undefined`.'
      }
    ]
  },
  {
    id: 'ts-utility',
    section: 'ts',
    group: 'Типы',
    title: 'Utility Types',
    level: 'middle',
    summary: 'Встроенные generic-типы, которые делают новый тип из готового: `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`, `Awaited`.',
    points: [
      { title: '`Partial`, `Required`, `Readonly` меняют модификаторы полей', text: '`Partial` делает все поля необязательными, `Required` — обязательными, `Readonly` запрещает запись. Работают только на верхнем уровне, а `Readonly` — только проверка компилятора, в рантайме объект изменяем.', code: `interface User { id: number; name: string; avatar?: string }

type Draft = Partial<User>    // все поля с ?
type Full = Required<User>    // avatar стал обязательным
type Frozen = Readonly<User>  // user.name = 'x' — ошибка`, lang: 'ts' },
      { title: '`Pick` оставляет поля, `Omit` убирает', text: 'Из одной модели получают типы для превью, создания и PATCH, и они не разъезжаются при изменениях модели.', code: `type UserPreview = Pick<User, 'id' | 'name'>   // только id и name
type UserCreate = Omit<User, 'id'>             // всё, кроме id
type UserPatch = Partial<Omit<User, 'id'>>     // без id, всё необязательно`, lang: 'ts' },
      { title: 'Ловушка: `Omit` не проверяет ключи, `Pick` — проверяет', text: 'У `Pick` ключ ограничен `keyof T`, у `Omit` — любой. Опечатка в `Omit` молча ничего не уберёт.', code: `type A = Pick<User, 'emial'> // ошибка: нет такого ключа
type B = Omit<User, 'emial'> // ошибки нет, ничего не убрали`, lang: 'ts' },
      { title: '`Record<K, V>` — объект с ключами из `K` и значениями `V`', text: 'Для словарей вида «статус → цвет». Если `K` — union литералов, TS потребует все ключи.', code: `type Status = 'draft' | 'paid' | 'refunded'
const color: Record<Status, string> = {
  draft: 'gray', paid: 'green', refunded: 'red' // забыть ключ нельзя
}`, lang: 'ts' },
      { title: '`Exclude`, `Extract`, `NonNullable` работают с union, а не с объектом', text: '`Omit` убирает ключи из объекта, `Exclude` — варианты из union. `Extract` оставляет только подходящие варианты, `NonNullable` убирает `null` и `undefined`.', code: `type Active = Exclude<Status, 'refunded'>  // 'draft' | 'paid'
type Paid = Extract<Status, 'paid' | 'x'>  // 'paid'
type Id = NonNullable<string | null>       // string`, lang: 'ts' },
      { title: '`Awaited<ReturnType<typeof fn>>` читают изнутри наружу', text: '`typeof fn` — тип функции. `ReturnType<…>` — что она возвращает, у async-функции это промис. `Awaited<…>` разворачивает промис. Так получают тип ответа, не описывая его руками.', code: `async function fetchUser(id: number) { return { id, name: 'Ann' } }

type F = typeof fetchUser          // (id: number) => Promise<{...}>
type R = ReturnType<F>             // Promise<{ id: number; name: string }>
type Data = Awaited<R>             // { id: number; name: string }
type Args = Parameters<F>          // [id: number]`, lang: 'ts' },
      { title: 'Ловушка: `Omit` на discriminated union склеивает варианты', text: 'Внутри `Omit` стоит `keyof T`, а у union это только общие ключи. Чтобы убрать поле из каждого варианта, нужна дистрибутивная версия.', code: `type Ev =
  | { type: 'click'; x: number; meta: string }
  | { type: 'key'; code: string; meta: string }

type Bad = Omit<Ev, 'meta'> // остался только { type: ... }
type DistOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never
type Good = DistOmit<Ev, 'meta'> // оба варианта на месте`, lang: 'ts' }
    ],
    takeaway: 'Модель описана один раз, остальные типы выводятся из неё. Если получается `Omit<Partial<Pick<...>>>` — проще описать тип отдельно.',
    questions: [
      {
        q: 'Какие Utility Types используете чаще всего и для чего?',
        a: 'Чаще всего `Partial`, `Pick`, `Omit` и `Record`. `Partial` — для PATCH-запросов и форм, где поля заполняются постепенно. `Pick` и `Omit` — чтобы из одной модели получить типы на создание и превью без копирования. `Record` — для словарей. А `Awaited<ReturnType<typeof fn>>` выручает, когда нужен тип результата async-функции, которую не я описывал.'
      },
      {
        q: 'Чем Omit отличается от Pick, кроме очевидного?',
        a: '`Pick` принимает только существующие ключи, и опечатка — ошибка. `Omit` принимает любой ключ, опечатка молча ничего не уберёт. Второй момент — `Omit` на union: внутри он работает через `keyof T`, а у union это только общие ключи, поэтому варианты discriminated union слипаются. Чтобы убрать поле из каждого варианта, пишут дистрибутивную версию: `T extends unknown ? Omit<T, K> : never`.'
      },
      {
        q: 'Чем Exclude отличается от Omit?',
        a: 'Они работают с разными вещами. `Omit` убирает ключи из объектного типа и возвращает объект. `Exclude` убирает варианты из union и возвращает union: из `\'draft\' | \'paid\' | \'refunded\'` можно убрать `\'refunded\'`. `Exclude` — условный тип `T extends U ? never : T`, он дистрибутивен и проходит по каждому варианту. Кстати, `Omit` внутри использует `Exclude` для списка ключей.'
      }
    ]
  },
  {
    id: 'ts-guards',
    section: 'ts',
    group: 'Типы',
    title: 'Type guards и сужение типов',
    level: 'middle',
    summary: 'После проверки `typeof`, `instanceof`, `in`, метки или своей guard-функции TS уточняет тип внутри ветки (narrowing).',
    points: [
      { title: 'Встроенные проверки сужают тип в ветке', text: '`typeof` — для примитивов, `instanceof` — для классов, `in` — наличие свойства, `===` — сравнение с литералом или `null`. После каждого `return` TS вычёркивает проверенный вариант.', code: `function format(v: string | number | Date | null) {
  if (v === null) return '-'
  if (typeof v === 'string') return v.trim()   // v: string
  if (v instanceof Date) return v.toISOString() // v: Date
  return v.toFixed(2)                           // осталось number
}`, lang: 'ts' },
      { title: 'Ловушка: `typeof x === \'object\'` пропускает `null`', text: 'В JS `typeof null === \'object\'`, и TS это знает: после проверки `null` остаётся в типе.', code: `function f(v: object | null) {
  if (typeof v === 'object') v       // object | null
  if (v && typeof v === 'object') v  // object
}`, lang: 'ts' },
      { title: 'Своя проверка — функция с типом возврата `x is T`', text: 'Это type predicate: если функция вернула `true`, TS считает `x` типом `T`. Тело проверки TS с типом не сверяет — проверил только `id`, а написал `x is User`, он поверит.', code: `function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x && 'name' in x
}

if (isUser(data)) data.name // data: User`, lang: 'ts' },
      { title: '`asserts x is T` — проверка, которая падает вместо `if`', text: 'Функция ничего не возвращает, а при несоответствии бросает ошибку. После вызова тип уточнён до конца области видимости. TS принимает её как assertion, только если тип функции объявлен явно: `function` подходит, стрелка в `const` без аннотации — нет.', code: `function assertDefined<T>(v: T, msg: string): asserts v is NonNullable<T> {
  if (v == null) throw new Error(msg)
}

const el = document.querySelector('#app')
assertDefined(el, 'нет #app')
el.classList.add('ready') // el: Element`, lang: 'ts' },
      { title: 'TS 5.5+: `filter` сам выводит предикат из простой проверки', text: 'Раньше для `filter` писали `(x): x is number => ...`. Теперь TS выводит предикат сам, если функция проверяет значение напрямую.', code: `const ids = [1, null, 3].filter(x => x != null) // number[]`, lang: 'ts' },
      { title: 'Ловушка: сужение свойства не доживает до колбэка', text: 'TS не знает, когда колбэк вызовется, и сбрасывает сужение `state.user`. Для `const` сужение сохраняется, для `let` и параметров — с TS 5.4, если после колбэка нет присваиваний. Решение — положить значение в `const`.', code: `if (state.user) {
  items.map(i => state.user.name) // ошибка: может быть null
  const user = state.user
  items.map(i => user.name)       // ок
}`, lang: 'ts' },
      { title: 'Guard vs `as`: guard проверяет, `as` — обещает', text: '`as` в рантайме ничего не делает. Для данных из API и ошибок в `catch` нужна настоящая проверка, иначе компилятор доволен, а падает у пользователя.', code: `const u = data as User        // ничего не проверено
if (isUser(data)) data.name   // проверено в рантайме
if (e instanceof FetchError) e.status`, lang: 'ts' }
    ],
    takeaway: 'Сначала проверка, потом доступ. Повторяющаяся сложная проверка — в функцию `x is T`, инвариант «должно быть, иначе падаем» — в `asserts`. Для внешних данных надёжнее схема (zod).',
    questions: [
      {
        q: 'Какие способы сужения типов знаете?',
        a: 'Сужение — это когда TS после проверки уточняет тип в ветке. Встроенные способы: `typeof` для примитивов, `instanceof` для классов вроде `Date` или `Error`, `in` для проверки свойства, сравнение с литералом или `null`. Для discriminated union достаточно сравнить поле-метку, и в каждой ветке `switch` будет свой тип. Если проверка сложная, пишу функцию с типом возврата `x is T`, а если надо падать при несоответствии — с `asserts`.'
      },
      {
        q: 'Чем пользовательский type guard отличается от as? Какие у него риски?',
        a: '`as` — утверждение без проверки, в рантайме ничего не происходит. Guard — обычная функция, которая проверяет значение и возвращает `boolean`, а запись `x is T` говорит TS, какой тип будет при `true`. Риск в том, что TS не сверяет тело проверки с типом: проверил только `id`, написал `x is User` — компилятор поверит. Поэтому для внешних данных надёжнее схемы вроде zod, где проверка и тип берутся из одного описания.'
      },
      {
        q: 'Что такое assertion-функция и когда она удобнее guard?',
        a: 'Функция с типом возврата `asserts x is T` (или просто `asserts x`): если условие не выполнено, она бросает ошибку, а после вызова TS считает тип уточнённым до конца области видимости. Удобна для инвариантов: элемент есть в DOM, переменная окружения задана. Нюанс — TS требует, чтобы функция была вызвана по имени с явным типом: объявление `function` подходит, а стрелку в `const` без аннотации типа TS не примет как assertion.'
      }
    ]
  },
  {
    id: 'ts-any-unknown',
    section: 'ts',
    group: 'Типы',
    title: 'any vs unknown',
    level: 'junior',
    summary: '`any` выключает проверку типов. `unknown` принимает что угодно, но пользоваться значением можно только после проверки.',
    points: [
      { title: '`any` молчит и расползается по коду', text: 'С `any` можно вызвать что угодно и присвоить его куда угодно. Ошибка всплывёт только при запуске, а `any` через присваивания и возвращаемые значения заражает соседний код.', code: `const a: any = JSON.parse('{"x": 1}')
a.foo.bar()          // компилируется, падает при запуске
const s: string = a  // тоже ок — any расползается`, lang: 'ts' },
      { title: '`unknown` — сначала проверь, потом пользуйся', text: '`unknown` — верхний тип: в него кладётся любое значение, но наружу без сужения его не отдать — только в `unknown` или `any`.', code: `const u: unknown = JSON.parse('{"x": 1}')
u.x                  // ошибка: сначала проверь
const t: string = u  // ошибка
if (typeof u === 'object' && u !== null && 'x' in u) {
  u.x                // ок, тип u.x — unknown
}`, lang: 'ts' },
      { title: 'В `catch` ошибка — `unknown` (в `strict`)', text: 'Флаг `useUnknownInCatchVariables` (TS 4.4+) входит в `strict`. Бросить в JS можно что угодно, хоть строку. Аннотировать `catch (e: Error)` нельзя — разрешены только `unknown` и `any`.', code: `try {
  await saveOrder()
} catch (e) {
  const message = e instanceof Error ? e.message : String(e)
  toast.error(message)
}`, lang: 'ts' },
      { title: 'Ловушка: `as SomeType` на `unknown` — тот же `any`, только спрятанный', text: 'Приведение ничего не проверяет. Для внешних данных — guard или схема.', code: `const user = JSON.parse(raw) as User // проверки нет
if (isUser(parsed)) parsed.name      // проверка есть`, lang: 'ts' },
      { title: '`strict` не отключают: без `noImplicitAny` параметры молча становятся `any`', text: 'При миграции с JS `any` ставят временно на сложные модули и постепенно убирают, а не выключают проверки целиком.', code: `function sum(a, b) { return a + b }
// strict: ошибка — параметр неявно any
// без strict: компилируется, sum('1', 2) === '12'`, lang: 'ts' }
    ],
    takeaway: 'Всё внешнее (`JSON.parse`, ответ API, `catch`, `localStorage`, `postMessage`) — `unknown`. `any` — только временно.',
    questions: [
      {
        q: 'Чем any отличается от unknown?',
        a: 'Оба принимают любое значение, разница в том, что с ним можно делать дальше. `any` выключает проверку: любые методы, любые присваивания, ошибка всплывёт только при запуске. `unknown` — верхний тип: присвоить ему можно что угодно, но пользоваться нельзя, пока не сузишь тип через `typeof`, `instanceof` или guard. Для внешних данных я использую `unknown`, `any` — только как временную меру.'
      },
      {
        q: 'Какой тип у переменной ошибки в catch и как с ней работать?',
        a: 'С `strict` — `unknown`, за это отвечает флаг `useUnknownInCatchVariables` (TS 4.4+), без него — `any`. Так сделано, потому что в JS бросить можно что угодно: строку, объект, промис. Поэтому сначала проверяю: `e instanceof Error` даёт `message`, для ошибок HTTP-клиента есть своя проверка со статусом. Аннотировать `catch (e: Error)` нельзя — разрешены только `unknown` и `any`.'
      }
    ]
  },
  {
    id: 'ts-never',
    section: 'ts',
    group: 'Типы',
    title: 'never',
    level: 'middle',
    summary: '`never` — тип без значений. Функция не возвращается, ветка недостижима, вариант выкинут из union.',
    points: [
      { title: '`never` — «сюда управление не дойдёт»', text: 'Функция, которая всегда бросает исключение или крутится вечно, возвращает `never`. `void` — другое: функция завершилась, просто без полезного результата.', code: `function fail(msg: string): never {
  throw new Error(msg)
}
function log(msg: string): void {
  console.log(msg) // завершилась — это void
}`, lang: 'ts' },
      { title: 'В union `never` исчезает, в `&` — поглощает', text: 'Пустое множество: объединение с ним ничего не добавляет, пересечение с ним пустое. Поэтому неожиданный `never` обычно значит конфликт в `&`.', code: `type A = string | never           // string
type B = string & never           // never
type C = { id: string } & { id: number }
// C['id'] — never: объект такого типа не создать`, lang: 'ts' },
      { title: 'Exhaustive check: в `default` кладём значение в `never`', text: 'Discriminated union, `switch` по метке. Если все варианты обработаны, в `default` остаётся `never`, и присваивание проходит. Добавили вариант и забыли `case` — он попадёт в `default`, его нельзя положить в `never`, и сборка укажет, что забыто.', code: `type Msg =
  | { type: 'chat'; text: string }
  | { type: 'typing'; userId: number }
  | { type: 'read'; messageId: number } // добавили новый

function handle(m: Msg) {
  switch (m.type) {
    case 'chat': return show(m.text)      // m сужен до chat
    case 'typing': return mark(m.userId)
    default: {
      const _x: never = m // ошибка: 'read' не обработан
      throw new Error('Unknown message')
    }
  }
}`, lang: 'ts' },
      { title: 'Проверку удобно вынести в `assertNever`', text: 'Тот же приём одной строкой. Бонус — в рантайме функция бросит понятную ошибку, если с сервера пришёл неизвестный вариант.', code: `function assertNever(x: never): never {
  throw new Error('Неожиданное значение: ' + JSON.stringify(x))
}

default: return assertNever(m) // ошибка компиляции, если варианты не все`, lang: 'ts' },
      { title: 'Ловушка: `default: return null` прячет новые варианты', text: 'Без проверки на `never` новый статус молча уходит в дефолтную ветку, и никто этого не замечает до бага на проде.', code: `switch (s) {
  case 'paid': return 'Оплачен'
  default: return null // новый 'refunded' попадёт сюда молча
}`, lang: 'ts' },
      { title: 'В условных типах `never` значит «выкинуть вариант»', text: 'Условный тип применяется к каждому варианту union. Лишние варианты превращаем в `never`, а он из union исчезает. Так устроены `Exclude` и `Extract`.', code: `type OnlyStrings<T> = T extends string ? T : never
type X = OnlyStrings<'a' | 1 | 'b'> // 'a' | never | 'b' → 'a' | 'b'`, lang: 'ts' },
      { title: 'Ловушка вывода: стрелка, которая только бросает, — `never`, `function` — `void`', text: 'Для объявления `function` TS выводит `void`, поэтому там `never` пишут явно.', code: `const fail2 = () => { throw new Error() } // () => never
function fail3() { throw new Error() }    // () => void`, lang: 'ts' }
    ],
    takeaway: 'Главное применение — exhaustive check: в `default` у `switch` по union значение должно быть `never`, тогда забытый вариант ловит сборка.',
    questions: [
      {
        q: 'Что такое never и где он полезен на практике?',
        a: '`never` — нижний тип, у него нет значений. Его возвращают функции, которые всегда бросают исключение, и его получает значение в недостижимой ветке. На практике — проверка полноты: в `default` у `switch` присваиваю значение в переменную типа `never`, и если в union добавят вариант, сборка упадёт ровно здесь. Ещё `never` — основа фильтрации в условных типах, потому что в union он исчезает: так устроены `Exclude` и `Extract`.'
      },
      {
        q: 'Чем never отличается от void?',
        a: '`void` значит «функция вернула управление, результат не важен» — типичный обработчик клика. `never` значит «управление не вернётся»: функция бросает исключение или работает бесконечно. Поэтому `never` присваивается любому типу, а `void` — нет. Нюанс вывода: для стрелочной функции, которая только бросает, TS выведет `never`, а для объявления через `function` — `void`, поэтому там тип `never` пишут явно.'
      },
      {
        q: 'Как гарантировать, что switch по union обработал все варианты?',
        a: 'Делаю union с полем-меткой и в `default` присваиваю значение в переменную типа `never` или передаю в `assertNever(x: never)`. Если все `case` на месте, там действительно `never`, и всё компилируется. Добавили вариант и забыли обработать — он доходит до `default`, его нельзя положить в `never`, и сборка показывает ошибку прямо в этом месте. `assertNever` ещё и бросает в рантайме, если с сервера пришло неизвестное значение.'
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
    summary: 'Типы описывают контракт с бэкендом при компиляции, схема валидации проверяет данные в рантайме.',
    points: [
      { title: 'Generic у клиента — подпись типа, а не проверка', text: 'Клиент вида `get<T>(url): Promise<T>` даёт каждому вызову свой тип и автодополнение. Но в рантайме типов нет: если бэкенд вернёт другую форму, TS не узнает, и упадёт где-нибудь в шаблоне.', code: `export const api = {
  get<T>(url: string, query?: Record<string, unknown>) {
    return $fetch<T>(url, { baseURL: '/api', query }) // T — без проверки
  }
}
const list = await api.get<Product[]>('/products')`, lang: 'ts' },
      { title: 'Проверка — схемой, тип — из схемы через `z.infer`', text: 'Схема проверяет данные на входе, а тип выводится из неё же. Писать тип руками рядом со схемой не надо — со временем они разойдутся.', code: `import { z } from 'zod'
const Product = z.object({ id: z.number(), title: z.string(), price: z.number() })
export type Product = z.infer<typeof Product>

export async function getProduct(id: number): Promise<Product> {
  const raw: unknown = await $fetch('/api/products/' + id)
  return Product.parse(raw) // форма не та — бросит здесь, а не в шаблоне
}`, lang: 'ts' },
      { title: 'Для своих роутов `server/api` Nuxt выводит тип сам', text: '`useFetch` и `$fetch` знают, что возвращает обработчик, generic не нужен. Для внешних URL тип указывают через `useFetch<T>()`.', code: `// server/api/products.get.ts
export default defineEventHandler(() => [{ id: 1, title: 'Чай' }])

// в компоненте
const { data } = await useFetch('/api/products') // тип выведен из обработчика`, lang: 'ts' },
      { title: '`data` из `useFetch` бывает пустым: `null` в Nuxt 3, `undefined` в Nuxt 4', text: 'До загрузки и при ошибке данных нет, поэтому `data.value.items` без проверки — ошибка. С `transform` тип `data` — то, что вернул `transform`.', code: `const { data } = await useFetch<ProductDto[]>('/external/products')
// Nuxt 3: Ref<ProductDto[] | null>, Nuxt 4: Ref<ProductDto[] | undefined>

const { data: count } = await useFetch<ProductDto[]>('/external/products', {
  transform: items => items.length
}) // data: number | null (Nuxt 3)`, lang: 'ts' },
      { title: 'Ответ и тело запроса — разные типы', text: 'При создании нет `id` и служебных полей, при обновлении всё необязательно. Выводим из модели, а не копируем.', code: `type ProductCreate = Omit<Product, 'id' | 'createdAt'>
type ProductPatch = Partial<ProductCreate>`, lang: 'ts' }
    ],
    takeaway: 'Ответы типизировать всегда (лучше генерировать из OpenAPI). Схемой проверять внешние и нестабильные API, формы, платёжные данные.',
    questions: [
      {
        q: 'Как вы типизируете работу с API на фронтенде?',
        a: 'Описываю типы запросов и ответов, а если есть OpenAPI — генерирую их. Сверху тонкий клиент на `$fetch` с generic, и каждый вызов знает свой тип. Для создания и обновления делаю отдельные типы через `Omit` и `Partial`: там нет `id` и служебных полей. При этом помню, что generic — только утверждение компилятору: если бэкенд поменяет формат, TS не узнает, поэтому критичные данные проверяю схемой.'
      },
      {
        q: 'Зачем валидировать ответ API, если есть типы? Как это сделать?',
        a: 'Типы существуют только при компиляции, в рантайме их нет, и `as User` ничего не проверяет. Если бэкенд прислал `null` вместо массива, упадёт где-нибудь в шаблоне, далеко от причины. Схема вроде zod проверяет данные на входе через `parse` или `safeParse`, а тип я получаю через `z.infer`, так что проверка и тип описаны в одном месте. Проверять всё подряд не обязательно, но внешние API, формы и платёжные данные — стоит.'
      },
      {
        q: 'Какой тип у data из useFetch и откуда он берётся?',
        a: '`data` — ref с типом ответа, который может быть пустым: в Nuxt 3 значение по умолчанию `null`, в Nuxt 4 — `undefined`. Для своих роутов из `server/api` Nuxt выводит тип из того, что возвращает обработчик, и generic не нужен. Для внешних URL указываю тип через `useFetch<T>()`. Если задан `transform`, тип `data` — то, что вернул `transform`.'
      }
    ]
  },
  {
    id: 'ts-vue-props-emits',
    section: 'ts',
    group: 'TS во Vue и Nuxt',
    title: 'Типизация props, emits и v-model',
    level: 'middle',
    summary: '`defineProps<T>()`, `defineEmits<T>()` и `defineModel<T>()` типизируют входные данные, события и двустороннюю привязку компонента.',
    points: [
      { title: 'Пропсы описывают типом: `defineProps<Props>()`', text: 'Компилятор Vue сам строит из типа runtime-объявление. Рантайм проверит только конструктор (`String`, `Array`), форму объекта — нет. Объявление объектом (`type: String`) оставляют для проектов без TS и кастомного `validator`.', code: `<script setup lang="ts">
interface Props {
  title: string
  size?: 'sm' | 'md' | 'lg'
  items?: string[]
}
const props = defineProps<Props>()
</script>`, lang: 'vue' },
      { title: 'Дефолты: деструктуризация (Vue 3.5+) или `withDefaults`', text: 'С 3.5 деструктуризация `defineProps` реактивна: компилятор заменяет `size` на `props.size`. До 3.5 — только `withDefaults`, где массив и объект задают функцией-фабрикой, иначе экземпляры делят один объект.', code: `// Vue 3.5+
const { title, size = 'md', items = () => [] } = defineProps<Props>()

// любая версия Vue 3
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  items: () => [] // фабрика, а не []
})`, lang: 'ts' },
      { title: 'Ловушка: деструктурированный проп в `watch` — только геттером', text: '`size` после деструктуризации в коде — это `props.size`, то есть значение. В `watch` его передают функцией, иначе Vue предупредит и следить не будет.', code: `watch(size, cb)        // не сработает
watch(() => size, cb)  // ок`, lang: 'ts' },
      { title: 'События: ключ — имя, значение — кортеж аргументов (Vue 3.3+)', text: '`emit` с неверными аргументами не скомпилируется, родитель получит типы в обработчике.', code: `const emit = defineEmits<{ select: [id: number]; close: [] }>()
emit('select', 42)   // ок
emit('select', '42') // ошибка: нужен number`, lang: 'ts' },
      { title: '`defineModel<T>()` (Vue 3.4+) — v-model одной строкой', text: 'Заменяет пару «проп `modelValue` + событие `update:modelValue`» и возвращает ref, синхронизированный с родителем. Без `required` или `default` тип — `T | undefined`.', code: `const query = defineModel<string>({ required: true })    // ModelRef<string>
const page = defineModel<number>('page', { default: 1 }) // v-model:page
const note = defineModel<string>()                       // string | undefined`, lang: 'ts' },
      { title: 'Дженерик-компонент: атрибут `generic` у `script setup` (Vue 3.3+)', text: '`T` выводится из того, что родитель передал в пропсы, и проходит в события и слоты. Без этого таблица или селект принимали бы `unknown[]`, и в обработчиках пришлось бы писать `as`.', code: `<script setup lang="ts" generic="T extends { id: number }">
defineProps<{ items: T[]; label: (item: T) => string }>()
const emit = defineEmits<{ pick: [item: T] }>()
</script>

<template>
  <li v-for="item in items" :key="item.id" @click="emit('pick', item)">{{ label(item) }}</li>
</template>`, lang: 'vue' }
    ],
    takeaway: 'В TS-проекте всё объявляется типом: `defineProps<T>`, `defineEmits` с кортежами, `defineModel<T>`. Списки, таблицы и селекты — дженерик-компоненты.',
    questions: [
      {
        q: 'Как типизировать props и задать им значения по умолчанию в script setup?',
        a: 'Описываю интерфейс и передаю его в `defineProps<Props>()`: компилятор Vue сам построит из него runtime-объявление пропсов. Дефолты задаю через `withDefaults`, где для массивов и объектов нужна функция-фабрика. С Vue 3.5 можно деструктурировать прямо из `defineProps` и задать дефолты как в обычном JS — компилятор сохранит реактивность. Нюанс — в `watch` такой проп передаю геттером, иначе Vue предупредит.'
      },
      {
        q: 'Как типизировать события и v-model компонента?',
        a: 'Для событий — `defineEmits` с объектом, где ключ — имя события, а значение — кортеж аргументов, например `select: [id: number]` (синтаксис Vue 3.3+). Тогда `emit` с неверными аргументами не скомпилируется, а родитель получит типы в обработчике. Для v-model с Vue 3.4 есть `defineModel<T>()`: он возвращает ref, синхронизированный с родителем. Без `required` или `default` тип будет `T | undefined`.'
      },
      {
        q: 'Что такое дженерик-компоненты во Vue и когда они нужны?',
        a: 'Компонент с параметром типа, объявленным атрибутом `generic` у `script setup` (Vue 3.3+), например `generic="T extends { id: number }"`. `T` выводится из того, что родитель передал в пропсы, и проходит в события и слоты. Без этого таблица или селект принимали бы `unknown[]`, и в обработчиках пришлось бы писать `as`. Использую для универсальных списков, таблиц и комбобоксов.'
      }
    ]
  },
  {
    id: 'ts-composables',
    section: 'ts',
    group: 'TS во Vue и Nuxt',
    title: 'Типизация composables',
    level: 'middle',
    summary: 'Composable принимает `MaybeRefOrGetter<T>`, читает аргумент через `toValue()` внутри эффекта и возвращает объект из ref.',
    points: [
      { title: 'Аргумент, который может меняться, — `MaybeRefOrGetter<T>` (Vue 3.3+)', text: 'Так composable принимает и число, и ref, и computed, и геттер. Если принять просто `number` и передать `props.id`, composable получит значение один раз и изменений не заметит.', code: `export function useProduct(id: MaybeRefOrGetter<number>) { /* ... */ }

useProduct(5)
useProduct(idRef)
useProduct(() => props.id) // перезапросит при смене id`, lang: 'ts' },
      { title: 'Читают через `toValue()` внутри `watchEffect`, `watch` или `computed`', text: 'Тогда Vue отслеживает аргумент. В асинхронном `watchEffect` зависимость считается, только если прочитана до первого `await`.', code: `export function useProduct(id: MaybeRefOrGetter<number>) {
  const product = ref<Product | null>(null) // без типа — Ref<null>
  watchEffect(async () => {
    const currentId = toValue(id) // до await — отслеживается
    product.value = await api.get<Product>('/products/' + currentId)
  })
  return { product }
}`, lang: 'ts' },
      { title: '`toValue` vs `unref`: `unref` геттер не вызывает', text: '`unref` разворачивает только ref, функцию вернёт как есть. `toValue` ещё и вызывает геттер. Аналогично `MaybeRef<T>` — значение или ref, а `MaybeRefOrGetter<T>` добавляет геттер и computed.', code: `unref(() => 5)   // функция
toValue(() => 5) // 5`, lang: 'ts' },
      { title: 'Возвращают простой объект из ref', text: 'Его можно деструктурировать без потери реактивности. Если вернуть `reactive`, деструктуризация отвяжет значения. То, что нельзя менять снаружи, отдают через `readonly()` или `computed`.', code: `return { product, loading }       // ок
const { product } = useProduct(id) // реактивность на месте`, lang: 'ts' },
      { title: 'Дженерик-composable сохраняет тип элементов', text: '`T extends { id: number }` — composable работает с любыми объектами, у которых есть `id`, а наружу отдаёт тот же `T`.', code: `export function useSelection<T extends { id: number }>(items: Ref<T[]>) {
  const selectedIds = ref(new Set<number>())
  const selected = computed(() =>
    items.value.filter(i => selectedIds.value.has(i.id))
  ) // ComputedRef<T[]>
  return { selected }
}`, lang: 'ts' }
    ],
    takeaway: 'Меняющийся вход — `MaybeRefOrGetter` + `toValue()` в эффекте. Тип возврата обычно выводится сам; явно его пишут в общих библиотечных composables.',
    questions: [
      {
        q: 'Как типизировать аргументы composable, чтобы он работал и со значением, и с ref?',
        a: 'Принимаю аргумент как `MaybeRefOrGetter<T>` — это значение, ref, computed или геттер. Внутри читаю через `toValue()` в `watchEffect`, `watch` или `computed`, чтобы Vue отслеживал изменения. Тогда `useProduct(() => props.id)` перезапросит данные при смене `id`. Важно не путать с `unref`: он разворачивает только ref, а функцию вернёт как есть. И в асинхронном `watchEffect` читать аргумент нужно до первого `await`.'
      },
      {
        q: 'Что должен возвращать composable и нужно ли явно указывать тип возврата?',
        a: 'Обычно — простой объект с ref и функциями: его можно деструктурировать без потери реактивности. Если вернуть `reactive`, деструктуризация отвяжет значения. Тип возврата обычно не пишу — TS выведет его точнее. Явно указываю в общих библиотечных composables, чтобы не сломать контракт случайно, а состояние, которое нельзя менять снаружи, отдаю через `readonly()` или `computed`.'
      }
    ]
  },
  {
    id: 'ts-pinia',
    section: 'ts',
    group: 'TS во Vue и Nuxt',
    title: 'Типизация Pinia',
    level: 'middle',
    summary: 'Setup store выводит типы сам. В options store типизируют `state()` и геттеры с `this`. `storeToRefs()` сохраняет реактивность при деструктуризации.',
    points: [
      { title: 'Setup store: `ref`, `computed`, функции — типы выводятся сами', text: 'Тип указывают только у `ref` с начальным `null`. Внутри можно вызывать composables, например `useCookie` в Nuxt.', code: `export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.qty, 0)
  ) // ComputedRef<number>
  function add(item: CartItem) { items.value.push(item) }
  return { items, total, add }
})`, lang: 'ts' },
      { title: 'Ловушка: всё состояние setup store надо вернуть', text: 'Не вернули ref — он не попадёт в state, не будет виден в devtools и не передастся с сервера на клиент при SSR. `$reset` в setup store тоже пишут сами.', code: `const draft = ref('') // не вернули — в state его нет
return { items, total, add }`, lang: 'ts' },
      { title: 'Деструктуризация стора — только через `storeToRefs`', text: 'Стор — reactive-объект, обычная деструктуризация копирует текущие значения. `storeToRefs` отдаёт state как `Ref<T>`, геттеры как `ComputedRef<T>` и пропускает действия — их берут прямо со стора.', code: `const cart = useCartStore()
const { items, total } = storeToRefs(cart) // реактивно, типы на месте
const { add } = cart                        // действия — напрямую
const { total: t } = cart                   // значение, не обновится`, lang: 'ts' },
      { title: 'Options store: тип state — через `state(): State`, у геттера с `this` — явный тип возврата', text: 'Без типа возврата геттер с `this` создаёт циклическую зависимость: тип стора зависит от самого себя, и TS выводит `any` или ругается.', code: `export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({ user: null, token: null }),
  getters: {
    isLoggedIn: state => state.token !== null,
    greeting(): string { // : string обязателен из-за this
      return this.isLoggedIn ? 'Привет, ' + this.user?.name : 'Войдите'
    }
  },
  actions: { logout() { this.$reset() } } // $reset есть из коробки
})`, lang: 'ts' }
    ],
    takeaway: 'По умолчанию setup store: меньше обвязки, типы выводятся сами. В компонентах — `storeToRefs` для данных, действия прямо со стора.',
    questions: [
      {
        q: 'Как типизируется стор в Pinia? Чем отличается setup store от options store?',
        a: 'В setup store пишу обычный Composition API: `ref` для состояния, `computed` для геттеров, функции для действий, и TS выводит всё сам. Тип указываю только у `ref`, если начальное значение `null`. В options store тип состояния задаю через `state(): AuthState`, а геттерам с `this` — явный тип возврата, иначе возникает циклическая зависимость типа стора от самого себя. Я предпочитаю setup store, но в нём всё состояние надо вернуть из функции, а `$reset` написать самому.'
      },
      {
        q: 'Зачем нужен storeToRefs?',
        a: 'Стор — reactive-объект, и при прямой деструктуризации получаются обычные значения, которые не обновляются. `storeToRefs` превращает state и геттеры в ref с сохранением типов, и деструктуризация становится безопасной. Действия он не включает — их берут прямо со стора, они к нему уже привязаны. Чем отличается от `toRefs`: `storeToRefs` пропускает методы и служебные свойства стора.'
      }
    ]
  },

  // ───────────────────────── Продвинутые типы ─────────────────────────
  {
    id: 'ts-keyof-typeof',
    section: 'ts',
    group: 'Продвинутые типы',
    title: 'keyof, typeof и indexed access',
    level: 'middle',
    summary: '`keyof T` — union имён полей, `typeof x` в типе — тип значения, `T[K]` — тип поля по ключу.',
    points: [
      { title: '`keyof T` — union имён полей', text: 'Берёт тип объекта и возвращает его ключи как union строковых литералов.', code: `type User = { id: number; name: string }
type Keys = keyof User // 'id' | 'name'

let k: Keys = 'name' // ок
k = 'age'            // ошибка`, lang: 'ts' },
      { title: '`T[\'поле\']` — тип поля, `T[number]` — тип элемента массива', text: 'Indexed access: как `obj.field`, только для типов. Ключом может быть union — получится union типов значений. Удобно, чтобы достать тип вложенной части чужого типа.', code: `type Name = User['name']           // string
type Both = User['id' | 'name']    // number | string

interface OrdersResponse { items: { id: number; total: number }[] }
type Order = OrdersResponse['items'][number] // { id: number; total: number }`, lang: 'ts' },
      { title: '`typeof x` в позиции типа — тип переменной, а не строка', text: 'В выражении `typeof` — оператор JS, вернёт `\'object\'`. В `type X = typeof x` — оператор TS, даёт статический тип. Вызовы он не принимает: тип результата функции — через `ReturnType`.', code: `const config = { api: '/api', retries: 3 }
type Config = typeof config // { api: string; retries: number }

type U = typeof getUser()             // ошибка: вызов нельзя
type U2 = ReturnType<typeof getUser>  // ок`, lang: 'ts' },
      { title: '`keyof typeof OBJ` — ключи константы, читать справа налево', text: '`typeof OBJ` — тип объекта, `keyof` от него — ключи. Чтобы значения тоже стали литералами, нужен `as const`: без него они расширятся до `string`.', code: `const ORDER_STATUS = {
  new: 'Новый',
  paid: 'Оплачен'
} as const

type StatusKey = keyof typeof ORDER_STATUS                // 'new' | 'paid'
type StatusLabel = (typeof ORDER_STATUS)[StatusKey]       // 'Новый' | 'Оплачен'`, lang: 'ts' },
      { title: 'Для массива-константы union значений даёт `[number]`', text: 'Тот же приём: `typeof` — тип массива, `[number]` — тип любого его элемента.', code: `const SIZES = ['sm', 'md', 'lg'] as const
type Size = (typeof SIZES)[number] // 'sm' | 'md' | 'lg'`, lang: 'ts' },
      { title: 'Объект `as const` вместо `enum`', text: 'Остаётся обычным JS-объектом, а типы выводятся из него и не расходятся со значениями. `enum` генерирует рантайм-код, а у числовых `enum` слабая проверка значений: литерал вне списка TS 5 поймает, а любое `number` пропустит.', code: `enum Status { New, Paid }
const n: number = 42
const s: Status = n // числовой enum: ошибки нет

type StatusKey = keyof typeof ORDER_STATUS // строгий union`, lang: 'ts' },
      { title: 'Ловушка: `keyof` от индексной сигнатуры `string` — это `string | number`', text: 'В JS числовые ключи всё равно приводятся к строкам, поэтому `obj[1]` допустим, и TS добавляет `number`.', code: `type Dict = { [key: string]: unknown }
type K = keyof Dict // string | number`, lang: 'ts' }
    ],
    takeaway: 'Значения — источник правды: объект или массив `as const`, а типы из него через `keyof typeof` и `[number]`.',
    questions: [
      {
        q: 'Как из объекта-константы получить union его ключей и значений?',
        a: 'Объявляю объект с `as const`, чтобы значения стали литеральными и readonly. Затем `keyof typeof OBJ` даёт union ключей, а `(typeof OBJ)[keyof typeof OBJ]` — union значений. Для массива то же самое делает `(typeof ARR)[number]`. Так я часто заменяю `enum`: в рантайме остаётся обычный объект, а типы выводятся из него автоматически.'
      },
      {
        q: 'Чем typeof в TypeScript отличается от typeof в JavaScript?',
        a: 'В выражении это оператор JS: в рантайме он возвращает строку вроде `\'string\'` или `\'object\'`, и TS использует его для сужения типов. В позиции типа это оператор TS: он берёт статический тип переменной или свойства, и после компиляции его нет. В позиции типа он работает только с идентификаторами и обращениями к свойствам, поэтому тип результата функции получают через `ReturnType<typeof fn>`.'
      },
      {
        q: 'Что такое indexed access types?',
        a: 'Это запись `T[K]`, которая даёт тип свойства `K` у типа `T`, как обращение к полю, но на уровне типов. `K` может быть union — тогда результат тоже union. Для массивов и кортежей используют `T[number]`, чтобы получить тип элемента. Удобно, когда нужен тип вложенной части чужого типа, например элемента списка из ответа API, без отдельного описания.'
      }
    ]
  },
  {
    id: 'ts-mapped',
    section: 'ts',
    group: 'Продвинутые типы',
    title: 'Mapped types',
    level: 'middle+',
    summary: 'Mapped type строит объектный тип, перебирая ключи: `{ [K in keyof T]: ... }`. Можно менять модификаторы, переименовывать и выкидывать ключи.',
    points: [
      { title: '`{ [K in keyof T]: T[K] }` — перебор ключей, как `map` для типа', text: 'Для каждого ключа `K` из union задаётся тип значения. Так одно правило описывают один раз, а не повторяют для каждого поля. При изменении модели производный тип обновится сам.', code: `interface Form { email: string; age?: number }

type FormErrors = { [K in keyof Form]?: string }
// { email?: string; age?: string }`, lang: 'ts' },
      { title: 'Встроенные утилиты — это mapped types', text: '`?` и `readonly` добавляют, `-?` и `-readonly` снимают.', code: `type MyPartial<T>  = { [K in keyof T]?: T[K] }
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }
type MyRequired<T> = { [K in keyof T]-?: T[K] }
type Mutable<T>    = { -readonly [K in keyof T]: T[K] }
type MyRecord<K extends PropertyKey, V> = { [P in K]: V }`, lang: 'ts' },
      { title: 'Перебор `keyof T` сохраняет `?` и `readonly`, перебор произвольного union — нет', text: 'Это гомоморфный mapped type. Поэтому `Pick` оставляет необязательные поля необязательными, а у `Record` все поля обязательные: связи с исходным типом нет.', code: `type P = Pick<Form, 'age'>         // { age?: number }
type R = Record<'age', number>     // { age: number }`, lang: 'ts' },
      { title: 'Переименование ключей через `as` (TS 4.1+)', text: 'Новый ключ часто строят template literal type. `string & K` нужен, потому что в `keyof T` бывают `number` и `symbol`, а `Capitalize` принимает только строки.', code: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}
type G = Getters<{ name: string }> // { getName: () => string }`, lang: 'ts' },
      { title: '`as never` выкидывает ключ — так фильтруют поля по типу', text: 'Если в `as` получился `never`, ключа в результате нет.', code: `interface User { name: string; age: number; save(): void }

type DataOnly<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}
type D = DataOnly<User> // { name: string; age: number }`, lang: 'ts' },
      { title: 'Ловушка: `DeepPartial` через `extends object` цепляет массивы, `Date` и функции', text: 'Они тоже `object`, и их внутренности станут необязательными. Такие типы обрабатывают отдельными ветками. И помним: `readonly` — только компилятор и только на один уровень.', code: `type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
// Date и массивы тоже пройдут через DeepPartial`, lang: 'ts' }
    ],
    takeaway: 'Mapped type — когда новый тип получается из старого по одному правилу для всех ключей. Для двух-трёх полей проще `Pick` и `&`.',
    questions: [
      {
        q: 'Что такое mapped types? Напишите Partial и Readonly.',
        a: 'Mapped type перебирает union ключей и строит объектный тип: `{ [K in keyof T]: T[K] }` — копия `T`. `Partial` — то же самое с вопросительным знаком: `{ [K in keyof T]?: T[K] }`, а `Readonly` добавляет `readonly` перед ключом. Модификаторы можно и снимать: `-?` даёт `Required`, `-readonly` делает поля изменяемыми. Встроенные утилиты устроены ровно так.'
      },
      {
        q: 'Как в mapped type переименовать или отфильтровать ключи?',
        a: 'С TS 4.1 есть key remapping через `as`: `[K in keyof T as НовыйКлюч]`. Новый ключ часто строят template literal type: шаблон из `get` и `Capitalize<string & K>` превращает `name` в `getName`. Если в `as` вернуть `never`, ключ выпадает, так фильтруют поля по типу значения. `string & K` нужен, потому что `keyof T` может содержать числа и символы, а `Capitalize` работает только со строками.'
      },
      {
        q: 'Почему Pick сохраняет необязательность полей, а Record — нет?',
        a: 'Потому что `Pick` — гомоморфный mapped type: он перебирает ключи исходного типа через `keyof T`, и TS переносит их модификаторы `?` и `readonly`. `Record<K, V>` перебирает произвольный union `K`, связи с исходным типом нет, поэтому все поля получаются обязательными. Это же объясняет, почему свой mapped type по `keyof T` по умолчанию сохраняет `readonly`, пока его явно не снять через `-readonly`.'
      }
    ]
  },
  {
    id: 'ts-conditional',
    section: 'ts',
    group: 'Продвинутые типы',
    title: 'Conditional types и infer',
    level: 'middle+',
    summary: '`T extends U ? X : Y` — тернарник для типов. На голом параметре он распределяется по union, а `infer` вытаскивает часть типа.',
    points: [
      { title: '`T extends U ? X : Y` — если `T` совместим с `U`, то `X`, иначе `Y`', text: '`extends` здесь — проверка совместимости, которая выбирает ветку. В `<T extends X>` то же слово значит ограничение параметра.', code: `type IsString<T> = T extends string ? 'да' : 'нет'
type A = IsString<'hi'> // 'да'
type B = IsString<42>   // 'нет'`, lang: 'ts' },
      { title: '`infer R` — «выведи эту часть типа и назови `R`»', text: 'Объявляет переменную типа внутри `extends`, TS заполняет её при сопоставлении. Так устроены `ReturnType`, `Parameters`, `Awaited`.', code: `type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type MyAwaited<T> = T extends Promise<infer V> ? MyAwaited<V> : T
type ElementOf<T> = T extends readonly (infer E)[] ? E : never

type X = ElementOf<string[]> // string`, lang: 'ts' },
      { title: 'На голом `T` union распределяется по вариантам', text: 'Если проверяется голый параметр (`T`, а не `T[]` или `[T]`), условие применяется к каждому варианту, результаты объединяются. Похоже на `.map()` по union. На этом стоит `Exclude`.', code: `type ToArray<T> = T extends unknown ? T[] : never
type A = ToArray<string | number> // string[] | number[]

type MyExclude<T, U> = T extends U ? never : T
type C = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'`, lang: 'ts' },
      { title: 'Отключить распределение — обернуть в кортеж `[T] extends [U]`', text: 'Тогда union проверяется целиком.', code: `type ToArrayAll<T> = [T] extends [unknown] ? T[] : never
type B = ToArrayAll<string | number> // (string | number)[]`, lang: 'ts' },
      { title: 'Ловушка: `T extends never` не ловит `never`', text: '`never` — пустой union, дистрибутивный тип на нём сразу возвращает `never`. Нужна обёртка в кортеж.', code: `type IsNeverBad<T> = T extends never ? true : false
type X = IsNeverBad<never> // never

type IsNever<T> = [T] extends [never] ? true : false
type Y = IsNever<never>    // true`, lang: 'ts' },
      { title: 'Ловушка: функция с условным типом возврата требует `as` внутри', text: 'Пока `T` — параметр, TS откладывает вычисление (deferred) и не знает ветку, даже после `typeof`: сужение значения не сужает параметр типа. Для внешнего API функции лучше перегрузки.', code: `function parse<T extends string | number>(v: T): T extends string ? number : string {
  return (typeof v === 'string' ? Number(v) : String(v)) as any // без as — ошибка
}`, lang: 'ts' },
      { title: '`infer` с ограничением (TS 4.7+) и перегрузки', text: '`infer S extends string` выводит только строку. У перегруженной функции `infer` (и `ReturnType`) берёт последнюю перегрузку.', code: `type FirstString<T> = T extends [infer S extends string, ...unknown[]] ? S : never
type F = FirstString<['a', 1]> // 'a'`, lang: 'ts' }
    ],
    takeaway: 'В прикладном коде обычно хватает готовых `ReturnType`, `Awaited`, `Exclude`. Свои условные типы трудно читать и они тормозят проверку — держите их в одном месте.',
    questions: [
      {
        q: 'Что такое conditional types и что делает infer? Напишите ReturnType.',
        a: 'Условный тип — `T extends U ? X : Y`: если `T` совместим с `U`, получается `X`, иначе `Y`. `infer` объявляет внутри `extends` переменную типа, которую TS выводит при сопоставлении. `ReturnType` пишется так: `T extends (...args: any[]) => infer R ? R : never` — если `T` функция, `R` станет типом её результата. Так же устроены `Parameters` и `Awaited`, только `infer` стоит в другом месте.'
      },
      {
        q: 'Что такое дистрибутивность условных типов и как её отключить?',
        a: 'Если проверяемый тип — голый параметр, а в него подставили union, условие применяется к каждому варианту отдельно, и результаты объединяются. Например, `T extends unknown ? T[] : never` от `string | number` даст `string[] | number[]`. На этом держится `Exclude`. Отключают, обернув обе стороны в кортеж: `[T] extends [U]` — тогда union проверяется целиком. Отдельный случай — `never`: это пустой union, и дистрибутивный тип на нём сразу возвращает `never`.'
      },
      {
        q: 'Почему функция с условным типом возврата требует as внутри?',
        a: 'Пока `T` — параметр, TS не может вычислить условный тип и откладывает его (deferred). В теле функции он не знает, какая ветка выбрана, даже после проверки `typeof`, потому что сужение значения не сужает параметр типа. Поэтому `return` приходится приводить через `as`. Альтернатива для внешнего API функции — перегрузки: каждая сигнатура описывает свой случай, а реализация типизирована шире.'
      }
    ]
  },
  {
    id: 'ts-satisfies',
    section: 'ts',
    group: 'Продвинутые типы',
    title: 'Оператор satisfies',
    level: 'middle',
    summary: '`satisfies` (TS 4.9+) проверяет, что значение подходит под тип, но оставляет переменной собственный, более точный тип.',
    points: [
      { title: 'Аннотация проверяет, но расширяет тип; `satisfies` проверяет и сохраняет точный', text: 'С `const r: Record<string, Route>` любой ключ допустим, и `keyof typeof r` — просто `string`. С `satisfies` форма проверена, а ключи и поля остаются конкретными.', code: `type Route = { path: string; auth?: boolean }

const routes = {
  home: { path: '/' },
  orders: { path: '/orders', auth: true }
} satisfies Record<string, Route>

type RouteName = keyof typeof routes // 'home' | 'orders'
routes.orders.auth                   // есть, без | undefined
routes.promo                         // ошибка: такого маршрута нет`, lang: 'ts' },
      { title: 'Лишние свойства ловит у объектного литерала', text: 'Проверка лишних полей срабатывает для объекта, написанного прямо в выражении. Объект из переменной лишние свойства не ловит.', code: `const bad = {
  promo: { pth: '/promo' } // ошибка: лишнее свойство pth
} satisfies Record<string, Route>`, lang: 'ts' },
      { title: '`as const satisfies` — литералы плюс проверка полноты', text: '`as const` делает значения литеральными, `satisfies` проверяет, что все ключи на месте.', code: `type Status = 'new' | 'paid' | 'shipped'

const BADGE = {
  new: 'gray', paid: 'green', shipped: 'blue'
} as const satisfies Record<Status, string> // забыли статус — ошибка

type BadgeColor = (typeof BADGE)[Status] // 'gray' | 'green' | 'blue'`, lang: 'ts' },
      { title: '`satisfies` vs `as`: `as` подавляет ошибки, `satisfies` показывает', text: '`as` проверяет только, что типы вообще пересекаются, поэтому пропущенные поля не заметит.', code: `const a = { new: 'gray' } as Record<Status, string>        // компилируется
const b = { new: 'gray' } satisfies Record<Status, string> // ошибка: нет paid, shipped`, lang: 'ts' },
      { title: 'Ловушка: переменную, которую перезаписывают, `satisfies` не подходит', text: 'Тип выводится из начального значения и может оказаться уже нужного. Тут нужна обычная аннотация.', code: `let theme = { color: 'red' } satisfies Theme
theme = otherTheme // может не подойти: тип — { color: string }, а не Theme`, lang: 'ts' }
    ],
    takeaway: '`satisfies` — для объектов-констант (маршруты, меню, словари, тема), где важны и контракт, и точные ключи.',
    questions: [
      {
        q: 'Что делает satisfies и чем он отличается от аннотации типа?',
        a: '`satisfies` (TS 4.9+) проверяет, что значение соответствует типу, но переменная сохраняет выведенный из значения тип. С аннотацией тип переменной становится объявленным: у `Record<string, Route>` любой ключ допустим, и `keyof typeof` даст просто `string`. С `satisfies` форма проверена, ключи точные, а обращение к несуществующему маршруту — ошибка. Я использую его для конфигов, карт маршрутов и словарей.'
      },
      {
        q: 'Чем satisfies отличается от as?',
        a: '`as` — утверждение типа: TS верит разработчику и проверяет только, что типы вообще пересекаются. Объект без обязательных полей можно привести через `as`, ошибки не будет. `satisfies` проверяет соответствие полностью, включая лишние свойства, и тип не меняет. Поэтому `as` — для случаев, когда я знаю больше компилятора, а `satisfies` — когда хочу проверку без потери точности.'
      }
    ]
  },
  {
    id: 'ts-overloads',
    section: 'ts',
    group: 'Продвинутые типы',
    title: 'Перегрузки функций',
    level: 'middle',
    summary: 'Несколько сигнатур одной функции и одна общая реализация. Вызов сопоставляется с сигнатурами сверху вниз.',
    points: [
      { title: 'Сигнатуры подряд, потом одна реализация', text: 'Снаружи видны только сигнатуры перегрузок, реализацию напрямую вызвать нельзя. Её сигнатура должна покрывать все перегрузки, а аргумент внутри сужают сами.', code: `function getUsers(id: number): Promise<User>
function getUsers(ids: number[]): Promise<User[]>
function getUsers(arg: number | number[]): Promise<User | User[]> {
  return Array.isArray(arg)
    ? $fetch<User[]>('/api/users', { query: { ids: arg.join(',') } })
    : $fetch<User>('/api/users/' + arg)
}

const one = await getUsers(1)       // User
const many = await getUsers([1, 2]) // User[]`, lang: 'ts' },
      { title: 'Порядок важен: конкретные сигнатуры — выше общих', text: 'TS берёт первую подходящую. Общая сверху перехватит вызов, и точный тип результата не достанется.', code: `function f(x: unknown): unknown
function f(x: string): string // недостижима
function f(x: unknown) { return x }

f('a') // unknown, а не string`, lang: 'ts' },
      { title: 'Ловушка: значение типа union не проходит ни в одну перегрузку', text: 'Каждая перегрузка принимает свой вариант, а union — ни одна. Если результат от варианта не зависит, проще union-параметр — так и советует документация TS.', code: `declare const x: number | number[]
getUsers(x) // ошибка: нет перегрузки для number | number[]`, lang: 'ts' },
      { title: 'Перегрузки vs generic', text: 'Если тип результата выражается через тип входа (`T` → `T[]`), нужен generic. Перегрузки — когда соответствие произвольное или различается число аргументов.', code: `function wrap<T>(x: T): T[] { return [x] } // generic хватает`, lang: 'ts' },
      { title: 'Ловушка: `ReturnType` и `Parameters` видят только последнюю перегрузку', text: 'Если нужен тип конкретного варианта, его описывают отдельно.', code: `type R = ReturnType<typeof getUsers> // Promise<User[]> — последняя`, lang: 'ts' },
      { title: 'Во Vue: `defineEmits` с сигнатурами вызова — это перегрузки', text: 'Тип с несколькими сигнатурами вызова — тоже перегрузка, так её описывают для стрелок и методов. С Vue 3.3 короче через кортежи, результат по типам тот же.', code: `const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
emit('change', '1') // ошибка: для change нужен number

// короче: defineEmits<{ change: [id: number]; update: [value: string] }>()`, lang: 'ts' }
    ],
    takeaway: 'Сначала union, потом generic, перегрузки — последними: когда связь вход-выход произвольная или разное число аргументов.',
    questions: [
      {
        q: 'Как работают перегрузки функций в TypeScript?',
        a: 'Пишу несколько сигнатур подряд, а после них одну реализацию с телом. Для вызывающего кода существуют только сигнатуры перегрузок: TS проверяет их сверху вниз и берёт первую подходящую, поэтому конкретные варианты идут первыми. Сигнатура реализации наружу не видна и должна быть совместима со всеми перегрузками, а внутри приходится самому сужать аргумент. Пример — `getUsers(id)` возвращает `User`, а `getUsers(ids)` — `User[]`.'
      },
      {
        q: 'Когда лучше union или generic вместо перегрузок?',
        a: 'Если тип результата не зависит от варианта аргумента, достаточно union-параметра: это проще и позволяет передать значение типа `A | B`, которое отдельные перегрузки не примут. Если результат выражается через тип входа, например `T` на входе и `T[]` на выходе, лучше generic. Перегрузки оставляю для случаев, когда соответствие вход-выход произвольное или различается число аргументов.'
      },
      {
        q: 'Где перегрузки встречаются во Vue?',
        a: 'В `defineEmits` можно описать события сигнатурами вызова: `(e: \'change\', id: number): void` и так далее. Получается тип с несколькими сигнатурами вызова, то есть перегруженная функция `emit`, и TS подбирает аргументы по имени события. С Vue 3.3 есть короткий синтаксис с кортежами `change: [id: number]`, результат по типам тот же. Ещё перегрузки широко используются в типах самого Vue, например у `ref`, `watch` и `h`.'
      }
    ]
  }
);
