<script lang="ts" setup>
import FgCard from '~/components/redesign/foodgood/FgCard.vue'

const route = useRoute()
const router = useRouter()

type Sort = 'default' | 'cheap' | 'expensive'
const sorts: { id: Sort; title: string }[] = [
  { id: 'default', title: 'Как в магазине' },
  { id: 'cheap', title: 'Сначала дешевле' },
  { id: 'expensive', title: 'Сначала дороже' },
]
const sort = ref<Sort>('default')

const slug = computed(() => (typeof route.params.cat === 'string' ? route.params.cat : ''))
const category = computed(() => fgCategories.find((c) => c.id === slug.value))
const isSale = computed(() => slug.value === 'sale')
const query = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))

const title = computed(() => {
  if (query.value) return `Поиск: «${query.value}»`
  if (isSale.value) return 'Скидки'
  return category.value?.title ?? 'Все товары'
})

const items = computed(() => {
  let list = query.value
    ? fgSearch(query.value)
    : isSale.value
      ? fgSale()
      : category.value
        ? fgOf(category.value.id)
        : fgProducts
  if (sort.value !== 'default') {
    const dir = sort.value === 'cheap' ? 1 : -1
    list = [...list].sort((a, b) => (a.price - b.price) * dir)
  }
  return list
})

const links = computed(() => [
  { to: fgPath('/catalog'), title: 'Все товары', count: fgProducts.length, active: !slug.value && !query.value },
  ...fgCategories.map((c) => ({
    to: fgPath(`/catalog/${c.id}`),
    title: c.short,
    count: fgOf(c.id).length,
    active: slug.value === c.id && !query.value,
  })),
  { to: fgPath('/catalog/sale'), title: 'Скидки', count: fgSale().length, active: isSale.value && !query.value, sale: true },
])

// На телефоне разделы — горизонтальная лента: подкручиваем её к активному разделу.
const nav = ref<HTMLElement>()
const centerActive = () =>
  nextTick(() => {
    const el = nav.value
    const active = el?.querySelector<HTMLElement>('.is-active')
    if (!el || !active || el.scrollWidth <= el.clientWidth) return
    el.scrollLeft = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2
  })
onMounted(centerActive)
watch(() => route.fullPath, centerActive)

const clearQuery = () => router.push({ path: route.path })

useSeoMeta({ title: () => `${title.value} | FoodGood Tomsk` })
</script>

<template>
  <div class="fg-wrap">
    <div class="fg-page-head">
      <nav class="fg-crumbs" aria-label="Навигация">
        <NuxtLink :to="fgPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <NuxtLink :to="fgPath('/catalog')">Каталог</NuxtLink>
      </nav>
      <h1>{{ title }}</h1>
    </div>

    <div class="cat">
      <aside class="cat__side">
        <nav ref="nav" class="cat__nav" aria-label="Разделы каталога">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            :class="{ 'is-active': l.active, 'is-sale': l.sale }"
          >
            <span>{{ l.title }}</span>
            <small>{{ l.count }}</small>
          </NuxtLink>
        </nav>
      </aside>

      <div class="cat__main">
        <div class="cat__bar">
          <p class="fg-muted">
            {{ fgGoods(items.length) }}
            <button v-if="query" type="button" class="cat__clear" @click="clearQuery">
              Сбросить поиск
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </p>
          <label class="cat__sort">
            <span class="fg-muted">Сортировка</span>
            <select v-model="sort">
              <option v-for="s in sorts" :key="s.id" :value="s.id">{{ s.title }}</option>
            </select>
          </label>
        </div>

        <div v-if="items.length" class="fg-grid cat__grid">
          <FgCard v-for="(p, i) in items" :key="p.id" :product="p" :eager="i < 8" />
        </div>
        <div v-else class="fg-panel cat__empty">
          <h2>Ничего не нашли</h2>
          <p>
            Попробуйте другое слово или напишите нам в мессенджер — подскажем, будет ли товар в
            следующей поставке.
          </p>
          <NuxtLink :to="fgPath('/contacts')" class="fg-btn fg-btn--primary">Написать в магазин</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cat {
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr);
  gap: 32px;
  align-items: start;

  &__side {
    position: sticky;
    top: 140px;
  }

  &__nav {
    display: grid;
    gap: 2px;

    a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 42px;
      padding: 0 12px;
      border-radius: 10px;
      transition: background-color 0.15s;

      &:hover {
        background: var(--fg-sage);
      }

      &.is-active {
        background: var(--fg-leaf-soft);
        font-weight: 600;
      }

      &.is-sale span {
        color: var(--fg-sale-d);
        font-weight: 600;
      }
    }

    small {
      color: var(--fg-muted);
      font-size: 14px;
      font-variant-numeric: tabular-nums;
    }
  }

  &__bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;

    p {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  &__clear {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 8px;
    background: var(--fg-sage);
    color: var(--fg-ink);
    font-size: 14px;

    &:hover {
      background: var(--fg-sage-2);
    }
  }

  &__sort {
    display: flex;
    align-items: center;
    gap: 10px;

    select {
      min-height: 42px;
      padding: 0 40px 0 14px;
      border: 1px solid var(--fg-line);
      border-radius: 10px;
      background: #fff
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2312261a' stroke-width='2' stroke-linecap='round' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")
        no-repeat right 14px center;
      appearance: none;
      cursor: pointer;
    }
  }

  &__empty {
    display: grid;
    justify-items: start;
    gap: 12px;

    p {
      max-width: 520px;
      color: var(--fg-muted);
    }
  }
}

@media (max-width: 860px) {
  .cat {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;

    &__side {
      position: sticky;
      top: 110px;
      z-index: 5;
      margin-inline: -16px;
      padding: 8px 0;
      min-width: 0;
      background: #fff;
    }

    &__nav {
      position: relative;
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-inline: 16px;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      a {
        flex-shrink: 0;
        min-height: 40px;
        gap: 6px;
        background: var(--fg-sage);
        white-space: nowrap;
      }
    }

    &__sort > span {
      display: none;
    }
  }

  .fg-page-head {
    padding-bottom: 4px;
  }
}
</style>
