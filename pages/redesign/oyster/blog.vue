<script lang="ts" setup>
import { oyBlog, oyPath } from '~/utils/oyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'

useSeoMeta({ title: 'Блог — Oyster Market | Концепт редизайна' })
const cat = ref('Все')
const posts = computed(() => (cat.value === 'Все' ? oyBlog.posts : oyBlog.posts.filter((p) => p.cat === cat.value)))
</script>

<template>
  <div class="oy-wrap oy-page">
    <nav class="oy-crumbs" aria-label="Навигация">
      <NuxtLink :to="oyPath('/')">Главная</NuxtLink>
      <span>Блог</span>
    </nav>
    <div class="oy-head">
      <div>
        <h1 class="oy-title">Блог</h1>
        <p>Рецепты, полезные советы и всё о морепродуктах. Статьи открываются на сайте магазина.</p>
      </div>
      <a href="https://oyster.market/blog/rss/" target="_blank" rel="noopener" class="oy-head__link">RSS <OyIcon name="ext" :size="16" /></a>
    </div>
    <div class="oy-seg oy-blog__cats">
      <button type="button" :class="{ 'is-on': cat === 'Все' }" @click="cat = 'Все'">Все</button>
      <button v-for="c in oyBlog.cats" :key="c.name" type="button" :class="{ 'is-on': cat === c.name }" @click="cat = c.name">{{ c.name }} · {{ c.count }}</button>
    </div>
    <div class="oy-arts oy-blog__grid">
      <a v-for="a in posts" :key="a.url" :href="a.url" target="_blank" rel="noopener" class="oy-art">
        <img :src="a.img" alt="" loading="lazy" width="400" height="260" />
        <small>{{ a.cat }}</small>
        <b>{{ a.title }}</b>
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.oy-blog__cats { margin-bottom: 24px; @media (max-width: 768px) { flex-wrap: nowrap; overflow-x: auto; max-width: 100%; scrollbar-width: none; &::-webkit-scrollbar { display: none; } } }
.oy-blog__grid { @media (max-width: 989px) { grid-template-columns: repeat(2, minmax(0, 1fr)); } @media (max-width: 576px) { grid-template-columns: minmax(0, 1fr); } }
</style>
