<script lang="ts" setup>
import BkIcon from '~/components/redesign/bukety/BkIcon.vue'

useSeoMeta({ title: 'Отзывы — Любимые Букеты | Концепт редизайна' })

const shop = useBuketyShop()
const ui = useBuketyUi()
const mine = computed(() => shop.reviews.value)
const form = reactive({ author: '', rating: 5, text: '' })
const send = () => {
  if (!form.author.trim() || form.text.trim().length < 5) return ui.say('Напишите имя и пару слов о заказе')
  shop.reviews.value = [{ product: '', author: form.author.trim(), rating: form.rating, text: form.text.trim(), date: new Date().toISOString() }, ...shop.reviews.value]
  form.text = ''
  ui.say('Спасибо! Отзыв виден только вам — это демо')
}
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
</script>

<template>
  <div class="bk-wrap bk-info">
    <nav class="bk-crumbs">
      <NuxtLink :to="bkPath()">Главная</NuxtLink>
      <span>Отзывы</span>
    </nav>
    <h1>Отзывы</h1>
    <p class="bk-info__lead">Оценки покупателей на картах и в справочниках — и место для вашего отзыва о заказе.</p>

    <div class="bk-rev__rating">
      <div v-for="r in bkContacts.rating" :key="r.title">
        <b><span class="bk-stars"><BkIcon name="star" :size="28" /></span> {{ r.value }}</b>
        <small>Рейтинг {{ r.title }}</small>
      </div>
    </div>

    <div class="bk-revgrid bk-rev__grid">
      <div>
        <ul v-if="mine.length" class="bk-reviews">
          <li v-for="r in mine" :key="r.date">
            <div>
              <b>{{ r.author }}</b>
              <span class="bk-stars"><BkIcon v-for="n in 5" :key="n" name="star" :size="16" :class="{ 'is-off': n > r.rating }" /></span>
            </div>
            <p>{{ r.text }}</p>
            <small>
              {{ fmtDate(r.date) }}
              <template v-if="r.product && bkFind(r.product)"> · <NuxtLink :to="bkPath(`/product/${r.product}`)">{{ bkFind(r.product)!.title }}</NuxtLink></template>
              · <span class="bk-demo">виден только вам</span>
            </small>
          </li>
        </ul>
        <div v-else class="bk-rev__empty">
          <BkIcon name="camera" :size="36" />
          <p>
            Здесь будут отзывы покупателей и фото вручений, которые присылаем каждому, кто отметил «Фото получателя с букетом». На сайте магазина этот раздел
            пока пуст — в концепте его можно заполнить отзывами с 2ГИС и Флампа.
          </p>
        </div>
      </div>
      <form class="bk-panel bk-revform" @submit.prevent="send">
        <h3>Оставить отзыв</h3>
        <div class="bk-revform__stars" role="radiogroup" aria-label="Оценка">
          <button v-for="n in 5" :key="n" type="button" :aria-label="`${n} из 5`" :class="{ 'is-on': n <= form.rating }" @click="form.rating = n">
            <BkIcon name="star" :size="26" />
          </button>
        </div>
        <label class="bk-field"><span>Имя</span><input v-model="form.author" type="text" autocomplete="name" /></label>
        <label class="bk-field"><span>Отзыв</span><textarea v-model="form.text" rows="4" /></label>
        <button type="submit" class="bk-btn bk-btn--accent">Отправить</button>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.bk-rev {
  &__rating {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;

    > div {
      display: grid;
      gap: 4px;
      min-width: 200px;
      padding: 20px 24px;
      border-radius: 20px;
      background: var(--bk-surface);
    }

    b {
      font-size: 40px;
      font-weight: 800;
      line-height: 1;
    }

    small {
      color: var(--bk-muted);
      font-weight: 700;
    }
  }

  &__grid {
    margin-top: 32px;
  }

  &__empty {
    display: flex;
    gap: 16px;
    padding: 24px;
    border-radius: 20px;
    border: 1px dashed var(--bk-line-strong);
    color: var(--bk-muted);

    svg {
      flex: none;
      color: var(--bk-accent);
    }
  }
}

.bk-reviews small a {
  color: var(--bk-accent);
  font-weight: 700;
}

@media (max-width: 576px) {
  .bk-rev__rating > div {
    flex: 1 1 140px;
    min-width: 0;
    padding: 16px;
  }

  .bk-rev__empty {
    flex-direction: column;
    padding: 18px;
  }
}
</style>
