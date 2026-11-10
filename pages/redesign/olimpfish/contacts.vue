<script lang="ts" setup>
import { olContacts, olPath } from '~/utils/olimpfish'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'
import { useOlUi } from '~/composables/useOlimpfish'

useSeoMeta({ title: 'Контакты — Олимп | Концепт редизайна' })
const ui = useOlUi()
</script>

<template>
  <div class="ol-wrap ol-page ol-contacts">
    <nav class="ol-crumbs" aria-label="Навигация">
      <NuxtLink :to="olPath('/')">Главная</NuxtLink>
      <span>Контакты</span>
    </nav>
    <h1 class="ol-title">Контакты</h1>
    <div class="ol-contacts__grid">
      <div class="ol-contacts__info">
        <div class="ol-contacts__block">
          <h2>Телефоны</h2>
          <a v-for="ph in olContacts.phones" :key="ph.href" :href="ph.href" class="ol-contacts__phone">{{ ph.text }}<small>{{ ph.what }}</small></a>
        </div>
        <div class="ol-contacts__block">
          <h2>Почта и мессенджеры</h2>
          <a :href="`mailto:${olContacts.mail}`" class="ol-contacts__mail">{{ olContacts.mail }}</a>
          <div class="ol-contacts__soc">
            <a :href="olContacts.tg" target="_blank" rel="noopener" class="ol-btn ol-btn--line">Telegram</a>
            <a :href="olContacts.vk" target="_blank" rel="noopener" class="ol-btn ol-btn--line">ВКонтакте</a>
            <button type="button" class="ol-btn ol-btn--line" @click="ui.open('chat')"><OlIcon name="chat" />Чат на сайте</button>
          </div>
        </div>
        <div class="ol-contacts__block">
          <h2>Магазин и самовывоз</h2>
          <p><OlIcon name="pin" />{{ olContacts.address }}, {{ olContacts.metro }}</p>
          <p><OlIcon name="clock" />{{ olContacts.hours }} · {{ olContacts.orders }}</p>
          <button type="button" class="ol-btn ol-btn--acc" @click="ui.open('callback')">Заказать звонок</button>
        </div>
        <div class="ol-contacts__block ol-contacts__legal">
          <h2>Реквизиты</h2>
          <p>{{ olContacts.legal }}</p>
          <p>Юридический адрес: {{ olContacts.legalAddress }}</p>
        </div>
      </div>
      <div class="ol-map">
        <div class="ol-map__frame">
          <span class="ol-map__pin"><OlIcon name="pin" />Никулинская, 33, стр. 1</span>
          <iframe src="https://yandex.ru/map-widget/v1/?text=Москва%2C%20Никулинская%20улица%2C%2033с1&z=16" title="Карта: Москва, Никулинская, 33, стр. 1" loading="lazy" />
        </div>
        <a :href="olContacts.map" target="_blank" rel="noopener" class="ol-link">Открыть в Яндекс Картах<OlIcon name="right" /></a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ol .ol-contacts {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    gap: 32px;
    align-items: start;
    margin-top: 18px;
  }
  &__info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  &__block {
    display: grid;
    gap: 8px;
    align-content: start;
    justify-items: start;
    padding: 22px;
    border-radius: var(--ol-R);
    background: var(--ol-surf);
    h2 {
      font-size: 17px;
      margin-bottom: 4px;
    }
    p {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      .ol-icon {
        color: var(--ol-acc);
        margin-top: 2px;
      }
    }
  }
  &__phone {
    display: grid;
    font-size: 18px;
    font-weight: 700;
    color: var(--ol-ink);
    small {
      font-size: 12.5px;
      font-weight: 500;
      color: var(--ol-mute);
    }
    &:hover {
      color: var(--ol-acc);
    }
  }
  &__mail {
    font-weight: 700;
    color: var(--ol-ink);
  }
  &__soc {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
    .ol-btn {
      min-height: 38px;
      padding: 0 12px;
      font-size: 14px;
    }
  }
  &__legal {
    grid-column: 1 / -1;
    font-size: 14px;
    color: var(--ol-mute);
  }
}
.ol .ol-map {
  display: grid;
  gap: 10px;
  justify-items: start;
  &__frame {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 20px;
    overflow: hidden;
    background: var(--ol-surf) radial-gradient(circle at 50% 50%, #e3e9f1 0 30%, transparent 31%);
    iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
  &__pin {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 10px;
    background: #fff;
    font-weight: 700;
    color: var(--ol-ink);
    white-space: nowrap;
    .ol-icon {
      color: var(--ol-acc);
    }
  }
}
@media (max-width: 1199px) {
  .ol .ol-contacts__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 576px) {
  .ol .ol-contacts__info {
    grid-template-columns: minmax(0, 1fr);
  }
  .ol .ol-contacts__block {
    padding: 18px;
  }
}
</style>
