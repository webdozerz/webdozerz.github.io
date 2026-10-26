<script lang="ts" setup>
import PkIcon from './PkIcon.vue'
import PkBuy from './PkBuy.vue'

// Поиск по всем 645 позициям: подсказки с ценой выбранного тарифа и «В список» прямо в выпадашке.
const props = withDefaults(defineProps<{ big?: boolean; placeholder?: string }>(), { big: false, placeholder: 'Печень, минтай, мука…' })
const q = defineModel<string>({ default: '' })
const list = useProdukt24List()
const open = ref(false)
const root = ref<HTMLElement>()

const found = computed(() => (q.value.trim().length > 1 ? pkSearch(q.value) : []))
const shown = computed(() => found.value.slice(0, 6))

const submit = () => {
  open.value = false
  navigateTo({ path: pkSectionPath(), query: q.value.trim() ? { q: q.value.trim() } : {} })
}
const onDoc = (e: Event) => {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('pointerdown', onDoc))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDoc))
</script>

<template>
  <div ref="root" class="pk-search" :class="{ 'pk-search--big': props.big, 'is-open': open && q.trim().length > 1 }">
    <form class="pk-search__form" role="search" @submit.prevent="submit">
      <PkIcon name="search" :size="props.big ? 24 : 20" />
      <input
        v-model="q"
        type="search"
        :placeholder="props.placeholder"
        aria-label="Поиск по прайсу"
        autocomplete="off"
        @focus="open = true"
        @input="open = true"
        @keydown.esc="open = false"
      />
      <button type="submit" class="pk-btn">Найти</button>
    </form>
    <div v-if="open && q.trim().length > 1" class="pk-search__drop">
      <p v-if="!found.length" class="pk-search__empty">
        Ничего не нашли. Позвоните — у менеджера бывает больше, чем в прайсе на сайте.
      </p>
      <div v-for="p in shown" :key="p.id" class="pk-search__item">
        <div>
          <span>{{ p.name }}</span>
          <small>{{ pkSections.find((s) => s.id === p.section)!.title }} · {{ p.group }}</small>
        </div>
        <b>{{ pkMoney(p.prices[list.tier.value]) }}<small>/{{ pkUnitLabel(p.unit) }}</small></b>
        <PkBuy :id="p.id" :unit="p.unit" />
      </div>
      <button v-if="found.length" type="button" class="pk-search__all" @click="submit">
        Все результаты в прайсе: {{ found.length }} <PkIcon name="arrow" :size="18" />
      </button>
    </div>
  </div>
</template>
