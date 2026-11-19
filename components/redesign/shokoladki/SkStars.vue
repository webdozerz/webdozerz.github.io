<script lang="ts" setup>
// Рейтинг звёздами, как у оригинала; без отзывов — пустые звёзды и «нет отзывов».
import { skPlural } from '~/utils/shokoladki'

const props = defineProps<{ value: number; count?: number; small?: boolean }>()
const pct = computed(() => `${Math.max(0, Math.min(5, props.value)) * 20}%`)
</script>

<template>
  <span class="sk-stars" :class="{ 'sk-stars--small': small }">
    <span class="sk-stars__row" :style="{ '--pct': pct }" :aria-label="value ? `Оценка ${value} из 5` : 'Пока без оценок'" />
    <span v-if="count !== undefined" class="sk-stars__count">{{ count ? `${count} ${skPlural(count, 'отзыв', 'отзыва', 'отзывов')}` : 'нет отзывов' }}</span>
  </span>
</template>

<style lang="scss">
.sk .sk-stars {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.sk .sk-stars__row {
  --star: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z'/%3E%3C/svg%3E");
  width: 90px;
  height: 18px;
  background: linear-gradient(90deg, var(--sk-foil) var(--pct), #e4dcd8 var(--pct));
  -webkit-mask: var(--star) 0 0 / 18px 18px repeat-x;
  mask: var(--star) 0 0 / 18px 18px repeat-x;
}
.sk .sk-stars--small .sk-stars__row {
  width: 70px;
  height: 14px;
  -webkit-mask-size: 14px 14px;
  mask-size: 14px 14px;
}
.sk .sk-stars__count {
  font-size: 12.5px;
  color: var(--sk-muted);
}
</style>
