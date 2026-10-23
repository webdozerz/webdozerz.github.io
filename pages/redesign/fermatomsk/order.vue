<script lang="ts" setup>
import FmIcon from '~/components/redesign/fermatomsk/FmIcon.vue'
import FmQty from '~/components/redesign/fermatomsk/FmQty.vue'
import FmMessage from '~/components/redesign/fermatomsk/FmMessage.vue'

const order = useFermatomskOrder()
const ui = useFermatomskUi()

useSeoMeta({ title: 'Мой заказ — FermaTomsk | Концепт редизайна' })

// Что ещё можно добавить: продукты, которых нет в заказе.
const more = computed(() => fmProducts.filter((p) => !order.qtyOf(p.id)))
</script>

<template>
  <div class="fm-wrap fm-order">
    <header class="fm-pagehead">
      <h1>Мой заказ</h1>
      <p>Отметьте количество, день и адрес — получится готовое сообщение. Отправьте его ферме в Telegram или MAX, как обычно.</p>
    </header>

    <div class="fm-order__grid">
      <div class="fm-order__main">
        <section class="fm-order__box">
          <div class="fm-order__boxhead">
            <h2>Продукты</h2>
            <button v-if="order.count.value" type="button" class="fm-order__clear" @click="order.clear()">
              <FmIcon name="trash" :size="18" /> Очистить
            </button>
          </div>
          <p v-if="!order.count.value" class="fm-order__empty">
            Пока пусто. <NuxtLink :to="fmPath('/#products')">Выберите продукты</NuxtLink> или добавьте из списка ниже.
          </p>
          <ul v-else class="fm-lines">
            <li v-for="l in order.lines.value" :key="l.product.id" class="fm-line">
              <button type="button" class="fm-line__img" :aria-label="l.product.name" @click="ui.product.value = l.product.id">
                <img :src="l.product.img" alt="" width="300" height="400" />
              </button>
              <div class="fm-line__name">
                <b>{{ l.product.name }}</b>
                <span>{{ fmPrice(l.product.price) }} за {{ l.product.unit }}</span>
              </div>
              <FmQty :id="l.product.id" />
              <b class="fm-line__sum">{{ fmPrice(l.sum) }}</b>
            </li>
          </ul>
          <div v-if="order.count.value" class="fm-order__total">
            <span>Итого</span>
            <b>{{ fmPrice(order.total.value) }}</b>
          </div>
          <div v-if="more.length" class="fm-more">
            <h3>{{ order.count.value ? 'Добавить ещё' : 'Продукты фермы' }}</h3>
            <div class="fm-more__list">
              <button v-for="p in more" :key="p.id" type="button" class="fm-more__item" @click="order.add(p.id)">
                <img :src="p.img" alt="" width="300" height="400" loading="lazy" />
                <span>
                  <b>{{ p.name }}</b>
                  <small>{{ fmPrice(p.price) }} · {{ p.unit }}</small>
                </span>
                <FmIcon name="plus" :size="20" />
              </button>
            </div>
          </div>
        </section>

        <section class="fm-order__box">
          <h2>Доставка</h2>
          <p class="fm-order__note">{{ fmContacts.delivery }} Время и оплату ферма подтвердит в ответном сообщении.</p>
          <fieldset class="fm-days">
            <legend>Удобный день</legend>
            <label v-for="d in ui.days.value" :key="d.key" class="fm-days__item" :class="{ 'is-on': order.form.value.day === d.key }">
              <input v-model="order.form.value.day" type="radio" name="fm-day" :value="d.key" />
              <span class="fm-days__wd">{{ d.short }}</span>
              <span class="fm-days__date">{{ d.date }}</span>
            </label>
          </fieldset>
          <div class="fm-fields">
            <label class="fm-field fm-field--wide">
              <span>Адрес в Томске</span>
              <input v-model="order.form.value.address" type="text" autocomplete="street-address" placeholder="Улица, дом, квартира" />
            </label>
            <label class="fm-field">
              <span>Имя</span>
              <input v-model="order.form.value.name" type="text" autocomplete="given-name" placeholder="Как к вам обращаться" />
            </label>
            <label class="fm-field">
              <span>Телефон</span>
              <input v-model="order.form.value.phone" type="tel" autocomplete="tel" placeholder="+7" />
            </label>
            <label class="fm-field fm-field--wide">
              <span>Комментарий</span>
              <textarea v-model="order.form.value.comment" rows="2" placeholder="Например, позвонить за час" />
            </label>
          </div>
        </section>
      </div>

      <aside class="fm-order__side">
        <h2>Сообщение ферме</h2>
        <FmMessage actions />
        <p class="fm-order__hint">
          Кнопка копирует текст и открывает чат с фермой — останется вставить и отправить. Можно и позвонить:
          <a :href="fmContacts.phoneHref">{{ fmContacts.phone }}</a>.
        </p>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.fm-order {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(340px, 440px);
    gap: 24px;
    align-items: start;
    margin-top: 24px;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__main {
    display: grid;
    gap: 20px;
  }

  &__box {
    display: grid;
    gap: 16px;
    padding: 24px;
    border-radius: var(--fm-r-lg);
    border: 1px solid var(--fm-line);

    h2 {
      font-size: 22px;
    }

    @media (max-width: 576px) {
      padding: 18px 16px;
    }
  }

  &__boxhead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__clear {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--fm-muted);
    font-size: 14px;

    &:hover {
      color: #b4321f;
    }
  }

  &__empty {
    padding: 18px;
    border-radius: 14px;
    background: var(--fm-surface);
    color: var(--fm-text);

    a {
      color: var(--fm-green-d);
      text-decoration: underline;
    }
  }

  &__total {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding-top: 14px;
    border-top: 1px solid var(--fm-line);
    font-size: 18px;

    b {
      font-size: 24px;
      font-variant-numeric: tabular-nums;
    }
  }

  &__note {
    color: var(--fm-text);
  }

  &__side {
    position: sticky;
    top: 130px;
    display: grid;
    gap: 14px;

    h2 {
      font-size: 22px;
    }

    @media (max-width: 989px) {
      position: static;
    }
  }

  &__hint {
    color: var(--fm-muted);
    font-size: 14px;

    a {
      color: var(--fm-ink);
      font-weight: 500;
      white-space: nowrap;
    }
  }
}

.fm-lines {
  display: grid;
}

.fm-line {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) auto 96px;
  gap: 16px;
  align-items: center;
  padding: 12px 0;

  & + & {
    border-top: 1px solid var(--fm-line);
  }

  &__img {
    overflow: hidden;
    width: 64px;
    height: 72px;
    border-radius: 12px;
    background: var(--fm-photo);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__name {
    display: grid;
    min-width: 0;

    span {
      color: var(--fm-muted);
      font-size: 14px;
    }
  }

  &__sum {
    text-align: right;
    font-size: 17px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  @media (max-width: 576px) {
    grid-template-columns: 56px minmax(0, 1fr) auto;
    grid-template-areas: 'img name name' 'img qty sum';
    gap: 8px 12px;

    &__img {
      grid-area: img;
      width: 56px;
      height: 64px;
    }

    &__name {
      grid-area: name;
    }

    .fm-qty {
      grid-area: qty;
      justify-self: start;
    }

    &__sum {
      grid-area: sum;
    }
  }
}

.fm-more {
  display: grid;
  gap: 10px;
  margin-top: 4px;

  h3 {
    font-size: 16px;
    font-weight: 600;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr));
    gap: 8px;
  }

  &__item {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) 24px;
    gap: 10px;
    align-items: center;
    padding: 6px 12px 6px 6px;
    border-radius: 12px;
    background: var(--fm-surface);
    text-align: left;
    transition: background 0.15s;

    img {
      width: 44px;
      height: 50px;
      border-radius: 8px;
      object-fit: cover;
    }

    span {
      display: grid;
      min-width: 0;
      line-height: 1.3;
    }

    b {
      font-size: 15px;
      font-weight: 500;
    }

    small {
      color: var(--fm-muted);
      font-size: 13px;
    }

    .fm-icon {
      color: var(--fm-green);
    }

    &:hover {
      background: var(--fm-green-soft);
    }
  }
}

.fm-days {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
  border: 0;

  legend {
    margin-bottom: 8px;
    font-weight: 500;
  }

  &__item {
    display: grid;
    justify-items: center;
    padding: 10px 6px;
    border-radius: 12px;
    background: var(--fm-surface);
    cursor: pointer;
    transition: background 0.15s;

    input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    &:hover {
      background: #e8ece9;
    }

    &.is-on {
      background: var(--fm-green-soft);
      box-shadow: inset 0 0 0 2px var(--fm-green);
    }

    &:focus-within {
      outline: 2px solid var(--fm-green);
      outline-offset: 2px;
    }
  }

  &__wd {
    color: var(--fm-muted);
    font-size: 13px;
  }

  &__date {
    font-weight: 600;
    white-space: nowrap;
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.fm-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.fm-field {
  display: grid;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;

  &--wide {
    grid-column: 1 / -1;
  }

  input,
  textarea {
    width: 100%;
    min-height: 48px;
    padding: 12px 14px;
    border: 1px solid var(--fm-line);
    border-radius: var(--fm-r);
    background: #fff;
    font-size: 16px;
    font-weight: 400;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: var(--fm-green);
      box-shadow: 0 0 0 3px rgba(26, 128, 64, 0.15);
    }
  }
}
</style>
