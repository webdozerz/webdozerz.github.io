<script lang="ts" setup>
import { zdContacts, zdItem, zdMoney, zdOrig, zdPath, zdSort, zdTare } from '~/utils/zdrava22'
import { useZdUi } from '~/composables/useZdrava22'
import ZdIcon from '~/components/redesign/zdrava22/ZdIcon.vue'
import ZdTierSwitch from '~/components/redesign/zdrava22/ZdTierSwitch.vue'

const route = useRoute()
const ui = useZdUi()
const id = computed(() => String(route.params.id))
const sort = computed(() => zdSort(id.value))
const item = computed(() => zdItem(id.value))
if (!sort.value && !item.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })

const title = computed(() => sort.value?.title ?? item.value?.title ?? '')
useSeoMeta({ title: () => `${title.value} — пасека «Ширяев и сыновья» | Концепт редизайна` })

const tare = computed(() => zdTare[ui.tier.value])
const orderKey = computed(() => (sort.value ? `${ui.tier.value}:${sort.value.id}` : `i:${item.value!.id}`))
const text = computed(() => sort.value?.text ?? item.value?.text ?? [])
const origUrl = computed(() => sort.value?.url ?? item.value?.url ?? '/')

// «Другая продукция» — как третья кнопка в карточках оригинала
const others = computed(() => [
  ...zdSorts.filter((s) => s.id !== id.value).map((s) => ({ id: s.id, name: s.title, price: `от ${zdMoney(s.o[1])}/кг`, tone: s.tone, img: '' })),
  ...zdItems.filter((i) => i.id !== id.value).map((i) => ({ id: i.id, name: i.name, price: `${zdMoney(i.price)} / ${i.per}`, tone: '', img: i.img })),
])
</script>

<template>
  <div class="zd-wrap">
    <nav class="zd-crumbs">
      <NuxtLink :to="zdPath()">Главная</NuxtLink>
      <span><NuxtLink :to="zdPath('/produkciya')">Продукция</NuxtLink></span>
      <span v-if="sort?.rare"><NuxtLink :to="zdPath('/produkciya') + '#redkie'">Редкие виды мёда</NuxtLink></span>
      <span>{{ title }}</span>
    </nav>

    <div class="zd-prod">
      <div class="zd-prod__media">
        <div v-if="sort" class="zd-prod__ph zd-prod__ph--big">
          <img :src="tare.img" :alt="tare.what" width="348" height="261" />
          <span class="zd-prod__tone"><i :style="{ background: sort.tone }" />{{ sort.name }} мёд — цвет<small>{{ tare.what }}</small></span>
        </div>
        <div v-else class="zd-prod__ph zd-prod__ph--big"><img :src="item!.img" :alt="item!.title" width="348" height="261" /></div>
      </div>

      <div class="zd-prod__info">
        <h1>{{ title }}</h1>
        <p class="zd-prod__note">
          <span v-if="sort?.rare" class="zd-mark">редкий</span>
          {{ sort?.note ?? item?.note }}
        </p>

        <template v-if="sort">
          <ZdTierSwitch />
          <div class="zd-ladder">
            <div class="zd-ladder__step is-on">
              <small>{{ tare.unit }} {{ tare.kg }} кг</small>
              <b>{{ zdMoney(sort[ui.tier.value][0]) }}/кг</b>
              <span>{{ zdMoney(sort[ui.tier.value][0] * tare.kg) }} за {{ ui.tier.value === 'r' ? 'коробку' : 'куботейнер' }}</span>
            </div>
            <div class="zd-ladder__step">
              <small>{{ tare.fromText }}</small>
              <b>{{ zdMoney(sort[ui.tier.value][1]) }}/кг</b>
              <span>{{ zdMoney(sort[ui.tier.value][1] * tare.kg) }} за {{ ui.tier.value === 'r' ? 'коробку' : 'куботейнер' }}</span>
            </div>
          </div>
          <ul class="zd-prod__facts">
            <li v-for="f in tare.facts" :key="f"><ZdIcon name="check" :size="18" />{{ f }}</li>
          </ul>
        </template>
        <div v-else class="zd-ladder">
          <div class="zd-ladder__step is-on">
            <small>цена</small>
            <b>{{ zdMoney(item!.price) }}</b>
            <span>за {{ item!.per }}</span>
          </div>
          <div v-if="item!.bulk" class="zd-ladder__step">
            <small>от {{ item!.bulk.from }} кг</small>
            <b>{{ zdMoney(item!.bulk.price) }}</b>
            <span>за кг</span>
          </div>
        </div>

        <div class="zd-prod__btns">
          <NuxtLink :to="{ path: zdPath('/kontakty'), query: { z: orderKey }, hash: '#zakaz' }" class="zd-btn zd-btn--big">Оформить заказ</NuxtLink>
          <a :href="`tel:${zdContacts.tel}`" class="zd-btn zd-btn--line zd-btn--big"><ZdIcon name="phone" :size="18" />{{ zdContacts.phone }}</a>
        </div>
        <p class="zd-prod__ship"><ZdIcon name="truck" :size="18" /><span>Отправим в любой город России ТК или Почтой России, груз страхуем. Оплата — 100 % предоплата, доставку оплачиваете при получении.</span></p>

        <div class="zd-prod__text">
          <p v-for="(t, n) in text" :key="n">{{ t }}</p>
          <a :href="zdOrig(origUrl)" target="_blank" rel="noopener" class="zd-link">Подробная статья на сайте пасеки<ZdIcon name="ext" :size="16" /></a>
        </div>
      </div>
    </div>

    <section class="zd-sec">
      <div class="zd-head">
        <h2>Другая продукция</h2>
        <NuxtLink :to="zdPath('/produkciya')" class="zd-link">Вся продукция<ZdIcon name="arrow" :size="16" /></NuxtLink>
      </div>
      <div class="zd-others">
        <NuxtLink v-for="o in others" :key="o.id" :to="zdPath(`/produkt/${o.id}`)" class="zd-others__card">
          <span v-if="o.tone" class="zd-others__ph zd-others__ph--tone" :style="{ background: o.tone }">
            <b>{{ o.price.replace('от ', '') }}</b>
          </span>
          <span v-else class="zd-others__ph">
            <img :src="o.img" alt="" width="348" height="261" loading="lazy" />
          </span>
          <b>{{ o.name }}</b>
          <small>{{ o.price }}</small>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.zd-prod {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 40px;
  padding-top: 20px;
  align-items: start;

  &__media {
    display: grid;
    gap: 12px;
    position: sticky;
    top: 96px;
  }
  &__tone {
    position: absolute;
    left: 16px;
    bottom: 16px;
    z-index: 1;
    display: grid;
    grid-template-columns: 28px auto;
    align-items: center;
    column-gap: 10px;
    padding: 8px 14px 8px 8px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.94);
    color: var(--zd-ink);
    font-weight: 600;
    font-size: 14px;
    line-height: 1.3;

    i {
      grid-row: span 2;
      width: 28px;
      height: 28px;
      border-radius: 9px;
      box-shadow: inset 0 0 0 1px rgba(28, 33, 51, 0.1);
    }
    small {
      font-weight: 400;
      font-size: 12px;
      color: var(--zd-muted);
    }
  }
  &__ph {
    position: relative;
    aspect-ratio: 16 / 9;
    border-radius: var(--zd-R);
    overflow: hidden;
    background: var(--zd-surface);

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &--big {
      aspect-ratio: 4 / 3;
    }
  }
  &__info {
    display: grid;
    gap: 16px;
    align-content: start;

    h1 {
      font-size: 38px;
    }
  }
  &__note {
    font-size: 16px;
    color: var(--zd-muted);

    .zd-mark {
      margin-right: 6px;
    }
  }
  ul.zd-prod__facts {
    display: grid;
    gap: 6px;

    li {
      display: flex;
      gap: 8px;
      font-size: 14px;
    }
    svg {
      flex: none;
      margin-top: 2px;
      color: var(--zd-accent);
    }
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  &__ship {
    display: flex;
    gap: 10px;
    padding: 14px 16px;
    border-radius: 16px;
    background: var(--zd-surface);
    font-size: 14px;

    svg {
      flex: none;
      margin-top: 2px;
      color: var(--zd-accent);
    }
  }
  &__text {
    display: grid;
    gap: 10px;
    padding-top: 8px;
    border-top: 1px solid var(--zd-line);
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;

    &__media {
      position: static;
    }
    &__ph--big {
      grid-column: 1 / -1;
    }
  }
  @media (max-width: 576px) {
    &__info h1 {
      font-size: 28px;
    }
    &__btns .zd-btn {
      flex: 1 1 auto;
    }
  }
}
.zd-ladder {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  &__step {
    display: grid;
    gap: 2px;
    padding: 14px 16px;
    border-radius: 16px;
    border: 1px solid var(--zd-line);

    small {
      font-size: 13px;
      color: var(--zd-muted);
    }
    b {
      font-size: 24px;
      line-height: 1.2;
      color: var(--zd-ink);
    }
    span {
      font-size: 13px;
      color: var(--zd-muted);
    }
    &.is-on {
      border-color: var(--zd-yellow);
      background: var(--zd-yellow-soft);
    }
  }

  @media (max-width: 375px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.zd-others {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - 5 * 12px) / 6);
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-color: #cfd3e2 transparent;

  &__card {
    display: grid;
    gap: 4px;
    align-content: start;

    b {
      font-size: 14px;
      line-height: 1.3;
      color: var(--zd-ink);
    }
    small {
      font-size: 13px;
      color: var(--zd-muted);
    }
    &:hover b {
      color: var(--zd-accent);
    }
  }
  &__ph {
    position: relative;
    display: grid;
    place-items: center;
    aspect-ratio: 4 / 3;
    margin-bottom: 4px;
    border-radius: 16px;
    overflow: hidden;
    background: var(--zd-surface);

    &--tone {
      align-items: end;
      justify-items: start;
      padding: 10px;
      box-shadow: inset 0 0 0 1px rgba(28, 33, 51, 0.08);

      b {
        padding: 4px 10px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.92);
        color: var(--zd-ink);
        font-size: 14px;
      }
    }
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  @media (max-width: 989px) {
    grid-auto-columns: calc((100% - 2 * 12px) / 3.3);
  }
  @media (max-width: 576px) {
    grid-auto-columns: calc((100% - 12px) / 2.2);
  }
}
</style>
