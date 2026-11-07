<script lang="ts" setup>
// K19 «банка на зелёном»: одна карточка на сорт, фасовки 1 / 1,5 / 3 кг меняют фото, цену и «₽ за кг».
// Стили — в оболочке (.gm-jar), карточка стоит и на главной, и в магазине.
import GmIcon from '~/components/redesign/gornyimed/GmIcon.vue'
import GmQty from '~/components/redesign/gornyimed/GmQty.vue'

const props = defineProps<{ sort: GmSortId; start?: string }>()
const shop = useGornyimedShop()
const ui = useGornyimedUi()

const sort = computed(() => gmSort(props.sort)!)
const packs = computed(() => gmPacksOf(props.sort))
const picked = ref(props.start && gmProduct(props.start)?.sort === props.sort ? props.start : packs.value[0].id)
const p = computed(() => gmProduct(picked.value)!)
const key = computed(() => `p:${p.value.id}`)
const inCart = computed(() => shop.qtyOf(key.value))
const best = computed(() => packs.value[packs.value.length - 1])
const saving = computed(() => Math.round((1 - gmPerKg(best.value) / gmPerKg(packs.value[0])) * 100))

const qty = computed({
  get: () => inCart.value,
  set: (n: number) => shop.setQty(key.value, n),
})
const buy = () => {
  shop.add(key.value)
  ui.say(`В корзине: ${sort.value.title}, ${p.value.pack}`)
}
</script>

<template>
  <article class="gm-jar">
    <NuxtLink :to="gmPath(`/product/${p.id}`)" class="gm-jar__photo" :aria-label="p.title">
      <img v-for="x in packs" :key="x.id" :src="x.img" :alt="x.title" :class="{ 'is-on': x.id === p.id }" width="900" height="1200" loading="lazy" />
      <span class="gm-label">Сбор 2026</span>
    </NuxtLink>
    <div class="gm-jar__body">
      <div class="gm-jar__head">
        <h3><NuxtLink :to="gmPath(`/product/${p.id}`)">{{ sort.title }}</NuxtLink></h3>
        <span class="gm-jar__hue" :style="{ background: sort.hue }" aria-hidden="true" />
      </div>
      <p class="gm-jar__note">{{ sort.note }}</p>

      <div class="gm-packs" role="radiogroup" :aria-label="`Фасовка, ${sort.short}`">
        <button
          v-for="x in packs"
          :key="x.id"
          type="button"
          role="radio"
          :aria-checked="x.id === p.id"
          class="gm-packs__btn"
          :class="{ 'is-on': x.id === p.id }"
          @click="picked = x.id"
        >
          <b>{{ x.pack }}</b>
          <span>{{ gmMoney(x.price) }}</span>
        </button>
      </div>

      <p class="gm-jar__kg">
        <span>{{ gmMoney(gmPerKg(p)) }} за кг · {{ p.tara }}</span>
        <small v-if="p.id !== best.id">в банке {{ best.pack }} — {{ gmMoney(gmPerKg(best)) }} за кг, на {{ saving }}&nbsp;% дешевле</small>
        <small v-else>самый выгодный килограмм в банке</small>
      </p>

      <div class="gm-jar__buy">
        <div class="gm-jar__price">
          <b>{{ gmMoney(p.price) }}</b>
          <span>{{ p.pack }}</span>
        </div>
        <GmQty v-if="inCart" v-model="qty" :min="0" />
        <button v-else type="button" class="gm-btn gm-btn--main" @click="buy"><GmIcon name="bag" :size="19" />В корзину</button>
      </div>
    </div>
  </article>
</template>
