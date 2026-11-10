<script lang="ts" setup>
import { olContacts, olPath } from '~/utils/olimpfish'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'

useSeoMeta({ title: 'Оплата и доставка — Олимп | Концепт редизайна' })
const zones = [
  { zone: 'В пределах МКАД', price: '350 ₽', note: 'в будние дни' },
  { zone: 'До 10 км от МКАД', price: '500 ₽', note: 'бесплатно при заказе от 20 000 ₽' },
  { zone: 'От 10 до 40 км от МКАД', price: '40 ₽ за км', note: 'например, 25 км — 1 000 ₽' },
  { zone: 'Более 40 км от МКАД', price: '50 ₽ за км', note: 'за каждый км' },
  { zone: 'Срочная доставка', price: 'от 500 ₽', note: 'в течение 3 часов после оформления, оплата онлайн' },
]
</script>

<template>
  <div class="ol-wrap ol-page ol-info">
    <nav class="ol-crumbs" aria-label="Навигация">
      <NuxtLink :to="olPath('/')">Главная</NuxtLink>
      <span>Оплата и доставка</span>
    </nav>
    <h1 class="ol-title">Оплата и доставка</h1>
    <p class="ol-lead">Онлайн-заказы принимаются 24/7, «сегодня на завтра». Доставка — при заказе от 5000 рублей.</p>

    <div class="ol-info__grid">
      <section class="ol-info__card ol-info__card--wide">
        <h2><OlIcon name="truck" />Доставка по Москве и области</h2>
        <table class="ol-zones">
          <thead><tr><th>Куда</th><th>Стоимость</th><th>Условия</th></tr></thead>
          <tbody>
            <tr v-for="z in zones" :key="z.zone"><td>{{ z.zone }}</td><td><b>{{ z.price }}</b></td><td>{{ z.note }}</td></tr>
          </tbody>
        </table>
        <p class="ol-info__small">Стоимость за пределами МКАД считается по расстоянию — в корзине можно указать километры и сразу увидеть сумму.</p>
      </section>

      <section class="ol-info__card">
        <h2><OlIcon name="pin" />Самовывоз</h2>
        <p>{{ olContacts.address }} (станция метро «Озёрная»).</p>
        <p>Магазин работает {{ olContacts.hours.toLowerCase() }}. Можно приехать, попробовать рыбу и посмотреть документы.</p>
        <a :href="olContacts.map" target="_blank" rel="noopener" class="ol-link">Открыть на карте<OlIcon name="right" /></a>
      </section>

      <section class="ol-info__card">
        <h2><OlIcon name="card" />Оплата</h2>
        <ul class="ol-info__list">
          <li><OlIcon name="check" />Наличными курьеру в руки при доставке или при самовывозе</li>
          <li><OlIcon name="check" />По QR-коду по счёту</li>
          <li class="is-off"><OlIcon name="close" />Банковской картой онлайн — временно недоступно</li>
        </ul>
      </section>

      <section class="ol-info__card">
        <h2><OlIcon name="knife" />Весовой товар</h2>
        <p>Цена весовых позиций указана за выбранный вес. Итоговая сумма может измениться при формировании заказа на складе — менеджер уточнит её при подтверждении.</p>
      </section>

      <section class="ol-info__card">
        <h2><OlIcon name="pack" />Оптовым покупателям</h2>
        <p>Сроки поставки рассчитываются индивидуально и зависят от объёмов и способа доставки. Возможна поставка на следующий день, работаем с регионами.</p>
        <NuxtLink :to="olPath('/opt')" class="ol-link">Партнёрам и оптовикам<OlIcon name="right" /></NuxtLink>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.ol .ol-info {
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
    margin-top: 28px;
    align-items: start;
  }
  &__card {
    display: grid;
    gap: 12px;
    justify-items: start;
    padding: 24px;
    border-radius: var(--ol-R);
    background: var(--ol-surf);
    h2 {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      .ol-icon {
        width: 26px;
        height: 26px;
        color: var(--ol-acc);
      }
    }
    &--wide {
      grid-column: 1 / -1;
      background: #fff;
      border: 1px solid var(--ol-line);
    }
  }
  &__small {
    font-size: 14px;
    color: var(--ol-mute);
  }
  ul.ol-info__list {
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
    li {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      .ol-icon {
        color: var(--ol-green);
        margin-top: 2px;
      }
      &.is-off {
        color: var(--ol-mute);
        .ol-icon {
          color: var(--ol-mute);
        }
      }
    }
  }
}
.ol .ol-zones {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  th {
    text-align: left;
    padding: 0 12px 10px 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--ol-mute);
  }
  td {
    padding: 12px 12px 12px 0;
    border-top: 1px solid var(--ol-line);
    vertical-align: top;
  }
  b {
    color: var(--ol-ink);
    white-space: nowrap;
  }
  td:last-child {
    color: var(--ol-mute);
  }
}
@media (max-width: 768px) {
  .ol .ol-info__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .ol .ol-info__card {
    padding: 18px;
  }
  .ol .ol-zones {
    thead {
      display: none;
    }
    tr {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 2px 12px;
      padding: 10px 0;
      border-top: 1px solid var(--ol-line);
    }
    td {
      padding: 0;
      border: 0;
    }
    td:last-child {
      grid-column: 1 / -1;
      font-size: 13.5px;
    }
  }
}
</style>
