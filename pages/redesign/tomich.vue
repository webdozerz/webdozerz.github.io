<script lang="ts" setup>
const route = useRoute()
const cart = useTomichCart()
const zoom = useTomichZoom()
const menuOpen = ref(false)
const loginOpen = ref(false)
const loginSent = ref(false)
const delivery = ref(tmDeliveryDate())

const nav = [
  { to: tmPath('/menu'), label: 'Меню обедов' },
  { to: tmPath('/about'), label: 'О компании' },
  { to: tmPath('/banquets'), label: 'Кафе и банкеты' },
  { to: tmPath('/shops'), label: 'Магазины и контакты' },
  { to: tmPath('/reviews'), label: 'Отзывы' },
]

const onCart = computed(() => route.path.startsWith(tmPath('/cart')))
// Плавающая корзина появляется после прокрутки, чтобы не закрывать кнопки первого экрана.
const scrolled = ref(false)
const onScroll = () => {
  scrolled.value = window.scrollY > 320
}

useSeoMeta({
  title: 'Торговый Дом «Томич» | Концепт редизайна',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'tm-html', lang: 'ru' },
  bodyAttrs: { class: 'tm-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Commissioner:wght@400;500;600;700;800&display=swap',
    },
  ],
})

const openLogin = () => {
  menuOpen.value = false
  loginSent.value = false
  loginOpen.value = true
  nextTick(() => document.querySelector<HTMLInputElement>('.tm-modal input')?.focus())
}
provide('tmOpenLogin', openLogin)

onMounted(() => {
  cart.persist()
  delivery.value = tmDeliveryDate()
})
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    zoom.close()
  },
)

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    zoom.close()
    loginOpen.value = false
  }
  if (zoom.state.value && e.key === 'ArrowRight') zoom.step(1)
  if (zoom.state.value && e.key === 'ArrowLeft') zoom.step(-1)
}
onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="tm">
    <div class="tm-banner tm-noprint">
      <span>
        Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.
      </span>
      <a :href="tmContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="tm-header tm-noprint">
      <div class="tm-top">
        <div class="tm-wrap tm-top__inner">
          <span class="tm-top__item tm-top__addr">{{ tmContacts.address }}</span>
          <a :href="tmContacts.phoneHref" class="tm-top__item tm-top__phone">{{ tmContacts.phone }}</a>
          <span class="tm-top__deadline">
            <span class="tm-top__dot" aria-hidden="true" />
            <span><span class="tm-top__long">Заказ сегодня — доставка</span><span class="tm-top__short">Доставка</span> завтра, <b>{{ delivery.day }}</b></span>
          </span>
          <button type="button" class="tm-top__login" @click="openLogin">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            </svg>
            Войти
          </button>
        </div>
      </div>

      <div class="tm-bar">
        <div class="tm-wrap tm-bar__inner">
          <button
            class="tm-burger"
            type="button"
            :aria-expanded="menuOpen"
            aria-label="Меню"
            @click="menuOpen = !menuOpen"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path v-if="!menuOpen" d="M4 7h16M4 12h16M4 17h16" />
              <path v-else d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <NuxtLink :to="tmPath()" class="tm-mark" aria-label="Торговый Дом «Томич», на главную">
            <span class="tm-mark__sign" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="32" height="32">
                <path d="M5 15L16 6l11 9" />
                <path d="M9 13v12h14V13" />
                <path d="M14 25v-6h4v6" />
              </svg>
            </span>
            <span class="tm-mark__text">
              <span class="tm-mark__name">ТОМИЧ</span>
              <span class="tm-mark__sub">мясо · полуфабрикаты · обеды</span>
            </span>
          </NuxtLink>

          <nav class="tm-nav" aria-label="Основная навигация">
            <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="tm-nav__link">
              {{ item.label }}
            </NuxtLink>
          </nav>

          <NuxtLink
            :to="tmPath('/cart')"
            class="tm-cartbtn"
            :class="{ 'is-full': cart.count.value }"
            aria-label="Корзина"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M3 4h2.2l2.1 10.2a1.5 1.5 0 0 0 1.5 1.2h7.9a1.5 1.5 0 0 0 1.4-1l1.9-6H6.1" />
              <circle cx="9.5" cy="19.5" r="1.3" />
              <circle cx="17" cy="19.5" r="1.3" />
            </svg>
            <span class="tm-cartbtn__sum">
              {{ cart.count.value ? tmFormatPrice(cart.total.value) : 'Корзина' }}
            </span>
          </NuxtLink>
        </div>
      </div>

      <div v-if="menuOpen" class="tm-drawer">
        <nav class="tm-wrap tm-drawer__nav" aria-label="Меню">
          <NuxtLink :to="tmPath()" class="tm-drawer__link">Главная</NuxtLink>
          <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="tm-drawer__link">
            {{ item.label }}
          </NuxtLink>
          <button type="button" class="tm-drawer__link" @click="openLogin">Войти</button>
          <div class="tm-drawer__contacts">
            <a :href="tmContacts.phoneHref">{{ tmContacts.phone }}</a>
            <span>{{ tmContacts.address }}</span>
            <span>{{ tmOrderRule }}</span>
          </div>
        </nav>
      </div>
    </header>

    <main class="tm-main">
      <NuxtPage />
    </main>

    <NuxtLink
      v-if="cart.count.value && !onCart && scrolled"
      :to="tmPath('/cart')"
      class="tm-float tm-noprint"
      aria-label="Перейти в корзину"
    >
      <span class="tm-float__count">{{ cart.count.value }}</span>
      <span class="tm-float__sum">{{ tmFormatPrice(cart.total.value) }}</span>
    </NuxtLink>

    <footer class="tm-footer tm-noprint">
      <div class="tm-wrap tm-footer__grid">
        <div>
          <div class="tm-footer__brand">ТОМИЧ</div>
          <p>
            Семейная компания из Томска: фермерское мясо, домашние полуфабрикаты ручной лепки,
            обеды в офис, кафе и 8 собственных магазинов.
          </p>
        </div>
        <div>
          <div class="tm-footer__title">Покупателям</div>
          <NuxtLink :to="tmPath('/menu')">Меню обедов</NuxtLink>
          <NuxtLink :to="tmPath('/cart')">Корзина</NuxtLink>
          <NuxtLink :to="tmPath('/shops')">Где купить</NuxtLink>
          <NuxtLink :to="tmPath('/reviews')">Отзывы</NuxtLink>
        </div>
        <div>
          <div class="tm-footer__title">Компания</div>
          <NuxtLink :to="tmPath('/about')">О компании</NuxtLink>
          <NuxtLink :to="tmPath('/about') + '#supply'">Поставки для ресторанов</NuxtLink>
          <NuxtLink :to="tmPath('/banquets')">Кафе и банкеты</NuxtLink>
        </div>
        <div>
          <div class="tm-footer__title">Контакты</div>
          <a :href="tmContacts.phoneHref" class="tm-footer__phone">{{ tmContacts.phone }}</a>
          <span>{{ tmContacts.address }}</span>
          <span class="tm-footer__social">
            <a :href="tmContacts.vk" target="_blank" rel="noopener">ВКонтакте</a>
            <a :href="tmContacts.ok" target="_blank" rel="noopener">Одноклассники</a>
          </span>
        </div>
      </div>
      <div class="tm-wrap tm-footer__legal">
        Концепт редизайна сайта myaso.tomsk.ru. Тексты, цены и фотографии принадлежат Торговому
        Дому «Томич» и используются только для демонстрации.
      </div>
    </footer>

    <div
      v-if="zoom.state.value"
      class="tm-zoom"
      role="dialog"
      aria-modal="true"
      :aria-label="zoom.state.value.title || 'Фото'"
      @click.self="zoom.close()"
    >
      <figure class="tm-zoom__fig">
        <img :src="zoom.state.value.list[zoom.state.value.index]" :alt="zoom.state.value.title" />
        <figcaption>
          {{ zoom.state.value.title }}
          <span v-if="zoom.state.value.list.length > 1">
            · {{ zoom.state.value.index + 1 }} из {{ zoom.state.value.list.length }}
          </span>
        </figcaption>
      </figure>
      <button type="button" class="tm-zoom__close" aria-label="Закрыть" @click="zoom.close()">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <template v-if="zoom.state.value.list.length > 1">
        <button type="button" class="tm-zoom__nav tm-zoom__nav--prev" aria-label="Предыдущее фото" @click="zoom.step(-1)">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" class="tm-zoom__nav tm-zoom__nav--next" aria-label="Следующее фото" @click="zoom.step(1)">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </template>
    </div>

    <div v-if="loginOpen" class="tm-modal" role="dialog" aria-modal="true" aria-labelledby="tm-login-title" @click.self="loginOpen = false">
      <form class="tm-modal__box" @submit.prevent="loginSent = true">
        <button type="button" class="tm-modal__close" aria-label="Закрыть" @click="loginOpen = false">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <h2 id="tm-login-title">Вход</h2>
        <p class="tm-muted">Постоянным клиентам: история заказов и данные для доставки сохраняются.</p>
        <label class="tm-field">
          <span>Логин</span>
          <input type="text" name="login" autocomplete="username" required />
        </label>
        <label class="tm-field">
          <span>Пароль</span>
          <input type="password" name="password" autocomplete="current-password" required />
        </label>
        <button type="submit" class="tm-btn tm-btn--wide">Войти</button>
        <p v-if="loginSent" class="tm-note">Это демо: вход в концепте не работает.</p>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
// Тема концепта. Всё привязано к классам, которые живут только пока открыт этот концепт,
// плюс сброс тёмных глобальных стилей портфолио.
html.tm-html {
  scrollbar-color: #9fb3a7 #ffffff;

  &::-webkit-scrollbar-track {
    background: #fff;
  }
  &::-webkit-scrollbar-thumb {
    background: #9fb3a7;
    border-color: #fff;
  }
}

body.tm-body {
  background: #fff;
  color: #13241b;
  font-family: 'Commissioner', system-ui, sans-serif;
}

.tm {
  --tm-red: #d42b1e;
  --tm-red-d: #b32014;
  --tm-green: #0f3b2a;
  --tm-green-2: #1a5139;
  --tm-mint: #f2f6f3;
  --tm-mint-2: #e2ece5;
  --tm-soft: #e4f0e8;
  --tm-soft-2: #d3e6da;
  --tm-ink: #13241b;
  --tm-muted: #5b6b62;
  --tm-line: #d5ded8;
  --tm-r: 10px;
  --tm-r-lg: 18px;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: var(--tm-ink);
  font-family: 'Commissioner', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  font-variant-numeric: lining-nums;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

// Сброс через :where — нулевая специфичность, чтобы классы блоков могли задавать отступы.
// (.tm p {margin:0} перебивал .tmh-hero__rule {margin-top} и слеплял блоки.)
:where(.tm) {
  a {
    color: inherit;
    text-decoration: none;
  }

  h1,
  h2,
  h3 {
    margin: 0;
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: var(--tm-ink);
  }

  p {
    margin: 0;
  }

  img {
    max-width: 100%;
    display: block;
  }

  button {
    font: inherit;
    color: inherit;
    cursor: pointer;
  }

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.9;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex-shrink: 0;
  }

  :focus-visible {
    outline: 2px solid var(--tm-red);
    outline-offset: 2px;
  }
}

.tm {

  .tm-wrap {
    width: min(1200px, 100% - 32px);
    margin-inline: auto;
  }

  .tm-muted {
    color: var(--tm-muted);
  }

  // ---------- кнопки ----------
  .tm-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 46px;
    padding: 0 20px;
    border: 0;
    border-radius: var(--tm-r);
    background: var(--tm-red);
    color: #fff;
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;
    transition: background 0.15s;

    &:hover {
      background: var(--tm-red-d);
    }
    &--dark {
      background: var(--tm-soft);
      color: var(--tm-green);
      &:hover {
        background: var(--tm-soft-2);
      }
    }
    &--ghost {
      background: #fff;
      color: var(--tm-green);
      box-shadow: inset 0 0 0 1.5px var(--tm-soft-2);
      &:hover {
        background: var(--tm-mint);
      }
    }
    &--light {
      background: #fff;
      color: var(--tm-green);
      &:hover {
        background: var(--tm-mint);
      }
    }
    &--wide {
      width: 100%;
    }
    &--sm {
      min-height: 38px;
      padding: 0 14px;
      font-size: 14px;
    }
  }

  // ---------- счётчик ----------
  .tm-qty {
    display: inline-grid;
    grid-template-columns: 36px minmax(28px, auto) 36px;
    align-items: center;
    height: 38px;
    border-radius: var(--tm-r);
    background: var(--tm-soft);
    color: var(--tm-green);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    overflow: hidden;

    button {
      height: 100%;
      border: 0;
      background: transparent;
      font-size: 20px;
      line-height: 1;
      color: inherit;
      &:hover {
        background: var(--tm-soft-2);
      }
    }
    span {
      text-align: center;
      font-size: 15px;
    }
  }

  // ---------- поля ----------
  .tm-field {
    display: grid;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;

    input,
    textarea,
    select {
      width: 100%;
      min-width: 0;
      min-height: 46px;
      padding: 10px 12px;
      border: 1px solid var(--tm-line);
      border-radius: var(--tm-r);
      background: #fff;
      font: inherit;
      font-weight: 400;
      font-size: 15px;
      color: var(--tm-ink);
      outline: none;

      &:focus {
        border-color: var(--tm-green);
        box-shadow: 0 0 0 1px var(--tm-green);
      }
    }
    textarea {
      min-height: 96px;
      resize: vertical;
    }
  }

  .tm-note {
    padding: 10px 14px;
    border-radius: var(--tm-r);
    background: #fdf0ee;
    font-size: 14px;
  }

  .tm-pagehead {
    padding: 36px 0 24px;
    border-bottom: 1px solid var(--tm-line);
    margin-bottom: 32px;

    h1 {
      font-size: clamp(30px, 5vw, 48px);
    }
    p {
      margin-top: 10px;
      max-width: 720px;
      color: var(--tm-muted);
      font-size: 16px;
    }
  }

  .tm-crumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
    font-size: 13px;
    color: var(--tm-muted);
    a:hover {
      color: var(--tm-red);
    }
  }
}

// ---------- плашка «концепт» ----------
.tm-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 14px;
  padding: 7px 16px;
  background: #fdf3f1;
  color: #7a4a43;
  font-size: 13px;
  text-align: center;

  a {
    color: var(--tm-red-d);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

// ---------- шапка H5 ----------
.tm-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: #fff;
}

.tm-top {
  background: var(--tm-mint);
  color: var(--tm-muted);
  font-size: 13px;

  &__inner {
    display: flex;
    align-items: center;
    gap: 20px;
    min-height: 38px;
  }
  &__phone {
    color: var(--tm-ink);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  &__addr {
    white-space: nowrap;
  }
  &__deadline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    white-space: nowrap;

    b {
      color: var(--tm-ink);
    }
  }
  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2fa35a;
  }
  &__login {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--tm-ink);
    font-weight: 600;
    font-size: 13px;
    white-space: nowrap;
  }
}

.tm-bar {
  border-bottom: 1px solid var(--tm-line);

  &__inner {
    display: flex;
    align-items: center;
    gap: 28px;
    min-height: 72px;
  }
}

.tm-mark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  &__sign {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: var(--tm-r);
    background: var(--tm-red);
    color: #fff;

    svg {
      width: 28px;
      height: 28px;
      stroke-width: 2.4;
    }
  }
  &__text {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
  }
  &__name {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: var(--tm-green);
  }
  &__sub {
    margin-top: 3px;
    font-size: 12px;
    color: var(--tm-muted);
    white-space: nowrap;
  }
}

.tm-nav {
  display: flex;
  align-items: stretch;
  align-self: stretch;
  gap: 4px;

  &__link {
    display: flex;
    align-items: center;
    padding: 0 10px;
    border-bottom: 3px solid transparent;
    font-weight: 600;
    font-size: 15px;
    white-space: nowrap;
    transition: color 0.15s, border-color 0.15s;

    &:hover {
      color: var(--tm-red);
    }
    &.router-link-active {
      border-bottom-color: var(--tm-red);
    }
  }
}

.tm-cartbtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  min-width: 132px;
  margin-left: auto;
  padding: 0 16px;
  border-radius: var(--tm-r);
  background: var(--tm-mint);
  color: var(--tm-green);
  font-weight: 700;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  &.is-full {
    background: var(--tm-red);
    color: #fff;
  }
}

.tm-burger {
  display: none;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-left: -10px;
  padding: 0;
  border: 0;
  background: none;
}

.tm-drawer {
  position: absolute;
  inset: 100% 0 auto;
  height: calc(100vh - 100%);
  overflow-y: auto;
  background: #fff;
  border-top: 1px solid var(--tm-line);

  &__nav {
    display: flex;
    flex-direction: column;
    padding: 8px 0 32px;
  }
  &__link {
    padding: 14px 0;
    border: 0;
    border-bottom: 1px solid var(--tm-line);
    background: none;
    text-align: left;
    font-size: 20px;
    font-weight: 700;
  }
  &__contacts {
    display: grid;
    gap: 6px;
    margin-top: 20px;
    color: var(--tm-muted);
    a {
      color: var(--tm-ink);
      font-weight: 700;
      font-size: 18px;
    }
  }
}

.tm-main {
  flex: 1;
  padding-bottom: 72px;
}

// ---------- плавающая корзина (M2) ----------
.tm-float {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 25;
  display: none;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 18px 0 8px;
  border-radius: var(--tm-r);
  background: var(--tm-red);
  color: #fff;
  font-weight: 800;
  box-shadow: 0 6px 20px rgba(19, 36, 27, 0.25);
  font-variant-numeric: tabular-nums;

  &__count {
    display: grid;
    place-items: center;
    min-width: 36px;
    height: 36px;
    padding: 0 6px;
    border-radius: var(--tm-r);
    background: rgba(0, 0, 0, 0.18);
  }
}

// ---------- подвал ----------
.tm-footer {
  background: var(--tm-mint);
  color: var(--tm-muted);
  font-size: 14px;

  &__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
    gap: 32px;
    padding: 48px 0 32px;

    > div {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }
    a:hover {
      color: var(--tm-red);
    }
  }
  &__brand {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: var(--tm-green);
  }
  &__title {
    margin-bottom: 4px;
    font-weight: 700;
    color: var(--tm-ink);
  }
  &__phone {
    font-size: 18px;
    font-weight: 700;
    color: var(--tm-ink);
  }
  &__social {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 14px;
    a {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
  &__legal {
    padding: 16px 0 24px;
    border-top: 1px solid var(--tm-mint-2);
    font-size: 12px;
    color: var(--tm-muted);
  }
}

// ---------- модалка ----------
.tm-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(10, 30, 20, 0.55);

  &__box {
    position: relative;
    display: grid;
    gap: 14px;
    width: min(420px, 100%);
    padding: 28px 24px 24px;
    border-radius: var(--tm-r-lg);
    background: #fff;

    h2 {
      font-size: 28px;
      padding-right: 40px;
    }
  }
  &__close {
    position: absolute;
    top: 12px;
    right: 12px;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    background: none;
  }
}

// ---------- просмотр фото ----------
.tm-zoom {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 56px 16px;
  background: rgba(8, 20, 14, 0.9);

  &__fig {
    margin: 0;
    max-width: min(900px, 100%);
    img {
      max-height: calc(100vh - 150px);
      margin: 0 auto;
      border-radius: var(--tm-r);
    }
    figcaption {
      margin-top: 12px;
      color: #fff;
      text-align: center;
      font-weight: 600;
    }
  }
  &__close,
  &__nav {
    position: absolute;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    padding: 0;
    border: 0;
    border-radius: var(--tm-r);
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    &:hover {
      background: rgba(255, 255, 255, 0.24);
    }
  }
  &__close {
    top: 12px;
    right: 12px;
  }
  &__nav {
    top: 50%;
    transform: translateY(-50%);
    &--prev {
      left: 12px;
    }
    &--next {
      right: 12px;
    }
  }
}

@media (max-width: 1180px) {
  .tm-top__addr {
    display: none;
  }
  .tm-nav__link {
    padding: 0 7px;
    font-size: 14px;
  }
  .tm-bar__inner {
    gap: 16px;
  }
  .tm-mark__sub {
    display: none;
  }
}

@media (max-width: 960px) {
  .tm-nav,
  .tm-top__login {
    display: none;
  }
  .tm-burger {
    display: grid;
  }
  .tm-bar__inner {
    gap: 8px;
    min-height: 60px;
  }
  .tm-mark__sub {
    display: block;
  }
  .tm-top__inner {
    gap: 12px;
    justify-content: space-between;
  }
  .tm-top__deadline {
    margin-left: 0;
  }
  .tm-cartbtn {
    min-width: 0;
    padding: 0 12px;
  }
  .tm-float {
    display: inline-flex;
  }
  .tm-footer__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .tm-mark__sub {
    display: none;
  }
  .tm-mark__sign {
    width: 36px;
    height: 36px;
    svg {
      width: 24px;
      height: 24px;
    }
  }
  .tm-mark__name {
    font-size: 21px;
  }
  .tm-cartbtn__sum {
    display: none;
  }
  .tm-cartbtn {
    width: 44px;
    padding: 0;
    justify-content: center;
  }
  .tm-top {
    font-size: 12px;
  }
  .tm-footer__grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.tm-top__short {
  display: none;
}

@media (max-width: 520px) {
  .tm-top__long {
    display: none;
  }
  .tm-top__short {
    display: inline;
  }
}

@media (max-width: 340px) {
  .tm-top__phone {
    display: none;
  }
  .tm-top__inner {
    justify-content: center;
  }
}

@media print {
  .tm-noprint {
    display: none !important;
  }
}
</style>
