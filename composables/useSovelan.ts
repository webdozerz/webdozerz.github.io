// Заявка концепта sovelan: у оригинала корзина basket.php без цен — фото, название, раздел, «N шт.», вес позиции и общий вес,
// оформление «телефон + ИП или ООО». Здесь то же самое, хранится в localStorage; отправка — демо.
import { svById } from '~/utils/sovelan'
import type { SvProduct } from '~/utils/sovelan.data'

const KEY = 'sv-order-v1'

export const useSvOrder = () => {
  const list = useState<Record<number, number>>('sv-order', () => ({}))
  const loaded = useState('sv-order-loaded', () => false)
  const toast = useState<{ id: number; text: string } | null>('sv-toast', () => null)

  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(list.value))
    } catch {}
  }
  const persist = () => {
    if (loaded.value || !import.meta.client) return
    loaded.value = true
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '{}')
      if (raw && typeof raw === 'object') {
        const clean: Record<number, number> = {}
        for (const [k, v] of Object.entries(raw)) if (svById(Number(k)) && Number(v) > 0) clean[Number(k)] = Number(v)
        list.value = { ...clean, ...list.value }
      }
    } catch {}
  }

  const qty = (id: number) => list.value[id] ?? 0
  // как у оригинала: от 1 до 9999 шт.
  const set = (id: number, q: number) => {
    const n = { ...list.value }
    if (q > 0) n[id] = Math.min(9999, Math.round(q))
    else delete n[id]
    list.value = n
    save()
  }
  const add = (p: SvProduct, q = 1) => {
    const was = qty(p.id)
    set(p.id, was + q)
    toast.value = { id: Date.now(), text: p.t }
  }
  const clear = () => {
    list.value = {}
    save()
  }

  const rows = computed(() =>
    Object.entries(list.value)
      .map(([id, q]) => ({ p: svById(Number(id))!, q }))
      .filter((r) => r.p),
  )
  const count = computed(() => rows.value.length)
  const pcs = computed(() => rows.value.reduce((s, r) => s + r.q, 0))
  const grams = computed(() => rows.value.reduce((s, r) => s + r.q * r.p.w, 0))

  return { list, toast, persist, qty, set, add, clear, rows, count, pcs, grams }
}

export const useSvUi = () => ({
  menu: useState('sv-menu', () => false),
  retail: useState('sv-retail', () => false),
  cats: useState('sv-cats', () => false),
})

// Килограммы для шапки и итога: «12,4 кг»
export const svKg = (g: number) => `${(g / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: g % 1000 && g < 100000 ? 1 : 0 })} кг`
