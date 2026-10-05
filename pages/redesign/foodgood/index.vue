<script lang="ts" setup>
import ProductCard from '~/components/redesign/foodgood/ProductCard.vue'
import SectionHead from '~/components/redesign/foodgood/SectionHead.vue'
import Messengers from '~/components/redesign/foodgood/Messengers.vue'
import AddToCart from '~/components/redesign/foodgood/AddToCart.vue'

useSeoMeta({ title: 'FoodGood Tomsk | Магазин здоровой еды' })

const featured = fgProducts.filter((p) => p.collection === 'in-stock').slice(0, 8)
const honey = fgProducts.find((p) => p.collection === 'sale')!
const gifts = fgProducts.filter((p) => p.collection === 'gift')

const perks = ['Фермерская продукция', 'Лучшее качество', 'Доставка по Томску и Северску']

const tiles = [
  {
    to: fgPath('/schedule'),
    title: 'График работы',
    text: 'Ежедневно с 11:00 до 20:00',
    tone: 'leaf',
    icon: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  },
  {
    to: fgPath('/reviews'),
    title: 'Фото-отзывы',
    text: 'Скидка 10% за ваш отзыв',
    tone: 'berry',
    icon: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  },
  {
    to: fgPath('/contacts'),
    title: 'Контакты',
    text: 'Герцена 78/1, Томск',
    tone: 'honey',
    icon: 'M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="fg-container hero__grid">
        <div class="hero__copy">
          <ul class="hero__perks">
            <li v-for="perk in perks" :key="perk">{{ perk }}</li>
          </ul>
          <h1 class="hero__title">
            Магазин здоровой еды <em>с доставкой</em> на дом
          </h1>
          <p class="hero__lead">
            Прямые поставки клубники, других ягод и фруктов из Кыргызстана, Казахстана, Белоруссии,
            Крыма и Кубани. Фермерское мясо, рыба и икра.
          </p>
          <div class="hero__cta">
            <NuxtLink :to="fgPath('/catalog')" class="btn btn--primary">Оформить заказ</NuxtLink>
            <NuxtLink :to="fgPath('/catalog/sale')" class="btn btn--ghost">Скидки до 50%</NuxtLink>
          </div>
        </div>

        <div class="hero__media">
          <div class="hero__photo">
            <img :src="fgImages.hero" alt="Свежая клубника в миске" />
          </div>
          <div class="hero__float">
            <strong>Заказ на сегодня</strong>
            <span>принимаем до 18:00</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Условия -->
    <section class="facts fg-container">
      <div class="fact">
        <div class="fact__title">Доставка в день заказа</div>
        <p>Заказы на доставку на текущий день принимаются до 18:00.</p>
      </div>
      <div class="fact">
        <div class="fact__title">Самовывоз</div>
        <p>Томск, ул. Герцена 78/1, ежедневно с 11:00 до 20:00.</p>
      </div>
      <div class="fact">
        <div class="fact__title">Доставка по Томску</div>
        <p>300 ₽, а на заказы от 5 000 ₽ бесплатно.</p>
      </div>
    </section>

    <!-- В наличии -->
    <section class="block fg-container">
      <SectionHead
        eyebrow="Продукция в наличии"
        title="Что сейчас на витрине"
        :to="fgPath('/catalog/in-stock')"
        link-label="Весь каталог"
      />
      <div class="grid">
        <ProductCard v-for="p in featured" :key="p.id" :product="p" />
      </div>
    </section>

    <!-- Скидки -->
    <section class="block fg-container">
      <SectionHead eyebrow="Акции" title="Скидки до 50%" :to="fgPath('/discounts')" link-label="Все условия" />
      <div class="promo">
        <article class="promo__honey">
          <img :src="honey.image" :alt="honey.name" loading="lazy" />
          <div class="promo__honey-body">
            <span class="promo__tag">−40%</span>
            <h3>{{ honey.name }}</h3>
            <div class="promo__prices">
              <span>{{ fgFormatPrice(honey.price) }}</span>
              <s>{{ fgFormatPrice(honey.oldPrice!) }}</s>
            </div>
            <AddToCart :product-id="honey.id" />
          </div>
        </article>
        <article class="promo__card promo__card--leaf">
          <div class="promo__big">3% и 5%</div>
          <h3>Система лояльности</h3>
          <p>
            Скидка 3% после 25 000 ₽ покупок и 5% после 35 000 ₽. Просто назовите телефон на кассе.
          </p>
        </article>
        <article class="promo__card promo__card--berry">
          <div class="promo__big">−10%</div>
          <h3>За фото-отзыв</h3>
          <p>Оставьте фото-отзыв на любой площадке и получите скидку 10% на следующий заказ.</p>
        </article>
      </div>
    </section>

    <!-- Сертификаты -->
    <section class="gift">
      <div class="fg-container gift__inner">
        <div class="gift__copy">
          <div class="gift__eyebrow">Подарочные сертификаты</div>
          <h2>Подарок, который выберут сами</h2>
          <p>
            Сертификат на 3 000 или 5 000 ₽ с тематической открыткой. Бесплатная доставка, если
            нужно привезти.
          </p>
          <NuxtLink :to="fgPath('/catalog/gift')" class="btn btn--light">Выбрать сертификат</NuxtLink>
        </div>
        <div class="gift__cards">
          <NuxtLink
            v-for="g in gifts"
            :key="g.id"
            :to="fgPath(`/product/${g.id}`)"
            class="gift__card"
          >
            <img :src="g.image" :alt="g.name" loading="lazy" />
            <span>{{ fgFormatPrice(g.price) }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Доставка -->
    <section class="block fg-container">
      <SectionHead eyebrow="Стоимость доставки" title="Куда и сколько" />
      <div class="zones">
        <article v-for="z in fgDelivery" :key="z.id" class="zone">
          <div class="zone__price">{{ z.price ? fgFormatPrice(z.price) : 'Бесплатно' }}</div>
          <h3>{{ z.title }}</h3>
          <p>{{ z.hint }}</p>
        </article>
      </div>
    </section>

    <!-- Плитки -->
    <section class="block fg-container">
      <div class="tiles">
        <NuxtLink
          v-for="t in tiles"
          :key="t.to"
          :to="t.to"
          class="tile"
          :class="`tile--${t.tone}`"
        >
          <span class="tile__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path :d="t.icon" />
            </svg>
          </span>
          <span class="tile__text">
            <strong>{{ t.title }}</strong>
            <span>{{ t.text }}</span>
          </span>
          <span class="tile__arrow" aria-hidden="true">→</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Мессенджеры -->
    <section class="block fg-container">
      <div class="contact-cta">
        <div>
          <h2>Напишите нам</h2>
          <p>Ответим в мессенджере и поможем собрать заказ.</p>
        </div>
        <Messengers />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 28px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 16px;
  transition: transform 0.15s, background 0.15s;

  &:hover {
    transform: translateY(-2px);
  }

  &--primary {
    background: var(--fg-leaf);
    color: #fff;

    &:hover {
      background: #4a8b2d;
    }
  }

  &--ghost {
    border: 2px solid var(--fg-forest);
    color: var(--fg-forest);
  }

  &--light {
    background: #fff;
    color: var(--fg-forest);
  }
}

.block {
  margin-top: 88px;
}

// ---------- hero ----------
.hero {
  padding: 48px 0 24px;

  &__grid {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    align-items: center;
    gap: 48px;
  }

  &__perks {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0 0 22px;
    padding: 0;
    list-style: none;

    li {
      padding: 6px 14px;
      border-radius: 999px;
      background: var(--fg-leaf-soft);
      font-size: 13px;
      font-weight: 700;
      color: var(--fg-forest);
    }
  }

  &__title {
    font-size: clamp(38px, 6vw, 68px);

    em {
      font-style: italic;
      color: var(--fg-leaf);
    }
  }

  &__lead {
    max-width: 520px;
    margin-top: 20px;
    font-size: 18px;
    color: var(--fg-muted);
  }

  &__cta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 32px;
  }

  &__media {
    position: relative;

  }

  // На исходном фото внизу есть красная надпись, поэтому приближаем кадр от верхнего края
  // и обрезаем нижнюю часть.
  &__photo {
    overflow: hidden;
    aspect-ratio: 4 / 4.4;
    border-radius: 200px 200px 28px 28px;
    box-shadow: var(--fg-shadow);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 0;
      transform: scale(1.3);
      transform-origin: 50% 0;
    }
  }

  &__float {
    position: absolute;
    left: -20px;
    bottom: 28px;
    display: flex;
    flex-direction: column;
    padding: 14px 20px;
    border-radius: 16px;
    background: var(--fg-paper);
    box-shadow: var(--fg-shadow);
    font-size: 14px;

    strong {
      color: var(--fg-forest);
    }
    span {
      color: var(--fg-muted);
    }
  }
}

// ---------- факты ----------
.facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 40px;
}

.fact {
  padding: 22px 24px;
  border-radius: var(--fg-radius);
  background: var(--fg-paper);
  border: 1px solid var(--fg-line);

  &__title {
    margin-bottom: 6px;
    font-weight: 800;
    color: var(--fg-forest);
  }

  p {
    font-size: 14px;
    color: var(--fg-muted);
  }
}

// ---------- сетка товаров ----------
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

// ---------- акции ----------
.promo {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 20px;

  &__honey {
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
    border-radius: var(--fg-radius);
    background: var(--fg-paper);
    border: 1px solid var(--fg-line);

    img {
      width: 100%;
      height: 100%;
      min-height: 260px;
      object-fit: cover;
    }
  }

  &__honey-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 14px;
    padding: 24px;

    h3 {
      font-size: 22px;
    }
  }

  &__tag {
    align-self: flex-start;
    padding: 4px 12px;
    border-radius: 999px;
    background: var(--fg-berry);
    color: #fff;
    font-weight: 800;
    font-size: 13px;
  }

  &__prices {
    display: flex;
    align-items: baseline;
    gap: 10px;

    span {
      font-size: 28px;
      font-weight: 800;
      color: var(--fg-forest);
    }
    s {
      color: var(--fg-muted);
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 10px;
    padding: 28px;
    border-radius: var(--fg-radius);

    h3 {
      font-size: 24px;
    }
    p {
      font-size: 15px;
    }

    &--leaf {
      background: var(--fg-leaf-soft);
    }
    &--berry {
      background: var(--fg-berry-soft);

      .promo__big {
        color: var(--fg-berry);
      }
    }
  }

  &__big {
    font-family: var(--fg-serif);
    font-size: 52px;
    font-weight: 700;
    line-height: 1;
    color: var(--fg-leaf);
  }
}

// ---------- сертификаты ----------
.gift {
  margin-top: 88px;
  padding: 64px 0;
  background: var(--fg-forest);
  color: #cfe0c2;

  &__inner {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    align-items: center;
    gap: 48px;
  }

  &__eyebrow {
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--fg-honey);
  }

  h2 {
    color: #fff;
    font-size: clamp(30px, 4vw, 44px);
  }

  p {
    max-width: 440px;
    margin: 16px 0 28px;
    font-size: 17px;
  }

  &__cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  &__card {
    position: relative;
    display: block;
    overflow: hidden;
    border-radius: var(--fg-radius);
    aspect-ratio: 1;
    transition: transform 0.2s;

    &:nth-child(2) {
      transform: translateY(24px);
    }
    &:hover {
      transform: translateY(-4px);
    }
    &:nth-child(2):hover {
      transform: translateY(20px);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    span {
      position: absolute;
      left: 12px;
      bottom: 12px;
      padding: 6px 14px;
      border-radius: 999px;
      background: #fff;
      color: var(--fg-forest);
      font-weight: 800;
    }
  }
}

// ---------- доставка ----------
.zones {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.zone {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  border-radius: var(--fg-radius);
  background: var(--fg-paper);
  border: 1px solid var(--fg-line);

  &__price {
    font-family: var(--fg-serif);
    font-size: 30px;
    font-weight: 700;
    color: var(--fg-leaf);
  }

  h3 {
    font-size: 19px;
  }

  p {
    font-size: 14px;
    color: var(--fg-muted);
  }
}

// ---------- плитки ----------
.tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.tile {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 28px;
  border-radius: var(--fg-radius);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--fg-shadow);
  }

  &--leaf {
    background: var(--fg-leaf-soft);
    --accent: var(--fg-leaf);
  }
  &--berry {
    background: var(--fg-berry-soft);
    --accent: var(--fg-berry);
  }
  &--honey {
    background: #faefd5;
    --accent: #c98a14;
  }

  &__icon {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #fff;
    color: var(--accent);

    svg {
      width: 28px;
      height: 28px;
    }
  }

  &__text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;

    strong {
      font-family: var(--fg-serif);
      font-size: 22px;
      color: var(--fg-forest);
    }
    span {
      font-size: 14px;
      color: var(--fg-muted);
    }
  }

  &__arrow {
    font-size: 22px;
    font-weight: 700;
    color: var(--accent);
    transition: transform 0.2s;
  }

  &:hover &__arrow {
    transform: translateX(4px);
  }
}

// ---------- мессенджеры ----------
.contact-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
  padding: 36px;
  border-radius: 28px;
  background: var(--fg-leaf-soft);

  h2 {
    font-size: 32px;
  }
  p {
    margin-top: 6px;
    color: var(--fg-muted);
  }
}

// ---------- адаптив ----------
@media (max-width: 1000px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .promo {
    grid-template-columns: 1fr 1fr;

    &__honey {
      grid-column: 1 / -1;
    }
  }
  .zones {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 860px) {
  .hero__grid,
  .gift__inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .hero__float {
    left: 12px;
  }
  .facts,
  .tiles {
    grid-template-columns: 1fr;
  }
  .gift__card:nth-child(2) {
    transform: none;
  }
}

@media (max-width: 640px) {
  .block {
    margin-top: 64px;
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .promo {
    grid-template-columns: 1fr;

    &__honey {
      grid-template-columns: 1fr;
    }
  }
  .zones {
    grid-template-columns: 1fr;
  }
  .contact-cta {
    padding: 24px;
  }
}
</style>
