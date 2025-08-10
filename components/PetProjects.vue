<template>
  <div class="projects">
    <div class="section-header">
      <h3 class="section-title">
        <i class="title-icon">🚀</i>
        Pet проекты
      </h3>
      <div class="section-subtitle">Мои личные разработки и эксперименты</div>
    </div>

    <div class="projects-grid">
      <div v-for="(project, index) in projects" :key="project.name" class="project-card" :class="{ featured: index === 0 }">
        <!-- Индикатор статуса -->
        <div class="project-status">
          <div class="status-dot active"/>
          <span class="status-text">Активный</span>
        </div>

        <!-- Заголовок проекта -->
        <div class="project-header">
          <h4 class="project-title">{{ project.name }}</h4>
          <div class="project-type">
            <i class="type-icon">{{ getProjectIcon(project.technologies) }}</i>
          </div>
        </div>

        <!-- Описание -->
        <p class="project-description">{{ project.description }}</p>

        <!-- Технологии -->
        <div class="tech-stack">
          <span v-for="tech in project.technologies" :key="tech" :class="['tech-badge', getTechClass(tech)]">
            {{ tech }}
          </span>
        </div>

        <!-- Действия -->
        <div class="project-actions">
          <a v-if="project.source" :href="project.source" target="_blank" class="action-btn source">
            <i class="btn-icon">⚡</i>
            <span>Исходный код</span>
          </a>
          <a v-if="project.demo" :href="project.demo" target="_blank" class="action-btn demo">
            <i class="btn-icon">🔗</i>
            <span>Демо / Скачать</span>
          </a>
        </div>

        <!-- Фоновый градиент для featured проекта -->
        <div v-if="index === 0" class="featured-glow"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Project = {
  name: string
  description: string
  source?: string
  demo?: string
  technologies: string[]
}

const projects: Project[] = [
  {
    name: 'Калькулятор расчета трудозатрат для Frontend разработчиков',
    description: 'Калькулятор расчета трудозатрат для Frontend разработчиков',
    source: 'https://github.com/webdozerz/webdozerz.github.io/blob/master/pages/effort.vue',
    demo: 'https://webdozerz.github.io/effort',
    technologies: ['Vue 3', 'Nuxt', 'TypeScript', 'SCSS']
  },
  {
    name: 'Kinopoisk Finder',
    description: 'Расширение для поиска альтернативных источников просмотра фильмов и сериалов с Kinopoisk',
    source: 'https://github.com/webdozerz/webdozerz.github.io/blob/master/public/source-code/knp',
    demo: 'https://webdozerz.github.io/knp-ext.zip',
    technologies: ['Chrome Extension', 'JavaScript', 'HTML', 'CSS']
  }
]

// Вспомогательные функции
const getProjectIcon = (technologies: string[]) => {
  if (technologies.includes('Vue 3') || technologies.includes('Nuxt')) return '⚛️'
  if (technologies.includes('Chrome Extension')) return '🔌'
  return '💻'
}

const getTechClass = (tech: string) => {
  const techClasses: Record<string, string> = {
    'Vue 3': 'vue',
    'Nuxt': 'nuxt',
    'TypeScript': 'typescript',
    'SCSS': 'scss',
    'Chrome Extension': 'extension',
    'JavaScript': 'javascript',
    'HTML': 'html',
    'CSS': 'css'
  }
  return techClasses[tech] || 'default'
}
</script>

<style lang="scss" scoped>
.projects {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

// Заголовок секции
.section-header {
  text-align: center;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    text-align: left;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: var(--white-1000);
  margin: 0 0 0.5rem 0;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }

  .title-icon {
    font-size: 1.2em;
  }
}

.section-subtitle {
  color: var(--white-700);
  font-size: 1rem;
  font-weight: 400;
}

// Сетка проектов
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
}

// Карточка проекта
.project-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(127, 92, 230, 0.4);
  }

  &.featured {
    border-color: rgba(92, 230, 115, 0.4);
    
    &:hover {
      border-color: rgba(92, 230, 115, 0.6);
      box-shadow: 0 20px 40px rgba(92, 230, 115, 0.2);
    }
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
}

// Статус проекта
.project-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--white-700);

  &.active {
    background: var(--green);
    box-shadow: 0 0 10px rgba(92, 230, 115, 0.5);
    animation: pulse-status 2s infinite;
  }
}

@keyframes pulse-status {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.status-text {
  font-size: 0.75rem;
  color: var(--white-700);
  font-weight: 500;
}

// Заголовок проекта
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--white-1000);
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.project-type {
  flex-shrink: 0;
}

.type-icon {
  font-size: 1.5rem;
}

// Описание
.project-description {
  color: var(--white-800);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  flex-grow: 1;
  font-size: 0.95rem;
}

// Технологии
.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.3s ease;

  &.vue {
    background: rgba(76, 192, 141, 0.2);
    color: #4fc08d;
    border-color: rgba(76, 192, 141, 0.3);
  }

  &.nuxt {
    background: rgba(0, 220, 130, 0.2);
    color: #00dc82;
    border-color: rgba(0, 220, 130, 0.3);
  }

  &.typescript {
    background: rgba(56, 118, 184, 0.2);
    color: #3876b8;
    border-color: rgba(56, 118, 184, 0.3);
  }

  &.scss {
    background: rgba(207, 100, 154, 0.2);
    color: #cf649a;
    border-color: rgba(207, 100, 154, 0.3);
  }

  &.extension {
    background: rgba(92, 230, 230, 0.2);
    color: var(--accent-cyan);
    border-color: rgba(92, 230, 230, 0.3);
  }

  &.javascript {
    background: rgba(240, 219, 79, 0.2);
    color: #f0db4f;
    border-color: rgba(240, 219, 79, 0.3);
  }

  &.html {
    background: rgba(227, 79, 38, 0.2);
    color: #e34f26;
    border-color: rgba(227, 79, 38, 0.3);
  }

  &.css {
    background: rgba(21, 114, 182, 0.2);
    color: #1572b6;
    border-color: rgba(21, 114, 182, 0.3);
  }

  &.default {
    background: rgba(255, 255, 255, 0.1);
    color: var(--white-800);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

// Действия
.project-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  flex: 1;
  justify-content: center;
  min-width: 0;

  @media (min-width: 480px) {
    flex: none;
    min-width: auto;
  }

  .btn-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: 480px) {
      white-space: normal;
      overflow: visible;
      text-overflow: none;
    }
  }

  &.source {
    background: rgba(92, 230, 115, 0.1);
    color: var(--green);
    border-color: rgba(92, 230, 115, 0.3);

    &:hover {
      background: rgba(92, 230, 115, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(92, 230, 115, 0.3);
    }
  }

  &.demo {
    background: rgba(127, 92, 230, 0.1);
    color: var(--purple);
    border-color: rgba(127, 92, 230, 0.3);

    &:hover {
      background: rgba(127, 92, 230, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(127, 92, 230, 0.3);
    }
  }
}

// Featured проект фон
.featured-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(92, 230, 115, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
  opacity: 0.5;
}

// Адаптивность
@media (max-width: 767px) {
  .project-card {
    padding: 1.25rem;
  }
  
  .project-title {
    font-size: 1.1rem;
  }
  
  .project-description {
    font-size: 0.9rem;
  }
  
  .action-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    
    span {
      font-size: 0.8rem;
    }
  }
}
</style>