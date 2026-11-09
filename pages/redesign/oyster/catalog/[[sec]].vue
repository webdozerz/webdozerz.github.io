<script lang="ts" setup>
import { oyImg, oyInSection, oyMatch, oyPath, oyPrice, oyProducts, oySection, oySections, oyTree, oyTreeName, oySectionByName } from '~/utils/oyster'
import type { OyProduct, OyTreeNode } from '~/utils/oyster'
import OyCard from '~/components/redesign/oyster/OyCard.vue'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'

const route = useRoute()
const router = useRouter()
const secId = computed(() => (route.params.sec as string) || '')
const sec = computed(() => (secId.value ? oySection(secId.value) : null))
const qs = computed(() => (route.query.q as string) || '')
const sub = computed(() => (route.query.sub as string) || '')

useSeoMeta({ title: () => `${sec.value?.name ?? (qs.value ? `Поиск: ${qs.value}` : 'Каталог')} — Oyster Market | Концепт редизайна` })

// Подразделы оригинала (дерево меню) — чипами над списком
const subs = computed<string[]>(() => {
  if (!sec.value) return []
  const node = oyTree.find((n) => typeof n !== 'string' && oySectionByName(n.name)?.id === sec.value!.id) as { children?: OyTreeNode[] } | undefined
  return (node?.children ?? []).map(oyTreeName)
})

// Фильтры оригинала: цена, «Наши предложения», в наличии, размер; сортировка
const offer = ref('Все')
const inStock = ref(false)
const size = ref('')
const pmin = ref<number | null>(null)
const pmax = ref<number | null>(null)
const sort = ref('default')
const page = ref(1)
const PER = 12
const showFilters = ref(false)

const base = computed(() => {
  let list = oyProducts
  if (sec.value) list = list.filter((p) => oyInSection(p, sec.value!.id))
  if (qs.value) list = list.filter((p) => oyMatch(p, qs.value))
  if (sub.value) list = list.filter((p) => oyMatch(p, sub.value))
  return list
})
const sizes = computed(() => [...new Set(base.value.flatMap((p) => p.variants?.map((v) => v.name) ?? []))])
const items = computed(() => {
  let list: OyProduct[] = base.value
  if (offer.value !== 'Все') list = list.filter((p) => p.labels.includes(offer.value))
  if (inStock.value) list = list.filter((p) => !p.order)
  if (size.value) list = list.filter((p) => p.variants?.some((v) => v.name === size.value))
  if (pmin.value) list = list.filter((p) => (oyPrice(p) ?? 0) >= pmin.value!)
  if (pmax.value) list = list.filter((p) => (oyPrice(p) ?? Infinity) <= pmax.value!)
  const s = [...list]
  if (sort.value === 'cheap') s.sort((a, b) => (oyPrice(a) ?? 1e9) - (oyPrice(b) ?? 1e9))
  if (sort.value === 'dear') s.sort((a, b) => (oyPrice(b) ?? -1) - (oyPrice(a) ?? -1))
  if (sort.value === 'abc') s.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  if (sort.value === 'pop') s.sort((a, b) => Number(b.labels.includes('Хит')) * 2 + Number(b.labels.includes('Советуем')) - (Number(a.labels.includes('Хит')) * 2 + Number(a.labels.includes('Советуем'))))
  // «Под заказ» — в конце, как у оригинала
  return s.sort((a, b) => Number(a.order) - Number(b.order))
})
const activeCount = computed(() => [offer.value !== 'Все', inStock.value, !!size.value, !!pmin.value, !!pmax.value].filter(Boolean).length)
const reset = () => {
  offer.value = 'Все'
  inStock.value = false
  size.value = ''
  pmin.value = null
  pmax.value = null
}
watch([offer, inStock, size, pmin, pmax, sort, () => route.fullPath], () => (page.value = 1))
const title = computed(() => sec.value?.name ?? (qs.value ? `Поиск: «${qs.value}»` : 'Каталог'))
const setSub = (s: string) => router.push({ query: s && s !== sub.value ? { sub: s } : {} })
</script>

<template>
  <div class="oy-wrap oy-page oy-cat">
    <nav class="oy-crumbs" aria-label="Навигация">
      <NuxtLink :to="oyPath('/')">Главная</NuxtLink>
      <span><NuxtLink :to="oyPath('/catalog/')">Каталог</NuxtLink></span>
      <span v-if="sec">{{ sec.name }}</span>
    </nav>
    <div class="oy-cat__head">
      <div>
        <h1 class="oy-title">{{ title }}</h1>
        <p class="oy-cat__count">
          <template v-if="sec">{{ sec.count }} товаров</template>
          <template v-else-if="qs">Нашли {{ base.length }}</template>
          <template v-else>Около 240 товаров в 16 разделах</template>
        </p>
      </div>
    </div>

    <div v-if="!sec && !qs" class="oy-cat__secs">
      <NuxtLink v-for="s in oySections" :key="s.id" :to="oyPath(`/catalog/${s.id}/`)" class="oy-cat__sec">
        <span class="oy-mask" :style="{ '--m': `url(${oyImg(`ic/${s.icon}.png`)})` }" />
        <b>{{ s.name }}</b>
        <small>{{ s.count }}</small>
      </NuxtLink>
    </div>

    <div v-if="subs.length" class="oy-cat__subs">
      <button type="button" class="oy-chip" :class="{ 'is-on': !sub }" @click="setSub('')">Все</button>
      <button v-for="s in subs" :key="s" type="button" class="oy-chip" :class="{ 'is-on': sub === s }" @click="setSub(s)">{{ s }}</button>
    </div>

    <div class="oy-cat__body">
      <aside class="oy-filters" :class="{ 'is-open': showFilters }">
        <div class="oy-filters__panel">
          <div class="oy-filters__top">
            <b>Фильтры</b>
            <button type="button" class="oy-filters__x" @click="showFilters = false"><OyIcon name="close" /></button>
          </div>
          <div class="oy-filters__group oy-filters__nav">
            <b>Разделы</b>
            <NuxtLink v-for="s in oySections" :key="s.id" :to="oyPath(`/catalog/${s.id}/`)" :class="{ 'is-on': s.id === secId }">
              <span class="oy-mask" :style="{ '--m': `url(${oyImg(`ic/${s.icon}.png`)})` }" />{{ s.name }}
            </NuxtLink>
          </div>
          <div class="oy-filters__group">
            <b>Цена, ₽</b>
            <div class="oy-filters__price">
              <input v-model.number="pmin" type="number" inputmode="numeric" min="0" placeholder="от" aria-label="Цена от" />
              <input v-model.number="pmax" type="number" inputmode="numeric" min="0" placeholder="до" aria-label="Цена до" />
            </div>
          </div>
          <div class="oy-filters__group">
            <b>Наши предложения</b>
            <div class="oy-filters__chips">
              <button v-for="o in ['Все', 'Советуем', 'Новинка', 'Хит']" :key="o" type="button" class="oy-chip" :class="{ 'is-on': offer === o }" @click="offer = o">{{ o }}</button>
            </div>
          </div>
          <div v-if="sizes.length" class="oy-filters__group">
            <b>Размер</b>
            <div class="oy-filters__chips">
              <button v-for="s in sizes" :key="s" type="button" class="oy-chip" :class="{ 'is-on': size === s }" @click="size = size === s ? '' : s">{{ s }}</button>
            </div>
          </div>
          <label class="oy-svc oy-filters__stock">
            <input v-model="inStock" type="checkbox" />
            <span class="oy-svc__box"><OyIcon name="check" :size="14" /></span>
            <span>Только в наличии</span>
          </label>
          <div class="oy-filters__foot">
            <button type="button" class="oy-btn oy-btn--line" :disabled="!activeCount" @click="reset">Сбросить</button>
            <button type="button" class="oy-btn oy-btn--accent oy-filters__show" @click="showFilters = false">Показать {{ items.length }}</button>
          </div>
        </div>
      </aside>

      <div class="oy-cat__main">
        <div class="oy-cat__tools">
          <button type="button" class="oy-btn oy-btn--line oy-cat__fbtn" @click="showFilters = true">
            <OyIcon name="filter" :size="18" />Фильтры<template v-if="activeCount"> · {{ activeCount }}</template>
          </button>
          <span class="oy-cat__found">{{ items.length }} {{ items.length % 10 === 1 && items.length % 100 !== 11 ? 'товар' : 'товаров' }}</span>
          <label class="oy-select">
            <span class="oy-select__label">Сортировка</span>
            <select v-model="sort" aria-label="Сортировка">
              <option value="default">По умолчанию</option>
              <option value="pop">По популярности</option>
              <option value="abc">По алфавиту</option>
              <option value="cheap">Дешевле</option>
              <option value="dear">Дороже</option>
            </select>
            <OyIcon name="down" :size="16" />
          </label>
        </div>

        <div v-if="items.length" class="oy-grid oy-cat__grid">
          <!-- v-show, а не срез: ссылки на все карточки есть в разметке для пререндера -->
          <OyCard v-for="(p, i) in items" v-show="i < page * PER" :key="p.id" :p="p" />
        </div>
        <div v-else class="oy-empty">
          <span class="oy-mask" :style="{ '--m': `url(${oyImg('ic/shells.png')})` }" />
          <h2>В выборке концепта такого нет</h2>
          <p>На сайте около 240 товаров, в концепте — 153. Сбросьте фильтры или посмотрите соседний раздел.</p>
          <button v-if="activeCount" type="button" class="oy-btn oy-btn--accent" @click="reset">Сбросить фильтры</button>
          <NuxtLink v-else :to="oyPath('/catalog/')" class="oy-btn oy-btn--accent">Весь каталог</NuxtLink>
        </div>
        <div v-if="items.length > page * PER" class="oy-cat__more">
          <button type="button" class="oy-btn oy-btn--line oy-btn--big" @click="page++">Показать ещё {{ Math.min(PER, items.length - page * PER) }}</button>
          <span>Показано {{ page * PER }} из {{ items.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.oy-cat {
  &__count { color: var(--oy-muted); }
  &__secs {
    display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin: 18px 0 8px;
    @media (max-width: 989px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  &__sec {
    display: grid; grid-template-columns: 40px minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 14px 16px; border-radius: 14px; background: var(--oy-surface2);
    .oy-mask { width: 40px; height: 34px; color: var(--oy-accent); }
    b { font-size: 14px; color: var(--oy-ink); line-height: 1.3; }
    small { color: var(--oy-muted); }
    &:hover { background: var(--oy-soft); }
    @media (max-width: 576px) { grid-template-columns: 32px minmax(0, 1fr); padding: 12px; small { display: none; } .oy-mask { width: 32px; height: 28px; } b { font-size: 13px; } }
  }
  &__subs { display: flex; flex-wrap: wrap; gap: 6px; margin: 16px 0 4px; @media (max-width: 768px) { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin-left: -24px; margin-right: -24px; padding: 0 24px; &::-webkit-scrollbar { display: none; } } @media (max-width: 576px) { margin-left: -16px; margin-right: -16px; padding: 0 16px; } }
  &__body { display: grid; grid-template-columns: 270px minmax(0, 1fr); gap: 28px; margin-top: 20px; align-items: start; @media (max-width: 989px) { grid-template-columns: minmax(0, 1fr); } }
  &__tools { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  &__fbtn { display: none; @media (max-width: 989px) { display: inline-flex; } }
  &__found { color: var(--oy-muted); font-size: 14px; margin-right: auto; white-space: nowrap; }
  &__more { display: grid; justify-items: center; gap: 8px; margin-top: 28px; span { color: var(--oy-muted); font-size: 13px; } }
  @media (max-width: 576px) {
    &__found { display: none; }
    &__tools .oy-select { flex: 1; min-width: 0; }
    &__tools .oy-select__label { display: none; }
  }
}
.oy-select {
  position: relative; display: inline-flex; align-items: center; gap: 8px;
  &__label { font-size: 13px; color: var(--oy-muted); white-space: nowrap; }
  select { appearance: none; height: 44px; padding: 0 40px 0 14px; border-radius: var(--oy-r); border: 1px solid var(--oy-line); background: #fff; font-weight: 600; color: var(--oy-ink); cursor: pointer; width: 100%; min-width: 0; }
  .oy-icon { position: absolute; right: 14px; pointer-events: none; color: var(--oy-muted); }
}
.oy-filters {
  position: sticky; top: 100px;
  &__panel { display: grid; gap: 22px; }
  &__top { display: none; }
  &__group { display: grid; gap: 10px; > b { font-family: 'Advent Pro', sans-serif; font-size: 20px; color: var(--oy-ink); } }
  &__nav a {
    display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 8px; font-size: 14px; color: var(--oy-text);
    .oy-mask { width: 24px; height: 20px; color: var(--oy-accent); }
    &:hover { background: var(--oy-surface2); }
    &.is-on { background: var(--oy-soft); color: var(--oy-ink); font-weight: 700; }
  }
  &__nav { gap: 4px; }
  &__price { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; input { width: 100%; box-sizing: border-box; height: 42px; padding: 0 12px; border-radius: var(--oy-r); border: 1px solid var(--oy-line); outline: none; &:focus { border-color: var(--oy-accent); } } }
  &__chips { display: flex; flex-wrap: wrap; gap: 6px; }
  &__foot { display: flex; gap: 8px; .oy-btn { flex: 1; } }
  &__show { display: none; }
  @media (max-width: 989px) {
    position: fixed; inset: 0; z-index: 95; top: 0; display: none; background: rgba(0, 30, 36, .4);
    &.is-open { display: block; }
    &__panel { position: absolute; right: 0; top: 0; bottom: 0; width: min(380px, 100%); box-sizing: border-box; overflow-y: auto; padding: 16px 20px 24px; background: #fff; align-content: start; }
    &__top { display: flex; justify-content: space-between; align-items: center; b { font-family: 'Advent Pro', sans-serif; font-size: 26px; color: var(--oy-ink); } }
    &__x { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; background: var(--oy-surface); }
    &__nav { display: none; }
    &__show { display: inline-flex; }
    &__foot { position: sticky; bottom: -24px; padding: 12px 0; background: #fff; }
  }
}
</style>
