<script lang="ts" setup>
import { zdMoney, zdPath } from '~/utils/zdrava22'
import type { ZdItem } from '~/utils/zdrava22'
// Плитка продукта пчеловодства: их фото, цена за кг/флакон и цена «от 10 кг», две кнопки как у оригинала
const props = defineProps<{ item: ZdItem }>()
</script>

<template>
  <article class="zd-item">
    <NuxtLink :to="zdPath(`/produkt/${props.item.id}`)" class="zd-item__ph">
      <img :src="props.item.img" :alt="props.item.title" loading="lazy" width="348" height="261" />
    </NuxtLink>
    <div class="zd-item__body">
      <h3><NuxtLink :to="zdPath(`/produkt/${props.item.id}`)">{{ props.item.name }}</NuxtLink></h3>
      <p>{{ props.item.note }}</p>
      <div class="zd-item__price">
        <b>{{ zdMoney(props.item.price) }}<small> / {{ props.item.per }}</small></b>
        <span v-if="props.item.bulk">от {{ props.item.bulk.from }} кг — {{ zdMoney(props.item.bulk.price) }}/кг</span>
      </div>
      <div class="zd-item__act">
        <NuxtLink :to="zdPath(`/produkt/${props.item.id}`)" class="zd-btn zd-btn--line">Подробнее</NuxtLink>
        <NuxtLink :to="{ path: zdPath('/kontakty'), query: { z: `i:${props.item.id}` }, hash: '#zakaz' }" class="zd-btn">Заказать</NuxtLink>
      </div>
    </div>
  </article>
</template>

<style lang="scss">
.zd-item {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: 20px;
  border: 1px solid var(--zd-line);
  background: #fff;
  overflow: hidden;

  &__ph {
    position: relative;
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--zd-surface);

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    &:hover img {
      transform: scale(1.04);
    }

    @media (max-width: 576px) {
      aspect-ratio: 2 / 1;
    }
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    padding: 16px 18px 18px;

    h3 {
      font-size: 18px;

      a:hover {
        color: var(--zd-accent);
      }
    }
    p {
      color: var(--zd-muted);
      font-size: 14px;
    }
  }
  &__price {
    display: grid;
    gap: 1px;
    margin-top: auto;
    padding-top: 6px;
    font-size: 13px;
    color: var(--zd-accent);
    font-weight: 600;

    b {
      font-size: 21px;
      color: var(--zd-ink);

      small {
        font-size: 14px;
        font-weight: 600;
        color: var(--zd-muted);
      }
    }
  }
  &__act {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 10px;

    .zd-btn {
      padding-left: 8px;
      padding-right: 8px;
    }
  }
}
</style>
