<script lang="ts" setup>
import MrIcon from '~/components/redesign/mnerozy/MrIcon.vue'
import MrCard from '~/components/redesign/mnerozy/MrCard.vue'
import MrStems from '~/components/redesign/mnerozy/MrStems.vue'

useSeoMeta({ title: 'Охапка роз Эквадор поштучно от 99 ₽ — Мне розы | Концепт редизайна' })

// Сорта роз поштучно — раздел «Розы поштучно» оригинала, без шести ступеней «от 15/25/51 шт.».
const sorts = mrProducts.filter((p) => p.sec === 'rose')
const ohapki = mrProducts.filter((p) => p.sec === 'ohapki-cvetov').slice(0, 8)
</script>

<template>
  <div class="mr-wrap">
    <nav class="mr-crumbs" aria-label="Навигация">
      <NuxtLink :to="mrPath()">Главная</NuxtLink>
      <span><NuxtLink :to="mrPath('/catalog/rose')">Розы поштучно</NuxtLink></span>
    </nav>

    <div class="mr-roses__head">
      <h1>Охапка роз Эквадор поштучно</h1>
      <p>
        Розы премиум из Эквадора любого количества от 15 штук. Цена за розу зависит от количества: 15–24 — 169 ₽, 25–50 — 139 ₽, от 51 — 99 ₽.
        Бесплатная открытка к заказу.
      </p>
    </div>

    <MrStems :start="51" />

    <section class="mr-section">
      <div class="mr-head">
        <div>
          <h2>Сорта роз поштучно</h2>
          <p>Цена за одну розу, количество — в корзине</p>
        </div>
        <NuxtLink :to="mrPath('/catalog/rose')">Весь раздел <MrIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="mr-grid">
        <MrCard v-for="p in sorts" :key="p.id" :p="p" />
      </div>
    </section>

    <section class="mr-section">
      <div class="mr-head">
        <h2>Другие цветы охапкой</h2>
        <NuxtLink :to="mrPath('/catalog/ohapki-cvetov')">Все охапки <MrIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="mr-grid">
        <MrCard v-for="p in ohapki" :key="p.id" :p="p" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.mr-roses__head {
  display: grid;
  gap: 10px;
  max-width: 820px;
  padding: 14px 0 24px;

  h1 {
    font-size: 34px;
  }

  p {
    color: var(--mr-muted);
  }
}

@media (max-width: 576px) {
  .mr-roses__head h1 {
    font-size: 24px;
  }
}
</style>
