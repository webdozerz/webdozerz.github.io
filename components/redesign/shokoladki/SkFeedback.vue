<script lang="ts" setup>
// Форма «Напишите нам» оригинала: имя, e-mail, сообщение, согласие. Демо — ничего не отправляет.
import { skPath, skContacts } from '~/utils/shokoladki'
import SkIcon from './SkIcon.vue'

defineProps<{ title?: string; lead?: string }>()
const f = reactive({ name: '', email: '', text: '', ok: false, sent: false })
</script>

<template>
  <section class="sk-box sk-fb">
    <h2 class="sk-h2">{{ title || 'Напишите нам' }}</h2>
    <p v-if="lead" class="sk-muted">{{ lead }}</p>
    <form v-if="!f.sent" class="sk-form sk-form--two" @submit.prevent="f.sent = true">
      <label class="sk-field"><span>Ваше имя</span><input v-model="f.name" class="sk-input" required autocomplete="name" /></label>
      <label class="sk-field"><span>Ваш e-mail</span><input v-model="f.email" class="sk-input" type="email" required autocomplete="email" /></label>
      <label class="sk-field sk-form__wide"><span>Сообщение</span><textarea v-model="f.text" class="sk-input" rows="4" required /></label>
      <label class="sk-check sk-check--small sk-form__wide"><input v-model="f.ok" type="checkbox" required /><span>Согласен с <NuxtLink :to="skPath('/politika/')">условиями обработки персональной информации</NuxtLink></span></label>
      <button class="sk-btn sk-btn--big" type="submit">Отправить</button>
    </form>
    <p v-else class="sk-done"><SkIcon name="check" />Спасибо, {{ f.name }}! Это демо: сообщение не отправлено. Пишите на {{ skContacts.email }}.</p>
  </section>
</template>

<style lang="scss">
.sk .sk-fb {
  display: grid;
  gap: 14px;
  align-content: start;
}
</style>
