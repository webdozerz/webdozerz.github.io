<script lang="ts" setup>
import type { NsProduct } from '~/utils/naslagdeniaData'
import NsIcon from './NsIcon.vue'
import NsQty from './NsQty.vue'

// Карточка «срез на терракоте»: фото самой кондитерской на их красном фоне, под ним белая плашка.
// Готовые — цена за торт и счётчик, пирожные — цена коробки, заказные — цена за кг и «от N кг».
const props = defineProps<{ product: NsProduct }>()
const order = useNaslagdeniaOrder()
const ui = useNaslagdeniaUi()
const p = computed(() => props.product)
const custom = computed(() => nsIsCustom(p.value))
const to = computed(() => nsPath(`/product/${p.value.id}`))
const min = computed(() => nsMinWeight(p.value))
const labelText: Record<string, string> = { hit: 'Популярный', new: 'Новинка', order: 'Под заказ' }
const addReady = () => {
  order.add(p.value)
  ui.say(`${nsShort(p.value)} — в заказе`)
}
</script>

<template>
  <article class="ns-card" :class="{ 'is-custom': custom }">
    <NuxtLink :to="to" class="ns-card__photo">
      <img :src="p.img" :alt="p.title" width="600" height="440" loading="lazy" />
      <span v-if="p.labels?.length" class="ns-card__labels">
        <span v-for="l in p.labels" :key="l" class="ns-label" :class="`ns-label--${l}`">{{ labelText[l] }}</span>
      </span>
    </NuxtLink>
    <div class="ns-card__body">
      <NuxtLink :to="to" class="ns-card__title">{{ nsShort(p) }}</NuxtLink>
      <p v-if="p.desc && !custom" class="ns-card__desc">{{ p.desc }}</p>
      <p v-else-if="custom" class="ns-card__desc">На заказ от {{ nsKg(min) }} · начинка на выбор</p>
      <div class="ns-card__foot">
        <div class="ns-card__price">
          <template v-if="custom">
            <b>{{ nsMoney(p.price) }}<small>/кг</small></b>
            <span>от {{ nsKg(min) }} — {{ nsMoney(p.price * min) }}</span>
          </template>
          <template v-else-if="p.box">
            <b>{{ nsMoney(p.price) }}</b>
            <span>коробка {{ p.box }} шт · {{ nsMoney(p.piece!) }}/шт</span>
          </template>
          <template v-else>
            <b>{{ nsMoney(p.price) }}</b>
            <span>{{ p.weight }}</span>
          </template>
        </div>
        <NuxtLink v-if="custom" :to="to" class="ns-btn ns-btn--line ns-card__act">
          <span>Рассчитать</span>
          <NsIcon name="right" :size="18" />
        </NuxtLink>
        <NsQty v-else-if="order.qty(p.id)" :id="p.id" class="ns-card__act" :unit="p.box ? 'кор' : 'шт'" />
        <button v-else type="button" class="ns-btn ns-btn--main ns-card__act" @click="addReady">
          <NsIcon name="plus" :size="18" />
          <span>В заказ</span>
        </button>
      </div>
    </div>
  </article>
</template>

<style lang="scss">
.ns .ns-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #fff;
  border: 1px solid var(--ns-line);
  border-radius: var(--ns-r-card);
  overflow: hidden;

  &__photo {
    position: relative;
    display: block;
    aspect-ratio: 15 / 11;
    background: var(--ns-terra);
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s ease;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  &__labels {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    padding: 16px 18px 18px;
  }

  &__title {
    font-family: var(--ns-head);
    font-size: 21px;
    font-weight: 700;
    line-height: 1.15;
    color: var(--ns-dark);
    text-decoration: none;
    overflow-wrap: anywhere;
    hyphens: auto;

    &:hover {
      color: var(--ns-accent);
    }
  }

  &__desc {
    display: -webkit-box;
    margin: 0;
    overflow: hidden;
    font-size: 14px;
    line-height: 1.45;
    color: var(--ns-muted);
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  &__foot {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 10px 12px;
    margin-top: auto;
    padding-top: 10px;
  }

  &__price {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;

    b {
      font-size: 20px;
      font-weight: 700;
      color: var(--ns-dark);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    small {
      font-size: 14px;
      font-weight: 600;
      color: var(--ns-muted);
    }

    span {
      font-size: 13px;
      color: var(--ns-muted);
      white-space: nowrap;
    }
  }

  &__act {
    flex: none;
  }

  @media (max-width: 576px) {
    &__body {
      padding: 12px 12px 14px;
    }

    &__title {
      font-size: 18px;
    }

    &__desc {
      font-size: 13px;
    }

    &__foot {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      justify-content: stretch;
    }

    &__price b {
      font-size: 18px;
    }

    &__price span {
      white-space: normal;
    }

    &__act {
      width: 100%;
    }
  }
}
</style>
