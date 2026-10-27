<script lang="ts" setup>
import PlIcon from './PlIcon.vue'

// «В корзину» -> счётчик: у весовых — килограммы, у фасовок — штуки.
const props = withDefaults(defineProps<{ product: PlProduct; big?: boolean }>(), { big: false })
const cart = usePapinalavkaCart()
const ui = usePapinalavkaUi()
const qty = computed(() => cart.qtyOf(props.product.id))
const unit = computed(() => plQtyUnit(props.product))

const add = () => {
  cart.add(props.product.id)
  ui.say(`«${props.product.name}» в корзине`)
}
</script>

<template>
  <div class="pl-buy" :class="{ 'pl-buy--big': props.big }">
    <button v-if="!qty" type="button" class="pl-btn pl-btn--main pl-buy__add" @click="add">
      <PlIcon name="basket" :size="20" />
      <span>В корзину</span>
    </button>
    <div v-else class="pl-qty" role="group" :aria-label="`Количество: ${props.product.name}`">
      <button type="button" aria-label="Меньше" @click="cart.set(props.product.id, qty - 1)"><PlIcon name="minus" :size="18" /></button>
      <span class="pl-qty__n">{{ qty }} {{ unit }}</span>
      <button type="button" aria-label="Больше" @click="cart.add(props.product.id)"><PlIcon name="plus" :size="18" /></button>
    </div>
  </div>
</template>
