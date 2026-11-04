<script lang="ts" setup>
import FaIcon from '~/components/redesign/fermaaltaya/FaIcon.vue'
import FaMask from '~/components/redesign/fermaaltaya/FaMask.vue'
import FaQty from '~/components/redesign/fermaaltaya/FaQty.vue'
import FaPhone from '~/components/redesign/fermaaltaya/FaPhone.vue'

useSeoMeta({ title: 'Корзина — Ферма Алтая | Концепт редизайна' })

const cart = useFermaAltaya()
const ui = useFaUi()
const now = useFaNow()

const waves = computed(() => faWaves(new Date(now.value), 2))
const wave = computed(() => waves.value[0])
const wd = computed(() => faWaveDays(wave.value))
// пожелание по дню: курьеры едут оба дня волны, покупатель может попросить удобный
const dayOpts = computed(() => [
  { id: '', label: 'Любой из двух' },
  ...wave.value.days.map((d) => ({ id: d.toISOString().slice(0, 10), label: `${faDayShort(d)}, ${faDate(d)}` })),
])

const pays: { id: FaPay; title: string; text: string; icon: string }[] = [
  { id: 'cash', title: 'Наличными курьеру', text: 'Курьер привезёт сдачу', icon: 'cash' },
  { id: 'terminal', title: 'Картой курьеру', text: 'Терминал у курьера', icon: 'card' },
  { id: 'online', title: 'Онлайн на сайте', text: 'ЮKassa, СБЕР: Мир, Visa, Mastercard, SberPay — кнопка «Оплатить» появится в заказе после сборки', icon: 'shield' },
]

const couponMsg = ref('')
const applyCoupon = () => {
  couponMsg.value = cart.coupon.value.trim() ? 'Купон проверим при оформлении — в концепте купоны не применяются' : ''
}
const manual = ref(false)
const human = ref(false)
const agree = ref(false)
const done = ref<FaOrder | null>(null)
const submit = () => {
  if (cart.short.value > 0) return
  const order: FaOrder = {
    n: 24000 + Math.floor(Math.random() * 900),
    date: new Date().toISOString().slice(0, 10),
    total: [...cart.total.value] as [number, number],
    count: cart.count.value,
    city: cart.city.value,
    wave: `${wd.value.days}, ${wd.value.dates}`,
  }
  if (cart.user.value) {
    cart.user.value = { ...cart.user.value, balance: cart.user.value.balance - cart.bonusOff.value }
  }
  cart.orders.value = [order, ...cart.orders.value]
  done.value = order
  cart.clear()
  cart.useBonus.value = false
  window.scrollTo({ top: 0 })
}
const pct = computed(() => Math.min(100, (cart.goods.value[0] / FA_MIN) * 100))
</script>

<template>
  <div class="fa-wrap fa-cart">
    <nav class="fa-crumbs" aria-label="Навигация">
      <NuxtLink :to="faPath()">Главная</NuxtLink>
      <span>Корзина</span>
    </nav>

    <div v-if="done" class="fa-cart__done">
      <FaMask sec="moloko" :size="52" />
      <h1>Заказ №{{ done.n }} принят</h1>
      <p>
        Привезём в {{ done.wave }} — {{ faCities[done.city].area }}. Соберём в ночь перед доставкой, взвесим весовое и пришлём точную сумму. Ориентир —
        {{ faRange(done.total) }}.
      </p>
      <p class="fa-demo">Это концепт: заказ никуда не отправлен, деньги не списываются.</p>
      <div class="fa-cart__donebtns">
        <NuxtLink :to="faPath('/catalog')" class="fa-btn fa-btn--main">Вернуться в каталог</NuxtLink>
        <NuxtLink :to="faPath('/kabinet')" class="fa-btn fa-btn--line">Мои заказы</NuxtLink>
      </div>
    </div>

    <template v-else-if="cart.lines.value.length">
      <div class="fa-cart__head">
        <h1>Корзина</h1>
        <span>{{ cart.count.value }} шт · общий вес ≈ {{ faKg(Math.round(cart.weight.value * 100) / 100) }}</span>
        <button type="button" class="fa-link fa-cart__clear" @click="cart.clear()">Очистить</button>
      </div>

      <div class="fa-cart__layout">
        <div class="fa-cart__main">
          <ul class="fa-cart__lines">
            <li v-for="l in cart.lines.value" :key="l.p.id" class="fa-line">
              <NuxtLink :to="faPath(`/product/${l.p.id}`)" class="fa-line__ph"><img :src="faImg(l.p.img)" :alt="l.p.title" width="80" height="80" /></NuxtLink>
              <div class="fa-line__t">
                <NuxtLink :to="faPath(`/product/${l.p.id}`)">{{ l.p.title }}</NuxtLink>
                <small>{{ faMoney(l.p.price) }} {{ faUnitLabel(l.p) }}<template v-if="l.p.pack"> · {{ l.p.pack }}</template></small>
              </div>
              <div class="fa-line__qty"><FaQty :p="l.p" /></div>
              <div class="fa-line__sum">
                <b>{{ faWeighed(l.p) ? '≈ ' : '' }}{{ faRange(l.sum) }}</b>
                <small v-if="faWeighed(l.p)">по весу</small>
              </div>
              <button type="button" class="fa-iconbtn fa-line__x" :aria-label="`Убрать ${l.p.title}`" @click="cart.remove(l.p)"><FaIcon name="trash" :size="20" /></button>
            </li>
          </ul>
          <p v-if="cart.weighed.value" class="fa-cart__weigh">
            <FaIcon name="scales" :size="20" />
            <span>Мясо и фарш продаём по весу. Заказ соберём ночью, взвесим и к 9–10 утра пришлём точную сумму — оплатить онлайн можно будет после сборки.</span>
          </p>

          <form id="fa-order" class="fa-cart__form" @submit.prevent="submit">
            <section class="fa-cart__step">
              <h2><i>1</i>Доставка</h2>
              <div class="fa-cart__opts">
                <label v-for="(c, k) in faCities" :key="k" class="fa-opt" :class="{ 'is-on': cart.city.value === k }">
                  <input v-model="cart.city.value" type="radio" name="city" :value="k" />
                  <FaIcon name="truck" />
                  <span><b>Бесплатная доставка — {{ c.title }}</b><small>{{ c.area }}</small></span>
                </label>
              </div>
              <div class="fa-cart__when">
                <p>
                  <FaIcon name="timer" :size="18" />
                  <span>
                    Привезём в <b>{{ faDayAcc(wave.days[0]) }} или {{ faDayAcc(wave.days[1]) }}, {{ wd.dates }}</b>, с 10 до 20. Приём заказов на эту доставку — до 12:00
                    {{ faDayGen(wave.deadline) }}, позже заказ встанет на {{ faWaveDays(waves[1]).days }}, {{ faWaveDays(waves[1]).dates }}.
                  </span>
                </p>
                <div class="fa-cart__days" role="group" aria-label="Удобный день">
                  <span>Удобнее</span>
                  <button v-for="o in dayOpts" :key="o.id" type="button" class="fa-chip" :class="{ 'is-on': cart.dayPref.value === o.id }" @click="cart.dayPref.value = o.id">
                    {{ o.label }}
                  </button>
                </div>
              </div>
            </section>

            <section class="fa-cart__step">
              <h2><i>2</i>Оплата</h2>
              <div class="fa-cart__opts fa-cart__opts--3">
                <label v-for="o in pays" :key="o.id" class="fa-opt" :class="{ 'is-on': cart.pay.value === o.id }">
                  <input v-model="cart.pay.value" type="radio" name="pay" :value="o.id" />
                  <FaIcon :name="o.icon" />
                  <span><b>{{ o.title }}</b><small>{{ o.text }}</small></span>
                </label>
              </div>
            </section>

            <section class="fa-cart__step">
              <h2><i>3</i>Получатель и адрес</h2>
              <div class="fa-cart__fields">
                <label class="fa-field fa-cart__wide"><span>Фамилия, имя</span><input v-model="cart.form.value.name" type="text" autocomplete="name" required /></label>
                <label class="fa-field"><span>Телефон</span><FaPhone v-model="cart.form.value.phone" /></label>
                <label class="fa-field"><span>Эл. почта — пришлём сумму после сборки</span><input v-model="cart.form.value.email" type="email" autocomplete="email" required /></label>
                <div class="fa-field fa-cart__wide">
                  <span class="fa-cart__addr">
                    Улица
                    <button type="button" class="fa-link" @click="manual = !manual">{{ manual ? 'выбрать из справочника' : 'ввести вручную' }}</button>
                  </span>
                  <input
                    v-model="cart.form.value.street"
                    type="text"
                    :placeholder="manual ? 'Город, улица — как удобно' : `${faCities[cart.city.value].title}, начните вводить улицу`"
                    autocomplete="address-line1"
                    required
                  />
                </div>
                <label class="fa-field"><span>Дом</span><input v-model="cart.form.value.house" type="text" required /></label>
                <label class="fa-field"><span>Квартира</span><input v-model="cart.form.value.flat" type="text" inputmode="numeric" /></label>
                <label class="fa-field"><span>Подъезд</span><input v-model="cart.form.value.entrance" type="text" inputmode="numeric" /></label>
                <label class="fa-field"><span>Этаж</span><input v-model="cart.form.value.floor" type="text" inputmode="numeric" /></label>
                <label class="fa-field fa-cart__wide"><span>Домофон</span><input v-model="cart.form.value.intercom" type="text" /></label>
                <label class="fa-field fa-cart__wide"><span>Комментарий к заказу</span><textarea v-model="cart.form.value.comment" /></label>
              </div>
              <p v-if="!cart.user.value" class="fa-demo">
                Регистрироваться не обязательно: после заказа аккаунт создастся сам, пароль придёт на почту.
                <button type="button" class="fa-link" @click="ui.login.value = 'login'">Войти</button>, чтобы оплатить баллами.
              </p>
            </section>
          </form>
        </div>

        <aside class="fa-cart__sum">
          <div class="fa-panel fa-sum">
            <div class="fa-sum__row"><span>Товары, {{ cart.count.value }} шт</span><b>{{ cart.weighed.value ? '≈ ' : '' }}{{ faRange(cart.goods.value) }}</b></div>
            <div class="fa-sum__row"><span>Доставка</span><b class="fa-sum__free">бесплатно</b></div>
            <div v-if="cart.bonusOff.value" class="fa-sum__row"><span>Баллами</span><b>−{{ faMoney(cart.bonusOff.value) }}</b></div>
            <div class="fa-sum__row fa-sum__total">
              <span>Итого</span><b>{{ cart.weighed.value ? '≈ ' : '' }}{{ faRange(cart.total.value) }}</b>
            </div>
            <p v-if="cart.weighed.value" class="fa-sum__note">Точная сумма — после взвешивания</p>

            <div v-if="cart.short.value > 0" class="fa-sum__min">
              <div class="fa-sum__bar"><i :style="{ width: `${pct}%` }" /></div>
              <span>Минимальный заказ — {{ faMoney(FA_MIN) }}. Добавьте ещё на <b>{{ faMoney(cart.short.value) }}</b></span>
            </div>

            <label v-if="cart.user.value" class="fa-check fa-sum__bonus">
              <input v-model="cart.useBonus.value" type="checkbox" :disabled="!cart.user.value.balance" />
              <span>Оплатить баллами — на счёте {{ cart.user.value.balance }}</span>
            </label>
            <p class="fa-sum__earn"><FaIcon name="coin" :size="18" />Начислим {{ cart.earn.value }} баллов после оплаты</p>

            <div class="fa-sum__coupon">
              <input v-model="cart.coupon.value" type="text" placeholder="Купон" aria-label="Купон" @keydown.enter.prevent="applyCoupon" />
              <button type="button" class="fa-btn fa-btn--line fa-btn--sm" @click="applyCoupon">Применить</button>
            </div>
            <p v-if="couponMsg" class="fa-demo">{{ couponMsg }}</p>

            <label class="fa-check"><input v-model="agree" form="fa-order" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
            <label class="fa-check"><input v-model="human" form="fa-order" type="checkbox" required /><span>Я человек</span></label>
            <button type="submit" form="fa-order" class="fa-btn fa-btn--main fa-sum__go" :disabled="cart.short.value > 0">Оформить заказ</button>
            <p class="fa-demo">Демо: заказ не отправляется.</p>
          </div>
        </aside>
      </div>
    </template>

    <div v-else class="fa-empty fa-cart__empty">
      <FaMask sec="svinina" :size="52" />
      <b>В корзине пока пусто</b>
      <p>Минимальный заказ — {{ faMoney(FA_MIN) }}, доставка в Новосибирск и Барнаул бесплатная.</p>
      <NuxtLink :to="faPath('/catalog')" class="fa-btn fa-btn--main">В каталог</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.fa-cart {
  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 16px;
    padding: 16px 0 20px;

    > span {
      color: var(--fa-muted);
    }
  }
  &__clear {
    margin-left: auto;
  }
  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 32px;
    align-items: start;
  }
  ul.fa-cart__lines {
    display: grid;
    border-top: 1px solid var(--fa-line);
  }
  &__weigh {
    display: flex;
    gap: 10px;
    margin-top: 14px;
    padding: 14px 16px;
    border-radius: 14px;
    background: var(--fa-craft);
    color: var(--fa-craft-ink);
    font-weight: 500;

    .fa-icon {
      flex: none;
    }
  }
  &__form {
    display: grid;
    gap: 34px;
    margin-top: 36px;
  }
  &__step {
    display: grid;
    gap: 16px;

    h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 26px;

      i {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        background: var(--fa-surface);
        color: var(--fa-accent);
        font-size: 18px;
        font-style: normal;
      }
    }
  }
  &__opts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;

    &--3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  &__when {
    display: grid;
    gap: 12px;
    padding: 16px 18px;
    border-radius: 14px;
    background: var(--fa-surface);

    > p {
      display: flex;
      gap: 9px;

      .fa-icon {
        flex: none;
        margin-top: 3px;
        color: var(--fa-accent);
      }
      b {
        color: var(--fa-dark);
      }
    }
  }
  &__days {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;

    > span {
      color: var(--fa-muted);
    }
  }
  &__fields {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;

    > .fa-field:nth-child(2),
    > .fa-field:nth-child(3) {
      grid-column: span 2;
    }
  }
  &__wide {
    grid-column: 1 / -1;
  }
  &__addr {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 4px 12px;

    .fa-link {
      font-size: 14px;
    }
  }
  &__sum {
    position: sticky;
    top: 140px;
  }
  &__done {
    display: grid;
    justify-items: center;
    gap: 14px;
    max-width: 640px;
    margin: 32px auto 0;
    padding: 44px 28px;
    border-radius: 22px;
    background: var(--fa-surface);
    text-align: center;

    .fa-mask {
      color: var(--fa-dark);
    }
  }
  &__donebtns {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  &__empty {
    margin-top: 24px;
  }
  @media (max-width: 1199px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr) 330px;
      gap: 24px;
    }
    &__opts--3 {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 989px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }
    &__sum {
      position: static;
    }
  }
  @media (max-width: 576px) {
    &__opts {
      grid-template-columns: minmax(0, 1fr);
    }
    &__fields {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;

      > .fa-field:nth-child(2),
      > .fa-field:nth-child(3) {
        grid-column: 1 / -1;
      }
    }
    &__step h2 {
      font-size: 22px;
    }
  }
}

.fa-line {
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr) 150px 130px 44px;
  grid-template-areas: 'ph t qty sum x';
  align-items: center;
  gap: 8px 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--fa-line);

  &__ph {
    grid-area: ph;

    img {
      width: 80px;
      height: 80px;
      border-radius: 12px;
      background: #fff;
      object-fit: cover;
    }
  }
  &__t {
    grid-area: t;
    display: grid;
    gap: 2px;
    min-width: 0;

    a {
      color: var(--fa-dark);
      font-weight: 500;
      line-height: 1.25;

      &:hover {
        color: var(--fa-accent);
      }
    }
    small {
      color: var(--fa-muted);
      font-size: 14px;
    }
  }
  &__qty {
    grid-area: qty;
  }
  &__sum {
    grid-area: sum;
    display: grid;
    justify-items: end;
    text-align: right;

    b {
      color: var(--fa-dark);
      font-size: 17px;
      font-weight: 800;
      white-space: nowrap;
    }
    small {
      color: var(--fa-muted);
      font-size: 13px;
    }
  }
  &__x {
    grid-area: x;
    color: var(--fa-muted);
  }
  @media (max-width: 768px) {
    grid-template-columns: 64px minmax(0, 1fr) minmax(0, 1fr) 40px;
    grid-template-areas: 'ph t t x' 'qty qty sum sum';
    align-items: start;

    &__ph img {
      width: 64px;
      height: 64px;
    }
    &__sum,
    &__x {
      min-height: 44px;
      align-content: center;
    }
  }
}

.fa-opt {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1.5px solid var(--fa-line);
  border-radius: 14px;
  background: var(--fa-card);
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  > .fa-icon {
    flex: none;
    color: var(--fa-muted);
  }
  span {
    display: grid;
    gap: 2px;
  }
  b {
    color: var(--fa-dark);
    line-height: 1.25;
  }
  small {
    color: var(--fa-muted);
    font-size: 14px;
    line-height: 1.35;
  }
  &.is-on {
    border-color: var(--fa-accent);
    background: var(--fa-soft);

    > .fa-icon {
      color: var(--fa-accent);
    }
  }
  &:has(input:focus-visible) {
    outline: 2px solid var(--fa-accent);
    outline-offset: 2px;
  }
}

.fa-sum {
  display: grid;
  gap: 12px;

  &__row {
    display: flex;
    justify-content: space-between;
    gap: 12px;

    b {
      color: var(--fa-dark);
      white-space: nowrap;
    }
  }
  &__free {
    color: var(--fa-soft-ink) !important;
  }
  &__total {
    padding-top: 12px;
    border-top: 1px solid var(--fa-line);
    font-size: 19px;

    b {
      font-size: 24px;
      font-weight: 800;
    }
  }
  &__note {
    margin-top: -8px;
    color: var(--fa-muted);
    font-size: 14px;
    text-align: right;
  }
  &__min {
    display: grid;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--fa-craft);
    color: var(--fa-craft-ink);
    font-size: 15px;
  }
  &__bar {
    height: 8px;
    border-radius: 4px;
    background: color-mix(in srgb, var(--fa-craft-ink) 20%, transparent);
    overflow: hidden;

    i {
      display: block;
      height: 100%;
      border-radius: 4px;
      background: var(--fa-accent);
    }
  }
  &__earn {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--fa-soft-ink);
    font-weight: 700;
  }
  &__coupon {
    display: flex;
    gap: 8px;

    input {
      flex: 1;
      min-width: 0;
      width: 0;
      height: 38px;
      padding: 0 12px;
      border: 1px solid var(--fa-line);
      border-radius: var(--fa-r);
      background: var(--fa-card);
      outline: 0;

      &:focus {
        border-color: var(--fa-accent);
      }
    }
  }
  &__go {
    width: 100%;
    min-height: 52px;
    font-size: 18px;
  }
}
</style>
