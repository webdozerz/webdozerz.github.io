<script lang="ts" setup>
// Карточка «бирка фермы»: фото 4:3, порода и группа, факты строкой (вес тушки · сколько готовить / от 10 голов · взрослая),
// цена за кг и «≈ за тушку», счётчик тушками или головами. Стили — в оболочке: корзина и сравнение рисуют те же блоки.
import IzIcon from '~/components/redesign/izyumovskoe/IzIcon.vue'
import IzQty from '~/components/redesign/izyumovskoe/IzQty.vue'

const props = defineProps<{ p: IzProduct; row?: boolean }>()
const cart = useIzyumCart()
const ui = useIzyumUi()

const per = computed(() => izPerCarcass(props.p))
const group = computed(() => {
  const g = izGroup(props.p.group)
  const parent = g?.parent ? izGroup(g.parent) : null
  return props.p.section === 'molodnyak' ? `Молодняк · ${parent?.title ?? g?.title}` : (parent?.title ?? g?.title)
})
const facts = computed(() => {
  const p = props.p
  const f: string[] = []
  if (p.unit === 'гол.') f.push(`от ${p.min} голов`)
  if (p.weight) f.push(`тушка ${p.weight[0].toLocaleString('ru-RU')}–${p.weight[1].toLocaleString('ru-RU')} кг`)
  if (p.cook) f.push(`готовить ${p.cook}`)
  if (p.adult && p.unit === 'гол.') f.push(`взрослая ${p.adult}`)
  return f.slice(0, 2)
})
const to = computed(() => izPath(`/product/${props.p.id}`))
const ask = computed(() => ({ path: izPath('/kontakty'), query: { about: props.p.title } }))
const added = () => {
  cart.add(props.p)
  ui.toast.value = `${props.p.title} — в корзине`
}
</script>

<template>
  <article class="iz-card" :class="{ 'is-out': !props.p.stock, 'iz-card--row': props.row }">
    <NuxtLink :to="to" class="iz-card__photo">
      <img :src="props.p.img" :alt="props.p.title" width="480" height="360" loading="lazy" />
      <span class="iz-card__tags">
        <span v-if="props.p.isNew" class="iz-tag iz-tag--new">Новинка</span>
        <span v-else-if="props.p.label && props.p.stock" class="iz-tag">{{ props.p.label }}</span>
        <span v-if="!props.p.stock" class="iz-tag iz-tag--out">Нет в наличии</span>
      </span>
    </NuxtLink>
    <button
      type="button"
      class="iz-card__cmp"
      :class="{ 'is-on': cart.inCompare(props.p.id) }"
      :aria-label="cart.inCompare(props.p.id) ? 'Убрать из сравнения' : 'Сравнить'"
      :title="cart.inCompare(props.p.id) ? 'В сравнении' : 'Сравнить'"
      @click="cart.toggleCompare(props.p.id)"
    >
      <IzIcon name="scales" :size="19" />
    </button>

    <div class="iz-card__body">
      <span class="iz-card__group">{{ group }}</span>
      <NuxtLink :to="to" class="iz-card__title">{{ props.p.title }}</NuxtLink>
      <ul v-if="facts.length" class="iz-card__facts">
        <li v-for="f in facts" :key="f">{{ f }}</li>
      </ul>

      <div class="iz-card__foot">
        <div class="iz-card__price">
          <template v-if="props.p.price !== null">
            <b>{{ izMoney(props.p.price) }}<small>/{{ props.p.unit === 'кг' ? 'кг' : 'гол.' }}</small></b>
            <span v-if="per">≈ {{ izMoney(per[0]) }}–{{ izMoney(per[1]) }} за тушку</span>
            <span v-else-if="props.p.unit === 'гол.'">{{ izMoney(props.p.price * props.p.min) }} за {{ props.p.min }} голов</span>
          </template>
          <template v-else>
            <b class="is-ask">Цена по запросу</b>
            <span>назовём по телефону</span>
          </template>
        </div>

        <template v-if="props.p.stock">
          <IzQty v-if="cart.qtyOf(props.p.id)" :p="props.p" />
          <button v-else type="button" class="iz-btn iz-btn--main iz-card__buy" @click="added">
            <IzIcon name="bag" :size="19" />{{ props.p.unit === 'гол.' ? `${props.p.min} гол.` : 'В корзину' }}
          </button>
        </template>
        <NuxtLink v-else :to="ask" class="iz-btn iz-btn--line iz-card__buy">Спросить</NuxtLink>
      </div>
    </div>
  </article>
</template>
