<script lang="ts" setup>
useSeoMeta({
  title: 'Концепты редизайна | webdozerz',
  robots: 'noindex, nofollow',
})

const projects = [
  {
    to: '/redesign/foodgood/',
    title: 'FoodGood Tomsk',
    text: 'Магазин здоровой еды: ягоды, фермерское мясо, рыба. Каталог, корзина и оформление заказа.',
    source: 'https://foodgoodtomsk.ru',
    tags: ['Nuxt 3', 'Vue', 'e-commerce'],
  },
  {
    to: '/redesign/sttorg70/',
    title: 'СТ-ТОРГ70',
    text: 'Продукты оптом и в розницу. Статичные экраны для перекраски WordPress/WooCommerce: главная, каталог, карточка, корзина, доставка.',
    source: 'https://sttorg70.ru',
    tags: ['HTML/CSS', 'WooCommerce', 'только визуал'],
    plain: true,
  },
]
</script>

<template>
  <main class="wrap">
    <h1>Концепты редизайна</h1>
    <p class="lead">
      Демонстрационные версии сайтов местного бизнеса. Это не официальные сайты компаний:
      тексты, цены и изображения принадлежат их владельцам.
    </p>

    <ul class="list">
      <li v-for="p in projects" :key="p.to">
        <!-- Статичные концепты рисуем только в браузере, чтобы краулер Nuxt не пытался их prerender-ить. -->
        <ClientOnly v-if="p.plain">
          <a :href="p.to" class="card">
            <h2>{{ p.title }}</h2>
            <p>{{ p.text }}</p>
            <div class="tags">
              <span v-for="t in p.tags" :key="t">{{ t }}</span>
            </div>
          </a>
        </ClientOnly>
        <NuxtLink v-else :to="p.to" class="card">
          <h2>{{ p.title }}</h2>
          <p>{{ p.text }}</p>
          <div class="tags">
            <span v-for="t in p.tags" :key="t">{{ t }}</span>
          </div>
        </NuxtLink>
        <a :href="p.source" target="_blank" rel="noopener" class="source">Оригинал</a>
      </li>
    </ul>
  </main>
</template>

<style lang="scss" scoped>
.wrap {
  max-width: 760px;
  margin: 0 auto;
  padding: 72px 20px;
  font-family: 'Inter', system-ui, sans-serif;
}

h1 {
  font-size: 40px;
  margin: 0 0 12px;
}

.lead {
  margin: 0 0 40px;
  color: #9a9a9a;
  line-height: 1.6;
}

.list {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
  }
}

.card {
  display: block;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #2c2c2c;
  background: #161616;
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: #4fc3f7;
    transform: translateY(-2px);
  }

  h2 {
    margin: 0 0 8px;
    font-size: 22px;
  }

  p {
    margin: 0 0 16px;
    color: #b5b5b5;
    line-height: 1.55;
  }
}

.tags {
  display: flex;
  gap: 8px;

  span {
    padding: 3px 10px;
    border-radius: 999px;
    background: #232323;
    font-size: 12px;
    color: #9a9a9a;
  }
}

.source {
  position: absolute;
  top: 24px;
  right: 24px;
  font-size: 13px;
  color: #9a9a9a;
  text-decoration: underline;
}
</style>
