<script lang="ts" setup>
import PlIcon from '~/components/redesign/papinalavka/PlIcon.vue'

const route = useRoute()
const router = useRouter()
const cart = usePapinalavkaCart()
const ui = usePapinalavkaUi()

useSeoMeta({
  title: 'Папина лавка — натуральные продукты с экоферм с доставкой по Воронежу | Концепт редизайна',
  description:
    'Концепт редизайна сайта «Папиной лавки»: доска ближайших поставок, каталог 34 разделов с поиском, корзина с датой привоза у каждой позиции, 7 офисов выдачи в Воронеже и Новой Усмани.',
  ogTitle: 'Папина лавка — концепт редизайна',
  ogDescription: 'Продукты с экоферм под заказ: ближайшие поставки на первом экране, каталог с поиском, корзина с датой привоза.',
  ogImage: 'https://andryushov.me/redesign/papinalavka/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'pl-html', lang: 'ru' },
  bodyAttrs: { class: 'pl-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=PT+Sans:ital,wght@0,400;0,700;1,400&display=swap' },
  ],
})

const next = computed(() => plNextDelivery())
const catalogOpen = ref(false)
const cityOpen = ref(false)
const mounted = ref(false)
const q = ref('')
const searchFocus = ref(false)
const suggest = computed(() => (q.value.trim().length > 1 ? plSearch(q.value, 6) : []))
const found = computed(() => (q.value.trim().length > 1 ? plSearch(q.value).length : 0))

const goSearch = () => {
  if (!q.value.trim()) return
  searchFocus.value = false
  router.push({ path: plSectionPath(), query: { q: q.value.trim() } })
}
const pickCity = (c: string) => {
  cart.city.value = c
  cart.cityAsked.value = true
  cityOpen.value = false
}

onMounted(() => {
  cart.persist()
  mounted.value = true
})
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    catalogOpen.value = false
    searchFocus.value = false
  },
)
watch(
  () => ui.menu.value,
  (v) => import.meta.client && document.documentElement.classList.toggle('pl-lock', v),
)

const is = (p: string) => route.path.startsWith(plPath(p))
const isCatalog = computed(() => is('/catalog') || is('/product'))
const year = new Date().getFullYear()

// Вариант дерева для сравнения: ?wood=png|oak|pine|cork, запоминается до конца сессии.
const woods = ['oak', 'png', 'pine', 'cork']
const wood = useState<string>('pl-wood', () => (woods.includes(String(route.query.wood)) ? String(route.query.wood) : 'oak'))
const pickWood = (v: unknown) => woods.includes(String(v)) && (wood.value = String(v))
// Страницы собираются статикой без query — параметр читаем ещё раз в браузере.
onMounted(() => pickWood(route.query.wood))
watch(() => route.query.wood, pickWood)
const nav = [
  { to: '/deliveries', label: 'Ближайшие поставки', short: 'Поставки' },
  { to: '/delivery', label: 'Доставка и оплата', short: 'Доставка' },
  { to: '/about', label: 'О нас' },
  { to: '/contacts', label: 'Контакты' },
] as { to: string; label: string; short?: string }[]
</script>

<template>
  <div class="pl" :data-wood="wood">
    <div class="pl-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="plContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <div class="pl-strip">
      <div class="pl-wrap pl-strip__row">
        <NuxtLink :to="plPath('/deliveries')" class="pl-strip__next">
          <PlIcon name="truck" :size="18" />
          <span class="pl-strip__long">Ближайшая поставка {{ plWeekdayAcc(next.date) }}, {{ plDay(next.date) }} · заказ {{ plDeadlineLabel(next.date) }}</span>
          <span class="pl-strip__short">Поставка {{ plWeekday(next.date) }}, {{ plDay(next.date) }}</span>
        </NuxtLink>
        <div class="pl-strip__right">
          <div class="pl-city">
            <button type="button" class="pl-city__btn" :aria-expanded="cityOpen" @click="cityOpen = !cityOpen">
              <PlIcon name="pin" :size="17" />
              <span>{{ cart.city.value }}</span>
              <PlIcon name="down" :size="15" />
            </button>
            <div v-if="mounted && !cart.cityAsked.value && !cityOpen" class="pl-city__ask">
              <p>Ваш город — <b>Воронеж</b>?</p>
              <div>
                <button type="button" class="pl-btn pl-btn--main pl-btn--sm" @click="pickCity('Воронеж')">Да</button>
                <button type="button" class="pl-btn pl-btn--line pl-btn--sm" @click="cityOpen = true">Другой</button>
              </div>
            </div>
            <div v-if="cityOpen" class="pl-city__menu">
              <p>Цены, наличие и доставка зависят от города</p>
              <button v-for="c in plCities" :key="c" type="button" :class="{ 'is-active': c === cart.city.value }" @click="pickCity(c)">
                {{ c }}
              </button>
            </div>
          </div>
          <a :href="plTel(plContacts.phone)" class="pl-strip__phone">{{ plContacts.phone }}</a>
        </div>
      </div>
    </div>

    <header class="pl-header">
      <div class="pl-wrap pl-header__row">
        <button type="button" class="pl-iconbtn pl-header__burger" aria-label="Меню" @click="ui.menu.value = true">
          <PlIcon name="menu" />
        </button>

        <NuxtLink :to="plPath()" class="pl-logo" aria-label="Папина лавка, на главную">
          <img :src="plAsset('logo.png')" alt="Папина лавка — натуральные продукты с доставкой" width="246" height="207" />
        </NuxtLink>

        <div class="pl-header__catalog" @mouseleave="catalogOpen = false">
          <button
            type="button"
            class="pl-btn pl-btn--main pl-header__catbtn"
            :class="{ 'is-active': isCatalog }"
            :aria-expanded="catalogOpen"
            @click="catalogOpen = !catalogOpen"
          >
            <PlIcon :name="catalogOpen ? 'close' : 'grid'" :size="20" />
            <span>Каталог</span>
          </button>
          <div v-show="catalogOpen" class="pl-mega">
            <div class="pl-mega__grid">
              <NuxtLink v-for="s in plSections" :key="s.id" :to="plSectionPath(s.id)" class="pl-mega__item">
                <img :src="plSecImg(s.img)" alt="" width="56" height="56" loading="lazy" />
                <span>
                  <b>{{ s.name }}</b>
                  <small>{{ plGoods(s.count) }}</small>
                </span>
              </NuxtLink>
            </div>
            <NuxtLink :to="plSectionPath()" class="pl-mega__all">Весь каталог, 491 товар <PlIcon name="arrow" :size="18" /></NuxtLink>
          </div>
        </div>

        <form class="pl-search" role="search" @submit.prevent="goSearch">
          <PlIcon name="search" :size="20" />
          <input
            v-model="q"
            type="search"
            placeholder="Форель, творог, мёд…"
            aria-label="Поиск по каталогу"
            @focus="searchFocus = true"
            @blur="searchFocus = false"
          />
          <button type="submit" class="pl-search__go">Найти</button>
          <div v-if="searchFocus && q.trim().length > 1" class="pl-search__drop" @mousedown.prevent>
            <NuxtLink v-for="p in suggest" :key="p.id" :to="plProductPath(p.id)" class="pl-search__item">
              <img :src="plImg(p.img)" alt="" width="64" height="44" />
              <span>{{ p.name }}</span>
              <b>{{ plFmt(p.price) }}</b>
            </NuxtLink>
            <p v-if="!suggest.length" class="pl-search__empty">Ничего не нашли. Позвоните — подскажем: {{ plContacts.phone }}</p>
            <button v-else type="button" class="pl-search__all" @click="goSearch">Все результаты: {{ plGoods(found) }}</button>
          </div>
        </form>

        <nav class="pl-nav" aria-label="Разделы сайта">
          <NuxtLink v-for="n in nav" :key="n.to" :to="plPath(n.to)" :class="{ 'is-active': is(n.to) }">{{ n.short ?? n.label }}</NuxtLink>
        </nav>

        <NuxtLink :to="plPath('/cart')" class="pl-cartbtn" :class="{ 'is-full': cart.count.value }" aria-label="Корзина">
          <PlIcon name="basket" />
          <span class="pl-cartbtn__n">{{ cart.count.value }}</span>
          <span class="pl-cartbtn__sum">{{ cart.count.value ? plFmt(cart.total.value) : 'Корзина' }}</span>
        </NuxtLink>
      </div>
    </header>

    <main class="pl-main">
      <NuxtPage />
    </main>

    <footer class="pl-footer">
      <div class="pl-wrap pl-footer__grid">
        <div class="pl-footer__brand">
          <img :src="plAsset('logo.png')" alt="Папина лавка" width="246" height="207" />
          <p>Натуральные продукты с экоферм под заказ. Привозим к поставке, выдаём в 7 офисах Воронежа и Новой Усмани, возим по городу.</p>
          <div class="pl-footer__social">
            <a :href="plContacts.vk" target="_blank" rel="noopener" aria-label="ВКонтакте"><PlIcon name="vk" /></a>
            <a :href="plContacts.tg" target="_blank" rel="noopener" aria-label="Telegram"><PlIcon name="tg" /></a>
          </div>
        </div>
        <div>
          <h3>Покупателям</h3>
          <ul>
            <li v-for="n in nav" :key="n.to">
              <NuxtLink :to="plPath(n.to)">{{ n.label }}</NuxtLink>
            </li>
            <li><NuxtLink :to="plPath('/about') + '#farmers'">Фермерам и поставщикам</NuxtLink></li>
          </ul>
        </div>
        <div class="pl-footer__cats">
          <h3>Каталог</h3>
          <ul>
            <li v-for="s in plSections.slice(0, 12)" :key="s.id">
              <NuxtLink :to="plSectionPath(s.id)">{{ s.name }}</NuxtLink>
            </li>
            <li><NuxtLink :to="plSectionPath()">Все 34 раздела</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3>Контакты</h3>
          <ul class="pl-footer__contacts">
            <li><a :href="plTel(plContacts.phone)" class="pl-footer__phone">{{ plContacts.phone }}</a></li>
            <li>
              <a :href="`mailto:${plContacts.orders}`">{{ plContacts.orders }}</a>
            </li>
            <li>Офисы ежедневно 9:00–20:00, «Пять столиц» до 22:00</li>
            <li>Заказы с сайта — 9:00–19:00</li>
          </ul>
        </div>
      </div>
      <div class="pl-wrap pl-footer__legal">
        <p>
          © 2010–{{ year }} «Папина лавка», {{ plContacts.legal }}. Концепт редизайна сайта papinalavka.ru: тексты, цены, фотографии, логотип и
          гравюры принадлежат владельцу магазина и взяты с оригинального сайта для демонстрации.
        </p>
        <a :href="plContacts.original" target="_blank" rel="noopener">papinalavka.ru</a>
      </div>
    </footer>

    <Transition name="pl-fade">
      <div v-if="ui.menu.value" class="pl-drawer" role="dialog" aria-label="Меню" @click.self="ui.menu.value = false">
        <div class="pl-drawer__panel">
          <div class="pl-drawer__head">
            <b>Меню</b>
            <button type="button" class="pl-iconbtn" aria-label="Закрыть меню" @click="ui.menu.value = false"><PlIcon name="close" /></button>
          </div>
          <nav class="pl-drawer__nav">
            <NuxtLink :to="plPath()">Главная</NuxtLink>
            <NuxtLink v-for="n in nav" :key="n.to" :to="plPath(n.to)">{{ n.label }}</NuxtLink>
            <NuxtLink :to="plPath('/cart')">Корзина{{ cart.count.value ? ` · ${plFmt(cart.total.value)}` : '' }}</NuxtLink>
          </nav>
          <p class="pl-drawer__title">Каталог</p>
          <div class="pl-drawer__cats">
            <NuxtLink v-for="s in plSections" :key="s.id" :to="plSectionPath(s.id)">
              <img :src="plSecImg(s.img)" alt="" width="40" height="40" loading="lazy" />
              <span>{{ s.name }}</span>
            </NuxtLink>
          </div>
          <div class="pl-drawer__contacts">
            <a :href="plTel(plContacts.phone)" class="pl-btn pl-btn--line"><PlIcon name="phone" :size="18" />{{ plContacts.phone }}</a>
            <div class="pl-footer__social">
              <a :href="plContacts.vk" target="_blank" rel="noopener" aria-label="ВКонтакте"><PlIcon name="vk" /></a>
              <a :href="plContacts.tg" target="_blank" rel="noopener" aria-label="Telegram"><PlIcon name="tg" /></a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <NuxtLink v-if="cart.count.value && !is('/cart')" :to="plPath('/cart')" class="pl-float">
      <PlIcon name="basket" :size="20" />
      <span>{{ plGoods(cart.count.value) }}</span>
      <b>{{ plFmt(cart.total.value) }}</b>
    </NuxtLink>

    <Transition name="pl-fade">
      <div v-if="ui.toast.value" class="pl-toast" role="status">
        <PlIcon name="check" :size="18" />
        <span>{{ ui.toast.value }}</span>
        <NuxtLink :to="plPath('/cart')">Корзина</NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
html.pl-html {
  scroll-padding-top: 24px;

  &.pl-lock {
    overflow: hidden;
  }
}

body.pl-body {
  background: #fff;
  color: #382926;
  font-family: 'PT Sans', system-ui, sans-serif;
}

.pl {
  --pl-accent: #4b7a1f;
  --pl-accent-d: #3d6618;
  --pl-accent-soft: #eef3e4;
  --pl-dark: #382926;
  --pl-text: #3f312d;
  --pl-muted: #7a6a60;
  --pl-kraft: #f6efe4;
  --pl-kraft-2: #efe1ca;
  --pl-wood: #8a4f24;
  --pl-line: #ebe1d3;
  --pl-field: #d9cbb8;
  --pl-red: #b8372b;
  --pl-r: 10px;
  --pl-r-lg: 18px;
  --pl-hand: 'Caveat', 'Segoe Print', cursive;
  // Дерево: доска (несколько досок), одна планка (таблички, полоса шапки), цвет текста на нём.
  // Вариант выбирается ?wood= (png — их планка с сайта, oak, pine, cork), по умолчанию oak.
  --pl-wood-board: #93582a url('/redesign/papinalavka/wood.png') 0 0 / 303px 48px repeat;
  --pl-wood-plank: #93582a url('/redesign/papinalavka/wood.png') center / 303px 100% repeat-x;
  --pl-wood-strip: #93582a url('/redesign/papinalavka/wood.png') center / 303px 44px repeat;
  --pl-wood-ink: #fff;
  --pl-wood-chip: rgba(40, 22, 10, 0.32);
  --pl-board-ink: #fff;
  --pl-board-border: 0;

  &[data-wood='oak'],
  &[data-wood='cork'] {
    --pl-wood-board: #9b5e2f url('/redesign/papinalavka/wood-oak.svg') 0 0 / 640px 192px repeat;
    --pl-wood-plank: #9b5e2f url('/redesign/papinalavka/wood-oak-plank.svg') center / 640px 96px repeat;
    --pl-wood-strip: #9b5e2f url('/redesign/papinalavka/wood-oak-plank.svg') 0 30% / 640px 96px repeat;
  }

  &[data-wood='pine'] {
    --pl-wood-board: #c58a52 url('/redesign/papinalavka/wood-pine.svg') 0 0 / 640px 192px repeat;
    --pl-wood-plank: #c58a52 url('/redesign/papinalavka/wood-pine-plank.svg') center / 640px 96px repeat;
    --pl-wood-strip: #c58a52 url('/redesign/papinalavka/wood-pine-plank.svg') 0 30% / 640px 96px repeat;
    --pl-wood-ink: #3a2210;
    --pl-wood-chip: rgba(255, 245, 230, 0.5);
    --pl-board-ink: #3a2210;
  }

  // Пробковая доска в дубовой раме: записки на гвоздиках
  &[data-wood='cork'] {
    --pl-wood-board: url('/redesign/papinalavka/cork.svg') 0 0 / 320px 320px padding-box,
      #9b5e2f url('/redesign/papinalavka/wood-oak-plank.svg') 0 0 / 640px 96px border-box;
    --pl-board-border: 12px solid transparent;
    --pl-board-ink: #3a2210;
  }

  min-height: 100vh;
  background: #fff;
  color: var(--pl-text);
  font-family: 'PT Sans', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

:where(.pl) {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  ul,
  ol,
  figure,
  blockquote {
    margin: 0;
  }

  ul,
  ol {
    padding: 0;
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
  }

  button {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  input,
  select,
  textarea {
    font: inherit;
    color: inherit;
  }

  h1,
  h2,
  h3 {
    color: var(--pl-dark);
    font-weight: 700;
    line-height: 1.15;
  }
}

.pl-icon {
  flex: none;
}

.pl-wrap {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;

  @media (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
}

.pl-hand {
  font-family: var(--pl-hand);
  font-weight: 700;
}

// Деревянная планка из их сайта: та же текстура, что у табличек меню и разделов оригинала.
.pl-wood {
  background: var(--pl-wood-plank);
  color: var(--pl-wood-ink);
}

.pl-banner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
  padding: 8px 16px;
  background: var(--pl-dark);
  color: #f3e9de;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;

  a {
    color: #fff;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

.pl-strip {
  position: relative;
  z-index: 40;
  background: var(--pl-wood-strip);
  color: var(--pl-wood-ink);

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 44px;
  }

  &__next {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    font-family: var(--pl-hand);
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;

    // У Caveat длинные хвосты «з», «д», «у»: строке с overflow нужен запас снизу, иначе их срезает.
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.35;
      padding-bottom: 2px;
    }

    &:hover span {
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 1px;
    }
  }

  &__short {
    display: none;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: none;
  }

  &__phone {
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;
  }

  @media (max-width: 989px) {
    &__long {
      display: none;
    }

    &__short {
      display: inline;
    }
  }

  @media (max-width: 576px) {
    &__phone {
      display: none;
    }

    &__next {
      font-size: 20px;
    }
  }
}

.pl-city {
  position: relative;

  &__btn {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 30px;
    padding: 0 10px;
    border-radius: 8px;
    background: var(--pl-wood-chip);
    font-size: 15px;
    font-weight: 700;
    white-space: nowrap;
  }

  &__ask,
  &__menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 60;
    width: 260px;
    padding: 16px;
    border: 1px solid var(--pl-line);
    border-radius: 14px;
    background: #fff;
    color: var(--pl-text);
    box-shadow: 0 12px 32px rgba(56, 41, 38, 0.16);
  }

  &__ask {
    p {
      margin-bottom: 12px;
      font-size: 16px;
    }

    div {
      display: flex;
      gap: 8px;
    }
  }

  &__menu {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;

    p {
      grid-column: 1 / -1;
      margin-bottom: 6px;
      color: var(--pl-muted);
      font-size: 13px;
      line-height: 1.35;
    }

    button {
      padding: 7px 10px;
      border-radius: 8px;
      font-size: 14px;
      text-align: left;

      &:hover {
        background: var(--pl-kraft);
      }

      &.is-active {
        background: var(--pl-accent-soft);
        color: var(--pl-accent-d);
        font-weight: 700;
      }
    }
  }
}

.pl-header {
  position: relative;
  z-index: 30;
  border-bottom: 1px solid var(--pl-line);
  background: #fff;

  &__row {
    display: grid;
    grid-template-columns: auto auto minmax(220px, 1fr) auto auto;
    grid-template-areas: 'logo cat search nav cart';
    align-items: center;
    gap: 16px 20px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  & &__burger {
    display: none;
    grid-area: burger;
  }

  &__catalog {
    position: relative;
    grid-area: cat;
  }

  &__catbtn.is-active:not([aria-expanded='true']) {
    box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.18);
  }

  @media (max-width: 1400px) {
    &__row {
      grid-template-columns: auto auto minmax(200px, 1fr) auto;
      grid-template-areas: 'logo cat search cart';
    }
  }

  @media (max-width: 989px) {
    &__row {
      grid-template-columns: auto auto minmax(0, 1fr) auto;
      grid-template-areas:
        'burger logo cat cart'
        'search search search search';
      gap: 10px 12px;
    }

    & &__burger {
      display: flex;
    }

    &__catalog {
      justify-self: end;
    }
  }

  @media (max-width: 576px) {
    &__catbtn span {
      display: none;
    }

    &__catbtn {
      width: 46px;
      padding: 0;
    }
  }
}

.pl-logo {
  grid-area: logo;
  display: block;
  width: 96px;

  @media (max-width: 989px) {
    width: 64px;
  }
}

.pl-nav {
  grid-area: nav;
  display: flex;
  gap: 4px;

  a {
    padding: 10px 10px;
    border-radius: 8px;
    color: var(--pl-dark);
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;

    &:hover {
      background: var(--pl-kraft);
    }

    &.is-active {
      color: var(--pl-accent);
    }
  }

  @media (max-width: 1400px) {
    display: none;
  }
}

.pl-iconbtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  color: var(--pl-dark);

  &:hover {
    background: var(--pl-kraft);
  }
}

.pl-cartbtn {
  grid-area: cart;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 148px;
  height: 46px;
  padding: 0 12px;
  border: 1px solid var(--pl-line);
  border-radius: var(--pl-r);
  color: var(--pl-dark);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  &__n {
    display: none;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 11px;
    background: var(--pl-accent);
    color: #fff;
    font-size: 13px;
    line-height: 22px;
    text-align: center;
  }

  &.is-full &__n {
    display: inline-block;
  }

  &:hover {
    border-color: var(--pl-field);
  }

  @media (max-width: 989px) {
    width: auto;
    padding: 0 10px;

    &__sum {
      display: none;
    }
  }
}

.pl-mega {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  width: min(1040px, calc(100vw - 64px));
  padding: 20px;
  border: 1px solid var(--pl-line);
  border-radius: var(--pl-r-lg);
  background: #fff;
  box-shadow: 0 16px 40px rgba(56, 41, 38, 0.16);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: -14px;
    height: 14px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 4px;
    max-height: min(560px, 70vh);
    overflow: auto;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 8px;
    border-radius: 12px;

    img {
      width: 48px;
      height: 48px;
      flex: none;
      border: 2px solid var(--pl-kraft-2);
      border-radius: 50%;
      object-fit: cover;
    }

    b {
      display: block;
      color: var(--pl-dark);
      font-size: 15px;
      line-height: 1.2;
    }

    small {
      color: var(--pl-muted);
      font-size: 13px;
    }

    &:hover {
      background: var(--pl-kraft);
    }
  }

  &__all {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 14px;
    color: var(--pl-accent);
    font-weight: 700;
  }

  @media (max-width: 989px) {
    right: 0;
    left: auto;
    width: min(560px, calc(100vw - 32px));
  }

  @media (max-width: 576px) {
    position: fixed;
    top: auto;
    right: 16px;
    left: 16px;
    width: auto;
    margin-top: 12px;
  }
}

.pl-search {
  position: relative;
  grid-area: search;
  display: flex;
  align-items: center;
  height: 46px;
  padding-left: 14px;
  border: 1.5px solid var(--pl-field);
  border-radius: var(--pl-r);
  background: #fff;

  &:focus-within {
    border-color: var(--pl-accent);
  }

  > .pl-icon {
    color: var(--pl-muted);
  }

  input {
    flex: 1;
    width: 0;
    height: 100%;
    padding: 0 10px;
    border: 0;
    outline: 0;
    background: none;
    font-size: 16px;

    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  &__go {
    height: 36px;
    margin-right: 4px;
    padding: 0 14px;
    border-radius: 8px;
    background: var(--pl-kraft);
    color: var(--pl-dark);
    font-weight: 700;
    font-size: 15px;

    &:hover {
      background: var(--pl-kraft-2);
    }
  }

  &__drop {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: 50;
    padding: 8px;
    border: 1px solid var(--pl-line);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 16px 40px rgba(56, 41, 38, 0.16);
  }

  &__item {
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 6px;
    border-radius: 10px;
    font-size: 15px;
    line-height: 1.3;

    img {
      width: 64px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
    }

    b {
      color: var(--pl-dark);
      white-space: nowrap;
    }

    &:hover {
      background: var(--pl-kraft);
    }
  }

  &__empty {
    padding: 10px;
    color: var(--pl-muted);
    font-size: 15px;
  }

  &__all {
    width: 100%;
    margin-top: 4px;
    padding: 10px;
    border-radius: 10px;
    color: var(--pl-accent);
    font-weight: 700;
    text-align: left;

    &:hover {
      background: var(--pl-accent-soft);
    }
  }
}

.pl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: var(--pl-r);
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  white-space: nowrap;
  transition:
    background-color 0.15s,
    border-color 0.15s;

  &--main {
    background: var(--pl-accent);
    color: #fff;

    &:hover {
      background: var(--pl-accent-d);
    }
  }

  &--line,
  &--line:focus,
  &--line:active {
    border: 1px solid var(--pl-field);
    background: #fff;
    color: var(--pl-dark);
  }

  &--line:hover {
    border-color: var(--pl-dark);
  }

  &--soft {
    background: var(--pl-accent-soft);
    color: var(--pl-accent-d);

    &:hover {
      background: #e2ebd3;
    }
  }

  &--sm {
    height: 36px;
    padding: 0 14px;
    font-size: 15px;
  }

  &--big {
    height: 54px;
    padding: 0 26px;
    font-size: 17px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
}

.pl-buy {
  flex: 1 1 132px;
  min-width: 0;

  &__add {
    width: 100%;
    padding: 0 12px;
  }

  &--big {
    .pl-buy__add,
    .pl-qty {
      height: 54px;
    }
  }
}

// Счётчик общий для карточек, товара и корзины.
.pl-qty {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  height: 46px;
  border-radius: var(--pl-r);
  background: var(--pl-accent-soft);
  color: var(--pl-accent-d);

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    border-radius: var(--pl-r);

    &:hover {
      background: #e0ead0;
    }
  }

  &__n {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    text-align: center;
    white-space: nowrap;
  }
}

.pl-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--pl-line);
  border-radius: var(--pl-r-lg);
  background: #fff;
  overflow: hidden;

  &__photo {
    position: relative;
    display: block;
    aspect-ratio: 3 / 2;
    background: var(--pl-kraft);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    padding: 14px 16px 16px;
  }

  &__name {
    display: -webkit-box;
    overflow: hidden;
    color: var(--pl-dark);
    font-weight: 700;
    font-size: 16px;
    line-height: 1.3;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;

    &:hover {
      color: var(--pl-accent);
    }
  }

  &__note {
    color: var(--pl-wood);
    font-family: var(--pl-hand);
    font-size: 21px;
    font-weight: 700;
    line-height: 1.05;
  }

  &__foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: auto;
    padding-top: 8px;
  }

  @media (max-width: 576px) {
    &__body {
      padding: 12px;
    }

    &__name {
      font-size: 15px;
    }

    &__note {
      font-size: 19px;
    }
  }
}

.pl-when {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--pl-muted);
  font-size: 14px;
  line-height: 1.3;

  &.is-stock {
    color: var(--pl-accent);
    font-weight: 700;
  }
}

// Ценник на шпагате: крафт, дырочка, угол как у бирки.
.pl-tag {
  position: relative;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 6px;
  padding: 6px 12px 6px 24px;
  border-radius: 6px 10px 10px 6px;
  background: var(--pl-kraft-2);
  clip-path: polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%);
  color: var(--pl-dark);
  font-variant-numeric: tabular-nums;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 11px;
    width: 6px;
    height: 6px;
    margin-top: -3px;
    border-radius: 50%;
    background: #fff;
  }

  s {
    flex-basis: 100%;
    color: var(--pl-red);
    font-size: 13px;
    line-height: 1.2;
  }

  b {
    font-size: 20px;
    line-height: 1.2;
    white-space: nowrap;
  }

  small {
    color: var(--pl-muted);
    font-size: 13px;
    white-space: nowrap;
  }
}

.pl-label {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--pl-dark);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;

  &--day {
    background: var(--pl-red);
  }

  &--hit {
    background: var(--pl-wood-plank);
    color: var(--pl-wood-ink);
  }

  &--new,
  &--lent {
    background: var(--pl-accent);
  }
}

.pl-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  @media (max-width: 375px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.pl-section {
  padding-top: 56px;
  padding-bottom: 8px;

  @media (max-width: 768px) {
    padding-top: 40px;
  }
}

.pl-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px 20px;
  margin-bottom: 22px;

  h2 {
    font-size: clamp(26px, 3vw, 34px);
  }

  > a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--pl-accent);
    font-weight: 700;
    white-space: nowrap;
  }
}

.pl-h1 {
  font-size: clamp(30px, 4vw, 44px);
}

.pl-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  padding-top: 20px;
  margin-bottom: 14px;
  color: var(--pl-muted);
  font-size: 14px;

  a:hover {
    color: var(--pl-accent);
  }

  span + span::before,
  a + span::before,
  a + a::before {
    content: '/';
    margin-right: 8px;
    color: var(--pl-field);
  }
}

.pl-chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  button,
  a {
    flex: none;
    height: 40px;
    padding: 0 16px;
    border: 1px solid var(--pl-line);
    border-radius: 20px;
    background: #fff;
    color: var(--pl-dark);
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;

    &:hover {
      border-color: var(--pl-field);
    }

    &.is-active {
      border-color: var(--pl-accent-soft);
      background: var(--pl-accent-soft);
      color: var(--pl-accent-d);
    }

    small {
      margin-left: 4px;
      color: var(--pl-muted);
      font-weight: 400;
    }
  }
}

.pl-field {
  display: grid;
  gap: 6px;
  min-width: 0;
  font-size: 14px;

  > span {
    color: var(--pl-muted);
  }

  input,
  select,
  textarea {
    width: 100%;
    min-width: 0;
    height: 46px;
    padding: 0 14px;
    border: 1px solid var(--pl-field);
    border-radius: var(--pl-r);
    background: #fff;
    font-size: 16px;
    outline: 0;

    &:focus {
      border-color: var(--pl-accent);
    }
  }

  select {
    padding-right: 40px;
    appearance: none;
    background: #fff
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23382926' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E")
      right 14px center no-repeat;
  }

  textarea {
    height: 96px;
    padding: 12px 14px;
    resize: vertical;
  }
}

.pl-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 15px;
  line-height: 1.4;
  cursor: pointer;

  input {
    width: 20px;
    height: 20px;
    margin: 1px 0 0;
    flex: none;
    accent-color: var(--pl-accent);
  }
}

.pl-demo {
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--pl-kraft-2);
  color: var(--pl-wood);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.pl-main {
  padding-bottom: 72px;

  // запас под плавающую корзину
  @media (max-width: 768px) {
    padding-bottom: 96px;
  }
}

.pl-footer {
  position: relative;
  padding-top: 48px;
  background: var(--pl-kraft);
  font-size: 15px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    right: 32px;
    bottom: 64px;
    width: 188px;
    height: 159px;
    background: var(--pl-wood);
    opacity: 0.18;
    -webkit-mask: url('/redesign/papinalavka/fish.png') center / contain no-repeat;
    mask: url('/redesign/papinalavka/fish.png') center / contain no-repeat;
    pointer-events: none;
  }

  &__grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1.3fr 1fr 1.3fr 1.1fr;
    gap: 32px;
  }

  &__brand {
    img {
      width: 110px;
      margin-bottom: 14px;
    }

    p {
      max-width: 320px;
      color: var(--pl-muted);
    }
  }

  &__social {
    display: flex;
    gap: 8px;
    margin-top: 16px;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #fff;
      color: var(--pl-dark);

      &:hover {
        color: var(--pl-accent);
      }
    }
  }

  h3 {
    margin-bottom: 14px;
    font-size: 18px;
  }

  ul {
    display: grid;
    gap: 8px;
  }

  li a:hover {
    color: var(--pl-accent);
  }

  &__cats ul {
    grid-template-columns: 1fr 1fr;
    gap: 8px 16px;
  }

  &__contacts li {
    color: var(--pl-muted);
  }

  &__phone {
    color: var(--pl-dark);
    font-weight: 700;
    font-size: 20px;
  }

  &__legal {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px 24px;
    margin-top: 40px;
    padding-top: 18px;
    padding-bottom: 24px;
    border-top: 1px solid var(--pl-line);
    color: var(--pl-muted);
    font-size: 13px;

    p {
      max-width: 860px;
    }

    a {
      text-decoration: underline;
    }
  }

  @media (max-width: 1199px) {
    &__grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 768px) {
    padding-bottom: 72px;

    &::after {
      display: none;
    }
  }

  @media (max-width: 576px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }
  }
}

.pl-drawer {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(56, 41, 38, 0.4);

  &__panel {
    display: flex;
    flex-direction: column;
    width: min(380px, 100%);
    height: 100%;
    padding: 0 16px 24px;
    background: #fff;
    overflow-y: auto;
  }

  &__head {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    background: #fff;

    b {
      font-size: 20px;
      color: var(--pl-dark);
    }
  }

  &__nav {
    display: grid;
    gap: 2px;

    a {
      padding: 10px 12px;
      border-radius: 10px;
      color: var(--pl-dark);
      font-weight: 700;
      font-size: 17px;

      &.router-link-exact-active {
        background: var(--pl-accent-soft);
        color: var(--pl-accent-d);
      }
    }
  }

  &__title {
    margin: 18px 12px 6px;
    color: var(--pl-muted);
    font-size: 14px;
  }

  &__cats {
    display: grid;
    gap: 2px;

    a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 5px 12px;
      border-radius: 10px;
      color: var(--pl-dark);
      font-size: 15px;
      line-height: 1.25;

      &:hover {
        background: var(--pl-kraft);
      }
    }

    img {
      width: 40px;
      height: 40px;
      flex: none;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  &__contacts {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
    padding: 0 12px;

    .pl-footer__social {
      margin-top: 0;

      a {
        background: var(--pl-kraft);
      }
    }
  }
}

.pl-float {
  position: fixed;
  right: 16px;
  bottom: calc(16px + env(safe-area-inset-bottom));
  z-index: 70;
  display: none;
  align-items: center;
  gap: 10px;
  height: 54px;
  padding: 0 18px;
  border-radius: 14px;
  background: var(--pl-accent);
  color: #fff;
  font-size: 15px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  box-shadow: 0 10px 28px rgba(56, 41, 38, 0.28);

  b {
    font-size: 17px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
}

.pl-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: calc(100vw - 32px);
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--pl-dark);
  color: #fff;
  font-size: 15px;
  transform: translateX(-50%);
  box-shadow: 0 10px 28px rgba(56, 41, 38, 0.3);

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  a {
    flex: none;
    color: #cfe3b0;
    font-weight: 700;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    bottom: calc(82px + env(safe-area-inset-bottom));
  }
}

.pl-fade-enter-active,
.pl-fade-leave-active {
  transition: opacity 0.2s;
}

.pl-fade-enter-from,
.pl-fade-leave-to {
  opacity: 0;
}
</style>
