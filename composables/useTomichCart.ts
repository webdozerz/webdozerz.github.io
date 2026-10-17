const STORAGE_KEY = 'tm-concept-cart'

// Корзина концепта «Томич»: id блюда -> количество порций. Хранится только в браузере.
export const useTomichCart = () => {
  const items = useState<Record<string, number>>('tm-cart', () => ({}))

  const lines = computed(() =>
    Object.entries(items.value).flatMap(([id, qty]) => {
      const dish = tmFindDish(id)
      return dish ? [{ dish, qty, sum: dish.price * qty }] : []
    }),
  )
  const count = computed(() => lines.value.reduce((n, l) => n + l.qty, 0))
  const total = computed(() => lines.value.reduce((n, l) => n + l.sum, 0))

  const qtyOf = (id: string) => items.value[id] ?? 0

  const setQty = (id: string, qty: number) => {
    const next = { ...items.value }
    if (qty <= 0) delete next[id]
    else next[id] = Math.min(qty, 99)
    items.value = next
  }
  const add = (id: string, n = 1) => setQty(id, qtyOf(id) + n)
  const remove = (id: string) => setQty(id, qtyOf(id) - 1)
  const drop = (id: string) => setQty(id, 0)
  const clear = () => {
    items.value = {}
  }

  // Вызывается один раз в оболочке: подтягивает сохранённую корзину и следит за изменениями.
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

  return { lines, count, total, qtyOf, setQty, add, remove, drop, clear, persist }
}
