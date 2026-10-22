<script lang="ts" setup>
import FtQty from '~/components/redesign/fermertomska/FtQty.vue'
import FtWhen from '~/components/redesign/fermertomska/FtWhen.vue'
import FtIcon from '~/components/redesign/fermertomska/FtIcon.vue'

useSeoMeta({ title: 'Корзина | Куендатское, концепт редизайна' })

const cart = useFermertomskaCart()
const ui = useFermertomskaUi()
const october = useState('ft-october', () => false)

const method = ref<'courier' | 'pickup'>('courier')
const slot = ref<string | null>(null)
const promo = ref('')
const promoMsg = ref('')
const done = ref<{ number: string; total: number } | null>(null)
const form = reactive({ name: '', phone: '', email: '', street: '', house: '', flat: '', comment: '' })

const left = computed(() => Math.max(ftDelivery.freeFrom - cart.subtotal.value, 0))
const progress = computed(() => Math.min(cart.subtotal.value / ftDelivery.freeFrom, 1))
const deliveryCost = computed(() => (method.value === 'pickup' || !left.value ? 0 : ftDelivery.courier))
const total = computed(() => cart.subtotal.value + deliveryCost.value)
const pickupShort = computed(() => (method.value === 'pickup' ? Math.max(ftDelivery.pickupMin - cart.subtotal.value, 0) : 0))
const hasWeight = computed(() => cart.lines.value.some((l) => l.product.unit === 'кг'))

const applyPromo = () => {
  promoMsg.value = promo.value.trim()
    ? 'Промокод проверит магазин при подтверждении заказа (в концепте скидка не считается).'
    : 'Введите промокод.'
}

const submit = () => {
  if (pickupShort.value) return
  done.value = { number: String(Math.floor(10000 + Math.random() * 89999)), total: total.value }
  cart.clear()
  window.scrollTo({ top: 0 })
}
</script>

<template>
  <div class="ft-wrap ft-cart">
    <nav class="ft-crumbs" aria-label="Навигация">
      <NuxtLink :to="ftPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>Корзина</span>
    </nav>

    <div v-if="done" class="ft-cart__done">
      <span class="ft-cart__done-icon"><FtIcon name="check" :size="32" /></span>
      <h1 class="ft-h1">Заказ №{{ done.number }} принят</h1>
      <p>На сумму {{ ftPrice(done.total) }}. Менеджер позвонит, чтобы подтвердить состав и время доставки.</p>
      <small>Это концепт: заказ никуда не отправлен, деньги не списаны.</small>
      <NuxtLink :to="ftPath('/catalog')" class="ft-btn">Вернуться в каталог</NuxtLink>
    </div>

    <div v-else-if="!cart.lines.value.length" class="ft-cart__empty">
      <FtIcon name="bag" :size="40" />
      <h1 class="ft-h2">В корзине пока пусто</h1>
      <p>Добавьте молоко, сметану или творог — привезём утром.</p>
      <NuxtLink :to="ftPath('/catalog')" class="ft-btn">Перейти в каталог</NuxtLink>
    </div>

    <template v-else>
      <div class="ft-cart__head">
        <h1 class="ft-h1">Корзина</h1>
        <button type="button" class="ft-cart__clear" @click="cart.clear()">Очистить</button>
      </div>

      <form class="ft-cart__layout" @submit.prevent="submit">
        <div class="ft-cart__main">
          <div class="ft-cart__free" :class="{ 'is-done': !left }">
            <p v-if="left">
              До бесплатной доставки <strong>{{ ftPrice(left) }}</strong>. Объединяйтесь с соседями, коллегами по работе и
              родственниками :)
            </p>
            <p v-else><FtIcon name="check" :size="18" /> Доставка бесплатная</p>
            <div class="ft-cart__bar" role="progressbar" :aria-valuenow="Math.round(progress * 100)" aria-valuemin="0" aria-valuemax="100">
              <span :style="{ width: `${progress * 100}%` }" />
            </div>
          </div>

          <ul class="ft-cart__lines">
            <li v-for="l in cart.lines.value" :key="l.product.id" class="ft-line">
              <NuxtLink :to="ftPath(`/product/${l.product.id}`)" class="ft-line__photo">
                <img :src="l.product.images[0]" alt="" width="80" height="100" loading="lazy" />
              </NuxtLink>
              <div class="ft-line__info">
                <NuxtLink :to="ftPath(`/product/${l.product.id}`)" class="ft-line__name">{{ l.family.title }}</NuxtLink>
                <span class="ft-line__meta">{{ l.product.variant }} · {{ ftPrice(l.product.price) }}{{ l.product.unit === 'кг' ? ' за кг' : '' }}</span>
              </div>
              <FtQty :product="l.product" size="sm" no-trash class="ft-line__qty" />
              <strong class="ft-line__sum">{{ ftPrice(l.sum) }}</strong>
              <button type="button" class="ft-iconbtn ft-line__del" :aria-label="`Удалить: ${l.product.name}`" @click="cart.setQty(l.product.id, 0)">
                <FtIcon name="trash" :size="20" />
              </button>
            </li>
          </ul>
          <p v-if="hasWeight" class="ft-cart__weight">Вареники и пельмени продаются на вес: сумму уточним при сборке заказа.</p>

          <fieldset class="ft-step">
            <legend>Получение</legend>
            <div class="ft-seg" role="radiogroup" aria-label="Способ получения">
              <button type="button" role="radio" :aria-checked="method === 'courier'" :class="{ 'is-on': method === 'courier' }" @click="method = 'courier'">
                <FtIcon name="truck" />
                <span><strong>Курьером по Томску</strong><small>{{ left ? ftPrice(ftDelivery.courier) : 'бесплатно' }}, утром</small></span>
              </button>
              <button type="button" role="radio" :aria-checked="method === 'pickup'" :class="{ 'is-on': method === 'pickup' }" @click="method = 'pickup'">
                <FtIcon name="store" />
                <span><strong>Самовывоз</strong><small>Бердская, 29, склад 17</small></span>
              </button>
            </div>

            <template v-if="method === 'courier'">
              <p class="ft-step__label">День доставки</p>
              <FtWhen v-model="slot" v-model:october="october" selectable />
              <div class="ft-step__grid">
                <label class="ft-field ft-step__wide">Улица<input v-model="form.street" type="text" required autocomplete="off" /></label>
                <label class="ft-field">Дом<input v-model="form.house" type="text" required autocomplete="off" /></label>
                <label class="ft-field">Квартира, офис<input v-model="form.flat" type="text" autocomplete="off" /></label>
              </div>
            </template>
            <div v-else class="ft-step__pickup">
              <p><FtIcon name="pin" :size="20" /> {{ ftContacts.pickup }}</p>
              <p><FtIcon name="clock" :size="20" /> {{ ftContacts.pickupHours }}</p>
              <p v-if="pickupShort" class="ft-step__warn">Самовывоз — от {{ ftPrice(ftDelivery.pickupMin) }}. Добавьте ещё на {{ ftPrice(pickupShort) }}.</p>
            </div>
          </fieldset>

          <fieldset class="ft-step">
            <legend>Получатель</legend>
            <p v-if="!ui.user.value" class="ft-step__hint">
              Регистрация не нужна.
              <button type="button" @click="ui.open({ kind: 'login' })">Войти</button>, чтобы видеть историю заказов.
            </p>
            <div class="ft-step__grid">
              <label class="ft-field">Имя<input v-model="form.name" type="text" required autocomplete="off" /></label>
              <label class="ft-field">Телефон<input v-model="form.phone" type="tel" required placeholder="+7" autocomplete="off" /></label>
              <label class="ft-field ft-step__wide">Эл. почта для чека<input v-model="form.email" type="email" autocomplete="off" /></label>
              <label class="ft-field ft-step__wide">Комментарий<textarea v-model="form.comment" rows="3" :placeholder="method === 'courier' ? 'Подъезд, домофон, удобное время' : 'Во сколько заберёте заказ'" /></label>
            </div>
          </fieldset>

          <fieldset class="ft-step">
            <legend>Оплата</legend>
            <div class="ft-seg ft-seg--single">
              <span class="is-on">
                <FtIcon name="card" />
                <span><strong>Онлайн: картой, SberPay</strong><small>через ЮKassa, после подтверждения заказа</small></span>
              </span>
            </div>
          </fieldset>
        </div>

        <aside class="ft-summary">
          <h2>Ваш заказ</h2>
          <dl>
            <dt>Товары, {{ cart.count.value }}</dt>
            <dd>{{ ftPrice(cart.subtotal.value) }}</dd>
            <dt>{{ method === 'pickup' ? 'Самовывоз' : 'Доставка' }}</dt>
            <dd>{{ deliveryCost ? ftPrice(deliveryCost) : 'бесплатно' }}</dd>
          </dl>
          <div class="ft-summary__promo">
            <label class="ft-field"><span class="ft-sr">Промокод</span><input v-model="promo" type="text" placeholder="Промокод" autocomplete="off" /></label>
            <button type="button" class="ft-btn ft-btn--ghost" @click="applyPromo">Применить</button>
          </div>
          <p v-if="promoMsg" class="ft-summary__msg">{{ promoMsg }}</p>
          <div class="ft-summary__total">
            <span>Итого</span>
            <strong>{{ ftPrice(total) }}</strong>
          </div>
          <label class="ft-check"><input type="checkbox" required /> Согласен с условиями оферты и обработкой персональных данных</label>
          <button type="submit" class="ft-btn ft-btn--block" :disabled="Boolean(pickupShort)">Оформить заказ</button>
          <small>Концепт: заказ никуда не отправится.</small>
        </aside>
      </form>
    </template>
  </div>
</template>

<style lang="scss">
.ft .ft-cart {
  padding-bottom: 40px;

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
  }

  &__clear {
    color: var(--ft-muted);
    font-weight: 700;

    &:hover {
      color: #d0306f;
    }
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    align-items: start;
    gap: 32px;
  }

  &__main {
    display: grid;
    gap: 20px;
  }

  &__free {
    display: grid;
    gap: 10px;
    padding: 16px 20px;
    border-radius: 20px;
    background: var(--ft-surface);

    p {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0 6px;
    }

    &.is-done p {
      color: var(--ft-accent-d);
      font-weight: 800;
    }
  }

  &__bar {
    height: 8px;
    border-radius: 4px;
    background: #fff;
    overflow: hidden;

    span {
      display: block;
      height: 100%;
      border-radius: 4px;
      background: var(--ft-accent);
      transition: width 0.3s;
    }
  }

  &__lines {
    display: grid;
  }

  &__weight {
    color: var(--ft-muted);
    font-size: 14px;
  }

  &__empty,
  &__done {
    display: grid;
    justify-items: center;
    gap: 14px;
    max-width: 560px;
    margin: 24px auto 40px;
    padding: 48px 24px;
    border-radius: var(--ft-r-lg);
    background: var(--ft-surface-2);
    color: var(--ft-muted);
    text-align: center;

    h1 {
      color: var(--ft-ink);
    }

    small {
      color: var(--ft-accent);
      font-weight: 700;
    }
  }

  &__done-icon {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--ft-accent-soft);
    color: var(--ft-accent);
  }

  @media (max-width: 1199px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 24px;
    }
  }

  @media (max-width: 989px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

.ft .ft-line {
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr) 140px 110px 44px;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--ft-line);

  &__photo img {
    width: 80px;
    height: 100px;
    border-radius: 14px;
    object-fit: cover;
  }

  &__info {
    display: grid;
    gap: 4px;
    min-width: 0;
  }

  &__name {
    font-weight: 800;
    line-height: 1.3;

    &:hover {
      color: var(--ft-accent);
    }
  }

  &__meta {
    color: var(--ft-muted);
    font-size: 14px;
    font-weight: 600;
  }

  &__sum {
    font-size: 18px;
    font-weight: 900;
    text-align: right;
    white-space: nowrap;
  }

  &__del {
    color: var(--ft-muted);

    &:hover {
      color: #d0306f;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: 64px minmax(0, 1fr) auto 44px;
    grid-template-areas:
      'photo info info del'
      'photo qty sum sum';
    gap: 8px 14px;

    &__photo {
      grid-area: photo;
      align-self: start;

      img {
        width: 64px;
        height: 80px;
      }
    }

    &__info {
      grid-area: info;
    }

    &__qty {
      grid-area: qty;
      justify-self: start;
      width: 140px;
    }

    &__sum {
      grid-area: sum;
    }

    &__del {
      grid-area: del;
      align-self: start;
    }
  }

  @media (max-width: 375px) {
    &__qty {
      width: 124px;
    }

    &__sum {
      font-size: 16px;
    }
  }
}

.ft .ft-step {
  display: grid;
  gap: 14px;
  min-width: 0;
  margin: 8px 0 0;
  padding: 24px;
  border: 0;
  border-radius: var(--ft-r-lg);
  background: var(--ft-surface-2);

  legend {
    float: left;
    width: 100%;
    margin-bottom: 4px;
    padding: 0;
    font-size: 22px;
    font-weight: 900;
  }

  &__label {
    font-weight: 800;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  &__wide {
    grid-column: 1 / -1;
  }

  &__hint {
    color: var(--ft-muted);

    button {
      color: var(--ft-accent);
      font-weight: 800;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  &__pickup {
    display: grid;
    gap: 8px;

    p {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-weight: 700;
    }

    svg {
      margin-top: 2px;
      color: var(--ft-accent);
    }
  }

  &__warn {
    color: #b0480c;
  }

  .ft-when__slots button,
  .ft-when__tabs {
    background: #fff;
  }

  .ft-when__tabs button.is-on {
    background: var(--ft-surface);
    box-shadow: none;
  }

  @media (max-width: 576px) {
    padding: 18px 16px;

    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

.ft .ft-seg {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  > button,
  > span {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 18px;
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--ft-line);
    color: var(--ft-muted);
    text-align: left;

    > span {
      display: grid;
      min-width: 0;
    }

    strong {
      color: var(--ft-ink);
      font-weight: 900;
    }

    small {
      font-size: 13px;
      font-weight: 700;
    }

    &.is-on {
      background: var(--ft-accent-soft);
      box-shadow: inset 0 0 0 2px var(--ft-accent);
      color: var(--ft-accent);
    }
  }

  &--single {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.ft .ft-summary {
  position: sticky;
  top: calc(var(--ft-header) + 20px);
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: var(--ft-r-lg);
  background: #fff;
  box-shadow: 0 0 0 1px var(--ft-line), 0 12px 32px rgba(29, 43, 74, 0.08);

  h2 {
    font-size: 22px;
    font-weight: 900;
  }

  dl {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px 12px;
  }

  dt {
    color: var(--ft-muted);
  }

  dd {
    font-weight: 800;
    text-align: right;
    white-space: nowrap;
  }

  &__promo {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
  }

  &__msg {
    color: var(--ft-muted);
    font-size: 13px;
  }

  &__total {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding-top: 14px;
    border-top: 1px solid var(--ft-line);
    font-weight: 800;

    strong {
      font-size: 28px;
      font-weight: 900;
      white-space: nowrap;
    }
  }

  > small {
    color: var(--ft-muted);
    font-size: 13px;
    text-align: center;
  }

  @media (max-width: 989px) {
    position: static;
  }

  @media (max-width: 576px) {
    padding: 20px 16px;
  }
}
</style>
