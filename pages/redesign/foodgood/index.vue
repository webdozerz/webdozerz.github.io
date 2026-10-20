<script lang="ts" setup>
import FgCard from '~/components/redesign/foodgood/FgCard.vue'
import FgSearch from '~/components/redesign/foodgood/FgSearch.vue'
import FgMessengers from '~/components/redesign/foodgood/FgMessengers.vue'
import FgShelf from '~/components/redesign/foodgood/FgShelf.vue'

const cart = useFoodgoodCart()

useSeoMeta({
  title: 'FoodGood Tomsk | Магазин здоровой еды · концепт редизайна',
  ogTitle: 'FoodGood Tomsk — концепт редизайна',
  ogDescription:
    'Магазин здоровой еды в Томске: ягоды и фрукты прямыми поставками, рыба, дичь, домашние полуфабрикаты. Каталог, поиск, корзина и заказ в мессенджер.',
  ogImage: '/redesign/foodgood/og.jpg',
})

const season = fgSeason.map((id) => fgFindProduct(id)!)
const fish = fgOf('fish').slice(0, 10)
const ready = fgOf('ready').slice(0, 10)
const honey = fgSale()[0]!
const gifts = fgOf('gift')

const facts = [
  { title: 'Доставка сегодня', text: 'если заказать до 18:00' },
  { title: 'Бесплатно от\u00a05\u00a0000\u00a0₽', text: 'по Томску, иначе 300 ₽' },
  { title: 'Самовывоз', text: 'Герцена 78/1, 11:00–20:00' },
]
</script>

<template>
  <div>
    <section class="fg-wrap hero">
      <div class="hero__panel">
        <h1>Магазин здоровой еды в&nbsp;Томске</h1>
        <p class="hero__lead">
          Прямые поставки ягод и фруктов из Кыргызстана, Казахстана, Белоруссии, Крыма и Кубани.
          Фермерское мясо, рыба, дичь и домашние полуфабрикаты.
        </p>
        <FgSearch big class="hero__search" />
        <p class="hero__popular">
          Часто ищут:
          <NuxtLink
            v-for="q in fgPopularQueries"
            :key="q"
            :to="{ path: fgPath('/catalog'), query: { q } }"
          >{{ q }}</NuxtLink>
        </p>
        <ul class="hero__facts">
          <li v-for="f in facts" :key="f.title">
            <strong>{{ f.title }}</strong>
            <span>{{ f.text }}</span>
          </li>
        </ul>
      </div>

      <div class="season">
        <div class="season__head">
          <h2>Сейчас в сезоне</h2>
          <NuxtLink :to="fgPath('/catalog/fruit')" class="fg-link">Все фрукты</NuxtLink>
        </div>
        <div class="season__grid">
          <article v-for="p in season" :key="p.id" class="season__tile">
            <NuxtLink :to="fgPath(`/product/${p.id}`)" class="season__photo" tabindex="-1" aria-hidden="true">
              <img :src="p.image" alt="" />
            </NuxtLink>
            <div class="season__plate">
              <NuxtLink :to="fgPath(`/product/${p.id}`)" class="season__name">{{ p.name }}</NuxtLink>
              <div class="season__row">
                <span>
                  <strong class="fg-price">{{ fgFormatPrice(p.price) }}</strong>
                  <small>{{ p.pack }}</small>
                </span>
                <button
                  type="button"
                  class="season__add"
                  :class="{ 'is-in': cart.qtyOf(p.id) }"
                  :aria-label="`В корзину: ${p.name}`"
                  @click="cart.add(p.id)"
                >
                  <span v-if="cart.qtyOf(p.id)">{{ cart.qtyOf(p.id) }}</span>
                  <svg v-else viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path d="M12 6v12M6 12h12" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="fg-wrap fg-section">
      <div class="fg-head">
        <h2>Каталог</h2>
        <NuxtLink :to="fgPath('/catalog')" class="fg-link">Все {{ fgProducts.length }} товаров</NuxtLink>
      </div>
      <div class="cats">
        <NuxtLink v-for="c in fgCategories" :key="c.id" :to="fgPath(`/catalog/${c.id}`)" class="cats__item">
          <span class="cats__text">
            <strong>{{ c.title }}</strong>
            <small>{{ fgGoods(fgOf(c.id).length) }}</small>
          </span>
          <img :src="c.cover" alt="" loading="lazy" />
        </NuxtLink>
      </div>
    </section>

    <FgShelf title="Рыба и морепродукты" :to="fgPath('/catalog/fish')">
      <FgCard v-for="p in fish" :key="p.id" :product="p" />
    </FgShelf>

    <section class="fg-wrap fg-section">
      <div class="fg-head">
        <h2>Скидки до 50%</h2>
        <NuxtLink :to="fgPath('/discounts')" class="fg-link">Все условия</NuxtLink>
      </div>
      <div class="deals">
        <NuxtLink :to="fgPath(`/product/${honey.id}`)" class="deals__honey">
          <img :src="honey.image" :alt="honey.name" loading="lazy" />
          <span class="deals__body">
            <span class="deals__tag">−{{ fgDiscount(honey) }}%</span>
            <strong>{{ honey.name }}</strong>
            <span class="deals__prices">
              <b class="fg-price">{{ fgFormatPrice(honey.price) }}</b>
              <s class="fg-price">{{ fgFormatPrice(honey.oldPrice!) }}</s>
              <small>{{ honey.pack }}</small>
            </span>
          </span>
        </NuxtLink>
        <NuxtLink :to="fgPath('/discounts')" class="deals__card">
          <span class="deals__big">3% → 5%</span>
          <strong>Накопительная скидка</strong>
          <span>3% после покупок на 25 000 ₽, 5% — после 35 000 ₽. Назовите телефон на кассе.</span>
        </NuxtLink>
        <NuxtLink :to="fgPath('/reviews')" class="deals__card">
          <span class="deals__big">−10%</span>
          <strong>За фото-отзыв</strong>
          <span>Оставьте отзыв с фото в 2ГИС, ВКонтакте или Instagram — скидка на следующий заказ.</span>
        </NuxtLink>
      </div>
    </section>

    <FgShelf title="Домашние полуфабрикаты" :to="fgPath('/catalog/ready')">
      <FgCard v-for="p in ready" :key="p.id" :product="p" />
    </FgShelf>

    <section class="fg-wrap fg-section order">
      <div class="order__photo">
        <img :src="fgImages.store" alt="Магазин FoodGood на Герцена" loading="lazy" />
      </div>
      <div class="order__body">
        <h2>Удобнее в мессенджере? Пишите</h2>
        <p>
          Соберём заказ по списку, подскажем, что пришло в свежей поставке, и добавим в группу
          для заказа в WhatsApp. Корзина на сайте тоже умеет отправить заказ сообщением.
        </p>
        <FgMessengers />
        <dl class="order__info">
          <div>
            <dt>Магазин</dt>
            <dd>{{ fgContacts.address }}, {{ fgContacts.addressNote }}</dd>
          </div>
          <div>
            <dt>Ежедневно</dt>
            <dd>11:00–20:00</dd>
          </div>
          <div>
            <dt>Телефон</dt>
            <dd><a :href="fgContacts.phoneHref">{{ fgContacts.phone }}</a></dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="fg-wrap fg-section gift">
      <div class="gift__text">
        <h2>Подарочный сертификат</h2>
        <p>
          На 3 000 или 5 000 ₽ с тематической открыткой. Действует 6 месяцев на любую продукцию из
          наличия. Доставим бесплатно, если нужно.
        </p>
      </div>
      <div class="gift__list">
        <NuxtLink v-for="g in gifts" :key="g.id" :to="fgPath(`/product/${g.id}`)" class="gift__item">
          <img :src="g.image" :alt="g.name" loading="lazy" />
          <strong class="fg-price">{{ fgFormatPrice(g.price) }}</strong>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 16px;
  margin-top: 20px;

  &__panel {
    display: flex;
    flex-direction: column;
    padding: clamp(24px, 4vw, 48px);
    border-radius: 28px;
    background: var(--fg-sage);

    h1 {
      max-width: 560px;
      font-size: clamp(36px, 5vw, 60px);
      line-height: 1.02;
      letter-spacing: -0.03em;
    }
  }

  &__lead {
    max-width: 520px;
    margin-top: 16px;
    color: var(--fg-muted);
    font-size: 18px;
  }

  &__search {
    margin-top: 28px;
  }

  &__popular {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    margin-top: 12px;
    color: var(--fg-muted);
    font-size: 15px;

    a {
      color: var(--fg-ink);
      text-decoration: underline;
      text-decoration-color: #b9c8b5;
      text-underline-offset: 4px;

      &:hover {
        color: var(--fg-leaf);
      }
    }
  }

  &__facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: auto;
    padding-top: 32px;

    li {
      display: grid;
      gap: 2px;
      padding-top: 14px;
      border-top: 1px solid var(--fg-sage-2);
      line-height: 1.3;
    }

    strong {
      font-weight: 600;
    }

    span {
      color: var(--fg-muted);
      font-size: 14px;
    }
  }
}

.season {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 4px 0;

    h2 {
      font-size: 22px;
    }
  }

  &__grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  &__tile {
    position: relative;
    min-height: 250px;
    overflow: hidden;
    border-radius: 22px;
    background: var(--fg-sage);
  }

  &__photo {
    position: absolute;
    inset: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  &__plate {
    position: absolute;
    left: 8px;
    right: 8px;
    bottom: 8px;
    padding: 10px 10px 10px 12px;
    border-radius: 14px;
    background: #fff;
  }

  &__name {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 15px;
    line-height: 1.3;

    &:hover {
      color: var(--fg-leaf);
    }
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 4px;

    span {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0 6px;
      min-width: 0;
    }

    strong {
      font-size: 19px;
      font-weight: 600;
    }

    small {
      color: var(--fg-muted);
      font-size: 13px;
    }
  }

  &__add {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--fg-leaf-soft);
    font-weight: 600;
    transition:
      background-color 0.15s,
      color 0.15s;

    &:hover,
    &.is-in {
      background: var(--fg-leaf);
      color: #fff;
    }
  }
}

.cats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 112px;
    padding: 12px 12px 12px 20px;
    border-radius: 20px;
    background: var(--fg-sage);
    transition: background-color 0.15s;

    &:hover {
      background: var(--fg-sage-2);

      img {
        transform: scale(1.04);
      }
    }

    img {
      width: 88px;
      height: 88px;
      flex-shrink: 0;
      border-radius: 14px;
      object-fit: cover;
      transition: transform 0.3s;
    }
  }

  &__text {
    display: grid;
    gap: 2px;
    min-width: 0;

    strong {
      font-size: 18px;
      font-weight: 600;
      line-height: 1.2;
    }

    small {
      color: var(--fg-muted);
      font-size: 14px;
    }
  }
}


.deals {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 12px;

  &__honey {
    display: flex;
    gap: 20px;
    padding: 12px;
    border-radius: 22px;
    background: var(--fg-sale-soft);

    img {
      width: 46%;
      aspect-ratio: 1;
      border-radius: 16px;
      object-fit: cover;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 8px 8px 8px 0;

    strong {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
    }
  }

  &__tag {
    padding: 2px 10px;
    border-radius: 8px;
    background: var(--fg-sale);
    color: #fff;
    font-weight: 600;
  }

  &__prices {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 8px;
    margin-top: auto;

    b {
      color: var(--fg-sale-d);
      font-size: 26px;
      font-weight: 600;
    }

    s,
    small {
      color: var(--fg-muted);
    }

    small {
      width: 100%;
      font-size: 14px;
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
    border-radius: 22px;
    background: var(--fg-sage);
    transition: background-color 0.15s;

    &:hover {
      background: var(--fg-sage-2);
    }

    strong {
      font-size: 19px;
      font-weight: 600;
    }

    > span:last-child {
      color: var(--fg-muted);
    }
  }

  &__big {
    margin-bottom: auto;
    padding-bottom: 20px;
    color: var(--fg-leaf);
    font-size: 40px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1;
  }
}

.order {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
  gap: 16px;

  &__photo img {
    width: 100%;
    height: 100%;
    min-height: 280px;
    max-height: 520px;
    border-radius: 22px;
    object-fit: cover;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: clamp(24px, 4vw, 44px);
    border-radius: 22px;
    background: var(--fg-sage);

    h2 {
      font-size: clamp(26px, 3vw, 34px);
    }

    > p {
      max-width: 520px;
      color: var(--fg-muted);
    }
  }

  &__info {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: auto;
    padding-top: 12px;

    div {
      padding-top: 12px;
      border-top: 1px solid var(--fg-sage-2);
    }

    dt {
      color: var(--fg-muted);
      font-size: 14px;
    }

    dd {
      font-weight: 500;
      line-height: 1.35;
    }
  }
}

.gift {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  align-items: center;
  gap: 24px;
  padding: clamp(20px, 3vw, 32px);
  border-radius: 28px;
  box-shadow: inset 0 0 0 1px var(--fg-line);

  &__text {
    h2 {
      font-size: clamp(26px, 3vw, 34px);
    }

    p {
      max-width: 460px;
      margin-top: 12px;
      color: var(--fg-muted);
    }
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  &__item {
    display: grid;
    gap: 8px;

    img {
      width: 100%;
      aspect-ratio: 4 / 3;
      border-radius: 16px;
      object-fit: cover;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.03);
    }

    strong {
      font-size: 20px;
      font-weight: 600;
    }
  }
}

@media (max-width: 1100px) {
  .deals {
    grid-template-columns: 1fr 1fr;

    &__honey {
      grid-column: 1 / -1;
    }
  }
}

@media (max-width: 960px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .cats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  // 9 разделов в две колонки: последний — на всю ширину, без «сироты»
  .cats__item:last-child {
    grid-column: 1 / -1;
  }

  .season__tile {
    min-height: 0;
    aspect-ratio: 1;
  }

  .order,
  .gift {
    grid-template-columns: 1fr;
  }

  .order__photo img {
    max-height: 320px;
  }
}

@media (max-width: 860px) {
  .hero__search {
    display: none;
  }

  .hero__popular {
    margin-top: 20px;
  }
}

@media (max-width: 760px) {
  .hero__facts,
  .order__info {
    grid-template-columns: 1fr;
    gap: 0;

    li,
    div {
      padding: 10px 0;
    }
  }

  .deals {
    grid-template-columns: 1fr;

    &__honey img {
      width: 40%;
    }
  }
}

@media (max-width: 560px) {
  .hero {
    margin-top: 12px;
  }

  .season__grid {
    gap: 8px;
  }

  .season__plate {
    left: 6px;
    right: 6px;
    bottom: 6px;
    padding: 8px 8px 8px 10px;
  }

  .season__name {
    font-size: 14px;
  }

  .season__row strong {
    font-size: 17px;
  }

  .season__row small {
    display: none;
  }

  .season__add {
    width: 36px;
    height: 36px;
  }

  .cats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .cats__item {
    flex-direction: column-reverse;
    align-items: flex-start;
    justify-content: flex-end;
    gap: 10px;
    min-height: 0;
    padding: 10px 10px 14px;
    border-radius: 18px;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 10;
      border-radius: 12px;
    }
  }

  .cats__text strong {
    font-size: 16px;
  }

  .cats__item:last-child {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 10px 10px 14px;

    img {
      width: 72px;
      aspect-ratio: 1;
    }
  }
}
</style>
