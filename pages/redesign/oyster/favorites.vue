<script lang="ts" setup>
import { oyImg, oyPath, oyProduct } from '~/utils/oyster'
import type { OyProduct } from '~/utils/oyster'
import { useOyShop } from '~/composables/useOyster'
import OyCard from '~/components/redesign/oyster/OyCard.vue'

useSeoMeta({ title: 'Избранное — Oyster Market | Концепт редизайна' })
const shop = useOyShop()
const items = computed(() => shop.fav.value.map((id) => oyProduct(id)).filter(Boolean) as OyProduct[])
</script>

<template>
  <div class="oy-wrap oy-page">
    <nav class="oy-crumbs" aria-label="Навигация">
      <NuxtLink :to="oyPath('/')">Главная</NuxtLink>
      <span>Избранное</span>
    </nav>
    <h1 class="oy-title">Избранное</h1>
    <p class="oy-lead oy-page__lead">Отмечайте сердечком то, что хотите заказать позже, — список сохранится в этом браузере.</p>
    <div v-if="items.length" class="oy-grid">
      <OyCard v-for="p in items" :key="p.id" :p="p" />
    </div>
    <div v-else class="oy-empty">
      <span class="oy-mask" :style="{ '--m': `url(${oyImg('ic/shells.png')})` }" />
      <h2>Пока ничего не отмечено</h2>
      <p>Нажмите на сердечко на фото товара — он появится здесь.</p>
      <NuxtLink :to="oyPath('/catalog/')" class="oy-btn oy-btn--accent">В каталог</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.oy-page__lead { margin-bottom: 24px; }
</style>
