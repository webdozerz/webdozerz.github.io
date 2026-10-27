<script lang="ts" setup>
import PlIcon from '~/components/redesign/papinalavka/PlIcon.vue'

useSeoMeta({ title: 'Контакты — Папина лавка | Концепт редизайна' })
</script>

<template>
  <div class="pl-wrap pl-contacts">
    <nav class="pl-crumbs" aria-label="Навигация">
      <NuxtLink :to="plPath()">Главная</NuxtLink>
      <span>Контакты</span>
    </nav>
    <h1 class="pl-h1">Контакты</h1>

    <div class="pl-contacts__top">
      <section class="pl-contacts__box">
        <h2>Приём заказов</h2>
        <ul class="pl-contacts__people">
          <li v-for="p in plContacts.phones" :key="p.phone">
            <a :href="plTel(p.phone)">{{ p.phone }}</a>
            <span>{{ p.name }} — {{ p.role }}</span>
          </li>
        </ul>
        <p><a :href="`mailto:${plContacts.orders}`" class="pl-contacts__mail">{{ plContacts.orders }}</a></p>
        <p class="pl-contacts__muted">Заказы с сайта операторы обрабатывают с 9:00 до 19:00.</p>
      </section>
      <section class="pl-contacts__box">
        <h2>Руководитель</h2>
        <p class="pl-contacts__head">{{ plContacts.head.name }}</p>
        <p><a :href="`mailto:${plContacts.head.email}`" class="pl-contacts__mail">{{ plContacts.head.email }}</a></p>
        <p class="pl-contacts__muted">Предложения о сотрудничестве, отзывы о работе офисов.</p>
        <div class="pl-contacts__social">
          <a :href="plContacts.vk" target="_blank" rel="noopener" class="pl-btn pl-btn--line pl-btn--sm"><PlIcon name="vk" :size="20" />ВКонтакте</a>
          <a :href="plContacts.tg" target="_blank" rel="noopener" class="pl-btn pl-btn--line pl-btn--sm"><PlIcon name="tg" :size="20" />Telegram</a>
        </div>
      </section>
    </div>

    <section class="pl-section">
      <div class="pl-head"><h2>Офисы выдачи</h2></div>
      <ul class="pl-contacts__offices">
        <li v-for="o in plOffices" :key="o.street">
          <div>
            <small>{{ o.city }}</small>
            <b>{{ o.street }}</b>
            <span v-if="o.where">{{ o.where }}</span>
          </div>
          <p><PlIcon name="clock" :size="17" />ежедневно {{ o.hours }}</p>
          <p><PlIcon name="phone" :size="17" /><a :href="plTel(o.phone)">{{ o.phone }}</a></p>
          <a :href="plMapUrl(o)" target="_blank" rel="noopener" class="pl-contacts__map">Открыть в Яндекс Картах <PlIcon name="external" :size="16" /></a>
        </li>
      </ul>
    </section>

    <p class="pl-contacts__legal">{{ plContacts.legal }}</p>
  </div>
</template>

<style lang="scss" scoped>
.pl-contacts {
  > .pl-h1 {
    margin-bottom: 24px;
  }

  &__top {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  &__box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 28px;
    border-radius: 20px;
    background: var(--pl-kraft);

    h2 {
      margin-bottom: 4px;
      font-size: 22px;
    }
  }

  ul.pl-contacts__people {
    display: grid;
    gap: 10px;

    li {
      display: grid;
    }

    a {
      color: var(--pl-dark);
      font-size: 22px;
      font-weight: 700;
    }

    span {
      color: var(--pl-muted);
      font-size: 14px;
    }
  }

  &__mail {
    color: var(--pl-accent);
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  &__head {
    color: var(--pl-dark);
    font-family: var(--pl-hand);
    font-size: 30px;
    font-weight: 700;
    line-height: 1.05;
  }

  &__muted {
    color: var(--pl-muted);
    font-size: 15px;
  }

  &__social {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
  }

  ul.pl-contacts__offices {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;

    li {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 20px;
      border: 1px solid var(--pl-line);
      border-radius: 18px;
      font-size: 15px;
    }

    div {
      display: grid;
      gap: 2px;
      margin-bottom: 4px;
    }

    small {
      color: var(--pl-muted);
      font-size: 13px;
    }

    b {
      color: var(--pl-dark);
      font-size: 18px;
    }

    span {
      color: var(--pl-muted);
    }

    p {
      display: flex;
      align-items: center;
      gap: 8px;

      .pl-icon {
        color: var(--pl-accent);
      }

      a {
        font-weight: 700;
      }
    }
  }

  &__map {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: auto;
    padding-top: 6px;
    color: var(--pl-accent);
    font-weight: 700;
  }

  &__legal {
    margin-top: 28px;
    color: var(--pl-muted);
    font-size: 14px;
  }

  @media (max-width: 768px) {
    &__top {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }

    &__box {
      padding: 20px 16px;
    }

    ul.pl-contacts__offices {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }
  }
}
</style>
