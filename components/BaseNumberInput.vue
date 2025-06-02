<template>
  <div class="form-group" :class="$attrs.class">
    <label :for="id" class="label">{{ label }}</label>
    <div class="number-input-wrapper">
      <input
        :id="id"
        type="number"
        :min="min"
        :value="modelValue"
        class="input"
        @input="handleInput"
      >
      <div class="number-controls">
        <button
          type="button"
          class="number-btn increment"
          @click="increment"
        />
        <button
          type="button"
          class="number-btn decrement"
          @click="decrement"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  id: string
  label: string
  modelValue: number
  min?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value) || 0
  emit('update:modelValue', Math.max(value, props.min || 0))
}

function increment() {
  emit('update:modelValue', props.modelValue + 1)
}

function decrement() {
  const newValue = Math.max((props.modelValue || 0) - 1, props.min || 0)
  emit('update:modelValue', newValue)
}
</script> 