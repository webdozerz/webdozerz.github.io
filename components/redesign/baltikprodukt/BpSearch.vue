<script lang="ts" setup>
import BpIcon from './BpIcon.vue'
import BpBuy from './BpBuy.vue'

// Поиск по всему прайсу. На страницах кроме прайса — подсказки с ценой и «В список», Enter ведёт в прайс с запросом.
// В прайсе подсказок нет: запрос сразу фильтрует строки.
const props = withDefaults(defineProps<{ suggest?: boolean; quick?: boolean }>(), { suggest: true, quick: false })
const q = useState<string>('bp-q', () => '')
const list = useBaltikproduktList()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

const hits = computed(() => (q.value.trim().length > 1 ? bpSearch(q.value) : []))
const shown = computed(() => hits.value.slice(0, 6))

const go = () => {
  open.value = false
  navigateTo({ path: bpSectionPath(), query: q.value.trim() ? { q: q.value.trim() } : {} })
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
  <div ref="root" class="bp-search">
    <form class="bp-search__form" role="search" @submit.prevent="go">
      <BpIcon name="search" :size="22" class="bp-search__ico" />
      <input
        v-model="q"
        type="search"
        placeholder="Поиск: креветка, горбуша, килька"
        aria-label="Поиск по прайсу"
        autocomplete="off"
        @focus="open = true"
        @input="open = true"
      />
      <button v-if="q" type="button" class="bp-search__clear" aria-label="Очистить" @click="q = ''"><BpIcon name="close" :size="18" /></button>
      <button type="submit" class="bp-btn bp-search__go">Найти</button>
    </form>

    <div v-if="props.suggest && open && q.trim().length > 1" class="bp-search__drop">
      <template v-if="shown.length">
        <div v-for="p in shown" :key="p.id" class="bp-search__hit">
          <div>
            <b>{{ p.name }}</b>
            <small>{{ bpSection(p.section)?.title }}<template v-if="p.net"> · {{ p.net }}</template></small>
          </div>
          <span class="bp-search__price">{{ p.price ? `${bpMoney(bpModePrice(p.price, list.mode.value))}/${bpUnit(p)}` : 'по запросу' }}</span>
          <BpBuy :product="p" small />
        </div>
        <button type="button" class="bp-search__all" @click="go">
          Все результаты в прайсе · {{ hits.length }}
          <BpIcon name="arrow" :size="18" />
        </button>
      </template>
      <p v-else class="bp-search__none">
        Ничего не нашли. Позвоните — <a :href="bpContacts.phones[0].href">{{ bpContacts.phones[0].label }}</a>, у менеджера ассортимент шире прайса.
      </p>
    </div>
    <div v-else-if="props.quick && !q" class="bp-search__quick">
      <button v-for="w in bpQuickQueries" :key="w" type="button" @click="pick(w)">{{ w }}</button>
    </div>
  </div>
</template>
