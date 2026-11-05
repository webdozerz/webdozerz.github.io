<script lang="ts" setup>
// Карточка позиции: тарелка на белом (их предметка), вид — меткой с рисунком кальмара или рыбы с пачек «Тиксов»,
// под названием — фасовка и срок годности. Цены у производителя на сайте нет — карточка ведёт на страницу позиции.
import type { RkProduct } from '~/utils/rkdon'

const props = defineProps<{ p: RkProduct }>()
const kind = computed(() => rkKinds.find((k) => k.id === props.p.kind)!)
</script>

<template>
  <NuxtLink :to="rkProductPath(p.id)" class="rk-card">
    <span class="rk-card__img">
      <img :src="rkImg(p.imgs[0])" :alt="p.name" width="560" height="560" loading="lazy" />
    </span>
    <span class="rk-card__body">
      <span class="rk-kind" :class="'rk-kind--' + p.kind">
        <img :src="rkImg(kind.icon)" alt="" width="26" height="20" />{{ kind.title }}<template v-if="p.form !== 'целая'"> · {{ p.form }}</template>
      </span>
      <b class="rk-card__name">{{ p.name }}</b>
      <span class="rk-card__meta">
        <span v-if="p.pack">{{ p.pack }}<template v-if="p.tab === 'weight'"> · короб 10 кг</template></span>
        <span v-if="p.shelf">годен {{ rkMonths(p.shelf) }}</span>
      </span>
    </span>
  </NuxtLink>
</template>

<style lang="scss">
.rk-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--rk-line);
  border-radius: var(--rk-R);
  background: #fff;
  overflow: hidden;
  transition: border-color 0.2s;
  &__img {
    display: block;
    aspect-ratio: 1;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s;
    }
  }
  &:hover {
    border-color: #d9c4cc;
    img {
      transform: scale(1.04);
    }
    .rk-card__name {
      color: var(--rk-accent);
    }
  }
  &__body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    flex: 1;
    padding: 4px 18px 18px;
  }
  &__name {
    font-size: 17px;
    line-height: 1.3;
    font-weight: 800;
    color: var(--rk-ink);
    transition: color 0.2s;
  }
  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 12px;
    margin-top: auto;
    font-size: 13px;
    color: var(--rk-muted);
  }
}
.rk-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}
@media (max-width: 1199px) {
  .rk-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 768px) {
  .rk-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}
@media (max-width: 576px) {
  .rk-card__body {
    padding: 0 12px 14px;
    gap: 6px;
  }
  .rk-card__name {
    font-size: 15px;
  }
  .rk-card .rk-kind {
    font-size: 12px;
    white-space: normal;
  }
}
</style>
