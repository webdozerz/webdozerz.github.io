<script lang="ts" setup>
// Каталог: у оригинала products.php?category=N — раздел целиком одной лентой без поиска. Здесь колонка разделов, поиск и выборка товаров
// (по 12 из раздела — концепт), число позиций — реальное.
import { svCatById, svCats, svPath, svPcs, svTotal } from '~/utils/sovelan'
import { svProducts } from '~/utils/sovelan.data'
import SvIcon from '~/components/redesign/sovelan/SvIcon.vue'
import SvCard from '~/components/redesign/sovelan/SvCard.vue'

const route = useRoute()
const router = useRouter()
const id = computed(() => (route.params.id ? Number(route.params.id) : 0))
const cat = computed(() => (id.value ? svCatById(id.value) : undefined))
if (id.value && !svCatById(id.value)) throw createError({ statusCode: 404, statusMessage: 'Раздел не найден' })

const q = ref(String(route.query.q || ''))
watch(
  () => route.query.q,
  (v) => (q.value = String(v || '')),
)
const setQ = (v: string) => {
  q.value = v
  router.replace({ query: v.trim() ? { q: v.trim() } : {} })
}

const base = computed(() => (cat.value ? svProducts.filter((p) => p.c.includes(cat.value!.id)) : svProducts))
const items = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return base.value
  return base.value.filter((p) => `${p.b} ${p.t} ${p.k}`.toLowerCase().includes(s))
})
const title = computed(() => cat.value?.name || 'Каталог')
const total = computed(() => cat.value?.count || svTotal)
useSeoMeta({ title: () => `${title.value} — Ореховые Эланки и Виланки | Концепт редизайна` })
</script>

<template>
  <div class="sv-wrap sv-cat">
    <nav class="sv-crumbs" aria-label="Навигация">
      <NuxtLink :to="svPath('/')">Главная</NuxtLink><span>/</span>
      <NuxtLink v-if="cat" :to="svPath('/katalog/')">Каталог</NuxtLink><span v-if="cat">/</span>
      <span>{{ title }}</span>
    </nav>
    <div class="sv-cat__layout">
      <aside class="sv-cat__side" aria-label="Разделы">
        <NuxtLink :to="svPath('/katalog/')" class="sv-cat__link" :class="{ 'is-on': !cat }"><span>Все коллекции</span><small>{{ svTotal }}</small></NuxtLink>
        <NuxtLink v-for="c in svCats" :key="c.id" :to="svPath(`/katalog/${c.id}/`)" class="sv-cat__link" :class="{ 'is-on': cat?.id === c.id }">
          <span>{{ c.name }}</span><small>{{ c.count }}</small>
        </NuxtLink>
      </aside>
      <div class="sv-cat__main">
        <div class="sv-cat__head">
          <h1>{{ title }}</h1>
          <span>{{ total }} {{ svPcs(total) }}</span>
        </div>
        <div class="sv-cat__chips">
          <NuxtLink :to="svPath('/katalog/')" class="sv-chip" :class="{ 'is-on': !cat }">Все</NuxtLink>
          <NuxtLink v-for="c in svCats" :key="c.id" :to="svPath(`/katalog/${c.id}/`)" class="sv-chip" :class="{ 'is-on': cat?.id === c.id }">{{ c.name }}</NuxtLink>
        </div>
        <form class="sv-cat__search" role="search" @submit.prevent="setQ(q)">
          <SvIcon name="search" />
          <input :value="q" type="search" :placeholder="cat ? `Поиск в «${cat.name}»` : 'Поиск по каталогу'" aria-label="Поиск" @input="setQ(($event.target as HTMLInputElement).value)" />
          <button v-if="q" type="button" class="sv-iconbtn" aria-label="Очистить" @click="setQ('')"><SvIcon name="close" /></button>
        </form>
        <p v-if="q.trim()" class="sv-cat__found">Найдено: {{ items.length }}</p>
        <div v-if="items.length" class="sv-grid">
          <SvCard v-for="p in items" :key="p.id" :p="p" :show-cat="!cat" />
        </div>
        <div v-else class="sv-cat__empty">
          <b>Ничего не нашлось</b>
          <p>Попробуйте другое слово: «овечка», «суфле», «зайчик».</p>
          <button type="button" class="sv-btn sv-btn--line" @click="setQ('')">Сбросить поиск</button>
        </div>
        <p class="sv-cat__note">
          В концепте показаны первые {{ cat ? Math.min(12, cat.count) : base.length }} позиций{{ cat ? ' раздела' : '' }} из {{ total }} — на сайте будут все.
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sv-cat {
  &__layout {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 32px;
    padding-top: 18px;
  }
  &__side {
    position: sticky;
    top: calc(var(--sv-headh) + 16px);
    align-self: start;
    display: grid;
    gap: 4px;
    max-height: calc(100vh - var(--sv-headh) - 32px);
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: var(--sv-line) transparent;
  }
  &__link {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 14px;
    line-height: 1.3;
    color: var(--sv-dark);
    &:hover {
      background: var(--sv-surface);
    }
    &.is-on {
      background: var(--sv-soft);
      color: var(--sv-acc);
      font-weight: 600;
    }
    small {
      color: var(--sv-muted);
      font-variant-numeric: tabular-nums;
    }
  }
  &__head {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 6px 14px;
    h1 {
      font-size: clamp(26px, 3vw, 38px);
      line-height: 1.1;
    }
    span {
      color: var(--sv-muted);
    }
  }
  &__chips {
    display: none;
  }
  &__search {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 50px;
    margin: 18px 0;
    padding: 0 4px 0 14px;
    border-radius: 14px;
    background: var(--sv-surface);
    max-width: 520px;
    > .sv-icon {
      color: var(--sv-muted);
    }
    input {
      flex: 1 1 auto;
      width: 0;
      height: 100%;
      border: 0;
      outline: 0;
      background: none;
      &::-webkit-search-cancel-button {
        display: none;
      }
    }
    .sv-iconbtn {
      width: 40px;
      height: 40px;
      background: #fff;
    }
  }
  &__found {
    margin: -6px 0 14px !important;
    color: var(--sv-muted);
  }
  &__empty {
    display: grid;
    justify-items: start;
    gap: 8px;
    padding: 32px;
    border-radius: var(--sv-R);
    background: var(--sv-surface);
    b {
      font: 800 20px var(--sv-head);
      color: var(--sv-dark);
    }
  }
  &__note {
    margin-top: 24px !important;
    font-size: 13px;
    color: var(--sv-muted);
  }
}
@media (max-width: 989px) {
  .sv-cat {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 0;
    }
    &__side {
      display: none;
    }
    &__chips {
      display: flex;
      gap: 8px;
      margin: 16px -32px 0;
      padding: 0 32px 4px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    &__search {
      max-width: none;
    }
  }
}
@media (max-width: 768px) {
  .sv-cat__chips {
    margin: 14px -16px 0;
    padding: 0 16px 4px;
  }
}
</style>
