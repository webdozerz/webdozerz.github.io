<script lang="ts" setup>
// Продукция: разделы и подразделы как в их каталоге, поиск (у них /search/ без поля в интерфейсе), сортировка по цене за кг/шт.
import { mlGroups, mlInGroup, mlPath, mlSubName } from '~/utils/moreland'
import { mlProducts } from '~/utils/moreland.data'
import MlCard from '~/components/redesign/moreland/MlCard.vue'
import MlIcon from '~/components/redesign/moreland/MlIcon.vue'

const route = useRoute()
const router = useRouter()
const gid = computed(() => String(route.params.group || ''))
const group = computed(() => mlGroups.find((g) => g.id === gid.value))
const sub = computed(() => String(route.query.sub || ''))
const q = ref(String(route.query.q || ''))
const sort = ref('order')

useSeoMeta({ title: () => `${group.value?.name ?? 'Продукция'} — Морелэнд | Концепт редизайна` })

const base = computed(() => (group.value ? mlInGroup(group.value.id) : mlProducts))
const items = computed(() => {
  let r = base.value
  if (sub.value) r = r.filter((p) => p.sec === sub.value)
  const s = q.value.trim().toLowerCase().replace(/ё/g, 'е')
  if (s) r = mlProducts.filter((p) => p.n.toLowerCase().replace(/ё/g, 'е').includes(s))
  const priced = (p: (typeof r)[number]) => (p.price ? 0 : 1)
  if (sort.value === 'cheap') r = [...r].sort((a, b) => priced(a) - priced(b) || (a.price ?? 0) - (b.price ?? 0))
  if (sort.value === 'fresh') r = [...r].sort((a, b) => (b.pdate || '').localeCompare(a.pdate || ''))
  return r
})
const subs = computed(() => (group.value ? group.value.subs.map((s) => ({ ...s, count: mlProducts.filter((p) => p.sec === s.id).length })) : []))
const setSub = (id: string) => router.replace({ query: { ...route.query, sub: id || undefined } })
watch(q, (v) => router.replace({ query: { ...route.query, q: v.trim() || undefined } }))
const title = computed(() => (q.value.trim() ? `Поиск: «${q.value.trim()}»` : sub.value ? mlSubName(sub.value) : group.value?.name ?? 'Продукция'))
</script>

<template>
  <div class="ml-wrap ml-cat">
    <nav class="ml-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mlPath('/')">Главная</NuxtLink></span>
      <span v-if="group"><NuxtLink :to="mlPath('/produkcija/')">Продукция</NuxtLink></span>
      <span v-else>Продукция</span>
      <span v-if="group">{{ group.name }}</span>
    </nav>
    <div class="ml-pagehead">
      <h1>{{ title }}</h1>
      <p>Опт от коробки для магазинов и сетей. Цены — из прайс-листов и новостей, точную на день отгрузки подтвердит менеджер.</p>
    </div>

    <div class="ml-cat__layout">
      <aside class="ml-cat__side">
        <nav class="ml-side" aria-label="Разделы">
          <NuxtLink :to="mlPath('/produkcija/')" class="ml-side__a" :class="{ 'is-on': !group }">Вся продукция<em>{{ mlProducts.length }}</em></NuxtLink>
          <template v-for="g in mlGroups" :key="g.id">
            <NuxtLink :to="mlPath(`/produkcija/${g.id}/`)" class="ml-side__a ml-side__a--g" :class="{ 'is-on': group?.id === g.id && !sub }">
              <img :src="g.img" :alt="g.name" width="36" height="36" />{{ g.name }}<em>{{ mlInGroup(g.id).length }}</em>
            </NuxtLink>
            <div v-if="group?.id === g.id && g.subs.length > 1" class="ml-side__subs">
              <button v-for="s in subs" :key="s.id" type="button" class="ml-side__s" :class="{ 'is-on': sub === s.id }" @click="setSub(sub === s.id ? '' : s.id)">{{ s.name }}<em>{{ s.count }}</em></button>
            </div>
          </template>
        </nav>
      </aside>

      <div class="ml-cat__main">
        <nav class="ml-cat__groups" aria-label="Разделы">
          <NuxtLink :to="mlPath('/produkcija/')" class="ml-pill" :class="{ 'is-on': !group }">Все</NuxtLink>
          <NuxtLink v-for="g in mlGroups" :key="g.id" :to="mlPath(`/produkcija/${g.id}/`)" class="ml-pill" :class="{ 'is-on': group?.id === g.id }">{{ g.name }}</NuxtLink>
        </nav>
        <div class="ml-tool">
          <label class="ml-tool__search">
            <MlIcon name="search" />
            <input v-model="q" type="search" placeholder="Лещ, кета, сельдь…" aria-label="Поиск по продукции" />
          </label>
          <select v-model="sort" class="ml-tool__sort" aria-label="Сортировка">
            <option value="order">По прайсу</option>
            <option value="cheap">Дешевле</option>
            <option value="fresh">Свежие цены</option>
          </select>
        </div>
        <div v-if="group && group.subs.length > 1" class="ml-tool__chips">
          <button type="button" class="ml-pill" :class="{ 'is-on': !sub }" @click="setSub('')">Все</button>
          <button v-for="s in subs" :key="s.id" type="button" class="ml-pill" :class="{ 'is-on': sub === s.id }" @click="setSub(s.id)">{{ s.name }} · {{ s.count }}</button>
        </div>
        <p class="ml-tool__count">{{ items.length }} поз.</p>
        <div v-if="items.length" class="ml-grid ml-grid--3">
          <MlCard v-for="p in items" :key="p.id" :p="p" />
        </div>
        <div v-else class="ml-panel ml-empty">
          <h2>Ничего не нашли</h2>
          <p>Попробуйте другое слово или напишите нам — подскажем, есть ли позиция в работе.</p>
          <button type="button" class="ml-btn ml-btn--line" @click="q = ''">Сбросить поиск</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ml-cat {
  &__layout {
    display: grid;
    grid-template-columns: 270px minmax(0, 1fr);
    gap: 28px;
    align-items: start;
  }
  &__side {
    position: sticky;
    top: calc(var(--ml-head) + 16px);
  }
  @media (max-width: 989px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }
    &__side {
      display: none;
    }
  }
  &__groups {
    display: none;
    @media (max-width: 989px) {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      overflow-x: auto;
      scrollbar-width: none;
    }
  }
}
.ml-side {
  display: grid;
  gap: 4px;
  padding: 10px;
  border-radius: var(--ml-R);
  background: var(--ml-surf);
  em {
    margin-left: auto;
    font-style: normal;
    font-size: 13px;
    color: var(--ml-mute);
    font-weight: 700;
  }
  &__a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    font-weight: 800;
    color: var(--ml-ink);
    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }
    &:hover {
      color: var(--ml-acc);
    }
    &.is-on {
      background: #fff;
      color: var(--ml-acc);
    }
  }
  &__subs {
    display: grid;
    gap: 2px;
    padding: 2px 0 6px 58px;
  }
  &__s {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    &.is-on {
      background: #fff;
      color: var(--ml-acc);
    }
    &:hover {
      color: var(--ml-acc);
    }
  }
}
.ml-tool {
  display: flex;
  gap: 10px;
  &__search {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 14px;
    border: 1px solid var(--ml-line);
    border-radius: var(--ml-r);
    background: #fff;
    .ml-icon {
      color: var(--ml-mute);
    }
    input {
      flex: 1;
      width: 0;
      min-height: 46px;
      border: 0;
      outline: none;
      background: transparent;
    }
    &:focus-within {
      border-color: var(--ml-acc);
    }
  }
  &__sort {
    flex: none;
    min-height: 48px;
    padding: 0 40px 0 14px;
    border: 1px solid var(--ml-line);
    border-radius: var(--ml-r);
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%2366788c' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 14px center;
    appearance: none;
    font-weight: 700;
  }
  &__chips {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  &__count {
    margin: 14px 0 12px !important;
    font-size: 13.5px;
    color: var(--ml-mute);
  }
  @media (max-width: 576px) {
    &__sort {
      max-width: 132px;
      padding-right: 34px;
      background-position: right 10px center;
    }
  }
}
</style>
