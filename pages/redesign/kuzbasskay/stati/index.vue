<script lang="ts" setup>
import { kzArticles, kzArticlesTotal, kzOrig, kzPath } from '~/utils/kuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

useSeoMeta({ title: 'Статьи — Кузбасская птицефабрика | Концепт редизайна' })
</script>

<template>
  <div>
    <KzHead title="Статьи" :lead="`${kzArticlesTotal} статей о яйце, мясе птицы и разведении кур для частных хозяйств.`" />
    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap">
        <ul class="kz-artlist">
          <li v-for="a in kzArticles" :key="a.id">
            <NuxtLink v-if="a.local" :to="kzPath(`/stati/${a.id}`)" class="kz-art">
              <span class="kz-art__ic"><KzIcon name="book" /></span>
              <b>{{ a.title }}</b>
              <KzIcon name="arrow" />
            </NuxtLink>
            <a v-else :href="kzOrig(`/article/?id=${a.id}`)" target="_blank" rel="noopener" class="kz-art">
              <span class="kz-art__ic"><KzIcon name="book" /></span>
              <b>{{ a.title }}<small>на сайте оригинала</small></b>
              <KzIcon name="ext" :size="18" />
            </a>
          </li>
        </ul>
        <p class="kz-note">В концепте — первые статьи из {{ kzArticlesTotal }}; страница статьи показана на примере «Как выбрать яйца?». Остальные открываются на сайте оригинала.</p>
      </div>
    </section>
    <div class="kz-sec kz-sec--tight" />
  </div>
</template>

<style lang="scss">
</style>
