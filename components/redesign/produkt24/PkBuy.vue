<script lang="ts" setup>
import PkIcon from './PkIcon.vue'

// «В список» → счётчик с единицей. Количество можно вписать руками: опт берут десятками килограммов.
const props = defineProps<{ id: string; unit: PkUnit; wide?: boolean }>()
const list = useProdukt24List()
const ui = useProdukt24Ui()
const qty = computed(() => list.qtyOf(props.id))

const first = () => {
  list.add(props.id)
  if (list.count.value === 1) ui.say('Позиция в списке. Из списка соберём готовую заявку для менеджера.')
}
const onInput = (e: Event) => list.setQty(props.id, Number((e.target as HTMLInputElement).value))
</script>

<template>
  <div class="pk-buy" :class="{ 'pk-buy--wide': props.wide }">
    <button v-if="!qty" type="button" class="pk-btn pk-btn--add" @click="first">
      <PkIcon name="plus" :size="18" /> В список
    </button>
    <div v-else class="pk-qty">
      <button type="button" aria-label="Меньше" @click="list.remove(props.id)">
        <PkIcon :name="qty === 1 ? 'trash' : 'minus'" :size="18" />
      </button>
      <label>
        <input :value="qty" inputmode="numeric" aria-label="Количество" @change="onInput" />
        <span>{{ pkUnitLabel(props.unit) }}</span>
      </label>
      <button type="button" aria-label="Больше" @click="list.add(props.id)"><PkIcon name="plus" :size="18" /></button>
    </div>
  </div>
</template>
