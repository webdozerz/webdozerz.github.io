<script lang="ts" setup>
import LfIcon from '~/components/redesign/lavkafish/LfIcon.vue'

useSeoMeta({ title: 'Доставка и оплата | Лавка Fish, концепт редизайна' })

const ui = useLavkafishUi()
const tue = computed(() => ui.batch('tue'))
const thu = computed(() => ui.batch('thu'))
const open = ref<number | null>(0)
</script>

<template>
  <div class="lf-wrap lf-page">
    <div class="lf-page__top">
      <h1>Доставка и оплата</h1>
      <p>Склада у нас нет: собираем заказы к привозу и сразу везём рыбу к вам. Доставка не в день заказа, а в день привоза.</p>
    </div>

    <div class="lf-dates">
      <div>
        <span>Томск и Северск</span>
        <b>{{ tue.day }}, {{ tue.dm }}</b>
        <small>Мурманский лосось и форель — {{ thu.day }}, {{ thu.dm }}</small>
      </div>
      <div>
        <span>Новосибирск и Алтай</span>
        <b>{{ thu.day }}, {{ thu.dm }}</b>
        <small>Охлаждённая форель, брикеты, креветки</small>
      </div>
    </div>

    <div class="lf-page__grid">
      <section class="lf-panel">
        <h2><LfIcon name="truck" :size="24" />Томск и Северск</h2>
        <ul class="lf-zones">
          <li v-for="z in lfZones.tomsk" :key="z.id">
            <span>{{ z.title }}</span
            ><b>{{ lfPrice(z.price) }}</b>
          </li>
          <li>
            <span>Подъём до квартиры</span><b>+{{ lfPrice(lfLift) }}</b>
          </li>
        </ul>
        <p class="lf-panel__note">Привозим {{ lfDeliveryHours.tomsk }}. Самовывоза нет.</p>
      </section>
      <section class="lf-panel">
        <h2><LfIcon name="pin" :size="24" />Новосибирск и Алтай</h2>
        <ul class="lf-zones">
          <li v-for="z in lfZones.nsk" :key="z.id">
            <span>{{ z.title }}</span
            ><b>{{ z.upTo ? `${z.price}–${lfPrice(z.upTo)}` : lfPrice(z.price) }}</b>
          </li>
          <li>
            <span>Подъём до квартиры</span><b>+{{ lfPrice(lfLift) }}</b>
          </li>
        </ul>
        <p class="lf-panel__note">Привозим {{ lfDeliveryHours.nsk }}.</p>
      </section>
      <section class="lf-panel lf-panel--wide">
        <h2><LfIcon name="card" :size="24" />Оплата</h2>
        <ul class="lf-facts">
          <li>
            <LfIcon name="scale" :size="22" />
            <span
              ><b>Рыба — по весу.</b> На сайте оплачиваете 1 кг каждой рыбы, доплату по факту взвешивания отдаёте курьеру наличными.</span
            >
          </li>
          <li>
            <LfIcon name="card" :size="22" />
            <span><b>Картой на сайте.</b> Через ПАО Сбербанк: МИР, VISA, Mastercard, JCB.</span>
          </li>
          <li>
            <LfIcon name="whatsapp" :size="22" />
            <span><b>Время доставки</b> пришлём в WhatsApp в течение суток после заказа. После этого адрес не меняем.</span>
          </li>
        </ul>
      </section>
    </div>

    <section class="lf-faq">
      <h2>Частые вопросы</h2>
      <div v-for="(f, i) in lfFaq" :key="f.q" class="lf-faq__item" :class="{ 'is-open': open === i }">
        <button type="button" :aria-expanded="open === i" @click="open = open === i ? null : i">
          {{ f.q }}<LfIcon name="down" :size="22" />
        </button>
        <p v-show="open === i">{{ f.a }}</p>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.lf-dates {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 20px 24px;
    border-radius: var(--lf-r-lg);
    background: var(--lf-accent-soft);
  }

  span {
    font-weight: 700;
  }

  b {
    font-size: clamp(24px, 2.6vw, 32px);
    font-weight: 900;
    line-height: 1.15;
  }

  small {
    color: var(--lf-text);
    font-size: 15px;
  }

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

ul.lf-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  li {
    display: flex;
    gap: 12px;
    color: var(--lf-text);

    .lf-icon {
      flex: none;
      margin-top: 2px;
      color: var(--lf-accent-text);
    }

    b {
      color: var(--lf-ink);
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }
}

.lf-faq {
  max-width: 880px;
  margin-top: 48px;

  h2 {
    margin-bottom: 12px;
    font-size: clamp(26px, 3vw, 36px);
  }

  &__item {
    border-top: 1px solid var(--lf-line);

    button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      width: 100%;
      padding: 18px 0;
      font-size: 19px;
      font-weight: 700;
      text-align: left;

      .lf-icon {
        flex: none;
        transition: transform 0.2s;
      }
    }

    p {
      padding-bottom: 18px;
      color: var(--lf-text);
    }

    &.is-open button .lf-icon {
      transform: rotate(180deg);
    }
  }
}
</style>
