<script lang="ts" setup>
import BkIcon from '~/components/redesign/bukety/BkIcon.vue'
import BkCard from '~/components/redesign/bukety/BkCard.vue'

useSeoMeta({ title: 'Корзина и оформление — Любимые Букеты | Концепт редизайна' })

const shop = useBuketyShop()
const ui = useBuketyUi()
const { now, eta } = useBuketyClock()
const f = shop.form

// Интервалы по два часа и ночь — магазин работает круглосуточно.
const slots = [
  { id: '08-10', title: '8–10', from: 8 },
  { id: '10-12', title: '10–12', from: 10 },
  { id: '12-14', title: '12–14', from: 12 },
  { id: '14-16', title: '14–16', from: 14 },
  { id: '16-18', title: '16–18', from: 16 },
  { id: '18-20', title: '18–20', from: 18 },
  { id: '20-22', title: '20–22', from: 20 },
  { id: '22-24', title: '22–24', from: 22 },
  { id: 'night', title: 'ночью 0–8', from: 24 },
]
// Сегодня прошедшие интервалы недоступны: начало должно быть позже, чем через час.
const slotOff = (from: number) => f.value.day === 'today' && now.value !== null && from < now.value.getHours() + 1
watch([() => f.value.day, now], () => {
  const s = slots.find((x) => x.id === f.value.slot)
  if (s && slotOff(s.from)) f.value.slot = 'asap'
})

const tomorrow = computed(() => (now.value ? new Date(now.value.getTime() + 86400000) : null))
const minDate = computed(() => (now.value ? now.value.toISOString().slice(0, 10) : ''))
const whenText = computed(() => {
  const day =
    f.value.day === 'today'
      ? 'сегодня'
      : f.value.day === 'tomorrow'
        ? `завтра${tomorrow.value ? ', ' + bkDay(tomorrow.value) : ''}`
        : f.value.date
          ? bkDay(new Date(f.value.date))
          : 'дата не выбрана'
  const slot = f.value.slot === 'asap' ? (eta.value ? `к ${eta.value}` : 'в течение часа') : slots.find((x) => x.id === f.value.slot)?.title
  return f.value.zone === 'pickup' ? `Самовывоз ${day}` : `${day[0].toUpperCase()}${day.slice(1)}, ${slot}${f.value.askRecipient ? ', время уточним у получателя' : ''}`
})

const pickup = computed(() => f.value.zone === 'pickup')
const deliveryText = computed(() =>
  shop.delivery.value === null ? 'по телефону' : shop.delivery.value ? bkRub(shop.delivery.value) : 'бесплатно',
)
const grand = computed(() => shop.total.value + (shop.delivery.value ?? 0))

const couponOk = ref(false)
const applyCoupon = () => {
  couponOk.value = f.value.coupon.trim().toLowerCase() === bkContacts.coupon
  ui.say(couponOk.value ? 'Промокод принят — скидку подтвердит менеджер' : 'Такого промокода нет')
}

const errors = ref<string[]>([])
const done = ref<BkOrder | null>(null)
const submit = () => {
  const e: string[] = []
  if (!f.value.name.trim()) e.push('ваше имя')
  if (f.value.phone.replace(/\D/g, '').length < 10) e.push('ваш телефон')
  if (!pickup.value && f.value.toPhone.replace(/\D/g, '').length < 10) e.push('телефон получателя')
  if (!pickup.value && !f.value.noAddress && !f.value.address.trim()) e.push('адрес доставки')
  if (f.value.day === 'date' && !f.value.date) e.push('дату доставки')
  if (!f.value.agree) e.push('согласие с условиями возврата')
  errors.value = e
  if (e.length) return
  done.value = shop.placeOrder(whenText.value)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const suggest = computed(() => bkProducts.filter((p) => ['igrushki', 'shariki', 'sladosti-konfety'].includes(p.sec) && !bkHasChoice(p)).slice(0, 4))
</script>

<template>
  <div class="bk-wrap bk-cart">
    <nav class="bk-crumbs">
      <NuxtLink :to="bkPath()">Главная</NuxtLink>
      <span>Корзина</span>
    </nav>

    <div v-if="done" class="bk-cart__done">
      <span class="bk-cart__doneicon"><BkIcon name="check" :size="34" /></span>
      <h1>Заказ № {{ done.id }} принят</h1>
      <p>{{ done.when }}. Сумма {{ bkRub(done.total) }}. Пришлём СМС и письмо о статусе заказа{{ f.photo ? ', а после вручения пришлём фото получателя с букетом' : '' }}.</p>
      <p class="bk-cart__demo"><span class="bk-demo">демо</span> Это концепт: заказ сохранён только в вашем браузере, в магазин он не ушёл.</p>
      <div>
        <NuxtLink :to="bkPath('/account')" class="bk-btn bk-btn--accent">Мои заказы</NuxtLink>
        <NuxtLink :to="bkPath('/catalog')" class="bk-btn bk-btn--line">В каталог</NuxtLink>
      </div>
    </div>

    <div v-else-if="!shop.lines.value.length" class="bk-cart__empty">
      <BkIcon name="bag" :size="44" />
      <h1>Корзина пуста</h1>
      <p>Выберите букет в каталоге или подберите по поводу и бюджету на главной.</p>
      <div>
        <NuxtLink :to="bkPath('/catalog')" class="bk-btn bk-btn--accent">Перейти в каталог</NuxtLink>
        <NuxtLink :to="bkPath()" class="bk-btn bk-btn--line">Подобрать букет</NuxtLink>
      </div>
    </div>

    <template v-else>
      <h1 class="bk-cart__title">Оформление заказа</h1>
      <div class="bk-cart__layout">
        <form class="bk-cart__form" novalidate @submit.prevent="submit">
          <section class="bk-cart__block">
            <h2>Ваш заказ</h2>
            <ul class="bk-lines">
              <li v-for="l in shop.lines.value" :key="l.key">
                <NuxtLink :to="bkPath(`/product/${l.product.id}`)" class="bk-lines__img">
                  <img :src="l.product.img" alt="" width="80" height="100" loading="lazy" />
                </NuxtLink>
                <div class="bk-lines__info">
                  <NuxtLink :to="bkPath(`/product/${l.product.id}`)"><b>{{ l.product.title }}</b></NuxtLink>
                  <small>{{ l.pick ? `${l.product.opt?.title}: ${l.pick}` : l.product.comp }}</small>
                  <small>{{ bkRub(l.unitPrice) }} за шт</small>
                </div>
                <div class="bk-qty is-on bk-lines__qty">
                  <button type="button" class="bk-qty__btn" aria-label="Меньше" @click="shop.setQty(l.key, l.qty - 1)"><BkIcon name="minus" :size="18" /></button>
                  <span class="bk-qty__val"><b>{{ l.qty }}</b> шт</span>
                  <button type="button" class="bk-qty__btn" aria-label="Больше" @click="shop.setQty(l.key, l.qty + 1)"><BkIcon name="plus" :size="18" /></button>
                </div>
                <b class="bk-lines__sum">{{ bkRub(l.sum) }}</b>
                <button type="button" class="bk-hbtn bk-lines__del" aria-label="Удалить" @click="shop.setQty(l.key, 0)"><BkIcon name="trash" :size="20" /></button>
              </li>
            </ul>
          </section>

          <section v-if="suggest.length" class="bk-cart__block bk-cart__suggest">
            <h2>Добавить к букету</h2>
            <div class="bk-grid">
              <BkCard v-for="p in suggest" :key="p.id" :product="p" />
            </div>
          </section>

          <section class="bk-cart__block">
            <h2>Доставка</h2>
            <div class="bk-zones">
              <label v-for="z in bkZones" :key="z.id" class="bk-zone" :class="{ 'is-on': f.zone === z.id }">
                <input v-model="f.zone" type="radio" name="zone" :value="z.id" />
                <span>
                  <b>{{ z.title }}</b>
                  <small>{{ z.text }}</small>
                </span>
                <em>{{ z.price === null ? 'по тел.' : z.price ? bkRub(z.price) : '0 ₽' }}</em>
              </label>
            </div>

            <h3>Когда</h3>
            <div class="bk-seg">
              <button type="button" :class="{ 'is-on': f.day === 'today' }" @click="f.day = 'today'">Сегодня</button>
              <button type="button" :class="{ 'is-on': f.day === 'tomorrow' }" @click="f.day = 'tomorrow'">
                Завтра<small v-if="tomorrow">{{ bkDay(tomorrow) }}</small>
              </button>
              <button type="button" :class="{ 'is-on': f.day === 'date' }" @click="f.day = 'date'">Другая дата</button>
            </div>
            <label v-if="f.day === 'date'" class="bk-field bk-cart__date">
              <span>Дата</span>
              <input v-model="f.date" type="date" :min="minDate" />
            </label>
            <div class="bk-seg bk-cart__slots">
              <button v-if="f.day === 'today'" type="button" :class="{ 'is-on': f.slot === 'asap' }" @click="f.slot = 'asap'">
                Как можно скорее<small>{{ eta ? `к ${eta}` : 'за час' }}</small>
              </button>
              <button v-for="s in slots" :key="s.id" type="button" :disabled="slotOff(s.from)" :class="{ 'is-on': f.slot === s.id }" @click="f.slot = s.id">{{ s.title }}</button>
            </div>

            <template v-if="!pickup">
              <label class="bk-check">
                <input v-model="f.noAddress" type="checkbox" />
                <span>Не знаю адрес<small>Курьер позвонит получателю и договорится о месте и времени</small></span>
              </label>
              <label v-if="!f.noAddress" class="bk-field">
                <span>Адрес</span>
                <input v-model="f.address" type="text" placeholder="Улица, дом, квартира, подъезд" autocomplete="street-address" />
              </label>
            </template>
          </section>

          <section v-if="!pickup" class="bk-cart__block">
            <h2>Получатель</h2>
            <div class="bk-cart__row">
              <label class="bk-field"><span>Имя получателя</span><input v-model="f.toName" type="text" /></label>
              <label class="bk-field"><span>Телефон получателя</span><input v-model="f.toPhone" type="tel" placeholder="+7" /></label>
            </div>
            <label class="bk-check"><input v-model="f.askRecipient" type="checkbox" /><span>Уточнить время доставки у получателя</span></label>
            <label class="bk-check"><input v-model="f.anonymous" type="checkbox" /><span>Анонимно<small>Курьер не назовёт отправителя</small></span></label>
            <label class="bk-check"><input v-model="f.photo" type="checkbox" /><span>Фото получателя с букетом<small>Пришлём в WhatsApp, Telegram или на почту</small></span></label>
          </section>

          <section class="bk-cart__block">
            <h2>Открытка</h2>
            <div class="bk-cart__card">
              <label class="bk-field">
                <span>Текст — бесплатно</span>
                <textarea v-model="f.card" rows="3" maxlength="200" placeholder="Оставьте пустым, если открытка не нужна" />
                <small>{{ f.card.length }} / 200</small>
              </label>
              <div class="bk-cart__cardprev" aria-hidden="true">
                <BkIcon name="rose" :size="22" />
                <p>{{ f.card || 'Ваш текст' }}</p>
                <small>{{ f.anonymous ? 'без подписи' : f.name || 'ваше имя' }}</small>
              </div>
            </div>
          </section>

          <section class="bk-cart__block">
            <h2>Ваши контакты</h2>
            <div class="bk-cart__row">
              <label class="bk-field"><span>Ваше имя</span><input v-model="f.name" type="text" autocomplete="name" /></label>
              <label class="bk-field"><span>Телефон</span><input v-model="f.phone" type="tel" placeholder="+7" autocomplete="tel" /></label>
              <label class="bk-field"><span>E-mail</span><input v-model="f.email" type="email" autocomplete="email" /></label>
              <label class="bk-field">
                <span>Ник в Telegram</span>
                <input v-model="f.telegram" type="text" placeholder="@username" />
                <small>Вышлем фото заказа</small>
              </label>
            </div>
          </section>

          <section class="bk-cart__block">
            <h2>Оплата</h2>
            <div class="bk-zones">
              <label v-for="pay in bkPayments" :key="pay.id" class="bk-zone" :class="{ 'is-on': f.payment === pay.id }">
                <input v-model="f.payment" type="radio" name="payment" :value="pay.id" />
                <span>
                  <b>{{ pay.title }}</b>
                  <small>{{ pay.text }}</small>
                </span>
              </label>
            </div>
            <div class="bk-cart__coupon">
              <label class="bk-field">
                <span>Промокод</span>
                <input v-model="f.coupon" type="text" placeholder="Если есть" @input="couponOk = false" />
              </label>
              <button type="button" class="bk-btn bk-btn--line" @click="applyCoupon">Применить</button>
            </div>
            <p v-if="couponOk" class="bk-cart__ok"><BkIcon name="check" :size="18" /> Промокод «{{ bkContacts.coupon }}» принят. В концепте скидка не считается</p>
            <label class="bk-field"><span>Комментарий</span><textarea v-model="f.comment" rows="2" placeholder="Например: позвонить за 15 минут" /></label>
            <label class="bk-check"><input v-model="f.replace" type="checkbox" /><span>Согласен на незначительные замены цветов<small>Если какого-то цветка нет, флорист заменит его похожим по цвету и цене</small></span></label>
            <label class="bk-check"><input v-model="f.agree" type="checkbox" /><span>Я прочитал, что срезанные цветы не подлежат обмену и возврату</span></label>
          </section>

          <div v-if="errors.length" class="bk-cart__errors" role="alert">Заполните: {{ errors.join(', ') }}</div>
          <button type="submit" class="bk-btn bk-btn--accent bk-btn--big bk-btn--wide bk-cart__submitm">Оформить заказ · {{ bkRub(grand) }}</button>
        </form>

        <aside class="bk-cart__sum">
          <h2>Итого</h2>
          <dl>
            <div><dt>Товары, {{ shop.count.value }} шт</dt><dd>{{ bkRub(shop.total.value) }}</dd></div>
            <div><dt>Доставка</dt><dd>{{ deliveryText }}</dd></div>
            <div><dt>Открытка, фото вручения</dt><dd>бесплатно</dd></div>
          </dl>
          <div class="bk-cart__grand"><span>К оплате</span><b>{{ bkRub(grand) }}</b></div>
          <p class="bk-cart__when"><BkIcon name="clock" :size="20" /> {{ whenText }}</p>
          <button type="button" class="bk-btn bk-btn--accent bk-btn--big bk-btn--wide" @click="submit">Оформить заказ</button>
          <p class="bk-cart__note">Концепт: заказ никуда не отправляется.</p>
        </aside>
      </div>

    </template>
  </div>
</template>

<style lang="scss">
.bk-cart {
  &__title {
    margin-top: 16px;
    font-size: clamp(30px, 3vw, 44px);
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 32px;
    margin-top: 24px;
    align-items: start;
  }

  &__form {
    display: grid;
    gap: 16px;
  }

  &__block {
    display: grid;
    gap: 16px;
    padding: 28px;
    border-radius: var(--bk-r-panel);
    border: 1px solid var(--bk-line);

    h2 {
      font-size: 24px;
    }

    h3 {
      margin-top: 4px;
      font-size: 17px;
    }
  }

  &__row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  &__date {
    max-width: 260px;
  }

  &__slots button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &__card {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px;
    gap: 16px;
    align-items: start;
  }

  &__cardprev {
    display: grid;
    justify-items: center;
    gap: 8px;
    min-height: 150px;
    padding: 18px;
    border-radius: 16px;
    background: var(--bk-rose-soft);
    text-align: center;
    overflow-wrap: anywhere;

    svg {
      color: var(--bk-rose);
    }

    p {
      font-weight: 600;
      line-height: 1.35;
    }

    small {
      align-self: end;
      color: var(--bk-muted);
      font-size: 13px;
    }
  }

  &__coupon {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    align-items: end;

    .bk-btn {
      min-height: 50px;
    }
  }

  &__ok {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: -6px !important;
    color: var(--bk-accent);
    font-weight: 700;
    font-size: 15px;
  }

  &__errors {
    padding: 14px 18px;
    border-radius: 14px;
    background: var(--bk-rose-soft);
    color: var(--bk-rose);
    font-weight: 700;
  }

  &__submitm {
    display: none;
  }

  &__suggest .bk-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px 12px;
  }

  &__sum {
    position: sticky;
    top: 150px;
    display: grid;
    gap: 16px;
    padding: 24px;
    border-radius: var(--bk-r-panel);
    background: var(--bk-surface);

    h2 {
      font-size: 24px;
    }

    dl {
      display: grid;
      gap: 10px;
      margin: 0;

      div {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      dt {
        color: var(--bk-muted);
      }

      dd {
        margin: 0;
        font-weight: 700;
        white-space: nowrap;
      }
    }
  }

  &__grand {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding-top: 14px;
    border-top: 1px solid var(--bk-line-strong);

    span {
      font-weight: 700;
    }

    b {
      font-size: 30px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }
  }

  &__when {
    display: flex;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 12px;
    background: #fff;
    font-weight: 600;
    line-height: 1.35;

    svg {
      flex: none;
      color: var(--bk-accent);
    }
  }

  &__note {
    color: var(--bk-muted);
    font-size: 13px;
    text-align: center;
  }

  &__empty,
  &__done {
    display: grid;
    justify-items: center;
    gap: 14px;
    max-width: 620px;
    margin: 40px auto 0;
    padding: 48px 28px;
    border-radius: var(--bk-r-panel);
    background: var(--bk-surface);
    text-align: center;

    > svg {
      color: var(--bk-accent);
    }

    h1 {
      font-size: clamp(28px, 3vw, 38px);
    }

    p {
      color: var(--bk-muted);
    }

    div {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-top: 8px;
    }
  }

  &__doneicon {
    display: grid;
    place-items: center;
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background: var(--bk-accent);
    color: #fff;
  }

  &__demo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
}

ul.bk-lines {
  display: grid;

  li {
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr) 150px 100px 44px;
    align-items: center;
    gap: 16px;
    padding: 14px 0;
    border-top: 1px solid var(--bk-line);

    &:first-child {
      border-top: 0;
      padding-top: 0;
    }
  }
}

.bk-lines {
  &__img img {
    width: 64px;
    height: 80px;
    object-fit: cover;
    border-radius: 12px;
  }

  &__info {
    display: grid;
    gap: 2px;
    min-width: 0;

    b {
      font-weight: 700;
      line-height: 1.3;
    }

    small {
      color: var(--bk-muted);
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__sum {
    font-size: 18px;
    font-weight: 800;
    text-align: right;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  &__del {
    color: var(--bk-muted);

    &:hover {
      color: var(--bk-rose);
    }
  }
}

.bk-zones {
  display: grid;
  gap: 8px;
}

.bk-zone {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--bk-line-strong);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;

  input {
    flex: none;
    width: 20px;
    height: 20px;
    margin: 1px 0 0;
    accent-color: var(--bk-accent);
  }

  span {
    flex: 1;
    display: grid;
    min-width: 0;
    line-height: 1.35;
  }

  b {
    font-weight: 800;
  }

  small {
    color: var(--bk-muted);
    font-size: 14px;
  }

  em {
    flex: none;
    font-style: normal;
    font-weight: 800;
    white-space: nowrap;
  }

  &.is-on {
    border-color: var(--bk-accent);
    background: var(--bk-accent-soft);
    box-shadow: inset 0 0 0 1px var(--bk-accent);
  }
}

@media (max-width: 1199px) {
  .bk-cart__layout {
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 24px;
  }

  ul.bk-lines li {
    grid-template-columns: 64px minmax(0, 1fr) 132px 44px;
    grid-template-areas: 'img info info del' 'img qty sum sum';
    row-gap: 8px;
  }

  .bk-lines {
    &__img {
      grid-area: img;
      align-self: start;
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
}

@media (max-width: 989px) {
  .bk-cart {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }

    &__sum {
      position: static;
      order: -1;

      > .bk-btn,
      .bk-cart__note {
        display: none;
      }
    }

    &__submitm {
      display: inline-flex;
    }
  }
}

@media (max-width: 768px) {
  .bk-cart {
    &__block {
      padding: 20px 16px;
      border-radius: 22px;

      h2 {
        font-size: 21px;
      }
    }

    &__row,
    &__card {
      grid-template-columns: minmax(0, 1fr);
    }

    &__cardprev {
      min-height: 0;
    }

    &__suggest .bk-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &__sum {
      padding: 20px 16px;
      border-radius: 22px;
    }

    &__submitm {
      white-space: normal;
    }
  }

  .bk-zone {
    padding: 12px 14px;
  }
}

@media (max-width: 375px) {
  ul.bk-lines li {
    grid-template-columns: 52px minmax(0, 1fr) auto 40px;
    gap: 8px 10px;
  }

  .bk-lines {
    &__img img {
      width: 52px;
      height: 65px;
    }

    &__qty {
      width: 124px;

      .bk-qty__btn {
        width: 38px;
      }
    }

    &__sum {
      font-size: 16px;
    }
  }

  .bk-cart__coupon {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
