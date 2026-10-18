<script lang="ts" setup>
const posts = [...sbPosts].sort((a, b) => b.date.localeCompare(a.date))
useSeoMeta({ title: 'Блог — СибирьТрейд | Концепт редизайна' })
</script>

<template>
  <div class="sb-wrap sb-blog">
    <nav class="sb-crumbs" aria-label="Навигация">
      <NuxtLink :to="sbPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>Блог</span>
    </nav>
    <h1 class="sb-page-title">Статьи для закупщиков</h1>
    <p class="sb-blog__lead">
      Как собрать ассортимент снеков, выбрать кофе под заведение и хранить заморозку. Статьи открываются
      на сайте оригинала.
    </p>
    <div class="sb-blog__grid">
      <a
        v-for="post in posts"
        :key="post.slug"
        :href="`https://sibirtreid.ru/blog/${post.slug}/`"
        target="_blank"
        rel="noopener"
        class="sb-post"
        :class="`sb-tone--${sbSection(post.sec)?.tone}`"
      >
        <img :src="sbSection(post.sec)?.img" alt="" loading="lazy" />
        <span class="sb-post__date">{{ sbDate(post.date) }} · {{ sbSection(post.sec)?.label }}</span>
        <span class="sb-post__title">{{ post.title }}</span>
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.sb .sb-blog {
  &__lead {
    max-width: 640px;
    margin-top: 14px;
    color: var(--sb-muted);
    font-size: 17px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 32px;
  }

  @media (max-width: 900px) {
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 560px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
