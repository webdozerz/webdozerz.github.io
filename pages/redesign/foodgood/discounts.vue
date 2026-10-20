<script lang="ts" setup>
import FgCard from '~/components/redesign/foodgood/FgCard.vue'

useSeoMeta({ title: 'Система лояльности и скидки | FoodGood Tomsk' })

const loyalty = [
  'При любой покупке в магазине назовите продавцу ФИО и номер телефона — так вы станете участником.',
  'Когда сумма покупок достигнет порога, скидка начнёт действовать постоянно.',
  'Чтобы воспользоваться скидкой, называйте номер телефона при каждой покупке.',
]
const review = [
  'Оставьте фото-отзыв на одной площадке: 2ГИС, ВКонтакте или Instagram.',
  'Покажите скриншот отзыва давностью не больше месяца.',
  'Получите скидку 10% на любой следующий заказ или покупку.',
]

// Калькулятор: сколько осталось до следующей ступени.
const spent = ref(18000)
const level = computed(() => (spent.value >= 35000 ? 5 : spent.value >= 25000 ? 3 : 0))
const nextGoal = computed(() => (spent.value < 25000 ? 25000 : spent.value < 35000 ? 35000 : 0))
</script>

<template>
  <div class="fg-wrap">
    <div class="fg-page-head">
      <nav class="fg-crumbs" aria-label="Навигация">
        <NuxtLink :to="fgPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>Скидки</span>
      </nav>
      <h1>Система лояльности и скидки</h1>
      <p>Постоянная скидка для своих покупателей, скидка за отзыв и акционные товары до −50%.</p>
    </div>

    <div class="cards">
      <article class="fg-panel card">
        <h2>Накопительная скидка</h2>
        <div class="tiers">
          <div class="tier" :class="{ 'is-on': level === 3 }">
            <strong>3%</strong>
            <span>после покупок на 25 000 ₽</span>
          </div>
          <div class="tier" :class="{ 'is-on': level === 5 }">
            <strong>5%</strong>
            <span>после покупок на 35 000 ₽</span>
          </div>
        </div>

        <div class="calc">
          <label for="fg-spent">Сколько вы уже купили у нас</label>
          <output class="fg-price">{{ fgFormatPrice(spent) }}</output>
          <input id="fg-spent" v-model.number="spent" type="range" min="0" max="45000" step="500" />
          <p v-if="nextGoal">
            До скидки {{ nextGoal === 25000 ? '3%' : '5%' }} осталось
            <strong class="fg-price">{{ fgFormatPrice(nextGoal - spent) }}</strong>
          </p>
          <p v-else><strong>Ваша скидка 5% — максимальная</strong></p>
        </div>

        <ol class="steps">
          <li v-for="(s, i) in loyalty" :key="i">{{ s }}</li>
        </ol>
      </article>

      <article class="fg-panel card card--review">
        <h2>Скидка за фото-отзыв</h2>
        <div class="tiers">
          <div class="tier is-on">
            <strong>−10%</strong>
            <span>на любой следующий заказ</span>
          </div>
        </div>
        <ol class="steps">
          <li v-for="(s, i) in review" :key="i">{{ s }}</li>
        </ol>
        <NuxtLink :to="fgPath('/reviews')" class="fg-btn fg-btn--line">Посмотреть фото-отзывы</NuxtLink>
      </article>
    </div>

    <section class="fg-section">
      <div class="fg-head">
        <h2>Товары со скидкой</h2>
        <NuxtLink :to="fgPath('/catalog/sale')" class="fg-link">Все акции</NuxtLink>
      </div>
      <div class="fg-grid">
        <FgCard v-for="p in fgSale()" :key="p.id" :product="p" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
}

.card {
  display: grid;
  gap: 20px;

  h2 {
    font-size: 24px;
  }

  .fg-btn {
    justify-self: start;
  }
}

.tiers {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.tier {
  display: grid;
  gap: 4px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #fff;
  transition: box-shadow 0.15s;

  strong {
    color: var(--fg-leaf);
    font-size: 36px;
    font-weight: 600;
    line-height: 1;
  }

  span {
    color: var(--fg-muted);
    font-size: 15px;
    line-height: 1.35;
  }

  &.is-on {
    box-shadow: inset 0 0 0 1.5px var(--fg-leaf);
  }
}

.calc {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  gap: 8px 12px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #fff;

  label {
    color: var(--fg-muted);
    font-size: 15px;
  }

  output {
    font-size: 20px;
    font-weight: 600;
  }

  input,
  p {
    grid-column: 1 / -1;
  }

  input {
    width: 100%;
    accent-color: var(--fg-leaf);
  }
}

.steps {
  display: grid;
  gap: 10px;
  counter-reset: step;

  li {
    position: relative;
    padding-left: 32px;
    counter-increment: step;

    &::before {
      content: counter(step);
      position: absolute;
      left: 0;
      top: 0;
      color: var(--fg-leaf);
      font-weight: 600;
    }
  }
}

@media (max-width: 860px) {
  .cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .tiers {
    grid-template-columns: 1fr;
  }
}
</style>
