<script lang="ts" setup>
import FaIcon from '~/components/redesign/fermaaltaya/FaIcon.vue'
import FaMask from '~/components/redesign/fermaaltaya/FaMask.vue'

useSeoMeta({ title: 'О ферме — Ферма Алтая | Концепт редизайна' })

const what = [
  { sec: 'moloko', title: 'Молочное с нашего молока', text: 'Молоко, сметана, творог, сливки, снежок, кефир, масло и йогурты — с нашего производства.' },
  { sec: 'svinina', title: 'Свежее мясо', text: 'Свинина, говядина, баранина, курица и яйцо. Фарш, шашлык, купаты, антрекоты.' },
  { sec: 'polufabrikaty', title: 'Своя кухня', text: 'Пельмени, вареники, блины, котлеты, супы шоковой заморозки, плов, холодец.' },
]
</script>

<template>
  <div class="fa-wrap fa-info fa-about">
    <nav class="fa-crumbs" aria-label="Навигация">
      <NuxtLink :to="faPath()">Главная</NuxtLink>
      <span>О ферме</span>
    </nav>

    <section class="fa-about__hero">
      <div class="fa-about__text">
        <h1>Ферма Алтая</h1>
        <p class="fa-about__lead">
          Своя ферма в селе Рассказиха Первомайского района Алтайского края. Готовим продукт под вашу заявку и не храним на складе — заказ собираем в ночь перед
          доставкой и везём своими курьерами в Новосибирск и Барнаул.
        </p>
        <p>Никакой химии, только натуральные продукты. Экскурсий на ферму не проводим — иногда приезжают организованные группы школьников.</p>
      </div>
      <img :src="faLocal('cows.jpg')" alt="Коровы фермы на пастбище" width="1080" height="517" />
    </section>

    <section class="fa-section">
      <div class="fa-about__what">
        <article v-for="w in what" :key="w.sec" class="fa-panel">
          <FaMask :sec="w.sec" :size="40" />
          <h3>{{ w.title }}</h3>
          <p>{{ w.text }}</p>
          <NuxtLink :to="faPath(`/catalog/${w.sec}`)" class="fa-head__more">В каталог<FaIcon name="arrow" :size="18" /></NuxtLink>
        </article>
      </div>
    </section>

    <section id="recepty" class="fa-section">
      <div class="fa-about__docs">
        <div>
          <h2>Рецепты от фермы</h2>
          <p>Два сборника рецептов в PDF — что приготовить из наших продуктов.</p>
        </div>
        <a :href="`${FA_ORIGIN}/retsepty-ot-fermy`" target="_blank" rel="noopener" class="fa-btn fa-btn--line"><FaIcon name="doc" :size="18" />Открыть рецепты</a>
      </div>
    </section>

    <section id="deklaratsii" class="fa-section">
      <div class="fa-about__docs">
        <div>
          <h2>Декларации о соответствии</h2>
          <p>Декларации ЕАС на молочную продукцию, мясо и полуфабрикаты.</p>
        </div>
        <a :href="`${FA_ORIGIN}/deklaratsii`" target="_blank" rel="noopener" class="fa-btn fa-btn--line"><FaIcon name="doc" :size="18" />Смотреть декларации</a>
      </div>
    </section>

    <section id="vakansii" class="fa-section">
      <div class="fa-about__docs">
        <div>
          <h2>Вакансии</h2>
          <p>Ищем людей на ферму, производство и доставку. Список вакансий и контакт отдела кадров — на странице вакансий.</p>
        </div>
        <a :href="`${FA_ORIGIN}/vakansii`" target="_blank" rel="noopener" class="fa-btn fa-btn--line"><FaIcon name="user" :size="18" />Вакансии</a>
      </div>
    </section>

    <section class="fa-section">
      <div class="fa-panel fa-about__req">
        <b>Реквизиты</b>
        <p>
          ООО «КФХ «Яромакс» · ИНН 2263028539 · КПП 226301001 · ОГРН 1162225100212<br />
          Алтайский край, Первомайский р-н, Рассказихинский сельсовет, с. Рассказиха, тер. Яромакс, зд. 1
        </p>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.fa-about {
  &__hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 32px;
    align-items: center;
    padding-top: 18px;

    img {
      width: 100%;
      border-radius: 22px;
      aspect-ratio: 4 / 3;
      object-fit: cover;
    }
  }
  &__text {
    display: grid;
    gap: 16px;
  }
  &__lead {
    color: var(--fa-dark);
    font-size: 20px;
    line-height: 1.45;
  }
  &__what {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;

    .fa-panel {
      display: grid;
      align-content: start;
      justify-items: start;
      gap: 10px;
    }
    .fa-mask {
      color: var(--fa-dark);
    }
  }
  &__docs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--fa-line);

    p {
      margin-top: 6px;
      color: var(--fa-muted);
    }
    .fa-btn {
      flex: none;
    }
  }
  &__req {
    display: grid;
    gap: 6px;

    b {
      color: var(--fa-dark);
    }
    p {
      color: var(--fa-muted);
      font-size: 15px;
    }
  }
  @media (max-width: 989px) {
    &__hero {
      grid-template-columns: minmax(0, 1fr);

      img {
        order: -1;
        aspect-ratio: 16 / 9;
      }
    }
    &__what {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 576px) {
    &__docs {
      flex-direction: column;
      align-items: stretch;
    }
    &__lead {
      font-size: 18px;
    }
  }
}
</style>
