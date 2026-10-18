const STORAGE_KEY = 'sb-concept-request'

export interface SbLine {
  id: string
  /** Выбранный объём или вес; пусто — «любой, подскажет менеджер». */
  vol: string
  qty: number
}

interface SbSaved {
  lines: SbLine[]
  adult: boolean
  cookies: boolean
  notice: boolean
  view: 'grid' | 'list'
}

// Состояние концепта «СибирьТрейд»: заявка (позиция + объём -> число упаковок),
// подтверждение возраста для пива, согласие с cookie, скрытое объявление и вид каталога.
// Хранится только в браузере.
export const useSibirtreidRequest = () => {
  const lines = useState<SbLine[]>('sb-lines', () => [])
  const adult = useState('sb-adult', () => false)
  const cookies = useState('sb-cookies', () => false)
  const notice = useState('sb-notice', () => true)
  const view = useState<'grid' | 'list'>('sb-view', () => 'grid')
  const priceModal = useState<{ open: boolean; topic: string }>('sb-price', () => ({ open: false, topic: '' }))
  const ready = useState('sb-ready', () => false)

  const rows = computed(() =>
    lines.value.flatMap((l) => {
      const item = sbFind(l.id)
      return item ? [{ ...l, item, key: `${l.id}|${l.vol}`, sum: item.price * l.qty }] : []
    }),
  )
  const count = computed(() => rows.value.length)
  const packs = computed(() => rows.value.reduce((s, r) => s + r.qty, 0))
  const total = computed(() => rows.value.reduce((s, r) => s + r.sum, 0))
  const left = computed(() => Math.max(0, SB_MIN_ORDER - total.value))

  const find = (id: string, vol = '') => lines.value.find((l) => l.id === id && l.vol === vol)
  const qtyOf = (id: string) => lines.value.filter((l) => l.id === id).reduce((s, l) => s + l.qty, 0)
  const has = (id: string) => lines.value.some((l) => l.id === id)

  const set = (id: string, vol: string, qty: number) => {
    const item = sbFind(id)
    if (!item) return
    const next = lines.value.filter((l) => !(l.id === id && l.vol === vol))
    if (qty > 0) {
      const at = lines.value.findIndex((l) => l.id === id && l.vol === vol)
      const line = { id, vol, qty: Math.min(Math.max(Math.round(qty), sbMin(item)), 9999) }
      next.splice(at < 0 ? next.length : at, 0, line)
    }
    lines.value = next
  }
  const add = (id: string, vol: string, qty: number) => set(id, vol, (find(id, vol)?.qty ?? 0) + qty)
  const remove = (id: string, vol: string) => set(id, vol, 0)
  const changeVol = (id: string, from: string, to: string) => {
    if (from === to) return
    const line = find(id, from)
    if (!line) return
    const merged = (find(id, to)?.qty ?? 0) + line.qty
    lines.value = lines.value
      .filter((l) => !(l.id === id && l.vol === to))
      .map((l) => (l.id === id && l.vol === from ? { ...l, vol: to, qty: merged } : l))
  }
  const clear = () => {
    lines.value = []
  }

  const askPrice = (topic = '') => {
    priceModal.value = { open: true, topic }
  }

  // Вызывается один раз в оболочке: подтягивает сохранённое состояние и следит за изменениями.
  const persist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as SbSaved | null
      if (saved) {
        lines.value = Array.isArray(saved.lines) ? saved.lines.filter((l) => sbFind(l.id)) : []
        adult.value = !!saved.adult
        cookies.value = !!saved.cookies
        notice.value = saved.notice !== false
        view.value = saved.view === 'list' ? 'list' : 'grid'
      }
    } catch {
      /* localStorage может быть недоступен */
    }
    ready.value = true
    watch(
      [lines, adult, cookies, notice, view],
      () => {
        try {
          const value: SbSaved = {
            lines: lines.value,
            adult: adult.value,
            cookies: cookies.value,
            notice: notice.value,
            view: view.value,
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        } catch {
          /* ignore */
        }
      },
      { deep: true },
    )
  }

  return {
    lines,
    rows,
    count,
    packs,
    total,
    left,
    adult,
    cookies,
    notice,
    view,
    ready,
    priceModal,
    find,
    qtyOf,
    has,
    set,
    add,
    remove,
    changeVol,
    clear,
    askPrice,
    persist,
  }
}
