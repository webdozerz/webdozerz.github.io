<script lang="ts" setup>
import { oyContacts, oyOpt, oyPath, oyPhotos } from '~/utils/oyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'
import OyPhone from '~/components/redesign/oyster/OyPhone.vue'

useSeoMeta({ title: 'Оптовым клиентам — Oyster Market | Концепт редизайна' })
const types = ['Ресторан', 'Магазин', 'Кейтеринг', 'Гостиница', 'Другое']
const f = reactive({ type: 'Ресторан', company: '', inn: '', name: '', phone: '', email: '', text: '' })
const sent = ref(false)
const ok = computed(() => f.name.trim() && f.phone.replace(/\D/g, '').length === 11)
</script>

<template>
  <div class="oy-wrap oy-page">
    <nav class="oy-crumbs" aria-label="Навигация">
      <NuxtLink :to="oyPath('/')">Главная</NuxtLink>
      <span>Оптовым клиентам</span>
    </nav>
    <div class="oy-opt">
      <div class="oy-opt__main">
        <h1 class="oy-title">Доставка для HoReCa</h1>
        <p class="oy-lead">По всей территории России. Свяжитесь с нами, чтобы заказать прайс-лист, обсудить условия и детали поставки.</p>
        <ul class="oy-check oy-opt__terms">
          <li v-for="t in oyOpt.terms" :key="t"><OyIcon name="check" :size="20" /><span>{{ t }}</span></li>
        </ul>
        <div class="oy-opt__contacts">
          <a :href="oyContacts.phoneOptHref" class="oy-btn oy-btn--accent oy-btn--big"><OyIcon name="phone" :size="20" />{{ oyContacts.phoneOpt }}</a>
          <a :href="`mailto:${oyContacts.email}`" class="oy-btn oy-btn--line oy-btn--big"><OyIcon name="mail" :size="20" />{{ oyContacts.email }}</a>
        </div>
        <img :src="oyPhotos.feast" alt="Устрицы и морские ежи на блюде" width="977" height="500" loading="lazy" class="oy-opt__pic" />
        <div class="oy-opt__pluses">
          <b>Наши преимущества</b>
          <span v-for="t in oyOpt.pluses" :key="t">{{ t }}</span>
        </div>
      </div>
      <aside class="oy-opt__side">
        <form v-if="!sent" class="oy-opt__form" @submit.prevent="ok && (sent = true)">
          <h2>Запросить прайс-лист</h2>
          <div class="oy-seg oy-opt__types">
            <button v-for="t in types" :key="t" type="button" :class="{ 'is-on': f.type === t }" @click="f.type = t">{{ t }}</button>
          </div>
          <label class="oy-field"><span>Компания</span><input v-model="f.company" placeholder="Название заведения или юрлица" /></label>
          <label class="oy-field"><span>ИНН</span><input v-model="f.inn" inputmode="numeric" maxlength="12" placeholder="Для договора, можно позже" /></label>
          <div class="oy-form-grid">
            <label class="oy-field"><span>Имя</span><input v-model="f.name" autocomplete="name" /></label>
            <label class="oy-field"><span>Телефон</span><OyPhone v-model="f.phone" /></label>
          </div>
          <label class="oy-field"><span>E-mail</span><input v-model="f.email" type="email" placeholder="Пришлём прайс сюда" /></label>
          <label class="oy-field"><span>Что нужно</span><textarea v-model="f.text" rows="3" placeholder="Позиции, объёмы, как часто, куда везти" /></label>
          <button type="submit" class="oy-btn oy-btn--accent oy-btn--big oy-btn--block" :disabled="!ok">Запросить прайс</button>
        </form>
        <div v-else class="oy-opt__form oy-modal__done">
          <span class="oy-modal__ok"><OyIcon name="check" :size="28" /></span>
          <p>Спасибо! В концепте запрос никуда не уходит — на сайте менеджер пришлёт прайс-лист и условия{{ f.email ? ` на ${f.email}` : '' }}.</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.oy-opt {
  display: grid; grid-template-columns: minmax(0, 1fr) 420px; gap: 40px; align-items: start;
  &__main { display: grid; gap: 22px; }
  &__terms { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 24px; @media (max-width: 576px) { grid-template-columns: minmax(0, 1fr); } }
  &__contacts { display: flex; flex-wrap: wrap; gap: 10px; @media (max-width: 576px) { .oy-btn { flex: 1 1 100%; } } }
  &__pic { width: 100%; height: auto; aspect-ratio: 977 / 500; object-fit: cover; border-radius: 20px; }
  &__pluses { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; b { width: 100%; font-family: 'Advent Pro', sans-serif; font-size: 24px; color: var(--oy-ink); } span { padding: 8px 12px; border-radius: 10px; background: var(--oy-surface); font-weight: 600; font-size: 14px; color: var(--oy-ink); } }
  &__side { position: sticky; top: 100px; }
  &__form { display: grid; gap: 14px; padding: 26px; border-radius: 20px; background: var(--oy-surface); h2 { font-size: 30px; } .oy-field input, .oy-field textarea { background: #fff; } .oy-seg { background: #fff; } }
  &__types button.is-on { background: var(--oy-accent); color: #fff; }
  @media (max-width: 1199px) { grid-template-columns: minmax(0, 1fr) 360px; gap: 28px; }
  @media (max-width: 989px) { grid-template-columns: minmax(0, 1fr); &__side { position: static; } }
  @media (max-width: 576px) { &__form { padding: 18px; margin-left: -8px; margin-right: -8px; } }
}
</style>
