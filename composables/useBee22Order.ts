const STORAGE_KEY = 'bz-concept-order'

export interface BzForm {
  name: string
  phone: string
  messenger: 'MAX' | 'WhatsApp' | 'Звонок'
  city: string
  comment: string
}

export interface BzLine {
  sort: BzSort
  qty: number
  kg: number
  price: number
  sum: number
  bulk: boolean
  toBulk: number
}

// Заявка концепта «Мёд и Соты»: id сорта -> число куботейнеров (у сотов — рамок).
// Корзины у оригинала нет — оптовики оставляют телефон в форме, поэтому заявка превращается в готовое письмо на их почту.
// Хранится только в браузере, никуда не отправляется.
export const useBee22Order = () => {
  const items = useState<Record<string, number>>('bz-items', () => ({}))
  const form = useState<BzForm>('bz-form', () => ({ name: '', phone: '', messenger: 'MAX', city: '', comment: '' }))

  const lineOf = (sort: BzSort, qty: number): BzLine => {
    if (sort.frames) return { sort, qty, kg: 0, price: sort.tiers[0].price, sum: 0, bulk: false, toBulk: 0 }
    const kg = qty * bzCube
    const tier = bzTierOf(sort, kg)
    return { sort, qty, kg, price: tier.price, sum: kg * tier.price, bulk: kg >= bzBulk, toBulk: bzCubesToBulk(qty) }
  }

  const lines = computed<BzLine[]>(() =>
    Object.entries(items.value).flatMap(([id, qty]) => {
      const sort = bzSort(id)
      return sort ? [lineOf(sort, qty)] : []
    }),
  )
  const count = computed(() => lines.value.length)
  const kg = computed(() => lines.value.reduce((n, l) => n + l.kg, 0))
  const total = computed(() => lines.value.reduce((n, l) => n + l.sum, 0))
  const hasFrames = computed(() => lines.value.some((l) => l.sort.frames))

  const qtyOf = (id: string) => items.value[id] ?? 0
  const minOf = (s: BzSort) => (s.frames ? bzMinFrames : 1)
  const setQty = (s: BzSort, qty: number) => {
    const next = { ...items.value }
    const n = Math.floor(Number(qty) || 0)
    if (n < minOf(s)) delete next[s.id]
    else next[s.id] = Math.min(n, 999)
    items.value = next
  }
  const add = (s: BzSort) => setQty(s, Math.max(qtyOf(s.id) + 1, minOf(s)))
  const sub = (s: BzSort) => setQty(s, qtyOf(s.id) - 1)
  const remove = (s: BzSort) => setQty(s, 0)
  const clear = () => {
    items.value = {}
  }

  const text = computed(() => bzLetter(lines.value, form.value, kg.value, total.value))

  // Вызывается один раз в оболочке: подтягивает сохранённое и следит за изменениями.
  const persist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved?.items) items.value = saved.items
      if (saved?.form) form.value = { ...form.value, ...saved.form }
    } catch {
      /* localStorage может быть недоступен */
    }
    watch(
      [items, form],
      () => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: items.value, form: form.value }))
        } catch {
          /* ignore */
        }
      },
      { deep: true },
    )
  }

  return { items, form, lines, count, kg, total, hasFrames, lineOf, qtyOf, minOf, setQty, add, sub, remove, clear, text, persist }
}

// Письмо так, как его написал бы закупщик: сорт, куботейнеры и вес, цена за кг, сумма.
export const bzLetter = (lines: BzLine[], form: BzForm, kg: number, total: number) => {
  const rows = lines.map((l, i) => {
    if (l.sort.frames) return `${i + 1}. ${l.sort.title} — ${bzFramesLabel(l.qty)}, ${bzMoney(l.price)}/кг (сумму посчитаете по весу рамок)`
    return `${i + 1}. ${l.sort.title} — ${bzCubes(l.qty)}, ${bzKg(l.kg)} × ${bzMoney(l.price)}/кг = ${bzMoney(l.sum)}`
  })
  const out = ['Здравствуйте! Хочу заказать мёд по ценам с сайта:', '', ...rows, '']
  if (kg) out.push(`Всего: ${bzKg(kg)} на ${bzMoney(total)}`)
  out.push(`Доставка транспортной компанией в: ${form.city || 'город уточню'}`)
  if (form.name) out.push(`Имя / организация: ${form.name}`)
  if (form.phone) out.push(`Телефон: ${form.phone} (${form.messenger})`)
  if (form.comment) out.push(`Комментарий: ${form.comment}`)
  return out.join('\n')
}

export const useBee22Ui = () => {
  const toast = useState<string | null>('bz-toast', () => null)
  // Лайтбокс: набор кадров и номер открытого
  const gallery = useState<{ items: { img: string; title: string }[]; index: number } | null>('bz-gallery', () => null)
  const menu = useState<boolean>('bz-menu', () => false)
  const priceModal = useState<boolean>('bz-price', () => false)
  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (toast.value = null), 3600)
  }
  const open = (items: { img: string; title: string }[], index: number) => {
    gallery.value = { items, index }
  }
  return { toast, gallery, menu, priceModal, say, open }
}
