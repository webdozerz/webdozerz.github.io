<script lang="ts" setup>
// Новости: как у них — лента с «Смотреть ещё» по 9. В концепте последние 20 из 175.
import { mlDate, mlPath } from '~/utils/moreland'
import { mlNews } from '~/utils/moreland.data'
import MlIcon from '~/components/redesign/moreland/MlIcon.vue'

useSeoMeta({ title: 'Новости — Морелэнд | Концепт редизайна' })
const shown = ref(9)
const items = computed(() => mlNews.slice(0, shown.value))
const price = (t: string) => t.match(/(\d[\d\s]*)\s*(?:руб|₽)/)?.[0]
</script>

<template>
  <div class="ml-wrap">
    <nav class="ml-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mlPath('/')">Главная</NuxtLink></span>
      <span>Новости</span>
    </nav>
    <div class="ml-pagehead ml-newshead">
      <div>
        <h1>Новости</h1>
        <p>Новые партии из коптильни, цены и прайс-листы, график отгрузок — каждую неделю.</p>
      </div>
      <NuxtLink :to="mlPath('/podpiska/')" class="ml-btn ml-btn--line"><MlIcon name="bell" />Получать на почту</NuxtLink>
    </div>
    <div class="ml-newsgrid">
      <NuxtLink v-for="n in items" :key="n.id" :to="mlPath(`/novosti/${n.id}/`)" class="ml-ncard">
        <div class="ml-ncard__ph" :class="{ 'ml-ncard__ph--doc': !n.img }">
          <img v-if="n.img" :src="n.img" :alt="n.t" width="400" height="300" loading="lazy" />
          <MlIcon v-else :name="n.file ? 'doc' : 'calendar'" />
        </div>
        <div class="ml-ncard__body">
          <span class="ml-ncard__date">{{ mlDate(n.date) }}</span>
          <h2 class="ml-ncard__t">{{ n.t }}</h2>
          <p class="ml-ncard__text">{{ n.text }}</p>
          <span v-if="n.file" class="ml-ncard__price">Прайс-лист .xlsx</span>
          <span v-else-if="price(n.text)" class="ml-ncard__price">{{ price(n.text) }}</span>
        </div>
      </NuxtLink>
    </div>
    <div class="ml-more">
      <button v-if="shown < mlNews.length" type="button" class="ml-btn ml-btn--soft" @click="shown = Math.min(mlNews.length, shown + 9)">Смотреть ещё</button>
      <p>Показано {{ items.length }} из {{ mlNews.length }} · в концепте последние 20 новостей из 175</p>
    </div>
  </div>
</template>

<style lang="scss">
.ml-newshead {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.ml-newsgrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  @media (max-width: 989px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.ml-more {
  display: grid;
  justify-items: center;
  gap: 10px;
  margin-top: 28px;
  p {
    font-size: 13.5px;
    color: var(--ml-mute);
  }
}
</style>
