<script lang="ts" setup>
import AkIcon from '~/components/redesign/aks124/AkIcon.vue'

useSeoMeta({ title: 'Доставка и оплата | ИП Аксюченко — концепт редизайна' })
</script>

<template>
  <div class="ak-wrap ak-page">
    <nav class="ak-crumbs" aria-label="Навигация">
      <NuxtLink :to="akPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Доставка и оплата</span>
    </nav>
    <h1>Доставка и оплата</h1>
    <p class="ak-page__lead">Доставляем по Красноярску, весь ассортимент можно забрать самовывозом со склада.</p>

    <div class="ak-cards">
      <div class="ak-card ak-card--accent">
        <span class="ak-terms__ico"><AkIcon name="truck" /></span>
        <h3>Бесплатно от {{ akMoney0(akFreeFrom) }}</h3>
        <p>При заказе товаров от {{ akMoney0(akFreeFrom) }} — доставка до двери в пределах Красноярска бесплатно.</p>
      </div>
      <div class="ak-card">
        <span class="ak-terms__ico"><AkIcon name="store" /></span>
        <h3>Самовывоз</h3>
        <p>Весь ассортимент, представленный на сайте, можно забрать со склада: {{ akContacts.address }}. {{ akContacts.hours }}.</p>
      </div>
      <div class="ak-card">
        <span class="ak-terms__ico"><AkIcon name="card" /></span>
        <h3>Оплата</h3>
        <p>Наличный и безналичный расчёт, возможна оплата при получении товара. Форма и условия оплаты обсуждаются индивидуально.</p>
      </div>
    </div>

    <div class="ak-note">
      <AkIcon name="list" :size="22" />
      <span>Соберите <NuxtLink :to="akPath('/list')">список заказа</NuxtLink> — в нём видно, сколько осталось до бесплатной доставки.</span>
    </div>
  </div>
</template>
