<script lang="ts" setup>
import { OL_FREE, olContacts, olGrams, olPath, olPay, olRub, olSrc, olUnit, olWays } from '~/utils/olimpfish'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'
import OlPhone from '~/components/redesign/olimpfish/OlPhone.vue'
import { useOlShop } from '~/composables/useOlimpfish'

useSeoMeta({ title: 'Корзина — Олимп | Концепт редизайна' })
const shop = useOlShop()

const code = ref('')
const codeMsg = ref('')
const applyCode = () => {
  codeMsg.value = code.value.trim() ? `Купон «${code.value.trim()}» не найден — в демо купоны не проверяются` : 'Введите код купона'
}
const form = reactive({ name: '', phone: '', mail: '', address: '', note: '', pay: 'cash', ok: true })
const order = ref('')
const pickup = computed(() => shop.way.value === 'pickup')
const canOrder = computed(() => shop.count.value > 0 && shop.lack.value === 0)
const grand = computed(() => shop.total.value + shop.fee.value)
const submit = () => {
  if (!canOrder.value) return
  order.value = String(10000 + Math.floor(Math.random() * 89999))
  shop.clear()
  window.scrollTo({ top: 0 })
}
onMounted(() => shop.persist())
</script>

<template>
  <div class="ol-wrap ol-page ol-cart">
    <nav class="ol-crumbs" aria-label="Навигация">
      <NuxtLink :to="olPath('/')">Главная</NuxtLink>
      <span>Корзина</span>
    </nav>

    <div v-if="order" class="ol-empty">
      <span class="ol-done__ic"><OlIcon name="check" /></span>
      <h2>Заказ № {{ order }} оформлен</h2>
      <p>Это демо-версия: заказ никуда не отправлен. На настоящем сайте менеджер перезвонит, уточнит итоговый вес и время доставки. Вопросы — {{ olContacts.phones[0].text }}.</p>
      <NuxtLink :to="olPath('/catalog')" class="ol-btn ol-btn--acc">Вернуться в магазин</NuxtLink>
    </div>

    <template v-else-if="shop.count.value">
      <h1 class="ol-title">Корзина</h1>
      <div class="ol-cart__grid">
        <div class="ol-cart__main">
          <ul class="ol-cart__lines">
            <li v-for="l in shop.lines.value" :key="l.key" class="ol-line">
              <NuxtLink :to="olPath(`/product/${l.p.id}`)" class="ol-line__ph"><img :src="olSrc(l.p.th || l.p.img)" :alt="l.p.n" width="80" height="80" /></NuxtLink>
              <div class="ol-line__name">
                <NuxtLink :to="olPath(`/product/${l.p.id}`)">{{ l.p.n }}</NuxtLink>
                <span>{{ l.p.w ? `${olGrams(l.g)} · ${olRub(l.p.w.kg)}/кг` : olUnit(l.p) }}</span>
              </div>
              <div class="ol-line__price">{{ olRub(l.price) }}</div>
              <div class="ol-qty ol-line__qty">
                <button type="button" aria-label="Меньше" @click="shop.setKey(l.key, l.n - 1)"><OlIcon name="minus" /></button>
                <span>{{ l.n }}&nbsp;шт</span>
                <button type="button" aria-label="Больше" @click="shop.setKey(l.key, l.n + 1)"><OlIcon name="plus" /></button>
              </div>
              <b class="ol-line__sum">{{ olRub(l.sum) }}</b>
              <button type="button" class="ol-line__del" aria-label="Удалить" @click="shop.setKey(l.key, 0)"><OlIcon name="trash" /></button>
            </li>
          </ul>
          <div class="ol-cart__under">
            <form class="ol-cart__coupon" @submit.prevent="applyCode">
              <input v-model="code" placeholder="Код купона" aria-label="Код купона" />
              <button type="submit" class="ol-btn ol-btn--line">Применить купон</button>
            </form>
            <NuxtLink :to="olPath('/catalog')" class="ol-link"><OlIcon name="left" />Вернуться в магазин</NuxtLink>
          </div>
          <p v-if="codeMsg" class="ol-cart__msg">{{ codeMsg }}</p>
          <p v-if="shop.weighted.value" class="ol-cart__weighted"><OlIcon name="knife" />В корзине весовые товары: итоговая сумма может измениться при формировании заказа на складе — менеджер уточнит её по телефону.</p>

          <section class="ol-cart__block">
            <h2>Доставка</h2>
            <div class="ol-ways">
              <label v-for="w in olWays" :key="w.id" class="ol-way" :class="{ 'is-on': shop.way.value === w.id }">
                <input type="radio" name="way" :value="w.id" :checked="shop.way.value === w.id" @change="shop.setWay(w.id)" />
                <span><b>{{ w.name }}</b><small>{{ w.note }}</small></span>
              </label>
            </div>
            <label v-if="shop.w.value.km" class="ol-field ol-cart__km">
              <span>Расстояние от МКАД, км</span>
              <input type="number" :min="shop.w.value.km[0]" :max="shop.w.value.km[1]" :value="shop.kmUse.value" @input="shop.setKm(Number(($event.target as HTMLInputElement).value) || 0)" />
            </label>
          </section>

          <section class="ol-cart__block">
            <h2>Покупатель</h2>
            <form id="ol-order" class="ol-cart__form" @submit.prevent="submit">
              <label class="ol-field"><span>Имя *</span><input v-model="form.name" required autocomplete="name" /></label>
              <label class="ol-field"><span>Телефон *</span><OlPhone v-model="form.phone" required /></label>
              <label class="ol-field"><span>E-mail</span><input v-model="form.mail" type="email" autocomplete="email" /></label>
              <label v-if="!pickup" class="ol-field"><span>Адрес доставки *</span><input v-model="form.address" required autocomplete="street-address" placeholder="Улица, дом, квартира" /></label>
              <label class="ol-field ol-cart__wide"><span>Примечание к заказу</span><textarea v-model="form.note" rows="2" placeholder="Удобное время, домофон, нарезать ломтиками" /></label>
              <div class="ol-cart__wide ol-cart__pay">
                <span>Оплата</span>
                <label v-for="pm in olPay" :key="pm.id" class="ol-way" :class="{ 'is-on': form.pay === pm.id, 'is-off': pm.off }">
                  <input v-model="form.pay" type="radio" name="pay" :value="pm.id" :disabled="pm.off" />
                  <span><b>{{ pm.name }}</b><small>{{ pm.note }}</small></span>
                </label>
              </div>
              <label class="ol-check ol-cart__wide"><input v-model="form.ok" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
            </form>
          </section>
        </div>

        <aside class="ol-sum">
          <h2>Ваш заказ</h2>
          <dl>
            <div><dt>Товары, {{ shop.count.value }} шт</dt><dd>{{ olRub(shop.total.value) }}</dd></div>
            <div><dt>{{ shop.w.value.short }}{{ shop.w.value.km ? `, ${shop.kmUse.value} км` : '' }}</dt><dd>{{ shop.fee.value ? (shop.w.value.id === 'urgent' ? `от ${olRub(shop.fee.value)}` : olRub(shop.fee.value)) : 'бесплатно' }}</dd></div>
            <div class="ol-sum__total"><dt>Итого</dt><dd>{{ olRub(grand) }}</dd></div>
          </dl>
          <div v-if="shop.lack.value" class="ol-sum__lack">
            <p>Доставка — при заказе от {{ olRub(shop.min.value) }}. Добавьте ещё на <b>{{ olRub(shop.lack.value) }}</b> или выберите самовывоз.</p>
            <span class="ol-sum__bar"><i :style="{ width: `${Math.min(100, (shop.total.value / shop.min.value) * 100)}%` }" /></span>
          </div>
          <p v-else-if="shop.way.value === 'near' && shop.total.value < OL_FREE" class="ol-sum__hint">До бесплатной доставки за МКАД — ещё {{ olRub(OL_FREE - shop.total.value) }}</p>
          <button type="submit" form="ol-order" class="ol-btn ol-btn--acc ol-btn--big" :disabled="!canOrder">Оформить заказ</button>
          <p class="ol-sum__note">Онлайн-заказы принимаются 24/7 — «сегодня на завтра». Менеджер перезвонит для подтверждения.</p>
        </aside>
      </div>
    </template>

    <div v-else class="ol-empty">
      <OlIcon name="cart" />
      <h2>Корзина пока пуста</h2>
      <p>Отрежьте нужный вес осетра на главной или загляните в каталог.</p>
      <NuxtLink :to="olPath('/catalog')" class="ol-btn ol-btn--acc">Перейти в каталог</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.ol .ol-cart {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 32px;
    align-items: start;
    margin-top: 14px;
  }
  &__main {
    display: grid;
    gap: 18px;
    min-width: 0;
  }
  ul.ol-cart__lines {
    margin: 0;
    padding: 0;
    display: grid;
    border-top: 1px solid var(--ol-line);
  }
  &__under {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  &__coupon {
    display: flex;
    gap: 8px;
    input {
      width: 200px;
      min-height: 44px;
      padding: 0 14px;
      border: 1px solid var(--ol-line);
      border-radius: var(--ol-r);
      box-sizing: border-box;
      outline: none;
      &:focus {
        border-color: var(--ol-acc);
      }
    }
  }
  &__msg {
    font-size: 14px;
    color: var(--ol-mute);
    margin-top: -8px;
  }
  &__weighted {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--ol-soft);
    font-size: 14px;
    .ol-icon {
      color: var(--ol-acc);
    }
  }
  &__block {
    display: grid;
    gap: 14px;
    padding: 24px;
    border: 1px solid var(--ol-line);
    border-radius: var(--ol-R);
    h2 {
      font-size: 21px;
    }
  }
  &__km {
    max-width: 240px;
  }
  &__form {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 14px;
    align-items: start;
  }
  &__wide {
    grid-column: 1 / -1;
  }
  &__pay {
    display: grid;
    gap: 8px;
    > span {
      font-size: 13px;
      font-weight: 600;
      color: var(--ol-mute);
    }
  }
}
.ol .ol-line {
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr) 90px 130px 100px 40px;
  grid-template-areas: 'ph name price qty sum del';
  gap: 16px;
  align-items: start;
  padding: 16px 0;
  border-bottom: 1px solid var(--ol-line);
  &__ph {
    grid-area: ph;
    width: 80px;
    height: 80px;
    border: 1px solid var(--ol-line);
    border-radius: 12px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  &__name {
    grid-area: name;
    display: grid;
    gap: 4px;
    align-self: center;
    a {
      font-weight: 600;
      color: var(--ol-ink);
      line-height: 1.35;
      &:hover {
        color: var(--ol-acc);
      }
    }
    span {
      font-size: 13.5px;
      color: var(--ol-mute);
    }
  }
  &__price,
  &__sum,
  &__del {
    min-height: 44px;
    display: grid;
    align-content: center;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    align-self: center;
  }
  &__price {
    grid-area: price;
    color: var(--ol-mute);
  }
  &__qty {
    grid-area: qty;
    align-self: center;
  }
  &__sum {
    grid-area: sum;
    text-align: right;
    color: var(--ol-ink);
    font-size: 16px;
  }
  &__del,
  &__del:focus {
    grid-area: del;
    width: 40px;
    place-items: center;
    border: 0;
    border-radius: 10px;
    background: none;
    color: var(--ol-mute);
    &:hover {
      background: var(--ol-surf);
      color: #c0392b;
    }
  }
}
.ol .ol-ways {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.ol .ol-way {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 13px 14px;
  border: 1px solid var(--ol-line);
  border-radius: 12px;
  cursor: pointer;
  input {
    width: 18px;
    height: 18px;
    margin: 2px 0 0;
    accent-color: var(--ol-acc);
    flex: none;
  }
  span {
    display: grid;
    gap: 2px;
  }
  b {
    font-size: 14.5px;
    color: var(--ol-ink);
  }
  small {
    font-size: 13px;
    color: var(--ol-mute);
  }
  &.is-on {
    border-color: var(--ol-acc);
    background: var(--ol-soft);
  }
  &.is-off {
    opacity: 0.6;
    cursor: default;
  }
}
.ol .ol-sum {
  position: sticky;
  top: calc(var(--ol-bar) + 20px);
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: var(--ol-R);
  background: var(--ol-surf);
  h2 {
    font-size: 21px;
  }
  dl {
    display: grid;
    gap: 10px;
    > div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
  }
  dt {
    color: var(--ol-mute);
  }
  dd {
    font-weight: 700;
    color: var(--ol-ink);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  dl > div.ol-sum__total {
    padding-top: 12px;
    border-top: 1px solid var(--ol-line);
    align-items: baseline;
    dt {
      color: var(--ol-ink);
      font-weight: 700;
    }
    dd {
      font-size: 26px;
      font-weight: 800;
    }
  }
  &__lack {
    display: grid;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 12px;
    background: #fff;
    font-size: 14px;
    b {
      color: var(--ol-acc);
      white-space: nowrap;
    }
  }
  &__bar {
    height: 6px;
    border-radius: 3px;
    background: var(--ol-surf);
    overflow: hidden;
    i {
      display: block;
      height: 100%;
      background: var(--ol-hi);
    }
  }
  &__hint {
    font-size: 14px;
    color: var(--ol-green);
    font-weight: 600;
  }
  .ol-btn {
    width: 100%;
  }
  &__note {
    font-size: 13px;
    color: var(--ol-mute);
  }
}
@media (max-width: 1199px) {
  .ol .ol-cart__grid {
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 24px;
  }
  .ol .ol-line {
    grid-template-columns: 72px minmax(0, 1fr) 130px 100px;
    grid-template-areas: 'ph name name del' 'ph price qty sum';
    row-gap: 8px;
    &__del {
      justify-self: end;
    }
    &__ph {
      width: 72px;
      height: 72px;
    }
  }
  .ol .ol-ways {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 989px) {
  .ol .ol-cart__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .ol .ol-sum {
    position: static;
  }
}
@media (max-width: 576px) {
  .ol .ol-line {
    grid-template-columns: 64px minmax(0, 1fr) auto 40px;
    grid-template-areas: 'ph name name del' 'qty qty sum sum';
    &__ph {
      width: 64px;
      height: 64px;
    }
    &__price {
      display: none;
    }
    &__qty {
      width: 140px;
    }
  }
  .ol .ol-cart {
    &__block {
      padding: 18px;
    }
    &__form {
      grid-template-columns: minmax(0, 1fr);
    }
    &__coupon {
      width: 100%;
      input {
        flex: 1;
        width: 0;
      }
    }
  }
}
</style>
