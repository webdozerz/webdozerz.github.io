<script lang="ts" setup>
import GmIcon from '~/components/redesign/gornyimed/GmIcon.vue'

useSeoMeta({ title: 'Фотогалерея пасеки | Пасеки Соловьёвых, концепт редизайна' })

const ui = useGornyimedUi()
const total = gmAlbums.reduce((n, a) => n + a.count, 0)
const show = (a: (typeof gmAlbums)[number], i: number) =>
  ui.open(
    a.photos.map((src, k) => ({ src, cap: `${a.title} · ${k + 1}` })),
    i,
  )
</script>

<template>
  <div class="gm-wrap gm-gal">
    <nav class="gm-crumbs" aria-label="Навигация">
      <NuxtLink :to="gmPath()">Главная</NuxtLink>
      <span>Фотогалерея</span>
    </nav>
    <h1 class="gm-title">Фотогалерея</h1>
    <p class="gm-lead">{{ total }} фото в четырёх альбомах: пасека в Горном Алтае, кочёвка на дягиль, медосбор и первый снег. В концепте — по 6 кадров из альбома.</p>

    <nav class="gm-gal__jump" aria-label="Альбомы">
      <a v-for="a in gmAlbums" :key="a.id" :href="`#album-${a.id}`">{{ a.title }} <small>{{ a.count }}</small></a>
    </nav>

    <section v-for="a in gmAlbums" :id="`album-${a.id}`" :key="a.id" class="gm-section gm-gal__album">
      <div class="gm-head">
        <div>
          <h2>{{ a.title }}</h2>
          <p>{{ a.count }} фото</p>
        </div>
      </div>
      <ul class="gm-gal__grid">
        <li v-for="(src, i) in a.photos" :key="src">
          <button type="button" :aria-label="`${a.title}, фото ${i + 1}`" @click="show(a, i)">
            <img :src="src" alt="" loading="lazy" />
            <GmIcon name="photo" :size="20" />
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss">
.gm-gal {
  &__jump {
    display: flex;
    gap: 6px;
    margin-top: 22px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: thin;

    a {
      flex: none;
      padding: 9px 14px;
      border-radius: var(--gm-r);
      background: var(--gm-surface);
      font-weight: 600;
      color: var(--gm-ink);
      white-space: nowrap;

      small {
        margin-left: 4px;
        color: var(--gm-muted);
        font-weight: 500;
      }
      &:hover {
        color: var(--gm-accent);
      }
    }
  }
  ul.gm-gal__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;

    button {
      position: relative;
      display: block;
      width: 100%;
      aspect-ratio: 4 / 3;
      border-radius: var(--gm-R);
      overflow: hidden;
      background: var(--gm-surface);
      cursor: zoom-in;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s;
      }
      .gm-icon {
        position: absolute;
        right: 10px;
        bottom: 10px;
        padding: 6px;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.9);
        color: var(--gm-ink);
        opacity: 0;
        transition: opacity 0.2s;
      }
      &:hover img {
        transform: scale(1.04);
      }
      &:hover .gm-icon {
        opacity: 1;
      }
    }
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
  }
}
</style>
