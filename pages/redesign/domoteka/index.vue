<script lang="ts" setup>
import { dmDealers, dmImg, dmInteriors, dmKitchen, dmMarkets, dmOfferImg, dmPath, dmPlural, dmTypes } from '~/utils/domoteka'
import { dmNews, dmProducts } from '~/utils/domoteka.data'
import { useDmUi } from '~/composables/useDomoteka'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'
import DmCard from '~/components/redesign/domoteka/DmCard.vue'
import DmBuilder from '~/components/redesign/domoteka/DmBuilder.vue'

const ui = useDmUi()
const to = (p: string) => dmPath(p)

// Плитки разделов: фото — первая модель раздела
const tiles = [
  ...dmTypes.map((t) => {
    const p = dmProducts.find((x) => x.type === t.id)!
    return { n: t.n, count: dmProducts.filter((x) => x.type === t.id).length, img: dmOfferImg(p.offers[0]), to: { path: to('/katalog/stoly/'), query: { type: t.id } } }
  }),
  { n: 'Стулья', count: dmProducts.filter((x) => x.sec === 'stulya').length, img: dmOfferImg(dmProducts.find((x) => x.sec === 'stulya')!.offers[0]), to: { path: to('/katalog/stulya/') } },
]
const kitchenCount = (id: string) => dmProducts.filter((p) => p.kitchen.includes(id)).length
const kitchenImg: Record<string, string> = { s: 'i/3.jpg', m: 'i/2.jpg', l: 'i/4.jpg' }

const tabs = [
  { id: 'new', n: 'Новинки' },
  { id: 'hit', n: 'Хиты продаж' },
  { id: 'sale', n: 'Акции' },
]
const tab = ref('new')
const shelf = computed(() => dmProducts.filter((p) => p.tags.includes(tab.value)))
const track = ref<HTMLElement | null>(null)
const scrollShelf = (dir: number, el: HTMLElement | null) => el?.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
const gal = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="dm-home">
    <div class="dm-wrap dm-home__hero">
      <DmBuilder />
    </div>

    <section class="dm-wrap dm-sec dm-home__facts" aria-label="Фабрика в цифрах">
      <ul class="dm-facts">
        <li><b>1989</b><span>работаем с этого года</span></li>
        <li><b>400+</b><span>дилеров в России, Беларуси и Казахстане</span></li>
        <li><b>1500+</b><span>точек продаж</span></li>
        <li><b>15 000 м²</b><span>производство и склад</span></li>
        <li><b>1,5 года</b><span>гарантия на продукцию</span></li>
      </ul>
    </section>

    <section class="dm-wrap dm-sec">
      <div class="dm-sec__head">
        <h2 class="dm-h2">Каталог</h2>
        <NuxtLink :to="to('/katalog/stoly/')">Все столы<DmIcon name="right" /></NuxtLink>
      </div>
      <div class="dm-tiles">
        <NuxtLink v-for="t in tiles" :key="t.n" :to="t.to" class="dm-tile" :class="{ 'dm-tile--cover': t.cover }">
          <span class="dm-tile__img"><img :src="t.img" :alt="t.n" width="400" height="400" loading="lazy" /></span>
          <span class="dm-tile__name">{{ t.n }}</span>
          <small>{{ t.count }} {{ dmPlural(t.count, ['модель', 'модели', 'моделей']) }}</small>
        </NuxtLink>
      </div>
    </section>

    <section class="dm-wrap dm-sec">
      <div class="dm-sec__head">
        <div>
          <h2 class="dm-h2">Стол под размер кухни</h2>
          <p class="dm-lead">Тот же фильтр, что в каталоге: подберите модель по площади, а размеры сложенным и разложенным смотрите в карточке.</p>
        </div>
      </div>
      <div class="dm-kitchen">
        <NuxtLink v-for="k in dmKitchen" :key="k.id" :to="{ path: to('/katalog/stoly/'), query: { kitchen: k.id } }" class="dm-kitchen__item">
          <img :src="dmImg(kitchenImg[k.id])" alt="" width="600" height="400" loading="lazy" />
          <span class="dm-kitchen__text">
            <b>Кухня {{ k.n }}</b>
            <small>{{ k.hint }} · {{ kitchenCount(k.id) }} моделей</small>
          </span>
          <DmIcon name="right" />
        </NuxtLink>
      </div>
    </section>

    <section class="dm-wrap dm-sec">
      <div class="dm-sec__head">
        <div class="dm-tabs" role="tablist" aria-label="Подборки">
          <button v-for="t in tabs" :key="t.id" type="button" role="tab" :aria-selected="tab === t.id" class="dm-tabs__btn" :class="{ 'is-on': tab === t.id }" @click="tab = t.id">
            {{ t.n }}<small>{{ dmProducts.filter((p) => p.tags.includes(t.id)).length }}</small>
          </button>
        </div>
        <NuxtLink :to="tab === 'sale' ? to('/katalog/akcii/') : to('/katalog/stoly/')">{{ tab === 'sale' ? 'Все акции' : 'Весь каталог' }}<DmIcon name="right" /></NuxtLink>
      </div>
      <div class="dm-shelf">
        <button type="button" class="dm-shelf__arrow dm-shelf__arrow--l" aria-label="Назад" @click="scrollShelf(-1, track)"><DmIcon name="left" /></button>
        <div ref="track" class="dm-shelf__track">
          <DmCard v-for="p in shelf" :key="`${tab}-${p.id}`" :p="p" />
        </div>
        <button type="button" class="dm-shelf__arrow dm-shelf__arrow--r" aria-label="Вперёд" @click="scrollShelf(1, track)"><DmIcon name="right" /></button>
      </div>
    </section>

    <section class="dm-wrap dm-sec">
      <div class="dm-sec__head">
        <div>
          <h2 class="dm-h2">Наши столы в интерьере</h2>
          <p class="dm-lead">Снимаем каждую модель не только на белом, но и на настоящей кухне — чтобы было видно, как стол встанет у вас.</p>
        </div>
      </div>
      <div class="dm-shelf">
        <button type="button" class="dm-shelf__arrow dm-shelf__arrow--l" aria-label="Назад" @click="scrollShelf(-1, gal)"><DmIcon name="left" /></button>
        <div ref="gal" class="dm-shelf__track dm-gallery">
          <figure v-for="g in dmInteriors" :key="g.img">
            <img :src="dmImg(g.img)" :alt="`Стол ${g.n} в интерьере`" width="1200" height="1200" loading="lazy" />
            <figcaption>{{ g.n }}</figcaption>
          </figure>
        </div>
        <button type="button" class="dm-shelf__arrow dm-shelf__arrow--r" aria-label="Вперёд" @click="scrollShelf(1, gal)"><DmIcon name="right" /></button>
      </div>
    </section>

    <section class="dm-wrap dm-sec">
      <div class="dm-sec__head">
        <div>
          <h2 class="dm-h2">Как купить</h2>
          <p class="dm-lead">Фабрика продаёт оптом, а в розницу наши столы и стулья продают дилеры и интернет-магазины.</p>
        </div>
      </div>
      <div class="dm-ways">
        <div class="dm-way">
          <DmIcon name="globe" />
          <h3>В интернет-магазине</h3>
          <p>Модели «Домотеки» в официальных магазинах на площадках:</p>
          <div class="dm-markets">
            <a v-for="m in dmMarkets" :key="m.n" :href="m.url" target="_blank" rel="noopener" class="dm-market" :title="m.n"><img :src="dmImg(m.img)" :alt="m.n" width="200" height="60" loading="lazy" /></a>
          </div>
        </div>
        <div class="dm-way">
          <DmIcon name="store" />
          <h3>В магазине вашего города</h3>
          <p>Магазины с нашей мебелью — в 268 городах. В Москве:</p>
          <ul class="dm-way__list">
            <li v-for="d in dmDealers.slice(0, 3)" :key="d.id"><b>{{ d.n }}</b><span>{{ d.addr }}</span></li>
          </ul>
          <NuxtLink :to="{ path: to('/gde-kupit/'), hash: '#magaziny' }" class="dm-btn dm-btn--soft">Все магазины на карте<DmIcon name="right" /></NuxtLink>
        </div>
        <div class="dm-way dm-way--opt">
          <DmIcon name="box" />
          <h3>Оптом — для магазинов</h3>
          <p>Отгрузка в день оплаты, гибкая система скидок, поддержка рекламной продукцией. Звоните в оптовый отдел или пишите на почту.</p>
          <a href="tel:+74999624038" class="dm-way__phone">+7 (499) 962-40-38</a>
          <NuxtLink :to="to('/dileram/')" class="dm-btn">Стать дилером</NuxtLink>
        </div>
      </div>
    </section>

    <section class="dm-wrap dm-sec">
      <div class="dm-help">
        <NuxtLink :to="to('/instrukcii/')" class="dm-help__item">
          <DmIcon name="doc" /><span><b>Инструкции по сборке</b><small>21 инструкция в PDF</small></span>
        </NuxtLink>
        <button type="button" class="dm-help__item" @click="ui.modal.value = 'ask'">
          <DmIcon name="chat" /><span><b>Задать вопрос</b><small>ответим на почту</small></span>
        </button>
        <NuxtLink :to="to('/kontakty/')" class="dm-help__item">
          <DmIcon name="phone" /><span><b>Связаться с нами</b><small>телефон, мессенджеры, адрес</small></span>
        </NuxtLink>
      </div>
    </section>

    <section class="dm-wrap dm-sec">
      <div class="dm-sec__head">
        <h2 class="dm-h2">Новости</h2>
        <NuxtLink :to="to('/novosti/')">Все новости<DmIcon name="right" /></NuxtLink>
      </div>
      <div class="dm-newsrow">
        <a v-for="n in dmNews.slice(0, 3)" :key="n.u" :href="n.u" target="_blank" rel="noopener" class="dm-newscard">
          <time>{{ n.d }}</time>
          <b>{{ n.t }}</b>
        </a>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.dm .dm-home {
  .dm-home__hero {
    padding-top: 20px;
  }
  .dm-home__facts {
    padding-top: 20px;
  }
  .dm-tiles {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 12px;
  }
  .dm-tile {
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: 4px;
    height: 100%;
    padding: 10px 10px 14px;
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r2);
    background: #fff;
    text-decoration: none;
    transition: border-color 0.2s;
    &:hover {
      border-color: var(--dm-acc);
      .dm-tile__img img {
        transform: scale(1.04);
      }
    }
    small {
      padding: 0 4px;
      font-size: 13px;
      color: var(--dm-muted);
    }
  }
  .dm-tile__img {
    position: relative;
    display: block;
    aspect-ratio: 1;
    margin-bottom: 6px;
    overflow: hidden;
    border-radius: 10px;
    img {
      position: absolute;
      inset: 6%;
      width: 88%;
      height: 88%;
      object-fit: contain;
      transition: transform 0.3s;
    }
  }
  .dm-tile--cover .dm-tile__img img {
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .dm-tile__name {
    padding: 0 4px;
    font: 700 16px/1.2 var(--dm-head);
    font-stretch: 108%;
    align-self: start;
  }
  .dm-kitchen {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  .dm-kitchen__item {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 0 18px 18px 0;
    border-radius: var(--dm-r2);
    background: var(--dm-surf);
    text-decoration: none;
    overflow: hidden;
    img {
      grid-column: 1 / -1;
      width: calc(100% + 18px);
      aspect-ratio: 3 / 2;
      height: auto;
      object-fit: cover;
      margin-bottom: 4px;
    }
    .dm-icon {
      display: grid;
      width: 40px;
      height: 40px;
      padding: 9px;
      border-radius: 50%;
      background: #fff;
      color: var(--dm-acc);
    }
    &:hover .dm-icon {
      background: var(--dm-acc);
      color: #fff;
    }
  }
  .dm-kitchen__text {
    display: grid;
    gap: 2px;
    padding-left: 18px;
    b {
      font: 800 20px/1.15 var(--dm-head);
      font-stretch: 112%;
    }
    small {
      font-size: 14px;
      color: var(--dm-muted);
    }
  }
  .dm-tabs {
    display: flex;
    gap: 6px 24px;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .dm-tabs__btn {
    position: relative;
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    padding: 0 0 8px;
    border: 0;
    background: none;
    color: var(--dm-muted);
    font: 800 clamp(20px, 2.2vw, 30px) / 1.1 var(--dm-head);
    font-stretch: 112%;
    white-space: nowrap;
    cursor: pointer;
    small {
      font: 600 14px/1 var(--dm-text);
      color: var(--dm-muted);
    }
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 3px;
      border-radius: 2px;
      background: transparent;
    }
    &:hover {
      color: var(--dm-ink);
    }
    &.is-on {
      color: var(--dm-ink);
      &::after {
        background: var(--dm-or);
      }
    }
  }
  .dm-gallery {
    grid-auto-columns: calc((100% - 2 * 16px) / 3.2);
    figure {
      position: relative;
      margin: 0;
      border-radius: var(--dm-r2);
      overflow: hidden;
    }
    img {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      height: auto;
      object-fit: cover;
    }
    figcaption {
      position: absolute;
      left: 12px;
      bottom: 12px;
      padding: 6px 10px;
      border-radius: 8px;
      background: #fff;
      font-size: 13px;
      font-weight: 600;
    }
  }
  .dm-ways {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr;
    gap: 16px;
  }
  .dm-way {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 24px;
    border-radius: var(--dm-r2);
    background: var(--dm-surf);
    > .dm-icon {
      width: 30px;
      height: 30px;
      color: var(--dm-or-d);
    }
    h3 {
      font: 800 21px/1.2 var(--dm-head);
      font-stretch: 112%;
    }
    p {
      color: var(--dm-muted);
    }
    .dm-markets {
      width: 100%;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .dm-btn {
      margin-top: auto;
    }
  }
  .dm-way__list {
    display: grid;
    gap: 10px;
    li {
      display: grid;
      font-size: 14px;
      b {
        font-size: 15px;
      }
      span {
        color: var(--dm-muted);
      }
    }
  }
  .dm-way__phone {
    font: 800 22px/1.2 var(--dm-head);
    text-decoration: none;
  }
  .dm-help {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  .dm-help__item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 20px;
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r2);
    background: #fff;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    > .dm-icon {
      width: 44px;
      height: 44px;
      padding: 10px;
      border-radius: 12px;
      background: var(--dm-blue-soft);
      color: var(--dm-acc);
    }
    span {
      display: grid;
    }
    b {
      font: 700 17px/1.25 var(--dm-head);
    }
    small {
      color: var(--dm-muted);
      font-size: 14px;
    }
    &:hover {
      border-color: var(--dm-acc);
    }
  }
  .dm-newsrow {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
}
// карточка новости — и на главной, и в «Новостях»
.dm .dm-newscard {
  display: grid;
  align-content: start;
  gap: 8px;
  padding: 18px 20px;
  border-radius: var(--dm-r2);
  background: var(--dm-surf);
  text-decoration: none;
  time {
    font-size: 13px;
    color: var(--dm-muted);
  }
  b {
    font: 700 16px/1.35 var(--dm-head);
  }
  &:hover b {
    color: var(--dm-acc);
  }
}
@media (max-width: 1400px) {
  .dm .dm-home .dm-tiles {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 1199px) {
  .dm .dm-home {
    .dm-ways {
      grid-template-columns: 1fr 1fr;
    }
    .dm-way:first-child {
      grid-column: 1 / -1;
    }
    .dm-way .dm-markets {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }
  }
}
@media (max-width: 989px) {
  .dm .dm-home {
    .dm-kitchen,
    .dm-help,
    .dm-newsrow {
      grid-template-columns: minmax(0, 1fr);
    }
    .dm-kitchen__item {
      grid-template-columns: 140px minmax(0, 1fr) auto;
      padding: 0 16px 0 0;
      img {
        grid-column: auto;
        width: 140px;
        height: 100%;
        aspect-ratio: 4 / 3;
        margin: 0;
      }
    }
    .dm-kitchen__text {
      padding-left: 0;
    }
    .dm-gallery {
      grid-auto-columns: calc((100% - 16px) / 2.2);
    }
  }
}
@media (max-width: 768px) {
  .dm .dm-home {
    .dm-home__hero {
      padding-top: 12px;
    }
    .dm-tiles {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }
    .dm-tile__name {
      font-size: 14px;
    }
    .dm-ways {
      grid-template-columns: minmax(0, 1fr);
    }
    .dm-way {
      padding: 20px;
    }
  }
}
@media (max-width: 576px) {
  .dm .dm-home {
    .dm-tiles {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .dm-way .dm-markets {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .dm-gallery {
      grid-auto-columns: 78%;
    }
    .dm-kitchen__item {
      grid-template-columns: 104px minmax(0, 1fr) auto;
      img {
        width: 104px;
      }
    }
    .dm-kitchen__text b {
      font-size: 17px;
    }
  }
}
</style>
