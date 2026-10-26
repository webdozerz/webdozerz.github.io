<script lang="ts" setup>
import PkIcon from '~/components/redesign/produkt24/PkIcon.vue'
import PkSearch from '~/components/redesign/produkt24/PkSearch.vue'

const route = useRoute()
const list = useProdukt24List()
const ui = useProdukt24Ui()
const q = ref('')

useSeoMeta({
  title: '24produkt — продукты оптом и в розницу в Красноярске | Концепт редизайна',
  description:
    'Концепт редизайна сайта 24produkt (ИП Аксютец): прайс на 645 позиций с поиском, три колонки цен переключателем, список и готовая заявка менеджеру.',
  ogTitle: '24produkt — концепт редизайна',
  ogDescription: 'Мясо, птица, рыба, бакалея и консервы оптом и в розницу со склада в Красноярске: поиск по прайсу, три цены, заявка из списка.',
  ogImage: 'https://andryushov.me/redesign/produkt24/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'pk-html', lang: 'ru' },
  bodyAttrs: { class: 'pk-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap' },
  ],
})

onMounted(() => list.persist())

const isCatalog = computed(() => route.path.startsWith(pkPath('/catalog')))
const isHome = computed(() => route.path === pkPath() || route.path === pkPath().slice(0, -1))
const isList = computed(() => route.path.startsWith(pkPath('/list')))
const activeSection = computed(() => (isCatalog.value ? (route.params.section as string) || '' : null))
const year = new Date().getFullYear()
</script>

<template>
  <div class="pk">
    <div class="pk-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="pkContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="pk-header">
      <div class="pk-top">
        <div class="pk-wrap pk-top__row">
          <p class="pk-top__where">
            <PkIcon name="pin" :size="17" />
            <span class="pk-top__long">Склад в Красноярске, Северное шоссе, 5г</span>
            <span class="pk-top__short">Красноярск</span>
          </p>
          <p class="pk-top__hours">
            <PkIcon name="clock" :size="17" />
            Пн–пт 8:30–16:30, сб 9:00–12:00
          </p>
          <div class="pk-top__links">
            <a v-for="ph in pkContacts.phones" :key="ph.href" :href="ph.href" class="pk-top__phone">{{ ph.label }}</a>
            <a :href="pkContacts.max" target="_blank" rel="noopener" class="pk-top__max"><PkIcon name="max" :size="16" />Мы в MAX</a>
          </div>
        </div>
      </div>

      <div class="pk-wrap pk-header__row">
        <NuxtLink :to="pkPath()" class="pk-mark" aria-label="24produkt, на главную">
          <img src="/redesign/produkt24/logo.jpg" alt="" width="400" height="280" />
          <span class="pk-mark__text">
            <span class="pk-mark__name">24<b>produkt</b></span>
            <span class="pk-mark__sub">продукты оптом и в розницу</span>
          </span>
        </NuxtLink>

        <nav class="pk-sections" aria-label="Разделы прайса">
          <NuxtLink
            v-for="s in pkSections"
            :key="s.id"
            :to="pkSectionPath(s.id)"
            class="pk-sections__item"
            :class="{ 'is-active': activeSection === s.id }"
          >
            <i class="pk-sil" :style="{ '--pk-sil': `url(${pkIcons[s.id]})` }" />
            <span>{{ s.title }}</span>
          </NuxtLink>
        </nav>

        <div class="pk-header__right">
          <NuxtLink :to="pkPath('/contacts')" class="pk-header__link">Контакты</NuxtLink>
          <a :href="pkContacts.phones[0].href" class="pk-iconbtn pk-header__call" aria-label="Позвонить"><PkIcon name="phone" /></a>
          <NuxtLink :to="pkPath('/list')" class="pk-listbtn" :class="{ 'is-full': list.count.value, 'is-active': isList }">
            <PkIcon name="list" />
            <span class="pk-listbtn__label">{{ list.count.value ? pkMoney0(list.total.value) : 'Список' }}</span>
            <span v-if="list.count.value" class="pk-dot">{{ list.count.value }}</span>
          </NuxtLink>
        </div>
      </div>

      <nav class="pk-strip" aria-label="Разделы прайса">
        <div class="pk-wrap pk-strip__row">
          <NuxtLink
            v-for="s in pkSections"
            :key="s.id"
            :to="pkSectionPath(s.id)"
            class="pk-strip__item"
            :class="{ 'is-active': activeSection === s.id }"
          >
            <i class="pk-sil" :style="{ '--pk-sil': `url(${pkIcons[s.id]})` }" />
            {{ s.title }}
          </NuxtLink>
        </div>
      </nav>
    </header>

    <div v-if="!isCatalog && !isHome" class="pk-msearch">
      <div class="pk-wrap"><PkSearch v-model="q" placeholder="Поиск по прайсу" /></div>
    </div>

    <main class="pk-main">
      <NuxtPage />
    </main>

    <footer class="pk-footer">
      <div class="pk-wrap pk-footer__grid">
        <div class="pk-footer__brand">
          <NuxtLink :to="pkPath()" class="pk-mark pk-mark--footer">
            <img src="/redesign/produkt24/logo.jpg" alt="" width="400" height="280" />
            <span class="pk-mark__text">
              <span class="pk-mark__name">24<b>produkt</b></span>
              <span class="pk-mark__sub">ИП Аксютец Э. А.</span>
            </span>
          </NuxtLink>
          <p>Продукты питания оптом и в розницу со своего склада в Красноярске. Доставка по городу от 200 кг.</p>
        </div>
        <div>
          <h3>Прайс</h3>
          <ul>
            <li v-for="s in pkSections" :key="s.id"><NuxtLink :to="pkSectionPath(s.id)">{{ s.title }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3>Контакты</h3>
          <ul>
            <li v-for="ph in pkContacts.phones" :key="ph.href"><a :href="ph.href">{{ ph.label }}</a></li>
            <li><a :href="`mailto:${pkContacts.email}`">{{ pkContacts.email }}</a></li>
            <li>{{ pkContacts.address }}</li>
          </ul>
        </div>
        <div>
          <h3>Режим работы</h3>
          <ul>
            <li v-for="h in pkContacts.hours" :key="h.days">{{ h.days }}: {{ h.time }}</li>
            <li><NuxtLink :to="pkPath('/contacts')">Доставка, оплата, реквизиты</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="pk-wrap pk-footer__legal">
        <p>
          © {{ year }} Концепт редизайна сайта 24-produkt.ru. Тексты, цены, логотип и иконки разделов принадлежат
          ИП Аксютец Э. А. и взяты с оригинального сайта для демонстрации.
        </p>
        <a :href="pkContacts.original" target="_blank" rel="noopener">Открыть оригинал</a>
      </div>
    </footer>

    <nav class="pk-tabbar" aria-label="Быстрые действия">
      <NuxtLink :to="pkSectionPath()" :class="{ 'is-active': isCatalog }"><PkIcon name="grid" />Прайс</NuxtLink>
      <a :href="pkContacts.phones[0].href"><PkIcon name="phone" />Позвонить</a>
      <NuxtLink :to="pkPath('/contacts')" :class="{ 'is-active': route.path.startsWith(pkPath('/contacts')) }"><PkIcon name="pin" />Контакты</NuxtLink>
      <NuxtLink :to="pkPath('/list')" class="pk-tabbar__list" :class="{ 'is-active': isList, 'is-full': list.count.value }">
        <span class="pk-tabbar__ico"><PkIcon name="list" /><span v-if="list.count.value" class="pk-dot">{{ list.count.value }}</span></span>
        {{ list.count.value ? pkMoney0(list.total.value) : 'Список' }}
      </NuxtLink>
    </nav>

    <Transition name="pk-fade">
      <div v-if="ui.toast.value" class="pk-toast" role="status">{{ ui.toast.value }}</div>
    </Transition>
  </div>
</template>

<style lang="scss">
html.pk-html {
  scroll-padding-top: 120px;
}

body.pk-body {
  background: #fff;
  color: #173a56;
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
}

.pk {
  --pk-green: #14833e;
  --pk-green-d: #0f6c32;
  --pk-soft: #e6f2ea;
  --pk-ink: #173a56;
  --pk-text: #2b3e4f;
  --pk-muted: #66737f;
  --pk-surface: #f1f5f8;
  --pk-gold: #d9821f;
  --pk-gold-soft: #fbefdc;
  --pk-line: #dfe6ec;
  --pk-field: #c9d3dc;
  --pk-hover: #f8fafc;
  --pk-in: #f4faf6;
  --pk-map: #e3e9ee;
  --pk-focus: rgba(20, 131, 62, 0.14);
  --pk-r: 10px;
  --pk-r-lg: 16px;

  min-height: 100vh;
  background: #fff;
  color: var(--pk-text);
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
  -webkit-font-smoothing: antialiased;

  @media (max-width: 768px) {
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
  }
}

:where(.pk) {
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
  pre {
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
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  h1,
  h2,
  h3 {
    color: var(--pk-ink);
    font-weight: 700;
    letter-spacing: -0.015em;
    line-height: 1.2;
  }
}

.pk-wrap {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;

  @media (max-width: 989px) {
    padding-left: 20px;
    padding-right: 20px;
  }

  @media (max-width: 375px) {
    padding-left: 14px;
    padding-right: 14px;
  }
}

// Силуэты разделов с иконок их сайта — маской, цвет от currentColor.
.pk-sil {
  display: inline-block;
  flex: none;
  width: 34px;
  height: 24px;
  background: currentColor;
  -webkit-mask: var(--pk-sil) center / contain no-repeat;
  mask: var(--pk-sil) center / contain no-repeat;
}

.pk-banner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
  padding: 8px 16px;
  background: var(--pk-ink);
  color: #eef3f7;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;

  a {
    color: #fff;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

// --- Кнопки ---
.pk-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border-radius: var(--pk-r);
  background: var(--pk-green);
  color: #fff;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover {
    background: var(--pk-green-d);
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }

  &--line,
  &--line:focus,
  &--line:active {
    border: 1px solid var(--pk-line);
    background: #fff;
    color: var(--pk-ink);
  }

  &--line:hover {
    border-color: var(--pk-green);
    background: #fff;
    color: var(--pk-green);
  }

  &--add {
    min-height: 40px;
    padding: 0 14px;
    background: var(--pk-soft);
    color: var(--pk-green-d);

    &:hover {
      background: var(--pk-green);
      color: #fff;
    }
  }
}

.pk-iconbtn {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--pk-r);
  color: var(--pk-ink);

  &:hover {
    background: var(--pk-surface);
  }
}

.pk-dot {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 10px;
  background: var(--pk-gold);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

// --- Шапка ---
.pk-top {
  border-bottom: 1px solid var(--pk-line);
  background: var(--pk-surface);
  font-size: 14px;

  &__row {
    display: flex;
    align-items: center;
    gap: 24px;
    min-height: 42px;
  }

  p {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--pk-muted);
    white-space: nowrap;

    .pk-icon {
      color: var(--pk-green);
    }
  }

  &__short {
    display: none;
  }

  &__links {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: auto;
    white-space: nowrap;

    a:hover {
      color: var(--pk-green);
    }
  }

  &__phone {
    color: var(--pk-ink);
    font-weight: 600;
  }

  &__max {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--pk-ink);
  }

  @media (max-width: 1199px) {
    &__hours {
      display: none !important;
    }
  }

  @media (max-width: 768px) {
    &__long,
    &__max,
    &__phone + &__phone {
      display: none !important;
    }

    &__short {
      display: inline;
    }
  }
}

.pk-header__row {
  display: flex;
  align-items: center;
  gap: 28px;
  min-height: 84px;

  @media (max-width: 768px) {
    gap: 12px;
    min-height: 68px;
  }
}

.pk-mark {
  display: flex;
  flex: none;
  align-items: center;
  gap: 10px;

  img {
    width: 74px;
    height: auto;
    margin: -4px 0;
  }

  &__text {
    display: grid;
    line-height: 1.1;
  }

  &__name {
    color: var(--pk-ink);
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.02em;

    b {
      color: var(--pk-green);
    }
  }

  &__sub {
    margin-top: 3px;
    color: var(--pk-muted);
    font-size: 13px;
  }

  @media (max-width: 375px) {
    img {
      width: 58px;
    }

    &__name {
      font-size: 21px;
    }

    &__sub {
      font-size: 12px;
    }
  }
}

.pk-sections {
  display: flex;
  gap: 4px;
  margin: 0 auto;

  &__item {
    display: grid;
    justify-items: center;
    gap: 2px;
    min-width: 86px;
    padding: 8px 10px 6px;
    border-radius: var(--pk-r);
    color: var(--pk-ink);
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    transition: background 0.15s, color 0.15s;

    .pk-sil {
      width: 42px;
      height: 28px;
      color: var(--pk-green);
    }

    &:hover {
      background: var(--pk-surface);
    }

    &.is-active {
      background: var(--pk-soft);
      color: var(--pk-green-d);
    }
  }

  @media (max-width: 1199px) {
    display: none;
  }
}

.pk-header__right {
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;

  @media (max-width: 1199px) {
    margin-left: auto;
  }
}

.pk-header__link {
  padding: 10px 12px;
  border-radius: var(--pk-r);
  color: var(--pk-ink);
  font-weight: 500;

  &:hover {
    color: var(--pk-green);
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.pk-header__call {
  display: none;

  @media (max-width: 768px) {
    display: inline-grid;
    border: 1px solid var(--pk-line);
  }
}

.pk-listbtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 152px;
  height: 46px;
  padding: 0 14px;
  border-radius: var(--pk-r);
  background: var(--pk-green);
  color: #fff;
  font-weight: 600;
  white-space: nowrap;

  &:hover {
    background: var(--pk-green-d);
  }

  &__label {
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.pk-strip {
  display: none;
  border-top: 1px solid var(--pk-line);
  border-bottom: 1px solid var(--pk-line);

  &__row {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-top: 8px;
    padding-bottom: 8px;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__item {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 8px;
    padding: 6px 14px 6px 10px;
    border-radius: var(--pk-r);
    background: var(--pk-surface);
    color: var(--pk-ink);
    font-weight: 500;
    white-space: nowrap;

    .pk-sil {
      width: 30px;
      height: 22px;
      color: var(--pk-green);
    }

    &.is-active {
      background: var(--pk-soft);
      color: var(--pk-green-d);
    }
  }

  @media (max-width: 1199px) {
    display: block;
  }
}

.pk-msearch {
  display: none;

  @media (max-width: 768px) {
    position: sticky;
    top: 0;
    z-index: 30;
    display: block;
    padding: 10px 0;
    border-bottom: 1px solid var(--pk-line);
    background: #fff;
  }
}

// --- Поиск ---
.pk-search {
  position: relative;

  &__form {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 52px;
    padding: 0 6px 0 16px;
    border: 1px solid var(--pk-field);
    border-radius: var(--pk-r);
    background: #fff;

    &:focus-within {
      border-color: var(--pk-green);
      box-shadow: 0 0 0 3px var(--pk-focus);
    }

    > .pk-icon {
      flex: none;
      color: var(--pk-muted);
    }

    input {
      flex: 1;
      width: 0;
      min-width: 0;
      height: 100%;
      border: 0;
      outline: 0;
      background: none;
      font-size: 16px;

      &::-webkit-search-cancel-button {
        display: none;
      }
    }

    .pk-btn {
      min-height: 40px;
    }
  }

  &--big &__form {
    height: 66px;
    padding: 0 8px 0 22px;
    border: 2px solid var(--pk-green);
    box-shadow: 0 10px 30px rgba(23, 58, 86, 0.1);

    input {
      font-size: 18px;
    }

    .pk-btn {
      min-height: 50px;
      padding: 0 26px;
    }
  }

  &__drop {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: 40;
    overflow: hidden;
    border: 1px solid var(--pk-line);
    border-radius: var(--pk-r-lg);
    background: #fff;
    box-shadow: 0 18px 50px rgba(23, 58, 86, 0.18);
    text-align: left;
    max-height: min(70vh, 540px);
    overflow-y: auto;
  }

  &__item {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 14px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--pk-line);

    > div:first-child {
      display: grid;
      min-width: 0;

      span {
        overflow: hidden;
        color: var(--pk-ink);
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      small {
        color: var(--pk-muted);
        font-size: 12px;
      }
    }

    > b {
      color: var(--pk-ink);
      white-space: nowrap;

      small {
        color: var(--pk-muted);
        font-weight: 400;
      }
    }

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 6px 12px;

      > div:first-child {
        grid-column: 1 / -1;

        span {
          white-space: normal;
        }
      }
    }
  }

  &__empty {
    padding: 16px;
    color: var(--pk-muted);
  }

  &__all {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px;
    color: var(--pk-green);
    font-weight: 600;

    &:hover {
      background: var(--pk-surface);
    }
  }

  @media (max-width: 576px) {
    &--big &__form {
      height: 58px;
      padding: 0 6px 0 14px;

      input {
        font-size: 16px;
      }

      .pk-btn {
        min-height: 44px;
        padding: 0 16px;
      }
    }
  }

  @media (max-width: 375px) {
    &__form .pk-btn {
      display: none;
    }
  }
}

// --- Количество и «В список» ---
.pk-buy {
  display: flex;
  justify-content: flex-end;

  .pk-btn--add {
    width: 140px;
  }

  &--wide,
  &--wide .pk-btn--add,
  &--wide .pk-qty {
    width: 100%;
  }
}

.pk-qty {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) 36px;
  align-items: center;
  width: 140px;
  height: 40px;
  border-radius: var(--pk-r);
  background: var(--pk-green);
  color: #fff;

  > button {
    display: grid;
    place-items: center;
    height: 100%;
    border-radius: var(--pk-r);

    &:hover {
      background: var(--pk-green-d);
    }
  }

  label {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 2px;
    min-width: 0;
    font-weight: 600;
  }

  input {
    width: 4ch;
    min-width: 0;
    padding: 0;
    border: 0;
    outline: 0;
    background: none;
    color: #fff;
    font-weight: 700;
    text-align: right;
  }

  span {
    font-size: 13px;
    opacity: 0.85;
  }
}

// --- Переключатель тарифа ---
.pk-tiers {
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: 4px;
  padding: 4px;
  border-radius: calc(var(--pk-r) + 4px);
  background: var(--pk-surface);

  button {
    display: grid;
    gap: 1px;
    padding: 8px 16px;
    border-radius: var(--pk-r);
    color: var(--pk-ink);
    text-align: left;
    transition: background 0.15s;

    b {
      font-weight: 600;
      white-space: nowrap;
    }

    small {
      color: var(--pk-muted);
      font-size: 12px;
      line-height: 1.3;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.7);
    }

    &.is-on {
      background: #fff;
      box-shadow: 0 1px 4px rgba(23, 58, 86, 0.14);

      b {
        color: var(--pk-green-d);
      }
    }
  }

  &--compact button {
    padding: 7px 12px;
    text-align: center;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    &:not(&--compact) {
      grid-auto-flow: row;
      width: 100%;
    }
  }
}

// --- K9: строка прайса ---
.pk-head,
.pk-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 52px repeat(3, 120px) 148px;
  align-items: center;
  column-gap: 12px;

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr) 44px repeat(3, 108px) 144px;
  }
}

.pk-head {
  padding: 0 14px;
  color: var(--pk-muted);
  font-size: 13px;

  > span:nth-child(2) {
    text-align: center;
  }

  button {
    height: 100%;
    padding: 14px 10px;
    text-align: center;
    line-height: 1.25;

    &.is-on {
      background: var(--pk-soft);
      color: var(--pk-green-d);
      font-weight: 600;
    }
  }

  @media (max-width: 989px) {
    display: none;
  }
}

.pk-row {
  min-height: 60px;
  padding: 0 14px;
  border-bottom: 1px solid var(--pk-line);
  transition: background 0.15s;

  &:hover {
    background: var(--pk-hover);
  }

  &.is-in {
    background: var(--pk-in);
  }

  &__name {
    display: grid;
    min-width: 0;
    padding: 8px 0;

    span {
      color: var(--pk-ink);
      line-height: 1.35;
    }

    small {
      color: var(--pk-muted);
      font-size: 12px;
    }
  }

  &__unit {
    color: var(--pk-muted);
    font-size: 14px;
    text-align: center;
  }

  &__price {
    align-self: stretch;
    padding: 0 10px;
    color: var(--pk-muted);
    font-size: 14px;
    text-align: center;
    white-space: nowrap;

    &.is-on {
      background: var(--pk-soft);
      color: var(--pk-ink);
      font-size: 16px;
      font-weight: 700;
    }
  }

  &__mobile {
    display: none;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px 14px;
    padding: 12px 4px;

    &__name {
      grid-column: 1 / -1;
      padding: 0;
    }

    &__unit,
    &__price {
      display: none;
    }

    &__mobile {
      display: grid;
      min-width: 0;

      b {
        color: var(--pk-ink);
        font-size: 18px;

        small {
          color: var(--pk-muted);
          font-size: 13px;
          font-weight: 400;
        }
      }

      span {
        color: var(--pk-muted);
        font-size: 12px;
        line-height: 1.35;

        span {
          white-space: nowrap;
        }
      }
    }
  }
}

// --- Заявка ---
.pk-letter {
  overflow: hidden;
  border: 1px solid var(--pk-line);
  border-radius: var(--pk-r-lg);
  background: #fff;

  &__head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    border-bottom: 1px solid var(--pk-line);
    background: var(--pk-surface);

    > span:nth-child(2) {
      display: grid;
      line-height: 1.25;

      b {
        color: var(--pk-ink);
      }

      small {
        color: var(--pk-muted);
        font-size: 13px;
      }
    }

    em {
      margin-left: auto;
      padding: 3px 10px;
      border-radius: 8px;
      background: var(--pk-gold-soft);
      color: #8a4e0c;
      font-size: 13px;
      font-style: normal;
      font-weight: 600;
    }
  }

  &__ico {
    display: grid;
    place-items: center;
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: var(--pk-r);
    background: var(--pk-green);
    color: #fff;
  }

  &__text {
    max-height: 420px;
    overflow: auto;
    padding: 18px 18px 22px;
    scrollbar-width: thin;
    color: var(--pk-ink);
    font-family: inherit;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  @media (max-width: 768px) {
    &__text {
      max-height: none;
    }
  }

  &__empty {
    padding: 28px 18px;
    color: var(--pk-muted);
  }

  &__actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    padding: 0 18px 18px;

    .pk-btn {
      padding: 0 10px;
    }

    .pk-btn:first-child {
      grid-column: 1 / -1;
    }

    @media (max-width: 375px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

// --- Общие секции ---
.pk-section {
  padding-top: 64px;

  @media (max-width: 768px) {
    padding-top: 44px;
  }
}

.pk-title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px 24px;
  margin-bottom: 24px;

  h2 {
    font-size: 30px;
  }

  p {
    max-width: 620px;
    color: var(--pk-muted);
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--pk-green);
    font-weight: 600;
  }

  @media (max-width: 768px) {
    margin-bottom: 18px;

    h2 {
      font-size: 24px;
    }
  }
}

.pk-field {
  display: grid;
  gap: 6px;
  color: var(--pk-ink);
  font-size: 14px;
  font-weight: 500;

  input,
  textarea {
    width: 100%;
    padding: 11px 14px;
    border: 1px solid var(--pk-field);
    border-radius: var(--pk-r);
    outline: 0;
    background: #fff;
    font-size: 15px;
    font-weight: 400;

    &:focus {
      border-color: var(--pk-green);
    }
  }

  textarea {
    min-height: 92px;
    resize: vertical;
  }
}

.pk-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: var(--pk-muted);
  font-size: 13px;

  input {
    flex: none;
    width: 18px;
    height: 18px;
    margin: 1px 0 0;
    accent-color: var(--pk-green);
  }
}

// --- Подвал ---
.pk-footer {
  margin-top: 88px;
  padding: 48px 0 28px;
  border-top: 1px solid var(--pk-line);
  background: var(--pk-surface);

  &__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 32px;

    h3 {
      margin-bottom: 12px;
      font-size: 15px;
    }

    li + li {
      margin-top: 6px;
    }

    a:hover {
      color: var(--pk-green);
    }

    @media (max-width: 989px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
  }

  &__brand p {
    max-width: 340px;
    margin-top: 14px;
    color: var(--pk-muted);
  }

  .pk-mark img {
    border-radius: 8px;
    mix-blend-mode: multiply;
  }

  &__legal {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px 24px;
    margin-top: 36px;
    padding-top: 20px;
    border-top: 1px solid var(--pk-line);
    color: var(--pk-muted);
    font-size: 13px;

    p {
      max-width: 760px;
    }

    a {
      color: var(--pk-ink);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  @media (max-width: 768px) {
    margin-top: 64px;
  }
}

// --- Нижняя панель (M4) ---
.pk-tabbar {
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
    border-top: 1px solid var(--pk-line);
    background: #fff;

    > a {
      display: grid;
      justify-items: center;
      gap: 2px;
      padding: 4px 2px;
      border-radius: var(--pk-r);
      color: var(--pk-muted);
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;

      &.is-active {
        color: var(--pk-green-d);
      }
    }
  }

  &__ico {
    position: relative;
    display: inline-grid;

    .pk-dot {
      position: absolute;
      top: -6px;
      left: 14px;
    }
  }

  &__list.is-full {
    background: var(--pk-soft);
    color: var(--pk-green-d) !important;
    font-weight: 700 !important;
  }
}

.pk-toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  z-index: 60;
  width: max-content;
  max-width: min(520px, calc(100vw - 32px));
  padding: 12px 18px;
  border-radius: var(--pk-r);
  background: var(--pk-ink);
  color: #fff;
  font-size: 14px;
  box-shadow: 0 10px 30px rgba(23, 58, 86, 0.3);
  transform: translateX(-50%);

  @media (max-width: 768px) {
    bottom: calc(80px + env(safe-area-inset-bottom));
  }
}

.pk-fade-enter-active,
.pk-fade-leave-active {
  transition: opacity 0.2s;
}

.pk-fade-enter-from,
.pk-fade-leave-to {
  opacity: 0;
}

@media print {
  .pk-banner,
  .pk-top,
  .pk-strip,
  .pk-msearch,
  .pk-footer,
  .pk-tabbar,
  .pk-header__right,
  .pk-sections,
  .pk-noprint,
  .pk-buy {
    display: none !important;
  }
}
</style>
