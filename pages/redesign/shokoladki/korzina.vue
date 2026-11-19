<script lang="ts" setup>
// Корзина и оформление на одной странице, как /personal/cart/ + /personal/cart/order/ оригинала:
// количество, лента/открытка/упаковка у строк, наборы, промокод, город и способ получения, оплата, «Купить в один клик».
import { skPath, skProduct, skBoxes, skCards, skRub, skPlural, skDeliveryDates, SK_FREE_FROM, skContacts } from '~/utils/shokoladki'
import { skCandies } from '~/utils/shokoladki.data'
import { useSkStore, useSkUi, skLinePrice, type SkLine } from '~/composables/useShokoladki'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'
import SkPhone from '~/components/redesign/shokoladki/SkPhone.vue'

useSeoMeta({ title: 'Корзина — АПРИОРИ | Концепт редизайна' })
const store = useSkStore()
const ui = useSkUi()
const to = (p: string) => skPath(p)
onMounted(() => store.persist())

const box = (id?: string) => skBoxes.find((b) => b.id === id)
const candy = (id: string) => skCandies.find((c) => c.id === id)
const setSummary = (l: SkLine) => {
  if (!l.set) return ''
  const m = new Map<string, number>()
  l.set.candies.forEach((c) => c && m.set(c, (m.get(c) || 0) + 1))
  return [...m].map(([id, n]) => `${candy(id)?.n || ''}${n > 1 ? ` ×${n}` : ''}`).join(', ')
}
const setImg = (l: SkLine) => candy(l.set?.candies.find(Boolean) || '')?.img.replace(/\/upload\/iblock\/(\w+)\//, '/upload/resize_cache/iblock/$1/146_97_2/') || ''

// Промокод: в демо проверить нельзя — честно говорим
const promo = ref('')
const promoMsg = ref('')
const checkPromo = () => (promoMsg.value = promo.value.trim() ? `Промокод «${promo.value.trim()}» проверит магазин — в демо скидка не применяется` : '')

const ship = ref<'courier' | '5post'>('courier')
const dates = ref('')
onMounted(() => (dates.value = skDeliveryDates(store.cityInfo.value.zone)))
watch(
  () => store.city.value,
  () => (dates.value = skDeliveryDates(store.cityInfo.value.zone)),
)
const delivery = computed(() => (ship.value === '5post' ? null : store.courier.value))
const deliveryText = computed(() => {
  if (ship.value === '5post') return 'по тарифу 5Post'
  const c = store.courier.value
  if (c === 0) return 'бесплатно'
  return store.cityInfo.value.zone === 'msk' ? skRub(c || 0) : `от ${skRub(c || 0)}`
})
const total = computed(() => store.sum.value + (delivery.value || 0))

// Оформление
const step = ref<'cart' | 'order' | 'done'>('cart')
const f = reactive({ name: '', last: '', phone: '', email: '', addr: '', point: '', comment: '', pay: 'card', news: true })
const pays = [
  { id: 'card', n: 'Банковской картой', s: 'Visa, Mastercard, МИР — онлайн через ЮKassa' },
  { id: 'cash', n: 'Наличными курьеру', s: 'при получении' },
  { id: 'company', n: 'Оплата от юр. лица', s: 'счёт на организацию' },
]
const orderNo = ref('')
const confirm = () => {
  orderNo.value = String(Math.floor(100000 + Math.random() * 899999))
  step.value = 'done'
  store.clearCart()
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}
const goOrder = () => {
  step.value = 'order'
  nextTick(() => document.getElementById('oformlenie')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}
const oneClick = () => {
  ui.oneclick.value = 'cart'
  ui.modal.value = 'oneclick'
}
const toFav = (l: SkLine) => {
  if (l.id !== 'set' && !store.isFav(l.id)) store.toggleFav(l.id)
}
</script>

<template>
  <div class="sk-wrap sk-cart">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>Корзина</span>
    </nav>

    <div v-if="step === 'done'" class="sk-empty sk-cart__done">
      <SkIcon name="check" />
      <b class="sk-h2">Заказ № {{ orderNo }} оформлен</b>
      <p>Это демо: заказ никуда не отправлен. В рабочей версии менеджер позвонит для подтверждения — заказы обрабатываем пн–пт 10:00–18:00.</p>
      <NuxtLink :to="to('/katalog/')" class="sk-btn">Вернуться в каталог</NuxtLink>
    </div>

    <template v-else>
      <div class="sk-cart__head">
        <h1 class="sk-h1">Корзина</h1>
        <span v-if="store.count.value" class="sk-muted">{{ store.count.value }} {{ skPlural(store.count.value, 'товар', 'товара', 'товаров') }}</span>
        <button v-if="store.count.value" type="button" class="sk-link sk-cart__clear" @click="store.clearCart()"><SkIcon name="trash" />Очистить корзину</button>
      </div>

      <div v-if="!store.count.value" class="sk-empty">
        <b class="sk-h2">В корзине пока пусто</b>
        <p>Загляните в коллекцию или соберите свой набор конфет.</p>
        <div class="sk-chips">
          <NuxtLink :to="to('/katalog/')" class="sk-btn">В каталог</NuxtLink>
          <NuxtLink :to="to('/nabor/')" class="sk-btn sk-btn--line"><SkIcon name="candy" />Соберите набор</NuxtLink>
        </div>
      </div>

      <div v-else class="sk-cart__body">
        <div class="sk-cart__main">
          <p class="sk-cart__notice">Уважаемые покупатели! По техническим причинам оплата заказа бонусами временно приостановлена. Акции и скидки, указанные на сайте, остаются действительными.</p>

          <ul class="sk-lines">
            <li v-for="l in store.cart.value" :key="l.key" class="sk-line">
              <template v-if="l.id === 'set'">
                <span class="sk-line__img sk-line__img--set"><img :src="setImg(l)" alt="" /></span>
                <div class="sk-line__name">
                  <NuxtLink :to="to('/nabor/')">Набор «{{ box(l.set?.box)?.n }}»</NuxtLink>
                  <small>{{ setSummary(l) }}</small>
                  <small v-if="l.ribbon !== null" class="sk-line__extra"><SkIcon name="ribbon" />Лента{{ l.ribbon ? `: «${l.ribbon}»` : '' }}</small>
                  <small v-if="l.card" class="sk-line__extra"><SkIcon name="card" />{{ skCards.find((c) => c.id === l.card)?.n }}</small>
                </div>
              </template>
              <template v-else>
                <NuxtLink :to="to(`/tovar/${l.id}/`)" class="sk-line__img"><img :src="skProduct(l.id)?.img" alt="" /></NuxtLink>
                <div class="sk-line__name">
                  <NuxtLink :to="to(`/tovar/${l.id}/`)">{{ skProduct(l.id)?.n }}</NuxtLink>
                  <small v-if="l.ribbon !== null" class="sk-line__extra"><SkIcon name="ribbon" />Лента +100 ₽{{ l.ribbon ? `: «${l.ribbon}»` : '' }}</small>
                  <small v-if="l.card" class="sk-line__extra"><SkIcon name="card" />{{ skCards.find((c) => c.id === l.card)?.n }} +30 ₽</small>
                  <small v-if="l.pack" class="sk-line__extra"><SkIcon name="photo" />Упаковка «{{ l.pack.design }}»{{ l.pack.name ? `, имя: ${l.pack.name}` : '' }}{{ l.pack.photo ? ', с фото' : '' }}</small>
                  <button type="button" class="sk-link sk-line__fav" @click="toFav(l)"><SkIcon name="heart" />{{ store.isFav(l.id) ? 'В избранном' : 'В избранное' }}</button>
                </div>
              </template>
              <div class="sk-qty">
                <button type="button" aria-label="Меньше" @click="store.lineQty(l.key, l.qty - 1)"><SkIcon name="minus" /></button>
                <b>{{ l.qty }}</b>
                <button type="button" aria-label="Больше" @click="store.lineQty(l.key, l.qty + 1)"><SkIcon name="plus" /></button>
              </div>
              <div class="sk-line__sum">
                <b>{{ skRub(skLinePrice(l) * l.qty) }}</b>
                <small v-if="l.qty > 1">{{ skRub(skLinePrice(l)) }} / шт.</small>
              </div>
              <button type="button" class="sk-iconbtn sk-line__x" aria-label="Убрать из корзины" @click="store.remove(l.key)"><SkIcon name="close" /></button>
            </li>
          </ul>

          <!-- получение -->
          <section class="sk-box sk-cart__ship">
            <h2 class="sk-cart__h">Доставка</h2>
            <div class="sk-ship__city">
              <span>Город:</span>
              <button type="button" class="sk-link" @click="ui.modal.value = 'city'">{{ store.city.value }}<SkIcon name="down" /></button>
            </div>
            <div class="sk-cart__opts">
              <label class="sk-ship__opt" :class="{ 'is-on': ship === 'courier' }">
                <input v-model="ship" type="radio" value="courier" />
                <span><b>Курьером</b><small>{{ dates || '…' }}, курьер 9:00–21:00</small></span>
                <em>{{ store.courier.value === 0 ? 'бесплатно' : store.cityInfo.value.zone === 'msk' ? skRub(store.courier.value || 0) : `от ${skRub(store.courier.value || 0)}` }}</em>
              </label>
              <label class="sk-ship__opt" :class="{ 'is-on': ship === '5post' }">
                <input v-model="ship" type="radio" value="5post" />
                <span><b>Пункт выдачи 5Post</b><small>«Пятёрочка» и «Перекрёсток», до 3 дней</small></span>
                <em>по тарифу</em>
              </label>
            </div>
            <p v-if="store.cityInfo.value.zone === 'msk' && store.sum.value < SK_FREE_FROM" class="sk-ship__free">
              Добавьте товаров на {{ skRub(SK_FREE_FROM - store.sum.value) }} — доставка по Москве станет бесплатной
            </p>
            <p v-else-if="store.cityInfo.value.zone !== 'msk'" class="sk-muted sk-cart__small">Точную стоимость назовёт менеджер при подтверждении заказа.</p>
          </section>

          <!-- оформление -->
          <section v-if="step === 'order'" id="oformlenie" class="sk-box sk-cart__order">
            <h2 class="sk-cart__h">Оформление заказа</h2>
            <form class="sk-form sk-form--two" @submit.prevent="confirm">
              <label class="sk-field"><span>Имя</span><input v-model="f.name" class="sk-input" required autocomplete="given-name" /></label>
              <label class="sk-field"><span>Фамилия</span><input v-model="f.last" class="sk-input" autocomplete="family-name" /></label>
              <label class="sk-field"><span>Телефон</span><SkPhone v-model="f.phone" class="sk-input" required /></label>
              <label class="sk-field"><span>E-mail</span><input v-model="f.email" class="sk-input" type="email" required autocomplete="email" /></label>
              <label v-if="ship === 'courier'" class="sk-field sk-form__wide"><span>Адрес доставки</span><input v-model="f.addr" class="sk-input" required autocomplete="street-address" placeholder="Улица, дом, квартира" /></label>
              <label v-else class="sk-field sk-form__wide"><span>Пункт выдачи 5Post</span><input v-model="f.point" class="sk-input" required placeholder="Адрес магазина «Пятёрочка» или «Перекрёсток»" /></label>
              <label class="sk-field sk-form__wide"><span>Комментарий к заказу</span><textarea v-model="f.comment" class="sk-input" rows="3" /></label>
              <fieldset class="sk-pay sk-form__wide">
                <legend>Способ оплаты</legend>
                <label v-for="p in pays" :key="p.id" class="sk-ship__opt" :class="{ 'is-on': f.pay === p.id }">
                  <input v-model="f.pay" type="radio" :value="p.id" />
                  <span><b>{{ p.n }}</b><small>{{ p.s }}</small></span>
                </label>
                <label class="sk-ship__opt is-off" title="Временно приостановлено">
                  <input type="radio" disabled />
                  <span><b>Бонусами</b><small>временно приостановлено</small></span>
                </label>
              </fieldset>
              <label class="sk-check sk-check--small sk-form__wide"><input v-model="f.news" type="checkbox" /><span>Сообщите мне о скидках и новинках</span></label>
              <p class="sk-muted sk-cart__small sk-form__wide">Если что-то пойдёт не так и вы не получите товар — мы вернём деньги.</p>
              <button class="sk-btn sk-btn--big sk-form__wide" type="submit">Подтвердить заказ · {{ skRub(total) }}</button>
            </form>
          </section>
        </div>

        <aside class="sk-total">
          <div class="sk-total__rows">
            <div><span>Товары, {{ store.count.value }} шт.</span><b>{{ skRub(store.sum.value + store.oldSum.value) }}</b></div>
            <div v-if="store.oldSum.value"><span>Скидка</span><b class="sk-total__off">−{{ skRub(store.oldSum.value) }}</b></div>
            <div><span>Доставка</span><b>{{ deliveryText }}</b></div>
          </div>
          <div class="sk-total__sum"><span>Итого</span><b>{{ skRub(total) }}</b></div>
          <form class="sk-total__promo" @submit.prevent="checkPromo">
            <input v-model="promo" class="sk-input" placeholder="Промокод" aria-label="Промокод" />
            <button type="submit" class="sk-btn sk-btn--line">Применить</button>
          </form>
          <p v-if="promoMsg" class="sk-muted sk-cart__small">{{ promoMsg }}</p>
          <button v-if="step === 'cart'" type="button" class="sk-btn sk-btn--big" @click="goOrder">Оформить заказ</button>
          <button type="button" class="sk-btn sk-btn--line" @click="oneClick"><SkIcon name="bolt" />Купить в один клик</button>
          <button v-if="store.user.value" type="button" class="sk-btn sk-btn--line" disabled>Оплатить бонусами</button>
          <p class="sk-muted sk-cart__small">Вопросы по заказу: <a :href="`tel:${skContacts.shopTel}`">{{ skContacts.shopPhone }}</a></p>
          <NuxtLink :to="to('/katalog/')" class="sk-link">Вернуться и положить ещё</NuxtLink>
        </aside>
      </div>
    </template>
  </div>
</template>
