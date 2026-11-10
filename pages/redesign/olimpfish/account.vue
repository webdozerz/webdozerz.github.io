<script lang="ts" setup>
import { olPath, olRub } from '~/utils/olimpfish'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'
import { useOlShop, useOlUi } from '~/composables/useOlimpfish'

useSeoMeta({ title: 'Личный кабинет — Олимп | Концепт редизайна' })
const shop = useOlShop()
const ui = useOlUi()
onMounted(() => shop.persist())
</script>

<template>
  <div class="ol-wrap ol-page ol-account">
    <nav class="ol-crumbs" aria-label="Навигация">
      <NuxtLink :to="olPath('/')">Главная</NuxtLink>
      <span>Личный кабинет</span>
    </nav>
    <template v-if="shop.user.value">
      <h1 class="ol-title">Здравствуйте, {{ shop.user.value }}</h1>
      <p class="ol-lead">Это демо-кабинет: история заказов и адреса появятся после подключения к магазину.</p>
      <div class="ol-account__grid">
        <NuxtLink :to="olPath('/cart')" class="ol-account__tile"><OlIcon name="cart" /><b>Корзина</b><span>{{ shop.count.value ? `${shop.count.value} шт · ${olRub(shop.total.value)}` : 'пусто' }}</span></NuxtLink>
        <NuxtLink :to="olPath('/favorites')" class="ol-account__tile"><OlIcon name="heart" /><b>Избранное</b><span>{{ shop.fav.value.length }} товаров</span></NuxtLink>
        <NuxtLink :to="olPath('/card')" class="ol-account__tile"><OlIcon name="card" /><b>Карта привилегий</b><span>Club card</span></NuxtLink>
        <button type="button" class="ol-account__tile" @click="shop.logout()"><OlIcon name="out" /><b>Выйти</b><span>из демо-кабинета</span></button>
      </div>
    </template>
    <div v-else class="ol-empty">
      <OlIcon name="user" />
      <h2>Вход в личный кабинет</h2>
      <p>Войдите или создайте аккаунт — заказывать можно и без регистрации.</p>
      <div class="ol-account__btns">
        <button type="button" class="ol-btn ol-btn--acc" @click="ui.open('login')">Войти</button>
        <button type="button" class="ol-btn ol-btn--line" @click="ui.open('login')">Создать аккаунт</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ol .ol-account {
  &__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: 24px;
  }
  &__tile {
    display: grid;
    gap: 6px;
    justify-items: start;
    padding: 22px;
    border: 0;
    border-radius: var(--ol-R);
    background: var(--ol-surf);
    text-align: left;
    .ol-icon {
      width: 28px;
      height: 28px;
      color: var(--ol-acc);
    }
    b {
      font-size: 17px;
      color: var(--ol-ink);
    }
    span {
      color: var(--ol-mute);
      font-size: 14px;
    }
    &:hover b {
      color: var(--ol-acc);
    }
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
}
@media (max-width: 989px) {
  .ol .ol-account__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
