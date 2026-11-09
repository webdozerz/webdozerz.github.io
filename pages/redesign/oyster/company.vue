<script lang="ts" setup>
import { oyAbout, oyContacts, oyImg, oyPath, oyPhotos, oyReviews } from '~/utils/oyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'

useSeoMeta({ title: 'О компании — Oyster Market | Концепт редизайна' })
const L = oyContacts.legal
const rows = [
  ['Наименование', L.name],
  ['ИНН', L.inn],
  ['ОГРНИП', L.ogrnip],
  ['ОКАТО', L.okato],
  ['Расчётный счёт', L.account],
  ['Банк', L.bank],
  ['БИК', L.bik],
  ['Корр. счёт', L.corr],
  ['E-mail', oyContacts.email],
  ['Телефон', oyContacts.phoneCity],
]
const copied = ref(false)
const copy = async () => {
  try {
    await navigator.clipboard.writeText(rows.map((r) => `${r[0]}: ${r[1]}`).join('\n'))
    copied.value = true
  } catch {
    /* без буфера обмена — ничего */
  }
}
</script>

<template>
  <div class="oy-wrap oy-page">
    <nav class="oy-crumbs" aria-label="Навигация">
      <NuxtLink :to="oyPath('/')">Главная</NuxtLink>
      <span>О компании</span>
    </nav>
    <div class="oy-company">
      <div class="oy-company__text">
        <h1 class="oy-title">Истоки Oyster Market</h1>
        <div class="oy-prose">
          <p v-for="t in oyAbout" :key="t.slice(0, 16)">{{ t }}</p>
        </div>
        <div class="oy-company__nums">
          <div><b>2012</b><span>начали искать поставщиков напрямую</span></div>
          <div><b>еженедельно</b><span>завоз морепродуктов</span></div>
          <div><b>{{ oyReviews.length }}</b><span>отзывов покупателей на сайте</span></div>
        </div>
        <div class="oy-hero__btns">
          <NuxtLink :to="oyPath('/reviews/')" class="oy-btn oy-btn--line">Отзывы</NuxtLink>
          <NuxtLink :to="oyPath('/contacts/')" class="oy-btn oy-btn--line">Контакты</NuxtLink>
        </div>
      </div>
      <div class="oy-company__pics">
        <img :src="oyPhotos.platter" alt="Устрицы и морские ежи на блюде" width="1280" height="853" loading="lazy" />
        <img :src="oyPhotos.crab" alt="Камчатский краб" width="2560" height="2101" loading="lazy" />
        <img :src="oyImg('seal.png')" alt="" width="192" height="192" class="oy-company__seal" />
      </div>
    </div>

    <section class="oy-sec">
      <div class="oy-head">
        <h2>Реквизиты организации</h2>
        <button type="button" class="oy-btn oy-btn--line" @click="copy"><OyIcon :name="copied ? 'check' : 'doc'" :size="18" />{{ copied ? 'Скопировано' : 'Скопировать реквизиты' }}</button>
      </div>
      <table class="oy-props oy-company__req">
        <tr v-for="r in rows" :key="r[0]">
          <th>{{ r[0] }}</th>
          <td>{{ r[1] }}</td>
        </tr>
      </table>
    </section>
  </div>
</template>

<style lang="scss">
.oy-company {
  display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 40px; align-items: start;
  &__text { display: grid; gap: 22px; }
  &__nums { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; div { display: grid; gap: 4px; padding: 16px; border-radius: 14px; background: var(--oy-surface); } b { font-family: 'Advent Pro', sans-serif; font-size: 28px; color: var(--oy-accent); line-height: 1; } span { font-size: 13px; color: var(--oy-muted); } @media (max-width: 576px) { grid-template-columns: minmax(0, 1fr); } }
  &__pics {
    position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    img { width: 100%; height: auto; aspect-ratio: 3 / 4; object-fit: cover; border-radius: 20px; }
    img:nth-child(2) { margin-top: 48px; }
  }
  &__seal { position: absolute; left: 50%; bottom: -20px; width: 112px !important; height: 112px !important; aspect-ratio: 1 !important; transform: translateX(-50%); border-radius: 0 !important; }
  &__req { max-width: 760px; }
  @media (max-width: 989px) { grid-template-columns: minmax(0, 1fr); &__pics { max-width: 560px; } }
}
</style>
