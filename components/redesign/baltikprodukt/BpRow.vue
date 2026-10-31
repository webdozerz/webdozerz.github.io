<script lang="ts" setup>
import BpIcon from './BpIcon.vue'
import BpBuy from './BpBuy.vue'

// Строка прайса: название с производителем и коробкой, цена за кг/шт, цена коробкой и подсказка, сколько до неё осталось.
const props = defineProps<{ product: BpProduct }>()
const list = useBaltikproduktList()
const ui = useBaltikproduktUi()
const p = computed(() => props.product)
const qty = computed(() => list.qtyOf(p.value.id))
const mode = computed(() => list.mode.value)
const unit = computed(() => bpUnit(p.value))
const boxReached = computed(() => Boolean(p.value.boxPrice && p.value.pack && qty.value >= p.value.pack))
const toBox = computed(() => (p.value.boxPrice && p.value.pack && qty.value && !boxReached.value ? p.value.pack - qty.value : 0))
</script>

<template>
  <article class="bp-row" :class="{ 'is-in': qty, 'is-muted': p.flag === 'wait' }">
    <div class="bp-row__main">
      <button v-if="p.img" type="button" class="bp-row__photo" aria-label="Открыть фото" @click="ui.photo.value = p">
        <img :src="bpImg(p.img)" alt="" width="56" height="56" loading="lazy" />
      </button>
      <div class="bp-row__text">
        <h3 class="bp-row__name">{{ p.name }}</h3>
        <p class="bp-row__meta">
          <span v-if="p.flag" class="bp-flag" :class="`bp-flag--${p.flag}`">{{ bpFlags[p.flag] }}</span>
          <span v-if="p.net">{{ p.net }}</span>
          <span v-if="p.origin">{{ p.origin }}</span>
          <span v-if="p.pack" class="bp-row__pack"><BpIcon name="box" :size="14" />{{ bpPackLabel(p) }}</span>
        </p>
      </div>
    </div>

    <div class="bp-row__price">
      <template v-if="p.price">
        <p class="bp-row__cost">
          <b>{{ bpMoney(bpModePrice(p.price, mode)) }}</b>
          <small>за {{ unit }}</small>
        </p>
        <p v-if="p.boxPrice" class="bp-row__boxprice" :class="{ 'is-on': boxReached }">
          коробкой <b>{{ bpMoney(bpModePrice(p.boxPrice, mode)) }}</b>
        </p>
        <p v-else-if="p.pack" class="bp-row__boxprice">коробка {{ bpMoney0(bpBoxCost(p, mode)) }}</p>
      </template>
      <p v-else class="bp-row__ask">Цена у менеджера</p>
    </div>

    <div class="bp-row__buy">
      <BpBuy :product="p" />
      <p v-if="toBox" class="bp-row__hint">ещё {{ bpQtyLabel(p, toBox) }} — и цена {{ bpMoney(bpModePrice(p.boxPrice!, mode)) }}</p>
      <p v-else-if="boxReached" class="bp-row__hint is-on"><BpIcon name="check" :size="14" />цена коробкой</p>
    </div>
  </article>
</template>
