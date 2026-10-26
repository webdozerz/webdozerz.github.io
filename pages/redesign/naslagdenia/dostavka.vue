<script lang="ts" setup>
import NsIcon from '~/components/redesign/naslagdenia/NsIcon.vue'

// Условия со страницы «Оплата и доставка» и страниц разделов, сведены в одно место.
const blocks = [
  {
    icon: 'truck',
    title: 'Готовые торты',
    rows: [
      ['Доставка по Новосибирску', 'бесплатно'],
      ['Советский и Первомайский районы', 'с доплатой'],
      ['Минимальное время доставки', '2 часа'],
      ['Самовывоз', 'из любого из 12 магазинов'],
    ],
  },
  {
    icon: 'calendar',
    title: 'Торты на заказ',
    rows: [
      ['Торт до 7 кг', 'заявка за 3 дня'],
      ['Торт больше 7 кг или по вашему эскизу', 'заявка за 7 дней'],
      ['Минимальный вес', '1,5 кг, свадебный — 3 кг'],
      ['Цена', 'от 650 до 1 200 ₽ за кг, указана в карточке торта'],
      ['Доставка', '250–750 ₽'],
    ],
  },
  {
    icon: 'cupcake',
    title: 'Пирожные',
    rows: [
      ['На сайте', 'только коробками по 8–12 штук'],
      ['Минимальный заказ', '300 ₽'],
      ['Поштучно', 'в магазинах'],
    ],
  },
]
const time = [
  { icon: 'clock', title: 'Заявки на доставку', text: 'ежедневно с 8:00 до 17:00' },
  { icon: 'truck', title: 'Доставка', text: 'ежедневно с 9:00 до 19:00' },
  { icon: 'pin', title: 'Левый берег', text: 'в 2-часовом интервале до времени, которое вы указали' },
  { icon: 'pin', title: 'Правый берег', text: 'в 3-часовом интервале до времени, которое вы указали' },
]
useSeoMeta({ title: 'Доставка и оплата — кондитерская «Наслаждение» | Концепт редизайна' })
</script>

<template>
  <div class="ns-wrap ns-terms">
    <nav class="ns-crumbs" aria-label="Навигация">
      <NuxtLink :to="nsPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Доставка и оплата</span>
    </nav>
    <h1 class="ns-page-title">Доставка и оплата</h1>
    <p class="ns-page-lead">Забрать торт можно в любом фирменном магазине или заказать доставку курьером по Новосибирску.</p>

    <ul class="ns-terms__time">
      <li v-for="t in time" :key="t.title">
        <span class="ns-facts__icon"><NsIcon :name="t.icon" /></span>
        <span>
          <b>{{ t.title }}</b>
          <small>{{ t.text }}</small>
        </span>
      </li>
    </ul>

    <div class="ns-terms__grid">
      <section v-for="b in blocks" :key="b.title" class="ns-terms__card">
        <h2><NsIcon :name="b.icon" :size="26" /> {{ b.title }}</h2>
        <dl>
          <div v-for="r in b.rows" :key="r[0]">
            <dt>{{ r[0] }}</dt>
            <dd>{{ r[1] }}</dd>
          </div>
        </dl>
      </section>
    </div>

    <section class="ns-terms__pay">
      <h2>Оплата</h2>
      <ul>
        <li>
          <NsIcon name="phone" />
          <span>После заявки на сайте перезвонит менеджер: подтвердит заказ и уточнит детали.</span>
        </li>
        <li>
          <NsIcon name="wallet" />
          <span>
            За заказные торты (праздничные, свадебные, детские, корпоративные, фототорты) — предоплата не меньше 30&nbsp;% или полная
            оплата. Её вносят в удобном фирменном магазине.
          </span>
        </li>
        <li>
          <NsIcon name="store" />
          <span>Онлайн-оплаты на сайте нет — заказ ни к чему не обязывает, пока менеджер его не подтвердил.</span>
        </li>
      </ul>
      <div class="ns-terms__actions">
        <NuxtLink :to="nsPath('/catalog/standard')" class="ns-btn ns-btn--main">Выбрать торт</NuxtLink>
        <a :href="nsContacts.phoneHref" class="ns-btn ns-btn--line"><NsIcon name="phone" :size="18" /> {{ nsContacts.phone }}</a>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.ns .ns-terms {
  ul.ns-terms__time {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-top: 28px;

    li {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      border: 1px solid var(--ns-line);
      border-radius: var(--ns-r-card);
    }

    b {
      display: block;
      color: var(--ns-dark);
    }

    small {
      display: block;
      font-size: 13px;
      line-height: 1.4;
      color: var(--ns-muted);
    }

    @media (max-width: 1199px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .ns-facts__icon {
    display: grid;
    flex: none;
    place-items: center;
    width: 44px;
    height: 44px;
    color: var(--ns-accent);
    background: var(--ns-surface);
    border-radius: 14px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
    margin-top: 20px;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__card {
    padding: 26px;
    background: var(--ns-surface);
    border-radius: var(--ns-r-card);

    h2 {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 28px;

      .ns-icon {
        color: var(--ns-accent);
      }
    }

    dl {
      display: grid;
      margin: 18px 0 0;
    }

    div {
      display: grid;
      gap: 2px;
      padding: 12px 0;
      border-top: 1px solid var(--ns-line-strong);
    }

    dt {
      font-size: 14px;
      color: var(--ns-muted);
    }

    dd {
      margin: 0;
      font-weight: 600;
      color: var(--ns-dark);
    }

    @media (max-width: 576px) {
      padding: 20px 16px;
    }
  }

  &__pay {
    margin-top: 20px;
    padding: 28px;
    border: 1px solid var(--ns-line);
    border-radius: var(--ns-r-card);

    h2 {
      font-size: 28px;
    }

    ul {
      display: grid;
      gap: 14px;
      max-width: 820px;
      margin: 18px 0 24px;
    }

    li {
      display: flex;
      gap: 12px;
    }

    .ns-icon {
      flex: none;
      color: var(--ns-accent);
    }

    @media (max-width: 576px) {
      padding: 20px 16px;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>
