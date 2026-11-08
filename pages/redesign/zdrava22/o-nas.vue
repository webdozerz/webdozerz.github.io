<script lang="ts" setup>
import { zdContacts, zdFacts, zdGalleries, zdImg, zdOrig, zdPath } from '~/utils/zdrava22'
import { useZdUi } from '~/composables/useZdrava22'
import ZdIcon from '~/components/redesign/zdrava22/ZdIcon.vue'

useSeoMeta({ title: 'О нас — пасека «Ширяев и сыновья» | Концепт редизайна' })

const ui = useZdUi()
const up = (f: string) => `https://zdrava22.ru/assets/images/uploads/2019/${f}`
const family = [
  { src: up('ded-Aleksey-i-babushka-Valentina-4.jpg'), full: up('ded-Aleksey-i-babushka-Valentina.jpg'), cap: 'Дед Алексей и бабушка Валентина' },
  { src: up('roditeli-otca001-2.jpg'), full: up('roditeli-otca001.jpg'), cap: 'Родители отца' },
  { src: up('Ya-s-roditelyami-i-babuskami-001-3.jpg'), full: up('Ya-s-roditelyami-i-babuskami-001.jpg'), cap: 'С родителями и бабушками' },
]
const openFamily = (i: number) => ui.open(family.map((f) => ({ thumb: f.src, full: f.full })), i, 'История семьи')
const medonosy = zdGalleries.find((g) => g.id === 'medonosy')!
const base = [
  { icon: 'home', b: 'Зимовники на 450 пчелосемей', s: 'на главной усадьбе в посёлке Прудской' },
  { icon: 'hive', b: 'Столярная мастерская', s: 'три деревообрабатывающих станка — ульи и рамки делаем сами' },
  { icon: 'scale', b: 'Медогонка «Медуница-60Р»', s: 'радиальная, на 60 рамок, и станок для распечатки сотов' },
  { icon: 'truck', b: 'Техника и транспорт', s: 'для кочёвки и перевозки пасек' },
]
const docs = [
  { id: 'sertifikaty', title: 'Сертификаты', text: 'Документы на мёд и продукты пчеловодства.', url: '/sertifikaty/', icon: 'doc' },
  { id: 'dostizheniya', title: 'Наши достижения', text: 'Конкурсы мёда, форумы и конференции пчеловодов.', url: '/nashi-dostizheniya-med/', icon: 'award' },
  { id: 'gosti', title: 'Наши гости', text: 'Кто приезжал на пасеку и что смотрел.', url: '/nashi-gosti-paseka/', icon: 'user' },
]
</script>

<template>
  <div class="zd-wrap">
    <nav class="zd-crumbs"><NuxtLink :to="zdPath()">Главная</NuxtLink><span>О нас</span></nav>
    <header class="zd-pagehead">
      <h1>О нас</h1>
      <p>Пчеловод с 40-летним опытом Алексей Ширяев и его сыновья Иван и Василий на собственной пасеке.</p>
    </header>

    <section class="zd-sec zd-sec--first zd-about">
      <div class="zd-about__txt">
        <h2>Делать мёд — это призвание</h2>
        <p>Нашей пасеке сейчас уже больше 40 лет. Важно, чтобы Вы понимали главную идею моего сайта: он не только для продажи мёда.</p>
        <p>Моя главная задача, как ответственного пчеловода, — избавить людей от некачественной продукции и защитить славу настоящего Алтайского мёда.</p>
        <p>Хоть у нас и большие объемы производства мёда, мы остаемся простыми и честными пчеловодами! И всегда готовы лично привезти даже самый маленький заказ.</p>
        <p class="zd-about__sign">Алексей Ширяев</p>
      </div>
      <div class="zd-about__family">
        <button v-for="(f, i) in family" :key="f.cap" type="button" @click="openFamily(i)">
          <img :src="f.src" :alt="f.cap" loading="lazy" width="300" height="220" />
          <span>{{ f.cap }}</span>
        </button>
      </div>
    </section>

    <section class="zd-sec">
      <ul class="zd-facts">
        <li v-for="f in zdFacts" :key="f.b">
          <ZdIcon :name="f.icon" :size="28" />
          <div><b>{{ f.b }}</b><span>{{ f.s }}</span></div>
        </li>
      </ul>
    </section>

    <section id="medonosy" class="zd-sec">
      <div class="zd-head">
        <div>
          <h2>Наши медоносы</h2>
          <p>Пасеку ставим как можно ближе к посевам гречихи, а для качества мёда сами подсаживаем фацелию и эспарцет. В горах — дягиль, карагана и разнотравье.</p>
        </div>
        <NuxtLink :to="zdPath('/foto') + '?g=medonosy'" class="zd-link">Все {{ medonosy.shots.length }} фото<ZdIcon name="arrow" :size="16" /></NuxtLink>
      </div>
      <div class="zd-strip">
        <button v-for="(s, i) in medonosy.shots.slice(0, 10)" :key="s.thumb" type="button" @click="ui.open(medonosy.shots, i, 'Медоносы')">
          <img :src="s.thumb" alt="Медонос" loading="lazy" width="348" height="231" />
        </button>
      </div>
    </section>

    <section id="baza" class="zd-sec zd-split">
      <img :src="zdImg('house.jpg')" alt="Главная усадьба пасеки в Прудском" width="900" height="600" loading="lazy" />
      <div>
        <h2>Материальная база</h2>
        <ul class="zd-steps">
          <li v-for="b in base" :key="b.b">
            <i><ZdIcon :name="b.icon" /></i>
            <div><b>{{ b.b }}</b><span>{{ b.s }}</span></div>
          </li>
        </ul>
      </div>
    </section>

    <section id="tehnologiya" class="zd-sec zd-split zd-split--rev">
      <img :src="zdImg('field.jpg')" alt="Пчеловоды в цветущем поле" width="900" height="600" loading="lazy" />
      <div>
        <h2>Технология производства</h2>
        <p>Как мы работаем с пчёлами, мёдом и пчелопродуктами — на видео с пасеки: снятие медовых корпусов, откачка, очистка рамок, зимовка на воле и в зимовнике.</p>
        <div class="zd-split__btns">
          <NuxtLink :to="zdPath('/video')" class="zd-btn">Смотреть видео</NuxtLink>
          <a :href="zdOrig('/tehnologiya-proizvodstva/')" target="_blank" rel="noopener" class="zd-link">Статьи о технологии<ZdIcon name="ext" :size="16" /></a>
        </div>
      </div>
    </section>

    <section id="gde" class="zd-sec">
      <div class="zd-head"><h2>Месторасположение</h2></div>
      <div class="zd-places">
        <div class="zd-places__card">
          <ZdIcon name="home" :size="28" />
          <b>Главная усадьба и пасека у гречихи</b>
          <p>Калманский район, пос. Прудской — примерно в 50 км от Барнаула на юго-запад. Пасеку делим на два-три точка в трёх километрах друг от друга.</p>
          <a :href="zdContacts.map" target="_blank" rel="noopener" class="zd-link">Открыть в Яндекс Картах<ZdIcon name="ext" :size="16" /></a>
        </div>
        <div class="zd-places__card">
          <ZdIcon name="mountain" :size="28" />
          <b>Горная пасека</b>
          <p>Чарышский район, долина речки Солоновка на высоте 620 м. Вокруг холмы и горы до 1500 м, с ближайшего холма виден Бащелакский хребет.</p>
          <a :href="zdOrig('/karty/')" target="_blank" rel="noopener" class="zd-link">Карты на сайте пасеки<ZdIcon name="ext" :size="16" /></a>
        </div>
      </div>
    </section>

    <section class="zd-sec">
      <div class="zd-docs">
        <a v-for="d in docs" :id="d.id" :key="d.id" :href="zdOrig(d.url)" target="_blank" rel="noopener" class="zd-docs__card">
          <ZdIcon :name="d.icon" :size="28" />
          <b>{{ d.title }}</b>
          <span>{{ d.text }}</span>
          <small>Открыть на сайте пасеки <ZdIcon name="ext" :size="14" /></small>
        </a>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.zd-about {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 40px;
  align-items: start;

  &__txt {
    display: grid;
    gap: 14px;
    font-size: 16px;

    h2 {
      font-size: 30px;
    }
  }
  &__sign {
    font-family: 'Roboto Slab', serif;
    font-weight: 700;
    color: var(--zd-ink);
  }
  &__family {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    button {
      display: grid;
      gap: 6px;
      text-align: left;
      font-size: 13px;
      color: var(--zd-muted);

      &:first-child {
        grid-column: 1 / -1;
      }
    }
    img {
      width: 100%;
      aspect-ratio: 3 / 2;
      height: auto;
      object-fit: cover;
      border-radius: 16px;
      background: var(--zd-surface);
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
  @media (max-width: 768px) {
    &__txt {
      font-size: 15px;

      h2 {
        font-size: 24px;
      }
    }
  }
}
.zd-strip {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - 4 * 12px) / 5);
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-color: #cfd3e2 transparent;

  img {
    width: 100%;
    aspect-ratio: 3 / 2;
    height: auto;
    object-fit: cover;
    border-radius: 14px;
    background: var(--zd-surface);
  }

  @media (max-width: 768px) {
    grid-auto-columns: calc((100% - 12px) / 2.3);
  }
}
.zd-split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 40px;
  align-items: center;

  > img {
    width: 100%;
    aspect-ratio: 3 / 2;
    height: auto;
    object-fit: cover;
    border-radius: var(--zd-R);
  }
  > div {
    display: grid;
    gap: 12px;
  }
  h2 {
    font-size: 28px;
  }
  &--rev > img {
    order: 2;
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    margin-top: 6px;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;

    &--rev > img {
      order: 0;
    }
  }
  @media (max-width: 768px) {
    h2 {
      font-size: 24px;
    }
  }
}
.zd-places {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  &__card {
    display: grid;
    gap: 8px;
    align-content: start;
    justify-items: start;
    padding: 24px;
    border-radius: 20px;
    background: var(--zd-surface);

    > svg {
      color: var(--zd-accent);
    }
    b {
      font-family: 'Roboto Slab', serif;
      font-size: 19px;
      color: var(--zd-ink);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.zd-docs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  &__card {
    display: grid;
    gap: 6px;
    align-content: start;
    padding: 22px;
    border-radius: 20px;
    border: 1px solid var(--zd-line);
    scroll-margin-top: 96px;

    > svg {
      color: var(--zd-accent);
    }
    b {
      font-family: 'Roboto Slab', serif;
      font-size: 19px;
      color: var(--zd-ink);
    }
    span {
      color: var(--zd-muted);
      font-size: 14px;
    }
    small {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
      color: var(--zd-accent);
      font-weight: 600;
      font-size: 13px;
    }
    &:hover {
      border-color: var(--zd-accent);
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
