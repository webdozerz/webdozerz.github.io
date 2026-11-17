<script lang="ts" setup>
// 404 внутри концепта — у оригинала вместо неё заглушка хостинга без меню и стиля сайта.
import { svCats, svPath } from '~/utils/sovelan'

useSeoMeta({ title: 'Страница не найдена — Ореховые Эланки и Виланки | Концепт редизайна' })
</script>

<template>
  <div class="sv-wrap sv-404">
    <b class="sv-404__code">404</b>
    <h1>Такой страницы нет</h1>
    <p>Возможно, её переместили. Загляните в коллекции или вернитесь на главную.</p>
    <div class="sv-404__links">
      <NuxtLink v-for="c in svCats.slice(0, 6)" :key="c.id" :to="svPath(`/katalog/${c.id}/`)" class="sv-chip">{{ c.name }}</NuxtLink>
    </div>
    <NuxtLink :to="svPath('/')" class="sv-btn">На главную</NuxtLink>
  </div>
</template>

<style lang="scss">
.sv-404 {
  display: grid;
  justify-items: center;
  gap: 14px;
  padding-top: 64px;
  text-align: center;
  &__code {
    font: 800 104px/1 var(--sv-head);
    color: var(--sv-soft);
    -webkit-text-stroke: 2px var(--sv-acc);
  }
  h1 {
    font-size: 32px;
  }
  p {
    color: var(--sv-muted);
  }
  &__links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    max-width: 640px;
    margin: 8px 0;
  }
}
</style>
