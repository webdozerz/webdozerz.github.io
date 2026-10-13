<script setup lang="ts">
defineProps<{
  id: string
  index: string
  title: string
}>()
</script>

<template>
  <section :id="id" class="section">
    <div class="shell section__inner">
      <header class="section__head">
        <span class="section__index mono">{{ index }}</span>
        <h2 class="section__title" :aria-label="title">
          <HomeScrambleText :text="title" trigger="visible" />
        </h2>
      </header>
      <div class="section__body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section {
  padding: 88px 0;
  border-top: 1px solid var(--h-line);
  scroll-margin-top: 48px;

  &__inner {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 40px;
  }

  &__head {
    position: sticky;
    top: 96px;
    align-self: start;
  }

  &__index {
    display: block;
    margin-bottom: 10px;
    color: var(--h-accent);
    font-size: 12px;
  }

  &__title {
    margin: 0;
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
}

@media (max-width: 900px) {
  .section {
    padding: 64px 0;

    &__inner {
      grid-template-columns: 1fr;
      gap: 28px;
    }

    &__head {
      position: static;
    }
  }
}
</style>
