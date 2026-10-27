<script lang="ts" setup>
// Медиафасад МРК: 20 000 адресных светодиодов на здании. В концепте — табло из точек, по которому идёт волна.
// Буквы «МРК» нарисованы сеткой 5×7 на каждую букву; анимация только у прозрачности, без JS.
const glyphs: Record<string, string[]> = {
  М: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  Р: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  К: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
}
const word = ['М', 'Р', 'К']
const cols = word.length * 6 - 1 + 4
const rows = 7 + 4
const dots = computed(() => {
  const out: { on: boolean; d: number }[] = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const gx = x - 2
      const gy = y - 2
      const letter = Math.floor(gx / 6)
      const lx = gx % 6
      const on = gy >= 0 && gy < 7 && gx >= 0 && letter < word.length && lx < 5 && glyphs[word[letter]][gy][lx] === '1'
      out.push({ on, d: ((x + y) % 14) * 0.12 })
    }
  }
  return out
})
</script>

<template>
  <div class="mf-facade" :style="{ '--cols': cols }" aria-label="Медиафасад МРК" role="img">
    <i v-for="(dot, i) in dots" :key="i" :class="{ 'is-on': dot.on }" :style="{ animationDelay: `${dot.d}s` }" />
  </div>
</template>

<style lang="scss">
.mf-facade {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  gap: clamp(3px, 0.6vw, 6px);
  padding: clamp(14px, 2.4vw, 24px);
  border-radius: var(--mf-r-lg);
  background: #0e1b2e;

  i {
    aspect-ratio: 1;
    border-radius: 50%;
    background: #1d2d46;
  }

  .is-on {
    background: #ffd21f;
    box-shadow: 0 0 8px rgba(255, 210, 31, 0.55);
    animation: mf-led 2.4s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .is-on {
      animation: none;
    }
  }
}

@keyframes mf-led {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
    background: #ff5a3c;
  }
}
</style>
