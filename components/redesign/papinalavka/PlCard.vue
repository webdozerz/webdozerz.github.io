<script lang="ts" setup>
import PlBuy from './PlBuy.vue'
import PlIcon from './PlIcon.vue'

// Карточка «ценник на шпагате»: фото лавки, рукописная пометка оригинала, крафтовый ценник и дата привоза.
const props = defineProps<{ product: PlProduct }>()
const p = computed(() => props.product)
</script>

<template>
  <article class="pl-card">
    <NuxtLink :to="plProductPath(p.id)" class="pl-card__photo">
      <img :src="plImg(p.img)" :alt="p.name" width="369" height="224" loading="lazy" />
      <span v-if="p.label" class="pl-label" :class="`pl-label--${p.label}`">{{ plLabels[p.label] }}</span>
    </NuxtLink>
    <div class="pl-card__body">
      <NuxtLink :to="plProductPath(p.id)" class="pl-card__name">{{ p.name }}</NuxtLink>
      <p v-if="p.note" class="pl-card__note">{{ p.note }}</p>
      <p class="pl-when" :class="{ 'is-stock': p.stock }">
        <PlIcon :name="p.stock ? 'check' : 'calendar'" :size="16" />
        <span v-if="p.stock">Есть в наличии</span>
        <span v-else-if="p.next">Привезём {{ plWeekdayAcc(p.next) }}, {{ plDay(p.next) }}</span>
        <span v-else>Под заказ</span>
      </p>
      <div class="pl-card__foot">
        <div class="pl-tag">
          <s v-if="p.old">{{ plFmt(p.old) }}</s>
          <b>{{ plFmt(p.price) }}</b>
          <small>{{ p.unit }}</small>
        </div>
        <PlBuy :product="p" />
      </div>
    </div>
  </article>
</template>
