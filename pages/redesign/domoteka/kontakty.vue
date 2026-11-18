<script lang="ts" setup>
import { dmContacts, dmMessengers, dmPath } from '~/utils/domoteka'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'
import DmAskForm from '~/components/redesign/domoteka/DmAskForm.vue'

useSeoMeta({ title: 'Контакты фабрики «Домотека» | Концепт редизайна' })
const [lat, lon] = dmContacts.geo
const mapSrc = `https://yandex.ru/map-widget/v1/?ll=${lon},${lat}&z=13&pt=${lon},${lat},pm2orm`
const copied = ref(false)
const copyReq = async () => {
  try {
    await navigator.clipboard.writeText(dmContacts.requisites.map(([k, v]) => `${k}: ${v}`).join('\n'))
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {}
}
</script>

<template>
  <div class="dm-wrap dm-contacts">
    <div class="dm-page-head">
      <nav class="dm-crumbs" aria-label="Навигация"><NuxtLink :to="dmPath('/')">Главная</NuxtLink><span>Контакты</span></nav>
      <h1 class="dm-h1">Контакты</h1>
      <p class="dm-lead">Для юридических лиц: оптовые закупки, дилерство, рекламации. Покупателям в розницу — <NuxtLink :to="dmPath('/gde-kupit/')">магазины и интернет-магазины</NuxtLink>.</p>
    </div>

    <section class="dm-sec dm-contacts__grid">
      <div class="dm-contacts__main">
        <div class="dm-contacts__card">
          <small>Телефон</small>
          <a :href="`tel:${dmContacts.tel}`" class="dm-contacts__phone">{{ dmContacts.phone }}</a>
          <span>{{ dmContacts.claimNote }}</span>
        </div>
        <div class="dm-contacts__card">
          <small>Режим работы</small>
          <b>{{ dmContacts.hours }}</b>
          <span>кроме праздничных дней</span>
        </div>
        <div class="dm-contacts__card dm-contacts__wide">
          <small>Адрес</small>
          <b>{{ dmContacts.address }}</b>
          <span>{{ dmContacts.addressNote }}</span>
        </div>
        <div class="dm-contacts__card dm-contacts__wide">
          <small>Почта по отделам</small>
          <ul class="dm-contacts__mails">
            <li v-for="e in dmContacts.emails" :key="e.mail"><span>{{ e.label }}</span><a :href="`mailto:${e.mail}`">{{ e.mail }}</a></li>
          </ul>
        </div>
        <div class="dm-contacts__card dm-contacts__wide">
          <small>Мессенджеры и соцсети</small>
          <div class="dm-contacts__msgs">
            <a v-for="m in dmMessengers" :key="m.id" :href="m.url" target="_blank" rel="noopener" class="dm-chip">{{ m.n }}</a>
          </div>
        </div>
      </div>
      <div class="dm-map dm-contacts__map">
        <iframe :src="mapSrc" title="Фабрика «Домотека» на карте" loading="lazy" />
        <a class="dm-map__fallback" :href="`https://yandex.ru/maps/?ll=${lon},${lat}&z=14&pt=${lon},${lat}`" target="_blank" rel="noopener"><DmIcon name="pin" />Открыть в Яндекс Картах</a>
      </div>
    </section>

    <section class="dm-sec dm-contacts__bottom">
      <div class="dm-contacts__req">
        <h2 class="dm-h2">Реквизиты</h2>
        <dl>
          <template v-for="[k, v] in dmContacts.requisites" :key="k"><dt>{{ k }}</dt><dd>{{ v }}</dd></template>
        </dl>
        <button type="button" class="dm-btn dm-btn--line" @click="copyReq"><DmIcon :name="copied ? 'check' : 'copy'" />{{ copied ? 'Скопировано' : 'Скопировать реквизиты' }}</button>
      </div>
      <div class="dm-contacts__form">
        <h2 class="dm-h2">Форма обратной связи</h2>
        <DmAskForm kind="feedback" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.dm .dm-contacts {
  .dm-lead a {
    color: var(--dm-acc);
  }
  .dm-contacts__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 16px;
    padding-top: 28px;
  }
  .dm-contacts__main {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    align-content: start;
  }
  .dm-contacts__card {
    display: grid;
    align-content: start;
    gap: 4px;
    padding: 18px 20px;
    border-radius: var(--dm-r2);
    background: var(--dm-surf);
    small {
      font-size: 13px;
      color: var(--dm-muted);
    }
    b {
      font-size: 16px;
    }
    > span {
      font-size: 14px;
      color: var(--dm-muted);
    }
  }
  .dm-contacts__wide {
    grid-column: 1 / -1;
  }
  .dm-contacts__phone {
    font: 800 24px/1.15 var(--dm-head);
    font-stretch: 112%;
    text-decoration: none;
  }
  ul.dm-contacts__mails {
    display: grid;
    gap: 6px;
    margin-top: 4px;
    li {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 2px 12px;
    }
    span {
      color: var(--dm-muted);
    }
    a {
      color: var(--dm-acc);
      font-weight: 500;
    }
  }
  .dm-contacts__msgs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
  }
  .dm-contacts__map {
    min-height: 100%;
  }
  .dm-contacts__bottom {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 32px 48px;
  }
  .dm-contacts__req {
    display: grid;
    align-content: start;
    gap: 18px;
    dl {
      display: grid;
      grid-template-columns: 140px minmax(0, 1fr);
      margin: 0;
    }
    dt,
    dd {
      margin: 0;
      padding: 9px 0;
      border-bottom: 1px solid var(--dm-line);
    }
    dt {
      color: var(--dm-muted);
    }
    .dm-btn {
      justify-self: start;
    }
  }
  .dm-contacts__form {
    display: grid;
    align-content: start;
    gap: 18px;
    padding: 28px;
    border-radius: 20px;
    background: var(--dm-surf);
    .dm-field input,
    .dm-field textarea {
      background: #fff;
    }
  }
}
@media (max-width: 989px) {
  .dm .dm-contacts {
    .dm-contacts__grid,
    .dm-contacts__bottom {
      grid-template-columns: minmax(0, 1fr);
    }
    .dm-contacts__map {
      min-height: 340px;
    }
  }
}
@media (max-width: 576px) {
  .dm .dm-contacts {
    .dm-contacts__main {
      grid-template-columns: minmax(0, 1fr);
    }
    .dm-contacts__form {
      padding: 20px 16px;
    }
    .dm-contacts__req dl {
      grid-template-columns: 110px minmax(0, 1fr);
    }
  }
}
</style>
