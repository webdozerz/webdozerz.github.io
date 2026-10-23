const STORAGE_KEY = 'fm-concept-order'

export interface FmForm {
  day: string
  address: string
  name: string
  phone: string
  comment: string
}

// Заказ концепта FermaTomsk: id товара -> количество фасовок плюс данные для сообщения ферме.
// Хранится только в браузере, никуда не отправляется.
export const useFermatomskOrder = () => {
  const items = useState<Record<string, number>>('fm-items', () => ({}))
  const form = useState<FmForm>('fm-form', () => ({ day: '', address: '', name: '', phone: '', comment: '' }))

  const lines = computed(() =>
    Object.entries(items.value).flatMap(([id, qty]) => {
      const product = fmFindProduct(id)
      return product ? [{ product, qty, sum: product.price * qty }] : []
    }),
  )
  const count = computed(() => lines.value.length)
  const total = computed(() => lines.value.reduce((n, l) => n + l.sum, 0))

  const qtyOf = (id: string) => items.value[id] ?? 0
  const setQty = (id: string, qty: number) => {
    const next = { ...items.value }
    if (qty <= 0) delete next[id]
    else next[id] = Math.min(qty, 30)
    items.value = next
  }
  const add = (id: string) => setQty(id, qtyOf(id) + 1)
  const remove = (id: string) => setQty(id, qtyOf(id) - 1)
  const clear = () => {
    items.value = {}
  }

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

  return { items, form, lines, count, total, qtyOf, setQty, add, remove, clear, persist }
}

// Шторка товара, галерея и всплывающие подсказки — общие для всех страниц концепта.
export const useFermatomskUi = () => {
  const product = useState<string | null>('fm-product', () => null)
  const photo = useState<{ list: { src: string; alt: string }[]; index: number } | null>('fm-photo', () => null)
  const menuOpen = useState('fm-menu', () => false)
  const toast = useState<string | null>('fm-toast', () => null)
  const days = useState<FmDay[]>('fm-days', () => [])

  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (toast.value = null), 3200)
  }

  return { product, photo, menuOpen, toast, days, say }
}
