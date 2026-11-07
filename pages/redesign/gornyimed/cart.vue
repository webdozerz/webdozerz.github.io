<script lang="ts" setup>
import GmIcon from '~/components/redesign/gornyimed/GmIcon.vue'
import GmQty from '~/components/redesign/gornyimed/GmQty.vue'
import GmPhone from '~/components/redesign/gornyimed/GmPhone.vue'

useSeoMeta({ title: 'Оформление заказа | Пасеки Соловьёвых, концепт редизайна' })

const shop = useGornyimedShop()
const form = shop.form
const tried = ref(false)
const okName = computed(() => form.value.name.trim().length > 1)
const okPhone = computed(() => form.value.phone.replace(/\D/g, '').length === 11)
const ok = computed(() => okName.value && okPhone.value && shop.count.value > 0)

const groups = computed(() =>
  [
    { id: 'jar', title: 'Мёд в банках', lines: shop.jars.value },
    { id: 'bulk', title: 'Опт куботейнерами', lines: shop.bulk.value },
  ].filter((g) => g.lines.length),
)
const send = () => {
  tried.value = true
  if (!ok.value) return
  shop.submit()
  tried.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
onBeforeUnmount(() => {
  shop.done.value = null
})
</script>

<template>
  <div class="gm-wrap gm-cart">
    <nav class="gm-crumbs" aria-label="Навигация">
      <NuxtLink :to="gmPath()">Главная</NuxtLink>
      <span>Заказ</span>
    </nav>

    <div v-if="shop.done.value" class="gm-cart__done">
      <GmIcon name="check" :size="44" />
      <h1>Заказ № {{ shop.done.value.id }} принят</h1>
      <p>
        {{ shop.done.value.name ? `${shop.done.value.name}, с` : 'С' }}пасибо! Сергей Владимирович перезвонит, уточнит отправку и пришлёт реквизиты для оплаты. Это демо: заказ
        никуда не отправлен.
      </p>
      <NuxtLink :to="gmPath('/shop')" class="gm-btn gm-btn--main">Вернуться в магазин</NuxtLink>
    </div>

    <template v-else>
      <h1 class="gm-title">Оформление заказа</h1>

      <div v-if="!shop.count.value" class="gm-cart__empty">
        <p>В корзине пока ничего нет.</p>
        <NuxtLink :to="gmPath('/shop')" class="gm-btn gm-btn--main">Выбрать мёд</NuxtLink>
      </div>

      <div v-else class="gm-cart__grid">
        <div class="gm-cart__lines">
          <section v-for="g in groups" :key="g.id" class="gm-cart__group">
            <h2>{{ g.title }}</h2>
            <ul>
              <li v-for="l in g.lines" :key="l.key" class="gm-line">
                <NuxtLink :to="l.to" class="gm-line__img" :class="{ 'gm-cube': !l.img }">
                  <img v-if="l.img" :src="l.img" alt="" loading="lazy" />
                  <template v-else><GmIcon name="cube" :size="30" /><small>{{ l.cube ? `${l.cube} кг` : 'куб.' }}</small></template>
                </NuxtLink>
                <div class="gm-line__info">
                  <NuxtLink :to="l.to" class="gm-line__title">{{ l.title }}</NuxtLink>
                  <span>{{ l.sub }}</span>
                </div>
                <div class="gm-line__unit">{{ l.unit !== null ? gmMoney(l.unit) : '—' }}</div>
                <GmQty
                  class="gm-line__qty"
                  :model-value="l.qty"
                  :min="0"
                  :unit="l.kind === 'bulk' ? 'куб.' : 'шт'"
                  @update:model-value="shop.setQty(l.key, $event)"
                />
                <div class="gm-line__sum">{{ l.sum !== null ? gmMoney(l.sum) : 'по звонку' }}</div>
                <button type="button" class="gm-iconbtn gm-line__del" aria-label="Удалить" @click="shop.remove(l.key)"><GmIcon name="trash" :size="19" /></button>
              </li>
            </ul>
          </section>
          <NuxtLink :to="gmPath('/shop')" class="gm-link"><GmIcon name="left" :size="17" />Вернуться и положить ещё</NuxtLink>
        </div>

        <form class="gm-cart__form gm-panel" novalidate @submit.prevent="send">
          <h2>Получатель</h2>
          <label class="gm-field" :class="{ 'is-bad': tried && !okName }">
            <span>Имя *</span>
            <input v-model="form.name" autocomplete="name" placeholder="Как к вам обращаться" />
          </label>
          <label class="gm-field" :class="{ 'is-bad': tried && !okPhone }">
            <span>Телефон *</span>
            <GmPhone v-model="form.phone" />
          </label>
          <label class="gm-field">
            <span>E-mail</span>
            <input v-model="form.email" type="email" autocomplete="email" placeholder="Для счёта и трек-номера" />
          </label>
          <label class="gm-field">
            <span>Адрес доставки</span>
            <input v-model="form.address" autocomplete="street-address" placeholder="Город, улица, дом или пункт выдачи" />
          </label>
          <label class="gm-field">
            <span>Комментарий</span>
            <textarea v-model="form.comment" placeholder="Удобная служба доставки, время для звонка" />
          </label>

          <ul class="gm-cart__terms">
            <li v-for="t in gmShipping" :key="t"><GmIcon name="check" :size="17" />{{ t }}</li>
          </ul>

          <div class="gm-cart__total">
            <span>{{ gmGoods(shop.count.value) }}</span>
            <b>{{ gmMoney(shop.total.value) }}</b>
          </div>
          <p v-if="shop.hasUnpriced.value" class="gm-cart__hint">Без опта по гречишному и разнотравью — его цену подтвердим по телефону.</p>
          <p v-if="tried && !ok" class="gm-cart__err">Заполните имя и телефон — по ним свяжемся насчёт отправки.</p>
          <button type="submit" class="gm-btn gm-btn--main gm-btn--wide">Оформить заказ</button>
          <p class="gm-cart__small">Регистрация не нужна. Доставку посчитаем после звонка.</p>
        </form>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.gm-cart {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 420px;
    gap: 32px;
    align-items: start;
    margin-top: 28px;

    @media (max-width: 1199px) {
      grid-template-columns: minmax(0, 1fr) 380px;
    }
    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  &__lines {
    display: grid;
    gap: 24px;
    justify-items: start;
  }
  &__group {
    width: 100%;

    h2 {
      margin-bottom: 6px;
      font-size: 22px;
    }
  }
  &__form {
    position: sticky;
    top: 146px;
    display: grid;
    gap: 14px;

    h2 {
      font-size: 22px;
    }
    .gm-field input,
    .gm-field textarea {
      background: #fff;
    }
    @media (max-width: 989px) {
      position: static;
    }
  }
  ul.gm-cart__terms {
    display: grid;
    gap: 6px;
    padding: 12px 0;
    border-top: 1px solid var(--gm-line);

    li {
      display: flex;
      gap: 8px;
      font-size: 13.5px;
      color: var(--gm-muted);

      .gm-icon {
        margin-top: 2px;
        color: var(--gm-green);
      }
    }
  }
  &__total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-weight: 600;

    b {
      font-size: 28px;
      color: var(--gm-ink);
    }
  }
  &__hint,
  &__small {
    font-size: 13px;
    color: var(--gm-muted);
  }
  &__err {
    font-size: 14px;
    color: #b03a2e;
    font-weight: 600;
  }
  &__empty,
  &__done {
    display: grid;
    justify-items: start;
    gap: 16px;
    margin-top: 28px;
    color: var(--gm-muted);
  }
  &__done {
    justify-items: center;
    max-width: 620px;
    margin: 48px auto 0;
    text-align: center;

    .gm-icon {
      color: var(--gm-green);
    }
    h1 {
      font-size: clamp(28px, 3.4vw, 38px);
    }
  }
  .gm-field.is-bad input {
    border-color: #c0392b;
  }
}
.gm-line {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 90px auto 110px 44px;
  grid-template-areas: 'img info unit qty sum del';
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--gm-line);

  &__img {
    grid-area: img;
    display: grid;
    place-items: center;
    width: 72px;
    height: 90px;
    border-radius: var(--gm-r);
    overflow: hidden;
    background: var(--gm-pack);
    color: #fff;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__info {
    grid-area: info;
    display: grid;
    gap: 2px;

    span {
      font-size: 13.5px;
      color: var(--gm-muted);
    }
  }
  &__title {
    font-weight: 600;
    color: var(--gm-ink);

    &:hover {
      color: var(--gm-accent);
    }
  }
  &__unit {
    grid-area: unit;
    color: var(--gm-muted);
    white-space: nowrap;
    text-align: right;
  }
  &__qty {
    grid-area: qty;
  }
  &__sum {
    grid-area: sum;
    font-weight: 700;
    color: var(--gm-ink);
    white-space: nowrap;
    text-align: right;
  }
  &__del {
    grid-area: del;
    color: var(--gm-muted);
  }

  @media (max-width: 1199px) {
    grid-template-columns: 72px minmax(0, 1fr) auto 100px 44px;
    grid-template-areas: 'img info qty sum del';

    &__unit {
      display: none;
    }
  }
  @media (max-width: 576px) {
    grid-template-columns: 64px minmax(0, 1fr) minmax(0, 1fr) 40px;
    grid-template-areas:
      'img info info del'
      'img qty sum sum';
    row-gap: 10px;
    align-items: start;

    &__img {
      width: 64px;
      height: 80px;
    }
    &__sum {
      align-self: center;
    }
  }
}
</style>
