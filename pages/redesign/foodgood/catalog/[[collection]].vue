<script lang="ts" setup>
import PageHead from '~/components/redesign/foodgood/PageHead.vue'
import ProductCard from '~/components/redesign/foodgood/ProductCard.vue'

const route = useRoute()
const slug = computed(() => (route.params.collection as string | undefined) ?? '')

const current = computed(() => fgCollections.find((c) => c.slug === slug.value))
if (!current.value) {
  throw createError({ statusCode: 404, statusMessage: 'Раздел не найден', fatal: true })
}

const query = ref('')

const products = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return fgProducts.filter(
    (p) =>
      (!slug.value || p.collection === slug.value) &&
      (!needle || p.name.toLowerCase().includes(needle)),
  )
})

const counts = computed(() =>
  Object.fromEntries(
    fgCollections.map((c) => [
      c.slug,
      c.slug ? fgProducts.filter((p) => p.collection === c.slug).length : fgProducts.length,
    ]),
  ),
)

useSeoMeta({ title: () => `${current.value?.title} | FoodGood Tomsk` })
</script>

<template>
  <div>
    <PageHead title="Каталог" :crumb="current?.slug ? `Каталог / ${current.title}` : 'Каталог'" />

    <div class="fg-container tools">
      <nav class="chips" aria-label="Разделы каталога">
        <NuxtLink
          v-for="c in fgCollections"
          :key="c.slug"
          :to="fgPath(`/catalog${c.slug ? `/${c.slug}` : ''}`)"
          class="chip"
          :class="{ 'is-active': c.slug === slug }"
        >
          {{ c.title }}
          <span>{{ counts[c.slug] }}</span>
        </NuxtLink>
      </nav>

      <label class="search">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input v-model="query" type="search" placeholder="Поиск по названию" />
      </label>
    </div>

    <div class="fg-container">
      <div v-if="products.length" class="grid">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
      <div v-else class="empty">
        <h2>Ничего не нашлось</h2>
        <p>Попробуйте изменить запрос или выбрать другой раздел.</p>
        <button type="button" @click="query = ''">Сбросить поиск</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid var(--fg-line);
  background: var(--fg-paper);
  font-weight: 700;
  font-size: 14px;
  transition: background 0.15s, border-color 0.15s;

  span {
    font-size: 12px;
    font-weight: 600;
    color: var(--fg-muted);
  }

  &:hover {
    border-color: var(--fg-leaf);
  }

  &.is-active {
    background: var(--fg-forest);
    border-color: var(--fg-forest);
    color: #fff;

    span {
      color: #a9c39c;
    }
  }
}

.search {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 280px;
  padding: 0 16px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid var(--fg-line);
  background: var(--fg-paper);
  color: var(--fg-muted);

  &:focus-within {
    border-color: var(--fg-leaf);
  }

  input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    font: inherit;
    color: var(--fg-ink);
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.empty {
  padding: 64px 16px;
  text-align: center;

  h2 {
    font-size: 28px;
  }
  p {
    margin: 10px 0 20px;
    color: var(--fg-muted);
  }
  button {
    padding: 10px 22px;
    border-radius: 999px;
    border: 2px solid var(--fg-forest);
    background: transparent;
    font-weight: 700;
    color: var(--fg-forest);
  }
}

@media (max-width: 1000px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .search {
    width: 100%;
    min-width: 0;
  }
}
</style>
