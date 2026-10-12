<script setup lang="ts">
import { education, skills } from '~/data/profile'
</script>

<template>
  <div>
    <dl class="skills">
      <div v-for="row in skills" :key="row.area" class="skills__row">
        <dt class="skills__area">
          {{ row.area }}
        </dt>
        <dd class="skills__items">
          {{ row.items }}
        </dd>
      </div>
    </dl>

    <div class="edu">
      <span class="edu__label mono">Образование</span>
      <div>
        <p class="edu__place">
          {{ education.place }}
        </p>
        <p class="edu__degree">
          {{ education.degree }} · {{ education.period }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skills {
  margin: 0;

  &__row {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    gap: 24px;
    padding: 14px 0;
    border-bottom: 1px solid var(--h-line);

    &:first-child {
      padding-top: 0;
    }
  }

  &__area {
    color: var(--h-muted);
    font-size: 14px;
  }

  &__items {
    margin: 0;
    color: var(--h-text);
    font-size: 15px;
    line-height: 1.55;
  }
}

.edu {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 24px;
  margin-top: 40px;

  &__label {
    color: var(--h-accent);
    font-size: 12px;
    padding-top: 3px;
  }

  &__place {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  &__degree {
    margin: 4px 0 0;
    color: var(--h-muted);
    font-size: 14px;
  }
}

@media (max-width: 600px) {
  .skills__row,
  .edu {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
