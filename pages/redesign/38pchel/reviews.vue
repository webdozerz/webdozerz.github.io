<script lang="ts" setup>
import PcIcon from '~/components/redesign/38pchel/PcIcon.vue'

const shop = usePchelShop()
const ui = usePchelUi()
useSeoMeta({ title: 'Отзывы — 38пчёл | Концепт редизайна' })

const sources = ['Все', '2ГИС', 'Яндекс Карты', 'Авито']
const src = ref('Все')
const list = computed(() => pcStoreReviews.filter((r) => src.value === 'Все' || r.source === src.value))
const places = [
  { title: '2ГИС', href: pcContacts.gis },
  { title: 'Яндекс Карты', href: pcContacts.yandex },
  { title: 'Авито', href: pcContacts.avito },
]

const mine = computed(() => shop.reviews.value.filter((r) => r.product === 'store'))
const form = reactive({ author: '', text: '', error: '' })
const send = () => {
  if (!form.author.trim() || form.text.trim().length < 10) return (form.error = 'Напишите имя и отзыв — хотя бы пару слов')
  shop.reviews.value = [
    { product: 'store', author: form.author.trim(), rating: 5, text: form.text.trim(), date: new Date().toLocaleDateString('ru-RU') },
    ...shop.reviews.value,
  ]
  Object.assign(form, { author: '', text: '', error: '' })
  ui.say('Спасибо! В концепте отзыв виден только вам')
}
</script>

<template>
  <div class="pc-wrap pc-revpage">
    <nav class="pc-crumbs" aria-label="Навигация">
      <NuxtLink :to="pcPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Отзывы</span>
    </nav>
    <h1 class="pc-title">{{ pcReviewsTotal }} отзыва о нашей пасеке</h1>

    <div class="pc-revpage__grid">
      <div>
        <div class="pc-revpage__filter">
          <button v-for="s in sources" :key="s" type="button" class="pc-tag" :class="{ 'is-on': src === s }" @click="src = s">{{ s }}</button>
        </div>
        <div class="pc-revpage__list">
          <article v-for="r in mine" :key="r.date + r.text" class="pc-review">
            <p class="pc-review__text">{{ r.text }}</p>
            <p class="pc-review__meta"><b>{{ r.author }}</b> {{ r.date }} <span class="pc-review__src">ваш отзыв · демо</span></p>
          </article>
          <article v-for="r in list" :key="r.author + r.date" class="pc-review">
            <p class="pc-review__text">{{ r.text }}</p>
            <p class="pc-review__meta">
              <b>{{ r.author }}</b> {{ r.date }} <span class="pc-review__src">{{ r.source }}</span>
            </p>
          </article>
        </div>
        <p class="pc-revpage__more">Показаны последние {{ pcStoreReviews.length }} из {{ pcReviewsTotal }}. Остальные — в архиве на сайте.</p>
      </div>

      <aside class="pc-revpage__aside">
        <div class="pc-panel">
          <h2>Оставить отзыв</h2>
          <p>Будем рады отзыву здесь или на площадке, где вам удобнее:</p>
          <div class="pc-revpage__places">
            <a v-for="pl in places" :key="pl.title" :href="pl.href" target="_blank" rel="noopener" class="pc-btn pc-btn--line">
              {{ pl.title }} <PcIcon name="arrow" :size="16" />
            </a>
          </div>
          <form class="pc-revpage__form" @submit.prevent="send">
            <label class="pc-field"><span>Имя</span><input v-model="form.author" type="text" autocomplete="name" /></label>
            <label class="pc-field"><span>Отзыв</span><textarea v-model="form.text" /></label>
            <p v-if="form.error" class="pc-modal__error">{{ form.error }}</p>
            <button type="submit" class="pc-btn pc-btn--dark pc-btn--wide">Отправить</button>
          </form>
        </div>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.pc-revpage {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 32px;
    align-items: start;
    margin-top: 24px;
  }

  &__filter {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  &__more {
    margin-top: 16px;
    color: var(--pc-muted);
  }

  &__aside {
    position: sticky;
    top: 150px;

    h2 {
      font-size: 26px;
      margin-bottom: 8px;
    }
  }

  &__places {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 14px 0 20px;

    .pc-btn {
      height: 42px;
      padding: 0 14px;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }

    &__aside {
      position: static;
    }
  }

  @media (max-width: 576px) {
    &__list {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
