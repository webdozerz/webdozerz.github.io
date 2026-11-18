<script lang="ts" setup>
import type { DmProduct } from '~/utils/domoteka'
import { dmExtText, dmImg, dmOfferImg, dmPath, dmSizeText, dmTypeName } from '~/utils/domoteka'
import { dmProducts } from '~/utils/domoteka.data'
import { useDmStore } from '~/composables/useDomoteka'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'

useSeoMeta({ title: 'Сравнение моделей — Домотека | Концепт редизайна' })
const store = useDmStore()
onMounted(store.persist)
const items = computed(() => store.cmp.value.map((id) => dmProducts.find((p) => p.id === id)).filter((p): p is DmProduct => !!p))
const spec = (p: DmProduct, k: string) => p.specs.find(([n]) => n === k)?.[1] || '—'
const rows: [string, (p: DmProduct) => string][] = [
  ['Тип', (p) => dmTypeName(p.type)],
  ['Серия', (p) => p.series],
  ['Размер', (p) => dmSizeText(p) || '—'],
  ['Разложенный', (p) => dmExtText(p) || '—'],
  ['Механизм раскладки', (p) => p.mech || '—'],
  ['Форма', (p) => p.shape || '—'],
  ['Вариантов', (p) => String(p.offers.length)],
  ['Размер упаковки', (p) => spec(p, 'Р-р упаковки')],
  ['Общий вес, кг', (p) => spec(p, 'Общий вес')],
]
const onlyDiff = ref(false)
const shownRows = computed(() => (onlyDiff.value ? rows.filter(([, f]) => new Set(items.value.map(f)).size > 1) : rows))
</script>

<template>
  <div class="dm-wrap dm-cmp">
    <div class="dm-page-head">
      <nav class="dm-crumbs" aria-label="Навигация"><NuxtLink :to="dmPath('/')">Главная</NuxtLink><span>Сравнение</span></nav>
      <div class="dm-cmp__head">
        <h1 class="dm-h1">Сравнение</h1>
        <div v-if="items.length" class="dm-cmp__tools">
          <label class="dm-check"><input v-model="onlyDiff" type="checkbox" /><span>Только различия</span></label>
          <button type="button" class="dm-btn dm-btn--line" @click="store.clear('cmp')"><DmIcon name="trash" />Очистить</button>
        </div>
      </div>
    </div>
    <div v-if="items.length" class="dm-cmp__scroll">
      <table class="dm-cmp__table">
        <thead>
          <tr>
            <th scope="row" class="dm-cmp__corner">{{ items.length }} {{ items.length === 1 ? 'модель' : items.length < 5 ? 'модели' : 'моделей' }}</th>
            <th v-for="p in items" :key="p.id" scope="col">
              <div class="dm-cmp__prod">
                <button type="button" class="dm-cmp__x" :aria-label="`Убрать ${p.n}`" @click="store.toggleCmp(p.id, p.n)"><DmIcon name="close" /></button>
                <NuxtLink :to="dmPath(`/model/${p.id}/`)"><img :src="dmOfferImg(p.offers[0])" :alt="p.n" width="200" height="200" /></NuxtLink>
                <NuxtLink :to="dmPath(`/model/${p.id}/`)" class="dm-cmp__name">{{ p.n }}</NuxtLink>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="[label, f] in shownRows" :key="label">
            <th scope="row">{{ label }}</th>
            <td v-for="p in items" :key="p.id">{{ f(p) }}</td>
          </tr>
          <tr>
            <th scope="row">Цвета</th>
            <td v-for="p in items" :key="p.id">
              <div class="dm-swrow"><img v-for="c in p.colors" :key="c.id" class="dm-cmp__sw" :src="dmImg(`sw/${c.sw}`)" :alt="c.n" :title="c.n" width="24" height="24" /></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="dm-empty dm-cmp__empty">
      <DmIcon name="compare" />
      <b>Нет моделей для сравнения</b>
      <p>Добавьте столы кнопкой «К сравнению» в карточке — сравним размеры, механизм и упаковку в одной таблице.</p>
      <NuxtLink :to="dmPath('/katalog/stoly/')" class="dm-btn">В каталог</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.dm .dm-cmp {
  .dm-cmp__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .dm-cmp__tools {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .dm-cmp__empty {
    margin-top: 24px;
  }
  .dm-cmp__scroll {
    margin-top: 24px;
    overflow-x: auto;
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r2);
  }
  .dm-cmp__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    th,
    td {
      min-width: 190px;
      padding: 12px 14px;
      border-bottom: 1px solid var(--dm-line);
      text-align: left;
      vertical-align: top;
    }
    tbody th,
    .dm-cmp__corner {
      position: sticky;
      left: 0;
      z-index: 1;
      min-width: 150px;
      width: 170px;
      background: var(--dm-surf);
      color: var(--dm-muted);
      font-weight: 500;
    }
    tr:last-child > * {
      border-bottom: 0;
    }
  }
  .dm-cmp__prod {
    position: relative;
    display: grid;
    gap: 8px;
    img {
      width: 140px;
      height: 140px;
      object-fit: contain;
    }
  }
  .dm-cmp__x {
    position: absolute;
    top: 0;
    right: 0;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--dm-line);
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    .dm-icon {
      width: 16px;
      height: 16px;
    }
    &:hover {
      color: var(--dm-acc);
    }
  }
  .dm-cmp__name {
    font: 700 16px/1.25 var(--dm-head);
    text-decoration: none;
    &:hover {
      color: var(--dm-acc);
    }
  }
  .dm-cmp__sw {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    outline: 1px solid rgba(22, 31, 58, 0.15);
    outline-offset: -1px;
  }
}
@media (max-width: 576px) {
  .dm .dm-cmp .dm-cmp__table {
    th,
    td {
      min-width: 136px;
      padding: 10px;
    }
    tbody th,
    .dm-cmp__corner {
      min-width: 92px;
      width: 92px;
      font-size: 13px;
    }
    .dm-cmp__prod img {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
