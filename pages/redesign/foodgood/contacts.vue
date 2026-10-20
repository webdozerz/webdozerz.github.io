<script lang="ts" setup>
import FgMessengers from '~/components/redesign/foodgood/FgMessengers.vue'

useSeoMeta({ title: 'Доставка и контакты | FoodGood Tomsk' })

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
const { from, to } = fgContacts.hours

// «Открыто сейчас» считаем по времени Томска только в браузере, чтобы не ломать статическую сборку.
const now = ref<{ day: number; open: boolean } | null>(null)
onMounted(() => {
  const { day, minutes } = fgTomskNow()
  now.value = { day, open: minutes >= from * 60 && minutes < to * 60 }
})
</script>

<template>
  <div class="fg-wrap">
    <div class="fg-page-head">
      <nav class="fg-crumbs" aria-label="Навигация">
        <NuxtLink :to="fgPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>Доставка и контакты</span>
      </nav>
      <h1>Доставка и контакты</h1>
      <p>Магазин здоровой еды в центре Томска. Приезжайте за покупками, заказывайте доставку или пишите в мессенджер.</p>
    </div>

    <div class="grid">
      <div class="col">
      <section class="fg-panel shop">
        <h2>Магазин</h2>
        <dl class="rows">
          <div>
            <dt>Адрес</dt>
            <dd>{{ fgContacts.address }} <span class="fg-muted">({{ fgContacts.addressNote }})</span></dd>
          </div>
          <div>
            <dt>Телефон</dt>
            <dd><a :href="fgContacts.phoneHref" class="fg-link">{{ fgContacts.phone }}</a></dd>
          </div>
          <div>
            <dt>Продавец</dt>
            <dd>{{ fgContacts.owner }}</dd>
          </div>
        </dl>
        <a :href="fgContacts.mapHref" target="_blank" rel="noopener" class="fg-btn fg-btn--primary">
          Открыть в Яндекс Картах
        </a>
      </section>

      <section id="delivery" class="delivery">
        <h2>Доставка</h2>
        <p class="delivery__lead">
          Заказы на доставку в тот же день принимаем до 18:00. Привозим днём с 12:00 до 18:00 или
          вечером с 19:00 до 22:30.
        </p>
        <ul class="zones">
          <li v-for="d in fgDelivery" :key="d.id">
            <span>
              <strong>{{ d.title }}</strong>
              <small>{{ d.hint }}</small>
            </span>
            <b class="fg-price">{{ d.price ? fgFormatPrice(d.price) : 'бесплатно' }}</b>
          </li>
        </ul>
      </section>

      </div>
      <div class="col">
      <section id="schedule" class="fg-panel hours">
        <div class="hours__head">
          <h2>График работы</h2>
          <span v-if="now" class="status" :class="{ 'is-open': now.open }">
            {{ now.open ? `Открыто до ${to}:00` : `Закрыто, откроемся в ${from}:00` }}
          </span>
        </div>
        <ul class="days">
          <li v-for="(d, i) in days" :key="d" :class="{ 'is-today': now?.day === i }">
            <span>{{ d }}</span>
            <strong>{{ from }}:00–{{ to }}:00</strong>
          </li>
        </ul>
        <p class="fg-muted small">Без выходных, время томское (UTC+7).</p>
      </section>

      <section class="fg-panel msgs">
        <h2>Мессенджеры и соцсети</h2>
        <p class="fg-muted">
          Напишите в любой удобный мессенджер — ответим, поможем собрать заказ, а в WhatsApp
          добавим в группу для заказа продукции.
        </p>
        <FgMessengers />
      </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-items: start;

  h2 {
    font-size: 24px;
  }
}

.col {
  display: grid;
  gap: 16px;
}

.shop,
.hours,
.msgs {
  display: grid;
  gap: 16px;
}

.shop .fg-btn {
  justify-self: start;
}

.rows {
  display: grid;
  gap: 12px;

  div {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 12px;
  }

  dt {
    color: var(--fg-muted);
  }
}

.hours__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.status {
  padding: 4px 12px;
  border-radius: 8px;
  background: #fff;
  color: var(--fg-muted);
  font-size: 15px;
  font-weight: 500;

  &.is-open {
    background: var(--fg-leaf);
    color: #fff;
  }
}

.days {
  display: grid;

  li {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    border-radius: 10px;

    &.is-today {
      background: #fff;
      font-weight: 600;
    }
  }

  strong {
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
}

.small {
  font-size: 14px;
}

.delivery {
  display: grid;
  gap: 16px;
  padding: clamp(20px, 3vw, 32px);
  border-radius: var(--fg-r-lg);
  box-shadow: inset 0 0 0 1px var(--fg-line);

  &__lead {
    color: var(--fg-muted);
  }
}

.zones {
  display: grid;

  li {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 0;
    border-top: 1px solid var(--fg-line);
  }

  span {
    display: grid;
    gap: 2px;
  }

  strong {
    font-weight: 600;
  }

  small {
    color: var(--fg-muted);
    font-size: 14px;
    line-height: 1.4;
  }

  b {
    font-weight: 600;
  }
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .rows div {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
