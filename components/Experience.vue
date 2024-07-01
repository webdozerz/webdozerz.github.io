<template>
  <div class="experience">
    <h3>Опыт работы</h3>
    <section>
      <div class="experience__row">
        <div class="experience__col">
          <b>
            Frontend-разработчик
          </b>
          <span>
            Команда Nuxt
          </span>
        </div>
        <div class="experience__col">
          rrr
        </div>
        <div class="experience__col">
          jjj
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>
<style lang="scss" scoped>
.experience {
  display: flex;
  flex-direction: column;
  gap: 12px;
  &__row  {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    grid-gap: 42px;
  }
  &__col {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  &__link {
    color: var(--green);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
