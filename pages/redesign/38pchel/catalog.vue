<script lang="ts" setup>
import PcIcon from '~/components/redesign/38pchel/PcIcon.vue'
import PcCard from '~/components/redesign/38pchel/PcCard.vue'

const route = useRoute()
const router = useRouter()

const section = computed(() => (typeof route.query.s === 'string' ? (route.query.s as PcSectionId) : null))
const q = ref(typeof route.query.q === 'string' ? route.query.q : '')
watch(
  () => route.query.q,
  (v) => (q.value = typeof v === 'string' ? v : ''),
)
const sort = ref<'popular' | 'cheap' | 'expensive' | 'name'>('popular')

const setSection = (id: PcSectionId | null) => {
  router.replace({ query: { ...route.query, s: id ?? undefined } })
}

const list = computed(() => {
  const term = q.value.trim().toLowerCase()
  const items = pcProducts.filter(
    (p) =>
      (!section.value || p.sections.includes(section.value)) &&
      (!term || [p.title, p.lead, p.honey?.taste ?? ''].join(' ').toLowerCase().includes(term)),
  )
  const by = {
    popular: (a: PcProduct, b: PcProduct) => b.reviews - a.reviews,
    cheap: (a: PcProduct, b: PcProduct) => a.base - b.base,
    expensive: (a: PcProduct, b: PcProduct) => b.base - a.base,
    name: (a: PcProduct, b: PcProduct) => a.title.localeCompare(b.title, 'ru'),
  }[sort.value]
  return [...items].sort(by)
})

const title = computed(() => pcSections.find((s) => s.id === section.value)?.title ?? 'Каталог')
const count = (id: PcSectionId) => pcProducts.filter((p) => p.sections.includes(id)).length
</script>

<template>
  <div class="pc-wrap pc-catalog">
    <nav class="pc-crumbs" aria-label="Навигация">
      <NuxtLink :to="pcPath()">Главная</NuxtLink>
      <span>/</span>
      <span>{{ title }}</span>
    </nav>
    <div class="pc-catalog__top">
      <h1 class="pc-title">{{ title }}</h1>
      <span class="pc-catalog__count">{{ list.length }} {{ pcPlural(list.length, 'товар', 'товара', 'товаров') }}</span>
    </div>

    <div class="pc-catalog__bar">
      <div class="pc-catalog__chips">
        <button type="button" class="pc-tag" :class="{ 'is-on': !section }" @click="setSection(null)">Всё · {{ pcProducts.length }}</button>
        <button
          v-for="s in pcSections"
          :key="s.id"
          type="button"
          class="pc-tag"
          :class="{ 'is-on': section === s.id }"
          @click="setSection(s.id)"
        >
          <PcIcon :name="s.icon" :size="18" />
          {{ s.title }} · {{ count(s.id) }}
        </button>
      </div>
      <div class="pc-catalog__tools">
        <label class="pc-catalog__search">
          <PcIcon name="search" :size="20" />
          <input v-model="q" type="search" placeholder="Поиск по каталогу" aria-label="Поиск по каталогу" />
        </label>
        <label class="pc-field pc-catalog__sort">
          <select v-model="sort" aria-label="Сортировка">
            <option value="popular">Сначала с отзывами</option>
            <option value="cheap">Сначала дешевле</option>
            <option value="expensive">Сначала дороже</option>
            <option value="name">По названию</option>
          </select>
        </label>
      </div>
    </div>

    <div v-if="section === 'bees'" class="pc-catalog__note">
      <PcIcon name="hive" />
      <span>Пчелосемьи продаём весной, готовность — начало мая. Запись на сезон по телефону {{ pcContacts.phone }}, без предоплаты.</span>
    </div>

    <div v-if="list.length" class="pc-grid">
      <PcCard v-for="p in list" :key="p.id" :product="p" />
    </div>
    <div v-else class="pc-panel pc-catalog__empty">
      <h2>Ничего не нашли</h2>
      <p>Попробуйте другое слово или позвоните — Сергей подскажет: <a :href="pcContacts.phoneHref">{{ pcContacts.phone }}</a></p>
      <button type="button" class="pc-btn pc-btn--dark" @click="(q = ''), setSection(null)">Показать всё</button>
    </div>
  </div>
</template>

<style lang="scss">
.pc-catalog {
  &__top {
    display: flex;
    align-items: baseline;
    gap: 14px;
  }

  &__count {
    color: var(--pc-muted);
    white-space: nowrap;
  }

  &__bar {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 24px 0 20px;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .pc-tag svg {
      color: var(--pc-accent);
    }

    .pc-tag.is-on svg {
      color: var(--pc-honey);
    }
  }

  &__tools {
    display: flex;
    gap: 10px;
  }

  &__search {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    max-width: 520px;
    height: 48px;
    padding: 0 14px;
    border: 1px solid var(--pc-line-strong);
    border-radius: var(--pc-r);

    input {
      flex: 1;
      min-width: 0;
      border: 0;
      outline: none;
      background: none;
    }

    &:focus-within {
      border-color: var(--pc-ink);
    }
  }

  &__sort {
    width: 240px;
  }

  &__note {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px 18px;
    border-radius: 16px;
    background: var(--pc-honey-soft);

    svg {
      margin-top: 1px;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    a {
      color: var(--pc-accent);
      font-weight: 600;
      white-space: nowrap;
    }
  }

  @media (max-width: 768px) {
    &__chips {
      flex-wrap: nowrap;
      overflow-x: auto;
      margin: 0 -20px;
      padding: 0 20px;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  @media (max-width: 576px) {
    &__tools {
      flex-direction: column;
    }

    &__search {
      max-width: none;
    }

    &__sort {
      width: 100%;
    }
  }

  @media (max-width: 375px) {
    &__chips {
      margin: 0 -14px;
      padding: 0 14px;
    }
  }
}
</style>
