// Аудит адаптива концепта: открывает страницы в скрытых iframe нужной ширины и ищет
// горизонтальный скролл, вылезающий текст в кнопках, слипание счётчика с кнопкой,
// столкновение числа в счётчике с «−»/«+» и обрезанную шапку.
//
// Запуск: chrome-devtools evaluate_script на любой странице того же origin
// (например http://localhost:4173/<slug>/index.html или https://andryushov.me/redesign/<slug>/).
// Передай содержимое файла как `function` (или через sourcePath, если путь разрешён).
// Параметры правь в начале: base, pages, from/to/step.
// Возвращает 'ok' или объект { 'проблема страница': [ширины или детали] }.
async () => {
  const base = location.pathname.replace(/[^/]*$/, '')        // папка текущей страницы
  const pages = ['index.html', 'catalog.html', 'product.html', 'cart.html', 'delivery.html']
  const from = 320, to = 1440, step = 8

  // свежие файлы, а не кеш http.server
  for (const p of [...pages, 'assets/styles.css', 'assets/app.js']) {
    try { await fetch(base + p, { cache: 'reload' }) } catch (e) {}
  }

  const out = {}
  const add = (k, v) => { (out[k] = out[k] || new Set()).add(v) }
  const buttons = '.btn, .add, .catbtn, .hbtn, .fchip, .subcat, .qty, button'

  for (let w = from; w <= to; w += step) {
    for (const p of pages) {
      const f = document.createElement('iframe')
      f.style.cssText = `position:fixed;left:-9999px;top:0;width:${w}px;height:800px;border:0`
      f.src = base + p
      document.body.appendChild(f)
      const loaded = await new Promise(r => { f.onload = () => r(true); setTimeout(() => r(false), 4000) })
      if (!loaded) { add('not-loaded ' + p, w); f.remove(); continue }
      await new Promise(r => setTimeout(r, 100))
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

      d.querySelectorAll('.buy, .buyrow').forEach(row => {
        const q = row.querySelector('.qty'), a = row.querySelector('.add')
        if (!q || !a || !q.offsetParent || !a.offsetParent) return
        const qr = q.getBoundingClientRect(), ar = a.getBoundingClientRect()
        if (Math.abs(ar.top - qr.top) < 2 && ar.left - qr.right < 5) add('buy-gap ' + p, w)
        const v = q.querySelector('[data-val]'), bs = q.querySelectorAll('button')
        if (v && bs.length === 2) {
          const vr = v.getBoundingClientRect()
          if (vr.left < bs[0].getBoundingClientRect().right - 0.5 || vr.right > bs[1].getBoundingClientRect().left + 0.5) add('qty-collide ' + p, w)
        }
      })

      const hdr = d.querySelector('.header__row')
      if (hdr && hdr.offsetParent) {
        const hr = hdr.getBoundingClientRect()
        hdr.querySelectorAll(':scope > *').forEach(e => {
          if (e.offsetParent && e.getBoundingClientRect().right > hr.right + 1) add('header-cut ' + p, w)
        })
      }
      f.remove()
    }
  }
  for (const k in out) out[k] = [...out[k]].slice(0, 24)
  return Object.keys(out).length ? out : 'ok'
}
