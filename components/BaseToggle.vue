<template>
  <label class="checkbox-wrapper">
    <input
      type="checkbox"
      class="checkbox"
      :checked="modelValue"
      @change="handleChange"
    >
    <span>{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script> 