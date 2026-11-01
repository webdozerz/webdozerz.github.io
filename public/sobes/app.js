/* App: hash router + views (dashboard, section, topic, interview, quiz, practice, review, progress). */
(() => {
const S = window.SOBES;
const { $, h, codeBlock, editor, toast, store, SECTIONS, secOf, LEVELS, LEVEL_NAME, byId, qIndex, mastery, answered, topicItems, shuffle, keyHit } = S;
S.indexContent();
const view = $('#view');
const pct = x => Math.round(x * 100);
const plural = (n, a, b, c) => n % 10 === 1 && n % 100 !== 11 ? a : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? b : c;
const topicsOf = sec => S.topics.filter(t => t.section === sec);
const cvar = sec => ({ '--c': 'var(--c-' + sec + ')' });
const ICON = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  quiz: 'M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9',
  code: 'm16 18 6-6-6-6M8 6l-6 6 6 6',
  repeat: 'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3',
  chart: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  play: 'M6 4l14 8-14 8z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
};
const icon = (name, size = 18) => h('span', { html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${ICON[name]}"/></svg>`, style: { display: 'inline-flex' } });
const levelChip = lv => lv ? h('span.chip', LEVEL_NAME[lv] || lv) : null;
const secChip = sec => h('span.chip.chip--c', { style: cvar(sec) }, secOf(sec)?.name || sec);
function bar(p, sec) { return h('div.bar', h('i', { style: Object.assign({ '--p': pct(p) + '%' }, sec ? cvar(sec) : {}) })); }
function ring(p, sec) { const r = h('div.ring', { 'data-label': pct(p) + '%' }); r.style.setProperty('--p', pct(p)); if (sec) r.style.setProperty('--c', 'var(--c-' + sec + ')'); return r; }

/* ---------- sidebar ---------- */
function renderSide(route) {
  const due = S.dueCards().length;
  const link = (href, label, extra, ic) => h('a.side__link', { href, 'aria-current': route === href.slice(2) || (href !== '#/' && route.startsWith(href.slice(2) + '/')) ? 'page' : null }, ic, h('span', label), extra);
  const nav = $('#sideNav'); nav.innerHTML = '';
  nav.append(
    h('div.side__group', link('#/', 'Обзор', null, icon('home'))),
    h('div.side__group', h('div.side__label', 'Режимы'),
      link('#/interview', 'Собеседование', null, icon('mic')),
      link('#/quiz', 'Быстрый тест', null, icon('quiz')),
      link('#/practice', 'Практика', h('span.side__count', S.tasks.filter(t => store.data.tasks[t.id]?.solved).length + '/' + S.tasks.length), icon('code')),
      link('#/review', 'Повторение', due ? h('span.side__count.side__count--due', String(due)) : null, icon('repeat')),
      link('#/progress', 'Прогресс', null, icon('chart'))),
    h('div.side__group', h('div.side__label', 'Темы'),
      SECTIONS.map(s => { const ts = topicsOf(s.id); return link('#/s/' + s.id, s.name, h('span.side__count', ts.filter(t => mastery(t) >= .7).length + '/' + ts.length), h('i.side__dot', { style: cvar(s.id) })); })),
  );
  const t = route.startsWith('t/') && byId[route.slice(2)];
  if (t) $$('.side__link', nav).forEach(a => { if (a.getAttribute('href') === '#/s/' + t.section) a.setAttribute('aria-current', 'page'); });
}
const $$ = S.$$;

/* ---------- shared: question self-check card ---------- */
function qaCard(q, topic, { onDone, showTopic = false, autoOpen = false } = {}) {
  const box = h('div.qa');
  const meta = h('div.qa__meta', showTopic && topic ? secChip(topic.section) : null, showTopic && topic ? h('a.chip', { href: '#/t/' + topic.id }, topic.title) : null, levelChip(q.level));
  const ta = h('textarea.input', { rows: 4, placeholder: 'Ответьте своими словами, как на собеседовании. Можно вслух, а сюда — тезисы. Текст никуда не отправляется.' });
  const area = h('div.stack');
  const prev = store.card(q.id);
  const openBtn = h('button.btn.btn--primary', { type: 'button', onclick: () => reveal(false) }, 'Проверить себя');
  const skipBtn = h('button.btn.btn--ghost', { type: 'button', onclick: () => reveal(true) }, 'Не знаю');
  box.append(meta, h('div.qa__q', q.q), ta, h('div.row', openBtn, skipBtn, prev ? h('span.small.muted', 'В прошлый раз: ' + pct(prev.last) + '%') : null), area);
  function reveal(dunno) {
    openBtn.hidden = skipBtn.hidden = true; ta.readOnly = true;
    const ans = ta.value.trim();
    const checks = q.keys.map(k => ({ k, input: h('input', { type: 'checkbox', checked: !dunno && ans && keyHit(ans, k) }) }));
    const finish = h('button.btn.btn--primary', { type: 'button', onclick: grade }, 'Оценить');
    const keys = h('div.qa__keys', dunno ? points(q.keys.map(k => [k, 'plain'])) : checks.map(c => h('label.check', c.input, h('span', c.k))));
    const hint = h('div', h('b', dunno ? 'Ключевые мысли ответа' : 'Отметьте, что вы сказали'), dunno ? null : h('p.small.muted', ans ? 'Совпадения по словам отмечены автоматически — поправьте честно.' : 'Сверьте с тем, что сказали вслух.'));
    const box2 = h('div.qa__answer', hint, keys, dunno ? null : h('div.row', finish));
    area.append(box2);
    if (dunno) grade();
    function grade() {
      const got = checks.filter(c => c.input.checked).length;
      const score = dunno ? 0 : got / checks.length;
      if (!dunno) {
        /* after grading the checkboxes are just a result: said / missed */
        keys.replaceChildren(...points(checks.map(c => [c.k, c.input.checked ? 'ok' : 'miss'])));
        hint.replaceChildren(h('b', 'Ключевые мысли'), h('p.small.muted', '✓ — вы это сказали, ○ — этого не хватило'));
        finish.remove();
      }
      store.answer(q.id, score);
      const kind = score >= .8 ? 'ok' : score >= .4 ? 'mid' : 'bad';
      const text = { ok: 'Сильный ответ', mid: 'Неполно', bad: dunno ? 'Разберите ответ ниже' : 'Стоит разобрать тему' }[kind];
      box2.append(
        h('div.verdict.verdict--' + kind, ring(score), h('div', h('b', text + ' · ' + pct(score) + '%'),
          score < .8 ? h('p.small.muted', 'Вопрос попал в повторение и вернётся раньше.') : h('p.small.muted', 'Все ключевые мысли на месте.'))),
        h('div.qa__model', h('h4', 'Как можно ответить'), h('p', q.a)));
      onDone && onDone(score);
    }
  }
  if (autoOpen) requestAnimationFrame(() => ta.focus());
  return box;
}

/* key points as a plain list: [text, 'ok' | 'miss' | 'plain'] */
function points(list) {
  return list.map(([k, st]) => h('div.point.point--' + st, h('i', st === 'ok' ? '✓' : st === 'miss' ? '○' : '·'), h('span', k)));
}

/* ---------- shared: multiple choice card ---------- */
function quizCard(item, { onDone, showTopic = false } = {}) {
  const multi = item.type === 'multi';
  const picked = new Set();
  const topic = byId[item.topic];
  const box = h('div.qa');
  const opts = h('div.opts' + (multi ? '' : '.opts--single'));
  const btns = item.options.map((o, i) => h('button.opt', { type: 'button', 'aria-pressed': 'false', onclick: () => pick(i) },
    h('span.opt__mark', multi ? '' : String.fromCharCode(65 + i)), h('span', { html: fmtInline(o) })));
  opts.append(...btns);
  const go = h('button.btn.btn--primary', { type: 'button', disabled: true, onclick: check }, 'Ответить');
  const typeName = { single: 'Один ответ', multi: 'Несколько ответов', output: 'Что выведет код' }[item.type] || '';
  box.append(h('div.qa__meta', showTopic && topic ? secChip(topic.section) : null, showTopic && topic ? h('a.chip', { href: '#/t/' + topic.id }, topic.title) : null, h('span.chip', typeName)),
    h('div.qa__q', item.q), item.code ? codeBlock(item.code, topic && topic.section === 'ts' ? 'ts' : 'js') : null, opts, h('div.row', go));
  function pick(i) {
    if (go.dataset.done) return;
    if (multi) picked.has(i) ? picked.delete(i) : picked.add(i); else { picked.clear(); picked.add(i); }
    btns.forEach((b, j) => b.setAttribute('aria-pressed', String(picked.has(j))));
    go.disabled = !picked.size;
  }
  function check() {
    go.dataset.done = 1; go.remove();
    const right = new Set(item.correct);
    const ok = picked.size === right.size && [...picked].every(i => right.has(i));
    btns.forEach((b, i) => { b.disabled = true; if (right.has(i)) b.classList.add(picked.has(i) ? 'is-right' : 'is-missed'); else if (picked.has(i)) b.classList.add('is-wrong'); });
    store.answer(item.id, ok ? 1 : 0);
    box.append(h('div.verdict.verdict--' + (ok ? 'ok' : 'bad'), h('div', h('b', ok ? 'Верно' : 'Неверно'), h('p.small', { html: fmtInline(item.explain) }))));
    onDone && onDone(ok ? 1 : 0);
  }
  return box;
}
/* inline `code` in plain strings */
const fmtInline = s => S.esc(s || '').replace(/`([^`]+)`/g, '<code>$1</code>');

/* ---------- views ---------- */
const views = {};

views.home = () => {
  const d = store.data;
  const total = S.topics.length;
  const studied = S.topics.filter(t => d.seen[t.id]).length;
  const allQ = Object.keys(qIndex).length;
  const cards = Object.entries(d.cards).filter(([id]) => qIndex[id]);
  const attempts = cards.reduce((n, [, c]) => n + c.n, 0);
  const acc = attempts ? cards.reduce((n, [, c]) => n + c.sum, 0) / attempts : 0;
  const last = d.last && byId[d.last.topic];
  const next = last ? null : S.topics[0];
  const cont = last || next;
  const due = S.dueCards();

  const lvl = h('div.seg', LEVELS.map(l => h('button', { type: 'button', 'aria-pressed': String(d.settings.level === l), onclick: () => { store.setting('level', l); render(); } }, LEVEL_NAME[l])));
  const out = [
    h('div.hello', h('div.head', h('span.eyebrow', 'Подготовка к собеседованию'), h('h1', 'Frontend · Vue · Nuxt'), h('p', 'Темы с живыми примерами, тренировка ответов, тесты, задачи с автопроверкой и повторение ошибок.')),
      h('div.stack', h('span.small.muted', 'Целевой уровень'), lvl)),
  ];
  if (cont) out.push(h('div.card.continue', { style: cvar(cont.section) },
    h('div', h('span.eyebrow', last ? 'Продолжить обучение' : 'Начать с первой темы'), h('h2', cont.title), h('p.small.muted', secOf(cont.section).name + ' · ' + cont.group + (last ? ' · освоено ' + pct(mastery(cont)) + '%' : ''))),
    h('div.row', last ? h('a.btn', { href: '#/t/' + nextTopic(cont)?.id }, 'Следующая тема') : null, h('a.btn.btn--primary', { href: '#/t/' + cont.id }, last ? 'Вернуться' : 'Открыть', icon('arrow', 16)))));
  out.push(h('div.grid.grid--4',
    stat(studied + '/' + total, 'тем открыто', pct(total ? studied / total : 0) + '% программы'),
    stat(cards.length + '/' + allQ, 'вопросов пройдено', attempts + ' ' + plural(attempts, 'ответ', 'ответа', 'ответов')),
    stat(attempts ? pct(acc) + '%' : '—', 'правильных ответов', 'средний балл'),
    stat(String(store.streak()), plural(store.streak(), 'день подряд', 'дня подряд', 'дней подряд'), d.days[new Date().toISOString().slice(0, 10)] ? 'сегодня уже занимались' : 'сегодня ещё не занимались')));
  out.push(h('div.modes',
    mode('#/interview', 'mic', 'Собеседование', 'Один вопрос за раз, разбор ответа'),
    mode('#/quiz', 'quiz', 'Быстрый тест', 'Варианты ответов и код'),
    mode('#/practice', 'code', 'Практика', S.tasks.length + ' задач с тестами и разборами'),
    mode('#/review', 'repeat', 'Повторение', due.length ? due.length + ' ждут повторения' : 'Ошибки и интервалы')));
  out.push(h('div.sections', SECTIONS.map(s => {
    const ts = topicsOf(s.id); const m = ts.length ? ts.reduce((n, t) => n + mastery(t), 0) / ts.length : 0;
    return h('a.sec-card', { href: '#/s/' + s.id, style: cvar(s.id) }, h('div.sec-card__top', h('span.sec-card__tag', s.tag), h('span.small.muted', ts.length + ' ' + plural(ts.length, 'тема', 'темы', 'тем'))), h('h3', s.name), h('p', s.desc), bar(m, s.id));
  })));
  const errs = S.mistakes().slice(0, 6);
  out.push(h('div.grid.grid--2',
    h('div.card', h('div.card__head', h('h2', 'Последние ошибки'), errs.length ? h('a', { href: '#/review' }, 'Все →') : null),
      errs.length ? h('div.list', errs.map(([id, c]) => { const x = qIndex[id]; return h('a.list__item', { href: '#/t/' + x.topic.id }, h('span', x.item.q), h('small', pct(c.last) + '%')); }))
        : h('p.muted.small', 'Пока пусто. Сюда попадут вопросы, на которые вы ответили неверно или неполно.')),
    h('div.card', h('div.card__head', h('h2', 'Стоит повторить')), recommend())));
  out.push(h('div.card', h('div.card__head', h('h2', 'Активность за 4 недели'), h('span.small.muted', Object.keys(d.days).length + ' ' + plural(Object.keys(d.days).length, 'день', 'дня', 'дней') + ' занятий всего')), heat()));
  return out;
};
function stat(v, label, sub) { return h('div.card.stat', h('b', v), h('span', label), sub ? h('small', sub) : null); }
function mode(href, ic, title, sub) { return h('a.mode', { href }, icon(ic, 20), h('b', title), h('span', sub)); }
function heat() {
  const d = store.data.days; const cells = [];
  for (let i = 27; i >= 0; i--) { const t = new Date(Date.now() - i * S.DAY).toISOString().slice(0, 10); const n = d[t] || 0; cells.push(h('i', { 'data-v': n ? Math.min(3, Math.ceil(n / 6)) : 0, title: t + ': ' + n })); }
  return h('div.heat', cells);
}
function recommend() {
  const d = store.data; const rows = [];
  const due = S.dueCards().length;
  if (due) rows.push(h('a.list__item', { href: '#/review' }, h('span', due + ' ' + plural(due, 'вопрос ждёт', 'вопроса ждут', 'вопросов ждут') + ' повторения'), h('small', 'начать →')));
  const weak = S.topics.filter(t => d.seen[t.id] && answered(t)).map(t => [t, mastery(t)]).filter(([, m]) => m < .7).sort((a, b) => a[1] - b[1]).slice(0, 4);
  weak.forEach(([t, m]) => rows.push(h('a.list__item', { href: '#/t/' + t.id }, h('span', t.title), h('small', pct(m) + '% · ' + secOf(t.section).tag))));
  const lvl = LEVELS.indexOf(d.settings.level);
  const fresh = S.topics.filter(t => !d.seen[t.id] && LEVELS.indexOf(t.level) <= lvl).slice(0, Math.max(0, 5 - rows.length));
  fresh.forEach(t => rows.push(h('a.list__item', { href: '#/t/' + t.id }, h('span', t.title), h('small', 'не открыта · ' + secOf(t.section).tag))));
  return rows.length ? h('div.list', rows) : h('p.muted.small', 'Всё открыто и освоено. Запустите собеседование уровня Senior.');
}
function nextTopic(t) { const i = S.topics.indexOf(t); return S.topics[i + 1] || S.topics[0]; }

views.section = id => {
  const s = secOf(id); if (!s) return notFound();
  const ts = topicsOf(id);
  const groups = [...new Set(ts.map(t => t.group))];
  const m = ts.length ? ts.reduce((n, t) => n + mastery(t), 0) / ts.length : 0;
  return [
    h('div.hello', h('div.head', h('span.eyebrow', { style: cvar(id) }, h('i.side__dot', { style: cvar(id) }), s.tag), h('h1', s.name), h('p', s.desc)),
      h('div.row', ring(m, id), h('div.stack', { style: { gap: '6px' } }, h('a.btn.btn--primary.btn--sm', { href: '#/interview?s=' + id }, 'Собеседование по разделу'), h('a.btn.btn--sm', { href: '#/quiz?s=' + id }, 'Тест по разделу')))),
    ts.length ? null : h('div.empty', 'Темы раздела ещё не загружены.'),
    ...groups.map(g => h('section.group', h('h2', g), h('div.topics', ts.filter(t => t.group === g).map(t => {
      const mm = mastery(t); const seen = store.data.seen[t.id];
      return h('a.topic-card', { href: '#/t/' + t.id, style: cvar(id) },
        h('b', t.title), h('span.topic-card__meta', S.demos[t.id] ? h('span.badge-demo', 'интерактив') : null, levelChip(t.level)),
        h('p', t.summary), seen ? bar(mm, id) : null);
    })))),
  ];
};

views.topic = id => {
  const t = byId[id]; if (!t) return notFound();
  store.seeTopic(id);
  const ts = topicsOf(t.section); const i = ts.indexOf(t);
  const prev = ts[i - 1], next = ts[i + 1];
  const blocks = [];
  const toc = [];
  const block = (key, title, ...content) => { toc.push([key, title]); blocks.push(h('section.block', { id: 'b-' + key }, h('h2', title), ...content)); };
  if (S.demos[id]) {
    const holder = h('div.demo', { style: cvar(t.section) });
    toc.push(['demo', 'Интерактив']);
    blocks.push(h('section.block', { id: 'b-demo' }, h('h2', 'Посмотрите, как это работает'), holder));
    queueMicrotask(() => { try { S.demos[id](holder, t); } catch (e) { holder.append(h('p.demo__note', 'Демо не запустилось: ' + e.message)); console.error(e); } });
  }
  block('what', 'Что это', h('div.prose', paras(t.what)));
  const facts = [['Для чего', t.why], ['Когда использовать', t.when], ['Чем отличается', t.diff], ['В реальном проекте', t.real]].filter(f => f[1]);
  if (facts.length) blocks.push(h('div.facts', facts.map(([k, v], j) => h('div.fact' + (facts.length % 2 && j === facts.length - 1 ? '.fact--wide' : ''), h('h3', k), h('p', { html: fmtInline(v) })))));
  if (t.code && t.code.length) block('code', 'Примеры кода', codeExamples(t.code));
  if (t.pitfalls && t.pitfalls.length) block('pitfalls', 'Типичные ошибки', h('ul.pitfalls', t.pitfalls.map(p => h('li', h('span', { html: fmtInline(p) })))));
  if (t.questions && t.questions.length) block('questions', 'Что спросят на собеседовании', h('p.muted.small', 'Сначала ответьте сами, потом сверьтесь. Результат пойдёт в прогресс и в повторение.'), ...t.questions.map(q => qaCard(q, t)));
  const qz = S.quiz.filter(q => q.topic === id);
  if (qz.length) block('quiz', 'Проверка', ...qz.map(q => quizCard(q)));
  blocks.push(h('div.row', { style: { justifyContent: 'space-between' } },
    prev ? h('a.btn', { href: '#/t/' + prev.id }, '← ' + prev.title) : h('span'),
    next ? h('a.btn', { href: '#/t/' + next.id }, next.title + ' →') : h('a.btn', { href: '#/s/' + t.section }, 'К разделу')));
  return [
    h('div.head', { style: cvar(t.section) }, h('span.eyebrow', h('a', { href: '#/s/' + t.section, style: { textDecoration: 'none' } }, secOf(t.section).name), '·', t.group, '·', LEVEL_NAME[t.level] || ''), h('h1', t.title), h('p.lead', { style: cvar(t.section) }, t.summary)),
    h('div.topic', h('div.topic__body', blocks),
      h('nav.toc', toc.map(([k, title]) => h('a', { href: '#b-' + k, onclick: e => { e.preventDefault(); document.getElementById('b-' + k)?.scrollIntoView({ behavior: 'smooth' }); } }, title)),
        h('div.toc__nav', h('div.small.muted', 'Освоено ' + pct(mastery(t)) + '%'), bar(mastery(t), t.section),
          h('a.btn.btn--sm', { href: '#/interview?t=' + t.id }, 'Спросить по теме')))),
  ];
};
const paras = s => String(s || '').split(/\n\n+/).map(p => h('p', { html: fmtInline(p) }));
function codeExamples(list) {
  const isPair = list.length >= 2 && list.some(c => /^плохо/i.test(c.title)) && list.some(c => /^хорошо/i.test(c.title));
  if (!isPair) return h('div.code-tabs', list.map(c => codeBlock(c.src, c.lang, c.title)));
  /* «Плохо / Хорошо» pairs become a toggle so the refactoring is seen as one change */
  const rest = list.filter(c => !/^(плохо|хорошо)/i.test(c.title));
  const bad = list.filter(c => /^плохо/i.test(c.title)), good = list.filter(c => /^хорошо/i.test(c.title));
  const holder = h('div');
  const seg = h('div.seg');
  const show = which => {
    holder.innerHTML = '';
    holder.append(...(which === 'bad' ? bad : good).map(c => codeBlock(c.src, c.lang, c.title.replace(/^(плохо|хорошо):?\s*/i, ''), which === 'bad' ? 'bad' : 'good')));
    [...seg.children].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === which)));
  };
  seg.append(h('button', { type: 'button', 'data-k': 'bad', onclick: () => show('bad') }, 'Плохо'), h('button', { type: 'button', 'data-k': 'good', onclick: () => show('good') }, 'Хорошо'));
  show('bad');
  return h('div.code-tabs', h('div.row', seg, h('span.small.muted', 'Переключайте, чтобы увидеть рефакторинг')), holder, rest.map(c => codeBlock(c.src, c.lang, c.title)));
}

/* ---------- interview ---------- */
let iv = null;
views.interview = (arg, qs) => {
  if (iv && !qs.get('new') && !qs.get('t') && !qs.get('s')) return ivRender();
  iv = null;
  const lv = store.data.settings.level;
  const cfg = { secs: new Set(qs.get('s') ? [qs.get('s')] : SECTIONS.map(s => s.id)), level: lv, count: 7, weak: true, topic: qs.get('t') };
  if (cfg.topic && byId[cfg.topic]) { startInterview(cfg); return ivRender(); }
  return setupScreen('Собеседование', 'Интервьюер задаёт один вопрос. Вы отвечаете, как на настоящем собеседовании: вслух или тезисами. Потом отмечаете, какие ключевые мысли назвали, и сравниваете с эталонным ответом. Если ответ слабый, будет уточняющий вопрос.', cfg, () => { startInterview(cfg); render(); }, true);
};
function setupScreen(title, text, cfg, start, withLevel) {
  const secPills = h('div.pills', SECTIONS.map(s => { const b = h('button.pill', { type: 'button', style: cvar(s.id), 'aria-pressed': String(cfg.secs.has(s.id)), onclick: () => { cfg.secs.has(s.id) ? cfg.secs.delete(s.id) : cfg.secs.add(s.id); b.setAttribute('aria-pressed', String(cfg.secs.has(s.id))); } }, h('i.side__dot', { style: cvar(s.id) }), s.name); return b; }));
  const seg = (vals, key, names) => { const el = h('div.seg', vals.map(v => h('button', { type: 'button', 'aria-pressed': String(cfg[key] === v), onclick: e => { cfg[key] = v; [...el.children].forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } }, names ? names[v] : String(v)))); return el; };
  const weak = h('label.check', h('input', { type: 'checkbox', checked: cfg.weak, onchange: e => { cfg.weak = e.target.checked; } }), h('span', 'Сначала вопросы, на которые я ещё не отвечал или отвечал плохо'));
  return [h('div.head', h('span.eyebrow', 'Режим'), h('h1', title), h('p', text)),
    h('div.setup',
      h('div.setup__row', h('span', 'Разделы'), secPills),
      withLevel ? h('div.setup__row', h('span', 'Уровень'), seg(LEVELS, 'level', LEVEL_NAME)) : null,
      h('div.setup__row', h('span', 'Сколько вопросов'), seg(withLevel ? [5, 7, 10, 15] : [10, 20, 30], 'count')),
      h('div.setup__row', weak),
      h('div.row', h('button.btn.btn--primary', { type: 'button', onclick: () => { if (!cfg.secs.size) return toast('Выберите хотя бы один раздел'); start(); } }, icon('play', 14), 'Начать')))];
}
function startInterview(cfg) {
  const li = LEVELS.indexOf(cfg.level);
  let pool = S.topics.filter(t => cfg.topic ? t.id === cfg.topic : cfg.secs.has(t.section)).flatMap(t => t.questions.map(q => ({ q, t })));
  if (!cfg.topic) pool = pool.filter(x => LEVELS.indexOf(x.q.level || 'middle') <= li);
  const rank = x => { const c = store.card(x.q.id); return Math.random() + (x.q.level === cfg.level ? .6 : 0) + (cfg.weak ? (!c ? .8 : c.last < .8 ? 1.2 : 0) : 0); };
  pool = pool.map(x => [x, rank(x)]).sort((a, b) => b[1] - a[1]).map(x => x[0]);
  /* at most two questions per topic per session */
  const per = {}; const list = [];
  for (const x of pool) { if (list.length >= (cfg.topic ? 99 : cfg.count)) break; per[x.t.id] = (per[x.t.id] || 0) + 1; if (per[x.t.id] <= (cfg.topic ? 99 : 2)) list.push(x); }
  iv = { list, i: 0, scores: [], cfg, done: false };
}
function ivRender() {
  if (!iv.list.length) { iv = null; return [h('div.empty', 'Под эти настройки нет вопросов. Выберите другие разделы или уровень выше.', h('a.btn', { href: '#/interview?new=1' }, 'Настроить'))]; }
  if (iv.i >= iv.list.length) return ivSummary();
  const { q, t } = iv.list[iv.i];
  const nextBtn = h('button.btn.btn--primary', { type: 'button', hidden: true, onclick: () => { iv.i++; render(); window.scrollTo(0, 0); } }, iv.i + 1 < iv.list.length ? 'Следующий вопрос' : 'Итоги');
  const follow = h('div.row');
  const card = qaCard(q, t, { showTopic: true, autoOpen: true, onDone: score => {
    iv.scores[iv.i] = score; nextBtn.hidden = false;
    const extra = t.questions.find(x => !iv.list.some(y => y.q.id === x.id));
    if (score < .6 && extra) follow.append(h('button.btn', { type: 'button', onclick: e => { iv.list.splice(iv.i + 1, 0, { q: extra, t, follow: true }); e.currentTarget.remove(); toast('Уточняющий вопрос добавлен следующим'); } }, 'Уточняющий вопрос по теме'));
    follow.append(h('a.btn.btn--ghost', { href: '#/t/' + t.id }, 'Открыть тему'));
  } });
  return [h('div.session',
    h('div.session__top', h('span.session__count', 'Вопрос ' + (iv.i + 1) + ' из ' + iv.list.length), bar(iv.i / iv.list.length), h('a.btn.btn--ghost.btn--sm', { href: '#/interview?new=1', onclick: () => { iv = null; } }, 'Завершить')),
    iv.list[iv.i].follow ? h('p.small.muted', 'Уточняющий вопрос: интервьюер копает глубже в ту же тему.') : null,
    card, h('div.row', nextBtn, follow))];
}
function ivSummary() {
  const sc = iv.scores.filter(x => x != null);
  const avg = sc.length ? sc.reduce((a, b) => a + b, 0) / sc.length : 0;
  if (!iv.done) { iv.done = true; store.session({ type: 'interview', n: sc.length, score: avg, level: iv.cfg.level, secs: [...iv.cfg.secs] }); }
  const verdict = avg >= .8 ? 'Уверенно. На этом уровне вы проходите технический этап.' : avg >= .55 ? 'Близко. Основа есть, но ответы стоит сделать полнее: разберите вопросы ниже.' : 'Пока слабо. Пройдите темы ниже и повторите собеседование через день.';
  return [h('div.session',
    h('div.head', h('span.eyebrow', 'Итоги собеседования · ' + LEVEL_NAME[iv.cfg.level]), h('h1', pct(avg) + '%'), h('p', verdict)),
    h('div.results', iv.list.map((x, i) => h('a.res-row', { href: '#/t/' + x.t.id }, h('span', h('span.small.muted', x.t.title + ' · '), x.q.q), h('span.chip.' + (iv.scores[i] >= .8 ? 'chip--ok' : iv.scores[i] >= .4 ? 'chip--warn' : 'chip--bad'), iv.scores[i] == null ? '—' : pct(iv.scores[i]) + '%')))),
    h('div.row', h('a.btn.btn--primary', { href: '#/interview?new=1', onclick: () => { iv = null; } }, 'Ещё раз'), h('a.btn', { href: '#/review' }, 'К повторению')))];
}

/* ---------- quiz ---------- */
let qz = null;
views.quiz = (arg, qs) => {
  if (qz && !qs.get('new') && !qs.get('s')) return qzRender();
  qz = null;
  const cfg = { secs: new Set(qs.get('s') ? [qs.get('s')] : SECTIONS.map(s => s.id)), count: 10, weak: false };
  return setupScreen('Быстрый тест', 'Вопросы с вариантами: один верный, несколько верных и «что выведет код». После каждого ответа — объяснение.', cfg, () => {
    let pool = S.quiz.filter(q => byId[q.topic] && cfg.secs.has(byId[q.topic].section));
    pool = cfg.weak ? pool.map(q => [q, Math.random() + (store.card(q.id) ? (store.card(q.id).last < 1 ? 1 : 0) : .8)]).sort((a, b) => b[1] - a[1]).map(x => x[0]) : shuffle(pool);
    qz = { list: pool.slice(0, cfg.count), i: 0, scores: [], done: false };
    render();
  });
};
function qzRender() {
  if (!qz.list.length) { qz = null; return [h('div.empty', 'В выбранных разделах пока нет тестов.', h('a.btn', { href: '#/quiz?new=1' }, 'Настроить'))]; }
  if (qz.i >= qz.list.length) {
    const ok = qz.scores.filter(Boolean).length;
    if (!qz.done) { qz.done = true; store.session({ type: 'quiz', n: qz.list.length, score: ok / qz.list.length }); }
    return [h('div.session', h('div.head', h('span.eyebrow', 'Итоги теста'), h('h1', ok + ' из ' + qz.list.length), h('p', 'Ошибки уже добавлены в повторение.')),
      h('div.results', qz.list.map((q, i) => h('a.res-row', { href: '#/t/' + q.topic }, h('span', q.q), h('span.chip.' + (qz.scores[i] ? 'chip--ok' : 'chip--bad'), qz.scores[i] ? 'верно' : 'ошибка')))),
      h('div.row', h('a.btn.btn--primary', { href: '#/quiz?new=1', onclick: () => { qz = null; } }, 'Новый тест'), h('a.btn', { href: '#/review' }, 'К повторению')))];
  }
  const next = h('button.btn.btn--primary', { type: 'button', hidden: true, onclick: () => { qz.i++; render(); window.scrollTo(0, 0); } }, qz.i + 1 < qz.list.length ? 'Дальше' : 'Итоги');
  return [h('div.session', h('div.session__top', h('span.session__count', (qz.i + 1) + ' / ' + qz.list.length), bar(qz.i / qz.list.length), h('a.btn.btn--ghost.btn--sm', { href: '#/quiz?new=1', onclick: () => { qz = null; } }, 'Завершить')),
    quizCard(qz.list[qz.i], { showTopic: true, onDone: s => { qz.scores[qz.i] = s; next.hidden = false; next.focus(); } }), h('div.row', next))];
}

/* ---------- review (spaced repetition) ---------- */
let rv = null;
views.review = (arg, qs) => {
  if (rv && !qs.get('new')) return rvRender();
  rv = null;
  const due = S.dueCards();
  const errs = S.mistakes();
  const fixed = errs.filter(([, c]) => c.last >= .8);
  return [
    h('div.head', h('span.eyebrow', 'Режим'), h('h1', 'Повторение'), h('p', 'Неверные и неполные ответы попадают сюда автоматически. Слабые вопросы возвращаются через 10 минут и через день, освоенные — через неделю, две, месяц.')),
    h('div.grid.grid--3', stat(String(due.length), 'ждут повторения сейчас'), stat(String(errs.length), 'вопросов с ошибками за всё время'), stat(String(fixed.length), 'из них уже исправлено')),
    h('div.row', h('button.btn.btn--primary', { type: 'button', disabled: !due.length, onclick: () => { rv = { list: due.slice(0, 15).map(([id]) => id), i: 0, scores: [] }; render(); } }, icon('play', 14), due.length ? 'Повторить ' + Math.min(15, due.length) : 'Сейчас повторять нечего'),
      errs.length ? h('button.btn', { type: 'button', onclick: () => { rv = { list: shuffle(errs.map(([id]) => id)).slice(0, 15), i: 0, scores: [] }; render(); } }, 'Прогнать все ошибки') : null),
    errs.length ? h('div.card', h('div.card__head', h('h2', 'История ошибок'), h('span.small.muted', 'точки — последние попытки, слева направо')),
      h('div.list', errs.map(([id, c]) => { const x = qIndex[id]; return h('a.list__item', { href: '#/t/' + x.topic.id },
        h('span', x.item.q, h('br'), h('small', x.topic.title + ' · ' + (c.due <= Date.now() ? 'пора повторить' : 'следующий раз ' + when(c.due)))),
        h('span', { style: { display: 'flex', gap: '3px' } }, c.hist.slice(-8).map(([, s]) => h('i', { title: pct(s) + '%', style: { width: '8px', height: '8px', borderRadius: '50%', background: s >= .8 ? 'var(--ok)' : s >= .4 ? 'var(--warn)' : 'var(--bad)' } }))),
        h('span.chip.' + (c.last >= .8 ? 'chip--ok' : c.last >= .4 ? 'chip--warn' : 'chip--bad'), pct(c.last) + '%')); })))
      : h('div.empty', 'Ошибок пока нет. Пройдите собеседование или тест — сюда попадёт всё, что вызвало затруднения.', h('a.btn', { href: '#/interview' }, 'К собеседованию')),
  ];
};
function when(ts) { const d = Math.round((ts - Date.now()) / S.DAY); return d <= 0 ? 'сегодня' : d === 1 ? 'завтра' : 'через ' + d + ' ' + plural(d, 'день', 'дня', 'дней'); }
function rvRender() {
  if (rv.i >= rv.list.length) {
    const ok = rv.scores.filter(s => s >= .8).length;
    if (!rv.done) { rv.done = true; store.session({ type: 'review', n: rv.list.length, score: rv.scores.reduce((a, b) => a + b, 0) / rv.list.length }); }
    return [h('div.session', h('div.head', h('span.eyebrow', 'Повторение завершено'), h('h1', ok + ' из ' + rv.list.length + ' уверенно'), h('p', 'Освоенные вопросы ушли на более длинный интервал, остальные вернутся скоро.')), h('div.row', h('a.btn.btn--primary', { href: '#/review?new=1', onclick: () => { rv = null; } }, 'Готово')))];
  }
  const x = qIndex[rv.list[rv.i]];
  const next = h('button.btn.btn--primary', { type: 'button', hidden: true, onclick: () => { rv.i++; render(); window.scrollTo(0, 0); } }, rv.i + 1 < rv.list.length ? 'Дальше' : 'Итоги');
  const onDone = s => { rv.scores[rv.i] = s; next.hidden = false; };
  return [h('div.session', h('div.session__top', h('span.session__count', (rv.i + 1) + ' / ' + rv.list.length), bar(rv.i / rv.list.length), h('a.btn.btn--ghost.btn--sm', { href: '#/review?new=1', onclick: () => { rv = null; } }, 'Завершить')),
    x.kind === 'q' ? qaCard(x.item, x.topic, { showTopic: true, onDone, autoOpen: true }) : quizCard(x.item, { showTopic: true, onDone }), h('div.row', next))];
}

/* ---------- practice ---------- */
let pFilter = 'all';
views.practice = id => {
  if (id) return taskView(id);
  const secs = [...new Set(S.tasks.map(t => t.section))];
  const seg = h('div.seg', ['all', ...secs].map(s => h('button', { type: 'button', 'aria-pressed': String(pFilter === s), onclick: () => { pFilter = s; render(); } }, s === 'all' ? 'Все' : secOf(s).tag)));
  const list = S.tasks.filter(t => pFilter === 'all' || t.section === pFilter);
  return [h('div.head', h('span.eyebrow', 'Режим'), h('h1', 'Практика'), h('p', 'Задачи двух видов. «Код» — пишете решение в редакторе, тесты запускаются прямо в браузере. «Разбор» — находите проблемы в чужом коде и сверяетесь со списком.')),
    seg,
    h('div.tasks', list.map(t => { const st = store.data.tasks[t.id] || {}; return h('a.task-card', { href: '#/practice/' + t.id, style: cvar(t.section) },
      h('div.row', secChip(t.section), h('span.chip', t.kind === 'review' ? 'Разбор' : 'Код'), levelChip(t.level), st.solved ? h('span.chip.chip--ok', 'решено') : st.code || st.notes ? h('span.chip.chip--warn', 'в процессе') : null),
      h('b', t.title), h('p', t.brief)); }))];
};
function taskView(id) {
  const t = S.tasks.find(x => x.id === id); if (!t) return notFound();
  const st = store.data.tasks[id] || {};
  const i = S.tasks.indexOf(t); const nxt = S.tasks[i + 1];
  const head = h('div.head', { style: cvar(t.section) }, h('span.eyebrow', h('a', { href: '#/practice', style: { textDecoration: 'none' } }, 'Практика'), '·', secOf(t.section).name, '·', t.kind === 'review' ? 'Разбор кода' : 'Код с тестами'), h('h1', t.title));
  const desc = h('div.prose', paras(t.desc));
  const solution = h('div.stack');
  const showSolution = h('button.btn.btn--ghost', { type: 'button', onclick: () => { solution.innerHTML = ''; solution.append(h('h2', { style: { fontSize: '17px' } }, 'Эталонное решение'), codeBlock(t.solution, t.lang || 'js'), t.notes ? h('div.prose', paras(t.notes)) : null); showSolution.remove(); } }, 'Показать решение');
  const footer = h('div.row', { style: { justifyContent: 'space-between' } }, h('a.btn', { href: '#/practice' }, '← Все задачи'), nxt ? h('a.btn', { href: '#/practice/' + nxt.id }, nxt.title + ' →') : h('span'));

  if (t.kind === 'review') {
    const notes = h('textarea.input', { rows: 6, placeholder: 'Какие проблемы вы видите и как бы исправили? Пишите тезисами.' });
    notes.value = st.notes || '';
    notes.addEventListener('input', () => store.task(id, { notes: notes.value }));
    const area = h('div.stack');
    const go = h('button.btn.btn--primary', { type: 'button', onclick: () => {
      go.remove();
      const checks = t.issues.map(k => ({ k, input: h('input', { type: 'checkbox', checked: notes.value.trim() && keyHit(notes.value, k) }) }));
      const grade = h('button.btn.btn--primary', { type: 'button', onclick: () => {
        const got = checks.filter(c => c.input.checked).length / checks.length;
        checks[0].input.closest('.qa__keys').replaceChildren(...points(checks.map(c => [c.k, c.input.checked ? 'ok' : 'miss'])));
        grade.remove();
        store.task(id, { solved: got >= .7, score: got });
        area.append(h('div.verdict.verdict--' + (got >= .8 ? 'ok' : got >= .4 ? 'mid' : 'bad'), ring(got), h('b', 'Найдено ' + pct(got) + '% проблем')), h('h2', { style: { fontSize: '17px' } }, 'Исправленный вариант'), codeBlock(t.solution, t.lang || 'vue'), t.notes ? h('div.prose', paras(t.notes)) : null);
        renderSide(current);
      } }, 'Оценить');
      area.append(h('b', 'Какие проблемы вы нашли?'), h('div.qa__keys', checks.map(c => h('label.check', c.input, h('span', c.k)))), h('div.row', grade));
    } }, 'Сверить');
    return [head, h('div.task', desc, codeBlock(t.code, t.lang || 'vue', 'Код на ревью'), h('label.field', h('span', 'Ваш разбор'), notes), h('div.row', go), area), footer];
  }

  const ed = editor(st.code || t.starter, t.lang || 'js', v => store.task(id, { code: v }));
  const out = h('div.stack');
  const run = h('button.btn.btn--primary', { type: 'button', onclick: () => runTests(t, ed.value, out, run) }, icon('play', 14), 'Запустить тесты');
  const reset = h('button.btn.btn--ghost', { type: 'button', onclick: () => { if (confirm('Вернуть стартовый код? Ваше решение сотрётся.')) ed.value = t.starter; } }, 'Сбросить');
  ed.el.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run.click(); } });
  return [head, h('div.task',
    h('div.task__layout',
      h('div.stack', desc, h('div.tests', h('b', { style: { fontSize: '14px' } }, 'Тесты'), t.tests.map(x => h('div.test', h('i', '·'), h('span', x.name))))),
      h('div.stack', ed.el, h('div.row', run, reset, h('span.small.muted', '⌘/Ctrl + Enter')), out)),
    h('div.row', showSolution), solution), footer];
}
/* Runs user code + tests in a throwaway worker: no access to the page, killed after 4 s (infinite loops). */
const WORKER_SRC = `
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fmt = v => { try { return typeof v === 'string' ? JSON.stringify(v) : v === undefined ? 'undefined' : typeof v === 'function' ? 'function' : JSON.stringify(v, (k, x) => x instanceof Map ? { Map: [...x] } : x instanceof Set ? { Set: [...x] } : x) ; } catch (e) { return String(v); } };
function assert(c, msg) { if (!c) throw new Error(msg || 'условие не выполнено'); }
function eq(a, b, msg) { const sa = fmt(a), sb = fmt(b); if (sa !== sb) throw new Error((msg ? msg + ': ' : '') + 'ожидали ' + sb + ', получили ' + sa); }
const logs = [];
console.log = (...a) => logs.push(a.map(x => typeof x === 'string' ? x : fmt(x)).join(' '));
self.onmessage = async ({ data }) => {
  let api;
  try { api = new Function('sleep', data.code + '\\n;return {' + data.exports.join(',') + '};')(sleep); }
  catch (e) { postMessage({ fatal: e.name + ': ' + e.message, logs }); return; }
  const results = [];
  for (const t of data.tests) {
    try {
      await new Function('api', 'sleep', 'assert', 'eq', 'const {' + data.exports.join(',') + '} = api; return (async () => {' + t.code + '\\n})();')(api, sleep, assert, eq);
      results.push({ name: t.name, ok: true });
    } catch (e) { results.push({ name: t.name, ok: false, err: e && e.message || String(e) }); }
  }
  postMessage({ results, logs });
};`;
let workerUrl = null;
function runTests(t, code, out, btn) {
  workerUrl = workerUrl || URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' }));
  const w = new Worker(workerUrl);
  btn.disabled = true; out.innerHTML = ''; out.append(h('p.small.muted', 'Выполняю…'));
  const kill = setTimeout(() => { w.terminate(); done({ fatal: 'Тесты не уложились в 4 секунды. Похоже на бесконечный цикл или промис, который никогда не завершается.' }); }, 4000);
  w.onmessage = e => { clearTimeout(kill); w.terminate(); done(e.data); };
  w.onerror = e => { e.preventDefault(); clearTimeout(kill); w.terminate(); done({ fatal: e.message }); };
  w.postMessage({ code, tests: t.tests, exports: t.exports });
  function done(r) {
    btn.disabled = false; out.innerHTML = '';
    if (r.fatal) out.append(h('div.verdict.verdict--bad', h('div', h('b', 'Код не запустился'), h('p.small.mono', r.fatal))));
    else {
      const ok = r.results.filter(x => x.ok).length;
      const all = ok === r.results.length;
      out.append(h('div.verdict.verdict--' + (all ? 'ok' : ok ? 'mid' : 'bad'), h('b', all ? 'Все тесты прошли' : 'Прошло ' + ok + ' из ' + r.results.length)),
        h('div.tests', r.results.map(x => h('div.test.test--' + (x.ok ? 'ok' : 'bad'), h('i', x.ok ? '✓' : '✕'), h('span', x.name), x.err ? h('small', x.err) : null))));
      if (all) { store.task(t.id, { solved: true }); renderSide(current); }
      if (all && t.review) out.append(h('div.qa__model', h('h4', 'Проверьте себя дальше'), h('ul', { style: { margin: 0, paddingLeft: '18px' } }, t.review.map(x => h('li', x)))));
    }
    if (r.logs && r.logs.length) out.append(h('div.log', r.logs.slice(0, 50).map(l => h('div', l))));
  }
}

/* ---------- progress ---------- */
views.progress = () => {
  const d = store.data;
  const fileIn = h('input', { type: 'file', accept: 'application/json', hidden: true, onchange: e => { const f = e.target.files[0]; if (!f) return; f.text().then(txt => { try { store.import(txt); toast('Прогресс загружен'); render(); } catch (err) { toast('Не получилось прочитать файл'); } }); } });
  const typeName = { interview: 'Собеседование', quiz: 'Тест', review: 'Повторение' };
  return [
    h('div.head', h('span.eyebrow', 'Статистика'), h('h1', 'Прогресс'), h('p', 'Освоение считается по последним ответам на вопросы и тесты темы. Непройденные вопросы считаются как ноль.')),
    h('div.card', h('div.stack', SECTIONS.map(s => { const ts = topicsOf(s.id); const m = ts.length ? ts.reduce((n, t) => n + mastery(t), 0) / ts.length : 0;
      return h('a', { href: '#/s/' + s.id, style: { display: 'grid', gridTemplateColumns: '180px 1fr 48px', gap: '14px', alignItems: 'center', textDecoration: 'none' } }, h('span', h('i.side__dot', { style: Object.assign({ display: 'inline-block', marginRight: '8px' }, cvar(s.id)) }), s.name), bar(m, s.id), h('span.small.mono', pct(m) + '%')); }))),
    h('div.card', h('div.card__head', h('h2', 'Слабые темы')), (() => { const w = S.topics.filter(t => answered(t)).map(t => [t, mastery(t)]).sort((a, b) => a[1] - b[1]).slice(0, 8);
      return w.length ? h('div.list', w.map(([t, m]) => h('a.list__item', { href: '#/t/' + t.id }, h('span', t.title), h('small', pct(m) + '%')))) : h('p.small.muted', 'Появятся после первых ответов.'); })()),
    h('div.card', h('div.card__head', h('h2', 'История занятий')), d.sessions.length ? h('div.list', d.sessions.slice(0, 20).map(s => h('div.list__item', h('span', typeName[s.type] || s.type, s.level ? ' · ' + LEVEL_NAME[s.level] : ''), h('small', new Date(s.at).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' · ' + s.n + ' вопр.'), h('span.chip.' + (s.score >= .8 ? 'chip--ok' : s.score >= .5 ? 'chip--warn' : 'chip--bad'), pct(s.score) + '%')))) : h('p.small.muted', 'Здесь будут собеседования, тесты и повторения.')),
    h('div.card', h('div.card__head', h('h2', 'Данные')), h('p.small.muted', { style: { marginBottom: '12px' } }, 'Прогресс хранится только в этом браузере. Чтобы перенести на другое устройство, выгрузите файл и загрузите его там.'),
      h('div.row', h('button.btn', { type: 'button', onclick: () => { const a = h('a', { href: URL.createObjectURL(new Blob([store.export()], { type: 'application/json' })), download: 'sobes-progress.json' }); a.click(); } }, 'Выгрузить'),
        h('button.btn', { type: 'button', onclick: () => fileIn.click() }, 'Загрузить'), fileIn,
        h('button.btn.btn--bad', { type: 'button', onclick: () => { if (confirm('Стереть весь прогресс? Это не отменить.')) { store.reset(); render(); toast('Прогресс сброшен'); } } }, 'Сбросить всё'))),
  ];
};
function notFound() { return [h('div.empty', 'Такой страницы нет.', h('a.btn', { href: '#/' }, 'На обзор'))]; }

/* ---------- router ---------- */
let current = '';
function render() {
  const raw = location.hash.replace(/^#\/?/, '');
  if (raw.startsWith('b-')) return; // in-page anchors
  const [path, query] = raw.split('?');
  const qs = new URLSearchParams(query || '');
  const [name, arg] = path.split(/\/(.*)/);
  const fn = { '': views.home, s: views.section, t: views.topic, interview: views.interview, quiz: views.quiz, review: views.review, practice: views.practice, progress: views.progress }[name];
  current = path;
  renderSide(path);
  view.innerHTML = '';
  view.append(...[].concat(fn ? fn(arg, qs) : notFound()).filter(Boolean));
  const title = view.querySelector('h1');
  document.title = (title && path ? title.textContent + ' · ' : '') + 'Собес';
  closeSide();
}
let lastPath = null;
window.addEventListener('hashchange', () => { const p = location.hash.split('?')[0]; render(); if (p !== lastPath) window.scrollTo(0, 0); lastPath = p; });

/* ---------- search ---------- */
const q = $('#q'); const sr = $('#searchResults');
let srIdx = 0;
function searchIndex() {
  return S.searchIdx || (S.searchIdx = [
    ...S.topics.map(t => ({ href: '#/t/' + t.id, title: t.title, sec: t.section, sub: t.summary, text: [t.title, t.summary, t.what, t.group].join(' ').toLowerCase(), w: 3 })),
    ...S.topics.flatMap(t => t.questions.map(x => ({ href: '#/t/' + t.id, title: x.q, sec: t.section, sub: 'Вопрос · ' + t.title, text: (x.q + ' ' + x.keys.join(' ')).toLowerCase(), w: 1 }))),
    ...S.tasks.map(t => ({ href: '#/practice/' + t.id, title: t.title, sec: t.section, sub: 'Задача · ' + t.brief, text: (t.title + ' ' + t.brief).toLowerCase(), w: 2 })),
  ]);
}
q.addEventListener('input', () => {
  const v = q.value.trim().toLowerCase();
  if (!v) { sr.hidden = true; return; }
  const words = v.split(/\s+/);
  const res = searchIndex().map(x => [x, words.every(w => x.text.includes(w)) ? x.w + (x.title.toLowerCase().includes(v) ? 5 : 0) : 0]).filter(x => x[1]).sort((a, b) => b[1] - a[1]).slice(0, 12);
  sr.innerHTML = ''; srIdx = 0;
  sr.append(...(res.length ? res.map(([x], i) => h('a.sr' + (i === 0 ? '.is-active' : ''), { href: x.href, onclick: () => { sr.hidden = true; q.value = ''; } }, h('span.chip.chip--c', { style: cvar(x.sec) }, secOf(x.sec).tag), h('b', x.title), h('small', x.sub))) : [h('div.sr__empty', 'Ничего не нашлось')]));
  sr.hidden = false;
});
q.addEventListener('keydown', e => {
  const items = [...sr.querySelectorAll('.sr')];
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); srIdx = (srIdx + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length; items.forEach((x, i) => x.classList.toggle('is-active', i === srIdx)); items[srIdx]?.scrollIntoView({ block: 'nearest' }); }
  else if (e.key === 'Enter' && items[srIdx]) { items[srIdx].click(); location.hash = items[srIdx].getAttribute('href'); q.blur(); }
  else if (e.key === 'Escape') { sr.hidden = true; q.blur(); }
});
document.addEventListener('click', e => { if (!e.target.closest('.search, .search-results')) sr.hidden = true; });
document.addEventListener('keydown', e => { if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); q.focus(); } });

/* ---------- chrome ---------- */
$('#themeBtn').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('sobes:theme', next); } catch (e) {}
});
const side = $('#side'), scrim = $('#scrim');
function closeSide() { side.classList.remove('is-open'); scrim.hidden = true; }
$('#menuBtn').addEventListener('click', () => { side.classList.add('is-open'); scrim.hidden = false; });
scrim.addEventListener('click', closeSide);

Object.assign(S, { render, qaCard, quizCard, icon });
render();
})();
