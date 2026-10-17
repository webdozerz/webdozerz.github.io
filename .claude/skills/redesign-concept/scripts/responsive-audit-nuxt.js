// Аудит адаптива Nuxt-концепта: тот же набор проверок, что в responsive-audit.js, но
// одна страница грузится в iframe один раз, а ширина меняется без перезагрузки. На Nuxt dev
// это в десятки раз быстрее (sanych: 10 страниц × 320–1440 за пару минут).
//
// Запуск (встроенный браузер или chrome-devtools, на любой странице того же origin):
//   1. скопируй файл в public/__aud.js (после проверки удали);
//   2. eval(await (await fetch('/__aud.js', {cache: 'reload'})).text())
//      window.__AUD = { base: '/redesign/<slug>/', pages: ['', 'catalog', 'cart', …], step: 8 }
//      window.__audit().then(r => window.__RES = r)          // в фоне: долго для одного вызова
//   3. отдельным вызовом забери JSON.stringify(window.__RES)
// Селекторы кнопок, строки покупки и шапки — с префиксом концепта: поправь под свой префикс.
// Ложное срабатывание: text-overflow у кнопки корзины с абсолютным бейджем-счётчиком.
window.__audit = async () => {
  const base = window.__AUD.base, pages = window.__AUD.pages
  const from = window.__AUD.from || 320, to = window.__AUD.to || 1440, step = window.__AUD.step || 8

  // свежие файлы, а не кеш http.server

  const out = {}
  const add = (k, v) => { (out[k] = out[k] || new Set()).add(v) }
  const buttons = '.sn-btn, .sn-catbtn, .sn-cartbtn, .sn-seg button, .sn-qty, .snc-side__link, .sn-tabbar__item'

  for (const p of pages) {
    const f = document.createElement('iframe')
    f.style.cssText = `position:fixed;left:-9999px;top:0;width:${from}px;height:800px;border:0`
    f.src = base + p
    document.body.appendChild(f)
    const loaded = await new Promise(r => { f.onload = () => r(true); setTimeout(() => r(false), 15000) })
    if (!loaded) { add('not-loaded ' + p, 0); f.remove(); continue }
    await new Promise(r => setTimeout(r, 1500))
    for (let w = from; w <= to; w += step) {
      f.style.width = w + 'px'
      await new Promise(r => setTimeout(r, 60))
      const d = f.contentDocument

      if (d.documentElement.scrollWidth > w) add('hscroll ' + p, w)

      d.querySelectorAll(buttons).forEach(b => {
        if (!b.offsetParent || b.closest('dialog')) return
        const cs = getComputedStyle(b)
        if (cs.fontSize === '0px') return                       // режим «только иконка»
        if (b.scrollWidth > b.clientWidth + 1) add('text-overflow ' + p, w + ':' + b.textContent.trim().slice(0, 16))
        // перенос: один и тот же текстовый узел занимает несколько строк
        // (разные узлы в колонках, как «− 1 +» или бейдж + подпись, переносом не считаются)
        const walker = d.createTreeWalker(b, NodeFilter.SHOW_TEXT)
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.textContent.trim()) continue
          const r = d.createRange(); r.selectNodeContents(n)
          const tops = new Set([...r.getClientRects()].filter(x => x.width > 1).map(x => Math.round(x.top)))
          if (tops.size > 1) { add('wrapped ' + p, w + ':' + n.textContent.trim().slice(0, 16)); break }
        }
      })

      d.querySelectorAll('.sn-buy__row').forEach(row => {
        const q = row.querySelector('.sn-qty'), a = row.querySelector('.sn-buy__add')
        if (!q || !a || !q.offsetParent || !a.offsetParent) return
        const qr = q.getBoundingClientRect(), ar = a.getBoundingClientRect()
        if (Math.abs(ar.top - qr.top) < 2 && ar.left - qr.right < 5) add('buy-gap ' + p, w)
        const v = q.querySelector('output'), bs = q.querySelectorAll('button')
        if (v && bs.length === 2) {
          const vr = v.getBoundingClientRect()
          if (vr.left < bs[0].getBoundingClientRect().right - 0.5 || vr.right > bs[1].getBoundingClientRect().left + 0.5) add('qty-collide ' + p, w)
        }
      })

      // горизонтальные ленты (кружки категорий, чипы): overflow-x:auto обрезает и по вертикали,
      // поэтому сдвинутый отрицательным margin или тенью элемент срезается сверху/снизу
      d.querySelectorAll('body *').forEach(s => {
        const cs = getComputedStyle(s)
        if (!/auto|scroll/.test(cs.overflowX) || !s.offsetParent || s.tagName === 'DIALOG') return
        const sr = s.getBoundingClientRect()
        for (const e of s.querySelectorAll('*')) {
          if (!e.offsetParent) continue
          const er = e.getBoundingClientRect()
          if (er.height && (er.top < sr.top - 0.5 || er.bottom > sr.bottom + 0.5)) { add('clipped-in-scroller ' + p, w + ':' + (s.className || s.tagName) + ' > ' + (e.className || e.tagName)); break }
        }
      })

      // абсолютные кнопки (стрелки слайдера, «в избранное») не должны лежать на тексте
      const texts = [...d.querySelectorAll('h1,h2,h3,h4,p')].filter(t => t.offsetParent && t.textContent.trim())
      d.querySelectorAll('button, a').forEach(b => {
        if (!b.offsetParent || getComputedStyle(b).position !== 'absolute') return
        const br = b.getBoundingClientRect()
        for (const t of texts) {
          if (t.contains(b) || b.contains(t)) continue
          const r = d.createRange(); r.selectNodeContents(t)
          const hit = [...r.getClientRects()].some(x => x.width > 1 && x.left < br.right - 1 && x.right > br.left + 1 && x.top < br.bottom - 1 && x.bottom > br.top + 1)
          if (hit) { add('overlaps-text ' + p, w + ':' + (b.getAttribute('aria-label') || b.className) + ' / ' + t.textContent.trim().slice(0, 16)); break }
        }
      })

      // иконки: контур вылезает за viewBox и срезается (проверяем один раз, на первой ширине)
      if (w === from) {
        const icon = (svg, name) => {
          const vb = svg.viewBox && svg.viewBox.baseVal
          if (!vb || !vb.width) return
          const half = parseFloat(svg.getAttribute('stroke-width') || 0) / 2
          for (const el of svg.querySelectorAll('path,circle,rect,line,polyline,polygon,ellipse')) {
            const b = el.getBBox(), h = parseFloat(el.getAttribute('stroke-width') || 0) / 2 || half
            if (b.x - h < vb.x - 0.2 || b.y - h < vb.y - 0.2 || b.x + b.width + h > vb.x + vb.width + 0.2 || b.y + b.height + h > vb.y + vb.height + 0.2) { add('icon-clipped ' + p, name); break }
          }
        }
        // скрытые (таббар, модалки) клонируем в видимый контейнер, иначе getBBox вернёт нули
        const box = d.createElement('div'); box.style.cssText = 'position:absolute;left:0;top:0;width:24px'; d.body.appendChild(box)
        d.querySelectorAll('svg').forEach((s, i) => { box.replaceChildren(s.cloneNode(true)); icon(box.firstChild, 'svg#' + i + ' ' + (s.parentElement.className || s.parentElement.tagName)) })
        // иконки-маски из CSS-переменных: --i-name:url("data:image/svg+xml,...")
        for (const sh of d.styleSheets) {
          let rules = []; try { rules = [...sh.cssRules] } catch (e) {}
          for (const rule of rules) {
            for (const m of (rule.cssText || '').matchAll(/(--[\w-]+):\s*url\("data:image\/svg\+xml,([^"]+)"\)/g)) {
              box.innerHTML = decodeURIComponent(m[2].replace(/\\"/g, '"'))
              if (box.firstChild) icon(box.firstChild, m[1])
            }
          }
        }
        box.remove()
      }

      const hdr = d.querySelector('.sn-header__row')
      if (hdr && hdr.offsetParent) {
        const hr = hdr.getBoundingClientRect()
        hdr.querySelectorAll(':scope > *').forEach(e => {
          if (e.offsetParent && e.getBoundingClientRect().right > hr.right + 1) add('header-cut ' + p, w)
        })
      }
    }
    f.remove()
  }
  for (const k in out) out[k] = [...out[k]].slice(0, 24)
  return Object.keys(out).length ? out : 'ok'
}
