const STORAGE_KEY = 'pl-concept-cart'

export interface PlForm {
  name: string
  phone: string
  email: string
  address: string
  comment: string
  method: 'courier' | 'pickup'
  office: number
  subscribe: boolean
}

export interface PlLine {
  product: PlProduct
  qty: number
  sum: number
  when: string
}

// Корзина концепта papinalavka: id товара -> количество, у каждой позиции своя дата (как select даты поставки у оригинала).
// Хранится только в браузере, заказ никуда не отправляется.
export const usePapinalavkaCart = () => {
  const items = useState<Record<string, number>>('pl-items', () => ({}))
  const dates = useState<Record<string, string>>('pl-dates', () => ({}))
  const city = useState<string>('pl-city', () => 'Воронеж')
  const cityAsked = useState<boolean>('pl-city-asked', () => false)
  const form = useState<PlForm>('pl-form', () => ({
    name: '',
    phone: '',
    email: '',
    address: '',
    comment: '',
    method: 'courier',
    office: 0,
    subscribe: false,
  }))

  // Варианты даты для позиции: товар под заказ — к своей поставке, из наличия — экспресс или к ближайшей поставке.
  const whenOptions = (p: PlProduct) => {
    if (!p.stock) return [p.next ? `к поставке ${plDay(p.next)}` : 'к ближайшей поставке']
    const next = plNextDelivery()
    return ['экспресс, через 2–3 часа', `вместе с поставкой ${plDay(next.date)}`]
  }
  const whenOf = (p: PlProduct) => {
    const opts = whenOptions(p)
    const v = dates.value[p.id]
    return v && opts.includes(v) ? v : opts[0]
  }
  const setWhen = (id: number, v: string) => {
    dates.value = { ...dates.value, [id]: v }
  }

  const lines = computed<PlLine[]>(() =>
    Object.entries(items.value).flatMap(([id, qty]) => {
      const product = plFind(id)
      if (!product) return []
      return [{ product, qty, sum: product.price * qty, when: whenOf(product) }]
    }),
  )
  const count = computed(() => lines.value.length)
  const total = computed(() => lines.value.reduce((s, l) => s + l.sum, 0))
  const hasWeight = computed(() => lines.value.some((l) => plByWeight(l.product)))
  const fee = computed(() => (form.value.method === 'pickup' ? 0 : plDeliveryFee(city.value, total.value)))
  const toFree = computed(() => Math.max(0, plFreeFrom - total.value))

  const qtyOf = (id: number) => items.value[id] ?? 0
  const set = (id: number, qty: number) => {
    const next = { ...items.value }
    if (qty > 0) next[id] = Math.min(99, qty)
    else delete next[id]
    items.value = next
  }
  const add = (id: number, qty = 1) => set(id, qtyOf(id) + qty)
  const clear = () => {
    items.value = {}
    dates.value = {}
  }

  const persist = () => {
    if (!import.meta.client) return
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      if (saved.items) items.value = saved.items
      if (saved.dates) dates.value = saved.dates
      if (saved.city) city.value = saved.city
      if (saved.cityAsked) cityAsked.value = saved.cityAsked
      if (saved.form) form.value = { ...form.value, ...saved.form }
    } catch {
      // повреждённое хранилище — начинаем с пустой корзины
    }
    watch(
      [items, dates, city, cityAsked, form],
      () => {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ items: items.value, dates: dates.value, city: city.value, cityAsked: cityAsked.value, form: form.value }),
          )
        } catch {
          // приватный режим — корзина живёт до перезагрузки
        }
      },
      { deep: true },
    )
  }

  // Текст заказа — то, что оператор получил бы из формы оригинала.
  const orderText = computed(() => {
    const f = form.value
    const rows = lines.value.map(
      (l, i) => `${i + 1}. ${l.product.name} — ${l.qty} ${plQtyUnit(l.product)} × ${plFmt(l.product.price)} = ${plFmt(l.sum)} (${l.when})`,
    )
    const how =
      f.method === 'pickup'
        ? `Самовывоз: ${plOffices[f.office].city}, ${plOffices[f.office].street}`
        : `Доставка: ${city.value}${f.address ? `, ${f.address}` : ''}`
    return [
      'Заказ в «Папиной лавке»',
      ...rows,
      `Итого за товары: ${plFmt(total.value)}`,
      how,
      f.name && `Имя: ${f.name}`,
      f.phone && `Телефон: ${f.phone}`,
      f.comment && `Комментарий: ${f.comment}`,
    ]
      .filter(Boolean)
      .join('\n')
  })

  return { items, city, cityAsked, form, lines, count, total, hasWeight, fee, toFree, qtyOf, set, add, clear, persist, whenOptions, whenOf, setWhen, orderText }
}

export const usePapinalavkaUi = () => {
  const menu = useState<boolean>('pl-menu', () => false)
  const toast = useState<string>('pl-toast', () => '')
  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (toast.value = ''), 2600)
  }
  return { menu, toast, say }
}
