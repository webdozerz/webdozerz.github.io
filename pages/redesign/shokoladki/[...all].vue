<script lang="ts" setup>
// 404 внутри концепта — с разделами и конструктором набора.
import { skPath, skVisible } from '~/utils/shokoladki'

useSeoMeta({ title: 'Страница не найдена — АПРИОРИ | Концепт редизайна' })
const secs = skVisible('collection').slice(0, 8)
</script>

<template>
  <div class="sk-wrap sk-404">
    <b class="sk-404__code">404</b>
    <h1 class="sk-h1">Такой страницы нет</h1>
    <p>Возможно, её переместили. Загляните в коллекцию или соберите свой набор конфет.</p>
    <div class="sk-chips">
      <NuxtLink v-for="s in secs" :key="s.id" :to="skPath(`/katalog/${s.id}/`)" class="sk-chip">{{ s.n }}</NuxtLink>
    </div>
    <div class="sk-chips">
      <NuxtLink :to="skPath('/')" class="sk-btn">На главную</NuxtLink>
      <NuxtLink :to="skPath('/nabor/')" class="sk-btn sk-btn--line">Соберите набор</NuxtLink>
    </div>
  </div>
</template>
