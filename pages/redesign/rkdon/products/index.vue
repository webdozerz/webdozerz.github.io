<script lang="ts" setup>
import RkCard from '~/components/redesign/rkdon/RkCard.vue'
import RkSales from '~/components/redesign/rkdon/RkSales.vue'
import type { RkKind, RkTab } from '~/utils/rkdon'

useSeoMeta({ title: 'Рыбные снеки и кальмар оптом — Рыбокомбинат Донской | Концепт редизайна' })

const route = useRoute()
const router = useRouter()
// Вкладки оригинала — якоря #weight и #rus, их сохраняем; вид (кальмар/рыба) — параметр ?kind.
const tab = ref<'all' | RkTab>('all')
const kind = computed<'all' | RkKind>(() => (route.query.kind === 'squid' || route.query.kind === 'fish' ? route.query.kind : 'all'))

const tabs = computed(() => [
  { id: 'all' as const, title: 'Все', n: rkProducts.length },
  ...rkTabs.map((t) => ({ id: t.id, title: t.title, n: rkProducts.filter((p) => p.tab === t.id).length })),
])
const inTab = computed(() => rkProducts.filter((p) => tab.value === 'all' || p.tab === tab.value))
const kinds = computed(() => [
  { id: 'all' as const, title: 'Все виды', icon: '', n: inTab.value.length },
  ...rkKinds.map((k) => ({ ...k, n: inTab.value.filter((p) => p.kind === k.id).length })),
])
const list = computed(() => inTab.value.filter((p) => kind.value === 'all' || p.kind === kind.value))
const note = computed(() => rkTabs.find((t) => t.id === tab.value)?.note || 'Весовая рыба — пачки по 1 кг, русская рыба — вакуум 500 г')

const setTab = (id: 'all' | RkTab) => {
  tab.value = id
  router.replace({ query: route.query, hash: id === 'all' ? '' : '#' + id })
}
const setKind = (id: 'all' | RkKind) => router.replace({ query: id === 'all' ? {} : { kind: id }, hash: route.hash })

onMounted(() => {
  const h = route.hash.slice(1)
  if (h === 'weight' || h === 'rus') tab.value = h
})
</script>

<template>
  <div class="rk-products">
    <div class="rk-wrap rk-pagehead">
      <nav class="rk-crumbs">
        <NuxtLink :to="rkPath('/')">Главная</NuxtLink><span>Рыбные снеки</span>
      </nav>
      <h1>Рыбные снеки и кальмар</h1>
      <p class="rk-pagehead__lead">
        Сушёно-вяленая рыба и кальмар оптом: коробами по 10 кг в пачках от 18 г до 1 кг или балком. Все позиции доступны к самовывозу.
      </p>
    </div>
    <div class="rk-wrap">
      <div class="rk-filter">
        <div class="rk-tabs" role="tablist">
          <button
            v-for="t in tabs"
            :id="t.id"
            :key="t.id"
            type="button"
            role="tab"
            class="rk-tabs__item"
            :class="{ 'is-active': tab === t.id }"
            :aria-selected="tab === t.id"
            @click="setTab(t.id)"
          >
            {{ t.title }} <small>{{ t.n }}</small>
          </button>
        </div>
        <div class="rk-kinds">
          <button
            v-for="k in kinds"
            :key="k.id"
            type="button"
            class="rk-kinds__item"
            :class="['rk-kinds__item--' + k.id, { 'is-active': kind === k.id }]"
            :disabled="!k.n"
            @click="setKind(k.id)"
          >
            <img v-if="k.icon" :src="rkImg(k.icon)" alt="" width="30" height="24" />{{ k.title }} <small>{{ k.n }}</small>
          </button>
        </div>
      </div>
      <p class="rk-products__note">{{ note }}. Срок годности — с даты изготовления.</p>
      <div v-if="list.length" class="rk-grid">
        <RkCard v-for="p in list" :key="p.id" :p="p" />
      </div>
      <p v-else class="rk-products__empty">
        В этой вкладке нет позиций такого вида.
        <button type="button" class="rk-link" @click="setKind('all')">Показать все виды</button>
      </p>
      <RkSales class="rk-sales--gap" subject="Запрос цен на весовую продукцию" />
    </div>
  </div>
</template>

<style lang="scss">
.rk-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
}
.rk-kinds {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  &__item,
  &__item:focus,
  &__item:active {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 44px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1px solid var(--rk-line);
    background: #fff;
    font-weight: 700;
    color: var(--rk-ink);
    white-space: nowrap;
  }
  &__item {
    img {
      width: 30px;
      height: 24px;
      object-fit: contain;
    }
    small {
      font-weight: 600;
      color: var(--rk-muted);
    }
    &:hover {
      border-color: var(--rk-accent);
    }
    &:disabled {
      opacity: 0.45;
      cursor: default;
    }
    &.is-active {
      border-color: var(--rk-ink);
      background: var(--rk-ink);
      color: #fff;
      small {
        color: #e6d6dc;
      }
    }
    &--squid.is-active {
      background: var(--rk-squid);
      border-color: var(--rk-squid);
    }
    &--fish.is-active {
      background: var(--rk-fish);
      border-color: var(--rk-fish);
    }
  }
}
.rk-products {
  &__note {
    margin-top: 16px;
    margin-bottom: 20px;
    color: var(--rk-muted);
    font-size: 14px;
  }
  &__empty {
    padding: 40px 0;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
}
@media (max-width: 768px) {
  .rk-filter {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }
  .rk-kinds {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
  }
}
@media (max-width: 375px) {
  .rk-tabs__item {
    padding: 9px 11px;
  }
  .rk-kinds__item {
    padding: 0 10px;
  }
}
</style>
