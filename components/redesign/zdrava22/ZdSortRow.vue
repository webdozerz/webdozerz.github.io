<script lang="ts" setup>
import { zdMoney, zdPath, zdTare } from '~/utils/zdrava22'
import type { ZdSort, ZdTier } from '~/utils/zdrava22'
import ZdIcon from '~/components/redesign/zdrava22/ZdIcon.vue'

// K21 «строка сорта»: цвет мёда, вкус словами пасеки, цена за кг и за тару, ступень «от N»
const props = defineProps<{ sort: ZdSort; tier: ZdTier }>()
const tare = computed(() => zdTare[props.tier])
const price = computed(() => props.sort[props.tier])
</script>

<template>
  <article class="zd-sort" :style="{ '--tone': props.sort.tone }">
    <NuxtLink :to="zdPath(`/produkt/${props.sort.id}`)" class="zd-sort__swatch" :aria-label="props.sort.title"><ZdIcon name="hex" :size="26" /></NuxtLink>
    <div class="zd-sort__name">
      <h3>
        <NuxtLink :to="zdPath(`/produkt/${props.sort.id}`)">{{ props.sort.title }}</NuxtLink>
      </h3>
      <p><span v-if="props.sort.rare" class="zd-mark">редкий</span> {{ props.sort.note }}</p>
    </div>
    <div class="zd-sort__price">
      <b>{{ zdMoney(price[0]) }}<small>/кг</small></b>
      <span>{{ tare.unit }} {{ tare.kg }} кг — {{ zdMoney(price[0] * tare.kg) }}</span>
      <span class="zd-sort__step">{{ tare.fromText.replace(/ \(.+\)/, '') }} — {{ zdMoney(price[1]) }}/кг</span>
    </div>
    <div class="zd-sort__act">
      <NuxtLink :to="zdPath(`/produkt/${props.sort.id}`)" class="zd-btn zd-btn--line">Подробнее</NuxtLink>
      <NuxtLink :to="{ path: zdPath('/kontakty'), query: { z: `${props.tier}:${props.sort.id}` }, hash: '#zakaz' }" class="zd-btn">Оформить заказ</NuxtLink>
    </div>
  </article>
</template>

<style lang="scss">
.zd-sort {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) 210px auto;
  align-items: center;
  gap: 20px;
  padding: 18px 20px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid var(--zd-line);

  &__swatch {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: var(--tone);
    color: rgba(255, 255, 255, 0.55);
    box-shadow: inset 0 0 0 1px rgba(28, 33, 51, 0.08);
  }
  &__name {
    min-width: 0;

    h3 {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 10px;
      font-size: 20px;

      a:hover {
        color: var(--zd-accent);
      }
    }
    p {
      margin-top: 8px;
      color: var(--zd-muted);
      font-size: 14px;
    }
  }
  &__price {
    display: grid;
    gap: 2px;
    font-size: 13px;
    color: var(--zd-muted);

    b {
      font-size: 24px;
      line-height: 1.15;
      color: var(--zd-ink);
      font-weight: 700;

      small {
        font-size: 15px;
        font-weight: 600;
        color: var(--zd-muted);
      }
    }
  }
  &__step {
    color: var(--zd-accent);
    font-weight: 600;
  }
  &__act {
    display: flex;
    gap: 8px;
  }

  @media (max-width: 1199px) {
    grid-template-columns: 56px minmax(0, 1fr) 190px;

    &__swatch {
      width: 56px;
      height: 56px;
      border-radius: 16px;
    }
    &__act {
      grid-column: 2 / -1;
    }
  }
  @media (max-width: 576px) {
    grid-template-columns: 48px minmax(0, 1fr);
    gap: 12px 14px;
    padding: 16px;

    &__swatch {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      align-self: start;
    }
    &__name h3 {
      font-size: 18px;
    }
    &__price {
      grid-column: 1 / -1;
    }
    &__act {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (max-width: 375px) {
    &__act {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
