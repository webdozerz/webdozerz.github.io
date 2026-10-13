<script setup lang="ts">
// Слова по очереди сменяют друг друга с коротким выездом снизу.
// По мотивам RotatingText из Vue Bits (David Haz), без motion-v — на Vue Transition.

const props = withDefaults(defineProps<{
  items: string[]
  interval?: number
  startDelay?: number // первая смена позже обычного, пока первый экран ещё появляется
}>(), {
  interval: 2600,
  startDelay: 0,
})

const index = ref(0)
const reduced = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

let startTimer: ReturnType<typeof setTimeout> | undefined

function start(delay = 0) {
  stop()
  startTimer = setTimeout(() => {
    timer = setInterval(() => {
      index.value = (index.value + 1) % props.items.length
    }, props.interval)
  }, delay)
}

function stop() {
  clearTimeout(startTimer)
  clearInterval(timer)
}

// Во фоновой вкладке не крутим впустую.
function onVisibility() {
  if (document.hidden)
    stop()
  else start()
}

onMounted(() => {
  reduced.value = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced.value)
    return
  start(Math.max(0, props.startDelay - props.interval))
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  stop()
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <span v-if="reduced" class="rotating">{{ items.join(', ') }}</span>
  <span v-else class="rotating rotating--live">
    <Transition name="rotate" mode="out-in">
      <span :key="index" class="rotating__item">{{ items[index] }}</span>
    </Transition>
  </span>
</template>

<style lang="scss" scoped>
// Отдельная строка фиксированной высоты: пока слово меняется, вёрстка под ним не прыгает.
.rotating--live {
  display: block;
  height: 1.6em;
  overflow: hidden;
}

.rotating__item {
  display: inline-block;
  color: var(--h-text);
}

.rotate-enter-active,
.rotate-leave-active {
  transition: transform 0.32s cubic-bezier(0.2, 0.7, 0.2, 1), opacity 0.32s;
}

.rotate-enter-from {
  opacity: 0;
  transform: translateY(70%);
}

.rotate-leave-to {
  opacity: 0;
  transform: translateY(-70%);
}
</style>
