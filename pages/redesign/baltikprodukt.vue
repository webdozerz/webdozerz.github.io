<script lang="ts" setup>
import BpIcon from '~/components/redesign/baltikprodukt/BpIcon.vue'
import BpSearch from '~/components/redesign/baltikprodukt/BpSearch.vue'

const route = useRoute()
const list = useBaltikproduktList()
const ui = useBaltikproduktUi()

useSeoMeta({
  title: 'Балтик продукт — рыба и морепродукты оптом в Туле | Концепт редизайна',
  description:
    'Концепт редизайна сайта «Балтик продукт»: прайс на 354 позиции с поиском, цены опт и розница +3 %, цена коробкой, список заказа с готовым письмом менеджеру.',
  ogTitle: 'Балтик продукт — концепт редизайна',
  ogDescription: 'Свежемороженая рыба, креветки, икра, копчение и консервы оптом и в розницу с рыбной базы в Туле: поиск по прайсу, цена коробкой, список заказа.',
  ogImage: 'https://andryushov.me/redesign/baltikprodukt/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'bp-html', lang: 'ru' },
  bodyAttrs: { class: 'bp-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap' },
  ],
})

// Режим работы на сегодня по Москве — считается в браузере, чтобы сборка не запекла день.
const today = ref('Открыты ежедневно')
onMounted(() => {
  list.persist()
  const day = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' })).getDay()
  const close = day === 0 ? '14:00' : day === 6 ? '16:00' : '18:00'
  today.value = `Сегодня 8:00–${close}`
})

const isCatalog = computed(() => route.path.startsWith(bpPath('/catalog')))
const isList = computed(() => route.path.startsWith(bpPath('/list')))
const nav = [
  { to: bpSectionPath(), label: 'Прайс' },
  { to: bpPath('/about'), label: 'О компании' },
  { to: bpPath('/contacts'), label: 'Контакты и условия' },
]
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    ui.photo.value = null
    catOpen.value = false
  },
)
const year = new Date().getFullYear()
const catOpen = ref(false)

// Липкая шапка: верхняя строка уезжает, строка поиска остаётся у верха экрана, в ней появляется «Список».
const header = ref<HTMLElement | null>(null)
const stick = ref(0)
const stuck = ref(false)
const measure = () => {
  const h = header.value
  const row = h?.querySelector<HTMLElement>('.bp-search__form')
  if (!h || !row) return
  stick.value = Math.round(row.getBoundingClientRect().top - h.getBoundingClientRect().top - 10)
  onScroll()
}
const onScroll = () => {
  if (header.value) stuck.value = header.value.getBoundingClientRect().top <= -stick.value + 1
}
onMounted(() => {
  measure()
  window.addEventListener('resize', measure)
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', measure)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="bp" :class="{ 'has-bar': list.count.value && !isList }">
    <div class="bp-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="bpContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header ref="header" class="bp-header" :class="{ 'is-stuck': stuck }" :style="{ top: `${-stick}px` }">
      <div class="bp-wrap bp-header__top">
        <button type="button" class="bp-iconbtn bp-header__burger" aria-label="Меню" @click="ui.menu.value = true"><BpIcon name="menu" /></button>
        <NuxtLink :to="bpPath()" class="bp-mark" aria-label="Балтик продукт, на главную">
          <img src="/redesign/baltikprodukt/logo.png" alt="" width="350" height="230" />
          <span class="bp-mark__sub">Рыбная база в&nbsp;Туле<br />с&nbsp;1995 года</span>
        </NuxtLink>

        <nav class="bp-nav" aria-label="Разделы сайта">
          <div class="bp-nav__cat" @mouseenter="catOpen = true" @mouseleave="catOpen = false">
            <NuxtLink :to="bpSectionPath()" class="bp-nav__link" :aria-expanded="catOpen" @focus="catOpen = true">
              Прайс <BpIcon name="down" :size="16" />
            </NuxtLink>
            <div v-if="catOpen" class="bp-nav__drop">
              <NuxtLink v-for="s in bpSections" :key="s.id" :to="bpSectionPath(s.id)" @click="catOpen = false">
                <img :src="bpImg(s.img)" alt="" width="40" height="40" />
                <span>{{ s.title }}</span>
                <small>{{ s.count }}</small>
              </NuxtLink>
            </div>
          </div>
          <NuxtLink v-for="n in nav.slice(1)" :key="n.to" :to="n.to" class="bp-nav__link">{{ n.label }}</NuxtLink>
        </nav>

        <div class="bp-header__right">
          <div class="bp-phone">
            <a :href="bpContacts.phones[0].href">{{ bpContacts.phones[0].label }}</a>
            <small>{{ today }}</small>
          </div>
          <a :href="bpContacts.max" target="_blank" rel="noopener" class="bp-maxbtn" aria-label="Канал в MAX">
            <BpIcon name="max" :size="20" />
            <span>Мы в MAX</span>
          </a>
          <a :href="bpContacts.phones[0].href" class="bp-iconbtn bp-header__call" aria-label="Позвонить"><BpIcon name="phone" /></a>
          <NuxtLink :to="bpPath('/list')" class="bp-listbtn" :class="{ 'is-full': list.count.value }" aria-label="Список заказа">
            <BpIcon name="list" />
            <span class="bp-listbtn__label">{{ list.count.value ? bpMoney0(list.total.value) : 'Список' }}</span>
            <span v-if="list.count.value" class="bp-dot">{{ list.count.value }}</span>
          </NuxtLink>
        </div>
      </div>

      <div class="bp-wrap bp-header__search">
        <div class="bp-header__find">
          <BpSearch :suggest="!isCatalog" />
          <NuxtLink :to="bpPath('/list')" class="bp-listbtn bp-header__stucklist" :class="{ 'is-full': list.count.value }" aria-label="Список заказа">
            <BpIcon name="list" />
            <span class="bp-listbtn__label">{{ list.count.value ? bpMoney0(list.total.value) : 'Список' }}</span>
            <span v-if="list.count.value" class="bp-dot">{{ list.count.value }}</span>
          </NuxtLink>
        </div>
        <div class="bp-mode" role="group" aria-label="Цены">
          <button type="button" :class="{ 'is-on': list.mode.value === 'opt' }" @click="list.mode.value = 'opt'">Опт</button>
          <button type="button" :class="{ 'is-on': list.mode.value === 'retail' }" @click="list.mode.value = 'retail'">
            Розница <small>+3&nbsp;%</small>
          </button>
        </div>
        <a :href="bpContacts.price" class="bp-xlsx" download>
          <BpIcon name="download" :size="20" />
          <span>Прайс .xlsx<small>от {{ bpContacts.priceDate }}</small></span>
        </a>
      </div>
    </header>

    <main class="bp-main">
      <NuxtPage />
    </main>

    <footer class="bp-footer">
      <div class="bp-wrap bp-footer__grid">
        <div class="bp-footer__brand">
          <img src="/redesign/baltikprodukt/logo.png" alt="Балтик продукт" width="350" height="230" />
          <p>Свежемороженая рыба, креветки, икра, копчёная и солёная рыба, пресервы и консервы оптом и в розницу. Холодильные камеры −25&nbsp;°C.</p>
        </div>
        <div>
          <h3>Прайс</h3>
          <ul>
            <li v-for="s in bpSections" :key="s.id"><NuxtLink :to="bpSectionPath(s.id)">{{ s.title }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3>Покупателям</h3>
          <ul>
            <li><NuxtLink :to="bpPath('/contacts')">Оплата и доставка</NuxtLink></li>
            <li><NuxtLink :to="bpPath('/about')">О компании</NuxtLink></li>
            <li><NuxtLink :to="{ path: bpPath('/about'), hash: '#faq' }">Вопросы и ответы</NuxtLink></li>
            <li><NuxtLink :to="{ path: bpPath('/about'), hash: '#reviews' }">Отзывы</NuxtLink></li>
            <li><NuxtLink :to="bpPath('/vacancy')">Вакансии</NuxtLink></li>
            <li><a :href="bpContacts.price" download>Оптовый прайс .xlsx</a></li>
          </ul>
        </div>
        <div class="bp-footer__contacts">
          <h3>Контакты</h3>
          <a v-for="ph in bpContacts.phones.slice(0, 2)" :key="ph.href" :href="ph.href" class="bp-footer__phone">{{ ph.label }}</a>
          <a :href="`mailto:${bpContacts.email}`">{{ bpContacts.email }}</a>
          <p>{{ bpContacts.address }}</p>
          <p>Пн–пт 8–18, сб 8–16, вс 8–14</p>
          <a :href="bpContacts.max" target="_blank" rel="noopener" class="bp-footer__max"><BpIcon name="max" :size="18" />Канал в MAX</a>
        </div>
      </div>
      <div class="bp-wrap bp-footer__legal">
        <p>© 1995–{{ year }} ООО «Балтик Продукт». Тексты, цены и изображения принадлежат владельцу сайта baltikprodukt.ru.</p>
        <p>Концепт редизайна — <a href="https://andryushov.me/redesign/">andryushov.me</a></p>
      </div>
    </footer>

    <NuxtLink v-if="list.count.value && !isList" :to="bpPath('/list')" class="bp-bar">
      <span class="bp-bar__count">{{ list.count.value }} поз.</span>
      <b>{{ bpMoney0(list.total.value) }}</b>
      <span class="bp-bar__go">Список <BpIcon name="arrow" :size="18" /></span>
    </NuxtLink>

    <div v-if="ui.menu.value" class="bp-drawer" @click.self="ui.menu.value = false">
      <aside class="bp-drawer__panel" aria-label="Меню">
        <div class="bp-drawer__head">
          <b>Меню</b>
          <button type="button" class="bp-iconbtn" aria-label="Закрыть" @click="ui.menu.value = false"><BpIcon name="close" /></button>
        </div>
        <nav class="bp-drawer__nav">
          <NuxtLink v-for="n in nav" :key="n.to" :to="n.to">{{ n.label }}</NuxtLink>
          <NuxtLink :to="bpPath('/list')">Список заказа<template v-if="list.count.value"> · {{ list.count.value }}</template></NuxtLink>
          <NuxtLink :to="bpPath('/vacancy')">Вакансии</NuxtLink>
        </nav>
        <p class="bp-drawer__label">Разделы прайса</p>
        <nav class="bp-drawer__sections">
          <NuxtLink v-for="s in bpSections" :key="s.id" :to="bpSectionPath(s.id)">
            <img :src="bpImg(s.img)" alt="" width="40" height="40" />
            <span>{{ s.title }}</span>
            <small>{{ s.count }}</small>
          </NuxtLink>
        </nav>
        <div class="bp-drawer__contacts">
          <a v-for="ph in bpContacts.phones.slice(0, 2)" :key="ph.href" :href="ph.href">{{ ph.label }}</a>
          <a :href="`mailto:${bpContacts.email}`">{{ bpContacts.email }}</a>
          <a :href="bpContacts.max" target="_blank" rel="noopener">Канал в MAX</a>
          <a :href="bpContacts.price" download>Скачать прайс .xlsx</a>
        </div>
      </aside>
    </div>

    <div v-if="ui.photo.value" class="bp-lightbox" @click.self="ui.photo.value = null">
      <figure>
        <button type="button" class="bp-iconbtn" aria-label="Закрыть" @click="ui.photo.value = null"><BpIcon name="close" /></button>
        <img :src="bpImg(ui.photo.value.img!)" :alt="ui.photo.value.name" />
        <figcaption>{{ ui.photo.value.name }}</figcaption>
      </figure>
    </div>

    <Transition name="bp-fade">
      <p v-if="ui.toast.value" class="bp-toast" role="status">{{ ui.toast.value }}</p>
    </Transition>
  </div>
</template>

<style lang="scss">
.bp-body {
  background: #fff;
}
// якоря (#faq, #reviews) не прячутся под липкую шапку
html.bp-html {
  scroll-padding-top: 110px;
}

.bp {
  --bp-accent: #2f5aa8;
  --bp-accent-dark: #244a8e;
  --bp-soft: #e7eef9;
  --bp-ink: #1f3340;
  --bp-muted: #5f707b;
  --bp-surface: #eef2f6;
  --bp-line: #dfe5eb;
  --bp-red: #d1352b;
  --bp-green: #19804a;
  --bp-green-soft: #e3f3e9;
  --bp-r: 12px;
  --bp-R: 22px;
  // всплывающие панели поверх белой шапки: рамка + короткая плотная и длинная мягкая тень
  --bp-pop: 0 2px 6px rgba(20, 40, 60, 0.08), 0 22px 54px rgba(20, 40, 60, 0.24);
  min-height: 100vh;
  background: #fff;
  color: var(--bp-ink);
  font-family: Inter, system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;

  &.has-bar {
    @media (max-width: 768px) {
      padding-bottom: 76px;
    }
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

:where(.bp) h1,
:where(.bp) h2,
:where(.bp) h3,
:where(.bp) p,
:where(.bp) figure {
  margin: 0;
}
:where(.bp) h1,
:where(.bp) h2,
:where(.bp) h3 {
  font-family: 'Inter Tight', Inter, sans-serif;
  color: var(--bp-ink);
  letter-spacing: -0.01em;
}
:where(.bp) a {
  color: inherit;
  text-decoration: none;
}
:where(.bp) img {
  display: block;
  max-width: 100%;
}
:where(.bp) button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  border: 0;
  background: none;
  padding: 0;
}
:where(.bp) input,
:where(.bp) textarea,
:where(.bp) select {
  font: inherit;
  color: inherit;
}
:where(.bp) ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.bp-wrap {
  width: 100%;
  max-width: 1360px;
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

.bp-section {
  padding-top: 64px;

  @media (max-width: 768px) {
    padding-top: 44px;
  }
}
.bp-h2 {
  font-size: clamp(24px, 2.4vw, 34px);
  font-weight: 800;
  line-height: 1.15;
}
.bp-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  p {
    color: var(--bp-muted);
    margin-top: 6px;
  }
}
.bp-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--bp-accent);
  font-weight: 600;
  white-space: nowrap;

  &:hover {
    color: var(--bp-accent-dark);
  }
}

/* Кнопки */
.bp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: var(--bp-r);
  background: var(--bp-accent);
  color: #fff;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: var(--bp-accent-dark);
  }
  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
  &--soft {
    background: var(--bp-soft);
    color: var(--bp-accent);

    &:hover {
      background: #d7e3f5;
      color: var(--bp-accent-dark);
    }
  }
  &--line,
  &--line:focus,
  &--line:active {
    background: #fff;
    color: var(--bp-ink);
    border: 1px solid var(--bp-line);

    &:hover {
      background: #fff;
      border-color: var(--bp-accent);
      color: var(--bp-accent);
    }
  }
}
.bp-iconbtn {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--bp-r);
  color: var(--bp-ink);

  &:hover {
    background: var(--bp-surface);
  }
}

/* Баннер концепта */
.bp-banner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
  padding: 8px 16px;
  background: var(--bp-ink);
  color: #dfe8ee;
  font-size: 13px;
  text-align: center;

  a {
    color: #fff;
    font-weight: 600;
    text-decoration: underline;
  }
}

/* Шапка */
.bp-header {
  position: sticky;
  z-index: 30;
  background: #fff;
  border-bottom: 1px solid var(--bp-line);
  transition: box-shadow 0.2s;

  &.is-stuck {
    box-shadow: 0 6px 20px rgba(20, 40, 60, 0.1);
  }
  .bp-listbtn.bp-header__stucklist {
    display: none;
    flex: none;
  }
  &.is-stuck .bp-listbtn.bp-header__stucklist {
    display: inline-flex;
  }

  &__top {
    display: flex;
    align-items: center;
    gap: 28px;
    min-height: 84px;
  }
  &__burger {
    display: none;
    margin-left: -10px;
  }
  &__right {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-left: auto;
  }
  &__call {
    display: none;
  }
  &__search {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding-bottom: 18px;

  }
  &__find {
    display: flex;
    gap: 10px;
    flex: 1;
    min-width: 0;

    .bp-search {
      flex: 1;
      min-width: 0;
    }
    .bp-listbtn {
      height: 56px;
    }
  }

  @media (max-width: 1199px) {
    &__top {
      gap: 20px;
    }
    &__call {
      display: inline-grid;
      background: var(--bp-surface);
    }
    .bp-phone {
      display: none;
    }
  }
  @media (max-width: 989px) {
    &__burger {
      display: inline-grid;
    }
    &__top {
      gap: 8px;
      min-height: 68px;
    }
    &__right {
      gap: 8px;
    }
  }
  @media (max-width: 768px) {
    &__search {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px;
      padding-bottom: 12px;

      .bp-mode {
        grid-row: 1;
        justify-self: start;
      }
      .bp-xlsx {
        grid-row: 1;
        grid-column: 2;
      }
    }
    &__find {
      grid-row: 2;
      grid-column: 1 / -1;
    }
    .bp-listbtn.bp-header__stucklist {
      width: 50px;
      height: 50px;
      padding: 0;
      justify-content: center;

      .bp-listbtn__label {
        display: none;
      }
    }
  }
}

.bp-mark {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: none;

  img {
    width: 82px;
    height: auto;
  }
  &__sub {
    font-size: 13px;
    line-height: 1.3;
    color: var(--bp-muted);
  }

  @media (max-width: 1400px) {
    &__sub {
      display: none;
    }
  }
  @media (max-width: 989px) {
    img {
      width: 66px;
    }
  }
}

.bp-nav {
  display: flex;
  gap: 4px;

  &__cat {
    position: relative;

    .bp-nav__link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  }
  &__drop {
    position: absolute;
    top: 100%;
    left: -12px;
    z-index: 45;
    display: grid;
    grid-template-columns: repeat(2, 300px);
    gap: 2px 8px;
    margin-top: 8px;
    padding: 12px;
    border: 1px solid var(--bp-line);
    border-radius: 18px;
    background: #fff;
    box-shadow: var(--bp-pop);

    &::before {
      content: '';
      position: absolute;
      inset: -10px 0 auto;
      height: 10px;
    }
    a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 10px 6px 6px;
      border-radius: 12px;
      font-weight: 500;

      &:hover {
        background: var(--bp-surface);
        color: var(--bp-accent);
      }
    }
    img {
      flex: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    span {
      flex: 1;
      white-space: nowrap;
    }
    small {
      color: var(--bp-muted);
    }
  }

  &__link {
    padding: 10px 14px;
    border-radius: var(--bp-r);
    font-weight: 600;
    white-space: nowrap;

    &:hover {
      background: var(--bp-surface);
    }
    &.router-link-active {
      color: var(--bp-accent);
      background: var(--bp-soft);
    }
  }

  @media (max-width: 989px) {
    display: none;
  }
}

.bp-phone {
  display: grid;
  text-align: right;
  line-height: 1.25;

  a {
    font-weight: 700;
    font-size: 17px;
    white-space: nowrap;
  }
  small {
    color: var(--bp-muted);
    font-size: 13px;
  }
}

.bp-maxbtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 16px;
  border-radius: var(--bp-r);
  background: var(--bp-soft);
  color: var(--bp-accent);
  font-weight: 600;
  white-space: nowrap;

  &:hover {
    background: #d7e3f5;
  }

  @media (max-width: 1199px) {
    width: 44px;
    height: 44px;
    padding: 0;
    justify-content: center;

    span {
      display: none;
    }
  }
}

.bp-listbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 160px;
  height: 48px;
  padding: 0 16px;
  border-radius: var(--bp-r);
  background: var(--bp-surface);
  font-weight: 700;
  white-space: nowrap;

  &.is-full {
    background: var(--bp-accent);
    color: #fff;
  }
  &.router-link-active:not(.is-full) {
    background: var(--bp-soft);
    color: var(--bp-accent);
  }
  &__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 576px) {
    width: 48px;
    padding: 0;
    justify-content: center;

    &__label {
      display: none;
    }
  }
}
.bp-dot {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  background: var(--bp-red);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 22px;
  text-align: center;
}

/* Поиск */
.bp-search {
  position: relative;

  &__form {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 56px;
    padding: 0 6px 0 18px;
    border: 2px solid var(--bp-accent);
    border-radius: 16px;
    background: #fff;

    input {
      flex: 1;
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
  }
  &__ico {
    flex: none;
    color: var(--bp-accent);
  }
  &__clear {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: var(--bp-muted);

    &:hover {
      background: var(--bp-surface);
    }
  }
  &__go {
    min-height: 42px;
  }
  &__drop {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: 40;
    max-height: min(560px, 70vh);
    overflow: auto;
    padding: 8px;
    border: 1px solid var(--bp-line);
    border-radius: 18px;
    background: #fff;
    box-shadow: var(--bp-pop);
  }
  &__hit {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 14px;
    padding: 10px 12px;
    border-radius: 12px;

    &:hover {
      background: var(--bp-surface);
    }
    b {
      display: block;
      font-weight: 600;
      line-height: 1.3;
    }
    small {
      color: var(--bp-muted);
      font-size: 13px;
    }
  }
  &__price {
    font-weight: 700;
    white-space: nowrap;
  }
  &__all {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    margin-top: 4px;
    padding: 12px;
    border-radius: 12px;
    color: var(--bp-accent);
    font-weight: 600;

    &:hover {
      background: var(--bp-soft);
    }
  }
  &__none {
    padding: 14px;
    color: var(--bp-muted);

    a {
      color: var(--bp-accent);
      font-weight: 600;
      white-space: nowrap;
    }
  }
  &__quick {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;

    button {
      padding: 7px 14px;
      border-radius: 20px;
      background: var(--bp-surface);
      font-size: 14px;
      font-weight: 500;

      &:hover {
        background: var(--bp-soft);
        color: var(--bp-accent);
      }
    }
  }

  @media (max-width: 576px) {
    &__form {
      height: 50px;
      padding-left: 14px;
    }
    &__go {
      display: none;
    }
    &__hit {
      grid-template-columns: minmax(0, 1fr) auto;

      .bp-buy {
        grid-column: 1 / -1;
      }
    }
  }
}

.bp-mode {
  display: flex;
  flex: none;
  height: 56px;
  padding: 4px;
  border-radius: 16px;
  background: var(--bp-surface);

  button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 16px;
    border-radius: 12px;
    font-weight: 600;
    white-space: nowrap;
    color: var(--bp-muted);

    small {
      font-size: 13px;
      font-weight: 500;
    }
    &.is-on {
      background: #fff;
      color: var(--bp-ink);
      box-shadow: 0 1px 3px rgba(20, 40, 60, 0.14);
    }
  }

  @media (max-width: 768px) {
    height: 44px;
    border-radius: 12px;

    button {
      border-radius: 9px;
    }
  }
}
.bp-xlsx {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  height: 56px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid var(--bp-line);
  color: var(--bp-green);
  font-weight: 600;
  line-height: 1.2;

  span {
    display: grid;
    color: var(--bp-ink);
  }
  small {
    color: var(--bp-muted);
    font-size: 12px;
    font-weight: 500;
  }
  &:hover {
    border-color: var(--bp-green);
  }

  @media (max-width: 1199px) {
    small {
      display: none;
    }
  }
  @media (max-width: 768px) {
    height: 44px;
    margin-left: auto;
    border-radius: 12px;
  }
}

/* Счётчик и добавление */
.bp-buy {
  display: flex;
  align-items: center;
  gap: 8px;

  &__add {
    width: 100%;
    min-height: 44px;
  }
  &__box {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 4px;
    color: var(--bp-accent);
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;

    &:hover {
      color: var(--bp-accent-dark);
    }
  }
  &--small {
    .bp-buy__add {
      min-height: 38px;
      padding: 0 14px;
    }
    .bp-qty {
      height: 38px;
    }
  }
}
.bp-qty {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 38px;
  align-items: center;
  flex: 1 1 128px;
  min-width: 0;
  height: 44px;
  border-radius: var(--bp-r);
  background: var(--bp-green-soft);
  color: var(--bp-green);

  > button {
    display: grid;
    place-items: center;
    height: 100%;
    border-radius: var(--bp-r);

    &:hover {
      background: #cfeadb;
    }
  }
  > label {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 3px;
    min-width: 0;
    padding: 0 6px;
    font-weight: 700;
    color: var(--bp-ink);

    input {
      max-width: 7ch;
      min-width: 1.6ch;
      padding: 0;
      border: 0;
      outline: 0;
      background: none;
      text-align: center;
      font-weight: 700;
    }
    span {
      font-size: 13px;
      font-weight: 500;
      color: var(--bp-muted);
    }
  }
}

/* Метки */
.bp-flag {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;

  &--sale {
    background: var(--bp-red);
    color: #fff;
  }
  &--new {
    background: var(--bp-accent);
    color: #fff;
  }
  &--order {
    background: #fff2d6;
    color: #8a5a00;
  }
  &--wait {
    background: var(--bp-surface);
    color: var(--bp-muted);
  }
}

/* Строка прайса */
.bp-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px 236px;
  align-items: center;
  gap: 20px;
  padding: 14px 18px;
  border-radius: 16px;
  background: #fff;
  transition: background 0.15s;

  &:hover {
    background: #f7f9fb;
  }
  &.is-in {
    background: #f3f9f5;
  }
  &__main {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }
  &__photo {
    flex: none;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--bp-line);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.2s;
    }
    &:hover img {
      transform: scale(1.08);
    }
  }
  &__text {
    min-width: 0;
  }
  &__name {
    font-family: Inter, sans-serif;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: 0;
  }
  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 12px;
    margin-top: 4px;
    color: var(--bp-muted);
    font-size: 13px;
  }
  &__pack {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  &__price {
    text-align: right;
  }
  &__cost {
    white-space: nowrap;

    b {
      font-size: 18px;
      font-weight: 700;
    }
    small {
      margin-left: 4px;
      color: var(--bp-muted);
      font-size: 13px;
    }
  }
  &__boxprice {
    color: var(--bp-muted);
    font-size: 13px;
    white-space: nowrap;

    b {
      color: var(--bp-ink);
    }
    &.is-on,
    &.is-on b {
      color: var(--bp-green);
    }
  }
  &__ask {
    color: var(--bp-muted);
    font-weight: 600;
  }
  &__buy {
    display: grid;
    gap: 4px;
    min-width: 0;

    .bp-buy {
      flex-wrap: wrap;
      row-gap: 6px;
    }
  }
  &__hint {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--bp-muted);
    font-size: 12px;
    line-height: 1.3;

    &.is-on {
      color: var(--bp-green);
      font-weight: 600;
    }
  }
  &.is-muted &__name {
    color: var(--bp-muted);
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr) 160px 210px;
    gap: 16px;
  }
  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas: 'main main' 'price buy';
    gap: 10px 14px;
    padding: 14px;

    &__main {
      grid-area: main;
      align-items: flex-start;
    }
    &__price {
      grid-area: price;
      text-align: left;
    }
    &__buy {
      grid-area: buy;
    }
    &__photo {
      width: 48px;
      height: 48px;
    }
  }
  @media (max-width: 375px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'main' 'price' 'buy';
  }
}

/* Плитки разделов */
.bp-tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(236px, 1fr));
  gap: 12px;

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
}
.bp-tile {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 84px;
  padding: 12px 16px 12px 12px;
  border-radius: 18px;
  background: var(--bp-surface);
  transition: background 0.15s;

  img {
    flex: none;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.2s;
  }
  > span {
    min-width: 0;
  }
  b {
    display: block;
    font-weight: 600;
    line-height: 1.25;
    hyphens: auto;
    overflow-wrap: break-word;
  }
  small {
    color: var(--bp-muted);
    font-size: 13px;
  }
  &:hover {
    background: var(--bp-soft);

    img {
      transform: scale(1.06);
    }
  }

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;

    img {
      width: 52px;
      height: 52px;
    }
    b {
      font-size: 14px;
    }
  }
}

/* Поля форм */
.bp-field {
  display: grid;
  gap: 6px;

  > span {
    font-size: 13px;
    font-weight: 600;
    color: var(--bp-muted);
  }
  input,
  textarea {
    width: 100%;
    min-width: 0;
    padding: 12px 14px;
    border: 1px solid var(--bp-line);
    border-radius: var(--bp-r);
    background: #fff;
    outline: 0;

    &:focus {
      border-color: var(--bp-accent);
    }
  }
  textarea {
    resize: vertical;
    min-height: 84px;
  }
}
.bp-seg {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  padding: 4px;
  border-radius: 14px;
  background: var(--bp-surface);

  button {
    min-height: 40px;
    padding: 0 10px;
    border-radius: 10px;
    font-weight: 600;
    color: var(--bp-muted);
    white-space: nowrap;

    &.is-on {
      background: #fff;
      color: var(--bp-ink);
      box-shadow: 0 1px 3px rgba(20, 40, 60, 0.14);
    }
  }
}

/* Подвал */
.bp-footer {
  margin-top: 88px;
  padding: 56px 0 28px;
  background: var(--bp-surface);

  &__grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr 1fr;
    gap: 32px;
  }
  &__brand {
    img {
      width: 110px;
      height: auto;
      margin-bottom: 14px;
    }
    p {
      max-width: 34ch;
      color: var(--bp-muted);
    }
  }
  h3 {
    margin-bottom: 14px;
    font-size: 16px;
    font-weight: 700;
  }
  ul {
    display: grid;
    gap: 6px;
  }
  a:hover {
    color: var(--bp-accent);
  }
  &__contacts {
    display: grid;
    align-content: start;
    gap: 6px;

    p {
      color: var(--bp-muted);
    }
  }
  &__phone {
    font-weight: 700;
    font-size: 17px;
  }
  &__max {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    font-weight: 600;
  }
  &__legal {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px 24px;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid var(--bp-line);
    color: var(--bp-muted);
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
    margin-top: 64px;

    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }
  }
}

/* Нижняя полоса списка (телефон) */
.bp-bar {
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    left: 20px;
    right: 20px;
    bottom: 12px;
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 12px;
    height: 56px;
    padding: 0 8px 0 18px;
    border-radius: 16px;
    background: var(--bp-accent);
    color: #fff;
    box-shadow: 0 10px 30px rgba(20, 40, 80, 0.3);

    b {
      font-size: 17px;
      white-space: nowrap;
    }
  }
  @media (max-width: 375px) {
    left: 14px;
    right: 14px;
  }
  &__count {
    opacity: 0.85;
    white-space: nowrap;
  }
  &__go {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 42px;
    margin-left: auto;
    padding: 0 14px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.16);
    font-weight: 600;
    white-space: nowrap;
  }
}

/* Меню */
.bp-drawer {
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(15, 30, 40, 0.4);

  &__panel {
    width: min(380px, 92vw);
    height: 100%;
    overflow: auto;
    padding: 12px 20px 28px;
    background: #fff;
  }
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    b {
      font-size: 18px;
    }
  }
  &__nav {
    display: grid;

    a {
      padding: 12px 0;
      border-bottom: 1px solid var(--bp-line);
      font-size: 17px;
      font-weight: 600;
    }
  }
  &__label {
    margin: 22px 0 8px;
    color: var(--bp-muted);
    font-size: 13px;
    font-weight: 600;
  }
  &__sections {
    display: grid;
    gap: 2px;

    a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 8px;
      border-radius: 12px;

      &:hover {
        background: var(--bp-surface);
      }
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    span {
      flex: 1;
      font-weight: 500;
    }
    small {
      color: var(--bp-muted);
    }
  }
  &__contacts {
    display: grid;
    gap: 8px;
    margin-top: 22px;
    padding: 16px;
    border-radius: 16px;
    background: var(--bp-surface);

    a {
      font-weight: 600;
    }
  }
}

/* Фото товара */
.bp-lightbox {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(15, 30, 40, 0.7);

  figure {
    position: relative;
    max-width: min(760px, 100%);
    padding: 12px;
    border-radius: 22px;
    background: #fff;
  }
  img {
    max-height: 75vh;
    margin: 0 auto;
    border-radius: 14px;
  }
  figcaption {
    padding: 12px 6px 4px;
    font-weight: 600;
  }
  .bp-iconbtn {
    position: absolute;
    top: 18px;
    right: 18px;
    background: #fff;
  }
}

/* Общие блоки страниц */
.bp-rows {
  display: grid;
  gap: 4px;
  padding: 8px;
  border: 1px solid var(--bp-line);
  border-radius: var(--bp-R);

  @media (max-width: 768px) {
    padding: 4px;
  }
}
.bp-reviews {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.bp-review {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 24px;
  border: 1px solid var(--bp-line);
  border-radius: 18px;

  p {
    color: var(--bp-ink);
  }
  footer {
    margin-top: auto;
    font-weight: 700;
  }
}
.bp-map {
  position: relative;
  min-height: 380px;
  overflow: hidden;
  border-radius: var(--bp-R);
  background: var(--bp-surface);

  &__pin {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 8px;
    color: var(--bp-accent);
    font-weight: 600;
    text-align: center;
    padding: 20px;

    span {
      color: var(--bp-ink);
    }
  }
  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
  &__link {
    position: absolute;
    left: 50%;
    bottom: 16px;
    transform: translateX(-50%);
    white-space: nowrap;
    padding: 10px 14px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(20, 40, 60, 0.15);
    color: var(--bp-accent);
    font-weight: 600;
    font-size: 14px;
  }

  @media (max-width: 576px) {
    min-height: 300px;
  }
}

.bp-ico {
  display: grid;
  place-items: center;
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #fff;
  color: var(--bp-accent);
}
.bp-hours {
  display: grid;
  gap: 8px;
  margin: 20px 0 28px;

  li {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--bp-line);
  }
  span {
    color: var(--bp-muted);
  }
}
ul.bp-hours {
  margin: 20px 0 28px;
}

/* Окно с формой (резюме) */
.bp-modal {
  position: fixed;
  inset: 0;
  z-index: 85;
  display: grid;
  place-items: center;
  padding: 16px;
  overflow-y: auto;
  background: rgba(15, 30, 40, 0.5);

  &__panel {
    display: grid;
    gap: 14px;
    width: min(560px, 100%);
    padding: 28px;
    border-radius: var(--bp-R);
    background: #fff;
  }
  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;

    h2 {
      font-size: 24px;
      font-weight: 800;
    }
    p {
      margin-top: 2px;
      color: var(--bp-muted);
    }
    .bp-iconbtn {
      margin: -8px -8px 0 0;
    }
  }
  &__two {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 14px;
  }
  &__done {
    display: grid;
    justify-items: start;
    gap: 10px;
    padding: 8px 0;

    .bp-ico {
      background: var(--bp-green-soft);
      color: var(--bp-green);
    }
    b {
      font-size: 18px;
    }
    p {
      color: var(--bp-muted);
    }
  }

  @media (max-width: 576px) {
    place-items: end center;
    padding: 0;

    &__panel {
      padding: 22px 16px 24px;
      border-radius: var(--bp-R) var(--bp-R) 0 0;
    }
    &__two {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
.bp-file {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 2px 10px;
  padding: 14px 16px;
  border: 1px dashed #b9c6d3;
  border-radius: var(--bp-r);
  color: var(--bp-accent);
  cursor: pointer;

  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  span {
    overflow: hidden;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  small {
    grid-column: 2;
    color: var(--bp-muted);
    font-size: 13px;
  }
  &:hover {
    border-color: var(--bp-accent);
  }
}
.bp-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: var(--bp-muted);
  cursor: pointer;

  input {
    flex: none;
    width: 18px;
    height: 18px;
    margin: 1px 0 0;
    accent-color: var(--bp-accent);
  }
}

.bp-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 95;
  width: max-content;
  max-width: calc(100vw - 32px);
  padding: 14px 20px;
  border-radius: 14px;
  background: var(--bp-ink);
  color: #fff;
  transform: translateX(-50%);

  @media (max-width: 768px) {
    bottom: 80px;
  }
}
.bp-fade-enter-active,
.bp-fade-leave-active {
  transition: opacity 0.2s;
}
.bp-fade-enter-from,
.bp-fade-leave-to {
  opacity: 0;
}
</style>
