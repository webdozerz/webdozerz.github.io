<script lang="ts" setup>
// Счётчик количества: кг с шагом 0,5, штуки рыбы или упаковки. Подпись единицы внутри.
const props = defineProps<{
  modelValue: number
  label: string
  step?: number
  min?: number
  small?: boolean
  name?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const step = computed(() => props.step ?? 1)
const min = computed(() => props.min ?? 1)

const change = (dir: 1 | -1) => {
  const next = Math.round((props.modelValue + dir * step.value) * 10) / 10
  emit('update:modelValue', Math.max(min.value, next))
}
</script>

<template>
  <div class="rs-qty" :class="{ 'rs-qty--small': small }">
    <button type="button" :disabled="modelValue <= min" :aria-label="`Меньше: ${name ?? ''}`" @click="change(-1)">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 12h12" /></svg>
    </button>
    <output aria-live="polite">{{ label }}</output>
    <button type="button" :aria-label="`Больше: ${name ?? ''}`" @click="change(1)">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 6v12M6 12h12" /></svg>
    </button>
  </div>
</template>

<style lang="scss">
.rs .rs-qty {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 40px;
  align-items: center;
  min-height: 48px;
  min-width: 0;
  border-radius: var(--rs-r);
  background: var(--rs-ice);

  button {
    display: grid;
    place-items: center;
    height: 100%;
    min-height: 40px;
    border-radius: var(--rs-r);
    color: var(--rs-ink);
    transition: color 0.15s;

    &:hover {
      color: var(--rs-blue);
    }

    &:disabled {
      color: #b7c4d6;
      cursor: default;
    }
  }

  output {
    min-width: 0;
    text-align: center;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  &--small {
    min-height: 42px;
    grid-template-columns: 34px minmax(0, 1fr) 34px;
    font-size: 14px;
  }
}
</style>
