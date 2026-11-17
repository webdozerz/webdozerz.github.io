<script lang="ts" setup>
// Карточка K27 «Коробка»: фото партии 4:3, раздел, название, фасовка и срок, цена опт за кг/шт + сумма за коробку,
// дата цены (прайс или новость — ссылкой), «В заявку» → счётчик коробок. Стили — в оболочке.
import { mlByBox, mlDateShort, mlFresh, mlPath, mlRub, mlRub0, mlSrcNews, mlStale, mlSubName, mlUnitShort } from '~/utils/moreland'
import type { MlProduct } from '~/utils/moreland.data'
import MlBuy from '~/components/redesign/moreland/MlBuy.vue'
import MlIcon from '~/components/redesign/moreland/MlIcon.vue'

const props = defineProps<{ p: MlProduct }>()
const to = computed(() => mlPath(`/tovar/${props.p.slug}/`))
const fresh = computed(() => mlFresh(props.p))
const news = computed(() => mlSrcNews(props.p))
const pack = computed(() => (mlByBox(props.p) ? `коробка ${props.p.box} кг` : props.p.pack?.replace(/^в коробке\s*/i, 'коробка ') || ''))
</script>

<template>
  <article class="ml-card">
    <NuxtLink :to="to" class="ml-card__ph" :aria-label="props.p.n">
      <img :src="props.p.thumb" :alt="props.p.n" loading="lazy" width="540" height="405" />
      <span v-if="fresh" class="ml-tag ml-tag--fresh"><MlIcon name="smoke" />Свежая партия</span>
    </NuxtLink>
    <div class="ml-card__body">
      <span class="ml-card__sec">{{ mlSubName(props.p.sec) }}</span>
      <NuxtLink :to="to" class="ml-card__name">{{ props.p.n }}</NuxtLink>
      <div class="ml-card__chips">
        <span v-if="pack" class="ml-chip"><MlIcon name="box" />{{ pack }}</span>
        <span v-if="props.p.life" class="ml-chip"><MlIcon name="clock" />{{ props.p.life }}</span>
      </div>
      <div class="ml-card__price">
        <template v-if="props.p.price">
          <div class="ml-card__main">
            <b>{{ mlRub(props.p.price) }}</b><span>за {{ mlUnitShort(props.p) }}</span>
            <s v-if="props.p.old">{{ mlRub0(props.p.old) }}</s>
          </div>
          <span v-if="mlByBox(props.p)" class="ml-card__box">коробка ≈ {{ mlRub0(props.p.price * props.p.box!) }}</span>
          <span v-else class="ml-card__box">опт{{ props.p.sec === 'pr' ? ', с НДС' : '' }}</span>
        </template>
        <div v-else class="ml-card__main ml-card__main--ask"><b>Цена по запросу</b></div>
      </div>
      <p class="ml-card__src" :class="{ 'is-stale': mlStale(props.p) }">
        <template v-if="props.p.pdate">
          цена от {{ mlDateShort(props.p.pdate) }} ·
          <NuxtLink v-if="news" :to="mlPath(`/novosti/${news.id}/`)">{{ props.p.src?.startsWith('новость') ? 'новость' : 'прайс' }}</NuxtLink>
          <a v-else-if="props.p.srcUrl" :href="props.p.srcUrl" target="_blank" rel="noopener">{{ props.p.src?.startsWith('новость') ? 'новость' : 'прайс' }}</a>
        </template>
        <template v-else>уточним при заявке</template>
      </p>
      <MlBuy :p="props.p" />
    </div>
  </article>
</template>
