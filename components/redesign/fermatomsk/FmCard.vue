<script lang="ts" setup>
import FmQty from './FmQty.vue'

// Карточка K4: снимок 3:4 на всю карточку, плашка «название · цена · +» на пустом низу кадра.
const props = defineProps<{ product: FmProduct }>()
const ui = useFermatomskUi()
const order = useFermatomskOrder()
</script>

<template>
  <article class="fm-card">
    <button type="button" class="fm-card__photo" :aria-label="`Подробнее: ${props.product.name}`" @click="ui.product.value = props.product.id">
      <img :src="props.product.img" :alt="props.product.name" width="300" height="400" loading="lazy" />
    </button>
    <div class="fm-card__plate">
      <h3 class="fm-card__name">
        <button type="button" @click="ui.product.value = props.product.id">{{ props.product.name }}</button>
      </h3>
      <div class="fm-card__row">
        <p class="fm-card__price" :class="{ 'is-short': order.qtyOf(props.product.id) }">
          <b>{{ fmPrice(props.product.price) }}</b>
          <span>за {{ props.product.unit }}</span>
        </p>
        <FmQty :id="props.product.id" />
      </div>
    </div>
  </article>
</template>

<style lang="scss">
.fm-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--fm-r-lg);
  background: var(--fm-photo);
  aspect-ratio: 3 / 4;
  min-height: 300px;

  &__photo {
    position: absolute;
    inset: 0;
    width: 100%;
    cursor: zoom-in;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 30%;
      transition: transform 0.35s;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }


  &__plate {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    display: grid;
    gap: 6px;
    padding: 12px 12px 10px 14px;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 6px 20px rgba(47, 36, 25, 0.08);
  }

  &__name {
    font-size: 17px;
    font-weight: 600;
    line-height: 1.25;

    button {
      text-align: left;
    }

    button:hover {
      color: var(--fm-green-d);
    }
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    .fm-qty.is-on {
      flex: 1 0 134px;
      justify-content: space-between;
    }
  }

  &__price {
    display: flex;
    align-items: baseline;
    gap: 6px;
    white-space: nowrap;

    b {
      font-size: 18px;
      font-weight: 700;
    }

    span {
      color: var(--fm-muted);
      font-size: 14px;
    }

    // Со счётчиком фасовка видна в нём («2 × 1 л»): цена и счётчик остаются в одной строке.
    &.is-short span {
      display: none;
    }
  }

  // В узкой карточке плашка поверх снимка закрывала бы товар: снимок сверху, плашка под ним.
  @media (max-width: 1199px) {
    display: flex;
    flex-direction: column;
    aspect-ratio: auto;
    min-height: 0;

    &__photo {
      position: relative;
      inset: auto;
      aspect-ratio: 1;

      img {
        object-position: center 45%;
      }
    }

    &__plate {
      position: static;
      flex: 1;
      grid-template-rows: auto 1fr;
      border-radius: 0;
      box-shadow: none;
    }

    // Кнопка и счётчик во всю ширину отдельной строкой — плашки в ряду одной высоты.
    &__row {
      align-self: end;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      justify-content: stretch;
      gap: 8px;

      .fm-qty,
      .fm-qty__add {
        width: 100%;
      }

      .fm-qty.is-on {
        justify-content: space-between;
      }
    }

    &__price.is-short span {
      display: inline;
    }
  }

  @media (max-width: 576px) {
    &__plate {
      padding: 10px 10px 10px 12px;
    }

    &__name {
      font-size: 15px;
    }

    &__price b {
      font-size: 16px;
    }

    &__price span {
      font-size: 13px;
    }

  }
}
</style>
