<script setup lang="ts">
// Приглушённый фон из мерцающих символов для консоли.
// По мотивам LetterGlitch из Vue Bits (David Haz): своя упрощённая реализация на Canvas 2D.

const CHARS = 'АБВГДЕЖЗИКЛМНПРСТУФХЦЧШЭЮЯABCDEFGHJKLMNPQRSTUVXYZ0123456789<>/_=+*#%&$'
const CELL_W = 11
const CELL_H = 18
const TICK = 70 // мс между обновлениями
const SHARE = 0.04 // доля символов, которые меняются за тик

const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let cols = 0
let rows = 0
let grid: { ch: string, accent: boolean }[] = []
let timer: ReturnType<typeof setInterval> | undefined
let resizeObserver: ResizeObserver | undefined
let colors = { dim: '#6b717c', accent: '#7d95ff', font: 'monospace' }

const random = () => CHARS[Math.floor(Math.random() * CHARS.length)]!

function readColors() {
  const style = getComputedStyle(document.documentElement)
  colors = {
    dim: style.getPropertyValue('--h-term-dim').trim() || colors.dim,
    accent: style.getPropertyValue('--h-term-accent').trim() || colors.accent,
    font: style.getPropertyValue('--h-mono').trim() || colors.font,
  }
}

function cellColor(accent: boolean) {
  return accent ? colors.accent : colors.dim
}

function drawCell(i: number) {
  if (!ctx)
    return
  const x = (i % cols) * CELL_W
  const y = Math.floor(i / cols) * CELL_H
  ctx.clearRect(x, y, CELL_W, CELL_H)
  ctx.fillStyle = cellColor(grid[i]!.accent)
  ctx.fillText(grid[i]!.ch, x + CELL_W / 2, y + CELL_H / 2)
}

function build() {
  const el = canvas.value!
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  el.width = Math.round(el.clientWidth * dpr)
  el.height = Math.round(el.clientHeight * dpr)
  ctx = el.getContext('2d')
  if (!ctx)
    return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.font = `12px ${colors.font}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  cols = Math.ceil(el.clientWidth / CELL_W)
  rows = Math.ceil(el.clientHeight / CELL_H)
  grid = Array.from({ length: cols * rows }, () => ({ ch: random(), accent: Math.random() < 0.08 }))
  grid.forEach((_, i) => drawCell(i))
}

function tick() {
  const count = Math.max(1, Math.floor(grid.length * SHARE))
  for (let k = 0; k < count; k++) {
    const i = Math.floor(Math.random() * grid.length)
    grid[i] = { ch: random(), accent: Math.random() < 0.08 }
    drawCell(i)
  }
}

onMounted(() => {
  readColors()
  build()
  resizeObserver = new ResizeObserver(build)
  resizeObserver.observe(canvas.value!)
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
    timer = setInterval(tick, TICK)
})

onBeforeUnmount(() => {
  clearInterval(timer)
  resizeObserver?.disconnect()
})
</script>

<template>
  <canvas ref="canvas" class="letter-glitch" aria-hidden="true" />
</template>

<style lang="scss" scoped>
.letter-glitch {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.08;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%);
}
</style>
