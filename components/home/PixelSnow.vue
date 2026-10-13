<script setup lang="ts">
// Пиксельный снег поверх страницы: квадратные снежинки медленно падают и покачиваются.
// По мотивам PixelSnow из Vue Bits (David Haz), переписано на Canvas 2D без three.js.

const FLAKES = 70

type Flake = { x: number, y: number, size: number, speed: number, drift: number, phase: number, alpha: number }

const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let flakes: Flake[] = []
let raf = 0
let last = 0
let color = '#c4c8cf'

function spawn(atTop = false): Flake {
  return {
    x: Math.random() * innerWidth,
    y: atTop ? -10 - Math.random() * 40 : Math.random() * innerHeight,
    size: [2, 3, 3, 4][Math.floor(Math.random() * 4)]!,
    speed: 18 + Math.random() * 30,
    drift: 6 + Math.random() * 14,
    phase: Math.random() * Math.PI * 2,
    alpha: 0.25 + Math.random() * 0.45,
  }
}

function resize() {
  const el = canvas.value!
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  el.width = Math.round(innerWidth * dpr)
  el.height = Math.round(innerHeight * dpr)
  ctx = el.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function frame(now: number) {
  const dt = Math.min((now - last) / 1000, 0.1)
  last = now
  if (ctx) {
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    ctx.fillStyle = color
    for (const f of flakes) {
      f.y += f.speed * dt
      f.phase += dt * 0.9
      if (f.y > innerHeight + 10)
        Object.assign(f, spawn(true))
      ctx.globalAlpha = f.alpha
      ctx.fillRect(Math.round(f.x + Math.sin(f.phase) * f.drift), Math.round(f.y), f.size, f.size)
    }
    ctx.globalAlpha = 1
  }
  raf = requestAnimationFrame(frame)
}

function readColor() {
  color = getComputedStyle(document.documentElement).getPropertyValue('--h-text-soft').trim() || color
}

let themeObserver: MutationObserver | undefined

onMounted(() => {
  resize()
  readColor()
  flakes = Array.from({ length: FLAKES }, () => spawn())
  window.addEventListener('resize', resize)
  themeObserver = new MutationObserver(readColor)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  last = performance.now()
  raf = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  themeObserver?.disconnect()
})
</script>

<template>
  <canvas ref="canvas" class="pixel-snow" aria-hidden="true" />
</template>

<style lang="scss" scoped>
.pixel-snow {
  position: fixed;
  inset: 0;
  z-index: 25;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
</style>
