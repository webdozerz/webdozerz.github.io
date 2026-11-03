<script lang="ts" setup>
import IzIcon from '~/components/redesign/izyumovskoe/IzIcon.vue'

useSeoMeta({ title: 'Доставка и оплата — Изюмовское | Концепт редизайна' })

const wayIcon: Record<string, string> = { courier: 'truck', meet: 'meet', pickup: 'barn' }
const payIcon: Record<string, string> = { cash: 'cash', card: 'card', invoice: 'doc' }
const map = 'https://yandex.ru/map-widget/v1/?um=constructor%3A3d9541523b562f0edc51525a0dffcd285316cafda963689b088da3a2c6219d4d&source=constructor'
</script>

<template>
  <div class="iz-wrap">
    <nav class="iz-crumbs" aria-label="Путь">
      <NuxtLink :to="izPath()">Главная</NuxtLink>
      <span>Доставка и оплата</span>
    </nav>
    <h1 class="iz-page-title">Доставка и оплата</h1>

    <section class="iz-sec iz-sec--first">
      <div class="iz-head">
        <div>
          <h2>Доставка</h2>
          <p>Доставка распространяется только на мясо птицы. Суточный молодняк забирают на ферме.</p>
        </div>
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

    <section class="iz-sec">
      <div class="iz-pickup">
        <div class="iz-pickup__text">
          <h2>Самовывоз с фермы</h2>
          <p>{{ izContacts.address }}</p>
          <ul class="iz-pickup__list">
            <li><IzIcon name="phone" /><span>Позвоните заранее: {{ izContacts.phones.join(', ') }}</span></li>
            <li><IzIcon name="clock" /><span>Звонки {{ izContacts.hours }}, время {{ izContacts.tz }}</span></li>
            <li><IzIcon name="cash" /><span>На ферме — оплата наличными при получении</span></li>
          </ul>
        </div>
        <div class="iz-map">
          <span class="iz-map__pin"><IzIcon name="pin" :size="28" />д. Гауф, ул. Промзона, стр. 1</span>
          <iframe :src="map" title="Пункт самовывоза на карте" loading="lazy" />
          <a :href="map.replace('map-widget/v1/', 'maps/')" target="_blank" rel="noopener" class="iz-map__link">Открыть в Яндекс Картах</a>
        </div>
      </div>
    </section>

    <section id="oplata" class="iz-sec">
      <div class="iz-head"><h2>Способы оплаты</h2></div>
      <div class="iz-ways">
        <article v-for="p in izPays" :key="p.id" class="iz-way">
          <span class="iz-way__icon"><IzIcon :name="payIcon[p.id]" :size="26" /></span>
          <h3>{{ p.title }}</h3>
          <p>{{ p.text }}</p>
        </article>
      </div>
    </section>

    <section id="oferta" class="iz-sec">
      <div class="iz-oferta">
        <div>
          <h2>Договор-оферта</h2>
          <p>
            Покупка на сайте — договор розничной купли-продажи с {{ izContacts.company }}. Оплата по безналичному расчёту — 100 % предоплата на
            расчётный счёт; если оплата задерживается больше чем на 5 дней, хозяйство вправе отказаться от договора.
          </p>
        </div>
        <a :href="`${izContacts.original}sposoby-oplaty`" target="_blank" rel="noopener" class="iz-btn iz-btn--line"><IzIcon name="doc" :size="19" />Полный текст оферты</a>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.iz-sec.iz-sec--first {
  padding-top: 0;
  margin-top: 28px;
}
.iz-pickup {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  gap: 22px;

  &__text {
    display: grid;
    align-content: start;
    gap: 14px;
    padding: 30px;
    border-radius: var(--iz-R);
    background: var(--iz-surface);

    h2 {
      font-size: clamp(24px, 2.6vw, 32px);
    }
  }
  ul.iz-pickup__list {
    display: grid;
    gap: 12px;

    li {
      display: flex;
      gap: 10px;
    }
    .iz-icon {
      flex: none;
      color: var(--iz-ink-accent);
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__text {
      padding: 22px 18px;
    }
  }
}
.iz-oferta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px 32px;
  padding: 30px;
  border-radius: var(--iz-R);
  border: 1px solid var(--iz-line);

  > div {
    display: grid;
    gap: 10px;
    max-width: 760px;
  }
  h2 {
    font-size: clamp(24px, 2.6vw, 32px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 22px 18px;
  }
}
</style>
