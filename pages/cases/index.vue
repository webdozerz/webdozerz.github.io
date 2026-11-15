<script lang="ts" setup>
import '~/assets/scss/home.scss'
import { cases } from '~/data/cases'
import { siteUrl } from '~/data/profile'

useHomeHead()
useSeoMeta({
  title: 'Кейсы — Илья Андрюшов',
  description: 'Проекты для заказчиков: задача, решение, как запускали и что получилось. Скриншоты до и после.',
  ogTitle: 'Кейсы — Илья Андрюшов',
  ogDescription: 'Проекты для заказчиков: задача, решение, запуск. Скриншоты до и после.',
  ogUrl: `${siteUrl}/cases/`,
})
useHead({ link: [{ rel: 'canonical', href: `${siteUrl}/cases/` }] })

const ui = useHomeUi()
onMounted(() => ui.syncTheme())
</script>

<template>
  <div class="home cases">
    <div class="shell">
      <NuxtLink to="/" class="cases__back">
        ← На сайт
      </NuxtLink>

      <header class="cases__head">
        <span class="cases__kicker mono">cases / {{ String(cases.length).padStart(2, '0') }}</span>
        <h1 class="cases__title">
          Кейсы
        </h1>
        <p class="cases__lead">
          Проекты для заказчиков: что хотелось улучшить, как сделали и как запускали.
          Рядом — скриншоты до и после. Концепты, которые я делаю сам, — в
          <NuxtLink to="/redesign/">каталоге концептов</NuxtLink>.
        </p>
      </header>

      <ul class="cases__list">
        <li v-for="c in cases" :key="c.slug" class="case-card">
          <NuxtLink :to="`/cases/${c.slug}/`" class="case-card__link">
            <span class="case-card__preview">
              <img :src="c.cover" alt="" width="1200" height="630" loading="lazy">
            </span>
            <span class="case-card__body">
              <span class="case-card__meta mono">
                <span>{{ c.date }}</span>
                <span>{{ c.client }}</span>
              </span>
              <span class="case-card__title">{{ c.title }}</span>
              <span class="case-card__text">{{ c.lead }}</span>
              <span class="case-card__stack mono">{{ c.tags.join(' · ') }}</span>
              <span class="case-card__more">Читать кейс →</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cases {
  padding: 32px 0 96px;

  &__back {
    color: var(--h-muted);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--h-text);
    }
  }

  &__head {
    max-width: 680px;
    margin: 56px 0 48px;
  }

  &__kicker {
    color: var(--h-accent);
    font-size: 12px;
  }

  &__title {
    margin: 12px 0 0;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.025em;
  }

  &__lead {
    margin: 16px 0 0;
    color: var(--h-muted);
    font-size: 16px;
    line-height: 1.6;

    a {
      color: var(--h-text);
      text-decoration-color: var(--h-line-strong);
      text-underline-offset: 3px;

      &:hover {
        color: var(--h-accent);
      }
    }
  }

  &__list {
    display: grid;
    gap: 20px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
}

.case-card {
  &__link {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    border: 1px solid var(--h-line);
    border-radius: 14px;
    background: var(--h-surface);
    color: inherit;
    text-decoration: none;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.25s, box-shadow 0.25s;

    &:hover {
      border-color: var(--h-line-strong);
      box-shadow: var(--h-shadow);
      transform: translateY(-3px);
    }
  }

  &__preview {
    display: block;
    border-right: 1px solid var(--h-line);
    background: var(--h-raised);
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: left top;
      transition: transform 0.5s ease;
    }
  }

  &__link:hover &__preview img {
    transform: scale(1.03);
  }

  &__body {
    display: flex;
    flex-direction: column;
    padding: 26px 28px 28px;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
    color: var(--h-faint);
    font-size: 12px;

    span:first-child {
      color: var(--h-accent);
    }
  }

  &__title {
    margin-top: 12px;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.015em;
  }

  &__text {
    flex-grow: 1;
    margin-top: 12px;
    color: var(--h-text-soft);
    font-size: 15px;
    line-height: 1.55;
  }

  &__stack {
    margin-top: 16px;
    color: var(--h-faint);
    font-size: 12px;
  }

  &__more {
    margin-top: 18px;
    color: var(--h-text);
    font-size: 14px;
    font-weight: 500;
  }

  &__link:hover &__more {
    color: var(--h-accent);
  }
}

@media (max-width: 860px) {
  .case-card {
    &__link {
      grid-template-columns: 1fr;
    }

    &__preview {
      aspect-ratio: 1200 / 630;
      border-right: 0;
      border-bottom: 1px solid var(--h-line);
    }

    &__body {
      padding: 20px 18px 22px;
    }

    &__title {
      font-size: 20px;
    }
  }
}

@media (max-width: 760px) {
  .cases {
    padding-top: 20px;

    &__head {
      margin: 36px 0 32px;
    }
  }
}
</style>
