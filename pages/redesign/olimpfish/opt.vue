<script lang="ts" setup>
import { olContacts, olOptSteps, olOptTerms, olPartners, olPath, olUp } from '~/utils/olimpfish'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'
import OlPhone from '~/components/redesign/olimpfish/OlPhone.vue'

useSeoMeta({ title: 'Партнёрам и оптовикам — Олимп | Концепт редизайна' })
const form = reactive({ name: '', phone: '', mail: '', company: '', what: [] as string[], text: '', ok: true })
const done = ref(false)
</script>

<template>
  <div class="ol-wrap ol-page ol-opt">
    <nav class="ol-crumbs" aria-label="Навигация">
      <NuxtLink :to="olPath('/')">Главная</NuxtLink>
      <span>Партнёрам и оптовикам</span>
    </nav>
    <div class="ol-opt__top">
      <div>
        <h1 class="ol-title">Партнёрам и оптовикам</h1>
        <p class="ol-lead">Большой выбор рыбы, икры и морепродуктов. Ключевое направление — продукция натурального копчения рыбы осетровых пород: осётр, белуга, калуга, бестер. Поставщики — Республика Дагестан, Казахстан, Китай и Иран; шоковая заморозка и контроль качества по принципам ХАССП.</p>
        <ul class="ol-opt__terms">
          <li v-for="t in olOptTerms" :key="t.title"><OlIcon :name="t.icon" /><span><b>{{ t.title }}</b>{{ t.text }}</span></li>
        </ul>
      </div>
      <div class="ol-opt__form" id="form">
        <h2>Заявка на опт</h2>
        <p>Минимальная сумма заказа — от 7000 рублей. Свяжемся в течение 30 минут.</p>
        <div v-if="done" class="ol-done">
          <span class="ol-done__ic"><OlIcon name="check" /></span>
          <h3>Заявка принята</h3>
          <p>Это демо: на настоящем сайте менеджер перезвонит в течение 30 минут.</p>
          <button type="button" class="ol-btn ol-btn--line" @click="done = false">Отправить ещё</button>
        </div>
        <form v-else class="ol-optform" @submit.prevent="done = true">
          <label class="ol-field"><span>Имя *</span><input v-model="form.name" required autocomplete="name" /></label>
          <label class="ol-field"><span>Телефон *</span><OlPhone v-model="form.phone" required /></label>
          <label class="ol-field"><span>E-mail</span><input v-model="form.mail" type="email" autocomplete="email" /></label>
          <label class="ol-field"><span>Компания или ИНН</span><input v-model="form.company" autocomplete="organization" /></label>
          <div class="ol-field ol-field--wide">
            <span>Что интересует</span>
            <div class="ol-opt__what">
              <label v-for="w in ['Икра', 'Рыба', 'Морепродукты']" :key="w" class="ol-check"><input v-model="form.what" type="checkbox" :value="w" /><span>{{ w }}</span></label>
            </div>
          </div>
          <label class="ol-field ol-field--wide"><span>Объёмы, регион, пожелания</span><textarea v-model="form.text" rows="3" /></label>
          <label class="ol-check"><input v-model="form.ok" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
          <button type="submit" class="ol-btn ol-btn--acc">Отправить заявку</button>
        </form>
      </div>
    </div>

    <section class="ol-sec">
      <div class="ol-head"><h2>Как мы работаем</h2></div>
      <ol class="ol-steps">
        <li v-for="(s, i) in olOptSteps" :key="s.title"><small>Этап {{ i + 1 }}</small><b>{{ s.title }}</b><p>{{ s.text }}</p></li>
      </ol>
    </section>

    <section class="ol-sec">
      <div class="ol-head"><h2>Нашу продукцию продают</h2></div>
      <ul class="ol-partners">
        <li v-for="p in olPartners" :key="p.name"><img :src="olUp(p.img)" :alt="p.name" loading="lazy" /></li>
      </ul>
      <p class="ol-opt__call">Отдел продаж: <a :href="olContacts.phones[2].href">{{ olContacts.phones[2].text }}</a>, <a :href="olContacts.phones[3].href">{{ olContacts.phones[3].text }}</a> · <a :href="`mailto:${olContacts.mail}`">{{ olContacts.mail }}</a></p>
    </section>
  </div>
</template>

<style lang="scss">
.ol .ol-opt {
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
    gap: 40px;
    align-items: start;
  }
  ul.ol-opt__terms {
    margin: 24px 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    li {
      display: flex;
      gap: 12px;
      padding: 16px;
      border-radius: var(--ol-R);
      background: var(--ol-surf);
    }
    .ol-icon {
      color: var(--ol-acc);
      width: 26px;
      height: 26px;
    }
    span {
      display: grid;
      gap: 3px;
      font-size: 14px;
      color: var(--ol-mute);
    }
    b {
      font-size: 15px;
      color: var(--ol-ink);
    }
  }
  &__form {
    display: grid;
    gap: 12px;
    padding: 28px;
    border: 1px solid var(--ol-line);
    border-radius: 20px;
    h2 {
      font-size: 24px;
    }
    > p {
      color: var(--ol-mute);
    }
  }
  &__what {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 18px;
  }
  &__call {
    margin-top: 18px;
    color: var(--ol-mute);
    a {
      color: var(--ol-ink);
      font-weight: 700;
      white-space: nowrap;
    }
  }
}
.ol ol.ol-steps {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  li {
    display: grid;
    align-content: start;
    gap: 6px;
    padding: 20px;
    border-radius: var(--ol-R);
    border: 1px solid var(--ol-line);
    border-top: 3px solid var(--ol-hi);
  }
  small {
    font-size: 13px;
    font-weight: 700;
    color: var(--ol-acc);
  }
  b {
    font-size: 16px;
    color: var(--ol-ink);
    line-height: 1.3;
  }
  p {
    font-size: 14px;
    color: var(--ol-mute);
  }
}
@media (max-width: 1199px) {
  .ol ol.ol-steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 989px) {
  .ol .ol-opt__top {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 768px) {
  .ol ol.ol-steps {
    grid-template-columns: minmax(0, 1fr);
  }
  .ol .ol-opt__form {
    padding: 20px;
  }
}
@media (max-width: 576px) {
  .ol .ol-opt ul.ol-opt__terms {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
