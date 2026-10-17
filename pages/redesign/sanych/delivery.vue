<script lang="ts" setup>
const delivery = ref(snTomorrow())
onMounted(() => (delivery.value = snTomorrow()))

useSeoMeta({ title: 'Доставка и оплата | Мясная лавка «Саныч», концепт', robots: 'noindex, nofollow' })

const ways = [
  {
    title: 'Обычная',
    when: 'Завтра',
    text: 'Привозим на следующий день после заказа, по Новосибирску и области с 9:30 до 21:00. Утром позвоним и согласуем время.',
  },
  {
    title: 'Экспресс',
    when: 'За 6 часов',
    text: 'В день заказа, если он оформлен с 9:00 до 18:00. За доплату, заказ оплачивается до комплектации.',
  },
  {
    title: 'Готовый шашлык',
    when: '25–45 минут',
    text: 'Шашлык и люля-кебаб на углях привозим горячими, доставка бесплатная.',
  },
]
</script>

<template>
  <div class="sn-wrap sni">
    <div class="sn-pagehead">
      <nav class="sn-crumbs" aria-label="Навигация">
        <NuxtLink :to="snPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>Доставка и оплата</span>
      </nav>
      <h1>Доставка и оплата</h1>
      <p>
        Привозим охлаждённое мясо в термоконтейнерах. Ближайшая доставка — завтра,
        {{ delivery.day }}.
      </p>
    </div>

    <div class="sni-ways">
      <article v-for="w in ways" :key="w.title" class="sni-way">
        <span class="sni-way__title">{{ w.title }}</span>
        <b class="sni-way__when">{{ w.when }}</b>
        <p>{{ w.text }}</p>
      </article>
    </div>

    <section class="sni-section">
      <h2>Сколько стоит</h2>
      <table class="sni-table">
        <tbody>
          <tr>
            <th scope="row">Минимальный заказ</th>
            <td>{{ snRub(snRules.minOrder) }}</td>
          </tr>
          <tr>
            <th scope="row">До подъезда, заказ от {{ snRub(snRules.freeFrom) }} или от {{ snRules.freeKg }} кг</th>
            <td>бесплатно</td>
          </tr>
          <tr>
            <th scope="row">Подъём разделки до квартиры</th>
            <td>{{ snRub(snRules.toFlat) }}</td>
          </tr>
          <tr>
            <th scope="row">Четверти и полутуши</th>
            <td>до подъезда бесплатно, подъём — по договорённости с экспедитором</td>
          </tr>
          <tr>
            <th scope="row">Экспресс-доставка в день заказа</th>
            <td>доплату назовёт оператор</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="sni-section sni-split">
      <div>
        <h2>Вес и итоговая сумма</h2>
        <p>
          Тушу невозможно нарубить на одинаковые куски — всегда выходит то больше, то меньше,
          зато без остатка. Поэтому реальный вес может отличаться от заказанного: перевес
          бывает на 250–500 г.
        </p>
        <p>
          В корзине мы сразу показываем примерную сумму по весу куска. Когда заказ соберут на
          ферме, придёт SMS с точной суммой — ещё до приезда курьера.
        </p>
      </div>
      <div>
        <h2>Оплата</h2>
        <ul class="sni-list">
          <li>Наличными или безналичным переводом</li>
          <li>Работаем с частными покупателями и организациями</li>
          <li>Экспресс-заказы оплачиваются до комплектации</li>
        </ul>
      </div>
    </section>

    <section id="faq" class="sni-section">
      <h2>Вопрос — ответ</h2>
      <div class="sni-faq">
        <details v-for="(f, i) in snFaq" :key="f.q" :open="i === 0">
          <summary>{{ f.q }}</summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.sn .sni-ways {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.sn .sni-table {
  width: 100%;
  max-width: 860px;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 0;
    border-bottom: 1px solid var(--sn-line);
    text-align: left;
    vertical-align: top;
  }

  th {
    width: 55%;
    padding-right: 24px;
    font-weight: 500;
    color: var(--sn-muted);
  }

  td {
    font-weight: 700;
  }
}

.sn .sni-split {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 40px;
}

.sn .sni-faq {
  display: grid;
  gap: 8px;
  max-width: 860px;

  details {
    border-radius: var(--sn-r);
    background: var(--sn-paper);

    &[open] {
      background: #fff;
      box-shadow: inset 0 0 0 1px var(--sn-line);
    }
  }

  summary {
    position: relative;
    padding: 16px 48px 16px 18px;
    font-weight: 700;
    list-style: none;
    cursor: pointer;

    &::-webkit-details-marker {
      display: none;
    }

    &::after {
      content: '';
      position: absolute;
      right: 18px;
      top: 50%;
      width: 10px;
      height: 10px;
      border-right: 2px solid var(--sn-muted);
      border-bottom: 2px solid var(--sn-muted);
      transform: translateY(-70%) rotate(45deg);
      transition: transform 0.2s;
    }
  }

  details[open] summary::after {
    transform: translateY(-30%) rotate(-135deg);
  }

  p {
    padding: 0 18px 16px;
  }
}

@media (max-width: 760px) {
  .sn .sni-ways,
  .sn .sni-split {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .sn .sni-split {
    gap: 32px;
  }

  .sn .sni-table {
    th,
    td {
      display: block;
      width: 100%;
      padding: 0;
      border: 0;
    }

    tr {
      display: block;
      padding: 12px 0;
      border-bottom: 1px solid var(--sn-line);
    }

    td {
      margin-top: 2px;
    }
  }
}
</style>
