<script lang="ts" setup>
import type { ZdTier } from '~/utils/zdrava22'
import { useZdUi } from '~/composables/useZdrava22'
// Розница коробкой / опт куботейнером — один переключатель на все сорта страницы
const ui = useZdUi()
const opts: { id: ZdTier; label: string; sub: string }[] = [
  { id: 'r', label: 'Розница', sub: 'коробка 12 кг' },
  { id: 'o', label: 'Опт', sub: 'куботейнер 34 кг' },
]
</script>

<template>
  <div class="zd-tiers" role="tablist" aria-label="Розница или опт">
    <button
      v-for="o in opts"
      :key="o.id"
      type="button"
      role="tab"
      class="zd-tiers__btn"
      :class="{ 'is-on': ui.tier.value === o.id }"
      :aria-selected="ui.tier.value === o.id"
      @click="ui.tier.value = o.id"
    >
      <b>{{ o.label }}</b>
      <span>{{ o.sub }}</span>
    </button>
  </div>
</template>

<style lang="scss">
.zd-tiers {
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: var(--zd-surface);

  &__btn {
    display: grid;
    gap: 1px;
    min-width: 0;
    padding: 8px 18px;
    border-radius: 11px;
    text-align: left;
    white-space: nowrap;
    color: var(--zd-muted);
    transition: background 0.15s, color 0.15s;

    b {
      font-size: 15px;
      color: var(--zd-ink);
    }
    span {
      font-size: 13px;
    }
    &:hover b {
      color: var(--zd-accent);
    }
    &.is-on {
      background: #fff;
      box-shadow: 0 1px 3px rgba(28, 33, 51, 0.12);
    }
  }

  @media (max-width: 576px) {
    display: grid;
    width: 100%;
  }
  @media (max-width: 375px) {
    &__btn {
      padding: 8px 12px;
    }
  }
}
</style>
