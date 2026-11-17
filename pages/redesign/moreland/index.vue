<script lang="ts" setup>
import { mlBatches, mlContacts, mlCities, mlDate, mlDateShort, mlGroups, mlInGroup, mlNewsItem, mlPath, mlProduct, mlRub, mlUnitShort } from '~/utils/moreland'
import { mlNews } from '~/utils/moreland.data'
import { mlHomePhotos } from '~/utils/moreland.data'
import { useMlList } from '~/composables/useMoreland'
import MlIcon from '~/components/redesign/moreland/MlIcon.vue'
import MlCard from '~/components/redesign/moreland/MlCard.vue'
import MlSmoke from '~/components/redesign/moreland/MlSmoke.vue'

useSeoMeta({ title: 'Морелэнд — копчёная и вяленая рыба, пресервы оптом, Омск | Концепт редизайна' })

const list = useMlList()
const to = (p: string) => mlPath(p)

const batches = mlBatches.map((b) => ({ ...b, n: mlNewsItem(b.news)!, p: b.product ? mlProduct(b.product) : undefined }))

const groups = mlGroups.map((g) => {
  const items = mlInGroup(g.id)
  const kg = items.filter((p) => p.price && p.unit === 'кг').map((p) => p.price!)
  const pcs = items.filter((p) => p.price && p.unit !== 'кг').map((p) => p.price!)
  const from = kg.length ? `от ${mlRub(Math.min(...kg))} за кг` : pcs.length ? `от ${mlRub(Math.min(...pcs))} за шт` : 'цены по запросу'
  return { ...g, count: items.length, from }
})

const tabs = [
  { id: 'vesovaya', label: 'Весовая рыба' },
  { id: 'preservy', label: 'Пресервы' },
  { id: 'upakovannaya', label: 'Упакованная' },
]
const tab = ref('vesovaya')
// сначала свежие цены (по дате цены), потом остальные
const shelf = computed(() =>
  [...mlInGroup(tab.value)].sort((a, b) => (b.pdate || '').localeCompare(a.pdate || '') || (b.price ? 1 : 0) - (a.price ? 1 : 0)).slice(0, 8),
)

const news = mlNews.slice(0, 3)
const priceLists = mlNews.filter((n) => n.file)
</script>

<template>
  <div class="ml-home">
    <!-- первый экран: «В дым» -->
    <section class="ml-hero">
      <div class="ml-wrap">
        <div class="ml-hero__top">
          <h1>Лучшее качество с&nbsp;1998&nbsp;года</h1>
          <div class="ml-hero__lead">
            <p>Рыбный цех «Морелэнд» в Омске: холодное и горячее копчение, вяленая и слабосолёная рыба, пресервы. Опт от коробки для магазинов и сетей.</p>
            <div class="ml-hero__btns">
              <NuxtLink :to="to('/produkcija/')" class="ml-btn">Продукция и цены</NuxtLink>
              <NuxtLink :to="to('/o-kompanii/')" class="ml-btn ml-btn--line">О компании</NuxtLink>
            </div>
          </div>
        </div>
        <MlSmoke />
        <div class="ml-batches">
          <div class="ml-batches__head">
            <MlIcon name="smoke" />
            <b>Вышло из коптильни</b>
            <NuxtLink :to="to('/novosti/')">Все новости</NuxtLink>
          </div>
          <div class="ml-batches__row">
            <article v-for="b in batches" :key="b.news" class="ml-batch">
              <NuxtLink :to="to(`/novosti/${b.n.id}/`)" class="ml-batch__ph"><img :src="b.n.img!" :alt="b.n.t" width="120" height="120" loading="lazy" /></NuxtLink>
              <div class="ml-batch__body">
                <span class="ml-batch__date">{{ mlDate(b.n.date) }}</span>
                <NuxtLink :to="to(`/novosti/${b.n.id}/`)" class="ml-batch__t">{{ b.n.t }}</NuxtLink>
                <span class="ml-batch__price"><b>{{ mlRub(b.price) }}</b> за {{ b.unit }} · {{ b.box }}</span>
              </div>
              <button v-if="b.p && !list.qty(b.p.id)" type="button" class="ml-iconbtn ml-batch__add" :aria-label="`В заявку: ${b.n.t}`" @click="list.add(b.p)"><MlIcon name="plus" /></button>
              <NuxtLink v-else-if="b.p" :to="to('/zayavka/')" class="ml-iconbtn ml-batch__add is-in" aria-label="Уже в заявке — открыть"><MlIcon name="check" /></NuxtLink>
              <NuxtLink v-else :to="to(`/novosti/${b.n.id}/`)" class="ml-iconbtn ml-batch__add" :aria-label="`Подробнее: ${b.n.t}`"><MlIcon name="right" /></NuxtLink>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- разделы -->
    <section class="ml-section ml-wrap">
      <div class="ml-sechead">
        <h2 class="ml-h2">Продукция</h2>
        <NuxtLink :to="to('/produkcija/')" class="ml-sechead__link">Все 74 позиции<MlIcon name="right" /></NuxtLink>
      </div>
      <div class="ml-groups">
        <NuxtLink v-for="g in groups" :key="g.id" :to="to(`/produkcija/${g.id}/`)" class="ml-group">
          <img :src="g.img" :alt="g.name" width="200" height="200" loading="lazy" />
          <div class="ml-group__body">
            <h3>{{ g.name }}</h3>
            <p>{{ g.text }}</p>
            <span class="ml-group__meta"><b>{{ g.count }} поз.</b> · {{ g.from }}</span>
            <span class="ml-group__subs">{{ g.subs.map((s) => s.name).join(' · ') }}</span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- полка с ценами -->
    <section class="ml-section ml-wrap">
      <div class="ml-sechead">
        <h2 class="ml-h2">Свежие цены</h2>
        <div class="ml-tabs" role="tablist">
          <button v-for="t in tabs" :key="t.id" type="button" role="tab" class="ml-tabs__b" :class="{ 'is-on': tab === t.id }" :aria-selected="tab === t.id" @click="tab = t.id">{{ t.label }}</button>
        </div>
      </div>
      <div class="ml-grid">
        <MlCard v-for="p in shelf" :key="p.id" :p="p" />
      </div>
      <p class="ml-home__note">Цены оптовые, от коробки — из прайс-листов и новостей. Точную цену на день отгрузки подтвердит менеджер.</p>
    </section>

    <!-- условия -->
    <section class="ml-section ml-wrap">
      <div class="ml-terms">
        <div class="ml-terms__main">
          <h2 class="ml-h2">Как мы работаем</h2>
          <ul class="ml-terms__list">
            <li><MlIcon name="box" /><span><b>Опт от коробки.</b> Работаем только с юр. лицами и ИП, расчёт безналичный.</span></li>
            <li><MlIcon name="truck" /><span><b>Бесплатная доставка в черте Омска.</b> Отгружаем в {{ mlCities.slice(1).join(', ') }} и другие регионы России и Казахстана.</span></li>
            <li><MlIcon name="doc" /><span><b>Декларации на всю продукцию.</b> Производим по ГОСТ и ТУ, полный пакет документов.</span></li>
            <li><MlIcon name="calendar" /><span><b>Перед праздниками — заявка за 2 недели до отгрузки.</b> На часть позиций предзаказ 4 дня.</span></li>
          </ul>
        </div>
        <div class="ml-terms__side">
          <h3>Прайс-листы</h3>
          <a v-for="n in priceLists" :key="n.id" :href="n.file" class="ml-file" download>
            <MlIcon name="download" /><span><b>{{ n.t === 'Прайс-лист на пресервы' ? 'Пресервы' : 'Весовая и упакованная рыба, пресервы' }}</b><small>.xlsx · {{ mlDateShort(n.date) }}</small></span>
          </a>
          <p>Новые цены публикуем в новостях — подпишитесь, чтобы получать их на почту.</p>
          <NuxtLink :to="to('/podpiska/')" class="ml-btn ml-btn--line"><MlIcon name="bell" />Подписаться</NuxtLink>
        </div>
      </div>
    </section>

    <!-- из цеха -->
    <section class="ml-section ml-wrap">
      <div class="ml-shop">
        <div class="ml-shop__text">
          <h2 class="ml-h2">Из нашего цеха</h2>
          <p>ТК «Морелэнд» производит рыбную продукцию больше 15 лет. Вся продукция делается по ГОСТу и ТУ при строгом соблюдении технологии.</p>
          <p>Магазины, включая крупнейшие федеральные сети, стали нашими постоянными покупателями. Мы нацелены на долгосрочное сотрудничество.</p>
          <NuxtLink :to="to('/o-kompanii/')" class="ml-sechead__link">О компании<MlIcon name="right" /></NuxtLink>
        </div>
        <div class="ml-shop__photos">
          <img v-for="(src, i) in mlHomePhotos" :key="src" :src="src" :alt="['Брюшки сёмги х/к', 'Головы сёмги г/к', 'Окунь вяленый', 'Коптильня'][i]" width="400" height="400" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- новости -->
    <section class="ml-section ml-wrap">
      <div class="ml-sechead">
        <h2 class="ml-h2">Новости</h2>
        <NuxtLink :to="to('/novosti/')" class="ml-sechead__link">Все новости<MlIcon name="right" /></NuxtLink>
      </div>
      <div class="ml-news3">
        <NuxtLink v-for="n in news" :key="n.id" :to="to(`/novosti/${n.id}/`)" class="ml-ncard">
          <div class="ml-ncard__ph"><img v-if="n.img" :src="n.img" :alt="n.t" width="400" height="300" loading="lazy" /></div>
          <div class="ml-ncard__body">
            <span class="ml-ncard__date">{{ mlDate(n.date) }}</span>
            <h3 class="ml-ncard__t">{{ n.t }}</h3>
            <p class="ml-ncard__text">{{ n.text }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- партнёры -->
    <section class="ml-section ml-wrap">
      <div class="ml-partners">
        <div>
          <h2 class="ml-h2">Партнёры</h2>
          <p>Наша рыба — на полках магазинов и торговых сетей Сибири и Казахстана.</p>
        </div>
        <div class="ml-partners__logo"><img src="https://moreland.ru/upload/iblock/ffe/n1202_14_7_1b.jpg" alt="Победа" width="140" height="37" loading="lazy" /></div>
        <a :href="`tel:${mlContacts.tel}`" class="ml-partners__call"><span>Стать партнёром</span><b>{{ mlContacts.phone }}</b></a>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.ml-hero {
  padding-top: 32px;
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 16px 48px;
    align-items: end;
    margin-bottom: 18px;
    h1 {
      font-size: clamp(34px, 4.2vw, 58px);
      font-weight: 800;
      line-height: 1.05;
    }
  }
  &__lead p {
    font-size: 17px;
    color: var(--ml-text);
  }
  &__btns {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 16px;
  }
  @media (max-width: 989px) {
    &__top {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 768px) {
    padding-top: 20px;
    &__lead p {
      font-size: 15.5px;
    }
    &__btns .ml-btn {
      flex: 1;
    }
  }
}
.ml-batches {
  margin-top: 18px;
  &__head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: var(--ml-amb);
    b {
      color: var(--ml-ink);
      font-size: 16px;
    }
    a {
      margin-left: auto;
      font-weight: 800;
      color: var(--ml-acc);
      font-size: 14px;
    }
  }
  &__row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
  @media (max-width: 989px) {
    &__row {
      grid-auto-flow: column;
      grid-template-columns: none;
      grid-auto-columns: minmax(300px, 1fr);
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      padding-bottom: 6px;
      scrollbar-width: thin;
      scrollbar-color: #c4d3e4 transparent;
      > * {
        scroll-snap-align: start;
      }
    }
  }
  @media (max-width: 576px) {
    &__row {
      grid-auto-columns: 86%;
    }
  }
}
.ml-batch {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 10px;
  border-radius: var(--ml-R);
  background: var(--ml-surf);
  &__ph {
    position: relative;
    width: 84px;
    height: 84px;
    border-radius: 12px;
    overflow: hidden;
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__body {
    display: grid;
    gap: 2px;
    min-width: 0;
  }
  &__date {
    font-size: 12.5px;
    color: var(--ml-mute);
    font-weight: 600;
  }
  &__t {
    font-weight: 800;
    color: var(--ml-ink);
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    &:hover {
      color: var(--ml-acc);
    }
  }
  &__price {
    font-size: 13.5px;
    color: var(--ml-text);
    line-height: 1.35;
    b {
      color: var(--ml-amb);
      font-size: 15px;
    }
  }
  &__add {
    background: #fff;
    color: var(--ml-acc);
    &.is-in {
      background: var(--ml-acc);
      color: #fff;
    }
  }
}
.ml-groups {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
}
.ml-group {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
  height: 100%;
  padding: 20px;
  border-radius: var(--ml-R);
  background: var(--ml-surf);
  transition: background 0.15s;
  img {
    width: 132px;
    height: 132px;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  &:hover {
    background: var(--ml-soft);
    img {
      transform: scale(1.04);
    }
  }
  &__body {
    display: grid;
    gap: 6px;
    h3 {
      font-size: 22px;
    }
    p {
      font-size: 14px;
      color: var(--ml-mute);
    }
  }
  &__meta {
    font-size: 14px;
    color: var(--ml-ink);
  }
  &__subs {
    font-size: 13px;
    color: var(--ml-acc);
    font-weight: 700;
  }
  @media (max-width: 1199px) {
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 14px;
    padding: 16px;
    img {
      width: 96px;
      height: 96px;
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: 110px minmax(0, 1fr);
    img {
      width: 110px;
      height: 110px;
    }
  }
  @media (max-width: 375px) {
    grid-template-columns: 76px minmax(0, 1fr);
    img {
      width: 76px;
      height: 76px;
    }
    &__body h3 {
      font-size: 19px;
    }
  }
}
.ml-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: var(--ml-surf);
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  &__b {
    padding: 8px 14px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    font-weight: 800;
    font-size: 14px;
    color: var(--ml-text);
    white-space: nowrap;
    &.is-on {
      background: #fff;
      color: var(--ml-acc);
      box-shadow: 0 1px 4px rgba(13, 39, 66, 0.1);
    }
  }
  @media (max-width: 375px) {
    &__b {
      padding: 8px 10px;
      font-size: 13px;
    }
  }
}
.ml-home__note {
  margin-top: 16px !important;
  font-size: 13.5px;
  color: var(--ml-mute);
}
.ml-terms {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 24px;
  ul.ml-terms__list {
    list-style: none;
    margin: 24px 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 28px;
    li {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .ml-icon {
      width: 26px;
      height: 26px;
      color: var(--ml-acc);
      margin-top: 1px;
    }
    b {
      display: block;
      color: var(--ml-ink);
    }
  }
  &__side {
    display: grid;
    gap: 12px;
    align-content: start;
    justify-items: start;
    padding: 24px;
    border-radius: var(--ml-R);
    background: var(--ml-surf);
    h3 {
      font-size: 20px;
    }
    p {
      font-size: 14px;
      color: var(--ml-mute);
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
  @media (max-width: 576px) {
    ul.ml-terms__list {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
.ml-shop {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
  gap: 40px;
  align-items: center;
  &__text {
    display: grid;
    gap: 14px;
    justify-items: start;
    p {
      font-size: 16px;
    }
  }
  &__photos {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    img {
      width: 100%;
      height: auto;
      aspect-ratio: 3 / 4;
      object-fit: cover;
      border-radius: var(--ml-R);
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
  @media (max-width: 576px) {
    &__photos {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      img {
        aspect-ratio: 1;
      }
    }
  }
}
.ml-news3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  @media (max-width: 989px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    > :nth-child(3) {
      display: none;
    }
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
    > :nth-child(3) {
      display: grid;
    }
  }
}
.ml-partners {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) auto minmax(0, 1fr);
  gap: 24px 40px;
  align-items: center;
  padding: 28px 32px;
  border: 1px solid var(--ml-line);
  border-radius: var(--ml-R);
  p {
    margin-top: 10px !important;
    color: var(--ml-mute);
  }
  &__logo {
    display: grid;
    place-items: center;
    padding: 18px 24px;
    border-radius: 12px;
    background: #fff;
    border: 1px solid var(--ml-line);
  }
  // исходник у них 140×37 — показываем в натуральный размер, без растяжения
  &__logo img {
    width: 140px;
    height: 37px;
  }
  &__call {
    display: grid;
    justify-items: end;
    span {
      font-size: 13.5px;
      color: var(--ml-mute);
    }
    b {
      font-size: 22px;
      color: var(--ml-ink);
      white-space: nowrap;
    }
    &:hover b {
      color: var(--ml-acc);
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr) auto;
    &__call {
      grid-column: 1 / -1;
      justify-items: start;
    }
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 22px 18px;
  }
}
</style>
