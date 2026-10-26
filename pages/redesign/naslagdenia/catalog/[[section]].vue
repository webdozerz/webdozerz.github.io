<script lang="ts" setup>
import type { NsSectionId } from '~/utils/naslagdeniaData'
import NsIcon from '~/components/redesign/naslagdenia/NsIcon.vue'
import NsCard from '~/components/redesign/naslagdenia/NsCard.vue'

const route = useRoute()
const sectionId = computed(() => (route.params.section as NsSectionId | undefined) || null)
const section = computed(() => (sectionId.value ? nsSections.find((s) => s.id === sectionId.value) : null))
if (sectionId.value && !section.value) throw createError({ statusCode: 404, statusMessage: 'Раздел не найден' })

const isCustom = computed(() => section.value?.kind === 'custom')
const sort = ref<'default' | 'cheap' | 'expensive'>('default')
const mark = ref<'all' | 'hit' | 'new'>('all')
const price = ref(0)
watch(sectionId, () => {
  mark.value = 'all'
  price.value = 0
})

const base = computed(() => nsProducts.filter((p) => !sectionId.value || p.section === sectionId.value))
const prices = computed(() => [...new Set(base.value.map((p) => p.price))].sort((a, b) => a - b))
const list = computed(() => {
  let out = base.value
  if (mark.value !== 'all') out = out.filter((p) => p.labels?.includes(mark.value as 'hit' | 'new'))
  if (price.value) out = out.filter((p) => p.price === price.value)
  if (sort.value === 'cheap') out = [...out].sort((a, b) => a.price - b.price)
  if (sort.value === 'expensive') out = [...out].sort((a, b) => b.price - a.price)
  return out
})
const hasMarks = computed(() => base.value.some((p) => p.labels?.some((l) => l === 'hit' || l === 'new')))

const title = computed(() => section.value?.title ?? 'Каталог')
useSeoMeta({ title: () => `${title.value} — кондитерская «Наслаждение» | Концепт редизайна` })
</script>

<template>
  <div class="ns-wrap ns-cat">
    <nav class="ns-crumbs" aria-label="Навигация">
      <NuxtLink :to="nsPath()">Главная</NuxtLink>
      <span>/</span>
      <NuxtLink v-if="section" :to="nsPath('/catalog')">Каталог</NuxtLink>
      <span v-if="section">/</span>
      <span>{{ title }}</span>
    </nav>
    <h1 class="ns-page-title">{{ title }}</h1>
    <p class="ns-page-lead">
      {{ section ? section.lead : `${nsProducts.length} тортов и пирожных: готовые — в магазинах каждый день, заказные — к нужной дате.` }}
    </p>

    <div class="ns-cat__tabs" role="tablist">
      <NuxtLink :to="nsPath('/catalog')" class="ns-chip" :class="{ 'is-on': !section }">
        <span>Все</span>
        <small>{{ nsProducts.length }}</small>
      </NuxtLink>
      <NuxtLink
        v-for="s in nsSections"
        :key="s.id"
        :to="nsPath(`/catalog/${s.id}`)"
        class="ns-chip"
        :class="{ 'is-on': s.id === sectionId }"
      >
        <NsIcon :name="s.icon" :size="18" />
        <span>{{ s.short }}</span>
        <small>{{ nsCount(s.id) }}</small>
      </NuxtLink>
    </div>

    <ul v-if="isCustom" class="ns-cat__rules">
      <li>
        <NsIcon name="scale" :size="20" /><span>Вес — от {{ nsKg(sectionId === 'wedding' ? nsRules.weddingMin : nsRules.customMin) }}</span>
      </li>
      <li><NsIcon name="calendar" :size="20" /><span>Заявка за 3 дня, тяжелее 7 кг — за 7 дней</span></li>
      <li><NsIcon name="slice" :size="20" /><span>Начинка — из наших готовых тортов</span></li>
      <li><NsIcon name="wallet" :size="20" /><span>Предоплата 30&nbsp;% в магазине</span></li>
    </ul>

    <div class="ns-cat__bar">
      <div class="ns-cat__filters">
        <div v-if="hasMarks" class="ns-seg">
          <button type="button" :class="{ 'is-on': mark === 'all' }" @click="mark = 'all'">Все</button>
          <button type="button" :class="{ 'is-on': mark === 'hit' }" @click="mark = 'hit'">Популярные</button>
          <button type="button" :class="{ 'is-on': mark === 'new' }" @click="mark = 'new'">Новинки</button>
        </div>
        <div v-if="isCustom && prices.length > 1" class="ns-seg ns-seg--wrap">
          <button type="button" :class="{ 'is-on': !price }" @click="price = 0">Любая цена</button>
          <button v-for="pr in prices" :key="pr" type="button" :class="{ 'is-on': price === pr }" @click="price = pr">
            {{ nsMoney(pr) }}/кг
          </button>
        </div>
      </div>
      <label class="ns-select ns-cat__sort">
        <select v-model="sort" aria-label="Сортировка">
          <option value="default">Как в магазине</option>
          <option value="cheap">Сначала дешевле</option>
          <option value="expensive">Сначала дороже</option>
        </select>
        <NsIcon name="down" :size="18" />
      </label>
    </div>

    <p class="ns-cat__count">{{ list.length }} {{ nsPlural(list.length, 'позиция', 'позиции', 'позиций') }}</p>
    <div v-if="list.length" class="ns-grid">
      <NsCard v-for="p in list" :key="p.id" :product="p" />
    </div>
    <p v-else class="ns-cat__empty">Ничего не нашлось — сбросьте фильтр.</p>
  </div>
</template>

<style lang="scss">
.ns .ns-cat {
  &__tabs {
    display: flex;
    gap: 8px;
    margin-top: 28px;
    padding-bottom: 4px;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @media (max-width: 768px) {
      margin-right: -20px;
      margin-left: -20px;
      padding-right: 20px;
      padding-left: 20px;
      scroll-padding-inline: 20px;
    }

    @media (max-width: 375px) {
      margin-right: -14px;
      margin-left: -14px;
      padding-right: 14px;
      padding-left: 14px;
    }
  }

  ul.ns-cat__rules {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 28px;
    margin-top: 20px;
    padding: 16px 20px;
    background: var(--ns-surface);
    border-radius: var(--ns-r-card);

    li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--ns-dark);
    }

    .ns-icon {
      flex: none;
      color: var(--ns-accent);
    }
  }

  &__bar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-top: 20px;
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    min-width: 0;
  }

  &__sort {
    flex: none;
    width: 220px;
  }

  &__count {
    margin: 18px 0 14px;
    font-size: 14px;
    color: var(--ns-muted);
  }

  &__empty {
    padding: 40px 0;
    color: var(--ns-muted);
  }

  @media (max-width: 576px) {
    &__filters {
      width: 100%;

      .ns-seg {
        max-width: 100%;
      }

      .ns-seg--wrap {
        flex-wrap: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
      }
    }

    &__sort {
      width: 100%;
    }
  }
}

.ns .ns-chip {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  font-size: 15px;
  font-weight: 500;
  color: var(--ns-dark);
  text-decoration: none;
  white-space: nowrap;
  background: #fff;
  border: 1px solid var(--ns-line-strong);
  border-radius: 999px;

  .ns-icon {
    color: var(--ns-accent);
  }

  small {
    font-size: 13px;
    color: var(--ns-muted);
  }

  &:hover {
    border-color: var(--ns-accent);
  }

  &.is-on {
    color: #fff;
    background: var(--ns-accent);
    border-color: var(--ns-accent);

    .ns-icon,
    small {
      color: rgba(255, 255, 255, 0.85);
    }
  }
}
</style>
