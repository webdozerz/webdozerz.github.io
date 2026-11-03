<script lang="ts" setup>
import BzIcon from '~/components/redesign/22bee/BzIcon.vue'
import BzPriceForm from '~/components/redesign/22bee/BzPriceForm.vue'

const route = useRoute()
const order = useBee22Order()
const ui = useBee22Ui()

useSeoMeta({
  title: 'Мёд и Соты — алтайский мёд оптом от 230 ₽/кг | Концепт редизайна',
  description:
    'Концепт редизайна сайта 22bee.ru: прайс 9 сортов алтайского мёда в куботейнерах по 34 кг, цены от 34 и от 200 кг, заявка с расчётом веса и суммы, документы пасеки и отзывы покупателей.',
  ogTitle: 'Мёд и Соты — концепт редизайна',
  ogDescription: 'Алтайский мёд оптом с собственных пасек: прайс куботейнерами, цена от 200 кг, заявка с готовым письмом, документы и отзывы.',
  ogImage: 'https://andryushov.me/redesign/22bee/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'bz-html', lang: 'ru' },
  bodyAttrs: { class: 'bz-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&display=swap' },
  ],
})

const nav = [
  { hash: '#sorta', label: 'Сорта и цены' },
  { hash: '#dostavka', label: 'Оплата и доставка' },
  { hash: '#dokumenty', label: 'Документы' },
  { hash: '#otzyvy', label: 'Отзывы' },
  { hash: '#foto', label: 'С пасеки' },
]
const to = (hash: string) => ({ path: bzPath(), hash })
const isOrder = computed(() => route.path.startsWith(bzPath('/zayavka')))
const year = new Date().getFullYear()

// Липкая шапка: верхняя строка с поясом и почтой уезжает, строка со знаком, разделами и «Заявкой» остаётся у верха.
const strip = ref<HTMLElement | null>(null)
const stick = ref(0)
const measure = () => {
  stick.value = strip.value?.offsetHeight ?? 0
}

// Лайтбокс отзывов, документов и фото: стрелки, Esc, свайп не нужен — кнопки крупные
const shot = computed(() => (ui.gallery.value ? ui.gallery.value.items[ui.gallery.value.index] : null))
const step = (d: number) => {
  const g = ui.gallery.value
  if (!g) return
  g.index = (g.index + d + g.items.length) % g.items.length
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    ui.gallery.value = null
    ui.priceModal.value = false
    ui.menu.value = false
  }
  if (ui.gallery.value && e.key === 'ArrowRight') step(1)
  if (ui.gallery.value && e.key === 'ArrowLeft') step(-1)
}

const locked = computed(() => !!ui.gallery.value || ui.priceModal.value || ui.menu.value)
watch(locked, (v) => document.documentElement.classList.toggle('bz-lock', v))
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    ui.gallery.value = null
  },
)

// Плашка cookie — как у оригинала, кнопка «Хорошо» запоминается
const cookie = ref(false)
const okCookie = () => {
  cookie.value = false
  try {
    localStorage.setItem('bz-cookie', '1')
  } catch {
    /* ignore */
  }
}

onMounted(() => {
  order.persist()
  measure()
  window.addEventListener('resize', measure)
  document.addEventListener('keydown', onKey)
  try {
    cookie.value = !localStorage.getItem('bz-cookie')
  } catch {
    cookie.value = true
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', measure)
  document.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('bz-lock')
})
</script>

<template>
  <div class="bz" :class="{ 'has-order': order.count.value }">
    <div class="bz-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="bzContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="bz-header" :style="{ top: `${-stick}px` }">
      <div ref="strip" class="bz-strip">
        <div class="bz-wrap bz-strip__row">
          <span class="bz-strip__item"><BzIcon name="pin" :size="17" />{{ bzContacts.region }}</span>
          <span class="bz-strip__item bz-strip__tz"><BzIcon name="clock" :size="17" />{{ bzContacts.hours }}, {{ bzContacts.tz }}</span>
          <span class="bz-strip__item bz-strip__min"><BzIcon name="cube" :size="17" />Минимальный заказ — 1 куботейнер, 34 кг</span>
          <a :href="`mailto:${bzContacts.email}`" class="bz-strip__mail"><BzIcon name="mail" :size="17" />{{ bzContacts.email }}</a>
        </div>
      </div>

      <div class="bz-wrap bz-bar">
        <button type="button" class="bz-iconbtn bz-bar__burger" aria-label="Меню" @click="ui.menu.value = true"><BzIcon name="menu" /></button>
        <NuxtLink :to="bzPath()" class="bz-mark" aria-label="Мёд и Соты, на главную">
          <span class="bz-mark__sign"><BzIcon name="comb" :size="24" /></span>
          <span class="bz-mark__name">Мёд и Соты</span>
          <span class="bz-mark__sub">алтайский мёд<br />оптом с пасек</span>
        </NuxtLink>

        <nav class="bz-bar__nav" aria-label="Разделы">
          <NuxtLink v-for="n in nav" :key="n.hash" :to="to(n.hash)">{{ n.label }}</NuxtLink>
        </nav>

        <button type="button" class="bz-btn bz-btn--line bz-bar__price" @click="ui.priceModal.value = true">Получить прайс</button>
        <NuxtLink :to="bzPath('/zayavka')" class="bz-orderbtn" :class="{ 'is-full': order.count.value }" aria-label="Заявка">
          <BzIcon name="list" />
          <span class="bz-orderbtn__text">
            <template v-if="order.count.value">
              <b>{{ order.kg.value ? bzKg(order.kg.value) : 'соты' }}</b>
              <small>{{ order.total.value ? bzMoney(order.total.value) : 'по весу' }}</small>
            </template>
            <b v-else>Заявка</b>
          </span>
          <i v-if="order.count.value" class="bz-orderbtn__count">{{ order.count.value }}</i>
        </NuxtLink>
      </div>
    </header>

    <main class="bz-main">
      <NuxtPage />
    </main>

    <footer class="bz-footer">
      <div class="bz-wrap bz-footer__grid">
        <div class="bz-footer__brand">
          <NuxtLink :to="bzPath()" class="bz-mark" aria-label="Мёд и Соты, на главную">
            <span class="bz-mark__sign"><BzIcon name="comb" :size="24" /></span>
            <span class="bz-mark__name">Мёд и Соты</span>
          </NuxtLink>
          <p>{{ bzContacts.motto }}. Поставки натурального мёда оптом по ГОСТу с пасек Алтая.</p>
        </div>
        <nav class="bz-footer__nav" aria-label="Разделы">
          <NuxtLink v-for="n in nav" :key="n.hash" :to="to(n.hash)">{{ n.label }}</NuxtLink>
          <NuxtLink :to="bzPath('/zayavka')">Заявка</NuxtLink>
        </nav>
        <div class="bz-footer__contacts">
          <p class="bz-footer__label">Контакты</p>
          <a :href="`mailto:${bzContacts.email}`" class="bz-footer__mail">{{ bzContacts.email }}</a>
          <p>{{ bzContacts.hours }}<br />{{ bzContacts.tz }}</p>
          <p>{{ bzContacts.region }}</p>
          <button type="button" class="bz-btn bz-btn--main" @click="ui.priceModal.value = true">Получить прайс</button>
        </div>
      </div>
      <div class="bz-wrap bz-footer__legal">
        <p>{{ bzContacts.legal }}. Адрес: {{ bzContacts.address }}</p>
        <p>
          © {{ year }} Концепт редизайна сайта 22bee.ru. Тексты, цены, фотографии и документы принадлежат владельцу сайта и
          использованы только для показа концепта.
        </p>
      </div>
    </footer>

    <nav class="bz-tabbar" aria-label="Быстрые действия">
      <NuxtLink :to="to('#sorta')"><BzIcon name="comb" /><span>Сорта</span></NuxtLink>
      <button type="button" @click="ui.priceModal.value = true"><BzIcon name="tag" /><span>Прайс</span></button>
      <a :href="`mailto:${bzContacts.email}`"><BzIcon name="mail" /><span>Почта</span></a>
      <NuxtLink :to="bzPath('/zayavka')" class="bz-tabbar__order" :class="{ 'is-on': isOrder, 'is-full': order.count.value }">
        <BzIcon name="list" />
        <span>{{ order.count.value ? (order.total.value ? bzMoney(order.total.value) : bzFramesLabel(order.qtyOf('soty'))) : 'Заявка' }}</span>
      </NuxtLink>
    </nav>

    <div v-if="ui.menu.value" class="bz-drawer" @click.self="ui.menu.value = false">
      <aside class="bz-drawer__panel" aria-label="Меню">
        <div class="bz-drawer__head">
          <span>Меню</span>
          <button type="button" class="bz-iconbtn" aria-label="Закрыть меню" @click="ui.menu.value = false"><BzIcon name="close" /></button>
        </div>
        <nav class="bz-drawer__nav">
          <NuxtLink v-for="n in nav" :key="n.hash" :to="to(n.hash)" @click="ui.menu.value = false">{{ n.label }}</NuxtLink>
          <NuxtLink :to="bzPath('/zayavka')">Заявка<template v-if="order.count.value"> · {{ order.count.value }}</template></NuxtLink>
        </nav>
        <p class="bz-drawer__label">Сорта</p>
        <nav class="bz-drawer__sorts">
          <NuxtLink v-for="s in bzSorts" :key="s.id" :to="bzSortPath(s.id)">
            <span>{{ s.short }}</span>
            <small>{{ s.stock ? `от ${bzMoney(s.tiers[1].price)}` : 'нет' }}</small>
          </NuxtLink>
        </nav>
        <div class="bz-drawer__contacts">
          <button type="button" class="bz-btn bz-btn--main" @click="ui.priceModal.value = true">Получить прайс</button>
          <a :href="`mailto:${bzContacts.email}`">{{ bzContacts.email }}</a>
          <p>{{ bzContacts.hours }}, {{ bzContacts.tz }}</p>
        </div>
      </aside>
    </div>

    <div v-if="ui.priceModal.value" class="bz-modal" @click.self="ui.priceModal.value = false">
      <div class="bz-modal__box" role="dialog" aria-modal="true" aria-label="Получить прайс">
        <button type="button" class="bz-iconbtn bz-modal__close" aria-label="Закрыть" @click="ui.priceModal.value = false"><BzIcon name="close" /></button>
        <p class="bz-modal__title">Оптовый прайс на мёд</p>
        <p class="bz-modal__lead">Минимальный заказ — 1 куботейнер, 34 кг. Мы на Алтае, отправляем из Барнаула.</p>
        <BzPriceForm button="Получить прайс" />
      </div>
    </div>

    <div v-if="shot && ui.gallery.value" class="bz-lightbox" @click.self="ui.gallery.value = null">
      <figure>
        <img :src="shot.img" :alt="shot.title" />
        <figcaption>{{ shot.title }} · {{ ui.gallery.value.index + 1 }} из {{ ui.gallery.value.items.length }}</figcaption>
      </figure>
      <button type="button" class="bz-iconbtn bz-lightbox__close" aria-label="Закрыть" @click="ui.gallery.value = null"><BzIcon name="close" /></button>
      <button v-if="ui.gallery.value.items.length > 1" type="button" class="bz-iconbtn bz-lightbox__prev" aria-label="Предыдущий" @click="step(-1)"><BzIcon name="left" /></button>
      <button v-if="ui.gallery.value.items.length > 1" type="button" class="bz-iconbtn bz-lightbox__next" aria-label="Следующий" @click="step(1)"><BzIcon name="right" /></button>
    </div>

    <div v-if="cookie" class="bz-cookie" role="region" aria-label="Cookie">
      <p>Сайт использует cookie-файлы. Продолжая работу с сайтом, вы разрешаете их использование.</p>
      <button type="button" class="bz-btn bz-btn--line" @click="okCookie">Хорошо</button>
    </div>

    <Transition name="bz-fade">
      <p v-if="ui.toast.value" class="bz-toast" role="status">
        <BzIcon name="check" :size="18" /><span>{{ ui.toast.value }}</span>
        <NuxtLink v-if="!isOrder" :to="bzPath('/zayavka')">Заявка</NuxtLink>
      </p>
    </Transition>
  </div>
</template>

<style lang="scss">
.bz-body {
  background: #fff;
}
html.bz-html {
  scroll-padding-top: 96px;
  scroll-behavior: smooth;

  @media (max-width: 989px) {
    scroll-padding-top: 76px;
  }
}
html.bz-lock {
  overflow: hidden;
}

.bz {
  --bz-accent: #f9d400;
  --bz-accent-hover: #ecc700;
  --bz-accent-line: #dcb800;
  --bz-soft: #fff7c7;
  --bz-ink: #2b2614;
  --bz-text: #46412e;
  --bz-muted: #77715c;
  --bz-surface: #f4f4ec;
  --bz-line: #e5e3d6;
  --bz-copper: #a85a00;
  --bz-green: #2e7a3a;
  --bz-red: #b8352a;
  --bz-r: 10px;
  --bz-R: 16px;
  --bz-pop: 0 2px 6px rgba(43, 38, 20, 0.08), 0 22px 54px rgba(43, 38, 20, 0.22);
  min-height: 100vh;
  background: #fff;
  color: var(--bz-text);
  font-family: 'Onest', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;

  @media (max-width: 768px) {
    padding-bottom: 66px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

:where(.bz) h1,
:where(.bz) h2,
:where(.bz) h3,
:where(.bz) p,
:where(.bz) figure,
:where(.bz) dl,
:where(.bz) dd {
  margin: 0;
}
:where(.bz) h1,
:where(.bz) h2,
:where(.bz) h3 {
  color: var(--bz-ink);
  font-weight: 800;
  letter-spacing: -0.015em;
}
:where(.bz) a {
  color: inherit;
  text-decoration: none;
}
:where(.bz) img {
  display: block;
  max-width: 100%;
}
:where(.bz) button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  border: 0;
  background: none;
  padding: 0;
}
:where(.bz) input,
:where(.bz) textarea,
:where(.bz) select {
  font: inherit;
  color: inherit;
}
:where(.bz) ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.bz-wrap {
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

.bz-section {
  padding-top: 72px;

  @media (max-width: 768px) {
    padding-top: 48px;
  }
}
.bz-head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 12px 32px;
  margin-bottom: 28px;

  p {
    max-width: 560px;
    color: var(--bz-muted);
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
}
.bz-h2 {
  font-size: clamp(26px, 2.6vw, 38px);
  line-height: 1.12;
}
.bz-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--bz-ink);
  font-weight: 600;
  border-bottom: 1.5px solid var(--bz-accent-line);

  &:hover {
    color: var(--bz-copper);
  }
}

/* Кнопки */
.bz-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: var(--bz-r);
  font-weight: 700;
  font-size: 15px;
  white-space: nowrap;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;

  &--main {
    background: var(--bz-accent);
    color: var(--bz-ink);

    &:hover {
      background: var(--bz-accent-hover);
    }
  }

  &--line,
  &--line:focus,
  &--line:active {
    background: #fff;
    color: var(--bz-ink);
    border: 1px solid var(--bz-line);
  }

  &--line:hover {
    border-color: var(--bz-ink);
  }

  &--off {
    background: var(--bz-surface);
    color: var(--bz-muted);
    cursor: default;
  }

  &.is-big {
    min-height: 54px;
    font-size: 16px;
  }
}
.bz-qtybtn {
  width: 100%;
}
.bz-iconbtn {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--bz-r);
  color: var(--bz-ink);

  &:hover {
    background: var(--bz-surface);
  }
}

/* Счётчик куботейнеров — общий для прайса, страницы сорта и заявки */
.bz-qty {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) 46px;
  align-items: center;
  min-height: 46px;
  border-radius: var(--bz-r);
  background: var(--bz-soft);
  box-shadow: inset 0 0 0 1.5px var(--bz-accent-line);

  > button {
    display: grid;
    place-items: center;
    height: 46px;
    border-radius: var(--bz-r);
    color: var(--bz-ink);

    &:hover {
      background: var(--bz-accent);
    }
  }

  > label {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0;
    color: var(--bz-ink);
    font-weight: 700;

    input {
      min-width: 2ch;
      padding: 0;
      border: 0;
      background: none;
      text-align: center;
      font-weight: 700;
      font-size: 17px;
      -moz-appearance: textfield;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &:focus {
        outline: none;
      }
    }

    span {
      padding: 0 6px;
      color: var(--bz-muted);
      font-size: 14px;
      font-weight: 500;
    }
  }

  &.is-big {
    min-height: 54px;

    > button {
      height: 54px;
    }
  }
}

.bz-stock {
  color: var(--bz-green);
  font-weight: 600;

  &.is-out {
    color: var(--bz-muted);
  }
}

/* Ступени цены, форма прайса, крошки — общие для главной, сорта и заявки */
.bz-tier {
  display: grid;
  gap: 2px;
  padding: 9px 12px;
  border-radius: 12px;
  background: var(--bz-surface);
  transition: background 0.2s;

  dt {
    color: var(--bz-muted);
    font-size: 13px;
  }

  dd {
    margin: 0;
    color: var(--bz-ink);
    white-space: nowrap;

    b {
      font-size: 19px;
      font-weight: 700;
    }

    span {
      color: var(--bz-muted);
      font-size: 14px;
    }
  }

  &.is-bulk dd b {
    color: var(--bz-copper);
  }

  &.is-active {
    background: var(--bz-soft);
    box-shadow: inset 0 0 0 1.5px var(--bz-accent-line);
  }
}
.bz-pform {
  form {
    display: grid;
    gap: 14px;
  }

  &__title {
    margin: 0;
    color: var(--bz-ink);
    font-size: 20px;
    font-weight: 700;
  }

  &__error {
    margin: 0;
    color: var(--bz-red);
    font-size: 14px;
  }

  &__send {
    width: 100%;
  }

  &__done {
    display: grid;
    gap: 12px;
    justify-items: start;

    p {
      margin: 0;

      b {
        display: block;
        color: var(--bz-ink);
        font-size: 19px;
      }
    }

    small {
      color: var(--bz-muted);
    }
  }

  &__ok {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--bz-accent);
    color: var(--bz-ink);
  }
}
.bz-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 20px 0;
  color: var(--bz-muted);
  font-size: 14px;

  a:hover {
    color: var(--bz-ink);
  }
}

/* Поля форм */
.bz-field {
  display: grid;
  gap: 6px;

  > span {
    color: var(--bz-ink);
    font-size: 14px;
    font-weight: 600;
  }

  input,
  textarea {
    width: 100%;
    min-height: 48px;
    padding: 11px 14px;
    border: 1px solid var(--bz-line);
    border-radius: var(--bz-r);
    background: #fff;
    color: var(--bz-ink);

    &:focus {
      outline: none;
      border-color: var(--bz-ink);
    }
  }

  textarea {
    min-height: 92px;
    resize: vertical;
  }
}
.bz-seg {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
  padding: 4px;
  border-radius: var(--bz-r);
  background: var(--bz-surface);

  @media (max-width: 375px) {
    grid-template-columns: auto auto auto;
  }

  button {
    min-height: 40px;
    padding: 0 8px;
    border-radius: 8px;
    color: var(--bz-text);
    font-weight: 600;
    white-space: nowrap;

    &.is-on {
      background: #fff;
      color: var(--bz-ink);
      box-shadow: 0 1px 3px rgba(43, 38, 20, 0.16);
    }

    @media (max-width: 375px) {
      padding: 0 4px;
      font-size: 13.5px;
    }
  }
}
.bz-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  cursor: pointer;

  input {
    flex: none;
    width: 20px;
    height: 20px;
    margin: 1px 0 0;
    accent-color: var(--bz-ink);
  }
}

.bz-banner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
  padding: 8px 16px;
  background: var(--bz-ink);
  color: #f2efe2;
  font-size: 13px;
  text-align: center;

  a {
    color: var(--bz-accent);
    font-weight: 600;
    text-decoration: underline;
  }
}

/* Шапка */
.bz-header {
  position: sticky;
  z-index: 40;
  background: #fff;
  box-shadow: 0 1px 0 var(--bz-line);
}
.bz-strip {
  background: var(--bz-surface);
  font-size: 13.5px;

  &__row {
    display: flex;
    align-items: center;
    gap: 6px 28px;
    min-height: 38px;
  }

  &__item,
  &__mail {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
    color: var(--bz-text);

    .bz-icon {
      flex: none;
      color: var(--bz-muted);
    }
  }

  &__mail {
    margin-left: auto;
    color: var(--bz-ink);
    font-weight: 600;

    &:hover {
      color: var(--bz-copper);
    }
  }

  @media (max-width: 1199px) {
    &__min {
      display: none;
    }
  }
  @media (max-width: 768px) {
    &__item:first-child {
      display: none;
    }
    &__row {
      gap: 16px;
    }
  }
  @media (max-width: 576px) {
    &__tz {
      display: none;
    }
    &__mail {
      margin: 0 auto;
    }
  }
}
.bz-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 74px;

  &__burger {
    display: none;
    margin-left: -10px;
  }

  &__nav {
    display: flex;
    gap: 4px;
    margin: 0 auto;

    a {
      padding: 8px 12px;
      border-radius: var(--bz-r);
      color: var(--bz-ink);
      font-weight: 600;
      white-space: nowrap;

      &:hover {
        background: var(--bz-surface);
      }
    }
  }

  @media (max-width: 1400px) {
    gap: 14px;

    &__nav a {
      padding: 8px 9px;
    }
  }
  @media (max-width: 1199px) {
    &__nav {
      display: none;
    }
    &__burger {
      display: inline-grid;
    }
    &__price {
      margin-left: auto;
    }
  }
  @media (max-width: 989px) {
    min-height: 64px;
  }
  @media (max-width: 576px) {
    gap: 8px;

    &__price {
      display: none;
    }
  }
}
.bz-mark {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  align-items: center;
  column-gap: 12px;
  color: var(--bz-ink);

  &__sign {
    grid-row: 1 / 3;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--bz-accent);
    color: var(--bz-ink);
  }

  &__name {
    font-size: 21px;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  &__sub {
    color: var(--bz-muted);
    font-size: 12px;
    line-height: 1.2;
  }

  @media (max-width: 1199px) {
    &__sub {
      display: none;
    }
    &__name {
      grid-row: 1 / 3;
    }
  }
  @media (max-width: 989px) {
    &__sign {
      width: 38px;
      height: 38px;
      border-radius: 10px;
    }
    &__name {
      font-size: 19px;
    }
  }
}
.bz-orderbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: 168px;
  min-height: 48px;
  padding: 0 14px;
  border-radius: var(--bz-r);
  background: var(--bz-surface);
  color: var(--bz-ink);
  transition: background 0.2s;

  &:hover {
    background: var(--bz-soft);
  }

  &.is-full {
    background: var(--bz-accent);
  }

  &__text {
    display: grid;
    line-height: 1.15;
    min-width: 0;

    b {
      font-weight: 700;
      white-space: nowrap;
    }

    small {
      font-size: 13px;
      white-space: nowrap;
    }
  }

  &__count {
    position: absolute;
    top: -6px;
    right: -6px;
    display: grid;
    place-items: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 11px;
    background: var(--bz-ink);
    color: #fff;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
  }

  @media (max-width: 576px) {
    width: 48px;
    padding: 0;
    justify-content: center;
    margin-left: auto;

    &__text {
      display: none;
    }
  }
}

/* Подвал */
.bz-footer {
  margin-top: 88px;
  padding: 56px 0 28px;
  background: var(--bz-surface);

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 1fr);
    gap: 32px 48px;
  }

  &__brand p {
    max-width: 380px;
    margin-top: 16px;
  }

  &__nav {
    display: grid;
    align-content: start;
    gap: 10px;

    a {
      color: var(--bz-ink);
      font-weight: 600;

      &:hover {
        color: var(--bz-copper);
      }
    }
  }

  &__contacts {
    display: grid;
    align-content: start;
    justify-items: start;
    gap: 10px;
  }

  &__label {
    color: var(--bz-muted);
    font-size: 13px;
  }

  &__mail {
    color: var(--bz-ink);
    font-size: 19px;
    font-weight: 700;
  }

  &__legal {
    display: grid;
    gap: 6px;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid var(--bz-line);
    color: var(--bz-muted);
    font-size: 13px;
  }

  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
    &__brand {
      grid-column: 1 / -1;
    }
  }
  @media (max-width: 576px) {
    margin-top: 64px;

    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

/* Таббар телефона: Сорта · Прайс · Почта · Заявка */
.bz-tabbar {
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 45;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1.4fr;
    gap: 4px;
    padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
    background: #fff;
    box-shadow: 0 -1px 0 var(--bz-line);

    > a,
    > button {
      display: grid;
      justify-items: center;
      gap: 1px;
      min-width: 0;
      padding: 5px 2px;
      border-radius: var(--bz-r);
      color: var(--bz-ink);
      font-size: 12px;
      font-weight: 600;

      span {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  &__order.is-full {
    background: var(--bz-accent);
  }
}

/* Выезжающее меню */
.bz-drawer {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(43, 38, 20, 0.4);

  &__panel {
    display: grid;
    align-content: start;
    gap: 14px;
    width: min(380px, 92vw);
    height: 100%;
    overflow-y: auto;
    padding: 12px 20px 28px;
    background: #fff;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--bz-ink);
    font-size: 18px;
    font-weight: 700;
  }

  &__nav {
    display: grid;

    a {
      padding: 11px 0;
      border-bottom: 1px solid var(--bz-line);
      color: var(--bz-ink);
      font-size: 17px;
      font-weight: 600;
    }
  }

  &__label {
    margin-top: 8px;
    color: var(--bz-muted);
    font-size: 13px;
  }

  &__sorts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;

    a {
      display: grid;
      padding: 9px 12px;
      border-radius: var(--bz-r);
      background: var(--bz-surface);
      color: var(--bz-ink);
      font-weight: 600;
      line-height: 1.25;

      small {
        color: var(--bz-muted);
        font-weight: 500;
      }
    }
  }

  &__contacts {
    display: grid;
    gap: 10px;
    margin-top: 8px;

    a {
      color: var(--bz-ink);
      font-weight: 700;
    }

    p {
      color: var(--bz-muted);
      font-size: 14px;
    }
  }
}

/* Окно «Получить прайс» */
.bz-modal {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(43, 38, 20, 0.45);

  &__box {
    position: relative;
    width: min(460px, 100%);
    max-height: calc(100vh - 32px);
    overflow-y: auto;
    padding: 28px;
    border-radius: 20px;
    background: #fff;
    box-shadow: var(--bz-pop);
  }

  &__close {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  &__title {
    padding-right: 40px;
    color: var(--bz-ink);
    font-size: 24px;
    font-weight: 800;
    line-height: 1.15;
  }

  &__lead {
    margin: 8px 0 20px !important;
    color: var(--bz-muted);
  }

  @media (max-width: 375px) {
    &__box {
      padding: 22px 16px;
    }
  }
}

/* Лайтбокс */
.bz-lightbox {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 56px 72px;
  background: rgba(20, 18, 10, 0.88);

  figure {
    display: grid;
    gap: 10px;
    justify-items: center;
    max-width: 100%;
    max-height: 100%;
  }

  img {
    max-width: min(1000px, 100%);
    max-height: calc(100vh - 140px);
    border-radius: 12px;
    object-fit: contain;
    background: #fff;
  }

  figcaption {
    color: #f2efe2;
    font-size: 14px;
  }

  .bz-iconbtn {
    position: absolute;
    background: rgba(255, 255, 255, 0.92);

    &:hover {
      background: var(--bz-accent);
    }
  }

  &__close {
    top: 12px;
    right: 12px;
  }

  &__prev {
    left: 12px;
    top: 50%;
  }

  &__next {
    right: 12px;
    top: 50%;
  }

  @media (max-width: 576px) {
    padding: 60px 10px 76px;

    &__prev,
    &__next {
      top: auto;
      bottom: 16px;
    }
    &__prev {
      left: calc(50% - 52px);
    }
    &__next {
      right: calc(50% - 52px);
    }
  }
}

.bz-cookie {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 520px;
  padding: 14px 16px;
  border: 1px solid var(--bz-line);
  border-radius: var(--bz-R);
  background: #fff;
  box-shadow: var(--bz-pop);
  font-size: 13.5px;

  @media (max-width: 768px) {
    left: 10px;
    right: 10px;
    bottom: 76px;
  }
  @media (max-width: 375px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.bz-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: calc(100vw - 24px);
  padding: 10px 12px 10px 16px;
  border-radius: 14px;
  background: var(--bz-ink);
  color: #fff;
  transform: translateX(-50%);
  box-shadow: var(--bz-pop);
  font-size: 14px;

  .bz-icon {
    flex: none;
    color: var(--bz-accent);
  }

  a {
    flex: none;
    padding: 6px 10px;
    border-radius: 8px;
    background: var(--bz-accent);
    color: var(--bz-ink);
    font-weight: 700;
  }

  @media (max-width: 768px) {
    bottom: 78px;
  }
}
.bz-fade-enter-active,
.bz-fade-leave-active {
  transition: opacity 0.2s;
}
.bz-fade-enter-from,
.bz-fade-leave-to {
  opacity: 0;
}
</style>
