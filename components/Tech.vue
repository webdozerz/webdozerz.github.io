<template>
  <div class="tech">
    <h3 class="tech__title">Языки и технологии</h3>
    <section>
      <div class="tech__list">
        <ul>
          <li>
            Языки программмирования: JavaScript, TypeScript, Python, C#.
          </li>
          <li>
            Технологии: Vue.js, Nuxt, React.js, Git.
          </li>
          <li>
            Другое: работа с CI/CD, деплой в продакшен, работа с Sentry.
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

.tech {
  display: flex;
  flex-direction: column;
  gap: 12px;
  &__title {
    color: var(--white-1000);
  }
  &__list {
    margin-top: 8px;
  }
}
</style>
