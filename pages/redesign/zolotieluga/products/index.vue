<script lang="ts" setup>
import ZlIcon from '~/components/redesign/zolotieluga/ZlIcon.vue'
import ZlCard from '~/components/redesign/zolotieluga/ZlCard.vue'
import type { ZlBrand } from '~/utils/zolotieluga'

const route = useRoute()
const router = useRouter()
const brand = computed<ZlBrand | 'all'>(() => (route.query.brand === 'zl' || route.query.brand === 'sit' ? route.query.brand : 'all'))
const list = computed(() => (brand.value === 'all' ? zlProducts : zlProducts.filter((p) => p.brand === brand.value)))
const info = computed(() => zlBrands.find((b) => b.id === brand.value))
const setBrand = (b: ZlBrand | 'all') => router.replace({ query: b === 'all' ? {} : { brand: b } })
const count = (b: ZlBrand) => zlProducts.filter((p) => p.brand === b).length
</script>

<template>
  <div class="zl-wrap zl-page">
    <nav class="zl-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="zlPath('/')">Главная</NuxtLink></span>
      <span>Продукция</span>
    </nav>
    <h1>Продукция</h1>
    <p class="zl-page__lead">
      {{ zlProducts.length }} продуктов двух марок. Цен на сайте нет — продукцию покупают в магазинах-партнёрах, а оптовики заказывают через
      <NuxtLink :to="zlPath('/opt')" class="zl-link">отдел продаж</NuxtLink>.
    </p>

    <div class="zl-catbar">
      <div class="zl-tabs" role="tablist" aria-label="Марка">
        <button type="button" role="tab" :aria-selected="brand === 'all'" :class="{ 'is-on': brand === 'all' }" @click="setBrand('all')">
          Все <small>{{ zlProducts.length }}</small>
        </button>
        <button
          v-for="b in zlBrands"
          :key="b.id"
          type="button"
          role="tab"
          :aria-selected="brand === b.id"
          :class="{ 'is-on': brand === b.id }"
          @click="setBrand(b.id)"
        >
          {{ b.title }} <small>{{ count(b.id) }}</small>
        </button>
        <a :href="zlZdorovo.url" target="_blank" rel="noopener">{{ zlZdorovo.title }} <ZlIcon name="external" :size="14" /></a>
      </div>
      <NuxtLink :to="zlPath('/where')" class="zl-link"><ZlIcon name="pin" :size="18" /> Где купить</NuxtLink>
    </div>

    <div v-if="info" class="zl-brandhead" :class="'zl-brandhead--' + info.id">
      <img :src="zlImg(info.img)" :alt="info.title" width="261" height="250" />
      <div>
        <h2>{{ info.title }}</h2>
        <p>{{ info.note }}<template v-if="info.since">. Комбинат работает {{ info.since }}.</template></p>
      </div>
    </div>

    <div class="zl-grid">
      <ZlCard v-for="p in list" :key="p.id" :product="p" />
      <a v-if="brand === 'all'" :href="zlZdorovo.url" target="_blank" rel="noopener" class="zl-grid__ext">
        <img :src="zlImg(zlZdorovo.img)" :alt="zlZdorovo.title" width="261" height="250" />
        <b>{{ zlZdorovo.title }}</b>
        <span>{{ zlZdorovo.note }}</span>
        <span class="zl-link">Перейти на zdorovo.life <ZlIcon name="external" :size="16" /></span>
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.zl-catbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 28px 0 24px;
  .zl-tabs {
    min-width: 0;
  }
}
.zl-brandhead {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px 24px;
  border-radius: var(--zl-R);
  background: var(--zl-soft);
  &--sit {
    background: var(--zl-sit-bg);
  }
  img {
    width: 84px;
    flex: none;
  }
  h2 {
    font-size: 24px;
  }
  p {
    margin-top: 4px;
    color: var(--zl-text);
  }
}
.zl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 16px;
  &__ext {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 22px;
    border-radius: var(--zl-R);
    background: #fdeef5;
    img {
      width: 110px;
      margin-bottom: 8px;
    }
    b {
      font-family: var(--zl-head);
      font-size: 20px;
      color: var(--zl-ink);
    }
    span {
      font-size: 14px;
      color: var(--zl-muted);
    }
    .zl-link {
      margin-top: auto;
      color: #c2186b;
      font-size: 15px;
    }
  }
}
@media (max-width: 768px) {
  .zl-catbar {
    flex-direction: column;
    align-items: stretch;
    margin: 20px 0 16px;
    > .zl-link {
      display: none;
    }
  }
  .zl-brandhead {
    padding: 16px;
    gap: 14px;
    img {
      width: 64px;
    }
    h2 {
      font-size: 20px;
    }
    p {
      font-size: 14px;
    }
  }
}
@media (max-width: 576px) {
  .zl-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
}
</style>
