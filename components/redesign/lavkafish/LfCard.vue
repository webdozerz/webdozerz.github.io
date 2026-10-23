<script lang="ts" setup>
import LfIcon from './LfIcon.vue'
import LfQty from './LfQty.vue'

// Ценник-лесенка: цена за кг, ступени «от 3 шт» загораются по мере набора, ниже — расчёт по весу.
const props = defineProps<{ product: LfProduct }>()
const cart = useLavkafishCart()
const ui = useLavkafishUi()

const vid = ref(props.product.variants[0].id)
const variant = computed(() => props.product.variants.find((v) => v.id === vid.value) ?? props.product.variants[0])
const qty = computed(() => cart.qtyOf(props.product.id, variant.value.id))
const unitPrice = computed(() => lfUnitPrice(variant.value, Math.max(qty.value, 1)))
const est = computed(() => lfEstimate(variant.value, qty.value))
const batch = computed(() => {
  const id = props.product.batch[cart.city.value]
  return id ? ui.batch(id) : null
})
const perUnit = computed(() => (variant.value.unit === 'pack' ? variant.value.pack || 'шт' : 'кг'))
const weightNote = computed(() => {
  const w = variant.value.weight
  if (variant.value.unit !== 'piece' || !w) return ''
  if (w[0] === w[1]) return `${lfKg(w[0])} за штуку`
  return w[1] === null ? `от ${lfKg(w[0])} за штуку` : `${w[0].toLocaleString('ru-RU')}–${lfKg(w[1])} за штуку`
})
const inCart = (id: string) => cart.qtyOf(props.product.id, id) > 0
</script>

<template>
  <article class="lf-card">
    <button
      type="button"
      class="lf-card__photo"
      :aria-label="`Подробнее: ${props.product.name}`"
      @click="ui.product.value = props.product.id"
    >
      <img :src="props.product.img" :alt="props.product.name" loading="lazy" width="480" height="360" />
      <span v-if="props.product.origin" class="lf-card__origin">{{ props.product.origin }}</span>
      <span v-if="variant.left" class="lf-card__left">Осталось {{ variant.left }} шт</span>
    </button>

    <div class="lf-card__body">
      <h3 class="lf-card__name">
        <button type="button" @click="ui.product.value = props.product.id">
          {{ props.product.name }}
        </button>
      </h3>

      <div v-if="props.product.variants.length > 1" class="lf-card__variants" role="radiogroup" aria-label="Вариант">
        <button
          v-for="v in props.product.variants"
          :key="v.id"
          type="button"
          role="radio"
          :aria-checked="v.id === vid"
          class="lf-chip"
          :class="{ 'is-active': v.id === vid, 'is-in': inCart(v.id) }"
          @click="vid = v.id"
        >
          {{ v.label }}
        </button>
      </div>

      <p v-if="weightNote || variant.note" class="lf-card__meta">
        <span v-if="weightNote"><LfIcon name="scale" :size="16" />{{ weightNote }}</span>
        <span v-if="variant.note" class="lf-card__note">{{ variant.note }}</span>
      </p>

      <div class="lf-card__price">
        <p class="lf-card__sum">
          <b>{{ lfPrice(unitPrice) }}</b
          ><span>/{{ perUnit }}</span>
        </p>
        <ul v-if="variant.tiers" class="lf-ladder">
          <li v-for="t in variant.tiers" :key="t.from" :class="{ 'is-on': qty >= t.from }">
            <template v-if="qty >= t.from">цена от {{ t.from }} {{ lfUnitLabel(variant) }}</template>
            <template v-else>от {{ t.from }} {{ lfUnitLabel(variant) }} — {{ lfPrice(t.price) }}</template>
          </li>
        </ul>
      </div>

      <div class="lf-card__foot">
        <p v-if="qty" class="lf-card__est">
          <span>{{ est.exact ? 'Сумма' : 'Примерно' }}</span>
          <b>{{ lfRange(est) }}</b>
        </p>
        <p v-else-if="batch" class="lf-card__batch">
          <LfIcon name="truck" :size="16" />Привоз {{ batch.short }},
          {{ batch.dm }}
        </p>
        <LfQty :pid="props.product.id" :vid="variant.id" />
      </div>
    </div>
  </article>
</template>

<style lang="scss">
.lf-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--lf-r-lg);
  background: #fff;
  box-shadow: inset 0 0 0 1px var(--lf-line);

  &__photo {
    position: relative;
    display: block;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    background: var(--lf-surface);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  &__origin,
  &__left {
    position: absolute;
    top: 12px;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.3;
  }

  &__origin {
    left: 12px;
    background: rgba(255, 255, 255, 0.92);
    color: var(--lf-ink);
  }

  &__left {
    right: 12px;
    background: var(--lf-ink);
    color: #fff;
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 12px;
    padding: 16px 18px 18px;
  }

  &__name {
    font-size: 19px;
    line-height: 1.25;

    button {
      text-align: left;
      transition: color 0.15s;

      &:hover {
        color: var(--lf-accent-text);
      }
    }
  }

  &__variants {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    color: var(--lf-muted);
    font-size: 14px;

    span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
  }

  &__note {
    color: var(--lf-ink);
    font-weight: 600;
  }

  &__price {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 12px;
    margin-top: auto;
  }

  &__sum {
    white-space: nowrap;

    b {
      font-size: 24px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.01em;
    }

    span {
      margin-left: 2px;
      color: var(--lf-muted);
      font-size: 15px;
    }
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-height: 44px;
  }

  &__est,
  &__batch {
    min-width: 0;
    font-size: 14px;
    line-height: 1.3;
  }

  &__est {
    display: flex;
    flex-direction: column;

    span {
      color: var(--lf-muted);
    }

    b {
      font-size: 16px;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
  }

  &__batch {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--lf-muted);

    .lf-icon {
      flex: none;
    }
  }

  @media (max-width: 576px) {
    &__body {
      padding: 14px 14px 16px;
    }

    &__foot {
      flex-wrap: wrap;

      .lf-qty {
        width: 100%;
      }
    }
  }
}

ul.lf-ladder {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  li {
    padding: 3px 8px;
    border-radius: 8px;
    background: var(--lf-surface);
    color: var(--lf-text);
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    transition:
      background-color 0.15s,
      color 0.15s;

    &.is-on {
      background: var(--lf-ok-soft);
      color: var(--lf-ok);
    }
  }
}
</style>
