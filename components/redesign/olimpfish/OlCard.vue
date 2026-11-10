<script lang="ts" setup>
// K25 «развес»: фото на белом, чипы веса пересчитывают цену по их ₽/кг, «В корзину» → счётчик этой фасовки, молния — «Быстрая покупка»
import { olDisc, olGrams, olOld, olPath, olPrice, olRub, olSection, olSrc, olUnit } from '~/utils/olimpfish'
import type { OlProduct } from '~/utils/olimpfishData'
import { useOlShop, useOlUi } from '~/composables/useOlimpfish'
import OlIcon from './OlIcon.vue'

const props = defineProps<{ p: OlProduct }>()
const shop = useOlShop()
const ui = useOlUi()

// В карточке — до четырёх фасовок: первая, 1 кг, 2 кг и самая большая; все — на странице товара
const chips = computed(() => {
  const g = props.p.w?.g ?? []
  if (g.length <= 4) return g
  const pick = [g[0], ...[1000, 2000].filter((x) => g.includes(x) && x !== g[0]), g[g.length - 1]]
  return [...new Set(pick)].slice(0, 4)
})
const g = ref(props.p.w ? props.p.w.g[0] : 0)
const price = computed(() => olPrice(props.p, g.value))
const old = computed(() => olOld(props.p, g.value))
const n = computed(() => shop.qtyOf(props.p.id, g.value))
const key = computed(() => `${props.p.id}|${g.value}`)
const on = computed(() => shop.fav.value.includes(props.p.id))
const to = computed(() => olPath(`/product/${props.p.id}`))
// название режем по словам, а не line-clamp (аудит видит скрытые строки)
const title = computed(() => {
  const t = props.p.n
  if (t.length <= 58) return t
  const cut = t.slice(0, 56)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
})
</script>

<template>
  <article class="ol-card" :class="{ 'is-out': p.out }">
    <NuxtLink :to="to" class="ol-card__ph" :aria-label="p.n">
      <img :src="olSrc(p.th || p.img)" :alt="p.n" loading="lazy" width="400" height="400" />
      <span v-if="olDisc(p)" class="ol-card__tag">−{{ olDisc(p) }}%</span>
      <span v-else-if="p.out" class="ol-card__tag ol-card__tag--out">Нет в наличии</span>
    </NuxtLink>
    <button type="button" class="ol-card__fav" :class="{ 'is-on': on }" :aria-pressed="on" aria-label="В избранное" @click="shop.toggleFav(p.id)">
      <OlIcon name="heart" />
    </button>
    <div class="ol-card__body">
      <span class="ol-card__sec">{{ olSection(p.sec)?.name }}</span>
      <NuxtLink :to="to" class="ol-card__name">{{ title }}</NuxtLink>
      <div v-if="p.w" class="ol-chips" role="group" aria-label="Вес">
        <button v-for="x in chips" :key="x" type="button" class="ol-chip" :class="{ 'is-on': g === x }" @click="g = x">{{ olGrams(x) }}</button>
      </div>
      <span v-else-if="p.u" class="ol-card__unit">{{ olUnit(p) }}</span>
      <div class="ol-card__price">
        <b>{{ olRub(price) }}</b>
        <s v-if="old">{{ olRub(old) }}</s>
        <small>{{ p.w ? `${olRub(p.w.kg)}/кг` : '\u00a0' }}</small>
      </div>
      <div class="ol-card__buy">
        <span v-if="p.out" class="ol-btn ol-btn--off">Нет в наличии</span>
        <button v-else-if="!n" type="button" class="ol-btn ol-btn--acc" @click="shop.add(p, g)">В корзину</button>
        <div v-else class="ol-qty">
          <button type="button" aria-label="Меньше" @click="shop.setKey(key, n - 1)"><OlIcon name="minus" /></button>
          <span>{{ n }}&nbsp;шт</span>
          <button type="button" aria-label="Больше" @click="shop.setKey(key, n + 1)"><OlIcon name="plus" /></button>
        </div>
        <button v-if="!p.out" type="button" class="ol-card__quick" title="Быстрая покупка" aria-label="Быстрая покупка" @click="ui.open('quick', p.id, g)">
          <OlIcon name="bolt" />
        </button>
      </div>
    </div>
  </article>
</template>

<style lang="scss">
.ol .ol-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--ol-line);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s;
  &:hover {
    border-color: #c9d2df;
  }
  &:hover .ol-card__ph img {
    transform: scale(1.04);
  }
  &__ph {
    position: relative;
    display: block;
    aspect-ratio: 1;
    background: #fff;
    overflow: hidden;
    img {
      position: absolute;
      inset: 10px;
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      object-fit: contain;
      transition: transform 0.35s;
    }
  }
  &.is-out &__ph img {
    opacity: 0.55;
  }
  &__tag {
    position: absolute;
    left: 12px;
    top: 12px;
    padding: 4px 9px;
    border-radius: 8px;
    background: var(--ol-hi);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    &--out {
      background: var(--ol-surf);
      color: var(--ol-mute);
      font-weight: 600;
    }
  }
  &__fav {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: rgb(255 255 255 / 0.9);
    color: var(--ol-mute);
    cursor: pointer;
    svg {
      width: 21px;
      height: 21px;
    }
    &:hover {
      color: var(--ol-acc);
    }
    &.is-on {
      color: var(--ol-hi);
      svg {
        fill: currentColor;
      }
    }
  }
  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px 16px 16px;
  }
  &__sec {
    font-size: 12px;
    color: var(--ol-mute);
  }
  &__name {
    min-height: 2.7em;
    font-weight: 600;
    font-size: 15px;
    line-height: 1.35;
    color: var(--ol-ink);
    text-decoration: none;
    &:hover {
      color: var(--ol-acc);
    }
  }
  &__unit {
    align-self: start;
    padding: 5px 10px;
    border-radius: 8px;
    background: var(--ol-surf);
    font-size: 13px;
    font-weight: 600;
    color: var(--ol-ink);
  }
  &__price {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 10px;
    font-variant-numeric: tabular-nums;
    b {
      font-size: 21px;
      font-weight: 800;
      color: var(--ol-ink);
    }
    s {
      font-size: 14px;
      color: var(--ol-mute);
    }
    small {
      flex-basis: 100%;
      font-size: 12.5px;
      color: var(--ol-mute);
    }
  }
  &__buy {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 44px;
    gap: 8px;
    > .ol-btn,
    > .ol-qty {
      width: 100%;
    }
    > :only-child {
      grid-column: 1 / -1;
    }
  }
  &__quick {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border: 1px solid var(--ol-line);
    border-radius: 10px;
    background: #fff;
    color: var(--ol-acc);
    cursor: pointer;
    &:hover,
    &:focus {
      border: 1px solid var(--ol-acc);
    }
    svg {
      width: 20px;
      height: 20px;
    }
  }
}
@media (max-width: 576px) {
  .ol .ol-card {
    &__body {
      padding: 2px 12px 12px;
      gap: 8px;
    }
    &__name {
      font-size: 14px;
    }
    &__price b {
      font-size: 18px;
    }
    &__buy {
      grid-template-columns: minmax(0, 1fr) 40px;
      gap: 6px;
    }
    &__quick {
      width: 40px;
      height: 40px;
    }
    &__fav {
      width: 34px;
      height: 34px;
    }
    &__buy .ol-btn {
      padding: 0 8px;
      font-size: 14px;
    }
  }
}
@media (max-width: 576px) {
  .ol .ol-card {
    &__buy {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  .ol .ol-card .ol-card__quick {
    display: none;
  }
}
@media (max-width: 375px) {
  .ol .ol-card {
    &__buy .ol-qty {
      grid-template-columns: 34px minmax(0, 1fr) 34px;
    }
  }
}
</style>
