<script lang="ts" setup>
import AkIcon from '~/components/redesign/aks124/AkIcon.vue'

useSeoMeta({ title: 'Контакты | ИП Аксюченко — концепт редизайна' })
const ui = useAks124Ui()
const [lat, lon] = akContacts.geo
const mapSrc = `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=16&pt=${lon}%2C${lat}%2Cpm2grm`
const mapLink = `https://yandex.ru/maps/?pt=${lon},${lat}&z=16&l=map`
</script>

<template>
  <div class="ak-wrap ak-page">
    <nav class="ak-crumbs" aria-label="Навигация">
      <NuxtLink :to="akPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Контакты</span>
    </nav>
    <h1>Контакты</h1>

    <div class="ak-contacts">
      <div class="ak-contacts__info">
        <div class="ak-contacts__block">
          <p class="ak-contacts__label">Телефоны</p>
          <a v-for="ph in akContacts.phones" :key="ph.href" :href="ph.href" class="ak-contacts__phone">{{ ph.label }}</a>
          <button type="button" class="ak-btn ak-btn--soft" @click="ui.modal.value = 'call'"><AkIcon name="phone" :size="20" />Обратный звонок</button>
        </div>
        <div class="ak-contacts__block">
          <p class="ak-contacts__label">Почта</p>
          <a :href="`mailto:${akContacts.email}`" class="ak-contacts__link">{{ akContacts.email }}</a>
        </div>
        <div class="ak-contacts__block">
          <p class="ak-contacts__label">Офис и склад</p>
          <p>{{ akContacts.addressFull }}</p>
          <p>{{ akContacts.hours }}, приём звонков в будни</p>
        </div>
        <div class="ak-contacts__block">
          <p class="ak-contacts__label">Мы в соцсетях</p>
          <p class="ak-contacts__social">
            <a :href="akContacts.vk" target="_blank" rel="noopener">ВКонтакте</a>
            <a :href="akContacts.ok" target="_blank" rel="noopener">Одноклассники</a>
          </p>
        </div>
      </div>
      <div class="ak-map">
        <div class="ak-map__frame">
          <span class="ak-map__pin"><AkIcon name="pin" :size="28" />Наш офис · Дудинская, 6</span>
          <iframe :src="mapSrc" title="Карта: офис и склад" loading="lazy" />
        </div>
        <a :href="mapLink" target="_blank" rel="noopener" class="ak-more">Открыть в Яндекс Картах <AkIcon name="arrow" :size="18" /></a>
      </div>
    </div>

    <section class="ak-section">
      <h2 class="ak-h2">Реквизиты</h2>
      <dl class="ak-req">
        <template v-for="[k, v] in akContacts.requisites" :key="k">
          <dt>{{ k }}</dt>
          <dd>{{ v }}</dd>
        </template>
      </dl>
    </section>
  </div>
</template>
