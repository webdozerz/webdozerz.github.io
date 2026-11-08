<script lang="ts" setup>
import { zdGalleries, zdImg, zdOrig, zdPath } from '~/utils/zdrava22'
import { useZdUi } from '~/composables/useZdrava22'
import ZdIcon from '~/components/redesign/zdrava22/ZdIcon.vue'

useSeoMeta({ title: 'Фото — пасека «Ширяев и сыновья» | Концепт редизайна' })

const route = useRoute()
const router = useRouter()
const ui = useZdUi()
const tab = computed(() => zdGalleries.find((g) => g.id === route.query.g) ?? zdGalleries[0])
const pick = (id: string) => router.replace({ query: { g: id } })
</script>

<template>
  <div class="zd-wrap">
    <nav class="zd-crumbs"><NuxtLink :to="zdPath()">Главная</NuxtLink><span>Фото</span></nav>
    <header class="zd-pagehead">
      <h1>Фото</h1>
      <p>Наша пасека в разные сезоны, медоносы вокруг неё и Алтай. Нажмите на снимок, чтобы открыть крупно.</p>
    </header>

    <div class="zd-tabs" role="tablist">
      <button v-for="g in zdGalleries" :key="g.id" type="button" role="tab" :aria-selected="tab.id === g.id" :class="{ 'is-on': tab.id === g.id }" @click="pick(g.id)">
        {{ g.title }}<small>{{ g.shots.length }}</small>
      </button>
    </div>

    <div class="zd-gal">
      <button v-for="(s, i) in tab.shots" :key="s.thumb" type="button" @click="ui.open(tab.shots, i, tab.title)">
        <img :src="s.thumb" :alt="`${tab.title}, фото ${i + 1}`" loading="lazy" width="348" height="231" />
      </button>
    </div>

    <a id="dnevnik" :href="zdOrig('/dnevnik-pchelovoda/')" target="_blank" rel="noopener" class="zd-pack zd-diary">
      <img :src="zdImg('two.jpg')" alt="" width="900" height="600" loading="lazy" />
      <span class="zd-pack__txt"><b>Дневник пчеловода</b><small>Что происходит на пасеке по сезонам — записи Алексея с фотографиями</small></span>
      <ZdIcon name="ext" />
    </a>
  </div>
</template>

<style lang="scss">
.zd-tabs {
  display: flex;
  gap: 6px;
  margin: 28px 0 20px;
  overflow-x: auto;
  scrollbar-width: none;

  button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex: none;
    min-height: 44px;
    padding: 8px 16px;
    border-radius: 12px;
    background: var(--zd-surface);
    font-weight: 600;
    white-space: nowrap;
    color: var(--zd-ink);

    small {
      font-size: 12px;
      color: var(--zd-muted);
    }
    &.is-on {
      background: var(--zd-accent);
      color: #fff;

      small {
        color: rgba(255, 255, 255, 0.75);
      }
    }
  }
}
.zd-gal {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;

  button {
    position: relative;
    display: block;
    aspect-ratio: 3 / 2;
    border-radius: 14px;
    overflow: hidden;
    background: var(--zd-surface);
  }
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  button:hover img {
    transform: scale(1.04);
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
}
.zd-diary {
  margin-top: 28px;
}
</style>
