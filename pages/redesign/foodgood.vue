<script lang="ts" setup>
import FgSearch from '~/components/redesign/foodgood/FgSearch.vue'
import FgLeaf from '~/components/redesign/foodgood/FgLeaf.vue'

const route = useRoute()
const cart = useFoodgoodCart()
const menuOpen = ref(false)
const today = ref<{ today: boolean; text: string } | null>(null)

const nav = [
  { to: fgPath('/catalog/sale'), label: 'Скидки до 50%' },
  { to: fgPath('/catalog/gift'), label: 'Сертификаты' },
  { to: fgPath('/discounts'), label: 'Система лояльности' },
  { to: fgPath('/reviews'), label: 'Фото-отзывы' },
  { to: fgPath('/contacts'), label: 'Доставка и контакты' },
]

const counts = Object.fromEntries(fgCategories.map((c) => [c.id, fgOf(c.id).length]))

const onCart = computed(() => route.path.startsWith(fgPath('/cart')))
const showBar = computed(() => cart.count.value > 0 && !onCart.value)

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
      href: 'https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap',
    },
  ],
})

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  cart.persist()
  today.value = fgTodayLabel()
  timer = setInterval(() => (today.value = fgTodayLabel()), 30_000)
})

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

// Открытое меню закрывает страницу целиком — фон не прокручивается.
watch(menuOpen, (open) => {
  document.documentElement.classList.toggle('fg-locked', open)
})

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') menuOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  clearInterval(timer)
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('fg-locked')
})
</script>

<template>
  <div class="fg" :class="{ 'has-bar': showBar }">
    <div class="fg-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="fgContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="fg-header">
      <div class="fg-wrap fg-header__row">
        <button
          type="button"
          class="fg-iconbtn fg-header__burger"
          :aria-expanded="menuOpen"
          aria-controls="fg-menu"
          aria-label="Меню"
          @click="menuOpen = !menuOpen"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path v-if="!menuOpen" d="M4 7h16M4 12h16M4 17h16" />
            <path v-else d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <NuxtLink :to="fgPath()" class="fg-mark" aria-label="FoodGood, на главную">
          <span class="fg-mark__sign" aria-hidden="true"><FgLeaf /></span>
          <span class="fg-mark__text">
            <span class="fg-mark__name">FoodGood</span>
            <span class="fg-mark__sub">магазин здоровой еды</span>
          </span>
        </NuxtLink>

        <button
          type="button"
          class="fg-catbtn"
          :class="{ 'is-open': menuOpen }"
          :aria-expanded="menuOpen"
          aria-controls="fg-menu"
          @click="menuOpen = !menuOpen"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path v-if="!menuOpen" d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v6H4zM14 15h6v6h-6z" />
            <path v-else d="M6 6l12 12M18 6L6 18" />
          </svg>
          Каталог
        </button>

        <FgSearch class="fg-header__search" />

        <div class="fg-header__contact">
          <a :href="fgContacts.phoneHref">{{ fgContacts.phone }}</a>
          <span>ежедневно 11:00–20:00</span>
        </div>

        <NuxtLink :to="fgPath('/cart')" class="fg-cartbtn" :class="{ 'is-full': cart.count.value }">
          <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
            <path d="M5 8h14l-1.3 10.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5 8zM9 8V7a3 3 0 0 1 6 0v1" />
          </svg>
          <span class="fg-cartbtn__label">
            {{ cart.count.value ? fgFormatPrice(cart.subtotal.value) : 'Корзина' }}
          </span>
          <span v-if="cart.count.value" class="fg-cartbtn__count">{{ cart.count.value }}</span>
        </NuxtLink>
      </div>

      <div class="fg-subnav">
        <div class="fg-wrap fg-subnav__row">
          <nav class="fg-subnav__links" aria-label="Разделы сайта">
            <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
          </nav>
          <span v-if="today" class="fg-today" :class="{ 'is-late': !today.today }">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
            {{ today.text }}
          </span>
        </div>
      </div>

      <div v-if="menuOpen" class="fg-menu" @click.self="menuOpen = false">
        <div id="fg-menu" class="fg-menu__panel">
          <div class="fg-wrap">
            <div class="fg-menu__grid">
              <NuxtLink
                v-for="c in fgCategories"
                :key="c.id"
                :to="fgPath(`/catalog/${c.id}`)"
                class="fg-menu__cat"
              >
                <img :src="c.cover" alt="" loading="lazy" />
                <span>
                  <strong>{{ c.title }}</strong>
                  <small>{{ fgGoods(counts[c.id]!) }}</small>
                </span>
              </NuxtLink>
            </div>
            <div class="fg-menu__foot">
              <NuxtLink :to="fgPath('/catalog')" class="fg-link">Все товары · {{ fgProducts.length }}</NuxtLink>
              <nav class="fg-menu__pages" aria-label="Разделы сайта">
                <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
              </nav>
              <a :href="fgContacts.phoneHref" class="fg-menu__phone">{{ fgContacts.phone }}</a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="fg-main">
      <NuxtPage />
    </main>

    <footer class="fg-footer">
      <div class="fg-wrap fg-footer__grid">
        <div class="fg-footer__about">
          <NuxtLink :to="fgPath()" class="fg-mark">
            <span class="fg-mark__sign" aria-hidden="true"><FgLeaf /></span>
            <span class="fg-mark__text">
              <span class="fg-mark__name">FoodGood</span>
              <span class="fg-mark__sub">магазин здоровой еды</span>
            </span>
          </NuxtLink>
          <p>
            Фермерская продукция и прямые поставки ягод и фруктов из Кыргызстана, Казахстана,
            Белоруссии, Крыма и Кубани. Доставка по Томску и Северску.
          </p>
        </div>
        <div>
          <h2 class="fg-footer__title">Каталог</h2>
          <NuxtLink v-for="c in fgCategories" :key="c.id" :to="fgPath(`/catalog/${c.id}`)">
            {{ c.short }}
          </NuxtLink>
        </div>
        <div>
          <h2 class="fg-footer__title">Покупателям</h2>
          <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        </div>
        <div class="fg-footer__shop">
          <h2 class="fg-footer__title">Магазин</h2>
          <a :href="fgContacts.phoneHref">{{ fgContacts.phone }}</a>
          <span>{{ fgContacts.address }}</span>
          <span>Ежедневно 11:00–20:00</span>
          <span class="fg-muted">{{ fgContacts.owner }}</span>
        </div>
      </div>
      <div class="fg-wrap fg-footer__legal">
        Концепт редизайна сайта foodgoodtomsk.ru. Тексты, цены и фотографии принадлежат владельцу
        магазина и используются только для демонстрации.
      </div>
    </footer>

    <Transition name="fg-bar">
      <NuxtLink v-if="showBar" :to="fgPath('/cart')" class="fg-bar">
        <span class="fg-bar__count">{{ cart.count.value }}</span>
        <span class="fg-bar__sum">{{ fgFormatPrice(cart.subtotal.value) }}</span>
        <span class="fg-bar__go">
          Оформить
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </span>
      </NuxtLink>
    </Transition>
  </div>
</template>

<style lang="scss">
// Тема концепта. Всё привязано к классам, которые живут только пока открыт этот концепт,
// плюс сброс тёмных глобальных стилей портфолио.
html.fg-html {
  scrollbar-color: #c4d3bd #ffffff;

  &::-webkit-scrollbar-track {
    background: #fff;
  }
  &::-webkit-scrollbar-thumb {
    background: #c4d3bd;
    border-color: #fff;
  }

  &.fg-locked {
    overflow: hidden;
  }
}

body.fg-body {
  background: #fff;
  color: #12261a;
  font-family: 'Jost', system-ui, sans-serif;
}

.fg {
  --fg-leaf: #2c8a3c;
  --fg-leaf-d: #23722f;
  --fg-leaf-soft: #e3f0df;
  --fg-ink: #12261a;
  --fg-muted: #5f6f64;
  --fg-sage: #eff4ec;
  --fg-sage-2: #e2eadd;
  --fg-line: #e1e8dc;
  --fg-sale: #e2622b;
  --fg-sale-d: #c44d1a;
  --fg-sale-soft: #fdeee6;
  --fg-r: 12px;
  --fg-r-lg: 22px;
  --fg-header: 124px;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: var(--fg-ink);
  font-family: 'Jost', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

// Сброс через :where — нулевая специфичность, чтобы классы блоков могли задавать отступы.
:where(.fg) {
  a {
    color: inherit;
    text-decoration: none;
  }

  h1,
  h2,
  h3 {
    margin: 0;
    font-weight: 600;
    line-height: 1.12;
    letter-spacing: -0.015em;
    color: var(--fg-ink);
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
    list-style: none;
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
    outline: 2px solid var(--fg-leaf);
    outline-offset: 2px;
  }
}

.fg {
  .fg-wrap {
    width: min(1280px, 100% - 32px);
    margin-inline: auto;
  }

  .fg-main {
    flex: 1;
    padding-bottom: 80px;
  }

  .fg-muted {
    color: var(--fg-muted);
  }

  .fg-link {
    color: var(--fg-leaf);
    font-weight: 600;

    &:hover {
      color: var(--fg-leaf-d);
    }
  }

  .fg-price {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  // Кнопки
  .fg-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 48px;
    padding: 0 22px;
    border-radius: var(--fg-r);
    font-weight: 600;
    white-space: nowrap;
    transition:
      background-color 0.15s,
      color 0.15s;

    &--primary {
      background: var(--fg-leaf);
      color: #fff;

      &:hover {
        background: var(--fg-leaf-d);
      }
    }

    &--soft {
      background: var(--fg-leaf-soft);
      color: var(--fg-ink);

      &:hover {
        background: #d3e7cd;
      }
    }

    &--line {
      background: #fff;
      box-shadow: inset 0 0 0 1px var(--fg-line);

      &:hover {
        box-shadow: inset 0 0 0 1px var(--fg-leaf);
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }

  .fg-iconbtn {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--fg-r);
    transition: background-color 0.15s;

    &:hover {
      background: var(--fg-sage);
    }
  }

  // Заголовок секции: слева заголовок, справа ссылка
  .fg-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px 16px;
    margin-bottom: 20px;

    h2 {
      font-size: clamp(24px, 3vw, 32px);
    }

    a {
      flex-shrink: 0;
    }
  }

  .fg-section {
    margin-top: clamp(48px, 7vw, 80px);
  }

  .fg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(212px, 1fr));
    gap: 20px 16px;
  }

  // Заголовок внутренней страницы
  .fg-page-head {
    padding: 28px 0 24px;

    h1 {
      font-size: clamp(30px, 4.4vw, 46px);
    }

    p {
      max-width: 640px;
      margin-top: 10px;
      color: var(--fg-muted);
      font-size: 17px;
    }
  }

  .fg-crumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
    color: var(--fg-muted);
    font-size: 14px;

    a:hover {
      color: var(--fg-leaf);
    }

    span[aria-hidden] {
      color: #b4c0b6;
    }
  }

  // Панель на поверхности
  .fg-panel {
    padding: clamp(20px, 3vw, 32px);
    border-radius: var(--fg-r-lg);
    background: var(--fg-sage);
  }

  // Поля
  .fg-field {
    display: grid;
    gap: 6px;

    > span {
      font-size: 14px;
      font-weight: 500;
    }

    input,
    textarea,
    select {
      width: 100%;
      min-height: 50px;
      padding: 12px 16px;
      border: 1px solid var(--fg-line);
      border-radius: var(--fg-r);
      background: #fff;
      transition: border-color 0.15s;

      &:focus {
        outline: none;
        border-color: var(--fg-leaf);
      }
    }

    textarea {
      resize: vertical;
      min-height: 96px;
    }

    small {
      color: var(--fg-sale-d);
      font-size: 13px;
    }

    &.is-error input {
      border-color: var(--fg-sale);
    }
  }
}

// Баннер концепта
.fg .fg-banner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
  padding: 8px 16px;
  background: var(--fg-sage);
  color: var(--fg-muted);
  font-size: 13px;
  line-height: 1.4;
  text-align: center;

  a {
    color: var(--fg-ink);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

// Шапка
.fg .fg-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: #fff;
  box-shadow: 0 1px 0 var(--fg-line);

  &__row {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 76px;
  }

  &__burger {
    display: none;
    margin-left: -10px;
  }

  &__search {
    flex: 1;
    min-width: 0;
  }

  &__contact {
    display: grid;
    line-height: 1.25;
    white-space: nowrap;

    a {
      font-weight: 600;
    }

    span {
      color: var(--fg-muted);
      font-size: 13px;
    }
  }
}

.fg .fg-mark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  &__sign {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--fg-leaf);
    color: #fff;
  }

  &__text {
    display: grid;
    line-height: 1.05;
  }

  &__name {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  &__sub {
    margin-top: 3px;
    color: var(--fg-muted);
    font-size: 13px;
  }
}

.fg .fg-catbtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 18px;
  border-radius: var(--fg-r);
  background: var(--fg-leaf);
  color: #fff;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.15s;

  &:hover,
  &.is-open {
    background: var(--fg-leaf-d);
  }
}

.fg .fg-cartbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 132px;
  min-height: 48px;
  padding: 0 16px;
  border-radius: var(--fg-r);
  background: var(--fg-sage);
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.15s;

  &:hover {
    background: var(--fg-sage-2);
  }

  &__label {
    font-variant-numeric: tabular-nums;
  }

  &__count {
    position: absolute;
    top: -6px;
    left: 30px;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: var(--fg-leaf);
    color: #fff;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
  }
}

.fg .fg-subnav {
  border-top: 1px solid var(--fg-line);

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    min-height: 46px;
  }

  &__links {
    display: flex;
    gap: 28px;
    font-size: 15px;

    a {
      white-space: nowrap;
      transition: color 0.15s;

      &:hover,
      &.router-link-active {
        color: var(--fg-leaf);
      }

      &:first-child {
        color: var(--fg-sale-d);
        font-weight: 600;
      }
    }
  }
}

.fg .fg-today {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--fg-leaf-d);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  &.is-late {
    color: var(--fg-muted);
  }
}

// Каталог: панель под шапкой
.fg .fg-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 100vh;
  background: rgba(18, 38, 26, 0.32);

  &__panel {
    max-height: calc(100dvh - 150px);
    overflow-y: auto;
    padding: 24px 0 28px;
    background: #fff;
    border-top: 1px solid var(--fg-line);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  &__cat {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 8px;
    border-radius: 16px;
    transition: background-color 0.15s;

    &:hover {
      background: var(--fg-sage);
    }

    img {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      object-fit: cover;
      background: var(--fg-sage);
    }

    span {
      display: grid;
      min-width: 0;
    }

    strong {
      font-weight: 600;
      line-height: 1.25;
    }

    small {
      color: var(--fg-muted);
      font-size: 14px;
    }
  }

  &__foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 24px;
    margin-top: 20px;
    padding-top: 18px;
    border-top: 1px solid var(--fg-line);
  }

  &__pages {
    display: none;
  }

  &__phone {
    display: none;
    font-weight: 600;
  }
}

// Подвал
.fg .fg-footer {
  padding: 48px 0 calc(32px + var(--fg-bar-space, 0px));
  background: var(--fg-sage);

  &__grid {
    display: grid;
    grid-template-columns: 1.4fr repeat(3, 1fr);
    gap: 32px;

    > div {
      display: grid;
      align-content: start;
      gap: 8px;
    }

    a:hover {
      color: var(--fg-leaf);
    }
  }

  &__about p {
    max-width: 340px;
    margin-top: 8px;
    color: var(--fg-muted);
  }

  &__title {
    margin-bottom: 4px;
    font-size: 17px;
  }

  &__legal {
    margin-top: 36px;
    padding-top: 20px;
    border-top: 1px solid var(--fg-sage-2);
    color: var(--fg-muted);
    font-size: 13px;
  }
}

// Нижняя полоса корзины (телефон)
.fg .fg-bar {
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: 12px;
  z-index: 35;
  display: none;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 0 8px 0 10px;
  border-radius: 16px;
  background: var(--fg-leaf);
  color: #fff;
  box-shadow: 0 10px 30px rgba(18, 38, 26, 0.24);

  &__count {
    min-width: 32px;
    height: 32px;
    padding: 0 8px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.18);
    font-weight: 600;
    line-height: 32px;
    text-align: center;
  }

  &__sum {
    font-size: 18px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  &__go {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
    padding: 0 12px;
    min-height: 40px;
    border-radius: 10px;
    background: #fff;
    color: var(--fg-leaf-d);
    font-weight: 600;
  }
}

.fg-bar-enter-active,
.fg-bar-leave-active {
  transition:
    transform 0.2s,
    opacity 0.2s;
}

.fg-bar-enter-from,
.fg-bar-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

@media (max-width: 1180px) {
  .fg .fg-header__contact {
    display: none;
  }

  .fg .fg-subnav__links {
    gap: 20px;
  }
}

@media (max-width: 1020px) {
  .fg .fg-menu__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fg .fg-today {
    display: none;
  }

  .fg .fg-footer__grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .fg .fg-footer__about {
    grid-column: 1 / -1;
  }
}

// Телефон и узкий планшет: бургер, поиск второй строкой, полоса корзины снизу
@media (max-width: 860px) {
  .fg {
    --fg-bar-space: 0px;
  }

  .fg.has-bar {
    --fg-bar-space: 72px;
  }

  .fg .fg-header__row {
    flex-wrap: wrap;
    gap: 4px 8px;
    min-height: 0;
    padding: 8px 0 10px;
  }

  .fg .fg-header__burger {
    display: grid;
  }

  .fg .fg-catbtn,
  .fg .fg-subnav {
    display: none;
  }

  .fg .fg-header__search {
    order: 5;
    flex-basis: 100%;
  }

  .fg .fg-mark__sign {
    width: 36px;
    height: 36px;
  }

  .fg .fg-mark__name {
    font-size: 20px;
  }

  .fg .fg-cartbtn {
    min-width: 0;
    margin-left: auto;
    padding: 0 12px;
  }

  .fg .fg-menu__pages {
    display: grid;
    gap: 12px;
    flex-basis: 100%;
    font-size: 17px;
  }

  .fg .fg-menu__phone {
    display: block;
  }

  .fg .fg-bar {
    display: flex;
  }
}

@media (max-width: 560px) {
  .fg .fg-menu__grid {
    grid-template-columns: 1fr;
  }

  .fg .fg-mark__sub {
    display: none;
  }

  .fg .fg-cartbtn__label {
    display: none;
  }

  .fg .fg-cartbtn__count {
    left: 26px;
  }

  .fg .fg-footer__grid {
    grid-template-columns: 1fr 1fr;
  }

  .fg .fg-footer__shop {
    grid-column: 1 / -1;
  }

  .fg .fg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 10px;
  }
}

@media (max-width: 360px) {
  .fg .fg-grid {
    gap: 18px 8px;
  }
}
</style>
