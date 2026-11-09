<script lang="ts" setup>
// Зацепка первого экрана — «Калибровка»: пять яиц от высшей до третьей категории в масштабе средней массы
// (размер ∝ ∛массы, таблица ГОСТ Р 52121-2003 с сайта), на выбранном — штамп, как его ставит сортировщик Staalkat:
// «С0» у столовых, «Д0» и дата сортировки у диетических. Справа — их упаковка этой категории и «Узнать цену».
// На CMS: 5 записей «категория · масса · фото · товар» + ~60 строк JS.
import { kzEggCats, kzImg, kzPath, kzProducts } from '~/utils/kuzbasskay'
import KzAsk from '~/components/redesign/kuzbasskay/KzAsk.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

const idx = ref(1)
const kind = ref<'С' | 'Д'>('С')
const sortDate = ref('')
const cat = computed(() => kzEggCats[idx.value])
const product = computed(() => kzProducts.find((p) => p.id === cat.value.product))
const stamp = computed(() => `${kind.value}${cat.value.code}`)
const scale = (avg: number) => Math.cbrt(avg / 80)
const title = computed(() => `Яйцо ${kind.value === 'С' ? 'столовое' : 'диетическое'} ${cat.value.adj}`)
const what = computed(() => (product.value ? product.value.name : `Яйцо куриное ${cat.value.adj} ${cat.value.label}`))

const pick = (i: number) => {
  idx.value = i
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') idx.value = Math.min(kzEggCats.length - 1, idx.value + 1)
  if (e.key === 'ArrowLeft') idx.value = Math.max(0, idx.value - 1)
}

onMounted(() => {
  // дата сортировки — сегодня по Новокузнецку (UTC+7); считаем в браузере, чтобы не расходиться с SSR
  sortDate.value = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', timeZone: 'Asia/Novokuznetsk' }).format(new Date())
})
</script>

<template>
  <section class="kz-sort" aria-label="Калибровка яйца">
    <div class="kz-sort__grid">
      <div class="kz-sort__left">
        <div class="kz-sort__top">
          <p class="kz-sort__title"><b>Калибровка яйца</b><span>по массе, как на нашей яйцесортировке</span></p>
          <div class="kz-seg" role="group" aria-label="Вид яйца">
            <button type="button" :class="{ 'is-on': kind === 'С' }" :aria-pressed="kind === 'С'" @click="kind = 'С'">Столовое</button>
            <button type="button" :class="{ 'is-on': kind === 'Д' }" :aria-pressed="kind === 'Д'" @click="kind = 'Д'">Диетическое</button>
          </div>
        </div>
        <div class="kz-sort__belt" role="radiogroup" aria-label="Категория" @keydown="onKey">
        <button
          v-for="(c, i) in kzEggCats"
          :key="c.label"
          type="button"
          role="radio"
          class="kz-egg"
          :class="{ 'is-on': i === idx }"
          :aria-checked="i === idx"
          :tabindex="i === idx ? 0 : -1"
          :style="{ '--k': scale(c.avg) }"
          @click="pick(i)"
        >
          <span class="kz-egg__shape">
            <svg viewBox="0 0 100 128" aria-hidden="true">
              <path class="kz-egg__shell" d="M50 3C77 3 97 47 97 80c0 29-20 45-47 45S3 109 3 80C3 47 23 3 50 3z" />
              <ellipse class="kz-egg__shine" cx="35" cy="42" rx="9" ry="16" transform="rotate(18 35 42)" />
              <g v-if="i === idx" transform="rotate(-7 50 84)">
                <g :key="stamp + sortDate" class="kz-egg__stamp">
                  <text x="50" :y="kind === 'Д' ? 80 : 90" text-anchor="middle" class="kz-egg__code">{{ stamp }}</text>
                  <text v-if="kind === 'Д'" x="50" y="101" text-anchor="middle" class="kz-egg__date">{{ sortDate || '—' }}</text>
                </g>
              </g>
            </svg>
          </span>
          <b>{{ c.label }}</b>
          <small>{{ c.avg }} г</small>
        </button>
        </div>
      </div>

      <div class="kz-sort__card" aria-live="polite">
        <div class="kz-sort__photo">
          <img v-if="product" :key="product.id" :src="kzImg(product.photos[0])" :alt="product.name" width="600" height="400" />
          <img v-else key="tray" :src="kzImg('egg-30')" alt="Лоток яиц на 30 штук" width="600" height="400" />
        </div>
        <div class="kz-sort__info">
          <p class="kz-sort__kicker">Категория {{ cat.label }}</p>
          <h2 class="kz-sort__name">{{ title }}</h2>
          <dl class="kz-sort__facts">
            <div><dt>Масса яйца</dt><dd>{{ cat.mass }}</dd></div>
            <div><dt>Штамп</dt><dd>«{{ stamp }}»{{ kind === 'Д' ? ' + дата сортировки' : '' }}</dd></div>
            <div><dt>Хранение</dt><dd>{{ kind === 'Д' ? 'не более 7 суток' : '8–25 суток при 0…20 °C' }}</dd></div>
            <div><dt>Фасовка</dt><dd>{{ product ? 'упаковка 10 шт., лоток 30 шт.' : 'в магазине «Фирменный»' }}</dd></div>
          </dl>
          <div class="kz-sort__acts">
            <KzAsk :what="what" />
            <NuxtLink :to="kzPath('/produkciya/yajco')" class="kz-link">Всё о яйце<KzIcon name="arrow" :size="18" /></NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.kz-sort {
  --egg-max: 152px;
  padding: 28px 32px 30px;
  border-radius: 28px;
  background: var(--kz-surface);

  @media (max-width: 989px) {
    --egg-max: 140px;
    padding: 22px 22px 24px;
  }
  @media (max-width: 576px) {
    --egg-max: 96px;
    padding: 16px 12px 18px;
    border-radius: 22px;
  }
  @media (max-width: 375px) {
    --egg-max: 82px;
  }

  &__left {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  &__top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 20px;
  }
  &__title {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 10px;
    color: var(--kz-ink);

    b {
      font-size: 20px;
      font-weight: 900;
    }
    span {
      color: var(--kz-text);
      font-size: 15px;
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.12fr);
    align-items: stretch;
    gap: 40px;

    @media (max-width: 1199px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
    }
    @media (max-width: 576px) {
      gap: 14px;
    }
  }
  &__belt {
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    align-items: end;
    gap: 6px;
    margin-top: auto;
    padding: 8px 0 0;

    // лента транспортёра под яйцами
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 64px;
      height: 6px;
      border-radius: 6px;
      background: #e8dfcd;
    }
    @media (max-width: 576px) {
      gap: 2px;

      &::after {
        bottom: 56px;
        height: 4px;
      }
    }
  }
  &__card {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 4px 24px;

    @media (min-width: 769px) {
      grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
    }
  }
  &__photo {
    position: relative;
    aspect-ratio: 16 / 7;
    overflow: hidden;
    border-radius: 20px;
    background: #fff;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      animation: kz-fade 0.35s ease;
    }
    @media (min-width: 769px) {
      aspect-ratio: auto;
      min-height: 220px;
    }
    @media (max-width: 768px) {
      aspect-ratio: 16 / 8;
    }
  }
  &__info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0;

    @media (min-width: 769px) {
      justify-content: center;
      padding: 0;
    }
    @media (max-width: 768px) {
      padding: 12px 2px 0;
    }
  }
  &__kicker {
    color: var(--kz-accent-ink);
    font-size: 14px;
    font-weight: 800;
  }
  &__name {
    font-size: 24px;
    font-weight: 900;
    line-height: 1.15;

    &::first-letter {
      text-transform: uppercase;
    }
  }
  dl.kz-sort__facts {
    display: grid;
    gap: 6px;
    margin: 0;
    font-size: 14px;

    div {
      display: grid;
      grid-template-columns: 112px minmax(0, 1fr);
      gap: 10px;
    }
    dt {
      color: var(--kz-muted);
    }
    dd {
      color: var(--kz-ink);
      font-weight: 700;
    }
  }
  &__acts {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 20px;
    margin-top: 4px;
  }
}

.kz-egg {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 2px;
  min-width: 0;
  padding: 0 0 12px;
  border-radius: 16px;
  color: var(--kz-muted);

  &__shape {
    display: block;
    width: calc(var(--egg-max) * var(--k) * 0.78);
    max-width: calc(100% - 10px);
    margin-bottom: 14px;
    transition: transform 0.25s cubic-bezier(0.3, 1.4, 0.5, 1);

    svg {
      display: block;
      width: 100%;
      height: auto;
      overflow: visible;
      filter: drop-shadow(0 6px 6px rgba(93, 64, 20, 0.14));
    }
  }
  &__shell {
    fill: #fdf8ef;
    stroke: #eadcc4;
    stroke-width: 1.6;
    transition: fill 0.2s;
  }
  &__shine {
    fill: #fff;
    opacity: 0.85;
  }
  &__stamp {
    animation: kz-stamp 0.32s ease-out both;
    transform-box: fill-box;
    transform-origin: center;
  }
  &__code {
    fill: #c2392d;
    font-family: 'Courier New', monospace;
    font-size: 25px;
    font-weight: 700;
    letter-spacing: 1px;
    opacity: 0.88;
  }
  &__date {
    fill: #c2392d;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    font-weight: 700;
    opacity: 0.82;
  }
  b {
    color: var(--kz-ink);
    font-size: 18px;
    font-weight: 900;
    line-height: 1.1;
  }
  small {
    font-size: 13px;
    white-space: nowrap;
  }
  &:hover &__shape {
    transform: translateY(-4px);
  }
  &.is-on &__shape {
    transform: translateY(-12px) rotate(-3deg);
  }
  &.is-on &__shell {
    fill: #fffdf8;
    stroke: var(--kz-accent);
    stroke-width: 2.4;
  }
  &.is-on b {
    color: var(--kz-accent-ink);
  }
  &:focus-visible {
    outline: 2px solid var(--kz-accent);
    outline-offset: 2px;
  }

  @media (max-width: 576px) {
    padding-bottom: 8px;

    &__shape {
      margin-bottom: 12px;
    }
    b {
      font-size: 15px;
    }
    small {
      font-size: 12px;
    }
  }
}

@keyframes kz-stamp {
  from {
    opacity: 0;
    transform: scale(1.6);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes kz-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
