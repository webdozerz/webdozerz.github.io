<script lang="ts" setup>
import PkBuy from './PkBuy.vue'

// K9 — строка прайса: три цены как в оригинале, выбранная колонка подсвечена, на телефоне крупно только она.
const props = defineProps<{ product: PkProduct; group?: boolean }>()
const list = useProdukt24List()
const per = computed(() => pkWeightPer(props.product))
const others = computed(() => pkTiers.filter((t) => t.id !== list.tier.value))
</script>

<template>
  <div class="pk-row" :class="{ 'is-in': list.qtyOf(props.product.id) }">
    <div class="pk-row__name">
      <span>{{ props.product.name }}</span>
      <small>
        <template v-if="props.group">{{ props.product.group }} · </template>арт. {{ props.product.id }}
        <template v-if="props.product.unit !== 'кг' && per"> · {{ String(per).replace('.', ',') }} кг в {{ props.product.unit === 'уп' ? 'упак.' : 'шт.' }}</template>
      </small>
    </div>
    <span class="pk-row__unit">{{ pkUnitLabel(props.product.unit) }}</span>
    <button
      v-for="t in pkTiers"
      :key="t.id"
      type="button"
      class="pk-row__price"
      :class="{ 'is-on': list.tier.value === t.id }"
      :title="t.label"
      @click="list.tier.value = t.id"
    >
      {{ pkMoney(props.product.prices[t.id]) }}
    </button>
    <div class="pk-row__mobile">
      <b>{{ pkMoney(props.product.prices[list.tier.value]) }}<small> / {{ pkUnitLabel(props.product.unit) }}</small></b>
      <span>
        <template v-for="(t, i) in others" :key="t.id">{{ i ? ' · ' : '' }}<span>{{ t.short.toLowerCase() }} {{ pkMoney(props.product.prices[t.id]) }}</span></template>
      </span>
    </div>
    <PkBuy :id="props.product.id" :unit="props.product.unit" />
  </div>
</template>
