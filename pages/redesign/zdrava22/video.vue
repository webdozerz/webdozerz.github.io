<script lang="ts" setup>
import { zdImg, zdPath, zdVideos } from '~/utils/zdrava22'
import { useZdUi } from '~/composables/useZdrava22'
import ZdIcon from '~/components/redesign/zdrava22/ZdIcon.vue'

useSeoMeta({ title: 'Видео — пасека «Ширяев и сыновья» | Концепт редизайна' })

const ui = useZdUi()
const [main, ...rest] = zdVideos
</script>

<template>
  <div class="zd-wrap">
    <nav class="zd-crumbs"><NuxtLink :to="zdPath()">Главная</NuxtLink><span>Видео</span></nav>
    <header class="zd-pagehead">
      <h1>Видео</h1>
      <p>{{ zdVideos.length }} роликов с нашей пасеки: работа с пчёлами и мёдом, оборудование, зимовка и отзыв покупателя. Включите звук.</p>
    </header>

    <section class="zd-sec zd-sec--first zd-vids">
      <button type="button" class="zd-vids__main" @click="ui.video.value = main">
        <img :src="zdImg('video.jpg')" alt="" width="500" height="281" />
        <span class="zd-vids__play"><ZdIcon name="play" :size="30" /></span>
        <span class="zd-vids__cap zd-vids__cap--page">{{ main.title }}</span>
      </button>
      <div class="zd-vids__about">
        <h2>{{ main.title }}</h2>
        <p>Пасека, ульи и медоносы Алтайского края — коротко о том, откуда наш мёд.</p>
        <button type="button" class="zd-btn" @click="ui.video.value = main"><ZdIcon name="play" :size="18" />Смотреть</button>
      </div>
    </section>

    <section class="zd-sec">
      <ul class="zd-vlist">
        <li v-for="v in rest" :key="v.src">
          <button type="button" @click="ui.video.value = v">
            <span class="zd-vlist__ic"><ZdIcon name="play" :size="20" /></span>
            <span>{{ v.title }}</span>
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss">
.zd-vids__about {
  display: grid;
  gap: 12px;
  align-content: center;
  justify-items: start;

  h2 {
    font-size: 26px;
  }
  p {
    color: var(--zd-muted);
  }
}
.zd-vids__main {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  border-radius: 20px;
  overflow: hidden;
  background: var(--zd-ink);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.88;
  }
}
.zd-vids__play {
  position: absolute;
  left: 50%;
  top: 50%;
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  margin: -38px 0 0 -38px;
  border-radius: 50%;
  background: var(--zd-yellow);
  color: var(--zd-ink);
}
.zd-vids__cap {
  position: absolute;
  left: 16px;
  bottom: 16px;
  max-width: calc(100% - 32px);
  padding: 8px 14px;
  border-radius: 12px;
  background: #fff;
  font-weight: 600;
  color: var(--zd-ink);
  text-align: left;
}
.zd-vids {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 32px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
}
.zd-vlist {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  button {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    height: 100%;
    padding: 14px 16px;
    border-radius: 16px;
    background: var(--zd-surface);
    text-align: left;
    font-weight: 600;
    color: var(--zd-ink);

    &:hover {
      background: var(--zd-soft);
      color: var(--zd-accent);
    }
  }
  &__ic {
    display: grid;
    flex: none;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #fff;
    color: var(--zd-accent);
  }

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.zd-vids__main .zd-vids__cap {
  @media (max-width: 576px) {
    left: 10px;
    bottom: 10px;
    padding: 6px 10px;
    font-size: 13px;
  }
}
.zd-vids__main .zd-vids__play {
  @media (max-width: 576px) {
    top: 40%;
    width: 56px;
    height: 56px;
    margin: -28px 0 0 -28px;
  }
}
.zd-vids__cap--page {
  @media (max-width: 989px) {
    display: none;
  }
}
</style>
