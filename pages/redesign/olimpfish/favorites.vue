<script lang="ts" setup>
import { olPath, olProduct } from '~/utils/olimpfish'
import type { OlProduct } from '~/utils/olimpfishData'
import OlCard from '~/components/redesign/olimpfish/OlCard.vue'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'
import { useOlShop } from '~/composables/useOlimpfish'

useSeoMeta({ title: 'Избранное — Олимп | Концепт редизайна' })
const shop = useOlShop()
const list = computed(() => shop.fav.value.map((id) => olProduct(id)).filter(Boolean) as OlProduct[])
onMounted(() => shop.persist())
</script>

<template>
  <div class="ol-wrap ol-page">
    <nav class="ol-crumbs" aria-label="Навигация">
      <NuxtLink :to="olPath('/')">Главная</NuxtLink>
      <span>Избранное</span>
    </nav>
    <h1 class="ol-title">Избранное</h1>
    <div v-if="list.length" class="ol-grid" style="margin-top: 20px">
      <OlCard v-for="p in list" :key="p.id" :p="p" />
    </div>
    <div v-else class="ol-empty" style="margin-top: 20px">
      <OlIcon name="heart" />
      <h2>В избранном пока пусто</h2>
      <p>Нажмите на сердечко у товара — он появится здесь. Список хранится в этом браузере.</p>
      <NuxtLink :to="olPath('/catalog')" class="ol-btn ol-btn--acc">Перейти в каталог</NuxtLink>
    </div>
  </div>
</template>
