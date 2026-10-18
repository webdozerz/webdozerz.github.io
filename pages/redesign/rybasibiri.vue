<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const cart = useRybasibiriCart()
const menuOpen = ref(false)

const isOpt = computed(() => cart.mode.value === 'opt')

const nav = computed(() => [
  isOpt.value
    ? { to: rsPath('/opt'), label: 'Прайс' }
    : { to: rsPath('/catalog'), label: 'Магазин' },
  { to: rsPath('/production'), label: 'Производство и СТМ' },
  { to: rsPath('/contacts'), label: 'Контакты' },
])

const strip = computed(() =>
  isOpt.value
    ? rsOpt.map((g) => ({ to: `${rsPath('/opt')}#${g.id}`, label: g.label }))
    : rsCategories.map((c) => ({ to: rsPath(`/catalog/${c.id}`), label: c.short })),
)

// Режим следует за страницей: прайс — опт, магазин и карточка товара — розница.
const syncMode = (path: string) => {
  if (path.startsWith(rsPath('/opt'))) cart.mode.value = 'opt'
  else if (path.startsWith(rsPath('/catalog')) || path.startsWith(rsPath('/product'))) cart.mode.value = 'retail'
  else if (path.startsWith(rsPath('/cart'))) cart.mode.value = route.query.tab === 'opt' ? 'opt' : 'retail'
}
watch(
  () => route.path,
  (path) => {
    syncMode(path)
    menuOpen.value = false
  },
  { immediate: true },
)

const setMode = (mode: RsMode) => {
  cart.mode.value = mode
  router.push(mode === 'opt' ? rsPath('/opt') : rsPath('/catalog'))
}

const cartLabel = computed(() => {
  if (isOpt.value) return cart.optCount.value ? `Заявка · ${cart.optCount.value}` : 'Заявка'
  return cart.count.value ? rsRub(cart.total.value[0]) : 'Корзина'
})
const cartCount = computed(() => (isOpt.value ? cart.optCount.value : cart.count.value))
const cartTo = computed(() => rsPath('/cart') + (isOpt.value ? '?tab=opt' : ''))

const isActive = (to: string) => route.path.startsWith(to.split('#')[0].split('?')[0])

useSeoMeta({
  title: 'Стиль Продукт — рыба и морепродукты | Концепт редизайна',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'rs-html', lang: 'ru' },
  bodyAttrs: { class: 'rs-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Geologica:wght@400;500;600;700&display=swap',
    },
  ],
})

// Сохранённый режим подгружается из браузера — после этого страница снова решает, какой он.
onMounted(() => {
  cart.persist()
  syncMode(route.path)
})

watch(menuOpen, (open) => {
  document.documentElement.classList.toggle('rs-locked', open)
})
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') menuOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('rs-locked')
})
</script>

<template>
  <div class="rs" :class="{ 'rs--opt': isOpt }">
    <div class="rs-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="rsContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="rs-header">
      <div class="rs-wrap rs-header__row">
        <NuxtLink :to="rsPath()" class="rs-mark" aria-label="«Стиль Продукт», на главную">
          <span class="rs-mark__sign" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M3 12c2.4-3.7 5.9-5.6 10-5.6 3 0 5.4 1.4 7 3.4L22 7.5v9l-2-2.3c-1.6 2-4 3.4-7 3.4-4.1 0-7.6-1.9-10-5.6z" />
              <path d="M8 10.5v3" />
            </svg>
          </span>
          <span class="rs-mark__text">
            <span class="rs-mark__name">Стиль Продукт</span>
            <span class="rs-mark__sub">рыба и морепродукты · Кемерово</span>
          </span>
        </NuxtLink>

        <div class="rs-mode" role="group" aria-label="Кто покупает">
          <button type="button" :class="{ 'is-on': !isOpt }" :aria-pressed="!isOpt" @click="setMode('retail')">Розница</button>
          <button type="button" :class="{ 'is-on': isOpt }" :aria-pressed="isOpt" @click="setMode('opt')">Опт</button>
        </div>

        <nav class="rs-header__nav" aria-label="Разделы сайта">
          <NuxtLink v-for="item in nav" :key="item.label" :to="item.to" :class="{ 'is-active': isActive(item.to) }">
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="rs-header__end">
          <a :href="rsContacts.phoneHref" class="rs-header__phone">
            <span>{{ rsContacts.phone }}</span>
            <small>{{ isOpt ? 'отдел продаж' : 'заказ и вопросы' }}</small>
          </a>
          <NuxtLink :to="rsPath('/catalog') + '?fav=1'" class="rs-iconbtn rs-header__fav" aria-label="Избранное">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
            </svg>
            <span v-if="cart.favs.value.length" class="rs-iconbtn__badge">{{ cart.favs.value.length }}</span>
          </NuxtLink>
          <NuxtLink :to="cartTo" class="rs-cartbtn" :class="{ 'is-full': cartCount }">
            <svg v-if="isOpt" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M5 8h14l-1.3 10.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5 8zM9 8V7a3 3 0 0 1 6 0v1" />
            </svg>
            <span class="rs-cartbtn__label">{{ cartLabel }}</span>
          </NuxtLink>
          <button
            type="button"
            class="rs-iconbtn rs-header__burger"
            :aria-expanded="menuOpen"
            aria-controls="rs-menu"
            :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
            @click="menuOpen = !menuOpen"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path v-if="!menuOpen" d="M4 7h16M4 12h16M4 17h16" />
              <path v-else d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      <div class="rs-strip">
        <div class="rs-wrap rs-strip__row">
          <span class="rs-strip__lead">{{ isOpt ? 'Прайс' : 'Магазин' }}</span>
          <nav class="rs-strip__links" :aria-label="isOpt ? 'Разделы прайса' : 'Разделы магазина'">
            <NuxtLink v-for="s in strip" :key="s.to" :to="s.to">{{ s.label }}</NuxtLink>
          </nav>
        </div>
      </div>

      <div v-if="menuOpen" id="rs-menu" class="rs-menu" @click.self="menuOpen = false">
        <div class="rs-menu__panel">
          <div class="rs-mode rs-mode--wide" role="group" aria-label="Кто покупает">
            <button type="button" :class="{ 'is-on': !isOpt }" :aria-pressed="!isOpt" @click="setMode('retail')">Розница</button>
            <button type="button" :class="{ 'is-on': isOpt }" :aria-pressed="isOpt" @click="setMode('opt')">Опт</button>
          </div>
          <nav class="rs-menu__nav" aria-label="Разделы сайта">
            <NuxtLink :to="rsPath()">Главная</NuxtLink>
            <NuxtLink v-for="item in nav" :key="item.label" :to="item.to">{{ item.label }}</NuxtLink>
          </nav>
          <div class="rs-menu__title">{{ isOpt ? 'Разделы прайса' : 'Разделы магазина' }}</div>
          <nav class="rs-menu__cats">
            <NuxtLink v-for="s in strip" :key="s.to" :to="s.to">{{ s.label }}</NuxtLink>
          </nav>
          <div class="rs-menu__contacts">
            <a v-for="p in rsContacts.phones" :key="p.href" :href="p.href">{{ p.label }}</a>
            <a :href="`mailto:${rsContacts.email}`">{{ rsContacts.email }}</a>
            <a :href="rsContacts.vk" target="_blank" rel="noopener">Заказать во ВКонтакте</a>
          </div>
        </div>
      </div>
    </header>

    <main class="rs-main">
      <NuxtPage />
    </main>

    <footer class="rs-footer">
      <div class="rs-wrap rs-footer__grid">
        <div class="rs-footer__about">
          <div class="rs-footer__brand">Стиль Продукт</div>
          <p>
            Производственно-торговая компания из Кемерова. Больше 15 лет торгуем рыбой, морепродуктами,
            мясом и птицей оптом и в розницу, разделываем и коптим в собственных цехах.
          </p>
        </div>
        <div>
          <div class="rs-footer__title">Магазин</div>
          <NuxtLink v-for="c in rsCategories" :key="c.id" :to="rsPath(`/catalog/${c.id}`)">{{ c.label }}</NuxtLink>
        </div>
        <div>
          <div class="rs-footer__title">Компаниям</div>
          <NuxtLink :to="rsPath('/opt')">Оптовый прайс</NuxtLink>
          <NuxtLink :to="rsPath('/production')">Услуги и СТМ</NuxtLink>
          <NuxtLink :to="rsPath('/production') + '#services'">Копчение, заморозка, вакуум</NuxtLink>
          <NuxtLink :to="rsPath('/contacts') + '#docs'">Декларации ЕАС</NuxtLink>
        </div>
        <div>
          <div class="rs-footer__title">Контакты</div>
          <a :href="rsContacts.phoneHref" class="rs-footer__phone">{{ rsContacts.phone }}</a>
          <a :href="`mailto:${rsContacts.email}`">{{ rsContacts.email }}</a>
          <a :href="rsContacts.vk" target="_blank" rel="noopener">ВКонтакте</a>
          <span>{{ rsContacts.address }}</span>
        </div>
      </div>
      <div class="rs-wrap rs-footer__legal">
        Концепт редизайна сайта rybasibiri.ru. Тексты, цены и фотографии принадлежат
        ООО «Стиль Продукт» и используются только для демонстрации.
      </div>
    </footer>

    <nav class="rs-dock" aria-label="Быстрые действия">
      <div class="rs-mode rs-dock__mode" role="group" aria-label="Кто покупает">
        <button type="button" :class="{ 'is-on': !isOpt }" :aria-pressed="!isOpt" @click="setMode('retail')">Розница</button>
        <button type="button" :class="{ 'is-on': isOpt }" :aria-pressed="isOpt" @click="setMode('opt')">Опт</button>
      </div>
      <a :href="rsContacts.phoneHref" class="rs-dock__call" aria-label="Позвонить">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
        </svg>
      </a>
      <NuxtLink :to="cartTo" class="rs-dock__cart" :class="{ 'is-full': cartCount }">
        <span class="rs-dock__icon">
          <svg v-if="isOpt" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M5 8h14l-1.3 10.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5 8zM9 8V7a3 3 0 0 1 6 0v1" />
          </svg>
          <span v-if="cartCount" class="rs-dock__badge">{{ cartCount }}</span>
        </span>
        <span class="rs-dock__sum">{{ isOpt ? 'Заявка' : cart.count.value ? rsRub(cart.total.value[0]) : 'Корзина' }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style lang="scss">
// Тема концепта. Всё привязано к классам, которые живут только пока открыт этот концепт,
// плюс сброс тёмных глобальных стилей портфолио.
html.rs-html {
  scrollbar-color: #c3d3e8 #ffffff;

  &::-webkit-scrollbar-track {
    background: #fff;
  }
  &::-webkit-scrollbar-thumb {
    background: #c3d3e8;
    border-color: #fff;
  }

  &.rs-locked {
    overflow: hidden;
  }
}

body.rs-body {
  background: #fff;
  color: #0f2340;
  font-family: 'Geologica', system-ui, sans-serif;
}

.rs {
  --rs-blue: #2a64c5;
  --rs-blue-d: #1f51a6;
  --rs-ink: #0f2340;
  --rs-muted: #5b6b80;
  --rs-ice: #eef4fb;
  --rs-ice-2: #dfeaf7;
  --rs-line: #dde6f1;
  --rs-green: #1c7a4a;
  --rs-green-soft: #e3f3ea;
  --rs-salmon: #e2603f;
  --rs-salmon-soft: #fdece6;
  --rs-r: 10px;
  --rs-r-lg: 18px;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: var(--rs-ink);
  font-family: 'Geologica', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

// Сброс через :where — нулевая специфичность, чтобы классы блоков могли задавать отступы.
:where(.rs) {
  a {
    color: inherit;
    text-decoration: none;
  }

  h1,
  h2,
  h3 {
    margin: 0;
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.02em;
    color: var(--rs-ink);
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
    outline: 2px solid var(--rs-blue);
    outline-offset: 2px;
  }
}

.rs {
  .rs-wrap {
    width: min(1240px, 100% - 32px);
    margin-inline: auto;
  }

  .rs-main {
    flex: 1;
    padding-bottom: 80px;
  }

  .rs-muted {
    color: var(--rs-muted);
  }

  .rs-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .rs-link {
    color: var(--rs-blue);
    font-weight: 600;

    &:hover {
      color: var(--rs-blue-d);
    }
  }

  // ---------- кнопки ----------
  .rs-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 48px;
    padding: 0 22px;
    border-radius: var(--rs-r);
    background: var(--rs-blue);
    color: #fff;
    font-weight: 600;
    white-space: nowrap;
    transition: background-color 0.15s;

    &:hover {
      background: var(--rs-blue-d);
    }

    &:disabled {
      background: var(--rs-ice-2);
      color: var(--rs-muted);
      cursor: not-allowed;
    }

    &--soft {
      background: var(--rs-ice);
      color: var(--rs-blue-d);

      &:hover {
        background: var(--rs-ice-2);
      }
    }

    &--line {
      background: #fff;
      color: var(--rs-ink);
      box-shadow: inset 0 0 0 1px var(--rs-line);

      &:hover {
        background: var(--rs-ice);
      }
    }

    &--done {
      background: var(--rs-green-soft);
      color: var(--rs-green);

      &:hover {
        background: #d3ecdd;
      }
    }

    &--wide {
      width: 100%;
    }
  }

  .rs-iconbtn {
    position: relative;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--rs-r);
    color: var(--rs-ink);
    transition: background-color 0.15s, color 0.15s;

    &:hover {
      background: var(--rs-ice);
      color: var(--rs-blue);
    }

    &__badge {
      position: absolute;
      top: 4px;
      right: 2px;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      border-radius: 9px;
      background: var(--rs-blue);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      line-height: 18px;
      text-align: center;
    }
  }

  // ---------- переключатель «Розница / Опт» ----------
  .rs-mode {
    display: inline-grid;
    grid-template-columns: 1fr 1fr;
    padding: 4px;
    border-radius: 12px;
    background: var(--rs-ice);

    button {
      min-height: 36px;
      padding: 0 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      color: var(--rs-muted);
      white-space: nowrap;
      transition: background-color 0.15s, color 0.15s;

      &:hover {
        color: var(--rs-ink);
      }

      &.is-on {
        background: #fff;
        color: var(--rs-blue-d);
        box-shadow: 0 1px 3px rgba(15, 35, 64, 0.12);
      }
    }

    &--wide {
      display: grid;
      width: 100%;

      button {
        min-height: 44px;
      }
    }
  }

  // ---------- сегменты, чипы ----------
  .rs-seg {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 6px;

    button,
    a {
      min-height: 38px;
      padding: 0 14px;
      border-radius: 999px;
      background: var(--rs-ice);
      font-size: 14px;
      font-weight: 500;
      color: var(--rs-ink);
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background-color 0.15s, color 0.15s;

      &:hover {
        background: var(--rs-ice-2);
      }

      &.is-on,
      &.router-link-exact-active {
        background: var(--rs-ink);
        color: #fff;
      }

      small {
        font-size: 12px;
        opacity: 0.7;
      }
    }
  }

  .rs-badge {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    padding: 0 9px;
    border-radius: 6px;
    background: var(--rs-salmon-soft);
    color: #b2401f;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;

    &--new {
      background: var(--rs-ice-2);
      color: var(--rs-blue-d);
    }

    &--out {
      background: #eef0f3;
      color: var(--rs-muted);
    }
  }

  // ---------- заголовки разделов и страниц ----------
  .rs-section {
    margin-top: 72px;
  }

  .rs-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px 24px;
    flex-wrap: wrap;
    margin-bottom: 24px;

    h2 {
      font-size: clamp(24px, 3vw, 34px);
    }

    p {
      margin-top: 8px;
      max-width: 620px;
      color: var(--rs-muted);
    }
  }

  .rs-page-head {
    padding: 28px 0 24px;

    h1 {
      font-size: clamp(28px, 4vw, 44px);
    }

    p {
      margin-top: 10px;
      max-width: 680px;
      color: var(--rs-muted);
      font-size: 16px;
    }
  }

  .rs-crumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 14px;
    font-size: 13px;
    color: var(--rs-muted);

    a:hover {
      color: var(--rs-blue);
    }

    span[aria-hidden] {
      opacity: 0.5;
    }
  }

  // ---------- формы ----------
  .rs-form {
    display: grid;
    gap: 14px;
  }

  .rs-form__row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .rs-field {
    display: grid;
    gap: 6px;
    min-width: 0;

    > span {
      font-size: 13px;
      font-weight: 500;
      color: var(--rs-muted);
    }

    input,
    select,
    textarea {
      width: 100%;
      min-width: 0;
      min-height: 48px;
      padding: 12px 14px;
      border: 1px solid transparent;
      border-radius: var(--rs-r);
      background: var(--rs-ice);
      outline: none;
      transition: border-color 0.15s, background-color 0.15s;

      &:focus {
        border-color: var(--rs-blue);
        background: #fff;
      }
    }

    select {
      appearance: none;
      padding-right: 40px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%230f2340' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
    }

    textarea {
      min-height: 110px;
      resize: vertical;
    }
  }

  // На ледяной панели поле того же цвета пропадает — там поля белые с рамкой.
  .rs-panel .rs-field,
  .rso-sum .rs-field {
    input,
    select,
    textarea {
      background-color: #fff;
      border-color: var(--rs-line);

      &:focus {
        border-color: var(--rs-blue);
      }
    }
  }

  .rs-panel .rs-seg button {
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--rs-line);

    &.is-on {
      background: var(--rs-ink);
      box-shadow: none;
    }
  }

  .rs-note {
    padding: 12px 14px;
    border-radius: var(--rs-r);
    background: var(--rs-green-soft);
    color: var(--rs-green);
    font-size: 14px;
  }

  .rs-panel {
    padding: 28px;
    border-radius: var(--rs-r-lg);
    background: var(--rs-ice);
  }

  // ---------- баннер концепта ----------
  .rs-banner {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 12px;
    padding: 8px 16px;
    background: var(--rs-ink);
    color: #dbe5f2;
    font-size: 13px;
    text-align: center;

    a {
      color: #fff;
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  // ---------- шапка ----------
  .rs-header {
    position: sticky;
    top: 0;
    z-index: 30;
    background: #fff;
    border-bottom: 1px solid var(--rs-line);
  }

  .rs-header__row {
    display: flex;
    align-items: center;
    gap: 20px;
    min-height: 76px;
  }

  .rs-mark {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex-shrink: 0;

    &__sign {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--rs-blue);
      color: #fff;
    }

    &__text {
      display: grid;
      min-width: 0;
    }

    &__name {
      font-size: 19px;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.15;
      white-space: nowrap;
    }

    &__sub {
      font-size: 12px;
      color: var(--rs-muted);
      white-space: nowrap;
    }
  }

  // Меню не сжимается: при нехватке места раньше прячем телефон, а не наезжаем на него.
  .rs-header__nav {
    display: flex;
    gap: 4px;
    flex-shrink: 0;

    a {
      padding: 8px 12px;
      border-radius: 8px;
      font-weight: 500;
      white-space: nowrap;
      transition: background-color 0.15s, color 0.15s;

      &:hover {
        background: var(--rs-ice);
      }

      &.is-active {
        color: var(--rs-blue);
      }
    }
  }

  .rs-header__end {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
  }

  .rs-header__phone {
    display: grid;
    margin-right: 8px;
    text-align: right;
    line-height: 1.2;

    span {
      font-weight: 600;
      white-space: nowrap;
    }

    small {
      font-size: 12px;
      color: var(--rs-muted);
    }

    &:hover span {
      color: var(--rs-blue);
    }
  }

  .rs-header__burger {
    display: none;
  }

  .rs-cartbtn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    min-width: 148px;
    padding: 0 16px;
    border-radius: var(--rs-r);
    background: var(--rs-ice);
    color: var(--rs-blue-d);
    font-weight: 600;
    white-space: nowrap;
    transition: background-color 0.15s;

    &:hover {
      background: var(--rs-ice-2);
    }

    &.is-full {
      background: var(--rs-blue);
      color: #fff;

      &:hover {
        background: var(--rs-blue-d);
      }
    }

    &__label {
      font-variant-numeric: tabular-nums;
    }
  }

  // лента разделов
  .rs-strip {
    background: #fff;
    border-top: 1px solid var(--rs-line);
  }

  .rs-strip__row {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 46px;
  }

  // В опте лента — якоря одной страницы: роутер считает активными все, подсветка не нужна.
  &.rs--opt .rs-strip__links a.router-link-active {
    background: none;
    color: var(--rs-muted);

    &:hover {
      background: var(--rs-ice);
      color: var(--rs-ink);
    }
  }

  .rs-strip__lead {
    flex-shrink: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--rs-blue);
  }

  .rs-strip__links {
    display: flex;
    gap: 4px;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    a {
      flex-shrink: 0;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 14px;
      color: var(--rs-muted);
      white-space: nowrap;
      transition: background-color 0.15s, color 0.15s;

      &:hover {
        background: var(--rs-ice);
        color: var(--rs-ink);
      }

      &.router-link-active {
        color: var(--rs-blue-d);
        background: var(--rs-ice);
      }
    }
  }

  // мобильное меню
  // Под шапкой, чтобы бургер оставался виден и закрывал меню.
  .rs-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 100dvh;
    z-index: 40;
    background: rgba(15, 35, 64, 0.32);
  }

  .rs-menu__panel {
    display: grid;
    align-content: start;
    gap: 18px;
    width: min(420px, 100%);
    height: 100%;
    margin-left: auto;
    padding: 20px 16px 110px;
    overflow-y: auto;
    background: #fff;
  }

  .rs-menu__nav,
  .rs-menu__cats,
  .rs-menu__contacts {
    display: grid;
    gap: 2px;

    a {
      padding: 10px 12px;
      border-radius: 8px;

      &:hover {
        background: var(--rs-ice);
      }
    }
  }

  .rs-menu__nav a {
    font-size: 18px;
    font-weight: 600;
  }

  .rs-menu__title {
    padding: 0 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--rs-blue);
  }

  .rs-menu__contacts {
    padding-top: 14px;
    border-top: 1px solid var(--rs-line);

    a {
      color: var(--rs-muted);
    }
  }

  // ---------- подвал ----------
  .rs-footer {
    margin-top: 40px;
    padding: 48px 0 28px;
    background: var(--rs-ice);
    font-size: 14px;
  }

  .rs-footer__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 32px;

    > div {
      display: grid;
      align-content: start;
      gap: 8px;
      min-width: 0;
    }

    a:hover {
      color: var(--rs-blue);
    }
  }

  .rs-footer__brand {
    font-size: 20px;
    font-weight: 700;
  }

  .rs-footer__about p {
    max-width: 360px;
    color: var(--rs-muted);
  }

  .rs-footer__title {
    margin-bottom: 4px;
    font-weight: 600;
  }

  .rs-footer__phone {
    font-size: 17px;
    font-weight: 600;
  }

  .rs-footer__legal {
    margin-top: 36px;
    padding-top: 20px;
    border-top: 1px solid var(--rs-line);
    color: var(--rs-muted);
    font-size: 13px;
  }

  // ---------- нижняя панель телефона ----------
  .rs-dock {
    display: none;
  }

  @media (max-width: 1279px) {
    .rs-header__phone {
      display: none;
    }
  }

  @media (max-width: 1120px) {
    .rs-header__row {
      gap: 14px;
    }

    .rs-mark__sub {
      display: none;
    }
  }

  // Шапка с меню и переключателем помещается от 1081 px; уже — бургер и нижняя панель.
  @media (max-width: 1080px) {
    .rs-header__nav,
    .rs-header__row > .rs-mode,
    .rs-header__fav {
      display: none;
    }

    .rs-header__burger {
      display: grid;
    }

    .rs-header__row {
      min-height: 64px;
      gap: 12px;
    }

    .rs-footer__grid {
      grid-template-columns: 1fr 1fr;
    }

    .rs-dock {
      position: fixed;
      left: 12px;
      right: 12px;
      bottom: 12px;
      z-index: 35;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 48px auto;
      align-items: center;
      gap: 8px;
      padding: 6px;
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 6px 24px rgba(15, 35, 64, 0.18);
    }

    .rs-dock__mode {
      display: grid;

      button {
        min-height: 40px;
        padding: 0 8px;
      }
    }

    .rs-dock__call {
      display: grid;
      place-items: center;
      height: 48px;
      border-radius: 12px;
      background: var(--rs-ice);
      color: var(--rs-blue-d);
    }

    .rs-dock__cart {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 48px;
      min-width: 112px;
      padding: 0 14px;
      border-radius: 12px;
      background: var(--rs-ice);
      color: var(--rs-blue-d);
      font-weight: 600;
      white-space: nowrap;

      &.is-full {
        background: var(--rs-blue);
        color: #fff;
      }
    }

    .rs-dock__icon {
      position: relative;
      display: grid;
    }

    .rs-dock__icon {
      margin-right: 6px;
    }

    .rs-dock__badge {
      position: absolute;
      top: -7px;
      right: -10px;
      min-width: 17px;
      height: 17px;
      padding: 0 4px;
      border-radius: 9px;
      background: #fff;
      color: var(--rs-blue-d);
      font-size: 11px;
      font-weight: 700;
      line-height: 17px;
      text-align: center;
    }

    .rs-dock__sum {
      font-variant-numeric: tabular-nums;
    }

    .rs-main {
      padding-bottom: 96px;
    }

    .rs-footer {
      padding-bottom: 104px;
    }
  }

  @media (max-width: 640px) {
    .rs-cartbtn {
      min-width: 0;
      padding: 0 12px;

      .rs-cartbtn__label {
        display: none;
      }
    }

    .rs-mark__sub {
      display: none;
    }

    .rs-mark__name {
      font-size: 17px;
    }

    .rs-mark__sign {
      width: 40px;
      height: 40px;
    }

    .rs-strip__lead {
      display: none;
    }

    .rs-section {
      margin-top: 52px;
    }

    .rs-panel {
      padding: 20px;
    }

    .rs-form__row {
      grid-template-columns: minmax(0, 1fr);
    }

    .rs-footer__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
  }

  @media (max-width: 360px) {
    .rs-mark__name {
      font-size: 15px;
    }

    .rs-dock__cart {
      min-width: 0;
    }
  }
}
</style>
