const STORAGE_KEY = 'pk-concept-list'

export interface PkForm {
  company: string
  phone: string
  way: 'delivery' | 'pickup'
  address: string
  comment: string
}

// Список концепта 24produkt: id позиции -> количество, тариф цен и данные для заявки.
// Корзины у оригинала нет — заказ принимают по телефону, поэтому список превращается в готовый текст заявки.
// Хранится только в браузере, никуда не отправляется.
export const useProdukt24List = () => {
  const items = useState<Record<string, number>>('pk-items', () => ({}))
  const tier = useState<PkTier>('pk-tier', () => 'retail')
  const form = useState<PkForm>('pk-form', () => ({ company: '', phone: '', way: 'delivery', address: '', comment: '' }))

  const lines = computed(() =>
    Object.entries(items.value).flatMap(([id, qty]) => {
      const product = pkFind(id)
      if (!product) return []
      const price = product.prices[tier.value]
      const per = pkWeightPer(product)
      return [{ product, qty, price, sum: Math.round(price * qty * 100) / 100, weight: per * qty }]
    }),
  )
  const count = computed(() => lines.value.length)
  const total = computed(() => lines.value.reduce((n, l) => n + l.sum, 0))
  const weight = computed(() => lines.value.reduce((n, l) => n + l.weight, 0))
  const noWeight = computed(() => lines.value.filter((l) => !l.weight).length)

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

  const text = computed(() => pkLetter(lines.value, tier.value, form.value, weight.value))

  // Вызывается один раз в оболочке: подтягивает сохранённое и следит за изменениями.
  const persist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved?.items) items.value = saved.items
      if (saved?.tier) tier.value = saved.tier
      if (saved?.form) form.value = { ...form.value, ...saved.form }
    } catch {
      /* localStorage может быть недоступен */
    }
    watch(
      [items, tier, form],
      () => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: items.value, tier: tier.value, form: form.value }))
        } catch {
          /* ignore */
        }
      },
      { deep: true },
    )
  }

  return { items, tier, form, lines, count, total, weight, noWeight, text, qtyOf, setQty, add, remove, clear, persist }
}

export interface PkLine {
  product: PkProduct
  qty: number
  price: number
  sum: number
  weight: number
}

// Текст заявки — так, как её продиктовали бы менеджеру: позиция, количество, цена, сумма.
export const pkLetter = (lines: PkLine[], tier: PkTier, form: PkForm, weight: number) => {
  const t = pkTier(tier)
  const rows = lines.map(
    (l, i) => `${i + 1}. ${l.product.name} — ${l.qty} ${pkUnitLabel(l.product.unit)} × ${pkMoney(l.price)} = ${pkMoney(l.sum)}`,
  )
  const total = lines.reduce((n, l) => n + l.sum, 0)
  const out = [
    'Здравствуйте! Заявка с сайта 24produkt.ru',
    `Цены: ${t.label.toLowerCase()} (${t.note})`,
    '',
    ...rows,
    '',
    `Итого: ${pkMoney(total)}${weight ? `, вес около ${pkKg(weight)}` : ''}`,
    form.way === 'pickup' ? 'Самовывоз со склада, Северное шоссе, 5г' : `Доставка: ${form.address || 'адрес уточню'}`,
  ]
  if (form.company) out.push(`Покупатель: ${form.company}`)
  if (form.phone) out.push(`Телефон: ${form.phone}`)
  if (form.comment) out.push(`Комментарий: ${form.comment}`)
  return out.join('\n')
}

export const useProdukt24Ui = () => {
  const toast = useState<string | null>('pk-toast', () => null)
  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (toast.value = null), 3600)
  }
  return { toast, say }
}
