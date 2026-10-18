<script lang="ts" setup>
import RsProductCard from '~/components/redesign/rybasibiri/RsProductCard.vue'
import RsWorkshops from '~/components/redesign/rybasibiri/RsWorkshops.vue'

const cart = useRybasibiriCart()
const router = useRouter()

const description =
  'Рыба и морепродукты из собственных цехов в Кемерове: магазин с понятными ценами за кг и за 100 г, оптовый прайс с заявкой, копчение, стейки и шоковая заморозка.'
useSeoMeta({
  title: '«Стиль Продукт» — концепт редизайна',
  ogTitle: '«Стиль Продукт» — концепт редизайна',
  description,
  ogDescription: description,
  ogImage: 'https://andryushov.me/redesign/rybasibiri/og.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const collage = ['chavycha-steiki', 'kapusta-sibiryachka', 'paltus-steiki', 'seld-file-limon'].map((id) => rsFind(id)!)

const inStock = rsProducts.filter(rsInStock)
const optCount = rsOpt.reduce((n, g) => n + g.items.length, 0)

const tiles = rsCategories.map((c) => {
  const items = rsOf(c.id)
  const live = items.filter(rsInStock)
  return { ...c, img: (live[0] ?? items[0]).img, count: live.length }
})

const shelf = ['paltus-steiki', 'forel', 'chavycha-steiki', 'seld-file-limon', 'kalmar-file', 'sibas', 'kapusta-klassicheskaya', 'treska-steiki'].map(
  (id) => rsFind(id)!,
)

// Фирменная деталь: один и тот же минтай глазами розничного и оптового покупателя.
const demo = ref<RsMode>('retail')
const demoRetail = rsFind('mintai-file')!
const demoOpt = rsOptFind('o-file-mintaya-bez-kozhi')!

const go = (mode: RsMode) => {
  cart.mode.value = mode
  router.push(mode === 'opt' ? rsPath('/opt') : rsPath('/catalog'))
}
</script>

<template>
  <div class="rsh">
    <section class="rs-wrap rsh-hero">
      <div class="rsh-hero__text">
        <p class="rsh-hero__kicker">Производственно-торговая компания «Стиль Продукт»</p>
        <h1>Рыба и морепродукты из собственных цехов</h1>
        <p class="rsh-hero__lead">
          Больше 15 лет торгуем оптом и в розницу. Разделываем рыбу на филе и стейки, коптим на ольховой
          щепе и замораживаем в камере шоковой заморозки — здесь, в Кемерове.
        </p>

        <div class="rsh-doors">
          <button type="button" class="rsh-door" @click="go('retail')">
            <span class="rsh-door__title">Купить в розницу</span>
            <span class="rsh-door__text">{{ inStock.length }} товаров в наличии, цена за кг или за 100 г на каждом ценнике</span>
            <span class="rsh-door__go">В магазин
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </button>
          <button type="button" class="rsh-door rsh-door--opt" @click="go('opt')">
            <span class="rsh-door__title">Оптом и для учреждений</span>
            <span class="rsh-door__text">Прайс на {{ optCount }} позиций, заявка онлайн, доставку рассчитаем за 30 минут</span>
            <span class="rsh-door__go">Открыть прайс
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </button>
        </div>
      </div>

      <div class="rsh-collage">
        <NuxtLink
          v-for="(p, i) in collage"
          :key="p.id"
          :to="rsPath(`/product/${p.id}`)"
          class="rsh-collage__item"
          :class="`rsh-collage__item--${i + 1}`"
        >
          <img :src="rsImg(p.img, 640)" :alt="rsTitle(p)" width="640" height="640" loading="eager" />
          <span class="rsh-collage__tag">
            <span>{{ p.name }}<template v-if="p.sub && p.unit !== 'pack'">, {{ p.sub }}</template></span>
            <b>{{ rsRub(p.price) }} <small>{{ rsPer(p) }}</small></b>
          </span>
        </NuxtLink>
      </div>
    </section>

    <section class="rs-wrap rsh-facts" aria-label="О компании в цифрах">
      <div><b>15+ лет</b><span>оптовой и розничной торговли рыбой</span></div>
      <div><b>7 цехов</b><span>разделка, копчение, салаты, вакуум, заморозка</span></div>
      <div><b>4 региона</b><span>Кемеровская, Новосибирская, Томская области и Алтайский край</span></div>
      <div><b>−30 °C</b><span>тоннельная камера шоковой заморозки Gunther</span></div>
    </section>

    <section class="rs-wrap rs-section">
      <div class="rs-head">
        <div>
          <h2>Магазин</h2>
          <p>Цены как на ценнике в магазине: за килограмм, за 100 граммов или за упаковку — и рядом пересчёт.</p>
        </div>
        <NuxtLink :to="rsPath('/catalog')" class="rs-link">Все товары · {{ rsProducts.length }}</NuxtLink>
      </div>
      <div class="rsh-cats">
        <NuxtLink v-for="t in tiles" :key="t.id" :to="rsPath(`/catalog/${t.id}`)" class="rsh-cat">
          <img :src="rsImg(t.img, 240)" alt="" width="240" height="240" loading="lazy" />
          <span class="rsh-cat__name">{{ t.label }}</span>
          <span class="rsh-cat__count">{{ t.count }} в наличии</span>
        </NuxtLink>
      </div>
    </section>

    <section class="rs-wrap rs-section">
      <div class="rs-head">
        <div>
          <h2>Сейчас берут</h2>
          <p>Стейки и филе собственной разделки, рыба целиком и наши салаты.</p>
        </div>
      </div>
      <div class="rsh-shelf">
        <RsProductCard v-for="p in shelf" :key="p.id" :product="p" />
      </div>
    </section>

    <section class="rs-wrap rs-section">
      <div class="rsh-two">
        <div class="rsh-two__text">
          <h2>Один сайт для покупателя и для закупщика</h2>
          <p>
            Розничный покупатель смотрит цену за 100 граммов и кладёт товар в корзину. Закупщику
            ресторана или школы нужен прайс за килограмм, документы и расчёт доставки. Переключатель
            «Розница / Опт» в шапке меняет каталог, корзину и разделы в шапке под нужного покупателя.
          </p>
          <div class="rs-mode" role="group" aria-label="Показать как">
            <button type="button" :class="{ 'is-on': demo === 'retail' }" :aria-pressed="demo === 'retail'" @click="demo = 'retail'">Розница</button>
            <button type="button" :class="{ 'is-on': demo === 'opt' }" :aria-pressed="demo === 'opt'" @click="demo = 'opt'">Опт</button>
          </div>
        </div>

        <div class="rsh-two__demo" aria-live="polite">
          <div v-if="demo === 'retail'" class="rsh-demo">
            <img :src="rsImg(demoRetail.img, 320)" alt="" width="320" height="320" />
            <div class="rsh-demo__body">
              <span class="rsh-demo__name">{{ rsTitle(demoRetail) }}</span>
              <span class="rsh-demo__price"><b>{{ rsRub(demoRetail.price) }}</b> <span class="rs-card__per">за 100 г</span></span>
              <span class="rs-muted">{{ rsRub(rsPerKg(demoRetail)) }} за кг · кладём в корзину от 0,5 кг</span>
              <NuxtLink :to="rsPath(`/product/${demoRetail.id}`)" class="rs-btn">Смотреть в магазине</NuxtLink>
            </div>
          </div>
          <div v-else class="rsh-demo rsh-demo--opt">
            <div class="rsh-demo__row">
              <span>{{ demoOpt.name }}</span>
              <b>{{ rsRub(demoOpt.price) }} <small>за 1 кг</small></b>
            </div>
            <ul class="rsh-demo__list">
              <li>глазурь 5 %, вакуумная упаковка</li>
              <li>декларация ЕАС на замороженную рыбу</li>
              <li>доставка в Кемеровскую, Новосибирскую, Томскую области и Алтайский край</li>
            </ul>
            <NuxtLink :to="rsPath('/opt') + '#fillet'" class="rs-btn">Добавить в оптовую заявку</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="rs-wrap rs-section rsh-prod">
      <img
        class="rsh-prod__img"
        :src="rsImg('33e6beebf2884494b9ce55f5d7273080~mv2.jpg', 900, 720)"
        alt="Филе и стейки собственной разделки"
        width="900"
        height="720"
        loading="lazy"
      />
      <div class="rsh-prod__text">
        <h2>Свои цеха — свои стейки, копчение и салаты</h2>
        <p class="rs-muted">
          Работаем с крупнейшими поставщиками Камчатки, Сахалина, Курил, Приморья и Санкт-Петербурга, а
          дальше всё делаем сами.
        </p>
        <RsWorkshops />
        <div class="rsh-prod__actions">
          <NuxtLink :to="rsPath('/production')" class="rs-btn">Услуги и СТМ</NuxtLink>
          <NuxtLink :to="rsPath('/production') + '#price'" class="rs-btn rs-btn--line">Узнать цены на услуги</NuxtLink>
        </div>
      </div>
    </section>

    <section class="rs-wrap rs-section">
      <div class="rs-head">
        <div>
          <h2>Нам доверяют</h2>
          <p>{{ rsClientTypes.map((t, i) => (i ? t.toLowerCase() : t)).join(', ') }}.</p>
        </div>
      </div>
      <div class="rsh-clients">
        <div v-for="c in rsClients" :key="c.name" class="rsh-client" :title="c.name">
          <img :src="rsImg(c.img, 240, 160, 'fit')" :alt="c.name" width="240" height="160" loading="lazy" />
        </div>
      </div>
    </section>

    <section class="rs-wrap rs-section rsh-trust">
      <div class="rs-panel">
        <h3>Доставка по четырём регионам</h3>
        <p>
          {{ rsRegions.join(', ') }}. Готовы расширять географию — менеджеры рассчитают стоимость
          доставки за 30 минут.
        </p>
        <NuxtLink :to="rsPath('/opt') + '#request'" class="rs-link">Запросить расчёт</NuxtLink>
      </div>
      <div class="rs-panel">
        <h3>Документы на продукцию</h3>
        <p>Строго соблюдаем температурный режим хранения. Декларации соответствия ЕАС — в открытом доступе.</p>
        <NuxtLink :to="rsPath('/contacts') + '#docs'" class="rs-link">Декларации и приложения</NuxtLink>
      </div>
      <div class="rs-panel">
        <h3>Заказ во ВКонтакте</h3>
        <p>Новости, акции и рецепты — в нашем сообществе. Там же можно оформить заказ сообщением.</p>
        <a :href="rsContacts.vk" target="_blank" rel="noopener" class="rs-link">Сообщество ВКонтакте</a>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.rs .rsh {
  // ---------- первый экран ----------
  .rsh-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: 40px;
    align-items: center;
    padding-top: 36px;

    h1 {
      margin-top: 14px;
      font-size: clamp(30px, 3.6vw, 46px);
      line-height: 1.05;
    }
  }

  .rsh-hero__kicker {
    color: var(--rs-blue);
    font-weight: 500;
  }

  .rsh-hero__lead {
    margin-top: 18px;
    max-width: 560px;
    font-size: 17px;
    color: var(--rs-muted);
  }

  .rsh-doors {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 30px;
  }

  .rsh-door {
    display: grid;
    align-content: start;
    gap: 8px;
    padding: 20px;
    border-radius: var(--rs-r-lg);
    background: var(--rs-blue);
    color: #fff;
    text-align: left;
    transition: background-color 0.15s;

    &:hover {
      background: var(--rs-blue-d);
    }

    &__title {
      font-size: 18px;
      font-weight: 700;
    }

    &__text {
      font-size: 14px;
      opacity: 0.88;
    }

    &__go {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 6px;
      font-weight: 600;
    }

    &--opt {
      background: var(--rs-ice);
      color: var(--rs-ink);

      &:hover {
        background: var(--rs-ice-2);
      }

      .rsh-door__go {
        color: var(--rs-blue-d);
      }

      .rsh-door__text {
        color: var(--rs-muted);
        opacity: 1;
      }
    }
  }

  .rsh-collage {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 12px;
    aspect-ratio: 1.2;
    min-width: 0;

    &__item {
      position: relative;
      overflow: hidden;
      border-radius: var(--rs-r-lg);
      background: var(--rs-ice);
      min-height: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        mix-blend-mode: multiply;
        transition: transform 0.3s;
      }

      &:hover img {
        transform: scale(1.04);
      }

      &--1 {
        grid-row: span 2;
      }

      &--4 {
        display: none;
      }
    }

    &__tag {
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: 10px;
      display: grid;
      gap: 2px;
      padding: 10px 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.94);
      font-size: 13px;
      line-height: 1.3;

      b {
        font-size: 15px;
        font-variant-numeric: tabular-nums;
      }

      small {
        font-weight: 500;
        color: var(--rs-muted);
      }
    }
  }

  .rsh-facts {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-top: 32px;

    > div {
      display: grid;
      gap: 2px;
      padding: 18px 20px;
      border-radius: var(--rs-r-lg);
      background: var(--rs-ice);
    }

    b {
      font-size: 24px;
      font-weight: 700;
      color: var(--rs-blue-d);
    }

    span {
      font-size: 14px;
      color: var(--rs-muted);
    }
  }

  // ---------- разделы магазина ----------
  .rsh-cats {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 12px;
  }

  .rsh-cat {
    display: grid;
    gap: 2px;
    padding: 12px 12px 16px;
    border-radius: var(--rs-r-lg);
    background: var(--rs-ice);
    transition: background-color 0.15s;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 1;
      object-fit: cover;
      margin-bottom: 10px;
      border-radius: 12px;
      mix-blend-mode: multiply;
    }

    &:hover {
      background: var(--rs-ice-2);
    }

    &__name {
      font-weight: 600;
      line-height: 1.25;
    }

    &__count {
      font-size: 13px;
      color: var(--rs-muted);
    }
  }

  .rsh-shelf {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 32px 20px;
  }

  // ---------- розница / опт ----------
  .rsh-two {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 40px;
    align-items: center;
    padding: 40px;
    border-radius: 24px;
    background: var(--rs-ice);

    h2 {
      font-size: clamp(24px, 3vw, 34px);
    }

    &__text {
      display: grid;
      justify-items: start;
      gap: 18px;

      p {
        color: var(--rs-muted);
      }

      .rs-mode {
        background: #fff;

        button.is-on {
          background: var(--rs-blue);
          color: #fff;
        }
      }
    }

    &__demo {
      min-width: 0;
    }
  }

  .rsh-demo {
    display: grid;
    grid-template-columns: 150px minmax(0, 1fr);
    gap: 20px;
    align-items: center;
    padding: 20px;
    border-radius: var(--rs-r-lg);
    background: #fff;

    img {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 12px;
    }

    &__body {
      display: grid;
      justify-items: start;
      gap: 6px;
      min-width: 0;
      font-size: 14px;

      .rs-btn {
        margin-top: 8px;
      }
    }

    &__name {
      font-weight: 600;
      font-size: 16px;
    }

    &__price b {
      font-size: 22px;
    }

    &--opt {
      grid-template-columns: minmax(0, 1fr);
      justify-items: start;
    }

    &__row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      width: 100%;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--rs-line);
      font-weight: 600;

      b {
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }

      small {
        font-weight: 500;
        color: var(--rs-muted);
      }
    }

    ul.rsh-demo__list {
      display: grid;
      gap: 6px;
      padding-left: 18px;
      color: var(--rs-muted);
      font-size: 14px;
    }
  }

  // ---------- производство ----------
  .rsh-prod {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 40px;
    align-items: center;

    &__img {
      width: 100%;
      height: auto;
      aspect-ratio: 5 / 4;
      object-fit: cover;
      border-radius: 24px;
    }

    &__text {
      display: grid;
      gap: 16px;

      h2 {
        font-size: clamp(24px, 3vw, 34px);
      }
    }

    &__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 6px;
    }
  }

  // ---------- клиенты ----------
  .rsh-clients {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 12px;
  }

  // Фиксированная высота: у логотипов разные пропорции, плитки в ряду должны быть ровными.
  .rsh-client {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 112px;
    padding: 14px;
    border-radius: var(--rs-r-lg);
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--rs-line);

    img {
      width: 100%;
      height: 100%;
      min-height: 0;
      object-fit: contain;
      filter: grayscale(1);
      opacity: 0.75;
      transition: filter 0.2s, opacity 0.2s;
    }

    &:hover img {
      filter: none;
      opacity: 1;
    }
  }

  .rsh-trust {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;

    .rs-panel {
      display: grid;
      align-content: start;
      justify-items: start;
      gap: 10px;
    }

    h3 {
      font-size: 19px;
    }

    p {
      color: var(--rs-muted);
    }
  }

  @media (max-width: 1100px) {
    .rsh-cats {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .rsh-shelf {
      grid-template-columns: repeat(3, minmax(0, 1fr));

      > :nth-child(n + 7) {
        display: none;
      }
    }

    .rsh-clients {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  // На телефоне фото товаров сразу под заголовком, входы «розница / опт» — под фото.
  @media (max-width: 960px) {
    .rsh-hero {
      grid-template-columns: minmax(0, 1fr);
      gap: 0;
      padding-top: 24px;
    }

    .rsh-hero__text {
      display: contents;
    }

    .rsh-hero__kicker {
      display: none;
    }

    .rsh-hero h1 {
      margin-top: 0;
    }

    .rsh-collage {
      order: 2;
      margin-top: 22px;
    }

    .rsh-doors {
      order: 3;
      margin-top: 12px;
    }

    .rsh-collage {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-template-rows: auto;
      aspect-ratio: auto;

      &__item {
        aspect-ratio: 1;

        &--1 {
          grid-row: auto;
        }

        &--4 {
          display: block;
        }
      }
    }

    .rsh-facts {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .rsh-two,
    .rsh-prod {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }

    .rsh-two {
      padding: 28px;
    }

    .rsh-trust {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 760px) {
    .rsh-shelf {
      display: flex;
      gap: 12px;
      margin-inline: -16px;
      padding: 0 16px 6px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      > * {
        flex: 0 0 min(68vw, 240px);
        scroll-snap-align: start;
      }

      > :nth-child(n + 7) {
        display: flex;
      }
    }
  }

  @media (max-width: 640px) {
    .rsh-hero__lead {
      font-size: 16px;
    }

    .rsh-doors {
      grid-template-columns: minmax(0, 1fr);
    }

    .rsh-collage__tag {
      > span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      left: 6px;
      right: 6px;
      bottom: 6px;
      padding: 8px 10px;
      font-size: 12px;

      b {
        font-size: 14px;
      }

      small {
        display: block;
        font-size: 11px;
      }
    }

    .rsh-facts > div {
      padding: 14px 16px;
    }

    .rsh-facts b {
      font-size: 20px;
    }

    .rsh-cats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .rsh-two {
      padding: 20px;
      margin-inline: 0;
    }

    .rsh-demo {
      grid-template-columns: minmax(0, 1fr);

      img {
        width: 100%;
        height: auto;
        aspect-ratio: 16 / 10;
      }
    }

    .rsh-clients {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
</style>
