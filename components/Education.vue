<template>
  <div class="education">
    <h3 class="education__title">Образование</h3>
    <section>
      <div class="education__list">
        <ul>
          <li>
            Томский Политехнический Университет - Прикладная математика и информатика, 2016 - 2020
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
    color: var(--white-1000);
  }
  &__list {
    margin-top: 8px;
  }
}
</style>
