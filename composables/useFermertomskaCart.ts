const STORAGE_KEY = 'ft-concept-cart'

// Корзина концепта «Куендатское»: id товара -> количество (шт или кг). Хранится только в браузере.
export const useFermertomskaCart = () => {
  const items = useState<Record<string, number>>('ft-cart', () => ({}))
  const favorites = useState<string[]>('ft-fav', () => [])

  const lines = computed(() =>
    Object.entries(items.value).flatMap(([id, qty]) => {
      const product = ftFindProduct(id)
      return product ? [{ product, family: ftFamilyOf(product.family), qty, sum: product.price * qty }] : []
    }),
  )
  const count = computed(() => lines.value.length)
  const subtotal = computed(() => lines.value.reduce((n, l) => n + l.sum, 0))

  const qtyOf = (id: string) => items.value[id] ?? 0

  const setQty = (id: string, qty: number) => {
    const next = { ...items.value }
    if (qty <= 0) delete next[id]
    // Не больше остатка, если магазин его указывает.
    else next[id] = Math.min(qty, ftFindProduct(id)?.stock ?? 50)
    items.value = next
  }
  const add = (id: string) => setQty(id, qtyOf(id) + 1)
  const remove = (id: string) => setQty(id, qtyOf(id) - 1)
  const clear = () => {
    items.value = {}
  }

  const isFav = (familyId: string) => favorites.value.includes(familyId)
  const toggleFav = (familyId: string) => {
    favorites.value = isFav(familyId)
      ? favorites.value.filter((id) => id !== familyId)
      : [...favorites.value, familyId]
  }

  // Вызывается один раз в оболочке: подтягивает сохранённое и следит за изменениями.
  const persist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved?.items) items.value = saved.items
      if (Array.isArray(saved?.favorites)) favorites.value = saved.favorites
    } catch {
      /* localStorage может быть недоступен */
    }
    watch(
      [items, favorites],
      () => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: items.value, favorites: favorites.value }))
        } catch {
          /* ignore */
        }
      },
      { deep: true },
    )
  }

  return { lines, count, subtotal, qtyOf, setQty, add, remove, clear, favorites, isFav, toggleFav, persist }
}
