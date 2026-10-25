<script lang="ts" setup>
import PcIcon from '~/components/redesign/38pchel/PcIcon.vue'

const shop = usePchelShop()
const ui = usePchelUi()
const form = shop.form

const done = ref<PcOrder | null>(null)
const error = ref('')

const payments = computed(() =>
  form.value.zone === 'russia'
    ? [{ id: 'prepay', title: 'Полная предоплата', text: 'Переводом на карту после подтверждения заказа' }]
    : [
        { id: 'cash', title: 'Наличными при получении', text: '' },
        { id: 'card', title: 'Переводом на карту при получении', text: '' },
        { id: 'invoice', title: 'По счёту для предприятий', text: 'Пришлём счёт на почту' },
      ],
)
watch(
  () => form.value.zone,
  (z) => {
    if (z === 'russia') form.value.payment = 'prepay'
    else if (form.value.payment === 'prepay') form.value.payment = 'cash'
  },
)

const needAddress = computed(() => form.value.zone !== 'pickup')
const grand = computed(() => shop.total.value + (shop.delivery.value ?? 0))

const submit = () => {
  if (!shop.lines.value.length) return
  if (shop.belowMin.value) return (error.value = `Минимальная сумма для доставки — ${pcRub(shop.zone.value.min)}`)
  if (!form.value.name.trim() || form.value.phone.replace(/\D/g, '').length < 10) return (error.value = 'Укажите имя и телефон')
  if (needAddress.value && !form.value.address.trim()) return (error.value = 'Укажите адрес доставки')
  error.value = ''
  done.value = shop.placeOrder()
  window.scrollTo({ top: 0 })
}
</script>

<template>
  <div class="pc-wrap pc-cart">
    <nav class="pc-crumbs" aria-label="Навигация">
      <NuxtLink :to="pcPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Корзина</span>
    </nav>

    <div v-if="done" class="pc-panel pc-cart__done">
      <span class="pc-cart__done-icon"><PcIcon name="check" :size="32" /></span>
      <h1>Заказ № {{ done.id }} принят</h1>
      <p>
        Сергей перезвонит в течение часа и договорится о времени доставки. Заказ на {{ pcRub(done.total) }}.
        <b>Это демо: в концепте заказ никуда не отправляется.</b>
      </p>
      <div class="pc-cart__done-actions">
        <NuxtLink :to="pcPath('/account')" class="pc-btn pc-btn--dark">Мои заказы</NuxtLink>
        <NuxtLink :to="pcPath('/catalog')" class="pc-btn pc-btn--line">Вернуться в каталог</NuxtLink>
      </div>
    </div>

    <template v-else>
      <h1 class="pc-title">Корзина</h1>

      <div v-if="!shop.lines.value.length" class="pc-panel pc-cart__empty">
        <PcIcon name="jar" :size="40" />
        <h2>В корзине пусто</h2>
        <p>Начните с мёда урожая 2026 года — донникового или эспарцетового.</p>
        <NuxtLink :to="{ path: pcPath('/catalog'), query: { s: 'honey' } }" class="pc-btn pc-btn--accent">Выбрать мёд</NuxtLink>
      </div>

      <div v-else class="pc-cart__grid">
        <div class="pc-cart__main">
          <ul class="pc-cart__lines">
            <li v-for="l in shop.lines.value" :key="l.key" class="pc-cart__line">
              <NuxtLink :to="pcPath(`/product/${l.product.id}`)" class="pc-cart__img">
                <img :src="pcImg(l.product.img)" :alt="l.product.title" width="96" height="96" />
              </NuxtLink>
              <div class="pc-cart__name">
                <NuxtLink :to="pcPath(`/product/${l.product.id}`)">{{ l.product.title }}</NuxtLink>
                <span>{{ l.label }} · {{ pcRub(l.unitPrice) }}</span>
              </div>
              <div class="pc-qty is-on">
                <button type="button" class="pc-qty__btn" aria-label="Меньше" @click="shop.setQty(l.key, l.qty - 1)"><PcIcon name="minus" :size="18" /></button>
                <span class="pc-qty__val"><b>{{ l.qty }}</b> шт</span>
                <button type="button" class="pc-qty__btn" aria-label="Больше" @click="shop.setQty(l.key, l.qty + 1)"><PcIcon name="plus" :size="18" /></button>
              </div>
              <b class="pc-cart__sum">{{ pcRub(l.sum) }}</b>
              <button type="button" class="pc-cart__del" aria-label="Удалить" @click="shop.setQty(l.key, 0)"><PcIcon name="trash" :size="20" /></button>
            </li>
          </ul>

          <form id="pc-order" class="pc-cart__form" @submit.prevent="submit">
            <h2>Доставка</h2>
            <div class="pc-cart__zones" role="radiogroup">
              <label v-for="z in pcZones" :key="z.id" class="pc-radio" :class="{ 'is-on': form.zone === z.id }">
                <input v-model="form.zone" type="radio" name="zone" :value="z.id" />
                <span>
                  <b>{{ z.title }}</b>
                  <small>{{ z.text }}</small>
                  <em>
                    {{
                      z.freeFrom
                        ? `${pcRub(z.price!)}, бесплатно от ${pcRub(z.freeFrom)}`
                        : z.price === 0
                          ? 'бесплатно'
                          : 'стоимость пересылки сообщим'
                    }}
                  </em>
                </span>
              </label>
            </div>

            <h2>Получатель</h2>
            <div class="pc-cart__fields">
              <label class="pc-field"><span>Имя</span><input v-model="form.name" type="text" autocomplete="name" /></label>
              <label class="pc-field"><span>Телефон</span><input v-model="form.phone" type="tel" autocomplete="tel" placeholder="+7" /></label>
              <label class="pc-field"><span>E-mail, если нужен счёт</span><input v-model="form.email" type="email" autocomplete="email" /></label>
              <label v-if="needAddress" class="pc-field pc-cart__wide">
                <span>{{ form.zone === 'russia' ? 'Город, индекс и адрес' : 'Адрес' }}</span>
                <input v-model="form.address" type="text" autocomplete="street-address" />
              </label>
              <label class="pc-field pc-cart__wide"><span>Комментарий</span><textarea v-model="form.comment" placeholder="Удобное время, подъезд, домофон" /></label>
            </div>

            <h2>Оплата</h2>
            <div class="pc-cart__pay" role="radiogroup">
              <label v-for="pay in payments" :key="pay.id" class="pc-radio" :class="{ 'is-on': form.payment === pay.id }">
                <input v-model="form.payment" type="radio" name="payment" :value="pay.id" />
                <span>
                  <b>{{ pay.title }}</b>
                  <small v-if="pay.text">{{ pay.text }}</small>
                </span>
              </label>
            </div>
          </form>
        </div>

        <aside class="pc-cart__aside">
          <div class="pc-panel pc-cart__summary">
            <h2>Ваш заказ</h2>
            <dl>
              <div>
                <dt>Товары · {{ shop.count.value }} шт</dt>
                <dd>{{ pcRub(shop.total.value) }}</dd>
              </div>
              <div>
                <dt>Доставка</dt>
                <dd>{{ shop.delivery.value === null ? 'по тарифу' : shop.delivery.value ? pcRub(shop.delivery.value) : 'бесплатно' }}</dd>
              </div>
            </dl>
            <p v-if="shop.belowMin.value" class="pc-cart__hint is-warn">
              Минимальная сумма для доставки — {{ pcRub(shop.zone.value.min) }}. Добавьте ещё на {{ pcRub(shop.zone.value.min - shop.total.value) }}
            </p>
            <p v-else-if="shop.toFree.value" class="pc-cart__hint">
              До бесплатной доставки — {{ pcRub(shop.toFree.value) }}
              <span class="pc-cart__bar"><i :style="{ width: `${Math.min(100, (shop.total.value / shop.zone.value.freeFrom!) * 100)}%` }" /></span>
            </p>
            <div class="pc-cart__grand">
              <span>Итого</span>
              <b>{{ pcRub(grand) }}</b>
            </div>
            <p v-if="error" class="pc-modal__error">{{ error }}</p>
            <button type="submit" form="pc-order" class="pc-btn pc-btn--accent pc-btn--wide">Оформить заказ</button>
            <p class="pc-cart__small">
              {{ shop.user.value ? `Заказ появится в кабинете ${shop.user.value.email}` : 'Можно без регистрации.' }}
              <button v-if="!shop.user.value" type="button" @click="ui.loginOpen.value = true">Войти</button>
            </p>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.pc-cart {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 32px;
    align-items: start;
    margin-top: 24px;
  }

  ul.pc-cart__lines {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--pc-line);
  }

  &__line {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr) auto 110px 40px;
    align-items: center;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid var(--pc-line);
  }

  &__img img {
    display: block;
    width: 96px;
    height: 96px;
    object-fit: contain;
    border-radius: 16px;
    box-shadow: inset 0 0 0 1px var(--pc-line);
  }

  &__name {
    display: flex;
    flex-direction: column;
    gap: 4px;

    a {
      font-family: var(--pc-head);
      font-size: 19px;
      font-weight: 700;
      line-height: 1.2;
    }

    span {
      color: var(--pc-muted);
      font-size: 14px;
    }
  }

  &__sum {
    text-align: right;
    font-size: 18px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  &__del {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    color: var(--pc-muted);

    &:hover {
      color: var(--pc-accent);
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 40px;

    h2 {
      margin-top: 8px;
      font-size: 28px;
    }
  }

  &__zones,
  &__pay {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  &__fields {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  &__wide {
    grid-column: 1 / -1;
  }

  &__aside {
    position: sticky;
    top: 150px;
  }

  &__summary {
    display: flex;
    flex-direction: column;
    gap: 14px;

    h2 {
      font-size: 26px;
    }

    dl {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 0;

      div {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      dd {
        margin: 0;
        font-weight: 600;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }
    }
  }

  &__hint {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 12px;
    background: #fff;
    font-size: 14px;

    &.is-warn {
      background: var(--pc-honey-soft);
    }
  }

  &__bar {
    display: block;
    height: 6px;
    border-radius: 3px;
    background: var(--pc-line);
    overflow: hidden;

    i {
      display: block;
      height: 100%;
      border-radius: 3px;
      background: var(--pc-accent);
    }
  }

  &__grand {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 14px;
    border-top: 1px solid var(--pc-line-strong);

    b {
      font-family: var(--pc-head);
      font-size: 32px;
      font-variant-numeric: tabular-nums;
    }
  }

  &__small {
    color: var(--pc-muted);
    font-size: 13px;
    text-align: center;

    button {
      color: var(--pc-accent);
      font-weight: 600;
    }
  }

  &__empty,
  &__done {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    margin-top: 24px;

    svg {
      color: var(--pc-accent);
    }

    p {
      max-width: 620px;
    }
  }

  &__done h1 {
    font-size: clamp(30px, 3.6vw, 44px);
  }

  &__done-icon {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: var(--pc-honey);

    svg {
      color: var(--pc-ink);
    }
  }

  &__done-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 1199px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr) 320px;
    }

    &__line {
      grid-template-columns: 72px minmax(0, 1fr) auto 40px;
      grid-template-areas: 'img name name del' 'img qty sum sum';
      row-gap: 10px;
    }

    &__img {
      grid-area: img;
      align-self: start;

      img {
        width: 72px;
        height: 72px;
      }
    }

    &__name {
      grid-area: name;
    }

    .pc-qty {
      grid-area: qty;
      justify-self: start;
    }

    &__sum {
      grid-area: sum;
    }

    &__del {
      grid-area: del;
      align-self: start;
    }

    &__fields {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }

    &__aside {
      position: static;
    }
  }

  @media (max-width: 576px) {
    &__zones,
    &__pay,
    &__fields {
      grid-template-columns: minmax(0, 1fr);
    }

    &__line {
      gap: 10px 12px;
    }
  }
}

.pc-radio {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background: #fff;
  box-shadow: inset 0 0 0 1px var(--pc-line-strong);
  cursor: pointer;
  transition: box-shadow 0.15s;

  input {
    flex: none;
    width: 20px;
    height: 20px;
    margin: 2px 0 0;
    accent-color: var(--pc-accent);
  }

  span {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }

  small {
    color: var(--pc-muted);
    font-size: 13px;
    line-height: 1.35;
  }

  em {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
  }

  &.is-on {
    box-shadow: inset 0 0 0 2px var(--pc-ink);
  }
}
</style>
