<script lang="ts" setup>
import '~/assets/scss/home.scss'

useHomeHead()
useSeoMeta({
  title: 'Концепты редизайна | webdozerz',
  robots: 'noindex, nofollow',
})

const projects = [
  {
    to: '/redesign/baltikprodukt/',
    image: '/redesign/baltikprodukt/og.jpg',
    title: 'Балтик продукт',
    text: 'Рыбная база в Туле с 1995 года, опт и розница +3 %: прайс на 354 позиции с поиском, цена коробкой с подсказкой «ещё 6 банок — и цена 74 ₽», список заказа с готовым письмом менеджеру, условия и реквизиты на одной странице.',
    source: 'https://www.baltikprodukt.ru',
    tags: ['Nuxt 3', 'Vue', '1С-Битрикс'],
  },
  {
    to: '/redesign/papinalavka/',
    image: '/redesign/papinalavka/og.jpg',
    title: 'Папина лавка',
    text: 'Натуральные продукты с экоферм под заказ, Воронеж: доска ближайших поставок с датами и сроком заказа на первом экране, 34 раздела с круглыми фото и деревянными табличками, поиск с подсказками, корзина с датой привоза у каждой позиции, доставкой или одним из 7 офисов.',
    source: 'https://papinalavka.ru',
    tags: ['Nuxt 3', 'Vue', 'самописная CMS'],
  },
  {
    to: '/redesign/mrkfish/',
    image: '/redesign/mrkfish/og.jpg',
    title: 'Миякинская Рыбная Компания',
    text: 'Производитель копчёной, солёной и вяленой рыбы из Башкортостана, опт без цен на сайте: каталог 58 позиций по разделам вместо одностраничника, фасовки в карточке, «В заявку» в кг или упаковках и готовый запрос прайса в отдел продаж, две площадки с картами.',
    source: 'https://www.mrkfish.ru',
    tags: ['Nuxt 3', 'Vue', 'Платформа LP'],
  },
  {
    to: '/redesign/produkt24/',
    image: '/redesign/produkt24/og.jpg',
    title: '24produkt',
    text: 'Продукты оптом и в розницу со склада в Красноярске: прайс из 1С на 645 позиций с поиском и понятными группами, три колонки цен одним переключателем, список с весом до доставки от 200 кг и крупного опта от 1 т, готовая заявка менеджеру вместо корзины.',
    source: 'https://24-produkt.ru',
    tags: ['Nuxt 3', 'Vue', 'Drupal'],
  },
  {
    to: '/redesign/mnerozy/',
    image: '/redesign/mnerozy/og.jpg',
    title: 'Мне розы',
    text: 'Круглосуточная доставка цветов по Томску: охапка роз Эквадор поштучно на первом экране — число, цвет и длина, цена за розу сама снижается на ступенях 15/25/51; поиск с фото и ценой, варианты оформления с доплатой в карточке, зоны доставки, дата и интервал в оформлении.',
    source: 'https://mnerozy.ru',
    tags: ['Nuxt 3', 'Vue', 'OpenCart'],
  },
  {
    to: '/redesign/naslagdenia/',
    image: '/redesign/naslagdenia/og.jpg',
    title: 'Наслаждение',
    text: 'Сеть кондитерских в Новосибирске: два пути на первом экране — готовый торт сегодня с живым временем доставки и заказной к дате; расчёт заказного торта по числу гостей с начинкой из готовых тортов, ближайшей датой и предоплатой, пирожные с ценой коробки, 12 магазинов на карте.',
    source: 'https://naslagdenia.com',
    tags: ['Nuxt 3', 'Vue', 'MODX'],
  },
  {
    to: '/redesign/bukety/',
    image: '/redesign/bukety/og.jpg',
    title: 'Любимые Букеты',
    text: 'Круглосуточная доставка цветов по Томску: подбор букета по получателю и бюджету на первом экране, живое «привезём к 15:20», состав и варианты с ценой в карточке, открытка с превью, фото вручения, анонимная доставка и выбор интервала в оформлении.',
    source: 'https://bukety.tomsk.ru',
    tags: ['Nuxt 3', 'Vue', 'OpenCart'],
  },
  {
    to: '/redesign/38pchel/',
    image: '/redesign/38pchel/og.jpg',
    title: '38пчёл',
    text: 'Семейная пасека Черепановых под Иркутском: «медовая линейка» из шести сортов от светлого к тёмному, цена каждой фасовки сразу в карточке, прозрачный или севший мёд, пластик или стекло, доставка по зонам Иркутска и фотодневник сезона.',
    source: 'https://38pchel.ru',
    tags: ['Nuxt 3', 'Vue', 'OpenCart'],
  },
  {
    to: '/redesign/lavkafish/',
    image: '/redesign/lavkafish/og.jpg',
    title: 'Лавка Fish',
    text: 'Охлаждённая форель из Хакасии и морепродукты под привоз: каталог из постов Telegram-канала с датами привоза и остатками, цена сама снижается по лесенке «от 3 шт», расчёт суммы по весу и предоплата 1 кг, зоны доставки Томска и Новосибирска.',
    source: 'https://lavkafish.com',
    tags: ['Nuxt 3', 'Vue', 'Tilda'],
  },
  {
    to: '/redesign/fermatomsk/',
    image: '/redesign/fermatomsk/og.jpg',
    title: 'FermaTomsk',
    text: 'Семейная ферма из посёлка Рассвет: история и фото фермы на первом экране, продукты с ценами, список заказа, который сам складывается в сообщение для Telegram или MAX, ближайший день доставки.',
    source: 'https://fermatomsk.ru',
    tags: ['Nuxt 3', 'Vue', 'был одностраничник'],
  },
  {
    to: '/redesign/fermertomska/',
    image: '/redesign/fermertomska/og.jpg',
    title: '«Куендатское»',
    text: 'Молочный завод из Первомайского с доставкой по Томску: снимок всей линейки с ценами по нажатию, фасовки в одной карточке, расчёт дня доставки по расписанию завода, корзина без обязательной регистрации.',
    source: 'https://fermertomska.ru',
    tags: ['Nuxt 3', 'Vue', 'InSales'],
  },
  {
    to: '/redesign/sibirtreid/',
    image: '/redesign/sibirtreid/og.jpg',
    title: '«СибирьТрейд»',
    text: 'Крупнооптовые поставки продуктов из Новосибирска в Якутию: сцена с товарами при прокрутке, каталог из 373 позиций с ценой за упаковку, заявка со шкалой до минимального заказа, цветные формы прайса.',
    source: 'https://sibirtreid.ru',
    tags: ['Nuxt 3', 'Vue', 'WooCommerce'],
  },
  {
    to: '/redesign/rybasibiri/',
    image: '/redesign/rybasibiri/og.jpg',
    title: '«Стиль Продукт»',
    text: 'Рыба и морепродукты из своих цехов в Кемерове: переключатель «Розница / Опт», магазин с понятной ценой за кг и за 100 г, оптовый прайс с заявкой, услуги копчения и заморозки.',
    source: 'https://www.rybasibiri.ru',
    tags: ['Nuxt 3', 'Vue', 'Wix'],
  },
  {
    to: '/redesign/sanych/',
    image: '/redesign/sanych/og.jpg',
    title: 'Мясная лавка «Саныч»',
    text: 'Доставка фермерского мяса по Новосибирску: каталог с ценой за кг и весом куска, выбор разделки, корзина с примерной суммой, опт и рецепты.',
    source: 'http://доставка-мяса.рф',
    tags: ['Nuxt 3', 'Vue', 'конструктор setup.ru'],
  },
  {
    to: '/redesign/tomich/',
    image: '/redesign/tomich/og.jpg',
    title: 'Торговый Дом «Томич»',
    text: 'Мясо, полуфабрикаты и обеды в офис в Томске: меню на завтра, конструктор комплексного обеда, корзина с печатной формой, магазины и кафе.',
    source: 'https://myaso.tomsk.ru',
    tags: ['Nuxt 3', 'Vue', 'самописный сайт'],
  },
  {
    to: '/redesign/foodgood/',
    image: '/redesign/foodgood/og.jpg',
    title: 'FoodGood Tomsk',
    text: 'Магазин здоровой еды на Taplink: 111 товаров по разделам, поиск с подсказками, «Сейчас в сезоне» и корзина, которая собирает заказ для мессенджера.',
    source: 'https://foodgoodtomsk.ru',
    tags: ['Nuxt 3', 'Vue', 'e-commerce'],
  },
  {
    to: '/redesign/sttorg70/',
    image: '/redesign/sttorg70/og.jpg',
    title: 'СТ-ТОРГ70',
    text: 'Продукты оптом и в розницу. Статичные экраны для перекраски WordPress/WooCommerce: главная, каталог, карточка, корзина, доставка.',
    source: 'https://sttorg70.ru',
    tags: ['HTML/CSS', 'WooCommerce', 'только визуал'],
    plain: true,
  },
  {
    to: '/redesign/prodagro/',
    image: '/redesign/prodagro/og.jpg',
    title: 'ПродАгро',
    text: 'Продукты оптом и в розницу в Иркутске: цены за штуку и упаковку, корзина с доставкой от 3 000 ₽, страница для бизнеса.',
    source: 'https://prodmak38.ru',
    tags: ['HTML/CSS', 'Simpla CMS', 'только визуал'],
    plain: true,
  },
  {
    to: '/redesign/sibprod/',
    image: '/redesign/sibprod/og.jpg',
    title: 'Сибирский продукт',
    text: 'Доставка продуктов по Новосибирску: каталог с выпадающим меню, ближайший интервал доставки, своя марка «Сливкин Дом», корзина с выбором дня и времени.',
    source: 'https://sibprod.info',
    tags: ['HTML/CSS', '1С-Битрикс', 'только визуал'],
    plain: true,
  },
]

const ui = useHomeUi()
onMounted(() => ui.syncTheme())

// Домен без протокола и www; строкой, а не через URL, чтобы кириллица не превратилась в punycode.
const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '')
const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <div class="home catalog">
    <div class="shell">
      <NuxtLink to="/" class="catalog__back">
        ← На сайт
      </NuxtLink>

      <header class="catalog__head">
        <span class="catalog__kicker mono">redesign / {{ pad(projects.length) }} концептов</span>
        <h1 class="catalog__title">
          Концепты редизайна
        </h1>
        <p class="catalog__lead">
          Демонстрационные версии сайтов местного бизнеса. Это не официальные сайты компаний:
          тексты, цены и изображения принадлежат их владельцам.
        </p>
      </header>

      <ul class="catalog__grid">
        <li v-for="(p, i) in projects" :key="p.to" class="concept">
          <RedesignCatalogLink :to="p.to" :plain="p.plain" class="concept__preview" tabindex="-1" aria-hidden="true">
            <img v-if="p.image" :src="p.image" alt="" width="1200" height="630" loading="lazy">
            <span v-else class="concept__placeholder">{{ p.title.replace(/[«»]/g, '') }}</span>
          </RedesignCatalogLink>

          <div class="concept__body">
            <div class="concept__meta mono">
              <span>{{ pad(i + 1) }}</span>
              <span>{{ host(p.source) }}</span>
            </div>
            <h2 class="concept__title">
              {{ p.title }}
            </h2>
            <p class="concept__text">
              {{ p.text }}
            </p>
            <p class="concept__stack mono">
              {{ p.tags.join(' · ') }}
            </p>
            <div class="concept__actions">
              <RedesignCatalogLink :to="p.to" :plain="p.plain" class="h-btn h-btn--primary">
                Посмотреть
              </RedesignCatalogLink>
              <a :href="p.source" target="_blank" rel="noopener" class="h-btn">
                Оригинал
                <svg class="concept__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" /></svg>
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.catalog {
  padding: 32px 0 96px;

  &__back {
    color: var(--h-muted);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--h-text);
    }
  }

  &__head {
    max-width: 680px;
    margin: 56px 0 48px;
  }

  &__kicker {
    color: var(--h-accent);
    font-size: 12px;
  }

  &__title {
    margin: 12px 0 0;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.025em;
  }

  &__lead {
    margin: 16px 0 0;
    color: var(--h-muted);
    font-size: 16px;
    line-height: 1.6;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
}

.concept {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--h-line);
  border-radius: 14px;
  background: var(--h-surface);
  overflow: hidden;
  transition: border-color 0.2s, transform 0.25s, box-shadow 0.25s;

  &:hover {
    border-color: var(--h-line-strong);
    box-shadow: var(--h-shadow);
    transform: translateY(-3px);
  }

  &__preview {
    display: block;
    aspect-ratio: 1200 / 630;
    border-bottom: 1px solid var(--h-line);
    background: var(--h-raised);
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  &:hover &__preview img {
    transform: scale(1.035);
  }

  &__placeholder {
    display: grid;
    place-items: center;
    height: 100%;
    padding: 24px;
    background:
      radial-gradient(circle at 1px 1px, var(--h-dot) 1px, transparent 0) 0 0 / 18px 18px,
      radial-gradient(120% 90% at 0% 0%, var(--h-accent-glow), transparent 60%);
    color: var(--h-text);
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 600;
    letter-spacing: -0.02em;
    text-align: center;
  }

  &__body {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    padding: 22px 24px 24px;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    color: var(--h-faint);
    font-size: 12px;

    span:first-child {
      color: var(--h-accent);
    }
  }

  &__title {
    margin: 10px 0 0;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  &__text {
    flex-grow: 1;
    margin: 10px 0 0;
    color: var(--h-text-soft);
    font-size: 15px;
    line-height: 1.55;
  }

  &__stack {
    margin: 16px 0 0;
    color: var(--h-faint);
    font-size: 12px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;

    .h-btn {
      gap: 6px;
      height: 40px;
      padding: 0 16px;
      font-size: 14px;
    }
  }

  &__arrow {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

@media (max-width: 760px) {
  .catalog {
    padding-top: 20px;

    &__head {
      margin: 36px 0 32px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .concept__body {
    padding: 18px 18px 20px;
  }
}

@media (max-width: 420px) {
  .catalog .shell {
    padding: 0 16px;
  }

  .concept__actions .h-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
