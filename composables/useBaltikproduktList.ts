const STORAGE_KEY = 'bp-concept-list'

export interface BpForm {
  buyer: 'company' | 'person'
  name: string
  phone: string
  way: 'delivery' | 'pickup'
  address: string
  comment: string
}

export interface BpLine {
  product: BpProduct
  qty: number
  price: number
  sum: number
  box: boolean
}

// Список заказа концепта Балтик продукт: id позиции -> количество в кг или штуках.
// Корзины у оригинала нет — заказывают по телефону и почте, поэтому список превращается в готовое письмо на sales@.
// Хранится только в браузере, никуда не отправляется.
export const useBaltikproduktList = () => {
  const items = useState<Record<string, number>>('bp-items', () => ({}))
  const mode = useState<BpMode>('bp-mode', () => 'opt')
  const form = useState<BpForm>('bp-form', () => ({ buyer: 'company', name: '', phone: '', way: 'delivery', address: '', comment: '' }))

  const lines = computed<BpLine[]>(() =>
    Object.entries(items.value).flatMap(([id, qty]) => {
      const product = bpFind(id)
      if (!product) return []
      const price = bpUnitPrice(product, qty, mode.value)
      const box = Boolean(product.boxPrice && product.pack && qty >= product.pack)
      return [{ product, qty, price, sum: Math.round(price * qty * 100) / 100, box }]
    }),
  )
  const count = computed(() => lines.value.length)
  const total = computed(() => lines.value.reduce((n, l) => n + l.sum, 0))
  const kg = computed(() => lines.value.filter((l) => l.product.kind === 'kg').reduce((n, l) => n + l.qty, 0))
  const unknown = computed(() => lines.value.filter((l) => !l.product.price).length)

  const qtyOf = (id: string) => items.value[id] ?? 0
  const setQty = (id: string, qty: number) => {
    const next = { ...items.value }
    const n = Math.round((Number(qty) || 0) * 10) / 10
    if (n <= 0) delete next[id]
    else next[id] = Math.min(n, 99999)
    items.value = next
  }
  // Первое нажатие кладёт минимум по условиям (весовой — 3 кг), дальше шаг 1.
  const add = (p: BpProduct) => {
    const q = qtyOf(p.id)
    setQty(p.id, q ? q + 1 : bpMin(p))
  }
  const sub = (p: BpProduct) => {
    const q = qtyOf(p.id)
    setQty(p.id, q - 1 < bpMin(p) ? 0 : q - 1)
  }
  // «Коробкой» — до ближайшей полной коробки сверху.
  const addBox = (p: BpProduct) => {
    if (!p.pack) return
    const q = qtyOf(p.id)
    const boxes = Math.floor(q / p.pack + 1e-6) + 1
    setQty(p.id, Math.round(boxes * p.pack * 100) / 100)
  }
  const clear = () => {
    items.value = {}
  }

  const text = computed(() => bpLetter(lines.value, mode.value, form.value, total.value))

  // Вызывается один раз в оболочке: подтягивает сохранённое и следит за изменениями.
  const persist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved?.items) items.value = saved.items
      if (saved?.mode) mode.value = saved.mode
      if (saved?.form) form.value = { ...form.value, ...saved.form }
    } catch {
      /* localStorage может быть недоступен */
    }
    watch(
      [items, mode, form],
      () => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: items.value, mode: mode.value, form: form.value }))
        } catch {
          /* ignore */
        }
      },
      { deep: true },
    )
  }

  return { items, mode, form, lines, count, total, kg, unknown, text, qtyOf, setQty, add, sub, addBox, clear, persist }
}

// Письмо так, как его написал бы закупщик: позиция, количество, цена, сумма.
export const bpLetter = (lines: BpLine[], mode: BpMode, form: BpForm, total: number) => {
  const rows = lines.map((l, i) => {
    const p = l.product
    const head = `${i + 1}. ${p.name}${p.net ? `, ${p.net}` : ''} — ${bpQtyLabel(p, l.qty)}`
    if (!p.price) return `${head} (цену и срок уточните)`
    return `${head} × ${bpMoney(l.price)}${l.box ? ' (цена коробкой)' : ''} = ${bpMoney(l.sum)}${p.flag === 'order' || p.flag === 'wait' ? ' — уточните срок' : ''}`
  })
  const out = [
    'Здравствуйте! Хочу заказать по прайсу с сайта:',
    `Цены: ${mode === 'retail' ? 'розница (мелкооптовый прайс +3 %)' : 'опт'}`,
    '',
    ...rows,
    '',
    `Итого: ${bpMoney(total)}`,
    form.way === 'pickup' ? `Заберу сам: ${bpContacts.address}` : `Доставка: ${form.address || 'адрес уточню'}`,
  ]
  if (form.name) out.push(`${form.buyer === 'company' ? 'Организация' : 'Покупатель'}: ${form.name}`)
  if (form.phone) out.push(`Телефон: ${form.phone}`)
  if (form.comment) out.push(`Комментарий: ${form.comment}`)
  return out.join('\n')
}

export const useBaltikproduktUi = () => {
  const toast = useState<string | null>('bp-toast', () => null)
  const photo = useState<BpProduct | null>('bp-photo', () => null)
  const menu = useState<boolean>('bp-menu', () => false)
  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (toast.value = null), 3600)
  }
  return { toast, photo, menu, say }
}
