<script lang="ts" setup>
// Счётчик количества: кг с шагом 0,5, куски, упаковки. Подпись единицы внутри.
const props = defineProps<{ product: SnProduct; modelValue: number; small?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const step = computed(() => snStep(props.product))
const min = computed(() => snMin(props.product))

const change = (dir: 1 | -1) => {
  const next = Math.round((props.modelValue + dir * step.value) * 10) / 10
  emit('update:modelValue', Math.max(min.value, next))
}
</script>

<template>
  <div class="sn-qty" :class="{ 'sn-qty--small': small }">
    <button
      type="button"
      :disabled="modelValue <= min"
      :aria-label="`Меньше: ${product.name}`"
      @click="change(-1)"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 12h12" /></svg>
    </button>
    <output aria-live="polite">{{ snQtyLabel(product, modelValue) }}</output>
    <button type="button" :aria-label="`Больше: ${product.name}`" @click="change(1)">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 6v12M6 12h12" /></svg>
    </button>
  </div>
</template>

<style lang="scss">
.sn .sn-qty {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 40px;
  align-items: center;
  min-height: 48px;
  border-radius: var(--sn-r);
  background: var(--sn-paper);

  button {
    display: grid;
    place-items: center;
    height: 100%;
    min-height: 40px;
    border-radius: var(--sn-r);
    color: var(--sn-ink);
    transition: color 0.15s;

    &:hover {
      color: var(--sn-red);
    }

    &:disabled {
      color: #c9bdb3;
      cursor: default;
    }
  }

  output {
    min-width: 0;
    text-align: center;
    font-weight: 800;
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
