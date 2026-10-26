<script lang="ts" setup>
import MrIcon from '~/components/redesign/mnerozy/MrIcon.vue'
import MrCard from '~/components/redesign/mnerozy/MrCard.vue'

const route = useRoute()
const router = useRouter()

const secId = computed(() => String(route.params.sec ?? ''))
const section = computed(() => (secId.value ? mrFindSection(secId.value) : undefined))
const q = computed(() => String(route.query.q ?? '').trim())
const sort = computed(() => String(route.query.sort ?? 'best'))
const price = computed(() => String(route.query.price ?? ''))
const promo = computed(() => route.query.promo === '1')

const title = computed(() => (q.value ? `Поиск: «${q.value}»` : (section.value?.title ?? 'Каталог')))
useSeoMeta({ title: () => `${title.value} — Мне розы | Концепт редизайна` })

// Сортировка — как у оригинала (лучшие, дешевле, дороже); цена и «Акции» — фильтры концепта.
const sorts = [
  { id: 'best', title: 'Лучшие' },
  { id: 'cheap', title: 'Сначала дешевле' },
  { id: 'expensive', title: 'Сначала дороже' },
]
const prices = [
  { id: 'to2', title: 'до 2 000 ₽', min: 0, max: 2000 },
  { id: '2-5', title: '2–5 тыс.', min: 2000, max: 5000 },
  { id: '5-10', title: '5–10 тыс.', min: 5000, max: 10000 },
  { id: 'from10', title: 'от 10 тыс.', min: 10000, max: Infinity },
]

const base = computed(() => {
  return mrProducts.filter((x) => {
    if (q.value && !mrMatch(`${x.title} ${x.short ?? ''}`, q.value)) return false
    if (section.value && x.sec !== section.value.id) return false
    return true
  })
})
const list = computed(() => {
  const band = prices.find((x) => x.id === price.value)
  let out = base.value.filter((x) => {
    if (band && (x.price < band.min || x.price >= band.max)) return false
    if (promo.value && !x.promo) return false
    return true
  })
  if (sort.value === 'cheap') out = [...out].sort((a, b) => a.price - b.price)
  if (sort.value === 'expensive') out = [...out].sort((a, b) => b.price - a.price)
  return out
})
const hasPromo = computed(() => base.value.some((x) => x.promo))

const setQuery = (patch: Record<string, string | undefined>) => {
  const next = { ...route.query, ...patch }
  for (const k of Object.keys(next)) if (!next[k]) delete next[k]
  router.replace({ query: next })
}
const resetFilters = () => setQuery({ price: undefined, promo: undefined })
</script>

<template>
  <div class="mr-wrap mr-cat">
    <nav class="mr-crumbs" aria-label="Навигация">
      <NuxtLink :to="mrPath()">Главная</NuxtLink>
      <span v-if="section || q"><NuxtLink :to="mrPath('/catalog')">Каталог</NuxtLink></span>
      <span v-else>Каталог</span>
    </nav>

    <div class="mr-cat__head">
      <h1>{{ title }}</h1>
      <p v-if="section">
        {{ section.count }} {{ mrPlural(section.count, 'товар', 'товара', 'товаров') }} на сайте · в концепте первые {{ base.length }}
      </p>
      <p v-else-if="q">{{ list.length }} {{ mrPlural(list.length, 'товар', 'товара', 'товаров') }}</p>
      <p v-else>{{ mrTotalProducts }} товаров на сайте · в концепте по 15 из каждого раздела</p>
    </div>

    <div class="mr-cat__secs">
      <NuxtLink :to="mrPath('/catalog')" class="mr-chip" :class="{ 'is-on': !section && !q }">Все</NuxtLink>
      <NuxtLink
        v-for="s in mrSections"
        :key="s.id"
        :to="mrPath(`/catalog/${s.id}`)"
        class="mr-chip"
        :class="{ 'is-on': section?.id === s.id }"
      >
        {{ s.short }} <small>{{ s.count }}</small>
      </NuxtLink>
    </div>

    <NuxtLink v-if="section?.id === 'rose' || section?.id === 'ohapki-cvetov'" :to="mrPath('/roses')" class="mr-cat__stems">
      <img :src="mrStems.colors[3].img" alt="" width="96" height="96" />
      <span>
        <b>Охапка роз Эквадор поштучно</b>
        <small>15 роз — по 169 ₽, от 25 — по 139 ₽, от 51 — по 99 ₽. Выберите число, цвет и длину — сумма посчитается сразу.</small>
      </span>
      <MrIcon name="arrow" />
    </NuxtLink>

    <div class="mr-cat__bar">
      <div class="mr-cat__filters">
        <button
          v-for="b in prices"
          :key="b.id"
          type="button"
          class="mr-chip"
          :class="{ 'is-on': price === b.id }"
          @click="setQuery({ price: price === b.id ? undefined : b.id })"
        >
          {{ b.title }}
        </button>
        <button v-if="hasPromo" type="button" class="mr-chip" :class="{ 'is-on': promo }" @click="setQuery({ promo: promo ? undefined : '1' })">
          Акции
        </button>
      </div>
      <label class="mr-cat__sort">
        <MrIcon name="sort" :size="18" />
        <select :value="sort" aria-label="Сортировка" @change="setQuery({ sort: ($event.target as HTMLSelectElement).value === 'best' ? undefined : ($event.target as HTMLSelectElement).value })">
          <option v-for="s in sorts" :key="s.id" :value="s.id">{{ s.title }}</option>
        </select>
      </label>
    </div>

    <div v-if="list.length" class="mr-grid">
      <MrCard v-for="p in list" :key="p.id" :p="p" />
    </div>
    <div v-else class="mr-cat__empty">
      <p>По этим условиям товаров нет.</p>
      <button v-if="price || promo" type="button" class="mr-btn mr-btn--line" @click="resetFilters">Сбросить фильтры</button>
      <a v-else :href="mrContacts.whatsapp" target="_blank" rel="noopener" class="mr-btn mr-btn--line">Спросить флориста в WhatsApp</a>
    </div>

    <p v-if="section && section.count > base.length" class="mr-cat__more">
      Остальные {{ section.count - base.length }} {{ mrPlural(section.count - base.length, 'товар', 'товара', 'товаров') }} раздела — на
      <a :href="mrContacts.original" target="_blank" rel="noopener">сайте магазина</a>. Концепт показывает часть ассортимента.
    </p>
  </div>
</template>

<style lang="scss" scoped>
.mr-cat {
  &__head {
    display: grid;
    gap: 6px;
    padding: 14px 0 20px;

    h1 {
      font-size: 34px;
    }

    p {
      color: var(--mr-muted);
    }
  }

  &__secs {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 8px;
    margin-bottom: 14px;
    scrollbar-width: none;
    mask-image: linear-gradient(90deg, #000 94%, transparent);
  }

  &__stems {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    padding: 12px 20px 12px 12px;
    border-radius: var(--mr-r-card);
    background: var(--mr-accent-soft);

    img {
      flex: none;
      width: 72px;
      height: 72px;
      border-radius: var(--mr-r);
      object-fit: cover;
    }

    span {
      display: grid;
      gap: 2px;
      flex: 1;
      min-width: 0;
    }

    b {
      font-size: 17px;
      font-weight: 800;
    }

    small {
      color: var(--mr-muted);
      font-size: 13px;
    }

    > svg {
      flex: none;
      color: var(--mr-accent);
    }
  }

  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 24px;
  }

  &__filters {
    display: flex;
    gap: 6px;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }

  &__sort {
    position: relative;
    flex: none;
    display: flex;
    align-items: center;

    svg {
      position: absolute;
      left: 12px;
      pointer-events: none;
    }

    select {
      appearance: none;
      height: 40px;
      padding: 0 36px 0 38px;
      border-radius: var(--mr-r);
      border: 1px solid var(--mr-line-strong);
      background: #fff
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23202124' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E")
        no-repeat right 12px center;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
  }

  &__empty {
    display: grid;
    justify-items: start;
    gap: 14px;
    padding: 40px 0;
    color: var(--mr-muted);
  }

  &__more {
    margin-top: 36px;
    color: var(--mr-muted);
    font-size: 14px;

    a {
      color: var(--mr-accent);
      font-weight: 600;
    }
  }
}

@media (max-width: 768px) {
  .mr-cat {
    &__head h1 {
      font-size: 28px;
    }

    &__bar {
      flex-direction: column-reverse;
      align-items: stretch;
    }

    &__sort select {
      width: 100%;
    }
  }
}

@media (max-width: 576px) {
  .mr-cat {
    &__head h1 {
      font-size: 24px;
    }

    &__stems {
      align-items: flex-start;
      padding: 10px;

      img {
        width: 56px;
        height: 56px;
      }

      > svg {
        display: none;
      }
    }
  }
}
</style>
