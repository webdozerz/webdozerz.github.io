<script lang="ts" setup>
import SnQty from '~/components/redesign/sanych/SnQty.vue'

const cart = useSanychCart()
const delivery = ref(snTomorrow())
onMounted(() => (delivery.value = snTomorrow()))

const mode = ref<'door' | 'flat' | 'express'>('door')
const buyer = ref<'person' | 'company'>('person')
const pay = ref<'cash' | 'transfer'>('cash')
const sent = ref(false)

const modes = [
  { id: 'door', label: 'До подъезда', hint: 'завтра, время согласуем утром' },
  { id: 'flat', label: 'До квартиры', hint: `+${snRub(snRules.toFlat)} к доставке` },
  { id: 'express', label: 'Экспресс за 6 часов', hint: 'в день заказа, доплату назовёт оператор' },
] as const

const subtotal = computed(() => cart.total.value)
const freeByMoney = computed(() => subtotal.value[0] >= snRules.freeFrom)
const freeByKg = computed(() => cart.weight.value >= snRules.freeKg)
const isFree = computed(() => freeByMoney.value || freeByKg.value)
const progress = computed(() =>
  Math.min(100, Math.max((subtotal.value[0] / snRules.freeFrom) * 100, (cart.weight.value / snRules.freeKg) * 100)),
)
const leftRub = computed(() => Math.max(0, snRules.freeFrom - subtotal.value[0]))
const leftKg = computed(() => Math.max(0, snRules.freeKg - cart.weight.value))
const belowMin = computed(() => subtotal.value[0] < snRules.minOrder)
const hasRange = computed(() => subtotal.value[0] !== subtotal.value[1])

const deliveryLine = computed(() => {
  const flat = mode.value === 'flat' ? snRules.toFlat : 0
  if (mode.value === 'express') return 'доплата за экспресс'
  if (isFree.value) return flat ? snRub(flat) : 'бесплатно'
  return flat ? `${snRub(flat)} + по тарифу` : 'по тарифу'
})
const extra = computed(() => (mode.value === 'flat' ? snRules.toFlat : 0))
const grand = computed<[number, number]>(() => [subtotal.value[0] + extra.value, subtotal.value[1] + extra.value])

const cutLabel = (cut: string) => (cut === 'chop' ? 'нарубить' : cut === 'whole' ? 'куском' : '')

const submit = () => {
  sent.value = true
  nextTick(() => document.querySelector('.snk-sent')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
}

useSeoMeta({ title: 'Корзина | Мясная лавка «Саныч», концепт', robots: 'noindex, nofollow' })
</script>

<template>
  <div class="sn-wrap snk">
    <div class="sn-pagehead">
      <nav class="sn-crumbs" aria-label="Навигация">
        <NuxtLink :to="snPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>Корзина</span>
      </nav>
      <h1>Корзина</h1>
    </div>

    <div v-if="sent" class="snk-sent" role="status">
      <h2>Заказ принят — это демо</h2>
      <p>
        В настоящем магазине здесь будет номер заказа. Мы соберём его на ферме, взвесим и пришлём
        SMS с точной суммой. Утром {{ delivery.day }} позвоним и согласуем время доставки.
      </p>
      <p class="sn-muted">В концепте заказ никуда не отправляется.</p>
      <div class="snk-sent__actions">
        <button type="button" class="sn-btn" @click="cart.clear(); sent = false">Очистить корзину</button>
        <NuxtLink :to="snPath('/catalog')" class="sn-btn sn-btn--line">Вернуться в каталог</NuxtLink>
      </div>
    </div>

    <div v-else-if="!cart.lines.value.length" class="snk-empty">
      <h2>В корзине пока пусто</h2>
      <p>Загляните в каталог или выберите из того, что берут каждую неделю.</p>
      <NuxtLink :to="snPath('/catalog')" class="sn-btn">Перейти в каталог</NuxtLink>
    </div>

    <div v-else class="snk-layout">
      <div class="snk-main">
        <ul class="snk-lines">
          <li v-for="line in cart.lines.value" :key="line.key" class="snk-line">
            <NuxtLink :to="snPath(`/product/${line.product.id}`)" class="snk-line__photo">
              <img :src="snImg(line.product.img)" :alt="line.product.name" width="120" height="90" />
            </NuxtLink>
            <div class="snk-line__info">
              <NuxtLink :to="snPath(`/product/${line.product.id}`)" class="snk-line__name">{{ line.product.name }}</NuxtLink>
              <span class="snk-line__meta">
                {{ snRub(line.product.price) }} {{ snPer(line.product) }}
                <template v-if="line.product.piece"> · {{ snPieceLabel(line.product) }}</template>
                <template v-if="line.cut"> · {{ cutLabel(line.cut) }}</template>
              </span>
            </div>
            <SnQty
              class="snk-line__qty"
              :product="line.product"
              :model-value="line.qty"
              small
              @update:model-value="cart.setQty(line.key, $event)"
            />
            <b class="snk-line__sum">{{ line.product.unit === 'piece' ? '≈ ' : '' }}{{ snRange(line.sum) }}</b>
            <button type="button" class="snk-line__drop" :aria-label="`Удалить: ${line.product.name}`" @click="cart.drop(line.key)">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />
              </svg>
            </button>
          </li>
        </ul>

        <p class="snk-weight-note">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 8v5M12 16.5h.01M12 3l9 16H3z" /></svg>
          <span>
            Реальный вес отличается от заказанного: тушу не нарубить на одинаковые куски.
            {{ snRules.overweight }}. Когда соберём заказ, пришлём SMS с точной суммой.
          </span>
        </p>

        <form class="snk-form" @submit.prevent="submit">
          <h2>Оформление</h2>

          <fieldset class="snk-modes">
            <legend>Доставка</legend>
            <label v-for="m in modes" :key="m.id" class="snk-mode" :class="{ 'is-on': mode === m.id }">
              <input v-model="mode" type="radio" name="mode" :value="m.id" />
              <span class="snk-mode__label">{{ m.label }}</span>
              <span class="snk-mode__hint">{{ m.hint }}</span>
            </label>
          </fieldset>

          <div class="snk-row">
            <div class="sn-field">
              <span>Покупатель</span>
              <div class="sn-seg" role="group" aria-label="Покупатель">
                <button type="button" :class="{ 'is-on': buyer === 'person' }" :aria-pressed="buyer === 'person'" @click="buyer = 'person'">Частное лицо</button>
                <button type="button" :class="{ 'is-on': buyer === 'company' }" :aria-pressed="buyer === 'company'" @click="buyer = 'company'">Организация</button>
              </div>
            </div>
            <div class="sn-field">
              <span>Оплата</span>
              <div class="sn-seg" role="group" aria-label="Оплата">
                <button type="button" :class="{ 'is-on': pay === 'cash' }" :aria-pressed="pay === 'cash'" @click="pay = 'cash'">Наличными</button>
                <button type="button" :class="{ 'is-on': pay === 'transfer' }" :aria-pressed="pay === 'transfer'" @click="pay = 'transfer'">Безнал</button>
              </div>
            </div>
          </div>

          <div class="snk-row">
            <label class="sn-field">
              <span>Имя</span>
              <input type="text" name="name" autocomplete="name" required />
            </label>
            <label class="sn-field">
              <span>Телефон — пришлём SMS с суммой</span>
              <input type="tel" name="phone" autocomplete="tel" placeholder="+7 900 000-00-00" required />
            </label>
          </div>
          <label v-if="buyer === 'company'" class="sn-field">
            <span>Организация и ИНН — подготовим документы</span>
            <input type="text" name="company" />
          </label>
          <label class="sn-field">
            <span>Адрес доставки</span>
            <input type="text" name="address" autocomplete="street-address" placeholder="Новосибирск, улица, дом, подъезд, квартира" required />
          </label>
          <label class="sn-field">
            <span>Комментарий: как нарубить, когда удобно принять</span>
            <textarea name="comment" placeholder="Например: лопатку порубить на плов, после 18:00" />
          </label>

          <button type="submit" class="sn-btn sn-btn--wide snk-submit" :disabled="belowMin">
            {{ belowMin ? `Добавьте ещё на ${snRub(snRules.minOrder - subtotal[0])}` : 'Оформить заказ' }}
          </button>
          <p class="snk-demo">Это демо: заказ никуда не отправится.</p>
        </form>
      </div>

      <aside class="snk-summary" aria-label="Итог">
        <div class="snk-free" :class="{ 'is-done': isFree }">
          <div class="snk-free__text">
            <template v-if="isFree"><b>Доставка до подъезда бесплатная</b></template>
            <template v-else>
              До бесплатной доставки: ещё <b>{{ snRub(leftRub) }}</b> или <b>{{ snNum(leftKg) }} кг</b>
            </template>
          </div>
          <div class="snk-free__bar" role="progressbar" :aria-valuenow="Math.round(progress)" aria-valuemin="0" aria-valuemax="100">
            <span :style="{ width: `${progress}%` }" />
          </div>
        </div>

        <dl class="snk-totals">
          <div>
            <dt>Товары, {{ cart.count.value }} поз.</dt>
            <dd>{{ hasRange ? '≈ ' : '' }}{{ snRange(subtotal) }}</dd>
          </div>
          <div v-if="cart.weight.value">
            <dt>Вес</dt>
            <dd>≈ {{ snNum(cart.weight.value) }} кг</dd>
          </div>
          <div>
            <dt>Доставка</dt>
            <dd>{{ deliveryLine }}</dd>
          </div>
          <div class="snk-totals__grand">
            <dt>Итого</dt>
            <dd>{{ hasRange ? '≈ ' : '' }}{{ snRange(grand) }}</dd>
          </div>
        </dl>

        <p v-if="belowMin" class="snk-min">
          Минимальный заказ — {{ snRub(snRules.minOrder) }}: иначе упаковка и доставка не окупаются.
        </p>
        <p class="snk-when">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
          </svg>
          <span v-if="mode === 'express'">Привезём сегодня в течение 6 часов, если заказ оформлен с 9:00 до 18:00</span>
          <span v-else>Привезём завтра, {{ delivery.day }}. Утром позвоним и согласуем время</span>
        </p>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.sn .snk-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 28px;
  align-items: start;
}

.sn .snk-main {
  display: grid;
  gap: 20px;
  min-width: 0;
}

.sn .snk-lines {
  display: grid;
  list-style: none;
  border-top: 1px solid var(--sn-line);
}

.sn .snk-line {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) 150px 120px 40px;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--sn-line);
}

.sn .snk-line__photo img {
  width: 96px;
  height: 72px;
  border-radius: 12px;
  object-fit: cover;
}

.sn .snk-line__info {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.sn .snk-line__name {
  font-weight: 800;
  overflow-wrap: anywhere;

  &:hover {
    color: var(--sn-red);
  }
}

.sn .snk-line__meta {
  font-size: 13px;
  color: var(--sn-muted);
}

.sn .snk-line__sum {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.sn .snk-line__drop {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: var(--sn-muted);

  &:hover {
    background: var(--sn-rose);
    color: var(--sn-red);
  }
}

.sn .snk-weight-note {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  border-radius: var(--sn-r);
  background: var(--sn-paper);
  font-size: 14px;
  color: var(--sn-muted);

  svg {
    margin-top: 2px;
    color: #c07a12;
  }
}

.sn .snk-form {
  display: grid;
  gap: 16px;
  padding: 26px;
  border-radius: var(--sn-r-lg);
  box-shadow: inset 0 0 0 1px var(--sn-line);

  h2 {
    font-size: 22px;
  }
}

.sn .snk-modes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;

  legend {
    margin-bottom: 8px;
    padding: 0;
    font-size: 13px;
    font-weight: 700;
    color: var(--sn-muted);
  }
}

.sn .snk-mode {
  position: relative;
  display: grid;
  gap: 2px;
  padding: 12px 14px;
  border-radius: var(--sn-r);
  background: var(--sn-paper);
  cursor: pointer;
  box-shadow: inset 0 0 0 1px transparent;
  transition: box-shadow 0.15s, background-color 0.15s;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &:hover {
    background: var(--sn-paper-2);
  }

  &.is-on {
    background: #fff;
    box-shadow: inset 0 0 0 2px var(--sn-red);
  }

  &:has(input:focus-visible) {
    outline: 2px solid var(--sn-red);
    outline-offset: 2px;
  }
}

.sn .snk-mode__label {
  font-weight: 800;
}

.sn .snk-mode__hint {
  font-size: 13px;
  color: var(--sn-muted);
}

.sn .snk-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.sn .snk-submit {
  min-height: 54px;
  font-size: 16px;
}

.sn .snk-demo {
  margin-top: -6px;
  font-size: 13px;
  color: var(--sn-muted);
  text-align: center;
}

.sn .snk-summary {
  position: sticky;
  top: 140px;
  display: grid;
  gap: 16px;
  padding: 22px;
  border-radius: var(--sn-r-lg);
  background: var(--sn-paper);
}

.sn .snk-free {
  display: grid;
  gap: 10px;
  padding: 14px;
  border-radius: var(--sn-r);
  background: #fff;
  font-size: 14px;

  b {
    white-space: nowrap;
  }

  &.is-done {
    color: var(--sn-green);
  }
}

.sn .snk-free__bar {
  height: 6px;
  border-radius: 3px;
  background: var(--sn-paper-2);
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    border-radius: 3px;
    background: var(--sn-red);
    transition: width 0.3s;
  }
}

.sn .snk-free.is-done .snk-free__bar span {
  background: var(--sn-green);
}

.sn .snk-totals {
  display: grid;
  gap: 10px;

  > div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  dt {
    color: var(--sn-muted);
  }

  dd {
    font-weight: 700;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
}

.sn .snk-totals__grand {
  padding-top: 12px;
  border-top: 1px solid var(--sn-line);

  dt {
    color: var(--sn-ink);
    font-weight: 800;
  }

  dd {
    font-family: var(--sn-head);
    font-size: 22px;
    font-weight: 600;
  }
}

.sn .snk-min {
  padding: 12px 14px;
  border-radius: var(--sn-r);
  background: var(--sn-rose);
  color: var(--sn-red-d);
  font-size: 14px;
  font-weight: 600;
}

.sn .snk-when {
  display: flex;
  gap: 10px;
  font-size: 14px;
  color: var(--sn-muted);

  svg {
    margin-top: 2px;
    color: var(--sn-green);
  }
}

.sn .snk-empty,
.sn .snk-sent {
  display: grid;
  justify-items: start;
  gap: 12px;
  padding: 32px;
  border-radius: var(--sn-r-lg);
  background: var(--sn-paper);

  h2 {
    font-size: 24px;
  }

  p {
    max-width: 640px;
  }
}

.sn .snk-sent {
  background: var(--sn-green-soft);
}

.sn .snk-sent__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 1080px) {
  .sn .snk-layout {
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 20px;
  }

  .sn .snk-line {
    grid-template-columns: 80px minmax(0, 1fr) 140px 40px;
    grid-template-areas: 'photo info info drop' 'photo qty sum sum';
    row-gap: 8px;
  }

  .sn .snk-line__photo {
    grid-area: photo;

    img {
      width: 80px;
      height: 64px;
    }
  }

  .sn .snk-line__info {
    grid-area: info;
  }

  .sn .snk-line__qty {
    grid-area: qty;
    max-width: 160px;
  }

  .sn .snk-line__sum {
    grid-area: sum;
  }

  .sn .snk-line__drop {
    grid-area: drop;
  }
}

@media (max-width: 860px) {
  .sn .snk-layout {
    grid-template-columns: 1fr;
  }

  // На телефоне итог — сразу под товарами, до формы.
  .sn .snk-summary {
    position: static;
    order: -1;
  }

  // align-items: start от десктопной сетки во flex-колонке сжимает строки до содержимого.
  .sn .snk-layout {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .sn .snk-main {
    display: contents;
  }

  .sn .snk-lines {
    order: -3;
  }

  .sn .snk-weight-note {
    order: -2;
  }
}

@media (max-width: 560px) {
  .sn .snk-line {
    grid-template-columns: 64px minmax(0, 1fr) auto 40px;
    grid-template-areas: 'photo info info drop' 'qty qty sum sum';
    column-gap: 12px;
  }

  .sn .snk-line__photo img {
    width: 64px;
    height: 52px;
  }

  .sn .snk-form {
    padding: 20px 16px;
  }

  .sn .snk-modes,
  .sn .snk-row {
    grid-template-columns: 1fr;
  }

  .sn .snk-summary {
    padding: 16px;
  }

  .sn .snk-empty,
  .sn .snk-sent {
    padding: 22px 18px;
  }
}
</style>
