<script lang="ts" setup>
import NsIcon from '~/components/redesign/naslagdenia/NsIcon.vue'

// Заявка вместо корзины: готовые торты и пирожные штуками, заказные — весом к дате.
// Оплаты на сайте у кондитерской нет — менеджер перезванивает и подтверждает.
const order = useNaslagdeniaOrder()
const ui = useNaslagdeniaUi()
const f = order.form

const mounted = ref(false)
const eta = ref<ReturnType<typeof nsReadyEta> | null>(null)
onMounted(() => {
  mounted.value = true
  eta.value = nsReadyEta()
  if (!eta.value.today && f.value.day === 'today') f.value.day = 'tomorrow'
})

const hasReady = computed(() => order.readyLines.value.length > 0)
const hasCustom = computed(() => order.customLines.value.length > 0)
const empty = computed(() => !hasReady.value && !hasCustom.value)
const zone = computed(() => nsZones.find((z) => z.id === f.value.zone)!)
const shop = computed(() => nsShops.find((s) => s.id === f.value.shop))
const paidZone = computed(() => f.value.zone === 'sovetsky' || f.value.zone === 'pervomaysky')
const pieShort = computed(() => order.pieSum.value > 0 && order.pieSum.value < nsRules.pieMinSum)

const delivery = computed(() => {
  if (f.value.way === 'pickup') return 'в магазине, бесплатно'
  if (hasCustom.value) return '250–750 ₽, назовёт менеджер'
  if (paidZone.value) return 'доплата за район, назовёт менеджер'
  return 'бесплатно'
})

const setWeight = (key: string, w: number, min: number) => {
  order.updateCustom(key, { weight: Math.min(30, Math.max(min, w)) })
}
const setDate = (key: string, v: string, weight: number) => {
  const min = nsIsoAfter(nsLeadDays(weight))
  order.updateCustom(key, { date: v < min ? min : v })
}

const error = ref('')
const done = ref<{ id: number; total: number; prepay: number; custom: boolean } | null>(null)
const send = () => {
  if (empty.value) return (error.value = 'В заказе пока ничего нет')
  if (pieShort.value) return (error.value = `Пирожные — от ${nsMoney(nsRules.pieMinSum)}: добавьте коробку`)
  if (f.value.way === 'delivery' && !f.value.address.trim()) return (error.value = 'Укажите адрес доставки')
  if (f.value.phone.replace(/\D/g, '').length < 10) return (error.value = 'Проверьте номер телефона — по нему перезвонит менеджер')
  error.value = ''
  const id = 2400 + order.sent.value.length + 1
  const lines = [
    ...order.readyLines.value.map((l) => `${l.product.title} × ${l.qty}`),
    ...order.customLines.value.map((l) => `${l.product.title}, ${nsKg(l.weight)}, к ${nsDateText(l.date, false)}`),
  ]
  done.value = { id, total: order.total.value, prepay: order.prepay.value, custom: hasCustom.value }
  order.sent.value = [{ id, date: nsIsoAfter(0), total: order.total.value, lines }, ...order.sent.value]
  order.clear()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

useSeoMeta({ title: 'Заказ — кондитерская «Наслаждение» | Концепт редизайна' })
</script>

<template>
  <div class="ns-wrap ns-order">
    <nav class="ns-crumbs" aria-label="Навигация">
      <NuxtLink :to="nsPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Заказ</span>
    </nav>
    <h1 class="ns-page-title">Заказ</h1>

    <div v-if="done" class="ns-done">
      <span class="ns-done__icon"><NsIcon name="check" :size="28" /></span>
      <div>
        <h2>Заявка №{{ done.id }} принята</h2>
        <p>
          Менеджер перезвонит, подтвердит заказ и назовёт стоимость доставки.
          <template v-if="done.custom">
            Предоплату за заказной торт — {{ nsMoney(done.prepay) }} (30&nbsp;%) — вносят в любом фирменном магазине.
          </template>
        </p>
        <p class="ns-done__demo">Это демо: заявка сохранилась только в вашем браузере, в кондитерскую она не ушла.</p>
        <NuxtLink :to="nsPath('/catalog')" class="ns-btn ns-btn--main">Вернуться в каталог</NuxtLink>
      </div>
    </div>

    <div v-else-if="mounted && empty" class="ns-order__empty">
      <p>В заказе пока пусто. Готовые торты добавляются кнопкой «В заказ», заказные — после расчёта веса и даты.</p>
      <div class="ns-order__empty-links">
        <NuxtLink :to="nsPath('/catalog/standard')" class="ns-btn ns-btn--main">Готовые торты</NuxtLink>
        <NuxtLink :to="nsPath('/catalog/holiday')" class="ns-btn ns-btn--line">Торты на заказ</NuxtLink>
      </div>
    </div>

    <form v-else-if="mounted" class="ns-order__grid" novalidate @submit.prevent="send">
      <div class="ns-order__main">
        <section v-if="hasReady" class="ns-order__block">
          <h2>Готовые торты и пирожные</h2>
          <ul class="ns-lines">
            <li v-for="l in order.readyLines.value" :key="l.product.id" class="ns-line">
              <NuxtLink :to="nsPath(`/product/${l.product.id}`)" class="ns-line__photo">
                <img :src="l.product.img" alt="" width="120" height="88" loading="lazy" />
              </NuxtLink>
              <div class="ns-line__info">
                <NuxtLink :to="nsPath(`/product/${l.product.id}`)" class="ns-line__title">{{ nsShort(l.product) }}</NuxtLink>
                <span>{{ l.product.box ? `коробка ${l.product.box} шт` : l.product.weight }} · {{ nsMoney(l.product.price) }}</span>
              </div>
              <div class="ns-qty">
                <button type="button" class="ns-qty__btn" aria-label="Меньше" @click="order.setQty(l.product.id, l.qty - 1)">
                  <NsIcon name="minus" :size="18" />
                </button>
                <span class="ns-qty__n">{{ l.qty }}&nbsp;{{ l.product.box ? 'кор' : 'шт' }}</span>
                <button type="button" class="ns-qty__btn" aria-label="Больше" @click="order.setQty(l.product.id, l.qty + 1)">
                  <NsIcon name="plus" :size="18" />
                </button>
              </div>
              <b class="ns-line__sum">{{ nsMoney(l.sum) }}</b>
              <button type="button" class="ns-hbtn ns-line__del" aria-label="Убрать" @click="order.setQty(l.product.id, 0)">
                <NsIcon name="trash" :size="20" />
              </button>
            </li>
          </ul>
          <p v-if="pieShort" class="ns-error">Пирожные заказывают коробками от {{ nsMoney(nsRules.pieMinSum) }}.</p>
        </section>

        <section v-if="hasCustom" class="ns-order__block">
          <h2>Торты на заказ</h2>
          <ul class="ns-lines">
            <li v-for="l in order.customLines.value" :key="l.key" class="ns-line ns-line--custom">
              <NuxtLink :to="nsPath(`/product/${l.product.id}`)" class="ns-line__photo">
                <img :src="l.product.img" alt="" width="120" height="88" loading="lazy" />
              </NuxtLink>
              <div class="ns-line__info">
                <NuxtLink :to="nsPath(`/product/${l.product.id}`)" class="ns-line__title">{{ nsShort(l.product) }}</NuxtLink>
                <span
                  >{{ nsMoney(l.product.price) }} за кг<template v-if="l.text"> · надпись «{{ l.text }}»</template></span
                >
              </div>
              <b class="ns-line__sum">{{ nsMoney(l.sum) }}</b>
              <button type="button" class="ns-hbtn ns-line__del" aria-label="Убрать" @click="order.removeCustom(l.key)">
                <NsIcon name="trash" :size="20" />
              </button>
              <div class="ns-line__opts">
                <div class="ns-qty">
                  <button
                    type="button"
                    class="ns-qty__btn"
                    aria-label="Меньше на 0,5 кг"
                    :disabled="l.weight <= nsMinWeight(l.product)"
                    @click="setWeight(l.key, l.weight - 0.5, nsMinWeight(l.product))"
                  >
                    <NsIcon name="minus" :size="18" />
                  </button>
                  <span class="ns-qty__n">{{ nsKg(l.weight) }}</span>
                  <button
                    type="button"
                    class="ns-qty__btn"
                    aria-label="Больше на 0,5 кг"
                    @click="setWeight(l.key, l.weight + 0.5, nsMinWeight(l.product))"
                  >
                    <NsIcon name="plus" :size="18" />
                  </button>
                </div>
                <label class="ns-line__date">
                  <NsIcon name="calendar" :size="18" />
                  <input
                    type="date"
                    :value="l.date"
                    :min="nsIsoAfter(nsLeadDays(l.weight))"
                    aria-label="К какому дню"
                    @change="setDate(l.key, ($event.target as HTMLInputElement).value, l.weight)"
                  />
                </label>
                <span class="ns-select ns-line__filling">
                  <select
                    :value="l.filling"
                    aria-label="Начинка"
                    @change="order.updateCustom(l.key, { filling: ($event.target as HTMLSelectElement).value })"
                  >
                    <option v-for="fl in nsFillings" :key="fl.id" :value="fl.id">Начинка: {{ nsShort(fl) }}</option>
                  </select>
                  <NsIcon name="down" :size="18" />
                </span>
              </div>
            </li>
          </ul>
        </section>

        <section class="ns-order__block">
          <h2>Получение</h2>
          <div class="ns-seg">
            <button type="button" :class="{ 'is-on': f.way === 'delivery' }" @click="f.way = 'delivery'">Доставка</button>
            <button type="button" :class="{ 'is-on': f.way === 'pickup' }" @click="f.way = 'pickup'">Заберу в магазине</button>
          </div>

          <template v-if="f.way === 'delivery'">
            <div class="ns-field">
              <span>Район</span>
              <div class="ns-seg ns-seg--wrap">
                <button v-for="z in nsZones" :key="z.id" type="button" :class="{ 'is-on': f.zone === z.id }" @click="f.zone = z.id">
                  {{ z.short }}
                </button>
              </div>
              <small class="ns-order__hint">{{ zone.note }}</small>
            </div>
            <label class="ns-field">
              <span>Адрес</span>
              <input
                v-model="f.address"
                class="ns-input"
                type="text"
                autocomplete="street-address"
                placeholder="Улица, дом, подъезд, квартира"
              />
            </label>
          </template>
          <label v-else class="ns-field">
            <span>Магазин</span>
            <span class="ns-select">
              <select v-model="f.shop">
                <option v-for="s in nsShops" :key="s.id" :value="s.id">{{ s.title }}</option>
              </select>
              <NsIcon name="down" :size="18" />
            </span>
            <small v-if="shop" class="ns-order__hint"
              >{{ shop.note ?? 'Как найти — на странице «Магазины»' }}{{ shop.hours ? ` · ${shop.hours}` : '' }}</small
            >
          </label>

          <div v-if="hasReady" class="ns-field">
            <span>Готовые торты — когда</span>
            <div class="ns-seg ns-seg--wrap">
              <button type="button" :disabled="!eta?.today" :class="{ 'is-on': f.day === 'today' }" @click="f.day = 'today'">
                Сегодня{{ eta?.today ? `, ${eta.short}` : '' }}
              </button>
              <button type="button" :class="{ 'is-on': f.day === 'tomorrow' }" @click="f.day = 'tomorrow'">Завтра</button>
              <button type="button" :class="{ 'is-on': f.day === 'date' }" @click="f.day = 'date'">Другой день</button>
            </div>
            <input v-if="f.day === 'date'" v-model="f.date" class="ns-input ns-order__date" type="date" :min="nsIsoAfter(1)" />
          </div>
          <label class="ns-field">
            <span>Удобное время</span>
            <span class="ns-select">
              <select v-model="f.slot">
                <option value="">Любое с 9:00 до 19:00</option>
                <option v-for="s in nsSlots" :key="s" :value="s">{{ s }}</option>
              </select>
              <NsIcon name="down" :size="18" />
            </span>
            <small class="ns-order__hint">Заявки на доставку принимаем ежедневно с 8:00 до 17:00, привозим с 9:00 до 19:00.</small>
          </label>
        </section>

        <section class="ns-order__block">
          <h2>Контакты</h2>
          <div class="ns-field-row">
            <label class="ns-field">
              <span>Имя</span>
              <input v-model="f.name" class="ns-input" type="text" autocomplete="given-name" />
            </label>
            <label class="ns-field">
              <span>Телефон*</span>
              <input v-model="f.phone" class="ns-input" type="tel" autocomplete="tel" placeholder="+7" />
            </label>
          </div>
          <label class="ns-field">
            <span>Комментарий</span>
            <textarea v-model="f.comment" rows="3" placeholder="Например: позвонить за час, домофон не работает" />
          </label>
        </section>
      </div>

      <aside class="ns-sum">
        <h2>Итого</h2>
        <dl>
          <div v-if="hasReady">
            <dt>Готовые</dt>
            <dd>{{ nsMoney(order.readySum.value) }}</dd>
          </div>
          <div v-if="hasCustom">
            <dt>Заказные, ориентир</dt>
            <dd>{{ nsMoney(order.customSum.value) }}</dd>
          </div>
          <div>
            <dt>{{ f.way === 'pickup' ? 'Получение' : 'Доставка' }}</dt>
            <dd>{{ delivery }}</dd>
          </div>
        </dl>
        <div class="ns-sum__total">
          <span>{{ hasCustom ? 'Ориентир' : 'К оплате' }}</span>
          <b>{{ nsMoney(order.total.value) }}</b>
        </div>
        <p v-if="hasCustom" class="ns-sum__prepay">
          <NsIcon name="wallet" :size="20" />
          <span>Предоплата за заказные — {{ nsMoney(order.prepay.value) }} (30&nbsp;%), вносится в фирменном магазине.</span>
        </p>
        <p class="ns-sum__note">Оплаты на сайте нет: менеджер перезвонит, подтвердит заказ и скажет, как удобнее оплатить.</p>
        <p v-if="error" class="ns-error">{{ error }}</p>
        <button type="submit" class="ns-btn ns-btn--main ns-btn--lg ns-sum__send">Отправить заявку</button>
      </aside>
    </form>

    <section v-if="mounted && order.sent.value.length" class="ns-section ns-sent">
      <h2>Ваши заявки</h2>
      <ul>
        <li v-for="s in order.sent.value.slice(0, 5)" :key="s.id">
          <b>№{{ s.id }}</b>
          <span>{{ nsDateText(s.date, false) }}</span>
          <span class="ns-sent__lines">{{ s.lines.join(', ') }}</span>
          <span v-if="s.total">{{ nsMoney(s.total) }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss">
.ns .ns-order {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 32px;
    align-items: start;
    margin-top: 28px;
  }

  &__main {
    display: grid;
    gap: 20px;
  }

  &__block {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    padding: 24px;
    border: 1px solid var(--ns-line);
    border-radius: var(--ns-r-card);

    h2 {
      font-size: 26px;
    }

    > .ns-seg {
      justify-self: start;
    }
  }

  &__hint {
    font-size: 13px;
    color: var(--ns-muted);
  }

  &__date {
    max-width: 260px;
  }

  &__empty {
    display: grid;
    gap: 18px;
    max-width: 640px;
    margin-top: 20px;
    padding: 28px;
    background: var(--ns-surface);
    border-radius: var(--ns-r-card);
  }

  &__empty-links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 1199px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 20px;
    }
  }

  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 576px) {
    &__block {
      padding: 18px 14px;
    }

    &__date {
      max-width: none;
    }

    .ns-seg--wrap {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));

      button {
        padding: 0 8px;
      }

      @media (max-width: 375px) {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    &__block > .ns-seg {
      justify-self: stretch;

      button {
        flex: 1;
        padding: 0 8px;
      }
    }
  }
}

.ns ul.ns-lines {
  display: grid;
}

.ns .ns-line {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr) auto 110px 44px;
  align-items: center;
  gap: 12px 16px;
  padding: 14px 0;
  border-top: 1px solid var(--ns-line);

  &:first-child {
    border-top: 0;
    padding-top: 0;
  }

  &__photo {
    display: block;
    overflow: hidden;
    aspect-ratio: 15 / 11;
    background: var(--ns-terra);
    border-radius: 12px;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    display: grid;
    gap: 2px;
    min-width: 0;

    span {
      font-size: 13px;
      color: var(--ns-muted);
    }
  }

  &__title {
    font-family: var(--ns-head);
    font-size: 19px;
    font-weight: 700;
    line-height: 1.15;
    color: var(--ns-dark);
    text-decoration: none;
  }

  &__sum {
    font-size: 17px;
    text-align: right;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    color: var(--ns-dark);
  }

  &--custom {
    grid-template-columns: 88px minmax(0, 1fr) 110px 44px;
  }

  &__opts {
    display: flex;
    flex-wrap: wrap;
    grid-column: 2 / -1;
    gap: 8px;
  }

  &__date {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 44px;
    padding: 0 12px;
    color: var(--ns-accent);
    border: 1px solid var(--ns-line-strong);
    border-radius: var(--ns-r-btn);

    input {
      font: inherit;
      color: var(--ns-dark);
      background: none;
      border: 0;
      outline: none;
    }
  }

  &__filling {
    flex: 1;
    min-width: 200px;

    select {
      height: 44px;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 72px minmax(0, 1fr) auto;
    gap: 10px 12px;

    &__photo {
      grid-row: 1 / 3;
      align-self: start;
    }

    &__info {
      grid-column: 2;
      grid-row: 1;
    }

    &__del {
      grid-column: 3;
      grid-row: 1;
      align-self: start;
      justify-self: end;
    }

    > .ns-qty {
      grid-column: 2;
      grid-row: 2;
      justify-self: start;
    }

    &__sum {
      grid-column: 3;
      grid-row: 2;
    }

    &--custom {
      .ns-line__photo {
        grid-row: 1 / 3;
      }

      .ns-line__sum {
        grid-column: 3;
      }
    }

    &__opts {
      grid-column: 1 / -1;
      grid-row: 3;
    }

    &__date,
    &__filling {
      flex: 1 1 100%;
      min-width: 0;
    }
  }
}

.ns .ns-sum {
  position: sticky;
  top: 136px;
  display: grid;
  gap: 14px;
  padding: 24px;
  background: var(--ns-surface);
  border-radius: var(--ns-r-card);

  h2 {
    font-size: 26px;
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
      color: var(--ns-muted);
    }

    dd {
      margin: 0;
      font-weight: 600;
      text-align: right;
      color: var(--ns-dark);
    }
  }

  &__total {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding-top: 14px;
    border-top: 1px solid var(--ns-line-strong);

    b {
      font-size: 30px;
      color: var(--ns-dark);
      font-variant-numeric: tabular-nums;
    }
  }

  &__prepay {
    display: flex;
    gap: 10px;
    padding: 12px 14px;
    font-size: 14px;
    background: #fff;
    border-radius: 14px;

    .ns-icon {
      flex: none;
      color: var(--ns-accent);
    }
  }

  &__note {
    font-size: 13px;
    color: var(--ns-muted);
  }

  &__send {
    width: 100%;
  }

  @media (max-width: 989px) {
    position: static;
  }
}

.ns .ns-done {
  display: flex;
  gap: 20px;
  max-width: 720px;
  margin-top: 24px;
  padding: 28px;
  background: var(--ns-surface);
  border-radius: var(--ns-r-card);

  &__icon {
    display: grid;
    flex: none;
    place-items: center;
    width: 56px;
    height: 56px;
    color: #fff;
    background: var(--ns-accent);
    border-radius: 18px;
  }

  > div {
    display: grid;
    justify-items: start;
    gap: 12px;
  }

  h2 {
    font-size: 30px;
  }

  &__demo {
    font-size: 13px;
    color: var(--ns-muted);
  }

  @media (max-width: 576px) {
    flex-direction: column;
    padding: 20px 16px;
  }
}

.ns .ns-sent {
  h2 {
    font-size: 26px;
  }

  ul {
    display: grid;
    gap: 8px;
    margin-top: 14px;
  }

  li {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 16px;
    padding: 12px 16px;
    font-size: 14px;
    border: 1px solid var(--ns-line);
    border-radius: 14px;
  }

  &__lines {
    flex: 1;
    min-width: 0;
    color: var(--ns-muted);
  }
}
</style>
