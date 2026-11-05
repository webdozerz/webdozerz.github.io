<script lang="ts" setup>
import ZlIcon from '~/components/redesign/zolotieluga/ZlIcon.vue'
import ZlCard from '~/components/redesign/zolotieluga/ZlCard.vue'
import ZlWhere from '~/components/redesign/zolotieluga/ZlWhere.vue'
import type { ZlBrand } from '~/utils/zolotieluga'

const ui = useZolotielugaUi()

// Витрина первого экрана: шесть бутылок «Золотых лугов» одной высоты в одинаковых плитках, под бутылкой — название
// и жирность (цен у оригинала нет). Снимки бутылок — плотная обрезка без полей, поэтому одна высота = ровный ряд.
const rack = ['43', '60', '11', '1064', '61', '1220'].map((id) => zlProduct(id)!)
const rackTag: Record<string, string> = { '11': 'Молоко', '1064': 'Йогурт', '1220': 'С гранолой' }

const cityCount = computed(() => zlStoreCount(ui.city.value))
const cityIn = computed(() => zlCityIn[zlCities[ui.city.value]])

const tab = ref<ZlBrand>('zl')
const railProducts = computed(() => zlProducts.filter((p) => p.brand === tab.value))
const track = ref<HTMLElement | null>(null)
const scroll = (dir: number) => track.value?.scrollBy({ left: dir * track.value.clientWidth * 0.8, behavior: 'smooth' })
watch(tab, () => track.value?.scrollTo({ left: 0 }))

const brandCount = (b: ZlBrand) => zlProducts.filter((p) => p.brand === b).length
const brandThumbs = (b: ZlBrand) => zlProducts.filter((p) => p.brand === b).slice(0, 4)
const lastAwards = zlAwards.slice(0, 4)
const news = zlNews.slice(0, 3)
const vacCities = zlVacancyIntro.cities.map((c) => ({ c, n: zlVacancies.filter((v) => v.city === c).length })).filter((x) => x.n)
</script>

<template>
  <div class="zl-home">
    <section class="zl-wrap zl-hero">
      <div class="zl-hero__panel">
        <p class="zl-hero__kicker">Ситниковский молочный комбинат · с 1932 года</p>
        <h1>Молочные продукты без консервантов и без&nbsp;Е</h1>
        <p class="zl-hero__lead">
          Только из натурального молока: молоко, кефир, ряженка, творог, сметана, масло и сыр марок «Золотые луга» и «Ситниковское».
        </p>
        <div class="zl-finder">
          <label for="zl-finder-city">Где купить в {{ cityIn }}?</label>
          <div class="zl-finder__row">
            <span class="zl-finder__select">
              <ZlIcon name="pin" :size="20" />
              <select id="zl-finder-city" :value="ui.city.value" @change="ui.setCity(Number(($event.target as HTMLSelectElement).value))">
                <option v-for="(c, i) in zlCities" :key="c" :value="i">{{ c }}</option>
              </select>
              <ZlIcon name="down" :size="18" />
            </span>
            <NuxtLink :to="zlPath('/where')" class="zl-btn zl-btn--main"
              >Показать {{ zlPlural(cityCount, 'магазин', 'магазина', 'магазинов') }}</NuxtLink
            >
          </div>
        </div>
        <ul class="zl-hero__facts">
          <li><b>до 800 т</b><span>молока в сутки принимает комбинат</span></li>
          <li><b>{{ zlStores.length }}</b><span>магазинов в {{ zlCities.length }} городах</span></li>
          <li><b>{{ zlAwardsTotal }}</b><span>наград на конкурсах и выставках</span></li>
        </ul>
      </div>
      <div class="zl-hero__shelf">
        <div class="zl-rack">
          <NuxtLink v-for="p in rack" :key="p.id" :to="zlProductPath(p.id)" class="zl-rack__item">
            <span class="zl-rack__img"><img :src="zlImg(p.imgs[0])" :alt="'Золотые луга, ' + p.name" width="150" height="420" /></span>
            <b>{{ rackTag[p.id] || p.name }}</b>
            <small>{{ p.fats.length ? p.fats.join(', ') : '720 г' }}</small>
          </NuxtLink>
        </div>
        <NuxtLink :to="zlPath('/products')" class="zl-rack__all">Вся продукция — {{ zlProducts.length }} <ZlIcon name="arrow" :size="18" /></NuxtLink>
      </div>
    </section>

    <section class="zl-wrap zl-section">
      <div class="zl-brands">
        <NuxtLink
          v-for="b in zlBrands"
          :key="b.id"
          :to="zlPath('/products?brand=' + b.id)"
          class="zl-brand"
          :class="'zl-brand--' + b.id"
        >
          <img :src="zlImg(b.img)" :alt="b.title" width="261" height="250" class="zl-brand__emb" />
          <div class="zl-brand__text">
            <h2>{{ b.title }}</h2>
            <p>{{ b.note }}</p>
            <span class="zl-link">{{ zlPlural(brandCount(b.id), 'продукт', 'продукта', 'продуктов') }} <ZlIcon name="arrow" :size="18" /></span>
          </div>
          <div class="zl-brand__thumbs">
            <img v-for="p in brandThumbs(b.id)" :key="p.id" :src="zlImg(p.imgs[0])" alt="" width="80" height="80" loading="lazy" />
          </div>
        </NuxtLink>
        <a :href="zlZdorovo.url" target="_blank" rel="noopener" class="zl-brand zl-brand--zdorovo">
          <img :src="zlImg(zlZdorovo.img)" :alt="zlZdorovo.title" width="261" height="250" class="zl-brand__emb" />
          <div class="zl-brand__text">
            <h2>{{ zlZdorovo.title }}</h2>
            <p>{{ zlZdorovo.note }}</p>
            <span class="zl-link">zdorovo.life <ZlIcon name="external" :size="16" /></span>
          </div>
        </a>
      </div>
    </section>

    <section class="zl-wrap zl-section">
      <div class="zl-head">
        <div>
          <h2>Продукция</h2>
          <p>Жирность, объём и срок годности — сразу в карточке. Медаль — сколько наград у продукта.</p>
        </div>
        <div class="zl-home__railhead">
        <div class="zl-tabs" role="tablist">
          <button
            v-for="b in zlBrands"
            :key="b.id"
            type="button"
            role="tab"
            :aria-selected="tab === b.id"
            :class="{ 'is-on': tab === b.id }"
            @click="tab = b.id"
          >
            {{ b.title }} <small>{{ brandCount(b.id) }}</small>
          </button>
        </div>
        <div class="zl-rail__nav">
          <button type="button" class="zl-rail__btn" aria-label="Назад" @click="scroll(-1)"><ZlIcon name="left" /></button>
          <button type="button" class="zl-rail__btn" aria-label="Вперёд" @click="scroll(1)"><ZlIcon name="right" /></button>
        </div>
        </div>
      </div>
      <div class="zl-rail">
        <div ref="track" class="zl-rail__track">
          <ZlCard v-for="p in railProducts" :key="p.id" :product="p" />
        </div>
      </div>
    </section>

    <section class="zl-wrap zl-section">
      <div class="zl-pure">
        <div class="zl-pure__text">
          <h2>Что такое полезные молочные продукты в нашем понимании</h2>
          <p>{{ zlCompany.text[1] }}</p>
          <ul class="zl-pure__list">
            <li v-for="w in zlWithout" :key="w"><ZlIcon name="no" :size="22" />{{ w }}</li>
          </ul>
          <NuxtLink :to="zlPath('/company')" class="zl-link">О компании <ZlIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <div class="zl-pure__side">
          <div class="zl-stitch zl-pure__ribbon" aria-hidden="true" />
          <dl class="zl-pure__nums">
            <div><dt>с 1932</dt><dd>работает комбинат в Ситниково</dd></div>
            <div><dt>800 т</dt><dd>молока в сутки — мощность приёмки</dd></div>
            <div><dt>{{ zlOffices.length }}</dt><dd>филиалов на Урале и в Западной Сибири</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="zl-wrap zl-section">
      <ZlWhere title="Где купить" compact />
    </section>

    <section class="zl-wrap zl-section">
      <div class="zl-head">
        <div>
          <h2>Награды</h2>
          <p>Продукция «Золотых лугов» ежегодно становится лауреатом конкурсов — всего {{ zlAwardsTotal }} наград.</p>
        </div>
        <NuxtLink :to="zlPath('/awards')" class="zl-link">Все награды <ZlIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="zl-awards">
        <article v-for="a in lastAwards" :key="a.date + a.title" class="zl-award">
          <ZlIcon name="award" :size="28" />
          <small>{{ a.date }}</small>
          <h3>{{ a.title }}</h3>
          <p>{{ a.items.slice(0, 3).join('; ') }}<template v-if="a.items.length > 3"> и ещё {{ a.items.length - 3 }}</template></p>
        </article>
      </div>
    </section>

    <section class="zl-wrap zl-section">
      <div class="zl-head">
        <h2>Новости</h2>
        <NuxtLink :to="zlPath('/news')" class="zl-link">Все новости <ZlIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="zl-newsgrid">
        <NuxtLink v-for="n in news" :key="n.id" :to="zlPath('/news/' + n.id)" class="zl-newscard">
          <div class="zl-newscard__img"><img :src="zlImg(n.img)" alt="" width="300" height="180" loading="lazy" /></div>
          <small>{{ n.date }}</small>
          <h3>{{ n.title }}</h3>
        </NuxtLink>
      </div>
    </section>

    <section class="zl-wrap zl-section">
      <div class="zl-duo">
        <div class="zl-panel zl-duo__item">
          <ZlIcon name="truck" :size="30" />
          <h2>Партнёрам и оптовикам</h2>
          <p>{{ zlOpt.lead }} {{ zlOpt.stock }}</p>
          <div class="zl-duo__actions">
            <NuxtLink :to="zlPath('/opt')" class="zl-btn zl-btn--main">Условия для партнёров</NuxtLink>
            <a :href="zlContacts.partners" target="_blank" rel="noopener" class="zl-btn zl-btn--line">Личный кабинет <ZlIcon name="external" :size="16" /></a>
          </div>
        </div>
        <div class="zl-panel zl-duo__item">
          <ZlIcon name="people" :size="30" />
          <h2>Работа в «Золотых лугах»</h2>
          <p>{{ zlPlural(zlVacancies.length, 'вакансия', 'вакансии', 'вакансий') }}: водители, комплектовщики, операторы и наладчики на производстве в Ситниково и в филиалах.</p>
          <div class="zl-duo__cities">
            <NuxtLink v-for="v in vacCities" :key="v.c" :to="zlPath('/vacancies?city=' + encodeURIComponent(v.c))" class="zl-btn zl-btn--line zl-btn--small"
              >{{ v.c }} <small>{{ v.n }}</small></NuxtLink
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.zl-home__railhead {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  max-width: 100%;
}
.zl-hero {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  gap: 20px;
  padding-top: 24px;
  &__panel {
    display: flex;
    flex-direction: column;
    padding: 40px;
    border-radius: 24px;
    background: var(--zl-surface);
  }
  &__kicker {
    font-size: 15px;
    font-weight: 500;
    color: var(--zl-accent);
  }
  h1 {
    margin-top: 14px;
    font-size: clamp(32px, 3.5vw, 50px);
    line-height: 1.06;
    letter-spacing: -0.015em;
    text-wrap: balance;
  }
  &__lead {
    margin-top: 16px;
    font-size: 17px;
    max-width: 520px;
  }
  ul.zl-hero__facts {
    margin-top: auto;
    padding-top: 28px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    li {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    b {
      font-family: var(--zl-head);
      font-size: 26px;
      color: var(--zl-ink);
      white-space: nowrap;
    }
    span {
      font-size: 13px;
      line-height: 1.35;
      color: var(--zl-muted);
    }
  }
  &__shelf {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
  }
}
.zl-finder {
  margin-top: 28px;
  padding: 18px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid var(--zl-line);
  label {
    display: block;
    font-weight: 600;
    color: var(--zl-ink);
    margin-bottom: 10px;
  }
  &__row {
    display: flex;
    gap: 10px;
  }
  &__select {
    position: relative;
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    .zl-icon {
      position: absolute;
      pointer-events: none;
      color: var(--zl-muted);
      &:first-child {
        left: 12px;
        color: var(--zl-accent);
      }
      &:last-child {
        right: 12px;
      }
    }
    select {
      width: 100%;
      height: 46px;
      padding: 0 36px 0 40px;
      border: 1px solid var(--zl-line);
      border-radius: var(--zl-r);
      background: #fff;
      font-size: 15px;
      appearance: none;
      cursor: pointer;
      outline: 0;
      &:focus {
        border-color: var(--zl-accent);
      }
    }
  }
}

.zl-rack {
  --zl-bottle: clamp(150px, 13.5vw, 200px);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 0;
    padding: 18px 10px 14px;
    border-radius: var(--zl-R);
    border: 1px solid var(--zl-line);
    background: #fff;
    text-align: center;
    transition: border-color 0.2s;
    b {
      margin-top: 12px;
      font-weight: 600;
      font-size: 15px;
      line-height: 1.25;
      color: var(--zl-ink);
    }
    small {
      font-size: 13px;
      color: var(--zl-muted);
    }
    &:hover {
      border-color: #e8bbb5;
      b {
        color: var(--zl-accent);
      }
      img {
        transform: scale(1.04);
      }
    }
  }
  &__img {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: var(--zl-bottle);
    img {
      height: 100%;
      width: auto;
      max-width: 100%;
      object-fit: contain;
      transition: transform 0.25s;
      transform-origin: 50% 100%;
    }
  }
  &__all {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    align-self: flex-start;
    font-weight: 600;
    color: var(--zl-accent);
  }
}
.zl-hero__shelf > .zl-rack__all {
  margin-left: 4px;
}
@media (max-width: 1199px) {
  .zl-rack {
    --zl-bottle: 160px;
  }
}
@media (max-width: 989px) {
  .zl-rack {
    --zl-bottle: 200px;
  }
}
@media (max-width: 768px) {
  .zl-rack {
    --zl-bottle: 150px;
  }
}
@media (max-width: 576px) {
  .zl-rack {
    --zl-bottle: 120px;
    gap: 8px;
    &__item {
      padding: 12px 4px 10px;
      b {
        margin-top: 8px;
        font-size: 14px;
      }
      small {
        font-size: 12px;
      }
    }
  }
}
@media (max-width: 375px) {
  .zl-rack {
    --zl-bottle: 100px;
  }
}

.zl-brands {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.zl-brand {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 6px 18px;
  padding: 22px;
  border-radius: var(--zl-R);
  border: 1px solid var(--zl-line);
  transition: border-color 0.2s;
  &:hover {
    border-color: #e8bbb5;
  }
  &__emb {
    width: 92px;
    height: auto;
  }
  &__text {
    display: flex;
    flex-direction: column;
    gap: 6px;
    h2 {
      font-size: 22px;
    }
    p {
      font-size: 14px;
      color: var(--zl-muted);
    }
    .zl-link {
      margin-top: auto;
    }
  }
  &--sit .zl-link {
    color: var(--zl-sit);
  }
  &--zdorovo {
    background: #fdeef5;
    border-color: #fdeef5;
    align-content: center;
    .zl-link {
      color: #c2186b;
    }
  }
  &__thumbs {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
    margin-top: 12px;
    img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: contain;
    }
  }
}

.zl-pure {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 20px;
  &__text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 40px;
    border-radius: 24px;
    background: var(--zl-soft);
    h2 {
      font-size: clamp(26px, 2.6vw, 34px);
      max-width: 620px;
    }
    p {
      max-width: 640px;
    }
  }
  ul.zl-pure__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 20px;
    margin: 4px 0 8px;
    li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      color: var(--zl-ink);
      .zl-icon {
        color: var(--zl-accent);
      }
    }
  }
  &__side {
    position: relative;
    display: flex;
    align-items: center;
    padding: 40px;
    border-radius: 24px;
    border: 1px solid var(--zl-line);
    overflow: hidden;
  }
  &__ribbon {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
  &__nums {
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 22px;
    dt {
      font-family: var(--zl-head);
      font-weight: 700;
      font-size: 34px;
      line-height: 1;
      color: var(--zl-accent);
    }
    dd {
      margin: 4px 0 0;
      color: var(--zl-muted);
      font-size: 14px;
    }
  }
}



.zl-duo {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  &__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 32px;
    > .zl-icon {
      color: var(--zl-accent);
    }
    h2 {
      font-size: 26px;
    }
  }
  &__actions,
  &__cities {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: auto;
    padding-top: 8px;
    small {
      color: var(--zl-muted);
    }
  }
}

@media (max-width: 1400px) {
}
@media (max-width: 1199px) {
  .zl-hero {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    &__panel {
      padding: 32px;
    }
    ul.zl-hero__facts {
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
      li {
        flex-direction: row;
        align-items: baseline;
        gap: 10px;
      }
      b {
        font-size: 22px;
        min-width: 86px;
      }
    }
  }
  .zl-brands {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .zl-brand--zdorovo {
    grid-column: 1 / -1;
  }
  .zl-awards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .zl-pure {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 989px) {
  .zl-hero {
    grid-template-columns: minmax(0, 1fr);
    ul.zl-hero__facts {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      li {
        flex-direction: column;
        gap: 2px;
      }
      b {
        min-width: 0;
      }
    }
  }
  .zl-newsgrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    .zl-newscard:nth-child(3) {
      display: none;
    }
  }
  .zl-duo {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 768px) {
  .zl-hero {
    padding-top: 16px;
    gap: 12px;
    &__panel {
      display: contents;
    }
    &__kicker {
      order: 1;
    }
    h1 {
      order: 2;
      margin-top: 4px;
    }
    &__lead {
      order: 3;
      margin-top: 0;
      font-size: 16px;
    }
    &__shelf {
      order: 4;
      gap: 12px;
    }
    .zl-finder {
      order: 5;
      margin-top: 0;
      background: var(--zl-surface);
      border: 0;
    }
    ul.zl-hero__facts {
      order: 6;
      padding-top: 8px;
    }
  }
  .zl-brands {
    grid-template-columns: minmax(0, 1fr);
  }
  .zl-pure {
    &__text,
    &__side {
      padding: 24px;
    }
    ul.zl-pure__list {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
@media (max-width: 576px) {
  .zl-finder__row {
    flex-direction: column;
  }
  .zl-hero ul.zl-hero__facts {
    gap: 10px;
    b {
      font-size: 20px;
    }
  }
  .zl-awards,
  .zl-newsgrid {
    grid-template-columns: minmax(0, 1fr);
  }
  .zl-newsgrid .zl-newscard:nth-child(3) {
    display: flex;
  }
  .zl-pure__nums dt {
    font-size: 28px;
  }
}
@media (max-width: 375px) {
}
</style>
