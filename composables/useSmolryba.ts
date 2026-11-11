// Список заказа концепта smolryba: у оригинала корзины нет, заказ звонком по прайсу —
// поэтому «список» с готовым сообщением для MAX / Telegram / почты. Хранится в localStorage, никуда не отправляется.
import { SR_DATE, srItem, srLine, srQtyText, srRub0 } from '~/utils/smolryba'
import type { SrItem } from '~/utils/smolryba.data'

const KEY = 'sr-list-v1'

export const useSrList = () => {
  const list = useState<Record<number, number>>('sr-list', () => ({}))
  const loaded = useState('sr-list-loaded', () => false)
  const toast = useState<{ id: number; text: string; link?: boolean } | null>('sr-toast', () => null)

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
        for (const [k, v] of Object.entries(raw)) if (srItem(Number(k)) && Number(v) > 0) clean[Number(k)] = Number(v)
        list.value = { ...clean, ...list.value }
      }
    } catch {}
  }
  const say = (text: string, link = false) => (toast.value = { id: Date.now(), text, link })

  const qty = (id: number) => list.value[id] ?? 0
  const set = (id: number, q: number) => {
    const n = { ...list.value }
    if (q > 0) n[id] = Math.min(999, Math.round(q))
    else delete n[id]
    list.value = n
    save()
  }
  const add = (it: SrItem, q = 1) => {
    const was = qty(it.id)
    set(it.id, was + q)
    if (!was) say(`В списке: ${it.n}`, true)
  }
  const clear = () => {
    list.value = {}
    save()
  }

  const rows = computed(() =>
    Object.entries(list.value)
      .map(([id, q]) => ({ it: srItem(Number(id))!, q }))
      .filter((r) => r.it),
  )
  const count = computed(() => rows.value.length)
  const total = computed(() => {
    let sum = 0
    let approx = false
    for (const r of rows.value) {
      const l = srLine(r.it, r.q)
      sum += l.sum
      approx ||= l.approx
    }
    return { sum, approx }
  })

  const message = (f: { name?: string; phone?: string; mail?: string; ship?: string; comment?: string } = {}) => {
    const lines = [`Здравствуйте! Заявка по прайсу на ${SR_DATE}:`]
    rows.value.forEach((r, i) => {
      const l = srLine(r.it, r.q)
      lines.push(`${i + 1}. ${r.it.n} — ${srQtyText(r.it, r.q)} — ${l.approx ? '≈ ' : ''}${srRub0(l.sum)}`)
    })
    lines.push(`Итого ${total.value.approx ? '≈ ' : ''}${srRub0(total.value.sum)}`)
    if (f.ship) lines.push(`Доставка: ${f.ship}`)
    const who = [f.name, f.phone, f.mail].filter((x) => x && x.trim() && x.trim() !== '+7').join(', ')
    if (who) lines.push(`Контакт: ${who}`)
    if (f.comment?.trim()) lines.push(`Комментарий: ${f.comment.trim()}`)
    return lines.join('\n')
  }

  return { list, toast, persist, say, qty, set, add, clear, rows, count, total, message }
}

export const useSrUi = () => ({
  modal: useState<'call' | null>('sr-modal', () => null),
  menu: useState('sr-menu', () => false),
})
