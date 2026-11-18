<script lang="ts" setup>
// 404 внутри концепта — в стиле сайта, с разделами каталога и поиском.
import { dmPath, dmTypes } from '~/utils/domoteka'

useSeoMeta({ title: 'Страница не найдена — Домотека | Концепт редизайна' })
</script>

<template>
  <div class="dm-wrap dm-404">
    <b class="dm-404__code">404</b>
    <h1 class="dm-h1">Такой страницы нет</h1>
    <p>Возможно, её переместили. Загляните в каталог или вернитесь на главную.</p>
    <div class="dm-404__links">
      <NuxtLink v-for="t in dmTypes" :key="t.id" :to="{ path: dmPath('/katalog/stoly/'), query: { type: t.id } }" class="dm-chip">{{ t.n }}</NuxtLink>
      <NuxtLink :to="dmPath('/katalog/stulya/')" class="dm-chip">Стулья</NuxtLink>
    </div>
    <NuxtLink :to="dmPath('/')" class="dm-btn dm-btn--big">На главную</NuxtLink>
  </div>
</template>

<style lang="scss">
.dm .dm-404 {
  display: grid;
  justify-items: center;
  gap: 14px;
  padding-top: 64px;
  text-align: center;
  p {
    color: var(--dm-muted);
  }
}
.dm .dm-404__code {
  font: 800 120px/1 var(--dm-head);
  font-stretch: 125%;
  color: var(--dm-blue-soft);
  -webkit-text-stroke: 2px var(--dm-acc);
}
.dm .dm-404__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  max-width: 720px;
  margin: 8px 0;
}
</style>
