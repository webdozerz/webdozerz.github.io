<script lang="ts" setup>
import BpIcon from '~/components/redesign/baltikprodukt/BpIcon.vue'

useSeoMeta({ title: 'Контакты, оплата и доставка — Балтик продукт | Концепт редизайна' })

const ui = useBaltikproduktUi()
const mapSrc = 'https://yandex.ru/map-widget/v1/?text=%D0%A2%D1%83%D0%BB%D0%B0%2C%20%D1%83%D0%BB.%20%D0%94%D0%B5%D0%BC%D0%BE%D0%BD%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%2C%20197%D0%B0&z=15'
// Условия собраны с трёх страниц оригинала: «Контакты» (оплата), «О компании» (доставка, документы), FAQ (розница, минимум).
const terms = [
  { icon: 'store', title: 'Розница', text: bpTerms.retail },
  { icon: 'scale', title: 'Минимальный заказ', text: bpTerms.minimum },
  { icon: 'truck', title: 'Доставка', text: bpTerms.delivery },
  { icon: 'doc', title: 'Документы', text: bpTerms.docs },
]
const copyLegal = async () => {
  const text = bpContacts.legal.map(([k, v]) => `${k}: ${v}`).join('\n') + `\nАдрес: ${bpContacts.index}, ${bpContacts.address}`
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    /* буфер обмена может быть недоступен */
  }
  ui.say('Реквизиты скопированы')
}
</script>

<template>
  <div class="bp-wrap bp-contacts">
    <h1>Контакты и условия</h1>

    <div class="bp-contacts__grid">
      <div class="bp-contacts__card">
        <h2>Звоните и пишите</h2>
        <div class="bp-contacts__phones">
          <a v-for="ph in bpContacts.phones" :key="ph.href" :href="ph.href">{{ ph.label }}</a>
        </div>
        <a :href="`mailto:${bpContacts.email}`" class="bp-contacts__mail"><BpIcon name="mail" :size="20" />{{ bpContacts.email }}</a>
        <a :href="bpContacts.max" target="_blank" rel="noopener" class="bp-contacts__mail"><BpIcon name="max" :size="20" />Новости и поступления — канал в&nbsp;MAX</a>

        <h2 class="bp-contacts__h">Приезжайте</h2>
        <p class="bp-contacts__addr">{{ bpContacts.index }}, {{ bpContacts.address }}</p>
        <ul class="bp-hours">
          <li v-for="h in bpContacts.hours" :key="h.days">
            <span>{{ h.days }}</span>
            <b>{{ h.time }}</b>
          </li>
        </ul>
      </div>
      <div class="bp-map bp-contacts__map">
        <div class="bp-map__pin"><BpIcon name="pin" :size="28" /><span>{{ bpContacts.address }}</span></div>
        <iframe :src="mapSrc" title="Карта: Балтик продукт" loading="lazy" />
        <a :href="bpContacts.map" target="_blank" rel="noopener" class="bp-map__link">Открыть в Яндекс Картах</a>
      </div>
    </div>

    <section class="bp-section">
      <h2 class="bp-h2">Оплата</h2>
      <ul class="bp-contacts__pay">
        <li v-for="(p, i) in bpTerms.payment" :key="p">
          <BpIcon :name="['store', 'card', 'doc'][i]" />
          <span>{{ p }}</span>
        </li>
      </ul>
    </section>

    <section class="bp-section">
      <h2 class="bp-h2">Условия заказа</h2>
      <ul class="bp-contacts__terms">
        <li v-for="t in terms" :key="t.title">
          <span class="bp-ico"><BpIcon :name="t.icon" /></span>
          <span>
            <b>{{ t.title }}</b>
            <span>{{ t.text }}</span>
          </span>
        </li>
      </ul>
    </section>

    <section class="bp-section">
      <div class="bp-legal">
        <div>
          <h2 class="bp-h2">Реквизиты</h2>
          <p>Для договора и безналичной оплаты.</p>
        </div>
        <dl>
          <template v-for="[k, v] in bpContacts.legal" :key="k">
            <dt>{{ k }}</dt>
            <dd>{{ v }}</dd>
          </template>
          <dt>Адрес</dt>
          <dd>{{ bpContacts.index }}, {{ bpContacts.address }}</dd>
        </dl>
        <button type="button" class="bp-btn bp-btn--line" @click="copyLegal"><BpIcon name="copy" :size="20" /> Скопировать реквизиты</button>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.bp-contacts {
  padding-top: 28px;

  > h1 {
    margin-bottom: 24px;
    font-size: clamp(28px, 2.8vw, 38px);
    font-weight: 800;
  }
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 20px;
  }
  &__card {
    padding: 32px;
    border-radius: var(--bp-R);
    background: var(--bp-surface);

    h2 {
      font-size: 20px;
      font-weight: 700;
    }
  }
  &__h {
    margin-top: 28px;
  }
  &__phones {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px 16px;
    margin: 14px 0 16px;

    a {
      font-size: 18px;
      font-weight: 700;
      white-space: nowrap;

      &:hover {
        color: var(--bp-accent);
      }
    }
  }
  &__mail {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
    font-weight: 600;

    svg {
      flex: none;
      color: var(--bp-accent);
    }
    &:hover {
      color: var(--bp-accent);
    }
  }
  &__addr {
    margin: 10px 0 16px;
    font-size: 17px;
    font-weight: 600;
  }
  &__map {
    min-height: 460px;
  }
  &__pay {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 20px;

    li {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 20px;
      border: 1px solid var(--bp-line);
      border-radius: 18px;
      font-weight: 600;

      svg {
        flex: none;
        color: var(--bp-accent);
      }
    }
  }
  &__terms {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 20px;

    li {
      display: flex;
      gap: 14px;
      padding: 22px;
      border-radius: 18px;
      background: var(--bp-surface);

      > span:last-child {
        display: grid;
        gap: 4px;
        color: var(--bp-muted);
      }
      b {
        color: var(--bp-ink);
        font-size: 17px;
      }
    }
  }

  @media (max-width: 1199px) {
    &__phones {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
    &__map {
      min-height: 340px;
    }
    &__pay,
    &__terms {
      grid-template-columns: minmax(0, 1fr);
    }
    &__phones {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 576px) {
    padding-top: 16px;

    &__card {
      padding: 22px 18px;
    }
    &__phones {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

.bp-legal {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) auto;
  align-items: start;
  gap: 24px;
  padding: 32px;
  border: 1px solid var(--bp-line);
  border-radius: var(--bp-R);

  p {
    margin-top: 6px;
    color: var(--bp-muted);
  }
  dl {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 8px 20px;
    margin: 0;
  }
  dt {
    color: var(--bp-muted);
  }
  dd {
    margin: 0;
    font-weight: 600;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
  @media (max-width: 576px) {
    padding: 22px 18px;

    dl {
      grid-template-columns: minmax(0, 1fr);
      gap: 2px;
    }
    dd {
      margin-bottom: 8px;
    }
  }
}

ul.bp-contacts__pay,
ul.bp-contacts__terms {
  margin-top: 20px;
}
</style>
