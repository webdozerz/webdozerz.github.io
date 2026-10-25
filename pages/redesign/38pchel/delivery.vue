<script lang="ts" setup>
import PcIcon from '~/components/redesign/38pchel/PcIcon.vue'

useSeoMeta({ title: 'Доставка и оплата — 38пчёл | Концепт редизайна' })
</script>

<template>
  <div class="pc-wrap pc-info">
    <nav class="pc-crumbs" aria-label="Навигация">
      <NuxtLink :to="pcPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Доставка и оплата</span>
    </nav>
    <h1 class="pc-title">Доставка и оплата</h1>
    <p class="pc-info__lead">Доставляем лично, обычно в день заказа — если оформить заказ в первой половине дня.</p>

    <div class="pc-zones pc-info__zones">
      <div v-for="z in pcZones" :key="z.id" class="pc-zones__item">
        <PcIcon :name="z.id === 'pickup' ? 'pin' : z.id === 'russia' ? 'mail' : 'truck'" />
        <b>{{ z.title }}</b>
        <span>{{ z.text }}</span>
        <em>
          {{ z.freeFrom ? `${pcRub(z.price!)}, бесплатно от ${pcRub(z.freeFrom)}` : z.price === 0 ? 'бесплатно' : 'по тарифу перевозчика' }}
        </em>
      </div>
    </div>

    <div class="pc-info__cols">
      <section class="pc-panel">
        <h2>Доставка по Иркутску</h2>
        <ul class="pc-info__list">
          <li><PcIcon name="clock" /> <span>Обычно в день заказа, с 9:00 до 22:00</span></li>
          <li><PcIcon name="jar" /> <span>Минимальная сумма для доставки — 600 ₽</span></li>
          <li><PcIcon name="truck" /> <span>Стоимость доставки — 200 ₽. При заказе от 1000 ₽ бесплатно</span></li>
          <li>
            <PcIcon name="pin" />
            <span>Ленинский район, мкр. Зелёный, Байкальский и Голоустненский тракты, г. Шелехов — бесплатно от 1500 ₽</span>
          </li>
          <li><PcIcon name="hive" /> <span>Самовывоз по договорённости: {{ pcContacts.pickup }}, первая остановка от Маратовского кольца</span></li>
        </ul>
      </section>
      <section class="pc-panel">
        <h2>Оплата</h2>
        <ul class="pc-info__list">
          <li><PcIcon name="card" /> <span>При получении: наличными или переводом на карту</span></li>
          <li><PcIcon name="doc" /> <span>Для предприятий возможна оплата по счёту</span></li>
          <li><PcIcon name="mail" /> <span>По России — транспортной компанией или почтой, полная предоплата</span></li>
          <li><PcIcon name="shield" /> <span>Вернём деньги, если вам не понравится наш товар</span></li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.pc-info {
  &__lead {
    margin-top: 12px;
    max-width: 720px;
    font-size: 18px;
  }

  &__zones {
    margin-top: 32px;
  }

  &__cols {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 16px;

    h2 {
      margin-bottom: 18px;
      font-size: 28px;
    }
  }

  ul.pc-info__list {
    display: flex;
    flex-direction: column;
    gap: 14px;

    li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    svg {
      color: var(--pc-accent);
    }
  }

  @media (max-width: 989px) {
    &__cols {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
