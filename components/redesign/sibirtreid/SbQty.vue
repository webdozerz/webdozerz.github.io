<script lang="ts" setup>
// Счётчик упаковок: не меньше минимального заказа, шаг — одна упаковка, подпись «уп.» внутри.
import SbIcon from './SbIcon.vue'

const props = defineProps<{ modelValue: number; min?: number; name?: string; small?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const min = computed(() => props.min ?? 10)
const set = (value: number) => emit('update:modelValue', Math.min(9999, Math.max(min.value, Math.round(value) || min.value)))
const onInput = (e: Event) => {
  const value = Number((e.target as HTMLInputElement).value.replace(/\D/g, ''))
  if (value) set(value)
}
</script>

<template>
  <div class="sb-qty" :class="{ 'sb-qty--small': small }">
    <button type="button" :disabled="modelValue <= min" :aria-label="`Меньше упаковок: ${name ?? ''}`" @click="set(modelValue - 1)">
      <SbIcon name="minus" :size="18" />
    </button>
    <label class="sb-qty__value">
      <span class="sb-sr">Упаковок: {{ name }}</span>
      <input :value="modelValue" inputmode="numeric" @change="onInput" />
      <span aria-hidden="true">уп.</span>
    </label>
    <button type="button" :aria-label="`Больше упаковок: ${name ?? ''}`" @click="set(modelValue + 1)">
      <SbIcon name="plus" :size="18" />
    </button>
  </div>
</template>

<style lang="scss">
.sb .sb-qty {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  height: 48px;
  border-radius: 999px;
  background: var(--sb-mint);
  min-width: 0;

  button {
    display: grid;
    place-items: center;
    width: 44px;
    height: 48px;
    border-radius: 999px;
    color: var(--sb-green);
    transition: background-color 0.15s;

    &:hover:not(:disabled) {
      background: var(--sb-mint-2);
    }

    &:disabled {
      color: #a9bab2;
      cursor: not-allowed;
    }
  }

  &__value {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 3px;
    min-width: 0;
    font-weight: 700;
    font-variant-numeric: tabular-nums;

    input {
      width: 4.2ch;
      min-width: 0;
      border: 0;
      background: none;
      text-align: right;
      font-weight: 700;
      padding: 0;
      outline: none;
    }

    span[aria-hidden] {
      font-size: 13px;
      font-weight: 600;
      color: var(--sb-muted);
    }
  }

  &--small {
    height: 40px;
    grid-template-columns: 38px minmax(0, 1fr) 38px;

    button {
      width: 38px;
      height: 40px;
    }
  }
}
</style>
