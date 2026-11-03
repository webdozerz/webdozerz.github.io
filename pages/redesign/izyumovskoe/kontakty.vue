<script lang="ts" setup>
// «Контакты» и «Напишите нам» оригинала: телефоны, почта, часы, адрес, карта и форма (имя, телефон*, e-mail*, сообщение).
// ?about=<товар> подставляет вопрос о товаре — из кнопки «Спросить о поступлении».
import IzIcon from '~/components/redesign/izyumovskoe/IzIcon.vue'
import IzPhone from '~/components/redesign/izyumovskoe/IzPhone.vue'

useSeoMeta({ title: 'Контакты — Изюмовское | Концепт редизайна' })

const route = useRoute()
const msg = reactive({ name: '', phone: '', email: '', text: '', sent: false })
watch(
  () => route.query.about,
  (v) => {
    if (v) msg.text = `Здравствуйте! Когда появится «${v}»?`
  },
  { immediate: true },
)
const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`
const map = 'https://yandex.ru/map-widget/v1/?um=constructor%3A3d9541523b562f0edc51525a0dffcd285316cafda963689b088da3a2c6219d4d&source=constructor'
</script>

<template>
  <div class="iz-wrap">
    <nav class="iz-crumbs" aria-label="Путь">
      <NuxtLink :to="izPath()">Главная</NuxtLink>
      <span>Контакты</span>
    </nav>
    <h1 class="iz-page-title">Контакты</h1>

    <section class="iz-contacts">
      <div class="iz-contacts__cards">
        <div class="iz-contacts__card">
          <IzIcon name="phone" />
          <span>Телефоны</span>
          <a v-for="p in izContacts.phones" :key="p" :href="tel(p)">{{ p }}</a>
        </div>
        <div class="iz-contacts__card">
          <IzIcon name="clock" />
          <span>Принимаем звонки</span>
          <b>{{ izContacts.hours }}</b>
          <small>{{ izContacts.tz }}</small>
        </div>
        <div class="iz-contacts__card">
          <IzIcon name="mail" />
          <span>Почта</span>
          <a :href="`mailto:${izContacts.email}`">{{ izContacts.email }}</a>
        </div>
        <div class="iz-contacts__card">
          <IzIcon name="pin" />
          <span>Ферма и самовывоз</span>
          <b>{{ izContacts.address }}</b>
        </div>
      </div>
      <div class="iz-map">
        <span class="iz-map__pin"><IzIcon name="pin" :size="28" />д. Гауф, ул. Промзона, стр. 1</span>
        <iframe :src="map" title="Ферма на карте" loading="lazy" />
        <a :href="map.replace('map-widget/v1/', 'maps/')" target="_blank" rel="noopener" class="iz-map__link">Открыть в Яндекс Картах</a>
      </div>
    </section>

    <section id="napishite" class="iz-sec">
      <div class="iz-write">
        <div class="iz-write__text">
          <h2>Напишите нам</h2>
          <p>Спросите о поступлении молодняка, весе тушек или цене говядины — ответим на почту или перезвоним.</p>
        </div>
        <p v-if="msg.sent" class="iz-note iz-note--ok">Спасибо! Сообщение в концепте никуда не отправлено — на настоящем сайте оно придёт на {{ izContacts.email }}.</p>
        <form v-else class="iz-form iz-write__form" @submit.prevent="msg.sent = true">
          <label>Имя<input v-model="msg.name" autocomplete="off" /></label>
          <label>Телефон *<IzPhone v-model="msg.phone" /></label>
          <label class="iz-write__wide">E-mail *<input v-model="msg.email" type="email" required autocomplete="off" /></label>
          <label class="iz-write__wide">Сообщение<textarea v-model="msg.text" /></label>
          <label class="iz-check iz-write__wide"><input type="checkbox" required checked /><span>Согласен на обработку персональных данных</span></label>
          <button type="submit" class="iz-btn iz-btn--main">Отправить</button>
        </form>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.iz-contacts {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 22px;
  margin-top: 24px;

  &__cards {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px;
  }
  &__card {
    display: grid;
    align-content: start;
    gap: 4px;
    padding: 20px;
    border-radius: var(--iz-R);
    background: var(--iz-surface);

    .iz-icon {
      margin-bottom: 6px;
      color: var(--iz-ink-accent);
    }
    span {
      color: var(--iz-muted);
      font-size: 14px;
    }
    a,
    b {
      font-weight: 700;
      color: var(--iz-dark);
      overflow-wrap: anywhere;
    }
    a[href^='tel'] {
      white-space: nowrap;
      overflow-wrap: normal;
    }
    small {
      color: var(--iz-muted);
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
  @media (max-width: 375px) {
    &__cards {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
.iz-write {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  gap: 32px;
  padding: 32px;
  border-radius: var(--iz-R);
  border: 1px solid var(--iz-line);

  &__text {
    display: grid;
    align-content: start;
    gap: 10px;

    h2 {
      font-size: clamp(24px, 2.6vw, 32px);
    }
  }
  &__form {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

    .iz-btn {
      justify-self: start;
    }
  }
  &__wide {
    grid-column: 1 / -1;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
  @media (max-width: 576px) {
    padding: 22px 16px;

    &__form {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
