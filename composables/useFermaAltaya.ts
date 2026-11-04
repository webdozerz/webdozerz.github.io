const STORAGE_KEY = 'fa-concept'

export interface FaLine {
  p: FaProduct
  qty: number
  sum: [number, number]
}
export interface FaUser {
  name: string
  email: string
  phone: string
  balance: number
}
export interface FaForm {
  name: string
  phone: string
  email: string
  street: string
  house: string
  flat: string
  entrance: string
  floor: string
  intercom: string
  comment: string
}
export interface FaOrder {
  n: number
  date: string
  total: [number, number]
  count: number
  city: FaCity
  wave: string
}
export type FaPay = 'cash' | 'terminal' | 'online'

// Корзина, избранное, оценки, вход и кабинет концепта «Ферма Алтая». Живёт только в браузере, никуда не отправляется.
// Весовой товар считается диапазоном «≈», точную сумму ферма присылает после ночной сборки — как у оригинала.
export const useFermaAltaya = () => {
  const items = useState<Record<string, number>>('fa-items', () => ({}))
  const fav = useState<string[]>('fa-fav', () => [])
  const votes = useState<Record<string, number>>('fa-votes', () => ({}))
  const myReviews = useState<Record<string, FaReviewItem[]>>('fa-reviews', () => ({}))
  const user = useState<FaUser | null>('fa-user', () => null)
  const city = useState<FaCity>('fa-city', () => 'nsk')
  const pay = useState<FaPay>('fa-pay', () => 'cash')
  const dayPref = useState<string>('fa-daypref', () => '')
  const coupon = useState<string>('fa-coupon', () => '')
  const useBonus = useState<boolean>('fa-usebonus', () => false)
  const orders = useState<FaOrder[]>('fa-orders', () => [])
  const survey = useState<number>('fa-survey', () => 0)
  const dark = useState<boolean>('fa-dark', () => false)
  const cookie = useState<boolean>('fa-cookie', () => false)
  const form = useState<FaForm>('fa-form', () => ({
    name: '',
    phone: '',
    email: '',
    street: '',
    house: '',
    flat: '',
    entrance: '',
    floor: '',
    intercom: '',
    comment: '',
  }))

  const lines = computed<FaLine[]>(() =>
    Object.entries(items.value).flatMap(([id, qty]) => {
      const p = faProduct(id)
      if (!p) return []
      const e = faEach(p)
      return [{ p, qty, sum: [e[0] * qty, e[1] * qty] as [number, number] }]
    }),
  )
  const count = computed(() => lines.value.reduce((a, l) => a + l.qty, 0))
  const weighed = computed(() => lines.value.some((l) => faWeighed(l.p)))
  const goods = computed<[number, number]>(() => lines.value.reduce<[number, number]>((a, l) => [a[0] + l.sum[0], a[1] + l.sum[1]], [0, 0]))
  const weight = computed(() => lines.value.reduce((a, l) => a + (faWeight(l.p) ?? 0) * l.qty, 0))
  const short = computed(() => Math.max(0, FA_MIN - goods.value[0]))
  const bonusOff = computed(() => (useBonus.value && user.value ? Math.min(user.value.balance, Math.floor(goods.value[0] * 0.5)) : 0))
  const total = computed<[number, number]>(() => [goods.value[0] - bonusOff.value, goods.value[1] - bonusOff.value])
  const earn = computed(() => Math.floor(total.value[0] * FA_BONUS))
  // для шапки — целые рубли одним числом; при весовом товаре — «до» верха итога, как в корзине
  const headerSum = computed(() => total.value[1])

  const qtyOf = (id: string) => items.value[id] ?? 0
  const setQty = (p: FaProduct, qty: number) => {
    const next = { ...items.value }
    const n = Math.floor(Number(qty) || 0)
    if (n < 1) delete next[p.id]
    else next[p.id] = Math.min(n, 99)
    items.value = next
  }
  const add = (p: FaProduct, n = 1) => setQty(p, qtyOf(p.id) + n)
  const inc = (p: FaProduct) => setQty(p, qtyOf(p.id) + 1)
  const dec = (p: FaProduct) => setQty(p, qtyOf(p.id) - 1)
  const remove = (p: FaProduct) => setQty(p, 0)
  const clear = () => {
    items.value = {}
  }

  const isFav = (id: string) => fav.value.includes(id)
  const toggleFav = (id: string) => {
    fav.value = isFav(id) ? fav.value.filter((x) => x !== id) : [...fav.value, id]
  }
  const vote = (id: string, n: number) => {
    votes.value = { ...votes.value, [id]: n }
  }
  const addReview = (id: string, r: FaReviewItem) => {
    myReviews.value = { ...myReviews.value, [id]: [r, ...(myReviews.value[id] ?? [])] }
  }

  // Вызывается один раз в оболочке
  const persist = () => {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (s?.items) items.value = s.items
      if (s?.fav) fav.value = s.fav
      if (s?.votes) votes.value = s.votes
      if (s?.myReviews) myReviews.value = s.myReviews
      if (s?.user !== undefined) user.value = s.user
      if (s?.city) city.value = s.city
      if (s?.pay) pay.value = s.pay
      if (s?.orders) orders.value = s.orders
      if (s?.survey) survey.value = s.survey
      if (s?.dark) dark.value = s.dark
      if (s?.cookie) cookie.value = s.cookie
      if (s?.form) form.value = { ...form.value, ...s.form }
    } catch {
      /* localStorage может быть недоступен */
    }
    watch(
      [items, fav, votes, myReviews, user, city, pay, orders, survey, dark, cookie, form],
      () => {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              items: items.value,
              fav: fav.value,
              votes: votes.value,
              myReviews: myReviews.value,
              user: user.value,
              city: city.value,
              pay: pay.value,
              orders: orders.value,
              survey: survey.value,
              dark: dark.value,
              cookie: cookie.value,
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
    items, fav, votes, myReviews, user, city, pay, dayPref, coupon, useBonus, orders, survey, dark, cookie, form,
    lines, count, weighed, goods, weight, short, bonusOff, total, earn, headerSum,
    qtyOf, setQty, add, inc, dec, remove, clear, isFav, toggleFav, vote, addReview, persist,
  }
}

// Общее состояние интерфейса: каталог-панель, меню, вход, «Перезвоните мне», уведомление
export const useFaUi = () => ({
  menu: useState('fa-menu', () => false),
  catalog: useState('fa-catalog', () => false),
  login: useState<false | 'login' | 'register' | 'forgot'>('fa-login', () => false),
  callback: useState('fa-callback', () => false),
  toast: useState<string>('fa-toast', () => ''),
})

// Живое время: тикает раз в 30 секунд, на сервере — время сборки
export const useFaNow = () => {
  const now = useState<number>('fa-now', () => Date.now())
  return now
}
