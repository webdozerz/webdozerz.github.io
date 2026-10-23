<script lang="ts" setup>
import FmIcon from './FmIcon.vue'

// Кнопка «+» превращается в счётчик фасовок: «− 2 × 1 л +».
const props = withDefaults(defineProps<{ id: string; big?: boolean }>(), { big: false })
const order = useFermatomskOrder()
const product = computed(() => fmFindProduct(props.id))
const qty = computed(() => order.qtyOf(props.id))
</script>

<template>
  <div class="fm-qty" :class="{ 'fm-qty--big': props.big, 'is-on': qty > 0 }">
    <button
      v-if="!qty"
      type="button"
      class="fm-qty__add"
      :aria-label="`Добавить в заказ: ${product?.name}`"
      @click.stop="order.add(props.id)"
    >
      <FmIcon name="plus" :size="20" />
      <span v-if="props.big">В заказ</span>
    </button>
    <template v-else>
      <button type="button" class="fm-qty__btn" aria-label="Меньше" @click.stop="order.remove(props.id)">
        <FmIcon name="minus" :size="18" />
      </button>
      <span class="fm-qty__val" aria-live="polite">
        <b>{{ qty }}</b><small> × {{ product?.unit }}</small>
      </span>
      <button type="button" class="fm-qty__btn" aria-label="Больше" @click.stop="order.add(props.id)">
        <FmIcon name="plus" :size="18" />
      </button>
    </template>
  </div>
</template>

<style lang="scss">
.fm-qty {
  display: inline-flex;
  align-items: center;
  height: 44px;
  border-radius: 12px;

  &.is-on {
    background: var(--fm-green-soft);
    color: var(--fm-ink);
  }

  &__add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 44px;
    height: 44px;
    padding: 0 10px;
    border-radius: 12px;
    background: var(--fm-green);
    color: #fff;
    font-weight: 600;
    white-space: nowrap;
    transition: background 0.15s;

    &:hover {
      background: var(--fm-green-d);
    }
  }

  &__btn {
    display: grid;
    place-items: center;
    width: 40px;
    height: 44px;
    border-radius: 12px;
    color: var(--fm-green-d);
    transition: background 0.15s;

    &:hover {
      background: rgba(29, 138, 69, 0.12);
    }
  }

  &__val {
    min-width: 54px;
    text-align: center;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;

    b {
      font-weight: 700;
    }

    small {
      color: var(--fm-muted);
      font-size: 13px;
    }
  }

  &--big {
    height: 52px;

    .fm-qty__add {
      height: 52px;
      padding: 0 22px;
      font-size: 16px;
    }

    .fm-qty__btn {
      width: 48px;
      height: 52px;
    }

    .fm-qty__val {
      min-width: 80px;
      font-size: 17px;
    }
  }
}
</style>
