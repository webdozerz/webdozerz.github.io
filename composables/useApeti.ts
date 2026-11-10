import { AP_MIN, apProduct, apServices, apWeight, apZone } from '~/utils/apeti'
import type { ApProduct } from '~/utils/apetiData'

const KEY = 'ap-concept'

export interface ApLine {
  key: string
  p: ApProduct
  svc: boolean
  n: number
  sum: number
}

// Ключ строки: товар | услуга (в фарш / почистить). Количество — в порциях товара. Всё хранится только в браузере — это демо.
const lineKey = (id: string, svc: boolean) => `${id}|${svc ? 1 : 0}`

export const useApShop = () => {
  const cart = useState<Record<string, number>>('ap-cart', () => ({}))
  const fav = useState<string[]>('ap-fav', () => [])
  const zone = useState<number>('ap-zone', () => -1)
  const user = useState<string>('ap-user', () => '')
  const cookie = useState<boolean>('ap-cookie', () => true)
  const loaded = useState('ap-loaded', () => false)
  const toast = useState<{ text: string; id: number } | null>('ap-toast', () => null)

  const save = () => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(KEY, JSON.stringify({ cart: cart.value, fav: fav.value, zone: zone.value, user: user.value, cookie: cookie.value }))
    } catch {
      /* приватный режим — живём без памяти */
    }
  }
  // Однократная загрузка: страница может позвать раньше оболочки
  const persist = () => {
    if (!import.meta.client || loaded.value) return
    loaded.value = true
    cookie.value = false
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || '{}')
      if (s.cart) cart.value = { ...s.cart, ...cart.value }
      if (Array.isArray(s.fav)) fav.value = s.fav
      if (typeof s.zone === 'number') zone.value = s.zone
      if (typeof s.user === 'string') user.value = s.user
      if (s.cookie) cookie.value = true
    } catch {
      /* битые данные — с чистого листа */
    }
  }

  const lines = computed<ApLine[]>(() =>
    Object.entries(cart.value).flatMap(([key, n]) => {
      const [id, ss] = key.split('|')
      const p = apProduct(id)
      if (!p || !n) return []
      return [{ key, p, svc: ss === '1' && !!p.v, n, sum: Math.round(p.p * n * 100) / 100 }]
    }),
  )
  const count = computed(() => lines.value.length)
  const total = computed(() => Math.round(lines.value.reduce((s, l) => s + l.sum, 0) * 100) / 100)
  const weighted = computed(() => lines.value.some((l) => l.p.k))

  const qtyOf = (id: string, svc = false) => cart.value[lineKey(id, svc)] ?? 0
  const anyKey = (id: string) => Object.keys(cart.value).find((k) => k.startsWith(`${id}|`))
  const setKey = (key: string, n: number) => {
    const next = { ...cart.value }
    if (n > 0) next[key] = Math.round(n)
    else delete next[key]
    cart.value = next
    save()
  }
  const say = (text: string) => {
    toast.value = { text, id: Date.now() }
  }
  const add = (p: ApProduct, n = 1, svc = false) => {
    const k = lineKey(p.id, svc && !!p.v)
    setKey(k, (cart.value[k] ?? 0) + n)
    say(`${p.n}, ${apWeight(p, n)}${svc && p.v ? ` · ${apServices[p.v].inCart}` : ''}`)
  }
  const clear = () => {
    cart.value = {}
    save()
  }
  const toggleFav = (id: string) => {
    fav.value = fav.value.includes(id) ? fav.value.filter((x) => x !== id) : [...fav.value, id]
    save()
  }
  const setZone = (i: number) => {
    zone.value = i
    save()
  }
  const login = (name: string) => {
    user.value = name
    save()
  }
  const okCookie = () => {
    cookie.value = true
    save()
  }

  // Минимум и цена доставки — по строке района из таблицы зон; район не выбран — общий минимум 2 000 ₽
  const z = computed(() => apZone(zone.value))
  const min = computed(() => z.value?.min ?? AP_MIN)
  const fee = computed(() => z.value?.fee ?? null)
  const lack = computed(() => Math.max(0, min.value - total.value))

  return { cart, fav, zone, user, cookie, toast, lines, count, total, weighted, z, min, fee, lack, persist, qtyOf, anyKey, setKey, add, clear, toggleFav, setZone, login, okCookie, say }
}

export type ApModal = null | 'login' | 'quick' | 'callback' | 'fav' | 'zone'
export const useApUi = () => {
  const modal = useState<ApModal>('ap-modal', () => null)
  const subject = useState<string>('ap-subject', () => '')
  const menu = useState('ap-menu', () => false)
  const catalog = useState('ap-catalog', () => false)
  const open = (m: ApModal, about = '') => {
    subject.value = about
    menu.value = false
    catalog.value = false
    modal.value = m
  }
  return { modal, subject, menu, catalog, open }
}
