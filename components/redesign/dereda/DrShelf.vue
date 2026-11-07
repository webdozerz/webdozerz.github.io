<script lang="ts" setup>
// Полка «Новинки» / «Товары по акции»: лента с краем следующей карточки и стрелками по бокам на десктопе
import DrCard from './DrCard.vue'
import DrIcon from './DrIcon.vue'

const props = defineProps<{ items: DrProduct[] }>()
const track = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)
const sync = () => {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft < 8
  atEnd.value = el.scrollLeft + el.clientWidth > el.scrollWidth - 8
}
const go = (dir: number) => track.value?.scrollBy({ left: dir * track.value.clientWidth * 0.8, behavior: 'smooth' })
onMounted(sync)
</script>

<template>
  <div class="dr-shelf">
    <button type="button" class="dr-shelf__arrow dr-shelf__arrow--l" :disabled="atStart" aria-label="Назад" @click="go(-1)">
      <DrIcon name="left" :size="22" />
    </button>
    <div ref="track" class="dr-shelf__track" @scroll.passive="sync">
      <DrCard v-for="p in props.items" :key="p.id" :p="p" />
    </div>
    <button type="button" class="dr-shelf__arrow dr-shelf__arrow--r" :disabled="atEnd" aria-label="Дальше" @click="go(1)">
      <DrIcon name="right" :size="22" />
    </button>
  </div>
</template>

<style lang="scss">
.dr-shelf {
  position: relative;

  &__track {
    --gap: 20px;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: calc((100% - 4 * var(--gap)) / 4.4);
    gap: var(--gap);
    overflow-x: auto;
    padding-bottom: 14px;
    scroll-snap-type: x mandatory;
    scrollbar-color: var(--dr-line) transparent;
    scrollbar-width: thin;

    > * {
      scroll-snap-align: start;
    }

    @media (max-width: 1199px) {
      grid-auto-columns: calc((100% - 3 * var(--gap)) / 3.4);
    }

    @media (max-width: 768px) {
      --gap: 14px;
      grid-auto-columns: calc((100% - var(--gap)) / 2.25);
    }

    @media (max-width: 375px) {
      grid-auto-columns: 62%;
    }
  }

  &__arrow {
    position: absolute;
    top: calc((100% - 14px) * 0.3);
    z-index: 2;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 1px solid var(--dr-line);
    border-radius: 50%;
    background: #fff;
    color: var(--dr-dark);
    box-shadow: 0 6px 18px rgba(60, 30, 20, 0.12);
    cursor: pointer;

    &--l {
      left: -18px;
    }

    &--r {
      right: -18px;
    }

    &:disabled {
      opacity: 0;
      pointer-events: none;
    }

    &:hover {
      color: var(--dr-accent);
    }

    @media (max-width: 989px) {
      display: none;
    }
  }
}
</style>
