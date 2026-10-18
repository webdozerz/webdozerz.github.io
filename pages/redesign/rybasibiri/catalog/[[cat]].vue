<script lang="ts" setup>
import RsProductCard from '~/components/redesign/rybasibiri/RsProductCard.vue'

const route = useRoute()
const cart = useRybasibiriCart()
const catId = computed(() => String(route.params.cat || ''))
const category = computed(() => rsCategory(catId.value))
const favOnly = computed(() => route.query.fav === '1')

const PAGE = 12
const query = ref('')
const sort = ref<'default' | 'cheap' | 'expensive' | 'name'>('default')
const stockOnly = ref(false)
const shown = ref(PAGE)

const items = computed(() => {
  let list = category.value ? rsOf(category.value.id) : rsProducts
  if (favOnly.value) list = list.filter((p) => cart.isFav(p.id))
  if (stockOnly.value) list = list.filter(rsInStock)
  const q = query.value.trim().toLowerCase()
  if (q) list = list.filter((p) => rsTitle(p).toLowerCase().includes(q))
  // Сортировка по цене — по цене за кг, иначе 100 г и килограммы встают вперемешку.
  if (sort.value === 'cheap') list = [...list].sort((a, b) => rsPerKg(a) - rsPerKg(b))
  if (sort.value === 'expensive') list = [...list].sort((a, b) => rsPerKg(b) - rsPerKg(a))
  if (sort.value === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  // Нет в наличии — всегда в конце списка.
  return [...list].sort((a, b) => Number(!rsInStock(a)) - Number(!rsInStock(b)))
})
const visible = computed(() => items.value.slice(0, shown.value))

const counts = computed(() => Object.fromEntries(rsCategories.map((c) => [c.id, rsOf(c.id).length])))

const plural = (n: number) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'товар'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'товара'
  return 'товаров'
}

watch([catId, favOnly], () => {
  query.value = ''
  shown.value = PAGE
})
watch([query, sort, stockOnly], () => {
  shown.value = PAGE
})

const title = computed(() => (favOnly.value ? 'Избранное' : category.value?.label ?? 'Магазин'))

useSeoMeta({
  title: () => `${title.value} | «Стиль Продукт», концепт`,
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="rs-wrap rsc">
    <div class="rs-page-head">
      <nav class="rs-crumbs" aria-label="Навигация">
        <NuxtLink :to="rsPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <NuxtLink :to="rsPath('/catalog')">Магазин</NuxtLink>
        <template v-if="category || favOnly">
          <span aria-hidden="true">/</span>
          <span>{{ title }}</span>
        </template>
      </nav>
      <h1>{{ title }}</h1>
      <p v-if="category">{{ category.lead }}</p>
      <p v-else-if="favOnly">Товары, которые вы отметили сердечком. Хранятся в этом браузере.</p>
      <p v-else>Розничные цены. У каждого товара написано, за что цена — за 1 кг, за 100 г или за упаковку.</p>
    </div>

    <div class="rsc-layout">
      <aside class="rsc-side" aria-label="Разделы магазина">
        <NuxtLink :to="rsPath('/catalog')" :class="{ 'is-on': !category && !favOnly }">
          Все товары <small>{{ rsProducts.length }}</small>
        </NuxtLink>
        <NuxtLink
          v-for="c in rsCategories"
          :key="c.id"
          :to="rsPath(`/catalog/${c.id}`)"
          :class="{ 'is-on': category?.id === c.id }"
        >
          {{ c.label }} <small>{{ counts[c.id] }}</small>
        </NuxtLink>
        <NuxtLink :to="rsPath('/catalog') + '?fav=1'" :class="{ 'is-on': favOnly }">
          Избранное <small>{{ cart.favs.value.length }}</small>
        </NuxtLink>
        <NuxtLink :to="rsPath('/opt')" class="rsc-side__opt">
          Берёте от 10 кг? Смотрите оптовый прайс
        </NuxtLink>
      </aside>

      <div class="rsc-main">
        <div class="rsc-tools">
          <label class="rs-field rsc-tools__search">
            <span class="rs-sr">Поиск</span>
            <input v-model="query" type="search" placeholder="Найти: сёмга, филе, кальмар" />
          </label>
          <label class="rs-field rsc-tools__sort">
            <span class="rs-sr">Сортировка</span>
            <select v-model="sort">
              <option value="default">Как в магазине</option>
              <option value="cheap">Дешевле за кг</option>
              <option value="expensive">Дороже за кг</option>
              <option value="name">По названию</option>
            </select>
          </label>
          <label class="rsc-tools__check">
            <input v-model="stockOnly" type="checkbox" />
            <span>Только в наличии</span>
          </label>
        </div>

        <p class="rsc-count">{{ items.length }} {{ plural(items.length) }}</p>

        <div v-if="items.length" class="rs-grid">
          <RsProductCard v-for="(p, i) in visible" :key="p.id" :product="p" :eager="i < 4" />
        </div>
        <div v-else class="rs-panel rsc-empty">
          <p v-if="favOnly">В избранном пока пусто — отмечайте товары сердечком на фото.</p>
          <p v-else>Ничего не нашли. Попробуйте другое слово или позвоните: {{ rsContacts.phone }}.</p>
          <NuxtLink :to="rsPath('/catalog')" class="rs-btn">Все товары</NuxtLink>
        </div>

        <div v-if="items.length > shown" class="rsc-more">
          <button type="button" class="rs-btn rs-btn--line" @click="shown += PAGE">
            Показать ещё {{ Math.min(PAGE, items.length - shown) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.rs .rsc {
  .rsc-layout {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
    gap: 36px;
    align-items: start;
  }

  .rsc-side {
    position: sticky;
    top: 140px;
    display: grid;
    gap: 4px;

    a {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      padding: 10px 12px;
      border-radius: var(--rs-r);
      font-weight: 500;
      transition: background-color 0.15s;

      small {
        color: var(--rs-muted);
        font-weight: 400;
      }

      &:hover {
        background: var(--rs-ice);
      }

      &.is-on {
        background: var(--rs-ice-2);
        color: var(--rs-blue-d);
      }
    }

    a.rsc-side__opt {
      display: block;
      margin-top: 14px;
      padding: 14px;
      border-radius: var(--rs-r-lg);
      background: var(--rs-ice);
      color: var(--rs-blue-d);
      font-size: 14px;
      font-weight: 600;
    }
  }

  .rsc-main {
    min-width: 0;
  }

  .rsc-tools {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px auto;
    gap: 10px;
    align-items: center;

    &__check {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      padding: 0 14px;
      border-radius: var(--rs-r);
      background: var(--rs-ice);
      font-size: 14px;
      white-space: nowrap;
      cursor: pointer;

      input {
        width: 18px;
        height: 18px;
        accent-color: var(--rs-blue);
      }
    }
  }

  .rsc-count {
    margin: 18px 0 16px;
    font-size: 14px;
    color: var(--rs-muted);
  }

  .rsc-empty {
    display: grid;
    justify-items: start;
    gap: 14px;
  }

  .rsc-more {
    display: flex;
    justify-content: center;
    margin-top: 36px;
  }

  @media (max-width: 960px) {
    .rsc-layout {
      grid-template-columns: minmax(0, 1fr);
    }

    .rsc-side {
      display: none;
    }
  }

  @media (max-width: 640px) {
    .rsc-tools {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

      &__search {
        grid-column: 1 / -1;
      }

      &__check {
        padding: 0 12px;
      }
    }
  }

  @media (max-width: 360px) {
    .rsc-tools {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
