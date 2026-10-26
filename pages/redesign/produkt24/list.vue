<script lang="ts" setup>
import PkIcon from '~/components/redesign/produkt24/PkIcon.vue'
import PkTiers from '~/components/redesign/produkt24/PkTiers.vue'
import PkBuy from '~/components/redesign/produkt24/PkBuy.vue'
import PkLetter from '~/components/redesign/produkt24/PkLetter.vue'

useSeoMeta({ title: 'Список и заявка — 24produkt | Концепт редизайна' })

const list = useProdukt24List()
const ui = useProdukt24Ui()

// Шкала веса: доставка по городу от 200 кг, крупный опт от 1 т — оба порога из условий оригинала.
const fill = computed(() => Math.min(100, (list.weight.value / pkBulkFrom) * 100))
const hint = computed(() => {
  const w = list.weight.value
  if (w < pkDeliveryFrom) return `До доставки по городу ещё ${pkKg(pkDeliveryFrom - w)} — или самовывоз со склада`
  if (w < pkBulkFrom) return `Доставка по Красноярску доступна. До цен крупного опта ещё ${pkKg(pkBulkFrom - w)}`
  return 'Больше 1 т — заказ проходит по ценам крупного опта'
})
const canBulk = computed(() => list.weight.value >= pkBulkFrom && list.tier.value !== 'bulk')

const clear = () => {
  list.clear()
  ui.say('Список очищен')
}
</script>

<template>
  <div class="pk-wrap pk-list">
    <div class="pk-list__title">
      <h1>Список</h1>
      <p v-if="list.count.value">{{ list.count.value }} поз. · {{ pkMoney(list.total.value) }}</p>
    </div>

    <div v-if="!list.count.value" class="pk-list__empty">
      <PkIcon name="list" :size="40" />
      <b>Список пока пуст</b>
      <p>Добавьте позиции из прайса — здесь появится сумма, вес и готовый текст заявки для менеджера.</p>
      <NuxtLink :to="pkSectionPath()" class="pk-btn">Перейти в прайс</NuxtLink>
    </div>

    <div v-else class="pk-list__grid">
      <div class="pk-list__main">
        <div class="pk-list__tiers">
          <span>Цены:</span>
          <PkTiers compact />
        </div>

        <div class="pk-list__lines">
          <div v-for="l in list.lines.value" :key="l.product.id" class="pk-line">
            <div class="pk-line__name">
              <span>{{ l.product.name }}</span>
              <small>{{ pkMoney(l.price) }} / {{ pkUnitLabel(l.product.unit) }}<template v-if="l.weight"> · ≈ {{ pkKg(l.weight) }}</template></small>
            </div>
            <PkBuy :id="l.product.id" :unit="l.product.unit" class="pk-line__qty" />
            <b class="pk-line__sum">{{ pkMoney(l.sum) }}</b>
            <button type="button" class="pk-iconbtn pk-line__del" aria-label="Убрать из списка" @click="list.setQty(l.product.id, 0)">
              <PkIcon name="close" :size="20" />
            </button>
          </div>
        </div>

        <div class="pk-weight">
          <div class="pk-weight__head">
            <PkIcon name="scale" />
            <b>Вес заказа ≈ {{ pkKg(list.weight.value) }}</b>
            <span>Итого {{ pkMoney(list.total.value) }}</span>
          </div>
          <div class="pk-weight__bar">
            <i :style="{ width: `${fill}%` }" />
            <span class="pk-weight__mark" style="left: 20%">200 кг</span>
            <span class="pk-weight__mark pk-weight__mark--end">1 т</span>
          </div>
          <p>{{ hint }}</p>
          <p v-if="list.noWeight.value" class="pk-weight__note">
            Без {{ list.noWeight.value }} поз.: вес штуки не указан в прайсе — менеджер уточнит.
          </p>
          <button v-if="canBulk" type="button" class="pk-btn" @click="list.tier.value = 'bulk'">Показать цены от 1 т</button>
        </div>

        <button type="button" class="pk-list__clear" @click="clear"><PkIcon name="trash" :size="18" /> Очистить список</button>
      </div>

      <aside class="pk-list__side">
        <div class="pk-list__form">
          <h2>Заявка</h2>
          <div class="pk-list__way" role="radiogroup" aria-label="Получение">
            <button type="button" :class="{ 'is-on': list.form.value.way === 'delivery' }" @click="list.form.value.way = 'delivery'">
              <PkIcon name="truck" :size="20" /> Доставка
            </button>
            <button type="button" :class="{ 'is-on': list.form.value.way === 'pickup' }" @click="list.form.value.way = 'pickup'">
              <PkIcon name="store" :size="20" /> Самовывоз
            </button>
          </div>
          <label v-if="list.form.value.way === 'delivery'" class="pk-field">
            Адрес доставки
            <input v-model="list.form.value.address" placeholder="Красноярск, улица, дом" autocomplete="street-address" />
          </label>
          <p v-else class="pk-list__pickup">Склад: {{ pkContacts.address }}. Пн–пт 8:30–16:30, сб 9:00–12:00.</p>
          <label class="pk-field">Организация или ИП<input v-model="list.form.value.company" placeholder="ООО «Кафе», ИНН" /></label>
          <label class="pk-field">Телефон<input v-model="list.form.value.phone" type="tel" placeholder="+7" autocomplete="tel" /></label>
          <label class="pk-field">Комментарий<input v-model="list.form.value.comment" placeholder="Время, документы, замены" /></label>
        </div>
        <PkLetter actions />
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.pk-list {
  padding-top: 32px;

  &__title {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 16px;
    margin-bottom: 24px;

    h1 {
      font-size: 36px;
    }

    p {
      color: var(--pk-muted);
    }
  }

  &__empty {
    display: grid;
    justify-items: center;
    gap: 12px;
    max-width: 560px;
    margin: 0 auto;
    padding: 48px 24px;
    border-radius: var(--pk-r-lg);
    background: var(--pk-surface);
    text-align: center;

    > .pk-icon {
      color: var(--pk-green);
    }

    b {
      color: var(--pk-ink);
      font-size: 20px;
    }

    p {
      color: var(--pk-muted);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 460px;
    gap: 32px;
    align-items: start;
  }

  &__main {
    display: grid;
    gap: 20px;
    min-width: 0;
  }

  &__tiers {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    color: var(--pk-muted);
  }

  &__lines {
    border-top: 1px solid var(--pk-line);
  }

  &__clear {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    justify-self: start;
    color: var(--pk-muted);
    font-size: 14px;

    &:hover {
      color: #b3261e;
    }
  }

  &__side {
    position: sticky;
    top: 16px;
    display: grid;
    gap: 16px;
  }

  &__form {
    display: grid;
    gap: 14px;
    padding: 22px;
    border-radius: var(--pk-r-lg);
    background: var(--pk-surface);

    h2 {
      font-size: 22px;
    }
  }

  &__way {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 44px;
      border: 1px solid var(--pk-line);
      border-radius: var(--pk-r);
      background: #fff;
      color: var(--pk-ink);
      font-weight: 500;

      &.is-on {
        border-color: var(--pk-green);
        box-shadow: inset 0 0 0 1px var(--pk-green);
        color: var(--pk-green-d);
      }
    }
  }

  &__pickup {
    color: var(--pk-muted);
    font-size: 14px;
  }

  @media (max-width: 1199px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr) 400px;
      gap: 24px;
    }
  }

  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }

    &__side {
      position: static;
    }
  }

  @media (max-width: 768px) {
    padding-top: 20px;

    &__title h1 {
      font-size: 28px;
    }
  }

  @media (max-width: 375px) {
    &__form {
      padding: 18px 14px;
    }
  }
}

.pk-line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 120px 44px;
  grid-template-areas: 'name qty sum del';
  align-items: center;
  gap: 8px 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--pk-line);

  &__name {
    grid-area: name;
    display: grid;
    min-width: 0;

    span {
      color: var(--pk-ink);
      line-height: 1.35;
    }

    small {
      color: var(--pk-muted);
      font-size: 13px;
    }
  }

  &__qty {
    grid-area: qty;
  }

  &__sum {
    grid-area: sum;
    color: var(--pk-ink);
    text-align: right;
    white-space: nowrap;
  }

  &__del {
    grid-area: del;
    color: var(--pk-muted);
  }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr) auto 44px;
    grid-template-areas:
      'name name del'
      'qty sum sum';

    .pk-buy {
      justify-content: flex-start;
    }
  }
}

.pk-weight {
  display: grid;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--pk-line);
  border-radius: var(--pk-r-lg);

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 10px;

    > .pk-icon {
      color: var(--pk-green);
    }

    b {
      color: var(--pk-ink);
    }

    span {
      margin-left: auto;
      color: var(--pk-ink);
      font-weight: 600;
    }
  }

  &__bar {
    position: relative;
    height: 10px;
    margin-bottom: 18px;
    border-radius: 5px;
    background: var(--pk-surface);

    i {
      display: block;
      height: 100%;
      border-radius: 5px;
      background: var(--pk-green);
      transition: width 0.3s;
    }
  }

  &__mark {
    position: absolute;
    top: 14px;
    color: var(--pk-muted);
    font-size: 12px;
    transform: translateX(-50%);

    &::before {
      content: '';
      position: absolute;
      top: -18px;
      left: 50%;
      width: 2px;
      height: 14px;
      background: var(--pk-gold);
    }

    &--end {
      right: 0;
      transform: none;

      &::before {
        left: auto;
        right: 0;
      }
    }
  }

  p {
    color: var(--pk-text);
    font-size: 14px;
  }

  &__note {
    color: var(--pk-muted) !important;
  }

  .pk-btn {
    justify-self: start;
  }

  @media (max-width: 375px) {
    padding: 16px 14px;
  }
}
</style>
