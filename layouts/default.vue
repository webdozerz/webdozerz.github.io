<template>
  <div class="container">
    <div class="container__content">
      <TheHeader />
      <main>
        <slot />
      </main>
      <TheFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
useMeta({
  title: 'WWWEBDOZERZ'
})
</script>

<style lang="scss" scoped>
.container {}
</style>
