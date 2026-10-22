<script lang="ts" setup>
import FtPicnic from '~/components/redesign/fermertomska/FtPicnic.vue'
import FtWhen from '~/components/redesign/fermertomska/FtWhen.vue'
import FtCard from '~/components/redesign/fermertomska/FtCard.vue'
import FtReviews from '~/components/redesign/fermertomska/FtReviews.vue'
import FtIcon from '~/components/redesign/fermertomska/FtIcon.vue'

useSeoMeta({ title: 'Куендатское — молочная продукция с доставкой по Томску | Концепт редизайна' })

const october = useState('ft-october', () => false)

const shelves: { id: FtTag; title: string }[] = [
  { id: 'hit', title: 'Хиты продаж' },
  { id: 'new', title: 'Новинки' },
  { id: 'sale', title: 'Акции' },
]
const shelf = ref<FtTag>('hit')
const shelfItems = computed(() => ftFamilies.filter((f) => ftHasTag(f.id, shelf.value)))

const counts = Object.fromEntries(ftSections.map((s) => [s.id, ftFamiliesOf(s.id).length]))
const butter = ftFindProduct('maslo-krestyanskoe-725-200gr')!
</script>

<template>
  <div class="ft-home">
    <section class="ft-wrap ft-hero">
      <div class="ft-hero__panel">
        <h1 class="ft-h1">Создаём продукты, которые объединяют семью за столом</h1>
        <p class="ft-hero__lead">
          Молоко, сметана, творог и масло «Крестьянское» с завода в Первомайском. Привозим по Томску утром,
          бесплатно — от&nbsp;{{ ftPrice(ftDelivery.freeFrom) }}.
        </p>
        <div class="ft-hero__actions">
          <NuxtLink :to="ftPath('/catalog')" class="ft-btn">
            Выбрать продукты
            <FtIcon name="arrow" :size="20" />
          </NuxtLink>
          <NuxtLink :to="ftPath('/delivery')" class="ft-btn ft-btn--ghost">Как мы возим</NuxtLink>
        </div>
        <div class="ft-hero__when">
          <FtWhen v-model:october="october" />
        </div>
      </div>
      <FtPicnic class="ft-hero__picnic" />
    </section>

    <section class="ft-wrap ft-section ft-cats" aria-labelledby="ft-cats-title">
      <div class="ft-head">
        <h2 id="ft-cats-title" class="ft-h2">Каталог</h2>
        <NuxtLink :to="ftPath('/catalog')" class="ft-head__link">Все товары <FtIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <ul class="ft-cats__list">
        <li v-for="s in ftSections" :key="s.id">
          <NuxtLink :to="ftPath(`/catalog/${s.id}`)" class="ft-cats__tile">
            <img :src="s.cover" alt="" width="200" height="200" loading="lazy" />
            <span class="ft-cats__name">{{ s.title }}</span>
            <span class="ft-cats__count">{{ counts[s.id] }} {{ counts[s.id] === 1 ? 'товар' : counts[s.id] < 5 ? 'товара' : 'товаров' }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section class="ft-wrap ft-section ft-shelf" aria-label="Подборки">
      <div class="ft-head">
        <div class="ft-shelf__tabs" role="tablist">
          <button
            v-for="s in shelves"
            :key="s.id"
            type="button"
            role="tab"
            class="ft-h2"
            :aria-selected="shelf === s.id"
            :class="{ 'is-on': shelf === s.id }"
            @click="shelf = s.id"
          >
            {{ s.title }}
          </button>
        </div>
        <NuxtLink :to="ftPath(`/catalog/${shelf}`)" class="ft-head__link">Смотреть все <FtIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="ft-grid">
        <FtCard v-for="f in shelfItems" :key="`${shelf}-${f.id}`" :family="f" />
      </div>
    </section>

    <section class="ft-wrap ft-section ft-route" aria-labelledby="ft-route-title">
      <div class="ft-route__box">
        <div class="ft-route__intro">
          <h2 id="ft-route-title" class="ft-h2">Как мы возим</h2>
          <p>
            Собираем заказы утром и сразу везём к вам домой или в офис — в машинах-рефрижераторах. Не копим продукты
            на складе в ожидании дня доставки.
          </p>
          <NuxtLink :to="ftPath('/delivery')" class="ft-head__link">Расписание и оплата <FtIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <ul class="ft-route__facts">
          <li>
            <FtIcon name="clock" :size="28" />
            <strong>Заказ до 15:00</strong>
            <span>Принимаем пн–пт. Возим пн–сб, в воскресенье — выходной.</span>
          </li>
          <li>
            <FtIcon name="truck" :size="28" />
            <strong>Бесплатно от {{ ftPrice(ftDelivery.freeFrom) }}</strong>
            <span>Меньше — {{ ftPrice(ftDelivery.courier) }}. Объединяйтесь с соседями и коллегами по работе.</span>
          </li>
          <li>
            <FtIcon name="store" :size="28" />
            <strong>Самовывоз с Бердской</strong>
            <span>{{ ftContacts.pickup }}. Заказ от {{ ftPrice(ftDelivery.pickupMin) }}.</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="ft-wrap ft-section ft-butter" aria-labelledby="ft-butter-title">
      <div class="ft-butter__photo">
        <img :src="ftImg('butter.jpg')" alt="Масло «Крестьянское» 72,5% на спиле дерева" width="1200" height="600" loading="lazy" />
      </div>
      <div class="ft-butter__text">
        <h2 id="ft-butter-title" class="ft-h2">Масло — наша гордость</h2>
        <p>
          «Крестьянское» 72,5% — победитель конкурса «Лучшие товары и услуги Томской области» и серебряная медаль
          «Молочные продукты Сибири». Мы начинали как маслозавод.
        </p>
        <ul class="ft-butter__facts">
          <li><FtIcon name="medal" :size="22" /> Серебро «Молочные продукты Сибири»</li>
          <li><FtIcon name="clock" :size="22" /> Хранится 35–60 суток</li>
        </ul>
        <div class="ft-butter__buy">
          <strong>от {{ ftPrice(butter.price) }}</strong>
          <NuxtLink :to="ftPath(`/product/${butter.id}`)" class="ft-btn">Выбрать фасовку</NuxtLink>
        </div>
      </div>
    </section>

    <section class="ft-wrap ft-section ft-about" aria-labelledby="ft-about-title">
      <div class="ft-about__text">
        <h2 id="ft-about-title" class="ft-h2">Свой завод в Первомайском</h2>
        <p>
          ООО ПСПК «Куендатский» — молочный завод в селе Первомайском Томской области. Делаем молоко, сметану, творог,
          кефир и масло без консервантов, поэтому молоко хранится всего 5 суток.
        </p>
        <ul class="ft-about__facts">
          <li v-for="f in ftFacts" :key="f.value">
            <strong>{{ f.value }}</strong>
            <span>{{ f.text }}</span>
          </li>
        </ul>
        <NuxtLink :to="ftPath('/about')" class="ft-head__link">О заводе <FtIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="ft-about__benefits">
        <div v-for="b in ftBenefits" :key="b.title" class="ft-about__benefit">
          <strong>{{ b.title }}</strong>
          <p>{{ b.text }}</p>
        </div>
      </div>
    </section>

    <section class="ft-wrap ft-section" aria-labelledby="ft-reviews-title">
      <div class="ft-head">
        <h2 id="ft-reviews-title" class="ft-h2">Отзывы покупателей</h2>
      </div>
      <FtReviews :reviews="ftReviews" store-key="home" />
    </section>
  </div>
</template>

<style lang="scss">
.ft .ft-hero {
  display: grid;
  grid-template-columns: minmax(0, 9fr) minmax(0, 15fr);
  gap: 20px;
  padding-top: 24px;

  &__panel {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 36px;
    border-radius: var(--ft-r-lg);
    background: var(--ft-surface);

    .ft-h1 {
      font-size: clamp(30px, 2.7vw, 42px);
    }
  }

  &__lead {
    color: var(--ft-text);
    font-size: 18px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__when {
    margin-top: auto;
    padding: 18px;
    border-radius: 20px;
    background: #fff;
  }

  @media (max-width: 1400px) {
    &__panel {
      padding: 28px;
    }

    &__lead {
      font-size: 17px;
    }
  }

  // Ниже 1200 колонка панели стала бы выше снимка: снимок наверх, панель под ним в две колонки.
  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);

    &__picnic {
      order: -1;
    }

    &__panel {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      grid-template-rows: auto auto 1fr;
      align-items: start;
      gap: 16px 32px;

      > :not(.ft-hero__when) {
        grid-column: 1;
      }
    }

    &__when {
      grid-column: 2;
      grid-row: 1 / 4;
      margin-top: 0;
    }
  }

  @media (max-width: 768px) {
    &__panel {
      display: flex;
    }

    &__when {
      margin-top: 4px;
    }
  }

  @media (max-width: 576px) {
    padding-top: 16px;

    &__panel {
      padding: 20px 16px;
    }

    &__lead {
      font-size: 16px;
    }

    &__actions .ft-btn {
      flex: 1 1 100%;
    }

    &__when {
      padding: 14px;
    }
  }
}

.ft .ft-cats {
  &__list {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 16px;
  }

  &__tile {
    display: grid;
    gap: 2px;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 1;
      margin-bottom: 8px;
      border-radius: 50%;
      object-fit: cover;
      background: var(--ft-surface);
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.04);
    }

    &:hover .ft-cats__name {
      color: var(--ft-accent);
    }
  }

  &__name {
    font-size: 17px;
    font-weight: 900;
    line-height: 1.25;
    text-align: center;
    hyphens: auto;
    overflow-wrap: anywhere;
  }

  &__count {
    color: var(--ft-muted);
    font-size: 14px;
    font-weight: 600;
    text-align: center;
  }

  @media (max-width: 989px) {
    &__list {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px 16px;
    }
  }

  @media (max-width: 576px) {
    &__list {
      gap: 16px 10px;
    }

    &__name {
      font-size: 15px;
    }

    &__count {
      font-size: 13px;
    }
  }
}

.ft .ft-shelf {
  padding-top: 8px;

  &__tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 24px;

    button {
      color: #b3bccb;
      transition: color 0.15s;

      &:hover {
        color: var(--ft-muted);
      }

      &.is-on {
        color: var(--ft-ink);
      }
    }
  }

  @media (max-width: 576px) {
    &__tabs {
      gap: 4px 16px;

      button {
        font-size: 22px;
      }
    }
  }
}

.ft .ft-route {
  &__box {
    display: grid;
    grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
    gap: 32px;
    padding: 36px;
    border-radius: var(--ft-r-lg);
    background: var(--ft-surface);
  }

  &__intro {
    display: grid;
    align-content: start;
    gap: 14px;

    p {
      color: var(--ft-text);
    }
  }

  &__facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;

    li {
      display: grid;
      align-content: start;
      gap: 8px;
      padding: 20px;
      border-radius: 20px;
      background: #fff;
      color: var(--ft-accent);
    }

    strong {
      color: var(--ft-ink);
      font-size: 18px;
      font-weight: 900;
      line-height: 1.25;
    }

    span {
      color: var(--ft-muted);
      font-size: 15px;
    }
  }

  @media (max-width: 1199px) {
    &__box {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 768px) {
    &__box {
      padding: 24px 16px;
    }

    &__facts {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

.ft .ft-butter {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  align-items: center;
  gap: 40px;

  &__photo img {
    width: 100%;
    height: auto;
    aspect-ratio: 2 / 1;
    border-radius: var(--ft-r-lg);
    object-fit: cover;
  }

  &__text {
    display: grid;
    gap: 16px;

    p {
      color: var(--ft-text);
    }
  }

  &__facts {
    display: grid;
    gap: 8px;

    li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;

      svg {
        color: var(--ft-orange);
      }
    }
  }

  &__buy {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 20px;

    strong {
      font-size: 24px;
      font-weight: 900;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
}

.ft .ft-about {
  display: grid;
  grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
  gap: 40px;

  &__text {
    display: grid;
    align-content: start;
    gap: 18px;

    > p {
      color: var(--ft-text);
      font-size: 17px;
    }
  }

  &__facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;

    li {
      display: grid;
      align-content: start;
      gap: 4px;
      padding-top: 14px;
      border-top: 2px solid var(--ft-accent);
    }

    strong {
      font-size: 28px;
      font-weight: 900;
      line-height: 1.1;
      white-space: nowrap;
    }

    span {
      color: var(--ft-muted);
      font-size: 14px;
    }
  }

  &__benefits {
    display: grid;
    gap: 12px;
  }

  &__benefit {
    display: grid;
    gap: 4px;
    padding: 20px 22px;
    border-radius: 20px;
    background: var(--ft-surface-2);

    strong {
      font-size: 18px;
      font-weight: 900;
    }

    p {
      color: var(--ft-muted);
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }

  @media (max-width: 576px) {
    &__facts {
      grid-template-columns: minmax(0, 1fr);

      strong {
        font-size: 24px;
      }
    }
  }
}
</style>
