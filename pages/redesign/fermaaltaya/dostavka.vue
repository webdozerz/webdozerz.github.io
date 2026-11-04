<script lang="ts" setup>
import FaIcon from '~/components/redesign/fermaaltaya/FaIcon.vue'
import FaWeek from '~/components/redesign/fermaaltaya/FaWeek.vue'

useSeoMeta({ title: 'Доставка и оплата — Ферма Алтая | Концепт редизайна' })
const cart = useFermaAltaya()
const ui = useFaUi()

const schedule = [
  { until: '12:00 воскресенья', night: 'в ночь на понедельник', days: 'понедельник и вторник' },
  { until: '12:00 среды', night: 'в ночь на четверг', days: 'четверг и пятницу' },
]
</script>

<template>
  <div class="fa-wrap fa-info">
    <nav class="fa-crumbs" aria-label="Навигация">
      <NuxtLink :to="faPath()">Главная</NuxtLink>
      <span>Доставка и оплата</span>
    </nav>
    <h1 class="fa-info__h1">Доставка и оплата</h1>

    <div class="fa-info__split">
      <div class="fa-panel">
        <div class="fa-tabs fa-info__city" role="group" aria-label="Город доставки">
          <button v-for="(c, k) in faCities" :key="k" type="button" :class="{ 'is-on': cart.city.value === k }" @click="cart.city.value = k as FaCity">
            {{ c.title }}
          </button>
        </div>
        <FaWeek />
      </div>
      <img :src="faLocal('van.jpg')" alt="Фургон Фермы Алтая" width="940" height="450" class="fa-info__van" />
    </div>

    <section class="fa-section">
      <h2>Когда привезём</h2>
      <div class="fa-sched">
        <div class="fa-sched__row fa-sched__row--head"><span>Заказ до</span><span>Собираем</span><span>Привозим</span></div>
        <div v-for="s in schedule" :key="s.until" class="fa-sched__row">
          <b>{{ s.until }}</b><span>{{ s.night }}</span><b>в {{ s.days }}, с 10 до 20</b>
        </div>
      </div>
      <ul class="fa-info__list">
        <li><FaIcon name="clock" /><span>Заказы на сайте принимаем круглосуточно, все последующие встают на ближайшую доставку.</span></li>
        <li><FaIcon name="truck" /><span>Своими курьерами по Новосибирску (Академгородок, Бердск) и Барнаулу (Новоалтайск и др.). При загруженности — до 22:00.</span></li>
        <li><FaIcon name="bag" /><span>Доставка бесплатная при заказе от {{ faMoney(FA_MIN) }} — это и минимальная сумма заказа.</span></li>
        <li><FaIcon name="user" /><span>Можно заказать без регистрации: аккаунт создастся сам, пароль придёт на почту.</span></li>
      </ul>
    </section>

    <section class="fa-section">
      <h2>Оплата</h2>
      <div class="fa-info__cards">
        <div class="fa-panel"><FaIcon name="cash" /><b>Наличными курьеру</b><p>При получении заказа.</p></div>
        <div class="fa-panel"><FaIcon name="card" /><b>Картой курьеру</b><p>У курьера есть терминал.</p></div>
        <div class="fa-panel">
          <FaIcon name="shield" /><b>Онлайн на сайте</b>
          <p>ЮKassa | СБЕР: Мир, Mastercard, Visa, JCB, SberPay. Кнопка «Оплатить» появляется в заказе после сборки, когда известна точная сумма.</p>
        </div>
      </div>
      <p class="fa-info__weigh">
        <FaIcon name="scales" />
        <span>Мясо, фарш и часть полуфабрикатов — весовые. Заказы собираем в ночь на понедельник и на четверг, точную сумму узнаете к 9–10 утра.</span>
      </p>
    </section>

    <section id="bonusy" class="fa-section">
      <div class="fa-bonus">
        <div>
          <h2>Бонусная программа</h2>
          <p>С 15 декабря 2022 года зарегистрированным покупателям начисляем 2 % баллами от суммы каждого оплаченного заказа. Баллами можно оплатить свои следующие заказы, выводить их нельзя.</p>
        </div>
        <ul class="fa-bonus__ex">
          <li><span>Заказ на 3 000 ₽</span><b>+60 баллов</b></li>
          <li><span>Заказ на 5 000 ₽</span><b>+100 баллов</b></li>
          <li><span>1 балл</span><b>= 1 ₽</b></li>
        </ul>
        <NuxtLink v-if="cart.user.value" :to="faPath('/kabinet')" class="fa-btn fa-btn--main">На счёте {{ cart.user.value.balance }} баллов</NuxtLink>
        <button v-else type="button" class="fa-btn fa-btn--main" @click="ui.login.value = 'register'">Зарегистрироваться</button>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.fa-info {
  &__split {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
    gap: 20px;

    > .fa-panel {
      display: grid;
      align-content: center;
      gap: 18px;
      padding: 28px;
    }
  }
  &__city {
    max-width: 340px;
    background: var(--fa-surface-2);
  }
  &__van {
    width: 100%;
    height: 100%;
    border-radius: var(--fa-R);
    object-fit: cover;
  }
  .fa-section > h2 {
    margin-bottom: 18px;
  }
  ul.fa-info__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 28px;
    margin-top: 22px;

    li {
      display: flex;
      gap: 12px;
    }
    .fa-icon {
      flex: none;
      color: var(--fa-accent);
    }
  }
  &__cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;

    .fa-panel {
      display: grid;
      align-content: start;
      gap: 8px;

      > .fa-icon {
        color: var(--fa-accent);
      }
      b {
        color: var(--fa-dark);
        font-size: 19px;
      }
    }
  }
  &__weigh {
    display: flex;
    gap: 10px;
    margin-top: 14px;
    padding: 16px 18px;
    border-radius: 14px;
    background: var(--fa-craft);
    color: var(--fa-craft-ink);
    font-weight: 500;

    .fa-icon {
      flex: none;
    }
  }
  @media (max-width: 989px) {
    &__split {
      grid-template-columns: minmax(0, 1fr);
    }
    &__van {
      aspect-ratio: 2 / 1;
      height: auto;
    }
    &__cards {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 768px) {
    ul.fa-info__list {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 576px) {
    &__split > .fa-panel {
      padding: 18px 14px;
    }
  }
}
.fa-sched {
  display: grid;
  border: 1px solid var(--fa-line);
  border-radius: var(--fa-R);
  overflow: hidden;

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr 1.4fr;
    gap: 16px;
    padding: 16px 20px;
    border-top: 1px solid var(--fa-line);

    b {
      color: var(--fa-dark);
    }
    &--head {
      border-top: 0;
      background: var(--fa-surface);
      color: var(--fa-muted);
      font-size: 15px;
      font-weight: 700;
    }
  }
  @media (max-width: 576px) {
    &__row {
      grid-template-columns: minmax(0, 1fr);
      gap: 2px;
      padding: 14px 16px;

      &--head {
        display: none;
      }
    }
  }
}
.fa-bonus {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  align-items: center;
  gap: 20px 40px;
  padding: 32px 36px;
  border-radius: 22px;
  background: var(--fa-soft);

  p {
    margin-top: 10px;
    max-width: 640px;
  }
  ul.fa-bonus__ex {
    display: grid;
    gap: 8px;

    li {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      background: var(--fa-card);
    }
    b {
      color: var(--fa-soft-ink);
    }
  }
  > .fa-btn {
    justify-self: start;
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 24px 20px;
  }
}
</style>
