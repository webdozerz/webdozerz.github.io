<script lang="ts" setup>
import { olCardImg, olContacts, olPath } from '~/utils/olimpfish'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'
import { useOlUi } from '~/composables/useOlimpfish'

useSeoMeta({ title: 'Карта привилегий — Олимп | Концепт редизайна' })
const ui = useOlUi()
</script>

<template>
  <div class="ol-wrap ol-page ol-club">
    <nav class="ol-crumbs" aria-label="Навигация">
      <NuxtLink :to="olPath('/')">Главная</NuxtLink>
      <span>Карта привилегий</span>
    </nav>
    <div class="ol-club__grid">
      <img :src="olCardImg" alt="Карта постоянного покупателя «Club card»" width="600" height="380" />
      <div class="ol-club__text">
        <h1 class="ol-title">Карта привилегий «Club card»</h1>
        <p class="ol-lead">Программа лояльности ООО «ТК «Олимп» — карта постоянного покупателя.</p>
        <p>Условия карты уточняйте у менеджера в магазине на Никулинской или по телефону {{ olContacts.phones[2].text }}.</p>
        <div class="ol-club__btns">
          <button type="button" class="ol-btn ol-btn--acc" @click="ui.open('callback')"><OlIcon name="phone" />Узнать условия</button>
          <NuxtLink :to="olPath('/contacts')" class="ol-btn ol-btn--line">Как добраться</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ol .ol-club {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
    gap: 40px;
    align-items: center;
    img {
      width: 100%;
      height: auto;
      border-radius: 20px;
      border: 1px solid var(--ol-line);
    }
  }
  &__text {
    display: grid;
    gap: 14px;
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 6px;
  }
}
@media (max-width: 989px) {
  .ol .ol-club__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    img {
      max-width: 480px;
    }
  }
}
</style>
