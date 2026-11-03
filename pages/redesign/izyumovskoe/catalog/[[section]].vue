<script lang="ts" setup>
// Каталог: раздел → группа → порода (3 уровня, как у оригинала), расширенный поиск (название, цена от/до, наличие, новинки),
// сортировка по названию и цене, вид плиткой или списком.
import IzIcon from '~/components/redesign/izyumovskoe/IzIcon.vue'
import IzCard from '~/components/redesign/izyumovskoe/IzCard.vue'

const route = useRoute()
const router = useRouter()

const section = computed(() => izSection(String(route.params.section ?? '')) ?? null)
useSeoMeta({ title: () => `${section.value?.title ?? 'Каталог'} — Изюмовское | Концепт редизайна` })

const g = computed(() => String(route.query.g ?? ''))
const tops = computed(() => izGroups.filter((x) => x.section === section.value?.id && !x.parent))
const activeTop = computed(() => {
  const x = izGroup(g.value)
  return x?.parent ?? x?.id ?? ''
})
const kids = computed(() => izGroups.filter((x) => x.parent === activeTop.value))

const text = ref(String(route.query.q ?? ''))
const from = ref<number | null>(null)
const to = ref<number | null>(null)
const onlyStock = ref(false)
const onlyNew = ref(false)
const sort = ref<'default' | 'name' | 'price-up' | 'price-down'>('default')
const view = ref<'grid' | 'rows'>('grid')
const filtersOpen = ref(false)
watch(
  () => route.query.q,
  (v) => {
    text.value = String(v ?? '')
  },
)

const list = computed(() => {
  const s = text.value.trim().toLowerCase()
  let r = izProducts.filter((p) => {
    if (section.value && p.section !== section.value.id) return false
    if (g.value && !izInGroup(p, g.value)) return false
    if (s && !p.title.toLowerCase().includes(s) && !p.lead.toLowerCase().includes(s)) return false
    if (onlyStock.value && !p.stock) return false
    if (onlyNew.value && !p.isNew && !p.label) return false
    if (from.value && (p.price === null || p.price < from.value)) return false
    if (to.value && (p.price === null || p.price > to.value)) return false
    return true
  })
  const price = (p: IzProduct) => p.price ?? Infinity
  if (sort.value === 'name') r = [...r].sort((a, b) => a.title.localeCompare(b.title, 'ru'))
  if (sort.value === 'price-up') r = [...r].sort((a, b) => price(a) - price(b))
  if (sort.value === 'price-down') r = [...r].sort((a, b) => (b.price ?? -1) - (a.price ?? -1))
  // по умолчанию — сначала то, что можно купить сейчас
  if (sort.value === 'default') r = [...r].sort((a, b) => Number(b.stock) - Number(a.stock) || Number(b.price !== null) - Number(a.price !== null))
  return r
})
const active = computed(() => [text.value, from.value, to.value, onlyStock.value, onlyNew.value].filter(Boolean).length)
const reset = () => {
  text.value = ''
  from.value = null
  to.value = null
  onlyStock.value = false
  onlyNew.value = false
  if (route.query.q) router.replace({ query: { ...route.query, q: undefined } })
}
const groupTo = (id?: string) => ({ path: route.path, query: id ? { g: id } : {} })
const title = computed(() => (g.value ? izGroup(g.value)?.title : section.value?.title) ?? 'Все товары')
</script>

<template>
  <div class="iz-wrap">
    <nav class="iz-crumbs" aria-label="Путь">
      <NuxtLink :to="izPath()">Главная</NuxtLink>
      <span><NuxtLink :to="izPath('/catalog')">Каталог</NuxtLink></span>
      <span v-if="section"><NuxtLink :to="izPath(`/catalog/${section.id}`)">{{ section.title }}</NuxtLink></span>
    </nav>
    <div class="iz-cat__top">
      <h1 class="iz-page-title">
        {{ title }} <small>{{ list.length }}</small>
      </h1>
    </div>

    <div class="iz-cat__sections">
      <NuxtLink :to="izPath('/catalog')" :class="{ 'is-on': !section }">Все</NuxtLink>
      <NuxtLink v-for="s in izSections" :key="s.id" :to="izPath(`/catalog/${s.id}`)" :class="{ 'is-on': section?.id === s.id }">
        <img :src="izImg(s.icon)" alt="" width="28" height="28" />{{ s.short }}
      </NuxtLink>
    </div>
    <div v-if="tops.length > 1" class="iz-cat__groups">
      <NuxtLink :to="groupTo()" :class="{ 'is-on': !g }">Все</NuxtLink>
      <NuxtLink v-for="t in tops" :key="t.id" :to="groupTo(t.id)" :class="{ 'is-on': activeTop === t.id }">{{ t.title }}</NuxtLink>
    </div>
    <div v-if="kids.length" class="iz-cat__groups iz-cat__groups--kids">
      <NuxtLink :to="groupTo(activeTop)" :class="{ 'is-on': g === activeTop }">Все породы</NuxtLink>
      <NuxtLink v-for="k in kids" :key="k.id" :to="groupTo(k.id)" :class="{ 'is-on': g === k.id }">{{ k.title }}</NuxtLink>
    </div>

    <div class="iz-cat">
      <div v-if="filtersOpen" class="iz-cat__shade" @click="filtersOpen = false" />
      <aside class="iz-cat__filters" :class="{ 'is-open': filtersOpen }">
        <div class="iz-cat__fhead">
          <b>Расширенный поиск</b>
          <button type="button" class="iz-iconbtn iz-cat__fclose" aria-label="Закрыть" @click="filtersOpen = false"><IzIcon name="close" /></button>
        </div>
        <div class="iz-form">
          <label>Название<input v-model="text" type="search" placeholder="Например, утка" /></label>
          <div class="iz-cat__range">
            <label>Цена от, ₽<input v-model.number="from" type="number" min="0" inputmode="numeric" /></label>
            <label>до, ₽<input v-model.number="to" type="number" min="0" inputmode="numeric" /></label>
          </div>
          <label class="iz-check"><input v-model="onlyStock" type="checkbox" /><span>Только в наличии</span></label>
          <label class="iz-check"><input v-model="onlyNew" type="checkbox" /><span>Новинки и хиты</span></label>
          <button v-if="active" type="button" class="iz-btn iz-btn--line iz-btn--wide" @click="reset">Сбросить · {{ active }}</button>
          <button type="button" class="iz-btn iz-btn--main iz-btn--wide iz-cat__fshow" @click="filtersOpen = false">Показать {{ list.length }}</button>
        </div>
        <p class="iz-cat__hint">«Цена по запросу» — уточняем по телефону {{ izContacts.phones[0] }}: на эти позиции цена зависит от партии.</p>
      </aside>

      <div class="iz-cat__main">
        <div class="iz-cat__bar">
          <button type="button" class="iz-btn iz-btn--line iz-cat__fbtn" @click="filtersOpen = true">
            <IzIcon name="filter" :size="18" />Фильтры<template v-if="active"> · {{ active }}</template>
          </button>
          <label class="iz-select">
            <span>Сортировка</span>
            <select v-model="sort">
              <option value="default">В наличии</option>
              <option value="name">По названию</option>
              <option value="price-up">Дешевле</option>
              <option value="price-down">Дороже</option>
            </select>
          </label>
          <div class="iz-seg iz-cat__view">
            <button type="button" :class="{ 'is-on': view === 'grid' }" aria-label="Плиткой" @click="view = 'grid'"><IzIcon name="grid" :size="18" /></button>
            <button type="button" :class="{ 'is-on': view === 'rows' }" aria-label="Списком" @click="view = 'rows'"><IzIcon name="rows" :size="18" /></button>
          </div>
        </div>

        <p v-if="section?.id === 'molodnyak'" class="iz-note iz-note--warn iz-cat__note">
          Молодняк продаём от 10 голов и не возим — заберите на ферме в {{ izContacts.short }}.
        </p>
        <p v-if="section?.id === 'govyadina'" class="iz-note iz-note--warn iz-cat__note">
          Говядина «Герефорд» на зерновом откорме. Цену и вес куска назовём по телефону — положите в корзину, мы перезвоним.
        </p>

        <div v-if="list.length" :class="view === 'grid' ? 'iz-grid iz-cat__grid' : 'iz-cat__rows'">
          <IzCard v-for="p in list" :key="p.id" :p="p" :row="view === 'rows'" />
        </div>
        <div v-else class="iz-cat__empty">
          <b>Ничего не нашли</b>
          <p>Попробуйте убрать фильтры или позвоните — подскажем, что есть на ферме сейчас.</p>
          <button type="button" class="iz-btn iz-btn--main" @click="reset">Сбросить фильтры</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.iz-cat {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 28px;
  margin-top: 22px;

  &__sections,
  &__groups {
    display: flex;
    gap: 8px;
    margin-top: 18px;
    overflow-x: auto;
    scrollbar-width: none;

    a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex: none;
      height: 44px;
      padding: 0 16px;
      border-radius: 12px;
      background: var(--iz-surface);
      font-weight: 500;
      color: var(--iz-dark);
      white-space: nowrap;

      &:hover {
        background: var(--iz-soft);
      }
      &.is-on {
        background: var(--iz-accent);
      }
    }
    img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #fff;
      object-fit: contain;
      padding: 2px;
    }
  }
  &__sections a {
    padding-left: 10px;
  }
  &__sections a:first-child {
    padding-left: 16px;
  }
  &__groups {
    margin-top: 10px;

    a {
      height: 38px;
      padding: 0 14px;
      background: #fff;
      border: 1px solid var(--iz-line);

      &.is-on {
        border-color: var(--iz-accent);
        background: var(--iz-soft);
      }
    }
  }
  &__groups--kids a {
    height: 34px;
    font-size: 14px;
    font-weight: 400;
  }

  &__filters {
    align-self: start;
    position: sticky;
    top: 100px;
    display: grid;
    gap: 16px;
    padding: 20px;
    border-radius: var(--iz-R);
    background: var(--iz-surface);

    .iz-form input:not([type='checkbox']) {
      min-height: 44px;
    }
  }
  &__fhead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 32px;

    b {
      font-family: var(--iz-head);
      font-size: 19px;
      color: var(--iz-dark);
    }
  }
  &__fclose,
  &__fshow,
  &__fbtn {
    display: none !important;
  }
  &__shade {
    position: fixed;
    inset: 0;
    z-index: 64;
    background: rgba(31, 29, 24, 0.45);

    @media (min-width: 990px) {
      display: none;
    }
  }
  &__range {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 10px;
  }
  &__hint {
    color: var(--iz-muted);
    font-size: 13px;
  }
  &__bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }
  &__view {
    margin-left: auto;

    button {
      display: grid;
      place-items: center;
      width: 42px;
      padding: 0;
    }
  }
  &__note {
    margin-bottom: 18px;
  }
  &__rows {
    display: grid;
    gap: 14px;
  }
  &__empty {
    display: grid;
    justify-items: start;
    gap: 10px;
    padding: 32px;
    border-radius: var(--iz-R);
    background: var(--iz-surface);

    b {
      font-family: var(--iz-head);
      font-size: 22px;
      color: var(--iz-dark);
    }
  }
  &__grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__filters {
      position: fixed;
      inset: 0 auto 0 0;
      z-index: 65;
      width: min(360px, 90vw);
      border-radius: 0;
      background: #fff;
      overflow-y: auto;
      align-content: start;
      transform: translateX(-105%);
      transition: transform 0.25s;
      box-shadow: var(--iz-pop);

      &.is-open {
        transform: none;
      }
    }
    &__fclose,
    &__fbtn {
      display: inline-flex !important;
    }
    &__fshow {
      display: flex !important;
    }
  }
  @media (max-width: 576px) {
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    &__bar .iz-select span {
      display: none;
    }
    &__bar .iz-select {
      flex: 1;
      min-width: 0;
    }
    &__view {
      display: none;
    }
  }
  @media (max-width: 375px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
    &__view {
      display: none;
    }
    &__bar .iz-select {
      flex: 1;
    }
  }
}
.iz-select {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--iz-muted);

  select {
    appearance: none;
    height: 46px;
    min-width: 0;
    width: 100%;
    padding: 0 38px 0 14px;
    border: 1px solid var(--iz-line);
    border-radius: var(--iz-r);
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%231f1d18' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E") no-repeat right 14px center;
    font-size: 15px;
    cursor: pointer;
  }
}
</style>
