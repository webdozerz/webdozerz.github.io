<script lang="ts" setup>
import { dmImg, dmPath } from '~/utils/domoteka'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'

useSeoMeta({ title: 'О фабрике «Домотека» — производство столов с 1989 года | Концепт редизайна' })
const principles = [
  ['Создаём мебель,', 'а не копируем'],
  ['Думаем о качестве,', 'а не о конкурентах'],
  ['Не экономим на материалах,', 'поэтому столы служат долго'],
  ['Проводим crash-test’ы', 'наших столов'],
  ['Все модели всегда в наличии', 'на складе — не нужно ждать изготовления'],
]
const photos = Array.from({ length: 12 }, (_, i) => dmImg(`f/${i + 1}.jpg`))
const big = ref<number | null>(null)
</script>

<template>
  <div class="dm-wrap dm-about">
    <div class="dm-page-head">
      <nav class="dm-crumbs" aria-label="Навигация"><NuxtLink :to="dmPath('/')">Главная</NuxtLink><span>О фабрике</span></nav>
      <h1 class="dm-h1">О фабрике</h1>
      <p class="dm-lead">«Домотека» — один из ведущих российских производителей кухонных, компьютерных и письменных столов. История фабрики началась в 1989 году.</p>
    </div>

    <section class="dm-sec dm-about__intro">
      <img :src="dmImg('f/1.jpg')" alt="Производство фабрики «Домотека»" width="1000" height="667" />
      <ul class="dm-about__pr">
        <li v-for="[a, b] in principles" :key="a"><b>{{ a }}</b> {{ b }}</li>
      </ul>
    </section>

    <section class="dm-sec">
      <ul class="dm-facts">
        <li><b>400+</b><span>дилеров в Москве, регионах России, Беларуси и Казахстане</span></li>
        <li><b>15 000 м²</b><span>производственные и складские площади</span></li>
        <li><b>150+</b><span>человек на производстве</span></li>
        <li><b>с 1989</b><span>производим столы</span></li>
        <li><b>1,5 года</b><span>гарантия на продукцию</span></li>
      </ul>
    </section>

    <section class="dm-sec dm-about__text">
      <div>
        <h2 class="dm-h2">Производство</h2>
        <p>Фабрика постоянно увеличивает производственные и складские площади. На производстве работают импортные станки итальянских и немецких марок BIESSE, SCM и HOMAG — их оборудование стоит на крупнейших мебельных предприятиях Европы. Большая часть процессов автоматизирована, персонал регулярно проходит курсы повышения квалификации.</p>
        <p>Каждый год фабрика выпускает новые модели: в разработке участвуют наши инженеры, дизайнеры и технологи. О новинках рассказываем в <NuxtLink :to="dmPath('/novosti/')">новостях</NuxtLink>.</p>
      </div>
      <div>
        <h2 class="dm-h2">Материалы и контроль</h2>
        <p>Детали столов, в зависимости от модели, делаем из ламинированной ЛДСП или МДФ в плёнке PVC методом вакуумного прессования, закалённого стекла и металла. Материалы соответствуют европейским требованиям к качеству и экологической безопасности мебели и ГОСТ.</p>
        <p>Металлические ножки — из стали отечественных производителей: красим порошковой краской на своей фабрике и запекаем в печах при высокой температуре. Сварка автоматизирована, изделия проходят контроль на всех этапах.</p>
        <NuxtLink :to="{ path: dmPath('/model/vita-k-1/') }" class="dm-about__crash"><DmIcon name="play" />Crash-test стола Вита К-1</NuxtLink>
      </div>
    </section>

    <section class="dm-sec">
      <h2 class="dm-h2">Фабрика в фотографиях</h2>
      <div class="dm-about__gal">
        <button v-for="(ph, i) in photos" :key="ph" type="button" :aria-label="`Фото производства ${i + 1}`" @click="big = i">
          <img :src="ph" alt="" width="1000" height="667" loading="lazy" />
        </button>
      </div>
    </section>

    <div v-if="big !== null" class="dm-modal dm-about__lb" role="dialog" aria-modal="true" @click.self="big = null">
      <button type="button" class="dm-iconbtn dm-about__x" aria-label="Закрыть" @click="big = null"><DmIcon name="close" /></button>
      <button type="button" class="dm-about__nav dm-about__nav--l" aria-label="Предыдущее" @click="big = (big! + 11) % 12"><DmIcon name="left" /></button>
      <img :src="photos[big]" alt="Производство фабрики «Домотека»" width="1000" height="667" />
      <button type="button" class="dm-about__nav dm-about__nav--r" aria-label="Следующее" @click="big = (big! + 1) % 12"><DmIcon name="right" /></button>
    </div>
  </div>
</template>

<style lang="scss">
.dm .dm-about {
  .dm-about__intro {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 32px;
    align-items: center;
    padding-top: 28px;
    img {
      width: 100%;
      height: auto;
      aspect-ratio: 3 / 2;
      object-fit: cover;
      border-radius: 18px;
    }
  }
  ul.dm-about__pr {
    display: grid;
    gap: 14px;
    li {
      padding-left: 18px;
      border-left: 3px solid var(--dm-or);
      font-size: 19px;
      line-height: 1.35;
      color: var(--dm-muted);
    }
    b {
      color: var(--dm-ink);
      font-weight: 700;
    }
  }
  .dm-about__text {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px 48px;
    > div {
      display: grid;
      align-content: start;
      gap: 14px;
    }
    p {
      font-size: 16px;
      line-height: 1.65;
    }
    a {
      color: var(--dm-acc);
    }
  }
  .dm-about__crash {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    text-decoration: none;
    .dm-icon {
      width: 30px;
      height: 30px;
      padding: 7px;
      border-radius: 50%;
      background: var(--dm-or-d);
      color: #fff;
      fill: currentColor;
    }
  }
  .dm-about__gal {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin-top: 24px;
    button {
      padding: 0;
      border: 0;
      border-radius: var(--dm-r2);
      overflow: hidden;
      cursor: zoom-in;
    }
    img {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 3 / 2;
      object-fit: cover;
      transition: transform 0.3s;
    }
    button:hover img {
      transform: scale(1.04);
    }
  }
  .dm-about__lb {
    img {
      max-width: min(1000px, 92vw);
      max-height: 84vh;
      width: auto;
      height: auto;
      border-radius: 12px;
    }
  }
  .dm-about__x {
    position: fixed;
    top: 16px;
    right: 16px;
    background: #fff;
  }
  .dm-about__nav {
    position: fixed;
    top: 50%;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    margin-top: -24px;
    border: 0;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    &--l {
      left: 16px;
    }
    &--r {
      right: 16px;
    }
  }
}
@media (max-width: 989px) {
  .dm .dm-about {
    .dm-about__intro,
    .dm-about__text {
      grid-template-columns: minmax(0, 1fr);
    }
    .dm-about__gal {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
@media (max-width: 576px) {
  .dm .dm-about {
    .dm-about__gal {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    ul.dm-about__pr li {
      font-size: 17px;
    }
  }
}
</style>
