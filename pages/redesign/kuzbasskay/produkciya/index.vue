<script lang="ts" setup>
import { kzFeeds, kzImg, kzPath, kzProducts, kzSections } from '~/utils/kuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzCard from '~/components/redesign/kuzbasskay/KzCard.vue'
import KzMark from '~/components/redesign/kuzbasskay/KzMark.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

useSeoMeta({ title: 'Продукция — Кузбасская птицефабрика | Концепт редизайна' })
const feedCount = (g: string) => kzFeeds.filter((f) => f.group === g).length
</script>

<template>
  <div>
    <KzHead title="Продукция" lead="Яйцо, мясо несушки, полуфабрикаты и колбасы — для покупателей и оптовиков; комбикорма и премиксы своего завода — для хозяйств." />

    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap">
        <div class="kz-tiles">
          <NuxtLink v-for="s in kzSections" :key="s.id" :to="kzPath(`/produkciya/${s.id}`)" class="kz-tile" :class="{ 'kz-tile--farm': s.forWhom === 'farm' }">
            <span class="kz-tile__img" :class="{ 'is-contain': s.contain }">
              <img :src="kzImg(s.img)" :alt="s.title" width="600" height="400" loading="lazy" />
            </span>
            <span class="kz-tile__body">
              <span class="kz-tile__badge"><KzMark :name="s.icon" :size="22" /></span>
              <span><b>{{ s.title }}</b><small>{{ s.count }}</small></span>
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap">
        <div class="kz-h2">
          <div>
            <h2>Для покупателей и оптовиков</h2>
            <p>Цена зависит от объёма — нажмите «Узнать цену», чтобы позвонить в отдел продаж или написать письмо с готовой темой.</p>
          </div>
        </div>
        <div class="kz-grid3">
          <KzCard v-for="p in kzProducts" :key="p.id" :p="p" show-section />
          <article class="kz-card kz-card--kolb">
            <NuxtLink :to="kzPath('/produkciya/kolbasy')" class="kz-card__photo" style="cursor: pointer">
              <img :src="kzImg('kolbasy-crop')" alt="Колбасная продукция" width="633" height="612" loading="lazy" />
            </NuxtLink>
            <div class="kz-card__body">
              <p class="kz-card__sec"><KzMark name="sausage" :size="16" />Колбасная продукция</p>
              <h3 class="kz-card__name">Колбасы, ветчины и копчёный бройлер</h3>
              <p class="kz-card__text">Около 40 наименований из собственного охлаждённого куриного мяса, без сои и ГМО.</p>
              <div class="kz-card__foot">
                <NuxtLink :to="kzPath('/produkciya/kolbasy')" class="kz-link">О колбасах<KzIcon name="arrow" :size="18" /></NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="kz-sec">
      <div class="kz-wrap">
        <div class="kz-h2"><h2>Для хозяйств и фермеров</h2></div>
        <div class="kz-farm">
          <NuxtLink :to="kzPath('/produkciya/kombikorm')" class="kz-farm__item">
            <span class="kz-farm__ic"><KzMark name="sack" :size="34" /></span>
            <span><b>Комбикорм</b><small>{{ feedCount('Комбикорм') }} комбикормов и кормосмесей, {{ feedCount('БВМК') }} БВМК — для кур, бройлеров, перепелов, свиней и КРС</small></span>
            <KzIcon name="arrow" />
          </NuxtLink>
          <NuxtLink :to="kzPath('/produkciya/premiksy')" class="kz-farm__item">
            <span class="kz-farm__ic"><KzMark name="premix" :size="34" /></span>
            <span><b>Премиксы</b><small>{{ feedCount('Премикс') }} премиксов для птицы, свиней, коров, телят, лошадей и овец</small></span>
            <KzIcon name="arrow" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.kz-card--kolb .kz-card__photo img {
  object-position: center 30%;
}
.kz-farm {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
  &__item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 18px;
    padding: 22px;
    border-radius: var(--kz-R);
    background: var(--kz-green-soft);
    color: var(--kz-green);

    span:not(.kz-farm__ic) {
      display: grid;
      gap: 4px;
    }
    b {
      color: var(--kz-ink);
      font-size: 20px;
      font-weight: 900;
    }
    small {
      color: var(--kz-text);
      font-size: 15px;
      line-height: 1.45;
    }
    > .kz-icon {
      transition: transform 0.15s;
    }
    &:hover > .kz-icon {
      transform: translateX(4px);
    }
    @media (max-width: 576px) {
      gap: 12px;
      padding: 16px;
    }
  }
  &__ic {
    display: grid;
    place-items: center;
    width: 60px;
    height: 60px;
    border-radius: 18px;
    background: #fff;

    @media (max-width: 576px) {
      width: 48px;
      height: 48px;
    }
  }
}
</style>
