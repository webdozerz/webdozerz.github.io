<script lang="ts" setup>
import { dmPath, dmSeries, dmTypes } from '~/utils/domoteka'
import { dmProducts } from '~/utils/domoteka.data'

useSeoMeta({ title: 'Карта сайта — Домотека | Концепт редизайна' })
const groups = [
  {
    n: 'Каталог',
    links: [
      ['/katalog/stoly/', 'Столы'],
      ...dmTypes.map((t) => [`/katalog/stoly/?type=${t.id}`, t.n]),
      ['/katalog/stulya/', 'Стулья'],
      ['/katalog/akcii/', 'Акции'],
    ],
  },
  { n: 'Серии столов', links: dmSeries.map((s) => [`/katalog/stoly/?series=${encodeURIComponent(s)}`, s]) },
  {
    n: 'Покупателям',
    links: [
      ['/gde-kupit/', 'Как купить'],
      ['/gde-kupit/#magaziny', 'Магазины в вашем городе'],
      ['/gde-kupit/#internet', 'Интернет-магазины'],
      ['/instrukcii/', 'Инструкции по сборке'],
      ['/izbrannoe/', 'Избранное'],
      ['/sravnenie/', 'Сравнение'],
    ],
  },
  {
    n: 'Компания',
    links: [
      ['/o-fabrike/', 'О фабрике'],
      ['/dileram/', 'Дилерам'],
      ['/novosti/', 'Новости'],
      ['/kontakty/', 'Контакты'],
      ['/politika/', 'Политика обработки персональных данных'],
    ],
  },
]
</script>

<template>
  <div class="dm-wrap dm-map-page">
    <div class="dm-page-head">
      <nav class="dm-crumbs" aria-label="Навигация"><NuxtLink :to="dmPath('/')">Главная</NuxtLink><span>Карта сайта</span></nav>
      <h1 class="dm-h1">Карта сайта</h1>
    </div>
    <div class="dm-map-page__grid">
      <section v-for="g in groups" :key="g.n">
        <h2>{{ g.n }}</h2>
        <NuxtLink v-for="[href, n] in g.links" :key="href" :to="dmPath(href)">{{ n }}</NuxtLink>
      </section>
      <section>
        <h2>Модели</h2>
        <NuxtLink v-for="p in dmProducts" :key="p.id" :to="dmPath(`/model/${p.id}/`)">{{ p.n }}</NuxtLink>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.dm .dm-map-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 28px;
  margin-top: 24px;
  section {
    display: grid;
    align-content: start;
    gap: 7px;
  }
  h2 {
    margin-bottom: 4px;
    font: 700 18px/1.2 var(--dm-head);
  }
  a {
    color: var(--dm-muted);
    text-decoration: none;
    &:hover {
      color: var(--dm-acc);
    }
  }
}
</style>
