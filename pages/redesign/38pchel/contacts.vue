<script lang="ts" setup>
import PcIcon from '~/components/redesign/38pchel/PcIcon.vue'

const ui = usePchelUi()
useSeoMeta({ title: 'Контакты — 38пчёл | Концепт редизайна' })

const form = reactive({ name: '', email: '', text: '', error: '', sent: false })
const send = () => {
  if (!form.name.trim() || !/.+@.+\..+/.test(form.email) || form.text.trim().length < 10)
    return (form.error = 'Заполните имя, e-mail и сообщение')
  form.error = ''
  form.sent = true
  ui.say('Это демо: сообщение никуда не отправлено')
}
</script>

<template>
  <div class="pc-wrap pc-contacts">
    <nav class="pc-crumbs" aria-label="Навигация">
      <NuxtLink :to="pcPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Контакты</span>
    </nav>
    <h1 class="pc-title">Контакты</h1>

    <div class="pc-contacts__grid">
      <div class="pc-contacts__cards">
        <a :href="pcContacts.phoneHref" class="pc-contacts__card">
          <PcIcon name="phone" />
          <span>Телефон · {{ pcContacts.phoneName }}</span>
          <b>{{ pcContacts.phone }}</b>
        </a>
        <a :href="pcContacts.phone2Href" class="pc-contacts__card">
          <PcIcon name="phone" />
          <span>Второй телефон</span>
          <b>{{ pcContacts.phone2 }}</b>
        </a>
        <a :href="`mailto:${pcContacts.email}`" class="pc-contacts__card">
          <PcIcon name="mail" />
          <span>Почта — для вопросов, замечаний и предложений</span>
          <b>{{ pcContacts.email }}</b>
        </a>
        <div class="pc-contacts__card">
          <PcIcon name="clock" />
          <span>Принимаем заказы</span>
          <b>{{ pcContacts.hours }}, без выходных</b>
        </div>
        <div class="pc-contacts__card">
          <PcIcon name="pin" />
          <span>Самовывоз по договорённости</span>
          <b>{{ pcContacts.pickup }}</b>
        </div>
        <div class="pc-contacts__card">
          <PcIcon name="hive" />
          <span>Пасека</span>
          <b>{{ pcContacts.apiary }}</b>
        </div>
        <div class="pc-contacts__social">
          <a :href="pcContacts.vk" target="_blank" rel="noopener" class="pc-btn pc-btn--line"><PcIcon name="vk" /> ВКонтакте</a>
          <a :href="pcContacts.youtube" target="_blank" rel="noopener" class="pc-btn pc-btn--line"><PcIcon name="youtube" /> YouTube</a>
        </div>
      </div>

      <form class="pc-panel pc-contacts__form" @submit.prevent="send">
        <h2>Напишите нам</h2>
        <template v-if="!form.sent">
          <label class="pc-field"><span>Имя</span><input v-model="form.name" type="text" autocomplete="name" /></label>
          <label class="pc-field"><span>E-mail</span><input v-model="form.email" type="email" autocomplete="email" /></label>
          <label class="pc-field"><span>Сообщение</span><textarea v-model="form.text" /></label>
          <p v-if="form.error" class="pc-modal__error">{{ form.error }}</p>
          <button type="submit" class="pc-btn pc-btn--dark pc-btn--wide">Отправить</button>
        </template>
        <p v-else class="pc-contacts__sent"><PcIcon name="check" /> Сообщение принято. На сайте ответ придёт на {{ form.email }}.</p>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.pc-contacts {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    gap: 24px;
    align-items: start;
    margin-top: 24px;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 20px;
    border-radius: var(--pc-r-card);
    box-shadow: inset 0 0 0 1px var(--pc-line);

    svg {
      margin-bottom: 8px;
      color: var(--pc-accent);
    }

    span {
      color: var(--pc-muted);
      font-size: 14px;
    }

    b {
      font-size: 18px;
      overflow-wrap: anywhere;
    }
  }

  a.pc-contacts__card:hover {
    box-shadow: inset 0 0 0 1px var(--pc-ink);
  }

  &__social {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    grid-column: 1 / -1;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 12px;

    h2 {
      font-size: 26px;
    }
  }

  &__sent {
    display: flex;
    gap: 8px;
    color: var(--pc-ok);
    font-weight: 500;
  }

  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 576px) {
    &__cards {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
