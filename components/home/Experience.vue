<script setup lang="ts">
import { jobs } from '~/data/profile'
</script>

<template>
  <div class="jobs">
    <article v-for="job in jobs" :key="job.company" class="job">
      <header class="job__head">
        <div>
          <h3 class="job__company">
            {{ job.company }}
          </h3>
          <p class="job__role">
            {{ job.role }} · {{ job.place }}
          </p>
        </div>
        <span class="job__period mono">{{ job.period }}</span>
      </header>

      <ul v-if="job.points" class="points">
        <li v-for="point in job.points" :key="point">
          {{ point }}
        </li>
      </ul>

      <div v-if="job.projects" class="projects">
        <section v-for="project in job.projects" :key="project.title" class="project">
          <div class="project__head">
            <h4 class="project__title">
              {{ project.title }}
            </h4>
            <span class="project__period mono">{{ project.period }}</span>
          </div>
          <ul class="chips" aria-label="Стек">
            <li v-for="tech in project.stack" :key="tech" class="chip">
              {{ tech }}
            </li>
          </ul>
          <ul class="points">
            <li v-for="point in project.points" :key="point">
              {{ point }}
            </li>
          </ul>
        </section>
      </div>
    </article>
  </div>
</template>

<style lang="scss" scoped>
.jobs {
  display: grid;
  gap: 64px;
}

.job {
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
  }

  &__company {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.015em;
  }

  &__role {
    margin: 4px 0 0;
    color: var(--h-muted);
    font-size: 15px;
  }

  &__period {
    flex-shrink: 0;
    color: var(--h-muted);
    font-size: 13px;
  }

  > .points {
    margin-top: 20px;
  }
}

.projects {
  margin-top: 28px;
  border-left: 1px solid var(--h-line);
}

.project {
  position: relative;
  padding: 4px 0 28px 28px;

  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 12px;
    width: 7px;
    height: 7px;
    border: 1px solid var(--h-line-strong);
    border-radius: 50%;
    background: var(--h-bg);
    transition: border-color 0.2s, background-color 0.2s;
  }

  &:hover::before {
    border-color: var(--h-accent);
    background: var(--h-accent);
  }

  &:last-child {
    padding-bottom: 0;
  }

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
  }

  &__title {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
  }

  &__period {
    flex-shrink: 0;
    color: var(--h-faint);
    font-size: 12px;
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

.chip {
  padding: 2px 8px;
  border: 1px solid var(--h-line);
  border-radius: 5px;
  color: var(--h-muted);
  font-family: var(--h-mono);
  font-size: 11.5px;
  line-height: 1.6;
}

.points {
  display: grid;
  gap: 6px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  color: var(--h-text-soft);
  font-size: 15px;
  line-height: 1.55;

  li {
    position: relative;
    padding-left: 18px;

    &::before {
      content: '';
      position: absolute;
      left: 2px;
      top: 0.78em;
      width: 8px;
      height: 1px;
      background: var(--h-faint);
    }
  }
}

@media (max-width: 600px) {
  .job__head,
  .project__head {
    flex-direction: column;
    gap: 4px;
  }

  .projects {
    border-left: 0;
  }

  .project {
    padding-left: 0;

    &::before {
      display: none;
    }
  }
}
</style>
