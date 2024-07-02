<script lang="ts" setup>
import Bio from '@/components/Bio.vue'
import Experience from '@/components/Experience.vue'
import Education from '@/components/Education.vue'
import Tech from '@/components/Tech.vue'
</script>

<template>
  <div class="cv">
    <Bio />
    <Experience />
    <Education />
    <Tech />
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
