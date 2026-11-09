<script lang="ts" setup>
import { kzEco } from '~/utils/kuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

useSeoMeta({ title: 'Экологическая безопасность — Кузбасская птицефабрика | Концепт редизайна' })
const items = [
  { icon: 'leaf', t: 'Очистные сооружения', p: kzEco[0] },
  { icon: 'shield', t: 'Отходы', p: kzEco[1] },
  { icon: 'award', t: 'Удобрение из помёта', p: kzEco[2] },
]
</script>

<template>
  <div>
    <KzHead title="Экологическая безопасность" lead="АО «Кузбасская птицефабрика» стремится к минимизации негативного влияния на окружающую среду." />
    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap kz-eco">
        <article v-for="i in items" :key="i.t" class="kz-panel kz-eco__item">
          <span class="kz-eco__ic"><KzIcon :name="i.icon" :size="26" /></span>
          <h3>{{ i.t }}</h3>
          <p>{{ i.p }}</p>
        </article>
      </div>
    </section>
    <div class="kz-sec kz-sec--tight" />
  </div>
</template>

<style lang="scss">
.kz-eco {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
  &__item {
    display: grid;
    align-content: start;
    gap: 12px;

    p {
      font-size: 15px;
    }
  }
  &__ic {
    display: grid;
    place-items: center;
    width: 50px;
    height: 50px;
    border-radius: 14px;
    background: var(--kz-green-soft);
    color: var(--kz-green);
  }
}
</style>
