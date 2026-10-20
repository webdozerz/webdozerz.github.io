<script lang="ts" setup>
// Полка товаров с горизонтальной прокруткой: заголовок, стрелки, ссылка на раздел.
defineProps<{ title: string; to: string }>()

const track = ref<HTMLElement>()
const atStart = ref(true)
const atEnd = ref(false)

const update = () => {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft < 4
  atEnd.value = el.scrollLeft + el.clientWidth > el.scrollWidth - 4
}

const move = (dir: 1 | -1) => {
  const el = track.value
  if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
}

onMounted(update)
</script>

<template>
  <section class="fg-wrap fg-section fg-shelf">
    <div class="fg-head">
      <h2>{{ title }}</h2>
      <div class="fg-shelf__end">
        <NuxtLink :to="to" class="fg-link">Весь раздел</NuxtLink>
        <button type="button" class="fg-shelf__arrow" :disabled="atStart" aria-label="Назад" @click="move(-1)">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" class="fg-shelf__arrow" :disabled="atEnd" aria-label="Вперёд" @click="move(1)">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
    <div ref="track" class="fg-shelf__track" @scroll.passive="update">
      <slot />
    </div>
  </section>
</template>

<style lang="scss">
.fg .fg-shelf {
  &__end {
    display: flex;
    align-items: center;
    gap: 8px;

    .fg-link {
      margin-right: 8px;
    }
  }

  &__arrow {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--fg-sage);
    transition: background-color 0.15s;

    &:hover:not(:disabled) {
      background: var(--fg-leaf-soft);
    }

    &:disabled {
      color: #b4c0b6;
      cursor: default;
    }
  }

  &__track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: calc((100% - 4 * 16px) / 5);
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    > * {
      scroll-snap-align: start;
    }
  }
}

@media (max-width: 1100px) {
  .fg .fg-shelf__track {
    grid-auto-columns: calc((100% - 3 * 16px) / 4);
  }
}

@media (max-width: 760px) {
  .fg .fg-shelf__arrow {
    display: none;
  }

  .fg .fg-shelf__end .fg-link {
    margin-right: 0;
  }

  .fg .fg-shelf__track {
    grid-auto-columns: 44%;
    gap: 10px;
    margin-inline: -16px;
    padding-inline: 16px;
    scroll-padding-inline: 16px;
  }
}
</style>
