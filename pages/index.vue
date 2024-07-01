<script lang="ts" setup>
import Bio from '@/components/Bio.vue'
import Experience from '@/components/Experience.vue'
</script>

<template>
  <div class="cv">
    <Bio />
    <Experience />
  </div>
</template>

<style lang="scss" scoped>
.cv {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 20px;
}
</style>
