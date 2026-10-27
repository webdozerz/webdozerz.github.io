<script lang="ts" setup>
import PlIcon from '~/components/redesign/papinalavka/PlIcon.vue'

useSeoMeta({ title: 'Корзина — Папина лавка | Концепт редизайна' })

const cart = usePapinalavkaCart()
const ui = usePapinalavkaUi()
const f = cart.form
const quick = ref(false)
const done = ref('')
const copied = ref(false)

const feeLabel = computed(() => {
  if (f.value.method === 'pickup') return 'бесплатно'
  if (cart.fee.value === null) return 'уточнит оператор'
  return cart.fee.value ? plFmt(cart.fee.value) : 'бесплатно'
})
const sum = computed(() => cart.total.value + (cart.fee.value ?? 0))
const canSend = computed(() => cart.count.value > 0 && f.value.phone.replace(/\D/g, '').length >= 10)

const submit = () => {
  if (!canSend.value) return
  done.value = quick.value ? `Быстрый заказ\nТелефон: ${f.value.phone}\n\n${cart.orderText.value}` : cart.orderText.value
}
const copy = async () => {
  try {
    await navigator.clipboard.writeText(done.value)
    copied.value = true
  } catch {
    ui.say('Не удалось скопировать — выделите текст вручную')
  }
}
const finish = () => {
  cart.clear()
  done.value = ''
  copied.value = false
}
</script>

<template>
  <div class="pl-wrap pl-cart">
    <nav class="pl-crumbs" aria-label="Навигация">
      <NuxtLink :to="plPath()">Главная</NuxtLink>
      <span>Корзина</span>
    </nav>
    <h1 class="pl-h1">Корзина</h1>

    <div v-if="!cart.count.value && !done" class="pl-cart__empty">
      <p>В корзине пока пусто. Посмотрите, что едет ближайшей поставкой, или выберите из того, что есть в наличии.</p>
      <div>
        <NuxtLink :to="plPath('/deliveries')" class="pl-btn pl-btn--main">Ближайшие поставки</NuxtLink>
        <NuxtLink :to="{ path: plSectionPath(), query: { tab: 'stock' } }" class="pl-btn pl-btn--line">Есть в наличии</NuxtLink>
      </div>
    </div>

    <div v-else-if="done" class="pl-cart__done">
      <h2>Заказ собран</h2>
      <p>
        На настоящем сайте он ушёл бы оператору, и вам перезвонили бы для подтверждения. В концепте заказ никуда не отправляется — вот что получил бы
        оператор:
      </p>
      <pre>{{ done }}</pre>
      <div>
        <button type="button" class="pl-btn pl-btn--line" @click="copy"><PlIcon :name="copied ? 'check' : 'copy'" :size="18" />{{ copied ? 'Скопировано' : 'Скопировать' }}</button>
        <button type="button" class="pl-btn pl-btn--main" @click="finish">Очистить корзину</button>
      </div>
    </div>

    <div v-else class="pl-cart__layout">
      <div class="pl-cart__list">
        <article v-for="l in cart.lines.value" :key="l.product.id" class="pl-line">
          <NuxtLink :to="plProductPath(l.product.id)" class="pl-line__photo">
            <img :src="plImg(l.product.img)" :alt="l.product.name" width="120" height="80" />
          </NuxtLink>
          <div class="pl-line__info">
            <NuxtLink :to="plProductPath(l.product.id)" class="pl-line__name">{{ l.product.name }}</NuxtLink>
            <p class="pl-line__price">{{ plFmt(l.product.price) }} {{ l.product.unit }}</p>
            <label class="pl-field pl-line__when">
              <select :value="l.when" aria-label="Когда привезти" @change="cart.setWhen(l.product.id, ($event.target as HTMLSelectElement).value)">
                <option v-for="o in cart.whenOptions(l.product)" :key="o" :value="o">{{ o }}</option>
              </select>
            </label>
          </div>
          <div class="pl-qty pl-line__qty">
            <button type="button" aria-label="Меньше" @click="cart.set(l.product.id, l.qty - 1)"><PlIcon name="minus" :size="18" /></button>
            <span class="pl-qty__n">{{ l.qty }} {{ plQtyUnit(l.product) }}</span>
            <button type="button" aria-label="Больше" @click="cart.add(l.product.id)"><PlIcon name="plus" :size="18" /></button>
          </div>
          <b class="pl-line__sum">{{ plByWeight(l.product) ? '≈ ' : '' }}{{ plFmt(l.sum) }}</b>
          <button type="button" class="pl-line__del" :aria-label="`Удалить ${l.product.name}`" @click="cart.set(l.product.id, 0)">
            <PlIcon name="trash" :size="20" />
          </button>
        </article>
        <p v-if="cart.hasWeight.value" class="pl-cart__weigh">
          ≈ — рыба и мясо продаются поштучно, а цена указана за килограмм: точную сумму назовём после взвешивания.
        </p>
      </div>

      <aside class="pl-cart__side">
        <div class="pl-cart__box">
          <h2>Оформление</h2>
          <div class="pl-seg" role="radiogroup" aria-label="Способ получения">
            <button type="button" :class="{ 'is-active': f.method === 'courier' }" @click="f.method = 'courier'"><PlIcon name="truck" :size="18" />Доставка</button>
            <button type="button" :class="{ 'is-active': f.method === 'pickup' }" @click="f.method = 'pickup'"><PlIcon name="pin" :size="18" />Самовывоз</button>
          </div>

          <template v-if="f.method === 'courier'">
            <label class="pl-field">
              <span>Город</span>
              <select v-model="cart.city.value">
                <option v-for="c in plCities" :key="c">{{ c }}</option>
              </select>
            </label>
            <label class="pl-field"><span>Адрес</span><input v-model="f.address" type="text" autocomplete="street-address" placeholder="Улица, дом, квартира" /></label>
          </template>
          <label v-else class="pl-field">
            <span>Офис выдачи</span>
            <select v-model.number="f.office">
              <option v-for="(o, i) in plOffices" :key="o.street" :value="i">{{ o.city === 'Воронеж' ? '' : `${o.city}, ` }}{{ o.street }}</option>
            </select>
          </label>
          <p v-if="f.method === 'pickup'" class="pl-cart__hint">{{ plOffices[f.office].where }} · ежедневно {{ plOffices[f.office].hours }}</p>

          <label class="pl-check"><input v-model="quick" type="checkbox" /><span>Быстрый заказ — только телефон, остальное уточнит оператор</span></label>
          <label class="pl-field"><span>Телефон *</span><input v-model="f.phone" type="tel" autocomplete="tel" placeholder="+7 900 000-00-00" /></label>
          <template v-if="!quick">
            <label class="pl-field"><span>Имя</span><input v-model="f.name" type="text" autocomplete="given-name" /></label>
            <label class="pl-field"><span>Почта — пришлём состав заказа</span><input v-model="f.email" type="email" autocomplete="email" /></label>
            <label class="pl-field"><span>Комментарий</span><textarea v-model="f.comment" placeholder="Разделать форель на филе, позвонить за час" /></label>
          </template>
          <label class="pl-check"><input v-model="f.subscribe" type="checkbox" /><span>Сообщать о ближайших поставках</span></label>

          <dl class="pl-cart__total">
            <div><dt>Товары, {{ cart.count.value }}</dt><dd>{{ plFmt(cart.total.value) }}</dd></div>
            <div><dt>Доставка</dt><dd>{{ feeLabel }}</dd></div>
            <div class="is-sum"><dt>Итого</dt><dd>{{ cart.hasWeight.value ? '≈ ' : '' }}{{ plFmt(sum) }}</dd></div>
          </dl>
          <p v-if="f.method === 'courier' && cart.fee.value && cart.toFree.value" class="pl-cart__free">
            Ещё {{ plFmt(cart.toFree.value) }} — и привезём бесплатно
          </p>

          <button type="button" class="pl-btn pl-btn--main pl-btn--big pl-cart__send" :disabled="!canSend" @click="submit">Оформить заказ</button>
          <p class="pl-cart__note">Оплата наличными или картой курьеру, картой в офисе. Заказ подтвердит оператор с 9:00 до 19:00.</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pl-cart {
  > .pl-h1 {
    margin-bottom: 24px;
  }

  &__empty,
  &__done {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    max-width: 760px;
    padding: 32px;
    border-radius: 20px;
    background: var(--pl-kraft);

    > div {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }

  &__done {
    h2 {
      font-size: 26px;
    }

    pre {
      width: 100%;
      padding: 16px;
      border-radius: 12px;
      background: #fff;
      font-family: inherit;
      font-size: 14px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 400px;
    gap: 32px;
    align-items: start;
  }

  &__list {
    display: grid;
    gap: 12px;
  }

  &__weigh {
    color: var(--pl-muted);
    font-size: 14px;
  }

  &__side {
    position: sticky;
    top: 16px;
  }

  &__box {
    display: grid;
    gap: 14px;
    padding: 24px;
    border-radius: 20px;
    background: var(--pl-kraft);

    h2 {
      font-size: 24px;
    }
  }

  &__hint {
    margin-top: -6px;
    color: var(--pl-muted);
    font-size: 14px;
  }

  &__total {
    display: grid;
    gap: 8px;
    margin: 4px 0 0;
    padding-top: 14px;
    border-top: 1px solid var(--pl-field);
    font-variant-numeric: tabular-nums;

    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }

    dd {
      margin: 0;
      color: var(--pl-dark);
      font-weight: 700;
      white-space: nowrap;
    }

    .is-sum {
      font-size: 20px;
      color: var(--pl-dark);
      font-weight: 700;
    }
  }

  &__free {
    color: var(--pl-accent-d);
    font-weight: 700;
    font-size: 15px;
  }

  &__send {
    width: 100%;
  }

  &__note {
    color: var(--pl-muted);
    font-size: 13px;
  }

  @media (max-width: 1199px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr) 360px;
      gap: 24px;
    }
  }

  @media (max-width: 989px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }

    &__side {
      position: static;
    }
  }

  @media (max-width: 768px) {
    &__empty,
    &__done,
    &__box {
      padding: 20px 16px;
    }
  }
}

.pl-line {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) 150px 110px 44px;
  grid-template-areas: 'photo info qty sum del';
  align-items: center;
  gap: 16px;
  padding: 14px;
  border: 1px solid var(--pl-line);
  border-radius: 18px;

  &__photo {
    grid-area: photo;

    img {
      width: 120px;
      aspect-ratio: 3 / 2;
      height: auto;
      border-radius: 10px;
      object-fit: cover;
    }
  }

  &__info {
    grid-area: info;
    display: grid;
    gap: 4px;
    min-width: 0;
  }

  &__name {
    color: var(--pl-dark);
    font-weight: 700;
    line-height: 1.3;

    &:hover {
      color: var(--pl-accent);
    }
  }

  &__price {
    color: var(--pl-muted);
    font-size: 14px;
  }

  &__when {
    max-width: 280px;
    margin-top: 4px;

    select {
      height: 38px;
      font-size: 14px;
    }
  }

  &__qty {
    grid-area: qty;
  }

  &__sum {
    grid-area: sum;
    color: var(--pl-dark);
    font-size: 18px;
    font-variant-numeric: tabular-nums;
    text-align: right;
    white-space: nowrap;
  }

  &__del {
    grid-area: del;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    color: var(--pl-muted);

    &:hover {
      background: var(--pl-kraft);
      color: var(--pl-red);
    }
  }

  @media (max-width: 1400px) {
    grid-template-columns: 96px minmax(0, 1fr) 140px 44px;
    grid-template-areas:
      'photo info info del'
      'photo sum qty qty';
    row-gap: 10px;

    &__photo {
      align-self: start;
    }

    &__photo img {
      width: 96px;
    }
  }

  @media (max-width: 576px) {
    grid-template-columns: 72px minmax(0, 1fr) minmax(0, 1fr) 44px;
    grid-template-areas:
      'photo info info del'
      'qty qty sum sum';
    gap: 10px 12px;
    padding: 12px;

    &__photo img {
      width: 72px;
    }

    &__qty {
      max-width: 170px;
    }
  }
}

.pl-seg {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: #fff;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 40px;
    border-radius: 9px;
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;

    &.is-active {
      background: var(--pl-accent-soft);
      color: var(--pl-accent-d);
    }
  }
}
</style>
