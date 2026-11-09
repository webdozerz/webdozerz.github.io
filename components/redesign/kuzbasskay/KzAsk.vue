<script lang="ts" setup>
// «Узнать цену»: цен на сайте нет — отдел продаж (мелкий / крупный опт) звонком или письмом с готовой темой «Цена: …»
import { kzPriceMail, kzSales } from '~/utils/kuzbasskay'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

const props = withDefaults(defineProps<{ what: string; label?: string; block?: boolean; up?: boolean }>(), {
  label: 'Узнать цену',
  block: false,
  up: false,
})
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const onDoc = (e: Event) => {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => {
  document.addEventListener('click', onDoc)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDoc)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="kz-ask" :class="{ 'is-open': open, 'kz-ask--block': props.block, 'kz-ask--up': props.up }">
    <button type="button" class="kz-btn kz-ask__btn" :aria-expanded="open" @click="open = !open">
      {{ props.label }}<KzIcon name="down" :size="16" class="kz-ask__chev" />
    </button>
    <div v-if="open" class="kz-ask__pop" role="menu">
      <p class="kz-ask__what">{{ props.what }}</p>
      <a v-for="s in kzSales.slice(0, 2)" :key="s.tel" :href="`tel:${s.tel}`" class="kz-ask__row" role="menuitem">
        <KzIcon name="phone" :size="18" />
        <span><b>{{ s.phone }}</b><small>{{ s.label }}</small></span>
      </a>
      <a :href="kzPriceMail(props.what)" class="kz-ask__row" role="menuitem">
        <KzIcon name="mail" :size="18" />
        <span><b>Написать письмо</b><small>тема «Цена: {{ props.what }}»</small></span>
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.kz-ask {
  position: relative;
  display: inline-block;

  &--block {
    display: block;

    .kz-ask__btn {
      width: 100%;
    }
  }
  &__chev {
    transition: transform 0.15s;
  }
  &.is-open &__chev {
    transform: rotate(180deg);
  }
  &__pop {
    position: absolute;
    z-index: 30;
    top: calc(100% + 8px);
    left: 0;
    width: max(100%, 270px);
    max-width: calc(100vw - 32px);
    padding: 10px;
    border: 1px solid var(--kz-line);
    border-radius: 16px;
    background: #fff;
    box-shadow: var(--kz-pop);
  }
  &--up &__pop {
    top: auto;
    bottom: calc(100% + 8px);
  }
  &__what {
    padding: 4px 8px 8px;
    color: var(--kz-muted);
    font-size: 13px;
    line-height: 1.35;
  }
  &__row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 10px;
    border-radius: 12px;
    color: var(--kz-ink);
    text-align: left;

    .kz-icon {
      flex: none;
      color: var(--kz-accent-ink);
    }
    span {
      display: grid;
      min-width: 0;
      line-height: 1.25;
    }
    b {
      font-weight: 800;
      white-space: nowrap;
    }
    small {
      color: var(--kz-muted);
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    &:hover {
      background: var(--kz-soft);
    }
  }
}
</style>
