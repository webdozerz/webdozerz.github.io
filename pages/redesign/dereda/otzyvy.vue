<script lang="ts" setup>
import DrIcon from '~/components/redesign/dereda/DrIcon.vue'

useSeoMeta({ title: 'Отзывы — Дереда | Концепт редизайна' })
const shop = useDeredaShop()
const mine = computed(() =>
  Object.entries(shop.reviews.value).flatMap(([id, list]) => {
    const p = drProduct(id)
    return p ? list.map((r) => ({ ...r, p })) : []
  }),
)
const productOf = (match: string) => drProducts.find((p) => p.title.startsWith(match))
</script>

<template>
  <div class="dr-wrap dr-page dr-reviews">
    <nav class="dr-crumbs" aria-label="Навигация">
      <NuxtLink :to="drPath('/')">Главная</NuxtLink>
      <span>Отзывы</span>
    </nav>
    <h1>Отзывы</h1>
    <p class="dr-reviews__lead">
      Отзыв о продукции можно оставить на странице каждого товара, а о нашей работе — в группе ВКонтакте, в 2ГИС, Яндексе и Google.
    </p>

    <div class="dr-reviews__layout">
      <div class="dr-reviews__list">
        <h2>Отзывы на товары</h2>
        <figure v-for="(r, i) in mine" :key="`m${i}`" class="dr-reviews__item">
          <NuxtLink :to="drPath(`/product/${r.p.id}`)" class="dr-reviews__prod">
            <img :src="r.p.img" alt="" width="56" height="56" /><span>{{ drShort(r.p.title) }}</span>
          </NuxtLink>
          <blockquote>{{ r.text }}</blockquote>
          <figcaption>{{ r.name }} · {{ r.date }} · на модерации</figcaption>
        </figure>
        <figure v-for="r in drReviews" :key="r.name" class="dr-reviews__item">
          <NuxtLink v-if="productOf(r.match)" :to="drPath(`/product/${productOf(r.match)!.id}`)" class="dr-reviews__prod">
            <img :src="productOf(r.match)!.img" alt="" width="56" height="56" /><span>{{ drShort(productOf(r.match)!.title) }}</span>
          </NuxtLink>
          <blockquote>{{ r.text }}</blockquote>
          <figcaption>{{ r.name }}<template v-if="r.date"> · {{ r.date }}</template></figcaption>
        </figure>
      </div>
      <aside class="dr-reviews__side">
        <h2>О нас на площадках</h2>
        <a :href="drContacts.twogis" target="_blank" rel="noopener">2ГИС<DrIcon name="ext" :size="18" /></a>
        <a :href="drContacts.yandex" target="_blank" rel="noopener">Яндекс Карты<DrIcon name="ext" :size="18" /></a>
        <a :href="drContacts.flamp" target="_blank" rel="noopener">Фламп<DrIcon name="ext" :size="18" /></a>
        <a :href="drContacts.vk" target="_blank" rel="noopener">Группа ВКонтакте<DrIcon name="ext" :size="18" /></a>
        <NuxtLink :to="drPath('/catalog')" class="dr-btn dr-btn--main">Оставить отзыв</NuxtLink>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.dr-reviews {
  h1 {
    margin-bottom: 12px;
  }

  &__lead {
    max-width: 760px;
    margin-bottom: 28px;
    font-size: 17px;
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 32px;
    align-items: start;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__list {
    display: grid;
    gap: 14px;

    h2 {
      margin-bottom: 4px;
    }
  }

  &__item {
    display: grid;
    gap: 12px;
    padding: 22px;
    border: 1px solid var(--dr-line);
    border-radius: var(--dr-R);

    blockquote {
      font-size: 18px;
    }

    figcaption {
      color: var(--dr-muted);
    }
  }

  &__prod {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    justify-self: start;
    font-weight: 600;

    img {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      object-fit: cover;
    }

    &:hover {
      color: var(--dr-accent);
    }
  }

  &__side {
    display: grid;
    gap: 10px;
    padding: 24px;
    border-radius: var(--dr-R);
    background: var(--dr-surface);

    h2 {
      margin-bottom: 4px;
      font-size: 26px;
    }

    > a:not(.dr-btn) {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--dr-accent);
      font-weight: 600;
    }

    .dr-btn {
      margin-top: 8px;
      white-space: normal;
      height: auto;
      min-height: 46px;
      padding: 10px 16px;
      text-align: center;
    }
  }
}
</style>
