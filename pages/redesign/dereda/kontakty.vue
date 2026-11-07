<script lang="ts" setup>
import DrIcon from '~/components/redesign/dereda/DrIcon.vue'
import DrPhone from '~/components/redesign/dereda/DrPhone.vue'

useSeoMeta({ title: 'Контакты — Дереда | Концепт редизайна' })
const fb = reactive({ name: '', phone: '', email: '', text: '', agree: false, sent: false })
const ok = computed(() => !!fb.name.trim() && fb.email.includes('@') && fb.agree)
const send = () => {
  if (ok.value) fb.sent = true
}
</script>

<template>
  <div class="dr-wrap dr-page dr-cont">
    <nav class="dr-crumbs" aria-label="Навигация">
      <NuxtLink :to="drPath('/')">Главная</NuxtLink>
      <span>Контакты</span>
    </nav>
    <h1>Контакты</h1>

    <div class="dr-cont__grid">
      <div class="dr-cont__cards">
        <a :href="drContacts.tel" class="dr-cont__card">
          <DrIcon name="phone" :size="26" />
          <span><small>Телефон, пн–пт 9:00–18:00</small><b>{{ drContacts.phone }}</b></span>
        </a>
        <a :href="`mailto:${drContacts.email}`" class="dr-cont__card">
          <DrIcon name="mail" :size="26" />
          <span><small>Почта</small><b>{{ drContacts.email }}</b></span>
        </a>
        <div class="dr-cont__card">
          <DrIcon name="truck" :size="26" />
          <span><small>Доставка</small><b>вторник и пятница, 10:00–20:00</b></span>
        </div>
        <div class="dr-cont__card dr-cont__card--map">
          <DrIcon name="pin" :size="26" />
          <span>
            <small>Самовывоз, пн–пт 9:00–18:00</small>
            <b>{{ drContacts.address }}</b>
            <span class="dr-cont__maps">
              <a :href="drContacts.twogis" target="_blank" rel="noopener">2ГИС<DrIcon name="ext" :size="15" /></a>
              <a :href="drContacts.yandex" target="_blank" rel="noopener">Яндекс Карты<DrIcon name="ext" :size="15" /></a>
            </span>
          </span>
        </div>
        <div class="dr-cont__msg">
          <b>Мессенджеры и соцсети</b>
          <div>
            <a :href="drContacts.whatsapp" target="_blank" rel="noopener"><DrIcon name="whatsapp" :size="20" />WhatsApp</a>
            <a :href="drContacts.telegram" target="_blank" rel="noopener"><DrIcon name="telegram" :size="20" />Telegram</a>
            <a :href="drContacts.bot" target="_blank" rel="noopener"><DrIcon name="telegram" :size="20" />Бот @Dereda_bot</a>
            <a :href="drContacts.vk" target="_blank" rel="noopener"><DrIcon name="vk" :size="20" />ВКонтакте</a>
            <a :href="drContacts.ok" target="_blank" rel="noopener"><DrIcon name="ok" :size="20" />Одноклассники</a>
            <a :href="drContacts.whatsappGroup" target="_blank" rel="noopener"><DrIcon name="whatsapp" :size="20" />Группа в WhatsApp</a>
          </div>
        </div>
      </div>

      <section class="dr-cont__form">
        <h2>Обратная связь</h2>
        <form v-if="!fb.sent" class="dr-form" @submit.prevent="send">
          <label class="dr-field"><span>Имя *</span><input v-model="fb.name" autocomplete="name" required /></label>
          <div class="dr-cont__row">
            <label class="dr-field"><span>Телефон</span><DrPhone v-model="fb.phone" /></label>
            <label class="dr-field"><span>Почта *</span><input v-model="fb.email" type="email" autocomplete="email" required /></label>
          </div>
          <label class="dr-field"><span>Вопрос</span><textarea v-model="fb.text" rows="4" /></label>
          <label class="dr-check"><input v-model="fb.agree" type="checkbox" /><span>Согласен с условиями оферты и политики конфиденциальности</span></label>
          <button type="submit" class="dr-btn dr-btn--main" :disabled="!ok">Отправить</button>
        </form>
        <div v-else class="dr-done">
          <DrIcon name="check" :size="36" />
          <h3>Сообщение отправлено</h3>
          <p class="dr-muted">Это демо: в концепте сообщение никуда не уходит.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.dr-cont {
  h1 {
    margin-bottom: 22px;
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 32px;
    align-items: start;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__cards {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px;

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__card {
    display: grid;
    grid-template-columns: 26px minmax(0, 1fr);
    gap: 14px;
    padding: 20px;
    border-radius: var(--dr-R);
    background: var(--dr-surface);

    > svg {
      color: var(--dr-brown);
    }

    > span {
      display: grid;
      gap: 2px;
    }

    small {
      color: var(--dr-muted);
    }

    b {
      font-size: 18px;
      overflow-wrap: anywhere;
    }

    &--map {
      grid-column: 1 / -1;
    }
  }

  &__maps {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    margin-top: 6px;

    a {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: var(--dr-accent);
      font-weight: 600;
    }
  }

  &__msg {
    grid-column: 1 / -1;
    display: grid;
    gap: 10px;
    padding: 20px;
    border: 1px solid var(--dr-line);
    border-radius: var(--dr-R);

    div {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 20px;
    }

    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--dr-green);
      font-weight: 600;
    }
  }

  &__form {
    display: grid;
    gap: 16px;
    padding: 28px;
    border: 1px solid var(--dr-line);
    border-radius: var(--dr-R);

    .dr-form .dr-btn {
      justify-self: start;
    }

    @media (max-width: 576px) {
      padding: 22px 18px;
    }
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
