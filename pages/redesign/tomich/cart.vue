<script lang="ts" setup>
useSeoMeta({ title: 'Корзина | Торговый Дом «Томич»' })

const cart = useTomichCart()
const delivery = ref(tmDeliveryDate())
const sent = ref(false)
const printedAt = ref('')

const catLabel = (id: TmCategoryId) => tmCategories.find((c) => c.id === id)?.label ?? ''

const printOrder = () => {
  printedAt.value = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Tomsk',
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date())
  nextTick(() => window.print())
}

onMounted(() => (delivery.value = tmDeliveryDate()))
</script>

<template>
  <div class="tm-wrap tmc">
    <header class="tm-pagehead tm-noprint">
      <div class="tm-crumbs">
        <NuxtLink :to="tmPath()">Главная</NuxtLink><span>/</span><span>Корзина</span>
      </div>
      <h1>Корзина</h1>
    </header>

    <div class="tmc-print-head">
      <strong>{{ tmContacts.company }}</strong> · {{ tmContacts.phone }} · {{ tmContacts.address }}
      <div>Заказ на {{ delivery.day }}. Сформирован {{ printedAt }}</div>
    </div>

    <div v-if="!cart.lines.value.length && !sent" class="tmc-empty">
      <p>В корзине пока пусто. Начните с меню на завтра или соберите комплексный обед.</p>
      <NuxtLink :to="tmPath('/menu')" class="tm-btn">Открыть меню</NuxtLink>
    </div>

    <div v-else-if="sent" class="tmc-empty">
      <h2>Заказ принят (демо)</h2>
      <p>
        На настоящем сайте заказ ушёл бы менеджеру, а вам — подтверждение. Доставка — {{ delivery.weekday }},
        {{ delivery.day }}.
      </p>
      <NuxtLink :to="tmPath('/menu')" class="tm-btn tm-btn--dark">Вернуться в меню</NuxtLink>
    </div>

    <div v-else class="tmc-layout">
      <section class="tmc-lines" aria-label="Состав заказа">
        <div class="tmc-row tmc-row--head" aria-hidden="true">
          <span>Блюдо</span><span>Выход</span><span>Цена</span><span>Порций</span><span>Сумма</span><span />
        </div>
        <div v-for="line in cart.lines.value" :key="line.dish.id" class="tmc-row">
          <div class="tmc-row__dish">
            <img
              v-if="line.dish.photo"
              :src="tmPhoto(line.dish.photo)"
              :alt="line.dish.name"
              width="56"
              height="56"
            />
            <div>
              <div class="tmc-row__name">{{ line.dish.name }}</div>
              <div class="tmc-row__cat">{{ catLabel(line.dish.cat) }}</div>
            </div>
          </div>
          <span class="tmc-row__weight">{{ line.dish.weight }}</span>
          <span class="tmc-row__price">{{ tmFormatPrice(line.dish.price) }}</span>
          <div class="tm-qty tmc-row__qty" role="group" :aria-label="`Порций «${line.dish.name}»`">
            <button type="button" aria-label="Меньше" @click="cart.remove(line.dish.id)">−</button>
            <span data-val>{{ line.qty }}</span>
            <button type="button" aria-label="Больше" @click="cart.add(line.dish.id)">+</button>
          </div>
          <span class="tmc-row__print-qty">{{ line.qty }}</span>
          <strong class="tmc-row__sum">{{ tmFormatPrice(line.sum) }}</strong>
          <button
            type="button"
            class="tmc-row__del tm-noprint"
            :aria-label="`Удалить «${line.dish.name}»`"
            @click="cart.drop(line.dish.id)"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
            </svg>
          </button>
        </div>
        <div class="tmc-total-print">Итого: {{ tmFormatPrice(cart.total.value) }}</div>

        <div class="tmc-actions tm-noprint">
          <button type="button" class="tm-btn tm-btn--ghost tm-btn--sm" @click="printOrder">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" />
            </svg>
            Печатная форма
          </button>
          <button type="button" class="tm-btn tm-btn--ghost tm-btn--sm" @click="cart.clear()">Очистить корзину</button>
          <NuxtLink :to="tmPath('/menu')" class="tmc-actions__more">Добавить ещё блюда</NuxtLink>
        </div>
      </section>

      <aside class="tmc-side tm-noprint">
        <div class="tmc-summary">
          <div class="tmc-summary__line">
            <span>Блюд</span><span>{{ cart.count.value }}</span>
          </div>
          <div class="tmc-summary__line tmc-summary__total">
            <span>Итого</span><strong>{{ tmFormatPrice(cart.total.value) }}</strong>
          </div>
          <p class="tmc-summary__date">
            Доставка — {{ delivery.weekday }}, {{ delivery.day }}. {{ tmOrderRule }}
          </p>
        </div>

        <form class="tmc-form" @submit.prevent="sent = true; cart.clear()">
          <h2>Оформление</h2>
          <label class="tm-field">
            <span>Наименование или ФИО *</span>
            <input type="text" name="name" autocomplete="name" required placeholder="ООО «Ромашка» или Иванов Иван" />
          </label>
          <label class="tm-field">
            <span>Контактный телефон *</span>
            <input type="tel" name="tel" autocomplete="tel" required placeholder="+7" />
          </label>
          <label class="tm-field">
            <span>Email</span>
            <input type="email" name="email" autocomplete="email" />
          </label>
          <label class="tm-field">
            <span>Адрес доставки *</span>
            <input type="text" name="address" autocomplete="street-address" required placeholder="Улица, дом, офис" />
          </label>
          <label class="tm-field">
            <span>Комментарий</span>
            <textarea name="comment" placeholder="Время обеда, этаж, кому позвонить" />
          </label>
          <button type="submit" class="tm-btn tm-btn--wide">Отправить заказ</button>
          <p class="tmc-form__legal">
            Нажимая «Отправить заказ», вы даёте согласие на обработку персональных данных. Это демо: заказ никуда не отправится.
          </p>
        </form>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.tmc-empty {
  display: grid;
  justify-items: start;
  gap: 16px;
  padding: 24px 0 40px;

  p {
    max-width: 560px;
    color: var(--tm-muted);
    font-size: 16px;
  }
}

.tmc-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 40px;
  align-items: start;
}

.tmc-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 76px 72px 108px 84px 40px;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--tm-line);
  font-variant-numeric: tabular-nums;

  &--head {
    padding: 0 0 10px;
    border-bottom: 1px solid var(--tm-line);
    font-size: 13px;
    font-weight: 600;
    color: var(--tm-muted);
  }
  &__dish {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;

    img {
      width: 56px;
      height: 56px;
      object-fit: cover;
      border-radius: var(--tm-r);
      flex-shrink: 0;
    }
    > div {
      min-width: 0;
    }
  }
  &__name {
    font-weight: 700;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }
  &__cat {
    font-size: 13px;
    color: var(--tm-muted);
  }
  &__weight {
    font-size: 14px;
    color: var(--tm-muted);
  }
  &__print-qty {
    display: none;
  }
  &__sum {
    text-align: right;
    font-size: 16px;
  }
  &__del {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--tm-muted);

    &:hover {
      color: var(--tm-red);
    }
  }
}

.tmc-total-print {
  display: none;
}

.tmc-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 12px;
  margin-top: 20px;

  &__more {
    margin-left: auto;
    font-weight: 700;
    color: var(--tm-red);
  }
}

.tmc-side {
  position: sticky;
  top: 130px;
  display: grid;
  gap: 16px;
}

.tmc-summary {
  padding: 20px;
  border-radius: var(--tm-r-lg);
  background: var(--tm-mint);

  &__line {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    font-variant-numeric: tabular-nums;
  }
  &__total {
    margin-top: 6px;
    padding-top: 10px;
    border-top: 1px solid var(--tm-mint-2);
    font-size: 18px;
    font-weight: 700;

    strong {
      font-size: 26px;
    }
  }
  &__date {
    margin-top: 10px;
    font-size: 13.5px;
    color: var(--tm-muted);
  }
}

.tmc-form {
  display: grid;
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--tm-line);
  border-radius: var(--tm-r-lg);

  h2 {
    font-size: 22px;
  }
  &__legal {
    font-size: 12.5px;
    color: var(--tm-muted);
  }
}

.tmc-print-head {
  display: none;
}

@media (max-width: 1080px) {
  .tmc-layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .tmc-side {
    position: static;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
  }
}

@media (max-width: 760px) {
  .tmc-side {
    grid-template-columns: minmax(0, 1fr);
  }
  .tmc-row {
    grid-template-columns: minmax(0, 1fr) auto minmax(72px, auto);
    grid-template-areas:
      'dish dish del'
      'meta qty sum';
    gap: 10px 12px;

    &--head {
      display: none;
    }
    &__dish {
      grid-area: dish;
    }
    &__del {
      grid-area: del;
      justify-self: end;
    }
    &__weight {
      grid-area: meta;
    }
    &__price {
      display: none;
    }
    &__qty {
      grid-area: qty;
    }
    &__sum {
      grid-area: sum;
      min-width: 72px;
    }
  }
  .tmc-actions__more {
    margin-left: 0;
    width: 100%;
  }
}

@media print {
  .tmc-print-head {
    display: block;
    margin-bottom: 16px;
    font-size: 13px;
  }
  .tmc-layout {
    display: block;
  }
  .tmc-row {
    grid-template-columns: minmax(0, 1fr) 70px 70px 50px 80px;

    &__qty,
    &__dish img {
      display: none;
    }
    &__print-qty {
      display: block;
    }
  }
  .tmc-total-print {
    display: block;
    margin-top: 12px;
    text-align: right;
    font-weight: 800;
    font-size: 18px;
  }
}
</style>
