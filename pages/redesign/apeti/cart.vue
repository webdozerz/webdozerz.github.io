<script lang="ts" setup>
import { apImg, apMoney, apPath, apRub, apServices, apSlotText, apWeight, apWhen, apZoneList } from '~/utils/apeti'
import { apSlots } from '~/utils/apetiData'
import { useApShop, useApUi } from '~/composables/useApeti'
import ApIcon from '~/components/redesign/apeti/ApIcon.vue'
import ApPhone from '~/components/redesign/apeti/ApPhone.vue'
import ApQty from '~/components/redesign/apeti/ApQty.vue'

const shop = useApShop()
const ui = useApUi()
useSeoMeta({ title: 'Корзина — Apeti, концепт редизайна' })

const way = ref<'courier' | 'pickup'>('courier')
const zoneSel = computed({ get: () => shop.zone.value, set: (v: number) => shop.setZone(Number(v)) })
const now = ref<Date | null>(null)
const when = computed(() => (now.value ? apWhen(now.value) : null))
const day = ref<'today' | 'tomorrow'>('today')
const slot = ref('')
const slots = computed(() => (day.value === 'today' ? (when.value?.todaySlots ?? []) : apSlots))
watch(
  when,
  (w) => {
    if (w && !w.today) day.value = 'tomorrow'
  },
  { immediate: true },
)
watch(slots, (s) => {
  if (!s.includes(slot.value)) slot.value = s[0] ?? ''
})

// Промокод и баллы — как в корзине оригинала; в демо промокод не проверяется, баллы демонстрационные
const promo = ref('')
const promoMsg = ref('')
const applyPromo = () => {
  promoMsg.value = promo.value.trim() ? `Промокод «${promo.value.trim()}» проверит оператор — это демо.` : ''
}
const points = computed(() => (shop.user.value ? 150 : 0))
const usePoints = ref(0)
const spend = computed(() => Math.min(points.value, Math.max(0, Math.floor(Number(usePoints.value) || 0)), Math.floor(shop.total.value)))

const courierOk = computed(() => way.value === 'pickup' || shop.lack.value === 0)
const fee = computed(() => (way.value === 'courier' ? (shop.fee.value ?? 0) : 0))
const grand = computed(() => Math.max(0, shop.total.value - spend.value) + fee.value)
const progress = computed(() => Math.min(100, Math.round((shop.total.value / shop.min.value) * 100)))

const form = reactive({ name: '', phone: '', address: '', comment: '', pay: 'cash' })
const done = ref(false)
const submit = () => {
  if (!courierOk.value) return
  done.value = true
  shop.clear()
  window.scrollTo({ top: 0 })
}
onMounted(() => {
  shop.persist()
  now.value = new Date()
})
</script>

<template>
  <div class="ap-wrap ap-page">
    <nav class="ap-crumbs" aria-label="Хлебные крошки"><NuxtLink :to="apPath('/')">Главная</NuxtLink><span>Корзина</span></nav>
    <div class="ap-head ap-cart__head">
      <h1>Корзина</h1>
      <button v-if="shop.count.value" type="button" class="ap-link" @click="shop.clear()"><ApIcon name="trash" />Очистить</button>
    </div>

    <div v-if="done" class="ap-empty">
      <h2>Заказ оформлен</h2>
      <p>В настоящем магазине менеджер свяжется с вами, а курьер позвонит за час до прибытия. Это демо — заказ никуда не отправлен.</p>
      <NuxtLink :to="apPath('/catalog')" class="ap-btn">Вернуться в каталог</NuxtLink>
    </div>

    <div v-else-if="!shop.count.value" class="ap-empty">
      <h2>В корзине пока пусто</h2>
      <p>Положите что-нибудь на весы на главной или загляните в каталог.</p>
      <NuxtLink :to="apPath('/catalog')" class="ap-btn">В каталог</NuxtLink>
    </div>

    <div v-else class="ap-cart">
      <div class="ap-cart__main">
        <div class="ap-lines">
          <div v-for="l in shop.lines.value" :key="l.key" class="ap-line">
            <NuxtLink :to="apPath(`/product/${l.p.id}`)" class="ap-line__pic"><img :src="apImg(l.p)" alt="" width="80" height="80" loading="lazy" /></NuxtLink>
            <div class="ap-line__name">
              <NuxtLink :to="apPath(`/product/${l.p.id}`)">{{ l.p.n }}</NuxtLink>
              <small>{{ l.p.k ? `${apMoney(l.p.r)} за кг` : `${apMoney(l.p.p)} за шт` }}<template v-if="l.svc && l.p.v"> · {{ apServices[l.p.v].short.toLowerCase() }}</template></small>
            </div>
            <ApQty small :text="apWeight(l.p, l.n)" @dec="shop.setKey(l.key, l.n - 1)" @inc="shop.setKey(l.key, l.n + 1)" />
            <b class="ap-line__sum">{{ apMoney(l.sum) }}</b>
            <button type="button" class="ap-line__x" aria-label="Удалить" @click="shop.setKey(l.key, 0)"><ApIcon name="trash" /></button>
          </div>
        </div>
        <p v-if="shop.weighted.value" class="ap-cart__note">В заказе есть весовой товар: сумма может немного измениться при контрольном взвешивании.</p>

        <div class="ap-cart__extra">
          <form class="ap-panel" @submit.prevent="applyPromo">
            <b>Промокод</b>
            <div class="ap-inline"><input v-model="promo" type="text" placeholder="Введите промокод" aria-label="Промокод" /><button type="submit" class="ap-btn ap-btn--line">Применить</button></div>
            <p v-if="promoMsg">{{ promoMsg }}</p>
          </form>
          <div class="ap-panel">
            <b>Баллы: 1 балл = 1 рубль</b>
            <template v-if="shop.user.value">
              <div class="ap-inline"><input v-model="usePoints" type="number" min="0" :max="points" inputmode="numeric" aria-label="Списать баллов" /><span>из {{ points }} (демо)</span></div>
              <p v-if="spend">Спишем {{ spend }} {{ spend === 1 ? 'балл' : 'баллов' }}.</p>
            </template>
            <p v-else>Чтобы списать баллы, <button type="button" class="ap-link" @click="ui.open('login')">войдите</button>.</p>
          </div>
        </div>

        <form id="ap-order" class="ap-order" @submit.prevent="submit">
          <h2>Оформление заказа</h2>
          <div class="ap-seg ap-order__way">
            <button type="button" :class="{ 'is-on': way === 'courier' }" @click="way = 'courier'">Доставка курьером</button>
            <button type="button" :class="{ 'is-on': way === 'pickup' }" @click="way = 'pickup'">Самовывоз</button>
          </div>

          <template v-if="way === 'courier'">
            <label class="ap-field">
              <span>Район доставки</span>
              <select v-model="zoneSel">
                <option :value="-1" disabled>Выберите район</option>
                <optgroup label="Москва"><option v-for="z in apZoneList.filter((x) => !x.region)" :key="z.i" :value="z.i">{{ z.name }} — от {{ z.min }} ₽, доставка {{ z.fee }} ₽</option></optgroup>
                <optgroup label="За МКАД, до 30 км"><option v-for="z in apZoneList.filter((x) => x.region)" :key="z.i" :value="z.i">{{ z.name }} — от {{ z.min }} ₽, доставка {{ z.fee }} ₽</option></optgroup>
              </select>
            </label>
            <div class="ap-order__when">
              <div class="ap-seg">
                <button type="button" :class="{ 'is-on': day === 'today' }" :disabled="!when?.today" @click="day = 'today'">Сегодня</button>
                <button type="button" :class="{ 'is-on': day === 'tomorrow' }" @click="day = 'tomorrow'">Завтра</button>
              </div>
              <p v-if="when && !when.today">Заказы после 19:00 приезжают на следующий день.</p>
              <div class="ap-slots">
                <button v-for="s in slots" :key="s" type="button" :class="{ 'is-on': slot === s }" @click="slot = s">{{ apSlotText(s) }}</button>
              </div>
            </div>
            <label class="ap-field"><span>Адрес</span><input v-model="form.address" type="text" required placeholder="Улица, дом, квартира, подъезд" autocomplete="street-address" /></label>
          </template>
          <div v-else class="ap-panel ap-order__pickup">
            <ApIcon name="pin" />
            <p><b>Преображенский рынок</b>ул. Преображенский Вал, д. 17, с. 11. Заказ на любую сумму будет ждать вас на рынке.</p>
          </div>

          <div class="ap-order__two">
            <label class="ap-field"><span>Имя</span><input v-model="form.name" type="text" required autocomplete="name" /></label>
            <label class="ap-field"><span>Телефон</span><ApPhone v-model="form.phone" required /></label>
          </div>
          <label class="ap-field"><span>Комментарий к заказу</span><textarea v-model="form.comment" placeholder="Например: мясо нарезать на гуляш" /></label>
          <div class="ap-seg ap-order__pay">
            <button type="button" :class="{ 'is-on': form.pay === 'cash' }" @click="form.pay = 'cash'">Наличными</button>
            <button type="button" :class="{ 'is-on': form.pay === 'card' }" @click="form.pay = 'card'">Картой курьеру</button>
          </div>
        </form>
      </div>

      <aside class="ap-total">
        <h2>Ваш заказ</h2>
        <dl class="ap-total__rows">
          <div><dt>Товары, {{ shop.count.value }} поз.</dt><dd>{{ apMoney(shop.total.value) }}</dd></div>
          <div v-if="spend"><dt>Баллы</dt><dd>−{{ apRub(spend) }}</dd></div>
          <div v-if="way === 'courier'"><dt>Доставка</dt><dd>{{ shop.fee.value !== null ? apRub(shop.fee.value) : 'выберите район' }}</dd></div>
          <div v-else><dt>Самовывоз</dt><dd>бесплатно</dd></div>
        </dl>
        <div v-if="way === 'courier'" class="ap-total__min" :class="{ 'is-ok': !shop.lack.value }">
          <p v-if="shop.lack.value">До минимальной суммы{{ shop.z.value ? ` (${shop.z.value.short})` : '' }} — ещё <b>{{ apRub(shop.lack.value) }}</b></p>
          <p v-else><ApIcon name="check" />Минимальная сумма {{ apRub(shop.min.value) }} набрана</p>
          <i><em :style="{ width: `${progress}%` }" /></i>
          <button v-if="shop.lack.value" type="button" class="ap-link" @click="way = 'pickup'">Самовывоз — на любую сумму</button>
        </div>
        <div class="ap-total__sum"><span>Итого</span><b>{{ apMoney(grand) }}</b></div>
        <p v-if="way === 'courier' && slot" class="ap-total__when">{{ day === 'today' ? 'Сегодня' : 'Завтра' }}, {{ apSlotText(slot) }}. За час позвонит курьер.</p>
        <button type="submit" form="ap-order" class="ap-btn ap-btn--big" :disabled="!courierOk">Оформить заказ</button>
        <button type="button" class="ap-btn ap-btn--big ap-btn--line" @click="ui.open('quick', 'cart')">Купить в 1 клик</button>
        <p class="ap-total__note">Оплата при получении: наличными или картой курьеру.</p>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.ap .ap-cart { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 32px; align-items: start;
  &__head { margin-top: 12px; align-items: center; .ap-link { color: var(--ap-mute); } }
  &__main { display: grid; gap: 20px; min-width: 0; }
  &__note { font-size: 14px; color: var(--ap-mute); }
  &__extra { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;
    .ap-panel { display: grid; gap: 10px; align-content: start; padding: 18px; grid-template-columns: minmax(0, 1fr); }
    b { font-weight: 600; }
    p { font-size: 14px; color: var(--ap-mute); .ap-link { font-size: 14px; } }
  }
}
.ap .ap-inline { display: flex; align-items: center; gap: 8px;
  input { flex: 1; width: 0; min-width: 0; height: 44px; padding: 0 14px; border: 1px solid var(--ap-line); border-radius: var(--ap-r); background: #fff; outline: none; box-sizing: border-box; &:focus { border-color: var(--ap-acc); } }
  span { font-size: 14px; color: var(--ap-mute); white-space: nowrap; }
}
.ap .ap-lines { display: grid; border: 1px solid var(--ap-line); border-radius: var(--ap-R); overflow: hidden; }
.ap .ap-line { display: grid; grid-template-columns: 80px minmax(0, 1fr) 150px 110px 40px; grid-template-areas: 'pic name qty sum x'; gap: 16px; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--ap-line);
  &:last-child { border-bottom: 0; }
  &__pic { grid-area: pic; img { display: block; width: 80px; height: 80px; object-fit: contain; } }
  &__name { grid-area: name; display: grid; gap: 4px; min-width: 0; a { font-weight: 500; line-height: 1.3; &:hover { color: var(--ap-acc); } } small { color: var(--ap-mute); font-size: 13px; } }
  .ap-qty { grid-area: qty; }
  &__sum { grid-area: sum; text-align: right; font-family: var(--ap-head); font-size: 20px; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; }
  &__x, &__x:focus { grid-area: x; width: 40px; height: 40px; border: 0; border-radius: 10px; background: none; color: var(--ap-mute); display: grid; place-items: center; &:hover { color: #b3261e; background: var(--ap-sur); } }
}
.ap .ap-order { display: grid; gap: 16px; padding: 24px; border: 1px solid var(--ap-line); border-radius: var(--ap-R);
  h2 { font-size: 26px; }
  &__two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: start; }
  &__when { display: grid; gap: 10px; .ap-seg { max-width: 300px; button:disabled { opacity: .45; cursor: default; } } p { font-size: 14px; color: var(--ap-mute); } }
  &__pickup { display: flex; gap: 12px; padding: 16px 18px; .ap-icon { width: 24px; height: 24px; color: var(--ap-acc); } p { font-size: 14.5px; } b { display: block; } }
}
.ap .ap-slots { display: flex; flex-wrap: wrap; gap: 8px;
  button, button:focus { min-height: 38px; padding: 0 12px; border: 1px solid var(--ap-line); border-radius: 10px; background: #fff; font-size: 14px; font-variant-numeric: tabular-nums; white-space: nowrap; }
  button:hover { border-color: var(--ap-acc); }
  button.is-on, button.is-on:focus { background: var(--ap-soft); border-color: var(--ap-acc); font-weight: 600; }
}
.ap .ap-total { position: sticky; top: calc(var(--ap-bar) + 16px); display: grid; gap: 14px; padding: 24px; border-radius: var(--ap-R); background: var(--ap-sur);
  h2 { font-size: 24px; }
  &__rows { display: grid; gap: 8px; margin: 0; font-size: 15px;
    div { display: flex; justify-content: space-between; gap: 12px; }
    dt { color: var(--ap-mute); }
    dd { margin: 0; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; }
  }
  &__min { display: grid; gap: 8px; justify-items: start; padding: 14px; border-radius: var(--ap-r); background: #fff; font-size: 14px;
    p { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; }
    .ap-icon { width: 18px; height: 18px; color: var(--ap-acc); }
    > i { display: block; width: 100%; height: 6px; border-radius: 3px; background: var(--ap-line); overflow: hidden; }
    em { display: block; height: 100%; border-radius: 3px; background: var(--ap-or); transition: width .3s; }
    &.is-ok em { background: var(--ap-acc); }
    .ap-link { font-size: 14px; }
  }
  &__sum { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding-top: 12px; border-top: 1px solid var(--ap-line);
    span { font-weight: 600; }
    b { font-family: var(--ap-head); font-size: 32px; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; }
  }
  &__when, &__note { font-size: 13px; color: var(--ap-mute); }
}
@media (max-width: 1199px) {
  .ap .ap-cart { grid-template-columns: minmax(0, 1fr) 320px; gap: 20px; }
  .ap .ap-line { grid-template-columns: 64px minmax(0, 1fr) 130px 40px; grid-template-areas: 'pic name name x' 'pic qty sum sum'; gap: 8px 14px; &__pic img { width: 64px; height: 64px; } }
}
@media (max-width: 989px) {
  .ap .ap-cart { grid-template-columns: minmax(0, 1fr); }
  .ap .ap-total { position: static; }
}
@media (max-width: 576px) {
  .ap .ap-cart__extra, .ap .ap-order__two { grid-template-columns: minmax(0, 1fr); }
  .ap .ap-order { padding: 18px 16px; }
  .ap .ap-total { padding: 18px 16px; }
  .ap .ap-line { grid-template-columns: 56px minmax(0, 1fr) minmax(0, 1fr) 40px; grid-template-areas: 'pic name name x' 'qty qty sum sum'; padding: 12px; &__pic img { width: 56px; height: 56px; } &__sum { font-size: 18px; } }
  .ap .ap-order__way button, .ap .ap-order__pay button { padding: 0 6px; font-size: 13.500px; }
}
</style>
