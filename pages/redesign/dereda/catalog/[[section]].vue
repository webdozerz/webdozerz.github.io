<script lang="ts" setup>
import DrCard from '~/components/redesign/dereda/DrCard.vue'
import DrIcon from '~/components/redesign/dereda/DrIcon.vue'

const route = useRoute()
const router = useRouter()

const secId = computed(() => String(route.params.section ?? ''))
const sec = computed(() => (secId.value ? drSection(secId.value) : undefined))
const qv = (k: string) => (typeof route.query[k] === 'string' ? (route.query[k] as string) : '')
const sub = computed(() => qv('sub'))
const farmerId = computed(() => qv('farmer'))
const farmer = computed(() => drFarmer(farmerId.value || null))
const q = computed(() => qv('q').trim())
const tag = computed(() => qv('tag'))
const sort = computed(() => qv('sort') || 'pop')
const stockOnly = computed(() => qv('stock') === '1')

const setQuery = (patch: Record<string, string | undefined>) => {
  const next: Record<string, string> = {}
  for (const [k, v] of Object.entries({ ...route.query, ...patch })) if (typeof v === 'string' && v) next[k] = v
  router.replace({ query: next })
}

// Цена от/до — поля с задержкой, чтобы не дёргать адрес на каждую цифру
const min = ref(qv('min'))
const max = ref(qv('max'))
let priceTimer: ReturnType<typeof setTimeout> | undefined
watch([min, max], () => {
  clearTimeout(priceTimer)
  priceTimer = setTimeout(() => setQuery({ min: min.value.replace(/\D/g, ''), max: max.value.replace(/\D/g, '') }), 400)
})

const base = computed(() => {
  let list = drProducts
  if (sec.value) list = list.filter((p) => p.sec === sec.value!.id)
  if (sub.value) list = list.filter((p) => p.sub === sub.value)
  if (tag.value === 'new') list = list.filter((p) => p.isNew)
  if (tag.value === 'sale') list = list.filter((p) => p.sale)
  if (q.value) {
    const s = q.value.toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(s) || p.sub.toLowerCase().includes(s) || drSection(p.sec)?.title.toLowerCase().includes(s))
  }
  return list
})
// Фермеры, у которых есть товары в текущей выборке
const farmersHere = computed(() => {
  const ids = new Set(base.value.map((p) => p.farmer).filter(Boolean) as string[])
  return drFarmers.filter((f) => ids.has(f.id))
})
const list = computed(() => {
  let l = base.value
  if (farmerId.value) l = l.filter((p) => p.farmer === farmerId.value)
  if (stockOnly.value) l = l.filter((p) => p.stock !== 'out')
  const lo = Number(qv('min')) || 0
  const hi = Number(qv('max')) || Infinity
  l = l.filter((p) => {
    const pr = drPriceOf(p, drFirstOn(p))
    return pr >= lo && pr <= hi
  })
  const by = [...l]
  if (sort.value === 'cheap') by.sort((a, b) => drPriceOf(a) - drPriceOf(b))
  if (sort.value === 'dear') by.sort((a, b) => drPriceOf(b) - drPriceOf(a))
  if (sort.value === 'new') by.sort((a, b) => Number(b.isNew) - Number(a.isNew))
  if (sort.value === 'name') by.sort((a, b) => a.title.localeCompare(b.title, 'ru'))
  return by
})

const title = computed(() => {
  if (q.value) return `Поиск: «${q.value}»`
  if (sub.value) return sub.value
  if (sec.value) return sec.value.title
  if (tag.value === 'new') return 'Новинки'
  if (tag.value === 'sale') return 'Товары по акции'
  if (farmer.value) return farmer.value.name
  return 'Каталог'
})
const total = computed(() => {
  if (sub.value && sec.value) return sec.value.subs.find((s) => s.title === sub.value)?.total
  if (sec.value) return sec.value.total
  if (tag.value === 'new') return 30
  if (tag.value === 'sale') return 21
  return undefined
})
// Подразделы, у которых в выборке концепта есть товары
const subsOf = drSubsOf
const filtersOn = computed(() => !!(farmerId.value || stockOnly.value || qv('min') || qv('max')))
const reset = () => {
  min.value = ''
  max.value = ''
  setQuery({ farmer: undefined, stock: undefined, min: undefined, max: undefined })
}
const drawer = ref(false)

useSeoMeta({ title: () => `${title.value} — Дереда | Концепт редизайна` })
</script>

<template>
  <div class="dr-wrap dr-page dr-cat">
    <nav class="dr-crumbs" aria-label="Навигация">
      <NuxtLink :to="drPath('/')">Главная</NuxtLink>
      <span><NuxtLink :to="drPath('/catalog')">Каталог</NuxtLink></span>
      <span v-if="sec"><NuxtLink :to="drPath(`/catalog/${sec.id}`)">{{ sec.title }}</NuxtLink></span>
      <span v-if="sub">{{ sub }}</span>
    </nav>

    <div class="dr-cat__head">
      <h1>{{ title }}</h1>
      <p v-if="farmer && !q" class="dr-cat__farmer">
        <DrIcon name="farmer" :size="20" />{{ farmer.about }}
        <NuxtLink :to="drPath('/fermery') + `#${farmer.id}`">О фермере</NuxtLink>
      </p>
    </div>

    <div v-if="sec && subsOf(sec.id).length" class="dr-cat__subs">
      <NuxtLink :to="{ query: { ...route.query, sub: undefined } }" :class="{ 'is-on': !sub }">Все</NuxtLink>
      <NuxtLink v-for="s in subsOf(sec.id)" :key="s.title" :to="{ query: { ...route.query, sub: s.title } }" :class="{ 'is-on': sub === s.title }">
        {{ s.title }}
      </NuxtLink>
    </div>

    <div class="dr-cat__layout">
      <aside class="dr-cat__side" :class="{ 'is-open': drawer }">
        <div class="dr-cat__sidehead">
          <b>Фильтры</b>
          <button type="button" aria-label="Закрыть фильтры" @click="drawer = false"><DrIcon name="close" :size="24" /></button>
        </div>
        <nav class="dr-cat__tree" aria-label="Разделы">
          <NuxtLink :to="drPath('/catalog')" :class="{ 'is-on': !sec && !tag }">Все товары</NuxtLink>
          <NuxtLink :to="{ path: drPath('/catalog'), query: { tag: 'new' } }" :class="{ 'is-on': tag === 'new' }">Новинки</NuxtLink>
          <NuxtLink :to="{ path: drPath('/catalog'), query: { tag: 'sale' } }" :class="{ 'is-on': tag === 'sale' }">Товары по акции</NuxtLink>
          <template v-for="s in drSections" :key="s.id">
            <NuxtLink :to="drPath(`/catalog/${s.id}`)" :class="{ 'is-on': sec?.id === s.id && !sub }">
              {{ s.title }} <small>{{ s.total }}</small>
            </NuxtLink>
            <div v-if="sec?.id === s.id && subsOf(s.id).length" class="dr-cat__treesub">
              <NuxtLink v-for="x in subsOf(s.id)" :key="x.title" :to="{ path: drPath(`/catalog/${s.id}`), query: { sub: x.title } }" :class="{ 'is-on': sub === x.title }">
                {{ x.title }}
              </NuxtLink>
            </div>
          </template>
        </nav>

        <div class="dr-cat__filter">
          <h3>Фермер</h3>
          <label class="dr-check">
            <input type="radio" name="farmer" :checked="!farmerId" @change="setQuery({ farmer: undefined })" />
            <span>Все</span>
          </label>
          <label v-for="f in farmersHere" :key="f.id" class="dr-check">
            <input type="radio" name="farmer" :checked="farmerId === f.id" @change="setQuery({ farmer: f.id })" />
            <span>{{ f.name }}</span>
          </label>
        </div>
        <div class="dr-cat__filter">
          <h3>Цена, ₽</h3>
          <div class="dr-cat__price">
            <label class="dr-field"><input v-model="min" inputmode="numeric" placeholder="от" aria-label="Цена от" /></label>
            <label class="dr-field"><input v-model="max" inputmode="numeric" placeholder="до" aria-label="Цена до" /></label>
          </div>
          <label class="dr-check">
            <input type="checkbox" :checked="stockOnly" @change="setQuery({ stock: stockOnly ? undefined : '1' })" />
            <span>Только в наличии</span>
          </label>
        </div>
        <div class="dr-cat__sidebtns">
          <button type="button" class="dr-btn dr-btn--line" :disabled="!filtersOn" @click="reset">Сбросить</button>
          <button type="button" class="dr-btn dr-btn--main dr-cat__apply" @click="drawer = false">Показать {{ list.length }}</button>
        </div>
      </aside>

      <div class="dr-cat__main">
        <div class="dr-cat__bar">
          <button type="button" class="dr-btn dr-btn--line dr-cat__filtersbtn" @click="drawer = true">
            <DrIcon name="filter" :size="20" />Фильтры<i v-if="filtersOn" />
          </button>
          <p class="dr-cat__count">
            {{ list.length }} {{ drPlural(list.length, 'товар', 'товара', 'товаров') }}
            <span v-if="total && !filtersOn && !q" class="dr-hide-s"> · в концепте выборка, на сайте {{ total }}</span>
          </p>
          <label class="dr-field dr-cat__sort">
            <select :value="sort" aria-label="Сортировка" @change="setQuery({ sort: ($event.target as HTMLSelectElement).value })">
              <option value="pop">По порядку</option>
              <option value="cheap">Дешевле</option>
              <option value="dear">Дороже</option>
              <option value="new">Сначала новые</option>
              <option value="name">По названию</option>
            </select>
          </label>
        </div>

        <div v-if="list.length" class="dr-grid dr-cat__grid">
          <DrCard v-for="p in list" :key="p.id" :p="p" />
        </div>
        <div v-else class="dr-empty">
          <img src="/redesign/dereda/girl.png" alt="" width="61" height="88" style="width: 61px" />
          <h3>Ничего не нашли</h3>
          <p class="dr-muted">Попробуйте другое слово или сбросьте фильтры.</p>
          <button type="button" class="dr-btn dr-btn--line" @click="reset">Сбросить фильтры</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.dr-cat {
  &__head {
    display: grid;
    gap: 8px;
    margin-bottom: 18px;
  }

  &__farmer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 10px;
    color: var(--dr-text);

    svg {
      color: var(--dr-brown);
    }

    a {
      color: var(--dr-accent);
      font-weight: 600;
    }
  }

  &__subs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;

    a {
      flex: none;
      padding: 9px 16px;
      border-radius: 999px;
      background: var(--dr-surface);
      font-weight: 600;
      white-space: nowrap;

      &.is-on {
        background: var(--dr-brown);
        color: #fff;
      }
    }
  }

  &__layout {
    display: grid;
    grid-template-columns: 270px minmax(0, 1fr);
    gap: 32px;
    align-items: start;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__side {
    display: grid;
    gap: 22px;

    @media (max-width: 989px) {
      position: fixed;
      inset: 0;
      z-index: 75;
      display: none;
      align-content: start;
      max-height: none;
      padding: 0 20px 24px;
      background: #fff;

      &.is-open {
        display: grid;
      }
    }
  }

  &__sidehead {
    display: none;

    @media (max-width: 989px) {
      position: sticky;
      top: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      border-bottom: 1px solid var(--dr-line);
      background: #fff;
      font-size: 18px;

      button {
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        margin-right: -10px;
        padding: 0;
        border: 0;
        background: none;
        cursor: pointer;
      }
    }
  }

  &__tree {
    display: grid;
    gap: 4px;

    > a {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      padding: 7px 12px;
      border-radius: 10px;
      font-weight: 600;

      small {
        color: var(--dr-muted);
        font-weight: 500;
      }

      &:hover {
        background: var(--dr-surface);
      }

      &.is-on {
        background: var(--dr-accent-soft);
        color: var(--dr-accent-hover);
      }
    }
  }

  &__treesub {
    display: grid;
    gap: 4px;
    margin: 4px 0 8px 12px;
    padding-left: 10px;
    border-left: 2px solid var(--dr-line);

    a {
      padding: 5px 10px;
      border-radius: 8px;
      color: var(--dr-muted);

      &:hover,
      &.is-on {
        color: var(--dr-accent-hover);
      }

      &.is-on {
        background: var(--dr-accent-soft);
      }
    }
  }

  &__filter {
    display: grid;
    gap: 10px;
    padding-top: 18px;
    border-top: 1px solid var(--dr-line);

    h3 {
      font-size: 16px;
    }
  }

  &__price {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  &__sidebtns {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;

    @media (max-width: 989px) {
      position: sticky;
      bottom: 0;
      grid-template-columns: 1fr 1.4fr;
      padding: 12px 0 4px;
      background: #fff;
    }
  }

  &__apply {
    display: none;

    @media (max-width: 989px) {
      display: inline-flex;
    }
  }

  &__bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  &__filtersbtn {
    position: relative;
    display: none;
    flex: none;

    i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dr-accent);
    }

    @media (max-width: 989px) {
      display: inline-flex;
    }
  }

  &__count {
    flex: 1;
    min-width: 0;
    color: var(--dr-muted);

    @media (max-width: 989px) {
      display: none;
    }
  }

  &__sort {
    flex: none;
    width: 200px;

    @media (max-width: 989px) {
      flex: 1;
      width: auto;
      margin-left: auto;
    }

    select {
      height: 46px;
    }
  }
}
</style>
