/* Core: DOM helpers, syntax highlighter, code blocks. Everything hangs off window.SOBES. */
window.SOBES = window.SOBES || { topics: [] };
(() => {
const S = window.SOBES;
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


const byId = {};
const indexContent = () => S.topics.forEach(t => { byId[t.id] = t; });

/* tiny per-browser memory: last opened topic, nothing else */
const recall = {
  get last() { try { return localStorage.getItem('sobes:last'); } catch (e) { return null; } },
  set last(id) { try { localStorage.setItem('sobes:last', id); } catch (e) {} },
};

Object.assign(S, { $, $$, h, esc, hl, codeBlock, toast, SECTIONS, secOf, LEVEL_NAME, byId, indexContent, recall });
})();
