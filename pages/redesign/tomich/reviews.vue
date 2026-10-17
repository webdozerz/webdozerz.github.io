<script lang="ts" setup>
useSeoMeta({ title: 'Отзывы | Торговый Дом «Томич»' })

const mine = ref<{ name: string; text: string }[]>([])
const form = reactive({ name: '', email: '', text: '' })

const send = () => {
  mine.value = [{ name: form.name.trim(), text: form.text.trim() }, ...mine.value]
  form.name = ''
  form.email = ''
  form.text = ''
}
</script>

<template>
  <div class="tm-wrap tmr">
    <header class="tm-pagehead">
      <div class="tm-crumbs">
        <NuxtLink :to="tmPath()">Главная</NuxtLink><span>/</span><span>Отзывы</span>
      </div>
      <h1>Отзывы</h1>
      <p>Будем признательны, если вы оставите своё мнение о нас. После модерации оно появится в списке.</p>
    </header>

    <div class="tmr-layout">
      <section class="tmr-list" aria-label="Отзывы покупателей">
        <article v-for="(r, i) in mine" :key="'m' + i" class="tmr-item tmr-item--mine">
          <div class="tmr-item__head">
            <strong>{{ r.name }}</strong>
            <span>только что · виден только вам, ждёт модерации</span>
          </div>
          <p>{{ r.text }}</p>
        </article>

        <article v-for="r in tmReviews" :key="r.name" class="tmr-item">
          <div class="tmr-item__head">
            <strong>{{ r.name }}</strong>
            <span>{{ r.real ? r.date : 'пример отзыва для концепта' }}</span>
          </div>
          <p>{{ r.text }}</p>
        </article>
      </section>

      <form class="tmr-form" @submit.prevent="send">
        <h2>Оставить отзыв</h2>
        <label class="tm-field">
          <span>Ваше имя *</span>
          <input v-model="form.name" type="text" name="name" autocomplete="given-name" required />
        </label>
        <label class="tm-field">
          <span>Email для ответа</span>
          <input v-model="form.email" type="email" name="email" autocomplete="email" />
        </label>
        <label class="tm-field">
          <span>Сообщение *</span>
          <textarea v-model="form.text" name="text" required />
        </label>
        <button type="submit" class="tm-btn tm-btn--wide">Отправить</button>
        <p class="tmr-form__legal">
          Нажимая «Отправить», вы даёте согласие на обработку персональных данных. В концепте отзыв
          сохраняется только на этой странице.
        </p>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.tmr-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 48px;
  align-items: start;
}

.tmr-item {
  padding: 20px 0;
  border-bottom: 1px solid var(--tm-line);

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 12px;

    strong {
      font-size: 17px;
    }
    span {
      font-size: 13px;
      color: var(--tm-muted);
    }
  }
  p {
    margin-top: 8px;
    font-size: 16px;
    max-width: 680px;
    overflow-wrap: anywhere;
  }
  &--mine {
    padding-inline: 16px;
    border-radius: var(--tm-r);
    background: var(--tm-mint);
    border-bottom-color: transparent;
  }
}

.tmr-form {
  position: sticky;
  top: 130px;
  display: grid;
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--tm-line);
  border-radius: var(--tm-r-lg);

  h2 {
    font-size: 22px;
  }
  &__legal {
    font-size: 12.5px;
    color: var(--tm-muted);
  }
}

@media (max-width: 860px) {
  .tmr-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }
  .tmr-form {
    position: static;
  }
}
</style>
