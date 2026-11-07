<script lang="ts" setup>
// Карточка K20 «от кого»: фото 1:1, фермер ссылкой, название без «от …», фасовки чипами, «В корзину» → счётчик прямо в карточке,
// у недоступного — «Предзаказ», как у оригинала.
import DrIcon from './DrIcon.vue'
import DrQty from './DrQty.vue'

const props = defineProps<{ p: DrProduct }>()
const shop = useDeredaShop()
const ui = useDrUi()

const v = ref(drFirstOn(props.p))
const price = computed(() => drPriceOf(props.p, v.value))
const old = computed(() => drOldOf(props.p, v.value))
const off = computed(() => drDiscount(props.p, v.value))
const on = computed(() => drAvailable(props.p, v.value))
const qty = computed(() => shop.qtyOf(props.p, v.value))
const farmer = computed(() => drFarmer(props.p.farmer))
const pack = computed(() => (props.p.variants.length ? '' : props.p.pack))
const title = computed(() => {
  const t = drShort(props.p.title)
  return t.length > 64 ? `${t.slice(0, t.lastIndexOf(' ', 62))}…` : t
})
// подпись чипа — до 14 знаков, полное название фасовки на странице товара
const chip = (t: string) => (t.length > 14 ? t.split(' ')[0] : t)
const to = computed(() => drPath(`/product/${props.p.id}`))

const add = () => {
  shop.add(props.p, v.value)
  ui.toast.value = `В корзине: ${title.value}`
  ui.toastCart.value = true
}
</script>

<template>
  <article class="dr-card" :class="{ 'is-out': !on }">
    <div class="dr-card__media">
      <NuxtLink :to="to" class="dr-card__img" tabindex="-1">
        <img :src="props.p.img" :alt="props.p.title" loading="lazy" width="360" height="360" />
      </NuxtLink>
      <div class="dr-card__marks">
        <span v-if="off" class="dr-mark dr-mark--sale">−{{ off }}&nbsp;%</span>
        <span v-if="props.p.isNew" class="dr-mark dr-mark--new">Новинка</span>
        <span v-if="!on" class="dr-mark dr-mark--out">Под заказ</span>
      </div>
      <button
        type="button"
        class="dr-card__fav"
        :class="{ 'is-on': shop.isFav(props.p.id) }"
        :aria-label="shop.isFav(props.p.id) ? 'Убрать из избранного' : 'В избранное'"
        @click="shop.toggleFav(props.p.id)"
      >
        <DrIcon name="heart" :size="20" :fill="shop.isFav(props.p.id)" />
      </button>
    </div>
    <div class="dr-card__body">
      <NuxtLink v-if="farmer" :to="{ path: drPath('/catalog'), query: { farmer: farmer.id } }" class="dr-card__farmer">
        <DrIcon name="farmer" :size="16" />
        <span>{{ farmer.name }}</span>
      </NuxtLink>
      <span v-else class="dr-card__farmer dr-card__farmer--none"><DrIcon name="leaf" :size="16" /><span>Фермерское</span></span>
      <NuxtLink :to="to" class="dr-card__title">{{ title }}</NuxtLink>
      <div v-if="props.p.variants.length > 1" class="dr-card__packs" role="group" aria-label="Фасовка">
        <button
          v-for="(x, i) in props.p.variants.slice(0, 4)"
          :key="x.t"
          type="button"
          :class="{ 'is-on': v === i, 'is-off': !x.on }"
          :title="x.t"
          @click="v = i"
        >
          {{ chip(x.t) }}
        </button>
      </div>
      <div class="dr-card__buy">
        <div class="dr-card__price">
          <b>{{ drMoney(price) }}</b>
          <s v-if="old">{{ drMoney(old) }}</s>
          <small v-if="pack">{{ pack }}</small>
        </div>
        <DrQty v-if="qty" :qty="qty" @inc="shop.inc(props.p, v)" @dec="shop.dec(props.p, v)" @set="shop.setQty(props.p, v, $event)" />
        <button v-else-if="on" type="button" class="dr-btn dr-btn--main dr-card__add" @click="add">
          <DrIcon name="basket" :size="19" />В корзину
        </button>
        <button v-else type="button" class="dr-btn dr-btn--line dr-card__add" @click="ui.preorder.value = props.p.id">Предзаказ</button>
      </div>
    </div>
  </article>
</template>

<style lang="scss">
.dr-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: var(--dr-R);
  background: var(--dr-card);

  &__media {
    position: relative;
  }

  &__img {
    position: relative;
    display: block;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: var(--dr-R);
    background: var(--dr-surface);

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

  &.is-out &__img img {
    opacity: 0.72;
  }

  &__marks {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    pointer-events: none;
  }

  &__fav {
    position: absolute;
    top: 8px;
    right: 8px;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.92);
    color: var(--dr-dark);
    cursor: pointer;

    &:hover,
    &.is-on {
      color: var(--dr-accent);
    }
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    padding: 12px 4px 4px;
  }

  &__farmer {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    align-self: flex-start;
    max-width: 100%;
    color: var(--dr-brown);
    font-size: 13px;
    font-weight: 600;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    svg {
      flex: none;
    }

    &:hover {
      color: var(--dr-accent);
    }

    &--none {
      color: var(--dr-muted);
      font-weight: 500;
    }
  }

  &__title {
    min-height: 2.7em;
    color: var(--dr-text);
    font-size: 15px;
    font-weight: 600;
    line-height: 1.35;

    &:hover {
      color: var(--dr-accent);
    }
  }

  &__packs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    button {
      height: 30px;
      padding: 0 10px;
      border: 1px solid var(--dr-line);
      border-radius: 999px;
      background: #fff;
      color: var(--dr-text);
      font: inherit;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;

      &.is-on {
        border-color: var(--dr-brown);
        background: var(--dr-brown);
        color: #fff;
      }

      &.is-off:not(.is-on) {
        color: var(--dr-muted);
        text-decoration: line-through;
      }
    }
  }

  &__buy {
    display: grid;
    gap: 10px;
    margin-top: auto;
    padding-top: 4px;
  }

  &__price {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 8px;

    b {
      color: var(--dr-text);
      font-size: 20px;
      font-weight: 700;
    }

    s {
      color: var(--dr-muted);
      font-size: 14px;
    }

    small {
      color: var(--dr-muted);
      font-size: 13px;
    }
  }

  &__add {
    width: 100%;
  }
}
</style>
