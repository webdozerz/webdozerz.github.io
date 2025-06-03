<template>
  <div class="projects">
    <h3 class="projects__title">Pet проекты</h3>
    <section>
      <div class="projects__list">
        <div v-for="project in projects" :key="project.name" class="projects__item">
          <h4 class="projects__item-title">{{ project.name }}</h4>
          <p class="projects__item-description">{{ project.description }}</p>
          <div class="projects__item-links">
            <a v-if="project.source" :href="project.source" target="_blank" class="projects__link">
              Исходный код
            </a>
            <a v-if="project.demo" :href="project.demo" target="_blank" class="projects__link">
              Демо
            </a>
          </div>
          <div class="projects__item-tech">
            <span v-for="tech in project.technologies" :key="tech" class="projects__tech-tag">
              {{ tech }}
            </span>
          </div>
        </div>
      </div>
    </section>
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
    name: 'Просмотрщик видео на Kinopoisk',
    description: 'Расширение для браузера',
    source: 'https://github.com/webdozerz/webdozerz.github.io/blob/master/public/source-code/knp',
    demo: 'https://webdozerz.github.io/knp-ext.zip',
    technologies: ['Chrome Extension', 'JavaScript', 'HTML', 'CSS']
  }
]
</script>

<style lang="scss" scoped>
.projects {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__title {
    color: var(--white-1000);
  }

  &__list {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__item {
    padding: 16px;
    border: 1px solid var(--border-color, #333);
    border-radius: 8px;
    background: var(--bg-secondary, rgba(255, 255, 255, 0.02));
    transition: border-color 0.2s ease;

    &:hover {
      border-color: var(--green);
    }
  }

  &__item-title {
    margin: 0 0 8px 0;
    color: var(--white-1000);
    font-size: 1.1em;
    font-weight: 600;
  }

  &__item-description {
    margin: 0 0 12px 0;
    color: var(--text-secondary, #ccc);
    line-height: 1.5;
  }

  &__item-links {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__link {
    color: var(--green);
    text-decoration: none;
    font-weight: 500;
    padding: 4px 8px;
    border: 1px solid var(--green);
    border-radius: 4px;
    font-size: 0.9em;
    transition: all 0.2s ease;

    &:hover {
      background: var(--green);
      color: var(--bg-primary, #000);
    }
  }

  &__item-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__tech-tag {
    background: var(--red);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: 500;
  }
}
</style> 