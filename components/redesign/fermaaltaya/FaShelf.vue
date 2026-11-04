<script lang="ts" setup>
// Полка товаров лентой: стрелки по бокам листают на ширину видимой части, у края стрелка прячется
import FaIcon from './FaIcon.vue'

const track = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)
const update = () => {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft <= 4
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
}
const go = (dir: 1 | -1) => {
  const el = track.value
  if (!el) return
  el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
}
let ro: ResizeObserver | undefined
onMounted(() => {
  update()
  ro = new ResizeObserver(update)
  if (track.value) ro.observe(track.value)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <div class="fa-shelfbox">
    <div ref="track" class="fa-shelf" @scroll.passive="update">
      <slot />
    </div>
    <button v-show="!atStart" type="button" class="fa-shelfbox__btn fa-shelfbox__btn--prev" aria-label="Назад" @click="go(-1)">
      <FaIcon name="left" />
    </button>
    <button v-show="!atEnd" type="button" class="fa-shelfbox__btn fa-shelfbox__btn--next" aria-label="Вперёд" @click="go(1)">
      <FaIcon name="right" />
    </button>
  </div>
</template>
