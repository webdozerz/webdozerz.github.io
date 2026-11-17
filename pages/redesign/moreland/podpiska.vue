<script lang="ts" setup>
// Подписка на рассылку — поля оригинала: ФИО*, E-mail*, Организация.
import { mlDate, mlPath } from '~/utils/moreland'
import { mlNews } from '~/utils/moreland.data'
import MlIcon from '~/components/redesign/moreland/MlIcon.vue'

useSeoMeta({ title: 'Подписаться на новости — Морелэнд | Концепт редизайна' })
const f = reactive({ name: '', mail: '', org: '', tried: false, done: false })
const mailOk = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.mail.trim()))
const send = () => {
  f.tried = true
  if (!f.name.trim() || !mailOk.value) return
  f.done = true
}
const last = mlNews.slice(0, 4)
</script>

<template>
  <div class="ml-wrap ml-sub">
    <nav class="ml-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mlPath('/')">Главная</NuxtLink></span>
      <span>Подписаться</span>
    </nav>
    <div class="ml-sub__grid">
      <div>
        <div class="ml-pagehead">
          <h1>Подписка на новости</h1>
          <p>Новые партии, цены и прайс-листы — на почту, как только выходят. Обычно раз в неделю.</p>
        </div>
        <form v-if="!f.done" class="ml-form ml-panel" novalidate @submit.prevent="send">
          <label class="ml-field" :class="{ 'is-err': f.tried && !f.name.trim() }"><span>ФИО *</span><input v-model="f.name" autocomplete="name" /></label>
          <label class="ml-field" :class="{ 'is-err': f.tried && !mailOk }"><span>E-mail *</span><input v-model="f.mail" type="email" autocomplete="email" /></label>
          <label class="ml-field"><span>Организация</span><input v-model="f.org" autocomplete="organization" /></label>
          <p class="ml-form__note">* — обязательные поля. Демо: подписка никуда не уйдёт.</p>
          <button type="submit" class="ml-btn">Отправить</button>
        </form>
        <div v-else class="ml-panel ml-sub__done">
          <span class="ml-modal__ok"><MlIcon name="check" /></span>
          <h2>Вы подписаны</h2>
          <p>В настоящем сайте новости придут на {{ f.mail }}. Это демо-макет — подписка не оформлена.</p>
        </div>
      </div>
      <aside class="ml-sub__side">
        <h2>Что приходит в рассылке</h2>
        <NuxtLink v-for="n in last" :key="n.id" :to="mlPath(`/novosti/${n.id}/`)" class="ml-sub__item">
          <span>{{ mlDate(n.date) }}</span><b>{{ n.t }}</b>
        </NuxtLink>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.ml-sub {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 40px;
    align-items: start;
  }
  form {
    max-width: 560px;
  }
  &__done {
    display: grid;
    gap: 10px;
    justify-items: start;
    max-width: 560px;
    p {
      color: var(--ml-mute);
    }
  }
  &__side {
    display: grid;
    gap: 10px;
    padding-top: 28px;
    h2 {
      font-size: 20px;
      margin-bottom: 4px;
    }
  }
  &__item {
    display: grid;
    gap: 2px;
    padding: 14px 16px;
    border: 1px solid var(--ml-line);
    border-radius: 12px;
    span {
      font-size: 12.5px;
      color: var(--ml-mute);
    }
    b {
      color: var(--ml-ink);
    }
    &:hover {
      border-color: var(--ml-acc);
    }
  }
  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }
  }
}
</style>
