<script lang="ts" setup>
// Каталог: раздел оригинала, поиск, сортировки и фильтры как на сайте фабрики
// (цена от/до, «Для кого», «Праздники», «Скидки», «Цена с учётом доставки»), «Показывать по 18/36/72», «Показать ещё» и страницы.
import { skPath, skSection, skVisible, skPlural, skRub } from '~/utils/shokoladki'
import { skProducts } from '~/utils/shokoladki.data'
import { useSkUi } from '~/composables/useShokoladki'
import SkCard from '~/components/redesign/shokoladki/SkCard.vue'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'

const route = useRoute()
const router = useRouter()
const ui = useSkUi()
const to = (p: string) => skPath(p)

const razdel = computed(() => String(route.params.razdel || ''))
const section = computed(() => (razdel.value ? skSection(razdel.value) : undefined))
const q = computed(() => String(route.query.q || '').trim())
const groupTitle: Record<string, string> = {
  collection: 'Коллекция',
  occasion: 'Шоколадные подарки · По случаю',
  whom: 'Шоколадные подарки · Для кого',
  holiday: 'Шоколадные подарки · Праздники',
  calendar: 'Шоколадные подарки · Календарь',
  souvenir: 'Сувениры',
}
const title = computed(() => (q.value ? `Поиск: «${q.value}»` : section.value?.full || (route.query.sale ? 'Акции и скидки' : 'Коллекция')))
useSeoMeta({ title: () => `${title.value} — АПРИОРИ | Концепт редизайна` })

// Фильтры — в адресе, чтобы ссылки «Акции и скидки» и «популярное» работали
const sorts = [
  { id: 'pop', n: 'Популярное' },
  { id: 'cheap', n: 'Подешевле' },
  { id: 'dear', n: 'Подороже' },
  { id: 'rate', n: 'С лучшими оценками' },
  { id: 'rev', n: 'С отзывами' },
]
const sort = ref(String(route.query.sort || 'pop'))
const priceFrom = ref<number | null>(null)
const priceTo = ref<number | null>(null)
const whom = ref<string[]>([])
const holiday = ref<string[]>([])
const sale = ref(!!route.query.sale)
const withDelivery = ref(false)
const perPage = ref(18)
const page = ref(1)
const shown = ref(18)
watch(
  () => route.fullPath,
  () => {
    sale.value = !!route.query.sale
    if (route.query.sort) sort.value = String(route.query.sort)
    page.value = 1
    shown.value = perPage.value
  },
)

const whomList = skVisible('whom')
const holidayList = skVisible('holiday')
const base = computed(() => {
  let list = skProducts
  if (section.value) list = list.filter((p) => p.s.includes(section.value!.id) || p.c === section.value!.id)
  if (q.value) {
    const s = q.value.toLowerCase()
    list = list.filter((p) => `${p.n} ${p.d.join(' ')}`.toLowerCase().includes(s))
  }
  return list
})
const minMax = computed(() => {
  const ps = base.value.map((p) => p.p)
  return ps.length ? [Math.min(...ps), Math.max(...ps)] : [0, 0]
})
const list = computed(() => {
  let l = base.value
  if (priceFrom.value) l = l.filter((p) => p.p >= priceFrom.value!)
  if (priceTo.value) l = l.filter((p) => p.p <= priceTo.value!)
  if (whom.value.length) l = l.filter((p) => whom.value.some((w) => p.s.includes(w)))
  if (holiday.value.length) l = l.filter((p) => holiday.value.some((h) => p.s.includes(h)))
  if (sale.value) l = l.filter((p) => p.o > p.p)
  const by: Record<string, (a: (typeof l)[0], b: (typeof l)[0]) => number> = {
    pop: (a, b) => b.b - a.b,
    cheap: (a, b) => a.p - b.p,
    dear: (a, b) => b.p - a.p,
    rate: (a, b) => b.st - a.st || b.r - a.r,
    rev: (a, b) => b.r - a.r,
  }
  return [...l].sort(by[sort.value] || by.pop)
})
const active = computed(() => !!(priceFrom.value || priceTo.value || whom.value.length || holiday.value.length || sale.value || withDelivery.value))
const reset = () => {
  priceFrom.value = null
  priceTo.value = null
  whom.value = []
  holiday.value = []
  sale.value = false
  withDelivery.value = false
  if (route.query.sale) router.replace({ query: { ...route.query, sale: undefined } })
}
watch([priceFrom, priceTo, whom, holiday, sale, sort], () => {
  page.value = 1
  shown.value = perPage.value
})
watch(perPage, (n) => {
  page.value = 1
  shown.value = n
})
const pages = computed(() => Math.max(1, Math.ceil(list.value.length / perPage.value)))
const start = computed(() => (page.value - 1) * perPage.value)
// Все карточки в разметке (краулеру генерации нужны ссылки), лишние спрятаны
const visible = (i: number) => i >= start.value && i < start.value + shown.value
const more = () => (shown.value += perPage.value)
const go = (n: number) => {
  page.value = n
  shown.value = perPage.value
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}
const leftCount = computed(() => Math.max(0, list.value.length - start.value - shown.value))

// Соседние разделы той же группы — лентой
const siblings = computed(() => (section.value ? skVisible(section.value.g) : skVisible('collection')))
</script>

<template>
  <div class="sk-wrap sk-cat">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span><NuxtLink :to="to('/katalog/')">Каталог</NuxtLink></span>
      <span v-if="section">{{ section.n }}</span>
    </nav>
    <div class="sk-cat__head">
      <div>
        <small v-if="section" class="sk-cat__group">{{ groupTitle[section.g] }}</small>
        <h1 class="sk-h1">{{ title }}</h1>
      </div>
      <span class="sk-cat__count">{{ list.length }} {{ skPlural(list.length, 'товар', 'товара', 'товаров') }}<template v-if="section && section.count > base.length"> из {{ section.count }} на сайте</template></span>
    </div>
    <div class="sk-chips sk-chips--scroll sk-cat__secs">
      <NuxtLink v-if="!section || section.g === 'collection'" :to="to('/katalog/')" class="sk-chip" :class="{ 'is-on': !section && !q }">Все</NuxtLink>
      <NuxtLink v-for="s in siblings" :key="s.id" :to="to(`/katalog/${s.id}/`)" class="sk-chip" :class="{ 'is-on': section?.id === s.id }">{{ s.n }} <small>{{ s.count }}</small></NuxtLink>
    </div>

    <div class="sk-cat__body">
      <aside class="sk-filters" :class="{ 'is-open': ui.modal.value === 'filters' }" aria-label="Фильтры">
        <div class="sk-filters__top">
          <b>Фильтры</b>
          <button type="button" class="sk-iconbtn" aria-label="Закрыть" @click="ui.modal.value = ''"><SkIcon name="close" /></button>
        </div>
        <div class="sk-filters__group">
          <b>Цена, ₽</b>
          <div class="sk-filters__price">
            <input v-model.number="priceFrom" class="sk-input" type="number" inputmode="numeric" :placeholder="`от ${minMax[0]}`" aria-label="Цена от" />
            <input v-model.number="priceTo" class="sk-input" type="number" inputmode="numeric" :placeholder="`до ${minMax[1]}`" aria-label="Цена до" />
          </div>
        </div>
        <label class="sk-switch">
          <input v-model="sale" type="checkbox" />
          <span>Скидки</span>
        </label>
        <label class="sk-switch">
          <input v-model="withDelivery" type="checkbox" />
          <span>Цена с учётом доставки</span>
        </label>
        <div class="sk-filters__group">
          <b>Для кого</b>
          <label v-for="w in whomList" :key="w.id" class="sk-check sk-check--line"><input v-model="whom" type="checkbox" :value="w.id" /><span>{{ w.n }}</span></label>
        </div>
        <div class="sk-filters__group">
          <b>Праздники</b>
          <label v-for="h in holidayList" :key="h.id" class="sk-check sk-check--line"><input v-model="holiday" type="checkbox" :value="h.id" /><span>{{ h.n }}</span></label>
        </div>
        <div class="sk-filters__foot">
          <button type="button" class="sk-btn" @click="ui.modal.value = ''">Показать {{ list.length }}</button>
          <button type="button" class="sk-btn sk-btn--line" :disabled="!active" @click="reset">Сбросить</button>
        </div>
      </aside>

      <div class="sk-cat__main">
        <div class="sk-cat__bar">
          <button type="button" class="sk-btn sk-btn--line sk-cat__fbtn" @click="ui.modal.value = 'filters'">
            <SkIcon name="filter" />Фильтры<i v-if="active" class="sk-dot" />
          </button>
          <label class="sk-cat__sort">
            <span>Сортировка</span>
            <select v-model="sort" class="sk-input" aria-label="Сортировка">
              <option v-for="s in sorts" :key="s.id" :value="s.id">{{ s.n }}</option>
            </select>
          </label>
          <div class="sk-cat__per" role="group" aria-label="Показывать по">
            <span>По</span>
            <button v-for="n in [18, 36, 72]" :key="n" type="button" :class="{ 'is-on': perPage === n }" @click="perPage = n">{{ n }}</button>
          </div>
        </div>

        <div v-if="list.length" class="sk-grid sk-cat__grid">
          <div v-for="(p, i) in list" v-show="visible(i)" :key="p.id">
            <SkCard :p="p" :with-delivery="withDelivery" />
          </div>
        </div>
        <div v-else class="sk-empty">
          <b class="sk-h2">Ничего не нашлось</b>
          <p>Попробуйте убрать фильтры или поищите иначе.</p>
          <button v-if="active" type="button" class="sk-btn" @click="reset">Сбросить фильтры</button>
          <NuxtLink v-else :to="to('/katalog/')" class="sk-btn">Вся коллекция</NuxtLink>
        </div>

        <div v-if="list.length > perPage" class="sk-cat__pager">
          <button v-if="leftCount" type="button" class="sk-btn sk-btn--soft sk-btn--big" @click="more">Показать ещё {{ Math.min(perPage, leftCount) }}</button>
          <nav class="sk-pages" aria-label="Страницы">
            <button v-for="n in pages" :key="n" type="button" :class="{ 'is-on': n === page }" @click="go(n)">{{ n }}</button>
          </nav>
        </div>
        <p v-if="section" class="sk-cat__note">В концепте — выборка: {{ base.length }} из {{ section.count }} товаров раздела, цены — как на сайте. Цены от {{ skRub(minMax[0]) }}.</p>
      </div>
    </div>
  </div>
</template>
