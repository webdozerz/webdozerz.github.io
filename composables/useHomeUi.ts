// Общее состояние главной: тема, тост, палитра команд, консоль и «режим чертежа».

import { contacts } from '~/data/profile'

export type HomeTheme = 'light' | 'dark'

const THEME_KEY = 'home-theme'
const PET_KEY = 'home-pet-hidden'
const SNOW_KEY = 'home-snow'

export function useHomeUi() {
  const theme = useState<HomeTheme>('home-theme', () => 'dark')
  const toastText = useState<string>('home-toast', () => '')
  const paletteOpen = useState<boolean>('home-palette', () => false)
  const terminalOpen = useState<boolean>('home-terminal', () => false)
  const blueprint = useState<boolean>('home-blueprint', () => false)
  const petVisible = useState<boolean>('home-pet', () => true)
  const snow = useState<boolean>('home-snow', () => false)

  let toastTimer: ReturnType<typeof setTimeout> | undefined

  function syncTheme() {
    const current = document.documentElement.dataset.theme
    theme.value = current === 'light' ? 'light' : 'dark'
  }

  function setTheme(next: HomeTheme) {
    theme.value = next
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(THEME_KEY, next)
    }
    catch {
      // Приватный режим или запрет хранилища: тема просто не запомнится.
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function syncPet() {
    try {
      petVisible.value = localStorage.getItem(PET_KEY) !== '1'
    }
    catch {
      petVisible.value = true
    }
  }

  function togglePet() {
    petVisible.value = !petVisible.value
    try {
      localStorage.setItem(PET_KEY, petVisible.value ? '0' : '1')
    }
    catch {
      // Без хранилища выбор просто не запомнится.
    }
    toast(petVisible.value ? 'Пиксель вернулся' : 'Пиксель ушёл спать за экран')
  }

  // Снег идёт сам с декабря по февраль (по Томску); выбор посетителя запоминается.
  function isWinterInTomsk() {
    const month = Number(new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Tomsk', month: 'numeric' }).format(new Date()))
    return month === 12 || month <= 2
  }

  function syncSnow() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      snow.value = false
      return
    }
    let saved: string | null = null
    try {
      saved = localStorage.getItem(SNOW_KEY)
    }
    catch {
      // Без хранилища просто следуем сезону.
    }
    snow.value = saved === 'on' ? true : saved === 'off' ? false : isWinterInTomsk()
  }

  function toggleSnow() {
    snow.value = !snow.value
    try {
      localStorage.setItem(SNOW_KEY, snow.value ? 'on' : 'off')
    }
    catch {
      // Выбор просто не запомнится.
    }
    toast(snow.value ? 'Пошёл снег' : 'Снег закончился')
  }

  function toast(text: string) {
    toastText.value = text
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => (toastText.value = ''), 2200)
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contacts.email)
      toast(`Скопировано: ${contacts.email}`)
    }
    catch {
      toast(contacts.email)
    }
  }

  function toggleBlueprint() {
    blueprint.value = !blueprint.value
    toast(blueprint.value ? 'Режим чертежа включён' : 'Режим чертежа выключен')
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return {
    theme,
    toastText,
    paletteOpen,
    terminalOpen,
    blueprint,
    petVisible,
    snow,
    syncSnow,
    toggleSnow,
    syncTheme,
    syncPet,
    togglePet,
    setTheme,
    toggleTheme,
    toast,
    copyEmail,
    toggleBlueprint,
    scrollTo,
  }
}

// Скрипт для <head>: ставит тему до отрисовки, чтобы не было вспышки.
export const themeBootScript = `(function(){document.documentElement.dataset.js='1';try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})()`
