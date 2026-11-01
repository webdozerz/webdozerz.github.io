<script lang="ts" setup>
import AkIcon from './AkIcon.vue'

// «В список» → счётчик упаковок. Заказ у оптовика идёт упаковками: «1 уп. · 50 шт».
const props = withDefaults(defineProps<{ item: AkItem; small?: boolean }>(), { small: false })
const list = useAks124List()
const ui = useAks124Ui()
const qty = computed(() => list.qtyOf(props.item.id))

const first = () => {
  list.add(props.item)
  ui.say(`${props.item.name} — в списке`)
}
const onInput = (e: Event) => list.setQty(props.item.id, Number((e.target as HTMLInputElement).value))
</script>

<template>
  <div class="ak-buy" :class="{ 'is-small': props.small }">
    <button v-if="!qty" type="button" class="ak-buy__add" :aria-label="`В список: ${props.item.name}`" @click="first">
      <AkIcon name="plus" :size="18" />
      <span>{{ props.item.pack ? 'Упаковку' : 'В список' }}</span>
    </button>
    <div v-else class="ak-qty">
      <button type="button" aria-label="Меньше на упаковку" @click="list.sub(props.item)"><AkIcon name="minus" :size="18" /></button>
      <label>
        <input
          :value="qty"
          type="number"
          inputmode="numeric"
          min="0"
          :style="{ width: `${String(qty).length + 0.6}ch` }"
          aria-label="Упаковок"
          @change="onInput"
        />
        <span>{{ props.item.pack ? 'уп.' : props.item.per }}</span>
      </label>
      <button type="button" aria-label="Больше на упаковку" @click="list.add(props.item)"><AkIcon name="plus" :size="18" /></button>
    </div>
  </div>
</template>
