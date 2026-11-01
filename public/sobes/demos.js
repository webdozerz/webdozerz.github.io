/* Interactive demos, keyed by topic id. Each gets an empty .demo holder and fills it. Vue demos load the real Vue runtime on demand. */
(() => {
const S = window.SOBES;
const { h, hl, codeBlock } = S;
const D = S.demos;

function frame(holder, title, note) {
  const body = h('div.demo__body');
  holder.append(h('div.demo__head', h('b', title)), body);
  if (note) body.append(h('p.demo__note', { html: note }));
  return body;
}
const seg = (items, active, onPick) => {
  const el = h('div.seg', items.map(([k, label]) => h('button', { type: 'button', 'aria-pressed': String(k === active), onclick: e => { [...el.children].forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); onPick(k); } }, label)));
  return el;
};
const logBox = () => { const el = h('div.log'); el.add = (text, cls) => { el.append(h('div' + (cls ? '.' + cls : ''), text)); el.scrollTop = el.scrollHeight; }; el.clear = () => { el.innerHTML = ''; }; return el; };
const pre = (code, lang = 'js') => h('pre', { style: { margin: 0 } }, h('code', { html: hl(code, lang) }));

/* ================= JS: event loop ================= */
const EL = [
  { name: 'Базовый порядок', code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`, out: ['1', '4', '3', '2'], steps: [
    [null, ['script'], [], [], [], 'Весь скрипт — первая макрозадача. Движок кладёт его в стек вызовов.'],
    [0, ['script', "log('1')"], [], [], ['1'], 'Синхронный console.log выполняется сразу.'],
    [1, ['script', 'setTimeout'], [], ['() => log(2)'], ['1'], 'setTimeout отдаёт колбэк таймеру браузера. Через 0 мс колбэк встаёт в очередь макрозадач — но выполнится не раньше, чем опустеет стек и микрозадачи.'],
    [2, ['script', '.then'], ['() => log(3)'], ['() => log(2)'], ['1'], 'Промис уже выполнен, поэтому колбэк then сразу встаёт в очередь микрозадач.'],
    [3, ['script', "log('4')"], ['() => log(3)'], ['() => log(2)'], ['1', '4'], 'Снова синхронный код.'],
    [null, [], ['() => log(3)'], ['() => log(2)'], ['1', '4'], 'Скрипт закончился, стек пуст. Event loop берёт ВСЕ микрозадачи до последней.'],
    [2, ['() => log(3)'], [], ['() => log(2)'], ['1', '4', '3'], 'Микрозадача выполнилась.'],
    [null, [], [], ['() => log(2)'], ['1', '4', '3'], 'Микрозадач больше нет. Тут браузер может отрисовать кадр. Затем берётся одна макрозадача.'],
    [1, ['() => log(2)'], [], [], ['1', '4', '3', '2'], 'Колбэк таймера выполнился. Итог: 1, 4, 3, 2.'],
  ] },
  { name: 'async / await', code: `async function a() {
  console.log('A1');
  await b();
  console.log('A2');
}
async function b() { console.log('B'); }
console.log('S');
setTimeout(() => console.log('T'), 0);
a();
Promise.resolve().then(() => console.log('P'));
console.log('E');`, out: ['S', 'A1', 'B', 'E', 'A2', 'P', 'T'], steps: [
    [null, ['script'], [], [], [], 'Объявления функций поднимаются, код начинает выполняться сверху.'],
    [6, ['script', "log('S')"], [], [], ['S'], 'Синхронный вывод.'],
    [7, ['script', 'setTimeout'], [], ['() => log(T)'], ['S'], 'Колбэк таймера — в макрозадачи.'],
    [1, ['script', 'a()', "log('A1')"], [], ['() => log(T)'], ['S', 'A1'], 'async-функция до первого await выполняется синхронно.'],
    [5, ['script', 'a()', 'b()'], [], ['() => log(T)'], ['S', 'A1', 'B'], 'b() тоже синхронна до конца: печатает B и возвращает выполненный промис.'],
    [2, ['script'], ['продолжение a()'], ['() => log(T)'], ['S', 'A1', 'B'], 'await ставит «остаток» функции a в микрозадачи и выходит из неё. Стек возвращается в script.'],
    [9, ['script', '.then'], ['продолжение a()', '() => log(P)'], ['() => log(T)'], ['S', 'A1', 'B'], 'then — тоже микрозадача, в очередь после продолжения a.'],
    [10, ['script', "log('E')"], ['продолжение a()', '() => log(P)'], ['() => log(T)'], ['S', 'A1', 'B', 'E'], 'Последняя синхронная строка.'],
    [3, ['продолжение a()'], ['() => log(P)'], ['() => log(T)'], ['S', 'A1', 'B', 'E', 'A2'], 'Стек пуст — выгребаем микрозадачи по порядку. Первым идёт продолжение после await.'],
    [9, ['() => log(P)'], [], ['() => log(T)'], ['S', 'A1', 'B', 'E', 'A2', 'P'], 'Затем then.'],
    [7, ['() => log(T)'], [], [], ['S', 'A1', 'B', 'E', 'A2', 'P', 'T'], 'Микрозадачи кончились — макрозадача таймера. Итог: S A1 B E A2 P T.'],
  ] },
  { name: 'Микрозадача в микрозадаче', code: `setTimeout(() => console.log('t1'), 0);
Promise.resolve().then(() => {
  console.log('p1');
  setTimeout(() => console.log('t2'), 0);
  Promise.resolve().then(() => console.log('p2'));
});
queueMicrotask(() => console.log('m'));
console.log('s');`, out: ['s', 'p1', 'm', 'p2', 't1', 't2'], steps: [
    [0, ['script', 'setTimeout'], [], ['t1'], [], 'Первый таймер — в макрозадачи.'],
    [1, ['script', '.then'], ['колбэк p1'], ['t1'], [], 'Колбэк then — в микрозадачи.'],
    [6, ['script', 'queueMicrotask'], ['колбэк p1', 'm'], ['t1'], [], 'queueMicrotask кладёт функцию прямо в очередь микрозадач.'],
    [7, ['script', "log('s')"], ['колбэк p1', 'm'], ['t1'], ['s'], 'Единственный синхронный вывод.'],
    [2, ['колбэк p1'], ['m'], ['t1'], ['s', 'p1'], 'Стек пуст — первая микрозадача.'],
    [3, ['колбэк p1', 'setTimeout'], ['m'], ['t1', 't2'], ['s', 'p1'], 'Новый таймер встаёт в конец макрозадач — после t1.'],
    [4, ['колбэк p1', '.then'], ['m', 'p2'], ['t1', 't2'], ['s', 'p1'], 'Новая микрозадача встаёт в конец текущей очереди микрозадач — и выполнится в этом же цикле, до любых таймеров.'],
    [6, ['m'], ['p2'], ['t1', 't2'], ['s', 'p1', 'm'], 'Очередь микрозадач выгребается до конца.'],
    [4, ['p2'], [], ['t1', 't2'], ['s', 'p1', 'm', 'p2'], 'Даже добавленная по ходу.'],
    [0, ['t1'], [], ['t2'], ['s', 'p1', 'm', 'p2', 't1'], 'Теперь макрозадачи — по одной, с проверкой микрозадач между ними.'],
    [3, ['t2'], [], [], ['s', 'p1', 'm', 'p2', 't1', 't2'], 'Итог: s p1 m p2 t1 t2. Бесконечная цепочка микрозадач заблокирует и таймеры, и отрисовку.'],
  ] },
];
D['js-event-loop'] = holder => {
  const body = frame(holder, 'Event loop по шагам', 'Сначала угадайте порядок вывода, потом пройдите выполнение по шагам. Слева код, справа — стек вызовов, очереди и консоль.');
  let sc = EL[0], step = -1, guess = [];
  const codeEl = h('div.code.el__code'); const boxes = h('div.el__boxes');
  const note = h('p.demo__note'); const guessRow = h('div.guess'); const guessOut = h('div.row');
  const prev = h('button.btn.btn--sm', { type: 'button', onclick: () => go(step - 1) }, '← Назад');
  const next = h('button.btn.btn--primary.btn--sm', { type: 'button', onclick: () => go(step + 1) }, 'Шаг →');
  const reset = h('button.btn.btn--ghost.btn--sm', { type: 'button', onclick: () => load(sc) }, 'Сначала');
  const box = (cls, title, items) => h('div.el__box.el__box--' + cls, h('h4', title), h('div.el__items', items.map(x => h('span.el__item', x))));
  function load(s) {
    sc = s; step = -1; guess = [];
    codeEl.innerHTML = ''; codeEl.append(h('pre', s.code.split('\n').map(l => h('span.el__line', { html: hl(l, 'js') || ' ' }))));
    guessRow.innerHTML = ''; guessOut.innerHTML = '';
    [...new Set(s.out)].sort().forEach(v => guessRow.append(h('button.btn.btn--sm', { type: 'button', onclick: e => { guess.push(v); e.currentTarget.disabled = true; renderGuess(); } }, v)));
    renderGuess(); go(-1);
  }
  function renderGuess() {
    guessOut.innerHTML = '';
    guessOut.append(h('span.small.muted', 'Ваш порядок:'), h('span.mono', guess.join(' ') || '—'));
    if (guess.length === sc.out.length) {
      const ok = guess.join() === sc.out.join();
      guessOut.append(h('span.chip.' + (ok ? 'chip--ok' : 'chip--bad'), ok ? 'верно' : 'правильно: ' + sc.out.join(' ')));
    }
    if (guess.length) guessOut.append(h('button.btn.btn--ghost.btn--sm', { type: 'button', onclick: () => { guess = []; [...guessRow.children].forEach(b => { b.disabled = false; }); renderGuess(); } }, 'Заново'));
  }
  function go(i) {
    step = Math.max(-1, Math.min(i, sc.steps.length - 1));
    const st = step >= 0 ? sc.steps[step] : [null, [], [], [], [], 'Нажмите «Шаг», чтобы начать выполнение.'];
    [...codeEl.querySelectorAll('.el__line')].forEach((l, j) => l.classList.toggle('is-active', j === st[0]));
    boxes.innerHTML = '';
    boxes.append(box('stack', 'Call stack', st[1]), box('micro', 'Микрозадачи', st[2]), box('macro', 'Макрозадачи', st[3]), box('out', 'Консоль', st[4]));
    note.innerHTML = '<b>' + (step + 1) + '/' + sc.steps.length + '.</b> ' + S.esc(st[5]);
    prev.disabled = step < 0; next.disabled = step >= sc.steps.length - 1;
  }
  body.append(seg(EL.map((s, i) => [i, s.name]), 0, i => load(EL[i])), h('div.stack', h('b.small', 'Угадайте порядок вывода — нажимайте значения по очереди'), guessRow, guessOut),
    h('div.el', codeEl, boxes), note, h('div.row', prev, next, reset));
  load(EL[0]);
};

/* ================= JS: promise combinators ================= */
D['js-promise-combinators'] = holder => {
  const body = frame(holder, 'Promise.all / race / allSettled / any', 'Три настоящих промиса. Задайте каждому время и исход, выберите комбинатор и запустите. Полоски показывают, когда промис завершился и когда завершился общий результат.');
  const ps = [{ ms: 800, ok: true }, { ms: 1500, ok: true }, { ms: 1100, ok: false }];
  let comb = 'all';
  const rows = h('div.lanes'); const result = logBox(); const run = h('button.btn.btn--primary.btn--sm', { type: 'button', onclick: start }, 'Запустить');
  const MAX = 2000;
  function draw() {
    rows.innerHTML = '';
    ps.forEach((p, i) => rows.append(h('div.lane', h('span', 'p' + (i + 1)), h('div.row', { style: { gap: '8px', flexWrap: 'nowrap' } },
      h('input', { type: 'range', min: 100, max: MAX, step: 100, value: p.ms, style: { flex: 1 }, oninput: e => { p.ms = +e.target.value; e.target.nextSibling.textContent = p.ms + ' мс'; } }), h('span.mono.small', { style: { width: '64px' } }, p.ms + ' мс'),
      h('button.btn.btn--sm.' + (p.ok ? 'btn--ok' : 'btn--bad'), { type: 'button', onclick: () => { p.ok = !p.ok; draw(); } }, p.ok ? 'resolve' : 'reject')))));
    rows.append(h('div.lane', h('span', 'итог'), h('div.lane__track', { id: 'pcTrack' })));
  }
  const tracks = [];
  function start() {
    run.disabled = true; result.clear();
    const t0 = performance.now();
    const track = rows.querySelector('#pcTrack'); track.innerHTML = '';
    const mark = (ms, color, label) => track.append(h('i', { title: label, style: { left: (ms / MAX * 100) + '%', background: color } }));
    const proms = ps.map((p, i) => new Promise((res, rej) => setTimeout(() => {
      const ms = Math.round(performance.now() - t0);
      mark(ms, p.ok ? 'var(--ok)' : 'var(--bad)', 'p' + (i + 1));
      result.add(ms + ' мс: p' + (i + 1) + (p.ok ? ' выполнен → "p' + (i + 1) + '"' : ' отклонён → Error(p' + (i + 1) + ')'), p.ok ? 'l-mute' : 'l-mute');
      p.ok ? res('p' + (i + 1)) : rej(new Error('p' + (i + 1)));
    }, p.ms)));
    const fin = (ok, v) => { const ms = Math.round(performance.now() - t0); track.append(h('i', { style: { left: (ms / MAX * 100) + '%', width: '6px', background: 'var(--ink)' } })); result.add(ms + ' мс: Promise.' + comb + ' → ' + (ok ? 'resolve ' : 'reject ') + v, ok ? 'l-ok' : 'l-bad'); };
    const fmtV = v => JSON.stringify(v, (k, x) => x instanceof Error ? 'Error(' + x.message + ')' : x);
    Promise[comb](proms).then(v => fin(true, fmtV(v)), e => fin(false, e instanceof AggregateError ? 'AggregateError (все отклонены)' : 'Error(' + e.message + ')'));
    Promise.allSettled(proms).then(() => setTimeout(() => { run.disabled = false; }, 50));
  }
  const explain = h('p.demo__note');
  const EX = { all: '<b>all</b> ждёт все и отдаёт массив результатов по порядку. Первый же reject сразу отклоняет общий промис — остальные продолжают работать, но их результат уже никому не нужен.', race: '<b>race</b> завершается вместе с первым завершившимся промисом — неважно, успехом или ошибкой. Классика — таймаут запроса.', allSettled: '<b>allSettled</b> никогда не отклоняется: ждёт всех и отдаёт массив {status, value | reason}. Нужен, когда частичный успех — норма.', any: '<b>any</b> ждёт первый успешный. Отклоняется AggregateError, только если упали все. Например, самый быстрый из зеркал.' };
  body.append(seg([['all', 'all'], ['race', 'race'], ['allSettled', 'allSettled'], ['any', 'any']], comb, k => { comb = k; explain.innerHTML = EX[k]; }), explain, rows, h('div.row', run), result);
  explain.innerHTML = EX[comb];
  draw();
};

/* ================= JS: closures ================= */
D['js-closures'] = holder => {
  const body = frame(holder, 'Замыкание своими руками', 'Каждый вызов <code>makeCounter()</code> создаёт новое лексическое окружение. Функции-счётчики держат ссылку на своё окружение, поэтому <code>count</code> у каждого свой и снаружи недоступен.');
  const list = h('div.stack');
  let n = 0;
  body.append(codeBlock(`function makeCounter() {
  let count = 0;            // живёт в окружении вызова
  return () => ++count;     // функция помнит это окружение
}`, 'js'), h('div.row', h('button.btn.btn--primary.btn--sm', { type: 'button', onclick: add }, '+ const counter = makeCounter()')), list);
  function add() {
    if (n >= 4) return;
    const name = 'counter' + (++n);
    const counter = (() => { let count = 0; return () => ++count; })();
    const val = h('b.mono', '0');
    list.append(h('div.row', { style: { padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '10px' } },
      h('span.mono', name + '()'), h('button.btn.btn--sm', { type: 'button', onclick: () => { val.textContent = counter(); } }, 'вызвать'),
      h('span.small.muted', 'окружение: { count: '), val, h('span.small.muted', ' }')));
  }
  add(); add();
  const out = logBox();
  const runLoop = kind => {
    out.clear();
    const fns = [];
    if (kind === 'var') { for (var i = 0; i < 3; i++) fns.push(() => i); } else { for (let j = 0; j < 3; j++) fns.push(() => j); }
    out.add('результаты: ' + fns.map(f => f()).join(', '), kind === 'var' ? 'l-bad' : 'l-ok');
    out.add(kind === 'var' ? 'var — одна переменная на весь цикл. Все три функции замкнули её, а к моменту вызова там уже 3.' : 'let создаёт новую переменную на каждой итерации — у каждой функции своё значение.', 'l-mute');
  };
  body.append(h('b.small', 'Классика собеседования: замыкание в цикле'), codeBlock(`const fns = [];
for (var i = 0; i < 3; i++) fns.push(() => i);
fns.map(f => f()); // ?`, 'js'), h('div.row', h('button.btn.btn--sm', { type: 'button', onclick: () => runLoop('var') }, 'Запустить с var'), h('button.btn.btn--sm', { type: 'button', onclick: () => runLoop('let') }, 'Запустить с let')), out);
};

/* ================= JS: this ================= */
D['js-this'] = holder => {
  const body = frame(holder, 'Чему равен this', 'Код ниже выполняется по-настоящему (в строгом режиме, как в модулях). this определяется не местом объявления, а способом вызова — кроме стрелок.');
  const CASES = [
    ['user.greet()', 'Вызов через точку: this — объект слева от точки.', 'неявная привязка'],
    ['const f = user.greet; f()', 'Метод «оторвали» от объекта. Вызов без точки → this undefined (в нестрогом режиме был бы window).', 'потеря контекста'],
    ["user.greet.call({ name: 'Гость' })", 'call/apply задают this явно.', 'явная привязка'],
    ['user.greet.bind(admin)()', 'bind возвращает новую функцию с намертво прибитым this.', 'жёсткая привязка'],
    ['new User()', 'new создаёт новый объект и делает его this.', 'new'],
    ['user.arrow()', 'Стрелка не имеет своего this и берёт его из места объявления — здесь это модуль, где this undefined.', 'стрелка'],
    ['user.later()', 'Колбэк-стрелка внутри метода берёт this метода — поэтому стрелки удобны в setTimeout и обработчиках.', 'стрелка внутри метода'],
    ['setTimeout(user.greet)', 'Метод передан как колбэк — он вызывается без точки, this теряется. Классический баг.', 'потеря контекста'],
  ];
  const src = `'use strict';
const admin = { name: 'Админ' };
const user = {
  name: 'Илья',
  greet() { return this?.name; },
  arrow: () => this?.name,
  later() { return (() => this.name)(); },
};
function User() { this.name = 'новый'; }`;
  const out = logBox();
  const run = (expr, why, rule) => {
    let r;
    try {
      // eslint-disable-next-line no-new-func
      r = new Function(src.replace('this?.name; },\n  arrow', 'this?.name; },\n  arrow') + `
        const cb = f => f();
        return (() => { ${expr.startsWith('setTimeout') ? 'return cb(user.greet)' : expr.startsWith('new') ? 'return new User().name' : expr.includes(';') ? expr.replace(/; (.*)$/, '; return $1') : 'return ' + expr} })();`).call(undefined);
    } catch (e) { r = 'TypeError: ' + e.message; }
    out.clear(); out.add(expr + '  →  ' + (r === undefined ? 'undefined' : JSON.stringify(r)), r === undefined || String(r).startsWith('TypeError') ? 'l-bad' : 'l-ok'); out.add(rule + ': ' + why, 'l-mute');
  };
  body.append(codeBlock(src, 'js'), h('div.row', CASES.map(c => h('button.btn.btn--sm.mono', { type: 'button', onclick: () => run(...c) }, c[0]))), out);
  run(...CASES[0]);
};

/* ================= JS: coercion ================= */
D['js-coercion'] = holder => {
  const body = frame(holder, 'Песочница приведения типов', 'Сначала предскажите результат, потом нажмите. Можно ввести своё выражение — оно вычисляется в браузере.');
  const EX = [
    ["'5' + 2", '+ со строкой — конкатенация: 2 приводится к "2".'],
    ["'5' - 2", '- работает только с числами: "5" → 5.'],
    ['[] + []', 'Массивы → примитив через toString: "" + "" = "".'],
    ['[] + {}', '[] → "", {} → "[object Object]".'],
    ['true + 1', 'true → 1.'],
    ['null + 1', 'null → 0.'],
    ['undefined + 1', 'undefined → NaN.'],
    ['null == 0', 'null при == равен только undefined (и себе). Сравнения через == для null — особое правило.'],
    ['null >= 0', 'А >= приводит к числу: 0 >= 0. Отсюда парадокс с предыдущим.'],
    ['NaN === NaN', 'NaN не равен ничему, даже себе. Проверка — Number.isNaN.'],
    ['[] == ![]', '![] → false → 0; [] → "" → 0. 0 == 0.'],
    ["'b' + 'a' + +'a' + 'a'", "+'a' → NaN, затем конкатенация: baNaNa."],
    ['0.1 + 0.2 === 0.3', 'Двоичная плавающая точка: 0.30000000000000004.'],
    ['typeof null', 'Историческая ошибка: null — примитив, но typeof даёт "object".'],
  ];
  const out = logBox();
  const evalExpr = (e, why) => { let r; try { r = new Function('return (' + e + ')')(); } catch (err) { r = err.name + ': ' + err.message; } out.clear(); out.add(e + '  →  ' + (typeof r === 'string' ? JSON.stringify(r) : String(r)) + '   (' + typeof r + ')', 'l-ok'); if (why) out.add(why, 'l-mute'); };
  const inp = h('input.input.mono', { placeholder: "своё выражение, например '10' / '2'", onkeydown: e => { if (e.key === 'Enter') evalExpr(inp.value); } });
  body.append(h('div.row', EX.map(([e, why]) => h('button.btn.btn--sm.mono', { type: 'button', onclick: () => evalExpr(e, why) }, e))), h('div.row', { style: { flexWrap: 'nowrap' } }, inp, h('button.btn.btn--sm', { type: 'button', onclick: () => evalExpr(inp.value) }, 'Вычислить')), out);
};

/* ================= JS: prototypes ================= */
D['js-prototypes'] = holder => {
  const body = frame(holder, 'Поиск свойства по цепочке прототипов', 'Выберите, что прочитать у <code>rex</code>. Движок смотрит в сам объект, потом идёт по ссылкам [[Prototype]] вверх, пока не найдёт свойство или не упрётся в null.');
  const nodes = [
    { name: 'rex', sub: 'сам объект', props: ['name: "Рекс"'] },
    { name: 'Dog.prototype', sub: 'class Dog extends Animal', props: ['bark()', 'constructor: Dog'] },
    { name: 'Animal.prototype', sub: 'class Animal', props: ['eat()', 'speak()', 'constructor: Animal'] },
    { name: 'Object.prototype', sub: 'вершина цепочки', props: ['toString()', 'hasOwnProperty()'] },
  ];
  const chain = h('div.chain');
  const els = nodes.map((n, i) => { const el = h('div.chain__node', h('b', n.name), h('span.small.muted', n.sub), n.props.map(p => h('span', p))); chain.append(el); if (i < nodes.length - 1) chain.append(h('span.chain__arrow', '→')); return el; });
  chain.append(h('span.chain__arrow', '→ null'));
  const note = h('p.demo__note');
  const LOOK = { name: 0, bark: 1, eat: 2, toString: 3, fly: -1 };
  let timer;
  const look = key => {
    clearTimeout(timer); els.forEach(e => e.classList.remove('is-look', 'is-found'));
    const target = LOOK[key]; let i = 0;
    const tick = () => {
      els.forEach(e => e.classList.remove('is-look'));
      if (i === target) { els[i].classList.add('is-found'); note.innerHTML = '<code>rex.' + key + '</code> найдено в <b>' + nodes[i].name + '</b> за ' + (i + 1) + ' ' + (i ? 'шага' : 'шаг') + '.'; return; }
      if (i >= els.length) { note.innerHTML = '<code>rex.' + key + '</code> → <b>undefined</b>: цепочка закончилась на null. Ошибки нет — просто нет такого свойства.'; return; }
      els[i].classList.add('is-look'); note.textContent = 'Ищу «' + key + '» в ' + nodes[i].name + '…'; i++; timer = setTimeout(tick, 550);
    };
    tick();
  };
  body.append(codeBlock(`class Animal { eat() {} speak() {} }
class Dog extends Animal { bark() {} }
const rex = new Dog(); rex.name = 'Рекс';
Object.getPrototypeOf(rex) === Dog.prototype; // true`, 'js'),
  h('div.row', Object.keys(LOOK).map(k => h('button.btn.btn--sm.mono', { type: 'button', onclick: () => look(k) }, 'rex.' + k))), chain, note);
};

/* ================= JS: copy ================= */
D['js-copy'] = holder => {
  const body = frame(holder, 'Копия или та же ссылка', 'Выберите способ копирования, затем измените поле в копии. Смотрите, что произойдёт с оригиналом. Объекты настоящие.');
  const methods = {
    assign: ['const copy = original', o => o],
    spread: ['const copy = { ...original }', o => ({ ...o })],
    json: ['const copy = JSON.parse(JSON.stringify(original))', o => JSON.parse(JSON.stringify(o))],
    sc: ['const copy = structuredClone(original)', o => structuredClone(o)],
  };
  let m = 'spread', original, copy;
  const make = () => ({ name: 'Заказ', created: new Date(2026, 0, 15), items: [{ title: 'Чай', qty: 1 }] });
  const view = h('div.grid.grid--2'); const out = logBox();
  const show = obj => h('pre.tree', JSON.stringify(obj, (k, v) => v instanceof Date ? 'Date(' + v.toISOString().slice(0, 10) + ')' : v, 2).replace(/"Date\((.*?)\)"/g, 'Date($1)'));
  const createdType = o => o.created instanceof Date ? 'Date' : typeof o.created;
  function reset() { original = make(); copy = methods[m][1](original); out.clear(); out.add(methods[m][0], 'l-mute'); out.add('copy === original → ' + (copy === original) + ';  copy.items === original.items → ' + (copy.items === original.items) + ';  copy.created: ' + createdType(copy)); draw(); }
  function draw() { view.innerHTML = ''; view.append(h('div.preview', h('b.small', 'original'), show(original)), h('div.preview', h('b.small', 'copy'), show(copy))); }
  const act = (label, fn) => h('button.btn.btn--sm.mono', { type: 'button', onclick: () => { fn(); out.add(label + ' → original ' + (JSON.stringify(original) === JSON.stringify(make()) ? 'не изменился' : 'ИЗМЕНИЛСЯ'), JSON.stringify(original) === JSON.stringify(make()) ? 'l-ok' : 'l-bad'); draw(); } }, label);
  body.append(seg([['assign', '='], ['spread', 'spread'], ['json', 'JSON'], ['sc', 'structuredClone']], m, k => { m = k; reset(); }),
    h('div.row', act("copy.name = 'Копия'", () => { copy.name = 'Копия'; }), act('copy.items[0].qty = 99', () => { copy.items[0].qty = 99; }), h('button.btn.btn--ghost.btn--sm', { type: 'button', onclick: reset }, 'Сбросить')), view, out);
  reset();
};

/* ================= JS: debounce / throttle ================= */
D['js-debounce-throttle'] = holder => {
  const body = frame(holder, 'Сырые события, debounce и throttle', 'Водите мышью по полю (или касайтесь). Каждая метка — вызов. Debounce срабатывает после паузы, throttle — не чаще раза в интервал.');
  let ms = 300;
  const area = h('div', { style: { height: '90px', borderRadius: '10px', border: '1px dashed var(--line-2)', display: 'grid', placeItems: 'center', color: 'var(--muted)', touchAction: 'none', userSelect: 'none' } }, 'водите здесь');
  const lanes = { raw: h('div.lane__track'), deb: h('div.lane__track'), thr: h('div.lane__track') };
  const counts = { raw: h('b'), deb: h('b'), thr: h('b') };
  const n = { raw: 0, deb: 0, thr: 0 };
  const WINDOW = 4000; let t0 = 0;
  const mark = (k, color) => {
    if (!t0) t0 = performance.now();
    const x = ((performance.now() - t0) % WINDOW) / WINDOW * 100;
    if (x < 1) Object.values(lanes).forEach(l => { l.innerHTML = ''; });
    lanes[k].append(h('i', { style: { left: x + '%', background: color } }));
    counts[k].textContent = ++n[k];
  };
  let dt = null, last = 0, trail = null;
  const onMove = () => {
    mark('raw', 'var(--faint)');
    clearTimeout(dt); dt = setTimeout(() => mark('deb', 'var(--ok)'), ms);
    const now = performance.now();
    if (now - last >= ms) { last = now; mark('thr', 'var(--c-web)'); } else if (!trail) trail = setTimeout(() => { trail = null; last = performance.now(); mark('thr', 'var(--c-web)'); }, ms - (now - last));
  };
  area.addEventListener('pointermove', onMove);
  const lane = (k, label) => h('div.lane', h('span', label, ' · ', counts[k]), lanes[k]);
  const val = h('span.mono.small', ms + ' мс');
  body.append(h('div.row', h('span.small.muted', 'Задержка'), h('input', { type: 'range', min: 100, max: 1000, step: 50, value: ms, oninput: e => { ms = +e.target.value; val.textContent = ms + ' мс'; } }), val,
    h('button.btn.btn--ghost.btn--sm', { type: 'button', onclick: () => { Object.values(lanes).forEach(l => { l.innerHTML = ''; }); Object.keys(n).forEach(k => { n[k] = 0; counts[k].textContent = 0; }); t0 = 0; } }, 'Очистить')),
  area, h('div.lanes', lane('raw', 'события'), lane('deb', 'debounce'), lane('thr', 'throttle')),
  h('p.demo__note', { html: '<b>Debounce</b> — для поиска по вводу и ресайза: важен итог после паузы. <b>Throttle</b> — для скролла, mousemove, бесконечной ленты: нужны регулярные обновления, но не на каждый пиксель.' }));
};

/* ================= JS: hoisting ================= */
D['js-hoisting'] = holder => {
  const body = frame(holder, 'Как код видит движок', 'Переключайте вид. Объявления «поднимаются» на этапе создания контекста: var — со значением undefined, function — целиком, let/const/class — без инициализации (TDZ).');
  const SRC = `console.log(a);
console.log(sum(2, 3));
console.log(b);

var a = 1;
let b = 2;
function sum(x, y) { return x + y; }`;
  const ENGINE = `// фаза создания контекста:
var a = undefined;           // var: создана и инициализирована
let b; /* <TDZ> */           // let: создана, но не инициализирована
function sum(x, y) { return x + y; } // function: целиком

// фаза выполнения:
console.log(a);              // undefined
console.log(sum(2, 3));      // 5
console.log(b);              // ReferenceError: Cannot access 'b' before initialization
a = 1;
b = 2;`;
  const holderCode = h('div');
  const show = k => { holderCode.innerHTML = ''; holderCode.append(codeBlock(k === 'src' ? SRC : ENGINE, 'js', k === 'src' ? 'Как написано' : 'Как выполняется')); };
  body.append(seg([['src', 'Как написано'], ['engine', 'Как видит движок']], 'src', show), holderCode);
  show('src');
};

/* ================= Web: bubbling / capturing ================= */
D['web-events'] = holder => {
  const body = frame(holder, 'Погружение и всплытие', 'Кликните по внутреннему блоку. Событие сначала идёт сверху вниз (capture), достигает цели, потом всплывает (bubble). Обработчики настоящие.');
  const opts = { capture: true, stop: false, delegate: false };
  const log = logBox();
  const inner = h('div.nest', { style: { minHeight: '50px', width: '60%' } }, h('span', 'button'));
  const middle = h('div.nest', { style: { width: '100%' } }, h('span', 'div.card'), inner);
  const outer = h('div.nest', h('span', 'section'), middle);
  const els = [['section', outer], ['div.card', middle], ['button', inner]];
  const flash = el => { el.classList.add('is-hit'); setTimeout(() => el.classList.remove('is-hit'), 450); };
  let queue = 0;
  const delayFlash = el => { const d = queue++ * 220; setTimeout(() => flash(el), d); };
  els.forEach(([name, el]) => {
    el.addEventListener('click', e => { if (!opts.capture) return; log.add('capture  ↓ ' + name, 'l-mute'); delayFlash(el); }, true);
    el.addEventListener('click', e => {
      log.add((e.eventPhase === 2 ? 'target   ● ' : 'bubble   ↑ ') + name, e.eventPhase === 2 ? 'l-warn' : 'l-ok'); delayFlash(el);
      if (opts.stop && name === 'div.card') { e.stopPropagation(); log.add('stopPropagation() на div.card — дальше не всплывает', 'l-bad'); }
    });
  });
  outer.addEventListener('mousedown', () => { log.clear(); queue = 0; });
  const toggle = (k, label) => h('label.check', h('input', { type: 'checkbox', checked: opts[k], onchange: e => { opts[k] = e.target.checked; } }), h('span', label));
  body.append(h('div.grid.grid--2', toggle('capture', 'Слушать фазу capture (третий аргумент true)'), toggle('stop', 'Вызвать stopPropagation() на div.card')), outer, log,
    h('p.demo__note', { html: 'Подсказка: кликните по div.card мимо кнопки — целью станет он, и кнопка вообще не участвует. <code>event.target</code> — где кликнули, <code>event.currentTarget</code> — чей обработчик сейчас работает.' }));
};

/* ================= Web: delegation ================= */
D['web-delegation'] = holder => {
  const body = frame(holder, 'Один обработчик на весь список', 'Обработчик висит только на <code>ul</code>. Клик по любому пункту всплывает к нему, а <code>event.target.closest()</code> находит, по какой кнопке кликнули. Новые пункты работают без новых подписок.');
  const log = logBox();
  let id = 3;
  const ul = h('ul', { style: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '6px' } });
  const item = (n, t) => h('li', { 'data-id': n, style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '8px' } }, h('span', { style: { flex: 1 } }, t), h('button.btn.btn--sm', { type: 'button', 'data-action': 'done' }, 'Готово'), h('button.btn.btn--sm.btn--bad', { type: 'button', 'data-action': 'delete' }, 'Удалить'));
  ul.append(item(1, 'Сверстать шапку'), item(2, 'Подключить API'), item(3, 'Написать тесты'));
  ul.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn || !ul.contains(btn)) return;
    const li = btn.closest('li');
    log.add('ul получил клик: target=' + e.target.tagName.toLowerCase() + ', action=' + btn.dataset.action + ', id=' + li.dataset.id, 'l-ok');
    if (btn.dataset.action === 'delete') li.remove(); else li.firstChild.style.textDecoration = 'line-through';
  });
  const count = h('b');
  const upd = () => { count.textContent = '1 обработчик на ' + ul.children.length + ' ' + (ul.children.length === 1 ? 'пункт' : 'пунктов'); };
  new MutationObserver(upd).observe(ul, { childList: true }); upd();
  body.append(h('div.row', h('button.btn.btn--primary.btn--sm', { type: 'button', onclick: () => ul.append(item(++id, 'Новая задача ' + id)) }, '+ Добавить пункт'), count), ul, log,
    codeBlock(`list.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = btn.closest('li').dataset.id;
  actions[btn.dataset.action](id);
});`, 'js'));
};

/* ================= Web: reflow / repaint ================= */
D['web-reflow'] = holder => {
  const body = frame(holder, 'Layout thrashing вживую', 'Меняем ширину 300 блоков. В плохом варианте чтение <code>offsetWidth</code> чередуется с записью стиля — браузер вынужден пересчитывать раскладку на каждой итерации. В хорошем — сначала все чтения, потом все записи.');
  const box = h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '2px', maxHeight: '90px', overflow: 'hidden' } });
  const items = Array.from({ length: 300 }, () => h('i', { style: { display: 'block', height: '8px', width: '20px', background: 'var(--surface-3)', borderRadius: '2px' } }));
  box.append(...items);
  const log = logBox();
  const run = bad => {
    items.forEach(i => { i.style.width = '20px'; }); box.offsetWidth;
    const t = performance.now();
    for (let r = 0; r < 5; r++) {
      if (bad) items.forEach(i => { i.style.width = (i.offsetWidth % 30 + 10) + 'px'; });
      else { const ws = items.map(i => i.offsetWidth); items.forEach((i, k) => { i.style.width = (ws[k] % 30 + 10) + 'px'; }); }
    }
    box.offsetWidth;
    log.add((bad ? 'чтение/запись вперемешку: ' : 'сначала чтение, потом запись: ') + (performance.now() - t).toFixed(1) + ' мс', bad ? 'l-bad' : 'l-ok');
  };
  body.append(h('div.row', h('button.btn.btn--sm.btn--bad', { type: 'button', onclick: () => run(true) }, 'Плохо: read/write в цикле'), h('button.btn.btn--sm.btn--ok', { type: 'button', onclick: () => run(false) }, 'Хорошо: батч чтений')), box, log,
    h('p.demo__note', { html: 'Reflow (layout) — пересчёт геометрии, дорогой. Repaint — перерисовка пикселей без смены геометрии, дешевле. <code>transform</code> и <code>opacity</code> обычно не вызывают ни того, ни другого — только композитинг.' }));
};

/* ================= Vue demos on real Vue ================= */
let vuePromise = null;
const loadVue = () => vuePromise || (vuePromise = new Promise((res, rej) => {
  if (window.Vue) return res(window.Vue);
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js';
  s.onload = () => res(window.Vue); s.onerror = () => { vuePromise = null; rej(new Error('не загрузился Vue с CDN')); };
  document.head.append(s);
}));
function vueDemo(id, title, note, make) {
  D[id] = holder => {
    const body = frame(holder, title, note);
    const mount = h('div.vue-mount', h('p.small.muted', 'Загружаю Vue…'));
    body.append(mount);
    loadVue().then(Vue => {
      mount.innerHTML = '';
      const host = h('div'); mount.append(host);
      const app = Vue.createApp(make(Vue, body));
      app.mount(host);
      /* unmount when the topic is left */
      const obs = new MutationObserver(() => { if (!document.body.contains(holder)) { app.unmount(); obs.disconnect(); } });
      obs.observe(document.getElementById('view'), { childList: true });
    }).catch(e => { mount.innerHTML = ''; mount.append(h('p.small.muted', e.message)); });
  };
}
const vlog = Vue => { const items = Vue.ref([]); return { items, add: (t, c) => { items.value.push({ t, c, k: Math.random() }); if (items.value.length > 40) items.value.shift(); }, clear: () => { items.value = []; } }; };
const LOG_TPL = `<div class="log"><div v-for="l in log.items.value" :key="l.k" :class="l.c">{{ l.t }}</div></div>`;

vueDemo('vue-ref-reactive', 'Где теряется реактивность', 'Это настоящий Vue 3. Каждая кнопка меняет состояние своим способом. Счётчик рендеров показывает, увидел ли Vue изменение.', Vue => ({
  setup() {
    const { reactive, ref, toRefs } = Vue;
    const state = reactive({ count: 0 });
    const r = ref(0);
    let { count } = state;                 // копия числа
    const { count: countRef } = toRefs(state);
    let renders = 0;                       // не реактивный: иначе сам счётчик вызывал бы рендер
    const log = vlog(Vue);
    return {
      state, r, log,
      renderCount: () => ++renders,
      viaProxy() { state.count++; log.add('state.count++ → прокси перехватил set, рендер', 'l-ok'); },
      viaRef() { r.value++; log.add('r.value++ → ref перехватил set, рендер', 'l-ok'); },
      viaDestructured() { count++; log.add('count++ после let { count } = state → изменили локальную копию (' + count + '), Vue ничего не знает', 'l-bad'); },
      viaToRefs() { countRef.value++; log.add('toRefs(state).count.value++ → ref связан со свойством, рендер', 'l-ok'); },
      replace() { Object.assign(state, { count: 0 }); r.value = 0; log.add('сброс', 'l-mute'); },
    };
  },
  template: `<div class="stack">
    <div class="grid grid--3">
      <div class="card stat"><b>{{ state.count }}</b><span>state.count (reactive)</span></div>
      <div class="card stat"><b>{{ r }}</b><span>r (ref)</span></div>
      <div class="card stat"><b>{{ renderCount() }}</b><span>рендеров компонента</span></div>
    </div>
    <div class="row">
      <button class="btn btn--sm btn--ok" @click="viaProxy">state.count++</button>
      <button class="btn btn--sm btn--ok" @click="viaRef">r.value++</button>
      <button class="btn btn--sm btn--bad" @click="viaDestructured">count++ (деструктуризация)</button>
      <button class="btn btn--sm btn--ok" @click="viaToRefs">toRefs → count.value++</button>
      <button class="btn btn--ghost btn--sm" @click="replace">Сбросить</button>
    </div>
    ${LOG_TPL}
  </div>`,
}));

vueDemo('vue-computed-watch', 'computed кешируется, метод — нет', 'Меняйте имя и нажимайте «лишний» счётчик. computed пересчитывается, только когда меняются его зависимости. Метод в шаблоне вызывается на каждом рендере. watch реагирует на изменение и получает старое и новое значение.', (Vue, body) => {
  /* обычный DOM-лог: запись в реактивный лог во время рендера сама вызвала бы новый рендер */
  const log = logBox();
  queueMicrotask(() => body.append(log));
  return {
    setup() {
      const { ref, computed, watch } = Vue;
      const first = ref('Илья'), last = ref('Андрюшов'), other = ref(0);
      let cN = 0, mN = 0;
      const full = computed(() => { cN++; log.add('computed пересчитан (#' + cN + ')', 'l-ok'); return first.value + ' ' + last.value; });
      const fullMethod = () => { mN++; log.add('метод вызван (#' + mN + ')', 'l-warn'); return first.value + ' ' + last.value; };
      watch(full, (n, o) => log.add('watch: "' + o + '" → "' + n + '"', 'l-mute'));
      return { first, last, other, full, fullMethod, clear: () => log.clear() };
    },
    template: `<div class="stack">
      <div class="row"><input v-model="first" placeholder="Имя"><input v-model="last" placeholder="Фамилия"><button class="btn btn--sm" @click="other++">Лишний счётчик: {{ other }}</button><button class="btn btn--ghost btn--sm" @click="clear">Очистить лог</button></div>
      <dl class="kv"><dt>computed</dt><dd>{{ full }}</dd><dt>метод</dt><dd>{{ fullMethod() }}</dd></dl>
    </div>`,
  };
});

vueDemo('vue-lifecycle', 'Хуки жизненного цикла', 'Монтируйте, обновляйте и уничтожайте дочерний компонент. Порядок хуков пишется в лог по-настоящему. Обратите внимание: при монтировании родитель и ребёнок — onMounted ребёнка срабатывает раньше родительского.', Vue => {
  const { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, defineComponent, h: vh } = Vue;
  const log = vlog(Vue);
  const Child = defineComponent({
    props: { n: Number },
    setup(props) {
      log.add('child: setup()', 'l-mute');
      onBeforeMount(() => log.add('child: onBeforeMount — DOM ещё нет'));
      onMounted(() => log.add('child: onMounted — DOM готов, можно ходить в API и к $el', 'l-ok'));
      onBeforeUpdate(() => log.add('child: onBeforeUpdate'));
      onUpdated(() => log.add('child: onUpdated — DOM обновлён', 'l-ok'));
      onBeforeUnmount(() => log.add('child: onBeforeUnmount — снимаем слушатели, таймеры', 'l-warn'));
      onUnmounted(() => log.add('child: onUnmounted', 'l-warn'));
      return () => vh('div', { class: 'preview' }, 'Дочерний компонент, проп n = ' + props.n);
    },
  });
  return {
    components: { Child },
    setup() { const show = ref(false), n = ref(1); return { show, n, log }; },
    template: `<div class="stack">
      <div class="row"><button class="btn btn--sm btn--primary" @click="show = !show">{{ show ? 'Размонтировать' : 'Смонтировать' }}</button><button class="btn btn--sm" :disabled="!show" @click="n++">Изменить проп</button><button class="btn btn--ghost btn--sm" @click="log.clear()">Очистить</button></div>
      <Child v-if="show" :n="n" />
      ${LOG_TPL}
      <p class="demo__note">На сервере (SSR) выполняются только setup и onServerPrefetch — onMounted и всё, что после, только в браузере.</p>
    </div>`,
  };
});

vueDemo('vue-vdom', 'Зачем нужен :key', 'Впишите что-нибудь в поля и удалите первую задачу. Слева key = индекс, справа key = id. Vue сравнивает виртуальные узлы по ключу: с индексом он думает, что удалился последний элемент, и переиспользует DOM — введённый текст «уезжает» к соседу.', Vue => ({
  setup() {
    const { ref } = Vue;
    const mk = () => [{ id: 1, t: 'Купить чай' }, { id: 2, t: 'Позвонить' }, { id: 3, t: 'Код-ревью' }];
    const a = ref(mk()), b = ref(mk());
    return { a, b, del: () => { a.value.shift(); b.value.shift(); }, reset: () => { a.value = mk(); b.value = mk(); } };
  },
  template: `<div class="stack">
    <div class="row"><button class="btn btn--sm btn--bad" @click="del">Удалить первую</button><button class="btn btn--ghost btn--sm" @click="reset">Вернуть</button></div>
    <div class="grid grid--2">
      <div class="stack"><b class="small">:key="index"</b><div v-for="(x, i) in a" :key="i" class="row"><span style="width:110px">{{ x.t }}</span><input placeholder="заметка"></div></div>
      <div class="stack"><b class="small">:key="item.id"</b><div v-for="x in b" :key="x.id" class="row"><span style="width:110px">{{ x.t }}</span><input placeholder="заметка"></div></div>
    </div>
  </div>`,
}));

vueDemo('vue-keepalive', 'KeepAlive сохраняет состояние', 'Введите текст в форму, переключите вкладку и вернитесь. Без KeepAlive компонент уничтожается и создаётся заново, с KeepAlive — кешируется (onDeactivated / onActivated вместо unmount/mount).', Vue => {
  const { ref, defineComponent, onMounted, onUnmounted, onActivated, onDeactivated, markRaw } = Vue;
  const log = vlog(Vue);
  const tab = name => defineComponent({
    setup() {
      const text = ref('');
      onMounted(() => log.add(name + ': mounted', 'l-ok')); onUnmounted(() => log.add(name + ': unmounted', 'l-bad'));
      onActivated(() => log.add(name + ': activated', 'l-ok')); onDeactivated(() => log.add(name + ': deactivated', 'l-warn'));
      return { text, name };
    },
    template: `<div class="preview stack"><b>{{ name }}</b><input v-model="text" placeholder="введите что-нибудь"></div>`,
  });
  const tabs = { Профиль: markRaw(tab('Профиль')), Настройки: markRaw(tab('Настройки')) };
  return {
    setup() { const cur = ref('Профиль'), keep = ref(true); return { cur, keep, tabs, log }; },
    template: `<div class="stack">
      <div class="row"><div class="seg"><button v-for="(c, k) in tabs" :key="k" :aria-pressed="String(cur === k)" @click="cur = k">{{ k }}</button></div>
      <label class="row small"><input type="checkbox" v-model="keep"> обернуть в KeepAlive</label></div>
      <KeepAlive v-if="keep"><component :is="tabs[cur]" :key="cur" /></KeepAlive>
      <component v-else :is="tabs[cur]" :key="cur" />
      ${LOG_TPL}
    </div>`,
  };
});

vueDemo('vue-provide-inject', 'provide / inject через уровни', 'Корень делает provide реактивного значения. Внук получает его через inject, минуя промежуточный компонент, которому это значение не нужно.', Vue => {
  const { ref, provide, inject, defineComponent } = Vue;
  const Grandchild = defineComponent({ setup() { const theme = inject('theme'); return { theme }; }, template: `<div class="preview">Внук: inject('theme') = <b>{{ theme }}</b></div>` });
  const Middle = defineComponent({ components: { Grandchild }, template: `<div class="nest" style="place-items:stretch"><span>Middle — ничего не знает о theme</span><div style="height:12px"></div><Grandchild /></div>` });
  return { components: { Middle }, setup() { const theme = ref('dark'); provide('theme', theme); return { theme }; },
    template: `<div class="stack"><div class="row"><span class="small muted">Root: provide('theme', ref)</span><button class="btn btn--sm" @click="theme = theme === 'dark' ? 'light' : 'dark'">theme = {{ theme }}</button></div><Middle /></div>` };
});

/* ================= Nuxt: rendering modes ================= */
D['nuxt-rendering'] = holder => {
  const body = frame(holder, 'Что видит пользователь при SSR, CSR и SSG', 'Запустите загрузку страницы в каждом режиме. Следите за двумя моментами: когда появился контент (FCP) и когда страница стала интерактивной (гидратация).');
  const MODES = {
    csr: { name: 'CSR (SPA)', stages: [['запрос', 0, 150, '--faint'], ['пустой index.html', 150, 250, '--line-2'], ['загрузка JS', 250, 900, '--c-ts'], ['fetch данных', 900, 1400, '--c-web'], ['рендер в браузере', 1400, 1550, '--c-vue']], fcp: 1550, tti: 1550, note: 'Пока не скачается JS и не придут данные, пользователь видит белый экран. Поисковик тоже видит пустую страницу.' },
    ssr: { name: 'SSR', stages: [['запрос', 0, 150, '--faint'], ['сервер: данные + рендер', 150, 550, '--c-nuxt'], ['готовый HTML', 550, 650, '--line-2'], ['загрузка JS', 650, 1200, '--c-ts'], ['гидратация', 1200, 1350, '--c-vue']], fcp: 650, tti: 1350, note: 'Контент виден сразу, как пришёл HTML. Но между FCP и гидратацией кнопки не работают — это «зловещая долина» SSR. Каждый запрос нагружает сервер.' },
    ssg: { name: 'SSG', stages: [['запрос', 0, 100, '--faint'], ['HTML из CDN', 100, 200, '--line-2'], ['загрузка JS', 200, 750, '--c-ts'], ['гидратация', 750, 900, '--c-vue']], fcp: 200, tti: 900, note: 'HTML сгенерирован на этапе сборки и лежит на CDN — самый быстрый ответ. Минус: данные свежие только на момент сборки (лечится ISR/SWR через routeRules).' },
  };
  const MAX = 1600;
  const tl = h('div.timeline'); const note = h('p.demo__note'); const screen = h('div.preview', { style: { height: '90px', display: 'grid', placeItems: 'center', transition: 'all .2s' } });
  let timers = [];
  const run = k => {
    timers.forEach(clearTimeout); timers = [];
    const m = MODES[k]; tl.innerHTML = ''; note.textContent = m.note;
    screen.textContent = 'белый экран'; screen.style.opacity = .5;
    m.stages.forEach(([label, s, e, c]) => {
      const seg = h('div.tl__seg', { style: { left: (s / MAX * 100) + '%', width: '0%', background: 'var(' + c + ')' } }, label);
      tl.append(h('div.tl', h('span.small', label), h('div.tl__track', seg)));
      timers.push(setTimeout(() => { seg.style.width = ((e - s) / MAX * 100) + '%'; }, s));
    });
    timers.push(setTimeout(() => { screen.style.opacity = 1; screen.innerHTML = '<div><b>Каталог</b> · 24 товара · <span class="chip">кнопки не работают</span></div>'; }, m.fcp));
    timers.push(setTimeout(() => { screen.innerHTML = '<div><b>Каталог</b> · 24 товара · <span class="chip chip--ok">интерактивно</span></div>'; }, m.tti));
    timers.push(setTimeout(() => { tl.append(h('p.small.mono', 'FCP ≈ ' + m.fcp + ' мс · интерактивно ≈ ' + m.tti + ' мс')); }, m.tti + 50));
  };
  body.append(seg(Object.entries(MODES).map(([k, m]) => [k, m.name]), 'ssr', run), h('b.small', 'Экран пользователя'), screen, tl, note);
  run('ssr');
};

/* ================= Nuxt: hydration mismatch ================= */
D['nuxt-hydration'] = holder => {
  const body = frame(holder, 'Сервер отрендерил одно, клиент — другое', 'Гидратация — это когда Vue в браузере «оживляет» серверный HTML: проходит по нему и навешивает обработчики, ожидая ровно тот же DOM. Выберите источник данных и посмотрите, что получится.');
  const CASES = {
    date: ['new Date().toLocaleTimeString()', () => '12:00:00', () => '12:00:03', 'Время на сервере и при гидратации разное. Решение: вычислить в onMounted или передать с сервера через useState.'],
    random: ['Math.random()', () => '0.4821', () => '0.9137', 'Каждый вызов даёт новое число. Решение: useState(\'key\', () => Math.random()) — значение уйдёт в payload.'],
    storage: ["localStorage.getItem('theme')", () => 'на сервере localStorage нет → null', () => 'dark', 'На сервере нет браузерных API. Решение: useCookie (видна серверу) или чтение в onMounted / <ClientOnly>.'],
    state: ["useState('promo', () => pick())", () => 'Скидка 10%', () => 'Скидка 10%', 'useState сериализуется в payload страницы, клиент берёт то же значение — несовпадения нет.'],
  };
  const out = h('div.grid.grid--2'); const log = logBox(); const note = h('p.demo__note');
  const run = k => {
    const [expr, srv, cli, why] = CASES[k];
    const a = srv(), b = cli(); const ok = a === b;
    out.innerHTML = '';
    out.append(h('div.preview', h('b.small', 'HTML с сервера'), h('p.mono', a)), h('div.preview', { style: { borderColor: ok ? 'var(--ok)' : 'var(--bad)' } }, h('b.small', 'Первый рендер на клиенте'), h('p.mono', b)));
    log.clear(); log.add('{{ ' + expr + ' }}', 'l-mute');
    log.add(ok ? '✓ DOM совпал, гидратация прошла' : '[Vue warn]: Hydration text content mismatch — server: "' + a + '", client: "' + b + '"', ok ? 'l-ok' : 'l-bad');
    if (!ok) log.add('Vue перепишет узел на клиентский вариант — мигание, лишняя работа, а при несовпадении структуры — сломанные обработчики', 'l-warn');
    note.textContent = why;
  };
  body.append(seg([['date', 'Date'], ['random', 'Math.random'], ['storage', 'localStorage'], ['state', 'useState']], 'date', run), out, log, note);
  run('date');
};

/* ================= Nuxt: $fetch vs useFetch ================= */
const fetchDemo = holder => {
  const body = frame(holder, 'Сколько запросов уйдёт в API', 'Сравните три способа получить данные в setup страницы. Выберите сценарий: первая загрузка по ссылке (SSR + гидратация) или переход по NuxtLink внутри приложения.');
  const WAYS = {
    raw: ["const data = await $fetch('/api/products')", { ssr: [['сервер', '$fetch → API', 'req'], ['клиент', 'гидратация: setup выполняется снова → $fetch → API', 'req']], nav: [['клиент', '$fetch → API', 'req']] }, 'Данные не передаются с сервера на клиент, поэтому при гидратации запрос повторяется. Плюс возможен mismatch, пока второй ответ не пришёл.'],
    fetch: ["const { data } = await useFetch('/api/products')", { ssr: [['сервер', 'useFetch → $fetch → API', 'req'], ['сервер', 'результат кладётся в payload (__NUXT_DATA__)', 'ok'], ['клиент', 'гидратация: данные из payload, запроса нет', 'ok']], nav: [['клиент', 'useFetch → $fetch → API', 'req']] }, 'useFetch = useAsyncData + $fetch. Ключ генерируется из URL; ответ сервера передаётся через payload, клиент его переиспользует.'],
    async: ["const { data } = await useAsyncData('products', () => $fetch('/api/products'))", { ssr: [['сервер', 'handler → $fetch → API', 'req'], ['сервер', 'payload["products"] = результат', 'ok'], ['клиент', 'по ключу "products" берёт данные из payload', 'ok']], nav: [['клиент', 'handler → $fetch → API', 'req']] }, 'Явный ключ и любая асинхронная функция внутри: несколько запросов, SDK, преобразование. $fetch внутри handler — правильное место для него.'],
  };
  let way = 'raw', scen = 'ssr';
  const code = h('div'); const log = logBox(); const note = h('p.demo__note'); const count = h('div.card.stat', { style: { padding: '12px 16px' } });
  const draw = () => {
    const [src, sc, why] = WAYS[way];
    code.innerHTML = ''; code.append(codeBlock(src, 'ts'));
    log.clear(); const steps = sc[scen];
    let i = 0, reqs = 0;
    count.innerHTML = '';
    const b = h('b', '0'); count.append(b, h('span', 'запросов к API'));
    const tick = () => { if (i >= steps.length) return; const [where, what, kind] = steps[i++]; if (kind === 'req') { reqs++; b.textContent = reqs; } log.add('[' + where + '] ' + what, kind === 'req' ? (reqs > 1 ? 'l-bad' : 'l-warn') : 'l-ok'); setTimeout(tick, 450); };
    tick();
    note.textContent = why;
  };
  body.append(seg([['raw', '$fetch в setup'], ['fetch', 'useFetch'], ['async', 'useAsyncData']], way, k => { way = k; draw(); }),
    seg([['ssr', 'Первая загрузка (SSR)'], ['nav', 'Переход по NuxtLink']], scen, k => { scen = k; draw(); }), code, h('div.grid.grid--2', count, h('div')), log, note);
  draw();
};
D['nuxt-dollar-fetch'] = fetchDemo;
D['nuxt-usefetch'] = fetchDemo;
D['nuxt-useasyncdata'] = fetchDemo;

/* ================= Nuxt: useState vs module ref ================= */
D['nuxt-usestate'] = holder => {
  const body = frame(holder, 'Утечка состояния между пользователями', 'Сервер Nuxt — один долгоживущий процесс. Модуль импортируется один раз на все запросы. Запустите два запроса от разных пользователей подряд.');
  let way = 'module';
  const log = logBox(); const res = h('div.grid.grid--2');
  const run = () => {
    log.clear(); res.innerHTML = '';
    let moduleUser = null; // одна переменная на весь процесс
    const request = (name, delay) => new Promise(r => {
      const reqState = { user: null }; // useState: своё на каждый запрос (живёт в nuxtApp.payload)
      if (way === 'module') moduleUser = name; else reqState.user = name;
      log.add('запрос ' + name + ': авторизовали → user = ' + name, 'l-mute');
      setTimeout(() => { const shown = way === 'module' ? moduleUser : reqState.user; log.add('запрос ' + name + ': рендер шапки → «Привет, ' + shown + '»', shown === name ? 'l-ok' : 'l-bad'); r([name, shown]); }, delay);
    });
    Promise.all([request('Аня', 600), request('Борис', 300)]).then(rs => rs.forEach(([who, shown]) => res.append(h('div.preview', { style: { borderColor: who === shown ? 'var(--ok)' : 'var(--bad)' } }, h('b.small', 'Страница для ' + who), h('p', 'Привет, ' + shown)))));
  };
  const code = h('div');
  const show = () => { code.innerHTML = ''; code.append(codeBlock(way === 'module' ? `// composables/useUser.ts
const user = ref<User | null>(null) // ← модульный уровень: общий для ВСЕХ запросов
export const useUser = () => user` : `// composables/useUser.ts
export const useUser = () =>
  useState<User | null>('user', () => null) // своё на каждый запрос, уходит в payload`, 'ts')); };
  body.append(seg([['module', 'ref вне функции'], ['state', 'useState']], way, k => { way = k; show(); }), code, h('div.row', h('button.btn.btn--primary.btn--sm', { type: 'button', onclick: run }, 'Отправить два запроса')), log, res);
  show();
};

/* ================= TS: narrowing ================= */
D['ts-guards'] = holder => {
  const body = frame(holder, 'Как TypeScript сужает тип', 'Тип <code>Shape</code> — объединение трёх фигур. Выберите проверку и посмотрите, какой тип остаётся внутри if и в else.');
  const ALL = ['Circle', 'Square', 'Text'];
  const CHECKS = [
    ["s.kind === 'circle'", ['Circle'], 'Discriminated union: общее поле-литерал kind однозначно определяет вариант. Самый надёжный способ.'],
    ["'radius' in s", ['Circle'], 'Оператор in сужает по наличию свойства.'],
    ["typeof s.value === 'string'", ['Text'], 'typeof работает для примитивных полей и самих примитивов.'],
    ['isSquare(s)', ['Square'], 'Пользовательский guard: функция с типом возврата s is Square. TS верит ей на слово — ответственность на вас.'],
    ["s.kind !== 'text'", ['Circle', 'Square'], 'Отрицание тоже сужает: в if остаётся всё, кроме Text.'],
  ];
  const tag = (t, on) => h('span.chip' + (on ? '.chip--ok' : ''), t);
  const out = h('div.grid.grid--2'); const note = h('p.demo__note');
  const run = ([expr, yes, why]) => {
    out.innerHTML = '';
    out.append(h('div.preview.stack', h('span.small.mono', 'if (' + expr + ') {'), h('div.row', ALL.map(t => yes.includes(t) ? tag(t, true) : null)), h('span.small.muted', 's: ' + yes.join(' | '))),
      h('div.preview.stack', h('span.small.mono', '} else {'), h('div.row', ALL.map(t => yes.includes(t) ? null : tag(t, true))), h('span.small.muted', 's: ' + ALL.filter(t => !yes.includes(t)).join(' | '))));
    note.textContent = why;
  };
  body.append(codeBlock(`type Circle = { kind: 'circle'; radius: number }
type Square = { kind: 'square'; size: number }
type Text   = { kind: 'text'; value: string }
type Shape = Circle | Square | Text

const isSquare = (s: Shape): s is Square => s.kind === 'square'`, 'ts'),
  h('div.row', CHECKS.map(c => h('button.btn.btn--sm.mono', { type: 'button', onclick: () => run(c) }, c[0]))), out, note);
  run(CHECKS[0]);
};

/* ================= Arch: observer ================= */
D['arch-observer'] = holder => {
  const body = frame(holder, 'Издатель и подписчики', 'Корзина публикует событие «товар добавлен». Подписчики не знают друг о друге, а корзина не знает, кто подписан. Включайте и выключайте подписчиков и публикуйте события.');
  const subs = { badge: true, analytics: true, toast: true, recs: false };
  const NAMES = { badge: 'Счётчик в шапке', analytics: 'Аналитика', toast: 'Уведомление', recs: 'Рекомендации' };
  const listeners = new Map();
  const on = (k, fn) => listeners.set(k, fn); const off = k => listeners.delete(k);
  let cnt = 0; const badge = h('b.mono', '0'); const log = logBox();
  const handlers = {
    badge: p => { badge.textContent = ++cnt; log.add('  Счётчик в шапке: ' + cnt, 'l-ok'); },
    analytics: p => log.add('  Аналитика: track("add_to_cart", ' + p + ')', 'l-ok'),
    toast: p => { S.toast('Добавлено: ' + p); log.add('  Уведомление показано', 'l-ok'); },
    recs: p => log.add('  Рекомендации: подобрать похожее на ' + p, 'l-ok'),
  };
  Object.keys(subs).forEach(k => subs[k] && on(k, handlers[k]));
  const emit = p => { log.add('emit("cart:add", "' + p + '") → ' + listeners.size + ' подписчиков', 'l-warn'); listeners.forEach(fn => fn(p)); };
  body.append(h('div.grid.grid--2', Object.keys(subs).map(k => h('label.check', h('input', { type: 'checkbox', checked: subs[k], onchange: e => { e.target.checked ? on(k, handlers[k]) : off(k); log.add((e.target.checked ? 'on' : 'off') + '("cart:add", ' + k + ')', 'l-mute'); } }), h('span', NAMES[k])))),
    h('div.row', ['Чай', 'Кофе', 'Печенье'].map(p => h('button.btn.btn--sm.btn--primary', { type: 'button', onclick: () => emit(p) }, '+ ' + p)), h('span.small.muted', 'В корзине:'), badge), log,
    h('p.demo__note', { html: 'Реактивность Vue — тот же Observer: <code>ref</code> — издатель, эффекты рендера и <code>watch</code> — подписчики, которые Vue регистрирует сам при чтении значения.' }));
};

/* ================= Arch: strategy ================= */
D['arch-strategy'] = holder => {
  const body = frame(holder, 'Стратегия доставки', 'Каждый способ доставки — отдельная функция с одинаковой сигнатурой. Код оформления заказа вызывает стратегию, не зная, какая выбрана. Новая доставка = новая запись в объекте, без правки if-цепочки.');
  const STRATS = {
    courier: ['Курьер', o => o.total >= 3000 ? 0 : 390, `courier: o => o.total >= 3000 ? 0 : 390`],
    pickup: ['Самовывоз', () => 0, `pickup: () => 0`],
    post: ['Почта', o => 250 + Math.ceil(o.weight) * 40, `post: o => 250 + Math.ceil(o.weight) * 40`],
    express: ['Экспресс', o => Math.max(590, o.total * 0.05), `express: o => Math.max(590, o.total * 0.05)`],
  };
  let s = 'courier'; const order = { total: 2400, weight: 1.6 };
  const out = h('div.card.stat', { style: { padding: '14px 18px' } }); const code = h('div');
  const draw = () => {
    const price = Math.round(STRATS[s][1](order));
    out.innerHTML = ''; out.append(h('b', price ? price + ' ₽' : 'бесплатно'), h('span', STRATS[s][0] + ' · заказ ' + order.total + ' ₽, ' + order.weight + ' кг'));
    code.innerHTML = ''; code.append(codeBlock(`const delivery = {
${Object.values(STRATS).map(x => '  ' + x[2] + ',').join('\n')}
}

const price = delivery['${s}'](order) // ← без if/switch`, 'js'));
  };
  const range = (k, min, max, step, label) => { const v = h('span.mono.small', String(order[k])); return h('div.row', h('span.small.muted', { style: { width: '90px' } }, label), h('input', { type: 'range', min, max, step, value: order[k], oninput: e => { order[k] = +e.target.value; v.textContent = order[k]; draw(); } }), v); };
  body.append(seg(Object.entries(STRATS).map(([k, x]) => [k, x[0]]), s, k => { s = k; draw(); }), range('total', 100, 6000, 100, 'Сумма, ₽'), range('weight', .2, 10, .2, 'Вес, кг'), out, code);
  draw();
};

/* ================= Arch: proxy ================= */
D['arch-proxy'] = holder => {
  const body = frame(holder, 'Proxy перехватывает операции', 'Объект пользователя обёрнут в настоящий Proxy с ловушками get и set: логирование и валидация. Именно так Vue 3 узнаёт, кто читает и кто меняет данные.');
  const log = logBox();
  const target = { name: 'Илья', age: 30 };
  const user = new Proxy(target, {
    get(t, k) { if (typeof k === 'string') log.add('get ' + k + ' → ' + JSON.stringify(t[k]), 'l-mute'); return Reflect.get(t, k); },
    set(t, k, v) {
      if (k === 'age' && (!Number.isInteger(v) || v < 0)) { log.add('set age = ' + JSON.stringify(v) + ' ✕ отклонено валидацией', 'l-bad'); return true; }
      log.add('set ' + k + ' = ' + JSON.stringify(v) + ' ✓', 'l-ok'); return Reflect.set(t, k, v);
    },
  });
  const state = h('pre.tree');
  const draw = () => { state.textContent = 'target: ' + JSON.stringify(target); };
  const act = (label, fn) => h('button.btn.btn--sm.mono', { type: 'button', onclick: () => { fn(); draw(); } }, label);
  body.append(codeBlock(`const user = new Proxy(target, {
  get(t, key) { log('get', key); return Reflect.get(t, key) },
  set(t, key, value) {
    if (key === 'age' && !(Number.isInteger(value) && value >= 0)) return true // отклонить
    log('set', key, value)
    return Reflect.set(t, key, value)
  },
})`, 'js'), h('div.row', act('user.name', () => user.name), act('user.age = 31', () => { user.age = 31; }), act("user.age = -5", () => { user.age = -5; }), act("user.age = 'много'", () => { user.age = 'много'; }), act("user.city = 'Томск'", () => { user.city = 'Томск'; })), state, log);
  draw();
};

/* ================= Web: storage ================= */
D['web-storage'] = holder => {
  const body = frame(holder, 'Три хранилища рядом', 'Запишите значение в каждое и посмотрите, кто его увидит. Cookie уходит на сервер с каждым запросом — хранилища нет.');
  const rows = [
    ['localStorage', 'до очистки вручную', 'все вкладки сайта', 'нет', '~5 МБ'],
    ['sessionStorage', 'до закрытия вкладки', 'только эта вкладка', 'нет', '~5 МБ'],
    ['cookie', 'Expires / Max-Age', 'все вкладки сайта', 'да, с каждым запросом', '~4 КБ'],
  ];
  const table = h('div', { style: { overflowX: 'auto' } }, h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' } },
    h('tr', ['', 'Живёт', 'Видно', 'Уходит на сервер', 'Объём'].map(x => h('th', { style: { textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--line)', color: 'var(--muted)', fontWeight: 600 } }, x))),
    rows.map(r => h('tr', r.map((x, i) => h('td', { style: { padding: '6px 8px', borderBottom: '1px solid var(--line)', fontFamily: i ? '' : 'var(--f-mono)' } }, x))))));
  const log = logBox();
  const inp = h('input.input', { value: 'привет ' + new Date().toLocaleTimeString('ru-RU'), style: { maxWidth: '260px' } });
  const write = () => {
    try { localStorage.setItem('sobes-demo', inp.value); sessionStorage.setItem('sobes-demo', inp.value); } catch (e) {}
    document.cookie = 'sobes-demo=' + encodeURIComponent(inp.value) + '; max-age=600; path=/sobes; SameSite=Lax';
    read();
  };
  const read = () => {
    log.clear();
    let ls = null, ss = null; try { ls = localStorage.getItem('sobes-demo'); ss = sessionStorage.getItem('sobes-demo'); } catch (e) {}
    const ck = (document.cookie.match(/(?:^|; )sobes-demo=([^;]*)/) || [])[1];
    log.add('localStorage.getItem → ' + JSON.stringify(ls)); log.add('sessionStorage.getItem → ' + JSON.stringify(ss)); log.add('document.cookie → ' + (ck ? 'sobes-demo=' + decodeURIComponent(ck) : '(нет)'));
    log.add('Откройте эту страницу в новой вкладке: localStorage и cookie там будут, sessionStorage — нет. HttpOnly-cookie JS вообще не видит.', 'l-mute');
  };
  body.append(table, h('div.row', inp, h('button.btn.btn--primary.btn--sm', { type: 'button', onclick: write }, 'Записать во все три'), h('button.btn.btn--sm', { type: 'button', onclick: read }, 'Прочитать')), log);
  read();
};
})();
