<script lang="ts" setup>
import FaStars from '~/components/redesign/fermaaltaya/FaStars.vue'

useSeoMeta({ title: 'Отзывы — Ферма Алтая | Концепт редизайна' })
const cart = useFermaAltaya()
const ui = useFaUi()

const mine = computed(() => cart.myReviews.value.farm ?? [])
const list = computed(() => [...mine.value, ...faReviews])
const form = reactive({ name: '', email: '', text: '', stars: 5, agree: false })
const send = () => {
  if (!form.text.trim()) return
  cart.addReview('farm', { name: form.name || 'Покупатель', date: new Date().toISOString().slice(0, 10), text: form.text.trim(), stars: form.stars })
  form.text = ''
  ui.toast.value = 'Отзыв добавлен — в концепте он виден только вам'
}
</script>

<template>
  <div class="fa-wrap fa-info fa-revs">
    <nav class="fa-crumbs" aria-label="Навигация">
      <NuxtLink :to="faPath()">Главная</NuxtLink>
      <span>Отзывы</span>
    </nav>
    <h1 class="fa-info__h1">Отзывы</h1>

    <div class="fa-revs__layout">
      <div class="fa-revs__list">
        <article v-for="(r, i) in list" :key="i" class="fa-review">
          <div class="fa-review__top">
            <b>{{ r.name }}</b><FaStars v-if="r.stars" :value="r.stars" /><small>{{ faNewsDate(r.date) }}</small>
          </div>
          <p>{{ r.text }}</p>
          <p v-if="r.reply" class="fa-review__reply"><b>Ответ администрации</b>{{ r.reply }}</p>
        </article>
        <a :href="`${FA_ORIGIN}/responses`" target="_blank" rel="noopener" class="fa-link">Более ранние отзывы — на сайте фермы</a>
      </div>

      <form class="fa-panel fa-form fa-revs__form" @submit.prevent="send">
        <h2>Оставить отзыв</h2>
        <div class="fa-revs__stars">
          <span>Оценка</span>
          <FaStars :value="form.stars" pick :size="28" @pick="form.stars = $event" />
        </div>
        <label class="fa-field"><span>Имя</span><input v-model="form.name" type="text" autocomplete="name" required /></label>
        <label class="fa-field"><span>Эл. почта</span><input v-model="form.email" type="email" autocomplete="email" /></label>
        <label class="fa-field"><span>Отзыв</span><textarea v-model="form.text" required /></label>
        <label class="fa-check"><input v-model="form.agree" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
        <button type="submit" class="fa-btn fa-btn--main">Отправить</button>
        <p class="fa-demo">На все отзывы отвечаем — ответ появится под вашим отзывом.</p>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.fa-revs {
  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 400px;
    gap: 32px;
    align-items: start;
  }
  &__list {
    display: grid;
    gap: 14px;

    > .fa-link {
      justify-self: start;
      margin-top: 6px;
    }
  }
  &__form {
    position: sticky;
    top: 140px;

    h2 {
      font-size: 26px;
    }
    .fa-field input,
    .fa-field textarea {
      background: var(--fa-card);
    }
  }
  &__stars {
    display: flex;
    align-items: center;
    gap: 12px;

    > span {
      color: var(--fa-muted);
    }
  }
  @media (max-width: 989px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }
    &__form {
      position: static;
    }
  }
}
</style>
