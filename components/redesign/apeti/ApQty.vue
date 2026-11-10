<script lang="ts" setup>
// Счётчик: «− 0,5 кг +». Стили — в оболочке (нужны и корзине, и карточкам).
defineProps<{ text: string; small?: boolean }>()
defineEmits<{ dec: []; inc: [] }>()
</script>

<template>
  <div class="ap-qty" :class="{ 'ap-qty--s': small }">
    <button type="button" aria-label="Меньше" @click="$emit('dec')">−</button>
    <span>{{ text }}</span>
    <button type="button" aria-label="Больше" @click="$emit('inc')">+</button>
  </div>
</template>
