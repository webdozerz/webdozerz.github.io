<script lang="ts" setup>
import IzIcon from '~/components/redesign/izyumovskoe/IzIcon.vue'
import IzPhone from '~/components/redesign/izyumovskoe/IzPhone.vue'

const route = useRoute()
const router = useRouter()
const cart = useIzyumCart()
const ui = useIzyumUi()

useSeoMeta({
  title: 'Изюмовское — фермерская птица, молодняк и говядина в Омске | Концепт редизайна',
  description:
    'Концепт редизайна сайта изюмовское.рф: перепел, бройлер и утка с фермы в Азовском районе, суточные утята, гусята и цыплята от 10 голов, говядина «Герефорд». Корзина делит заказ на доставку мяса и самовывоз молодняка.',
  ogTitle: 'Изюмовское — концепт редизайна',
  ogDescription: 'Фермерская птица с доставкой по Омску, суточный молодняк от 10 голов и говядина «Герефорд»: каталог, корзина, сравнение и вход.',
  ogImage: 'https://andryushov.me/redesign/izyumovskoe/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'iz-html', lang: 'ru' },
  bodyAttrs: { class: 'iz-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@600;700;800&family=Roboto:wght@400;500;700&display=swap',
    },
  ],
})

const pages = [
  { to: '/o-ferme', label: 'О ферме' },
  { to: '/dostavka', label: 'Доставка и оплата' },
  { to: '/o-ferme#otzyvy', label: 'Отзывы' },
  { to: '/kontakty', label: 'Контакты' },
]
const pageTo = (to: string) => {
  const [path, hash] = to.split('#')
  return { path: izPath(path), hash: hash ? `#${hash}` : undefined }
}
const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`
const groupsOf = (s: IzSectionId) => izGroups.filter((g) => g.section === s && !g.parent)
const kids = (g: string) => izGroups.filter((x) => x.parent === g)
const isSection = (s: IzSectionId) => route.params.section === s || izProduct(String(route.params.id ?? ''))?.section === s
const year = new Date().getFullYear()

// Липкая шапка: строка с условиями уезжает, строка со знаком, разделами, поиском и корзиной остаётся у верха
const strip = ref<HTMLElement | null>(null)
const stick = ref(0)
const measure = () => {
  stick.value = strip.value?.offsetHeight ?? 0
}

// Поиск с подсказками: фото, раздел и цена; Enter — каталог с запросом
const q = ref('')
const searchOpen = ref(false)
const searchFocus = ref(false)
const hits = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (s.length < 2) return []
  return izProducts.filter((p) => p.title.toLowerCase().includes(s) || izGroup(p.group)?.title.toLowerCase().includes(s)).slice(0, 6)
})
const goSearch = () => {
  router.push({ path: izPath('/catalog'), query: q.value.trim() ? { q: q.value.trim() } : {} })
  searchFocus.value = false
  searchOpen.value = false
}
const blurSearch = () => setTimeout(() => (searchFocus.value = false), 150)

// Меню на телефоне: разделы раскрываются, как у оригинала
const openSec = ref<IzSectionId | null>(null)

// Вход и регистрация — демо: имя запоминается в браузере
const auth = reactive({ login: '', pass: '', name: '', phone: '', email: '', company: '', agree: false, sent: false })
const doLogin = () => {
  cart.user.value = auth.login.split('@')[0] || 'Покупатель'
  ui.login.value = false
  ui.toast.value = 'Вы вошли — демо, пароль никуда не отправлялся'
}
const doRegister = () => {
  cart.user.value = auth.name || 'Покупатель'
  ui.login.value = false
  ui.toast.value = 'Регистрация в концепте — только для показа'
}
const doVk = () => {
  cart.user.value = 'Гость ВКонтакте'
  ui.login.value = false
  ui.toast.value = 'Вход через ВКонтакте — демо'
}

// Купить в один клик: имя и телефон, остальное менеджер уточнит звонком
const oneProduct = computed(() => (ui.oneClick.value ? izProduct(ui.oneClick.value) : null))
const one = reactive({ name: '', phone: '', sent: false })
watch(
  () => ui.oneClick.value,
  () => {
    one.sent = false
  },
)

// Подписка в подвале
const sub = ref('')
const subscribe = () => {
  if (!sub.value.includes('@')) return
  ui.toast.value = 'Подписка оформлена — в концепте письма не приходят'
  sub.value = ''
}

let toastTimer: ReturnType<typeof setTimeout> | undefined
watch(
  () => ui.toast.value,
  (v) => {
    clearTimeout(toastTimer)
    if (v) toastTimer = setTimeout(() => (ui.toast.value = ''), 2600)
  },
)

const onKey = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  ui.menu.value = false
  ui.login.value = false
  ui.oneClick.value = null
  searchOpen.value = false
}
const locked = computed(() => ui.menu.value || !!ui.login.value || !!ui.oneClick.value)
// autofocus не срабатывает у полей, которые Vue вставляет позже, — ставим фокус сами
watch([() => ui.login.value, () => ui.oneClick.value], () =>
  nextTick(() => document.querySelector<HTMLInputElement>('.iz-modal form input')?.focus()),
)
watch(locked, (v) => document.documentElement.classList.toggle('iz-lock', v))
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    searchOpen.value = false
  },
)

onMounted(() => {
  cart.persist()
  measure()
  window.addEventListener('resize', measure)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', measure)
  document.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('iz-lock')
})
</script>

<template>
  <div class="iz">
    <div class="iz-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="izContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="iz-header" :style="{ top: `${-stick}px` }">
      <div ref="strip" class="iz-strip">
        <div class="iz-wrap iz-strip__row">
          <span class="iz-strip__item iz-strip__where"><IzIcon name="pin" :size="17" />Ферма в {{ izContacts.short }}</span>
          <span class="iz-strip__item iz-strip__ship">
            <IzIcon name="truck" :size="17" /><span class="iz-strip__long">Мясо по Омску — 350 ₽, при встрече бесплатно</span
            ><span class="iz-strip__short">Доставка 350 ₽</span>
          </span>
          <span class="iz-strip__item iz-strip__hours"><IzIcon name="clock" :size="17" />{{ izContacts.hours }}</span>
          <nav class="iz-strip__nav" aria-label="Страницы">
            <NuxtLink v-for="p in pages" :key="p.to" :to="pageTo(p.to)">{{ p.label }}</NuxtLink>
          </nav>
          <a :href="tel(izContacts.phones[0])" class="iz-strip__phone"><IzIcon name="phone" :size="17" />{{ izContacts.phones[0] }}</a>
        </div>
      </div>

      <div class="iz-wrap iz-bar">
        <button type="button" class="iz-iconbtn iz-bar__burger" aria-label="Меню" @click="ui.menu.value = true"><IzIcon name="menu" /></button>
        <NuxtLink :to="izPath()" class="iz-mark" aria-label="Изюмовское, на главную">
          <span class="iz-mark__sign"><IzIcon name="egg" :size="22" /></span>
          <span class="iz-mark__text">
            <span class="iz-mark__name">Изюмовское</span>
            <span class="iz-mark__sub">фермерское хозяйство</span>
          </span>
        </NuxtLink>

        <nav class="iz-secs" aria-label="Каталог">
          <div v-for="s in izSections" :key="s.id" class="iz-secs__item">
            <NuxtLink :to="izPath(`/catalog/${s.id}`)" class="iz-secs__link" :class="{ 'is-on': isSection(s.id) }">
              <img :src="izImg(s.icon)" alt="" width="34" height="34" />
              <span>{{ s.short }}</span>
            </NuxtLink>
            <div class="iz-secs__drop">
              <div class="iz-secs__list">
                <div v-for="g in groupsOf(s.id)" :key="g.id" class="iz-secs__group">
                  <NuxtLink :to="{ path: izPath(`/catalog/${s.id}`), query: { g: g.id } }">{{ g.title }}</NuxtLink>
                  <NuxtLink v-for="k in kids(g.id)" :key="k.id" :to="{ path: izPath(`/catalog/${s.id}`), query: { g: k.id } }" class="iz-secs__kid">
                    {{ k.title }}
                  </NuxtLink>
                </div>
              </div>
              <NuxtLink :to="izPath(`/catalog/${s.id}`)" class="iz-secs__all">
                <img :src="izImg(s.tile)" alt="" width="220" height="150" loading="lazy" />
                <span>Весь раздел · {{ izCount(s.id) }}</span>
              </NuxtLink>
            </div>
          </div>
        </nav>

        <form class="iz-search" :class="{ 'is-open': searchOpen }" role="search" @submit.prevent="goSearch">
          <IzIcon name="search" :size="20" class="iz-search__ico" />
          <input v-model="q" type="search" placeholder="Перепел, утята, гуляш…" aria-label="Поиск" @focus="searchFocus = true" @blur="blurSearch" />
          <div v-if="searchFocus && q.trim().length >= 2" class="iz-search__drop">
            <NuxtLink v-for="h in hits" :key="h.id" :to="izPath(`/product/${h.id}`)" class="iz-search__hit">
              <img :src="h.img" alt="" width="52" height="40" />
              <span
                ><b>{{ h.title }}</b><small>{{ izSection(h.section)?.short }} · {{ izPriceText(h) }}</small></span
              >
            </NuxtLink>
            <p v-if="!hits.length" class="iz-search__none">Ничего не нашли. Позвоните — подскажем: {{ izContacts.phones[0] }}</p>
            <button v-else type="submit" class="iz-search__more">Все результаты</button>
          </div>
        </form>

        <div class="iz-bar__icons">
          <button type="button" class="iz-iconbtn iz-bar__searchbtn" aria-label="Поиск" @click="searchOpen = !searchOpen">
            <IzIcon :name="searchOpen ? 'close' : 'search'" />
          </button>
          <button type="button" class="iz-iconbtn iz-bar__user" :aria-label="cart.user.value ? 'Личный кабинет' : 'Войти'" @click="ui.login.value = 'login'">
            <IzIcon name="user" /><span>{{ cart.user.value ? cart.user.value.slice(0, 10) : 'Войти' }}</span>
          </button>
          <NuxtLink :to="izPath('/compare')" class="iz-iconbtn iz-bar__cmp" aria-label="Сравнение">
            <IzIcon name="scales" /><i v-if="cart.compare.value.length">{{ cart.compare.value.length }}</i>
          </NuxtLink>
          <NuxtLink :to="izPath('/cart')" class="iz-cartbtn" :class="{ 'is-full': cart.count.value }" aria-label="Корзина">
            <IzIcon name="bag" />
            <span class="iz-cartbtn__text">
              <template v-if="cart.count.value">
                <b>{{ cart.headerSum.value ? `до ${izMoney(cart.headerSum.value)}` : 'по запросу' }}</b>
                <small>{{ cart.count.value }} {{ izPlural(cart.count.value, 'позиция', 'позиции', 'позиций') }}</small>
              </template>
              <b v-else>Корзина</b>
            </span>
            <i v-if="cart.count.value" class="iz-cartbtn__badge">{{ cart.count.value }}</i>
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="iz-main">
      <NuxtPage />
    </main>

    <footer class="iz-footer">
      <div class="iz-wrap iz-footer__grid">
        <div class="iz-footer__about">
          <NuxtLink :to="izPath()" class="iz-mark">
            <span class="iz-mark__sign"><IzIcon name="egg" :size="22" /></span>
            <span class="iz-mark__text">
              <span class="iz-mark__name">Изюмовское</span>
              <span class="iz-mark__sub">фермерское хозяйство</span>
            </span>
          </NuxtLink>
          <p>Выращиваем птицу с {{ izContacts.since }} года в Азовском районе Омской области — вдали от заводов и жилых массивов.</p>
          <form class="iz-footer__sub" @submit.prevent="subscribe">
            <label for="iz-sub">Скидки, акции и новинки на почту</label>
            <div>
              <input id="iz-sub" v-model="sub" type="email" placeholder="Ваш e-mail" />
              <button type="submit" class="iz-btn iz-btn--main">Подписаться</button>
            </div>
          </form>
        </div>
        <div>
          <h3>Каталог</h3>
          <ul class="iz-footer__links">
            <li v-for="s in izSections" :key="s.id">
              <NuxtLink :to="izPath(`/catalog/${s.id}`)">{{ s.title }}</NuxtLink>
            </li>
            <li><NuxtLink :to="izPath('/catalog')">Все товары</NuxtLink></li>
            <li><NuxtLink :to="izPath('/compare')">Сравнение</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3>Покупателям</h3>
          <ul class="iz-footer__links">
            <li><NuxtLink :to="izPath('/dostavka')">Доставка</NuxtLink></li>
            <li><NuxtLink :to="{ path: izPath('/dostavka'), hash: '#oplata' }">Способы оплаты</NuxtLink></li>
            <li><NuxtLink :to="{ path: izPath('/dostavka'), hash: '#oferta' }">Договор-оферта</NuxtLink></li>
            <li><NuxtLink :to="{ path: izPath('/o-ferme'), hash: '#otzyvy' }">Отзывы о нас</NuxtLink></li>
            <li><NuxtLink :to="{ path: izPath('/kontakty'), hash: '#napishite' }">Напишите нам</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3>Контакты</h3>
          <ul class="iz-footer__links iz-footer__contacts">
            <li v-for="p in izContacts.phones" :key="p">
              <a :href="tel(p)">{{ p }}</a>
            </li>
            <li>
              <a :href="`mailto:${izContacts.email}`">{{ izContacts.email }}</a>
            </li>
            <li>Звонки {{ izContacts.hours }}</li>
            <li>{{ izContacts.address }}</li>
          </ul>
        </div>
      </div>
      <div class="iz-wrap iz-footer__legal">
        <span>© {{ izContacts.since }}–{{ year }} {{ izContacts.company }} · ИНН {{ izContacts.req.inn }} · ОГРН {{ izContacts.req.ogrn }}</span>
        <span
          >Тексты, цены и изображения принадлежат {{ izContacts.company }}. Концепт редизайна —
          <a href="https://andryushov.me/redesign/" target="_blank" rel="noopener">andryushov.me</a></span
        >
      </div>
    </footer>

    <nav class="iz-tabbar" aria-label="Быстрые действия">
      <NuxtLink :to="izPath('/catalog')"><IzIcon name="grid" /><span>Каталог</span></NuxtLink>
      <a :href="tel(izContacts.phones[0])"><IzIcon name="phone" /><span>Позвонить</span></a>
      <NuxtLink :to="izPath('/dostavka')"><IzIcon name="truck" /><span>Доставка</span></NuxtLink>
      <NuxtLink :to="izPath('/cart')" class="iz-tabbar__cart" :class="{ 'is-full': cart.count.value }">
        <IzIcon name="bag" /><span>{{ cart.count.value ? (cart.headerSum.value ? `до ${izMoney(cart.headerSum.value)}` : `${cart.count.value} поз.`) : 'Корзина' }}</span>
        <i v-if="cart.count.value">{{ cart.count.value }}</i>
      </NuxtLink>
    </nav>

    <!-- Меню на телефоне -->
    <div v-if="ui.menu.value" class="iz-shade" @click.self="ui.menu.value = false">
      <aside class="iz-drawer" aria-label="Меню">
        <div class="iz-drawer__head">
          <b>Меню</b>
          <button type="button" class="iz-iconbtn" aria-label="Закрыть" @click="ui.menu.value = false"><IzIcon name="close" /></button>
        </div>
        <div v-for="s in izSections" :key="s.id" class="iz-drawer__sec" :class="{ 'is-open': openSec === s.id }">
          <div class="iz-drawer__row">
            <NuxtLink :to="izPath(`/catalog/${s.id}`)"><img :src="izImg(s.icon)" alt="" width="32" height="32" />{{ s.title }}</NuxtLink>
            <button type="button" class="iz-iconbtn" :aria-label="openSec === s.id ? 'Свернуть' : 'Развернуть'" @click="openSec = openSec === s.id ? null : s.id">
              <IzIcon name="down" :size="18" />
            </button>
          </div>
          <div v-if="openSec === s.id" class="iz-drawer__groups">
            <template v-for="g in groupsOf(s.id)" :key="g.id">
              <NuxtLink :to="{ path: izPath(`/catalog/${s.id}`), query: { g: g.id } }">{{ g.title }}</NuxtLink>
              <NuxtLink v-for="k in kids(g.id)" :key="k.id" :to="{ path: izPath(`/catalog/${s.id}`), query: { g: k.id } }" class="is-kid">{{ k.title }}</NuxtLink>
            </template>
          </div>
        </div>
        <nav class="iz-drawer__pages">
          <NuxtLink :to="izPath()">Главная</NuxtLink>
          <NuxtLink v-for="p in pages" :key="p.to" :to="pageTo(p.to)">{{ p.label }}</NuxtLink>
          <NuxtLink :to="{ path: izPath('/kontakty'), hash: '#napishite' }">Напишите нам</NuxtLink>
          <NuxtLink :to="izPath('/compare')">Сравнение ({{ cart.compare.value.length }})</NuxtLink>
          <button type="button" @click="((ui.menu.value = false), (ui.login.value = 'login'))">{{ cart.user.value ? `Кабинет: ${cart.user.value}` : 'Вход и регистрация' }}</button>
        </nav>
        <div class="iz-drawer__contacts">
          <a v-for="p in izContacts.phones" :key="p" :href="tel(p)"><IzIcon name="phone" :size="18" />{{ p }}</a>
          <span><IzIcon name="clock" :size="18" />Звонки {{ izContacts.hours }}</span>
        </div>
      </aside>
    </div>

    <!-- Вход / регистрация -->
    <div v-if="ui.login.value" class="iz-shade iz-shade--center" @click.self="ui.login.value = false">
      <div class="iz-modal" role="dialog" aria-label="Вход">
        <button type="button" class="iz-iconbtn iz-modal__close" aria-label="Закрыть" @click="ui.login.value = false"><IzIcon name="close" /></button>
        <template v-if="cart.user.value">
          <h2>Здравствуйте, {{ cart.user.value }}</h2>
          <p class="iz-modal__lead">В кабинете оригинала — история заказов и отзывы к товарам. В концепте вход только показывает, как это будет выглядеть.</p>
          <div class="iz-modal__actions">
            <NuxtLink :to="izPath('/cart')" class="iz-btn iz-btn--main" @click="ui.login.value = false">Корзина</NuxtLink>
            <button type="button" class="iz-btn iz-btn--line" @click="((cart.user.value = ''), (ui.login.value = false))">Выйти</button>
          </div>
        </template>
        <template v-else>
          <div class="iz-seg">
            <button type="button" :class="{ 'is-on': ui.login.value !== 'register' }" @click="ui.login.value = 'login'">Вход</button>
            <button type="button" :class="{ 'is-on': ui.login.value === 'register' }" @click="ui.login.value = 'register'">Регистрация</button>
          </div>
          <form v-if="ui.login.value === 'login'" class="iz-form" @submit.prevent="doLogin">
            <label>Логин или e-mail<input v-model="auth.login" required autocomplete="off" autofocus /></label>
            <label>Пароль<input v-model="auth.pass" type="password" required autocomplete="off" /></label>
            <button type="button" class="iz-link" @click="ui.login.value = 'forgot'">Забыли пароль?</button>
            <button type="submit" class="iz-btn iz-btn--main iz-btn--wide">Войти</button>
          </form>
          <form v-else-if="ui.login.value === 'forgot'" class="iz-form" @submit.prevent="auth.sent = true">
            <p v-if="auth.sent" class="iz-note iz-note--ok">Ссылка для нового пароля ушла бы на почту — в концепте письма не отправляются.</p>
            <label>E-mail, указанный при регистрации<input v-model="auth.email" type="email" required autocomplete="off" /></label>
            <button type="submit" class="iz-btn iz-btn--main iz-btn--wide">Восстановить пароль</button>
            <button type="button" class="iz-link" @click="ui.login.value = 'login'">Вернуться ко входу</button>
          </form>
          <form v-else class="iz-form" @submit.prevent="doRegister">
            <label>Имя<input v-model="auth.name" required autocomplete="off" /></label>
            <label>Телефон<IzPhone v-model="auth.phone" /></label>
            <label>E-mail<input v-model="auth.email" type="email" required autocomplete="off" /></label>
            <label>Пароль<input v-model="auth.pass" type="password" required autocomplete="off" /></label>
            <label>Компания <small>для оплаты по счёту</small><input v-model="auth.company" autocomplete="off" /></label>
            <label class="iz-check"><input v-model="auth.agree" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
            <button type="submit" class="iz-btn iz-btn--main iz-btn--wide">Зарегистрироваться</button>
          </form>
          <button type="button" class="iz-btn iz-btn--line iz-btn--wide iz-modal__vk" @click="doVk"><IzIcon name="vk" />Войти через ВКонтакте</button>
        </template>
      </div>
    </div>

    <!-- Купить в один клик -->
    <div v-if="oneProduct" class="iz-shade iz-shade--center" @click.self="ui.oneClick.value = null">
      <div class="iz-modal" role="dialog" aria-label="Купить в один клик">
        <button type="button" class="iz-iconbtn iz-modal__close" aria-label="Закрыть" @click="ui.oneClick.value = null"><IzIcon name="close" /></button>
        <h2>Купить в один клик</h2>
        <div class="iz-modal__product">
          <img :src="oneProduct.img" alt="" width="72" height="54" />
          <span
            ><b>{{ oneProduct.title }}</b><small>{{ izPriceText(oneProduct) }}{{ oneProduct.unit === 'гол.' ? ` · от ${oneProduct.min} голов` : '' }}</small></span
          >
        </div>
        <p v-if="one.sent" class="iz-note iz-note--ok">
          Спасибо! Перезвоним в рабочее время ({{ izContacts.hours }}), уточним количество и как удобно получить. В концепте заявка никуда не ушла.
        </p>
        <form v-else class="iz-form" @submit.prevent="one.sent = true">
          <label>Имя<input v-model="one.name" required autocomplete="off" autofocus /></label>
          <label>Телефон<IzPhone v-model="one.phone" /></label>
          <button type="submit" class="iz-btn iz-btn--main iz-btn--wide">Жду звонка</button>
          <small class="iz-form__fine">Количество, вес и способ получения уточним по телефону.</small>
        </form>
      </div>
    </div>

    <Transition name="iz-fade">
      <div v-if="ui.toast.value" class="iz-toast" role="status">
        <IzIcon name="check" :size="18" />{{ ui.toast.value }}
        <NuxtLink v-if="ui.toast.value.includes('в корзине')" :to="izPath('/cart')">Корзина</NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.iz-body {
  background: #fff;
}
html.iz-html {
  scroll-padding-top: 100px;
  scroll-behavior: smooth;
}
html.iz-lock {
  overflow: hidden;
}

.iz {
  --iz-accent: #eda120;
  --iz-accent-hover: #df9312;
  --iz-ink-accent: #95590a;
  --iz-soft: #fdf1da;
  --iz-dark: #1f1d18;
  --iz-text: #3a3831;
  --iz-muted: #6e6b62;
  --iz-surface: #f3f4ef;
  --iz-line: #e3e2da;
  --iz-green: #3a7a2a;
  --iz-green-soft: #e8f2e2;
  --iz-red: #b0432a;
  --iz-r: 12px;
  --iz-R: 20px;
  --iz-head: 'Roboto Condensed', 'Roboto', system-ui, sans-serif;
  --iz-pop: 0 2px 6px rgba(31, 29, 24, 0.08), 0 22px 54px rgba(31, 29, 24, 0.22);
  min-height: 100vh;
  background: #fff;
  color: var(--iz-text);
  font-family: 'Roboto', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;

  @media (max-width: 768px) {
    padding-bottom: 64px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

:where(.iz) h1,
:where(.iz) h2,
:where(.iz) h3,
:where(.iz) p,
:where(.iz) figure,
:where(.iz) dl,
:where(.iz) dd {
  margin: 0;
}
:where(.iz) h1,
:where(.iz) h2,
:where(.iz) h3 {
  color: var(--iz-dark);
  font-family: var(--iz-head);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.005em;
}
:where(.iz) a {
  color: inherit;
  text-decoration: none;
}
:where(.iz) img {
  display: block;
  max-width: 100%;
}
:where(.iz) button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  border: 0;
  background: none;
  padding: 0;
}
:where(.iz) input,
:where(.iz) textarea,
:where(.iz) select {
  font: inherit;
  color: var(--iz-dark);
}
:where(.iz) ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.iz-wrap {
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

/* Баннер концепта */
.iz-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 12px;
  padding: 8px 16px;
  background: var(--iz-dark);
  color: #f3efe4;
  font-size: 13px;
  text-align: center;

  a {
    color: var(--iz-accent);
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

/* Кнопки */
.iz-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: var(--iz-r);
  font-weight: 500;
  font-size: 15px;
  white-space: nowrap;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;

  &--main {
    background: var(--iz-accent);
    color: var(--iz-dark);

    &:hover {
      background: var(--iz-accent-hover);
    }
  }
  &--line,
  &--line:focus,
  &--line:active {
    background: #fff;
    border: 1px solid var(--iz-line);
    color: var(--iz-dark);
  }
  &--line:hover {
    border-color: var(--iz-dark);
  }
  &--soft {
    background: var(--iz-soft);
    color: var(--iz-dark);
  }
  &--wide {
    width: 100%;
  }
}
.iz-link {
  color: var(--iz-ink-accent);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-align: left;
}
.iz-iconbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 42px;
  height: 42px;
  border-radius: var(--iz-r);
  color: var(--iz-dark);
  transition: background 0.15s;

  &:hover {
    background: var(--iz-surface);
  }
  i {
    position: absolute;
    top: 2px;
    right: 0;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--iz-accent);
    color: var(--iz-dark);
    font-size: 11px;
    font-weight: 700;
    font-style: normal;
    line-height: 18px;
    text-align: center;
  }
}

/* Метки, примечания */
.iz-tag {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 8px;
  background: #fff;
  color: var(--iz-dark);
  font-size: 12.5px;
  font-weight: 500;

  &--new {
    background: var(--iz-accent);
  }
  &--out {
    background: var(--iz-dark);
    color: #fff;
  }
  &--green {
    background: var(--iz-green-soft);
    color: var(--iz-green);
  }
}
.iz-note {
  padding: 12px 16px;
  border-radius: var(--iz-r);
  background: var(--iz-surface);
  font-size: 14px;

  &--ok {
    background: var(--iz-green-soft);
    color: #24521a;
  }
  &--warn {
    background: var(--iz-soft);
    color: #5f3c06;
  }
}

/* Шапка */
.iz-header {
  position: sticky;
  z-index: 40;
  background: #fff;
  border-bottom: 1px solid var(--iz-line);
}
.iz-strip {
  background: var(--iz-surface);
  font-size: 13.5px;

  &__row {
    display: flex;
    align-items: center;
    gap: 22px;
    min-height: 40px;
  }
  &__item,
  &__phone {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;

    .iz-icon {
      flex: none;
      color: var(--iz-ink-accent);
    }
  }
  &__short {
    display: none;
  }
  &__nav {
    display: flex;
    gap: 20px;
    margin-left: auto;

    a {
      white-space: nowrap;

      &:hover,
      &.router-link-exact-active {
        color: var(--iz-ink-accent);
      }
    }
  }
  &__phone {
    font-weight: 700;
    color: var(--iz-dark);
  }

  @media (max-width: 1400px) {
    &__where {
      display: none;
    }
  }
  @media (max-width: 1199px) {
    &__nav {
      display: none;
    }
    &__phone {
      margin-left: auto;
    }
  }
  @media (max-width: 768px) {
    &__hours {
      display: none;
    }
    &__row {
      gap: 12px;
    }
  }
  @media (max-width: 576px) {
    &__long {
      display: none;
    }
    &__short {
      display: inline;
    }
  }
}

.iz-bar {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 76px;

  &__burger {
    display: none;
  }
  &__icons {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: none;
  }
  &__searchbtn {
    display: none;
  }
  &__user span {
    font-size: 14px;
    max-width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__user {
    padding: 0 10px;
  }

  @media (max-width: 1199px) {
    gap: 12px;

    &__burger,
    &__searchbtn {
      display: inline-flex;
    }
    &__user span {
      display: none;
    }
    &__user {
      padding: 0;
    }
  }
  @media (max-width: 768px) {
    min-height: 64px;
    gap: 6px;

    &__cmp,
    &__user {
      display: none;
    }
  }
}

.iz-mark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex: none;
  color: var(--iz-dark);

  &__sign {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: var(--iz-accent);
    color: var(--iz-dark);
  }
  &__text {
    display: grid;
  }
  &__name {
    font-family: var(--iz-head);
    font-weight: 800;
    font-size: 23px;
    line-height: 1;
    letter-spacing: -0.01em;
  }
  &__sub {
    margin-top: 3px;
    color: var(--iz-muted);
    font-size: 12.5px;
    line-height: 1.1;
  }

  @media (max-width: 1199px) and (min-width: 990px) {
    &__sub {
      display: none;
    }
  }
  @media (max-width: 375px) {
    gap: 8px;

    &__sign {
      width: 36px;
      height: 36px;
      border-radius: 10px;
    }
    &__name {
      font-size: 20px;
    }
    &__sub {
      display: none;
    }
  }
}

/* Разделы с их иконками: жареная птица, цыплёнок в яйце, корова */
.iz-secs {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 16px;
  background: var(--iz-surface);

  &__item {
    position: relative;
  }
  &__link {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    padding: 0 10px 0 6px;
    border-radius: 12px;
    font-family: var(--iz-head);
    font-weight: 700;
    font-size: 16.5px;
    color: var(--iz-dark);
    white-space: nowrap;
    transition: background 0.15s;

    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #fff;
      object-fit: contain;
      padding: 3px;
    }
    &:hover,
    &.is-on {
      background: #fff;
    }
    &.is-on {
      box-shadow: inset 0 -3px 0 var(--iz-accent);
    }
  }
  &__drop {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: 5;
    display: none;
    grid-template-columns: 240px 220px;
    gap: 18px;
    padding: 18px;
    border: 1px solid var(--iz-line);
    border-radius: var(--iz-R);
    background: #fff;
    box-shadow: var(--iz-pop);

    &::before {
      content: '';
      position: absolute;
      inset: -10px 0 auto;
      height: 10px;
    }
  }
  &__item:hover &__drop,
  &__item:focus-within &__drop {
    display: grid;
  }
  &__list {
    display: grid;
    align-content: start;
    gap: 2px;
  }
  &__group {
    display: grid;

    a {
      padding: 6px 10px;
      border-radius: 8px;
      font-weight: 500;
      color: var(--iz-dark);

      &:hover {
        background: var(--iz-surface);
      }
    }
  }
  &__kid {
    padding-left: 24px !important;
    font-weight: 400 !important;
    color: var(--iz-text) !important;
  }
  &__all {
    display: grid;
    gap: 8px;
    align-content: start;
    font-weight: 500;

    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 14px;
    }
  }

  @media (max-width: 1400px) {
    &__link {
      font-size: 15.5px;
    }
  }
  @media (max-width: 1199px) {
    &__link {
      gap: 6px;
      height: 44px;
      padding: 0 8px 0 4px;
      font-size: 15px;

      img {
        width: 32px;
        height: 32px;
      }
    }
  }
  @media (max-width: 989px) {
    display: none;
  }
}

.iz-search {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;

  &__ico {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--iz-muted);
    pointer-events: none;
  }
  input {
    width: 100%;
    height: 48px;
    padding: 0 16px 0 44px;
    border: 1px solid var(--iz-line);
    border-radius: 14px;
    background: #fff;
    outline: none;
    transition: border-color 0.15s;

    &:focus {
      border-color: var(--iz-accent);
    }
  }
  &__drop {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: 6;
    min-width: 300px;
    padding: 8px;
    border: 1px solid var(--iz-line);
    border-radius: 16px;
    background: #fff;
    box-shadow: var(--iz-pop);
  }
  &__hit {
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding: 6px;
    border-radius: 10px;

    &:hover {
      background: var(--iz-surface);
    }
    img {
      width: 52px;
      height: 40px;
      object-fit: cover;
      border-radius: 8px;
    }
    span {
      display: grid;
      min-width: 0;
    }
    b {
      font-weight: 500;
      color: var(--iz-dark);
      line-height: 1.3;
    }
    small {
      color: var(--iz-muted);
      font-size: 13px;
    }
  }
  &__none {
    padding: 10px;
    font-size: 14px;
  }
  &__more {
    width: 100%;
    margin-top: 4px;
    padding: 10px;
    border-radius: 10px;
    color: var(--iz-ink-accent);
    font-weight: 500;

    &:hover {
      background: var(--iz-surface);
    }
  }

  @media (max-width: 1199px) {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    padding: 10px 20px 14px;
    background: #fff;
    border-bottom: 1px solid var(--iz-line);

    &.is-open {
      display: block;
    }
    &__ico {
      left: 34px;
      top: 34px;
    }
    &__drop {
      left: 20px;
      right: 20px;
      min-width: 0;
    }
  }
  @media (max-width: 375px) {
    padding: 10px 14px 14px;

    &__ico {
      left: 28px;
    }
    &__drop {
      left: 14px;
      right: 14px;
    }
  }
}
.iz-bar {
  position: relative;

  @media (max-width: 1199px) {
    .iz-bar__icons {
      margin-left: auto;
    }
  }
}

/* Кнопка корзины постоянной ширины: сумма не двигает шапку */
.iz-cartbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: 168px;
  height: 48px;
  padding: 0 14px;
  border-radius: 14px;
  background: var(--iz-surface);
  color: var(--iz-dark);
  transition: background 0.15s;

  &:hover {
    background: var(--iz-soft);
  }
  &.is-full {
    background: var(--iz-accent);

    &:hover {
      background: var(--iz-accent-hover);
    }
  }
  &__text {
    display: grid;
    line-height: 1.15;
    min-width: 0;

    b {
      font-weight: 700;
      white-space: nowrap;
    }
    small {
      font-size: 12px;
      white-space: nowrap;
    }
  }
  &__badge {
    display: none;
  }

  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
    padding: 0;
    justify-content: center;
    border-radius: var(--iz-r);
    background: none;

    &.is-full {
      background: none;
    }
    &__text {
      display: none;
    }
    &__badge {
      position: absolute;
      top: 2px;
      right: 0;
      display: block;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      border-radius: 9px;
      background: var(--iz-accent);
      font-size: 11px;
      font-weight: 700;
      font-style: normal;
      line-height: 18px;
      text-align: center;
    }
  }
}

/* Карточка «бирка фермы» */
.iz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 22px;

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  @media (max-width: 375px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.iz-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--iz-R);
  background: #fff;
  border: 1px solid var(--iz-line);
  overflow: hidden;

  &__photo {
    position: relative;
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--iz-surface);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    &:hover img {
      transform: scale(1.04);
    }
  }
  &.is-out &__photo img {
    filter: saturate(0.55);
    opacity: 0.85;
  }
  &__tags {
    position: absolute;
    left: 12px;
    top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  &__cmp {
    position: absolute;
    right: 10px;
    top: 10px;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 11px;
    background: rgba(255, 255, 255, 0.92);
    color: var(--iz-dark);

    &:hover {
      background: #fff;
    }
    &.is-on {
      background: var(--iz-accent);
    }
  }
  &__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 14px 16px 16px;
  }
  &__group {
    color: var(--iz-muted);
    font-size: 13px;
  }
  &__title {
    margin-top: 2px;
    font-family: var(--iz-head);
    font-weight: 700;
    font-size: 19px;
    line-height: 1.2;
    color: var(--iz-dark);

    &:hover {
      color: var(--iz-ink-accent);
    }
  }
  ul.iz-card__facts {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 6px;
    margin-top: 10px;

    li {
      padding: 3px 9px;
      border-radius: 8px;
      background: var(--iz-surface);
      font-size: 13px;
      white-space: nowrap;
    }
  }
  &__foot {
    display: grid;
    gap: 12px;
    margin-top: auto;
    padding-top: 14px;
  }
  &__price {
    display: grid;

    b {
      font-family: var(--iz-head);
      font-weight: 800;
      font-size: 24px;
      line-height: 1.1;
      color: var(--iz-dark);

      small {
        font-size: 15px;
        font-weight: 600;
        color: var(--iz-muted);
      }
      &.is-ask {
        font-size: 19px;
      }
    }
    span {
      color: var(--iz-muted);
      font-size: 13.5px;
    }
  }
  &__buy {
    width: 100%;
  }
  .iz-qty {
    width: 100%;
  }

  @media (max-width: 576px) {
    &__body {
      padding: 12px 12px 14px;
    }
    &__title {
      font-size: 17px;
    }
    ul.iz-card__facts li {
      white-space: normal;
    }
    &__price b {
      font-size: 21px;
    }
    &__price b.is-ask {
      font-size: 17px;
    }
    &__cmp {
      width: 34px;
      height: 34px;
    }
    .iz-btn {
      padding: 0 10px;
    }
  }
  @media (min-width: 376px) and (max-width: 576px) {
    &__tags .iz-tag {
      height: 22px;
      padding: 0 7px;
      font-size: 11.5px;
    }
  }

  /* строка списка в каталоге */
  &--row {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);

    .iz-card__photo {
      aspect-ratio: auto;
      height: 100%;
      min-height: 170px;
    }
    .iz-card__foot {
      grid-template-columns: minmax(0, 1fr) 210px;
      align-items: end;
    }

    @media (max-width: 768px) {
      grid-template-columns: 140px minmax(0, 1fr);

      .iz-card__foot {
        grid-template-columns: minmax(0, 1fr);
      }
    }
    @media (max-width: 375px) {
      grid-template-columns: 110px minmax(0, 1fr);
    }
  }
}

/* Счётчик */
.iz-qty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  padding: 0 4px;
  border-radius: var(--iz-r);
  background: var(--iz-soft);

  &__btn {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 9px;
    color: var(--iz-dark);

    &:hover {
      background: #fff;
    }
  }
  &__val {
    display: flex;
    align-items: baseline;
    justify-content: center;
    font-weight: 700;
    color: var(--iz-dark);

    input {
      min-width: 1.6ch;
      border: 0;
      padding: 0;
      background: none;
      text-align: center;
      font-weight: 700;
      outline: none;
    }
    span {
      padding: 0 6px;
      font-weight: 400;
      font-size: 14px;
      color: var(--iz-text);
    }
  }
  &--big {
    height: 52px;
  }
}

/* Заголовки секций */
.iz-sec {
  padding-top: 64px;
  padding-bottom: 0;

  @media (max-width: 768px) {
    padding-top: 44px;
  }
}
.iz-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;

  h2 {
    font-size: clamp(26px, 3vw, 36px);
  }
  p {
    margin-top: 8px;
    max-width: 640px;
    color: var(--iz-muted);
  }
  &__more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--iz-ink-accent);
    font-weight: 500;
    white-space: nowrap;
  }
}
.iz-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  padding-top: 22px;
  color: var(--iz-muted);
  font-size: 13.5px;

  a:hover {
    color: var(--iz-ink-accent);
  }
  span::before {
    content: '/';
    margin-right: 8px;
  }
}
.iz-page-title {
  margin-top: 10px;
  font-size: clamp(30px, 4vw, 46px);
}

/* Формы */
.iz-form {
  display: grid;
  gap: 14px;

  label {
    display: grid;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    color: var(--iz-dark);

    small {
      font-weight: 400;
      color: var(--iz-muted);
    }
  }
  input:not([type='checkbox']):not([type='radio']),
  textarea,
  select {
    width: 100%;
    min-height: 48px;
    padding: 10px 14px;
    border: 1px solid var(--iz-line);
    border-radius: var(--iz-r);
    background: #fff;
    font-weight: 400;
    outline: none;

    &:focus {
      border-color: var(--iz-accent);
    }
  }
  textarea {
    min-height: 110px;
    resize: vertical;
  }
  &__fine {
    color: var(--iz-muted);
    font-size: 13px;
  }
}
.iz-check {
  display: flex !important;
  align-items: flex-start;
  gap: 10px !important;
  font-weight: 400 !important;

  input {
    width: 18px;
    height: 18px;
    margin: 2px 0 0;
    accent-color: var(--iz-accent);
  }
}
.iz-seg {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: var(--iz-surface);

  button {
    flex: 1;
    height: 40px;
    padding: 0 14px;
    border-radius: 10px;
    font-weight: 500;
    white-space: nowrap;

    &.is-on {
      background: #fff;
      color: var(--iz-dark);
      box-shadow: 0 1px 3px rgba(31, 29, 24, 0.12);
    }
  }
}
.iz-stars {
  display: inline-flex;
  gap: 2px;
  color: #d9d6cb;

  button,
  span {
    display: grid;
    color: inherit;
  }
  .is-on {
    color: var(--iz-accent);
  }
}

/* Подвал */
.iz-footer {
  margin-top: 80px;
  padding-top: 52px;
  background: var(--iz-surface);

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) repeat(3, minmax(0, 1fr));
    gap: 32px;
    padding-bottom: 40px;

    h3 {
      margin-bottom: 14px;
      font-size: 18px;
    }
  }
  &__about {
    display: grid;
    gap: 16px;
    align-content: start;

    p {
      max-width: 420px;
      color: var(--iz-muted);
    }
  }
  &__sub {
    display: grid;
    gap: 8px;
    max-width: 440px;

    label {
      font-weight: 500;
      color: var(--iz-dark);
    }
    div {
      display: flex;
      gap: 8px;
    }
    input {
      flex: 1;
      width: 0;
      min-height: 46px;
      padding: 0 14px;
      border: 1px solid var(--iz-line);
      border-radius: var(--iz-r);
      background: #fff;
      outline: none;

      &:focus {
        border-color: var(--iz-accent);
      }
    }
  }
  ul.iz-footer__links {
    display: grid;
    gap: 8px;

    a:hover {
      color: var(--iz-ink-accent);
    }
  }
  &__contacts a {
    font-weight: 500;
    color: var(--iz-dark);
  }
  &__legal {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px 24px;
    padding-top: 18px;
    padding-bottom: 22px;
    border-top: 1px solid var(--iz-line);
    color: var(--iz-muted);
    font-size: 13px;

    a {
      text-decoration: underline;
    }
  }

  @media (max-width: 1199px) {
    &__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    &__about {
      grid-column: 1 / -1;
    }
  }
  @media (max-width: 768px) {
    margin-top: 56px;

    &__grid {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
    &__grid > div:last-child {
      grid-column: 1 / -1;
    }
  }
  @media (max-width: 375px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
    &__sub div {
      flex-direction: column;
    }
    &__sub input {
      width: 100%;
    }
  }
}

/* Таббар */
.iz-tabbar {
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 45;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    height: 64px;
    padding: 0 6px env(safe-area-inset-bottom);
    background: #fff;
    border-top: 1px solid var(--iz-line);

    a {
      position: relative;
      display: grid;
      justify-items: center;
      align-content: center;
      gap: 2px;
      color: var(--iz-text);
      font-size: 12px;

      span {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &.router-link-exact-active {
        color: var(--iz-ink-accent);
      }
      i {
        position: absolute;
        top: 6px;
        left: calc(50% + 6px);
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        border-radius: 9px;
        background: var(--iz-accent);
        color: var(--iz-dark);
        font-size: 11px;
        font-weight: 700;
        font-style: normal;
        line-height: 18px;
        text-align: center;
      }
    }
    &__cart.is-full span {
      font-weight: 700;
      color: var(--iz-dark);
    }
  }
}

/* Меню, модалки */
.iz-shade {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(31, 29, 24, 0.45);

  &--center {
    display: grid;
    place-items: center;
    padding: 16px;
    overflow-y: auto;
  }
}
.iz-drawer {
  width: min(380px, 88vw);
  height: 100%;
  overflow-y: auto;
  padding: 14px 18px 28px;
  background: #fff;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    b {
      font-family: var(--iz-head);
      font-size: 22px;
      color: var(--iz-dark);
    }
  }
  &__sec {
    border-bottom: 1px solid var(--iz-line);

    &.is-open .iz-icon {
      transform: rotate(180deg);
    }
  }
  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 56px;

    a {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
      color: var(--iz-dark);
    }
    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: contain;
    }
  }
  &__groups {
    display: grid;
    padding: 0 0 12px 42px;

    a {
      padding: 6px 0;
    }
    .is-kid {
      padding-left: 14px;
      color: var(--iz-muted);
    }
  }
  &__pages {
    display: grid;
    padding: 12px 0;

    a,
    button {
      padding: 9px 0;
      text-align: left;
      font-weight: 500;
      color: var(--iz-dark);
    }
  }
  &__contacts {
    display: grid;
    gap: 10px;
    padding: 16px;
    border-radius: var(--iz-R);
    background: var(--iz-surface);

    a,
    span {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    a {
      font-weight: 700;
      color: var(--iz-dark);
    }
  }
}
.iz-modal {
  position: relative;
  display: grid;
  gap: 16px;
  width: min(440px, 100%);
  padding: 28px;
  border-radius: var(--iz-R);
  background: #fff;
  box-shadow: var(--iz-pop);

  h2 {
    font-size: 26px;
    padding-right: 40px;
  }
  &__close {
    position: absolute;
    right: 12px;
    top: 12px;
  }
  /* у окна входа заголовка нет — крестик встаёт в строку переключателя «Вход / Регистрация», а не на него */
  &__close + .iz-seg {
    margin-right: 46px;
  }
  &:has(> .iz-modal__close + .iz-seg) .iz-modal__close {
    top: 31px;

    @media (max-width: 375px) {
      top: 25px;
    }
  }
  &__lead {
    color: var(--iz-muted);
  }
  &__actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  &__product {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border-radius: 14px;
    background: var(--iz-surface);

    img {
      width: 72px;
      height: 54px;
      object-fit: cover;
      border-radius: 10px;
    }
    span {
      display: grid;
    }
    b {
      font-weight: 500;
      color: var(--iz-dark);
    }
    small {
      color: var(--iz-muted);
    }
  }
  &__vk {
    gap: 10px;
  }

  @media (max-width: 375px) {
    padding: 22px 16px;
  }
}

.iz-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 70;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: calc(100vw - 32px);
  padding: 12px 18px;
  border-radius: 14px;
  background: var(--iz-dark);
  color: #fff;
  font-size: 14px;
  transform: translateX(-50%);
  box-shadow: var(--iz-pop);

  .iz-icon {
    flex: none;
    color: var(--iz-accent);
  }
  a {
    margin-left: 6px;
    color: var(--iz-accent);
    font-weight: 500;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    bottom: 76px;
  }
}
/* Общие блоки страниц: CSS дочерней страницы грузится только с ней */
.iz-ways {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
}
.iz-way {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  align-content: start;
  gap: 8px 16px;
  padding: 24px;
  border-radius: var(--iz-R);
  border: 1px solid var(--iz-line);

  &__icon {
    grid-row: span 3;
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: var(--iz-surface);
    color: var(--iz-ink-accent);
  }
  h3 {
    font-size: 20px;
  }
  b {
    font-family: var(--iz-head);
    font-size: 18px;
    color: var(--iz-dark);

    &.is-free {
      color: var(--iz-green);
    }
  }
  p {
    color: var(--iz-text);
    font-size: 14.5px;
  }

  @media (max-width: 375px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 20px 16px;

    &__icon {
      grid-row: auto;
      width: 48px;
      height: 48px;
    }
  }
}
.iz-reviews {
  &__list {
    display: grid;
    gap: 12px;
  }
  &__empty {
    color: var(--iz-muted);
  }
  &__form {
    max-width: 560px;
    padding: 22px;
    border-radius: var(--iz-R);
    background: var(--iz-surface);

    > b {
      font-family: var(--iz-head);
      font-size: 20px;
      color: var(--iz-dark);
    }
    .iz-btn {
      justify-self: start;
    }
  }
}
.iz-review {
  display: grid;
  gap: 8px;
  padding: 18px;
  border-radius: var(--iz-R);
  border: 1px solid var(--iz-line);

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 12px;

    b {
      color: var(--iz-dark);
    }
    small {
      color: var(--iz-muted);
    }
  }
}
.iz-empty,
.iz-done {
  display: grid;
  justify-items: start;
  gap: 14px;
  max-width: 720px;
  margin-top: 24px;
  padding: 32px;
  border-radius: var(--iz-R);
  background: var(--iz-surface);

  b {
    font-family: var(--iz-head);
    font-size: 24px;
    color: var(--iz-dark);
  }
  div {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  @media (max-width: 576px) {
    padding: 22px 16px;
  }
}
/* Карта: место держит обёртка — если блокировщик спрячет iframe, останется метка и ссылка */
.iz-map {
  position: relative;
  min-height: 360px;
  border-radius: var(--iz-R);
  overflow: hidden;
  background: var(--iz-surface);

  &__pin {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 6px;
    padding: 20px;
    color: var(--iz-dark);
    font-weight: 500;
    text-align: center;

    .iz-icon {
      color: var(--iz-ink-accent);
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
    left: 14px;
    bottom: 14px;
    padding: 8px 14px;
    border-radius: 10px;
    background: #fff;
    font-weight: 500;
    font-size: 14px;
    color: var(--iz-dark);
    box-shadow: 0 4px 14px rgba(31, 29, 24, 0.16);
  }

  @media (max-width: 576px) {
    min-height: 280px;
  }
}
.iz-page-title small {
  font-size: 0.5em;
  color: var(--iz-muted);
  font-weight: 600;
}

.iz-fade-enter-active,
.iz-fade-leave-active {
  transition: opacity 0.2s;
}
.iz-fade-enter-from,
.iz-fade-leave-to {
  opacity: 0;
}
</style>
