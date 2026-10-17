const STORAGE_KEY = 'sn-concept-cart'

// Корзина концепта «Саныч»: ключ «id~разделка» -> количество (кг, куски, упаковки, порции).
// Хранится только в браузере.
export const useSanychCart = () => {
  const items = useState<Record<string, number>>('sn-cart', () => ({}))

  const keyOf = (id: string, cut: SnCut | '' = '') => `${id}~${cut}`

  const lines = computed(() =>
    Object.entries(items.value).flatMap(([key, qty]) => {
      const [id, cut] = key.split('~')
      const product = snFind(id)
      return product ? [{ key, product, cut: (cut || '') as SnCut | '', qty, sum: snSum(product, qty) }] : []
    }),
  )
  const count = computed(() => lines.value.length)
  const total = computed<[number, number]>(() =>
    lines.value.reduce<[number, number]>((acc, l) => [acc[0] + l.sum[0], acc[1] + l.sum[1]], [0, 0]),
  )
  const weight = computed(() =>
    lines.value.reduce((kg, l) => kg + snWeight(l.product, l.qty)[0], 0),
  )

  const qtyOf = (key: string) => items.value[key] ?? 0
  /** Сколько товара в корзине при любой разделке — для состояния кнопки в карточке. */
  const inCart = (id: string) =>
    Object.entries(items.value).some(([key, qty]) => key.startsWith(`${id}~`) && qty > 0)

  const setQty = (key: string, qty: number) => {
    const next = { ...items.value }
    if (qty <= 0) delete next[key]
    else next[key] = Math.min(Math.round(qty * 10) / 10, 999)
    items.value = next
  }
  const add = (id: string, qty: number, cut: SnCut | '' = '') => {
    const key = keyOf(id, cut)
    setQty(key, qtyOf(key) + qty)
  }
  const drop = (key: string) => setQty(key, 0)
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

  return { lines, count, total, weight, keyOf, qtyOf, inCart, setQty, add, drop, clear, persist }
}
