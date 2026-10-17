// Проверка вертикальных отступов: заголовок вплотную к следующему блоку, плашка или карточка
// вплотную к тексту. Аудит адаптива этого не ловит, а пользователь видит сразу («Кому
// подходит» прилипло к чипам на sanych — стили секции не загрузились на этой странице).
//
// Запуск как у responsive-audit-nuxt.js: файл в public/__gap.js, затем
//   eval(await (await fetch('/__gap.js', {cache: 'reload'})).text())
//   window.__gaps('/redesign/<slug>/', ['', 'catalog', …], [390, 1280]).then(r => window.__GAP = r)
// Возвращает 'ok' или { 'heading-tight <страница>': [...], 'box-touch <страница>': [...] }.
// Ищет внутри .sn-main — замени на main своего концепта.
window.__gaps = async (base, pages, widths) => {
  const out = {}
  const add = (k, v) => { (out[k] = out[k] || new Set()).add(v) }
  const name = (e) => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '')
  for (const p of pages) {
    const f = document.createElement('iframe')
    f.style.cssText = `position:fixed;left:-9999px;top:0;width:${widths[0]}px;height:900px;border:0`
    f.src = base + p
    document.body.appendChild(f)
    await new Promise(r => { f.onload = r; setTimeout(r, 15000) })
    await new Promise(r => setTimeout(r, 1500))
    for (const w of widths) {
      f.style.width = w + 'px'
      await new Promise(r => setTimeout(r, 150))
      const d = f.contentDocument
      const boxy = (e) => { const cs = getComputedStyle(e); return cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'rgb(255, 255, 255)' || cs.boxShadow !== 'none' || parseFloat(cs.borderTopWidth) > 0 }
      d.querySelectorAll('.sn-main *').forEach(parent => {
        if (parent.closest('button, a, .sn-qty, .sn-seg, select, label > span')) return
        const kids = [...parent.children].filter(k => k.offsetParent && k.getBoundingClientRect().height > 0)
        for (let i = 1; i < kids.length; i++) {
          const a = kids[i - 1].getBoundingClientRect(), b = kids[i].getBoundingClientRect()
          const stacked = b.top >= a.bottom - 2 && b.left < a.right && b.right > a.left
          if (!stacked) continue
          const gap = Math.round(b.top - a.bottom)
          const A = kids[i - 1], B = kids[i]
          const isHead = /^H[1-3]$/.test(A.tagName)
          if (isHead && gap < 10) add('heading-tight ' + p, `${w}: ${name(A)} "${A.textContent.trim().slice(0, 20)}" → ${name(B)} = ${gap}px`)
          else if ((boxy(A) || boxy(B)) && gap < 8 && !(boxy(A) && boxy(B) && gap >= 4)) add('box-touch ' + p, `${w}: ${name(A)} → ${name(B)} = ${gap}px`)
        }
      })
    }
    f.remove()
  }
  for (const k in out) out[k] = [...out[k]].slice(0, 12)
  return Object.keys(out).length ? out : 'ok'
}
