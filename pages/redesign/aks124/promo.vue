<script lang="ts" setup>
import AkIcon from '~/components/redesign/aks124/AkIcon.vue'

useSeoMeta({ title: 'Акции | ИП Аксюченко — концепт редизайна' })
</script>

<template>
  <div class="ak-wrap ak-page">
    <nav class="ak-crumbs" aria-label="Навигация">
      <NuxtLink :to="akPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Акции</span>
    </nav>
    <h1>Акции</h1>
    <p class="ak-page__lead">Сниженные цены на отдельные позиции. Срок акции уточняйте у менеджера.</p>

    <div class="ak-promos">
      <NuxtLink v-for="p in akPromo" :key="p.title" :to="akSectionPath(p.section)" class="ak-promo">
        <img :src="p.img" :alt="p.title" width="160" height="160" loading="lazy" />
        <div>
          <span class="ak-flag ak-flag--promo">{{ p.text }}</span>
          <h3>{{ p.title }}</h3>
          <p><b>{{ akMoney(p.price) }}</b> / {{ p.per }}</p>
        </div>
      </NuxtLink>
    </div>

    <div class="ak-note">
      <AkIcon name="info" :size="22" />
      <span>У каждой акции на сайте будет дата окончания — по её наступлении акция снимается сама.</span>
    </div>
  </div>
</template>
