<script lang="ts" setup>
// Кнопка «В корзину», после добавления — счётчик в штуках/упаковках.
const props = defineProps<{ product: FgProduct; large?: boolean }>()
const cart = useFoodgoodCart()
const qty = computed(() => cart.qtyOf(props.product.id))
</script>

<template>
  <div class="fg-buy" :class="{ 'fg-buy--large': large }">
    <button
      v-if="!qty"
      type="button"
      class="fg-buy__add"
      :aria-label="`В корзину: ${product.name}`"
      @click="cart.add(product.id)"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 6v12M6 12h12" /></svg>
      В корзину
    </button>
    <div v-else class="fg-buy__qty">
      <button type="button" :aria-label="`Меньше: ${product.name}`" @click="cart.remove(product.id)">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 12h12" /></svg>
      </button>
      <output aria-live="polite">{{ qty }} {{ product.perKg ? 'кг' : 'шт' }}</output>
      <button type="button" :aria-label="`Больше: ${product.name}`" @click="cart.add(product.id)">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 6v12M6 12h12" /></svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.fg .fg-buy {
  min-height: 44px;

  &__add {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    min-height: 44px;
    padding: 0 12px;
    border-radius: var(--fg-r);
    background: var(--fg-leaf-soft);
    font-weight: 600;
    white-space: nowrap;
    transition:
      background-color 0.15s,
      color 0.15s;

    &:hover {
      background: var(--fg-leaf);
      color: #fff;
    }
  }

  &__qty {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) 44px;
    align-items: center;
    min-height: 44px;
    border-radius: var(--fg-r);
    background: var(--fg-leaf);
    color: #fff;

    button {
      display: grid;
      place-items: center;
      height: 44px;
      border-radius: var(--fg-r);
      transition: background-color 0.15s;

      &:hover {
        background: var(--fg-leaf-d);
      }
    }

    output {
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
  }

  &--large {
    min-height: 54px;

    .fg-buy__add {
      min-height: 54px;
      background: var(--fg-leaf);
      color: #fff;
      font-size: 17px;

      &:hover {
        background: var(--fg-leaf-d);
      }
    }

    .fg-buy__qty {
      grid-template-columns: 54px minmax(0, 1fr) 54px;
      min-height: 54px;
      font-size: 17px;

      button {
        height: 54px;
      }
    }
  }
}
</style>
