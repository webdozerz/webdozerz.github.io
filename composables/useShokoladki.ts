// Состояние концепта shokoladki: корзина (товары с лентой/открыткой и собранные наборы), избранное со списками,
// город доставки, окна и тост. Всё в localStorage — заказы никуда не отправляются.
import { skPath, skProduct, skBoxes, skCities, SK_RIBBON, SK_CARD, skCourierPrice, skRub } from '~/utils/shokoladki'
import { skCandies as candies } from '~/utils/shokoladki.data'

const KEY = 'sk-concept-v1'

export interface SkSet {
  box: string
  candies: string[]
}
export interface SkLine {
  key: string
  id: string // id товара или 'set'
  qty: number
  ribbon: string | null // текст на ленте; '' — лента без текста
  card: string | null // id шильдика
  set?: SkSet
  pack?: { design: string; name: string; photo: boolean }
}
export interface SkList {
  id: string
  n: string
  items: string[]
}

const boxOf = (id: string) => skBoxes.find((b) => b.id === id)
export const skSetPrice = (s: SkSet) =>
  (boxOf(s.box)?.p || 0) + s.candies.reduce((a, c) => a + (candies.find((x) => x.id === c)?.p || 0), 0)
export const skLinePrice = (l: SkLine) => {
  const base = l.id === 'set' && l.set ? skSetPrice(l.set) : skProduct(l.id)?.p || 0
  return base + (l.ribbon !== null ? SK_RIBBON : 0) + (l.card ? SK_CARD : 0)
}

export const useSkStore = () => {
  const cart = useState<SkLine[]>('sk-cart', () => [])
  const lists = useState<SkList[]>('sk-lists', () => [{ id: 'main', n: 'Избранное', items: [] }])
  const city = useState('sk-city', () => 'Москва')
  const user = useState<{ name: string; email: string } | null>('sk-user', () => null)
  const bonusCard = useState('sk-bonus', () => '')
  const loaded = useState('sk-loaded', () => false)
  const toast = useState<{ id: number; text: string; link?: string; linkText?: string } | null>('sk-toast', () => null)

  const save = () => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(KEY, JSON.stringify({ cart: cart.value, lists: lists.value, city: city.value, user: user.value, bonusCard: bonusCard.value }))
    } catch {}
  }
  // Загрузка один раз: страница может позвать раньше оболочки
  const persist = () => {
    if (!import.meta.client || loaded.value) return
    loaded.value = true
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || '{}')
      if (Array.isArray(s.cart)) cart.value = s.cart.filter((l: SkLine) => l.id === 'set' || skProduct(l.id))
      if (Array.isArray(s.lists) && s.lists.length) lists.value = s.lists
      if (typeof s.city === 'string' && skCities.some((c) => c.n === s.city)) city.value = s.city
      if (s.user && typeof s.user.name === 'string') user.value = s.user
      if (typeof s.bonusCard === 'string') bonusCard.value = s.bonusCard
    } catch {}
  }
  const say = (text: string, link?: string, linkText?: string) => (toast.value = { id: Date.now(), text, link, linkText })

  const cityInfo = computed(() => skCities.find((c) => c.n === city.value) || skCities[0])
  const setCity = (n: string) => {
    city.value = n
    save()
  }

  // Корзина: одна строка на товар без допов; с лентой/открыткой/именной упаковкой — отдельная строка
  const qtyOf = (id: string) => cart.value.filter((l) => l.id === id && l.ribbon === null && !l.card && !l.pack).reduce((a, l) => a + l.qty, 0)
  const add = (id: string, qty = 1, extra: Partial<Pick<SkLine, 'ribbon' | 'card' | 'pack'>> = {}, quiet = false) => {
    const ribbon = extra.ribbon ?? null
    const card = extra.card ?? null
    const plain = ribbon === null && !card && !extra.pack
    const line = plain ? cart.value.find((l) => l.id === id && l.ribbon === null && !l.card && !l.pack) : undefined
    if (line) line.qty += qty
    else cart.value = [...cart.value, { key: `${id}-${Date.now()}`, id, qty, ribbon, card, pack: extra.pack }]
    save()
    const p = skProduct(id)
    if (!quiet && p) say(`${p.n} — в корзине`, skPath('/korzina/'), 'Оформить')
  }
  const setQty = (id: string, qty: number) => {
    const line = cart.value.find((l) => l.id === id && l.ribbon === null && !l.card && !l.pack)
    if (!line) return add(id, qty)
    if (qty <= 0) cart.value = cart.value.filter((l) => l !== line)
    else line.qty = qty
    save()
  }
  const lineQty = (key: string, qty: number) => {
    const line = cart.value.find((l) => l.key === key)
    if (!line) return
    if (qty <= 0) cart.value = cart.value.filter((l) => l.key !== key)
    else line.qty = Math.min(qty, 99)
    save()
  }
  const remove = (key: string) => {
    cart.value = cart.value.filter((l) => l.key !== key)
    save()
  }
  const clearCart = () => {
    cart.value = []
    save()
  }
  const addSet = (set: SkSet, ribbon: string | null, card: string | null) => {
    cart.value = [...cart.value, { key: `set-${Date.now()}`, id: 'set', qty: 1, ribbon, card, set: { box: set.box, candies: [...set.candies] } }]
    save()
    say(`Набор «${boxOf(set.box)?.n}» — в корзине`, skPath('/korzina/'), 'Оформить')
  }
  const count = computed(() => cart.value.reduce((a, l) => a + l.qty, 0))
  const sum = computed(() => cart.value.reduce((a, l) => a + skLinePrice(l) * l.qty, 0))
  const oldSum = computed(() =>
    cart.value.reduce((a, l) => {
      const p = l.id === 'set' ? null : skProduct(l.id)
      return a + (p && p.o > p.p ? (p.o - p.p) * l.qty : 0)
    }, 0),
  )
  const courier = computed(() => skCourierPrice(cityInfo.value.zone, sum.value))

  // Избранное со списками, как на /personal/wish-list/ оригинала
  const isFav = (id: string) => lists.value.some((l) => l.items.includes(id))
  const toggleFav = (id: string, listId = 'main') => {
    const p = skProduct(id)
    if (isFav(id)) {
      lists.value.forEach((l) => (l.items = l.items.filter((x) => x !== id)))
      say(`${p?.n || 'Товар'} — убран из избранного`)
    } else {
      const l = lists.value.find((x) => x.id === listId) || lists.value[0]
      l.items = [...l.items, id]
      say(`${p?.n || 'Товар'} — в избранном`, skPath('/izbrannoe/'), 'Просмотреть список')
    }
    save()
  }
  const favCount = computed(() => new Set(lists.value.flatMap((l) => l.items)).size)
  const newList = (n: string) => {
    const id = `l${Date.now()}`
    lists.value = [...lists.value, { id, n: n.trim() || `Список ${lists.value.length + 1}`, items: [] }]
    save()
    return id
  }
  const moveTo = (id: string, listId: string) => {
    lists.value.forEach((l) => (l.items = l.items.filter((x) => x !== id)))
    const l = lists.value.find((x) => x.id === listId)
    if (l) l.items = [...l.items, id]
    save()
  }
  const clearList = (listId: string) => {
    const l = lists.value.find((x) => x.id === listId)
    if (l) l.items = []
    save()
  }
  const dropList = (listId: string) => {
    if (listId === 'main') return
    lists.value = lists.value.filter((l) => l.id !== listId)
    save()
  }

  const login = (name: string, email: string) => {
    user.value = { name: name || email.split('@')[0] || 'Покупатель', email }
    save()
  }
  const logout = () => {
    user.value = null
    save()
  }
  const issueCard = (phone: string) => {
    bonusCard.value = phone
    save()
  }

  return {
    cart, lists, city, cityInfo, user, bonusCard, toast, persist, save, say, setCity,
    qtyOf, add, setQty, lineQty, remove, clearCart, addSet, count, sum, oldSum, courier,
    isFav, toggleFav, favCount, newList, moveTo, clearList, dropList, login, logout, issueCard, rub: skRub,
  }
}

export type SkModal = '' | 'city' | 'feedback' | 'login' | 'register' | 'forgot' | 'oneclick' | 'review' | 'pack' | 'filters' | 'shop'
export const useSkUi = () => ({
  menu: useState('sk-menu', () => false),
  search: useState('sk-search', () => false),
  modal: useState<SkModal>('sk-modal', () => ''),
  oneclick: useState<string>('sk-oneclick', () => ''), // id товара или 'cart'
  review: useState<string>('sk-review', () => ''),
  pack: useState<string>('sk-pack', () => ''),
  shop: useState<string>('sk-shop', () => ''),
})
