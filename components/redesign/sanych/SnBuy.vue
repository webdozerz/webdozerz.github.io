<script lang="ts" setup>
// Блок покупки: разделка, количество, примерная сумма и кнопка.
// Один и тот же в карточке каталога, на странице товара и в блоке «Как мы режем» на главной.
import SnQty from './SnQty.vue'

const props = withDefaults(
  defineProps<{ product: SnProduct; variant?: 'card' | 'page' }>(),
  { variant: 'card' },
)

const cart = useSanychCart()
const router = useRouter()
const qty = ref(snMin(props.product))
const cut = ref<SnCut>('whole')
const justAdded = ref(false)

const sum = computed(() => snSum(props.product, qty.value))
const added = computed(() => cart.inCart(props.product.id))

const add = () => {
  cart.add(props.product.id, qty.value, props.product.cut ? cut.value : '')
  justAdded.value = true
}
const onMain = () => {
  if (added.value && props.variant === 'card') router.push(snPath('/cart'))
  else add()
}
const buyNow = () => {
  if (!added.value) add()
  router.push(snPath('/cart'))
}
</script>

<template>
  <div class="sn-buy" :class="`sn-buy--${variant}`">
    <div v-if="product.cut" class="sn-seg sn-buy__cut" role="group" aria-label="Разделка">
      <button
        v-for="c in snCuts"
        :key="c.id"
        type="button"
        :class="{ 'is-on': cut === c.id }"
        :aria-pressed="cut === c.id"
        :title="c.hint"
        @click="cut = c.id"
      >
        {{ c.label }}
      </button>
    </div>

    <div class="sn-buy__sum">
      <span>{{ snQtyLabel(product, qty) }}<template v-if="product.unit === 'piece'"> · {{ snNum(snWeight(product, qty)[0]) }}–{{ snNum(snWeight(product, qty)[1]) }} кг</template></span>
      <b>{{ product.unit === 'piece' ? '≈ ' : '' }}{{ snRange(sum) }}</b>
    </div>

    <div class="sn-buy__row">
      <SnQty v-model="qty" :product="product" :small="variant === 'card'" />
      <button
        type="button"
        class="sn-btn sn-buy__add"
        :class="{ 'sn-btn--done': added && variant === 'card' }"
        :aria-label="added && variant === 'card' ? 'Перейти в корзину' : `В корзину: ${product.name}`"
        @click="onMain"
      >
        <svg v-if="added && variant === 'card'" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M5 8h14l-1.3 10.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5 8zM9 8V7a3 3 0 0 1 6 0v1" />
        </svg>
        <span class="sn-buy__label">{{ added && variant === 'card' ? 'В корзине' : 'В корзину' }}</span>
      </button>
    </div>

    <template v-if="variant === 'page'">
      <button type="button" class="sn-btn sn-btn--soft sn-btn--wide" @click="buyNow">Купить сейчас</button>
      <p v-if="justAdded" class="sn-note" role="status">
        Добавили {{ snQtyLabel(product, qty) }}<template v-if="product.cut">, {{ cut === 'chop' ? 'нарубить' : 'куском' }}</template>.
        <NuxtLink :to="snPath('/cart')" class="sn-link">Перейти в корзину</NuxtLink>
      </p>
    </template>
  </div>
</template>

<style lang="scss">
.sn .sn-buy {
  display: grid;
  // minmax(0, 1fr), а не auto: иначе колонка растягивается до min-content кнопок разделки
  // и узкая карточка распирает страницу.
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
  min-width: 0;
}

.sn .sn-buy__sum {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
  color: var(--sn-muted);
  font-variant-numeric: tabular-nums;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  b {
    color: var(--sn-ink);
    font-size: 14px;
    white-space: nowrap;
  }
}

.sn .sn-buy__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
}

.sn .sn-buy--card {
  .sn-buy__add {
    min-height: 42px;
    padding: 0 14px;
  }

  .sn-seg button {
    min-height: 32px;
    padding: 0 6px;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.sn .sn-buy--page {
  gap: 12px;

  .sn-buy__sum {
    font-size: 15px;

    b {
      font-size: 22px;
      font-family: var(--sn-head);
      font-weight: 600;
    }
  }

  .sn-buy__row {
    grid-template-columns: minmax(150px, 220px) minmax(0, 1fr);
  }

  .sn-seg button {
    min-height: 44px;
    font-size: 14px;
  }
}

// Блок покупки на странице товара и на главной: на телефоне счётчик и кнопка пополам.
@media (max-width: 560px) {
  .sn .sn-buy--page .sn-buy__row {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

@media (max-width: 360px) {
  .sn .sn-buy--page .sn-buy__row {
    grid-template-columns: 1fr;
  }
}

// Узкая карточка (две колонки на телефоне): счётчик на всю ширину, кнопка под ним.
@container sncard (max-width: 230px) {
  .sn .sn-buy--card .sn-buy__row {
    grid-template-columns: 1fr;
  }
}

// Совсем узкая карточка (320–370 px экрана): «Нарубить» должно влезать целиком.
@container sncard (max-width: 160px) {
  .sn .sn-buy--card .sn-seg {
    gap: 2px;
    padding: 3px;
  }

  .sn .sn-buy--card .sn-seg button {
    padding: 0 2px;
    font-size: 11px;
  }
}
</style>
