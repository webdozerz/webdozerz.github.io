<template>
  <div :class="['result-card', bgClass]">
    <p class="title">{{ title }}</p>
    <p class="value">{{ value }} ч</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  color?: string
  value?: number
}>()

const bgClass = computed(() => {
  switch (props.color) {
    case 'green':
      return 'green'
    case 'red':
      return 'red'
    default:
      return 'blue'
  }
})
</script> 