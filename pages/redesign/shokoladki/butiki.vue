<script lang="ts" setup>
// Бутики: «Москва» и «По России», как /boutiques/moskva/ и /po-rossii/ оригинала; фото точки крупно, часы, телефон, карта.
import { skPath, skShops, skTel } from '~/utils/shokoladki'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'

useSeoMeta({ title: 'Бутики «Верность качеству» в Москве, Касимове и Рязани — АПРИОРИ | Концепт редизайна' })
const route = useRoute()
const to = (p: string) => skPath(p)
const tab = ref<'msk' | 'ru'>('msk')
const list = computed(() => skShops.filter((s) => (tab.value === 'msk' ? s.city === 'Москва' : s.city !== 'Москва')))
const big = ref('')
const map = (s: (typeof skShops)[0]) => `https://yandex.ru/maps/?text=${encodeURIComponent(`${s.city}, ${s.addr}`)}`
onMounted(() => {
  const id = route.hash.slice(1)
  const s = skShops.find((x) => x.id === id)
  if (s && s.city !== 'Москва') tab.value = 'ru'
})
</script>

<template>
  <div class="sk-wrap sk-page">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>Бутики</span>
    </nav>
    <div class="sk-pagehead">
      <h1 class="sk-h1">Бутики</h1>
      <p>Фирменные магазины фабрики: три в Москве, три в Касимове рядом с производством и один в Рязани. Заказ с сайта можно забрать самовывозом — уточните у менеджера.</p>
    </div>
    <div class="sk-chips">
      <button type="button" class="sk-chip" :class="{ 'is-on': tab === 'msk' }" @click="tab = 'msk'">Москва <small>3</small></button>
      <button type="button" class="sk-chip" :class="{ 'is-on': tab === 'ru' }" @click="tab = 'ru'">По России <small>4</small></button>
    </div>
    <div class="sk-shoplist">
      <article v-for="(s, i) in list" :id="s.id" :key="s.id" class="sk-shopcard">
        <button type="button" class="sk-shopcard__img" :aria-label="`Фото: ${s.n}`" @click="big = big === s.id ? '' : s.id">
          <img :src="s.photo" :alt="s.n" loading="lazy" />
        </button>
        <div class="sk-shopcard__body">
          <span v-if="tab === 'msk' && i === 0" class="sk-shopcard__near">Ближайший к вам бутик</span>
          <small>{{ s.city }}{{ s.note ? ` · ${s.note}` : '' }}</small>
          <h2>{{ s.n }}</h2>
          <p><SkIcon name="pin" /><span>{{ s.addr }}<template v-if="s.metro"> · м. {{ s.metro }}</template></span></p>
          <p><SkIcon name="clock" /><span>{{ s.hours }}</span></p>
          <p><SkIcon name="phone" /><a :href="`tel:${skTel(s.phone)}`">{{ s.phone }}</a></p>
          <a :href="map(s)" target="_blank" rel="noopener" class="sk-link">Открыть в Яндекс Картах<SkIcon name="right" /></a>
        </div>
      </article>
    </div>
    <div v-if="big" class="sk-modal" role="dialog" aria-modal="true" @click.self="big = ''">
      <div class="sk-modal__box sk-modal__box--wide">
        <button type="button" class="sk-iconbtn sk-modal__x" aria-label="Закрыть" @click="big = ''"><SkIcon name="close" /></button>
        <h2 class="sk-modal__title">{{ skShops.find((s) => s.id === big)?.n }}</h2>
        <img :src="skShops.find((s) => s.id === big)?.photo" alt="" class="sk-shopbig" />
      </div>
    </div>
  </div>
</template>
