<script lang="ts" setup>
import BpIcon from './BpIcon.vue'

// Добавление в список: первое нажатие кладёт минимум по условиям (весовой — 3 кг), дальше счётчик и «+ коробка».
const props = withDefaults(defineProps<{ product: BpProduct; small?: boolean }>(), { small: false })
const list = useBaltikproduktList()
const qty = computed(() => list.qtyOf(props.product.id))
const unit = computed(() => bpUnit(props.product))

const onInput = (e: Event) => {
  const v = Number((e.target as HTMLInputElement).value.replace(',', '.'))
  if (!Number.isNaN(v)) list.setQty(props.product.id, v)
}
</script>

<template>
  <div class="bp-buy" :class="{ 'bp-buy--small': props.small }">
    <button v-if="!qty" type="button" class="bp-btn bp-btn--soft bp-buy__add" @click="list.add(props.product)">
      <BpIcon name="plus" :size="18" />
      <span>В список</span>
    </button>
    <template v-else>
      <div class="bp-qty">
        <button type="button" :aria-label="`Убрать ${unit}`" @click="list.sub(props.product)"><BpIcon name="minus" :size="18" /></button>
        <label>
          <input :value="bpNum(qty)" :style="{ width: `${bpNum(qty).length + 0.6}ch` }" inputmode="decimal" :aria-label="`Количество, ${unit}`" @change="onInput" />
          <span>{{ unit }}</span>
        </label>
        <button type="button" :aria-label="`Добавить ${unit}`" @click="list.add(props.product)"><BpIcon name="plus" :size="18" /></button>
      </div>
      <button v-if="props.product.pack && !props.small" type="button" class="bp-buy__box" @click="list.addBox(props.product)">
        <BpIcon name="box" :size="16" />+ коробка
      </button>
    </template>
  </div>
</template>
