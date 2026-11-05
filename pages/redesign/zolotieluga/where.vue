<script lang="ts" setup>
import ZlIcon from '~/components/redesign/zolotieluga/ZlIcon.vue'
import ZlWhere from '~/components/redesign/zolotieluga/ZlWhere.vue'

useSeoMeta({ title: 'Где купить продукцию «Золотых лугов» | Концепт редизайна' })
</script>

<template>
  <div class="zl-wrap zl-page">
    <nav class="zl-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="zlPath('/')">Главная</NuxtLink></span>
      <span>Где купить</span>
    </nav>
    <h1>Где купить</h1>
    <p class="zl-page__lead">
      {{ zlStores.length }} магазинов в {{ zlCities.length }} городах, где продаются «Золотые луга» и «Ситниковское». Выберите город — список и карта покажут
      ближайшие, у каждого адреса есть ссылка на Яндекс Карты.
    </p>
    <div class="zl-section zl-where-page">
      <ZlWhere />
    </div>
    <div class="zl-where-help">
      <div class="zl-panel">
        <ZlIcon name="phone" :size="26" />
        <h2>Вопрос о продукции?</h2>
        <p>Горячая линия для покупателей — звонок бесплатный.</p>
        <a :href="'tel:' + zlContacts.hotlineTel" class="zl-btn zl-btn--main">{{ zlContacts.hotline }}</a>
        <small>{{ zlContacts.hotlineHours }}</small>
      </div>
      <div class="zl-panel">
        <ZlIcon name="store" :size="26" />
        <h2>Хотите продавать у себя?</h2>
        <p>Отгружаем оптом по всей России, офис и склад в Тюмени на одной территории.</p>
        <NuxtLink :to="zlPath('/opt')" class="zl-btn zl-btn--line">Партнёрам</NuxtLink>
        <a :href="zlContacts.productMap" target="_blank" rel="noopener" class="zl-link">Карта продукции на сайте компании <ZlIcon name="external" :size="16" /></a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.zl-where-page {
  padding-top: 28px;
}
.zl-where-help {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-top: 40px;
  .zl-panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    > .zl-icon {
      color: var(--zl-accent);
    }
    h2 {
      font-size: 22px;
    }
    small {
      color: var(--zl-muted);
    }
  }
}
@media (max-width: 768px) {
  .zl-where-page {
    padding-top: 20px;
  }
  .zl-where-help {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
