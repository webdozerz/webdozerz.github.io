<script lang="ts" setup>
// «В заявку» → счётчик коробок (весовая) или штук/вёдер. Стили — в оболочке (.ml-buy), их рисует и страница «Заявка».
import { mlByBox } from '~/utils/moreland'
import type { MlProduct } from '~/utils/moreland.data'
import { useMlList } from '~/composables/useMoreland'
import MlIcon from '~/components/redesign/moreland/MlIcon.vue'

const props = withDefaults(defineProps<{ p: MlProduct; big?: boolean }>(), { big: false })
const list = useMlList()
const q = computed(() => list.qty(props.p.id))
const word = computed(() => (mlByBox(props.p) ? 'кор.' : props.p.unit === 'ведро' ? 'вед.' : 'шт'))
const onInput = (e: Event) => {
  const v = parseInt((e.target as HTMLInputElement).value.replace(/\D/g, ''), 10)
  list.set(props.p.id, Number.isFinite(v) ? v : 0)
}
</script>

<template>
  <div class="ml-buy" :class="{ 'ml-buy--big': props.big }">
    <button v-if="!q" type="button" class="ml-btn ml-buy__add" @click="list.add(props.p)"><MlIcon name="plus" />В заявку</button>
    <div v-else class="ml-qty" role="group" :aria-label="`Количество: ${props.p.n}`">
      <button type="button" class="ml-qty__b" aria-label="Меньше" @click="list.set(props.p.id, q - 1)"><MlIcon name="minus" /></button>
      <label class="ml-qty__v">
        <input :value="q" inputmode="numeric" :style="{ width: `${String(q).length + 0.6}ch` }" aria-label="Количество" @change="onInput" />
        <span>{{ word }}</span>
      </label>
      <button type="button" class="ml-qty__b" aria-label="Больше" @click="list.set(props.p.id, q + 1)"><MlIcon name="plus" /></button>
    </div>
  </div>
</template>
