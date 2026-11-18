<script lang="ts" setup>
// «Дилерам»: условия сотрудничества и регистрация в кабинете дилера — поля формы как у оригинала.
import { dmAdvantages, dmContacts, dmPath } from '~/utils/domoteka'
import { useDmUi } from '~/composables/useDomoteka'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'
import DmPhone from '~/components/redesign/domoteka/DmPhone.vue'

useSeoMeta({ title: 'Дилерам — фабрика столов и стульев «Домотека» | Концепт редизайна' })
const ui = useDmUi()
const f = reactive({
  last: '',
  first: '',
  mail: '',
  pass: '',
  pass2: '',
  phone: '',
  company: '',
  city: '',
  source: '',
  area: '',
  comment: '',
  ok: false,
})
const tried = ref(false)
const sent = ref(false)
const errs = computed(() => ({
  mail: !/.+@.+\..+/.test(f.mail),
  pass: f.pass.length < 6,
  pass2: !f.pass2 || f.pass2 !== f.pass,
  ok: !f.ok,
}))
const submit = () => {
  tried.value = true
  if (!Object.values(errs.value).some(Boolean)) sent.value = true
}
</script>

<template>
  <div class="dm-wrap dm-dealers">
    <div class="dm-page-head">
      <nav class="dm-crumbs" aria-label="Навигация"><NuxtLink :to="dmPath('/')">Главная</NuxtLink><span>Дилерам</span></nav>
      <h1 class="dm-h1">Дилерам</h1>
      <p class="dm-lead">Дилеров по России более 400, точек продаж — более 1500. По опыту наших партнёров затраты окупаются максимум через два месяца.</p>
    </div>

    <section class="dm-sec dm-dealers__top">
      <div class="dm-dealers__nums">
        <div><b>400+</b><span>дилеров</span></div>
        <div><b>1500+</b><span>точек продаж</span></div>
        <div><b>с 1989</b><span>работаем</span></div>
      </div>
      <div class="dm-dealers__contact">
        <h2>Как стать дилером</h2>
        <p>Свяжитесь с оптовым отделом фабрики — пришлём прайс, условия и рекламные материалы. Или зарегистрируйтесь ниже, и менеджер откроет вам кабинет.</p>
        <a :href="`tel:${dmContacts.tel}`" class="dm-dealers__phone">{{ dmContacts.phone }}</a>
        <a :href="`mailto:${dmContacts.sales}`" class="dm-dealers__mail">{{ dmContacts.sales }}</a>
        <div class="dm-dealers__btns">
          <a href="#registraciya" class="dm-btn">Регистрация</a>
          <button type="button" class="dm-btn dm-btn--line" @click="ui.modal.value = 'login'"><DmIcon name="login" />Вход для дилеров</button>
        </div>
      </div>
    </section>

    <section class="dm-sec">
      <h2 class="dm-h2">Почему с нами выгодно сотрудничать</h2>
      <ul class="dm-adv dm-dealers__adv">
        <li v-for="a in dmAdvantages" :key="a.t"><DmIcon :name="a.icon" /><span>{{ a.t }}</span></li>
      </ul>
    </section>

    <section id="registraciya" class="dm-sec">
      <div class="dm-reg">
        <div class="dm-reg__side">
          <h2 class="dm-h2">Регистрация дилера</h2>
          <p>После проверки менеджер откроет доступ к кабинету: остатки склада, заказы, прайс-листы и рекламная продукция.</p>
          <p class="dm-reg__note">Поля со звёздочкой обязательны.</p>
        </div>
        <div v-if="sent" class="dm-form__done">
          <DmIcon name="check" /><b>Заявка на регистрацию принята</b>
          <p>Это демо: в концепте данные никуда не отправляются. На сайте менеджер свяжется с вами по {{ f.phone || f.mail }}.</p>
        </div>
        <form v-else class="dm-form dm-reg__form" novalidate @submit.prevent="submit">
          <label class="dm-field"><span>Фамилия</span><input v-model="f.last" type="text" autocomplete="family-name" /></label>
          <label class="dm-field"><span>Имя</span><input v-model="f.first" type="text" autocomplete="given-name" /></label>
          <label class="dm-field" :class="{ 'is-err': tried && errs.mail }"><span>E-mail <i>*</i></span><input v-model="f.mail" type="email" autocomplete="email" /></label>
          <label class="dm-field"><span>Телефон</span><DmPhone v-model="f.phone" /></label>
          <label class="dm-field" :class="{ 'is-err': tried && errs.pass }"><span>Пароль <i>*</i></span><input v-model="f.pass" type="password" autocomplete="new-password" placeholder="не короче 6 символов" /></label>
          <label class="dm-field" :class="{ 'is-err': tried && errs.pass2 }"><span>Подтверждение пароля <i>*</i></span><input v-model="f.pass2" type="password" autocomplete="new-password" /></label>
          <label class="dm-field"><span>Наименование компании</span><input v-model="f.company" type="text" autocomplete="organization" /></label>
          <label class="dm-field"><span>Город</span><input v-model="f.city" type="text" autocomplete="address-level2" /></label>
          <label class="dm-field">
            <span>Откуда узнали о нас</span>
            <select v-model="f.source">
              <option value="">Выберите</option>
              <option>Рекомендации</option>
              <option>Интернет</option>
              <option>Мебельная выставка</option>
              <option>Другое</option>
            </select>
          </label>
          <label class="dm-field"><span>Площадь торговой точки, м²</span><input v-model="f.area" type="text" inputmode="numeric" /></label>
          <label class="dm-field dm-reg__wide"><span>Комментарий</span><textarea v-model="f.comment" rows="3" /></label>
          <label class="dm-check dm-reg__wide" :class="{ 'is-err': tried && errs.ok }">
            <input v-model="f.ok" type="checkbox" />
            <span>С <NuxtLink :to="dmPath('/politika/')">политикой обработки персональных данных</NuxtLink> ознакомлен(а) и согласен(на)</span>
          </label>
          <button type="submit" class="dm-btn dm-btn--big">Зарегистрироваться</button>
        </form>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.dm .dm-dealers {
  .dm-dealers__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
    padding-top: 28px;
  }
  .dm-dealers__nums {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    div {
      display: grid;
      align-content: end;
      gap: 6px;
      padding: 24px;
      border-radius: var(--dm-r2);
      background: var(--dm-surf);
    }
    b {
      font: 800 clamp(30px, 3vw, 44px) / 1 var(--dm-head);
      font-stretch: 118%;
      color: var(--dm-acc);
    }
    span {
      color: var(--dm-muted);
    }
  }
  .dm-dealers__contact {
    display: grid;
    align-content: start;
    gap: 10px;
    padding: 24px 28px;
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r2);
    h2 {
      font: 800 24px/1.15 var(--dm-head);
      font-stretch: 112%;
    }
    p {
      color: var(--dm-muted);
    }
  }
  .dm-dealers__phone {
    font: 800 26px/1.15 var(--dm-head);
    text-decoration: none;
  }
  .dm-dealers__mail {
    color: var(--dm-acc);
  }
  .dm-dealers__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }
  .dm-dealers__adv {
    margin-top: 24px;
  }
  .dm-reg {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.6fr);
    gap: 24px 48px;
    padding: 32px;
    border-radius: 20px;
    background: var(--dm-surf);
  }
  .dm-reg__side {
    display: grid;
    align-content: start;
    gap: 12px;
    p {
      color: var(--dm-muted);
    }
  }
  .dm-reg__note {
    font-size: 14px;
  }
  .dm-reg__form {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 16px;
    align-items: start;
  }
  .dm-reg__wide {
    grid-column: 1 / -1;
  }
}
@media (max-width: 1199px) {
  .dm .dm-dealers {
    .dm-dealers__top,
    .dm-reg {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
@media (max-width: 576px) {
  .dm .dm-dealers {
    .dm-dealers__nums {
      grid-template-columns: minmax(0, 1fr);
      div {
        padding: 18px;
      }
    }
    .dm-dealers__contact {
      padding: 20px;
    }
    .dm-reg {
      padding: 20px 16px;
    }
    .dm-reg__form {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
