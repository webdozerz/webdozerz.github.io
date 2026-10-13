<script setup lang="ts">
// Число досчитывается от нуля, когда блок появляется на экране.
// Понимает значения вида «7+», «3 000+» и «1M+» (последнее считает через тысячи: 0K → 999K → 1M).

const props = withDefaults(defineProps<{
  value: string
  duration?: number
}>(), {
  duration: 1400,
})

const parsed = computed(() => {
  const match = props.value.match(/^([\d\s]+)(M?)(.*)$/)
  if (!match)
    return null
  const number = Number(match[1]!.replace(/\s/g, ''))
  const millions = match[2] === 'M'
  return { target: millions ? number * 1000 : number, millions, suffix: match[3] ?? '' }
})

const display = ref(props.value)
const ready = ref(false)
const root = ref<HTMLElement>()
let raf = 0
let observer: IntersectionObserver | undefined

const groups = (n: number) => n.toLocaleString('ru-RU').replace(/[\u00A0\u202F]/g, ' ')

function format(current: number) {
  const p = parsed.value!
  if (p.millions) {
    return current >= p.target
      ? `${groups(p.target / 1000)}M${p.suffix}`
      : `${groups(current)}K${p.suffix}`
  }
  return `${groups(current)}${p.suffix}`
}

function run() {
  const p = parsed.value!
  const start = performance.now()
  const frame = (now: number) => {
    const t = Math.min((now - start) / props.duration, 1)
    const eased = 1 - (1 - t) ** 3
    display.value = format(Math.round(p.target * eased))
    if (t < 1)
      raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)
}

onMounted(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!parsed.value || reduced || !root.value) {
    ready.value = true
    return
  }
  // Скрипт загрузился поздно, а число уже видно на экране — оставляем его как есть.
  const rect = root.value.getBoundingClientRect()
  const onScreen = rect.top < innerHeight && rect.bottom > 0
  if (onScreen && getComputedStyle(root.value).visibility === 'visible') {
    ready.value = true
    return
  }
  display.value = format(0)
  ready.value = true
  observer = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      observer?.disconnect()
      run()
    }
  }, { threshold: 0.6 })
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
})
</script>

<template>
  <span ref="root" class="count" :class="{ 'count--ready': ready }">{{ display }}</span>
</template>

<style lang="scss" scoped>
.count {
  font-variant-numeric: tabular-nums;
}
</style>

<style lang="scss">
// До запуска скрипта число скрыто, чтобы не мелькнуло финальное значение перед отсчётом.
// Не дольше 0,5 с: если скрипт опоздал, элемент показывается без анимации.
// Не scoped: в scoped-стилях Vue обрезает всё после :global(...), и правило скрывало бы всю страницу.
html[data-js] .count:not(.count--ready) {
  visibility: hidden;
  animation: count-fallback 0s 0.5s forwards;
}

@keyframes count-fallback {
  to {
    visibility: visible;
  }
}
</style>
