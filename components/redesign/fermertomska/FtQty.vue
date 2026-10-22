<script lang="ts" setup>
import FtIcon from './FtIcon.vue'

// Счётчик количества товара в корзине: «− 2 шт +». Единица — шт или кг.
const props = defineProps<{ product: FtProduct; size?: 'sm' | 'md'; noTrash?: boolean }>()
const cart = useFermertomskaCart()
const qty = computed(() => cart.qtyOf(props.product.id))
</script>

<template>
  <div class="ft-qty" :class="`ft-qty--${size ?? 'md'}`">
    <button type="button" :aria-label="`Меньше: ${product.name}`" @click="cart.remove(product.id)">
      <FtIcon :name="qty > 1 || noTrash ? 'minus' : 'trash'" :size="18" />
    </button>
    <output aria-live="polite">{{ ftQtyLabel(qty, product.unit) }}</output>
    <button type="button" :aria-label="`Больше: ${product.name}`" @click="cart.add(product.id)">
      <FtIcon name="plus" :size="18" />
    </button>
  </div>
</template>

<style lang="scss">
.ft .ft-qty {
  display: grid;
  grid-template-columns: 44px minmax(44px, 1fr) 44px;
  align-items: center;
  height: 48px;
  border-radius: var(--ft-r);
  background: var(--ft-accent-soft);
  color: var(--ft-accent-d);

  button {
    display: grid;
    place-items: center;
    height: 100%;
    border-radius: var(--ft-r);
    transition: background-color 0.15s;

    &:hover {
      background: #cfe8de;
    }
  }

  output {
    font-weight: 900;
    text-align: center;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  &--sm {
    grid-template-columns: 38px minmax(40px, 1fr) 38px;
    height: 40px;
    font-size: 15px;
  }
}
</style>
