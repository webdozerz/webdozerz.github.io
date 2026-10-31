<script lang="ts" setup>
import BpIcon from '~/components/redesign/baltikprodukt/BpIcon.vue'
import BpBuy from '~/components/redesign/baltikprodukt/BpBuy.vue'
import BpPhone from '~/components/redesign/baltikprodukt/BpPhone.vue'

// Список заказа вместо корзины: у оригинала заказывают по телефону и почте, поэтому итог — готовое письмо на sales@.
useSeoMeta({ title: 'Список заказа — Балтик продукт | Концепт редизайна' })

const list = useBaltikproduktList()
const ui = useBaltikproduktUi()
const form = list.form

const copy = async (to?: 'mail') => {
  try {
    await navigator.clipboard.writeText(list.text.value)
  } catch {
    /* буфер обмена может быть недоступен */
  }
  ui.say(
    to === 'mail'
      ? `Демо: на сайте откроется письмо на ${bpContacts.email} с этим текстом. Здесь заказ никуда не отправляется.`
      : 'Текст заказа скопирован — вставьте его в письмо или мессенджер',
  )
}
const popular = ['frozen-1', 'seafood-15', 'canned-2', 'hot-2'].map((id) => bpFind(id)).filter(Boolean) as BpProduct[]
</script>

<template>
  <div class="bp-wrap bp-list">
    <div class="bp-list__head">
      <h1>Список заказа</h1>
      <button v-if="list.count.value" type="button" class="bp-list__clear" @click="list.clear()"><BpIcon name="trash" :size="18" /> Очистить</button>
    </div>

    <div v-if="!list.count.value" class="bp-list__empty">
      <b>Список пока пуст</b>
      <p>Добавляйте позиции из прайса — здесь соберётся заказ с суммой и готовым письмом менеджеру.</p>
      <div class="bp-rows bp-list__popular">
        <div v-for="p in popular" :key="p.id" class="bp-list__pop">
          <span>
            <b>{{ p.name }}</b>
            <small>{{ p.price ? `${bpMoney(bpModePrice(p.price, list.mode.value))} за ${bpUnit(p)}` : 'цена у менеджера' }}</small>
          </span>
          <BpBuy :product="p" small />
        </div>
      </div>
      <NuxtLink :to="bpSectionPath()" class="bp-btn">Открыть прайс <BpIcon name="arrow" :size="20" /></NuxtLink>
    </div>

    <div v-else class="bp-list__grid">
      <div class="bp-list__lines">
        <article v-for="l in list.lines.value" :key="l.product.id" class="bp-line">
          <div class="bp-line__name">
            <NuxtLink :to="{ path: bpSectionPath(l.product.section), query: { q: l.product.name } }">{{ l.product.name }}</NuxtLink>
            <small>
              <template v-if="l.product.net">{{ l.product.net }} · </template>{{ bpSection(l.product.section)?.title
              }}<template v-if="l.product.pack"> · {{ bpPackLabel(l.product) }}</template>
            </small>
            <span v-if="l.product.flag === 'order' || l.product.flag === 'wait'" class="bp-flag" :class="`bp-flag--${l.product.flag}`">
              {{ bpFlags[l.product.flag] }} — срок уточнит менеджер
            </span>
          </div>
          <div class="bp-line__qty">
            <BpBuy :product="l.product" />
          </div>
          <div class="bp-line__price">
            <template v-if="l.product.price">
              <span>{{ bpMoney(l.price) }} / {{ bpUnit(l.product) }}</span>
              <small v-if="l.box" class="is-on">цена коробкой</small>
              <small v-else-if="l.product.boxPrice && l.product.pack">коробкой — {{ bpMoney(bpModePrice(l.product.boxPrice, list.mode.value)) }}</small>
            </template>
            <span v-else>цена у менеджера</span>
          </div>
          <b class="bp-line__sum">{{ l.product.price ? bpMoney(l.sum) : '—' }}</b>
          <button type="button" class="bp-iconbtn bp-line__del" aria-label="Убрать из списка" @click="list.setQty(l.product.id, 0)">
            <BpIcon name="close" :size="20" />
          </button>
        </article>
      </div>

      <aside class="bp-list__side">
        <div class="bp-sum">
          <div class="bp-sum__total">
            <span>Итого</span>
            <b>{{ bpMoney(list.total.value) }}</b>
          </div>
          <p class="bp-sum__meta">
            {{ list.count.value }} поз.<template v-if="list.kg.value"> · весовых {{ bpNum(list.kg.value) }} кг</template
            ><template v-if="list.unknown.value"> · {{ list.unknown.value }} без цены</template>
          </p>
          <div class="bp-seg">
            <button type="button" :class="{ 'is-on': list.mode.value === 'opt' }" @click="list.mode.value = 'opt'">Опт</button>
            <button type="button" :class="{ 'is-on': list.mode.value === 'retail' }" @click="list.mode.value = 'retail'">Розница +3&nbsp;%</button>
          </div>

          <div class="bp-seg">
            <button type="button" :class="{ 'is-on': form.buyer === 'company' }" @click="form.buyer = 'company'">Организация</button>
            <button type="button" :class="{ 'is-on': form.buyer === 'person' }" @click="form.buyer = 'person'">Частное лицо</button>
          </div>
          <label class="bp-field">
            <span>{{ form.buyer === 'company' ? 'Организация или ИП' : 'Как к вам обращаться' }}</span>
            <input v-model="form.name" :placeholder="form.buyer === 'company' ? 'ООО «Рыбный двор»' : 'Имя'" />
          </label>
          <label class="bp-field">
            <span>Телефон</span>
            <BpPhone v-model="form.phone" />
          </label>
          <div class="bp-seg">
            <button type="button" :class="{ 'is-on': form.way === 'delivery' }" @click="form.way = 'delivery'">Доставка</button>
            <button type="button" :class="{ 'is-on': form.way === 'pickup' }" @click="form.way = 'pickup'">Заберу сам</button>
          </div>
          <label v-if="form.way === 'delivery'" class="bp-field">
            <span>Адрес доставки</span>
            <input v-model="form.address" placeholder="Город, улица, дом" />
          </label>
          <p v-else class="bp-sum__pickup"><BpIcon name="pin" :size="18" /> {{ bpContacts.address }}, ежедневно с 8:00</p>
          <label class="bp-field">
            <span>Комментарий</span>
            <textarea v-model="form.comment" placeholder="Нужны ветеринарные документы, удобное время…" />
          </label>
        </div>

        <div class="bp-letter">
          <div class="bp-letter__head">
            <BpIcon name="mail" :size="20" />
            <span>
              <b>Письмо менеджеру</b>
              <small>кому: {{ bpContacts.email }}</small>
            </span>
          </div>
          <pre>{{ list.text.value }}</pre>
          <div class="bp-letter__actions">
            <button type="button" class="bp-btn" @click="copy('mail')"><BpIcon name="mail" :size="20" /> Отправить на почту</button>
            <button type="button" class="bp-btn bp-btn--line" @click="copy()"><BpIcon name="copy" :size="20" /> Скопировать</button>
            <a :href="bpContacts.phones[0].href" class="bp-btn bp-btn--line"><BpIcon name="phone" :size="20" /> Продиктовать</a>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.bp-list {
  padding-top: 28px;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;

    h1 {
      font-size: clamp(28px, 2.8vw, 38px);
      font-weight: 800;
    }
  }
  &__clear {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--bp-muted);
    font-weight: 600;

    &:hover {
      color: var(--bp-red);
    }
  }
  &__empty {
    display: grid;
    justify-items: start;
    gap: 14px;
    max-width: 760px;
    padding: 32px;
    border-radius: var(--bp-R);
    background: var(--bp-surface);

    > b {
      font-size: 22px;
    }
    > p {
      color: var(--bp-muted);
    }
  }
  &__popular {
    width: 100%;
    background: #fff;
  }
  &__pop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 12px;

    > span {
      display: grid;
      min-width: 0;
    }
    b {
      font-weight: 600;
      line-height: 1.35;
    }
    small {
      color: var(--bp-muted);
    }
    .bp-buy {
      flex: none;
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 400px;
    gap: 28px;
    align-items: start;
  }
  &__lines {
    display: grid;
    gap: 4px;
    padding: 8px;
    border: 1px solid var(--bp-line);
    border-radius: var(--bp-R);
  }
  &__side {
    display: grid;
    gap: 16px;
  }

  @media (max-width: 1199px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr) 360px;
      gap: 20px;
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
  @media (max-width: 576px) {
    padding-top: 18px;

    &__empty {
      padding: 22px 16px;
    }
    &__pop {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
    }
  }
}

.bp-line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px 150px 110px 44px;
  align-items: start;
  gap: 16px;
  padding: 14px 10px 14px 14px;
  border-radius: 16px;

  &:hover {
    background: #f7f9fb;
  }
  &__name {
    display: grid;
    gap: 3px;
    padding-top: 2px;
    justify-items: start;
    min-width: 0;

    a {
      font-weight: 600;
      line-height: 1.35;

      &:hover {
        color: var(--bp-accent);
      }
    }
    small {
      color: var(--bp-muted);
      font-size: 13px;
    }
  }
  &__qty .bp-buy {
    flex-wrap: wrap;
  }
  &__price {
    display: grid;
    font-size: 14px;

    small {
      color: var(--bp-muted);
      font-size: 12px;

      &.is-on {
        color: var(--bp-green);
        font-weight: 600;
      }
    }
  }
  &__sum {
    text-align: right;
    font-size: 17px;
    white-space: nowrap;
  }
  &__price,
  &__sum {
    min-height: 44px;
    align-content: center;
  }
  &__sum {
    display: grid;
  }

  @media (max-width: 1400px) {
    grid-template-columns: minmax(0, 1fr) 170px 110px 44px;
    grid-template-areas: 'name qty sum del' 'name qty price del';
    row-gap: 2px;

    &__name {
      grid-area: name;
    }
    &__qty {
      grid-area: qty;
    }
    &__price {
      grid-area: price;
      text-align: right;
    }
    &__sum {
      grid-area: sum;
    }
    &__del {
      grid-area: del;
    }
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 44px;
    grid-template-areas: 'name name del' 'qty qty qty' 'price sum sum';
    gap: 10px;
    padding: 12px;

    &__price {
      text-align: left;
    }
  }
}

.bp-sum {
  display: grid;
  gap: 14px;
  padding: 24px;
  border-radius: var(--bp-R);
  background: var(--bp-surface);

  &__total {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;

    span {
      font-size: 18px;
      font-weight: 600;
    }
    b {
      font-family: 'Inter Tight', sans-serif;
      font-size: 30px;
      font-weight: 800;
      white-space: nowrap;
    }
  }
  &__meta {
    margin-top: -8px;
    color: var(--bp-muted);
    font-size: 14px;
  }
  &__pickup {
    display: flex;
    gap: 8px;
    font-size: 14px;

    svg {
      flex: none;
      color: var(--bp-accent);
    }
  }
  .bp-seg {
    background: #fff;

    button.is-on {
      background: var(--bp-soft);
      color: var(--bp-accent);
      box-shadow: none;
    }
  }

  @media (max-width: 576px) {
    padding: 20px 16px;
  }
}

.bp-letter {
  padding: 20px;
  border: 1px solid var(--bp-line);
  border-radius: var(--bp-R);

  &__head {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--bp-accent);

    span {
      display: grid;
      color: var(--bp-ink);
      line-height: 1.3;
    }
    small {
      color: var(--bp-muted);
    }
  }
  pre {
    max-height: 280px;
    overflow: auto;
    margin: 14px 0;
    padding: 14px;
    border-radius: 12px;
    background: var(--bp-surface);
    font-family: Inter, sans-serif;
    font-size: 13px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }
  &__actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 8px;

    .bp-btn:first-child {
      grid-column: 1 / -1;
    }
    .bp-btn {
      padding: 0 12px;
    }
  }

  @media (max-width: 375px) {
    &__actions {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
