<script lang="ts" setup>
// 404 внутри концепта — у оригинала своя страница «404 Not Found» в оформлении сайта.
import { mlGroups, mlPath } from '~/utils/moreland'

useSeoMeta({ title: 'Страница не найдена — Морелэнд | Концепт редизайна' })
</script>

<template>
  <div class="ml-wrap ml-404">
    <b class="ml-404__code">404</b>
    <h1>Такой страницы нет</h1>
    <p>Возможно, её переместили. Посмотрите продукцию или вернитесь на главную.</p>
    <div class="ml-404__links">
      <NuxtLink v-for="g in mlGroups" :key="g.id" :to="mlPath(`/produkcija/${g.id}/`)" class="ml-pill">{{ g.name }}</NuxtLink>
    </div>
    <NuxtLink :to="mlPath('/')" class="ml-btn">На главную</NuxtLink>
  </div>
</template>

<style lang="scss">
.ml-404 {
  display: grid;
  justify-items: center;
  gap: 14px;
  padding-top: 64px;
  text-align: center;
  &__code {
    font: 800 96px/1 'Bitter', Georgia, serif;
    color: var(--ml-soft);
    -webkit-text-stroke: 2px var(--ml-acc);
  }
  h1 {
    font-size: 32px;
  }
  p {
    color: var(--ml-mute);
  }
  &__links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
}
</style>
