<script lang="ts" setup>
import MrIcon from '~/components/redesign/mnerozy/MrIcon.vue'
import MrCard from '~/components/redesign/mnerozy/MrCard.vue'
import MrStems from '~/components/redesign/mnerozy/MrStems.vue'

useSeoMeta({ title: 'Мне розы — круглосуточная доставка цветов в Томске | Концепт редизайна' })

const { now, eta } = useMnerozyClock()

const pick = (ids: string[]) => ids.map((id) => mrFind(id)).filter((p): p is MrProduct => Boolean(p))
const hits = pick([
  'buket-iz-51-rozy',
  'buket-iz-51-rozy-ekvador',
  '25-chernichnyh-roz',
  'korobochka-romantika',
  '21-roza-miks-premium',
  'buket-5-korallovyh-pionov',
  '15-roz-soulmate-v-fetre',
  '101-roza-v-korzine',
])
const bouquets = mrProducts.filter((p) => p.sec === 'bukety-iz-cvetov').slice(0, 8)
const boxes = [
  ...mrProducts.filter((p) => p.sec === 'korobochki-s-cvetami').slice(0, 2),
  ...mrProducts.filter((p) => p.sec === 'korziny-iz-cvetov').slice(1, 3),
]
const gifts = pick([
  'mishka-belyj-dzhon',
  'konfety-raffaello',
  'sharik-krasnoe-serdce',
  'konfety-ferrero-rocher',
  'zajka-ushastik',
  'sharik-s-dnyom-rozhdeniya',
])
const reviews = mrReviews.slice(0, 3)
const zones = mrZones.filter((z) => !z.pickup)
</script>

<template>
  <div>
    <section class="mr-wrap mr-hero">
      <div class="mr-hero__panel">
        <h1>Круглосуточная доставка цветов в Томске</h1>
        <p class="mr-hero__lead">
          Розы Эквадор, Голландия и Кения, пионы, тюльпаны, букеты в коробках и корзинах — {{ mrTotalProducts }} позиций. Своя курьерская
          служба.
        </p>
        <div class="mr-hero__eta">
          <span class="mr-hero__clock"><MrIcon name="clock" :size="22" /></span>
          <p v-if="now">
            <span class="mr-hero__now">Привезём к <b>{{ eta }}</b></span>
            <span>сейчас {{ mrHM(now) }} · по Томску бесплатно, круглосуточно</span>
          </p>
          <p v-else>
            <span class="mr-hero__now">Привезём <b>за час</b></span>
            <span>по Томску бесплатно, круглосуточно</span>
          </p>
        </div>
        <div class="mr-hero__actions">
          <NuxtLink :to="mrPath('/catalog')" class="mr-btn mr-btn--accent">Весь каталог</NuxtLink>
          <NuxtLink :to="mrPath('/delivery')" class="mr-btn mr-btn--line">Зоны и цены доставки</NuxtLink>
        </div>
        <ul class="mr-hero__facts">
          <li>
            <MrIcon name="star" :size="20" />
            <span><b>4,7 в 2ГИС</b> и {{ mrReviewsTotal }} отзывов на сайте</span>
          </li>
          <li>
            <MrIcon name="pin" :size="20" />
            <span><b>Учебная, 8</b> — магазин открыт круглосуточно</span>
          </li>
        </ul>
      </div>
      <MrStems class="mr-hero__stems" hero />
    </section>

    <section class="mr-wrap mr-section mr-secs">
      <div class="mr-head">
        <h2>Каталог</h2>
        <NuxtLink :to="mrPath('/catalog')">Все {{ mrSections.length }} разделов <MrIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="mr-secs__row">
        <NuxtLink v-for="s in mrSections" :key="s.id" :to="mrPath(`/catalog/${s.id}`)" class="mr-secs__item">
          <img :src="s.img" :alt="s.title" width="120" height="120" loading="lazy" />
          <span>{{ s.short }}</span>
        </NuxtLink>
      </div>
    </section>

    <section class="mr-wrap mr-section">
      <div class="mr-head">
        <div>
          <h2>Часто заказывают</h2>
          <p>Постоянная акция: 21 роза Эквадор с длиной стебля 45–50 см — 2 890 ₽</p>
        </div>
        <NuxtLink :to="mrPath('/catalog/bukety-s-rozami')">Все розы <MrIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="mr-grid">
        <MrCard v-for="p in hits" :key="p.id" :p="p" />
      </div>
    </section>

    <section class="mr-wrap mr-section">
      <ul class="mr-free">
        <li v-for="f in mrFree" :key="f.title">
          <span class="mr-free__icon"><MrIcon :name="f.icon" :size="24" /></span>
          <span>
            <b>{{ f.title }}</b>
            <small>{{ f.text }}</small>
          </span>
        </li>
      </ul>
    </section>

    <section class="mr-wrap mr-section">
      <div class="mr-head">
        <h2>Сборные букеты</h2>
        <NuxtLink :to="mrPath('/catalog/bukety-iz-cvetov')">Все 138 <MrIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="mr-grid">
        <MrCard v-for="p in bouquets" :key="p.id" :p="p" />
      </div>
    </section>

    <section class="mr-wrap mr-section mr-duo">
      <div>
        <div class="mr-head">
          <h2>В коробке и корзине</h2>
          <NuxtLink :to="mrPath('/catalog/korobochki-s-cvetami')">Все <MrIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <div class="mr-duo__grid">
          <MrCard v-for="p in boxes" :key="p.id" :p="p" />
        </div>
      </div>
      <div class="mr-gifts">
        <div class="mr-head">
          <div>
            <h2>Добавить к букету</h2>
            <p>Конфеты, игрушки и шары привезём вместе с цветами</p>
          </div>
        </div>
        <div class="mr-gifts__list">
          <NuxtLink v-for="g in gifts" :key="g.id" :to="mrPath(`/product/${g.id}`)" class="mr-gifts__item">
            <img :src="g.img" :alt="g.title" width="72" height="72" loading="lazy" />
            <span>{{ g.title }}</span>
            <b>{{ g.opts ? 'от ' : '' }}{{ mrRub(g.price) }}</b>
          </NuxtLink>
        </div>
        <NuxtLink :to="mrPath('/catalog/podarki')" class="mr-btn mr-btn--line">Все подарки</NuxtLink>
      </div>
    </section>

    <section class="mr-wrap mr-section">
      <div class="mr-head">
        <div>
          <h2>Отзывы</h2>
          <p>{{ mrReviewsTotal }} отзывов на сайте, оценки на картах</p>
        </div>
        <NuxtLink :to="mrPath('/reviews')">Все отзывы <MrIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="mr-revs">
        <div class="mr-revs__ratings">
          <a v-for="r in mrRatings" :key="r.title" :href="r.href" target="_blank" rel="noopener">
            <b>{{ r.value }}</b>
            <span>{{ r.title }}</span>
          </a>
        </div>
        <article v-for="r in reviews" :key="r.author + r.date" class="mr-revs__item">
          <div class="mr-revs__stars" :aria-label="`Оценка ${r.rating} из 5`">
            <MrIcon v-for="i in 5" :key="i" name="star" :size="16" :class="{ 'is-on': i <= r.rating }" />
          </div>
          <p>{{ r.text }}</p>
          <footer>
            <b>{{ r.author }}</b> · {{ mrReviewDate(r.date) }}
            <span>{{ r.title }}</span>
          </footer>
        </article>
      </div>
    </section>

    <section class="mr-wrap mr-section mr-deliv">
      <div class="mr-deliv__text">
        <h2>Доставка по Томску и пригороду</h2>
        <p>
          Круглосуточно, без выходных. Назовите дату и время — курьер приедет к назначенному часу. Смена адреса меньше чем за час и
          повторная доставка — 150 ₽.
        </p>
        <NuxtLink :to="mrPath('/delivery')" class="mr-btn mr-btn--line">Доставка и оплата</NuxtLink>
      </div>
      <ul class="mr-deliv__zones">
        <li v-for="z in zones" :key="z.id">
          <span>
            <b>{{ z.title }}</b>
            <small>{{ z.text }}</small>
          </span>
          <strong :class="{ 'is-free': !z.price }">{{ z.price ? mrRub(z.price) : 'бесплатно' }}</strong>
        </li>
        <li>
          <span>
            <b>Самовывоз</b>
            <small>Учебная, 8 — круглосуточно · Усова, 4 — 9:00–21:00</small>
          </span>
          <strong class="is-free">бесплатно</strong>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.mr-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.78fr) minmax(0, 1.5fr);
  gap: 20px;
  padding-top: 24px;

  &__panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 32px;
    border-radius: var(--mr-r-panel);
    background: var(--mr-surface);
  }

  h1 {
    font-size: clamp(30px, 2.6vw, 40px);
  }

  &__lead {
    color: var(--mr-muted);
    font-size: 16px;
  }

  &__eta {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-radius: var(--mr-r-card);
    background: #fff;

    p {
      display: grid;
      font-size: 16px;
      line-height: 1.35;
      font-variant-numeric: tabular-nums;

      b {
        color: var(--mr-accent);
        font-weight: 800;
      }

      span {
        color: var(--mr-muted);
        font-size: 13px;
      }

      .mr-hero__now {
        color: var(--mr-ink);
        font-size: 19px;
        font-weight: 700;
      }
    }
  }

  &__clock {
    flex: none;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--mr-accent-soft);
    color: var(--mr-accent);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__facts {
    display: grid;
    gap: 10px;
    margin-top: auto;
    padding-top: 18px;
    border-top: 1px solid var(--mr-line-strong);
    font-size: 14px;

    li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    svg {
      flex: none;
      color: var(--mr-accent);
    }
  }
}

.mr-secs {
  &__row {
    display: flex;
    gap: 14px;
    overflow-x: auto;
    padding-bottom: 8px;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
    mask-image: linear-gradient(90deg, #000 92%, transparent);
  }

  &__item {
    flex: none;
    display: grid;
    justify-items: center;
    gap: 8px;
    width: 104px;
    scroll-snap-align: start;
    font-size: 14px;
    font-weight: 600;
    text-align: center;

    img {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      object-fit: cover;
      background: var(--mr-surface);
      transition: transform 0.3s;
    }

    &:hover {
      color: var(--mr-accent);

      img {
        transform: scale(1.05);
      }
    }
  }
}

.mr-free {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px;
    border-radius: var(--mr-r-card);
    background: var(--mr-surface);
  }

  span:last-child {
    display: grid;
    line-height: 1.35;
  }

  b {
    font-weight: 700;
  }

  small {
    color: var(--mr-muted);
    font-size: 13px;
  }

  &__icon {
    flex: none;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #fff;
    color: var(--mr-accent);
  }
}

.mr-duo {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 40px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px 20px;
  }
}

.mr-gifts {
  display: flex;
  flex-direction: column;

  &__list {
    flex: 1;
    display: grid;
    grid-auto-rows: 1fr;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__item {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr) auto;
    align-items: center;
    gap: 14px;
    padding: 8px 14px 8px 8px;
    border-radius: var(--mr-r-card);
    background: var(--mr-surface);

    img {
      width: 72px;
      height: 72px;
      border-radius: var(--mr-r);
      object-fit: cover;
    }

    span {
      font-weight: 600;
      line-height: 1.3;
    }

    b {
      font-weight: 800;
      white-space: nowrap;
    }

    &:hover span {
      color: var(--mr-accent);
    }
  }

  .mr-btn {
    align-self: flex-start;
  }
}

.mr-revs {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) repeat(3, minmax(0, 1fr));
  gap: 16px;

  &__ratings {
    display: grid;
    gap: 8px;

    a {
      display: flex;
      align-items: baseline;
      gap: 10px;
      padding: 14px 18px;
      border-radius: var(--mr-r-card);
      background: var(--mr-accent-soft);
      color: var(--mr-accent-dark);

      b {
        font-size: 26px;
        font-weight: 800;
      }

      span {
        font-weight: 600;
      }

      &:hover {
        background: #fbd6e0;
      }
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    border-radius: var(--mr-r-card);
    border: 1px solid var(--mr-line);

    p {
      flex: 1;
      font-size: 14px;
      line-height: 1.55;
    }

    footer {
      color: var(--mr-muted);
      font-size: 13px;

      b {
        color: var(--mr-ink);
      }

      span {
        display: block;
      }
    }
  }

  &__stars {
    display: flex;
    gap: 2px;
    color: var(--mr-line-strong);

    .is-on {
      color: #f2a20c;
      fill: currentColor;
    }
  }
}

.mr-deliv {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 40px;
  align-items: start;

  &__text {
    display: grid;
    gap: 16px;
    justify-items: start;

    h2 {
      font-size: 30px;
    }

    p {
      color: var(--mr-muted);
    }
  }

  &__zones {
    display: grid;
    border-radius: var(--mr-r-panel);
    background: var(--mr-surface);
    padding: 6px 20px;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 0;

      & + li {
        border-top: 1px solid var(--mr-line-strong);
      }
    }

    span {
      display: grid;
      min-width: 0;
    }

    b {
      font-weight: 700;
    }

    small {
      color: var(--mr-muted);
      font-size: 13px;
      line-height: 1.4;
    }

    strong {
      flex: none;
      font-weight: 800;
      white-space: nowrap;

      &.is-free {
        color: var(--mr-green);
      }
    }
  }
}

@media (max-width: 1400px) {
  .mr-revs {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    &__ratings {
      grid-column: 1 / -1;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}

@media (max-width: 1199px) {
  .mr-hero {
    grid-template-columns: minmax(0, 1fr);

    &__panel {
      padding: 28px;
    }

    &__facts {
      margin-top: 0;
    }
  }

  .mr-free {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mr-duo {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 989px) {
  .mr-revs {
    grid-template-columns: minmax(0, 1fr);
  }

  .mr-deliv {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;

    &__text h2 {
      font-size: 25px;
    }
  }
}

@media (max-width: 768px) {
  .mr-duo__grid {
    gap: 22px 12px;
  }
}

@media (max-width: 576px) {
  .mr-hero {
    padding-top: 12px;
    gap: 12px;

    &__panel {
      padding: 20px;
      gap: 16px;
    }

    &__lead {
      font-size: 15px;
    }

    &__actions .mr-btn {
      flex: 1 1 100%;
    }
  }

  .mr-secs__item {
    width: 84px;
    font-size: 13px;

    img {
      width: 76px;
      height: 76px;
    }
  }

  .mr-free {
    grid-template-columns: minmax(0, 1fr);

    li {
      padding: 14px;
    }
  }

  .mr-revs__ratings {
    gap: 6px;

    a {
      flex-direction: column;
      gap: 0;
      padding: 12px;

      b {
        font-size: 22px;
      }

      span {
        font-size: 13px;
      }
    }
  }

  .mr-deliv {
    &__zones {
      padding: 4px 14px;
    }

    &__text h2 {
      font-size: 22px;
    }
  }

  .mr-gifts__item {
    grid-template-columns: 56px minmax(0, 1fr) auto;
    gap: 10px;

    img {
      width: 56px;
      height: 56px;
    }

    span {
      font-size: 14px;
    }
  }
}
</style>
