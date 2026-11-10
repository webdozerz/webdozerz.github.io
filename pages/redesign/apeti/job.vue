<script lang="ts" setup>
import { apPath } from '~/utils/apeti'
import { apVacancies } from '~/utils/apetiData'
import ApIcon from '~/components/redesign/apeti/ApIcon.vue'
import ApPhone from '~/components/redesign/apeti/ApPhone.vue'

useSeoMeta({ title: 'Вакансии — Apeti, концепт редизайна' })
const open = ref(0)
const form = reactive({ name: '', phone: '', job: apVacancies[0]?.name ?? '', ok: true })
const done = ref(false)
const pay = (v: (typeof apVacancies)[number]) => {
  const all = v.groups.flatMap((g) => g[1])
  const line = all.find((l) => /плата|Оплата|Стоимость одной/.test(l))
  return line ? line.replace(/^Заработная плата:\s*/, '').replace(/^Оплата\s*-\s*/, '') : ''
}
const apply = (name: string) => {
  form.job = name
  document.getElementById('ap-job-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <div class="ap-wrap ap-page">
    <nav class="ap-crumbs" aria-label="Хлебные крошки"><NuxtLink :to="apPath('/')">Главная</NuxtLink><span>Вакансии</span></nav>
    <div class="ap-head ap-job__head"><div><h1>Вакансии</h1><p>Команда Apeti увеличивает штат. Склад и офис — у метро «Преображенская площадь».</p></div></div>

    <div class="ap-job">
      <div class="ap-job__list">
        <article v-for="(v, i) in apVacancies" :key="v.name" :class="{ 'is-open': open === i }">
          <button type="button" class="ap-job__top" :aria-expanded="open === i" @click="open = open === i ? -1 : i">
            <span><b>{{ v.name }}</b><small v-if="pay(v)">{{ pay(v) }}</small></span>
            <ApIcon name="down" />
          </button>
          <div v-if="open === i" class="ap-job__body">
            <div v-for="g in v.groups" :key="g[0]">
              <h3>{{ g[0] }}</h3>
              <ul class="ap-list"><li v-for="l in g[1]" :key="l">{{ l }}</li></ul>
            </div>
            <button type="button" class="ap-btn" @click="apply(v.name)">Оставить заявку</button>
          </div>
        </article>
      </div>

      <form id="ap-job-form" class="ap-panel ap-form ap-job__form" @submit.prevent="done = true">
        <template v-if="!done">
          <h2>Оставить заявку</h2>
          <label class="ap-field"><span>Вакансия</span>
            <select v-model="form.job"><option v-for="v in apVacancies" :key="v.name">{{ v.name }}</option></select>
          </label>
          <label class="ap-field"><span>ФИО</span><input v-model="form.name" type="text" required autocomplete="name" /></label>
          <label class="ap-field"><span>Телефон</span><ApPhone v-model="form.phone" required /></label>
          <label class="ap-check"><input v-model="form.ok" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
          <button type="submit" class="ap-btn ap-btn--big">Отправить</button>
          <p class="ap-modal__note">Демо: заявка никуда не отправляется.</p>
        </template>
        <div v-else class="ap-done"><h2>Заявка принята</h2><p>В настоящем магазине с вами свяжутся по телефону. Это демо — данные никуда не отправлены.</p></div>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.ap .ap-job__head { margin-top: 12px; }
.ap .ap-job { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 32px; align-items: start;
  &__list { display: grid; gap: 10px; min-width: 0;
    article { border: 1px solid var(--ap-line); border-radius: var(--ap-R); overflow: hidden; &.is-open { border-color: #c5cdaf; } }
  }
  &__top, &__top:focus { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; padding: 16px 20px; border: 0; background: #fff; text-align: left;
    span { display: grid; gap: 2px; }
    b { font-family: var(--ap-head); font-size: 21px; font-weight: 600; }
    small { font-size: 14px; color: var(--ap-acc-d); }
    .ap-icon { transition: transform .2s; color: var(--ap-mute); }
  }
  article.is-open &__top .ap-icon { transform: rotate(180deg); }
  &__body { display: grid; gap: 16px; justify-items: start; padding: 4px 20px 20px; h3 { margin-bottom: 8px; font-size: 17px; } li { font-size: 14.5px; } }
  &__form { position: sticky; top: calc(var(--ap-bar) + 16px); }
}
@media (max-width: 989px) {
  .ap .ap-job { grid-template-columns: minmax(0, 1fr); &__form { position: static; } }
}
@media (max-width: 576px) {
  .ap .ap-job__top, .ap .ap-job__top:focus { padding: 14px 16px; b { font-size: 18px; } }
  .ap .ap-job__body { padding: 4px 16px 16px; }
}
</style>
