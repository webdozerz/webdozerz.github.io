<script lang="ts" setup>
useSeoMeta({
  title: 'IlDev | Портфолио frontend разработчика',
})
</script>

<template>
  <div class="app">
    <NuxtPage />
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/additionalData/index.scss";
@import "@/assets/scss/index.scss";

/* Глобальные стили для темного скроллбара */
* {
  /* Темный скроллбар для WebKit браузеров (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #333, #555);
    border-radius: 6px;
    border: 1px solid #1a1a1a;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  }

  &::-webkit-scrollbar-corner {
    background: #1a1a1a;
  }
}

/* Поддержка для Firefox */
html {
  scrollbar-width: thin;
  scrollbar-color: #333 #1a1a1a;
}

/* Темные стили для body */
body {
  background-color: #0f0f0f;
  color: #e0e0e0;
}
</style>
