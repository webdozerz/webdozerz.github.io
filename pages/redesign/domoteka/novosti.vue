<script lang="ts" setup>
// Новости: у оригинала ~319 записей с подгрузкой по 14; в концепте — первые 56 со ссылками на записи сайта.
import { dmPath } from '~/utils/domoteka'
import { dmNews } from '~/utils/domoteka.data'

useSeoMeta({ title: 'Новости фабрики «Домотека» | Концепт редизайна' })
const PAGE = 14
const shown = ref(PAGE)
const years = computed(() => [...new Set(dmNews.map((n) => n.d.slice(-4)))])
const year = ref('')
const list = computed(() => dmNews.filter((n) => !year.value || n.d.endsWith(year.value)))
watch(year, () => (shown.value = PAGE))
</script>

<template>
  <div class="dm-wrap dm-news">
    <div class="dm-page-head">
      <nav class="dm-crumbs" aria-label="Навигация"><NuxtLink :to="dmPath('/')">Главная</NuxtLink><span>Новости</span></nav>
      <h1 class="dm-h1">Новости</h1>
      <p class="dm-lead">Новые модели, цвета и расширение ассортимента.</p>
      <div class="dm-news__years">
        <button type="button" class="dm-seg" :class="{ 'is-on': !year }" @click="year = ''">Все</button>
        <button v-for="y in years" :key="y" type="button" class="dm-seg" :class="{ 'is-on': year === y }" @click="year = y">{{ y }}</button>
      </div>
    </div>
    <div class="dm-news__grid">
      <a v-for="n in list.slice(0, shown)" :key="n.u" :href="n.u" target="_blank" rel="noopener" class="dm-newscard">
        <time>{{ n.d }}</time>
        <b>{{ n.t }}</b>
      </a>
    </div>
    <div v-if="list.length > shown" class="dm-news__more">
      <button type="button" class="dm-btn dm-btn--line dm-btn--big" @click="shown += PAGE">Загрузить ещё</button>
    </div>
  </div>
</template>

<style lang="scss">
.dm .dm-news {
  .dm-news__years {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
  }
  .dm-news__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 28px;
  }
  .dm-news__more {
    display: flex;
    justify-content: center;
    margin-top: 28px;
  }
}
@media (max-width: 989px) {
  .dm .dm-news .dm-news__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 576px) {
  .dm .dm-news .dm-news__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
