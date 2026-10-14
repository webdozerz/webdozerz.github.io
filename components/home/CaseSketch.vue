<script setup lang="ts">
// Схематичные эскизы интерфейсов для кейсов. Реальные экраны под NDA,
// поэтому рисуем обезличенные схемы в стиле сайта: только формы, без данных.
import type { SketchKind } from '~/data/profile'

const props = defineProps<{ kind: SketchKind }>()

const labels: Record<SketchKind, string> = {
  terminal: 'Схема торгового терминала: список пар, свечной график, стакан и форма ордера',
  admin: 'Схема админ-панели: меню, карточки показателей, график и таблица заявок',
  exchange: 'Схема обменника: форма обмена с таймером курса и шаги заказа',
  cms: 'Схема многоязычного сайта: переключатель языков и страница в LTR и RTL',
  kit: 'Схема UI-кита: кнопки, поля, переключатели, чипы и таблица',
  tools: 'Схема инструмента: страница ТЗ превращается в задачи на канбан-доске',
}

// Детерминированные «данные» для графиков — чтобы эскиз не менялся между рендерами.
const candles = [52, 58, 55, 62, 60, 66, 63, 59, 64, 70, 68, 74, 71, 77].map((close, i, arr) => {
  const open = i ? arr[i - 1]! : 50
  return { x: 86 + i * 10, open, close, high: Math.max(open, close) + 4, low: Math.min(open, close) - 4 }
})
const y = (v: number) => 128 - (v - 40) * 2.2
const asks = [46, 30, 58, 22, 40, 34]
const bids = [38, 52, 26, 60, 32, 44]
const pairs = [1, 0, 1, 1, 0, 1, 0, 1]
const area = [18, 24, 20, 30, 27, 36, 33, 42, 38, 46, 44, 52]
const areaPoints = area.map((v, i) => `${64 + i * 22.5},${124 - v}`).join(' ')
const kanban = [
  [{ h: 18, accent: true }, { h: 14 }, { h: 14 }],
  [{ h: 14 }, { h: 18 }, { h: 14 }],
  [{ h: 14 }, { h: 14 }],
]

const kind = computed(() => props.kind)
</script>

<template>
  <svg class="sketch" viewBox="0 0 320 200" role="img" :aria-label="labels[kind]">
    <rect class="sk-frame" x="0.5" y="0.5" width="319" height="199" rx="10" />

    <!-- Торговый терминал -->
    <g v-if="kind === 'terminal'">
      <circle v-for="i in 3" :key="i" class="sk-line" :cx="6 + i * 7" cy="10" r="2" />
      <g v-for="(up, i) in pairs" :key="`p${i}`">
        <rect class="sk-line" x="10" :y="28 + i * 20" width="30" height="5" rx="2" />
        <rect class="sk-muted" x="10" :y="36 + i * 20" width="18" height="3" rx="1.5" />
        <rect :class="up ? 'sk-up' : 'sk-down'" x="56" :y="29 + i * 20" width="12" height="4" rx="2" />
      </g>
      <rect class="sk-panel" x="78" y="22" width="152" height="112" rx="6" />
      <g v-for="(c, i) in candles" :key="`c${i}`">
        <line :class="c.close >= c.open ? 'sk-up-stroke' : 'sk-down-stroke'" :x1="c.x + 3" :x2="c.x + 3" :y1="y(c.high)" :y2="y(c.low)" />
        <rect :class="c.close >= c.open ? 'sk-up' : 'sk-down'" :x="c.x" :y="y(Math.max(c.open, c.close))" width="6" :height="Math.max(2, Math.abs(c.close - c.open) * 2.2)" rx="1" />
      </g>
      <rect class="sk-panel" x="78" y="140" width="152" height="52" rx="6" />
      <rect class="sk-input" x="86" y="148" width="64" height="14" rx="3" />
      <rect class="sk-input" x="158" y="148" width="64" height="14" rx="3" />
      <rect class="sk-up" x="86" y="170" width="64" height="14" rx="3" />
      <rect class="sk-down" x="158" y="170" width="64" height="14" rx="3" />
      <rect class="sk-panel" x="238" y="22" width="74" height="170" rx="6" />
      <rect v-for="(w, i) in asks" :key="`a${i}`" class="sk-down sk-soft" :x="306 - w" :y="30 + i * 11" :width="w" height="7" rx="1.5" />
      <rect class="sk-accent" x="246" y="99" width="40" height="6" rx="2" />
      <rect v-for="(w, i) in bids" :key="`b${i}`" class="sk-up sk-soft" :x="306 - w" :y="114 + i * 11" :width="w" height="7" rx="1.5" />
    </g>

    <!-- Админ-панель -->
    <g v-else-if="kind === 'admin'">
      <rect class="sk-panel" x="8" y="8" width="44" height="184" rx="6" />
      <rect class="sk-accent" x="16" y="16" width="16" height="8" rx="2" />
      <rect v-for="i in 6" :key="`n${i}`" :class="i === 2 ? 'sk-accent' : 'sk-line'" x="16" :y="34 + i * 14" width="28" height="5" rx="2" />
      <rect class="sk-input" x="60" y="10" width="110" height="12" rx="3" />
      <g v-for="i in 3" :key="`k${i}`">
        <rect class="sk-panel" :x="60 + (i - 1) * 85" y="30" width="78" height="38" rx="5" />
        <rect class="sk-muted" :x="68 + (i - 1) * 85" y="38" width="30" height="4" rx="2" />
        <rect class="sk-line" :x="68 + (i - 1) * 85" y="48" width="42" height="8" rx="2" />
        <polyline class="sk-accent-stroke" :points="`${110 + (i - 1) * 85},60 ${118 + (i - 1) * 85},54 ${124 + (i - 1) * 85},57 ${132 + (i - 1) * 85},48`" />
      </g>
      <rect class="sk-panel" x="60" y="74" width="248" height="54" rx="5" />
      <polygon class="sk-accent sk-soft" :points="`64,124 ${areaPoints} 311.5,124`" />
      <polyline class="sk-accent-stroke" :points="areaPoints" />
      <rect class="sk-panel" x="60" y="134" width="248" height="58" rx="5" />
      <g v-for="i in 4" :key="`r${i}`">
        <rect class="sk-line" x="68" :y="134 + i * 12" width="46" height="4" rx="2" />
        <rect class="sk-muted" x="130" :y="134 + i * 12" width="60" height="4" rx="2" />
        <rect class="sk-muted" x="204" :y="134 + i * 12" width="34" height="4" rx="2" />
        <rect :class="['sk-up', 'sk-down', 'sk-accent', 'sk-up'][i - 1]" x="262" :y="132 + i * 12" width="32" height="8" rx="4" />
      </g>
    </g>

    <!-- Обменник -->
    <g v-else-if="kind === 'exchange'">
      <rect class="sk-panel" x="16" y="16" width="182" height="168" rx="10" />
      <rect class="sk-line" x="28" y="28" width="70" height="6" rx="3" />
      <rect class="sk-input" x="28" y="44" width="158" height="30" rx="6" />
      <circle class="sk-accent" cx="44" cy="59" r="8" />
      <rect class="sk-line" x="120" y="55" width="56" height="8" rx="2" />
      <circle class="sk-frame" cx="107" cy="84" r="9" />
      <path class="sk-line-stroke" d="M104 81v6m-2.5-2.5L104 87l2.5-2.5M110 87v-6m-2.5 2.5L110 81l2.5 2.5" />
      <rect class="sk-input" x="28" y="94" width="158" height="30" rx="6" />
      <circle class="sk-up" cx="44" cy="109" r="8" />
      <rect class="sk-line" x="128" y="105" width="48" height="8" rx="2" />
      <rect class="sk-muted" x="28" y="136" width="84" height="5" rx="2.5" />
      <circle class="sk-ring" cx="178" cy="138" r="7" />
      <circle class="sk-ring-progress" cx="178" cy="138" r="7" />
      <rect class="sk-accent" x="28" y="152" width="158" height="20" rx="6" />
      <line class="sk-line-stroke" x1="230" x2="230" y1="40" y2="160" />
      <g v-for="i in 4" :key="`s${i}`">
        <circle :class="i < 3 ? 'sk-up' : i === 3 ? 'sk-frame sk-active-ring' : 'sk-frame'" cx="230" :cy="40 + (i - 1) * 40" r="7" />
        <rect :class="i <= 3 ? 'sk-line' : 'sk-muted'" x="246" :y="36 + (i - 1) * 40" width="56" height="5" rx="2.5" />
        <rect class="sk-muted" x="246" :y="45 + (i - 1) * 40" width="34" height="3" rx="1.5" />
      </g>
    </g>

    <!-- Многоязычный сайт на CMS -->
    <g v-else-if="kind === 'cms'">
      <circle v-for="i in 3" :key="i" class="sk-line" :cx="6 + i * 7" cy="10" r="2" />
      <rect class="sk-input" x="40" y="5" width="140" height="10" rx="5" />
      <g v-for="i in 6" :key="`l${i}`">
        <rect :class="i === 4 ? 'sk-accent' : 'sk-input'" :x="8 + (i - 1) * 26" y="24" width="22" height="11" rx="5.5" />
      </g>
      <g v-for="side in [0, 1]" :key="`side${side}`">
        <rect class="sk-panel" :x="8 + side * 156" y="42" width="148" height="150" rx="6" />
        <rect class="sk-line" :x="side ? 304 - 80 : 16" y="52" width="80" height="9" rx="2" />
        <rect class="sk-muted" :x="side ? 304 - 110 : 16" y="66" width="110" height="4" rx="2" />
        <rect class="sk-muted" :x="side ? 304 - 90 : 16" y="74" width="90" height="4" rx="2" />
        <rect class="sk-accent" :x="side ? 304 - 44 : 16" y="84" width="44" height="12" rx="3" />
        <rect v-for="c in 3" :key="`card${c}`" class="sk-input" :x="16 + side * 156 + (c - 1) * 45" y="106" width="41" height="38" rx="4" />
        <rect v-for="t in 4" :key="`t${t}`" class="sk-muted" :x="side ? 304 - (128 - t * 12) : 16" :y="152 + t * 8" :width="128 - t * 12" height="3.5" rx="1.75" />
      </g>
    </g>

    <!-- UI-кит -->
    <g v-else-if="kind === 'kit'">
      <rect class="sk-accent" x="16" y="18" width="62" height="18" rx="5" />
      <rect class="sk-input" x="86" y="18" width="62" height="18" rx="5" />
      <rect class="sk-muted" x="160" y="25" width="40" height="5" rx="2.5" />
      <rect class="sk-muted" x="16" y="48" width="40" height="4" rx="2" />
      <rect class="sk-input" x="16" y="56" width="132" height="18" rx="5" />
      <rect class="sk-input" x="160" y="56" width="70" height="18" rx="5" />
      <path class="sk-line-stroke" d="M216 63l4 4 4-4" />
      <rect class="sk-accent" x="244" y="20" width="30" height="16" rx="8" />
      <circle class="sk-knob" cx="266" cy="28" r="6" />
      <rect class="sk-input" x="282" y="20" width="30" height="16" rx="8" />
      <circle class="sk-line" cx="290" cy="28" r="6" />
      <rect class="sk-accent" x="244" y="56" width="18" height="18" rx="4" />
      <path class="sk-knob-stroke" d="M248 65l3 3 7-7" />
      <rect class="sk-input" x="270" y="56" width="18" height="18" rx="4" />
      <rect v-for="i in 5" :key="`chip${i}`" :class="i === 1 ? 'sk-accent sk-soft' : 'sk-input'" :x="16 + (i - 1) * 58" y="88" width="52" height="14" rx="7" />
      <rect class="sk-panel" x="16" y="114" width="288" height="76" rx="6" />
      <rect v-for="i in 4" :key="`tab${i}`" :class="i === 1 ? 'sk-line' : 'sk-muted'" :x="26 + (i - 1) * 46" y="124" width="36" height="5" rx="2.5" />
      <rect class="sk-accent" x="26" y="133" width="36" height="2" rx="1" />
      <g v-for="r in 3" :key="`row${r}`">
        <rect class="sk-line" x="26" :y="134 + r * 14" width="54" height="4" rx="2" />
        <rect class="sk-muted" x="100" :y="134 + r * 14" width="90" height="4" rx="2" />
        <rect class="sk-muted" x="210" :y="134 + r * 14" width="40" height="4" rx="2" />
        <rect :class="r === 2 ? 'sk-down' : 'sk-up'" x="268" :y="132 + r * 14" width="26" height="8" rx="4" />
      </g>
    </g>

    <!-- Confluence → Jira -->
    <g v-else>
      <rect class="sk-panel" x="14" y="20" width="110" height="160" rx="6" />
      <rect class="sk-line" x="24" y="32" width="70" height="8" rx="2" />
      <rect v-for="t in 9" :key="`d${t}`" :class="t === 4 || t === 7 ? 'sk-line' : 'sk-muted'" x="24" :y="44 + t * 13" :width="t === 4 || t === 7 ? 54 : 90 - (t % 3) * 14" height="4" rx="2" />
      <path class="sk-accent-stroke" d="M134 100h24m-6-6 6 6-6 6" />
      <circle class="sk-accent" cx="146" cy="84" r="3" />
      <rect class="sk-accent sk-soft" x="140" y="114" width="14" height="10" rx="3" />
      <g v-for="(col, ci) in kanban" :key="`col${ci}`">
        <rect class="sk-panel" :x="170 + ci * 48" y="20" width="42" height="160" rx="6" />
        <rect class="sk-muted" :x="176 + ci * 48" y="28" width="24" height="4" rx="2" />
        <rect
          v-for="(card, ri) in col"
          :key="`card${ci}${ri}`"
          :class="card.accent ? 'sk-accent sk-soft' : 'sk-input'"
          :x="175 + ci * 48"
          :y="40 + ri * 30"
          width="32"
          :height="card.h + 8"
          rx="4"
        />
      </g>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.sketch {
  display: block;
  width: 100%;
  height: auto;
}

.sk-frame {
  fill: var(--h-surface);
  stroke: var(--h-line);
}

.sk-panel {
  fill: var(--h-bg);
  stroke: var(--h-line);
}

.sk-input {
  fill: var(--h-raised);
  stroke: var(--h-line-strong);
}

.sk-line {
  fill: var(--h-line-strong);
}

.sk-muted {
  fill: var(--h-line);
}

.sk-accent {
  fill: var(--h-accent);
}

.sk-up {
  fill: var(--h-up);
}

.sk-down {
  fill: var(--h-down);
}

.sk-soft {
  opacity: 0.35;
}

.sk-knob {
  fill: var(--h-bg);
}

.sk-up-stroke,
.sk-down-stroke,
.sk-accent-stroke,
.sk-line-stroke,
.sk-knob-stroke {
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sk-up-stroke {
  stroke: var(--h-up);
}

.sk-down-stroke {
  stroke: var(--h-down);
}

.sk-accent-stroke {
  stroke: var(--h-accent);
}

.sk-line-stroke {
  stroke: var(--h-line-strong);
}

.sk-knob-stroke {
  stroke: var(--h-bg);
}

.sk-ring {
  fill: none;
  stroke: var(--h-line-strong);
  stroke-width: 2;
}

.sk-ring-progress {
  fill: none;
  stroke: var(--h-accent);
  stroke-width: 2;
  stroke-dasharray: 30 44;
  transform: rotate(-90deg);
  transform-origin: 178px 138px;
}

.sk-active-ring {
  stroke: var(--h-accent);
  stroke-width: 2;
}
</style>
