<script lang="ts" setup>
import FaIcon from '~/components/redesign/fermaaltaya/FaIcon.vue'
import FaMask from '~/components/redesign/fermaaltaya/FaMask.vue'

useSeoMeta({ title: 'Личный кабинет — Ферма Алтая | Концепт редизайна' })
const cart = useFermaAltaya()
const ui = useFaUi()
const logout = () => {
  cart.user.value = null
  ui.toast.value = 'Вы вышли'
}
const surveyLabels = ['', 'Неудобно', 'Так себе', 'Нормально', 'Удобно', 'Очень удобно']
</script>

<template>
  <div class="fa-wrap fa-info fa-acc">
    <nav class="fa-crumbs" aria-label="Навигация">
      <NuxtLink :to="faPath()">Главная</NuxtLink>
      <span>Личный кабинет</span>
    </nav>

    <div v-if="!cart.user.value" class="fa-empty fa-acc__guest">
      <FaMask sec="ptitsa" :size="48" />
      <b>Войдите, чтобы копить баллы</b>
      <p>2 % от каждого оплаченного заказа возвращаются баллами — ими можно оплатить следующие заказы. Заказывать можно и без входа.</p>
      <div class="fa-acc__btns">
        <button type="button" class="fa-btn fa-btn--main" @click="ui.login.value = 'login'">Войти</button>
        <button type="button" class="fa-btn fa-btn--line" @click="ui.login.value = 'register'">Регистрация</button>
      </div>
    </div>

    <template v-else>
      <div class="fa-acc__head">
        <h1 class="fa-info__h1">{{ cart.user.value.name }}</h1>
        <button type="button" class="fa-link" @click="logout">Выйти</button>
      </div>
      <div class="fa-acc__grid">
        <div class="fa-panel fa-acc__bal">
          <FaIcon name="coin" />
          <span><small>Бонусный счёт</small><b>{{ cart.user.value.balance }} баллов</b><small>1 балл = 1 ₽ · демо-баллы для примера</small></span>
        </div>
        <NuxtLink :to="faPath('/izbrannoe')" class="fa-panel fa-acc__bal">
          <FaIcon name="heart" />
          <span><small>Избранное</small><b>{{ faPlural(cart.fav.value.length, 'товар', 'товара', 'товаров') }}</b></span>
        </NuxtLink>
      </div>

      <section class="fa-section">
        <h2>Мои заказы</h2>
        <div v-if="cart.orders.value.length" class="fa-acc__orders">
          <div v-for="o in cart.orders.value" :key="o.n" class="fa-acc__order">
            <b>№{{ o.n }}</b>
            <span>{{ faNewsDate(o.date) }} · {{ o.count }} шт · {{ faCities[o.city].title }}, {{ o.wave }}</span>
            <span class="fa-acc__status">Собираем — пришлём сумму</span>
            <b>≈ {{ faRange(o.total) }}</b>
            <button type="button" class="fa-btn fa-btn--line fa-btn--sm" @click="ui.toast.value = 'Кнопка «Оплатить» станет активной после сборки и взвешивания'">Оплатить</button>
          </div>
        </div>
        <p v-else class="fa-demo">Заказов пока нет. Оформленные в концепте заказы появятся здесь.</p>
      </section>

      <section class="fa-section">
        <div class="fa-panel fa-acc__survey">
          <h2>Оцените удобство сайта</h2>
          <div class="fa-acc__scale" role="group" aria-label="Оценка от 1 до 5">
            <button v-for="n in 5" :key="n" type="button" :class="{ 'is-on': cart.survey.value === n }" @click="cart.survey.value = n">
              <b>{{ n }}</b><small>{{ surveyLabels[n] }}</small>
            </button>
          </div>
          <p v-if="cart.survey.value" class="fa-ok"><FaIcon name="check" :size="18" />Спасибо! Ваш ответ — «{{ surveyLabels[cart.survey.value] }}».</p>
        </div>
      </section>
    </template>
  </div>
</template>

<style lang="scss">
.fa-acc {
  &__guest {
    margin-top: 24px;
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 8px 20px;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  &__bal {
    display: flex;
    gap: 14px;

    > .fa-icon {
      flex: none;
      color: var(--fa-accent);
    }
    span {
      display: grid;
    }
    small {
      color: var(--fa-muted);
      font-size: 14px;
    }
    b {
      color: var(--fa-dark);
      font-size: 24px;
    }
  }
  .fa-section > h2 {
    margin-bottom: 14px;
  }
  &__orders {
    display: grid;
    border-top: 1px solid var(--fa-line);
  }
  &__order {
    display: grid;
    grid-template-columns: 90px minmax(0, 1fr) auto auto auto;
    align-items: center;
    gap: 6px 18px;
    padding: 14px 0;
    border-bottom: 1px solid var(--fa-line);

    b {
      color: var(--fa-dark);
      white-space: nowrap;
    }
  }
  &__status {
    color: var(--fa-craft-ink);
    font-weight: 700;
  }
  &__survey {
    display: grid;
    gap: 16px;

    h2 {
      font-size: 24px;
    }
  }
  &__scale {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 8px;
    max-width: 640px;

    button {
      display: grid;
      justify-items: center;
      gap: 2px;
      padding: 12px 4px;
      border: 1px solid var(--fa-line);
      border-radius: 12px;
      background: var(--fa-card);

      b {
        color: var(--fa-dark);
        font-size: 22px;
      }
      small {
        color: var(--fa-muted);
        font-size: 13px;
        white-space: nowrap;
      }
      &.is-on {
        border-color: var(--fa-accent);
        background: var(--fa-soft);
      }
    }
  }
  @media (max-width: 768px) {
    &__order {
      grid-template-columns: auto minmax(0, 1fr);

      > span:nth-child(2) {
        grid-column: 1 / -1;
        grid-row: 2;
      }
      .fa-btn {
        justify-self: end;
      }
    }
  }
  @media (max-width: 576px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
    &__scale small {
      display: none;
    }
  }
}
</style>
