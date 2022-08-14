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
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  &__content {
    display: grid;
    max-width: 680px;
    margin: 0 auto;
    width: 100%;
  }
}

main {
  margin-top: 60px;
}
</style>
