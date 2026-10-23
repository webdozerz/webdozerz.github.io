<script lang="ts" setup>
import FmIcon from '~/components/redesign/fermatomsk/FmIcon.vue'
import FmCard from '~/components/redesign/fermatomsk/FmCard.vue'
import FmQty from '~/components/redesign/fermatomsk/FmQty.vue'
import FmMessage from '~/components/redesign/fermatomsk/FmMessage.vue'
import FmReviews from '~/components/redesign/fermatomsk/FmReviews.vue'

const order = useFermatomskOrder()
const ui = useFermatomskUi()

const group = ref<FmGroupId | 'all'>('all')
// Сыворотка — отдельным блоком «О пользе сыворотки» сразу под сеткой, как на оригинале.
const grid = fmProducts.filter((p) => p.id !== 'whey')
const shown = computed(() => (group.value === 'all' ? grid : grid.filter((p) => p.group === group.value)))
const whey = fmFindProduct('whey')!

const hero = [fmPhotos[0], fmPhotos[2], fmPhotos[5]]
const strip = [fmPhotos[1], fmPhotos[6], fmPhotos[8], fmPhotos[9]]
const openPhoto = (src: string) => {
  ui.photo.value = { list: fmPhotos, index: fmPhotos.findIndex((p) => p.src === src) }
}
</script>

<template>
  <div class="fm-home">
    <section class="fm-wrap fm-hero">
      <div class="fm-hero__panel">
        <h1>Фермерские молочные продукты в Томске</h1>
        <p class="fm-hero__lead">
          Семейная ферма в посёлке Рассвет. Козье и коровье молоко, творог, сыры, сметана, масло и куриные яйца — от своих коз,
          коров и кур.
        </p>
        <div class="fm-hero__cta">
          <NuxtLink :to="fmPath('/#products')" class="fm-btn">Выбрать продукты</NuxtLink>
          <a :href="fmContacts.telegram" class="fm-btn fm-btn--ghost" target="_blank" rel="noopener">
            <FmIcon name="telegram" :size="20" /> Написать в Telegram
          </a>
        </div>
        <ul class="fm-hero__facts">
          <li><FmIcon name="pin" /><span><b>25 км от Томска</b>посёлок Рассвет</span></li>
          <li><FmIcon name="shield" /><span><b>Ветпаспорт</b>у каждого животного</span></li>
          <li><FmIcon name="truck" /><span><b>Доставка бесплатно</b>по Томску, вт–пт</span></li>
        </ul>
      </div>
      <div class="fm-hero__photos">
        <button v-for="(p, i) in hero" :key="p.src" type="button" :class="`fm-hero__photo fm-hero__photo--${i}`" @click="openPhoto(p.src)">
          <img :src="p.src" :alt="p.alt" :loading="i ? 'lazy' : 'eager'" />
        </button>
      </div>
    </section>

    <section id="products" class="fm-wrap fm-section">
      <div class="fm-head">
        <div>
          <h2>Продукты и цены</h2>
          <p>При заказе укажите, какое количество продукта вам необходимо: отметьте его здесь, и список сам сложится в сообщение ферме.</p>
        </div>
      </div>
      <div class="fm-chips" role="tablist" aria-label="Разделы">
        <button type="button" role="tab" :aria-selected="group === 'all'" :class="{ 'is-on': group === 'all' }" @click="group = 'all'">
          Все <small>{{ grid.length }}</small>
        </button>
        <button
          v-for="g in fmGroups"
          :key="g.id"
          type="button"
          role="tab"
          :aria-selected="group === g.id"
          :class="{ 'is-on': group === g.id }"
          @click="group = g.id"
        >
          {{ g.title }} <small>{{ grid.filter((p) => p.group === g.id).length }}</small>
        </button>
      </div>
      <div class="fm-grid">
        <FmCard v-for="p in shown" :key="p.id" :product="p" />
      </div>
      <Transition name="fm-fade">
        <NuxtLink v-if="order.count.value" :to="fmPath('/order')" class="fm-strip">
          <span>
            В заказе <b>{{ order.count.value }}</b> {{ order.count.value === 1 ? 'продукт' : order.count.value < 5 ? 'продукта' : 'продуктов' }}
            на <b>{{ fmPrice(order.total.value) }}</b>
          </span>
          <span class="fm-strip__go">Оформить <FmIcon name="arrow" :size="20" /></span>
        </NuxtLink>
      </Transition>
    </section>

    <section class="fm-wrap fm-section">
      <div class="fm-whey">
        <button type="button" class="fm-whey__photo" @click="ui.product.value = whey.id">
          <img :src="whey.img" :alt="whey.name" width="300" height="400" loading="lazy" />
        </button>
        <div class="fm-whey__body">
          <h2>О пользе сыворотки</h2>
          <p v-for="t in whey.text!.slice(0, 2)" :key="t">{{ t }}</p>
          <div class="fm-whey__buy">
            <p class="fm-whey__price"><b>{{ fmPrice(whey.price) }}</b> за {{ whey.unit }}</p>
            <FmQty :id="whey.id" big />
          </div>
        </div>
      </div>
    </section>

    <section class="fm-wrap fm-section fm-howto">
      <div class="fm-howto__text">
        <h2>Заказ — одним сообщением</h2>
        <p>
          Как и раньше, заказ уходит ферме в Telegram или MAX. Только список с количеством, суммой, днём доставки и адресом собирается
          сам — не нужно перечислять продукты вручную.
        </p>
        <p v-if="ui.days.value.length" class="fm-howto__day">
          <FmIcon name="calendar" />
          <span>Ближайшая доставка — <b>{{ ui.days.value[0].phrase }}</b></span>
        </p>
        <NuxtLink :to="fmPath('/order')" class="fm-btn">{{ order.count.value ? 'Перейти к заказу' : 'Открыть заказ' }}</NuxtLink>
      </div>
      <FmMessage sample />
    </section>

    <section class="fm-wrap fm-section">
      <div class="fm-head">
        <div>
          <h2>Добро пожаловать на ферму!</h2>
          <p>{{ fmAbout[0] }} {{ fmAbout[1] }}</p>
        </div>
        <NuxtLink :to="fmPath('/about')" class="fm-head__link">Все фото и о ферме <FmIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="fm-farmstrip">
        <button v-for="p in strip" :key="p.src" type="button" @click="openPhoto(p.src)">
          <img :src="p.src" :alt="p.alt" loading="lazy" />
          <span>{{ p.alt }}</span>
        </button>
      </div>
    </section>

    <section class="fm-wrap fm-section">
      <div class="fm-head">
        <h2>Отзывы</h2>
      </div>
      <FmReviews />
    </section>

    <section class="fm-wrap fm-section">
      <div class="fm-call">
        <div>
          <h2>По вопросам приобретения звоните или пишите</h2>
          <a :href="fmContacts.phoneHref" class="fm-call__phone">{{ fmContacts.phone }}</a>
        </div>
        <div class="fm-call__btns">
          <a :href="fmContacts.telegram" class="fm-btn" target="_blank" rel="noopener"><FmIcon name="telegram" :size="20" /> Написать в Telegram</a>
          <a :href="fmContacts.max" class="fm-btn fm-btn--ghost" target="_blank" rel="noopener"><FmIcon name="max" :size="20" /> Написать в MAX</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.fm-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 20px;
  padding-top: 24px;

  &__panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 48px 44px 36px;
    border-radius: 24px;
    background: var(--fm-surface);

    h1 {
      font-size: clamp(34px, 3.9vw, 56px);
      line-height: 1.04;
      letter-spacing: -0.025em;
    }
  }

  &__lead {
    max-width: 520px;
    color: var(--fm-text);
    font-size: 18px;
  }

  &__cta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: auto;
    padding-top: 24px;
    border-top: 1px solid #e0e5e2;

    li {
      display: grid;
      grid-template-columns: 22px minmax(0, 1fr);
      gap: 10px;
      align-items: start;
      font-size: 14px;
      line-height: 1.35;
      color: var(--fm-text);
    }

    b {
      display: block;
      margin-bottom: 2px;
      color: var(--fm-ink);
      font-size: 15px;
      font-weight: 600;
    }

    .fm-icon {
      color: var(--fm-green);
    }
  }

  &__photos {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 12px;
    min-height: 560px;
  }

  &__photo {
    overflow: hidden;
    border-radius: 24px;
    background: var(--fm-photo);
    cursor: zoom-in;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s;
    }

    &:hover img {
      transform: scale(1.03);
    }

    &--0 {
      grid-row: 1 / 3;
    }
  }

  @media (max-width: 1400px) {
    &__facts {
      grid-template-columns: 1fr;
      gap: 10px;

      li {
        align-items: center;
      }

      b {
        display: inline;
        margin-right: 4px;
      }
    }
  }

  @media (max-width: 1199px) {
    &__panel {
      padding: 36px 32px 28px;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: 1fr;

    &__photos {
      order: -1;
      grid-template-columns: 1.1fr 1fr 1fr;
      grid-template-rows: 300px;
      min-height: 0;
    }

    &__photo--0 {
      grid-row: auto;
    }

    &__facts {
      grid-template-columns: repeat(3, minmax(0, 1fr));

      li {
        align-items: start;
      }

      b {
        display: block;
      }
    }
  }

  @media (max-width: 576px) {
    gap: 12px;
    padding-top: 12px;

    &__photos {
      grid-template-columns: 1.2fr 1fr;
      grid-template-rows: 130px 130px;
      gap: 8px;
    }

    &__photo {
      border-radius: 18px;
    }

    &__photo--0 {
      grid-row: 1 / 3;
    }

    &__panel {
      gap: 16px;
      padding: 26px 20px 22px;
      border-radius: 20px;
    }

    &__lead {
      font-size: 16px;
    }

    &__cta .fm-btn {
      flex: 1 1 100%;
    }

    &__facts {
      grid-template-columns: 1fr;

      li {
        align-items: center;
      }

      b {
        display: inline;
      }
    }
  }
}

.fm-chips {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  scrollbar-width: none;

  button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: none;
    height: 42px;
    padding: 0 16px;
    border-radius: var(--fm-r);
    background: var(--fm-surface);
    font-weight: 500;
    white-space: nowrap;
    transition: background 0.15s;

    small {
      color: var(--fm-muted);
      font-size: 13px;
    }

    &:hover {
      background: #e8ece9;
    }

    &.is-on {
      background: var(--fm-ink);
      color: #fff;

      small {
        color: #cfc6bb;
      }
    }
  }

  @media (max-width: 768px) {
    margin: 0 -20px 16px;
    padding: 0 20px;
  }

  @media (max-width: 375px) {
    margin: 0 -14px 16px;
    padding: 0 14px;
  }
}

.fm-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  margin-top: 20px;
  padding: 16px 22px;
  border-radius: var(--fm-r-lg);
  background: var(--fm-green-soft);
  color: var(--fm-ink);

  &__go {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--fm-green-d);
    font-weight: 600;
  }
}

.fm-whey {
  display: grid;
  grid-template-columns: minmax(220px, 300px) minmax(0, 1fr);
  gap: 48px;
  align-items: center;
  padding: 24px 48px 24px 24px;
  border-radius: 24px;
  background: var(--fm-surface);

  &__photo {
    overflow: hidden;
    border-radius: var(--fm-r-lg);
    background: var(--fm-photo);
    cursor: zoom-in;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 3 / 4;
      object-fit: cover;
    }
  }

  &__body {
    display: grid;
    gap: 14px;
    color: var(--fm-text);

    h2 {
      font-size: clamp(26px, 3vw, 38px);
      line-height: 1.1;
    }
  }

  &__buy {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 20px;
    margin-top: 8px;
  }

  &__price {
    color: var(--fm-muted);

    b {
      color: var(--fm-ink);
      font-size: 24px;
      font-weight: 700;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 140px minmax(0, 1fr);
    gap: 20px;
    align-items: start;
    padding: 16px;
  }

  // Телефон: фото и заголовок в строку, текст и покупка под ними на всю ширину.
  @media (max-width: 576px) {
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 14px 16px;
    align-items: stretch;

    &__body {
      display: contents;

      h2 {
        align-self: center;
        font-size: 24px;
      }

      > p,
      .fm-whey__buy {
        grid-column: 1 / -1;
      }

      > p {
        font-size: 15px;
      }
    }

    &__buy {
      margin-top: 0;
    }
  }
}

.fm-howto {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 48px;
  align-items: center;

  &__text {
    display: grid;
    justify-items: start;
    gap: 18px;
    color: var(--fm-text);

    h2 {
      font-size: clamp(26px, 3vw, 38px);
      line-height: 1.1;
    }
  }

  &__day {
    display: flex;
    gap: 10px;
    align-items: center;
    color: var(--fm-ink);

    .fm-icon {
      flex: none;
      color: var(--fm-green);
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.fm-farmstrip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  button {
    position: relative;
    overflow: hidden;
    aspect-ratio: 4 / 5;
    border-radius: var(--fm-r-lg);
    background: var(--fm-photo);
    cursor: zoom-in;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s;
  }

  button:hover img {
    transform: scale(1.04);
  }

  span {
    position: absolute;
    left: 10px;
    bottom: 10px;
    max-width: calc(100% - 20px);
    padding: 4px 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.92);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.3;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
}

.fm-call {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 36px 44px;
  border-radius: 24px;
  background: var(--fm-green-soft);

  h2 {
    max-width: 520px;
    font-size: clamp(22px, 2.4vw, 30px);
    line-height: 1.15;
  }

  &__phone {
    display: inline-block;
    margin-top: 10px;
    color: var(--fm-green-d);
    font-size: clamp(26px, 3vw, 36px);
    font-weight: 700;
    white-space: nowrap;
  }

  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 576px) {
    padding: 24px 20px;

    &__btns,
    &__btns .fm-btn {
      flex: 1 1 100%;
    }
  }
}

// Глобальный сброс портфолио ul[class] { margin: 0; padding: 0 } сильнее одного класса.
ul.fm-hero__facts {
  margin-top: auto;
  padding-top: 24px;
}
</style>
