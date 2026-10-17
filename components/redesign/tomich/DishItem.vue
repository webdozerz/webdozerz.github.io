<script lang="ts" setup>
import AddDish from '~/components/redesign/tomich/AddDish.vue'

const props = defineProps<{ dish: TmDish; view?: 'list' | 'tile' }>()
const zoom = useTomichZoom()
const photo = computed(() => (props.dish.photo ? tmPhoto(props.dish.photo) : ''))
</script>

<template>
  <article class="tm-dish" :class="[`tm-dish--${view ?? 'list'}`, { 'has-photo': photo }]">
    <button
      v-if="photo"
      type="button"
      class="tm-dish__photo"
      :aria-label="`Фото: ${dish.name}`"
      @click="zoom.open([photo], dish.name)"
    >
      <img :src="photo" :alt="dish.name" loading="lazy" width="400" height="400" />
    </button>
    <div class="tm-dish__body">
      <h3 class="tm-dish__name">{{ dish.name }}</h3>
      <p v-if="dish.composition" class="tm-dish__comp">{{ dish.composition }}</p>
      <span class="tm-dish__weight">{{ dish.weight }}</span>
    </div>
    <div class="tm-dish__buy">
      <span class="tm-dish__price">{{ tmFormatPrice(dish.price) }}</span>
      <AddDish :id="dish.id" :name="dish.name" />
    </div>
  </article>
</template>

<style lang="scss">
.tm-dish {
  min-width: 0;

  &__photo {
    display: block;
    padding: 0;
    border: 0;
    background: var(--tm-mint);
    overflow: hidden;
    border-radius: var(--tm-r);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    &:hover img {
      transform: scale(1.04);
    }
  }
  &__body {
    min-width: 0;
  }
  &__name {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }
  &__comp {
    margin-top: 4px;
    font-size: 13.5px;
    line-height: 1.45;
    color: var(--tm-muted);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  &__weight {
    display: inline-block;
    margin-top: 6px;
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--tm-mint);
    font-size: 12.5px;
    font-weight: 600;
    color: var(--tm-green);
    white-space: nowrap;
  }
  &__buy {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  &__price {
    font-size: 19px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  // ----- список (K3): строка меню -----
  &--list {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px 20px;
    padding: 16px 0;
    border-bottom: 1px solid var(--tm-line);

    &.has-photo {
      grid-template-columns: 88px minmax(0, 1fr) auto;
    }
    .tm-dish__photo {
      width: 88px;
      height: 88px;
    }
    .tm-dish__price {
      min-width: 64px;
      text-align: right;
    }
  }

  // ----- плитка -----
  &--tile {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    border: 1px solid var(--tm-line);
    border-radius: var(--tm-r-lg);
    background: #fff;

    &:not(.has-photo) {
      background: var(--tm-mint);
      border-color: transparent;
    }
    .tm-dish__photo {
      aspect-ratio: 1;
      margin: -14px -14px 0;
      border-radius: var(--tm-r-lg) var(--tm-r-lg) 0 0;
    }
    .tm-dish__body {
      flex: 1;
    }
    .tm-dish__buy {
      justify-content: space-between;
    }
  }
}

@media (max-width: 640px) {
  .tm-dish--list {
    grid-template-columns: minmax(0, 1fr);

    &.has-photo {
      grid-template-columns: 72px minmax(0, 1fr);
      .tm-dish__buy {
        grid-column: 1 / -1;
      }
    }
    .tm-dish__photo {
      width: 72px;
      height: 72px;
      align-self: start;
    }
    .tm-dish__buy {
      justify-content: space-between;
    }
    .tm-dish__price {
      text-align: left;
    }
  }
}
</style>
