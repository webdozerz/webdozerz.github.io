<script lang="ts" setup>
import ZlIcon from '~/components/redesign/zolotieluga/ZlIcon.vue'

const route = useRoute()
const ui = useZolotielugaUi()
const stuck = ref(false)
const navQuiet = ref(false)
const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

useSeoMeta({
  title: '«Золотые луга» — молочная продукция Ситниковского комбината | Концепт редизайна',
  description:
    'Концепт редизайна сайта АО «Золотые луга»: 21 продукт марок «Золотые луга» и «Ситниковское» с жирностью, сроком годности и наградами, «Где купить» — 313 магазинов в 9 городах на карте, партнёрам, вакансии и новости.',
  ogTitle: '«Золотые луга» — концепт редизайна',
  ogDescription: 'Молочные продукты без консервантов и без Е из Ситниково: продукция двух марок и магазины, где её купить, в вашем городе.',
  ogImage: 'https://andryushov.me/redesign/zolotieluga/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'zl-html', lang: 'ru' },
  bodyAttrs: { class: 'zl-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@500;700&family=Golos+Text:wght@400;500;600;700&display=swap',
    },
  ],
})

interface NavItem {
  to: string
  title: string
  sub?: { to: string; title: string; ext?: boolean; note?: string }[]
}
const nav: NavItem[] = [
  { to: '/company', title: 'О компании', sub: [{ to: '/company', title: 'О компании' }, { to: '/awards', title: 'Награды' }, { to: '/info', title: 'Раскрытие информации' }] },
  {
    to: '/products',
    title: 'Продукция',
    sub: [
      { to: '/products?brand=zl', title: 'Золотые луга', note: '14' },
      { to: '/products?brand=sit', title: 'Ситниковское', note: '7' },
      { to: zlZdorovo.url, title: 'Живи здорОво!', ext: true },
      { to: '/products', title: 'Вся продукция', note: '21' },
    ],
  },
  { to: '/where', title: 'Где купить' },
  { to: '/news', title: 'Новости' },
  { to: '/opt', title: 'Партнёрам' },
  {
    to: '/vacancies',
    title: 'Вакансии',
    sub: zlVacancyIntro.cities.map((c) => ({ to: '/vacancies?city=' + encodeURIComponent(c), title: c, note: String(zlVacancies.filter((v) => v.city === c).length) })),
  },
  {
    to: '/contacts',
    title: 'Контакты',
    sub: [
      ...zlOffices.map((o) => ({ to: '/contacts?city=' + encodeURIComponent(o.city), title: o.city })),
      { to: '/contacts#feedback', title: 'Обратная связь' },
    ],
  },
]
const is = (p: string) => route.path.startsWith(zlPath(p))
const link = (to: string) => (to.startsWith('http') ? to : zlPath(to))
const cityCount = computed(() => zlStoreCount(ui.city.value))

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (q.length < 2) return { products: [], news: [] }
  return {
    products: zlProducts.filter((p) => (p.name + ' ' + zlBrandTitle(p.brand) + ' ' + p.desc.join(' ')).toLowerCase().includes(q)).slice(0, 6),
    news: zlNews.filter((n) => (n.title + ' ' + n.body.join(' ')).toLowerCase().includes(q)).slice(0, 4),
  }
})
const openSearch = async () => {
  ui.menu.value = false
  ui.cityPicker.value = false
  ui.search.value = !ui.search.value
  if (ui.search.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}
const toggleCity = () => {
  ui.search.value = false
  ui.cityPicker.value = !ui.cityPicker.value
}
const onKey = (e: KeyboardEvent) => e.key === 'Escape' && ui.closeAll()
const onScroll = () => {
  stuck.value = window.scrollY > 40
}
const year = new Date().getFullYear()

onMounted(() => {
  ui.restoreCity()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})
watch(
  () => route.fullPath,
  () => {
    ui.closeAll()
    // После перехода выпадашка не должна висеть: снимаем фокус и глушим меню, пока курсор не уйдёт с него.
    navQuiet.value = true
    if (import.meta.client) (document.activeElement as HTMLElement | null)?.blur()
  },
)
watch(
  () => ui.menu.value,
  (v) => import.meta.client && document.documentElement.classList.toggle('zl-lock', v),
)
</script>

<template>
  <div class="zl">
    <div class="zl-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="zlContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="zl-header" :class="{ 'is-stuck': stuck, 'has-search': ui.search.value }">
      <div class="zl-header__top">
        <div class="zl-wrap zl-header__toprow">
          <a :href="'tel:' + zlContacts.hotlineTel" class="zl-header__hotline">
            <ZlIcon name="phone" :size="16" />
            <span
              >Горячая линия <b>{{ zlContacts.hotline }}</b></span
            >
            <small>{{ zlContacts.hotlineHours }}</small>
          </a>
          <div class="zl-header__toplinks">
            <NuxtLink :to="zlPath('/opt')">Партнёрам</NuxtLink>
            <a :href="zlContacts.partners" target="_blank" rel="noopener">Личный кабинет <ZlIcon name="external" :size="14" /></a>
            <span class="zl-header__social">
              <a v-for="s in zlContacts.social" :key="s.id" :href="s.url" target="_blank" rel="noopener" :aria-label="s.title"
                ><ZlIcon :name="s.id" :size="18"
              /></a>
            </span>
          </div>
        </div>
      </div>

      <div class="zl-header__main">
        <div class="zl-wrap zl-header__row">
          <button type="button" class="zl-iconbtn zl-header__burger" aria-label="Меню" @click="ui.menu.value = true">
            <ZlIcon name="menu" />
          </button>
          <NuxtLink :to="zlPath('/')" class="zl-logo" aria-label="Золотые луга — на главную">
            <img :src="zlImg('b/clover.png')" alt="" width="150" height="120" />
            <span class="zl-logo__text">
              <b>Золотые луга</b>
              <small>Ситниковский молочный комбинат</small>
            </span>
          </NuxtLink>

          <nav class="zl-nav" :class="{ 'is-quiet': navQuiet }" aria-label="Разделы сайта" @mouseleave="navQuiet = false">
            <div v-for="n in nav" :key="n.to" class="zl-nav__item" :class="{ 'has-sub': n.sub }">
              <NuxtLink :to="zlPath(n.to)" class="zl-nav__link" :class="{ 'is-active': is(n.to) }">
                {{ n.title }}
                <ZlIcon v-if="n.sub" name="down" :size="14" />
              </NuxtLink>
              <div v-if="n.sub" class="zl-nav__drop">
                <template v-for="s in n.sub" :key="s.to">
                  <a v-if="s.ext" :href="s.to" target="_blank" rel="noopener"
                    >{{ s.title }} <ZlIcon name="external" :size="14"
                  /></a>
                  <NuxtLink v-else :to="link(s.to)"
                    >{{ s.title }} <small v-if="s.note">{{ s.note }}</small></NuxtLink
                  >
                </template>
              </div>
            </div>
          </nav>

          <div class="zl-header__tools">
            <button type="button" class="zl-iconbtn" :class="{ 'is-on': ui.search.value }" aria-label="Поиск по сайту" @click="openSearch">
              <ZlIcon :name="ui.search.value ? 'close' : 'search'" />
            </button>
            <div class="zl-citybtn-wrap">
              <button type="button" class="zl-citybtn" :aria-expanded="ui.cityPicker.value" @click="toggleCity">
                <ZlIcon name="pin" :size="20" />
                <span>
                  <b>{{ zlCities[ui.city.value] }}</b>
                  <small>{{ zlPlural(cityCount, 'магазин', 'магазина', 'магазинов') }}</small>
                </span>
                <ZlIcon name="down" :size="16" />
              </button>
              <div v-if="ui.cityPicker.value" class="zl-citypop">
                <p>Где покупаете? Покажем магазины рядом.</p>
                <button
                  v-for="(c, i) in zlCities"
                  :key="c"
                  type="button"
                  :class="{ 'is-on': i === ui.city.value }"
                  @click="ui.setCity(i)"
                >
                  <span>{{ c }}</span>
                  <small>{{ zlStoreCount(i) }}</small>
                </button>
                <NuxtLink :to="zlPath('/where')" class="zl-citypop__all">Все магазины на карте <ZlIcon name="arrow" :size="16" /></NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div class="zl-stitch" aria-hidden="true" />

        <div v-if="ui.search.value" class="zl-search">
          <div class="zl-wrap">
            <label class="zl-search__field">
              <ZlIcon name="search" />
              <input ref="searchInput" v-model="query" type="search" placeholder="Кефир, творог, награды, выставка…" aria-label="Поиск по сайту" />
            </label>
            <div v-if="query.trim().length >= 2" class="zl-search__res">
              <div v-if="results.products.length" class="zl-search__group">
                <h3>Продукция</h3>
                <NuxtLink v-for="p in results.products" :key="p.id" :to="zlProductPath(p.id)" class="zl-search__prod">
                  <img :src="zlImg(p.imgs[0])" alt="" width="48" height="48" />
                  <span
                    ><b>{{ p.name }}</b><small>{{ zlBrandTitle(p.brand) }}<template v-if="p.fats.length"> · {{ p.fats.join(', ') }}</template></small></span
                  >
                </NuxtLink>
              </div>
              <div v-if="results.news.length" class="zl-search__group">
                <h3>Новости</h3>
                <NuxtLink v-for="n in results.news" :key="n.id" :to="zlPath('/news/' + n.id)" class="zl-search__news"
                  ><small>{{ n.date }}</small>{{ n.title }}</NuxtLink
                >
              </div>
              <p v-if="!results.products.length && !results.news.length" class="zl-search__empty">
                Ничего не нашли по запросу «{{ query }}». В концепте поиск идёт по продукции и последним новостям.
              </p>
            </div>
            <p v-else class="zl-search__hint">
              Часто ищут:
              <button v-for="q in ['кефир', 'творог', 'масло', 'выставка']" :key="q" type="button" @click="query = q">{{ q }}</button>
            </p>
          </div>
        </div>
      </div>
    </header>
    <div v-if="ui.search.value || ui.cityPicker.value" class="zl-shade" @click="ui.closeAll()" />

    <Transition name="zl-drawer">
      <aside v-if="ui.menu.value" class="zl-drawer" aria-label="Меню">
        <div class="zl-drawer__head">
          <b>Меню</b>
          <button type="button" class="zl-iconbtn" aria-label="Закрыть меню" @click="ui.menu.value = false"><ZlIcon name="close" /></button>
        </div>
        <nav class="zl-drawer__nav">
          <template v-for="n in nav" :key="n.to">
            <details v-if="n.sub" :open="n.title === 'Продукция'" class="zl-drawer__group">
              <summary>{{ n.title }} <ZlIcon name="down" :size="18" /></summary>
              <div class="zl-drawer__sub">
                <template v-for="s in n.sub" :key="s.to">
                  <a v-if="s.ext" :href="s.to" target="_blank" rel="noopener">{{ s.title }} <ZlIcon name="external" :size="14" /></a>
                  <NuxtLink v-else :to="link(s.to)"
                    >{{ s.title }} <small v-if="s.note">{{ s.note }}</small></NuxtLink
                  >
                </template>
              </div>
            </details>
            <NuxtLink v-else :to="zlPath(n.to)" class="zl-drawer__single">{{ n.title }}</NuxtLink>
          </template>
        </nav>
        <div class="zl-drawer__foot">
          <a :href="'tel:' + zlContacts.hotlineTel" class="zl-btn zl-btn--main"><ZlIcon name="phone" :size="18" /> {{ zlContacts.hotline }}</a>
          <p>Горячая линия для покупателей, {{ zlContacts.hotlineHours }}</p>
          <a :href="zlContacts.partners" target="_blank" rel="noopener" class="zl-btn zl-btn--line">Личный кабинет партнёра <ZlIcon name="external" :size="16" /></a>
          <div class="zl-drawer__social">
            <a v-for="s in zlContacts.social" :key="s.id" :href="s.url" target="_blank" rel="noopener" :aria-label="s.title"><ZlIcon :name="s.id" /></a>
          </div>
        </div>
      </aside>
    </Transition>
    <div v-if="ui.menu.value" class="zl-shade zl-shade--menu" @click="ui.menu.value = false" />

    <main class="zl-main">
      <NuxtPage />
    </main>

    <footer class="zl-footer">
      <div class="zl-stitch" aria-hidden="true" />
      <div class="zl-wrap zl-footer__grid">
        <div class="zl-footer__brand">
          <NuxtLink :to="zlPath('/')" class="zl-logo">
            <img :src="zlImg('b/clover.png')" alt="" width="150" height="120" />
            <span class="zl-logo__text"><b>Золотые луга</b><small>Ситниковский молочный комбинат</small></span>
          </NuxtLink>
          <p>Молочные продукты без консервантов и без Е. Производство — в селе Ситниково Тюменской области, филиалы в 8 городах Урала и Западной Сибири.</p>
          <div class="zl-footer__social">
            <a v-for="s in zlContacts.social" :key="s.id" :href="s.url" target="_blank" rel="noopener" :aria-label="s.title"><ZlIcon :name="s.id" /></a>
          </div>
        </div>
        <nav class="zl-footer__col" aria-label="Продукция">
          <h3>Продукция</h3>
          <NuxtLink :to="zlPath('/products?brand=zl')">Золотые луга</NuxtLink>
          <NuxtLink :to="zlPath('/products?brand=sit')">Ситниковское</NuxtLink>
          <a :href="zlZdorovo.url" target="_blank" rel="noopener">Живи здорОво! <ZlIcon name="external" :size="14" /></a>
          <NuxtLink :to="zlPath('/where')">Где купить</NuxtLink>
          <NuxtLink :to="zlPath('/awards')">Награды</NuxtLink>
        </nav>
        <nav class="zl-footer__col" aria-label="Компания">
          <h3>Компания</h3>
          <NuxtLink :to="zlPath('/company')">О компании</NuxtLink>
          <NuxtLink :to="zlPath('/news')">Новости</NuxtLink>
          <NuxtLink :to="zlPath('/vacancies')">Вакансии</NuxtLink>
          <NuxtLink :to="zlPath('/opt')">Партнёрам</NuxtLink>
          <a :href="zlContacts.partners" target="_blank" rel="noopener">Личный кабинет <ZlIcon name="external" :size="14" /></a>
          <NuxtLink :to="zlPath('/info')">Раскрытие информации</NuxtLink>
        </nav>
        <div class="zl-footer__col zl-footer__contacts">
          <h3>Контакты</h3>
          <a :href="'tel:' + zlContacts.hotlineTel" class="zl-footer__phone">{{ zlContacts.hotline }}</a>
          <small>горячая линия, {{ zlContacts.hotlineHours }}</small>
          <a :href="'tel:' + zlContacts.receptionTel">{{ zlContacts.reception }} — приёмная</a>
          <a :href="'mailto:' + zlContacts.email">{{ zlContacts.email }}</a>
          <span>{{ zlContacts.address }}</span>
          <NuxtLink :to="zlPath('/contacts#feedback')" class="zl-footer__more">Обратная связь <ZlIcon name="arrow" :size="16" /></NuxtLink>
        </div>
      </div>
      <div class="zl-wrap zl-footer__bottom">
        <span>© АО «Золотые луга», {{ year }}</span>
        <span
          >Концепт редизайна. Тексты, фотографии продукции, эмблемы марок и список магазинов принадлежат АО «Золотые луга».
          <NuxtLink to="/redesign/">Другие концепты</NuxtLink></span
        >
      </div>
    </footer>

    <nav class="zl-tabbar" aria-label="Быстрые действия">
      <NuxtLink :to="zlPath('/products')" :class="{ 'is-active': is('/products') }"><ZlIcon name="milk" /><span>Продукция</span></NuxtLink>
      <NuxtLink :to="zlPath('/where')" :class="{ 'is-active': is('/where') }"
        ><ZlIcon name="pin" /><span>Где купить</span></NuxtLink
      >
      <a :href="'tel:' + zlContacts.hotlineTel"><ZlIcon name="phone" /><span>8-800</span></a>
    </nav>
  </div>
</template>

<style lang="scss">
.zl-html {
  scroll-padding-top: 110px;
}
.zl-html.zl-lock {
  overflow: hidden;
}
.zl-body {
  margin: 0;
  background: #fff;
}

.zl {
  --zl-accent: #c92315;
  --zl-accent-h: #a8190d;
  --zl-ink: #2a1715;
  --zl-text: #3d2f2d;
  --zl-muted: #776a67;
  --zl-surface: #f4f5f7;
  --zl-soft: #fdeeec;
  --zl-line: #e5e6ea;
  --zl-gold: #d99a00;
  --zl-gold-bg: #fdf4dc;
  --zl-sit: #2f68a6;
  --zl-sit-bg: #e9f1fa;
  --zl-grass: #3f8a2a;
  --zl-r: 10px;
  --zl-R: 18px;
  --zl-head: 'Ubuntu', 'Trebuchet MS', sans-serif;
  font-family: 'Golos Text', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  color: var(--zl-text);
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
:where(.zl) {
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
  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }
  h1,
  h2,
  h3 {
    font-family: var(--zl-head);
    font-weight: 700;
    color: var(--zl-ink);
    line-height: 1.15;
  }
}
.zl-icon {
  flex: none;
  display: block;
}

.zl-wrap {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
}
.zl-main {
  flex: 1;
}

/* Вышивка — их орнамент с сайта, лентой */
.zl-stitch {
  height: 12px;
  background: url('/redesign/zolotieluga/b/stitch-tile.png') repeat-x 0 0 / auto 12px;
  image-rendering: pixelated;
  opacity: 0.9;
}

/* Баннер концепта */
.zl-banner {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 8px 16px;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;
  background: var(--zl-ink);
  color: #f2e7e5;
  a {
    color: #fff;
    text-decoration: underline;
    font-weight: 700;
  }
}

/* Кнопки */
.zl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: var(--zl-r);
  font-weight: 600;
  font-size: 15px;
  line-height: 1.2;
  white-space: nowrap;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
  &--main {
    background: var(--zl-accent);
    color: #fff;
    &:hover {
      background: var(--zl-accent-h);
    }
  }
  &--soft {
    background: var(--zl-soft);
    color: var(--zl-accent);
    &:hover {
      background: #fbdcd8;
    }
  }
  &--line,
  &--line:focus,
  &--line:active {
    background: #fff;
    color: var(--zl-ink);
    border: 1px solid var(--zl-line);
  }
  &--line:hover {
    border-color: var(--zl-accent);
    color: var(--zl-accent);
  }
  &--small {
    min-height: 38px;
    padding: 0 14px;
    font-size: 14px;
  }
}
.zl-iconbtn {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--zl-r);
  color: var(--zl-ink);
  transition:
    background 0.2s,
    color 0.2s;
  &:hover,
  &.is-on {
    background: var(--zl-surface);
    color: var(--zl-accent);
  }
}
.zl-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: var(--zl-accent);
  &:hover {
    color: var(--zl-accent-h);
  }
}

/* Шапка */
.zl-header {
  position: sticky;
  top: -40px;
  z-index: 50;
  background: #fff;
  &__top {
    height: 40px;
    background: var(--zl-surface);
    font-size: 13px;
  }
  &__toprow {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  &__hotline {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    min-width: 0;
    color: var(--zl-text);
    .zl-icon {
      color: var(--zl-accent);
    }
    b {
      color: var(--zl-ink);
    }
    small {
      color: var(--zl-muted);
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &__toplinks {
    display: flex;
    align-items: center;
    gap: 18px;
    white-space: nowrap;
    > a {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
      &:hover {
        color: var(--zl-accent);
      }
    }
  }
  &__social {
    display: flex;
    gap: 6px;
    a {
      color: var(--zl-muted);
      display: inline-flex;
      &:hover {
        color: var(--zl-accent);
      }
    }
  }
  &__main {
    position: relative;
    background: #fff;
    transition: box-shadow 0.2s;
  }
  &.is-stuck &__main {
    box-shadow: 0 8px 24px rgba(42, 23, 21, 0.08);
  }
  &__row {
    height: 76px;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  &__burger {
    display: none;
    margin-left: -10px;
  }
  &__tools {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.zl-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  img {
    width: 52px;
    height: auto;
  }
  &__text {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
    b {
      font-family: var(--zl-head);
      font-weight: 700;
      font-size: 22px;
      color: var(--zl-accent);
      letter-spacing: -0.01em;
    }
    small {
      font-size: 12px;
      color: var(--zl-muted);
      margin-top: 3px;
    }
  }
}

.zl-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 8px;
  &__item {
    position: relative;
  }
  &__link {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    height: 44px;
    padding: 0 10px;
    border-radius: var(--zl-r);
    font-weight: 500;
    font-size: 15px;
    color: var(--zl-ink);
    white-space: nowrap;
    transition:
      background 0.2s,
      color 0.2s;
    .zl-icon {
      color: var(--zl-muted);
    }
    &:hover,
    &.is-active {
      color: var(--zl-accent);
    }
    &.is-active {
      background: var(--zl-soft);
    }
  }
  &__drop {
    position: absolute;
    z-index: 3;
    top: calc(100% + 36px);
    left: -8px;
    min-width: 240px;
    padding: 8px;
    background: #fff;
    border: 1px solid var(--zl-line);
    border-radius: 14px;
    box-shadow:
      0 2px 6px rgba(42, 23, 21, 0.08),
      0 22px 54px rgba(42, 23, 21, 0.18);
    display: none;
    flex-direction: column;
    a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 15px;
      white-space: nowrap;
      color: var(--zl-ink);
      &:hover {
        background: var(--zl-surface);
        color: var(--zl-accent);
      }
      small {
        color: var(--zl-muted);
        font-size: 13px;
      }
    }
    /* мостик над лентой-вышивкой, чтобы меню не закрывалось по пути курсора */
    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 100%;
      height: 40px;
    }
  }
  &__item.has-sub:hover &__drop,
  &__item.has-sub:focus-within &__drop {
    display: flex;
  }
}
.zl-nav.is-quiet .zl-nav__item .zl-nav__drop,
.zl-header.has-search .zl-nav__drop {
  display: none;
}

.zl-citybtn-wrap {
  position: relative;
}
.zl-citybtn,
.zl-citybtn:focus,
.zl-citybtn:active {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 12px 0 10px;
  border: 1px solid var(--zl-line);
  border-radius: 12px;
  background: #fff;
  text-align: left;
  .zl-icon:first-child {
    color: var(--zl-accent);
  }
  span {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
    white-space: nowrap;
  }
  b {
    font-weight: 600;
    color: var(--zl-ink);
    font-size: 15px;
  }
  small {
    font-size: 12px;
    color: var(--zl-muted);
  }
}
.zl-citybtn:hover {
  border-color: var(--zl-accent);
}
.zl-citypop {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 290px;
  padding: 10px;
  background: #fff;
  border: 1px solid var(--zl-line);
  border-radius: 16px;
  box-shadow:
    0 2px 6px rgba(42, 23, 21, 0.08),
    0 22px 54px rgba(42, 23, 21, 0.2);
  z-index: 5;
  p {
    padding: 6px 8px 10px;
    font-size: 14px;
    color: var(--zl-muted);
  }
  > button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 9px 10px;
    border-radius: 8px;
    font-size: 15px;
    color: var(--zl-ink);
    small {
      color: var(--zl-muted);
    }
    &:hover {
      background: var(--zl-surface);
    }
    &.is-on {
      background: var(--zl-soft);
      color: var(--zl-accent);
      font-weight: 600;
    }
  }
  &__all {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    padding: 10px;
    border-top: 1px solid var(--zl-line);
    font-weight: 600;
    color: var(--zl-accent);
  }
}

.zl-search {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  background: #fff;
  padding: 20px 0 26px;
  border-top: 1px solid var(--zl-line);
  box-shadow: 0 22px 54px rgba(42, 23, 21, 0.18);
  max-height: calc(100vh - 140px);
  overflow: auto;
  &__field {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 56px;
    padding: 0 18px;
    border: 2px solid var(--zl-accent);
    border-radius: 14px;
    .zl-icon {
      color: var(--zl-accent);
    }
    input {
      flex: 1;
      min-width: 0;
      width: 0;
      border: 0;
      outline: 0;
      font-size: 17px;
      background: none;
    }
  }
  &__res {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 28px;
    margin-top: 18px;
  }
  &__group h3 {
    font-size: 14px;
    color: var(--zl-muted);
    font-family: inherit;
    font-weight: 600;
    margin-bottom: 8px;
  }
  &__prod {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 8px;
    border-radius: 10px;
    img {
      width: 48px;
      height: 48px;
      object-fit: contain;
      mix-blend-mode: multiply;
    }
    span {
      display: flex;
      flex-direction: column;
    }
    b {
      font-weight: 600;
      color: var(--zl-ink);
    }
    small {
      font-size: 13px;
      color: var(--zl-muted);
    }
    &:hover {
      background: var(--zl-surface);
    }
  }
  &__news {
    display: block;
    padding: 8px;
    border-radius: 10px;
    color: var(--zl-ink);
    small {
      display: block;
      color: var(--zl-muted);
      font-size: 13px;
    }
    &:hover {
      background: var(--zl-surface);
    }
  }
  &__empty,
  &__hint {
    margin-top: 16px;
    color: var(--zl-muted);
  }
  &__hint button {
    margin: 4px 0 0 8px;
    padding: 5px 12px;
    border-radius: 99px;
    background: var(--zl-surface);
    color: var(--zl-ink);
    &:hover {
      color: var(--zl-accent);
    }
  }
}

.zl-shade {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(42, 23, 21, 0.25);
  &--menu {
    z-index: 60;
  }
}

.zl-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 70;
  width: min(380px, 100%);
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: auto;
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px 12px 20px;
    border-bottom: 1px solid var(--zl-line);
    b {
      font-family: var(--zl-head);
      font-size: 20px;
      color: var(--zl-ink);
    }
  }
  &__nav {
    padding: 8px 12px;
  }
  &__group summary,
  &__single {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 8px;
    font-weight: 600;
    font-size: 17px;
    color: var(--zl-ink);
    cursor: pointer;
    list-style: none;
    &::-webkit-details-marker {
      display: none;
    }
  }
  &__group[open] summary .zl-icon {
    transform: rotate(180deg);
  }
  &__sub {
    display: flex;
    flex-direction: column;
    padding: 0 0 8px 8px;
    a {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      border-radius: 8px;
      color: var(--zl-text);
      small {
        color: var(--zl-muted);
      }
      &:hover {
        background: var(--zl-surface);
      }
    }
  }
  &__foot {
    margin-top: auto;
    padding: 18px 20px 24px;
    border-top: 1px solid var(--zl-line);
    display: flex;
    flex-direction: column;
    gap: 10px;
    p {
      font-size: 13px;
      color: var(--zl-muted);
    }
  }
  &__social {
    display: flex;
    gap: 14px;
    color: var(--zl-muted);
  }
}
.zl-drawer-enter-active,
.zl-drawer-leave-active {
  transition: transform 0.25s;
}
.zl-drawer-enter-from,
.zl-drawer-leave-to {
  transform: translateX(-100%);
}

/* Подвал */
.zl-footer {
  margin-top: 88px;
  background: var(--zl-surface);
  font-size: 14px;
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) repeat(2, minmax(0, 0.8fr)) minmax(0, 1.2fr);
    gap: 32px;
    padding-top: 48px;
    padding-bottom: 36px;
  }
  &__brand p {
    margin-top: 16px;
    max-width: 340px;
    color: var(--zl-muted);
  }
  &__social {
    display: flex;
    gap: 14px;
    margin-top: 18px;
    color: var(--zl-muted);
    a:hover {
      color: var(--zl-accent);
    }
  }
  &__col {
    display: flex;
    flex-direction: column;
    gap: 9px;
    h3 {
      font-size: 16px;
      margin-bottom: 4px;
    }
    a {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      &:hover {
        color: var(--zl-accent);
      }
    }
  }
  &__contacts small {
    color: var(--zl-muted);
    margin-top: -6px;
  }
  &__phone {
    font-family: var(--zl-head);
    font-size: 20px;
    font-weight: 700;
    color: var(--zl-ink);
  }
  &__more {
    color: var(--zl-accent);
    font-weight: 600;
  }
  &__bottom {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    padding-top: 18px;
    padding-bottom: 24px;
    border-top: 1px solid var(--zl-line);
    color: var(--zl-muted);
    font-size: 13px;
    a {
      text-decoration: underline;
    }
  }
}

.zl-tabbar {
  display: none;
}

/* Общие блоки страниц */
.zl-section {
  padding-top: 72px;
}
.zl-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  h2 {
    font-size: clamp(26px, 2.6vw, 34px);
  }
  p {
    margin-top: 8px;
    color: var(--zl-muted);
    max-width: 640px;
  }
}
.zl-page {
  padding-top: 28px;
  h1 {
    font-size: clamp(30px, 3.4vw, 44px);
  }
  &__lead {
    margin-top: 12px;
    max-width: 760px;
    font-size: 17px;
    color: var(--zl-text);
  }
}
.zl-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
  font-size: 14px;
  color: var(--zl-muted);
  a:hover {
    color: var(--zl-accent);
  }
  span + span::before {
    content: '/';
    margin-right: 6px;
    color: #c4bdbb;
  }
}
.zl-tabs {
  display: flex;
  gap: 6px;
  padding: 5px;
  border-radius: 14px;
  background: var(--zl-surface);
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  > button,
  > a {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 40px;
    padding: 0 14px;
    border-radius: 10px;
    font-weight: 500;
    color: var(--zl-ink);
    white-space: nowrap;
    small {
      color: var(--zl-muted);
      font-size: 13px;
    }
    &:hover {
      color: var(--zl-accent);
    }
    &.is-on {
      background: #fff;
      color: var(--zl-accent);
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(42, 23, 21, 0.12);
    }
  }
}
.zl-fat {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 9px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  background: #e8f1fa;
  color: #2a62a0;
  &--low {
    background: #eaf5fb;
    color: #2c7fae;
  }
  &--high {
    background: #e3ebf7;
    color: #1f4c8e;
  }
  &--rich {
    background: var(--zl-gold-bg);
    color: #8a5a00;
  }
}
.zl-medal {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #8a5a00;
  .zl-icon {
    color: var(--zl-gold);
  }
}
.zl-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  li {
    display: flex;
    gap: 10px;
    .zl-icon {
      margin-top: 2px;
      color: var(--zl-accent);
    }
  }
}
.zl-panel {
  background: var(--zl-surface);
  border-radius: var(--zl-R);
  padding: 28px;
}
.zl-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--zl-ink);
  input,
  textarea,
  select {
    width: 100%;
    min-height: 48px;
    padding: 12px 14px;
    border: 1px solid var(--zl-line);
    border-radius: var(--zl-r);
    background: #fff;
    font-size: 15px;
    font-weight: 400;
    outline: 0;
    &:focus {
      border-color: var(--zl-accent);
    }
  }
  textarea {
    min-height: 120px;
    resize: vertical;
  }
}
.zl-demo {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 7px;
  background: var(--zl-gold-bg);
  color: #8a5a00;
  font-size: 13px;
  font-weight: 600;
}
.zl-rail {
  position: relative;
  &__track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: calc((100% - 4 * 16px) / 4.3);
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 12px;
    scrollbar-width: thin;
    scrollbar-color: #e2c9c5 transparent;
    > * {
      scroll-snap-align: start;
    }
  }
  &__nav {
    display: flex;
    gap: 8px;
  }
  &__btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid var(--zl-line);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--zl-ink);
    &:hover {
      color: var(--zl-accent);
      border-color: var(--zl-accent);
    }
  }
}

/* Общие для нескольких страниц: новости, награды, видео */
.zl-awards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.zl-award {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px;
  border-radius: var(--zl-R);
  background: var(--zl-gold-bg);
  > .zl-icon {
    color: var(--zl-gold);
  }
  small {
    color: #8a5a00;
    font-weight: 600;
  }
  h3 {
    font-size: 17px;
    line-height: 1.25;
  }
  p {
    font-size: 14px;
    color: var(--zl-text);
  }
}
.zl-newsgrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.zl-newscard {
  display: flex;
  flex-direction: column;
  gap: 8px;
  &__img {
    aspect-ratio: 16 / 10;
    border-radius: var(--zl-R);
    overflow: hidden;
    background: var(--zl-surface);
    margin-bottom: 6px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
  }
  small {
    color: var(--zl-muted);
    font-size: 13px;
  }
  h3 {
    font-size: 18px;
    line-height: 1.3;
  }
  &:hover h3 {
    color: var(--zl-accent);
  }
  &:hover img {
    transform: scale(1.04);
  }
}
.zl-video {
  grid-column: 1 / -1;
  &__frame {
    position: relative;
    aspect-ratio: 16 / 9;
    max-width: 820px;
    border-radius: var(--zl-R);
    overflow: hidden;
    background: var(--zl-ink);
    iframe,
    .zl-video__poster {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.85;
    }
  }
  &__poster span {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 76px;
    height: 76px;
    margin: -38px 0 0 -38px;
    border-radius: 50%;
    background: var(--zl-accent);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
@media (max-width: 1199px) {
  .zl-awards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 989px) {
  .zl-newsgrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 576px) {
  .zl-awards,
  .zl-newsgrid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 1400px) {
  .zl-nav {
    gap: 0;
    margin-left: 0;
  }
  .zl-nav__link {
    padding: 0 7px;
    font-size: 14px;
  }
  .zl-header__row {
    gap: 14px;
  }
  .zl-logo__text small {
    display: none;
  }
}
@media (max-width: 1199px) {
  .zl-nav {
    display: none;
  }
  .zl-header__burger {
    display: inline-flex;
  }
  .zl-logo__text small {
    display: block;
  }
  .zl-rail__track {
    grid-auto-columns: calc((100% - 2 * 16px) / 3.2);
  }
  .zl-footer__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .zl-footer__brand {
    grid-column: 1 / -1;
  }
}
@media (max-width: 989px) {
  .zl-header__hotline small {
    display: none;
  }
  .zl-rail__nav {
    display: none;
  }
  .zl-search__res {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 768px) {
  .zl-wrap {
    padding-left: 16px;
    padding-right: 16px;
  }
  .zl-html {
    scroll-padding-top: 80px;
  }
  .zl-header {
    top: -36px;
    &__top {
      height: 36px;
    }
    &__toplinks > a,
    &__social {
      display: none;
    }
    &__toplinks > a:first-child {
      display: inline-flex;
    }
    &__row {
      height: 64px;
      gap: 8px;
    }
  }
  .zl-logo img {
    width: 42px;
  }
  .zl-logo__text b {
    font-size: 19px;
  }
  .zl-logo__text small {
    display: none;
  }
  .zl-citybtn,
  .zl-citybtn:focus,
  .zl-citybtn:active {
    height: 44px;
    padding: 0 8px;
    small {
      display: none;
    }
  }
  .zl-citypop {
    position: fixed;
    left: 16px;
    right: 16px;
    top: 120px;
    width: auto;
  }
  .zl-section {
    padding-top: 52px;
  }
  .zl-panel {
    padding: 20px;
  }
  .zl-rail__track {
    grid-auto-columns: calc((100% - 16px) / 2.2);
  }
  .zl-footer {
    margin-top: 64px;
    padding-bottom: 68px;
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    &__contacts {
      grid-column: 1 / -1;
    }
    &__bottom {
      flex-direction: column;
      gap: 8px;
    }
  }
  .zl-tabbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 45;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background: #fff;
    border-top: 1px solid var(--zl-line);
    box-shadow: 0 -6px 20px rgba(42, 23, 21, 0.08);
    padding-bottom: env(safe-area-inset-bottom);
    a {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 8px 4px 9px;
      font-size: 12px;
      font-weight: 500;
      color: var(--zl-muted);
      &.is-active {
        color: var(--zl-accent);
      }
      &:last-child {
        color: var(--zl-accent);
      }
    }
  }
}
@media (max-width: 576px) {
  .zl-header__hotline > span {
    font-size: 13px;
  }
  .zl-header__row {
    gap: 6px;
  }
  .zl-header__tools {
    gap: 2px;
  }
  .zl-citybtn,
  .zl-citybtn:focus,
  .zl-citybtn:active {
    width: 44px;
    padding: 0;
    justify-content: center;
    border-color: transparent;
    > span,
    > .zl-icon:last-child {
      display: none;
    }
  }
  .zl-rail__track {
    grid-auto-columns: calc((100% - 12px) / 1.7);
    gap: 12px;
  }
}
@media (max-width: 375px) {
  .zl-header__toplinks {
    display: none;
  }
  .zl-logo__text b {
    font-size: 17px;
  }
  .zl-logo img {
    width: 36px;
  }
  .zl-citybtn b {
    font-size: 14px;
  }
}
</style>
