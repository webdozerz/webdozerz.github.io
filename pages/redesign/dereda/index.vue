<script lang="ts" setup>
import DrIcon from '~/components/redesign/dereda/DrIcon.vue'
import DrShelf from '~/components/redesign/dereda/DrShelf.vue'
import DrTickets from '~/components/redesign/dereda/DrTickets.vue'

useSeoMeta({ title: 'Дереда — деревенская еда на дом в Новосибирске | Концепт редизайна' })

// Первый экран «фермеры за прилавком»: три хозяйства с фото их товара
const pick = (farmer: string, word: string) => drFarmerProducts(farmer).find((p) => p.title.includes(word)) ?? drFarmerProducts(farmer)[0]
const heroFarmers = [
  { f: drFarmer('bolshakova')!, p: pick('bolshakova', 'Пельмени домашние') },
  { f: drFarmer('labrie')!, p: pick('labrie', 'Буррата') },
  { f: drFarmer('petrovich')!, p: pick('petrovich', 'сотах') },
]
const farmerCount = (id: string) => drFarmerProducts(id).length

const newGoods = drProducts.filter((p) => p.isNew).concat(drProducts.filter((p) => !p.isNew && p.sec === 'molochnye-produkty').slice(0, 6))
const saleGoods = drProducts.filter((p) => p.sale)

const newsImg = (k: string) =>
  ({
    baklanov: pick('baklanov', 'Грудка')?.img,
    zamorozka: saleGoods.find((p) => p.title.includes('моховик'))?.img,
    bakaleya: pick('bolshakova', 'Аджика')?.img,
    konservaciya: pick('dereda', 'Тушенка')?.img,
  })[k]

const newsTo = (to: string) => {
  const [p, qs] = to.split('?')
  return qs ? { path: drPath(p), query: Object.fromEntries(new URLSearchParams(qs)) } : drPath(p)
}

const motto = ['Если овощи — то без химии!', 'Если курица — то счастливая!', 'Если будущее — то здоровое!']
const factorIcons = ['leaf', 'pan', 'doc', 'farmer', 'clock', 'truck', 'home']
</script>

<template>
  <div class="dr-home">
    <section class="dr-wrap dr-hero">
      <div class="dr-hero__panel">
        <div class="dr-hero__say">
          <img src="/redesign/dereda/girl.png" alt="" width="61" height="88" />
          <p>Если курица — то счастливая!</p>
        </div>
        <h1>Деревенская еда на дом</h1>
        <p class="dr-hero__lead">
          Продукты напрямую от фермеров Новосибирской области. Фермеры делают их под ваш заказ — и вы всегда знаете, у кого заказываете.
        </p>
        <DrTickets :n="2" class="dr-hero__tickets" />
        <div class="dr-hero__actions">
          <NuxtLink :to="drPath('/catalog')" class="dr-btn dr-btn--main dr-btn--big">Перейти в каталог</NuxtLink>
          <NuxtLink :to="drPath('/fermery')" class="dr-btn dr-btn--line dr-btn--big">Наши фермеры</NuxtLink>
        </div>
      </div>
      <div class="dr-hero__farm">
        <NuxtLink
          v-for="(h, i) in heroFarmers"
          :key="h.f.id"
          :to="{ path: drPath('/catalog'), query: { farmer: h.f.id } }"
          class="dr-hero__tile"
          :class="{ 'dr-hero__tile--big': i === 0 }"
        >
          <img :src="h.p.img" :alt="h.p.title" width="360" height="480" :loading="i ? 'lazy' : 'eager'" />
          <span class="dr-hero__plate">
            <small><DrIcon name="farmer" :size="16" />Фермер</small>
            <b>{{ h.f.name }}</b>
            <span>{{ h.f.about }}</span>
            <em>{{ farmerCount(h.f.id) }} {{ drPlural(farmerCount(h.f.id), 'товар', 'товара', 'товаров') }} в каталоге<DrIcon name="arrow" :size="16" /></em>
          </span>
        </NuxtLink>
      </div>
    </section>

    <section class="dr-wrap dr-sec dr-news" aria-label="Новости магазина">
      <div class="dr-news__track">
        <NuxtLink v-for="n in drNews" :key="n.title" :to="newsTo(n.to)" class="dr-news__card">
          <span class="dr-news__img" :class="`dr-news__img--${n.img}`">
            <img v-if="newsImg(n.img)" :src="newsImg(n.img)" alt="" width="120" height="120" loading="lazy" />
            <b v-else-if="n.img === 'levels'">до 6&nbsp;%</b>
            <b v-else>5&nbsp;%</b>
          </span>
          <span>
            <b>{{ n.title }}</b>
            <small>{{ n.text }}</small>
          </span>
        </NuxtLink>
      </div>
    </section>

    <section class="dr-wrap dr-sec">
      <div class="dr-sechead">
        <h2>Каталог</h2>
        <NuxtLink :to="drPath('/catalog')">Все товары<DrIcon name="right" :size="18" /></NuxtLink>
      </div>
      <div class="dr-cats">
        <NuxtLink v-for="s in drSections" :key="s.id" :to="drPath(`/catalog/${s.id}`)" class="dr-cats__item">
          <img :src="drSecImg(s.id)" alt="" width="120" height="120" loading="lazy" />
          <b>{{ s.title }}</b>
          <small>{{ s.total }} {{ drPlural(s.total, 'товар', 'товара', 'товаров') }}</small>
        </NuxtLink>
      </div>
    </section>

    <section class="dr-wrap dr-sec">
      <div class="dr-sechead">
        <h2>Новинки</h2>
        <NuxtLink :to="{ path: drPath('/catalog'), query: { tag: 'new' } }">Все новинки<DrIcon name="right" :size="18" /></NuxtLink>
      </div>
      <DrShelf :items="newGoods" />
    </section>

    <section class="dr-wrap dr-sec">
      <div class="dr-sechead">
        <h2>Товары по акции</h2>
        <NuxtLink :to="{ path: drPath('/catalog'), query: { tag: 'sale' } }">Все акции<DrIcon name="right" :size="18" /></NuxtLink>
      </div>
      <DrShelf :items="saleGoods" />
    </section>

    <section class="dr-wrap dr-sec">
      <div class="dr-sechead">
        <h2>У кого вы заказываете</h2>
        <NuxtLink :to="drPath('/fermery')">Все фермеры<DrIcon name="right" :size="18" /></NuxtLink>
      </div>
      <div class="dr-farmers">
        <NuxtLink
          v-for="f in drFarmers"
          :key="f.id"
          :to="{ path: drPath('/catalog'), query: { farmer: f.id } }"
          class="dr-farmers__item"
        >
          <img :src="drFarmerImg(f.id)" alt="" width="96" height="96" loading="lazy" />
          <span>
            <b>{{ f.name }}</b>
            <small>{{ farmerCount(f.id) }} {{ drPlural(farmerCount(f.id), 'товар', 'товара', 'товаров') }}</small>
          </span>
        </NuxtLink>
      </div>
    </section>

    <section class="dr-wrap dr-sec">
      <div class="dr-about">
        <div class="dr-about__text">
          <h2>Почему такие цены</h2>
          <p>
            Многие считают, что деревенские продукты должны стоить дешевле магазинных. Но деревенский бройлер растёт минимум 70 дней, а не 30–40, ощипывают
            его вручную, а на каждую поставку фермер оформляет ветеринарное свидетельство.
          </p>
          <ul class="dr-about__motto">
            <li v-for="m in motto" :key="m">{{ m }}</li>
          </ul>
          <NuxtLink :to="drPath('/o-nas#ceny')" class="dr-btn dr-btn--line">Все 7 причин и качество</NuxtLink>
        </div>
        <ul class="dr-about__list">
          <li v-for="(f, i) in drPriceFactors" :key="f.t">
            <DrIcon :name="factorIcons[i]" :size="24" />
            <span>
              <b>{{ f.t }}</b>
              <small>{{ f.d }}</small>
            </span>
          </li>
        </ul>
      </div>
    </section>

    <section class="dr-wrap dr-sec">
      <div class="dr-sechead">
        <h2>Отзывы</h2>
        <NuxtLink :to="drPath('/otzyvy')">Все отзывы<DrIcon name="right" :size="18" /></NuxtLink>
      </div>
      <div class="dr-revs">
        <figure v-for="r in drReviews" :key="r.name" class="dr-revs__item">
          <blockquote>{{ r.text }}</blockquote>
          <figcaption>
            <b>{{ r.name }}</b>
            <span>{{ r.product }}<template v-if="r.date"> · {{ r.date }}</template></span>
          </figcaption>
        </figure>
        <div class="dr-revs__more">
          <b>Отзывы о нас на площадках</b>
          <a :href="drContacts.twogis" target="_blank" rel="noopener">2ГИС<DrIcon name="ext" :size="16" /></a>
          <a :href="drContacts.yandex" target="_blank" rel="noopener">Яндекс Карты<DrIcon name="ext" :size="16" /></a>
          <a :href="drContacts.flamp" target="_blank" rel="noopener">Фламп<DrIcon name="ext" :size="16" /></a>
          <a :href="drContacts.vk" target="_blank" rel="noopener">ВКонтакте<DrIcon name="ext" :size="16" /></a>
        </div>
      </div>
    </section>

    <section class="dr-wrap dr-sec">
      <div class="dr-health">
        <div>
          <h2>Про здоровье</h2>
          <p>
            Каждую доставку мы привозим натуральные продукты, но пошли дальше: вместе с новосибирской компанией «Siberian Wellness» — бесплатный тест на
            дефициты витаминов и консультации специалистов.
          </p>
        </div>
        <NuxtLink :to="drPath('/o-nas#zdorovie')" class="dr-btn dr-btn--line">Подробнее</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.dr-home {
  padding-bottom: 72px;
}

.dr-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr);
  gap: 20px;
  padding-top: 24px;

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);
  }

  &__panel {
    display: grid;
    align-content: center;
    gap: 18px;
    padding: 36px 40px;
    border-radius: var(--dr-R);
    background: var(--dr-surface);

    @media (max-width: 576px) {
      padding: 24px 20px;
    }
  }

  &__say {
    display: flex;
    align-items: center;
    gap: 14px;

    img {
      width: 52px;
      height: auto;
    }

    p {
      position: relative;
      padding: 10px 16px;
      border-radius: 16px;
      background: #fff;
      color: var(--dr-accent-hover);
      font-weight: 700;

      &::before {
        content: '';
        position: absolute;
        left: -7px;
        top: 50%;
        border: 7px solid transparent;
        border-left: 0;
        border-right-color: #fff;
        transform: translateY(-50%);
      }
    }
  }

  &__lead {
    max-width: 560px;
    color: var(--dr-text);
    font-size: 18px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    @media (max-width: 576px) {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__farm {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 14px;
    min-height: 560px;

    @media (max-width: 1199px) {
      min-height: 0;
      grid-template-rows: 260px 260px;
    }

    @media (max-width: 576px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 260px 200px;
    }
  }

  &__tile {
    position: relative;
    overflow: hidden;
    border-radius: var(--dr-R);
    background: var(--dr-surface-2);
    color: var(--dr-text);

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }

    &:hover img {
      transform: scale(1.04);
    }

    &--big {
      grid-row: span 2;

      @media (max-width: 576px) {
        grid-row: auto;
        grid-column: span 2;
      }
    }
  }

  &__plate {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 12px;
    display: grid;
    gap: 2px;
    padding: 12px 14px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.96);

    small {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: var(--dr-muted);
      font-size: 13px;
    }

    b {
      color: var(--dr-brown);
      font-size: 18px;
      line-height: 1.25;
    }

    > span {
      font-size: 14px;
      line-height: 1.35;
    }

    em {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
      color: var(--dr-accent);
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
    }
  }

  & .dr-hero__tile:not(.dr-hero__tile--big) .dr-hero__plate > span {
    display: none;
  }

  @media (max-width: 576px) {
    & .dr-hero__tile:not(.dr-hero__tile--big) .dr-hero__plate {
      left: 8px;
      right: 8px;
      bottom: 8px;
      padding: 8px 10px;

      small {
        display: none;
      }

      b {
        font-size: 15px;
      }
    }
  }
}

.dr-news {
  &__track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(300px, 1fr);
    gap: 14px;
    overflow-x: auto;
    padding-bottom: 10px;
    scroll-snap-type: x mandatory;
    scrollbar-color: var(--dr-line) transparent;
    scrollbar-width: thin;

    @media (max-width: 576px) {
      grid-auto-columns: 82%;
    }
  }

  &__card {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr);
    align-items: center;
    gap: 14px;
    padding: 12px 16px 12px 12px;
    border: 1px solid var(--dr-line);
    border-radius: 18px;
    scroll-snap-align: start;

    > span:last-child {
      display: grid;
      gap: 2px;
      line-height: 1.3;
    }

    b {
      font-weight: 700;
    }

    small {
      color: var(--dr-muted);
      font-size: 14px;
    }

    &:hover {
      border-color: var(--dr-accent);
    }
  }

  &__img {
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    overflow: hidden;
    border-radius: 14px;
    background: var(--dr-accent-soft);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    b {
      color: var(--dr-accent);
      font-family: var(--dr-head);
      font-size: 22px;
      font-weight: 400;
      white-space: nowrap;
    }

    &--levels b {
      font-size: 17px;
    }
  }
}

.dr-cats {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  @media (max-width: 375px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__item {
    display: grid;
    justify-items: center;
    align-content: start;
    gap: 4px;
    padding: 18px 10px 16px;
    border-radius: var(--dr-R);
    background: var(--dr-surface);
    text-align: center;

    img {
      width: 96px;
      height: 96px;
      margin-bottom: 8px;
      border-radius: 50%;
      object-fit: cover;
      transition: transform 0.3s;

      @media (max-width: 576px) {
        width: 72px;
        height: 72px;
      }
    }

    b {
      max-width: 100%;
      line-height: 1.25;
      overflow-wrap: anywhere;
      hyphens: auto;

      @media (max-width: 576px) {
        font-size: 14px;
      }
    }

    small {
      color: var(--dr-muted);
      font-size: 14px;
    }

    &:hover {
      background: var(--dr-accent-soft);

      img {
        transform: scale(1.05);
      }
    }
  }
}

.dr-farmers {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  @media (max-width: 375px) {
    grid-template-columns: minmax(0, 1fr);
  }

  &__item {
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding: 10px 12px 10px 10px;
    border: 1px solid var(--dr-line);
    border-radius: 18px;

    img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
    }

    span {
      display: grid;
      min-width: 0;
      line-height: 1.25;
    }

    b {
      color: var(--dr-brown);
      overflow-wrap: anywhere;
    }

    small {
      color: var(--dr-muted);
      font-size: 14px;
    }

    &:hover {
      border-color: var(--dr-brown);
    }
  }
}

.dr-about {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 40px;
  padding: 40px;
  border-radius: var(--dr-R);
  background: var(--dr-surface);

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }

  @media (max-width: 576px) {
    padding: 24px 20px;
  }

  &__text {
    display: grid;
    align-content: start;
    justify-items: start;
    gap: 18px;
    font-size: 17px;
  }

  ul.dr-about__motto {
    display: grid;
    gap: 4px;

    li {
      color: var(--dr-accent-hover);
      font-family: var(--dr-head);
      font-size: 21px;
      line-height: 1.3;
    }
  }

  ul.dr-about__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 24px;

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }

    li {
      display: grid;
      grid-template-columns: 44px minmax(0, 1fr);
      gap: 12px;
    }

    svg {
      width: 44px;
      height: 44px;
      padding: 10px;
      border-radius: 12px;
      background: #fff;
      color: var(--dr-brown);
    }

    span {
      display: grid;
      gap: 2px;
      line-height: 1.4;
    }

    small {
      color: var(--dr-muted);
      font-size: 14px;
    }
  }
}

.dr-revs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)) minmax(0, 0.8fr);
  gap: 16px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }

  &__item {
    display: grid;
    align-content: space-between;
    gap: 16px;
    padding: 24px;
    border: 1px solid var(--dr-line);
    border-radius: var(--dr-R);

    blockquote {
      font-size: 18px;
      line-height: 1.5;
    }

    figcaption {
      display: grid;

      span {
        color: var(--dr-muted);
        font-size: 14px;
      }
    }
  }

  &__more {
    display: grid;
    align-content: start;
    gap: 10px;
    padding: 24px;
    border-radius: var(--dr-R);
    background: var(--dr-surface);

    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--dr-accent);
      font-weight: 600;
    }
  }
}

.dr-health {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 32px;
  padding: 28px 32px;
  border: 1px solid var(--dr-line);
  border-radius: var(--dr-R);

  > div {
    display: grid;
    gap: 8px;
    max-width: 820px;
  }

  @media (max-width: 576px) {
    padding: 22px 20px;
  }
}
</style>
