<script lang="ts" setup>
import { apPastSales, apPath, apSaleProducts } from '~/utils/apeti'
import ApShelf from '~/components/redesign/apeti/ApShelf.vue'

useSeoMeta({ title: 'Акции — Apeti, концепт редизайна' })
const tab = ref<'now' | 'past'>('now')
const sale = apSaleProducts().slice(0, 12)
</script>

<template>
  <div class="ap-wrap ap-page">
    <nav class="ap-crumbs" aria-label="Хлебные крошки"><NuxtLink :to="apPath('/')">Главная</NuxtLink><span>Акции</span></nav>
    <div class="ap-head ap-sale__head">
      <div>
        <h1>Акции</h1>
        <p>Акции к датам, скидки на крупные заказы и подарки в заказе. Чтобы не пропустить новую — подпишитесь на рассылку внизу страницы.</p>
      </div>
      <div class="ap-seg ap-sale__seg">
        <button type="button" :class="{ 'is-on': tab === 'now' }" @click="tab = 'now'">Действующие</button>
        <button type="button" :class="{ 'is-on': tab === 'past' }" @click="tab = 'past'">Закончившиеся</button>
      </div>
    </div>

    <template v-if="tab === 'now'">
      <div class="ap-empty">
        <h2>Сейчас действующих акций нет</h2>
        <p>Зато есть товары со сниженной ценой — они собраны в разделе «Скидки».</p>
        <NuxtLink :to="apPath('/catalog/skidki')" class="ap-btn">Смотреть скидки</NuxtLink>
      </div>
      <section class="ap-sec"><div class="ap-head"><h2>Скидки сегодня</h2></div><ApShelf :items="sale" /></section>
    </template>

    <ul v-else class="ap-sale__list">
      <li v-for="s in apPastSales" :key="s.title">
        <time>{{ s.dates }}</time>
        <b>{{ s.title }}</b>
        <p>{{ s.text }}</p>
        <span>Акция закончилась</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.ap .ap-sale__head { margin-top: 12px; }
.ap .ap-sale__seg { min-width: 300px; }
.ap ul.ap-sale__list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin: 0; padding: 0;
  li { display: grid; gap: 8px; align-content: start; justify-items: start; padding: 20px; border: 1px solid var(--ap-line); border-radius: var(--ap-R); }
  time { font-size: 13px; color: var(--ap-mute); }
  b { font-family: var(--ap-head); font-size: 21px; font-weight: 600; line-height: 1.2; }
  p { color: var(--ap-mute); font-size: 14.5px; }
  span { margin-top: 4px; padding: 3px 10px; border-radius: 8px; background: var(--ap-sur); font-size: 13px; color: var(--ap-mute); }
}
@media (max-width: 576px) {
  .ap .ap-sale__seg { min-width: 0; width: 100%; box-sizing: border-box; }
  .ap ul.ap-sale__list { grid-template-columns: minmax(0, 1fr); }
}
</style>
