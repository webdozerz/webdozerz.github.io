/* Core: DOM helpers, highlighter, code editor, persistent store with spaced repetition. Everything hangs off window.SOBES. */
window.SOBES = window.SOBES || { topics: [], quiz: [] };
(() => {
const S = window.SOBES;
S.tasks = S.tasks || [];
S.demos = S.demos || {};

/* views pass optional children as `cond ? node : null`; native append would print them as "null" */
const nativeAppend = Element.prototype.append;
Element.prototype.append = function (...nodes) { return nativeAppend.apply(this, nodes.filter(n => n != null && n !== false)); };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
/* h('div.card', { onclick }, child, 'text', [children]) */
function h(tag, attrs, ...kids) {
  const [name, ...cls] = tag.split('.');
  const el = document.createElement(name || 'div');
  if (cls.length) el.className = cls.join(' ');
  if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
  for (const k in attrs || {}) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') for (const p in v) p.startsWith('--') ? el.style.setProperty(p, v[p]) : (el.style[p] = v[p]);
    else if (k === 'class') el.className += (el.className ? ' ' : '') + v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  const add = k => { if (k == null || k === false) return; if (Array.isArray(k)) k.forEach(add); else el.append(k instanceof Node ? k : document.createTextNode(k)); };
  kids.forEach(add);
  return el;
}

const SECTIONS = [
  { id: 'js', name: 'JavaScript', tag: 'JS', desc: 'Типы, замыкания, this, прототипы, event loop, промисы' },
  { id: 'web', name: 'Браузер и Web API', tag: 'WEB', desc: 'DOM, события, хранилища, fetch, CORS, HTTP, рендеринг' },
  { id: 'vue', name: 'Vue 3', tag: 'VUE', desc: 'Реактивность, компоненты, Pinia, архитектура, производительность' },
  { id: 'nuxt', name: 'Nuxt 3', tag: 'NUXT', desc: 'SSR, гидратация, роутинг, Nitro, useFetch и компания' },
  { id: 'ts', name: 'TypeScript', tag: 'TS', desc: 'Дженерики, utility types, guards, типизация Vue и Pinia' },
  { id: 'arch', name: 'Принципы и паттерны', tag: 'ARCH', desc: 'SOLID, KISS, DRY, ООП, паттерны на фронтенде' },
];
const secOf = id => SECTIONS.find(s => s.id === id);
const LEVELS = ['junior', 'middle', 'middle+', 'senior'];
const LEVEL_NAME = { junior: 'Junior', middle: 'Middle', 'middle+': 'Middle+', senior: 'Senior' };
const LANG_NAME = { js: 'JavaScript', ts: 'TypeScript', vue: 'Vue SFC', html: 'HTML', bash: 'Терминал', css: 'CSS', json: 'JSON' };

/* ---------- highlighter: one tokenizing pass per language ---------- */
const JS_KW = 'const|let|var|function|return|if|else|for|while|do|of|in|new|class|extends|super|this|await|async|import|export|from|default|try|catch|finally|throw|typeof|instanceof|void|delete|switch|case|break|continue|yield|static|get|set|null|undefined|true|false|type|interface|keyof|readonly|as|is|enum|implements|private|public|protected|declare|infer|never|unknown|any|satisfies|namespace|abstract|asserts';
const JS_RE = new RegExp([
  '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',                          // 1 comment
  '(`(?:\\\\[\\s\\S]|[^`\\\\])*`|\'(?:\\\\.|[^\'\\\\\\n])*\'|"(?:\\\\.|[^"\\\\\\n])*")', // 2 string
  '\\b(\\d[\\d_]*\\.?\\d*(?:e[+-]?\\d+)?n?)\\b',                     // 3 number
  '\\b(' + JS_KW + ')\\b',                                          // 4 keyword
  '\\b([A-Za-z_$][\\w$]*)(?=\\s*(?:<[^>()]*>)?\\()',                 // 5 call
  '\\b([A-Z][\\w$]*)\\b',                                           // 6 Type
].join('|'), 'g');
function hlJs(code) {
  let out = '', last = 0, m;
  JS_RE.lastIndex = 0;
  while ((m = JS_RE.exec(code))) {
    out += esc(code.slice(last, m.index));
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'n' : m[4] ? 'k' : m[5] ? 'f' : 't';
    out += '<span class="tok-' + cls + '">' + esc(m[0]) + '</span>';
    last = JS_RE.lastIndex;
  }
  return out + esc(code.slice(last));
}
function hlHtml(code) {
  return code.split(/(<!--[\s\S]*?-->|<\/?[a-zA-Z][\w.:-]*(?:\s+[^<>]*?)?\/?>|\{\{[\s\S]*?\}\})/g).map((part, i) => {
    if (i % 2 === 0) return esc(part);
    if (part.startsWith('<!--')) return '<span class="tok-c">' + esc(part) + '</span>';
    if (part.startsWith('{{')) return '<span class="tok-k">{{</span>' + hlJs(part.slice(2, -2)) + '<span class="tok-k">}}</span>';
    const mm = part.match(/^(<\/?)([\w.:-]+)([\s\S]*?)(\/?>)$/);
    if (!mm) return esc(part);
    const attrs = mm[3].replace(/([:@#]?[\w.:@#-]+)(=)("[^"]*"|'[^']*')|([:@#]?[\w.:@#-]+)/g, (a, n, eq, v, bare) => {
      if (bare) return '\u0001a' + bare + '\u0002';
      const dynamic = /^[:@#]|^v-/.test(n);
      return '\u0001a' + n + '\u0002=' + (dynamic ? '\u0001q' + v[0] + '\u0002' + '\u0003' + v.slice(1, -1) + '\u0004' + '\u0001q' + v[0] + '\u0002' : '\u0001s' + v + '\u0002');
    });
    const attrHtml = esc(attrs)
      .replace(/\u0003([\s\S]*?)\u0004/g, (_, js) => hlJs(js.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')))
      .replace(/\u0001a([\s\S]*?)\u0002/g, '<span class="tok-a">$1</span>')
      .replace(/\u0001s([\s\S]*?)\u0002/g, '<span class="tok-s">$1</span>')
      .replace(/\u0001q([\s\S]*?)\u0002/g, '<span class="tok-s">$1</span>');
    return esc(mm[1]) + '<span class="tok-t">' + esc(mm[2]) + '</span>' + attrHtml + esc(mm[4]);
  }).join('');
}
function hlVue(code) {
  return code.split(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>)/g).map((part, i) => {
    if (i % 2 === 0) return hlHtml(part);
    const mm = part.match(/^(<(script|style)\b[^>]*>)([\s\S]*?)(<\/(?:script|style)>)$/);
    return hlHtml(mm[1]) + (mm[2] === 'script' ? hlJs(mm[3]) : esc(mm[3])) + hlHtml(mm[4]);
  }).join('');
}
function hlBash(code) {
  return code.split('\n').map(l => /^\s*#/.test(l) ? '<span class="tok-c">' + esc(l) + '</span>' : esc(l).replace(/^(\s*)(\w[\w-]*)/, '$1<span class="tok-f">$2</span>').replace(/(\s)(--?[\w-]+)/g, '$1<span class="tok-a">$2</span>')).join('\n');
}
function hl(code, lang) {
  if (lang === 'vue') return hlVue(code);
  if (lang === 'html') return hlHtml(code);
  if (lang === 'bash') return hlBash(code);
  if (lang === 'css' || lang === 'json' || lang === 'text') return esc(code);
  return hlJs(code);
}

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true; }, 1800);
}
function codeBlock(src, lang = 'js', title = '', mod = '') {
  const copyBtn = h('button.code__copy', { type: 'button', onclick: () => { navigator.clipboard?.writeText(src).then(() => toast('Скопировано')); } }, 'Копировать');
  return h('div.code' + (mod ? '.code--' + mod : ''),
    h('div.code__bar', title ? h('b', title) : null, h('span.chip', LANG_NAME[lang] || lang), copyBtn),
    h('pre', h('code', { html: hl(src.replace(/^\n+|\s+$/g, ''), lang) })));
}

/* ---------- editor: transparent textarea over highlighted pre ---------- */
function editor(value, lang, onChange) {
  const pre = h('pre', { 'aria-hidden': 'true' });
  const gutter = h('div.editor__gutter');
  const ta = h('textarea', { spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': 'Редактор кода' });
  ta.value = value;
  const scroll = h('div.editor__scroll', gutter, pre, ta);
  const paint = () => {
    pre.innerHTML = hl(ta.value, lang) + '\n';
    gutter.textContent = ta.value.split('\n').map((_, i) => i + 1).join('\n');
  };
  ta.addEventListener('input', () => { paint(); onChange && onChange(ta.value); });
  ta.addEventListener('keydown', e => {
    const { selectionStart: s, selectionEnd: en, value: v } = ta;
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        const ls = v.lastIndexOf('\n', s - 1) + 1;
        if (v.slice(ls, ls + 2) === '  ') { ta.value = v.slice(0, ls) + v.slice(ls + 2); ta.selectionStart = ta.selectionEnd = Math.max(ls, s - 2); }
      } else { ta.value = v.slice(0, s) + '  ' + v.slice(en); ta.selectionStart = ta.selectionEnd = s + 2; }
      ta.dispatchEvent(new Event('input'));
    } else if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      const ls = v.lastIndexOf('\n', s - 1) + 1;
      let indent = v.slice(ls).match(/^\s*/)[0];
      if (/[{([]$/.test(v.slice(0, s).trimEnd())) indent += '  ';
      ta.value = v.slice(0, s) + '\n' + indent + v.slice(en);
      ta.selectionStart = ta.selectionEnd = s + 1 + indent.length;
      ta.dispatchEvent(new Event('input'));
    }
  });
  const fit = () => { ta.style.height = '0'; ta.style.height = Math.max(pre.scrollHeight, 220) + 'px'; };
  ta.addEventListener('input', fit);
  paint();
  const root = h('div.editor', scroll);
  queueMicrotask(fit);
  return { el: root, get value() { return ta.value; }, set value(v) { ta.value = v; paint(); fit(); onChange && onChange(v); }, focus: () => ta.focus() };
}

/* ---------- store: localStorage behind a tiny repository, so a server backend can replace it later ---------- */
const KEY = 'sobes:v1';
const DAY = 864e5;
const INTERVALS = [0, 1, 3, 7, 16, 35]; // days per Leitner box
const blank = () => ({ cards: {}, seen: {}, tasks: {}, days: {}, last: null, sessions: [], settings: { level: 'middle' } });
let data = blank();
try { data = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} };
const today = () => new Date().toISOString().slice(0, 10);
const touchDay = () => { data.days[today()] = (data.days[today()] || 0) + 1; };

const store = {
  get data() { return data; },
  /* record an answer; score 0..1. Moves the card between boxes and schedules the next review. */
  answer(id, score, meta = {}) {
    const c = data.cards[id] || (data.cards[id] = { box: 0, due: 0, n: 0, sum: 0, wrong: 0, hist: [] });
    c.n++; c.sum += score; c.last = score; c.at = Date.now();
    c.hist.push([Date.now(), Math.round(score * 100) / 100]); if (c.hist.length > 20) c.hist.shift();
    if (score >= .8) c.box = Math.min(c.box + 1, INTERVALS.length - 1);
    else if (score >= .4) c.box = Math.max(c.box - 1, 1);
    else { c.box = 0; c.wrong++; }
    if (score < .8) c.wrong = c.wrong || 1;
    c.due = Date.now() + (c.box === 0 ? 10 * 60e3 : INTERVALS[c.box] * DAY);
    Object.assign(c, meta);
    touchDay(); save();
    return c;
  },
  card: id => data.cards[id],
  seeTopic(id) { data.seen[id] = Date.now(); data.last = { topic: id, at: Date.now() }; touchDay(); save(); },
  task(id, patch) { data.tasks[id] = Object.assign(data.tasks[id] || {}, patch); if (patch.solved) touchDay(); save(); },
  session(s) { data.sessions.unshift(Object.assign({ at: Date.now() }, s)); data.sessions = data.sessions.slice(0, 50); save(); },
  setting(k, v) { data.settings[k] = v; save(); },
  reset() { data = blank(); save(); },
  export: () => JSON.stringify(data),
  import(json) { data = Object.assign(blank(), JSON.parse(json)); save(); },
  streak() {
    let n = 0; const d = new Date();
    if (!data.days[today()]) d.setDate(d.getDate() - 1);
    while (data.days[d.toISOString().slice(0, 10)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  },
};

/* ---------- content index ---------- */
const byId = {};
const qIndex = {}; // question id → { q, topic, kind: 'q' | 'quiz' }
function indexContent() {
  S.topics.forEach(t => {
    byId[t.id] = t;
    (t.questions || []).forEach(q => { qIndex[q.id] = { item: q, topic: t, kind: 'q' }; });
  });
  S.quiz.forEach(q => { qIndex[q.id] = { item: q, topic: byId[q.topic], kind: 'quiz' }; });
}
const topicItems = t => [...(t.questions || []).map(q => q.id), ...S.quiz.filter(q => q.topic === t.id).map(q => q.id)];
/* mastery: mean of last scores, unanswered count as 0 */
function mastery(t) {
  const ids = topicItems(t);
  if (!ids.length) return 0;
  return ids.reduce((s, id) => s + (data.cards[id] ? data.cards[id].last : 0), 0) / ids.length;
}
const answered = t => topicItems(t).filter(id => data.cards[id]).length;
const dueCards = () => Object.entries(data.cards).filter(([id, c]) => qIndex[id] && c.due <= Date.now()).sort((a, b) => a[1].box - b[1].box || a[1].due - b[1].due);
const mistakes = () => Object.entries(data.cards).filter(([id, c]) => qIndex[id] && c.wrong > 0).sort((a, b) => b[1].at - a[1].at);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* Rough word overlap between a free-text answer and a key point — pre-ticks keys the user probably mentioned. */
const stem = w => w.toLowerCase().replace(/ё/g, 'е').slice(0, Math.max(4, Math.ceil(w.length * .6)));
const STOP = new Set(['это', 'который', 'которая', 'чтобы', 'когда', 'если', 'тоже', 'того', 'тоже', 'есть', 'нужно', 'можно', 'будет', 'только', 'через', 'после', 'перед', 'между', 'потому', 'with', 'that', 'this', 'from']);
function keyHit(answer, key) {
  const a = new Set((answer.match(/[\wа-яё$.]+/gi) || []).filter(w => w.length > 2).map(stem));
  const words = (key.match(/[\wа-яё$.]+/gi) || []).filter(w => w.length > 3 && !STOP.has(w.toLowerCase())).map(stem);
  if (!words.length) return false;
  return words.filter(w => a.has(w)).length / words.length >= .5;
}

Object.assign(S, { $, $$, h, esc, hl, codeBlock, editor, toast, store, SECTIONS, secOf, LEVELS, LEVEL_NAME, byId, qIndex, indexContent, topicItems, mastery, answered, dueCards, mistakes, shuffle, keyHit, DAY });
})();
