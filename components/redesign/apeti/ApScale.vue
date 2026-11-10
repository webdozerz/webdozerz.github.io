<script lang="ts" setup>
import { apAsset, apMoney, apNum, apPath, apProduct, apScaleItems, apServices } from '~/utils/apeti'
import type { ApProduct } from '~/utils/apetiData'
import { useApShop } from '~/composables/useApeti'
import ApIcon from '~/components/redesign/apeti/ApIcon.vue'

// «Весы с рынка»: товар на чаше, стрелка идёт по шкале шагом порции, сумма считается на глазах.
// На Битриксе: 4 товара в настройках блока + этот скрипт; шкала — один SVG.
const shop = useApShop()
const TICKS = 8
const items = apScaleItems.map((x) => ({ ...x, p: apProduct(x.id) as ApProduct })).filter((x) => x.p)
const cur = ref(0)
const n = ref(2)
const svc = ref(false)
const it = computed(() => items[cur.value])
const p = computed(() => it.value.p)
const weight = computed(() => n.value * p.value.q)
const sum = computed(() => Math.round(p.value.p * n.value * 100) / 100)
const angle = computed(() => -90 + (n.value / TICKS) * 180)
const service = computed(() => (p.value.v ? apServices[p.value.v] : null))

const choose = (i: number) => {
  cur.value = i
  n.value = 2
  svc.value = false
}
const step = (d: number) => {
  n.value = Math.min(TICKS, Math.max(1, n.value + d))
}
const ticks = computed(() =>
  Array.from({ length: TICKS + 1 }, (_, i) => {
    const a = ((-180 + (i / TICKS) * 180) * Math.PI) / 180
    const major = i % 2 === 0
    const r1 = major ? 100 : 106
    return {
      i,
      major,
      x1: 160 + Math.cos(a) * r1,
      y1: 168 + Math.sin(a) * r1,
      x2: 160 + Math.cos(a) * 116,
      y2: 168 + Math.sin(a) * 116,
      tx: 160 + Math.cos(a) * 84,
      ty: 168 + Math.sin(a) * 84 + 4,
      label: apNum(i * p.value.q),
    }
  }),
)
const add = () => shop.add(p.value, n.value, svc.value)
</script>

<template>
  <div class="ap-scale">
    <div class="ap-scale__left">
      <slot />
      <div class="ap-scale__pick" role="tablist" aria-label="Что взвесить">
      <button v-for="(x, i) in items" :key="x.id" type="button" role="tab" :aria-selected="i === cur" :class="{ 'is-on': i === cur }" @click="choose(i)">
        <img :src="apAsset(x.img)" alt="" width="56" height="56" />
        <span>
          <b>{{ x.short }}</b>
          <small>{{ apMoney(x.p.r) }}/кг</small>
        </span>
      </button>
      </div>
    </div>

    <div class="ap-scale__device">
      <div class="ap-scale__pan">
        <Transition name="ap-pan" mode="out-in">
          <img :key="it.id" :src="apAsset(it.img)" :alt="p.n" width="600" height="600" />
        </Transition>
      </div>
      <div class="ap-scale__dialwrap">
        <button type="button" class="ap-scale__step" aria-label="Меньше" :disabled="n <= 1" @click="step(-1)">−</button>
        <svg class="ap-scale__dial" viewBox="0 0 320 180" role="img" :aria-label="`На весах ${apNum(weight)} кг`">
          <path class="ap-scale__body" d="M22 176 A138 138 0 0 1 298 176 Z" />
          <path class="ap-scale__arc" d="M44 168 A116 116 0 0 1 276 168" />
          <g v-for="t in ticks" :key="t.i">
            <line :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2" :class="{ 'is-major': t.major, 'is-past': t.i <= n }" />
            <text v-if="t.major" :x="t.tx" :y="t.ty" text-anchor="middle">{{ t.label }}</text>
          </g>
          <g class="ap-scale__needle" :style="{ transform: `rotate(${angle}deg)` }">
            <path d="M160 168 L156 152 L160 102 L164 152 Z" />
          </g>
          <circle cx="160" cy="168" r="9" class="ap-scale__hub" />
        </svg>
        <button type="button" class="ap-scale__step" aria-label="Больше" :disabled="n >= TICKS" @click="step(1)">+</button>
      </div>
      <p class="ap-scale__read"><b>{{ apNum(weight) }}</b> кг</p>
    </div>

    <div class="ap-scale__bill">
      <p class="ap-scale__label">На весах</p>
      <NuxtLink :to="apPath(`/product/${p.id}`)" class="ap-scale__name">{{ p.n }}</NuxtLink>
      <dl class="ap-scale__rows">
        <div><dt>Цена</dt><dd>{{ apMoney(p.r) }} за кг</dd></div>
        <div><dt>Шаг</dt><dd>{{ apNum(p.q) }} кг</dd></div>
        <div><dt>Вес</dt><dd>{{ apNum(weight) }} кг</dd></div>
      </dl>
      <label v-if="service" class="ap-check ap-scale__svc">
        <input v-model="svc" type="checkbox" />
        <span>{{ service.text }}</span>
      </label>
      <div class="ap-scale__sum">
        <span>Сумма</span>
        <b>{{ apMoney(sum) }}</b>
      </div>
      <button type="button" class="ap-btn ap-btn--big" @click="add"><ApIcon name="cart" />В корзину</button>
      <p class="ap-scale__note">Сумма может немного измениться при контрольном взвешивании</p>
    </div>
  </div>
</template>

<style lang="scss">
.ap .ap-scale {
  display: grid; grid-template-columns: minmax(300px, 420px) minmax(0, 1fr) minmax(260px, 320px); gap: 28px; align-items: center;

  &__left { display: grid; grid-template-columns: minmax(0, 1fr); gap: 22px; align-content: center; min-width: 0; }

  &__pick { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;
    button, button:focus { display: flex; align-items: center; gap: 10px; padding: 8px 10px 8px 8px; border: 1px solid var(--ap-line); border-radius: var(--ap-r); background: rgba(255, 255, 255, .55); text-align: left; cursor: pointer; min-width: 0; transition: background-color .15s, border-color .15s;
      &:hover { background: rgba(255, 255, 255, .6); }
      &.is-on, &.is-on:focus { background: #fff; border-color: var(--ap-acc); }
    }
    img { width: 48px; height: 48px; border-radius: 50%; background: #fff; object-fit: cover; flex: none; }
    span { display: grid; gap: 2px; min-width: 0; }
    b { font-family: var(--ap-head); font-size: 17px; font-weight: 600; line-height: 1.15; }
    small { font-size: 13px; color: var(--ap-mute); white-space: nowrap; }
  }

  &__device { display: grid; justify-items: center; min-width: 0; }
  &__pan { position: relative; z-index: 1; width: min(100%, 300px); aspect-ratio: 1; margin-bottom: -30px; border-radius: 50%; background: #fff; box-shadow: 0 2px 0 #dfe4d2, 0 22px 40px -22px rgba(40, 52, 10, .45); overflow: hidden;
    img { position: absolute; inset: 9%; width: 82%; height: 82%; object-fit: contain; }
  }
  &__dialwrap { display: grid; grid-template-columns: 44px minmax(0, 320px) 44px; gap: 10px; align-items: end; width: min(100%, 430px); }
  &__dial { display: block; width: 100%; height: auto; overflow: visible;
    text { font: 600 12px var(--ap-text); fill: var(--ap-mute); font-variant-numeric: tabular-nums; }
    line { stroke: #c6cdb3; stroke-width: 2; stroke-linecap: round; transition: stroke .2s;
      &.is-major { stroke-width: 3; }
      &.is-past { stroke: var(--ap-acc); }
    }
  }
  &__body { fill: #fff; stroke: var(--ap-line); stroke-width: 1.5; }
  &__arc { fill: none; stroke: #eef1e4; stroke-width: 10; }
  &__needle { transform-box: view-box; transform-origin: 160px 168px; transition: transform .45s cubic-bezier(.3, 1.4, .5, 1);
    path { fill: var(--ap-or); }
  }
  &__hub { fill: var(--ap-ink); }
  &__step, &__step:focus { width: 44px; height: 44px; margin-bottom: 4px; border: 1px solid var(--ap-line); border-radius: 50%; background: #fff; color: var(--ap-ink); font-size: 24px; line-height: 1; cursor: pointer;
    &:hover:not(:disabled) { border-color: var(--ap-acc); color: var(--ap-acc); }
    &:disabled { opacity: .4; cursor: default; }
  }
  &__read { margin-top: 10px; font-size: 15px; color: var(--ap-mute);
    b { font-family: var(--ap-head); font-size: 34px; font-weight: 600; color: var(--ap-ink); font-variant-numeric: tabular-nums; }
  }

  &__bill { display: grid; gap: 12px; align-content: start; padding: 22px; border-radius: var(--ap-R); background: #fff; border: 1px solid var(--ap-line); min-width: 0; }
  &__label { font-size: 13px; color: var(--ap-mute); }
  &__name { font-family: var(--ap-head); font-size: 20px; font-weight: 600; line-height: 1.2; min-height: 2.4em; &:hover { color: var(--ap-acc); } }
  &__rows { display: grid; gap: 6px; margin: 0; font-size: 14px;
    div { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 6px; border-bottom: 1px dashed var(--ap-line); }
    dt { color: var(--ap-mute); }
    dd { margin: 0; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
  }
  &__svc { font-size: 14px; }
  &__sum { display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
    span { font-size: 14px; color: var(--ap-mute); }
    b { font-family: var(--ap-head); font-size: 32px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
  }
  &__note { font-size: 12px; line-height: 1.4; color: var(--ap-mute); }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
    &__left { grid-column: 1 / -1; }
    &__pick { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }
  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr); gap: 18px;
    &__pick { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    &__left { display: contents; }
    &__pick { order: 2; }
    &__device { order: 1; }
    &__bill { order: 3; }
    &__pick button { padding: 6px 8px 6px 6px; gap: 8px; }
    &__pick img { width: 40px; height: 40px; }
    &__left { gap: 16px; }
    &__pick b { font-size: 15px; }
    &__pan { width: min(72%, 280px); }
    &__name { min-height: 0; }
  }
  @media (max-width: 375px) {
    &__dialwrap { grid-template-columns: 40px minmax(0, 1fr) 40px; gap: 6px; }
    &__step, &__step:focus { width: 40px; height: 40px; }
    &__bill { padding: 16px; }
    &__sum b { font-size: 28px; }
  }
}
.ap-pan-enter-active, .ap-pan-leave-active { transition: opacity .18s, transform .18s; }
.ap-pan-enter-from { opacity: 0; transform: translateY(-10px); }
.ap-pan-leave-to { opacity: 0; transform: translateY(6px); }
</style>
