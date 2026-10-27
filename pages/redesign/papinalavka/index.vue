<script lang="ts" setup>
import PlCard from '~/components/redesign/papinalavka/PlCard.vue'
import PlIcon from '~/components/redesign/papinalavka/PlIcon.vue'
import PlNatalya from '~/components/redesign/papinalavka/PlNatalya.vue'

useSeoMeta({ title: 'Папина лавка — натуральные продукты с экоферм | Концепт редизайна' })

// На доске — две ближайшие поставки, на которые ещё принимают заказы, и записка «экспресс из наличия».
// Если открытых поставок не осталось (концепт открыли через месяц), показываем две последние из анонса.
const now = ref(new Date())
onMounted(() => (now.value = new Date()))
const board = computed(() => {
  const open = plDeliveries.filter((d) => plOpen(d.date, now.value))
  return (open.length ? open : plDeliveries.slice(-2)).slice(0, 2)
})
const thumbs = (d: PlDelivery) => plDeliveryProducts(d).slice(0, 4)
const stock = plProducts.filter((p) => p.stock)
// По одному товару из разных разделов, чтобы записка не была из трёх одинаковых рыб.
const stockThumbs = stock.filter((p, i) => stock.findIndex((x) => x.sec === p.sec) === i).slice(0, 4)
const thursday = computed(() => now.value.getDay() === 4)

const sections = [36, 79, 64, 73, 81, 61, 38, 35, 82, 67, 43, 41].map((id) => plSection(id)).filter(Boolean) as PlSection[]

const tab = ref<(typeof plTabs)[number]['id']>('day')
const tabCount = (id: string) => plProducts.filter(plTabs.find((t) => t.id === id)!.test).length
const tabItems = computed(() => plProducts.filter(plTabs.find((t) => t.id === tab.value)!.test).slice(0, 8))
</script>

<template>
  <div class="pl-home">
    <section class="pl-wrap pl-hero">
      <div class="pl-hero__panel">
        <h1>Натуральные продукты с экоферм — под заказ, к поставке</h1>
        <p class="pl-hero__lead">
          Собираем заказы и привозим от фермеров для себя и для вас. Когда вы оформляете заказ, рыба ещё плавает, а грибы и ягоды прячутся в лесу:
          так мы ручаемся за свежесть.
        </p>
        <p class="pl-hero__sign">
          <img :src="plNatalya.photo" alt="" width="160" height="158" />
          <span>Наталья Папина</span>
        </p>
        <div class="pl-hero__actions">
          <NuxtLink :to="plSectionPath()" class="pl-btn pl-btn--main pl-btn--big">Каталог</NuxtLink>
          <NuxtLink :to="plPath('/deliveries')" class="pl-btn pl-btn--line pl-btn--big">Все поставки</NuxtLink>
        </div>
      </div>

      <div class="pl-board" aria-label="Ближайшие поставки">
        <p class="pl-board__title">Ближайшие поставки</p>
        <div class="pl-board__notes">
          <article v-for="(d, i) in board" :key="d.date" class="pl-note" :class="[`pl-note--${i}`, { 'is-closed': !plOpen(d.date, now) }]">
            <p class="pl-note__date">{{ plWeekday(d.date) }}, {{ plDay(d.date) }}</p>
            <h2>{{ d.title }}</h2>
            <div class="pl-note__thumbs">
              <img v-for="p in thumbs(d)" :key="p.id" :src="plImg(p.img)" :alt="p.name" width="96" height="64" loading="lazy" />
            </div>
            <p class="pl-note__deadline">
              <PlIcon name="clock" :size="16" />
              <span v-if="plOpen(d.date, now)">Заказ {{ plDeadlineShort(d.date) }}</span>
              <span v-else>Приём заказов закрыт</span>
            </p>
            <NuxtLink :to="`${plPath('/deliveries')}#d-${plParse(d.date).getDate()}`" class="pl-note__link">
              {{ plGoods(d.count) }} в поставке <PlIcon name="arrow" :size="16" />
            </NuxtLink>
          </article>
          <article class="pl-note pl-note--2 pl-note--stock">
            <p class="pl-note__date">{{ thursday ? 'завтра' : 'сегодня' }}</p>
            <h2>Экспресс из наличия — за 2–3 часа</h2>
            <div class="pl-note__thumbs">
              <img v-for="p in stockThumbs" :key="p.id" :src="plImg(p.img)" :alt="p.name" width="96" height="64" loading="lazy" />
            </div>
            <p class="pl-note__deadline">
              <PlIcon name="truck" :size="16" />
              <span>Все дни, кроме четверга</span>
            </p>
            <NuxtLink :to="{ path: plSectionPath(), query: { tab: 'stock' } }" class="pl-note__link">
              {{ plGoods(stock.length) }} в наличии <PlIcon name="arrow" :size="16" />
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <section class="pl-wrap pl-facts">
      <p><PlIcon name="pin" /><span><b>7 офисов выдачи</b> в Воронеже и Новой Усмани, ежедневно с 9:00</span></p>
      <p><PlIcon name="truck" /><span><b>Доставка бесплатно</b> по городу при заказе от 5000 ₽, иначе 400 ₽</span></p>
      <p><PlIcon name="return" /><span><b>Заменим или вернём деньги</b>, если продукт не понравился</span></p>
      <p><PlIcon name="user" /><span><b>Нас уже более 29 520</b> — тех, кто заказывает у фермеров с нами</span></p>
    </section>

    <section class="pl-wrap pl-section">
      <div class="pl-head">
        <h2>Каталог</h2>
        <NuxtLink :to="plSectionPath()">Все 34 раздела <PlIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="pl-secs">
        <NuxtLink v-for="s in sections" :key="s.id" :to="plSectionPath(s.id)" class="pl-sec">
          <span class="pl-sec__photo"><img :src="plSecImg(s.img)" :alt="s.name" width="224" height="224" loading="lazy" /></span>
          <span class="pl-sec__plank pl-wood">{{ plShortNames[s.id] ?? s.name }}</span>
          <small>{{ plGoods(s.count) }}</small>
        </NuxtLink>
      </div>
    </section>

    <section class="pl-wrap pl-section">
      <div class="pl-head">
        <h2>Что у нас сейчас</h2>
        <NuxtLink :to="{ path: plSectionPath(), query: { tab } }">Смотреть все <PlIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="pl-chips pl-home__tabs" role="tablist">
        <button
          v-for="t in plTabs"
          :key="t.id"
          type="button"
          role="tab"
          :aria-selected="tab === t.id"
          :class="{ 'is-active': tab === t.id }"
          @click="tab = t.id"
        >
          {{ t.label }}<small>{{ tabCount(t.id) }}</small>
        </button>
      </div>
      <div class="pl-grid">
        <PlCard v-for="p in tabItems" :key="p.id" :product="p" />
      </div>
    </section>

    <section class="pl-wrap pl-section">
      <div class="pl-how">
        <div class="pl-how__intro">
          <h2>Как привозим</h2>
          <p>Все продукты едут от фермеров под заказ. Охлаждённое — к поставке, то, что уже есть на полках, — в тот же день.</p>
          <NuxtLink :to="plPath('/delivery')" class="pl-btn pl-btn--line">Доставка и оплата</NuxtLink>
        </div>
        <ul class="pl-how__list">
          <li>
            <span class="pl-how__icon"><PlIcon name="snow" /></span>
            <div>
              <h3>Охлаждённое — к поставке</h3>
              <p>Каждый четверг свежая охлаждённая продукция от фермеров. Заказ — за сутки до дня поставки, до 13:00.</p>
            </div>
          </li>
          <li>
            <span class="pl-how__icon"><PlIcon name="truck" /></span>
            <div>
              <h3>Экспресс за 2–3 часа</h3>
              <p>Во все дни, кроме четверга, привезём то, что есть в наличии. По Воронежу 400 ₽, от 5000 ₽ — бесплатно.</p>
            </div>
          </li>
          <li>
            <span class="pl-how__icon"><PlIcon name="pin" /></span>
            <div>
              <h3>Самовывоз из 7 офисов</h3>
              <p>Ежедневно 9:00–20:00, в ТЦ «Пять столиц» до 22:00. Оплата наличными или картой.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="pl-wrap pl-section">
      <div class="pl-story">
        <div class="pl-story__text">
          <h2>Кто мы</h2>
          <p>
            Мы — это я, Папина Наталья, моя семья, друзья, знакомые и каждый, кто задумывается о том, что он и его дети едят на завтрак, обед и
            ужин.
          </p>
          <p>
            Мы ищем честных фермеров, изучаем хозяйства и привозим их продукты для себя и знакомых. Если вы чем-то недовольны — примем возврат,
            заменим продукт или вернём его стоимость.
          </p>
          <NuxtLink :to="plPath('/about')" class="pl-btn pl-btn--line">О нас и отзывы</NuxtLink>
        </div>
        <div class="pl-story__art">
          <span class="pl-story__engraving" aria-hidden="true" />
          <PlNatalya />
        </div>
      </div>
    </section>

    <section class="pl-wrap pl-section">
      <div class="pl-head">
        <h2>Отзывы</h2>
        <NuxtLink :to="plPath('/about') + '#reviews'">Все отзывы <PlIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="pl-reviews">
        <blockquote v-for="r in plReviews.slice(0, 3)" :key="r.date" class="pl-review">
          <p>{{ r.text }}</p>
          <footer>
            <b>{{ r.name }}</b><span>{{ r.date }}</span>
          </footer>
        </blockquote>
      </div>
    </section>

    <section class="pl-wrap pl-section">
      <div class="pl-head">
        <h2>Офисы выдачи</h2>
        <NuxtLink :to="plPath('/contacts')">Контакты <PlIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <ul class="pl-offices">
        <li v-for="o in plOffices" :key="o.street">
          <b>{{ o.street }}</b>
          <span>{{ o.city === 'Воронеж' ? o.where : `${o.city}, ${o.where}` }}</span>
          <small>ежедневно {{ o.hours }} · <a :href="plTel(o.phone)">{{ o.phone }}</a></small>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.pl-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
  gap: 24px;
  padding-top: 28px;

  &__panel {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 18px;
    padding: 40px;
    border-radius: 22px;
    background: var(--pl-kraft);
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      right: -30px;
      bottom: -24px;
      width: 277px;
      height: 205px;
      background: var(--pl-wood);
      opacity: 0.12;
      -webkit-mask: url('/redesign/papinalavka/engraving.png') center / contain no-repeat;
      mask: url('/redesign/papinalavka/engraving.png') center / contain no-repeat;
      pointer-events: none;
    }

    > * {
      position: relative;
      z-index: 1;
    }
  }

  h1 {
    font-size: clamp(30px, 3.4vw, 46px);
    line-height: 1.08;
  }

  &__lead {
    max-width: 520px;
    font-size: 18px;
  }

  &__sign {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--pl-wood);
    font-family: var(--pl-hand);
    font-size: 32px;
    font-weight: 700;
    line-height: 1.2;

    img {
      width: 52px;
      height: 52px;
      flex: none;
      border: 3px solid #8a5a35;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 6px;
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);

    &__panel {
      padding: 32px;
    }
  }

  @media (max-width: 768px) {
    padding-top: 16px;
    gap: 16px;

    &__panel {
      gap: 14px;
      padding: 24px 20px;
      border-radius: 18px;
    }

    &__lead {
      font-size: 16px;
    }

    &__sign {
      font-size: 28px;
    }
  }

  // На телефоне панель короче: под ней сразу доска с фото поставок.
  @media (max-width: 576px) {
    &__panel {
      gap: 12px;
      padding: 20px 16px;
    }

    h1 {
      font-size: 27px;
    }

    &__lead {
      font-size: 15px;
      line-height: 1.45;
    }

    &__sign {
      display: none;
    }

    &__actions {
      flex-wrap: nowrap;
      margin-top: 2px;

      .pl-btn {
        flex: 1 1 0;
        height: 48px;
        padding: 0 12px;
        font-size: 16px;
      }
    }
  }
}

// Доска из их деревянной планки: доски сложены друг на друга, записки приколоты сверху.
.pl-board {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px 22px 26px;
  border: var(--pl-board-border);
  border-radius: 22px;
  background: var(--pl-wood-board);

  &__title {
    color: var(--pl-board-ink);
    font-family: var(--pl-hand);
    font-size: 34px;
    font-weight: 700;
    line-height: 1;
  }

  &__notes {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    flex: 1;
  }

  @media (max-width: 989px) {
    &__notes {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      margin: 0 -22px;
      padding: 6px 22px 4px;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 18px 16px 20px;
    border-radius: 18px;

    &__title {
      font-size: 30px;
    }

    &__notes {
      margin: 0 -16px;
      padding-left: 16px;
      padding-right: 16px;
    }
  }
}

.pl-note {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 22px 16px 16px;
  border-radius: 6px;
  background: #fffaf1;
  box-shadow: 0 6px 14px rgba(40, 20, 8, 0.28);
  transform: rotate(-1deg);

  &--1 {
    transform: rotate(0.8deg);
  }

  &--2 {
    transform: rotate(-0.4deg);
  }

  // Гвоздик
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    width: 10px;
    height: 10px;
    margin-left: -5px;
    border-radius: 50%;
    background: #5a3a22;
    box-shadow: inset -2px -2px 0 rgba(0, 0, 0, 0.25);
  }

  &--stock &__date {
    color: var(--pl-accent);
  }

  &__date {
    color: var(--pl-red);
    font-family: var(--pl-hand);
    font-size: clamp(24px, 2.1vw, 30px);
    font-weight: 700;
    line-height: 1;
  }

  h2 {
    font-size: 17px;
    line-height: 1.25;
  }

  &__thumbs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
    margin-top: auto;
    padding-top: 6px;

    @media (max-width: 989px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    img {
      width: 100%;
      aspect-ratio: 1;
      height: auto;
      border-radius: 6px;
      object-fit: cover;
    }
  }

  &__deadline {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--pl-muted);
    font-size: 14px;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--pl-accent);
    font-weight: 700;
    font-size: 14px;
    white-space: nowrap;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
    }
  }

  &.is-closed {
    .pl-note__date {
      color: var(--pl-muted);
    }
  }

  @media (max-width: 989px) {
    flex: 0 0 min(300px, 78vw);
    scroll-snap-align: start;
  }
}

.pl-facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  padding-top: 24px;

  p {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 15px;
    line-height: 1.4;

    > .pl-icon {
      color: var(--pl-accent);
      margin-top: 1px;
    }
  }

  b {
    color: var(--pl-dark);
  }

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
}

// Разделы как у оригинала: круглое фото и деревянная табличка под ним.
.pl-secs {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 28px 20px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px 12px;
  }

  @media (max-width: 375px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.pl-sec {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  text-align: center;

  &__photo {
    display: block;
    width: 100%;
    max-width: 168px;
    aspect-ratio: 1;
    border: 5px solid var(--pl-kraft-2);
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
  }

  &__plank {
    position: relative;
    z-index: 1;
    max-width: 100%;
    margin-top: -16px;
    padding: 3px 12px 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 6px;
    font-family: var(--pl-hand);
    font-size: 21px;
    font-weight: 700;
    line-height: 1.3;
    box-shadow: 0 2px 0 rgba(60, 30, 10, 0.35);
  }

  small {
    margin-top: 8px;
    color: var(--pl-muted);
    font-size: 13px;
  }

  &:hover &__photo img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    &__plank {
      white-space: normal;
    }
  }

  @media (max-width: 576px) {
    &__plank {
      font-size: 18px;
      padding: 2px 8px 1px;
      line-height: 1.2;
    }
  }
}

.pl-home__tabs {
  margin-bottom: 20px;
}

.pl-how {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 2fr);
  gap: 32px;
  padding: 36px;
  border: 1px solid var(--pl-line);
  border-radius: 22px;

  &__intro {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;

    h2 {
      font-size: clamp(26px, 3vw, 34px);
    }

    p {
      color: var(--pl-muted);
    }
  }

  ul.pl-how__list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }

  li {
    display: flex;
    gap: 14px;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    flex: none;
    border-radius: 14px;
    background: var(--pl-accent-soft);
    color: var(--pl-accent-d);
  }

  h3 {
    margin-bottom: 6px;
    font-size: 18px;
  }

  li p {
    font-size: 15px;
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);

    ul.pl-how__list {
      grid-template-columns: minmax(0, 1fr);
      gap: 18px;
    }
  }

  @media (max-width: 768px) {
    padding: 22px 18px;
    border-radius: 18px;
  }
}

.pl-story {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  border-radius: 22px;
  background: var(--pl-kraft);
  overflow: hidden;

  &__text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 40px;

    h2 {
      font-size: clamp(26px, 3vw, 34px);
    }

    p {
      max-width: 560px;
    }
  }

  &__sign {
    color: var(--pl-wood);
    font-family: var(--pl-hand);
    font-size: 32px;
    font-weight: 700;
    line-height: 1;
  }

  &__art {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
  }

  // Гравюра с мельницей — бледным фоном за портретом
  &__engraving {
    position: absolute;
    right: 0;
    bottom: 0;
    display: block;
    width: 100%;
    max-width: 460px;
    aspect-ratio: 277 / 205;
    background: var(--pl-wood);
    opacity: 0.14;
    -webkit-mask: url('/redesign/papinalavka/engraving.png') center / contain no-repeat;
    mask: url('/redesign/papinalavka/engraving.png') center / contain no-repeat;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__art {
      padding: 8px 20px 32px;
    }
  }

  @media (max-width: 768px) {
    border-radius: 18px;

    &__text {
      padding: 24px 20px;
    }
  }
}

.pl-reviews {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
}

.pl-review {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  border: 1px solid var(--pl-line);
  border-radius: 18px;

  p {
    font-size: 15px;
  }

  footer {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    margin-top: auto;
    font-size: 14px;

    b {
      color: var(--pl-dark);
      font-family: var(--pl-hand);
      font-size: 22px;
      line-height: 1;
    }

    span {
      color: var(--pl-muted);
    }
  }
}

ul.pl-offices {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  li {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px 18px;
    border-radius: 16px;
    background: var(--pl-kraft);
    font-size: 14px;
    line-height: 1.35;
  }

  b {
    color: var(--pl-dark);
    font-size: 16px;
  }

  span {
    color: var(--pl-muted);
  }

  small {
    margin-top: auto;
    padding-top: 6px;
    font-size: 14px;

    a {
      font-weight: 700;
      white-space: nowrap;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
