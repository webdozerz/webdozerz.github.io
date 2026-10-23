const STORAGE_KEY = 'lf-concept-cart'

export interface LfForm {
  name: string
  phone: string
  whatsapp: string
  address: string
  zone: string
  lift: boolean
  comment: string
  promo: string
  agree: boolean
}

export interface LfLine {
  key: string
  product: LfProduct
  variant: LfVariant
  qty: number
  unitPrice: number
  est: LfEstimate
  batch: LfBatchId
}

const emptyForm = (): LfForm => ({
  name: '',
  phone: '',
  whatsapp: '',
  address: '',
  zone: 'city',
  lift: false,
  comment: '',
  promo: '',
  agree: false,
})

// Заказ концепта «Лавка Fish»: «товар:вариант» -> количество, город и данные оформления.
// Хранится только в браузере, никуда не отправляется.
export const useLavkafishCart = () => {
  const items = useState<Record<string, number>>('lf-items', () => ({}))
  const city = useState<LfCity>('lf-city', () => 'tomsk')
  const form = useState<LfForm>('lf-form', emptyForm)

  const lines = computed<LfLine[]>(() =>
    Object.entries(items.value).flatMap(([key, qty]) => {
      const [pid, vid] = key.split(':')
      const product = lfFindProduct(pid)
      const variant = product?.variants.find((v) => v.id === vid)
      const batch = product?.batch[city.value]
      if (!product || !variant || !batch) return []
      return [
        {
          key,
          product,
          variant,
          qty,
          unitPrice: lfUnitPrice(variant, qty),
          est: lfEstimate(variant, qty),
          batch,
        },
      ]
    }),
  )
  // Товары, которые не возим в выбранный город, остаются в корзине, но не считаются.
  const hidden = computed(() => Object.keys(items.value).length - lines.value.length)

  const count = computed(() => lines.value.length)
  const total = computed(() => {
    const min = lines.value.reduce((n, l) => n + l.est.min, 0)
    const max = lines.value.some((l) => l.est.max === null) ? null : lines.value.reduce((n, l) => n + (l.est.max ?? 0), 0)
    return { min, max }
  })
  const prepay = computed(() => lines.value.reduce((n, l) => n + l.est.prepay, 0))
  // Вторник раньше четверга — по порядку дней, а не по алфавиту.
  const batches = computed(() => (['tue', 'thu'] as LfBatchId[]).filter((id) => lines.value.some((l) => l.batch === id)))

  const zone = computed(() => lfZones[city.value].find((z) => z.id === form.value.zone) ?? lfZones[city.value][0])
  // Доставка платится за каждый привоз отдельно.
  const delivery = computed(() => (zone.value.price + (form.value.lift ? lfLift : 0)) * batches.value.length)

  const keyOf = (pid: string, vid: string) => `${pid}:${vid}`
  const qtyOf = (pid: string, vid: string) => items.value[keyOf(pid, vid)] ?? 0
  const setQty = (pid: string, vid: string, qty: number) => {
    const variant = lfFindProduct(pid)?.variants.find((v) => v.id === vid)
    const limit = variant?.left ?? 30
    const next = { ...items.value }
    if (qty <= 0) delete next[keyOf(pid, vid)]
    else next[keyOf(pid, vid)] = Math.min(qty, limit)
    items.value = next
  }
  const add = (pid: string, vid: string) => setQty(pid, vid, qtyOf(pid, vid) + 1)
  const remove = (pid: string, vid: string) => setQty(pid, vid, qtyOf(pid, vid) - 1)
  const clear = () => {
    items.value = {}
  }

  watch(city, () => {
    form.value.zone = 'city'
  })

  // Вызывается один раз в оболочке: подтягивает сохранённое и следит за изменениями.
  const persist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved?.items) items.value = saved.items
      if (saved?.city === 'tomsk' || saved?.city === 'nsk') city.value = saved.city
      if (saved?.form) form.value = { ...form.value, ...saved.form, agree: false }
    } catch {
      /* localStorage может быть недоступен */
    }
    watch(
      [items, city, form],
      () => {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              items: items.value,
              city: city.value,
              form: form.value,
            }),
          )
        } catch {
          /* ignore */
        }
      },
      { deep: true },
    )
  }

  return {
    items,
    city,
    form,
    lines,
    hidden,
    count,
    total,
    prepay,
    batches,
    zone,
    delivery,
    qtyOf,
    setQty,
    add,
    remove,
    clear,
    persist,
  }
}

// Шторка товара, меню, окно «запросить прайс», подсказки — общие для всех страниц концепта.
export const useLavkafishUi = () => {
  const product = useState<string | null>('lf-product', () => null)
  const menuOpen = useState('lf-menu', () => false)
  const request = useState<string | null>('lf-request', () => null)
  const toast = useState<string | null>('lf-toast', () => null)
  // Даты привоза считаем в браузере: страница собирается заранее.
  const now = useState('lf-now', () => new Date('2026-10-23T12:00:00+07:00').getTime())

  const batch = (id: LfBatchId) => lfBatchDate(id, new Date(now.value))

  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (toast.value = null), 3600)
  }

  return { product, menuOpen, request, toast, now, batch, say }
}
