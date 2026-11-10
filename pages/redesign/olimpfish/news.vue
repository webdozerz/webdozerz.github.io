<script lang="ts" setup>
import { olArticles, olDate, olNews, olPath, olRecipes } from '~/utils/olimpfish'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'

const route = useRoute()
const router = useRouter()
const tabs = [
  { id: 'news', name: 'Новости', list: olNews },
  { id: 'articles', name: 'Статьи', list: olArticles },
  { id: 'recipes', name: 'Рецепты', list: olRecipes },
]
const tab = computed(() => tabs.find((t) => t.id === route.query.tab) ?? tabs[0])
useSeoMeta({ title: () => `${tab.value.name} — Олимп | Концепт редизайна` })
const shown = ref(9)
watch(tab, () => (shown.value = 9))
const pick = (id: string) => router.replace({ query: id === 'news' ? {} : { tab: id } })
</script>

<template>
  <div class="ol-wrap ol-page ol-news">
    <nav class="ol-crumbs" aria-label="Навигация">
      <NuxtLink :to="olPath('/')">Главная</NuxtLink>
      <span><NuxtLink :to="olPath('/about')">О компании</NuxtLink></span>
      <span>{{ tab.name }}</span>
    </nav>
    <h1 class="ol-title">{{ tab.name }}</h1>
    <div class="ol-seg ol-news__tabs" role="tablist">
      <button v-for="t in tabs" :key="t.id" type="button" role="tab" :aria-selected="tab.id === t.id" :class="{ 'is-on': tab.id === t.id }" @click="pick(t.id)">{{ t.name }}</button>
    </div>
    <div class="ol-news__grid">
      <a v-for="n in tab.list.slice(0, shown)" :key="n.title + n.date" :href="n.url" target="_blank" rel="noopener" class="ol-post" :class="{ 'has-img': n.img }">
        <span v-if="n.img" class="ol-post__ph"><img :src="n.img" :alt="n.title" width="600" height="500" loading="lazy" /></span>
        <small>{{ olDate(n.date) }}</small>
        <b>{{ n.title }}</b>
        <p v-if="n.text">{{ n.text }}</p>
        <span class="ol-post__more">Читать на сайте<OlIcon name="right" /></span>
      </a>
    </div>
    <div v-if="tab.list.length > shown" class="ol-news__more">
      <button type="button" class="ol-btn ol-btn--line" @click="shown += 9">Показать ещё</button>
    </div>
  </div>
</template>

<style lang="scss">
.ol .ol-news {
  &__tabs {
    margin: 8px 0 24px;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  &__more {
    display: grid;
    justify-items: center;
    margin-top: 24px;
  }
}
.ol .ol-post {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border-radius: var(--ol-R);
  background: var(--ol-surf);
  &.has-img {
    padding: 0 0 20px;
    background: none;
    > :not(.ol-post__ph) {
      padding: 0 4px;
    }
  }
  &__ph {
    display: block;
    aspect-ratio: 6 / 5;
    border-radius: var(--ol-R);
    overflow: hidden;
    margin-bottom: 4px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  small {
    color: var(--ol-mute);
    font-size: 13px;
  }
  b {
    font-size: 17px;
    line-height: 1.3;
    color: var(--ol-ink);
  }
  p {
    font-size: 14.5px;
    color: var(--ol-text);
  }
  &__more {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 700;
    color: var(--ol-acc);
    .ol-icon {
      width: 16px;
      height: 16px;
    }
  }
  &:hover b {
    color: var(--ol-acc);
  }
}
@media (max-width: 989px) {
  .ol .ol-news__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 576px) {
  .ol .ol-news__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
