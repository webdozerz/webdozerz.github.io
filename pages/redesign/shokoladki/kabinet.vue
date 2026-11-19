<script lang="ts" setup>
// Личный кабинет (демо): профиль, бонусная карта, избранное, заказы — всё в этом браузере.
import { skPath } from '~/utils/shokoladki'
import { useSkStore, useSkUi } from '~/composables/useShokoladki'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'

useSeoMeta({ title: 'Личный кабинет — АПРИОРИ | Концепт редизайна' })
const store = useSkStore()
const ui = useSkUi()
const to = (p: string) => skPath(p)
onMounted(() => store.persist())
const pass = reactive({ a: '', b: '', sent: false })
</script>

<template>
  <div class="sk-wrap sk-page">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>Личный кабинет</span>
    </nav>
    <template v-if="store.user.value">
      <div class="sk-rhead">
        <h1 class="sk-h1">Здравствуйте, {{ store.user.value.name }}</h1>
        <button type="button" class="sk-btn sk-btn--line" @click="store.logout()"><SkIcon name="login" />Выйти</button>
      </div>
      <div class="sk-cab">
        <div class="sk-panel"><b>Профиль</b><span>{{ store.user.value.email || 'e-mail не указан' }}</span><span>Город доставки: {{ store.city.value }}</span></div>
        <div class="sk-panel"><b>Бонусы</b><span>{{ store.bonusCard.value ? `Карта на ${store.bonusCard.value}` : 'Карта не оформлена' }}</span><NuxtLink :to="to('/loyalnost/')" class="sk-link">Программа лояльности</NuxtLink></div>
        <div class="sk-panel"><b>Избранное</b><span>{{ store.favCount.value }} товаров в {{ store.lists.value.length }} списках</span><NuxtLink :to="to('/izbrannoe/')" class="sk-link">Открыть</NuxtLink></div>
        <div class="sk-panel"><b>Заказы</b><span>Здесь появится история заказов — в демо они не сохраняются.</span><NuxtLink :to="to('/korzina/')" class="sk-link">Корзина</NuxtLink></div>
      </div>
      <form v-if="!pass.sent" class="sk-box sk-form sk-cab__pass" @submit.prevent="pass.sent = true">
        <b class="sk-h2">Смена пароля</b>
        <label class="sk-field"><span>Новый пароль</span><input v-model="pass.a" class="sk-input" type="password" required autocomplete="new-password" /></label>
        <label class="sk-field"><span>Подтверждение</span><input v-model="pass.b" class="sk-input" type="password" required autocomplete="new-password" /></label>
        <p v-if="pass.b && pass.a !== pass.b" class="sk-error">Пароли не совпадают</p>
        <button class="sk-btn" type="submit" :disabled="pass.a !== pass.b">Сохранить</button>
      </form>
      <p v-else class="sk-done"><SkIcon name="check" />Демо: пароль не изменён.</p>
    </template>
    <div v-else class="sk-empty">
      <b class="sk-h2">Войдите в личный кабинет</b>
      <p>Бонусы, избранное и история заказов.</p>
      <button type="button" class="sk-btn" @click="ui.modal.value = 'login'">Войти</button>
    </div>
  </div>
</template>
