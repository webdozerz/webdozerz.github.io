<script lang="ts" setup>
import { mlContacts, mlPath } from '~/utils/moreland'
import { mlAbout, mlHomePhotos } from '~/utils/moreland.data'
import MlIcon from '~/components/redesign/moreland/MlIcon.vue'

useSeoMeta({ title: 'О компании — Морелэнд | Концепт редизайна' })
// диплом (c5) на белом в миниатюре не читается — в галерею не берём
const photos = [...mlAbout.filter((u) => !u.includes('c5')), ...mlHomePhotos]
const open = ref<number | null>(null)
const facts = [
  ['box', 'Широкий ассортимент в сегменте переработанной рыбы'],
  ['user', 'Уважительная и доброжелательная работа с партнёрами'],
  ['doc', 'Полная ответственность за качество и весь пакет документов'],
  ['smoke', 'Инновационный подход к производству'],
  ['check', 'Оптимальное соотношение цены и качества'],
  ['truck', 'Большие планы по модернизации: рыба станет ещё лучше и дешевле'],
]
const step = (d: number) => open.value !== null && (open.value = (open.value + d + photos.length) % photos.length)
</script>

<template>
  <div class="ml-wrap ml-about">
    <nav class="ml-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mlPath('/')">Главная</NuxtLink></span>
      <span>О компании</span>
    </nav>
    <div class="ml-about__grid">
      <div class="ml-about__text">
        <h1>О компании</h1>
        <p class="ml-about__lead">ТК «Морелэнд» предлагает обширный выбор рыбной продукции: высокое качество, демократичная цена и множество наименований.</p>
        <p>ТК «Морелэнд» успешно занимается производством рыбной продукции уже более 15 лет. За это время множество магазинов, включая крупнейшие федеральные сети, оценили выгоду сотрудничества и качество товаров, став нашими постоянными покупателями.</p>
        <p>Вся наша рыбная продукция производится в соответствии с ГОСТом и ТУ при строгом соблюдении технологии. Хорошее сырьё, современные технологии и новое оборудование позволяют делать продукцию, которая отличается качеством и вкусом.</p>
        <p>Успех предприятия во многом зависит от налаженных контактов, выгодных условий сотрудничества и широкого ассортимента. Мы нацелены на долгосрочное сотрудничество.</p>
      </div>
      <div class="ml-about__stats">
        <div><b>1998</b><span>год, с которого коптим</span></div>
        <div><b>74</b><span>позиции в каталоге</span></div>
        <div><b>9</b><span>городов отгрузки, включая Казахстан</span></div>
      </div>
    </div>

    <section class="ml-section">
      <h2 class="ml-h2">Почему с нами работают</h2>
      <ul class="ml-about__facts">
        <li v-for="f in facts" :key="f[1]"><MlIcon :name="f[0]" /><span>{{ f[1] }}</span></li>
      </ul>
    </section>

    <section class="ml-section">
      <h2 class="ml-h2">Цех и продукция</h2>
      <div class="ml-gal">
        <button v-for="(src, i) in photos" :key="src" type="button" class="ml-gal__b" :aria-label="`Фото ${i + 1}`" @click="open = i">
          <img :src="src" :alt="`Фото цеха ${i + 1}`" width="300" height="300" loading="lazy" />
        </button>
      </div>
    </section>

    <section class="ml-section">
      <div class="ml-panel ml-about__cta">
        <div>
          <h2>Станьте нашим партнёром</h2>
          <p>Работаем с юр. лицами и ИП, опт от коробки, бесплатная доставка по Омску.</p>
        </div>
        <div class="ml-about__btns">
          <NuxtLink :to="mlPath('/produkcija/')" class="ml-btn">Продукция и цены</NuxtLink>
          <a :href="`tel:${mlContacts.tel}`" class="ml-btn ml-btn--line"><MlIcon name="phone" />{{ mlContacts.phone }}</a>
        </div>
      </div>
    </section>

    <div v-if="open !== null" class="ml-modal ml-lightbox" @click.self="open = null">
      <button type="button" class="ml-iconbtn ml-lightbox__x" aria-label="Закрыть" @click="open = null"><MlIcon name="close" /></button>
      <button type="button" class="ml-iconbtn ml-lightbox__nav" aria-label="Предыдущее" @click="step(-1)"><MlIcon name="left" /></button>
      <img :src="photos[open]" alt="Фото цеха" />
      <button type="button" class="ml-iconbtn ml-lightbox__nav ml-lightbox__nav--r" aria-label="Следующее" @click="step(1)"><MlIcon name="right" /></button>
    </div>
  </div>
</template>

<style lang="scss">
.ml-about {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 48px;
    align-items: start;
    padding-top: 14px;
  }
  &__text {
    display: grid;
    gap: 14px;
    h1 {
      font-size: clamp(30px, 3.4vw, 44px);
      font-weight: 800;
    }
    p {
      font-size: 16px;
    }
  }
  &__lead {
    font-size: 19px !important;
    color: var(--ml-ink);
    font-weight: 600;
  }
  &__stats {
    display: grid;
    gap: 12px;
    margin-top: 8px;
    div {
      display: grid;
      padding: 18px 22px;
      border-radius: var(--ml-R);
      background: var(--ml-surf);
    }
    b {
      font: 800 40px/1.1 'Bitter', Georgia, serif;
      color: var(--ml-acc);
    }
    span {
      color: var(--ml-text);
    }
  }
  ul.ml-about__facts {
    list-style: none;
    margin: 24px 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 18px;
      border: 1px solid var(--ml-line);
      border-radius: var(--ml-R);
      font-weight: 700;
      color: var(--ml-ink);
    }
    .ml-icon {
      width: 26px;
      height: 26px;
      color: var(--ml-acc);
    }
  }
  &__cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    h2 {
      font-size: 24px;
    }
    p {
      margin-top: 6px !important;
      color: var(--ml-mute);
    }
  }
  &__btns {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
    &__stats {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      b {
        font-size: 30px;
      }
    }
    ul.ml-about__facts {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 576px) {
    &__stats {
      grid-template-columns: minmax(0, 1fr);
    }
    ul.ml-about__facts {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
.ml-gal {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 24px;
  &__b {
    position: relative;
    aspect-ratio: 1;
    padding: 0;
    border: 0;
    border-radius: var(--ml-R);
    overflow: hidden;
    background: var(--ml-surf);
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
      transform: scale(1.05);
    }
  }
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.ml-lightbox {
  img {
    max-width: min(900px, 100%);
    max-height: 82vh;
    border-radius: var(--ml-R);
  }
  &__x {
    position: fixed !important;
    top: 16px;
    right: 16px;
  }
  &__nav {
    position: fixed !important;
    top: 50%;
    left: 16px;
    &--r {
      left: auto;
      right: 16px;
    }
  }
}
</style>
