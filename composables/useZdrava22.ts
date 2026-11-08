import { zdItem, zdItemPrice, zdKg, zdMoney, zdPath, zdPerKg, zdPlural, zdSort, zdTare } from '~/utils/zdrava22'
import type { ZdShot, ZdTier } from '~/utils/zdrava22'
const STORAGE_KEY = 'zd-concept-note'

export interface ZdForm {
  name: string
  phone: string
  city: string
  email: string
  message: string
}
export interface ZdLine {
  key: string
  title: string
  qty: number
  qtyText: string
  msgText: string
  hint: string
  perText: string
  sum: number
  step: number
  min: number
  to: string
  tone?: string
  img?: string
}

const emptyForm = (): ZdForm => ({ name: '', phone: '', city: '', email: '', message: '' })
const fmt = (n: number) => n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })

// «Что заказать» в форме заказа: корзины у оригинала нет, заказ — звонком, письмом или формой на «Контактах».
// Блок только помогает собрать текст заказа в формате самого сайта («мёд 2 коробки, перга 150 г…») и прикинуть сумму.
// Ключи: r:<сорт> — коробки, o:<сорт> — куботейнеры, i:<товар> — кг / флаконы / штуки. Хранится только в браузере.
export const useZdNote = () => {
  const items = useState<Record<string, number>>('zd-note', () => ({}))
  const form = useState<ZdForm>('zd-form', emptyForm)
  const done = useState<{ id: number; name: string; sum: number } | null>('zd-done', () => null)
  const loaded = useState('zd-loaded', () => false)

  const lines = computed<ZdLine[]>(() =>
    Object.entries(items.value).flatMap(([key, qty]) => {
      const [kind, id] = key.split(':')
      if (kind === 'r' || kind === 'o') {
        const s = zdSort(id)
        if (!s) return []
        const t = zdTare[kind]
        const per = zdPerKg(s, kind, qty)
        const kg = qty * t.kg
        const next = t.from - qty
        return [
          {
            key,
            title: `${s.title} — ${kind === 'r' ? 'розница' : 'опт'}`,
            qty,
            qtyText: `${qty} × ${t.kg} кг`,
            msgText: `${qty} ${zdPlural(qty, t.units)} (${zdKg(kg)})`,
            hint: next > 0 ? `ещё ${next} ${zdPlural(next, t.units)} — и ${zdMoney(s[kind][1])}/кг` : `цена ${t.fromText}`,
            perText: `${zdMoney(per)}/кг`,
            sum: per * kg,
            step: 1,
            min: 1,
            to: zdPath(`/produkt/${s.id}`),
            tone: s.tone,
          },
        ]
      }
      const it = zdItem(id)
      if (!it) return []
      const per = zdItemPrice(it, qty)
      const unitText = it.unit === 'кг' ? (qty < 1 ? `${Math.round(qty * 1000)} г` : zdKg(qty)) : `${fmt(qty)} ${it.unit === 'флакон' ? zdPlural(qty, ['флакон', 'флакона', 'флаконов']) : 'шт'}`
      const left = it.bulk ? it.bulk.from - qty : 0
      return [
        {
          key,
          title: it.name,
          qty,
          qtyText: unitText,
          msgText: unitText,
          hint: it.bulk ? (left > 0 ? `от ${it.bulk.from} кг — ${zdMoney(it.bulk.price)}/кг` : `цена от ${it.bulk.from} кг`) : '',
          perText: `${zdMoney(per)}/${it.unit === 'флакон' ? 'флакон' : it.unit}`,
          sum: per * qty,
          step: it.step,
          min: it.min,
          to: zdPath(`/produkt/${it.id}`),
          img: it.img,
        },
      ]
    }),
  )

  const count = computed(() => lines.value.length)
  const total = computed(() => lines.value.reduce((n, l) => n + l.sum, 0))
  // Текст заказа — как в примере на странице «Контакты» оригинала
  const text = computed(() => {
    const parts = lines.value.map((l) => `${l.title.replace(' — розница', ' в розницу').replace(' — опт', ' в куботейнерах')} — ${l.msgText}`)
    const city = form.value.city.trim()
    return [parts.join('; '), city ? `Город: ${city}` : ''].filter(Boolean).join('. ')
  })

  const qtyOf = (key: string) => items.value[key] ?? 0
  const setQty = (key: string, qty: number) => {
    const next = { ...items.value }
    const n = Math.max(0, Math.min(999, Math.round(qty * 100) / 100))
    if (n > 0) next[key] = n
    else delete next[key]
    items.value = next
  }
  const minOf = (key: string) => {
    const [kind, id] = key.split(':')
    return kind === 'i' ? zdItem(id)?.min ?? 1 : 1
  }
  const stepOf = (key: string) => {
    const [kind, id] = key.split(':')
    return kind === 'i' ? zdItem(id)?.step ?? 1 : 1
  }
  const add = (key: string) => {
    if (!qtyOf(key)) setQty(key, minOf(key))
  }
  const bump = (key: string, dir: 1 | -1) => {
    const q = qtyOf(key) + dir * stepOf(key)
    setQty(key, q < minOf(key) - 1e-9 ? 0 : q)
  }
  const remove = (key: string) => setQty(key, 0)
  const clear = () => {
    items.value = {}
  }

  const submit = () => {
    done.value = { id: 600 + Math.floor(Math.random() * 300), name: form.value.name.trim(), sum: total.value }
    clear()
    form.value = { ...form.value, message: '' }
  }

  // Загрузка из localStorage — один раз: её зовут и оболочка, и «Контакты» перед разбором ?z=
  // (onMounted страницы срабатывает раньше оболочки, и поздняя загрузка затирала добавленный товар)
  const persist = () => {
    if (loaded.value) return
    loaded.value = true
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved?.items) items.value = saved.items
      if (saved?.form) form.value = { ...emptyForm(), ...saved.form }
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

  return { items, form, done, lines, count, total, text, qtyOf, setQty, add, bump, remove, clear, submit, persist }
}

// Оболочка: розница/опт, меню, лайтбокс, видео, всплывающие подсказки
export const useZdUi = () => {
  const tier = useState<ZdTier>('zd-tier', () => 'r')
  const menu = useState('zd-menu', () => false)
  const gallery = useState<{ items: ZdShot[]; index: number; title: string } | null>('zd-gallery', () => null)
  const video = useState<{ title: string; src: string } | null>('zd-video', () => null)
  const toast = useState<string>('zd-toast', () => '')
  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (t: string) => {
    toast.value = t
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => (toast.value = ''), 4200)
  }
  const open = (items: ZdShot[], index = 0, title = '') => {
    gallery.value = { items, index, title }
  }
  return { tier, menu, gallery, video, toast, say, open }
}
