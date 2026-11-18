<script lang="ts" setup>
// Первый экран «Собери стол»: модель, столешница и ножки их образцами — снимок меняется на настоящий вариант со склада,
// недоступные сочетания гаснут (как дерево торговых предложений Битрикса). План сверху показывает размер сложенным и разложенным.
import { dmProducts } from '~/utils/domoteka.data'
import { dmCode, dmColorName, dmFindOffer, dmImg, dmPath } from '~/utils/domoteka'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'

interface HeroModel {
  id: string
  label: string
  shape: 'round' | 'rect'
  l: number
  w: number
  ext: number | null
  insert: number
  note: string
}
const MODELS: HeroModel[] = [
  { id: 'vita-k-1', label: 'Вита К-1', shape: 'round', l: 110, w: 110, ext: 147, insert: 37, note: 'круглый, раскладывается «бабочкой»' },
  { id: 'gamma-pr-1', label: 'Гамма ПР-1', shape: 'rect', l: 120, w: 80, ext: null, insert: 0, note: 'прямоугольный, нераскладной' },
  { id: 'kukhonnyy-stol-rumba-pr', label: 'Румба ПР', shape: 'rect', l: 110, w: 70, ext: 147, insert: 37, note: 'керамика «под камень», цельная вставка' },
]
const mi = ref(0)
const m = computed(() => MODELS[mi.value])
const p = computed(() => dmProducts.find((x) => x.id === m.value.id)!)
const c = ref('')
const l = ref('')
const open = ref(false)
const reset = () => {
  const o = p.value.offers[0]
  c.value = o.c
  l.value = o.l
  open.value = false
}
reset()
watch(mi, reset)
const legsFor = computed(() => new Set(p.value.offers.filter((o) => o.c === c.value).map((o) => o.l)))
const pickC = (id: string) => {
  c.value = id
  if (!legsFor.value.has(l.value)) l.value = p.value.offers.find((o) => o.c === id)!.l
}
const offer = computed(() => dmFindOffer(p.value, c.value, l.value))
const colorName = computed(() => p.value.colors.find((x) => x.id === c.value)?.n || '')
const legName = computed(() => p.value.legs.find((x) => x.id === l.value)?.n || '')

// План сверху, 1 см = 1 единица; стол по центру сцены 220×170
const half = computed(() => (open.value && m.value.ext ? m.value.insert / 2 : 0))
const length = computed(() => (open.value && m.value.ext ? m.value.ext : m.value.l))
const leftPath = computed(() => {
  const { shape, l: L, w: W } = m.value
  const cx = 110
  const top = 85 - W / 2
  if (shape === 'round') return `M${cx} ${top} A${W / 2} ${W / 2} 0 0 0 ${cx} ${top + W} Z`
  return `M${cx} ${top} H${cx - L / 2 + 6} Q${cx - L / 2} ${top} ${cx - L / 2} ${top + 6} V${top + W - 6} Q${cx - L / 2} ${top + W} ${cx - L / 2 + 6} ${top + W} H${cx} Z`
})
const chairs = computed(() => {
  const { l: L, w: W } = m.value
  const hl = length.value / 2
  const top = 85 - W / 2 - 13
  const bottom = 85 + W / 2 + 13
  const out: { x: number; y: number; r: number; on: boolean }[] = []
  // по длинным сторонам: 1–2 сложенным, 2–3 разложенным
  const n = open.value && m.value.ext ? 3 : L >= 115 ? 2 : m.value.shape === 'round' ? 1 : 2
  for (let i = 0; i < 3; i++) {
    const on = i < n
    const span = hl * 2 - 34
    const x = n === 1 ? 110 : 110 - span / 2 + (span / (n - 1)) * Math.min(i, n - 1)
    out.push({ x, y: top, r: 0, on }, { x, y: bottom, r: 180, on })
  }
  out.push({ x: 110 - hl - 13, y: 85, r: -90, on: true }, { x: 110 + hl + 13, y: 85, r: 90, on: true })
  return out
})
const seats = computed(() => chairs.value.filter((x) => x.on).length)

onMounted(() => {
  // Догружаем снимки всех вариантов трёх моделей, чтобы смена была мгновенной
  setTimeout(() => {
    MODELS.forEach((hm) => dmProducts.find((x) => x.id === hm.id)?.offers.forEach((o) => (new Image().src = dmImg(`c/${o.id}.jpg`))))
  }, 1200)
})
</script>

<template>
  <section class="dm-hero" aria-label="Соберите стол">
    <div class="dm-hero__panel">
      <h1 class="dm-hero__title">Мы создаём мебель, а&nbsp;не&nbsp;копируем</h1>
      <p class="dm-hero__lead">Фабрика кухонных и письменных столов и стульев с 1989 года. Соберите стол из наших образцов — так он приедет к вам.</p>

      <div class="dm-hero__models" role="tablist" aria-label="Модель">
        <button
          v-for="(hm, i) in MODELS"
          :key="hm.id"
          type="button"
          role="tab"
          :aria-selected="i === mi"
          class="dm-seg"
          :class="{ 'is-on': i === mi }"
          @click="mi = i"
        >
          {{ hm.label }}
        </button>
      </div>

      <div class="dm-hero__pick">
        <div class="dm-hero__row">
          <span class="dm-hero__label">Столешница <b>{{ dmColorName(colorName) }}</b></span>
          <div class="dm-swrow dm-swrow--big">
            <button
              v-for="o in p.colors"
              :key="o.id"
              type="button"
              class="dm-sw"
              :class="{ 'is-on': o.id === c }"
              :title="o.n"
              :aria-label="`Столешница: ${dmColorName(o.n)}`"
              @click="pickC(o.id)"
            >
              <img :src="dmImg(`sw/${o.sw}`)" alt="" width="44" height="44" />
            </button>
          </div>
        </div>
        <div class="dm-hero__row">
          <span class="dm-hero__label">Ножки <b>{{ legName }}</b></span>
          <div class="dm-swrow dm-swrow--big">
            <button
              v-for="o in p.legs"
              :key="o.id"
              type="button"
              class="dm-sw dm-sw--leg"
              :class="{ 'is-on': o.id === l, 'is-off': !legsFor.has(o.id) }"
              :disabled="!legsFor.has(o.id)"
              :title="legsFor.has(o.id) ? o.n : `${o.n} — не сочетается с этой столешницей`"
              :aria-label="`Ножки: ${o.n}`"
              @click="l = o.id"
            >
              <img :src="dmImg(`sw/${o.sw}`)" alt="" width="44" height="44" />
            </button>
          </div>
        </div>
      </div>

      <div class="dm-hero__cta">
        <NuxtLink :to="{ path: dmPath('/gde-kupit/'), query: { model: p.id } }" class="dm-btn dm-btn--big"><DmIcon name="store" />Где купить</NuxtLink>
        <NuxtLink :to="{ path: dmPath(`/model/${p.id}/`), query: offer !== p.offers[0] ? { v: offer.id } : {} }" class="dm-btn dm-btn--line dm-btn--big">
          Смотреть модель
        </NuxtLink>
      </div>
    </div>

    <div class="dm-hero__stage">
      <div class="dm-hero__photo">
        <img :key="offer.id" :src="dmImg(`c/${offer.id}.jpg`)" :alt="`${p.n}, ${colorName}, ножки ${legName}`" width="1100" height="1100" fetchpriority="high" />
      </div>
      <div class="dm-hero__code">
        <b>{{ p.n }}</b>
        <span>{{ dmCode(colorName) }} · {{ legName }}</span>
      </div>
      <p class="dm-hero__stock"><DmIcon name="box" />Все модели всегда в&nbsp;наличии на&nbsp;складе фабрики</p>

      <div class="dm-plan">
        <div class="dm-plan__head">
          <span>План сверху</span>
          <div v-if="m.ext" class="dm-plan__toggle" role="group" aria-label="Положение стола">
            <button type="button" :class="{ 'is-on': !open }" :aria-pressed="!open" @click="open = false">Сложен</button>
            <button type="button" :class="{ 'is-on': open }" :aria-pressed="open" @click="open = true">Разложен</button>
          </div>
          <span v-else class="dm-plan__fixed">нераскладной</span>
        </div>
        <svg class="dm-plan__svg" viewBox="0 0 220 196" role="img" :aria-label="`${length}×${m.w} см, мест: ${seats}`">
          <g v-for="(ch, i) in chairs" :key="i" class="dm-plan__chair" :class="{ 'is-off': !ch.on }" :style="{ transform: `translate(${ch.x}px, ${ch.y}px) rotate(${ch.r}deg)` }">
            <rect x="-10" y="-8" width="20" height="16" rx="5" />
            <path d="M-8 -9.5 H8" />
          </g>
          <rect class="dm-plan__insert" :x="110 - m.insert / 2" :y="85 - m.w / 2" :width="m.insert" :height="m.w" :style="{ transform: `scaleX(${half ? 1 : 0})` }" />
          <template v-if="m.ext">
            <path class="dm-plan__top" :d="leftPath" :style="{ transform: `translateX(${-half}px)` }" />
            <path class="dm-plan__top" :d="leftPath" :style="{ transform: `translateX(${half}px) scaleX(-1)` }" />
          </template>
          <rect v-else class="dm-plan__top" :x="110 - m.l / 2" :y="85 - m.w / 2" :width="m.l" :height="m.w" rx="6" />
          <g class="dm-plan__dim">
            <path :d="`M${110 - length / 2} ${85 + m.w / 2 + 30} H${110 + length / 2}`" />
            <text x="110" :y="85 + m.w / 2 + 42">{{ length }} см</text>
          </g>
          <text class="dm-plan__w" :x="110 - half - (m.shape === 'round' ? m.w / 4 : m.l / 4)" y="89">{{ m.w }} см</text>
        </svg>
        <p class="dm-plan__note">{{ m.note }}<template v-if="m.ext">: {{ m.l }} → {{ m.ext }} см</template></p>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.dm .dm-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 20px;
  padding: 16px;
  background: var(--dm-surf);
  border-radius: 24px;
  .dm-hero__panel {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 28px 20px 24px 24px;
  }
  .dm-hero__title {
    margin: 0;
    font: 800 clamp(30px, 3.4vw, 50px) / 1.04 var(--dm-head);
    font-stretch: 118%;
    letter-spacing: -0.01em;
    color: var(--dm-ink);
  }
  .dm-hero__lead {
    margin: -6px 0 0;
    max-width: 520px;
    font-size: 17px;
    line-height: 1.5;
    color: var(--dm-muted);
  }
  .dm-hero__models {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .dm-hero__pick {
    display: grid;
    gap: 18px;
    padding: 20px;
    background: #fff;
    border-radius: var(--dm-r2);
  }
  .dm-hero__row {
    display: grid;
    gap: 10px;
  }
  .dm-hero__label {
    font-size: 14px;
    color: var(--dm-muted);
    b {
      margin-left: 4px;
      font-weight: 600;
      color: var(--dm-ink);
    }
  }
  .dm-hero__cta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: auto;
  }
  .dm-hero__stage {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 250px;
    grid-template-rows: auto minmax(0, 1fr);
    grid-template-areas: 'code stock' 'photo plan';
    gap: 12px 18px;
    min-height: 560px;
    padding: 22px;
    background: #fff;
    border-radius: 18px;
  }
  .dm-hero__photo {
    grid-area: photo;
    position: relative;
    min-height: 360px;
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      animation: dm-fade 0.35s ease;
    }
  }
  .dm-hero__code {
    grid-area: code;
    display: grid;
    gap: 2px;
    b {
      font: 800 22px/1.1 var(--dm-head);
      font-stretch: 115%;
      color: var(--dm-ink);
    }
    span {
      font-size: 14px;
      color: var(--dm-muted);
    }
  }
  .dm-hero__stock {
    grid-area: stock;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 13px;
    line-height: 1.35;
    color: var(--dm-ink);
    .dm-icon {
      flex: none;
      width: 20px;
      height: 20px;
      color: var(--dm-or-d);
    }
  }
}
.dm .dm-plan {
  grid-area: plan;
  align-self: end;
  padding: 12px 14px 10px;
  background: var(--dm-surf);
  border-radius: var(--dm-r2);
  .dm-plan__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 600;
    color: var(--dm-ink);
  }
  .dm-plan__toggle {
    display: flex;
    padding: 3px;
    background: #fff;
    border-radius: 999px;
    button {
      padding: 5px 10px;
      border: 0;
      border-radius: 999px;
      background: none;
      font: 500 12px/1 var(--dm-text);
      color: var(--dm-muted);
      cursor: pointer;
      &.is-on {
        background: var(--dm-acc);
        color: #fff;
      }
    }
  }
  .dm-plan__fixed {
    font-weight: 400;
    color: var(--dm-muted);
  }
  .dm-plan__svg {
    display: block;
    width: 100%;
    height: auto;
    margin-top: 4px;
    overflow: visible;
  }
  .dm-plan__chair {
    transition: transform 0.45s ease, opacity 0.3s;
    rect {
      fill: #fff;
      stroke: #9aa1b5;
      stroke-width: 1.4;
    }
    path {
      stroke: #9aa1b5;
      stroke-width: 2.2;
      stroke-linecap: round;
    }
    &.is-off {
      opacity: 0;
    }
  }
  .dm-plan__top {
    fill: #fff;
    stroke: var(--dm-ink);
    stroke-width: 1.6;
    transform-box: view-box;
    transform-origin: 110px 85px;
    transition: transform 0.45s ease;
  }
  .dm-plan__insert {
    fill: var(--dm-soft);
    stroke: var(--dm-or);
    stroke-width: 1.4;
    stroke-dasharray: 3 2;
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.45s ease;
  }
  .dm-plan__dim {
    path {
      stroke: var(--dm-muted);
      stroke-width: 1;
      transition: d 0.45s ease;
    }
    text {
      font: 600 11px var(--dm-text);
      fill: var(--dm-ink);
      text-anchor: middle;
    }
  }
  .dm-plan__w {
    font: 500 10px var(--dm-text);
    fill: var(--dm-muted);
    text-anchor: middle;
  }
  .dm-plan__note {
    margin: 2px 0 0;
    font-size: 12px;
    line-height: 1.35;
    color: var(--dm-muted);
  }
}
@keyframes dm-fade {
  from {
    opacity: 0.4;
  }
}
@media (max-width: 1199px) {
  .dm .dm-hero {
    grid-template-columns: minmax(0, 1fr);
    .dm-hero__stage {
      order: -1;
      min-height: 0;
      grid-template-rows: auto minmax(380px, auto);
    }
    .dm-hero__panel {
      padding: 8px 8px 8px;
    }
    .dm-hero__cta {
      margin-top: 0;
    }
  }
}
@media (max-width: 768px) {
  .dm .dm-hero .dm-hero__stage {
    grid-template-columns: minmax(0, 1fr) 210px;
    grid-template-rows: auto minmax(300px, auto);
    padding: 16px;
  }
}
@media (max-width: 576px) {
  // на телефоне сначала сам конструктор: снимок, образцы, модель, план — девиз ниже
  .dm .dm-hero {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border-radius: 18px;
    .dm-hero__panel,
    .dm-hero__stage {
      display: contents;
    }
    .dm-hero__code {
      order: 1;
      padding: 4px 6px 0;
      b {
        font-size: 20px;
      }
    }
    .dm-hero__photo {
      order: 2;
      min-height: 0;
      aspect-ratio: 1.3;
      border-radius: 14px;
      background: #fff;
      img {
        inset: 6%;
        width: 88%;
        height: 88%;
      }
    }
    .dm-hero__pick {
      order: 3;
      gap: 12px;
      padding: 14px;
    }
    .dm-hero__models {
      order: 4;
    }
    .dm-hero__cta {
      order: 6;
      margin-top: 0;
      .dm-btn {
        flex: 1 1 140px;
      }
    }
    .dm-hero__title {
      order: 0;
      padding: 6px 6px 2px;
      font-size: 27px;
    }
    .dm-hero__lead {
      order: 8;
      margin: 0;
      padding: 0 6px 8px;
    }
    .dm-hero__stock {
      display: none;
    }
    .dm-swrow--big {
      gap: 6px;
      .dm-sw,
      .dm-sw--leg {
        width: 44px;
        height: 44px;
      }
    }
  }
  .dm .dm-plan {
    order: 5;
    display: grid;
    grid-template-columns: 116px minmax(0, 1fr);
    grid-template-areas: 'svg head' 'svg note';
    align-items: center;
    gap: 6px 14px;
    background: #fff;
    .dm-plan__head {
      grid-area: head;
      flex-direction: column;
      align-items: flex-start;
      align-self: end;
    }
    .dm-plan__svg {
      grid-area: svg;
      margin: 0;
    }
    .dm-plan__note {
      grid-area: note;
      align-self: start;
    }
  }
}
</style>
