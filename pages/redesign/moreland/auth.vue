<script lang="ts" setup>
// Вход как у них (/auth/): Логин, Пароль, «Запомнить меня на этом компьютере», «Забыли свой пароль?». Регистрации у них нет.
import { mlPath } from '~/utils/moreland'

useSeoMeta({ title: 'Вход — Морелэнд | Концепт редизайна' })
const mode = ref<'login' | 'forgot'>('login')
const f = reactive({ login: '', pass: '', remember: true, mail: '', note: '' })
const submit = () => {
  f.note = mode.value === 'login' ? 'Демо: вход не выполняется.' : 'Демо: письмо для смены пароля не отправлено.'
}
</script>

<template>
  <div class="ml-wrap ml-auth">
    <nav class="ml-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mlPath('/')">Главная</NuxtLink></span>
      <span>Вход</span>
    </nav>
    <div class="ml-panel ml-auth__box">
      <h1>{{ mode === 'login' ? 'Вход' : 'Восстановление пароля' }}</h1>
      <form class="ml-form" @submit.prevent="submit">
        <template v-if="mode === 'login'">
          <label class="ml-field"><span>Логин</span><input v-model="f.login" autocomplete="username" required /></label>
          <label class="ml-field"><span>Пароль</span><input v-model="f.pass" type="password" autocomplete="current-password" required /></label>
          <label class="ml-check"><input v-model="f.remember" type="checkbox" />Запомнить меня на этом компьютере</label>
          <button type="submit" class="ml-btn">Войти</button>
          <button type="button" class="ml-auth__link" @click="(mode = 'forgot'), (f.note = '')">Забыли свой пароль?</button>
        </template>
        <template v-else>
          <p class="ml-auth__hint">Укажите логин или e-mail — пришлём контрольную строку для смены пароля.</p>
          <label class="ml-field"><span>Логин или e-mail</span><input v-model="f.mail" required /></label>
          <button type="submit" class="ml-btn">Выслать</button>
          <button type="button" class="ml-auth__link" @click="(mode = 'login'), (f.note = '')">Вернуться ко входу</button>
        </template>
        <p v-if="f.note" class="ml-auth__note" role="status">{{ f.note }}</p>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.ml-auth {
  &__box {
    max-width: 460px;
    margin: 28px auto 0;
    h1 {
      font-size: 30px;
      margin-bottom: 18px;
    }
  }
  &__link {
    justify-self: start;
    padding: 0;
    border: 0;
    background: none;
    color: var(--ml-acc);
    font-weight: 700;
  }
  &__hint {
    color: var(--ml-mute);
    font-size: 14px;
  }
  &__note {
    padding: 10px 12px;
    border-radius: 10px;
    background: #fff;
    font-size: 14px;
  }
}
</style>
