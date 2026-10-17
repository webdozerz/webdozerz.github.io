<script lang="ts" setup>
const cart = useSanychCart()
const recipes = snRecipes.map((r) => ({ ...r, product: r.meat ? snFind(r.meat) : undefined }))
useSeoMeta({ title: 'Рецепты | Мясная лавка «Саныч», концепт', robots: 'noindex, nofollow' })

const addMeat = (p: SnProduct) => cart.add(p.id, snMin(p), p.cut ? 'whole' : '')
</script>

<template>
  <div class="sn-wrap sni">
    <div class="sn-pagehead">
      <nav class="sn-crumbs" aria-label="Навигация">
        <NuxtLink :to="snPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>Рецепты</span>
      </nav>
      <h1>Рецепты</h1>
      <p>Что приготовить из нашего мяса — и сразу положить нужное в корзину.</p>
    </div>

    <div class="snr-list">
      <article v-for="r in recipes" :key="r.title" class="snr-item">
        <img :src="snImg(r.img)" :alt="r.title" width="340" height="255" loading="lazy" />
        <div class="snr-item__body">
          <h2>{{ r.title }}</h2>
          <span class="snr-item__label">Ингредиенты</span>
          <ul>
            <li v-for="item in r.items" :key="item">{{ item }}</li>
          </ul>
          <div v-if="r.product" class="snr-item__meat">
            <NuxtLink :to="snPath(`/product/${r.product.id}`)">
              <b>{{ r.product.name }}</b>
              <span>{{ snRub(r.product.price) }} {{ snPer(r.product) }}</span>
            </NuxtLink>
            <button
              type="button"
              class="sn-btn"
              :class="{ 'sn-btn--done': cart.inCart(r.product.id) }"
              @click="cart.inCart(r.product.id) ? navigateTo(snPath('/cart')) : addMeat(r.product)"
            >
              {{ cart.inCart(r.product.id) ? 'В корзине' : `Добавить ${snQtyLabel(r.product, snMin(r.product))}` }}
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style lang="scss">
.sn .snr-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.sn .snr-item {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
  gap: 20px;
  padding: 14px;
  border-radius: var(--sn-r-lg);
  background: var(--sn-paper);

  > img {
    width: 100%;
    height: 100%;
    min-height: 220px;
    object-fit: cover;
    border-radius: 16px;
  }
}

.sn .snr-item__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 6px 6px 0;
  min-width: 0;

  h2 {
    font-size: 20px;
  }

  ul {
    padding-left: 18px;
    color: var(--sn-muted);
    font-size: 14px;
  }
}

.sn .snr-item__label {
  margin-top: 4px;
  font-size: 13px;
  font-weight: 700;
}

.sn .snr-item__meat {
  display: grid;
  gap: 10px;
  margin-top: auto;
  padding-top: 12px;

  a {
    display: grid;
    font-size: 14px;

    span {
      color: var(--sn-muted);
    }

    &:hover b {
      color: var(--sn-red);
    }
  }

  .sn-btn {
    min-height: 42px;
  }
}

@media (max-width: 1024px) {
  .sn .snr-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .sn .snr-item {
    grid-template-columns: 1fr;
    gap: 12px;

    > img {
      min-height: 0;
      aspect-ratio: 4 / 3;
      height: auto;
    }
  }
}
</style>
