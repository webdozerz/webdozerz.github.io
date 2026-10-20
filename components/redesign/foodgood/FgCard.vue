<script lang="ts" setup>
import FgBuy from './FgBuy.vue'

const props = defineProps<{ product: FgProduct; eager?: boolean }>()
const discount = computed(() => fgDiscount(props.product))
const to = computed(() => fgPath(`/product/${props.product.id}`))
</script>

<template>
  <article class="fg-card">
    <NuxtLink :to="to" class="fg-card__photo" tabindex="-1" aria-hidden="true">
      <img :src="product.image" alt="" :loading="eager ? 'eager' : 'lazy'" />
      <span v-if="discount" class="fg-card__sale">−{{ discount }}%</span>
      <span v-if="product.origin" class="fg-card__origin">
        <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
          <path d="M12 21s-6.5-5.4-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21z" />
        </svg>
        {{ product.origin }}
      </span>
    </NuxtLink>
    <div class="fg-card__price">
      <strong class="fg-price" :class="{ 'is-sale': discount }">{{ fgFormatPrice(product.price) }}</strong>
      <s v-if="product.oldPrice" class="fg-price">{{ fgFormatPrice(product.oldPrice) }}</s>
    </div>
    <NuxtLink :to="to" class="fg-card__name">{{ product.name }}</NuxtLink>
    <span class="fg-card__pack">{{ product.pack }}</span>
    <FgBuy :product="product" class="fg-card__buy" />
  </article>
</template>

<style lang="scss">
.fg .fg-card {
  display: flex;
  flex-direction: column;
  min-width: 0;

  &__photo {
    position: relative;
    display: block;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 18px;
    background: var(--fg-sage);

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

  &__sale {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 2px 9px;
    border-radius: 8px;
    background: var(--fg-sale);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
  }

  &__origin {
    position: absolute;
    left: 8px;
    bottom: 8px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: calc(100% - 16px);
    padding: 3px 9px 3px 7px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.92);
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    svg {
      color: var(--fg-leaf);
    }
  }

  &__price {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 8px;
    margin-top: 12px;

    strong {
      font-size: 20px;
      font-weight: 600;

      &.is-sale {
        color: var(--fg-sale-d);
      }
    }

    s {
      color: var(--fg-muted);
      font-size: 15px;
    }
  }

  &__name {
    display: -webkit-box;
    margin-top: 2px;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.3;
    transition: color 0.15s;

    &:hover {
      color: var(--fg-leaf);
    }
  }

  &__pack {
    margin-top: 2px;
    color: var(--fg-muted);
    font-size: 14px;
  }

  &__buy {
    margin-top: auto;
    padding-top: 12px;
  }
}
</style>
