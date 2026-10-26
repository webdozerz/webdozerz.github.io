<script lang="ts" setup>
import PkIcon from '~/components/redesign/produkt24/PkIcon.vue'
import PkTiers from '~/components/redesign/produkt24/PkTiers.vue'
import PkRow from '~/components/redesign/produkt24/PkRow.vue'

const route = useRoute()
const router = useRouter()
const list = useProdukt24List()

const section = computed(() => pkSections.find((s) => s.id === route.params.section))
if (route.params.section && !section.value) throw createError({ statusCode: 404, statusMessage: 'Раздел не найден' })

useSeoMeta({
  title: () => `${section.value ? section.value.title : 'Прайс'} оптом и в розницу — 24produkt | Концепт редизайна`,
})

// Поиск и группа живут в адресе: ссылку на найденное можно переслать.
const q = ref(String(route.query.q ?? ''))
const group = computed(() => String(route.query.g ?? ''))
let t: ReturnType<typeof setTimeout> | undefined
watch(q, (v) => {
  clearTimeout(t)
  t = setTimeout(() => router.replace({ query: { ...route.query, q: v.trim() || undefined, g: undefined } }), 250)
})
watch(
  () => route.query.q,
  (v) => {
    if (String(v ?? '') !== q.value.trim()) q.value = String(v ?? '')
  },
)

const base = computed(() => (section.value ? pkProducts.filter((p) => p.section === section.value!.id) : pkProducts))
const searching = computed(() => q.value.trim().length > 1)
const found = computed(() => (searching.value ? pkSearch(q.value) : base.value))

// Без поиска — по группам 1С, как в их прайсе, но с понятными названиями.
const groups = computed(() => {
  const secs = section.value ? [section.value] : pkSections
  return secs.flatMap((s) =>
    s.groups
      .filter((g) => !group.value || g === group.value)
      .map((g) => ({ key: `${s.id}:${g}`, section: s, title: g, items: found.value.filter((p) => p.section === s.id && p.group === g) }))
      .filter((g) => g.items.length),
  )
})
const groupCount = (g: string) => base.value.filter((p) => p.group === g).length
const setGroup = (g: string) => router.replace({ query: { ...route.query, g: g && g !== group.value ? g : undefined } })

const print = () => window.print()
</script>

<template>
  <div class="pk-wrap pk-cat">
    <aside class="pk-cat__side">
      <NuxtLink :to="pkSectionPath()" class="pk-cat__sec" :class="{ 'is-active': !section }">
        <PkIcon name="grid" :size="20" /> Весь прайс <small>{{ pkProducts.length }}</small>
      </NuxtLink>
      <template v-for="s in pkSections" :key="s.id">
        <NuxtLink :to="pkSectionPath(s.id)" class="pk-cat__sec" :class="{ 'is-active': section?.id === s.id }">
          <i class="pk-sil" :style="{ '--pk-sil': `url(${pkIcons[s.id]})` }" /> {{ s.title }}
          <small>{{ pkProducts.filter((p) => p.section === s.id).length }}</small>
        </NuxtLink>
        <div v-if="section?.id === s.id" class="pk-cat__groups">
          <button v-for="g in s.groups" :key="g" type="button" :class="{ 'is-active': group === g }" @click="setGroup(g)">
            {{ g }} <small>{{ groupCount(g) }}</small>
          </button>
        </div>
      </template>
    </aside>

    <div class="pk-cat__main">
      <div class="pk-cat__title">
        <h1>{{ section ? section.title : 'Прайс' }}</h1>
        <p>{{ section ? section.note : 'Мясо, птица, рыба, бакалея и другая продукция' }} · прайс из 1С</p>
      </div>

      <div v-if="section && !searching" class="pk-cat__chips pk-noprint">
        <button type="button" :class="{ 'is-active': !group }" @click="setGroup('')">Все</button>
        <button v-for="g in section.groups" :key="g" type="button" :class="{ 'is-active': group === g }" @click="setGroup(g)">{{ g }}</button>
      </div>

      <p v-if="searching" class="pk-cat__found">
        По запросу «{{ q.trim() }}» во всём прайсе: <b>{{ found.length }}</b>
      </p>

      <div class="pk-cat__sticky">
        <div class="pk-cat__bar">
          <label class="pk-cat__search">
            <PkIcon name="search" :size="20" />
            <input v-model="q" type="search" placeholder="Поиск по всему прайсу" aria-label="Поиск по прайсу" />
            <button v-if="q" type="button" aria-label="Очистить" @click="q = ''"><PkIcon name="close" :size="18" /></button>
          </label>
          <PkTiers compact />
          <button type="button" class="pk-btn pk-btn--line pk-cat__print" @click="print"><PkIcon name="print" :size="20" /> Печать</button>
        </div>
        <div v-if="found.length" class="pk-head">
          <span>Наименование</span>
          <span>Ед.</span>
          <button
            v-for="tier in pkTiers"
            :key="tier.id"
            type="button"
            :title="tier.label"
            :class="{ 'is-on': list.tier.value === tier.id }"
            @click="list.tier.value = tier.id"
          >
            {{ tier.short }}
          </button>
          <span />
        </div>
      </div>

      <div v-if="!found.length" class="pk-cat__empty">
        <b>Ничего не нашли</b>
        <p>Проверьте написание или позвоните — у менеджера бывает больше, чем в прайсе на сайте.</p>
        <a :href="pkContacts.phones[0].href" class="pk-btn"><PkIcon name="phone" :size="20" /> {{ pkContacts.phones[0].label }}</a>
      </div>

      <div v-else class="pk-cat__table">
        <template v-if="searching">
          <PkRow v-for="p in found" :key="p.id" :product="p" group />
        </template>
        <template v-else>
          <section v-for="g in groups" :key="g.key" class="pk-cat__group">
            <h2>
              {{ g.title }}
              <small v-if="!section">{{ g.section.title }}</small>
            </h2>
            <PkRow v-for="p in g.items" :key="p.id" :product="p" />
          </section>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.pk-cat {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
  padding-top: 28px;

  &__side {
    position: sticky;
    top: 16px;
    display: grid;
    gap: 2px;
    max-height: calc(100vh - 32px);
    overflow: auto;
    padding-right: 4px;
  }

  &__sec {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 6px 12px;
    border-radius: var(--pk-r);
    color: var(--pk-ink);
    font-weight: 600;

    .pk-sil,
    .pk-icon {
      width: 30px;
      color: var(--pk-green);
    }

    small {
      margin-left: auto;
      color: var(--pk-muted);
      font-weight: 400;
    }

    &:hover {
      background: var(--pk-surface);
    }

    &.is-active {
      background: var(--pk-soft);
      color: var(--pk-green-d);
    }
  }

  &__groups {
    display: grid;
    gap: 2px;
    margin: 4px 0 8px 40px;

    button {
      display: flex;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 8px;
      color: var(--pk-text);
      font-size: 14px;
      text-align: left;

      small {
        margin-left: auto;
        color: var(--pk-muted);
      }

      &:hover {
        background: var(--pk-surface);
      }

      &.is-active {
        background: var(--pk-ink);
        color: #fff;

        small {
          color: #d3dde6;
        }
      }
    }
  }

  &__main {
    min-width: 0;
  }

  &__title {
    h1 {
      font-size: 36px;
    }

    p {
      margin-top: 4px;
      color: var(--pk-muted);
    }
  }

  // Поиск, тарифы и шапка таблицы липнут одним блоком — шапка не уезжает под панель.
  &__sticky {
    position: sticky;
    top: 0;
    z-index: 20;
    margin-top: 12px;
    background: #fff;

    .pk-head {
      border: 1px solid var(--pk-line);
      border-radius: var(--pk-r-lg) var(--pk-r-lg) 0 0;

      button {
        white-space: nowrap;
      }
    }
  }

  &__bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
  }

  &__search {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 10px;
    min-width: 0;
    height: 48px;
    padding: 0 8px 0 14px;
    border: 1px solid var(--pk-field);
    border-radius: var(--pk-r);
    background: #fff;

    &:focus-within {
      border-color: var(--pk-green);
      box-shadow: 0 0 0 3px var(--pk-focus);
    }

    > .pk-icon {
      flex: none;
      color: var(--pk-muted);
    }

    input {
      flex: 1;
      width: 0;
      min-width: 0;
      border: 0;
      outline: 0;
      background: none;
      font-size: 16px;

      &::-webkit-search-cancel-button {
        display: none;
      }
    }

    button {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      color: var(--pk-muted);
    }
  }

  &__chips {
    display: none;
    gap: 6px;
    overflow-x: auto;
    margin-bottom: 8px;
    scrollbar-width: none;

    button {
      flex: none;
      padding: 7px 12px;
      border-radius: 8px;
      background: var(--pk-surface);
      color: var(--pk-ink);
      font-size: 14px;
      white-space: nowrap;

      &.is-active {
        background: var(--pk-ink);
        color: #fff;
      }
    }
  }

  &__found {
    margin: 4px 0 12px;
    color: var(--pk-muted);

    b {
      color: var(--pk-ink);
    }
  }

  &__empty {
    display: grid;
    gap: 10px;
    justify-items: start;
    padding: 32px;
    border-radius: var(--pk-r-lg);
    background: var(--pk-surface);

    b {
      color: var(--pk-ink);
      font-size: 18px;
    }

    p {
      color: var(--pk-muted);
    }
  }

  &__table {
    border: 1px solid var(--pk-line);
    border-top: 0;
    border-radius: 0 0 var(--pk-r-lg) var(--pk-r-lg);
  }

  &__group h2 {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 22px 14px 10px;
    border-bottom: 1px solid var(--pk-line);
    font-size: 19px;

    small {
      color: var(--pk-muted);
      font-size: 13px;
      font-weight: 400;
    }
  }

  // До 1199 разделы уже в ленте шапки — колонка не нужна, группы чипами.
  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);

    &__side {
      display: none;
    }

    &__chips {
      display: flex;
    }
  }

  @media (max-width: 989px) {
    &__table {
      border-top: 1px solid var(--pk-line);
      border-radius: var(--pk-r-lg);
      padding: 0 14px;
    }

    &__group h2 {
      padding: 20px 4px 8px;
    }
  }

  @media (max-width: 768px) {
    padding-top: 20px;

    &__title h1 {
      font-size: 28px;
    }

    &__bar {
      flex-wrap: wrap;
      gap: 8px;
      padding: 10px 0;
      border-bottom: 1px solid var(--pk-line);

      .pk-tiers {
        width: 100%;
      }
    }

    &__search {
      flex-basis: 100%;
    }

    &__print {
      display: none;
    }

    &__table {
      margin: 0 -20px;
      padding: 0 20px;
      border: 0;
      border-radius: 0;
    }
  }

  @media (max-width: 375px) {
    &__table {
      margin: 0 -14px;
      padding: 0 14px;
    }
  }

  @media print {
    display: block;

    &__side,
    &__bar,
    &__chips {
      display: none !important;
    }

    &__sticky {
      position: static;
    }
  }
}
</style>
