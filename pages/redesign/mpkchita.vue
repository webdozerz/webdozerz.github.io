<script lang="ts" setup>
import MkIcon from '~/components/redesign/mpkchita/MkIcon.vue'
import MkPhone from '~/components/redesign/mpkchita/MkPhone.vue'

const route = useRoute()
const router = useRouter()
const ui = useMpkchitaUi()
const navQuiet = ref(false)
const query = ref('')
const searchFocus = ref(false)

useSeoMeta({
  title: 'Маккавеевский пищекомбинат — колбасы, деликатесы, полуфабрикаты и рыба | Концепт редизайна',
  description:
    'Концепт редизайна сайта Маккавеевского пищекомбината (Чита): колбасы, деликатесы, полуфабрикаты и рыба собственного производства с составом и сроком годности, 39 магазинов «Маккавеевский» с режимом работы по времени Читы, акции и новинки.',
  ogTitle: 'Маккавеевский пищекомбинат — концепт редизайна',
  ogDescription: 'Делиться лучшим! Продукция МПК с 1997 года и магазины «Маккавеевский», которые открыты прямо сейчас.',
  ogImage: 'https://andryushov.me/redesign/mpkchita/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'mk-html', lang: 'ru' },
  bodyAttrs: { class: 'mk-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Arsenal:wght@400;700&family=Open+Sans:wght@400;500;600;700&display=swap',
    },
  ],
})

const topLinks = [
  { to: '/news', title: 'Акции и новинки' },
  { to: '/about', title: 'О компании' },
  { to: '/about#awards', title: 'Награды' },
  { to: '/faq', title: 'Вопрос-ответ' },
  { to: '/contacts', title: 'Контакты' },
]
const is = (p: string) => route.path.startsWith(mkPath(p))
const subsOf = (top: string) => mkSubs.filter((s) => s.top === top)
const openCount = computed(() => mkStores.filter((s) => mkStatus(s, ui.now.value).open).length)

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (q.length < 2) return []
  return mkProducts.filter((p) => (p.name + ' ' + (mkSub(p.sub)?.title ?? '') + ' ' + p.comp).toLowerCase().includes(q))
})
const goSearch = () => {
  const q = query.value.trim()
  if (!q) return
  searchFocus.value = false
  ui.search.value = false
  router.push({ path: mkPath('/catalog'), query: { q } })
}
const pickHint = (q: string) => {
  query.value = q
}
const onBlurSearch = () => setTimeout(() => (searchFocus.value = false), 150)

// Обратный звонок — как у оригинала: имя и телефон
const cb = reactive({ name: '', phone: '', sent: false, error: '' })
const sendCallback = () => {
  if (cb.phone.replace(/\D/g, '').length < 11) {
    cb.error = 'Введите номер полностью'
    return
  }
  cb.error = ''
  cb.sent = true
}
const closeCallback = () => {
  ui.callback.value = false
  setTimeout(() => Object.assign(cb, { name: '', phone: '', sent: false, error: '' }), 200)
}

// Консультант онлайн — у оригинала чат Cleversite; здесь демо-окно
const chatText = ref('')
const chatLog = ref<{ me: boolean; text: string }[]>([
  { me: false, text: 'Здравствуйте! Подскажем, где купить продукцию МПК, расскажем о составе и акциях.' },
])
const sendChat = () => {
  const t = chatText.value.trim()
  if (!t) return
  chatLog.value.push({ me: true, text: t })
  chatText.value = ''
  setTimeout(
    () =>
      chatLog.value.push({
        me: false,
        text: 'Это демо: на сайте здесь отвечает онлайн-консультант. Пока можно позвонить ' + mkContacts.phone + ' или заказать обратный звонок.',
      }),
    600,
  )
}

const onKey = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  ui.closeAll()
  ui.callback.value = false
  ui.chat.value = false
}
let timer: ReturnType<typeof setInterval> | undefined
const year = new Date().getFullYear()

onMounted(() => {
  ui.restore()
  ui.tick()
  timer = setInterval(ui.tick, 30000)
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  window.removeEventListener('keydown', onKey)
})
watch(
  () => route.fullPath,
  () => {
    ui.closeAll()
    navQuiet.value = true
    searchFocus.value = false
    if (import.meta.client) (document.activeElement as HTMLElement | null)?.blur()
  },
)
watch(
  () => ui.menu.value || ui.callback.value,
  (v) => import.meta.client && document.documentElement.classList.toggle('mk-lock', v),
)
</script>

<template>
  <div class="mk">
    <div class="mk-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="mkContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="mk-header">
      <div class="mk-header__top">
        <div class="mk-wrap mk-header__toprow">
          <nav class="mk-header__links" aria-label="О компании">
            <NuxtLink v-for="l in topLinks" :key="l.to" :to="mkPath(l.to)">{{ l.title }}</NuxtLink>
          </nav>
          <div class="mk-header__actions">
            <button type="button" @click="ui.callback.value = true"><MkIcon name="phone" :size="16" /> Обратный звонок</button>
            <button type="button" @click="ui.chat.value = !ui.chat.value"><MkIcon name="chat" :size="16" /> Консультант</button>
            <a :href="'tel:' + mkContacts.phoneTel" class="mk-header__phone">{{ mkContacts.phone }}</a>
          </div>
        </div>
      </div>

      <div class="mk-header__main">
        <div class="mk-wrap mk-header__row">
          <button type="button" class="mk-iconbtn mk-header__burger" aria-label="Меню" @click="ui.menu.value = true">
            <MkIcon name="menu" />
          </button>
          <NuxtLink :to="mkPath('/')" class="mk-logo" aria-label="Маккавеевский пищекомбинат — на главную">
            <img class="mk-logo__mark" :src="mkImg('b/logo.webp')" alt="" width="150" height="120" />
            <span class="mk-logo__text"><b>Маккавеевский</b><small>пищекомбинат с 1997 года</small></span>
          </NuxtLink>

          <nav class="mk-sects" :class="{ 'is-quiet': navQuiet }" aria-label="Продукция" @mouseleave="navQuiet = false">
            <div v-for="t in mkTops" :key="t.slug" class="mk-sects__item">
              <NuxtLink
                :to="mkPath('/catalog/' + t.slug)"
                class="mk-sects__btn"
                :class="{ 'is-active': route.params.section === t.slug || subsOf(t.slug).some((s) => s.slug === route.params.section) }"
              >
                <img :src="mkImg(t.icon)" alt="" width="172" height="65" />
                <span>{{ t.short }}</span>
                <MkIcon name="down" :size="14" />
              </NuxtLink>
              <div class="mk-sects__drop">
                <div class="mk-sects__head">
                  <b>{{ t.title }}</b>
                  <NuxtLink :to="mkPath('/catalog/' + t.slug)">
                    {{ t.count ? 'Все ' + mkPlural(t.count, 'позиция', 'позиции', 'позиций') : 'Открыть раздел' }}
                    <MkIcon name="arrow" :size="14" />
                  </NuxtLink>
                </div>
                <div class="mk-sects__list">
                  <NuxtLink v-for="s in subsOf(t.slug)" :key="s.slug" :to="mkPath('/catalog/' + s.slug)">
                    <span>{{ s.title }}</span>
                    <small>{{ s.count || 'в магазинах' }}</small>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </nav>

          <form class="mk-search" :class="{ 'is-open': ui.search.value }" role="search" @submit.prevent="goSearch">
            <MkIcon name="search" :size="20" />
            <input
              v-model="query"
              type="search"
              placeholder="Докторская, пельмени, сёмга…"
              aria-label="Поиск по продукции"
              @focus="searchFocus = true"
              @blur="onBlurSearch"
            />
            <div v-if="searchFocus" class="mk-search__pop">
              <template v-if="query.trim().length >= 2">
                <NuxtLink v-for="p in results.slice(0, 6)" :key="p.id" :to="mkPath('/product/' + p.id)" class="mk-search__item">
                  <img :src="mkProductImg(p.id)" alt="" width="48" height="48" />
                  <span
                    ><b>{{ p.name }}</b><small>{{ mkSub(p.sub)?.title }}</small></span
                  >
                </NuxtLink>
                <button v-if="results.length > 6" type="button" class="mk-search__all" @mousedown.prevent="goSearch">
                  Все результаты — {{ results.length }} <MkIcon name="arrow" :size="16" />
                </button>
                <p v-if="!results.length" class="mk-search__empty">По запросу «{{ query }}» ничего не нашли. Попробуйте «колбаса» или «сельдь».</p>
              </template>
              <p v-else class="mk-search__hint">
                Часто ищут:
                <button v-for="q in ['докторская', 'пельмени', 'сервелат', 'горбуша', 'холодец']" :key="q" type="button" @mousedown.prevent="pickHint(q)">
                  {{ q }}
                </button>
              </p>
            </div>
          </form>

          <div class="mk-header__tools">
            <button type="button" class="mk-iconbtn mk-header__searchbtn" aria-label="Поиск" @click="ui.search.value = !ui.search.value">
              <MkIcon :name="ui.search.value ? 'close' : 'search'" />
            </button>
            <NuxtLink :to="mkPath('/compare')" class="mk-iconbtn mk-header__compare" aria-label="Сравнение">
              <MkIcon name="compare" />
              <i v-if="ui.compare.value.length">{{ ui.compare.value.length }}</i>
            </NuxtLink>
            <a :href="'tel:' + mkContacts.phoneTel" class="mk-iconbtn mk-header__call" aria-label="Позвонить"><MkIcon name="phone" /></a>
            <NuxtLink :to="mkPath('/gde-kupit')" class="mk-wherebtn" :class="{ 'is-active': is('/gde-kupit') }">
              <MkIcon name="pin" :size="20" />
              <span
                ><b>Где купить</b><small><i class="mk-dot" :class="{ 'is-off': !openCount }" />{{ openCount ? 'открыто ' + openCount + ' из ' + mkStores.length : 'все закрыты до утра' }}</small></span
              >
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <Transition name="mk-drawer">
      <aside v-if="ui.menu.value" class="mk-drawer" aria-label="Меню">
        <div class="mk-drawer__head">
          <b>Меню</b>
          <button type="button" class="mk-iconbtn" aria-label="Закрыть меню" @click="ui.menu.value = false"><MkIcon name="close" /></button>
        </div>
        <nav class="mk-drawer__nav">
          <details v-for="t in mkTops" :key="t.slug" :open="t.slug === 'myaso'" class="mk-drawer__group">
            <summary>
              <img :src="mkImg(t.icon)" alt="" width="172" height="65" />{{ t.title }}
              <MkIcon name="down" :size="18" />
            </summary>
            <div class="mk-drawer__sub">
              <NuxtLink :to="mkPath('/catalog/' + t.slug)"
                ><b>Весь раздел</b><small>{{ t.count || '' }}</small></NuxtLink
              >
              <NuxtLink v-for="s in subsOf(t.slug)" :key="s.slug" :to="mkPath('/catalog/' + s.slug)"
                >{{ s.title }}<small>{{ s.count || '' }}</small></NuxtLink
              >
            </div>
          </details>
          <NuxtLink :to="mkPath('/gde-kupit')" class="mk-drawer__single">Где купить</NuxtLink>
          <NuxtLink v-for="l in topLinks" :key="l.to" :to="mkPath(l.to)" class="mk-drawer__single">{{ l.title }}</NuxtLink>
          <NuxtLink :to="mkPath('/compare')" class="mk-drawer__single"
            >Сравнение<small v-if="ui.compare.value.length">{{ ui.compare.value.length }}</small></NuxtLink
          >
        </nav>
        <div class="mk-drawer__foot">
          <a :href="'tel:' + mkContacts.phoneTel" class="mk-btn mk-btn--main"><MkIcon name="phone" :size="18" /> {{ mkContacts.phone }}</a>
          <button type="button" class="mk-btn mk-btn--line" @click="(ui.menu.value = false), (ui.callback.value = true)">Обратный звонок</button>
          <button type="button" class="mk-btn mk-btn--line" @click="(ui.menu.value = false), (ui.chat.value = true)">
            <MkIcon name="chat" :size="18" /> Консультант онлайн
          </button>
        </div>
      </aside>
    </Transition>
    <div v-if="ui.menu.value" class="mk-shade" @click="ui.menu.value = false" />

    <main class="mk-main">
      <NuxtPage />
    </main>

    <footer class="mk-footer">
      <div class="mk-wrap mk-footer__grid">
        <div class="mk-footer__brand">
          <NuxtLink :to="mkPath('/')" class="mk-logo">
            <img class="mk-logo__mark" :src="mkImg('b/logo.webp')" alt="" width="150" height="120" />
            <span class="mk-logo__text"><b>Маккавеевский</b><small>пищекомбинат с 1997 года</small></span>
          </NuxtLink>
          <p>Делиться лучшим! Колбасы, деликатесы, полуфабрикаты и рыба — из Маккавеево и Читы, в магазинах «Маккавеевский» по городу и краю.</p>
        </div>
        <nav class="mk-footer__col" aria-label="Продукция">
          <h3>Продукция</h3>
          <NuxtLink v-for="t in mkTops" :key="t.slug" :to="mkPath('/catalog/' + t.slug)">{{ t.title }}</NuxtLink>
          <NuxtLink :to="mkPath('/news')">Акции и новинки</NuxtLink>
          <NuxtLink :to="mkPath('/compare')">Сравнение</NuxtLink>
        </nav>
        <nav class="mk-footer__col" aria-label="Компания">
          <h3>Компания</h3>
          <NuxtLink :to="mkPath('/gde-kupit')">Где купить</NuxtLink>
          <NuxtLink :to="mkPath('/about')">О компании</NuxtLink>
          <NuxtLink :to="mkPath('/about#awards')">Награды</NuxtLink>
          <NuxtLink :to="mkPath('/faq')">Вопрос-ответ</NuxtLink>
          <NuxtLink :to="mkPath('/contacts')">Контакты</NuxtLink>
        </nav>
        <div class="mk-footer__col mk-footer__contacts">
          <h3>Контакты</h3>
          <a :href="'tel:' + mkContacts.phoneTel" class="mk-footer__phone">{{ mkContacts.phone }}</a>
          <a :href="'tel:' + mkContacts.phone2Tel">{{ mkContacts.phone2 }}</a>
          <a :href="'mailto:' + mkContacts.email">{{ mkContacts.email }}</a>
          <span>{{ mkContacts.address }}</span>
          <button type="button" class="mk-footer__more" @click="ui.callback.value = true">Обратный звонок <MkIcon name="arrow" :size="16" /></button>
        </div>
      </div>
      <div class="mk-wrap mk-footer__legal">
        <span>© 1997–{{ year }} {{ mkContacts.legal }}</span>
        <span
          >Концепт редизайна. Тексты, ассортимент и изображения принадлежат {{ mkContacts.legal }} и взяты с
          <a :href="mkContacts.original" target="_blank" rel="noopener">mpk-chita.ru</a>.</span
        >
      </div>
    </footer>

    <nav class="mk-tabbar" aria-label="Быстрые действия">
      <NuxtLink :to="mkPath('/catalog')" :class="{ 'is-active': is('/catalog') || is('/product') }"><MkIcon name="sausage" /><span>Продукция</span></NuxtLink>
      <NuxtLink :to="mkPath('/gde-kupit')" :class="{ 'is-active': is('/gde-kupit') }"><MkIcon name="pin" /><span>Где купить</span></NuxtLink>
      <NuxtLink :to="mkPath('/news')" :class="{ 'is-active': is('/news') }"><MkIcon name="tag" /><span>Акции</span></NuxtLink>
      <a :href="'tel:' + mkContacts.phoneTel"><MkIcon name="phone" /><span>Позвонить</span></a>
    </nav>

    <Transition name="mk-fade">
      <div v-if="ui.callback.value" class="mk-modal" role="dialog" aria-modal="true" aria-label="Обратный звонок" @click.self="closeCallback">
        <div class="mk-modal__box">
          <button type="button" class="mk-iconbtn mk-modal__close" aria-label="Закрыть" @click="closeCallback"><MkIcon name="close" /></button>
          <template v-if="!cb.sent">
            <h2>Обратный звонок</h2>
            <p>Оставьте свой номер — мы вам перезвоним.</p>
            <form class="mk-form" @submit.prevent="sendCallback">
              <label><span>Имя</span><input v-model="cb.name" type="text" autocomplete="name" placeholder="Как к вам обращаться" /></label>
              <label
                ><span>Телефон</span><MkPhone v-model="cb.phone" />
                <small v-if="cb.error" class="mk-form__err">{{ cb.error }}</small></label
              >
              <button type="submit" class="mk-btn mk-btn--main">Перезвоните мне</button>
            </form>
          </template>
          <div v-else class="mk-done">
            <MkIcon name="check" :size="32" />
            <h2>Заявка принята</h2>
            <p>Демо: в концепте заявка никуда не отправляется. На сайте её получит оператор и перезвонит на {{ cb.phone }}.</p>
            <button type="button" class="mk-btn mk-btn--line" @click="closeCallback">Хорошо</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="mk-fade">
      <section v-if="ui.chat.value" class="mk-chat" aria-label="Консультант онлайн">
        <header>
          <span class="mk-chat__ava">МПК</span>
          <span><b>Консультант онлайн</b><small>демо-окно чата</small></span>
          <button type="button" class="mk-iconbtn" aria-label="Закрыть чат" @click="ui.chat.value = false"><MkIcon name="close" :size="20" /></button>
        </header>
        <div class="mk-chat__log">
          <p v-for="(m, i) in chatLog" :key="i" :class="{ 'is-me': m.me }">{{ m.text }}</p>
        </div>
        <form @submit.prevent="sendChat">
          <input v-model="chatText" type="text" placeholder="Ваш вопрос" aria-label="Сообщение" />
          <button type="submit" class="mk-iconbtn" aria-label="Отправить"><MkIcon name="arrow" /></button>
        </form>
      </section>
    </Transition>

    <Transition name="mk-fade">
      <div v-if="ui.toast.value" class="mk-toast" role="status">{{ ui.toast.value }}</div>
    </Transition>
  </div>
</template>

<style lang="scss">
.mk-html {
  scroll-padding-top: 100px;
}
.mk-html.mk-lock {
  overflow: hidden;
}
.mk-body {
  margin: 0;
  background: #fff;
}

.mk {
  --mk-red: #d81920;
  --mk-red-h: #b5141a;
  --mk-ink: #1d1d1f;
  --mk-text: #3a3a3d;
  --mk-muted: #6e6e73;
  --mk-surface: #f4f4f5;
  --mk-soft: #fdeceb;
  --mk-line: #e6e6e9;
  --mk-yellow: #ffc20e;
  --mk-yellow-bg: #f4f4f5;
  --mk-green: #2c7a39;
  --mk-r: 10px;
  --mk-R: 18px;
  --mk-head: 'Arsenal', 'PT Sans', sans-serif;
  font-family: 'Open Sans', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  color: var(--mk-text);
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
:where(.mk) {
  h1,
  h2,
  h3,
  h4,
  p,
  ul,
  ol,
  figure,
  blockquote,
  dl,
  dd {
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
    font-family: var(--mk-head);
    font-weight: 700;
    color: var(--mk-ink);
    line-height: 1.12;
    letter-spacing: -0.005em;
  }
}
.mk-icon {
  flex: none;
  display: block;
}

.mk-wrap {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
}
.mk-main {
  flex: 1;
}

/* Баннер концепта */
.mk-banner {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 8px 16px;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;
  background: var(--mk-ink);
  color: #efe6e2;
  a {
    color: #fff;
    text-decoration: underline;
  }
}

/* Кнопки */
.mk-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: var(--mk-r);
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
  &--main {
    background: var(--mk-red);
    color: #fff;
    &:hover {
      background: var(--mk-red-h);
    }
  }
  &--line,
  &--line:focus,
  &--line:active {
    background: #fff;
    border: 1px solid var(--mk-line);
    color: var(--mk-ink);
  }
  &--line:hover {
    border-color: var(--mk-red);
    color: var(--mk-red);
  }
  &--soft {
    background: var(--mk-soft);
    color: var(--mk-red);
    &:hover {
      background: #fbd9d8;
    }
  }
  &--sm {
    min-height: 38px;
    padding: 0 14px;
    font-size: 14px;
  }
}
.mk-iconbtn {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--mk-r);
  color: var(--mk-ink);
  transition: background 0.15s;
  &:hover {
    background: var(--mk-surface);
  }
}
.mk-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--mk-green);
  box-shadow: 0 0 0 3px rgba(44, 122, 57, 0.16);
  &.is-off {
    background: var(--mk-muted);
    box-shadow: none;
  }
}

/* Шапка: верхняя строка уезжает, строка разделов и поиска остаётся */
.mk-header {
  position: sticky;
  top: -41px;
  z-index: 40;
  background: #fff;
  &__top {
    height: 41px;
    border-bottom: 1px solid var(--mk-line);
    font-size: 13.5px;
  }
  &__toprow {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  &__links {
    display: flex;
    gap: 22px;
    a {
      color: var(--mk-muted);
      white-space: nowrap;
      &:hover,
      &.router-link-exact-active {
        color: var(--mk-red);
      }
    }
  }
  &__actions {
    display: flex;
    align-items: center;
    gap: 20px;
    button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--mk-ink);
      white-space: nowrap;
      &:hover {
        color: var(--mk-red);
      }
    }
  }
  &__phone {
    font-weight: 700;
    color: var(--mk-ink);
    white-space: nowrap;
  }
  &__main {
    border-bottom: 1px solid var(--mk-line);
    box-shadow: 0 6px 18px rgba(37, 31, 28, 0.04);
  }
  &__row {
    display: flex;
    align-items: center;
    gap: 18px;
    height: 76px;
  }
  &__burger,
  &__searchbtn,
  &__call {
    display: none;
  }
  &__tools {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
  }
  &__compare i {
    position: absolute;
    top: 4px;
    right: 3px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--mk-red);
    color: #fff;
    font: 700 11px/18px 'Open Sans', sans-serif;
    font-style: normal;
    text-align: center;
  }
}

/* Логотип — их PNG с сайта (150×120, прозрачный) + название шрифтом концепта */
.mk-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  &__mark {
    width: 70px;
    height: 56px;
    object-fit: contain;
  }
  &__text {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
    b {
      font: 700 21px/1.05 var(--mk-head);
      color: var(--mk-ink);
    }
    small {
      font-size: 12px;
      color: var(--mk-muted);
      margin-top: 3px;
    }
  }
}

/* Три раздела с их картинками-вывесками */
.mk-sects {
  display: flex;
  gap: 4px;
  &__item {
    position: relative;
  }
  &__btn {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 52px;
    padding: 0 10px 0 6px;
    border-radius: var(--mk-r);
    font-weight: 600;
    color: var(--mk-ink);
    white-space: nowrap;
    transition: background 0.15s;
    img {
      width: 58px;
      height: 32px;
      object-fit: contain;
    }
    &:hover,
    &.is-active {
      background: var(--mk-surface);
    }
    &.is-active span {
      color: var(--mk-red);
    }
  }
  &__drop {
    position: absolute;
    top: calc(100% + 12px);
    left: 0;
    z-index: 5;
    width: 560px;
    padding: 18px 20px 20px;
    background: #fff;
    border: 1px solid var(--mk-line);
    border-radius: var(--mk-R);
    box-shadow:
      0 2px 6px rgba(37, 31, 28, 0.08),
      0 22px 54px rgba(37, 31, 28, 0.2);
    opacity: 0;
    visibility: hidden;
    transform: translateY(4px);
    transition:
      opacity 0.15s,
      transform 0.15s,
      visibility 0.15s;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: -14px;
      height: 14px;
    }
  }
  &__item:hover &__drop,
  &__item:focus-within &__drop {
    opacity: 1;
    visibility: visible;
    transform: none;
  }
  &.is-quiet &__drop {
    opacity: 0 !important;
    visibility: hidden !important;
  }
  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 10px;
    margin-bottom: 8px;
    border-bottom: 1px solid var(--mk-line);
    b {
      font: 700 19px/1.2 var(--mk-head);
      color: var(--mk-ink);
    }
    a {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      font-weight: 600;
      color: var(--mk-red);
      white-space: nowrap;
    }
  }
  &__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px 16px;
    a {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 7px 10px;
      margin: 0 -10px;
      border-radius: 8px;
      font-size: 14px;
      color: var(--mk-text);
      &:hover {
        background: var(--mk-surface);
        color: var(--mk-red);
      }
      small {
        color: var(--mk-muted);
        white-space: nowrap;
      }
    }
  }
  &__item:last-child &__drop {
    width: 440px;
  }
}

/* Поиск в строке шапки */
.mk-search {
  position: relative;
  flex: 1;
  min-width: 180px;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 14px;
  border-radius: var(--mk-r);
  background: var(--mk-surface);
  border: 1px solid transparent;
  color: var(--mk-muted);
  transition:
    border-color 0.15s,
    background 0.15s;
  &:focus-within {
    background: #fff;
    border-color: var(--mk-red);
  }
  input {
    flex: 1;
    min-width: 0;
    width: 0;
    height: 100%;
    border: 0;
    outline: 0;
    background: none;
    color: var(--mk-ink);
    &::-webkit-search-cancel-button {
      display: none;
    }
  }
  &__pop {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: 6;
    min-width: 320px;
    padding: 8px;
    background: #fff;
    border: 1px solid var(--mk-line);
    border-radius: 14px;
    box-shadow:
      0 2px 6px rgba(37, 31, 28, 0.08),
      0 22px 54px rgba(37, 31, 28, 0.2);
  }
  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 8px;
    border-radius: 10px;
    &:hover {
      background: var(--mk-surface);
    }
    img {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      border: 1px solid var(--mk-line);
    }
    span {
      display: flex;
      flex-direction: column;
      min-width: 0;
      line-height: 1.3;
    }
    b {
      font-weight: 600;
      color: var(--mk-ink);
      font-size: 14px;
    }
    small {
      color: var(--mk-muted);
      font-size: 12.5px;
    }
  }
  &__all {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 10px 8px 6px;
    font-weight: 600;
    color: var(--mk-red) !important;
  }
  &__empty,
  &__hint {
    padding: 8px;
    font-size: 14px;
    color: var(--mk-muted);
  }
  &__hint button {
    margin: 4px 0 0 6px;
    padding: 4px 10px;
    border-radius: 8px;
    background: var(--mk-surface);
    color: var(--mk-ink);
    &:hover {
      color: var(--mk-red);
    }
  }
}

.mk-wherebtn {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 16px 0 12px;
  border-radius: var(--mk-r);
  background: var(--mk-red);
  color: #fff;
  white-space: nowrap;
  transition: background 0.15s;
  &:hover,
  &.is-active {
    background: var(--mk-red-h);
  }
  span {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }
  b {
    font-weight: 700;
    font-size: 15px;
  }
  small {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12.5px;
    color: #f7dcdc;
  }
  .mk-dot {
    background: #7fdc8c;
    box-shadow: 0 0 0 3px rgba(127, 220, 140, 0.25);
  }
}

/* Меню на телефоне */
.mk-shade {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(37, 31, 28, 0.45);
}
.mk-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 60;
  width: min(380px, 92vw);
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow-y: auto;
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px 10px 20px;
    border-bottom: 1px solid var(--mk-line);
    b {
      font: 700 20px/1 var(--mk-head);
      color: var(--mk-ink);
    }
  }
  &__nav {
    padding: 8px 12px;
  }
  &__group summary {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 8px;
    font-weight: 700;
    color: var(--mk-ink);
    list-style: none;
    cursor: pointer;
    &::-webkit-details-marker {
      display: none;
    }
    img {
      width: 46px;
      height: 28px;
      object-fit: contain;
    }
    .mk-icon {
      margin-left: auto;
      transition: transform 0.15s;
    }
  }
  &__group[open] summary .mk-icon {
    transform: rotate(180deg);
  }
  &__sub {
    display: flex;
    flex-direction: column;
    padding: 0 0 8px 64px;
    a {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 7px 8px;
      font-size: 14.5px;
      border-radius: 8px;
      &.router-link-active {
        color: var(--mk-red);
        background: var(--mk-soft);
      }
    }
    small {
      color: var(--mk-muted);
    }
  }
  &__single {
    display: flex;
    justify-content: space-between;
    padding: 12px 8px;
    font-weight: 600;
    color: var(--mk-ink);
    border-top: 1px solid var(--mk-line);
    small {
      color: var(--mk-red);
    }
  }
  &__foot {
    display: grid;
    gap: 10px;
    padding: 16px 20px 28px;
    margin-top: auto;
    background: var(--mk-surface);
  }
}
.mk-drawer-enter-active,
.mk-drawer-leave-active {
  transition: transform 0.22s ease;
}
.mk-drawer-enter-from,
.mk-drawer-leave-to {
  transform: translateX(-100%);
}
.mk-fade-enter-active,
.mk-fade-leave-active {
  transition: opacity 0.18s;
}
.mk-fade-enter-from,
.mk-fade-leave-to {
  opacity: 0;
}

/* Общие блоки страниц */
.mk-section {
  padding-top: 64px;
  padding-bottom: 64px;
}
.mk-section--tint {
  background: var(--mk-surface);
}
.mk-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;
  flex-wrap: wrap;
  margin-bottom: 28px;
  h2 {
    font-size: clamp(28px, 3vw, 38px);
  }
  p {
    margin-top: 8px;
    color: var(--mk-muted);
    max-width: 640px;
  }
  &__more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: var(--mk-red);
    white-space: nowrap;
  }
}
.mk-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  padding-top: 22px;
  font-size: 13.5px;
  color: var(--mk-muted);
  a:hover {
    color: var(--mk-red);
  }
  span + span::before {
    content: '/';
    margin-right: 8px;
    color: var(--mk-line);
  }
}
.mk-page-title {
  margin-top: 10px;
  font-size: clamp(32px, 4vw, 48px);
}
.mk-flag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 9px;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  background: var(--mk-soft);
  color: var(--mk-red);
  &--red {
    background: var(--mk-red);
    color: #fff;
  }
  &--soft {
    background: var(--mk-soft);
    color: var(--mk-red);
  }
  &--grey {
    background: var(--mk-surface);
    color: var(--mk-text);
  }
}
.mk-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid var(--mk-line);
  font-size: 14px;
  font-weight: 600;
  color: var(--mk-ink);
  white-space: nowrap;
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s;
  &:hover {
    border-color: var(--mk-red);
  }
  &.is-on,
  &.is-on:focus {
    background: var(--mk-soft);
    border-color: var(--mk-soft);
    color: var(--mk-red);
  }
  small {
    font-weight: 500;
    color: var(--mk-muted);
  }
}

/* Карточка продукта: студийный снимок на белом, раздел, название, состав */
.mk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
}
.mk-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  &__pic {
    position: relative;
    display: block;
    aspect-ratio: 1;
    border: 1px solid var(--mk-line);
    border-radius: 16px;
    background: #fff;
    overflow: hidden;
    img {
      position: absolute;
      inset: 6%;
      width: 88%;
      height: 88%;
      object-fit: contain;
      transition: transform 0.25s;
    }
  }
  &:hover &__pic img {
    transform: scale(1.04);
  }
  &__flags {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    display: flex;
    gap: 6px;
  }
  &__cmp,
  &__cmp:focus {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--mk-line);
    color: var(--mk-muted);
    transition:
      color 0.15s,
      background 0.15s;
    &:hover {
      color: var(--mk-red);
    }
    &.is-on {
      background: var(--mk-red);
      border-color: var(--mk-red);
      color: #fff;
    }
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 2px 0;
  }
  &__sub {
    font-size: 12.5px;
    color: var(--mk-muted);
  }
  &__name {
    font-weight: 700;
    font-size: 15.5px;
    line-height: 1.3;
    color: var(--mk-ink);
    &:hover {
      color: var(--mk-red);
    }
  }
  &__comp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 13.5px;
    line-height: 1.45;
    color: var(--mk-muted);
  }
  &__facts {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
    span {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 26px;
      padding: 0 8px;
      border-radius: 7px;
      background: var(--mk-surface);
      font-size: 12.5px;
      color: var(--mk-text);
      white-space: nowrap;
    }
  }
}
/* Список вместо плитки */
.mk-grid.is-list {
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  .mk-card {
    display: grid;
    grid-template-columns: 112px minmax(0, 1fr);
    gap: 18px;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid var(--mk-line);
  }
  .mk-card__pic {
    border-radius: 12px;
  }
  .mk-card__flags {
    top: 18px;
    left: 4px;
    transform: scale(0.85);
    transform-origin: left top;
  }
  .mk-card__cmp {
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
  .mk-card__body {
    padding: 0 48px 0 0;
  }
  .mk-card__comp {
    -webkit-line-clamp: 3;
  }
}

/* Формы */
.mk-form {
  display: grid;
  gap: 14px;
  label {
    display: grid;
    gap: 6px;
    > span {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--mk-ink);
    }
  }
  input,
  textarea,
  select {
    width: 100%;
    min-height: 48px;
    padding: 10px 14px;
    border-radius: var(--mk-r);
    border: 1px solid var(--mk-line);
    background: #fff;
    outline: 0;
    &:focus {
      border-color: var(--mk-red);
    }
  }
  textarea {
    min-height: 110px;
    resize: vertical;
  }
  &__err {
    color: var(--mk-red);
    font-size: 13px;
  }
}
.mk-done {
  display: grid;
  justify-items: start;
  gap: 10px;
  .mk-icon {
    color: var(--mk-green);
  }
  p {
    color: var(--mk-muted);
  }
}

/* Окно обратного звонка */
.mk-modal {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(37, 31, 28, 0.5);
  &__box {
    position: relative;
    width: min(440px, 100%);
    padding: 28px;
    border-radius: 20px;
    background: #fff;
    h2 {
      font-size: 28px;
    }
    > p {
      margin: 6px 0 18px;
      color: var(--mk-muted);
    }
  }
  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

/* Консультант */
.mk-chat {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 65;
  width: min(360px, calc(100vw - 32px));
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--mk-line);
  border-radius: 18px;
  box-shadow:
    0 2px 6px rgba(37, 31, 28, 0.08),
    0 22px 54px rgba(37, 31, 28, 0.24);
  overflow: hidden;
  header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 8px 10px 14px;
    border-bottom: 1px solid var(--mk-line);
    > span:nth-child(2) {
      display: flex;
      flex-direction: column;
      line-height: 1.25;
      flex: 1;
    }
    b {
      color: var(--mk-ink);
    }
    small {
      color: var(--mk-muted);
      font-size: 12.5px;
    }
  }
  &__ava {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--mk-red);
    color: #fff;
    font: 700 13px/1 var(--mk-head);
  }
  &__log {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 280px;
    min-height: 160px;
    padding: 14px;
    overflow-y: auto;
    background: var(--mk-surface);
    p {
      max-width: 85%;
      padding: 8px 12px;
      border-radius: 12px 12px 12px 4px;
      background: #fff;
      font-size: 14px;
      &.is-me {
        align-self: flex-end;
        border-radius: 12px 12px 4px 12px;
        background: var(--mk-red);
        color: #fff;
      }
    }
  }
  form {
    display: flex;
    gap: 6px;
    padding: 8px;
    input {
      flex: 1;
      min-width: 0;
      width: 0;
      height: 44px;
      padding: 0 12px;
      border: 1px solid var(--mk-line);
      border-radius: var(--mk-r);
      outline: 0;
      &:focus {
        border-color: var(--mk-red);
      }
    }
    .mk-iconbtn {
      background: var(--mk-red);
      color: #fff;
    }
  }
}
.mk-toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  z-index: 80;
  transform: translateX(-50%);
  padding: 12px 18px;
  border-radius: 12px;
  background: var(--mk-ink);
  color: #fff;
  font-size: 14px;
  white-space: nowrap;
  box-shadow: 0 12px 30px rgba(37, 31, 28, 0.25);
}

/* Подвал */
.mk-footer {
  margin-top: 0;
  padding: 52px 0 24px;
  background: var(--mk-surface);
  border-top: 4px solid var(--mk-red);
  &__grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
    gap: 32px;
  }
  &__brand p {
    margin-top: 16px;
    max-width: 360px;
    color: var(--mk-muted);
    font-size: 14px;
  }
  &__col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    font-size: 14.5px;
    h3 {
      font-size: 19px;
      margin-bottom: 4px;
    }
    a:hover {
      color: var(--mk-red);
    }
  }
  &__phone {
    font-weight: 700;
    font-size: 18px;
    color: var(--mk-ink);
  }
  &__contacts span {
    color: var(--mk-muted);
  }
  &__more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-weight: 600;
    color: var(--mk-red) !important;
  }
  &__legal {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px 24px;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid var(--mk-line);
    font-size: 12.5px;
    color: var(--mk-muted);
    a {
      text-decoration: underline;
    }
  }
}

.mk-tabbar {
  display: none;
}

@media (max-width: 1400px) {
  .mk-sects__btn img {
    display: none;
  }
  .mk-sects__btn {
    padding: 0 10px;
  }
}
@media (max-width: 1199px) {
  .mk-header__links a:nth-child(3) {
    display: none;
  }
  .mk-logo__text small {
    display: none;
  }
  .mk-wherebtn small {
    display: none;
  }
  .mk-wherebtn {
    height: 46px;
  }
}
@media (max-width: 989px) {
  .mk-html {
    scroll-padding-top: 130px;
  }
  .mk-wrap {
    padding-left: 20px;
    padding-right: 20px;
  }
  .mk-header {
    top: -60px;
    &__top {
      display: none;
    }
    &__row {
      height: auto;
      flex-wrap: wrap;
      gap: 0 6px;
      padding-top: 8px;
      padding-bottom: 10px;
    }
    &__burger,
    &__call {
      display: inline-grid;
    }
    &__burger {
      margin-left: -10px;
    }
    &__tools {
      gap: 2px;
      margin-right: -8px;
      height: 44px;
    }
  }
  .mk-sects {
    display: none;
  }
  .mk-logo {
    height: 44px;
  }
  .mk-wherebtn {
    display: none;
  }
  .mk-search {
    order: 5;
    flex: 0 0 100%;
    margin-top: 8px;
  }
  .mk-footer__grid {
    grid-template-columns: 1fr 1fr;
  }
  .mk-footer {
    padding-bottom: 96px;
  }
  .mk-tabbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 45;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1px solid var(--mk-line);
    box-shadow: 0 -6px 18px rgba(37, 31, 28, 0.06);
    a {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 6px 0;
      font-size: 11.5px;
      font-weight: 600;
      color: var(--mk-muted);
      border-radius: 10px;
      &.is-active {
        color: var(--mk-red);
        background: var(--mk-soft);
      }
    }
  }
  .mk-chat {
    right: 16px;
    bottom: 84px;
  }
  .mk-toast {
    bottom: 88px;
  }
  .mk-section {
    padding-top: 48px;
    padding-bottom: 48px;
  }
}
@media (max-width: 576px) {
  .mk-wrap {
    padding-left: 16px;
    padding-right: 16px;
  }
  .mk-logo__mark {
    width: 55px;
    height: 44px;
  }
  .mk-logo__text b {
    font-size: 19px;
  }
  .mk-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 12px;
  }
  .mk-card__comp {
    display: none;
  }
  .mk-card__name {
    font-size: 14.5px;
  }
  .mk-card__facts span:nth-child(2) {
    display: none;
  }
  .mk-footer__grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .mk-grid.is-list .mk-card {
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 12px;
  }
  .mk-grid.is-list .mk-card__comp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
  }
  .mk-toast {
    white-space: normal;
    width: calc(100vw - 32px);
    text-align: center;
  }
  .mk-modal__box {
    padding: 24px 20px;
  }
}
@media (max-width: 375px) {
  .mk-logo__text b {
    font-size: 17px;
  }
  .mk-logo__mark {
    width: 50px;
    height: 40px;
  }
  .mk-header__compare {
    width: 40px;
  }
  .mk-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* Плакаты акций и новинок — нужны списку и странице новости */
.mk-news {
  padding-bottom: 72px;
  &__kinds {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    margin-top: 20px;
    padding-bottom: 4px;
    scrollbar-width: none;
    .mk-chip {
      flex: none;
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 28px 20px;
    margin-top: 24px;
  }
}
.mk-post {
  display: flex;
  flex-direction: column;
  gap: 10px;
  &__pic {
    position: relative;
    display: block;
    aspect-ratio: 0.72;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid var(--mk-line);
    background: var(--mk-surface);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.25s;
    }
  }
  > .mk-flag {
    align-self: flex-start;
    margin-bottom: -2px;
  }
  &:hover img {
    transform: scale(1.03);
  }
  b {
    font-weight: 700;
    line-height: 1.3;
    color: var(--mk-ink);
  }
  &:hover b {
    color: var(--mk-red);
  }
  small {
    margin-top: -4px;
    font-weight: 600;
    color: var(--mk-red);
  }
}
@media (max-width: 576px) {
  .mk-news__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 12px;
  }
  .mk-post b {
    font-size: 14px;
  }
}
</style>
