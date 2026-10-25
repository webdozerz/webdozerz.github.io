<script lang="ts" setup>
import PcIcon from '~/components/redesign/38pchel/PcIcon.vue'

useSeoMeta({ title: 'О пасеке — 38пчёл | Концепт редизайна' })

const facts = [
  { n: 'с 1991', t: 'семейная пасека Черепановых' },
  { n: '70+', t: 'пчелосемей, вместе с родителями — больше 140' },
  { n: '10 км', t: 'от п. Оёк, Иркутский район' },
]
</script>

<template>
  <div class="pc-wrap pc-about">
    <nav class="pc-crumbs" aria-label="Навигация">
      <NuxtLink :to="pcPath()">Главная</NuxtLink>
      <span>/</span>
      <span>О пасеке</span>
    </nav>

    <section class="pc-about__top">
      <div>
        <h1 class="pc-title">Мы — семья из Иркутска, Сергей и Юлия Черепановы</h1>
        <p class="pc-about__lead">
          Занимаемся пчеловодством. Пасека кочевая: на время основного медосбора вывозим пчёл на поля медоносов, чаще всего донника. В
          радиусе лёта растут и дикие медоносы — клевер, кипрей, герань, луговые и лесные травы.
        </p>
        <p>
          Пчёл держим в деревянных ульях. Профилактическое лечение проводим осенью, уже после откачки мёда. Наши пчёлы собирают мёд на полях,
          лугах и в лесу, а не между дорог и дачных участков.
        </p>
        <p>Другое направление нашей работы — разведение пчёл на продажу: карника, ульи «Дадан».</p>
        <ul class="pc-about__facts">
          <li v-for="f in facts" :key="f.n">
            <b>{{ f.n }}</b>
            <span>{{ f.t }}</span>
          </li>
        </ul>
      </div>
      <img :src="pcImg('family')" alt="Семья Черепановых на пасеке" width="1080" height="717" class="pc-about__photo" />
    </section>

    <section class="pc-section">
      <div class="pc-head">
        <div>
          <h2>История пасеки</h2>
          <p>Слова Сергея: «С пчёлами познакомился в 11 лет. Через несколько лет пчеловодство стало семейным делом».</p>
        </div>
      </div>
      <ol class="pc-about__history">
        <li v-for="h in pcHistory" :key="h.year">
          <img v-if="h.img" :src="pcImg(h.img)" :alt="h.text" width="400" height="300" loading="lazy" />
          <span v-else class="pc-about__nophoto"><PcIcon name="hive" :size="40" /></span>
          <b>{{ h.year }}</b>
          <span>{{ h.text }}</span>
        </li>
      </ol>
    </section>

    <section class="pc-section">
      <div class="pc-head">
        <div>
          <h2>Сезон 2026 — фотодневник</h2>
          <p>Ещё больше фото за прошлые годы — в архиве на сайте, с 2016 года.</p>
        </div>
      </div>
      <ul class="pc-about__season">
        <li v-for="d in pcSeason" :key="d.img">
          <img :src="pcImg(d.img)" :alt="d.text" width="540" height="405" loading="lazy" />
          <span><b>{{ d.date }}.</b> {{ d.text }}</span>
        </li>
      </ul>
    </section>

    <section class="pc-section">
      <div class="pc-panel pc-about__promise">
        <PcIcon name="shield" :size="36" />
        <div>
          <h2>Качество продукции гарантируем</h2>
          <p>Если вам что-то не понравится — вернём деньги.</p>
        </div>
        <NuxtLink :to="{ path: pcPath('/catalog'), query: { s: 'honey' } }" class="pc-btn pc-btn--accent">Выбрать мёд</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.pc-about {
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 40px;
    align-items: stretch;

    > div {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
  }

  &__lead {
    font-size: 18px;
  }

  &__photo {
    width: 100%;
    height: 100%;
    min-height: 420px;
    object-fit: cover;
    border-radius: var(--pc-r-panel);
    margin-top: 12px;
  }

  ul.pc-about__facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 8px;

    li {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px;
      border-radius: var(--pc-r-card);
      background: var(--pc-surface);
      font-size: 14px;
      line-height: 1.35;
    }

    b {
      font-family: var(--pc-head);
      font-size: 30px;
      line-height: 1;
      color: var(--pc-accent);
    }
  }

  ol.pc-about__history {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 14px;

    li {
      display: flex;
      flex-direction: column;
      gap: 4px;
      color: #403a32;
      font-size: 14px;
    }

    img,
    .pc-about__nophoto {
      width: 100%;
      height: auto;
      aspect-ratio: 3 / 4;
      object-fit: cover;
      border-radius: var(--pc-r-card);
      margin-bottom: 8px;
    }

    b {
      font-family: var(--pc-head);
      font-size: 26px;
      color: var(--pc-ink);
    }
  }

  &__nophoto {
    display: grid;
    place-items: center;
    background: var(--pc-honey);
    color: var(--pc-ink);
  }

  ul.pc-about__season {
    columns: 3;
    column-gap: 16px;

    li {
      break-inside: avoid;
      margin-bottom: 18px;
    }

    img {
      display: block;
      width: 100%;
      height: auto;
      border-radius: var(--pc-r-card);
      margin-bottom: 8px;
    }
  }

  &__promise {
    display: flex;
    align-items: center;
    gap: 20px;

    svg {
      color: var(--pc-accent);
    }

    h2 {
      font-size: 28px;
    }

    p {
      margin-top: 6px;
    }

    > div {
      flex: 1;
    }
  }

  @media (max-width: 1199px) {
    ol.pc-about__history {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 989px) {
    &__top {
      grid-template-columns: minmax(0, 1fr);
    }

    &__photo {
      order: -1;
      min-height: 0;
      aspect-ratio: 3 / 2;
      height: auto;
    }

    ul.pc-about__season {
      columns: 2;
    }
  }

  @media (max-width: 576px) {
    ul.pc-about__facts {
      grid-template-columns: minmax(0, 1fr);
    }

    ol.pc-about__history {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    ul.pc-about__season {
      columns: 1;
    }

    &__promise {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
