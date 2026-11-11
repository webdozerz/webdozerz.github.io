<script lang="ts" setup>
import { SR_DATE, SR_TOTAL, SR_XLSX, srAsset, srContacts, srLine, srMatch, srOrigins, srPath, srRub0 } from '~/utils/smolryba'
import { srItems, srSections } from '~/utils/smolryba.data'
import { useSrList } from '~/composables/useSmolryba'
import SrIcon from '~/components/redesign/smolryba/SrIcon.vue'
import SrRow from '~/components/redesign/smolryba/SrRow.vue'

useSeoMeta({ title: `Каталог цен на ${SR_DATE} — Рыбная база, Смоленск | Концепт редизайна` })

const route = useRoute()
const router = useRouter()
const list = useSrList()

const str = (v: unknown) => (typeof v === 'string' ? v : '')
const q = ref(str(route.query.q))
const sec = ref(srSections.some((s) => s.id === route.query.r) ? str(route.query.r) : '')
const origin = ref('')
const sort = ref<'list' | 'cheap' | 'dear'>('list')
const onlyList = ref(false)

// цена для сортировки — за кг; у штучных — за кг по весу фасовки, чтобы банки не вставали среди коробок вперемешку
const perKg = (i: (typeof srItems)[number]) => (i.k === 'piece' && i.tara ? i.p / i.tara : i.p)

const filtered = computed(() => {
  let r = srItems.filter((i) => (!sec.value || i.s === sec.value) && (!origin.value || i.t === origin.value) && srMatch(i, q.value) && (!onlyList.value || list.qty(i.id) > 0))
  if (sort.value === 'cheap') r = [...r].sort((a, b) => perKg(a) - perKg(b))
  if (sort.value === 'dear') r = [...r].sort((a, b) => perKg(b) - perKg(a))
  return r
})
const groups = computed(() =>
  sort.value === 'list'
    ? srSections.map((s) => ({ s, items: filtered.value.filter((i) => i.s === s.id) })).filter((g) => g.items.length)
    : [{ s: null, items: filtered.value }],
)
const countIn = (id: string) => srItems.filter((i) => i.s === id).length

watch([q, sec], () => {
  const query: Record<string, string> = {}
  if (q.value.trim()) query.q = q.value.trim()
  if (sec.value) query.r = sec.value
  router.replace({ query })
})
watch(
  () => route.query,
  (v) => {
    if (str(v.q) !== q.value.trim()) q.value = str(v.q)
    const r = srSections.some((s) => s.id === v.r) ? str(v.r) : ''
    if (r !== sec.value) sec.value = r
  },
)
const reset = () => {
  q.value = ''
  sec.value = ''
  origin.value = ''
  onlyList.value = false
}
</script>

<template>
  <div class="sr-price">
    <div class="sr-wrap sr-price__top">
      <nav class="sr-crumbs" aria-label="Навигация"><NuxtLink :to="srPath('/')">Главная</NuxtLink><span>/</span>Каталог цен</nav>
      <div class="sr-price__head">
        <div>
          <h1>Каталог цен на {{ SR_DATE }}</h1>
          <p>Цена — за килограмм или за штуку, отгрузка коробками. В концепте выборка: {{ srItems.length }} из {{ SR_TOTAL }} позиций, полный прайс — в файле.</p>
        </div>
        <a class="sr-btn sr-btn--line" :href="SR_XLSX" download><SrIcon name="download" />Скачать каталог цен .xlsx</a>
      </div>
    </div>

    <div class="sr-tools">
      <div class="sr-wrap">
        <div class="sr-tools__row">
          <label class="sr-tools__search">
            <SrIcon name="search" />
            <input v-model="q" type="search" placeholder="Поиск по прайсу" aria-label="Поиск по прайсу" />
            <button v-if="q" type="button" aria-label="Очистить" @click="q = ''"><SrIcon name="close" /></button>
          </label>
          <label class="sr-select">
            <select v-model="origin" aria-label="Откуда">
              <option value="">Откуда: все</option>
              <option v-for="o in srOrigins" :key="o" :value="o">{{ o }}</option>
            </select>
            <SrIcon name="down" />
          </label>
          <label class="sr-select">
            <select v-model="sort" aria-label="Порядок">
              <option value="list">По прайсу</option>
              <option value="cheap">Дешевле за кг</option>
              <option value="dear">Дороже за кг</option>
            </select>
            <SrIcon name="sort" />
          </label>
          <button type="button" class="sr-tools__mine" :class="{ 'is-on': onlyList }" :aria-pressed="onlyList" aria-label="Только позиции из списка" @click="onlyList = !onlyList">
            <SrIcon name="list" /><span class="sr-tools__minelabel">В списке</span><b v-if="list.count.value">{{ list.count.value }}</b>
          </button>
        </div>
        <div class="sr-tools__chips">
          <button type="button" :class="{ 'is-on': !sec }" @click="sec = ''">Все разделы</button>
          <button v-for="s in srSections" :key="s.id" type="button" :class="{ 'is-on': sec === s.id }" @click="sec = s.id">{{ s.name }}</button>
        </div>
        <div class="sr-tools__cols" aria-hidden="true"><span>Наименование, тара</span><span>Цена</span><span>В заявку</span></div>
      </div>
    </div>

    <div class="sr-wrap sr-price__body">
      <div class="sr-rows">
        <section v-for="g in groups" :key="g.s?.id || 'all'" class="sr-group">
          <header v-if="g.s" class="sr-group__head">
            <img :src="srAsset(g.s.img)" alt="" width="56" height="56" loading="lazy" />
            <div>
              <h2>{{ g.s.name }}</h2>
              <p>{{ g.items.length }} {{ g.items.length === countIn(g.s.id) ? '' : `из ${countIn(g.s.id)} ` }}в концепте · всего в прайсе {{ g.s.count }}</p>
            </div>
          </header>
          <SrRow v-for="it in g.items" :key="it.id" :item="it" :show-section="!g.s" />
        </section>
        <div v-if="!filtered.length" class="sr-empty">
          <b>Ничего не нашлось</b>
          <p>В выборке концепта такой позиции нет — по полному прайсу подскажет менеджер: <a :href="`tel:${srContacts.phones[0].tel}`">{{ srContacts.phones[0].text }}</a>.</p>
          <button type="button" class="sr-btn sr-btn--line" @click="reset">Сбросить фильтры</button>
        </div>
      </div>

      <aside class="sr-side">
        <div class="sr-side__box">
          <b class="sr-side__t">Список заказа</b>
          <template v-if="list.count.value">
            <ul class="sr-side__list">
              <li v-for="r in list.rows.value.slice(0, 6)" :key="r.it.id">
                <span>{{ r.it.n }}</span><i>{{ srLine(r.it, r.q).approx ? '≈ ' : '' }}{{ srRub0(srLine(r.it, r.q).sum) }}</i>
              </li>
            </ul>
            <p v-if="list.count.value > 6" class="sr-side__more">и ещё {{ list.count.value - 6 }}</p>
            <p class="sr-side__sum">Итого {{ list.total.value.approx ? '≈ ' : '' }}<b>{{ srRub0(list.total.value.sum) }}</b></p>
            <NuxtLink :to="srPath('/spisok/')" class="sr-btn sr-btn--wide">Отправить список</NuxtLink>
          </template>
          <p v-else class="sr-side__empty">Нажмите «В список» у нужных позиций — соберём заявку с суммой для менеджера.</p>
        </div>
        <div class="sr-side__box sr-side__help">
          <p>Скидки от объёма и отсрочка платежа для постоянных клиентов — уточните у менеджера.</p>
          <a :href="`tel:${srContacts.phones[0].tel}`">{{ srContacts.phones[0].text }}</a>
          <span>Пн–Пт 8–17, Сб 9–13</span>
        </div>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.sr-price__top { padding-top: 24px; }
.sr-crumbs { display: flex; gap: 8px; color: var(--sr-mute); font-size: 13px; a:hover { color: var(--sr-acc); } }
.sr-price__head { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 16px 32px; margin: 12px 0 18px;
  h1 { font-size: clamp(30px, 3.4vw, 46px); }
  p { max-width: 640px; margin-top: 8px; color: var(--sr-mute); }
}
.sr-tools { position: sticky; top: var(--sr-hh); z-index: 30; background: #fff; border-bottom: 1px solid var(--sr-line); }
.sr-tools__row { display: flex; gap: 10px; padding-top: 12px; }
.sr-tools__search { display: flex; align-items: center; gap: 10px; flex: 1 1 auto; min-width: 0; height: 46px; padding: 0 6px 0 14px; border: 1.5px solid #b9d9e2; border-radius: var(--sr-r); box-sizing: border-box;
  &:focus-within { border-color: var(--sr-acc); }
  > .sr-icon { color: var(--sr-acc); }
  input { flex: 1; min-width: 0; height: 100%; border: 0; outline: none; background: transparent; font-size: 15px; color: var(--sr-ink); &::-webkit-search-cancel-button { display: none; } }
  button, button:focus { display: grid; place-items: center; width: 34px; height: 34px; padding: 0; border: 0; border-radius: 50%; background: var(--sr-surf); color: var(--sr-mute); }
}
.sr-select { position: relative; flex: 0 0 auto; display: flex;
  select { height: 46px; padding: 0 40px 0 14px; border: 1px solid #cfdfe5; border-radius: var(--sr-r); background: #fff; color: var(--sr-ink); font-size: 15px; appearance: none; -webkit-appearance: none; max-width: 220px; outline: none; &:focus { border-color: var(--sr-acc); } }
  .sr-icon { position: absolute; right: 12px; top: 50%; width: 18px; height: 18px; transform: translateY(-50%); color: var(--sr-acc); pointer-events: none; }
}
.sr .sr-tools__mine, .sr .sr-tools__mine:focus { display: inline-flex; align-items: center; gap: 8px; flex: none; height: 46px; padding: 0 14px; border: 1px solid #cfdfe5; border-radius: var(--sr-r); background: #fff; color: var(--sr-navy); font-weight: 500; white-space: nowrap;
  b { display: grid; place-items: center; min-width: 20px; height: 20px; padding: 0 5px; border-radius: 10px; background: var(--sr-soft); color: var(--sr-acc-d); font-size: 12px; box-sizing: border-box; }
  &.is-on { background: var(--sr-acc); border-color: var(--sr-acc); color: #fff; b { background: #fff; } }
}
.sr-tools__chips { display: flex; gap: 6px; padding: 10px 0; overflow-x: auto; scrollbar-width: thin; scrollbar-color: #c6dbe2 transparent;
  button, button:focus { flex: none; padding: 7px 14px; border: 0; border-radius: 999px; background: var(--sr-surf); color: var(--sr-navy); font: 500 14px/1.2 var(--sr-head); white-space: nowrap;
    &:hover { background: var(--sr-soft); }
    &.is-on { background: var(--sr-acc); color: #fff; }
  }
}
.sr-tools__cols { display: grid; grid-template-columns: minmax(0, 1fr) 190px 156px; gap: 20px; padding: 6px 340px 8px 0; color: var(--sr-mute); font-size: 12px; font-weight: 600; span:nth-child(2) { text-align: right; } span:nth-child(3) { text-align: center; } }
.sr-price__body { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 40px; align-items: start; padding-top: 8px; }
.sr-group { padding-bottom: 20px; }
.sr-group__head { display: flex; align-items: center; gap: 14px; padding: 20px 0 12px;
  img { width: 56px; height: 56px; border-radius: 14px; object-fit: cover; flex: none; }
  h2 { font-size: 24px; }
  p { margin-top: 5px; color: var(--sr-mute); font-size: 13px; }
}
.sr-empty { display: grid; gap: 10px; justify-items: start; padding: 40px 0; b { color: var(--sr-ink); font: 700 22px/1.2 var(--sr-head); } p { color: var(--sr-mute); } a { color: var(--sr-acc); font-weight: 600; } }
.sr-side { position: sticky; top: calc(var(--sr-hh) + 170px); display: grid; gap: 12px; padding-top: 20px; }
.sr-side__box { display: grid; gap: 10px; padding: 20px; border-radius: 18px; background: var(--sr-surf); }
.sr-side__t { color: var(--sr-ink); font: 700 20px/1.2 var(--sr-head); }
.sr .sr-side__list { display: grid; gap: 8px; margin: 0; padding: 0; font-size: 13px;
  li { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; }
  span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--sr-text); }
  i { font-style: normal; color: var(--sr-ink); font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
}
.sr-side__more, .sr-side__empty { color: var(--sr-mute); font-size: 13px; }
.sr-side__sum { display: flex; justify-content: space-between; align-items: baseline; padding-top: 8px; border-top: 1px solid #d3e3e9; b { color: var(--sr-ink); font-size: 19px; font-variant-numeric: tabular-nums; } }
.sr-side__help { background: #fff; border: 1px solid var(--sr-line); font-size: 14px; color: var(--sr-mute);
  a { color: var(--sr-ink); font: 700 18px/1.2 var(--sr-head); }
}

@media (max-width: 1199px) {
  .sr-price__body { grid-template-columns: minmax(0, 1fr); }
  .sr-side { display: none; }
  .sr-tools__cols { padding-right: 0; }
}
@media (max-width: 989px) {
  .sr-tools__row { flex-wrap: wrap; }
  .sr-tools__search { flex-basis: 100%; }
  .sr-select { flex: 1 1 0; min-width: 0; select { width: 100%; max-width: none; } }
  .sr-tools__cols { display: none; }
}
@media (max-width: 768px) {
  .sr-tools { position: static; }
  .sr-tools__chips { scrollbar-width: none; &::-webkit-scrollbar { display: none; } }
  .sr-price__head { margin-bottom: 14px; }
}
@media (max-width: 576px) {
  .sr .sr-tools__mine { padding: 0 12px; }
  .sr-tools__minelabel { display: none; }
  .sr-select select { padding-left: 12px; padding-right: 34px; font-size: 14px; }
  .sr-select .sr-icon { right: 10px; }
}
@media (max-width: 375px) {
  .sr-tools__row { gap: 8px; }
  .sr-select select { padding-left: 10px; font-size: 13px; }
}
</style>
