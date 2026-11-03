const STORAGE_KEY = 'iz-concept'

export interface IzLine {
  p: IzProduct
  qty: number
  // сумма диапазоном: мясо за кг считается по весу тушки; null — цену назовут по телефону
  sum: [number, number] | null
}
export interface IzReview {
  name: string
  text: string
  stars: number
  date: string
}
export interface IzForm {
  name: string
  phone: string
  email: string
  address: string
  comment: string
}

// Корзина, сравнение, оценки и отзывы концепта «Изюмовское». Живёт только в браузере, никуда не отправляется.
// Заказ делится на две части по правилу фермы: мясо привозят, молодняк забирают с фермы.
export const useIzyumCart = () => {
  const items = useState<Record<string, number>>('iz-items', () => ({}))
  const compare = useState<string[]>('iz-compare', () => [])
  const votes = useState<Record<string, number>>('iz-votes', () => ({}))
  const reviews = useState<Record<string, IzReview[]>>('iz-reviews', () => ({}))
  const user = useState<string>('iz-user', () => '')
  const way = useState<IzWay>('iz-way', () => 'courier')
  const pay = useState<IzPay>('iz-pay', () => 'cash')
  const form = useState<IzForm>('iz-form', () => ({ name: '', phone: '', email: '', address: '', comment: '' }))

  const lineOf = (p: IzProduct, qty: number): IzLine => {
    if (p.price === null) return { p, qty, sum: null }
    const per = izPerCarcass(p)
    if (per) return { p, qty, sum: [per[0] * qty, per[1] * qty] }
    return { p, qty, sum: [p.price * qty, p.price * qty] }
  }
  const lines = computed<IzLine[]>(() =>
    Object.entries(items.value).flatMap(([id, qty]) => {
      const p = izProduct(id)
      return p ? [lineOf(p, qty)] : []
    }),
  )
  const meat = computed(() => lines.value.filter((l) => l.p.section !== 'molodnyak'))
  const young = computed(() => lines.value.filter((l) => l.p.section === 'molodnyak'))
  const count = computed(() => lines.value.length)
  const unknown = computed(() => lines.value.some((l) => !l.sum))
  const goods = computed<[number, number]>(() =>
    lines.value.reduce<[number, number]>((a, l) => (l.sum ? [a[0] + l.sum[0], a[1] + l.sum[1]] : a), [0, 0]),
  )
  const delivery = computed(() => (way.value === 'courier' && meat.value.length ? izDeliveryCost : 0))
  const total = computed<[number, number]>(() => [goods.value[0] + delivery.value, goods.value[1] + delivery.value])
  // для шапки — целые рубли, одно число: «до» верха итога вместе с доставкой, как в корзине
  const headerSum = computed(() => (goods.value[1] ? total.value[1] : 0))

  const qtyOf = (id: string) => items.value[id] ?? 0
  const setQty = (p: IzProduct, qty: number) => {
    const next = { ...items.value }
    const n = Math.floor(Number(qty) || 0)
    if (n < p.min) delete next[p.id]
    else next[p.id] = Math.min(n, 999)
    items.value = next
  }
  const add = (p: IzProduct, n?: number) => setQty(p, n ?? Math.max(qtyOf(p.id) + 1, p.min))
  const inc = (p: IzProduct) => setQty(p, qtyOf(p.id) + 1)
  // ниже минимума («от 10 голов») счётчик убирает позицию
  const dec = (p: IzProduct) => setQty(p, qtyOf(p.id) - 1)
  const remove = (p: IzProduct) => setQty(p, 0)
  const clear = () => {
    items.value = {}
  }

  const inCompare = (id: string) => compare.value.includes(id)
  const toggleCompare = (id: string) => {
    compare.value = inCompare(id) ? compare.value.filter((x) => x !== id) : [...compare.value, id]
  }

  const vote = (id: string, n: number) => {
    votes.value = { ...votes.value, [id]: n }
  }
  const addReview = (id: string, r: IzReview) => {
    reviews.value = { ...reviews.value, [id]: [r, ...(reviews.value[id] ?? [])] }
  }

  // Вызывается один раз в оболочке
  const persist = () => {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (s?.items) items.value = s.items
      if (s?.compare) compare.value = s.compare
      if (s?.votes) votes.value = s.votes
      if (s?.reviews) reviews.value = s.reviews
      if (s?.user) user.value = s.user
      if (s?.way) way.value = s.way
      if (s?.pay) pay.value = s.pay
      if (s?.form) form.value = { ...form.value, ...s.form }
    } catch {
      /* localStorage может быть недоступен */
    }
    watch(
      [items, compare, votes, reviews, user, way, pay, form],
      () => {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              items: items.value,
              compare: compare.value,
              votes: votes.value,
              reviews: reviews.value,
              user: user.value,
              way: way.value,
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
    items, compare, votes, reviews, user, way, pay, form,
    lines, meat, young, count, unknown, goods, delivery, total, headerSum,
    qtyOf, setQty, add, inc, dec, remove, clear,
    inCompare, toggleCompare, vote, addReview, persist,
  }
}

// Общее состояние интерфейса: меню, вход, «в один клик», поиск
export const useIzyumUi = () => ({
  menu: useState('iz-menu', () => false),
  login: useState<false | 'login' | 'register' | 'forgot'>('iz-login', () => false),
  oneClick: useState<string | null>('iz-oneclick', () => null),
  toast: useState<string>('iz-toast', () => ''),
})
