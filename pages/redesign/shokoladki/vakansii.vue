<script lang="ts" setup>
// Вакансия оригинала целиком и отклик (имя, телефон, резюме) — демо.
import { skPath } from '~/utils/shokoladki'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'
import SkPhone from '~/components/redesign/shokoladki/SkPhone.vue'

useSeoMeta({ title: 'Вакансии — фабрика «Верность качеству» | Концепт редизайна' })
const to = (p: string) => skPath(p)
const blocks = [
  {
    n: 'Обязанности',
    items: ['Продажа шоколада и конфет ручной работы в фирменных магазинах компании', 'Консультирование покупателей', 'Приём и выкладка товара', 'Работа с кассой и терминалом безналичных платежей', 'Ведение журнала кассира-операциониста'],
  },
  {
    n: 'Требования',
    items: ['Знание кассовой дисциплины и проведения возвратов', 'Работа с терминалом безналичных платежей', 'Медицинская книжка', 'Умение заинтересовать покупателя, вежливость, ответственность', 'Доброжелательность к покупателям и коллегам'],
  },
  {
    n: 'Условия',
    items: [
      'Оформление по ТК РФ с первого дня работы',
      'Официальный оклад + премия (зафиксированы в договоре и положении о премировании)',
      'График 2/2 и 5/2, сменный',
      'Фирменные магазины в ТЦ «Европейский», «Атриум», «Хорошо», «АвиаПарк» и «Океания»',
      'Корпоративные тренинги с сертификатами, возможность карьерного роста',
      'Молодой и дружный коллектив, удобное расположение ТЦ',
    ],
  },
]
const f = reactive({ name: '', phone: '', file: '', sent: false })
</script>

<template>
  <div class="sk-wrap sk-page">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>Вакансии</span>
    </nav>
    <h1 class="sk-h1">Вакансии</h1>
    <div class="sk-job">
      <article class="sk-box sk-job__card">
        <div class="sk-job__head">
          <h2 class="sk-h2">Продавец-кассир</h2>
          <div class="sk-chips">
            <span class="sk-chip">Опыт 1–3 года</span>
            <span class="sk-chip">Полная занятость</span>
            <span class="sk-chip">Сменный график</span>
          </div>
        </div>
        <div v-for="b in blocks" :key="b.n" class="sk-job__block">
          <b>{{ b.n }}</b>
          <ul class="sk-job__list">
            <li v-for="i in b.items" :key="i"><SkIcon name="check" />{{ i }}</li>
          </ul>
        </div>
      </article>
      <aside class="sk-panel sk-job__side">
        <b class="sk-h2">Откликнуться</b>
        <p class="sk-muted">Контактное лицо — Мария, <a href="tel:+74957751515">+7 495 775-15-15 доб. 359</a>, <a href="mailto:hr@apriorivk.ru">hr@apriorivk.ru</a></p>
        <form v-if="!f.sent" class="sk-form" @submit.prevent="f.sent = true">
          <label class="sk-field"><span>Имя</span><input v-model="f.name" class="sk-input" required autocomplete="name" /></label>
          <label class="sk-field"><span>Телефон</span><SkPhone v-model="f.phone" class="sk-input" required /></label>
          <label class="sk-field"><span>Резюме</span><input class="sk-input" type="file" accept=".pdf,.doc,.docx" @change="f.file = (($event.target as HTMLInputElement).files?.[0]?.name || '')" /></label>
          <button class="sk-btn sk-btn--big" type="submit">Отправить отклик</button>
        </form>
        <p v-else class="sk-done"><SkIcon name="check" />Демо: отклик не отправлен. В рабочей версии он уйдёт на hr@apriorivk.ru.</p>
      </aside>
    </div>
  </div>
</template>
