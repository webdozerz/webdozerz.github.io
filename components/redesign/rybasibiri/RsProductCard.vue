<script lang="ts" setup>
// Карточка товара в листинге: фото на ледяной подложке, единица цены отдельной плашкой,
// пересчёт в рубли за кг или за рыбу целиком, покупка.
import RsBuy from './RsBuy.vue'

const props = defineProps<{ product: RsProduct; eager?: boolean }>()
const cart = useRybasibiriCart()
const to = computed(() => rsPath(`/product/${props.product.id}`))
const stock = computed(() => rsInStock(props.product))
</script>

<template>
  <article class="rs-card" :class="{ 'is-out': !stock }">
    <NuxtLink :to="to" class="rs-card__photo" :aria-label="rsTitle(product)">
      <img
        :src="rsImg(product.img, 480)"
        :alt="rsTitle(product)"
        width="480"
        height="480"
        :loading="eager ? 'eager' : 'lazy'"
      />
      <span v-if="product.badge || !stock" class="rs-card__badges">
        <span v-if="product.badge" class="rs-badge" :class="{ 'rs-badge--new': product.badge === 'new' }">
          {{ rsBadges[product.badge] }}
        </span>
      </span>
    </NuxtLink>
    <button
      type="button"
      class="rs-card__fav"
      :class="{ 'is-on': cart.isFav(product.id) }"
      :aria-pressed="cart.isFav(product.id)"
      :aria-label="cart.isFav(product.id) ? 'Убрать из избранного' : 'В избранное'"
      @click="cart.toggleFav(product.id)"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      </svg>
    </button>

    <div class="rs-card__body">
      <div v-if="stock" class="rs-card__price">
        <b>{{ rsRub(product.price) }}</b>
        <s v-if="product.old">{{ rsRub(product.old) }}</s>
        <span class="rs-card__per">{{ rsPer(product) }}</span>
      </div>
      <NuxtLink :to="to" class="rs-card__name">
        {{ product.name }}<span v-if="product.sub">, {{ product.sub }}</span>
      </NuxtLink>
      <p v-if="stock" class="rs-card__hint">
        <template v-if="product.unit === 'g100'">{{ rsRub(rsPerKg(product)) }} за кг</template>
        <template v-else-if="product.unit === 'whole'">{{ rsWeightLabel(product) }}</template>
        <template v-else-if="product.unit === 'kg'">на вес, от 1 кг</template>
        <template v-else>{{ product.note ?? 'цена за упаковку' }}</template>
      </p>
      <RsBuy :product="product" class="rs-card__buy" />
    </div>
  </article>
</template>

<style lang="scss">
.rs .rs-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  container: rs-card / inline-size;

  &__photo {
    position: relative;
    display: block;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: var(--rs-r-lg);
    background: var(--rs-ice);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      mix-blend-mode: multiply;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  &.is-out &__photo img {
    opacity: 0.55;
    filter: grayscale(0.5);
  }

  &__badges {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    gap: 6px;
  }

  &__fav {
    position: absolute;
    top: 8px;
    right: 8px;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    color: var(--rs-muted);
    transition: color 0.15s;

    &:hover {
      color: var(--rs-salmon);
    }

    &.is-on {
      color: var(--rs-salmon);

      svg {
        fill: currentColor;
      }
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 6px;
    padding: 14px 2px 0;
    min-width: 0;
  }

  &__price {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 8px;

    b {
      font-size: 20px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    s {
      font-size: 14px;
      color: var(--rs-muted);
      white-space: nowrap;
    }
  }

  &__per {
    padding: 2px 8px;
    border-radius: 6px;
    background: var(--rs-ice);
    color: var(--rs-blue-d);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  &__name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-weight: 500;
    line-height: 1.35;
    overflow-wrap: anywhere;

    span {
      color: var(--rs-muted);
      font-weight: 400;
    }

    &:hover {
      color: var(--rs-blue);
    }
  }

  &__hint {
    font-size: 13px;
    color: var(--rs-muted);
  }

  &__buy {
    margin-top: auto;
    padding-top: 6px;
  }
}

.rs .rs-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px 20px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px 12px;
  }
}
</style>
