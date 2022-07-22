<template>
  <div class="container">
    <slot />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Empty'
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  max-width: 1170px;
  margin: 0 auto;
}
</style>
