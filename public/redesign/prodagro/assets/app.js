// Интерактивность концепта ПродАгро: варианты цены (штука / упаковка / кг), количество,
// мини-корзина, поиск с подсказками, каталог, корзина с доставкой. Данные никуда не отправляются.
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var fmt = function (v) {
    var r = Math.round(v * 100) / 100
    var d = r % 1 ? 2 : 0
    return r.toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d })
  }

  // мини-корзина в шапке и таббаре: целые рубли, чтобы ширина не прыгала
  var mini = { sum: 1983.2, count: 3 }
  var paintMini = function () {
    var whole = Math.round(mini.sum).toLocaleString('ru-RU') + ' ₽'
    $$('#cart-total, [data-cart-total]').forEach(function (el) { el.textContent = whole })
    $$('#cart-count, [data-cart-count]').forEach(function (el) { el.textContent = mini.count })
  }

  // строка покупки: карточка (.pcard), страница товара (.pp) или строка корзины (.cline)
  var rowOf = function (el) { return el.closest('.pcard, .pp, .cline') }
  var currentVar = function (row) { return $('.var.is-on, .pvar.is-on', row) }
  var qtyOf = function (row) { return parseInt($('[data-val]', row).textContent, 10) || 1 }
  var lineSum = function (row) {
    var v = currentVar(row)
    var price = v ? parseFloat(v.dataset.price) : parseFloat(row.dataset.price)
    return price * qtyOf(row)
  }
  // если позиция уже в корзине, любое изменение варианта или количества меняет итог
  var syncLine = function (row) {
    if (!row.dataset.inCart) return
    var next = lineSum(row)
    mini.sum += next - parseFloat(row.dataset.line || 0)
    row.dataset.line = next
    paintMini()
  }

  // выбор варианта цены
  var applyVar = function (row, v) {
    $$('.var, .pvar', row).forEach(function (x) { x.classList.toggle('is-on', x === v); x.setAttribute('aria-pressed', x === v) })
    var out = $('[data-price-out]', row)
    if (out) out.textContent = fmt(parseFloat(v.dataset.price)) + ' ₽'
    var unitOut = $('[data-unit-out]', row)
    if (unitOut) unitOut.textContent = 'за ' + v.dataset.unit
    var per = $('[data-per-out]', row)
    if (per) per.textContent = v.dataset.per || ''
    var val = $('[data-val]', row)
    if (val) { val.dataset.unit = v.dataset.unit; val.textContent = v.dataset.min || 1 }
    var del = $('[data-del-out]', row)
    if (del && v.dataset.del) del.textContent = fmt(parseFloat(v.dataset.del)) + ' ₽'
    syncLine(row)
  }
  document.addEventListener('click', function (e) {
    var v = e.target.closest('.var, .pvar')
    if (!v) return
    applyVar(rowOf(v), v)
  })
  $$('.pcard, .pp').forEach(function (row) {
    var v = currentVar(row)
    if (v) applyVar(row, v)
  })

  // количество
  document.addEventListener('click', function (e) {
    var inc = e.target.closest('[data-inc]')
    var dec = e.target.closest('[data-dec]')
    if (!inc && !dec) return
    var row = rowOf(e.target)
    var val = $('[data-val]', row)
    var v = currentVar(row)
    var min = parseInt((v && v.dataset.min) || row.dataset.min || 1, 10)
    var n = parseInt(val.textContent, 10) || min
    var next = inc ? n + 1 : Math.max(min, n - 1)
    if (next === n) return
    val.textContent = next
    if (row.classList.contains('cline')) recalc()
    else syncLine(row)
  })

  // «В корзину»: добавляет выбранный вариант и количество; повторное нажатие ведёт в корзину
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.add')
    if (!btn) return
    var row = rowOf(btn)
    if (row.dataset.inCart) { location.href = 'cart.html'; return }
    row.dataset.inCart = '1'
    row.dataset.line = lineSum(row)
    mini.sum += parseFloat(row.dataset.line); mini.count += 1; paintMini()
    btn.classList.add('is-added')
    btn.textContent = 'В корзине'
  })

  // модалки: «сообщить о поступлении», заявка на договор
  var openModal = function (id, title) {
    var m = document.getElementById(id)
    if (!m) return
    var t = $('[data-modal-title]', m)
    if (t && title) t.textContent = title
    var msg = $('.form-msg', m)
    if (msg) msg.textContent = ''
    m.showModal()
  }
  document.addEventListener('click', function (e) {
    var n = e.target.closest('[data-notify]')
    if (n) { e.preventDefault(); openModal('notify', n.dataset.notify); return }
    var c = e.target.closest('[data-contract]')
    if (c) { e.preventDefault(); openModal('contract') }
  })
  $$('dialog.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m) m.close() })
  })

  // демо-формы: подписка, уведомление, договор
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault()
      var msg = $('.form-msg', f) || $('.form-msg', f.parentNode)
      if (msg) msg.textContent = f.dataset.demo
      f.reset()
    })
  })

  // поиск с подсказками по товарам концепта
  var index = [
    ['Кетчуп Махеевъ Болгарский дой-пак 300 г', 80, 'шт', 'ketchup-maheev-bolgarskij-doj-pak-300-g-116.200x200.jpg'],
    ['Кетчуп Махеевъ Шашлычный дой-пак 300 г', 80, 'шт', 'ketchup-maheev-shashlychnyj-doj-pak-300-g-116.200x200.png'],
    ['Макфа макароны виток №231 400 г', 70.5, 'шт', 'makfa-makizd-vitok-231-3-400-g-120.200x200.jpg'],
    ['Мука Мельник в/с 10 кг', 1875, 'мешок', '21Jul2017_399P1555.200x200.jpg'],
    ['Сахар 3 кг', 220.5, 'уп', 'sahar3.200x200.jpg'],
    ['Рис круглый Приморье 25 кг', 1525, 'мешок', 'ris-kruglyj-primore-zolotoj-meshok-25-kg.200x200.png'],
    ['Пшено в/с ГОСТ 50 кг', 2200, 'мешок', 'psheno-vs-gost-50-kg.200x200.jpg'],
    ['Пшено в/с 5 кг', 240, 'уп', 'psheno-vs-5-kg.200x200.png'],
    ['Чечевица красная 1 кг', 101, 'шт', 'chechevitsa-krasnaya-15-kg.200x200.png'],
    ['Чечевица зелёная 1 кг', 81, 'шт', 'chechevitsa-zelenaya-15-kg.200x200.png'],
    ['Нут 1 кг', 83, 'шт', 'nut-7-15-kg.200x200.png'],
    ['Кускус 1 кг', 182, 'шт', 'kuskus-15-kg.200x200.png'],
    ['Киноа белое 1 кг, Индия', 273, 'шт', 'kinoa-beloe-1-kg-indiya-11.200x200.png'],
    ['Доширак говядина, чашка', 66.7, 'шт', 'doshirak-govyadina-chashka124.200x200.png'],
    ['Доширак курица, чашка', 63.8, 'шт', 'doshirak-kuritsa-chashka-124.200x200.jpg'],
    ['Чибо Эксклюзив 150 г, растворимый кофе', 492, 'шт', 'chibo-tibio-eksklyuziv-150-g-mu-112.200x200.jpg'],
    ['Сок томатный Сады Придонья 1 л', 115.5, 'шт', 'sady-pridonya-1l-tomatnyj-s-solyu-112.200x200.jpg'],
    ['Сливки Милкавита 20% 500 г', 167, 'шт', '3409e45349ec9f6b3397bfe10e87a1d0_XL%5B1%5D.200x200.jpg'],
    ['Перец чёрный молотый 1 кг', 870, 'шт', 'perets-chernyj-molotyj-vs-mesh-110-kg.200x200.jpg'],
    ['Гринфилд Гранд Фрут, чай 25 пак.', 78, 'шт', 'grinfild-grand-frut-chaj-chern-granat-rozmarin-25-pak-110.200x200.jpg'],
    ['Аджика абхазская Баба Маня 170 г', 77, 'шт', 'adzhika-abhazskaya-baba-manya-170-g-sb-belarus-110-sht.200x200.jpg']
  ]
  var IMG = 'https://prodmak38.ru/files/products/'
  $$('.search').forEach(function (box) {
    var input = $('input', box)
    var list = $('.suggest', box)
    if (!input || !list) return
    var render = function () {
      var q = input.value.trim().toLowerCase()
      if (q.length < 2) { list.classList.remove('is-open'); return }
      var found = index.filter(function (p) { return p[0].toLowerCase().indexOf(q) > -1 }).slice(0, 6)
      list.innerHTML = found.length
        ? found.map(function (p, i) {
            return '<a href="product.html"' + (i ? '' : ' class="is-active"') + '><img src="' + IMG + p[3] + '" alt=""><span></span><b>' + fmt(p[1]) + ' ₽ / ' + p[2] + '</b></a>'
          }).join('')
        : '<p>Ничего не нашли. Попробуйте «крупа», «кетчуп» или «мука».</p>'
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

  // каталог: сортировка и фильтр по фасовке
  var grid = $('#grid')
  if (grid) {
    var cards = $$('.pcard', grid)
    cards.forEach(function (c, i) { c.dataset.pos = i })
    var state = { sort: 'pos', kind: 'all' }
    var price = function (c) { var v = currentVar(c); return v ? parseFloat(v.dataset.price) : 0 }
    var apply = function () {
      var list = cards.filter(function (c) { return state.kind === 'all' || c.dataset.kind === state.kind })
      list.sort(function (a, b) {
        if (state.sort === 'price') return price(a) - price(b)
        if (state.sort === 'name') return $('.pcard__title', a).textContent.localeCompare($('.pcard__title', b).textContent, 'ru')
        return a.dataset.pos - b.dataset.pos
      })
      cards.forEach(function (c) { c.hidden = true })
      list.forEach(function (c) { c.hidden = false; grid.appendChild(c) })
      $('#count').textContent = list.length
    }
    $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; apply() })
    $$('#fchips .fchip').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('#fchips .fchip').forEach(function (x) { x.classList.toggle('is-on', x === b) })
        state.kind = b.dataset.kind
        apply()
      })
    })
  }

  // корзина
  var MIN = 3000
  var recalc = function () {
    var lines = $$('.cline')
    var box = $('#free-box')
    if (!box) return
    var sub = 0, units = 0, weight = 0
    lines.forEach(function (l) {
      var q = qtyOf(l)
      var s = parseFloat(l.dataset.price) * q
      $('.lsum', l).textContent = fmt(s)
      sub += s
      units += q * parseFloat(l.dataset.units || 1)
      weight += q * parseFloat(l.dataset.weight || 0)
    })
    var opt = $('input[name="delivery"]:checked')
    var perUnit = opt ? parseFloat(opt.dataset.perUnit || 0) : 0
    var isDelivery = opt && opt.value !== 'pickup'
    var ship = Math.round(units * perUnit * 100) / 100
    $('#sub').textContent = fmt(sub)
    $('#units').textContent = units
    $('#weight').textContent = (Math.round(weight * 10) / 10).toLocaleString('ru-RU')
    $('#ship').textContent = ship ? fmt(ship) + ' ₽' : (opt && opt.value === 'org' ? 'по договору' : 'бесплатно')
    $('#ship-pop').textContent = fmt(units * 2) + ' ₽'
    $('#tot').textContent = fmt(sub + ship)
    var ok = sub >= MIN
    box.classList.toggle('is-ok', ok || !isDelivery)
    $('#free-text').innerHTML = !isDelivery
      ? '<b>Самовывоз со склада.</b> Минимальной суммы нет.'
      : ok ? '<b>Сумма достаточна для доставки.</b> Оператор позвонит и согласует день.'
        : 'Для доставки нужен заказ от 3 000 ₽. Добавьте ещё на <b>' + fmt(MIN - sub) + ' ₽</b>'
    $('#free-bar').style.width = (isDelivery ? Math.min(100, sub / MIN * 100) : 100) + '%'
    var order = $('#order')
    order.disabled = isDelivery && !ok
    $('#order-hint').textContent = order.disabled ? 'Доставка от 3 000 ₽ — добавьте товары или выберите самовывоз' : ''
    $('#lines-count').textContent = lines.length
    mini.sum = sub; mini.count = lines.length; paintMini()
    var empty = $('#cart-empty')
    if (empty) empty.hidden = lines.length > 0
  }
  document.addEventListener('click', function (e) {
    var x = e.target.closest('.cline .x')
    if (x) { x.closest('.cline').remove(); recalc(); return }
    if (e.target.closest('#clear')) { $$('.cline').forEach(function (l) { l.remove() }); recalc() }
  })
  $$('input[name="delivery"]').forEach(function (r) { r.addEventListener('change', recalc) })
  var checkout = $('#checkout')
  if (checkout) {
    checkout.addEventListener('submit', function (e) {
      e.preventDefault()
      $('#order-msg').textContent = 'Это демо: заказ никуда не отправлен. В магазине оператор перезвонит для подтверждения.'
    })
  }

  recalc()
  paintMini()
})()
