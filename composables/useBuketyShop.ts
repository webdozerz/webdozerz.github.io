const STORAGE_KEY = 'bk-concept-shop'

export interface BkForm {
  name: string
  phone: string
  email: string
  telegram: string
  toName: string
  toPhone: string
  anonymous: boolean
  noAddress: boolean
  zone: BkZoneId
  address: string
  day: 'today' | 'tomorrow' | 'date'
  date: string
  slot: string
  askRecipient: boolean
  photo: boolean
  replace: boolean
  card: string
  coupon: string
  payment: BkPayId
  comment: string
  agree: boolean
}

export interface BkLine {
  key: string
  product: BkProduct
  pick: string
  qty: number
  unitPrice: number
  sum: number
}

export interface BkOrder {
  id: number
  date: string
  total: number
  when: string
  lines: { title: string; pick: string; qty: number }[]
}

export interface BkUserReview {
  product: string
  author: string
  rating: number
  text: string
  date: string
}

const emptyForm = (): BkForm => ({
  name: '',
  phone: '',
  email: '',
  telegram: '',
  toName: '',
  toPhone: '',
  anonymous: false,
  noAddress: false,
  zone: 'tomsk',
  address: '',
  day: 'today',
  date: '',
  slot: 'asap',
  askRecipient: false,
  photo: true,
  replace: true,
  card: '',
  coupon: '',
  payment: 'cash',
  comment: '',
  agree: false,
})

// Магазин концепта «Любимые Букеты»: корзина «товар|вариант» -> количество, избранное, вход,
// отзывы, заказы и черновик оформления. Хранится только в браузере, никуда не отправляется.
export const useBuketyShop = () => {
  const items = useState<Record<string, number>>('bk-items', () => ({}))
  const favs = useState<string[]>('bk-favs', () => [])
  const user = useState<{ name: string; email: string } | null>('bk-user', () => null)
  const reviews = useState<BkUserReview[]>('bk-reviews', () => [])
  const orders = useState<BkOrder[]>('bk-orders', () => [])
  const form = useState<BkForm>('bk-form', emptyForm)

  const keyOf = (pid: string, pick = '') => (pick ? `${pid}|${pick}` : pid)
  const lines = computed<BkLine[]>(() =>
    Object.entries(items.value).flatMap(([key, qty]) => {
      const [pid, pick = ''] = key.split('|')
      const product = bkFind(pid)
      if (!product) return []
      const unitPrice = bkPrice(product, pick)
      return [{ key, product, pick, qty, unitPrice, sum: unitPrice * qty }]
    }),
  )

  const count = computed(() => lines.value.reduce((n, l) => n + l.qty, 0))
  const total = computed(() => lines.value.reduce((n, l) => n + l.sum, 0))
  const zone = computed(() => bkZones.find((z) => z.id === form.value.zone) ?? bkZones[0])
  const delivery = computed(() => zone.value.price)

  const qtyOf = (key: string) => items.value[key] ?? 0
  const setQty = (key: string, qty: number) => {
    const next = { ...items.value }
    if (qty <= 0) delete next[key]
    else next[key] = Math.min(qty, 99)
    items.value = next
  }
  const add = (pid: string, pick = '', qty = 1) => {
    const key = keyOf(pid, pick)
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

  const placeOrder = (when: string) => {
    const order: BkOrder = {
      id: 24000 + orders.value.length + 1,
      date: new Date().toISOString(),
      total: total.value + (delivery.value ?? 0),
      when,
      lines: lines.value.map((l) => ({ title: l.product.title, pick: l.pick, qty: l.qty })),
    }
    orders.value = [order, ...orders.value]
    clear()
    form.value = { ...form.value, card: '', comment: '', coupon: '', agree: false }
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
      if (saved?.form) form.value = { ...form.value, ...saved.form }
    } catch {
      /* localStorage может быть недоступен */
    }
    watch(
      [items, favs, user, reviews, orders, form],
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
    form,
    lines,
    count,
    total,
    zone,
    delivery,
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

// Меню, каталог, вход и подсказки — общие для всех страниц концепта.
export const useBuketyUi = () => {
  const menuOpen = useState('bk-menu', () => false)
  const catalogOpen = useState('bk-catalog', () => false)
  const loginOpen = useState('bk-login', () => false)
  const toast = useState<string | null>('bk-toast', () => null)

  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (toast.value = null), 3600)
  }
  const closeAll = () => {
    menuOpen.value = false
    catalogOpen.value = false
    loginOpen.value = false
  }

  return { menuOpen, catalogOpen, loginOpen, toast, say, closeAll }
}

// Часы Томска, обновляются раз в 20 секунд. До монтирования — null, чтобы не было
// расхождения серверного и клиентского рендера.
export const useBuketyClock = () => {
  const now = useState<Date | null>('bk-now', () => null)
  onMounted(() => {
    now.value = bkTomskNow()
    const t = setInterval(() => (now.value = bkTomskNow()), 20000)
    onBeforeUnmount(() => clearInterval(t))
  })
  // «Привезём к 15:20» — заказ плюс час, с округлением вверх до 10 минут.
  const eta = computed(() => {
    if (!now.value) return null
    const d = new Date(now.value.getTime() + 60 * 60000)
    d.setMinutes(Math.ceil(d.getMinutes() / 10) * 10, 0, 0)
    return bkHM(d)
  })
  return { now, eta }
}
