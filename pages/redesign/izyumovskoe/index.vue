<script lang="ts" setup>
import IzIcon from '~/components/redesign/izyumovskoe/IzIcon.vue'
import IzCard from '~/components/redesign/izyumovskoe/IzCard.vue'

useSeoMeta({ title: 'Изюмовское — фермерская птица в Омске | Концепт редизайна' })

const cart = useIzyumCart()
const ui = useIzyumUi()

const duck = izProduct('utka-star-53') as IzProduct
const leaders = ['perepel', 'brojler', 'utka-star-53', 'cyplenok-brojler', 'gus', 'rebryshki', 'okorok', 'grudinka'].map((id) => izProduct(id) as IzProduct)
const young = izProducts.filter((p) => p.section === 'molodnyak')
const sectionFacts = (s: IzSectionId) => {
  const from = izFrom(s)
  const n = izCount(s)
  return `${n} ${izPlural(n, 'товар', 'товара', 'товаров')}${from ? ` · от ${izMoney(from)}` : ' · цена по запросу'}`
}
const wayIcon: Record<string, string> = { courier: 'truck', meet: 'meet', pickup: 'barn' }
const addDuck = () => {
  cart.add(duck)
  ui.toast.value = `${duck.title} — в корзине`
}
</script>

<template>
  <div>
    <section class="iz-wrap iz-hero">
      <div class="iz-hero__panel">
        <h1>С фермы в дом коротким путём</h1>
        <p class="iz-hero__lead">
          Перепела, бройлеров и уток — к столу, утят, гусят и цыплят — на ваше подворье. Растим птицу в Азовском районе Омской области с
          {{ izContacts.since }} года.
        </p>
        <div class="iz-hero__btns">
          <NuxtLink :to="izPath('/catalog/myaso')" class="iz-btn iz-btn--main">Мясо птицы</NuxtLink>
          <NuxtLink :to="izPath('/catalog/molodnyak')" class="iz-btn iz-btn--line">Молодняк от 10 голов</NuxtLink>
        </div>
        <ul class="iz-hero__facts">
          <li><IzIcon name="leaf" /><span>Птица на свободе: комбикорм, свежая трава, овощи и злаки</span></li>
          <li><IzIcon name="shield" /><span>Постоянное ветобслуживание</span></li>
          <li><IzIcon name="truck" /><span>По Омску — 350 ₽, при встрече — бесплатно</span></li>
        </ul>
      </div>
      <div class="iz-hero__photo">
        <img :src="izImg('hero-dvor.jpg')" alt="Утка с утятами на ферме" width="1600" height="1000" />
        <div class="iz-hero__plate">
          <span class="iz-hero__plate-text">
            <small>Суточный молодняк</small>
            <b>Утята «Стар-53»</b>
            <span>{{ izMoney(duck.price as number) }} за голову · от 10 голов</span>
          </span>
          <button v-if="!cart.qtyOf(duck.id)" type="button" class="iz-btn iz-btn--main" @click="addDuck">10 гол.</button>
          <NuxtLink v-else :to="izPath('/cart')" class="iz-btn iz-btn--soft">В корзине · {{ cart.qtyOf(duck.id) }}</NuxtLink>
        </div>
      </div>
    </section>

    <section class="iz-wrap iz-tiles" aria-label="Разделы">
      <NuxtLink v-for="s in izSections" :key="s.id" :to="izPath(`/catalog/${s.id}`)" class="iz-tile">
        <span class="iz-tile__photo"><img :src="izImg(s.tile)" :alt="s.title" width="640" height="420" loading="lazy" /></span>
        <span class="iz-tile__body">
          <img :src="izImg(s.icon)" alt="" width="52" height="52" class="iz-tile__icon" />
          <span>
            <b>{{ s.title }}</b>
            <small>{{ s.motto }} · {{ sectionFacts(s.id) }}</small>
          </span>
          <IzIcon name="arrow" class="iz-tile__arrow" />
        </span>
      </NuxtLink>
    </section>

    <section class="iz-wrap iz-sec">
      <div class="iz-head">
        <div>
          <h2>Лидеры продаж</h2>
          <p>Мясо продаём за килограмм, а берут тушками — рядом с ценой видно, сколько выйдет за одну.</p>
        </div>
        <NuxtLink :to="izPath('/catalog')" class="iz-head__more">Весь каталог<IzIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="iz-grid">
        <IzCard v-for="p in leaders" :key="p.id" :p="p" />
      </div>
    </section>

    <section class="iz-wrap iz-sec">
      <div class="iz-young">
        <div class="iz-young__text">
          <h2>Молодняк на подворье</h2>
          <p>Суточных цыплят, утят и гусят продаём от 10 голов. Молодняк не возим — забирайте на ферме в д. Гауф, оплата на месте.</p>
          <p>К каждой породе — памятка от фермы: температура в первые дни, свет, подстилка, сколько птиц на квадратный метр.</p>
          <NuxtLink :to="izPath('/catalog/molodnyak')" class="iz-btn iz-btn--main">Весь молодняк · {{ young.length }}</NuxtLink>
        </div>
        <ul class="iz-young__list">
          <li v-for="p in young" :key="p.id" :class="{ 'is-out': !p.stock }">
            <NuxtLink :to="izPath(`/product/${p.id}`)">
              <img :src="p.img" alt="" width="64" height="48" loading="lazy" />
              <span class="iz-young__name">
                <b>{{ p.title }}</b>
                <small>{{ p.stock ? (p.adult ? `взрослая ${p.adult}` : 'в наличии') : 'нет в наличии' }}</small>
              </span>
              <span class="iz-young__price">
                <template v-if="p.price !== null">{{ izMoney(p.price) }}<small>/гол.</small></template>
                <small v-else>по запросу</small>
              </span>
              <span v-if="p.isNew" class="iz-tag iz-tag--new">Новинка</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <section class="iz-wrap iz-sec">
      <div class="iz-head">
        <div>
          <h2>Как получить заказ</h2>
          <p>Доставка распространяется только на мясо птицы. Молодняк — самовывоз с фермы.</p>
        </div>
        <NuxtLink :to="izPath('/dostavka')" class="iz-head__more">Доставка и оплата<IzIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="iz-ways">
        <article v-for="w in izWays" :key="w.id" class="iz-way">
          <span class="iz-way__icon"><IzIcon :name="wayIcon[w.id]" :size="26" /></span>
          <h3>{{ w.title }}</h3>
          <b :class="{ 'is-free': w.price === 'бесплатно' }">{{ w.price }}</b>
          <p>{{ w.text }}</p>
        </article>
      </div>
    </section>

    <section class="iz-wrap iz-sec">
      <div class="iz-farm">
        <div class="iz-farm__text">
          <h2>Выращиваем для вас с любовью</h2>
          <p>
            Ферма стоит вдали от заводов и жилых массивов, в экологически чистой зоне Азовского района. Птица гуляет на свободе, ест комбикорм, свежую
            траву, овощи и злаки, ветеринар наблюдает её постоянно.
          </p>
          <ul class="iz-farm__list">
            <li><IzIcon name="gift" /><span>Акции и подарки постоянным клиентам</span></li>
            <li><IzIcon name="cash" /><span>Наличные, карта онлайн или безналичный расчёт</span></li>
            <li><IzIcon name="shield" /><span>Гарантия качества на всю продукцию</span></li>
            <li><IzIcon name="meet" /><span>Бесплатно при встрече в согласованном месте</span></li>
          </ul>
          <NuxtLink :to="izPath('/o-ferme')" class="iz-btn iz-btn--line">О ферме</NuxtLink>
        </div>
        <div class="iz-farm__photo">
          <img :src="izImg('kuritsa.jpg')" alt="Курица с цыплёнком" width="600" height="276" loading="lazy" />
          <div class="iz-farm__stamp">
            <b>с {{ izContacts.since }}</b>
            <span>на рынке</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.iz-hero {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 22px;
  padding-top: 24px;

  &__panel {
    display: flex;
    flex-direction: column;
    padding: 44px 40px;
    border-radius: var(--iz-R);
    background: var(--iz-surface);

    h1 {
      font-size: clamp(36px, 4.4vw, 62px);
      line-height: 1.02;
    }
  }
  &__lead {
    margin-top: 18px;
    font-size: 17px;
    max-width: 520px;
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 26px;
  }
  ul.iz-hero__facts {
    display: grid;
    gap: 12px;
    margin-top: auto;
    padding-top: 32px;

    li {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .iz-icon {
      flex: none;
      color: var(--iz-ink-accent);
    }
  }
  &__photo {
    position: relative;
    min-height: 520px;
    border-radius: var(--iz-R);
    overflow: hidden;

    > img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 70% 60%;
    }
  }
  &__plate {
    position: absolute;
    left: 18px;
    bottom: 18px;
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 14px 14px 14px 18px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 10px 30px rgba(31, 29, 24, 0.18);
  }
  &__plate-text {
    display: grid;
    line-height: 1.3;

    small {
      color: var(--iz-muted);
      font-size: 12.5px;
    }
    b {
      font-family: var(--iz-head);
      font-size: 19px;
      color: var(--iz-dark);
    }
    span {
      font-size: 14px;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

    &__panel {
      padding: 32px 28px;
    }
    &__photo {
      min-height: 460px;
    }
  }
  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    padding-top: 14px;

    &__photo {
      order: -1;
      min-height: 0;
      aspect-ratio: 4 / 3;
    }
    &__panel {
      padding: 26px 20px;
    }
    ul.iz-hero__facts {
      padding-top: 24px;
    }
  }
  @media (max-width: 576px) {
    &__photo {
      aspect-ratio: auto;
      display: flex;
      flex-direction: column;
      overflow: visible;

      > img {
        position: static;
        aspect-ratio: 16 / 11;
        border-radius: var(--iz-R);
      }
    }
    &__plate {
      position: static;
      margin-top: -36px;
      margin-left: 10px;
      margin-right: 10px;
      justify-content: space-between;
    }
    &__btns .iz-btn {
      flex: 1 1 auto;
    }
  }
  @media (max-width: 375px) {
    &__plate {
      gap: 10px;
      padding: 12px;
    }
    &__plate-text b {
      font-size: 17px;
    }
    &__plate .iz-btn {
      padding: 0 12px;
    }
  }
}

.iz-tiles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  margin-top: 22px;

  @media (max-width: 989px) {
    gap: 12px;
  }
  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.iz-tile {
  display: grid;
  border-radius: var(--iz-R);
  border: 1px solid var(--iz-line);
  overflow: hidden;
  background: #fff;

  &__photo {
    display: block;
    aspect-ratio: 16 / 9;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
  }
  &:hover &__photo img {
    transform: scale(1.04);
  }
  &__body {
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr) auto;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;

    b {
      display: block;
      font-family: var(--iz-head);
      font-size: 20px;
      line-height: 1.15;
      color: var(--iz-dark);
    }
    small {
      color: var(--iz-muted);
      font-size: 13.5px;
    }
  }
  &__icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--iz-surface);
    object-fit: contain;
    padding: 5px;
    mix-blend-mode: multiply;
  }
  &__arrow {
    color: var(--iz-ink-accent);
    transition: transform 0.15s;
  }
  &:hover &__arrow {
    transform: translateX(3px);
  }

  @media (max-width: 989px) and (min-width: 769px) {
    &__body {
      grid-template-columns: 40px minmax(0, 1fr);
      gap: 10px;
      padding: 12px;
    }
    &__icon {
      width: 40px;
      height: 40px;
    }
    &__arrow {
      display: none;
    }
    &__body b {
      font-size: 17px;
    }
  }
  @media (max-width: 768px) {
    grid-template-columns: 150px minmax(0, 1fr);

    &__photo {
      aspect-ratio: auto;
      height: 100%;
    }
    &__body {
      grid-template-columns: minmax(0, 1fr) auto;
    }
    &__icon {
      display: none;
    }
  }
  @media (max-width: 375px) {
    grid-template-columns: 104px minmax(0, 1fr);

    &__body {
      padding: 12px;
      gap: 8px;
    }
    &__body b {
      font-size: 17px;
    }
  }
}

.iz-young {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
  gap: 22px;
  padding: 36px;
  border-radius: var(--iz-R);
  background: var(--iz-soft);

  &__text {
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-items: flex-start;

    h2 {
      font-size: clamp(26px, 3vw, 36px);
    }
    .iz-btn {
      margin-top: 8px;
    }
  }
  ul.iz-young__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;

    a {
      display: grid;
      grid-template-columns: 64px minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      height: 100%;
      padding: 8px 12px 8px 8px;
      border-radius: 14px;
      background: #fff;
      position: relative;

      &:hover b {
        color: var(--iz-ink-accent);
      }
    }
    img {
      width: 64px;
      height: 48px;
      object-fit: cover;
      border-radius: 10px;
    }
    .is-out img {
      filter: saturate(0.5);
      opacity: 0.8;
    }
    .iz-tag {
      position: absolute;
      top: -8px;
      right: 8px;
      height: 22px;
      font-size: 11.5px;
    }
  }
  &__name {
    display: grid;
    min-width: 0;
    line-height: 1.3;

    b {
      font-weight: 500;
      color: var(--iz-dark);
    }
    small {
      color: var(--iz-muted);
      font-size: 12.5px;
    }
  }
  &__price {
    font-weight: 700;
    color: var(--iz-dark);
    white-space: nowrap;

    small {
      font-weight: 400;
      color: var(--iz-muted);
      font-size: 13px;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 28px;
  }
  @media (max-width: 768px) {
    padding: 22px 16px;

    ul.iz-young__list {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 375px) {
    ul.iz-young__list a {
      grid-template-columns: 52px minmax(0, 1fr);
    }
    ul.iz-young__list img {
      width: 52px;
      height: 40px;
    }
    &__price {
      grid-column: 2;
    }
  }
}


.iz-farm {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 22px;
  align-items: stretch;

  &__text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
    padding: 36px 36px 36px 0;

    h2 {
      font-size: clamp(26px, 3vw, 36px);
    }
  }
  ul.iz-farm__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 22px;

    li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    .iz-icon {
      flex: none;
      color: var(--iz-ink-accent);
    }
  }
  &__photo {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 340px;
    border-radius: var(--iz-R);
    border: 1px solid var(--iz-line);
    background: #fff;
    overflow: hidden;

    img {
      width: 86%;
      height: auto;
    }
  }
  &__stamp {
    position: absolute;
    left: 22px;
    top: 22px;
    display: grid;
    place-items: center;
    width: 112px;
    height: 112px;
    border-radius: 50%;
    background: var(--iz-accent);
    color: var(--iz-dark);
    transform: rotate(-8deg);
    line-height: 1;
    text-align: center;

    b {
      font-family: var(--iz-head);
      font-size: 28px;
    }
    span {
      margin-top: -18px;
      font-size: 14px;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__text {
      padding: 0;
    }
    &__photo {
      order: -1;
      min-height: 260px;
    }
  }
  @media (max-width: 576px) {
    ul.iz-farm__list {
      grid-template-columns: minmax(0, 1fr);
    }
    &__photo {
      min-height: 220px;
    }
    &__stamp {
      width: 88px;
      height: 88px;
      left: 14px;
      top: 14px;

      b {
        font-size: 22px;
      }
      span {
        margin-top: -12px;
        font-size: 12px;
      }
    }
  }
}
</style>
