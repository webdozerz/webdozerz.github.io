<script lang="ts" setup>
import AkIcon from '~/components/redesign/aks124/AkIcon.vue'

useSeoMeta({ title: 'О компании | ИП Аксюченко — концепт редизайна' })

const adv = [
  { icon: 'clock', title: 'Работаем более 20 лет', text: 'Оптовая торговля продуктами питания с 2005 года.' },
  { icon: 'tag', title: 'Низкие цены', text: 'Базовые цены на сайте, конечная — от объёма заказа.' },
  { icon: 'star', title: 'Скидки постоянным', text: 'Для постоянных партнёров в рознице — скидки.' },
  { icon: 'box', title: 'Хранение по стандартам', text: 'Товары на продуктовой базе хранятся в соответствии со стандартами.' },
  { icon: 'truck', title: `Доставка от ${akMoney0(akFreeFrom)}`, text: 'По Красноярску бесплатно до двери.' },
]
</script>

<template>
  <div class="ak-wrap ak-page">
    <nav class="ak-crumbs" aria-label="Навигация">
      <NuxtLink :to="akPath()">Главная</NuxtLink>
      <span>/</span>
      <span>О компании</span>
    </nav>
    <h1>О компании</h1>
    <p class="ak-page__lead">
      {{ akContacts.company }} — оптовая торговля продуктами питания в Красноярске. Специи и приправы, консервы, шоколад и кондитерские изделия, чай и
      кофе, продукты быстрого приготовления и Юго-Восточной Азии — {{ akTotal.items.toLocaleString('ru-RU') }} позиций на складе на Дудинской.
    </p>

    <div class="ak-cards ak-cards--5">
      <div v-for="a in adv" :key="a.title" class="ak-card">
        <span class="ak-terms__ico"><AkIcon :name="a.icon" /></span>
        <h3>{{ a.title }}</h3>
        <p>{{ a.text }}</p>
      </div>
    </div>

    <section class="ak-section">
      <h2 class="ak-h2">Кому продаём</h2>
      <ul class="ak-kinds">
        <li v-for="k in akKinds.slice(0, 7)" :key="k">{{ k }}</li>
      </ul>
    </section>
  </div>
</template>
