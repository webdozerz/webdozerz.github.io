<script setup lang="ts">
// Пара скриншотов «до / после» одного экрана: компьютер (1440) и телефон (375).
// Картинки лежат в public/cases/<slug>/: before-<shot>-d.webp, after-<shot>-m.webp и т. д.
// Десктопный кадр открывается целой страницей (…-d-full.webp).
const props = defineProps<{
  slug: string
  shot: string
  title: string
  before?: string
  after?: string
}>()

const device = ref<'d' | 'm'>('d')
const zoom = ref<{ src: string, alt: string } | null>(null)

const src = (side: 'before' | 'after', suffix = '') => `/cases/${props.slug}/${side}-${props.shot}-${device.value}${suffix}.webp`

const sides = computed(() => [
  { key: 'before' as const, label: 'До', note: props.before },
  { key: 'after' as const, label: 'После', note: props.after },
])

function open(side: 'before' | 'after', label: string) {
  zoom.value = {
    src: device.value === 'd' ? src(side, '-full') : src(side),
    alt: `${props.title}, ${label.toLowerCase()} редизайна`,
  }
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape')
    zoom.value = null
}

watch(zoom, (value) => {
  if (!import.meta.client)
    return
  document.documentElement.style.overflow = value ? 'hidden' : ''
  if (value)
    window.addEventListener('keydown', onKey)
  else
    window.removeEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  if (!import.meta.client)
    return
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <figure class="ba" :class="`ba--${device}`">
    <figcaption class="ba__bar">
      <span class="ba__title">{{ title }}</span>
      <div class="ba__switch" role="group" aria-label="Устройство">
        <button type="button" :aria-pressed="device === 'd'" @click="device = 'd'">
          Компьютер
        </button>
        <button type="button" :aria-pressed="device === 'm'" @click="device = 'm'">
          Телефон
        </button>
      </div>
    </figcaption>

    <div class="ba__pair">
      <div v-for="side in sides" :key="side.key" class="ba__side">
        <span class="ba__label mono" :class="{ 'ba__label--after': side.key === 'after' }">{{ side.label }}</span>
        <button type="button" class="ba__frame" :aria-label="`Открыть крупно: ${side.label.toLowerCase()}`" @click="open(side.key, side.label)">
          <img
            :src="src(side.key)"
            :alt="`${title}, ${side.label.toLowerCase()} редизайна, ${device === 'd' ? 'компьютер' : 'телефон'}`"
            :width="device === 'd' ? 1440 : 750"
            :height="device === 'd' ? 900 : 1624"
            loading="lazy"
            decoding="async"
          >
          <span class="ba__zoom mono">{{ device === 'd' ? 'вся страница' : 'крупнее' }} ↗</span>
        </button>
        <p v-if="side.note" class="ba__note">
          {{ side.note }}
        </p>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="zoom" class="ba-zoom" role="dialog" aria-modal="true" :aria-label="zoom.alt" @click.self="zoom = null">
        <button type="button" class="ba-zoom__close" aria-label="Закрыть" @click="zoom = null">
          ✕
        </button>
        <div class="ba-zoom__scroll" @click.self="zoom = null">
          <img :src="zoom.src" :alt="zoom.alt">
        </div>
      </div>
    </Teleport>
  </figure>
</template>

<style lang="scss" scoped>
.ba {
  margin: 32px 0 0;

  &__bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  &__title {
    color: var(--h-text);
    font-size: 15px;
    font-weight: 600;
  }

  &__switch {
    display: inline-flex;
    padding: 3px;
    border: 1px solid var(--h-line);
    border-radius: 9px;
    background: var(--h-surface);

    button {
      height: 30px;
      padding: 0 12px;
      border: 0;
      border-radius: 6px;
      background: none;
      color: var(--h-muted);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;

      &:hover {
        color: var(--h-text);
      }

      &[aria-pressed='true'] {
        background: var(--h-raised);
        color: var(--h-text);
        box-shadow: 0 1px 0 var(--h-line);
      }
    }
  }

  &__pair {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  &--m &__pair {
    max-width: 560px;
    margin: 0 auto;
  }

  &__side {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__label {
    align-self: flex-start;
    margin-bottom: 8px;
    padding: 2px 8px;
    border: 1px solid var(--h-line);
    border-radius: 6px;
    color: var(--h-muted);
    font-size: 12px;

    &--after {
      border-color: color-mix(in srgb, var(--h-accent) 45%, var(--h-line));
      color: var(--h-accent);
    }
  }

  &__frame {
    position: relative;
    display: block;
    width: 100%;
    padding: 0;
    border: 1px solid var(--h-line);
    border-radius: 10px;
    background: var(--h-raised);
    overflow: hidden;
    cursor: zoom-in;
    transition: border-color 0.2s, box-shadow 0.25s;

    img {
      display: block;
      width: 100%;
      height: auto;
    }

    &:hover {
      border-color: var(--h-line-strong);
      box-shadow: var(--h-shadow);
    }
  }

  &--m &__frame {
    border-radius: 18px;
  }

  &__zoom {
    position: absolute;
    right: 8px;
    bottom: 8px;
    padding: 3px 8px;
    border-radius: 6px;
    background: rgba(14, 15, 18, 0.78);
    color: #eceef1;
    font-size: 11px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &__frame:hover &__zoom,
  &__frame:focus-visible &__zoom {
    opacity: 1;
  }

  &__note {
    margin: 10px 0 0;
    color: var(--h-muted);
    font-size: 14px;
    line-height: 1.5;
  }
}

.ba-zoom {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(6, 7, 9, 0.88);

  &__scroll {
    height: 100%;
    padding: 56px 16px 32px;
    overflow-y: auto;
    overscroll-behavior: contain;

    img {
      display: block;
      width: 100%;
      max-width: 1200px;
      height: auto;
      margin: 0 auto;
      border-radius: 8px;
    }
  }

  &__close {
    position: fixed;
    top: 12px;
    right: 16px;
    z-index: 1;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    background: rgba(22, 24, 28, 0.9);
    color: #eceef1;
    font-size: 16px;
    cursor: pointer;
  }
}

@media (max-width: 760px) {
  .ba--d .ba__pair {
    grid-template-columns: 1fr;
  }

  .ba__zoom {
    opacity: 1;
  }
}

@media (max-width: 420px) {
  .ba__pair {
    gap: 10px;
  }

  .ba__note {
    font-size: 13px;
  }
}
</style>
