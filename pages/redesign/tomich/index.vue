<script lang="ts" setup>
import DishItem from '~/components/redesign/tomich/DishItem.vue'
import LunchBuilder from '~/components/redesign/tomich/LunchBuilder.vue'

const zoom = useTomichZoom()
const delivery = ref(tmDeliveryDate())
onMounted(() => (delivery.value = tmDeliveryDate()))

useSeoMeta({
  title: 'Торговый Дом «Томич» — концепт редизайна',
  ogTitle: 'Торговый Дом «Томич» — концепт редизайна',
  description:
    'Концепт нового сайта myaso.tomsk.ru: меню обедов в офис на завтра, конструктор обеда, корзина, магазины и кафе.',
  ogDescription:
    'Концепт нового сайта myaso.tomsk.ru: меню обедов в офис на завтра, конструктор обеда, корзина, магазины и кафе.',
  ogImage: 'https://andryushov.me/redesign/tomich/og.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const heroPhotos = [
  { photo: '6179', alt: 'Курочка сливочная с грибами' },
  { photo: '5143', alt: 'Драники с мясом' },
  { photo: '4659', alt: 'Гуляш из говядины' },
  { photo: '4791', alt: 'Стейк куриный' },
]

const icons: Record<string, string> = {
  meat: 'M15.5 4.5a5 5 0 0 1 4 6c-.6 3-3.4 5.5-7 6.5l-4 3-1.5-1.5 1.5-2.5C5 14 3.5 11 4.5 8.5 6 5 11 3 15.5 4.5zM14 9.5h.01',
  supply: 'M3 6h11v10H3zM14 9h4l3 3v4h-7M7.5 18.5h.01M17.5 18.5h.01',
  semi: 'M3 15c0-4 4-7 9-7s9 3 9 7c0 1-1 2-2 2H5c-1 0-2-1-2-2zM7.5 12l1 2M12 10.5v3M16.5 12l-1 2',
  lunch: 'M4 10h16v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7zM3 10h18M12 4v3M8 5l1 2M16 5l-1 2',
  shops: 'M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6',
}

const featured = ['6179', '5143', '4659', '8564', '4588', '5268']
  .map((id) => tmDishes.find((d) => d.photo === id))
  .filter((d): d is TmDish => Boolean(d))

const shops = tmPlaces.filter((p) => p.kind === 'shop')
const cafes = tmPlaces.filter((p) => p.kind === 'cafe')
const promo = 'https://myaso.tomsk.ru/images/upload/banner.jpg'
</script>

<template>
  <div class="tmh">
    <!-- Первый экран: стол с блюдами + главное сообщение -->
    <section class="tmh-hero">
      <div class="tmh-hero__strip">
        <img
          v-for="p in heroPhotos"
          :key="p.photo"
          :src="tmPhoto(p.photo)"
          :alt="p.alt"
          width="800"
          height="800"
        />
      </div>
      <div class="tm-wrap">
        <div class="tmh-hero__panel">
          <h1>Томск, ешь мясо!</h1>
          <p class="tmh-hero__lead">
            Фермерское мясо, домашние полуфабрикаты ручной лепки и горячие обеды в офис от семейной
            компании «Томич».
          </p>
          <div class="tmh-hero__cta">
            <NuxtLink :to="tmPath('/menu')" class="tm-btn">Заказать обед на завтра</NuxtLink>
            <NuxtLink :to="tmPath('/shops')" class="tm-btn tm-btn--ghost">Где купить мясо</NuxtLink>
          </div>
          <p class="tmh-hero__rule">
            Заказ сегодня — привезём завтра, {{ delivery.weekday }}, {{ delivery.day }}. Меню на
            следующий день формируется до 8:00.
          </p>
        </div>
      </div>
    </section>

    <!-- Пять направлений -->
    <section class="tm-wrap tmh-dirs" aria-label="Чем мы занимаемся">
      <NuxtLink
        v-for="d in tmDirections"
        :key="d.id"
        :to="tmPath('/about') + '#' + d.id"
        class="tmh-dir"
      >
        <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path :d="icons[d.id]" /></svg>
        <span class="tmh-dir__title">{{ d.title }}</span>
        <span class="tmh-dir__text">{{ d.short }}</span>
      </NuxtLink>
    </section>

    <!-- Меню на завтра + конструктор -->
    <section class="tm-wrap tmh-menu">
      <div class="tmh-menu__list">
        <div class="tmh-head">
          <h2>Меню на завтра</h2>
          <NuxtLink :to="tmPath('/menu')" class="tmh-head__link">Всё меню — {{ tmDishes.length }} блюд</NuxtLink>
        </div>
        <DishItem v-for="dish in featured" :key="dish.id" :dish="dish" />
      </div>
      <div class="tmh-menu__side">
        <LunchBuilder />
      </div>
    </section>

    <!-- Полуфабрикаты -->
    <section class="tmh-semi">
      <div class="tm-wrap tmh-semi__grid">
        <div>
          <h2>Полуфабрикаты ручной лепки</h2>
          <p>
            Из охлаждённого мяса, которое разделываем на своём предприятии. Продаём в собственных
            магазинах и привозим под заказ в магазин рядом с домом.
          </p>
          <ul class="tmh-semi__list">
            <li v-for="name in tmSemiProducts" :key="name">{{ name }}</li>
          </ul>
          <NuxtLink :to="tmPath('/shops')" class="tm-btn tm-btn--dark">Адреса магазинов</NuxtLink>
        </div>
        <button
          type="button"
          class="tmh-semi__promo"
          aria-label="Бифштексы и купаты: открыть баннер"
          @click="zoom.open([promo], 'Бифштексы и купаты собственного производства')"
        >
          <img :src="promo" alt="Бифштексы и купаты собственного производства" loading="lazy" width="799" height="362" />
        </button>
      </div>
    </section>

    <!-- Семья -->
    <section class="tm-wrap tmh-family">
      <img
        :src="tmGallery('stol1')"
        alt="Кафе-столовая «Томичка» на Кулагина, 6б"
        loading="lazy"
        width="1400"
        height="889"
      />
      <div>
        <h2>Мы прежде всего — семья</h2>
        <p>
          Всё готовим прежде всего для себя: главному критику и дегустатору нет ещё и двух лет.
          Бабушка — главный технолог производства и заведующая кафе-столовой «Томичка». Из её
          желания кормить внуков вкусным мясом «Томич» и стал семейным делом.
        </p>
        <p class="tmh-family__motto">Честная еда за честные деньги.</p>
        <NuxtLink :to="tmPath('/about')" class="tm-btn tm-btn--ghost">О компании</NuxtLink>
      </div>
    </section>

    <!-- Магазины и кафе -->
    <section class="tm-wrap tmh-places">
      <div class="tmh-head">
        <h2>Магазины и кафе</h2>
        <NuxtLink :to="tmPath('/shops')" class="tmh-head__link">Все адреса и карта</NuxtLink>
      </div>
      <div class="tmh-places__grid">
        <div class="tmh-places__col">
          <h3>{{ shops.length }} магазинов</h3>
          <ul>
            <li v-for="s in shops" :key="s.id">
              <span>{{ s.address }}</span>
              <span class="tm-muted">{{ s.name === 'Магазин' ? '' : s.name }}</span>
            </li>
          </ul>
        </div>
        <div class="tmh-places__col">
          <h3>Кафе и банкеты</h3>
          <ul>
            <li v-for="c in cafes" :key="c.id">
              <span>{{ c.name }}</span>
              <span class="tm-muted">{{ c.address }}</span>
            </li>
          </ul>
          <NuxtLink :to="tmPath('/banquets')" class="tm-btn tm-btn--ghost tm-btn--sm">Банкеты и бизнес-ланч</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.tmh {
  h2 {
    font-size: clamp(26px, 3.4vw, 36px);
  }
}

.tmh-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: 8px;

  &__link {
    font-weight: 700;
    color: var(--tm-red);
    border-bottom: 1.5px solid currentColor;
  }
}

// ---------- первый экран ----------
.tmh-hero {
  &__strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: #8a5a35;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 1;
      max-height: 420px;
      object-fit: cover;
    }
  }
  &__panel {
    position: relative;
    max-width: 680px;
    margin-top: -150px;
    padding: 36px 40px 32px;
    border-radius: var(--tm-r-lg);
    background: #fff;
    box-shadow: 0 16px 40px rgba(19, 36, 27, 0.14);

    h1 {
      color: var(--tm-green);
      font-size: clamp(40px, 6.4vw, 72px);
      line-height: 0.98;
    }
  }
  &__lead {
    margin-top: 16px;
    font-size: 18px;
    color: var(--tm-muted);
  }
  &__cta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 24px;
  }
  &__rule {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--tm-line);
    font-size: 14px;
    color: var(--tm-muted);
  }
}

// ---------- направления ----------
.tmh-dirs {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-top: 48px;
}

.tmh-dir {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 22px 20px;
  border-radius: var(--tm-r-lg);
  background: var(--tm-mint);
  transition: background 0.15s;

  svg {
    color: var(--tm-red);
    margin-bottom: 6px;
  }
  &__title {
    font-weight: 700;
    font-size: 16px;
    line-height: 1.25;
  }
  &__text {
    font-size: 13.5px;
    color: var(--tm-muted);
  }
  &:hover {
    background: var(--tm-soft);
  }
}

// ---------- меню + конструктор ----------
.tmh-menu {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  gap: 48px;
  align-items: start;
  margin-top: 64px;

  &__side {
    position: sticky;
    top: 130px;
  }
}

// ---------- полуфабрикаты ----------
.tmh-semi {
  margin-top: 72px;
  padding: 56px 0;
  background: var(--tm-mint);

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    gap: 48px;
    align-items: center;

    p {
      margin-top: 12px;
      color: var(--tm-muted);
      max-width: 520px;
    }
  }
  & &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 20px 0 28px;
    padding: 0;
    list-style: none;

    li {
      padding: 6px 12px;
      border-radius: 999px;
      background: #fff;
      font-weight: 600;
      font-size: 14px;
    }
  }
  &__promo {
    display: block;
    padding: 0;
    border: 0;
    border-radius: var(--tm-r-lg);
    overflow: hidden;
    background: none;

    img {
      width: 100%;
      height: auto;
      transition: transform 0.3s;
    }
    &:hover img {
      transform: scale(1.02);
    }
  }
}

// ---------- семья ----------
.tmh-family {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 48px;
  align-items: center;
  margin-top: 72px;

  img {
    width: 100%;
    height: auto;
    max-height: 380px;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    border-radius: var(--tm-r-lg);
  }
  p {
    margin-top: 14px;
    font-size: 16px;
    color: var(--tm-muted);
  }
  &__motto {
    color: var(--tm-ink) !important;
    font-weight: 700;
    font-size: 20px !important;
  }
  .tm-btn {
    margin-top: 24px;
  }
}

// ---------- адреса ----------
.tmh-places {
  margin-top: 72px;

  &__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 48px;
    margin-top: 16px;
  }
  &__col {
    min-width: 0;

    h3 {
      font-size: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--tm-line);
    }
    ul[class],
    ul {
      margin: 0 0 20px;
      padding: 0;
      list-style: none;
    }
    li {
      display: flex;
      justify-content: space-between;
      gap: 4px 16px;
      flex-wrap: wrap;
      padding: 11px 0;
      border-bottom: 1px solid var(--tm-line);
      font-weight: 600;

      .tm-muted {
        font-weight: 400;
      }
    }
  }
}

@media (max-width: 1080px) {
  .tmh-dirs {
    grid-template-columns: repeat(3, 1fr);
  }
  .tmh-menu {
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 32px;
  }
}

@media (max-width: 860px) {
  .tmh-menu {
    grid-template-columns: minmax(0, 1fr);

    &__side {
      position: static;
    }
  }
  .tmh-semi__grid,
  .tmh-family,
  .tmh-places__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
}

@media (max-width: 640px) {
  .tmh-hero {
    &__strip {
      grid-template-columns: repeat(2, 1fr);
    }
    &__panel {
      margin-top: -56px;
      padding: 24px 20px;
    }
    &__lead {
      font-size: 16px;
    }
    &__cta .tm-btn {
      flex: 1 1 100%;
    }
  }
  .tmh-dirs {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 32px;

    .tmh-dir:last-child {
      grid-column: 1 / -1;
    }
  }
  .tmh-dir {
    padding: 16px 14px;
  }
  .tmh-menu,
  .tmh-family,
  .tmh-places {
    margin-top: 48px;
  }
  .tmh-semi {
    margin-top: 48px;
    padding: 40px 0;
  }
  .tm-lunch {
    padding: 20px 16px;
  }
}
</style>
