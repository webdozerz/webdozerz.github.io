<script lang="ts" setup>
import RkIcon from '~/components/redesign/rkdon/RkIcon.vue'

useSeoMeta({ title: 'О компании — Рыбокомбинат Донской | Концепт редизайна' })

const parts = [
  {
    id: 'production',
    icon: 'factory',
    title: 'Производство',
    text: 'Современное производство с высоким уровнем автоматизации и механизации сушки и вялки, не имеющее аналогов в России, задаёт высокий стандарт производительности труда и качества продукции в отрасли.',
    img: 'i/company1.jpg',
  },
  {
    id: 'technology',
    icon: 'gear',
    title: 'Технология и оборудование',
    text: 'Современное высокотехнологичное оборудование для филетировки, сушки, вялки и упаковки рыбной продукции.',
    img: 'i/company3.jpg',
  },
  {
    id: 'quality',
    icon: 'shield',
    title: 'Система контроля качества',
    text: 'Полный контроль входящего сырья и готовой продукции на всех стадиях производства.',
    img: 'i/company2.jpg',
  },
  {
    id: 'logistics',
    icon: 'snow',
    title: 'Логистический центр',
    text: 'Современный логистический центр с четырьмя большими холодильными камерами. Доставляем заказы силами собственной логистической компании.',
    img: 'i/company4.jpg',
  },
]

// Слайдер первого экрана оригинала (5 фото) переехал сюда галереей: стрелки, точки, автопрокрутка.
const slides = [
  { img: 'i/slide1.jpg', alt: 'Здание рыбокомбината' },
  { img: 'i/slide4.jpg', alt: 'Вяленая рыба' },
  { img: 'i/slide5.jpg', alt: 'Упаковка кальмара на производстве' },
  { img: 'i/slide2.jpg', alt: 'Кальмар' },
  { img: 'i/slide3.jpg', alt: 'Рыба' },
]
const cur = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
const go = (d: number) => (cur.value = (cur.value + d + slides.length) % slides.length)
const restart = () => {
  clearInterval(timer)
  timer = setInterval(() => go(1), 5000)
}
const stop = () => clearInterval(timer)
const step = (d: number) => {
  go(d)
  restart()
}
const pick = (i: number) => {
  cur.value = i
  restart()
}
onMounted(restart)
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="rk-company">
    <div class="rk-wrap rk-pagehead">
      <nav class="rk-crumbs">
        <NuxtLink :to="rkPath('/')">Главная</NuxtLink><span>Компания</span>
      </nav>
      <h1>АО «Рыбокомбинат Донской»</h1>
      <p class="rk-pagehead__lead">
        Градообразующее предприятие Новошахтинска: около 1 000 сотрудников, 10 лет с выпуска первой продукции. Работаем на рынках России и
        стран СНГ и поставляем продукцию в крупнейшие торговые сети.
      </p>
      <nav class="rk-anchors" aria-label="Разделы страницы">
        <a v-for="p in parts" :key="p.id" :href="'#' + p.id"><RkIcon :name="p.icon" :size="18" />{{ p.title }}</a>
      </nav>
    </div>

    <div class="rk-wrap">
      <div class="rk-slider" @mouseenter="stop" @mouseleave="restart">
        <div class="rk-slider__track" :style="{ transform: `translateX(-${cur * 100}%)` }">
          <img
            v-for="(s, i) in slides"
            :key="s.img"
            :src="rkImg(s.img)"
            :alt="s.alt"
            width="1400"
            height="640"
            :loading="i ? 'lazy' : 'eager'"
          />
        </div>
        <button type="button" class="rk-slider__btn rk-slider__btn--prev" aria-label="Предыдущее фото" @click="step(-1)">
          <RkIcon name="left" />
        </button>
        <button type="button" class="rk-slider__btn rk-slider__btn--next" aria-label="Следующее фото" @click="step(1)">
          <RkIcon name="right" />
        </button>
        <div class="rk-slider__dots">
          <button
            v-for="(s, i) in slides"
            :key="s.img"
            type="button"
            :class="{ 'is-active': cur === i }"
            :aria-label="'Фото ' + (i + 1)"
            @click="pick(i)"
          />
        </div>
      </div>

      <div class="rk-parts">
        <section v-for="p in parts" :id="p.id" :key="p.id" class="rk-part">
          <img :src="rkImg(p.img)" :alt="p.title" width="1400" height="780" loading="lazy" />
          <div class="rk-part__text">
            <span class="rk-part__icon"><RkIcon :name="p.icon" /></span>
            <h2>{{ p.title }}</h2>
            <p>{{ p.text }}</p>
          </div>
        </section>
      </div>

      <ul class="rk-facts rk-company__facts">
        <li><b>~1 000</b><span>сотрудников</span></li>
        <li><b>10 лет</b><span>с выпуска первой продукции</span></li>
        <li><b>4</b><span>холодильные камеры логистического центра</span></li>
        <li><b>16</b><span>сетей с нашей продукцией под своей маркой</span></li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.rk-anchors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
  a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 12px;
    background: var(--rk-surface);
    font-weight: 700;
    color: var(--rk-ink);
    white-space: nowrap;
    svg {
      color: var(--rk-accent);
    }
    &:hover {
      background: var(--rk-soft);
      color: var(--rk-accent);
    }
  }
}
.rk-slider {
  position: relative;
  border-radius: var(--rk-R);
  overflow: hidden;
  aspect-ratio: 2.3;
  background: var(--rk-surface);
  &__track {
    display: flex;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    img {
      flex: none;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__btn {
    position: absolute;
    top: 50%;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    margin-top: -24px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.92);
    color: var(--rk-ink);
    &:hover {
      color: var(--rk-accent);
    }
    &--prev {
      left: 16px;
    }
    &--next {
      right: 16px;
    }
  }
  &__dots {
    position: absolute;
    left: 50%;
    bottom: 16px;
    display: flex;
    gap: 6px;
    padding: 8px 10px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.92);
    transform: translateX(-50%);
    button {
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background: #d5c8cd;
      transition:
        width 0.25s,
        background 0.25s;
      &.is-active {
        width: 26px;
        background: var(--rk-accent);
      }
    }
  }
}
.rk-parts {
  display: grid;
  gap: 24px;
  margin-top: 56px;
}
.rk-part {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 48px;
  align-items: center;
  img {
    width: 100%;
    aspect-ratio: 16 / 10;
    height: auto;
    object-fit: cover;
    border-radius: var(--rk-R);
  }
  &:nth-child(even) img {
    order: 2;
  }
  &__text {
    display: grid;
    gap: 14px;
    align-content: center;
    h2 {
      font-size: clamp(26px, 3vw, 36px);
    }
    p {
      font-size: 17px;
    }
  }
  &__icon {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: var(--rk-soft);
    color: var(--rk-accent);
  }
}
ul.rk-company__facts {
  margin-top: 56px;
  padding: 28px 32px;
  border-radius: var(--rk-R);
  background: var(--rk-surface);
}
@media (max-width: 989px) {
  .rk-part {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
    &:nth-child(even) img {
      order: 0;
    }
  }
  .rk-parts {
    gap: 40px;
  }
}
@media (max-width: 768px) {
  .rk-slider {
    aspect-ratio: 1.5;
    &__btn {
      width: 40px;
      height: 40px;
      margin-top: -20px;
      &--prev {
        left: 10px;
      }
      &--next {
        right: 10px;
      }
    }
  }
  .rk-anchors {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
  }
  ul.rk-company__facts {
    grid-template-columns: 1fr 1fr;
    padding: 22px 18px;
  }
}
@media (max-width: 375px) {
  ul.rk-company__facts {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
