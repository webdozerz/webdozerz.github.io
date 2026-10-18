<script lang="ts" setup>
import SbIcon from '~/components/redesign/sibirtreid/SbIcon.vue'

const req = useSibirtreidRequest()
useSeoMeta({ title: 'Доставка и оплата — СибирьТрейд | Концепт редизайна' })
</script>

<template>
  <div class="sb-wrap sb-deliv">
    <nav class="sb-crumbs" aria-label="Навигация">
      <NuxtLink :to="sbPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>Доставка и оплата</span>
    </nav>
    <h1 class="sb-page-title">Доставка и оплата</h1>
    <p class="sb-deliv__lead">
      Отгружаем со склада в Новосибирске по всей России, от Урала до Сахалина. Упаковка и погрузочные
      работы уже включены в стоимость доставки.
    </p>

    <div class="sb-deliv__alert">
      <span class="sb-notice__mark" aria-hidden="true">!</span>
      <p>
        <strong>Сбор и отгрузка — до 3 дней.</strong>
        Переход на ЭТРН, ЕГАИС, Честный знак, Меркурий и ЭДО стал обязательным, обращений стало
        больше, и на регистрацию товаров уходит время. Спасибо за понимание.
      </p>
    </div>

    <section class="sb-section">
      <div class="sb-head"><h2>Как проходит заказ</h2></div>
      <ol class="sb-deliv__steps">
        <li v-for="(st, i) in sbSteps" :key="st.title">
          <span>Шаг {{ i + 1 }}</span>
          <h3>{{ st.title }}</h3>
          <p>{{ st.text }}</p>
        </li>
      </ol>
    </section>

    <section class="sb-section">
      <div class="sb-head"><h2>Способы доставки</h2></div>
      <div class="sb-deliv__ways">
        <div v-for="d in sbDelivery" :key="d.title" class="sb-deliv__way">
          <SbIcon name="truck" :size="26" />
          <h3>{{ d.title }}</h3>
          <p>{{ d.text }}</p>
          <strong>{{ d.price }}</strong>
        </div>
      </div>
    </section>

    <section class="sb-section sb-deliv__two">
      <div class="sb-deliv__pay">
        <h2>Оплата</h2>
        <p>Условия оплаты устанавливаются индивидуально с каждым клиентом. Работаем по договору, счёт и закрывающие документы — через ЭДО.</p>
        <ul>
          <li><SbIcon name="check" :size="18" /> Ежемесячные промо-акции</li>
          <li><SbIcon name="check" :size="18" /> Индивидуальные скидки от объёма</li>
          <li><SbIcon name="check" :size="18" /> Полный пакет сертификатов</li>
        </ul>
        <div class="sb-deliv__docs">
          <span v-for="c in sbCompliance" :key="c">{{ c }}</span>
        </div>
      </div>
      <div class="sb-deliv__cities">
        <h2>Колл-центры в Якутии</h2>
        <p>Северный завоз — главная специализация: проверенные ТК, контроль температуры, бережная перевозка.</p>
        <table>
          <tbody>
            <tr v-for="c in sbCities" :key="c.city">
              <th>{{ c.city }}</th>
              <td>
                {{ c.zip }}, {{ c.address }}
                <a v-if="c.phoneHref" :href="c.phoneHref">{{ c.phone }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="sb-section sb-deliv__cta">
      <h2>Посчитаем доставку под ваш заказ</h2>
      <p>Пришлите список позиций и город — назовём стоимость и ближайший день погрузки.</p>
      <div>
        <NuxtLink :to="sbPath('/request')" class="sb-btn sb-btn--lg">Собрать заявку</NuxtLink>
        <button type="button" class="sb-btn sb-btn--lg sb-btn--line" @click="req.askPrice('Расчёт доставки')">Спросить менеджера</button>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.sb .sb-deliv {
  &__lead {
    max-width: 700px;
    margin-top: 14px;
    color: var(--sb-muted);
    font-size: 17px;
  }

  &__alert {
    display: flex;
    gap: 14px;
    margin-top: 28px;
    padding: 20px 24px;
    border-radius: 24px;
    background: var(--sb-peach);

    p {
      max-width: 860px;
    }
  }

  &__steps {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;

    li {
      padding: 24px;
      border-radius: 26px;
      background: var(--sb-mint);
    }

    span {
      font-size: 13px;
      font-weight: 700;
      color: var(--sb-orange-d);
    }

    h3 {
      margin-top: 24px;
      font-size: 22px;
    }

    p {
      margin-top: 8px;
      color: var(--sb-muted);
      font-size: 14.5px;
    }
  }

  &__ways {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  &__way {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
    border-radius: 26px;
    box-shadow: inset 0 0 0 1px var(--sb-line);

    .sb-icon {
      color: var(--sb-green);
    }

    h3 {
      margin-top: 8px;
      font-size: 19px;
    }

    p {
      flex: 1;
      color: var(--sb-muted);
      font-size: 14.5px;
    }

    strong {
      align-self: flex-start;
      padding: 5px 12px;
      border-radius: 999px;
      background: var(--sb-lime-soft);
      color: #3d6b16;
      font-size: 14px;
    }
  }

  &__two {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 14px;
  }

  &__pay,
  &__cities {
    padding: clamp(24px, 4vw, 40px);
    border-radius: 32px;

    h2 {
      font-size: clamp(26px, 3vw, 34px);
    }

    > p {
      margin-top: 10px;
      color: var(--sb-muted);
    }
  }

  &__pay {
    background: var(--sb-lime-soft);

    ul {
      display: grid;
      gap: 10px;
      margin-top: 20px;
    }

    li {
      display: flex;
      gap: 10px;
      font-weight: 600;

      .sb-icon {
        color: var(--sb-green);
      }
    }
  }

  &__docs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 20px;

    span {
      padding: 5px 12px;
      border-radius: 999px;
      background: var(--sb-lime);
      font-weight: 700;
      font-size: 14px;
    }
  }

  &__cities {
    background: var(--sb-mint);

    table {
      width: 100%;
      margin-top: 18px;
      border-collapse: collapse;
      font-size: 14.5px;
    }

    th,
    td {
      padding: 9px 0;
      border-bottom: 1px solid var(--sb-mint-2);
      text-align: left;
      vertical-align: top;
    }

    th {
      width: 110px;
      padding-right: 12px;
    }

    td {
      color: var(--sb-muted);
    }

    a {
      display: block;
      color: var(--sb-green);
      font-weight: 700;
    }
  }

  &__cta {
    padding: clamp(28px, 5vw, 56px);
    border-radius: 32px;
    background: var(--sb-orange);
    color: #fff;

    h2 {
      color: inherit;
      font-size: clamp(28px, 3.6vw, 42px);
    }

    p {
      margin-top: 10px;
      font-size: 16px;
    }

    div {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 24px;
    }

    .sb-btn--line {
      box-shadow: none;
    }
  }

  @media (max-width: 1000px) {
    &__steps,
    &__ways {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &__two {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 560px) {
    &__steps,
    &__ways {
      grid-template-columns: minmax(0, 1fr);
    }

    &__steps h3 {
      margin-top: 10px;
    }

    &__cta .sb-btn {
      width: 100%;
    }
  }
}
</style>
