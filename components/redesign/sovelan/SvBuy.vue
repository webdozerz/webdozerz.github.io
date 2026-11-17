<script lang="ts" setup>
// «Заказать» оригинала: количество 1–9999 шт. и добавление в корзину-заявку.
import type { SvProduct } from '~/utils/sovelan.data'
import { useSvOrder } from '~/composables/useSovelan'
import SvIcon from '~/components/redesign/sovelan/SvIcon.vue'

const props = defineProps<{ p: SvProduct; wide?: boolean }>()
const order = useSvOrder()
const q = computed(() => order.qty(props.p.id))
const onInput = (e: Event) => {
  const el = e.target as HTMLInputElement
  const v = parseInt(el.value.replace(/\D/g, ''), 10)
  if (!Number.isNaN(v)) order.set(props.p.id, v)
}
const onBlur = (e: Event) => {
  ;(e.target as HTMLInputElement).value = String(q.value)
}
</script>

<template>
  <div class="sv-buy" :class="{ 'sv-buy--wide': wide }">
    <button v-if="!q" type="button" class="sv-btn sv-buy__add" @click="order.add(p)"><SvIcon name="bag" /><span>В заявку</span></button>
    <div v-else class="sv-qty" role="group" :aria-label="`Количество: ${p.t}`">
      <button type="button" class="sv-qty__b" aria-label="Меньше" @click="order.set(p.id, q - 1)"><SvIcon name="minus" /></button>
      <label class="sv-qty__v">
        <input :value="q" inputmode="numeric" :style="{ width: `${String(q).length + 0.6}ch` }" aria-label="Штук" @input="onInput" @blur="onBlur" />
        <span>шт.</span>
      </label>
      <button type="button" class="sv-qty__b" aria-label="Больше" @click="order.set(p.id, q + 1)"><SvIcon name="plus" /></button>
    </div>
  </div>
</template>
