<script lang="ts" setup>
import DrIcon from '~/components/redesign/dereda/DrIcon.vue'
import DrPhone from '~/components/redesign/dereda/DrPhone.vue'
import DrQty from '~/components/redesign/dereda/DrQty.vue'
import DrTickets from '~/components/redesign/dereda/DrTickets.vue'

useSeoMeta({ title: 'Корзина — Дереда | Концепт редизайна' })

const shop = useDeredaShop()
const now = useDrNow()
const f = shop.form

const deliveries = computed(() => drDeliveries(now.value, 4))
const chosen = computed(() => deliveries.value.find((d) => d.key === shop.day.value) ?? deliveries.value[0])
const zone = computed(() => shop.zone.value)
const toFree = computed(() => (zone.value ? Math.max(0, zone.value.free - shop.goods.value) : 0))
const freePct = computed(() => (zone.value ? Math.min(100, Math.round((shop.goods.value / zone.value.free) * 100)) : 0))

// «Уже покупали у нас?» — демо-вход по телефону: подставляем данные постоянного покупателя
const loginPhone = () => {
  if (f.value.phone.replace(/\D/g, '').length < 11) return
  shop.user.value = shop.user.value ?? { name: 'Покупатель', email: '', phone: f.value.phone, spent: 23400, birthday: '' }
  if (!f.value.name) f.value.name = shop.user.value.name
}

// Промокод: в оригинале — «день рождения», 5 % от заказа от 2 500 ₽
const code = ref(shop.coupon.value)
const codeMsg = computed(() => {
  if (!shop.coupon.value) return ''
  if (!shop.bdayOk.value) return 'Такого промокода нет'
  if (!shop.user.value) return 'Промокод работает для зарегистрированных покупателей — войдите в кабинет'
  if (shop.goods.value < 2500) return `Промокод действует для заказа от 2 500 ₽ — добавьте ещё на ${drMoney(2500 - shop.goods.value)}`
  if (shop.levelOff.value > shop.bdayOff.value) return 'Скидки не суммируются — накопительная выгоднее, применили её'
  return 'Скидка 5 % на день рождения применена (кроме товаров по акции)'
})
const applyCode = () => {
  shop.coupon.value = code.value.trim()
}

const missing = computed(() => {
  const m: string[] = []
  if (shop.short.value > 0) m.push(`добавьте товаров ещё на ${drMoney(shop.short.value)} — минимальный заказ ${drMoney(DR_MIN)}`)
  if (f.value.phone.replace(/\D/g, '').length < 11) m.push('телефон')
  if (!f.value.name.trim()) m.push('имя')
  if (!shop.pickup.value && !f.value.district) m.push('район')
  if (!shop.pickup.value && (!f.value.street.trim() || !f.value.house.trim())) m.push('адрес')
  if (!f.value.agree) m.push('согласие с условиями')
  return m
})

const done = ref<DrOrder | null>(null)
const submit = () => {
  if (missing.value.length || !chosen.value) return
  const order: DrOrder = {
    n: 10000 + Math.floor(Math.random() * 89999),
    date: new Date().toLocaleDateString('ru-RU'),
    day: chosen.value.label,
    total: shop.total.value,
    count: shop.count.value,
    pickup: shop.pickup.value,
  }
  if (!shop.user.value && f.value.regular) {
    shop.user.value = { name: f.value.name, email: f.value.email, phone: f.value.phone, spent: 0, birthday: '' }
  }
  if (shop.user.value) shop.orders.value = [order, ...shop.orders.value]
  done.value = order
  shop.clear()
  shop.coupon.value = ''
  code.value = ''
  f.value.agree = false
  window.scrollTo({ top: 0 })
}
</script>

<template>
  <div class="dr-wrap dr-page dr-cart">
    <nav class="dr-crumbs" aria-label="Навигация">
      <NuxtLink :to="drPath('/')">Главная</NuxtLink>
      <span>Корзина</span>
    </nav>

    <div v-if="done" class="dr-cart__done">
      <div class="dr-done">
        <DrIcon name="check" :size="36" />
        <h1>Заказ № {{ done.n }} принят</h1>
        <p>
          {{ done.pickup ? 'Заберёте' : 'Привезём' }} в {{ done.day }}. Накануне пришлём на e-mail и в WhatsApp двухчасовой интервал доставки. Итого
          {{ drMoney(done.total) }} — оплата при получении.
        </p>
        <p class="dr-muted">Это демо: в концепте заказ никуда не отправляется. На сайте магазина его получат менеджеры и передадут фермерам.</p>
        <div class="dr-cart__donebtns">
          <NuxtLink :to="drPath('/catalog')" class="dr-btn dr-btn--main">Вернуться в каталог</NuxtLink>
          <NuxtLink v-if="shop.user.value" :to="drPath('/kabinet')" class="dr-btn dr-btn--line">Мои заказы</NuxtLink>
        </div>
      </div>
    </div>

    <template v-else>
      <h1>Корзина</h1>

      <div v-if="!shop.lines.value.length" class="dr-empty dr-cart__empty">
        <img src="/redesign/dereda/girl.png" alt="" width="61" height="88" style="width: 61px" />
        <h3>Корзина пока пустая</h3>
        <p class="dr-muted">Загляните в новинки или к любимым фермерам.</p>
        <NuxtLink :to="drPath('/catalog')" class="dr-btn dr-btn--main">Перейти в каталог</NuxtLink>
      </div>

      <div v-else class="dr-cart__layout">
        <div class="dr-cart__main">
          <section class="dr-cart__block">
            <div class="dr-cart__blockhead">
              <h2>{{ shop.count.value }} {{ drPlural(shop.count.value, 'товар', 'товара', 'товаров') }}</h2>
              <button type="button" class="dr-link" @click="shop.clear()">Очистить корзину</button>
            </div>
            <ul class="dr-cart__lines">
              <li v-for="l in shop.lines.value" :key="l.key" class="dr-line">
                <NuxtLink :to="drPath(`/product/${l.p.id}`)" class="dr-line__img"><img :src="l.p.img" alt="" width="88" height="88" /></NuxtLink>
                <div class="dr-line__info">
                  <NuxtLink :to="drPath(`/product/${l.p.id}`)" class="dr-line__title">{{ drShort(l.p.title) }}</NuxtLink>
                  <small>
                    <template v-if="drFarmer(l.p.farmer)">{{ drFarmer(l.p.farmer)!.name }}</template>
                    <template v-if="drPackOf(l.p, l.v)"> · {{ drPackOf(l.p, l.v) }}</template>
                  </small>
                  <span class="dr-line__price">{{ drMoney(l.price) }} / шт</span>
                </div>
                <div class="dr-line__qty">
                  <DrQty :qty="l.qty" @inc="shop.inc(l.p, l.v)" @dec="shop.dec(l.p, l.v)" @set="shop.setKey(l.key, $event)" />
                </div>
                <b class="dr-line__sum">{{ drMoney(l.sum) }}</b>
                <button type="button" class="dr-line__del" :aria-label="`Удалить: ${l.p.title}`" @click="shop.setKey(l.key, 0)">
                  <DrIcon name="trash" :size="20" />
                </button>
              </li>
            </ul>
            <p v-if="shop.weighed.value" class="dr-cart__note">
              <DrIcon name="info" :size="18" />В заказе есть весовые позиции — итоговая сумма после взвешивания может измениться в большую или меньшую сторону.
            </p>
          </section>

          <form class="dr-cart__block dr-form" novalidate @submit.prevent="submit">
            <h2>Оформление</h2>

            <div class="dr-cart__row">
              <label class="dr-field"><span>Телефон *</span><DrPhone v-model="f.phone" /></label>
              <div v-if="!shop.user.value" class="dr-cart__login">
                <span>Уже покупали у нас?</span>
                <button type="button" class="dr-link" @click="loginPhone">Войти по номеру</button>
              </div>
              <div v-else class="dr-cart__login">
                <span>Вы вошли как {{ shop.user.value.name }}</span>
                <NuxtLink :to="drPath('/kabinet')" class="dr-link">Кабинет</NuxtLink>
              </div>
            </div>

            <fieldset class="dr-cart__way">
              <legend>Как получить</legend>
              <label :class="{ 'is-on': !shop.pickup.value }">
                <input v-model="shop.pickup.value" type="radio" :value="false" />
                <DrIcon name="truck" :size="22" />
                <span><b>Курьером</b><small>вт и пт, 10:00–20:00, подъём в квартиру</small></span>
              </label>
              <label :class="{ 'is-on': shop.pickup.value }">
                <input v-model="shop.pickup.value" type="radio" :value="true" />
                <DrIcon name="pin" :size="22" />
                <span><b>Самовывоз</b><small>ул. Сиреневая, 29, оф. 3, пн–пт 9:00–18:00</small></span>
              </label>
            </fieldset>

            <template v-if="!shop.pickup.value">
              <label class="dr-field">
                <span>Район *</span>
                <select v-model="f.district">
                  <option value="" disabled>Выберите район</option>
                  <optgroup v-for="z in drZones" :key="z.id" :label="`Зона ${z.id}: бесплатно от ${z.free} ₽, иначе ${z.fee} ₽`">
                    <option v-for="d in z.districts" :key="d" :value="d">{{ d }}</option>
                  </optgroup>
                </select>
              </label>
              <div v-if="zone" class="dr-cart__zone">
                <span>
                  Зона {{ zone.id }}:
                  <template v-if="toFree">доставка {{ drMoney(zone.fee) }}, ещё {{ drMoney(toFree) }} — и бесплатно</template>
                  <template v-else><b>доставка бесплатно</b></template>
                </span>
                <i :style="{ width: `${freePct}%` }" />
              </div>
              <div class="dr-cart__addr">
                <label class="dr-field"><span>Улица *</span><input v-model="f.street" autocomplete="address-line1" /></label>
                <label class="dr-field"><span>Дом *</span><input v-model="f.house" /></label>
                <label class="dr-field"><span>Кв./офис</span><input v-model="f.flat" /></label>
              </div>
            </template>

            <div class="dr-field">
              <span>{{ shop.pickup.value ? 'К какому дню собрать' : 'День доставки' }}</span>
              <DrTickets v-model="shop.day.value" :n="4" pick />
              <small class="dr-muted">
                За день до доставки пришлём на e-mail и в WhatsApp двухчасовой интервал. Отказаться от заказа можно до 16:00 дня окончания приёма.
              </small>
            </div>

            <div class="dr-cart__row dr-cart__row--3">
              <label class="dr-field"><span>Имя *</span><input v-model="f.name" autocomplete="given-name" /></label>
              <label class="dr-field"><span>Фамилия</span><input v-model="f.surname" autocomplete="family-name" /></label>
              <label class="dr-field"><span>Email</span><input v-model="f.email" type="email" autocomplete="email" /></label>
            </div>
            <label class="dr-field"><span>Комментарий к заказу</span><textarea v-model="f.comment" rows="3" placeholder="Подъезд, этаж, домофон" /></label>

            <fieldset class="dr-cart__pay">
              <legend>Оплата</legend>
              <label class="dr-check">
                <input v-model="shop.pay.value" type="radio" value="cash" />
                <span>Наличными при получении</span>
              </label>
              <label class="dr-check">
                <input v-model="shop.pay.value" type="radio" value="transfer" />
                <span>Переводом на расчётный счёт — доставим после поступления денег</span>
              </label>
            </fieldset>

            <div class="dr-cart__checks">
              <label class="dr-check"><input v-model="f.news" type="checkbox" /><span>Подписаться на новости и акции</span></label>
              <label v-if="!shop.user.value" class="dr-check">
                <input v-model="f.regular" type="checkbox" /><span>Стать постоянным покупателем — копить накопительную скидку до 6 %</span>
              </label>
              <label class="dr-check"><input v-model="f.bot" type="checkbox" /><span>Присылать статус заказа в Telegram-бот @Dereda_bot</span></label>
              <label class="dr-check"><input v-model="f.agree" type="checkbox" /><span>Согласен с условиями оферты и политики конфиденциальности *</span></label>
            </div>
            <button type="submit" class="dr-btn dr-btn--main dr-btn--big dr-cart__submit" :disabled="!!missing.length">Оформить заказ</button>
            <p v-if="missing.length" class="dr-cart__missing">Осталось: {{ missing.join(', ') }}</p>
          </form>
        </div>

        <aside class="dr-cart__sum">
          <h2>Ваш заказ</h2>
          <dl>
            <div>
              <dt>Товары, {{ shop.count.value }} шт</dt>
              <dd>{{ drMoney(shop.goods.value) }}</dd>
            </div>
            <div v-if="shop.discount.value">
              <dt>{{ shop.discountLabel.value }}</dt>
              <dd class="dr-cart__minus">−{{ drMoney(shop.discount.value) }}</dd>
            </div>
            <div>
              <dt>{{ shop.pickup.value ? 'Самовывоз' : 'Доставка' }}</dt>
              <dd>
                <template v-if="shop.pickup.value || (zone && !shop.fee.value)">бесплатно</template>
                <template v-else-if="zone">{{ drMoney(shop.fee.value) }}</template>
                <template v-else>выберите район</template>
              </dd>
            </div>
            <div v-if="chosen">
              <dt>День</dt>
              <dd>{{ chosen.short }}</dd>
            </div>
          </dl>
          <div class="dr-cart__total">
            <span>Итого</span>
            <b>{{ drMoney(shop.total.value) }}</b>
          </div>
          <p v-if="shop.weighed.value" class="dr-muted dr-cart__small">Сумма уточнится после взвешивания</p>
          <p v-if="shop.short.value" class="dr-cart__minnote">Минимальный заказ {{ drMoney(DR_MIN) }} — добавьте ещё на {{ drMoney(shop.short.value) }}</p>

          <form class="dr-cart__code" @submit.prevent="applyCode">
            <label class="dr-field"><span>Промокод</span><input v-model="code" placeholder="Например, «день рождения»" /></label>
            <button type="submit" class="dr-btn dr-btn--line">Применить</button>
          </form>
          <p v-if="codeMsg" class="dr-cart__small" :class="shop.bdayOff.value && shop.bdayOff.value >= shop.levelOff.value ? 'is-ok' : 'dr-muted'">
            {{ codeMsg }}
          </p>
          <p v-if="shop.level.value" class="dr-cart__small is-ok">Накопительная скидка {{ shop.level.value.pct }} % по сумме ваших заказов</p>
          <NuxtLink :to="drPath('/catalog')" class="dr-cart__back"><DrIcon name="left" :size="18" />Вернуться и положить ещё</NuxtLink>
        </aside>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.dr-cart {
  h1 {
    margin-bottom: 22px;
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 32px;
    align-items: start;

    @media (max-width: 1199px) {
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 24px;
    }

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__main {
    display: grid;
    gap: 24px;
  }

  &__block {
    display: grid;
    gap: 18px;
    padding: 28px;
    border: 1px solid var(--dr-line);
    border-radius: var(--dr-R);

    h2 {
      font-size: 28px;
    }

    @media (max-width: 576px) {
      padding: 20px 16px;
    }
  }

  &__blockhead {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  ul.dr-cart__lines {
    display: grid;
  }

  &__note {
    display: flex;
    gap: 8px;
    color: var(--dr-muted);
    font-size: 14px;

    svg {
      flex: none;
      margin-top: 2px;
    }
  }

  &__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: end;
    gap: 14px;

    &--3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (max-width: 768px) {
      grid-template-columns: minmax(0, 1fr);
      align-items: start;
    }
  }

  &__login {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 10px;
    min-height: 48px;
    color: var(--dr-muted);
  }

  fieldset {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;

    legend {
      margin-bottom: 8px;
      padding: 0;
      color: var(--dr-dark);
      font-size: 14px;
      font-weight: 600;
    }
  }

  &__way {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }

    label {
      display: grid;
      grid-template-columns: 22px minmax(0, 1fr);
      align-items: start;
      gap: 12px;
      padding: 14px 16px;
      border: 1px solid var(--dr-line);
      border-radius: var(--dr-r);
      cursor: pointer;

      input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }

      svg {
        color: var(--dr-brown);
      }

      span {
        display: grid;
        line-height: 1.35;
      }

      small {
        color: var(--dr-muted);
      }

      &.is-on {
        border-color: var(--dr-accent);
        background: var(--dr-accent-soft);

        svg {
          color: var(--dr-accent);
        }
      }

      &:focus-within {
        box-shadow: 0 0 0 3px rgba(210, 63, 34, 0.18);
      }
    }
  }

  &__zone {
    position: relative;
    overflow: hidden;
    padding: 10px 14px 14px;
    border-radius: var(--dr-r);
    background: var(--dr-green-soft);
    color: var(--dr-green);
    font-size: 15px;

    i {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 4px;
      background: var(--dr-green);
      transition: width 0.3s;
    }
  }

  &__addr {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px;

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

      label:first-child {
        grid-column: 1 / -1;
      }
    }
  }

  &__pay {
    display: grid;
    gap: 10px;
  }

  &__checks {
    display: grid;
    gap: 10px;
  }

  &__submit {
    justify-self: start;

    @media (max-width: 576px) {
      justify-self: stretch;
    }
  }

  &__missing {
    color: var(--dr-muted);
    font-size: 14px;
  }

  &__sum {
    position: sticky;
    top: calc(var(--dr-stuck, 120px) + 16px);
    display: grid;
    gap: 14px;
    padding: 24px;
    border-radius: var(--dr-R);
    background: var(--dr-surface);

    h2 {
      font-size: 26px;
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
        color: var(--dr-muted);
      }

      dd {
        font-weight: 600;
        text-align: right;
      }
    }

    @media (max-width: 989px) {
      position: static;
    }
  }

  &__minus {
    color: var(--dr-green);
  }

  &__total {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid var(--dr-line);

    span {
      font-weight: 600;
    }

    b {
      font-size: 28px;
    }
  }

  &__small {
    font-size: 14px;

    &.is-ok {
      color: var(--dr-green);
    }
  }

  &__minnote {
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--dr-accent-soft);
    color: var(--dr-accent-hover);
    font-size: 14px;
    font-weight: 600;
  }

  &__code {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: 8px;

    input {
      width: 0;
      min-width: 100%;
    }
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--dr-accent);
    font-weight: 600;
  }

  &__done {
    max-width: 640px;
    margin: 24px auto 0;
    padding: 40px 28px;
    border-radius: var(--dr-R);
    background: var(--dr-surface);
  }

  &__donebtns {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 8px;
  }
}

.dr-line {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr) 150px 110px 40px;
  grid-template-areas: 'img info qty sum del';
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--dr-line);

  &:first-child {
    padding-top: 0;
  }

  &__img {
    grid-area: img;

    img {
      width: 88px;
      height: 88px;
      border-radius: 14px;
      object-fit: cover;
    }
  }

  &__info {
    grid-area: info;
    display: grid;
    gap: 2px;
    min-width: 0;

    small {
      color: var(--dr-brown);
      font-size: 14px;
    }
  }

  &__title {
    font-weight: 600;
    line-height: 1.3;

    &:hover {
      color: var(--dr-accent);
    }
  }

  &__price {
    color: var(--dr-muted);
    font-size: 14px;
  }

  &__qty {
    grid-area: qty;
  }

  &__sum {
    grid-area: sum;
    font-size: 18px;
    text-align: right;
    white-space: nowrap;
  }

  &__del {
    grid-area: del;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 10px;
    background: none;
    color: var(--dr-muted);
    cursor: pointer;

    &:hover {
      background: var(--dr-accent-soft);
      color: var(--dr-accent);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 72px minmax(132px, 1fr) minmax(0, 1fr) 40px;
    grid-template-areas:
      'img info info del'
      'img qty sum sum';
    gap: 10px 12px;

    &__img img {
      width: 72px;
      height: 72px;
    }
  }

  @media (max-width: 375px) {
    grid-template-columns: 56px minmax(116px, 1fr) minmax(0, 1fr) 36px;
    gap: 10px 8px;

    &__img img {
      width: 56px;
      height: 56px;
    }

    &__del {
      width: 36px;
    }
  }
}
</style>
