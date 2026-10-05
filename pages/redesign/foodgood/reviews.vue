<script lang="ts" setup>
import PageHead from '~/components/redesign/foodgood/PageHead.vue'

useSeoMeta({ title: 'Фото-отзывы | FoodGood Tomsk' })

const opened = ref<string | null>(null)

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') opened.value = null
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div>
    <PageHead
      title="Фото-отзывы"
      lead="Так о нас пишут покупатели. Оставьте свой отзыв и получите скидку 10% на следующий заказ."
    />

    <div class="fg-container">
      <div class="gallery">
        <button
          v-for="(src, i) in fgImages.reviews"
          :key="src"
          type="button"
          class="gallery__item"
          :aria-label="`Открыть отзыв ${i + 1}`"
          @click="opened = src"
        >
          <img :src="src" :alt="`Фото-отзыв ${i + 1}`" loading="lazy" />
        </button>

        <NuxtLink :to="fgPath('/discounts')" class="cta">
          <span class="cta__big">−10%</span>
          <strong>Скидка за ваш фото-отзыв</strong>
          <p>
            Оставьте отзыв на любой площадке и получите скидку 10% на следующий заказ.
          </p>
          <span class="cta__link">Как получить →</span>
        </NuxtLink>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="opened" class="lightbox" role="dialog" aria-modal="true" @click="opened = null">
        <button type="button" class="lightbox__close" aria-label="Закрыть" @click="opened = null">
          ×
        </button>
        <img :src="opened" alt="Фото-отзыв" @click.stop />
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  &__item {
    padding: 0;
    border: 1px solid var(--fg-line);
    border-radius: var(--fg-radius);
    overflow: hidden;
    background: var(--fg-paper);
    aspect-ratio: 3 / 4;
    cursor: zoom-in;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }

    &:hover img {
      transform: scale(1.03);
    }
  }
}

.cta {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  padding: 28px;
  border-radius: var(--fg-radius);
  background: var(--fg-berry-soft);

  &__big {
    font-family: var(--fg-serif);
    font-size: 64px;
    font-weight: 700;
    line-height: 1;
    color: var(--fg-berry);
  }

  strong {
    font-size: 20px;
    color: var(--fg-forest);
  }

  p {
    font-size: 15px;
    color: var(--fg-muted);
  }

  &__link {
    margin-top: 8px;
    font-weight: 700;
    color: var(--fg-berry);
  }
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(10, 20, 14, 0.88);

  img {
    max-width: min(560px, 100%);
    max-height: 90vh;
    border-radius: 16px;
  }

  &__close {
    position: absolute;
    top: 16px;
    right: 20px;
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    font-size: 28px;
    line-height: 1;
    cursor: pointer;
  }
}

@media (max-width: 860px) {
  .gallery {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .cta {
    grid-column: 1 / -1;
  }
}
</style>
