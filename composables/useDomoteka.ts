// Состояние концепта domoteka: избранное и сравнение (как у оригинала, но в localStorage), окна и тост.
import { dmPath } from '~/utils/domoteka'

const KEY = 'dm-concept-v1'

interface DmStore {
  fav: string[]
  cmp: string[]
}

export const useDmStore = () => {
  const fav = useState<string[]>('dm-fav', () => [])
  const cmp = useState<string[]>('dm-cmp', () => [])
  const loaded = useState('dm-loaded', () => false)
  const toast = useState<{ id: number; text: string; link?: string; linkText?: string } | null>('dm-toast', () => null)

  const save = () => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(KEY, JSON.stringify({ fav: fav.value, cmp: cmp.value } satisfies DmStore))
    } catch {}
  }
  // Загрузка один раз: страница может позвать раньше оболочки
  const persist = () => {
    if (!import.meta.client || loaded.value) return
    loaded.value = true
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || '{}') as Partial<DmStore>
      if (Array.isArray(s.fav)) fav.value = s.fav
      if (Array.isArray(s.cmp)) cmp.value = s.cmp
    } catch {}
  }
  const say = (text: string, link?: string, linkText?: string) => (toast.value = { id: Date.now(), text, link, linkText })

  const toggle = (list: typeof fav, id: string, on: string, off: string, link: string, linkText: string) => {
    if (list.value.includes(id)) {
      list.value = list.value.filter((x) => x !== id)
      say(off)
    } else {
      list.value = [...list.value, id]
      say(on, link, linkText)
    }
    save()
  }
  const toggleFav = (id: string, name: string) =>
    toggle(fav, id, `${name} — в избранном`, `${name} — убран из избранного`, dmPath('/izbrannoe/'), 'Открыть')
  const toggleCmp = (id: string, name: string) =>
    toggle(cmp, id, `${name} — в сравнении`, `${name} — убран из сравнения`, dmPath('/sravnenie/'), 'Сравнить')
  const clear = (which: 'fav' | 'cmp') => {
    if (which === 'fav') fav.value = []
    else cmp.value = []
    save()
  }
  return { fav, cmp, toast, persist, toggleFav, toggleCmp, clear, say }
}

export const useDmUi = () => ({
  menu: useState('dm-menu', () => false),
  search: useState('dm-search', () => false),
  modal: useState<'' | 'ask' | 'feedback' | 'login' | 'forgot' | 'filters'>('dm-modal', () => ''),
  city: useState('dm-city', () => 'Москва'),
})
