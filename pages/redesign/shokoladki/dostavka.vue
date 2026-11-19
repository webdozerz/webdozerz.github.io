<script lang="ts" setup>
import { skPath, skDeliveryZones, skContacts, skRub, SK_FREE_FROM, skCourierPrice } from '~/utils/shokoladki'
import { useSkStore, useSkUi } from '~/composables/useShokoladki'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'

useSeoMeta({ title: 'Доставка и оплата — АПРИОРИ | Концепт редизайна' })
const store = useSkStore()
const ui = useSkUi()
const to = (p: string) => skPath(p)
// Быстрый расчёт: город из шапки + сумма заказа
const sum = ref(2500)
const price = computed(() => skCourierPrice(store.cityInfo.value.zone, sum.value))
</script>

<template>
  <div class="sk-wrap sk-page">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>Доставка и оплата</span>
    </nav>
    <div class="sk-pagehead">
      <h1 class="sk-h1">Доставка и оплата</h1>
      <p>Заказы с сайта обрабатываем с 10:00 до 18:00 с понедельника по пятницу. Если вы оформили заказ позже — позвоним для подтверждения на следующее утро.</p>
    </div>

    <div class="sk-calc">
      <div class="sk-calc__row">
        <span>Город</span>
        <button type="button" class="sk-chip is-on" @click="ui.modal.value = 'city'"><SkIcon name="pin" />{{ store.city.value }}</button>
      </div>
      <label class="sk-calc__row">
        <span>Сумма заказа</span>
        <input v-model.number="sum" type="range" min="500" max="10000" step="100" aria-label="Сумма заказа" />
        <b>{{ skRub(sum) }}</b>
      </label>
      <div class="sk-calc__res">
        Доставка курьером:
        <b v-if="price === 0">бесплатно</b>
        <b v-else-if="store.cityInfo.value.zone === 'msk'">{{ skRub(price || 0) }}</b>
        <b v-else>от {{ skRub(price || 0) }}</b>
        <small v-if="store.cityInfo.value.zone === 'msk' && sum < SK_FREE_FROM">— от {{ skRub(SK_FREE_FROM) }} бесплатно</small>
      </div>
    </div>

    <section>
      <h2 class="sk-h2 sk-page__h">Доставка по Москве и области для физических лиц</h2>
      <div class="sk-zones">
        <div v-for="z in skDeliveryZones" :key="z.n" class="sk-zone">
          <b>{{ z.n }}</b>
          <span>{{ z.price }}</span>
          <small>{{ z.time }}</small>
        </div>
      </div>
      <div class="sk-text sk-page__text">
        <p>В предпраздничные дни интервал доставки увеличен. Курьерская служба работает с 9:00 до 21:00 без выходных, офис — пн–пт с 10:00 до 18:00.</p>
        <p>Доставка в пункты выдачи 5Post — в магазинах «Пятёрочка» и «Перекрёсток», срок — до 3 дней.</p>
        <p>Почтой: как только посылка придёт, курьер созвонится и договорится о дате и времени. Посылка хранится в отделении 30 дней, бесплатно — первые 5 рабочих дней.</p>
      </div>
    </section>

    <section>
      <h2 class="sk-h2 sk-page__h">Способы оплаты</h2>
      <div class="sk-paylist">
        <div class="sk-panel"><SkIcon name="tag" /><b>Наличными</b><p>При доставке курьером — наличными курьеру.</p></div>
        <div class="sk-panel"><SkIcon name="card" /><b>Банковской картой</b><p>Visa, Mastercard, МИР онлайн при оформлении — сервис ЮKassa, данные передаются по защищённому протоколу SSL.</p></div>
        <div class="sk-panel"><SkIcon name="doc" /><b>От юридического лица</b><p>Счёт на организацию — выберите при оформлении заказа. Доставка для юрлиц рассчитывается индивидуально.</p></div>
        <div class="sk-panel is-off"><SkIcon name="star" /><b>Бонусами</b><p>Оплата бонусами временно приостановлена. Акции и скидки на сайте действуют.</p></div>
      </div>
    </section>
    <p class="sk-muted">Вопросы по доставке: <a :href="`tel:${skContacts.shopTel}`">{{ skContacts.shopPhone }}</a>, <a :href="`mailto:${skContacts.email}`">{{ skContacts.email }}</a></p>
  </div>
</template>
