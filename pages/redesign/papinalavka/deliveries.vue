<script lang="ts" setup>
import PlCard from '~/components/redesign/papinalavka/PlCard.vue'
import PlIcon from '~/components/redesign/papinalavka/PlIcon.vue'

useSeoMeta({ title: 'Ближайшие поставки — Папина лавка | Концепт редизайна' })

const ui = usePapinalavkaUi()
const now = ref(new Date())
onMounted(() => (now.value = new Date()))

const news = [
  { date: '04 октября 2026', title: 'Вакансия! Ищем своих людей в команду «Папиной лавки»' },
  { date: '01 октября 2026', title: 'Теперь у нас 7 филиалов в Воронеже и Новой Усмани' },
  { date: '28 сентября 2026', title: 'Доставка в «Папиной лавке» — теперь ежедневно' },
  { date: '25 сентября 2026', title: '«Папина лавка» в Подгорном! С 26 сентября на ул. Независимости, 78 к3' },
]

const sub = ref({ contact: '', done: false })
const subscribe = () => {
  if (!sub.value.contact.trim()) return
  sub.value.done = true
  ui.say('Подписка оформлена — в концепте она никуда не уходит')
}
</script>

<template>
  <div class="pl-wrap pl-dl">
    <nav class="pl-crumbs" aria-label="Навигация">
      <NuxtLink :to="plPath()">Главная</NuxtLink>
      <span>Ближайшие поставки</span>
    </nav>
    <h1 class="pl-h1">Ближайшие поставки</h1>
    <p class="pl-dl__lead">
      Все продукты привозим только под заказ. Охлаждённое — каждый четверг: заказ за сутки до дня поставки, до 13:00. В остальные дни — экспресс из
      наличия за 2–3 часа.
    </p>

    <section v-for="d in plDeliveries" :id="`d-${plParse(d.date).getDate()}`" :key="d.date" class="pl-dl__item">
      <div class="pl-dl__note" :class="{ 'is-closed': !plOpen(d.date, now) }">
        <p class="pl-dl__date">{{ plWeekday(d.date) }}, {{ plDay(d.date) }}</p>
        <h2>{{ d.title }}</h2>
        <p class="pl-dl__what">{{ d.what }}</p>
        <p class="pl-dl__deadline">
          <PlIcon name="clock" :size="18" />
          <span v-if="plOpen(d.date, now)">Заказ {{ plDeadlineLabel(d.date) }}</span>
          <span v-else>Приём заказов закрыт</span>
        </p>
        <NuxtLink :to="{ path: plSectionPath(), query: { date: d.date } }" class="pl-btn pl-btn--line pl-btn--sm">
          Все товары поставки: {{ d.count }}
        </NuxtLink>
      </div>
      <div class="pl-dl__goods">
        <PlCard v-for="p in plDeliveryProducts(d).slice(0, 3)" :key="p.id" :product="p" />
      </div>
    </section>

    <div class="pl-dl__bottom">
      <section class="pl-dl__sub">
        <h2>Узнавать о поставках первым</h2>
        <p>Пришлём дату и состав поставки, как только откроем приём заказов.</p>
        <form v-if="!sub.done" @submit.prevent="subscribe">
          <label class="pl-field"><span>Почта или телефон</span><input v-model="sub.contact" type="text" required /></label>
          <button type="submit" class="pl-btn pl-btn--main">Подписаться</button>
        </form>
        <p v-else class="pl-when is-stock"><PlIcon name="check" :size="18" /><span>Готово. Ближайшее письмо — перед следующей поставкой.</span></p>
        <p class="pl-dl__tg">
          Или в Telegram: <a :href="plContacts.tg" target="_blank" rel="noopener">t.me/papinalavka</a> · <span class="pl-demo">демо</span>
        </p>
      </section>
      <section class="pl-dl__news">
        <h2>Новости лавки</h2>
        <ul>
          <li v-for="n in news" :key="n.date">
            <small>{{ n.date }}</small>
            <span>{{ n.title }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pl-dl {
  &__lead {
    max-width: 780px;
    margin: 12px 0 32px;
    font-size: 17px;
  }

  &__item {
    display: grid;
    grid-template-columns: 340px minmax(0, 1fr);
    gap: 20px;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 22px;
    border: var(--pl-board-border);
    background: var(--pl-wood-board);
  }

  &__note {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 24px 20px 20px;
    border-radius: 8px;
    background: #fffaf1;
    box-shadow: 0 6px 14px rgba(40, 20, 8, 0.28);

    h2 {
      font-size: 21px;
      line-height: 1.25;
    }

    .pl-btn {
      margin-top: auto;
    }

    &.is-closed .pl-dl__date {
      color: var(--pl-muted);
    }
  }

  &__date {
    color: var(--pl-red);
    font-family: var(--pl-hand);
    font-size: 36px;
    font-weight: 700;
    line-height: 1;
  }

  &__what {
    color: var(--pl-muted);
    font-size: 15px;
  }

  &__deadline {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-bottom: 6px;
    color: var(--pl-dark);
    font-weight: 700;
    font-size: 15px;
  }

  &__goods {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  &__bottom {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 20px;
    margin-top: 40px;
  }

  &__sub,
  &__news {
    display: grid;
    align-content: start;
    gap: 12px;
    padding: 28px;
    border-radius: 20px;
    background: var(--pl-kraft);

    h2 {
      font-size: 24px;
    }
  }

  &__sub form {
    display: flex;
    align-items: flex-end;
    gap: 10px;

    .pl-field {
      flex: 1;
    }
  }

  &__tg {
    color: var(--pl-muted);
    font-size: 15px;

    a {
      color: var(--pl-accent);
      font-weight: 700;
    }
  }

  &__news ul {
    display: grid;
    gap: 12px;
  }

  &__news li {
    display: grid;
    gap: 2px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--pl-line);

    small {
      color: var(--pl-muted);
      font-size: 13px;
    }

    span {
      color: var(--pl-dark);
      font-weight: 700;
    }

    &:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }
  }

  @media (max-width: 1199px) {
    &__item {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 989px) {
    &__goods {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;

      > * {
        flex: 0 0 min(260px, 72vw);
        scroll-snap-align: start;
      }
    }

    &__bottom {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 768px) {
    &__item {
      padding: 14px;
      border-radius: 18px;
    }

    &__sub,
    &__news {
      padding: 20px 16px;
    }

    &__sub form {
      flex-direction: column;
      align-items: stretch;
    }
  }
}
</style>
