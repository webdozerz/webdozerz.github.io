<script lang="ts" setup>
useSeoMeta({ title: 'Фото-отзывы | FoodGood Tomsk' })

const opened = ref<string | null>(null)
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') opened.value = null
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const places = [
  { title: '2ГИС', href: 'https://2gis.ru/tomsk/search/FoodGood' },
  { title: 'ВКонтакте', href: 'https://vk.com/foodgoodtomsk' },
  { title: 'Instagram', href: 'https://instagram.com/foodgood.tomsk/' },
]
</script>

<template>
  <div class="fg-wrap">
    <div class="fg-page-head">
      <nav class="fg-crumbs" aria-label="Навигация">
        <NuxtLink :to="fgPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>Фото-отзывы</span>
      </nav>
      <h1>Фото-отзывы</h1>
      <p>Так о нас пишут покупатели. Оставьте свой отзыв с фото — дадим скидку 10% на следующий заказ.</p>
    </div>

    <div class="layout">
      <div class="gallery">
        <button
          v-for="(src, i) in fgImages.reviews"
          :key="src"
          type="button"
          class="gallery__item"
          :aria-label="`Открыть фото-отзыв ${i + 1}`"
          @click="opened = src"
        >
          <img :src="src" :alt="`Фото-отзыв ${i + 1}`" loading="lazy" />
        </button>
      </div>

      <aside class="fg-panel side">
        <strong class="side__big">−10%</strong>
        <h2>Скидка за ваш отзыв</h2>
        <p class="fg-muted">
          Оставьте отзыв с фото на любой площадке и покажите скриншот при следующей покупке.
        </p>
        <div class="side__links">
          <a v-for="pl in places" :key="pl.title" :href="pl.href" target="_blank" rel="noopener" class="fg-btn fg-btn--line">
            {{ pl.title }}
          </a>
        </div>
        <NuxtLink :to="fgPath('/discounts')" class="fg-link">Условия скидки</NuxtLink>
      </aside>
    </div>

    <Teleport to="body">
      <div v-if="opened" class="fg-lightbox" role="dialog" aria-modal="true" @click="opened = null">
        <button type="button" class="fg-lightbox__close" aria-label="Закрыть" @click="opened = null">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <img :src="opened" alt="Фото-отзыв" @click.stop />
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 16px;
  align-items: start;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  &__item {
    overflow: hidden;
    aspect-ratio: 3 / 4;
    border-radius: 20px;
    background: var(--fg-sage);
    cursor: zoom-in;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }
}

.side {
  display: grid;
  gap: 12px;

  h2 {
    font-size: 22px;
  }

  &__big {
    color: var(--fg-leaf);
    font-size: 48px;
    font-weight: 600;
    line-height: 1;
  }

  &__links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
}
</style>

<style lang="scss">
.fg-lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(18, 38, 26, 0.85);

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 16px;
  }

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border: 0;
    border-radius: 50%;
    background: #fff;
    color: #12261a;
    cursor: pointer;

    svg {
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
    }
  }
}
</style>
