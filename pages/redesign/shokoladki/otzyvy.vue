<script lang="ts" setup>
// Отзывы: все страницы оригинала (180 отзывов), по 12 на странице, фильтр по оценке, ссылка на товар.
import { skPath, skProduct } from '~/utils/shokoladki'
import { skReviews } from '~/utils/shokoladki.texts'
import { useSkUi } from '~/composables/useShokoladki'
import SkStars from '~/components/redesign/shokoladki/SkStars.vue'

useSeoMeta({ title: 'Отзывы покупателей — АПРИОРИ | Концепт редизайна' })
const ui = useSkUi()
const to = (p: string) => skPath(p)
const rate = ref(0)
const list = computed(() => (rate.value ? skReviews.filter((r) => r.r === rate.value) : skReviews))
const per = 12
const page = ref(1)
const pages = computed(() => Math.ceil(list.value.length / per))
watch(rate, () => (page.value = 1))
const go = (n: number) => {
  page.value = n
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}
const avg = (skReviews.reduce((a, r) => a + r.r, 0) / skReviews.length).toFixed(1)
const write = () => {
  ui.review.value = ''
  ui.modal.value = 'review'
}
</script>

<template>
  <div class="sk-wrap sk-page">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>Отзывы</span>
    </nav>
    <div class="sk-rhead">
      <div class="sk-pagehead">
        <h1 class="sk-h1">Отзывы покупателей</h1>
        <p>{{ skReviews.length }} отзывов, средняя оценка {{ avg.replace('.', ',') }} из 5.</p>
      </div>
      <button type="button" class="sk-btn" @click="write">Написать отзыв</button>
    </div>
    <div class="sk-chips">
      <button type="button" class="sk-chip" :class="{ 'is-on': !rate }" @click="rate = 0">Все</button>
      <button v-for="n in [5, 4, 3, 1]" :key="n" type="button" class="sk-chip" :class="{ 'is-on': rate === n }" @click="rate = n">
        {{ n }} ★ <small>{{ skReviews.filter((r) => r.r === n).length }}</small>
      </button>
    </div>
    <div class="sk-rlist">
      <article v-for="(r, i) in list" v-show="i >= (page - 1) * per && i < page * per" :key="`${r.n}-${r.d}-${i}`" class="sk-review">
        <SkStars :value="r.r" />
        <p>{{ r.t }}</p>
        <NuxtLink v-if="skProduct(r.pid)" :to="to(`/tovar/${r.pid}/`)" class="sk-review__item">{{ r.pn }}</NuxtLink>
        <span v-else class="sk-review__item sk-muted">{{ r.pn }}</span>
        <div class="sk-review__by"><b>{{ r.n }}</b><span>{{ r.d }}</span></div>
      </article>
    </div>
    <nav v-if="pages > 1" class="sk-pages sk-rpages" aria-label="Страницы">
      <button v-for="n in pages" :key="n" type="button" :class="{ 'is-on': n === page }" @click="go(n)">{{ n }}</button>
    </nav>
  </div>
</template>
