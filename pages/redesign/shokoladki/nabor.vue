<script lang="ts" setup>
// «Соберите набор» отдельной страницей: тот же конструктор, конфеты списком целиком, ниже — как это устроено.
import { skPath, skBoxes, skRub } from '~/utils/shokoladki'
import { skCandies } from '~/utils/shokoladki.data'
import SkBuilder from '~/components/redesign/shokoladki/SkBuilder.vue'

useSeoMeta({ title: 'Соберите набор конфет ручной работы — АПРИОРИ | Концепт редизайна' })
const to = (p: string) => skPath(p)
const prices = [...new Set(skCandies.map((c) => c.p))].sort((a, b) => a - b)
</script>

<template>
  <div class="sk-wrap sk-set">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>Собери набор</span>
    </nav>
    <SkBuilder full title="Соберите свой набор" />
    <div class="sk-set__info">
      <div class="sk-panel">
        <b>Коробки</b>
        <p>{{ skBoxes.length }} вариантов: от 5 до 64 конфет, квадратные, восьмиугольные и в форме сердца — от {{ skRub(Math.min(...skBoxes.map((b) => b.p))) }} до {{ skRub(Math.max(...skBoxes.map((b) => b.p))) }}.</p>
      </div>
      <div class="sk-panel">
        <b>Конфеты</b>
        <p>{{ skCandies.length }} конфет ручной работы поштучно: муссы, трюфели, марципан, буквы и конфеты с рисунком — {{ prices.map((p) => skRub(p)).join(', ') }}.</p>
      </div>
      <div class="sk-panel">
        <b>Оформление</b>
        <p>Лента с вашим текстом и открытка-шильдик: «Поздравляю, для тебя», «Тебе с любовью», «Happy Birthday» или подарочный конверт.</p>
      </div>
    </div>
  </div>
</template>
