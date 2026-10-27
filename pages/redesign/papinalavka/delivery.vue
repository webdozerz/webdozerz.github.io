<script lang="ts" setup>
import PlIcon from '~/components/redesign/papinalavka/PlIcon.vue'

useSeoMeta({ title: 'Доставка и оплата — Папина лавка | Концепт редизайна' })

const ways = [
  { icon: 'pin', title: 'Самовывоз', price: 'бесплатно', text: '7 офисов в Воронеже и Новой Усмани, ежедневно 9:00–20:00, ТЦ «Пять столиц» — до 22:00.' },
  { icon: 'truck', title: 'Курьер по Воронежу', price: '400 ₽', text: 'В черте города. Заказ от 5000 ₽ привезём бесплатно — ежедневно.' },
  { icon: 'truck', title: 'Нововоронеж', price: '500 ₽', text: 'Заказ от 5000 ₽ — бесплатно.' },
  { icon: 'phone', title: 'Другие города и отдалённые районы', price: 'по телефону', text: 'Стоимость рассчитаем индивидуально — позвоните оператору.' },
]
</script>

<template>
  <div class="pl-wrap pl-page">
    <nav class="pl-crumbs" aria-label="Навигация">
      <NuxtLink :to="plPath()">Главная</NuxtLink>
      <span>Доставка и оплата</span>
    </nav>
    <h1 class="pl-h1">Доставка и оплата</h1>

    <div class="pl-page__ways">
      <article v-for="w in ways" :key="w.title" class="pl-page__way">
        <span class="pl-page__icon"><PlIcon :name="w.icon" /></span>
        <h2>{{ w.title }}</h2>
        <p class="pl-page__price">{{ w.price }}</p>
        <p>{{ w.text }}</p>
      </article>
    </div>

    <div class="pl-page__cols">
      <section class="pl-page__box">
        <h2><PlIcon name="snow" />Охлаждённое — к поставке</h2>
        <p>Каждый четверг — поставка свежей охлаждённой продукции от фермеров.</p>
        <p>
          Заказ на доставку охлаждённой продукции нужно оформить <b>за сутки до дня поставки, до 13:00</b>. Приём заказов на охлаждённые продукты
          завершается за день до поставки.
        </p>
        <NuxtLink :to="plPath('/deliveries')" class="pl-btn pl-btn--line pl-btn--sm">Ближайшие поставки</NuxtLink>
      </section>
      <section class="pl-page__box">
        <h2><PlIcon name="clock" />Экспресс-доставка за 2–3 часа</h2>
        <p>Во все дни, кроме четверга, привезём в течение 2–3 часов после оформления заказа.</p>
        <p>Для экспресса с сайта можно выбрать только товары из наличия. Если нужно совсем быстро — позвоните: {{ plContacts.phone }}.</p>
        <NuxtLink :to="{ path: plSectionPath(), query: { tab: 'stock' } }" class="pl-btn pl-btn--line pl-btn--sm">Есть в наличии</NuxtLink>
      </section>
      <section class="pl-page__box">
        <h2><PlIcon name="card" />Оплата</h2>
        <p>Наличными курьеру или картой через терминал при получении. В офисах выдачи — наличными или картой.</p>
        <p>
          Часть продуктов продаётся поштучно, а цена указана за килограмм, поэтому точная сумма может немного отличаться — назовём её после
          взвешивания.
        </p>
      </section>
      <section class="pl-page__box">
        <h2><PlIcon name="return" />Возврат и замена</h2>
        <p>Претензии по скоропортящимся продуктам принимаем в течение 24 часов с момента доставки, по продуктам долгого хранения — до 14 суток.</p>
        <p>Если продукт не понравился, примем возврат, заменим его или вернём стоимость.</p>
      </section>
    </div>

    <section class="pl-page__far">
      <h2>Отдалённые районы — стоимость по телефону</h2>
      <p>{{ plFarAreas }}</p>
    </section>

    <p class="pl-page__legal">
      Цены на сайте и в социальных сетях не являются публичной офертой и могут меняться: актуальную цену и наличие подтвердит оператор.
    </p>
  </div>
</template>

<style lang="scss" scoped>
.pl-page {
  > .pl-h1 {
    margin-bottom: 28px;
  }

  &__ways {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  &__way {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 22px;
    border: 1px solid var(--pl-line);
    border-radius: 18px;
    font-size: 15px;

    h2 {
      font-size: 18px;
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    margin-bottom: 4px;
    border-radius: 14px;
    background: var(--pl-accent-soft);
    color: var(--pl-accent-d);
  }

  &__price {
    color: var(--pl-wood);
    font-family: var(--pl-hand);
    font-size: 30px;
    font-weight: 700;
    line-height: 1;
  }

  &__cols {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 24px;
  }

  &__box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 26px;
    border-radius: 20px;
    background: var(--pl-kraft);

    h2 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
      font-size: 21px;

      .pl-icon {
        color: var(--pl-accent);
      }
    }

    b {
      color: var(--pl-dark);
    }

    .pl-btn {
      margin-top: 6px;
    }
  }

  &__far {
    margin-top: 24px;
    padding: 24px 26px;
    border: 1px solid var(--pl-line);
    border-radius: 20px;
    font-size: 15px;

    h2 {
      margin-bottom: 8px;
      font-size: 19px;
    }

    p {
      color: var(--pl-muted);
    }
  }

  &__legal {
    margin-top: 20px;
    color: var(--pl-muted);
    font-size: 14px;
  }

  @media (max-width: 1199px) {
    &__ways {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 768px) {
    &__ways,
    &__cols {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }

    &__box,
    &__far {
      padding: 20px 16px;
    }
  }
}
</style>
