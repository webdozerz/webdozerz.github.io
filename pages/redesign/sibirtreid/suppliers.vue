<script lang="ts" setup>
import SbIcon from '~/components/redesign/sibirtreid/SbIcon.vue'

const criteria = [
  { title: 'Своевременные поставки', text: 'Регулярные и точные отгрузки в оговорённые сроки.' },
  { title: 'Конкурентные цены', text: 'На уровне рынка, чтобы сохранять выгодные условия для наших клиентов.' },
  { title: 'Высокое качество', text: 'Качество товара во главе угла — и перспективные новинки в ассортимент.' },
]
const offers = [
  { title: 'Точные выплаты', text: 'Строго соблюдаем сроки оплаты за поставленную продукцию.' },
  { title: 'Рост закупок', text: 'Объём продаж растёт — растёт и стабильный спрос на ваш товар.' },
  { title: 'Совместный маркетинг', text: 'Рекламные кампании, чтобы вашу продукцию узнавали в регионах.' },
]

const company = ref('')
const inn = ref('')
const name = ref('')
const phone = ref('')
const goods = ref('')
const why = ref('')
const sent = ref(false)
const tried = ref(false)
const ok = computed(() => company.value.trim() && name.value.trim() && phone.value.replace(/\D/g, '').length >= 10 && goods.value.trim())
const submit = () => {
  tried.value = true
  if (ok.value) sent.value = true
}

useSeoMeta({ title: 'Поставщикам — СибирьТрейд | Концепт редизайна' })
</script>

<template>
  <div class="sb-wrap sb-sup">
    <nav class="sb-crumbs" aria-label="Навигация">
      <NuxtLink :to="sbPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>Поставщикам</span>
    </nav>
    <h1 class="sb-page-title">Поставщикам</h1>
    <p class="sb-sup__lead">
      Расширяем ассортимент и ищем надёжных поставщиков на внутреннем и международном рынках.
      Особенно рады локальным производителям в регионах, где работаем: выводим их товар на полки
      Сибири и Якутии.
    </p>

    <div class="sb-sup__cols">
      <section class="sb-sup__box sb-tone--mint">
        <h2>Что для нас важно</h2>
        <ul>
          <li v-for="c in criteria" :key="c.title"><SbIcon name="check" :size="20" /><span><strong>{{ c.title }}.</strong> {{ c.text }}</span></li>
        </ul>
      </section>
      <section class="sb-sup__box sb-tone--peach">
        <h2>Что предлагаем</h2>
        <ul>
          <li v-for="c in offers" :key="c.title"><SbIcon name="check" :size="20" /><span><strong>{{ c.title }}.</strong> {{ c.text }}</span></li>
        </ul>
      </section>
    </div>

    <section class="sb-section">
      <div class="sb-pform sb-pform--lime sb-sup__form">
        <span class="sb-pform__blob sb-pform__blob--a" aria-hidden="true" />
        <div v-if="!sent" class="sb-pform__inner">
          <h2 class="sb-pform__title">Предложите <span class="sb-pill">свой товар</span> в ассортимент</h2>
          <p class="sb-pform__lead">Расскажите, что производите и почему ваш товар нужен нашим покупателям. Отдел закупок ответит в течение недели.</p>
          <form class="sb-pform__grid" novalidate @submit.prevent="submit">
            <label class="sb-field">
              <span>Компания *</span>
              <input v-model="company" :aria-invalid="tried && !company.trim()" />
            </label>
            <label class="sb-field">
              <span>ИНН</span>
              <input v-model="inn" inputmode="numeric" maxlength="12" />
            </label>
            <label class="sb-field">
              <span>Контактное лицо *</span>
              <input v-model="name" autocomplete="name" :aria-invalid="tried && !name.trim()" />
            </label>
            <label class="sb-field">
              <span>Телефон *</span>
              <input v-model="phone" type="tel" autocomplete="tel" placeholder="+7" :aria-invalid="tried && phone.replace(/\D/g, '').length < 10" />
            </label>
            <label class="sb-field sb-field--wide">
              <span>Что поставляете *</span>
              <input v-model="goods" placeholder="Категория, бренды, фасовки" :aria-invalid="tried && !goods.trim()" />
            </label>
            <label class="sb-field sb-field--wide">
              <span>Почему ваш товар стоит взять в ассортимент</span>
              <textarea v-model="why" rows="3" />
            </label>
            <div class="sb-pform__foot">
              <button type="submit" class="sb-btn sb-btn--lg">Отправить предложение</button>
              <p>Или позвоните в отдел закупок: {{ sbContacts.departments[1].phone }}, {{ sbContacts.departments[1].person }}</p>
            </div>
          </form>
        </div>
        <div v-else class="sb-pform__inner sb-pform__done" role="status">
          <h2 class="sb-pform__title">Спасибо, предложение <span class="sb-pill">принято</span></h2>
          <p class="sb-pform__lead">Это демо: письмо никуда не отправлено. На рабочем сайте оно уйдёт в отдел закупок.</p>
          <button type="button" class="sb-btn" @click="sent = false">Заполнить ещё раз</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.sb .sb-sup {
  &__lead {
    max-width: 760px;
    margin-top: 14px;
    color: var(--sb-muted);
    font-size: 17px;
  }

  &__cols {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin-top: 32px;
  }

  &__box {
    padding: clamp(24px, 4vw, 40px);
    border-radius: 32px;
    background: var(--tone-bg);

    h2 {
      font-size: clamp(24px, 3vw, 32px);
    }

    ul {
      display: grid;
      gap: 14px;
      margin-top: 20px;
    }

    li {
      display: flex;
      gap: 12px;

      .sb-icon {
        color: var(--tone-ink);
        margin-top: 2px;
      }
    }
  }

  &__form .sb-pform__title {
    padding-right: 0;
  }

  @media (max-width: 800px) {
    &__cols {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
