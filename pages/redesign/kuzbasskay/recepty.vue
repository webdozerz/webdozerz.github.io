<script lang="ts" setup>
import { kzOrig, kzPath, kzRecipeOfDay, kzRecipes, kzRecipesTotal } from '~/utils/kuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

useSeoMeta({ title: 'Рецепты — Кузбасская птицефабрика | Концепт редизайна' })
const r = kzRecipeOfDay
</script>

<template>
  <div>
    <KzHead title="Рецепты" :lead="`${kzRecipesTotal} рецептов из курицы и яиц. Рецепт дня меняется на главной.`" />
    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap kz-read">
        <article class="kz-recipe">
          <p class="kz-recipe__kicker"><KzIcon name="pot" :size="18" />Рецепт дня</p>
          <h2>{{ r.title }}</h2>
          <div class="kz-recipe__cols">
            <div>
              <h3>Ингредиенты</h3>
              <ul class="kz-recipe__ing"><li v-for="i in r.ingredients" :key="i">{{ i }}</li></ul>
            </div>
            <div>
              <h3>Приготовление</h3>
              <ol class="kz-recipe__steps"><li v-for="s in r.steps" :key="s">{{ s }}</li></ol>
            </div>
          </div>
          <NuxtLink :to="kzPath('/produkciya/myaso-nesushki')" class="kz-link">Курица фабрики<KzIcon name="arrow" :size="18" /></NuxtLink>
        </article>
        <div>
          <h2 class="kz-recipes__h">Другие рецепты</h2>
          <ul class="kz-artlist">
            <li v-for="t in kzRecipes" :key="t">
              <a :href="kzOrig('/recipes/')" target="_blank" rel="noopener" class="kz-art">
                <span class="kz-art__ic"><KzIcon name="pot" /></span>
                <b>{{ t }}<small>на сайте оригинала</small></b>
                <KzIcon name="ext" :size="18" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <div class="kz-sec kz-sec--tight" />
  </div>
</template>

<style lang="scss">
.kz-recipes__h {
  margin-bottom: 14px;
  font-size: 24px;
  font-weight: 900;
}
</style>
