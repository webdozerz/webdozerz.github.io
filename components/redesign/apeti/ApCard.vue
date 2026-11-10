<script lang="ts" setup>
import { apAsset, apDisc, apImg, apMoney, apNum, apPath, apWeight } from '~/utils/apeti'
import type { ApProduct } from '~/utils/apetiData'
import { useApShop } from '~/composables/useApeti'
import ApIcon from '~/components/redesign/apeti/ApIcon.vue'
import ApQty from '~/components/redesign/apeti/ApQty.vue'

// Карточка K24 «весовой ценник»: цена за кг крупно, порция строкой ниже, счётчик в килограммах. Стили — в оболочке.
const props = defineProps<{ p: ApProduct }>()
const shop = useApShop()
const key = computed(() => shop.anyKey(props.p.id) ?? `${props.p.id}|0`)
const n = computed(() => shop.cart.value[key.value] ?? 0)
const disc = computed(() => apDisc(props.p))
const to = computed(() => apPath(`/product/${props.p.id}`))
const isFav = computed(() => shop.fav.value.includes(props.p.id))
</script>

<template>
  <article class="ap-card">
    <div class="ap-card__pic">
      <NuxtLink :to="to" tabindex="-1"><img :src="apImg(p)" :alt="p.n" loading="lazy" width="400" height="400" /></NuxtLink>
      <img v-if="p.g" class="ap-card__sticker" :src="apAsset('label.svg')" alt="Отобрано по качеству" title="Зелёный стикер: отобрано по качеству" width="44" height="44" />
      <span v-if="disc" class="ap-card__disc">−{{ disc }}%</span>
      <button type="button" class="ap-card__fav" :class="{ 'is-on': isFav }" :aria-label="isFav ? 'Убрать из избранного' : 'В избранное'" @click="shop.toggleFav(p.id)">
        <ApIcon name="heart" />
      </button>
    </div>
    <div class="ap-card__body">
      <NuxtLink :to="to" class="ap-card__name">{{ p.n }}</NuxtLink>
      <div class="ap-card__price">
        <template v-if="p.k">
          <p class="ap-card__main"><b>{{ apMoney(p.r) }}</b><span>/кг</span></p>
          <p class="ap-card__portion">
            {{ apNum(p.q) }} кг — {{ apMoney(p.p) }} <s v-if="disc">{{ apMoney(p.o) }}</s>
          </p>
        </template>
        <template v-else>
          <p class="ap-card__main"><b>{{ apMoney(p.p) }}</b><span>/шт</span></p>
          <p class="ap-card__portion"><s v-if="disc">{{ apMoney(p.o) }}</s><template v-else>Арт. {{ p.a || '—' }}</template></p>
        </template>
      </div>
      <ApQty v-if="n" :text="apWeight(p, n)" @dec="shop.setKey(key, n - 1)" @inc="shop.setKey(key, n + 1)" />
      <button v-else type="button" class="ap-btn ap-card__buy" @click="shop.add(p, 1)">Купить</button>
    </div>
  </article>
</template>
