const STORAGE_KEY = 'rs-concept-cart'

export type RsMode = 'retail' | 'opt'

interface RsSaved {
  mode: RsMode
  items: Record<string, number>
  opt: Record<string, number>
  favs: string[]
}

// Состояние концепта «Стиль Продукт»: режим (розница или опт), розничная корзина
// (id -> кг, штуки, упаковки), оптовая заявка (id позиции прайса -> кг или упаковки) и избранное.
// Хранится только в браузере.
export const useRybasibiriCart = () => {
  const mode = useState<RsMode>('rs-mode', () => 'retail')
  const items = useState<Record<string, number>>('rs-cart', () => ({}))
  const opt = useState<Record<string, number>>('rs-opt', () => ({}))
  const favs = useState<string[]>('rs-favs', () => [])

  const lines = computed(() =>
    Object.entries(items.value).flatMap(([id, qty]) => {
      const product = rsFind(id)
      return product ? [{ id, product, qty, sum: rsSum(product, qty) }] : []
    }),
  )
  const count = computed(() => lines.value.length)
  const total = computed<[number, number]>(() =>
    lines.value.reduce<[number, number]>((acc, l) => [acc[0] + l.sum[0], acc[1] + l.sum[1]], [0, 0]),
  )

  const optLines = computed(() =>
    Object.entries(opt.value).flatMap(([id, qty]) => {
      const item = rsOptFind(id)
      return item ? [{ id, item, qty, sum: item.price * qty }] : []
    }),
  )
  const optCount = computed(() => optLines.value.length)
  const optTotal = computed(() => optLines.value.reduce((s, l) => s + l.sum, 0))
  const optKg = computed(() => optLines.value.reduce((s, l) => s + (l.item.unit === 'kg' ? l.qty : 0), 0))

  const round = (qty: number) => Math.min(Math.round(qty * 10) / 10, 9999)

  const qtyOf = (id: string) => items.value[id] ?? 0
  const setQty = (id: string, qty: number) => {
    const next = { ...items.value }
    if (qty <= 0) delete next[id]
    else next[id] = round(qty)
    items.value = next
  }
  const add = (id: string, qty: number) => setQty(id, qtyOf(id) + qty)

  const optQtyOf = (id: string) => opt.value[id] ?? 0
  const setOpt = (id: string, qty: number) => {
    const next = { ...opt.value }
    if (qty <= 0) delete next[id]
    else next[id] = round(qty)
    opt.value = next
  }

  const isFav = (id: string) => favs.value.includes(id)
  const toggleFav = (id: string) => {
    favs.value = isFav(id) ? favs.value.filter((f) => f !== id) : [...favs.value, id]
  }

  const clear = () => {
    items.value = {}
  }
  const clearOpt = () => {
    opt.value = {}
  }

  // Вызывается один раз в оболочке: подтягивает сохранённое состояние и следит за изменениями.
  const persist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as RsSaved | null
      if (saved) {
        mode.value = saved.mode === 'opt' ? 'opt' : 'retail'
        items.value = saved.items ?? {}
        opt.value = saved.opt ?? {}
        favs.value = saved.favs ?? []
      }
    } catch {
      /* localStorage может быть недоступен */
    }
    watch(
      [mode, items, opt, favs],
      () => {
        try {
          const value: RsSaved = { mode: mode.value, items: items.value, opt: opt.value, favs: favs.value }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        } catch {
          /* ignore */
        }
      },
      { deep: true },
    )
  }

  return {
    mode,
    lines,
    count,
    total,
    optLines,
    optCount,
    optTotal,
    optKg,
    favs,
    qtyOf,
    setQty,
    add,
    optQtyOf,
    setOpt,
    isFav,
    toggleFav,
    clear,
    clearOpt,
    persist,
  }
}
