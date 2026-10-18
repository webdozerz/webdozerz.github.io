<script lang="ts" setup>
import SnProductCard from '~/components/redesign/sanych/SnProductCard.vue'

const route = useRoute()
const catId = computed(() => String(route.params.cat || ''))
const category = computed(() => snCategory(catId.value))

const query = ref('')
const sort = ref<'default' | 'cheap' | 'expensive' | 'name'>('default')

const items = computed(() => {
  let list = category.value ? snOf(category.value.id) : snProducts
  const q = query.value.trim().toLowerCase()
  if (q) list = list.filter((p) => p.name.toLowerCase().includes(q))
  if (sort.value === 'cheap') list = [...list].sort((a, b) => a.price - b.price)
  if (sort.value === 'expensive') list = [...list].sort((a, b) => b.price - a.price)
  if (sort.value === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  return list
})

const plural = (n: number) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'товар'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'товара'
  return 'товаров'
}

watch(catId, () => {
  query.value = ''
})

useSeoMeta({
  title: () => `${category.value?.label ?? 'Каталог'} | Мясная лавка «Саныч», концепт`,
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="sn-wrap snc">
    <div class="sn-pagehead">
      <nav class="sn-crumbs" aria-label="Навигация">
        <NuxtLink :to="snPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <NuxtLink v-if="category" :to="snPath('/catalog')">Каталог</NuxtLink>
        <span v-else>Каталог</span>
        <template v-if="category">
          <span aria-hidden="true">/</span>
          <span>{{ category.label }}</span>
        </template>
      </nav>
      <h1>{{ category?.label ?? 'Каталог' }}</h1>
      <p>{{ category?.lead ?? 'Охлаждённое фермерское мясо и птица. Цена за килограмм, вес куска — в карточке.' }}</p>
    </div>

    <div class="snc-layout">
      <aside class="snc-side" aria-label="Разделы каталога">
        <NuxtLink :to="snPath('/catalog')" class="snc-side__link" :class="{ 'is-active': !category }">
          <span class="snc-side__all" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M5.5 3.5h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zM15.5 3.5h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zM5.5 13.5h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zM14 17h7M17.5 13.5v7" /></svg>
          </span>
          <span>Все товары</span>
          <small>{{ snProducts.length }}</small>
        </NuxtLink>
        <NuxtLink
          v-for="c in snCategories"
          :key="c.id"
          :to="snPath(`/catalog/${c.id}`)"
          class="snc-side__link"
          :class="{ 'is-active': category?.id === c.id }"
        >
          <span
            v-if="c.icon"
            class="sn-animal"
            :style="{ '--sn-icon': `url(${snIcon(c.icon)})` }"
            aria-hidden="true"
          />
          <img v-else :src="snImg(snOf(c.id)[0].img)" alt="" class="snc-side__photo" />
          <span>{{ c.label }}</span>
          <small>{{ snOf(c.id).length }}</small>
        </NuxtLink>
        <div class="snc-side__request">
          <b>Телятина и конина</b>
          <span>Под заказ — позвоните, скажем, когда привезём.</span>
          <a :href="snContacts.phoneHref" class="sn-link">{{ snContacts.phone }}</a>
        </div>
      </aside>

      <div class="snc-main">
        <div class="snc-tools">
          <label class="snc-search">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5" />
            </svg>
            <input v-model="query" type="search" :placeholder="category ? `Найти в разделе «${category.label}»` : 'Найти: корейка, фарш, рёбра…'" aria-label="Поиск по каталогу" />
          </label>
          <label class="sn-field snc-sort">
            <select v-model="sort" aria-label="Сортировка">
              <option value="default">Сначала популярные</option>
              <option value="cheap">Сначала дешевле</option>
              <option value="expensive">Сначала дороже</option>
              <option value="name">По названию</option>
            </select>
          </label>
          <span class="snc-count">{{ items.length }} {{ plural(items.length) }}</span>
        </div>

        <div v-if="items.length" class="snc-grid">
          <SnProductCard v-for="p in items" :key="p.id" :product="p" />
        </div>
        <div v-else class="snc-empty">
          <b>Ничего не нашли по запросу «{{ query }}»</b>
          <p>
            Если нужного куска нет на сайте, напишите нам — скажем, когда сможем привезти.
          </p>
          <div class="snc-empty__actions">
            <button type="button" class="sn-btn sn-btn--line" @click="query = ''">Сбросить поиск</button>
            <a :href="snContacts.whatsapp" target="_blank" rel="noopener" class="sn-btn sn-btn--soft">Написать в WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sn .snc-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}

.sn .snc-side {
  position: sticky;
  top: 140px;
  display: grid;
  gap: 4px;
}

.sn .snc-side__link {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 6px 12px;
  border-radius: var(--sn-r);
  font-weight: 700;
  transition: background-color 0.15s;

  .sn-animal,
  .snc-side__photo,
  .snc-side__all {
    width: 32px;
    height: 32px;
  }

  > span:not(.sn-animal):not(.snc-side__all) {
    flex: 1;
    min-width: 0;
  }

  small {
    font-size: 13px;
    font-weight: 600;
    color: var(--sn-muted);
  }

  &:hover {
    background: var(--sn-paper);
  }

  &.is-active {
    background: var(--sn-rose);
  }
}

.sn .snc-side__all {
  display: grid;
  place-items: center;
  color: var(--sn-red);
}

.sn .snc-side__photo {
  border-radius: 8px;
  object-fit: cover;
}

.sn .snc-side__request {
  display: grid;
  gap: 4px;
  margin-top: 12px;
  padding: 14px;
  border-radius: var(--sn-r);
  background: var(--sn-paper);
  font-size: 13px;
  color: var(--sn-muted);

  b {
    color: var(--sn-ink);
    font-size: 14px;
  }
}

.sn .snc-tools {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px auto;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.sn .snc-search {
  position: relative;
  display: block;
  min-width: 0;

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--sn-muted);
  }

  input {
    width: 100%;
    min-width: 0;
    min-height: 48px;
    padding: 0 14px 0 42px;
    border: 1px solid transparent;
    border-radius: var(--sn-r);
    background: var(--sn-paper);
    outline: none;

    &:focus {
      border-color: var(--sn-red);
      background: #fff;
    }
  }
}

.sn .snc-count {
  font-size: 14px;
  color: var(--sn-muted);
  white-space: nowrap;
}

.sn .snc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(232px, 1fr));
  gap: 14px;
}

.sn .snc-empty {
  display: grid;
  gap: 10px;
  justify-items: start;
  padding: 28px;
  border-radius: var(--sn-r-lg);
  background: var(--sn-paper);

  p {
    color: var(--sn-muted);
  }
}

.sn .snc-empty__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 960px) {
  .sn .snc-layout {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  // Разделы — лента чипов, листается пальцем.
  .sn .snc-side {
    position: static;
    display: flex;
    gap: 6px;
    margin-inline: -16px;
    padding: 0 16px 4px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .sn .snc-side__link {
    flex: 0 0 auto;
    min-height: 44px;
    padding: 4px 14px 4px 8px;
    background: var(--sn-paper);
    white-space: nowrap;

    .sn-animal,
    .snc-side__photo,
    .snc-side__all {
      width: 26px;
      height: 26px;
    }
  }

  .sn .snc-side__request {
    display: none;
  }
}

@media (max-width: 640px) {
  .sn .sn-pagehead {
    padding: 18px 0 14px;
  }

  .sn .snc-tools {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .sn .snc-search {
    grid-column: 1 / -1;
  }

  .sn .snc-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .sn .snc-grid .sn-card {
    padding: 6px 6px 10px;
    border-radius: 18px;
  }

  .sn .snc-grid .sn-card__photo {
    border-radius: 13px;
  }

  .sn .snc-grid .sn-card__price b {
    font-size: 17px;
  }

  .sn .snc-grid .sn-card__name {
    font-size: 14px;
  }
}
</style>
