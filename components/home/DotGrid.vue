<script setup lang="ts">
// Точечная сетка первого экрана: точки расходятся от курсора, подсвечиваются акцентом,
// а клик пускает волну. По мотивам DotGrid из Vue Bits (David Haz), переписано без gsap.
// Цикл анимации крутится, только пока точки двигаются или курсор рядом.

const GAP = 22
const SIZE = 2
const RADIUS = 130 // радиус влияния курсора, px
const PUSH = 14 // насколько сильно точки отходят от курсора
const SPRING = 0.08
const DAMPING = 0.82

type Dot = { x: number, y: number, ox: number, oy: number, vx: number, vy: number }

const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let dots: Dot[] = []
let width = 0
let height = 0
let raf = 0
let running = false
let visible = true
let reduced = false
const pointer = { x: -9999, y: -9999, inside: false }
let colors = { dot: '#2a2d34', accent: '#7d95ff' }
let resizeObserver: ResizeObserver | undefined
let themeObserver: MutationObserver | undefined
let viewObserver: IntersectionObserver | undefined

function readColors() {
  const style = getComputedStyle(document.documentElement)
  colors = {
    dot: style.getPropertyValue('--h-dot').trim() || colors.dot,
    accent: style.getPropertyValue('--h-accent').trim() || colors.accent,
  }
}

function build() {
  const el = canvas.value!
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = el.clientWidth
  height = el.clientHeight
  el.width = Math.round(width * dpr)
  el.height = Math.round(height * dpr)
  ctx = el.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  // Сетку центрируем: отступ от каждого края одинаковый и не меньше шага.
  const cols = Math.max(1, Math.floor((width - GAP * 2) / GAP) + 1)
  const rows = Math.max(1, Math.floor((height - GAP * 2) / GAP) + 1)
  const startX = (width - (cols - 1) * GAP) / 2
  const startY = (height - (rows - 1) * GAP) / 2
  dots = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++)
      dots.push({ x: startX + c * GAP, y: startY + r * GAP, ox: 0, oy: 0, vx: 0, vy: 0 })
  }
  draw()
}

function draw() {
  if (!ctx)
    return
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = colors.dot
  ctx.globalAlpha = 1
  for (const d of dots)
    ctx.fillRect(d.x + d.ox - SIZE / 2, d.y + d.oy - SIZE / 2, SIZE, SIZE)

  if (!pointer.inside)
    return
  // Точки возле курсора подсвечиваем акцентом поверх базового цвета.
  ctx.fillStyle = colors.accent
  for (const d of dots) {
    const dist = Math.hypot(d.x - pointer.x, d.y - pointer.y)
    if (dist > RADIUS)
      continue
    ctx.globalAlpha = (1 - dist / RADIUS) * 0.9
    ctx.fillRect(d.x + d.ox - SIZE / 2, d.y + d.oy - SIZE / 2, SIZE, SIZE)
  }
  ctx.globalAlpha = 1
}

function step() {
  let moving = false
  for (const d of dots) {
    let tx = 0
    let ty = 0
    if (pointer.inside) {
      const dx = d.x - pointer.x
      const dy = d.y - pointer.y
      const dist = Math.hypot(dx, dy)
      if (dist < RADIUS && dist > 0.01) {
        const force = (1 - dist / RADIUS) ** 2 * PUSH
        tx = (dx / dist) * force
        ty = (dy / dist) * force
      }
    }
    d.vx = (d.vx + (tx - d.ox) * SPRING) * DAMPING
    d.vy = (d.vy + (ty - d.oy) * SPRING) * DAMPING
    d.ox += d.vx
    d.oy += d.vy
    if (Math.abs(d.vx) > 0.01 || Math.abs(d.vy) > 0.01 || Math.abs(d.ox - tx) > 0.05 || Math.abs(d.oy - ty) > 0.05)
      moving = true
  }
  draw()
  if ((moving || pointer.inside) && visible) {
    raf = requestAnimationFrame(step)
  }
  else {
    running = false
  }
}

function wake() {
  if (running || reduced || !visible)
    return
  running = true
  raf = requestAnimationFrame(step)
}

function onPointerMove(event: PointerEvent) {
  const rect = canvas.value!.getBoundingClientRect()
  pointer.x = event.clientX - rect.left
  pointer.y = event.clientY - rect.top
  pointer.inside = pointer.y >= 0 && pointer.y <= rect.height
  wake()
}

function onPointerLeave() {
  pointer.inside = false
  wake()
}

// Клик — волна: точки рядом получают толчок от места клика.
function onPointerDown(event: PointerEvent) {
  if (reduced)
    return
  const rect = canvas.value!.getBoundingClientRect()
  const cx = event.clientX - rect.left
  const cy = event.clientY - rect.top
  for (const d of dots) {
    const dx = d.x - cx
    const dy = d.y - cy
    const dist = Math.hypot(dx, dy)
    if (dist > 220 || dist < 0.01)
      continue
    const power = (1 - dist / 220) * 9
    d.vx += (dx / dist) * power
    d.vy += (dy / dist) * power
  }
  wake()
}

defineExpose({ onPointerMove, onPointerLeave, onPointerDown })

onMounted(() => {
  reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  readColors()
  build()

  resizeObserver = new ResizeObserver(() => build())
  resizeObserver.observe(canvas.value!)

  // При смене темы перечитываем цвета точек.
  themeObserver = new MutationObserver(() => {
    readColors()
    draw()
  })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  viewObserver = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
  })
  viewObserver.observe(canvas.value!)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  resizeObserver?.disconnect()
  themeObserver?.disconnect()
  viewObserver?.disconnect()
})
</script>

<template>
  <canvas ref="canvas" class="dot-grid" aria-hidden="true" />
</template>

<style lang="scss" scoped>
.dot-grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  // Виньетка: под контентом (1120 px) сетка в полную силу, к краям широкого экрана плавно гаснет.
  mask-image: linear-gradient(to right, transparent 0%, #000 calc(50% - 680px), #000 calc(50% + 680px), transparent 100%);
  animation: dot-grid-in 1.2s ease-out both;
}

@keyframes dot-grid-in {
  from {
    opacity: 0;
  }
}
</style>
