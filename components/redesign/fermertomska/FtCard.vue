<script lang="ts" setup>
import FtIcon from './FtIcon.vue'

// Карточка товара в листинге: одна карточка на продукт, фасовки и вкусы — переключателем.
// «+» на фото кладёт выбранную фасовку в корзину и превращается в счётчик.
const props = defineProps<{ family: FtFamily }>()
const cart = useFermertomskaCart()

const variants = computed(() => ftVariantsOf(props.family.id))
const selectedId = ref(variants.value[0].id)
const product = computed(() => variants.value.find((p) => p.id === selectedId.value) ?? variants.value[0])
const qty = computed(() => cart.qtyOf(product.value.id))
const to = computed(() => ftPath(`/product/${product.value.id}`))

const tags = computed(() => {
  const list: { cls: string; text: string }[] = []
  if (variants.value.some((p) => p.tags.includes('sale'))) list.push({ cls: '', text: 'Акция' })
  if (variants.value.some((p) => p.tags.includes('hit'))) list.push({ cls: '', text: 'Хит' })
  if (variants.value.some((p) => p.tags.includes('new'))) list.push({ cls: 'ft-badge--new', text: 'Новинка' })
  return list.slice(0, 2)
})
</script>

<template>
  <article class="ft-card">
    <div class="ft-card__media">
      <NuxtLink :to="to" class="ft-card__photo" :aria-label="family.title">
        <img :src="product.images[0]" :alt="product.name" width="320" height="400" loading="lazy" />
      </NuxtLink>
      <div v-if="tags.length" class="ft-card__tags">
        <span v-for="t in tags" :key="t.text" class="ft-badge" :class="t.cls">{{ t.text }}</span>
      </div>
      <button
        type="button"
        class="ft-card__fav"
        :class="{ 'is-on': cart.isFav(family.id) }"
        :aria-pressed="cart.isFav(family.id)"
        :aria-label="cart.isFav(family.id) ? 'Убрать из избранного' : 'В избранное'"
        @click="cart.toggleFav(family.id)"
      >
        <FtIcon name="heart" :size="20" />
      </button>
      <div class="ft-card__buy">
        <button
          v-if="!qty"
          type="button"
          class="ft-card__add"
          :aria-label="`В корзину: ${product.name}`"
          @click="cart.add(product.id)"
        >
          <FtIcon name="plus" :size="24" />
        </button>
        <div v-else class="ft-card__qty">
          <button type="button" :aria-label="`Меньше: ${product.name}`" @click="cart.remove(product.id)">
            <FtIcon :name="qty > 1 ? 'minus' : 'trash'" :size="18" />
          </button>
          <output aria-live="polite">{{ ftQtyLabel(qty, product.unit) }}</output>
          <button type="button" :aria-label="`Больше: ${product.name}`" @click="cart.add(product.id)">
            <FtIcon name="plus" :size="18" />
          </button>
        </div>
      </div>
    </div>

    <div class="ft-card__body">
      <div class="ft-card__price">
        <strong>{{ ftPrice(product.price) }}</strong>
        <span v-if="product.unit === 'кг'">за кг</span>
        <span v-else-if="variants.length === 1 && product.variant !== 'на вес'">{{ product.variant }}</span>
      </div>
      <NuxtLink :to="to" class="ft-card__title">
        <span v-if="family.fat" class="ft-card__fat" :style="{ background: family.tone }">{{ family.fat }}</span>
        {{ ftShortTitle(family) }}
      </NuxtLink>
      <div v-if="variants.length > 1" class="ft-card__variants" role="radiogroup" :aria-label="`Фасовка: ${family.title}`">
        <button
          v-for="v in variants"
          :key="v.id"
          type="button"
          role="radio"
          :aria-checked="v.id === product.id"
          :class="{ 'is-on': v.id === product.id }"
          @click="selectedId = v.id"
        >
          {{ v.variant }}
        </button>
      </div>
      <p v-if="product.stock" class="ft-card__stock">Осталось {{ product.stock }} {{ product.unit }}</p>
      <p v-else-if="family.note" class="ft-card__stock is-note">{{ family.note }}</p>
    </div>
  </article>
</template>

<style lang="scss">
.ft .ft-card {
  display: flex;
  flex-direction: column;
  min-width: 0;

  &__media {
    position: relative;
    border-radius: var(--ft-r-lg);
    overflow: hidden;
    background: var(--ft-surface);
  }

  &__photo img {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &__media:hover &__photo img {
    transform: scale(1.03);
  }

  &__tags {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    pointer-events: none;

    .ft-badge {
      background: #fff;
    }

    .ft-badge--new {
      color: var(--ft-accent-d);
    }
  }

  &__fav {
    position: absolute;
    top: 8px;
    right: 8px;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.92);
    color: var(--ft-ink);
    transition: color 0.15s;

    &:hover {
      color: #d0306f;
    }

    &.is-on {
      color: #d0306f;

      svg {
        fill: currentColor;
      }
    }
  }

  &__buy {
    position: absolute;
    right: 10px;
    bottom: 10px;
    left: 10px;
    display: flex;
    justify-content: flex-end;
  }

  &__add {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--ft-accent);
    color: #fff;
    box-shadow: 0 6px 16px rgba(22, 99, 78, 0.3);
    transition: background-color 0.15s;

    &:hover {
      background: var(--ft-accent-d);
    }
  }

  &__qty {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) 44px;
    align-items: center;
    width: 100%;
    max-width: 220px;
    height: 48px;
    border-radius: 16px;
    background: #fff;
    color: var(--ft-accent-d);
    box-shadow: 0 6px 16px rgba(29, 43, 74, 0.14);

    button {
      display: grid;
      place-items: center;
      height: 100%;
      border-radius: 16px;

      &:hover {
        background: var(--ft-accent-soft);
      }
    }

    output {
      font-weight: 900;
      text-align: center;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 4px 0;
  }

  &__price {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 8px;

    strong {
      font-size: 20px;
      font-weight: 900;
      white-space: nowrap;
    }

    span {
      color: var(--ft-muted);
      font-size: 14px;
      font-weight: 700;
    }
  }

  &__title {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.35;

    &:hover {
      color: var(--ft-accent);
    }
  }

  &__fat {
    display: inline-block;
    margin-right: 4px;
    padding: 0 6px;
    border-radius: 6px;
    color: #fff;
    font-size: 12px;
    font-weight: 900;
    line-height: 20px;
    vertical-align: 2px;
  }

  &__variants {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 2px;

    button {
      max-width: 100%;
      min-height: 32px;
      padding: 6px 10px;
      border-radius: 10px;
      background: var(--ft-surface);
      font-size: 13px;
      font-weight: 800;
      line-height: 1.2;
      white-space: nowrap;
      transition:
        background-color 0.15s,
        color 0.15s;

      &:hover {
        background: #e2eaf3;
      }

      &.is-on {
        background: var(--ft-ink);
        color: #fff;
      }
    }
  }

  &__stock {
    color: var(--ft-muted);
    font-size: 13px;
    font-weight: 700;

    &.is-note {
      color: #8a6a00;
    }
  }

  @media (max-width: 576px) {
    &__body {
      padding: 10px 2px 0;
    }

    &__price strong {
      font-size: 18px;
    }

    &__title {
      font-size: 15px;
    }

    &__add {
      width: 46px;
      height: 46px;
    }

    &__qty {
      grid-template-columns: 38px minmax(0, 1fr) 38px;
      height: 44px;
      font-size: 15px;
    }

    &__fav {
      width: 36px;
      height: 36px;
    }

    &__tags {
      top: 8px;
      left: 8px;
      right: 48px;
    }
  }
}
</style>
