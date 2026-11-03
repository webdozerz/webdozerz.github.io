<script lang="ts" setup>
// Сравнение товаров — как /magazin/compare у оригинала: фото, цена, вес, возраст, время приготовления, наличие.
import IzIcon from '~/components/redesign/izyumovskoe/IzIcon.vue'

useSeoMeta({ title: 'Сравнение — Изюмовское | Концепт редизайна' })

const cart = useIzyumCart()
const ui = useIzyumUi()
const list = computed(() => cart.compare.value.map((id) => izProduct(id)).filter(Boolean) as IzProduct[])
const rows: { label: string; get: (p: IzProduct) => string }[] = [
  { label: 'Цена', get: (p) => izPriceText(p) },
  {
    label: 'За тушку',
    get: (p) => {
      const r = izPerCarcass(p)
      return r ? `≈ ${izMoney(r[0])}–${izMoney(r[1])}` : '—'
    },
  },
  { label: 'Вес тушки', get: (p) => (p.weight ? `${p.weight[0].toLocaleString('ru-RU')}–${p.weight[1].toLocaleString('ru-RU')} кг` : '—') },
  { label: 'Возраст', get: (p) => p.age ?? '—' },
  { label: 'Готовить', get: (p) => p.cook ?? '—' },
  { label: 'Взрослая птица', get: (p) => p.adult ?? '—' },
  { label: 'Минимум', get: (p) => (p.unit === 'гол.' ? `${p.min} голов` : '1 ' + (p.weight ? 'тушка' : 'кг')) },
  { label: 'Как получить', get: (p) => (p.section === 'molodnyak' ? 'самовывоз' : 'доставка, встреча, самовывоз') },
  { label: 'Наличие', get: (p) => (p.stock ? 'в наличии' : 'нет в наличии') },
]
const add = (p: IzProduct) => {
  cart.add(p)
  ui.toast.value = `${p.title} — в корзине`
}
</script>

<template>
  <div class="iz-wrap">
    <nav class="iz-crumbs" aria-label="Путь">
      <NuxtLink :to="izPath()">Главная</NuxtLink>
      <span>Сравнение</span>
    </nav>
    <h1 class="iz-page-title">
      Сравнение <small>{{ list.length }}</small>
    </h1>

    <div v-if="!list.length" class="iz-empty">
      <b>Пока нечего сравнивать</b>
      <p>Нажмите на значок весов на карточке товара — например, чтобы выбрать между породами утят.</p>
      <div>
        <NuxtLink :to="izPath('/catalog/molodnyak')" class="iz-btn iz-btn--main">Молодняк</NuxtLink>
        <NuxtLink :to="izPath('/catalog/myaso')" class="iz-btn iz-btn--line">Мясо птицы</NuxtLink>
      </div>
    </div>

    <div v-else class="iz-cmp">
      <table>
        <thead>
          <tr>
            <th />
            <th v-for="p in list" :key="p.id">
              <div class="iz-cmp__head">
                <button type="button" class="iz-iconbtn iz-cmp__del" aria-label="Убрать" @click="cart.toggleCompare(p.id)"><IzIcon name="close" :size="18" /></button>
                <NuxtLink :to="izPath(`/product/${p.id}`)">
                  <img :src="p.img" alt="" width="200" height="150" />
                  <b>{{ p.title }}</b>
                </NuxtLink>
                <button v-if="p.stock && !cart.qtyOf(p.id)" type="button" class="iz-btn iz-btn--main" @click="add(p)">В корзину</button>
                <NuxtLink v-else-if="p.stock" :to="izPath('/cart')" class="iz-btn iz-btn--soft">В корзине</NuxtLink>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows.filter((x) => list.some((p) => x.get(p) !== '—'))" :key="r.label">
            <th>{{ r.label }}</th>
            <td v-for="p in list" :key="p.id">{{ r.get(p) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
.iz-cmp {
  margin-top: 24px;
  overflow-x: auto;
  border-radius: var(--iz-R);
  border: 1px solid var(--iz-line);

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 520px;
  }
  th,
  td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--iz-line);
    text-align: left;
    vertical-align: top;
    font-size: 14.5px;
  }
  tbody th {
    position: sticky;
    left: 0;
    width: 150px;
    background: var(--iz-surface);
    color: var(--iz-muted);
    font-weight: 400;
  }
  thead th:first-child {
    position: sticky;
    left: 0;
    background: var(--iz-surface);
  }
  td {
    min-width: 190px;
    color: var(--iz-dark);
  }
  tr:last-child th,
  tr:last-child td {
    border-bottom: 0;
  }
  &__head {
    position: relative;
    display: grid;
    gap: 10px;
    min-width: 190px;

    a {
      display: grid;
      gap: 8px;
    }
    img {
      width: 100%;
      aspect-ratio: 4 / 3;
      height: auto;
      object-fit: cover;
      border-radius: 12px;
    }
    b {
      font-family: var(--iz-head);
      font-size: 17px;
      color: var(--iz-dark);
    }
  }
  &__del {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 1;
    background: #fff;
  }

  @media (max-width: 576px) {
    tbody th {
      width: 86px;
      font-size: 13px;
    }
    td {
      min-width: 160px;
    }
    th,
    td {
      padding: 10px 12px;
    }
  }
}
</style>
