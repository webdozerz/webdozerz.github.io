<script lang="ts" setup>
import GmIcon from '~/components/redesign/gornyimed/GmIcon.vue'
import GmQty from '~/components/redesign/gornyimed/GmQty.vue'
import GmPhone from '~/components/redesign/gornyimed/GmPhone.vue'

const route = useRoute()
const shop = useGornyimedShop()
const ui = useGornyimedUi()

useSeoMeta({
  title: 'Пасеки Соловьёвых — мёд с Горного Алтая | Концепт редизайна',
  description:
    'Концепт редизайна сайта gornyimed.ru: гречишный и разнотравье 2026 года в банках 1, 1,5 и 3 кг с ценой за килограмм, опт куботейнерами, мёд в стиках для кафе, экспорт, документы, фото пасеки.',
  ogTitle: 'Пасеки Соловьёвых — концепт редизайна',
  ogDescription: 'Мёд с собственных пасек в Чойском районе Республики Алтай: банки, куботейнеры, стики для кафе и экспорт.',
  ogImage: 'https://andryushov.me/redesign/gornyimed/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'gm-html', lang: 'ru' },
  bodyAttrs: { class: 'gm-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Commissioner:wght@400;500;600;700&family=Lora:wght@600;700&display=swap' },
  ],
})

// Меню оригинала его же словами — на сайте оно выделено коричневой полосой, концепт его сохраняет
const nav = [
  { to: gmPath('/shop'), label: 'Наша продукция' },
  { to: gmPath('/wb-ozon'), label: 'Наш мёд на Wildberries и Ozon' },
  { to: gmPath('/opt') + '#eksport', label: 'Мёд на экспорт' },
  { to: gmPath('/opt') + '#dokumenty', label: 'Прайс и документы' },
  { to: gmPath('/about') + '#kontakty', label: 'Контакты' },
  { to: gmPath('/news'), label: 'Новости' },
  { to: gmPath('/news') + '?tab=stati', label: 'Статьи' },
  { to: gmPath('/gallery'), label: 'Фотогалерея' },
]
const navAll = [...nav.slice(0, 2), { to: gmPath('/opt'), label: 'Опт куботейнерами' }, ...nav.slice(2, 4), { to: gmPath('/about'), label: 'О пасеке' }, ...nav.slice(4)]
const isOn = (to: string) => {
  const [rest, hash] = to.split('#')
  const [path, q] = rest.split('?')
  if (route.path.replace(/\/$/, '') !== path.replace(/\/$/, '')) return false
  if (hash) return route.hash === `#${hash}`
  if (q) return route.fullPath.includes(q)
  return !(path.endsWith('/news') && route.query.tab)
}
const year = new Date().getFullYear()
const [sergey, nadezhda] = gmContacts.people

// Липкая шапка: полоса условий уезжает, строка с разделами, знаком и корзиной остаётся у верха
const strip = ref<HTMLElement | null>(null)
const stick = ref(0)
const scrolled = ref(false)
const measure = () => {
  stick.value = strip.value?.offsetHeight ?? 0
}
const onScroll = () => {
  scrolled.value = window.scrollY > 700
}

// Время на Алтае — покупателю из Москвы видно, когда звонить
const altai = ref('')
const tick = () => {
  const d = new Date(Date.now() + 7 * 3600 * 1000)
  altai.value = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

// «Позвонить» — выпадашка с двумя людьми, как в шапке оригинала
const calls = ref(false)
const callsEl = ref<HTMLElement | null>(null)
const onDoc = (e: MouseEvent) => {
  if (calls.value && callsEl.value && !callsEl.value.contains(e.target as Node)) calls.value = false
}

const lang = (l: string) => ui.say(`Демо: версия на ${l} для покупателей из-за рубежа — как en. и cn. у оригинала.`)

// Заказать звонок
const cb = reactive({ name: '', phone: '', sent: false })
const cbOk = computed(() => cb.phone.replace(/\D/g, '').length === 11)
const sendCb = () => {
  if (cbOk.value) cb.sent = true
}
watch(ui.callback, (v) => {
  if (v) cb.sent = false
})
const openCallback = () => {
  calls.value = false
  ui.menu.value = false
  ui.callback.value = true
}

// Лайтбокс
const shot = computed(() => (ui.gallery.value ? ui.gallery.value.items[ui.gallery.value.index] : null))
const step = (d: number) => {
  const g = ui.gallery.value
  if (!g) return
  g.index = (g.index + d + g.items.length) % g.items.length
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    ui.gallery.value = null
    ui.callback.value = false
    ui.menu.value = false
    calls.value = false
  }
  if (ui.gallery.value && e.key === 'ArrowRight') step(1)
  if (ui.gallery.value && e.key === 'ArrowLeft') step(-1)
}

const locked = computed(() => !!ui.gallery.value || ui.callback.value || ui.menu.value)
watch(locked, (v) => document.documentElement.classList.toggle('gm-lock', v))
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    ui.gallery.value = null
    calls.value = false
    ;(document.activeElement as HTMLElement | null)?.blur?.()
  },
)
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
const onCart = computed(() => route.path.startsWith(gmPath('/cart')))

let clock: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  shop.persist()
  measure()
  tick()
  onScroll()
  clock = setInterval(tick, 30000)
  window.addEventListener('resize', measure)
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKey)
  document.addEventListener('click', onDoc)
})
onBeforeUnmount(() => {
  if (clock) clearInterval(clock)
  window.removeEventListener('resize', measure)
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('click', onDoc)
  document.documentElement.classList.remove('gm-lock')
})
</script>

<template>
  <div class="gm" :class="{ 'has-cart': shop.count.value }">
    <div class="gm-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="gmContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="gm-header" :style="{ top: `${-stick}px` }">
      <div ref="strip" class="gm-strip">
        <div class="gm-wrap gm-strip__row">
          <span class="gm-strip__item gm-strip__where"><GmIcon name="mountain" :size="17" />Пасеки в Чойском районе Республики Алтай</span>
          <span class="gm-strip__item gm-strip__ship"><GmIcon name="truck" :size="17" />Отправка по России любыми службами</span>
          <span class="gm-strip__sp" />
          <span v-if="altai" class="gm-strip__item gm-strip__time"><GmIcon name="clock" :size="17" />На Алтае {{ altai }}</span>
          <span class="gm-strip__langs">
            <button type="button" @click="lang('английском')">EN</button>
            <button type="button" @click="lang('китайском')">中文</button>
          </span>
          <a :href="gmContacts.price" class="gm-strip__price"><GmIcon name="down" :size="17" />Скачать прайс</a>
        </div>
      </div>

      <div class="gm-wrap gm-bar">
        <div class="gm-bar__left">
          <button type="button" class="gm-iconbtn gm-bar__burger" aria-label="Меню" @click="ui.menu.value = true"><GmIcon name="menu" /></button>
          <div ref="callsEl" class="gm-calls" :class="{ 'is-open': calls }">
            <button type="button" class="gm-calls__btn" :aria-expanded="calls" @click="calls = !calls">
              <GmIcon name="phone" :size="20" />
              <span class="gm-calls__text"><b>{{ sergey.phone }}</b><small>Сергей · ответственный за сбыт</small></span>
              <GmIcon name="right" :size="16" class="gm-calls__chev" />
            </button>
            <div class="gm-calls__pop">
              <a v-for="p in gmContacts.people" :key="p.tel" :href="`tel:${p.tel}`" class="gm-calls__row">
                <b>{{ p.phone }}</b>
                <span>{{ p.name }} — {{ p.role }}</span>
              </a>
              <a :href="`https://wa.me/${sergey.wa}`" target="_blank" rel="noopener" class="gm-calls__row gm-calls__row--line">
                <b>WhatsApp, MAX</b>
                <span>на номер Сергея, {{ sergey.phone }}</span>
              </a>
              <a :href="`mailto:${gmContacts.email}`" class="gm-calls__row gm-calls__row--line">
                <b>{{ gmContacts.email }}</b>
                <span>заказы и прайс по почте</span>
              </a>
              <button type="button" class="gm-btn gm-btn--line gm-calls__cb" @click="openCallback">Заказать звонок</button>
            </div>
          </div>
        </div>

        <NuxtLink :to="gmPath()" class="gm-mark" aria-label="Пасеки Соловьёвых, на главную">
          <img :src="gmContacts.logo" alt="" width="206" height="177" />
          <span class="gm-mark__name">Пасеки<br />Соловьёвых</span>
        </NuxtLink>

        <div class="gm-bar__right">
          <NuxtLink :to="gmPath('/cart')" class="gm-cartbtn" :class="{ 'is-full': shop.count.value }" aria-label="Корзина">
            <GmIcon name="bag" />
            <span class="gm-cartbtn__text">
              <b>Товаров ({{ shop.count.value }})</b>
              <small>{{ shop.count.value ? gmMoney(shop.total.value) + (shop.hasUnpriced.value ? ' +' : '') : 'корзина пуста' }}</small>
            </span>
            <i v-if="shop.count.value" class="gm-cartbtn__count">{{ shop.count.value }}</i>
          </NuxtLink>
        </div>
      </div>

      <nav class="gm-nav" aria-label="Разделы">
        <div class="gm-wrap gm-nav__row">
          <NuxtLink v-for="n in nav" :key="n.label" :to="n.to" :class="{ 'is-on': isOn(n.to) }">{{ n.label }}</NuxtLink>
        </div>
      </nav>
    </header>

    <main class="gm-main">
      <NuxtPage />
    </main>

    <footer class="gm-footer">
      <div class="gm-wrap gm-footer__grid">
        <div class="gm-footer__brand">
          <NuxtLink :to="gmPath()" class="gm-mark gm-mark--foot">
            <img :src="gmContacts.logo" alt="" width="206" height="177" loading="lazy" />
            <span class="gm-mark__name">Пасеки<br />Соловьёвых</span>
          </NuxtLink>
          <p>Наши пчёлки работают для Вас. Мёд и продукты пчеловодства с собственных пасек в Горном Алтае — в банках, оптом и на экспорт.</p>
          <div class="gm-footer__mp">
            <a :href="gmContacts.wb" target="_blank" rel="noopener">Wildberries</a>
            <a :href="gmContacts.ozon" target="_blank" rel="noopener">Ozon</a>
          </div>
        </div>
        <nav class="gm-footer__nav" aria-label="Разделы">
          <NuxtLink v-for="n in navAll" :key="n.label" :to="n.to">{{ n.label }}</NuxtLink>
        </nav>
        <div class="gm-footer__contacts">
          <p class="gm-footer__label">Контакты</p>
          <a v-for="p in gmContacts.people" :key="p.tel" :href="`tel:${p.tel}`" class="gm-footer__tel">
            <b>{{ p.phone }}</b><span>{{ p.name }}</span>
          </a>
          <a :href="`mailto:${gmContacts.email}`" class="gm-footer__mail">{{ gmContacts.email }}</a>
          <p class="gm-footer__addr">{{ gmContacts.apiary }}<br />{{ gmContacts.office }}</p>
          <button type="button" class="gm-btn gm-btn--line" @click="openCallback">Заказать звонок</button>
        </div>
      </div>
      <div class="gm-wrap gm-footer__legal">
        <span>© {{ year }} ООО «Пасеки Соловьёвых», ИНН 2281006182</span>
        <span>Тексты, цены, логотип и фотографии принадлежат ООО «Пасеки Соловьёвых». Концепт редизайна, не официальный сайт.</span>
      </div>
    </footer>

    <!-- Плавающая корзина на телефоне -->
    <Transition name="gm-fade">
      <NuxtLink v-if="shop.count.value && !onCart" :to="gmPath('/cart')" class="gm-float">
        <GmIcon name="bag" :size="20" />
        <span>{{ shop.count.value }} · {{ gmMoney(shop.total.value) }}{{ shop.hasUnpriced.value ? ' +' : '' }}</span>
      </NuxtLink>
    </Transition>
    <Transition name="gm-fade">
      <button v-if="scrolled" type="button" class="gm-totop" aria-label="Наверх" @click="toTop"><GmIcon name="up" :size="20" /></button>
    </Transition>

    <!-- Заказать звонок -->
    <Transition name="gm-fade">
      <div v-if="ui.callback.value" class="gm-layer" @click.self="ui.callback.value = false">
        <div class="gm-modal" role="dialog" aria-label="Заказать звонок">
          <button type="button" class="gm-iconbtn gm-modal__x" aria-label="Закрыть" @click="ui.callback.value = false"><GmIcon name="close" /></button>
          <template v-if="!cb.sent">
            <h2>Заказать звонок</h2>
            <p class="gm-modal__lead">Оставьте телефон — Сергей Владимирович перезвонит. У нас сейчас {{ altai }} по Алтаю ({{ gmContacts.tz }}).</p>
            <form class="gm-form" @submit.prevent="sendCb">
              <label class="gm-field"><span>Имя</span><input v-model="cb.name" autocomplete="name" placeholder="Как к вам обращаться" /></label>
              <label class="gm-field"><span>Телефон *</span><GmPhone v-model="cb.phone" /></label>
              <button type="submit" class="gm-btn gm-btn--main gm-btn--wide" :disabled="!cbOk">Отправить</button>
            </form>
          </template>
          <div v-else class="gm-modal__done">
            <GmIcon name="check" :size="40" />
            <h2>Спасибо{{ cb.name ? `, ${cb.name}` : '' }}!</h2>
            <p>Перезвоним на {{ cb.phone }}. Это демо: заявка никуда не ушла.</p>
            <button type="button" class="gm-btn gm-btn--line" @click="ui.callback.value = false">Закрыть</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Меню на телефоне -->
    <Transition name="gm-slide-left">
      <div v-if="ui.menu.value" class="gm-layer gm-layer--left" @click.self="ui.menu.value = false">
        <aside class="gm-menu" aria-label="Меню">
          <div class="gm-drawer__head">
            <h2>Меню</h2>
            <button type="button" class="gm-iconbtn" aria-label="Закрыть" @click="ui.menu.value = false"><GmIcon name="close" /></button>
          </div>
          <div class="gm-menu__calls">
            <a v-for="p in gmContacts.people" :key="p.tel" :href="`tel:${p.tel}`" class="gm-menu__tel">
              <GmIcon name="phone" :size="20" />
              <span><b>{{ p.phone }}</b><small>{{ p.name }}</small></span>
            </a>
            <button type="button" class="gm-btn gm-btn--line gm-btn--wide" @click="openCallback">Заказать звонок</button>
          </div>
          <nav class="gm-menu__nav">
            <NuxtLink :to="gmPath()">Главная</NuxtLink>
            <NuxtLink v-for="n in navAll" :key="n.label" :to="n.to">{{ n.label }}</NuxtLink>
          </nav>
          <div class="gm-menu__extra">
            <a :href="gmContacts.price"><GmIcon name="down" :size="19" />Скачать прайс</a>
            <a :href="`mailto:${gmContacts.email}`"><GmIcon name="mail" :size="19" />{{ gmContacts.email }}</a>
            <a :href="`https://wa.me/${sergey.wa}`" target="_blank" rel="noopener"><GmIcon name="chat" :size="19" />WhatsApp Сергея</a>
            <span class="gm-menu__langs">
              <GmIcon name="globe" :size="19" />
              <button type="button" @click="lang('английском')">English</button>
              <button type="button" @click="lang('китайском')">中文</button>
            </span>
          </div>
        </aside>
      </div>
    </Transition>

    <!-- Лайтбокс фото и документов -->
    <Transition name="gm-fade">
      <div v-if="shot" class="gm-layer gm-light" @click.self="ui.gallery.value = null">
        <button type="button" class="gm-light__x" aria-label="Закрыть" @click="ui.gallery.value = null"><GmIcon name="close" :size="26" /></button>
        <button v-if="ui.gallery.value!.items.length > 1" type="button" class="gm-light__nav gm-light__nav--l" aria-label="Назад" @click="step(-1)">
          <GmIcon name="left" :size="28" />
        </button>
        <figure class="gm-light__fig">
          <img :src="shot.src" :alt="shot.cap || ''" />
          <figcaption>
            <span>{{ shot.cap }}</span>
            <span>{{ ui.gallery.value!.index + 1 }} / {{ ui.gallery.value!.items.length }}</span>
          </figcaption>
        </figure>
        <button v-if="ui.gallery.value!.items.length > 1" type="button" class="gm-light__nav gm-light__nav--r" aria-label="Вперёд" @click="step(1)">
          <GmIcon name="right" :size="28" />
        </button>
      </div>
    </Transition>

    <Transition name="gm-fade">
      <div v-if="ui.toast.value" class="gm-toast" role="status">
        <span>{{ ui.toast.value }}</span>
        <NuxtLink v-if="ui.toast.value.startsWith('В корзине') && !onCart" :to="gmPath('/cart')" @click="ui.toast.value = ''">Оформить</NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.gm-body {
  background: #fff;
}
html.gm-html {
  scroll-padding-top: 146px;
  scroll-behavior: smooth;

  @media (max-width: 989px) {
    scroll-padding-top: 80px;
  }
}
html.gm-lock {
  overflow: hidden;
}

.gm {
  --gm-accent: #7a4520;
  --gm-accent-hover: #643819;
  --gm-soft: #f6eee6;
  --gm-ink: #2a1f17;
  --gm-text: #3e342c;
  --gm-muted: #75695f;
  --gm-surface: #f2f4f0;
  --gm-line: #e2e5de;
  --gm-honey: #fedd35;
  --gm-pack: #1d4a3b;
  --gm-green: #2f7a3a;
  --gm-r: 8px;
  --gm-R: 14px;
  --gm-pop: 0 2px 6px rgba(42, 31, 23, 0.08), 0 22px 54px rgba(42, 31, 23, 0.22);
  min-height: 100vh;
  background: #fff;
  color: var(--gm-text);
  font-family: 'Commissioner', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  font-variant-numeric: tabular-nums;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

:where(.gm) h1,
:where(.gm) h2,
:where(.gm) h3,
:where(.gm) p,
:where(.gm) figure,
:where(.gm) dl,
:where(.gm) dd {
  margin: 0;
}
:where(.gm) h1,
:where(.gm) h2,
:where(.gm) h3 {
  color: var(--gm-ink);
  font-family: 'Lora', Georgia, serif;
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: -0.01em;
}
/* У Lora с tnum пробел становится шириной цифры — заголовкам пропорциональные цифры */
.gm h1,
.gm h2,
.gm h3,
.gm-mark__name,
.gm-hjar__txt a,
.gm-tile__name,
.gm-facts b,
.gm-req__btn b {
  font-variant-numeric: normal;
}
:where(.gm) a {
  color: inherit;
  text-decoration: none;
}
:where(.gm) img {
  display: block;
  max-width: 100%;
}
:where(.gm) button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  border: 0;
  background: none;
  padding: 0;
}
:where(.gm) input,
:where(.gm) textarea,
:where(.gm) select {
  font: inherit;
  color: inherit;
}
:where(.gm) ul,
:where(.gm) ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

.gm-wrap {
  width: 100%;
  max-width: 1320px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 32px;
  padding-right: 32px;

  @media (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
}
.gm-section {
  padding-top: 72px;

  @media (max-width: 768px) {
    padding-top: 52px;
  }
}
.gm-main {
  padding-bottom: 88px;

  @media (max-width: 768px) {
    padding-bottom: 64px;
  }
}

.gm-icon {
  flex: none;
}

/* ——— Баннер концепта ——— */
.gm-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px 14px;
  flex-wrap: wrap;
  padding: 8px 16px;
  background: var(--gm-ink);
  color: #f3ece4;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;

  a {
    color: var(--gm-honey);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

/* ——— Шапка ——— */
.gm-header {
  position: sticky;
  z-index: 40;
  background: #fff;
  border-bottom: 1px solid var(--gm-line);
}
.gm-strip {
  background: #fff;
  border-bottom: 1px solid var(--gm-line);
  font-size: 13.5px;
  color: var(--gm-muted);

  &__row {
    display: flex;
    align-items: center;
    gap: 22px;
    min-height: 38px;
    white-space: nowrap;
  }
  &__item {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  &__sp {
    flex: 1;
  }
  &__langs {
    display: inline-flex;
    gap: 4px;

    button {
      padding: 2px 7px;
      border-radius: 6px;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--gm-text);

      &:hover {
        background: var(--gm-surface);
      }
    }
  }
  &__price {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--gm-accent);
    font-weight: 600;

    &:hover {
      color: var(--gm-accent-hover);
    }
  }

  @media (max-width: 1199px) {
    &__where {
      display: none !important;
    }
  }
  @media (max-width: 768px) {
    &__langs,
    &__time {
      display: none !important;
    }
    &__row {
      gap: 14px;
      min-height: 34px;
      font-size: 13px;
    }
  }
  @media (max-width: 375px) {
    &__ship {
      font-size: 12px;
    }
  }
}

.gm-bar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 20px;
  min-height: 84px;

  .gm-iconbtn.gm-bar__burger {
    display: none;
  }
  &__left {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
  }
  &__right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
  }

  @media (max-width: 1199px) {
    .gm-iconbtn.gm-bar__burger {
      display: inline-flex;
    }
  }
  @media (max-width: 768px) {
    min-height: 66px;
    gap: 10px;
  }
}

.gm-iconbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--gm-r);
  color: var(--gm-ink);

  &:hover {
    background: var(--gm-surface);
  }
}

.gm-mark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  justify-self: center;

  img {
    width: auto;
    height: 64px;
  }
  &__name {
    font-family: 'Lora', Georgia, serif;
    font-weight: 700;
    font-size: 17px;
    line-height: 1.08;
    color: var(--gm-accent);
  }

  @media (max-width: 768px) {
    gap: 8px;

    img {
      height: 48px;
    }
    &__name {
      font-size: 15px;
    }
  }
  @media (max-width: 375px) {
    &__name {
      display: none;
    }
  }
  &--foot img {
    height: 72px;
  }
}

.gm-calls {
  position: relative;

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    padding: 0 12px;
    border-radius: var(--gm-r);
    color: var(--gm-ink);
    text-align: left;

    &:hover {
      background: var(--gm-surface);
    }
  }
  &__text {
    display: grid;
    line-height: 1.2;

    b {
      font-weight: 700;
      white-space: nowrap;
    }
    small {
      font-size: 12px;
      color: var(--gm-muted);
      white-space: nowrap;
    }
  }
  &__chev {
    transform: rotate(90deg);
    transition: transform 0.2s;
  }
  &.is-open &__chev {
    transform: rotate(-90deg);
  }
  &__pop {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: 5;
    display: none;
    width: 320px;
    padding: 8px;
    background: #fff;
    border: 1px solid var(--gm-line);
    border-radius: var(--gm-R);
    box-shadow: var(--gm-pop);
  }
  &.is-open &__pop {
    display: grid;
  }
  &__row {
    display: grid;
    gap: 1px;
    padding: 10px 12px;
    border-radius: var(--gm-r);

    b {
      color: var(--gm-ink);
    }
    span {
      font-size: 13px;
      color: var(--gm-muted);
    }
    &:hover {
      background: var(--gm-surface);
    }
    &--line b {
      font-weight: 600;
    }
  }
  &__cb {
    margin: 6px 4px 4px;
  }

  @media (max-width: 1400px) {
    &__text small {
      display: none;
    }
  }
  @media (max-width: 989px) {
    &__text,
    &__chev {
      display: none;
    }
    &__btn {
      width: 44px;
      padding: 0;
      justify-content: center;
    }
  }
  @media (max-width: 576px) {
    display: none;
  }
}

.gm-cartbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: 172px;
  height: 52px;
  padding: 0 14px;
  border-radius: var(--gm-r);
  background: var(--gm-surface);
  color: var(--gm-ink);
  text-align: left;

  &__text {
    display: grid;
    line-height: 1.2;
    min-width: 0;

    b {
      font-weight: 700;
      white-space: nowrap;
    }
    small {
      font-size: 12.5px;
      color: var(--gm-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &__count {
    display: none;
  }
  &.is-full {
    background: var(--gm-accent);
    color: #fff;

    small {
      color: #f3e3d2;
    }
  }
  &:hover {
    filter: brightness(0.97);
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    padding: 0;
    justify-content: center;
    background: none;

    &.is-full {
      background: none;
      color: var(--gm-ink);
    }
    &__text {
      display: none;
    }
    &__count {
      position: absolute;
      top: 2px;
      right: 0;
      display: grid;
      place-items: center;
      min-width: 19px;
      height: 19px;
      padding: 0 5px;
      border-radius: 10px;
      background: var(--gm-honey);
      color: var(--gm-ink);
      font-size: 11.5px;
      font-style: normal;
      font-weight: 700;
    }
  }
}

/* Меню оригинала: светлая полоса в тон их коричневого */
.gm-nav {
  background: var(--gm-soft);
  border-top: 1px solid #eadccd;

  &__row {
    display: flex;
    justify-content: space-between;
    gap: 4px;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
    a {
      flex: none;
      padding: 11px 12px;
      font-weight: 600;
      font-size: 15px;
      color: #5c3317;
      white-space: nowrap;
      border-bottom: 2px solid transparent;

      &:hover {
        color: var(--gm-accent);
        border-bottom-color: #d9b99c;
      }
      &.is-on {
        color: var(--gm-accent);
        border-bottom-color: var(--gm-accent);
      }
    }
  }
  @media (max-width: 1199px) {
    &__row {
      gap: 0;

      a {
        padding: 10px 6px;
        font-size: 14px;
      }
    }
  }
  @media (max-width: 989px) {
    display: none;
  }
}

/* ——— Кнопки, метки, поля ——— */
.gm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: var(--gm-r);
  font-weight: 600;
  white-space: nowrap;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;

  &--main {
    background: var(--gm-accent);
    color: #fff;

    &:hover {
      background: var(--gm-accent-hover);
    }
    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  }
  &--line,
  &--line:focus,
  &--line:active {
    background: #fff;
    border: 1px solid #d5d1c9;
    color: var(--gm-ink);
  }
  &--line:hover {
    border-color: var(--gm-accent);
    color: var(--gm-accent);
  }
  &--soft {
    background: var(--gm-soft);
    color: var(--gm-accent);

    &:hover {
      background: #efe1d3;
    }
  }
  &--wide {
    width: 100%;
  }
  &--small {
    min-height: 38px;
    padding: 0 14px;
    font-size: 14px;
  }
}
.gm-label {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 6px;
  background: var(--gm-honey);
  color: var(--gm-ink);
  font-size: 12.5px;
  font-weight: 700;
  line-height: 1.3;
  white-space: nowrap;
}
.gm-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--gm-accent);
  font-weight: 600;

  &:hover {
    color: var(--gm-accent-hover);
  }
}
.gm-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px 24px;
  flex-wrap: wrap;
  margin-bottom: 28px;

  h2 {
    font-size: clamp(26px, 3vw, 36px);
  }
  p {
    max-width: 640px;
    margin-top: 8px;
    color: var(--gm-muted);
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
}
.gm-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  padding-top: 20px;
  font-size: 13.5px;
  color: var(--gm-muted);

  a:hover {
    color: var(--gm-accent);
  }
  span::before {
    content: '/';
    margin-right: 8px;
    color: #c9c4bb;
  }
}
.gm-title {
  margin-top: 10px;
  font-size: clamp(30px, 4vw, 44px);
}
.gm-lead {
  max-width: 720px;
  margin-top: 12px;
  font-size: 16.5px;
  color: var(--gm-muted);
}

.gm-form {
  display: grid;
  gap: 14px;
}
.gm-field {
  display: grid;
  gap: 6px;

  > span {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--gm-ink);
  }
  input,
  textarea {
    width: 100%;
    min-height: 48px;
    padding: 11px 14px;
    border: 1px solid #d7d3cb;
    border-radius: var(--gm-r);
    background: #fff;
    outline: none;

    &:focus {
      border-color: var(--gm-accent);
      box-shadow: 0 0 0 3px rgba(122, 69, 32, 0.14);
    }
  }
  textarea {
    min-height: 96px;
    resize: vertical;
  }
}

/* ——— Счётчик ——— */
.gm-qty {
  display: inline-flex;
  align-items: center;
  height: 46px;
  border-radius: var(--gm-r);
  background: var(--gm-soft);
  color: var(--gm-ink);

  > button {
    display: grid;
    place-items: center;
    width: 42px;
    height: 100%;
    border-radius: var(--gm-r);
    color: var(--gm-accent);

    &:hover {
      background: #efe1d3;
    }
  }
  &__val {
    display: inline-flex;
    align-items: baseline;
    justify-content: center;
    min-width: 54px;
    padding: 0 4px;
    font-weight: 700;

    input {
      padding: 0;
      border: 0;
      background: none;
      text-align: center;
      font-weight: 700;
      outline: none;
    }
    span {
      padding: 0 0 0 4px;
      font-size: 13px;
      font-weight: 500;
      color: var(--gm-muted);
    }
  }
  &--small {
    height: 38px;

    > button {
      width: 36px;
    }
  }
}

/* ——— K19 «банка на зелёном» ——— */
.gm-jar {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1fr);
  border: 1px solid var(--gm-line);
  border-radius: var(--gm-R);
  background: #fff;
  overflow: hidden;

  &__photo {
    position: relative;
    display: block;
    aspect-ratio: 3 / 4;
    background: var(--gm-pack);
    overflow: hidden;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition:
        opacity 0.25s,
        transform 0.4s;

      &.is-on {
        opacity: 1;
      }
    }
    &:hover img.is-on {
      transform: scale(1.03);
    }
    .gm-label {
      position: absolute;
      left: 12px;
      bottom: 12px;
    }
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 22px 22px 22px;
    min-width: 0;
  }
  &__head {
    display: flex;
    align-items: center;
    gap: 10px;

    h3 {
      font-size: 26px;
    }
    a:hover {
      color: var(--gm-accent);
    }
  }
  &__hue {
    width: 34px;
    height: 10px;
    border-radius: 5px;
  }
  &__note {
    color: var(--gm-muted);
    font-size: 14.5px;
  }
  &__kg {
    display: grid;
    gap: 2px;
    font-size: 14px;

    span {
      font-weight: 600;
      color: var(--gm-ink);
    }
    small {
      font-size: 13px;
      color: var(--gm-green);
    }
  }
  &__buy {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid var(--gm-line);
  }
  &__price {
    display: grid;
    line-height: 1.15;

    b {
      font-size: 24px;
      color: var(--gm-ink);
    }
    span {
      font-size: 13px;
      color: var(--gm-muted);
    }
  }

  @media (max-width: 1199px) {
    &__head h3 {
      font-size: 23px;
    }
    &__body {
      padding: 18px;
    }
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);

    &__photo {
      aspect-ratio: 4 / 3;

      img {
        object-position: 50% 35%;
      }
    }
  }
}
.gm-packs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;

  &__btn,
  &__btn:focus {
    display: grid;
    gap: 1px;
    padding: 9px 6px;
    border: 1px solid var(--gm-line);
    border-radius: var(--gm-r);
    background: #fff;
    text-align: center;
    line-height: 1.2;

    b {
      font-weight: 700;
      color: var(--gm-ink);
    }
    span {
      font-size: 13px;
      color: var(--gm-muted);
      white-space: nowrap;
    }
  }
  &__btn:hover {
    border-color: #c9b6a5;
  }
  &__btn.is-on {
    border-color: var(--gm-accent);
    background: var(--gm-soft);
    box-shadow: inset 0 0 0 1px var(--gm-accent);
  }
}

/* ——— Блоки, общие для страниц ——— */
.gm-panel {
  padding: 28px;
  border-radius: var(--gm-R);
  background: var(--gm-surface);

  @media (max-width: 768px) {
    padding: 20px;
  }
}
.gm-people {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.gm-person {
  display: grid;
  gap: 4px;
  padding: 18px;
  border-radius: var(--gm-R);
  background: #fff;
  border: 1px solid var(--gm-line);

  b {
    font-size: 19px;
    color: var(--gm-ink);
  }
  span {
    font-size: 14px;
    color: var(--gm-muted);
  }
  .gm-person__acts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }
}
.gm-ask {
  display: inline-flex;
  gap: 6px;
}

/* ——— Подвал ——— */
.gm-footer {
  background: var(--gm-surface);
  padding-top: 52px;

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.8fr) minmax(0, 1fr);
    gap: 40px;
  }
  &__brand p {
    max-width: 380px;
    margin-top: 16px;
    color: var(--gm-muted);
  }
  &__mp {
    display: flex;
    gap: 8px;
    margin-top: 16px;

    a {
      padding: 7px 14px;
      border-radius: var(--gm-r);
      background: #fff;
      font-weight: 600;
      font-size: 14px;
      color: var(--gm-ink);

      &:hover {
        color: var(--gm-accent);
      }
    }
  }
  &__nav {
    display: grid;
    align-content: start;
    gap: 8px;

    a {
      font-weight: 500;
      color: var(--gm-ink);

      &:hover {
        color: var(--gm-accent);
      }
    }
  }
  &__contacts {
    display: grid;
    align-content: start;
    justify-items: start;
    gap: 8px;
  }
  &__label {
    font-weight: 700;
    color: var(--gm-ink);
  }
  &__tel {
    display: grid;
    line-height: 1.25;

    b {
      font-size: 17px;
      color: var(--gm-ink);
    }
    span {
      font-size: 13px;
      color: var(--gm-muted);
    }
  }
  &__mail {
    color: var(--gm-accent);
    font-weight: 600;
  }
  &__addr {
    font-size: 13.5px;
    color: var(--gm-muted);
  }
  &__legal {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 6px 24px;
    margin-top: 40px;
    padding-top: 18px;
    padding-bottom: 22px;
    border-top: 1px solid var(--gm-line);
    font-size: 12.5px;
    color: var(--gm-muted);
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
    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }
  }
}

/* ——— Плавающие кнопки ——— */
.gm-float {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 35;
  display: none;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 18px;
  border-radius: 26px;
  background: var(--gm-accent);
  color: #fff;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 10px 28px rgba(42, 31, 23, 0.3);

  @media (max-width: 768px) {
    display: inline-flex;
  }
}
.gm-totop {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 34;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid var(--gm-line);
  color: var(--gm-ink);
  box-shadow: 0 6px 18px rgba(42, 31, 23, 0.14);

  &:hover {
    color: var(--gm-accent);
  }
  @media (max-width: 768px) {
    left: 16px;
    bottom: 19px;
  }
}
.gm-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 80;
  max-width: min(520px, calc(100vw - 32px));
  padding: 12px 18px;
  border-radius: var(--gm-r);
  background: var(--gm-ink);
  color: #fff;
  font-size: 14px;
  transform: translateX(-50%);
  box-shadow: var(--gm-pop);
  display: flex;
  align-items: center;
  gap: 14px;

  a {
    flex: none;
    color: var(--gm-honey);
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  @media (max-width: 768px) {
    bottom: 80px;
  }
}

/* ——— Слои: корзина, меню, окна, лайтбокс ——— */
.gm-layer {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(30, 22, 16, 0.5);

  &--side,
  &--left {
    padding: 0;
    place-items: stretch end;
  }
  &--left {
    place-items: stretch start;
  }
}
.gm-drawer,
.gm-menu {
  display: flex;
  flex-direction: column;
  width: min(440px, 100vw);
  height: 100%;
  background: #fff;
  overflow-y: auto;

  &__head {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 14px 22px;
    background: #fff;
    border-bottom: 1px solid var(--gm-line);

    h2 {
      font-size: 24px;
    }
  }
}
.gm-menu {
  width: min(360px, 100vw);
}
.gm-menu {
  &__calls {
    display: grid;
    gap: 10px;
    padding: 16px 22px;
    border-bottom: 1px solid var(--gm-line);
  }
  &__tel {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--gm-accent);

    span {
      display: grid;
      line-height: 1.25;
    }
    b {
      color: var(--gm-ink);
      font-size: 17px;
    }
    small {
      font-size: 13px;
      color: var(--gm-muted);
    }
  }
  &__nav {
    display: grid;
    padding: 10px 12px;
    border-bottom: 1px solid var(--gm-line);

    a {
      padding: 11px 10px;
      border-radius: var(--gm-r);
      font-weight: 600;
      font-size: 16px;
      color: var(--gm-ink);

      &:hover,
      &.router-link-exact-active {
        background: var(--gm-surface);
      }
    }
  }
  &__extra {
    display: grid;
    gap: 14px;
    padding: 18px 22px 28px;

    a,
    > span {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--gm-ink);
    }
    .gm-icon {
      color: var(--gm-accent);
    }
  }
  &__langs button {
    padding: 2px 8px;
    border-radius: 6px;
    background: var(--gm-surface);
    font-size: 14px;
    font-weight: 600;
  }
}
.gm-modal {
  position: relative;
  width: min(440px, 100%);
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  padding: 30px 28px 28px;
  border-radius: 18px;
  background: #fff;

  h2 {
    font-size: 26px;
    padding-right: 36px;
  }
  &__x {
    position: absolute;
    top: 12px;
    right: 12px;
  }
  &__lead {
    margin: 8px 0 20px;
    color: var(--gm-muted);
  }
  &__done {
    display: grid;
    justify-items: center;
    gap: 12px;
    text-align: center;

    .gm-icon {
      color: var(--gm-green);
    }
    h2 {
      padding: 0;
    }
    p {
      color: var(--gm-muted);
    }
  }
  @media (max-width: 576px) {
    padding: 26px 18px 20px;
  }
}
.gm-light {
  background: rgba(16, 12, 9, 0.92);
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;

  &__fig {
    display: grid;
    justify-items: center;
    gap: 10px;
    min-width: 0;

    img {
      max-height: calc(100vh - 110px);
      border-radius: 6px;
      object-fit: contain;
    }
    figcaption {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      width: 100%;
      color: #e8e2db;
      font-size: 14px;
    }
  }
  &__x {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    color: #fff;
  }
  &__nav {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;

    &:hover {
      background: rgba(255, 255, 255, 0.22);
    }
  }
  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);

    &__nav {
      position: absolute;
      bottom: 16px;

      &--l {
        left: 16px;
      }
      &--r {
        right: 16px;
      }
    }
    &__fig img {
      max-height: calc(100vh - 170px);
    }
  }
}

/* Плитка куботейнера вместо фото банки: в опте продают тару 30–33 кг, а не банку */
.gm .gm-cube {
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 4px;
  background: #f4ead9;
  color: var(--gm-accent);

  small {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--gm-ink);
    white-space: nowrap;
  }
}

/* ——— Сетки, общие для главной и разделов ——— */
.gm-jars {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);

    .gm-jar {
      grid-template-columns: minmax(220px, 300px) minmax(0, 1fr);
    }
  }
  @media (max-width: 576px) {
    .gm-jar {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
.gm-albums {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 989px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.gm-album {
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  border-radius: var(--gm-R);
  overflow: hidden;
  background: var(--gm-surface);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
  }
  > span {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    display: grid;
    padding: 8px 12px;
    border-radius: var(--gm-r);
    background: rgba(255, 255, 255, 0.94);
    font-size: 13px;
    color: var(--gm-muted);
    line-height: 1.3;

    b {
      font-size: 14.5px;
      color: var(--gm-ink);
    }
  }
  &:hover img {
    transform: scale(1.04);
  }
  @media (max-width: 576px) {
    > span {
      left: 6px;
      right: 6px;
      bottom: 6px;
      padding: 6px 8px;
      font-size: 12px;

      b {
        font-size: 13px;
      }
    }
  }
}
.gm-newsrow {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.gm-ncard {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: 16px;
  padding: 14px;
  border: 1px solid var(--gm-line);
  border-radius: var(--gm-R);

  &__img {
    width: 112px;
    height: 140px;
    border-radius: var(--gm-r);
    background: var(--gm-surface);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__body {
    display: grid;
    align-content: start;
    gap: 6px;

    time {
      font-size: 13px;
      color: var(--gm-muted);
    }
    b {
      color: var(--gm-ink);
      line-height: 1.3;
    }
    > span {
      font-size: 14px;
      color: var(--gm-muted);
    }
  }
  &:hover b {
    color: var(--gm-accent);
  }
  @media (max-width: 375px) {
    grid-template-columns: 84px minmax(0, 1fr);

    &__img {
      width: 84px;
      height: 108px;
    }
  }
}

.gm-fade-enter-active,
.gm-fade-leave-active {
  transition: opacity 0.2s;
}
.gm-fade-enter-from,
.gm-fade-leave-to {
  opacity: 0;
}
.gm-slide-enter-active,
.gm-slide-leave-active,
.gm-slide-left-enter-active,
.gm-slide-left-leave-active {
  transition: opacity 0.25s;

  .gm-menu {
    transition: transform 0.25s;
  }
}
.gm-slide-enter-from,
.gm-slide-leave-to,
.gm-slide-left-enter-from,
.gm-slide-left-leave-to {
  opacity: 0;
}
.gm-slide-left-enter-from .gm-menu,
.gm-slide-left-leave-to .gm-menu {
  transform: translateX(-40px);
}
</style>
