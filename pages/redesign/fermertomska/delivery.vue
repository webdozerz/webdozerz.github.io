<script lang="ts" setup>
import FtWhen from '~/components/redesign/fermertomska/FtWhen.vue'
import FtIcon from '~/components/redesign/fermertomska/FtIcon.vue'

useSeoMeta({ title: 'Доставка и оплата | Куендатское, концепт редизайна' })

const october = useState('ft-october', () => false)

const schedule = [
  { day: 'Понедельник', until: 'в пятницу до 15:00', oct: false },
  { day: 'Вторник', until: 'в пятницу до 15:00', oct: true },
  { day: 'Среда', until: 'в понедельник до 15:00', oct: false },
  { day: 'Четверг', until: 'во вторник до 15:00', oct: true },
  { day: 'Пятница', until: 'в среду до 15:00', oct: false },
  { day: 'Суббота', until: 'в четверг до 15:00', oct: true },
]
</script>

<template>
  <div class="ft-wrap ft-page">
    <nav class="ft-crumbs" aria-label="Навигация">
      <NuxtLink :to="ftPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>Доставка и оплата</span>
    </nav>
    <h1 class="ft-h1">Доставка и оплата</h1>
    <p class="ft-page__lead">
      Возим фермерскую молочную продукцию по Томску ежедневно, кроме воскресенья. Заказы принимаем с понедельника по
      пятницу до 15:00, привозим обычно утром.
    </p>

    <div class="ft-page__split">
      <section class="ft-panel" aria-labelledby="ft-del-when">
        <h2 id="ft-del-when">Когда привезём ваш заказ</h2>
        <FtWhen v-model:october="october" />
      </section>

      <section class="ft-panel ft-panel--surface" aria-labelledby="ft-del-cost">
        <h2 id="ft-del-cost">Стоимость</h2>
        <ul class="ft-costs">
          <li><FtIcon name="truck" /><span>Курьером по Томску</span><strong>{{ ftPrice(ftDelivery.courier) }}</strong></li>
          <li><FtIcon name="check" /><span>При заказе от {{ ftPrice(ftDelivery.freeFrom) }}</span><strong>бесплатно</strong></li>
          <li><FtIcon name="store" /><span>Самовывоз, заказ от {{ ftPrice(ftDelivery.pickupMin) }}</span><strong>0 ₽</strong></li>
        </ul>
        <p class="ft-panel__note">
          <FtIcon name="people" :size="20" />
          Рекомендуем объединяться с соседями, коллегами по работе и родственниками — так доставка бесплатная.
        </p>
      </section>
    </div>

    <section class="ft-section ft-sched" aria-labelledby="ft-del-sched">
      <div class="ft-head"><h2 id="ft-del-sched" class="ft-h2">Расписание</h2></div>
      <div class="ft-sched__table" role="table" aria-label="Расписание доставки">
        <div class="ft-sched__row ft-sched__row--head" role="row">
          <span role="columnheader">Доставка</span>
          <span role="columnheader">Заказать</span>
          <span role="columnheader">Октябрьский район</span>
        </div>
        <div v-for="s in schedule" :key="s.day" class="ft-sched__row" role="row">
          <strong role="cell">{{ s.day }}</strong>
          <span role="cell">{{ s.until }}</span>
          <span role="cell" :class="s.oct ? 'is-yes' : 'is-no'">
            <FtIcon :name="s.oct ? 'check' : 'minus'" :size="18" />
            <span class="ft-sched__oct">Октябрьский район:</span>
            {{ s.oct ? 'возим' : 'не возим' }}
          </span>
        </div>
      </div>
      <p class="ft-sched__note">В воскресенье не возим. В Октябрьский район — только во вторник, четверг и субботу.</p>
    </section>

    <div class="ft-page__split">
      <section class="ft-panel" aria-labelledby="ft-del-pickup">
        <h2 id="ft-del-pickup">Самовывоз</h2>
        <p><FtIcon name="pin" :size="20" /> <span>{{ ftContacts.pickup }}</span></p>
        <p><FtIcon name="clock" :size="20" /> <span>{{ ftContacts.pickupHours }}</span></p>
        <a
          class="ft-head__link"
          href="https://yandex.ru/maps/?text=%D0%A2%D0%BE%D0%BC%D1%81%D0%BA%2C%20%D0%91%D0%B5%D1%80%D0%B4%D1%81%D0%BA%D0%B0%D1%8F%2029"
          target="_blank"
          rel="noopener"
        >
          Открыть на карте <FtIcon name="arrow" :size="18" />
        </a>
      </section>

      <section class="ft-panel" aria-labelledby="ft-del-pay">
        <h2 id="ft-del-pay">Оплата</h2>
        <p><FtIcon name="card" :size="20" /> <span>Онлайн при оформлении: банковской картой (Мир, Visa, Mastercard), SberPay и другими способами ЮKassa.</span></p>
        <p class="ft-panel__muted">Чек придёт на почту, указанную в заказе.</p>
      </section>
    </div>

    <section id="return" class="ft-section ft-panel ft-panel--surface ft-page__return" aria-labelledby="ft-del-return">
      <h2 id="ft-del-return">Обмен и возврат</h2>
      <p class="ft-panel__plain">
        Если с продуктом что-то не так, позвоните по номеру <a :href="ftContacts.phoneHref">{{ ftContacts.phone }}</a> или
        напишите на <a :href="`mailto:${ftContacts.email}`">{{ ftContacts.email }}</a> — разберёмся и заменим.
      </p>
    </section>
  </div>
</template>

<style lang="scss">
.ft .ft-costs {
  display: grid;

  li {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #d9e2ec;
    color: var(--ft-accent);
  }

  span {
    color: var(--ft-ink);
  }

  strong {
    color: var(--ft-ink);
    font-weight: 900;
    white-space: nowrap;
  }
}

.ft .ft-sched {
  &__table {
    display: grid;
    border-radius: var(--ft-r-lg);
    overflow: hidden;
    box-shadow: inset 0 0 0 1px var(--ft-line);
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1.4fr 1fr;
    align-items: start;
    gap: 12px;
    padding: 14px 24px;
    border-top: 1px solid var(--ft-line);

    &--head {
      border-top: 0;
      background: var(--ft-surface);
      color: var(--ft-muted);
      font-size: 14px;
      font-weight: 800;
    }

    strong {
      font-weight: 900;
    }

    .is-yes,
    .is-no {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
    }

    .is-yes {
      color: var(--ft-accent);
    }

    .is-no {
      color: var(--ft-muted);
    }
  }

  &__note {
    margin-top: 12px;
    color: var(--ft-muted);
  }

  &__oct {
    display: none;
  }

  @media (max-width: 576px) {
    &__row {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 4px 12px;
      padding: 12px 16px;

      > :nth-child(3) {
        grid-column: 1 / -1;
      }

      &--head > :nth-child(3) {
        display: none;
      }
    }

    &__oct {
      display: inline;
    }
  }
}
</style>
