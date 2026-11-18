<script lang="ts" setup>
import { dmPath } from '~/utils/domoteka'
import { dmProducts } from '~/utils/domoteka.data'
import { useDmStore } from '~/composables/useDomoteka'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'
import DmCard from '~/components/redesign/domoteka/DmCard.vue'

useSeoMeta({ title: 'Избранное — Домотека | Концепт редизайна' })
const store = useDmStore()
onMounted(store.persist)
const items = computed(() => store.fav.value.map((id) => dmProducts.find((p) => p.id === id)).filter((p) => !!p))
</script>

<template>
  <div class="dm-wrap dm-fav">
    <div class="dm-page-head">
      <nav class="dm-crumbs" aria-label="Навигация"><NuxtLink :to="dmPath('/')">Главная</NuxtLink><span>Избранное</span></nav>
      <div class="dm-fav__head">
        <h1 class="dm-h1">Избранное</h1>
        <button v-if="items.length" type="button" class="dm-btn dm-btn--line" @click="store.clear('fav')"><DmIcon name="trash" />Очистить</button>
      </div>
    </div>
    <div v-if="items.length" class="dm-grid dm-fav__grid">
      <DmCard v-for="p in items" :key="p!.id" :p="p!" />
    </div>
    <div v-else class="dm-empty dm-fav__empty">
      <DmIcon name="heart" />
      <b>Здесь пока пусто</b>
      <p>Нажмите на сердечко у модели — она сохранится здесь, чтобы показать в магазине или сравнить дома.</p>
      <NuxtLink :to="dmPath('/katalog/stoly/')" class="dm-btn">В каталог</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.dm .dm-fav {
  .dm-fav__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .dm-fav__grid,
  .dm-fav__empty {
    margin-top: 24px;
  }
}
</style>
