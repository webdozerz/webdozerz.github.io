<script lang="ts" setup>
import RkIcon from '~/components/redesign/rkdon/RkIcon.vue'
import RkSales from '~/components/redesign/rkdon/RkSales.vue'

useSeoMeta({ title: 'Производство под вашей торговой маркой — Рыбокомбинат Донской | Концепт редизайна' })

const steps = [
  { icon: 'flask', title: 'Рецептура', text: 'По вашему желанию разработаем эксклюзивную рецептуру — чтобы отличаться не только упаковкой, но и вкусом' },
  { icon: 'pen', title: 'Дизайн упаковки', text: 'Разработаем дизайн и разместим на упаковке всю информацию по действующим требованиям' },
  { icon: 'barcode', title: 'Штрих-коды', text: 'Получим штрих-коды на каждую позицию' },
  { icon: 'print', title: 'Печать', text: 'Напечатаем упаковку в типографии и выпустим продукцию' },
]
const picks = ['kalmar-koltsa-po-shankhayski', 'yantarnaya-rybka-solomka-s-pertsem', 'kalmar-struzhka-mekhanicheskaya'].map((id) => rkProduct(id)!)
</script>

<template>
  <div class="rk-stm">
    <div class="rk-wrap rk-pagehead">
      <nav class="rk-crumbs">
        <NuxtLink :to="rkPath('/')">Главная</NuxtLink><span>Собственная торговая марка</span>
      </nav>
      <div class="rk-stm__intro">
        <div>
          <h1>Продукция под вашей торговой маркой</h1>
          <p class="rk-pagehead__lead">
            Выпускаем наш ассортимент с фирменной символикой заказчика на упаковке. Розничные сети в России активно развивают собственные
            марки — у нас большой опыт такого производства, все работы проводим в кратчайшие сроки.
          </p>
        </div>
        <div class="rk-stm__plates">
          <img v-for="p in picks" :key="p.id" :src="rkImg(p.imgs[0])" :alt="p.name" width="560" height="560" />
        </div>
      </div>
    </div>
    <div class="rk-wrap">
      <ul class="rk-stm__steps">
        <li v-for="s in steps" :key="s.title">
          <span class="rk-stm__icon"><RkIcon :name="s.icon" /></span>
          <b>{{ s.title }}</b>
          <span>{{ s.text }}</span>
        </li>
      </ul>
      <p class="rk-stm__pack"><RkIcon name="box" :size="20" /> Фасовка — от 18 г до 1 кг, отгрузка коробами по 10 кг или балком.</p>

      <section class="rk-section rk-section--tight">
        <div class="rk-head">
          <div>
            <h2>Наша продукция под марками сетей</h2>
            <p>Сейчас продукция рыбокомбината представлена под частными марками в этих сетях.</p>
          </div>
        </div>
        <div class="rk-chains">
          <span v-for="l in rkStm" :key="l"><img :src="rkImg(l)" alt="" loading="lazy" /></span>
          <span><img :src="rkImg('stm/stm-lenta.svg')" alt="Лента" loading="lazy" /></span>
        </div>
      </section>

      <RkSales
        title="Обсудим условия производства"
        text="Все вопросы о производстве продукции под частной маркой — объёмы, рецептура, сроки — обсудим по телефону или почте."
        subject="Производство под собственной торговой маркой"
      />
    </div>
  </div>
</template>

<style lang="scss">
.rk-stm {
  &__intro {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
    gap: 40px;
    align-items: center;
  }
  &__plates {
    position: relative;
    aspect-ratio: 1.5;
    img {
      position: absolute;
      width: 52%;
      clip-path: circle(43.5% at 50% 50%);
      &:nth-child(1) {
        left: 0;
        top: 0;
      }
      &:nth-child(2) {
        right: 0;
        top: 4%;
        width: 46%;
      }
      &:nth-child(3) {
        left: 30%;
        bottom: -6%;
        width: 40%;
      }
    }
  }
  ul.rk-stm__steps {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    li {
      display: grid;
      gap: 8px;
      align-content: start;
      padding: 22px;
      border-radius: 18px;
      background: var(--rk-surface);
    }
    b {
      font-size: 18px;
      color: var(--rk-ink);
    }
    span:last-child {
      color: var(--rk-muted);
      font-size: 14px;
    }
  }
  &__icon {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    margin-bottom: 6px;
    border-radius: 12px;
    background: #fff;
    color: var(--rk-accent);
  }
  &__pack {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    font-weight: 700;
    color: var(--rk-ink);
    svg {
      color: var(--rk-accent);
      flex: none;
    }
  }
}
.rk-chains {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  span {
    display: grid;
    place-items: center;
    height: 100px;
    padding: 14px 18px;
    border-radius: 16px;
    border: 1px solid var(--rk-line);
    background: #fff;
  }
  img {
    max-width: 100%;
    max-height: 64px;
    width: auto;
    object-fit: contain;
  }
}
@media (max-width: 1199px) {
  .rk-stm ul.rk-stm__steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 989px) {
  .rk-stm__intro {
    grid-template-columns: minmax(0, 1fr);
  }
  .rk-stm__plates {
    max-width: 460px;
    order: -1;
  }
}
@media (max-width: 576px) {
  .rk-stm ul.rk-stm__steps {
    grid-template-columns: minmax(0, 1fr);
  }
  .rk-chains {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    span {
      height: 84px;
    }
  }
}
</style>
