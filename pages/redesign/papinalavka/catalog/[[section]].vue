<script lang="ts" setup>
import PlCard from '~/components/redesign/papinalavka/PlCard.vue'
import PlIcon from '~/components/redesign/papinalavka/PlIcon.vue'

const route = useRoute()
const router = useRouter()
const cart = usePapinalavkaCart()

const section = computed(() => (route.params.section ? plSection(String(route.params.section)) : undefined))
const q = computed(() => String(route.query.q ?? '').trim())
const date = computed(() => String(route.query.date ?? ''))
const delivery = computed(() => plDeliveries.find((d) => d.date === date.value))
const tab = computed(() => String(route.query.tab ?? 'all'))
const sort = ref<'default' | 'cheap' | 'dear'>('default')
const limit = ref(24)

const base = computed(() => {
  if (q.value) return plSearch(q.value)
  if (delivery.value) return plDeliveryProducts(delivery.value)
  return section.value ? plInSection(section.value.id) : plProducts
})
const tabs = computed(() => [
  { id: 'all', label: 'Все', n: base.value.length },
  ...plTabs.map((t) => ({ id: t.id as string, label: t.label, n: base.value.filter(t.test).length })),
])
const items = computed(() => {
  const t = plTabs.find((x) => x.id === tab.value)
  const list = t ? base.value.filter(t.test) : [...base.value]
  if (sort.value === 'cheap') list.sort((a, b) => a.price - b.price)
  if (sort.value === 'dear') list.sort((a, b) => b.price - a.price)
  return list
})
const shown = computed(() => items.value.slice(0, limit.value))

const title = computed(() => {
  if (q.value) return `Поиск: «${q.value}»`
  if (delivery.value) return `Поставка ${plDay(delivery.value.date)}`
  return section.value?.name ?? 'Каталог'
})
const setTab = (id: string) => router.replace({ query: { ...route.query, tab: id === 'all' ? undefined : id } })

watch(
  () => route.fullPath,
  () => (limit.value = 24),
)

useSeoMeta({ title: () => `${title.value} — Папина лавка | Концепт редизайна` })
</script>

<template>
  <div class="pl-wrap pl-cat">
    <nav class="pl-crumbs" aria-label="Навигация">
      <NuxtLink :to="plPath()">Главная</NuxtLink>
      <NuxtLink v-if="section || q || delivery" :to="plSectionPath()">Каталог</NuxtLink>
      <span v-if="section || q || delivery">{{ title }}</span>
      <span v-else>Каталог</span>
    </nav>

    <div class="pl-cat__layout">
      <aside class="pl-cat__side" aria-label="Разделы каталога">
        <NuxtLink :to="plSectionPath()" class="pl-cat__link" :class="{ 'is-active': !section && !q && !delivery }">
          <span>Весь каталог</span><small>491</small>
        </NuxtLink>
        <NuxtLink v-for="s in plSections" :key="s.id" :to="plSectionPath(s.id)" class="pl-cat__link" :class="{ 'is-active': section?.id === s.id }">
          <img :src="plSecImg(s.img)" alt="" width="32" height="32" loading="lazy" />
          <span>{{ s.name }}</span><small>{{ s.count }}</small>
        </NuxtLink>
      </aside>

      <div class="pl-cat__main">
        <div class="pl-cat__top">
          <img v-if="section" :src="plSecImg(section.img)" alt="" width="72" height="72" class="pl-cat__round" />
          <div>
            <h1 class="pl-h1">{{ title }}</h1>
            <p v-if="section" class="pl-cat__sub">
              {{ plGoods(section.count) }} в разделе<span v-if="section.count > base.length" class="pl-nw"> · в концепте показаны {{ base.length }}</span>
            </p>
            <p v-else-if="delivery" class="pl-cat__sub">
              {{ delivery.title }}. Заказ {{ plDeadlineLabel(delivery.date) }}
            </p>
            <p v-else-if="q" class="pl-cat__sub">Нашли {{ plGoods(base.length) }}</p>
            <p v-else class="pl-cat__sub">34 раздела, 491 товар · в концепте до 12 товаров из каждого раздела</p>
          </div>
        </div>

        <div class="pl-chips pl-cat__secs">
          <NuxtLink :to="plSectionPath()" :class="{ 'is-active': !section && !q && !delivery }">Все</NuxtLink>
          <NuxtLink v-for="s in plSections" :key="s.id" :to="plSectionPath(s.id)" :class="{ 'is-active': section?.id === s.id }">{{ s.name }}</NuxtLink>
        </div>

        <p v-if="cart.city.value !== 'Воронеж'" class="pl-cat__city">
          <PlIcon name="pin" :size="18" />
          <span>
            Вы выбрали {{ cart.city.value }}. Цены и наличие для вашего города уточнит оператор — в концепте показан каталог Воронежа.
          </span>
        </p>

        <div class="pl-cat__bar">
          <div class="pl-chips">
            <button v-for="t in tabs" :key="t.id" type="button" :class="{ 'is-active': tab === t.id }" :disabled="!t.n && t.id !== 'all'" @click="setTab(t.id)">
              {{ t.label }}<small>{{ t.n }}</small>
            </button>
          </div>
          <label class="pl-field pl-cat__sort">
            <select v-model="sort" aria-label="Сортировка">
              <option value="default">По порядку лавки</option>
              <option value="cheap">Сначала дешевле</option>
              <option value="dear">Сначала дороже</option>
            </select>
          </label>
        </div>

        <div v-if="shown.length" class="pl-grid pl-cat__grid">
          <PlCard v-for="p in shown" :key="p.id" :product="p" />
        </div>
        <div v-else class="pl-cat__empty">
          <p>Ничего не нашли. Позвоните — подскажем, когда будет нужный продукт.</p>
          <a :href="plTel(plContacts.phone)" class="pl-btn pl-btn--line">{{ plContacts.phone }}</a>
        </div>

        <div v-if="items.length > shown.length" class="pl-cat__more">
          <button type="button" class="pl-btn pl-btn--line" @click="limit += 24">Показать ещё {{ Math.min(24, items.length - shown.length) }}</button>
          <span>Показано {{ shown.length }} из {{ items.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pl-cat {
  &__layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 32px;
    align-items: start;
  }

  &__side {
    display: grid;
    gap: 2px;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 40px;
    padding: 4px 10px;
    border-radius: 10px;
    color: var(--pl-dark);
    font-size: 15px;
    line-height: 1.25;

    img {
      width: 32px;
      height: 32px;
      flex: none;
      border-radius: 50%;
      object-fit: cover;
    }

    span {
      flex: 1;
      min-width: 0;
    }

    small {
      color: var(--pl-muted);
      font-size: 13px;
    }

    &:hover {
      background: var(--pl-kraft);
    }

    &.is-active {
      background: var(--pl-accent-soft);
      color: var(--pl-accent-d);
      font-weight: 700;
    }
  }

  &__top {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 18px;
  }

  &__round {
    width: 72px;
    height: 72px;
    flex: none;
    border: 4px solid var(--pl-kraft-2);
    border-radius: 50%;
    object-fit: cover;
  }

  .pl-nw {
    white-space: nowrap;
  }

  &__sub {
    margin-top: 6px;
    color: var(--pl-muted);
    font-size: 15px;
  }

  &__secs {
    display: none;
    margin-bottom: 14px;
  }

  &__city {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 16px;
    padding: 12px 16px;
    border-radius: 12px;
    background: var(--pl-kraft);
    font-size: 15px;

    > .pl-icon {
      color: var(--pl-wood);
      margin-top: 2px;
    }
  }

  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px 20px;
    margin-bottom: 20px;

    .pl-chips {
      min-width: 0;
    }

    button:disabled {
      opacity: 0.45;
      cursor: default;
    }
  }

  &__sort {
    flex: none;
    width: 220px;
  }

  &__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 32px;
    border-radius: 18px;
    background: var(--pl-kraft);
  }

  &__more {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 28px;
    color: var(--pl-muted);
    font-size: 14px;
  }

  @media (max-width: 1199px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }

    &__side {
      display: none;
    }

    &__secs {
      display: flex;
    }
  }

  @media (max-width: 989px) {
    &__bar {
      flex-direction: column;
      align-items: stretch;

      .pl-chips {
        margin: 0 -16px;
        padding: 0 16px;
      }
    }

    &__sort {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &__secs {
      margin-left: -16px;
      margin-right: -16px;
      padding: 0 16px;
    }

    &__round {
      width: 56px;
      height: 56px;
    }
  }

  @media (max-width: 375px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
