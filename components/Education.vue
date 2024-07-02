<template>
  <div class="education">
    <h3 class="education__title">Образование</h3>
    <section>
      <div class="education__list">
        <ul>
          <li>
            Томский Политехнический Университет - Прикладная математика и информатика, 2017 - 2020
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

.education {
  display: flex;
  flex-direction: column;
  gap: 12px;
  &__title {
    color: var(--orange);
  }
  &__row  {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    grid-gap: 42px;
    max-width: 1024px;

    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      grid-gap: 16px;
    }
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
  &__list {
    margin-top: 24px;
  }
}
</style>
