<script lang="ts" setup>
import LfIcon from '~/components/redesign/lavkafish/LfIcon.vue'
import LfQty from '~/components/redesign/lavkafish/LfQty.vue'

useSeoMeta({ title: 'Заказ | Лавка Fish, концепт редизайна' })

const cart = useLavkafishCart()
const ui = useLavkafishUi()
const form = cart.form

const city = computed(() => lfCities.find((c) => c.id === cart.city.value)!)
const zones = computed(() => lfZones[cart.city.value])

// Заказ делится по привозам: у каждого своя дата и своя доставка.
const groups = computed(() =>
  cart.batches.value.map((id) => ({
    batch: ui.batch(id),
    lines: cart.lines.value.filter((l) => l.batch === id),
  })),
)

const perUnit = (v: LfVariant) => (v.unit === 'pack' ? v.pack || 'шт' : 'кг')
const lineNote = (l: LfLine) => {
  const w = l.variant.weight
  if (l.variant.unit === 'piece' && w && w[0] !== w[1]) {
    const kg = w[1] === null ? `от ${lfKg(w[0] * l.qty)}` : `${(w[0] * l.qty).toLocaleString('ru-RU')}–${lfKg(w[1] * l.qty)}`
    return `${l.qty} шт ≈ ${kg} · ${lfPrice(l.unitPrice)}/кг`
  }
  if (l.variant.unit === 'piece' && w) return `${l.qty} шт по ${lfKg(w[0])} · ${lfPrice(l.unitPrice)}/кг`
  if (l.variant.unit === 'kg') return `${lfKg(l.qty)} · ${lfPrice(l.unitPrice)}/кг, пересчёт по факту`
  return `${l.qty} × ${lfPrice(l.unitPrice)}`
}

const promoState = ref<'idle' | 'checked'>('idle')
const checkPromo = () => {
  if (!form.value.promo.trim()) return
  promoState.value = 'checked'
}

const errors = ref<string[]>([])
const sent = ref(false)
const submit = () => {
  const e: string[] = []
  if (!form.value.name.trim()) e.push('имя и фамилию')
  if (form.value.phone.replace(/\D/g, '').length < 10) e.push('телефон')
  if (!form.value.address.trim()) e.push('адрес')
  if (!form.value.agree) e.push('согласие на обработку данных')
  errors.value = e
  if (e.length) return
  sent.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const restart = () => {
  cart.clear()
  sent.value = false
}
</script>

<template>
  <div class="lf-wrap lf-order">
    <div class="lf-order__top">
      <h1>Заказ</h1>
      <p>Доставка: {{ city.title }}. Город меняется переключателем вверху страницы.</p>
    </div>

    <div v-if="sent" class="lf-order__done">
      <LfIcon name="check" :size="32" />
      <h2>Спасибо, {{ form.name.split(' ')[0] }}! Заказ принят — в демо-режиме</h2>
      <p>
        На настоящем сайте сейчас открылась бы оплата картой
        {{ lfPrice(cart.prepay.value) }} через Сбербанк, а в течение суток вы получили бы сообщение в WhatsApp с временем доставки. В
        концепте заказ никуда не отправлен.
      </p>
      <div class="lf-order__done-actions">
        <button type="button" class="lf-btn" @click="restart">Собрать новый заказ</button>
        <NuxtLink :to="lfPath('/')" class="lf-btn lf-btn--line">На главную</NuxtLink>
      </div>
    </div>

    <div v-else-if="!cart.count.value" class="lf-order__empty">
      <p v-if="cart.hidden.value">
        В заказе {{ cart.hidden.value }} поз., которые не возим в {{ cart.city.value === 'nsk' ? 'Новосибирск' : 'этот город' }}.
        Переключите город на Томск, чтобы их увидеть.
      </p>
      <p v-else>Пока пусто. Выберите рыбу к ближайшему привозу — сумму посчитаем по весу.</p>
      <NuxtLink :to="lfPath('/#catalog')" class="lf-btn">В каталог<LfIcon name="arrow" :size="20" /></NuxtLink>
    </div>

    <div v-else class="lf-order__grid">
      <div class="lf-order__main">
        <section v-for="g in groups" :key="g.batch.id" class="lf-batch">
          <h2>
            <LfIcon name="truck" :size="24" />Привоз {{ g.batch.dayAcc }},
            {{ g.batch.dm }}
          </h2>
          <ul>
            <li v-for="l in g.lines" :key="l.key" class="lf-line">
              <img v-if="l.product.img" :src="l.product.img" :alt="l.product.name" width="96" height="96" />
              <span v-else class="lf-line__noimg"><LfIcon name="fish" :size="28" /></span>
              <div class="lf-line__text">
                <b>{{ l.product.name }}</b>
                <span
                  >{{ l.variant.label
                  }}<template v-if="l.variant.pack && l.variant.pack !== l.variant.label">, {{ l.variant.pack }}</template></span
                >
                <small>{{ lineNote(l) }}</small>
              </div>
              <div class="lf-line__qty">
                <LfQty :pid="l.product.id" :vid="l.variant.id" />
              </div>
              <p class="lf-line__sum">
                <b>{{ lfRange(l.est) }}</b>
                <small v-if="!l.est.exact && l.variant.unit === 'piece'">сейчас {{ lfPrice(l.est.prepay) }}</small>
              </p>
              <button
                type="button"
                class="lf-iconbtn lf-line__del"
                :aria-label="`Удалить: ${l.product.name}`"
                @click="cart.setQty(l.product.id, l.variant.id, 0)"
              >
                <LfIcon name="trash" :size="20" />
              </button>
            </li>
          </ul>
        </section>
        <p v-if="cart.hidden.value" class="lf-order__hint">
          Ещё {{ cart.hidden.value }} поз. в заказе возим только по Томску — они не учтены.
        </p>

        <form class="lf-form" novalidate @submit.prevent="submit">
          <h2>Доставка и контакты</h2>
          <div class="lf-form__grid">
            <label class="lf-field">
              Фамилия и имя
              <input v-model="form.name" type="text" autocomplete="name" />
            </label>
            <label class="lf-field">
              Телефон для связи
              <input v-model="form.phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7" />
            </label>
            <label class="lf-field">
              Телефон в WhatsApp
              <input v-model="form.whatsapp" type="tel" inputmode="tel" placeholder="Если другой" />
              <small>Сюда пришлём время доставки</small>
            </label>
            <label class="lf-field">
              Район
              <select v-model="form.zone">
                <option v-for="z in zones" :key="z.id" :value="z.id">
                  {{ z.title }} — {{ z.upTo ? `${z.price}–${z.upTo}` : z.price }} ₽
                </option>
              </select>
            </label>
            <label class="lf-field lf-form__wide">
              Адрес, где встретят заказ
              <input v-model="form.address" type="text" autocomplete="street-address" placeholder="Улица, дом, подъезд, квартира" />
              <small>После подтверждения адрес не меняем — курьер выезжает по маршруту</small>
            </label>
            <label class="lf-check lf-form__wide">
              <input v-model="form.lift" type="checkbox" />
              <span>Поднять до квартиры, +{{ lfLift }} ₽</span>
            </label>
            <label class="lf-field lf-form__wide">
              Комментарий
              <textarea v-model="form.comment" placeholder="Например, разделать форель или позвонить заранее" />
            </label>
          </div>

          <div class="lf-promo">
            <label class="lf-field">
              Промокод
              <input v-model="form.promo" type="text" @input="promoState = 'idle'" />
            </label>
            <button type="button" class="lf-btn lf-btn--line" @click="checkPromo">Применить</button>
            <p v-if="promoState === 'checked'" class="lf-promo__note">
              Промокод проверит менеджер при подтверждении — в демо скидка не считается.
            </p>
          </div>

          <label class="lf-check">
            <input v-model="form.agree" type="checkbox" />
            <span>Согласен на обработку персональных данных</span>
          </label>

          <p v-if="errors.length" class="lf-form__err" role="alert">Заполните: {{ errors.join(', ') }}.</p>
        </form>
      </div>

      <aside class="lf-total">
        <h2>Итого</h2>
        <dl>
          <div>
            <dt>Товары, примерно</dt>
            <dd>{{ lfRange(cart.total.value) }}</dd>
          </div>
          <div>
            <dt>
              Доставка<template v-if="cart.batches.value.length > 1"> × {{ cart.batches.value.length }} привоза</template>
            </dt>
            <dd>{{ cart.zone.value.upTo ? 'от ' : '' }}{{ lfPrice(cart.delivery.value) }}</dd>
          </div>
        </dl>
        <div class="lf-total__pay">
          <span>Оплата на сайте сейчас</span>
          <b>{{ lfPrice(cart.prepay.value + cart.delivery.value) }}</b>
          <small
            >За рыбу штучно — по 1 кг за каждую, остальное по весу курьеру наличными. Карты МИР, VISA, Mastercard, JCB через
            Сбербанк.</small
          >
        </div>
        <button type="button" class="lf-btn lf-total__btn" @click="submit">
          <LfIcon name="card" :size="20" />Оплатить
          {{ lfPrice(cart.prepay.value + cart.delivery.value) }}
        </button>
        <p class="lf-total__note">{{ lfDeliveryHours[cart.city.value] }}</p>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.lf-order {
  padding-top: 32px;
  padding-bottom: 48px;

  &__top {
    margin-bottom: 24px;

    h1 {
      font-size: clamp(32px, 4vw, 48px);
      line-height: 1.05;
    }

    p {
      margin-top: 6px;
      color: var(--lf-muted);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    align-items: start;
    gap: 28px;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__hint {
    padding: 12px 16px;
    border-radius: var(--lf-r);
    background: var(--lf-accent-soft);
  }

  &__empty,
  &__done {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 16px;
    max-width: 720px;
    padding: 32px;
    border-radius: var(--lf-r-lg);
    background: var(--lf-surface);

    @media (max-width: 576px) {
      padding: 22px 18px;
    }
  }

  &__done {
    > .lf-icon {
      color: var(--lf-ok);
    }

    h2 {
      font-size: 28px;
      line-height: 1.15;
    }
  }

  &__done-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}

.lf-batch {
  padding: 24px;
  border-radius: var(--lf-r-lg);
  box-shadow: inset 0 0 0 1px var(--lf-line);

  h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    font-size: 22px;

    .lf-icon {
      flex: none;
      color: var(--lf-accent-text);
    }
  }

  @media (max-width: 576px) {
    padding: 18px 14px;

    h2 {
      font-size: 20px;
    }
  }
}

.lf-line {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto 150px 44px;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-top: 1px solid var(--lf-line);

  &:first-child {
    border-top: 0;
  }

  img,
  &__noimg {
    width: 72px;
    height: 72px;
    border-radius: 12px;
    object-fit: cover;
  }

  &__noimg {
    display: grid;
    place-items: center;
    background: var(--lf-surface);
    color: var(--lf-muted);
  }

  &__text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.3;

    span {
      color: var(--lf-text);
      font-size: 15px;
    }

    small {
      margin-top: 2px;
      color: var(--lf-muted);
      font-size: 14px;
    }
  }

  &__sum {
    display: flex;
    flex-direction: column;
    align-items: end;
    text-align: right;

    b {
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    small {
      color: var(--lf-muted);
      font-size: 13px;
      white-space: nowrap;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: 64px minmax(0, 1fr) auto 44px;

    img,
    &__noimg {
      width: 64px;
      height: 64px;
    }

    &__qty {
      grid-column: 2;
      grid-row: 2;
    }

    &__sum {
      grid-column: 3;
      grid-row: 2;
    }

    &__del {
      grid-column: 4;
      grid-row: 1;
    }
  }

  @media (max-width: 576px) {
    grid-template-columns: 56px minmax(0, 1fr) 44px;
    gap: 10px 12px;

    img,
    &__noimg {
      width: 56px;
      height: 56px;
    }

    &__del {
      grid-column: 3;
    }

    &__qty {
      grid-column: 1 / 3;
    }

    &__sum {
      grid-column: 3 / 4;
      grid-row: 2;
      justify-self: end;
      align-items: end;
      min-width: 0;
    }
  }
}

.lf-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  border-radius: var(--lf-r-lg);
  background: var(--lf-surface);

  h2 {
    font-size: 24px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__wide {
    grid-column: 1 / -1;
  }

  &__err {
    padding: 12px 16px;
    border-radius: var(--lf-r);
    background: #fde4dc;
    color: #8a2a0f;
    font-weight: 600;
  }

  @media (max-width: 576px) {
    padding: 20px 14px;
  }
}

.lf-check {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  cursor: pointer;

  input {
    flex: none;
    width: 22px;
    height: 22px;
    accent-color: var(--lf-ink);
  }
}

.lf-promo {
  display: grid;
  grid-template-columns: minmax(0, 260px) auto;
  align-items: end;
  gap: 10px;

  &__note {
    grid-column: 1 / -1;
    color: var(--lf-text);
    font-size: 15px;
  }

  @media (max-width: 375px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.lf-total {
  position: sticky;
  top: 150px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: var(--lf-r-lg);
  box-shadow: inset 0 0 0 1px var(--lf-line);

  h2 {
    font-size: 24px;
  }

  dl {
    display: flex;
    flex-direction: column;
    gap: 8px;

    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }

    dt {
      color: var(--lf-text);
    }

    dd {
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
  }

  &__pay {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
    border-radius: var(--lf-r);
    background: var(--lf-accent-soft);

    b {
      font-size: 30px;
      font-weight: 900;
      font-variant-numeric: tabular-nums;
      line-height: 1.1;
    }

    small {
      color: var(--lf-text);
      font-size: 14px;
      line-height: 1.4;
    }
  }

  &__btn {
    width: 100%;
  }

  &__note {
    color: var(--lf-muted);
    font-size: 14px;
  }

  @media (max-width: 989px) {
    position: static;
  }

  @media (max-width: 576px) {
    padding: 20px 14px;
  }
}
</style>
