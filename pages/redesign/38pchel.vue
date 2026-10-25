<script lang="ts" setup>
import PcIcon from '~/components/redesign/38pchel/PcIcon.vue'

const route = useRoute()
const shop = usePchelShop()
const ui = usePchelUi()

const nav = [
  { to: pcPath('/catalog'), label: 'Каталог' },
  { to: pcPath('/about'), label: 'О пасеке' },
  { to: pcPath('/delivery'), label: 'Доставка и оплата' },
  { to: pcPath('/reviews'), label: 'Отзывы' },
  { to: pcPath('/contacts'), label: 'Контакты' },
]

useSeoMeta({
  title: '38пчёл — мёд с семейной пасеки Черепановых, Иркутск | Концепт редизайна',
  description:
    'Концепт редизайна интернет-магазина «38пчёл»: донниковый, эспарцетовый, луговой мёд урожая 2026 года, перга, прополис и соты с пасеки под Иркутском, доставка в день заказа.',
  ogTitle: '38пчёл — концепт редизайна',
  ogDescription:
    'Мёд урожая 2026 года с семейной пасеки у Оёка: цена за каждую фасовку на виду, прозрачный или севший, пластик или стекло, доставка по Иркутску в день заказа.',
  ogImage: 'https://andryushov.me/redesign/38pchel/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'pc-html', lang: 'ru' },
  bodyAttrs: { class: 'pc-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:wght@600;700;800&family=Fira+Sans:wght@400;500;600&display=swap',
    },
  ],
})

onMounted(() => shop.persist())

watch(
  () => route.fullPath,
  () => ui.closeAll(),
)

// Меню, вход и поиск закрывают страницу целиком — фон не прокручивается.
watch([ui.menuOpen, ui.loginOpen, ui.searchOpen], ([a, b, c]) => {
  document.documentElement.classList.toggle('pc-locked', Boolean(a || b || c))
})

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') ui.closeAll()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('pc-locked')
})

// Поиск с подсказками: название, раздел, вкус.
const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const found = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (q.length < 2) return []
  return pcProducts
    .filter((p) => [p.title, p.lead, p.honey?.taste ?? '', p.honey?.flower ?? ''].join(' ').toLowerCase().includes(q))
})
const popular = ['донник', 'соты', 'перга', 'прополис', 'гречишный']
const openSearch = async () => {
  ui.closeAll()
  ui.searchOpen.value = true
  await nextTick()
  searchInput.value?.focus()
}
const goSearch = () => {
  navigateTo({ path: pcPath('/catalog'), query: query.value.trim() ? { q: query.value.trim() } : {} })
}

// Вход — на моках: любой e-mail и пароль от 4 символов.
const login = reactive({ mode: 'in' as 'in' | 'up' | 'forgot', name: '', email: '', password: '', error: '' })
const submitLogin = () => {
  if (!/.+@.+\..+/.test(login.email)) return (login.error = 'Проверьте e-mail')
  if (login.mode === 'forgot') {
    ui.say('В концепте письмо не отправляется — на сайте придёт ссылка для смены пароля')
    login.mode = 'in'
    return
  }
  if (login.password.length < 4) return (login.error = 'Пароль — не короче 4 символов')
  shop.user.value = { name: login.name || login.email.split('@')[0], email: login.email }
  login.error = ''
  ui.loginOpen.value = false
  ui.say(login.mode === 'up' ? 'Кабинет создан. Это демо: данные хранятся только в браузере' : 'Вы вошли. Это демо')
}

const isCart = computed(() => route.path.startsWith(pcPath('/cart')))
const year = new Date().getFullYear()
const email = ref('')
const subscribe = () => {
  if (!/.+@.+\..+/.test(email.value)) return ui.say('Проверьте e-mail')
  shop.subscribed.value = email.value
  ui.say('Подписка оформлена. В концепте письма не приходят')
}
const tabs = [
  { to: pcPath('/'), label: 'Главная', icon: 'hive', exact: true },
  { to: pcPath('/catalog'), label: 'Каталог', icon: 'comb' },
  { to: pcPath('/account'), label: 'Закладки', icon: 'heart' },
]
const isActive = (to: string, exact?: boolean) =>
  exact ? route.path === to || route.path + '/' === to : route.path.startsWith(to.replace(/\/$/, ''))
</script>

<template>
  <div class="pc">
    <div class="pc-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="pcContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="pc-header">
      <div class="pc-wrap pc-header__row">
        <button type="button" class="pc-header__burger" aria-label="Меню" @click="ui.menuOpen.value = true">
          <PcIcon name="menu" />
        </button>

        <NuxtLink :to="pcPath()" class="pc-mark" aria-label="38пчёл, на главную">
          <span class="pc-mark__sign"><PcIcon name="bee" :size="26" /></span>
          <span class="pc-mark__text">
            <span class="pc-mark__name"><b>38</b>пчёл</span>
            <span class="pc-mark__sub">пасека Черепановых · Иркутск</span>
          </span>
        </NuxtLink>

        <nav class="pc-header__nav" aria-label="Разделы сайта">
          <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        </nav>

        <div class="pc-header__right">
          <a :href="pcContacts.phoneHref" class="pc-header__phone">
            <b>{{ pcContacts.phone }}</b>
            <span>{{ pcContacts.hours }}, без выходных</span>
          </a>
          <button type="button" class="pc-hbtn" aria-label="Поиск" @click="openSearch">
            <PcIcon name="search" />
          </button>
          <NuxtLink v-if="shop.user.value" :to="pcPath('/account')" class="pc-hbtn pc-hbtn--user" aria-label="Кабинет">
            <PcIcon name="user" />
          </NuxtLink>
          <button v-else type="button" class="pc-hbtn pc-hbtn--user" aria-label="Войти" @click="ui.loginOpen.value = true">
            <PcIcon name="user" />
          </button>
          <NuxtLink :to="pcPath('/account')" class="pc-hbtn pc-hbtn--fav" aria-label="Закладки">
            <PcIcon name="heart" />
            <i v-if="shop.favs.value.length">{{ shop.favs.value.length }}</i>
          </NuxtLink>
          <div class="pc-cartwrap" @mouseleave="ui.miniCart.value = false">
            <NuxtLink
              :to="pcPath('/cart')"
              class="pc-cartbtn"
              :class="{ 'is-full': shop.count.value, 'is-active': isCart }"
              @mouseenter="ui.miniCart.value = !isCart && shop.count.value > 0"
            >
              <PcIcon name="bag" />
              <span class="pc-cartbtn__sum">{{ shop.count.value ? pcRub(shop.total.value) : 'Корзина' }}</span>
              <i v-if="shop.count.value">{{ shop.count.value }}</i>
            </NuxtLink>
            <div v-if="ui.miniCart.value && shop.lines.value.length" class="pc-mini">
              <ul class="pc-mini__list">
                <li v-for="l in shop.lines.value" :key="l.key">
                  <img :src="pcImg(l.product.img)" alt="" width="48" height="48" />
                  <span>
                    <b>{{ l.product.title }}</b>
                    <small>{{ l.label }} · {{ l.qty }} шт</small>
                  </span>
                  <em>{{ pcRub(l.sum) }}</em>
                  <button type="button" aria-label="Удалить" @click="shop.setQty(l.key, 0)"><PcIcon name="close" :size="16" /></button>
                </li>
              </ul>
              <div class="pc-mini__total">
                <span>Итого</span><b>{{ pcRub(shop.total.value) }}</b>
              </div>
              <NuxtLink :to="pcPath('/cart')" class="pc-btn pc-btn--accent pc-btn--wide">Оформить заказ</NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <div class="pc-ribbon">
        <div class="pc-wrap pc-ribbon__row">
          <NuxtLink
            v-for="s in pcSections"
            :key="s.id"
            :to="{ path: pcPath('/catalog'), query: { s: s.id } }"
            class="pc-ribbon__item"
            :class="{ 'is-on': route.query.s === s.id }"
          >
            <PcIcon :name="s.icon" :size="20" />
            {{ s.title }}
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="pc-main">
      <NuxtPage />
    </main>

    <footer class="pc-footer">
      <div class="pc-wrap pc-footer__grid">
        <div class="pc-footer__about">
          <NuxtLink :to="pcPath()" class="pc-mark">
            <span class="pc-mark__sign"><PcIcon name="bee" :size="26" /></span>
            <span class="pc-mark__text">
              <span class="pc-mark__name"><b>38</b>пчёл</span>
              <span class="pc-mark__sub">пасека Черепановых с 1991 года</span>
            </span>
          </NuxtLink>
          <p>Мёд и продукты пчеловодства с нашей пасеки в Иркутском районе. Доставляем по Иркутску сами, обычно в день заказа.</p>
          <div class="pc-footer__social">
            <a :href="pcContacts.vk" target="_blank" rel="noopener" aria-label="ВКонтакте"><PcIcon name="vk" /></a>
            <a :href="pcContacts.youtube" target="_blank" rel="noopener" aria-label="YouTube"><PcIcon name="youtube" /></a>
          </div>
        </div>
        <div>
          <h3>Каталог</h3>
          <ul class="pc-footer__links">
            <li v-for="s in pcSections" :key="s.id">
              <NuxtLink :to="{ path: pcPath('/catalog'), query: { s: s.id } }">{{ s.title }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3>Покупателям</h3>
          <ul class="pc-footer__links">
            <li v-for="item in nav.slice(1)" :key="item.to"><NuxtLink :to="item.to">{{ item.label }}</NuxtLink></li>
            <li><NuxtLink :to="pcPath('/account')">Кабинет и закладки</NuxtLink></li>
          </ul>
        </div>
        <div class="pc-footer__contacts">
          <h3>Контакты</h3>
          <a :href="pcContacts.phoneHref"><b>{{ pcContacts.phone }}</b> {{ pcContacts.phoneName }}</a>
          <a :href="pcContacts.phone2Href">{{ pcContacts.phone2 }}</a>
          <a :href="`mailto:${pcContacts.email}`">{{ pcContacts.email }}</a>
          <span>{{ pcContacts.hours }}, без выходных</span>
          <form class="pc-sub" @submit.prevent="subscribe">
            <label for="pc-sub">Акции и новый урожай — на почту</label>
            <div v-if="!shop.subscribed.value" class="pc-sub__row">
              <input id="pc-sub" v-model="email" type="email" placeholder="E-mail" autocomplete="email" />
              <button type="submit" class="pc-btn pc-btn--dark">Подписаться</button>
            </div>
            <p v-else class="pc-sub__done"><PcIcon name="check" :size="18" /> Подписаны: {{ shop.subscribed.value }}</p>
          </form>
        </div>
      </div>
      <div class="pc-wrap pc-footer__legal">
        <span>© {{ year }} Концепт редизайна сайта 38pchel.ru. Тексты, цены, фотографии и товарные знаки принадлежат владельцам магазина «38пчёл».</span>
        <a :href="pcContacts.original" target="_blank" rel="noopener">Оригинальный сайт</a>
      </div>
    </footer>

    <nav class="pc-tabbar" aria-label="Быстрая навигация">
      <NuxtLink v-for="t in tabs" :key="t.label" :to="t.to" :class="{ 'is-on': isActive(t.to, t.exact) }">
        <PcIcon :name="t.icon" />
        <span>{{ t.label }}</span>
      </NuxtLink>
      <NuxtLink :to="pcPath('/cart')" class="pc-tabbar__cart" :class="{ 'is-on': isCart, 'is-full': shop.count.value }">
        <PcIcon name="bag" />
        <span>{{ shop.count.value ? pcRub(shop.total.value) : 'Корзина' }}</span>
        <i v-if="shop.count.value">{{ shop.count.value }}</i>
      </NuxtLink>
    </nav>

    <Transition name="pc-fade">
      <div v-if="ui.menuOpen.value" class="pc-drawer" @click.self="ui.menuOpen.value = false">
        <div class="pc-drawer__panel">
          <div class="pc-drawer__head">
            <b>Меню</b>
            <button type="button" class="pc-hbtn" aria-label="Закрыть" @click="ui.menuOpen.value = false"><PcIcon name="close" /></button>
          </div>
          <div class="pc-drawer__sections">
            <NuxtLink v-for="s in pcSections" :key="s.id" :to="{ path: pcPath('/catalog'), query: { s: s.id } }">
              <PcIcon :name="s.icon" :size="22" />
              <span>{{ s.title }}</span>
            </NuxtLink>
          </div>
          <nav class="pc-drawer__nav">
            <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
            <NuxtLink :to="pcPath('/account')">Кабинет и закладки</NuxtLink>
          </nav>
          <div class="pc-drawer__contacts">
            <a :href="pcContacts.phoneHref" class="pc-btn pc-btn--accent pc-btn--wide"><PcIcon name="phone" :size="20" /> {{ pcContacts.phone }}</a>
            <span>{{ pcContacts.hours }}, без выходных · {{ pcContacts.email }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="pc-fade">
      <div v-if="ui.searchOpen.value" class="pc-overlay pc-overlay--top" @click.self="ui.searchOpen.value = false">
        <div class="pc-search">
          <form class="pc-search__form" role="search" @submit.prevent="goSearch">
            <PcIcon name="search" />
            <input ref="searchInput" v-model="query" type="search" placeholder="Мёд, перга, прополис…" aria-label="Поиск по магазину" />
            <button type="button" class="pc-hbtn" aria-label="Закрыть поиск" @click="ui.searchOpen.value = false"><PcIcon name="close" /></button>
          </form>
          <ul v-if="found.length" class="pc-search__list">
            <li v-for="p in found.slice(0, 10)" :key="p.id">
              <NuxtLink :to="pcPath(`/product/${p.id}`)">
                <img :src="pcImg(p.img)" alt="" width="52" height="52" />
                <span>
                  <b>{{ p.title }}</b>
                  <small>{{ p.honey?.taste ?? p.lead }}</small>
                </span>
                <em>от {{ pcRub(p.base) }}</em>
              </NuxtLink>
            </li>
            <li v-if="found.length > 10">
              <button type="button" class="pc-search__all" @click="goSearch">Все результаты · {{ found.length }}</button>
            </li>
          </ul>
          <p v-else-if="query.trim().length >= 2" class="pc-search__empty">Ничего не нашли. Позвоните — Сергей подскажет: {{ pcContacts.phone }}</p>
          <div v-else class="pc-search__popular">
            <span>Часто ищут</span>
            <button v-for="w in popular" :key="w" type="button" class="pc-tag" @click="query = w">{{ w }}</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="pc-fade">
      <div v-if="ui.loginOpen.value" class="pc-overlay" @click.self="ui.loginOpen.value = false">
        <form class="pc-modal" @submit.prevent="submitLogin">
          <div class="pc-modal__head">
            <h2>{{ login.mode === 'up' ? 'Регистрация' : login.mode === 'forgot' ? 'Восстановить пароль' : 'Вход в кабинет' }}</h2>
            <button type="button" class="pc-hbtn" aria-label="Закрыть" @click="ui.loginOpen.value = false"><PcIcon name="close" /></button>
          </div>
          <p class="pc-modal__note">В кабинете — история заказов и закладки. Демо: данные хранятся только в этом браузере.</p>
          <label v-if="login.mode === 'up'" class="pc-field">
            <span>Имя</span>
            <input v-model="login.name" type="text" autocomplete="name" />
          </label>
          <label class="pc-field">
            <span>E-mail</span>
            <input v-model="login.email" type="email" autocomplete="email" required />
          </label>
          <label v-if="login.mode !== 'forgot'" class="pc-field">
            <span>Пароль</span>
            <input v-model="login.password" type="password" autocomplete="current-password" required />
          </label>
          <p v-if="login.error" class="pc-modal__error">{{ login.error }}</p>
          <button type="submit" class="pc-btn pc-btn--accent pc-btn--wide">
            {{ login.mode === 'up' ? 'Зарегистрироваться' : login.mode === 'forgot' ? 'Прислать ссылку' : 'Войти' }}
          </button>
          <div class="pc-modal__links">
            <button v-if="login.mode !== 'up'" type="button" @click="login.mode = 'up'">Регистрация</button>
            <button v-if="login.mode !== 'in'" type="button" @click="login.mode = 'in'">Уже есть кабинет</button>
            <button v-if="login.mode === 'in'" type="button" @click="login.mode = 'forgot'">Забыли пароль?</button>
          </div>
        </form>
      </div>
    </Transition>

    <Transition name="pc-fade">
      <div v-if="ui.toast.value" class="pc-toast" role="status">{{ ui.toast.value }}</div>
    </Transition>
  </div>
</template>

<style lang="scss">
.pc-html.pc-locked {
  overflow: hidden;
}

.pc-body {
  margin: 0;
  background: #fff;
}

.pc {
  --pc-accent: #c2410c;
  --pc-accent-dark: #9a330a;
  --pc-ink: #1c1a17;
  --pc-muted: #6e665a;
  --pc-honey: #f6c445;
  --pc-honey-soft: #fdedb5;
  --pc-surface: #faf4e6;
  --pc-line: #ece4d2;
  --pc-line-strong: #dccfb3;
  --pc-ok: #2f7d32;
  --pc-r: 12px;
  --pc-r-card: 20px;
  --pc-r-panel: 28px;
  --pc-head: 'Fira Sans Condensed', 'Fira Sans', system-ui, sans-serif;
  --pc-text: 'Fira Sans', system-ui, sans-serif;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: var(--pc-ink);
  font-family: var(--pc-text);
  font-size: 15px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

:where(.pc) :is(h1, h2, h3, h4, p, ul, ol, figure, blockquote) {
  margin: 0;
  padding: 0;
}

:where(.pc) :is(ul, ol) {
  list-style: none;
}

:where(.pc) a {
  color: inherit;
  text-decoration: none;
}

:where(.pc) img {
  max-width: 100%;
}

:where(.pc) button {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

:where(.pc) :is(input, select, textarea) {
  font: inherit;
  color: inherit;
}

:where(.pc) :is(h1, h2, h3) {
  font-family: var(--pc-head);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.pc-main {
  flex: 1;
}

.pc-wrap {
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

.pc-section {
  padding-top: 72px;

  @media (max-width: 768px) {
    padding-top: 48px;
  }
}

.pc-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  h2 {
    font-size: clamp(28px, 3.2vw, 40px);
  }

  p {
    margin-top: 8px;
    color: var(--pc-muted);
    max-width: 640px;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: none;
    font-weight: 600;
    color: var(--pc-accent);
    white-space: nowrap;

    &:hover {
      color: var(--pc-accent-dark);
    }
  }

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 18px;

    > div {
      align-self: stretch;
    }
  }
}

.pc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 22px;
  border-radius: var(--pc-r);
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  transition:
    background 0.15s,
    color 0.15s,
    box-shadow 0.15s;

  &--accent {
    background: var(--pc-accent);
    color: #fff;

    &:hover {
      background: var(--pc-accent-dark);
    }
  }

  &--dark {
    background: var(--pc-ink);
    color: #fff;

    &:hover {
      background: #3a352e;
    }
  }

  &--line {
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--pc-line-strong);

    &:hover {
      box-shadow: inset 0 0 0 1px var(--pc-ink);
    }
  }

  &--wide {
    width: 100%;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.pc-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  background: var(--pc-surface);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: inset 0 0 0 1px var(--pc-line-strong);
  }

  &.is-on {
    background: var(--pc-ink);
    color: #fff;
  }
}

.pc-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;

  input,
  select,
  textarea {
    width: 100%;
    min-height: 48px;
    padding: 12px 14px;
    border: 1px solid var(--pc-line-strong);
    border-radius: var(--pc-r);
    background: #fff;
    font-size: 15px;
    font-weight: 400;
    outline: none;
    transition: border-color 0.15s;

    &:focus {
      border-color: var(--pc-ink);
    }
  }

  select {
    appearance: none;
    padding-right: 40px;
    background: #fff
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%231c1a17' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")
      no-repeat right 14px center;
  }

  textarea {
    min-height: 96px;
    resize: vertical;
  }
}

.pc-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 16px;
  background: var(--pc-ink);
  color: #f3eee4;
  font-size: 13px;
  line-height: 1.35;
  text-align: center;

  a {
    flex: none;
    color: var(--pc-honey);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

.pc-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--pc-honey);

  &__row {
    display: flex;
    align-items: center;
    gap: 28px;
    height: 76px;
  }

  &__burger {
    display: none;
    place-items: center;
    width: 44px;
    height: 44px;
    margin-left: -8px;
    border-radius: 12px;
  }

  &__nav {
    display: flex;
    gap: 4px;
    min-width: 0;

    a {
      padding: 8px 12px;
      border-radius: 10px;
      font-weight: 500;
      white-space: nowrap;
      transition: background 0.15s;

      &:hover,
      &.router-link-active {
        background: rgba(255, 255, 255, 0.55);
      }
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
  }

  &__phone {
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    line-height: 1.2;
    white-space: nowrap;

    b {
      font-size: 16px;
      font-variant-numeric: tabular-nums;
    }

    span {
      font-size: 12px;
      color: rgba(28, 26, 23, 0.72);
    }
  }

  @media (max-width: 1400px) {
    &__row {
      gap: 18px;
    }

    &__phone span {
      display: none;
    }
  }

  @media (max-width: 1199px) {
    &__nav {
      display: none;
    }

    &__burger {
      display: grid;
    }
  }

  @media (max-width: 768px) {
    &__row {
      height: 64px;
      gap: 8px;
    }

    &__phone,
    .pc-hbtn--user,
    .pc-hbtn--fav,
    .pc-cartwrap {
      display: none;
    }
  }
}

.pc-mark {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;

  &__sign {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 13px;
    background: var(--pc-ink);
    color: var(--pc-honey);
  }

  &__text {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
  }

  &__name {
    font-family: var(--pc-head);
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;

    b {
      color: var(--pc-accent);
    }
  }

  &__sub {
    margin-top: 3px;
    font-size: 12px;
    white-space: nowrap;
    color: rgba(28, 26, 23, 0.72);
  }

  @media (max-width: 375px) {
    &__sub {
      display: none;
    }
  }
}

.pc-hbtn {
  position: relative;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.55);
  }

  i {
    position: absolute;
    top: 4px;
    right: 3px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--pc-accent);
    color: #fff;
    font-size: 11px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
    text-align: center;
  }
}

.pc-cartwrap {
  position: relative;
  margin-left: 6px;
}

.pc-cartbtn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 150px;
  height: 48px;
  border-radius: var(--pc-r);
  background: var(--pc-ink);
  color: #fff;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover {
    background: #3a352e;
  }

  i {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 11px;
    background: var(--pc-accent);
    color: #fff;
    font-size: 12px;
    font-style: normal;
    line-height: 22px;
    text-align: center;
  }
}

.pc-mini {
  position: absolute;
  top: 100%;
  right: 0;
  width: 380px;
  padding: 16px;
  border-radius: var(--pc-r-card);
  background: #fff;
  box-shadow: 0 18px 48px rgba(28, 26, 23, 0.18);
  margin-top: 0;
  border-top: 10px solid transparent;
  background-clip: padding-box;

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 320px;
    overflow: auto;

    li {
      display: grid;
      grid-template-columns: 48px minmax(0, 1fr) auto 28px;
      align-items: center;
      gap: 10px;
    }

    img {
      width: 48px;
      height: 48px;
      object-fit: contain;
      border-radius: 10px;
      background: #fff;
      border: 1px solid var(--pc-line);
    }

    b {
      display: block;
      font-size: 14px;
      line-height: 1.25;
    }

    small {
      color: var(--pc-muted);
      font-size: 12px;
    }

    em {
      font-style: normal;
      font-weight: 600;
      white-space: nowrap;
    }

    button {
      display: grid;
      place-items: center;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      color: var(--pc-muted);

      &:hover {
        color: var(--pc-accent);
      }
    }
  }

  &__total {
    display: flex;
    justify-content: space-between;
    margin: 14px 0 12px;
    padding-top: 12px;
    border-top: 1px solid var(--pc-line);
    font-size: 17px;
  }
}

.pc-ribbon {
  background: #fff;
  border-bottom: 1px solid var(--pc-line);

  &__row {
    display: flex;
    gap: 6px;
    height: 54px;
    align-items: center;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex: none;
    height: 38px;
    padding: 0 14px 0 10px;
    border-radius: 10px;
    font-weight: 500;
    white-space: nowrap;
    transition: background 0.15s;

    svg {
      color: var(--pc-accent);
    }

    &:hover,
    &.is-on {
      background: var(--pc-surface);
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.pc-footer {
  margin-top: 96px;
  padding: 56px 0 24px;
  background: var(--pc-surface);

  &__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.4fr;
    gap: 40px;

    h3 {
      margin-bottom: 14px;
      font-size: 18px;
    }
  }

  &__about {
    display: flex;
    flex-direction: column;
    gap: 16px;

    p {
      color: var(--pc-muted);
      max-width: 340px;
    }
  }

  &__social {
    display: flex;
    gap: 8px;

    a {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: #fff;
      box-shadow: inset 0 0 0 1px var(--pc-line-strong);
      transition: color 0.15s;

      &:hover {
        color: var(--pc-accent);
      }
    }
  }

  ul.pc-footer__links {
    display: flex;
    flex-direction: column;
    gap: 8px;

    a:hover {
      color: var(--pc-accent);
    }
  }

  &__contacts {
    display: flex;
    flex-direction: column;
    gap: 6px;

    a:hover {
      color: var(--pc-accent);
    }

    span {
      color: var(--pc-muted);
    }
  }

  &__legal {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    margin-top: 48px;
    padding-top: 20px;
    border-top: 1px solid var(--pc-line-strong);
    color: var(--pc-muted);
    font-size: 13px;

    a {
      flex: none;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  @media (max-width: 1199px) {
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 768px) {
    margin-top: 64px;
    padding-bottom: 96px;

    &__legal {
      flex-direction: column;
    }
  }

  @media (max-width: 576px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }
  }
}

.pc-sub {
  margin-top: 14px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }

  &__row {
    display: flex;
    gap: 8px;

    input {
      flex: 1;
      min-width: 0;
      height: 48px;
      padding: 0 14px;
      border: 1px solid var(--pc-line-strong);
      border-radius: var(--pc-r);
      background: #fff;
      outline: none;

      &:focus {
        border-color: var(--pc-ink);
      }
    }
  }

  &__done {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--pc-ok);
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  @media (max-width: 375px) {
    &__row {
      flex-direction: column;
    }
  }
}

.pc-tabbar {
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 45;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1.35fr;
    gap: 4px;
    padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1px solid var(--pc-line);

    a {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      min-width: 0;
      height: 52px;
      border-radius: 12px;
      color: var(--pc-muted);
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;

      &.is-on {
        color: var(--pc-ink);
        background: var(--pc-surface);
      }
    }

    &__cart.is-full {
      color: var(--pc-ink);
      background: var(--pc-honey);
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }

    i {
      position: absolute;
      top: 3px;
      left: calc(50% + 6px);
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      border-radius: 9px;
      background: var(--pc-accent);
      color: #fff;
      font-size: 11px;
      font-style: normal;
      line-height: 18px;
      text-align: center;
    }
  }
}

.pc-drawer {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(28, 26, 23, 0.45);

  &__panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: min(400px, 100%);
    height: 100%;
    padding: 14px 20px 24px;
    overflow-y: auto;
    background: #fff;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: var(--pc-head);
    font-size: 22px;
  }

  &__sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    a {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 14px;
      border-radius: 16px;
      background: var(--pc-surface);
      font-weight: 600;
      line-height: 1.2;

      svg {
        color: var(--pc-accent);
      }
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;

    a {
      padding: 12px 0;
      border-bottom: 1px solid var(--pc-line);
      font-size: 17px;
      font-weight: 500;
    }
  }

  &__contacts {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: auto;

    span {
      color: var(--pc-muted);
      font-size: 14px;
      text-align: center;
    }
  }
}

.pc-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(28, 26, 23, 0.45);

  &--top {
    align-items: start;
    padding-top: 12vh;
  }
}

.pc-search {
  width: min(680px, 100%);
  padding: 12px;
  border-radius: var(--pc-r-card);
  background: #fff;

  &__form {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 12px;
    border-radius: 14px;
    background: var(--pc-surface);

    input {
      flex: 1;
      min-width: 0;
      height: 52px;
      border: 0;
      background: none;
      outline: none;
      font-size: 17px;
    }
  }

  &__list {
    margin-top: 14px;
    max-height: 60vh;
    overflow-y: auto;

    a {
      display: grid;
      grid-template-columns: 52px minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      padding: 8px;
      border-radius: 12px;

      &:hover {
        background: var(--pc-surface);
      }
    }

    img {
      width: 52px;
      height: 52px;
      object-fit: contain;
    }

    b {
      display: block;
    }

    small {
      display: block;
      color: var(--pc-muted);
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    em {
      font-style: normal;
      font-weight: 600;
      white-space: nowrap;
    }
  }

  &__all {
    width: 100%;
    margin-top: 6px;
    padding: 12px;
    border-radius: 12px;
    background: var(--pc-surface);
    font-weight: 600;
  }

  &__empty {
    padding: 16px 8px 8px;
    color: var(--pc-muted);
  }

  &__popular {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 14px 6px 6px;

    span {
      color: var(--pc-muted);
      margin-right: 4px;
    }
  }
}

.pc-modal {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min(440px, 100%);
  padding: 22px;
  border-radius: var(--pc-r-panel);
  background: #fff;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    h2 {
      font-size: 26px;
    }
  }

  &__note {
    color: var(--pc-muted);
    font-size: 14px;
  }

  &__error {
    color: var(--pc-accent);
    font-size: 14px;
  }

  &__links {
    display: flex;
    justify-content: space-between;
    gap: 12px;

    button {
      color: var(--pc-accent);
      font-weight: 500;
    }
  }
}

.pc-toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  z-index: 70;
  max-width: calc(100% - 32px);
  padding: 12px 18px;
  border-radius: 14px;
  background: var(--pc-ink);
  color: #fff;
  font-size: 14px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  left: auto;
  right: 24px;

  @media (max-width: 768px) {
    left: 50%;
    right: auto;
    bottom: 84px;
    transform: translateX(-50%);
  }
}

.pc-fade-enter-active,
.pc-fade-leave-active {
  transition: opacity 0.18s;
}

.pc-fade-enter-from,
.pc-fade-leave-to {
  opacity: 0;
}

// Общие блоки страниц: сетка карточек, панели, отзывы.
.pc-grid {
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

.pc-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 24px;
  color: var(--pc-muted);
  font-size: 14px;

  a:hover {
    color: var(--pc-accent);
  }
}

.pc-title {
  margin-top: 12px;
  font-size: clamp(32px, 4vw, 52px);
}

.pc-review {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border-radius: var(--pc-r-card);
  background: var(--pc-surface);

  &__text {
    font-size: 15px;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 10px;
    margin-top: auto;
    font-size: 13px;
    color: var(--pc-muted);

    b {
      color: var(--pc-ink);
      font-size: 14px;
    }
  }

  &__src {
    padding: 2px 8px;
    border-radius: 6px;
    background: #fff;
    color: var(--pc-ink);
    font-weight: 500;
  }

  &__stars {
    display: flex;
    gap: 2px;
    color: var(--pc-honey);

    path {
      fill: currentColor;
    }
  }
}

.pc-panel {
  padding: 28px;
  border-radius: var(--pc-r-panel);
  background: var(--pc-surface);

  @media (max-width: 576px) {
    padding: 20px;
    border-radius: var(--pc-r-card);
  }
}

.pc-qty {
  display: inline-flex;
  flex: none;
  align-items: center;
  height: 46px;
  border-radius: var(--pc-r);
  white-space: nowrap;

  &--wide {
    width: 100%;
  }

  &--big {
    height: 54px;
  }

  &.is-on {
    justify-content: space-between;
    min-width: 132px;
    padding: 0 4px;
    background: var(--pc-surface);
    box-shadow: inset 0 0 0 1px var(--pc-line-strong);
  }

  &__add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 100%;
    padding: 0 18px;
    border-radius: inherit;
    background: var(--pc-accent);
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    transition: background 0.15s;

    &:hover {
      background: var(--pc-accent-dark);
    }
  }

  &__btn {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #fff;
    color: var(--pc-ink);
    transition: color 0.15s;

    &:hover {
      color: var(--pc-accent);
    }
  }

  &__val {
    min-width: 46px;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-size: 14px;

    b {
      font-size: 16px;
    }
  }
}

.pc-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  min-height: 46px;
  padding: 5px 4px;
  border-radius: 12px;
  background: var(--pc-surface);
  color: var(--pc-ink);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.15;
  white-space: nowrap;
  transition:
    background 0.15s,
    box-shadow 0.15s;

  small {
    color: var(--pc-muted);
    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }

  &:hover {
    box-shadow: inset 0 0 0 1px var(--pc-line-strong);
  }

  &.is-on {
    background: #fff;
    box-shadow: inset 0 0 0 2px var(--pc-ink);

    small {
      color: var(--pc-ink);
    }
  }
}

.pc-opt {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__title {
    font-weight: 600;
  }

  &__seg {
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    gap: 4px;
    padding: 4px;
    border-radius: 14px;
    background: var(--pc-surface);

    button {
      min-height: 42px;
      padding: 0 8px;
      border-radius: 10px;
      font-weight: 500;
      white-space: nowrap;
      transition: background 0.15s;

      &.is-on {
        background: #fff;
        font-weight: 600;
        box-shadow: 0 1px 4px rgba(28, 26, 23, 0.14);
      }
    }
  }

  &__hint {
    color: var(--pc-muted);
    font-size: 14px;
  }

  &__single {
    font-weight: 500;
  }

  &__seg--wrap {
    grid-auto-flow: row;
    grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
  }

  &__weights {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
    gap: 6px;

    &--n4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));

      @media (max-width: 576px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    .pc-chip {
      min-height: 54px;
      font-size: 15px;
    }
  }

  @media (max-width: 375px) {
    &__seg button {
      font-size: 14px;
      padding: 0 4px;
    }
  }
}

.pc-reviews {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
}

.pc-zones {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  &__item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 22px;
    border-radius: var(--pc-r-card);
    box-shadow: inset 0 0 0 1px var(--pc-line);

    svg {
      color: var(--pc-accent);
      margin-bottom: 4px;
    }

    b {
      font-family: var(--pc-head);
      font-size: 20px;
      line-height: 1.15;
    }

    span {
      color: var(--pc-muted);
      font-size: 14px;
    }

    em {
      margin-top: auto;
      padding-top: 8px;
      font-style: normal;
      font-weight: 600;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
}

.pc-origin {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fff;
  font-size: 14px;

  svg {
    margin-top: 1px;
    color: var(--pc-accent);
  }
}
</style>
