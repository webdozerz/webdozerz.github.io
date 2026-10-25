<script lang="ts" setup>
import BkIcon from './BkIcon.vue'

// «В корзину» превращается в счётчик выбранного варианта: «− 2 шт +». Стили — в оболочке.
const props = withDefaults(defineProps<{ pid: string; pick?: string; label?: string; big?: boolean }>(), {
  pick: '',
  label: 'В корзину',
  big: false,
})
const shop = useBuketyShop()
const ui = useBuketyUi()
const key = computed(() => shop.keyOf(props.pid, props.pick))
const qty = computed(() => shop.qtyOf(key.value))

const add = () => {
  shop.add(props.pid, props.pick)
  ui.say('Добавили в корзину')
}
</script>

<template>
  <div class="bk-qty" :class="{ 'bk-qty--big': props.big, 'is-on': qty > 0 }">
    <button v-if="!qty" type="button" class="bk-qty__add" @click.stop.prevent="add">
      <BkIcon name="bag" :size="19" />
      <span>{{ props.label }}</span>
    </button>
    <template v-else>
      <button type="button" class="bk-qty__btn" aria-label="Меньше" @click.stop.prevent="shop.setQty(key, qty - 1)">
        <BkIcon name="minus" :size="18" />
      </button>
      <span class="bk-qty__val" aria-live="polite"><b>{{ qty }}</b> шт</span>
      <button type="button" class="bk-qty__btn" aria-label="Больше" @click.stop.prevent="shop.setQty(key, qty + 1)">
        <BkIcon name="plus" :size="18" />
      </button>
    </template>
  </div>
</template>
