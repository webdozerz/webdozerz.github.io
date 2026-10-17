<script lang="ts" setup>
const route = useRoute()
const cart = useSanychCart()
const catalogOpen = ref(false)
const delivery = ref(snTomorrow())

const nav = [
  { to: snPath('/delivery'), label: 'Доставка и оплата' },
  { to: snPath('/catalog/grill'), label: 'Готовый шашлык' },
  { to: snPath('/opt'), label: 'Мясо оптом' },
  { to: snPath('/about'), label: 'О хозяйстве' },
  { to: snPath('/recipes'), label: 'Рецепты' },
  { to: snPath('/about') + '#contacts', label: 'Контакты' },
]

const counts = computed(() =>
  Object.fromEntries(snCategories.map((c) => [c.id, snOf(c.id).length])),
)

const onCart = computed(() => route.path.startsWith(snPath('/cart')))
const onCatalog = computed(() => route.path.startsWith(snPath('/catalog')))

useSeoMeta({
  title: 'Мясная лавка «Саныч» | Концепт редизайна',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'sn-html', lang: 'ru' },
  bodyAttrs: { class: 'sn-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Unbounded:wght@500;600;700&display=swap',
    },
  ],
})

onMounted(() => {
  cart.persist()
  delivery.value = snTomorrow()
})

watch(
  () => route.fullPath,
  () => {
    catalogOpen.value = false
  },
)

// На телефоне открытый каталог занимает весь экран — фон не должен прокручиваться.
watch(catalogOpen, (open) => {
  document.documentElement.classList.toggle('sn-locked', open)
})

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') catalogOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('sn-locked')
})
</script>

<template>
  <div class="sn">
    <div class="sn-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="snContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="sn-header">
      <div class="sn-wrap sn-header__row">
        <button
          type="button"
          class="sn-catbtn"
          :class="{ 'is-open': catalogOpen }"
          :aria-expanded="catalogOpen"
          aria-controls="sn-catalog"
          @click="catalogOpen = !catalogOpen"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path v-if="!catalogOpen" d="M4 7h16M4 12h16M4 17h10" />
            <path v-else d="M6 6l12 12M18 6L6 18" />
          </svg>
          <span>Каталог</span>
        </button>

        <NuxtLink :to="snPath()" class="sn-mark" aria-label="Мясная лавка «Саныч», на главную">
          <span class="sn-mark__sign" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="30" height="30">
              <path
                d="M2.5 8.5c.4 4.3 3.3 6 7.6 6h1.6l1.1 9.2c.2 1.9 1.5 3.3 3.2 3.3s3-1.4 3.2-3.3l1.1-9.2h1.6c4.3 0 7.2-1.7 7.6-6-2.1 1.9-4.4 2.6-7.4 2.6H9.9c-3 0-5.3-.7-7.4-2.6z"
              />
            </svg>
          </span>
          <span class="sn-mark__text">
            <span class="sn-mark__name">Саныч</span>
            <span class="sn-mark__sub">мясная лавка</span>
          </span>
        </NuxtLink>

        <div class="sn-header__end">
          <div class="sn-header__contact">
            <a :href="snContacts.phoneHref" class="sn-header__phone">{{ snContacts.phone }}</a>
            <span class="sn-header__hours">{{ snContacts.hours }}</span>
          </div>
          <a :href="snContacts.phoneHref" class="sn-iconbtn sn-header__call" aria-label="Позвонить">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
            </svg>
          </a>
          <NuxtLink :to="snPath('/cart')" class="sn-cartbtn" :class="{ 'is-full': cart.count.value }">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M5 8h14l-1.3 10.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5 8zM9 8V7a3 3 0 0 1 6 0v1" />
            </svg>
            <span class="sn-cartbtn__label">
              {{ cart.count.value ? snRub(cart.total.value[0]) : 'Корзина' }}
            </span>
            <span v-if="cart.count.value" class="sn-cartbtn__count">{{ cart.count.value }}</span>
          </NuxtLink>
        </div>
      </div>

      <div class="sn-subnav">
        <div class="sn-wrap sn-subnav__row">
          <nav class="sn-subnav__links" aria-label="Разделы сайта">
            <NuxtLink v-for="item in nav" :key="item.label" :to="item.to">{{ item.label }}</NuxtLink>
          </nav>
          <span class="sn-subnav__when">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
            </svg>
            Привезём завтра, {{ delivery.day }}
          </span>
        </div>
      </div>

      <div v-if="catalogOpen" id="sn-catalog" class="sn-catalog" @click.self="catalogOpen = false">
        <div class="sn-catalog__panel">
          <div class="sn-wrap">
            <div class="sn-catalog__head">
              <span class="sn-catalog__title">Каталог</span>
              <NuxtLink :to="snPath('/catalog')" class="sn-link">Все товары · {{ snProducts.length }}</NuxtLink>
            </div>
            <div class="sn-catalog__grid">
              <NuxtLink
                v-for="c in snCategories"
                :key="c.id"
                :to="snPath(`/catalog/${c.id}`)"
                class="sn-catalog__item"
              >
                <span
                  v-if="c.icon"
                  class="sn-animal"
                  :style="{ '--sn-icon': `url(${snIcon(c.icon)})` }"
                  aria-hidden="true"
                />
                <img v-else :src="snImg(snOf(c.id)[0].img)" alt="" class="sn-catalog__photo" />
                <span>
                  <span class="sn-catalog__name">{{ c.label }}</span>
                  <span class="sn-catalog__count">{{ counts[c.id] }} поз.</span>
                </span>
              </NuxtLink>
            </div>
            <nav class="sn-catalog__info" aria-label="Разделы сайта">
              <NuxtLink v-for="item in nav" :key="item.label" :to="item.to">{{ item.label }}</NuxtLink>
            </nav>
            <div class="sn-catalog__contacts">
              <a :href="snContacts.phoneHref">{{ snContacts.phone }}</a>
              <a :href="snContacts.whatsapp" target="_blank" rel="noopener">Написать в WhatsApp</a>
              <span>{{ snContacts.hours }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="sn-main">
      <NuxtPage />
    </main>

    <footer class="sn-footer">
      <div class="sn-wrap sn-footer__grid">
        <div class="sn-footer__about">
          <div class="sn-footer__brand">Саныч</div>
          <p>
            Мясная лавка и небольшое крестьянское хозяйство из Новосибирской области. Пятый год
            возим охлаждённое фермерское мясо по Новосибирску и области.
          </p>
        </div>
        <div>
          <div class="sn-footer__title">Каталог</div>
          <NuxtLink v-for="c in snCategories.slice(0, 6)" :key="c.id" :to="snPath(`/catalog/${c.id}`)">
            {{ c.label }}
          </NuxtLink>
        </div>
        <div>
          <div class="sn-footer__title">Покупателям</div>
          <NuxtLink :to="snPath('/delivery')">Доставка и оплата</NuxtLink>
          <NuxtLink :to="snPath('/delivery') + '#faq'">Вопрос — ответ</NuxtLink>
          <NuxtLink :to="snPath('/opt')">Мясо оптом</NuxtLink>
          <NuxtLink :to="snPath('/recipes')">Рецепты</NuxtLink>
          <NuxtLink :to="snPath('/about')">О хозяйстве</NuxtLink>
        </div>
        <div id="footer-contacts">
          <div class="sn-footer__title">Контакты</div>
          <a :href="snContacts.phoneHref" class="sn-footer__phone">{{ snContacts.phone }}</a>
          <a :href="snContacts.messengerHref">{{ snContacts.messenger }} · WhatsApp, Telegram</a>
          <a :href="`mailto:${snContacts.email}`">{{ snContacts.email }}</a>
          <span>{{ snContacts.hours }}</span>
        </div>
      </div>
      <div class="sn-wrap sn-footer__legal">
        Концепт редизайна сайта доставка-мяса.рф. Тексты, цены и фотографии принадлежат «Мясной
        лавке Саныч» и используются только для демонстрации.
      </div>
    </footer>

    <nav class="sn-tabbar" aria-label="Быстрые разделы">
      <NuxtLink :to="snPath()" class="sn-tabbar__item" :class="{ 'is-active': route.path === snPath() || route.path === snPath('/') }">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M4 10.5L12 4l8 6.5V20h-5v-6H9v6H4z" />
        </svg>
        Главная
      </NuxtLink>
      <NuxtLink :to="snPath('/catalog')" class="sn-tabbar__item" :class="{ 'is-active': onCatalog }">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
        </svg>
        Каталог
      </NuxtLink>
      <NuxtLink :to="snPath('/cart')" class="sn-tabbar__item sn-tabbar__cart" :class="{ 'is-active': onCart }">
        <span class="sn-tabbar__icon">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M5 8h14l-1.3 10.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5 8zM9 8V7a3 3 0 0 1 6 0v1" />
          </svg>
          <span v-if="cart.count.value" class="sn-tabbar__badge">{{ cart.count.value }}</span>
        </span>
        <span class="sn-tabbar__sum">{{ cart.count.value ? snRub(cart.total.value[0]) : 'Корзина' }}</span>
      </NuxtLink>
      <NuxtLink :to="snPath('/about') + '#contacts'" class="sn-tabbar__item">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
        </svg>
        Контакты
      </NuxtLink>
    </nav>
  </div>
</template>

<style lang="scss">
// Тема концепта. Всё привязано к классам, которые живут только пока открыт этот концепт,
// плюс сброс тёмных глобальных стилей портфолио.
html.sn-html {
  scrollbar-color: #cdbfb3 #ffffff;

  &::-webkit-scrollbar-track {
    background: #fff;
  }
  &::-webkit-scrollbar-thumb {
    background: #cdbfb3;
    border-color: #fff;
  }

  &.sn-locked {
    overflow: hidden;
  }
}

body.sn-body {
  background: #fff;
  color: #2a1f1b;
  font-family: 'Manrope', system-ui, sans-serif;
}

.sn {
  --sn-red: #cf2f12;
  --sn-red-d: #b2260c;
  --sn-rose: #fbece6;
  --sn-rose-2: #f6dbd1;
  --sn-ink: #2a1f1b;
  --sn-muted: #73665e;
  --sn-paper: #f7f2ec;
  --sn-paper-2: #eee5db;
  --sn-line: #e8dfd5;
  --sn-green: #1d7543;
  --sn-green-soft: #e5f1e8;
  --sn-r: 12px;
  --sn-r-lg: 22px;
  --sn-head: 'Unbounded', 'Manrope', system-ui, sans-serif;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: var(--sn-ink);
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  font-variant-numeric: lining-nums;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

// Сброс через :where — нулевая специфичность, чтобы классы блоков могли задавать отступы.
:where(.sn) {
  a {
    color: inherit;
    text-decoration: none;
  }

  h1,
  h2,
  h3 {
    margin: 0;
    font-family: var(--sn-head);
    font-weight: 600;
    line-height: 1.12;
    letter-spacing: -0.01em;
    color: var(--sn-ink);
  }

  p,
  ul,
  ol,
  figure,
  dl,
  dd {
    margin: 0;
  }

  ul,
  ol {
    padding: 0;
  }

  img {
    max-width: 100%;
    display: block;
  }

  button {
    font: inherit;
    color: inherit;
    cursor: pointer;
    background: none;
    border: 0;
    padding: 0;
  }

  input,
  select,
  textarea {
    font: inherit;
    color: inherit;
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
    outline: 2px solid var(--sn-red);
    outline-offset: 2px;
  }
}

.sn {
  .sn-wrap {
    width: min(1240px, 100% - 32px);
    margin-inline: auto;
  }

  .sn-main {
    flex: 1;
    padding-bottom: 72px;
  }

  .sn-muted {
    color: var(--sn-muted);
  }

  .sn-link {
    color: var(--sn-red);
    font-weight: 700;

    &:hover {
      color: var(--sn-red-d);
    }
  }

  // ---------- иконки животных: PNG оригинала как маска, красим currentColor ----------
  .sn-animal {
    display: block;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    background: currentColor;
    color: var(--sn-red);
    -webkit-mask: var(--sn-icon) center / contain no-repeat;
    mask: var(--sn-icon) center / contain no-repeat;
  }

  // ---------- кнопки ----------
  .sn-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 48px;
    padding: 0 22px;
    border-radius: var(--sn-r);
    background: var(--sn-red);
    color: #fff;
    font-weight: 700;
    white-space: nowrap;
    transition: background-color 0.15s;

    &:hover {
      background: var(--sn-red-d);
    }

    &:disabled {
      background: var(--sn-paper-2);
      color: var(--sn-muted);
      cursor: not-allowed;
    }

    &--soft {
      background: var(--sn-rose);
      color: var(--sn-red-d);

      &:hover {
        background: var(--sn-rose-2);
      }
    }

    &--line {
      background: #fff;
      color: var(--sn-ink);
      box-shadow: inset 0 0 0 1px var(--sn-line);

      &:hover {
        background: var(--sn-paper);
      }
    }

    &--done {
      background: var(--sn-green-soft);
      color: var(--sn-green);

      &:hover {
        background: #d6eadc;
      }
    }

    &--wide {
      width: 100%;
    }
  }

  .sn-iconbtn {
    display: inline-grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--sn-r);
    background: var(--sn-paper);
    color: var(--sn-ink);
  }

  // ---------- поля ----------
  .sn-field {
    display: grid;
    gap: 8px;
    min-width: 0;

    > span {
      font-size: 13px;
      font-weight: 700;
      color: var(--sn-muted);
    }

    input,
    select,
    textarea {
      width: 100%;
      min-width: 0;
      min-height: 48px;
      padding: 12px 14px;
      border: 1px solid transparent;
      border-radius: var(--sn-r);
      background: var(--sn-paper);
      outline: none;
      transition: border-color 0.15s, background-color 0.15s;

      &:focus {
        border-color: var(--sn-red);
        background: #fff;
      }
    }

    textarea {
      min-height: 96px;
      resize: vertical;
    }

    select {
      appearance: none;
      padding-right: 40px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2373665e' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      background-size: 18px;
    }
  }

  // Сегментный переключатель: разделка, способ доставки, тип покупателя.
  .sn-seg {
    display: flex;
    gap: 4px;
    padding: 4px;
    border-radius: var(--sn-r);
    background: var(--sn-paper);

    button {
      flex: 1;
      min-width: 0;
      min-height: 36px;
      padding: 0 10px;
      border-radius: 9px;
      font-size: 13px;
      font-weight: 700;
      color: var(--sn-muted);
      white-space: nowrap;
      transition: background-color 0.15s, color 0.15s;

      &:hover {
        color: var(--sn-ink);
      }

      &.is-on {
        background: #fff;
        color: var(--sn-ink);
        box-shadow: 0 1px 2px rgb(42 31 27 / 10%);
      }
    }
  }

  .sn-note {
    padding: 12px 14px;
    border-radius: var(--sn-r);
    background: var(--sn-green-soft);
    color: var(--sn-green);
    font-size: 14px;
    font-weight: 600;
  }

  .sn-pagehead {
    padding: 28px 0 24px;

    h1 {
      font-size: clamp(26px, 4vw, 40px);
    }

    p {
      max-width: 720px;
      margin-top: 10px;
      color: var(--sn-muted);
    }
  }

  .sn-crumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
    font-size: 13px;
    color: var(--sn-muted);

    a:hover {
      color: var(--sn-red);
    }

    span[aria-hidden] {
      opacity: 0.5;
    }
  }

  .sn-sechead {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;

    h2 {
      font-size: clamp(22px, 3vw, 30px);
    }

    p {
      margin-top: 8px;
      color: var(--sn-muted);
    }
  }

  // ---------- баннер концепта ----------
  .sn-banner {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 12px;
    padding: 8px 16px;
    background: var(--sn-ink);
    color: #f1e9e2;
    font-size: 13px;
    text-align: center;

    a {
      color: #fff;
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  // ---------- шапка ----------
  .sn-header {
    position: sticky;
    top: 0;
    z-index: 30;
    background: #fff;
    border-bottom: 1px solid var(--sn-line);
  }

  .sn-header__row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 16px;
    min-height: 76px;
  }

  .sn-catbtn {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 46px;
    padding: 0 18px 0 14px;
    border-radius: var(--sn-r);
    background: var(--sn-red);
    color: #fff;
    font-weight: 700;
    transition: background-color 0.15s;

    &:hover,
    &.is-open {
      background: var(--sn-red-d);
    }
  }

  .sn-mark {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sn-mark__sign {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--sn-red);
    color: #fff;

    svg {
      fill: currentColor;
      stroke: none;
    }
  }

  .sn-mark__text {
    display: grid;
    line-height: 1;
  }

  .sn-mark__name {
    font-family: var(--sn-head);
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.01em;
    text-transform: uppercase;
  }

  .sn-mark__sub {
    margin-top: 4px;
    font-size: 12px;
    font-weight: 600;
    color: var(--sn-muted);
  }

  .sn-header__end {
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .sn-header__contact {
    display: grid;
    text-align: right;
    line-height: 1.25;
  }

  .sn-header__phone {
    font-weight: 800;
    font-size: 16px;
    white-space: nowrap;

    &:hover {
      color: var(--sn-red);
    }
  }

  .sn-header__hours {
    font-size: 12px;
    color: var(--sn-muted);
    white-space: nowrap;
  }

  .sn-header__call {
    display: none;
  }

  .sn-cartbtn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 46px;
    padding: 0 16px;
    border-radius: var(--sn-r);
    background: var(--sn-paper);
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    transition: background-color 0.15s;

    &:hover {
      background: var(--sn-paper-2);
    }

    &.is-full {
      background: var(--sn-rose);
      color: var(--sn-red-d);
    }
  }

  .sn-cartbtn__label {
    min-width: 72px;
  }

  .sn-cartbtn__count {
    position: absolute;
    top: -6px;
    right: -6px;
    display: grid;
    place-items: center;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 10px;
    background: var(--sn-red);
    color: #fff;
    font-size: 11px;
    font-weight: 800;
  }

  .sn-subnav {
    border-top: 1px solid var(--sn-line);
  }

  .sn-subnav__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 46px;
  }

  .sn-subnav__links {
    display: flex;
    gap: 4px;
    margin-left: -12px;

    a {
      padding: 6px 12px;
      border-radius: 9px;
      font-size: 14px;
      font-weight: 600;
      color: var(--sn-muted);
      white-space: nowrap;
      transition: color 0.15s, background-color 0.15s;

      &:hover,
      &.router-link-exact-active {
        color: var(--sn-ink);
        background: var(--sn-paper);
      }
    }
  }

  .sn-subnav__when {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    color: var(--sn-green);
    white-space: nowrap;
  }

  // ---------- каталог-панель ----------
  .sn-catalog {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    height: calc(100vh - 100%);
    background: rgb(42 31 27 / 28%);
  }

  .sn-catalog__panel {
    max-height: 100%;
    overflow-y: auto;
    padding: 24px 0 28px;
    background: #fff;
    border-top: 1px solid var(--sn-line);
    border-radius: 0 0 var(--sn-r-lg) var(--sn-r-lg);
  }

  .sn-catalog__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
  }

  .sn-catalog__title {
    font-family: var(--sn-head);
    font-size: 20px;
    font-weight: 600;
  }

  .sn-catalog__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 8px;
  }

  .sn-catalog__item {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 72px;
    padding: 12px 14px;
    border-radius: 16px;
    background: var(--sn-paper);
    transition: background-color 0.15s;

    &:hover {
      background: var(--sn-rose);
    }

    > span:last-child {
      display: grid;
      min-width: 0;
    }
  }

  .sn-catalog__photo {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    object-fit: cover;
  }

  .sn-catalog__name {
    font-weight: 700;
  }

  .sn-catalog__count {
    font-size: 13px;
    color: var(--sn-muted);
  }

  .sn-catalog__info,
  .sn-catalog__contacts {
    display: none;
  }

  // ---------- подвал ----------
  .sn-footer {
    padding: 44px 0 24px;
    background: var(--sn-paper);
    font-size: 14px;
  }

  .sn-footer__grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1.3fr;
    gap: 28px;

    > div {
      display: grid;
      align-content: start;
      gap: 8px;
      min-width: 0;
    }

    a:hover {
      color: var(--sn-red);
    }
  }

  .sn-footer__brand {
    font-family: var(--sn-head);
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .sn-footer__about p {
    max-width: 340px;
    color: var(--sn-muted);
  }

  .sn-footer__title {
    margin-bottom: 4px;
    font-weight: 800;
  }

  .sn-footer__phone {
    font-size: 18px;
    font-weight: 800;
  }

  .sn-footer__legal {
    margin-top: 32px;
    padding-top: 18px;
    border-top: 1px solid var(--sn-line);
    font-size: 12px;
    color: var(--sn-muted);
  }

  // ---------- таббар (телефон) ----------
  .sn-tabbar {
    display: none;
  }
}

// ---------- общее для инфо-страниц (доставка, опт, о хозяйстве) ----------
// Лежит в оболочке: CSS дочерней страницы грузится только вместе с ней.
.sn .sni-way {
  display: grid;
  align-content: start;
  gap: 6px;
  padding: 22px;
  border-radius: var(--sn-r-lg);
  background: var(--sn-paper);

  p {
    margin-top: 4px;
    color: var(--sn-muted);
    font-size: 14px;
  }
}

.sn .sni-way__title {
  font-weight: 700;
  color: var(--sn-muted);
}

.sn .sni-way__when {
  font-family: var(--sn-head);
  font-size: 26px;
  font-weight: 600;
  color: var(--sn-red);
}

.sn .sni-section {
  margin-top: 48px;

  h2 {
    margin-bottom: 16px;
    font-size: clamp(20px, 2.6vw, 26px);
  }

  p + p {
    margin-top: 12px;
  }

  p {
    color: var(--sn-muted);
  }
}

.sn .sni-list {
  display: grid;
  gap: 10px;
  list-style: none;

  li {
    position: relative;
    padding-left: 22px;
    color: var(--sn-muted);

    &::before {
      content: '';
      position: absolute;
      left: 2px;
      top: 9px;
      width: 8px;
      height: 8px;
      border-radius: 2px;
      background: var(--sn-red);
    }
  }
}

.sn .sno-form {
  display: grid;
  gap: 14px;
  padding: 26px;
  border-radius: var(--sn-r-lg);
  box-shadow: inset 0 0 0 1px var(--sn-line);

  h2 {
    margin-bottom: 4px;
  }
}

.sn .sno-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 760px) {
  .sn .sni-way {
    padding: 18px;
  }

  .sn .sni-section {
    margin-top: 36px;
  }
}

@media (max-width: 560px) {
  .sn .sno-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .sn .sno-form {
    padding: 20px 16px;
  }
}

@media (max-width: 1100px) {
  .sn {
    .sn-subnav__links a:nth-child(n + 5) {
      display: none;
    }
  }
}

@media (max-width: 900px) {
  .sn {
    .sn-subnav {
      display: none;
    }

    .sn-header__contact {
      display: none;
    }

    .sn-header__call {
      display: inline-grid;
    }

    .sn-catalog__info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 16px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid var(--sn-line);

      a {
        padding: 8px 0;
        font-weight: 600;
      }
    }

    .sn-catalog__contacts {
      display: grid;
      gap: 6px;
      margin-top: 16px;
      font-weight: 700;

      span {
        font-weight: 500;
        color: var(--sn-muted);
      }
    }
  }
}

@media (max-width: 760px) {
  .sn {
    .sn-main {
      padding-bottom: 104px;
    }

    .sn-header__row {
      min-height: 64px;
      gap: 10px;
    }

    .sn-catbtn {
      width: 44px;
      min-height: 44px;
      padding: 0;
      justify-content: center;

      span {
        display: none;
      }
    }

    .sn-cartbtn {
      display: none;
    }

    .sn-mark__sign {
      width: 38px;
      height: 38px;
      border-radius: 10px;

      svg {
        width: 26px;
        height: 26px;
      }
    }

    .sn-mark__name {
      font-size: 20px;
    }

    .sn-mark__sub {
      font-size: 11px;
    }

    .sn-catalog {
      height: calc(100dvh - 100%);
      background: #fff;
    }

    .sn-catalog__panel {
      height: 100%;
      padding: 18px 0 96px;
      border-radius: 0;
    }

    .sn-catalog__grid {
      grid-template-columns: 1fr;
      gap: 6px;
    }

    .sn-catalog__item {
      min-height: 60px;
      padding: 8px 12px;
    }

    .sn-catalog__item .sn-animal,
    .sn-catalog__photo {
      width: 38px;
      height: 38px;
    }

    .sn-footer {
      padding-bottom: 96px;
    }

    .sn-footer__grid {
      grid-template-columns: 1fr 1fr;
    }

    .sn-footer__about {
      grid-column: 1 / -1;
    }

    .sn-tabbar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 40;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
      background: #fff;
      border-top: 1px solid var(--sn-line);
    }

    .sn-tabbar__item {
      display: grid;
      justify-items: center;
      gap: 2px;
      min-width: 0;
      padding: 6px 2px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 700;
      color: var(--sn-muted);

      &.is-active {
        color: var(--sn-red);
      }
    }

    .sn-tabbar__icon {
      position: relative;
      display: block;
      height: 22px;
    }

    .sn-tabbar__badge {
      position: absolute;
      top: -4px;
      right: -10px;
      display: grid;
      place-items: center;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      border-radius: 9px;
      background: var(--sn-red);
      color: #fff;
      font-size: 10px;
      font-weight: 800;
    }

    .sn-tabbar__sum {
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
  }
}

@media (max-width: 380px) {
  .sn {
    .sn-mark__sub {
      display: none;
    }

    .sn-footer__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
