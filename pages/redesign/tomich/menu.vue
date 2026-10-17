<script lang="ts" setup>
import DishItem from '~/components/redesign/tomich/DishItem.vue'
import LunchBuilder from '~/components/redesign/tomich/LunchBuilder.vue'

useSeoMeta({ title: 'Меню обедов в офис | Торговый Дом «Томич»' })

const VIEW_KEY = 'tm-concept-view'
const view = ref<'list' | 'tile'>('list')
const active = ref<TmCategoryId>('salads')
const menuNote = ref(false)
const delivery = ref(tmDeliveryDate())

const sections = tmCategories.map((c) => ({ ...c, dishes: tmDishesOf(c.id) }))

const setView = (v: 'list' | 'tile') => {
  view.value = v
  try {
    localStorage.setItem(VIEW_KEY, v)
  } catch {
    /* ignore */
  }
}

const ribbon = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined

onMounted(() => {
  delivery.value = tmDeliveryDate()
  try {
    const saved = localStorage.getItem(VIEW_KEY)
    if (saved === 'list' || saved === 'tile') view.value = saved
  } catch {
    /* ignore */
  }
  // Подсвечиваем раздел, который сейчас на экране.
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting)
      if (visible.length) active.value = visible[0].target.id.replace('cat-', '') as TmCategoryId
    },
    { rootMargin: '-180px 0px -60% 0px' },
  )
  sections.forEach((s) => {
    const el = document.getElementById(`cat-${s.id}`)
    if (el) observer?.observe(el)
  })
})
onBeforeUnmount(() => observer?.disconnect())

watch(active, (id) => {
  const chip = ribbon.value?.querySelector<HTMLElement>(`[data-cat="${id}"]`)
  if (chip && ribbon.value) {
    ribbon.value.scrollTo({ left: chip.offsetLeft - 16, behavior: 'smooth' })
  }
})
</script>

<template>
  <div class="tm-wrap tmm">
    <header class="tm-pagehead tmm-head">
      <div class="tm-crumbs">
        <NuxtLink :to="tmPath()">Главная</NuxtLink><span>/</span><span>Меню обедов</span>
      </div>
      <h1>Меню обедов в офис</h1>
      <p>
        Заказ сегодня — привезём завтра, {{ delivery.weekday }}, {{ delivery.day }}. {{ tmOrderRule }}
      </p>
      <div class="tmm-head__tools">
        <button type="button" class="tm-btn tm-btn--ghost tm-btn--sm" @click="menuNote = true">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
          </svg>
          Скачать меню
        </button>
        <div class="tmm-view" role="group" aria-label="Вид меню">
          <button type="button" :class="{ 'is-on': view === 'list' }" :aria-pressed="view === 'list'" @click="setView('list')">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></svg>
            Список
          </button>
          <button type="button" :class="{ 'is-on': view === 'tile' }" :aria-pressed="view === 'tile'" @click="setView('tile')">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /></svg>
            Плитка
          </button>
        </div>
      </div>
      <p v-if="menuNote" class="tm-note tmm-head__note">
        Это демо: на сайте здесь скачивается меню на завтра в PDF, собранное из тех же блюд.
      </p>
    </header>

    <div class="tmm-layout">
      <nav class="tmm-cats" aria-label="Разделы меню">
        <div ref="ribbon" class="tmm-cats__scroll">
          <a
            v-for="s in sections"
            :key="s.id"
            :href="`#cat-${s.id}`"
            :data-cat="s.id"
            class="tmm-cats__link"
            :class="{ 'is-active': active === s.id }"
          >
            {{ s.label }}
            <span>{{ s.dishes.length }}</span>
          </a>
        </div>
      </nav>

      <div class="tmm-content">
        <LunchBuilder class="tmm-builder" />

        <section v-for="s in sections" :id="`cat-${s.id}`" :key="s.id" class="tmm-section">
          <h2>{{ s.label }}</h2>
          <div :class="view === 'tile' ? 'tmm-tiles' : 'tmm-list'">
            <DishItem v-for="dish in s.dishes" :key="dish.id" :dish="dish" :view="view" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.tmm {
  scroll-margin-top: 140px;
}

.tmm-head {
  &__tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
  }
  &__note {
    margin-top: 14px;
  }
}

.tmm-view {
  display: inline-flex;
  border-radius: var(--tm-r);
  box-shadow: inset 0 0 0 1px var(--tm-line);

  button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 38px;
    padding: 0 12px;
    border: 0;
    border-radius: var(--tm-r);
    background: none;
    font-weight: 600;
    font-size: 14px;
    color: var(--tm-muted);

    &.is-on {
      background: var(--tm-soft);
      color: var(--tm-green);
    }
  }
}

.tmm-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}

.tmm-cats {
  position: sticky;
  top: 130px;

  &__scroll {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  &__link {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 10px;
    border-radius: var(--tm-r);
    font-weight: 600;
    white-space: nowrap;
    transition: background 0.15s;

    span {
      color: var(--tm-muted);
      font-weight: 400;
      font-variant-numeric: tabular-nums;
    }
    &:hover {
      background: var(--tm-mint);
    }
    &.is-active {
      background: var(--tm-soft);
      color: var(--tm-green);
    }
  }
}

.tmm-builder {
  margin-bottom: 40px;
}

.tmm-section {
  scroll-margin-top: 140px;
  margin-bottom: 40px;

  h2 {
    font-size: 26px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--tm-line);
  }
}

.tmm-tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

@media (max-width: 960px) {
  .tmm-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
  .tmm-cats {
    top: 98px;
    z-index: 5;
    margin: 0 -16px 24px;
    background: #fff;
    border-bottom: 1px solid var(--tm-line);

    &__scroll {
      flex-direction: row;
      overflow-x: auto;
      padding: 8px 16px;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
    &__link {
      flex-shrink: 0;
      padding: 7px 14px;
      border-radius: 999px;

      &.is-active {
        background: var(--tm-soft);
        color: var(--tm-green);
      }
    }
  }
  .tmm-section,
  .tmm {
    scroll-margin-top: 170px;
  }
}

@media (max-width: 480px) {
  .tmm-tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;

    .tm-dish--tile {
      padding: 10px;
      .tm-dish__photo {
        margin: -10px -10px 0;
      }
      .tm-dish__name {
        font-size: 15px;
      }
      .tm-dish__buy {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }
      .tm-add,
      .tm-add__btn,
      .tm-add .tm-qty {
        width: 100%;
        min-width: 0;
      }
    }
  }
  .tmm-builder {
    padding: 20px 16px;
  }
}
</style>
