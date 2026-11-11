<script lang="ts" setup>
// K26 «строка прайса с тарой»: название, откуда и тара; цена с единицей (за кг / за шт) и цена коробки;
// «В список» → счётчик в коробках, штуках, местах или кг. Раскладка от ширины контейнера (лист на главной уже, чем прайс).
import { srLine, srPer, srQtyUnit, srRub, srRub0, srSection, srTara } from '~/utils/smolryba'
import type { SrItem } from '~/utils/smolryba.data'
import { useSrList } from '~/composables/useSmolryba'
import SrIcon from '~/components/redesign/smolryba/SrIcon.vue'

const props = defineProps<{ item: SrItem; showSection?: boolean }>()
const list = useSrList()
const q = computed(() => list.qty(props.item.id))
const line = computed(() => srLine(props.item, q.value || 1))
const unit = computed(() => srQtyUnit(props.item))
const onInput = (e: Event) => {
  const v = parseInt((e.target as HTMLInputElement).value.replace(/\D/g, ''), 10)
  list.set(props.item.id, Number.isFinite(v) ? v : 0)
}
</script>

<template>
  <div class="sr-row" :class="{ 'is-in': q > 0 }">
    <div class="sr-row__name">
      <p class="sr-row__title">
        {{ item.n }}<span v-if="item.nw" class="sr-row__new">Новинка</span>
      </p>
      <p class="sr-row__meta">
        <span v-if="showSection" class="sr-row__sec">{{ srSection(item.s)?.name }}</span>
        <span class="sr-row__tara"><SrIcon :name="item.k === 'box' ? 'box' : item.k === 'weight' ? 'snow' : 'sheet'" />{{ srTara(item) }}</span>
        <span v-if="item.per">{{ item.per }} шт в {{ item.perU }}</span>
        <span v-else-if="item.note && item.k !== 'weight'" class="sr-row__note">{{ item.note }}</span>
      </p>
    </div>
    <div class="sr-row__price">
      <p class="sr-row__p">
        <b>{{ srRub(item.p) }}</b><span class="sr-row__per" :class="{ 'is-pc': item.k === 'piece' }">{{ srPer(item) }}</span>
      </p>
      <p v-if="q > 0" class="sr-row__sum">в списке {{ line.approx ? '≈ ' : '' }}{{ srRub0(line.sum) }}</p>
      <p v-else-if="item.k === 'box'" class="sr-row__sub">коробка {{ srRub0(item.pack!) }}</p>
      <p v-else-if="item.k === 'weight' && item.place" class="sr-row__sub">место ≈ {{ srRub0(item.p * item.place) }}</p>
      <p v-else-if="item.k === 'weight'" class="sr-row__sub">точный вес — при отгрузке</p>
    </div>
    <div class="sr-row__act">
      <button v-if="!q" type="button" class="sr-btn sr-btn--line sr-row__add" @click="list.add(item)">
        <SrIcon name="plus" />В список
      </button>
      <div v-else class="sr-qty" :aria-label="`Количество, ${unit}`">
        <button type="button" aria-label="Меньше" @click="list.set(item.id, q - 1)"><SrIcon name="minus" /></button>
        <label>
          <input :value="q" inputmode="numeric" :style="{ width: String(q).length + 0.6 + 'ch' }" @change="onInput" />
          <span>{{ unit }}</span>
        </label>
        <button type="button" aria-label="Больше" @click="list.set(item.id, q + 1)"><SrIcon name="plus" /></button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.sr .sr-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px 156px;
  gap: 8px 20px;
  align-items: center;
  padding: 14px 0;
  border-top: 1px solid var(--sr-line);
  &__title { color: var(--sr-ink); font-weight: 600; font-size: 15px; line-height: 1.35; }
  &__new { display: inline-block; margin-left: 8px; padding: 1px 8px; border-radius: 6px; background: var(--sr-sun); color: #7a4a00; font-size: 12px; font-weight: 600; vertical-align: 2px; }
  &__meta { display: flex; flex-wrap: wrap; gap: 2px 14px; margin-top: 4px; color: var(--sr-mute); font-size: 13px; line-height: 1.4; }
  &__sec { color: var(--sr-acc); font-weight: 500; }
  &__tara { display: inline-flex; align-items: center; gap: 5px; .sr-icon { width: 15px; height: 15px; color: var(--sr-acc); } }
  &__note { max-width: 100%; overflow-wrap: anywhere; }
  &__price { text-align: right; }
  &__p { display: flex; align-items: baseline; justify-content: flex-end; gap: 6px; white-space: nowrap;
    b { color: var(--sr-ink); font: 700 19px/1.2 var(--sr-head); font-variant-numeric: tabular-nums; }
  }
  &__per { padding: 1px 7px; border-radius: 6px; background: var(--sr-soft); color: var(--sr-acc-d); font-size: 12px; font-weight: 600;
    &.is-pc { background: #fdf0dc; color: #8a5300; }
  }
  &__sub, &__sum { margin-top: 2px; color: var(--sr-mute); font-size: 13px; white-space: nowrap; font-variant-numeric: tabular-nums; }
  &__sum { color: var(--sr-acc-d); font-weight: 600; }
  &__act { display: flex; justify-content: flex-end; }
  &__add { width: 100%; }
}
@container srlist (max-width: 640px) {
  .sr .sr-row {
    grid-template-columns: minmax(0, 1fr) auto;
    &__name { grid-column: 1 / -1; }
    &__price { text-align: left; }
    &__p { justify-content: flex-start; }
    &__act { min-width: 132px; }
  }
}
@container srlist (max-width: 280px) {
  .sr .sr-row {
    grid-template-columns: minmax(0, 1fr);
    &__act { min-width: 0; }
    .sr-qty { width: 100%; justify-content: space-between; }
  }
}
</style>
