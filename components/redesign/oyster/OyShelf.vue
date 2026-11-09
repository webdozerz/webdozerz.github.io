<script lang="ts" setup>
import type { OyProduct } from '~/utils/oyster'
import OyCard from '~/components/redesign/oyster/OyCard.vue'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'

// Полка лентой: край следующей карточки виден, стрелки по бокам на десктопе
const props = defineProps<{ items: OyProduct[] }>()
const track = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)
const sync = () => {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft < 8
  atEnd.value = el.scrollLeft + el.clientWidth > el.scrollWidth - 8
}
const go = (d: number) => {
  const el = track.value
  if (!el) return
  el.scrollBy({ left: d * el.clientWidth * 0.8, behavior: 'smooth' })
}
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
  <div class="oy-shelf">
    <div ref="track" class="oy-shelf__track" @scroll.passive="sync">
      <OyCard v-for="p in props.items" :key="p.id" :p="p" />
    </div>
    <button type="button" class="oy-shelf__arrow oy-shelf__arrow--l" :disabled="atStart" aria-label="Назад" @click="go(-1)"><OyIcon name="left" /></button>
    <button type="button" class="oy-shelf__arrow oy-shelf__arrow--r" :disabled="atEnd" aria-label="Вперёд" @click="go(1)"><OyIcon name="right" /></button>
  </div>
</template>
