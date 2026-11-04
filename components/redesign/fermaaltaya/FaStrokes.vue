<script lang="ts" setup>
// Мазки с ливреи фургона фермы: хвойный, зелёный и крафтовый — фирменный разделитель
const props = withDefaults(defineProps<{ flip?: boolean }>(), { flip: false })
const id = useId()
</script>

<template>
  <svg class="fa-strokes" :class="{ 'is-flip': props.flip }" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <filter :id="`fa-rough-${id}`" x="-2%" y="-20%" width="104%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.018 0.9" numOctaves="2" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="9" />
      </filter>
    </defs>
    <g :filter="`url(#fa-rough-${id})`">
      <path class="fa-strokes__craft" d="M0 40 C 220 18, 420 22, 640 34 S 1010 52, 1200 26 L1200 58 C 1000 76, 820 60, 600 58 S 200 66, 0 70 Z" />
      <path class="fa-strokes__green" d="M0 58 C 260 44, 520 52, 760 58 S 1080 64, 1200 50 L1200 74 C 980 84, 760 76, 540 74 S 180 82, 0 84 Z" />
      <path class="fa-strokes__dark" d="M0 70 C 300 62, 600 70, 860 72 S 1120 70, 1200 66 L1200 90 L0 90 Z" />
    </g>
  </svg>
</template>
