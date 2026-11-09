<script lang="ts" setup>
import { oyDiscount, oyMoney, oyPath, oyPrice, oyServices, oySection, oyShort, oyStep, oyUnit, oyUnitText } from '~/utils/oyster'
import type { OyProduct } from '~/utils/oyster'
import { useOyShop, useOyUi } from '~/composables/useOyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'
import OyQty from '~/components/redesign/oyster/OyQty.vue'

// K22 «ценник на льду»: фото 1:1, размеры чипами меняют цену и единицу, «открыть к доставке» — их услуга под ценой
const props = defineProps<{ p: OyProduct }>()
const shop = useOyShop()
const ui = useOyUi()

const v = ref(props.p.def ?? 0)
const svc = ref(false)
const unit = computed(() => oyUnit(props.p, v.value))
const step = computed(() => oyStep(props.p, v.value))
const qty = ref(step.value)
watch(v, () => (qty.value = step.value))
const price = computed(() => oyPrice(props.p, v.value))
const added = computed(() => shop.inCart(props.p.id))
const off = computed(() => oyDiscount(props.p))
const to = computed(() => oyPath(`/product/${props.p.id}/`))
const svcInfo = computed(() => (props.p.service ? oyServices[props.p.service] : null))
const sub = computed(() => oySection(props.p.sec)?.name ?? '')
const buy = () => shop.add(props.p, v.value, svc.value, qty.value)
</script>

<template>
  <article class="oy-card">
    <div class="oy-card__media">
      <NuxtLink :to="to" class="oy-card__img" :aria-label="props.p.name">
        <img :src="props.p.img" :alt="props.p.name" loading="lazy" width="600" height="600" />
      </NuxtLink>
      <div class="oy-card__labels">
        <span v-if="off" class="oy-label oy-label--sale">−{{ off }}%</span>
        <span v-if="props.p.order" class="oy-label oy-label--order">Под заказ</span>
        <span v-for="l in props.p.labels.slice(0, 2)" :key="l" class="oy-label" :class="`oy-label--${l === 'Хит' ? 'hit' : l === 'Новинка' ? 'new' : l === 'Акция' ? 'sale' : 'adv'}`">{{ l }}</span>
      </div>
      <div class="oy-card__acts">
        <button type="button" class="oy-card__act" :class="{ 'is-on': shop.fav.value.includes(props.p.id) }" aria-label="В избранное" @click="shop.toggle('fav', props.p.id)">
          <OyIcon name="heart" :size="18" />
        </button>
        <button type="button" class="oy-card__act" :class="{ 'is-on': shop.cmp.value.includes(props.p.id) }" aria-label="Сравнить" @click="shop.toggle('cmp', props.p.id)">
          <OyIcon name="compare" :size="18" />
        </button>
      </div>
    </div>
    <div class="oy-card__body">
      <span class="oy-card__sub">{{ sub }}</span>
      <NuxtLink :to="to" class="oy-card__name" :title="props.p.name">{{ oyShort(props.p.name, 58) }}</NuxtLink>
      <div v-if="props.p.variants && props.p.variants.length <= 3" class="oy-card__sizes" role="group" aria-label="Размер">
        <button v-for="(x, i) in props.p.variants" :key="x.name" type="button" class="oy-chip" :class="{ 'is-on': v === i }" @click="v = i">{{ x.name }}</button>
      </div>
      <label v-else-if="props.p.variants" class="oy-select oy-card__select">
        <select v-model="v" :aria-label="props.p.sec === 'ryba' ? 'Вес рыбы' : 'Фасовка'">
          <option v-for="(x, i) in props.p.variants" :key="x.name" :value="i">{{ props.p.sec === 'ryba' ? 'Вес' : 'Фасовка' }}: {{ x.name }}</option>
        </select>
        <OyIcon name="down" :size="16" />
      </label>
      <div class="oy-card__price">
        <template v-if="price">
          <b>{{ oyMoney(price) }}</b>
          <span class="oy-unit">{{ oyUnitText(unit) }}</span>
          <s v-if="props.p.old && v === (props.p.def ?? 0)">{{ oyMoney(props.p.old) }}</s>
        </template>
        <span v-else class="oy-card__ask">Цена и срок — по запросу</span>
      </div>
      <label v-if="svcInfo && price" class="oy-svc" :title="svcInfo.text">
        <input v-model="svc" type="checkbox" />
        <span class="oy-svc__box"><OyIcon name="check" :size="14" /></span>
        <span>{{ props.p.service === 'fish' ? 'На филе' : 'Открыть' }} <em>+{{ svcInfo.price }}&nbsp;₽/{{ svcInfo.per }}</em></span>
      </label>
      <div class="oy-card__buy">
        <template v-if="price">
          <OyQty v-model="qty" :unit="unit" :step="step" :min="step" small />
          <button v-if="!added" type="button" class="oy-btn oy-btn--accent oy-card__add" @click="buy">
            <OyIcon name="cart" :size="18" /><span>В корзину</span>
          </button>
          <NuxtLink v-else :to="oyPath('/cart/')" class="oy-btn oy-btn--done oy-card__add">
            <OyIcon name="check" :size="18" /><span>В корзине</span>
          </NuxtLink>
        </template>
        <button v-else type="button" class="oy-btn oy-btn--line oy-card__add oy-card__add--wide" @click="ui.open('question', props.p.name)">
          <OyIcon name="chat" :size="18" /><span>Узнать цену</span>
        </button>
      </div>
    </div>
  </article>
</template>
