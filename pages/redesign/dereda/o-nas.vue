<script lang="ts" setup>
import DrIcon from '~/components/redesign/dereda/DrIcon.vue'
import DrPhone from '~/components/redesign/dereda/DrPhone.vue'

useSeoMeta({ title: 'О нас — Дереда | Концепт редизайна' })

const factorIcons = ['leaf', 'pan', 'doc', 'farmer', 'clock', 'truck', 'home']
const sup = reactive({ name: '', phone: '', email: '', text: '', agree: false, sent: false })
const sendSup = () => {
  if (!sup.name.trim() || !sup.email.includes('@') || !sup.agree) return
  sup.sent = true
}
</script>

<template>
  <div class="dr-wrap dr-page dr-us">
    <nav class="dr-crumbs" aria-label="Навигация">
      <NuxtLink :to="drPath('/')">Главная</NuxtLink>
      <span>О нас</span>
    </nav>

    <section class="dr-us__intro">
      <div class="dr-prose">
        <h1>О нас</h1>
        <p>
          Дереда — первый и самый крупный в Новосибирске сервис доставки деревенских продуктов напрямую от фермеров области. Идея появилась в 2012 году: мы
          хотели вырастить здоровых детей и начали искать натуральные продукты — сначала на рынках, потом по деревням и посёлкам.
        </p>
        <p>
          Остановились на небольших семейных фермах в экологически чистых районах Новосибирской области. Мы доставляем на дом еду, на которой выросли наши
          бабушки и дедушки, а фермерам помогаем развивать хозяйства.
        </p>
        <p>
          Вся продукция готовится под заказ: фермеры делают её специально для вас и привозят к нам в день доставки. И вы всегда знаете, у кого заказываете —
          <NuxtLink :to="drPath('/fermery')" class="dr-us__link">наши фермеры</NuxtLink>.
        </p>
      </div>
      <div class="dr-us__motto">
        <img src="/redesign/dereda/girl.png" alt="" width="61" height="88" />
        <p>Если овощи — то без химии!</p>
        <p>Если курица — то счастливая!</p>
        <p>Если будущее — то здоровое!</p>
      </div>
    </section>

    <section id="ceny" class="dr-sec">
      <h2>Почему такие цены</h2>
      <p class="dr-us__sub">Наша входная цена на цыплёнка-бройлера — 210 ₽/кг, розничная — 275 ₽/кг, а в магазине его можно купить за 130–140 ₽/кг. Вот из чего складывается цена:</p>
      <ol class="dr-us__factors">
        <li v-for="(f, i) in drPriceFactors" :key="f.t">
          <DrIcon :name="factorIcons[i]" :size="24" />
          <b>{{ i + 1 }}. {{ f.t }}</b>
          <p>{{ f.d }}</p>
        </li>
      </ol>
    </section>

    <section id="kachestvo" class="dr-sec dr-us__quality">
      <div class="dr-panel">
        <h2>Качество</h2>
        <p>
          Прежде чем внести товар поставщика в нашу базу, мы дегустируем всю продукцию и стараемся лично посетить хозяйство: смотрим, как содержатся животные,
          чистоту, документы о дезинфекции, эпизоотическом благополучии территории, протоколы испытаний и ветеринарные свидетельства.
        </p>
        <p>На всю продукцию есть документы: сертификаты и декларации соответствия, качественные удостоверения, ветеринарные свидетельства.</p>
      </div>
      <div class="dr-panel">
        <h2>СМИ о нас</h2>
        <ul class="dr-us__media">
          <li v-for="m in drMedia" :key="m.date + m.t">
            <small>{{ m.date }}</small><span>{{ m.t }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section id="zdorovie" class="dr-sec">
      <div class="dr-us__health">
        <div class="dr-prose">
          <h2>Про здоровье</h2>
          <p>
            Каждую доставку мы привозим натуральные продукты, но пошли дальше: развиваемся вместе с новосибирской компанией «Siberian Wellness» — витамины,
            комплексы для иммунитета и красоты на основе сибирских трав. Можно бесплатно пройти тест FitCha на дефициты витаминов и минералов и получить
            консультацию специалиста.
          </p>
        </div>
        <div class="dr-us__healthlinks">
          <a href="https://t.me/zdorovysSW" target="_blank" rel="noopener" class="dr-btn dr-btn--line"><DrIcon name="telegram" :size="20" />Чат в Telegram</a>
          <a href="https://chat.whatsapp.com/HXcQZVzsL5v7Lj2QwW9K7j" target="_blank" rel="noopener" class="dr-btn dr-btn--line">
            <DrIcon name="whatsapp" :size="20" />Чат в WhatsApp
          </a>
        </div>
      </div>
    </section>

    <section class="dr-sec dr-us__bottom">
      <div id="partnery" class="dr-panel">
        <h2>Партнёры</h2>
        <p>«Рождение для двоих» — школа будущих мам.</p>
      </div>
      <div id="postavshchikam" class="dr-panel">
        <h2>Поставщикам</h2>
        <p>Хотите, чтобы ваша продукция появилась в «Дереде»? Позвоните {{ drContacts.phone }}, напишите на {{ drContacts.email }} или оставьте заявку.</p>
        <form v-if="!sup.sent" class="dr-form" @submit.prevent="sendSup">
          <div class="dr-us__row">
            <label class="dr-field"><span>Имя *</span><input v-model="sup.name" required /></label>
            <label class="dr-field"><span>Телефон</span><DrPhone v-model="sup.phone" /></label>
          </div>
          <label class="dr-field"><span>Email *</span><input v-model="sup.email" type="email" required /></label>
          <label class="dr-field"><span>Что производите</span><textarea v-model="sup.text" rows="3" /></label>
          <label class="dr-check"><input v-model="sup.agree" type="checkbox" /><span>Согласен с условиями оферты и политики конфиденциальности</span></label>
          <button type="submit" class="dr-btn dr-btn--main" :disabled="!sup.name.trim() || !sup.email.includes('@') || !sup.agree">Отправить</button>
        </form>
        <p v-else class="dr-us__sent"><DrIcon name="check" :size="20" />Сообщение отправлено — это демо, в концепте заявка никуда не уходит.</p>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.dr-us {
  &__intro {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 40px;
    align-items: center;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__link {
    color: var(--dr-accent);
    font-weight: 600;
  }

  &__motto {
    display: grid;
    justify-items: start;
    gap: 6px;
    padding: 32px;
    border-radius: var(--dr-R);
    background: var(--dr-accent-soft);

    img {
      width: 61px;
      margin-bottom: 8px;
    }

    p {
      color: var(--dr-accent-hover);
      font-family: var(--dr-head);
      font-size: clamp(22px, 2.2vw, 28px);
      line-height: 1.25;
    }
  }

  h2 {
    margin-bottom: 14px;
  }

  &__sub {
    max-width: 860px;
    margin-bottom: 22px;
    font-size: 17px;
  }

  ol.dr-us__factors {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 14px;

    li {
      display: grid;
      align-content: start;
      gap: 8px;
      padding: 22px;
      border: 1px solid var(--dr-line);
      border-radius: var(--dr-R);
    }

    svg {
      color: var(--dr-brown);
    }

    p {
      color: var(--dr-text);
      font-size: 15px;
    }
  }

  &__quality,
  &__bottom {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 16px;
    align-items: start;

    .dr-panel {
      display: grid;
      gap: 12px;

      h2 {
        margin-bottom: 0;
      }
    }

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  ul.dr-us__media {
    display: grid;
    gap: 10px;

    li {
      display: grid;
      grid-template-columns: 92px minmax(0, 1fr);
      gap: 10px;
      font-size: 15px;

      @media (max-width: 375px) {
        grid-template-columns: minmax(0, 1fr);
        gap: 0;
      }
    }

    small {
      color: var(--dr-muted);
      font-size: 14px;
    }
  }

  &__health {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 20px 40px;
    padding: 32px;
    border: 1px solid var(--dr-line);
    border-radius: var(--dr-R);

    h2 {
      margin-bottom: 0;
    }

    @media (max-width: 576px) {
      padding: 22px 18px;
    }
  }

  &__healthlinks {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__sent {
    display: flex;
    gap: 8px;
    color: var(--dr-green);
  }

  .dr-form .dr-btn {
    justify-self: start;
  }
}
</style>
