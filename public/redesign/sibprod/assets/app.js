// Интерактивность концепта «Сибирский продукт»: ближайший интервал доставки по их таблице,
// карточки с «+» на фото, покупка упаковкой, избранное, слайдер, поиск, каталог, корзина.
// Данные никуда не отправляются.
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var money = function (v) {
    var r = Math.round(v * 100) / 100, d = r % 1 ? 2 : 0
    return r.toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d })
  }

  // ---------- интервалы доставки (время Новосибирска) ----------
  var SLOTS = [[10, 13], [13, 17], [18, 22]]
  var DAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
  var nskNow = function () {
    var p = {}
    new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Novosibirsk', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short' })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value })
    var d = new Date(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute)
    return d
  }
  // какие интервалы доступны в день dayOffset для заказа, оформленного сейчас
  var slotsFor = function (now, dayOffset) {
    var day = new Date(now); day.setDate(day.getDate() + dayOffset)
    var wd = day.getDay()
    if (wd === 6) return [] // суббота — без доставки
    var allowed = SLOTS.map(function (s, i) { return wd === 0 ? i > 0 : true }) // воскресенье с 13:00
    if (dayOffset === 0) {
      var h = now.getHours() + now.getMinutes() / 60
      // по их таблице: до 9:00 — все три, до 11:00 — с 13:00, до 17:00 — вечер, позже — со следующего дня
      var first = h < 9 ? 0 : h < 11 ? 1 : h < 17 ? 2 : 3
      allowed = allowed.map(function (a, i) { return a && i >= first })
    }
    return allowed
  }
  var deadlineFor = function (i) { return ['09:00', '11:00', '17:00'][i] }
  var pad = function (n) { return (n < 10 ? '0' : '') + n }
  var slotText = function (s) { return 'с ' + pad(s[0]) + ':00 до ' + pad(s[1]) + ':00' }
  var dayName = function (off, now) {
    if (off === 0) return 'Сегодня'
    if (off === 1) return 'Завтра'
    var d = new Date(now); d.setDate(d.getDate() + off)
    return DAYS[d.getDay()][0].toUpperCase() + DAYS[d.getDay()].slice(1) + ', ' + d.getDate()
  }
  var nearest = function () {
    var now = nskNow()
    for (var off = 0; off < 4; off++) {
      var a = slotsFor(now, off)
      for (var i = 0; i < 3; i++) if (a[i]) return { off: off, i: i, now: now }
    }
  }
  var paintNearest = function () {
    var n = nearest(); if (!n) return
    var when = dayName(n.off, n.now).toLowerCase() + ' ' + slotText(SLOTS[n.i])
    $$('[data-nearest]').forEach(function (el) { el.textContent = 'Привезём ' + when })
    $$('[data-nearest-hint]').forEach(function (el) {
      el.textContent = n.off === 0 ? 'если оформить заказ до ' + deadlineFor(n.i) + ' по Новосибирску'
        : n.now.getDay() === 6 ? 'в субботу доставки нет — заказ можно оформить уже сейчас'
        : 'на сегодня приём заказов закрыт — привезём в ближайший интервал'
    })
  }
  paintNearest()

  // ---------- мини-корзина ----------
  var mini = { sum: 1411, count: 5 }
  var paintMini = function () {
    var whole = Math.round(mini.sum).toLocaleString('ru-RU') + ' ₽'
    $$('[data-cart-total]').forEach(function (el) { el.textContent = whole })
    $$('[data-cart-count]').forEach(function (el) { el.textContent = mini.count; el.toggleAttribute('data-zero', !mini.count) })
  }

  // ---------- карточки K2 и страница товара ----------
  var rowOf = function (el) { return el.closest('.card, .pp') }
  var priceOf = function (row) { return parseFloat(row.dataset.price) || 0 }
  var qtyEl = function (row) { return $('[data-val]', row) }
  var setQty = function (row, q) {
    var prev = parseInt(row.dataset.q || 0, 10)
    q = Math.max(0, q)
    row.dataset.q = q
    if (qtyEl(row)) qtyEl(row).textContent = Math.max(q, 1)
    if (row.classList.contains('card')) {
      row.classList.toggle('is-in', q > 0)
      if (!prev && q) mini.count += 1
      if (prev && !q) mini.count -= 1
      mini.sum += (q - prev) * priceOf(row); paintMini()
    }
  }
  document.addEventListener('click', function (e) {
    var t = e.target
    var plus = t.closest('.plus'), inc = t.closest('[data-inc]'), dec = t.closest('[data-dec]'), pack = t.closest('.packbtn')
    var row = rowOf(t)
    if (!row) return
    if (row.classList.contains('pp')) { ppClick(e, row); return }
    if (plus) setQty(row, 1)
    else if (inc) setQty(row, parseInt(row.dataset.q || 0, 10) + 1)
    else if (dec) setQty(row, parseInt(row.dataset.q || 0, 10) - 1)
    else if (pack) setQty(row, parseInt(row.dataset.q || 0, 10) + parseInt(row.dataset.pack, 10))
  })
  // страница товара: количество выбирается до добавления
  var ppClick = function (e, row) {
    var t = e.target
    var q = parseInt(qtyEl(row).textContent, 10) || 1, next = q
    if (t.closest('[data-inc]')) next = q + 1
    else if (t.closest('[data-dec]')) next = Math.max(1, q - 1)
    else if (t.closest('.packbtn')) next = q < parseInt(row.dataset.pack, 10) ? parseInt(row.dataset.pack, 10) : q + parseInt(row.dataset.pack, 10)
    else if (t.closest('.add')) {
      var btn = t.closest('.add')
      if (btn.classList.contains('is-added')) { location.href = 'cart.html'; return }
      mini.sum += q * priceOf(row); mini.count += 1; paintMini()
      btn.classList.add('is-added'); btn.textContent = 'В корзине — перейти'
      return
    }
    qtyEl(row).textContent = next
    // товар уже в корзине — количество меняется в ней же
    if (row.querySelector('.add.is-added')) { mini.sum += (next - q) * priceOf(row); paintMini() }
  }

  // ---------- избранное ----------
  var favs = 0
  document.addEventListener('click', function (e) {
    var f = e.target.closest('.fav')
    if (!f) return
    var on = f.getAttribute('aria-pressed') !== 'true'
    f.setAttribute('aria-pressed', on)
    f.setAttribute('aria-label', on ? 'Убрать из избранного' : 'В избранное')
    favs += on ? 1 : -1
    $$('[data-fav-count]').forEach(function (el) { el.textContent = favs; el.toggleAttribute('data-zero', !favs) })
  })

  // ---------- слайдер ----------
  $$('.slider').forEach(function (sl) {
    var track = $('.slides', sl), n = $$('.slide', sl).length, i = 0
    var dots = $$('.slider__dot', sl)
    var go = function (k) {
      i = (k + n) % n
      track.style.transform = 'translateX(' + (-100 * i) + '%)'
      dots.forEach(function (d, j) { d.classList.toggle('is-on', j === i); d.setAttribute('aria-current', j === i) })
      sl.dataset.tone = $$('.slide', sl)[i].dataset.tone || ''
    }
    dots.forEach(function (d, j) { d.addEventListener('click', function () { go(j) }) })
    var p = $('.slider__arrow--prev', sl), nx = $('.slider__arrow--next', sl)
    if (p) p.addEventListener('click', function () { go(i - 1) })
    if (nx) nx.addEventListener('click', function () { go(i + 1) })
    var x0 = null
    sl.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX }, { passive: true })
    sl.addEventListener('touchend', function (e) {
      if (x0 === null) return
      var dx = e.changedTouches[0].clientX - x0
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1))
      x0 = null
    })
    go(0)
  })

  // ---------- поиск с подсказками ----------
  var IMG = 'https://sibprod.info/upload/iblock/'
  var index = [
    ['Царский сыр 45% «Сливкин Дом», 380 г', 250, '390/390a8f2d40a8d7facfc1f85268f767f7.png'],
    ['Масло сливочное 82,5% «Сливкин Дом», 180 г', 135, '47f/47fd0bec647ee1c572e8999362416bbb.png'],
    ['Масло сливочное Крестьянское 72,5% «Белогорье», 150 г', 133, 'edb/edb987fe2c987cb9ee3e1090afbc195f.jpeg'],
    ['Маасдам сыр 45% «Белогорье», 180 г', 216, '368/368f6129b6751a409eb7c0912aafc8cc.png'],
    ['Пармезан сыр 40% «Белогорье», 180 г', 227, '19c/19c1d79e38271da1e40146062d758e7d.png'],
    ['Рикотта сыр мягкий 40% «Сливкин Дом», 500 г', 199, 'e12/e12850b398ed869e34fa4ed1cb95bab9.png'],
    ['Творожный сыр 70% «Сливкин Дом», 400 г', 231, 'ddb/ddbfadf3a65f175700dec614d7c9a1a5.png'],
    ['Сулугуни сыр 45% «Умалат», 280 г', 150, 'c36/c3635cd5ff1f327a1a415d78d4ab34d8.png'],
    ['Бри Alti с плесенью 60%, 125 г', 304, '4d9/4d9a01f563b2cbec8b15cd349ed8f85e.jpeg'],
    ['Сметана 15% «Село Зелёное», 300 г', 98, '2de/2de4b2c115c572e59c6a6ff1431a5060.jpeg'],
    ['Ряженка термостатная 4% «Село Зелёное», 200 г', 63, 'e22/e22c9896c8b3aff10bdc0c7e1ebe2343.png'],
    ['Пельмени «Домашние», 900 г', 494, 'd2d/d2d8379598ed5b68892035e1498bcfe3.png'],
    ['Сырники, 450 г', 351, 'd89/d89cc5498c9fbad7d61335e6663a955a.png'],
    ['Позы (манты по-бурятски), 960 г', 467, 'f67/f67832bd4aba4e4597003485b274b0ae.png'],
    ['Молоко сгущённое «Минская марка», 380 г', 161, '003/003bd65f3ea45d328d283b906989fb2a.png']
  ]
  $$('.search').forEach(function (box) {
    var input = $('input', box), list = $('.suggest', box)
    if (!input || !list) return
    var render = function () {
      var q = input.value.trim().toLowerCase()
      if (q.length < 2) { list.classList.remove('is-open'); return }
      var found = index.filter(function (p) { return p[0].toLowerCase().replace(/ё/g, 'е').indexOf(q.replace(/ё/g, 'е')) > -1 }).slice(0, 6)
      list.innerHTML = found.length
        ? found.map(function (p, i) { return '<a href="product.html"' + (i ? '' : ' class="is-active"') + '><img src="' + IMG + p[2] + '" alt=""><span></span><b>' + money(p[1]) + ' ₽</b></a>' }).join('')
        : '<p>Ничего не нашли. Попробуйте «сыр», «масло» или «пельмени».</p>'
      $$('a span', list).forEach(function (s, i) { s.textContent = found[i][0] })
      list.classList.add('is-open')
    }
    input.addEventListener('input', render)
    input.addEventListener('focus', render)
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var a = $('a', list); location.href = a ? a.getAttribute('href') : 'catalog.html' }
      if (e.key === 'Escape') list.classList.remove('is-open')
    })
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) list.classList.remove('is-open') })
  })
  $$('.quick a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var inp = $('.search input'); if (!inp || !a.dataset.q) return
      e.preventDefault(); inp.value = a.dataset.q; inp.focus(); inp.dispatchEvent(new Event('input'))
    })
  })

  // ---------- каталог ----------
  var grid = $('#grid')
  if (grid) {
    var cards = $$('.card', grid)
    cards.forEach(function (c, i) { c.dataset.pos = i })
    var st = { kind: 'all', sort: 'pos', stm: false, sale: false, many: false }
    var apply = function () {
      var list = cards.filter(function (c) {
        return (st.kind === 'all' || c.dataset.kind === st.kind) && (!st.stm || c.dataset.stm) && (!st.sale || c.dataset.sale) && (!st.many || c.dataset.many)
      })
      list.sort(function (a, b) {
        if (st.sort === 'asc') return priceOf(a) - priceOf(b)
        if (st.sort === 'desc') return priceOf(b) - priceOf(a)
        return a.dataset.pos - b.dataset.pos
      })
      cards.forEach(function (c) { c.hidden = true })
      list.forEach(function (c) { c.hidden = false; grid.appendChild(c) })
      $('#count').textContent = list.length
      $('#empty').hidden = list.length > 0
    }
    $$('.sub[data-kind]').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.sub[data-kind]').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b) })
        st.kind = b.dataset.kind; apply()
      })
    })
    $('#sort').addEventListener('change', function (e) { st.sort = e.target.value; apply() })
    ;['stm', 'sale', 'many'].forEach(function (k) { $('#f-' + k).addEventListener('change', function (e) { st[k] = e.target.checked; apply() }) })
  }

  // ---------- корзина ----------
  var cart = $('#cartpage')
  var mode = 'courier', dayOff = 0, slotI = -1
  var renderSlots = function () {
    if (!cart) return
    var now = nskNow()
    // выбранный день без доставки (суббота, закрытый приём) — переходим на ближайший день с интервалами
    while (dayOff < 3 && !slotsFor(now, dayOff).some(Boolean)) dayOff++
    $$('.days .sub').forEach(function (b, off) {
      b.textContent = dayName(off, now)
      var any = slotsFor(now, off).some(Boolean)
      b.disabled = !any
      b.classList.toggle('is-on', off === dayOff)
    })
    var a = slotsFor(now, dayOff)
    if (slotI < 0 || !a[slotI]) slotI = a.indexOf(true)
    $$('.slotbtn').forEach(function (b, i) {
      b.disabled = !a[i]
      b.classList.toggle('is-on', i === slotI)
      $('small', b).textContent = a[i] ? 'есть места' : (dayOff === 0 ? 'приём закрыт' : 'нет доставки')
    })
  }
  var recalc = function () {
    if (!cart) return
    var sub = 0, units = 0
    $$('.cline').forEach(function (l) {
      var q = parseInt($('[data-val]', l).textContent, 10) || 1
      var s = parseFloat(l.dataset.price) * q
      $('.lsum', l).textContent = money(s); sub += s; units += q
    })
    var min = mode === 'courier' ? 2000 : 1000
    var fee = mode === 'courier' ? 305 : 0
    var ok = sub >= min
    $('#sub').textContent = money(sub)
    $('#fee').textContent = fee ? money(fee) + ' ₽' : 'бесплатно'
    $('#tot').textContent = money(sub + fee)
    $('#units').textContent = units
    var bar = $('#minbar')
    bar.classList.toggle('is-ok', ok)
    bar.style.setProperty('--p', Math.min(100, sub / min * 100) + '%')
    $('#mintext').innerHTML = ok
      ? (mode === 'courier' ? 'Сумма достаточна для доставки курьером' : 'Сумма достаточна для самовывоза')
      : 'Минимальный заказ ' + (mode === 'courier' ? 'на доставку' : 'для самовывоза') + ' — ' + money(min) + ' ₽. Добавьте ещё на <b>' + money(min - sub) + ' ₽</b>'
    $('#order').disabled = !ok
    mini.sum = sub; mini.count = $$('.cline').length; paintMini()
    var empty = $('#cart-empty'); if (empty) empty.hidden = $$('.cline').length > 0
  }
  if (cart) {
    document.addEventListener('click', function (e) {
      var t = e.target
      var line = t.closest('.cline')
      if (line && t.closest('[data-inc]')) { var v = $('[data-val]', line); v.textContent = (parseInt(v.textContent, 10) || 1) + 1; recalc() }
      if (line && t.closest('[data-dec]')) { var w = $('[data-val]', line); w.textContent = Math.max(1, (parseInt(w.textContent, 10) || 1) - 1); recalc() }
      if (line && t.closest('.x')) { line.remove(); recalc() }
      var m = t.closest('[data-mode]')
      if (m) {
        mode = m.dataset.mode
        $$('[data-mode]').forEach(function (b) { b.classList.toggle('is-on', b === m) })
        cart.classList.toggle('is-pickup', mode === 'pickup')
        recalc()
      }
      var d = t.closest('.days .sub')
      if (d && !d.disabled) { dayOff = $$('.days .sub').indexOf(d); slotI = -1; renderSlots() }
      var s = t.closest('.slotbtn')
      if (s && !s.disabled) { slotI = $$('.slotbtn').indexOf(s); renderSlots() }
    })
    $('#checkout').addEventListener('submit', function (e) {
      e.preventDefault()
      $('#order-msg').textContent = 'Это демо: заказ никуда не отправлен. В магазине менеджер подтвердит заказ и интервал.'
    })
    renderSlots(); recalc()
  }

  // ---------- мега-меню каталога ----------
  // как у СибирьТрейда: страница под меню затемнена и не прокручивается, разделы с иконками слева,
  // справа тонированная панель подразделов и популярные товары; на телефоне — по уровням
  var mega = $('#mega')
  if (mega) {
    var catbtn = $('.catbtn')
    var band = mega.parentElement
    var isPhone = function () { return window.matchMedia('(max-width:768px)').matches }
    var POP = { cheese: [0, 3, 7, 8], dairy: [1, 9, 10, 2], curd: [6, 5], condensed: [14], frozen: [11, 12, 13], sale: [0, 1, 11, 14], new: [8, 13, 5, 7] }
    $$('.mega__panel', mega).forEach(function (p) {
      var h = $('h3', p), all = $('h3 a', p)
      if (all) { all.className = 'mega__all'; all.innerHTML = 'Все товары раздела <span aria-hidden="true">→</span>'; h.insertAdjacentElement('afterend', all) }
      var ids = POP[p.dataset.key]
      if (!ids) return
      p.insertAdjacentHTML('beforeend', '<div class="mega__pop"><b>Часто берут</b><div>' + ids.map(function (i) {
        var x = index[i]
        return '<a href="product.html"><img src="' + IMG + x[2] + '" alt="" loading="lazy"><span>' + x[0] + '</span><em>' + money(x[1]) + ' ₽</em></a>'
      }).join('') + '</div></div>')
    })
    var shade = document.createElement('div')
    shade.className = 'mega-shade'
    document.body.appendChild(shade)
    var fit = function () {
      // меню занимает ровно видимую часть экрана под синей полосой — ничего не уезжает вниз
      var top = band.getBoundingClientRect().bottom
      mega.style.setProperty('--mega-top', Math.max(0, top) + 'px')
      shade.style.top = Math.max(0, top) + 'px'
    }
    var show = function (key) {
      $$('.mega__l1 button', mega).forEach(function (b) { b.classList.toggle('is-on', b.dataset.key === key) })
      $$('.mega__panel', mega).forEach(function (p) { p.classList.toggle('is-on', p.dataset.key === key) })
      var b = $('.mega__l1 button[data-key="' + key + '"] b', mega)
      $('#mega-title').textContent = isPhone() && mega.classList.contains('is-l2') && b ? b.textContent : 'Каталог'
    }
    var open = function () {
      mega.classList.add('is-open'); mega.classList.remove('is-l2')
      shade.classList.add('is-on')
      if (catbtn) catbtn.setAttribute('aria-expanded', 'true')
      show(($('.mega__l1 button.is-on', mega) || $('.mega__l1 button[data-key="cheese"]', mega)).dataset.key)
      document.documentElement.classList.add('is-locked')
      fit()
    }
    var close = function () {
      mega.classList.remove('is-open', 'is-l2')
      shade.classList.remove('is-on')
      if (catbtn) catbtn.setAttribute('aria-expanded', 'false')
      document.documentElement.classList.remove('is-locked')
    }
    window.addEventListener('resize', function () { if (mega.classList.contains('is-open')) fit() })
    shade.addEventListener('click', close)
    document.addEventListener('click', function (e) {
      var t = e.target
      if (t.closest('[data-mega]')) { e.preventDefault(); mega.classList.contains('is-open') ? close() : open(); return }
      var l1 = t.closest('.mega__l1 button')
      if (l1) {
        if (isPhone()) { mega.classList.add('is-l2'); show(l1.dataset.key); mega.scrollTop = 0 }
        else location.href = 'catalog.html'
        return
      }
      if (t.closest('.mega__back')) { mega.classList.remove('is-l2'); show($('.mega__l1 button.is-on', mega).dataset.key); return }
      if (t.closest('.mega__close')) { close(); return }
    })
    var hoverT = null
    $$('.mega__l1 button', mega).forEach(function (b) {
      // небольшая задержка, чтобы при движении мыши по диагонали к подразделам раздел не перескакивал
      b.addEventListener('mouseenter', function () { if (isPhone()) return; clearTimeout(hoverT); hoverT = setTimeout(function () { show(b.dataset.key) }, 90) })
      b.addEventListener('mouseleave', function () { clearTimeout(hoverT) })
      b.addEventListener('focus', function () { if (!isPhone()) show(b.dataset.key) })
    })
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mega.classList.contains('is-open')) { close(); if (catbtn) catbtn.focus() } })
  }

  // ---------- демо-окна ----------
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]')
    if (!o) return
    e.preventDefault()
    var m = document.getElementById(o.dataset.open)
    if (!m) return
    var msg = $('.form-msg', m); if (msg) msg.textContent = ''
    m.showModal()
  })
  $$('dialog.modal').forEach(function (m) { m.addEventListener('click', function (e) { if (e.target === m) m.close() }) })
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); var msg = $('.form-msg', f); if (msg) msg.textContent = f.dataset.demo; f.reset() })
  })

  paintMini()
})()
