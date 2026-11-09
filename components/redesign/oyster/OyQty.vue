<script lang="ts" setup>
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'

// Счётчик: шаг 1 шт или 0,5 кг; подпись с единицей («12 шт», «1,5 кг»)
const model = defineModel<number>({ default: 1 })
const props = withDefaults(defineProps<{ unit?: string; step?: number; min?: number; small?: boolean }>(), { unit: 'шт', step: 1, min: 1, small: false })
const label = computed(() => `${model.value.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} ${props.unit === 'набор' ? 'шт' : props.unit}`)
const bump = (d: number) => {
  const n = Math.round((model.value + d * props.step) * 10) / 10
  model.value = Math.max(props.min, n)
}
</script>

<template>
  <div class="oy-qty" :class="{ 'oy-qty--small': props.small }">
    <button type="button" class="oy-qty__btn" aria-label="Меньше" :disabled="model <= props.min" @click="bump(-1)"><OyIcon name="minus" :size="16" /></button>
    <span class="oy-qty__val">{{ label }}</span>
    <button type="button" class="oy-qty__btn" aria-label="Больше" @click="bump(1)"><OyIcon name="plus" :size="16" /></button>
  </div>
</template>
