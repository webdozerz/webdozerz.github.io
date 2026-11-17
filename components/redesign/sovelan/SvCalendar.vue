<script lang="ts" setup>
// AH «Календарь праздников»: их сезонные коллекции по ближайшим датам от сегодняшнего дня (Пенза, МСК).
// Ближайший праздник раскрыт: обложка раздела, «до … N дней», первые позиции коллекции. На CMS — поле «дата» у раздела + ~60 строк JS.
import { svCatById, svDateWord, svDays, svImg, svInCat, svMoscowNow, svPath, svPcs, svUpcoming } from '~/utils/sovelan'
import SvIcon from '~/components/redesign/sovelan/SvIcon.vue'

const nowIso = useState('sv-now', () => svMoscowNow().toISOString())
onMounted(() => {
  nowIso.value = svMoscowNow().toISOString()
})
const now = computed(() => new Date(nowIso.value))
const list = computed(() => svUpcoming(now.value))
const pick = ref<string | null>(null)
const active = computed(() => list.value.find((h) => h.id === pick.value) || list.value[0])
const cat = computed(() => svCatById(active.value.cat)!)
const also = computed(() => (active.value.also ? svCatById(active.value.also) : null))
const thumbs = computed(() => svInCat(active.value.cat).slice(0, 3))
const root = ref<HTMLElement | null>(null)
// на телефоне и планшете раскрытый праздник — под лентой: после выбора подтягиваем его в экран
const choose = (id: string) => {
  pick.value = id
  if (window.innerWidth > 989) return
  nextTick(() => root.value?.querySelector('.sv-cal__detail')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))
}
const until = (h: { name: string; days: number }) =>
  h.days === 0 ? 'сегодня' : `${h.days.toLocaleString('ru-RU')} ${svDays(h.days)}`
</script>

<template>
  <section ref="root" class="sv-cal" aria-label="Коллекции к праздникам">
    <div class="sv-cal__track">
      <div class="sv-cal__today">
        <span>Сегодня</span>
        <b>{{ svDateWord(now) }}</b>
      </div>
      <div
        v-for="h in list"
        :key="h.id"
        class="sv-cal__item"
        :class="{ 'is-on': h.id === active.id }"
      >
        <button type="button" class="sv-cal__pick" :aria-pressed="h.id === active.id" @click="choose(h.id)">
          <span class="sv-cal__date">{{ svDateWord(h.date) }}</span>
          <span class="sv-cal__poster"><img :src="svImg(svCatById(h.cat)!.img)" :alt="svCatById(h.cat)!.name" width="260" height="320" /></span>
          <span class="sv-cal__name">{{ h.name }}</span>
          <span class="sv-cal__in">через {{ until(h) }}</span>
        </button>
        <div v-if="h.id === active.id" class="sv-cal__detail">
          <span class="sv-cal__lead">До праздника «{{ h.name }}»</span>
          <b class="sv-cal__count">{{ h.days }}<small>{{ svDays(h.days) }}</small></b>
          <p class="sv-cal__coll">
            Коллекция <NuxtLink :to="svPath(`/katalog/${cat.id}/`)">«{{ cat.name }}»</NuxtLink> — {{ cat.count }} {{ svPcs(cat.count) }}<template v-if="also"
              >, и ещё <NuxtLink :to="svPath(`/katalog/${also.id}/`)">«{{ also.name }}»</NuxtLink> — {{ also.count }}</template
            >
          </p>
          <div class="sv-cal__thumbs">
            <NuxtLink v-for="p in thumbs" :key="p.id" :to="svPath(`/katalog/${cat.id}/`)" :title="p.t">
              <img :src="svImg(p.i)" :alt="p.t" width="300" height="300" loading="lazy" />
            </NuxtLink>
          </div>
          <NuxtLink :to="svPath(`/katalog/${cat.id}/`)" class="sv-btn sv-cal__go">Смотреть коллекцию<SvIcon name="right" /></NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.sv-cal {
  &__track {
    display: flex;
    gap: 14px;
    align-items: stretch;
  }
  &__today {
    flex: 0 0 74px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 2px;
    padding-top: 2px;
    padding-right: 8px;
    border-right: 2px dashed var(--sv-line);
    span {
      font-size: 13px;
      color: var(--sv-muted);
    }
    b {
      font: 800 17px/1.15 var(--sv-head);
      color: var(--sv-acc);
    }
  }
  &__item {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    gap: 18px;
    border-radius: 22px;
    transition: flex-grow 0.35s ease;
    &.is-on {
      flex-grow: 3.6;
      padding: 12px;
      margin: -12px 0;
      background: var(--sv-soft);
    }
  }
  &__pick {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0;
    border: 0;
    background: none;
    text-align: left;
    cursor: pointer;
    color: inherit;
    font: inherit;
    .is-on & {
      flex: 0 0 min(46%, 210px);
    }
  }
  &__date {
    font-size: 13px;
    font-weight: 600;
    color: var(--sv-muted);
    white-space: nowrap;
    .is-on & {
      color: var(--sv-acc);
    }
  }
  &__poster {
    position: relative;
    display: block;
    flex: none;
    aspect-ratio: 260 / 320;
    border-radius: 16px;
    overflow: hidden;
    background: var(--sv-surface);
    outline: 3px solid transparent;
    outline-offset: -3px;
    transition: outline-color 0.2s;
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    .sv-cal__pick:hover & img {
      transform: scale(1.04);
    }
    .is-on & {
      outline-color: var(--sv-acc);
    }
  }
  &__name {
    font: 800 17px/1.2 var(--sv-head);
    color: var(--sv-dark);
  }
  &__in {
    font-size: 13px;
    color: var(--sv-muted);
    white-space: nowrap;
  }
  &__detail {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 22px 6px 6px 0;
  }
  &__lead {
    font-size: 15px;
    color: var(--sv-muted);
  }
  &__count {
    display: flex;
    align-items: baseline;
    gap: 10px;
    font: 800 64px/0.95 var(--sv-head);
    font-variant-numeric: lining-nums tabular-nums;
    color: var(--sv-acc);
    small {
      font-size: 22px;
      color: var(--sv-dark);
    }
  }
  &__coll {
    margin: 0;
    font-size: 15px;
    line-height: 1.45;
    a {
      color: var(--sv-dark);
      font-weight: 700;
      text-decoration: underline;
      text-decoration-color: rgba(177, 43, 93, 0.35);
      text-underline-offset: 3px;
    }
  }
  &__thumbs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 72px));
    gap: 8px;
    width: 100%;
    a {
      position: relative;
      aspect-ratio: 1;
      border-radius: 12px;
      overflow: hidden;
      background: #fff;
      border: 1px solid var(--sv-line);
    }
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__go {
    margin-top: auto;
  }

  @media (max-width: 1199px) {
    &__item.is-on {
      flex-grow: 4.4;
    }
    &__count {
      font-size: 52px;
    }
    &__thumbs a:nth-child(3) {
      display: none;
    }
  }
  // ≤989: постеры лентой с прокруткой, раскрытый праздник — отдельной панелью под лентой
  @media (max-width: 989px) {
    &__track {
      display: grid;
      grid-template-columns: 64px repeat(6, 132px);
      grid-template-rows: auto auto;
      column-gap: 12px;
      row-gap: 18px;
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--sv-line) transparent;
      padding-bottom: 6px;
    }
    &__today {
      grid-row: 1;
      border-right-width: 1px;
    }
    &__item,
    &__item.is-on {
      display: contents;
    }
    &__pick,
    .is-on &__pick {
      grid-row: 1;
      flex: none;
    }
    &__detail {
      grid-row: 2;
      grid-column: 1 / -1;
      position: sticky;
      left: 0;
      width: min(100%, calc(100vw - 48px));
      padding: 18px;
      border-radius: 20px;
      background: var(--sv-soft);
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      grid-template-areas: 'lead thumbs' 'count thumbs' 'coll coll' 'go go';
      align-items: start;
    }
    &__lead {
      grid-area: lead;
    }
    &__count {
      grid-area: count;
    }
    &__coll {
      grid-area: coll;
    }
    &__thumbs {
      grid-area: thumbs;
      width: auto;
      grid-template-columns: repeat(3, 64px);
      a:nth-child(3) {
        display: block;
      }
    }
    &__go {
      grid-area: go;
      margin-top: 4px;
    }
  }
  @media (max-width: 576px) {
    &__track {
      grid-template-columns: 64px repeat(6, 112px);
    }
    &__coll {
      min-height: 4.35em;
    }
    &__detail {
      width: calc(100vw - 32px);
      grid-template-areas: 'lead' 'count' 'coll' 'thumbs' 'go';
      grid-template-columns: minmax(0, 1fr);
    }
    &__count {
      font-size: 46px;
    }
    &__name {
      font-size: 15px;
    }
    &__go {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
