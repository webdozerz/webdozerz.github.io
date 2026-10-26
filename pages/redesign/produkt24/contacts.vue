<script lang="ts" setup>
import PkIcon from '~/components/redesign/produkt24/PkIcon.vue'
import PkFeedback from '~/components/redesign/produkt24/PkFeedback.vue'
import PkMap from '~/components/redesign/produkt24/PkMap.vue'

useSeoMeta({ title: 'Контакты, доставка и оплата — 24produkt | Концепт редизайна' })

// Условия — цитатами с сайта оригинала, собраны на одну страницу (у оригинала они разбросаны по главной и слайдеру).
const terms = [
  { icon: 'truck', title: 'Доставка', text: 'Для компаний — доставка по Красноярску от 200 кг. Меньше — самовывоз со склада на Северном шоссе.' },
  { icon: 'card', title: 'Оплата', text: 'Любой способ расчёта: наличный, безналичный, по терминалу. Для постоянных покупателей — отсрочка платежа.' },
  { icon: 'scale', title: 'Опт и розница', text: 'Крупный опт — от 1 т, наличный расчёт без НДС. Мелкий опт до 1 т и розница — наличный расчёт.' },
  { icon: 'doc', title: 'Документы', text: 'На всю продукцию партнёры предоставляют полный пакет документов. Собственный склад, контроль качества и условий хранения.' },
]
</script>

<template>
  <div class="pk-wrap pk-contacts">
    <h1>Контакты</h1>

    <div class="pk-contacts__grid">
      <div class="pk-contacts__card">
        <p class="pk-contacts__label">Вопросы по заказу и доставке</p>
        <div class="pk-contacts__phones">
          <a v-for="ph in pkContacts.phones" :key="ph.href" :href="ph.href">{{ ph.label }}</a>
        </div>
        <ul>
          <li><PkIcon name="phone" :size="18" /><span>Обратный звонок: <a :href="pkContacts.callback.href">{{ pkContacts.callback.label }}</a></span></li>
          <li><PkIcon name="mail" :size="18" /><a :href="`mailto:${pkContacts.email}`">{{ pkContacts.email }}</a></li>
          <li><PkIcon name="max" :size="18" /><a :href="pkContacts.max" target="_blank" rel="noopener">Мы в MAX</a></li>
          <li><PkIcon name="star" :size="18" /><a :href="pkContacts.reviews" target="_blank" rel="noopener">Отзывы о нас</a></li>
        </ul>
        <div class="pk-contacts__hours">
          <p class="pk-contacts__label">Режим работы</p>
          <dl>
            <template v-for="h in pkContacts.hours" :key="h.days">
              <dt>{{ h.days }}</dt>
              <dd>{{ h.time }}</dd>
            </template>
          </dl>
        </div>
      </div>

      <div class="pk-contacts__map">
        <PkMap class="pk-contacts__mapbox" />
        <div>
          <p><PkIcon name="pin" :size="18" /><b>{{ pkContacts.address }}</b></p>
          <a :href="pkContacts.mapLink" target="_blank" rel="noopener" class="pk-btn pk-btn--line">Маршрут</a>
        </div>
      </div>
    </div>

    <section class="pk-section">
      <div class="pk-title"><h2>Доставка и оплата</h2></div>
      <div class="pk-terms">
        <div v-for="t in terms" :key="t.title" class="pk-terms__item">
          <span class="pk-terms__ico"><PkIcon :name="t.icon" /></span>
          <b>{{ t.title }}</b>
          <p>{{ t.text }}</p>
        </div>
      </div>
    </section>

    <section class="pk-section pk-contacts__bottom">
      <div>
        <div class="pk-title"><h2>Реквизиты</h2></div>
        <dl class="pk-req">
          <template v-for="[k, v] in pkContacts.requisites" :key="k">
            <dt>{{ k }}</dt>
            <dd>{{ v }}</dd>
          </template>
        </dl>
      </div>
      <PkFeedback />
    </section>
  </div>
</template>

<style lang="scss">
.pk-contacts {
  padding-top: 32px;

  > h1 {
    margin-bottom: 24px;
    font-size: 36px;
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
    gap: 24px;
  }

  &__card {
    display: grid;
    gap: 18px;
    align-content: start;
    padding: 28px;
    border-radius: var(--pk-r-lg);
    background: var(--pk-surface);

    ul {
      display: grid;
      gap: 10px;
    }

    li {
      display: flex;
      gap: 10px;

      .pk-icon {
        flex: none;
        margin-top: 2px;
        color: var(--pk-green);
      }

      a {
        color: var(--pk-ink);
        font-weight: 500;

        &:hover {
          color: var(--pk-green);
        }
      }
    }
  }

  &__label {
    color: var(--pk-muted);
    font-size: 14px;
  }

  &__phones {
    display: grid;
    gap: 2px;
    margin-top: -12px;

    a {
      color: var(--pk-ink);
      font-size: 28px;
      font-weight: 700;
      white-space: nowrap;

      &:hover {
        color: var(--pk-green);
      }
    }
  }

  &__hours dl {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 4px 24px;
    margin: 6px 0 0;

    dt {
      color: var(--pk-muted);
    }

    dd {
      margin: 0;
      color: var(--pk-ink);
      font-weight: 500;
    }
  }

  &__map {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--pk-line);
    border-radius: var(--pk-r-lg);

    .pk-map {
      flex: 1 1 auto;
      min-height: 320px;
    }

    > div {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 20px;

      p {
        display: flex;
        gap: 8px;
        color: var(--pk-ink);

        .pk-icon {
          flex: none;
          margin-top: 2px;
          color: var(--pk-green);
        }
      }
    }
  }

  &__bottom {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 32px;
    align-items: start;
  }

  @media (max-width: 989px) {
    &__grid,
    &__bottom {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 768px) {
    padding-top: 20px;

    > h1 {
      font-size: 28px;
    }
  }

  @media (max-width: 375px) {
    &__card {
      padding: 20px 16px;
    }

    &__phones a {
      font-size: 23px;
    }
  }
}

.pk-terms {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  &__item {
    display: grid;
    gap: 8px;
    align-content: start;
    padding: 22px;
    border: 1px solid var(--pk-line);
    border-radius: var(--pk-r-lg);

    b {
      color: var(--pk-ink);
      font-size: 17px;
    }

    p {
      color: var(--pk-muted);
      font-size: 14px;
    }
  }

  &__ico {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    margin-bottom: 4px;
    border-radius: var(--pk-r);
    background: var(--pk-soft);
    color: var(--pk-green);
  }

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;

    &__item {
      grid-template-columns: 44px minmax(0, 1fr);
      gap: 2px 14px;
      padding: 0;
      border: 0;
    }

    &__ico {
      grid-row: span 2;
      margin: 0;
    }
  }
}

.pk-req {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  margin: 0;
  border-top: 1px solid var(--pk-line);

  dt,
  dd {
    margin: 0;
    padding: 10px 0;
    border-bottom: 1px solid var(--pk-line);
  }

  dt {
    color: var(--pk-muted);
  }

  dd {
    color: var(--pk-ink);
  }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);

    dt {
      padding-bottom: 0;
      border-bottom: 0;
      font-size: 13px;
    }

    dd {
      padding-top: 2px;
    }
  }
}
</style>
