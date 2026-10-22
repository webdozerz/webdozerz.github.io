<script lang="ts" setup>
import FtIcon from '~/components/redesign/fermertomska/FtIcon.vue'

useSeoMeta({ title: 'О заводе и контакты | Куендатское, концепт редизайна' })

const ui = useFermertomskaUi()

const regions = ['Томск', 'Верхнекетский район', 'Асиновский район', 'Зырянский район', 'сети Кемерова и Новокузнецка', 'Новосибирск', 'Красноярск']
</script>

<template>
  <div class="ft-wrap ft-page ft-aboutpage">
    <nav class="ft-crumbs" aria-label="Навигация">
      <NuxtLink :to="ftPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>О заводе</span>
    </nav>

    <div class="ft-aboutpage__intro">
      <div>
        <h1 class="ft-h1">Молочный завод в Первомайском</h1>
        <p class="ft-page__lead">
          ООО ПСПК «Куендатский» начинался как маслозавод в селе Первомайском Томской области. Сегодня 47 человек делают
          здесь 5–6 тонн продукции в сутки: молоко, сметану, творог, кефир, йогурты и масло «Крестьянское». Без
          консервантов — поэтому молоко хранится всего 5 суток.
        </p>
      </div>
      <img :src="ftImg('lineup.jpg')" alt="Продукция «Куендатское» на пледе" width="1000" height="667" />
    </div>

    <ul class="ft-aboutpage__facts">
      <li v-for="f in ftFacts" :key="f.value">
        <strong>{{ f.value }}</strong>
        <span>{{ f.text }}</span>
      </li>
      <li>
        <strong><FtIcon name="medal" :size="30" /></strong>
        <span>масло «Крестьянское» — серебро «Молочные продукты Сибири» и «Лучшие товары и услуги Томской области»</span>
      </li>
    </ul>

    <section class="ft-section" aria-labelledby="ft-about-where">
      <div class="ft-head"><h2 id="ft-about-where" class="ft-h2">Где найти нашу продукцию</h2></div>
      <ul class="ft-aboutpage__regions">
        <li v-for="r in regions" :key="r">{{ r }}</li>
      </ul>
    </section>

    <section id="contacts" class="ft-section ft-aboutpage__contacts" aria-labelledby="ft-about-contacts">
      <div class="ft-head"><h2 id="ft-about-contacts" class="ft-h2">Контакты</h2></div>
      <div class="ft-page__split">
        <div class="ft-panel ft-panel--surface">
          <h2>Заказы и доставка</h2>
          <a class="ft-aboutpage__phone" :href="ftContacts.phoneHref">{{ ftContacts.phone }}</a>
          <p><FtIcon name="clock" :size="20" /> <span>Заказы принимаем пн–пт до 15:00</span></p>
          <p><FtIcon name="pin" :size="20" /> <span>Самовывоз: {{ ftContacts.pickup }}, {{ ftContacts.pickupHours }}</span></p>
          <button type="button" class="ft-btn" @click="ui.open({ kind: 'callback' })">Перезвоните мне</button>
        </div>
        <div class="ft-panel">
          <h2>Офис и производство</h2>
          <p><FtIcon name="phone" :size="20" /> <span><a :href="ftContacts.officeHref">{{ ftContacts.office }}</a>, факс {{ ftContacts.fax }}</span></p>
          <p><FtIcon name="clock" :size="20" /> <span>{{ ftContacts.officeHours }}, сб–вс — выходной</span></p>
          <p><FtIcon name="pin" :size="20" /> <span>{{ ftContacts.production }}</span></p>
          <p><FtIcon name="mail" :size="20" /> <span><a :href="`mailto:${ftContacts.email}`">{{ ftContacts.email }}</a></span></p>
        </div>
      </div>
      <dl class="ft-aboutpage__legal">
        <dt>Организация</dt>
        <dd>{{ ftContacts.legal }}</dd>
        <dt>ИНН</dt>
        <dd>{{ ftContacts.inn }}</dd>
        <dt>ОГРН</dt>
        <dd>{{ ftContacts.ogrn }}</dd>
        <dt>Директор</dt>
        <dd>{{ ftContacts.director }}</dd>
      </dl>
    </section>
  </div>
</template>

<style lang="scss">
.ft .ft-aboutpage {
  &__intro {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    gap: 40px;
    margin-top: 8px;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 3 / 2;
      border-radius: var(--ft-r-lg);
      object-fit: cover;
    }

    .ft-page__lead {
      margin-bottom: 0;
    }
  }

  &__facts {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-top: 40px;

    li {
      display: grid;
      align-content: start;
      gap: 6px;
      padding: 22px;
      border-radius: 20px;
      background: var(--ft-surface);
    }

    strong {
      color: var(--ft-accent-d);
      font-size: 30px;
      font-weight: 900;
      line-height: 1.1;
    }

    span {
      color: var(--ft-text);
      font-size: 15px;
    }
  }

  &__regions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    li {
      padding: 10px 16px;
      border-radius: 14px;
      box-shadow: inset 0 0 0 1px var(--ft-line);
      font-weight: 800;
    }
  }

  &__contacts {
    padding-bottom: 0;
  }

  &__phone {
    font-size: 28px;
    font-weight: 900;
    color: var(--ft-ink) !important;
  }

  .ft-panel .ft-btn {
    justify-self: start;
  }

  &__legal {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 6px 24px;
    max-width: 640px;
    margin-top: 24px;
    color: var(--ft-text);

    dt {
      color: var(--ft-muted);
    }

    dd {
      font-weight: 700;
    }
  }

  @media (max-width: 1199px) {
    &__facts {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 989px) {
    &__intro {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
  }

  @media (max-width: 576px) {
    &__facts {
      grid-template-columns: minmax(0, 1fr);
      margin-top: 24px;
    }

    &__legal {
      grid-template-columns: minmax(0, 1fr);
      gap: 0;

      dd {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
