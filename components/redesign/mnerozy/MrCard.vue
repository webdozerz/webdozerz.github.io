<script lang="ts" setup>
import MrIcon from './MrIcon.vue'
import MrQty from './MrQty.vue'

// K2: квадратное фото магазина на светлой подложке, «+» на фото добавляет с оформлением по
// умолчанию (как «Заказать» у оригинала), после — счётчик на фото. Варианты — на странице товара.
const props = defineProps<{ p: MrProduct }>()
const shop = useMnerozyShop()
const key = computed(() => shop.keyOf(props.p.id, mrDefaultPick(props.p)))
const to = computed(() => mrPath(`/product/${props.p.id}`))
const paid = computed(() => mrHasPaidOpts(props.p))
const optNote = computed(() => {
  if (!props.p.opts) return ''
  const names = props.p.opts.map((o) => o.title.toLowerCase())
  return names.join(', ') + ' на выбор'
})
</script>

<template>
  <article class="mr-card">
    <div class="mr-card__media">
      <NuxtLink :to="to" class="mr-card__photo">
        <img :src="props.p.img" :alt="props.p.title" loading="lazy" width="400" height="400" />
        <span v-if="props.p.promo" class="mr-card__badge">Акция</span>
      </NuxtLink>
      <button
        type="button"
        class="mr-card__fav"
        :class="{ 'is-on': shop.isFav(props.p.id) }"
        :aria-label="shop.isFav(props.p.id) ? 'Убрать из избранного' : 'В избранное'"
        @click="shop.toggleFav(props.p.id)"
      >
        <MrIcon name="heart" :size="20" />
      </button>
      <MrQty class="mr-card__buy" :k="key" kind="photo" :note="paid ? 'Добавили. Оформление можно выбрать в карточке' : ''" />
    </div>
    <div class="mr-card__body">
      <p class="mr-card__price">
        <b>{{ props.p.opts && paid ? 'от ' : '' }}{{ mrRub(props.p.price) }}</b>
      </p>
      <NuxtLink :to="to" class="mr-card__title">{{ props.p.title }}</NuxtLink>
      <p v-if="optNote" class="mr-card__note">{{ optNote }}</p>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.mr-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;

  &__photo {
    position: relative;
    display: block;
    aspect-ratio: 1;
    border-radius: var(--mr-r-card);
    overflow: hidden;
    background: var(--mr-surface);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s ease;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  &__badge {
    position: absolute;
    left: 10px;
    top: 10px;
    padding: 4px 10px;
    border-radius: 8px;
    background: var(--mr-accent);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.4;
  }

  &__fav {
    position: absolute;
    top: 10px;
    right: 10px;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgb(255 255 255 / 0.92);
    color: var(--mr-ink);
    transition: color 0.2s;

    &:hover,
    &.is-on {
      color: var(--mr-accent);
    }

    &.is-on :deep(path) {
      fill: currentColor;
    }
  }

  &__media {
    position: relative;
  }

  &__buy {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 4px 0;
  }

  &__price b {
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }

  &__title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.35;

    &:hover {
      color: var(--mr-accent);
    }
  }

  &__note {
    color: var(--mr-muted);
    font-size: 13px;
    line-height: 1.35;
  }
}

@media (max-width: 576px) {
  .mr-card {
    &__price b {
      font-size: 17px;
    }

    &__title {
      font-size: 14px;
    }

    &__note {
      display: none;
    }

    &__fav {
      top: 8px;
      right: 8px;
      width: 34px;
      height: 34px;
    }
  }
}
</style>
