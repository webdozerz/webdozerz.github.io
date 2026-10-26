<script lang="ts" setup>
import MrIcon from '~/components/redesign/mnerozy/MrIcon.vue'

const route = useRoute()
const shop = useMnerozyShop()
const ui = useMnerozyUi()

const nav = [
  { to: mrPath('/delivery'), label: 'Доставка и оплата' },
  { to: mrPath('/reviews'), label: 'Отзывы' },
  { to: mrPath('/contacts'), label: 'Контакты' },
]

useSeoMeta({
  title: 'Мне розы — круглосуточная доставка цветов в Томске | Концепт редизайна',
  description:
    'Концепт редизайна службы доставки цветов «Мне розы»: розы Эквадор, Голландия и Кения, букеты, коробки и подарки с доставкой по Томску за час, круглосуточно.',
  ogTitle: 'Мне розы — концепт редизайна',
  ogDescription:
    'Охапка роз поштучно с ценой за розу, поиск с фото и ценой, варианты оформления с доплатой в карточке, доставка по Томску за час круглосуточно.',
  ogImage: 'https://andryushov.me/redesign/mnerozy/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'mr-html', lang: 'ru' },
  bodyAttrs: { class: 'mr-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&display=swap' },
  ],
})

onMounted(() => shop.persist())

watch(
  () => route.fullPath,
  () => {
    ui.closeAll()
    searchFocus.value = false
    cityOpen.value = false
  },
)

// Меню, каталог и вход закрывают страницу — фон не прокручивается.
watch([ui.menuOpen, ui.loginOpen], ([a, b]) => {
  document.documentElement.classList.toggle('mr-locked', Boolean(a || b))
})

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    ui.closeAll()
    searchFocus.value = false
    cityOpen.value = false
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('mr-locked')
})

// Поиск — главный элемент шапки: подсказки с фото и ценой, разделы, частые запросы.
const query = ref('')
const searchFocus = ref(false)
const found = computed(() => {
  const q = query.value.trim()
  if (q.length < 2) return []
  return mrProducts.filter((p) => mrMatch(`${p.title} ${p.short ?? ''}`, q)).slice(0, 6)
})
const foundSections = computed(() => {
  const q = query.value.trim()
  if (q.length < 2) return []
  return mrSections.filter((s) => mrMatch(s.title, q)).slice(0, 3)
})
const popular = ['21 роза', '51 роза', '101 роза', 'пионы', 'тюльпаны', 'в коробке', 'гортензия', 'мишка']
const goSearch = (q = query.value) => {
  query.value = q
  searchFocus.value = false
  navigateTo({ path: mrPath('/catalog'), query: q.trim() ? { q: q.trim() } : {} })
}
const onSearchFocus = () => {
  ui.catalogOpen.value = false
  searchFocus.value = true
}
const onSearchOut = (e: FocusEvent) => {
  const box = e.currentTarget as HTMLElement
  if (!box.contains(e.relatedTarget as Node | null)) searchFocus.value = false
}

const cityOpen = ref(false)
const toggleCatalog = () => {
  const next = !ui.catalogOpen.value
  ui.closeAll()
  ui.catalogOpen.value = next
}
const openMenu = () => {
  ui.closeAll()
  ui.menuOpen.value = true
}
const openChat = () => {
  ui.closeAll()
  ui.chatOpen.value = true
}
const menuGroup = ref<number | null>(0)

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
const openAccount = () => {
  if (shop.user.value) navigateTo(mrPath('/account'))
  else {
    ui.closeAll()
    ui.loginOpen.value = true
  }
}

// Кнопка чата появляется после первого экрана, чтобы не закрывать кнопки конструктора.
const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 320)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const isCart = computed(() => route.path.startsWith(mrPath('/cart')))
const isActive = (to: string) => route.path.startsWith(to.replace(/\/$/, ''))
const sectionsOf = (ids: string[]) => ids.map((id) => mrFindSection(id)!)
const year = new Date().getFullYear()
</script>

<template>
  <div class="mr" :class="{ 'has-strip': shop.count.value > 0 && !isCart }">
    <div class="mr-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="mrContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="mr-header">
      <div class="mr-wrap mr-header__top">
        <button type="button" class="mr-hbtn mr-header__burger" aria-label="Меню" @click="openMenu">
          <MrIcon name="menu" />
        </button>

        <NuxtLink :to="mrPath()" class="mr-logo" aria-label="Мне розы, на главную">
          <img src="/redesign/mnerozy/logo.svg" alt="Мне розы" width="206" height="50" />
        </NuxtLink>

        <div class="mr-city" @focusout="(e: FocusEvent) => !(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node) && (cityOpen = false)">
          <button type="button" class="mr-city__btn" :aria-expanded="cityOpen" @click="cityOpen = !cityOpen">
            <MrIcon name="pin" :size="18" />
            <span>Томск</span>
            <MrIcon name="down" :size="16" />
          </button>
          <div v-if="cityOpen" class="mr-city__list">
            <p>Доставляем по Томску и пригороду. Другие города — на своих сайтах:</p>
            <a v-for="c in mrCities.slice(1)" :key="c.title" :href="c.href" target="_blank" rel="noopener">{{ c.title }}</a>
          </div>
        </div>

        <nav class="mr-nav" aria-label="Разделы сайта">
          <NuxtLink v-for="n in nav" :key="n.to" :to="n.to" :class="{ 'is-active': isActive(n.to) }">{{ n.label }}</NuxtLink>
        </nav>

        <div class="mr-header__call">
          <a :href="mrContacts.phoneHref" class="mr-header__phone">
            <b>{{ mrContacts.phone }}</b>
            <span>круглосуточно</span>
          </a>
          <a :href="mrContacts.whatsapp" target="_blank" rel="noopener" class="mr-msg" aria-label="Написать в WhatsApp">
            <img :src="mrContacts.icons.whatsapp" alt="" width="34" height="34" />
          </a>
          <a :href="mrContacts.telegram" class="mr-msg" aria-label="Написать в Telegram">
            <img :src="mrContacts.icons.telegram" alt="" width="34" height="34" />
          </a>
        </div>

        <div class="mr-header__tools">
          <a :href="mrContacts.phoneHref" class="mr-hbtn mr-header__tel" aria-label="Позвонить">
            <MrIcon name="phone" />
          </a>
          <button type="button" class="mr-hbtn mr-header__acc" :aria-label="shop.user.value ? 'Кабинет' : 'Войти'" @click="openAccount">
            <MrIcon name="user" />
            <span>{{ shop.user.value ? 'Кабинет' : 'Войти' }}</span>
          </button>
          <NuxtLink :to="mrPath('/favorites')" class="mr-hbtn mr-header__fav" aria-label="Избранное">
            <MrIcon name="heart" />
            <span>Избранное</span>
            <i v-if="shop.favs.value.length" class="mr-dot">{{ shop.favs.value.length }}</i>
          </NuxtLink>
          <NuxtLink :to="mrPath('/cart')" class="mr-cartbtn" :class="{ 'is-on': shop.count.value }" aria-label="Корзина">
            <MrIcon name="bag" />
            <span class="mr-cartbtn__sum">{{ shop.count.value ? mrRub(shop.total.value) : 'Корзина' }}</span>
            <i v-if="shop.count.value" class="mr-dot">{{ shop.count.value }}</i>
          </NuxtLink>
        </div>
      </div>

      <div class="mr-wrap mr-header__search">
        <button type="button" class="mr-btn mr-btn--accent mr-catbtn" :aria-expanded="ui.catalogOpen.value" @click="toggleCatalog">
          <MrIcon :name="ui.catalogOpen.value ? 'close' : 'grid'" :size="20" />
          <span>Каталог</span>
        </button>
        <div class="mr-search" :class="{ 'is-open': searchFocus }" @focusout="onSearchOut">
          <form class="mr-search__form" role="search" @submit.prevent="goSearch()">
            <MrIcon name="search" :size="20" />
            <input
              v-model="query"
              type="search"
              placeholder="Розы, пионы, коробки…"
              aria-label="Поиск по каталогу"
              @focus="onSearchFocus"
            />
            <button type="submit" class="mr-search__go">Найти</button>
          </form>
          <div v-if="searchFocus" class="mr-search__drop" tabindex="-1">
            <template v-if="query.trim().length >= 2">
              <div v-if="foundSections.length" class="mr-search__secs">
                <NuxtLink v-for="s in foundSections" :key="s.id" :to="mrPath(`/catalog/${s.id}`)" class="mr-chip">
                  {{ s.title }}
                </NuxtLink>
              </div>
              <NuxtLink v-for="p in found" :key="p.id" :to="mrPath(`/product/${p.id}`)" class="mr-search__item">
                <img :src="p.img" alt="" width="52" height="52" />
                <span>{{ p.title }}</span>
                <b>{{ mrRub(p.price) }}</b>
              </NuxtLink>
              <p v-if="!found.length && !foundSections.length" class="mr-search__empty">
                Ничего не нашли. Позвоните — флорист соберёт букет под вашу задачу.
              </p>
              <button v-else type="button" class="mr-search__all" @click="goSearch()">Все результаты</button>
            </template>
            <template v-else>
              <p class="mr-search__cap">Часто ищут</p>
              <div class="mr-search__secs">
                <button v-for="q in popular" :key="q" type="button" class="mr-chip" @click="goSearch(q)">{{ q }}</button>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="mr-wrap mr-header__pop">
        <span>Часто ищут:</span>
        <button v-for="q in popular" :key="q" type="button" @click="goSearch(q)">{{ q }}</button>
      </div>

      <div v-if="ui.catalogOpen.value" class="mr-mega">
        <div class="mr-wrap mr-mega__in">
          <div v-for="g in mrGroups" :key="g.title" class="mr-mega__group">
            <p class="mr-mega__title">{{ g.title }}</p>
            <NuxtLink v-for="s in sectionsOf(g.ids)" :key="s.id" :to="mrPath(`/catalog/${s.id}`)" class="mr-mega__link">
              <img :src="s.img" alt="" width="44" height="44" loading="lazy" />
              <span>{{ s.title }}</span>
              <small>{{ s.count }}</small>
            </NuxtLink>
          </div>
          <NuxtLink :to="mrPath('/roses')" class="mr-mega__promo">
            <img :src="mrStems.colors[1].img" alt="" width="300" height="300" loading="lazy" />
            <span>
              <b>Охапка роз поштучно</b>
              <small>от 99 ₽ за розу, считаем сразу</small>
            </span>
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="mr-main">
      <NuxtPage />
    </main>

    <footer class="mr-footer">
      <div class="mr-wrap mr-footer__grid">
        <div class="mr-footer__brand">
          <img src="/redesign/mnerozy/logo.svg" alt="Мне розы" width="164" height="40" />
          <p>Круглосуточная служба доставки цветов в Томске с собственной курьерской службой.</p>
          <div class="mr-footer__apps">
            <a v-for="a in mrContacts.apps" :key="a.title" :href="a.href" target="_blank" rel="noopener" :aria-label="a.title">
              <img :src="a.img" :alt="a.title" height="36" />
            </a>
          </div>
        </div>
        <div>
          <p class="mr-footer__title">Каталог</p>
          <NuxtLink v-for="s in mrSections.slice(0, 7)" :key="s.id" :to="mrPath(`/catalog/${s.id}`)">{{ s.title }}</NuxtLink>
          <NuxtLink :to="mrPath('/catalog')">Все разделы</NuxtLink>
        </div>
        <div>
          <p class="mr-footer__title">Клиенту</p>
          <NuxtLink :to="mrPath('/delivery')">Доставка и оплата</NuxtLink>
          <NuxtLink :to="mrPath('/reviews')">Отзывы</NuxtLink>
          <NuxtLink :to="mrPath('/contacts')">О службе и контакты</NuxtLink>
          <NuxtLink :to="mrPath('/account')">Личный кабинет</NuxtLink>
          <NuxtLink :to="mrPath('/favorites')">Избранное</NuxtLink>
        </div>
        <div class="mr-footer__contacts">
          <p class="mr-footer__title">Контакты</p>
          <a :href="mrContacts.phoneHref" class="mr-footer__phone">{{ mrContacts.phone }}</a>
          <p>Принимаем заказы круглосуточно</p>
          <div class="mr-footer__msgs">
            <a :href="mrContacts.whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp"><img :src="mrContacts.icons.whatsapp" alt="" width="34" height="34" /></a>
            <a :href="mrContacts.telegram" aria-label="Telegram"><img :src="mrContacts.icons.telegram" alt="" width="34" height="34" /></a>
            <a :href="mrContacts.vk" target="_blank" rel="noopener" aria-label="ВКонтакте"><img :src="mrContacts.icons.vk" alt="" width="34" height="34" /></a>
            <a :href="mrContacts.channel" target="_blank" rel="noopener" aria-label="Telegram-канал"><img :src="mrContacts.icons.channel" alt="" width="34" height="34" /></a>
          </div>
          <p v-for="s in mrContacts.shops" :key="s.title">
            <b>{{ s.title }}</b> — {{ s.text }}
          </p>
        </div>
      </div>
      <div class="mr-wrap mr-footer__bottom">
        <p>© {{ year }} «Мне розы». Тексты, цены и изображения принадлежат владельцу магазина mnerozy.ru и показаны для концепта.</p>
        <p>Концепт редизайна — andryushov.me</p>
      </div>
    </footer>

    <NuxtLink v-if="shop.count.value && !isCart" :to="mrPath('/cart')" class="mr-strip">
      <span class="mr-strip__count">{{ shop.count.value }}</span>
      <span class="mr-strip__sum">{{ mrRub(shop.total.value) }}</span>
      <span class="mr-strip__go">Оформить <MrIcon name="arrow" :size="18" /></span>
    </NuxtLink>

    <div class="mr-chat" :class="{ 'is-open': ui.chatOpen.value, 'is-shown': scrolled || ui.chatOpen.value }">
      <div v-if="ui.chatOpen.value" class="mr-chat__panel" role="dialog" aria-label="Чат">
        <div class="mr-chat__head">
          <b>Ответим на вопрос круглосуточно</b>
          <button type="button" class="mr-hbtn" aria-label="Закрыть чат" @click="ui.chatOpen.value = false"><MrIcon name="close" :size="20" /></button>
        </div>
        <p>Флорист подскажет с букетом, проверит адрес и время доставки.</p>
        <a :href="mrContacts.whatsapp" target="_blank" rel="noopener" class="mr-btn mr-btn--line"><img :src="mrContacts.icons.whatsapp" alt="" width="22" height="22" /> WhatsApp</a>
        <a :href="mrContacts.telegram" class="mr-btn mr-btn--line"><img :src="mrContacts.icons.telegram" alt="" width="22" height="22" /> Telegram</a>
        <a :href="mrContacts.phoneHref" class="mr-btn mr-btn--line"><MrIcon name="phone" :size="20" /> {{ mrContacts.phone }}</a>
        <small>Демо. На сайте здесь остаётся чат JivoSite.</small>
      </div>
      <button type="button" class="mr-chat__btn" :aria-label="ui.chatOpen.value ? 'Закрыть чат' : 'Открыть чат'" @click="ui.chatOpen.value = !ui.chatOpen.value">
        <MrIcon :name="ui.chatOpen.value ? 'close' : 'chat'" :size="24" />
      </button>
    </div>

    <Transition name="mr-fade">
      <div v-if="ui.toast.value" class="mr-toast" role="status">{{ ui.toast.value }}</div>
    </Transition>

    <div v-if="ui.menuOpen.value" class="mr-overlay" @click.self="ui.menuOpen.value = false">
      <aside class="mr-drawer" aria-label="Меню">
        <div class="mr-drawer__head">
          <b>Меню</b>
          <button type="button" class="mr-hbtn" aria-label="Закрыть меню" @click="ui.menuOpen.value = false"><MrIcon name="close" /></button>
        </div>
        <NuxtLink :to="mrPath('/roses')" class="mr-drawer__promo">
          <img :src="mrStems.colors[1].img" alt="" width="56" height="56" />
          <span><b>Охапка роз поштучно</b><small>от 99 ₽ за розу</small></span>
        </NuxtLink>
        <div v-for="(g, i) in mrGroups" :key="g.title" class="mr-drawer__group">
          <button type="button" :aria-expanded="menuGroup === i" @click="menuGroup = menuGroup === i ? null : i">
            {{ g.title }} <MrIcon :name="menuGroup === i ? 'minus' : 'plus'" :size="18" />
          </button>
          <div v-if="menuGroup === i" class="mr-drawer__links">
            <NuxtLink v-for="s in sectionsOf(g.ids)" :key="s.id" :to="mrPath(`/catalog/${s.id}`)">
              <img :src="s.img" alt="" width="36" height="36" loading="lazy" />
              <span>{{ s.title }}</span>
            </NuxtLink>
          </div>
        </div>
        <nav class="mr-drawer__nav">
          <NuxtLink v-for="n in nav" :key="n.to" :to="n.to">{{ n.label }}</NuxtLink>
          <NuxtLink :to="mrPath('/favorites')">Избранное</NuxtLink>
          <button type="button" @click="openAccount">{{ shop.user.value ? 'Личный кабинет' : 'Войти' }}</button>
          <button type="button" @click="openChat">Чат с флористом</button>
        </nav>
        <div class="mr-drawer__contacts">
          <a :href="mrContacts.phoneHref" class="mr-drawer__phone">{{ mrContacts.phone }}</a>
          <p>Круглосуточно · Томск</p>
          <div class="mr-footer__msgs">
            <a :href="mrContacts.whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp"><img :src="mrContacts.icons.whatsapp" alt="" width="34" height="34" /></a>
            <a :href="mrContacts.telegram" aria-label="Telegram"><img :src="mrContacts.icons.telegram" alt="" width="34" height="34" /></a>
            <a :href="mrContacts.vk" target="_blank" rel="noopener" aria-label="ВКонтакте"><img :src="mrContacts.icons.vk" alt="" width="34" height="34" /></a>
          </div>
          <p class="mr-drawer__cities">
            Другие города:
            <a v-for="c in mrCities.slice(1)" :key="c.title" :href="c.href" target="_blank" rel="noopener">{{ c.title }}</a>
          </p>
        </div>
      </aside>
    </div>

    <div v-if="ui.loginOpen.value" class="mr-overlay mr-overlay--center" @click.self="ui.loginOpen.value = false">
      <form class="mr-modal" @submit.prevent="submitLogin">
        <div class="mr-modal__head">
          <b>{{ login.mode === 'up' ? 'Регистрация' : login.mode === 'forgot' ? 'Забыли пароль?' : 'Вход' }}</b>
          <button type="button" class="mr-hbtn" aria-label="Закрыть" @click="ui.loginOpen.value = false"><MrIcon name="close" /></button>
        </div>
        <div v-if="login.mode !== 'forgot'" class="mr-seg mr-modal__tabs">
          <button type="button" :class="{ 'is-on': login.mode === 'in' }" @click="login.mode = 'in'">Вход</button>
          <button type="button" :class="{ 'is-on': login.mode === 'up' }" @click="login.mode = 'up'">Регистрация</button>
        </div>
        <label v-if="login.mode === 'up'" class="mr-field">
          <span>Имя</span>
          <input v-model="login.name" autocomplete="name" />
        </label>
        <label class="mr-field">
          <span>E-mail</span>
          <input v-model="login.email" type="email" autocomplete="email" @input="login.error = ''" />
        </label>
        <label v-if="login.mode !== 'forgot'" class="mr-field">
          <span>Пароль</span>
          <input v-model="login.password" type="password" autocomplete="current-password" @input="login.error = ''" />
        </label>
        <p v-if="login.error" class="mr-modal__error">{{ login.error }}</p>
        <button type="submit" class="mr-btn mr-btn--accent">
          {{ login.mode === 'up' ? 'Зарегистрироваться' : login.mode === 'forgot' ? 'Прислать ссылку' : 'Войти' }}
        </button>
        <button v-if="login.mode === 'in'" type="button" class="mr-modal__link" @click="login.mode = 'forgot'">Забыли пароль?</button>
        <button v-if="login.mode === 'forgot'" type="button" class="mr-modal__link" @click="login.mode = 'in'">Вернуться ко входу</button>
        <p class="mr-modal__note">Демо: данные хранятся только в этом браузере.</p>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.mr-html.mr-locked {
  overflow: hidden;
}

.mr-body {
  margin: 0;
  background: #fff;
}

.mr {
  --mr-accent: #d81b45;
  --mr-accent-dark: #b3123a;
  --mr-accent-soft: #fde8ee;
  --mr-ink: #202124;
  --mr-muted: #6b6e75;
  --mr-surface: #f4f4f6;
  --mr-line: #e7e7eb;
  --mr-line-strong: #d6d6dc;
  --mr-green: #1e7d4a;
  --mr-r: 10px;
  --mr-r-card: 16px;
  --mr-r-panel: 20px;
  --mr-font: 'Montserrat', system-ui, sans-serif;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: var(--mr-ink);
  font-family: var(--mr-font);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

:where(.mr) :is(h1, h2, h3, h4, p, ul, ol, figure, blockquote) {
  margin: 0;
  padding: 0;
}

:where(.mr) :is(ul, ol) {
  list-style: none;
}

:where(.mr) a {
  color: inherit;
  text-decoration: none;
}

:where(.mr) img {
  display: block;
  max-width: 100%;
}

:where(.mr) button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

:where(.mr) :is(input, textarea, select) {
  font: inherit;
  color: inherit;
}

:where(.mr) :is(h1, h2, h3) {
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.mr-wrap {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
}

.mr-main {
  flex: 1;
}

.mr-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px 14px;
  flex-wrap: wrap;
  padding: 7px 16px;
  background: var(--mr-ink);
  color: #fff;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;

  a {
    color: #fff;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

// ---------- Кнопки и элементы, общие для страниц ----------
.mr-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 22px;
  border-radius: var(--mr-r);
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;

  &--accent {
    background: var(--mr-accent);
    color: #fff;

    &:hover {
      background: var(--mr-accent-dark);
    }
  }

  &--soft {
    background: var(--mr-accent-soft);
    color: var(--mr-accent-dark);

    &:hover {
      background: #fbd6e0;
    }
  }

  &--line,
  &--line:focus,
  &--line:active {
    background: #fff;
    border: 1px solid var(--mr-line-strong);
    color: var(--mr-ink);
  }

  &--line:hover {
    border-color: var(--mr-ink);
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
}

.mr-hbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 40px;
  height: 40px;
  border-radius: var(--mr-r);
  transition: color 0.2s;

  &:hover {
    color: var(--mr-accent);
  }
}

.mr-chip,
.mr-chip:focus {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: var(--mr-r);
  background: var(--mr-surface);
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  transition:
    background 0.2s,
    border-color 0.2s;

  small {
    color: var(--mr-muted);
    font-size: 12px;
    font-weight: 500;
  }
}

.mr-chip:hover {
  border-color: var(--mr-line-strong);
}

.mr-chip.is-on {
  background: var(--mr-accent-soft);
  border-color: var(--mr-accent);
  color: var(--mr-accent-dark);

  small {
    color: var(--mr-accent-dark);
  }
}

.mr-swatch {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--mr-line-strong);
  box-shadow: 0 0 0 0 #fff;
  transition: box-shadow 0.15s;

  &.is-on {
    box-shadow:
      0 0 0 3px #fff,
      0 0 0 5px var(--mr-ink);
  }
}

.mr-seg {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  border-radius: calc(var(--mr-r) + 4px);
  background: var(--mr-surface);

  button {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 40px;
    padding: 6px 14px;
    border-radius: var(--mr-r);
    font-size: 14px;
    font-weight: 600;
    text-align: center;

    small {
      color: var(--mr-muted);
      font-size: 12px;
    }

    &.is-on {
      background: #fff;
      box-shadow: 0 1px 3px rgb(32 33 36 / 0.12);

      small {
        color: var(--mr-accent-dark);
      }
    }
  }
}

.mr-qty {
  display: inline-flex;
  align-items: center;

  &__add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    white-space: nowrap;
    font-weight: 700;
    transition: background 0.2s;
  }

  &__btn {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--mr-r);
    transition: background 0.2s;
  }

  &__val {
    min-width: 52px;
    text-align: center;
    font-size: 14px;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;

    b {
      font-size: 16px;
      font-weight: 800;
    }
  }

  // На фото карточки: круглый «+», после нажатия — белая плашка со счётчиком.
  &--photo {
    .mr-qty__add {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: var(--mr-accent);
      color: #fff;
      box-shadow: 0 4px 14px rgb(216 27 69 / 0.3);

      &:hover {
        background: var(--mr-accent-dark);
      }
    }

    &.is-on {
      padding: 3px;
      border-radius: 14px;
      background: #fff;
      box-shadow: 0 4px 16px rgb(32 33 36 / 0.16);

      .mr-qty__btn:hover {
        background: var(--mr-surface);
      }
    }
  }

  &--big {
    height: 52px;

    .mr-qty__add {
      height: 52px;
      padding: 0 26px;
      border-radius: var(--mr-r);
      background: var(--mr-accent);
      color: #fff;
      font-size: 15px;

      &:hover {
        background: var(--mr-accent-dark);
      }
    }

    &.is-on {
      padding: 6px;
      border-radius: calc(var(--mr-r) + 2px);
      background: var(--mr-surface);

      .mr-qty__btn {
        background: #fff;
      }

      .mr-qty__btn:hover {
        color: var(--mr-accent);
      }
    }
  }
}

.mr-field {
  display: grid;
  gap: 6px;
  min-width: 0;

  > span {
    font-size: 13px;
    font-weight: 600;
  }

  :is(input, textarea, select) {
    width: 100%;
    min-height: 48px;
    padding: 12px 14px;
    border-radius: var(--mr-r);
    border: 1px solid var(--mr-line-strong);
    background: #fff;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: var(--mr-ink);
    }
  }

  textarea {
    resize: vertical;
    min-height: 96px;
  }

  select {
    appearance: none;
    padding-right: 40px;
    background: #fff
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23202124' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E")
      no-repeat right 14px center;
  }
}

.mr-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.45;
  cursor: pointer;

  input {
    flex: none;
    width: 20px;
    height: 20px;
    margin: 1px 0 0;
    accent-color: var(--mr-accent);
  }

  small {
    display: block;
    color: var(--mr-muted);
    font-size: 13px;
  }
}

.mr-section {
  padding-top: 56px;
}

.mr-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;

  h2 {
    font-size: 30px;
  }

  p {
    color: var(--mr-muted);
    margin-top: 6px;
  }

  > a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--mr-accent);
    font-weight: 700;
    white-space: nowrap;
  }
}

.mr-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 28px 20px;
}

.mr-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  padding-top: 20px;
  color: var(--mr-muted);
  font-size: 13px;

  a:hover {
    color: var(--mr-accent);
  }

  span::before {
    content: '/';
    margin-right: 8px;
    color: var(--mr-line-strong);
  }
}

.mr-dot {
  position: absolute;
  top: 2px;
  left: 24px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: var(--mr-accent);
  color: #fff;
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
}

.mr-fade-enter-active,
.mr-fade-leave-active {
  transition: opacity 0.25s;
}

.mr-fade-enter-from,
.mr-fade-leave-to {
  opacity: 0;
}

// ---------- Шапка ----------
.mr-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: #fff;
  border-bottom: 1px solid var(--mr-line);

  &__top {
    display: flex;
    align-items: center;
    gap: 24px;
    height: 74px;
  }

  &__burger,
  &__tel {
    display: none;
  }

  &__call {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }

  &__phone {
    display: grid;
    margin-right: 6px;
    line-height: 1.25;
    text-align: right;

    b {
      font-size: 16px;
      font-weight: 700;
      white-space: nowrap;
    }

    span {
      color: var(--mr-green);
      font-size: 12px;
      font-weight: 600;
    }

    &:hover b {
      color: var(--mr-accent);
    }
  }

  &__tools {
    display: flex;
    align-items: center;
    gap: 4px;

    .mr-hbtn {
      position: relative;
      padding: 0 8px;
      font-size: 14px;
      font-weight: 600;
    }
  }

  &__search {
    display: flex;
    gap: 12px;
    padding-top: 2px;
    padding-bottom: 12px;
  }

  &__pop {
    display: flex;
    align-items: center;
    gap: 4px 16px;
    padding-bottom: 12px;
    margin-top: -2px;
    color: var(--mr-muted);
    font-size: 13px;
    overflow: hidden;
    white-space: nowrap;

    button {
      color: var(--mr-ink);
      font-weight: 600;

      &:hover {
        color: var(--mr-accent);
      }
    }
  }
}

.mr-logo {
  flex: none;

  img {
    width: 176px;
    height: auto;
  }
}

.mr-city {
  position: relative;

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 40px;
    padding: 0 10px;
    border-radius: var(--mr-r);
    background: var(--mr-surface);
    font-size: 14px;
    font-weight: 600;
  }

  &__list {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: 5;
    display: grid;
    width: 260px;
    padding: 14px;
    border-radius: var(--mr-r-card);
    background: #fff;
    box-shadow: 0 12px 40px rgb(32 33 36 / 0.16);

    p {
      margin-bottom: 8px;
      color: var(--mr-muted);
      font-size: 13px;
    }

    a {
      padding: 7px 0;
      font-weight: 600;

      &:hover {
        color: var(--mr-accent);
      }
    }
  }
}

.mr-nav {
  display: flex;
  gap: 22px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;

  a:hover,
  a.is-active {
    color: var(--mr-accent);
  }
}

.mr-msg img {
  width: 34px;
  height: 34px;
}

.mr-cartbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 152px;
  height: 44px;
  margin-left: 6px;
  padding: 0 14px;
  border-radius: var(--mr-r);
  background: var(--mr-surface);
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  transition: background 0.2s;

  &.is-on {
    background: var(--mr-accent-soft);
    color: var(--mr-accent-dark);
  }

  .mr-dot {
    top: 4px;
    left: 26px;
  }
}

.mr-catbtn {
  flex: none;
  height: 54px;
  padding: 0 24px;
}

.mr-search {
  position: relative;
  flex: 1;
  min-width: 0;

  &__form {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 54px;
    padding: 0 6px 0 16px;
    border-radius: var(--mr-r);
    border: 2px solid var(--mr-accent);
    background: #fff;

    > svg {
      flex: none;
      color: var(--mr-muted);
    }

    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: 0;
      outline: none;
      background: transparent;
      font-size: 16px;

      &::-webkit-search-cancel-button {
        display: none;
      }
    }
  }

  &__go {
    flex: none;
    height: 40px;
    padding: 0 18px;
    border-radius: 8px;
    background: var(--mr-surface);
    font-weight: 700;

    &:hover {
      background: var(--mr-accent-soft);
      color: var(--mr-accent-dark);
    }
  }

  &__drop {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: 5;
    display: grid;
    gap: 2px;
    max-height: min(calc(100dvh - 200px), 560px);
    overflow: auto;
    padding: 12px;
    border-radius: var(--mr-r-card);
    background: #fff;
    box-shadow: 0 16px 48px rgb(32 33 36 / 0.18);
    outline: none;
  }

  &__cap {
    margin-bottom: 6px;
    color: var(--mr-muted);
    font-size: 13px;
    font-weight: 600;
  }

  &__secs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 6px;
  }

  &__item {
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 6px;
    border-radius: var(--mr-r);

    img {
      width: 52px;
      height: 52px;
      border-radius: 8px;
      object-fit: cover;
    }

    span {
      font-weight: 600;
      line-height: 1.3;
    }

    b {
      font-weight: 800;
      white-space: nowrap;
    }

    &:hover {
      background: var(--mr-surface);
    }
  }

  &__empty {
    padding: 8px;
    color: var(--mr-muted);
  }

  &__all {
    margin-top: 6px;
    height: 42px;
    border-radius: var(--mr-r);
    background: var(--mr-surface);
    font-weight: 700;
  }
}

.mr-mega {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: calc(100vh - 160px);
  overflow: auto;
  background: #fff;
  border-top: 1px solid var(--mr-line);
  box-shadow: 0 24px 48px rgb(32 33 36 / 0.14);

  &__in {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 0.9fr);
    gap: 24px;
    padding-top: 24px;
    padding-bottom: 28px;
  }

  &__group {
    display: grid;
    align-content: start;
    gap: 2px;
  }

  &__title {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 700;
    color: var(--mr-muted);
  }

  &__link {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 5px;
    border-radius: var(--mr-r);

    img {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
    }

    span {
      font-weight: 600;
      line-height: 1.3;
    }

    small {
      color: var(--mr-muted);
      font-size: 12px;
    }

    &:hover {
      background: var(--mr-surface);

      span {
        color: var(--mr-accent);
      }
    }
  }

  &__promo {
    position: relative;
    align-self: start;
    border-radius: var(--mr-r-card);
    overflow: hidden;
    aspect-ratio: 1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    span {
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: 12px;
      display: grid;
      padding: 12px 14px;
      border-radius: var(--mr-r);
      background: #fff;

      small {
        color: var(--mr-muted);
        font-size: 13px;
      }
    }
  }
}

// ---------- Подвал ----------
.mr-footer {
  margin-top: 80px;
  background: var(--mr-surface);
  font-size: 14px;

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) repeat(2, minmax(0, 0.8fr)) minmax(0, 1.2fr);
    gap: 32px;
    padding-top: 48px;
    padding-bottom: 40px;

    > div {
      display: grid;
      align-content: start;
      gap: 8px;
    }

    a:hover {
      color: var(--mr-accent);
    }
  }

  &__brand p {
    max-width: 300px;
    color: var(--mr-muted);
  }

  &__apps {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;

    img {
      height: 36px;
      width: auto;
    }
  }

  &__title {
    margin-bottom: 4px;
    font-weight: 800;
    font-size: 15px;
  }

  &__phone {
    font-size: 18px;
    font-weight: 800;
  }

  &__contacts p {
    color: var(--mr-muted);

    b {
      color: var(--mr-ink);
      font-weight: 600;
    }
  }

  &__msgs {
    display: flex;
    gap: 8px;
    margin: 4px 0;

    img {
      width: 34px;
      height: 34px;
    }
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    gap: 8px 24px;
    flex-wrap: wrap;
    padding-top: 18px;
    padding-bottom: 22px;
    border-top: 1px solid var(--mr-line);
    color: var(--mr-muted);
    font-size: 12px;
  }
}

// ---------- Полоса корзины (телефон), чат, подсказка ----------
.mr-strip {
  display: none;
}

.mr-chat {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 45;
  display: grid;
  justify-items: end;
  gap: 10px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px);
  transition:
    opacity 0.2s,
    transform 0.2s,
    visibility 0.2s;

  &.is-shown {
    opacity: 1;
    visibility: visible;
    transform: none;
  }

  &__btn {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--mr-ink);
    color: #fff;
    box-shadow: 0 8px 24px rgb(32 33 36 / 0.25);
  }

  &__panel {
    display: grid;
    gap: 10px;
    width: min(320px, calc(100vw - 32px));
    padding: 16px;
    border-radius: var(--mr-r-card);
    background: #fff;
    box-shadow: 0 16px 48px rgb(32 33 36 / 0.2);

    p {
      color: var(--mr-muted);
      font-size: 14px;
    }

    .mr-btn {
      justify-content: flex-start;
      height: 44px;
    }

    small {
      color: var(--mr-muted);
      font-size: 12px;
    }
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
}

.mr-toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  z-index: 60;
  max-width: min(480px, calc(100vw - 32px));
  padding: 12px 18px;
  border-radius: var(--mr-r);
  background: var(--mr-ink);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  transform: translateX(-50%);
}

.mr-overlay {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: rgb(32 33 36 / 0.45);

  &--center {
    display: grid;
    place-items: center;
    padding: 16px;
  }
}

.mr-drawer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: min(380px, calc(100% - 48px));
  height: 100%;
  overflow: auto;
  padding: 12px 16px 24px;
  background: #fff;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
    font-size: 18px;
  }

  &__promo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    padding: 10px;
    border-radius: var(--mr-r-card);
    background: var(--mr-accent-soft);

    img {
      width: 56px;
      height: 56px;
      border-radius: var(--mr-r);
      object-fit: cover;
    }

    span {
      display: grid;
    }

    small {
      color: var(--mr-accent-dark);
    }
  }

  &__group > button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 14px 4px;
    border-bottom: 1px solid var(--mr-line);
    font-size: 16px;
    font-weight: 700;
  }

  &__links {
    display: grid;
    padding: 6px 0;

    a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 4px;
      font-weight: 600;
    }

    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  &__nav {
    display: grid;
    padding: 8px 0;

    a,
    button {
      padding: 10px 4px;
      font-size: 16px;
      font-weight: 600;
      text-align: left;
    }
  }

  &__contacts {
    display: grid;
    gap: 4px;
    padding: 14px;
    border-radius: var(--mr-r-card);
    background: var(--mr-surface);
    color: var(--mr-muted);
    font-size: 14px;
  }

  &__phone {
    color: var(--mr-ink);
    font-size: 18px;
    font-weight: 800;
  }

  &__cities a {
    margin-left: 6px;
    color: var(--mr-ink);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

.mr-modal {
  display: grid;
  gap: 14px;
  width: min(420px, 100%);
  padding: 22px;
  border-radius: var(--mr-r-panel);
  background: #fff;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
  }

  &__error {
    color: var(--mr-accent);
    font-size: 14px;
  }

  &__link {
    justify-self: center;
    color: var(--mr-accent);
    font-weight: 600;
  }

  &__note {
    color: var(--mr-muted);
    font-size: 12px;
    text-align: center;
  }
}

// ---------- Адаптив ----------
@media (max-width: 1520px) {
  .mr-header__top {
    gap: 18px;
  }

  .mr-nav {
    gap: 16px;
  }
}

@media (max-width: 1400px) {
  .mr-header__tools .mr-hbtn span {
    display: none;
  }

  .mr-dot {
    left: 22px;
  }
}

@media (max-width: 1199px) {
  .mr-wrap {
    padding-left: 24px;
    padding-right: 24px;
  }

  // Телефон с подписью не помещается рядом с меню — остаётся иконкой звонка.
  .mr-header__call {
    display: none;
  }

  .mr-header__tel {
    display: inline-flex;
  }

  .mr-header__tools {
    margin-left: auto;
  }

  .mr-nav {
    gap: 14px;
    font-size: 13px;
  }

  .mr-logo img {
    width: 150px;
  }

  .mr-mega__in {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .mr-mega__promo {
    display: none;
  }

  .mr-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .mr-footer__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 989px) {
  .mr-header {
    &__top {
      gap: 8px;
      height: 60px;
    }

    &__burger,
    &__tel {
      display: inline-flex;
    }

    &__call,
    &__acc,
    &__fav,
    &__pop {
      display: none !important;
    }

    &__tools {
      margin-left: auto;
    }

    &__search {
      gap: 8px;
      padding-bottom: 10px;
    }
  }

  .mr-header__burger {
    margin-left: -8px;
  }

  .mr-city,
  .mr-nav {
    display: none;
  }

  .mr-logo img {
    width: 132px;
  }

  .mr-cartbtn {
    width: auto;
    padding: 0 10px;

    .mr-cartbtn__sum {
      display: none;
    }
  }

  .mr-catbtn {
    width: 48px;
    height: 48px;
    padding: 0;

    span {
      display: none;
    }
  }

  .mr-search__form {
    height: 48px;
  }

  .mr-search__go {
    display: none;
  }

  .mr-mega {
    display: none;
  }

  .mr-section {
    padding-top: 44px;
  }

  .mr-head h2 {
    font-size: 25px;
  }

  // Полоса корзины снизу (M5) появляется с первым товаром.
  .mr-strip {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: 12px;
    z-index: 44;
    display: flex;
    align-items: center;
    gap: 12px;
    height: 56px;
    padding: 0 8px 0 10px;
    border-radius: 14px;
    background: var(--mr-accent);
    color: #fff;
    box-shadow: 0 10px 28px rgb(216 27 69 / 0.35);
    font-weight: 700;
    font-variant-numeric: tabular-nums;

    &__count {
      display: grid;
      place-items: center;
      min-width: 32px;
      height: 32px;
      padding: 0 6px;
      border-radius: 9px;
      background: rgb(255 255 255 / 0.22);
    }

    &__sum {
      font-size: 17px;
      white-space: nowrap;
    }

    &__go {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-left: auto;
      height: 40px;
      padding: 0 14px;
      border-radius: var(--mr-r);
      background: #fff;
      color: var(--mr-accent-dark);
      white-space: nowrap;
    }
  }

  .mr.has-strip {
    .mr-chat {
      bottom: 80px;
    }

    .mr-footer {
      padding-bottom: 72px;
    }

    .mr-toast {
      bottom: 84px;
    }
  }

  // На телефоне плавающая кнопка закрывала конструктор — чат открывается из меню.
  .mr-chat:not(.is-open) {
    display: none;
  }
}

@media (max-width: 768px) {
  .mr-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 14px;
  }

  .mr-mega__in {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 576px) {
  .mr-wrap {
    padding-left: 16px;
    padding-right: 16px;
  }

  .mr-banner {
    font-size: 12px;
  }

  .mr-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 12px;
  }

  .mr-head {
    margin-bottom: 18px;

    h2 {
      font-size: 22px;
    }
  }

  .mr-footer {
    margin-top: 56px;

    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
  }

  .mr-btn {
    padding: 0 18px;
  }

  .mr-chat {
    right: 14px;
  }
}

@media (max-width: 375px) {
  .mr-logo img {
    width: 116px;
  }

  .mr-header__top {
    gap: 4px;
  }

  .mr-strip__go {
    padding: 0 10px;
  }
}
</style>
