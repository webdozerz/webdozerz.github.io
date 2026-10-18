<script lang="ts" setup>
// Блок покупки: количество, сумма и кнопка. Один и тот же в карточке каталога и на странице товара.
// Товар не в наличии — вместо покупки «Сообщить о поступлении».
import RsQty from './RsQty.vue'

const props = withDefaults(defineProps<{ product: RsProduct; variant?: 'card' | 'page' }>(), { variant: 'card' })

const cart = useRybasibiriCart()
const router = useRouter()
const qty = ref(rsMin(props.product))
const justAdded = ref(false)
const notify = ref(false)

const sum = computed(() => rsSum(props.product, qty.value))
const added = computed(() => cart.qtyOf(props.product.id) > 0)
const inStock = computed(() => rsInStock(props.product))

const add = () => {
  cart.add(props.product.id, qty.value)
  justAdded.value = true
}
const onMain = () => {
  if (added.value && props.variant === 'card') router.push(rsPath('/cart'))
  else add()
}
const buyNow = () => {
  if (!added.value) add()
  router.push(rsPath('/cart'))
}
</script>

<template>
  <div class="rs-buy" :class="`rs-buy--${variant}`">
    <template v-if="inStock">
      <div class="rs-buy__sum">
        <span>{{ rsQtyLabel(product, qty) }}<template v-if="product.unit === 'whole' && product.weight"> · {{ rsNum(product.weight[0] * qty) }}–{{ rsNum(product.weight[1] * qty) }} кг</template></span>
        <b>{{ product.unit === 'whole' ? '≈ ' : '' }}{{ rsRange(sum) }}</b>
      </div>

      <div class="rs-buy__row">
        <RsQty
          v-model="qty"
          :label="rsQtyLabel(product, qty)"
          :step="rsStep(product)"
          :min="rsMin(product)"
          :name="product.name"
          :small="variant === 'card'"
        />
        <button
          type="button"
          class="rs-btn rs-buy__add"
          :class="{ 'rs-btn--done': added && variant === 'card' }"
          :aria-label="added && variant === 'card' ? 'Перейти в корзину' : `В корзину: ${product.name}`"
          @click="onMain"
        >
          <svg v-if="added && variant === 'card'" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M5 8h14l-1.3 10.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5 8zM9 8V7a3 3 0 0 1 6 0v1" />
          </svg>
          <span class="rs-buy__label">{{ added && variant === 'card' ? 'В корзине' : 'В корзину' }}</span>
        </button>
      </div>

      <template v-if="variant === 'page'">
        <button type="button" class="rs-btn rs-btn--soft rs-btn--wide" @click="buyNow">Купить в 1 клик</button>
        <p v-if="justAdded" class="rs-note" role="status">
          Добавили {{ rsQtyLabel(product, qty) }}.
          <NuxtLink :to="rsPath('/cart')" class="rs-link">Перейти в корзину</NuxtLink>
        </p>
      </template>
    </template>

    <template v-else>
      <div class="rs-buy__sum">
        <span class="rs-badge rs-badge--out">Нет в наличии</span>
      </div>
      <button
        type="button"
        class="rs-btn rs-btn--wide"
        :class="notify ? 'rs-btn--done' : 'rs-btn--soft'"
        :aria-pressed="notify"
        @click="notify = !notify"
      >
        {{ notify ? 'Сообщим о поступлении' : 'Сообщить о поступлении' }}
      </button>
      <p v-if="notify && variant === 'page'" class="rs-note" role="status">
        Это демо: в настоящем магазине здесь будет SMS или письмо, когда рыба появится.
      </p>
    </template>
  </div>
</template>

<style lang="scss">
.rs .rs-buy {
  display: grid;
  gap: 10px;
  min-width: 0;

  &__sum {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    min-height: 24px;
    font-size: 13px;
    color: var(--rs-muted);

    b {
      color: var(--rs-ink);
      font-size: 15px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
  }

  &__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
  }

  &--card &__add {
    min-height: 42px;
    padding: 0 14px;
  }

  &--page {
    gap: 12px;

    .rs-buy__row {
      grid-template-columns: minmax(0, 200px) minmax(0, 1fr);
    }

    .rs-buy__sum {
      font-size: 15px;

      b {
        font-size: 18px;
      }
    }
  }
}

// Узкая карточка: кнопка сжимается до иконки, в совсем узкой — счётчик над кнопкой.
@container rs-card (max-width: 250px) {
  .rs .rs-buy--card .rs-buy__label {
    display: none;
  }

  .rs .rs-buy--card .rs-buy__add {
    width: 46px;
    padding: 0;
  }
}

@container rs-card (max-width: 180px) {
  .rs .rs-buy--card .rs-buy__row {
    grid-template-columns: minmax(0, 1fr);
  }

  .rs .rs-buy--card .rs-buy__label {
    display: inline;
  }

  .rs .rs-buy--card .rs-buy__add {
    width: 100%;
  }

  .rs .rs-buy--card .rs-buy__sum {
    flex-direction: column;
    gap: 0;
  }
}
</style>
