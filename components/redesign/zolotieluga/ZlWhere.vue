<script lang="ts" setup>
// «Где купить»: тот же список из 313 магазинов, что у оригинала на каждой карточке, — город, поиск по адресу,
// список и карта. Карта — Leaflet с подложкой OpenStreetMap: место держит обёртка с фоном, так что при
// заблокированной карте список и ссылки «Открыть в Яндекс Картах» остаются.
import ZlIcon from './ZlIcon.vue'

const props = withDefaults(defineProps<{ title?: string; compact?: boolean }>(), { title: '', compact: false })
const ui = useZolotielugaUi()
const q = ref('')
const active = ref(-1)
const mapEl = ref<HTMLElement | null>(null)
const listEl = ref<HTMLElement | null>(null)
const mapState = ref<'loading' | 'ok' | 'fail'>('loading')

const stores = computed(() => zlStores.map((s, i) => ({ i, city: s[0], name: zlStoreName(s[1]), address: s[2], lat: s[3], lon: s[4] })))
const inCity = computed(() => stores.value.filter((s) => s.city === ui.city.value))
const shown = computed(() => {
  const t = q.value.trim().toLowerCase()
  return t ? inCity.value.filter((s) => (s.name + ' ' + s.address).toLowerCase().includes(t)) : inCity.value
})
const cityIn = computed(() => zlCityIn[zlCities[ui.city.value]])
const yandex = (s: { lat: number; lon: number; address: string }) =>
  `https://yandex.ru/maps/?pt=${s.lon},${s.lat}&z=17&l=map&text=${encodeURIComponent(zlCities[ui.city.value] + ', ' + s.address)}`

/* Leaflet */
type LMap = any
let L: any = null
let map: LMap = null
let layer: any = null
const markers = new Map<number, any>()

const loadLeaflet = () =>
  new Promise<any>((resolve, reject) => {
    const w = window as any
    if (w.L) return resolve(w.L)
    if (!document.querySelector('link[data-zl-leaflet]')) {
      const css = document.createElement('link')
      css.rel = 'stylesheet'
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      css.dataset.zlLeaflet = '1'
      document.head.appendChild(css)
    }
    let s = document.querySelector<HTMLScriptElement>('script[data-zl-leaflet]')
    if (!s) {
      s = document.createElement('script')
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      s.dataset.zlLeaflet = '1'
      document.head.appendChild(s)
    }
    s.addEventListener('load', () => resolve(w.L))
    s.addEventListener('error', reject)
    setTimeout(() => (w.L ? resolve(w.L) : reject(new Error('timeout'))), 12000)
  })

const popup = (s: { name: string; address: string; lat: number; lon: number }) =>
  `<b>${s.name}</b><br>${s.address}<br><a href="${yandex(s)}" target="_blank" rel="noopener">Открыть в Яндекс Картах</a>`

const draw = () => {
  if (!map || !L) return
  layer?.clearLayers()
  markers.clear()
  const pts = shown.value
  pts.forEach((s) => {
    const m = L.circleMarker([s.lat, s.lon], { radius: 7, color: '#fff', weight: 2, fillColor: '#c92315', fillOpacity: 1 })
      .bindPopup(popup(s))
      .on('click', () => {
        active.value = s.i
        listEl.value?.querySelector(`[data-store="${s.i}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      })
    layer.addLayer(m)
    markers.set(s.i, m)
  })
  if (pts.length === 1) map.setView([pts[0].lat, pts[0].lon], 15)
  else if (pts.length) map.fitBounds(L.latLngBounds(pts.map((s) => [s.lat, s.lon])), { padding: [28, 28], maxZoom: 15 })
}
const focus = (s: { i: number; lat: number; lon: number }) => {
  active.value = s.i
  if (map) {
    map.setView([s.lat, s.lon], 16)
    markers.get(s.i)?.openPopup()
  }
}

onMounted(async () => {
  try {
    L = await loadLeaflet()
    if (!mapEl.value) return
    map = L.map(mapEl.value, { scrollWheelZoom: false, attributionControl: true })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)
    layer = L.layerGroup().addTo(map)
    mapState.value = 'ok'
    draw()
  } catch {
    mapState.value = 'fail'
  }
})
onBeforeUnmount(() => map?.remove())
watch([() => ui.city.value, q], () => {
  active.value = -1
  draw()
})
</script>

<template>
  <div class="zl-where" :class="{ 'is-compact': compact }">
    <div class="zl-where__top">
      <h2 v-if="title">{{ title }} в {{ cityIn }}</h2>
      <div class="zl-tabs zl-where__cities" role="tablist" aria-label="Город">
        <button
          v-for="(c, i) in zlCities"
          :key="c"
          type="button"
          role="tab"
          :aria-selected="i === ui.city.value"
          :class="{ 'is-on': i === ui.city.value }"
          @click="ui.setCity(i)"
        >
          {{ c }} <small>{{ zlStoreCount(i) }}</small>
        </button>
      </div>
    </div>
    <div class="zl-where__grid">
      <div class="zl-where__side">
        <label class="zl-where__search">
          <ZlIcon name="search" :size="18" />
          <input v-model="q" type="search" :placeholder="'Улица или магазин в ' + cityIn" aria-label="Поиск магазина" />
        </label>
        <p class="zl-where__count">
          {{ zlPlural(shown.length, 'магазин', 'магазина', 'магазинов') }}<template v-if="q"> по запросу «{{ q }}»</template>
        </p>
        <ul ref="listEl" class="zl-where__list">
          <li v-for="s in shown" :key="s.i" :data-store="s.i" :class="{ 'is-on': s.i === active }">
            <button type="button" @click="focus(s)">
              <ZlIcon name="store" :size="18" />
              <span
                ><b>{{ s.address }}</b><small>{{ s.name }}</small></span
              >
            </button>
            <a :href="yandex(s)" target="_blank" rel="noopener" class="zl-where__ya" :aria-label="'Открыть ' + s.address + ' в Яндекс Картах'"
              ><ZlIcon name="external" :size="16"
            /></a>
          </li>
          <li v-if="!shown.length" class="zl-where__empty">Не нашли такой адрес. Попробуйте название улицы без номера дома.</li>
        </ul>
      </div>
      <div class="zl-where__map">
        <div class="zl-where__placeholder">
          <ZlIcon name="pin" :size="28" />
          <span v-if="mapState === 'fail'">Карта не загрузилась — адреса слева, у каждого ссылка на Яндекс Карты.</span>
          <span v-else>Загружаем карту {{ cityIn }}…</span>
        </div>
        <div ref="mapEl" class="zl-where__leaflet" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.zl-where {
  &__top {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
    h2 {
      font-size: clamp(24px, 2.4vw, 32px);
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
    gap: 16px;
    height: 560px;
  }
  &.is-compact &__grid {
    height: 480px;
  }
  &__side {
    display: flex;
    flex-direction: column;
    min-height: 0;
    border: 1px solid var(--zl-line);
    border-radius: var(--zl-R);
    padding: 14px;
    background: #fff;
  }
  &__search {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 46px;
    padding: 0 12px;
    border: 1px solid var(--zl-line);
    border-radius: var(--zl-r);
    color: var(--zl-muted);
    &:focus-within {
      border-color: var(--zl-accent);
    }
    input {
      flex: 1;
      width: 0;
      min-width: 0;
      border: 0;
      outline: 0;
      background: none;
      font-size: 15px;
    }
  }
  &__count {
    margin: 10px 4px 6px;
    font-size: 13px;
    color: var(--zl-muted);
  }
  ul.zl-where__list {
    flex: 1;
    min-height: 0;
    overflow: auto;
    margin: 0 -6px;
    padding: 0 6px;
    scrollbar-width: thin;
    scrollbar-color: #e2c9c5 transparent;
    li {
      display: flex;
      align-items: center;
      border-radius: 10px;
      &:hover,
      &.is-on {
        background: var(--zl-surface);
      }
      &.is-on .zl-icon {
        color: var(--zl-accent);
      }
    }
    button {
      flex: 1;
      min-width: 0;
      display: flex;
      gap: 10px;
      padding: 9px 8px;
      text-align: left;
      .zl-icon {
        margin-top: 2px;
        color: var(--zl-muted);
      }
      span {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      b {
        font-weight: 600;
        color: var(--zl-ink);
      }
      small {
        font-size: 13px;
        color: var(--zl-muted);
      }
    }
  }
  &__ya {
    flex: none;
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: var(--zl-muted);
    &:hover {
      color: var(--zl-accent);
      background: #fff;
    }
  }
  ul.zl-where__list li.zl-where__empty {
    padding: 12px 8px;
    color: var(--zl-muted);
    font-size: 14px;
  }
  &__map {
    position: relative;
    border-radius: var(--zl-R);
    overflow: hidden;
    background: var(--zl-surface);
    min-height: 0;
  }
  &__placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 24px;
    text-align: center;
    color: var(--zl-muted);
    .zl-icon {
      color: var(--zl-accent);
    }
  }
  &__leaflet {
    position: absolute;
    inset: 0;
    z-index: 1;
    &:not(.leaflet-container) {
      pointer-events: none;
    }
    .leaflet-popup-content {
      font: 14px/1.45 'Golos Text', system-ui, sans-serif;
      color: #3d2f2d;
      a {
        color: #c92315;
        font-weight: 600;
      }
    }
    .leaflet-popup-content-wrapper {
      border-radius: 12px;
    }
  }
}
@media (max-width: 989px) {
  .zl-where__grid,
  .zl-where.is-compact .zl-where__grid {
    grid-template-columns: minmax(0, 1fr);
    height: auto;
  }
  .zl-where__map {
    order: -1;
    height: 340px;
  }
  .zl-where__side {
    height: 420px;
  }
}
@media (max-width: 576px) {
  .zl-where__map {
    height: 280px;
  }
  .zl-where__side {
    padding: 10px;
  }
}
</style>
