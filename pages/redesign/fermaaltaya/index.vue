<script lang="ts" setup>
import FaIcon from '~/components/redesign/fermaaltaya/FaIcon.vue'
import FaMask from '~/components/redesign/fermaaltaya/FaMask.vue'
import FaCard from '~/components/redesign/fermaaltaya/FaCard.vue'
import FaShelf from '~/components/redesign/fermaaltaya/FaShelf.vue'
import FaWeek from '~/components/redesign/fermaaltaya/FaWeek.vue'
import FaStars from '~/components/redesign/fermaaltaya/FaStars.vue'

const cart = useFermaAltaya()

const hits = faProducts.filter((p) => p.hit)
const tab = ref<'new' | 'sale'>('new')
// у «Куриного супа» на сайте фермы фото капусты — на полку главной не ставим
const shelf = computed(() => faProducts.filter((p) => p.id !== 'kurinyj-sup-s-domashnej-lapshoj' && (tab.value === 'new' ? p.isNew : !!p.old)))
// плитка раздела — фото первого товара, снимок которого ещё не занят соседней плиткой (у молочного и йогуртов они общие)
const tiles = faGroups.flatMap((g) => g.secs)
const covers: Record<string, string> = {}
const usedImg = new Set<string>()
// у молочного и йогуртов первые снимки — одинаковые бутылки: берём масло и йогурт с малиной
const pick: Record<string, string> = { moloko: 'Масло сливочное 0,2', jogurty: 'Йогурт c малиной' }
tiles.forEach((id) => {
  const p =
    faInSection(id).find((x) => pick[id] && x.title.startsWith(pick[id])) ?? faInSection(id).find((x) => !usedImg.has(x.img)) ?? faInSection(id)[0]
  usedImg.add(p.img)
  covers[id] = p.img
})
const cover = (id: string) => covers[id]
const storesCount = faStores.reduce((a, s) => a + s.list.length, 0)
</script>

<template>
  <div class="fa-home">
    <section class="fa-wrap fa-hero">
      <div class="fa-hero__panel">
        <h1>Честные продукты для вашей семьи</h1>
        <p class="fa-hero__lead">
          Молоко, творог, мясо и пельмени со своей фермы в Алтайском крае. Привозим в Новосибирск и Барнаул бесплатно — от {{ faMoney(FA_MIN) }}.
        </p>
        <div class="fa-hero__btns">
          <NuxtLink :to="faPath('/catalog')" class="fa-btn fa-btn--main">Выбрать продукты<FaIcon name="arrow" :size="18" /></NuxtLink>
          <NuxtLink :to="faPath('/dostavka')" class="fa-btn fa-btn--line">Как работает доставка</NuxtLink>
        </div>
      </div>
      <figure class="fa-hero__photo">
        <img :src="faLocal('cows.jpg')" alt="Коровы фермы на пастбище" width="1080" height="517" fetchpriority="high" />
        <figcaption>
          <b>Готовим продукт под вашу заявку</b>
          <span>Не храним на складе: собираем заказ ночью перед доставкой</span>
        </figcaption>
      </figure>
      <div class="fa-hero__week">
        <div class="fa-hero__wt">
          <b>Ближайшая доставка</b>
          <div class="fa-tabs fa-hero__city" role="group" aria-label="Город доставки">
            <button v-for="(c, k) in faCities" :key="k" type="button" :class="{ 'is-on': cart.city.value === k }" @click="cart.city.value = k as FaCity">
              {{ c.title }}
            </button>
          </div>
        </div>
        <FaWeek />
      </div>
    </section>

    <section class="fa-wrap fa-section">
      <div class="fa-head">
        <h2>Разделы</h2>
        <NuxtLink :to="faPath('/catalog')" class="fa-head__more">Весь каталог · {{ faProducts.length }}<FaIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="fa-tiles">
        <NuxtLink v-for="id in tiles" :key="id" :to="faPath(`/catalog/${id}`)" class="fa-tile">
          <img :src="faImg(cover(id))" alt="" width="300" height="300" loading="lazy" />
          <span class="fa-tile__t">
            <b>{{ faSection(id)!.title }}</b>
            <small>{{ faPlural(faSection(id)!.count, 'товар', 'товара', 'товаров') }}</small>
          </span>
          <span class="fa-tile__ic"><FaMask :sec="id" :size="22" /></span>
        </NuxtLink>
      </div>
    </section>

    <section class="fa-wrap fa-section">
      <div class="fa-head">
        <div>
          <h2>Хиты фермы</h2>
          <p>Что берут чаще всего — творог, сметана, пельмени и курица</p>
        </div>
        <NuxtLink :to="{ path: faPath('/catalog'), query: { f: 'hit' } }" class="fa-head__more">Все хиты<FaIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <FaShelf>
        <FaCard v-for="p in hits" :key="p.id" :p="p" />
      </FaShelf>
    </section>

    <section class="fa-wrap fa-section">
      <div class="fa-head">
        <div class="fa-tabs fa-home__tabs">
          <button type="button" :class="{ 'is-on': tab === 'new' }" @click="tab = 'new'">Новинки</button>
          <button type="button" :class="{ 'is-on': tab === 'sale' }" @click="tab = 'sale'">Снижена цена</button>
        </div>
        <NuxtLink :to="{ path: faPath('/catalog'), query: { f: tab } }" class="fa-head__more">Показать все<FaIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <FaShelf :key="tab">
        <FaCard v-for="p in shelf" :key="p.id" :p="p" />
      </FaShelf>
    </section>

    <section class="fa-wrap fa-section">
      <div class="fa-ship">
        <img :src="faLocal('van.jpg')" alt="Фургон Фермы Алтая" width="940" height="450" loading="lazy" />
        <div class="fa-ship__text">
          <h2>Привезём до квартиры</h2>
          <ul class="fa-ship__list">
            <li>
              <FaIcon name="truck" />
              <span><b>Пн–вт и чт–пт, с 10 до 20.</b> Своими курьерами по Новосибирску, Бердску, Академгородку, Барнаулу и Новоалтайску.</span>
            </li>
            <li>
              <FaIcon name="scales" />
              <span><b>Весовое взвешиваем при сборке.</b> Оплатить онлайн можно, когда придёт точная сумма, — или курьеру наличными и картой.</span>
            </li>
            <li>
              <FaIcon name="coin" />
              <span><b>2 % баллами с каждого заказа.</b> Баллами можно оплатить следующие заказы.</span>
            </li>
          </ul>
          <NuxtLink :to="faPath('/dostavka')" class="fa-btn fa-btn--line">Доставка и оплата</NuxtLink>
        </div>
      </div>
    </section>

    <section class="fa-wrap fa-section">
      <div class="fa-farm">
        <div class="fa-farm__text">
          <FaMask sec="moloko" :size="44" />
          <h2>Только с нашего молока</h2>
          <p>
            Молоко, сметана, творог, сливки, снежок и кефир — с нашего производства в селе Рассказиха Первомайского района. Свинина, говядина, баранина,
            курица и яйцо — всегда свежие. Никакой химии, только натуральные продукты.
          </p>
          <NuxtLink :to="faPath('/o-ferme')" class="fa-head__more">О ферме<FaIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <ul class="fa-farm__facts">
          <li><b>{{ faProducts.length }}</b><span>товар в каталоге: молочное, мясо, своя кухня</span></li>
          <li><b>2</b><span>доставки в неделю, бесплатно от {{ faMoney(FA_MIN) }}</span></li>
          <li><b>{{ storesCount }}</b><span>магазинов в Новосибирске, Барнауле и крае</span></li>
        </ul>
        <NuxtLink :to="faPath('/magaziny')" class="fa-farm__stores">
          <FaIcon name="pin" />
          <span><b>Мы в магазинах</b><small>Брюкке, Алтай фермер, Натуральные продукты и другие</small></span>
          <FaIcon name="right" :size="18" />
        </NuxtLink>
      </div>
    </section>

    <section class="fa-wrap fa-section">
      <div class="fa-b2b">
        <div>
          <h2>Продукция «Фермы Алтая» для вашего магазина</h2>
          <p>Поставляем в Новосибирск и Барнаул. Ассортимент можно посмотреть сразу, оптовые цены и заказы — после подтверждения заявки.</p>
        </div>
        <div class="fa-b2b__btns">
          <a :href="FA_B2B" target="_blank" rel="noopener" class="fa-btn fa-btn--main">Посмотреть ассортимент</a>
          <a :href="FA_B2B" target="_blank" rel="noopener" class="fa-btn fa-btn--line">Подать заявку</a>
        </div>
      </div>
    </section>

    <section class="fa-wrap fa-section">
      <div class="fa-head">
        <h2>Отзывы</h2>
        <NuxtLink :to="faPath('/otzyvy')" class="fa-head__more">Все отзывы<FaIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="fa-home__reviews">
        <article v-for="r in faReviews" :key="r.date" class="fa-review">
          <div class="fa-review__top">
            <b>{{ r.name }}</b><FaStars :value="r.stars ?? 5" /><small>{{ faNewsDate(r.date) }}</small>
          </div>
          <p>{{ r.text }}</p>
          <p v-if="r.reply" class="fa-review__reply"><b>Ответ фермы</b>{{ r.reply }}</p>
        </article>
      </div>
    </section>

    <section class="fa-wrap fa-section">
      <div class="fa-head">
        <h2>Новости</h2>
        <NuxtLink :to="faPath('/novosti')" class="fa-head__more">Все новости<FaIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="fa-home__news">
        <a v-for="n in faNews.slice(0, 3)" :key="n.slug" :href="`${FA_ORIGIN}/blog/${n.slug}`" target="_blank" rel="noopener" class="fa-news">
          <small>{{ faNewsDate(n.date) }}</small>
          <b>{{ n.title }}</b>
        </a>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.fa-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: 16px 20px;
  padding-top: 24px;

  &__panel {
    display: grid;
    align-content: center;
    gap: 20px;
    padding: 36px;
    border-radius: 22px;
    background: var(--fa-surface);
  }
  &__lead {
    max-width: 520px;
    color: var(--fa-text);
    font-size: 19px;
    line-height: 1.45;
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  // снимок коровы вытянут ~2:1 — колонка той же пропорции, корова видна целиком
  &__photo {
    position: relative;
    aspect-ratio: 2.09;
    border-radius: 22px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
      background: rgba(255, 255, 255, 0.94);
      color: #154539;

      b {
        font-size: 18px;
        font-weight: 800;
      }
      span {
        font-size: 15px;
        color: #2c3a35;
      }
    }
  }
  &__week {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 230px minmax(0, 1fr);
    align-items: center;
    gap: 16px 28px;
    padding: 22px 28px;
    border: 1px solid var(--fa-line);
    border-radius: 22px;

    .fa-week {
      grid-template-columns: minmax(0, 520px) minmax(0, 1fr);
      align-items: center;
      gap: 8px 28px;
    }
    .fa-week__days {
      grid-row: span 2;
    }
    .fa-week__day:not(.is-wave):not(.is-deadline) {
      background: var(--fa-surface);
    }
  }
  &__wt {
    display: grid;
    gap: 10px;

    b {
      color: var(--fa-dark);
      font-size: 20px;
      font-weight: 800;
    }
  }
  &__city {
    background: var(--fa-surface);
  }
  @media (max-width: 1199px) {
    &__week .fa-week {
      grid-template-columns: minmax(0, 1fr);
    }
    &__week .fa-week__days {
      grid-row: auto;
      max-width: 560px;
    }
  }
  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

    &__panel {
      padding: 28px;
    }
    &__photo {
      aspect-ratio: auto;
      min-height: 100%;
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__photo {
      order: -1;
      min-height: 0;
      aspect-ratio: 2.09;
    }
    &__week {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 576px) {
    padding-top: 14px;
    gap: 12px;

    &__panel {
      gap: 16px;
      padding: 22px 16px 20px;
      border-radius: 18px;
    }
    &__lead {
      font-size: 17px;
    }
    &__photo {
      aspect-ratio: 16 / 9;
      border-radius: 18px;

      figcaption {
        left: 10px;
        bottom: 10px;
        max-width: calc(100% - 20px);
        padding: 8px 12px;

        b {
          font-size: 16px;
        }
        span {
          display: none;
        }
      }
    }
    &__week {
      padding: 18px 14px;
      border-radius: 18px;
    }
    &__btns .fa-btn {
      flex: 1 1 100%;
    }
  }
}

.fa-tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
}
.fa-tile {
  position: relative;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  min-height: 80px;
  padding: 8px 40px 8px 8px;
  border-radius: 14px;
  background: var(--fa-surface);

  img {
    width: 64px;
    height: 64px;
    border-radius: 10px;
    background: #fff;
    object-fit: cover;
  }
  &__t {
    display: grid;
    min-width: 0;

    b {
      color: var(--fa-dark);
      font-weight: 700;
      line-height: 1.2;
    }
    small {
      color: var(--fa-muted);
      font-size: 14px;
    }
  }
  &__ic {
    position: absolute;
    top: 10px;
    right: 10px;
    color: var(--fa-dark);
    opacity: 0.75;
  }
  &:hover {
    background: var(--fa-soft);

    .fa-tile__t b {
      color: var(--fa-soft-ink);
    }
  }
  @media (max-width: 576px) {
    grid-template-columns: 48px minmax(0, 1fr);
    gap: 10px;
    min-height: 64px;
    padding: 8px 8px 8px 8px;

    img {
      width: 48px;
      height: 48px;
    }
    &__t b {
      font-size: 15px;
      hyphens: auto;
      overflow-wrap: break-word;
    }
    &__t small {
      font-size: 13px;
    }
    &__ic {
      display: none;
    }
  }
}

.fa-home__tabs {
  min-width: 320px;

  button {
    font-size: 17px;
  }
  @media (max-width: 375px) {
    min-width: 0;
    width: 100%;
  }
}

.fa-ship {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  border-radius: 22px;
  background: var(--fa-craft);
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &__text {
    display: grid;
    align-content: center;
    justify-items: start;
    gap: 18px;
    padding: 36px 40px;
  }
  ul.fa-ship__list {
    display: grid;
    gap: 14px;

    li {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .fa-icon {
      flex: none;
      margin-top: 1px;
      color: var(--fa-accent);
    }
    b {
      color: var(--fa-dark);
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    > img {
      aspect-ratio: 2 / 1;
      height: auto;
    }
    &__text {
      padding: 26px 22px;
    }
  }
}

.fa-farm {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 20px 40px;
  align-items: start;

  &__text {
    display: grid;
    justify-items: start;
    gap: 14px;

    .fa-mask {
      color: var(--fa-dark);
    }
    p {
      max-width: 620px;
      font-size: 18px;
    }
  }
  ul.fa-farm__facts {
    display: grid;
    gap: 10px;

    li {
      display: flex;
      align-items: baseline;
      gap: 14px;
      padding: 16px 20px;
      border-radius: 14px;
      background: var(--fa-surface);
    }
    b {
      min-width: 64px;
      color: var(--fa-accent);
      font-size: 34px;
      font-weight: 800;
      line-height: 1;
    }
  }
  &__stores {
    grid-column: 2;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    border: 1px solid var(--fa-line);
    border-radius: 14px;

    > .fa-icon:first-child {
      color: var(--fa-accent);
    }
    span {
      display: grid;
    }
    b {
      color: var(--fa-dark);
    }
    small {
      color: var(--fa-muted);
      font-size: 14px;
    }
    &:hover {
      border-color: var(--fa-accent);
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__stores {
      grid-column: auto;
    }
  }
}

.fa-b2b {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px 32px;
  padding: 30px 36px;
  border-radius: 22px;
  background: var(--fa-soft);

  h2 {
    font-size: clamp(24px, 2.2vw, 30px);
  }
  p {
    max-width: 620px;
    margin-top: 8px;
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    flex: none;
  }
  @media (max-width: 989px) {
    flex-direction: column;
    align-items: stretch;
    padding: 24px 22px;
  }
  @media (max-width: 576px) {
    &__btns .fa-btn {
      flex: 1 1 100%;
    }
  }
}

.fa-home__reviews {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: start;
  gap: 16px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.fa-home__news {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.fa-news {
  display: grid;
  align-content: start;
  gap: 6px;
  padding: 18px 20px;
  border: 1px solid var(--fa-line);
  border-radius: 14px;

  small {
    color: var(--fa-muted);
    font-size: 14px;
  }
  b {
    color: var(--fa-dark);
    font-size: 18px;
    line-height: 1.3;
  }
  &:hover {
    border-color: var(--fa-accent);

    b {
      color: var(--fa-accent);
    }
  }
}
</style>
