<script lang="ts" setup>
import FmIcon from '~/components/redesign/fermatomsk/FmIcon.vue'
import FmReviews from '~/components/redesign/fermatomsk/FmReviews.vue'

const ui = useFermatomskUi()

useSeoMeta({ title: 'О ферме — FermaTomsk | Концепт редизайна' })

const people = [
  { name: 'Марина', photo: fmPhotos[3] },
  { name: 'Валерий', photo: fmPhotos[1] },
]
const open = (i: number) => {
  ui.photo.value = { list: fmPhotos, index: i }
}
</script>

<template>
  <div class="fm-wrap fm-about">
    <header class="fm-pagehead">
      <h1>Добро пожаловать на ферму!</h1>
      <p>{{ fmAbout[2] }}</p>
    </header>

    <section class="fm-about__intro">
      <div class="fm-about__text">
        <p v-for="t in fmAbout.slice(0, 2)" :key="t">{{ t }}</p>
        <p>{{ fmPromise }}</p>
        <ul class="fm-about__facts">
          <li><FmIcon name="pin" /><span>Посёлок Рассвет, 25 км от Томска</span></li>
          <li><FmIcon name="shield" /><span>Ветеринарный паспорт у каждого животного</span></li>
          <li><FmIcon name="leaf" /><span>Только натуральные корма</span></li>
        </ul>
      </div>
      <div class="fm-about__people">
        <button v-for="p in people" :key="p.name" type="button" class="fm-person" @click="open(fmPhotos.indexOf(p.photo))">
          <img :src="p.photo.src" :alt="p.photo.alt" loading="lazy" />
          <span>{{ p.name }}</span>
        </button>
      </div>
    </section>

    <section class="fm-section">
      <div class="fm-head">
        <div>
          <h2>Мы работаем для вас</h2>
          <p>Коровы, козы, овцы, кролики и куры — фотографии с фермы. Нажмите, чтобы увеличить.</p>
        </div>
      </div>
      <div class="fm-gallery">
        <button
          v-for="(p, i) in fmPhotos"
          :key="p.src"
          type="button"
          class="fm-gallery__item"
          :class="{ 'is-tall': !p.wide }"
          @click="open(i)"
        >
          <img :src="p.src" :alt="p.alt" loading="lazy" />
        </button>
      </div>
    </section>

    <section class="fm-section">
      <div class="fm-head">
        <h2>Отзывы</h2>
      </div>
      <FmReviews />
    </section>
  </div>
</template>

<style lang="scss">
.fm-about {
  &__intro {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 32px;
    margin-top: 28px;

    @media (max-width: 989px) {
      grid-template-columns: 1fr;
    }
  }

  &__text {
    display: grid;
    align-content: start;
    gap: 14px;
    color: var(--fm-text);
    font-size: 17px;
  }

  &__facts {
    display: grid;
    gap: 10px;
    margin-top: 8px;
    padding: 20px;
    border-radius: var(--fm-r-lg);
    background: var(--fm-surface);
    font-size: 15px;

    li {
      display: flex;
      gap: 12px;
      align-items: center;
      color: var(--fm-ink);
    }

    .fm-icon {
      flex: none;
      color: var(--fm-green);
    }
  }

  &__people {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
}

.fm-person {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  border-radius: var(--fm-r-lg);
  background: var(--fm-photo);
  cursor: zoom-in;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    position: absolute;
    left: 12px;
    bottom: 12px;
    padding: 6px 12px;
    border-radius: 10px;
    background: #fff;
    font-weight: 600;
  }
}

.fm-gallery {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 200px;
  grid-auto-flow: dense;
  gap: 12px;

  &__item {
    overflow: hidden;
    border-radius: var(--fm-r-lg);
    background: var(--fm-photo);
    cursor: zoom-in;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s;
    }

    &:hover img {
      transform: scale(1.04);
    }

    &.is-tall {
      grid-row: span 2;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: 170px;
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    grid-auto-rows: 150px;

    // В две колонки высокие снимки оставляют дыры: все одного размера, последний (11-й) во всю ширину.
    .fm-gallery__item.is-tall {
      grid-row: auto;
    }

    .fm-gallery__item:last-child {
      grid-column: 1 / -1;
    }
  }
}

// Глобальный сброс портфолио ul[class] { margin: 0; padding: 0 } сильнее одного класса.
ul.fm-about__facts {
  margin-top: 8px;
  padding: 20px;
}
</style>
