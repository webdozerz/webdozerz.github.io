<script lang="ts" setup>
import { oyImg, oyMoney, oyOrigin, oyPath, oyPrice, oyProduct, oySection, oyShort, oyUnit, oyUnitText } from '~/utils/oyster'
import type { OyProduct } from '~/utils/oyster'
import { useOyShop } from '~/composables/useOyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'

useSeoMeta({ title: 'Сравнение — Oyster Market | Концепт редизайна' })
const shop = useOyShop()
const items = computed(() => shop.cmp.value.map((id) => oyProduct(id)).filter(Boolean) as OyProduct[])
const keys = computed(() => [...new Set(items.value.flatMap((p) => p.props.map((x) => x[0])))].filter((k) => !/страна/i.test(k)).slice(0, 6))
const prop = (p: OyProduct, k: string) => p.props.find((x) => x[0] === k)?.[1] ?? '—'
</script>

<template>
  <div class="oy-wrap oy-page">
    <nav class="oy-crumbs" aria-label="Навигация">
      <NuxtLink :to="oyPath('/')">Главная</NuxtLink>
      <span>Сравнение</span>
    </nav>
    <h1 class="oy-title">Сравнение товаров</h1>
    <div v-if="items.length" class="oy-cmp">
      <table>
        <thead>
          <tr>
            <th />
            <td v-for="p in items" :key="p.id">
              <div class="oy-cmp__head">
                <button type="button" class="oy-cmp__x" aria-label="Убрать из сравнения" @click="shop.toggle('cmp', p.id)"><OyIcon name="close" :size="18" /></button>
                <NuxtLink :to="oyPath(`/product/${p.id}/`)"><img :src="p.img" :alt="p.name" width="160" height="160" /></NuxtLink>
                <NuxtLink :to="oyPath(`/product/${p.id}/`)" class="oy-cmp__name">{{ oyShort(p.name, 60) }}</NuxtLink>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Цена</th>
            <td v-for="p in items" :key="p.id">
              <b v-if="oyPrice(p)">{{ oyMoney(oyPrice(p)!) }}</b> <span v-if="oyPrice(p)" class="oy-unit">{{ oyUnitText(oyUnit(p)) }}</span>
              <span v-else>по запросу</span>
            </td>
          </tr>
          <tr>
            <th>Раздел</th>
            <td v-for="p in items" :key="p.id">{{ oySection(p.sec)?.name }}</td>
          </tr>
          <tr>
            <th>Происхождение</th>
            <td v-for="p in items" :key="p.id">{{ oyOrigin(p) || '—' }}</td>
          </tr>
          <tr>
            <th>Размеры</th>
            <td v-for="p in items" :key="p.id">{{ p.variants?.map((v) => v.name).join(', ') || '—' }}</td>
          </tr>
          <tr v-for="k in keys" :key="k">
            <th>{{ k }}</th>
            <td v-for="p in items" :key="p.id">{{ prop(p, k) }}</td>
          </tr>
          <tr>
            <th>Наличие</th>
            <td v-for="p in items" :key="p.id">{{ p.order ? 'Под заказ' : 'В наличии' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="oy-empty">
      <span class="oy-mask" :style="{ '--m': `url(${oyImg('ic/oyster.png')})` }" />
      <h2>Сравнивать пока нечего</h2>
      <p>Нажмите на значок сравнения на фото товара — например, у двух сортов устриц.</p>
      <NuxtLink :to="oyPath('/catalog/ustritsy/')" class="oy-btn oy-btn--accent">Устрицы</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.oy-cmp {
  overflow-x: auto; margin-top: 20px; border: 1px solid var(--oy-line); border-radius: var(--oy-R);
  table { border-collapse: collapse; min-width: 100%; font-size: 14px; }
  th, td { padding: 12px 16px; border-bottom: 1px solid var(--oy-line); text-align: left; vertical-align: top; }
  th { position: sticky; left: 0; z-index: 1; width: 150px; min-width: 120px; background: var(--oy-surface2); color: var(--oy-muted); font-weight: 500; }
  td { min-width: 190px; color: var(--oy-ink); }
  tr:last-child th, tr:last-child td { border-bottom: 0; }
  &__head { position: relative; display: grid; gap: 8px; img { width: 140px; height: 140px; object-fit: cover; border-radius: 12px; } }
  &__x { position: absolute; left: 112px; top: 6px; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: #fff; color: var(--oy-ink); box-shadow: 0 2px 8px rgba(0, 0, 0, .15); }
  &__name { font-weight: 600; line-height: 1.35; &:hover { color: var(--oy-accent); } }
}
</style>
