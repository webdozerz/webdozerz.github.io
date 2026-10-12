// Общее состояние главной: тема, тост, палитра команд, консоль и «режим чертежа».

import { contacts } from '~/data/profile'

export type HomeTheme = 'light' | 'dark'

const THEME_KEY = 'home-theme'

export function useHomeUi() {
  const theme = useState<HomeTheme>('home-theme', () => 'dark')
  const toastText = useState<string>('home-toast', () => '')
  const paletteOpen = useState<boolean>('home-palette', () => false)
  const terminalOpen = useState<boolean>('home-terminal', () => false)
  const blueprint = useState<boolean>('home-blueprint', () => false)

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
    syncTheme,
    setTheme,
    toggleTheme,
    toast,
    copyEmail,
    toggleBlueprint,
    scrollTo,
  }
}

// Скрипт для <head>: ставит тему до отрисовки, чтобы не было вспышки.
export const themeBootScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})()`
