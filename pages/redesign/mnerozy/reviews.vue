<script lang="ts" setup>
import MrIcon from '~/components/redesign/mnerozy/MrIcon.vue'

useSeoMeta({ title: 'Отзывы — Мне розы | Концепт редизайна' })

const shop = useMnerozyShop()
const ui = useMnerozyUi()

// Отзывы покупателей из формы концепта — сверху, затем отзывы с сайта оригинала.
const all = computed(() => [
  ...shop.reviews.value.map((r) => ({ ...r, mine: true })),
  ...mrReviews.map((r) => ({ ...r, date: mrReviewDate(r.date), mine: false })),
])
const shown = ref(10)

const form = reactive({ author: '', title: '', text: '', rating: 5, error: '' })
const send = () => {
  if (!form.author.trim() || form.text.trim().length < 10) {
    form.error = 'Напишите имя и пару слов о заказе'
    return
  }
  shop.reviews.value = [
    { author: form.author.trim(), title: form.title.trim(), text: form.text.trim(), rating: form.rating, date: mrDay(new Date()) },
    ...shop.reviews.value,
  ]
  Object.assign(form, { author: '', title: '', text: '', rating: 5, error: '' })
  ui.say('Спасибо! Отзыв появился в списке. Это демо: он сохранён только в браузере')
}
</script>

<template>
  <div class="mr-wrap mr-rev">
    <nav class="mr-crumbs" aria-label="Навигация">
      <NuxtLink :to="mrPath()">Главная</NuxtLink>
      <span>Отзывы</span>
    </nav>
    <div class="mr-rev__head">
      <h1>Отзывы</h1>
      <p>{{ mrReviewsTotal + shop.reviews.value.length }} отзывов на сайте и оценки на картах Томска</p>
    </div>

    <div class="mr-rev__grid">
      <div class="mr-rev__list">
        <article v-for="r in all.slice(0, shown)" :key="r.author + r.date + r.text.slice(0, 20)" class="mr-rev__item">
          <div class="mr-rev__top">
            <span class="mr-rev__ava">{{ r.author.charAt(0) }}</span>
            <span>
              <b>{{ r.author }}</b>
              <small>{{ r.date }}<template v-if="r.mine"> · ваш отзыв</template></small>
            </span>
            <span class="mr-rev__stars" :aria-label="`Оценка ${r.rating} из 5`">
              <MrIcon v-for="i in 5" :key="i" name="star" :size="16" :class="{ 'is-on': i <= r.rating }" />
            </span>
          </div>
          <p v-if="r.title" class="mr-rev__what">Заказ: {{ r.title }}</p>
          <p>{{ r.text }}</p>
        </article>
        <button v-if="shown < all.length" type="button" class="mr-btn mr-btn--line" @click="shown += 10">Показать ещё</button>
        <p v-else class="mr-rev__more">Остальные отзывы — на <a :href="mrContacts.original + 'index.php?route=product/testimonial'" target="_blank" rel="noopener">сайте магазина</a>.</p>
      </div>

      <aside class="mr-rev__side">
        <div class="mr-rev__ratings">
          <a v-for="r in mrRatings" :key="r.title" :href="r.href" target="_blank" rel="noopener">
            <b>{{ r.value }}</b>
            <span>{{ r.title }}</span>
          </a>
        </div>
        <form class="mr-rev__form" @submit.prevent="send">
          <h2>Оставить отзыв</h2>
          <div class="mr-rev__rate" role="radiogroup" aria-label="Оценка">
            <button
              v-for="i in 5"
              :key="i"
              type="button"
              role="radio"
              :aria-checked="form.rating === i"
              :aria-label="`${i} из 5`"
              :class="{ 'is-on': i <= form.rating }"
              @click="form.rating = i"
            >
              <MrIcon name="star" :size="28" />
            </button>
          </div>
          <label class="mr-field"><span>Ваше имя</span><input v-model="form.author" @input="form.error = ''" /></label>
          <label class="mr-field"><span>Что заказывали</span><input v-model="form.title" placeholder="Например, 21 роза Эквадор" /></label>
          <label class="mr-field"><span>Отзыв</span><textarea v-model="form.text" @input="form.error = ''" /></label>
          <p v-if="form.error" class="mr-rev__err">{{ form.error }}</p>
          <button type="submit" class="mr-btn mr-btn--accent">Отправить</button>
        </form>
      </aside>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mr-rev {
  &__head {
    display: grid;
    gap: 8px;
    padding: 14px 0 24px;

    h1 {
      font-size: 34px;
    }

    p {
      color: var(--mr-muted);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: 32px;
    align-items: start;
  }

  &__list {
    display: grid;
    gap: 12px;
    justify-items: start;

    > article {
      justify-self: stretch;
    }
  }

  &__item {
    display: grid;
    gap: 10px;
    padding: 20px;
    border-radius: var(--mr-r-panel);
    border: 1px solid var(--mr-line);

    p {
      line-height: 1.6;
    }
  }

  &__top {
    display: flex;
    align-items: center;
    gap: 12px;

    > span:nth-child(2) {
      display: grid;
      flex: 1;
      min-width: 0;
      line-height: 1.3;
    }

    small {
      color: var(--mr-muted);
      font-size: 13px;
    }
  }

  &__ava {
    flex: none;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--mr-accent-soft);
    color: var(--mr-accent-dark);
    font-weight: 800;
  }

  &__stars {
    flex: none;
    display: flex;
    gap: 2px;
    color: var(--mr-line-strong);

    .is-on {
      color: #f2a20c;
      fill: currentColor;
    }
  }

  &__what {
    color: var(--mr-muted);
    font-size: 13px;
    font-weight: 600;
  }

  &__more {
    color: var(--mr-muted);
    font-size: 14px;

    a {
      color: var(--mr-accent);
      font-weight: 600;
    }
  }

  &__side {
    position: sticky;
    top: 170px;
    display: grid;
    gap: 12px;
  }

  &__ratings {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;

    a {
      display: grid;
      padding: 14px;
      border-radius: var(--mr-r-card);
      background: var(--mr-accent-soft);
      color: var(--mr-accent-dark);

      b {
        font-size: 24px;
        font-weight: 800;
      }

      span {
        font-size: 13px;
        font-weight: 600;
      }
    }
  }

  &__form {
    display: grid;
    gap: 14px;
    padding: 22px;
    border-radius: var(--mr-r-panel);
    background: var(--mr-surface);

    h2 {
      font-size: 21px;
    }

    .mr-btn {
      justify-self: start;
    }
  }

  &__rate {
    display: flex;
    gap: 2px;

    button {
      color: var(--mr-line-strong);

      &.is-on {
        color: #f2a20c;

        :deep(path) {
          fill: currentColor;
        }
      }
    }
  }

  &__err {
    color: var(--mr-accent);
    font-size: 14px;
  }
}

@media (max-width: 989px) {
  .mr-rev__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .mr-rev__side {
    position: static;
    order: -1;
  }
}

@media (max-width: 576px) {
  .mr-rev {
    &__head h1 {
      font-size: 26px;
    }

    &__item,
    &__form {
      padding: 16px;
    }

    &__top {
      flex-wrap: wrap;
    }

    &__stars {
      width: 100%;
    }
  }
}
</style>
