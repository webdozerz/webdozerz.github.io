<script lang="ts" setup>
import RkIcon from '~/components/redesign/rkdon/RkIcon.vue'

const route = useRoute()
const ui = useRkdonUi()
const stuck = ref(false)
const scrolled = ref(false)
const chatText = ref('')

useSeoMeta({
  title: 'Рыбокомбинат Донской — рыбные снеки и кальмар оптом от производителя | Концепт редизайна',
  description:
    'Концепт редизайна сайта АО «Рыбокомбинат Донской»: 32 позиции весовой рыбы и кальмара с составом и сроком годности, ТМ «Тиксы», производство под маркой сетей, новости и вакансии.',
  ogTitle: 'Рыбокомбинат Донской — концепт редизайна',
  ogDescription: 'Сушёно-вяленые снеки из кальмара и рыбы с Дона: весовая продукция коробами по 10 кг, своя марка для сетей и «Тиксы».',
  ogImage: 'https://andryushov.me/redesign/rkdon/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'rk-html', lang: 'ru' },
  bodyAttrs: { class: 'rk-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Mulish:wght@400;500;600;700;800&display=swap',
    },
  ],
})

const nav = [
  { to: '/company', title: 'Компания' },
  { to: '/products', title: 'Рыбные снеки' },
  { to: '/tixy', title: 'Тиксы' },
  { to: '/stm', title: 'СТМ', full: 'Собственная торговая марка' },
  { to: '/news', title: 'Новости' },
  { to: '/vacancies', title: 'Вакансии' },
  { to: '/contacts', title: 'Контакты' },
]
const is = (p: string) => route.path.startsWith(rkPath(p))
const year = new Date().getFullYear()

const onScroll = () => {
  stuck.value = window.scrollY > 40
  scrolled.value = window.scrollY > window.innerHeight * 0.7
}
const sendChat = () => {
  const t = chatText.value.trim()
  if (!t) return
  ui.chatLog.value.push({ from: 'me', text: t })
  ui.chatLog.value.push({
    from: 'op',
    text: 'Это демо: в концепте сообщения никуда не уходят. На сайте здесь работает ваш чат Битрикс24 — тот же оператор, тот же журнал.',
  })
  chatText.value = ''
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
watch(
  () => route.fullPath,
  () => ui.closeAll(),
)
watch(
  () => ui.menu.value || ui.sales.value,
  (v) => import.meta.client && document.documentElement.classList.toggle('rk-lock', v),
)
</script>

<template>
  <div class="rk">
    <div class="rk-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="rkContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="rk-header" :class="{ 'is-stuck': stuck }">
      <div class="rk-header__top">
        <div class="rk-wrap rk-header__toprow">
          <span class="rk-header__motto">Произведено на Дону · {{ rkContacts.addressShort }}</span>
          <div class="rk-header__toplinks">
            <a :href="'mailto:' + rkContacts.email">{{ rkContacts.email }}</a>
            <a :href="rkContacts.vk" target="_blank" rel="noopener" aria-label="ВКонтакте «Тиксы»"><RkIcon name="vk" :size="20" /></a>
            <span class="rk-lang"><b>RU</b><a :href="rkContacts.eng" target="_blank" rel="noopener">ENG</a></span>
          </div>
        </div>
      </div>
      <div class="rk-wrap rk-header__row">
        <button type="button" class="rk-iconbtn rk-header__burger" aria-label="Меню" @click="ui.menu.value = true">
          <RkIcon name="menu" />
        </button>
        <NuxtLink :to="rkPath('/')" class="rk-logo" aria-label="Рыбокомбинат Донской — на главную">
          <img :src="rkImg('logo.svg')" alt="Рыбокомбинат Донской" width="180" height="41" />
        </NuxtLink>
        <nav class="rk-nav" aria-label="Разделы сайта">
          <NuxtLink
            v-for="n in nav"
            :key="n.to"
            :to="rkPath(n.to)"
            class="rk-nav__item"
            :class="{ 'is-active': is(n.to) }"
            :title="n.full"
            >{{ n.title }}</NuxtLink
          >
        </nav>
        <div class="rk-header__sales">
          <a :href="'tel:' + rkContacts.salesTel" class="rk-header__phone">
            <b>{{ rkContacts.sales }}</b>
            <small>отдел продаж</small>
          </a>
          <a :href="'tel:' + rkContacts.salesTel" class="rk-iconbtn rk-header__call" aria-label="Позвонить в отдел продаж">
            <RkIcon name="phone" />
          </a>
          <a :href="rkMail('Запрос в отдел продаж')" class="rk-btn rk-btn--main rk-header__write">Написать</a>
        </div>
      </div>
    </header>

    <main class="rk-main">
      <NuxtPage />
    </main>

    <footer class="rk-footer">
      <div class="rk-wrap rk-footer__grid">
        <div class="rk-footer__brand">
          <img :src="rkImg('logo.svg')" alt="Рыбокомбинат Донской" width="200" height="46" />
          <p>Сушёно-вяленые снеки из кальмара и рыбы. Производство в Новошахтинске, Ростовская область.</p>
          <div class="rk-footer__social">
            <a :href="rkContacts.vk" target="_blank" rel="noopener" aria-label="ВКонтакте"><RkIcon name="vk" /></a>
            <a :href="rkContacts.instagram" target="_blank" rel="noopener" aria-label="Instagram"><RkIcon name="instagram" /></a>
            <span class="rk-lang"><b>RU</b><a :href="rkContacts.eng" target="_blank" rel="noopener">ENG</a></span>
          </div>
        </div>
        <nav class="rk-footer__nav" aria-label="Разделы">
          <NuxtLink v-for="n in nav" :key="n.to" :to="rkPath(n.to)">{{ n.full || n.title }}</NuxtLink>
        </nav>
        <div class="rk-footer__contacts">
          <a :href="'tel:' + rkContacts.salesTel"
            ><b>{{ rkContacts.sales }}</b><small>отдел продаж</small></a
          >
          <a :href="'tel:' + rkContacts.secretaryTel"
            ><b>{{ rkContacts.secretary }}</b><small>секретарь</small></a
          >
          <a :href="'mailto:' + rkContacts.email"
            ><b>{{ rkContacts.email }}</b><small>почта</small></a
          >
          <span
            ><b>{{ rkContacts.addressShort }}</b><small>Ростовская область</small></span
          >
        </div>
      </div>
      <div class="rk-wrap rk-footer__bottom">
        <span>© 2017–{{ year }} АО «Рыбокомбинат Донской»</span>
        <span>Концепт редизайна. Тексты, фотографии, цены и товарные знаки принадлежат АО «Рыбокомбинат Донской».</span>
      </div>
    </footer>

    <!-- Телефон: одна плавающая кнопка «Отдел продаж», десктоп: кнопка чата, как у оригинала -->
    <button type="button" class="rk-float" :class="{ 'is-on': scrolled }" @click="ui.sales.value = true">
      <RkIcon name="phone" :size="20" /> Отдел продаж
    </button>
    <button type="button" class="rk-chatbtn" :class="{ 'is-on': scrolled && !ui.chat.value }" aria-label="Онлайн-чат" @click="ui.openChat()">
      <RkIcon name="chat" />
      <span>Онлайн-чат</span>
    </button>

    <Transition name="rk-fade">
      <div v-if="ui.menu.value || ui.sales.value" class="rk-shade" @click="ui.closeAll()" />
    </Transition>

    <aside class="rk-drawer" :class="{ 'is-open': ui.menu.value }" aria-label="Меню">
      <div class="rk-drawer__head">
        <b>Меню</b>
        <button type="button" class="rk-iconbtn" aria-label="Закрыть меню" @click="ui.menu.value = false"><RkIcon name="close" /></button>
      </div>
      <nav class="rk-drawer__nav">
        <NuxtLink :to="rkPath('/')" :class="{ 'is-active': route.path === rkPath('/') }">Главная</NuxtLink>
        <NuxtLink v-for="n in nav" :key="n.to" :to="rkPath(n.to)" :class="{ 'is-active': is(n.to) }">{{ n.full || n.title }}</NuxtLink>
      </nav>
      <div class="rk-drawer__foot">
        <a :href="'tel:' + rkContacts.salesTel" class="rk-btn rk-btn--main"><RkIcon name="phone" :size="18" /> {{ rkContacts.sales }}</a>
        <a :href="'mailto:' + rkContacts.email" class="rk-btn rk-btn--line"><RkIcon name="mail" :size="18" /> {{ rkContacts.email }}</a>
        <div class="rk-drawer__links">
          <span class="rk-lang"><b>RU</b><a :href="rkContacts.eng" target="_blank" rel="noopener">ENG</a></span>
          <a :href="rkContacts.vk" target="_blank" rel="noopener" aria-label="ВКонтакте"><RkIcon name="vk" /></a>
        </div>
      </div>
    </aside>

    <aside class="rk-sheet" :class="{ 'is-open': ui.sales.value }" aria-label="Отдел продаж">
      <div class="rk-sheet__head">
        <b>Отдел продаж</b>
        <button type="button" class="rk-iconbtn" aria-label="Закрыть" @click="ui.sales.value = false"><RkIcon name="close" /></button>
      </div>
      <p>Цены, фасовку и отгрузку подскажут менеджеры. Самовывоз — со склада в Новошахтинске.</p>
      <a :href="'tel:' + rkContacts.salesTel" class="rk-sheet__row">
        <RkIcon name="phone" /><span><b>{{ rkContacts.sales }}</b><small>позвонить в отдел продаж</small></span>
      </a>
      <a :href="rkMail('Запрос в отдел продаж')" class="rk-sheet__row">
        <RkIcon name="mail" /><span><b>{{ rkContacts.email }}</b><small>написать письмо</small></span>
      </a>
      <button type="button" class="rk-sheet__row" @click="ui.openChat()">
        <RkIcon name="chat" /><span><b>Онлайн-чат</b><small>ответит менеджер Андрей</small></span>
      </button>
    </aside>

    <Transition name="rk-pop">
      <section v-if="ui.chat.value" class="rk-chat" aria-label="Онлайн-чат">
        <div class="rk-chat__head">
          <span class="rk-chat__ava">А</span>
          <span><b>Андрей</b><small>менеджер · онлайн-чат</small></span>
          <button type="button" class="rk-iconbtn" aria-label="Закрыть чат" @click="ui.chat.value = false"><RkIcon name="close" /></button>
        </div>
        <div class="rk-chat__log">
          <p v-for="(m, i) in ui.chatLog.value" :key="i" :class="'is-' + m.from">{{ m.text }}</p>
        </div>
        <form class="rk-chat__form" @submit.prevent="sendChat">
          <input v-model="chatText" type="text" placeholder="Ваш вопрос" aria-label="Ваш вопрос" />
          <button type="submit" class="rk-iconbtn" aria-label="Отправить"><RkIcon name="send" :size="20" /></button>
        </form>
        <small class="rk-chat__demo">Демо: на сайте здесь останется ваш чат Битрикс24.</small>
      </section>
    </Transition>
  </div>
</template>

<style lang="scss">
.rk-html {
  scroll-padding-top: 96px;
}
.rk-html.rk-lock {
  overflow: hidden;
}
.rk-body {
  margin: 0;
  background: #fff;
}

.rk {
  --rk-accent: #8a0b36;
  --rk-accent-h: #6e0629;
  --rk-ink: #2a1118;
  --rk-text: #3c2c32;
  --rk-muted: #74666b;
  --rk-surface: #f3f2f5;
  --rk-soft: #f9eef2;
  --rk-line: #e7e3e7;
  --rk-squid: #0b7fb0;
  --rk-squid-bg: #e6f4fa;
  --rk-fish: #16834a;
  --rk-fish-bg: #e8f4ec;
  --rk-striped: #c26f00;
  --rk-r: 12px;
  --rk-R: 22px;
  --rk-head: 'Oswald', 'Arial Narrow', sans-serif;
  font-family: 'Mulish', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  color: var(--rk-text);
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}
:where(.rk) {
  h1,
  h2,
  h3,
  h4,
  p,
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
    height: auto;
  }
  button {
    font: inherit;
    color: inherit;
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
  }
  h1,
  h2,
  h3 {
    font-family: var(--rk-head);
    font-weight: 600;
    color: var(--rk-ink);
    line-height: 1.12;
    letter-spacing: 0.005em;
  }
}

.rk-wrap {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
}
.rk-main {
  flex: 1;
}

/* Баннер концепта */
.rk-banner {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 8px 16px;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;
  background: var(--rk-ink);
  color: #f3e6ea;
  a {
    color: #fff;
    text-decoration: underline;
    font-weight: 700;
  }
}

/* Кнопки */
.rk-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: var(--rk-r);
  font-weight: 700;
  font-size: 15px;
  white-space: nowrap;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
  &--main {
    background: var(--rk-accent);
    color: #fff;
    &:hover {
      background: var(--rk-accent-h);
    }
  }
  &--soft {
    background: var(--rk-soft);
    color: var(--rk-accent);
    &:hover {
      background: #f3dde5;
    }
  }
  &--line,
  &--line:focus,
  &--line:active {
    background: #fff;
    color: var(--rk-ink);
    border: 1px solid var(--rk-line);
  }
  &--line:hover {
    border-color: var(--rk-accent);
    color: var(--rk-accent);
  }
}
.rk-iconbtn {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--rk-r);
  color: var(--rk-ink);
  flex: none;
  &:hover {
    background: var(--rk-surface);
  }
}
.rk-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: var(--rk-accent);
  &:hover {
    color: var(--rk-accent-h);
  }
}
.rk-lang {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 13px;
  b,
  a {
    padding: 3px 7px;
    border-radius: 6px;
  }
  b {
    background: var(--rk-ink);
    color: #fff;
  }
  a:hover {
    color: var(--rk-accent);
  }
}

/* Шапка: верхняя строка уезжает, основная прилипает */
.rk-header {
  position: sticky;
  top: -37px;
  z-index: 40;
  background: #fff;
  border-bottom: 1px solid var(--rk-line);
  transition: box-shadow 0.2s;
  &.is-stuck {
    box-shadow: 0 6px 24px rgba(42, 17, 24, 0.07);
  }
  &__top {
    height: 37px;
    background: var(--rk-surface);
    font-size: 13px;
    color: var(--rk-muted);
  }
  &__toprow {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  &__motto {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
  &__toplinks {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: none;
    a:hover {
      color: var(--rk-accent);
    }
  }
  &__row {
    display: flex;
    align-items: center;
    gap: 24px;
    height: 76px;
  }
  &__burger {
    display: none;
    margin-left: -10px;
  }
  &__sales {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: auto;
    flex: none;
  }
  &__phone {
    display: grid;
    text-align: right;
    line-height: 1.2;
    white-space: nowrap;
    b {
      font-size: 17px;
      color: var(--rk-ink);
      font-variant-numeric: tabular-nums;
    }
    small {
      font-size: 12px;
      color: var(--rk-muted);
    }
    &:hover b {
      color: var(--rk-accent);
    }
  }
  &__call {
    display: none;
    color: var(--rk-accent);
  }
}
.rk-logo {
  flex: none;
  color: var(--rk-accent);
  img {
    width: 176px;
    height: auto;
  }
}
.rk-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  min-width: 0;
  &__item {
    padding: 8px 11px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 15px;
    color: var(--rk-ink);
    white-space: nowrap;
    transition:
      background 0.2s,
      color 0.2s;
    &:hover {
      color: var(--rk-accent);
    }
    &.is-active {
      background: var(--rk-soft);
      color: var(--rk-accent);
    }
  }
}

/* Общие блоки страниц */
.rk-section {
  padding-top: 72px;
  padding-bottom: 72px;
  &--tight {
    padding-top: 48px;
    padding-bottom: 48px;
  }
  &--surface {
    background: var(--rk-surface);
  }
}
.rk-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 32px;
  flex-wrap: wrap;
  margin-bottom: 32px;
  h2 {
    font-size: clamp(28px, 3.2vw, 40px);
  }
  p {
    max-width: 620px;
    margin-top: 10px;
    color: var(--rk-muted);
    font-size: 16px;
  }
}
.rk-pagehead {
  padding-top: 40px;
  padding-bottom: 32px;
  h1 {
    font-size: clamp(34px, 4.4vw, 54px);
  }
  p.rk-pagehead__lead {
    max-width: 720px;
    margin-top: 14px;
    font-size: 17px;
    color: var(--rk-muted);
  }
}
.rk-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--rk-muted);
  a:hover {
    color: var(--rk-accent);
  }
  span::before {
    content: '/';
    margin-right: 6px;
  }
}
.rk-kind {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 6px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
  white-space: nowrap;
  img {
    width: 26px;
    height: 20px;
    object-fit: contain;
  }
  &--squid {
    background: var(--rk-squid-bg);
    color: var(--rk-squid);
  }
  &--fish {
    background: var(--rk-fish-bg);
    color: var(--rk-fish);
  }
}
.rk-tabs {
  display: flex;
  gap: 6px;
  padding: 5px;
  border-radius: 14px;
  background: var(--rk-surface);
  width: max-content;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  &__item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 16px;
    border-radius: 10px;
    font-weight: 700;
    white-space: nowrap;
    color: var(--rk-ink);
    small {
      font-weight: 600;
      color: var(--rk-muted);
    }
    &:hover {
      color: var(--rk-accent);
    }
    &.is-active {
      background: #fff;
      color: var(--rk-accent);
      box-shadow: 0 1px 4px rgba(42, 17, 24, 0.08);
    }
  }
}
.rk-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px 24px;
  li {
    display: grid;
    gap: 2px;
  }
  b {
    font-family: var(--rk-head);
    font-weight: 600;
    font-size: 30px;
    line-height: 1.1;
    color: var(--rk-accent);
  }
  span {
    font-size: 14px;
    color: var(--rk-muted);
  }
}
.rk-prose {
  display: grid;
  gap: 14px;
  font-size: 16px;
  max-width: 760px;
}

/* Подвал */
.rk-footer {
  margin-top: 24px;
  background: var(--rk-surface);
  padding-top: 56px;
  &__grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1.2fr;
    gap: 40px;
  }
  &__brand {
    display: grid;
    gap: 14px;
    align-content: start;
    img {
      width: 200px;
    }
    p {
      color: var(--rk-muted);
      max-width: 340px;
    }
  }
  &__social {
    display: flex;
    align-items: center;
    gap: 6px;
    a {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: #fff;
      color: var(--rk-ink);
      &:hover {
        color: var(--rk-accent);
      }
    }
    .rk-lang a {
      display: inline;
      width: auto;
      height: auto;
      background: none;
    }
  }
  &__nav {
    display: grid;
    gap: 10px;
    align-content: start;
    font-weight: 600;
    a:hover {
      color: var(--rk-accent);
    }
  }
  &__contacts {
    display: grid;
    gap: 14px;
    align-content: start;
    a,
    span {
      display: grid;
      line-height: 1.3;
    }
    b {
      color: var(--rk-ink);
    }
    small {
      font-size: 13px;
      color: var(--rk-muted);
    }
    a:hover b {
      color: var(--rk-accent);
    }
  }
  &__bottom {
    display: flex;
    justify-content: space-between;
    gap: 8px 32px;
    flex-wrap: wrap;
    margin-top: 48px;
    padding-top: 20px;
    padding-bottom: 28px;
    border-top: 1px solid var(--rk-line);
    font-size: 13px;
    color: var(--rk-muted);
  }
}

/* Плавающие кнопки */
.rk-float {
  display: none;
}
.rk-chatbtn {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 45;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 20px 0 16px;
  border-radius: 16px;
  background: var(--rk-accent);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 10px 30px rgba(138, 11, 54, 0.3);
  opacity: 0;
  transform: translateY(16px);
  pointer-events: none;
  transition:
    opacity 0.25s,
    transform 0.25s,
    background 0.2s;
  &.is-on {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }
  &:hover {
    background: var(--rk-accent-h);
  }
}

.rk-shade {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(42, 17, 24, 0.4);
}
.rk-fade-enter-active,
.rk-fade-leave-active {
  transition: opacity 0.2s;
}
.rk-fade-enter-from,
.rk-fade-leave-to {
  opacity: 0;
}

.rk-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 61;
  width: min(360px, 88vw);
  display: flex;
  flex-direction: column;
  background: #fff;
  transform: translateX(-102%);
  transition: transform 0.25s;
  overflow-y: auto;
  &.is-open {
    transform: none;
  }
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 12px 14px 20px;
    border-bottom: 1px solid var(--rk-line);
    b {
      font-family: var(--rk-head);
      font-size: 22px;
      font-weight: 600;
      color: var(--rk-ink);
    }
  }
  &__nav {
    display: grid;
    padding: 12px;
    a {
      padding: 12px 12px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 17px;
      color: var(--rk-ink);
      &.is-active {
        background: var(--rk-soft);
        color: var(--rk-accent);
      }
    }
  }
  &__foot {
    display: grid;
    gap: 10px;
    margin-top: auto;
    padding: 20px;
    border-top: 1px solid var(--rk-line);
  }
  &__links {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 4px;
  }
}

.rk-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 61;
  display: grid;
  gap: 8px;
  padding: 12px 16px 24px;
  border-radius: 22px 22px 0 0;
  background: #fff;
  transform: translateY(105%);
  transition: transform 0.25s;
  &.is-open {
    transform: none;
  }
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    b {
      font-family: var(--rk-head);
      font-size: 22px;
      font-weight: 600;
      color: var(--rk-ink);
    }
  }
  > p {
    color: var(--rk-muted);
    margin-bottom: 4px;
  }
  &__row {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 14px 16px;
    border-radius: 14px;
    background: var(--rk-surface);
    text-align: left;
    color: var(--rk-accent);
    span {
      display: grid;
      line-height: 1.3;
    }
    b {
      color: var(--rk-ink);
      font-size: 16px;
    }
    small {
      color: var(--rk-muted);
      font-size: 13px;
    }
  }
}

.rk-chat {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 62;
  width: min(360px, calc(100vw - 32px));
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: #fff;
  border: 1px solid var(--rk-line);
  box-shadow:
    0 2px 6px rgba(42, 17, 24, 0.08),
    0 22px 54px rgba(42, 17, 24, 0.24);
  overflow: hidden;
  &__head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 8px 12px 16px;
    border-bottom: 1px solid var(--rk-line);
    > span:nth-child(2) {
      display: grid;
      line-height: 1.25;
      flex: 1;
      b {
        color: var(--rk-ink);
      }
      small {
        color: var(--rk-muted);
        font-size: 12px;
      }
    }
  }
  &__ava {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--rk-soft);
    color: var(--rk-accent);
    font-weight: 800;
  }
  &__log {
    display: grid;
    gap: 8px;
    align-content: start;
    max-height: 300px;
    min-height: 140px;
    overflow-y: auto;
    padding: 16px;
    background: var(--rk-surface);
    p {
      max-width: 85%;
      padding: 10px 12px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.45;
      background: #fff;
      &.is-me {
        justify-self: end;
        background: var(--rk-accent);
        color: #fff;
      }
    }
  }
  &__form {
    display: flex;
    gap: 6px;
    padding: 10px;
    input {
      flex: 1;
      width: 0;
      min-height: 44px;
      padding: 0 14px;
      border: 1px solid var(--rk-line);
      border-radius: 12px;
      font: inherit;
      color: var(--rk-ink);
      &:focus {
        outline: 2px solid var(--rk-accent);
        outline-offset: -1px;
      }
    }
    .rk-iconbtn {
      background: var(--rk-accent);
      color: #fff;
    }
  }
  &__demo {
    padding: 0 14px 12px;
    font-size: 12px;
    color: var(--rk-muted);
  }
}
.rk-pop-enter-active,
.rk-pop-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.rk-pop-enter-from,
.rk-pop-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 1400px) {
  .rk-header__row {
    gap: 16px;
  }
  .rk-nav__item {
    padding: 8px 8px;
    font-size: 14px;
  }
  .rk-header__write {
    display: none;
  }
}
@media (max-width: 1199px) {
  .rk-nav {
    display: none;
  }
  .rk-header__burger {
    display: inline-grid;
  }
  .rk-header__write {
    display: inline-flex;
  }
  .rk-footer__grid {
    grid-template-columns: 1fr 1fr;
  }
  .rk-footer__brand {
    grid-column: 1 / -1;
  }
}
@media (max-width: 989px) {
  .rk-section {
    padding-top: 56px;
    padding-bottom: 56px;
  }
}
@media (max-width: 768px) {
  .rk-wrap {
    padding-left: 16px;
    padding-right: 16px;
  }
  .rk-html {
    scroll-padding-top: 76px;
  }
  .rk-header__row {
    height: 64px;
    gap: 8px;
  }
  .rk-header__motto {
    font-size: 12px;
  }
  .rk-header__toplinks > a:first-child {
    display: none;
  }
  .rk-logo {
    margin-right: auto;
    img {
      width: 150px;
    }
  }
  .rk-header__phone,
  .rk-header__write {
    display: none;
  }
  .rk-header__call {
    display: inline-grid;
    margin-right: -10px;
  }
  .rk-section {
    padding-top: 44px;
    padding-bottom: 44px;
  }
  .rk-head {
    margin-bottom: 24px;
  }
  .rk-pagehead {
    padding-top: 28px;
    padding-bottom: 24px;
  }
  .rk-footer__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .rk-footer {
    padding-bottom: 72px;
  }
  .rk-chatbtn {
    display: none;
  }
  .rk-float {
    position: fixed;
    left: 50%;
    bottom: 16px;
    z-index: 45;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 50px;
    padding: 0 22px;
    border-radius: 16px;
    background: var(--rk-accent);
    color: #fff;
    font-weight: 700;
    white-space: nowrap;
    box-shadow: 0 10px 30px rgba(138, 11, 54, 0.32);
    opacity: 0;
    transform: translate(-50%, 16px);
    pointer-events: none;
    transition:
      opacity 0.25s,
      transform 0.25s;
    &.is-on {
      opacity: 1;
      transform: translate(-50%, 0);
      pointer-events: auto;
    }
  }
  .rk-chat {
    right: 16px;
    bottom: 16px;
  }
}
@media (max-width: 375px) {
  .rk-logo img {
    width: 128px;
  }
  .rk-header__motto {
    font-size: 11px;
  }
  .rk-lang {
    font-size: 12px;
  }
}
</style>
