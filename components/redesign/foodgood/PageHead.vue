<script lang="ts" setup>
defineProps<{ title: string; lead?: string; crumb?: string }>()
</script>

<template>
  <section class="page-head">
    <div class="fg-container">
      <nav class="page-head__crumbs" aria-label="Навигация">
        <NuxtLink :to="fgPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>{{ crumb ?? title }}</span>
      </nav>
      <h1 class="page-head__title">{{ title }}</h1>
      <p v-if="lead" class="page-head__lead">{{ lead }}</p>
      <slot />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.page-head {
  padding: 40px 0 32px;

  &__crumbs {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
    font-size: 13px;
    color: var(--fg-muted);

    a:hover {
      color: var(--fg-forest);
      text-decoration: underline;
    }
  }

  &__title {
    font-size: clamp(34px, 5.5vw, 56px);
  }

  &__lead {
    max-width: 640px;
    margin-top: 14px;
    font-size: 18px;
    color: var(--fg-muted);
  }
}
</style>
