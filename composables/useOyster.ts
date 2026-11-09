import { OY_COURIER_FROM, OY_PICKUP_OFF, oyDelivery, oyPrice, oyProduct, oyServices, oyUnit, oyVariant } from '~/utils/oyster'
import type { OyProduct } from '~/utils/oyster'

const KEY = 'oy-concept'

export interface OyLine {
  key: string
  p: OyProduct
  v: number
  svc: boolean
  qty: number
  unit: string
  price: number
  svcPrice: number
  sum: number
  variant: string
}
export interface OyCustomer {
  name: string
  phone: string
  email: string
  address: string
  comment: string
}
const emptyCustomer = (): OyCustomer => ({ name: '', phone: '', email: '', address: '', comment: '' })

// Ключ строки: товар | размер | открыть/разделать. Хранится только в браузере — это демо.
const lineKey = (id: string, v: number, svc: boolean) => `${id}|${v}|${svc ? 1 : 0}`

export const useOyShop = () => {
  const cart = useState<Record<string, number>>('oy-cart', () => ({}))
  const fav = useState<string[]>('oy-fav', () => [])
  const cmp = useState<string[]>('oy-cmp', () => [])
  const last = useState<OyCustomer | null>('oy-last', () => null)
  const loaded = useState('oy-loaded', () => false)
  const toast = useState<{ text: string; id: number } | null>('oy-toast', () => null)

  const save = () => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(KEY, JSON.stringify({ cart: cart.value, fav: fav.value, cmp: cmp.value, last: last.value }))
    } catch {
      /* приватный режим — живём без памяти */
    }
  }
  // Однократная загрузка: страница может позвать раньше оболочки (onMounted дочерней срабатывает первым)
  const persist = () => {
    if (!import.meta.client || loaded.value) return
    loaded.value = true
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || '{}')
      if (s.cart) cart.value = { ...s.cart, ...cart.value }
      if (Array.isArray(s.fav)) fav.value = s.fav
      if (Array.isArray(s.cmp)) cmp.value = s.cmp
      if (s.last) last.value = s.last
    } catch {
      /* битые данные — с чистого листа */
    }
  }

  const lines = computed<OyLine[]>(() =>
    Object.entries(cart.value).flatMap(([key, qty]) => {
      const [id, vs, ss] = key.split('|')
      const p = oyProduct(id)
      if (!p || !qty) return []
      const v = Number(vs)
      const svc = ss === '1' && !!p.service
      const price = oyPrice(p, v) ?? 0
      const unit = oyUnit(p, v)
      const svcPrice = svc && p.service ? oyServices[p.service].price : 0
      return [{ key, p, v, svc, qty, unit, price, svcPrice, sum: (price + svcPrice) * qty, variant: oyVariant(p, v)?.name ?? '' }]
    }),
  )
  const count = computed(() => lines.value.length)
  const total = computed(() => lines.value.reduce((s, l) => s + l.sum, 0))
  const liveTotal = computed(() => lines.value.filter((l) => l.p.live).reduce((s, l) => s + l.price * l.qty, 0))

  const qtyOf = (id: string, v = 0, svc = false) => cart.value[lineKey(id, v, svc)] ?? 0
  const inCart = (id: string) => Object.keys(cart.value).some((k) => k.startsWith(`${id}|`))
  const set = (id: string, v: number, svc: boolean, qty: number) => {
    const k = lineKey(id, v, svc)
    const next = { ...cart.value }
    if (qty > 0) next[k] = Math.round(qty * 10) / 10
    else delete next[k]
    cart.value = next
    save()
  }
  const say = (text: string) => {
    toast.value = { text, id: Date.now() }
  }
  const add = (p: OyProduct, v: number, svc: boolean, qty: number) => {
    set(p.id, v, svc, qtyOf(p.id, v, svc) + qty)
    const vn = oyVariant(p, v)?.name
    say(`${p.name}${vn ? `, ${vn}` : ''}${svc && p.service ? ` · ${oyServices[p.service].short.toLowerCase()}` : ''}`)
  }
  const remove = (key: string) => {
    const next = { ...cart.value }
    delete next[key]
    cart.value = next
    save()
  }
  const setKey = (key: string, qty: number) => {
    const next = { ...cart.value }
    if (qty > 0) next[key] = Math.round(qty * 10) / 10
    else delete next[key]
    cart.value = next
    save()
  }
  const clear = () => {
    cart.value = {}
    save()
  }
  const toggle = (list: 'fav' | 'cmp', id: string) => {
    const ref = list === 'fav' ? fav : cmp
    ref.value = ref.value.includes(id) ? ref.value.filter((x) => x !== id) : [...ref.value, id]
    save()
  }
  const remember = (c: OyCustomer) => {
    last.value = { ...c }
    save()
  }

  // Доставка: машиной — от 3 000 ₽ (800 до подъезда / 1 200 до квартиры), меньше — Яндекс или самовывоз; самовывоз −5% на живые
  const canCourier = computed(() => total.value >= OY_COURIER_FROM)
  const pickupOff = computed(() => Math.round((liveTotal.value * OY_PICKUP_OFF) / 100))
  const deliveryPrice = (id: string) => oyDelivery.find((d) => d.id === id)?.price ?? null

  return {
    cart,
    fav,
    cmp,
    last,
    toast,
    lines,
    count,
    total,
    liveTotal,
    canCourier,
    pickupOff,
    persist,
    qtyOf,
    inCart,
    set,
    setKey,
    add,
    remove,
    clear,
    toggle,
    remember,
    say,
    deliveryPrice,
    emptyCustomer,
  }
}

export type OyModal = null | 'callback' | 'question' | 'login' | 'quick'
export const useOyUi = () => {
  const modal = useState<OyModal>('oy-modal', () => null)
  const subject = useState<string>('oy-subject', () => '')
  const menu = useState('oy-menu', () => false)
  const catalog = useState('oy-catalog', () => false)
  const open = (m: OyModal, about = '') => {
    subject.value = about
    menu.value = false
    catalog.value = false
    modal.value = m
  }
  return { modal, subject, menu, catalog, open }
}
