<template>
  <div :class="classNames">
    <label class="label">{{ label }}</label>
    <select
      class="select"
      :value="modelValue"
      @change="handleChange"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :selected="option.value === modelValue"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  value: string
  text: string
}

const props = defineProps<{
  label?: string
  options: Option[]
  modelValue: string
  class?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const classNames = computed(() => props.class || '')

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script> 