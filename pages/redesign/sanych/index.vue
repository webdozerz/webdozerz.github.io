<script lang="ts" setup>
import SnProductCard from '~/components/redesign/sanych/SnProductCard.vue'
import SnBuy from '~/components/redesign/sanych/SnBuy.vue'

const delivery = ref(snTomorrow())
onMounted(() => (delivery.value = snTomorrow()))

const description =
  'Концепт нового сайта доставка-мяса.рф: каталог фермерского мяса с ценой за кг, выбор разделки, корзина с примерной суммой по весу, доставка и опт.'
useSeoMeta({
  title: 'Мясная лавка «Саныч» — концепт редизайна',
  ogTitle: 'Мясная лавка «Саныч» — концепт редизайна',
  description,
  ogDescription: description,
  ogImage: 'https://andryushov.me/redesign/sanych/og.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const tiles = snCategories.map((c) => {
  const items = snOf(c.id)
  return { ...c, count: items.length, from: Math.min(...items.map((p) => p.price)) }
})

const weekly = snWeekly.map((id) => snFind(id)).filter((p): p is SnProduct => Boolean(p))
const sets = snOf('sets')
const grill = snOf('grill')
const demo = snFind('pork-koreyka-na-kosti')!

const recipes = snRecipes.map((r) => ({ ...r, product: r.meat ? snFind(r.meat) : undefined }))
</script>

<template>
  <div class="snh">
    <!-- Первый экран: девиз лавки и сразу витрина разделов -->
    <section class="sn-wrap snh-hero">
      <div class="snh-hero__text">
        <h1>Свежее мясо к&nbsp;вашему столу</h1>
        <p class="snh-hero__lead">
          Фермерская говядина, свинина, баранина и птица из Новосибирской области. Охлаждённое,
          никогда не замороженное, привозим в термоконтейнерах.
        </p>
        <div class="snh-hero__when">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
          </svg>
          <span>Закажите сегодня — привезём завтра, <b>{{ delivery.day }}</b>. Утром позвоним и согласуем время.</span>
        </div>
        <div class="snh-hero__actions">
          <NuxtLink :to="snPath('/catalog')" class="sn-btn">Выбрать мясо</NuxtLink>
          <a :href="snContacts.whatsapp" target="_blank" rel="noopener" class="sn-btn sn-btn--line">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
              <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z" />
            </svg>
            Заказать в WhatsApp
          </a>
        </div>
        <dl class="snh-hero__facts">
          <div>
            <dt>от {{ snRub(snRules.minOrder) }}</dt>
            <dd>минимальный заказ</dd>
          </div>
          <div>
            <dt>0 ₽</dt>
            <dd>доставка от {{ snRub(snRules.freeFrom) }} или {{ snRules.freeKg }} кг</dd>
          </div>
          <div>
            <dt>5 лет</dt>
            <dd>возим мясо по Новосибирску</dd>
          </div>
        </dl>
      </div>

      <div class="snh-tiles">
        <NuxtLink
          v-for="t in tiles"
          :key="t.id"
          :to="snPath(`/catalog/${t.id}`)"
          class="snh-tile"
          :class="{ 'snh-tile--photo': !t.icon }"
        >
          <span
            v-if="t.icon"
            class="sn-animal snh-tile__icon"
            :style="{ '--sn-icon': `url(${snIcon(t.icon)})` }"
            aria-hidden="true"
          />
          <img v-else :src="snImg(snOf(t.id)[0].img)" alt="" class="snh-tile__img" />
          <span class="snh-tile__name">{{ t.label }}</span>
          <span class="snh-tile__meta">{{ t.count }} поз. · от {{ snRub(t.from) }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Еженедельные предложения оригинала -->
    <section class="sn-wrap snh-section">
      <div class="sn-sechead">
        <div>
          <h2>Берут каждую неделю</h2>
          <p>То, что постоянные покупатели заказывают снова и снова.</p>
        </div>
        <NuxtLink :to="snPath('/catalog')" class="sn-link snh-more">Весь каталог</NuxtLink>
      </div>
      <div class="snh-shelf">
        <SnProductCard v-for="p in weekly" :key="p.id" :product="p" />
      </div>
    </section>

    <!-- Фирменная деталь: разделка и честная сумма по весу -->
    <section class="sn-wrap snh-section">
      <div class="snh-cut">
        <div class="snh-cut__text">
          <h2>Режем, как вам удобно, и&nbsp;честно взвешиваем</h2>
          <ul class="snh-cut__list">
            <li>
              <b>Куском или нарубить.</b>
              Большой кусок — для своей разделки, нарубленное — порционно, без остатка. Если
              нужно на суп или плов, напишите в комментарии.
            </li>
            <li>
              <b>Вес куска известен заранее.</b>
              Корейка на кости — 4–6 кг, вырезка — 0,6–1 кг, тушка барашка — 10–18 кг. Поэтому
              в корзине сразу видна примерная сумма.
            </li>
            <li>
              <b>Точную сумму пришлём SMS.</b>
              Тушу не нарубить на одинаковые куски: перевес бывает на 250–500 г. Когда соберём
              заказ, пришлём итог до приезда курьера.
            </li>
          </ul>
        </div>
        <div class="snh-cut__demo">
          <div class="snh-cut__product">
            <img :src="snImg(demo.img)" :alt="demo.name" width="160" height="120" />
            <div>
              <NuxtLink :to="snPath(`/product/${demo.id}`)" class="snh-cut__name">{{ demo.name }}</NuxtLink>
              <span class="sn-muted">{{ snPieceLabel(demo) }} · {{ snRub(demo.price) }} за кг</span>
            </div>
          </div>
          <SnBuy :product="demo" variant="page" />
        </div>
      </div>
    </section>

    <!-- Мясные наборы -->
    <section class="sn-wrap snh-section">
      <div class="sn-sechead">
        <div>
          <h2>Мясные наборы</h2>
          <p>Набор от 12 кг выходит дешевле, чем те же части по отдельности.</p>
        </div>
      </div>
      <div class="snh-sets">
        <NuxtLink v-for="s in sets" :key="s.id" :to="snPath(`/product/${s.id}`)" class="snh-set">
          <img :src="snImg(s.img)" :alt="s.name" loading="lazy" width="360" height="240" />
          <div class="snh-set__body">
            <h3>{{ s.name }}</h3>
            <p>{{ s.note }}</p>
            <div class="snh-set__price">
              <b>{{ snRub(s.price) }} за кг</b>
              <span>12 кг ≈ {{ snRub(s.price * 12) }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Готовый шашлык -->
    <section class="sn-wrap snh-section">
      <div class="snh-grill">
        <div class="snh-grill__text">
          <h2>Готовый шашлык на&nbsp;углях</h2>
          <p>
            Шашлык и люля-кебаб из баранины, свинины и птицы. Привезём горячим за 25–45 минут,
            доставка бесплатная.
          </p>
          <NuxtLink :to="snPath('/catalog/grill')" class="sn-btn">Выбрать шашлык</NuxtLink>
        </div>
        <div class="snh-grill__photos">
          <NuxtLink
            v-for="g in grill"
            :key="g.id"
            :to="snPath(`/product/${g.id}`)"
            class="snh-grill__item"
          >
            <img :src="snImg(g.img)" :alt="g.name" loading="lazy" width="240" height="180" />
            <span>{{ g.name }}<b>{{ snRub(g.price) }}</b></span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- О хозяйстве -->
    <section class="sn-wrap snh-section snh-farm">
      <div class="snh-farm__photos">
        <img src="/redesign/sanych/img/farm-2.jpg" alt="Куры на ферме" loading="lazy" width="800" height="533" />
        <img src="/redesign/sanych/img/farm-1.jpg" alt="Птичник хозяйства" loading="lazy" width="800" height="533" />
      </div>
      <div class="snh-farm__text">
        <h2>Небольшое хозяйство и&nbsp;фермы знакомых</h2>
        <p>
          Сами разводим птицу и занимаемся органическим земледелием в Новосибирской области —
          небольшими партиями. Остальное везём с хозяйств знакомых и партнёров из
          Новосибирской, Алтайской и Красноярской областей, в чьём качестве уверены.
        </p>
        <p>Мясо без гормонов роста и химии, охлаждённое и ни разу не замороженное.</p>
        <NuxtLink :to="snPath('/about')" class="sn-link">О хозяйстве</NuxtLink>
      </div>
    </section>

    <!-- Доставка и опт -->
    <section class="sn-wrap snh-section snh-info">
      <div class="snh-info__card">
        <h2>Доставка</h2>
        <ul class="snh-info__list">
          <li><b>Завтра</b> — заказы привозим на следующий день, с 9:30 до 21:00</li>
          <li><b>Бесплатно</b> — до подъезда от {{ snRub(snRules.freeFrom) }} или {{ snRules.freeKg }} кг</li>
          <li><b>{{ snRub(snRules.toFlat) }}</b> — подъём до квартиры</li>
          <li><b>За 6 часов</b> — экспресс-доставка в день заказа, за доплату</li>
        </ul>
        <NuxtLink :to="snPath('/delivery')" class="sn-link">Доставка и оплата</NuxtLink>
      </div>
      <div class="snh-info__card snh-info__card--opt">
        <h2>Мясо оптом</h2>
        <p>
          Для ресторанов, кафе и столовых: от 100 кг, цена от объёма, ветеринарные
          справки и полный пакет документов. Своя доставка или самовывоз.
        </p>
        <NuxtLink :to="snPath('/opt')" class="sn-btn sn-btn--soft">Условия для бизнеса</NuxtLink>
      </div>
    </section>

    <!-- Рецепты -->
    <section class="sn-wrap snh-section">
      <div class="sn-sechead">
        <div>
          <h2>Что приготовить</h2>
          <p>Рецепты Саныча и мясо для них.</p>
        </div>
        <NuxtLink :to="snPath('/recipes')" class="sn-link snh-more">Все рецепты</NuxtLink>
      </div>
      <div class="snh-recipes">
        <NuxtLink v-for="r in recipes" :key="r.title" :to="snPath('/recipes')" class="snh-recipe">
          <img :src="snImg(r.img)" :alt="r.title" loading="lazy" width="340" height="255" />
          <span class="snh-recipe__title">{{ r.title }}</span>
          <span v-if="r.product" class="snh-recipe__meat">{{ r.product.name }} · {{ snRub(r.product.price) }} за кг</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.sn .snh-hero {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 20px;
  padding-top: 24px;
}

.sn .snh-hero__text {
  display: flex;
  flex-direction: column;
  padding: 36px 36px 28px;
  border-radius: var(--sn-r-lg);
  background: var(--sn-paper);

  h1 {
    font-size: clamp(32px, 4.2vw, 52px);
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: -0.02em;
  }
}

.sn .snh-hero__lead {
  margin-top: 16px;
  font-size: 17px;
  color: var(--sn-muted);
}

.sn .snh-hero__when {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding: 12px 14px;
  border-radius: var(--sn-r);
  background: #fff;
  color: var(--sn-ink);
  font-size: 14px;

  svg {
    margin-top: 1px;
    color: var(--sn-green);
  }

  b {
    color: var(--sn-green);
  }
}

.sn .snh-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;

  .sn-btn--line svg {
    color: var(--sn-green);
  }
}

.sn .snh-hero__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: auto;
  padding-top: 28px;

  dt {
    font-family: var(--sn-head);
    font-size: 18px;
    font-weight: 600;
    white-space: nowrap;
  }

  dd {
    margin-top: 2px;
    font-size: 13px;
    line-height: 1.35;
    color: var(--sn-muted);
  }
}

.sn .snh-tiles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.sn .snh-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 150px;
  padding: 18px;
  border-radius: var(--sn-r-lg);
  background: var(--sn-paper);
  overflow: hidden;
  transition: background-color 0.15s;

  &:hover {
    background: var(--sn-rose);

    .snh-tile__icon {
      transform: scale(1.06);
    }
  }
}

.sn .snh-tile__icon {
  width: 64px;
  height: 64px;
  margin-bottom: auto;
  transition: transform 0.2s;
}

.sn .snh-tile__name {
  margin-top: 14px;
  font-family: var(--sn-head);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.15;
}

.sn .snh-tile__meta {
  margin-top: 4px;
  font-size: 13px;
  color: var(--sn-muted);
  white-space: nowrap;
}

// Наборы и шашлык — без иконки животного: фото сверху, подпись на той же подложке.
.sn .snh-tile--photo {
  padding: 0;

  .snh-tile__name,
  .snh-tile__meta {
    padding-inline: 18px;
  }

  .snh-tile__meta {
    padding-bottom: 16px;
  }
}

.sn .snh-tile__img {
  flex: 1;
  width: 100%;
  min-height: 0;
  height: 60px;
  object-fit: cover;
  transition: transform 0.3s;
}

.sn .snh-tile--photo:hover .snh-tile__img {
  transform: scale(1.05);
}

.sn .snh-tile--photo .snh-tile__name {
  margin-top: 12px;
}

.sn .snh-section {
  margin-top: 64px;
}

.sn .snh-more {
  white-space: nowrap;
}

.sn .snh-shelf {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

// ---------- разделка ----------
.sn .snh-cut {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 20px;
  padding: 36px;
  border-radius: var(--sn-r-lg);
  background: var(--sn-rose);

  h2 {
    font-size: clamp(22px, 3vw, 30px);
  }
}

.sn .snh-cut__list {
  display: grid;
  gap: 16px;
  margin-top: 22px;
  list-style: none;

  li {
    padding-left: 16px;
    border-left: 2px solid var(--sn-rose-2);
    color: var(--sn-muted);
  }

  b {
    display: block;
    color: var(--sn-ink);
  }
}

.sn .snh-cut__demo {
  align-self: start;
  display: grid;
  gap: 16px;
  padding: 20px;
  border-radius: 18px;
  background: #fff;
}

.sn .snh-cut__product {
  display: flex;
  gap: 14px;
  align-items: center;

  img {
    width: 96px;
    height: 72px;
    border-radius: 12px;
    object-fit: cover;
  }

  > div {
    display: grid;
    gap: 2px;
    min-width: 0;
    font-size: 14px;
  }
}

.sn .snh-cut__name {
  font-weight: 800;
  font-size: 16px;

  &:hover {
    color: var(--sn-red);
  }
}

// ---------- наборы ----------
.sn .snh-sets {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.sn .snh-set {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--sn-r-lg);
  background: var(--sn-paper);
  transition: background-color 0.15s;

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 3 / 2;
    object-fit: cover;
  }

  &:hover {
    background: var(--sn-rose);
  }
}

.sn .snh-set__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  padding: 18px 20px 20px;

  h3 {
    font-size: 18px;
  }

  p {
    color: var(--sn-muted);
    font-size: 14px;
  }
}

.sn .snh-set__price {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 4px 12px;
  margin-top: auto;
  padding-top: 8px;

  b {
    color: var(--sn-red);
    font-size: 18px;
    font-weight: 800;
  }

  span {
    font-size: 13px;
    color: var(--sn-muted);
  }
}

// ---------- шашлык ----------
.sn .snh-grill {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 20px;
  align-items: center;
}

.sn .snh-grill__text {
  display: grid;
  gap: 14px;
  justify-items: start;

  h2 {
    font-size: clamp(22px, 3vw, 30px);
  }

  p {
    color: var(--sn-muted);
  }
}

.sn .snh-grill__photos {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.sn .snh-grill__item {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 16px;

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    transition: transform 0.3s;
  }

  span {
    position: absolute;
    left: 8px;
    right: 8px;
    bottom: 8px;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 10px;
    background: rgb(255 255 255 / 94%);
    font-size: 13px;
    font-weight: 700;
    line-height: 1.3;
  }

  b {
    color: var(--sn-red);
    white-space: nowrap;
  }

  &:hover img {
    transform: scale(1.05);
  }
}

// ---------- хозяйство ----------
.sn .snh-farm {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 32px;
  align-items: center;
}

.sn .snh-farm__photos {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 10px;

  img {
    width: 100%;
    height: 100%;
    min-height: 240px;
    object-fit: cover;
    border-radius: var(--sn-r-lg);
  }
}

.sn .snh-farm__text {
  display: grid;
  gap: 14px;
  justify-items: start;

  h2 {
    font-size: clamp(22px, 3vw, 30px);
  }

  p {
    color: var(--sn-muted);
  }
}

// ---------- доставка и опт ----------
.sn .snh-info {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 14px;
}

.sn .snh-info__card {
  display: grid;
  align-content: start;
  justify-items: start;
  gap: 16px;
  padding: 28px;
  border-radius: var(--sn-r-lg);
  background: var(--sn-paper);

  h2 {
    font-size: 24px;
  }

  p {
    color: var(--sn-muted);
  }

  &--opt {
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--sn-line);
  }
}

.sn .snh-info__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 24px;
  list-style: none;
  color: var(--sn-muted);
  font-size: 14px;

  b {
    display: block;
    color: var(--sn-ink);
    font-size: 16px;
  }
}

// ---------- рецепты ----------
.sn .snh-recipes {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.sn .snh-recipe {
  display: grid;
  gap: 4px;
  align-content: start;

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 16px;
    margin-bottom: 8px;
    transition: opacity 0.2s;
  }

  &:hover img {
    opacity: 0.9;
  }

  &:hover .snh-recipe__title {
    color: var(--sn-red);
  }
}

.sn .snh-recipe__title {
  font-weight: 800;
}

.sn .snh-recipe__meat {
  font-size: 13px;
  color: var(--sn-muted);
}

@media (max-width: 1180px) {
  .sn .snh-shelf {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }

  .sn .snh-shelf > :nth-child(n + 5) {
    display: none;
  }
}

@media (max-width: 1024px) {
  .sn .snh-hero {
    grid-template-columns: 1fr;
  }

  .sn .snh-hero__text {
    padding: 28px;
  }

  .sn .snh-hero__facts {
    margin-top: 0;
  }

  .sn .snh-cut {
    grid-template-columns: 1fr;
    padding: 28px;
  }

  .sn .snh-grill {
    grid-template-columns: 1fr;
  }

  .sn .snh-farm {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 760px) {
  .sn .snh-hero {
    padding-top: 16px;
    gap: 14px;
  }

  .sn .snh-hero__text {
    padding: 22px 18px;
  }

  .sn .snh-hero__lead {
    font-size: 15px;
  }

  .sn .snh-hero__actions .sn-btn {
    flex: 1 1 200px;
  }

  .sn .snh-hero__facts {
    padding-top: 20px;

    dt {
      font-size: 16px;
    }
  }

  .sn .snh-tiles {
    gap: 8px;
  }

  .sn .snh-tile {
    min-height: 118px;
    padding: 12px;
    border-radius: 16px;
  }

  .sn .snh-tile__icon {
    width: 44px;
    height: 44px;
  }

  .sn .snh-tile__name {
    font-size: 14px;
  }

  .sn .snh-tile__meta {
    font-size: 12px;
    white-space: normal;
  }

  .sn .snh-tile--photo {
    padding: 0;

    .snh-tile__img {
      flex: none;
      height: 62px;
    }

    .snh-tile__name,
    .snh-tile__meta {
      padding-inline: 12px;
    }

    .snh-tile__name {
      margin-top: 10px;
      padding-bottom: 12px;
    }

    .snh-tile__meta {
      padding-bottom: 12px;
    }
  }

  .sn .snh-section {
    margin-top: 44px;
  }

  // Полки листаются пальцем.
  .sn .snh-shelf {
    display: flex;
    gap: 10px;
    margin-inline: -16px;
    padding: 2px 16px 6px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 16px;
    scrollbar-width: none;

    > * {
      flex: 0 0 min(250px, 72vw);
      scroll-snap-align: start;
    }

    > :nth-child(n + 5) {
      display: flex;
    }
  }

  .sn .snh-cut {
    padding: 22px 16px;
  }

  .sn .snh-cut__demo {
    padding: 14px;
  }

  .sn .snh-sets {
    grid-template-columns: 1fr;
  }

  .sn .snh-set {
    flex-direction: row;

    img {
      width: 38%;
      aspect-ratio: auto;
      height: auto;
      min-height: 100%;
    }
  }

  .sn .snh-set__body {
    padding: 14px;
  }

  .sn .snh-grill__photos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sn .snh-farm__photos img {
    min-height: 160px;
  }

  .sn .snh-info {
    grid-template-columns: 1fr;
  }

  .sn .snh-info__card {
    padding: 22px 18px;
  }

  .sn .snh-info__list {
    grid-template-columns: 1fr;
  }

  .sn .snh-recipes {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  // На телефоне витрина разделов должна начинаться на первом экране.
  .sn .snh-hero__lead {
    display: none;
  }

  .sn .snh-hero__when {
    margin-top: 14px;
  }

  .sn .snh-hero__actions {
    margin-top: 14px;
  }

  .sn .snh-hero__actions .sn-btn {
    min-height: 46px;
    padding: 0 14px;
  }

  .sn .snh-hero__facts {
    padding-top: 16px;
    gap: 8px;

    > div:last-child {
      display: none;
    }
  }

  .sn .snh-hero__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 420px) {
  .sn .snh-tiles {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .sn .snh-tile__meta {
    display: none;
  }

  .sn .snh-set img {
    width: 34%;
  }
}
</style>
