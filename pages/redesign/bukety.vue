<script lang="ts" setup>
import BkIcon from '~/components/redesign/bukety/BkIcon.vue'

const route = useRoute()
const shop = useBuketyShop()
const ui = useBuketyUi()

const nav = [
  { to: bkPath('/catalog'), label: 'Каталог' },
  { to: bkPath('/delivery'), label: 'Доставка и оплата' },
  { to: bkPath('/reviews'), label: 'Отзывы' },
  { to: bkPath('/contacts'), label: 'Контакты' },
]

useSeoMeta({
  title: 'Любимые Букеты — доставка цветов в Томске круглосуточно | Концепт редизайна',
  description:
    'Концепт редизайна магазина «Любимые Букеты»: розы, сборные букеты, цветы поштучно и подарки с доставкой по Томску и Северску за час, круглосуточно.',
  ogTitle: 'Любимые Букеты — концепт редизайна',
  ogDescription:
    'Букеты по поводу, получателю и бюджету, состав и варианты с ценой в карточке, открытка и фото вручения в оформлении, доставка по Томску за час круглосуточно.',
  ogImage: 'https://andryushov.me/redesign/bukety/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'bk-html', lang: 'ru' },
  bodyAttrs: { class: 'bk-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Ysabeau+Office:wght@400;500;600;700;800&display=swap',
    },
  ],
})

onMounted(() => shop.persist())

watch(
  () => route.fullPath,
  () => {
    ui.closeAll()
    searchFocus.value = false
  },
)

// Меню, каталог и вход закрывают страницу — фон не прокручивается.
watch([ui.menuOpen, ui.loginOpen], ([a, b]) => {
  document.documentElement.classList.toggle('bk-locked', Boolean(a || b))
})

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    ui.closeAll()
    searchFocus.value = false
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('bk-locked')
})

// Поиск с подсказками по названию и составу — как автодополнение оригинала, но с фото и ценой.
const query = ref('')
const searchFocus = ref(false)
const found = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (q.length < 2) return []
  return bkProducts.filter((p) => `${p.title} ${p.comp}`.toLowerCase().includes(q))
})
const popular = ['101 роза', 'пионовидные', 'тюльпаны', 'в коробке', 'медведь', 'гортензия']
const goSearch = () => {
  searchFocus.value = false
  navigateTo({ path: bkPath('/catalog'), query: query.value.trim() ? { q: query.value.trim() } : {} })
}
const onSearchOut = (e: FocusEvent) => {
  const box = e.currentTarget as HTMLElement
  if (!box.contains(e.relatedTarget as Node | null)) searchFocus.value = false
}

// Каталог в шапке: группа слева, разделы справа.
const megaGroup = ref<BkGroupId>('roses')
const megaSections = computed(() => bkGroups.find((g) => g.id === megaGroup.value)!)
const toggleCatalog = () => {
  const next = !ui.catalogOpen.value
  ui.closeAll()
  ui.catalogOpen.value = next
}
const openMenu = () => {
  ui.closeAll()
  ui.menuOpen.value = true
}
const menuGroup = ref<BkGroupId | null>(null)

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

const isCart = computed(() => route.path.startsWith(bkPath('/cart')))
const isActive = (to: string) => route.path.startsWith(to.replace(/\/$/, ''))
const year = new Date().getFullYear()
</script>

<template>
  <div class="bk">
    <div class="bk-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="bkContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="bk-header" :class="{ 'is-mega': ui.catalogOpen.value }">
      <div class="bk-wrap bk-header__row">
        <button type="button" class="bk-hbtn bk-header__burger" aria-label="Меню" @click="openMenu">
          <BkIcon name="menu" />
        </button>

        <NuxtLink :to="bkPath()" class="bk-mark" aria-label="Любимые Букеты, на главную">
          <span class="bk-mark__sign"><BkIcon name="rose" :size="26" /></span>
          <span class="bk-mark__text">
            <span class="bk-mark__love">любимые</span>
            <span class="bk-mark__name">букеты</span>
          </span>
        </NuxtLink>

        <button
          type="button"
          class="bk-catbtn"
          :class="{ 'is-on': ui.catalogOpen.value }"
          :aria-expanded="ui.catalogOpen.value"
          @click="toggleCatalog"
        >
          <BkIcon :name="ui.catalogOpen.value ? 'close' : 'grid'" :size="20" />
          <span>Каталог</span>
        </button>

        <div class="bk-search" :class="{ 'is-open': searchFocus }" @focusin="searchFocus = true" @focusout="onSearchOut">
          <form class="bk-search__form" role="search" @submit.prevent="goSearch">
            <BkIcon name="search" :size="20" />
            <input v-model="query" type="search" placeholder="Розы, тюльпаны, букет в коробке…" aria-label="Поиск по магазину" />
            <button v-if="query" type="button" class="bk-search__clear" aria-label="Очистить" @click="query = ''">
              <BkIcon name="close" :size="18" />
            </button>
          </form>
          <div v-if="searchFocus" class="bk-search__drop">
            <ul v-if="found.length" class="bk-search__list">
              <li v-for="p in found.slice(0, 6)" :key="p.id">
                <NuxtLink :to="bkPath(`/product/${p.id}`)">
                  <img :src="p.img" alt="" width="44" height="55" loading="lazy" />
                  <span>
                    <b>{{ p.title }}</b>
                    <small>{{ p.comp }}</small>
                  </span>
                  <em>{{ bkHasChoice(p) ? 'от ' : '' }}{{ bkRub(p.price) }}</em>
                </NuxtLink>
              </li>
              <li>
                <button type="button" class="bk-search__all" @click="goSearch">
                  Все результаты · {{ found.length }}
                  <BkIcon name="arrow" :size="18" />
                </button>
              </li>
            </ul>
            <p v-else-if="query.trim().length >= 2" class="bk-search__empty">
              Ничего не нашли. Флорист соберёт букет под ваш запрос: <a :href="bkContacts.phoneHref">{{ bkContacts.phone }}</a>
            </p>
            <div v-else class="bk-search__popular">
              <span>Часто ищут</span>
              <div>
                <button v-for="w in popular" :key="w" type="button" class="bk-tag" @click="query = w">{{ w }}</button>
              </div>
            </div>
          </div>
        </div>

        <a :href="bkContacts.phoneHref" class="bk-header__phone">
          <b>{{ bkContacts.phone }}</b>
          <span>круглосуточно, доставка за час</span>
        </a>

        <div class="bk-header__icons">
          <NuxtLink v-if="shop.user.value" :to="bkPath('/account')" class="bk-hbtn bk-hbtn--user" aria-label="Кабинет">
            <BkIcon name="user" />
          </NuxtLink>
          <button v-else type="button" class="bk-hbtn bk-hbtn--user" aria-label="Войти" @click="ui.loginOpen.value = true">
            <BkIcon name="user" />
          </button>
          <NuxtLink :to="bkPath('/account')" class="bk-hbtn bk-hbtn--fav" aria-label="Избранное">
            <BkIcon name="heart" />
            <i v-if="shop.favs.value.length">{{ shop.favs.value.length }}</i>
          </NuxtLink>
          <NuxtLink :to="bkPath('/cart')" class="bk-cartbtn" :class="{ 'is-full': shop.count.value, 'is-on': isCart }" aria-label="Корзина">
            <BkIcon name="bag" />
            <span class="bk-cartbtn__sum">{{ shop.count.value ? bkRub(shop.total.value) : 'Корзина' }}</span>
            <i v-if="shop.count.value">{{ shop.count.value }}</i>
          </NuxtLink>
        </div>
      </div>

      <div class="bk-ribbon">
        <div class="bk-wrap bk-ribbon__row">
          <nav class="bk-ribbon__secs" aria-label="Популярные разделы">
            <NuxtLink
              v-for="s in bkRibbon"
              :key="s.id"
              :to="{ path: bkPath('/catalog'), query: { s: s.id } }"
              class="bk-ribbon__item"
              :class="{ 'is-on': route.query.s === s.id }"
            >
              <BkIcon :name="s.icon" :size="20" />
              {{ s.title }}
            </NuxtLink>
          </nav>
          <nav class="bk-ribbon__nav" aria-label="Информация">
            <NuxtLink v-for="item in nav.slice(1)" :key="item.to" :to="item.to" :class="{ 'is-on': isActive(item.to) }">{{ item.label }}</NuxtLink>
          </nav>
        </div>
      </div>

      <div v-if="ui.catalogOpen.value" class="bk-mega">
        <div class="bk-wrap bk-mega__grid">
          <ul class="bk-mega__groups">
            <li v-for="g in bkGroups" :key="g.id">
              <button
                type="button"
                :class="{ 'is-on': megaGroup === g.id }"
                @mouseenter="megaGroup = g.id"
                @focus="megaGroup = g.id"
                @click="megaGroup = g.id"
              >
                <BkIcon :name="g.icon" />
                <span>
                  <b>{{ g.title }}</b>
                  <small>{{ g.text }}</small>
                </span>
              </button>
            </li>
          </ul>
          <div class="bk-mega__secs">
            <NuxtLink :to="{ path: bkPath('/catalog'), query: { g: megaSections.id } }" class="bk-mega__all">
              Все {{ megaSections.title.toLowerCase() }}
              <BkIcon name="arrow" :size="18" />
            </NuxtLink>
            <ul>
              <li v-for="s in megaSections.sections" :key="s.id">
                <NuxtLink :to="{ path: bkPath('/catalog'), query: { s: s.id } }">
                  {{ s.title }} <small>{{ s.count }}</small>
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div class="bk-mega__side">
            <div>
              <h3>Кому</h3>
              <div class="bk-mega__tags">
                <NuxtLink v-for="o in bkWhom" :key="o.id" :to="{ path: bkPath('/catalog'), query: { o: o.id } }" class="bk-tag">{{ o.title }}</NuxtLink>
              </div>
            </div>
            <div>
              <h3>Повод</h3>
              <div class="bk-mega__tags">
                <NuxtLink v-for="o in bkOccasions" :key="o.id" :to="{ path: bkPath('/catalog'), query: { o: o.id } }" class="bk-tag">{{ o.title }}</NuxtLink>
              </div>
            </div>
            <div>
              <h3>Цена</h3>
              <div class="bk-mega__tags">
                <NuxtLink v-for="b in bkBudgets" :key="b.id" :to="{ path: bkPath('/catalog'), query: { p: b.id } }" class="bk-tag">{{ b.title }}</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div v-if="ui.catalogOpen.value" class="bk-mega-shade" @click="ui.catalogOpen.value = false" />

    <main class="bk-main">
      <NuxtPage />
    </main>

    <footer class="bk-footer">
      <div class="bk-wrap bk-footer__grid">
        <div class="bk-footer__about">
          <NuxtLink :to="bkPath()" class="bk-mark">
            <span class="bk-mark__sign"><BkIcon name="rose" :size="26" /></span>
            <span class="bk-mark__text">
              <span class="bk-mark__love">любимые</span>
              <span class="bk-mark__name">букеты</span>
            </span>
          </NuxtLink>
          <p>Доставляя цветы, доставляем радость. Круглосуточная доставка цветов по Томску, Северску и области — за час.</p>
          <div class="bk-footer__rating">
            <span v-for="r in bkContacts.rating" :key="r.title"><BkIcon name="star" :size="18" /><b>{{ r.value }}</b> {{ r.title }}</span>
          </div>
        </div>
        <div>
          <h3>Каталог</h3>
          <ul class="bk-footer__links">
            <li v-for="g in bkGroups" :key="g.id">
              <NuxtLink :to="{ path: bkPath('/catalog'), query: { g: g.id } }">{{ g.title }}</NuxtLink>
            </li>
            <li v-for="o in bkWhom.slice(0, 3)" :key="o.id">
              <NuxtLink :to="{ path: bkPath('/catalog'), query: { o: o.id } }">Букеты {{ o.title.toLowerCase() }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3>Покупателям</h3>
          <ul class="bk-footer__links">
            <li v-for="item in nav.slice(1)" :key="item.to"><NuxtLink :to="item.to">{{ item.label }}</NuxtLink></li>
            <li><NuxtLink :to="bkPath('/account')">Кабинет и избранное</NuxtLink></li>
            <li><a href="https://bukety.tomsk.ru/soglashenie-klienta" target="_blank" rel="noopener">Соглашение клиента</a></li>
            <li><a href="https://bukety.tomsk.ru/privacy" target="_blank" rel="noopener">Политика конфиденциальности</a></li>
          </ul>
        </div>
        <div class="bk-footer__contacts">
          <h3>Контакты</h3>
          <a :href="bkContacts.phoneHref" class="bk-footer__phone">{{ bkContacts.phone }}</a>
          <a :href="bkContacts.phone2Href">{{ bkContacts.phone2 }}</a>
          <a :href="`mailto:${bkContacts.email}`">{{ bkContacts.email }}</a>
          <span>Работаем {{ bkContacts.hours }}</span>
          <div class="bk-footer__msg">
            <a :href="bkContacts.whatsapp" target="_blank" rel="noopener" class="bk-btn bk-btn--line bk-btn--sm">WhatsApp</a>
            <a :href="bkContacts.telegram" target="_blank" rel="noopener" class="bk-btn bk-btn--line bk-btn--sm">Telegram</a>
            <a :href="bkContacts.vk" target="_blank" rel="noopener" class="bk-btn bk-btn--line bk-btn--sm">ВКонтакте</a>
          </div>
        </div>
      </div>
      <div class="bk-wrap bk-footer__legal">
        <span>© {{ year }} Концепт редизайна сайта bukety.tomsk.ru. Тексты, цены, фотографии и товарные знаки принадлежат владельцам магазина «Любимые Букеты».</span>
        <a :href="bkContacts.original" target="_blank" rel="noopener">Оригинальный сайт</a>
      </div>
    </footer>

    <nav class="bk-tabbar" aria-label="Быстрая навигация">
      <button type="button" :class="{ 'is-on': ui.menuOpen.value }" @click="openMenu">
        <BkIcon name="grid" />
        <span>Каталог</span>
      </button>
      <NuxtLink :to="bkPath('/account')" :class="{ 'is-on': isActive(bkPath('/account')) }">
        <BkIcon name="heart" />
        <span>Избранное</span>
        <i v-if="shop.favs.value.length">{{ shop.favs.value.length }}</i>
      </NuxtLink>
      <NuxtLink :to="bkPath('/cart')" class="bk-tabbar__cart" :class="{ 'is-on': isCart, 'is-full': shop.count.value }">
        <BkIcon name="bag" />
        <span>{{ shop.count.value ? bkRub(shop.total.value) : 'Корзина' }}</span>
        <i v-if="shop.count.value">{{ shop.count.value }}</i>
      </NuxtLink>
    </nav>

    <Transition name="bk-fade">
      <div v-if="ui.menuOpen.value" class="bk-drawer" @click.self="ui.menuOpen.value = false">
        <div class="bk-drawer__panel">
          <div class="bk-drawer__head">
            <b>Меню</b>
            <button type="button" class="bk-hbtn" aria-label="Закрыть" @click="ui.menuOpen.value = false"><BkIcon name="close" /></button>
          </div>
          <div class="bk-drawer__groups">
            <div v-for="g in bkGroups" :key="g.id" class="bk-drawer__group" :class="{ 'is-open': menuGroup === g.id }">
              <button type="button" :aria-expanded="menuGroup === g.id" @click="menuGroup = menuGroup === g.id ? null : g.id">
                <BkIcon :name="g.icon" />
                <span>{{ g.title }}</span>
                <BkIcon name="down" :size="18" class="bk-drawer__chev" />
              </button>
              <ul v-if="menuGroup === g.id">
                <li>
                  <NuxtLink :to="{ path: bkPath('/catalog'), query: { g: g.id } }"><b>Все {{ g.title.toLowerCase() }}</b></NuxtLink>
                </li>
                <li v-for="s in g.sections" :key="s.id">
                  <NuxtLink :to="{ path: bkPath('/catalog'), query: { s: s.id } }">{{ s.title }}</NuxtLink>
                </li>
              </ul>
            </div>
          </div>
          <div class="bk-drawer__tags">
            <h3>Кому</h3>
            <div>
              <NuxtLink v-for="o in bkWhom" :key="o.id" :to="{ path: bkPath('/catalog'), query: { o: o.id } }" class="bk-tag">{{ o.title }}</NuxtLink>
            </div>
            <h3>Повод</h3>
            <div>
              <NuxtLink v-for="o in bkOccasions" :key="o.id" :to="{ path: bkPath('/catalog'), query: { o: o.id } }" class="bk-tag">{{ o.title }}</NuxtLink>
            </div>
            <h3>Цена</h3>
            <div>
              <NuxtLink v-for="b in bkBudgets" :key="b.id" :to="{ path: bkPath('/catalog'), query: { p: b.id } }" class="bk-tag">{{ b.title }}</NuxtLink>
            </div>
          </div>
          <nav class="bk-drawer__nav">
            <NuxtLink v-for="item in nav.slice(1)" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
            <NuxtLink :to="bkPath('/account')">Кабинет и избранное</NuxtLink>
          </nav>
          <div class="bk-drawer__contacts">
            <a :href="bkContacts.phoneHref" class="bk-btn bk-btn--accent bk-btn--wide"><BkIcon name="phone" :size="20" /> {{ bkContacts.phone }}</a>
            <a :href="bkContacts.whatsapp" target="_blank" rel="noopener" class="bk-btn bk-btn--line bk-btn--wide">Написать в WhatsApp</a>
            <span>Круглосуточно · {{ bkContacts.email }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="bk-fade">
      <div v-if="ui.loginOpen.value" class="bk-overlay" @click.self="ui.loginOpen.value = false">
        <form class="bk-modal" @submit.prevent="submitLogin">
          <div class="bk-modal__head">
            <h2>{{ login.mode === 'up' ? 'Регистрация' : login.mode === 'forgot' ? 'Восстановить пароль' : 'Кабинет клиента' }}</h2>
            <button type="button" class="bk-hbtn" aria-label="Закрыть" @click="ui.loginOpen.value = false"><BkIcon name="close" /></button>
          </div>
          <p class="bk-modal__note">В кабинете — история заказов, адреса получателей и избранное. Демо: данные хранятся только в этом браузере.</p>
          <label v-if="login.mode === 'up'" class="bk-field">
            <span>Имя</span>
            <input v-model="login.name" type="text" autocomplete="name" />
          </label>
          <label class="bk-field">
            <span>E-mail</span>
            <input v-model="login.email" type="email" autocomplete="email" required />
          </label>
          <label v-if="login.mode !== 'forgot'" class="bk-field">
            <span>Пароль</span>
            <input v-model="login.password" type="password" autocomplete="current-password" required />
          </label>
          <p v-if="login.error" class="bk-modal__error">{{ login.error }}</p>
          <button type="submit" class="bk-btn bk-btn--accent bk-btn--wide">
            {{ login.mode === 'up' ? 'Зарегистрироваться' : login.mode === 'forgot' ? 'Прислать ссылку' : 'Войти' }}
          </button>
          <div class="bk-modal__links">
            <button v-if="login.mode !== 'up'" type="button" @click="login.mode = 'up'">Регистрация</button>
            <button v-if="login.mode !== 'in'" type="button" @click="login.mode = 'in'">Уже есть кабинет</button>
            <button v-if="login.mode === 'in'" type="button" @click="login.mode = 'forgot'">Забыли пароль?</button>
          </div>
        </form>
      </div>
    </Transition>

    <Transition name="bk-fade">
      <div v-if="ui.toast.value" class="bk-toast" role="status">{{ ui.toast.value }}</div>
    </Transition>
  </div>
</template>

<style lang="scss">
.bk-html.bk-locked {
  overflow: hidden;
}

.bk-body {
  margin: 0;
  background: #fff;
}

.bk {
  --bk-accent: #178046;
  --bk-accent-dark: #11683a;
  --bk-accent-soft: #e6f3ea;
  --bk-rose: #c8314b;
  --bk-rose-soft: #fbe9ec;
  --bk-ink: #22303e;
  --bk-muted: #66717c;
  --bk-surface: #fbf3f4;
  --bk-gray: #f3f4f5;
  --bk-line: #ebe3e5;
  --bk-line-strong: #dcd2d5;
  --bk-r: 14px;
  --bk-r-card: 22px;
  --bk-r-panel: 28px;
  --bk-font: 'Ysabeau Office', system-ui, sans-serif;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: var(--bk-ink);
  font-family: var(--bk-font);
  font-size: 16px;
  line-height: 1.5;
  font-variant-numeric: lining-nums;
  -webkit-font-smoothing: antialiased;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

:where(.bk) :is(h1, h2, h3, h4, p, ul, ol, figure, blockquote) {
  margin: 0;
  padding: 0;
}

:where(.bk) :is(ul, ol) {
  list-style: none;
}

:where(.bk) a {
  color: inherit;
  text-decoration: none;
}

:where(.bk) img {
  display: block;
  max-width: 100%;
}

:where(.bk) button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

:where(.bk) :is(input, textarea, select) {
  font: inherit;
  color: inherit;
}

:where(.bk) :is(h1, h2, h3) {
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.01em;
}

.bk-wrap {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
}

.bk-main {
  flex: 1;
}

.bk-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px 14px;
  flex-wrap: wrap;
  padding: 8px 16px;
  background: var(--bk-ink);
  color: #fff;
  font-size: 13px;
  line-height: 1.35;
  text-align: center;

  a {
    color: #fff;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

/* ---------- Кнопки, поля, метки ---------- */

.bk-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 22px;
  border-radius: var(--bk-r);
  border: 1px solid transparent;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.1;
  white-space: nowrap;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;

  &--accent {
    background: var(--bk-accent);
    color: #fff;

    &:hover {
      background: var(--bk-accent-dark);
    }
  }

  &--soft {
    background: var(--bk-accent-soft);
    color: var(--bk-accent-dark);

    &:hover {
      background: #d6ecdd;
    }
  }

  // :focus и :active — чтобы глобальное `button:focus { border: none }` сайта не снимало рамку.
  &--line,
  &--line:focus,
  &--line:active {
    background: #fff;
    border: 1px solid var(--bk-line-strong);
  }

  &--line:hover {
    border-color: var(--bk-accent);
    color: var(--bk-accent);
  }

  &--wide {
    width: 100%;
  }

  &--big {
    min-height: 56px;
    font-size: 17px;
  }

  &--sm {
    min-height: 38px;
    padding: 0 14px;
    font-size: 14px;
    border-radius: 11px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.bk-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  background: var(--bk-gray);
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: var(--bk-accent-soft);
    color: var(--bk-accent-dark);
  }

  &.is-on {
    background: var(--bk-accent);
    color: #fff;
  }

  small {
    font-size: 13px;
    opacity: 0.7;
    font-weight: 600;
  }
}

.bk-field {
  display: grid;
  gap: 6px;

  > span {
    font-size: 14px;
    font-weight: 700;
  }

  input,
  textarea,
  select {
    width: 100%;
    min-height: 50px;
    padding: 12px 16px;
    border: 1px solid var(--bk-line-strong);
    border-radius: var(--bk-r);
    background: #fff;
    font-size: 16px;
    outline: none;
    transition: border-color 0.15s;

    &:focus {
      border-color: var(--bk-accent);
      box-shadow: 0 0 0 3px rgba(23, 128, 70, 0.12);
    }
  }

  textarea {
    resize: vertical;
    min-height: 96px;
  }

  small {
    color: var(--bk-muted);
    font-size: 13px;
  }
}

.bk-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 15px;
  line-height: 1.4;

  input {
    flex: none;
    width: 20px;
    height: 20px;
    margin: 1px 0 0;
    accent-color: var(--bk-accent);
  }

  small {
    display: block;
    color: var(--bk-muted);
    font-size: 13px;
  }
}

/* Сегменты: варианты товара, кому, бюджет, день и время доставки. */
.bk-seg {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  button,
  button:focus,
  button:active {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    min-height: 44px;
    padding: 6px 14px;
    border: 1px solid var(--bk-line-strong);
    border-radius: 12px;
    background: #fff;
    font-weight: 700;
    font-size: 15px;
    line-height: 1.2;
    white-space: nowrap;
    transition:
      border-color 0.15s,
      background 0.15s;

    small {
      font-size: 13px;
      font-weight: 600;
      color: var(--bk-muted);
    }

    &:hover {
      border-color: var(--bk-accent);
    }

    &.is-on {
      border-color: var(--bk-accent);
      background: var(--bk-accent-soft);
      color: var(--bk-accent-dark);
      box-shadow: inset 0 0 0 1px var(--bk-accent);

      small {
        color: var(--bk-accent-dark);
      }
    }
  }
}

/* Счётчик: «В корзину» превращается в «− 2 шт +». Общий для карточки, товара и корзины. */
.bk-qty {
  display: flex;
  align-items: center;
  height: 44px;
  border-radius: 12px;

  &__add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 100%;
    padding: 0 16px;
    border-radius: 12px;
    background: var(--bk-accent);
    color: #fff;
    font-weight: 700;
    white-space: nowrap;
    transition: background 0.15s;

    &:hover {
      background: var(--bk-accent-dark);
    }
  }

  &.is-on {
    background: var(--bk-accent-soft);
    color: var(--bk-accent-dark);
  }

  &__btn {
    flex: none;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;

    &:hover {
      background: #d6ecdd;
    }
  }

  &__val {
    flex: 1;
    text-align: center;
    font-weight: 600;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;

    b {
      font-weight: 800;
    }
  }

  &--big {
    height: 56px;

    .bk-qty__btn {
      width: 56px;
      height: 56px;
    }

    .bk-qty__add {
      font-size: 17px;
    }
  }
}

/* Заголовок секции со ссылкой справа. */
.bk-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;

  h2 {
    font-size: clamp(26px, 2.6vw, 36px);
  }

  p {
    margin-top: 6px;
    color: var(--bk-muted);
  }

  > a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    color: var(--bk-accent);
    white-space: nowrap;
  }
}

.bk-section {
  padding-top: 64px;
  padding-bottom: 0;

  &--last {
    padding-bottom: 80px;
  }
}

.bk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(232px, 1fr));
  gap: 32px 20px;
}

.bk-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  padding-top: 20px;
  font-size: 14px;
  color: var(--bk-muted);

  a:hover {
    color: var(--bk-accent);
  }

  span::before {
    content: '/';
    margin-right: 8px;
    opacity: 0.5;
  }
}

.bk-panel {
  padding: 28px;
  border-radius: var(--bk-r-panel);
  background: var(--bk-surface);
}

.bk-demo {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--bk-rose-soft);
  color: var(--bk-rose);
  font-size: 12px;
  font-weight: 700;
}

/* Звёзды рейтинга — общие для отзывов и карточки товара. */
.bk-stars {
  display: inline-flex;
  gap: 2px;
  color: #e0a526;

  .is-off {
    color: var(--bk-line-strong);
  }

  svg {
    fill: currentColor;
  }
}

/* ---------- Шапка ---------- */

.bk-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: #fff;
  border-bottom: 1px solid var(--bk-line);

  &__row {
    display: flex;
    align-items: center;
    gap: 16px;
    height: 80px;
  }

  &__burger {
    display: none;
  }

  &__phone {
    display: grid;
    flex: none;
    line-height: 1.25;

    b {
      font-size: 17px;
      font-weight: 800;
      white-space: nowrap;
    }

    span {
      font-size: 13px;
      color: var(--bk-muted);
      white-space: nowrap;
    }

    &:hover b {
      color: var(--bk-accent);
    }
  }

  &__icons {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: none;
  }
}

.bk-hbtn {
  position: relative;
  display: grid;
  place-items: center;
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  transition: background 0.15s;

  &:hover {
    background: var(--bk-gray);
  }

  i {
    position: absolute;
    top: 3px;
    right: 2px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--bk-rose);
    color: #fff;
    font-size: 11px;
    font-style: normal;
    font-weight: 800;
    line-height: 18px;
    text-align: center;
  }
}

.bk-mark {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;

  &__sign {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: var(--bk-accent);
    color: #fff;
  }

  &__text {
    display: grid;
    line-height: 0.95;
  }

  &__love {
    font-size: 15px;
    font-weight: 700;
    color: var(--bk-rose);
  }

  &__name {
    font-size: 27px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--bk-ink);
  }
}

.bk-catbtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: none;
  height: 48px;
  padding: 0 20px;
  border-radius: var(--bk-r);
  background: var(--bk-accent);
  color: #fff !important;
  font-weight: 700;
  transition: background 0.15s;

  &:hover,
  &.is-on {
    background: var(--bk-accent-dark);
  }
}

.bk-search {
  position: relative;
  flex: 1;
  min-width: 0;

  &__form {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    padding: 0 8px 0 16px;
    border-radius: var(--bk-r);
    background: var(--bk-gray);
    border: 1px solid transparent;
    color: var(--bk-muted);
    transition:
      border-color 0.15s,
      background 0.15s;

    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: 0;
      background: none;
      outline: none;
      color: var(--bk-ink);
      font-size: 16px;

      &::-webkit-search-cancel-button {
        display: none;
      }
    }
  }

  &.is-open &__form {
    background: #fff;
    border-color: var(--bk-accent);
  }

  &__clear {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;

    &:hover {
      background: var(--bk-gray);
    }
  }

  &__drop {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: 5;
    padding: 10px;
    border-radius: 18px;
    background: #fff;
    border: 1px solid var(--bk-line);
    box-shadow: 0 18px 40px rgba(34, 48, 62, 0.14);
  }

  &__list a {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 8px;
    border-radius: 12px;

    &:hover {
      background: var(--bk-gray);
    }

    img {
      width: 44px;
      height: 55px;
      object-fit: cover;
      border-radius: 8px;
    }

    span {
      display: grid;
      min-width: 0;
    }

    b,
    small {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    b {
      font-weight: 700;
    }

    small {
      color: var(--bk-muted);
      font-size: 13px;
    }

    em {
      font-style: normal;
      font-weight: 800;
      white-space: nowrap;
    }
  }

  &__all {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    min-height: 44px;
    margin-top: 4px;
    border-radius: 12px;
    background: var(--bk-accent-soft);
    color: var(--bk-accent-dark);
    font-weight: 700;
  }

  &__empty {
    padding: 12px;
    color: var(--bk-muted);

    a {
      color: var(--bk-accent);
      font-weight: 700;
      white-space: nowrap;
    }
  }

  &__popular {
    padding: 8px;

    > span {
      display: block;
      margin-bottom: 10px;
      font-size: 14px;
      color: var(--bk-muted);
    }

    div {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}

.bk-cartbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 152px;
  height: 48px;
  margin-left: 4px;
  padding: 0 16px;
  border-radius: var(--bk-r);
  background: var(--bk-gray);
  font-weight: 700;
  transition: background 0.15s;

  &__sum {
    flex: 1;
    text-align: center;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  &:hover,
  &.is-on {
    background: var(--bk-accent-soft);
    color: var(--bk-accent-dark);
  }

  &.is-full {
    background: var(--bk-accent-soft);
    color: var(--bk-accent-dark);
  }

  i {
    position: absolute;
    top: -6px;
    left: 30px;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: var(--bk-rose);
    color: #fff;
    font-size: 12px;
    font-style: normal;
    font-weight: 800;
    line-height: 20px;
    text-align: center;
  }
}

.bk-ribbon {
  border-top: 1px solid var(--bk-line);

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    height: 52px;
  }

  &__secs {
    display: flex;
    align-items: center;
    gap: 2px;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 38px;
    padding: 0 12px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;
    color: var(--bk-ink);
    transition:
      background 0.15s,
      color 0.15s;

    svg {
      color: var(--bk-accent);
    }

    &:hover,
    &.is-on {
      background: var(--bk-accent-soft);
      color: var(--bk-accent-dark);
    }
  }

  &__nav {
    display: flex;
    gap: 20px;
    flex: none;

    a {
      font-size: 15px;
      font-weight: 600;
      color: var(--bk-muted);
      white-space: nowrap;

      &:hover,
      &.is-on {
        color: var(--bk-accent);
      }
    }
  }
}

.bk-mega {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid var(--bk-line);
  box-shadow: 0 24px 40px rgba(34, 48, 62, 0.12);
  max-height: calc(100vh - 160px);
  overflow-y: auto;

  &__grid {
    display: grid;
    grid-template-columns: 290px minmax(0, 1fr) 320px;
    gap: 32px;
    padding-top: 24px;
    padding-bottom: 32px;
  }

  &__groups button {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 12px 14px;
    border-radius: 14px;
    text-align: left;
    transition: background 0.15s;

    svg {
      flex: none;
      color: var(--bk-accent);
    }

    span {
      display: grid;
      line-height: 1.3;
    }

    b {
      font-size: 17px;
      font-weight: 800;
    }

    small {
      color: var(--bk-muted);
      font-size: 13px;
    }

    &.is-on,
    &:hover {
      background: var(--bk-surface);
    }
  }

  &__secs {
    ul {
      columns: 2;
      column-gap: 24px;
    }

    li {
      break-inside: avoid;
    }

    li a {
      display: flex;
      align-items: baseline;
      gap: 8px;
      padding: 7px 0;
      font-weight: 600;

      small {
        color: var(--bk-muted);
        font-size: 13px;
      }

      &:hover {
        color: var(--bk-accent);
      }
    }
  }

  &__all {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: 800;

    &:hover {
      color: var(--bk-accent);
    }
  }

  &__side {
    display: grid;
    gap: 20px;
    align-content: start;
    padding: 20px;
    border-radius: 20px;
    background: var(--bk-surface);

    h3 {
      margin-bottom: 10px;
      font-size: 15px;
    }

    .bk-tag {
      background: #fff;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
}

.bk-mega-shade {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: rgba(34, 48, 62, 0.28);
}

/* ---------- Подвал ---------- */

.bk-footer {
  margin-top: 80px;
  padding-top: 56px;
  background: var(--bk-surface);

  &__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
    gap: 32px;
  }

  h3 {
    margin-bottom: 14px;
    font-size: 17px;
  }

  &__about {
    p {
      max-width: 340px;
      margin-top: 16px;
      color: var(--bk-muted);
    }
  }

  &__rating {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;

    span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 36px;
      padding: 0 12px;
      border-radius: 10px;
      background: #fff;
      font-size: 14px;
    }

    svg {
      color: #e0a526;
      fill: currentColor;
    }
  }

  ul.bk-footer__links {
    display: grid;
    gap: 8px;

    a:hover {
      color: var(--bk-accent);
    }
  }

  &__contacts {
    display: grid;
    gap: 6px;
    align-content: start;

    > a:hover {
      color: var(--bk-accent);
    }
  }

  &__phone {
    font-size: 22px;
    font-weight: 800;
  }

  &__msg {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }

  &__legal {
    display: flex;
    justify-content: space-between;
    gap: 12px 24px;
    flex-wrap: wrap;
    margin-top: 48px;
    padding-top: 20px;
    padding-bottom: 28px;
    border-top: 1px solid var(--bk-line-strong);
    font-size: 13px;
    color: var(--bk-muted);

    a {
      text-decoration: underline;
      white-space: nowrap;
    }
  }
}

/* ---------- Таббар, меню, окна ---------- */

.bk-tabbar {
  display: none;
}

.bk-drawer {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(34, 48, 62, 0.4);

  &__panel {
    width: min(420px, 100%);
    height: 100%;
    overflow-y: auto;
    padding: 16px 20px 28px;
    background: #fff;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    b {
      font-size: 22px;
      font-weight: 800;
    }
  }

  &__group {
    border-bottom: 1px solid var(--bk-line);

    > button {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: 56px;
      font-size: 18px;
      font-weight: 800;
      text-align: left;

      > svg:first-child {
        color: var(--bk-accent);
      }

      span {
        flex: 1;
      }
    }

    &.is-open .bk-drawer__chev {
      transform: rotate(180deg);
    }

    ul {
      display: grid;
      gap: 2px;
      padding: 0 0 14px 34px;

      a {
        display: block;
        padding: 7px 0;
        font-weight: 600;
      }
    }
  }

  &__tags {
    padding: 8px 0;

    h3 {
      margin: 16px 0 10px;
      font-size: 16px;
    }

    div {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
  }

  &__nav {
    display: grid;
    margin-top: 16px;
    border-top: 1px solid var(--bk-line);

    a {
      padding: 12px 0;
      font-weight: 700;
      border-bottom: 1px solid var(--bk-line);
    }
  }

  &__contacts {
    display: grid;
    gap: 10px;
    margin-top: 20px;

    span {
      color: var(--bk-muted);
      font-size: 14px;
      text-align: center;
    }
  }
}

.bk-overlay {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(34, 48, 62, 0.45);
}

.bk-modal {
  display: grid;
  gap: 16px;
  width: min(440px, 100%);
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  padding: 28px;
  border-radius: var(--bk-r-panel);
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
    color: var(--bk-muted);
    font-size: 14px;
  }

  &__error {
    color: var(--bk-rose);
    font-weight: 700;
  }

  &__links {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px 20px;

    button {
      color: var(--bk-accent);
      font-weight: 700;
    }
  }
}

.bk-toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  z-index: 80;
  transform: translateX(-50%);
  width: max-content;
  max-width: calc(100vw - 32px);
  padding: 14px 20px;
  border-radius: 14px;
  background: var(--bk-ink);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 12px 30px rgba(34, 48, 62, 0.25);
}

.bk-fade-enter-active,
.bk-fade-leave-active {
  transition: opacity 0.18s;
}

.bk-fade-enter-from,
.bk-fade-leave-to {
  opacity: 0;
}

/* ---------- Общие блоки страниц: отзывы, информационные страницы ---------- */

.bk-revgrid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 32px;
  align-items: start;
}

.bk-reviews {
  display: grid;
  gap: 12px;

  li {
    display: grid;
    gap: 8px;
    padding: 20px;
    border-radius: 18px;
    border: 1px solid var(--bk-line);

    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    small {
      color: var(--bk-muted);
      font-size: 13px;
    }
  }
}

.bk-revform {
  display: grid;
  gap: 14px;

  h3 {
    font-size: 22px;
  }

  > .bk-btn {
    justify-self: start;
  }

  &__stars {
    display: flex;
    gap: 2px;

    button {
      color: var(--bk-line-strong);

      &.is-on {
        color: #e0a526;

        svg {
          fill: currentColor;
        }
      }
    }
  }
}

.bk-info {
  > h1 {
    margin-top: 16px;
    font-size: clamp(30px, 3vw, 44px);
  }

  &__lead {
    max-width: 680px;
    margin-top: 10px !important;
    font-size: 18px;
    color: var(--bk-muted);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 32px;
  }

  &__wide {
    grid-column: 1 / -1;
  }

  &__block {
    display: grid;
    gap: 12px;
    align-content: start;
    padding: 28px;
    border-radius: var(--bk-r-panel);
    background: var(--bk-surface);

    h2 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
      font-size: 22px;

      svg {
        flex: none;
        color: var(--bk-accent);
      }
    }
  }

  ul.bk-info__zones {
    display: grid;

    li {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      padding: 14px 0;
      border-top: 1px solid var(--bk-line-strong);
    }

    span {
      display: grid;
      min-width: 0;
    }

    b {
      font-weight: 800;
    }

    small {
      color: var(--bk-muted);
      font-size: 14px;
    }

    em {
      flex: none;
      font-style: normal;
      font-weight: 800;
      white-space: nowrap;
    }
  }

  ul.bk-info__list {
    display: grid;
    gap: 10px;

    li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      line-height: 1.4;
    }

    svg {
      flex: none;
      color: var(--bk-accent);
    }
  }
}

@media (max-width: 989px) {
  .bk-info__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 768px) {
  .bk-info {
    &__lead {
      font-size: 16px;
    }

    &__block {
      padding: 20px 16px;
      border-radius: 22px;

      h2 {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 989px) {
  .bk-revgrid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 768px) {
  .bk-revform > .bk-btn {
    justify-self: stretch;
  }
}

/* ---------- Адаптив ---------- */

@media (max-width: 1400px) {
  .bk-header__phone span {
    display: none;
  }

  // Пункты ленты, которые не влезли, уходят в затухание, а не обрезаются по иконке.
  .bk-ribbon__secs {
    mask-image: linear-gradient(90deg, #000 calc(100% - 40px), transparent);
  }

  .bk-ribbon__item {
    gap: 6px;
    padding: 0 9px;
    font-size: 14px;
  }

  .bk-ribbon__nav {
    gap: 16px;
  }
}

@media (max-width: 1199px) {
  .bk-header__phone {
    display: none;
  }

  .bk-ribbon__nav {
    display: none;
  }

  .bk-mega__grid {
    grid-template-columns: 260px minmax(0, 1fr);
  }

  .bk-mega__side {
    grid-column: 1 / -1;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .bk-footer__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 989px) {
  .bk-header {
    &__row {
      flex-wrap: wrap;
      height: auto;
      gap: 8px 12px;
      padding-top: 10px;
      padding-bottom: 10px;
    }

    &__burger {
      display: grid;
      margin-left: -10px;
    }
  }

  .bk-catbtn {
    display: none;
  }

  .bk-mark {
    margin-right: auto;
  }

  .bk-search {
    order: 5;
    flex: 1 1 100%;
  }

  .bk-ribbon,
  .bk-mega,
  .bk-mega-shade {
    display: none;
  }

  .bk-hbtn--user {
    display: none;
  }

  .bk-cartbtn {
    width: 44px;
    padding: 0;
    justify-content: center;
    background: none;

    &.is-full {
      background: none;
    }

    &__sum {
      display: none;
    }

    i {
      top: 0;
      left: auto;
      right: -4px;
    }
  }

  .bk-tabbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 45;
    display: grid;
    grid-template-columns: 1fr 1fr 1.3fr;
    gap: 6px;
    padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1px solid var(--bk-line);

    > a,
    > button {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      min-width: 0;
      height: 52px;
      border-radius: 14px;
      font-size: 12px;
      font-weight: 700;
      color: var(--bk-muted);

      span {
        white-space: nowrap;
      }

      &.is-on {
        color: var(--bk-accent);
      }
    }

    i {
      position: absolute;
      top: 3px;
      left: calc(50% + 6px);
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      border-radius: 9px;
      background: var(--bk-rose);
      color: #fff;
      font-size: 11px;
      font-style: normal;
      font-weight: 800;
      line-height: 18px;
      text-align: center;
    }

    &__cart.is-full {
      background: var(--bk-accent);
      color: #fff !important;
      font-size: 14px !important;
      font-variant-numeric: tabular-nums;

      i {
        background: #fff;
        color: var(--bk-accent);
      }
    }
  }

  .bk-footer {
    margin-top: 56px;
    padding-bottom: 76px;
  }

  .bk-section--last {
    padding-bottom: 0;
  }

  .bk-toast {
    bottom: 92px;
  }
}

@media (max-width: 768px) {
  .bk-wrap {
    padding-left: 16px;
    padding-right: 16px;
  }

  .bk-section {
    padding-top: 48px;
  }

  .bk-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 12px;
  }

  .bk-footer__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .bk-panel {
    padding: 20px;
    border-radius: 22px;
  }

  .bk-modal {
    padding: 22px;
  }
}

@media (max-width: 375px) {
  .bk-mark__name {
    font-size: 24px;
  }

  .bk-mark__sign {
    width: 42px;
    height: 42px;
  }

  .bk-grid {
    gap: 20px 10px;
  }
}
</style>
