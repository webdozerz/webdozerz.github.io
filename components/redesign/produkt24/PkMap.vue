<script lang="ts" setup>
import PkIcon from './PkIcon.vue'

// Карта склада. Блокировщики рекламы прячут iframe Яндекс.Карт целиком, поэтому место держит сам блок:
// под картой заглушка с меткой и ссылкой, iframe лежит поверх и закрывает её, когда загрузится.
</script>

<template>
  <div class="pk-map">
    <a :href="pkContacts.mapLink" target="_blank" rel="noopener" class="pk-map__fallback">
      <PkIcon name="pin" :size="40" />
      <span>Открыть в Яндекс Картах</span>
    </a>
    <iframe :src="pkContacts.map" title="Склад на карте" loading="lazy" />
  </div>
</template>

<style lang="scss">
.pk-map {
  position: relative;
  overflow: hidden;
  min-height: 260px;
  background: var(--pk-map);

  &__fallback {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 8px;
    color: var(--pk-green);
    font-weight: 600;

    span {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
}
</style>
