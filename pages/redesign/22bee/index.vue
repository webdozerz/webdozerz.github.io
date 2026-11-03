<script lang="ts" setup>
import BzIcon from '~/components/redesign/22bee/BzIcon.vue'
import BzSortRow from '~/components/redesign/22bee/BzSortRow.vue'
import BzPriceForm from '~/components/redesign/22bee/BzPriceForm.vue'

const order = useBee22Order()
const ui = useBee22Ui()

const facts = [
  { icon: 'cube', big: '34 кг', text: 'минимальный заказ — один куботейнер' },
  { icon: 'scale', big: 'от 200 кг', text: 'цена ниже на 10–20 ₽ за кг' },
  { icon: 'truck', big: '2–5 дней', text: 'до отправки из Барнаула после оплаты' },
]

// Время на Алтае: покупатели из Москвы пишут вечером, а у пасеки уже ночь
const now = ref<Date | null>(null)
let tick: ReturnType<typeof setInterval> | undefined
const altai = computed(() => {
  if (!now.value) return null
  const parts = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Barnaul', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now.value)
  const h = Number(parts.find((p) => p.type === 'hour')?.value)
  const m = parts.find((p) => p.type === 'minute')?.value
  return { time: `${h}:${m}`, open: h >= 8 && h < 19 }
})

// Ленты документов и отзывов: прокрутка кнопками на десктопе, пальцем на телефоне
const docsEl = ref<HTMLElement | null>(null)
const revEl = ref<HTMLElement | null>(null)
const scroll = (el: HTMLElement | null, d: number) => el?.scrollBy({ left: d * el.clientWidth * 0.8, behavior: 'smooth' })

onMounted(() => {
  now.value = new Date()
  tick = setInterval(() => (now.value = new Date()), 30_000)
})
onBeforeUnmount(() => clearInterval(tick))
</script>

<template>
  <div class="bz-home">
    <section class="bz-wrap bz-hero">
      <div class="bz-hero__panel">
        <p class="bz-hero__place"><BzIcon name="pin" :size="18" />Алтайский край · сбор {{ bzYear }}</p>
        <h1>{{ bzContacts.motto }}</h1>
        <p class="bz-hero__lead">
          Алтайский мёд оптом <b>от {{ bzMoney(bzMinPrice) }} за кг</b> — с собственных пасек, по ГОСТу. Куботейнеры по 34 кг, документы
          на каждую партию, работаем в Меркурии.
        </p>
        <ul class="bz-hero__facts">
          <li v-for="f in facts" :key="f.big">
            <span class="bz-hero__ficon"><BzIcon :name="f.icon" :size="22" /></span>
            <span><b>{{ f.big }}</b>{{ f.text }}</span>
          </li>
        </ul>
        <div class="bz-hero__actions">
          <NuxtLink :to="{ path: bzPath(), hash: '#sorta' }" class="bz-btn bz-btn--main is-big">Выбрать сорта и цены</NuxtLink>
          <button type="button" class="bz-btn bz-btn--line is-big" @click="ui.priceModal.value = true">Получить прайс</button>
        </div>
      </div>
      <figure class="bz-hero__photo">
        <img src="/redesign/22bee/img/beekeeper.jpg" alt="Пчеловод осматривает рамку на пасеке" width="1280" height="722" />
        <figcaption>
          <b>{{ bzInStock }} сортов в наличии</b>
          <span>Свои пасеки на Алтае, отправка из Барнаула</span>
        </figcaption>
      </figure>
    </section>

    <section class="bz-wrap bz-adv" aria-label="Почему с нами работают">
      <ul class="bz-adv__list">
        <li v-for="a in bzAdvantages" :key="a.title">
          <BzIcon :name="a.icon" :size="24" />
          <span><b>{{ a.title }}</b>{{ a.text }}</span>
        </li>
      </ul>
    </section>

    <section id="sorta" class="bz-wrap bz-section bz-board">
      <div class="bz-head">
        <h2 class="bz-h2">Мёд весовой в куботейнерах</h2>
        <p>Цена за килограмм. Минимальный заказ — 1 куботейнер, 34 кг. Берёте от 200 кг одного сорта — считаем по второй цене.</p>
      </div>
      <div class="bz-board__list">
        <BzSortRow v-for="s in bzSorts" :key="s.id" :sort="s" />
      </div>
      <div v-if="order.count.value" class="bz-board__total">
        <p>
          В заявке {{ order.count.value }} {{ order.count.value === 1 ? 'сорт' : order.count.value < 5 ? 'сорта' : 'сортов' }}
          <template v-if="order.kg.value"> · <b>{{ bzKg(order.kg.value) }}</b> на <b>{{ bzMoney(order.total.value) }}</b></template>
          <template v-if="order.hasFrames.value"> + соты по весу</template>
        </p>
        <NuxtLink :to="bzPath('/zayavka')" class="bz-btn bz-btn--main">Оформить заявку <BzIcon name="arrow" :size="18" /></NuxtLink>
      </div>
    </section>

    <section id="dostavka" class="bz-wrap bz-section">
      <div class="bz-head">
        <h2 class="bz-h2">Оплата и доставка</h2>
        <p>Отправляем по всей России транспортными компаниями. Поможем выбрать самый выгодный вариант.</p>
      </div>
      <div class="bz-terms">
        <article class="bz-terms__card">
          <span class="bz-terms__icon"><BzIcon name="card" /></span>
          <h3>Оплата</h3>
          <ul class="bz-terms__list">
            <li v-for="p in bzPayment" :key="p">{{ p }}</li>
          </ul>
        </article>
        <article class="bz-terms__card">
          <span class="bz-terms__icon"><BzIcon name="truck" /></span>
          <h3>Отправка и доставка</h3>
          <ul class="bz-terms__list">
            <li v-for="d in bzDelivery" :key="d">{{ d }}</li>
          </ul>
        </article>
        <article class="bz-terms__card bz-terms__card--time">
          <span class="bz-terms__icon"><BzIcon name="clock" /></span>
          <h3>Мы на Алтае</h3>
          <p>Наш часовой пояс {{ bzContacts.tz }}. {{ bzContacts.hours }}.</p>
          <p v-if="altai" class="bz-terms__now" :class="{ 'is-open': altai.open }">
            <b>{{ altai.time }}</b>
            <span>{{ altai.open ? 'сейчас на Алтае — ответим сегодня' : 'сейчас на Алтае — ответим с 8:00 по местному' }}</span>
          </p>
          <a :href="`mailto:${bzContacts.email}`" class="bz-link"><BzIcon name="mail" :size="18" />{{ bzContacts.email }}</a>
        </article>
      </div>
    </section>

    <section id="dokumenty" class="bz-section">
      <div class="bz-wrap">
        <div class="bz-head">
          <h2 class="bz-h2">Анализы, сертификаты и паспорт пасеки</h2>
          <p>Договор поставки, паспорт пасеки, протоколы испытаний мёда в лаборатории и ветеринарное свидетельство — к каждой поставке.</p>
        </div>
        <div class="bz-strip-wrap">
          <div ref="docsEl" class="bz-reel">
            <button v-for="(d, i) in bzDocs" :key="d.img" type="button" class="bz-reel__doc" @click="ui.open(bzDocs, i)">
              <img :src="d.img" :alt="d.title" width="300" height="400" loading="lazy" />
              <span>{{ d.title }}</span>
            </button>
          </div>
          <button type="button" class="bz-iconbtn bz-reel__prev" aria-label="Назад" @click="scroll(docsEl, -1)"><BzIcon name="left" /></button>
          <button type="button" class="bz-iconbtn bz-reel__next" aria-label="Вперёд" @click="scroll(docsEl, 1)"><BzIcon name="right" /></button>
        </div>
      </div>
    </section>

    <section id="otzyvy" class="bz-section">
      <div class="bz-wrap">
        <div class="bz-head">
          <h2 class="bz-h2">Отзывы покупателей</h2>
          <p>Пишут после получения мёда — скриншоты переписки, {{ bzReviews.length }} штук. Нажмите, чтобы прочитать целиком.</p>
        </div>
        <div class="bz-strip-wrap">
          <div ref="revEl" class="bz-reel bz-reel--rev">
            <button v-for="(r, i) in bzReviews" :key="r.img" type="button" class="bz-reel__rev" @click="ui.open(bzReviews, i)">
              <img :src="r.img" :alt="r.title" width="450" height="900" loading="lazy" />
            </button>
          </div>
          <button type="button" class="bz-iconbtn bz-reel__prev" aria-label="Назад" @click="scroll(revEl, -1)"><BzIcon name="left" /></button>
          <button type="button" class="bz-iconbtn bz-reel__next" aria-label="Вперёд" @click="scroll(revEl, 1)"><BzIcon name="right" /></button>
        </div>
      </div>
    </section>

    <section id="foto" class="bz-wrap bz-section">
      <div class="bz-head">
        <h2 class="bz-h2">С пасеки</h2>
        <p>Наши пасеки, рамки и мёд нового сбора.</p>
      </div>
      <div class="bz-photos">
        <button v-for="(p, i) in bzPhotos" :key="p.img" type="button" :class="{ 'is-wide': p.wide }" @click="ui.open(bzPhotos, i)">
          <img :src="p.img" :alt="p.title" loading="lazy" />
        </button>
      </div>
    </section>

    <section id="prajs" class="bz-wrap bz-section">
      <div class="bz-ask">
        <div class="bz-ask__text">
          <h2 class="bz-h2">Заполните форму и получите оптовые цены</h2>
          <p>Укажите имя и телефон — пришлём прайс в MAX или WhatsApp. Мы находимся в Алтайском крае, наш часовой пояс {{ bzContacts.tz }}.</p>
          <ul>
            <li><BzIcon name="cube" :size="20" />Минимальный заказ — 1 куботейнер, 34 кг</li>
            <li><BzIcon name="repeat" :size="20" />Скидки на повторные заказы</li>
            <li><BzIcon name="list" :size="20" /><span>Уже выбрали сорта? <NuxtLink :to="bzPath('/zayavka')" class="bz-link">Отправьте заявку</NuxtLink></span></li>
          </ul>
        </div>
        <div class="bz-ask__form">
          <BzPriceForm title="Получить цены на мёд" button="Получить" />
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.bz-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr);
  gap: 24px;
  padding-top: 24px;

  &__panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 44px 44px 40px;
    border-radius: 24px;
    background: var(--bz-surface);
  }

  &__place {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--bz-muted);
    font-weight: 600;
  }

  h1 {
    font-size: clamp(38px, 4.6vw, 64px);
    line-height: 1;
  }

  &__lead {
    max-width: 540px;
    font-size: 18px;
    line-height: 1.5;

    b {
      color: var(--bz-ink);
      white-space: nowrap;
    }
  }

  ul.bz-hero__facts {
    display: grid;
    gap: 12px;
    margin-top: auto;
    padding-top: 8px;

    li {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    b {
      display: block;
      color: var(--bz-ink);
      font-size: 19px;
      line-height: 1.2;
    }
  }

  &__ficon {
    display: grid;
    place-items: center;
    flex: none;
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: #fff;
    color: var(--bz-ink);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__photo {
    position: relative;
    overflow: hidden;
    min-height: 520px;
    border-radius: 24px;
    background: var(--bz-surface);

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 40% 50%;
    }

    figcaption {
      position: absolute;
      left: 16px;
      bottom: 16px;
      display: grid;
      gap: 2px;
      max-width: calc(100% - 32px);
      padding: 12px 16px;
      border-radius: 14px;
      background: #fff;
      box-shadow: 0 8px 24px rgba(43, 38, 20, 0.16);

      b {
        color: var(--bz-ink);
        font-size: 17px;
      }

      span {
        color: var(--bz-muted);
        font-size: 14px;
      }
    }
  }

  @media (max-width: 1199px) {
    &__panel {
      padding: 32px;
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__photo {
      order: -1;
      min-height: 0;
      aspect-ratio: 16 / 9;
    }
  }
  @media (max-width: 576px) {
    gap: 12px;
    padding-top: 12px;

    &__panel {
      gap: 16px;
      padding: 24px 18px;
      border-radius: 20px;
    }

    &__photo {
      aspect-ratio: 4 / 3;
      border-radius: 20px;

      figcaption {
        left: 10px;
        bottom: 10px;
        padding: 9px 12px;

        b {
          font-size: 15px;
        }
        span {
          font-size: 13px;
        }
      }
    }

    &__lead {
      font-size: 16px;
    }

    &__actions .bz-btn {
      width: 100%;
    }
  }
}

.bz-adv {
  padding-top: 24px;

  ul.bz-adv__list {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;

    li {
      display: flex;
      gap: 12px;
      padding: 18px;
      border-radius: var(--bz-R);
      border: 1px solid var(--bz-line);
      font-size: 14px;
      line-height: 1.4;

      .bz-icon {
        flex: none;
        color: var(--bz-copper);
      }

      b {
        display: block;
        margin-bottom: 2px;
        color: var(--bz-ink);
        font-size: 15px;
      }
    }
  }

  @media (max-width: 1199px) {
    ul.bz-adv__list {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  @media (max-width: 768px) {
    ul.bz-adv__list {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
  }
  @media (max-width: 576px) {
    ul.bz-adv__list {
      grid-template-columns: minmax(0, 1fr);
      gap: 8px;

      li {
        padding: 14px;
      }
    }
  }
}

.bz-board {
  &__list {
    display: grid;
    gap: 10px;
  }

  &__total {
    position: sticky;
    bottom: 16px;
    z-index: 5;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px 20px;
    margin-top: 16px;
    padding: 12px 12px 12px 20px;
    border-radius: var(--bz-R);
    background: #fff;
    border: 1px solid var(--bz-line);
    box-shadow: var(--bz-pop);

    p {
      color: var(--bz-text);

      b {
        color: var(--bz-ink);
        white-space: nowrap;
      }
    }

    // на телефоне сумма уже в таббаре — итог обычным блоком, чтобы не закрывать прайс
    @media (max-width: 768px) {
      position: static;
      box-shadow: none;
    }
    @media (max-width: 576px) {
      padding: 12px;

      .bz-btn {
        width: 100%;
      }
    }
  }
}

.bz-terms {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  &__card {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 28px;
    border-radius: var(--bz-R);
    background: var(--bz-surface);

    h3 {
      font-size: 21px;
    }
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #fff;
    color: var(--bz-ink);
  }

  ul.bz-terms__list {
    display: grid;
    gap: 10px;

    li {
      position: relative;
      padding-left: 18px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.55em;
        width: 8px;
        height: 8px;
        border-radius: 2px;
        background: var(--bz-accent-line);
        transform: rotate(45deg);
      }
    }
  }

  &__now {
    display: grid;
    gap: 2px;
    padding: 14px 16px;
    border-radius: 12px;
    background: #fff;

    b {
      color: var(--bz-ink);
      font-size: 28px;
      line-height: 1.1;
    }

    span {
      color: var(--bz-muted);
      font-size: 14px;
    }

    &.is-open span {
      color: var(--bz-green);
    }
  }

  .bz-link {
    align-self: flex-start;
    margin-top: auto;
    word-break: break-all;
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

    &__card--time {
      grid-column: 1 / -1;
    }
  }
  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);

    &__card {
      padding: 22px 18px;
    }
  }
}

.bz-strip-wrap {
  position: relative;
}
.bz-reel {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 210px;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }

  > button {
    scroll-snap-align: start;
    text-align: left;
  }

  &__doc {
    display: grid;
    gap: 8px;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 3 / 4;
      object-fit: cover;
      object-position: top;
      border: 1px solid var(--bz-line);
      border-radius: 12px;
      background: #fff;
      transition: border-color 0.2s;
    }

    span {
      color: var(--bz-ink);
      font-size: 14px;
      font-weight: 600;
    }

    &:hover img {
      border-color: var(--bz-ink);
    }
  }

  &--rev {
    grid-auto-columns: 190px;
  }

  &__rev img {
    width: 100%;
    height: auto;
    aspect-ratio: 9 / 15;
    object-fit: cover;
    object-position: top;
    border-radius: 14px;
    background: var(--bz-surface);
    border: 1px solid var(--bz-line);
    transition: border-color 0.2s;
  }

  &__rev:hover img {
    border-color: var(--bz-ink);
  }

  &__prev,
  &__next {
    position: absolute;
    top: calc(50% - 36px);
    background: #fff !important;
    box-shadow: var(--bz-pop);
  }

  &__prev {
    left: -14px;
  }

  &__next {
    right: -14px;
  }

  @media (max-width: 768px) {
    grid-auto-columns: 160px;
    gap: 10px;
    margin: 0 -20px;
    padding: 0 20px 4px;
    scroll-padding: 0 20px;

    &--rev {
      grid-auto-columns: 150px;
    }

    &__prev,
    &__next {
      display: none;
    }
  }
  @media (max-width: 375px) {
    margin: 0 -14px;
    padding: 0 14px 4px;
    scroll-padding: 0 14px;
  }
}

.bz-photos {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 220px;
  gap: 12px;

  button {
    overflow: hidden;
    border-radius: var(--bz-R);
    background: var(--bz-surface);

    &.is-wide {
      grid-column: span 2;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: 200px;
  }
  @media (max-width: 576px) {
    grid-auto-rows: 150px;
    gap: 8px;
  }
}

.bz-ask {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 460px);
  gap: 32px 56px;
  padding: 48px;
  border-radius: 24px;
  background: var(--bz-surface);

  &__text {
    display: grid;
    align-content: start;
    gap: 16px;

    > p {
      max-width: 520px;
    }

    ul {
      display: grid;
      gap: 10px;
      margin-top: 8px;

      li {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--bz-ink);

        .bz-icon {
          flex: none;
          color: var(--bz-copper);
        }
      }
    }
  }

  &__form {
    padding: 28px;
    border-radius: 20px;
    background: #fff;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 32px;
  }
  @media (max-width: 576px) {
    padding: 22px 16px;
    border-radius: 20px;

    &__form {
      padding: 20px 16px;
    }
  }
}
</style>
