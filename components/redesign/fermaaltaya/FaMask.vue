<script lang="ts" setup>
// Иконка раздела: корова, свинья и курица вырезаны из логотипа фермы и красятся currentColor через CSS-маску
import FaIcon from './FaIcon.vue'

const props = withDefaults(defineProps<{ sec: string; size?: number }>(), { size: 28 })
const ic = computed(() => faSecIcons[props.sec] ?? { icon: 'leaf' })
const url = computed(() => (ic.value.mask ? `url(${faLocal(`${ic.value.mask}.${ic.value.mask === 'sheep' ? 'svg' : 'png'}`)})` : ''))
</script>

<template>
  <span
    v-if="ic.mask"
    class="fa-mask"
    :class="`fa-mask--${ic.mask}`"
    :style="{ '--fa-mask': url, height: `${props.size}px` }"
    aria-hidden="true"
  />
  <FaIcon v-else :name="ic.icon!" :size="props.size" />
</template>
