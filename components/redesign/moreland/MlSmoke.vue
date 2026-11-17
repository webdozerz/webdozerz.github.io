<script lang="ts" setup>
// Зацепка первого экрана «В дым»: их же две сельди с главной (salt.jpg ↔ smoke.jpg) одной сценой, шторка тянется
// пальцем/мышью/стрелками — слева сырьё, справа холодное копчение. На CMS: 2 картинки баннера + ~40 строк JS.
import { ML_IMG } from '~/utils/moreland'
import MlIcon from '~/components/redesign/moreland/MlIcon.vue'

const x = ref(62)
const stage = ref<HTMLElement | null>(null)
const touched = ref(false)
let drag = false

const setFrom = (clientX: number) => {
  const r = stage.value!.getBoundingClientRect()
  x.value = Math.min(97, Math.max(3, ((clientX - r.left) / r.width) * 100))
}
const down = (e: PointerEvent) => {
  drag = true
  touched.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  setFrom(e.clientX)
}
const move = (e: PointerEvent) => drag && setFrom(e.clientX)
const upp = () => (drag = false)
const key = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault()
    touched.value = true
    x.value = Math.min(97, Math.max(3, x.value + (e.key === 'ArrowLeft' ? -5 : 5)))
  }
}

// один раз показываем, что шторка двигается: 62 → 38 → 50. Анимируем само значение x (rAF), а не CSS-переходом:
// клип картинки и линия берут одно число и не расходятся ни в фоновой вкладке, ни на скриншоте.
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const tween = (from: number, to: number, ms: number) =>
    new Promise<void>((done) => {
      const t0 = performance.now()
      const step = (t: number) => {
        if (touched.value) return done()
        const k = Math.min(1, (t - t0) / ms)
        const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2
        x.value = from + (to - from) * e
        if (k < 1) requestAnimationFrame(step)
        else done()
      }
      requestAnimationFrame(step)
    })
  setTimeout(async () => {
    await tween(62, 38, 800)
    await new Promise((r) => setTimeout(r, 150))
    if (!touched.value) await tween(38, 50, 700)
  }, 700)
})
</script>

<template>
  <div class="ml-smoke">
    <div
      ref="stage"
      class="ml-smoke__stage"
      :class="{ 'is-touched': touched }"
      :style="{ '--x': `${x}%` }"
      @pointerdown="down"
      @pointermove="move"
      @pointerup="upp"
      @pointercancel="upp"
    >
      <img class="ml-smoke__img" :src="`${ML_IMG}salt.jpg`" alt="Сельдь до копчения" width="940" height="278" draggable="false" />
      <img class="ml-smoke__img ml-smoke__img--top" :src="`${ML_IMG}smoke.jpg`" alt="Сельдь холодного копчения" width="940" height="278" draggable="false" />
      <span class="ml-smoke__label ml-smoke__label--l">Сырьё</span>
      <span class="ml-smoke__label ml-smoke__label--r">Холодное копчение</span>
      <div class="ml-smoke__line" aria-hidden="true" />
      <button
        type="button"
        class="ml-smoke__handle"
        role="slider"
        aria-label="Шторка: сырьё или копчёная"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.round(x)"
        @keydown="key"
      >
        <MlIcon name="drag" />
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.ml-smoke {
  &__stage {
    position: relative;
    aspect-ratio: 940 / 278;
    max-height: 330px;
    margin: 0 auto;
    touch-action: pan-y;
    user-select: none;
    cursor: ew-resize;
    overflow: hidden;
    border-radius: var(--ml-R);
    background: #fff;
  }
  &__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
    &--top {
      clip-path: inset(0 0 0 var(--x));
    }
  }
  &__line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--x);
    width: 2px;
    margin-left: -1px;
    background: var(--ml-acc);
    opacity: 0.55;
  }
  &__handle {
    position: absolute;
    top: 50%;
    left: var(--x);
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    margin: -26px 0 0 -26px;
    border: 3px solid #fff;
    border-radius: 50%;
    background: var(--ml-acc);
    color: #fff;
    box-shadow: 0 6px 20px rgba(13, 39, 66, 0.28);
    cursor: ew-resize;
    &:focus-visible {
      outline: 3px solid rgba(11, 98, 192, 0.35);
      outline-offset: 3px;
    }
  }
  &__label {
    position: absolute;
    bottom: 10px;
    padding: 5px 11px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 800;
    pointer-events: none;
    &--l {
      left: 12px;
      background: var(--ml-surf);
      color: var(--ml-ink);
    }
    &--r {
      right: 12px;
      background: var(--ml-amb-soft);
      color: var(--ml-amb);
    }
  }
  @media (max-width: 768px) {
    &__stage {
      aspect-ratio: 2.9;
    }
    &__img {
      object-fit: cover;
    }
    &__label {
      top: 8px;
      bottom: auto;
      padding: 3px 8px;
      font-size: 11.5px;
    }
    &__handle {
      width: 44px;
      height: 44px;
      margin: -22px 0 0 -22px;
    }
  }
}
</style>
