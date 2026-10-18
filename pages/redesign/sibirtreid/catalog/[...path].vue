<script lang="ts" setup>
import SbIcon from '~/components/redesign/sibirtreid/SbIcon.vue'
import SbItemCard from '~/components/redesign/sibirtreid/SbItemCard.vue'

const route = useRoute()
const router = useRouter()
const req = useSibirtreidRequest()

const parts = computed(() => (Array.isArray(route.params.path) ? route.params.path : [route.params.path]).filter(Boolean) as string[])
const section = computed(() => (parts.value[0] ? sbSection(parts.value[0]) : undefined))
const sub = computed(() => (section.value && parts.value[1] ? sbSub(section.value.id, parts.value[1]) : undefined))

const PAGE = 24
const q = ref(String(route.query.q ?? ''))
const sort = ref<'default' | 'cheap' | 'expensive' | 'name'>('default')
const shown = ref(PAGE)
watch(
  () => route.fullPath,
  () => {
    q.value = String(route.query.q ?? '')
    shown.value = PAGE
  },
)

const base = computed(() => (section.value ? sbOf(section.value.id, sub.value?.id) : sbItems))
const items = computed(() => {
  let list = base.value
  const n = q.value.trim().toLowerCase().replace(/ё/g, 'е')
  if (n) list = list.filter((i) => `${i.brand} ${i.name}`.toLowerCase().replace(/ё/g, 'е').replace(/[«»]/g, '').includes(n))
  if (sort.value === 'cheap') list = [...list].sort((a, b) => a.price - b.price)
  if (sort.value === 'expensive') list = [...list].sort((a, b) => b.price - a.price)
  if (sort.value === 'name') list = [...list].sort((a, b) => a.brand.localeCompare(b.brand, 'ru'))
  return list
})
const visible = computed(() => items.value.slice(0, shown.value))

const title = computed(() => sub.value?.label ?? section.value?.label ?? (q.value ? `Поиск: «${q.value}»` : 'Каталог'))
const emptySub = computed(() => !!sub.value && base.value.length === 0)
const emptySection = computed(() => !!section.value && !sub.value && base.value.length === 0)
const related = computed(() => (section.value ? sbOf(section.value.id).slice(0, 4) : []))
const subCount = (s: string) => (section.value ? sbCount(section.value.id, s) : 0)
const from = computed(() => sbFrom(base.value))

const topic = computed(() => sub.value?.label ?? section.value?.label ?? '')

useSeoMeta({ title: () => `${title.value} оптом — СибирьТрейд | Концепт редизайна` })

const clearQ = () => {
  q.value = ''
  if (route.query.q) router.replace({ query: {} })
}
</script>

<template>
  <div class="sb-wrap sb-catalog">
    <nav class="sb-crumbs" aria-label="Навигация">
      <NuxtLink :to="sbPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink :to="sbCatalogPath()">Каталог</NuxtLink>
      <template v-if="section">
        <span aria-hidden="true">/</span>
        <NuxtLink :to="sbCatalogPath(section.id)">{{ section.label }}</NuxtLink>
      </template>
      <template v-if="sub">
        <span aria-hidden="true">/</span>
        <span>{{ sub.label }}</span>
      </template>
    </nav>

    <div class="sb-catalog__layout">
      <aside class="sb-catalog__side" aria-label="Разделы каталога">
        <NuxtLink :to="sbCatalogPath()" class="sb-side__all" :class="{ 'is-active': !section }">
          Все разделы
          <small>{{ sbItems.length }}</small>
        </NuxtLink>
        <div v-for="s in sbSections" :key="s.id" class="sb-side__group">
          <NuxtLink :to="sbCatalogPath(s.id)" class="sb-side__sec" :class="{ 'is-active': section?.id === s.id && !sub }">
            <img :src="s.img" alt="" loading="lazy" />
            <span>{{ s.label }}</span>
            <small>{{ sbCount(s.id) || '—' }}</small>
          </NuxtLink>
          <div v-if="section?.id === s.id" class="sb-side__subs">
            <NuxtLink
              v-for="x in s.subs"
              :key="x.id"
              :to="sbCatalogPath(s.id, x.id)"
              :class="{ 'is-active': sub?.id === x.id, 'is-empty': !sbCount(s.id, x.id) }"
            >
              <span>{{ x.label }}</span>
              <small>{{ sbCount(s.id, x.id) || 'прайс' }}</small>
            </NuxtLink>
          </div>
        </div>
      </aside>

      <div class="sb-catalog__main">
        <header class="sb-cathead" :class="section ? `sb-tone--${section.tone}` : 'sb-tone--mint'">
          <div class="sb-cathead__copy">
            <span v-if="sub" class="sb-cathead__parent">{{ section?.label }}</span>
            <h1 class="sb-page-title">{{ title }}</h1>
            <p v-if="base.length">
              {{ sbPositions(base.length) }} на сайте · от {{ sbRub(from) }} за упаковку · минимальный заказ — 10 упаковок
            </p>
            <p v-else>Ассортимент раздела — в прайсе у менеджера: на складе больше 10 000 наименований.</p>
            <div class="sb-cathead__actions">
              <button type="button" class="sb-btn sb-btn--orange" @click="req.askPrice(topic)">
                {{ topic ? 'Прайс по разделу' : 'Запросить прайс' }}
              </button>
              <a :href="sbContacts.phoneHref" class="sb-btn sb-btn--line">
                <SbIcon name="phone" :size="18" />
                {{ sbContacts.phone }}
              </a>
            </div>
          </div>
          <img v-if="section" :src="section.img" alt="" class="sb-cathead__img" />
          <img v-else :src="sbImg('choco-pie.png')" alt="" class="sb-cathead__img" />
        </header>

        <!-- подразделы чипами (на телефоне — главный способ навигации) -->
        <div v-if="section" class="sb-catalog__chips" aria-label="Подразделы">
          <NuxtLink :to="sbCatalogPath(section.id)" class="sb-chip" :class="{ 'is-on': !sub }">Все <small>{{ sbCount(section.id) }}</small></NuxtLink>
          <NuxtLink
            v-for="x in section.subs"
            :key="x.id"
            :to="sbCatalogPath(section.id, x.id)"
            class="sb-chip"
            :class="{ 'is-on': sub?.id === x.id, 'sb-chip--empty': !subCount(x.id) }"
          >
            {{ x.label }} <small>{{ subCount(x.id) || 'прайс' }}</small>
          </NuxtLink>
        </div>
        <div v-else class="sb-catalog__chips" aria-label="Разделы">
          <NuxtLink v-for="s in sbSections" :key="s.id" :to="sbCatalogPath(s.id)" class="sb-chip">
            {{ s.label }} <small>{{ sbCount(s.id) || 'прайс' }}</small>
          </NuxtLink>
        </div>

        <template v-if="!emptySub && !emptySection">
          <div class="sb-toolbar">
            <label class="sb-toolbar__search">
              <SbIcon name="search" :size="18" />
              <span class="sb-sr">Найти в разделе</span>
              <input v-model="q" type="search" :placeholder="section ? `Найти в разделе «${title}»` : 'Бренд или товар'" />
              <button v-if="q" type="button" aria-label="Очистить" @click="clearQ"><SbIcon name="close" :size="16" /></button>
            </label>
            <label class="sb-select sb-toolbar__sort">
              <span class="sb-sr">Сортировка</span>
              <select v-model="sort">
                <option value="default">Сначала популярные</option>
                <option value="cheap">Сначала дешевле</option>
                <option value="expensive">Сначала дороже</option>
                <option value="name">По бренду, А–Я</option>
              </select>
              <SbIcon name="down" :size="16" />
            </label>
            <div class="sb-toolbar__view" role="group" aria-label="Вид каталога">
              <button type="button" :class="{ 'is-on': req.view.value === 'grid' }" :aria-pressed="req.view.value === 'grid'" aria-label="Плиткой" @click="req.view.value = 'grid'">
                <SbIcon name="tiles" :size="18" />
              </button>
              <button type="button" :class="{ 'is-on': req.view.value === 'list' }" :aria-pressed="req.view.value === 'list'" aria-label="Списком, как прайс" @click="req.view.value = 'list'">
                <SbIcon name="rows" :size="18" />
              </button>
            </div>
            <span class="sb-toolbar__count">{{ sbPositions(items.length) }}</span>
          </div>

          <div v-if="items.length" class="sb-list" :class="`sb-list--${req.view.value}`">
            <SbItemCard v-for="i in visible" :key="i.id" :item="i" :view="req.view.value" />
          </div>
          <div v-else class="sb-nothing">
            <h2>Ничего не нашлось</h2>
            <p>На сайте выложена только часть ассортимента. Спросите менеджера — подберём по прайсу.</p>
            <button type="button" class="sb-btn" @click="req.askPrice(q)">Спросить менеджера</button>
          </div>
          <button v-if="items.length > shown" type="button" class="sb-btn sb-btn--soft sb-catalog__more" @click="shown += PAGE">
            Показать ещё {{ Math.min(PAGE, items.length - shown) }} из {{ items.length - shown }}
          </button>
        </template>

        <!-- честный пустой подраздел вместо SEO-текста -->
        <template v-else>
          <div class="sb-emptysub">
            <div class="sb-emptysub__copy">
              <h2>Позиции «{{ title }}» — у менеджера</h2>
              <p>
                Этого подраздела пока нет в каталоге на сайте, но товар есть в прайсе. Пришлём актуальные
                позиции, фасовки и цены на почту — или назовём по телефону.
              </p>
              <div class="sb-emptysub__actions">
                <button type="button" class="sb-btn sb-btn--orange sb-btn--lg" @click="req.askPrice(topic)">Получить прайс «{{ title }}»</button>
                <a :href="sbContacts.telegram" target="_blank" rel="noopener" class="sb-btn sb-btn--line sb-btn--lg">
                  <SbIcon name="send" :size="18" />
                  Написать в Telegram
                </a>
              </div>
            </div>
            <img v-if="section" :src="section.img" alt="" />
          </div>
          <template v-if="related.length">
            <h2 class="sb-catalog__related">Уже на сайте в разделе «{{ section?.label }}»</h2>
            <div class="sb-list sb-list--grid">
              <SbItemCard v-for="i in related" :key="i.id" :item="i" />
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sb .sb-catalog {
  &__layout {
    display: grid;
    grid-template-columns: 290px minmax(0, 1fr);
    gap: 28px;
    align-items: start;
  }

  &__side {
    position: sticky;
    top: 136px;
    display: grid;
    gap: 2px;
    max-height: calc(100vh - 156px);
    overflow: auto;
    padding-right: 4px;
    scrollbar-width: thin;
  }

  &__main {
    min-width: 0;
  }

  &__chips {
    display: flex;
    gap: 8px;
    margin: 18px 0 4px;
    overflow-x: auto;
    padding-bottom: 6px;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .sb-chip--empty:not(.is-on) {
    background: #fff;
    box-shadow: inset 0 0 0 1.5px var(--sb-line);
    color: var(--sb-muted);
  }

  &__more {
    display: flex;
    margin: 24px auto 0;
  }

  &__related {
    margin: 40px 0 18px;
    font-size: 26px;
  }

  @media (max-width: 1000px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }

    &__side {
      display: none;
    }
  }
}

.sb .sb-side {
  &__all,
  &__sec {
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    padding: 6px 12px 6px 6px;
    border-radius: 14px;
    font-weight: 600;
    font-size: 14.5px;
    line-height: 1.25;

    img {
      width: 36px;
      height: 30px;
      object-fit: contain;
    }

    small {
      color: var(--sb-muted);
      font-size: 12.5px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }

    &:hover {
      background: var(--sb-mint);
    }

    &.is-active {
      background: var(--sb-green);
      color: #fff;

      small {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  &__all {
    grid-template-columns: minmax(0, 1fr) auto;
    min-height: 44px;
    padding-left: 14px;
    margin-bottom: 4px;
    font-weight: 700;
  }

  &__subs {
    display: grid;
    gap: 2px;
    margin: 4px 0 10px 22px;
    padding-left: 12px;
    border-left: 2px solid var(--sb-mint-2);

    a {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 6px 10px;
      border-radius: 10px;
      font-size: 14px;

      small {
        color: var(--sb-green);
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }

      &.is-empty small {
        color: var(--sb-muted);
        font-weight: 500;
      }

      &:hover {
        background: var(--sb-mint);
      }

      &.is-active {
        background: var(--sb-mint);
        color: var(--sb-green-d);
        font-weight: 700;
      }
    }
  }
}

.sb .sb-cathead {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 16px;
  align-items: center;
  min-height: 220px;
  padding: clamp(24px, 4vw, 40px);
  border-radius: 32px;
  background: var(--tone-bg);
  overflow: hidden;

  &__parent {
    display: inline-block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 700;
    color: var(--tone-ink);
  }

  .sb-page-title {
    overflow-wrap: anywhere;
  }

  p {
    margin-top: 10px;
    color: var(--sb-muted);
    font-size: 15.5px;
    max-width: 560px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;

    .sb-btn--line {
      background: rgba(255, 255, 255, 0.7);
    }
  }

  &__img {
    width: 100%;
    height: 200px;
    object-fit: contain;
  }

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
    padding-bottom: 130px;

    &__img {
      position: absolute;
      right: 8px;
      bottom: 8px;
      width: 150px;
      height: 120px;
    }

    &__actions {
      .sb-btn {
        flex: 1 1 200px;
      }
    }
  }
}

.sb .sb-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 14px 0 18px;

  &__search {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 44px;
    padding: 0 6px 0 16px;
    border-radius: 999px;
    background: var(--sb-mint);
    color: var(--sb-muted);

    input {
      flex: 1;
      min-width: 0;
      border: 0;
      outline: none;
      background: none;
      color: var(--sb-ink);
    }

    button {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;

      &:hover {
        background: var(--sb-mint-2);
      }
    }
  }

  &__sort {
    width: 220px;

    select {
      height: 44px;
    }
  }

  &__view {
    display: flex;
    padding: 3px;
    border-radius: 999px;
    background: var(--sb-mint);

    button {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      color: var(--sb-muted);

      &.is-on {
        background: #fff;
        color: var(--sb-green);
        box-shadow: 0 1px 4px rgba(16, 36, 30, 0.1);
      }
    }
  }

  &__count {
    font-size: 14px;
    font-weight: 600;
    color: var(--sb-muted);
    white-space: nowrap;
  }

  @media (max-width: 720px) {
    flex-wrap: wrap;

    &__search {
      flex-basis: 100%;
    }

    &__sort {
      flex: 1;
      width: auto;
    }

    &__count {
      display: none;
    }
  }
}

.sb .sb-list {
  display: grid;
  gap: 14px;

  &--grid {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 248px), 1fr));
  }

  &--list {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }

  @media (max-width: 560px) {
    &--grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;

      .sb-card__face {
        min-height: 112px;
        padding: 14px;
      }

      .sb-card__brand {
        font-size: 19px;
        max-width: 100%;
      }

      .sb-card__kind {
        display: none;
      }

      .sb-card__img {
        width: 70px;
        height: 60px;
      }

      .sb-card__body {
        padding: 12px 12px 0;
      }

      .sb-card__name {
        font-size: 14px;
      }

      .sb-card__specs {
        font-size: 12.5px;

        div {
          flex-direction: column;
          gap: 0;
        }

        dd {
          text-align: left;
        }
      }

      .sb-card__buy {
        padding: 12px;
      }

      .sb-card__price strong {
        font-size: 18px;
      }

      .sb-card__price span {
        display: none;
      }
    }
  }

  @media (max-width: 340px) {
    &--grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

.sb .sb-nothing {
  padding: 40px;
  border-radius: 28px;
  background: var(--sb-mint);
  text-align: center;

  p {
    margin: 10px auto 20px;
    max-width: 460px;
    color: var(--sb-muted);
  }
}

.sb .sb-emptysub {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 20px;
  align-items: center;
  margin-top: 18px;
  padding: clamp(24px, 4vw, 44px);
  border-radius: 32px;
  background: var(--sb-peach);

  h2 {
    font-size: clamp(24px, 3vw, 34px);
  }

  p {
    margin-top: 12px;
    max-width: 560px;
    color: #5a4a40;
    font-size: 16px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 22px;

    .sb-btn {
      white-space: normal;
      text-align: center;
    }
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: contain;
  }

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);

    img {
      display: none;
    }

    &__actions .sb-btn {
      width: 100%;
    }
  }
}
</style>
