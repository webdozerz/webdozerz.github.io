<script lang="ts" setup>
// Счётчик «− N шт +» с вводом числа, как в карточке оригинала. Стили — в оболочке (.gm-qty).
import GmIcon from '~/components/redesign/gornyimed/GmIcon.vue'

const model = defineModel<number>({ default: 1 })
const props = withDefaults(defineProps<{ min?: number; unit?: string; small?: boolean }>(), { min: 1, unit: 'шт', small: false })

const set = (n: number) => {
  model.value = Math.max(props.min, Math.min(999, Math.round(n) || props.min))
}
const width = computed(() => `${String(model.value).length + 0.6}ch`)
</script>

<template>
  <div class="gm-qty" :class="{ 'gm-qty--small': props.small }">
    <button type="button" :aria-label="model > props.min ? 'Меньше' : 'Убрать'" @click="set(model - 1)"><GmIcon name="minus" :size="18" /></button>
    <label class="gm-qty__val">
      <input :value="model" :style="{ width }" inputmode="numeric" aria-label="Количество" @change="set(+($event.target as HTMLInputElement).value)" />
      <span>{{ props.unit }}</span>
    </label>
    <button type="button" aria-label="Больше" @click="set(model + 1)"><GmIcon name="plus" :size="18" /></button>
  </div>
</template>
