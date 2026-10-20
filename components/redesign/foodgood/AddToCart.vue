<script lang="ts" setup>
const props = defineProps<{ productId: string; large?: boolean }>()

const cart = useFoodgoodCart()
const qty = computed(() => cart.qtyOf(props.productId))
</script>

<template>
  <div class="atc" :class="{ 'atc--large': large }">
    <button v-if="!qty" type="button" class="atc__add" @click="cart.add(productId)">
      В корзину
    </button>
    <div v-else class="atc__stepper" role="group" aria-label="Количество">
      <button type="button" aria-label="Меньше" @click="cart.remove(productId)">−</button>
      <span aria-live="polite">{{ qty }}</span>
      <button type="button" aria-label="Больше" @click="cart.add(productId)">+</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.atc {
  --h: 42px;

  &--large {
    --h: 52px;
  }

  &__add,
  &__stepper {
    height: var(--h);
    border-radius: 999px;
  }

  &__add {
    width: 100%;
    padding: 0 22px;
    border: 0;
    background: var(--fg-forest);
    color: #fff;
    font-weight: 700;
    font-size: 15px;
    transition: background 0.15s, transform 0.1s;

    &:hover {
      background: var(--fg-forest-2);
    }
    &:active {
      transform: scale(0.98);
    }
  }

  &__stepper {
    display: grid;
    grid-template-columns: var(--h) 1fr var(--h);
    align-items: center;
    background: var(--fg-leaf-soft);
    border: 1px solid #cfe2bb;
    overflow: hidden;

    span {
      text-align: center;
      font-weight: 700;
      color: var(--fg-forest);
    }

    button {
      height: 100%;
      border: 0;
      background: transparent;
      color: var(--fg-forest);
      font-size: 20px;
      line-height: 1;

      &:hover {
        background: #d3e6bf;
      }
    }
  }
}
</style>
