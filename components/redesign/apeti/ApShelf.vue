<script lang="ts" setup>
import type { ApProduct } from '~/utils/apetiData'
import ApCard from '~/components/redesign/apeti/ApCard.vue'
import ApIcon from '~/components/redesign/apeti/ApIcon.vue'

// Полка лентой: край следующей карточки виден, стрелки по бокам на десктопе. Стили — в оболочке.
const props = defineProps<{ items: ApProduct[] }>()
const track = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)
const sync = () => {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft < 8
  atEnd.value = el.scrollLeft + el.clientWidth > el.scrollWidth - 8
}
const go = (d: number) => track.value?.scrollBy({ left: d * (track.value?.clientWidth ?? 0) * 0.8, behavior: 'smooth' })
watch(
  () => props.items,
  () => {
    track.value?.scrollTo({ left: 0 })
    nextTick(sync)
  },
)
onMounted(sync)
</script>

<template>
  <div class="ap-shelf">
    <div ref="track" class="ap-shelf__track" @scroll.passive="sync">
      <ApCard v-for="p in props.items" :key="p.id" :p="p" />
    </div>
    <button type="button" class="ap-shelf__arrow ap-shelf__arrow--l" :disabled="atStart" aria-label="Назад" @click="go(-1)"><ApIcon name="left" /></button>
    <button type="button" class="ap-shelf__arrow ap-shelf__arrow--r" :disabled="atEnd" aria-label="Вперёд" @click="go(1)"><ApIcon name="right" /></button>
  </div>
</template>
