<script lang="ts" setup>
// Конструктор комплексного обеда: по блюду на слот, число порций, всё сразу в корзину.
const cart = useTomichCart()

const picks = ref<Record<string, string>>({ ...tmLunchDefault })
const persons = ref(1)
const added = ref('')

const slots = tmLunchSlots.map((slot) => ({
  ...slot,
  options: tmDishes.filter((d) => slot.cats.includes(d.cat)),
}))

const chosen = computed(() =>
  slots.flatMap((slot) => {
    const dish = picks.value[slot.id] ? tmFindDish(picks.value[slot.id]) : undefined
    return dish ? [dish] : []
  }),
)
const perPerson = computed(() => chosen.value.reduce((n, d) => n + d.price, 0))

const addLunch = () => {
  chosen.value.forEach((d) => cart.add(d.id, persons.value))
  added.value = `Обед на ${persons.value} ${persons.value === 1 ? 'человека' : 'человек'} в корзине`
}
watch([picks, persons], () => (added.value = ''), { deep: true })
</script>

<template>
  <section class="tm-lunch" aria-labelledby="tm-lunch-title">
    <div class="tm-lunch__head">
      <h2 id="tm-lunch-title">Соберите обед</h2>
      <p>Первое, горячее, гарнир и салат — одним нажатием в корзину. На себя или на весь отдел.</p>
    </div>

    <div class="tm-lunch__slots">
      <label v-for="slot in slots" :key="slot.id" class="tm-lunch__slot">
        <span class="tm-lunch__label">{{ slot.label }}</span>
        <span class="tm-lunch__select">
          <select v-model="picks[slot.id]">
            <option value="">{{ slot.none }}</option>
            <option v-for="d in slot.options" :key="d.id" :value="d.id">
              {{ d.name }} · {{ d.weight }} · {{ d.price }} ₽
            </option>
          </select>
        </span>
      </label>
    </div>

    <div class="tm-lunch__foot">
      <div class="tm-lunch__persons">
        <span>Порций</span>
        <div class="tm-qty tm-qty--light" role="group" aria-label="Число порций">
          <button type="button" aria-label="Меньше" @click="persons = Math.max(1, persons - 1)">−</button>
          <span data-val>{{ persons }}</span>
          <button type="button" aria-label="Больше" @click="persons = Math.min(30, persons + 1)">+</button>
        </div>
      </div>
      <div class="tm-lunch__total">
        <span>{{ tmFormatPrice(perPerson) }} за обед</span>
        <strong>{{ tmFormatPrice(perPerson * persons) }}</strong>
      </div>
    </div>

    <button type="button" class="tm-btn tm-btn--wide" :disabled="!chosen.length" @click="addLunch">
      Положить в корзину
    </button>
    <p class="tm-lunch__done" aria-live="polite">
      <template v-if="added">
        {{ added }}. <NuxtLink :to="tmPath('/cart')">Перейти к оформлению</NuxtLink>
      </template>
    </p>
  </section>
</template>

<style lang="scss">
.tm-lunch {
  display: grid;
  gap: 18px;
  padding: 24px;
  border-radius: var(--tm-r-lg);
  background: var(--tm-mint);
  border: 1px solid var(--tm-mint-2);

  h2 {
    font-size: 26px;
  }
  &__head p {
    margin-top: 6px;
    color: var(--tm-muted);
    font-size: 14px;
  }
  &__slots {
    display: grid;
    gap: 8px;
  }
  &__slot {
    display: grid;
    grid-template-columns: 84px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
  }
  &__label {
    font-size: 13px;
    font-weight: 600;
    color: var(--tm-muted);
  }
  &__select {
    position: relative;
    min-width: 0;
    color: var(--tm-green);

    &::after {
      content: '';
      position: absolute;
      right: 14px;
      top: 50%;
      width: 8px;
      height: 8px;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: translateY(-70%) rotate(45deg);
      pointer-events: none;
    }
    select {
      width: 100%;
      min-width: 0;
      min-height: 44px;
      padding: 8px 36px 8px 12px;
      border: 1px solid var(--tm-mint-2);
      border-radius: var(--tm-r);
      background: #fff;
      color: var(--tm-ink);
      font: inherit;
      font-size: 14px;
      font-weight: 600;
      appearance: none;
      text-overflow: ellipsis;
      cursor: pointer;

      &:focus {
        border-color: var(--tm-green);
      }
    }
  }
  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 14px;
    border-top: 1px solid var(--tm-mint-2);
  }
  &__persons {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: var(--tm-muted);
  }
  .tm-qty--light {
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--tm-mint-2);
  }
  &__total {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-variant-numeric: tabular-nums;

    span {
      font-size: 13px;
      color: var(--tm-muted);
    }
    strong {
      font-size: 26px;
      font-weight: 800;
      line-height: 1.1;
    }
  }
  &__done {
    min-height: 20px;
    margin-top: -6px;
    font-size: 14px;
    color: var(--tm-green);

    a {
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
  .tm-btn:disabled {
    opacity: 0.5;
    cursor: default;
  }
}
</style>
