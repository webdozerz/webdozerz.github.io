<script lang="ts" setup>
import FaIcon from '~/components/redesign/fermaaltaya/FaIcon.vue'
import FaMask from '~/components/redesign/fermaaltaya/FaMask.vue'
import FaCard from '~/components/redesign/fermaaltaya/FaCard.vue'

const route = useRoute()
const router = useRouter()

const secId = computed(() => String(route.params.section ?? ''))
const sec = computed(() => (secId.value ? faSection(secId.value) : undefined))
const q = computed(() => String(route.query.q ?? '').trim())
const f = computed(() => String(route.query.f ?? ''))
const flags: Record<string, string> = { hit: 'Хиты', new: 'Новинки', sale: 'Снижена цена' }

if (secId.value && !sec.value) throw createError({ statusCode: 404, statusMessage: 'Раздел не найден' })

const title = computed(() => (sec.value ? sec.value.title : q.value ? `Поиск: «${q.value}»` : flags[f.value] ?? 'Каталог'))
useSeoMeta({ title: () => `${title.value} — Ферма Алтая | Концепт редизайна` })

// Сортировка, число на странице и вид — как у оригинала: 8 порядков, 12/24/36, плитка или список
const sorts = [
  { id: 'order', label: 'По порядку' },
  { id: 'cheap', label: 'Сначала дешевле' },
  { id: 'dear', label: 'Сначала дороже' },
  { id: 'name', label: 'По названию' },
  { id: 'new', label: 'Сначала новинки' },
  { id: 'stock', label: 'По наличию' },
  { id: 'popular', label: 'По популярности' },
  { id: 'rating', label: 'По рейтингу' },
]
const sort = computed(() => String(route.query.sort ?? 'order'))
const per = computed(() => [12, 24, 36].includes(Number(route.query.per)) ? Number(route.query.per) : 24)
const view = useState<'grid' | 'rows'>('fa-view', () => 'grid')
const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const setQuery = (patch: Record<string, string | number | undefined>) =>
  router.push({ query: { ...route.query, ...patch, page: patch.page ?? undefined } })

const base = computed(() => {
  let list = sec.value ? faInSection(sec.value.id) : faProducts
  if (f.value === 'hit') list = list.filter((p) => p.hit)
  if (f.value === 'new') list = list.filter((p) => p.isNew)
  if (f.value === 'sale') list = list.filter((p) => p.old)
  if (q.value) {
    const s = q.value.toLowerCase()
    list = list.filter((p) => p.title.toLowerCase().includes(s) || p.comp.toLowerCase().includes(s) || faSection(p.sec)?.title.toLowerCase().includes(s))
  }
  return list
})
const sorted = computed(() => {
  const a = [...base.value]
  const by: Record<string, (x: FaProduct, y: FaProduct) => number> = {
    cheap: (x, y) => faEach(x)[0] - faEach(y)[0],
    dear: (x, y) => faEach(y)[0] - faEach(x)[0],
    name: (x, y) => x.title.localeCompare(y.title, 'ru'),
    new: (x, y) => Number(y.isNew) - Number(x.isNew),
    popular: (x, y) => y.votes - x.votes,
    rating: (x, y) => y.rating - x.rating || y.votes - x.votes,
  }
  return by[sort.value] ? a.sort(by[sort.value]) : a
})
const pages = computed(() => Math.max(1, Math.ceil(sorted.value.length / per.value)))
const shown = computed(() => sorted.value.slice((page.value - 1) * per.value, page.value * per.value))

// описание раздела свёрнуто, как «Развернуть…» у оригинала
const noteOpen = ref(false)
const filtersOpen = ref(false)
const note = computed(() => (sec.value ? faNote(sec.value.id) : ''))
watch(secId, () => {
  noteOpen.value = false
  filtersOpen.value = false
})

</script>

<template>
  <div class="fa-wrap fa-cat">
    <nav class="fa-crumbs" aria-label="Навигация">
      <NuxtLink :to="faPath()">Главная</NuxtLink>
      <span><NuxtLink :to="faPath('/catalog')">Каталог</NuxtLink></span>
      <span v-if="sec">{{ sec.title }}</span>
    </nav>

    <div class="fa-cat__layout">
      <aside class="fa-cat__side">
        <div v-for="g in faGroups" :key="g.id" class="fa-cat__group">
          <b>{{ g.title }}</b>
          <NuxtLink
            v-for="id in g.secs"
            :key="id"
            :to="{ path: faPath(`/catalog/${id}`), query: f ? { f } : {} }"
            class="fa-cat__sec"
            :class="{ 'is-on': secId === id }"
          >
            <span class="fa-cat__ic"><FaMask :sec="id" :size="20" /></span>
            <span>{{ faSection(id)!.title }}</span>
            <small>{{ faSection(id)!.count }}</small>
          </NuxtLink>
        </div>
      </aside>

      <section class="fa-cat__main">
        <div class="fa-cat__head">
          <h1>{{ title }}</h1>
          <span class="fa-cat__count">{{ faPlural(base.length, 'товар', 'товара', 'товаров') }}</span>
        </div>
        <div v-if="note" class="fa-cat__note" :class="{ 'is-open': noteOpen }">
          <p>{{ note }}</p>
          <button type="button" class="fa-link" @click="noteOpen = !noteOpen">{{ noteOpen ? 'Свернуть' : 'Развернуть…' }}</button>
        </div>

        <div class="fa-cat__flags">
          <button type="button" class="fa-chip fa-cat__secbtn" @click="filtersOpen = !filtersOpen">
            <FaIcon name="grid" :size="18" />{{ sec ? sec.title : 'Разделы' }}<FaIcon name="down" :size="16" />
          </button>
          <NuxtLink :to="{ query: { ...route.query, f: undefined, page: undefined } }" class="fa-chip" :class="{ 'is-on': !f }">Все</NuxtLink>
          <NuxtLink
            v-for="(label, k) in flags"
            :key="k"
            :to="{ query: { ...route.query, f: k, page: undefined } }"
            class="fa-chip"
            :class="{ 'is-on': f === k }"
          >
            {{ label }}
          </NuxtLink>
          <NuxtLink v-if="q" :to="{ query: { ...route.query, q: undefined, page: undefined } }" class="fa-chip is-on">
            «{{ q }}»<FaIcon name="close" :size="16" />
          </NuxtLink>
        </div>

        <div v-if="filtersOpen" class="fa-cat__drop">
          <div v-for="g in faGroups" :key="g.id" class="fa-cat__group">
            <b>{{ g.title }}</b>
            <NuxtLink
              v-for="id in g.secs"
              :key="id"
              :to="{ path: faPath(`/catalog/${id}`), query: f ? { f } : {} }"
              class="fa-cat__sec"
              :class="{ 'is-on': secId === id }"
            >
              <span class="fa-cat__ic"><FaMask :sec="id" :size="20" /></span>
              <span>{{ faSection(id)!.title }}</span>
              <small>{{ faSection(id)!.count }}</small>
            </NuxtLink>
          </div>
        </div>

        <div class="fa-cat__tools">
          <label class="fa-field fa-cat__sort">
            <select :value="sort" aria-label="Сортировка" @change="setQuery({ sort: ($event.target as HTMLSelectElement).value })">
              <option v-for="s in sorts" :key="s.id" :value="s.id">{{ s.label }}</option>
            </select>
          </label>
          <div class="fa-cat__per" role="group" aria-label="Товаров на странице">
            <span>На странице</span>
            <button v-for="n in [12, 24, 36]" :key="n" type="button" :class="{ 'is-on': per === n }" @click="setQuery({ per: n })">{{ n }}</button>
          </div>
          <div class="fa-cat__view" role="group" aria-label="Вид">
            <button type="button" :class="{ 'is-on': view === 'grid' }" aria-label="Плиткой" @click="view = 'grid'"><FaIcon name="grid" :size="18" /></button>
            <button type="button" :class="{ 'is-on': view === 'rows' }" aria-label="Списком" @click="view = 'rows'"><FaIcon name="rows" :size="18" /></button>
          </div>
        </div>

        <div v-if="!shown.length" class="fa-empty">
          <FaMask sec="ptitsa" :size="48" />
          <b>Ничего не нашлось</b>
          <p>Попробуйте другое слово или посмотрите разделы слева — у нас 181 товар.</p>
          <NuxtLink :to="faPath('/catalog')" class="fa-btn fa-btn--main">Весь каталог</NuxtLink>
        </div>
        <div v-else-if="view === 'grid'" class="fa-grid fa-cat__grid">
          <FaCard v-for="(p, i) in shown" :key="p.id" :p="p" :eager="i < 4" />
        </div>
        <div v-else class="fa-rowlist">
          <FaCard v-for="p in shown" :key="p.id" :p="p" row />
        </div>

        <nav v-if="pages > 1" class="fa-pager" aria-label="Страницы">
          <button type="button" :disabled="page === 1" aria-label="Назад" @click="setQuery({ page: page - 1 })"><FaIcon name="left" :size="18" /></button>
          <button v-for="n in pages" :key="n" type="button" :class="{ 'is-on': n === page }" @click="setQuery({ page: n })">{{ n }}</button>
          <button type="button" :disabled="page === pages" aria-label="Вперёд" @click="setQuery({ page: page + 1 })"><FaIcon name="right" :size="18" /></button>
        </nav>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.fa-cat {
  &__layout {
    display: grid;
    grid-template-columns: 270px minmax(0, 1fr);
    gap: 32px;
    padding-top: 18px;
  }
  &__side {
    align-self: start;
    display: grid;
    gap: 16px;
  }
  &__group {
    display: grid;
    gap: 2px;

    > b {
      padding: 0 10px 8px;
      color: var(--fa-muted);
      font-size: 15px;
    }
  }
  &__sec {
    display: grid;
    grid-template-columns: 30px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    min-height: 40px;
    padding: 3px 10px;
    border-radius: var(--fa-r);
    color: var(--fa-dark);
    font-weight: 500;
    line-height: 1.2;

    small {
      color: var(--fa-muted);
      font-size: 14px;
    }
    &:hover {
      background: var(--fa-surface);
    }
    &.is-on {
      background: var(--fa-soft);
      color: var(--fa-soft-ink);
      font-weight: 700;
    }
  }
  &__ic {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;

    .fa-mask--cow {
      height: 16px !important;
    }
  }
  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 14px;

    h1 {
      font-size: clamp(30px, 3vw, 42px);
    }
  }
  &__count {
    color: var(--fa-muted);
  }
  &__note {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 10px;
    max-width: 820px;
    margin-top: 10px;

    p {
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      flex: 1 1 360px;
      color: var(--fa-text);
    }
    &.is-open p {
      display: block;
    }
  }
  &__flags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 18px;
  }
  &__secbtn {
    display: none !important;
  }
  &__drop {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin-top: 12px;
    padding: 14px;
    border-radius: var(--fa-R);
    background: var(--fa-surface);

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  &__tools {
    display: flex;
    align-items: center;
    gap: 12px 20px;
    margin: 14px 0 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--fa-line);
  }
  &__sort {
    width: 230px;

    select {
      height: 42px;
    }
  }
  &__per {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--fa-muted);
    font-size: 15px;

    span {
      margin-right: 6px;
    }
    button {
      min-width: 38px;
      height: 36px;
      border-radius: 8px;
      color: var(--fa-dark);
      font-weight: 700;

      &.is-on {
        background: var(--fa-surface);
        color: var(--fa-accent);
      }
    }
  }
  &__view {
    display: flex;
    gap: 2px;
    margin-left: auto;
    padding: 3px;
    border-radius: 10px;
    background: var(--fa-surface);

    button {
      display: grid;
      place-items: center;
      width: 38px;
      height: 34px;
      border-radius: 8px;
      color: var(--fa-muted);

      &.is-on {
        background: var(--fa-card);
        color: var(--fa-dark);
      }
    }
  }
  &__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));

    @media (max-width: 1400px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    @media (max-width: 1199px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 1199px) {
    &__layout {
      grid-template-columns: 230px minmax(0, 1fr);
      gap: 24px;
    }
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 989px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }
    &__side {
      display: none;
    }
    &__secbtn {
      display: inline-flex !important;
    }
    &__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  @media (max-width: 768px) {
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    &__per {
      display: none;
    }
  }
  @media (max-width: 576px) {
    &__flags {
      flex-wrap: nowrap;
      margin-right: -14px;
      padding-right: 14px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    &__tools {
      gap: 10px;
    }
    &__sort {
      flex: 1;
      min-width: 0;
      width: auto;
    }
    &__view {
      display: none;
    }
  }
}
.fa-pager {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-top: 28px;

  button {
    display: grid;
    place-items: center;
    min-width: 44px;
    height: 44px;
    padding: 0 8px;
    border-radius: var(--fa-r);
    background: var(--fa-surface);
    color: var(--fa-dark);
    font-weight: 700;

    &.is-on {
      background: var(--fa-dark);
      color: var(--fa-bg);
    }
    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
}
</style>
