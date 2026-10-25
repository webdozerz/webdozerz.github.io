<script lang="ts" setup>
import BkIcon from './BkIcon.vue'
import BkQty from './BkQty.vue'

// Карточка: снимок 4:5 на всю ширину, плашка «цена · название · состав» заходит на низ кадра.
const props = defineProps<{ product: BkProduct; eager?: boolean }>()
const shop = useBuketyShop()
const p = computed(() => props.product)
const choice = computed(() => bkHasChoice(p.value))
const to = computed(() => bkPath(`/product/${p.value.id}`))
const pickLabel = computed(() => (/длина/i.test(p.value.opt?.title ?? '') ? 'Выбрать длину' : /размер/i.test(p.value.opt?.title ?? '') ? 'Выбрать размер' : 'Выбрать'))
</script>

<template>
  <article class="bk-card">
    <NuxtLink :to="to" class="bk-card__photo">
      <img :src="p.img" :alt="p.title" width="500" height="625" :loading="props.eager ? 'eager' : 'lazy'" />
    </NuxtLink>
    <button
      type="button"
      class="bk-card__fav"
      :class="{ 'is-on': shop.isFav(p.id) }"
      :aria-label="shop.isFav(p.id) ? 'Убрать из избранного' : 'В избранное'"
      @click="shop.toggleFav(p.id)"
    >
      <BkIcon name="heart" :size="20" />
    </button>
    <div class="bk-card__plate">
      <div class="bk-card__price">
        <b>{{ choice ? 'от ' : '' }}{{ bkRub(p.price) }}</b>
        <span v-if="p.opt">{{ p.opt.values.length }} {{ bkPlural(p.opt.values.length, 'вариант', 'варианта', 'вариантов') }}</span>
      </div>
      <NuxtLink :to="to" class="bk-card__title">{{ p.title }}</NuxtLink>
      <p class="bk-card__comp">{{ p.comp }}</p>
      <NuxtLink v-if="choice" :to="to" class="bk-btn bk-btn--soft bk-card__pick"><span class="bk-card__picklong">{{ pickLabel }}</span><span class="bk-card__pickshort">Выбрать</span></NuxtLink>
      <BkQty v-else :pid="p.id" :pick="p.opt?.values[0].label" />
    </div>
  </article>
</template>

<style lang="scss">
.bk-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;

  &__photo {
    display: block;
    overflow: hidden;
    border-radius: var(--bk-r-card);
    background: var(--bk-gray);

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 5;
      object-fit: cover;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.03);
    }
  }

  &__fav {
    position: absolute;
    top: 12px;
    right: 12px;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.92);
    color: var(--bk-ink);
    transition: color 0.15s;

    &:hover {
      color: var(--bk-rose);
    }

    &.is-on {
      color: var(--bk-rose);

      svg {
        fill: currentColor;
      }
    }
  }

  &__plate {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 4px;
    margin: -34px 10px 0;
    padding: 14px 14px 14px;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 6px 20px rgba(34, 48, 62, 0.08);
  }

  &__price {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;

    b {
      font-size: 21px;
      font-weight: 800;
      white-space: nowrap;
    }

    span {
      font-size: 13px;
      color: var(--bk-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-weight: 700;
    line-height: 1.3;

    &:hover {
      color: var(--bk-accent);
    }
  }

  &__comp {
    margin-bottom: 10px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    color: var(--bk-muted);
  }

  .bk-qty,
  &__pick {
    margin-top: auto;
  }

  &__pickshort {
    display: none;
  }

  &__pick {
    min-height: 44px;
    border-radius: 12px;
    padding: 0 12px;
    font-size: 15px;
  }
}

@media (max-width: 576px) {
  .bk-card {
    &__plate {
      margin: -24px 6px 0;
      padding: 10px 10px 10px;
      border-radius: 14px;
    }

    &__price {
      b {
        font-size: 18px;
      }

      span {
        display: none;
      }
    }

    &__title {
      font-size: 15px;
    }

    &__comp {
      font-size: 13px;
    }

    &__fav {
      top: 8px;
      right: 8px;
      width: 36px;
      height: 36px;
    }

    .bk-qty__add {
      padding: 0 8px;
      gap: 6px;
      font-size: 15px;
    }

    .bk-qty__btn {
      width: 36px;
    }

    &__pick {
      font-size: 14px;
      padding: 0 8px;
    }
  }
}

@media (max-width: 375px) {
  .bk-card__picklong {
    display: none;
  }

  .bk-card__pickshort {
    display: inline;
  }
}
</style>
