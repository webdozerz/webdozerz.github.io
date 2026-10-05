<script lang="ts" setup>
const route = useRoute()
const cart = useFoodgoodCart()
const menuOpen = ref(false)

const nav = [
  { to: fgPath('/catalog'), label: 'Каталог' },
  { to: fgPath('/discounts'), label: 'Скидки' },
  { to: fgPath('/schedule'), label: 'График' },
  { to: fgPath('/reviews'), label: 'Отзывы' },
  { to: fgPath('/contacts'), label: 'Контакты' },
]

useSeoMeta({
  title: 'FoodGood Tomsk | Концепт редизайна',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'fg-html', lang: 'ru' },
  bodyAttrs: { class: 'fg-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap',
    },
  ],
})

onMounted(cart.persist)
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)
</script>

<template>
  <div class="fg">
    <div class="fg-banner">
      <span>
        Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.
      </span>
      <span class="fg-banner__links">
        <a href="https://foodgoodtomsk.ru" target="_blank" rel="noopener">Оригинал</a>
      </span>
    </div>

    <header class="fg-header">
      <div class="fg-container fg-header__inner">
        <NuxtLink :to="fgPath()" class="fg-brand" aria-label="FoodGood Tomsk, на главную">
          <img :src="fgImages.logo" alt="" class="fg-brand__logo" width="44" height="44" />
          <span class="fg-brand__text">
            <span class="fg-brand__name">FoodGood</span>
            <span class="fg-brand__sub">Томск · здоровая еда</span>
          </span>
        </NuxtLink>

        <nav class="fg-nav" :class="{ 'is-open': menuOpen }" aria-label="Основная навигация">
          <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="fg-nav__link">
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="fg-header__actions">
          <NuxtLink :to="fgPath('/cart')" class="fg-cart" aria-label="Корзина">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 4h2.2l2.1 10.2a1.5 1.5 0 0 0 1.5 1.2h7.9a1.5 1.5 0 0 0 1.4-1l1.9-6H6.1" />
              <circle cx="9.5" cy="19.5" r="1.3" />
              <circle cx="17" cy="19.5" r="1.3" />
            </svg>
            <span v-if="cart.count.value" class="fg-cart__badge">{{ cart.count.value }}</span>
          </NuxtLink>
          <button
            class="fg-burger"
            type="button"
            :aria-expanded="menuOpen"
            aria-label="Меню"
            @click="menuOpen = !menuOpen"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>

    <main class="fg-main">
      <NuxtPage />
    </main>

    <footer class="fg-footer">
      <div class="fg-container fg-footer__grid">
        <div>
          <div class="fg-footer__brand">FoodGood</div>
          <p class="fg-footer__text">
            Магазин здоровой еды: фермерская продукция, ягоды, икра и рыба. Доставка по Томску и
            Северску.
          </p>
        </div>
        <div>
          <div class="fg-footer__title">Магазин</div>
          <NuxtLink :to="fgPath('/catalog')">Каталог</NuxtLink>
          <NuxtLink :to="fgPath('/catalog/sale')">Скидки до 50%</NuxtLink>
          <NuxtLink :to="fgPath('/catalog/gift')">Подарочные сертификаты</NuxtLink>
        </div>
        <div>
          <div class="fg-footer__title">Информация</div>
          <NuxtLink :to="fgPath('/discounts')">Лояльность и скидки</NuxtLink>
          <NuxtLink :to="fgPath('/schedule')">График работы</NuxtLink>
          <NuxtLink :to="fgPath('/reviews')">Фото-отзывы</NuxtLink>
          <NuxtLink :to="fgPath('/contacts')">Контакты</NuxtLink>
        </div>
        <div>
          <div class="fg-footer__title">Связь</div>
          <a :href="fgContacts.phoneHref">{{ fgContacts.phone }}</a>
          <span>{{ fgContacts.address }}</span>
          <span class="fg-footer__muted">{{ fgContacts.owner }}</span>
        </div>
      </div>
      <div class="fg-container fg-footer__legal">
        Концепт редизайна сайта foodgoodtomsk.ru. Тексты, цены и фотографии принадлежат
        владельцу магазина и используются только для демонстрации.
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
// Тема и сброс глобальных тёмных стилей портфолио. Всё привязано к классам, которые
// живут только пока открыт этот концепт.
html.fg-html {
  scrollbar-color: #b9c9a8 #f6f2e7;

  &::-webkit-scrollbar-track {
    background: #f6f2e7;
  }
  &::-webkit-scrollbar-thumb {
    background: #b9c9a8;
    border-color: #f6f2e7;
  }
}

body.fg-body {
  background: #f6f2e7;
  color: #1c2b21;
  font-family: 'Manrope', system-ui, sans-serif;
}

.fg {
  --fg-cream: #f6f2e7;
  --fg-paper: #fffdf7;
  --fg-forest: #17301f;
  --fg-forest-2: #24452f;
  --fg-leaf: #5aa13a;
  --fg-leaf-soft: #e4efd6;
  --fg-berry: #c4324a;
  --fg-berry-soft: #fbe6e9;
  --fg-honey: #e8a838;
  --fg-ink: #1c2b21;
  --fg-muted: #627065;
  --fg-line: #e2dcc6;
  --fg-radius: 18px;
  --fg-shadow: 0 1px 2px rgba(23, 48, 31, 0.06), 0 8px 24px rgba(23, 48, 31, 0.08);
  --fg-serif: 'Playfair Display', Georgia, serif;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--fg-cream);
  color: var(--fg-ink);
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  h1,
  h2,
  h3 {
    margin: 0;
    font-family: var(--fg-serif);
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.01em;
    color: var(--fg-forest);
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
    cursor: pointer;
  }

  :focus-visible {
    outline: 3px solid var(--fg-leaf);
    outline-offset: 2px;
    border-radius: 6px;
  }

  .fg-container {
    width: min(1160px, 100% - 32px);
    margin-inline: auto;
  }
}

// ---------- плашка «концепт» ----------
.fg-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 16px;
  padding: 8px 16px;
  background: var(--fg-forest);
  color: #cfe0c2;
  font-size: 13px;
  text-align: center;

  &__links {
    display: inline-flex;
    gap: 14px;

    a {
      color: #fff;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
}

// ---------- шапка ----------
.fg-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(246, 242, 231, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--fg-line);

  &__inner {
    display: flex;
    align-items: center;
    gap: 24px;
    min-height: 68px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }
}

.fg-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;

  &__logo {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #fff;
    object-fit: cover;
  }

  &__text {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
  }

  &__name {
    font-family: var(--fg-serif);
    font-size: 22px;
    font-weight: 700;
    color: var(--fg-forest);
  }

  &__sub {
    font-size: 12px;
    color: var(--fg-muted);
  }
}

.fg-nav {
  display: flex;
  gap: 4px;
  margin-left: 12px;

  &__link {
    padding: 8px 14px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 15px;
    color: var(--fg-ink);
    transition: background 0.15s;

    &:hover {
      background: var(--fg-leaf-soft);
    }

    &.router-link-active {
      background: var(--fg-forest);
      color: #fff;
    }
  }
}

.fg-cart {
  position: relative;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--fg-paper);
  border: 1px solid var(--fg-line);
  color: var(--fg-forest);
  transition: transform 0.15s;

  &:hover {
    transform: translateY(-1px);
  }

  &__badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--fg-berry);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    line-height: 20px;
    text-align: center;
  }
}

.fg-burger {
  display: none;
  width: 44px;
  height: 44px;
  border: 1px solid var(--fg-line);
  border-radius: 50%;
  background: var(--fg-paper);
  padding: 0;
  place-content: center;
  gap: 4px;

  span {
    display: block;
    width: 18px;
    height: 2px;
    margin: 0 auto;
    background: var(--fg-forest);
    border-radius: 2px;
  }
}

@media (max-width: 860px) {
  .fg-burger {
    display: grid;
  }

  .fg-nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: 0;
    padding: 12px 16px 20px;
    flex-direction: column;
    background: var(--fg-cream);
    border-bottom: 1px solid var(--fg-line);
    display: none;

    &.is-open {
      display: flex;
    }

    &__link {
      padding: 14px 16px;
      font-size: 17px;
    }
  }
}

// ---------- основное и подвал ----------
.fg-main {
  flex: 1;
}

.fg-footer {
  margin-top: 72px;
  padding: 48px 0 28px;
  background: var(--fg-forest);
  color: #cfe0c2;

  &__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 32px;

    > div {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }

    a:hover {
      color: #fff;
    }
  }

  &__brand {
    font-family: var(--fg-serif);
    font-size: 26px;
    font-weight: 700;
    color: #fff;
  }

  &__text {
    max-width: 320px;
    font-size: 14px;
  }

  &__title {
    margin-bottom: 4px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--fg-honey);
  }

  &__muted {
    color: #8fa68a;
    font-size: 13px;
  }

  &__legal {
    margin-top: 36px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    font-size: 12px;
    color: #8fa68a;
  }
}

@media (max-width: 860px) {
  .fg-footer__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 520px) {
  .fg-footer__grid {
    grid-template-columns: 1fr;
  }
}
</style>
