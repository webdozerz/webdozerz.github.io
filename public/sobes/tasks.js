/* Practice tasks. kind 'code' runs tests in a worker (exports = names the tests import); kind 'review' is a self-checked code review. */
window.SOBES = window.SOBES || { topics: [], quiz: [] };
window.SOBES.tasks = [
{
  id: 'debounce', section: 'js', kind: 'code', level: 'middle', title: 'Реализовать debounce',
  brief: 'Классика собеса: отложить вызов до паузы в событиях.',
  desc: 'Напишите `debounce(fn, ms)`. Возвращённая функция откладывает вызов `fn` на `ms` миллисекунд, и каждый новый вызов сбрасывает таймер. В итоге `fn` вызывается один раз — с аргументами последнего вызова и с тем же `this`.\n\nДополнительно: метод `cancel()`, который отменяет запланированный вызов.',
  exports: ['debounce'],
  starter: `function debounce(fn, ms) {
  // ваш код
}`,
  tests: [
    { name: 'Серия вызовов → один вызов fn', code: `let n = 0; const d = debounce(() => n++, 30); d(); d(); d(); await sleep(60); eq(n, 1);` },
    { name: 'Вызов с аргументами последнего вызова', code: `let got; const d = debounce(x => { got = x; }, 20); d(1); d(2); d(3); await sleep(50); eq(got, 3);` },
    { name: 'Не вызывает раньше паузы', code: `let n = 0; const d = debounce(() => n++, 40); d(); await sleep(20); d(); await sleep(25); eq(n, 0, 'таймер должен был сброситься'); await sleep(40); eq(n, 1);` },
    { name: 'Сохраняет this', code: `const obj = { v: 7, got: 0, f: null }; obj.f = debounce(function () { this.got = this.v; }, 10); obj.f(); await sleep(30); eq(obj.got, 7);` },
    { name: 'cancel() отменяет вызов', code: `let n = 0; const d = debounce(() => n++, 20); d(); assert(typeof d.cancel === 'function', 'нет метода cancel'); d.cancel(); await sleep(40); eq(n, 0);` },
  ],
  solution: `function debounce(fn, ms) {
  let timer = null;
  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, ms);
  }
  debounced.cancel = () => { clearTimeout(timer); timer = null; };
  return debounced;
}`,
  notes: 'Обычная функция, а не стрелка, для `debounced` — чтобы получить `this` вызывающего объекта и передать его через `apply`. Таймер живёт в замыкании. На собеседовании часто просят ещё `leading`-вариант (вызов в начале серии) — это флаг и проверка `timer === null` перед вызовом.',
  review: ['Можете объяснить, где здесь замыкание?', 'Чем debounce отличается от throttle и где какой нужен (поиск — debounce, scroll — throttle)?', 'Как сделать leading-вызов?'],
},
{
  id: 'throttle', section: 'js', kind: 'code', level: 'middle', title: 'Реализовать throttle',
  brief: 'Не чаще одного вызова за интервал, последний вызов не теряется.',
  desc: 'Напишите `throttle(fn, ms)`. Первый вызов выполняется сразу. Дальше `fn` вызывается не чаще раза в `ms`. Если за интервал были вызовы, после его окончания выполняется последний из них (trailing).',
  exports: ['throttle'],
  starter: `function throttle(fn, ms) {
  // ваш код
}`,
  tests: [
    { name: 'Первый вызов сразу', code: `let n = 0; const t = throttle(() => n++, 50); t(); eq(n, 1);` },
    { name: 'В интервале не вызывает повторно', code: `let n = 0; const t = throttle(() => n++, 50); t(); t(); t(); eq(n, 1);` },
    { name: 'Trailing: последний вызов после интервала', code: `const got = []; const t = throttle(x => got.push(x), 40); t(1); t(2); t(3); await sleep(70); eq(got, [1, 3]);` },
    { name: 'После паузы снова вызывается сразу', code: `let n = 0; const t = throttle(() => n++, 30); t(); await sleep(80); t(); eq(n, 2);` },
  ],
  solution: `function throttle(fn, ms) {
  let last = 0;
  let timer = null;
  let pending = null;
  return function throttled(...args) {
    const now = Date.now();
    const left = ms - (now - last);
    if (left <= 0) {
      last = now;
      fn.apply(this, args);
    } else {
      pending = [this, args];
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          last = Date.now();
          const [ctx, a] = pending;
          pending = null;
          fn.apply(ctx, a);
        }, left);
      }
    }
  };
}`,
  notes: 'Держим время последнего вызова и, если вызов пришёл раньше срока, запоминаем его аргументы и ставим один таймер на остаток интервала. Без trailing-вызова пользователь, который остановил скролл посередине, не увидит финального состояния.',
},
{
  id: 'deep-clone', section: 'js', kind: 'code', level: 'middle', title: 'Глубокое копирование',
  brief: 'deepClone с Date, Map, Set, массивами и циклическими ссылками.',
  desc: 'Напишите `deepClone(value)`. Должны копироваться вложенные объекты и массивы, `Date`, `Map`, `Set`. Объект с циклической ссылкой не должен уронить функцию: в копии цикл указывает на копию.\n\nФункции и примитивы возвращаются как есть. `structuredClone` использовать нельзя — смысл задачи в рекурсии.',
  exports: ['deepClone'],
  starter: `function deepClone(value) {
  // ваш код
}`,
  tests: [
    { name: 'Примитивы как есть', code: `eq(deepClone(5), 5); eq(deepClone('a'), 'a'); eq(deepClone(null), null);` },
    { name: 'Вложенные объекты не общие', code: `const a = { x: { y: [1, { z: 2 }] } }; const b = deepClone(a); eq(b, a); b.x.y[1].z = 9; eq(a.x.y[1].z, 2);` },
    { name: 'Массив остаётся массивом', code: `const b = deepClone([1, [2]]); assert(Array.isArray(b) && Array.isArray(b[1]), 'должен быть массив');` },
    { name: 'Date копируется в новый Date', code: `const d = new Date(2020, 0, 1); const c = deepClone({ d }); assert(c.d instanceof Date, 'не Date'); assert(c.d !== d, 'тот же объект'); eq(c.d.getTime(), d.getTime());` },
    { name: 'Map и Set', code: `const m = new Map([['k', { v: 1 }]]); const s = new Set([1, 2]); const c = deepClone({ m, s }); assert(c.m instanceof Map && c.s instanceof Set, 'не Map/Set'); assert(c.m.get('k') !== m.get('k'), 'значение Map не скопировано'); eq(c.m.get('k'), { v: 1 }); eq([...c.s], [1, 2]);` },
    { name: 'Циклическая ссылка', code: `const a = { name: 'a' }; a.self = a; const c = deepClone(a); assert(c !== a, 'тот же объект'); assert(c.self === c, 'цикл должен указывать на копию');` },
  ],
  solution: `function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);

  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof Map) {
    const copy = new Map();
    seen.set(value, copy);
    value.forEach((v, k) => copy.set(deepClone(k, seen), deepClone(v, seen)));
    return copy;
  }
  if (value instanceof Set) {
    const copy = new Set();
    seen.set(value, copy);
    value.forEach(v => copy.add(deepClone(v, seen)));
    return copy;
  }

  const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  seen.set(value, copy);
  for (const key of Reflect.ownKeys(value)) copy[key] = deepClone(value[key], seen);
  return copy;
}`,
  notes: '`WeakMap` запоминает уже скопированные объекты — это и защита от циклов, и сохранение общих ссылок. Регистрировать копию в `seen` нужно до рекурсии, иначе цикл не поймается. В реальном коде есть `structuredClone`: он умеет всё это, но не копирует функции, DOM-узлы и прототипы классов.',
},
{
  id: 'promise-all', section: 'js', kind: 'code', level: 'middle', title: 'Свой Promise.all',
  brief: 'Порядок результатов, мгновенный reject, не-промисы в массиве.',
  desc: 'Напишите `promiseAll(items)` — аналог `Promise.all`. Возвращает промис с массивом результатов в исходном порядке (а не в порядке завершения). Если любой промис отклонён — сразу reject с его ошибкой. Обычные значения в массиве считаются уже выполненными. Пустой массив → `[]`.',
  exports: ['promiseAll'],
  starter: `function promiseAll(items) {
  // ваш код
}`,
  tests: [
    { name: 'Порядок как во входном массиве', code: `const r = await promiseAll([sleep(30).then(() => 'a'), sleep(5).then(() => 'b'), 'c']); eq(r, ['a', 'b', 'c']);` },
    { name: 'Пустой массив', code: `eq(await promiseAll([]), []);` },
    { name: 'Reject с первой ошибкой и не ждёт остальных', code: `const t = Date.now(); let err; const bad = Promise.reject(new Error('boom')); bad.catch(() => {}); try { await promiseAll([sleep(200), bad]); } catch (e) { err = e; } eq(err && err.message, 'boom'); assert(Date.now() - t < 100, 'не надо ждать остальные промисы');` },
    { name: 'Возвращает промис', code: `assert(promiseAll([1]) instanceof Promise, 'должен вернуть Promise');` },
  ],
  solution: `function promiseAll(items) {
  return new Promise((resolve, reject) => {
    const results = new Array(items.length);
    let left = items.length;
    if (left === 0) return resolve(results);
    items.forEach((item, i) => {
      Promise.resolve(item).then(value => {
        results[i] = value;
        if (--left === 0) resolve(results);
      }, reject);
    });
  });
}`,
  notes: 'Ключ — писать результат по индексу `i`, а не через `push`, и считать оставшиеся, а не проверять `results.length` (у массива с дырками длина уже полная). `Promise.resolve(item)` превращает обычные значения и thenable в промисы. Повторный `reject` после первого игнорируется самим промисом.',
  review: ['Как переделать в allSettled?', 'Как ограничить параллельность (pLimit)?'],
},
{
  id: 'run-limit', section: 'js', kind: 'code', level: 'middle+', title: 'Запросы с ограничением параллельности',
  brief: 'Не больше N одновременных задач — как в загрузчике файлов.',
  desc: 'Напишите `runWithLimit(tasks, limit)`. `tasks` — массив функций, каждая возвращает промис. Одновременно выполняется не больше `limit` задач. Результат — промис с массивом результатов в исходном порядке. Ошибки можно не обрабатывать отдельно: если задача упала, общий промис отклоняется.',
  exports: ['runWithLimit'],
  starter: `function runWithLimit(tasks, limit) {
  // ваш код
}`,
  tests: [
    { name: 'Результаты по порядку', code: `const mk = (v, ms) => () => sleep(ms).then(() => v); eq(await runWithLimit([mk(1, 30), mk(2, 5), mk(3, 10)], 2), [1, 2, 3]);` },
    { name: 'Не больше limit одновременно', code: `let active = 0, max = 0; const task = () => { active++; max = Math.max(max, active); return sleep(10).then(() => { active--; }); }; await runWithLimit(Array.from({ length: 8 }, () => task), 3); eq(max, 3);` },
    { name: 'Параллельность действительно есть', code: `const t = Date.now(); await runWithLimit(Array.from({ length: 4 }, () => () => sleep(40)), 4); assert(Date.now() - t < 120, 'задачи выполнялись по одной');` },
    { name: 'Пустой список', code: `eq(await runWithLimit([], 2), []);` },
  ],
  solution: `async function runWithLimit(tasks, limit) {
  const results = new Array(tasks.length);
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker);
  await Promise.all(workers);
  return results;
}`,
  notes: 'Запускаем `limit` «воркеров», каждый забирает следующую задачу из общего счётчика. JS однопоточный, поэтому `next++` безопасен — гонки нет. Это тот же приём, что в библиотеке p-limit и в загрузчиках файлов.',
},
{
  id: 'memoize', section: 'js', kind: 'code', level: 'junior', title: 'Мемоизация',
  brief: 'Кеш результатов по аргументам.',
  desc: 'Напишите `memoize(fn)`. Повторный вызов с теми же аргументами возвращает результат из кеша и не вызывает `fn`. Аргументов может быть несколько.',
  exports: ['memoize'],
  starter: `function memoize(fn) {
  // ваш код
}`,
  tests: [
    { name: 'Кеширует по аргументу', code: `let n = 0; const sq = memoize(x => { n++; return x * x; }); eq(sq(4), 16); eq(sq(4), 16); eq(n, 1);` },
    { name: 'Разные аргументы — разные значения', code: `const sq = memoize(x => x * x); eq(sq(2), 4); eq(sq(3), 9);` },
    { name: 'Несколько аргументов', code: `let n = 0; const add = memoize((a, b) => { n++; return a + b; }); eq(add(1, 2), 3); eq(add(1, 2), 3); eq(add(2, 1), 3); eq(n, 2);` },
    { name: 'Кеширует и undefined', code: `let n = 0; const f = memoize(() => { n++; return undefined; }); f(); f(); eq(n, 1);` },
  ],
  solution: `function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
  notes: '`cache.has`, а не проверка `cache.get(key) !== undefined` — иначе `undefined` никогда не закешируется. Ключ через `JSON.stringify` подходит для примитивов; для объектов-аргументов нужен WeakMap по ссылке. Кеш без ограничения размера — утечка памяти, в проде ставят LRU.',
},
{
  id: 'curry', section: 'js', kind: 'code', level: 'middle', title: 'Каррирование',
  brief: 'curry(fn) — вызов по одному или пачками аргументов.',
  desc: 'Напишите `curry(fn)`. Каррированная функция собирает аргументы, пока их не наберётся `fn.length`, и только тогда вызывает `fn`. Аргументы можно передавать по одному или группами: `f(1)(2)(3)`, `f(1, 2)(3)`, `f(1)(2, 3)`.',
  exports: ['curry'],
  starter: `function curry(fn) {
  // ваш код
}`,
  tests: [
    { name: 'По одному', code: `const f = curry((a, b, c) => a + b + c); eq(f(1)(2)(3), 6);` },
    { name: 'Группами', code: `const f = curry((a, b, c) => a + b + c); eq(f(1, 2)(3), 6); eq(f(1)(2, 3), 6); eq(f(1, 2, 3), 6);` },
    { name: 'Промежуточные функции переиспользуются', code: `const f = curry((a, b) => a * b); const dbl = f(2); eq(dbl(5), 10); eq(dbl(7), 14);` },
  ],
  solution: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}`,
  notes: 'Каждый промежуточный вызов возвращает новую функцию, которая замкнула уже собранные аргументы, поэтому `dbl` можно вызывать много раз. `fn.length` не учитывает rest-параметры и параметры со значением по умолчанию — это частый уточняющий вопрос.',
},
{
  id: 'event-emitter', section: 'arch', kind: 'code', level: 'middle', title: 'EventEmitter (Observer)',
  brief: 'on, off, once, emit — шина событий.',
  desc: 'Реализуйте класс `EventEmitter` с методами:\n\n`on(event, fn)` — подписка, возвращает функцию отписки; `off(event, fn)` — отписка; `once(event, fn)` — сработает один раз; `emit(event, ...args)` — вызывает подписчиков в порядке подписки.\n\nОтписка во время `emit` не должна ломать обход.',
  exports: ['EventEmitter'],
  starter: `class EventEmitter {
  // ваш код
}`,
  tests: [
    { name: 'on + emit с аргументами', code: `const e = new EventEmitter(); let got; e.on('a', (x, y) => { got = x + y; }); e.emit('a', 1, 2); eq(got, 3);` },
    { name: 'Порядок подписчиков', code: `const e = new EventEmitter(); const log = []; e.on('a', () => log.push(1)); e.on('a', () => log.push(2)); e.emit('a'); eq(log, [1, 2]);` },
    { name: 'off отписывает', code: `const e = new EventEmitter(); let n = 0; const f = () => n++; e.on('a', f); e.off('a', f); e.emit('a'); eq(n, 0);` },
    { name: 'on возвращает отписку', code: `const e = new EventEmitter(); let n = 0; const un = e.on('a', () => n++); assert(typeof un === 'function', 'on должен вернуть функцию'); un(); e.emit('a'); eq(n, 0);` },
    { name: 'once срабатывает один раз', code: `const e = new EventEmitter(); let n = 0; e.once('a', () => n++); e.emit('a'); e.emit('a'); eq(n, 1);` },
    { name: 'emit без подписчиков не падает', code: `new EventEmitter().emit('nobody');` },
    { name: 'Отписка во время emit не пропускает соседей', code: `const e = new EventEmitter(); const log = []; e.once('a', () => log.push('once')); e.on('a', () => log.push('on')); e.emit('a'); eq(log, ['once', 'on']);` },
  ],
  solution: `class EventEmitter {
  #handlers = new Map();

  on(event, fn) {
    if (!this.#handlers.has(event)) this.#handlers.set(event, []);
    this.#handlers.get(event).push(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    const list = this.#handlers.get(event);
    if (list) this.#handlers.set(event, list.filter(h => h !== fn && h.original !== fn));
  }

  once(event, fn) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      fn(...args);
    };
    wrapper.original = fn;
    return this.on(event, wrapper);
  }

  emit(event, ...args) {
    // копия списка: подписчики могут отписываться прямо во время обхода
    [...(this.#handlers.get(event) || [])].forEach(fn => fn(...args));
  }
}`,
  notes: 'Это паттерн Observer. Обход копии массива защищает от пропуска элементов, когда `once` удаляет себя посреди `forEach`. Свойство `original` позволяет отписать `once`-подписку по исходной функции. Возврат функции отписки — тот же приём, что у `watch` во Vue.',
},
{
  id: 'mini-reactive', section: 'vue', kind: 'code', level: 'middle+', title: 'Мини-реактивность как во Vue 3',
  brief: 'reactive + effect на Proxy: track и trigger своими руками.',
  desc: 'Соберите упрощённое ядро реактивности Vue 3.\n\n`reactive(obj)` возвращает Proxy. `effect(fn)` сразу запускает `fn` и запоминает, какие свойства она прочитала. Когда одно из них меняется, `fn` перезапускается. Изменение свойства, которое эффект не читал, его не трогает. Вложенные объекты тоже реактивны.',
  exports: ['reactive', 'effect'],
  starter: `let activeEffect = null;
const targetMap = new WeakMap(); // target -> Map(key -> Set(effects))

function track(target, key) {
  // запомнить activeEffect для target[key]
}

function trigger(target, key) {
  // перезапустить эффекты, зависящие от target[key]
}

function reactive(obj) {
  return new Proxy(obj, {
    // get и set
  });
}

function effect(fn) {
  // ваш код
}`,
  tests: [
    { name: 'effect запускается сразу', code: `let n = 0; effect(() => n++); eq(n, 1);` },
    { name: 'Перезапуск при изменении прочитанного свойства', code: `const s = reactive({ count: 0 }); let seen; effect(() => { seen = s.count; }); s.count = 5; eq(seen, 5);` },
    { name: 'Не перезапускается от чужого свойства', code: `const s = reactive({ a: 1, b: 1 }); let n = 0; effect(() => { n++; s.a; }); s.b = 2; eq(n, 1);` },
    { name: 'Одинаковое значение не триггерит', code: `const s = reactive({ a: 1 }); let n = 0; effect(() => { n++; s.a; }); s.a = 1; eq(n, 1);` },
    { name: 'Вложенные объекты реактивны', code: `const s = reactive({ user: { name: 'A' } }); let seen; effect(() => { seen = s.user.name; }); s.user.name = 'B'; eq(seen, 'B');` },
    { name: 'Два эффекта на одно свойство', code: `const s = reactive({ x: 1 }); let a, b; effect(() => { a = s.x * 2; }); effect(() => { b = s.x * 3; }); s.x = 2; eq([a, b], [4, 6]);` },
  ],
  solution: `let activeEffect = null;
const targetMap = new WeakMap();

function track(target, key) {
  if (!activeEffect) return;
  let deps = targetMap.get(target);
  if (!deps) targetMap.set(target, (deps = new Map()));
  let effects = deps.get(key);
  if (!effects) deps.set(key, (effects = new Set()));
  effects.add(activeEffect);
}

function trigger(target, key) {
  const effects = targetMap.get(target)?.get(key);
  if (effects) [...effects].forEach(run => run());
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key);
      const value = Reflect.get(target, key, receiver);
      return value !== null && typeof value === 'object' ? reactive(value) : value;
    },
    set(target, key, value, receiver) {
      const old = target[key];
      const ok = Reflect.set(target, key, value, receiver);
      if (!Object.is(old, value)) trigger(target, key);
      return ok;
    },
  });
}

function effect(fn) {
  const run = () => {
    const prev = activeEffect;
    activeEffect = run;
    try { fn(); } finally { activeEffect = prev; }
  };
  run();
  return run;
}`,
  notes: 'Так устроен Vue 3: `get` вызывает `track`, `set` вызывает `trigger`, зависимости лежат в `WeakMap → Map → Set`. Вложенные объекты оборачиваются лениво — в момент чтения (настоящий Vue ещё кеширует прокси в WeakMap, чтобы не создавать новый на каждое чтение). Отсюда понятно, почему деструктуризация теряет реактивность: вы получаете значение, а не прокси, и `get`-ловушка больше не срабатывает.',
  review: ['Почему `const { count } = state` теряет реактивность — объясните через этот код.', 'Как сделать `ref` поверх этого (объект с get/set value)?', 'Как сделать `computed` (ленивый эффект + флаг dirty)?'],
},
{
  id: 'pagination', section: 'vue', kind: 'code', level: 'middle', title: 'Логика пагинации для composable',
  brief: 'Номера страниц с многоточиями — ядро usePagination.',
  desc: 'Основа composable `usePagination` — чистая функция без Vue, её легко тестировать. Напишите `getPages(current, total, siblings = 1)`: массив номеров для кнопок пагинации. Всегда показываются первая и последняя страницы, текущая и `siblings` соседей с каждой стороны. Пропуски заменяются на строку `\'…\'`. Если пропуск — всего одна страница, показываем её номер вместо многоточия. Если страниц не больше `2 * siblings + 5`, показываем все без многоточий.',
  exports: ['getPages'],
  starter: `function getPages(current, total, siblings = 1) {
  // ваш код
}

// В composable это обернётся так:
// const pages = computed(() => getPages(page.value, totalPages.value))`,
  tests: [
    { name: 'Мало страниц — все подряд', code: `eq(getPages(1, 5), [1, 2, 3, 4, 5]);` },
    { name: 'Начало списка', code: `eq(getPages(1, 10), [1, 2, '…', 10]);` },
    { name: 'Середина', code: `eq(getPages(5, 10), [1, '…', 4, 5, 6, '…', 10]);` },
    { name: 'Конец списка', code: `eq(getPages(10, 10), [1, '…', 9, 10]);` },
    { name: 'Пропуск в одну страницу без многоточия', code: `eq(getPages(3, 10), [1, 2, 3, 4, '…', 10]);` },
    { name: 'siblings = 2', code: `eq(getPages(6, 12, 2), [1, '…', 4, 5, 6, 7, 8, '…', 12]);` },
    { name: 'Одна страница', code: `eq(getPages(1, 1), [1]);` },
  ],
  solution: `function getPages(current, total, siblings = 1) {
  if (total <= 2 * siblings + 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total]);
  for (let p = current - siblings; p <= current + siblings; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev === 2) result.push(prev + 1);
    else if (prev !== undefined && p - prev > 2) result.push('…');
    result.push(p);
  });
  return result;
}

// composables/usePagination.ts
// export function usePagination(total: MaybeRefOrGetter<number>, perPage = 20) {
//   const page = ref(1)
//   const totalPages = computed(() => Math.max(1, Math.ceil(toValue(total) / perPage)))
//   const pages = computed(() => getPages(page.value, totalPages.value))
//   const go = (p: number) => { page.value = Math.min(Math.max(1, p), totalPages.value) }
//   return { page, totalPages, pages, go, next: () => go(page.value + 1), prev: () => go(page.value - 1) }
// }`,
  notes: 'Вынести вычисления в чистую функцию — хорошая практика для composable: логику тестируете без монтирования компонентов, а composable остаётся тонкой реактивной обёрткой. `toValue` позволяет передавать в composable число, ref или геттер.',
},
{
  id: 'filter-search', section: 'vue', kind: 'code', level: 'junior', title: 'Поиск с фильтрацией',
  brief: 'Фильтр каталога по тексту, категории и цене с сортировкой.',
  desc: 'Напишите `filterProducts(products, filters)`. `filters`: `{ q, category, maxPrice, sort }`, любое поле может отсутствовать.\n\n`q` — поиск по названию без учёта регистра и лишних пробелов; `category` — точное совпадение; `maxPrice` — цена не больше; `sort` — `\'price-asc\'`, `\'price-desc\'` или нет. Исходный массив менять нельзя.',
  exports: ['filterProducts'],
  starter: `function filterProducts(products, filters = {}) {
  // ваш код
}`,
  tests: [
    { name: 'Без фильтров — всё', code: `const p = [{ name: 'A', price: 1 }]; eq(filterProducts(p).length, 1);` },
    { name: 'Поиск без регистра и с пробелами', code: `const p = [{ name: 'Красный Чай', price: 1 }, { name: 'Кофе', price: 2 }]; eq(filterProducts(p, { q: '  чай ' }).map(x => x.name), ['Красный Чай']);` },
    { name: 'Категория и цена вместе', code: `const p = [{ name: 'a', category: 'tea', price: 100 }, { name: 'b', category: 'tea', price: 300 }, { name: 'c', category: 'coffee', price: 50 }]; eq(filterProducts(p, { category: 'tea', maxPrice: 200 }).map(x => x.name), ['a']);` },
    { name: 'maxPrice = 0 тоже фильтр', code: `const p = [{ name: 'free', price: 0 }, { name: 'paid', price: 10 }]; eq(filterProducts(p, { maxPrice: 0 }).map(x => x.name), ['free']);` },
    { name: 'Сортировка не мутирует исходник', code: `const p = [{ name: 'a', price: 3 }, { name: 'b', price: 1 }]; eq(filterProducts(p, { sort: 'price-asc' }).map(x => x.name), ['b', 'a']); eq(p[0].name, 'a', 'исходный массив изменился');` },
  ],
  solution: `function filterProducts(products, { q = '', category, maxPrice, sort } = {}) {
  const query = q.trim().toLowerCase();
  const result = products.filter(p =>
    (!query || p.name.toLowerCase().includes(query)) &&
    (!category || p.category === category) &&
    (maxPrice == null || p.price <= maxPrice)
  );
  if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  return result;
}

// В компоненте:
// const query = ref('')
// const debouncedQuery = refDebounced(query, 300) // или свой debounce в watch
// const visible = computed(() => filterProducts(products.value, { q: debouncedQuery.value, ...filters }))`,
  notes: 'Ловушка — `if (maxPrice)`: ноль ложен и фильтр пропадёт, поэтому проверка `== null`. `sort` мутирует массив, но `filter` уже вернул новый — исходник цел. Во Vue это будет `computed` от строки поиска с debounce.',
},
{
  id: 'cart-store', section: 'vue', kind: 'code', level: 'middle', title: 'Корзина: логика стора',
  brief: 'Добавление, количество, удаление, итог — как в Pinia setup store.',
  desc: 'Напишите `createCart()` — логику корзины без Vue, так же как она жила бы в setup store Pinia. Методы и геттеры:\n\n`add(product, qty = 1)` — добавить или увеличить количество; `setQty(id, qty)` — задать количество, при 0 товар удаляется; `remove(id)`; `count` — геттер, всего штук; `total` — геттер, сумма; `items` — массив `{ id, name, price, qty }`.',
  exports: ['createCart'],
  starter: `function createCart() {
  const items = [];

  return {
    items,
    // add, setQty, remove, get count(), get total()
  };
}`,
  tests: [
    { name: 'add добавляет товар', code: `const c = createCart(); c.add({ id: 1, name: 'Чай', price: 100 }); eq(c.items.length, 1); eq(c.count, 1);` },
    { name: 'Повторный add увеличивает qty', code: `const c = createCart(); const p = { id: 1, name: 'Чай', price: 100 }; c.add(p); c.add(p, 2); eq(c.items.length, 1); eq(c.items[0].qty, 3);` },
    { name: 'total считает сумму', code: `const c = createCart(); c.add({ id: 1, name: 'a', price: 100 }, 2); c.add({ id: 2, name: 'b', price: 50 }); eq(c.total, 250); eq(c.count, 3);` },
    { name: 'setQty(0) удаляет', code: `const c = createCart(); c.add({ id: 1, name: 'a', price: 1 }); c.setQty(1, 0); eq(c.items.length, 0);` },
    { name: 'remove', code: `const c = createCart(); c.add({ id: 1, name: 'a', price: 1 }); c.add({ id: 2, name: 'b', price: 1 }); c.remove(1); eq(c.items.map(i => i.id), [2]);` },
    { name: 'Не мутирует исходный товар', code: `const c = createCart(); const p = { id: 1, name: 'a', price: 1 }; c.add(p, 5); assert(p.qty === undefined, 'объект товара изменился');` },
  ],
  solution: `function createCart() {
  const items = [];
  const find = id => items.find(i => i.id === id);

  function add(product, qty = 1) {
    const existing = find(product.id);
    if (existing) existing.qty += qty;
    else items.push({ id: product.id, name: product.name, price: product.price, qty });
  }
  function remove(id) {
    const i = items.findIndex(x => x.id === id);
    if (i !== -1) items.splice(i, 1);
  }
  function setQty(id, qty) {
    if (qty <= 0) return remove(id);
    const item = find(id);
    if (item) item.qty = qty;
  }

  return {
    items, add, remove, setQty,
    get count() { return items.reduce((n, i) => n + i.qty, 0); },
    get total() { return items.reduce((s, i) => s + i.price * i.qty, 0); },
  };
}

// То же в Pinia (setup store):
// export const useCartStore = defineStore('cart', () => {
//   const items = ref<CartItem[]>([])
//   const count = computed(() => items.value.reduce((n, i) => n + i.qty, 0))
//   const total = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))
//   function add(p: Product, qty = 1) { ... }
//   return { items, count, total, add, remove, setQty }
// })
// В компоненте: const { items, total } = storeToRefs(cart); cart.add(p)`,
  notes: 'В сторе храним копию нужных полей, а не ссылку на объект каталога — иначе корзина начнёт менять каталог. Геттеры `count` и `total` в Pinia становятся `computed`. Деньги в реальном проекте держат в копейках целыми числами, чтобы не ловить `0.1 + 0.2`.',
},
{
  id: 'get-path', section: 'js', kind: 'code', level: 'junior', title: 'get(obj, path, default)',
  brief: 'Безопасное чтение по пути «a.b[0].c».',
  desc: 'Напишите `get(obj, path, defaultValue)`. Путь — строка вида `\'user.addresses[0].city\'`. Если по дороге встретился `null` или `undefined`, вернуть `defaultValue`. Если значение найдено, но равно `null`, вернуть `null` (это не отсутствие).',
  exports: ['get'],
  starter: `function get(obj, path, defaultValue) {
  // ваш код
}`,
  tests: [
    { name: 'Простой путь', code: `eq(get({ a: { b: 2 } }, 'a.b'), 2);` },
    { name: 'Индексы массивов', code: `eq(get({ a: [{ c: 'x' }] }, 'a[0].c'), 'x');` },
    { name: 'Нет пути → default', code: `eq(get({ a: null }, 'a.b.c', 'def'), 'def');` },
    { name: 'Значение null остаётся null', code: `eq(get({ a: { b: null } }, 'a.b', 'def'), null);` },
    { name: 'Значение 0 и пустая строка', code: `eq(get({ a: 0 }, 'a', 5), 0); eq(get({ a: '' }, 'a', 'x'), '');` },
  ],
  solution: `function get(obj, path, defaultValue) {
  const keys = path.replace(/\\[(\\w+)\\]/g, '.$1').split('.').filter(Boolean);
  let cur = obj;
  for (const key of keys) {
    if (cur == null) return defaultValue;
    cur = cur[key];
  }
  return cur === undefined ? defaultValue : cur;
}`,
  notes: 'Сначала приводим `a[0]` к `a.0`, потом идём по ключам. Проверка `cur == null` ловит и `null`, и `undefined` на середине пути. На собеседовании часто спрашивают: «а почему не `||`?» — потому что `0` и `\'\'` превратятся в default.',
},
{
  id: 'lru', section: 'js', kind: 'code', level: 'middle+', title: 'LRU-кеш',
  brief: 'Кеш на N элементов, вытесняет давно неиспользованные. O(1).',
  desc: 'Реализуйте класс `LRUCache(capacity)` с методами `get(key)` и `set(key, value)`. Когда кеш полон, `set` нового ключа вытесняет элемент, к которому дольше всех не обращались. `get` возвращает `undefined` для отсутствующего ключа и делает ключ «свежим». Обе операции — O(1).',
  exports: ['LRUCache'],
  starter: `class LRUCache {
  constructor(capacity) {
    // подсказка: Map помнит порядок вставки
  }
  get(key) {}
  set(key, value) {}
}`,
  tests: [
    { name: 'get/set', code: `const c = new LRUCache(2); c.set('a', 1); eq(c.get('a'), 1); eq(c.get('x'), undefined);` },
    { name: 'Вытесняет самый старый', code: `const c = new LRUCache(2); c.set('a', 1); c.set('b', 2); c.set('c', 3); eq(c.get('a'), undefined); eq(c.get('c'), 3);` },
    { name: 'get освежает ключ', code: `const c = new LRUCache(2); c.set('a', 1); c.set('b', 2); c.get('a'); c.set('c', 3); eq(c.get('a'), 1); eq(c.get('b'), undefined);` },
    { name: 'set существующего обновляет без вытеснения', code: `const c = new LRUCache(2); c.set('a', 1); c.set('b', 2); c.set('a', 10); eq(c.get('a'), 10); eq(c.get('b'), 2);` },
  ],
  solution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return undefined;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value); // переставили в конец — самый свежий
    return value;
  }
  set(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) {
      this.map.delete(this.map.keys().next().value); // первый — самый старый
    }
    this.map.set(key, value);
  }
}`,
  notes: '`Map` хранит порядок вставки, поэтому «освежить» ключ — это удалить и вставить заново, а самый старый — первый в `keys()`. Классическое решение без Map — хеш-таблица плюс двусвязный список. Так кешируют, например, ответы API и вычисления в `useAsyncData`-подобных обёртках.',
},
{
  id: 'flatten', section: 'js', kind: 'code', level: 'junior', title: 'flat своими руками',
  brief: 'Развернуть вложенный массив на заданную глубину.',
  desc: 'Напишите `flatten(arr, depth = 1)` — аналог `Array.prototype.flat`, но без него. `depth = Infinity` разворачивает полностью.',
  exports: ['flatten'],
  starter: `function flatten(arr, depth = 1) {
  // ваш код
}`,
  tests: [
    { name: 'Глубина 1 по умолчанию', code: `eq(flatten([1, [2, [3]]]), [1, 2, [3]]);` },
    { name: 'Глубина 2', code: `eq(flatten([1, [2, [3, [4]]]], 2), [1, 2, 3, [4]]);` },
    { name: 'Полностью', code: `eq(flatten([[[[1]]], 2, [3, [4]]], Infinity), [1, 2, 3, 4]);` },
    { name: 'Не меняет исходный массив', code: `const a = [1, [2]]; flatten(a); eq(a, [1, [2]]);` },
  ],
  solution: `function flatten(arr, depth = 1) {
  return arr.reduce((acc, item) =>
    Array.isArray(item) && depth > 0
      ? acc.concat(flatten(item, depth - 1))
      : acc.concat([item]),
  []);
}`,
  notes: 'Рекурсия с уменьшением глубины. `concat([item])`, а не `concat(item)` — иначе массив на последнем уровне глубины развернётся сам. Без рекурсии можно сделать стеком — это популярный уточняющий вопрос.',
},
{
  id: 'group-by', section: 'js', kind: 'code', level: 'junior', title: 'groupBy',
  brief: 'Сгруппировать заказы по статусу ключом или функцией.',
  desc: 'Напишите `groupBy(list, key)`. `key` — имя поля или функция, возвращающая ключ группы. Результат — объект `{ [группа]: элементы[] }`, порядок элементов внутри групп сохраняется.',
  exports: ['groupBy'],
  starter: `function groupBy(list, key) {
  // ваш код
}`,
  tests: [
    { name: 'По полю', code: `const r = groupBy([{ s: 'new', id: 1 }, { s: 'done', id: 2 }, { s: 'new', id: 3 }], 's'); eq(r.new.map(x => x.id), [1, 3]); eq(r.done.map(x => x.id), [2]);` },
    { name: 'По функции', code: `const r = groupBy([1.2, 1.7, 2.1], Math.floor); eq(r, { 1: [1.2, 1.7], 2: [2.1] });` },
    { name: 'Пустой список', code: `eq(groupBy([], 'x'), {});` },
  ],
  solution: `function groupBy(list, key) {
  const getKey = typeof key === 'function' ? key : item => item[key];
  return list.reduce((groups, item) => {
    const k = getKey(item);
    (groups[k] ||= []).push(item);
    return groups;
  }, {});
}`,
  notes: 'В современном JS есть встроенный `Object.groupBy(list, fn)`. Приём «поле или функция» — тот же, что в lodash: нормализуем аргумент в функцию один раз и дальше не ветвимся.',
},

/* ---------- code review tasks ---------- */
{
  id: 'rv-reactivity', section: 'vue', kind: 'review', level: 'middle', lang: 'vue', title: 'Исправить потерю реактивности',
  brief: 'Счётчик и пропсы не обновляются в интерфейсе.',
  desc: 'Компонент показывает имя пользователя и счётчик лайков. Жалоба: после клика число не меняется, и при смене пропса `user` заголовок остаётся старым. Найдите все места, где теряется реактивность.',
  code: `<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

const props = defineProps<{ user: { name: string; id: number } }>()

const { name } = props.user
const state = reactive({ likes: 0, loading: false })
let { likes } = state

function like() {
  likes++
}

const title = ref('Профиль ' + props.user.name)

watch(props.user.id, id => {
  console.log('user changed', id)
})
</script>

<template>
  <h1>{{ title }}</h1>
  <p>{{ name }}</p>
  <button @click="like">♥ {{ likes }}</button>
</template>`,
  issues: [
    'Деструктуризация props.user даёт обычную строку name — она не обновится при смене пропса',
    'let { likes } = state копирует число из reactive, изменение likes не трогает state',
    'title — ref, посчитанный один раз; нужен computed от props.user.name',
    'watch(props.user.id) передаёт число, а не источник — нужен геттер () => props.user.id',
  ],
  solution: `<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

const props = defineProps<{ user: { name: string; id: number } }>()

const state = reactive({ likes: 0, loading: false })

function like() {
  state.likes++
}

const title = computed(() => 'Профиль ' + props.user.name)

watch(() => props.user.id, id => {
  console.log('user changed', id)
})
</script>

<template>
  <h1>{{ title }}</h1>
  <p>{{ user.name }}</p>
  <button @click="like">♥ {{ state.likes }}</button>
</template>`,
  notes: 'Реактивность во Vue 3 живёт в Proxy, поэтому работает только чтение через прокси или ref в момент рендера. Деструктуризация забирает текущее значение. Если нужна деструктуризация — `toRefs(state)`. Для пропсов в Vue 3.5 работает деструктуризация прямо в `defineProps` (`const { user } = defineProps<...>()`), но в `watch` её всё равно передают геттером.',
},
{
  id: 'rv-hydration', section: 'nuxt', kind: 'review', level: 'middle', lang: 'vue', title: 'Найти причину Hydration Mismatch',
  brief: 'В консоли предупреждения о несовпадении гидратации.',
  desc: 'Страница в Nuxt рендерится на сервере. В консоли браузера сыплются `Hydration text content mismatch` и `Hydration node mismatch`, иногда кнопка «Избранное» мигает. Найдите все источники несовпадения.',
  code: `<script setup lang="ts">
const now = new Date().toLocaleTimeString()
const promo = Math.random() > 0.5 ? 'Скидка 10%' : 'Бесплатная доставка'
const isFav = localStorage.getItem('fav') === '1'
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
</script>

<template>
  <p>
    <div>Обновлено в {{ now }}</div>
  </p>
  <span>{{ promo }}</span>
  <button>{{ isFav ? 'В избранном' : 'В избранное' }}</button>
  <MobileMenu v-if="isMobile" />
</template>`,
  issues: [
    'Время new Date() на сервере и клиенте разное — текст не совпадёт',
    'Math.random() даёт разное значение на сервере и клиенте; значение нужно получить один раз (useState) и передать через payload',
    'localStorage недоступен на сервере — упадёт или даст другое значение; читать в onMounted или через useCookie',
    'window.innerWidth есть только на клиенте — на сервере isMobile false, на клиенте true; решать CSS-медиазапросом или ClientOnly',
    'Невалидный HTML: div внутри p — браузер перестроит DOM и он не совпадёт с серверным',
  ],
  solution: `<script setup lang="ts">
// одно значение и на сервере, и на клиенте — уходит в payload
const promo = useState('promo', () => (Math.random() > 0.5 ? 'Скидка 10%' : 'Бесплатная доставка'))
const fav = useCookie<'1' | null>('fav')          // cookie видна и серверу
const isFav = computed(() => fav.value === '1')

const now = ref<string | null>(null)
onMounted(() => { now.value = new Date().toLocaleTimeString() })
</script>

<template>
  <div>
    <div v-if="now">Обновлено в {{ now }}</div>
  </div>
  <span>{{ promo }}</span>
  <button>{{ isFav ? 'В избранном' : 'В избранное' }}</button>
  <!-- показываем/прячем CSS-медиазапросом, разметка одинакова везде -->
  <MobileMenu class="only-mobile" />
</template>`,
  notes: 'Правило простое: первый рендер на клиенте должен дать ровно тот же HTML, что сервер. Всё, что зависит от времени, случайности, размеров окна и браузерных хранилищ, либо передаётся с сервера (useState, useCookie, payload), либо меняется после монтирования (onMounted, ClientOnly). Отдельная причина — невалидная вложенность тегов: браузер чинит её при парсинге.',
},
{
  id: 'rv-fetch', section: 'nuxt', kind: 'review', level: 'middle', lang: 'vue', title: 'Двойной запрос и утечка состояния',
  brief: 'API получает по два запроса, а пользователи видят чужие данные.',
  desc: 'Бэкенд жалуется, что на каждую загрузку страницы приходит по два одинаковых запроса. А ещё иногда пользователь на долю секунды видит чужое имя в шапке. Посмотрите на composable и страницу.',
  code: `// composables/useCurrentUser.ts
const user = ref<User | null>(null)

export function useCurrentUser() {
  async function load() {
    user.value = await $fetch('/api/me')
  }
  return { user, load }
}

// pages/orders.vue
<script setup lang="ts">
const { user, load } = useCurrentUser()
await load()

const orders = ref([])
orders.value = await $fetch('/api/orders?user=' + user.value.id)

const route = useRoute()
const { data: product } = await useFetch('/api/product/' + route.params.id)
</script>`,
  issues: [
    '$fetch в setup выполняется и на сервере, и при гидратации на клиенте — два запроса; нужен useFetch/useAsyncData',
    'ref на уровне модуля общий для всех запросов на сервере — данные одного пользователя утекают другому; нужен useState',
    'Запрос /api/me с сервера не пробрасывает cookie пользователя — нужен useRequestFetch или useRequestHeaders',
    'URL в useFetch собран строкой из route.params один раз — при смене id не перезапросит; передавать геттер () => ...',
    'Нет обработки ошибок и пустого user: user.value.id упадёт, если не авторизован',
  ],
  solution: `// composables/useCurrentUser.ts
export function useCurrentUser() {
  const user = useState<User | null>('current-user', () => null)
  const requestFetch = useRequestFetch() // на сервере пробросит cookie

  async function load() {
    if (user.value) return
    user.value = await requestFetch<User>('/api/me')
  }
  return { user, load }
}

// pages/orders.vue
<script setup lang="ts">
const { user } = useCurrentUser()
const route = useRoute()

const { data: orders, error } = await useFetch('/api/orders', {
  query: { user: computed(() => user.value?.id) },
  immediate: !!user.value,
})

const { data: product } = await useFetch(() => '/api/product/' + route.params.id)
</script>`,
  notes: '`useFetch` = `useAsyncData` + `$fetch`: результат серверного запроса кладётся в payload, и при гидратации клиент берёт его оттуда, а не запрашивает заново. Глобальный `ref` в модуле на сервере живёт всё время работы процесса и делится между всеми пользователями — поэтому в Nuxt для общего состояния `useState` или Pinia.',
},
{
  id: 'rv-perf', section: 'vue', kind: 'review', level: 'middle+', lang: 'vue', title: 'Оптимизировать список товаров',
  brief: 'Каталог на 2000 позиций тормозит при вводе в поиск.',
  desc: 'Каталог на 2000 товаров. При вводе в поле поиска интерфейс подтормаживает, при удалении товара сбиваются введённые количества. Найдите проблемы производительности и корректности.',
  code: `<script setup lang="ts">
const props = defineProps<{ products: Product[] }>()
const search = ref('')

function visible() {
  return props.products
    .filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
    .sort((a, b) => a.price - b.price)
}
function formatPrice(p: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(p)
}
</script>

<template>
  <input v-model="search" />
  <ul>
    <li v-for="(p, i) in visible()" :key="i" v-if="p.inStock">
      {{ p.name }} — {{ formatPrice(p.price) }}
      <input type="number" />
    </li>
  </ul>
</template>`,
  issues: [
    'visible() как метод пересчитывается на каждый рендер — нужен computed',
    'Фильтрация на каждое нажатие клавиши без debounce',
    'key = индекс: при удалении/сортировке состояние input уезжает к другому товару; нужен p.id',
    'v-if вместе с v-for на одном элементе — v-if выполняется раньше и не видит p; перенести фильтр inStock в computed',
    'Intl.NumberFormat создаётся на каждый вызов — вынести форматтер в константу',
    '2000 DOM-элементов разом — нужна виртуализация списка или пагинация',
  ],
  solution: `<script setup lang="ts">
const props = defineProps<{ products: Product[] }>()
const search = ref('')
const query = refDebounced(search, 250) // VueUse; или свой debounce в watch

const rub = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' })

const visible = computed(() => {
  const q = query.value.trim().toLowerCase()
  return props.products
    .filter(p => p.inStock && (!q || p.name.toLowerCase().includes(q)))
    .sort((a, b) => a.price - b.price)
})
</script>

<template>
  <input v-model="search" />
  <!-- для тысяч строк — RecycleScroller / useVirtualList -->
  <ul>
    <li v-for="p in visible" :key="p.id">
      {{ p.name }} — {{ rub.format(p.price) }}
      <input type="number" />
    </li>
  </ul>
</template>`,
  notes: '`computed` кешируется и пересчитывается только при смене зависимостей, метод — на каждом рендере. Ключ по индексу ломает переиспользование узлов: Vue патчит элементы по позиции, и DOM-состояние (значение input, фокус) остаётся на месте, хотя данные уехали. Во Vue 3 у `v-if` приоритет выше, чем у `v-for`.',
},
{
  id: 'rv-pinia', section: 'vue', kind: 'review', level: 'middle', lang: 'vue', title: 'Ошибки в работе с Pinia',
  brief: 'Корзина в шапке не обновляется, данные расходятся.',
  desc: 'Счётчик корзины в шапке застывает на старом значении, а иногда два компонента показывают разные суммы. Найдите ошибки.',
  code: `// stores/cart.ts
export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] as CartItem[] }),
  getters: {
    total: state => state.items.reduce((s, i) => s + i.price * i.qty, 0),
  },
})

// components/HeaderCart.vue
<script setup lang="ts">
const cart = useCartStore()
const { items, total } = cart

function addOne(item: CartItem) {
  cart.items.find(i => i.id === item.id)!.qty++
  localStorage.setItem('cart', JSON.stringify(cart.items))
}
</script>

// components/Checkout.vue
<script setup lang="ts">
const cart = useCartStore()
const total = ref(cart.total)
</script>`,
  issues: [
    'Деструктуризация стора теряет реактивность — нужен storeToRefs для state и getters',
    'Изменение состояния из компонента в обход actions — логику добавления нужно держать в action',
    'Синхронизация с localStorage размазана по компонентам — вынести в action/плагин/watch в сторе, и с учётом SSR',
    'ref(cart.total) копирует значение один раз — нужен computed или storeToRefs',
  ],
  solution: `// stores/cart.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const total = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))

  function increment(id: number) {
    const item = items.value.find(i => i.id === id)
    if (item) item.qty++
  }

  if (import.meta.client) {
    watch(items, v => localStorage.setItem('cart', JSON.stringify(v)), { deep: true })
  }
  return { items, total, increment }
})

// components/HeaderCart.vue
<script setup lang="ts">
const cart = useCartStore()
const { items, total } = storeToRefs(cart)  // state и getters
const { increment } = cart                   // actions можно деструктурировать как есть
</script>

// components/Checkout.vue
<script setup lang="ts">
const { total } = storeToRefs(useCartStore())
</script>`,
  notes: 'Стор — это reactive-объект, поэтому деструктуризация даёт снимок значений. `storeToRefs` превращает state и getters в refs, а функции пропускает. Изменения через actions дают одно место для логики, удобную отладку в DevTools и место для побочных эффектов вроде сохранения.',
},
{
  id: 'rv-ts-api', section: 'ts', kind: 'review', level: 'middle', lang: 'ts', title: 'Типизировать API-клиент',
  brief: 'any повсюду, ошибки ловятся только в рантайме.',
  desc: 'API-клиент проекта написан на `any`. Из-за этого опечатка в поле дошла до прода. Что не так и как это типизировать?',
  code: `async function api(url: string, options?: any): Promise<any> {
  const res = await fetch('/api' + url, options)
  return res.json()
}

async function loadUser(id: any) {
  const user = await api('/users/' + id)
  return user.fullname.toUpperCase() // поле на самом деле fullName
}

function handle(e: any) {
  console.log(e.message)
}

const status: string = 'pending'
if (status === 'fullfilled') { /* опечатка, TS молчит */ }`,
  issues: [
    'Promise<any> отключает проверки — нужен дженерик api<T>() и тип ответа',
    'Нет проверки res.ok — ошибки HTTP проглатываются',
    'id: any — должен быть number или string',
    'catch-ошибка как any — использовать unknown и сузить через instanceof Error',
    'status: string — заменить на union литералов, тогда опечатка станет ошибкой компиляции',
    'Данные с сервера не проверяются в рантайме — на границе нужна валидация (zod) или хотя бы type guard',
  ],
  solution: `type Status = 'pending' | 'fulfilled' | 'rejected'

interface User {
  id: number
  fullName: string
}

class ApiError extends Error {
  constructor(public status: number, message: string) { super(message) }
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch('/api' + url, init)
  if (!res.ok) throw new ApiError(res.status, res.statusText)
  return res.json() as Promise<T>
}

async function loadUser(id: number): Promise<string> {
  const user = await api<User>('/users/' + id)
  return user.fullName.toUpperCase() // опечатку подсветит компилятор
}

function handle(e: unknown) {
  if (e instanceof ApiError && e.status === 401) return logout()
  if (e instanceof Error) console.error(e.message)
}

const status: Status = 'pending'`,
  notes: '`unknown` вместо `any` заставляет сузить тип перед использованием. `as Promise<T>` — это доверие серверу, поэтому на границе с внешним миром лучше рантайм-валидация (zod-схема даёт и проверку, и тип через `z.infer`). Union литералов вместо `string` — самый дешёвый способ ловить опечатки.',
},
{
  id: 'rv-solid', section: 'arch', kind: 'review', level: 'middle+', lang: 'vue', title: 'Компонент, который делает всё',
  brief: 'Разобрать «божественный» компонент по SOLID.',
  desc: 'Компонент формы заказа на 400 строк. Ниже его суть. Какие принципы нарушены и как бы вы его разделили?',
  code: `<script setup lang="ts">
const form = reactive({ name: '', phone: '', delivery: 'courier', city: '' })
const errors = ref<Record<string, string>>({})

function validate() {
  errors.value = {}
  if (!form.name) errors.value.name = 'Введите имя'
  if (!/^\\+7\\d{10}$/.test(form.phone)) errors.value.phone = 'Неверный телефон'
  return !Object.keys(errors.value).length
}

function deliveryPrice() {
  if (form.delivery === 'courier') return form.city === 'Москва' ? 300 : 500
  if (form.delivery === 'pickup') return 0
  if (form.delivery === 'post') return 350
  // каждый новый способ — новый if здесь
}

async function submit() {
  if (!validate()) return
  const res = await fetch('https://api.shop.ru/orders', {
    method: 'POST',
    body: JSON.stringify({ ...form, price: deliveryPrice() }),
  })
  const data = await res.json()
  ym(12345, 'reachGoal', 'order')
  alert('Заказ ' + data.id + ' оформлен')
}
</script>`,
  issues: [
    'SRP: компонент одновременно валидирует, считает доставку, ходит в API, шлёт аналитику и показывает уведомления',
    'OCP: новый способ доставки требует правки цепочки if — нужна карта стратегий',
    'DIP: прямой fetch с захардкоженным URL и вызов ym — зависимость от деталей; нужен API-сервис и абстракция аналитики через inject/composable',
    'Валидацию вынести в переиспользуемый composable или схему',
    'alert вместо системы уведомлений и нет обработки ошибок запроса',
  ],
  solution: `// domain/delivery.ts — стратегии: новая доставка = новая запись, без правки кода
export const deliveryStrategies: Record<DeliveryType, (o: OrderForm) => number> = {
  courier: o => (o.city === 'Москва' ? 300 : 500),
  pickup: () => 0,
  post: () => 350,
}

// services/orders.ts — детали HTTP спрятаны за сервисом
export const ordersApi = {
  create: (payload: OrderPayload) => api<Order>('/orders', { method: 'POST', body: payload }),
}

// composables/useOrderForm.ts — состояние и валидация формы
export function useOrderForm() {
  const form = reactive<OrderForm>({ name: '', phone: '', delivery: 'courier', city: '' })
  const { errors, validate } = useValidation(form, orderSchema)
  const deliveryPrice = computed(() => deliveryStrategies[form.delivery](form))
  return { form, errors, validate, deliveryPrice }
}

// OrderForm.vue — только связывает части
<script setup lang="ts">
const { form, errors, validate, deliveryPrice } = useOrderForm()
const analytics = useAnalytics()   // абстракция, реализация через provide/plugin
const notify = useNotify()

async function submit() {
  if (!validate()) return
  try {
    const order = await ordersApi.create({ ...form, price: deliveryPrice.value })
    analytics.track('order')
    notify.success('Заказ ' + order.id + ' оформлен')
  } catch (e) {
    notify.error('Не удалось оформить заказ')
  }
}
</script>`,
  notes: 'Хороший ответ на собеседовании — не «разбить на 10 файлов», а объяснить, по какой оси меняется код: способы доставки, правила валидации, API, аналитика меняются независимо — значит, им место в разных модулях. Компонент остаётся тонким клеем.',
},
];
