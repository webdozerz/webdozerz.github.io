<script lang="ts" setup>
import FaIcon from '~/components/redesign/fermaaltaya/FaIcon.vue'

useSeoMeta({ title: 'Контакты — Ферма Алтая | Концепт редизайна' })
const ui = useFaUi()
const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`
const form = reactive({ name: '', email: '', text: '', agree: false, sent: false })
</script>

<template>
  <div class="fa-wrap fa-info fa-contacts">
    <nav class="fa-crumbs" aria-label="Навигация">
      <NuxtLink :to="faPath()">Главная</NuxtLink>
      <span>Контакты</span>
    </nav>
    <h1 class="fa-info__h1">Контакты</h1>

    <div class="fa-contacts__layout">
      <div class="fa-contacts__cards">
        <a :href="tel(FA_PHONE)" class="fa-panel fa-contacts__card">
          <FaIcon name="phone" />
          <span><small>Телефон, Владимир</small><b>{{ FA_PHONE }}</b></span>
        </a>
        <a :href="`mailto:${FA_EMAIL}`" class="fa-panel fa-contacts__card">
          <FaIcon name="mail" />
          <span><small>Эл. почта</small><b>{{ FA_EMAIL }}</b></span>
        </a>
        <div class="fa-panel fa-contacts__card">
          <FaIcon name="clock" />
          <span><small>Режим работы</small><b>{{ FA_HOURS }}</b><small>время новосибирское, заказы на сайте — круглосуточно</small></span>
        </div>
        <a :href="FA_MAX" target="_blank" rel="noopener" class="fa-panel fa-contacts__card">
          <FaIcon name="max" />
          <span><small>Официальный канал</small><b>Ферма Алтая в MAX</b><small>новости и уведомления о заказах</small></span>
        </a>
        <div class="fa-panel fa-contacts__card fa-contacts__wide">
          <FaIcon name="pin" />
          <span>
            <small>Юридический адрес</small>
            <b>Алтайский край, Первомайский р-н, с. Рассказиха, тер. Яромакс, зд. 1</b>
            <small>ООО «КФХ «Яромакс» · ИНН 2263028539 · ОГРН 1162225100212</small>
          </span>
        </div>
        <button type="button" class="fa-btn fa-btn--line fa-contacts__cb" @click="ui.callback.value = true"><FaIcon name="phone" :size="18" />Перезвоните мне</button>
      </div>

      <form class="fa-panel fa-form fa-contacts__form" @submit.prevent="form.sent = true">
        <h2>Обратная связь</h2>
        <template v-if="!form.sent">
          <label class="fa-field"><span>Имя</span><input v-model="form.name" type="text" autocomplete="name" required /></label>
          <label class="fa-field"><span>Эл. почта</span><input v-model="form.email" type="email" autocomplete="email" required /></label>
          <label class="fa-field"><span>Сообщение</span><textarea v-model="form.text" required /></label>
          <label class="fa-check"><input v-model="form.agree" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
          <button type="submit" class="fa-btn fa-btn--main">Отправить</button>
        </template>
        <p v-else class="fa-ok"><FaIcon name="check" :size="18" />Сообщение ушло бы менеджеру — в концепте ничего не отправляется.</p>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.fa-contacts {
  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 420px;
    gap: 32px;
    align-items: start;
  }
  &__cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  &__card {
    display: flex;
    gap: 14px;
    align-items: flex-start;

    > .fa-icon {
      flex: none;
      color: var(--fa-accent);
    }
    span {
      display: grid;
      gap: 2px;
      min-width: 0;
    }
    small {
      color: var(--fa-muted);
      font-size: 14px;
    }
    b {
      overflow-wrap: anywhere;
      color: var(--fa-dark);
      font-size: 19px;
      line-height: 1.3;
    }
  }
  a.fa-contacts__card:hover b {
    color: var(--fa-accent);
  }
  &__wide {
    grid-column: 1 / -1;
  }
  &__cb {
    justify-self: start;
  }
  &__form h2 {
    font-size: 26px;
  }
  &__form .fa-field input,
  &__form .fa-field textarea {
    background: var(--fa-card);
  }
  @media (max-width: 1199px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 576px) {
    &__cards {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
