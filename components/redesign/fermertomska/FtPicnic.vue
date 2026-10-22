<script lang="ts" setup>
import FtIcon from './FtIcon.vue'

// Снимок всей линейки на пледе: точки на продуктах, по нажатию — карточка с ценой и «+».
const cart = useFermertomskaCart()
const active = ref<string | null>('butter')

const spot = computed(() => ftPicnicSpots.find((s) => s.family === active.value) ?? null)
const family = computed(() => (spot.value ? ftFamilyOf(spot.value.family) : null))
const product = computed(() => (spot.value ? ftFindProduct(spot.value.product)! : null))
const qty = computed(() => (product.value ? cart.qtyOf(product.value.id) : 0))

const popStyle = computed(() => {
  if (!spot.value) return {}
  const right = spot.value.x > 55
  return {
    top: `${Math.min(Math.max(spot.value.y, 18), 70)}%`,
    left: right ? 'auto' : `calc(${spot.value.x}% + 28px)`,
    right: right ? `calc(${100 - spot.value.x}% + 28px)` : 'auto',
  }
})

const toggle = (id: string) => {
  active.value = active.value === id ? null : id
}
</script>

<template>
  <div class="ft-picnic">
    <div class="ft-picnic__frame" :class="{ 'has-pop': family }">
      <div class="ft-picnic__stage">
      <img
        class="ft-picnic__img"
        :src="ftImg('picnic.jpg')"
        :srcset="`${ftImg('picnic-900.jpg')} 900w, ${ftImg('picnic.jpg')} 1600w`"
        sizes="(max-width: 1199px) 100vw, 70vw"
        alt="Вся линейка «Куендатское» на пледе: молоко, сметана, творог, масло, кефир и йогурты"
        width="1600"
        height="1067"
        @click="active = null"
      />
      <button
        v-for="s in ftPicnicSpots"
        :key="s.family"
        type="button"
        class="ft-picnic__spot"
        :class="{ 'is-on': active === s.family }"
        :style="{ left: `${s.x}%`, top: `${s.y}%` }"
        :aria-label="ftFamilyOf(s.family).title"
        :aria-pressed="active === s.family"
        @click="toggle(s.family)"
      >
        <span />
      </button>

      <div v-if="family && product" class="ft-picnic__pop" :style="popStyle">
        <NuxtLink :to="ftPath(`/product/${product.id}`)" class="ft-picnic__pop-photo">
          <img :src="product.images[0]" alt="" width="64" height="80" />
        </NuxtLink>
        <div class="ft-picnic__pop-text">
          <NuxtLink :to="ftPath(`/product/${product.id}`)" class="ft-picnic__pop-title">{{ family.title }}</NuxtLink>
          <span class="ft-picnic__pop-meta">{{ product.variant }} · {{ ftPrice(product.price) }}</span>
        </div>
        <button
          v-if="!qty"
          type="button"
          class="ft-picnic__pop-add"
          :aria-label="`В корзину: ${product.name}`"
          @click="cart.add(product.id)"
        >
          <FtIcon name="plus" :size="20" />
        </button>
        <NuxtLink v-else :to="ftPath('/cart')" class="ft-picnic__pop-in" :aria-label="`В корзине ${qty} ${product.unit}, перейти в корзину`">
          <FtIcon name="check" :size="18" />{{ qty }}
        </NuxtLink>
      </div>
      </div>
      <p class="ft-picnic__hint">Нажмите на продукт — покажем цену</p>
    </div>
  </div>
</template>

<style lang="scss">
// На десктопе снимок занимает всю высоту колонки рядом с панелью и кадрируется как обложка:
// сцена 3:2 масштабируется под рамку (container query), точки и карточка едут вместе с ней.
// Ниже 1200 px — обычный кадр 3:2 без обрезки.
.ft .ft-picnic {
  min-width: 0;
  height: 100%;

  &__frame {
    position: relative;
    height: 100%;
    min-height: 440px;
    border-radius: var(--ft-r-lg);
    overflow: hidden;
    background: #cfd8c5;
    container-type: size;
  }

  &__stage {
    position: absolute;
    top: 50%;
    left: 50%;
    width: max(100cqw, 150cqh);
    aspect-ratio: 3 / 2;
    transform: translate(-50%, -50%);
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__spot {
    position: absolute;
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    margin: -17px 0 0 -17px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.55);
    transition:
      transform 0.15s,
      background-color 0.15s;

    span {
      width: 18px;
      height: 18px;
      border: 3px solid #fff;
      border-radius: 50%;
      background: var(--ft-accent);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    }

    &:hover {
      transform: scale(1.12);
    }

    &.is-on {
      background: rgba(255, 255, 255, 0.85);

      span {
        background: var(--ft-orange);
      }
    }
  }

  &__pop {
    position: absolute;
    z-index: 2;
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    width: 300px;
    padding: 8px;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 12px 32px rgba(29, 43, 74, 0.22);
    transform: translateY(-50%);
  }

  &__pop-photo img {
    width: 56px;
    height: 70px;
    border-radius: 12px;
    object-fit: cover;
  }

  &__pop-text {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  &__pop-title {
    font-weight: 900;
    line-height: 1.25;

    &:hover {
      color: var(--ft-accent);
    }
  }

  &__pop-meta {
    color: var(--ft-muted);
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
  }

  &__pop-add,
  &__pop-in {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--ft-accent);
    color: #fff;

    &:hover {
      background: var(--ft-accent-d);
    }
  }

  &__pop-in {
    display: inline-flex;
    gap: 2px;
    width: auto;
    min-width: 44px;
    padding: 0 10px;
    border-radius: 22px;
    background: var(--ft-accent-soft);
    color: var(--ft-accent-d);
    font-weight: 900;

    &:hover {
      background: #cfe8de;
    }
  }

  &__hint {
    position: absolute;
    bottom: 16px;
    left: 16px;
    z-index: 1;
    padding: 8px 14px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.92);
    color: var(--ft-ink);
    font-size: 14px;
    font-weight: 700;
    pointer-events: none;
  }

  @media (max-width: 1199px) {
    height: auto;

    &__frame {
      height: auto;
      min-height: 0;
      container-type: normal;
    }

    &__stage {
      position: relative;
      top: auto;
      left: auto;
      width: 100%;
      transform: none;
    }
  }

  @media (max-width: 768px) {
    &__frame {
      overflow: visible;
      border-radius: 0;
      background: none;
    }

    &__img {
      border-radius: 20px;
    }

    &__spot {
      width: 30px;
      height: 30px;
      margin: -15px 0 0 -15px;

      span {
        width: 16px;
        height: 16px;
      }
    }

    // Карточка под снимком: сцена остаётся ровно 3:2, иначе точки съезжают с продуктов.
    &__frame.has-pop {
      padding-bottom: 96px;
    }

    &__stage {
      min-height: 0;
    }

    &__pop {
      top: calc(100% + 10px) !important;
      right: 0 !important;
      left: 0 !important;
      width: auto;
      transform: none;
      box-shadow: inset 0 0 0 1px var(--ft-line);
    }

    &__hint {
      display: none;
    }
  }
}
</style>
