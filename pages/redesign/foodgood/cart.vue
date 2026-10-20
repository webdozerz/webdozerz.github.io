<script lang="ts" setup>
useSeoMeta({ title: 'Корзина | FoodGood Tomsk' })

const cart = useFoodgoodCart()
const done = ref<string | null>(null)
const copied = ref(false)
const touched = ref(false)
const today = ref<{ today: boolean; text: string } | null>(null)
onMounted(() => (today.value = fgTodayLabel()))

const form = reactive({
  name: '',
  phone: '',
  email: '',
  delivery: 'tomsk' as FgDeliveryOption['id'],
  address: '',
  slot: fgTimeSlots[0]!,
  comment: '',
})

const option = computed(() => fgDelivery.find((d) => d.id === form.delivery)!)
const isPickup = computed(() => form.delivery === 'pickup')
const deliveryCost = computed(() => fgDeliveryPrice(option.value, cart.subtotal.value))
const total = computed(() => cart.subtotal.value + deliveryCost.value)
const toFree = computed(() => Math.max(0, FG_FREE_DELIVERY_FROM - cart.subtotal.value))
const progress = computed(() => Math.min(100, (cart.subtotal.value / FG_FREE_DELIVERY_FROM) * 100))
const hasWeighted = computed(() => cart.lines.value.some((l) => l.product.perKg))
const when = computed(() => (today.value && !today.value.today ? 'завтра' : 'сегодня'))

const errors = computed(() => ({
  name: form.name.trim() ? '' : 'Как к вам обращаться?',
  phone: form.phone.replace(/\D/g, '').length < 10 ? 'Нужен телефон, чтобы подтвердить заказ' : '',
  address: !isPickup.value && !form.address.trim() ? 'Укажите адрес доставки' : '',
}))
const valid = computed(() => Object.values(errors.value).every((e) => !e))

// Тот же заказ текстом — так его удобно переслать в Telegram или WhatsApp магазина.
const message = computed(() => {
  const lines = cart.lines.value.map(
    (l, i) => `${i + 1}. ${l.product.name}, ${l.product.pack} — ${l.qty} ${l.product.perKg ? 'кг' : 'шт'} × ${fgFormatPrice(l.product.price)}`,
  )
  const how = isPickup.value
    ? `Самовывоз, ${fgContacts.address}`
    : `${option.value.title}${form.address.trim() ? `: ${form.address.trim()}` : ''}, ${form.slot.toLowerCase()}`
  return [
    'Здравствуйте! Хочу оформить заказ:',
    ...lines,
    `Товары: ${fgFormatPrice(cart.subtotal.value)}`,
    `Доставка: ${deliveryCost.value ? fgFormatPrice(deliveryCost.value) : 'бесплатно'} — ${how}`,
    `Итого: ${fgFormatPrice(total.value)}`,
    form.name.trim() || form.phone.trim() ? `${form.name.trim()} ${form.phone.trim()}`.trim() : '',
    form.comment.trim() ? `Комментарий: ${form.comment.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n')
})

const copy = async () => {
  try {
    await navigator.clipboard.writeText(message.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    /* буфер обмена может быть недоступен */
  }
}

const submit = () => {
  touched.value = true
  if (!valid.value) return
  done.value = String(Math.floor(1000 + Math.random() * 9000))
  cart.clear()
  window.scrollTo({ top: 0 })
}
</script>

<template>
  <div class="fg-wrap">
    <div class="fg-page-head">
      <nav class="fg-crumbs" aria-label="Навигация">
        <NuxtLink :to="fgPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>Корзина</span>
      </nav>
      <h1>{{ done ? 'Заказ принят' : 'Корзина' }}</h1>
    </div>

    <div v-if="done" class="fg-panel result">
      <span class="result__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      </span>
      <h2>Заказ № {{ done }}</h2>
      <p>
        Это демо: в концепте заказ никуда не отправляется. На настоящем сайте магазин перезвонит,
        чтобы подтвердить состав и время доставки.
      </p>
      <NuxtLink :to="fgPath('/catalog')" class="fg-btn fg-btn--primary">Вернуться в каталог</NuxtLink>
    </div>

    <div v-else-if="!cart.count.value" class="fg-panel result">
      <h2>В корзине пока пусто</h2>
      <p>Загляните в «Сейчас в сезоне» или найдите товар через поиск.</p>
      <NuxtLink :to="fgPath('/catalog')" class="fg-btn fg-btn--primary">Перейти в каталог</NuxtLink>
    </div>

    <div v-else class="checkout">
      <div class="checkout__main">
        <section class="block">
          <div class="block__head">
            <h2>Товары · {{ cart.count.value }}</h2>
            <button type="button" class="block__clear" @click="cart.clear()">Очистить</button>
          </div>
          <ul class="lines">
            <li v-for="l in cart.lines.value" :key="l.product.id" class="line">
              <NuxtLink :to="fgPath(`/product/${l.product.id}`)" class="line__photo">
                <img :src="l.product.image" alt="" />
              </NuxtLink>
              <div class="line__info">
                <NuxtLink :to="fgPath(`/product/${l.product.id}`)" class="line__name">{{ l.product.name }}</NuxtLink>
                <span class="fg-muted">{{ l.product.pack }} · {{ fgFormatPrice(l.product.price) }}</span>
              </div>
              <div class="line__qty">
                <button type="button" :aria-label="`Меньше: ${l.product.name}`" @click="cart.remove(l.product.id)">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 12h12" /></svg>
                </button>
                <output>{{ l.qty }} {{ l.product.perKg ? 'кг' : 'шт' }}</output>
                <button type="button" :aria-label="`Больше: ${l.product.name}`" @click="cart.add(l.product.id)">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 6v12M6 12h12" /></svg>
                </button>
              </div>
              <strong class="line__sum fg-price">{{ fgFormatPrice(l.sum) }}</strong>
              <button
                type="button"
                class="line__del"
                :aria-label="`Удалить: ${l.product.name}`"
                @click="cart.setQty(l.product.id, 0)"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />
                </svg>
              </button>
            </li>
          </ul>
          <p v-if="hasWeighted" class="note">
            В заказе есть весовой товар: точную сумму назовём после взвешивания.
          </p>
        </section>

        <section class="block">
          <h2>Получение</h2>
          <div class="ways" role="radiogroup" aria-label="Способ получения">
            <label v-for="d in fgDelivery" :key="d.id" class="way" :class="{ 'is-on': form.delivery === d.id }">
              <input v-model="form.delivery" type="radio" name="delivery" :value="d.id" />
              <span class="way__top">
                <strong>{{ d.title }}</strong>
                <b class="fg-price">{{ fgDeliveryPrice(d, cart.subtotal.value) ? fgFormatPrice(fgDeliveryPrice(d, cart.subtotal.value)) : 'бесплатно' }}</b>
              </span>
              <small>{{ d.hint }}</small>
            </label>
          </div>

          <template v-if="!isPickup">
            <label class="fg-field" :class="{ 'is-error': touched && errors.address }">
              <span>Адрес</span>
              <input v-model="form.address" type="text" placeholder="Улица, дом, квартира, подъезд" autocomplete="street-address" />
              <small v-if="touched && errors.address">{{ errors.address }}</small>
            </label>
            <div class="slots" role="radiogroup" aria-label="Время доставки">
              <label v-for="s in fgTimeSlots" :key="s" class="slot" :class="{ 'is-on': form.slot === s }">
                <input v-model="form.slot" type="radio" name="slot" :value="s" />
                {{ s }}
              </label>
            </div>
            <p class="fg-muted small">
              Привезём {{ when }}: заказы на текущий день принимаем до 18:00 по томскому времени.
            </p>
          </template>
        </section>

        <section class="block">
          <h2>Контакты</h2>
          <div class="fields">
            <label class="fg-field" :class="{ 'is-error': touched && errors.name }">
              <span>Имя</span>
              <input v-model="form.name" type="text" autocomplete="name" />
              <small v-if="touched && errors.name">{{ errors.name }}</small>
            </label>
            <label class="fg-field" :class="{ 'is-error': touched && errors.phone }">
              <span>Телефон</span>
              <input v-model="form.phone" type="tel" placeholder="+7" autocomplete="tel" />
              <small v-if="touched && errors.phone">{{ errors.phone }}</small>
            </label>
            <label class="fg-field">
              <span>Email, по желанию</span>
              <input v-model="form.email" type="email" autocomplete="email" />
            </label>
            <label class="fg-field fields__wide">
              <span>Комментарий</span>
              <textarea v-model="form.comment" placeholder="Например: позвонить за час, клубнику помельче" />
            </label>
          </div>
        </section>
      </div>

      <aside class="checkout__side">
        <div class="summary">
          <div v-if="form.delivery === 'tomsk'" class="free">
            <p v-if="toFree">
              До бесплатной доставки <strong class="fg-price">{{ fgFormatPrice(toFree) }}</strong>
            </p>
            <p v-else><strong>Доставка по Томску бесплатно</strong></p>
            <div class="free__bar"><span :style="{ width: `${progress}%` }" /></div>
          </div>
          <dl class="summary__rows">
            <div>
              <dt>Товары</dt>
              <dd class="fg-price">{{ fgFormatPrice(cart.subtotal.value) }}</dd>
            </div>
            <div>
              <dt>{{ isPickup ? 'Самовывоз' : 'Доставка' }}</dt>
              <dd class="fg-price">{{ deliveryCost ? fgFormatPrice(deliveryCost) : 'бесплатно' }}</dd>
            </div>
            <div class="summary__total">
              <dt>Итого</dt>
              <dd class="fg-price">{{ fgFormatPrice(total) }}</dd>
            </div>
          </dl>
          <button type="button" class="fg-btn fg-btn--primary summary__go" @click="submit">Оформить заказ</button>
          <p v-if="touched && !valid" class="summary__err">Заполните имя, телефон{{ isPickup ? '' : ' и адрес' }}</p>
        </div>

        <div class="msg">
          <h2>Или отправьте сообщением</h2>
          <p class="fg-muted">
            Многие заказывают у нас в мессенджере. Мы собрали ваш заказ в текст — скопируйте и
            отправьте в Telegram или WhatsApp.
          </p>
          <pre class="msg__text">{{ message }}</pre>
          <div class="msg__actions">
            <button type="button" class="fg-btn fg-btn--soft" @click="copy">
              {{ copied ? 'Скопировано' : 'Скопировать текст' }}
            </button>
            <span class="msg__demo">В концепте сообщение не отправляется в магазин</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.result {
  display: grid;
  justify-items: start;
  gap: 12px;
  max-width: 640px;

  p {
    color: var(--fg-muted);
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--fg-leaf);
    color: #fff;
  }
}

.checkout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  gap: 24px;
  align-items: start;

  &__main {
    display: grid;
    gap: 16px;
  }

  &__side {
    display: grid;
    gap: 16px;
  }
}

.block {
  display: grid;
  gap: 16px;
  padding: clamp(18px, 3vw, 28px);
  border-radius: 22px;
  box-shadow: inset 0 0 0 1px var(--fg-line);

  h2 {
    font-size: 22px;
  }

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  &__clear {
    color: var(--fg-muted);
    font-size: 15px;

    &:hover {
      color: var(--fg-sale-d);
    }
  }
}

.lines {
  display: grid;
}

.line {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 132px 104px 36px;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid var(--fg-line);

  &:first-child {
    border-top: 0;
    padding-top: 0;
  }

  &__photo img {
    width: 72px;
    height: 72px;
    border-radius: 14px;
    object-fit: cover;
    background: var(--fg-sage);
  }

  &__info {
    display: grid;
    gap: 2px;
    min-width: 0;
    font-size: 15px;
  }

  &__name {
    font-size: 16px;
    line-height: 1.3;

    &:hover {
      color: var(--fg-leaf);
    }
  }

  &__qty {
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr) 40px;
    align-items: center;
    min-height: 42px;
    border-radius: 10px;
    background: var(--fg-sage);

    button {
      display: grid;
      place-items: center;
      height: 42px;
      border-radius: 10px;

      &:hover {
        color: var(--fg-leaf);
      }
    }

    output {
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
  }

  &__sum {
    font-size: 18px;
    font-weight: 600;
    text-align: right;
  }

  &__del {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    color: var(--fg-muted);

    &:hover {
      background: var(--fg-sale-soft);
      color: var(--fg-sale-d);
    }
  }
}

.note {
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--fg-sage);
  font-size: 15px;
}

.ways {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.way {
  display: grid;
  align-content: start;
  gap: 4px;
  padding: 14px 16px;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px var(--fg-line);
  cursor: pointer;
  transition: box-shadow 0.15s, background-color 0.15s;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &:hover {
    box-shadow: inset 0 0 0 1px var(--fg-leaf);
  }

  &.is-on {
    background: var(--fg-leaf-soft);
    box-shadow: inset 0 0 0 1.5px var(--fg-leaf);
  }

  &:has(input:focus-visible) {
    outline: 2px solid var(--fg-leaf);
    outline-offset: 2px;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    gap: 8px;

    strong {
      font-weight: 600;
    }

    b {
      font-weight: 600;
    }
  }

  small {
    color: var(--fg-muted);
    font-size: 13px;
    line-height: 1.4;
  }
}

.slots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.slot {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  background: var(--fg-sage);
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &.is-on {
    background: var(--fg-leaf);
    color: #fff;
  }

  &:has(input:focus-visible) {
    outline: 2px solid var(--fg-leaf);
    outline-offset: 2px;
  }
}

.small {
  font-size: 14px;
}

.fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  &__wide {
    grid-column: 1 / -1;
  }
}

.summary {
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: 22px;
  background: var(--fg-sage);

  &__rows {
    display: grid;
    gap: 8px;

    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }

    dt {
      color: var(--fg-muted);
    }
  }

  &__total {
    margin-top: 6px;
    padding-top: 12px;
    border-top: 1px solid var(--fg-sage-2);
    font-size: 22px;
    font-weight: 600;

    dt {
      color: var(--fg-ink) !important;
    }
  }

  &__go {
    width: 100%;
    min-height: 54px;
    font-size: 17px;
  }

  &__err {
    color: var(--fg-sale-d);
    font-size: 14px;
    text-align: center;
  }
}

.free {
  display: grid;
  gap: 8px;
  font-size: 15px;

  &__bar {
    height: 6px;
    overflow: hidden;
    border-radius: 3px;
    background: #fff;

    span {
      display: block;
      height: 100%;
      border-radius: 3px;
      background: var(--fg-leaf);
      transition: width 0.3s;
    }
  }
}

.msg {
  display: grid;
  gap: 12px;
  padding: 24px;
  border-radius: 22px;
  box-shadow: inset 0 0 0 1px var(--fg-line);

  h2 {
    font-size: 20px;
  }

  p {
    font-size: 15px;
  }

  &__text {
    max-height: 260px;
    margin: 0;
    overflow: auto;
    padding: 14px 16px;
    border-radius: 16px 16px 16px 4px;
    background: var(--fg-leaf-soft);
    font: inherit;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  &__actions {
    display: grid;
    gap: 8px;
  }

  &__demo {
    color: var(--fg-muted);
    font-size: 13px;
    text-align: center;
  }
}

@media (max-width: 1100px) {
  .checkout {
    grid-template-columns: minmax(0, 1fr) 340px;
  }

  .fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .line {
    grid-template-columns: 64px minmax(0, 1fr) 124px 36px;
    grid-template-areas:
      'photo info qty del'
      'photo info sum del';
    row-gap: 6px;

    &__photo {
      grid-area: photo;
    }

    &__photo img {
      width: 64px;
      height: 64px;
    }

    &__info {
      grid-area: info;
    }

    &__qty {
      grid-area: qty;
    }

    &__sum {
      grid-area: sum;
      font-size: 16px;
    }

    &__del {
      grid-area: del;
    }
  }
}

@media (max-width: 900px) {
  .checkout {
    grid-template-columns: 1fr;

  }
}

@media (max-width: 600px) {
  .ways,
  .fields {
    grid-template-columns: 1fr;
  }

  .line {
    grid-template-columns: 56px minmax(0, 1fr) auto;
    grid-template-areas:
      'photo info del'
      'qty qty sum';
    column-gap: 12px;
    row-gap: 10px;

    &__photo img {
      width: 56px;
      height: 56px;
      border-radius: 12px;
    }

    &__qty {
      width: 132px;
    }

    &__sum {
      align-self: center;
      font-size: 18px;
    }

    &__del {
      justify-self: end;
    }
  }
}
</style>
