<script lang="ts" setup>
import SnBuy from './SnBuy.vue'

const props = defineProps<{ product: SnProduct }>()
const category = computed(() => snCategory(props.product.cat))
const meta = computed(() => {
  const p = props.product
  if (p.unit === 'piece') return snPieceLabel(p)
  if (p.unit === 'set') return 'набор от 12 кг'
  if (p.min) return `от ${p.min} кг`
  if (p.unit === 'portion') return 'на углях, 25–45 мин'
  return ''
})
</script>

<template>
  <article class="sn-card">
    <NuxtLink :to="snPath(`/product/${product.id}`)" class="sn-card__photo">
      <img :src="snImg(product.img)" :alt="product.name" loading="lazy" width="360" height="270" />
      <span v-if="meta" class="sn-card__meta">{{ meta }}</span>
    </NuxtLink>
    <div class="sn-card__body">
      <div class="sn-card__price">
        <b>{{ snRub(product.price) }}</b>
        <span>{{ snPer(product) }}</span>
      </div>
      <NuxtLink :to="snPath(`/product/${product.id}`)" class="sn-card__name">{{ product.name }}</NuxtLink>
      <span class="sn-card__cat">{{ category?.label }}</span>
    </div>
    <SnBuy :product="product" />
  </article>
</template>

<style lang="scss">
.sn .sn-card {
  container: sncard / inline-size;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding: 10px 10px 14px;
  border-radius: var(--sn-r-lg);
  background: #fff;
  box-shadow: inset 0 0 0 1px var(--sn-line);

  > .sn-buy {
    margin-top: auto;
    padding: 0 4px;
  }
}

.sn .sn-card__photo {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 16px;
  background: var(--sn-paper);

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    transition: transform 0.3s;
  }

  &:hover img {
    transform: scale(1.04);
  }
}

.sn .sn-card__meta {
  position: absolute;
  left: 8px;
  bottom: 8px;
  max-width: calc(100% - 16px);
  padding: 4px 9px;
  border-radius: 8px;
  background: rgb(255 255 255 / 92%);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sn .sn-card__body {
  display: grid;
  gap: 4px;
  padding: 0 4px;
  min-width: 0;
}

.sn .sn-card__price {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0 6px;

  b {
    font-family: var(--sn-head);
    font-size: 20px;
    font-weight: 600;
    color: var(--sn-red);
    white-space: nowrap;
  }

  span {
    font-size: 13px;
    color: var(--sn-muted);
  }
}

.sn .sn-card__name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.7em;
  font-weight: 700;
  line-height: 1.35;
  overflow-wrap: anywhere;

  &:hover {
    color: var(--sn-red);
  }
}

.sn .sn-card__cat {
  font-size: 12px;
  color: var(--sn-muted);
}
</style>
