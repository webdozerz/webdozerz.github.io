<script setup lang="ts">
// Текст «расшифровывается» при появлении: буквы сначала мелькают случайными символами
// и по очереди встают на место. Идея — генерация AnimatedWebs, переписано под Vue.
// Ширина каждой буквы зарезервирована «призраком» финального символа, поэтому строка не дёргается.

const props = withDefaults(defineProps<{
  text: string
  delay?: number // мс между стартами соседних букв
  settle?: number // сколько мс буква перебирает символы
}>(), {
  delay: 38,
  settle: 260,
})

const GLYPHS = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯABCDEFGHJKLMNPQRSTUVXYZ0123456789░▒▓<>/_=+*#'
const TICK = 55 // как часто меняется случайный символ

type Char = { final: string, glyph: string | null }

const words = computed(() => props.text.split(' '))
const chars = ref<Char[]>(Array.from(props.text, final => ({ final, glyph: null })))
const ready = ref(false)

let raf = 0
let running = false
let lastRun = 0

const random = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!

// Индекс буквы в общем массиве по слову и позиции в нём.
function indexOf(wordIndex: number, charIndex: number) {
  let offset = 0
  for (let w = 0; w < wordIndex; w++)
    offset += words.value[w]!.length + 1
  return offset + charIndex
}

function run() {
  cancelAnimationFrame(raf)
  running = true
  lastRun = performance.now()
  const start = performance.now()
  let lastTick = 0
  let order = 0
  const plan = chars.value.map((c) => {
    if (c.final === ' ')
      return 0
    order += 1
    return start + order * props.delay + props.settle + Math.random() * 120
  })

  chars.value = chars.value.map(c => ({ final: c.final, glyph: c.final === ' ' ? null : random() }))

  const frame = (now: number) => {
    const tick = now - lastTick > TICK
    if (tick)
      lastTick = now
    let pending = false
    chars.value.forEach((c, i) => {
      if (c.glyph === null)
        return
      if (now >= plan[i]!) {
        c.glyph = null
      }
      else {
        pending = true
        if (tick)
          c.glyph = random()
      }
    })
    if (pending) {
      raf = requestAnimationFrame(frame)
    }
    else {
      running = false
    }
  }
  raf = requestAnimationFrame(frame)
}

function replay() {
  // Повтор по наведению — не чаще раза в 3 секунды и только с мышью.
  if (running || performance.now() - lastRun < 3000)
    return
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches)
    return
  run()
}

onMounted(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced)
    run()
  ready.value = true
})

onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <span class="scramble" :class="{ 'scramble--ready': ready }" @mouseenter="replay">
    <span>
      <template v-for="(word, w) in words" :key="w">
        <span class="scramble__word">
          <span v-for="(_, c) in word" :key="c" class="scramble__char">
            <span class="scramble__ghost" :class="{ 'scramble__ghost--hidden': chars[indexOf(w, c)]?.glyph }">{{ chars[indexOf(w, c)]?.final }}</span>
            <span v-if="chars[indexOf(w, c)]?.glyph" class="scramble__glyph" aria-hidden="true">{{ chars[indexOf(w, c)]?.glyph }}</span>
          </span>
        </span>
        <template v-if="w < words.length - 1">
          {{ ' ' }}
        </template>
      </template>
    </span>
  </span>
</template>

<style lang="scss" scoped>
.scramble {
  &__word {
    display: inline-block;
    white-space: nowrap;
  }

  &__char {
    position: relative;
    display: inline-block;
  }

  &__ghost--hidden {
    visibility: hidden;
  }

  &__glyph {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--h-accent);
    font-family: var(--h-mono);
    font-size: 0.72em;
    font-weight: 400;
    letter-spacing: 0;
  }
}

// Пока Vue не запустил анимацию, имя скрыто, чтобы не мелькнуло целиком перед «расшифровкой».
// Если JS не загрузится, через 2,5 с текст всё равно появится.
:global(html[data-js]) .scramble:not(.scramble--ready) {
  visibility: hidden;
  animation: scramble-fallback 0s 2.5s forwards;
}

@keyframes scramble-fallback {
  to {
    visibility: visible;
  }
}
</style>
