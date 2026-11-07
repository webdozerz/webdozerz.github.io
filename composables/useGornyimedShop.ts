const STORAGE_KEY = 'gm-concept-shop'

export interface GmForm {
  name: string
  email: string
  phone: string
  address: string
  comment: string
}

export interface GmLine {
  key: string
  kind: 'jar' | 'bulk'
  title: string
  sub: string
  img: string
  cube: number | null
  qty: number
  unit: number | null
  sum: number | null
  to: string
}

const emptyForm = (): GmForm => ({ name: '', email: '', phone: '', address: '', comment: '' })

// Корзина концепта «Пасеки Соловьёвых»: банки штуками (p:<id>) и куботейнеры (b:<id>).
// Как у оригинала — количество, «удалить», заказ без регистрации. Хранится только в браузере.
export const useGornyimedShop = () => {
  const items = useState<Record<string, number>>('gm-items', () => ({}))
  const form = useState<GmForm>('gm-form', emptyForm)
  const done = useState<{ id: number; total: number; count: number; name: string } | null>('gm-done', () => null)

  const lines = computed<GmLine[]>(() =>
    Object.entries(items.value).flatMap(([key, qty]) => {
      const [kind, id] = key.split(':')
      if (kind === 'p') {
        const p = gmProduct(id)
        if (!p) return []
        return [{ key, kind: 'jar' as const, title: `${gmSort(p.sort)?.title} · ${p.pack}`, sub: p.tara, img: p.img, cube: null, qty, unit: p.price, sum: p.price * qty, to: gmPath(`/product/${p.id}`) }]
      }
      const b = gmBulkOf(id)
      if (!b) return []
      const unit = b.cube && b.perKg ? b.cube * b.perKg : null
      const sub = b.cube && b.perKg ? `куботейнер ${b.cube} кг × ${gmMoney(b.perKg)}/кг` : 'куботейнер, вес и цену подтвердим'
      return [{ key, kind: 'bulk' as const, title: `Опт: ${b.title}`, sub, img: '', cube: b.cube, qty, unit, sum: unit ? unit * qty : null, to: gmPath(`/opt#${b.id}`) }]
    }),
  )

  const count = computed(() => lines.value.reduce((n, l) => n + l.qty, 0))
  const total = computed(() => lines.value.reduce((n, l) => n + (l.sum ?? 0), 0))
  const hasUnpriced = computed(() => lines.value.some((l) => l.sum === null))
  const jars = computed(() => lines.value.filter((l) => l.kind === 'jar'))
  const bulk = computed(() => lines.value.filter((l) => l.kind === 'bulk'))

  const qtyOf = (key: string) => items.value[key] ?? 0
  const setQty = (key: string, qty: number) => {
    const next = { ...items.value }
    const n = Math.max(0, Math.min(999, Math.round(qty) || 0))
    if (n) next[key] = n
    else delete next[key]
    items.value = next
  }
  const add = (key: string, n = 1) => setQty(key, qtyOf(key) + n)
  const remove = (key: string) => setQty(key, 0)
  const clear = () => {
    items.value = {}
  }

  const submit = () => {
    done.value = { id: 2000 + Math.floor(Math.random() * 900), total: total.value, count: count.value, name: form.value.name }
    clear()
    form.value = { ...form.value, comment: '' }
  }

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

  return { items, form, done, lines, jars, bulk, count, total, hasUnpriced, qtyOf, setQty, add, remove, clear, submit, persist }
}

// Окна и меню оболочки
export const useGornyimedUi = () => {
  const callback = useState('gm-callback', () => false)
  const menu = useState('gm-menu', () => false)
  const gallery = useState<{ items: { src: string; cap?: string }[]; index: number } | null>('gm-gallery', () => null)
  const toast = useState<string>('gm-toast', () => '')
  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => (toast.value = ''), 4500)
  }
  const open = (items: { src: string; cap?: string }[], index = 0) => {
    gallery.value = { items, index }
  }
  return { callback, menu, gallery, toast, say, open }
}
