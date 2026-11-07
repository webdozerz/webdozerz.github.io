<script lang="ts" setup>
import DrCard from '~/components/redesign/dereda/DrCard.vue'

useSeoMeta({ title: 'Избранное — Дереда | Концепт редизайна' })
const shop = useDeredaShop()
const list = computed(() => shop.fav.value.map((id) => drProduct(id)).filter(Boolean) as DrProduct[])
</script>

<template>
  <div class="dr-wrap dr-page">
    <nav class="dr-crumbs" aria-label="Навигация">
      <NuxtLink :to="drPath('/')">Главная</NuxtLink>
      <span>Избранное</span>
    </nav>
    <div class="dr-sechead">
      <h1>Избранное</h1>
      <button v-if="list.length" type="button" class="dr-link" @click="shop.fav.value = []">Очистить</button>
    </div>
    <div v-if="list.length" class="dr-grid">
      <DrCard v-for="p in list" :key="p.id" :p="p" />
    </div>
    <div v-else class="dr-empty">
      <img src="/redesign/dereda/girl.png" alt="" width="61" height="88" style="width: 61px" />
      <h3>Здесь пока пусто</h3>
      <p class="dr-muted">Нажмите на сердечко у товара, чтобы не потерять его к следующей доставке.</p>
      <NuxtLink :to="drPath('/catalog')" class="dr-btn dr-btn--main">Перейти в каталог</NuxtLink>
    </div>
  </div>
</template>
