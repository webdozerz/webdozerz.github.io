<script lang="ts" setup>
import BkIcon from '~/components/redesign/bukety/BkIcon.vue'

useSeoMeta({ title: 'Доставка и оплата — Любимые Букеты | Концепт редизайна' })
</script>

<template>
  <div class="bk-wrap bk-info">
    <nav class="bk-crumbs">
      <NuxtLink :to="bkPath()">Главная</NuxtLink>
      <span>Доставка и оплата</span>
    </nav>
    <h1>Доставка и оплата</h1>
    <p class="bk-info__lead">Доставляем круглосуточно, без выходных. По Томску — бесплатно и в течение часа после заказа.</p>

    <div class="bk-info__grid">
      <section class="bk-info__block bk-info__wide">
        <h2><BkIcon name="truck" /> Зоны доставки</h2>
        <ul class="bk-info__zones">
          <li v-for="z in bkZones" :key="z.id">
            <span>
              <b>{{ z.title }}</b>
              <small>{{ z.text }}</small>
            </span>
            <em>{{ z.price === null ? 'по телефону' : z.price ? bkRub(z.price) : 'бесплатно' }}</em>
          </li>
        </ul>
      </section>

      <section class="bk-info__block">
        <h2><BkIcon name="gift" /> Бесплатно к каждому заказу</h2>
        <ul class="bk-info__list">
          <li v-for="x in bkFree" :key="x.title">
            <BkIcon :name="x.icon" />
            <span><b>{{ x.title }}</b> — {{ x.text }}</span>
          </li>
          <li><BkIcon name="clock" /><span><b>Экспресс-доставка</b> — в течение часа</span></li>
        </ul>
      </section>

      <section class="bk-info__block">
        <h2><BkIcon name="mask" /> Без адреса и анонимно</h2>
        <p>Если не знаете адрес, укажите телефон получателя — курьер позвонит и договорится о месте и времени.</p>
        <p>Анонимно: курьер не назовёт отправителя, а открытку можно оставить без подписи.</p>
        <p>Можно попросить уточнить удобное время у получателя — отметьте это при оформлении.</p>
      </section>

      <section class="bk-info__block">
        <h2><BkIcon name="wallet" /> Оплата</h2>
        <ul class="bk-info__list">
          <li v-for="x in bkPayments" :key="x.id">
            <BkIcon name="check" />
            <span><b>{{ x.title }}</b> — {{ x.text }}</span>
          </li>
        </ul>
      </section>

      <section class="bk-info__block">
        <h2><BkIcon name="shield" /> Замена и возврат</h2>
        <p>Если какого-то цветка нет в наличии, флорист заменит его похожим по цвету и цене — только если вы согласились на замену при оформлении.</p>
        <p>Срезанные цветы и горшечные растения обмену и возврату не подлежат. Вопросы по заказу — {{ bkContacts.phone }}, круглосуточно.</p>
      </section>
    </div>
  </div>
</template>
