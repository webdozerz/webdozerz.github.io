<script lang="ts" setup>
// Полка товаров лентой: край следующей карточки виден, стрелки по бокам на десктопе
import type { OlProduct } from '~/utils/olimpfishData'
import OlCard from './OlCard.vue'
import OlIcon from './OlIcon.vue'

defineProps<{ items: OlProduct[] }>()
const row = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)
const check = () => {
  const el = row.value
  if (!el) return
  atStart.value = el.scrollLeft < 8
  atEnd.value = el.scrollLeft + el.clientWidth > el.scrollWidth - 8
}
const go = (dir: number) => {
  const el = row.value
  if (!el) return
  el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
}
onMounted(check)
</script>

<template>
  <div class="ol-shelf">
    <button v-show="!atStart" type="button" class="ol-shelf__arr ol-shelf__arr--l" aria-label="Назад" @click="go(-1)"><OlIcon name="left" /></button>
    <div ref="row" class="ol-shelf__row" @scroll.passive="check">
      <OlCard v-for="p in items" :key="p.id" :p="p" />
    </div>
    <button v-show="!atEnd" type="button" class="ol-shelf__arr ol-shelf__arr--r" aria-label="Вперёд" @click="go(1)"><OlIcon name="right" /></button>
  </div>
</template>

<style lang="scss">
.ol .ol-shelf {
  position: relative;
  &__row {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: calc((100% - 4 * 18px) / 4.3);
    gap: 18px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 12px;
    scrollbar-width: thin;
    scrollbar-color: #c9d2df transparent;
    > * {
      scroll-snap-align: start;
    }
  }
  &__arr,
  &__arr:focus {
    position: absolute;
    top: 38%;
    z-index: 2;
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    border: 1px solid var(--ol-line);
    border-radius: 50%;
    background: #fff;
    color: var(--ol-ink);
    box-shadow: 0 6px 18px rgb(14 28 61 / 0.14);
    &:hover {
      color: var(--ol-acc);
    }
    &--l {
      left: -18px;
    }
    &--r {
      right: -18px;
    }
  }
}
@media (max-width: 1199px) {
  .ol .ol-shelf__row {
    grid-auto-columns: calc((100% - 2 * 18px) / 3.3);
  }
}
@media (max-width: 768px) {
  .ol .ol-shelf {
    &__row {
      grid-auto-columns: calc((100% - 12px) / 2.2);
      gap: 12px;
    }
    &__arr {
      display: none !important;
    }
  }
}
</style>
