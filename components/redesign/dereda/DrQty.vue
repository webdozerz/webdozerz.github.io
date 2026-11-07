<script lang="ts" setup>
// Счётчик «− N шт +»: в карточке, на странице товара и в корзине. Зелёный — цвет кнопок оригинала, значит «уже в корзине».
import DrIcon from './DrIcon.vue'

const props = withDefaults(defineProps<{ qty: number; big?: boolean }>(), { big: false })
const emit = defineEmits<{ inc: []; dec: []; set: [n: number] }>()
const onInput = (e: Event) => {
  const n = Math.floor(Number((e.target as HTMLInputElement).value.replace(/\D/g, '')) || 0)
  emit('set', n)
}
</script>

<template>
  <div class="dr-qty" :class="{ 'dr-qty--big': props.big }">
    <button type="button" class="dr-qty__btn" :aria-label="props.qty > 1 ? 'Меньше' : 'Убрать из корзины'" @click="emit('dec')">
      <DrIcon name="minus" :size="18" />
    </button>
    <label class="dr-qty__val">
      <input
        :value="props.qty"
        inputmode="numeric"
        aria-label="Количество"
        :style="{ width: `${String(props.qty).length + 0.6}ch` }"
        @change="onInput"
      />
      <span>шт</span>
    </label>
    <button type="button" class="dr-qty__btn" aria-label="Больше" @click="emit('inc')"><DrIcon name="plus" :size="18" /></button>
  </div>
</template>

<style lang="scss">
.dr-qty {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 40px;
  align-items: center;
  height: 42px;
  border-radius: var(--dr-r);
  background: var(--dr-green-soft);
  color: var(--dr-green);
  white-space: nowrap;

  &--big {
    height: 50px;
    grid-template-columns: 50px minmax(0, 1fr) 50px;
  }

  &__btn {
    display: grid;
    place-items: center;
    height: 100%;
    padding: 0;
    border: 0;
    border-radius: var(--dr-r);
    background: none;
    color: inherit;
    cursor: pointer;

    &:hover {
      background: rgba(31, 125, 99, 0.12);
    }
  }

  &__val {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 2px;
    font-weight: 700;

    input {
      min-width: 1.6ch;
      padding: 0;
      border: 0;
      background: none;
      color: inherit;
      font: inherit;
      text-align: center;
      outline: none;
    }

    span {
      padding: 0 4px 0 2px;
      font-weight: 600;
      font-size: 14px;
    }
  }
}
</style>
