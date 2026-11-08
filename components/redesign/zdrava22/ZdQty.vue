<script lang="ts" setup>
import { useZdNote } from '~/composables/useZdrava22'
import ZdIcon from '~/components/redesign/zdrava22/ZdIcon.vue'

// Счётчик строки заказа: коробки, куботейнеры, кг (шаг 50 г / 0,5 кг) или флаконы
const props = defineProps<{ k: string; text: string }>()
const note = useZdNote()
</script>

<template>
  <div class="zd-qty">
    <button type="button" class="zd-qty__btn" aria-label="Меньше" @click="note.bump(props.k, -1)"><ZdIcon name="minus" :size="18" /></button>
    <span class="zd-qty__val">{{ props.text }}</span>
    <button type="button" class="zd-qty__btn" aria-label="Больше" @click="note.bump(props.k, 1)"><ZdIcon name="plus" :size="18" /></button>
  </div>
</template>
