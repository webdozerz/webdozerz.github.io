<script lang="ts" setup>
import PageHead from '~/components/redesign/foodgood/PageHead.vue'
import ProductCard from '~/components/redesign/foodgood/ProductCard.vue'
import SectionHead from '~/components/redesign/foodgood/SectionHead.vue'

useSeoMeta({ title: 'Скидки до 50% | FoodGood Tomsk' })

const sale = fgProducts.filter((p) => p.collection === 'sale')

const loyalty = [
  { n: '1', text: 'При любой покупке в магазине сообщите продавцу ФИО и номер телефона. Так вы станете участником системы лояльности.' },
  { n: '2', text: 'Когда общая сумма покупок достигнет порога, скидка начнёт действовать постоянно.' },
  { n: '3', text: 'Чтобы воспользоваться скидкой, называйте контактный номер телефона при каждой покупке.' },
]

const review = [
  'Оставьте фото-отзыв на любой одной площадке: Instagram, 2ГИС или ВКонтакте.',
  'Покажите скриншот отзыва давностью не более одного месяца.',
  'Мы дадим скидку 10% на следующий любой заказ.',
]
</script>

<template>
  <div>
    <PageHead
      title="Скидки до 50%"
      crumb="Скидки"
      lead="Постоянные скидки для своих покупателей и акционные товары."
    />

    <div class="fg-container grid">
      <article class="card card--leaf">
        <header>
          <h2>Система лояльности</h2>
          <p>Накопительные скидки на любые покупки в магазине.</p>
        </header>

        <div class="tiers">
          <div class="tier">
            <strong>3%</strong>
            <span>после покупок на 25 000 ₽</span>
          </div>
          <div class="tier">
            <strong>5%</strong>
            <span>после покупок на 35 000 ₽</span>
          </div>
        </div>

        <ol class="steps">
          <li v-for="s in loyalty" :key="s.n">
            <span class="steps__n">{{ s.n }}</span>
            <p>{{ s.text }}</p>
          </li>
        </ol>
      </article>

      <article class="card card--berry">
        <header>
          <h2>Скидка за фото-отзыв</h2>
          <p>Расскажите о нас и получите скидку на следующую покупку.</p>
        </header>

        <div class="tiers">
          <div class="tier tier--berry">
            <strong>−10%</strong>
            <span>на любой следующий заказ или покупку</span>
          </div>
        </div>

        <ol class="steps steps--berry">
          <li v-for="(s, i) in review" :key="i">
            <span class="steps__n">{{ i + 1 }}</span>
            <p>{{ s }}</p>
          </li>
        </ol>

        <NuxtLink :to="fgPath('/reviews')" class="link">Посмотреть фото-отзывы →</NuxtLink>
      </article>
    </div>

    <section class="fg-container sale">
      <SectionHead
        eyebrow="Акционные товары"
        title="Скидки на товары"
        :to="fgPath('/catalog/sale')"
        link-label="Все акции"
      />
      <div class="sale__grid">
        <ProductCard v-for="p in sale" :key="p.id" :product="p" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 36px;
  border-radius: 28px;

  &--leaf {
    background: var(--fg-leaf-soft);
  }
  &--berry {
    background: var(--fg-berry-soft);
  }

  h2 {
    font-size: 32px;
  }

  header p {
    margin-top: 8px;
    color: var(--fg-muted);
  }
}

.tiers {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tier {
  flex: 1;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 20px;
  border-radius: 18px;
  background: var(--fg-paper);

  strong {
    font-family: var(--fg-serif);
    font-size: 44px;
    line-height: 1;
    color: var(--fg-leaf);
  }

  span {
    font-size: 14px;
    color: var(--fg-muted);
  }

  &--berry strong {
    color: var(--fg-berry);
  }
}

.steps {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }

  p {
    font-size: 15px;
  }

  &__n {
    flex-shrink: 0;
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--fg-forest);
    color: #fff;
    font-size: 13px;
    font-weight: 800;
  }

  &--berry &__n {
    background: var(--fg-berry);
  }
}

.link {
  align-self: flex-start;
  font-weight: 700;
  color: var(--fg-berry);
  border-bottom: 2px solid currentColor;
}

.sale {
  margin-top: 72px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

@media (max-width: 1000px) {
  .sale__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .card {
    padding: 24px;
  }
}
</style>
