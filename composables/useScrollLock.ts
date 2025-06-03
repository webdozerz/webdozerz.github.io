import { ref } from 'vue'

export function useScrollLock() {
  const isLocked = ref(false)
  const scrollPosition = ref(0)

  function lockScroll() {
    if (isLocked.value) return
    
    // Сохраняем текущую позицию скролла
    scrollPosition.value = window.pageYOffset || document.documentElement.scrollTop
    
    // Добавляем стили для блокировки скролла
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollPosition.value}px`
    document.body.style.width = '100%'
    
    isLocked.value = true
  }

  function unlockScroll() {
    if (!isLocked.value) return
    
    // Убираем стили блокировки
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    
    // Восстанавливаем позицию скролла
    window.scrollTo(0, scrollPosition.value)
    
    isLocked.value = false
  }

  return {
    isLocked,
    lockScroll,
    unlockScroll
  }
} 