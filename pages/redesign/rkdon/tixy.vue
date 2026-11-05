<script lang="ts" setup>
import RkIcon from '~/components/redesign/rkdon/RkIcon.vue'
import RkSales from '~/components/redesign/rkdon/RkSales.vue'
import type { RkLine } from '~/utils/rkdon'

useSeoMeta({ title: 'Тиксы — закуска к пиву от Рыбокомбината Донской | Концепт редизайна' })

// «Попробуй каждый цвет»: у оригинала линейки различаются цветом пачки — здесь это фильтр.
const line = ref<'all' | RkLine>('all')
const lines = computed(() => [
  { id: 'all' as const, title: 'Все', color: '#2a1118', n: rkTixy.length },
  ...(Object.keys(rkLines) as RkLine[]).map((id) => ({ id, ...rkLines[id], n: rkTixy.filter((t) => t.line === id).length })),
])
const list = computed(() => rkTixy.filter((t) => line.value === 'all' || t.line === line.value))
const tastesUsed = Object.keys(rkTastes)
</script>

<template>
  <div class="rk-tixy">
    <div class="rk-wrap rk-pagehead">
      <nav class="rk-crumbs">
        <NuxtLink :to="rkPath('/')">Главная</NuxtLink><span>Тиксы</span>
      </nav>
    </div>
    <div class="rk-wrap">
      <section class="rk-tixyhero">
        <div class="rk-tixyhero__text">
          <img :src="rkImg('i/logotiksi.png')" alt="Тиксы" width="220" height="71" />
          <h1>Закуска к пиву. Попробуй каждый цвет наших Тиксов!</h1>
          <p>
            Большой ассортимент снеков, удобная и яркая упаковка, вкусы к любому сорту любимого напитка. Дома, на рыбалке, в гараже и на
            пикнике. Приятная цена, не влияющая на качество.
          </p>
          <a href="#buy" class="rk-btn rk-btn--white"><span class="rk-tixyhero__full">Купить фасованную продукцию</span><span class="rk-tixyhero__short">Купить фасовку оптом</span></a>
        </div>
        <div class="rk-tixyhero__art">
          <img :src="rkImg('i/Squid-0.png')" alt="" width="440" height="398" class="rk-tixyhero__squid" />
          <img :src="rkImg('i/Fish-0.png')" alt="" width="440" height="268" class="rk-tixyhero__fish" />
        </div>
      </section>

      <section class="rk-section rk-section--tight">
        <div class="rk-head">
          <div>
            <h2>Каталог продукции</h2>
            <p>Пачки по 70 г. Цвет пачки — линейка: синий — кальмар, оранжевый — жёлтый полосатик, зелёный — рыбка.</p>
          </div>
          <div class="rk-colors" role="tablist">
            <button
              v-for="l in lines"
              :key="l.id"
              type="button"
              role="tab"
              class="rk-colors__item"
              :class="{ 'is-active': line === l.id }"
              :style="{ '--c': l.color }"
              :aria-selected="line === l.id"
              @click="line = l.id"
            >
              <i v-if="l.id !== 'all'" />{{ l.title }} <small>{{ l.n }}</small>
            </button>
          </div>
        </div>
        <ul class="rk-tastes">
          <li v-for="k in tastesUsed" :key="k">
            <img :src="rkImg(rkTastes[k].icon)" alt="" width="44" height="44" />{{ rkTastes[k].title }}
          </li>
          <li><img :src="rkImg('t/tk-ist_belka.png')" alt="" width="44" height="44" />Источник белка</li>
        </ul>
        <div class="rk-packs">
          <article v-for="t in list" :key="t.img" class="rk-pack" :style="{ '--c': rkLines[t.line].color }">
            <img :src="rkImg(t.img)" :alt="'Тиксы ' + t.name" width="250" height="321" loading="lazy" />
            <b>{{ t.name }}</b>
            <span class="rk-pack__tastes">
              <img v-for="k in t.tastes" :key="k" :src="rkImg(rkTastes[k].icon)" :alt="rkTastes[k].title" :title="rkTastes[k].title" width="36" height="36" />
              <small>70 г</small>
            </span>
          </article>
        </div>
      </section>

      <section class="rk-section rk-section--tight rk-about">
        <div class="rk-about__text">
          <h2>О «Тиксах»</h2>
          <p>
            Польза рыбных закусок не вызывает сомнения. Тиксы производятся на современном оборудовании: рыбу и кальмара солят и затем
            сушат.
          </p>
          <p>
            В 2020 году по итогам исследования предпочтений покупателей мы обновили марку: сменили дизайн и улучшили качество продукта.
          </p>
          <div class="rk-about__cols">
            <div>
              <h3>Сушёный кальмар</h3>
              <p>
                Мы единственные в России, кто производит снеки из кальмара, — остальные привозят их из Азии и фасуют в свои пачки. Четыре
                формы: кольца, стружка, полоски, паутинка, у каждой 2–4 вкуса: соль, копчение, сыр, краб, соус по-шанхайски.
              </p>
            </div>
            <div>
              <h3>Сушёная рыба</h3>
              <p>
                Рыбу вялим, коптим и сушим. Тиксы подчёркивают вкус пива, их не нужно чистить и пачкать руки — поэтому их так любят к
                пенному.
              </p>
            </div>
          </div>
        </div>
        <figure class="rk-quote">
          <img :src="rkImg('i/director.jpg')" alt="Мочалов Ю. В." width="800" height="800" loading="lazy" />
          <blockquote>
            «Мы очень внимательно относимся к тому, что вы едите, и хотим, чтобы продукты были не только вкусными, но и без вреда для
            здоровья. Поэтому мы сократили количество консервантов, изменили температуру хранения, и срок годности стал 6 месяцев вместо
            12».
          </blockquote>
          <figcaption><b>Мочалов Ю. В.</b> генеральный директор</figcaption>
        </figure>
      </section>

      <div id="buy">
        <RkSales
          title="Купить фасованную продукцию"
          text="Тиксы продаются в магазинах. Оптовые партии фасованной продукции для торговых точек и сетей — через отдел продаж."
          subject="Тиксы: фасованная продукция оптом"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.rk-btn--white {
  background: #fff;
  color: #0b5f86;
  &:hover {
    background: #e9f6fb;
  }
}
.rk-tixyhero {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  align-items: center;
  gap: 24px;
  padding: 44px 48px;
  border-radius: var(--rk-R);
  background: #0a92c4;
  color: #fff;
  overflow: hidden;
  &__text {
    display: grid;
    gap: 18px;
    justify-items: start;
    > img {
      width: 200px;
    }
    h1 {
      color: #fff;
      font-size: clamp(30px, 3.6vw, 46px);
    }
    p {
      font-size: 17px;
      max-width: 560px;
      color: #e8f6fc;
    }
  }
  &__art {
    position: relative;
    min-height: 320px;
    img {
      position: absolute;
      transition: transform 0.4s;
    }
  }
  &__squid {
    right: 4%;
    top: 0;
    width: 62%;
    transform: rotate(-8deg);
  }
  &__fish {
    left: 0;
    bottom: 4%;
    width: 64%;
  }
  &:hover &__squid {
    transform: rotate(-3deg);
  }
}
.rk-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  &__item,
  &__item:focus,
  &__item:active {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 44px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1px solid var(--rk-line);
    background: #fff;
    font-weight: 700;
    color: var(--rk-ink);
    white-space: nowrap;
  }
  &__item {
    i {
      width: 14px;
      height: 20px;
      border-radius: 4px;
      background: var(--c);
    }
    small {
      color: var(--rk-muted);
      font-weight: 600;
    }
    &:hover {
      border-color: var(--c);
    }
    &.is-active {
      background: var(--c);
      border-color: var(--c);
      color: #fff;
      i {
        background: #fff;
      }
      small {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}
.rk-packs {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
}
.rk-pack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 16px 16px;
  border-radius: var(--rk-R);
  background: #fff;
  border: 1px solid var(--rk-line);
  border-top: 5px solid var(--c);
  > img {
    width: 78%;
    margin: 0 auto 6px;
    transition: transform 0.3s;
  }
  &:hover > img {
    transform: translateY(-4px) rotate(-2deg);
  }
  b {
    font-size: 15px;
    line-height: 1.3;
    color: var(--rk-ink);
  }
  &__tastes {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: auto;
    img {
      width: 36px;
      height: 36px;
    }
    small {
      margin-left: auto;
      font-weight: 700;
      color: var(--rk-muted);
    }
  }
}
ul.rk-tastes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 24px;
  margin-bottom: 24px;
  padding: 18px 22px;
  border-radius: 18px;
  background: var(--rk-surface);
  li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    color: var(--rk-ink);
  }
  img {
    width: 44px;
    height: 44px;
  }
}
.rk-about {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 48px;
  align-items: start;
  &__text {
    display: grid;
    gap: 14px;
    h2 {
      font-size: clamp(28px, 3.2vw, 40px);
    }
    p {
      font-size: 16px;
    }
  }
  &__cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 12px;
    h3 {
      font-size: 22px;
      margin-bottom: 8px;
    }
  }
}
.rk-quote {
  display: grid;
  gap: 18px;
  padding: 24px;
  border-radius: var(--rk-R);
  background: var(--rk-surface);
  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
  }
  blockquote {
    font-size: 17px;
    line-height: 1.55;
    color: var(--rk-ink);
  }
  figcaption {
    display: grid;
    color: var(--rk-muted);
    b {
      color: var(--rk-ink);
    }
  }
}
@media (max-width: 1400px) {
  .rk-packs {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 1199px) {
  .rk-about {
    grid-template-columns: minmax(0, 1fr);
  }
  .rk-quote {
    grid-template-columns: 120px minmax(0, 1fr);
    align-items: start;
    figcaption {
      grid-column: 2;
    }
  }
}
@media (max-width: 989px) {
  .rk-tixyhero {
    grid-template-columns: minmax(0, 1fr);
    padding: 32px;
    &__art {
      min-height: 240px;
    }
  }
  .rk-packs {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 768px) {
  .rk-tixyhero {
    padding: 24px 20px;
    &__art {
      min-height: 190px;
    }
  }
  .rk-packs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .rk-pack {
    padding: 14px 12px 12px;
    &__tastes img {
      width: 30px;
      height: 30px;
    }
  }
  .rk-colors {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    width: 100%;
  }
  .rk-about__cols {
    grid-template-columns: minmax(0, 1fr);
  }
  .rk-quote {
    grid-template-columns: minmax(0, 1fr);
    figcaption {
      grid-column: auto;
    }
    img {
      width: 96px;
      height: 96px;
    }
  }
}
.rk-tixyhero__short {
  display: none;
}
@media (max-width: 576px) {
  .rk-tixyhero .rk-btn {
    width: 100%;
  }
}
@media (max-width: 375px) {
  .rk-tixyhero__full {
    display: none;
  }
  .rk-tixyhero__short {
    display: inline;
  }
}
@media (max-width: 768px) {
  ul.rk-tastes {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    gap: 18px;
    padding: 12px 16px;
    li {
      white-space: nowrap;
      font-size: 14px;
      gap: 8px;
    }
    img {
      width: 34px;
      height: 34px;
    }
  }
}
</style>
