<script lang="ts" setup>
import FaIcon from '~/components/redesign/fermaaltaya/FaIcon.vue'

useSeoMeta({ title: 'Новости — Ферма Алтая | Концепт редизайна' })
const years = [...new Set(faNews.map((n) => n.date.slice(0, 4)))]
</script>

<template>
  <div class="fa-wrap fa-info fa-newslist">
    <nav class="fa-crumbs" aria-label="Навигация">
      <NuxtLink :to="faPath()">Главная</NuxtLink>
      <span>Новости</span>
    </nav>
    <h1 class="fa-info__h1">Новости</h1>
    <section v-for="y in years" :key="y" class="fa-newslist__year">
      <h2>{{ y }}</h2>
      <a
        v-for="n in faNews.filter((x) => x.date.startsWith(y))"
        :key="n.slug"
        :href="`${FA_ORIGIN}/blog/${n.slug}`"
        target="_blank"
        rel="noopener"
        class="fa-newslist__item"
      >
        <small>{{ faNewsDate(n.date) }}</small>
        <b>{{ n.title }}</b>
        <FaIcon name="ext" :size="18" />
      </a>
    </section>
    <p class="fa-demo">Тексты новостей открываются на сайте фермы — в концепте показаны заголовки.</p>
  </div>
</template>

<style lang="scss">
.fa-newslist {
  &__year {
    display: grid;
    margin-bottom: 28px;

    h2 {
      margin-bottom: 12px;
      font-size: 24px;
    }
  }
  &__item {
    display: grid;
    grid-template-columns: 170px minmax(0, 1fr) auto;
    align-items: baseline;
    gap: 4px 20px;
    padding: 16px 0;
    border-bottom: 1px solid var(--fa-line);

    small {
      color: var(--fa-muted);
      font-size: 15px;
    }
    b {
      color: var(--fa-dark);
      font-size: 19px;
      font-weight: 700;
    }
    .fa-icon {
      color: var(--fa-muted);
    }
    &:hover b {
      color: var(--fa-accent);
    }
  }
  @media (max-width: 576px) {
    &__item {
      grid-template-columns: minmax(0, 1fr) auto;

      small {
        grid-column: 1 / -1;
      }
    }
  }
}
</style>
