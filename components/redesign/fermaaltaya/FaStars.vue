<script lang="ts" setup>
// Звёзды рейтинга: показ среднего или выбор своей оценки
const props = withDefaults(defineProps<{ value: number; pick?: boolean; size?: number }>(), { pick: false, size: 16 })
const emit = defineEmits<{ pick: [n: number] }>()
const hover = ref(0)
const shown = computed(() => hover.value || props.value)
const star = 'M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z'
</script>

<template>
  <span class="fa-stars" :class="{ 'is-pick': props.pick }" @mouseleave="hover = 0">
    <component
      :is="props.pick ? 'button' : 'span'"
      v-for="i in 5"
      :key="i"
      :type="props.pick ? 'button' : undefined"
      class="fa-stars__s"
      :class="{ 'is-on': shown >= i - 0.25, 'is-half': shown > i - 0.75 && shown < i - 0.25 }"
      :aria-label="props.pick ? `Оценка ${i} из 5` : undefined"
      @mouseenter="props.pick && (hover = i)"
      @click="props.pick && emit('pick', i)"
    >
      <svg :width="props.size" :height="props.size" viewBox="0 0 24 24" aria-hidden="true"><path :d="star" /></svg>
    </component>
  </span>
</template>
