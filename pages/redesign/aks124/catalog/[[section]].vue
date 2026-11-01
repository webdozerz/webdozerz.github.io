<script lang="ts" setup>
import AkIcon from '~/components/redesign/aks124/AkIcon.vue'
import AkSheet from '~/components/redesign/aks124/AkSheet.vue'

const route = useRoute()
const q = useState<string>('ak-q', () => '')
const sectionId = computed(() => (route.params.section as string) || '')
const section = computed(() => (sectionId.value ? akSection(sectionId.value) : undefined))
const brandId = computed(() => (route.query.brand as string) || '')
const pricedOnly = ref(false)

// Новый запрос из адреса (?q=) при переходах внутри каталога — в поле поиска в шапке
watch(
  () => route.query.q,
  (v) => {
    if (typeof v === 'string') q.value = v
  },
)

useSeoMeta({ title: () => `${section.value?.title ?? 'Каталог'} оптом в Красноярске | ИП Аксюченко — концепт редизайна` })

const brands = computed(() => (section.value ? akBrandsOf(section.value.id) : akBrands))
const query = computed(() => q.value.trim())
const hitIds = computed(() => (query.value.length > 1 ? new Set(akSearch(query.value).map((i) => i.id)) : null))

// Листы: бренд + его строки после фильтров (бренд, «только с ценой», поиск)
const sheets = computed(() =>
  brands.value
    .filter((b) => !brandId.value || b.id === brandId.value)
    .map((b) => ({
      brand: b,
      items: akItemsOf(b.id).filter((i) => (!pricedOnly.value || i.price) && (!hitIds.value || hitIds.value.has(i.id))),
    }))
    .filter((s) => s.items.length),
)
const shownItems = computed(() => sheets.value.reduce((n, s) => n + s.items.length, 0))
const overview = computed(() => !section.value && !hitIds.value)

const brandLink = (id?: string) => ({ path: akSectionPath(sectionId.value || undefined), query: { ...route.query, brand: id || undefined } })
const clearQuery = () => {
  q.value = ''
  navigateTo({ path: akSectionPath(sectionId.value || undefined), query: { ...route.query, q: undefined } })
}
</script>

<template>
  <div class="ak-wrap ak-cat">
    <aside class="ak-cat__side" aria-label="Разделы каталога">
      <NuxtLink :to="akSectionPath()" class="ak-cat__all" :class="{ 'is-on': !sectionId }">Все разделы</NuxtLink>
      <NuxtLink v-for="s in akSections" :key="s.id" :to="akSectionPath(s.id)" :class="{ 'is-on': s.id === sectionId }">
        <span>{{ s.title }}</span>
        <small>{{ s.count }}</small>
      </NuxtLink>
    </aside>

    <div class="ak-cat__main">
      <nav class="ak-crumbs" aria-label="Навигация">
        <NuxtLink :to="akPath()">Главная</NuxtLink>
        <span>/</span>
        <NuxtLink :to="akSectionPath()">Каталог</NuxtLink>
        <template v-if="section">
          <span>/</span>
          <span>{{ section.title }}</span>
        </template>
      </nav>

      <div class="ak-cat__head">
        <h1>{{ section?.title ?? (hitIds ? `Поиск: «${query}»` : 'Каталог') }}</h1>
        <p v-if="section">{{ akPositions(section.count) }}, с ценой {{ section.priced }} · цены базовые, за штуку</p>
        <p v-else-if="hitIds">Найдено {{ shownItems }} в {{ sheets.length }} листах брендов</p>
        <p v-else>16 разделов, {{ akTotal.items.toLocaleString('ru-RU') }} позиций. Внутри раздела — листы брендов с ценой за штуку и упаковку.</p>
      </div>

      <div v-if="overview" class="ak-sections">
        <NuxtLink v-for="s in akSections" :key="s.id" :to="akSectionPath(s.id)" class="ak-sections__card">
          <span class="ak-sections__img">
            <img v-if="s.img" :src="s.img" :alt="s.title" width="120" height="120" loading="lazy" />
            <AkIcon v-else name="box" :size="36" />
          </span>
          <span class="ak-sections__text">
            <b>{{ s.title }}</b>
            <small>{{ akPositions(s.count) }}<template v-if="akMinPrice(s.id)"> · от {{ akMoney(akMinPrice(s.id)) }}</template></small>
            <span class="ak-sections__brands">{{ akBrandsOf(s.id).slice(0, 4).map((b) => b.title).join(', ') }}</span>
          </span>
        </NuxtLink>
      </div>

      <template v-else>
        <div class="ak-cat__tools">
          <div v-if="section" class="ak-cat__brands" role="group" aria-label="Бренды раздела">
            <NuxtLink :to="brandLink()" :class="{ 'is-on': !brandId }">Все бренды</NuxtLink>
            <NuxtLink v-for="b in brands" :key="b.id" :to="brandLink(b.id)" :class="{ 'is-on': b.id === brandId }">{{ b.title }}</NuxtLink>
          </div>
          <div class="ak-cat__filters">
            <label class="ak-switch">
              <input v-model="pricedOnly" type="checkbox" />
              <span />
              Только с ценой
            </label>
            <button v-if="query" type="button" class="ak-cat__q" @click="clearQuery">«{{ query }}» <AkIcon name="close" :size="16" /></button>
          </div>
        </div>

        <AkSheet v-for="s in sheets" :key="s.brand.id" :brand="s.brand" :items="s.items" />

        <div v-if="!sheets.length" class="ak-empty">
          <h3>Ничего не нашли</h3>
          <p>
            На сайте не весь ассортимент склада. Позвоните — <a :href="akContacts.phones[0].href">{{ akContacts.phones[0].label }}</a> — или
            <a href="#price-form">запросите полный прайс</a>.
          </p>
        </div>

        <p v-if="section && section.count > shownItems" class="ak-cat__more">
          <AkIcon name="info" :size="20" />
          <span>
            В концепте показана часть раздела — {{ shownItems }} из {{ section.count }} позиций. Полный список с актуальными ценами — в
            <a href="#price-form">прайс-листе</a>.
          </span>
        </p>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.ak-cat {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 32px;
  padding-top: 24px;

  &__side {
    position: sticky;
    top: 96px;
    align-self: start;
    display: grid;
    gap: 2px;
    max-height: calc(100vh - 116px);
    overflow: auto;
    padding: 10px;
    border-radius: var(--ak-R);
    background: var(--ak-surface);

    a {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 6px 12px;
      border-radius: 10px;
      color: var(--ak-ink);
      font-size: 14px;
      line-height: 1.3;

      small {
        color: var(--ak-muted);
      }
      &:hover {
        background: #fff;
      }
      &.is-on {
        background: #fff;
        color: var(--ak-accent-dark);
        font-weight: 700;
      }
    }
  }
  &__head {
    margin: 10px 0 20px;

    h1 {
      font-size: clamp(26px, 3vw, 40px);
      line-height: 1.1;
    }
    p {
      margin-top: 8px;
      color: var(--ak-muted);
    }
  }
  &__tools {
    display: grid;
    gap: 12px;
    margin-bottom: 16px;
  }
  &__brands {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 2px;
    scrollbar-width: none;
    mask-image: linear-gradient(90deg, #000 94%, transparent);

    &::-webkit-scrollbar {
      display: none;
    }
    a {
      flex: none;
      display: inline-flex;
      align-items: center;
      height: 38px;
      padding: 0 14px;
      border-radius: 10px;
      border: 1px solid var(--ak-line);
      color: var(--ak-ink);
      white-space: nowrap;

      &:hover {
        border-color: var(--ak-accent);
      }
      &.is-on {
        background: var(--ak-soft);
        border-color: var(--ak-soft);
        color: var(--ak-accent-dark);
        font-weight: 700;
      }
    }
  }
  &__filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }
  &__q {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 12px;
    border-radius: 9px;
    background: var(--ak-lime-soft);
    color: var(--ak-ink);
    font-weight: 600;
  }
  &__more {
    display: flex;
    gap: 10px;
    margin-top: 16px;
    padding: 16px 18px;
    border-radius: 16px;
    background: var(--ak-surface);
    color: var(--ak-text);

    svg {
      flex: none;
      color: var(--ak-accent);
    }
    a {
      color: var(--ak-accent);
      font-weight: 600;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 24px;
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__side {
      display: none;
    }
  }
  @media (max-width: 768px) {
    padding-top: 16px;
  }
}
.ak-switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ak-ink);
  font-weight: 500;
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
  }
  span {
    position: relative;
    width: 40px;
    height: 24px;
    border-radius: 12px;
    background: #d9d3ca;
    transition: background 0.15s;

    &::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.15s;
    }
  }
  input:checked + span {
    background: var(--ak-accent);

    &::after {
      transform: translateX(16px);
    }
  }
  input:focus-visible + span {
    outline: 2px solid var(--ak-accent);
    outline-offset: 2px;
  }
}
.ak-sections {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;

  &__card {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 16px;
    align-items: center;
    padding: 12px;
    border: 1px solid var(--ak-line);
    border-radius: 18px;

    &:hover {
      border-color: var(--ak-accent);
    }
  }
  &__img {
    display: grid;
    place-items: center;
    color: #b9b0a5;
    width: 96px;
    height: 96px;
    border-radius: 14px;
    background: var(--ak-surface);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      padding: 6px;
      object-fit: contain;
      background: #fff;
    }
  }
  &__text {
    display: grid;
    gap: 2px;
    min-width: 0;

    b {
      color: var(--ak-ink);
      font-size: 17px;
      line-height: 1.2;
    }
    small {
      color: var(--ak-muted);
    }
  }
  &__brands {
    margin-top: 4px;
    font-size: 13px;
    color: var(--ak-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  @media (max-width: 375px) {
    grid-template-columns: minmax(0, 1fr);

    &__card {
      grid-template-columns: 72px minmax(0, 1fr);
    }
    &__img {
      width: 72px;
      height: 72px;
    }
  }
}
</style>
