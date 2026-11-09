<script lang="ts" setup>
// Шапка внутренней страницы: хлебные крошки, заголовок, подзаголовок, кнопка «Печать» (у оригинала — иконка в шапке)
import { kzPath } from '~/utils/kuzbasskay'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

const props = defineProps<{ title: string; lead?: string; crumbs?: { label: string; to: string }[] }>()
const print = () => window.print()
</script>

<template>
  <div class="kz-head">
    <div class="kz-wrap">
      <nav class="kz-head__crumbs" aria-label="Вы здесь">
        <NuxtLink :to="kzPath()">Главная</NuxtLink>
        <template v-for="c in props.crumbs || []" :key="c.to">
          <KzIcon name="right" :size="14" />
          <NuxtLink :to="c.to">{{ c.label }}</NuxtLink>
        </template>
      </nav>
      <div class="kz-head__row">
        <div>
          <h1>{{ props.title }}</h1>
          <p v-if="props.lead" class="kz-head__lead">{{ props.lead }}</p>
        </div>
        <button type="button" class="kz-btn kz-btn--line kz-head__print" @click="print"><KzIcon name="print" :size="18" />Печать</button>
      </div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.kz-head {
  padding-top: 24px;
  padding-bottom: 8px;

  &__crumbs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 6px;
    color: var(--kz-muted);
    font-size: 14px;

    a:hover {
      color: var(--kz-accent-ink);
    }
    .kz-icon {
      opacity: 0.6;
    }
  }
  &__row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-top: 14px;

    h1 {
      font-size: clamp(30px, 4vw, 46px);
      font-weight: 900;
      letter-spacing: -0.01em;
      line-height: 1.08;
      overflow-wrap: anywhere;
    }
  }
  &__lead {
    max-width: 760px;
    margin-top: 12px;
    color: var(--kz-text);
    font-size: 17px;
    line-height: 1.55;
  }
  & &__print {
    flex: none;

    @media (max-width: 768px) {
      display: none;
    }
  }
  &__row > div {
    min-width: 0;
  }
}
</style>
