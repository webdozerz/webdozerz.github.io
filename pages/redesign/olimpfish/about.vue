<script lang="ts" setup>
import { olBenefits, olDeclarations, olGallery, olPath } from '~/utils/olimpfish'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'

useSeoMeta({ title: 'О компании — Олимп | Концепт редизайна' })
const gallery = olGallery.filter((_, i) => i !== 1)
const box = ref<{ list: { big: string }[]; i: number } | null>(null)
const show = (list: { big: string }[], i: number) => (box.value = { list, i })
const step = (d: number) => {
  if (!box.value) return
  const n = box.value.list.length
  box.value = { ...box.value, i: (box.value.i + d + n) % n }
}
</script>

<template>
  <div class="ol-wrap ol-page ol-about">
    <nav class="ol-crumbs" aria-label="Навигация">
      <NuxtLink :to="olPath('/')">Главная</NuxtLink>
      <span>О компании</span>
    </nav>
    <div class="ol-about__top">
      <div class="ol-about__text">
        <h1 class="ol-title">О компании</h1>
        <p class="ol-lead">Компания «Олимп» — эксперт в натуральном копчении рыбы, начавший свою деятельность в 1980 году.</p>
        <p>Мы специализируемся на производстве продуктов из осетровых видов рыб и других деликатесов. Оригинальная классическая рецептура, широкое использование ручного труда и накопленного с годами опыта ремесла.</p>
        <p>Отличительная черта нашей рыбы — честный состав и натуральный вкус. Вся продукция без консервантов, усилителей вкуса и с низким содержанием соли. Именно поэтому у неё такие короткие сроки хранения.</p>
        <p><b>«Олимп» — это вкусная рыба, качеству которой доверяют.</b></p>
      </div>
      <img class="ol-about__pic" :src="olGallery[1].big" alt="Производство «Олимп»" width="1024" height="683" />
    </div>

    <section class="ol-sec">
      <div class="ol-head"><h2>Наши преимущества</h2></div>
      <ul class="ol-about__benefits">
        <li v-for="b in olBenefits" :key="b.title"><OlIcon :name="b.icon" /><b>{{ b.title }}</b><p>{{ b.text }}</p></li>
      </ul>
    </section>

    <section class="ol-sec ol-about__main">
      <div>
        <h2>Основная деятельность</h2>
        <p>Основное направление — натуральное копчение рыбы осетровых пород. Работаем с осетром, белугой, бестером, севрюгой, калугой. Основные поставщики сырья: Республика Дагестан, Казахстан, Китай и Иран. Шоковая заморозка помогает безопасно транспортировать рыбу и сохранить начальные свойства продукта.</p>
      </div>
      <div>
        <h2>Доставка продукции</h2>
        <p>Сроки поставки рассчитываются индивидуально и зависят от объёмов и способа доставки. Возможна поставка на следующий день после оформления заказа. Работаем с регионами — условия уточняйте у менеджера.</p>
        <NuxtLink :to="olPath('/opt')" class="ol-link">Партнёрам и оптовикам<OlIcon name="right" /></NuxtLink>
      </div>
    </section>

    <section id="gallery" class="ol-sec">
      <div class="ol-head"><h2>Галерея</h2></div>
      <div class="ol-about__gallery">
        <button v-for="(g, i) in gallery" :key="g.th" type="button" @click="show(gallery, i)"><img :src="g.th" :alt="`Фото производства ${i + 1}`" width="768" height="512" loading="lazy" /></button>
      </div>
    </section>

    <section id="declarations" class="ol-sec">
      <div class="ol-head">
        <h2>Декларации</h2>
        <p>Протоколы испытаний и декларации соответствия на продукцию — нажмите, чтобы открыть скан.</p>
      </div>
      <div class="ol-about__docs">
        <button v-for="(d, i) in olDeclarations" :key="d.th" type="button" @click="show(olDeclarations, i)"><img :src="d.th" :alt="`Декларация ${i + 1}`" width="450" height="600" loading="lazy" /></button>
      </div>
    </section>

    <Transition name="ol-fade">
      <div v-if="box" class="ol-lightbox" @click.self="box = null">
        <img :src="box.list[box.i].big" alt="" />
        <button type="button" class="ol-x ol-lightbox__x" aria-label="Закрыть" @click="box = null"><OlIcon name="close" /></button>
        <button type="button" class="ol-x ol-lightbox__l" aria-label="Назад" @click="step(-1)"><OlIcon name="left" /></button>
        <button type="button" class="ol-x ol-lightbox__r" aria-label="Вперёд" @click="step(1)"><OlIcon name="right" /></button>
        <span class="ol-lightbox__n">{{ box.i + 1 }} / {{ box.list.length }}</span>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.ol .ol-about {
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 40px;
    align-items: start;
  }
  &__text {
    display: grid;
    gap: 14px;
  }
  &__pic {
    width: 100%;
    height: auto;
    border-radius: 20px;
  }
  ul.ol-about__benefits {
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    li {
      display: grid;
      align-content: start;
      gap: 8px;
      padding: 22px;
      border-radius: var(--ol-R);
      background: var(--ol-surf);
    }
    .ol-icon {
      width: 30px;
      height: 30px;
      color: var(--ol-acc);
    }
    b {
      color: var(--ol-ink);
      font-size: 16px;
      line-height: 1.3;
    }
    p {
      font-size: 14px;
      color: var(--ol-mute);
    }
  }
  &__main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    > div {
      display: grid;
      gap: 12px;
      justify-items: start;
      align-content: start;
    }
    h2 {
      font-size: 24px;
    }
  }
  &__gallery {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  &__docs {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
  }
  &__gallery button,
  &__docs button {
    padding: 0;
    border: 1px solid var(--ol-line);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: auto;
      transition: transform 0.3s;
    }
    &:hover img {
      transform: scale(1.03);
    }
  }
}
.ol .ol-lightbox {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  place-items: center;
  padding: 60px 70px;
  background: rgb(8 14 30 / 0.88);
  img {
    max-width: 100%;
    max-height: calc(100vh - 120px);
    border-radius: 12px;
    background: #fff;
  }
  &__x {
    position: absolute !important;
    top: 16px;
    right: 16px;
  }
  &__l,
  &__r {
    position: absolute !important;
    top: 50%;
    transform: translateY(-50%);
  }
  &__l {
    left: 14px;
  }
  &__r {
    right: 14px;
  }
  &__n {
    position: absolute;
    bottom: 18px;
    color: #fff;
    font-weight: 600;
  }
}
@media (max-width: 1199px) {
  .ol .ol-about ul.ol-about__benefits {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 989px) {
  .ol .ol-about {
    &__top,
    &__main {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
    &__docs {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
@media (max-width: 576px) {
  .ol .ol-about {
    ul.ol-about__benefits {
      grid-template-columns: minmax(0, 1fr);
    }
    &__gallery {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    &__docs {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  .ol .ol-lightbox {
    padding: 60px 12px;
    &__l,
    &__r {
      top: auto;
      bottom: 10px;
      transform: none;
    }
  }
}
</style>
