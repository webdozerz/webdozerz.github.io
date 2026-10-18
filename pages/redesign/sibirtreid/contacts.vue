<script lang="ts" setup>
import SbIcon from '~/components/redesign/sibirtreid/SbIcon.vue'
import SbPriceForm from '~/components/redesign/sibirtreid/SbPriceForm.vue'

const copied = ref('')
const copy = async (key: string, text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = key
    setTimeout(() => {
      if (copied.value === key) copied.value = ''
    }, 1600)
  } catch {
    /* буфер обмена может быть недоступен */
  }
}
const allRequisites = sbRequisites.map((r) => `${r.k}: ${r.v}`).join('\n')
const mapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent('Новосибирск, Северный проезд, 33')}`

useSeoMeta({ title: 'Контакты — СибирьТрейд | Концепт редизайна' })
</script>

<template>
  <div class="sb-wrap sb-cont">
    <nav class="sb-crumbs" aria-label="Навигация">
      <NuxtLink :to="sbPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>Контакты</span>
    </nav>
    <h1 class="sb-page-title">Контакты</h1>

    <div class="sb-cont__top">
      <div class="sb-cont__office">
        <h2>Офис и склад в Новосибирске</h2>
        <a :href="sbContacts.phoneHref" class="sb-cont__phone">{{ sbContacts.phone }}</a>
        <a href="tel:+78006000864" class="sb-cont__phone2">+7 (800) 600-08-64 <small>бесплатно по России</small></a>
        <ul>
          <li><SbIcon name="pin" :size="20" /> {{ sbContacts.zip }}, {{ sbContacts.address }}</li>
          <li><SbIcon name="clock" :size="20" /> {{ sbContacts.hours }} ({{ sbContacts.tz }})</li>
          <li><SbIcon name="mail" :size="20" /> <a :href="`mailto:${sbContacts.email}`">{{ sbContacts.email }}</a></li>
          <li><SbIcon name="box" :size="20" /> Почтовый адрес: {{ sbContacts.post }}</li>
        </ul>
        <div class="sb-cont__actions">
          <a :href="sbContacts.telegram" target="_blank" rel="noopener" class="sb-btn"><SbIcon name="send" :size="18" /> Telegram</a>
          <a :href="sbContacts.whatsapp" target="_blank" rel="noopener" class="sb-btn sb-btn--soft"><SbIcon name="chat" :size="18" /> WhatsApp</a>
          <a :href="sbContacts.max" target="_blank" rel="noopener" class="sb-btn sb-btn--soft">MAX</a>
          <a :href="mapUrl" target="_blank" rel="noopener" class="sb-btn sb-btn--line"><SbIcon name="pin" :size="18" /> На карте</a>
        </div>
      </div>
      <div class="sb-cont__deps">
        <h2>Отделы</h2>
        <ul>
          <li v-for="d in sbContacts.departments" :key="d.title">
            <span>
              <strong>{{ d.title }}</strong>
              <small v-if="d.person">{{ d.person }}</small>
            </span>
            <a :href="d.href">{{ d.phone }}</a>
          </li>
        </ul>
      </div>
    </div>

    <section class="sb-section">
      <div class="sb-head">
        <div>
          <h2>Колл-центры в Якутии</h2>
          <p>Общий телефон в Якутске: <a href="tel:+74112359095" class="sb-link">+7 (4112) 35-90-95</a></p>
        </div>
      </div>
      <div class="sb-cont__cities">
        <div v-for="c in sbCities" :key="c.city">
          <strong>{{ c.city }}</strong>
          <span>{{ c.zip }}, {{ c.address }}</span>
        </div>
      </div>
    </section>

    <section id="requisites" class="sb-section sb-cont__req">
      <div class="sb-head">
        <h2>Реквизиты</h2>
        <button type="button" class="sb-btn sb-btn--soft" @click="copy('all', allRequisites)">
          <SbIcon :name="copied === 'all' ? 'check' : 'copy'" :size="18" />
          {{ copied === 'all' ? 'Скопировано' : 'Скопировать все' }}
        </button>
      </div>
      <dl>
        <div v-for="r in sbRequisites" :key="r.k">
          <dt>{{ r.k }}</dt>
          <dd>
            <span>{{ r.v }}</span>
            <button type="button" class="sb-iconbtn" :aria-label="`Скопировать: ${r.k}`" @click="copy(r.k, r.v)">
              <SbIcon :name="copied === r.k ? 'check' : 'copy'" :size="17" />
            </button>
          </dd>
        </div>
      </dl>
    </section>

    <section id="policy" class="sb-section sb-cont__policy">
      <p>
        Адрес на сайте носит информационный характер — заказ можно оформить онлайн через заявку или форму
        обратной связи. Политика конфиденциальности —
        <a href="https://sibirtreid.ru/policy/" target="_blank" rel="noopener" class="sb-link">на сайте оригинала</a>.
      </p>
    </section>

    <section class="sb-section">
      <SbPriceForm />
    </section>
  </div>
</template>

<style lang="scss">
.sb .sb-cont {
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 14px;
    margin-top: 24px;
  }

  &__office,
  &__deps {
    padding: clamp(24px, 4vw, 40px);
    border-radius: 32px;

    h2 {
      font-size: 24px;
    }
  }

  &__office {
    background: var(--sb-mint);

    ul {
      display: grid;
      gap: 10px;
      margin-top: 20px;
    }

    li {
      display: flex;
      gap: 10px;
      min-width: 0;

      .sb-icon {
        color: var(--sb-green);
      }

      a {
        color: var(--sb-green);
        font-weight: 700;
      }
    }
  }

  &__phone {
    display: inline-block;
    margin-top: 16px;
    font-family: var(--sb-display);
    font-size: clamp(30px, 4vw, 44px);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--sb-green-d);
  }

  &__phone2 {
    display: block;
    font-weight: 700;

    small {
      color: var(--sb-muted);
      font-weight: 500;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 24px;
  }

  &__deps {
    box-shadow: inset 0 0 0 1.5px var(--sb-line);

    ul {
      display: grid;
      margin-top: 12px;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 14px 0;

      &:not(:last-child) {
        border-bottom: 1px solid var(--sb-line);
      }
    }

    span {
      display: flex;
      flex-direction: column;
      line-height: 1.3;
    }

    small {
      color: var(--sb-muted);
    }

    a {
      font-weight: 700;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
      color: var(--sb-green);
    }
  }

  &__cities {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;

    div {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 18px 20px;
      border-radius: 22px;
      background: var(--sb-peach);
    }

    strong {
      font-family: var(--sb-display);
      font-size: 18px;
    }

    span {
      color: #6b5a4f;
      font-size: 14px;
    }
  }

  &__req dl {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 32px;
    padding: 12px 28px;
    border-radius: 28px;
    box-shadow: inset 0 0 0 1.5px var(--sb-line);

    > div {
      padding: 12px 0;
      border-bottom: 1px solid var(--sb-line);
    }

    dt {
      font-size: 13px;
      color: var(--sb-muted);
    }

    dd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;

      span {
        min-width: 0;
        overflow-wrap: anywhere;
      }
    }

    .sb-iconbtn {
      width: 36px;
      height: 36px;
      color: var(--sb-green);
    }
  }

  &__policy p {
    max-width: 760px;
    color: var(--sb-muted);
  }

  @media (max-width: 900px) {
    &__top,
    &__req dl {
      grid-template-columns: minmax(0, 1fr);
    }

    &__cities {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 520px) {
    &__cities {
      grid-template-columns: minmax(0, 1fr);
    }

    &__req dl {
      padding: 8px 18px;
    }

    &__deps li {
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }
  }
}
</style>
