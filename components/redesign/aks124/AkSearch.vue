<script lang="ts" setup>
import AkIcon from './AkIcon.vue'
import AkBuy from './AkBuy.vue'

// Поиск по всему прайсу и брендам. Вне каталога — подсказки с ценой и «В список», Enter ведёт в каталог с запросом.
// В каталоге подсказок нет: запрос сразу фильтрует листы брендов.
const props = withDefaults(defineProps<{ suggest?: boolean; quick?: boolean; big?: boolean }>(), { suggest: true, quick: false, big: false })
const q = useState<string>('ak-q', () => '')
// Запрос из адреса каталога (?q=) — после монтирования: на GitHub Pages каталог пререндерен без запроса,
// и подстановка до отрисовки разошлась бы с HTML страницы
const route = useRoute()
onMounted(() => {
  if (typeof route.query.q === 'string' && route.path.startsWith(akSectionPath())) q.value = route.query.q
})
const open = ref(false)
const root = ref<HTMLElement | null>(null)

const hits = computed(() => (q.value.trim().length > 1 ? akSearch(q.value) : []))
const brands = computed(() => (q.value.trim().length > 1 ? akSearchBrands(q.value).slice(0, 3) : []))
const shown = computed(() => hits.value.slice(0, 6))

const go = () => {
  open.value = false
  navigateTo({ path: akSectionPath(), query: q.value.trim() ? { q: q.value.trim() } : {} })
}
const pick = (text: string) => {
  q.value = text
  if (props.suggest) open.value = true
}
const onDoc = (e: MouseEvent) => {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('click', onDoc))
onBeforeUnmount(() => document.removeEventListener('click', onDoc))
</script>

<template>
  <div ref="root" class="ak-search" :class="{ 'is-big': props.big }">
    <form class="ak-search__form" role="search" @submit.prevent="go">
      <AkIcon name="search" :size="22" class="ak-search__ico" />
      <input
        v-model="q"
        type="search"
        placeholder="Вегета, Доширак, сгущёнка…"
        aria-label="Поиск по прайсу"
        autocomplete="off"
        @focus="open = true"
        @input="open = true"
      />
      <button v-if="q" type="button" class="ak-search__clear" aria-label="Очистить" @click="q = ''"><AkIcon name="close" :size="18" /></button>
      <button type="submit" class="ak-btn ak-search__go">Найти</button>
    </form>

    <div v-if="props.suggest && open && q.trim().length > 1" class="ak-search__drop">
      <template v-if="shown.length || brands.length">
        <NuxtLink v-for="b in brands" :key="b.id" :to="akBrandPath(b)" class="ak-search__brand" @click="open = false">
          <img v-if="b.img" :src="b.img" alt="" width="40" height="40" />
          <span v-else class="ak-search__letter"><AkIcon name="tag" :size="20" /></span>
          <span><b>{{ b.title }}</b><small>Бренд · {{ akPositions(b.count) }}</small></span>
          <AkIcon name="arrow" :size="18" />
        </NuxtLink>
        <div v-for="it in shown" :key="it.id" class="ak-search__hit">
          <div>
            <b>{{ it.name }}</b>
            <small>{{ akBrand(it.brand)?.title }}<template v-if="it.pack"> · {{ it.pack }} {{ it.per }} в уп.</template></small>
          </div>
          <span class="ak-search__price">{{ it.price ? `${akMoney(it.price)}/${it.per}` : 'по запросу' }}</span>
          <AkBuy :item="it" small />
        </div>
        <button type="button" class="ak-search__all" @click="go">
          Все результаты в каталоге · {{ hits.length }}
          <AkIcon name="arrow" :size="18" />
        </button>
      </template>
      <p v-else class="ak-search__none">
        Ничего не нашли. Позвоните — <a :href="akContacts.phones[0].href">{{ akContacts.phones[0].label }}</a>, на складе ассортимент шире сайта.
      </p>
    </div>
    <div v-else-if="props.quick && !q" class="ak-search__quick">
      <span>Часто ищут:</span>
      <button v-for="w in akQuickQueries" :key="w" type="button" @click="pick(w)">{{ w }}</button>
    </div>
  </div>
</template>
