const STORAGE_KEY = 'dr-concept'

export interface DrLine {
  key: string
  p: DrProduct
  v: number
  qty: number
  price: number
  sum: number
}
export interface DrUser {
  name: string
  email: string
  phone: string
  // сумма выполненных заказов для накопительной скидки (демо)
  spent: number
  birthday: string
}
export interface DrForm {
  phone: string
  name: string
  surname: string
  email: string
  district: string
  street: string
  house: string
  flat: string
  comment: string
  news: boolean
  regular: boolean
  bot: boolean
  agree: boolean
}
export interface DrOrder {
  n: number
  date: string
  day: string
  total: number
  count: number
  pickup: boolean
}
export interface DrMyReview {
  name: string
  text: string
  date: string
}

// Корзина, избранное, кабинет и отзывы концепта «Дереда». Всё живёт только в браузере и никуда не отправляется.
export const useDeredaShop = () => {
  const items = useState<Record<string, number>>('dr-items', () => ({}))
  const fav = useState<string[]>('dr-fav', () => [])
  const user = useState<DrUser | null>('dr-user', () => null)
  const orders = useState<DrOrder[]>('dr-orders', () => [])
  const reviews = useState<Record<string, DrMyReview[]>>('dr-reviews', () => ({}))
  const pickup = useState<boolean>('dr-pickup', () => false)
  const day = useState<string>('dr-day', () => '')
  const pay = useState<'cash' | 'transfer'>('dr-pay', () => 'cash')
  const coupon = useState<string>('dr-coupon', () => '')
  const form = useState<DrForm>('dr-form', () => ({
    phone: '',
    name: '',
    surname: '',
    email: '',
    district: '',
    street: '',
    house: '',
    flat: '',
    comment: '',
    news: true,
    regular: false,
    bot: false,
    agree: false,
  }))

  const keyOf = (p: DrProduct, v = 0) => `${p.id}|${p.variants.length ? v : 0}`
  const lines = computed<DrLine[]>(() =>
    Object.entries(items.value).flatMap(([key, qty]) => {
      const [id, vs] = key.split('|')
      const p = drProduct(id)
      if (!p) return []
      const v = Number(vs) || 0
      const price = drPriceOf(p, v)
      return [{ key, p, v, qty, price, sum: price * qty }]
    }),
  )
  const count = computed(() => lines.value.reduce((a, l) => a + l.qty, 0))
  const goods = computed(() => lines.value.reduce((a, l) => a + l.sum, 0))
  const weighed = computed(() => lines.value.some((l) => drWeighed(l.p) || l.p.byKg))
  const zone = computed(() => (pickup.value ? null : drZoneOf(form.value.district)))
  const short = computed(() => Math.max(0, DR_MIN - goods.value))

  // Скидки не суммируются: берём большую — накопительную или 5 % на день рождения (заказ от 2 500 ₽, кроме товаров по акции)
  const level = computed(() => (user.value ? drLevelOf(user.value.spent) : null))
  const bdayOk = computed(() => coupon.value.trim().toLowerCase().replace(/\s+/g, ' ') === 'день рождения')
  const bdayBase = computed(() => lines.value.filter((l) => !l.p.sale).reduce((a, l) => a + l.sum, 0))
  const bdayOff = computed(() => (bdayOk.value && user.value && goods.value >= 2500 ? Math.round(bdayBase.value * 0.05) : 0))
  const levelOff = computed(() => (level.value ? Math.round(goods.value * (level.value.pct / 100)) : 0))
  const discount = computed(() => Math.max(bdayOff.value, levelOff.value))
  const discountLabel = computed(() =>
    !discount.value ? '' : bdayOff.value >= levelOff.value ? 'Скидка на день рождения 5 %' : `Накопительная скидка ${level.value?.pct} %`,
  )
  const fee = computed(() => (!zone.value || goods.value >= zone.value.free ? 0 : zone.value.fee))
  const total = computed(() => goods.value - discount.value + fee.value)

  const qtyOf = (p: DrProduct, v = 0) => items.value[keyOf(p, v)] ?? 0
  const setKey = (key: string, qty: number) => {
    const next = { ...items.value }
    const n = Math.floor(Number(qty) || 0)
    if (n < 1) delete next[key]
    else next[key] = Math.min(n, 99)
    items.value = next
  }
  const setQty = (p: DrProduct, v: number, qty: number) => setKey(keyOf(p, v), qty)
  const add = (p: DrProduct, v = 0) => setQty(p, v, qtyOf(p, v) + 1)
  const inc = (p: DrProduct, v = 0) => setQty(p, v, qtyOf(p, v) + 1)
  const dec = (p: DrProduct, v = 0) => setQty(p, v, qtyOf(p, v) - 1)
  const clear = () => {
    items.value = {}
  }

  const isFav = (id: string) => fav.value.includes(id)
  const toggleFav = (id: string) => {
    fav.value = isFav(id) ? fav.value.filter((x) => x !== id) : [...fav.value, id]
  }
  const addReview = (id: string, r: DrMyReview) => {
    reviews.value = { ...reviews.value, [id]: [r, ...(reviews.value[id] ?? [])] }
  }

  // Вызывается один раз в оболочке
  const persist = () => {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (s?.items) items.value = s.items
      if (s?.fav) fav.value = s.fav
      if (s?.user !== undefined) user.value = s.user
      if (s?.orders) orders.value = s.orders
      if (s?.reviews) reviews.value = s.reviews
      if (s?.pickup !== undefined) pickup.value = s.pickup
      if (s?.pay) pay.value = s.pay
      if (s?.form) form.value = { ...form.value, ...s.form, agree: false }
    } catch {
      /* localStorage может быть недоступен */
    }
    watch(
      [items, fav, user, orders, reviews, pickup, pay, form],
      () => {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              items: items.value,
              fav: fav.value,
              user: user.value,
              orders: orders.value,
              reviews: reviews.value,
              pickup: pickup.value,
              pay: pay.value,
              form: form.value,
            }),
          )
        } catch {
          /* ignore */
        }
      },
      { deep: true },
    )
  }

  return {
    items,
    fav,
    user,
    orders,
    reviews,
    pickup,
    day,
    pay,
    coupon,
    form,
    lines,
    count,
    goods,
    weighed,
    zone,
    short,
    level,
    bdayOk,
    bdayOff,
    levelOff,
    discount,
    discountLabel,
    fee,
    total,
    keyOf,
    qtyOf,
    setKey,
    setQty,
    add,
    inc,
    dec,
    clear,
    isFav,
    toggleFav,
    addReview,
    persist,
  }
}

// Окна и уведомления: каталог-панель, меню, вход, обратный звонок, предзаказ, тост
export const useDrUi = () => ({
  menu: useState('dr-menu', () => false),
  catalog: useState('dr-catalog', () => false),
  login: useState('dr-login', () => false),
  callback: useState('dr-callback', () => false),
  preorder: useState<string>('dr-preorder', () => ''),
  toast: useState<string>('dr-toast', () => ''),
  toastCart: useState<boolean>('dr-toast-cart', () => false),
})

// Живое время: тикает раз в 30 секунд
export const useDrNow = () => useState<number>('dr-now', () => Date.now())
