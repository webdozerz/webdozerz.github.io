<script lang="ts" setup>
import {
  kzArticles,
  kzArticlesTotal,
  kzContacts,
  kzFeedPlant,
  kzImg,
  kzNumbers,
  kzOrig,
  kzPath,
  kzRecipeOfDay,
  kzRecipesTotal,
  kzSales,
  kzSections,
  kzShops,
  kzVacancies,
  kzWeBuy,
} from '~/utils/kuzbasskay'
import { useKzUi } from '~/composables/useKuzbasskay'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'
import KzMark from '~/components/redesign/kuzbasskay/KzMark.vue'
import KzEggSorter from '~/components/redesign/kuzbasskay/KzEggSorter.vue'

const ui = useKzUi()
</script>

<template>
  <div class="kz-home">
    <!-- Первый экран: девиз оригинала + «Калибровка» -->
    <section class="kz-hero">
      <div class="kz-wrap">
        <div class="kz-hero__head">
          <h1>{{ kzContacts.slogan }}</h1>
          <div class="kz-hero__side">
            <p>Кузбасская птицефабрика с 1966 года: яйцо, мясо несушки и полуфабрикаты из своего мяса, колбасы, комбикорма и премиксы своего завода.</p>
            <div class="kz-hero__btns">
              <NuxtLink :to="kzPath('/produkciya')" class="kz-btn">Вся продукция</NuxtLink>
              <button type="button" class="kz-btn kz-btn--line" @click="ui.call.value = true"><KzIcon name="phone" :size="18" />Отдел продаж</button>
            </div>
          </div>
        </div>
        <KzEggSorter />
      </div>
    </section>

    <!-- Три покупателя — три входа -->
    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap kz-ways">
        <NuxtLink :to="kzPath('/magazin')" class="kz-way">
          <span class="kz-way__ic"><KzIcon name="shop" :size="26" /></span>
          <b>Покупателям</b>
          <p>Магазин «Фирменный» в п. Степной: яйцо всех категорий, мясо несушки, колбасы, копчёности и шашлык.</p>
          <span class="kz-link">О магазине<KzIcon name="arrow" :size="18" /></span>
        </NuxtLink>
        <div class="kz-way kz-way--opt">
          <span class="kz-way__ic"><KzIcon name="truck" :size="26" /></span>
          <b>Оптовым покупателям</b>
          <p>Яйцо, мясо птицы, полуфабрикаты и колбасы для магазинов и общепита — через отдел продаж.</p>
          <div class="kz-way__tels">
            <a v-for="s in kzSales.slice(0, 2)" :key="s.tel" :href="`tel:${s.tel}`"><small>{{ s.label }}</small><b>{{ s.phone }}</b></a>
          </div>
        </div>
        <NuxtLink :to="kzPath('/produkciya/kombikorm')" class="kz-way kz-way--farm">
          <span class="kz-way__ic"><KzMark name="sack" :size="26" /></span>
          <b>Хозяйствам и фермерам</b>
          <p>Комбикорма, БВМК и премиксы своего завода — в мешках и насыпью, есть ж/д пути. Корма по рецепту заказчика.</p>
          <span class="kz-link">Комбикорм и премиксы<KzIcon name="arrow" :size="18" /></span>
        </NuxtLink>
      </div>
    </section>

    <!-- Продукция: их иконки разделов -->
    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap">
        <div class="kz-h2">
          <div>
            <h2>Наша продукция</h2>
            <p>Цен на сайте нет — они зависят от объёма. Позвоните в отдел продаж или напишите, ответим с ценой и условиями.</p>
          </div>
          <NuxtLink :to="kzPath('/produkciya')" class="kz-link">Вся продукция<KzIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <div class="kz-tiles">
          <NuxtLink v-for="s in kzSections" :key="s.id" :to="kzPath(`/produkciya/${s.id}`)" class="kz-tile" :class="{ 'kz-tile--farm': s.forWhom === 'farm' }">
            <span class="kz-tile__img" :class="{ 'is-contain': s.contain }">
              <img :src="kzImg(s.img)" :alt="s.title" width="600" height="400" loading="lazy" />
            </span>
            <span class="kz-tile__body">
              <span class="kz-tile__badge"><KzMark :name="s.icon" :size="22" /></span>
              <span><b>{{ s.title }}</b><small>{{ s.count }}</small></span>
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- О фабрике -->
    <section class="kz-sec">
      <div class="kz-wrap kz-about">
        <div class="kz-about__text">
          <h2>Один из крупнейших производителей яйца и мяса птицы в Кузбассе</h2>
          <p>Птицефабрика работает в посёлке Степной Новокузнецкого района с 1966 года. С 2005 года прошла полное техническое переоснащение: клеточное оборудование Big Dutchman, убойная линия Meyn, яйцесортировка Staalkat.</p>
          <ul class="kz-nums">
            <li v-for="n in kzNumbers" :key="n.n"><b>{{ n.n }}</b><span>{{ n.t }}</span></li>
          </ul>
          <NuxtLink :to="kzPath('/o-fabrike')" class="kz-link">О фабрике, награды и события<KzIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <div class="kz-about__pics">
          <button type="button" class="kz-about__pic kz-about__pic--wide" aria-label="Увеличить: фабрика" @click="ui.open('Кузбасская птицефабрика', [{ img: 'prod-common-1', cap: 'Кузбасская птицефабрика' }])">
            <img :src="kzImg('prod-common-1')" alt="Птицефабрика сверху" width="660" height="180" loading="lazy" />
          </button>
          <button type="button" class="kz-about__pic" aria-label="Увеличить: яйцесортировка" @click="ui.open('Цех переработки яиц', kzShops[2].photos)">
            <img :src="kzImg('prod-eggs-1')" alt="Транспортёр подачи яиц" width="600" height="400" loading="lazy" />
          </button>
          <button type="button" class="kz-about__pic" aria-label="Увеличить: цех промышленного стада" @click="ui.open('Цех промышленного стада птицы', kzShops[0].photos, 3)">
            <img :src="kzImg('prod-herd-4')" alt="Куры Хайсекс Браун" width="600" height="400" loading="lazy" />
          </button>
        </div>
      </div>
    </section>

    <!-- Производство -->
    <section class="kz-sec kz-sec--surface">
      <div class="kz-wrap">
        <div class="kz-h2">
          <h2>Производство</h2>
          <NuxtLink :to="kzPath('/proizvodstvo')" class="kz-link">Все цеха<KzIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <div class="kz-shops">
          <NuxtLink v-for="s in kzShops" :key="s.id" :to="kzPath('/proizvodstvo') + '#' + s.id" class="kz-shopcard">
            <span class="kz-shopcard__img"><img :src="kzImg(s.photos[s.id === 'stado' ? 2 : 0].img)" :alt="s.title" width="600" height="400" loading="lazy" /></span>
            <b>{{ s.title }}</b>
            <span class="kz-shopcard__facts">{{ (s.facts || []).slice(0, 2).join(' · ') }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Рецепт дня и статьи -->
    <section class="kz-sec">
      <div class="kz-wrap kz-read">
        <article class="kz-recipe">
          <p class="kz-recipe__kicker"><KzIcon name="pot" :size="18" />Рецепт дня</p>
          <h2>{{ kzRecipeOfDay.title }}</h2>
          <div class="kz-recipe__cols">
            <div>
              <h3>Ингредиенты</h3>
              <ul class="kz-recipe__ing">
                <li v-for="i in kzRecipeOfDay.ingredients" :key="i">{{ i }}</li>
              </ul>
            </div>
            <div>
              <h3>Приготовление</h3>
              <ol class="kz-recipe__steps">
                <li v-for="s in kzRecipeOfDay.steps" :key="s">{{ s }}</li>
              </ol>
            </div>
          </div>
          <NuxtLink :to="kzPath('/recepty')" class="kz-link">Все рецепты — {{ kzRecipesTotal }}<KzIcon name="arrow" :size="18" /></NuxtLink>
        </article>
        <div class="kz-articles">
          <div class="kz-h2 kz-h2--small">
            <h2>Статьи</h2>
            <NuxtLink :to="kzPath('/stati')" class="kz-link">Все {{ kzArticlesTotal }}<KzIcon name="arrow" :size="18" /></NuxtLink>
          </div>
          <ul class="kz-articles__list">
            <li v-for="a in kzArticles.slice(0, 4)" :key="a.id">
              <NuxtLink v-if="a.local" :to="kzPath(`/stati/${a.id}`)"><KzIcon name="book" :size="20" /><span>{{ a.title }}</span></NuxtLink>
              <a v-else :href="kzOrig(`/article/?id=${a.id}`)" target="_blank" rel="noopener"><KzIcon name="book" :size="20" /><span>{{ a.title }}</span></a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Вакансии и закупки -->
    <section class="kz-sec kz-sec--tight kz-home__last">
      <div class="kz-wrap kz-duo">
        <div class="kz-panel kz-panel--yellow kz-duo__item">
          <h3>Вакансии</h3>
          <p>Набираем в кадровый резерв: {{ kzVacancies.slice(0, 4).map((v) => v.toLowerCase()).join(', ') }} и другие. Доставка служебным транспортом, столовая, официальное трудоустройство.</p>
          <NuxtLink :to="kzPath('/vakansii')" class="kz-btn kz-btn--sm">Все {{ kzVacancies.length }} профессий</NuxtLink>
        </div>
        <div class="kz-panel kz-duo__item">
          <h3>Закупаем</h3>
          <p>Завод комбикормов покупает {{ kzWeBuy.items.slice(0, 6).join(', ') }} и другое сырьё.</p>
          <div class="kz-duo__row">
            <NuxtLink :to="kzPath('/zakupaem')" class="kz-btn kz-btn--line kz-btn--sm">Что закупаем</NuxtLink>
            <a :href="`tel:${kzFeedPlant.phones[1].tel}`" class="kz-link"><KzIcon name="phone" :size="18" />{{ kzFeedPlant.phones[1].phone }}</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.kz-hero {
  padding-top: 28px;

  &__head {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    align-items: end;
    gap: 16px 48px;
    margin-bottom: 22px;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
    h1 {
      font-size: clamp(36px, 5.2vw, 68px);
      font-weight: 900;
      letter-spacing: -0.02em;
      line-height: 1;
    }
  }
  &__side p {
    max-width: 560px;
    font-size: 17px;
    line-height: 1.5;
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
  }
  @media (max-width: 576px) {
    padding-top: 18px;

    &__head {
      gap: 10px;
      margin-bottom: 16px;
    }
    &__side p {
      font-size: 16px;
    }
    &__btns .kz-btn {
      flex: 1;
    }
  }
}

.kz-ways {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.kz-way {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px;
  border: 1px solid var(--kz-line);
  border-radius: var(--kz-R);
  background: #fff;
  transition: border-color 0.15s;

  &:is(a):hover {
    border-color: var(--kz-accent);
  }
  &__ic {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    margin-bottom: 4px;
    border-radius: 14px;
    background: var(--kz-strip);
    color: var(--kz-ink);
  }
  &--farm &__ic {
    background: var(--kz-green-soft);
    color: var(--kz-green);
  }
  &--farm .kz-link {
    color: var(--kz-green);
  }
  > b {
    color: var(--kz-ink);
    font-size: 20px;
    font-weight: 900;
  }
  p {
    font-size: 15px;
    line-height: 1.5;
  }
  .kz-link {
    margin-top: auto;
  }
  &__tels {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: auto;

    a {
      display: grid;
      min-width: 0;
      padding: 9px 12px;
      border-radius: 14px;
      background: var(--kz-surface);

      @media (max-width: 576px) {
        padding: 9px 10px;
      }
      line-height: 1.2;

      small {
        color: var(--kz-muted);
        font-size: 13px;
        font-weight: 700;
      }
      b {
        color: var(--kz-ink);
        font-size: 16px;
        font-weight: 900;
        white-space: nowrap;

        @media (max-width: 576px) {
          font-size: 15px;
        }
      }
      &:hover {
        background: var(--kz-soft);
      }
    }
    @media (max-width: 375px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

.kz-about {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  align-items: center;
  gap: 48px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
  &__text {
    display: grid;
    gap: 18px;
    justify-items: start;

    h2 {
      font-size: clamp(26px, 3vw, 36px);
      font-weight: 900;
      line-height: 1.12;
    }
  }
  &__pics {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  &__pic {
    position: relative;
    display: block;
    aspect-ratio: 3 / 2;
    overflow: hidden;
    border-radius: 20px;
    background: var(--kz-surface);
    cursor: zoom-in;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    &:hover img {
      transform: scale(1.04);
    }
    &--wide {
      grid-column: 1 / -1;
      aspect-ratio: 660 / 200;
    }
  }
}

.kz-shops {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.kz-shopcard {
  display: grid;
  align-content: start;
  gap: 6px;
  padding: 10px 10px 16px;
  border-radius: var(--kz-R);
  background: #fff;

  &__img {
    position: relative;
    display: block;
    aspect-ratio: 3 / 2;
    margin-bottom: 6px;
    overflow: hidden;
    border-radius: 16px;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
  }
  &:hover &__img img {
    transform: scale(1.05);
  }
  b {
    padding: 0 6px;
    color: var(--kz-ink);
    font-size: 17px;
    font-weight: 800;
    line-height: 1.25;
  }
  &:hover b {
    color: var(--kz-accent-ink);
  }
  &__facts {
    padding: 0 6px;
    color: var(--kz-muted);
    font-size: 14px;
  }
}

ul.kz-articles__list {
  display: grid;
  gap: 4px;

  a {
    display: grid;
    grid-template-columns: 22px minmax(0, 1fr);
    gap: 12px;
    padding: 14px 4px;
    border-bottom: 1px solid var(--kz-line);
    color: var(--kz-ink);
    font-size: 16px;
    font-weight: 700;
    line-height: 1.4;

    .kz-icon {
      margin-top: 1px;
      color: var(--kz-accent-ink);
    }
    &:hover {
      color: var(--kz-accent-ink);
    }
  }
}

.kz-duo {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
  &__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    p {
      font-size: 15px;
    }
  }
  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 20px;
    margin-top: auto;
    align-self: stretch;
  }
}
.kz-home__last {
  padding-bottom: 72px;
}
</style>
