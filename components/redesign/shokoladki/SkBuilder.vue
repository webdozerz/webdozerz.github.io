<script lang="ts" setup>
// «Соберите набор» — конструктор оригинала (/collect-the-set/): их коробки Deluxe APRIORI с крышками, 35 конфет
// с их ценами, лента и открытка. Крышка поднимается, конфеты ложатся в ячейки, сумма собирается на глазах.
import { skBoxes, skCells, skCellSize, skCards, skPlural, skRub, SK_RIBBON, SK_CARD, SK_RIBBON_IMG, type SkBox } from '~/utils/shokoladki'
import { skCandies } from '~/utils/shokoladki.data'
import { useSkStore } from '~/composables/useShokoladki'
import SkIcon from './SkIcon.vue'

const props = defineProps<{ full?: boolean; title?: string }>()
const store = useSkStore()

const boxId = ref('q16')
const box = computed<SkBox>(() => skBoxes.find((b) => b.id === boxId.value) || skBoxes[0])
const cells = computed(() => skCells(box.value))
const cellSize = computed(() => skCellSize(box.value))
const filled = ref<string[]>([])
const target = ref<number | null>(null)
const open = ref(false)
const last = ref<string>('')
const ribbonOn = ref(false)
const ribbonText = ref('')
const card = ref('')

const tabs = [
  { id: 'taste', n: 'Наши вкусы' },
  { id: 'hit', n: 'Хиты' },
  { id: 'alpha', n: 'Алфавит' },
  { id: 'draw', n: 'С рисунком' },
]
const tab = ref('taste')
const list = computed(() => skCandies.filter((c) => c.t.includes(tab.value)))
const tabCount = (id: string) => skCandies.filter((c) => c.t.includes(id)).length
const candy = (id: string) => skCandies.find((c) => c.id === id)
// миниатюра Битрикса 146×97 — легче для ячеек и списка
const thumb = (img: string) => img.replace(/\/upload\/iblock\/(\w+)\//, '/upload/resize_cache/iblock/$1/146_97_2/')
const nice = (n: string) => n.replace(/^Конфеты ручной работы\s*/, '').replace(/^\((.*)\)$/, '$1').replace(/^с рисунками\s*\((.*)\)$/, '$1')

const count = computed(() => filled.value.filter(Boolean).length)
const left = computed(() => box.value.cells - count.value)
const candiesSum = computed(() => filled.value.reduce((a, id) => a + (id ? candy(id)?.p || 0 : 0), 0))
const total = computed(() => box.value.p + candiesSum.value + (ribbonOn.value ? SK_RIBBON : 0) + (card.value ? SK_CARD : 0))
const hasLid = computed(() => !!box.value.lid)
const lidShown = computed(() => hasLid.value && !open.value)

const pickBox = (id: string) => {
  const keep = filled.value.filter(Boolean)
  boxId.value = id
  const n = skBoxes.find((b) => b.id === id)?.cells || 0
  filled.value = Array.from({ length: n }, (_, i) => keep[i] || '')
  target.value = null
  open.value = !skBoxes.find((b) => b.id === id)?.lid ? true : open.value
}
const put = (id: string) => {
  open.value = true
  let i = target.value !== null && !filled.value[target.value] ? target.value : filled.value.findIndex((x) => !x)
  if (filled.value.length < box.value.cells) filled.value = Array.from({ length: box.value.cells }, (_, k) => filled.value[k] || '')
  if (i < 0) i = filled.value.findIndex((x) => !x)
  if (i < 0) {
    store.say('Коробка полна! Выберите коробку побольше или уберите конфету')
    return
  }
  const next = [...filled.value]
  next[i] = id
  filled.value = next
  last.value = id
  target.value = null
}
const tapCell = (i: number) => {
  open.value = true
  if (filled.value[i]) {
    const next = [...filled.value]
    next[i] = ''
    filled.value = next
    target.value = i
  } else target.value = target.value === i ? null : i
}
const assorti = () => {
  open.value = true
  const pool = skCandies.filter((c) => c.t.includes('taste'))
  const start = Math.floor(Math.random() * pool.length)
  filled.value = Array.from({ length: box.value.cells }, (_, k) => filled.value[k] || pool[(start + k * 7) % pool.length].id)
  last.value = ''
}
const clear = () => {
  filled.value = Array.from({ length: box.value.cells }, () => '')
  target.value = null
  last.value = ''
}
const toCart = () => {
  if (left.value > 0) return
  store.addSet({ box: box.value.id, candies: filled.value }, ribbonOn.value ? ribbonText.value.trim() : null, card.value || null)
  clear()
  ribbonOn.value = false
  ribbonText.value = ''
  card.value = ''
  open.value = false
}
onMounted(() => {
  filled.value = Array.from({ length: box.value.cells }, () => '')
})
</script>

<template>
  <section class="sk-build" :class="{ 'sk-build--full': full }" aria-label="Соберите набор">
    <div class="sk-build__stage">
      <div class="sk-build__scene" :class="[`is-${box.shape}`, { 'is-open': !lidShown }]">
        <div class="sk-build__tray" :style="{ '--tone': box.tone, '--cell': cellSize * 100 + '%' }">
          <button
            v-for="(c, i) in cells"
            :key="`${box.id}-${i}`"
            type="button"
            class="sk-build__cell"
            :class="{ 'is-full': filled[i], 'is-target': target === i }"
            :style="{ left: c.x * 100 + '%', top: c.y * 100 + '%' }"
            :title="filled[i] ? `${candy(filled[i])?.n} — убрать` : 'Положить сюда'"
            :aria-label="filled[i] ? `Убрать: ${candy(filled[i])?.n}` : `Ячейка ${i + 1}`"
            @click="tapCell(i)"
          >
            <img v-if="filled[i]" :src="thumb(candy(filled[i])?.img || '')" alt="" />
          </button>
        </div>
        <button v-if="hasLid" type="button" class="sk-build__lid" :aria-label="lidShown ? 'Открыть коробку' : 'Закрыть крышку'" @click="open = !open">
          <img :src="box.lid" :alt="`Крышка: ${box.n}`" />
        </button>
        <button v-if="lidShown" type="button" class="sk-build__open" @click="open = true"><SkIcon name="lid" />Открыть коробку</button>
      </div>
      <p class="sk-build__note" aria-live="polite">
        <template v-if="last && candy(last)">
          Положили: <b>{{ candy(last)?.n }}</b> · {{ skRub(candy(last)?.p || 0) }}
        </template>
        <template v-else-if="lidShown">Коробка Deluxe APRIORI — откройте и разложите конфеты</template>
        <template v-else-if="target !== null">Ячейка выбрана — нажмите на конфету</template>
        <template v-else>Нажмите на конфету, чтобы положить её в коробку, на ячейку — чтобы убрать</template>
      </p>
    </div>

    <div class="sk-build__panel">
      <div class="sk-build__head">
        <h1 class="sk-build__title">{{ title || 'Соберите набор' }}</h1>
        <p class="sk-build__lead">Коробка, конфеты ручной работы, лента и открытка — своё ассорти за пару минут.</p>
      </div>

      <div class="sk-build__block">
        <div class="sk-build__label"><span>Коробка</span><small>{{ box.n }} · {{ skRub(box.p) }}</small></div>
        <div class="sk-build__boxes" role="radiogroup" aria-label="Коробка">
          <button v-for="b in skBoxes" :key="b.id" type="button" role="radio" :aria-checked="b.id === boxId" class="sk-build__box" :class="{ 'is-on': b.id === boxId }" @click="pickBox(b.id)">
            <b>{{ b.short }}</b><small>{{ skRub(b.p) }}</small>
          </button>
        </div>
      </div>

      <div class="sk-build__block">
        <div class="sk-build__label">
          <span>Конфеты</span>
          <small>{{ count }} из {{ box.cells }} · {{ skRub(candiesSum) }}</small>
        </div>
        <div class="sk-build__tabs" role="tablist">
          <button v-for="t in tabs" :key="t.id" type="button" role="tab" :aria-selected="tab === t.id" :class="{ 'is-on': tab === t.id }" @click="tab = t.id">
            {{ t.n }} <span>{{ tabCount(t.id) }}</span>
          </button>
        </div>
        <div class="sk-build__candies">
          <button v-for="c in list" :key="c.id" type="button" class="sk-build__candy" :disabled="left <= 0" :title="c.n" @click="put(c.id)">
            <span class="sk-build__candy-img"><img :src="thumb(c.img)" :alt="c.n" loading="lazy" /></span>
            <span class="sk-build__candy-n">{{ nice(c.n) }}</span>
            <b>{{ skRub(c.p) }}</b>
          </button>
        </div>
        <div class="sk-build__tools">
          <button type="button" class="sk-link" @click="assorti"><SkIcon name="shuffle" />Ассорти от шоколатье</button>
          <button v-if="count" type="button" class="sk-link" @click="clear"><SkIcon name="trash" />Высыпать</button>
        </div>
      </div>

      <div class="sk-build__block sk-build__extras">
        <label class="sk-check">
          <input v-model="ribbonOn" type="checkbox" />
          <span><SkIcon name="ribbon" />Лента с вашим текстом <small>+{{ skRub(SK_RIBBON) }}</small></span>
        </label>
        <input v-if="ribbonOn" v-model="ribbonText" class="sk-input" maxlength="40" placeholder="Текст на ленточке, до 40 знаков" />
        <label class="sk-select">
          <span><SkIcon name="card" />Открытка <small>+{{ skRub(SK_CARD) }}</small></span>
          <select v-model="card">
            <option value="">Без открытки</option>
            <option v-for="c in skCards" :key="c.id" :value="c.id">{{ c.n }}</option>
          </select>
        </label>
        <img v-if="full && ribbonOn" class="sk-build__ribbon" :src="SK_RIBBON_IMG" alt="Лента с индивидуальным текстом" />
      </div>

      <div class="sk-build__total">
        <div>
          <small>Итого за набор</small>
          <b>{{ skRub(total) }}</b>
        </div>
        <button type="button" class="sk-btn sk-btn--big" :disabled="left > 0" @click="toCart">
          <template v-if="left > 0">Ещё {{ left }} {{ skPlural(left, 'конфета', 'конфеты', 'конфет') }}</template>
          <template v-else><SkIcon name="cart" />В корзину</template>
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.sk .sk-build {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}
.sk .sk-build__stage {
  position: sticky;
  top: calc(var(--sk-headh) + 16px);
  display: grid;
  gap: 12px;
}
.sk .sk-build__scene {
  position: relative;
  aspect-ratio: 1 / 0.86;
  background: #fff;
  border: 1px solid var(--sk-line);
  border-radius: 24px;
  overflow: hidden;
  &.is-strip {
    aspect-ratio: 1 / 0.86;
  }
}
.sk .sk-build__tray {
  --cell: 15%;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 78%;
  aspect-ratio: 1.12;
  transform: translate(-50%, -50%);
  background:
    radial-gradient(120% 90% at 30% 20%, rgba(255, 255, 255, 0.14), transparent 60%),
    var(--tone);
  box-shadow: inset 0 0 0 10px rgba(0, 0, 0, 0.12), inset 0 0 0 11px rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  transition: opacity 0.3s;
}
.sk .is-square .sk-build__tray {
  aspect-ratio: 1;
  width: 70%;
}
.sk .is-strip .sk-build__tray {
  width: 90%;
  aspect-ratio: 3.38;
  border-radius: 4px;
}
.sk .is-octagon .sk-build__tray {
  aspect-ratio: 1.16;
  clip-path: polygon(13% 0, 87% 0, 100% 15%, 100% 85%, 87% 100%, 13% 100%, 0 85%, 0 15%);
  border-radius: 0;
}
.sk .is-heart .sk-build__tray {
  width: 76%;
  aspect-ratio: 1.02;
  border-radius: 0;
  box-shadow: none;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 96C22 74 2 56 2 31 2 14 15 3 29 3c9 0 17 5 21 13C54 8 62 3 71 3c14 0 27 11 27 28 0 25-20 43-48 65Z'/%3E%3C/svg%3E") center / 100% 100% no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 96C22 74 2 56 2 31 2 14 15 3 29 3c9 0 17 5 21 13C54 8 62 3 71 3c14 0 27 11 27 28 0 25-20 43-48 65Z'/%3E%3C/svg%3E") center / 100% 100% no-repeat;
}
.sk .sk-build__cell {
  position: absolute;
  width: var(--cell);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: repeating-conic-gradient(from 0deg, #f7efe9 0 10deg, #e6d6cc 10deg 20deg);
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.55), 0 2px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  &::after {
    content: '';
    position: absolute;
    inset: 22%;
    border-radius: 50%;
    background: rgba(100, 51, 53, 0.08);
  }
  img {
    position: absolute;
    inset: -12%;
    width: 124%;
    height: 124%;
    object-fit: cover;
    border-radius: 50%;
    animation: sk-drop 0.35s ease-out;
  }
  &.is-full::after {
    display: none;
  }
  &.is-target {
    box-shadow: 0 0 0 3px var(--sk-foil), 0 2px 4px rgba(0, 0, 0, 0.25);
  }
  &:hover {
    transform: translate(-50%, -50%) scale(1.06);
  }
}
@keyframes sk-drop {
  from {
    transform: translateY(-30%) scale(1.25);
    opacity: 0.2;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
.sk .sk-build__lid {
  position: absolute;
  inset: 6%;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  transition: transform 0.6s cubic-bezier(0.3, 0.7, 0.2, 1), opacity 0.6s;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.sk .is-strip .sk-build__lid {
  inset: 0 3%;
}
// Крышка уезжает в угол миниатюрой — нажатие закрывает коробку обратно
.sk .is-open .sk-build__lid {
  transform: translate(41%, -41%) scale(0.16) rotate(8deg);
  opacity: 0.95;
}
.sk .is-strip.is-open .sk-build__lid {
  transform: translate(38%, -42%) scale(0.2) rotate(6deg);
}
.sk .sk-build__open {
  position: absolute;
  left: 50%;
  bottom: 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  transform: translateX(-50%);
  background: var(--sk-acc);
  color: #fff;
  font: 700 15px/1 var(--sk-font);
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    background: var(--sk-acc-dark);
  }
}
.sk .sk-build__note {
  min-height: 2.8em;
  margin: 0;
  padding: 0 4px;
  font-size: 14px;
  color: var(--sk-muted);
  b {
    color: var(--sk-ink);
  }
}
.sk .sk-build__panel {
  display: grid;
  gap: 18px;
  min-width: 0;
}
.sk .sk-build__head {
  display: grid;
  gap: 8px;
}
.sk .sk-build__title {
  margin: 0;
  font: 400 clamp(32px, 3.4vw, 50px) / 1.08 var(--sk-head);
  color: var(--sk-ink);
}
.sk .sk-build__lead {
  margin: 0;
  font-size: 16px;
  color: var(--sk-muted);
  max-width: 44ch;
}
.sk .sk-build__block {
  display: grid;
  gap: 10px;
  min-width: 0;
}
.sk .sk-build__label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  span {
    font-weight: 800;
    font-size: 15px;
  }
  small {
    font-size: 13.5px;
    color: var(--sk-muted);
    font-variant-numeric: tabular-nums;
    text-align: right;
  }
}
.sk .sk-build__boxes {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
}
.sk .sk-build__box {
  display: grid;
  gap: 2px;
  padding: 9px 10px;
  border: 1px solid var(--sk-line);
  border-radius: 12px;
  background: #fff;
  font: inherit;
  text-align: left;
  cursor: pointer;
  b {
    font-size: 13.5px;
    white-space: nowrap;
  }
  small {
    font-size: 12px;
    color: var(--sk-muted);
  }
  &:hover {
    border-color: var(--sk-foil);
  }
  &.is-on {
    border-color: var(--sk-acc);
    box-shadow: inset 0 0 0 1px var(--sk-acc);
    background: var(--sk-soft);
  }
}
.sk .sk-build__tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  button {
    flex: none;
    min-height: 36px;
    padding: 0 14px;
    border: 0;
    border-radius: 999px;
    background: var(--sk-surface);
    color: var(--sk-ink);
    font: 600 14px/1 var(--sk-font);
    cursor: pointer;
    span {
      color: var(--sk-muted);
      font-weight: 500;
    }
    &.is-on {
      background: var(--sk-ink);
      color: #fff;
      span {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}
.sk .sk-build__candies {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 108px;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
  scroll-snap-type: x proximity;
}
.sk--full .sk-build__candies,
.sk .sk-build--full .sk-build__candies {
  grid-auto-flow: row;
  grid-template-rows: none;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  overflow: visible;
}
.sk .sk-build__candy {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 4px;
  padding: 6px 6px 8px;
  border: 1px solid var(--sk-line);
  border-radius: 12px;
  background: #fff;
  font: inherit;
  text-align: left;
  cursor: pointer;
  scroll-snap-align: start;
  b {
    font-size: 13px;
    color: var(--sk-acc);
  }
  &:hover:not(:disabled) {
    border-color: var(--sk-foil);
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
}
.sk .sk-build__candy-img {
  position: relative;
  aspect-ratio: 146 / 97;
  border-radius: 8px;
  overflow: hidden;
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.sk .sk-build__candy-n {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.5em;
  font-size: 12.5px;
  line-height: 1.25;
  font-weight: 600;
}
.sk .sk-build__tools {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 18px;
}
.sk .sk-build__extras {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: 10px 14px;
  .sk-input {
    grid-column: 1 / -1;
    grid-row: 2;
  }
  .sk-select {
    grid-column: 2;
    grid-row: 1;
  }
}
.sk .sk-build__ribbon {
  grid-column: 1 / -1;
  width: 120px;
  border-radius: 10px;
}
.sk .sk-build__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 14px 14px 18px;
  border-radius: 18px;
  background: var(--sk-surface);
  div {
    display: grid;
  }
  small {
    font-size: 13px;
    color: var(--sk-muted);
  }
  b {
    font-size: 26px;
    font-weight: 800;
    color: var(--sk-acc);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .sk-btn {
    min-width: 200px;
  }
}
@media (max-width: 1199px) {
  .sk .sk-build {
    gap: 20px;
  }
  .sk .sk-build__extras {
    grid-template-columns: minmax(0, 1fr);
    .sk-select,
    .sk-input {
      grid-column: 1;
      grid-row: auto;
    }
  }
}
@media (max-width: 989px) {
  .sk .sk-build {
    grid-template-columns: minmax(0, 1fr);
  }
  .sk .sk-build__stage {
    position: static;
    max-width: 620px;
    width: 100%;
    margin: 0 auto;
  }
  .sk .sk-build__head {
    order: -1;
  }
  .sk .sk-build--full .sk-build__candies {
    max-height: none;
  }
}
@media (max-width: 576px) {
  .sk .sk-build__scene {
    border-radius: 18px;
  }
  .sk .sk-build__box {
    padding: 7px 8px;
    b {
      font-size: 12.5px;
    }
  }
  .sk .sk-build__candies {
    grid-auto-columns: 100px;
  }
  .sk .sk-build--full .sk-build__candies {
    grid-template-columns: repeat(auto-fill, minmax(98px, 1fr));
  }
  .sk .sk-build__total {
    flex-wrap: wrap;
    padding: 14px;
    .sk-btn {
      flex: 1 1 100%;
      min-width: 0;
    }
  }
}
</style>
