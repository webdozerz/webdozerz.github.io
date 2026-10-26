<script lang="ts" setup>
import type { NsShop } from '~/utils/naslagdeniaData'
import NsIcon from '~/components/redesign/naslagdenia/NsIcon.vue'

// 12 магазинов: список и Яндекс-карта; выбор магазина приближает карту к нему.
const route = useRoute()
const focus = ref<NsShop | undefined>()
const mapSrc = computed(() => nsMapUrl(nsShops, focus.value))
const pick = (s: NsShop) => {
  focus.value = s
  if (window.matchMedia('(max-width: 989px)').matches) document.querySelector('.ns-stores__map')?.scrollIntoView({ behavior: 'smooth' })
}
onMounted(() => {
  const id = route.hash.replace('#shop-', '')
  const s = nsShops.find((x) => x.id === id)
  if (s) focus.value = s
})
useSeoMeta({ title: 'Магазины — кондитерская «Наслаждение» | Концепт редизайна' })
</script>

<template>
  <div class="ns-wrap ns-stores">
    <nav class="ns-crumbs" aria-label="Навигация">
      <NuxtLink :to="nsPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Магазины</span>
    </nav>
    <h1 class="ns-page-title">12 магазинов в Новосибирске и Оби</h1>
    <p class="ns-page-lead">
      В любом магазине можно купить готовый торт, забрать заказ и внести предоплату за заказной. Телефон один на все магазины —
      <a :href="nsContacts.phoneHref">{{ nsContacts.phone }}</a
      >.
    </p>

    <div class="ns-stores__grid">
      <ul class="ns-stores__list">
        <li v-for="(s, i) in nsShops" :id="`shop-${s.id}`" :key="s.id" class="ns-store" :class="{ 'is-on': focus?.id === s.id }">
          <button type="button" class="ns-store__main" @click="pick(s)">
            <i>{{ i + 1 }}</i>
            <span>
              <b>{{ s.title }}</b>
              <small v-if="s.note">{{ s.note }}</small>
              <small class="ns-store__hours"><NsIcon name="clock" :size="16" /> {{ s.hours ?? 'часы работы — по телефону' }}</small>
            </span>
          </button>
          <a :href="nsRouteUrl(s)" target="_blank" rel="noopener" class="ns-store__route" :aria-label="`Маршрут до магазина ${s.title}`">
            <NsIcon name="route" :size="20" />
            <span>Маршрут</span>
          </a>
        </li>
      </ul>
      <div class="ns-stores__map">
        <iframe :key="mapSrc" :src="mapSrc" title="Магазины на карте" loading="lazy" />
        <button v-if="focus" type="button" class="ns-btn ns-btn--line ns-stores__all" @click="focus = undefined">
          Все магазины на карте
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ns .ns-stores {
  .ns-page-lead a {
    font-weight: 600;
    color: var(--ns-accent);
    white-space: nowrap;
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
    gap: 20px;
    align-items: start;
    margin-top: 28px;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  ul.ns-stores__list {
    display: grid;
    gap: 8px;
  }

  &__map {
    position: sticky;
    top: 136px;
    height: calc(100vh - 170px);
    min-height: 420px;
    overflow: hidden;
    background: var(--ns-surface);
    border-radius: var(--ns-r-panel);

    iframe {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
    }

    @media (max-width: 989px) {
      position: relative;
      top: 0;
      order: -1;
      height: 380px;
      min-height: 0;
      scroll-margin-top: 120px;
    }
  }

  &__all {
    position: absolute;
    bottom: 16px;
    left: 16px;
  }
}

.ns .ns-store {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px 6px 6px;
  border: 1px solid var(--ns-line);
  border-radius: var(--ns-r-card);

  &.is-on {
    border-color: var(--ns-accent);
    background: var(--ns-surface);
  }

  &__main {
    display: flex;
    flex: 1;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
    padding: 10px;
    text-align: left;
    background: none;
    border: 0;
    border-radius: 14px;

    i {
      display: grid;
      flex: none;
      place-items: center;
      width: 30px;
      height: 30px;
      font-size: 13px;
      font-style: normal;
      font-weight: 700;
      color: #fff;
      background: var(--ns-accent);
      border-radius: 999px;
    }

    > span {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    b {
      font-size: 16px;
      color: var(--ns-dark);
      overflow-wrap: anywhere;
    }

    small {
      font-size: 13px;
      color: var(--ns-muted);
    }
  }

  &__hours {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  &__route {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    height: 40px;
    padding: 0 12px;
    font-size: 14px;
    font-weight: 600;
    color: var(--ns-accent);
    text-decoration: none;
    background: #fff;
    border: 1px solid var(--ns-line-strong);
    border-radius: var(--ns-r-btn);

    &:hover {
      border-color: var(--ns-accent);
    }
  }

  @media (max-width: 576px) {
    &__route {
      width: 40px;
      padding: 0;
      justify-content: center;

      span {
        display: none;
      }
    }
  }
}
</style>
