<script lang="ts" setup>
import { AP_ORIG, apPath } from '~/utils/apeti'
import { apBlog } from '~/utils/apetiData'
import ApIcon from '~/components/redesign/apeti/ApIcon.vue'

useSeoMeta({ title: 'Блог — Apeti, концепт редизайна' })
</script>

<template>
  <div class="ap-wrap ap-page">
    <nav class="ap-crumbs" aria-label="Хлебные крошки"><NuxtLink :to="apPath('/')">Главная</NuxtLink><span>Блог</span></nav>
    <div class="ap-head ap-blog__head"><div><h1>Блог</h1><p>О продуктах и о том, как их выбирать, хранить и готовить. В концепте — пять последних статей, они открываются на сайте магазина.</p></div></div>
    <ul class="ap-blog">
      <li v-for="b in apBlog" :key="b.url">
        <a :href="AP_ORIG + b.url" target="_blank" rel="noopener">
          <img :src="AP_ORIG + b.img" alt="" loading="lazy" width="300" height="300" />
          <div>
            <time>{{ b.date }}</time>
            <h2>{{ b.title }}</h2>
            <p>{{ b.text }}</p>
            <span class="ap-link">Читать <ApIcon name="right" /></span>
          </div>
        </a>
      </li>
    </ul>
    <div class="ap-blog__more">
      <a :href="`${AP_ORIG}/blog/`" target="_blank" rel="noopener" class="ap-btn ap-btn--line ap-btn--big">Показать ещё на apeti.ru</a>
    </div>
  </div>
</template>

<style lang="scss">
.ap .ap-blog__head { margin-top: 12px; }
.ap ul.ap-blog { display: grid; gap: 16px; margin: 0; padding: 0; max-width: 980px;
  a { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 24px; align-items: center; padding: 16px; border: 1px solid var(--ap-line); border-radius: var(--ap-R); &:hover { border-color: var(--ap-acc); } }
  img { display: block; width: 220px; height: 220px; border-radius: 14px; object-fit: cover; }
  div { display: grid; gap: 8px; justify-items: start; }
  time { font-size: 13px; color: var(--ap-mute); }
  h2 { font-size: 24px; }
  p { color: var(--ap-mute); font-size: 14.5px; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
}
.ap .ap-blog__more { margin-top: 24px; }
@media (max-width: 768px) {
  .ap ul.ap-blog a { grid-template-columns: 104px minmax(0, 1fr); gap: 14px; padding: 12px; align-items: start; }
  .ap ul.ap-blog img { width: 104px; height: 104px; }
  .ap ul.ap-blog h2 { font-size: 18px; }
  .ap ul.ap-blog p { display: none; }
  .ap .ap-blog__more .ap-btn { width: 100%; }
}
</style>
