import type { NsProduct, NsZoneId } from '~/utils/naslagdeniaData'

const STORAGE_KEY = 'ns-concept-order'

/** Заказной торт: вес, дата готовности, начинка из готовых тортов, надпись. */
export interface NsCustomLine {
  key: string
  id: string
  weight: number
  date: string
  filling: string
  text: string
}

export interface NsForm {
  way: 'delivery' | 'pickup'
  shop: string
  zone: NsZoneId
  address: string
  day: 'today' | 'tomorrow' | 'date'
  date: string
  slot: string
  name: string
  phone: string
  comment: string
}

export interface NsSent {
  id: number
  date: string
  total: number
  lines: string[]
}

export interface NsUserReview {
  name: string
  email: string
  rating: number
  text: string
  date: string
}

const emptyForm = (): NsForm => ({
  way: 'delivery',
  shop: '01',
  zone: 'left',
  address: '',
  day: 'today',
  date: '',
  slot: '',
  name: '',
  phone: '',
  comment: '',
})

// Заявка концепта «Наслаждение»: готовые торты и коробки пирожных — штуками, заказные — строкой
// с весом и датой. Всё хранится только в браузере и никуда не отправляется.
export const useNaslagdeniaOrder = () => {
  const items = useState<Record<string, number>>('ns-items', () => ({}))
  const custom = useState<NsCustomLine[]>('ns-custom', () => [])
  const form = useState<NsForm>('ns-form', emptyForm)
  const sent = useState<NsSent[]>('ns-sent', () => [])
  const myReviews = useState<NsUserReview[]>('ns-reviews', () => [])

  const qty = (id: string) => items.value[id] ?? 0
  const setQty = (id: string, n: number) => {
    const next = { ...items.value }
    if (n <= 0) delete next[id]
    else next[id] = Math.min(n, 99)
    items.value = next
  }
  const add = (p: NsProduct) => setQty(p.id, qty(p.id) + 1)

  const readyLines = computed(() =>
    Object.entries(items.value)
      .map(([id, n]) => ({ product: nsFind(id)!, qty: n }))
      .filter((l) => l.product)
      .map((l) => ({ ...l, sum: l.product.price * l.qty })),
  )
  const customLines = computed(() =>
    custom.value
      .map((l) => ({ ...l, product: nsFind(l.id)! }))
      .filter((l) => l.product)
      .map((l) => ({ ...l, sum: l.product.price * l.weight })),
  )
  const addCustom = (line: Omit<NsCustomLine, 'key'>) => {
    custom.value = [...custom.value, { ...line, key: `${line.id}-${Date.now()}` }]
  }
  const updateCustom = (key: string, patch: Partial<NsCustomLine>) => {
    custom.value = custom.value.map((l) => (l.key === key ? { ...l, ...patch } : l))
  }
  const removeCustom = (key: string) => {
    custom.value = custom.value.filter((l) => l.key !== key)
  }

  const count = computed(() => readyLines.value.reduce((s, l) => s + l.qty, 0) + custom.value.length)
  const readySum = computed(() => readyLines.value.reduce((s, l) => s + l.sum, 0))
  const customSum = computed(() => customLines.value.reduce((s, l) => s + l.sum, 0))
  const total = computed(() => readySum.value + customSum.value)
  const prepay = computed(() => Math.round(customSum.value * nsRules.prepay))
  const pieSum = computed(() => readyLines.value.filter((l) => l.product.section === 'pie').reduce((s, l) => s + l.sum, 0))

  const clear = () => {
    items.value = {}
    custom.value = []
  }

  const persist = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved.items) items.value = saved.items
        if (Array.isArray(saved.custom)) custom.value = saved.custom
        if (saved.form) form.value = { ...emptyForm(), ...saved.form }
        if (Array.isArray(saved.sent)) sent.value = saved.sent
        if (Array.isArray(saved.myReviews)) myReviews.value = saved.myReviews
      }
    } catch {}
    watch(
      [items, custom, form, sent, myReviews],
      () => {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ items: items.value, custom: custom.value, form: form.value, sent: sent.value, myReviews: myReviews.value }),
          )
        } catch {}
      },
      { deep: true },
    )
  }

  return {
    items,
    custom,
    form,
    sent,
    myReviews,
    qty,
    setQty,
    add,
    readyLines,
    customLines,
    addCustom,
    updateCustom,
    removeCustom,
    count,
    readySum,
    customSum,
    total,
    prepay,
    pieSum,
    clear,
    persist,
  }
}

// Окна и уведомления оболочки: меню, «Быстрый заказ», «Перезвоните мне».
export const useNaslagdeniaUi = () => {
  const menuOpen = useState('ns-menu', () => false)
  const quickOpen = useState('ns-quick', () => false)
  const quickCake = useState('ns-quick-cake', () => '')
  const callOpen = useState('ns-call', () => false)
  const toast = useState('ns-toast', () => '')
  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (toast.value = ''), 3800)
  }
  const closeAll = () => {
    menuOpen.value = false
    quickOpen.value = false
    callOpen.value = false
  }
  const openQuick = (cake = '') => {
    closeAll()
    quickCake.value = cake
    quickOpen.value = true
  }
  const openCall = () => {
    closeAll()
    callOpen.value = true
  }
  return { menuOpen, quickOpen, quickCake, callOpen, toast, say, closeAll, openQuick, openCall }
}
