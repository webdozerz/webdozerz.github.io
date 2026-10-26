<script lang="ts" setup>
import NsIcon from './NsIcon.vue'

// Счётчик готового торта или коробки пирожных; стили — в оболочке (.ns-qty), их же рисует заявка.
const props = defineProps<{ id: string; unit?: string }>()
const order = useNaslagdeniaOrder()
const n = computed(() => order.qty(props.id))
</script>

<template>
  <div class="ns-qty">
    <button type="button" class="ns-qty__btn" aria-label="Меньше" @click="order.setQty(props.id, n - 1)">
      <NsIcon name="minus" :size="18" />
    </button>
    <span class="ns-qty__n">{{ n }}&nbsp;{{ props.unit ?? 'шт' }}</span>
    <button type="button" class="ns-qty__btn" aria-label="Больше" @click="order.setQty(props.id, n + 1)">
      <NsIcon name="plus" :size="18" />
    </button>
  </div>
</template>
