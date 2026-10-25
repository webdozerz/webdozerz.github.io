<script lang="ts" setup>
import PcIcon from './PcIcon.vue'
import PcQty from './PcQty.vue'

// Карточка K7: стопка на белом, фасовки чипами с ценой каждой — цена видна сразу за 250 г и за 1 кг.
const props = defineProps<{ product: PcProduct }>()
const shop = usePchelShop()

const picks = ref<Record<string, string>>(pcDefaults(props.product))
const weight = computed(() => pcCardOption(props.product))
const price = computed(() => pcPrice(props.product, picks.value))
const chipPrice = (vid: string) => pcPrice(props.product, { ...picks.value, [weight.value!.id]: vid })
const to = computed(() => pcPath(`/product/${props.product.id}`))
const state = computed(() => props.product.options.find((o) => o.id === 'state'))
</script>

<template>
  <article class="pc-card" :class="{ 'is-honey': product.honey, 'is-cover': product.cover }">
    <NuxtLink :to="to" class="pc-card__media">
      <img :src="pcImg(product.img)" :alt="product.title" width="360" height="360" loading="lazy" />
      <span v-if="state" class="pc-card__badge">Урожай 2026</span>
    </NuxtLink>
    <button
      type="button"
      class="pc-card__fav"
      :class="{ 'is-on': shop.isFav(product.id) }"
      :aria-label="shop.isFav(product.id) ? 'Убрать из закладок' : 'В закладки'"
      @click="shop.toggleFav(product.id)"
    >
      <PcIcon name="heart" :size="20" />
    </button>

    <div class="pc-card__body">
      <NuxtLink :to="to" class="pc-card__title">
        <span v-if="product.honey" class="pc-card__shade" :style="{ background: product.honey.shade }" />
        {{ product.title }}
      </NuxtLink>
      <p class="pc-card__lead">{{ product.honey ? product.honey.taste : product.lead }}</p>

      <div v-if="weight" class="pc-card__chips" :class="{ 'pc-card__chips--n4': weight.values.length === 4 }" role="radiogroup" :aria-label="weight.title">
        <button
          v-for="v in weight.values"
          :key="v.id"
          type="button"
          role="radio"
          :aria-checked="picks[weight.id] === v.id"
          class="pc-chip"
          :class="{ 'is-on': picks[weight.id] === v.id }"
          @click="picks[weight.id] = v.id"
        >
          <span>{{ v.short ?? v.label }}</span>
          <small>{{ pcRub(chipPrice(v.id)) }}</small>
        </button>
      </div>

      <div class="pc-card__foot">
        <div class="pc-card__price">
          <b>{{ pcRub(price) }}</b>
          <span>{{ weight ? (weight.values.find((v) => v.id === picks[weight!.id])?.label ?? '') : product.per }}</span>
        </div>
        <PcQty :pid="product.id" :picks="picks" />
      </div>
    </div>
  </article>
</template>

<style lang="scss">
.pc-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: var(--pc-r-card);
  background: #fff;
  box-shadow: inset 0 0 0 1px var(--pc-line);

  &__media {
    position: relative;
    display: block;
    margin: 8px 8px 0;
    border-radius: calc(var(--pc-r-card) - 6px);
    overflow: hidden;
    background: #fff;

    img {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 1;
      object-fit: contain;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  &.is-cover &__media img {
    object-fit: cover;
  }

  &__badge {
    position: absolute;
    left: 8px;
    bottom: 8px;
    padding: 5px 10px;
    border-radius: 8px;
    background: var(--pc-honey-soft);
    color: var(--pc-ink);
    font-size: 12px;
    font-weight: 600;
  }

  &__fav {
    position: absolute;
    top: 14px;
    right: 14px;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.92);
    color: var(--pc-muted);
    box-shadow: inset 0 0 0 1px var(--pc-line);
    transition: color 0.15s;

    &:hover {
      color: var(--pc-accent);
    }

    &.is-on {
      color: var(--pc-accent);

      path {
        fill: currentColor;
      }
    }
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    padding: 14px 16px 16px;
  }

  &__title {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-family: var(--pc-head);
    font-size: 19px;
    font-weight: 700;
    line-height: 1.2;
    color: var(--pc-ink);

    &:hover {
      color: var(--pc-accent);
    }
  }

  &__shade {
    flex: none;
    width: 12px;
    height: 12px;
    border-radius: 4px;
    transform: translateY(1px);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
  }

  &__lead {
    color: var(--pc-muted);
    font-size: 14px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__chips {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(62px, 1fr));
    gap: 6px;

    &--n4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    @media (max-width: 1199px) {
      &--n4 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: auto;
    padding-top: 4px;
  }

  &__price {
    display: flex;
    flex-direction: column;
    min-width: 0;

    b {
      font-family: var(--pc-head);
      font-size: 24px;
      font-weight: 800;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
    }

    span {
      color: var(--pc-muted);
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  @media (max-width: 576px) {
    &__body {
      padding: 12px 12px 14px;
    }

    &__title {
      font-size: 17px;
    }

    &__foot {
      flex-direction: column;
      align-items: stretch;
    }

    &__foot .pc-qty {
      width: 100%;
    }
  }
}

</style>
