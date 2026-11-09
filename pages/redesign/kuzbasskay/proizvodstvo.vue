<script lang="ts" setup>
import { kzImg, kzPath, kzShops } from '~/utils/kuzbasskay'
import { useKzUi } from '~/composables/useKuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

useSeoMeta({ title: 'Производство — Кузбасская птицефабрика | Концепт редизайна' })
const ui = useKzUi()
</script>

<template>
  <div>
    <KzHead
      title="Производство"
      lead="Клеточное оборудование Big Dutchman, убойная линия Meyn на 2000 голов в час, яйцесортировка Staalkat на 54 тысячи яиц в час и своя зооветеринарная лаборатория."
    >
      <nav class="kz-chips kz-secnav" aria-label="Цеха">
        <a v-for="s in kzShops" :key="s.id" :href="`#${s.id}`" class="kz-chip">{{ s.title }}</a>
      </nav>
    </KzHead>

    <section v-for="(s, i) in kzShops" :id="s.id" :key="s.id" class="kz-sec" :class="{ 'kz-sec--surface': i % 2 === 1, 'kz-sec--tight': i === 0 }">
      <div class="kz-wrap kz-ws">
        <div class="kz-ws__text">
          <h2>{{ s.title }}</h2>
          <p v-for="t in s.text" :key="t">{{ t }}</p>
          <ul v-if="s.facts" class="kz-facts">
            <li v-for="f in s.facts" :key="f"><KzIcon name="check" :size="16" />{{ f }}</li>
          </ul>
          <NuxtLink v-if="s.id === 'korma'" :to="kzPath('/produkciya/kombikorm')" class="kz-link">Комбикорма и премиксы<KzIcon name="arrow" :size="18" /></NuxtLink>
          <NuxtLink v-if="s.id === 'yajca'" :to="kzPath('/produkciya/yajco')" class="kz-link">Яйцо по категориям<KzIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <div class="kz-gallery kz-ws__gallery">
          <button v-for="(p, j) in s.photos" :key="p.img" type="button" :aria-label="`Увеличить: ${p.cap}`" @click="ui.open(s.title, s.photos, j)">
            <img :src="kzImg(p.img)" :alt="p.cap" width="600" height="400" loading="lazy" />
            <span>{{ p.cap }}</span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.kz-ws {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  align-items: start;
  gap: 40px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
  }
  &__text {
    display: grid;
    gap: 14px;
    justify-items: start;

    h2 {
      font-size: clamp(24px, 2.6vw, 32px);
      font-weight: 900;
      line-height: 1.15;
    }
    p {
      font-size: 16px;
    }
    .kz-facts li {
      background: var(--kz-green-soft);
    }
  }
  &__gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    button:first-child {
      grid-column: 1 / -1;
    }
  }
}
.kz-sec--surface .kz-ws__text .kz-facts li {
  background: #fff;
}
</style>
