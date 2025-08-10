<script lang="ts" setup>
import Bio from '@/components/Bio.vue'
import Experience from '@/components/Experience.vue'
import Education from '@/components/Education.vue'
import Tech from '@/components/Tech.vue'
import PetProjects from '@/components/PetProjects.vue'

// Реактивные состояния
const activeTab = ref('experience')
const showScrollButton = ref(false)

// Функция плавного скролла наверх
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Функция скролла к секции
const scrollToSection = (sectionId: string) => {
  activeTab.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Отслеживание скролла
const handleScroll = () => {
  showScrollButton.value = window.scrollY > 500
  
  // Определение активной секции
  const sections = ['experience', 'education', 'tech', 'projects']
  for (const section of sections) {
    const element = document.getElementById(section)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= 100 && rect.bottom >= 100) {
        activeTab.value = section
        break
      }
    }
  }
}

onMounted(() => {
  // Обработчик скролла
  window.addEventListener('scroll', handleScroll)
  
  // Анимация появления при загрузке
  setTimeout(() => {
    const cards = document.querySelectorAll('.section-card')
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in')
      }, index * 200)
    })
  }, 500)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="portfolio">
    <!-- Hero секция -->
    <section class="hero">
      <div class="hero-background">
        <div class="gradient-orb orb-1"/>
        <div class="gradient-orb orb-2"/>
        <div class="gradient-orb orb-3"/>
      </div>
      <div class="hero-content">
        <Bio />
      </div>
    </section>

    <!-- Основной контент -->
    <main class="main-content">
      <div class="container">
        <!-- Навигация -->
        <nav class="nav-tabs">
          <button 
            :class="['nav-tab', { active: activeTab === 'experience' }]" 
            @click="scrollToSection('experience')"
          >
            <i class="icon">💼</i>
            <span>Опыт</span>
          </button>
          <button 
            :class="['nav-tab', { active: activeTab === 'education' }]" 
            @click="scrollToSection('education')"
          >
            <i class="icon">🎓</i>
            <span>Образование</span>
          </button>
          <button 
            :class="['nav-tab', { active: activeTab === 'tech' }]" 
            @click="scrollToSection('tech')"
          >
            <i class="icon">⚡</i>
            <span>Технологии</span>
          </button>
          <button 
            :class="['nav-tab', { active: activeTab === 'projects' }]" 
            @click="scrollToSection('projects')"
          >
            <i class="icon">🚀</i>
            <span>Проекты</span>
          </button>
        </nav>

        <!-- Секции контента -->
        <div class="content-sections">
          <section id="experience" class="section-card">
            <Experience />
          </section>

          <section id="education" class="section-card">
            <Education />
          </section>

          <section id="tech" class="section-card">
            <Tech />
          </section>

          <section id="projects" class="section-card">
            <PetProjects />
          </section>
        </div>
      </div>
    </main>

    <!-- Плавающая кнопка наверх -->
    <Transition name="fade">
      <button v-if="showScrollButton" class="scroll-to-top" @click="scrollToTop">
        <i class="icon">↑</i>
      </button>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.portfolio {
  min-height: 100vh;
  position: relative;
}

// Hero секция
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, var(--black-1000) 0%, var(--black-900) 50%, var(--black-850) 100%);

  &-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  &-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
}

// Анимированные градиентные орбы
.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;

  &.orb-1 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, var(--purple) 0%, transparent 70%);
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  &.orb-2 {
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, var(--green) 0%, transparent 70%);
    top: 60%;
    right: 15%;
    animation-delay: 2s;
  }

  &.orb-3 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, var(--blue) 0%, transparent 70%);
    bottom: 30%;
    left: 60%;
    animation-delay: 4s;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(120deg);
  }
  66% {
    transform: translateY(30px) rotate(240deg);
  }
}

// Основной контент
.main-content {
  position: relative;
  background: var(--black-1000);
  padding-top: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

// Навигационные табы
.nav-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;

  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0.5rem;
  }
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background: transparent;
  color: var(--white-800);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
  font-family: inherit;
  font-size: inherit;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }

  .icon {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--white-1000);
    transform: translateY(-2px);

    .icon {
      transform: scale(1.1);
    }
  }

  &.active {
    background: linear-gradient(135deg, var(--purple) 0%, var(--blue) 100%);
    color: var(--white-1000);
    box-shadow: 0 8px 32px rgba(127, 92, 230, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(127, 92, 230, 0.4);
    }

    .icon {
      transform: scale(1.05);
    }
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(127, 92, 230, 0.3);
  }
}

// Секции контента
.content-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 4rem;
}

.section-card {
  background: linear-gradient(145deg, var(--black-900) 0%, var(--black-850) 100%);
  border-radius: 24px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--purple) 50%, transparent 100%);
  }

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(127, 92, 230, 0.3);
  }
}

// Кнопка наверх
.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--purple) 0%, var(--blue) 100%);
  border: none;
  color: var(--white-1000);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(127, 92, 230, 0.3);
  z-index: 1000;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(127, 92, 230, 0.4);
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    bottom: 1.5rem;
    right: 1.5rem;
  }
}

// Улучшенная адаптивность
@media (max-width: 1024px) {
  .container {
    padding: 0 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: 80vh;
    padding: 1rem;

    &-content {
      padding: 1rem;
    }
  }

  .main-content {
    padding-top: 1rem;
  }

  .gradient-orb {
    &.orb-1 {
      width: 200px;
      height: 200px;
    }

    &.orb-2 {
      width: 150px;
      height: 150px;
    }

    &.orb-3 {
      width: 120px;
      height: 120px;
    }
  }
}

// Анимации переходов
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
