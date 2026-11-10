<script lang="ts" setup>
import { olBySection, olGrams, olPath, olSearch, olSection, olSections } from '~/utils/olimpfish'
import { olProducts } from '~/utils/olimpfishData'
import type { OlProduct } from '~/utils/olimpfishData'
import OlCard from '~/components/redesign/olimpfish/OlCard.vue'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'
import { useOlShop } from '~/composables/useOlimpfish'

const route = useRoute()
const router = useRouter()
const shop = useOlShop()

const sec = computed(() => (typeof route.params.sec === 'string' ? route.params.sec : ''))
const sub = computed(() => (typeof route.query.sub === 'string' ? route.query.sub : ''))
const q = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))
const section = computed(() => olSection(sec.value))
const title = computed(() => (q.value ? `Поиск: «${q.value}»` : sec.value === 'sale' ? 'Акции' : section.value?.name ?? 'Продукция'))
const subName = computed(() => section.value?.subs?.find((s) => s.slug === sub.value)?.name)
useSeoMeta({ title: () => `${subName.value ?? title.value} — Олимп | Концепт редизайна` })

const base = computed<OlProduct[]>(() => {
  if (q.value) return olSearch(q.value, 200)
  if (sec.value) return olBySection(sec.value, sub.value)
  return olProducts
})
// реальное число товаров раздела на сайте — в концепте выборка
const siteCount = computed(() => {
  if (q.value) return 0
  if (sec.value === 'sale') return 13
  if (!section.value) return 155
  return section.value.subs?.find((s) => s.slug === sub.value)?.count ?? section.value.count
})

// фильтр «Вес»: фасовки товаров раздела (у весовых — все их варианты)
const weightsOf = (p: OlProduct) => {
  if (p.w) return p.w.g
  const m = p.u.match(/^(\d+)\s*(г|кг)$/)
  return m ? [Number(m[1]) * (m[2] === 'кг' ? 1000 : 1)] : []
}
const weights = computed(() => [...new Set(base.value.flatMap(weightsOf))].filter((g) => g % 50 === 0).sort((a, b) => a - b))
const wSel = ref<number[]>([])
const stock = ref(false)
const sort = ref('default')
const per = ref(12)
const shown = ref(12)
const filters = ref(false)

// цена за кг для сортировки: у весовых — их ₽/кг, у фасованных — пересчёт по весу фасовки
const perKg = (p: OlProduct) => {
  if (p.w) return p.w.kg
  const g = weightsOf(p)[0]
  return g ? (p.p / g) * 1000 : p.p
}
const list = computed(() => {
  let l = base.value
  if (wSel.value.length) l = l.filter((p) => weightsOf(p).some((g) => wSel.value.includes(g)))
  if (stock.value) l = l.filter((p) => !p.out)
  const s = [...l]
  if (sort.value === 'new') s.sort((a, b) => Number(b.id) - Number(a.id))
  if (sort.value === 'kg') s.sort((a, b) => perKg(a) - perKg(b))
  if (sort.value === 'asc') s.sort((a, b) => a.p - b.p)
  if (sort.value === 'desc') s.sort((a, b) => b.p - a.p)
  if (sort.value === 'sale') s.sort((a, b) => b.op - a.op)
  // нет в наличии — в конце
  return s.sort((a, b) => Number(a.out) - Number(b.out))
})
const visible = computed(() => list.value.slice(0, shown.value))
const toggleW = (g: number) => {
  wSel.value = wSel.value.includes(g) ? wSel.value.filter((x) => x !== g) : [...wSel.value, g]
}
const reset = () => {
  wSel.value = []
  stock.value = false
}
watch(per, (v) => (shown.value = v))
watch(
  () => route.fullPath,
  () => {
    reset()
    shown.value = per.value
    filters.value = false
  },
)
const setSub = (s: string) => router.replace({ query: { ...route.query, sub: s || undefined } })
onMounted(() => shop.persist())
</script>

<template>
  <div class="ol-wrap ol-page ol-catalog">
    <nav class="ol-crumbs" aria-label="Навигация">
      <NuxtLink :to="olPath('/')">Главная</NuxtLink>
      <span><NuxtLink :to="olPath('/catalog')">Продукция</NuxtLink></span>
      <span v-if="sec">{{ title }}</span>
    </nav>
    <div class="ol-catalog__head">
      <h1 class="ol-title">{{ subName ?? title }}</h1>
      <p v-if="siteCount" class="ol-catalog__count">
        {{ base.length < siteCount ? `${base.length} из ${siteCount} товаров — демо-выборка` : `${siteCount} товаров` }}
      </p>
    </div>
    <div v-if="section?.subs" class="ol-chips ol-catalog__subs">
      <button type="button" class="ol-chip" :class="{ 'is-on': !sub }" @click="setSub('')">Все</button>
      <button v-for="s in section.subs" :key="s.slug" type="button" class="ol-chip" :class="{ 'is-on': sub === s.slug }" @click="setSub(s.slug)">{{ s.name }}</button>
    </div>

    <div class="ol-catalog__grid">
      <aside class="ol-side" :class="{ 'is-open': filters }">
        <div class="ol-side__head">
          <b>Фильтры</b>
          <button type="button" class="ol-x" aria-label="Закрыть" @click="filters = false"><OlIcon name="close" /></button>
        </div>
        <div class="ol-side__block">
          <h3>Категории товаров</h3>
          <nav class="ol-side__cats">
            <NuxtLink :to="olPath('/catalog')" :class="{ 'is-on': !sec && !q }">Вся продукция <small>155</small></NuxtLink>
            <template v-for="s in olSections" :key="s.slug">
              <NuxtLink :to="olPath(`/catalog/${s.slug}`)" :class="{ 'is-on': sec === s.slug && !sub }">{{ s.name }} <small>{{ s.count }}</small></NuxtLink>
              <div v-if="s.subs && sec === s.slug" class="ol-side__subs">
                <NuxtLink v-for="x in s.subs" :key="x.slug" :to="olPath(`/catalog/${s.slug}?sub=${x.slug}`)" :class="{ 'is-on': sub === x.slug }">{{ x.name }} <small>{{ x.count }}</small></NuxtLink>
              </div>
            </template>
            <NuxtLink :to="olPath('/catalog/sale')" class="ol-side__hot" :class="{ 'is-on': sec === 'sale' }">Акции <small>13</small></NuxtLink>
          </nav>
        </div>
        <div v-if="weights.length" class="ol-side__block">
          <h3>Вес</h3>
          <div class="ol-side__weights">
            <label v-for="g in weights" :key="g" class="ol-check"><input type="checkbox" :checked="wSel.includes(g)" @change="toggleW(g)" /><span>{{ olGrams(g) }}</span></label>
          </div>
        </div>
        <div class="ol-side__block">
          <label class="ol-check"><input v-model="stock" type="checkbox" /><span>Только в наличии</span></label>
        </div>
        <div class="ol-side__foot">
          <button type="button" class="ol-btn ol-btn--line" @click="reset">Сбросить</button>
          <button type="button" class="ol-btn ol-btn--acc" @click="filters = false">Показать {{ list.length }}</button>
        </div>
      </aside>

      <div class="ol-catalog__main">
        <div class="ol-tools-row">
          <button type="button" class="ol-btn ol-btn--line ol-tools-row__filters" @click="filters = true">
            <OlIcon name="filter" />Фильтры<i v-if="wSel.length || stock">{{ wSel.length + (stock ? 1 : 0) }}</i>
          </button>
          <label class="ol-field ol-tools-row__sort">
            <select v-model="sort" aria-label="Сортировка">
              <option value="default">По умолчанию</option>
              <option value="new">Сначала новинки</option>
              <option value="kg">Дешевле за кг</option>
              <option value="asc">Цена по возрастанию</option>
              <option value="desc">Цена по убыванию</option>
              <option value="sale">Со скидкой</option>
            </select>
          </label>
          <div class="ol-tools-row__per" role="group" aria-label="Показывать по">
            <span>Показать:</span>
            <button v-for="n in [9, 12, 18, 24]" :key="n" type="button" :class="{ 'is-on': per === n }" @click="per = n">{{ n }}</button>
          </div>
        </div>

        <div v-if="wSel.length || stock" class="ol-chips ol-catalog__active">
          <button v-for="g in wSel" :key="g" type="button" class="ol-chip is-on" @click="toggleW(g)">{{ olGrams(g) }} <OlIcon name="close" /></button>
          <button v-if="stock" type="button" class="ol-chip is-on" @click="stock = false">В наличии <OlIcon name="close" /></button>
        </div>

        <div v-if="visible.length" class="ol-grid ol-grid--cat">
          <OlCard v-for="p in visible" :key="p.id" :p="p" />
        </div>
        <div v-else class="ol-empty">
          <OlIcon name="search" />
          <h2>Ничего не нашлось</h2>
          <p>Попробуйте другой запрос или сбросьте фильтры.</p>
          <NuxtLink :to="olPath('/catalog')" class="ol-btn ol-btn--acc">Вся продукция</NuxtLink>
        </div>
        <div v-if="list.length > shown" class="ol-catalog__more">
          <p>Показано {{ visible.length }} из {{ list.length }}</p>
          <button type="button" class="ol-btn ol-btn--line" @click="shown += per">Загрузить ещё товары</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ol .ol-catalog {
  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 18px;
  }
  &__count {
    color: var(--ol-mute);
  }
  &__subs {
    margin: 6px 0 4px;
  }
  &__grid {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 28px;
    align-items: start;
    margin-top: 20px;
  }
  &__main {
    min-width: 0;
  }
  &__active {
    margin-bottom: 14px;
    .ol-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .ol-icon {
      width: 14px;
      height: 14px;
    }
  }
  &__more {
    display: grid;
    justify-items: center;
    gap: 10px;
    margin-top: 28px;
    color: var(--ol-mute);
    font-size: 14px;
  }
}
.ol .ol-grid--cat {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.ol .ol-side {
  position: sticky;
  top: calc(var(--ol-bar) + 20px);
  display: grid;
  gap: 14px;
  &__head,
  &__foot {
    display: none;
  }
  &__block {
    padding: 18px;
    border-radius: var(--ol-R);
    background: var(--ol-surf);
    h3 {
      font-size: 15px;
      margin-bottom: 10px;
    }
  }
  &__cats {
    display: grid;
    gap: 2px;
    a {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      padding: 7px 10px;
      border-radius: 9px;
      font-size: 14px;
      font-weight: 500;
      color: var(--ol-ink);
      small {
        color: var(--ol-mute);
        font-size: 12.5px;
      }
      &:hover {
        background: #fff;
        color: var(--ol-acc);
      }
      &.is-on {
        background: #fff;
        font-weight: 700;
        color: var(--ol-acc);
      }
    }
  }
  &__subs {
    display: grid;
    gap: 2px;
    padding-left: 12px;
    a {
      font-size: 13.5px;
    }
  }
  &__hot {
    color: var(--ol-acc) !important;
    font-weight: 700 !important;
  }
  &__weights {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
}
.ol .ol-tools-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  &__filters {
    display: none !important;
    position: relative;
    i {
      min-width: 20px;
      height: 20px;
      border-radius: 10px;
      background: var(--ol-hi);
      color: #fff;
      font: 700 11px/20px var(--ol-font);
      font-style: normal;
    }
  }
  &__sort {
    width: 240px;
  }
  &__per {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
    font-size: 14px;
    color: var(--ol-mute);
    span {
      margin-right: 4px;
    }
    button {
      min-width: 36px;
      height: 34px;
      border: 0;
      border-radius: 8px;
      background: none;
      font-weight: 600;
      color: var(--ol-ink);
      &.is-on {
        background: var(--ol-surf);
        color: var(--ol-acc);
      }
    }
  }
}
@media (max-width: 1199px) {
  .ol .ol-catalog__grid {
    grid-template-columns: 230px minmax(0, 1fr);
    gap: 20px;
  }
  .ol .ol-grid--cat {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 989px) {
  .ol .ol-catalog__grid {
    grid-template-columns: minmax(0, 1fr);
    margin-top: 14px;
  }
  .ol .ol-grid--cat {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .ol .ol-tools-row__filters {
    display: inline-flex !important;
  }
  .ol .ol-side {
    position: fixed;
    inset: 0;
    z-index: 95;
    display: none;
    align-content: start;
    gap: 12px;
    padding: 0 16px 16px;
    background: #fff;
    overflow-y: auto;
    &.is-open {
      display: grid;
    }
    &__head {
      position: sticky;
      top: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;
      background: #fff;
      b {
        font-size: 18px;
        color: var(--ol-ink);
      }
    }
    &__foot {
      position: sticky;
      bottom: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      padding-top: 10px;
      background: #fff;
    }
  }
}
@media (max-width: 768px) {
  .ol .ol-grid--cat {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .ol .ol-tools-row {
    gap: 8px;
    &__sort {
      flex: 1;
      min-width: 0;
      width: auto;
    }
    &__per {
      display: none;
    }
  }
}
</style>
