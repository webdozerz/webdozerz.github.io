<script lang="ts" setup>
// Карточка K17 «пачка»: упаковка на белом, марка, метки жирности, объём и срок годности, медали. Цен у оригинала нет —
// вся карточка ведёт на страницу продукта, где «Где купить» в выбранном городе.
import ZlIcon from './ZlIcon.vue'
import type { ZlProduct } from '~/utils/zolotieluga'

const props = defineProps<{ product: ZlProduct }>()
const awards = computed(() => zlAwardsCount(props.product))
const volume = computed(() => {
  const v = props.product.volume || ''
  const m = v.match(/^[^,(]+/)
  return m ? m[0].replace(/\s+в упаковке.*$/, '').trim() : ''
})
</script>

<template>
  <NuxtLink :to="zlProductPath(product.id)" class="zl-card" :class="'zl-card--' + product.brand">
    <div class="zl-card__img">
      <img :src="zlImg(product.imgs[0])" :alt="zlBrandTitle(product.brand) + ', ' + product.name" loading="lazy" width="300" height="300" />
      <span v-if="awards" class="zl-card__medal" :title="'Наград: ' + awards"><ZlIcon name="award" :size="16" />{{ awards }}</span>
    </div>
    <div class="zl-card__body">
      <small class="zl-card__brand">{{ zlBrandTitle(product.brand) }}</small>
      <h3>{{ product.name }}</h3>
      <div v-if="product.fats.length" class="zl-card__fats">
        <span v-for="f in product.fats" :key="f" class="zl-fat" :class="'zl-fat--' + zlFatTone(f)">{{ f }}</span>
      </div>
      <p class="zl-card__meta">
        <span v-if="volume">{{ volume }}</span>
        <span v-if="product.shelf">срок {{ product.shelf }}</span>
      </p>
    </div>
  </NuxtLink>
</template>

<style lang="scss">
.zl-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: var(--zl-R);
  background: #fff;
  border: 1px solid var(--zl-line);
  overflow: hidden;
  transition: border-color 0.2s;
  &:hover {
    border-color: #e8bbb5;
  }
  &:hover img {
    transform: scale(1.04);
  }
  &__img {
    position: relative;
    aspect-ratio: 1 / 1;
    padding: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    overflow: hidden;
    img {
      position: absolute;
      inset: 18px;
      width: calc(100% - 36px);
      height: calc(100% - 36px);
      max-width: none;
      object-fit: contain;
      transition: transform 0.3s;
    }
  }
  &__medal {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 28px;
    padding: 0 9px;
    border-radius: 8px;
    background: var(--zl-gold-bg);
    color: #8a5a00;
    font-size: 13px;
    font-weight: 700;
    .zl-icon {
      color: var(--zl-gold);
    }
  }
  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px 16px;
    border-top: 1px solid var(--zl-line);
  }
  &__brand {
    font-size: 13px;
    font-weight: 600;
    color: var(--zl-accent);
  }
  &--sit &__brand {
    color: var(--zl-sit);
  }
  h3 {
    font-size: 19px;
    margin-top: -4px;
  }
  &__fats {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  &__meta {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 2px 12px;
    font-size: 13px;
    color: var(--zl-muted);
  }
}
@media (max-width: 576px) {
  .zl-card {
    &__img img {
      inset: 12px;
      width: calc(100% - 24px);
      height: calc(100% - 24px);
    }
    &__body {
      padding: 12px;
    }
    h3 {
      font-size: 17px;
    }
  }
}
</style>
