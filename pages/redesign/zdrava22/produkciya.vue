<script lang="ts" setup>
import { zdContacts, zdItem, zdItems, zdMoney, zdPath, zdSorts, zdTare } from '~/utils/zdrava22'
import { useZdUi } from '~/composables/useZdrava22'
import ZdIcon from '~/components/redesign/zdrava22/ZdIcon.vue'
import ZdSortRow from '~/components/redesign/zdrava22/ZdSortRow.vue'
import ZdItemCard from '~/components/redesign/zdrava22/ZdItemCard.vue'
import ZdTierSwitch from '~/components/redesign/zdrava22/ZdTierSwitch.vue'

useSeoMeta({ title: 'Продукция и цены — пасека «Ширяев и сыновья» | Концепт редизайна' })

const route = useRoute()
const ui = useZdUi()
const tare = computed(() => zdTare[ui.tier.value])
const common = zdSorts.filter((s) => !s.rare)
const rare = zdSorts.filter((s) => s.rare)
const bee = zdItems.filter((i) => i.group === 'bee')
const pack = zdItem('pchelopakety')!

// «Мёд в розницу» и «Мёд оптом» из меню открывают нужную вкладку
watch(
  () => route.query.t,
  (t) => {
    if (t === 'r' || t === 'o') ui.tier.value = t
  },
  { immediate: true },
)
</script>

<template>
  <div class="zd-wrap">
    <nav class="zd-crumbs"><NuxtLink :to="zdPath()">Главная</NuxtLink><span>Продукция</span></nav>
    <header class="zd-pagehead">
      <h1>Продукция и цены</h1>
      <p>Мёд пяти сортов в рознице коробкой и оптом куботейнером, продукты пчеловодства и пчелопакеты. Отправляем в любой город России транспортными компаниями и Почтой России.</p>
    </header>

    <section id="med" class="zd-sec zd-sec--first">
      <div class="zd-head">
        <div>
          <h2>{{ ui.tier.value === 'r' ? 'Алтайский мёд в розницу' : 'Мёд оптом' }}</h2>
          <p>{{ ui.tier.value === 'r' ? 'Ведёрки по 3 кг, в коробке 4 штуки. От 4 коробок — по мелкооптовой цене.' : 'Куботейнеры по 34 кг. Выгодно и для себя: от 6 куботейнеров — скидка.' }}</p>
        </div>
        <ZdTierSwitch />
      </div>
      <div class="zd-honey">
        <aside class="zd-tare">
          <div class="zd-tare__ph"><img :src="tare.img" :alt="tare.what" width="348" height="261" /></div>
          <div class="zd-tare__body">
            <h3>{{ tare.label }}: {{ tare.what }}</h3>
            <ul class="zd-tare__facts">
              <li v-for="f in tare.facts" :key="f"><ZdIcon name="check" :size="18" />{{ f }}</li>
            </ul>
          </div>
        </aside>
        <div class="zd-honey__list">
          <ZdSortRow v-for="s in common" :key="s.id" :sort="s" :tier="ui.tier.value" />
          <h3 id="redkie" class="zd-rare">Редкие виды мёда<small>с горной пасеки в Чарышском районе и степные</small></h3>
          <ZdSortRow v-for="s in rare" :key="s.id" :sort="s" :tier="ui.tier.value" />
        </div>
      </div>
    </section>

    <section id="produkty" class="zd-sec">
      <div class="zd-head">
        <div>
          <h2>Продукты пчеловодства</h2>
          <p>Для розничных покупателей пыльцу, пергу и гомогенат отправляем в пластиковых банках.</p>
        </div>
      </div>
      <div class="zd-items">
        <ZdItemCard v-for="i in bee" :key="i.id" :item="i" />
      </div>
      <NuxtLink id="pchelopakety" :to="zdPath('/produkt/pchelopakety')" class="zd-pack">
        <img :src="pack.img" alt="Пчелопакет" width="348" height="261" loading="lazy" />
        <span class="zd-pack__txt"><b>Пчелопакеты для пчеловодов</b><small>{{ pack.note }}</small></span>
        <span class="zd-pack__price">{{ zdMoney(pack.price) }}<small> / шт</small></span>
        <ZdIcon name="arrow" />
      </NuxtLink>
    </section>

    <section id="prajs" class="zd-sec">
      <div class="zd-head">
        <div>
          <h2>Прайс на мёд</h2>
          <p>Цены в рублях за килограмм, в скобках — за коробку или куботейнер. Доставку оплачиваете транспортной компании при получении.</p>
        </div>
      </div>
      <div class="zd-price">
        <div class="zd-price__row zd-price__row--head">
          <span>Сорт</span>
          <span>Коробка 12 кг</span>
          <span>От 4 коробок</span>
          <span>Куботейнер 34 кг</span>
          <span>От 6 куботейнеров</span>
        </div>
        <NuxtLink v-for="s in zdSorts" :key="s.id" :to="zdPath(`/produkt/${s.id}`)" class="zd-price__row">
          <span class="zd-price__name"><i :style="{ background: s.tone }" />{{ s.title }}</span>
          <span data-l="Коробка 12 кг"><b>{{ zdMoney(s.r[0]) }}</b> ({{ zdMoney(s.r[0] * 12) }})</span>
          <span data-l="От 4 коробок"><b>{{ zdMoney(s.r[1]) }}</b> ({{ zdMoney(s.r[1] * 12) }})</span>
          <span data-l="Куботейнер 34 кг"><b>{{ zdMoney(s.o[0]) }}</b> ({{ zdMoney(s.o[0] * 34) }})</span>
          <span data-l="От 6 куботейнеров"><b>{{ zdMoney(s.o[1]) }}</b> ({{ zdMoney(s.o[1] * 34) }})</span>
        </NuxtLink>
      </div>
      <div class="zd-price zd-price--items">
        <div class="zd-price__row zd-price__row--head">
          <span>Продукт</span>
          <span>Цена</span>
          <span>От 10 кг</span>
        </div>
        <NuxtLink v-for="i in zdItems" :key="i.id" :to="zdPath(`/produkt/${i.id}`)" class="zd-price__row">
          <span class="zd-price__name">{{ i.title }}</span>
          <span data-l="Цена"><b>{{ zdMoney(i.price) }}</b> / {{ i.per }}</span>
          <span data-l="От 10 кг">{{ i.bulk ? `${zdMoney(i.bulk.price)} / кг` : '—' }}</span>
        </NuxtLink>
      </div>
      <p class="zd-price__note">
        <ZdIcon name="phone" :size="18" />
        <span>Заказ — по телефону <a :href="`tel:${zdContacts.tel}`">{{ zdContacts.phone }}</a>, СМС, письмом или <NuxtLink :to="zdPath('/kontakty') + '#zakaz'">формой на странице «Контакты»</NuxtLink>.</span>
      </p>
    </section>
  </div>
</template>

<style lang="scss">
.zd-sec--first {
  padding-top: 32px;
}
.zd-rare {
  display: grid;
  margin: 14px 0 2px;
  font-size: 22px;

  small {
    margin-top: 2px;
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: var(--zd-muted);
  }
}
.zd-price {
  border-radius: 20px;
  border: 1px solid var(--zd-line);
  overflow: hidden;

  & + & {
    margin-top: 16px;
  }
  &__row {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) repeat(4, minmax(0, 1fr));
    gap: 12px;
    align-items: center;
    padding: 14px 20px;
    border-top: 1px solid var(--zd-line);
    font-size: 14px;
    color: var(--zd-muted);

    b {
      font-size: 16px;
      color: var(--zd-ink);
    }
    &--head {
      border-top: 0;
      background: var(--zd-surface);
      font-size: 13px;
      font-weight: 700;
      color: var(--zd-ink);
    }
  }
  a.zd-price__row:hover {
    background: #fafbfd;

    .zd-price__name {
      color: var(--zd-accent);
    }
  }
  &--items &__row {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
  }
  &__name {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 15px;
    color: var(--zd-ink);

    i {
      flex: none;
      width: 18px;
      height: 18px;
      border-radius: 6px;
    }
  }
  &__note {
    display: flex;
    gap: 10px;
    margin-top: 18px;
    color: var(--zd-muted);

    svg {
      flex: none;
      margin-top: 3px;
      color: var(--zd-accent);
    }
    a {
      color: var(--zd-accent);
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    &__row--head {
      display: none;
    }
    &__row,
    &--items &__row {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 6px 12px;
      padding: 14px 16px;
    }
    &__row:nth-child(2) {
      border-top: 0;
    }
    &__name {
      grid-column: 1 / -1;
    }
    [data-l]::before {
      content: attr(data-l);
      display: block;
      font-size: 12px;
      color: var(--zd-muted);
    }
  }
}
</style>
