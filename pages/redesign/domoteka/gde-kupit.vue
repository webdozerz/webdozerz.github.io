<script lang="ts" setup>
// «Как купить» + «Интернет-магазины» + «Дилеры» оригинала на одной странице: два способа, площадки и магазины города на карте.
import { dmCities, dmContacts, dmDealers, dmImg, dmMarkets, dmOfferImg, dmPath } from '~/utils/domoteka'
import { dmProducts } from '~/utils/domoteka.data'
import { useDmUi } from '~/composables/useDomoteka'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'

useSeoMeta({ title: 'Как и где купить столы «Домотека» | Концепт редизайна' })
const route = useRoute()
const ui = useDmUi()
const model = computed(() => dmProducts.find((p) => p.id === route.query.model))
const isMoscow = computed(() => ui.city.value === 'Москва')
const focus = ref('')
const mapSrc = computed(() => {
  const pts = dmDealers.filter((d) => d.geo)
  const f = pts.find((d) => d.id === focus.value)
  const pt = pts.map((d) => `${d.geo![1]},${d.geo![0]},pm2${d.id === focus.value ? 'orm' : 'blm'}`).join('~')
  const ll = f ? `${f.geo![1]},${f.geo![0]}` : '37.76,55.69'
  return `https://yandex.ru/map-widget/v1/?ll=${ll}&z=${f ? 14 : 10}&pt=${pt}`
})
</script>

<template>
  <div class="dm-wrap dm-where">
    <div class="dm-page-head">
      <nav class="dm-crumbs" aria-label="Навигация"><NuxtLink :to="dmPath('/')">Главная</NuxtLink><span>Как купить</span></nav>
      <h1 class="dm-h1">Как купить</h1>
      <p class="dm-lead">Приобрести продукцию фабрики «Домотека» можно двумя способами: в интернет-магазине или в розничном магазине вашего города. Оптом — напрямую у фабрики.</p>
    </div>

    <div v-if="model" class="dm-where__model">
      <img :src="dmOfferImg(model.offers[0])" :alt="model.n" width="120" height="120" />
      <div>
        <small>Вы выбрали</small>
        <b>{{ model.n }}</b>
        <NuxtLink :to="dmPath(`/model/${model.id}/`)">Вернуться к модели</NuxtLink>
      </div>
    </div>

    <nav class="dm-where__jump" aria-label="Разделы">
      <a href="#internet" class="dm-chip"><DmIcon name="globe" />Интернет-магазины</a>
      <a href="#magaziny" class="dm-chip"><DmIcon name="store" />Магазины в городе</a>
      <a href="#opt" class="dm-chip"><DmIcon name="box" />Оптом</a>
    </nav>

    <section id="internet" class="dm-sec dm-where__sec">
      <h2 class="dm-h2">В интернет-магазине</h2>
      <p class="dm-lead">Официальные магазины «Домотеки» на площадках — с доставкой по всей России.</p>
      <div class="dm-markets dm-where__markets">
        <a v-for="m in dmMarkets" :key="m.n" :href="m.url" target="_blank" rel="noopener" class="dm-market dm-where__market">
          <img :src="dmImg(m.img)" :alt="m.n" width="200" height="60" loading="lazy" />
          <span>{{ m.n }}<DmIcon name="right" /></span>
        </a>
      </div>
    </section>

    <section id="magaziny" class="dm-sec dm-where__sec">
      <div class="dm-sec__head">
        <div>
          <h2 class="dm-h2">В розничном магазине</h2>
          <p class="dm-lead">Наши столы и стулья продают более 400 дилеров — 1500 точек продаж в 268 городах.</p>
        </div>
        <label class="dm-field dm-where__city">
          <span>Ваш город</span>
          <select v-model="ui.city.value">
            <option v-for="c in dmCities" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
      </div>
      <div v-if="isMoscow" class="dm-where__shops">
        <ul class="dm-where__list">
          <li v-for="d in dmDealers" :key="d.id" class="dm-dealer" :class="{ 'is-on': focus === d.id }">
            <b>{{ d.n }}</b>
            <span>{{ d.addr }}</span>
            <a v-if="d.tel" :href="`tel:${d.tel}`">{{ d.phone }}</a>
            <button v-if="d.geo" type="button" class="dm-where__onmap" @click="focus = focus === d.id ? '' : d.id">
              <DmIcon name="pin" />{{ focus === d.id ? 'Показать все' : 'Показать на карте' }}
            </button>
            <a v-else href="https://lifemebel.ru/brand/domoteka/" target="_blank" rel="noopener">Перейти в магазин</a>
          </li>
        </ul>
        <div class="dm-map">
          <iframe :src="mapSrc" title="Магазины с мебелью «Домотека» в Москве" loading="lazy" />
          <a class="dm-map__fallback" href="https://yandex.ru/maps/?text=%D0%94%D0%BE%D0%BC%D0%BE%D1%82%D0%B5%D0%BA%D0%B0%20%D1%81%D1%82%D0%BE%D0%BB%D1%8B" target="_blank" rel="noopener"><DmIcon name="pin" />Открыть в Яндекс Картах</a>
        </div>
      </div>
      <div v-else class="dm-empty">
        <DmIcon name="store" />
        <b>Магазины в городе {{ ui.city.value }}</b>
        <p>Демо: в концепте показан список Москвы. На сайте здесь будут магазины выбранного города из вашей базы дилеров — с картой и телефонами.</p>
        <button type="button" class="dm-btn" @click="ui.city.value = 'Москва'">Показать Москву</button>
      </div>
    </section>

    <section id="opt" class="dm-sec dm-where__sec">
      <div class="dm-where__opt">
        <div>
          <h2 class="dm-h2">Оптом</h2>
          <p class="dm-lead">Чтобы приобрести столы оптом, свяжитесь с оптовым отделом фабрики. Отгрузка в день оплаты, все модели всегда в наличии на складе.</p>
        </div>
        <div class="dm-where__optc">
          <a :href="`tel:${dmContacts.tel}`" class="dm-where__phone">{{ dmContacts.phone }}</a>
          <a :href="`mailto:${dmContacts.sales}`">{{ dmContacts.sales }}</a>
          <span>{{ dmContacts.hours }}</span>
          <NuxtLink :to="dmPath('/dileram/')" class="dm-btn">Условия для дилеров</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.dm .dm-where {
  .dm-where__model {
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: 520px;
    margin-top: 16px;
    padding: 12px 18px 12px 12px;
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r2);
    img {
      width: 84px;
      height: 84px;
      object-fit: contain;
    }
    div {
      display: grid;
      gap: 2px;
    }
    small {
      color: var(--dm-muted);
      font-size: 13px;
    }
    b {
      font: 700 18px/1.2 var(--dm-head);
    }
    a {
      color: var(--dm-acc);
      font-size: 14px;
    }
  }
  .dm-where__jump {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
    .dm-icon {
      width: 17px;
      height: 17px;
      color: var(--dm-acc);
    }
  }
  .dm-where__sec {
    padding-top: 48px;
    > .dm-lead {
      margin-bottom: 20px;
    }
  }
  .dm-where__markets {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
  .dm-where__market {
    height: auto;
    gap: 10px;
    padding: 18px 14px 14px;
    text-decoration: none;
    img {
      height: 40px;
    }
    span {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 14px;
      font-weight: 600;
      .dm-icon {
        width: 15px;
        height: 15px;
      }
    }
  }
  .dm-where__city {
    min-width: 240px;
  }
  .dm-where__shops {
    display: grid;
    grid-template-columns: 380px minmax(0, 1fr);
    gap: 16px;
    .dm-map {
      min-height: 460px;
    }
  }
  .dm-where__list {
    display: grid;
    align-content: start;
    gap: 10px;
    .dm-dealer.is-on {
      border-color: var(--dm-or);
    }
  }
  .dm-where__onmap {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--dm-acc);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    .dm-icon {
      width: 16px;
      height: 16px;
    }
  }
  .dm-where__opt {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 24px 40px;
    padding: 32px;
    border-radius: 20px;
    background: var(--dm-surf);
  }
  .dm-where__optc {
    display: grid;
    align-content: start;
    gap: 8px;
    a {
      color: var(--dm-acc);
    }
    span {
      color: var(--dm-muted);
    }
    .dm-btn {
      justify-self: start;
      margin-top: 8px;
      color: #fff;
    }
  }
  .dm-where__phone {
    color: var(--dm-ink) !important;
    font: 800 28px/1.15 var(--dm-head);
    font-stretch: 112%;
    text-decoration: none;
  }
}
@media (max-width: 1199px) {
  .dm .dm-where {
    .dm-where__markets {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .dm-where__shops {
      grid-template-columns: 320px minmax(0, 1fr);
    }
  }
}
@media (max-width: 989px) {
  .dm .dm-where {
    .dm-where__shops,
    .dm-where__opt {
      grid-template-columns: minmax(0, 1fr);
    }
    .dm-where__shops .dm-map {
      min-height: 360px;
    }
  }
}
@media (max-width: 576px) {
  .dm .dm-where {
    .dm-where__markets {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .dm-where__city {
      min-width: 0;
      width: 100%;
    }
    .dm-where__opt {
      padding: 22px 18px;
    }
    .dm-where__phone {
      font-size: 24px;
    }
  }
}
</style>
