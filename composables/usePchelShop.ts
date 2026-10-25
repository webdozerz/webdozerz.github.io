const STORAGE_KEY = 'pc-concept-shop'

export interface PcForm {
  name: string
  phone: string
  email: string
  zone: PcZoneId
  address: string
  payment: 'cash' | 'card' | 'invoice' | 'prepay'
  comment: string
}

export interface PcLine {
  key: string
  product: PcProduct
  picks: Record<string, string>
  qty: number
  unitPrice: number
  sum: number
  label: string
}

export interface PcOrder {
  id: number
  date: string
  total: number
  lines: { title: string; label: string; qty: number }[]
}

export interface PcUserReview {
  product: string
  author: string
  rating: number
  text: string
  date: string
}

const emptyForm = (): PcForm => ({
  name: '',
  phone: '',
  email: '',
  zone: 'city',
  address: '',
  payment: 'cash',
  comment: '',
})

// Магазин концепта «38пчёл»: корзина «товар|опция=значение» -> количество, закладки, вход,
// отзывы и заказы. Хранится только в браузере, никуда не отправляется.
export const usePchelShop = () => {
  const items = useState<Record<string, number>>('pc-items', () => ({}))
  const favs = useState<string[]>('pc-favs', () => [])
  const user = useState<{ name: string; email: string } | null>('pc-user', () => null)
  const reviews = useState<PcUserReview[]>('pc-reviews', () => [])
  const orders = useState<PcOrder[]>('pc-orders', () => [])
  const subscribed = useState<string | null>('pc-sub', () => null)
  const form = useState<PcForm>('pc-form', emptyForm)

  const keyOf = (pid: string, picks: Record<string, string>) =>
    [pid, ...Object.entries(picks).map(([g, v]) => `${g}=${v}`)].join('|')
  const parse = (key: string) => {
    const [pid, ...rest] = key.split('|')
    return { pid, picks: Object.fromEntries(rest.map((s) => s.split('='))) as Record<string, string> }
  }

  const lines = computed<PcLine[]>(() =>
    Object.entries(items.value).flatMap(([key, qty]) => {
      const { pid, picks } = parse(key)
      const product = pcFindProduct(pid)
      if (!product) return []
      const unitPrice = pcPrice(product, picks)
      return [{ key, product, picks, qty, unitPrice, sum: unitPrice * qty, label: pcPickLabel(product, picks) }]
    }),
  )

  const count = computed(() => lines.value.reduce((n, l) => n + l.qty, 0))
  const total = computed(() => lines.value.reduce((n, l) => n + l.sum, 0))

  const zone = computed(() => pcZones.find((z) => z.id === form.value.zone) ?? pcZones[0])
  const delivery = computed(() => {
    const z = zone.value
    if (z.price === null) return null
    if (z.freeFrom && total.value >= z.freeFrom) return 0
    return z.price
  })
  // До бесплатной доставки и до минимальной суммы — подсказки в корзине.
  const toFree = computed(() => (zone.value.freeFrom ? Math.max(0, zone.value.freeFrom - total.value) : 0))
  const belowMin = computed(() => zone.value.min > 0 && total.value < zone.value.min)

  const qtyOf = (key: string) => items.value[key] ?? 0
  const setQty = (key: string, qty: number) => {
    const next = { ...items.value }
    if (qty <= 0) delete next[key]
    else next[key] = Math.min(qty, 50)
    items.value = next
  }
  const add = (pid: string, picks: Record<string, string>, qty = 1) => {
    const key = keyOf(pid, picks)
    setQty(key, qtyOf(key) + qty)
    return key
  }
  const clear = () => {
    items.value = {}
  }

  const isFav = (pid: string) => favs.value.includes(pid)
  const toggleFav = (pid: string) => {
    favs.value = isFav(pid) ? favs.value.filter((id) => id !== pid) : [...favs.value, pid]
  }

  const placeOrder = () => {
    const order: PcOrder = {
      id: 1000 + orders.value.length + 1,
      date: new Date().toISOString(),
      total: total.value + (delivery.value ?? 0),
      lines: lines.value.map((l) => ({ title: l.product.title, label: l.label, qty: l.qty })),
    }
    orders.value = [order, ...orders.value]
    clear()
    return order
  }

  // Вызывается один раз в оболочке: подтягивает сохранённое и следит за изменениями.
  const persist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved?.items) items.value = saved.items
      if (Array.isArray(saved?.favs)) favs.value = saved.favs
      if (saved?.user) user.value = saved.user
      if (Array.isArray(saved?.reviews)) reviews.value = saved.reviews
      if (Array.isArray(saved?.orders)) orders.value = saved.orders
      if (saved?.subscribed) subscribed.value = saved.subscribed
      if (saved?.form) form.value = { ...form.value, ...saved.form }
    } catch {
      /* localStorage может быть недоступен */
    }
    watch(
      [items, favs, user, reviews, orders, subscribed, form],
      () => {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              items: items.value,
              favs: favs.value,
              user: user.value,
              reviews: reviews.value,
              orders: orders.value,
              subscribed: subscribed.value,
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
    favs,
    user,
    reviews,
    orders,
    subscribed,
    form,
    lines,
    count,
    total,
    zone,
    delivery,
    toFree,
    belowMin,
    keyOf,
    qtyOf,
    setQty,
    add,
    clear,
    isFav,
    toggleFav,
    placeOrder,
    persist,
  }
}

// Меню, вход, поиск, мини-корзина и подсказки — общие для всех страниц концепта.
export const usePchelUi = () => {
  const menuOpen = useState('pc-menu', () => false)
  const loginOpen = useState('pc-login', () => false)
  const searchOpen = useState('pc-search', () => false)
  const miniCart = useState('pc-minicart', () => false)
  const toast = useState<string | null>('pc-toast', () => null)

  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (toast.value = null), 3600)
  }
  const closeAll = () => {
    menuOpen.value = false
    loginOpen.value = false
    searchOpen.value = false
    miniCart.value = false
  }

  return { menuOpen, loginOpen, searchOpen, miniCart, toast, say, closeAll }
}
