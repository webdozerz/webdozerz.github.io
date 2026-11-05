// Состояние интерфейса концепта zolotieluga: выезжающее меню, поиск, выбор города для «Где купить».
// Город запоминается в localStorage — покупатель выбирает его один раз, и карточки сразу показывают его магазины.
// Корзины нет: у оригинала продукцию покупают в магазинах-партнёрах, а оптовики — через отдел продаж.
export const useZolotielugaUi = () => {
  const menu = useState('zl-menu', () => false)
  const search = useState('zl-search', () => false)
  const cityPicker = useState('zl-city-picker', () => false)
  const city = useState('zl-city', () => 0)

  const setCity = (i: number) => {
    city.value = i
    cityPicker.value = false
    try {
      localStorage.setItem('zl-city', String(i))
    } catch {
      /* приватный режим — город просто не запомнится */
    }
  }
  const restoreCity = () => {
    try {
      const v = Number(localStorage.getItem('zl-city'))
      if (Number.isInteger(v) && v >= 0 && v < zlCities.length) city.value = v
    } catch {
      /* нет доступа к хранилищу */
    }
  }
  const closeAll = () => {
    menu.value = false
    search.value = false
    cityPicker.value = false
  }
  return { menu, search, cityPicker, city, setCity, restoreCity, closeAll }
}
