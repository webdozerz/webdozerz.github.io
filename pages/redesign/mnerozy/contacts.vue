<script lang="ts" setup>
import MrIcon from '~/components/redesign/mnerozy/MrIcon.vue'

useSeoMeta({ title: 'О службе и контакты — Мне розы | Концепт редизайна' })
</script>

<template>
  <div class="mr-wrap mr-con">
    <nav class="mr-crumbs" aria-label="Навигация">
      <NuxtLink :to="mrPath()">Главная</NuxtLink>
      <span>Контакты</span>
    </nav>
    <div class="mr-con__head">
      <h1>Контакты</h1>
      <p>Принимаем заказы круглосуточно: по телефону, в мессенджерах и на сайте.</p>
    </div>

    <div class="mr-con__grid">
      <section class="mr-con__main">
        <a :href="mrContacts.phoneHref" class="mr-con__phone">
          <MrIcon name="phone" :size="26" />
          <span>
            <b>{{ mrContacts.phone }}</b>
            <small>круглосуточно, без выходных</small>
          </span>
        </a>
        <div class="mr-con__msgs">
          <a :href="mrContacts.whatsapp" target="_blank" rel="noopener" class="mr-btn mr-btn--line">
            <img :src="mrContacts.icons.whatsapp" alt="" width="24" height="24" /> WhatsApp
          </a>
          <a :href="mrContacts.telegram" class="mr-btn mr-btn--line">
            <img :src="mrContacts.icons.telegram" alt="" width="24" height="24" /> Telegram
          </a>
          <a :href="mrContacts.vk" target="_blank" rel="noopener" class="mr-btn mr-btn--line">
            <img :src="mrContacts.icons.vk" alt="" width="24" height="24" /> ВКонтакте
          </a>
          <a :href="mrContacts.channel" target="_blank" rel="noopener" class="mr-btn mr-btn--line">
            <img :src="mrContacts.icons.channel" alt="" width="24" height="24" /> Telegram-канал
          </a>
        </div>

        <div class="mr-con__shops">
          <article v-for="s in mrContacts.shops" :key="s.title">
            <MrIcon name="pin" :size="22" />
            <div>
              <b>{{ s.title }}</b>
              <p>{{ s.text }}</p>
              <a :href="s.map" target="_blank" rel="noopener">На карте</a>
            </div>
          </article>
        </div>

        <div class="mr-con__apps">
          <p>Приложение «Мне розы» для телефона:</p>
          <div>
            <a v-for="a in mrContacts.apps" :key="a.title" :href="a.href" target="_blank" rel="noopener">
              <img :src="a.img" :alt="a.title" height="40" />
            </a>
          </div>
        </div>
      </section>

      <section class="mr-con__about">
        <h2>О службе</h2>
        <p>
          «Мне розы» — круглосуточная служба доставки цветов в Томске с собственной курьерской службой. Заказать букет из любого сорта роз
          можно за пару минут на сайте или по телефону, оплатить — онлайн, не отходя от компьютера.
        </p>
        <p>Мы с удовольствием доставим улыбку вашим родным и близким, вручив от вас частичку любви и внимания.</p>
        <div class="mr-con__cities">
          <p>Доставляем и в других городах:</p>
          <div>
            <a v-for="c in mrCities.slice(1)" :key="c.title" :href="c.href" target="_blank" rel="noopener" class="mr-chip">{{ c.title }}</a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mr-con {
  &__head {
    display: grid;
    gap: 8px;
    padding: 14px 0 24px;

    h1 {
      font-size: 34px;
    }

    p {
      color: var(--mr-muted);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 24px;
    align-items: start;
  }

  &__main {
    display: grid;
    gap: 16px;
  }

  &__phone {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 22px;
    border-radius: var(--mr-r-panel);
    background: var(--mr-accent-soft);
    color: var(--mr-accent-dark);

    span {
      display: grid;
    }

    b {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.01em;
    }

    small {
      font-size: 14px;
    }
  }

  &__msgs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;

    .mr-btn {
      justify-content: flex-start;
    }
  }

  &__shops {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;

    article {
      display: flex;
      gap: 12px;
      padding: 18px;
      border-radius: var(--mr-r-panel);
      border: 1px solid var(--mr-line);

      > svg {
        flex: none;
        color: var(--mr-accent);
      }
    }

    b {
      font-size: 17px;
    }

    p {
      color: var(--mr-muted);
      font-size: 14px;
    }

    a {
      display: inline-block;
      margin-top: 6px;
      color: var(--mr-accent);
      font-size: 14px;
      font-weight: 700;
    }
  }

  &__apps {
    display: grid;
    gap: 10px;
    padding: 18px;
    border-radius: var(--mr-r-panel);
    background: var(--mr-surface);
    font-size: 14px;

    div {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    img {
      height: 40px;
      width: auto;
    }
  }

  &__about {
    display: grid;
    gap: 14px;
    padding: 26px;
    border-radius: var(--mr-r-panel);
    background: var(--mr-surface);

    h2 {
      font-size: 24px;
    }

    > p {
      line-height: 1.65;
    }
  }

  &__cities {
    display: grid;
    gap: 10px;
    padding-top: 14px;
    border-top: 1px solid var(--mr-line-strong);

    p {
      color: var(--mr-muted);
      font-size: 14px;
    }

    div {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .mr-chip {
      background: #fff;
    }
  }
}

@media (max-width: 989px) {
  .mr-con__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 576px) {
  .mr-con {
    &__head h1 {
      font-size: 26px;
    }

    &__phone {
      padding: 16px;

      b {
        font-size: 22px;
      }
    }

    &__msgs,
    &__shops {
      grid-template-columns: minmax(0, 1fr);
    }

    &__about {
      padding: 18px;
    }
  }
}
</style>
