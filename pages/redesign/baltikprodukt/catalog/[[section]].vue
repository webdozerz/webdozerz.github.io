<script lang="ts" setup>
import BpIcon from '~/components/redesign/baltikprodukt/BpIcon.vue'
import BpRow from '~/components/redesign/baltikprodukt/BpRow.vue'

// Прайс: все 354 позиции одной страницей с разделами, поиском из шапки, метками и сортировкой.
const route = useRoute()
const router = useRouter()
const q = useState<string>('bp-q', () => '')
const list = useBaltikproduktList()
const sectionId = computed(() => (route.params.section as string) || '')
const section = computed(() => (sectionId.value ? bpSection(sectionId.value) : undefined))

useSeoMeta({ title: () => `${section.value?.full ?? 'Прайс'} — Балтик продукт | Концепт редизайна` })

const filters = [
  { id: 'all', label: 'Все' },
  { id: 'flag', label: 'Акции и новинки' },
  { id: 'box', label: 'Коробкой дешевле' },
  { id: 'stock', label: 'Без «ожидается»' },
] as const
type FilterId = (typeof filters)[number]['id']
const filter = ref<FilterId>('all')
const origin = ref('')
const sort = ref<'price' | 'asc' | 'desc'>('price')

const base = computed(() => (section.value ? bpProducts.filter((p) => p.section === section.value!.id) : bpProducts))
const found = computed(() => {
  let list = bpSearch(q.value, base.value)
  if (filter.value === 'flag') list = list.filter((p) => p.flag === 'sale' || p.flag === 'new')
  if (filter.value === 'box') list = list.filter((p) => p.boxPrice)
  if (filter.value === 'stock') list = list.filter((p) => p.flag !== 'wait')
  if (origin.value) list = list.filter((p) => p.origin === origin.value)
  if (sort.value !== 'price') {
    const dir = sort.value === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => ((a.price ?? Infinity) - (b.price ?? Infinity)) * dir)
  }
  return list
})
// Без раздела — группами по разделам, как в прайсе оригинала.
const groups = computed(() =>
  bpSections.map((s) => ({ section: s, items: found.value.filter((p) => p.section === s.id) })).filter((g) => g.items.length),
)
const allHits = computed(() => (q.value.trim() ? bpSearch(q.value).length : 0))
const origins = computed(() => [...new Set(base.value.map((p) => p.origin).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, 'ru')))

const reset = () => {
  q.value = ''
  filter.value = 'all'
  origin.value = ''
}

onMounted(() => {
  if (typeof route.query.q === 'string') q.value = route.query.q
})
watch(q, (v) => {
  const query = { ...route.query }
  if (v.trim()) query.q = v.trim()
  else delete query.q
  router.replace({ query })
})
watch(
  () => route.query.q,
  (v) => {
    if (typeof v === 'string' && v !== q.value) q.value = v
  },
)
watch(sectionId, () => {
  origin.value = ''
})
</script>

<template>
  <div class="bp-wrap bp-cat">
    <aside class="bp-cat__side" aria-label="Разделы прайса">
      <nav class="bp-cat__nav">
        <NuxtLink :to="{ path: bpSectionPath(), query: route.query }" class="bp-cat__link" :class="{ 'is-on': !sectionId }">
          <span class="bp-cat__all"><BpIcon name="grid" :size="20" /></span>
          <span>Весь прайс</span>
          <small>{{ bpProducts.length }}</small>
        </NuxtLink>
        <NuxtLink
          v-for="s in bpSections"
          :key="s.id"
          :to="{ path: bpSectionPath(s.id), query: route.query }"
          class="bp-cat__link"
          :class="{ 'is-on': sectionId === s.id }"
        >
          <img :src="bpImg(s.img)" alt="" width="36" height="36" />
          <span>{{ s.title }}</span>
          <small>{{ s.count }}</small>
        </NuxtLink>
      </nav>
      <a :href="bpContacts.price" class="bp-cat__xlsx" download>
        <BpIcon name="download" :size="20" />
        <span>
          <b>Крупнооптовый прайс</b>
          <small>.xlsx, от {{ bpContacts.priceDate }}</small>
        </span>
      </a>
    </aside>

    <div class="bp-cat__body">
      <div class="bp-cat__head">
        <h1>{{ section?.full ?? 'Прайс-лист' }}</h1>
        <p>
          <template v-if="q.trim()">
            Найдено {{ found.length }} по запросу «{{ q.trim() }}»
            <button type="button" class="bp-cat__clear" @click="q = ''">сбросить</button>
          </template>
          <template v-else>{{ found.length }} позиций · цены {{ list.mode.value === 'retail' ? 'розничные (опт +3 %)' : 'оптовые' }}</template>
        </p>
      </div>

      <div class="bp-cat__tools">
        <div class="bp-cat__chips">
          <button v-for="f in filters" :key="f.id" type="button" :class="{ 'is-on': filter === f.id }" @click="filter = f.id">{{ f.label }}</button>
        </div>
        <div class="bp-cat__selects">
          <label class="bp-select">
            <select v-model="origin" aria-label="Производитель">
              <option value="">Все производители</option>
              <option v-for="o in origins" :key="o" :value="o">{{ o }}</option>
            </select>
            <BpIcon name="down" :size="18" />
          </label>
          <label class="bp-select">
            <select v-model="sort" aria-label="Сортировка">
              <option value="price">Как в прайсе</option>
              <option value="asc">Сначала дешевле</option>
              <option value="desc">Сначала дороже</option>
            </select>
            <BpIcon name="down" :size="18" />
          </label>
        </div>
      </div>

      <p class="bp-cat__note">
        <BpIcon name="info" :size="18" />
        <span>{{ bpTerms.minimum }} Цена за кг или штуку; «коробкой» — цена при покупке целой коробки.</span>
      </p>

      <div v-if="!found.length" class="bp-cat__empty">
        <b>{{ section && q.trim() ? `В разделе «${section.title}» ничего не нашли` : 'Ничего не нашли' }}</b>
        <NuxtLink v-if="section && q.trim() && allHits" :to="{ path: bpSectionPath(), query: { q: q.trim() } }" class="bp-btn">
          Во всём прайсе — {{ allHits }} поз.
        </NuxtLink>
        <p>
          Проверьте написание или позвоните: <a :href="bpContacts.phones[0].href">{{ bpContacts.phones[0].label }}</a> — менеджер подскажет, что есть на
          складе.
        </p>
        <button type="button" class="bp-btn bp-btn--soft" @click="reset">Сбросить фильтры</button>
      </div>

      <template v-else-if="section">
        <div class="bp-rows">
          <BpRow v-for="p in found" :key="p.id" :product="p" />
        </div>
      </template>
      <template v-else>
        <section v-for="g in groups" :key="g.section.id" class="bp-cat__group">
          <h2>
            <NuxtLink :to="bpSectionPath(g.section.id)">{{ g.section.title }}</NuxtLink>
            <small>{{ g.items.length }}</small>
          </h2>
          <div class="bp-rows">
            <BpRow v-for="p in g.items" :key="p.id" :product="p" />
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.bp-cat {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 32px;
  padding-top: 28px;

  &__side {
    position: sticky;
    top: 104px;
    align-self: start;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    scrollbar-width: thin;
    display: grid;
    gap: 16px;
  }
  &__nav {
    display: grid;
    gap: 4px;
  }
  &__link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 10px 4px 4px;
    border-radius: 14px;
    font-weight: 500;
    line-height: 1.25;

    img,
    .bp-cat__all {
      flex: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }
    > span:not(.bp-cat__all) {
      flex: 1;
      min-width: 0;
    }
    small {
      color: var(--bp-muted);
      font-size: 13px;
    }
    &:hover {
      background: var(--bp-surface);
    }
    &.is-on {
      background: var(--bp-soft);
      color: var(--bp-accent);
      font-weight: 600;
    }
  }
  &__all {
    display: grid;
    place-items: center;
    background: var(--bp-surface);
    color: var(--bp-accent);
  }
  &__xlsx {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 16px;
    border: 1px solid var(--bp-line);
    color: var(--bp-green);

    span {
      display: grid;
      line-height: 1.3;
    }
    b {
      color: var(--bp-ink);
      font-weight: 600;
    }
    small {
      color: var(--bp-muted);
      font-size: 13px;
    }
    &:hover {
      border-color: var(--bp-green);
    }
  }
  &__head {
    h1 {
      font-size: clamp(26px, 2.6vw, 36px);
      font-weight: 800;
      line-height: 1.15;
    }
    p {
      margin-top: 6px;
      color: var(--bp-muted);
    }
  }
  &__clear {
    margin-left: 6px;
    color: var(--bp-accent);
    font-weight: 600;
    text-decoration: underline;
  }
  &__tools {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
    margin-top: 20px;
  }
  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    button {
      height: 40px;
      padding: 0 16px;
      border-radius: 20px;
      background: var(--bp-surface);
      font-weight: 500;
      white-space: nowrap;

      &:hover {
        color: var(--bp-accent);
      }
      &.is-on {
        background: var(--bp-ink);
        color: #fff;
      }
    }
  }
  &__selects {
    display: flex;
    gap: 8px;
  }
  &__note {
    display: flex;
    gap: 8px;
    margin: 16px 0 12px;
    color: var(--bp-muted);
    font-size: 14px;

    svg {
      flex: none;
      margin-top: 2px;
      color: var(--bp-accent);
    }
  }
  &__group {
    margin-top: 28px;

    &:first-of-type {
      margin-top: 8px;
    }
    h2 {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin: 0 0 10px 4px;
      font-size: 22px;
      font-weight: 800;

      a:hover {
        color: var(--bp-accent);
      }
    }
    small {
      color: var(--bp-muted);
      font-family: Inter, sans-serif;
      font-size: 14px;
      font-weight: 500;
    }
  }
  &__empty {
    display: grid;
    justify-items: start;
    gap: 10px;
    padding: 32px;
    border-radius: var(--bp-R);
    background: var(--bp-surface);

    b {
      font-size: 20px;
    }
    a {
      color: var(--bp-accent);
      font-weight: 600;
      white-space: nowrap;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: 240px minmax(0, 1fr);
    gap: 24px;
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    padding-top: 16px;

    &__side {
      position: static;
      max-height: none;
      overflow: visible;
      min-width: 0;
    }
    &__nav {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: none;
      mask-image: linear-gradient(90deg, #000 85%, transparent);
    }
    &__link {
      flex: none;
      padding-right: 14px;
      background: var(--bp-surface);
      white-space: nowrap;

      small {
        display: none;
      }
    }
    &__xlsx {
      display: none;
    }
  }
  @media (max-width: 768px) {
    &__chips {
      flex-wrap: nowrap;
      overflow-x: auto;
      width: 100%;
      scrollbar-width: none;
    }
    &__selects {
      width: 100%;

      .bp-select {
        flex: 1;
        min-width: 0;
      }
    }
  }
}

.bp-select {
  position: relative;
  display: inline-flex;
  align-items: center;

  select {
    width: 100%;
    height: 40px;
    padding: 0 40px 0 14px;
    border: 1px solid var(--bp-line);
    border-radius: 12px;
    background: #fff;
    appearance: none;
    cursor: pointer;
    text-overflow: ellipsis;
  }
  svg {
    position: absolute;
    right: 14px;
    pointer-events: none;
    color: var(--bp-muted);
  }
}
</style>
