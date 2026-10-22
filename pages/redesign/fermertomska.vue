<script lang="ts" setup>
import FtSearch from '~/components/redesign/fermertomska/FtSearch.vue'
import FtModals from '~/components/redesign/fermertomska/FtModals.vue'
import FtIcon from '~/components/redesign/fermertomska/FtIcon.vue'

const route = useRoute()
const cart = useFermertomskaCart()
const ui = useFermertomskaUi()

const nav = [
  { to: ftPath('/delivery'), label: 'Доставка и оплата' },
  { to: ftPath('/about'), label: 'О заводе' },
]

const tabs = computed(() => [
  { to: ftPath(), label: 'Главная', icon: 'home', active: route.path === ftPath() || route.path === ftPath('/') },
  { to: ftPath('/catalog'), label: 'Каталог', icon: 'grid', active: route.path.startsWith(ftPath('/catalog')) || route.path.startsWith(ftPath('/product')) },
  { to: ftPath('/delivery'), label: 'Доставка', icon: 'truck', active: route.path.startsWith(ftPath('/delivery')) },
])

const counts = Object.fromEntries(ftSections.map((s) => [s.id, ftFamiliesOf(s.id).length]))

useSeoMeta({
  title: 'Куендатское — молочная продукция с доставкой по Томску | Концепт редизайна',
  description: 'Концепт редизайна интернет-магазина молочного завода «Куендатский»: каталог по разделам, фасовки в одной карточке, расчёт дня доставки и корзина.',
  ogTitle: 'Куендатское — концепт редизайна',
  ogDescription: 'Молоко, сметана, творог и масло «Крестьянское» с доставкой по Томску: каталог, расчёт дня доставки, корзина.',
  ogImage: 'https://andryushov.me/redesign/fermertomska/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'ft-html', lang: 'ru' },
  bodyAttrs: { class: 'ft-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap' },
  ],
})

onMounted(() => cart.persist())

watch(
  () => route.fullPath,
  () => {
    ui.menuOpen.value = false
    ui.searchOpen.value = false
  },
)

// Меню и окна закрывают страницу целиком — фон не прокручивается.
watch([ui.menuOpen, ui.modal], ([menu, modal]) => {
  document.documentElement.classList.toggle('ft-locked', Boolean(menu || modal))
})

const onKey = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  ui.menuOpen.value = false
  ui.searchOpen.value = false
  ui.close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('ft-locked')
})

const year = new Date().getFullYear()
</script>

<template>
  <div class="ft">
    <div class="ft-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="ftContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="ft-header">
      <div class="ft-wrap ft-header__row">
        <div class="ft-header__left">
          <button
            type="button"
            class="ft-menubtn"
            :class="{ 'is-open': ui.menuOpen.value }"
            :aria-expanded="ui.menuOpen.value"
            aria-controls="ft-menu"
            @click="ui.menuOpen.value = !ui.menuOpen.value"
          >
            <FtIcon :name="ui.menuOpen.value ? 'close' : 'menu'" />
            <span class="ft-menubtn__label">Каталог</span>
          </button>
          <nav class="ft-header__nav" aria-label="Разделы сайта">
            <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
          </nav>
        </div>

        <NuxtLink :to="ftPath()" class="ft-mark" aria-label="Куендатское, на главную">
          <img class="ft-mark__img" :src="ftImg('mascot.png')" alt="" width="52" height="52" />
          <span class="ft-mark__text">
            <span class="ft-mark__name">Куендатское</span>
            <span class="ft-mark__sub">молочный завод · доставка по Томску</span>
          </span>
        </NuxtLink>

        <div class="ft-header__right">
          <a class="ft-header__phone" :href="ftContacts.phoneHref">
            {{ ftContacts.phone }}
            <span>заказы пн–пт до 15:00</span>
          </a>
          <button
            type="button"
            class="ft-iconbtn"
            :class="{ 'is-active': ui.searchOpen.value }"
            aria-label="Поиск"
            :aria-expanded="ui.searchOpen.value"
            @click="ui.searchOpen.value = !ui.searchOpen.value"
          >
            <FtIcon name="search" />
          </button>
          <button
            type="button"
            class="ft-iconbtn ft-header__login"
            :aria-label="ui.user.value ? `Кабинет: ${ui.user.value}` : 'Вход в кабинет'"
            @click="ui.open({ kind: 'login' })"
          >
            <FtIcon name="user" />
          </button>
          <NuxtLink :to="ftPath('/catalog?fav=1')" class="ft-iconbtn ft-header__fav" aria-label="Избранное">
            <FtIcon name="heart" />
            <span v-if="cart.favorites.value.length" class="ft-dot">{{ cart.favorites.value.length }}</span>
          </NuxtLink>
          <NuxtLink :to="ftPath('/cart')" class="ft-cartbtn" :class="{ 'is-full': cart.count.value }">
            <FtIcon name="bag" />
            <span class="ft-cartbtn__sum">{{ cart.count.value ? ftPriceRound(cart.subtotal.value) : 'Корзина' }}</span>
            <span v-if="cart.count.value" class="ft-dot">{{ cart.count.value }}</span>
          </NuxtLink>
        </div>
      </div>

      <div v-if="ui.searchOpen.value" class="ft-searchbar">
        <div class="ft-wrap">
          <FtSearch autofocus />
        </div>
      </div>
    </header>

    <div v-if="ui.menuOpen.value" class="ft-menu-backdrop" @click="ui.menuOpen.value = false" />
    <aside id="ft-menu" class="ft-menu" :class="{ 'is-open': ui.menuOpen.value }" aria-label="Каталог">
      <div class="ft-menu__head">
        <span class="ft-menu__title">Каталог</span>
        <button type="button" class="ft-iconbtn" aria-label="Закрыть меню" @click="ui.menuOpen.value = false">
          <FtIcon name="close" />
        </button>
      </div>
      <nav class="ft-menu__sections">
        <NuxtLink v-for="s in ftSections" :key="s.id" :to="ftPath(`/catalog/${s.id}`)" class="ft-menu__section">
          <img :src="s.cover" alt="" width="56" height="56" loading="lazy" />
          <span>{{ s.title }}</span>
          <small>{{ counts[s.id] }}</small>
        </NuxtLink>
      </nav>
      <div class="ft-menu__chips">
        <NuxtLink :to="ftPath('/catalog')">Все товары</NuxtLink>
        <NuxtLink :to="ftPath('/catalog/new')">Новинки</NuxtLink>
        <NuxtLink :to="ftPath('/catalog/hit')">Хиты продаж</NuxtLink>
        <NuxtLink :to="ftPath('/catalog/sale')">Акции</NuxtLink>
      </div>
      <nav class="ft-menu__links">
        <NuxtLink :to="ftPath('/delivery')">Доставка и оплата</NuxtLink>
        <NuxtLink :to="ftPath('/about')">О заводе и контакты</NuxtLink>
        <button type="button" @click="ui.open({ kind: 'login' })">{{ ui.user.value ? 'Личный кабинет' : 'Вход в кабинет' }}</button>
      </nav>
      <div class="ft-menu__contact">
        <a :href="ftContacts.phoneHref">{{ ftContacts.phone }}</a>
        <span>Заказы принимаем пн–пт до 15:00</span>
        <button type="button" class="ft-btn ft-btn--soft" @click="ui.open({ kind: 'callback' })">Перезвоните мне</button>
      </div>
    </aside>

    <main class="ft-main">
      <NuxtPage />
    </main>

    <footer class="ft-footer">
      <div class="ft-wrap ft-footer__grid">
        <div class="ft-footer__brand">
          <NuxtLink :to="ftPath()" class="ft-mark ft-mark--footer">
            <img class="ft-mark__img" :src="ftImg('mascot.png')" alt="" width="52" height="52" />
            <span class="ft-mark__text">
              <span class="ft-mark__name">Куендатское</span>
              <span class="ft-mark__sub">молочный завод · доставка по Томску</span>
            </span>
          </NuxtLink>
          <p>Создаём продукты, которые объединяют семью за столом.</p>
        </div>
        <nav class="ft-footer__col" aria-label="Каталог">
          <strong>Каталог</strong>
          <NuxtLink v-for="s in ftSections" :key="s.id" :to="ftPath(`/catalog/${s.id}`)">{{ s.title }}</NuxtLink>
        </nav>
        <nav class="ft-footer__col" aria-label="Покупателям">
          <strong>Покупателям</strong>
          <NuxtLink :to="ftPath('/delivery')">Доставка и оплата</NuxtLink>
          <NuxtLink :to="ftPath('/delivery#return')">Обмен и возврат</NuxtLink>
          <NuxtLink :to="ftPath('/about')">О заводе</NuxtLink>
          <NuxtLink :to="ftPath('/about#contacts')">Контакты</NuxtLink>
        </nav>
        <div class="ft-footer__col">
          <strong>Контакты</strong>
          <a :href="ftContacts.phoneHref">{{ ftContacts.phone }} — заказы</a>
          <a :href="ftContacts.officeHref">{{ ftContacts.office }} — офис</a>
          <a :href="`mailto:${ftContacts.email}`">{{ ftContacts.email }}</a>
          <span>Самовывоз: {{ ftContacts.pickup }}</span>
        </div>
      </div>
      <div class="ft-wrap ft-footer__legal">
        <span>© {{ year }} {{ ftContacts.legal }} · ИНН {{ ftContacts.inn }}</span>
        <span>
          Тексты, цены и фотографии принадлежат {{ ftContacts.legal }} и взяты с
          <a :href="ftContacts.original" target="_blank" rel="noopener">fermertomska.ru</a> для демонстрации концепта.
        </span>
      </div>
    </footer>

    <nav class="ft-tabbar" aria-label="Быстрый переход">
      <NuxtLink v-for="t in tabs" :key="t.to" :to="t.to" :class="{ 'is-active': t.active }">
        <FtIcon :name="t.icon" />
        <span>{{ t.label }}</span>
      </NuxtLink>
      <NuxtLink :to="ftPath('/cart')" class="ft-tabbar__cart" :class="{ 'is-active': route.path.startsWith(ftPath('/cart')) }">
        <span class="ft-tabbar__icon">
          <FtIcon name="bag" />
          <span v-if="cart.count.value" class="ft-dot">{{ cart.count.value }}</span>
        </span>
        <span>{{ cart.count.value ? ftPriceRound(cart.subtotal.value) : 'Корзина' }}</span>
      </NuxtLink>
    </nav>

    <FtModals />
  </div>
</template>

<style lang="scss">
html.ft-html {
  scrollbar-color: #c9d6e4 #ffffff;

  &.ft-locked {
    overflow: hidden;
  }
}

body.ft-body {
  background: #fff;
  color: #1d2b4a;
  font-family: 'Nunito', system-ui, sans-serif;
}

.ft {
  --ft-accent: #1f7d63;
  --ft-accent-d: #16634e;
  --ft-accent-soft: #e2f1eb;
  --ft-ink: #1d2b4a;
  --ft-text: #2b3756;
  --ft-muted: #67728c;
  --ft-surface: #eef3f8;
  --ft-surface-2: #f6f8fb;
  --ft-line: #dde5ee;
  --ft-orange: #e07b1a;
  --ft-orange-soft: #fdeedb;
  --ft-orange-text: #9d4a05;
  --ft-r: 14px;
  --ft-r-lg: 24px;
  --ft-header: 76px;

  min-height: 100vh;
  background: #fff;
  color: var(--ft-ink);
  font-family: 'Nunito', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  font-variant-numeric: lining-nums;

  @media (max-width: 989px) {
    --ft-header: 64px;
  }

  @media (max-width: 768px) {
    padding-bottom: calc(68px + env(safe-area-inset-bottom));
  }
}

:where(.ft) {
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
  blockquote,
  dl,
  dd {
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
  }

  button {
    margin: 0;
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

  svg {
    flex-shrink: 0;
  }
}

.ft .ft-wrap {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 32px;

  @media (max-width: 1199px) {
    padding: 0 24px;
  }

  @media (max-width: 576px) {
    padding: 0 16px;
  }
}

/* ——— общие элементы ——— */

.ft .ft-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 22px;
  border-radius: var(--ft-r);
  background: var(--ft-accent);
  color: #fff;
  font-weight: 800;
  white-space: nowrap;
  transition:
    background-color 0.15s,
    color 0.15s;

  &:hover {
    background: var(--ft-accent-d);
  }

  &--soft {
    background: var(--ft-accent-soft);
    color: var(--ft-accent-d);

    &:hover {
      background: #cfe8de;
    }
  }

  &--ghost {
    background: #fff;
    color: var(--ft-ink);
    box-shadow: inset 0 0 0 1px var(--ft-line);

    &:hover {
      background: var(--ft-surface-2);
    }
  }

  &--block {
    width: 100%;
  }

  &:disabled {
    background: var(--ft-surface);
    color: var(--ft-muted);
    cursor: not-allowed;
  }
}

.ft .ft-iconbtn {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: var(--ft-ink);
  transition: background-color 0.15s;

  &:hover,
  &.is-active {
    background: var(--ft-surface);
  }
}

.ft .ft-dot {
  position: absolute;
  top: 2px;
  right: 0;
  display: grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border: 2px solid #fff;
  border-radius: 10px;
  background: var(--ft-orange);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
}

.ft .ft-field {
  display: grid;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--ft-text);

  input,
  textarea,
  select {
    width: 100%;
    min-height: 48px;
    padding: 12px 16px;
    border: 1px solid var(--ft-line);
    border-radius: var(--ft-r);
    background: #fff;
    font-size: 16px;
    font-weight: 500;
    color: var(--ft-ink);
    outline: none;
    transition: border-color 0.15s;

    &:focus {
      border-color: var(--ft-accent);
    }
  }

  textarea {
    min-height: 110px;
    resize: vertical;
  }

  select {
    appearance: none;
    padding-right: 44px;
    background: #fff
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%231d2b4a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M7 10l5 5 5-5'/%3E%3C/svg%3E")
      no-repeat right 14px center;
  }
}

.ft .ft-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: var(--ft-muted);
  cursor: pointer;

  input {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin: 1px 0 0;
    accent-color: var(--ft-accent);
  }
}

.ft .ft-h1 {
  font-size: clamp(30px, 3.4vw, 44px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.ft .ft-h2 {
  font-size: clamp(24px, 2.4vw, 32px);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.ft .ft-section {
  padding-top: 56px;
  padding-bottom: 56px;

  @media (max-width: 768px) {
    padding-top: 40px;
    padding-bottom: 40px;
  }
}

.ft .ft-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px 24px;
  margin-bottom: 24px;

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--ft-accent);
    font-weight: 800;

    &:hover {
      color: var(--ft-accent-d);
    }
  }
}

.ft .ft-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  padding: 20px 0 12px;
  font-size: 14px;
  color: var(--ft-muted);

  a:hover {
    color: var(--ft-accent);
  }

  span[aria-hidden] {
    color: #b3bccb;
  }
}

.ft .ft-badge {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 9px;
  border-radius: 8px;
  background: var(--ft-orange-soft);
  color: var(--ft-orange-text);
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;

  &--new {
    background: var(--ft-accent-soft);
    color: var(--ft-accent-d);
  }

  &--note {
    background: #fff4c7;
    color: #6b5200;
  }
}

.ft .ft-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px 20px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 12px;
  }
}

.ft .ft-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.ft .ft-page {
  padding-bottom: 40px;

  &__lead {
    max-width: 760px;
    margin: 14px 0 32px;
    color: var(--ft-text);
    font-size: 18px;
  }

  &__split {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  &__return {
    margin-top: 20px;
  }

  @media (max-width: 989px) {
    &__split {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 576px) {
    &__lead {
      font-size: 16px;
      margin-bottom: 24px;
    }
  }
}

.ft .ft-panel {
  display: grid;
  align-content: start;
  gap: 14px;
  padding: 28px;
  border-radius: var(--ft-r-lg);
  box-shadow: inset 0 0 0 1px var(--ft-line);

  &--surface {
    background: var(--ft-surface);
    box-shadow: none;
  }

  h2 {
    font-size: 22px;
    font-weight: 900;
    line-height: 1.2;
  }

  > p:not(.ft-panel__plain) {
    display: flex;
    align-items: flex-start;
    gap: 10px;

    svg {
      margin-top: 2px;
      color: var(--ft-accent);
    }
  }

  a:not(.ft-head__link):not(.ft-btn) {
    color: var(--ft-accent);
    font-weight: 800;
  }

  &__note {
    padding: 14px 16px;
    border-radius: 16px;
    background: #fff;
    font-weight: 700;
  }

  &__muted {
    color: var(--ft-muted);
  }

  @media (max-width: 576px) {
    padding: 20px 16px;
  }
}

/* ——— баннер концепта ——— */

.ft .ft-banner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px 12px;
  padding: 8px 16px;
  background: var(--ft-surface);
  color: var(--ft-muted);
  font-size: 13px;
  line-height: 1.4;
  text-align: center;

  a {
    color: var(--ft-accent);
    font-weight: 800;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

/* ——— шапка ——— */

.ft .ft-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 var(--ft-line);

  &__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 16px;
    height: var(--ft-header);
  }

  &__left,
  &__right {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  &__right {
    justify-content: flex-end;
  }

  &__nav {
    display: flex;
    gap: 4px;

    a {
      padding: 10px 12px;
      border-radius: 12px;
      font-weight: 700;
      white-space: nowrap;
      transition: background-color 0.15s;

      &:hover,
      &.router-link-active {
        background: var(--ft-surface);
      }
    }
  }

  &__phone {
    display: grid;
    margin-right: 6px;
    font-weight: 800;
    line-height: 1.2;
    text-align: right;
    white-space: nowrap;

    span {
      font-size: 12px;
      font-weight: 600;
      color: var(--ft-muted);
    }
  }

  @media (max-width: 1400px) {
    &__phone {
      display: none;
    }
  }

  @media (max-width: 1199px) {
    &__nav {
      display: none;
    }
  }

  @media (max-width: 989px) {
    &__login,
    &__fav {
      display: none;
    }
  }
}

.ft .ft-menubtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 18px 0 14px;
  border-radius: var(--ft-r);
  background: var(--ft-accent);
  color: #fff;
  font-weight: 800;
  white-space: nowrap;
  transition: background-color 0.15s;

  &:hover,
  &.is-open {
    background: var(--ft-accent-d);
  }

  @media (max-width: 989px) {
    width: 44px;
    height: 44px;
    padding: 0;
    justify-content: center;
    background: none;
    color: var(--ft-ink);

    &:hover,
    &.is-open {
      background: var(--ft-surface);
    }

    &__label {
      display: none;
    }
  }
}

.ft .ft-mark {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;

  &__img {
    width: 52px;
    height: 52px;
    object-fit: contain;
  }

  &__text {
    display: grid;
    line-height: 1.1;
  }

  &__name {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: var(--ft-ink);
  }

  &__sub {
    margin-top: 3px;
    font-size: 12px;
    font-weight: 700;
    color: var(--ft-muted);
    white-space: nowrap;
  }

  @media (max-width: 989px) {
    &__img {
      width: 42px;
      height: 42px;
    }

    &__name {
      font-size: 20px;
    }
  }

  @media (max-width: 576px) {
    gap: 8px;

    &__sub {
      display: none;
    }
  }

  @media (max-width: 375px) {
    &__img {
      width: 36px;
      height: 36px;
    }

    &__name {
      font-size: 18px;
    }
  }
}

.ft .ft-cartbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  min-width: 132px;
  padding: 0 16px;
  border-radius: var(--ft-r);
  background: var(--ft-surface);
  font-weight: 800;
  white-space: nowrap;
  transition: background-color 0.15s;

  &:hover {
    background: #e2eaf3;
  }

  &.is-full {
    background: var(--ft-accent-soft);
    color: var(--ft-accent-d);
  }

  &__sum {
    min-width: 64px;
    font-variant-numeric: tabular-nums;
  }

  .ft-dot {
    top: -6px;
    right: -6px;
  }

  @media (max-width: 768px) {
    min-width: 0;
    width: 44px;
    height: 44px;
    padding: 0;
    justify-content: center;
    border-radius: 50%;
    background: none;

    &.is-full {
      background: none;
    }

    &__sum {
      display: none;
    }

    .ft-dot {
      top: 2px;
      right: 0;
    }
  }
}

.ft .ft-searchbar {
  padding: 12px 0 18px;
  border-top: 1px solid var(--ft-line);
  background: #fff;
}

/* ——— меню-каталог ——— */

.ft .ft-menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(29, 43, 74, 0.35);
}

.ft .ft-menu {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 61;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: min(400px, 100%);
  padding: 16px 20px 28px;
  overflow-y: auto;
  background: #fff;
  transform: translateX(-102%);
  visibility: hidden;
  transition:
    transform 0.25s ease,
    visibility 0.25s;

  &.is-open {
    transform: none;
    visibility: visible;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 24px;
    font-weight: 900;
  }

  &__sections {
    display: grid;
    gap: 4px;
  }

  &__section {
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr) auto;
    align-items: center;
    gap: 14px;
    padding: 6px 12px 6px 6px;
    border-radius: 18px;
    font-size: 17px;
    font-weight: 800;
    transition: background-color 0.15s;

    img {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      object-fit: cover;
    }

    small {
      color: var(--ft-muted);
      font-size: 14px;
      font-weight: 700;
    }

    &:hover,
    &.router-link-active {
      background: var(--ft-surface);
    }
  }

  &__chips {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    a {
      padding: 8px 14px;
      text-align: center;
      border-radius: 12px;
      background: var(--ft-surface);
      font-size: 14px;
      font-weight: 800;

      &:hover {
        background: var(--ft-accent-soft);
        color: var(--ft-accent-d);
      }
    }
  }

  &__links {
    display: grid;
    border-top: 1px solid var(--ft-line);

    a,
    button {
      padding: 14px 4px;
      border-bottom: 1px solid var(--ft-line);
      font-weight: 700;
      text-align: left;

      &:hover {
        color: var(--ft-accent);
      }
    }
  }

  &__contact {
    display: grid;
    gap: 6px;
    margin-top: auto;

    a {
      font-size: 22px;
      font-weight: 900;
    }

    span {
      color: var(--ft-muted);
      font-size: 14px;
    }

    .ft-btn {
      margin-top: 8px;
    }
  }
}

/* ——— подвал ——— */

.ft .ft-footer {
  margin-top: 40px;
  padding: 48px 0 28px;
  background: var(--ft-surface-2);

  &__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.3fr;
    gap: 32px;
  }

  &__brand p {
    max-width: 300px;
    margin-top: 16px;
    color: var(--ft-muted);
  }

  &__col {
    display: grid;
    align-content: start;
    gap: 8px;
    font-size: 15px;

    strong {
      margin-bottom: 4px;
      font-size: 16px;
      font-weight: 900;
    }

    a:hover {
      color: var(--ft-accent);
    }

    span {
      color: var(--ft-muted);
    }
  }

  &__legal {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px 32px;
    margin-top: 36px;
    padding-top: 20px;
    border-top: 1px solid var(--ft-line);
    color: var(--ft-muted);
    font-size: 13px;

    a {
      text-decoration: underline;
    }
  }

  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 576px) {
    &__grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
}

/* ——— таббар ——— */

.ft .ft-tabbar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 45;
  display: none;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -1px 0 var(--ft-line);

  a {
    display: grid;
    justify-items: center;
    gap: 2px;
    min-width: 0;
    padding: 6px 2px;
    border-radius: 14px;
    color: var(--ft-muted);
    font-size: 12px;
    font-weight: 800;
    white-space: nowrap;

    &.is-active {
      color: var(--ft-accent);
    }
  }

  &__cart {
    font-variant-numeric: tabular-nums;
  }

  &__icon {
    position: relative;

    .ft-dot {
      top: -6px;
      right: -14px;
    }
  }

  @media (max-width: 768px) {
    display: grid;
  }
}
</style>
