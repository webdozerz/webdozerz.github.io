<script setup lang="ts">
import { petProjects } from '~/data/profile'
</script>

<template>
  <ul class="projects-grid">
    <li v-for="project in petProjects" :key="project.title" class="project">
      <span class="project__kind mono">{{ project.kind }}</span>
      <h3 class="project__title">
        {{ project.title }}
      </h3>
      <p class="project__text">
        {{ project.description }}
      </p>
      <p class="project__stack mono">
        {{ project.stack.join(' · ') }}
      </p>
      <div class="project__links">
        <template v-for="link in project.links" :key="link.href">
          <NuxtLink v-if="link.internal" :to="link.href" class="project__link">
            {{ link.label }} →
          </NuxtLink>
          <a v-else :href="link.href" target="_blank" rel="noopener" class="project__link">
            {{ link.label }} ↗
          </a>
        </template>
        <span v-if="project.note" class="project__private">{{ project.note }}</span>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  gap: 1px;
  list-style: none;
  border: 1px solid var(--h-line);
  border-radius: 14px;
  background: var(--h-line);
  overflow: hidden;
}

.project {
  display: flex;
  flex-direction: column;
  padding: 26px;
  background: var(--h-bg);
  transition: background-color 0.2s;

  &:hover {
    background: var(--h-surface);
  }

  &__kind {
    color: var(--h-accent);
    font-size: 12px;
  }

  &__title {
    margin: 10px 0 0;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  &__text {
    flex-grow: 1;
    margin: 10px 0 0;
    color: var(--h-text-soft);
    font-size: 15px;
    line-height: 1.55;
  }

  &__stack {
    margin: 16px 0 0;
    color: var(--h-faint);
    font-size: 12px;
  }

  &__links {
    display: flex;
    gap: 18px;
    margin-top: 16px;
    font-size: 14px;
  }

  &__link {
    color: var(--h-text);
    text-decoration: underline;
    text-decoration-color: var(--h-line-strong);
    text-underline-offset: 4px;
    transition: text-decoration-color 0.2s, color 0.2s;

    &:hover {
      color: var(--h-accent);
      text-decoration-color: currentColor;
    }
  }

  &__private {
    color: var(--h-faint);
  }
}

@media (max-width: 700px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project {
    padding: 22px 20px;
  }
}
</style>
