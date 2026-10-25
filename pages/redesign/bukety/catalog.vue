<script lang="ts" setup>
import BkIcon from '~/components/redesign/bukety/BkIcon.vue'
import BkCard from '~/components/redesign/bukety/BkCard.vue'

const route = useRoute()
const router = useRouter()

const q = computed(() => String(route.query.q ?? '').trim())
const g = computed(() => String(route.query.g ?? ''))
const s = computed(() => String(route.query.s ?? ''))
const o = computed(() => String(route.query.o ?? ''))
const p = computed(() => String(route.query.p ?? ''))
const sort = computed(() => String(route.query.sort ?? 'popular'))

const section = computed(() => (s.value ? bkFindSection(s.value) : undefined))
const group = computed(() => bkGroups.find((x) => x.id === (section.value?.group ?? g.value)))
const budget = computed(() => bkBudgets.find((b) => b.id === p.value))

const title = computed(() => {
  if (q.value) return `Поиск: «${q.value}»`
  if (section.value) return section.value.title
  if (o.value) {
    const w = bkWhom.find((x) => x.id === o.value)
    return w ? `Букеты ${w.title.toLowerCase()}` : bkOccTitle(o.value)
  }
  if (group.value) return group.value.title
  if (budget.value) return `Букеты ${budget.value.title}`
  return 'Каталог'
})
useSeoMeta({ title: () => `${title.value} — Любимые Букеты | Концепт редизайна` })

const sorts = [
  { id: 'popular', title: 'Популярные' },
  { id: 'cheap', title: 'Сначала дешевле' },
  { id: 'expensive', title: 'Сначала дороже' },
]

const list = computed(() => {
  const words = q.value.toLowerCase()
  let out = bkProducts.filter((x) => {
    if (words && !`${x.title} ${x.comp}`.toLowerCase().includes(words)) return false
    if (s.value && x.sec !== s.value) return false
    if (!s.value && group.value && !group.value.sections.some((sec) => sec.id === x.sec)) return false
    if (o.value && !x.occ.includes(o.value)) return false
    if (budget.value && (x.price < budget.value.min || x.price > budget.value.max)) return false
    return true
  })
  if (sort.value === 'cheap') out = [...out].sort((a, b) => a.price - b.price)
  if (sort.value === 'expensive') out = [...out].sort((a, b) => b.price - a.price)
  return out
})

// Сколько товаров у оригинала в этом срезе — концепт показывает часть ассортимента.
const siteCount = computed(() => {
  if (q.value || budget.value) return null
  if (section.value) return section.value.count
  if (o.value) return (bkWhom.find((x) => x.id === o.value) ?? bkOccasions.find((x) => x.id === o.value))?.count ?? null
  if (group.value) return group.value.sections.reduce((n, x) => n + x.count, 0)
  return bkTotalProducts
})

const countText = computed(() => {
  const n = `${list.value.length} ${bkPlural(list.value.length, 'товар', 'товара', 'товаров')}`
  return siteCount.value && siteCount.value > list.value.length ? `${n} · в концепте часть из ${siteCount.value.toLocaleString('ru-RU')} на сайте` : n
})

const shown = ref(24)
watch(
  () => route.fullPath,
  () => (shown.value = 24),
)

const set = (patch: Record<string, string | undefined>) => {
  const next: Record<string, string> = {}
  for (const [k, v] of Object.entries({ ...route.query, ...patch })) if (v) next[k] = String(v)
  router.replace({ query: next })
}
const pickSection = (id: string) => set({ s: s.value === id ? undefined : id, g: undefined })
const pickGroup = (id: string) => set({ g: g.value === id && !s.value ? undefined : id, s: undefined })

const chips = computed(() =>
  [
    q.value && { key: 'q', label: `«${q.value}»` },
    section.value && { key: 's', label: section.value.title },
    !section.value && group.value && { key: 'g', label: group.value.title },
    o.value && { key: 'o', label: bkOccTitle(o.value) },
    budget.value && { key: 'p', label: budget.value.title },
  ].filter(Boolean) as { key: string; label: string }[],
)
const reset = () => router.replace({ query: {} })

const filtersOpen = ref(false)
const openGroup = ref<string | null>(null)
watchEffect(() => {
  if (group.value) openGroup.value = group.value.id
})
</script>

<template>
  <div class="bk-wrap bk-cat">
    <nav class="bk-crumbs">
      <NuxtLink :to="bkPath()">Главная</NuxtLink>
      <span><NuxtLink :to="bkPath('/catalog')">Каталог</NuxtLink></span>
      <span v-if="group && section"><NuxtLink :to="{ path: bkPath('/catalog'), query: { g: group.id } }">{{ group.title }}</NuxtLink></span>
    </nav>

    <div class="bk-cat__top">
      <div>
        <h1>{{ title }}</h1>
        <p>{{ countText }}</p>
      </div>
      <div class="bk-cat__tools">
        <button type="button" class="bk-btn bk-btn--line bk-cat__filterbtn" :aria-expanded="filtersOpen" @click="filtersOpen = !filtersOpen">
          <BkIcon name="menu" :size="20" /> Фильтры<template v-if="chips.length"> · {{ chips.length }}</template>
        </button>
        <label class="bk-select">
          <span class="bk-select__label">Сортировка</span>
          <select :value="sort" @change="set({ sort: ($event.target as HTMLSelectElement).value === 'popular' ? undefined : ($event.target as HTMLSelectElement).value })">
            <option v-for="x in sorts" :key="x.id" :value="x.id">{{ x.title }}</option>
          </select>
          <BkIcon name="down" :size="18" />
        </label>
      </div>
    </div>

    <div v-if="chips.length" class="bk-cat__chips">
      <button v-for="c in chips" :key="c.key" type="button" class="bk-tag is-on" @click="set({ [c.key]: undefined })">
        {{ c.label }} <BkIcon name="close" :size="16" />
      </button>
      <button type="button" class="bk-cat__reset" @click="reset">Сбросить всё</button>
    </div>

    <div class="bk-cat__layout">
      <aside class="bk-cat__side" :class="{ 'is-open': filtersOpen }">
        <div class="bk-cat__block">
          <h2>Разделы</h2>
          <div v-for="gr in bkGroups" :key="gr.id" class="bk-cat__group" :class="{ 'is-open': openGroup === gr.id }">
            <div class="bk-cat__grouphead">
              <button type="button" :class="{ 'is-on': g === gr.id && !s }" @click="pickGroup(gr.id)">
                <BkIcon :name="gr.icon" :size="20" /> {{ gr.title }}
              </button>
              <button type="button" class="bk-cat__toggle" :aria-label="openGroup === gr.id ? 'Свернуть' : 'Развернуть'" @click="openGroup = openGroup === gr.id ? null : gr.id">
                <BkIcon name="down" :size="18" />
              </button>
            </div>
            <ul v-if="openGroup === gr.id">
              <li v-for="sec in gr.sections" :key="sec.id">
                <button type="button" :class="{ 'is-on': s === sec.id }" @click="pickSection(sec.id)">
                  {{ sec.title }} <small>{{ sec.count }}</small>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div class="bk-cat__block">
          <h2>Кому</h2>
          <div class="bk-cat__tags">
            <button v-for="x in bkWhom" :key="x.id" type="button" class="bk-tag" :class="{ 'is-on': o === x.id }" @click="set({ o: o === x.id ? undefined : x.id })">{{ x.title }}</button>
          </div>
        </div>
        <div class="bk-cat__block">
          <h2>Повод</h2>
          <div class="bk-cat__tags">
            <button v-for="x in bkOccasions" :key="x.id" type="button" class="bk-tag" :class="{ 'is-on': o === x.id }" @click="set({ o: o === x.id ? undefined : x.id })">{{ x.title }}</button>
          </div>
        </div>
        <div class="bk-cat__block">
          <h2>Цена</h2>
          <div class="bk-cat__tags">
            <button v-for="b in bkBudgets" :key="b.id" type="button" class="bk-tag" :class="{ 'is-on': p === b.id }" @click="set({ p: p === b.id ? undefined : b.id })">{{ b.title }}</button>
          </div>
        </div>
        <button type="button" class="bk-btn bk-btn--accent bk-btn--wide bk-cat__apply" @click="filtersOpen = false">
          Показать {{ list.length }} {{ bkPlural(list.length, 'товар', 'товара', 'товаров') }}
        </button>
      </aside>

      <div class="bk-cat__list">
        <div v-if="list.length" class="bk-grid">
          <BkCard v-for="(x, i) in list.slice(0, shown)" :key="x.id" :product="x" :eager="i < 4" />
        </div>
        <div v-else class="bk-cat__empty">
          <BkIcon name="bouquet" :size="44" />
          <h2>Ничего не нашли</h2>
          <p>Снимите часть фильтров или позвоните — флорист соберёт букет под ваш запрос.</p>
          <div>
            <button type="button" class="bk-btn bk-btn--accent" @click="reset">Сбросить фильтры</button>
            <a :href="bkContacts.phoneHref" class="bk-btn bk-btn--line">{{ bkContacts.phone }}</a>
          </div>
        </div>
        <button v-if="list.length > shown" type="button" class="bk-btn bk-btn--line bk-btn--wide bk-cat__more" @click="shown += 24">
          Показать ещё {{ Math.min(24, list.length - shown) }} из {{ list.length - shown }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.bk-select {
  position: relative;
  display: inline-flex;
  align-items: center;

  &__label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  select {
    appearance: none;
    height: 48px;
    padding: 0 44px 0 16px;
    border: 1px solid var(--bk-line-strong);
    border-radius: var(--bk-r);
    background: #fff;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    outline: none;

    &:focus {
      border-color: var(--bk-accent);
    }
  }

  svg {
    position: absolute;
    right: 16px;
    pointer-events: none;
  }
}

.bk-cat {
  padding-bottom: 24px;

  &__top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px 24px;
    flex-wrap: wrap;
    margin-top: 16px;

    h1 {
      font-size: clamp(30px, 3vw, 44px);
    }

    p {
      margin-top: 6px;
      color: var(--bk-muted);
    }
  }

  &__tools {
    display: flex;
    gap: 10px;
  }

  &__filterbtn {
    display: none;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
  }

  &__reset {
    padding: 0 8px;
    color: var(--bk-accent);
    font-weight: 700;
    font-size: 14px;
  }

  &__layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 32px;
    margin-top: 28px;
    align-items: start;
  }

  &__side {
    display: grid;
    gap: 22px;
    padding: 22px;
    border-radius: var(--bk-r-panel);
    background: var(--bk-surface);
  }

  &__block h2 {
    margin-bottom: 10px;
    font-size: 17px;
  }

  &__group {
    border-bottom: 1px solid var(--bk-line);

    ul {
      display: grid;
      padding: 0 0 10px 30px;
    }

    li button {
      display: flex;
      align-items: baseline;
      gap: 6px;
      width: 100%;
      padding: 5px 0;
      font-size: 15px;
      font-weight: 600;
      text-align: left;

      small {
        color: var(--bk-muted);
        font-size: 13px;
      }

      &:hover,
      &.is-on {
        color: var(--bk-accent);
      }

      &.is-on {
        font-weight: 800;
      }
    }

    &.is-open .bk-cat__toggle svg {
      transform: rotate(180deg);
    }
  }

  &__grouphead {
    display: flex;
    align-items: center;

    > button:first-child {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 44px;
      font-weight: 800;
      text-align: left;

      svg {
        color: var(--bk-accent);
      }

      &.is-on {
        color: var(--bk-accent);
      }
    }
  }

  &__toggle {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;

    &:hover {
      background: #fff;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .bk-tag:not(.is-on) {
      background: #fff;
    }
  }

  &__apply {
    display: none;
  }

  &__more {
    margin-top: 32px;
  }

  &__empty {
    display: grid;
    justify-items: center;
    gap: 12px;
    padding: 56px 24px;
    border-radius: var(--bk-r-panel);
    background: var(--bk-gray);
    text-align: center;

    svg {
      color: var(--bk-accent);
    }

    p {
      max-width: 420px;
      color: var(--bk-muted);
    }

    div {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-top: 8px;
    }
  }
}

@media (max-width: 1199px) {
  .bk-cat__layout {
    grid-template-columns: 250px minmax(0, 1fr);
    gap: 24px;
  }

  .bk-cat .bk-grid {
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  }
}

@media (max-width: 989px) {
  .bk-cat {
    &__filterbtn {
      display: inline-flex;
    }

    &__layout {
      grid-template-columns: minmax(0, 1fr);
      margin-top: 20px;
    }

    &__side {
      display: none;

      &.is-open {
        display: grid;
      }
    }

    &__apply {
      display: inline-flex;
    }
  }
}

@media (max-width: 768px) {
  .bk-cat {
    &__top {
      margin-top: 12px;
    }

    &__tools {
      width: 100%;

      > * {
        flex: 1;
      }
    }

    .bk-select select {
      width: 100%;
    }

    &__side {
      padding: 18px;
      border-radius: 22px;
    }
  }

  .bk-cat .bk-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 375px) {
  .bk-cat__tools .bk-btn,
  .bk-select select {
    padding-left: 12px;
    font-size: 14px;
  }
}
</style>
