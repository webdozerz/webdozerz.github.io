<script lang="ts" setup>
// K28 «Изделие ↔ коробка»: у каждого товара оригинала два фото — изделие и в упаковке; переключаются под фото и наведением.
import type { SvProduct } from '~/utils/sovelan.data'
import { svCatById, svImg, svWeight } from '~/utils/sovelan'
import { useSvOrder } from '~/composables/useSovelan'
import SvBuy from '~/components/redesign/sovelan/SvBuy.vue'

const props = defineProps<{ p: SvProduct; showCat?: boolean }>()
const order = useSvOrder()
const pack = ref(false)
const cat = computed(() => svCatById(props.p.c[0]))
const inOrder = computed(() => order.qty(props.p.id) > 0)
</script>

<template>
  <article class="sv-card" :class="{ 'is-in': inOrder }">
    <div class="sv-card__photo" @mouseenter="pack = true" @mouseleave="pack = false">
      <img :src="svImg(p.i)" :alt="p.t" width="300" height="300" loading="lazy" :class="{ 'is-off': pack }" />
      <img :src="svImg(p.p)" :alt="`${p.t} в упаковке`" width="300" height="300" loading="lazy" class="sv-card__pack" :class="{ 'is-off': !pack }" />
    </div>
    <div class="sv-card__switch" role="tablist" aria-label="Фото">
      <button type="button" role="tab" :aria-selected="!pack" :class="{ 'is-on': !pack }" @click="pack = false">Изделие</button>
      <button type="button" role="tab" :aria-selected="pack" :class="{ 'is-on': pack }" @click="pack = true">В упаковке</button>
    </div>
    <div class="sv-card__body">
      <span class="sv-card__brand">{{ p.b ? `${p.b}®` : showCat && cat ? cat.name : 'Созвездие вкуса' }}</span>
      <h3 class="sv-card__title">{{ p.t }}</h3>
      <ul class="sv-card__facts">
        <li><b>{{ svWeight(p.w) }}</b></li>
        <li v-if="p.l">{{ p.l }} суток</li>
      </ul>
      <p class="sv-card__kind">{{ p.k }}</p>
      <SvBuy :p="p" />
    </div>
  </article>
</template>
