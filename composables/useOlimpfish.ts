import { olPrice, olProduct, olUnit, olWays } from '~/utils/olimpfish'
import type { OlProduct } from '~/utils/olimpfishData'

const KEY = 'ol-concept'

export interface OlLine {
  key: string
  p: OlProduct
  g: number
  n: number
  price: number
  sum: number
}

// Ключ строки: товар | вес фасовки в граммах (0 — штучный). Всё хранится только в браузере — это демо.
const lineKey = (id: string, g: number) => `${id}|${g}`

export const useOlShop = () => {
  const cart = useState<Record<string, number>>('ol-cart', () => ({}))
  const fav = useState<string[]>('ol-fav', () => [])
  const user = useState<string>('ol-user', () => '')
  const way = useState<string>('ol-way', () => 'mkad')
  const km = useState<number>('ol-km', () => 15)
  const coupon = useState<string>('ol-coupon', () => '')
  const loaded = useState('ol-loaded', () => false)
  const toast = useState<{ text: string; id: number } | null>('ol-toast', () => null)

  const save = () => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(KEY, JSON.stringify({ cart: cart.value, fav: fav.value, user: user.value, way: way.value, km: km.value }))
    } catch {
      /* приватный режим — живём без памяти */
    }
  }
  // Однократная загрузка: страница может позвать раньше оболочки
  const persist = () => {
    if (!import.meta.client || loaded.value) return
    loaded.value = true
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || '{}')
      if (s.cart) cart.value = { ...s.cart, ...cart.value }
      if (Array.isArray(s.fav)) fav.value = s.fav
      if (typeof s.user === 'string') user.value = s.user
      if (typeof s.way === 'string' && olWays.some((w) => w.id === s.way)) way.value = s.way
      if (typeof s.km === 'number') km.value = s.km
    } catch {
      /* битые данные — с чистого листа */
    }
  }

  const lines = computed<OlLine[]>(() =>
    Object.entries(cart.value).flatMap(([key, n]) => {
      const [id, gs] = key.split('|')
      const p = olProduct(id)
      if (!p || !n) return []
      const g = Number(gs) || 0
      const price = olPrice(p, g)
      return [{ key, p, g, n, price, sum: price * n }]
    }),
  )
  const count = computed(() => lines.value.reduce((s, l) => s + l.n, 0))
  const total = computed(() => lines.value.reduce((s, l) => s + l.sum, 0))
  const weighted = computed(() => lines.value.some((l) => l.p.w))

  const qtyOf = (id: string, g = 0) => cart.value[lineKey(id, g)] ?? 0
  const setKey = (key: string, n: number) => {
    const next = { ...cart.value }
    if (n > 0) next[key] = Math.min(99, Math.round(n))
    else delete next[key]
    cart.value = next
    save()
  }
  const say = (text: string) => {
    toast.value = { text, id: Date.now() }
  }
  const add = (p: OlProduct, g = 0, n = 1) => {
    const k = lineKey(p.id, p.w ? g || p.w.g[0] : 0)
    setKey(k, (cart.value[k] ?? 0) + n)
    say(`${p.n}${p.w || p.u ? `, ${olUnit(p, g)}` : ''}${n > 1 ? ` × ${n}` : ''}`)
  }
  const clear = () => {
    cart.value = {}
    save()
  }
  const toggleFav = (id: string) => {
    const on = !fav.value.includes(id)
    fav.value = on ? [...fav.value, id] : fav.value.filter((x) => x !== id)
    save()
    say(on ? 'Добавлено в избранное' : 'Убрано из избранного')
  }
  const setWay = (id: string) => {
    way.value = id
    save()
  }
  const setKm = (v: number) => {
    km.value = v
    save()
  }
  const login = (name: string) => {
    user.value = name
    save()
  }
  const logout = () => {
    user.value = ''
    save()
  }

  const w = computed(() => olWays.find((x) => x.id === way.value) ?? olWays[1])
  const min = computed(() => w.value.min)
  const lack = computed(() => Math.max(0, min.value - total.value))
  const kmUse = computed(() => (w.value.km ? Math.min(w.value.km[1], Math.max(w.value.km[0], km.value)) : 0))
  const fee = computed(() => w.value.fee(total.value, kmUse.value) ?? 0)

  return {
    cart, fav, user, way, km, coupon, toast, lines, count, total, weighted, w, min, lack, kmUse, fee,
    persist, qtyOf, setKey, add, clear, toggleFav, setWay, setKm, login, logout, say,
  }
}

export type OlModal = null | 'login' | 'quick' | 'callback' | 'chat'
export const useOlUi = () => {
  const modal = useState<OlModal>('ol-modal', () => null)
  // для «Быстрой покупки»: id товара и вес
  const subject = useState<{ id: string; g: number }>('ol-subject', () => ({ id: '', g: 0 }))
  const menu = useState('ol-menu', () => false)
  const search = useState('ol-search', () => false)
  const open = (m: OlModal, id = '', g = 0) => {
    subject.value = { id, g }
    menu.value = false
    search.value = false
    modal.value = m
  }
  return { modal, subject, menu, search, open }
}
