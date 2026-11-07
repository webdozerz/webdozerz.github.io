<script lang="ts" setup>
import DrIcon from '~/components/redesign/dereda/DrIcon.vue'

useSeoMeta({ title: 'Новости — Дереда | Концепт редизайна' })
</script>

<template>
  <div class="dr-wrap dr-page dr-blog">
    <nav class="dr-crumbs" aria-label="Навигация">
      <NuxtLink :to="drPath('/')">Главная</NuxtLink>
      <span>Новости</span>
    </nav>
    <h1>Новости</h1>

    <div class="dr-blog__list">
      <article v-for="p in drPosts" :key="p.id" class="dr-blog__item" :class="{ 'has-img': p.img }">
        <img v-if="p.img" :src="p.img" alt="" width="480" height="320" loading="lazy" />
        <div>
          <small>{{ p.date }}</small>
          <h2>{{ p.title }}</h2>
          <p>{{ p.text }}</p>
          <NuxtLink v-if="p.id === 'baklanova'" :to="{ path: drPath('/catalog'), query: { farmer: 'baklanova' } }" class="dr-blog__more">
            Товары Натальи Баклановой<DrIcon name="arrow" :size="18" />
          </NuxtLink>
        </div>
      </article>
    </div>
    <p class="dr-blog__all">
      В блоге магазина записи с 2012 года — 74 страницы.
      <a href="https://dereda.ru/blog" target="_blank" rel="noopener">Все записи на dereda.ru<DrIcon name="ext" :size="16" /></a>
    </p>
  </div>
</template>

<style lang="scss">
.dr-blog {
  h1 {
    margin-bottom: 22px;
  }

  &__list {
    display: grid;
    gap: 16px;
    max-width: 980px;
  }

  &__item {
    display: grid;
    gap: 20px;
    padding: 24px;
    border: 1px solid var(--dr-line);
    border-radius: var(--dr-R);

    &.has-img {
      grid-template-columns: 320px minmax(0, 1fr);

      @media (max-width: 768px) {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    img {
      width: 100%;
      aspect-ratio: 3 / 2;
      height: auto;
      border-radius: 16px;
      object-fit: cover;
    }

    > div {
      display: grid;
      align-content: start;
      gap: 8px;
    }

    small {
      color: var(--dr-muted);
    }

    h2 {
      font-size: 26px;
    }
  }

  &__more,
  &__all a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--dr-accent);
    font-weight: 600;
  }

  &__all {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    margin-top: 24px;
    color: var(--dr-muted);
  }
}
</style>
