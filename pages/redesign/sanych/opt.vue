<script lang="ts" setup>
const sent = ref(false)
useSeoMeta({ title: 'Мясо оптом | Мясная лавка «Саныч», концепт', robots: 'noindex, nofollow' })

const terms = [
  { title: 'от 100 кг', text: 'Минимальная отгрузка. Большие объёмы обговариваем заранее.' },
  { title: 'Цена от объёма', text: 'Считаем для каждого клиента, есть скидки и бонусы постоянным.' },
  { title: 'Без НДС', text: 'Полный пакет сопроводительных документов, ветеринарные справки и сертификаты.' },
  { title: 'Своя доставка', text: 'В гофротаре, с соблюдением температурного режима. Возможен самовывоз.' },
]
const clients = ['Рестораны', 'Кафе', 'Столовые']
</script>

<template>
  <div class="sn-wrap sni">
    <div class="sn-pagehead">
      <nav class="sn-crumbs" aria-label="Навигация">
        <NuxtLink :to="snPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>Мясо оптом</span>
      </nav>
      <h1>Мясо оптом</h1>
      <p>
        Поставляем фермерское мясо ресторанам, кафе и столовым Новосибирска. Цены
        обсуждаем индивидуально — пришлите заявку или позвоните за прайс-листом.
      </p>
    </div>

    <div class="sno-terms">
      <article v-for="t in terms" :key="t.title" class="sni-way">
        <b class="sni-way__when">{{ t.title }}</b>
        <p>{{ t.text }}</p>
      </article>
    </div>

    <section class="sni-section sno-split">
      <div>
        <h2>Кому подходит</h2>
        <ul class="sno-clients">
          <li v-for="c in clients" :key="c">{{ c }}</li>
        </ul>
        <h2 class="sno-h2">Как работаем</h2>
        <ul class="sni-list">
          <li>Присылаете список и объёмы — считаем цену под партию</li>
          <li>Отгружаем после предоплаты</li>
          <li>Привозим своим транспортом или вы забираете сами</li>
          <li>С каждой поставкой — документы и ветеринарные справки</li>
        </ul>
        <div class="sno-call">
          <span>Прайс-лист с оптовыми ценами — по телефону</span>
          <a :href="snContacts.phoneHref" class="sn-btn sn-btn--line">{{ snContacts.phone }}</a>
        </div>
      </div>

      <form class="sno-form" @submit.prevent="sent = true">
        <h2>Заявка на поставку</h2>
        <label class="sn-field">
          <span>Организация</span>
          <input type="text" name="company" required />
        </label>
        <div class="sno-row">
          <label class="sn-field">
            <span>Контактное лицо</span>
            <input type="text" name="name" autocomplete="name" required />
          </label>
          <label class="sn-field">
            <span>Телефон</span>
            <input type="tel" name="phone" autocomplete="tel" required />
          </label>
        </div>
        <label class="sn-field">
          <span>Что нужно и в каком объёме</span>
          <textarea name="needs" placeholder="Например: говядина задняя четверть — 200 кг в месяц, свиная шея — 50 кг в неделю" />
        </label>
        <button type="submit" class="sn-btn sn-btn--wide">Отправить заявку</button>
        <p v-if="sent" class="sn-note" role="status">Это демо: заявка никуда не отправилась.</p>
      </form>
    </section>
  </div>
</template>

<style lang="scss">
.sn .sno-terms {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  .sni-way__when {
    font-size: 22px;
  }
}

.sn .sno-split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}

.sn .sno-clients {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;

  li {
    padding: 8px 14px;
    border-radius: 10px;
    background: var(--sn-rose);
    color: var(--sn-red-d);
    font-weight: 700;
  }
}

.sn .sni-section .sno-h2 {
  margin-top: 32px;
}

.sn .sno-call {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
  margin-top: 28px;
  padding: 18px;
  border-radius: var(--sn-r);
  background: var(--sn-paper);
  font-weight: 600;
}

@media (max-width: 960px) {
  .sn .sno-terms {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sn .sno-split {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .sn .sno-terms {
    grid-template-columns: 1fr;
    gap: 10px;
  }

}
</style>
