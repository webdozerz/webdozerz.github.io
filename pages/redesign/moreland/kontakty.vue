<script lang="ts" setup>
import { mlCities, mlContacts, mlPath } from '~/utils/moreland'
import { useMlUi } from '~/composables/useMoreland'
import MlIcon from '~/components/redesign/moreland/MlIcon.vue'

useSeoMeta({ title: 'Контакты — Морелэнд | Концепт редизайна' })
const ui = useMlUi()
</script>

<template>
  <div class="ml-wrap ml-contacts">
    <nav class="ml-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mlPath('/')">Главная</NuxtLink></span>
      <span>Контакты</span>
    </nav>
    <div class="ml-pagehead"><h1>Контакты</h1></div>
    <div class="ml-contacts__grid">
      <div class="ml-contacts__cards">
        <a :href="`tel:${mlContacts.tel}`" class="ml-ccard">
          <MlIcon name="phone" /><span><small>Телефон</small><b>{{ mlContacts.phone }}</b></span>
        </a>
        <a :href="`mailto:${mlContacts.email}`" class="ml-ccard">
          <MlIcon name="mail" /><span><small>E-mail отдела продаж</small><b>{{ mlContacts.email }}</b></span>
        </a>
        <a :href="mlContacts.map" target="_blank" rel="noopener" class="ml-ccard">
          <MlIcon name="pin" /><span><small>Адрес</small><b>{{ mlContacts.address }}</b></span>
        </a>
        <div class="ml-panel ml-contacts__write">
          <h2>Вопрос по поставкам?</h2>
          <p>Напишите — менеджер ответит на почту. Опт от коробки, юр. лица и ИП.</p>
          <button type="button" class="ml-btn" @click="ui.write.value = { open: true, text: '' }"><MlIcon name="mail" />Написать нам</button>
        </div>
        <p class="ml-contacts__legal">{{ mlContacts.legal }}<br />Доставка: бесплатно по Омску; {{ mlCities.slice(1).join(', ') }}.</p>
      </div>
      <div class="ml-map">
        <iframe :src="mlContacts.mapWidget" title="Морелэнд на карте" loading="lazy" />
        <div class="ml-map__fallback">
          <MlIcon name="pin" />
          <b>{{ mlContacts.addressShort }}</b>
          <a :href="mlContacts.map" target="_blank" rel="noopener">Открыть в Яндекс Картах</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ml-contacts {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
    gap: 28px;
    align-items: stretch;
  }
  &__cards {
    display: grid;
    gap: 12px;
    align-content: start;
  }
  &__write {
    display: grid;
    gap: 10px;
    justify-items: start;
    h2 {
      font-size: 22px;
    }
    p {
      color: var(--ml-mute);
      font-size: 14.5px;
    }
  }
  &__legal {
    font-size: 13.5px;
    color: var(--ml-mute);
  }
  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
.ml-ccard {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: 1px solid var(--ml-line);
  border-radius: var(--ml-R);
  .ml-icon {
    width: 24px;
    height: 24px;
    color: var(--ml-acc);
  }
  span {
    display: grid;
    min-width: 0;
  }
  small {
    font-size: 13px;
    color: var(--ml-mute);
  }
  b {
    font-size: 17px;
    color: var(--ml-ink);
    overflow-wrap: anywhere;
  }
  &:hover {
    border-color: var(--ml-acc);
  }
}
.ml-map {
  position: relative;
  min-height: 420px;
  border-radius: var(--ml-R);
  overflow: hidden;
  background: var(--ml-surf);
  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    z-index: 1;
  }
  &__fallback {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 6px;
    text-align: center;
    padding: 16px;
    .ml-icon {
      width: 32px;
      height: 32px;
      color: var(--ml-acc);
    }
    a {
      color: var(--ml-acc);
      font-weight: 800;
    }
  }
  @media (max-width: 576px) {
    min-height: 300px;
  }
}
</style>
