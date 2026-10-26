<script lang="ts" setup>
import type { NsProduct } from '~/utils/naslagdeniaData'
import NsIcon from './NsIcon.vue'

// Расчёт заказного торта по правилам со страницы «Оплата и доставка»: вес от минимума раздела,
// сумма по цене за кг, ближайшая дата (до 7 кг — за 3 дня, тяжелее — за 7), предоплата 30 %.
const props = defineProps<{ product: NsProduct }>()
const order = useNaslagdeniaOrder()
const ui = useNaslagdeniaUi()

const min = computed(() => nsMinWeight(props.product))
const weight = ref(min.value)
const guests = ref(nsGuestsForWeight(min.value))
const lead = computed(() => nsLeadDays(weight.value))
const minDate = computed(() => nsIsoAfter(lead.value))
const date = ref(nsIsoAfter(nsLeadDays(min.value)))
const filling = ref(nsFillings[0].id)
const text = ref('')
const added = ref(false)

const sum = computed(() => props.product.price * weight.value)
const prepay = computed(() => Math.round(sum.value * nsRules.prepay))
const fillingProduct = computed(() => nsFind(filling.value))

const setWeight = (w: number) => {
  weight.value = Math.min(30, Math.max(min.value, Math.round(w * 2) / 2))
  guests.value = nsGuestsForWeight(weight.value)
  added.value = false
}
const onGuests = () => {
  const g = Math.max(1, Math.min(200, Math.round(Number(guests.value) || 1)))
  weight.value = nsWeightForGuests(g, min.value)
  added.value = false
}
// Если вес перевалил за 7 кг, дата сдвигается — заявку раньше не примут.
watch(minDate, (v) => {
  if (date.value < v) date.value = v
})

const add = () => {
  order.addCustom({ id: props.product.id, weight: weight.value, date: date.value, filling: filling.value, text: text.value.trim() })
  added.value = true
  ui.say(`${nsShort(props.product)}, ${nsKg(weight.value)} — в заказе`)
}
</script>

<template>
  <div class="ns-calc">
    <div class="ns-calc__row">
      <span class="ns-calc__label">Вес</span>
      <div class="ns-calc__weight">
        <div class="ns-qty ns-qty--big">
          <button
            type="button"
            class="ns-qty__btn"
            aria-label="Меньше на 0,5 кг"
            :disabled="weight <= min"
            @click="setWeight(weight - 0.5)"
          >
            <NsIcon name="minus" :size="18" />
          </button>
          <span class="ns-qty__n">{{ nsKg(weight) }}</span>
          <button type="button" class="ns-qty__btn" aria-label="Больше на 0,5 кг" @click="setWeight(weight + 0.5)">
            <NsIcon name="plus" :size="18" />
          </button>
        </div>
        <label class="ns-calc__guests">
          <NsIcon name="users" :size="18" />
          <span>гостей</span>
          <input v-model="guests" type="number" min="1" max="200" inputmode="numeric" @change="onGuests" />
        </label>
      </div>
      <small class="ns-calc__hint">Минимум — {{ nsKg(min) }}. Считаем примерно 150 г на гостя.</small>
    </div>

    <label class="ns-calc__row">
      <span class="ns-calc__label">Начинка — как у готового торта</span>
      <span class="ns-select">
        <select v-model="filling">
          <option v-for="f in nsFillings" :key="f.id" :value="f.id">{{ nsShort(f) }}</option>
        </select>
        <NsIcon name="down" :size="18" />
      </span>
      <small v-if="fillingProduct?.desc" class="ns-calc__hint">{{ fillingProduct.desc }}</small>
    </label>

    <label class="ns-calc__row">
      <span class="ns-calc__label">К какому дню</span>
      <input v-model="date" class="ns-input" type="date" :min="minDate" />
      <small class="ns-calc__hint">
        Ближайшая дата — {{ nsDateText(minDate) }}: торт
        {{ weight > nsRules.bigWeight ? 'тяжелее 7 кг заказывают за 7 дней' : 'до 7 кг заказывают за 3 дня' }}.
      </small>
    </label>

    <label class="ns-calc__row">
      <span class="ns-calc__label">Надпись на торте <i>— если нужна</i></span>
      <input v-model="text" class="ns-input" type="text" maxlength="60" placeholder="С юбилеем, Ольга Петровна!" />
    </label>

    <div class="ns-calc__total">
      <div>
        <span>Ориентир по цене</span>
        <b>{{ nsMoney(sum) }}</b>
        <small>{{ nsKg(weight) }} × {{ nsMoney(product.price) }} · предоплата 30&nbsp;% — {{ nsMoney(prepay) }}</small>
      </div>
      <button type="button" class="ns-btn ns-btn--main ns-btn--lg" @click="add">
        <NsIcon :name="added ? 'check' : 'plus'" :size="20" />
        <span>{{ added ? 'Добавлено' : 'В заказ' }}</span>
      </button>
    </div>
    <p v-if="added" class="ns-calc__added">Торт в заявке. <NuxtLink :to="nsPath('/zakaz')">Перейти к заказу</NuxtLink></p>
  </div>
</template>

<style lang="scss">
.ns .ns-calc {
  display: grid;
  gap: 18px;

  &__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }

  &__label {
    font-size: 14px;
    font-weight: 600;
    color: var(--ns-dark);

    i {
      font-style: normal;
      font-weight: 400;
      color: var(--ns-muted);
    }
  }

  &__hint {
    font-size: 13px;
    line-height: 1.4;
    color: var(--ns-muted);
  }

  &__weight {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__guests {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    padding: 0 6px 0 14px;
    background: #fff;
    border: 1px solid var(--ns-line-strong);
    border-radius: var(--ns-r-btn);
    color: var(--ns-muted);
    font-size: 14px;

    input {
      width: 64px;
      height: 36px;
      padding: 0 8px;
      font: inherit;
      font-weight: 700;
      color: var(--ns-dark);
      text-align: center;
      background: var(--ns-surface);
      border: 0;
      border-radius: 8px;
    }
  }

  &__total {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 14px 18px;
    padding: 18px;
    background: var(--ns-surface);
    border-radius: var(--ns-r-card);

    > div:first-child {
      display: grid;
      gap: 2px;
    }

    > div:first-child span {
      font-size: 13px;
      color: var(--ns-muted);
    }

    > div:first-child b {
      font-size: 28px;
      font-weight: 700;
      color: var(--ns-dark);
      font-variant-numeric: tabular-nums;
    }

    > div:first-child small {
      font-size: 13px;
      color: var(--ns-muted);
    }
  }

  &__added {
    margin: -6px 0 0;
    font-size: 14px;

    a {
      color: var(--ns-accent);
      font-weight: 600;
    }
  }

  @media (max-width: 576px) {
    &__total {
      display: grid;
      grid-template-columns: minmax(0, 1fr);

      .ns-btn {
        width: 100%;
      }
    }
  }
}
</style>
