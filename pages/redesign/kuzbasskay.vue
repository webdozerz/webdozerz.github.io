<script lang="ts" setup>
import { KZ_BASE, kzContacts, kzNav, kzOrig, kzPath, kzReception, kzSales, kzSections } from '~/utils/kuzbasskay'
import { useKzUi } from '~/composables/useKuzbasskay'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'
import KzMark from '~/components/redesign/kuzbasskay/KzMark.vue'

const route = useRoute()
const router = useRouter()
const ui = useKzUi()

useSeoMeta({
  title: 'Кузбасская птицефабрика — яйцо, мясо птицы, корма | Концепт редизайна',
  description:
    'Концепт редизайна сайта kuzbasskay.ru: АО «Кузбасская птицефабрика» с 1966 года — яйцо С0, С1, С2 и лоток 30 шт., «Домашняя курочка», куриный фарш и полуфабрикаты, колбасы, 13 комбикормов и 17 премиксов своего завода, отдел продаж для мелкого и крупного опта.',
  ogTitle: 'Кузбасская птицефабрика — концепт редизайна',
  ogDescription: 'Яйцо, мясо несушки, полуфабрикаты и корма Кузбасской птицефабрики: калибровка яйца по категориям, отдел продаж для опта, магазин «Фирменный».',
  ogImage: 'https://andryushov.me/redesign/kuzbasskay/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'kz-html', lang: 'ru' },
  bodyAttrs: { class: 'kz-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap' },
  ],
})

const isOn = (to: string) => {
  const p = to.split(/[?#]/)[0].replace(/\/$/, '')
  const r = route.path.replace(/\/$/, '')
  return p !== KZ_BASE && (r === p || r.startsWith(p + '/'))
}
const year = new Date().getFullYear()

// Липкая шапка: белая строка «логотип · отдел продаж · поиск» уезжает, жёлтая полоса меню оригинала остаётся у верха
const top = ref<HTMLElement | null>(null)
const topH = ref(0)
const stuck = ref(false)
const scrolled = ref(false)
const measure = () => {
  topH.value = top.value?.offsetHeight ?? 0
}
const onScroll = () => {
  stuck.value = window.scrollY > topH.value + 40
  scrolled.value = window.scrollY > 700
}

// Выпадашки меню закрываются после перехода, пока курсор не уйдёт
const quiet = ref(false)

// Поиск в шапке (у оригинала — форма GET /search/?search_query=)
const q = ref('')
const search = () => {
  router.push({ path: kzPath('/poisk'), query: q.value.trim() ? { q: q.value.trim() } : {} })
}

const shot = computed(() => (ui.gallery.value ? ui.gallery.value.items[ui.gallery.value.index] : null))
const step = (d: number) => {
  const g = ui.gallery.value
  if (!g) return
  g.index = (g.index + d + g.items.length) % g.items.length
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    ui.gallery.value = null
    ui.menu.value = false
    ui.call.value = false
  }
  if (ui.gallery.value && e.key === 'ArrowRight') step(1)
  if (ui.gallery.value && e.key === 'ArrowLeft') step(-1)
}
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const locked = computed(() => !!ui.gallery.value || ui.menu.value || ui.call.value)
watch(locked, (v) => document.documentElement.classList.toggle('kz-lock', v))
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    ui.call.value = false
    ui.gallery.value = null
    quiet.value = true
    ;(document.activeElement as HTMLElement | null)?.blur?.()
  },
)

onMounted(() => {
  // ?shot — снимок для og и письма без плашки cookie
  if (!('shot' in route.query)) ui.readCookie()
  measure()
  onScroll()
  window.addEventListener('resize', measure)
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', measure)
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('kz-lock')
})
</script>

<template>
  <div class="kz">
    <div class="kz-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="kzContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="kz-header" :class="{ 'is-stuck': stuck }" :style="{ top: `${-topH}px` }">
      <div ref="top" class="kz-top">
        <div class="kz-wrap kz-top__row kz-header__row">
          <button type="button" class="kz-iconbtn kz-top__burger" aria-label="Меню" @click="ui.menu.value = true"><KzIcon name="menu" /></button>
          <NuxtLink :to="kzPath()" class="kz-logo" aria-label="Кузбасская птицефабрика, на главную">
            <img :src="kzContacts.logo" alt="Кузбасская птицефабрика" width="346" height="116" />
          </NuxtLink>

          <div class="kz-top__sales">
            <span class="kz-top__label">Отдел продаж</span>
            <a v-for="s in kzSales.slice(0, 2)" :key="s.tel" :href="`tel:${s.tel}`" class="kz-top__tel">
              <b>{{ s.phone }}</b><small>{{ s.label.toLowerCase() }}</small>
            </a>
            <a :href="`tel:${kzReception[0].tel}`" class="kz-top__tel kz-top__tel--rec">
              <b>{{ kzReception[0].phone }}</b><small>приёмная</small>
            </a>
          </div>

          <form class="kz-top__search" role="search" @submit.prevent="search">
            <KzIcon name="search" :size="18" />
            <input v-model="q" type="search" placeholder="Поиск по сайту" aria-label="Поиск по сайту" />
          </form>
          <NuxtLink :to="kzPath('/poisk')" class="kz-iconbtn kz-top__searchbtn" aria-label="Поиск"><KzIcon name="search" /></NuxtLink>
          <button type="button" class="kz-iconbtn kz-top__callbtn" aria-label="Позвонить" @click="ui.call.value = true"><KzIcon name="phone" /></button>
          <NuxtLink :to="kzPath('/kontakty') + '#napisat'" class="kz-btn kz-top__write"><KzIcon name="mail" :size="18" />Написать нам</NuxtLink>
        </div>
      </div>

      <!-- Жёлтая полоса меню оригинала — его словами, остаётся у верха -->
      <div class="kz-menu">
        <div class="kz-wrap kz-menu__row kz-header__row">
          <NuxtLink :to="kzPath()" class="kz-menu__mark" aria-label="На главную" tabindex="-1">
            <img :src="`${KZ_BASE}/img/logo-mark.png`" alt="" width="103" height="116" />
          </NuxtLink>
          <nav class="kz-menu__nav" :class="{ 'is-quiet': quiet }" aria-label="Разделы" @mouseleave="quiet = false">
            <div v-for="n in kzNav" :key="n.label" class="kz-menu__item" :class="{ 'has-sub': n.sub }">
              <NuxtLink :to="n.to" class="kz-menu__link" :class="{ 'is-on': isOn(n.to) }">
                {{ n.label }}<KzIcon v-if="n.sub" name="down" :size="14" class="kz-menu__chev" />
              </NuxtLink>
              <div v-if="n.sub" class="kz-menu__pop">
                <NuxtLink v-for="s in n.sub" :key="s.label" :to="s.to">{{ s.label }}</NuxtLink>
              </div>
            </div>
          </nav>
          <button type="button" class="kz-menu__call" @click="ui.call.value = true"><KzIcon name="phone" :size="17" />Отдел продаж</button>
        </div>
      </div>
    </header>

    <main class="kz-main">
      <NuxtPage />
    </main>

    <footer class="kz-foot">
      <div class="kz-wrap kz-foot__grid">
        <div class="kz-foot__brand">
          <NuxtLink :to="kzPath()" class="kz-logo kz-logo--foot" aria-label="На главную">
            <img :src="kzContacts.logo" alt="Кузбасская птицефабрика" width="346" height="116" />
          </NuxtLink>
          <p>Предприятие яичного и мясного направления на юге Кузбасса с 1966 года. Свой завод комбикормов и премиксов.</p>
          <div class="kz-foot__tools">
            <NuxtLink :to="kzPath('/karta-sajta')"><KzIcon name="sitemap" :size="18" />Карта сайта</NuxtLink>
            <NuxtLink :to="kzPath('/poisk')"><KzIcon name="search" :size="18" />Поиск</NuxtLink>
          </div>
        </div>
        <div>
          <h4>Продукция</h4>
          <ul class="kz-foot__list">
            <li v-for="s in kzSections" :key="s.id"><NuxtLink :to="kzPath(`/produkciya/${s.id}`)">{{ s.title }}</NuxtLink></li>
            <li><NuxtLink :to="kzPath('/magazin')">Магазин «Фирменный»</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4>Фабрика</h4>
          <ul class="kz-foot__list">
            <li v-for="n in kzNav.filter((x) => !['Продукция', 'Магазин'].includes(x.label))" :key="n.label"><NuxtLink :to="n.to">{{ n.label }}</NuxtLink></li>
            <li><NuxtLink :to="kzPath('/recepty')">Рецепты</NuxtLink></li>
          </ul>
        </div>
        <div class="kz-foot__contacts">
          <h4>Контакты</h4>
          <a v-for="s in kzSales" :key="s.tel" :href="`tel:${s.tel}`"><b>{{ s.phone }}</b><span>{{ s.label.toLowerCase() }}</span></a>
          <a :href="`tel:${kzReception[0].tel}`"><b>{{ kzReception[0].phone }}, 557-281</b><span>приёмная</span></a>
          <a :href="`mailto:${kzContacts.email}`"><b>{{ kzContacts.email }}</b><span>приёмная</span></a>
          <p>{{ kzContacts.address }}</p>
        </div>
      </div>
      <div class="kz-wrap kz-foot__legal">
        <span>© 1966–{{ year }} {{ kzContacts.name }} · <a :href="kzOrig('/privacy-policy/')" target="_blank" rel="noopener">Политика конфиденциальности</a></span>
        <span>Тексты, изображения и товарные знаки принадлежат АО «Кузбасская птицефабрика» (kuzbasskay.ru). Это концепт редизайна, не официальный сайт.</span>
      </div>
    </footer>

    <!-- Телефон: нижняя панель — покупка здесь звонком и письмом, как у оригинала -->
    <nav class="kz-dock" aria-label="Быстрые ссылки">
      <NuxtLink :to="kzPath('/produkciya')" :class="{ 'is-on': isOn(kzPath('/produkciya')) }"><KzMark name="egg" :size="20" /><span>Продукция</span></NuxtLink>
      <button type="button" class="kz-dock__main" @click="ui.call.value = true"><KzIcon name="phone" /><span>Позвонить</span></button>
      <NuxtLink :to="kzPath('/magazin')" :class="{ 'is-on': isOn(kzPath('/magazin')) }"><KzIcon name="shop" /><span>Магазин</span></NuxtLink>
      <NuxtLink :to="kzPath('/kontakty') + '#napisat'"><KzIcon name="mail" /><span>Написать</span></NuxtLink>
    </nav>

    <!-- Лист телефонов -->
    <div v-if="ui.call.value" class="kz-sheet" @click.self="ui.call.value = false">
      <div class="kz-sheet__panel" role="dialog" aria-label="Телефоны">
        <div class="kz-sheet__head">
          <b>Куда позвонить</b>
          <button type="button" class="kz-iconbtn" aria-label="Закрыть" @click="ui.call.value = false"><KzIcon name="close" /></button>
        </div>
        <a v-for="s in kzSales" :key="s.tel" :href="`tel:${s.tel}`" class="kz-sheet__row">
          <KzIcon name="phone" /><span><b>{{ s.phone }}</b><small>{{ s.label }}</small></span>
        </a>
        <a v-for="s in kzReception" :key="s.tel" :href="`tel:${s.tel}`" class="kz-sheet__row kz-sheet__row--muted">
          <KzIcon name="phone" /><span><b>{{ s.phone }}</b><small>{{ s.label }}</small></span>
        </a>
        <a :href="`mailto:${kzContacts.email}`" class="kz-sheet__row kz-sheet__row--muted">
          <KzIcon name="mail" /><span><b>{{ kzContacts.email }}</b><small>Почта приёмной</small></span>
        </a>
      </div>
    </div>

    <!-- Мобильное меню -->
    <div v-if="ui.menu.value" class="kz-drawer" @click.self="ui.menu.value = false">
      <div class="kz-drawer__panel">
        <div class="kz-drawer__head">
          <b>Меню</b>
          <button type="button" class="kz-iconbtn" aria-label="Закрыть" @click="ui.menu.value = false"><KzIcon name="close" /></button>
        </div>
        <form class="kz-drawer__search" role="search" @submit.prevent="search">
          <KzIcon name="search" :size="18" />
          <input v-model="q" type="search" placeholder="Поиск по сайту" aria-label="Поиск по сайту" />
        </form>
        <template v-for="n in kzNav" :key="n.label">
          <details v-if="n.sub" class="kz-drawer__group">
            <summary>{{ n.label }}<KzIcon name="down" :size="16" /></summary>
            <NuxtLink :to="n.to">{{ n.label }}: всё</NuxtLink>
            <NuxtLink v-for="s in n.sub" :key="s.label" :to="s.to">{{ s.label }}</NuxtLink>
          </details>
          <NuxtLink v-else :to="n.to" class="kz-drawer__link">{{ n.label }}<KzIcon name="right" :size="16" /></NuxtLink>
        </template>
        <NuxtLink :to="kzPath('/recepty')" class="kz-drawer__link">Рецепты<KzIcon name="right" :size="16" /></NuxtLink>
        <div class="kz-drawer__sales">
          <b>Отдел продаж</b>
          <a v-for="s in kzSales.slice(0, 2)" :key="s.tel" :href="`tel:${s.tel}`"><KzIcon name="phone" :size="18" />{{ s.phone }} <small>{{ s.label.toLowerCase() }}</small></a>
        </div>
      </div>
    </div>

    <!-- Лайтбокс (у оригинала — fancybox) -->
    <div v-if="ui.gallery.value && shot" class="kz-lightbox" @click.self="ui.gallery.value = null">
      <button type="button" class="kz-lightbox__close" aria-label="Закрыть" @click="ui.gallery.value = null"><KzIcon name="close" /></button>
      <button v-if="ui.gallery.value.items.length > 1" type="button" class="kz-lightbox__nav kz-lightbox__nav--prev" aria-label="Предыдущее" @click="step(-1)"><KzIcon name="left" /></button>
      <figure>
        <img :src="`${KZ_BASE}/img/${shot.img}.jpg`" :alt="shot.cap || ui.gallery.value.title" />
        <figcaption>{{ shot.cap || ui.gallery.value.title }}<template v-if="ui.gallery.value.items.length > 1"> · {{ ui.gallery.value.index + 1 }} из {{ ui.gallery.value.items.length }}</template></figcaption>
      </figure>
      <button v-if="ui.gallery.value.items.length > 1" type="button" class="kz-lightbox__nav kz-lightbox__nav--next" aria-label="Следующее" @click="step(1)"><KzIcon name="right" /></button>
    </div>

    <!-- Плашка cookie, как у оригинала -->
    <div v-if="!ui.cookie.value" class="kz-cookie" role="region" aria-label="Cookie">
      <p>На сайте используются cookie-файлы, чтобы он работал удобнее. <a :href="kzOrig('/privacy-policy/')" target="_blank" rel="noopener">Подробнее</a></p>
      <button type="button" class="kz-btn kz-btn--sm" @click="ui.acceptCookie()">Хорошо</button>
    </div>

    <button v-show="scrolled" type="button" class="kz-up" aria-label="Наверх" @click="toTop"><KzIcon name="up" /></button>
    <div v-if="ui.toast.value" class="kz-toast" role="status">{{ ui.toast.value }}</div>
  </div>
</template>

<style lang="scss">
.kz-body {
  background: #fff;
}
html.kz-html {
  scroll-padding-top: 76px;
  scroll-behavior: smooth;
}
html.kz-lock {
  overflow: hidden;
}

.kz {
  --kz-accent: #f59a17;
  --kz-accent-hover: #b35309;
  --kz-btn: #c96300; // кнопки: белый текст, контраст ~4:1 (тёмный текст на ярком оранжевом пользователю не нравится)
  --kz-accent-ink: #a85a00;
  --kz-on-accent: #fff;
  --kz-ink: #3d2a12;
  --kz-text: #4b3f2f;
  --kz-muted: #7b6d5a;
  --kz-surface: #f6f5f1;
  --kz-line: #ece6da;
  --kz-strip: #fff0b3;
  --kz-yellow-soft: #faf6ec;
  --kz-soft: #fff4dc;
  --kz-green: #2f6b2f;
  --kz-green-soft: #eaf3e5;
  --kz-r: 14px;
  --kz-R: 24px;
  --kz-pop: 0 2px 6px rgba(61, 42, 18, 0.08), 0 22px 54px rgba(61, 42, 18, 0.22);
  min-height: 100vh;
  background: #fff;
  color: var(--kz-text);
  font-family: 'Nunito', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.6;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    padding-bottom: 66px;
  }
}

:where(.kz) h1,
:where(.kz) h2,
:where(.kz) h3,
:where(.kz) h4,
:where(.kz) p,
:where(.kz) figure,
:where(.kz) blockquote,
:where(.kz) dl,
:where(.kz) dd {
  margin: 0;
}
:where(.kz) h1,
:where(.kz) h2,
:where(.kz) h3,
:where(.kz) h4 {
  color: var(--kz-ink);
  font-weight: 800;
  line-height: 1.2;
}
:where(.kz) a {
  color: inherit;
  text-decoration: none;
}
:where(.kz) img {
  display: block;
  max-width: 100%;
}
:where(.kz) button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  border: 0;
  background: none;
  padding: 0;
}
:where(.kz) input,
:where(.kz) textarea,
:where(.kz) select {
  font: inherit;
  color: inherit;
}
:where(.kz) ul,
:where(.kz) ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

.kz-wrap {
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 32px;
  padding-right: 32px;

  @media (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
}

/* ---------- Кнопки, ссылки, переключатели ---------- */
.kz-btn,
.kz-btn:focus,
.kz-btn:active {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 10px 20px;
  border: 0;
  border-radius: var(--kz-r);
  background: var(--kz-btn);
  color: var(--kz-on-accent);
  font-weight: 800;
  font-size: 15px;
  line-height: 1.2;
  white-space: nowrap;
  text-align: center;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.kz-btn:hover {
  background: var(--kz-accent-hover);
}
.kz-btn--line,
.kz-btn--line:focus,
.kz-btn--line:active {
  border: 1px solid #e3d8c3;
  background: #fff;
  color: var(--kz-ink);
}
.kz-btn--line:hover {
  border-color: var(--kz-accent);
  background: #fff;
  color: var(--kz-accent-ink);
}
.kz-btn--green,
.kz-btn--green:focus {
  background: var(--kz-green);
  color: #fff;
}
.kz-btn--green:hover {
  background: #255a25;
}
.kz-btn--sm,
.kz-btn--sm:focus {
  min-height: 38px;
  padding: 7px 16px;
  font-size: 14px;
}
.kz-btn--big,
.kz-btn--big:focus {
  min-height: 52px;
  padding: 12px 24px;
  font-size: 16px;
}
.kz-iconbtn {
  display: inline-grid;
  flex: none;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--kz-r);
  color: var(--kz-ink);

  &:hover {
    background: var(--kz-surface);
  }
}
.kz-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--kz-accent-ink);
  font-weight: 800;
  white-space: nowrap;

  .kz-icon {
    transition: transform 0.15s;
  }
  &:hover .kz-icon {
    transform: translateX(3px);
  }
}
.kz-seg {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: calc(var(--kz-r) + 4px);
  background: #fff;

  button {
    min-height: 38px;
    padding: 6px 16px;
    border-radius: var(--kz-r);
    color: var(--kz-text);
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;

    &:hover {
      color: var(--kz-ink);
    }
    &.is-on {
      background: var(--kz-ink);
      color: #fff;
    }
  }
  &--soft {
    background: var(--kz-surface);
  }
  @media (max-width: 375px) {
    button {
      padding: 6px 10px;
      font-size: 14px;
    }
  }
}
.kz-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.kz-chip,
.kz-chip:focus {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 6px 14px;
  border: 1px solid var(--kz-line);
  border-radius: 99px;
  background: #fff;
  color: var(--kz-ink);
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  max-width: 100%;

  @media (max-width: 576px) {
    white-space: normal;
    line-height: 1.3;
  }
  &:hover {
    border-color: var(--kz-accent);
  }
  &.is-on {
    border-color: var(--kz-ink);
    background: var(--kz-ink);
    color: #fff;
  }
}

/* ---------- Секции ---------- */
.kz-sec {
  padding-top: 64px;
  padding-bottom: 64px;

  @media (max-width: 768px) {
    padding-top: 44px;
    padding-bottom: 44px;
  }
  &--tight {
    padding-top: 28px;
  }
  &--surface {
    background: var(--kz-surface);
  }
}
.kz-h2 {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px 24px;
  margin-bottom: 26px;

  h2 {
    font-size: clamp(26px, 3vw, 36px);
    font-weight: 900;
    letter-spacing: -0.01em;
    line-height: 1.12;
  }
  p {
    max-width: 640px;
    margin-top: 8px;
    color: var(--kz-text);
  }
}
.kz-grid3 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 375px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* Плитки разделов продукции — их иконки силуэтами */
.kz-tiles {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
}
.kz-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--kz-line);
  border-radius: var(--kz-R);
  background: #fff;
  transition: border-color 0.15s;

  &:hover {
    border-color: var(--kz-accent);
  }
  &__img {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--kz-surface);

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
  }
  &:hover &__img img {
    transform: scale(1.05);
  }
  &__img.is-contain {
    background: #fff;

    img {
      object-fit: contain;
      padding: 6px;
    }
  }
  &__badge {
    display: grid;
    flex: none;
    place-items: center;
    width: 42px;
    height: 42px;
    border: 3px solid #fff;
    border-radius: 14px;
    background: var(--kz-accent);
    color: #fff;
  }
  &--farm &__badge {
    background: var(--kz-green);
  }
  &__body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-top: -31px;
    padding: 0 14px 16px;
    position: relative;

    > span:last-child {
      display: grid;
      gap: 2px;
      min-width: 0;
    }
    b {
      color: var(--kz-ink);
      font-size: 17px;
      font-weight: 800;
      line-height: 1.25;
    }
    small {
      color: var(--kz-muted);
      font-size: 14px;
      line-height: 1.35;
    }
  }
  @media (max-width: 576px) {
    &__badge {
      width: 36px;
      height: 36px;
      border-radius: 12px;

      .kz-mark {
        width: 18px !important;
        height: 18px !important;
      }
    }
    &__body {
      gap: 8px;
      margin-top: -26px;
      padding: 0 10px 12px;

      b {
        font-size: 15px;
      }
      small {
        font-size: 13px;
      }
    }
  }
}

/* Галерея с лайтбоксом */
.kz-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  button {
    position: relative;
    display: block;
    aspect-ratio: 3 / 2;
    overflow: hidden;
    border-radius: 16px;
    background: var(--kz-surface);
    cursor: zoom-in;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    &:hover img {
      transform: scale(1.05);
    }
    span {
      position: absolute;
      left: 8px;
      bottom: 8px;
      max-width: calc(100% - 16px);
      padding: 2px 9px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.92);
      color: var(--kz-ink);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &--doc button {
    aspect-ratio: 3 / 4;
    background: #fff;
    border: 1px solid var(--kz-line);

    img {
      object-fit: contain;
      padding: 6px;
    }
  }
}

/* Текст страниц, таблицы, панели */
.kz-prose {
  max-width: 780px;
  font-size: 17px;
  line-height: 1.65;

  p + p {
    margin-top: 14px;
  }
}
.kz-panel {
  padding: 24px;
  border-radius: var(--kz-R);
  background: var(--kz-surface);

  @media (max-width: 576px) {
    padding: 18px;
  }
  &--white {
    border: 1px solid var(--kz-line);
    background: #fff;
  }
  &--yellow {
    background: var(--kz-yellow-soft);
  }
  h3 {
    font-size: 20px;
    font-weight: 800;
  }
}
.kz-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;

  th,
  td {
    padding: 11px 14px;
    border-bottom: 1px solid var(--kz-line);
    text-align: left;
    vertical-align: top;
  }
  th {
    color: var(--kz-muted);
    font-size: 13px;
    font-weight: 700;
  }
  td:first-child {
    color: var(--kz-ink);
    font-weight: 800;
    white-space: nowrap;
  }
  tr:last-child td {
    border-bottom: 0;
  }
}
.kz-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 10px;
    background: #fff;
    color: var(--kz-ink);
    font-size: 14px;
    font-weight: 700;

    .kz-icon {
      color: var(--kz-green);
    }
  }
}
ul.kz-checks {
  display: grid;
  gap: 8px;

  li {
    display: grid;
    grid-template-columns: 22px minmax(0, 1fr);
    gap: 10px;

    .kz-icon {
      margin-top: 3px;
      color: var(--kz-green);
    }
  }
}

/* Поля форм */
.kz-field {
  display: grid;
  align-content: start;
  gap: 6px;

  span {
    color: var(--kz-ink);
    font-size: 14px;
    font-weight: 700;
  }
  input,
  textarea {
    width: 100%;
    min-height: 48px;
    padding: 11px 14px;
    border: 1px solid #e0d6c4;
    border-radius: var(--kz-r);
    background: #fff;
    color: var(--kz-ink);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:focus {
      border-color: var(--kz-accent);
      box-shadow: 0 0 0 3px rgba(245, 154, 23, 0.2);
    }
  }
  textarea {
    min-height: 120px;
    resize: vertical;
  }
  &.is-bad input,
  &.is-bad textarea {
    border-color: #d0452f;
  }
  em {
    color: #b8321f;
    font-size: 13px;
    font-style: normal;
  }
}

/* ---------- Блоки нескольких страниц ---------- */
.kz-read {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 32px;

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.kz-recipe {
  display: grid;
  gap: 16px;
  justify-items: start;
  padding: 28px;
  border-radius: var(--kz-R);
  background: var(--kz-yellow-soft);

  @media (max-width: 576px) {
    padding: 20px;
  }
  &__kicker {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--kz-accent-ink);
    font-weight: 800;
  }
  h2 {
    font-size: clamp(24px, 2.6vw, 32px);
    font-weight: 900;
  }
  h3 {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 900;
  }
  &__cols {
    display: grid;
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: 24px;
    width: 100%;

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  ul.kz-recipe__ing {
    display: grid;
    gap: 4px;
    font-size: 15px;

    li {
      padding-left: 16px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.65em;
        width: 7px;
        height: 9px;
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        background: var(--kz-accent);
      }
    }
  }
  ol.kz-recipe__steps {
    display: grid;
    gap: 8px;
    counter-reset: st;
    font-size: 15px;

    li {
      counter-increment: st;
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr);

      &::before {
        content: counter(st) '.';
        color: var(--kz-accent-ink);
        font-weight: 900;
      }
    }
  }
}
ul.kz-nums {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: 100%;

  li {
    display: grid;
    gap: 2px;
    padding: 14px 16px;
    border-radius: 18px;
    background: var(--kz-surface);
  }
  b {
    color: var(--kz-ink);
    font-size: 28px;
    font-weight: 900;
    line-height: 1.1;
  }
  span {
    color: var(--kz-muted);
    font-size: 14px;
    line-height: 1.35;
  }
}
.kz-h2--small {
  margin-bottom: 14px;

  h2 {
    font-size: 26px;
  }
}
.kz-secnav {
  margin-top: 20px;
}
.kz-intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 380px);
  align-items: start;
  gap: 40px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
}
.kz-gost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  padding: 4px 12px;
  border-radius: 10px;
  background: var(--kz-green-soft);
  color: var(--kz-green);
  font-size: 14px;
  font-weight: 800;
}
.kz-buy {
  display: grid;
  gap: 10px;

  p {
    font-size: 15px;
  }
  &__tel {
    display: grid;
    padding: 10px 14px;
    border-radius: 14px;
    background: #fff;
    line-height: 1.25;

    b {
      color: var(--kz-ink);
      font-size: 17px;
      font-weight: 900;
      overflow-wrap: anywhere;
    }
    small {
      color: var(--kz-muted);
      font-size: 13px;
    }
    &:hover b {
      color: var(--kz-accent-ink);
    }
  }
}
.kz-empty {
  padding: 24px;
  border-radius: var(--kz-R);
  background: var(--kz-surface);

  a {
    color: var(--kz-accent-ink);
    font-weight: 800;
  }
}
.kz-pager {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 18px;

  button {
    display: inline-grid;
    place-items: center;
    min-width: 42px;
    height: 42px;
    padding: 0 10px;
    border-radius: 12px;
    background: var(--kz-surface);
    color: var(--kz-ink);
    font-weight: 800;

    &.is-on {
      background: var(--kz-ink);
      color: #fff;
    }
    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
}
.kz-note {
  margin-top: 16px;
  color: var(--kz-muted);
  font-size: 14px;

  a {
    color: var(--kz-accent-ink);
    font-weight: 800;
  }
}
ul.kz-artlist {
  display: grid;
  gap: 10px;
}
.kz-art {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 14px 18px 14px 14px;
  border: 1px solid var(--kz-line);
  border-radius: 20px;
  color: var(--kz-muted);
  transition: border-color 0.15s;

  &:hover {
    border-color: var(--kz-accent);
  }
  b {
    display: grid;
    color: var(--kz-ink);
    font-size: 17px;
    font-weight: 800;
    line-height: 1.35;
  }
  small {
    color: var(--kz-muted);
    font-size: 13px;
    font-weight: 600;
  }
  &__ic {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: var(--kz-strip);
    color: var(--kz-ink);
  }
}
.kz-tablewrap {
  padding: 6px 10px;
  overflow-x: auto;
}
.kz-buy__tel--white {
  background: #fff;
}

/* ---------- Баннер концепта ---------- */
.kz-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 4px 14px;
  padding: 8px 16px;
  background: var(--kz-ink);
  color: #fff;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;

  a {
    color: var(--kz-strip);
    font-weight: 800;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

/* ---------- Шапка ---------- */
.kz-header {
  position: sticky;
  z-index: 50;
  background: #fff;
}
.kz-top {
  border-bottom: 1px solid var(--kz-line);

  &__row {
    display: flex;
    align-items: center;
    gap: 22px;
    min-height: 84px;

    @media (max-width: 989px) {
      gap: 8px;
      min-height: 64px;
    }
  }
  &__burger {
    display: none;
    margin-left: -8px;

    @media (max-width: 989px) {
      display: inline-grid;
    }
  }
  &__sales {
    display: flex;
    align-items: center;
    gap: 6px 22px;
    margin-left: auto;

    @media (max-width: 1199px) {
      gap: 16px;
    }
    @media (max-width: 989px) {
      display: none;
    }
  }
  &__label {
    padding: 4px 10px;
    border-radius: 9px;
    background: var(--kz-strip);
    color: var(--kz-ink);
    font-size: 13px;
    font-weight: 800;
    white-space: nowrap;

    @media (max-width: 1199px) {
      display: none;
    }
  }
  &__tel {
    display: grid;
    line-height: 1.2;

    b {
      color: var(--kz-ink);
      font-size: 17px;
      font-weight: 900;
      white-space: nowrap;
    }
    small {
      color: var(--kz-muted);
      font-size: 13px;
    }
    &:hover b {
      color: var(--kz-accent-ink);
    }
    &--rec {
      @media (max-width: 1399px) {
        display: none;
      }
    }
  }
  &__search {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 230px;
    min-height: 44px;
    padding: 0 14px;
    border-radius: var(--kz-r);
    background: var(--kz-surface);
    color: var(--kz-muted);

    input {
      width: 0;
      flex: 1;
      min-width: 0;
      border: 0;
      background: none;
      color: var(--kz-ink);
      outline: none;
    }
    &:focus-within {
      box-shadow: 0 0 0 2px var(--kz-accent);
    }
    @media (max-width: 1519px) {
      width: 190px;
    }
    @media (max-width: 1199px) {
      display: none;
    }
  }
  &__searchbtn {
    display: none !important;

    @media (max-width: 1199px) {
      display: inline-grid !important;
    }
    @media (max-width: 989px) {
      margin-left: auto;
    }
  }
  &__callbtn {
    display: none !important;

    @media (max-width: 989px) {
      display: inline-grid !important;
    }
  }
  &__write {
    @media (max-width: 989px) {
      display: none;
    }
  }
}
.kz-logo {
  display: block;
  flex: none;

  img {
    width: auto;
    height: 58px;
  }
  @media (max-width: 989px) {
    img {
      height: 42px;
    }
  }
  @media (max-width: 375px) {
    img {
      height: 36px;
    }
  }
  &--foot img {
    height: 60px;
  }
}

.kz-menu {
  background: var(--kz-strip);

  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 52px;
  }
  &__mark {
    display: none;
    flex: none;

    img {
      width: auto;
      height: 38px;
    }
  }
  &__call {
    display: none;
    flex: none;
    align-items: center;
    gap: 6px;
    min-height: 38px;
    margin-left: auto;
    padding: 6px 14px;
    border-radius: 12px;
    background: var(--kz-btn);
    color: var(--kz-on-accent);
    font-size: 14px;
    font-weight: 800;
    white-space: nowrap;

    &:hover {
      background: var(--kz-accent-hover);
    }
  }
  &__nav {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
    min-width: 0;
  }
  &__item {
    position: relative;
  }
  &__link {
    display: flex;
    align-items: center;
    gap: 3px;
    min-height: 40px;
    padding: 6px 11px;
    border-radius: 11px;
    color: var(--kz-ink);
    font-size: 15px;
    font-weight: 800;
    white-space: nowrap;
    transition: background 0.15s;

    &:hover,
    &.is-on {
      background: #fff;
    }
    &.is-on {
      color: var(--kz-accent-ink);
    }
  }
  &__chev {
    opacity: 0.55;
  }
  &__pop {
    position: absolute;
    z-index: 60;
    top: calc(100% + 6px);
    left: 0;
    display: none;
    min-width: 240px;
    padding: 8px;
    border: 1px solid var(--kz-line);
    border-radius: 16px;
    background: #fff;
    box-shadow: var(--kz-pop);

    // мостик, чтобы меню не закрывалось по пути курсора
    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: -10px;
      height: 10px;
    }
    a {
      display: block;
      padding: 9px 12px;
      border-radius: 10px;
      color: var(--kz-ink);
      font-size: 15px;
      font-weight: 600;
      line-height: 1.3;
      white-space: nowrap;

      &:hover {
        background: var(--kz-soft);
        color: var(--kz-accent-ink);
      }
    }
  }
  &__item:last-child &__pop {
    left: auto;
    right: 0;
  }
  &__nav:not(.is-quiet) &__item:hover &__pop,
  &__nav:not(.is-quiet) &__item:focus-within &__pop {
    display: block;
  }

  // прилипшее состояние: знак слева, «Отдел продаж» справа (там, где хватает места)
  @media (min-width: 1400px) {
    .kz-header.is-stuck & {
      .kz-menu__mark {
        display: block;
      }
      .kz-menu__call {
        display: inline-flex;
      }
      .kz-menu__nav {
        justify-content: center;
      }
      .kz-menu__link {
        padding: 6px 8px;
      }
    }
  }
  @media (max-width: 1519px) {
    &__link {
      padding: 6px 8px;
      font-size: 14px;
    }
  }
  // ≤1199 — меню оригинала лентой с прокруткой: все пункты видны, подменю — на страницах и в бургере
  @media (max-width: 1199px) {
    &__row {
      min-height: 48px;
    }
    &__nav {
      justify-content: flex-start;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 40px), transparent);
      mask-image: linear-gradient(90deg, #000 calc(100% - 40px), transparent);

      &::-webkit-scrollbar {
        display: none;
      }
    }
    &__chev,
    &__pop {
      display: none !important;
    }
    &__item:last-child {
      padding-right: 32px;
    }
    &__link {
      min-height: 36px;
    }
  }
}

/* ---------- Подвал ---------- */
.kz-foot {
  margin-top: 0;
  padding-top: 56px;
  border-top: 1px solid var(--kz-line);
  background: var(--kz-surface);

  &__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.3fr;
    gap: 32px;

    @media (max-width: 989px) {
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 26px;
    }
  }
  h4 {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 900;
  }
  &__brand p {
    max-width: 340px;
    margin-top: 14px;
    font-size: 15px;
  }
  &__tools {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 18px;
    margin-top: 14px;

    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--kz-ink);
      font-size: 15px;
      font-weight: 700;

      &:hover {
        color: var(--kz-accent-ink);
      }
    }
  }
  ul.kz-foot__list {
    display: grid;
    gap: 7px;
    font-size: 15px;

    a:hover {
      color: var(--kz-accent-ink);
    }
  }
  &__contacts {
    display: grid;
    align-content: start;
    gap: 9px;

    a {
      display: grid;
      line-height: 1.25;

      b {
        color: var(--kz-ink);
        font-weight: 800;
      }
      span {
        color: var(--kz-muted);
        font-size: 13px;
      }
      &:hover b {
        color: var(--kz-accent-ink);
      }
    }
    p {
      color: var(--kz-muted);
      font-size: 14px;
      line-height: 1.45;
    }
  }
  &__legal {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px 24px;
    margin-top: 40px;
    padding-top: 18px;
    padding-bottom: 24px;
    border-top: 1px solid var(--kz-line);
    color: var(--kz-muted);
    font-size: 13px;

    a {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    span:last-child {
      max-width: 620px;
    }
  }
}

/* ---------- Мобильная панель, лист, меню ---------- */
.kz-dock {
  position: fixed;
  z-index: 55;
  left: 0;
  right: 0;
  bottom: 0;
  display: none;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--kz-line);
  background: rgba(255, 255, 255, 0.97);

  @media (max-width: 768px) {
    display: grid;
  }
  a,
  button {
    display: grid;
    justify-items: center;
    gap: 2px;
    min-height: 52px;
    padding: 4px 2px;
    border-radius: 12px;
    color: var(--kz-text);
    font-size: 12px;
    font-weight: 700;

    span {
      white-space: nowrap;
    }
    &.is-on {
      color: var(--kz-accent-ink);
    }
  }
  .kz-dock__main {
    background: var(--kz-btn);
    color: var(--kz-on-accent);
  }
}
.kz-sheet,
.kz-drawer {
  position: fixed;
  z-index: 90;
  inset: 0;
  background: rgba(43, 26, 5, 0.45);
}
.kz-sheet {
  display: grid;
  align-items: end;
  justify-items: center;

  @media (min-width: 769px) {
    align-items: center;
  }
  &__panel {
    width: min(440px, 100%);
    padding: 16px 16px calc(18px + env(safe-area-inset-bottom));
    border-radius: 24px 24px 0 0;
    background: #fff;

    @media (min-width: 769px) {
      border-radius: 24px;
    }
  }
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    padding-left: 6px;

    b {
      color: var(--kz-ink);
      font-size: 19px;
      font-weight: 900;
    }
  }
  &__row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 11px 10px;
    border-radius: 14px;

    .kz-icon {
      flex: none;
      color: var(--kz-accent-ink);
    }
    span {
      display: grid;
      line-height: 1.25;
    }
    b {
      color: var(--kz-ink);
      font-size: 18px;
      font-weight: 900;
    }
    small {
      color: var(--kz-muted);
      font-size: 14px;
    }
    &:hover {
      background: var(--kz-soft);
    }
    &--muted b {
      font-size: 16px;
    }
  }
}
.kz-drawer {
  &__panel {
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
      color: var(--kz-ink);
      font-size: 19px;
      font-weight: 900;
    }
  }
  &__search {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 46px;
    margin-bottom: 8px;
    padding: 0 14px;
    border-radius: var(--kz-r);
    background: var(--kz-surface);
    color: var(--kz-muted);

    input {
      width: 0;
      flex: 1;
      border: 0;
      background: none;
      color: var(--kz-ink);
      outline: none;
    }
  }
  &__link,
  &__group summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 48px;
    padding: 8px 4px;
    border-bottom: 1px solid var(--kz-line);
    color: var(--kz-ink);
    font-weight: 800;
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }
  }
  &__group {
    &[open] summary .kz-icon {
      transform: rotate(180deg);
    }
    a {
      display: block;
      padding: 9px 12px;
      color: var(--kz-text);
      font-size: 15px;
    }
    a:last-child {
      margin-bottom: 8px;
    }
  }
  &__sales {
    display: grid;
    gap: 8px;
    margin-top: 18px;
    padding: 16px;
    border-radius: 18px;
    background: var(--kz-strip);

    b {
      color: var(--kz-ink);
      font-weight: 900;
    }
    a {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--kz-ink);
      font-weight: 800;

      small {
        color: var(--kz-muted);
        font-weight: 600;
      }
    }
  }
}

/* ---------- Лайтбокс, cookie, наверх, тост ---------- */
.kz-lightbox {
  position: fixed;
  z-index: 95;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 56px 72px;
  background: rgba(24, 16, 4, 0.88);

  @media (max-width: 768px) {
    padding: 56px 10px 80px;
  }
  figure {
    display: grid;
    justify-items: center;
    gap: 12px;
    max-width: 100%;
    max-height: 100%;
  }
  img {
    max-width: 100%;
    max-height: calc(100vh - 160px);
    border-radius: 14px;
    background: #fff;
    object-fit: contain;
  }
  figcaption {
    color: #fff;
    font-size: 15px;
    text-align: center;
  }
  &__close,
  &__nav {
    position: absolute;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.14);
    color: #fff;

    &:hover {
      background: rgba(255, 255, 255, 0.26);
    }
  }
  &__close {
    top: 12px;
    right: 12px;
  }
  &__nav {
    top: 50%;
    transform: translateY(-50%);

    &--prev {
      left: 12px;
    }
    &--next {
      right: 12px;
    }
    @media (max-width: 768px) {
      top: auto;
      bottom: 16px;
      transform: none;

      &--prev {
        left: calc(50% - 60px);
      }
      &--next {
        right: calc(50% - 60px);
      }
    }
  }
}
.kz-cookie {
  position: fixed;
  z-index: 70;
  left: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 460px;
  padding: 14px 16px;
  border: 1px solid var(--kz-line);
  border-radius: 18px;
  background: #fff;
  box-shadow: var(--kz-pop);
  font-size: 14px;
  line-height: 1.45;

  a {
    color: var(--kz-accent-ink);
    font-weight: 700;
    text-decoration: underline;
  }
  @media (max-width: 768px) {
    left: 10px;
    right: 10px;
    bottom: 76px;
    max-width: none;
  }
}
.kz-up {
  position: fixed;
  z-index: 60;
  right: 18px;
  bottom: 18px;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--kz-line);
  border-radius: 50%;
  background: #fff;
  color: var(--kz-ink);
  box-shadow: 0 6px 20px rgba(61, 42, 18, 0.14);

  &:hover {
    color: var(--kz-accent-ink);
  }
  @media (max-width: 768px) {
    right: 12px;
    bottom: 80px;
    width: 44px;
    height: 44px;
  }
}
.kz-toast {
  position: fixed;
  z-index: 99;
  left: 50%;
  bottom: 24px;
  max-width: calc(100vw - 32px);
  padding: 12px 20px;
  border-radius: 14px;
  background: var(--kz-ink);
  color: #fff;
  font-weight: 700;
  transform: translateX(-50%);

  @media (max-width: 768px) {
    bottom: 80px;
  }
}

/* ---------- Печать (у оригинала — иконка «Печать» и print.css) ---------- */
@media print {
  .kz-banner,
  .kz-menu,
  .kz-top__sales,
  .kz-top__search,
  .kz-top__write,
  .kz-top__burger,
  .kz-top__searchbtn,
  .kz-top__callbtn,
  .kz-foot__grid,
  .kz-dock,
  .kz-cookie,
  .kz-up,
  .kz-head__print,
  .kz-head__crumbs {
    display: none !important;
  }
  .kz-header {
    position: static;
  }
}
</style>
