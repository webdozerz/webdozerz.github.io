<script lang="ts" setup>
// Счётчик: мясо с весом тушки — тушками, молодняк — головами от 10, субпродукты и говядина — кг.
// Ниже минимума позиция убирается из корзины.
import IzIcon from '~/components/redesign/izyumovskoe/IzIcon.vue'

const props = defineProps<{ p: IzProduct; big?: boolean }>()
const cart = useIzyumCart()
const qty = computed(() => cart.qtyOf(props.p.id))
const unit = computed(() => (props.p.unit === 'гол.' ? 'гол.' : props.p.weight ? 'туш.' : 'кг'))
const width = computed(() => `${String(qty.value).length + 0.6}ch`)
const onInput = (e: Event) => {
  const v = Number((e.target as HTMLInputElement).value.replace(/\D/g, ''))
  if (v) cart.setQty(props.p, Math.max(v, props.p.min))
}
</script>

<template>
  <div class="iz-qty" :class="{ 'iz-qty--big': props.big }">
    <button type="button" class="iz-qty__btn" :aria-label="qty <= props.p.min ? 'Убрать' : 'Меньше'" @click="cart.dec(props.p)">
      <IzIcon :name="qty <= props.p.min ? 'trash' : 'minus'" :size="18" />
    </button>
    <label class="iz-qty__val">
      <input :value="qty" inputmode="numeric" :style="{ width }" aria-label="Количество" @change="onInput" />
      <span>{{ unit }}</span>
    </label>
    <button type="button" class="iz-qty__btn" aria-label="Больше" @click="cart.inc(props.p)"><IzIcon name="plus" :size="18" /></button>
  </div>
</template>
