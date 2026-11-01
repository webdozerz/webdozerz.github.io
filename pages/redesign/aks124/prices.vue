<script lang="ts" setup>
import AkIcon from '~/components/redesign/aks124/AkIcon.vue'

useSeoMeta({ title: 'Цены | ИП Аксюченко — концепт редизайна' })
</script>

<template>
  <div class="ak-wrap ak-page">
    <nav class="ak-crumbs" aria-label="Навигация">
      <NuxtLink :to="akPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Цены</span>
    </nav>
    <h1>Цены</h1>
    <p class="ak-page__lead">
      Цены на сайте указаны базовые. Конечная цена для каждого клиента зависит от объёма. Постоянным клиентам предоставляются дополнительные скидки.
    </p>

    <div class="ak-cards">
      <div class="ak-card">
        <span class="ak-terms__ico"><AkIcon name="tag" /></span>
        <h3>За штуку и за упаковку</h3>
        <p>В каждом листе бренда — цена за штуку и сколько штук в упаковке. Цена упаковки посчитана сразу, заказ собирается упаковками.</p>
      </div>
      <div class="ak-card">
        <span class="ak-terms__ico"><AkIcon name="layers" /></span>
        <h3>От объёма</h3>
        <p>Чем больше заказ, тем ниже конечная цена. Укажите планируемый объём в форме прайс-листа — менеджер посчитает ваши цены.</p>
      </div>
      <div class="ak-card">
        <span class="ak-terms__ico"><AkIcon name="info" /></span>
        <h3>Курс валют</h3>
        <p>Цены и ассортимент на сайте ориентировочные и не являются публичной офертой: часть товара импортная, цены меняются вместе с курсом.</p>
      </div>
    </div>

    <div class="ak-note">
      <AkIcon name="download" :size="22" />
      <span>Полный прайс-лист на {{ akTotal.items.toLocaleString('ru-RU') }} позиций пришлём на почту — <a href="#price-form">заполните форму ниже</a>.</span>
    </div>
  </div>
</template>
