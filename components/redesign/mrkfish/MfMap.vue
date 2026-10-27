<script lang="ts" setup>
import MfIcon from './MfIcon.vue'

// Карта площадки. Блокировщики рекламы прячут iframe Яндекс.Карт целиком, поэтому место держит сам блок:
// под картой заглушка с меткой и ссылкой, iframe лежит поверх и закрывает её, когда загрузится.
const props = defineProps<{ site: (typeof mfSites)[number] }>()
</script>

<template>
  <div class="mf-map">
    <a :href="props.site.mapLink" target="_blank" rel="noopener" class="mf-map__fallback">
      <MfIcon name="pin" :size="36" />
      <span>{{ props.site.title }} в Яндекс Картах</span>
    </a>
    <iframe :src="props.site.map" :title="`${props.site.title} на карте`" loading="lazy" />
  </div>
</template>

<style lang="scss">
.mf-map {
  position: relative;
  overflow: hidden;
  min-height: 240px;
  border-radius: var(--mf-r-lg);
  background: var(--mf-surface);

  &__fallback {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 8px;
    color: var(--mf-navy);
    font-weight: 700;

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
