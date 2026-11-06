<script lang="ts" setup>
import MkIcon from '~/components/redesign/mpkchita/MkIcon.vue'

useSeoMeta({ title: 'О компании — Маккавеевский пищекомбинат | Концепт редизайна' })
const photos = Array.from({ length: 8 }, (_, i) => `a/${i + 1}.webp`)
const zoom = ref<number | null>(null)
const lines = [
  { title: 'Колбасы и деликатесы', text: 'Вареные, копчёные и сырокопчёные колбасы, ветчины, деликатесы из мяса и птицы, мясные снеки.', to: 'myaso' },
  { title: 'Рыба', text: 'Солёная, копчёная и вяленая рыба, пресервы — рыбные изделия в вакуумной упаковке.', to: 'ryba' },
  { title: 'Полуфабрикаты', text: 'Пельмени, позы, вареники, фарш, мясо для шашлыка и запекания.', to: 'pelmeni' },
  { title: 'Хлеб и выпечка', text: 'Хлебобулочные и кондитерские изделия.', to: 'hleb' },
]
</script>

<template>
  <div class="mk-company">
    <div class="mk-wrap">
      <nav class="mk-crumbs" aria-label="Навигация">
        <span><NuxtLink :to="mkPath('/')">Главная</NuxtLink></span>
      </nav>
      <div class="mk-company__intro">
        <div>
          <h1 class="mk-page-title">О компании</h1>
          <p class="mk-company__lead">
            Мы существуем для тех, кому нужны наши продукты. Делаем их с душой, чтобы люди чувствовали заботу о себе, и следим, чтобы продукты всегда были
            свежими, а каждый покупатель нашёл вкус по себе и по достатку.
          </p>
          <p class="mk-company__motto">Наш девиз — «Делиться лучшим!»</p>
        </div>
        <img :src="mkImg('a/2.webp')" alt="Производство МПК" width="500" height="350" />
      </div>
    </div>

    <section class="mk-wrap mk-section mk-company__story">
      <h2>История</h2>
      <ol class="mk-timeline">
        <li><b>СССР</b><span>В селе Маккавеево Читинского района работает небольшой колбасный цех райпотребсоюза.</span></li>
        <li><b>90-е</b><span>Хозяйство разорено, но в цехе остаются люди, которые сохранили производственные площади.</span></li>
        <li><b>1997</b><span>Колбасное производство в селе возрождено — появляется Маккавеевский пищекомбинат.</span></li>
        <li><b>2004</b><span>Открыт колбасный цех в черте Читы — сегодня это основное подразделение комбината.</span></li>
        <li><b>Сегодня</b><span>Более трёхсот сотрудников, единое управление, широкий ассортимент и регулярная модернизация оборудования.</span></li>
      </ol>
    </section>

    <section class="mk-section mk-section--tint">
      <div class="mk-wrap">
        <div class="mk-head"><h2>Что мы производим</h2></div>
        <div class="mk-company__lines">
          <NuxtLink v-for="l in lines" :key="l.title" :to="mkPath('/catalog/' + l.to)">
            <b>{{ l.title }}</b><span>{{ l.text }}</span><MkIcon name="arrow" :size="18" />
          </NuxtLink>
        </div>
        <p class="mk-company__shops">
          Продукцию рекомендуем покупать в магазинах «Маккавеевский», с которыми мы плотно работаем, —
          <NuxtLink :to="mkPath('/gde-kupit')">адреса и режим работы</NuxtLink>.
        </p>
      </div>
    </section>

    <section id="production" class="mk-wrap mk-section">
      <div class="mk-head">
        <div>
          <h2>Загляните к нам на производство</h2>
          <p>Цеха в Маккавеево и Чите. Видео — на странице новости комбината.</p>
        </div>
        <a :href="mkVideoUrl" target="_blank" rel="noopener" class="mk-btn mk-btn--line"><MkIcon name="play" :size="18" /> Смотреть видео</a>
      </div>
      <div class="mk-company__gallery">
        <button v-for="(ph, i) in photos" :key="ph" type="button" :aria-label="'Фото ' + (i + 1)" @click="zoom = i">
          <img :src="mkImg(ph)" alt="" width="500" height="350" loading="lazy" />
        </button>
      </div>
    </section>

    <section id="awards" class="mk-section mk-section--tint">
      <div class="mk-wrap">
        <div class="mk-head">
          <div>
            <h2>Награды</h2>
            <p>Медали и дипломы выставок и дегустационных конкурсов.</p>
          </div>
        </div>
        <div class="mk-awards">
          <button v-for="(a, i) in mkAwards" :key="a.img" type="button" class="mk-award" @click="zoom = 100 + i">
            <span><img :src="mkImg(a.img)" :alt="a.title" width="400" height="560" loading="lazy" /></span>
            <b>{{ a.title }}</b>
          </button>
        </div>
      </div>
    </section>

    <Transition name="mk-fade">
      <div v-if="zoom !== null" class="mk-zoom" role="dialog" aria-modal="true" @click.self="zoom = null">
        <button type="button" class="mk-iconbtn mk-zoom__close" aria-label="Закрыть" @click="zoom = null"><MkIcon name="close" /></button>
        <img :src="mkImg(zoom >= 100 ? mkAwards[zoom - 100].img : photos[zoom])" alt="" />
        <p v-if="zoom >= 100">{{ mkAwards[zoom - 100].title }}</p>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.mk-company {
  &__intro {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 48px;
    align-items: center;
    margin-top: 6px;
    img {
      width: 100%;
      aspect-ratio: 1.43;
      object-fit: cover;
      border-radius: 20px;
    }
  }
  &__lead {
    margin-top: 16px;
    font-size: 18px;
    max-width: 620px;
  }
  &__motto {
    margin-top: 18px;
    font: 700 26px/1.2 var(--mk-head);
    color: var(--mk-red);
  }
  &__story h2 {
    font-size: clamp(28px, 3vw, 38px);
    margin-bottom: 24px;
  }
  &__lines {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    a {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 20px 20px 48px;
      border-radius: var(--mk-R);
      background: #fff;
      b {
        font: 700 22px/1.15 var(--mk-head);
        color: var(--mk-ink);
      }
      span {
        font-size: 14px;
        color: var(--mk-muted);
      }
      .mk-icon {
        position: absolute;
        left: 20px;
        bottom: 18px;
        color: var(--mk-red);
      }
      &:hover b {
        color: var(--mk-red);
      }
    }
  }
  &__shops {
    margin-top: 20px;
    color: var(--mk-muted);
    a {
      color: var(--mk-red);
      font-weight: 600;
    }
  }
  &__gallery {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    button {
      border-radius: 14px;
      overflow: hidden;
    }
    img {
      width: 100%;
      aspect-ratio: 1.43;
      object-fit: cover;
      transition: transform 0.25s;
    }
    button:hover img {
      transform: scale(1.04);
    }
  }
}
.mk-timeline {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  li {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 16px;
    border-top: 3px solid var(--mk-line);
    &:nth-child(3) {
      border-color: var(--mk-red);
    }
  }
  b {
    font: 700 28px/1 var(--mk-head);
    color: var(--mk-red);
  }
  span {
    font-size: 14.5px;
  }
}
.mk-awards {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;
}
.mk-award {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  > span {
    position: relative;
    display: block;
    aspect-ratio: 0.75;
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
  }
  img {
    position: absolute;
    inset: 8px;
    width: calc(100% - 16px);
    height: calc(100% - 16px);
    object-fit: contain;
  }
  b {
    font-size: 13.5px;
    font-weight: 600;
    line-height: 1.35;
    color: var(--mk-ink);
  }
  &:hover b {
    color: var(--mk-red);
  }
}
.mk-zoom {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 56px 16px 24px;
  background: rgba(20, 16, 14, 0.85);
  img {
    max-width: min(900px, 100%);
    max-height: calc(100vh - 140px);
    border-radius: 12px;
  }
  p {
    color: #fff;
    text-align: center;
  }
  &__close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #fff;
  }
}
@media (max-width: 1199px) {
  .mk-company__lines {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .mk-awards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .mk-timeline {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: 24px;
  }
}
@media (max-width: 989px) {
  .mk-company__intro {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
  .mk-company__gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 576px) {
  .mk-company__lines,
  .mk-timeline {
    grid-template-columns: minmax(0, 1fr);
  }
  .mk-awards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .mk-company__lead {
    font-size: 16px;
  }
}
</style>
