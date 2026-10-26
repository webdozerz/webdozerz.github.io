const STORAGE_KEY = 'mr-concept-shop'

export interface MrForm {
  name: string
  phone: string
  email: string
  selfRecipient: boolean
  toName: string
  toPhone: string
  askAddress: boolean
  zone: MrZoneId
  address: string
  day: 'today' | 'tomorrow' | 'date'
  date: string
  slot: string
  card: string
  coupon: string
  payment: MrPayId
  comment: string
  agree: boolean
}

export interface MrLine {
  key: string
  title: string
  pick: string
  img: string
  to: string
  qty: number
  unitPrice: number
  sum: number
  // Охапка поштучно: в строке не количество охапок, а число роз — его меняют в конструкторе.
  stems?: number
}

export interface MrOrder {
  id: number
  date: string
  total: number
  when: string
  lines: { title: string; pick: string; qty: number }[]
}

export interface MrUserReview {
  author: string
  rating: number
  title: string
  text: string
  date: string
}

const emptyForm = (): MrForm => ({
  name: '',
  phone: '',
  email: '',
  selfRecipient: false,
  toName: '',
  toPhone: '',
  askAddress: false,
  zone: 'tomsk',
  address: '',
  day: 'today',
  date: '',
  slot: 'asap',
  card: '',
  coupon: '',
  payment: 'online',
  comment: '',
  agree: false,
})

// Ключ охапки: «stems|25|red|1» — число роз, цвет, длина (0 — 40–50 см, 1 — 50–60 см).
export const mrStemsKey = (count: number, color: string, len: number) => `stems|${count}|${color}|${len}`

// Магазин концепта «Мне розы»: корзина «ключ -> количество», избранное, вход, отзывы, заказы и
// черновик оформления. Хранится только в браузере, никуда не отправляется.
export const useMnerozyShop = () => {
  const items = useState<Record<string, number>>('mr-items', () => ({}))
  const favs = useState<string[]>('mr-favs', () => [])
  const user = useState<{ name: string; email: string } | null>('mr-user', () => null)
  const reviews = useState<MrUserReview[]>('mr-reviews', () => [])
  const orders = useState<MrOrder[]>('mr-orders', () => [])
  const form = useState<MrForm>('mr-form', emptyForm)

  const keyOf = (pid: string, pick = '') => `${pid}|${pick}`

  const lineOf = (key: string, qty: number): MrLine | null => {
    const parts = key.split('|')
    if (parts[0] === 'stems') {
      const count = Number(parts[1])
      const color = mrStems.colors.find((c) => c.id === parts[2]) ?? mrStems.colors[0]
      const long = parts[3] === '1'
      const unitPrice = count * mrStemPrice(count, long)
      return {
        key,
        title: `Охапка из ${mrOfRoses(count)} Эквадор`,
        pick: `${color.label.toLowerCase()} · ${mrStems.lengths[long ? 1 : 0]} · ${mrStemPrice(count, long)} ₽ за розу`,
        img: color.img,
        to: mrPath('/roses'),
        qty,
        unitPrice,
        sum: unitPrice * qty,
        stems: count,
      }
    }
    const product = mrFind(parts[0])
    if (!product) return null
    const pick = parts[1] ?? ''
    const unitPrice = mrPrice(product, pick)
    return {
      key,
      title: product.title,
      pick: product.opts ? mrPickLabel(product, pick) : '',
      img: product.img,
      to: mrPath(`/product/${product.id}`),
      qty,
      unitPrice,
      sum: unitPrice * qty,
    }
  }

  const lines = computed<MrLine[]>(() =>
    Object.entries(items.value).flatMap(([key, qty]) => {
      const line = lineOf(key, qty)
      return line ? [line] : []
    }),
  )

  const count = computed(() => lines.value.reduce((n, l) => n + l.qty, 0))
  const total = computed(() => lines.value.reduce((n, l) => n + l.sum, 0))
  const zone = computed(() => mrZones.find((z) => z.id === form.value.zone) ?? mrZones[0])
  const delivery = computed(() => zone.value.price)

  const qtyOf = (key: string) => items.value[key] ?? 0
  const setQty = (key: string, qty: number) => {
    const next = { ...items.value }
    if (qty <= 0) delete next[key]
    else next[key] = Math.min(qty, 99)
    items.value = next
  }
  const add = (key: string, qty = 1) => {
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
    const order: MrOrder = {
      id: 51000 + orders.value.length + 1,
      date: new Date().toISOString(),
      total: total.value + delivery.value,
      when,
      lines: lines.value.map((l) => ({ title: l.title, pick: l.pick, qty: l.qty })),
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

// Меню, каталог, вход, чат и подсказки — общие для всех страниц концепта.
export const useMnerozyUi = () => {
  const menuOpen = useState('mr-menu', () => false)
  const catalogOpen = useState('mr-catalog', () => false)
  const loginOpen = useState('mr-login', () => false)
  const chatOpen = useState('mr-chat', () => false)
  const toast = useState<string | null>('mr-toast', () => null)

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
    chatOpen.value = false
  }

  return { menuOpen, catalogOpen, loginOpen, chatOpen, toast, say, closeAll }
}

// Часы Томска, обновляются раз в 20 секунд. До монтирования — null, чтобы серверный и
// клиентский рендер совпадали.
export const useMnerozyClock = () => {
  const now = useState<Date | null>('mr-now', () => null)
  onMounted(() => {
    now.value = mrTomskNow()
    const t = setInterval(() => (now.value = mrTomskNow()), 20000)
    onBeforeUnmount(() => clearInterval(t))
  })
  // «Привезём к 16:00» — заказ плюс час, с округлением вверх до 10 минут.
  const eta = computed(() => {
    if (!now.value) return null
    const d = new Date(now.value.getTime() + 60 * 60000)
    d.setMinutes(Math.ceil(d.getMinutes() / 10) * 10, 0, 0)
    return mrHM(d)
  })
  return { now, eta }
}
