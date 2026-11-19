<script lang="ts" setup>
// Карточка «на белом»: предметка фабрики 5:4, звёзды и число отзывов, «N купили за 2 месяца», цена и корзина со счётчиком.
import { skPath, skRub, skDiscount, skWeight, skPlural, type SkProduct } from '~/utils/shokoladki'
import { useSkStore } from '~/composables/useShokoladki'
import SkIcon from './SkIcon.vue'
import SkStars from './SkStars.vue'

const props = defineProps<{ p: SkProduct; withDelivery?: boolean }>()
const store = useSkStore()
const qty = computed(() => store.qtyOf(props.p.id))
const off = computed(() => skDiscount(props.p))
const isNew = computed(() => props.p.s.includes('novinki'))
const weight = computed(() => skWeight(props.p))
const to = computed(() => skPath(`/tovar/${props.p.id}/`))
// «Цена с учётом доставки» из фильтров оригинала: курьер по Москве до 4 000 ₽
const shown = computed(() => (props.withDelivery && props.p.p < 4000 ? props.p.p + 450 : props.p.p))
</script>

<template>
  <article class="sk-card">
    <NuxtLink :to="to" class="sk-card__media" :aria-label="p.n">
      <img :src="p.img" :alt="p.n" loading="lazy" width="500" height="400" />
      <span v-if="off || isNew" class="sk-card__tags">
        <span v-if="off" class="sk-tag sk-tag--sale">−{{ off }}%</span>
        <span v-if="isNew" class="sk-tag">Новинка</span>
      </span>
    </NuxtLink>
    <button type="button" class="sk-card__fav" :class="{ 'is-on': store.isFav(p.id) }" :aria-label="store.isFav(p.id) ? 'Убрать из избранного' : 'В избранное'" @click="store.toggleFav(p.id)">
      <SkIcon name="heart" />
    </button>
    <div class="sk-card__body">
      <div class="sk-card__meta">
        <SkStars v-if="p.r" :value="p.st" :count="p.r" small />
        <span v-if="p.b" class="sk-card__bought">{{ p.b }} {{ skPlural(p.b, 'купил', 'купили', 'купили') }} за 2 мес.</span>
      </div>
      <NuxtLink :to="to" class="sk-card__name">{{ p.n }}</NuxtLink>
      <div class="sk-card__foot">
        <div class="sk-card__price">
          <b>{{ skRub(shown) }}</b>
          <s v-if="p.o > p.p">{{ skRub(p.o) }}</s>
          <small v-else-if="withDelivery && p.p < 4000">с доставкой</small>
          <small v-else-if="weight">{{ weight }}</small>
        </div>
        <button v-if="!qty" type="button" class="sk-btn sk-card__buy" @click="store.add(p.id)"><SkIcon name="cart" /><span>В корзину</span></button>
        <div v-else class="sk-qty sk-card__qty">
          <button type="button" aria-label="Меньше" @click="store.setQty(p.id, qty - 1)"><SkIcon name="minus" /></button>
          <b>{{ qty }}</b>
          <button type="button" aria-label="Больше" @click="store.setQty(p.id, qty + 1)"><SkIcon name="plus" /></button>
        </div>
      </div>
    </div>
  </article>
</template>

<style lang="scss">
.sk .sk-card {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  background: #fff;
  border: 1px solid var(--sk-line);
  border-radius: 18px;
  overflow: hidden;
  transition: border-color 0.2s;
  &:hover {
    border-color: var(--sk-foil-soft);
  }
}
.sk .sk-card__media {
  position: relative;
  display: block;
  aspect-ratio: 5 / 4;
  background: #fff;
  overflow: hidden;
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
  }
  &:hover img {
    transform: scale(1.04);
  }
}
.sk .sk-card__tags {
  position: absolute;
  left: 12px;
  top: 12px;
  display: flex;
  gap: 6px;
}
.sk .sk-card__fav {
  position: absolute;
  right: 10px;
  top: 10px;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: var(--sk-muted);
  cursor: pointer;
  .sk-icon {
    width: 20px;
    height: 20px;
  }
  &:hover {
    color: var(--sk-acc);
  }
  &.is-on {
    color: var(--sk-acc);
    .sk-icon {
      fill: currentColor;
    }
  }
}
.sk .sk-card__body {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 8px;
  padding: 14px 16px 16px;
}
.sk .sk-card__meta {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 10px;
  min-height: 20px;
  overflow: hidden;
  font-size: 12.5px;
  color: var(--sk-muted);
}
.sk .sk-card__bought {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sk .sk-card__name {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: calc(3 * 1.35em);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--sk-ink);
  text-decoration: none;
  &:hover {
    color: var(--sk-acc);
  }
}
.sk .sk-card__foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  align-self: end;
}
.sk .sk-card__price {
  display: grid;
  min-width: 0;
  b {
    font-size: 20px;
    font-weight: 800;
    color: var(--sk-acc);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  s,
  small {
    font-size: 12.5px;
    color: var(--sk-muted);
    white-space: nowrap;
  }
}
.sk .sk-card__buy {
  flex: none;
  min-height: 42px;
  padding: 0 14px;
}
.sk .sk-card__qty {
  flex: none;
}
@media (max-width: 576px) {
  .sk .sk-card__body {
    padding: 10px 10px 12px;
    gap: 6px;
  }
  .sk .sk-card__bought {
    display: none;
  }
  .sk .sk-card__bought {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sk .sk-card__name {
    font-size: 13.5px;
  }
  .sk .sk-card__foot {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: stretch;
    gap: 8px;
  }
  .sk .sk-card__price b {
    font-size: 17px;
  }
  .sk .sk-card__buy {
    width: 100%;
    min-height: 40px;
    padding: 0 8px;
  }
  .sk .sk-card__qty {
    width: 100%;
    justify-content: space-between;
  }
  .sk .sk-card__fav {
    width: 34px;
    height: 34px;
    right: 6px;
    top: 6px;
  }
}
</style>
