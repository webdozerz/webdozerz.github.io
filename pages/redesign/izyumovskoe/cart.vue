<script lang="ts" setup>
// Корзина делит заказ по правилу фермы: мясо привозят (курьер 350 ₽, встреча бесплатно, самовывоз), молодняк — только с фермы.
// Сумма — диапазоном: мясо считается за кг по весу тушки; позиции «по запросу» — после звонка.
import IzIcon from '~/components/redesign/izyumovskoe/IzIcon.vue'
import IzQty from '~/components/redesign/izyumovskoe/IzQty.vue'
import IzPhone from '~/components/redesign/izyumovskoe/IzPhone.vue'

useSeoMeta({ title: 'Корзина — Изюмовское | Концепт редизайна' })

const cart = useIzyumCart()
const ui = useIzyumUi()

const range = (s: [number, number]) => (s[0] === s[1] ? izMoney(s[0]) : `${izMoney(s[0])}–${izMoney(s[1])}`)
const groups = computed(() =>
  [
    { id: 'meat', title: 'Мясо', note: 'привезём по Омску или отдадим при встрече', lines: cart.meat.value, icon: 'truck' },
    { id: 'young', title: 'Молодняк', note: 'заберёте на ферме в д. Гауф', lines: cart.young.value, icon: 'barn' },
  ].filter((g) => g.lines.length),
)
const wayIcon: Record<string, string> = { courier: 'truck', meet: 'meet', pickup: 'barn' }
const payIcon: Record<string, string> = { cash: 'cash', card: 'card', invoice: 'doc' }

const agree = ref(true)
const done = ref<null | { num: number; pay: IzPay }>(null)
const paid = ref(false)
const submit = () => {
  done.value = { num: 1000 + Math.floor(Math.random() * 9000), pay: cart.pay.value }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const finish = () => {
  cart.clear()
  done.value = null
  paid.value = false
}
const needAddress = computed(() => cart.way.value === 'courier' && cart.meat.value.length)
</script>

<template>
  <div class="iz-wrap">
    <nav class="iz-crumbs" aria-label="Путь">
      <NuxtLink :to="izPath()">Главная</NuxtLink>
      <span>Корзина</span>
    </nav>
    <h1 class="iz-page-title">Корзина</h1>

    <div v-if="done" class="iz-done">
      <span class="iz-done__icon"><IzIcon name="check" :size="30" /></span>
      <h2>Заказ № {{ done.num }} оформлен</h2>
      <p>
        Перезвоним в рабочее время ({{ izContacts.hours }}), уточним вес и цену позиций «по запросу»{{
          cart.meat.value.length && cart.way.value === 'meet' ? ', договоримся о месте встречи' : ''
        }}. Это концепт: заказ никуда не отправлен.
      </p>
      <template v-if="done.pay === 'card'">
        <button v-if="!paid" type="button" class="iz-btn iz-btn--main" @click="paid = true"><IzIcon name="card" :size="19" />Оплатить картой</button>
        <p v-else class="iz-note iz-note--ok">Здесь откроется страница банка для оплаты Visa и MasterCard — в концепте оплата не проводится.</p>
      </template>
      <p v-if="done.pay === 'invoice'" class="iz-note">Счёт по договору-оферте пришлём на {{ cart.form.value.email || 'вашу почту' }}: 100 % предоплата на расчётный счёт.</p>
      <button type="button" class="iz-btn iz-btn--line" @click="finish">Очистить корзину и вернуться</button>
    </div>

    <div v-else-if="!cart.count.value" class="iz-empty">
      <b>В корзине пока пусто</b>
      <p>Мясо птицы привезём по Омску, а утят, гусят и цыплят — от 10 голов — отдадим на ферме.</p>
      <div>
        <NuxtLink :to="izPath('/catalog/myaso')" class="iz-btn iz-btn--main">Мясо птицы</NuxtLink>
        <NuxtLink :to="izPath('/catalog/molodnyak')" class="iz-btn iz-btn--line">Молодняк</NuxtLink>
      </div>
    </div>

    <div v-else class="iz-cart">
      <div class="iz-cart__main">
        <section v-for="g in groups" :key="g.id" class="iz-cart__group">
          <header class="iz-cart__ghead">
            <span class="iz-cart__gicon"><IzIcon :name="g.icon" /></span>
            <div>
              <h2>{{ g.title }}</h2>
              <p>{{ g.note }}</p>
            </div>
          </header>
          <div v-for="l in g.lines" :key="l.p.id" class="iz-line">
            <NuxtLink :to="izPath(`/product/${l.p.id}`)" class="iz-line__photo"><img :src="l.p.img" alt="" width="96" height="72" /></NuxtLink>
            <div class="iz-line__name">
              <NuxtLink :to="izPath(`/product/${l.p.id}`)">{{ l.p.title }}</NuxtLink>
              <small>{{ izPriceText(l.p) }}{{ l.p.weight ? ` · тушка ${l.p.weight[0].toLocaleString('ru-RU')}–${l.p.weight[1].toLocaleString('ru-RU')} кг` : '' }}</small>
            </div>
            <div class="iz-line__qty"><IzQty :p="l.p" /></div>
            <div class="iz-line__sum">
              <b v-if="l.sum">{{ l.p.weight ? '≈ ' : '' }}{{ range(l.sum) }}</b>
              <b v-else class="is-ask">по запросу</b>
            </div>
            <button type="button" class="iz-iconbtn iz-line__del" aria-label="Удалить" @click="cart.remove(l.p)"><IzIcon name="trash" :size="19" /></button>
          </div>
        </section>
        <button type="button" class="iz-link iz-cart__clear" @click="cart.clear()">Очистить корзину</button>

        <form id="iz-checkout" class="iz-cart__form" @submit.prevent="submit">
          <section v-if="cart.meat.value.length" class="iz-cart__block">
            <h2>Как получить мясо</h2>
            <div class="iz-options">
              <label v-for="w in izWays" :key="w.id" class="iz-option" :class="{ 'is-on': cart.way.value === w.id }">
                <input v-model="cart.way.value" type="radio" name="way" :value="w.id" />
                <IzIcon :name="wayIcon[w.id]" />
                <span>
                  <b>{{ w.title }}</b>
                  <small>{{ w.text }}</small>
                </span>
                <em :class="{ 'is-free': w.price === 'бесплатно' }">{{ w.price }}</em>
              </label>
            </div>
          </section>
          <p v-if="cart.young.value.length" class="iz-note iz-note--warn">
            <b>Молодняк — самовывоз.</b> Доставка распространяется только на мясо птицы. Заберите утят и цыплят на ферме: {{ izContacts.address }}.
          </p>

          <section class="iz-cart__block">
            <h2>Контакты</h2>
            <div class="iz-form iz-cart__fields">
              <label>Имя<input v-model="cart.form.value.name" required autocomplete="off" /></label>
              <label>Телефон<IzPhone v-model="cart.form.value.phone" /></label>
              <label>E-mail <small>для счёта и чека</small><input v-model="cart.form.value.email" type="email" autocomplete="off" /></label>
              <label v-if="needAddress">Адрес в Омске<input v-model="cart.form.value.address" required autocomplete="off" placeholder="Улица, дом, подъезд" /></label>
              <label class="iz-cart__wide">Комментарий<textarea v-model="cart.form.value.comment" placeholder="Удобное время, вес тушек, порода" /></label>
            </div>
          </section>

          <section class="iz-cart__block">
            <h2>Оплата</h2>
            <div class="iz-options iz-options--row">
              <label v-for="p in izPays" :key="p.id" class="iz-option" :class="{ 'is-on': cart.pay.value === p.id }">
                <input v-model="cart.pay.value" type="radio" name="pay" :value="p.id" />
                <IzIcon :name="payIcon[p.id]" />
                <span>
                  <b>{{ p.title }}</b>
                  <small>{{ p.text }}</small>
                </span>
              </label>
            </div>
          </section>
        </form>
      </div>

      <aside class="iz-cart__total">
        <h2>Ваш заказ</h2>
        <dl>
          <div>
            <dt>Товары · {{ cart.count.value }}</dt>
            <dd>{{ cart.goods.value[1] ? range(cart.goods.value) : '—' }}</dd>
          </div>
          <div v-if="cart.meat.value.length">
            <dt>Доставка мяса</dt>
            <dd :class="{ 'is-free': !cart.delivery.value }">{{ cart.delivery.value ? izMoney(cart.delivery.value) : 'бесплатно' }}</dd>
          </div>
          <div v-if="cart.young.value.length">
            <dt>Молодняк</dt>
            <dd>с фермы</dd>
          </div>
        </dl>
        <div class="iz-cart__sum">
          <span>Итого</span>
          <b>{{ cart.total.value[1] ? range(cart.total.value) : 'по запросу' }}</b>
        </div>
        <p v-if="cart.unknown.value" class="iz-cart__fine">Цены позиций «по запросу» назовём по телефону и добавим к сумме.</p>
        <p v-else-if="cart.meat.value.some((l) => l.p.weight)" class="iz-cart__fine">Мясо продаётся за кг — точную сумму назовём после взвешивания.</p>
        <label class="iz-check"><input v-model="agree" type="checkbox" required form="iz-checkout" /><span>Согласен с договором-офертой и обработкой персональных данных</span></label>
        <button type="submit" form="iz-checkout" class="iz-btn iz-btn--main iz-btn--wide" :disabled="!agree">Оформить заказ</button>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.iz-done {
  h2 {
    font-size: 30px;
  }
  &__icon {
    display: grid;
    place-items: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--iz-accent);
    color: var(--iz-dark);
  }
}
.iz-cart {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 32px;
  margin-top: 24px;
  align-items: start;

  &__main {
    display: grid;
    gap: 22px;
    min-width: 0;
  }
  &__group {
    display: grid;
    border: 1px solid var(--iz-line);
    border-radius: var(--iz-R);
    overflow: hidden;
  }
  &__ghead {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    background: var(--iz-surface);

    > div {
      display: grid;
      gap: 4px;
    }
    h2 {
      font-size: 21px;
    }
    p {
      color: var(--iz-muted);
      font-size: 14px;
    }
  }
  &__gicon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #fff;
    color: var(--iz-ink-accent);
  }
  &__clear {
    justify-self: start;
    font-size: 14px;
  }
  &__form {
    display: grid;
    gap: 22px;
  }
  &__block {
    display: grid;
    gap: 14px;

    h2 {
      font-size: 24px;
    }
  }
  &__fields {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
  &__wide {
    grid-column: 1 / -1;
  }
  &__total {
    position: sticky;
    top: 100px;
    display: grid;
    gap: 14px;
    padding: 24px;
    border-radius: var(--iz-R);
    background: var(--iz-surface);

    h2 {
      font-size: 22px;
    }
    dl {
      display: grid;
      gap: 8px;

      div {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }
      dt {
        color: var(--iz-muted);
      }
      dd {
        font-weight: 500;
        color: var(--iz-dark);
        text-align: right;

        &.is-free {
          color: var(--iz-green);
        }
      }
    }
    .iz-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  &__sum {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    padding-top: 14px;
    border-top: 1px solid var(--iz-line);

    span {
      font-weight: 500;
      color: var(--iz-dark);
    }
    b {
      font-family: var(--iz-head);
      font-size: 26px;
      color: var(--iz-dark);
      text-align: right;
    }
  }
  &__fine {
    color: var(--iz-muted);
    font-size: 13px;
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 22px;
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__total {
      position: static;
    }
  }
  @media (max-width: 576px) {
    &__fields {
      grid-template-columns: minmax(0, 1fr);
    }
    &__total {
      padding: 20px 16px;
    }
    &__sum b {
      font-size: 22px;
    }
  }
}
.iz-line {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) 160px 150px 42px;
  grid-template-areas: 'photo name qty sum del';
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  border-top: 1px solid var(--iz-line);

  &__photo {
    grid-area: photo;

    img {
      width: 96px;
      height: 72px;
      object-fit: cover;
      border-radius: 12px;
    }
  }
  &__name {
    grid-area: name;
    display: grid;
    min-width: 0;

    a {
      font-weight: 500;
      color: var(--iz-dark);

      &:hover {
        color: var(--iz-ink-accent);
      }
    }
    small {
      color: var(--iz-muted);
      font-size: 13px;
    }
  }
  &__qty {
    grid-area: qty;
  }
  &__sum {
    grid-area: sum;
    text-align: right;

    b {
      font-weight: 700;
      color: var(--iz-dark);
      white-space: nowrap;

      &.is-ask {
        font-weight: 500;
        color: var(--iz-muted);
      }
    }
  }
  &__del {
    grid-area: del;
    color: var(--iz-muted);
  }

  @media (max-width: 1199px) {
    grid-template-columns: 80px minmax(0, 1fr) 150px 42px;
    grid-template-areas:
      'photo name name del'
      'photo qty sum sum';
    gap: 8px 14px;

    &__photo img {
      width: 80px;
      height: 64px;
    }
  }
  @media (max-width: 576px) {
    grid-template-columns: 64px minmax(0, 1fr) minmax(0, 1fr) 42px;
    grid-template-areas:
      'photo name name del'
      'qty qty sum sum';
    padding: 12px;

    &__photo img {
      width: 64px;
      height: 52px;
    }
  }
}
.iz-options {
  display: grid;
  gap: 10px;

  &--row {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    @media (max-width: 1400px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
.iz-option {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  align-items: start;
  gap: 14px;
  padding: 16px 18px;
  border: 1px solid var(--iz-line);
  border-radius: 16px;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  .iz-icon {
    color: var(--iz-ink-accent);
  }
  span {
    display: grid;
    gap: 2px;
  }
  b {
    font-weight: 500;
    color: var(--iz-dark);
  }
  small {
    color: var(--iz-muted);
    font-size: 13.5px;
  }
  em {
    font-style: normal;
    font-weight: 700;
    color: var(--iz-dark);
    white-space: nowrap;

    &.is-free {
      color: var(--iz-green);
    }
  }
  &:hover {
    border-color: var(--iz-dark);
  }
  &.is-on {
    border-color: var(--iz-accent);
    background: var(--iz-soft);
  }
  &:has(input:focus-visible) {
    outline: 2px solid var(--iz-dark);
  }

  @media (max-width: 375px) {
    grid-template-columns: 22px minmax(0, 1fr);
    padding: 14px;

    em {
      grid-column: 2;
    }
  }
}
</style>
