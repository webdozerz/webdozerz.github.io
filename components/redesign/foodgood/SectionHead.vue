<script lang="ts" setup>
defineProps<{ title: string; eyebrow?: string; to?: string; linkLabel?: string }>()
</script>

<template>
  <div class="head">
    <div>
      <div v-if="eyebrow" class="head__eyebrow">{{ eyebrow }}</div>
      <h2 class="head__title">{{ title }}</h2>
    </div>
    <NuxtLink v-if="to" :to="to" class="head__link">{{ linkLabel ?? 'Смотреть все' }} →</NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;

  &__eyebrow {
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--fg-leaf);
  }

  &__title {
    font-size: clamp(28px, 4vw, 40px);
  }

  &__link {
    flex-shrink: 0;
    font-weight: 700;
    font-size: 15px;
    color: var(--fg-forest);
    border-bottom: 2px solid var(--fg-leaf);
    padding-bottom: 2px;

    &:hover {
      color: var(--fg-leaf);
    }
  }
}
</style>
