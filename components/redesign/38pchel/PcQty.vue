<script lang="ts" setup>
import PcIcon from './PcIcon.vue'

// «В корзину» превращается в счётчик выбранной фасовки: «− 2 шт +».
const props = withDefaults(
  defineProps<{ pid: string; picks: Record<string, string>; label?: string; wide?: boolean; big?: boolean }>(),
  { label: 'В корзину', wide: false, big: false },
)
const shop = usePchelShop()
const ui = usePchelUi()
const key = computed(() => shop.keyOf(props.pid, props.picks))
const qty = computed(() => shop.qtyOf(key.value))

const add = () => {
  shop.add(props.pid, props.picks)
  if (!qty.value || qty.value === 1) ui.say('Добавили в корзину')
}
</script>

<template>
  <div class="pc-qty" :class="{ 'pc-qty--wide': props.wide, 'pc-qty--big': props.big, 'is-on': qty > 0 }">
    <button v-if="!qty" type="button" class="pc-qty__add" @click.stop.prevent="add">
      <PcIcon name="bag" :size="19" />
      <span>{{ props.label }}</span>
    </button>
    <template v-else>
      <button type="button" class="pc-qty__btn" aria-label="Меньше" @click.stop.prevent="shop.setQty(key, qty - 1)">
        <PcIcon name="minus" :size="18" />
      </button>
      <span class="pc-qty__val" aria-live="polite"><b>{{ qty }}</b> шт</span>
      <button type="button" class="pc-qty__btn" aria-label="Больше" @click.stop.prevent="shop.setQty(key, qty + 1)">
        <PcIcon name="plus" :size="18" />
      </button>
    </template>
  </div>
</template>
