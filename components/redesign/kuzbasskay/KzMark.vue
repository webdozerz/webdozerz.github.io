<script lang="ts" setup>
// Иконка раздела — силуэт из спрайта оригинала (яйцо, окорочок, тушка, крыло) или дорисованный тем же силуэтом,
// красится CSS-маской в currentColor.
import { kzIcon } from '~/utils/kuzbasskay'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 28 })
const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  '-webkit-mask-image': `url(${kzIcon(props.name)})`,
  'mask-image': `url(${kzIcon(props.name)})`,
}))
</script>

<template>
  <span class="kz-mark" :style="style" aria-hidden="true" />
</template>

<style lang="scss">
.kz-mark {
  display: inline-block;
  flex: none;
  background: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
}
</style>
