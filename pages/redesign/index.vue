<script lang="ts" setup>
useSeoMeta({
  title: 'Концепты редизайна | webdozerz',
  robots: 'noindex, nofollow',
})

const projects = [
  {
    to: '/redesign/sibirtreid/',
    title: '«СибирьТрейд»',
    text: 'Крупнооптовые поставки продуктов из Новосибирска в Якутию: сцена с товарами при прокрутке, каталог из 373 позиций с ценой за упаковку, заявка со шкалой до минимального заказа, цветные формы прайса.',
    source: 'https://sibirtreid.ru',
    tags: ['Nuxt 3', 'Vue', 'WooCommerce'],
  },
  {
    to: '/redesign/rybasibiri/',
    title: '«Стиль Продукт»',
    text: 'Рыба и морепродукты из своих цехов в Кемерове: переключатель «Розница / Опт», магазин с понятной ценой за кг и за 100 г, оптовый прайс с заявкой, услуги копчения и заморозки.',
    source: 'https://www.rybasibiri.ru',
    tags: ['Nuxt 3', 'Vue', 'Wix'],
  },
  {
    to: '/redesign/sanych/',
    title: 'Мясная лавка «Саныч»',
    text: 'Доставка фермерского мяса по Новосибирску: каталог с ценой за кг и весом куска, выбор разделки, корзина с примерной суммой, опт и рецепты.',
    source: 'http://доставка-мяса.рф',
    tags: ['Nuxt 3', 'Vue', 'конструктор setup.ru'],
  },
  {
    to: '/redesign/tomich/',
    title: 'Торговый Дом «Томич»',
    text: 'Мясо, полуфабрикаты и обеды в офис в Томске: меню на завтра, конструктор комплексного обеда, корзина с печатной формой, магазины и кафе.',
    source: 'https://myaso.tomsk.ru',
    tags: ['Nuxt 3', 'Vue', 'самописный сайт'],
  },
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
  {
    to: '/redesign/prodagro/',
    title: 'ПродАгро',
    text: 'Продукты оптом и в розницу в Иркутске: цены за штуку и упаковку, корзина с доставкой от 3 000 ₽, страница для бизнеса.',
    source: 'https://prodmak38.ru',
    tags: ['HTML/CSS', 'Simpla CMS', 'только визуал'],
    plain: true,
  },
  {
    to: '/redesign/sibprod/',
    title: 'Сибирский продукт',
    text: 'Доставка продуктов по Новосибирску: каталог с выпадающим меню, ближайший интервал доставки, своя марка «Сливкин Дом», корзина с выбором дня и времени.',
    source: 'https://sibprod.info',
    tags: ['HTML/CSS', '1С-Битрикс', 'только визуал'],
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
