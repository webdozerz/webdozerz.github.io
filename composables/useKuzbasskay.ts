// Общее состояние концепта kuzbasskay: мобильное меню, лист телефонов, лайтбокс, тост, согласие с cookie.
// Корзины и заказа у оригинала нет — их нет и здесь; «Узнать цену» ведёт в отдел продаж звонком или письмом.
export interface KzShot {
  img: string
  cap?: string
}
export interface KzGalleryState {
  title: string
  items: KzShot[]
  index: number
}

export const useKzUi = () => {
  const menu = useState('kz-menu', () => false)
  const call = useState('kz-call', () => false)
  const gallery = useState<KzGalleryState | null>('kz-gallery', () => null)
  const toast = useState<string>('kz-toast', () => '')
  const cookie = useState<boolean>('kz-cookie', () => true) // true — плашка скрыта (до проверки в браузере)

  let timer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => (toast.value = ''), 3200)
  }
  const open = (title: string, items: KzShot[], index = 0) => {
    gallery.value = { title, items, index }
  }

  const COOKIE_KEY = 'kz-concept-cookie'
  const readCookie = () => {
    try {
      cookie.value = localStorage.getItem(COOKIE_KEY) === '1'
    } catch {
      cookie.value = false
    }
  }
  const acceptCookie = () => {
    cookie.value = true
    try {
      localStorage.setItem(COOKIE_KEY, '1')
    } catch {
      /* приватный режим — плашка просто закроется до перезагрузки */
    }
  }

  return { menu, call, gallery, toast, cookie, say, open, readCookie, acceptCookie }
}
