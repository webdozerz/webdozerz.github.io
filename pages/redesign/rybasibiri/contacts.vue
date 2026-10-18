<script lang="ts" setup>
const form = reactive({ name: '', email: '', topic: '', message: '' })
const sent = ref(false)

const mapHref = `https://yandex.ru/maps/?text=${encodeURIComponent(`Кемерово, Невьянская улица, 1В`)}`

useSeoMeta({
  title: 'Контакты | «Стиль Продукт», концепт',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="rs-wrap rsn">
    <div class="rs-page-head">
      <nav class="rs-crumbs" aria-label="Навигация">
        <NuxtLink :to="rsPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>Контакты</span>
      </nav>
      <h1>Контакты</h1>
      <p>Производственно-торговая компания «Стиль Продукт». Объёмы, условия поставки и оплаты обсудим любым удобным способом.</p>
    </div>

    <div class="rsn-grid">
      <div class="rs-panel rsn-card">
        <h2>Офис и производство</h2>
        <p class="rsn-addr">{{ rsContacts.address }}<br /><span class="rs-muted">{{ rsContacts.zip }}, Россия</span></p>
        <a :href="mapHref" target="_blank" rel="noopener" class="rs-link">Открыть на карте</a>
      </div>

      <div class="rs-panel rsn-card">
        <h2>Телефоны</h2>
        <div class="rsn-phones">
          <a v-for="p in rsContacts.phones" :key="p.href" :href="p.href">{{ p.label }}</a>
        </div>
        <span class="rs-muted">Факс {{ rsContacts.fax }}</span>
      </div>

      <div class="rs-panel rsn-card">
        <h2>Почта и соцсети</h2>
        <a :href="`mailto:${rsContacts.email}`" class="rsn-big">{{ rsContacts.email }}</a>
        <p class="rs-muted">
          Заказы принимаем и в сообществе ВКонтакте — там же новости об акциях и рецепты.
        </p>
        <a :href="rsContacts.vk" target="_blank" rel="noopener" class="rs-btn rs-btn--soft">Написать во ВКонтакте</a>
      </div>
    </div>

    <section class="rs-section rsn-form">
      <div class="rsn-form__text">
        <h2>Вопрос о качестве или ассортименте</h2>
        <p class="rs-muted">
          Напишите — ответим на почту. Заказать в розницу проще через
          <NuxtLink :to="rsPath('/catalog')" class="rs-link">магазин</NuxtLink>, оптом — через
          <NuxtLink :to="rsPath('/opt')" class="rs-link">прайс</NuxtLink>.
        </p>
      </div>
      <form class="rs-panel rs-form" @submit.prevent="sent = true">
        <div class="rs-form__row">
          <label class="rs-field">
            <span>Имя</span>
            <input v-model="form.name" type="text" required autocomplete="name" />
          </label>
          <label class="rs-field">
            <span>Электронная почта</span>
            <input v-model="form.email" type="email" required autocomplete="email" />
          </label>
        </div>
        <label class="rs-field">
          <span>Тема</span>
          <input v-model="form.topic" type="text" />
        </label>
        <label class="rs-field">
          <span>Сообщение</span>
          <textarea v-model="form.message" required />
        </label>
        <button type="submit" class="rs-btn">Отправить</button>
        <p v-if="sent" class="rs-note" role="status">Это демо: в настоящем сайте сообщение уйдёт на {{ rsContacts.email }}.</p>
      </form>
    </section>

    <section id="docs" class="rs-section">
      <div class="rs-head">
        <div>
          <h2>Документы</h2>
          <p>Продукция имеет все необходимые сертификаты. Декларации соответствия ЕАС и приложения к ним — PDF с сайта компании.</p>
        </div>
      </div>
      <div class="rsn-docs">
        <a v-for="d in rsDocs" :key="d.href" :href="d.href" target="_blank" rel="noopener" class="rsn-doc">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 13h5M10 17h5" />
          </svg>
          <span>{{ d.label }}</span>
          <small>PDF</small>
        </a>
      </div>
    </section>

    <section class="rs-section rs-panel rsn-regions">
      <h2>Работаем в четырёх регионах</h2>
      <p>{{ rsRegions.join(' · ') }}</p>
      <p class="rs-muted">Растём вместе с клиентами и готовы расширять географию. Стоимость доставки рассчитаем за 30 минут.</p>
    </section>
  </div>
</template>

<style lang="scss">
.rs .rsn {
  .rsn-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .rsn-card {
    display: grid;
    align-content: start;
    justify-items: start;
    gap: 12px;

    h2 {
      font-size: 19px;
    }
  }

  .rsn-addr {
    font-size: 17px;
    font-weight: 500;
  }

  .rsn-phones {
    display: grid;
    gap: 4px;

    a {
      font-size: 18px;
      font-weight: 600;

      &:hover {
        color: var(--rs-blue);
      }
    }
  }

  .rsn-big {
    font-size: 18px;
    font-weight: 600;
    overflow-wrap: anywhere;

    &:hover {
      color: var(--rs-blue);
    }
  }

  .rsn-form {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: 40px;
    align-items: start;

    h2 {
      font-size: clamp(24px, 3vw, 34px);
    }

    &__text {
      display: grid;
      gap: 14px;
    }
  }

  .rsn-docs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 10px;
  }

  .rsn-doc {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    border-radius: var(--rs-r-lg);
    box-shadow: inset 0 0 0 1px var(--rs-line);
    transition: background-color 0.15s;

    svg {
      color: var(--rs-blue);
    }

    small {
      color: var(--rs-muted);
    }

    &:hover {
      background: var(--rs-ice);
    }
  }

  .rsn-regions {
    display: grid;
    gap: 10px;

    h2 {
      font-size: 22px;
    }

    p:not(.rs-muted) {
      font-size: 17px;
      font-weight: 500;
    }
  }

  @media (max-width: 960px) {
    .rsn-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .rsn-form {
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
    }
  }
}
</style>
