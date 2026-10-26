<script lang="ts" setup>
import NsIcon from '~/components/redesign/naslagdenia/NsIcon.vue'

// Отзывы как на сайте: лента с оценками и форма, отзыв появляется после проверки (демо — в браузере).
const order = useNaslagdeniaOrder()
const ui = useNaslagdeniaUi()
const form = reactive({ name: '', email: '', rating: 5, text: '', error: '' })
const mounted = ref(false)
onMounted(() => (mounted.value = true))

const rated = nsReviews.filter((r) => r.rating)
const avg = (rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length).toFixed(1).replace('.', ',')

const send = () => {
  if (!form.name.trim()) return (form.error = 'Как вас зовут?')
  if (form.text.trim().length < 10) return (form.error = 'Напишите пару слов о торте')
  order.myReviews.value = [
    { name: form.name.trim(), email: form.email.trim(), rating: form.rating, text: form.text.trim(), date: nsIsoAfter(0) },
    ...order.myReviews.value,
  ]
  Object.assign(form, { text: '', error: '' })
  ui.say('Спасибо! Отзыв появится после проверки. Это демо')
}
useSeoMeta({ title: 'Отзывы — кондитерская «Наслаждение» | Концепт редизайна' })
</script>

<template>
  <div class="ns-wrap ns-reviews">
    <nav class="ns-crumbs" aria-label="Навигация">
      <NuxtLink :to="nsPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Отзывы</span>
    </nav>
    <h1 class="ns-page-title">Отзывы</h1>
    <p class="ns-page-lead">Около 150 отзывов на сайте. Ещё больше — на Фламп, в 2ГИС и Яндекс Картах.</p>

    <div class="ns-reviews__grid">
      <div class="ns-reviews__list">
        <template v-if="mounted">
          <article v-for="r in order.myReviews.value" :key="`my-${r.date}-${r.text}`" class="ns-review is-mine">
            <div class="ns-review__head">
              <b>{{ r.name }}</b>
              <span class="ns-review__wait">на проверке</span>
            </div>
            <span class="ns-stars"><NsIcon v-for="i in 5" :key="i" name="star" :size="18" :class="{ 'is-off': i > r.rating }" /></span>
            <p>{{ r.text }}</p>
          </article>
        </template>
        <article v-for="r in nsReviews" :key="r.name + r.date" class="ns-review">
          <div class="ns-review__head">
            <b>{{ r.name }}</b>
            <span>{{ nsDateText(r.date, false) }} {{ r.date.slice(0, 4) }}</span>
          </div>
          <span v-if="r.rating" class="ns-stars" :aria-label="`Оценка ${r.rating} из 5`">
            <NsIcon v-for="i in 5" :key="i" name="star" :size="18" :class="{ 'is-off': i > r.rating }" />
          </span>
          <p>{{ r.text }}</p>
        </article>
      </div>

      <aside class="ns-reviews__side">
        <div class="ns-reviews__score">
          <b>{{ avg }}</b>
          <span>
            <span class="ns-stars"><NsIcon v-for="i in 5" :key="i" name="star" :size="18" /></span>
            <small>средняя оценка последних отзывов</small>
          </span>
        </div>
        <div class="ns-reviews__links">
          <a v-for="l in nsContacts.reviewLinks" :key="l.title" :href="l.href" target="_blank" rel="noopener" class="ns-btn ns-btn--line">{{
            l.title
          }}</a>
        </div>

        <form class="ns-reviews__form" @submit.prevent="send">
          <h2>Оставить отзыв</h2>
          <div class="ns-field">
            <span>Оценка</span>
            <div class="ns-rate">
              <button
                v-for="i in 5"
                :key="i"
                type="button"
                :class="{ 'is-on': i <= form.rating }"
                :aria-label="`${i} из 5`"
                @click="form.rating = i"
              >
                <NsIcon name="star" :size="28" />
              </button>
            </div>
          </div>
          <label class="ns-field">
            <span>Имя</span>
            <input v-model="form.name" class="ns-input" type="text" autocomplete="given-name" />
          </label>
          <label class="ns-field">
            <span>E-mail — не публикуем</span>
            <input v-model="form.email" class="ns-input" type="email" autocomplete="email" />
          </label>
          <label class="ns-field">
            <span>Отзыв</span>
            <textarea v-model="form.text" rows="4" placeholder="Какой торт брали, к какому празднику" />
          </label>
          <p v-if="form.error" class="ns-error">{{ form.error }}</p>
          <button type="submit" class="ns-btn ns-btn--main ns-btn--lg">Отправить</button>
          <small class="ns-reviews__mod">Отзыв появится на сайте после проверки.</small>
        </form>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.ns .ns-reviews {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 400px;
    gap: 32px;
    align-items: start;
    margin-top: 28px;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__list {
    display: grid;
    gap: 12px;
  }

  &__side {
    position: sticky;
    top: 136px;
    display: grid;
    gap: 16px;

    @media (max-width: 989px) {
      position: static;
      order: -1;
    }
  }

  &__score {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    background: var(--ns-surface);
    border-radius: var(--ns-r-card);

    > b {
      font-family: var(--ns-head);
      font-size: 56px;
      line-height: 1;
      color: var(--ns-dark);
    }

    > span {
      display: grid;
      gap: 4px;
    }

    small {
      font-size: 13px;
      color: var(--ns-muted);
    }
  }

  &__links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__form {
    display: grid;
    gap: 14px;
    padding: 24px;
    border: 1px solid var(--ns-line);
    border-radius: var(--ns-r-card);

    h2 {
      font-size: 26px;
    }

    @media (max-width: 576px) {
      padding: 20px 16px;
    }
  }

  &__mod {
    font-size: 13px;
    color: var(--ns-muted);
  }
}

.ns .ns-review {
  display: grid;
  gap: 8px;
  padding: 20px 22px;
  border: 1px solid var(--ns-line);
  border-radius: var(--ns-r-card);

  &.is-mine {
    background: var(--ns-surface);
  }

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 4px 12px;

    b {
      color: var(--ns-dark);
    }

    span {
      font-size: 13px;
      color: var(--ns-muted);
    }
  }

  &__wait {
    padding: 2px 10px;
    background: var(--ns-gold-soft);
    border-radius: 999px;
  }

  @media (max-width: 576px) {
    padding: 16px;
  }
}

.ns .ns-rate {
  display: flex;
  gap: 2px;

  button {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    color: var(--ns-line-strong);
    background: none;
    border: 0;

    &.is-on {
      color: var(--ns-gold);

      path {
        fill: currentColor;
      }
    }
  }
}
</style>
