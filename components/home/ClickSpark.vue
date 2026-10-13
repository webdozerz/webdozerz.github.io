<script setup lang="ts">
// Пиксельные искры от клика в любом месте страницы.
// По мотивам ClickSpark из Vue Bits (David Haz): вместо линий — квадратные «пиксели» в тон коту.

const COUNT = 8
const DISTANCE = 26
const DURATION = 420
const SIZE = 4

type Spark = { x: number, y: number, angle: number, start: number }

const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let sparks: Spark[] = []
let raf = 0
let accent = '#7d95ff'

function resize() {
  const el = canvas.value!
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  el.width = Math.round(innerWidth * dpr)
  el.height = Math.round(innerHeight * dpr)
  ctx = el.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function frame(now: number) {
  if (!ctx)
    return
  ctx.clearRect(0, 0, innerWidth, innerHeight)
  sparks = sparks.filter(s => now - s.start < DURATION)
  ctx.fillStyle = accent
  for (const s of sparks) {
    const t = (now - s.start) / DURATION
    const eased = 1 - (1 - t) ** 3
    const r = 6 + eased * DISTANCE
    // Координаты округляем до целых, чтобы «пиксели» оставались чёткими.
    const x = Math.round(s.x + Math.cos(s.angle) * r)
    const y = Math.round(s.y + Math.sin(s.angle) * r)
    const size = Math.max(1, Math.round(SIZE * (1 - t)))
    ctx.globalAlpha = 1 - t
    ctx.fillRect(x - size / 2, y - size / 2, size, size)
  }
  ctx.globalAlpha = 1
  raf = sparks.length ? requestAnimationFrame(frame) : 0
}

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0)
    return
  const target = event.target as HTMLElement | null
  if (target?.closest('input, textarea, [contenteditable="true"]'))
    return
  accent = getComputedStyle(document.documentElement).getPropertyValue('--h-accent').trim() || accent
  const start = performance.now()
  for (let i = 0; i < COUNT; i++)
    sparks.push({ x: event.clientX, y: event.clientY, angle: (Math.PI * 2 * i) / COUNT, start })
  if (!raf)
    raf = requestAnimationFrame(frame)
}

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches)
    return
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <canvas ref="canvas" class="click-spark" aria-hidden="true" />
</template>

<style lang="scss" scoped>
.click-spark {
  position: fixed;
  inset: 0;
  z-index: 90;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
</style>
