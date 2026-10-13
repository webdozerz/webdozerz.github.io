<script setup lang="ts">
import '~/assets/scss/home.scss'
import { contacts, education, jobs, petProjects, profile, siteUrl, skills } from '~/data/profile'

// Резюме одной страницей. Кнопка скачивает public/resume.pdf — его собирает `npm run resume:pdf` из этой же страницы.
useHomeHead()
useSeoMeta({
  title: 'Резюме — Илья Андрюшов, Frontend-разработчик',
  description: 'Резюме Ильи Андрюшова: Frontend-разработчик (Middle+), Vue 3, Nuxt, TypeScript.',
  ogTitle: 'Резюме — Илья Андрюшов',
  ogDescription: 'Frontend-разработчик (Middle+): Vue 3, Nuxt, TypeScript.',
  ogUrl: `${siteUrl}/resume`,
})
useHead({ link: [{ rel: 'canonical', href: `${siteUrl}/resume` }] })

const ui = useHomeUi()
onMounted(() => ui.syncTheme())

const site = siteUrl.replace('https://', '')
</script>

<template>
  <div class="home resume-page">
    <div class="resume-page__bar">
      <NuxtLink to="/" class="resume-page__back">
        ← На сайт
      </NuxtLink>
      <a href="/resume.pdf" download="Andryushov-Ilya-Frontend.pdf" class="h-btn h-btn--primary resume-page__print">
        Скачать PDF
      </a>
    </div>

    <article class="resume">
      <header class="resume__head">
        <img src="/photo-320.jpg" :alt="`${profile.firstName} ${profile.lastName}`" class="resume__photo" width="320" height="320">
        <div class="resume__intro">
        <h1 class="resume__name">
          {{ profile.firstName }} {{ profile.lastName }}
        </h1>
        <p class="resume__role">
          {{ profile.role }} ({{ profile.grade }}) · {{ profile.stackLine }} · {{ profile.city }}
        </p>
        <ul class="resume__contacts mono">
          <li><a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a></li>
          <li><a :href="contacts.telegram">t.me/{{ contacts.telegramHandle.slice(1) }}</a></li>
          <li><a :href="contacts.github">github.com/webdozerz</a></li>
          <li><a :href="siteUrl">{{ site }}</a></li>
        </ul>
        </div>
      </header>

      <section class="resume__section">
        <h2 class="resume__h2 mono">
          О себе
        </h2>
        <p class="resume__text">
          {{ profile.lead }} {{ profile.about }}
        </p>
      </section>

      <section class="resume__section">
        <h2 class="resume__h2 mono">
          Опыт работы
        </h2>
        <div v-for="job in jobs" :key="job.company" class="resume__job">
          <div class="resume__row">
            <h3 class="resume__h3">
              {{ job.company }} — {{ job.role }}
            </h3>
            <span class="resume__period mono">{{ job.period }} · {{ job.place }}</span>
          </div>

          <ul v-if="job.points" class="resume__list">
            <li v-for="point in job.points" :key="point">
              {{ point }}
            </li>
          </ul>

          <div v-for="project in job.projects" :key="project.title" class="resume__project">
            <div class="resume__row">
              <h4 class="resume__h4">
                {{ project.title }}
              </h4>
              <span class="resume__period mono">{{ project.period }}</span>
            </div>
            <p class="resume__stack mono">
              {{ project.stack.join(' · ') }}
            </p>
            <ul class="resume__list">
              <li v-for="point in project.points" :key="point">
                {{ point }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="resume__section">
        <h2 class="resume__h2 mono">
          Пет-проекты
        </h2>
        <ul class="resume__list">
          <li v-for="project in petProjects" :key="project.title">
            <strong>{{ project.title }}</strong> ({{ project.kind }}) — {{ project.description }}
          </li>
        </ul>
      </section>

      <section class="resume__section">
        <h2 class="resume__h2 mono">
          Навыки
        </h2>
        <dl class="resume__skills">
          <div v-for="row in skills" :key="row.area" class="resume__skill">
            <dt>{{ row.area }}</dt>
            <dd>{{ row.items }}</dd>
          </div>
        </dl>
      </section>

      <section class="resume__section">
        <h2 class="resume__h2 mono">
          Образование
        </h2>
        <p class="resume__text">
          {{ education.place }}, {{ education.degree }}, {{ education.period }}
        </p>
      </section>
    </article>
  </div>
</template>

<style lang="scss" scoped>
.resume-page {
  min-height: 100vh;
  padding: 0 24px 80px;

  &__bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 860px;
    margin: 0 auto;
    padding: 24px 0;
  }

  &__back {
    color: var(--h-muted);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--h-text);
    }
  }
}

.resume {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 44px 48px;
  border: 1px solid var(--h-line);
  border-radius: 14px;
  background: var(--h-raised);

  &__head {
    display: flex;
    align-items: center;
    gap: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--h-line);
  }

  &__photo {
    flex-shrink: 0;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__intro {
    min-width: 0;
  }

  &__name {
    margin: 0;
    font-size: clamp(32px, 5vw, 44px);
    font-weight: 600;
    letter-spacing: -0.03em;
  }

  &__role {
    margin: 8px 0 0;
    color: var(--h-text-soft);
    font-size: 16px;
  }

  &__contacts {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    margin: 14px 0 0;
    padding: 0;
    list-style: none;
    font-size: 13px;

    a {
      color: var(--h-muted);
      text-decoration: none;

      &:hover {
        color: var(--h-accent);
      }
    }
  }

  &__section {
    margin-top: 28px;
  }

  &__h2 {
    margin: 0 0 12px;
    color: var(--h-accent);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__text {
    margin: 0;
    color: var(--h-text-soft);
    font-size: 15px;
    line-height: 1.6;
  }

  &__job + &__job {
    margin-top: 22px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
  }

  &__h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
  }

  &__h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
  }

  &__period {
    flex-shrink: 0;
    color: var(--h-faint);
    font-size: 12px;
  }

  &__project {
    margin-top: 14px;
    break-inside: avoid;
  }

  &__stack {
    margin: 4px 0 0;
    color: var(--h-faint);
    font-size: 11.5px;
  }

  &__list {
    margin: 8px 0 0;
    padding-left: 18px;
    list-style: disc;

    li::marker {
      color: var(--h-faint);
    }

    color: var(--h-text-soft);
    font-size: 14px;
    line-height: 1.55;

    li + li {
      margin-top: 3px;
    }

    strong {
      color: var(--h-text);
      font-weight: 600;
    }
  }

  &__skills {
    margin: 0;
  }

  &__skill {
    display: grid;
    grid-template-columns: 170px minmax(0, 1fr);
    gap: 16px;
    padding: 6px 0;
    font-size: 14px;

    dt {
      color: var(--h-muted);
    }

    dd {
      margin: 0;
      color: var(--h-text-soft);
    }
  }
}

@media (max-width: 600px) {
  .resume-page {
    padding: 0 16px 48px;
  }

  .resume {
    padding: 28px 20px 32px;
    border-radius: 10px;

    &__head {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    &__row {
      flex-direction: column;
      gap: 2px;
    }

    &__skill {
      grid-template-columns: 1fr;
      gap: 2px;
    }
  }
}

// Печать в PDF: светлые цвета, без рамок и кнопок, формат A4.
@media print {
  @page {
    size: A4;
    margin: 12mm 13mm 13mm;
  }

  :global(html.home-root),
  :global(body.home-page) {
    background: #fff !important;
  }

  .resume-page {
    --h-text: #111317;
    --h-text-soft: #2d323a;
    --h-muted: #5b616c;
    --h-faint: #7a808a;
    --h-accent: #2f4fe0;
    --h-line: #dfe2e7;

    min-height: 0;
    padding: 0;
    color: var(--h-text);

    &__bar {
      display: none;
    }
  }

  .resume {
    max-width: none;
    padding: 0;
    border: 0;
    background: none;

    &__head {
      gap: 18px;
      padding-bottom: 14px;
    }

    &__photo {
      width: 76px;
      height: 76px;
    }

    &__name {
      font-size: 28px;
    }

    &__role {
      margin-top: 4px;
      font-size: 13.5px;
    }

    &__contacts {
      margin-top: 8px;
      font-size: 11px;
    }

    &__section {
      margin-top: 14px;
    }

    &__h2 {
      margin-bottom: 8px;
      font-size: 10.5px;
    }

    &__text {
      font-size: 12px;
      line-height: 1.45;
    }

    &__job + &__job {
      margin-top: 14px;
    }

    &__h3 {
      font-size: 14.5px;
    }

    &__h4 {
      font-size: 13px;
    }

    &__period {
      font-size: 10.5px;
    }

    // Блоки можно разрывать, но заголовок проекта не отрывается от его текста.
    &__project {
      margin-top: 10px;
      break-inside: auto;
    }

    &__row,
    &__stack {
      break-after: avoid;
    }

    &__stack {
      font-size: 10px;
    }

    &__list {
      margin-top: 4px;
      font-size: 11.5px;
      line-height: 1.4;

      li + li {
        margin-top: 2px;
      }
    }

    &__skill {
      grid-template-columns: 140px minmax(0, 1fr);
      padding: 2px 0;
      font-size: 11.5px;
    }
  }
}
</style>
