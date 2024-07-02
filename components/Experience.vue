<template>
  <div class="experience">
    <h3 class="experience__title">Опыт работы</h3>
    <section>
      <div class="experience__row">
        <div class="experience__col">
          <b>
            Frontend-разработчик
          </b>
        </div>
        <div class="divider">|</div>
        <div class="experience__col">
          <b>
            Crypton Studio
          </b>
        </div>
        <div class="divider">|</div>
        <div class="experience__col">
          <b>
            01.2022 - Настоящее время
          </b>
        </div>
      </div>
      <div class="experience__list">
        <ul>
          <li>
            Занимался созданием проекта TMA (Telegram Mini Apps) с аудиторией более чем 1 млн пользователей.
          </li>
          <li>
            Разработал и участвовал в более чем 10 криптовалютных биржах.
          </li>
          <li>
            Обеспечил оптимизацию загрузки страниц и улучшил показатели производительности сайта, сократив время загрузки на 40%.
          </li>
          <li>
            Создавал и поддерживал собственный проект Starter Kit для компании, включая дизайн интерфейсов (UI/UX) и функциональную архитектуру.
          </li>
          <li>
            Переписал проект с использованием Vue 2 на Nuxt + TypeScript.
          </li>
          <li>
            Провел обучение и менторинг новых сотрудников, помогая им адаптироваться к использованию современных инструментов и технологий в проектах компании.
          </li>
          <li>
            Руководил проектными циклами: планирование, распределение и контроль задач, оценка трудозатрат, конфигурирование и сопровождение проектов.
          </li>
        </ul>
      </div>
    </section>
    <section>
      <div class="experience__row">
        <div class="experience__col">
          <b>
            Frontend-разработчик
          </b>
        </div>
        <div class="divider">|</div>
        <div class="experience__col">
          <b>
            Astana Prom Design
          </b>
        </div>
        <div class="divider">|</div>
        <div class="experience__col">
          <b>
            2020 - 2022
          </b>
        </div>
      </div>
      <div class="experience__list">
        <ul>
          <li>
            Занимался разработкой веб-приложений по запросам для партнеров и агенств.
          </li>
          <li>
            Работал в тесном сотрудничестве с backend-разработчиками для создания API и их интеграции в фронтенд-приложения.
          </li>
          <li>
            Разработал и внедрил адаптивный дизайн корпоративного сайта, обеспечив оптимальное отображение на всех устройствах и повышение посещаемости на 30%.
          </li>
        </ul>
      </div>
    </section>
    <section>
      <div class="experience__row">
        <div class="experience__col">
          <b>
            Frontend-разработчик
          </b>
        </div>
        <div class="divider">|</div>
        <div class="experience__col">
          <b>
            Фриланс
          </b>
        </div>
        <div class="divider">|</div>
        <div class="experience__col">
          <b>
            2017 - 2020
          </b>
        </div>
      </div>
      <div class="experience__list">
        <ul>
          <li>
            Разработал адаптивные и интерактивные пользовательские интерфейсы для различных веб-приложений с использованием Vue.js, улучшив пользовательский опыт и интерфейсы клиентов.
          </li>
          <li>
            Создал и внедрил кастомизированные темы для WordPress, что позволило клиентам расширить функциональность и уникальный дизайн их веб-сайтов.
          </li>
          <li>
            Оптимизировал производительность веб-сайтов, сократив время загрузки страниц и улучшив показатели SEO, что привело к увеличению органического трафика.
          </li>
          <li>
            Внедрил системы автоматического тестирования (Jest) для обеспечения качества кода и сокращения количества ошибок в готовых продуктах.
          </li>
          <li>
            Создал и поддерживал одностраничные приложения (SPA) с использованием Vue.js, обеспечивая высокую производительность и отзывчивость интерфейсов.
          </li>
          <li>
            Интегрировал сторонние API и сервисы, такие как платежные системы и карты, в веб-приложения, улучшив функциональность и возможности проектов клиентов.
          </li>
          <li>
            Обеспечил кроссбраузерную совместимость и доступность веб-сайтов, что позволило охватить более широкую аудиторию пользователей.
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>
<style lang="scss" scoped>
li {
  &::marker {
    color: var(--red);
  }
}

.experience {
  display: flex;
  flex-direction: column;
  gap: 12px;
  &__title {
    color: var(--white-1000);
  }
  &__row  {
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 767px) {
      flex-direction: column;
      align-items: flex-start;
      .divider {
        display: none;
      }
    }
  }
  &__col {
    color: var(--white-1000);
    text-align: left;
  }
  &__link {
    color: var(--green);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  &__list {
    margin-top: 24px;
  }
}
</style>
