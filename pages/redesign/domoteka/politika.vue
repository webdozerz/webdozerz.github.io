<script lang="ts" setup>
import { dmContacts, dmPath } from '~/utils/domoteka'

useSeoMeta({ title: 'Политика обработки персональных данных — Домотека | Концепт редизайна' })
</script>

<template>
  <div class="dm-wrap dm-policy">
    <div class="dm-page-head">
      <nav class="dm-crumbs" aria-label="Навигация"><NuxtLink :to="dmPath('/')">Главная</NuxtLink><span>Политика обработки персональных данных</span></nav>
      <h1 class="dm-h1">Политика обработки персональных данных</h1>
    </div>
    <div class="dm-policy__body">
      <p>Здесь будет размещён текст политики ООО «ДОМОТЕКА» в отношении обработки персональных данных и согласие на их обработку — на него ведут галочки во всех формах сайта.</p>
      <p>В концепте страница показывает место документа: сам текст фабрика утверждает с юристом и добавляет в разделе сайта.</p>
      <p>По вопросам обработки персональных данных: <a :href="`mailto:${dmContacts.sales}`">{{ dmContacts.sales }}</a>, {{ dmContacts.phone }}.</p>
    </div>
  </div>
</template>

<style lang="scss">
.dm .dm-policy__body {
  display: grid;
  gap: 14px;
  max-width: 760px;
  margin-top: 20px;
  font-size: 16px;
  line-height: 1.65;
  a {
    color: var(--dm-acc);
  }
}
</style>
