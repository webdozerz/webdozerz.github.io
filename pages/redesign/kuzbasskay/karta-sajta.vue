<script lang="ts" setup>
import { kzNav, kzPath } from '~/utils/kuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'

useSeoMeta({ title: 'Карта сайта — Кузбасская птицефабрика | Концепт редизайна' })
const extra = [
  { label: 'Рецепты', to: kzPath('/recepty') },
  { label: 'Поиск', to: kzPath('/poisk') },
]
</script>

<template>
  <div>
    <KzHead title="Карта сайта" />
    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap kz-sitemap">
        <div v-for="n in kzNav" :key="n.label" class="kz-sitemap__col">
          <NuxtLink :to="n.to" class="kz-sitemap__h">{{ n.label }}</NuxtLink>
          <ul v-if="n.sub" class="kz-sitemap__list">
            <li v-for="s in n.sub" :key="s.label"><NuxtLink :to="s.to">{{ s.label }}</NuxtLink></li>
          </ul>
        </div>
        <div class="kz-sitemap__col">
          <NuxtLink :to="kzPath()" class="kz-sitemap__h">Главная</NuxtLink>
          <ul class="kz-sitemap__list">
            <li v-for="s in extra" :key="s.label"><NuxtLink :to="s.to">{{ s.label }}</NuxtLink></li>
          </ul>
        </div>
      </div>
    </section>
    <div class="kz-sec kz-sec--tight" />
  </div>
</template>

<style lang="scss">
.kz-sitemap {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;

  &__col {
    padding: 18px 20px;
    border-radius: 20px;
    background: var(--kz-surface);
  }
  &__h {
    color: var(--kz-ink);
    font-size: 18px;
    font-weight: 900;

    &:hover {
      color: var(--kz-accent-ink);
    }
  }
  ul.kz-sitemap__list {
    display: grid;
    gap: 6px;
    margin-top: 10px;
    font-size: 15px;

    a:hover {
      color: var(--kz-accent-ink);
    }
  }
}
</style>
