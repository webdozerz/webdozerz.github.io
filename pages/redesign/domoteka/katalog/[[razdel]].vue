<script lang="ts" setup>
// Каталог: фильтры оригинала — тип, серия, размер кухни, размер стола, механизм раскладки, у стульев стиль;
// сортировка «по популярности / по наименованию», подгрузка по 9 моделей, как их страницы.
import { dmChairStyles, dmKitchen, dmMech, dmPath, dmSeries, dmSizes, dmTypeName, dmTypes } from '~/utils/domoteka'
import { dmProducts } from '~/utils/domoteka.data'
import { useDmUi } from '~/composables/useDomoteka'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'
import DmCard from '~/components/redesign/domoteka/DmCard.vue'

const route = useRoute()
const router = useRouter()
const ui = useDmUi()
const razdel = computed(() => (route.params.razdel as string) || 'stoly')
const isChairs = computed(() => razdel.value === 'stulya')
const isSale = computed(() => razdel.value === 'akcii')

const title = computed(() => (isChairs.value ? 'Стулья' : isSale.value ? 'Акции' : 'Столы'))
useSeoMeta({ title: () => `${title.value} — фабрика «Домотека» | Концепт редизайна` })

const PAGE = 9
const shown = ref(PAGE)
const list = (k: string) => String(route.query[k] || '').split(',').filter(Boolean)
const sort = computed(() => String(route.query.sort || 'pop'))
const q = computed(() => String(route.query.q || '').trim().toLowerCase())

const base = computed(() =>
  dmProducts.filter((p) => {
    if (isSale.value) return p.tags.includes('sale')
    if (q.value && !route.params.razdel) return true
    return p.sec === (isChairs.value ? 'stulya' : 'stoly')
  }),
)
type Group = { key: string; label: string; opts: { id: string; n: string }[]; match: (p: (typeof dmProducts)[number], v: string) => boolean }
const groups = computed<Group[]>(() =>
  isChairs.value
    ? [
        { key: 'series', label: 'Серия', opts: [{ id: 'Модена', n: 'Модена' }], match: (p, v) => p.series === v },
        { key: 'style', label: 'Стиль', opts: dmChairStyles.map((s) => ({ id: s, n: s })), match: (p, v) => !!p.style?.includes(v) },
      ]
    : [
        { key: 'type', label: 'Тип', opts: dmTypes.map((t) => ({ id: t.id, n: t.short })), match: (p, v) => p.type === v },
        { key: 'kitchen', label: 'Размер кухни', opts: dmKitchen, match: (p, v) => p.kitchen.includes(v) },
        { key: 'size', label: 'Размер стола, см', opts: dmSizes, match: (p, v) => p.sk === v },
        { key: 'mech', label: 'Механизм раскладки', opts: dmMech, match: (p, v) => p.mk === v },
        { key: 'series', label: 'Серия', opts: dmSeries.map((s) => ({ id: s, n: s })), match: (p, v) => p.series === v },
      ],
)
const passes = (p: (typeof dmProducts)[number], skip?: string) => {
  if (q.value && !`${p.n} ${p.series} ${dmTypeName(p.type)}`.toLowerCase().includes(q.value)) return false
  return groups.value.every((g) => {
    if (g.key === skip) return true
    const vals = list(g.key)
    return !vals.length || vals.some((v) => g.match(p, v))
  })
}
const items = computed(() => {
  const r = base.value.filter((p) => passes(p))
  if (sort.value === 'name') return [...r].sort((a, b) => a.n.localeCompare(b.n, 'ru'))
  return [...r].sort((a, b) => Number(b.tags.includes('hit')) - Number(a.tags.includes('hit')))
})
// число моделей у варианта фильтра с учётом остальных выбранных групп
const countFor = (g: Group, v: string) => base.value.filter((p) => passes(p, g.key) && g.match(p, v)).length
const active = computed(() => groups.value.flatMap((g) => list(g.key).map((v) => ({ key: g.key, id: v, n: g.opts.find((o) => o.id === v)?.n || v }))))

const setQuery = (patch: Record<string, string | undefined>) => {
  const query: Record<string, string> = {}
  Object.entries({ ...route.query, ...patch }).forEach(([k, v]) => {
    if (v) query[k] = String(v)
  })
  router.replace({ query })
}
const toggle = (key: string, v: string) => {
  const cur = list(key)
  const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]
  setQuery({ [key]: next.join(',') || undefined })
}
const reset = () => router.replace({ query: q.value ? { q: q.value } : {} })
watch(
  () => route.fullPath,
  () => (shown.value = PAGE),
)
const filtersOpen = computed({
  get: () => ui.modal.value === 'filters',
  set: (v) => (ui.modal.value = v ? 'filters' : ''),
})
const tabs = [
  { id: 'stoly', n: 'Столы' },
  { id: 'stulya', n: 'Стулья' },
  { id: 'akcii', n: 'Акции' },
]
</script>

<template>
  <div class="dm-wrap dm-cat">
    <div class="dm-page-head">
      <nav class="dm-crumbs" aria-label="Навигация">
        <NuxtLink :to="dmPath('/')">Главная</NuxtLink><span>{{ title }}</span>
      </nav>
      <h1 class="dm-h1">{{ q ? `Поиск: «${route.query.q}»` : title }}</h1>
      <p v-if="isSale" class="dm-lead">Модели со специальной ценой у дилеров и в интернет-магазинах — уточняйте в магазине вашего города.</p>
      <p v-else-if="!isChairs && !q" class="dm-lead">Более 1300 сочетаний цвета столешницы и ножек — все модели в наличии на складе фабрики.</p>
      <div class="dm-cat__tabs">
        <NuxtLink v-for="t in tabs" :key="t.id" :to="dmPath(`/katalog/${t.id}/`)" class="dm-seg" :class="{ 'is-on': razdel === t.id && !q }">{{ t.n }}</NuxtLink>
      </div>
    </div>

    <div class="dm-cat__layout" :class="{ 'is-flat': isSale }">
      <aside v-if="!isSale" class="dm-filters" :class="{ 'is-open': filtersOpen }" aria-label="Фильтры">
        <div class="dm-filters__head">
          <b>Фильтры</b>
          <button type="button" class="dm-iconbtn" aria-label="Закрыть фильтры" @click="filtersOpen = false"><DmIcon name="close" /></button>
        </div>
        <div class="dm-filters__body">
          <fieldset v-for="g in groups" :key="g.key" class="dm-filters__group" :class="`dm-filters__group--${g.key}`">
            <legend>{{ g.label }}</legend>
            <label v-for="o in g.opts" :key="o.id" class="dm-check dm-filters__opt" :class="{ 'is-zero': !countFor(g, o.id) && !list(g.key).includes(o.id) }">
              <input type="checkbox" :checked="list(g.key).includes(o.id)" @change="toggle(g.key, o.id)" />
              <span>{{ o.n }}</span>
              <small>{{ countFor(g, o.id) }}</small>
            </label>
          </fieldset>
        </div>
        <div class="dm-filters__foot">
          <button type="button" class="dm-btn dm-btn--line" @click="reset">Сбросить</button>
          <button type="button" class="dm-btn" @click="filtersOpen = false">Показать {{ items.length }}</button>
        </div>
      </aside>

      <div class="dm-cat__main">
        <div class="dm-cat__bar">
          <button v-if="!isSale" type="button" class="dm-btn dm-btn--line dm-cat__fbtn" @click="filtersOpen = true">
            <DmIcon name="filter" />Фильтры<b v-if="active.length" class="dm-cat__fcount">{{ active.length }}</b>
          </button>
          <span class="dm-cat__found">{{ items.length }} {{ items.length % 10 === 1 && items.length !== 11 ? 'модель' : [2, 3, 4].includes(items.length % 10) && ![12, 13, 14].includes(items.length) ? 'модели' : 'моделей' }}</span>
          <label class="dm-field dm-cat__sort">
            <span class="dm-sr">Сортировка</span>
            <select :value="sort" @change="setQuery({ sort: ($event.target as HTMLSelectElement).value === 'pop' ? undefined : ($event.target as HTMLSelectElement).value })">
              <option value="pop">По популярности</option>
              <option value="name">По наименованию</option>
            </select>
          </label>
        </div>
        <div v-if="active.length" class="dm-cat__active">
          <button v-for="a in active" :key="a.key + a.id" type="button" class="dm-chip is-on" @click="toggle(a.key, a.id)">{{ a.n }}<DmIcon name="close" /></button>
          <button type="button" class="dm-cat__reset" @click="reset">Сбросить всё</button>
        </div>

        <div v-if="items.length" class="dm-grid dm-cat__grid">
          <DmCard v-for="p in items.slice(0, shown)" :key="p.id" :p="p" />
        </div>
        <div v-else class="dm-empty">
          <DmIcon name="search" />
          <b>Таких моделей нет</b>
          <p>Попробуйте убрать часть фильтров — или задайте вопрос, подскажем похожую модель.</p>
          <button type="button" class="dm-btn" @click="reset">Сбросить фильтры</button>
        </div>
        <div v-if="items.length > shown" class="dm-cat__more">
          <button type="button" class="dm-btn dm-btn--line dm-btn--big" @click="shown += PAGE">Показать ещё {{ Math.min(PAGE, items.length - shown) }}</button>
          <span>Показано {{ shown }} из {{ items.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.dm .dm-cat {
  .dm-cat__tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
    .dm-seg {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
    }
  }
  .dm-cat__layout {
    display: grid;
    grid-template-columns: 270px minmax(0, 1fr);
    gap: 28px;
    align-items: start;
    margin-top: 24px;
    &.is-flat {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  .dm-filters {
    padding: 4px 18px 18px;
    border-radius: var(--dm-r2);
    background: var(--dm-surf);
    scrollbar-width: thin;
  }
  .dm-filters__head {
    display: none;
  }
  .dm-filters__group {
    display: grid;
    gap: 2px;
    margin: 0;
    padding: 16px 0 12px;
    border: 0;
    border-bottom: 1px solid #dfe2ea;
    legend {
      float: left;
      width: 100%;
      margin-bottom: 8px;
      font: 700 15px/1.2 var(--dm-head);
    }
    &:last-child {
      border-bottom: 0;
    }
  }
  .dm-filters__group--series {
    display: flex;
    flex-wrap: wrap;
    column-gap: 8px;
    legend {
      flex: 0 0 100%;
    }
    .dm-filters__opt {
      flex: 0 0 calc(50% - 4px);
    }
  }
  .dm-filters__opt {
    align-items: center;
    padding: 5px 0;
    span {
      flex: 1;
    }
    small {
      color: var(--dm-muted);
      font-size: 13px;
    }
    &.is-zero {
      opacity: 0.45;
    }
  }
  .dm-filters__foot {
    display: none;
  }
  .dm-cat__bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .dm-cat__fbtn {
    display: none;
  }
  .dm-cat__fcount {
    min-width: 20px;
    padding: 2px 6px;
    border-radius: 10px;
    background: var(--dm-or);
    color: #fff;
    font-size: 12px;
  }
  .dm-cat__found {
    color: var(--dm-muted);
  }
  .dm-cat__sort {
    margin-left: auto;
    select {
      min-height: 42px;
      width: auto;
    }
  }
  .dm-cat__active {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    .dm-icon {
      width: 15px;
      height: 15px;
    }
  }
  .dm-cat__reset {
    padding: 0;
    border: 0;
    background: none;
    color: var(--dm-acc);
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
  }
  .dm-cat__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .dm-cat__layout.is-flat .dm-cat__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .dm-cat__more {
    display: grid;
    justify-items: center;
    gap: 8px;
    margin-top: 28px;
    span {
      font-size: 14px;
      color: var(--dm-muted);
    }
  }
}
.dm .dm-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
@media (max-width: 1199px) {
  .dm .dm-cat {
    .dm-cat__layout {
      grid-template-columns: 240px minmax(0, 1fr);
      gap: 20px;
    }
    .dm-cat__grid,
    .dm-cat__layout.is-flat .dm-cat__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .dm-cat__layout.is-flat .dm-cat__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
@media (max-width: 989px) {
  .dm .dm-cat {
    .dm-cat__layout {
      grid-template-columns: minmax(0, 1fr);
    }
    .dm-cat__fbtn {
      display: inline-flex;
    }
    .dm-filters {
      position: fixed;
      inset: 0 auto 0 0;
      z-index: 125;
      display: none;
      width: min(380px, 90vw);
      max-height: none;
      padding: 0;
      border-radius: 0;
      background: #fff;
      box-shadow: 0 0 0 100vmax rgba(22, 31, 58, 0.45);
      &.is-open {
        display: flex;
        flex-direction: column;
      }
    }
    .dm-filters__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px 10px 20px;
      border-bottom: 1px solid var(--dm-line);
      b {
        font: 800 20px/1 var(--dm-head);
      }
    }
    .dm-filters__body {
      flex: 1;
      overflow-y: auto;
      padding: 0 20px;
    }
    .dm-filters__foot {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 8px;
      padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
      border-top: 1px solid var(--dm-line);
    }
  }
}
@media (max-width: 768px) {
  .dm .dm-cat {
    .dm-cat__layout.is-flat .dm-cat__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
@media (max-width: 576px) {
  .dm .dm-cat {
    .dm-cat__grid,
    .dm-cat__layout.is-flat .dm-cat__grid {
      grid-template-columns: minmax(0, 1fr);
    }
    .dm-cat__found {
      display: none;
    }
    .dm-cat__sort {
      flex: 1;
      min-width: 0;
      select {
        width: 100%;
      }
    }
  }
}
</style>
