<script lang="ts" setup>
import AkIcon from '~/components/redesign/aks124/AkIcon.vue'
import AkSearch from '~/components/redesign/aks124/AkSearch.vue'
import AkSheet from '~/components/redesign/aks124/AkSheet.vue'

useSeoMeta({ title: 'ИП Аксюченко — продукты оптом в Красноярске | Концепт редизайна' })

const list = useAks124List()
const spices = akSection('specii-pripravy')!
const facts = [
  { icon: 'clock', b: 'Более 20 лет', s: 'оптовая торговля с 2005 года' },
  { icon: 'layers', b: `${akTotal.items.toLocaleString('ru-RU')} позиций`, s: '16 разделов, склад в Красноярске' },
  { icon: 'truck', b: `От ${akMoney0(akFreeFrom)}`, s: 'доставка до двери бесплатно' },
  { icon: 'card', b: 'Нал и безнал', s: 'можно оплатить при получении' },
]
const stock = akStock.map((t) => ({ ...t, s: akSection(t.section)!, min: akMinPrice(t.section) }))

// Пример листа бренда на главной — первая марка с фото и хотя бы четырьмя позициями с ценой
const demoBrand = akBrands.find((b) => b.img && akItemsOf(b.id).filter((i) => i.price && i.pack).length >= 4) ?? akBrands[0]
const demoItems = akItemsOf(demoBrand.id).filter((i) => i.price && i.pack).slice(0, 5)

const logos = ref<HTMLElement | null>(null)
const scrollLogos = (dir: number) => logos.value?.scrollBy({ left: dir * logos.value.clientWidth * 0.8, behavior: 'smooth' })

const terms = [
  { icon: 'truck', title: 'Доставка', text: `При заказе от ${akMoney0(akFreeFrom)} — бесплатно до двери в пределах Красноярска.` },
  { icon: 'store', title: 'Самовывоз', text: 'Весь ассортимент можно забрать со склада на Дудинской, 6.' },
  { icon: 'card', title: 'Оплата', text: 'Наличный и безналичный расчёт, возможна оплата при получении товара.' },
  { icon: 'tag', title: 'Цены', text: 'На сайте базовые цены. Конечная зависит от объёма, постоянным клиентам — скидки.' },
]
</script>

<template>
  <div>
    <section class="ak-wrap ak-hero">
      <div class="ak-hero__panel">
        <p class="ak-hero__who">ИП Аксюченко · оптовая торговля продуктами питания</p>
        <h1>Бакалея, сладости, чай и&nbsp;кофе оптом в&nbsp;Красноярске</h1>
        <p class="ak-hero__lead">
          Большой выбор — низкие цены. У каждой позиции цена за штуку и сколько штук в упаковке: соберите список упаковками и отправьте нам одним
          письмом.
        </p>
        <AkSearch big quick />
        <ul class="ak-hero__facts">
          <li v-for="f in facts" :key="f.b">
            <AkIcon :name="f.icon" :size="22" />
            <span><b>{{ f.b }}</b>{{ f.s }}</span>
          </li>
        </ul>
      </div>
      <NuxtLink :to="akSectionPath(spices.id)" class="ak-hero__photo">
        <img src="https://aks124.ru/d/zastavka_spetsii.jpg" alt="Специи и приправы" width="1280" height="720" />
        <span class="ak-hero__plate">
          <span>
            <b>{{ spices.title }}</b>
            <small>{{ akPositions(spices.count) }} · от {{ akMoney(akMinPrice(spices.id)) }}</small>
          </span>
          <span class="ak-hero__go"><AkIcon name="arrow" :size="20" /></span>
        </span>
      </NuxtLink>
    </section>

    <section class="ak-wrap ak-section">
      <div class="ak-head">
        <div>
          <h2 class="ak-h2">Всегда в наличии на складе</h2>
          <p>Разделы, которые берут чаще всего</p>
        </div>
        <NuxtLink :to="akSectionPath()" class="ak-more">Весь каталог <AkIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="ak-stock">
        <NuxtLink v-for="t in stock" :key="t.section" :to="akSectionPath(t.section)" class="ak-stock__tile">
          <span class="ak-stock__img" :class="{ 'is-pack': t.pack }"><img :src="t.img" :alt="t.title" width="400" height="300" loading="lazy" /></span>
          <b>{{ t.title }}</b>
          <small>{{ akPositions(t.s.count) }}<template v-if="t.min"> · от {{ akMoney(t.min) }}</template></small>
        </NuxtLink>
      </div>
    </section>

    <section class="ak-wrap ak-section">
      <div class="ak-head">
        <div>
          <h2 class="ak-h2">Торговые марки</h2>
          <p>Ищите по бренду — так устроен весь каталог</p>
        </div>
        <div class="ak-logos__nav">
          <button type="button" class="ak-iconbtn" aria-label="Назад" @click="scrollLogos(-1)"><AkIcon name="arrow" class="ak-flip" /></button>
          <button type="button" class="ak-iconbtn" aria-label="Вперёд" @click="scrollLogos(1)"><AkIcon name="arrow" /></button>
          <NuxtLink :to="akPath('/brands')" class="ak-more">Бренды А–Я <AkIcon name="arrow" :size="18" /></NuxtLink>
        </div>
      </div>
      <div ref="logos" class="ak-logos">
        <NuxtLink v-for="l in akLogos" :key="l.title" :to="{ path: akSectionPath(), query: { q: l.title } }" class="ak-logos__item" :title="l.title">
          <img :src="l.img" :alt="l.title" width="160" height="110" loading="lazy" />
        </NuxtLink>
      </div>
    </section>

    <section class="ak-wrap ak-section">
      <div class="ak-howto">
        <div class="ak-howto__text">
          <h2 class="ak-h2">Список заказа — упаковками</h2>
          <p>
            Каждый бренд — один лист, как в нашем прайсе: позиция, сколько штук в упаковке, цена за штуку и за упаковку. Нажмите «Упаковку», и
            позиция попадёт в список.
          </p>
          <p>Из списка получится готовое письмо с суммой — отправьте на почту или продиктуйте по телефону.</p>
          <div class="ak-free">
            <div class="ak-free__bar"><span :style="{ width: `${Math.min(100, (list.total.value / akFreeFrom) * 100)}%` }" /></div>
            <p v-if="list.toFree.value > 0">
              До бесплатной доставки <b>{{ akMoney0(list.toFree.value) }}</b>
            </p>
            <p v-else><b>Доставка по Красноярску бесплатно</b></p>
          </div>
          <NuxtLink :to="akPath('/list')" class="ak-btn ak-btn--soft">
            <AkIcon name="list" :size="20" />Открыть список<template v-if="list.count.value"> · {{ list.count.value }}</template>
          </NuxtLink>
        </div>
        <AkSheet :brand="demoBrand" :items="demoItems" />
      </div>
    </section>

    <section class="ak-wrap ak-section">
      <div class="ak-head">
        <h2 class="ak-h2">Условия</h2>
        <NuxtLink :to="akPath('/delivery')" class="ak-more">Доставка и оплата <AkIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <ul class="ak-terms">
        <li v-for="t in terms" :key="t.title">
          <span class="ak-terms__ico"><AkIcon :name="t.icon" /></span>
          <div>
            <h3>{{ t.title }}</h3>
            <p>{{ t.text }}</p>
          </div>
        </li>
      </ul>
    </section>

    <section class="ak-wrap ak-section">
      <div class="ak-head">
        <h2 class="ak-h2">Акции</h2>
        <NuxtLink :to="akPath('/promo')" class="ak-more">Все акции <AkIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="ak-promos">
        <NuxtLink v-for="p in akPromo" :key="p.title" :to="akSectionPath(p.section)" class="ak-promo">
          <img :src="p.img" :alt="p.title" width="160" height="160" loading="lazy" />
          <div>
            <span class="ak-flag ak-flag--promo">{{ p.text }}</span>
            <h3>{{ p.title }}</h3>
            <p><b>{{ akMoney(p.price) }}</b> / {{ p.per }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.ak-flip {
  transform: scaleX(-1);
}
.ak-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 20px;
  padding-top: 24px;

  &__panel {
    display: flex;
    flex-direction: column;
    padding: 40px;
    border-radius: var(--ak-R);
    background: var(--ak-surface);
  }
  &__who {
    color: var(--ak-muted);
    font-weight: 500;
  }
  h1 {
    margin-top: 10px;
    font-size: clamp(30px, 3.4vw, 50px);
    line-height: 1.06;
  }
  &__lead {
    margin: 16px 0 26px;
    max-width: 560px;
    font-size: 17px;
  }
  ul.ak-hero__facts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 22px;
    margin-top: auto;
    padding-top: 30px;

    li {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    svg {
      flex: none;
      color: var(--ak-accent);
      margin-top: 2px;
    }
    span {
      color: var(--ak-muted);
      font-size: 14px;
      line-height: 1.35;
    }
    b {
      display: block;
      color: var(--ak-ink);
      font-size: 16px;
    }
  }
  &__photo {
    position: relative;
    display: block;
    min-height: 460px;
    border-radius: var(--ak-R);
    overflow: hidden;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }
    &:hover img {
      transform: scale(1.03);
    }
  }
  &__plate {
    position: absolute;
    left: 18px;
    right: 18px;
    bottom: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 16px 16px 20px;
    border-radius: 16px;
    background: #fff;

    b {
      display: block;
      font-size: 18px;
      color: var(--ak-ink);
    }
    small {
      color: var(--ak-muted);
    }
  }
  &__go {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: var(--ak-accent);
    color: #fff;
    flex: none;
  }

  @media (max-width: 1199px) {
    &__panel {
      padding: 30px;
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__photo {
      min-height: 0;
      aspect-ratio: 16 / 8;
    }
  }
  // на телефоне фото сразу под поиском, цифры — после фото
  @media (max-width: 768px) {
    padding-top: 14px;
    gap: 12px;

    &__panel {
      display: contents;
    }
    &__who,
    h1,
    &__lead,
    .ak-search {
      order: 1;
    }
    &__photo {
      order: 2;
      aspect-ratio: 4 / 3;
    }
    ul.ak-hero__facts {
      order: 3;
      padding: 18px;
      border-radius: 18px;
      background: var(--ak-surface);
    }
    h1 {
      margin-top: 4px;
      font-size: clamp(27px, 7.4vw, 34px);
    }
    &__who {
      font-size: 14px;
    }
    &__lead {
      margin: 0;
      font-size: 16px;
    }
    .ak-search__quick {
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .ak-search__quick button {
      flex: none;
    }
  }
  @media (max-width: 576px) {
    ul.ak-hero__facts {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }
  }
}

.ak-stock {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  &__tile {
    display: grid;
    gap: 2px;
    padding: 10px 10px 14px;
    border-radius: var(--ak-R);
    background: var(--ak-surface);

    b {
      margin-top: 10px;
      padding: 0 6px;
      color: var(--ak-ink);
      font-size: 17px;
      line-height: 1.2;
    }
    small {
      padding: 0 6px;
      color: var(--ak-muted);
    }
    &:hover b {
      color: var(--ak-accent-dark);
    }
    &:hover img {
      transform: scale(1.04);
    }
  }
  &__img {
    display: block;
    aspect-ratio: 4 / 3;
    border-radius: 14px;
    overflow: hidden;
    background: #fff;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    &.is-pack img {
      padding: 8px;
      object-fit: contain;
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  @media (max-width: 375px) {
    &__tile b {
      font-size: 15px;
    }
  }
}

.ak-logos {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  mask-image: linear-gradient(90deg, #000 92%, transparent);

  &::-webkit-scrollbar {
    display: none;
  }
  &__item {
    flex: none;
    display: grid;
    place-items: center;
    width: 180px;
    height: 120px;
    padding: 14px;
    border: 1px solid var(--ak-line);
    border-radius: 16px;
    background: #fff;
    scroll-snap-align: start;

    img {
      width: 150px;
      height: 90px;
      object-fit: contain;
    }
    &:hover {
      border-color: var(--ak-accent);
    }
  }
  &__nav {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  @media (max-width: 576px) {
    &__nav .ak-iconbtn {
      display: none;
    }
    &__item {
      width: 140px;
      height: 96px;

      img {
        width: 116px;
        height: 70px;
      }
    }
  }
}

.ak-howto {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
  gap: 32px;
  align-items: start;

  &__text {
    display: grid;
    gap: 14px;
    justify-items: start;
    padding-top: 8px;
  }
  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
}
ul.ak-terms {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  li {
    display: grid;
    gap: 14px;
    align-content: start;
    padding: 22px;
    border-radius: var(--ak-R);
    background: var(--ak-surface);
  }
  h3 {
    font-size: 18px;
    margin-bottom: 6px;
  }
  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);

    li {
      grid-template-columns: 44px minmax(0, 1fr);
      padding: 16px;
    }
  }
}
</style>
