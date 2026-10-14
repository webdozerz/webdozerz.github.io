<script setup lang="ts">
// Слова по очереди сменяют друг друга с коротким выездом снизу.
// По мотивам RotatingText из Vue Bits (David Haz), без motion-v.
// Все варианты лежат в DOM по одному разу (видно один): поисковики и скринридеры читают
// их через запятую, без дублей текста на странице.

const props = withDefaults(defineProps<{
  items: string[]
  interval?: number
  startDelay?: number // первая смена позже обычного, пока первый экран ещё появляется
}>(), {
  interval: 2600,
  startDelay: 0,
})

const index = ref(0)
const live = ref(false)
let timer: ReturnType<typeof setInterval> | undefined
let startTimer: ReturnType<typeof setTimeout> | undefined

const prevIndex = computed(() => (index.value - 1 + props.items.length) % props.items.length)

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

// В фоновой вкладке не крутим впустую.
function onVisibility() {
  if (document.hidden)
    stop()
  else start()
}

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches)
    return
  live.value = true
  start(Math.max(0, props.startDelay - props.interval))
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  stop()
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <span class="rotating" :class="{ 'rotating--live': live }">
    <span
      v-for="(item, i) in items"
      :key="item"
      class="rotating__item"
      :class="{ 'is-active': i === index, 'is-prev': live && i === prevIndex }"
    >{{ item }}<span v-if="i < items.length - 1" class="rotating__sep">, </span></span>
  </span>
</template>

<style lang="scss" scoped>
// Без анимации (до загрузки скрипта или при «уменьшить движение») — обычный список через запятую.
.rotating__item {
  color: var(--h-text);
}

// С анимацией все варианты лежат друг на друге, видимый — один.
.rotating--live {
  display: inline-grid;
  vertical-align: bottom;
  overflow: hidden;

  .rotating__item {
    grid-area: 1 / 1;
    white-space: nowrap;
    opacity: 0;
    transform: translateY(70%);
    transition: transform 0.32s cubic-bezier(0.2, 0.7, 0.2, 1), opacity 0.32s;

    &.is-active {
      opacity: 1;
      transform: none;
    }

    &.is-prev {
      transform: translateY(-70%);
    }
  }

  // Запятые нужны только скринридерам и поисковикам.
  .rotating__sep {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
}
</style>
