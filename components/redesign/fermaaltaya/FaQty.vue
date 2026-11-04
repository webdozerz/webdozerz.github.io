<script lang="ts" setup>
// Счётчик количества: «− 2 уп +», число можно ввести руками; 0 убирает позицию
import FaIcon from './FaIcon.vue'

const props = defineProps<{ p: FaProduct }>()
const cart = useFermaAltaya()
const n = computed(() => cart.qtyOf(props.p.id))
const unit = computed(() => faCountLabel(props.p))
const onInput = (e: Event) => cart.setQty(props.p, Number((e.target as HTMLInputElement).value))
</script>

<template>
  <div class="fa-qty">
    <button type="button" class="fa-qty__btn" :aria-label="`Убрать одну: ${props.p.title}`" @click="cart.dec(props.p)">
      <FaIcon name="minus" :size="18" />
    </button>
    <label class="fa-qty__val">
      <input :value="n" inputmode="numeric" :style="{ width: `${String(n).length + 0.6}ch` }" aria-label="Количество" @change="onInput" />
      <span>{{ unit }}</span>
    </label>
    <button type="button" class="fa-qty__btn" :aria-label="`Добавить ещё: ${props.p.title}`" @click="cart.inc(props.p)">
      <FaIcon name="plus" :size="18" />
    </button>
  </div>
</template>
