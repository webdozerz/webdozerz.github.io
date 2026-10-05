// Лёгкая интерактивность концепта: счётчики количества, фильтры каталога, пересчёт корзины.
// Данные никуда не отправляются.
(function () {
  var fmt = function (v) {
    var s = (Math.round(v * 100) / 100).toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    return s
  }
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }

  // счётчики количества
  document.addEventListener('click', function (e) {
    var inc = e.target.closest('[data-inc]')
    var dec = e.target.closest('[data-dec]')
    if (!inc && !dec) return
    var box = e.target.closest('.qty')
    var val = $('[data-val]', box)
    var n = parseInt(val.textContent, 10) || 1
    n = inc ? n + 1 : Math.max(1, n - 1)
    val.textContent = n
    if (box.closest('.cline')) recalc()
  })

  // кнопка «В корзину»
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.add')
    if (!btn) return
    btn.classList.add('is-added')
    btn.textContent = 'В корзине ✓'
    setTimeout(function () {
      btn.classList.remove('is-added')
      btn.textContent = btn.classList.contains('btn') ? 'В корзину' : 'В корзину'
    }, 1400)
  })

  // каталог: поиск, сортировка, фильтр по единице
  var grid = $('#grid')
  if (grid) {
    var cards = $$('.pcard', grid)
    var state = { q: '', sort: 'pop', f: 'all' }
    var apply = function () {
      var list = cards.filter(function (c) {
        var unit = $('.price small', c).textContent.indexOf('кг') > -1 ? 'kg' : 'pc'
        return (!state.q || c.dataset.name.indexOf(state.q) > -1) && (state.f === 'all' || state.f === unit)
      })
      if (state.sort !== 'pop') {
        list.sort(function (a, b) {
          return state.sort === 'asc' ? a.dataset.price - b.dataset.price : b.dataset.price - a.dataset.price
        })
      }
      cards.forEach(function (c) { c.style.display = 'none' })
      list.forEach(function (c) { c.style.display = ''; grid.appendChild(c) })
      $('#count').textContent = list.length
    }
    $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; apply() })
    $$('#fchips .fchip').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('#fchips .fchip').forEach(function (x) { x.classList.remove('is-on') })
        b.classList.add('is-on')
        state.f = b.dataset.f
        apply()
      })
    })
    var gs = $('#global-search')
    gs.addEventListener('input', function () { state.q = gs.value.trim().toLowerCase(); apply() })
  } else {
    var gs2 = $('#global-search')
    if (gs2) gs2.addEventListener('keydown', function (e) { if (e.key === 'Enter') location.href = 'catalog.html' })
  }

  // корзина
  var recalc = function () {
    var lines = $$('.cline')
    if (!lines.length) return
    var sub = 0
    lines.forEach(function (l) {
      var q = parseInt($('[data-val]', l).textContent, 10) || 0
      var s = parseFloat(l.dataset.price) * q
      $('.lsum', l).textContent = fmt(s)
      sub += s
    })
    var free = sub > 5000
    $('#sub').textContent = fmt(sub)
    $('#ship').textContent = free ? 'Бесплатно' : '150 ₽'
    $('#tot').textContent = fmt(sub + (free ? 0 : 150))
    var left = Math.max(0, 5000 - sub)
    $('#free-text').innerHTML = free
      ? '<b>Доставка бесплатная.</b> Заказ превысил 5 000 ₽.'
      : 'До бесплатной доставки осталось <b>' + fmt(left) + ' ₽</b>'
    $('#free-bar').style.width = Math.min(100, (sub / 5000) * 100) + '%'
    var tot = $('#cart-total')
    if (tot) tot.textContent = fmt(sub) + ' ₽'
    var cnt = $('#cart-count')
    if (cnt) cnt.textContent = '· ' + lines.length + ' поз.'
  }
  document.addEventListener('click', function (e) {
    var x = e.target.closest('.cline .x')
    if (!x) return
    x.closest('.cline').remove()
    recalc()
  })
  $$('#who .fchip').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#who .fchip').forEach(function (x) { x.classList.remove('is-on') })
      b.classList.add('is-on')
    })
  })
  var order = $('#order')
  if (order) {
    order.addEventListener('click', function () {
      $('#order-msg').textContent = 'Это демо: заказ никуда не отправлен.'
    })
  }
  recalc()
})()
