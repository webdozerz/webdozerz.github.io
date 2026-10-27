const STORAGE_KEY = 'mf-concept-request'

export interface MfForm {
  company: string
  name: string
  phone: string
  email: string
  region: string
  city: string
  comment: string
  fullPrice: boolean
}

export interface MfLine {
  product: MfProduct
  qty: number
  pack: string
  unit: string
}

// Заявка концепта mrkfish: id позиции -> количество и выбранная фасовка.
// Цен и корзины у оригинала нет — прайс высылают по заявке, поэтому отмеченные позиции превращаются в готовый текст
// запроса в отдел продаж. Хранится только в браузере, никуда не отправляется.
export const useMrkfishRequest = () => {
  const items = useState<Record<string, number>>('mf-items', () => ({}))
  const packs = useState<Record<string, string>>('mf-packs', () => ({}))
  const form = useState<MfForm>('mf-form', () => ({
    company: '',
    name: '',
    phone: '',
    email: '',
    region: mfRegions[0],
    city: '',
    comment: '',
    fullPrice: true,
  }))

  const packOf = (p: MfProduct) => packs.value[p.id] ?? p.packs[0] ?? ''
  const setPack = (id: string, pack: string) => {
    packs.value = { ...packs.value, [id]: pack }
  }

  const lines = computed<MfLine[]>(() =>
    Object.entries(items.value).flatMap(([id, qty]) => {
      const product = mfFind(id)
      if (!product) return []
      return [{ product, qty, pack: packOf(product), unit: mfUnit(product) }]
    }),
  )
  // Порядок разделов как в каталоге — так заявку удобнее собирать на складе.
  const groups = computed(() =>
    mfSections
      .map((s) => ({ section: s, lines: lines.value.filter((l) => l.product.section === s.id) }))
      .filter((g) => g.lines.length),
  )
  const count = computed(() => lines.value.length)

  const qtyOf = (id: string) => items.value[id] ?? 0
  const setQty = (id: string, qty: number) => {
    const next = { ...items.value }
    const n = Math.floor(Number(qty) || 0)
    if (n <= 0) delete next[id]
    else next[id] = Math.min(n, 9999)
    items.value = next
  }
  const add = (id: string) => setQty(id, qtyOf(id) + 1)
  const remove = (id: string) => setQty(id, qtyOf(id) - 1)
  const clear = () => {
    items.value = {}
  }

  const text = computed(() => mfLetter(groups.value, form.value))

  // Вызывается один раз в оболочке: подтягивает сохранённое и следит за изменениями.
  const persist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved?.items) items.value = saved.items
      if (saved?.packs) packs.value = saved.packs
      if (saved?.form) form.value = { ...form.value, ...saved.form }
    } catch {
      /* localStorage может быть недоступен */
    }
    watch(
      [items, packs, form],
      () => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: items.value, packs: packs.value, form: form.value }))
        } catch {
          /* ignore */
        }
      },
      { deep: true },
    )
  }

  return { items, form, lines, groups, count, text, packOf, setPack, qtyOf, setQty, add, remove, clear, persist }
}

// Текст заявки — как её написал бы закупщик: разделы, позиции с фасовкой и объёмом, куда везти.
export const mfLetter = (groups: { section: MfSection; lines: MfLine[] }[], form: MfForm) => {
  const out = ['Здравствуйте! Прошу оптовые цены и наличие на позиции:']
  groups.forEach((g) => {
    out.push('', `${g.section.title}:`)
    g.lines.forEach((l) => {
      const pack = l.pack ? `, фасовка ${l.pack}` : ''
      out.push(`— ${mfTitle(l.product)}${pack} — ${l.qty} ${l.unit}`)
    })
  })
  if (form.fullPrice) out.push('', 'И пришлите, пожалуйста, полный прайс-лист.')
  const region = form.region.startsWith('Другой') ? '' : form.region
  const where = [form.city, region].filter(Boolean).join(', ')
  out.push('', `Доставка: ${where || 'уточню'}`)
  if (form.company) out.push(`Покупатель: ${form.company}`)
  if (form.name) out.push(`Контактное лицо: ${form.name}`)
  if (form.phone) out.push(`Телефон: ${form.phone}`)
  if (form.email) out.push(`Почта для прайса: ${form.email}`)
  if (form.comment) out.push(`Комментарий: ${form.comment}`)
  return out.join('\n')
}

export type MfModal = 'call' | 'price' | null

export const useMrkfishUi = () => {
  const toast = useState<string | null>('mf-toast', () => null)
  const modal = useState<MfModal>('mf-modal', () => null)
  const menu = useState('mf-menu', () => false)
  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (toast.value = null), 3800)
  }
  return { toast, modal, menu, say }
}
