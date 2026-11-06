// Состояние интерфейса концепта mpkchita: меню, поиск, окна «Обратный звонок» и «Консультант», список сравнения.
// Корзины нет — как у оригинала: продукцию покупают в магазинах «Маккавеевский». Сравнение — их функция OpenCart,
// здесь оно сравнивает состав, срок годности и фасовку (цен у оригинала нет).
export const useMpkchitaUi = () => {
  const menu = useState('mk-menu', () => false)
  const search = useState('mk-search', () => false)
  const callback = useState('mk-callback', () => false)
  const chat = useState('mk-chat', () => false)
  const compare = useState<string[]>('mk-compare', () => [])
  const now = useState('mk-now', () => mkChitaNow())
  const toast = useState('mk-toast', () => '')

  const save = () => {
    try {
      localStorage.setItem('mk-compare', JSON.stringify(compare.value))
    } catch {
      /* приватный режим — список просто не сохранится */
    }
  }
  const restore = () => {
    try {
      const v = JSON.parse(localStorage.getItem('mk-compare') || '[]')
      if (Array.isArray(v)) compare.value = v.filter((id) => typeof id === 'string' && mkProduct(id)).slice(0, 4)
    } catch {
      /* нет доступа к хранилищу */
    }
  }
  let toastTimer: ReturnType<typeof setTimeout> | undefined
  const say = (text: string) => {
    toast.value = text
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => (toast.value = ''), 2600)
  }
  const inCompare = (id: string) => compare.value.includes(id)
  const toggleCompare = (id: string) => {
    if (inCompare(id)) {
      compare.value = compare.value.filter((x) => x !== id)
      say('Убрали из сравнения')
    } else if (compare.value.length >= 4) {
      say('В сравнении уже 4 продукта — уберите один')
      return
    } else {
      compare.value = [...compare.value, id]
      say('Добавили в сравнение · ' + compare.value.length + ' из 4')
    }
    save()
  }
  const clearCompare = () => {
    compare.value = []
    save()
  }
  const closeAll = () => {
    menu.value = false
    search.value = false
  }
  const tick = () => (now.value = mkChitaNow())
  return { menu, search, callback, chat, compare, now, toast, say, restore, inCompare, toggleCompare, clearCompare, closeAll, tick }
}
