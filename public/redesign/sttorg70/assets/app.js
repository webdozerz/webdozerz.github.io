// Лёгкая интерактивность концепта: счётчики количества, фильтры каталога, пересчёт корзины.
// Данные никуда не отправляются.
(function () {
  var fmt = function (v) {
    var r = Math.round(v * 100) / 100
    // копейки показываем парой цифр: 599,40 ₽, а не 599,4 ₽
    var d = r % 1 ? 2 : 0
    return r.toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d })
  }
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }

  // мини-корзина в шапке и таббаре
  var mini = { sum: 4345.2, count: 4 }
  var paintMini = function () {
    // в шапке и таббаре целые рубли: копейки меняли ширину и двигали кнопки
    var whole = Math.round(mini.sum).toLocaleString('ru-RU') + ' ₽'
    $$('#cart-total, [data-cart-total]').forEach(function (el) { el.textContent = whole })
    $$('#cart-count, [data-cart-count]').forEach(function (el) { el.textContent = mini.count })
  }
  var cardPrice = function (el) {
    var card = el.closest('[data-price]')
    return card ? parseFloat(card.dataset.price) || 0 : 0
  }

  // единица в счётчике карточки: «2 кг», «3 шт»
  $$('.pcard').forEach(function (c) {
    var unit = $('.price small', c)
    var val = $('.buy [data-val]', c)
    if (unit && val) val.dataset.unit = unit.textContent.replace('/', '').trim()
  })

  // бейдж акции показывает размер скидки
  $$('.pcard').forEach(function (c) {
    var tag = $('.tag--sale', c)
    var old = $('.price s', c)
    if (!tag || !old) return
    var was = parseFloat(old.textContent.replace(/\s/g, '').replace(',', '.'))
    var now = parseFloat(c.dataset.price)
    if (was > now) tag.textContent = '−' + Math.round((1 - now / was) * 100) + '%'
  })

  // счётчики количества: выбор до добавления, после добавления правка сразу меняет корзину
  document.addEventListener('click', function (e) {
    var inc = e.target.closest('[data-inc]')
    var dec = e.target.closest('[data-dec]')
    if (!inc && !dec) return
    var box = e.target.closest('.qty')
    var val = $('[data-val]', box)
    var n = parseInt(val.textContent, 10) || 1
    var next = inc ? n + 1 : Math.max(1, n - 1)
    if (next === n) return
    val.textContent = next
    var buy = box.closest('.buy')
    if (buy && buy.dataset.inCart) { mini.sum += (next - n) * cardPrice(box); paintMini() }
    if (box.closest('.cline')) recalc()
  })

  // «В корзину»: добавляет выбранное количество; повторное нажатие ведёт в корзину
  var addToCart = function (btn) {
    var row = btn.closest('.buy, .buyrow')
    var q = parseInt($('[data-val]', row).textContent, 10) || 1
    var price = cardPrice(btn)
    if (row.dataset.inCart) return false
    row.dataset.inCart = '1'
    mini.sum += price * q; mini.count += 1; paintMini()
    btn.classList.add('is-added')
    btn.dataset.label = btn.textContent
    btn.textContent = 'В корзине'
    return true
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.add')
    if (!btn) return
    if (!addToCart(btn)) location.href = 'cart.html'
  })
  var buyNow = $('[data-buy-now]')
  if (buyNow) buyNow.addEventListener('click', function () { addToCart($('.buyrow .add')) })

  // избранное: сердечко на карточке и на странице товара, счётчик в шапке и таббаре
  var favs = 0
  document.addEventListener('click', function (e) {
    var fav = e.target.closest('.fav')
    if (!fav) return
    var on = fav.getAttribute('aria-pressed') !== 'true'
    fav.setAttribute('aria-pressed', on)
    fav.setAttribute('aria-label', on ? 'Убрать из избранного' : 'В избранное')
    favs += on ? 1 : -1
    $$('[data-fav-count]').forEach(function (el) { el.textContent = favs })
    $$('[data-fav-badge]').forEach(function (el) {
      el.textContent = favs || ''
      if (favs) el.removeAttribute('data-zero'); else el.setAttribute('data-zero', '')
    })
  })

  // вход по телефону (демо)
  var login = $('#login')
  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-login]') || !login) return
    e.preventDefault()
    $('#login-msg').textContent = ''
    login.showModal()
  })
  if (login) {
    login.addEventListener('click', function (e) { if (e.target === login) login.close() })
    $('#login-form').addEventListener('submit', function (e) {
      e.preventDefault()
      $('#login-msg').textContent = 'Это демо: код не отправляется.'
    })
  }

  // отзыв (демо): добавляется в начало списка только в этом браузере
  var rform = $('#review-form')
  if (rform) {
    rform.addEventListener('submit', function (e) {
      e.preventDefault()
      var data = new FormData(rform)
      var name = String(data.get('name')).trim()
      var item = document.createElement('article')
      item.className = 'review'
      item.innerHTML = '<div class="review__head"><span class="avatar"></span><div class="review__who"><b></b><time>только что</time></div><span class="stars"></span></div><p></p><div class="review__meta">Ваш отзыв · виден только вам</div>'
      $('.avatar', item).textContent = name.charAt(0).toUpperCase()
      $('.review__who b', item).textContent = name
      $('.stars', item).style.setProperty('--v', data.get('rate'))
      $('p', item).textContent = String(data.get('text')).trim()
      $('#rlist').prepend(item)
      $('#rev-count').textContent = $$('#rlist .review').length
      rform.reset()
      item.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

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
    $('#free-box').classList.toggle('is-free', free)
    mini.sum = sub; mini.count = lines.length; paintMini()
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
  paintMini()
})()
