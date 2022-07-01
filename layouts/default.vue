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

<script lang="ts">
</script>

<style lang="scss" scoped>
.container {}
</style>
