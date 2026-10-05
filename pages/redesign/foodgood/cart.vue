<script lang="ts" setup>
import PageHead from '~/components/redesign/foodgood/PageHead.vue'

useSeoMeta({ title: 'Корзина | FoodGood Tomsk' })

const cart = useFoodgoodCart()
const steps = ['Корзина', 'Контакты', 'Подтверждение']
const step = ref(0)
const done = ref<string | null>(null)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  delivery: 'pickup' as (typeof fgDelivery)[number]['id'],
  slot: '',
})
const touched = ref(false)

const option = computed(() => fgDelivery.find((d) => d.id === form.delivery)!)
const needsSlot = computed(() => form.delivery !== 'pickup')
const freeDelivery = computed(
  () => form.delivery === 'tomsk' && cart.subtotal.value > FG_FREE_DELIVERY_FROM,
)
const deliveryCost = computed(() => (freeDelivery.value ? 0 : option.value.price))
const total = computed(() => cart.subtotal.value + deliveryCost.value)
const toFree = computed(() => Math.max(0, FG_FREE_DELIVERY_FROM + 1 - cart.subtotal.value))

const errors = computed(() => ({
  email: !/^\S+@\S+\.\S+$/.test(form.email) ? 'Укажите корректный email' : '',
  phone: form.phone.replace(/\D/g, '').length < 10 ? 'Укажите номер телефона' : '',
  slot: needsSlot.value && !form.slot ? 'Выберите время доставки' : '',
}))
const valid = computed(() => !errors.value.email && !errors.value.phone && !errors.value.slot)

const next = () => {
  if (step.value === 1) {
    touched.value = true
    if (!valid.value) return
  }
  step.value = Math.min(step.value + 1, 2)
}

const confirm = () => {
  done.value = String(Math.floor(1000 + Math.random() * 9000))
  cart.clear()
}
</script>

<template>
  <div>
    <PageHead title="Оформление заказа" crumb="Корзина" />

    <div class="fg-container">
      <!-- Готово -->
      <div v-if="done" class="done">
        <div class="done__mark">✓</div>
        <h2>Заказ №{{ done }} оформлен (демо)</h2>
        <p>
          Это концепт редизайна, поэтому заказ никуда не отправлен. В настоящем магазине здесь
          был бы номер заказа и подтверждение в мессенджере.
        </p>
        <NuxtLink :to="fgPath('/catalog')" class="btn btn--primary">Вернуться в каталог</NuxtLink>
      </div>

      <!-- Пусто -->
      <div v-else-if="!cart.lines.value.length" class="done">
        <div class="done__mark done__mark--muted">🛒</div>
        <h2>В корзине пока пусто</h2>
        <p>Загляните в каталог: ягоды, фермерское мясо, рыба и подарочные сертификаты.</p>
        <NuxtLink :to="fgPath('/catalog')" class="btn btn--primary">Перейти в каталог</NuxtLink>
      </div>

      <div v-else class="checkout">
        <div class="checkout__main">
          <ol class="steps">
            <li v-for="(s, i) in steps" :key="s" :class="{ 'is-active': i === step, 'is-done': i < step }">
              <span>{{ i + 1 }}</span>
              {{ s }}
            </li>
          </ol>

          <!-- 1. Корзина -->
          <div v-if="step === 0" class="lines">
            <article v-for="l in cart.lines.value" :key="l.product.id" class="line">
              <NuxtLink :to="fgPath(`/product/${l.product.id}`)" class="line__img">
                <img :src="l.product.image" :alt="l.product.name" />
              </NuxtLink>
              <div class="line__info">
                <NuxtLink :to="fgPath(`/product/${l.product.id}`)" class="line__name">
                  {{ l.product.name }}
                </NuxtLink>
                <span class="line__unit">
                  {{ fgFormatPrice(l.product.price) }}
                  <template v-if="l.product.priceNote">, {{ l.product.priceNote }}</template>
                </span>
              </div>
              <div class="line__qty" role="group" aria-label="Количество">
                <button type="button" aria-label="Меньше" @click="cart.remove(l.product.id)">−</button>
                <span>{{ l.qty }}</span>
                <button type="button" aria-label="Больше" @click="cart.add(l.product.id)">+</button>
              </div>
              <div class="line__sum">{{ fgFormatPrice(l.sum) }}</div>
              <button
                type="button"
                class="line__del"
                aria-label="Удалить"
                @click="cart.setQty(l.product.id, 0)"
              >
                ×
              </button>
            </article>
          </div>

          <!-- 2. Контакты -->
          <form v-else-if="step === 1" class="form" novalidate @submit.prevent="next">
            <label class="field">
              <span>Имя</span>
              <input v-model="form.name" type="text" autocomplete="name" />
            </label>

            <div class="form__row">
              <label class="field" :class="{ 'has-error': touched && errors.email }">
                <span>Email *</span>
                <input v-model="form.email" type="email" autocomplete="email" />
                <small v-if="touched && errors.email">{{ errors.email }}</small>
              </label>
              <label class="field" :class="{ 'has-error': touched && errors.phone }">
                <span>Телефон *</span>
                <input v-model="form.phone" type="tel" autocomplete="tel" placeholder="+7 900 000-00-00" />
                <small v-if="touched && errors.phone">{{ errors.phone }}</small>
              </label>
            </div>

            <div class="field-group" role="radiogroup" aria-labelledby="fg-delivery-label">
              <div id="fg-delivery-label" class="field-group__label">Способ получения *</div>
              <div class="options options--delivery">
              <label
                v-for="d in fgDelivery"
                :key="d.id"
                class="choice"
                :class="{ 'is-checked': form.delivery === d.id }"
              >
                <input v-model="form.delivery" type="radio" name="delivery" :value="d.id" />
                <span class="choice__body">
                  <strong>{{ d.title }}</strong>
                  <small>{{ d.hint }}</small>
                </span>
                <span class="choice__price">
                  <template v-if="d.id === 'tomsk' && cart.subtotal.value > FG_FREE_DELIVERY_FROM">
                    Бесплатно
                  </template>
                  <template v-else>{{ d.price ? fgFormatPrice(d.price) : '0 ₽' }}</template>
                </span>
              </label>
              </div>
            </div>

            <div
              v-if="needsSlot"
              class="field-group"
              role="radiogroup"
              aria-labelledby="fg-slot-label"
              :class="{ 'has-error': touched && errors.slot }"
            >
              <div id="fg-slot-label" class="field-group__label">Время доставки *</div>
              <div class="options options--slots">
              <label
                v-for="s in fgTimeSlots"
                :key="s"
                class="choice"
                :class="{ 'is-checked': form.slot === s }"
              >
                <input v-model="form.slot" type="radio" name="slot" :value="s" />
                <span class="choice__body">
                  <strong>{{ s }}</strong>
                </span>
              </label>
              </div>
              <small v-if="touched && errors.slot" class="error">{{ errors.slot }}</small>
            </div>

            <p class="form__legal">
              Нажимая «Далее», вы соглашаетесь на обработку персональных данных. В демо-версии
              данные никуда не передаются.
            </p>
          </form>

          <!-- 3. Подтверждение -->
          <div v-else class="confirm">
            <section>
              <h3>Контакты</h3>
              <p>{{ form.name || 'Имя не указано' }}</p>
              <p>{{ form.phone }} · {{ form.email }}</p>
            </section>
            <section>
              <h3>Получение</h3>
              <p>{{ option.title }}</p>
              <p v-if="needsSlot">{{ form.slot }}</p>
              <p class="muted">{{ option.hint }}</p>
            </section>
            <section>
              <h3>Состав заказа</h3>
              <ul>
                <li v-for="l in cart.lines.value" :key="l.product.id">
                  <span>{{ l.product.name }} × {{ l.qty }}</span>
                  <strong>{{ fgFormatPrice(l.sum) }}</strong>
                </li>
              </ul>
            </section>
          </div>
        </div>

        <!-- Итоги -->
        <aside class="summary">
          <h2>Ваш заказ</h2>
          <dl>
            <div>
              <dt>Товары</dt>
              <dd>{{ fgFormatPrice(cart.subtotal.value) }}</dd>
            </div>
            <div v-if="step > 0">
              <dt>Доставка</dt>
              <dd>{{ deliveryCost ? fgFormatPrice(deliveryCost) : 'Бесплатно' }}</dd>
            </div>
            <div class="summary__total">
              <dt>Итого</dt>
              <dd>{{ fgFormatPrice(step > 0 ? total : cart.subtotal.value) }}</dd>
            </div>
          </dl>

          <p v-if="toFree > 0" class="summary__hint">
            Добавьте товаров ещё на {{ fgFormatPrice(toFree) }}, и доставка по Томску будет
            бесплатной.
          </p>
          <p v-else class="summary__hint summary__hint--ok">Доставка по Томску бесплатная.</p>

          <button v-if="step < 2" type="button" class="btn btn--primary" @click="next">
            {{ step === 0 ? 'Оформить заказ' : 'Далее' }}
          </button>
          <button v-else type="button" class="btn btn--primary" @click="confirm">
            Подтвердить заказ (демо)
          </button>
          <button v-if="step > 0" type="button" class="btn btn--text" @click="step--">Назад</button>
          <NuxtLink v-else :to="fgPath('/catalog')" class="btn btn--text">Вернуться в каталог</NuxtLink>
        </aside>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 28px;
  border: 0;
  border-radius: 999px;
  font-weight: 700;
  font-size: 16px;
  transition: background 0.15s, transform 0.15s;

  &--primary {
    background: var(--fg-leaf);
    color: #fff;

    &:hover {
      background: #4a8b2d;
    }
  }

  &--text {
    height: 40px;
    background: transparent;
    color: var(--fg-muted);

    &:hover {
      color: var(--fg-forest);
    }
  }
}

.checkout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
}

// ---------- шаги ----------
.steps {
  display: flex;
  gap: 8px;
  margin: 0 0 24px;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    padding: 10px 14px;
    border-radius: 999px;
    background: var(--fg-paper);
    border: 1px solid var(--fg-line);
    font-size: 14px;
    font-weight: 700;
    color: var(--fg-muted);

    span {
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--fg-line);
      font-size: 12px;
    }

    &.is-active {
      background: var(--fg-forest);
      border-color: var(--fg-forest);
      color: #fff;

      span {
        background: var(--fg-leaf);
        color: #fff;
      }
    }

    &.is-done {
      color: var(--fg-forest);

      span {
        background: var(--fg-leaf-soft);
        color: var(--fg-forest);
      }
    }
  }
}

// ---------- позиции ----------
.lines {
  display: grid;
  gap: 12px;
}

.line {
  display: grid;
  grid-template-columns: 76px 1fr auto 110px 32px;
  align-items: center;
  gap: 16px;
  padding: 12px 16px 12px 12px;
  border-radius: var(--fg-radius);
  background: var(--fg-paper);
  border: 1px solid var(--fg-line);

  &__img img {
    width: 76px;
    height: 76px;
    object-fit: cover;
    border-radius: 12px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__name {
    font-weight: 700;
    font-size: 15px;
    line-height: 1.35;

    &:hover {
      color: var(--fg-leaf);
    }
  }

  &__unit {
    font-size: 13px;
    color: var(--fg-muted);
  }

  &__qty {
    display: grid;
    grid-template-columns: 36px 36px 36px;
    align-items: center;
    height: 38px;
    border-radius: 999px;
    background: var(--fg-leaf-soft);
    overflow: hidden;
    text-align: center;
    font-weight: 700;

    button {
      height: 100%;
      border: 0;
      background: transparent;
      font-size: 18px;
      color: var(--fg-forest);

      &:hover {
        background: #d3e6bf;
      }
    }
  }

  &__sum {
    text-align: right;
    font-weight: 800;
    color: var(--fg-forest);
  }

  &__del {
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    font-size: 22px;
    color: var(--fg-muted);

    &:hover {
      background: var(--fg-berry-soft);
      color: var(--fg-berry);
    }
  }
}

// ---------- форма ----------
.form {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
  gap: 20px;
  padding: 28px;
  border-radius: 28px;
  background: var(--fg-paper);
  border: 1px solid var(--fg-line);

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  &__legal {
    font-size: 12px;
    color: var(--fg-muted);
  }
}

.field {
  display: grid;
  gap: 6px;

  span {
    font-size: 13px;
    font-weight: 700;
    color: var(--fg-muted);
  }

  input {
    height: 48px;
    padding: 0 16px;
    border-radius: 12px;
    border: 1.5px solid var(--fg-line);
    background: #fff;
    font: inherit;
    color: var(--fg-ink);

    &:focus {
      outline: 0;
      border-color: var(--fg-leaf);
    }
  }

  small {
    font-size: 12px;
    color: var(--fg-berry);
  }

  &.has-error input {
    border-color: var(--fg-berry);
  }
}

.field-group {
  display: grid;
  gap: 8px;

  &__label {
    font-size: 13px;
    font-weight: 700;
    color: var(--fg-muted);
  }

  .options {
    display: grid;
    gap: 10px;
    align-items: start;

    &--delivery,
    &--slots {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .error {
    font-size: 12px;
    color: var(--fg-berry);
  }
}

.choice {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1.5px solid var(--fg-line);
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  input {
    accent-color: var(--fg-leaf);
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &.is-checked {
    border-color: var(--fg-leaf);
    background: var(--fg-leaf-soft);
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;

    small {
      font-size: 12px;
      color: var(--fg-muted);
    }
  }

  &__price {
    font-weight: 800;
    white-space: nowrap;
    color: var(--fg-forest);
  }
}

// ---------- подтверждение ----------
.confirm {
  display: grid;
  gap: 24px;
  padding: 28px;
  border-radius: 28px;
  background: var(--fg-paper);
  border: 1px solid var(--fg-line);

  h3 {
    margin-bottom: 8px;
    font-size: 20px;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 0;
    border-bottom: 1px solid var(--fg-line);
    font-size: 15px;
  }

  .muted {
    font-size: 13px;
    color: var(--fg-muted);
  }
}

// ---------- итоги ----------
.summary {
  position: sticky;
  top: 92px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 28px;
  border-radius: 28px;
  background: var(--fg-forest);
  color: #cfe0c2;

  h2 {
    font-size: 26px;
    color: #fff;
  }

  dl {
    display: grid;
    gap: 10px;
    margin: 0;

    > div {
      display: flex;
      justify-content: space-between;
    }
    dd {
      margin: 0;
      font-weight: 700;
      color: #fff;
    }
  }

  &__total {
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.16);
    font-size: 20px;

    dd {
      font-size: 24px;
      font-weight: 800;
    }
  }

  &__hint {
    font-size: 13px;
    color: #a9c39c;

    &--ok {
      color: var(--fg-honey);
      font-weight: 700;
    }
  }

  .btn--text {
    color: #a9c39c;

    &:hover {
      color: #fff;
    }
  }
}

// ---------- финал / пусто ----------
.done {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  max-width: 520px;
  margin: 24px auto 0;
  padding: 48px 24px;
  text-align: center;

  &__mark {
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--fg-leaf);
    color: #fff;
    font-size: 36px;

    &--muted {
      background: var(--fg-leaf-soft);
      font-size: 32px;
    }
  }

  h2 {
    font-size: 30px;
  }

  p {
    margin-bottom: 8px;
    color: var(--fg-muted);
  }
}

@media (max-width: 960px) {
  .checkout {
    grid-template-columns: 1fr;
  }
  .summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .steps li {
    justify-content: center;
    font-size: 0;
    gap: 0;

    span {
      font-size: 12px;
    }
  }

  .line {
    grid-template-columns: 64px 1fr 32px;
    grid-template-areas:
      'img info del'
      'img qty sum';
    row-gap: 8px;

    &__img {
      grid-area: img;

      img {
        width: 64px;
        height: 64px;
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
    }
  }

  .field-group .options--delivery,
  .field-group .options--slots {
    grid-template-columns: minmax(0, 1fr);
  }

  .form {
    padding: 20px;

    &__row {
      grid-template-columns: 1fr;
    }
  }
}
</style>
