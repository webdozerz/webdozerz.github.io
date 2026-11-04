<script lang="ts" setup>
import FaMask from '~/components/redesign/fermaaltaya/FaMask.vue'
import FaCard from '~/components/redesign/fermaaltaya/FaCard.vue'

useSeoMeta({ title: 'Избранное — Ферма Алтая | Концепт редизайна' })
const cart = useFermaAltaya()
const ui = useFaUi()
const list = computed(() => cart.fav.value.map((id) => faProduct(id)).filter((p): p is FaProduct => !!p))
const addAll = () => {
  list.value.forEach((p) => cart.qtyOf(p.id) || cart.add(p))
  ui.toast.value = 'Избранное — в корзине'
}
</script>

<template>
  <div class="fa-wrap fa-info">
    <nav class="fa-crumbs" aria-label="Навигация">
      <NuxtLink :to="faPath()">Главная</NuxtLink>
      <span>Избранное</span>
    </nav>
    <div class="fa-head fa-fav__head">
      <h1 class="fa-info__h1">Избранное</h1>
      <button v-if="list.length" type="button" class="fa-btn fa-btn--soft" @click="addAll">Всё в корзину</button>
    </div>
    <div v-if="list.length" class="fa-grid">
      <FaCard v-for="p in list" :key="p.id" :p="p" />
    </div>
    <div v-else class="fa-empty">
      <FaMask sec="moloko" :size="48" />
      <b>Здесь будет то, что вы берёте постоянно</b>
      <p>Отмечайте товары сердечком — так проще собирать заказ к каждой доставке.</p>
      <NuxtLink :to="faPath('/catalog')" class="fa-btn fa-btn--main">В каталог</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.fa-fav__head {
  align-items: center;
  margin-bottom: 0;

  .fa-info__h1 {
    margin-bottom: 14px !important;
  }
}
</style>
