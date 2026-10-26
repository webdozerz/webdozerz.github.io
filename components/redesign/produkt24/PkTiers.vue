<script lang="ts" setup>
// Три колонки цен оригинала — переключатель на весь прайс и список.
const props = withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
const list = useProdukt24List()
</script>

<template>
  <div class="pk-tiers" :class="{ 'pk-tiers--compact': props.compact }" role="radiogroup" aria-label="Цены">
    <button
      v-for="t in pkTiers"
      :key="t.id"
      type="button"
      role="radio"
      :aria-checked="list.tier.value === t.id"
      :class="{ 'is-on': list.tier.value === t.id }"
      @click="list.tier.value = t.id"
    >
      <b>{{ props.compact ? t.short : t.label }}</b>
      <small v-if="!props.compact">{{ t.note }}</small>
    </button>
  </div>
</template>
