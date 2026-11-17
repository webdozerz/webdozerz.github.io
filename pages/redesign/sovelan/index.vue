<script lang="ts" setup>
import { svCatById, svCats, svContacts, svImg, svInCat, svMarkets, svMoscowNow, svNotes, svPath, svPcs, svTotal, svUpcoming } from '~/utils/sovelan'
import SvIcon from '~/components/redesign/sovelan/SvIcon.vue'
import SvCard from '~/components/redesign/sovelan/SvCard.vue'
import SvCalendar from '~/components/redesign/sovelan/SvCalendar.vue'

useSeoMeta({ title: 'Ореховые Эланки и Виланки — «Созвездие вкуса», Пенза | Концепт редизайна' })

const nowIso = useState('sv-now', () => svMoscowNow().toISOString())
const next = computed(() => svUpcoming(new Date(nowIso.value))[0])
const season = computed(() => svCatById(next.value.cat)!)
const shelf = computed(() => svInCat(season.value.id).slice(0, 8))
</script>

<template>
  <div>
    <section class="sv-wrap sv-hero">
      <div class="sv-hero__head">
        <div>
          <h1>Ореховые Эланки<sup>®</sup> и Виланки<sup>®</sup></h1>
          <p class="sv-hero__lead">
            Кондитерское производство «Созвездие вкуса» в Пензе: зефир, суфле, мармелад и пирожное «картошка» с декорацией из глазури. {{ svTotal }} позиций в {{ svCats.length }} коллекциях.
          </p>
        </div>
        <div class="sv-hero__actions">
          <NuxtLink :to="svPath('/katalog/')" class="sv-btn"><SvIcon name="grid" />Весь каталог</NuxtLink>
          <a href="#opt" class="sv-btn sv-btn--line">Как купить оптом</a>
        </div>
      </div>
      <h2 class="sv-hero__cal">Коллекции к праздникам</h2>
      <SvCalendar />
    </section>

    <section class="sv-wrap sv-section">
      <div class="sv-sechead">
        <div>
          <h2>Коллекция «{{ season.name }}»</h2>
          <p>{{ season.count }} {{ svPcs(season.count) }} к празднику «{{ next.name }}». Наведите на фото — покажем упаковку.</p>
        </div>
        <NuxtLink :to="svPath(`/katalog/${season.id}/`)">Вся коллекция<SvIcon name="right" /></NuxtLink>
      </div>
      <div class="sv-grid sv-home__shelf">
        <SvCard v-for="p in shelf" :key="p.id" :p="p" />
      </div>
    </section>

    <section class="sv-wrap sv-section">
      <div class="sv-sechead">
        <div>
          <h2>Все коллекции</h2>
          <p>Сезонные наборы и линейки круглый год — {{ svCats.length }} разделов, как на сайте.</p>
        </div>
      </div>
      <div class="sv-colls">
        <NuxtLink v-for="c in svCats" :key="c.id" :to="svPath(`/katalog/${c.id}/`)" class="sv-colls__a">
          <span class="sv-colls__img"><img :src="svImg(c.img)" :alt="c.name" width="260" height="320" loading="lazy" /></span>
          <b>{{ c.name }}</b>
          <small>{{ c.count }} {{ svPcs(c.count) }}</small>
        </NuxtLink>
      </div>
    </section>

    <section id="opt" class="sv-wrap sv-section">
      <div class="sv-buyways">
        <div class="sv-buyways__opt">
          <h2>Оптом — по договору</h2>
          <p>Соберите заявку из каталога: количество и общий вес посчитаются сами. Для оптовой покупки нужно заключить договор — звоните или пишите в отдел продаж.</p>
          <div class="sv-buyways__contacts">
            <a v-for="ph in svContacts.phones" :key="ph.tel" :href="`tel:${ph.tel}`" class="sv-buyways__phone"><SvIcon name="phone" />{{ ph.label }}</a>
            <a :href="`mailto:${svContacts.sales}`" class="sv-buyways__mail"><SvIcon name="mail" />{{ svContacts.sales }}</a>
            <span class="sv-buyways__addr"><SvIcon name="pin" />{{ svContacts.address }}</span>
          </div>
          <NuxtLink :to="svPath('/zayavka/')" class="sv-btn"><SvIcon name="bag" />Перейти к заявке</NuxtLink>
        </div>
        <div class="sv-buyways__retail">
          <h2>В розницу — на маркетплейсах</h2>
          <p>Для личного пользования продукцию можно купить в магазинах производителя на маркетплейсах.</p>
          <div class="sv-buyways__markets">
            <a v-for="m in svMarkets" :key="m.id" :href="m.url" target="_blank" rel="noopener">
              <img :src="svImg(m.icon)" :alt="m.name" width="32" height="32" />
              <span>{{ m.name }}</span>
              <SvIcon name="right" />
            </a>
          </div>
        </div>
      </div>
      <ul class="sv-notes">
        <li><SvIcon name="shield" /><span>{{ svNotes.fake }}</span></li>
        <li><SvIcon name="scale" /><span>{{ svNotes.weight }}</span></li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss">
.sv-hero {
  padding-top: 34px;
  &__head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px;
    margin-bottom: 30px;
    h1 {
      font-size: clamp(32px, 4vw, 52px);
      line-height: 1.05;
      sup {
        font-size: 0.4em;
        color: var(--sv-acc);
        vertical-align: 0.95em;
        margin-left: 1px;
      }
    }
  }
  &__lead {
    max-width: 680px;
    margin-top: 12px !important;
    font-size: 17px;
    color: var(--sv-muted);
  }
  &__actions {
    display: flex;
    gap: 10px;
    flex: none;
  }
  &__cal {
    margin-bottom: 16px !important;
    font-size: 15px !important;
    font-family: var(--sv-body) !important;
    font-weight: 600 !important;
    color: var(--sv-muted) !important;
    letter-spacing: 0 !important;
  }
}
.sv-grid.sv-home__shelf {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.sv-colls {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 150px), 1fr));
  gap: 22px 16px;
  &__a {
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: 4px;
    &:hover b {
      color: var(--sv-acc);
    }
    &:hover img {
      transform: scale(1.04);
    }
  }
  &__img {
    position: relative;
    display: block;
    aspect-ratio: 260 / 320;
    margin-bottom: 6px;
    border-radius: 16px;
    overflow: hidden;
    background: var(--sv-surface);
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
  }
  b {
    font: 800 16px/1.2 var(--sv-head);
    color: var(--sv-dark);
    transition: color 0.2s;
  }
  small {
    color: var(--sv-muted);
    font-size: 13px;
  }
}
.sv-buyways {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 18px;
  > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 32px;
    border-radius: var(--sv-R);
  }
  h2 {
    font-size: 28px;
  }
  p {
    color: var(--sv-muted);
    max-width: 560px;
  }
  &__opt {
    background: var(--sv-soft);
    .sv-btn {
      margin-top: auto;
    }
  }
  &__retail {
    background: var(--sv-surface);
  }
  &__contacts {
    display: grid;
    gap: 8px;
    margin: 4px 0 8px;
    a,
    span {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .sv-icon {
      color: var(--sv-acc);
    }
  }
  &__phone {
    font: 800 22px/1.3 var(--sv-head);
    color: var(--sv-dark);
  }
  &__mail {
    font-weight: 600;
    color: var(--sv-dark);
  }
  &__addr {
    color: var(--sv-muted);
  }
  &__markets {
    display: grid;
    gap: 10px;
    width: 100%;
    margin-top: auto;
    a {
      display: grid;
      grid-template-columns: 32px 1fr 20px;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-radius: 16px;
      background: #fff;
      font-weight: 600;
      color: var(--sv-dark);
      transition: transform 0.2s;
      &:hover {
        transform: translateX(3px);
      }
      img {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }
    }
  }
}
ul.sv-notes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  li {
    display: flex;
    gap: 12px;
    padding: 18px 20px;
    border: 1px solid var(--sv-line);
    border-radius: 18px;
    font-size: 14px;
    .sv-icon {
      color: var(--sv-acc);
      width: 22px;
      height: 22px;
    }
  }
}
@media (max-width: 1199px) {
  .sv-hero__head {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }
  .sv-buyways {
    grid-template-columns: 1fr;
  }
  .sv-grid.sv-home__shelf {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    > :nth-child(n + 7) {
      display: none;
    }
  }
}
@media (max-width: 768px) {
  .sv-hero {
    padding-top: 22px;
    &__head {
      margin-bottom: 22px;
    }
    &__lead {
      font-size: 15px;
    }
    &__head {
      gap: 0;
    }
    &__actions {
      display: none !important;
    }
  }
  .sv-grid.sv-home__shelf {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .sv-colls {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px 10px;
    b {
      font-size: 14px;
    }
  }
  .sv-buyways > div {
    padding: 22px 18px;
  }
  .sv-buyways h2 {
    font-size: 22px;
  }
  ul.sv-notes {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 375px) {
  .sv-colls {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .sv-hero__actions {
    flex-direction: column;
  }
}
</style>
