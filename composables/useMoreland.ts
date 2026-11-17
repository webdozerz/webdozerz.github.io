// Заявка концепта moreland: у оригинала корзины нет — опт от коробки по прайсу, заявки письмом на sale@moreland.ru.
// Поэтому «Заявка» — список коробок с готовым текстом для их формы «Написать нам» или почты. Хранится в localStorage.
import { mlById, mlLineSum, mlQtyWord, mlRub0 } from '~/utils/moreland'
import type { MlProduct } from '~/utils/moreland.data'

const KEY = 'ml-list-v1'

export const useMlList = () => {
  const list = useState<Record<number, number>>('ml-list', () => ({}))
  const loaded = useState('ml-list-loaded', () => false)
  const toast = useState<{ id: number; text: string } | null>('ml-toast', () => null)

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
        for (const [k, v] of Object.entries(raw)) if (mlById(Number(k)) && Number(v) > 0) clean[Number(k)] = Number(v)
        list.value = { ...clean, ...list.value }
      }
    } catch {}
  }

  const qty = (id: number) => list.value[id] ?? 0
  const set = (id: number, q: number) => {
    const n = { ...list.value }
    if (q > 0) n[id] = Math.min(999, Math.round(q))
    else delete n[id]
    list.value = n
    save()
  }
  const add = (p: MlProduct) => {
    const was = qty(p.id)
    set(p.id, was + 1)
    if (!was) toast.value = { id: Date.now(), text: p.n }
  }
  const clear = () => {
    list.value = {}
    save()
  }

  const rows = computed(() =>
    Object.entries(list.value)
      .map(([id, q]) => ({ p: mlById(Number(id))!, q }))
      .filter((r) => r.p),
  )
  const count = computed(() => rows.value.length)
  const total = computed(() => rows.value.reduce((s, r) => s + mlLineSum(r.p, r.q), 0))
  const unpriced = computed(() => rows.value.filter((r) => !r.p.price).length)

  const message = (org = '') => {
    const lines = ['Здравствуйте! Заявка на отгрузку:']
    rows.value.forEach((r, i) => {
      const s = mlLineSum(r.p, r.q)
      lines.push(`${i + 1}. ${r.p.n} — ${mlQtyWord(r.p, r.q)}${s ? ` — ${mlRub0(s)}` : ' — цену уточнить'}`)
    })
    if (total.value) lines.push(`Итого по ценам сайта: ${mlRub0(total.value)}${unpriced.value ? ' + позиции без цены' : ''}`)
    if (org.trim()) lines.push(`Организация: ${org.trim()}`)
    return lines.join('\n')
  }

  return { list, toast, persist, qty, set, add, clear, rows, count, total, unpriced, message }
}

export const useMlUi = () => ({
  // «Написать нам» — их попап; text — готовый текст заявки, если открыли из «Заявки»
  write: useState<{ open: boolean; text: string }>('ml-write', () => ({ open: false, text: '' })),
  menu: useState('ml-menu', () => false),
})
