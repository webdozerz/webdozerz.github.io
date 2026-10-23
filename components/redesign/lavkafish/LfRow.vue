<script lang="ts" setup>
import LfQty from './LfQty.vue'

// Строка прайса для позиций из канала без своего фото.
const props = defineProps<{ product: LfProduct }>()
const cart = useLavkafishCart()
const variant = computed(() => props.product.variants[0])
const qty = computed(() => cart.qtyOf(props.product.id, variant.value.id))
const est = computed(() => lfEstimate(variant.value, qty.value))
// Подпись варианта, если она не повторяет название: «порция 300–400 г, цена за кг».
const note = computed(() => {
  const v = variant.value
  const label = props.product.name.toLowerCase().includes(v.label.toLowerCase()) ? '' : v.label
  return v.unit === 'piece' ? [label, 'цена за кг'].filter(Boolean).join(', ') : label || 'цена за кг'
})
const per = computed(() => (variant.value.unit === 'pack' ? 'уп' : 'кг'))
</script>

<template>
  <li class="lf-row">
    <div class="lf-row__name">
      <b>{{ props.product.name }}</b>
      <span>{{ note }}</span>
    </div>
    <p class="lf-row__price">
      <span
        ><b>{{ lfPrice(lfUnitPrice(variant, Math.max(qty, 1))) }}</b
        >/{{ per }}</span
      >
      <small v-if="qty">≈ {{ lfRange(est) }}</small>
      <small v-else-if="variant.tiers" class="lf-row__tier"
        >от {{ variant.tiers[0].from }} {{ lfUnitLabel(variant) }} — {{ lfPrice(variant.tiers[0].price) }}</small
      >
    </p>
    <LfQty :pid="props.product.id" :vid="variant.id" label="В заказ" />
  </li>
</template>

<style lang="scss">
.lf-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 170px 140px;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-top: 1px solid var(--lf-line);

  &__name {
    display: flex;
    flex-direction: column;

    b {
      font-weight: 700;
    }

    span {
      color: var(--lf-muted);
      font-size: 14px;
    }
  }

  &__price {
    display: flex;
    flex-direction: column;
    color: var(--lf-muted);
    font-size: 14px;
    white-space: nowrap;

    b {
      color: var(--lf-ink);
      font-size: 18px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }

    small {
      color: var(--lf-ink);
      font-size: 13px;
    }

    .lf-row__tier {
      color: var(--lf-ok);
      font-weight: 700;
    }
  }

  .lf-qty {
    justify-self: end;
    width: 140px;
  }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px 12px;

    &__name {
      grid-column: 1 / -1;
    }

    .lf-qty {
      width: 136px;
    }
  }
}
</style>
