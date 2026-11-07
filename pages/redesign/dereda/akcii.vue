<script lang="ts" setup>
import DrIcon from '~/components/redesign/dereda/DrIcon.vue'

useSeoMeta({ title: 'Акции и скидки — Дереда | Концепт редизайна' })
const ui = useDrUi()
const copy = async () => {
  try {
    await navigator.clipboard.writeText('день рождения')
    ui.toast.value = 'Промокод «день рождения» скопирован'
  } catch {
    ui.toast.value = 'Промокод: день рождения'
  }
}
</script>

<template>
  <div class="dr-wrap dr-page dr-promo">
    <nav class="dr-crumbs" aria-label="Навигация">
      <NuxtLink :to="drPath('/')">Главная</NuxtLink>
      <span>Акции</span>
    </nav>
    <h1>Акции и скидки</h1>

    <div class="dr-promo__grid">
      <section id="nakopitelnaya" class="dr-promo__card dr-promo__card--wide">
        <div class="dr-promo__head">
          <h2>Накопительная система скидок</h2>
          <p>«Покупай больше — плати меньше»: скидка растёт с общей суммой выполненных заказов и считается в корзине сама.</p>
        </div>
        <div class="dr-promo__levels">
          <div v-for="l in drLevels" :key="l.from">
            <b>{{ l.pct }}&nbsp;%</b>
            <span>от {{ drMoney(l.from) }}</span>
          </div>
        </div>
        <ul class="dr-promo__terms">
          <li>Только для зарегистрированных покупателей, привязана к вашей почте.</li>
          <li>В расчёт идут заказы со статусом «Доставлен и оплачен», историю видно в личном кабинете.</li>
          <li>Не суммируется с другими скидками и товарами по скидке.</li>
        </ul>
        <NuxtLink :to="drPath('/kabinet')" class="dr-btn dr-btn--line">Мой уровень скидки</NuxtLink>
      </section>

      <section id="den-rozhdeniya" class="dr-promo__card">
        <h2>Скидка 5&nbsp;% на день рождения</h2>
        <p>Действует 7 дней до и после даты рождения. Впишите промокод в корзине:</p>
        <button type="button" class="dr-promo__code" @click="copy">
          <span>день рождения</span>
          <DrIcon name="copy" :size="20" />
        </button>
        <ul class="dr-promo__terms">
          <li>Заказ от 2 500 ₽, нужна регистрация на сайте.</li>
          <li>При доставке покажите документ с датой рождения.</li>
          <li>На «Товары по акции» скидка не действует.</li>
        </ul>
      </section>

      <NuxtLink :to="drPath('/catalog/zamorozka')" class="dr-promo__card dr-promo__card--link">
        <h2>−10&nbsp;% на заморозку 2,5 кг</h2>
        <p>Овощи, грибы и ягода в больших пакетах — выберите фасовку 2,5 кг в карточке.</p>
        <span>Смотреть заморозку<DrIcon name="arrow" :size="18" /></span>
      </NuxtLink>
      <NuxtLink :to="{ path: drPath('/catalog/zamorozka'), query: { sub: 'Ягода' } }" class="dr-promo__card dr-promo__card--link">
        <h2>Замороженная ягода — до −32&nbsp;%</h2>
        <p>Сбор Томск, Алтай.</p>
        <span>Смотреть ягоду<DrIcon name="arrow" :size="18" /></span>
      </NuxtLink>
      <NuxtLink :to="drPath('/catalog/ovoshi')" class="dr-promo__card dr-promo__card--link">
        <h2>Свежие овощи — до −21&nbsp;%</h2>
        <p>Свежие, натуральные, без химии и ГМО.</p>
        <span>Смотреть овощи<DrIcon name="arrow" :size="18" /></span>
      </NuxtLink>
      <NuxtLink :to="{ path: drPath('/catalog'), query: { tag: 'sale' } }" class="dr-promo__card dr-promo__card--link">
        <h2>Товары по акции</h2>
        <p>21 товар со сниженной ценой.</p>
        <span>Все товары по акции<DrIcon name="arrow" :size="18" /></span>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.dr-promo {
  h1 {
    margin-bottom: 22px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;

    @media (max-width: 1199px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 768px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__card {
    display: grid;
    align-content: start;
    gap: 14px;
    padding: 28px;
    border-radius: var(--dr-R);
    background: var(--dr-surface);

    h2 {
      font-size: 28px;
    }

    @media (max-width: 576px) {
      padding: 22px 18px;
    }

    &--wide {
      grid-column: span 2;

      @media (max-width: 768px) {
        grid-column: auto;
      }
    }

    &--link {
      border: 1px solid var(--dr-line);
      background: #fff;

      span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--dr-accent);
        font-weight: 600;
      }

      &:hover {
        border-color: var(--dr-accent);
      }
    }

    > .dr-btn {
      justify-self: start;
    }
  }

  &__head {
    display: grid;
    gap: 8px;
  }

  &__levels {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;

    @media (max-width: 576px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    div {
      display: grid;
      padding: 14px;
      border-radius: var(--dr-r);
      background: #fff;
    }

    b {
      color: var(--dr-accent);
      font-family: var(--dr-head);
      font-size: 30px;
      font-weight: 400;
      line-height: 1.1;
    }

    span {
      color: var(--dr-muted);
      font-size: 14px;
    }
  }

  ul.dr-promo__terms {
    display: grid;
    gap: 6px;
    padding-left: 18px;
    list-style: disc;
    color: var(--dr-text);
    font-size: 15px;
  }

  &__code {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    justify-self: start;
    padding: 12px 16px;
    border: 2px dashed var(--dr-accent);
    border-radius: var(--dr-r);
    background: #fff;
    color: var(--dr-accent-hover);
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
  }
}
</style>
