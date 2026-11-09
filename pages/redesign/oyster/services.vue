<script lang="ts" setup>
import { oyBar, oyContacts, oyPath, oyPhotos, oyServices } from '~/utils/oyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'
import OyPhone from '~/components/redesign/oyster/OyPhone.vue'

useSeoMeta({ title: 'Услуги — Oyster Market | Концепт редизайна' })
const prep = [
  { ...oyServices.oyster, to: '/catalog/ustritsy/', cta: 'Выбрать устрицы' },
  { ...oyServices.scallop, to: '/catalog/more/?sub=Морской гребешок', cta: 'Выбрать гребешок' },
  { ...oyServices.urchin, to: '/catalog/ezhi/', cta: 'Выбрать ежей' },
  { ...oyServices.fish, to: '/catalog/ryba/?sub=Рыба охлажденная', cta: 'Выбрать рыбу' },
]
const f = reactive({ name: '', phone: '', date: '', guests: '', comment: '' })
const sent = ref(false)
const ok = computed(() => f.name.trim() && f.phone.replace(/\D/g, '').length === 11)
</script>

<template>
  <div class="oy-wrap oy-page">
    <nav class="oy-crumbs" aria-label="Навигация">
      <NuxtLink :to="oyPath('/')">Главная</NuxtLink>
      <span>Услуги</span>
    </nav>
    <h1 class="oy-title">Услуги</h1>
    <p class="oy-lead">Подготовим морепродукты к столу перед отправкой и привезём устричный бар на ваше событие.</p>

    <section id="prep" class="oy-sec oy-svcs">
      <div class="oy-head"><h2>Подготовка морепродуктов</h2></div>
      <div class="oy-svcs__grid">
        <article v-for="s in prep" :key="s.title" class="oy-svcs__item">
          <OyIcon name="knife" :size="28" />
          <h3>{{ s.title }}</h3>
          <b class="oy-svcs__price">{{ s.price }} ₽/{{ s.per }}</b>
          <p>{{ s.text }}</p>
          <small>Отметьте «{{ s.short }}» под ценой товара или скажите менеджеру при оформлении.</small>
          <NuxtLink :to="oyPath(s.to)" class="oy-head__link">{{ s.cta }} <OyIcon name="arrow" :size="18" /></NuxtLink>
        </article>
      </div>
    </section>

    <section id="bar" class="oy-sec">
      <div class="oy-barpage">
        <img :src="oyPhotos.bar" alt="Фирменная ладья выездного устричного бара" width="1280" height="960" loading="lazy" />
        <div class="oy-barpage__text">
          <h2>{{ oyBar.title }}</h2>
          <p v-for="t in oyBar.text" :key="t.slice(0, 12)">{{ t }}</p>
          <p class="oy-barpage__tel">Смета по запросу: <a :href="oyContacts.phoneOptHref">{{ oyContacts.phoneOpt }}</a> · <a :href="`mailto:${oyContacts.email}`">{{ oyContacts.email }}</a></p>
        </div>
        <form v-if="!sent" class="oy-barpage__form" @submit.prevent="ok && (sent = true)">
          <h3>Заявка на мероприятие</h3>
          <div class="oy-form-grid">
            <label class="oy-field"><span>Имя</span><input v-model="f.name" autocomplete="name" /></label>
            <label class="oy-field"><span>Телефон</span><OyPhone v-model="f.phone" /></label>
            <label class="oy-field"><span>Дата</span><input v-model="f.date" type="date" /></label>
            <label class="oy-field"><span>Гостей</span><input v-model="f.guests" inputmode="numeric" placeholder="Например, 30" /></label>
          </div>
          <label class="oy-field"><span>Что за событие</span><textarea v-model="f.comment" rows="3" placeholder="Свадьба, день рождения, корпоратив — место и пожелания" /></label>
          <button type="submit" class="oy-btn oy-btn--accent oy-btn--big" :disabled="!ok">Отправить заявку</button>
        </form>
        <div v-else class="oy-barpage__form oy-modal__done">
          <span class="oy-modal__ok"><OyIcon name="check" :size="28" /></span>
          <p>Спасибо, {{ f.name }}! В концепте заявка никуда не уходит — на сайте менеджер свяжется и пришлёт смету.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.oy-svcs__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; @media (max-width: 1199px) { grid-template-columns: repeat(2, minmax(0, 1fr)); } @media (max-width: 576px) { grid-template-columns: minmax(0, 1fr); } }
.oy-svcs__item {
  display: flex; flex-direction: column; gap: 10px; padding: 22px; border-radius: var(--oy-R); background: var(--oy-surface2); color: var(--oy-accent); scroll-margin-top: 120px;
  h3 { font-size: 24px; }
  p { color: var(--oy-text); font-size: 14px; }
  small { color: var(--oy-muted); font-size: 13px; }
  .oy-head__link { margin-top: auto; }
}
.oy-svcs__price { font-size: 22px; color: var(--oy-ink); }
.oy-barpage {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0 32px; padding: 0; scroll-margin-top: 120px;
  img { grid-row: span 2; width: 100%; height: 100%; object-fit: cover; border-radius: 22px; min-height: 420px; }
  &__text { display: grid; gap: 12px; align-content: start; h2 { font-size: 40px; } p { color: var(--oy-text); } }
  &__tel { color: var(--oy-muted) !important; a { color: var(--oy-accent); font-weight: 600; } }
  &__form { display: grid; gap: 14px; margin-top: 20px; padding: 24px; border-radius: 20px; background: var(--oy-surface); h3 { font-size: 26px; } .oy-field input, .oy-field textarea { background: #fff; } }
  @media (max-width: 989px) { grid-template-columns: minmax(0, 1fr); img { grid-row: auto; min-height: 0; aspect-ratio: 4 / 3; height: auto; margin-bottom: 20px; } &__text h2 { font-size: 32px; } }
  @media (max-width: 576px) { &__form { padding: 18px; } }
}
</style>
