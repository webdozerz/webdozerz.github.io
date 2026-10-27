<script lang="ts" setup>
import MfIcon from './MfIcon.vue'

// «В заявку» → счётчик с вводом числа. Единица — кг для весовой рыбы, уп. для пресервов и вёдер.
const props = withDefaults(defineProps<{ product: MfProduct; big?: boolean }>(), { big: false })
const req = useMrkfishRequest()
const ui = useMrkfishUi()
const qty = computed(() => req.qtyOf(props.product.id))
const unit = computed(() => mfUnit(props.product))

const first = () => {
  req.add(props.product.id)
  ui.say(`${props.product.name} — в заявке. Цены пришлём прайсом.`)
}
const onInput = (e: Event) => req.setQty(props.product.id, Number((e.target as HTMLInputElement).value))
</script>

<template>
  <div class="mf-buy" :class="{ 'mf-buy--big': props.big }">
    <button v-if="!qty" type="button" class="mf-btn mf-buy__add" @click="first">
      <MfIcon name="plus" :size="20" />
      В заявку
    </button>
    <div v-else class="mf-qty">
      <button type="button" class="mf-qty__btn" :aria-label="`Убрать 1 ${unit}`" @click="req.remove(props.product.id)">
        <MfIcon name="minus" :size="18" />
      </button>
      <label class="mf-qty__val">
        <input type="number" inputmode="numeric" min="0" :value="qty" :aria-label="`Количество, ${unit}`" @change="onInput" />
        <span>{{ unit }}</span>
      </label>
      <button type="button" class="mf-qty__btn" :aria-label="`Добавить 1 ${unit}`" @click="req.add(props.product.id)">
        <MfIcon name="plus" :size="18" />
      </button>
    </div>
  </div>
</template>
