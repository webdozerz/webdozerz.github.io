<script lang="ts" setup>
import SbIcon from '~/components/redesign/sibirtreid/SbIcon.vue'

const groups = [
  { sec: 'confectionery', title: 'Кондитерские изделия', text: 'Традиционные угощения и необычные десерты для самых взыскательных покупателей.' },
  { sec: 'coffee-tea', title: 'Кофе и чай', text: 'От классики до премиальных сортов — для магазинов и заведений.' },
  { sec: 'drinks', title: 'Напитки и снеки', text: 'Безалкогольные и слабоалкогольные напитки, закуски к ним.' },
  { sec: 'grocery', title: 'Продукты для кухни', text: 'Бакалея, масло, консервы и другие товары первой необходимости.' },
  { sec: 'non-food-products', title: 'Хозяйственные товары', text: 'Непродовольственный ассортимент, чтобы закрыть закупку целиком.' },
  { sec: 'goods-for-pets', title: 'Товары для животных', text: 'Корма и лакомства для кошек и собак оптом.' },
] as const

useSeoMeta({ title: 'О компании — СибирьТрейд | Концепт редизайна' })
</script>

<template>
  <div class="sb-wrap sb-about">
    <nav class="sb-crumbs" aria-label="Навигация">
      <NuxtLink :to="sbPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>О компании</span>
    </nav>

    <div class="sb-about__hero">
      <div>
        <h1 class="sb-page-title">Надёжный партнёр в крупных оптовых поставках</h1>
        <p>
          ООО «СибирьТрейд» поставляет продукты питания и слабоалкогольные напитки от Урала до Сахалина:
          всё необходимое для магазинов, кафе и ресторанов. Работаем только с сертифицированными
          поставщиками и сопровождаем поставку целиком — упаковка и погрузка уже включены в доставку.
        </p>
        <div class="sb-about__facts">
          <div><strong>с 2012</strong><span>года на рынке</span></div>
          <div><strong>10 000+</strong><span>наименований на складе</span></div>
          <div><strong>10</strong><span>городов с офисами и колл-центрами</span></div>
        </div>
      </div>
      <img :src="sbImg('choco-pie.png')" alt="" />
    </div>

    <section class="sb-section">
      <div class="sb-head"><h2>Что поставляем</h2></div>
      <div class="sb-about__groups">
        <NuxtLink v-for="g in groups" :key="g.sec" :to="sbCatalogPath(g.sec)" class="sb-about__group" :class="`sb-tone--${sbSection(g.sec)?.tone}`">
          <img :src="sbSection(g.sec)?.img" alt="" loading="lazy" />
          <h3>{{ g.title }}</h3>
          <p>{{ g.text }}</p>
        </NuxtLink>
      </div>
    </section>

    <section class="sb-section sb-about__why">
      <h2>Почему с нами удобно</h2>
      <ul>
        <li><SbIcon name="check" :size="20" /><span><strong>Конкурентные цены.</strong> Прямые контракты с Lotte, Coca-Cola, PepsiCo, КДВ, «Приправыч», «Сады Придонья».</span></li>
        <li><SbIcon name="check" :size="20" /><span><strong>Гарантированное качество.</strong> Сертифицированные поставщики, полный пакет документов.</span></li>
        <li><SbIcon name="check" :size="20" /><span><strong>Гибкий подход.</strong> Помогаем выбрать ассортимент под ваш бизнес и регион.</span></li>
        <li><SbIcon name="check" :size="20" /><span><strong>Свои оборотные средства.</strong> Финансово стабильный поставщик, работаем по договору и через ЭДО.</span></li>
      </ul>
      <div class="sb-about__links">
        <NuxtLink :to="sbCatalogPath()" class="sb-btn sb-btn--lg">Перейти в каталог</NuxtLink>
        <NuxtLink :to="sbPath('/suppliers')" class="sb-btn sb-btn--lg sb-btn--line">Стать поставщиком</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.sb .sb-about {
  &__hero {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
    gap: 32px;
    align-items: center;
    padding: clamp(28px, 5vw, 56px);
    border-radius: 36px;
    background: var(--sb-mint);

    p {
      margin-top: 16px;
      max-width: 640px;
      font-size: 17px;
      color: var(--sb-muted);
    }

    img {
      width: 100%;
      max-height: 320px;
      object-fit: contain;
      transform: rotate(-6deg);
    }
  }

  &__facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 28px;

    div {
      display: flex;
      flex-direction: column;
      padding: 16px 18px;
      border-radius: 20px;
      background: #fff;
    }

    strong {
      font-family: var(--sb-display);
      font-size: 28px;
      font-weight: 800;
      color: var(--sb-green-d);
    }

    span {
      font-size: 13.5px;
      color: var(--sb-muted);
    }
  }

  &__groups {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  &__group {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 220px;
    padding: 24px 24px 110px;
    border-radius: 28px;
    background: var(--tone-bg);
    overflow: hidden;

    img {
      position: absolute;
      right: 12px;
      bottom: 8px;
      width: 150px;
      height: 100px;
      object-fit: contain;
    }

    h3 {
      font-size: 22px;
    }

    p {
      color: var(--sb-muted);
      max-width: 320px;
    }
  }

  &__why {
    padding: clamp(28px, 5vw, 56px);
    border-radius: 32px;
    background: var(--sb-peach);

    h2 {
      font-size: clamp(28px, 3.6vw, 42px);
    }

    ul {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px 32px;
      margin-top: 24px;
    }

    li {
      display: flex;
      gap: 12px;

      .sb-icon {
        color: var(--sb-orange-d);
        margin-top: 2px;
      }
    }
  }

  &__links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 28px;
  }

  @media (max-width: 900px) {
    &__hero {
      grid-template-columns: minmax(0, 1fr);

      img {
        max-height: 200px;
      }
    }

    &__groups {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &__why ul {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 600px) {
    &__facts,
    &__groups {
      grid-template-columns: minmax(0, 1fr);
    }

    &__links .sb-btn {
      width: 100%;
    }
  }
}
</style>
