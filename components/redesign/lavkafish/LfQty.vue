<script lang="ts" setup>
import LfIcon from './LfIcon.vue'

// «В заказ» превращается в счётчик: «− 2 шт +» для рыбы и упаковок, «− 3 кг +» для развеса.
const props = withDefaults(defineProps<{ pid: string; vid: string; label?: string; wide?: boolean }>(), {
  label: 'В заказ',
  wide: false,
})
const cart = useLavkafishCart()
const variant = computed(() => lfFindProduct(props.pid)?.variants.find((v) => v.id === props.vid))
const qty = computed(() => cart.qtyOf(props.pid, props.vid))
const atLimit = computed(() => variant.value?.left !== undefined && qty.value >= variant.value.left)
</script>

<template>
  <div class="lf-qty" :class="{ 'lf-qty--wide': props.wide, 'is-on': qty > 0 }">
    <button v-if="!qty" type="button" class="lf-qty__add" @click.stop="cart.add(props.pid, props.vid)">
      <LfIcon name="plus" :size="18" />
      <span>{{ props.label }}</span>
    </button>
    <template v-else>
      <button type="button" class="lf-qty__btn" aria-label="Меньше" @click.stop="cart.remove(props.pid, props.vid)">
        <LfIcon name="minus" :size="18" />
      </button>
      <span class="lf-qty__val" aria-live="polite">
        <b>{{ qty }}</b> {{ variant ? lfUnitLabel(variant) : '' }}
      </span>
      <button
        type="button"
        class="lf-qty__btn"
        aria-label="Больше"
        :disabled="atLimit"
        :title="atLimit ? `Осталось ${variant?.left} шт` : undefined"
        @click.stop="cart.add(props.pid, props.vid)"
      >
        <LfIcon name="plus" :size="18" />
      </button>
    </template>
  </div>
</template>

<style lang="scss">
.lf-qty {
  display: inline-flex;
  flex: none;
  align-items: center;
  height: 44px;
  border-radius: var(--lf-r);
  white-space: nowrap;

  &--wide {
    width: 100%;
  }

  &.is-on {
    justify-content: space-between;
    min-width: 128px;
    background: var(--lf-accent-soft);
  }

  &__add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    height: 44px;
    padding: 0 16px;
    border-radius: var(--lf-r);
    background: var(--lf-accent);
    color: var(--lf-ink);
    font-weight: 700;
    transition: background-color 0.15s;

    &:hover {
      background: var(--lf-accent-d);
    }
  }

  &__btn {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--lf-r);
    color: var(--lf-ink);
    transition: background-color 0.15s;

    &:hover:not(:disabled) {
      background: rgba(245, 144, 10, 0.25);
    }

    &:disabled {
      opacity: 0.35;
      cursor: default;
    }
  }

  &__val {
    min-width: 40px;
    font-variant-numeric: tabular-nums;
    text-align: center;

    b {
      font-weight: 800;
    }
  }
}
</style>
