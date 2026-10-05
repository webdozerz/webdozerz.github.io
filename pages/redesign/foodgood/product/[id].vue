<script lang="ts" setup>
import AddToCart from '~/components/redesign/foodgood/AddToCart.vue'
import ProductCard from '~/components/redesign/foodgood/ProductCard.vue'
import SectionHead from '~/components/redesign/foodgood/SectionHead.vue'

const route = useRoute()
const product = fgFindProduct(route.params.id as string)
if (!product) {
  throw createError({ statusCode: 404, statusMessage: 'Товар не найден', fatal: true })
}

const related = fgProducts.filter((p) => p.kind === product.kind && p.id !== product.id).slice(0, 4)
const fallback = fgProducts.filter((p) => p.id !== product.id && p.collection === 'in-stock').slice(0, 4)
const more = related.length ? related : fallback

useSeoMeta({ title: `${product.name} | FoodGood Tomsk` })
</script>

<template>
  <div v-if="product" class="fg-container product">
    <nav class="crumbs" aria-label="Навигация">
      <NuxtLink :to="fgPath()">Главная</NuxtLink>
      <span>/</span>
      <NuxtLink :to="fgPath('/catalog')">Каталог</NuxtLink>
      <span>/</span>
      <span>{{ product.kind }}</span>
    </nav>

    <div class="product__grid">
      <div class="product__media">
        <img :src="product.image" :alt="product.name" />
        <span v-if="product.oldPrice" class="product__badge">
          −{{ Math.round((1 - product.price / product.oldPrice) * 100) }}%
        </span>
      </div>

      <div class="product__info">
        <span class="product__kind">{{ product.kind }}</span>
        <h1>{{ product.name }}</h1>

        <div class="product__price">
          <span class="product__now">{{ fgFormatPrice(product.price) }}</span>
          <s v-if="product.oldPrice">{{ fgFormatPrice(product.oldPrice) }}</s>
          <span v-if="product.priceNote" class="product__note">{{ product.priceNote }}</span>
        </div>

        <p class="product__lead">{{ product.lead }}</p>

        <div class="product__buy">
          <AddToCart :product-id="product.id" large />
          <NuxtLink :to="fgPath('/cart')" class="product__cart">Перейти в корзину</NuxtLink>
        </div>

        <dl class="product__details">
          <div v-for="d in product.details" :key="d.label">
            <dt>{{ d.label }}</dt>
            <dd>{{ d.value }}</dd>
          </div>
        </dl>

        <p v-if="product.note" class="product__fine">{{ product.note }}</p>

        <ul class="product__perks">
          <li>Заказ на сегодня до 18:00</li>
          <li>Самовывоз: Герцена 78/1</li>
          <li>Доставка по Томску 300 ₽, от 5 000 ₽ бесплатно</li>
        </ul>
      </div>
    </div>

    <section class="more">
      <SectionHead title="Вам может понравиться" :to="fgPath('/catalog')" link-label="Весь каталог" />
      <div class="more__grid">
        <ProductCard v-for="p in more" :key="p.id" :product="p" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.crumbs {
  display: flex;
  gap: 8px;
  padding: 28px 0 24px;
  font-size: 13px;
  color: var(--fg-muted);

  a:hover {
    color: var(--fg-forest);
    text-decoration: underline;
  }
}

.product {
  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    align-items: start;
  }

  &__media {
    position: relative;
    overflow: hidden;
    border-radius: 28px;
    background: var(--fg-leaf-soft);
    aspect-ratio: 1;
    box-shadow: var(--fg-shadow);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__badge {
    position: absolute;
    top: 18px;
    left: 18px;
    padding: 6px 14px;
    border-radius: 999px;
    background: var(--fg-berry);
    color: #fff;
    font-weight: 800;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 18px;

    h1 {
      font-size: clamp(28px, 3.6vw, 42px);
    }
  }

  &__kind {
    align-self: flex-start;
    padding: 4px 12px;
    border-radius: 999px;
    background: var(--fg-leaf-soft);
    font-size: 12px;
    font-weight: 700;
    color: var(--fg-forest);
  }

  &__price {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 4px 12px;

    s {
      color: var(--fg-muted);
      font-size: 18px;
    }
  }

  &__now {
    font-size: 36px;
    font-weight: 800;
    color: var(--fg-forest);
  }

  &__note {
    font-size: 14px;
    color: var(--fg-muted);
  }

  &__lead {
    font-size: 17px;
    color: var(--fg-ink);
  }

  &__buy {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;

    > :first-child {
      width: min(260px, 100%);
    }
  }

  &__cart {
    font-weight: 700;
    border-bottom: 2px solid var(--fg-leaf);
    color: var(--fg-forest);
  }

  &__details {
    margin: 4px 0 0;
    border-top: 1px solid var(--fg-line);

    > div {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--fg-line);
      font-size: 15px;
    }

    dt {
      color: var(--fg-muted);
    }
    dd {
      margin: 0;
      font-weight: 600;
    }
  }

  &__fine {
    font-size: 13px;
    color: var(--fg-muted);
  }

  &__perks {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 18px 20px;
    list-style: none;
    border-radius: var(--fg-radius);
    background: var(--fg-paper);
    border: 1px solid var(--fg-line);
    font-size: 14px;

    li::before {
      content: '✓';
      margin-right: 10px;
      font-weight: 800;
      color: var(--fg-leaf);
    }
  }
}

.more {
  margin-top: 88px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

@media (max-width: 1000px) {
  .more__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 860px) {
  .product__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

@media (max-width: 520px) {
  .product__details > div {
    grid-template-columns: 1fr;
    gap: 2px;
  }
  .more__grid {
    gap: 12px;
  }
}
</style>
