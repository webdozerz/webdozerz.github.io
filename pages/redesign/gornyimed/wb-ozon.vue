<script lang="ts" setup>
import GmIcon from '~/components/redesign/gornyimed/GmIcon.vue'
import GmJarCard from '~/components/redesign/gornyimed/GmJarCard.vue'

useSeoMeta({ title: 'Наш мёд на Wildberries и Ozon | Пасеки Соловьёвых, концепт редизайна' })
</script>

<template>
  <div class="gm-wrap gm-mpp">
    <nav class="gm-crumbs" aria-label="Навигация">
      <NuxtLink :to="gmPath()">Главная</NuxtLink>
      <span>Наш мёд на Wildberries и Ozon</span>
    </nav>
    <h1 class="gm-title">Наш мёд на Wildberries и Ozon</h1>
    <p class="gm-lead">
      Мы вышли на маркетплейсы для удобства и экономии наших покупателей: доставка подорожала, и заказывать мёд в другие регионы небольшими количествами стало
      невыгодно. Теперь мёд 2026 года сбора доставят почти до вашего дома.
    </p>

    <div class="gm-mpp__grid">
      <a :href="gmContacts.wb" target="_blank" rel="noopener" class="gm-mpp__shop">
        <b>Wildberries</b>
        <span>Магазин «Пасеки Соловьёвых»</span>
        <span class="gm-link">Перейти <GmIcon name="arrow" :size="17" /></span>
      </a>
      <a :href="gmContacts.ozon" target="_blank" rel="noopener" class="gm-mpp__shop">
        <b>Ozon</b>
        <span>Магазин «Пасеки Соловьёвых»</span>
        <span class="gm-link">Перейти <GmIcon name="arrow" :size="17" /></span>
      </a>
      <ul class="gm-mpp__list">
        <li><GmIcon name="check" :size="19" />заказать мёд можно от 1 кг, от 1 штуки</li>
        <li><GmIcon name="check" :size="19" />цена указана уже с доставкой до пункта выдачи</li>
        <li><GmIcon name="check" :size="19" />заказ приходит за 1–3 дня — выручит, когда срочно нужен полезный подарок</li>
        <li><GmIcon name="check" :size="19" />оплата защищена площадкой: пришлют именно тот мёд, который вы заказали</li>
        <li><GmIcon name="check" :size="19" />понравился — повторить заказ можно в пару нажатий</li>
      </ul>
    </div>

    <section class="gm-section">
      <div class="gm-head">
        <div>
          <h2>Или закажите у нас напрямую</h2>
          <p>Те же банки 1, 1,5 и 3 кг — отправим Почтой, Boxberry, OZON, DPD или транспортной компанией.</p>
        </div>
        <NuxtLink :to="gmPath('/shop')" class="gm-link">Наша продукция <GmIcon name="arrow" :size="17" /></NuxtLink>
      </div>
      <div class="gm-jars">
        <GmJarCard v-for="s in gmSorts" :key="s.id" :sort="s.id" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.gm-mpp {
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr)) minmax(0, 1.3fr);
    gap: 16px;
    margin-top: 28px;

    @media (max-width: 989px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  &__shop {
    display: grid;
    align-content: start;
    gap: 6px;
    padding: 24px;
    border: 1px solid var(--gm-line);
    border-radius: var(--gm-R);

    b {
      font-family: 'Lora', Georgia, serif;
      font-size: 28px;
      color: var(--gm-ink);
    }
    > span:not(.gm-link) {
      color: var(--gm-muted);
    }
    .gm-link {
      margin-top: 10px;
    }
    &:hover {
      border-color: var(--gm-accent);
    }
  }
  ul.gm-mpp__list {
    display: grid;
    align-content: start;
    gap: 8px;
    padding: 22px;
    border-radius: var(--gm-R);
    background: var(--gm-surface);

    li {
      display: flex;
      gap: 10px;
      color: var(--gm-ink);

      .gm-icon {
        margin-top: 2px;
        color: var(--gm-green);
      }
    }
    @media (max-width: 989px) {
      grid-column: 1 / -1;
    }
  }
}
</style>
