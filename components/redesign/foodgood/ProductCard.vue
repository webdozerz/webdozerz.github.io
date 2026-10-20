<script lang="ts" setup>
import AddToCart from './AddToCart.vue'
import type { FgProduct } from '~/utils/foodgood'

defineProps<{ product: FgProduct }>()
</script>

<template>
  <article class="card">
    <NuxtLink :to="fgPath(`/product/${product.id}`)" class="card__media">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      <span v-if="product.oldPrice" class="card__badge">
        −{{ Math.round((1 - product.price / product.oldPrice) * 100) }}%
      </span>
      <span class="card__kind">{{ product.kind }}</span>
    </NuxtLink>

    <div class="card__body">
      <NuxtLink :to="fgPath(`/product/${product.id}`)" class="card__name">
        {{ product.name }}
      </NuxtLink>

      <div class="card__price">
        <span class="card__now">{{ fgFormatPrice(product.price) }}</span>
        <span v-if="product.oldPrice" class="card__old">{{ fgFormatPrice(product.oldPrice) }}</span>
        <span v-if="product.priceNote" class="card__note">{{ product.priceNote }}</span>
      </div>

      <AddToCart :product-id="product.id" />
    </div>
  </article>
</template>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  background: var(--fg-paper);
  border: 1px solid var(--fg-line);
  border-radius: var(--fg-radius);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--fg-shadow);
  }

  &__media {
    position: relative;
    display: block;
    aspect-ratio: 1;
    background: var(--fg-leaf-soft);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }
  }

  &:hover &__media img {
    transform: scale(1.04);
  }

  &__badge,
  &__kind {
    position: absolute;
    top: 12px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
  }

  &__badge {
    left: 12px;
    background: var(--fg-berry);
    color: #fff;
  }

  &__kind {
    right: 12px;
    background: rgba(255, 253, 247, 0.92);
    color: var(--fg-forest);
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    padding: 14px 16px 16px;
  }

  &__name {
    flex: 1;
    font-weight: 600;
    font-size: 15px;
    line-height: 1.35;
    color: var(--fg-ink);

    &:hover {
      color: var(--fg-leaf);
    }
  }

  &__price {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 2px 8px;
  }

  &__now {
    font-size: 20px;
    font-weight: 800;
    color: var(--fg-forest);
  }

  &__old {
    color: var(--fg-muted);
    text-decoration: line-through;
    font-size: 14px;
  }

  &__note {
    width: 100%;
    font-size: 12px;
    color: var(--fg-muted);
  }
}
</style>
