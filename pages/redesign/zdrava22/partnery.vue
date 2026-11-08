<script lang="ts" setup>
import { zdContacts, zdOrig, zdPartners, zdPath, zdTk } from '~/utils/zdrava22'
import ZdIcon from '~/components/redesign/zdrava22/ZdIcon.vue'

useSeoMeta({ title: 'Партнёры — пасека «Ширяев и сыновья» | Концепт редизайна' })
</script>

<template>
  <div class="zd-wrap">
    <nav class="zd-crumbs"><NuxtLink :to="zdPath()">Главная</NuxtLink><span>Партнёры</span></nav>
    <header class="zd-pagehead">
      <h1>Партнёры</h1>
      <p>Наш мёд можно купить у партнёров в городах — звоните им напрямую. В остальные города отправляем сами транспортными компаниями и Почтой России.</p>
    </header>

    <section class="zd-sec zd-sec--first">
      <div class="zd-partners">
        <div v-for="p in zdPartners" :id="p.id" :key="p.id" class="zd-partners__card zd-partners__card--page">
          <b>{{ p.city }}</b>
          <small v-if="p.name">{{ p.name }}</small>
          <small v-else>контакты партнёра — на его странице</small>
          <a v-if="p.phone" :href="`tel:${p.tel}`"><ZdIcon name="phone" :size="16" /> {{ p.phone }}</a>
          <a :href="zdOrig(p.url)" target="_blank" rel="noopener" class="zd-partners__more">Страница партнёра<ZdIcon name="ext" :size="14" /></a>
        </div>
      </div>
    </section>

    <section class="zd-sec">
      <div class="zd-nocity">
        <div>
          <h2>Вашего города нет в списке?</h2>
          <p>Отправим в любой город России: {{ zdTk.join(', ') }}. За доставку рассчитываетесь при получении.</p>
        </div>
        <div class="zd-nocity__btns">
          <a :href="`tel:${zdContacts.tel}`" class="zd-btn zd-btn--big"><ZdIcon name="phone" :size="18" />{{ zdContacts.phone }}</a>
          <NuxtLink :to="zdPath('/kontakty') + '#zakaz'" class="zd-btn zd-btn--line zd-btn--big">Форма заказа</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.zd-partners__card--page {
  scroll-margin-top: 96px;

  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
}
.zd-partners__more {
  font-size: 13px;
  color: var(--zd-muted) !important;
  font-weight: 400 !important;
  margin-top: 2px !important;
}
.zd-nocity {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 28px;
  border-radius: var(--zd-R);
  background: var(--zd-yellow-soft);

  h2 {
    font-size: 26px;
  }
  p {
    margin-top: 6px;
    max-width: 640px;
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 576px) {
    padding: 20px 18px;

    h2 {
      font-size: 22px;
    }
    &__btns,
    &__btns .zd-btn {
      width: 100%;
    }
  }
}
</style>
