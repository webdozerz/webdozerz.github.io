<script lang="ts" setup>
import AkIcon from '~/components/redesign/aks124/AkIcon.vue'
import AkSearch from '~/components/redesign/aks124/AkSearch.vue'
import AkPriceForm from '~/components/redesign/aks124/AkPriceForm.vue'
import AkModals from '~/components/redesign/aks124/AkModals.vue'

const route = useRoute()
const list = useAks124List()
const ui = useAks124Ui()

useSeoMeta({
  title: 'ИП Аксюченко — бакалея, кондитерка, чай и кофе оптом в Красноярске | Концепт редизайна',
  description:
    'Концепт редизайна сайта aks124.ru: каталог по брендам с ценой за штуку и упаковку, поиск по прайсу, список заказа упаковками с готовым письмом, бесплатная доставка по Красноярску от 2 000 ₽.',
  ogTitle: 'ИП Аксюченко — концепт редизайна',
  ogDescription: 'Специи, консервы, шоколад, чай и кофе оптом со склада в Красноярске: листы брендов, поиск по прайсу, список заказа упаковками.',
  ogImage: 'https://andryushov.me/redesign/aks124/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'ak-html', lang: 'ru' },
  bodyAttrs: { class: 'ak-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&display=swap' },
  ],
})

const nav = [
  { to: akPath('/brands'), label: 'Бренды А–Я' },
  { to: akPath('/prices'), label: 'Цены' },
  { to: akPath('/promo'), label: 'Акции' },
  { to: akPath('/delivery'), label: 'Доставка и оплата' },
  { to: akPath('/about'), label: 'О компании' },
  { to: akPath('/contacts'), label: 'Контакты' },
]
const isCatalog = computed(() => route.path.startsWith(akSectionPath()))
const isList = computed(() => route.path.startsWith(akPath('/list')))
const year = new Date().getFullYear()

// «Каталог»: разделы слева, бренды наведённого раздела справа
const catOpen = ref(false)
const catActive = ref(akSections[0].id)
const catBrands = computed(() => akBrandsOf(catActive.value))
const catSection = computed(() => akSection(catActive.value)!)

watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    ui.photo.value = null
    catOpen.value = false
  },
)

// Липкая шапка: верхняя полоса с условиями уезжает, строка со знаком, поиском и «Списком» остаётся у верха.
const header = ref<HTMLElement | null>(null)
const strip = ref<HTMLElement | null>(null)
const stick = ref(0)
const scrolled = ref(false)
const measure = () => {
  stick.value = strip.value?.offsetHeight ?? 0
}
const onScroll = () => {
  scrolled.value = window.scrollY > 640
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') catOpen.value = false
}
onMounted(() => {
  list.persist()
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
})
</script>

<template>
  <div class="ak" :class="{ 'has-bar': list.count.value && !isList }">
    <div class="ak-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="akContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header ref="header" class="ak-header" :style="{ top: `${-stick}px` }">
      <div ref="strip" class="ak-strip">
        <div class="ak-wrap ak-strip__row">
          <NuxtLink :to="akPath('/delivery')" class="ak-strip__free">
            <AkIcon name="truck" :size="18" />
            <span class="ak-strip__long">Бесплатная доставка по Красноярску от {{ akMoney0(akFreeFrom) }}</span>
            <span class="ak-strip__short">Доставка от {{ akMoney0(akFreeFrom) }} бесплатно</span>
          </NuxtLink>
          <span class="ak-strip__info">{{ akContacts.hours }} · склад на Дудинской, 6</span>
          <div class="ak-strip__right">
            <a v-for="ph in akContacts.phones" :key="ph.href" :href="ph.href" class="ak-strip__phone">{{ ph.label }}</a>
            <button type="button" class="ak-strip__call" @click="ui.modal.value = 'call'">Обратный звонок</button>
          </div>
        </div>
      </div>

      <div class="ak-wrap ak-bar-row">
        <button type="button" class="ak-iconbtn ak-bar-row__burger" aria-label="Меню" @click="ui.menu.value = true"><AkIcon name="menu" /></button>
        <NuxtLink :to="akPath()" class="ak-mark" aria-label="ИП Аксюченко, на главную">
          <span class="ak-mark__bar" aria-hidden="true" />
          <span class="ak-mark__name">Аксюченко</span>
          <span class="ak-mark__sub">продукты оптом<br />Красноярск, с 2005</span>
        </NuxtLink>

        <button type="button" class="ak-btn ak-catbtn" :aria-expanded="catOpen" @click="catOpen = !catOpen">
          <AkIcon :name="catOpen ? 'close' : 'grid'" :size="20" />
          <span>Каталог</span>
        </button>

        <div class="ak-bar-row__search">
          <AkSearch :suggest="!isCatalog" />
        </div>

        <button type="button" class="ak-iconbtn ak-bar-row__login" aria-label="Вход для клиентов" @click="ui.modal.value = 'login'"><AkIcon name="user" /></button>
        <a :href="akContacts.phones[0].href" class="ak-iconbtn ak-bar-row__tel" aria-label="Позвонить"><AkIcon name="phone" /></a>
        <NuxtLink :to="akPath('/list')" class="ak-listbtn" :class="{ 'is-full': list.count.value }" aria-label="Список заказа">
          <AkIcon name="list" />
          <span class="ak-listbtn__label">{{ list.count.value ? akMoney0(list.total.value) : 'Список' }}</span>
          <span v-if="list.count.value" class="ak-dot">{{ list.count.value }}</span>
        </NuxtLink>
      </div>

      <div v-if="catOpen" class="ak-wrap ak-mega-wrap">
        <div class="ak-mega" @mouseleave="catOpen = false">
          <nav class="ak-mega__sections" aria-label="Разделы каталога">
            <NuxtLink
              v-for="s in akSections"
              :key="s.id"
              :to="akSectionPath(s.id)"
              :class="{ 'is-on': s.id === catActive }"
              @mouseenter="catActive = s.id"
              @focus="catActive = s.id"
            >
              <span>{{ s.title }}</span>
              <small>{{ s.count }}</small>
            </NuxtLink>
          </nav>
          <div class="ak-mega__brands">
            <div class="ak-mega__head">
              <img v-if="catSection.img" :src="catSection.img" alt="" width="72" height="72" />
              <div>
                <b>{{ catSection.title }}</b>
                <small>{{ akPositions(catSection.count) }}<template v-if="akMinPrice(catSection.id)"> · от {{ akMoney(akMinPrice(catSection.id)) }}</template></small>
              </div>
              <NuxtLink :to="akSectionPath(catSection.id)" class="ak-more">Весь раздел <AkIcon name="arrow" :size="18" /></NuxtLink>
            </div>
            <ul class="ak-mega__list">
              <li v-for="b in catBrands" :key="b.id">
                <NuxtLink :to="akBrandPath(b)">{{ b.title }}<small>{{ b.count }}</small></NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
    <div v-if="catOpen" class="ak-backdrop" @click="catOpen = false" />

    <nav class="ak-ribbon" aria-label="Разделы сайта">
      <div class="ak-wrap ak-ribbon__row">
        <NuxtLink v-for="n in nav" :key="n.to" :to="n.to">{{ n.label }}</NuxtLink>
        <a href="#price-form" class="ak-ribbon__price"><AkIcon name="download" :size="18" />Получить прайс-лист</a>
      </div>
    </nav>

    <main class="ak-main">
      <NuxtPage />
    </main>

    <section id="price-form" class="ak-wrap ak-section ak-pricebox">
      <AkPriceForm />
    </section>

    <footer class="ak-footer">
      <div class="ak-wrap ak-footer__grid">
        <div class="ak-footer__brand">
          <NuxtLink :to="akPath()" class="ak-mark">
            <span class="ak-mark__bar" aria-hidden="true" />
            <span class="ak-mark__name">Аксюченко</span>
          </NuxtLink>
          <p>Оптовая торговля продуктами питания более 20 лет: специи, консервы, кондитерка, чай и кофе со склада в Красноярске.</p>
        </div>
        <div>
          <h3>Каталог</h3>
          <ul class="ak-footer__cols">
            <li v-for="s in akSections" :key="s.id"><NuxtLink :to="akSectionPath(s.id)">{{ s.title }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3>Покупателям</h3>
          <ul>
            <li v-for="n in nav" :key="n.to"><NuxtLink :to="n.to">{{ n.label }}</NuxtLink></li>
            <li><button type="button" @click="ui.modal.value = 'login'">Вход для клиентов</button></li>
          </ul>
        </div>
        <div class="ak-footer__contacts">
          <h3>Контакты</h3>
          <a v-for="ph in akContacts.phones" :key="ph.href" :href="ph.href" class="ak-footer__phone">{{ ph.label }}</a>
          <a :href="`mailto:${akContacts.email}`">{{ akContacts.email }}</a>
          <p>{{ akContacts.address }}</p>
          <p>{{ akContacts.hours }}</p>
          <div class="ak-footer__social">
            <a :href="akContacts.vk" target="_blank" rel="noopener">ВКонтакте</a>
            <a :href="akContacts.ok" target="_blank" rel="noopener">Одноклассники</a>
          </div>
        </div>
      </div>
      <div class="ak-wrap ak-footer__legal">
        <p>
          © 2005–{{ year }} {{ akContacts.company }}. Цены и ассортимент ориентировочные, не являются публичной офертой. Тексты, цены и изображения
          принадлежат владельцу сайта aks124.ru.
        </p>
        <p>Концепт редизайна — <a href="https://andryushov.me/redesign/">andryushov.me</a></p>
      </div>
    </footer>

    <nav class="ak-tabbar" aria-label="Быстрые действия">
      <NuxtLink :to="akSectionPath()" :class="{ 'is-on': isCatalog }"><AkIcon name="grid" /><span>Каталог</span></NuxtLink>
      <NuxtLink :to="akPath('/brands')"><AkIcon name="az" /><span>Бренды</span></NuxtLink>
      <a :href="akContacts.phones[0].href"><AkIcon name="phone" /><span>Позвонить</span></a>
      <NuxtLink :to="akPath('/list')" class="ak-tabbar__list" :class="{ 'is-on': isList }">
        <AkIcon name="list" />
        <span class="ak-tabbar__sum">{{ list.count.value ? akMoney0(list.total.value) : 'Список' }}</span>
        <span v-if="list.count.value" class="ak-dot">{{ list.count.value }}</span>
      </NuxtLink>
    </nav>

    <button v-if="scrolled" type="button" class="ak-chatbtn" @click="ui.modal.value = 'chat'">
      <AkIcon name="chat" />
      <span>Написать</span>
    </button>

    <div v-if="ui.menu.value" class="ak-drawer" @click.self="ui.menu.value = false">
      <aside class="ak-drawer__panel" aria-label="Меню">
        <div class="ak-drawer__head">
          <b>Меню</b>
          <button type="button" class="ak-iconbtn" aria-label="Закрыть" @click="ui.menu.value = false"><AkIcon name="close" /></button>
        </div>
        <nav class="ak-drawer__nav">
          <NuxtLink v-for="n in nav" :key="n.to" :to="n.to">{{ n.label }}</NuxtLink>
          <NuxtLink :to="akPath('/list')">Список заказа<template v-if="list.count.value"> · {{ list.count.value }}</template></NuxtLink>
          <button type="button" @click="ui.modal.value = 'login'">Вход для клиентов</button>
          <button type="button" @click="ui.modal.value = 'chat'">Написать консультанту</button>
        </nav>
        <p class="ak-drawer__label">Каталог</p>
        <nav class="ak-drawer__sections">
          <NuxtLink v-for="s in akSections" :key="s.id" :to="akSectionPath(s.id)">
            <img v-if="s.img" :src="s.img" alt="" width="40" height="40" loading="lazy" />
            <span v-else class="ak-drawer__noimg" />
            <span>{{ s.title }}</span>
            <small>{{ s.count }}</small>
          </NuxtLink>
        </nav>
        <div class="ak-drawer__contacts">
          <a v-for="ph in akContacts.phones" :key="ph.href" :href="ph.href">{{ ph.label }}</a>
          <button type="button" @click="ui.modal.value = 'call'">Обратный звонок</button>
          <a :href="`mailto:${akContacts.email}`">{{ akContacts.email }}</a>
        </div>
      </aside>
    </div>

    <div v-if="ui.photo.value" class="ak-lightbox" @click.self="ui.photo.value = null">
      <figure>
        <button type="button" class="ak-iconbtn" aria-label="Закрыть" @click="ui.photo.value = null"><AkIcon name="close" /></button>
        <img :src="ui.photo.value.img" :alt="ui.photo.value.title" />
        <figcaption>{{ ui.photo.value.title }}</figcaption>
      </figure>
    </div>

    <AkModals />

    <Transition name="ak-fade">
      <p v-if="ui.toast.value" class="ak-toast" role="status">{{ ui.toast.value }}</p>
    </Transition>
  </div>
</template>

<style lang="scss">
.ak-body {
  background: #fff;
}
// якоря (#price-form, #b-…) не прячутся под липкую шапку
html.ak-html {
  scroll-padding-top: 96px;

  @media (max-width: 768px) {
    scroll-padding-top: 130px;
  }
}

.ak {
  --ak-accent: #2b7a5f;
  --ak-accent-dark: #21624b;
  --ak-soft: #e5f1eb;
  --ak-lime: #a3da5c;
  --ak-lime-soft: #eef7e0;
  --ak-ink: #3b2a24;
  --ak-text: #4a3d35;
  --ak-muted: #7b6e66;
  --ak-surface: #f5f4f0;
  --ak-line: #e7e3dc;
  --ak-red: #c23a2b;
  --ak-r: 12px;
  --ak-R: 22px;
  // всплывающие панели поверх белой шапки: рамка + короткая плотная и длинная мягкая тень
  --ak-pop: 0 2px 6px rgba(59, 42, 36, 0.08), 0 22px 54px rgba(59, 42, 36, 0.22);
  min-height: 100vh;
  background: #fff;
  color: var(--ak-text);
  font-family: 'Exo 2', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;

  &.has-bar {
    @media (max-width: 768px) {
      padding-bottom: 0;
    }
  }
  @media (max-width: 768px) {
    padding-bottom: 68px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

:where(.ak) h1,
:where(.ak) h2,
:where(.ak) h3,
:where(.ak) p,
:where(.ak) figure {
  margin: 0;
}
:where(.ak) h1,
:where(.ak) h2,
:where(.ak) h3 {
  color: var(--ak-ink);
  font-weight: 800;
  letter-spacing: -0.01em;
}
:where(.ak) a {
  color: inherit;
  text-decoration: none;
}
:where(.ak) img {
  display: block;
  max-width: 100%;
}
:where(.ak) button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  border: 0;
  background: none;
  padding: 0;
}
:where(.ak) input,
:where(.ak) textarea,
:where(.ak) select {
  font: inherit;
  color: inherit;
}
:where(.ak) ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ak-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.ak-wrap {
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

.ak-section {
  padding-top: 64px;

  @media (max-width: 768px) {
    padding-top: 44px;
  }
}
.ak-h2 {
  font-size: clamp(24px, 2.4vw, 34px);
  line-height: 1.15;
}
.ak-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  p {
    color: var(--ak-muted);
    margin-top: 6px;
  }
}
.ak-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ak-accent);
  font-weight: 600;
  white-space: nowrap;

  &:hover {
    color: var(--ak-accent-dark);
  }
}

/* Кнопки */
.ak-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: var(--ak-r);
  background: var(--ak-accent);
  color: #fff;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: var(--ak-accent-dark);
  }
  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
  &--soft {
    background: var(--ak-soft);
    color: var(--ak-accent-dark);

    &:hover {
      background: #d5e9df;
    }
  }
  &--line,
  &--line:focus,
  &--line:active {
    background: #fff;
    color: var(--ak-ink);
    border: 1px solid var(--ak-line);
  }
  &--line:hover {
    background: var(--ak-surface);
  }
}
.ak-iconbtn {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--ak-r);
  color: var(--ak-ink);
  flex: none;

  &:hover {
    background: var(--ak-surface);
  }
}
.ak-dot {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 10px;
  background: var(--ak-lime);
  color: var(--ak-ink);
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
}
.ak-flag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 9px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;

  &--out {
    background: #fbe9e6;
    color: var(--ak-red);
  }
  &--promo {
    background: var(--ak-lime-soft);
    color: #4c6b1f;
  }
}

/* Баннер концепта */
.ak-banner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
  padding: 8px 16px;
  background: var(--ak-ink);
  color: #f1e9e4;
  font-size: 13px;
  text-align: center;

  a {
    color: var(--ak-lime);
    font-weight: 600;
    text-decoration: underline;
  }
}

/* Шапка */
.ak-header {
  position: sticky;
  z-index: 40;
  background: #fff;
  box-shadow: 0 1px 0 var(--ak-line);
}
.ak-strip {
  background: var(--ak-surface);
  font-size: 13.5px;
  color: var(--ak-text);

  &__row {
    display: flex;
    align-items: center;
    gap: 18px;
    height: 38px;
    white-space: nowrap;
  }
  &__free {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--ak-accent-dark);
    font-weight: 600;
  }
  &__short {
    display: none;
  }
  &__info {
    color: var(--ak-muted);
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__right {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: auto;
  }
  &__phone {
    font-weight: 600;
    color: var(--ak-ink);
  }
  &__call {
    color: var(--ak-accent);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  @media (max-width: 1199px) {
    &__info {
      display: none;
    }
  }
  @media (max-width: 768px) {
    &__long,
    &__right {
      display: none;
    }
    &__short {
      display: inline;
    }
  }
  @media (max-width: 375px) {
    font-size: 12.5px;

    &__row {
      gap: 10px;
    }
  }
}
.ak-bar-row {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 76px;

  &__burger {
    display: none;
  }
  &__search {
    flex: 1;
    min-width: 0;
  }
  &__tel {
    display: none;
  }

  @media (max-width: 1199px) {
    gap: 10px;
  }
  @media (max-width: 989px) {
    &__login {
      display: none;
    }
  }
  @media (max-width: 768px) {
    flex-wrap: wrap;
    height: auto;
    padding-top: 8px;
    padding-bottom: 10px;
    row-gap: 8px;

    &__burger,
    &__tel {
      display: inline-grid;
    }
    &__search {
      order: 10;
      flex: 0 0 100%;
    }
  }
}

.ak-mark {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  column-gap: 10px;
  align-items: center;
  flex: none;
  color: var(--ak-ink);

  &__bar {
    grid-row: 1 / 3;
    width: 6px;
    height: 40px;
    border-radius: 3px;
    background: linear-gradient(var(--ak-lime) 0 50%, var(--ak-accent) 50% 100%);
  }
  &__name {
    font-size: 23px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  &__sub {
    font-size: 11.5px;
    line-height: 1.25;
    color: var(--ak-muted);
    margin-top: 3px;
  }

  @media (max-width: 1199px) {
    &__sub {
      display: none;
    }
    &__bar {
      height: 30px;
      grid-row: 1;
    }
  }
  @media (max-width: 768px) {
    margin-right: auto;

    &__name {
      font-size: 20px;
    }
  }
  @media (max-width: 375px) {
    &__name {
      font-size: 17px;
    }
  }
}
.ak-catbtn {
  flex: none;

  @media (max-width: 768px) {
    display: none;
  }
}
.ak-listbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 136px;
  height: 46px;
  border-radius: var(--ak-r);
  background: var(--ak-soft);
  color: var(--ak-accent-dark);
  font-weight: 700;
  flex: none;

  &.is-full {
    background: var(--ak-lime-soft);
    color: var(--ak-ink);
  }
  &:hover {
    background: #d5e9df;
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    background: none;

    &.is-full {
      background: none;
    }
    &__label {
      display: none;
    }
  }
}

/* Поиск */
.ak-search {
  position: relative;

  &__form {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 48px;
    padding: 0 4px 0 14px;
    border: 1.5px solid var(--ak-line);
    border-radius: var(--ak-r);
    background: #fff;
    transition: border-color 0.15s;

    &:focus-within {
      border-color: var(--ak-accent);
    }
    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: 0;
      outline: 0;
      background: none;
    }
  }
  &__ico {
    color: var(--ak-muted);
  }
  &__clear {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    color: var(--ak-muted);
  }
  &__go {
    min-height: 38px;
    padding: 0 16px;
    border-radius: 9px;
  }
  &.is-big &__form {
    height: 60px;
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(59, 42, 36, 0.08);
  }
  &.is-big .ak-search__go {
    min-height: 48px;
    padding: 0 22px;
    border-radius: 12px;
  }
  &__drop {
    position: absolute;
    z-index: 30;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    max-height: min(70vh, 560px);
    overflow: auto;
    padding: 8px;
    border: 1px solid var(--ak-line);
    border-radius: 16px;
    background: #fff;
    box-shadow: var(--ak-pop);
  }
  &__brand {
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    border-radius: 10px;
    color: var(--ak-ink);

    img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      border-radius: 8px;
      background: #fff;
      border: 1px solid var(--ak-line);
    }
    b,
    small {
      display: block;
    }
    small {
      color: var(--ak-muted);
    }
    &:hover {
      background: var(--ak-surface);
    }
  }
  &__letter {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--ak-soft);
    color: var(--ak-accent-dark);
    font-weight: 800;
  }
  &__hit {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    border-top: 1px solid var(--ak-line);

    b {
      display: block;
      font-weight: 600;
      color: var(--ak-ink);
      line-height: 1.3;
    }
    small {
      color: var(--ak-muted);
    }
  }
  &__price {
    font-weight: 700;
    color: var(--ak-ink);
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
    border-radius: 10px;
    background: var(--ak-surface);
    color: var(--ak-accent-dark);
    font-weight: 600;
  }
  &__none {
    padding: 14px;
    color: var(--ak-muted);

    a {
      color: var(--ak-accent);
      font-weight: 600;
    }
  }
  &__quick {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    font-size: 14px;

    span {
      color: var(--ak-muted);
      white-space: nowrap;
    }
    button {
      height: 32px;
      padding: 0 12px;
      border-radius: 9px;
      background: #fff;
      border: 1px solid var(--ak-line);
      color: var(--ak-ink);

      &:hover {
        border-color: var(--ak-accent);
        color: var(--ak-accent);
      }
    }
  }

  @media (max-width: 576px) {
    &__hit {
      grid-template-columns: minmax(0, 1fr) auto;

      .ak-buy {
        grid-column: 1 / -1;
        justify-self: end;
      }
    }
    &__go {
      display: none;
    }
    &.is-big .ak-search__go {
      display: inline-flex;
      padding: 0 14px;
    }
  }
}

/* Меню «Каталог» */
.ak-mega-wrap {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  padding-top: 8px;
}
.ak-mega {
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr);
  max-height: min(78vh, 680px);
  border: 1px solid var(--ak-line);
  border-radius: var(--ak-R);
  background: #fff;
  box-shadow: var(--ak-pop);
  overflow: hidden;

  &__sections {
    display: grid;
    gap: 2px;
    align-content: start;
    padding: 10px;
    overflow: auto;
    background: var(--ak-surface);

    a {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 6px 12px;
      border-radius: 10px;
      color: var(--ak-ink);
      font-size: 14.5px;
      font-weight: 500;

      small {
        color: var(--ak-muted);
      }
      &.is-on {
        background: #fff;
        color: var(--ak-accent-dark);
        font-weight: 700;
      }
    }
  }
  &__brands {
    padding: 22px 26px;
    overflow: auto;
  }
  &__head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--ak-line);

    img {
      width: 72px;
      height: 72px;
      object-fit: cover;
      border-radius: 14px;
    }
    b {
      display: block;
      font-size: 20px;
      color: var(--ak-ink);
    }
    small {
      color: var(--ak-muted);
    }
    .ak-more {
      margin-left: auto;
    }
  }
  ul.ak-mega__list {
    columns: 3 200px;
    column-gap: 20px;
    margin-top: 14px;

    a {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      padding: 7px 10px;
      border-radius: 9px;
      color: var(--ak-ink);
      break-inside: avoid;

      small {
        color: var(--ak-muted);
      }
      &:hover {
        background: var(--ak-surface);
        color: var(--ak-accent-dark);
      }
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: 260px minmax(0, 1fr);
  }
}

.ak-backdrop {
  position: fixed;
  z-index: 39;
  inset: 0;
  background: rgba(30, 20, 16, 0.3);
}

/* Лента разделов сайта */
.ak-ribbon {
  border-bottom: 1px solid var(--ak-line);

  &__row {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 48px;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 36px;
      padding: 0 12px;
      border-radius: 9px;
      color: var(--ak-ink);
      font-weight: 500;
      white-space: nowrap;

      &:hover,
      &.router-link-active {
        background: var(--ak-surface);
        color: var(--ak-accent-dark);
      }
    }
  }
  &__price {
    margin-left: auto;
    color: var(--ak-accent) !important;
    font-weight: 600 !important;
  }
  @media (max-width: 768px) {
    display: none;
  }
}

/* Счётчик упаковок */
.ak-buy {
  flex: none;

  &__add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 40px;
    padding: 0 14px;
    border-radius: 10px;
    background: var(--ak-accent);
    color: #fff;
    font-weight: 600;
    white-space: nowrap;

    &:hover {
      background: var(--ak-accent-dark);
    }
  }
}
.ak-qty {
  display: inline-flex;
  align-items: center;
  height: 40px;
  border-radius: 10px;
  background: var(--ak-lime-soft);
  color: var(--ak-ink);

  button {
    display: grid;
    place-items: center;
    width: 36px;
    height: 40px;
    border-radius: 10px;

    &:hover {
      background: #e0f0c8;
    }
  }
  label {
    display: inline-flex;
    align-items: baseline;
    padding: 0 4px;
    font-weight: 700;
  }
  input {
    min-width: 2ch;
    border: 0;
    background: none;
    text-align: center;
    font-weight: 700;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  span {
    padding-left: 3px;
    font-size: 13px;
    font-weight: 500;
    color: var(--ak-muted);
  }
}

/* Лист бренда */
.ak-sheet {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 24px;
  padding: 22px;
  border: 1px solid var(--ak-line);
  border-radius: var(--ak-R);
  background: #fff;

  &__side {
    display: grid;
    align-content: start;
    gap: 14px;
  }
  &__photo {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    padding: 10px;
    border: 1px solid var(--ak-line);
    border-radius: 16px;
    background: #fff;
    overflow: hidden;
    cursor: zoom-in;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.3s;
    }
    &:hover img {
      transform: scale(1.04);
    }
    &--none {
      display: grid;
      place-content: center;
      justify-items: center;
      gap: 10px;
      padding: 14px;
      background: var(--ak-surface);
      border-color: transparent;
      color: #b9b0a5;
      text-align: center;
      cursor: default;

      span {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        color: var(--ak-muted);
        font-size: 13px;
        font-weight: 700;
        line-height: 1.25;
      }
    }
  }
  &__head {
    display: grid;
    justify-items: start;
    gap: 6px;

    h3 {
      font-size: 18px;
      line-height: 1.25;
    }
    p {
      color: var(--ak-muted);
      font-size: 14px;
    }
  }
  &__pdf {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--ak-accent);
    font-weight: 600;
    font-size: 14px;
  }
  &__table {
    min-width: 0;
  }
  &__cols {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 100px 112px 104px 140px;
    gap: 12px;
    padding: 0 12px 10px;
    border-bottom: 1px solid var(--ak-line);
    color: var(--ak-muted);
    font-size: 13px;

    > span:nth-child(n + 2) {
      text-align: right;
    }
  }
  &__group {
    padding: 14px 12px 6px;
    color: var(--ak-accent-dark);
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  @media (max-width: 1199px) {
    padding: 18px;
  }
  @media (max-width: 576px) {
    padding: 14px;
    border-radius: 18px;
  }
}
// Лист живёт и в каталоге, и в узком блоке главной — раскладка зависит от ширины самого листа
.ak-sheet-box {
  container-type: inline-size;

  & + & {
    margin-top: 16px;
  }
}
@container (max-width: 980px) {
  .ak-sheet {
    grid-template-columns: 150px minmax(0, 1fr);
    gap: 18px;
  }
}
@container (max-width: 820px) {
  .ak-sheet {
    grid-template-columns: minmax(0, 1fr);
  }
  .ak-sheet__side {
    grid-template-columns: 88px minmax(0, 1fr);
    align-items: center;
  }
  .ak-sheet__photo--none span {
    display: none;
  }
  .ak-sheet__photo--none svg {
    width: 30px;
    height: 30px;
  }
}
@container (max-width: 640px) {
  .ak-sheet__cols {
    display: none;
  }
}
@container (max-width: 480px) {
  .ak-sheet__side {
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 12px;
  }
  .ak-sheet__photo {
    padding: 4px;
    border-radius: 12px;
  }
  .ak-sheet__head h3 {
    font-size: 18px;
  }
}
.ak-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 100px 112px 104px 140px;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--ak-line);
  border-radius: 10px;

  &:last-child {
    border-bottom: 0;
  }
  &.is-in {
    background: #f7fbf0;
  }
  &__name {
    color: var(--ak-ink);
    line-height: 1.35;
  }
  &__pack,
  &__box {
    text-align: right;
    color: var(--ak-muted);
    white-space: nowrap;
  }
  &__price {
    text-align: right;
    white-space: nowrap;

    b {
      font-size: 16px;
      color: var(--ak-ink);
    }
    small {
      color: var(--ak-muted);
    }
    em {
      font-style: normal;
      color: var(--ak-muted);
    }
  }
  &__buy {
    display: flex;
    justify-content: flex-end;
  }

}
.ak-row__m {
  display: none;
}
@container (max-width: 640px) {
  .ak-row {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'name name'
      'price buy';
    row-gap: 6px;
    padding: 12px 4px;
    border-radius: 0;

    &.is-in {
      background: none;
    }
  }
  .ak-row__name {
    grid-area: name;
  }
  .ak-row__price {
    grid-area: price;
    text-align: left;
  }
  .ak-row__buy {
    grid-area: buy;
  }
  .ak-row__pack,
  .ak-row__box {
    display: none;
  }
  .ak-row__m {
    display: block;
    font-size: 13px;
    color: var(--ak-muted);
    white-space: normal;
  }
}

/* Формы */
.ak-form {
  display: grid;
  gap: 14px;
}
.ak-field {
  display: grid;
  gap: 6px;

  > span {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--ak-ink);
  }
  input,
  select,
  textarea {
    width: 100%;
    min-height: 48px;
    padding: 10px 14px;
    border: 1px solid var(--ak-line);
    border-radius: var(--ak-r);
    background: #fff;
    outline: 0;

    &:focus {
      border-color: var(--ak-accent);
    }
  }
  textarea {
    resize: vertical;
  }
  &--select select {
    appearance: none;
    padding-right: 42px;
    background: #fff
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' stroke='%237b6e66' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 8l5 5 5-5'/%3E%3C/svg%3E")
      no-repeat right 14px center;
  }
}
.ak-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13.5px;
  color: var(--ak-muted);
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    margin: 1px 0 0;
    accent-color: var(--ak-accent);
    flex: none;
  }
}
.ak-done {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px;
  border-radius: 16px;
  background: var(--ak-lime-soft);
  color: var(--ak-ink);
  font-weight: 500;

  svg {
    flex: none;
    color: #4c6b1f;
  }
}
.ak-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: var(--ak-surface);
  overflow-x: auto;

  button {
    flex: 1;
    min-height: 38px;
    padding: 0 12px;
    border-radius: 9px;
    font-weight: 600;
    color: var(--ak-muted);
    white-space: nowrap;

    &.is-on {
      background: #fff;
      color: var(--ak-ink);
      box-shadow: 0 1px 3px rgba(59, 42, 36, 0.1);
    }
  }
}

/* Прайс-лист внизу каждой страницы */
.ak-pricebox {
  padding-bottom: 64px;

  @media (max-width: 768px) {
    padding-bottom: 44px;
  }
}
.ak-priceform {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 40px;
  padding: 36px;
  border-radius: var(--ak-R);
  background: var(--ak-surface);

  &__text p {
    margin-top: 12px;
    color: var(--ak-text);
  }
  &__form {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  &__send {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  &.is-compact {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
    padding: 26px;
  }
  @media (max-width: 576px) {
    padding: 20px 16px;

    &__form {
      grid-template-columns: minmax(0, 1fr);
    }
    &__send {
      flex-direction: column;
      align-items: stretch;
    }
  }
}

/* Подвал */
.ak-footer {
  padding: 48px 0 24px;
  border-top: 1px solid var(--ak-line);
  font-size: 14px;

  &__grid {
    display: grid;
    grid-template-columns: 1.1fr 1.6fr 0.9fr 1fr;
    gap: 32px;
  }
  .ak-mark__bar {
    grid-row: 1;
    height: 30px;
  }
  &__brand p {
    margin-top: 14px;
    color: var(--ak-muted);
  }
  h3 {
    font-size: 15px;
    margin-bottom: 12px;
  }
  ul {
    display: grid;
    gap: 6px;

    a,
    button {
      color: var(--ak-text);
      text-align: left;

      &:hover {
        color: var(--ak-accent);
      }
    }
  }
  ul.ak-footer__cols {
    display: block;
    columns: 2;
    column-gap: 20px;

    li {
      margin-bottom: 6px;
      break-inside: avoid;
    }
  }
  &__contacts {
    display: grid;
    align-content: start;
    gap: 6px;

    p {
      color: var(--ak-muted);
    }
  }
  &__phone {
    font-size: 17px;
    font-weight: 700;
    color: var(--ak-ink);
  }
  &__social {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 14px;
    margin-top: 6px;

    a {
      color: var(--ak-accent);
      font-weight: 600;
    }
  }
  &__legal {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 36px;
    padding-top: 18px;
    border-top: 1px solid var(--ak-line);
    color: var(--ak-muted);
    font-size: 13px;

    a {
      color: var(--ak-accent);
    }
  }

  @media (max-width: 1199px) {
    &__grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (max-width: 576px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 26px;
    }
    &__legal {
      flex-direction: column;
    }
  }
}

/* Нижняя панель на телефоне */
.ak-tabbar {
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    z-index: 45;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    height: 64px;
    padding: 0 6px env(safe-area-inset-bottom);
    background: #fff;
    border-top: 1px solid var(--ak-line);

    a {
      position: relative;
      display: grid;
      justify-items: center;
      align-content: center;
      gap: 2px;
      font-size: 11.5px;
      font-weight: 600;
      color: var(--ak-muted);

      &.is-on {
        color: var(--ak-accent);
      }
    }
    .ak-dot {
      top: 4px;
      right: calc(50% - 26px);
    }
  }
}
.ak-tabbar__list .ak-tabbar__sum {
  min-width: 64px;
  text-align: center;
  white-space: nowrap;
}

/* Кнопка консультанта: после первого экрана, на телефоне — пункт меню */
.ak-chatbtn {
  position: fixed;
  z-index: 35;
  left: 24px;
  bottom: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 20px;
  border-radius: 26px;
  background: var(--ak-accent);
  color: #fff !important;
  font-weight: 700;
  box-shadow: 0 10px 28px rgba(33, 98, 75, 0.35);

  &:hover {
    background: var(--ak-accent-dark);
  }
  @media (max-width: 768px) {
    display: none;
  }
}

/* Меню на телефоне */
.ak-drawer {
  position: fixed;
  z-index: 60;
  inset: 0;
  background: rgba(30, 20, 16, 0.45);

  &__panel {
    width: min(380px, 92vw);
    height: 100%;
    overflow: auto;
    padding: 14px 18px 30px;
    background: #fff;
  }
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    b {
      font-size: 18px;
      color: var(--ak-ink);
    }
  }
  &__nav {
    display: grid;

    a,
    button {
      padding: 11px 4px;
      border-bottom: 1px solid var(--ak-line);
      color: var(--ak-ink);
      font-weight: 600;
      text-align: left;
    }
  }
  &__label {
    margin: 20px 0 8px;
    color: var(--ak-muted);
    font-size: 13px;
    font-weight: 600;
  }
  &__sections {
    display: grid;
    gap: 2px;

    a {
      display: grid;
      grid-template-columns: 40px minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      padding: 6px 4px;
      border-radius: 10px;
      color: var(--ak-ink);

      img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 9px;
      }
      small {
        color: var(--ak-muted);
      }
    }
  }
  &__noimg {
    width: 40px;
    height: 40px;
    border-radius: 9px;
    background: var(--ak-surface);
  }
  &__contacts {
    display: grid;
    gap: 8px;
    margin-top: 20px;

    a,
    button {
      color: var(--ak-accent);
      font-weight: 600;
      text-align: left;
    }
  }
}

/* Окна */
.ak-modal,
.ak-lightbox {
  position: fixed;
  z-index: 70;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(30, 20, 16, 0.5);
}
.ak-modal__box {
  position: relative;
  display: grid;
  gap: 16px;
  width: min(480px, 100%);
  max-height: calc(100vh - 32px);
  overflow: auto;
  padding: 28px;
  border-radius: var(--ak-R);
  background: #fff;

  h2 {
    font-size: 24px;
    padding-right: 40px;
  }
  @media (max-width: 576px) {
    padding: 22px 16px;
  }
}
.ak-modal__close {
  position: absolute;
  top: 14px;
  right: 14px;
}
.ak-modal__lead {
  color: var(--ak-muted);
  margin-top: -8px;
}
.ak-chat {
  display: grid;
  gap: 8px;
  min-height: 160px;
  max-height: 280px;
  overflow: auto;
  align-content: start;
  padding: 12px;
  border-radius: 16px;
  background: var(--ak-surface);

  p {
    justify-self: start;
    max-width: 85%;
    padding: 9px 13px;
    border-radius: 14px 14px 14px 4px;
    background: #fff;
    color: var(--ak-ink);

    &.is-me {
      justify-self: end;
      border-radius: 14px 14px 4px 14px;
      background: var(--ak-soft);
    }
  }
  &__send {
    display: flex;
    gap: 8px;

    input {
      flex: 1;
      min-width: 0;
      height: 48px;
      padding: 0 14px;
      border: 1px solid var(--ak-line);
      border-radius: var(--ak-r);
      outline: 0;

      &:focus {
        border-color: var(--ak-accent);
      }
    }
    .ak-btn {
      padding: 0 14px;
    }
  }
}
.ak-lightbox figure {
  position: relative;
  max-width: min(760px, 100%);
  padding: 20px;
  border-radius: var(--ak-R);
  background: #fff;

  img {
    max-height: 72vh;
    margin: 0 auto;
    object-fit: contain;
  }
  figcaption {
    margin-top: 10px;
    text-align: center;
    color: var(--ak-ink);
    font-weight: 600;
  }
  .ak-iconbtn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #fff;
  }
}

.ak-toast {
  position: fixed;
  z-index: 80;
  left: 50%;
  bottom: 28px;
  max-width: min(520px, calc(100vw - 32px));
  padding: 12px 18px;
  border-radius: 14px;
  background: var(--ak-ink);
  color: #fff;
  transform: translateX(-50%);
  box-shadow: var(--ak-pop);

  @media (max-width: 768px) {
    bottom: 80px;
  }
}
.ak-fade-enter-active,
.ak-fade-leave-active {
  transition: opacity 0.2s;
}
.ak-fade-enter-from,
.ak-fade-leave-to {
  opacity: 0;
}

.ak-free {
  width: 100%;
  max-width: 420px;

  &__bar {
    height: 10px;
    border-radius: 5px;
    background: var(--ak-surface);
    overflow: hidden;

    span {
      display: block;
      height: 100%;
      border-radius: 5px;
      background: var(--ak-lime);
      transition: width 0.3s;
    }
  }
  p {
    margin-top: 8px;
    font-size: 14px;
    color: var(--ak-muted);
  }
  b {
    color: var(--ak-ink);
  }
}
.ak-promos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.ak-promo {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--ak-line);
  border-radius: var(--ak-R);

  img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 14px;
  }
  h3 {
    margin: 8px 0 4px;
    font-size: 18px;
  }
  b {
    font-size: 20px;
    color: var(--ak-ink);
  }
  &:hover {
    border-color: var(--ak-accent);
  }
  @media (max-width: 375px) {
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 12px;

    img {
      width: 84px;
      height: 84px;
    }
  }
}
.ak-terms__ico {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #fff;
  color: var(--ak-accent);
}
.ak-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  color: var(--ak-muted);
  font-size: 14px;

  a:hover {
    color: var(--ak-accent);
  }
}
.ak-empty {
  padding: 36px;
  border-radius: var(--ak-R);
  background: var(--ak-surface);
  text-align: center;

  p {
    margin-top: 8px;
  }
  a:not(.ak-btn) {
    color: var(--ak-accent);
    font-weight: 600;
  }
}

/* Общие для страниц блоки */
.ak-page {
  padding-top: 24px;

  > h1 {
    margin-top: 10px;
    font-size: clamp(28px, 3.2vw, 44px);
    line-height: 1.1;
  }
  > h1 + .ak-list,
  > h1 + .ak-empty {
    margin-top: 24px;
  }
  &__lead {
    max-width: 760px;
    margin-top: 12px;
    font-size: 17px;
  }
  @media (max-width: 768px) {
    padding-top: 16px;
  }
}
.ak-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 28px;

  &--5 {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.ak-card {
  display: grid;
  gap: 10px;
  align-content: start;
  padding: 24px;
  border-radius: var(--ak-R);
  background: var(--ak-surface);

  h3 {
    margin-top: 4px;
    font-size: 19px;
  }
  &--accent {
    background: var(--ak-lime-soft);
  }
  @media (max-width: 576px) {
    padding: 18px;
  }
}
.ak-note {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding: 18px 20px;
  border: 1px solid var(--ak-line);
  border-radius: 16px;

  svg {
    flex: none;
    color: var(--ak-accent);
  }
  a {
    color: var(--ak-accent);
    font-weight: 600;
  }
}
ul.ak-kinds {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
  margin-top: 18px;

  li {
    padding: 16px 18px;
    border: 1px solid var(--ak-line);
    border-radius: 14px;
    color: var(--ak-ink);
    font-weight: 600;
  }
}
.ak-contacts {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 28px;
  margin-top: 24px;

  &__info {
    display: grid;
    gap: 22px;
    align-content: start;
  }
  &__block {
    display: grid;
    gap: 6px;
    justify-items: start;
  }
  &__label {
    color: var(--ak-muted);
    font-size: 13.5px;
    font-weight: 600;
  }
  &__phone {
    font-size: 24px;
    font-weight: 800;
    color: var(--ak-ink);
  }
  &__link,
  &__social a {
    color: var(--ak-accent);
    font-weight: 600;
  }
  &__social {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
  }
  .ak-btn {
    margin-top: 8px;
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
// место держит обёртка: если блокировщик спрячет iframe, останется метка и ссылка
.ak-map {
  display: grid;
  gap: 10px;
  justify-items: start;

  &__frame {
    position: relative;
    width: 100%;
    min-height: 420px;
    border-radius: var(--ak-R);
    background: var(--ak-surface);
    overflow: hidden;

    iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
  &__pin {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--ak-accent-dark);
    font-weight: 700;
  }
  @media (max-width: 576px) {
    &__frame {
      min-height: 300px;
    }
  }
}
dl.ak-req {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 10px 28px;
  max-width: 720px;
  margin: 18px 0 0;
  padding: 22px;
  border-radius: var(--ak-R);
  background: var(--ak-surface);

  dt {
    color: var(--ak-muted);
  }
  dd {
    margin: 0;
    color: var(--ak-ink);
    font-weight: 600;
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;

    dd {
      margin-bottom: 10px;
    }
  }
}
</style>
