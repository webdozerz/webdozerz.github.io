<script lang="ts" setup>
import FtCard from '~/components/redesign/fermertomska/FtCard.vue'
import FtIcon from '~/components/redesign/fermertomska/FtIcon.vue'

const route = useRoute()
const cart = useFermertomskaCart()

const cat = computed(() => (route.params.cat as string) || '')
const section = computed(() => ftSections.find((s) => s.id === cat.value) ?? null)
const tag = computed(() => (['new', 'hit', 'sale'].includes(cat.value) ? (cat.value as FtTag) : null))
const query = computed(() => ((route.query.q as string) || '').trim())
const favOnly = computed(() => route.query.fav === '1')

const title = computed(() => {
  if (favOnly.value) return 'Избранное'
  if (query.value) return `Поиск: «${query.value}»`
  if (section.value) return section.value.title
  if (tag.value) return ftTagTitles[tag.value]
  return 'Все товары'
})

useSeoMeta({ title: () => `${title.value} | Куендатское, концепт редизайна` })

// Границы цены — по товарам текущего раздела.
const priceBounds = computed(() => {
  const list = ftProducts.filter((p) => !section.value || ftFamilyOf(p.family).section === section.value.id)
  return {
    min: Math.floor(Math.min(...list.map((p) => p.price))),
    max: Math.ceil(Math.max(...list.map((p) => p.price))),
  }
})
const priceFrom = ref<number | null>(null)
const priceTo = ref<number | null>(null)
const inStock = ref(false)
const sort = ref<'popular' | 'cheap' | 'expensive' | 'new' | 'name'>('popular')
const filtersOpen = ref(false)

// Шторка фильтров закрывает страницу — фон не прокручивается.
watch(filtersOpen, (open) => document.documentElement.classList.toggle('ft-locked', open))
onBeforeUnmount(() => document.documentElement.classList.remove('ft-locked'))

const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е')

const items = computed(() => {
  let list = ftFamilies.slice()
  if (section.value) list = list.filter((f) => f.section === section.value!.id)
  if (tag.value) list = list.filter((f) => ftHasTag(f.id, tag.value!))
  if (favOnly.value) list = list.filter((f) => cart.isFav(f.id))
  if (query.value) {
    const q = norm(query.value)
    list = list.filter((f) => norm(`${f.title} ${ftSectionOf(f.section).title} ${f.text}`).includes(q))
  }
  if (priceFrom.value) list = list.filter((f) => ftVariantsOf(f.id).some((p) => p.price >= priceFrom.value!))
  if (priceTo.value) list = list.filter((f) => ftMinPrice(f.id) <= priceTo.value!)
  // На оригинале все позиции в наличии: фильтр оставлен, как у InSales.
  if (inStock.value) list = list.filter((f) => ftVariantsOf(f.id).length > 0)

  const sorted = list.slice()
  if (sort.value === 'cheap') sorted.sort((a, b) => ftMinPrice(a.id) - ftMinPrice(b.id))
  if (sort.value === 'expensive') sorted.sort((a, b) => ftMinPrice(b.id) - ftMinPrice(a.id))
  if (sort.value === 'name') sorted.sort((a, b) => a.title.localeCompare(b.title, 'ru'))
  if (sort.value === 'new') sorted.sort((a, b) => Number(ftHasTag(b.id, 'new')) - Number(ftHasTag(a.id, 'new')))
  if (sort.value === 'popular') sorted.sort((a, b) => Number(ftHasTag(b.id, 'hit')) - Number(ftHasTag(a.id, 'hit')))
  return sorted
})

const variantsCount = computed(() => items.value.reduce((n, f) => n + ftVariantsOf(f.id).length, 0))
const activeFilters = computed(() => Number(Boolean(priceFrom.value)) + Number(Boolean(priceTo.value)) + Number(inStock.value))

const reset = () => {
  priceFrom.value = null
  priceTo.value = null
  inStock.value = false
}

const chips = [
  { to: ftPath('/catalog'), label: 'Все', id: '' },
  ...ftSections.map((s) => ({ to: ftPath(`/catalog/${s.id}`), label: s.title, id: s.id as string })),
]
const tagChips = (['new', 'hit', 'sale'] as FtTag[]).map((t) => ({ to: ftPath(`/catalog/${t}`), label: ftTagTitles[t], id: t }))
</script>

<template>
  <div class="ft-wrap ft-catalog">
    <nav class="ft-crumbs" aria-label="Навигация">
      <NuxtLink :to="ftPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink v-if="cat || query || favOnly" :to="ftPath('/catalog')">Каталог</NuxtLink>
      <span v-else>Каталог</span>
      <template v-if="cat || query || favOnly">
        <span aria-hidden="true">/</span>
        <span>{{ title }}</span>
      </template>
    </nav>

    <div class="ft-catalog__head">
      <h1 class="ft-h1">{{ title }}</h1>
      <span class="ft-catalog__count">{{ items.length }} {{ items.length === 1 ? 'товар' : items.length < 5 && items.length ? 'товара' : 'товаров' }} · {{ variantsCount }} фасовок</span>
    </div>

    <div class="ft-catalog__chips">
      <NuxtLink
        v-for="c in chips"
        :key="c.id"
        :to="c.to"
        :class="{ 'is-on': c.id === cat && !query && !favOnly }"
      >
        {{ c.label }}
      </NuxtLink>
      <span class="ft-catalog__sep" aria-hidden="true" />
      <NuxtLink v-for="c in tagChips" :key="c.id" :to="c.to" :class="{ 'is-on': c.id === cat }">{{ c.label }}</NuxtLink>
    </div>

    <div class="ft-catalog__layout">
      <div v-if="filtersOpen" class="ft-filters-backdrop" @click="filtersOpen = false" />
      <aside class="ft-filters" :class="{ 'is-open': filtersOpen }" aria-label="Фильтры">
        <div class="ft-filters__head">
          <strong>Фильтры</strong>
          <button type="button" class="ft-iconbtn" aria-label="Закрыть фильтры" @click="filtersOpen = false">
            <FtIcon name="close" />
          </button>
        </div>
        <div class="ft-filters__group">
          <strong>Цена, ₽</strong>
          <div class="ft-filters__price">
            <label class="ft-field"><span class="ft-sr">Цена от</span><input v-model.number="priceFrom" type="number" inputmode="numeric" :placeholder="`от ${priceBounds.min}`" min="0" /></label>
            <label class="ft-field"><span class="ft-sr">Цена до</span><input v-model.number="priceTo" type="number" inputmode="numeric" :placeholder="`до ${priceBounds.max}`" min="0" /></label>
          </div>
        </div>
        <div class="ft-filters__group">
          <label class="ft-check"><input v-model="inStock" type="checkbox" /> Только в наличии</label>
          <span class="ft-filters__hint">Производитель: ПСПК «Куендатский», Россия</span>
        </div>
        <button v-if="activeFilters" type="button" class="ft-btn ft-btn--ghost ft-btn--block" @click="reset">Сбросить фильтры</button>
        <button type="button" class="ft-btn ft-btn--block ft-filters__apply" @click="filtersOpen = false">Показать {{ items.length }}</button>
      </aside>

      <div class="ft-catalog__main">
        <div class="ft-catalog__bar">
          <button type="button" class="ft-btn ft-btn--ghost ft-catalog__filterbtn" :aria-expanded="filtersOpen" @click="filtersOpen = !filtersOpen">
            Фильтры<template v-if="activeFilters"> · {{ activeFilters }}</template>
          </button>
          <label class="ft-field ft-catalog__sort">
            <span class="ft-sr">Сортировка</span>
            <select v-model="sort">
              <option value="popular">Сначала хиты</option>
              <option value="cheap">Сначала дешевле</option>
              <option value="expensive">Сначала дороже</option>
              <option value="new">Сначала новинки</option>
              <option value="name">По названию</option>
            </select>
          </label>
        </div>

        <div v-if="items.length" class="ft-grid ft-grid--catalog">
          <FtCard v-for="f in items" :key="f.id" :family="f" />
        </div>
        <div v-else class="ft-catalog__empty">
          <FtIcon :name="favOnly ? 'heart' : 'search'" :size="32" />
          <p v-if="favOnly">В избранном пока пусто. Нажмите на сердечко на фото товара.</p>
          <p v-else>Ничего не нашли. Попробуйте другой запрос или позвоните: <a :href="ftContacts.phoneHref">{{ ftContacts.phone }}</a></p>
          <NuxtLink :to="ftPath('/catalog')" class="ft-btn ft-btn--soft">Все товары</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ft .ft-catalog {
  padding-bottom: 32px;

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 8px 16px;
  }

  &__count {
    color: var(--ft-muted);
    font-weight: 700;
  }

  &__chips {
    display: flex;
    gap: 8px;
    margin: 20px 0 28px;
    overflow-x: auto;
    scrollbar-width: none;

    a {
      flex-shrink: 0;
      padding: 10px 16px;
      border-radius: 14px;
      background: var(--ft-surface);
      font-weight: 800;
      white-space: nowrap;
      transition:
        background-color 0.15s,
        color 0.15s;

      &:hover {
        background: #e2eaf3;
      }

      &.is-on {
        background: var(--ft-ink);
        color: #fff;
      }
    }
  }

  &__sep {
    flex-shrink: 0;
    width: 1px;
    margin: 6px 4px;
    background: var(--ft-line);
  }

  &__layout {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
    align-items: start;
    gap: 32px;
  }

  &__bar {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 20px;
  }

  &__filterbtn {
    display: none;
  }

  &__sort {
    width: 220px;
  }

  &__empty {
    display: grid;
    justify-items: center;
    gap: 14px;
    padding: 48px 16px;
    border-radius: var(--ft-r-lg);
    background: var(--ft-surface-2);
    color: var(--ft-muted);
    text-align: center;

    a:not(.ft-btn) {
      color: var(--ft-accent);
      font-weight: 800;
    }
  }

  @media (max-width: 989px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }

    &__bar {
      justify-content: space-between;
    }

    &__filterbtn {
      display: inline-flex;
    }
  }

  @media (max-width: 576px) {
    &__chips {
      margin: 16px -16px 20px;
      padding: 0 16px;
    }

    &__sort {
      width: auto;
      flex: 1;
    }
  }
}

.ft .ft-grid--catalog {
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.ft .ft-filters-backdrop {
  display: none;

  @media (max-width: 989px) {
    position: fixed;
    inset: 0;
    z-index: 69;
    display: block;
    background: rgba(29, 43, 74, 0.35);
  }
}

.ft .ft-filters {
  position: sticky;
  top: calc(var(--ft-header) + 20px);
  display: grid;
  gap: 20px;
  padding: 20px;
  border-radius: var(--ft-r-lg);
  background: var(--ft-surface-2);

  &__group {
    display: grid;
    gap: 10px;

    strong {
      font-weight: 900;
    }
  }

  &__price {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    input {
      padding: 10px 12px;
    }
  }

  &__hint {
    color: var(--ft-muted);
    font-size: 13px;
  }

  &__apply,
  &__head {
    display: none;
  }

  &__head {
    align-items: center;
    justify-content: space-between;

    strong {
      font-size: 22px;
      font-weight: 900;
    }
  }

  // На планшете и телефоне — шторка снизу, страница под ней не прыгает.
  @media (max-width: 989px) {
    position: fixed;
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 70;
    display: none;
    max-height: 80vh;
    overflow-y: auto;
    padding: 24px 20px calc(20px + env(safe-area-inset-bottom));
    border-radius: var(--ft-r-lg) var(--ft-r-lg) 0 0;
    background: #fff;
    box-shadow: 0 -12px 40px rgba(29, 43, 74, 0.2);

    &.is-open {
      display: grid;
    }

    &__apply {
      display: inline-flex;
    }

    &__head {
      display: flex;
    }
  }
}
</style>
