<script lang="ts" setup>
import { apCountText, apDisc, apIcon, apInSection, apInSub, apParent, apPath, apPlural, apSaleProducts, apSearch, apSection } from '~/utils/apeti'
import { apSections } from '~/utils/apetiData'
import type { ApProduct } from '~/utils/apetiData'
import ApCard from '~/components/redesign/apeti/ApCard.vue'
import ApIcon from '~/components/redesign/apeti/ApIcon.vue'

const route = useRoute()
const slug = computed(() => String(route.params.section || ''))
const query = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))

const sec = computed(() => apSection(slug.value) ?? apParent(slug.value))
const sub = computed(() => (sec.value && sec.value.slug !== slug.value ? sec.value.sub.find((x) => x.slug === slug.value) : undefined))
const isSale = computed(() => slug.value === 'skidki')
const isIndex = computed(() => !slug.value && !query.value)

const base = computed<ApProduct[]>(() => {
  if (query.value) return apSearch(query.value)
  if (isSale.value) return apSaleProducts()
  if (!sec.value) return []
  if (sub.value) {
    const found = apInSub(sec.value, sub.value)
    return found.length ? found : apInSection(sec.value.slug)
  }
  return apInSection(sec.value.slug)
})
const subIsWhole = computed(() => !!sub.value && !!sec.value && apInSub(sec.value, sub.value).length === 0)
const title = computed(() => (query.value ? `Поиск: «${query.value}»` : isSale.value ? 'Скидки' : (sub.value?.name ?? sec.value?.name ?? 'Каталог')))

// Сортировка, фильтры, «Показать ещё»
const sorts = [
  { id: 'pop', name: 'Популярные' },
  { id: 'up', name: 'Дешевле' },
  { id: 'down', name: 'Дороже' },
  { id: 'name', name: 'По названию' },
  { id: 'new', name: 'По новизне' },
]
const sort = ref('pop')
const filtersOpen = ref(false)
const f = reactive({ min: '', max: '', sale: false, sticker: false, kind: 'all' })
const price = (p: ApProduct) => (p.k ? p.r : p.p)
const list = computed(() => {
  let r = base.value.filter((p) => {
    if (f.sale && !apDisc(p)) return false
    if (f.sticker && !p.g) return false
    if (f.kind === 'kg' && !p.k) return false
    if (f.kind === 'pc' && p.k) return false
    if (f.min && price(p) < Number(f.min)) return false
    if (f.max && price(p) > Number(f.max)) return false
    return true
  })
  if (sort.value === 'up') r = [...r].sort((a, b) => price(a) - price(b))
  if (sort.value === 'down') r = [...r].sort((a, b) => price(b) - price(a))
  if (sort.value === 'name') r = [...r].sort((a, b) => a.n.localeCompare(b.n, 'ru'))
  if (sort.value === 'new') r = [...r].reverse()
  return r
})
const active = computed(() => Number(f.sale) + Number(f.sticker) + Number(f.kind !== 'all') + Number(!!f.min || !!f.max))
const reset = () => Object.assign(f, { min: '', max: '', sale: false, sticker: false, kind: 'all' })
const STEP = 10
const shown = ref(STEP)
watch([slug, query], () => {
  shown.value = STEP
  reset()
  sort.value = 'pop'
  filtersOpen.value = false
})
watch([f, sort], () => (shown.value = STEP))

useSeoMeta({ title: () => `${title.value} — Apeti, концепт редизайна` })
</script>

<template>
  <div class="ap-wrap ap-page">
    <nav class="ap-crumbs" aria-label="Хлебные крошки">
      <NuxtLink :to="apPath('/')">Главная</NuxtLink>
      <NuxtLink v-if="!isIndex" :to="apPath('/catalog')">Каталог</NuxtLink>
      <NuxtLink v-if="sub && sec" :to="apPath(`/catalog/${sec.slug}`)">{{ sec.name }}</NuxtLink>
      <span>{{ isIndex ? 'Каталог' : title }}</span>
    </nav>

    <template v-if="isIndex">
      <div class="ap-head ap-cat__head"><div><h1>Каталог</h1><p>25 разделов, около 4 400 товаров. В концепте — выборка по 10–16 товаров из каждого раздела с настоящими ценами.</p></div></div>
      <ul class="ap-secs">
        <li v-for="s in apSections" :key="s.slug">
          <NuxtLink :to="apPath(`/catalog/${s.slug}`)" class="ap-secs__top">
            <img :src="apIcon(s.slug)" alt="" width="50" height="50" loading="lazy" />
            <span><b>{{ s.name }}</b><small v-if="s.count">{{ apCountText(s) }} {{ apPlural(s.count, ['товар', 'товара', 'товаров']) }}</small></span>
          </NuxtLink>
          <p v-if="s.sub.length">
            <NuxtLink v-for="x in s.sub.slice(0, 6)" :key="x.slug" :to="apPath(`/catalog/${x.slug}`)">{{ x.name }}</NuxtLink>
            <NuxtLink v-if="s.sub.length > 6" :to="apPath(`/catalog/${s.slug}`)" class="is-more">ещё {{ s.sub.length - 6 }}</NuxtLink>
          </p>
        </li>
      </ul>
    </template>

    <template v-else-if="!sec && !isSale && !query">
      <div class="ap-empty">
        <h2>Такого раздела нет</h2>
        <p>Возможно, ссылка устарела. Все разделы — в каталоге.</p>
        <NuxtLink :to="apPath('/catalog')" class="ap-btn">В каталог</NuxtLink>
      </div>
    </template>

    <template v-else>
      <div class="ap-head ap-cat__head">
        <div>
          <h1>{{ title }}</h1>
          <p v-if="query">{{ list.length ? `Нашли ${list.length} ${apPlural(list.length, ['товар', 'товара', 'товаров'])} в выборке концепта.` : '' }}</p>
          <p v-else-if="isSale">Товары со сниженной ценой — старая цена зачёркнута.</p>
          <p v-else-if="sec && !sub && sec.count">В концепте — выборка: {{ base.length }} из {{ apCountText(sec) }} товаров раздела, цены настоящие.</p>
          <p v-else-if="subIsWhole">В выборке концепта нет товаров именно этого подраздела — показываем весь раздел «{{ sec?.name }}».</p>
        </div>
      </div>

      <div v-if="sec && sec.sub.length && !query" class="ap-chips ap-cat__tags">
        <NuxtLink :to="apPath(`/catalog/${sec.slug}`)" :class="{ 'is-on': !sub }">Все</NuxtLink>
        <NuxtLink v-for="x in sec.sub" :key="x.slug" :to="apPath(`/catalog/${x.slug}`)" :class="{ 'is-on': sub?.slug === x.slug }">{{ x.name }}</NuxtLink>
      </div>

      <div v-if="base.length" class="ap-tools">
        <button type="button" class="ap-btn ap-btn--line" :class="{ 'is-on': filtersOpen }" @click="filtersOpen = !filtersOpen">
          <ApIcon name="filter" />Фильтры<i v-if="active">{{ active }}</i>
        </button>
        <label class="ap-field ap-tools__sort">
          <select v-model="sort" aria-label="Сортировка">
            <option v-for="s in sorts" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </label>
        <p class="ap-tools__count">{{ list.length }} {{ apPlural(list.length, ['товар', 'товара', 'товаров']) }}</p>
      </div>
      <div v-if="filtersOpen" class="ap-panel ap-filters">
        <div class="ap-filters__price">
          <b>Цена, ₽</b>
          <label class="ap-field"><input v-model="f.min" type="number" min="0" inputmode="numeric" placeholder="от" aria-label="Цена от" /></label>
          <label class="ap-field"><input v-model="f.max" type="number" min="0" inputmode="numeric" placeholder="до" aria-label="Цена до" /></label>
        </div>
        <div class="ap-seg ap-filters__kind">
          <button type="button" :class="{ 'is-on': f.kind === 'all' }" @click="f.kind = 'all'">Все</button>
          <button type="button" :class="{ 'is-on': f.kind === 'kg' }" @click="f.kind = 'kg'">На вес</button>
          <button type="button" :class="{ 'is-on': f.kind === 'pc' }" @click="f.kind = 'pc'">Поштучно</button>
        </div>
        <label class="ap-check"><input v-model="f.sale" type="checkbox" /><span>Со скидкой</span></label>
        <label class="ap-check"><input v-model="f.sticker" type="checkbox" /><span>С зелёным стикером</span></label>
        <button v-if="active" type="button" class="ap-link" @click="reset">Сбросить</button>
      </div>

      <div v-if="list.length" class="ap-grid">
        <ApCard v-for="p in list.slice(0, shown)" :key="p.id" :p="p" />
      </div>
      <div v-else class="ap-empty">
        <h2>{{ query ? 'В выборке концепта такого нет' : 'Под эти фильтры ничего не подошло' }}</h2>
        <p v-if="query">В настоящем магазине около 4 400 товаров — в концепт попала часть. Попробуйте «клубника», «форель», «творог», «мёд».</p>
        <button v-if="active" type="button" class="ap-btn" @click="reset">Сбросить фильтры</button>
        <NuxtLink v-else :to="apPath('/catalog')" class="ap-btn">В каталог</NuxtLink>
      </div>
      <div v-if="list.length > shown" class="ap-more">
        <button type="button" class="ap-btn ap-btn--line ap-btn--big" @click="shown += STEP">Показать ещё</button>
        <p>Показано {{ shown }} из {{ list.length }}</p>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.ap .ap-cat__head { margin-top: 12px; }
.ap .ap-cat__tags { margin-bottom: 20px; }
.ap ul.ap-secs { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 16px; margin: 0; padding: 0;
  li { display: grid; gap: 12px; align-content: start; padding: 18px; border: 1px solid var(--ap-line); border-radius: var(--ap-R); }
  p { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 14px; color: var(--ap-mute); a:hover { color: var(--ap-acc); } a.is-more { color: var(--ap-acc); font-weight: 500; } }
}
.ap .ap-secs__top { display: flex; align-items: center; gap: 14px;
  img { width: 50px; height: 50px; flex: none; }
  span { display: grid; gap: 2px; }
  b { font-family: var(--ap-head); font-size: 20px; font-weight: 600; line-height: 1.15; }
  small { font-size: 13px; color: var(--ap-mute); }
  &:hover b { color: var(--ap-acc); }
}
.ap .ap-tools { display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
  .ap-btn i { min-width: 20px; height: 20px; padding: 0 5px; border-radius: 10px; background: var(--ap-acc); color: #fff; font: 600 12px/20px var(--ap-text); box-sizing: border-box; }
  .ap-btn.is-on, .ap-btn.is-on:focus { border-color: var(--ap-acc); color: var(--ap-acc); }
  &__sort { width: 190px; select { min-height: 44px; padding-top: 0; padding-bottom: 0; } }
  &__count { margin-left: auto; color: var(--ap-mute); font-size: 14px; white-space: nowrap; }
}
.ap .ap-filters { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 28px; margin-bottom: 16px; padding: 16px 20px;
  &__price { display: flex; align-items: center; gap: 8px; b { font-weight: 600; white-space: nowrap; } .ap-field { width: 100px; } input { min-height: 40px; } }
  &__kind { background: #fff; }
  .ap-check { align-items: center; }
}
.ap .ap-more { display: grid; gap: 8px; justify-items: center; margin-top: 28px; p { font-size: 13px; color: var(--ap-mute); } }
@media (max-width: 576px) {
  .ap .ap-tools { gap: 8px; &__sort { flex: 1; width: auto; min-width: 0; } &__count { display: none; } }
  .ap .ap-filters { gap: 12px; &__price { width: 100%; .ap-field { flex: 1; width: auto; } } &__kind { width: 100%; box-sizing: border-box; } }
  .ap ul.ap-secs { grid-template-columns: minmax(0, 1fr); }
}
</style>
