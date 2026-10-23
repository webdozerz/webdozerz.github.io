<script lang="ts" setup>
import FmIcon from '~/components/redesign/fermatomsk/FmIcon.vue'
import FmQty from '~/components/redesign/fermatomsk/FmQty.vue'

const route = useRoute()
const order = useFermatomskOrder()
const ui = useFermatomskUi()

const nav = [
  { to: fmPath('/#products'), label: 'Продукты' },
  { to: fmPath('/about'), label: 'О ферме' },
  { to: fmPath('/delivery'), label: 'Доставка и контакты' },
]

const sheet = computed(() => (ui.product.value ? fmFindProduct(ui.product.value) : undefined))
const photo = computed(() => (ui.photo.value ? ui.photo.value.list[ui.photo.value.index] : undefined))
const stepPhoto = (dir: number) => {
  if (!ui.photo.value) return
  const n = ui.photo.value.list.length
  ui.photo.value = { ...ui.photo.value, index: (ui.photo.value.index + dir + n) % n }
}

useSeoMeta({
  title: 'FermaTomsk — фермерские молочные продукты в Томске | Концепт редизайна',
  description: 'Концепт редизайна сайта семейной фермы FermaTomsk: продукты с ценами, заказ одним сообщением в Telegram или MAX, доставка по Томску со вторника по пятницу.',
  ogTitle: 'FermaTomsk — концепт редизайна',
  ogDescription: 'Козье и коровье молоко, творог, сыры, сметана и масло с семейной фермы в посёлке Рассвет: список заказа и готовое сообщение ферме.',
  ogImage: 'https://andryushov.me/redesign/fermatomsk/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'fm-html', lang: 'ru' },
  bodyAttrs: { class: 'fm-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap' },
  ],
})

onMounted(() => {
  order.persist()
  // Дни доставки считаем в браузере: страница собирается заранее, дата сборки устареет.
  ui.days.value = fmDeliveryDays()
  if (!ui.days.value.some((d) => d.key === order.form.value.day)) order.form.value.day = ui.days.value[0].key
})

watch(
  () => route.fullPath,
  () => {
    ui.menuOpen.value = false
    ui.product.value = null
  },
)

// Меню и окна закрывают страницу целиком — фон не прокручивается.
watch([ui.menuOpen, ui.product, ui.photo], ([menu, product, ph]) => {
  document.documentElement.classList.toggle('fm-locked', Boolean(menu || product || ph))
})

const onKey = (e: KeyboardEvent) => {
  if (ui.photo.value && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) stepPhoto(e.key === 'ArrowRight' ? 1 : -1)
  if (e.key !== 'Escape') return
  if (ui.photo.value) ui.photo.value = null
  else ui.product.value = null
  ui.menuOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('fm-locked')
})

const isOrder = computed(() => route.path.startsWith(fmPath('/order')))
const year = new Date().getFullYear()
</script>

<template>
  <div class="fm">
    <div class="fm-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="fmContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="fm-header">
      <div class="fm-top">
        <div class="fm-wrap fm-top__row">
          <p class="fm-top__note">
            <FmIcon name="truck" :size="18" />
            <span class="fm-top__long">Бесплатная доставка по Томску со вторника по пятницу</span>
            <span class="fm-top__short">Доставка вт–пт<span class="fm-top__free"> бесплатно</span></span>
          </p>
          <div class="fm-top__links">
            <a :href="fmContacts.phoneHref" class="fm-top__phone">{{ fmContacts.phone }}</a>
            <a :href="fmContacts.telegram" target="_blank" rel="noopener"><FmIcon name="telegram" :size="16" />Telegram</a>
            <a :href="fmContacts.max" target="_blank" rel="noopener"><FmIcon name="max" :size="16" />MAX</a>
          </div>
        </div>
      </div>
      <div class="fm-wrap fm-header__row">
        <NuxtLink :to="fmPath()" class="fm-mark" aria-label="FermaTomsk, на главную">
          <span class="fm-mark__sign"><i class="fm-logo" /></span>
          <span class="fm-mark__text">
            <span class="fm-mark__name">Ferma<b>Tomsk</b></span>
            <span class="fm-mark__sub">семейная ферма · пос. Рассвет</span>
          </span>
        </NuxtLink>
        <nav class="fm-header__nav" aria-label="Разделы сайта">
          <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        </nav>
        <div class="fm-header__right">
          <NuxtLink :to="fmPath('/order')" class="fm-orderbtn" :class="{ 'is-full': order.count.value, 'is-active': isOrder }">
            <FmIcon name="basket" />
            <span class="fm-orderbtn__label">{{ order.count.value ? fmPrice(order.total.value) : 'Заказ' }}</span>
            <span v-if="order.count.value" class="fm-dot">{{ order.count.value }}</span>
          </NuxtLink>
          <button
            type="button"
            class="fm-iconbtn fm-header__menu"
            :aria-expanded="ui.menuOpen.value"
            aria-controls="fm-menu"
            aria-label="Меню"
            @click="ui.menuOpen.value = !ui.menuOpen.value"
          >
            <FmIcon :name="ui.menuOpen.value ? 'close' : 'menu'" />
          </button>
        </div>
      </div>
    </header>

    <div v-if="ui.menuOpen.value" class="fm-backdrop fm-backdrop--menu" @click="ui.menuOpen.value = false" />
    <aside id="fm-menu" class="fm-menu" :class="{ 'is-open': ui.menuOpen.value }" aria-label="Меню">
      <div class="fm-menu__head">
        <span>Меню</span>
        <button type="button" class="fm-iconbtn" aria-label="Закрыть меню" @click="ui.menuOpen.value = false">
          <FmIcon name="close" />
        </button>
      </div>
      <nav class="fm-menu__nav">
        <NuxtLink :to="fmPath()">Главная</NuxtLink>
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        <NuxtLink :to="fmPath('/order')">Мой заказ</NuxtLink>
      </nav>
      <div class="fm-menu__contact">
        <a :href="fmContacts.phoneHref" class="fm-menu__phone">{{ fmContacts.phone }}</a>
        <div class="fm-menu__chats">
          <a :href="fmContacts.telegram" class="fm-btn" target="_blank" rel="noopener"><FmIcon name="telegram" :size="20" /> Telegram</a>
          <a :href="fmContacts.max" class="fm-btn fm-btn--ghost" target="_blank" rel="noopener"><FmIcon name="max" :size="20" /> MAX</a>
        </div>
        <p>{{ fmContacts.delivery }}</p>
      </div>
    </aside>

    <main class="fm-main">
      <NuxtPage />
    </main>

    <footer class="fm-footer">
      <div class="fm-wrap fm-footer__grid">
        <div class="fm-footer__brand">
          <NuxtLink :to="fmPath()" class="fm-mark">
            <span class="fm-mark__sign"><i class="fm-logo" /></span>
            <span class="fm-mark__text">
              <span class="fm-mark__name">Ferma<b>Tomsk</b></span>
              <span class="fm-mark__sub">семейная ферма · пос. Рассвет</span>
            </span>
          </NuxtLink>
          <p>Фермерские натуральные молочные продукты в Томске.</p>
        </div>
        <nav class="fm-footer__col" aria-label="Сайт">
          <strong>Сайт</strong>
          <NuxtLink :to="fmPath('/#products')">Продукты и цены</NuxtLink>
          <NuxtLink :to="fmPath('/order')">Мой заказ</NuxtLink>
          <NuxtLink :to="fmPath('/about')">О ферме и отзывы</NuxtLink>
          <NuxtLink :to="fmPath('/delivery')">Доставка и контакты</NuxtLink>
        </nav>
        <div class="fm-footer__col">
          <strong>Контакты</strong>
          <a :href="fmContacts.phoneHref">{{ fmContacts.phone }}</a>
          <a :href="fmContacts.telegram" target="_blank" rel="noopener">Telegram</a>
          <a :href="fmContacts.max" target="_blank" rel="noopener">MAX</a>
          <a :href="fmContacts.vk" target="_blank" rel="noopener">ВКонтакте</a>
        </div>
      </div>
      <div class="fm-wrap fm-footer__legal">
        <span>© {{ year }} FermaTomsk.ru</span>
        <span>
          Тексты, цены и фотографии принадлежат владельцам фермы FermaTomsk и взяты с
          <a :href="fmContacts.original" target="_blank" rel="noopener">fermatomsk.ru</a> для демонстрации концепта.
        </span>
      </div>
    </footer>

    <nav class="fm-bar" aria-label="Быстрые действия">
      <NuxtLink :to="fmPath('/#products')"><FmIcon name="leaf" /><span>Продукты</span></NuxtLink>
      <a :href="fmContacts.phoneHref"><FmIcon name="phone" /><span>Позвонить</span></a>
      <a :href="fmContacts.telegram" target="_blank" rel="noopener"><FmIcon name="telegram" /><span>Telegram</span></a>
      <NuxtLink :to="fmPath('/order')" class="fm-bar__order" :class="{ 'is-full': order.count.value }">
        <span class="fm-bar__icon">
          <FmIcon name="basket" />
          <span v-if="order.count.value" class="fm-dot">{{ order.count.value }}</span>
        </span>
        <span>{{ order.count.value ? fmPrice(order.total.value) : 'Заказ' }}</span>
      </NuxtLink>
    </nav>

    <Transition name="fm-fade">
      <div v-if="sheet" class="fm-backdrop fm-backdrop--modal" @click.self="ui.product.value = null">
        <div class="fm-sheet" role="dialog" aria-modal="true" :aria-label="sheet.name">
          <button type="button" class="fm-iconbtn fm-sheet__close" aria-label="Закрыть" @click="ui.product.value = null">
            <FmIcon name="close" />
          </button>
          <div class="fm-sheet__photo">
            <img :src="sheet.img" :alt="sheet.name" width="300" height="400" />
          </div>
          <div class="fm-sheet__body">
            <h2>{{ sheet.name }}</h2>
            <p class="fm-sheet__price">
              <b>{{ fmPrice(sheet.price) }}</b> за {{ sheet.unit }}
            </p>
            <div class="fm-sheet__buy">
              <FmQty :id="sheet.id" big />
              <NuxtLink v-if="order.qtyOf(sheet.id)" :to="fmPath('/order')" class="fm-btn fm-btn--ghost">К заказу</NuxtLink>
            </div>
            <div class="fm-sheet__text">
              <template v-if="sheet.text">
                <h3>О пользе сыворотки</h3>
                <p v-for="t in sheet.text" :key="t">{{ t }}</p>
              </template>
              <p v-else>{{ fmPromise }}</p>
            </div>
            <ul class="fm-sheet__facts">
              <li><FmIcon name="truck" :size="20" /><span>Бесплатная доставка по Томску со вторника по пятницу</span></li>
              <li><FmIcon name="shield" :size="20" /><span>Каждое животное имеет ветеринарный паспорт</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fm-fade">
      <div v-if="photo" class="fm-backdrop fm-backdrop--photo" @click.self="ui.photo.value = null">
        <figure class="fm-lightbox">
          <img :src="photo.src" :alt="photo.alt" />
          <figcaption>{{ photo.alt }}</figcaption>
        </figure>
        <button type="button" class="fm-iconbtn fm-lightbox__close" aria-label="Закрыть" @click="ui.photo.value = null">
          <FmIcon name="close" />
        </button>
        <template v-if="ui.photo.value && ui.photo.value.list.length > 1">
          <button type="button" class="fm-iconbtn fm-lightbox__nav fm-lightbox__nav--prev" aria-label="Предыдущее фото" @click="stepPhoto(-1)">
            <FmIcon name="left" />
          </button>
          <button type="button" class="fm-iconbtn fm-lightbox__nav fm-lightbox__nav--next" aria-label="Следующее фото" @click="stepPhoto(1)">
            <FmIcon name="right" />
          </button>
        </template>
      </div>
    </Transition>

    <Transition name="fm-fade">
      <div v-if="ui.toast.value" class="fm-toast" role="status">{{ ui.toast.value }}</div>
    </Transition>
  </div>
</template>

<style lang="scss">
html.fm-html {
  scrollbar-color: #cfd6d2 #ffffff;
  scroll-padding-top: 90px;

  &.fm-locked {
    overflow: hidden;
  }
}

body.fm-body {
  background: #fff;
  color: #2f2419;
  font-family: 'Rubik', system-ui, sans-serif;
}

.fm {
  --fm-green: #1a8040;
  --fm-green-d: #136833;
  --fm-green-soft: #e4f3e8;
  --fm-brand: #38d259;
  --fm-ink: #2f2419;
  --fm-text: #4a3f35;
  --fm-muted: #7a6f64;
  --fm-surface: #f3f5f4;
  --fm-photo: #e6eaeb;
  --fm-line: #e7e3dd;
  --fm-chat: #efeae2;
  --fm-bubble: #dcf3d9;
  --fm-r: 10px;
  --fm-r-lg: 18px;

  min-height: 100vh;
  background: #fff;
  color: var(--fm-ink);
  font-family: 'Rubik', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;

  @media (max-width: 768px) {
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
  }
}

:where(.fm) {
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
  textarea {
    font: inherit;
    color: inherit;
  }

  h1,
  h2,
  h3 {
    color: var(--fm-ink);
    font-weight: 700;
    letter-spacing: -0.01em;
  }
}

.fm-wrap {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 32px;

  @media (max-width: 989px) {
    padding: 0 20px;
  }

  @media (max-width: 375px) {
    padding: 0 14px;
  }
}

.fm-logo {
  display: inline-block;
  aspect-ratio: 240 / 183;
  background: currentColor;
  -webkit-mask: url('/redesign/fermatomsk/logo.png') center / contain no-repeat;
  mask: url('/redesign/fermatomsk/logo.png') center / contain no-repeat;
}

.fm-banner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
  padding: 8px 16px;
  background: var(--fm-ink);
  color: #f3eee7;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;

  a {
    color: #9be3ad;
    font-weight: 500;
    text-decoration: underline;
  }
}

.fm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 22px;
  border-radius: var(--fm-r);
  background: var(--fm-green);
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: var(--fm-green-d);
  }

  &--soft {
    background: var(--fm-green-soft);
    color: var(--fm-green-d);

    &:hover {
      background: #d2ebd9;
    }
  }

  &--ghost {
    background: #fff;
    color: var(--fm-ink);
    box-shadow: inset 0 0 0 1px var(--fm-line);

    &:hover {
      background: var(--fm-surface);
    }
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.fm-iconbtn {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--fm-r);
  color: var(--fm-ink);
  transition: background 0.15s;

  &:hover {
    background: var(--fm-surface);
  }
}

.fm-dot {
  display: grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--fm-brand);
  color: var(--fm-ink);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.fm-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: #fff;
  border-bottom: 1px solid var(--fm-line);

  &__row {
    display: flex;
    align-items: center;
    gap: 24px;
    height: 76px;

    @media (max-width: 989px) {
      height: 64px;
    }
  }

  &__nav {
    display: flex;
    gap: 4px;
    margin: 0 auto;

    a {
      padding: 10px 14px;
      border-radius: var(--fm-r);
      font-weight: 500;
      white-space: nowrap;
      transition: background 0.15s;

      &:hover {
        background: var(--fm-surface);
      }

      &.router-link-exact-active:not([href*='#']) {
        background: var(--fm-green-soft);
        color: var(--fm-green-d);
      }
    }

    @media (max-width: 989px) {
      display: none;
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
  }

  &__menu {
    display: none;

    @media (max-width: 989px) {
      display: grid;
    }
  }
}

.fm-top {
  background: var(--fm-surface);
  font-size: 14px;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 38px;
  }

  &__note {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--fm-text);

    .fm-icon {
      flex: none;
      color: var(--fm-green);
    }
  }

  &__short {
    display: none;
    white-space: nowrap;
  }

  &__links {
    display: flex;
    align-items: center;
    gap: 18px;

    a {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: var(--fm-text);
      white-space: nowrap;

      &:hover {
        color: var(--fm-green-d);
      }
    }

    .fm-icon {
      color: var(--fm-green);
    }
  }

  &__phone {
    font-weight: 600;
    color: var(--fm-ink) !important;
  }

  @media (max-width: 768px) {
    &__long,
    &__links a:not(.fm-top__phone) {
      display: none;
    }

    &__short {
      display: inline;
    }
  }

  @media (max-width: 375px) {
    font-size: 13px;

    &__row {
      gap: 8px;
    }

    &__note .fm-icon,
    &__free {
      display: none;
    }
  }
}

.fm-mark {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  &__sign {
    display: grid;
    place-items: center;
    flex: none;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: var(--fm-green);
    color: #fff;

    .fm-logo {
      width: 36px;
    }
  }

  &__text {
    display: grid;
    min-width: 0;
  }

  &__name {
    font-size: 22px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    white-space: nowrap;

    b {
      color: var(--fm-green);
      font-weight: 700;
    }
  }

  &__sub {
    color: var(--fm-muted);
    font-size: 13px;
    white-space: nowrap;
  }

  @media (max-width: 576px) {
    gap: 10px;

    &__sign {
      width: 42px;
      height: 42px;
      border-radius: 12px;

      .fm-logo {
        width: 31px;
      }
    }

    &__name {
      font-size: 19px;
    }

    &__sub {
      font-size: 12px;
    }
  }

  @media (max-width: 375px) {
    &__sub {
      display: none;
    }
  }
}

.fm-orderbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  // Ширина постоянная: сумма в кнопке не двигает меню шапки.
  width: 164px;
  height: 48px;
  padding: 0 16px;
  border-radius: var(--fm-r);
  background: var(--fm-green-soft);
  color: var(--fm-green-d);
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover {
    background: #d2ebd9;
  }

  &.is-full {
    background: var(--fm-green);
    color: #fff;

    &:hover {
      background: var(--fm-green-d);
    }
  }

  &__label {
    font-variant-numeric: tabular-nums;
  }

  .fm-dot {
    margin-left: auto;
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.fm-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(31, 24, 17, 0.45);

  &--menu {
    z-index: 45;
  }

  &--modal {
    display: grid;
    place-items: center;
    padding: 24px;
    overflow-y: auto;

    @media (max-width: 768px) {
      align-items: end;
      padding: 0;
    }
  }

  &--photo {
    display: grid;
    place-items: center;
    padding: 56px 72px;
    background: rgba(20, 16, 12, 0.88);

    @media (max-width: 768px) {
      padding: 64px 12px;
    }
  }
}

.fm-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: min(360px, 88vw);
  padding: 12px 20px 24px;
  background: #fff;
  overflow-y: auto;
  transform: translateX(100%);
  visibility: hidden;
  transition: transform 0.25s, visibility 0.25s;

  &.is-open {
    transform: none;
    visibility: visible;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 14px;
    font-size: 20px;
    font-weight: 700;
  }

  &__nav {
    display: grid;
    gap: 4px;

    a {
      padding: 12px 14px;
      border-radius: var(--fm-r);
      font-size: 18px;
      font-weight: 500;

      &:hover,
      &.router-link-exact-active:not([href*='#']) {
        background: var(--fm-surface);
      }
    }
  }

  &__contact {
    display: grid;
    gap: 12px;
    padding: 18px;
    border-radius: var(--fm-r-lg);
    background: var(--fm-surface);

    p {
      color: var(--fm-text);
      font-size: 14px;
    }
  }

  &__phone {
    font-size: 20px;
    font-weight: 600;
  }

  &__chats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    .fm-btn {
      padding: 0 12px;
    }
  }
}

.fm-main {
  min-height: 60vh;
}

.fm-footer {
  margin-top: 96px;
  padding: 48px 0 28px;
  background: var(--fm-surface);
  font-size: 15px;

  &__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 32px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }

  &__brand {
    display: grid;
    align-content: start;
    gap: 14px;

    p {
      color: var(--fm-text);
    }

    @media (max-width: 768px) {
      grid-column: 1 / -1;
    }
  }

  &__col {
    display: grid;
    align-content: start;
    gap: 8px;

    strong {
      margin-bottom: 4px;
      font-weight: 600;
    }

    a {
      color: var(--fm-text);

      &:hover {
        color: var(--fm-green-d);
      }
    }
  }

  &__legal {
    display: grid;
    gap: 6px;
    margin-top: 36px;
    padding-top: 20px;
    border-top: 1px solid #e1e5e3;
    color: var(--fm-muted);
    font-size: 13px;

    a {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    margin-top: 64px;
  }
}

.fm-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: none;
  grid-template-columns: 1fr 1fr 1fr 1.3fr;
  gap: 4px;
  padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1px solid var(--fm-line);

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-width: 0;
    height: 52px;
    border-radius: 12px;
    color: var(--fm-text);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;

    &.router-link-exact-active:not([href*='#']) {
      color: var(--fm-green-d);
    }
  }

  &__order {
    background: var(--fm-green-soft);
    color: var(--fm-green-d) !important;
    font-variant-numeric: tabular-nums;

    &.is-full {
      background: var(--fm-green);
      color: #fff !important;
    }
  }

  &__icon {
    position: relative;

    .fm-dot {
      position: absolute;
      top: -6px;
      right: -14px;
    }
  }

  @media (max-width: 768px) {
    display: grid;
  }
}

.fm-sheet {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
  width: min(880px, 100%);
  max-height: calc(100vh - 48px);
  overflow: hidden;
  border-radius: 24px;
  background: #fff;

  &__close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
    background: rgba(255, 255, 255, 0.9);
  }

  &__photo {
    position: relative;
    background: var(--fm-photo);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 32px 32px 28px;
    overflow-y: auto;

    h2 {
      padding-right: 40px;
      font-size: 30px;
      line-height: 1.15;
    }
  }

  &__price {
    color: var(--fm-muted);
    font-size: 17px;

    b {
      color: var(--fm-ink);
      font-size: 26px;
      font-weight: 700;
    }
  }

  &__buy {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__text {
    display: grid;
    gap: 10px;
    color: var(--fm-text);
    font-size: 15px;

    h3 {
      margin-top: 4px;
      font-size: 17px;
    }
  }

  &__facts {
    display: grid;
    gap: 10px;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid var(--fm-line);
    font-size: 14px;

    li {
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }

    .fm-icon {
      flex: none;
      color: var(--fm-green);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr);
    width: 100%;
    max-height: 92vh;
    border-radius: 24px 24px 0 0;
    overflow-y: auto;

    &__photo {
      height: 42vh;

      img {
        object-position: center 35%;
      }
    }

    &__body {
      padding: 22px 20px calc(24px + env(safe-area-inset-bottom));
      overflow: visible;

      h2 {
        font-size: 24px;
      }
    }
  }
}

.fm-lightbox {
  display: grid;
  justify-items: center;
  gap: 10px;
  max-width: 100%;
  max-height: 100%;

  img {
    max-width: 100%;
    max-height: calc(100vh - 160px);
    border-radius: 14px;
    object-fit: contain;
  }

  figcaption {
    color: #e8e2da;
    font-size: 14px;
  }

  &__close,
  &__nav {
    position: absolute;
    background: rgba(255, 255, 255, 0.92);

    &:hover {
      background: #fff;
    }
  }

  &__close {
    top: 14px;
    right: 14px;
  }

  &__nav {
    top: 50%;
    transform: translateY(-50%);

    &--prev {
      left: 14px;
    }

    &--next {
      right: 14px;
    }

    @media (max-width: 768px) {
      top: auto;
      bottom: 12px;
      transform: none;
    }
  }
}

.fm-toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  z-index: 80;
  width: max-content;
  max-width: min(520px, calc(100vw - 32px));
  padding: 12px 18px;
  border-radius: 14px;
  background: var(--fm-ink);
  color: #fff;
  font-size: 15px;
  transform: translateX(-50%);

  @media (max-width: 768px) {
    bottom: calc(76px + env(safe-area-inset-bottom));
  }
}

.fm-fade-enter-active,
.fm-fade-leave-active {
  transition: opacity 0.2s;
}

.fm-fade-enter-from,
.fm-fade-leave-to {
  opacity: 0;
}

// Общие блоки страниц: заголовок секции и отступы — в оболочке, чтобы были на всех страницах.
.fm-section {
  margin-top: 88px;

  @media (max-width: 768px) {
    margin-top: 56px;
  }
}

.fm-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
  margin-bottom: 28px;

  h2 {
    font-size: clamp(26px, 3vw, 38px);
    line-height: 1.1;
  }

  p {
    max-width: 560px;
    margin-top: 10px;
    color: var(--fm-text);
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--fm-green-d);
    font-weight: 500;
    white-space: nowrap;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
}

.fm-pagehead {
  padding: 40px 0 8px;

  h1 {
    font-size: clamp(30px, 4vw, 46px);
    line-height: 1.1;
  }

  p {
    max-width: 640px;
    margin-top: 12px;
    color: var(--fm-text);
    font-size: 17px;
  }

  @media (max-width: 768px) {
    padding-top: 28px;
  }
}

.fm-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 1199px) {
    gap: 14px;
  }

  @media (max-width: 989px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  @media (max-width: 375px) {
    gap: 8px;
  }
}

// Глобальный сброс портфолио ul[class] { margin: 0; padding: 0 } сильнее одного класса.
ul.fm-sheet__facts {
  margin-top: auto;
  padding-top: 16px;
}
</style>
