<script lang="ts" setup>
import MkIcon from '~/components/redesign/mpkchita/MkIcon.vue'

// Сравнение товаров — функция их OpenCart. Цен у оригинала нет, поэтому сравниваем состав, срок годности и фасовку.
useSeoMeta({ title: 'Сравнение — Маккавеевский пищекомбинат | Концепт редизайна' })
const ui = useMpkchitaUi()
const list = computed(() => ui.compare.value.map((id) => mkProduct(id)!).filter(Boolean))
const rows = [
  { key: 'sub', title: 'Раздел' },
  { key: 'comp', title: 'Состав' },
  { key: 'shelf', title: 'Срок годности' },
  { key: 'pack', title: 'Фасовка' },
] as const
const shownRows = computed(() => rows.filter((r) => list.value.some((p) => val(p, r.key) !== '—')))
const val = (p: MkProduct, k: (typeof rows)[number]['key']) => (k === 'sub' ? mkSub(p.sub)?.title : p[k]) || '—'
</script>

<template>
  <div class="mk-wrap mk-compare">
    <nav class="mk-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mkPath('/')">Главная</NuxtLink></span>
    </nav>
    <div class="mk-compare__title">
      <h1 class="mk-page-title">Сравнение</h1>
      <button v-if="list.length" type="button" class="mk-btn mk-btn--line mk-btn--sm" @click="ui.clearCompare()">Очистить</button>
    </div>
    <div v-if="!list.length" class="mk-compare__empty">
      <MkIcon name="compare" :size="36" />
      <p>Добавьте до четырёх продуктов кнопкой «Сравнить» на карточке или странице продукта — сравним состав, срок годности и фасовку.</p>
      <NuxtLink :to="mkPath('/catalog')" class="mk-btn mk-btn--main">Перейти к продукции</NuxtLink>
    </div>
    <div v-else class="mk-compare__scroll">
      <table class="mk-compare__table" :style="{ '--n': list.length }">
        <thead>
          <tr>
            <th />
            <th v-for="p in list" :key="p.id">
              <div class="mk-compare__head">
                <button type="button" class="mk-iconbtn" aria-label="Убрать" @click="ui.toggleCompare(p.id)"><MkIcon name="close" :size="18" /></button>
                <NuxtLink :to="mkPath('/product/' + p.id)">
                  <img :src="mkProductImg(p.id)" :alt="p.name" width="480" height="480" />
                  <b>{{ p.name }}</b>
                </NuxtLink>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in shownRows" :key="r.key">
            <th>{{ r.title }}</th>
            <td v-for="p in list" :key="p.id">{{ val(p, r.key) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
.mk-compare {
  padding-bottom: 72px;
  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  &__empty {
    display: grid;
    justify-items: start;
    gap: 14px;
    max-width: 520px;
    margin-top: 24px;
    padding: 28px;
    border-radius: var(--mk-R);
    background: var(--mk-surface);
    .mk-icon {
      color: var(--mk-red);
    }
  }
  &__scroll {
    margin-top: 24px;
    overflow-x: auto;
  }
  &__table {
    width: calc(140px + var(--n) * 240px);
    min-width: calc(140px + var(--n) * 200px);
    max-width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    th,
    td {
      padding: 14px 12px;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid var(--mk-line);
      font-size: 14px;
    }
    tbody th {
      width: 140px;
      color: var(--mk-muted);
      font-weight: 500;
    }
    thead th:first-child {
      width: 140px;
    }
  }
  &__head {
    position: relative;
    a {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-weight: 700;
      color: var(--mk-ink);
      &:hover {
        color: var(--mk-red);
      }
    }
    img {
      width: 100%;
      max-width: 180px;
      aspect-ratio: 1;
      object-fit: contain;
      border: 1px solid var(--mk-line);
      border-radius: 12px;
    }
    .mk-iconbtn {
      position: absolute;
      top: 4px;
      left: 136px;
      width: 36px;
      height: 36px;
      background: #fff;
      border: 1px solid var(--mk-line);
    }
  }
}
@media (max-width: 576px) {
  .mk-compare__table {
    min-width: calc(110px + var(--n) * 160px);
    tbody th,
    thead th:first-child {
      width: 110px;
    }
  }
  .mk-compare__head .mk-iconbtn {
    left: auto;
    right: 4px;
  }
}
</style>
