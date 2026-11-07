<script lang="ts" setup>
import DrIcon from '~/components/redesign/dereda/DrIcon.vue'
import DrTickets from '~/components/redesign/dereda/DrTickets.vue'

useSeoMeta({ title: 'Оплата и доставка — Дереда | Концепт редизайна' })
</script>

<template>
  <div class="dr-wrap dr-page dr-info">
    <nav class="dr-crumbs" aria-label="Навигация">
      <NuxtLink :to="drPath('/')">Главная</NuxtLink>
      <span>Оплата и доставка</span>
    </nav>
    <h1>Оплата и доставка</h1>

    <section class="dr-info__lead">
      <div class="dr-info__text">
        <p>
          Доставляем по вторникам и пятницам с 10:00 до 20:00 — домой, в офис, на дачу. Фермеры принимают заказы на вторник до 23:59 воскресенья, на пятницу — до
          23:59 среды, и делают продукцию специально под них.
        </p>
        <p>За день до доставки, в понедельник и четверг, пришлём на e-mail и в WhatsApp двухчасовой интервал.</p>
      </div>
      <DrTickets :n="4" />
    </section>

    <section class="dr-sec">
      <h2>Зоны доставки</h2>
      <p class="dr-muted dr-info__sub">Бесплатно — от суммы заказа для вашей зоны. Минимальный заказ — 1 000 ₽.</p>
      <div class="dr-zones">
        <div v-for="z in drZones" :key="z.id" class="dr-zones__item">
          <b class="dr-zones__n">Зона {{ z.id }}</b>
          <p>{{ z.districts.join(', ') }}</p>
          <div class="dr-zones__price">
            <span>бесплатно от <b>{{ drMoney(z.free) }}</b></span>
            <span>иначе <b>{{ drMoney(z.fee) }}</b></span>
          </div>
        </div>
      </div>
    </section>

    <section class="dr-sec dr-info__cols">
      <div class="dr-panel">
        <DrIcon name="pin" :size="28" />
        <h3>Самовывоз</h3>
        <p>{{ drContacts.address }}<br />{{ drContacts.office }}</p>
      </div>
      <div class="dr-panel">
        <DrIcon name="cash" :size="28" />
        <h3>Оплата</h3>
        <p>Наличными или переводом на банковский счёт при получении заказа. При оплате на расчётный счёт доставляем после поступления денег.</p>
      </div>
      <div class="dr-panel">
        <DrIcon name="scales" :size="28" />
        <h3>Весовой товар</h3>
        <p>Если в заказе есть весовые позиции, итоговая сумма может измениться в большую или меньшую сторону.</p>
      </div>
    </section>

    <section id="reglament" class="dr-sec">
      <h2>Регламент работы</h2>
      <ol class="dr-info__rules">
        <li>После оформления придёт уведомление, что заказ принят, с суммой и телефоном для вопросов. Накануне доставки — второе, с датой и временем.</li>
        <li>Отказаться от заказа можно до 16:00 воскресенья, если заказ на вторник, или до 16:00 среды, если на пятницу.</li>
        <li>Если покупателя нет на месте и с ним не связаться, курьер ждёт 15 минут.</li>
        <li>Покупатель оплачивает товары по факту получения или переводом на расчётный счёт — тогда доставка после поступления денег.</li>
        <li>Подъём в квартиру — бесплатно, какой бы тяжёлый ни был заказ.</li>
      </ol>
    </section>
  </div>
</template>

<style lang="scss">
.dr-info {
  h1 {
    margin-bottom: 22px;
  }

  h2 {
    margin-bottom: 16px;
  }

  &__sub {
    margin: -8px 0 18px;
  }

  &__lead {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    gap: 32px;
    align-items: start;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__text {
    display: grid;
    gap: 12px;
    font-size: 18px;
  }

  &__cols {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;

    .dr-panel {
      display: grid;
      align-content: start;
      gap: 8px;

      > svg {
        color: var(--dr-brown);
      }
    }

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  ol.dr-info__rules {
    display: grid;
    gap: 10px;
    max-width: 860px;
    padding-left: 22px;
    list-style: decimal;
    font-size: 17px;

    li::marker {
      color: var(--dr-accent);
      font-weight: 700;
    }
  }
}

.dr-zones {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }

  &__item {
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: 10px;
    padding: 20px;
    border: 1px solid var(--dr-line);
    border-radius: var(--dr-R);

    p {
      color: var(--dr-text);
      font-size: 15px;
    }
  }

  &__n {
    color: var(--dr-brown);
    font-family: var(--dr-head);
    font-size: 24px;
    font-weight: 400;
  }

  &__price {
    display: grid;
    gap: 2px;
    padding-top: 10px;
    border-top: 1px solid var(--dr-line);
    color: var(--dr-muted);
    font-size: 15px;

    b {
      color: var(--dr-text);
    }
  }
}
</style>
