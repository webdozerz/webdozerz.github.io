<script lang="ts" setup>
import MrIcon from '~/components/redesign/mnerozy/MrIcon.vue'
import MrCard from '~/components/redesign/mnerozy/MrCard.vue'

useSeoMeta({ title: 'Корзина и оформление — Мне розы | Концепт редизайна' })

const shop = useMnerozyShop()
const ui = useMnerozyUi()
const { now } = useMnerozyClock()
const f = shop.form

// Интервалы по 2 часа круглые сутки; на сегодня прошедшие недоступны.
const slots = Array.from({ length: 12 }, (_, i) => {
  const a = String(i * 2).padStart(2, '0')
  const b = String(i * 2 + 2).padStart(2, '0')
  return { id: `${a}-${b}`, title: `${a}:00–${b === '24' ? '00' : b}:00`, end: i * 2 + 2 }
})
const slotOff = (end: number) => f.value.day === 'today' && Boolean(now.value) && end - 1 <= now.value!.getHours()
watch(
  () => [f.value.day, now.value?.getHours()],
  () => {
    const s = slots.find((x) => x.id === f.value.slot)
    if (s && slotOff(s.end)) f.value.slot = 'asap'
  },
)

const pickup = computed(() => Boolean(shop.zone.value.pickup))
const minDate = computed(() => (now.value ? now.value.toISOString().slice(0, 10) : ''))
const tomorrow = computed(() => (now.value ? mrDay(new Date(now.value.getTime() + 864e5)) : ''))

const couponNote = ref('')
const applyCoupon = () => {
  couponNote.value = f.value.coupon.trim() ? 'Демо: купон проверит сайт магазина при оформлении' : ''
}

const errors = computed(() => {
  const e: string[] = []
  if (!f.value.name.trim()) e.push('ваше имя')
  if (f.value.phone.replace(/\D/g, '').length < 10) e.push('ваш телефон')
  if (!f.value.selfRecipient && !pickup.value && !f.value.toName.trim()) e.push('имя получателя')
  if (!pickup.value && !f.value.askAddress && !f.value.address.trim()) e.push('адрес')
  if (f.value.day === 'date' && !f.value.date) e.push('дату')
  if (!f.value.agree) e.push('согласие с условиями')
  return e
})

const done = ref<MrOrder | null>(null)
const tried = ref(false)
const submit = () => {
  tried.value = true
  if (errors.value.length || !shop.count.value) return
  const day = f.value.day === 'today' ? 'сегодня' : f.value.day === 'tomorrow' ? `завтра, ${tomorrow.value}` : f.value.date.split('-').reverse().join('.')
  const time = f.value.slot === 'asap' ? 'как можно скорее' : (slots.find((s) => s.id === f.value.slot)?.title ?? '')
  done.value = shop.placeOrder(`${day}, ${time}`)
  ui.say('Заказ оформлен. Это демо — он никуда не отправлен')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const hits = ['21-roza-akciya', 'buket-lyogkost', 'korobochka-romantika', 'buket-iz-7-pionov']
  .map((id) => mrFind(id))
  .filter((x): x is MrProduct => Boolean(x))
</script>

<template>
  <div class="mr-wrap mr-cart">
    <nav class="mr-crumbs" aria-label="Навигация">
      <NuxtLink :to="mrPath()">Главная</NuxtLink>
      <span>Корзина</span>
    </nav>

    <div v-if="done" class="mr-cart__done">
      <span class="mr-cart__done-icon"><MrIcon name="check" :size="30" /></span>
      <h1>Заказ № {{ done.id }} оформлен</h1>
      <p>
        Доставка: {{ done.when }}. Сумма {{ mrRub(done.total) }}.
      </p>
      <p class="mr-cart__demo">Это концепт: заказ сохранён только в вашем браузере и никуда не отправлен.</p>
      <div class="mr-cart__done-actions">
        <NuxtLink :to="mrPath('/account')" class="mr-btn mr-btn--line">Мои заказы</NuxtLink>
        <NuxtLink :to="mrPath('/catalog')" class="mr-btn mr-btn--accent">В каталог</NuxtLink>
      </div>
    </div>

    <template v-else-if="!shop.count.value">
      <div class="mr-cart__empty">
        <h1>Корзина пустая</h1>
        <p>Выберите букет в каталоге или соберите охапку роз поштучно.</p>
        <div class="mr-cart__done-actions">
          <NuxtLink :to="mrPath('/catalog')" class="mr-btn mr-btn--accent">Каталог</NuxtLink>
          <NuxtLink :to="mrPath('/roses')" class="mr-btn mr-btn--line">Охапка роз поштучно</NuxtLink>
        </div>
      </div>
      <section class="mr-section">
        <div class="mr-head"><h2>Часто заказывают</h2></div>
        <div class="mr-grid">
          <MrCard v-for="p in hits" :key="p.id" :p="p" />
        </div>
      </section>
    </template>

    <template v-else>
      <h1 class="mr-cart__title">Корзина и оформление</h1>
      <div class="mr-cart__grid">
        <div class="mr-cart__main">
          <section class="mr-box">
            <div class="mr-box__head">
              <h2>{{ shop.count.value }} {{ mrPlural(shop.count.value, 'товар', 'товара', 'товаров') }}</h2>
              <button type="button" class="mr-cart__clear" @click="shop.clear()">Очистить</button>
            </div>
            <ul class="mr-lines">
              <li v-for="l in shop.lines.value" :key="l.key" class="mr-line">
                <NuxtLink :to="l.to" class="mr-line__img"><img :src="l.img" :alt="l.title" width="88" height="88" /></NuxtLink>
                <div class="mr-line__info">
                  <NuxtLink :to="l.to" class="mr-line__title">{{ l.title }}</NuxtLink>
                  <p v-if="l.pick">{{ l.pick }}</p>
                  <p class="mr-line__unit">{{ mrRub(l.unitPrice) }} за {{ l.stems ? 'охапку' : 'шт' }}</p>
                </div>
                <div class="mr-line__qty mr-qty mr-qty--big is-on">
                  <button type="button" class="mr-qty__btn" aria-label="Меньше" @click="shop.setQty(l.key, l.qty - 1)">
                    <MrIcon name="minus" :size="18" />
                  </button>
                  <span class="mr-qty__val"><b>{{ l.qty }}</b> шт</span>
                  <button type="button" class="mr-qty__btn" aria-label="Больше" @click="shop.setQty(l.key, l.qty + 1)">
                    <MrIcon name="plus" :size="18" />
                  </button>
                </div>
                <b class="mr-line__sum">{{ mrRub(l.sum) }}</b>
                <button type="button" class="mr-line__del" aria-label="Удалить" @click="shop.setQty(l.key, 0)">
                  <MrIcon name="trash" :size="20" />
                </button>
              </li>
            </ul>
          </section>

          <section class="mr-box">
            <h2>Кто заказывает</h2>
            <div class="mr-form2">
              <label class="mr-field"><span>Ваше имя</span><input v-model="f.name" autocomplete="name" /></label>
              <label class="mr-field"><span>Телефон</span><input v-model="f.phone" type="tel" autocomplete="tel" placeholder="+7" /></label>
              <label class="mr-field mr-form2__wide"><span>E-mail для чека</span><input v-model="f.email" type="email" autocomplete="email" /></label>
            </div>
          </section>

          <section class="mr-box">
            <h2>Доставка</h2>
            <div class="mr-zones" role="radiogroup" aria-label="Способ доставки">
              <label v-for="z in mrZones" :key="z.id" class="mr-zone" :class="{ 'is-on': f.zone === z.id }">
                <input v-model="f.zone" type="radio" name="zone" :value="z.id" />
                <span>
                  <b>{{ z.title }}</b>
                  <small>{{ z.text }}</small>
                </span>
                <strong :class="{ 'is-free': !z.price }">{{ z.price ? mrRub(z.price) : 'бесплатно' }}</strong>
              </label>
            </div>

            <template v-if="!pickup">
              <div class="mr-form2">
                <label class="mr-check mr-form2__wide">
                  <input v-model="f.selfRecipient" type="checkbox" />
                  <span>Получатель — я</span>
                </label>
                <template v-if="!f.selfRecipient">
                  <label class="mr-field"><span>Имя получателя</span><input v-model="f.toName" /></label>
                  <label class="mr-field"><span>Телефон получателя</span><input v-model="f.toPhone" type="tel" placeholder="+7" /></label>
                </template>
                <label class="mr-field mr-form2__wide">
                  <span>Адрес</span>
                  <input v-model="f.address" :disabled="f.askAddress" placeholder="Улица, дом, квартира, подъезд" autocomplete="street-address" />
                </label>
                <label v-if="!f.selfRecipient" class="mr-check mr-form2__wide">
                  <input v-model="f.askAddress" type="checkbox" />
                  <span>Не знаю адрес — уточните у получателя<small>Курьер позвонит получателю и договорится о времени</small></span>
                </label>
              </div>
            </template>

            <div class="mr-when">
              <p class="mr-when__label">{{ pickup ? 'Когда заберёте' : 'Когда привезти' }}</p>
              <div class="mr-seg">
                <button type="button" :class="{ 'is-on': f.day === 'today' }" @click="f.day = 'today'">Сегодня</button>
                <button type="button" :class="{ 'is-on': f.day === 'tomorrow' }" @click="f.day = 'tomorrow'">
                  Завтра<small v-if="tomorrow">{{ tomorrow }}</small>
                </button>
                <button type="button" :class="{ 'is-on': f.day === 'date' }" @click="f.day = 'date'">Другая дата</button>
              </div>
              <label v-if="f.day === 'date'" class="mr-field mr-when__date">
                <span>Дата</span>
                <input v-model="f.date" type="date" :min="minDate" />
              </label>
              <div class="mr-slots">
                <button type="button" class="mr-chip mr-slots__asap" :class="{ 'is-on': f.slot === 'asap' }" @click="f.slot = 'asap'">
                  {{ f.day === 'today' ? 'Как можно скорее — за час' : 'Любое время' }}
                </button>
                <button
                  v-for="s in slots"
                  :key="s.id"
                  type="button"
                  class="mr-chip"
                  :class="{ 'is-on': f.slot === s.id }"
                  :disabled="slotOff(s.end)"
                  @click="f.slot = s.id"
                >
                  {{ s.title }}
                </button>
              </div>
            </div>
          </section>

          <section class="mr-box">
            <h2>Открытка <span class="mr-box__free">бесплатно</span></h2>
            <label class="mr-field">
              <span>Текст открытки</span>
              <textarea v-model="f.card" maxlength="300" placeholder="С днём рождения, мама! Люблю тебя" />
            </label>
            <p class="mr-box__hint">{{ f.card.length }} / 300 · оставьте пустым, если открытка не нужна</p>
          </section>

          <section class="mr-box">
            <h2>Оплата</h2>
            <div class="mr-pays" role="radiogroup" aria-label="Способ оплаты">
              <label v-for="p in mrPayments" :key="p.id" class="mr-zone" :class="{ 'is-on': f.payment === p.id }">
                <input v-model="f.payment" type="radio" name="pay" :value="p.id" />
                <span>
                  <b>{{ p.title }}</b>
                  <small>{{ p.text }}</small>
                </span>
              </label>
            </div>
            <label class="mr-field">
              <span>Комментарий к заказу</span>
              <textarea v-model="f.comment" placeholder="Позвонить получателю заранее, не говорить, от кого букет…" />
            </label>
          </section>
        </div>

        <aside class="mr-sum">
          <div class="mr-sum__box">
            <h2>Ваш заказ</h2>
            <dl>
              <div>
                <dt>Товары, {{ shop.count.value }} шт</dt>
                <dd>{{ mrRub(shop.total.value) }}</dd>
              </div>
              <div>
                <dt>{{ pickup ? 'Самовывоз' : `Доставка: ${shop.zone.value.short}` }}</dt>
                <dd :class="{ 'is-free': !shop.delivery.value }">{{ shop.delivery.value ? mrRub(shop.delivery.value) : 'бесплатно' }}</dd>
              </div>
              <div>
                <dt>Открытка</dt>
                <dd class="is-free">бесплатно</dd>
              </div>
            </dl>
            <div class="mr-sum__coupon">
              <input v-model="f.coupon" placeholder="Купон на скидку" aria-label="Купон на скидку" @input="couponNote = ''" />
              <button type="button" @click="applyCoupon">Применить</button>
            </div>
            <p v-if="couponNote" class="mr-sum__note">{{ couponNote }}</p>
            <p class="mr-sum__total">
              <span>Итого</span>
              <b>{{ mrRub(shop.total.value + shop.delivery.value) }}</b>
            </p>
            <label class="mr-check">
              <input v-model="f.agree" type="checkbox" />
              <span>
                Согласен с <NuxtLink :to="mrPath('/delivery')">условиями доставки и оплаты</NuxtLink>. Цветы обмену и возврату не подлежат.
              </span>
            </label>
            <button type="button" class="mr-btn mr-btn--accent mr-sum__go" @click="submit">Оформить заказ</button>
            <p v-if="tried && errors.length" class="mr-sum__err">Заполните: {{ errors.join(', ') }}</p>
            <p class="mr-sum__note">Демо: заказ никуда не отправляется.</p>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.mr-cart {
  &__title {
    padding: 14px 0 22px;
    font-size: 34px;
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 24px;
    align-items: start;
  }

  &__main {
    display: grid;
    gap: 16px;
    min-width: 0;
  }

  &__clear {
    color: var(--mr-muted);
    font-size: 14px;
    font-weight: 600;

    &:hover {
      color: var(--mr-accent);
    }
  }

  &__done,
  &__empty {
    display: grid;
    justify-items: start;
    gap: 14px;
    max-width: 640px;
    padding: 32px 0 8px;

    h1 {
      font-size: 32px;
    }

    p {
      color: var(--mr-muted);
    }
  }

  &__done-icon {
    display: grid;
    place-items: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #e3f3ea;
    color: var(--mr-green);
  }

  &__demo {
    padding: 10px 14px;
    border-radius: var(--mr-r);
    background: var(--mr-surface);
    font-size: 14px;
  }

  &__done-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}

.mr-box {
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: var(--mr-r-panel);
  border: 1px solid var(--mr-line);

  h2 {
    font-size: 21px;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__free {
    margin-left: 6px;
    color: var(--mr-green);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0;
  }

  &__hint {
    margin-top: -8px;
    color: var(--mr-muted);
    font-size: 13px;
  }
}

.mr-lines {
  display: grid;
}

.mr-line {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr) auto 110px 40px;
  align-items: center;
  gap: 16px;
  padding: 14px 0;

  & + & {
    border-top: 1px solid var(--mr-line);
  }

  &__img img {
    width: 88px;
    height: 88px;
    border-radius: var(--mr-r);
    object-fit: cover;
  }

  &__info {
    display: grid;
    gap: 2px;
    min-width: 0;

    p {
      color: var(--mr-muted);
      font-size: 13px;
      line-height: 1.4;
    }
  }

  &__title {
    font-weight: 700;
    line-height: 1.3;

    &:hover {
      color: var(--mr-accent);
    }
  }

  &__unit {
    font-variant-numeric: tabular-nums;
  }

  &__qty.mr-qty {
    height: 44px;
    padding: 0;
    background: none;

    .mr-qty__btn {
      background: var(--mr-surface);
    }
  }

  &__sum {
    font-size: 17px;
    font-weight: 800;
    text-align: right;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  &__del {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--mr-r);
    color: var(--mr-muted);

    &:hover {
      color: var(--mr-accent);
      background: var(--mr-surface);
    }
  }
}

.mr-form2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  &__wide {
    grid-column: 1 / -1;
  }

  input:disabled {
    background: var(--mr-surface);
  }
}

.mr-zones,
.mr-pays {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.mr-zone {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: var(--mr-r-card);
  border: 1px solid var(--mr-line-strong);
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;

  input {
    flex: none;
    width: 18px;
    height: 18px;
    margin: 2px 0 0;
    accent-color: var(--mr-accent);
  }

  span {
    display: grid;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  b {
    font-weight: 700;
    line-height: 1.3;
  }

  small {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: var(--mr-muted);
    font-size: 13px;
    line-height: 1.4;
  }

  strong {
    flex: none;
    font-weight: 800;
    white-space: nowrap;

    &.is-free {
      color: var(--mr-green);
    }
  }

  &.is-on {
    border-color: var(--mr-accent);
    background: #fff7f9;
  }
}

.mr-when {
  display: grid;
  gap: 10px;

  &__label {
    font-size: 14px;
    font-weight: 700;
  }

  &__date {
    max-width: 260px;
  }
}

.mr-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  .mr-chip:disabled {
    opacity: 0.4;
    cursor: default;
    text-decoration: line-through;
  }
}

.mr-sum {
  position: sticky;
  top: 170px;
  min-width: 0;

  &__box {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    padding: 24px;
    border-radius: var(--mr-r-panel);
    background: var(--mr-surface);

    h2 {
      font-size: 21px;
    }
  }

  dl {
    display: grid;
    gap: 8px;
    margin: 0;

    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 14px;
    }

    dt {
      color: var(--mr-muted);
    }

    dd {
      margin: 0;
      font-weight: 700;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;

      &.is-free {
        color: var(--mr-green);
      }
    }
  }

  &__coupon {
    display: flex;
    gap: 6px;

    input {
      flex: 1;
      width: 0;
      min-width: 0;
      height: 44px;
      padding: 0 12px;
      border-radius: var(--mr-r);
      border: 1px solid var(--mr-line-strong);
      background: #fff;
      outline: none;

      &:focus {
        border-color: var(--mr-ink);
      }
    }

    button {
      flex: none;
      height: 44px;
      padding: 0 14px;
      border-radius: var(--mr-r);
      border: 1px solid var(--mr-line-strong);
      background: #fff;
      font-size: 14px;
      font-weight: 700;
    }
  }

  &__total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    padding-top: 14px;
    border-top: 1px solid var(--mr-line-strong);

    b {
      font-size: 28px;
      font-weight: 800;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
  }

  .mr-check a {
    color: var(--mr-accent);
    font-weight: 600;
  }

  &__go {
    width: 100%;
    height: 54px;
    font-size: 16px;
  }

  &__err {
    color: var(--mr-accent);
    font-size: 14px;
  }

  &__note {
    color: var(--mr-muted);
    font-size: 12px;
  }
}

@media (max-width: 1199px) {
  .mr-cart__grid {
    grid-template-columns: minmax(0, 1fr) 320px;
  }

  .mr-line {
    grid-template-columns: 72px minmax(0, 1fr) auto 40px;
    grid-template-areas:
      'img info info del'
      'img qty sum sum';
    row-gap: 10px;

    &__img {
      grid-area: img;
      align-self: start;

      img {
        width: 72px;
        height: 72px;
      }
    }

    &__info {
      grid-area: info;
    }

    &__qty {
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
  }

  .mr-zones,
  .mr-pays {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 989px) {
  .mr-cart__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .mr-sum {
    position: static;
  }
}

@media (max-width: 576px) {
  .mr-cart__title {
    font-size: 26px;
    padding-bottom: 16px;
  }

  .mr-box {
    padding: 16px;
    gap: 14px;

    h2 {
      font-size: 19px;
    }
  }

  .mr-sum__box {
    padding: 18px;
  }

  .mr-form2 {
    grid-template-columns: minmax(0, 1fr);
  }

  .mr-line {
    grid-template-columns: 60px minmax(0, 1fr) auto 36px;
    grid-template-areas:
      'img info info del'
      'qty qty sum sum';
    column-gap: 12px;

    &__img img {
      width: 60px;
      height: 60px;
    }

    &__sum {
      align-self: center;
    }
  }

  .mr-cart__done h1,
  .mr-cart__empty h1 {
    font-size: 26px;
  }
}
</style>
