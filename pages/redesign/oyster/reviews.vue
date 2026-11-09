<script lang="ts" setup>
import { oyPath, oyReviews } from '~/utils/oyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'
import OyPhone from '~/components/redesign/oyster/OyPhone.vue'

useSeoMeta({ title: 'Отзывы — Oyster Market | Концепт редизайна' })
const route = useRoute()
const PER = 12
const pages = Math.ceil(oyReviews.length / PER)
const page = computed(() => Math.min(pages, Math.max(1, Number(route.query.page) || 1)))
const items = computed(() => oyReviews.slice((page.value - 1) * PER, page.value * PER))

const f = reactive({ name: '', phone: '', text: '' })
const sent = ref(false)
const ok = computed(() => f.name.trim() && f.text.trim().length > 5)
const formEl = ref<HTMLElement | null>(null)
const toForm = () => formEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
</script>

<template>
  <div class="oy-wrap oy-page">
    <nav class="oy-crumbs" aria-label="Навигация">
      <NuxtLink :to="oyPath('/')">Главная</NuxtLink>
      <span><NuxtLink :to="oyPath('/company/')">О компании</NuxtLink></span>
      <span>Отзывы</span>
    </nav>
    <div class="oy-head">
      <div>
        <h1 class="oy-title">Отзывы</h1>
        <p>{{ oyReviews.length }} отзывов покупателей · страница {{ page }} из {{ pages }}</p>
      </div>
      <button type="button" class="oy-btn oy-btn--accent" @click="toForm">Оставить свой отзыв</button>
    </div>
    <div class="oy-revlist">
      <figure v-for="r in items" :key="r.name + r.text.slice(0, 12)" class="oy-rev">
        <OyIcon name="quote" :size="24" />
        <blockquote>{{ r.text }}</blockquote>
        <figcaption>{{ r.name }}</figcaption>
      </figure>
    </div>
    <nav class="oy-pager" aria-label="Страницы отзывов">
      <NuxtLink v-for="n in pages" :key="n" :to="oyPath(`/reviews/${n > 1 ? `?page=${n}` : ''}`)" :class="{ 'is-on': n === page }">{{ n }}</NuxtLink>
    </nav>

    <section ref="formEl" class="oy-sec">
      <form v-if="!sent" class="oy-box oy-revform" @submit.prevent="ok && (sent = true)">
        <h2>Оставить свой отзыв</h2>
        <div class="oy-form-grid">
          <label class="oy-field"><span>Имя</span><input v-model="f.name" autocomplete="name" /></label>
          <label class="oy-field"><span>Телефон</span><OyPhone v-model="f.phone" /></label>
        </div>
        <label class="oy-field"><span>Отзыв</span><textarea v-model="f.text" rows="4" placeholder="Что заказывали, как доставили, понравилось ли" /></label>
        <button type="submit" class="oy-btn oy-btn--accent" :disabled="!ok">Отправить</button>
        <small class="oy-modal__note">Отзыв появится после проверки модератором</small>
      </form>
      <div v-else class="oy-box oy-revform"><b>Спасибо, {{ f.name }}!</b> В концепте отзыв никуда не уходит — на сайте он появится после проверки.</div>
    </section>
  </div>
</template>

<style lang="scss">
.oy-revlist { columns: 3 300px; column-gap: 16px; .oy-rev { break-inside: avoid; margin: 0 0 16px; } }
.oy-pager {
  display: flex; gap: 8px; justify-content: center; margin-top: 12px;
  a { display: grid; place-items: center; min-width: 44px; height: 44px; border-radius: 10px; border: 1px solid var(--oy-line); font-weight: 700; color: var(--oy-ink); &:hover { border-color: var(--oy-accent); } &.is-on { background: var(--oy-accent); border-color: var(--oy-accent); color: #fff; } }
}
.oy-revform { display: grid; gap: 14px; max-width: 760px; h2 { font-size: 30px; } }
</style>
