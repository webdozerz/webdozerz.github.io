<script lang="ts" setup>
import BzIcon from '~/components/redesign/22bee/BzIcon.vue'

// Счётчик куботейнеров (у сотов — рамок). Пока сорта нет в заявке — кнопка «В заявку».
const props = withDefaults(defineProps<{ sort: BzSort; big?: boolean }>(), { big: false })
const order = useBee22Order()
const ui = useBee22Ui()

const qty = computed(() => order.qtyOf(props.sort.id))
const unit = computed(() => (props.sort.frames ? 'рам.' : 'куб.'))
const onAdd = () => {
  const first = !qty.value
  order.add(props.sort)
  if (first) ui.say(`${props.sort.short}: ${props.sort.frames ? bzFramesLabel(bzMinFrames) : bzCubes(1) + ' · 34 кг'} в заявке`)
}
const onInput = (e: Event) => {
  const v = Number((e.target as HTMLInputElement).value)
  if (v) order.setQty(props.sort, Math.max(v, order.minOf(props.sort)))
}
</script>

<template>
  <button v-if="!props.sort.stock" type="button" class="bz-btn bz-btn--off bz-qtybtn" :class="{ 'is-big': props.big }" disabled>Нет в наличии</button>
  <button v-else-if="!qty" type="button" class="bz-btn bz-btn--main bz-qtybtn" :class="{ 'is-big': props.big }" @click="onAdd">
    <BzIcon name="plus" :size="18" />
    <span>В заявку</span>
  </button>
  <div v-else class="bz-qty" :class="{ 'is-big': props.big }">
    <button type="button" :aria-label="`Убрать один, ${props.sort.short}`" @click="order.sub(props.sort)"><BzIcon :name="qty <= order.minOf(props.sort) ? 'trash' : 'minus'" :size="18" /></button>
    <label>
      <input
        :value="qty"
        type="number"
        inputmode="numeric"
        min="1"
        :style="{ width: `${String(qty).length + 0.6}ch` }"
        :aria-label="`Количество, ${props.sort.short}`"
        @change="onInput"
      />
      <span>{{ unit }}</span>
    </label>
    <button type="button" :aria-label="`Добавить один, ${props.sort.short}`" @click="order.add(props.sort)"><BzIcon name="plus" :size="18" /></button>
  </div>
</template>
