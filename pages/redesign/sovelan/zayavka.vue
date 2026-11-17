<script lang="ts" setup>
// Заявка = basket.php оригинала: фото, название, раздел, «N шт.», вес позиции, общий вес; «Изменить» и «Удалить» — прямо в строке.
// Оформление — те же два обязательных поля: телефон и «ИП или ООО». Отправка — демо.
import { svCatById, svContacts, svImg, svNotes, svPath, svPcs, svWeight } from '~/utils/sovelan'
import { svKg, useSvOrder } from '~/composables/useSovelan'
import SvIcon from '~/components/redesign/sovelan/SvIcon.vue'
import SvPhone from '~/components/redesign/sovelan/SvPhone.vue'

useSeoMeta({ title: 'Заявка — Ореховые Эланки и Виланки | Концепт редизайна' })
const order = useSvOrder()
const form = reactive({ phone: '', org: '', tried: false })
const sent = ref<null | { n: number; pcs: number; g: number }>(null)
const phoneOk = computed(() => form.phone.replace(/\D/g, '').length === 11)
const orgOk = computed(() => form.org.trim().length > 1)
const submit = () => {
  form.tried = true
  if (!phoneOk.value || !orgOk.value || !order.count.value) return
  sent.value = { n: order.count.value, pcs: order.pcs.value, g: order.grams.value }
  order.clear()
}
const onQty = (id: number, e: Event) => {
  const v = parseInt((e.target as HTMLInputElement).value.replace(/\D/g, ''), 10)
  if (!Number.isNaN(v) && v > 0) order.set(id, v)
}
const onQtyBlur = (id: number, e: Event) => {
  ;(e.target as HTMLInputElement).value = String(order.qty(id))
}
</script>

<template>
  <div class="sv-wrap sv-order">
    <nav class="sv-crumbs" aria-label="Навигация">
      <NuxtLink :to="svPath('/')">Главная</NuxtLink><span>/</span><span>Заявка</span>
    </nav>

    <div v-if="sent" class="sv-order__done">
      <span class="sv-order__doneic"><SvIcon name="check" /></span>
      <h1>Заявка отправлена</h1>
      <p>
        {{ sent.n }} {{ svPcs(sent.n) }}, {{ sent.pcs }} шт., общий вес {{ svKg(sent.g) }}. Телефон для связи: {{ form.phone }}, {{ form.org }}. Это демо: в концепте заявка
        никуда не уходит.
      </p>
      <NuxtLink :to="svPath('/katalog/')" class="sv-btn">Вернуться в каталог</NuxtLink>
    </div>

    <template v-else>
      <h1 class="sv-order__title">Заявка</h1>
      <div v-if="!order.count.value" class="sv-order__empty">
        <b>Пока вы ничего не добавили в заявку, но это нужно исправить :)</b>
        <p>Выберите коллекцию, укажите количество и нажмите «В заявку» — общий вес заказа посчитается сам.</p>
        <NuxtLink :to="svPath('/katalog/')" class="sv-btn"><SvIcon name="grid" />Перейти в каталог</NuxtLink>
      </div>

      <div v-else class="sv-order__layout">
        <div class="sv-order__rows">
          <article v-for="r in order.rows.value" :key="r.p.id" class="sv-row">
            <img :src="svImg(r.p.i)" :alt="r.p.t" width="300" height="300" class="sv-row__img" />
            <div class="sv-row__name">
              <small>{{ r.p.b ? `${r.p.b}®` : 'Созвездие вкуса' }}</small>
              <b>{{ r.p.t }}</b>
              <span>{{ svCatById(r.p.c[0])?.name }} · {{ svWeight(r.p.w) }}</span>
            </div>
            <div class="sv-qty sv-row__qty" role="group" :aria-label="`Количество: ${r.p.t}`">
              <button type="button" class="sv-qty__b" aria-label="Меньше" @click="order.set(r.p.id, Math.max(1, r.q - 1))"><SvIcon name="minus" /></button>
              <label class="sv-qty__v">
                <input :value="r.q" inputmode="numeric" :style="{ width: `${String(r.q).length + 0.6}ch` }" aria-label="Штук" @input="onQty(r.p.id, $event)" @blur="onQtyBlur(r.p.id, $event)" />
                <span>шт.</span>
              </label>
              <button type="button" class="sv-qty__b" aria-label="Больше" @click="order.set(r.p.id, r.q + 1)"><SvIcon name="plus" /></button>
            </div>
            <div class="sv-row__w"><b>{{ svKg(r.q * r.p.w) }}</b><small>вес позиции</small></div>
            <button type="button" class="sv-iconbtn sv-row__del" :aria-label="`Удалить ${r.p.t}`" @click="order.set(r.p.id, 0)"><SvIcon name="trash" /></button>
          </article>
          <div class="sv-order__more">
            <NuxtLink :to="svPath('/katalog/')" class="sv-btn sv-btn--line"><SvIcon name="left" />Добавить ещё</NuxtLink>
            <button type="button" class="sv-order__clear" @click="order.clear()">Очистить заявку</button>
          </div>
        </div>

        <form class="sv-order__form" novalidate @submit.prevent="submit">
          <dl class="sv-order__sum">
            <div><dt>Позиций</dt><dd>{{ order.count.value }}</dd></div>
            <div><dt>Штук</dt><dd>{{ order.pcs.value }}</dd></div>
            <div class="sv-order__total"><dt>Общий вес заказа</dt><dd>{{ svKg(order.grams.value) }}</dd></div>
          </dl>
          <p class="sv-order__hint"><SvIcon name="scale" /><span>{{ svNotes.weight }}</span></p>
          <label class="sv-field" :class="{ 'is-err': form.tried && !phoneOk }">
            <span>Телефон</span>
            <SvPhone v-model="form.phone" />
            <small v-if="form.tried && !phoneOk">Укажите телефон полностью</small>
          </label>
          <label class="sv-field" :class="{ 'is-err': form.tried && !orgOk }">
            <span>ИП или ООО</span>
            <input v-model="form.org" type="text" autocomplete="organization" placeholder="ООО «Ромашка» или ИП Иванов" />
            <small v-if="form.tried && !orgOk">Укажите ваше ИП или ООО</small>
          </label>
          <button type="submit" class="sv-btn sv-order__send">Отправить заявку</button>
          <p class="sv-order__consent">{{ svNotes.consent }}</p>
          <p class="sv-order__opt">
            Опт — по договору. Вопросы по заявке: <a :href="`tel:${svContacts.phones[0].tel}`">{{ svContacts.phones[0].label }}</a>,
            <a :href="`mailto:${svContacts.sales}`">{{ svContacts.sales }}</a>
          </p>
        </form>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.sv-order {
  &__title {
    margin: 16px 0 22px !important;
    font-size: clamp(28px, 3vw, 40px);
  }
  &__empty,
  &__done {
    display: grid;
    justify-items: start;
    gap: 12px;
    padding: 32px;
    border-radius: var(--sv-R);
    background: var(--sv-surface);
    b {
      font: 800 20px/1.3 var(--sv-head);
      color: var(--sv-dark);
    }
    p {
      color: var(--sv-muted);
    }
  }
  &__done {
    margin-top: 24px;
    background: var(--sv-soft);
    h1 {
      font-size: 32px;
    }
  }
  &__doneic {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: var(--sv-acc);
    color: #fff;
  }
  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 28px;
    align-items: start;
  }
  &__rows {
    display: grid;
    gap: 10px;
  }
  &__more {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 8px;
  }
  &__clear {
    border: 0;
    background: none;
    color: var(--sv-muted);
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
    &:hover {
      color: var(--sv-acc);
    }
  }
  &__form {
    position: sticky;
    top: calc(var(--sv-headh) + 16px);
    display: grid;
    gap: 14px;
    padding: 24px;
    border-radius: var(--sv-R);
    background: var(--sv-surface);
    .sv-field input {
      width: 100%;
    }
  }
  dl.sv-order__sum {
    display: grid;
    gap: 8px;
    margin: 0;
    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    dt {
      color: var(--sv-muted);
    }
    dd {
      margin: 0;
      font-weight: 700;
      color: var(--sv-dark);
      font-variant-numeric: tabular-nums;
    }
  }
  &__total {
    padding-top: 10px;
    border-top: 1px solid var(--sv-line);
    dd {
      font: 800 26px/1 var(--sv-head) !important;
      color: var(--sv-acc) !important;
    }
    dt {
      align-self: center;
    }
  }
  &__hint {
    display: flex;
    gap: 8px;
    font-size: 13px;
    color: var(--sv-muted);
    .sv-icon {
      width: 18px;
      height: 18px;
      color: var(--sv-acc);
    }
  }
  &__send {
    width: 100%;
    min-height: 52px;
    font-size: 16px;
  }
  &__consent,
  &__opt {
    font-size: 12px;
    color: var(--sv-muted);
    a {
      white-space: nowrap;
      color: var(--sv-dark);
      font-weight: 600;
    }
  }
}
.sv-row {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr) 150px 100px 44px;
  grid-template-areas: 'img name qty w del';
  align-items: center;
  gap: 16px;
  padding: 10px 12px 10px 10px;
  border: 1px solid var(--sv-line);
  border-radius: 18px;
  &__img {
    grid-area: img;
    width: 76px;
    height: 76px;
    border-radius: 12px;
    object-fit: cover;
  }
  &__name {
    grid-area: name;
    display: grid;
    gap: 2px;
    min-width: 0;
    small {
      font-size: 12px;
      font-weight: 600;
      color: var(--sv-acc);
    }
    b {
      font: 800 17px/1.25 var(--sv-head);
      color: var(--sv-dark);
    }
    span {
      font-size: 13px;
      color: var(--sv-muted);
    }
  }
  &__qty {
    grid-area: qty;
  }
  &__w {
    grid-area: w;
    display: grid;
    text-align: right;
    b {
      color: var(--sv-dark);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    small {
      font-size: 12px;
      color: var(--sv-muted);
    }
  }
  &__del {
    grid-area: del;
    background: none;
    color: var(--sv-muted);
    &:hover {
      color: #c03535;
    }
  }
}
@media (max-width: 1199px) {
  .sv-order__layout {
    grid-template-columns: minmax(0, 1fr) 330px;
  }
  .sv-row {
    grid-template-columns: 64px minmax(0, 1fr) 140px 44px;
    grid-template-areas: 'img name name del' 'img qty w w';
    row-gap: 8px;
    &__img {
      width: 64px;
      height: 64px;
    }
  }
}
@media (max-width: 989px) {
  .sv-order__layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .sv-order__form {
    position: static;
  }
}
@media (max-width: 576px) {
  .sv-order__empty,
  .sv-order__done,
  .sv-order__form {
    padding: 20px 16px;
  }
  .sv-order__more {
    flex-wrap: wrap;
  }
  .sv-row {
    grid-template-columns: 56px minmax(0, 1fr) auto;
    grid-template-areas: 'img name del' 'qty qty w';
    gap: 8px 12px;
    &__img {
      width: 56px;
      height: 56px;
    }
  }
}
</style>
