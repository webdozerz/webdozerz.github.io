<script lang="ts" setup>
// «Отрез»: их весовая позиция на разделочной доске, нож идёт по куску и прилипает к фасовкам из вариаций «Вес»,
// отрезанная часть светлая, остальное притушено; цена — их ₽/кг × вес. На WooCommerce: вариации товара + ~60 строк JS.
import { olAsset, olCuts, olGrams, olPath, olPrice, olProduct, olRub } from '~/utils/olimpfish'
import { useOlShop, useOlUi } from '~/composables/useOlimpfish'
import OlIcon from './OlIcon.vue'

const shop = useOlShop()
const ui = useOlUi()

const items = olCuts.map((c) => ({ ...c, p: olProduct(c.id)! })).filter((c) => c.p?.w)
const cur = ref(0)
const it = computed(() => items[cur.value])
const grams = computed(() => it.value.p.w!.g)
const max = computed(() => grams.value[grams.value.length - 1])
// стартовый отрез — около половины куска, чтобы сразу было видно, где режем
const startIdx = (gs: number[]) => {
  const half = gs[gs.length - 1] / 2
  let best = 0
  gs.forEach((g, i) => {
    if (Math.abs(g - half) < Math.abs(gs[best] - half)) best = i
  })
  return best
}
const idx = ref(startIdx(grams.value))
const g = computed(() => grams.value[idx.value])
const sum = computed(() => olPrice(it.value.p, g.value))
const pick = (i: number) => {
  cur.value = i
  idx.value = startIdx(grams.value)
}
// доля ширины кадра для веса
const at = (w: number) => it.value.from + (it.value.to - it.value.from) * (w / max.value)
const x = computed(() => at(g.value))

// перетаскивание ножа по доске или по линейке
const board = ref<HTMLElement | null>(null)
const drag = ref(false)
const fromPointer = (e: PointerEvent) => {
  const r = board.value?.getBoundingClientRect()
  if (!r) return
  const f = (e.clientX - r.left) / r.width
  let best = 0
  grams.value.forEach((w, i) => {
    if (Math.abs(at(w) - f) < Math.abs(at(grams.value[best]) - f)) best = i
  })
  idx.value = best
}
const down = (e: PointerEvent) => {
  drag.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  fromPointer(e)
}
const move = (e: PointerEvent) => {
  if (drag.value) fromPointer(e)
}
const up = () => {
  drag.value = false
}
const key = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') idx.value = Math.min(grams.value.length - 1, idx.value + 1)
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') idx.value = Math.max(0, idx.value - 1)
  else return
  e.preventDefault()
}
const inCart = computed(() => shop.qtyOf(it.value.p.id, g.value))
</script>

<template>
  <div class="ol-cut">
    <div class="ol-cut__tabs" role="tablist" aria-label="Что отрезать">
      <button
        v-for="(c, i) in items"
        :key="c.id"
        type="button"
        role="tab"
        :aria-selected="cur === i"
        class="ol-cut__tab"
        :class="{ 'is-on': cur === i }"
        @click="pick(i)"
      >
        {{ c.tab }}
      </button>
    </div>

    <div class="ol-cut__grid">
      <div class="ol-cut__stage" :style="{ '--r': it.ratio }">
        <div
          ref="board"
          class="ol-cut__board"
          :class="{ 'is-drag': drag }"
          @pointerdown="down"
          @pointermove="move"
          @pointerup="up"
          @pointercancel="up"
        >
          <img :key="it.id" :src="olAsset(it.img)" :alt="it.p.n" draggable="false" width="1100" :height="Math.round(1100 / it.ratio)" />
          <div class="ol-cut__veil" :style="{ left: `${x * 100}%` }" />
          <div class="ol-cut__knife" :style="{ left: `${x * 100}%`, top: `${it.top * 100}%`, bottom: `${(1 - it.bottom) * 100}%` }">
            <span class="ol-cut__tag"><OlIcon name="knife" />{{ olGrams(g) }}</span>
          </div>
        </div>
        <div class="ol-cut__ruler">
          <div
            class="ol-cut__track"
            role="slider"
            tabindex="0"
            :aria-valuemin="grams[0]"
            :aria-valuemax="max"
            :aria-valuenow="g"
            :aria-valuetext="olGrams(g)"
            aria-label="Вес отреза"
            @keydown="key"
          >
            <span class="ol-cut__fill" :style="{ width: `${x * 100}%` }" />
            <button
              v-for="(w, i) in grams"
              :key="w"
              type="button"
              tabindex="-1"
              class="ol-cut__mark"
              :class="{ 'is-on': i === idx, 'is-cut': i < idx, 'is-minor': grams.length > 6 && w % 500 !== 0 && i !== idx && i !== 0 }"
              :style="{ left: `${at(w) * 100}%` }"
              @click="idx = i"
            >
              <i />
              <span>{{ olGrams(w) }}</span>
            </button>
          </div>
        </div>
      </div>

      <aside class="ol-cut__check" aria-live="polite">
        <NuxtLink :to="olPath(`/product/${it.p.id}`)" class="ol-cut__name">{{ it.p.n }}</NuxtLink>
        <dl>
          <div><dt>Вес отреза</dt><dd>{{ olGrams(g) }}</dd></div>
          <div><dt>Цена за кг</dt><dd>{{ olRub(it.p.w!.kg) }}</dd></div>
          <div class="ol-cut__sum"><dt>Сумма</dt><dd>{{ olRub(sum) }}</dd></div>
        </dl>
        <p class="ol-cut__note">Товар весовой, итоговая сумма может измениться при формировании заказа на складе.</p>
        <div class="ol-cut__btns">
          <button type="button" class="ol-btn ol-btn--acc" @click="shop.add(it.p, g)">
            {{ inCart ? `В корзине ${inCart} шт · ещё` : 'В корзину' }}
          </button>
          <button type="button" class="ol-btn ol-btn--line" @click="ui.open('quick', it.p.id, g)"><OlIcon name="bolt" />Быстрая покупка</button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.ol .ol-cut {
  background: #fff;
  border: 1px solid var(--ol-line);
  border-radius: 24px;
  padding: 18px 22px 22px;
  &__tabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &__tab {
    flex: none;
    padding: 10px 16px;
    border: 1px solid var(--ol-line);
    border-radius: 10px;
    background: #fff;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    color: var(--ol-ink);
    white-space: nowrap;
    cursor: pointer;
    &:hover,
    &:focus {
      border: 1px solid #c4cddb;
    }
    &.is-on,
    &.is-on:focus {
      background: var(--ol-ink);
      border: 1px solid var(--ol-ink);
      color: #fff;
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 28px;
    align-items: center;
    margin-top: 14px;
  }
  &__stage {
    min-width: 0;
  }
  &__stage {
    --w: min(100%, calc(clamp(220px, 100vh - 580px, 500px) * var(--r)));
  }
  &__board {
    position: relative;
    width: var(--w);
    margin: 34px auto 0;
    aspect-ratio: var(--r);
    cursor: ew-resize;
    touch-action: pan-y;
    user-select: none;
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  &__veil {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgb(255 255 255 / 0.62);
    backdrop-filter: grayscale(0.7);
    transition: left 0.18s ease;
  }
  &__board.is-drag &__veil,
  &__board.is-drag &__knife,
  &__board.is-drag ~ &__ruler &__fill {
    transition: none;
  }
  &__knife {
    position: absolute;
    width: 0;
    border-left: 2px dashed var(--ol-ink);
    transition: left 0.18s ease;
  }
  &__tag {
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(-50%, -100%);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    border-radius: 10px;
    background: var(--ol-ink);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    svg {
      width: 17px;
      height: 17px;
    }
  }
  &__ruler {
    width: var(--w);
    margin: 0 auto;
    padding-top: 18px;
  }
  &__track {
    position: relative;
    height: 46px;
    outline: none;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 8px;
      height: 6px;
      border-radius: 3px;
      background: var(--ol-surf);
    }
    &:focus-visible::before {
      box-shadow: 0 0 0 3px rgb(255 128 0 / 0.35);
    }
  }
  &__fill {
    position: absolute;
    left: 0;
    top: 8px;
    height: 6px;
    border-radius: 3px;
    background: var(--ol-hi);
    transition: width 0.18s ease;
  }
  &__mark {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    display: grid;
    justify-items: center;
    gap: 6px;
    padding: 0 2px;
    border: 0;
    background: none;
    font: inherit;
    cursor: pointer;
    i {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid #c4cddb;
      transition: border-color 0.15s, transform 0.15s;
    }
    span {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--ol-mute);
      white-space: nowrap;
    }
    &.is-cut i {
      border-color: var(--ol-hi);
    }
    &.is-on i {
      border: 6px solid var(--ol-hi);
      transform: scale(1.15);
    }
    &.is-on span {
      color: var(--ol-ink);
    }
    &.is-minor span {
      visibility: hidden;
    }
    &.is-minor i {
      width: 12px;
      height: 12px;
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }
  &__check {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 20px;
    border-radius: 16px;
    background: var(--ol-surf);
    dl {
      margin: 0;
      display: grid;
      gap: 8px;
      > div {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        font-size: 15px;
      }
    }
    dt {
      color: var(--ol-mute);
    }
    dd {
      margin: 0;
      font-weight: 700;
      color: var(--ol-ink);
      font-variant-numeric: tabular-nums;
    }
  }
  &__name {
    font-size: 17px;
    font-weight: 700;
    line-height: 1.3;
    color: var(--ol-ink);
    text-decoration: none;
    &:hover {
      color: var(--ol-acc);
    }
  }
  dl > div.ol-cut__sum {
    align-items: baseline;
    padding-top: 10px;
    border-top: 1px solid var(--ol-line);
    dd {
      font-size: 28px;
      font-weight: 800;
    }
  }
  &__note {
    margin: 0;
    font-size: 12.5px;
    line-height: 1.45;
    color: var(--ol-mute);
  }
  &__btns {
    display: grid;
    gap: 8px;
    .ol-btn {
      width: 100%;
    }
  }
}
@media (max-width: 1199px) {
  .ol .ol-cut__grid {
    grid-template-columns: minmax(0, 1fr) 260px;
    gap: 20px;
  }
}
@media (max-width: 989px) {
  .ol .ol-cut {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
    &__stage {
      --w: min(100%, calc(42vh * var(--r)));
    }
    &__check {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 12px 20px;
      align-items: start;
    }
    &__name,
    &__note {
      grid-column: 1 / -1;
    }
  }
}
@media (max-width: 576px) {
  .ol .ol-cut {
    padding: 12px 12px 14px;
    border-radius: 18px;
    margin-left: -4px;
    margin-right: -4px;
    &__tab {
      padding: 9px 12px;
      font-size: 13px;
    }
    &__stage {
      --w: 100%;
    }
    &__tag {
      font-size: 13px;
      padding: 6px 9px;
    }
    &__ruler {
      padding: 14px 14px 0;
    }
    &__mark span {
      font-size: 11px;
    }
    &__check {
      grid-template-columns: minmax(0, 1fr);
      padding: 16px;
    }
    dl > div.ol-cut__sum dd {
      font-size: 24px;
    }
  }
}
</style>
