<script lang="ts" setup>
import MrCard from '~/components/redesign/mnerozy/MrCard.vue'

useSeoMeta({ title: 'Избранное — Мне розы | Концепт редизайна' })

const shop = useMnerozyShop()
const list = computed(() => shop.favs.value.map((id) => mrFind(id)).filter((p): p is MrProduct => Boolean(p)))
</script>

<template>
  <div class="mr-wrap mr-fav">
    <nav class="mr-crumbs" aria-label="Навигация">
      <NuxtLink :to="mrPath()">Главная</NuxtLink>
      <span>Избранное</span>
    </nav>
    <div class="mr-fav__head">
      <h1>Избранное</h1>
      <p v-if="list.length">{{ list.length }} {{ mrPlural(list.length, 'товар', 'товара', 'товаров') }} — отправьте ссылку тому, кто выбирает подарок</p>
    </div>
    <div v-if="list.length" class="mr-grid">
      <MrCard v-for="p in list" :key="p.id" :p="p" />
    </div>
    <div v-else class="mr-fav__empty">
      <p>Нажмите на сердечко у букета, чтобы отложить его и вернуться позже.</p>
      <NuxtLink :to="mrPath('/catalog')" class="mr-btn mr-btn--accent">В каталог</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mr-fav {
  &__head {
    display: grid;
    gap: 8px;
    padding: 14px 0 24px;

    h1 {
      font-size: 34px;
    }

    p {
      color: var(--mr-muted);
    }
  }

  &__empty {
    display: grid;
    justify-items: start;
    gap: 14px;
    color: var(--mr-muted);
  }
}

@media (max-width: 576px) {
  .mr-fav__head h1 {
    font-size: 26px;
  }
}
</style>
