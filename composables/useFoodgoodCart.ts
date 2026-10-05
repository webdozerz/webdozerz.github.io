const STORAGE_KEY = 'fg-concept-cart'

// Корзина концепта FoodGood: id товара -> количество. Хранится только в браузере.
export const useFoodgoodCart = () => {
  const items = useState<Record<string, number>>('fg-cart', () => ({}))

  const lines = computed(() =>
    Object.entries(items.value).flatMap(([id, qty]) => {
      const product = fgFindProduct(id)
      return product ? [{ product, qty, sum: product.price * qty }] : []
    }),
  )
  const count = computed(() => lines.value.reduce((n, l) => n + l.qty, 0))
  const subtotal = computed(() => lines.value.reduce((n, l) => n + l.sum, 0))

  const qtyOf = (id: string) => items.value[id] ?? 0

  const setQty = (id: string, qty: number) => {
    const next = { ...items.value }
    if (qty <= 0) delete next[id]
    else next[id] = Math.min(qty, 99)
    items.value = next
  }
  const add = (id: string) => setQty(id, qtyOf(id) + 1)
  const remove = (id: string) => setQty(id, qtyOf(id) - 1)
  const clear = () => {
    items.value = {}
  }

  // Вызывается один раз в оболочке сайта: подтягивает сохранённую корзину и следит за изменениями.
  const persist = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) items.value = JSON.parse(saved)
    } catch {
      /* localStorage может быть недоступен */
    }
    watch(
      items,
      (value) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        } catch {
          /* ignore */
        }
      },
      { deep: true },
    )
  }

  return { lines, count, subtotal, qtyOf, setQty, add, remove, clear, persist }
}
