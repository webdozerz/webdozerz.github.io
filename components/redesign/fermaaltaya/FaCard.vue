<script lang="ts" setup>
// «Весовая этикетка»: их предметка на белом, фасовка, цена за единицу и «≈ сумма за упаковку» у весового товара
import FaIcon from './FaIcon.vue'
import FaQty from './FaQty.vue'

const props = withDefaults(defineProps<{ p: FaProduct; row?: boolean; eager?: boolean }>(), { row: false, eager: false })
const cart = useFermaAltaya()
const ui = useFaUi()
const to = computed(() => faPath(`/product/${props.p.id}`))
const each = computed(() => faEach(props.p))
const weighed = computed(() => faWeighed(props.p))
const sale = computed(() => (props.p.old ? Math.round((1 - props.p.price / props.p.old) * 100) : 0))
const inCart = computed(() => cart.qtyOf(props.p.id) > 0)
const buy = () => {
  cart.add(props.p)
  ui.toast.value = `«${props.p.title}» — в корзине`
}
</script>

<template>
  <article class="fa-card" :class="{ 'is-row': props.row, 'is-in': inCart }">
    <NuxtLink :to="to" class="fa-card__ph">
      <img :src="faImg(props.p.img)" :alt="props.p.title" width="300" height="300" :loading="props.eager ? 'eager' : 'lazy'" />
      <span v-if="props.p.hit || props.p.isNew || sale" class="fa-card__labels">
        <span v-if="sale" class="fa-label fa-label--sale">−{{ sale }}&nbsp;%</span>
        <span v-if="props.p.hit" class="fa-label fa-label--hit">Хит</span>
        <span v-if="props.p.isNew" class="fa-label fa-label--new">Новинка</span>
      </span>
    </NuxtLink>
    <button
      type="button"
      class="fa-card__fav"
      :class="{ 'is-on': cart.isFav(props.p.id) }"
      :aria-label="cart.isFav(props.p.id) ? 'Убрать из избранного' : 'В избранное'"
      @click="cart.toggleFav(props.p.id)"
    >
      <FaIcon name="heart" :size="20" :fill="cart.isFav(props.p.id)" />
    </button>
    <div class="fa-card__body">
      <div class="fa-card__meta">
        <span v-if="props.p.pack" class="fa-card__pack"><FaIcon name="scales" :size="14" />{{ props.p.pack }}</span>
        <span v-if="props.p.votes" class="fa-card__rate"><FaIcon name="star" :size="13" fill />{{ props.p.rating.toFixed(1).replace('.', ',') }}</span>
      </div>
      <NuxtLink :to="to" class="fa-card__title">{{ props.p.title }}</NuxtLink>
      <div class="fa-card__price">
        <div class="fa-card__now">
          <b>{{ faMoney(props.p.price) }}</b>
          <s v-if="props.p.old">{{ faMoney(props.p.old) }}</s>
          <small>{{ faUnitLabel(props.p) }}</small>
        </div>
        <span v-if="weighed" class="fa-card__est">≈&nbsp;{{ faRange(each) }} {{ props.p.sec === 'ptitsa' ? 'за тушку' : 'за упаковку' }}</span>
        <span class="fa-card__bonus">+{{ Math.floor(each[0] * FA_BONUS) }} баллов</span>
      </div>
      <div class="fa-card__buy">
        <FaQty v-if="inCart" :p="props.p" />
        <button v-else type="button" class="fa-btn fa-btn--main fa-card__add" @click="buy">
          <FaIcon name="bag" :size="18" /><span>В корзину</span>
        </button>
      </div>
    </div>
  </article>
</template>
