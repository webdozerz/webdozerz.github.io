<script lang="ts" setup>
import MfIcon from '~/components/redesign/mrkfish/MfIcon.vue'
import MfModal from '~/components/redesign/mrkfish/MfModal.vue'

const route = useRoute()
const req = useMrkfishRequest()
const ui = useMrkfishUi()
const catalogOpen = ref(false)

useSeoMeta({
  title: 'Миякинская Рыбная Компания — копчёная, солёная и вяленая рыба оптом | Концепт редизайна',
  description:
    'Концепт редизайна сайта Миякинской Рыбной Компании: каталог 58 позиций по разделам, фасовки в карточке, заявка на оптовый прайс из отмеченных позиций.',
  ogTitle: 'Миякинская Рыбная Компания — концепт редизайна',
  ogDescription: 'Рыба от производителя из Башкортостана с 1993 года: каталог по разделам, фасовки, запрос прайса в один клик.',
  ogImage: 'https://andryushov.me/redesign/mrkfish/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'mf-html', lang: 'ru' },
  bodyAttrs: { class: 'mf-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap' },
  ],
})

onMounted(() => req.persist())
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    catalogOpen.value = false
  },
)
watch(
  () => ui.menu.value,
  (v) => import.meta.client && document.documentElement.classList.toggle('mf-lock', v),
)

const isCatalog = computed(() => route.path.startsWith(mfPath('/catalog')) || route.path.startsWith(mfPath('/product')))
const isRequest = computed(() => route.path.startsWith(mfPath('/request')))
const is = (p: string) => route.path.startsWith(mfPath(p))
const year = new Date().getFullYear()
</script>

<template>
  <div class="mf">
    <div class="mf-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="mfContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="mf-header">
      <div class="mf-wrap mf-header__row">
        <div class="mf-header__left">
          <button type="button" class="mf-iconbtn mf-header__burger" aria-label="Меню" @click="ui.menu.value = true">
            <MfIcon name="menu" />
          </button>
          <nav class="mf-nav" aria-label="Разделы сайта">
            <div class="mf-nav__drop" @mouseleave="catalogOpen = false">
              <button
                type="button"
                class="mf-nav__item"
                :class="{ 'is-active': isCatalog }"
                :aria-expanded="catalogOpen"
                @click="catalogOpen = !catalogOpen"
                @mouseenter="catalogOpen = true"
              >
                Каталог <MfIcon name="down" :size="16" />
              </button>
              <div v-show="catalogOpen" class="mf-nav__menu">
                <NuxtLink v-for="s in mfSections" :key="s.id" :to="mfSectionPath(s.id)" class="mf-nav__sec">
                  <img :src="mfImg(s.cover)" alt="" width="64" height="48" />
                  <span>
                    <b>{{ s.title }}</b>
                    <small>{{ mfPositions(mfInSection(s.id).length) }}</small>
                  </span>
                </NuxtLink>
                <NuxtLink :to="mfSectionPath()" class="mf-nav__all">Весь каталог <MfIcon name="arrow" :size="18" /></NuxtLink>
              </div>
            </div>
            <NuxtLink :to="mfPath('/about')" class="mf-nav__item" :class="{ 'is-active': is('/about') }">О производстве</NuxtLink>
            <NuxtLink :to="mfPath('/contacts')" class="mf-nav__item" :class="{ 'is-active': is('/contacts') }">Контакты</NuxtLink>
          </nav>
        </div>

        <NuxtLink :to="mfPath()" class="mf-mark" aria-label="Миякинская Рыбная Компания, на главную">
          <img src="/redesign/mrkfish/emblem.png" alt="" width="240" height="184" />
          <span class="mf-mark__text">
            <span>Миякинская</span>
            <span>Рыбная Компания</span>
          </span>
        </NuxtLink>

        <div class="mf-header__right">
          <div class="mf-header__phone">
            <a :href="mfContacts.phone.href">{{ mfContacts.phone.label }}</a>
            <button type="button" @click="ui.modal.value = 'call'">Заказать звонок</button>
          </div>
          <a :href="mfContacts.phone.href" class="mf-iconbtn mf-header__call" aria-label="Позвонить"><MfIcon name="phone" /></a>
          <a :href="mfContacts.whatsapp" target="_blank" rel="noopener" class="mf-iconbtn mf-header__wa" aria-label="WhatsApp">
            <MfIcon name="whatsapp" />
          </a>
          <NuxtLink :to="mfPath('/request')" class="mf-reqbtn" :class="{ 'is-full': req.count.value, 'is-active': isRequest }">
            <MfIcon name="list" />
            <span class="mf-reqbtn__label">Заявка</span>
            <span class="mf-reqbtn__n">{{ req.count.value }}</span>
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="mf-main">
      <NuxtPage />
    </main>

    <footer class="mf-footer">
      <div class="mf-wrap mf-footer__grid">
        <div class="mf-footer__brand">
          <NuxtLink :to="mfPath()" class="mf-mark mf-mark--footer">
            <img src="/redesign/mrkfish/emblem.png" alt="" width="240" height="184" />
            <span class="mf-mark__text">
              <span>Миякинская</span>
              <span>Рыбная Компания</span>
            </span>
          </NuxtLink>
          <p>Производим копчёную, солёную и вяленую рыбу в Миякинском районе Башкортостана с 1993 года. Продаём оптом, возим своим транспортом.</p>
          <div class="mf-footer__social">
            <a :href="mfContacts.whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp"><MfIcon name="whatsapp" /></a>
            <a :href="mfContacts.vk" target="_blank" rel="noopener" aria-label="ВКонтакте"><MfIcon name="vk" /></a>
            <a :href="mfContacts.youtube" target="_blank" rel="noopener" aria-label="YouTube"><MfIcon name="play" /></a>
          </div>
        </div>
        <div>
          <h3>Каталог</h3>
          <ul>
            <li v-for="s in mfSections" :key="s.id"><NuxtLink :to="mfSectionPath(s.id)">{{ s.title }}</NuxtLink></li>
          </ul>
        </div>
        <div v-for="site in mfSites" :key="site.id">
          <h3>{{ site.title }}</h3>
          <ul>
            <li>{{ site.makes }}</li>
            <li><a :href="site.phone.href">{{ site.phone.label }}</a></li>
            <li><a :href="`mailto:${site.email}`">{{ site.email }}</a></li>
            <li class="mf-footer__muted">{{ site.company }}</li>
          </ul>
        </div>
      </div>
      <div class="mf-wrap mf-footer__legal">
        <p>
          © 1993–{{ year }} Концепт редизайна сайта mrkfish.ru. Тексты, фотографии, логотип и знаки принадлежат группе компаний
          ООО «Миякинская Рыбная Компания» и взяты с оригинального сайта для демонстрации.
        </p>
        <a :href="mfContacts.original" target="_blank" rel="noopener">Открыть оригинал</a>
      </div>
    </footer>

    <nav class="mf-tabbar" aria-label="Быстрые действия">
      <NuxtLink :to="mfSectionPath()" :class="{ 'is-active': isCatalog }"><MfIcon name="grid" />Каталог</NuxtLink>
      <a :href="mfContacts.phone.href"><MfIcon name="phone" />Позвонить</a>
      <a :href="mfContacts.whatsapp" target="_blank" rel="noopener"><MfIcon name="whatsapp" />WhatsApp</a>
      <NuxtLink :to="mfPath('/request')" class="mf-tabbar__req" :class="{ 'is-active': isRequest, 'is-full': req.count.value }">
        <span class="mf-tabbar__ico"><MfIcon name="list" /><span v-if="req.count.value" class="mf-dot">{{ req.count.value }}</span></span>
        Заявка
      </NuxtLink>
    </nav>

    <Transition name="mf-fade">
      <div v-if="ui.menu.value" class="mf-drawer" @click.self="ui.menu.value = false">
        <div class="mf-drawer__box">
          <div class="mf-drawer__head">
            <b>Меню</b>
            <button type="button" class="mf-iconbtn" aria-label="Закрыть меню" @click="ui.menu.value = false"><MfIcon name="close" /></button>
          </div>
          <NuxtLink v-for="s in mfSections" :key="s.id" :to="mfSectionPath(s.id)" class="mf-nav__sec">
            <img :src="mfImg(s.cover)" alt="" width="64" height="48" />
            <span>
              <b>{{ s.title }}</b>
              <small>{{ mfPositions(mfInSection(s.id).length) }}</small>
            </span>
          </NuxtLink>
          <div class="mf-drawer__links">
            <NuxtLink :to="mfSectionPath()">Весь каталог</NuxtLink>
            <NuxtLink :to="mfPath('/about')">О производстве и доставке</NuxtLink>
            <NuxtLink :to="mfPath('/contacts')">Контакты</NuxtLink>
            <NuxtLink :to="mfPath('/request')">Заявка на прайс</NuxtLink>
          </div>
          <div class="mf-drawer__contacts">
            <a :href="mfContacts.phone.href" class="mf-drawer__phone">{{ mfContacts.phone.label }}</a>
            <a :href="mfContacts.mobile.href">{{ mfContacts.mobile.label }}</a>
            <button type="button" class="mf-btn mf-btn--line" @click="(ui.menu.value = false), (ui.modal.value = 'call')">
              <MfIcon name="phone" :size="20" /> Заказать звонок
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <MfModal />

    <Transition name="mf-fade">
      <div v-if="ui.toast.value" class="mf-toast" role="status">{{ ui.toast.value }}</div>
    </Transition>
  </div>
</template>

<style lang="scss">
html.mf-html {
  scroll-padding-top: 100px;
}

body.mf-body {
  background: #fff;
  color: #2a3446;
  font-family: 'Manrope', system-ui, sans-serif;
}

.mf {
  --mf-red: #c8261b;
  --mf-red-d: #a91f16;
  --mf-red-soft: #fbe9e7;
  --mf-navy: #0b3a78;
  --mf-navy-soft: #e8eef7;
  --mf-ink: #0d2647;
  --mf-text: #2a3446;
  --mf-muted: #646d7c;
  --mf-surface: #f3f3f1;
  --mf-line: #e3e3df;
  --mf-field: #cfd2d8;
  --mf-sun: #f2c500;
  --mf-sun-soft: #fdf3c4;
  --mf-green: #1c7c43;
  --mf-green-soft: #e3f3e8;
  --mf-r: 8px;
  --mf-r-lg: 14px;

  min-height: 100vh;
  background: #fff;
  color: var(--mf-text);
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  font-variant-numeric: tabular-nums;
  -webkit-font-smoothing: antialiased;

  @media (max-width: 768px) {
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
  }
}

:where(.mf) {
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
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  h1,
  h2,
  h3 {
    color: var(--mf-ink);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }
}

.mf-wrap {
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

.mf-banner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
  padding: 8px 16px;
  background: var(--mf-navy-soft);
  color: var(--mf-ink);
  font-size: 13px;
  line-height: 1.4;
  text-align: center;

  a {
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
}

// ---------- Кнопки и поля ----------
.mf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 18px;
  border: 1px solid var(--mf-red);
  border-radius: var(--mf-r);
  background: var(--mf-red);
  color: #fff;
  font-weight: 700;
  white-space: nowrap;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;

  svg {
    flex: none;
  }

  &:hover {
    border-color: var(--mf-red-d);
    background: var(--mf-red-d);
  }

  &:disabled {
    opacity: 0.45;
    pointer-events: none;
  }

  &--line,
  &--line:focus,
  &--line:active {
    border: 1px solid var(--mf-field);
    background: #fff;
    color: var(--mf-ink);
  }

  &--line:hover {
    border-color: var(--mf-navy);
    background: #fff;
    color: var(--mf-navy);
  }

  &--wide {
    width: 100%;
  }
}

.mf-iconbtn {
  display: grid;
  flex: none;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--mf-r);
  color: var(--mf-ink);
  transition: background 0.2s;

  &:hover {
    background: var(--mf-surface);
  }
}

.mf-buy {
  min-width: 0;

  // Основное действие страницы — заявка в шапке; в карточках кнопка спокойная, иначе каталог превращается в ряды красного.
  &__add,
  &__add:focus {
    width: 100%;
    border-color: var(--mf-navy-soft);
    background: var(--mf-navy-soft);
    color: var(--mf-navy);
  }

  &__add:hover {
    border-color: var(--mf-red);
    background: var(--mf-red);
    color: #fff;
  }
}

.mf-qty {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  min-height: 46px;
  border-radius: var(--mf-r);
  background: var(--mf-navy-soft);
  color: var(--mf-navy);

  &__btn {
    display: grid;
    place-items: center;
    height: 46px;
    border-radius: var(--mf-r);
    transition: background 0.2s;

    &:hover {
      background: #d7e2f1;
    }
  }

  &__val {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
    min-width: 0;
    font-weight: 800;

    input {
      width: 4ch;
      min-width: 0;
      padding: 0;
      border: 0;
      background: none;
      color: var(--mf-ink);
      font-size: 17px;
      font-weight: 800;
      text-align: right;
      -moz-appearance: textfield;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }

      &:focus {
        outline: none;
      }
    }

    span {
      font-size: 14px;
    }
  }

  @media (max-width: 375px) {
    grid-template-columns: 36px minmax(0, 1fr) 36px;

    &__val input {
      width: 3ch;
      font-size: 16px;
    }
  }
}

.mf-packs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  &__item {
    padding: 4px 10px;
    border: 1px solid var(--mf-line);
    border-radius: 999px;
    background: #fff;
    color: var(--mf-text);
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
    transition:
      border-color 0.2s,
      background 0.2s;

    &.is-on {
      border-color: var(--mf-navy);
      background: var(--mf-navy-soft);
      color: var(--mf-navy);
    }

    &.is-static {
      background: var(--mf-surface);
      border-color: var(--mf-surface);
    }
  }
}

.mf-form {
  display: grid;
  gap: 14px;

  &__note {
    color: var(--mf-muted);
    font-size: 13px;
  }
}

.mf-field {
  display: grid;
  gap: 6px;
  min-width: 0;

  > span {
    color: var(--mf-ink);
    font-size: 14px;
    font-weight: 700;
  }

  input,
  select,
  textarea {
    width: 100%;
    min-height: 48px;
    padding: 11px 14px;
    border: 1px solid var(--mf-field);
    border-radius: var(--mf-r);
    background: #fff;
    transition: border-color 0.2s;

    &:focus {
      border-color: var(--mf-navy);
      outline: 3px solid rgba(11, 58, 120, 0.12);
    }
  }

  select {
    appearance: none;
    padding-right: 40px;
    background: #fff
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%230b3a78' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")
      no-repeat right 14px center;
  }

  textarea {
    min-height: 96px;
    resize: vertical;
  }
}

.mf-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;

  input {
    flex: none;
    width: 20px;
    height: 20px;
    margin: 1px 0 0;
    accent-color: var(--mf-navy);
  }
}

// ---------- Секции ----------
.mf-section {
  padding-top: 72px;

  @media (max-width: 768px) {
    padding-top: 52px;
  }
}

.mf-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
  margin-bottom: 24px;

  h2 {
    font-size: clamp(26px, 3vw, 36px);
  }

  p {
    max-width: 640px;
    margin-top: 8px !important;
    color: var(--mf-muted);
  }

  &__more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--mf-navy);
    font-weight: 700;
    white-space: nowrap;

    &:hover {
      color: var(--mf-red);
    }
  }
}

.mf-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
}

// Полка: на десктопе сетка, на телефоне листается пальцем.
.mf-shelf {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1199px) {
    grid-auto-flow: column;
    grid-template-columns: none;
    grid-auto-columns: calc((100% - 32px) / 3);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    > * {
      scroll-snap-align: start;
    }
  }

  @media (max-width: 768px) {
    grid-auto-columns: 64%;
    gap: 10px;
  }

  @media (max-width: 375px) {
    grid-auto-columns: 74%;
  }
}

// ---------- Шапка ----------
.mf-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid var(--mf-line);
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(8px);

  &__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 16px;
    min-height: 76px;
  }

  &__left {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  &__burger {
    display: none;
    margin-left: -10px;
  }

  &__right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-width: 0;
  }

  &__phone {
    display: grid;
    justify-items: end;
    margin-right: 8px;
    line-height: 1.25;

    a {
      color: var(--mf-ink);
      font-size: 16px;
      font-weight: 800;
      white-space: nowrap;
    }

    button {
      color: var(--mf-navy);
      font-size: 13px;
      font-weight: 600;
      text-decoration: underline;
      text-decoration-color: rgba(11, 58, 120, 0.3);
      text-underline-offset: 3px;
      white-space: nowrap;

      &:hover {
        color: var(--mf-red);
      }
    }
  }

  &__call {
    display: none;
  }

  &__wa {
    color: #12a150;
  }

  @media (max-width: 1199px) {
    &__phone {
      display: none;
    }

    &__call {
      display: grid;
    }
  }

  @media (max-width: 989px) {
    &__row {
      min-height: 64px;
      gap: 8px;
    }

    &__burger {
      display: grid;
    }

    .mf-nav {
      display: none;
    }
  }

  @media (max-width: 768px) {
    &__wa,
    &__call {
      display: none;
    }
  }
}

.mf-nav {
  display: flex;
  align-items: center;
  gap: 4px;

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 40px;
    padding: 0 12px;
    border-radius: var(--mf-r);
    color: var(--mf-ink);
    font-weight: 700;
    white-space: nowrap;
    transition: background 0.2s;

    &:hover,
    &.is-active {
      background: var(--mf-surface);
    }

    &.is-active {
      color: var(--mf-red);
    }
  }

  &__drop {
    position: relative;
  }

  &__menu {
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 5;
    display: grid;
    gap: 4px;
    width: 340px;
    margin-top: 6px;
    padding: 10px;
    border: 1px solid var(--mf-line);
    border-radius: var(--mf-r-lg);
    background: #fff;
    box-shadow: 0 16px 40px rgba(13, 38, 71, 0.12);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: -8px;
      height: 8px;
    }
  }

  &__sec {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px;
    border-radius: var(--mf-r);
    transition: background 0.2s;

    img {
      flex: none;
      width: 64px;
      height: 48px;
      border-radius: 6px;
      background: var(--mf-surface);
      object-fit: contain;
      mix-blend-mode: multiply;
    }

    span {
      display: grid;
      min-width: 0;
      line-height: 1.3;
    }

    b {
      color: var(--mf-ink);
    }

    small {
      color: var(--mf-muted);
      font-size: 13px;
    }

    &:hover {
      background: var(--mf-surface);
    }
  }

  &__all {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 4px;
    padding: 10px 6px 4px;
    border-top: 1px solid var(--mf-line);
    color: var(--mf-navy);
    font-weight: 700;
  }
}

.mf-mark {
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 58px;
    height: auto;
  }

  &__text {
    display: grid;
    color: var(--mf-navy);
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.01em;
    line-height: 1.12;
    text-transform: uppercase;
    white-space: nowrap;
  }

  @media (max-width: 576px) {
    gap: 8px;

    img {
      width: 46px;
    }

    &__text {
      font-size: 12px;
    }
  }

  @media (max-width: 375px) {
    &__text {
      display: none;
    }
  }
}

.mf-reqbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 14px 0 16px;
  border: 1px solid var(--mf-field);
  border-radius: var(--mf-r);
  color: var(--mf-ink);
  font-weight: 700;
  white-space: nowrap;
  transition:
    background 0.2s,
    border-color 0.2s;

  &__n {
    display: grid;
    place-items: center;
    min-width: 24px;
    height: 24px;
    padding: 0 6px;
    border-radius: 999px;
    background: var(--mf-surface);
    font-size: 13px;
  }

  &.is-full {
    border-color: var(--mf-red);
    background: var(--mf-red);
    color: #fff;

    .mf-reqbtn__n {
      background: #fff;
      color: var(--mf-red);
    }
  }

  &:hover {
    border-color: var(--mf-navy);
  }

  @media (max-width: 576px) {
    padding: 0 10px;

    &__label {
      display: none;
    }
  }
}

.mf-dot {
  position: absolute;
  right: -8px;
  top: -6px;
  display: grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--mf-red);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}

// ---------- Меню на телефоне ----------
.mf-drawer {
  position: fixed;
  inset: 0;
  z-index: 55;
  background: rgba(11, 30, 56, 0.4);

  &__box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: min(380px, 88vw);
    height: 100%;
    overflow-y: auto;
    padding: 12px 16px 24px;
    background: #fff;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    b {
      color: var(--mf-ink);
      font-size: 20px;
    }
  }

  &__links {
    display: grid;
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px solid var(--mf-line);

    a {
      padding: 12px 6px;
      color: var(--mf-ink);
      font-weight: 700;
    }
  }

  &__contacts {
    display: grid;
    gap: 6px;
    margin-top: 12px;
    padding-top: 16px;
    border-top: 1px solid var(--mf-line);

    .mf-btn {
      margin-top: 8px;
    }
  }

  &__phone {
    color: var(--mf-ink);
    font-size: 20px;
    font-weight: 800;
  }
}

// ---------- Подвал ----------
.mf-footer {
  margin-top: 96px;
  padding-top: 56px;
  background: var(--mf-surface);

  &__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 32px;

    h3 {
      margin-bottom: 12px;
      font-size: 16px;
    }

    ul {
      display: grid;
      gap: 8px;
    }

    a:hover {
      color: var(--mf-red);
    }
  }

  &__brand p {
    max-width: 380px;
    margin-top: 16px !important;
    color: var(--mf-muted);
  }

  &__social {
    display: flex;
    gap: 8px;
    margin-top: 16px;

    a {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: var(--mf-r);
      background: #fff;
      color: var(--mf-navy);
    }
  }

  &__muted {
    color: var(--mf-muted);
    font-size: 13px;
  }

  &__legal {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px 32px;
    margin-top: 40px;
    padding-top: 20px;
    padding-bottom: 28px;
    border-top: 1px solid var(--mf-line);
    color: var(--mf-muted);
    font-size: 13px;

    p {
      max-width: 820px;
    }

    a {
      color: var(--mf-navy);
      font-weight: 700;
    }
  }

  @media (max-width: 1199px) {
    &__grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 576px) {
    margin-top: 64px;
    padding-top: 40px;

    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
  }
}

// ---------- Нижняя панель ----------
.mf-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 45;
  display: none;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--mf-line);
  background: #fff;

  > a {
    display: grid;
    justify-items: center;
    gap: 2px;
    padding: 4px 0;
    border-radius: var(--mf-r);
    color: var(--mf-muted);
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;

    &.is-active {
      color: var(--mf-red);
    }
  }

  &__ico {
    position: relative;
    display: block;
    height: 22px;
  }

  &__req.is-full {
    color: var(--mf-ink);
  }

  @media (max-width: 768px) {
    display: grid;
  }
}

.mf-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 70;
  width: max-content;
  max-width: min(460px, calc(100vw - 32px));
  padding: 12px 18px;
  border-radius: var(--mf-r);
  background: var(--mf-ink);
  color: #fff;
  font-size: 14px;
  transform: translateX(-50%);

  @media (max-width: 768px) {
    bottom: calc(80px + env(safe-area-inset-bottom));
  }
}

.mf-fade-enter-active,
.mf-fade-leave-active {
  transition: opacity 0.2s;
}

.mf-fade-enter-from,
.mf-fade-leave-to {
  opacity: 0;
}

// ---------- Блоки нескольких страниц ----------
.mf-crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding-top: 20px;
  color: var(--mf-muted);
  font-size: 14px;

  a:hover {
    color: var(--mf-red);
  }

  svg {
    opacity: 0.6;
  }
}
.mf-fleet {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  overflow: hidden;
  border-radius: var(--mf-r-lg);
  background: var(--mf-surface);

  img {
    width: 100%;
    height: 100%;
    min-height: 320px;
    object-fit: cover;
  }

  &__text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: clamp(24px, 3.4vw, 44px);

    h2 {
      font-size: clamp(24px, 2.6vw, 32px);
    }

    ul {
      display: grid;
      gap: 10px;
    }

    li {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--mf-ink);
      font-weight: 700;

      svg {
        flex: none;
        color: var(--mf-red);
      }
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    img {
      min-height: 0;
      aspect-ratio: 16 / 9;
    }
  }
}
.mf-badges {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  li {
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 8px;
    padding: 14px 8px;
    border-radius: var(--mf-r-lg);
    background: var(--mf-surface);
    text-align: center;
  }

  img {
    width: 72px;
    height: 72px;
    object-fit: contain;
    mix-blend-mode: multiply;
  }

  span {
    color: var(--mf-ink);
    font-size: 13px;
    font-weight: 700;
    line-height: 1.25;
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
