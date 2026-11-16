/* App: hash router — interview questions (home, branch) and the cheat sheet (topics, section, topic) — plus search. */
(() => {
const S = window.SOBES;
const { $, $$, h, esc, codeBlock, SECTIONS, secOf, LEVEL_NAME, byId, recall } = S;
S.indexContent();
const view = $('#view');
/* topics of a section ordered by group (first appearance), so sidebar, cards and prev/next agree */
const topicsOf = sec => {
  const ts = S.topics.filter(t => t.section === sec);
  const groups = [...new Set(ts.map(t => t.group))];
  return groups.flatMap(g => ts.filter(t => t.group === g));
};
const cvar = sec => ({ '--c': 'var(--c-' + sec + ')' });
const plural = (n, a, b, c) => n % 10 === 1 && n % 100 !== 11 ? a : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? b : c;
/* inline `code` in plain strings */
const fmt = s => esc(s || '').replace(/`([^`]+)`/g, '<code>$1</code>');
const paras = s => String(s || '').split(/\n\n+/).map(p => h('p', { html: fmt(p) }));

/* ---------- interview plan (board questions) ---------- */
const PLAN = S.plan || { tips: [], branches: [] };
const bvar = b => ({ '--c': ['bad', 'warn'].includes(b.color) ? 'var(--' + b.color + ')' : 'var(--c-' + b.color + ')' });
PLAN.branches.forEach(b => { let n = 0; b.groups.forEach(g => g.items.forEach(it => { it.id = b.id + '-' + (++n); it.branch = b; })); b.items = b.groups.flatMap(g => g.items); });
const allQ = PLAN.branches.flatMap(b => b.items);
const known = (() => {
  let set; try { set = new Set(JSON.parse(localStorage.getItem('sobes:known') || '[]')); } catch (e) { set = new Set(); }
  const save = () => { try { localStorage.setItem('sobes:known', JSON.stringify([...set])); } catch (e) {} };
  return { has: id => set.has(id), toggle: id => { set.has(id) ? set.delete(id) : set.add(id); save(); }, count: items => items.filter(i => set.has(i.id)).length, clear: () => { set.clear(); save(); } };
})();
let planFilter = 'all';
try { planFilter = localStorage.getItem('sobes:filter') || 'all'; } catch (e) {}
const progress = items => { const k = known.count(items); return h('span.prog', h('i', h('b', { style: { width: (items.length ? k / items.length * 100 : 0) + '%' } })), h('small', 'готово ' + k + ' из ' + items.length)); };

function questionItem(it, open) {
  const box = h('input', { type: 'checkbox', checked: known.has(it.id) || null, 'aria-label': 'Готов ответить', onchange: () => { known.toggle(it.id); item.classList.toggle('is-known', known.has(it.id)); refreshProgress(); } });
  const links = it.links.map(id => byId[id]).filter(Boolean);
  const item = h('details.qa' + (known.has(it.id) ? '.is-known' : ''), { id: 'q-' + it.id, open: open || null },
    h('summary', h('span', { html: fmt(it.q) })),
    h('div.qa__a', paras(it.a),
      it.code ? h('div.stack', it.code.map(c => codeBlock(c.src, c.lang, c.title))) : null,
      h('div.qa__foot',
        h('label.qa__known', box, h('span', 'Готов ответить')),
        links.length ? h('div.qa__links', h('small', 'Подробнее:'), links.map(t => h('a', { href: '#/t/' + t.id, style: cvar(t.section) }, t.title))) : null)));
  return item;
}
function refreshProgress() {
  $$('[data-prog]').forEach(el => { const id = el.dataset.prog; el.replaceChildren(progress(id === 'all' ? allQ : PLAN.branches.find(b => b.id === id).items)); });
  renderSideCounts();
}
function filterBar(holder) {
  const seg = h('div.seg');
  const apply = () => { holder.classList.toggle('only-todo', planFilter === 'todo'); [...seg.children].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === planFilter))); };
  seg.append(...[['all', 'Все вопросы'], ['todo', 'Только неготовые']].map(([k, label]) => h('button', { type: 'button', 'data-k': k, onclick: () => { planFilter = k; try { localStorage.setItem('sobes:filter', k); } catch (e) {} apply(); } }, label)));
  queueMicrotask(apply);
  const toggle = h('button.link-btn', { type: 'button', onclick: () => { const all = $$('details.qa', holder); const open = !all.every(d => d.open); all.forEach(d => { d.open = open; }); toggle.textContent = open ? 'Свернуть ответы' : 'Развернуть ответы'; } }, 'Развернуть ответы');
  return h('div.qbar', seg, toggle);
}
function planHome() {
  return [
    h('header.hero',
      h('p.eyebrow', 'Подготовка к собеседованию · Senior Frontend'),
      h('h1', 'Вопросы с собеседования'),
      h('p.hero__lead', 'Технические вопросы с доски «Frontend интервью», ветки Angular и React заменены на Vue 3 и Nuxt. Сначала ответьте вслух сами, потом откройте ответ. Отметка «Готов ответить» сохраняется в браузере.'),
      h('div.hero__prog', { 'data-prog': 'all' }, progress(allQ))),
    PLAN.tips.length ? h('aside.simple', { style: { '--c': 'var(--warn)' } }, h('span', 'Перед собесом'), h('ul.tips', PLAN.tips.map(t => h('li', { html: fmt(t) })))) : null,
    h('div.branches', PLAN.branches.map(b => h('a.branch', { href: '#/q/' + b.id, style: bvar(b) },
      h('div.branch__head', h('i.dot'), h('b', b.name)),
      h('p', b.groups.map(g => g.name.replace(/\s*\(.*\)$/, '')).join(' · ')),
      h('div', { 'data-prog': b.id }, progress(b.items))))),
    h('p.legend', 'Подробная шпаргалка по темам — ', h('a', { href: '#/topics' }, 'все темы'), '.'),
  ];
}
function planBranch(arg) {
  const [id, openId] = (arg || '').split('/');
  const i = PLAN.branches.findIndex(b => b.id === id); const b = PLAN.branches[i];
  if (!b) return notFound();
  const prev = PLAN.branches[i - 1], next = PLAN.branches[i + 1];
  const holder = h('div.qlist', b.groups.map(g => h('section.group', h('h2', g.name), h('div.faq', g.items.map(it => questionItem(it, it.id === openId))))));
  if (openId) setTimeout(() => document.getElementById('q-' + openId)?.scrollIntoView({ block: 'start' }), 0);
  return [h('div.qpage', { style: bvar(b) },
    h('header.page-head', h('p.eyebrow', h('a', { href: '#/' }, h('i.dot'), 'Вопросы'), h('span', '/'), h('span', b.items.length + ' ' + plural(b.items.length, 'вопрос', 'вопроса', 'вопросов'))), h('h1', b.name), b.note ? h('p.note', b.note) : null, h('div', { 'data-prog': b.id }, progress(b.items))),
    filterBar(holder), holder,
    h('nav.pager', prev ? h('a', { href: '#/q/' + prev.id }, h('small', '← Назад'), h('b', prev.name)) : h('a', { href: '#/' }, h('small', '← Назад'), h('b', 'Все вопросы')), next ? h('a.pager__next', { href: '#/q/' + next.id }, h('small', 'Дальше →'), h('b', next.name)) : h('a.pager__next', { href: '#/' }, h('small', 'Конец'), h('b', 'Все вопросы'))))];
}

/* ---------- sidebar ---------- */
function renderSideCounts() { $$('[data-side-count]').forEach(el => { const b = PLAN.branches.find(x => x.id === el.dataset.sideCount); el.textContent = known.count(b.items) + '/' + b.items.length; }); }
function renderSide(route, topic) {
  const nav = $('#sideNav'); nav.innerHTML = '';
  const cur = topic ? topic.section : route.startsWith('s/') ? route.slice(2) : null;
  const curB = route.startsWith('q/') ? route.slice(2).split('/')[0] : null;
  nav.append(h('p.side__title', 'Вопросы с собеса'));
  nav.append(h('a.side__link', { href: '#/', 'aria-current': route === '' ? 'page' : null }, 'Все вопросы'));
  PLAN.branches.forEach(b => nav.append(h('a.side__link', { href: '#/q/' + b.id, style: bvar(b), 'aria-current': curB === b.id ? 'page' : null }, h('i.dot'), h('span', b.name), h('small', { 'data-side-count': b.id }))));
  renderSideCounts();
  nav.append(h('p.side__title', 'Шпаргалка'));
  nav.append(h('a.side__link', { href: '#/topics', 'aria-current': route === 'topics' ? 'page' : null }, 'Все темы'));
  SECTIONS.forEach(s => {
    const ts = topicsOf(s.id);
    const open = s.id === cur;
    nav.append(h('div.side__sec' + (open ? '.is-open' : ''), { style: cvar(s.id) },
      h('a.side__link.side__link--sec', { href: '#/s/' + s.id, 'aria-current': route === 's/' + s.id ? 'page' : null }, h('i.dot'), h('span', s.name), h('small', String(ts.length))),
      open ? h('div.side__topics', ts.map(t => h('a.side__topic', { href: '#/t/' + t.id, 'aria-current': topic && topic.id === t.id ? 'page' : null }, t.title))) : null));
  });
  const active = nav.querySelector('.side__topic[aria-current]');
  if (active) active.scrollIntoView({ block: 'nearest' });
}

/* ---------- home ---------- */
function home() {
  const last = byId[recall.last];
  return [
    h('header.hero',
      h('p.eyebrow', h('a', { href: '#/' }, '← Вопросы с собеса'), h('span', '/'), h('span', 'Шпаргалка')),
      h('h1', 'Что это, зачем и чем отличается'),
      h('p.hero__lead', 'JavaScript, браузер, Vue 3, Nuxt 3, TypeScript, тестирование, производительность и принципы проектирования. В каждой теме точное определение и механизм, где это встречается, чем отличается от похожего, пример и вопросы с собеседования с готовыми ответами.'),
      h('p.note', h('b', 'Версии. '), 'Материал рассчитан на Vue 3.5+ и Nuxt 3. Где возможность появилась позже или ведёт себя иначе в Nuxt 4, это указано в теме. Примеры сверяйте с версией своего проекта.'),
      last ? h('a.resume', { href: '#/t/' + last.id, style: cvar(last.section) }, h('span', 'Вы остановились на'), h('b', last.title), h('i', '→')) : null),
    h('div.index', SECTIONS.map(s => {
      const ts = topicsOf(s.id);
      const groups = [...new Set(ts.map(t => t.group))];
      return h('section.index__sec', { style: cvar(s.id) },
        h('a.index__head', { href: '#/s/' + s.id }, h('span.tag', s.tag), h('h2', s.name), h('small', ts.length + ' ' + plural(ts.length, 'тема', 'темы', 'тем'))),
        groups.map(g => h('div.index__group', groups.length > 1 ? h('h3', g) : null,
          h('div.index__links', ts.filter(t => t.group === g).map(t => h('a', { href: '#/t/' + t.id }, t.title, S.demos[t.id] ? h('i.live', { title: 'Есть интерактивный пример' }) : null))))));
    })),
    h('p.legend', h('i.live'), ' — в теме есть интерактивный пример'),
  ];
}

/* ---------- section ---------- */
function section(id) {
  const s = secOf(id); if (!s) return notFound();
  const ts = topicsOf(id);
  const groups = [...new Set(ts.map(t => t.group))];
  return [
    h('header.page-head', { style: cvar(id) }, h('p.eyebrow', h('i.dot'), s.tag), h('h1', s.name), h('p.page-head__lead', s.desc)),
    ...groups.map(g => h('section.group', h('h2', g), h('div.cards', ts.filter(t => t.group === g).map(t =>
      h('a.card', { href: '#/t/' + t.id, style: cvar(id) }, h('b', t.title), h('p', { html: fmt(t.summary) }), S.demos[t.id] ? h('span.card__live', h('i.live'), 'интерактив') : null))))),
  ];
}

/* ---------- topic ---------- */
function topic(id) {
  const t = byId[id]; if (!t) return notFound();
  recall.last = id;
  const ts = topicsOf(t.section); const i = ts.indexOf(t);
  const prev = ts[i - 1], next = ts[i + 1];
  const blocks = [], toc = [];
  const block = (key, title, ...content) => { toc.push([key, title]); blocks.push(h('section.block', { id: 'b-' + key }, h('h2', title), ...content)); };

  if (t.what) block('what', 'Что это', h('div.prose', paras(t.what)));
  const analogy = t.analogy || t.simple;
  if (analogy) blocks.push(h('aside.simple', h('span', 'Образ для запоминания'), h('p', { html: fmt(analogy) })));
  if (S.demos[id]) {
    const holder = h('div.demo');
    toc.push(['demo', 'Как это работает']);
    blocks.push(h('section.block', { id: 'b-demo' }, h('h2', 'Как это работает'), holder));
    queueMicrotask(() => { try { S.demos[id](holder, t); } catch (e) { holder.append(h('p.demo__note', 'Пример не запустился: ' + e.message)); console.error(e); } });
  }
  const facts = [['Где встречается', t.where], ['Зачем нужно', t.why], ['Когда брать', t.when]].filter(f => f[1]);
  if (facts.length) { toc.push(['facts', 'Где, зачем, когда']); blocks.push(h('dl.facts', { id: 'b-facts' }, facts.map(([k, v]) => h('div', h('dt', k), h('dd', { html: fmt(v) }))))); }
  const diff = Array.isArray(t.diff) ? t.diff : t.diff ? [{ vs: '', text: t.diff }] : [];
  if (diff.length) block('diff', 'Чем отличается', h('div.diff', diff.map(d => h('div.diff__row', d.vs ? h('span.diff__vs', 'от ', h('code', d.vs)) : null, h('p', { html: fmt(d.text) })))));
  if (t.code && t.code.length) block('code', 'Пример', codeExamples(t.code));
  if (t.pitfalls && t.pitfalls.length) block('pitfalls', 'Частые ошибки', h('ul.pitfalls', t.pitfalls.map(p => h('li', { html: fmt(p) }))));
  if (t.questions && t.questions.length) {
    const list = h('div.faq', t.questions.map(q => h('details.faq__item', h('summary', h('span', { html: fmt(q.q) })), h('div.faq__a', paras(q.a)))));
    const toggle = h('button.link-btn', { type: 'button', onclick: () => { const all = $$('details', list); const open = !all.every(d => d.open); all.forEach(d => { d.open = open; }); toggle.textContent = open ? 'Свернуть ответы' : 'Показать все ответы'; } }, 'Показать все ответы');
    toc.push(['faq', 'Спросят на собесе']);
    blocks.push(h('section.block', { id: 'b-faq' }, h('div.block__head', h('h2', 'Что спросят на собеседовании'), toggle), h('p.muted', 'Попробуйте ответить сами, потом откройте ответ.'), list));
  }
  blocks.push(h('nav.pager', prev ? h('a', { href: '#/t/' + prev.id }, h('small', '← Назад'), h('b', prev.title)) : h('span'), next ? h('a.pager__next', { href: '#/t/' + next.id }, h('small', 'Дальше →'), h('b', next.title)) : h('a.pager__next', { href: '#/s/' + t.section }, h('small', 'Конец раздела'), h('b', 'Все темы раздела'))));

  return [h('div.topic', { style: cvar(t.section) },
    h('article.topic__body',
      h('header.page-head', h('p.eyebrow', h('a', { href: '#/s/' + t.section }, h('i.dot'), secOf(t.section).name), h('span', '/'), h('span', t.group), t.level ? h('span.level', LEVEL_NAME[t.level] || t.level) : null), h('h1', t.title), h('p.page-head__lead', { html: fmt(t.summary) })),
      blocks),
    h('nav.toc', { 'aria-label': 'На странице' }, h('p', 'На странице'), toc.map(([k, title]) => h('a', { href: '#b-' + k, onclick: e => { e.preventDefault(); document.getElementById('b-' + k)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, title))))];
}
function codeExamples(list) {
  const isBad = c => /^плохо/i.test(c.title), isGood = c => /^хорошо/i.test(c.title);
  if (!(list.some(isBad) && list.some(isGood))) return h('div.stack', list.map(c => codeBlock(c.src, c.lang, c.title)));
  /* «Плохо / Хорошо» pairs become a toggle so the refactoring reads as one change */
  const holder = h('div.stack'); const seg = h('div.seg');
  const show = which => {
    holder.replaceChildren(...list.filter(which === 'bad' ? isBad : isGood).map(c => codeBlock(c.src, c.lang, c.title.replace(/^(плохо|хорошо):?\s*/i, ''), which === 'bad' ? 'bad' : 'good')));
    [...seg.children].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === which)));
  };
  seg.append(h('button', { type: 'button', 'data-k': 'bad', onclick: () => show('bad') }, 'Плохо'), h('button', { type: 'button', 'data-k': 'good', onclick: () => show('good') }, 'Хорошо'));
  show('bad');
  return h('div.stack', seg, holder, list.filter(c => !isBad(c) && !isGood(c)).map(c => codeBlock(c.src, c.lang, c.title)));
}
function notFound() { return [h('div.empty', h('p', 'Такой страницы нет.'), h('a.btn', { href: '#/' }, 'Ко всем темам'))]; }

/* ---------- router ---------- */
function render() {
  const raw = location.hash.replace(/^#\/?/, '');
  if (raw.startsWith('b-') || raw.startsWith('q-')) return; // in-page anchors
  const [name, arg] = raw.split('?')[0].split(/\/(.*)/);
  const fn = { '': planHome, q: planBranch, topics: home, s: section, t: topic }[name];
  view.replaceChildren(...[].concat(fn ? fn(arg) : notFound()));
  renderSide(raw, name === 't' ? byId[arg] : null);
  const title = view.querySelector('h1');
  document.title = (name && title ? title.textContent + ' · ' : '') + 'Собес';
  closeSide();
  if (!(name === 'q' && arg && arg.includes('/'))) window.scrollTo(0, 0);
}
window.addEventListener('hashchange', render);

/* ---------- search ---------- */
const q = $('#q'); const sr = $('#searchResults');
let srIdx = 0, idx = null;
const searchIndex = () => idx || (idx = [...allQ.map(it => ({ it, text: [it.q, it.a, it.branch.name].join(' ').toLowerCase() })), ...S.topics.map(t => ({ t, text: [t.title, t.summary, t.analogy || t.simple, t.what, t.group, ...(t.questions || []).map(x => x.q)].join(' ').toLowerCase() }))]);
q.addEventListener('input', () => {
  const v = q.value.trim().toLowerCase();
  if (!v) { sr.hidden = true; return; }
  const words = v.split(/\s+/);
  const res = searchIndex().filter(x => words.every(w => x.text.includes(w))).map(x => [x, (x.t ? x.t.title : x.it.q).toLowerCase().includes(v) ? 2 : 1]).sort((a, b) => b[1] - a[1]).slice(0, 12);
  srIdx = 0;
  const close = () => { sr.hidden = true; q.value = ''; };
  sr.replaceChildren(...(res.length ? res.map(([x], i) => x.t
    ? h('a.sr' + (i === 0 ? '.is-active' : ''), { href: '#/t/' + x.t.id, style: cvar(x.t.section), onclick: close }, h('i.dot'), h('b', x.t.title), h('small', 'Шпаргалка · ' + secOf(x.t.section).name + ' · ' + x.t.summary.replace(/`/g, '')))
    : h('a.sr' + (i === 0 ? '.is-active' : ''), { href: '#/q/' + x.it.branch.id + '/' + x.it.id, style: bvar(x.it.branch), onclick: close }, h('i.dot'), h('b', x.it.q.replace(/`/g, '')), h('small', 'Вопрос · ' + x.it.branch.name))) : [h('p.sr__empty', 'Ничего не нашлось')]));
  sr.hidden = false;
});
q.addEventListener('keydown', e => {
  const items = $$('.sr', sr);
  if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && items.length) { e.preventDefault(); srIdx = (srIdx + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length; items.forEach((x, i) => x.classList.toggle('is-active', i === srIdx)); items[srIdx].scrollIntoView({ block: 'nearest' }); }
  else if (e.key === 'Enter' && items[srIdx]) { location.hash = items[srIdx].getAttribute('href'); sr.hidden = true; q.value = ''; q.blur(); }
  else if (e.key === 'Escape') { sr.hidden = true; q.blur(); }
});
document.addEventListener('click', e => { if (!e.target.closest('.search')) sr.hidden = true; });
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

S.render = render;
render();
})();
