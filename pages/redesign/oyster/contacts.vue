<script lang="ts" setup>
import { oyContacts, oyPath } from '~/utils/oyster'
import { useOyUi } from '~/composables/useOyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'

useSeoMeta({ title: 'Контакты — Oyster Market | Концепт редизайна' })
const ui = useOyUi()
</script>

<template>
  <div class="oy-wrap oy-page">
    <nav class="oy-crumbs" aria-label="Навигация">
      <NuxtLink :to="oyPath('/')">Главная</NuxtLink>
      <span>Контакты</span>
    </nav>
    <h1 class="oy-title">Контакты</h1>
    <div class="oy-contacts">
      <div class="oy-contacts__info">
        <div class="oy-contacts__row">
          <OyIcon name="phone" :size="24" />
          <div>
            <a :href="oyContacts.phoneHref" class="oy-contacts__big">{{ oyContacts.phone }}</a>
            <a :href="oyContacts.phoneCityHref">{{ oyContacts.phoneCity }}</a>
            <span>Опт и выездной бар: <a :href="oyContacts.phoneOptHref">{{ oyContacts.phoneOpt }}</a></span>
          </div>
        </div>
        <div class="oy-contacts__row">
          <OyIcon name="mail" :size="24" />
          <div><a :href="`mailto:${oyContacts.email}`" class="oy-contacts__mid">{{ oyContacts.email }}</a></div>
        </div>
        <div class="oy-contacts__row">
          <OyIcon name="pin" :size="24" />
          <div>
            <b class="oy-contacts__mid">{{ oyContacts.address }}</b>
            <span>{{ oyContacts.addressNote }}</span>
          </div>
        </div>
        <div class="oy-contacts__row">
          <OyIcon name="clock" :size="24" />
          <div>
            <b>{{ oyContacts.hours }}</b>
            <span>{{ oyContacts.orders }} · доставка день в день с 12 до 21 · сборка самовывоза от 20 минут до часа</span>
          </div>
        </div>
        <div class="oy-contacts__msg">
          <a :href="oyContacts.telegram" target="_blank" rel="noopener" class="oy-btn oy-btn--soft">Telegram</a>
          <a :href="oyContacts.max" target="_blank" rel="noopener" class="oy-btn oy-btn--soft">MAX</a>
          <a :href="oyContacts.wechat" target="_blank" rel="noopener" class="oy-btn oy-btn--soft">WeChat</a>
          <button type="button" class="oy-btn oy-btn--accent" @click="ui.open('callback')">Заказать звонок</button>
          <button type="button" class="oy-btn oy-btn--line" @click="ui.open('question')">Задать вопрос</button>
        </div>
      </div>
      <div class="oy-map">
        <div class="oy-map__stub">
          <OyIcon name="pin" :size="36" />
          <b>Михайловский проезд, 3</b>
          <span>Метро Волгоградский проспект, Пролетарская, Крестьянская Застава</span>
        </div>
        <iframe
          src="https://yandex.ru/map-widget/v1/org/oyster_market/12793276548/?ll=37.7076%2C55.7233&z=15"
          title="Oyster Market на карте"
          loading="lazy"
          allowfullscreen
        />
        <a :href="oyContacts.map" target="_blank" rel="noopener" class="oy-map__link">Открыть в Яндекс Картах <OyIcon name="ext" :size="16" /></a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.oy-contacts {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 32px; align-items: stretch; margin-top: 16px;
  &__info { display: grid; gap: 22px; align-content: start; }
  &__row { display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 14px; color: var(--oy-accent); > div { display: grid; gap: 4px; color: var(--oy-text); } span { color: var(--oy-muted); font-size: 14px; } a:hover { color: var(--oy-accent); } }
  &__big { font-size: 26px; font-weight: 700; color: var(--oy-ink); }
  &__mid { font-size: 18px; font-weight: 700; color: var(--oy-ink); }
  &__msg { display: flex; flex-wrap: wrap; gap: 8px; }
  @media (max-width: 989px) { grid-template-columns: minmax(0, 1fr); }
}
.oy-map {
  position: relative; min-height: 440px; border-radius: 20px; overflow: hidden; background: var(--oy-surface);
  &__stub { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 6px; padding: 24px; text-align: center; color: var(--oy-accent); b { color: var(--oy-ink); font-size: 18px; } span { color: var(--oy-muted); font-size: 14px; max-width: 320px; } }
  iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
  &__link { position: absolute; left: 12px; bottom: 12px; display: inline-flex; gap: 6px; align-items: center; padding: 10px 14px; border-radius: 10px; background: #fff; font-weight: 600; font-size: 14px; color: var(--oy-ink); box-shadow: 0 4px 14px rgba(0, 0, 0, .15); &:hover { color: var(--oy-accent); } }
  @media (max-width: 576px) { min-height: 340px; }
}
</style>
