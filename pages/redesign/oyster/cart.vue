<script lang="ts" setup>
import { OY_COURIER_FROM, oyContacts, oyDelivery, oyImg, oyIntervals, oyMoney, oyPath, oyPayment, oyProducts, oyServices, oyShort, oyStep, oyUnitText } from '~/utils/oyster'
import { useOyShop, useOyUi } from '~/composables/useOyster'
import type { OyCustomer } from '~/composables/useOyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'
import OyPhone from '~/components/redesign/oyster/OyPhone.vue'
import OyShelf from '~/components/redesign/oyster/OyShelf.vue'

useSeoMeta({ title: 'Корзина — Oyster Market | Концепт редизайна' })
const shop = useOyShop()
const ui = useOyUi()

const way = ref('door')
const interval = ref(oyIntervals[0])
const pay = ref(oyPayment[0].title)
const c = reactive<OyCustomer>(shop.emptyCustomer())
const restored = ref(false)
const done = ref<{ id: number; total: number } | null>(null)

// Машиной — от 3 000 ₽; если сумма упала ниже, переключаем на Яндекс
watch(
  () => shop.canCourier.value,
  (ok) => {
    if (!ok && (way.value === 'door' || way.value === 'flat')) way.value = 'yandex'
  },
  { immediate: true },
)
const left = computed(() => Math.max(0, OY_COURIER_FROM - shop.total.value))
const progress = computed(() => Math.min(100, (shop.total.value / OY_COURIER_FROM) * 100))
const shipPrice = computed(() => (way.value === 'yandex' ? 0 : (shop.deliveryPrice(way.value) ?? 0)))
const discount = computed(() => (way.value === 'pickup' ? shop.pickupOff.value : 0))
const grand = computed(() => shop.total.value + shipPrice.value - discount.value)
const phoneOk = computed(() => c.phone.replace(/\D/g, '').length === 11)
const needAddress = computed(() => way.value !== 'pickup')
const canOrder = computed(() => shop.count.value > 0 && phoneOk.value && c.name.trim() && (!needAddress.value || c.address.trim()))

const lineStep = (l: { p: (typeof oyProducts)[number]; v: number }) => oyStep(l.p, l.v)
const bump = (key: string, qty: number, step: number, d: number) => shop.setKey(key, Math.max(0, Math.round((qty + d * step) * 10) / 10))

// «Наш сервис запоминает данные о пользователе… и предложит повторить данные предыдущего заказа»
onMounted(() => {
  shop.persist()
  if (shop.last.value) {
    Object.assign(c, shop.last.value)
    restored.value = true
  }
})
const order = () => {
  if (!canOrder.value) return
  shop.remember({ ...c })
  done.value = { id: 10000 + Math.floor(Math.random() * 89999), total: grand.value }
  shop.clear()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const extras = computed(() => oyProducts.filter((p) => ['Лимон', 'Нож устричный', 'Соус для устриц', 'Лёд фраппе', 'Вилка устричная'].some((n) => p.name.startsWith(n))))
// Отметка «открыть / разделать» в строке: переносим количество в соседнюю строку того же товара
const toggleSvc = (l: { key: string; p: { id: string }; v: number; svc: boolean; qty: number }) => {
  const merged = shop.qtyOf(l.p.id, l.v, !l.svc) + l.qty
  shop.remove(l.key)
  shop.set(l.p.id, l.v, !l.svc, merged)
}
const svcShort =(l: { p: { service?: keyof typeof oyServices } }) => (l.p.service ? oyServices[l.p.service] : null)
</script>

<template>
  <div class="oy-wrap oy-page oy-cart">
    <nav class="oy-crumbs" aria-label="Навигация">
      <NuxtLink :to="oyPath('/')">Главная</NuxtLink>
      <span>Корзина</span>
    </nav>

    <div v-if="done" class="oy-done">
      <span class="oy-modal__ok"><OyIcon name="check" :size="30" /></span>
      <h1 class="oy-title">Заказ №{{ done.id }} оформлен</h1>
      <p class="oy-lead">
        На {{ oyMoney(done.total) }}. Это концепт — заказ никуда не ушёл. На настоящем сайте менеджер перезвонит на {{ c.phone }}, подтвердит заказ и пришлёт ссылку на оплату,
        если выбрали оплату по ссылке.
      </p>
      <div class="oy-hero__btns">
        <NuxtLink :to="oyPath('/catalog/')" class="oy-btn oy-btn--accent oy-btn--big">Вернуться в каталог</NuxtLink>
        <a :href="oyContacts.telegram" target="_blank" rel="noopener" class="oy-btn oy-btn--line oy-btn--big">Написать в Telegram</a>
      </div>
    </div>

    <template v-else>
      <h1 class="oy-title">Корзина</h1>
      <div v-if="!shop.count.value" class="oy-empty">
        <span class="oy-mask" :style="{ '--m': `url(${oyImg('ic/oyster.png')})` }" />
        <h2>В корзине пусто</h2>
        <p>Загляните в устрицы в наличии или соберите сет — доставим сегодня, если заказ до 19:00.</p>
        <NuxtLink :to="oyPath('/catalog/ustritsy/')" class="oy-btn oy-btn--accent">Устрицы в наличии</NuxtLink>
      </div>

      <div v-else class="oy-cart__grid">
        <div class="oy-cart__left">
          <div class="oy-cart__bar" :class="{ 'is-ok': !left }">
            <OyIcon name="truck" :size="22" />
            <div>
              <b v-if="left">До доставки нашей машиной — ещё {{ oyMoney(left) }}</b>
              <b v-else>Доставим нашей машиной: 800 ₽ до подъезда или 1 200 ₽ до квартиры</b>
              <span class="oy-cart__track"><i :style="{ width: `${progress}%` }" /></span>
              <small v-if="left">Пока можно Яндекс Доставкой по их тарифу или самовывозом</small>
            </div>
          </div>

          <ul class="oy-lines">
            <li v-for="l in shop.lines.value" :key="l.key" class="oy-line">
              <NuxtLink :to="oyPath(`/product/${l.p.id}/`)" class="oy-line__pic"><img :src="l.p.img" :alt="l.p.name" width="88" height="88" /></NuxtLink>
              <div class="oy-line__info">
                <NuxtLink :to="oyPath(`/product/${l.p.id}/`)" class="oy-line__name">{{ oyShort(l.p.name, 70) }}</NuxtLink>
                <span class="oy-line__opts">
                  <template v-if="l.variant">{{ l.variant }} · </template>{{ oyMoney(l.price) }} {{ oyUnitText(l.unit) }}
                </span>
                <label v-if="svcShort(l)" class="oy-svc oy-line__svc">
                  <input type="checkbox" :checked="l.svc" @change="toggleSvc(l)" />
                  <span class="oy-svc__box"><OyIcon name="check" :size="14" /></span>
                  <span>{{ svcShort(l)!.short }} <em>+{{ l.svcPrice || svcShort(l)!.price }} ₽/{{ svcShort(l)!.per }}</em></span>
                </label>
              </div>
              <div class="oy-line__qty oy-qty oy-qty--small">
                <button type="button" class="oy-qty__btn" aria-label="Меньше" @click="bump(l.key, l.qty, lineStep(l), -1)"><OyIcon name="minus" :size="16" /></button>
                <span class="oy-qty__val">{{ l.qty.toLocaleString('ru-RU') }} {{ l.unit === 'набор' ? 'шт' : l.unit }}</span>
                <button type="button" class="oy-qty__btn" aria-label="Больше" @click="bump(l.key, l.qty, lineStep(l), 1)"><OyIcon name="plus" :size="16" /></button>
              </div>
              <b class="oy-line__sum">{{ oyMoney(l.sum) }}</b>
              <button type="button" class="oy-line__del" aria-label="Удалить" @click="shop.remove(l.key)"><OyIcon name="trash" :size="20" /></button>
            </li>
          </ul>
          <div class="oy-cart__under">
            <NuxtLink :to="oyPath('/catalog/')" class="oy-head__link"><OyIcon name="left" :size="18" />Вернуться и положить ещё</NuxtLink>
            <button type="button" class="oy-cart__clear" @click="shop.clear()">Очистить корзину</button>
          </div>

          <form class="oy-checkout" @submit.prevent="order">
            <h2>Оформление заказа</h2>
            <p v-if="restored" class="oy-checkout__restored"><OyIcon name="repeat" :size="18" />Подставили данные из прошлого заказа — проверьте, всё ли верно.</p>

            <fieldset class="oy-checkout__step">
              <legend>Способ получения</legend>
              <div class="oy-ways2">
                <label v-for="d in oyDelivery" :key="d.id" class="oy-way" :class="{ 'is-on': way === d.id, 'is-off': (d.id === 'door' || d.id === 'flat') && !shop.canCourier.value }">
                  <input v-model="way" type="radio" name="way" :value="d.id" :disabled="(d.id === 'door' || d.id === 'flat') && !shop.canCourier.value" />
                  <span class="oy-way__top"><b>{{ d.title }}</b><em>{{ d.price === null ? 'тариф Яндекса' : d.price === 0 ? (shop.pickupOff.value ? `−${oyMoney(shop.pickupOff.value)}` : '0 ₽') : oyMoney(d.price) }}</em></span>
                  <small>{{ d.note }}</small>
                </label>
              </div>
            </fieldset>

            <fieldset v-if="way !== 'pickup'" class="oy-checkout__step">
              <legend>Адрес и время</legend>
              <label class="oy-field"><span>Адрес доставки</span><input v-model="c.address" autocomplete="street-address" placeholder="Улица, дом, квартира" /></label>
              <div v-if="way !== 'yandex'" class="oy-seg oy-checkout__int">
                <button v-for="i in oyIntervals" :key="i" type="button" :class="{ 'is-on': interval === i }" @click="interval = i">{{ i }}</button>
              </div>
              <small class="oy-checkout__hint">Интервал 11–16 или 15–21 — для заказов, принятых не позже чем за день. В праздничные и предпраздничные дни интервальной доставки нет.</small>
            </fieldset>
            <div v-else class="oy-panel oy-checkout__pick">
              <OyIcon name="pin" :size="22" />
              <span><b>{{ oyContacts.address }}</b><small>{{ oyContacts.addressNote }}. Соберём за 20–60 минут — позвоним, когда будет готово.</small></span>
            </div>

            <fieldset class="oy-checkout__step">
              <legend>Покупатель</legend>
              <div class="oy-form-grid">
                <label class="oy-field"><span>ФИО</span><input v-model="c.name" autocomplete="name" /></label>
                <label class="oy-field"><span>Телефон</span><OyPhone v-model="c.phone" /></label>
                <label class="oy-field"><span>E-mail</span><input v-model="c.email" type="email" autocomplete="email" placeholder="Для чека, необязательно" /></label>
                <label class="oy-field"><span>Комментарий</span><input v-model="c.comment" placeholder="Подъезд, домофон, удобное время" /></label>
              </div>
            </fieldset>

            <fieldset class="oy-checkout__step">
              <legend>Оплата</legend>
              <div class="oy-seg">
                <button v-for="pm in oyPayment.slice(0, 2)" :key="pm.title" type="button" :class="{ 'is-on': pay === pm.title }" @click="pay = pm.title">{{ pm.title }}</button>
              </div>
              <small class="oy-checkout__hint">Юрлицам — по договору, с отсрочкой платежа: <NuxtLink :to="oyPath('/opt/')">оптовым клиентам</NuxtLink>.</small>
            </fieldset>
          </form>
        </div>

        <aside class="oy-sum">
          <div class="oy-sum__box">
            <h2>Ваш заказ</h2>
            <dl>
              <div><dt>Товары · {{ shop.count.value }}</dt><dd>{{ oyMoney(shop.total.value) }}</dd></div>
              <div v-if="way === 'pickup'"><dt>Скидка 5% на живые при самовывозе</dt><dd class="oy-sum__off">−{{ oyMoney(discount) }}</dd></div>
              <div><dt>Доставка</dt><dd>{{ way === 'yandex' ? 'по тарифу Яндекса' : way === 'pickup' ? 'самовывоз' : oyMoney(shipPrice) }}</dd></div>
            </dl>
            <div class="oy-sum__total"><span>Итого</span><b>{{ oyMoney(grand) }}</b></div>
            <button type="button" class="oy-btn oy-btn--accent oy-btn--big oy-btn--block" :disabled="!canOrder" @click="order">Оформить заказ</button>
            <button type="button" class="oy-btn oy-btn--line oy-btn--block" @click="ui.open('quick')">Быстрый заказ — перезвоним</button>
            <small v-if="!canOrder" class="oy-sum__need">Чтобы оформить, укажите имя, телефон{{ needAddress ? ' и адрес' : '' }}</small>
            <small class="oy-sum__note">Весовые позиции (рыба, краб) пересчитаем после взвешивания.</small>
          </div>
        </aside>
      </div>

      <section v-if="shop.count.value && extras.length" class="oy-sec">
        <div class="oy-head"><h2>К устрицам пригодится</h2></div>
        <OyShelf :items="extras" />
      </section>
    </template>
  </div>
</template>

<style lang="scss">
.oy-cart {
  > .oy-title { margin-bottom: 20px; }
  &__grid { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 28px; align-items: start; @media (max-width: 1199px) { grid-template-columns: minmax(0, 1fr) 320px; } @media (max-width: 989px) { grid-template-columns: minmax(0, 1fr); } }
  &__left { display: grid; gap: 18px; min-width: 0; }
  &__bar {
    display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 12px; padding: 16px 18px; border-radius: 14px; background: var(--oy-gold-soft); color: var(--oy-gold);
    div { display: grid; gap: 8px; }
    b { color: var(--oy-ink); font-size: 15px; }
    small { color: var(--oy-muted); font-size: 13px; }
    &.is-ok { background: var(--oy-ok-soft); color: var(--oy-ok); }
  }
  &__track { display: block; height: 6px; border-radius: 3px; background: rgba(0, 53, 63, .1); overflow: hidden; i { display: block; height: 100%; background: var(--oy-accent); border-radius: 3px; transition: width .3s; } }
  &__under { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  &__clear { color: var(--oy-muted); font-size: 14px; &:hover { color: var(--oy-sale); } }
}
.oy-lines { display: grid; border-top: 1px solid var(--oy-line); }
.oy-line {
  display: grid; grid-template-columns: 88px minmax(0, 1fr) auto 110px 40px; gap: 16px; align-items: start; padding: 16px 0; border-bottom: 1px solid var(--oy-line);
  &__pic img { width: 88px; height: 88px; border-radius: 12px; object-fit: cover; }
  &__info { display: grid; gap: 6px; min-width: 0; }
  &__name { font-weight: 600; color: var(--oy-ink); line-height: 1.35; &:hover { color: var(--oy-accent); } }
  &__opts { font-size: 13px; color: var(--oy-muted); }
  &__qty, &__sum, &__del { min-height: 40px; align-self: start; }
  &__sum { display: flex; align-items: center; justify-content: flex-end; font-size: 17px; color: var(--oy-ink); white-space: nowrap; font-variant-numeric: tabular-nums; }
  &__del { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; color: var(--oy-muted); &:hover { color: var(--oy-sale); background: #fdecea; } }
  @media (max-width: 576px) {
    grid-template-columns: 64px minmax(0, 1fr) 40px; grid-template-areas: 'pic info del' 'qty qty sum'; gap: 10px 12px;
    &__pic { grid-area: pic; img { width: 64px; height: 64px; } }
    &__info { grid-area: info; }
    &__del { grid-area: del; }
    &__qty { grid-area: qty; justify-self: start; }
    &__sum { grid-area: sum; }
  }
}
.oy-checkout {
  display: grid; gap: 22px; margin-top: 12px; padding: 28px; border-radius: 20px; background: var(--oy-surface);
  h2 { font-size: 34px; }
  &__restored { display: flex; gap: 8px; align-items: center; color: var(--oy-ok); font-weight: 600; font-size: 14px; }
  &__step { display: grid; gap: 12px; margin: 0; padding: 0; border: 0; min-width: 0; legend { padding: 0; margin-bottom: 12px; font-family: 'Advent Pro', sans-serif; font-size: 22px; font-weight: 700; color: var(--oy-ink); } }
  &__int { @media (max-width: 576px) { display: grid; grid-template-columns: minmax(0, 1fr); } }
  &__hint { color: var(--oy-muted); font-size: 13px; a { color: var(--oy-accent); text-decoration: underline; } }
  &__pick { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 12px; background: #fff; color: var(--oy-accent); span { display: grid; gap: 4px; } b { color: var(--oy-ink); } small { color: var(--oy-muted); } }
  .oy-field input { background: #fff; }
  .oy-seg { background: #fff; }
  .oy-seg button.is-on { background: var(--oy-accent); color: #fff; box-shadow: none; }
  @media (max-width: 576px) { padding: 20px 16px; margin-left: -8px; margin-right: -8px; h2 { font-size: 28px; } }
}
.oy-ways2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; @media (max-width: 576px) { grid-template-columns: minmax(0, 1fr); } }
.oy-way {
  display: grid; gap: 4px; padding: 14px 16px; border-radius: 14px; background: #fff; border: 1px solid var(--oy-line); cursor: pointer;
  input { position: absolute; opacity: 0; pointer-events: none; }
  &__top { display: flex; justify-content: space-between; gap: 10px; b { color: var(--oy-ink); font-size: 14px; } em { font-style: normal; font-weight: 700; color: var(--oy-accent); white-space: nowrap; font-size: 14px; } }
  small { color: var(--oy-muted); font-size: 12.5px; line-height: 1.4; }
  &.is-on { border-color: var(--oy-accent); box-shadow: inset 0 0 0 1px var(--oy-accent); }
  &.is-off { opacity: .5; cursor: not-allowed; }
}
.oy-sum {
  position: sticky; top: 100px;
  &__box { display: grid; gap: 14px; padding: 24px; border-radius: 20px; border: 1px solid var(--oy-line); background: #fff; }
  h2 { font-size: 28px; }
  dl { display: grid; gap: 10px; margin: 0; div { display: flex; justify-content: space-between; gap: 12px; font-size: 14px; } dt { color: var(--oy-muted); } dd { margin: 0; font-weight: 600; color: var(--oy-ink); white-space: nowrap; text-align: right; } }
  &__off { color: var(--oy-ok) !important; }
  &__total { display: flex; justify-content: space-between; align-items: baseline; padding-top: 12px; border-top: 1px solid var(--oy-line); span { font-weight: 600; } b { font-size: 26px; color: var(--oy-ink); font-variant-numeric: tabular-nums; } }
  &__need { color: var(--oy-gold); font-size: 13px; }
  &__note { color: var(--oy-muted); font-size: 12px; }
  @media (max-width: 989px) { position: static; }
}
.oy-done { display: grid; gap: 16px; justify-items: start; padding: 32px; border-radius: 22px; background: var(--oy-surface); @media (max-width: 576px) { padding: 22px 18px; } }
</style>
