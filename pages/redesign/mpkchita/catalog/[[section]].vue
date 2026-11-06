<script lang="ts" setup>
import MkIcon from '~/components/redesign/mpkchita/MkIcon.vue'
import MkCard from '~/components/redesign/mpkchita/MkCard.vue'

const route = useRoute()
const router = useRouter()
const section = computed(() => String(route.params.section || ''))
const top = computed(() => mkTops.find((t) => t.slug === section.value))
const sub = computed(() => mkSub(section.value))
const topSlug = computed<MkTop | ''>(() => top.value?.slug ?? sub.value?.top ?? '')
const topInfo = computed(() => mkTops.find((t) => t.slug === topSlug.value))
const q = computed(() => String(route.query.q || '').trim())

const title = computed(() => (q.value ? `Поиск: «${q.value}»` : sub.value?.title ?? top.value?.title ?? 'Продукция'))
useSeoMeta({ title: () => title.value + ' — Маккавеевский пищекомбинат | Концепт редизайна' })

const sort = ref<'orig' | 'az' | 'za' | 'new'>('orig')
const view = ref<'grid' | 'list'>('grid')
const perPage = ref(24)
const limit = ref(24)

const all = computed(() => {
  let list = mkProducts.filter((p) => {
    if (sub.value) return p.sub === sub.value.slug
    if (top.value) return mkTopOf(p.sub) === top.value.slug
    return true
  })
  if (q.value) {
    const s = q.value.toLowerCase()
    list = list.filter((p) => (p.name + ' ' + (mkSub(p.sub)?.title ?? '') + ' ' + p.comp).toLowerCase().includes(s))
  }
  if (sort.value === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  if (sort.value === 'za') list = [...list].sort((a, b) => b.name.localeCompare(a.name, 'ru'))
  if (sort.value === 'new') list = [...list].sort((a, b) => b.isNew - a.isNew)
  return list
})
const shown = computed(() => all.value.slice(0, limit.value))
// Реальное число позиций на сайте оригинала — в концепте выборка до 10 на раздел
const realCount = computed(() => (q.value ? 0 : sub.value?.count ?? top.value?.count ?? 287))
const subsOfTop = computed(() => mkSubs.filter((s) => s.top === topSlug.value))
const isBread = computed(() => topSlug.value === 'hleb')

const setView = (v: 'grid' | 'list') => {
  view.value = v
  try {
    localStorage.setItem('mk-view', v)
  } catch {
    /* без хранилища вид не запомнится */
  }
}
const clearSearch = () => router.push({ path: route.path })
watch([section, q, sort, perPage], () => (limit.value = perPage.value))
onMounted(() => {
  try {
    const v = localStorage.getItem('mk-view')
    if (v === 'grid' || v === 'list') view.value = v
  } catch {
    /* нет доступа к хранилищу */
  }
})
</script>

<template>
  <div class="mk-wrap mk-catalog">
    <nav class="mk-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mkPath('/')">Главная</NuxtLink></span>
      <span><NuxtLink :to="mkPath('/catalog')">Продукция</NuxtLink></span>
      <span v-if="sub && topInfo"
        ><NuxtLink :to="mkPath('/catalog/' + topInfo.slug)">{{ topInfo.title }}</NuxtLink></span
      >
    </nav>
    <div class="mk-catalog__title">
      <h1 class="mk-page-title">{{ title }}</h1>
      <span v-if="!isBread">{{ mkPlural(q ? all.length : realCount, 'позиция', 'позиции', 'позиций') }}</span>
    </div>

    <div class="mk-catalog__layout">
      <aside class="mk-catalog__side" aria-label="Разделы продукции">
        <NuxtLink :to="mkPath('/catalog')" class="mk-tree__all" :class="{ 'is-on': !section }">Вся продукция <small>287</small></NuxtLink>
        <div v-for="t in mkTops" :key="t.slug" class="mk-tree">
          <NuxtLink :to="mkPath('/catalog/' + t.slug)" class="mk-tree__top" :class="{ 'is-on': section === t.slug }">
            <img :src="mkImg(t.icon)" alt="" width="172" height="65" />
            <span>{{ t.title }}</span>
          </NuxtLink>
          <div v-if="topSlug === t.slug || !topSlug" class="mk-tree__subs" :class="{ 'is-collapsed': !topSlug }">
            <NuxtLink
              v-for="s in mkSubs.filter((x) => x.top === t.slug)"
              :key="s.slug"
              :to="mkPath('/catalog/' + s.slug)"
              :class="{ 'is-on': section === s.slug }"
            >
              {{ s.title }} <small>{{ s.count || '—' }}</small>
            </NuxtLink>
          </div>
        </div>
      </aside>

      <div class="mk-catalog__main">
        <div v-if="topSlug" class="mk-catalog__chips">
          <NuxtLink :to="mkPath('/catalog/' + topSlug)" class="mk-chip" :class="{ 'is-on': !sub }">Все</NuxtLink>
          <NuxtLink v-for="s in subsOfTop" :key="s.slug" :to="mkPath('/catalog/' + s.slug)" class="mk-chip" :class="{ 'is-on': sub?.slug === s.slug }">
            {{ s.short }}
          </NuxtLink>
        </div>
        <div v-else class="mk-catalog__chips">
          <NuxtLink v-for="t in mkTops" :key="t.slug" :to="mkPath('/catalog/' + t.slug)" class="mk-chip">
            {{ t.title }} <small>{{ t.count || '' }}</small>
          </NuxtLink>
        </div>

        <template v-if="isBread">
          <div class="mk-bread">
            <div class="mk-bread__note">
              <img :src="mkImg('b/bread.webp')" alt="" width="141" height="59" />
              <div>
                <h2>Хлеб, выпечка и кондитерские изделия</h2>
                <p>
                  Пекарня — одно из направлений комбината. Ассортимент раздела ещё не выложен на сайт: хлеб, пирожки, пиццу и выпечку ищите в магазинах
                  «Маккавеевский».
                </p>
                <NuxtLink :to="mkPath('/gde-kupit')" class="mk-btn mk-btn--main mk-btn--sm"><MkIcon name="pin" :size="16" /> Где купить</NuxtLink>
              </div>
            </div>
            <div class="mk-bread__grid">
              <NuxtLink
                v-for="s in subsOfTop"
                :key="s.slug"
                :to="mkPath('/catalog/' + s.slug)"
                class="mk-bread__tile"
                :class="{ 'is-on': sub?.slug === s.slug }"
              >
                <img :src="mkImg(s.img)" :alt="s.title" width="200" height="200" loading="lazy" />
                <span>{{ s.title }}</span>
              </NuxtLink>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="mk-catalog__bar">
            <p v-if="q" class="mk-catalog__q">
              Нашли {{ mkPlural(all.length, 'позицию', 'позиции', 'позиций') }}
              <button type="button" @click="clearSearch"><MkIcon name="close" :size="14" /> сбросить поиск</button>
            </p>
            <p v-else class="mk-catalog__q">Цены — в магазинах «Маккавеевский»</p>
            <div class="mk-catalog__tools">
              <label class="mk-select">
                <span class="mk-sr">Сортировка</span>
                <select v-model="sort" aria-label="Сортировка">
                  <option value="orig">Как в каталоге</option>
                  <option value="az">Название А–Я</option>
                  <option value="za">Название Я–А</option>
                  <option value="new">Сначала новинки</option>
                </select>
                <MkIcon name="down" :size="16" />
              </label>
              <label class="mk-select mk-select--per">
                <span class="mk-sr">Показывать</span>
                <select v-model.number="perPage" aria-label="Показывать по">
                  <option :value="24">По 24</option>
                  <option :value="48">По 48</option>
                  <option :value="100">По 100</option>
                </select>
                <MkIcon name="down" :size="16" />
              </label>
              <div class="mk-view" role="group" aria-label="Вид">
                <button type="button" :class="{ 'is-on': view === 'grid' }" aria-label="Плиткой" @click="setView('grid')"><MkIcon name="grid" :size="20" /></button>
                <button type="button" :class="{ 'is-on': view === 'list' }" aria-label="Списком" @click="setView('list')"><MkIcon name="list" :size="20" /></button>
              </div>
            </div>
          </div>

          <div v-if="shown.length" class="mk-grid" :class="{ 'is-list': view === 'list' }">
            <MkCard v-for="p in shown" :key="p.id" :p="p" />
          </div>
          <div v-else class="mk-catalog__empty">
            <p>По запросу «{{ q }}» ничего не нашли.</p>
            <NuxtLink :to="mkPath('/catalog')" class="mk-btn mk-btn--line">Вся продукция</NuxtLink>
          </div>

          <div v-if="all.length > limit" class="mk-catalog__more">
            <button type="button" class="mk-btn mk-btn--line" @click="limit += perPage">
              Показать ещё {{ Math.min(perPage, all.length - limit) }} <small>из {{ all.length - limit }}</small>
            </button>
          </div>
          <p v-if="!q && realCount > all.length" class="mk-catalog__sample">
            В концепте — выборка: {{ all.length }} из {{ realCount }} позиций раздела. На сайте здесь будет весь ассортимент.
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.mk-catalog {
  padding-bottom: 72px;
  &__title {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 6px 16px;
    span {
      color: var(--mk-muted);
    }
  }
  &__layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 40px;
    margin-top: 28px;
  }
  &__side {
    position: sticky;
    top: 100px;
    align-self: start;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 6px;
    scrollbar-width: thin;
    scrollbar-color: var(--mk-line) transparent;
  }
  &__main {
    min-width: 0;
  }
  &__chips {
    display: none;
  }
  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 22px;
  }
  &__q {
    color: var(--mk-muted);
    button {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-left: 10px;
      color: var(--mk-red);
      font-weight: 600;
    }
  }
  &__tools {
    display: flex;
    gap: 8px;
  }
  &__more {
    display: flex;
    justify-content: center;
    margin-top: 32px;
    small {
      color: var(--mk-muted);
      font-weight: 500;
    }
  }
  &__sample {
    margin-top: 24px;
    padding: 12px 16px;
    border-radius: 12px;
    background: var(--mk-surface);
    font-size: 14px;
    color: var(--mk-muted);
  }
  &__empty {
    display: grid;
    justify-items: start;
    gap: 14px;
    padding: 40px 0;
    color: var(--mk-muted);
  }
}
.mk-tree__all,
.mk-tree__top {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  font-weight: 700;
  color: var(--mk-ink);
  &:hover,
  &.is-on {
    background: var(--mk-soft);
    color: var(--mk-red);
  }
}
.mk-tree__all {
  justify-content: space-between;
  margin-bottom: 4px;
  small {
    color: var(--mk-muted);
    font-weight: 500;
  }
}
.mk-tree {
  margin-top: 4px;
  &__top img {
    width: 50px;
    height: 28px;
    object-fit: contain;
  }
  &__subs {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 4px 0 10px 12px;
    margin-left: 14px;
    border-left: 1px solid var(--mk-line);
    a {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.35;
      color: var(--mk-text);
      &:hover {
        background: var(--mk-surface);
        color: var(--mk-red);
      }
      &.is-on {
        background: var(--mk-soft);
        color: var(--mk-red);
        font-weight: 600;
      }
      small {
        color: var(--mk-muted);
        font-weight: 400;
      }
    }
    &.is-collapsed {
      display: none;
    }
  }
}
.mk-select {
  position: relative;
  display: flex;
  align-items: center;
  select {
    appearance: none;
    height: 40px;
    padding: 0 36px 0 14px;
    border: 1px solid var(--mk-line);
    border-radius: 10px;
    background: #fff;
    font-size: 14px;
    font-weight: 600;
    color: var(--mk-ink);
    cursor: pointer;
    outline: 0;
    &:focus {
      border-color: var(--mk-red);
    }
  }
  .mk-icon {
    position: absolute;
    right: 12px;
    pointer-events: none;
    color: var(--mk-muted);
  }
}
.mk-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
.mk-view {
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background: var(--mk-surface);
  button {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    color: var(--mk-muted);
    &.is-on {
      background: #fff;
      color: var(--mk-red);
      box-shadow: 0 1px 3px rgba(37, 31, 28, 0.1);
    }
  }
}
.mk-bread {
  &__note {
    display: flex;
    gap: 20px;
    padding: 24px;
    border-radius: var(--mk-R);
    background: var(--mk-yellow-bg);
    img {
      width: 120px;
      height: 60px;
      object-fit: contain;
      flex: none;
    }
    h2 {
      font-size: 26px;
    }
    p {
      margin: 8px 0 16px;
      max-width: 620px;
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 16px;
    margin-top: 24px;
  }
  &__tile {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-weight: 600;
    color: var(--mk-ink);
    img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 14px;
      border: 1px solid var(--mk-line);
    }
    &.is-on span,
    &:hover span {
      color: var(--mk-red);
    }
    &.is-on img {
      border-color: var(--mk-red);
    }
  }
}

@media (max-width: 1199px) {
  .mk-catalog__layout {
    grid-template-columns: 240px minmax(0, 1fr);
    gap: 28px;
  }
}
@media (max-width: 989px) {
  .mk-catalog__layout {
    grid-template-columns: minmax(0, 1fr);
    margin-top: 16px;
  }
  .mk-catalog__side {
    display: none;
  }
  .mk-catalog__chips {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    margin: 0 -20px 18px;
    padding: 0 20px 6px;
    scrollbar-width: none;
    .mk-chip {
      flex: none;
    }
  }
}
@media (max-width: 576px) {
  .mk-catalog__chips {
    margin: 0 -16px 16px;
    padding: 0 16px 6px;
  }
  .mk-catalog__bar {
    gap: 10px;
  }
  .mk-catalog__tools {
    width: 100%;
  }
  .mk-catalog__tools .mk-select:first-child {
    flex: 1;
    min-width: 0;
    select {
      width: 100%;
    }
  }
  .mk-select--per {
    display: none;
  }
  .mk-bread__note {
    flex-direction: column;
    padding: 18px;
    gap: 12px;
  }
  .mk-bread__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}
</style>
