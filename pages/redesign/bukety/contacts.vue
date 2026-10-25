<script lang="ts" setup>
import BkIcon from '~/components/redesign/bukety/BkIcon.vue'

useSeoMeta({ title: 'Контакты — Любимые Букеты | Концепт редизайна' })

const ui = useBuketyUi()
const msg = reactive({ name: '', email: '', text: '' })
const send = () => {
  if (!msg.name.trim() || !/.+@.+\..+/.test(msg.email) || msg.text.trim().length < 5) return ui.say('Заполните имя, e-mail и сообщение')
  msg.text = ''
  ui.say('Это демо: сообщение никуда не отправлено')
}
</script>

<template>
  <div class="bk-wrap bk-info">
    <nav class="bk-crumbs">
      <NuxtLink :to="bkPath()">Главная</NuxtLink>
      <span>Контакты</span>
    </nav>
    <h1>Контакты</h1>
    <p class="bk-info__lead">Принимаем заказы и отвечаем {{ bkContacts.hours }}.</p>

    <div class="bk-info__grid">
      <section class="bk-info__block bk-contacts">
        <a :href="bkContacts.phoneHref" class="bk-contacts__phone">{{ bkContacts.phone }}</a>
        <p>Заказы, WhatsApp, круглосуточно</p>
        <a :href="bkContacts.phone2Href" class="bk-contacts__line"><BkIcon name="phone" /> {{ bkContacts.phone2 }} <small>оплата и работа сайта</small></a>
        <a :href="`mailto:${bkContacts.email}`" class="bk-contacts__line"><BkIcon name="mail" /> {{ bkContacts.email }}</a>
        <p class="bk-contacts__line"><BkIcon name="pin" /> Самовывоз круглосуточно — адрес подскажем по телефону</p>
        <div class="bk-contacts__msg">
          <a :href="bkContacts.whatsapp" target="_blank" rel="noopener" class="bk-btn bk-btn--accent">WhatsApp</a>
          <a :href="bkContacts.telegram" target="_blank" rel="noopener" class="bk-btn bk-btn--line">Telegram</a>
          <a :href="bkContacts.vk" target="_blank" rel="noopener" class="bk-btn bk-btn--line">ВКонтакте</a>
        </div>
      </section>

      <form class="bk-info__block" @submit.prevent="send">
        <h2><BkIcon name="chat" /> Написать нам</h2>
        <label class="bk-field"><span>Имя</span><input v-model="msg.name" type="text" autocomplete="name" /></label>
        <label class="bk-field"><span>E-mail</span><input v-model="msg.email" type="email" autocomplete="email" /></label>
        <label class="bk-field"><span>Сообщение</span><textarea v-model="msg.text" rows="4" /></label>
        <button type="submit" class="bk-btn bk-btn--accent">Отправить</button>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.bk-contacts {
  &__phone {
    font-size: clamp(28px, 3vw, 38px);
    font-weight: 800;
    white-space: nowrap;

    &:hover {
      color: var(--bk-accent);
    }
  }

  > p:first-of-type {
    margin-top: -8px !important;
    color: var(--bk-muted);
  }

  &__line {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px 10px;
    font-weight: 600;

    svg {
      flex: none;
      color: var(--bk-accent);
    }

    small {
      color: var(--bk-muted);
      font-weight: 500;
    }
  }

  &__msg {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }
}

.bk-info form.bk-info__block > .bk-btn {
  justify-self: start;
}

@media (max-width: 375px) {
  .bk-contacts__phone {
    font-size: 26px;
  }
}
</style>
