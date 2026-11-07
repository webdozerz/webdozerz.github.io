<script lang="ts" setup>
import DrIcon from '~/components/redesign/dereda/DrIcon.vue'

useSeoMeta({ title: 'Наши фермеры — Дереда | Концепт редизайна' })

// Порядок — по числу товаров в каталоге; «Дереда» (своё производство) последней
const list = [...drFarmers].sort((a, b) => (a.id === 'dereda' ? 1 : b.id === 'dereda' ? -1 : drFarmerProducts(b.id).length - drFarmerProducts(a.id).length))
const secsOf = (id: string) => [...new Set(drFarmerProducts(id).map((p) => drSection(p.sec)?.title))].filter(Boolean).slice(0, 3)
</script>

<template>
  <div class="dr-wrap dr-page dr-farm">
    <nav class="dr-crumbs" aria-label="Навигация">
      <NuxtLink :to="drPath('/')">Главная</NuxtLink>
      <span>Наши фермеры</span>
    </nav>
    <div class="dr-farm__head">
      <h1>Наши фермеры</h1>
      <p>
        Мы доставляем продукцию напрямую от фермеров, и вы всегда знаете, у кого именно заказываете. Прежде чем внести товар в каталог, мы дегустируем его и
        стараемся лично побывать в хозяйстве.
      </p>
    </div>

    <div class="dr-farm__list">
      <article v-for="f in list" :id="f.id" :key="f.id" class="dr-farm__item">
        <NuxtLink :to="{ path: drPath('/catalog'), query: { farmer: f.id } }" class="dr-farm__photo">
          <img :src="drFarmerImg(f.id)" :alt="f.name" width="360" height="360" loading="lazy" />
        </NuxtLink>
        <div class="dr-farm__body">
          <small v-if="f.place"><DrIcon name="pin" :size="16" />{{ f.place }}</small>
          <h2>{{ f.name }}</h2>
          <p>{{ f.about }}</p>
          <p class="dr-farm__secs">{{ secsOf(f.id).join(' · ') }}</p>
          <div class="dr-farm__goods">
            <NuxtLink v-for="p in drFarmerProducts(f.id).slice(0, 4)" :key="p.id" :to="drPath(`/product/${p.id}`)" :title="p.title">
              <img :src="p.img" :alt="p.title" width="72" height="72" loading="lazy" />
            </NuxtLink>
          </div>
          <NuxtLink :to="{ path: drPath('/catalog'), query: { farmer: f.id } }" class="dr-btn dr-btn--line">
            {{ drFarmerProducts(f.id).length }} {{ drPlural(drFarmerProducts(f.id).length, 'товар', 'товара', 'товаров') }}<DrIcon name="arrow" :size="18" />
          </NuxtLink>
        </div>
      </article>
    </div>

    <div class="dr-farm__join">
      <div>
        <h2>Вы фермер?</h2>
        <p>Если хотите, чтобы ваша продукция появилась в «Дереде», напишите нам.</p>
      </div>
      <NuxtLink :to="drPath('/o-nas#postavshchikam')" class="dr-btn dr-btn--main">Стать поставщиком</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.dr-farm {
  &__head {
    display: grid;
    gap: 12px;
    max-width: 820px;
    margin-bottom: 28px;
    font-size: 18px;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__item {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 22px;
    padding: 18px;
    border: 1px solid var(--dr-line);
    border-radius: var(--dr-R);
    scroll-margin-top: calc(var(--dr-stuck, 120px) + 16px);

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
    }

    &:target {
      border-color: var(--dr-accent);
      box-shadow: 0 0 0 3px var(--dr-accent-soft);
    }
  }

  &__photo {
    position: relative;
    display: block;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 18px;
    background: var(--dr-surface);

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 576px) {
      aspect-ratio: 16 / 10;
    }
  }

  &__body {
    display: grid;
    align-content: start;
    justify-items: start;
    gap: 8px;

    small {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: var(--dr-muted);
    }

    h2 {
      font-size: 28px;
    }
  }

  &__secs {
    color: var(--dr-muted);
    font-size: 15px;
  }

  &__goods {
    display: flex;
    gap: 8px;
    margin: 4px 0 6px;

    img {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      object-fit: cover;
    }
  }

  &__join {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px 32px;
    margin-top: 32px;
    padding: 28px 32px;
    border-radius: var(--dr-R);
    background: var(--dr-accent-soft);

    > div {
      display: grid;
      gap: 6px;
    }

    @media (max-width: 576px) {
      padding: 22px 18px;
    }
  }
}
</style>
