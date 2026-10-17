<script lang="ts" setup>
const sent = ref(false)
useSeoMeta({ title: 'О хозяйстве и контакты | Мясная лавка «Саныч», концепт', robots: 'noindex, nofollow' })

const facts = [
  { value: '5 лет', label: 'возим мясо по Новосибирску и области' },
  { value: '3 области', label: 'фермы-партнёры: Новосибирская, Алтайская, Красноярская' },
  { value: '0 гормонов', label: 'мясо без гормонов роста и химии, охлаждённое' },
]
</script>

<template>
  <div class="sn-wrap sni">
    <div class="sn-pagehead">
      <nav class="sn-crumbs" aria-label="Навигация">
        <NuxtLink :to="snPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>О хозяйстве</span>
      </nav>
      <h1>О хозяйстве</h1>
    </div>

    <section class="sna-story">
      <div class="sna-story__text">
        <p class="sna-story__lead">
          Мы — небольшое крестьянское хозяйство в Новосибирской области. Разводим птицу
          и занимаемся органическим земледелием: натуральные продукты небольшими партиями.
        </p>
        <p>
          Остальное в каталоге — с хозяйств наших знакомых и партнёров из Новосибирской,
          Алтайской и Красноярской областей. Продаём только то, в чём уверены сами.
        </p>
        <p>
          Пятый год возим охлаждённое мясо по Новосибирску и области: без гормонов роста
          и химии, никогда не замороженное, по честной цене.
        </p>
        <dl class="sna-facts">
          <div v-for="f in facts" :key="f.value">
            <dt>{{ f.value }}</dt>
            <dd>{{ f.label }}</dd>
          </div>
        </dl>
      </div>
      <div class="sna-story__photos">
        <img src="/redesign/sanych/img/farm-2.jpg" alt="Куры хозяйства" width="800" height="533" />
        <img src="/redesign/sanych/img/farm-1.jpg" alt="Птичник" width="800" height="533" loading="lazy" />
      </div>
    </section>

    <section id="contacts" class="sni-section sna-contacts">
      <div>
        <h2>Контакты</h2>
        <div class="sna-cards">
          <div class="sna-card">
            <span>Телефон для заказов</span>
            <a :href="snContacts.phoneHref" class="sna-card__big">{{ snContacts.phone }}</a>
            <small>{{ snContacts.hours }}</small>
          </div>
          <div class="sna-card">
            <span>SMS, WhatsApp, Telegram — {{ snContacts.messengerName }}</span>
            <a :href="snContacts.messengerHref" class="sna-card__big">{{ snContacts.messenger }}</a>
            <span class="sna-card__links">
              <a :href="snContacts.whatsapp" target="_blank" rel="noopener" class="sn-link">WhatsApp</a>
              <a :href="snContacts.telegram" target="_blank" rel="noopener" class="sn-link">Telegram</a>
            </span>
          </div>
          <div class="sna-card">
            <span>Почта</span>
            <a :href="`mailto:${snContacts.email}`" class="sna-card__big sna-card__mail">{{ snContacts.email }}</a>
            <small>{{ snContacts.answer }}</small>
          </div>
          <div class="sna-card">
            <span>Экоферма</span>
            <b>{{ snContacts.farm }}</b>
            <small>{{ snContacts.farmHours }}</small>
          </div>
        </div>
      </div>

      <form class="sno-form" @submit.prevent="sent = true">
        <h2>Задать вопрос</h2>
        <p class="sn-muted">Про наличие, разделку или доставку — ответим в рабочее время.</p>
        <div class="sno-row">
          <label class="sn-field">
            <span>Имя</span>
            <input type="text" name="name" autocomplete="name" required />
          </label>
          <label class="sn-field">
            <span>Телефон или почта</span>
            <input type="text" name="contact" required />
          </label>
        </div>
        <label class="sn-field">
          <span>Вопрос</span>
          <textarea name="question" required />
        </label>
        <button type="submit" class="sn-btn sn-btn--wide">Отправить</button>
        <p v-if="sent" class="sn-note" role="status">Это демо: вопрос никуда не отправился.</p>
      </form>
    </section>
  </div>
</template>

<style lang="scss">
.sn .sna-story {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 40px;
  align-items: start;
}

.sn .sna-story__text {
  display: grid;
  gap: 14px;

  p {
    color: var(--sn-muted);
  }
}

.sn .sna-story__lead {
  font-size: 19px;
  line-height: 1.5;
  color: var(--sn-ink) !important;
}

.sn .sna-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;

  > div {
    padding: 16px;
    border-radius: 16px;
    background: var(--sn-paper);
  }

  dt {
    font-family: var(--sn-head);
    font-size: 18px;
    font-weight: 600;
    color: var(--sn-red);
  }

  dd {
    margin-top: 4px;
    font-size: 13px;
    line-height: 1.4;
    color: var(--sn-muted);
  }
}

.sn .sna-story__photos {
  display: grid;
  gap: 10px;

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: var(--sn-r-lg);
  }

  img + img {
    width: 62%;
    justify-self: end;
    margin-top: -18%;
    border: 6px solid #fff;
  }
}

.sn .sna-contacts {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 40px;
  align-items: start;
  scroll-margin-top: 140px;
}

.sn .sna-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.sn .sna-card {
  display: grid;
  align-content: start;
  gap: 4px;
  padding: 18px;
  border-radius: 16px;
  background: var(--sn-paper);
  min-width: 0;

  > span:first-child {
    font-size: 13px;
    font-weight: 700;
    color: var(--sn-muted);
  }

  small {
    font-size: 13px;
    color: var(--sn-muted);
  }
}

.sn .sna-card__big {
  font-size: 18px;
  font-weight: 800;
  overflow-wrap: anywhere;

  &:hover {
    color: var(--sn-red);
  }
}

.sn .sna-card__mail {
  font-size: 16px;
}

.sn .sna-card__links {
  display: flex;
  gap: 14px;
}

@media (max-width: 960px) {
  .sn .sna-story,
  .sn .sna-contacts {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

@media (max-width: 560px) {
  .sn .sna-facts,
  .sn .sna-cards {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .sn .sna-story__lead {
    font-size: 17px;
  }
}
</style>
