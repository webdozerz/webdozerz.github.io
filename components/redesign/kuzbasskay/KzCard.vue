<script lang="ts" setup>
// K23 «Упаковка»: их предметка 3:2 на белом в рамке, иконка раздела их силуэтом, название, факты, «Цена — в отделе продаж».
// Фото открывается в лайтбоксе — как увеличение fancybox у оригинала.
import { kzImg, kzSection } from '~/utils/kuzbasskay'
import type { KzProduct } from '~/utils/kuzbasskay'
import { useKzUi } from '~/composables/useKuzbasskay'
import KzMark from '~/components/redesign/kuzbasskay/KzMark.vue'
import KzAsk from '~/components/redesign/kuzbasskay/KzAsk.vue'

const props = defineProps<{ p: KzProduct; showSection?: boolean }>()
const ui = useKzUi()
const section = computed(() => kzSection(props.p.section))
const zoom = () =>
  ui.open(
    props.p.name,
    props.p.photos.map((img) => ({ img })),
  )
</script>

<template>
  <article :id="props.p.id" class="kz-card">
    <button type="button" class="kz-card__photo" :aria-label="`Увеличить фото: ${props.p.name}`" @click="zoom">
      <img :src="kzImg(props.p.photos[0])" :alt="props.p.name" width="600" height="400" loading="lazy" />
      <span v-if="props.p.photos.length > 1" class="kz-card__more">{{ props.p.photos.length }} фото</span>
    </button>
    <div class="kz-card__body">
      <p v-if="props.showSection && section" class="kz-card__sec"><KzMark :name="section.icon" :size="16" />{{ section.title }}</p>
      <h3 class="kz-card__name">{{ props.p.short }}</h3>
      <p v-if="props.p.text" class="kz-card__text">{{ props.p.text }}</p>
      <dl class="kz-card__facts">
        <div v-for="f in props.p.facts" :key="f[0]">
          <dt>{{ f[0] }}</dt>
          <dd>{{ f[1] }}</dd>
        </div>
      </dl>
      <div class="kz-card__foot">
        <span class="kz-card__price">Цена — в&nbsp;отделе продаж</span>
        <KzAsk :what="props.p.name" up />
      </div>
    </div>
  </article>
</template>

<style lang="scss">
.kz-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--kz-line);
  border-radius: var(--kz-R);
  background: #fff;
  transition: border-color 0.15s;

  &:hover {
    border-color: #e5d7b8;
  }
  &__photo {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 3 / 2;
    overflow: hidden;
    border-radius: calc(var(--kz-R) - 1px) calc(var(--kz-R) - 1px) 0 0;
    background: #fff;
    cursor: zoom-in;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    &:hover img {
      transform: scale(1.04);
    }
  }
  &__more {
    position: absolute;
    right: 12px;
    bottom: 12px;
    padding: 3px 10px;
    border: 1px solid var(--kz-line);
    border-radius: 99px;
    background: var(--kz-strip);
    box-shadow: 0 2px 6px rgba(61, 42, 18, 0.12);
    color: var(--kz-ink);
    font-size: 13px;
    font-weight: 700;
  }
  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    padding: 16px 20px 20px;
  }
  &__sec {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--kz-accent-ink);
    font-size: 13px;
    font-weight: 700;
  }
  &__name {
    font-size: 20px;
    font-weight: 800;
    line-height: 1.2;
  }
  &__text {
    color: var(--kz-muted);
    font-size: 14px;
    line-height: 1.45;
  }
  dl.kz-card__facts {
    display: grid;
    gap: 6px;
    margin: 2px 0 0;
    font-size: 14px;

    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 6px;
      border-bottom: 1px dashed var(--kz-line);
    }
    dt {
      color: var(--kz-muted);
    }
    dd {
      color: var(--kz-ink);
      font-weight: 700;
      text-align: right;
    }
  }
  &__foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px 12px;
    margin-top: auto;
    padding-top: 6px;
  }
  &__price {
    color: var(--kz-ink);
    font-size: 14px;
    font-weight: 700;
    line-height: 1.25;
  }
}
</style>
