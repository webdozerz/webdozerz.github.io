<script lang="ts" setup>
import FaIcon from '~/components/redesign/fermaaltaya/FaIcon.vue'

useSeoMeta({ title: 'Мы в магазинах — Ферма Алтая | Концепт редизайна' })
const city = ref(faStores[0].city)
const list = computed(() => faStores.find((s) => s.city === city.value)!.list)
const total = faStores.reduce((a, s) => a + s.list.length, 0)
const map = (s: string) => `https://yandex.ru/maps/?text=${encodeURIComponent(`${city.value === 'Алтайский край' ? 'Алтайский край' : city.value}, ${s}`)}`
</script>

<template>
  <div class="fa-wrap fa-info fa-stores">
    <nav class="fa-crumbs" aria-label="Навигация">
      <NuxtLink :to="faPath()">Главная</NuxtLink>
      <span>Мы в магазинах</span>
    </nav>
    <h1 class="fa-info__h1">Мы в магазинах</h1>
    <p class="fa-stores__lead">Нашу продукцию можно купить в {{ total }} магазинах Новосибирска, Барнаула и Алтайского края.</p>

    <div class="fa-tabs fa-stores__tabs" role="group" aria-label="Город">
      <button v-for="s in faStores" :key="s.city" type="button" :class="{ 'is-on': city === s.city }" @click="city = s.city">
        {{ s.city }} <small>{{ s.list.length }}</small>
      </button>
    </div>
    <ul class="fa-stores__list">
      <li v-for="s in list" :key="s">
        <FaIcon name="pin" />
        <span>{{ s }}</span>
        <a :href="map(s)" target="_blank" rel="noopener" class="fa-link">На карте</a>
      </li>
    </ul>

    <section class="fa-section">
      <div class="fa-b2b">
        <div>
          <h2>Для магазинов</h2>
          <p>Поставляем в Новосибирск и Барнаул. Ассортимент можно посмотреть сразу, оптовые цены и оформление заказов — после подтверждения заявки.</p>
        </div>
        <div class="fa-b2b__btns">
          <a :href="FA_B2B" target="_blank" rel="noopener" class="fa-btn fa-btn--main">Посмотреть ассортимент</a>
          <a :href="FA_B2B" target="_blank" rel="noopener" class="fa-btn fa-btn--line">Подать заявку</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.fa-stores {
  &__lead {
    margin: -8px 0 22px;
    color: var(--fa-muted);
    font-size: 18px;
  }
  &__tabs {
    max-width: 560px;

    small {
      color: var(--fa-muted);
      font-weight: 500;
    }
  }
  ul.fa-stores__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 32px;
    margin-top: 18px;

    li {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid var(--fa-line);
    }
    .fa-icon {
      color: var(--fa-accent);
    }
    .fa-link {
      font-size: 15px;
      white-space: nowrap;
    }
  }
  .fa-b2b {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px 32px;
    padding: 30px 36px;
    border-radius: 22px;
    background: var(--fa-soft);

    p {
      max-width: 620px;
      margin-top: 8px;
    }
    &__btns {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    @media (max-width: 989px) {
      flex-direction: column;
      align-items: stretch;
      padding: 24px 20px;
    }
  }
  @media (max-width: 768px) {
    ul.fa-stores__list {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 576px) {
    &__tabs {
      overflow-x: auto;
    }
    ul.fa-stores__list li {
      grid-template-columns: auto minmax(0, 1fr);

      .fa-link {
        grid-column: 2;
      }
    }
  }
}
</style>
