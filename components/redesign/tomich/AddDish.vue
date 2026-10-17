<script lang="ts" setup>
const props = defineProps<{ id: string; name: string }>()
const cart = useTomichCart()
const qty = computed(() => cart.qtyOf(props.id))
</script>

<template>
  <div class="tm-add">
    <button
      v-if="!qty"
      type="button"
      class="tm-btn tm-btn--sm tm-add__btn"
      :aria-label="`Добавить «${name}» в корзину`"
      @click="cart.add(id)"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      <span class="tm-add__label">В корзину</span>
    </button>
    <div v-else class="tm-qty" role="group" :aria-label="`Количество «${name}»`">
      <button type="button" aria-label="Убрать одну порцию" @click="cart.remove(id)">−</button>
      <span data-val>{{ qty }}</span>
      <button type="button" aria-label="Добавить ещё порцию" @click="cart.add(id)">+</button>
    </div>
  </div>
</template>

<style lang="scss">
.tm-add {
  display: flex;
  justify-content: flex-end;
  min-width: 108px;

  .tm-qty {
    width: 108px;
  }
  &__btn {
    width: 108px;
    padding: 0 10px;
    gap: 4px;
  }
}
</style>
