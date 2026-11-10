<script lang="ts" setup>
import { apContacts, apPath } from '~/utils/apeti'
import { useApUi } from '~/composables/useApeti'
import ApIcon from '~/components/redesign/apeti/ApIcon.vue'

const ui = useApUi()
useSeoMeta({ title: 'Контакты — Apeti, концепт редизайна' })
</script>

<template>
  <div class="ap-wrap ap-page">
    <nav class="ap-crumbs" aria-label="Хлебные крошки"><NuxtLink :to="apPath('/')">Главная</NuxtLink><span>Контакты</span></nav>
    <div class="ap-head ap-cont__head"><h1>Контакты</h1></div>

    <div class="ap-cont">
      <div class="ap-cont__main">
        <div class="ap-panel ap-cont__phones">
          <a :href="apContacts.phoneHref"><ApIcon name="phone" /><b>{{ apContacts.phone }}</b></a>
          <a :href="apContacts.phone2Href"><ApIcon name="phone" /><b>{{ apContacts.phone2 }}</b></a>
          <p>Будние и выходные дни: 8:00–20:00. Доставка — с 9:00 до 22:00.</p>
          <button type="button" class="ap-btn" @click="ui.open('callback')">Заказать звонок</button>
        </div>
        <ul class="ap-cont__mails">
          <li v-for="m in apContacts.emails" :key="m.mail">
            <ApIcon name="mail" />
            <div><span>{{ m.what }}</span><a :href="`mailto:${m.mail}`">{{ m.mail }}</a></div>
          </li>
        </ul>
        <div class="ap-cont__soc">
          <b>Мы в мессенджерах и соцсетях</b>
          <div class="ap-chips"><a v-for="s in apContacts.social" :key="s.name" :href="s.href" target="_blank" rel="noopener">{{ s.name }}</a></div>
        </div>
      </div>

      <div class="ap-cont__place">
        <div class="ap-cont__map">
          <ApIcon name="pin" />
          <b>{{ apContacts.place }}</b>
          <p>{{ apContacts.address }}</p>
          <a :href="apContacts.map" target="_blank" rel="noopener" class="ap-btn ap-btn--line">Открыть в Яндекс Картах</a>
        </div>
        <p>Самовывоз заказов — здесь же, на рынке: заказ может быть на любую сумму.</p>
        <dl class="ap-cont__legal">
          <div><dt>Организация</dt><dd>{{ apContacts.legal }}</dd></div>
          <div><dt>Юридический адрес</dt><dd>{{ apContacts.legalAddress }}</dd></div>
        </dl>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ap .ap-cont__head { margin-top: 12px; }
.ap .ap-cont { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; align-items: start;
  &__main, &__place { display: grid; gap: 20px; min-width: 0; }
  &__phones { display: grid; gap: 12px; justify-items: start;
    a { display: flex; align-items: center; gap: 10px; .ap-icon { color: var(--ap-acc); } b { font-family: var(--ap-head); font-size: 28px; font-weight: 600; white-space: nowrap; } }
    p { color: var(--ap-mute); }
  }
  &__soc { display: grid; gap: 10px; }
  &__map { display: grid; gap: 8px; justify-items: start; align-content: center; min-height: 260px; padding: 28px; border-radius: var(--ap-R); box-sizing: border-box;
    background: var(--ap-soft) repeating-linear-gradient(45deg, transparent 0 22px, rgba(255, 255, 255, .5) 22px 24px);
    .ap-icon { width: 34px; height: 34px; color: var(--ap-acc); }
    b { font-family: var(--ap-head); font-size: 26px; font-weight: 600; }
    .ap-btn { margin-top: 8px; }
  }
  &__place > p { color: var(--ap-mute); }
}
.ap ul.ap-cont__mails { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 0; padding: 0;
  li { display: flex; gap: 12px; align-items: flex-start; padding: 16px; border: 1px solid var(--ap-line); border-radius: var(--ap-R); min-width: 0; }
  .ap-icon { color: var(--ap-acc); }
  div { display: grid; gap: 2px; min-width: 0; }
  span { font-size: 13px; color: var(--ap-mute); line-height: 1.3; }
  a { font-weight: 600; overflow-wrap: anywhere; &:hover { color: var(--ap-acc); } }
}
.ap dl.ap-cont__legal { display: grid; gap: 10px; margin: 0; font-size: 14px;
  div { display: grid; gap: 2px; }
  dt { color: var(--ap-mute); font-size: 13px; }
  dd { margin: 0; }
}
@media (max-width: 989px) { .ap .ap-cont { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 576px) {
  .ap ul.ap-cont__mails { grid-template-columns: minmax(0, 1fr); }
  .ap .ap-cont__phones a b { font-size: 24px; }
  .ap .ap-cont__map { min-height: 200px; padding: 20px; }
}
</style>
