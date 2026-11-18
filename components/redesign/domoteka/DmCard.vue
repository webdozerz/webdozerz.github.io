<script lang="ts" setup>
// Карточка модели «стол с образцами»: предметка на белом, кружки столешницы и ножек меняют снимок, как свотчи оригинала.
import type { DmProduct } from '~/utils/domoteka'
import { dmColorName, dmExtText, dmFindOffer, dmMechShort, dmOfferImg, dmPath, dmSizeText } from '~/utils/domoteka'
import { useDmStore } from '~/composables/useDomoteka'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'

const props = defineProps<{ p: DmProduct }>()
const store = useDmStore()
const c = ref(props.p.offers[0]?.c)
const l = ref(props.p.offers[0]?.l)
const offer = computed(() => dmFindOffer(props.p, c.value, l.value))
const legsFor = computed(() => new Set(props.p.offers.filter((o) => o.c === c.value).map((o) => o.l)))
const pickC = (id: string) => {
  c.value = id
  if (!legsFor.value.has(l.value || '')) l.value = props.p.offers.find((o) => o.c === id)?.l
}
const link = computed(() => ({ path: dmPath(`/model/${props.p.id}/`), query: offer.value && offer.value !== props.p.offers[0] ? { v: offer.value.id } : {} }))
const tagText: Record<string, string> = { new: 'Новинка', hit: 'Хит продаж', sale: 'Акция' }
const isFav = computed(() => store.fav.value.includes(props.p.id))
const isCmp = computed(() => store.cmp.value.includes(props.p.id))
const ext = computed(() => dmExtText(props.p))
</script>

<template>
  <article class="dm-card">
    <NuxtLink :to="link" class="dm-card__photo" :aria-label="p.n">
      <img :src="dmOfferImg(offer)" :alt="p.n" width="640" height="640" loading="lazy" />
    </NuxtLink>
    <div v-if="p.tags.length" class="dm-card__tags">
      <span v-for="t in p.tags.slice(0, 1)" :key="t" class="dm-tag" :class="`dm-tag--${t}`">{{ tagText[t] }}</span>
    </div>
    <div class="dm-card__body">
      <div class="dm-card__top">
        <span class="dm-card__series">Серия {{ p.series }}</span>
        <div class="dm-card__acts">
      <button type="button" class="dm-card__act" :class="{ 'is-on': isFav }" :aria-pressed="isFav" :title="isFav ? 'Убрать из избранного' : 'В избранное'" @click="store.toggleFav(p.id, p.n)">
        <DmIcon name="heart" />
      </button>
      <button type="button" class="dm-card__act" :class="{ 'is-on': isCmp }" :aria-pressed="isCmp" :title="isCmp ? 'Убрать из сравнения' : 'К сравнению'" @click="store.toggleCmp(p.id, p.n)">
        <DmIcon name="compare" />
      </button>
    </div>
      </div>
      <NuxtLink :to="link" class="dm-card__name">{{ p.n }}</NuxtLink>
      <p class="dm-card__size">
        <span>{{ dmSizeText(p) }}</span>
        <span v-if="ext" class="dm-card__ext"><DmIcon name="expand" />{{ ext }}</span>
        <span v-else-if="p.sec === 'stoly'" class="dm-card__mech">{{ dmMechShort(p) }}</span>
      </p>
      <div class="dm-card__sw">
        <div class="dm-swrow" role="group" :aria-label="p.colorLabel">
          <button
            v-for="o in p.colors.slice(0, 6)"
            :key="o.id"
            type="button"
            class="dm-sw"
            :class="{ 'is-on': o.id === c }"
            :title="`${p.colorLabel}: ${o.n}`"
            :aria-label="`${p.colorLabel}: ${dmColorName(o.n)}`"
            @click="pickC(o.id)"
          >
            <img :src="`/redesign/domoteka/img/sw/${o.sw}`" alt="" width="28" height="28" loading="lazy" />
          </button>
        </div>
        <div v-if="p.legs.length > 1" class="dm-swrow dm-swrow--legs" role="group" aria-label="Ножки">
          <button
            v-for="o in p.legs"
            :key="o.id"
            type="button"
            class="dm-sw dm-sw--leg"
            :class="{ 'is-on': o.id === l, 'is-off': !legsFor.has(o.id) }"
            :disabled="!legsFor.has(o.id)"
            :title="`Ножки: ${o.n}`"
            :aria-label="`Ножки: ${o.n}`"
            @click="l = o.id"
          >
            <img :src="`/redesign/domoteka/img/sw/${o.sw}`" alt="" width="22" height="22" loading="lazy" />
          </button>
        </div>
      </div>
      <span class="dm-card__count">{{ p.offers.length }} {{ p.offers.length === 1 ? 'вариант' : p.offers.length < 5 ? 'варианта' : 'вариантов' }}</span>
    </div>
  </article>
</template>

<style lang="scss">
.dm .dm-card {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  background: #fff;
  border: 1px solid var(--dm-line);
  border-radius: var(--dm-r2);
  overflow: hidden;
  transition: border-color 0.2s;
  &:hover {
    border-color: #c9cede;
  }
  &:hover .dm-card__photo img {
    transform: scale(1.03);
  }
  .dm-card__photo {
    position: relative;
    display: block;
    aspect-ratio: 1;
    background: #fff;
    overflow: hidden;
    img {
      position: absolute;
      inset: 8%;
      width: 84%;
      height: 84%;
      object-fit: contain;
      transition: transform 0.35s;
    }
  }
  .dm-card__tags {
    position: absolute;
    top: 12px;
    left: 12px;
  }
  .dm-card__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .dm-card__acts {
    display: flex;
    gap: 6px;
  }
  .dm-card__act {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 1px solid var(--dm-line);
    border-radius: 50%;
    background: #fff;
    color: var(--dm-muted);
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    .dm-icon {
      width: 18px;
      height: 18px;
    }
    &:hover {
      color: var(--dm-acc);
    }
    &.is-on {
      color: var(--dm-or-d);
      border-color: var(--dm-or);
      background: var(--dm-soft);
    }
    &.is-on .dm-icon path {
      fill: currentColor;
    }
  }
  .dm-card__body {
    display: grid;
    grid-template-rows: auto auto auto 1fr auto;
    gap: 6px;
    padding: 0 16px 16px;
  }
  .dm-card__series {
    font-size: 13px;
    color: var(--dm-muted);
  }
  .dm-card__name {
    font: 700 19px/1.2 var(--dm-head);
    font-stretch: 112%;
    color: var(--dm-ink);
    text-decoration: none;
    &:hover {
      color: var(--dm-acc);
    }
  }
  .dm-card__size {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 10px;
    margin: 0;
    font-size: 14px;
    color: var(--dm-ink);
  }
  .dm-card__ext,
  .dm-card__mech {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--dm-muted);
    .dm-icon {
      width: 16px;
      height: 16px;
      color: var(--dm-or-d);
    }
  }
  .dm-card__sw {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 14px;
    padding-top: 6px;
    align-self: end;
  }
  .dm-card__count {
    font-size: 13px;
    color: var(--dm-muted);
  }
}
</style>
