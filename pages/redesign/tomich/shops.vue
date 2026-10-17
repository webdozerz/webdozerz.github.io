<script lang="ts" setup>
useSeoMeta({ title: 'Магазины и контакты | Торговый Дом «Томич»' })

const zoom = useTomichZoom()
const filters: { id: 'all' | TmPlaceKind; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'shop', label: 'Магазины' },
  { id: 'cafe', label: 'Кафе' },
  { id: 'buffet', label: 'Буфеты' },
]
const filter = ref<'all' | TmPlaceKind>('all')
const kindLabel: Record<TmPlaceKind, string> = { shop: 'Магазин', cafe: 'Кафе', buffet: 'Буфет' }

const list = computed(() =>
  filter.value === 'all' ? tmPlaces : tmPlaces.filter((p) => p.kind === filter.value),
)
const countOf = (id: 'all' | TmPlaceKind) =>
  id === 'all' ? tmPlaces.length : tmPlaces.filter((p) => p.kind === id).length

const openPhotos = (p: TmPlace) =>
  zoom.open(
    p.photos.map((n) => tmGallery(n)),
    `${p.name}, ${p.address}`,
  )
</script>

<template>
  <div class="tm-wrap tms">
    <header class="tm-pagehead">
      <div class="tm-crumbs">
        <NuxtLink :to="tmPath()">Главная</NuxtLink><span>/</span><span>Магазины и контакты</span>
      </div>
      <h1>Магазины и контакты</h1>
      <p>Магазины почти во всех районах Томска. В любой из них можно заказать продукцию под заказ и забрать рядом с домом.</p>
    </header>

    <section class="tms-office">
      <div>
        <div class="tms-office__label">Офис и производство</div>
        <div class="tms-office__name">{{ tmContacts.company }}</div>
        <div>Томск, ул. Кулагина, 6б</div>
      </div>
      <a :href="tmContacts.phoneHref" class="tms-office__phone">{{ tmContacts.phone }}</a>
      <div class="tms-office__links">
        <a :href="tmContacts.map" target="_blank" rel="noopener" class="tm-btn">Все точки на карте 2ГИС</a>
        <a :href="tmContacts.vk" target="_blank" rel="noopener">ВКонтакте</a>
        <a :href="tmContacts.ok" target="_blank" rel="noopener">Одноклассники</a>
      </div>
    </section>

    <div class="tms-filters" role="group" aria-label="Тип точки">
      <button
        v-for="f in filters"
        :key="f.id"
        type="button"
        :class="{ 'is-on': filter === f.id }"
        :aria-pressed="filter === f.id"
        @click="filter = f.id"
      >
        {{ f.label }} <span>{{ countOf(f.id) }}</span>
      </button>
    </div>

    <div class="tms-grid">
      <article v-for="p in list" :key="p.id" class="tms-card">
        <button
          v-if="p.photos.length"
          type="button"
          class="tms-card__photo"
          :aria-label="`Фото: ${p.name}, ${p.address}`"
          @click="openPhotos(p)"
        >
          <img :src="tmGallery(p.noThumb ? p.photos[0] : p.photos[0] + 't')" :alt="`${p.name}, ${p.address}`" loading="lazy" width="400" height="300" />
          <span>{{ p.photos.length }} фото</span>
        </button>
        <div class="tms-card__body">
          <span class="tms-card__kind">{{ kindLabel[p.kind] }}</span>
          <h2>{{ p.address }}</h2>
          <div v-if="p.name !== 'Магазин'" class="tms-card__name">{{ p.name }}</div>
          <p v-if="p.hours">{{ p.hours }}</p>
          <p v-if="p.note" class="tm-muted">{{ p.note }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<style lang="scss">
.tms-office {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px 32px;
  padding: 28px 32px;
  border-radius: var(--tm-r-lg);
  background: var(--tm-soft);
  color: var(--tm-muted);

  &__label {
    font-size: 13px;
  }
  &__name {
    font-size: 22px;
    font-weight: 800;
    color: var(--tm-ink);
  }
  &__phone {
    font-size: clamp(24px, 3.4vw, 34px);
    font-weight: 800;
    color: var(--tm-green);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  &__links {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px 20px;

    a:not(.tm-btn) {
      color: var(--tm-green);
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
}

.tms-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 32px 0 20px;

  button {
    min-height: 38px;
    padding: 0 14px;
    border: 0;
    border-radius: var(--tm-r);
    background: var(--tm-mint);
    font-weight: 600;

    span {
      color: var(--tm-muted);
      font-variant-numeric: tabular-nums;
    }
    &.is-on {
      background: var(--tm-green);
      color: #fff;
      span {
        color: #cfe3d6;
      }
    }
  }
}

.tms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.tms-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--tm-line);
  border-radius: var(--tm-r-lg);
  overflow: hidden;

  &__photo {
    position: relative;
    display: block;
    padding: 0;
    border: 0;
    background: var(--tm-mint);

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 3;
      object-fit: cover;
    }
    span {
      position: absolute;
      left: 10px;
      bottom: 10px;
      padding: 3px 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.92);
      color: var(--tm-ink);
      font-size: 12.5px;
      font-weight: 600;
    }
  }
  &__body {
    display: grid;
    gap: 4px;
    padding: 16px;

    h2 {
      font-size: 19px;
      letter-spacing: -0.01em;
    }
    p {
      font-size: 14px;
    }
  }
  &__kind {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--tm-red);
  }
  &__name {
    font-weight: 600;
  }
}

@media (max-width: 640px) {
  .tms-office {
    grid-template-columns: minmax(0, 1fr);
    padding: 24px 20px;
  }
}
</style>
