const STORAGE_KEY = 'ak-concept-list'

export interface AkForm {
  kind: string
  name: string
  phone: string
  email: string
  way: 'delivery' | 'pickup'
  address: string
  comment: string
}

export interface AkLine {
  item: AkItem
  packs: number
  pcs: number
  sum: number
}

// Список заказа концепта «ИП Аксюченко»: id позиции -> число упаковок.
// Корзины у оригинала нет — заказывают по телефону и почте, поэтому список превращается в готовое письмо на их почту.
// Хранится только в браузере, никуда не отправляется.
export const useAks124List = () => {
  const items = useState<Record<string, number>>('ak-items', () => ({}))
  const form = useState<AkForm>('ak-form', () => ({
    kind: 'Розничный магазин',
    name: '',
    phone: '',
    email: '',
    way: 'delivery',
    address: '',
    comment: '',
  }))

  const lines = computed<AkLine[]>(() =>
    Object.entries(items.value).flatMap(([id, packs]) => {
      const item = akFind(id)
      if (!item) return []
      const pcs = packs * (item.pack || 1)
      return [{ item, packs, pcs, sum: item.price ? Math.round(item.price * pcs * 100) / 100 : 0 }]
    }),
  )
  const count = computed(() => lines.value.length)
  const total = computed(() => lines.value.reduce((n, l) => n + l.sum, 0))
  const unknown = computed(() => lines.value.filter((l) => !l.item.price).length)
  // Сколько не хватает до бесплатной доставки по Красноярску
  const toFree = computed(() => Math.max(0, akFreeFrom - total.value))

  const qtyOf = (id: string) => items.value[id] ?? 0
  const setQty = (id: string, packs: number) => {
    const next = { ...items.value }
    const n = Math.floor(Number(packs) || 0)
    if (n <= 0) delete next[id]
    else next[id] = Math.min(n, 9999)
    items.value = next
  }
  const add = (it: AkItem) => setQty(it.id, qtyOf(it.id) + 1)
  const sub = (it: AkItem) => setQty(it.id, qtyOf(it.id) - 1)
  const clear = () => {
    items.value = {}
  }

  const text = computed(() => akLetter(lines.value, form.value, total.value))

  // Вызывается один раз в оболочке: подтягивает сохранённое и следит за изменениями.
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

  return { items, form, lines, count, total, unknown, toFree, text, qtyOf, setQty, add, sub, clear, persist }
}

// Письмо так, как его написал бы закупщик: позиция, упаковки и штуки, цена за штуку, сумма.
export const akLetter = (lines: AkLine[], form: AkForm, total: number) => {
  const rows = lines.map((l, i) => {
    const it = l.item
    const brand = akBrand(it.brand)
    const head = `${i + 1}. ${it.name}${brand ? ` (${brand.title})` : ''} — ${it.pack ? akPacks(l.packs) : `${l.packs} ${it.per}`}${it.pack ? `, ${l.pcs} ${it.per}` : ''}`
    if (!it.price) return `${head} (цену уточните)`
    return `${head} × ${akMoney(it.price)} = ${akMoney(l.sum)}`
  })
  const out = [
    'Здравствуйте! Хочу заказать по ценам с сайта:',
    '',
    ...rows,
    '',
    `Итого по базовым ценам: ${akMoney(total)}`,
    form.way === 'pickup' ? `Заберу со склада: ${akContacts.address}` : `Доставка: ${form.address || 'адрес уточню'}`,
    `Вид деятельности: ${form.kind}`,
  ]
  if (form.name) out.push(`Имя / организация: ${form.name}`)
  if (form.phone) out.push(`Телефон: ${form.phone}`)
  if (form.email) out.push(`E-mail: ${form.email}`)
  if (form.comment) out.push(`Комментарий: ${form.comment}`)
  return out.join('\n')
}

export const useAks124Ui = () => {
  const toast = useState<string | null>('ak-toast', () => null)
  const photo = useState<{ img: string; title: string } | null>('ak-photo', () => null)
  const menu = useState<boolean>('ak-menu', () => false)
  // Окна: обратный звонок, консультант, вход
  const modal = useState<'call' | 'chat' | 'login' | null>('ak-modal', () => null)
  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (toast.value = null), 3600)
  }
  return { toast, photo, menu, modal, say }
}
