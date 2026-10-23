<script lang="ts" setup>
import FmIcon from '~/components/redesign/fermatomsk/FmIcon.vue'

const ui = useFermatomskUi()

useSeoMeta({ title: 'Доставка и контакты — FermaTomsk | Концепт редизайна' })

const week = [
  { d: 'пн', on: false },
  { d: 'вт', on: true },
  { d: 'ср', on: true },
  { d: 'чт', on: true },
  { d: 'пт', on: true },
  { d: 'сб', on: false },
  { d: 'вс', on: false },
]
</script>

<template>
  <div class="fm-wrap fm-delivery">
    <header class="fm-pagehead">
      <h1>Доставка и контакты</h1>
      <p>Привозим заказы по Томску сами, с фермы в посёлке Рассвет.</p>
    </header>

    <div class="fm-delivery__grid">
      <section class="fm-info">
        <span class="fm-info__icon"><FmIcon name="truck" /></span>
        <h2>Доставка по Томску — бесплатно</h2>
        <p>{{ fmContacts.delivery }}</p>
        <ul class="fm-week" aria-label="Дни доставки">
          <li v-for="w in week" :key="w.d" :class="{ 'is-on': w.on }">{{ w.d }}</li>
        </ul>
        <p v-if="ui.days.value.length" class="fm-info__next">
          Ближайшая доставка — <b>{{ ui.days.value[0].phrase }}</b>
        </p>
        <p class="fm-info__muted">Время доставки и способ оплаты подтвердим в ответ на заказ.</p>
      </section>

      <section class="fm-info">
        <span class="fm-info__icon"><FmIcon name="chat" /></span>
        <h2>Как заказать</h2>
        <p>При заказе укажите, какое количество продукта вам необходимо. Удобнее всего — собрать список на сайте и отправить его сообщением.</p>
        <NuxtLink :to="fmPath('/order')" class="fm-btn">Собрать заказ</NuxtLink>
      </section>

      <section id="contacts" class="fm-info fm-info--wide">
        <div>
          <span class="fm-info__icon"><FmIcon name="phone" /></span>
          <h2>Контакты</h2>
          <p>По вопросам приобретения нашей продукции звоните или пишите.</p>
          <a :href="fmContacts.phoneHref" class="fm-info__phone">{{ fmContacts.phone }}</a>
        </div>
        <div class="fm-info__links">
          <a :href="fmContacts.telegram" class="fm-btn" target="_blank" rel="noopener"><FmIcon name="telegram" :size="20" /> Написать в Telegram</a>
          <a :href="fmContacts.max" class="fm-btn fm-btn--ghost" target="_blank" rel="noopener"><FmIcon name="max" :size="20" /> Написать в MAX</a>
          <a :href="fmContacts.vk" class="fm-btn fm-btn--ghost" target="_blank" rel="noopener"><FmIcon name="vk" :size="20" /> ВКонтакте</a>
          <p class="fm-info__place"><FmIcon name="pin" :size="20" /><span>Ферма: {{ fmContacts.place }}</span></p>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.fm-delivery__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 28px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.fm-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: 28px;
  border-radius: var(--fm-r-lg);
  background: var(--fm-surface);
  color: var(--fm-text);

  h2 {
    font-size: 24px;
    line-height: 1.15;
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: #fff;
    color: var(--fm-green);
  }

  &__next {
    color: var(--fm-ink);
  }

  &__muted {
    color: var(--fm-muted);
    font-size: 14px;
  }

  &__phone {
    display: inline-block;
    margin-top: 8px;
    color: var(--fm-green-d);
    font-size: clamp(24px, 3vw, 32px);
    font-weight: 700;
    white-space: nowrap;
  }

  &--wide {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 24px;
    align-items: center;

    > div:first-child {
      display: grid;
      justify-items: start;
      gap: 14px;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__links {
    display: grid;
    gap: 10px;
  }

  &__place {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 4px;
    color: var(--fm-ink);

    .fm-icon {
      flex: none;
      color: var(--fm-green);
    }
  }

  @media (max-width: 576px) {
    padding: 22px 18px;
  }
}

.fm-week {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
  width: 100%;

  li {
    display: grid;
    place-items: center;
    height: 44px;
    border-radius: 10px;
    background: #fff;
    color: var(--fm-muted);
    font-weight: 500;
  }

  .is-on {
    background: var(--fm-green);
    color: #fff;
  }
}
</style>
