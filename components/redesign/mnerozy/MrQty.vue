<script lang="ts" setup>
import MrIcon from './MrIcon.vue'

// «В корзину» превращается в счётчик: «− 2 шт +». На фото карточки — круглый «+» (K2).
// Стили — в оболочке: счётчик рисуют и карточка, и страница товара, и корзина.
const props = withDefaults(defineProps<{ k: string; label?: string; kind?: 'photo' | 'big'; note?: string }>(), {
  label: 'В корзину',
  kind: 'big',
  note: '',
})
const shop = useMnerozyShop()
const ui = useMnerozyUi()
const qty = computed(() => shop.qtyOf(props.k))

const add = () => {
  shop.add(props.k)
  ui.say(props.note || 'Добавили в корзину')
}
</script>

<template>
  <div class="mr-qty" :class="[`mr-qty--${props.kind}`, { 'is-on': qty > 0 }]">
    <button v-if="!qty" type="button" class="mr-qty__add" :aria-label="props.label" @click.stop.prevent="add">
      <MrIcon :name="props.kind === 'photo' ? 'plus' : 'bag'" :size="props.kind === 'photo' ? 22 : 19" />
      <span v-if="props.kind !== 'photo'">{{ props.label }}</span>
    </button>
    <template v-else>
      <button type="button" class="mr-qty__btn" aria-label="Меньше" @click.stop.prevent="shop.setQty(props.k, qty - 1)">
        <MrIcon name="minus" :size="18" />
      </button>
      <span class="mr-qty__val" aria-live="polite"><b>{{ qty }}</b> шт</span>
      <button type="button" class="mr-qty__btn" aria-label="Больше" @click.stop.prevent="shop.setQty(props.k, qty + 1)">
        <MrIcon name="plus" :size="18" />
      </button>
    </template>
  </div>
</template>
