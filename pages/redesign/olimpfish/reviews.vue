<script lang="ts" setup>
import { olPath, olReviews } from '~/utils/olimpfish'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'

useSeoMeta({ title: 'Отзывы — Олимп | Концепт редизайна' })
const PER = 8
const page = ref(1)
const pages = Math.ceil(olReviews.length / PER)
const list = computed(() => olReviews.slice((page.value - 1) * PER, page.value * PER))
const go = (n: number) => {
  page.value = n
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="ol-wrap ol-page ol-reviews">
    <nav class="ol-crumbs" aria-label="Навигация">
      <NuxtLink :to="olPath('/')">Главная</NuxtLink>
      <span><NuxtLink :to="olPath('/about')">О компании</NuxtLink></span>
      <span>Отзывы</span>
    </nav>
    <h1 class="ol-title">Отзывы наших клиентов</h1>
    <p class="ol-lead">{{ olReviews.length }} отзывов о рыбе, икре и доставке — как их написали покупатели.</p>
    <div class="ol-reviews__grid">
      <article v-for="r in list" :key="r.name + r.text.length" class="ol-rev">
        <span class="ol-rev__stars"><OlIcon v-for="i in 5" :key="i" name="star" /></span>
        <p>{{ r.text }}</p>
        <b>{{ r.name }}</b>
      </article>
    </div>
    <nav class="ol-pager" aria-label="Страницы отзывов">
      <button type="button" :disabled="page === 1" aria-label="Назад" @click="go(page - 1)"><OlIcon name="left" /></button>
      <button v-for="n in pages" :key="n" type="button" :class="{ 'is-on': page === n }" @click="go(n)">{{ n }}</button>
      <button type="button" :disabled="page === pages" aria-label="Вперёд" @click="go(page + 1)"><OlIcon name="right" /></button>
    </nav>
  </div>
</template>

<style lang="scss">
.ol .ol-reviews__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 26px;
}
.ol .ol-pager {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 28px;
  button {
    min-width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border: 1px solid var(--ol-line);
    border-radius: 10px;
    background: #fff;
    font-weight: 700;
    color: var(--ol-ink);
    &.is-on {
      background: var(--ol-ink);
      border-color: var(--ol-ink);
      color: #fff;
    }
    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
}
@media (max-width: 768px) {
  .ol .ol-reviews__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
