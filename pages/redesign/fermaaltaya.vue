<script lang="ts" setup>
import FaIcon from '~/components/redesign/fermaaltaya/FaIcon.vue'
import FaMask from '~/components/redesign/fermaaltaya/FaMask.vue'
import FaPhone from '~/components/redesign/fermaaltaya/FaPhone.vue'
import FaStrokes from '~/components/redesign/fermaaltaya/FaStrokes.vue'

const route = useRoute()
const router = useRouter()
const cart = useFermaAltaya()
const ui = useFaUi()
const now = useFaNow()

useSeoMeta({
  title: 'Ферма Алтая — фермерские продукты с доставкой в Новосибирск и Барнаул | Концепт редизайна',
  description:
    'Концепт редизайна ferma-altaya.ru: молоко, творог, мясо, пельмени и супы с фермы в Первомайском районе Алтайского края. Неделя доставки с отсчётом до конца приёма, весовой товар с суммой «≈ за упаковку», бонусы 2 %.',
  ogTitle: 'Ферма Алтая — концепт редизайна',
  ogDescription: 'Фермерские продукты с бесплатной доставкой в Новосибирск и Барнаул: 181 товар, живая неделя доставки, корзина с весовым товаром и бонусами.',
  ogImage: 'https://andryushov.me/redesign/fermaaltaya/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'fa-html', lang: 'ru' },
  bodyAttrs: { class: 'fa-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;500;700;800&display=swap' },
  ],
})

const pages = [
  { to: '/dostavka', label: 'Доставка и оплата' },
  { to: '/dostavka#bonusy', label: 'Бонусы' },
  { to: '/o-ferme', label: 'О ферме' },
  { to: '/magaziny', label: 'Мы в магазинах' },
  { to: '/otzyvy', label: 'Отзывы' },
  { to: '/novosti', label: 'Новости' },
  { to: '/kontakty', label: 'Контакты' },
]
const pageTo = (to: string) => {
  const [path, hash] = to.split('#')
  return { path: faPath(path), hash: hash ? `#${hash}` : undefined }
}
const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`
const year = new Date().getFullYear()

// Ближайший привоз для полосы шапки
const wave = computed(() => faWaves(new Date(now.value), 1)[0])
const wd = computed(() => faWaveDays(wave.value))

// Город: Новосибирск или Барнаул — меняет подписи доставки и выбор в корзине
const cityOpen = ref(false)
const setCity = (c: FaCity) => {
  cart.city.value = c
  cityOpen.value = false
}

// Липкая шапка: полоса с доставкой уезжает; на телефоне уезжает и строка со знаком — у верха остаётся поиск
const strip = ref<HTMLElement | null>(null)
const bar = ref<HTMLElement | null>(null)
const stick = ref(0)
const measure = () => {
  const mobile = window.matchMedia('(max-width: 768px)').matches
  stick.value = (strip.value?.offsetHeight ?? 0) + (mobile ? (bar.value?.offsetHeight ?? 0) : 0)
}

// Поиск с подсказками: фото, раздел и цена; Enter — каталог с запросом
const q = ref('')
const searchFocus = ref(false)
const hits = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (s.length < 2) return []
  return faProducts.filter((p) => p.title.toLowerCase().includes(s) || faSection(p.sec)?.title.toLowerCase().includes(s)).slice(0, 6)
})
const goSearch = () => {
  router.push({ path: faPath('/catalog'), query: q.value.trim() ? { q: q.value.trim() } : {} })
  searchFocus.value = false
  ;(document.activeElement as HTMLElement | null)?.blur()
}
const blurSearch = () => setTimeout(() => (searchFocus.value = false), 160)
const popular = ['Творог', 'Пельмени', 'Молоко', 'Говядина', 'Сырники']
const pickPopular = (s: string) => {
  q.value = s
  goSearch()
}

// Каталог-панель: открывается по кнопке, закрывается по выбору раздела и клику мимо
const toggleCatalog = () => {
  ui.catalog.value = !ui.catalog.value
}
const secOf = (id: string) => faSection(id)!
const isSec = (id: string) => route.params.section === id || faProduct(String(route.params.id ?? ''))?.sec === id

// Вход и регистрация — демо: имя запоминается в браузере, на счёт кладём демо-баллы, чтобы показать оплату баллами
const auth = reactive({ email: '', pass: '', name: '', phone: '', address: '', agree: false, sent: false })
const signIn = (name: string, email = '') => {
  cart.user.value = { name, email, phone: auth.phone, balance: 120 }
  ui.login.value = false
  ui.toast.value = 'Вы вошли — демо, на счёте 120 баллов для примера'
}
const doLogin = () => signIn(auth.email.split('@')[0] || 'Покупатель', auth.email)
const doRegister = () => signIn(auth.name || 'Покупатель', auth.email)
const doYandex = () => signIn('Гость Яндекса')
const doForgot = () => {
  auth.sent = true
}

// «Перезвоните мне»
const cb = reactive({ name: '', phone: '', email: '', topic: 'Вопрос по заказу', agree: false, human: false, sent: false })
watch(
  () => ui.callback.value,
  () => {
    cb.sent = false
  },
)

// Подписка в подвале
const sub = reactive({ name: '', email: '', agree: false })
const subscribe = () => {
  if (!sub.email.includes('@') || !sub.agree) return
  ui.toast.value = 'Подписка оформлена — в концепте письма не приходят'
  sub.email = ''
  sub.name = ''
}

const share = async () => {
  try {
    await navigator.clipboard.writeText(location.href)
    ui.toast.value = 'Ссылка скопирована'
  } catch {
    ui.toast.value = location.href
  }
}
provide('fa-share', share)

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
  ui.callback.value = false
  ui.catalog.value = false
  cityOpen.value = false
}
const onDoc = (e: MouseEvent) => {
  const t = e.target as HTMLElement
  if (ui.catalog.value && !t.closest('.fa-catpanel') && !t.closest('.fa-catbtn')) ui.catalog.value = false
  if (cityOpen.value && !t.closest('.fa-city')) cityOpen.value = false
}
const locked = computed(() => ui.menu.value || !!ui.login.value || ui.callback.value)
watch([() => ui.login.value, () => ui.callback.value], () =>
  nextTick(() => document.querySelector<HTMLInputElement>('.fa-modal form input')?.focus()),
)
watch(locked, (v) => document.documentElement.classList.toggle('fa-lock', v))
watch(
  () => cart.dark.value,
  (v) => document.documentElement.classList.toggle('fa-dark-html', v),
)
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    ui.catalog.value = false
  },
)

let tick: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  cart.persist()
  // ?shot — чистый кадр для og-картинки и скриншота к письму, без cookie-плашки
  if (route.query.shot !== undefined) cart.cookie.value = true
  now.value = Date.now()
  tick = setInterval(() => (now.value = Date.now()), 30000)
  document.documentElement.classList.toggle('fa-dark-html', cart.dark.value)
  measure()
  window.addEventListener('resize', measure)
  document.addEventListener('keydown', onKey)
  document.addEventListener('click', onDoc)
})
onBeforeUnmount(() => {
  clearInterval(tick)
  window.removeEventListener('resize', measure)
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('click', onDoc)
  document.documentElement.classList.remove('fa-lock', 'fa-dark-html')
})
</script>

<template>
  <div class="fa" :class="{ 'fa--dark': cart.dark.value }">
    <div class="fa-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="FA_ORIGIN" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="fa-header" :style="{ top: `${-stick}px` }">
      <div ref="strip" class="fa-strip">
        <div class="fa-wrap fa-strip__row">
          <div class="fa-city">
            <button type="button" class="fa-city__btn" :aria-expanded="cityOpen" @click="cityOpen = !cityOpen">
              <FaIcon name="pin" :size="16" />{{ faCities[cart.city.value].title }}<FaIcon name="down" :size="14" />
            </button>
            <div v-if="cityOpen" class="fa-city__drop">
              <button
                v-for="(c, k) in faCities"
                :key="k"
                type="button"
                :class="{ 'is-on': cart.city.value === k }"
                @click="setCity(k as FaCity)"
              >
                <b>{{ c.title }}</b><span>{{ c.area }}</span>
              </button>
            </div>
          </div>
          <NuxtLink :to="faPath('/dostavka')" class="fa-strip__item fa-strip__wave">
            <FaIcon name="truck" :size="17" />
            <span class="fa-strip__long"
              >Привезём в {{ wd.days }}, {{ wd.dates }} — заказ до 12:00 {{ faDayGen(wave.deadline) }}</span
            ><span class="fa-strip__short">Привоз {{ wd.days }}, {{ wd.dates }}</span>
          </NuxtLink>
          <span class="fa-strip__item fa-strip__min"><FaIcon name="bag" :size="16" />Мин. заказ {{ faMoney(FA_MIN) }}, доставка бесплатно</span>
          <span class="fa-strip__item fa-strip__hours"><FaIcon name="clock" :size="16" />{{ FA_HOURS }}</span>
          <button type="button" class="fa-strip__cb" @click="ui.callback.value = true">Перезвоните мне</button>
          <a :href="tel(FA_PHONE)" class="fa-strip__phone"><FaIcon name="phone" :size="16" />{{ FA_PHONE }}</a>
        </div>
      </div>

      <div ref="bar" class="fa-wrap fa-bar">
        <button type="button" class="fa-iconbtn fa-bar__burger" aria-label="Меню" @click="ui.menu.value = true"><FaIcon name="menu" /></button>
        <NuxtLink :to="faPath()" class="fa-logo" aria-label="Ферма Алтая, на главную">
          <img :src="faLocal('logo.png')" alt="Ферма Алтая" width="340" height="181" />
        </NuxtLink>
        <button type="button" class="fa-iconbtn fa-bar__theme" :aria-label="cart.dark.value ? 'Светлая тема' : 'Тёмная тема'" @click="cart.dark.value = !cart.dark.value">
          <FaIcon :name="cart.dark.value ? 'bulb' : 'moon'" />
        </button>
        <a :href="tel(FA_PHONE)" class="fa-iconbtn fa-bar__call" aria-label="Позвонить"><FaIcon name="phone" /></a>
      </div>

      <div class="fa-searchrow">
        <div class="fa-wrap fa-searchrow__in">
          <NuxtLink :to="faPath()" class="fa-logo fa-logo--desk" aria-label="Ферма Алтая, на главную">
            <img :src="faLocal('logo.png')" alt="Ферма Алтая" width="340" height="181" />
          </NuxtLink>
          <button type="button" class="fa-catbtn" :class="{ 'is-open': ui.catalog.value }" :aria-expanded="ui.catalog.value" @click="toggleCatalog">
            <FaIcon :name="ui.catalog.value ? 'close' : 'grid'" :size="20" /><span>Каталог</span>
          </button>
          <form class="fa-search" role="search" @submit.prevent="goSearch">
            <FaIcon name="search" :size="20" />
            <input
              v-model="q"
              type="search"
              placeholder="Творог, пельмени, шея свиная…"
              aria-label="Поиск по каталогу"
              @focus="searchFocus = true"
              @blur="blurSearch"
            />
            <button type="submit" class="fa-search__go">Найти</button>
            <div v-if="searchFocus && (hits.length || q.trim().length < 2)" class="fa-search__drop">
              <template v-if="hits.length">
                <NuxtLink v-for="p in hits" :key="p.id" :to="faPath(`/product/${p.id}`)" class="fa-search__hit">
                  <img :src="faImg(p.img)" alt="" width="44" height="44" />
                  <span class="fa-search__t">
                    <b>{{ p.title }}</b><small>{{ secOf(p.sec).title }}</small>
                  </span>
                  <span class="fa-search__p">{{ faMoney(p.price) }}</span>
                </NuxtLink>
                <button type="button" class="fa-search__all" @mousedown.prevent="goSearch">Все результаты</button>
              </template>
              <div v-else class="fa-search__pop">
                <span>Часто ищут</span>
                <button v-for="s in popular" :key="s" type="button" @mousedown.prevent="pickPopular(s)">{{ s }}</button>
              </div>
            </div>
          </form>
          <div class="fa-acts">
            <button
              type="button"
              class="fa-act fa-act--theme"
              :aria-label="cart.dark.value ? 'Светлая тема' : 'Тёмная тема'"
              :title="cart.dark.value ? 'Светлая тема' : 'Тёмная тема'"
              @click="cart.dark.value = !cart.dark.value"
            >
              <FaIcon :name="cart.dark.value ? 'bulb' : 'moon'" />
            </button>
            <NuxtLink v-if="cart.user.value" :to="faPath('/kabinet')" class="fa-act">
              <FaIcon name="user" /><span class="fa-act__l">{{ cart.user.value.balance }} баллов</span>
            </NuxtLink>
            <button v-else type="button" class="fa-act" @click="ui.login.value = 'login'">
              <FaIcon name="user" /><span class="fa-act__l">Войти</span>
            </button>
            <NuxtLink :to="faPath('/izbrannoe')" class="fa-act">
              <FaIcon name="heart" /><span class="fa-act__l">Избранное</span>
              <i v-if="cart.fav.value.length" class="fa-act__n">{{ cart.fav.value.length }}</i>
            </NuxtLink>
            <NuxtLink :to="faPath('/cart')" class="fa-cartbtn" :class="{ 'is-full': cart.count.value }">
              <FaIcon name="bag" />
              <span class="fa-cartbtn__l">{{
                cart.count.value ? `${cart.weighed.value ? 'до ' : ''}${faMoney(cart.headerSum.value)}` : 'Корзина'
              }}</span>
              <i v-if="cart.count.value" class="fa-act__n">{{ cart.count.value }}</i>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-if="ui.catalog.value" class="fa-catpanel">
        <div class="fa-wrap fa-catpanel__in">
          <div v-for="g in faGroups" :key="g.id" class="fa-catpanel__group">
            <b class="fa-catpanel__gt">{{ g.title }}</b>
            <NuxtLink v-for="id in g.secs" :key="id" :to="faPath(`/catalog/${id}`)" class="fa-catpanel__sec" :class="{ 'is-on': isSec(id) }">
              <span class="fa-catpanel__ic"><FaMask :sec="id" :size="24" /></span>
              <span>{{ secOf(id).title }}</span>
              <small>{{ secOf(id).count }}</small>
            </NuxtLink>
          </div>
          <div class="fa-catpanel__foot">
            <NuxtLink :to="faPath('/catalog')"><FaIcon name="list" :size="18" />Весь каталог · {{ faProducts.length }} товар</NuxtLink>
            <NuxtLink :to="{ path: faPath('/catalog'), query: { f: 'new' } }">Новинки</NuxtLink>
            <NuxtLink :to="{ path: faPath('/catalog'), query: { f: 'sale' } }">Снижена цена</NuxtLink>
            <NuxtLink :to="{ path: faPath('/catalog'), query: { f: 'hit' } }">Хиты</NuxtLink>
          </div>
        </div>
      </div>

      <nav class="fa-pages" aria-label="Страницы">
        <div class="fa-wrap fa-pages__in">
          <NuxtLink v-for="p in pages" :key="p.to" :to="pageTo(p.to)">{{ p.label }}</NuxtLink>
          <a :href="FA_B2B" target="_blank" rel="noopener" class="fa-pages__b2b">Для магазинов<FaIcon name="ext" :size="14" /></a>
        </div>
      </nav>
    </header>

    <main class="fa-main">
      <NuxtPage />
    </main>

    <footer class="fa-foot">
      <FaStrokes />
      <div class="fa-foot__body">
        <div class="fa-wrap fa-foot__grid">
          <div class="fa-foot__brand">
            <img :src="faLocal('logo.png')" alt="Ферма Алтая" width="340" height="181" />
            <p>Честные продукты для вашей семьи — со своей фермы в Первомайском районе Алтайского края.</p>
            <a :href="tel(FA_PHONE)" class="fa-foot__phone">{{ FA_PHONE }}</a>
            <a :href="`mailto:${FA_EMAIL}`">{{ FA_EMAIL }}</a>
            <span>{{ FA_HOURS }} (время новосибирское)</span>
            <div class="fa-foot__btns">
              <button type="button" class="fa-btn fa-btn--line fa-btn--sm" @click="ui.callback.value = true">
                <FaIcon name="phone" :size="16" />Перезвоните мне
              </button>
              <a :href="FA_MAX" target="_blank" rel="noopener" class="fa-btn fa-btn--line fa-btn--sm"><FaIcon name="max" :size="16" />Канал в MAX</a>
            </div>
          </div>
          <nav class="fa-foot__col" aria-label="Каталог">
            <b>Каталог</b>
            <NuxtLink v-for="id in ['moloko', 'govyadina', 'svinina', 'polufabrikaty', 'supy', 'hleb', 'ovoschi']" :key="id" :to="faPath(`/catalog/${id}`)">{{
              secOf(id).title
            }}</NuxtLink>
            <NuxtLink :to="faPath('/catalog')">Все разделы</NuxtLink>
          </nav>
          <nav class="fa-foot__col" aria-label="Покупателям">
            <b>Покупателям</b>
            <NuxtLink :to="faPath('/dostavka')">Доставка и оплата</NuxtLink>
            <NuxtLink :to="pageTo('/dostavka#bonusy')">Бонусная программа</NuxtLink>
            <NuxtLink :to="faPath('/otzyvy')">Отзывы</NuxtLink>
            <NuxtLink :to="faPath('/novosti')">Новости</NuxtLink>
            <NuxtLink :to="pageTo('/o-ferme#recepty')">Рецепты от фермы</NuxtLink>
            <NuxtLink :to="pageTo('/o-ferme#deklaratsii')">Декларации</NuxtLink>
            <NuxtLink :to="faPath('/kabinet')">Личный кабинет</NuxtLink>
          </nav>
          <nav class="fa-foot__col" aria-label="Ферма">
            <b>Ферма</b>
            <NuxtLink :to="faPath('/o-ferme')">О ферме</NuxtLink>
            <NuxtLink :to="faPath('/magaziny')">Мы в магазинах</NuxtLink>
            <a :href="FA_B2B" target="_blank" rel="noopener">Для магазинов (опт)</a>
            <NuxtLink :to="pageTo('/o-ferme#vakansii')">Вакансии</NuxtLink>
            <NuxtLink :to="faPath('/kontakty')">Контакты</NuxtLink>
          </nav>
          <form class="fa-foot__sub" @submit.prevent="subscribe">
            <b>Новости и акции на почту</b>
            <input v-model="sub.name" type="text" placeholder="Имя" autocomplete="given-name" />
            <input v-model="sub.email" type="email" placeholder="Эл. почта" autocomplete="email" required />
            <label class="fa-check"><input v-model="sub.agree" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
            <button type="submit" class="fa-btn fa-btn--main">Подписаться</button>
          </form>
        </div>
        <div class="fa-wrap fa-foot__bottom">
          <span>© {{ year }} ООО «КФХ «Яромакс» · ИНН 2263028539</span>
          <span>Тексты, цены и изображения принадлежат владельцу ferma-altaya.ru и показаны в концепте для примера.</span>
          <button type="button" class="fa-foot__theme" @click="cart.dark.value = !cart.dark.value">
            <FaIcon :name="cart.dark.value ? 'bulb' : 'moon'" :size="16" />{{ cart.dark.value ? 'Светлая тема' : 'Тёмная тема' }}
          </button>
        </div>
      </div>
    </footer>

    <nav class="fa-tabbar" aria-label="Быстрые ссылки">
      <NuxtLink :to="faPath()" :class="{ 'is-on': route.path === faPath() }"><FaIcon name="home" /><span>Главная</span></NuxtLink>
      <NuxtLink :to="faPath('/catalog')" :class="{ 'is-on': route.path.includes('/catalog') || route.path.includes('/product') }">
        <FaIcon name="grid" /><span>Каталог</span>
      </NuxtLink>
      <NuxtLink :to="faPath('/izbrannoe')" :class="{ 'is-on': route.path.includes('/izbrannoe') }">
        <FaIcon name="heart" /><span>Избранное</span><i v-if="cart.fav.value.length" class="fa-act__n">{{ cart.fav.value.length }}</i>
      </NuxtLink>
      <NuxtLink :to="faPath('/cart')" class="fa-tabbar__cart" :class="{ 'is-on': route.path.includes('/cart') }">
        <FaIcon name="bag" /><span>{{ cart.count.value ? `${cart.weighed.value ? 'до ' : ''}${faMoney(cart.headerSum.value)}` : 'Корзина' }}</span>
        <i v-if="cart.count.value" class="fa-act__n">{{ cart.count.value }}</i>
      </NuxtLink>
    </nav>

    <Transition name="fa-fade">
      <div v-if="ui.menu.value" class="fa-overlay" @click.self="ui.menu.value = false">
        <aside class="fa-drawer" aria-label="Меню">
          <div class="fa-drawer__head">
            <b>Меню</b>
            <button type="button" class="fa-iconbtn" aria-label="Закрыть меню" @click="ui.menu.value = false"><FaIcon name="close" /></button>
          </div>
          <div class="fa-drawer__city">
            <button v-for="(c, k) in faCities" :key="k" type="button" :class="{ 'is-on': cart.city.value === k }" @click="setCity(k as FaCity)">
              {{ c.title }}
            </button>
          </div>
          <NuxtLink v-for="g in faGroups" :key="g.id" :to="faPath(`/catalog/${g.secs[0]}`)" class="fa-drawer__group">
            <span>{{ g.title }}</span><FaIcon name="right" :size="18" />
          </NuxtLink>
          <NuxtLink :to="faPath('/catalog')" class="fa-drawer__group"><span>Весь каталог</span><FaIcon name="right" :size="18" /></NuxtLink>
          <div class="fa-drawer__pages">
            <NuxtLink v-for="p in pages" :key="p.to" :to="pageTo(p.to)">{{ p.label }}</NuxtLink>
            <a :href="FA_B2B" target="_blank" rel="noopener">Для магазинов (опт)</a>
            <NuxtLink :to="faPath('/kabinet')">{{ cart.user.value ? 'Личный кабинет' : 'Вход и регистрация' }}</NuxtLink>
          </div>
          <div class="fa-drawer__contacts">
            <a :href="tel(FA_PHONE)" class="fa-btn fa-btn--main"><FaIcon name="phone" :size="18" />{{ FA_PHONE }}</a>
            <button type="button" class="fa-btn fa-btn--line" @click="ui.callback.value = true">Перезвоните мне</button>
            <span>{{ FA_HOURS }} · мин. заказ {{ faMoney(FA_MIN) }}</span>
            <button type="button" class="fa-foot__theme" @click="cart.dark.value = !cart.dark.value">
              <FaIcon :name="cart.dark.value ? 'bulb' : 'moon'" :size="16" />{{ cart.dark.value ? 'Светлая тема' : 'Тёмная тема' }}
            </button>
          </div>
        </aside>
      </div>
    </Transition>

    <div v-if="ui.login.value" class="fa-overlay fa-overlay--center" @click.self="ui.login.value = false">
      <div class="fa-modal" role="dialog" aria-label="Вход">
        <button type="button" class="fa-iconbtn fa-modal__x" aria-label="Закрыть" @click="ui.login.value = false"><FaIcon name="close" /></button>
        <div v-if="ui.login.value !== 'forgot'" class="fa-tabs">
          <button type="button" :class="{ 'is-on': ui.login.value === 'login' }" @click="ui.login.value = 'login'">Вход</button>
          <button type="button" :class="{ 'is-on': ui.login.value === 'register' }" @click="ui.login.value = 'register'">Регистрация</button>
        </div>
        <form v-if="ui.login.value === 'login'" class="fa-form" @submit.prevent="doLogin">
          <label class="fa-field"><span>Эл. почта</span><input v-model="auth.email" type="email" autocomplete="email" required /></label>
          <label class="fa-field"><span>Пароль</span><input v-model="auth.pass" type="password" autocomplete="current-password" required /></label>
          <button type="submit" class="fa-btn fa-btn--main">Войти</button>
          <button type="button" class="fa-btn fa-btn--ya" @click="doYandex"><b>Я</b>Быстрый вход через Яндекс</button>
          <button type="button" class="fa-link" @click="ui.login.value = 'forgot'">Забыли пароль?</button>
          <p class="fa-demo">Демо: пароль никуда не отправляется.</p>
        </form>
        <form v-else-if="ui.login.value === 'register'" class="fa-form" @submit.prevent="doRegister">
          <label class="fa-field"><span>Имя</span><input v-model="auth.name" type="text" autocomplete="name" required /></label>
          <label class="fa-field"><span>Эл. почта</span><input v-model="auth.email" type="email" autocomplete="email" required /></label>
          <label class="fa-field"><span>Телефон</span><FaPhone v-model="auth.phone" /></label>
          <label class="fa-field"><span>Адрес доставки</span><input v-model="auth.address" type="text" placeholder="Город, улица, дом" autocomplete="street-address" /></label>
          <label class="fa-field"><span>Пароль</span><input v-model="auth.pass" type="password" autocomplete="new-password" required /></label>
          <label class="fa-check"><input v-model="auth.agree" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
          <button type="submit" class="fa-btn fa-btn--main">Зарегистрироваться</button>
          <p class="fa-demo">С регистрацией копятся баллы: 2 % от каждого оплаченного заказа.</p>
        </form>
        <form v-else class="fa-form" @submit.prevent="doForgot">
          <b class="fa-modal__t">Восстановление пароля</b>
          <template v-if="!auth.sent">
            <label class="fa-field"><span>Эл. почта</span><input v-model="auth.email" type="email" autocomplete="email" required /></label>
            <button type="submit" class="fa-btn fa-btn--main">Прислать ссылку</button>
          </template>
          <p v-else class="fa-ok"><FaIcon name="check" :size="18" />Ссылка ушла бы на {{ auth.email }} — в концепте письма не отправляются.</p>
          <button type="button" class="fa-link" @click="ui.login.value = 'login'">Вернуться ко входу</button>
        </form>
      </div>
    </div>

    <div v-if="ui.callback.value" class="fa-overlay fa-overlay--center" @click.self="ui.callback.value = false">
      <div class="fa-modal" role="dialog" aria-label="Перезвоните мне">
        <button type="button" class="fa-iconbtn fa-modal__x" aria-label="Закрыть" @click="ui.callback.value = false"><FaIcon name="close" /></button>
        <b class="fa-modal__t">Перезвоните мне</b>
        <form v-if="!cb.sent" class="fa-form" @submit.prevent="cb.sent = true">
          <label class="fa-field"><span>Контактное лицо</span><input v-model="cb.name" type="text" autocomplete="name" required /></label>
          <label class="fa-field"><span>Телефон</span><FaPhone v-model="cb.phone" /></label>
          <label class="fa-field"><span>Эл. почта</span><input v-model="cb.email" type="email" autocomplete="email" /></label>
          <label class="fa-field">
            <span>Тема</span>
            <select v-model="cb.topic">
              <option>Вопрос по заказу</option>
              <option>Доставка</option>
              <option>Ассортимент</option>
              <option>Для магазинов</option>
            </select>
          </label>
          <label class="fa-check"><input v-model="cb.agree" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
          <label class="fa-check"><input v-model="cb.human" type="checkbox" required /><span>Я человек</span></label>
          <button type="submit" class="fa-btn fa-btn--main">Жду звонка</button>
        </form>
        <p v-else class="fa-ok"><FaIcon name="check" :size="18" />Готово. В концепте заявка никуда не уходит — на настоящем сайте менеджер перезвонит в рабочее время.</p>
      </div>
    </div>

    <div v-if="!cart.cookie.value" class="fa-cookie">
      <span>Сайт использует cookie, чтобы корзина и вход работали.</span>
      <button type="button" class="fa-btn fa-btn--main fa-btn--sm" @click="cart.cookie.value = true">Хорошо</button>
    </div>

    <Transition name="fa-fade">
      <div v-if="ui.toast.value" class="fa-toast" role="status">{{ ui.toast.value }}</div>
    </Transition>
  </div>
</template>

<style lang="scss">
.fa-body {
  background: #fff;
}
html.fa-html {
  scroll-padding-top: 130px;
  scroll-behavior: smooth;
}
html.fa-lock {
  overflow: hidden;
}
html.fa-dark-html,
html.fa-dark-html .fa-body {
  background: #101a17;
}

.fa {
  --fa-accent: #12732e;
  --fa-accent-hover: #0e6327;
  --fa-dark: #154539;
  --fa-text: #2c3a35;
  --fa-muted: #66746f;
  --fa-bg: #fff;
  --fa-card: #fff;
  --fa-surface: #eef2f0;
  --fa-surface-2: #e3eae7;
  --fa-line: #dde5e1;
  --fa-soft: #e8f4da;
  --fa-soft-ink: #2f6b10;
  --fa-lime: #60bb13;
  --fa-craft: #f3ecdf;
  --fa-craft-ink: #7a5a2c;
  --fa-red: #c2412d;
  --fa-gold: #e3a21a;
  --fa-photo: #fff;
  --fa-r: 10px;
  --fa-R: 16px;
  --fa-head: 'Alegreya Sans', system-ui, sans-serif;
  --fa-pop: 0 2px 6px rgba(21, 69, 57, 0.08), 0 22px 54px rgba(21, 69, 57, 0.22);
  min-height: 100vh;
  background: var(--fa-bg);
  color: var(--fa-text);
  font-family: 'Alegreya Sans', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
  color-scheme: light;

  @media (max-width: 768px) {
    padding-bottom: 64px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  &--dark {
    color-scheme: dark;
    --fa-accent: #1d7a39;
    --fa-accent-hover: #238543;
    --fa-dark: #eef4f1;
    --fa-text: #d4dfdb;
    --fa-muted: #93a59f;
    --fa-bg: #101a17;
    --fa-card: #16231f;
    --fa-surface: #1a2925;
    --fa-surface-2: #22332e;
    --fa-line: #3c544c;
    --fa-soft: #1f3a22;
    --fa-soft-ink: #a5d97a;
    --fa-craft: #2a2519;
    --fa-craft-ink: #e0c48f;
    --fa-pop: 0 2px 6px rgba(0, 0, 0, 0.3), 0 22px 54px rgba(0, 0, 0, 0.5);
  }
}

:where(.fa) h1,
:where(.fa) h2,
:where(.fa) h3,
:where(.fa) p,
:where(.fa) figure,
:where(.fa) dl,
:where(.fa) dd,
:where(.fa) ol,
:where(.fa) ul {
  margin: 0;
}
:where(.fa) ol,
:where(.fa) ul {
  padding: 0;
  list-style: none;
}
:where(.fa) h1,
:where(.fa) h2,
:where(.fa) h3 {
  color: var(--fa-dark);
  font-family: var(--fa-head);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.01em;
}
:where(.fa) h1 {
  font-size: clamp(32px, 4vw, 52px);
}
:where(.fa) h2 {
  font-size: clamp(26px, 2.6vw, 34px);
}
:where(.fa) h3 {
  font-size: 20px;
}
:where(.fa) a {
  color: inherit;
  text-decoration: none;
}
:where(.fa) img {
  display: block;
  max-width: 100%;
}
:where(.fa) button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  border: 0;
  background: none;
  padding: 0;
}
:where(.fa) input,
:where(.fa) textarea,
:where(.fa) select {
  font: inherit;
  color: var(--fa-dark);
}

.fa-wrap {
  width: 100%;
  max-width: 1360px;
  margin-left: auto;
  margin-right: auto;
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

.fa-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 12px;
  padding: 8px 16px;
  background: #154539;
  color: #eef4f1;
  font-size: 14px;
  line-height: 1.35;
  text-align: center;

  a {
    color: #b9e58e;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

/* ---------- кнопки ---------- */
.fa-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: var(--fa-r);
  font-weight: 700;
  font-size: 16px;
  white-space: nowrap;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;

  &--main {
    background: var(--fa-accent);
    color: #fff;

    &:hover {
      background: var(--fa-accent-hover);
    }
    &:disabled {
      background: var(--fa-surface-2);
      color: var(--fa-muted);
      cursor: not-allowed;
    }
  }
  &--line,
  &--line:focus,
  &--line:active {
    background: var(--fa-card);
    border: 1px solid var(--fa-line);
    color: var(--fa-dark);
  }
  &--line:hover {
    border-color: var(--fa-accent);
    color: var(--fa-accent);
  }
  &--soft {
    background: var(--fa-soft);
    color: var(--fa-soft-ink);

    &:hover {
      background: color-mix(in srgb, var(--fa-soft) 80%, var(--fa-lime));
    }
  }
  &--ya,
  &--ya:focus {
    background: var(--fa-card);
    border: 1px solid var(--fa-line);
    color: var(--fa-dark);

    b {
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #fc3f1d;
      color: #fff;
      font-size: 14px;
    }
  }
  &--sm {
    min-height: 38px;
    padding: 0 14px;
    font-size: 15px;
  }
}
.fa-iconbtn {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--fa-r);
  color: var(--fa-dark);

  &:hover {
    background: var(--fa-surface);
  }
}
.fa-link {
  color: var(--fa-accent);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.fa-demo {
  color: var(--fa-muted);
  font-size: 14px;
}
.fa-ok {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 12px 14px;
  border-radius: var(--fa-r);
  background: var(--fa-soft);
  color: var(--fa-soft-ink);
  font-weight: 500;

  .fa-icon {
    flex: none;
    margin-top: 2px;
  }
}

/* ---------- метки, маски, звёзды ---------- */
.fa-label {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 9px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;

  &--sale {
    background: var(--fa-red);
    color: #fff;
  }
  &--hit {
    background: #154539;
    color: #fff;
  }
  &--new {
    background: var(--fa-lime);
    color: #12300a;
  }
}
.fa-mask {
  display: inline-block;
  flex: none;
  background: currentColor;
  -webkit-mask: var(--fa-mask) center / contain no-repeat;
  mask: var(--fa-mask) center / contain no-repeat;

  &--cow {
    aspect-ratio: 132 / 85;
  }
  &--pig {
    aspect-ratio: 89 / 58;
  }
  &--chicken {
    aspect-ratio: 40 / 41;
  }
  &--sheep {
    aspect-ratio: 3 / 2;
  }
}
.fa-stars {
  display: inline-flex;
  gap: 1px;
  vertical-align: middle;

  &__s {
    display: inline-flex;
    color: var(--fa-line);

    svg {
      fill: currentColor;
    }
    &.is-on,
    &.is-half {
      color: var(--fa-gold);
    }
    &.is-half {
      opacity: 0.55;
    }
  }
  &.is-pick .fa-stars__s {
    padding: 2px;
  }
}
.fa-strokes {
  display: block;
  width: 100%;
  height: 70px;

  &.is-flip {
    transform: scaleY(-1);
  }
  &__craft {
    fill: #dcc7a1;
  }
  &__green {
    fill: #3f8f4a;
  }
  &__dark {
    fill: #154539;
  }
  @media (max-width: 768px) {
    height: 44px;
  }
}

/* ---------- шапка ---------- */
.fa-header {
  position: sticky;
  z-index: 40;
  background: var(--fa-bg);
  border-bottom: 1px solid var(--fa-line);
}
.fa-strip {
  background: var(--fa-surface);
  color: var(--fa-dark);
  font-size: 15px;

  &__row {
    display: flex;
    align-items: center;
    gap: 22px;
    min-height: 40px;
    white-space: nowrap;
  }
  &__item {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-width: 0;

    .fa-icon {
      flex: none;
      color: var(--fa-accent);
    }
  }
  &__wave {
    font-weight: 700;
    overflow: hidden;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &:hover {
      color: var(--fa-accent);
    }
  }
  &__short {
    display: none;
  }
  &__cb {
    margin-left: auto;
    color: var(--fa-accent);
    font-weight: 700;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
  &__phone {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 800;
    font-size: 16px;

    .fa-icon {
      color: var(--fa-accent);
    }
  }
  @media (max-width: 1400px) {
    &__hours {
      display: none;
    }
  }
  @media (max-width: 1199px) {
    &__min {
      display: none;
    }
  }
  @media (max-width: 989px) {
    &__long {
      display: none;
    }
    &__short {
      display: inline;
    }
  }
  @media (max-width: 768px) {
    font-size: 14px;

    &__row {
      gap: 12px;
      min-height: 36px;
    }
    &__cb {
      display: none;
    }
    &__phone {
      margin-left: auto;
      font-size: 15px;
    }
  }
  @media (max-width: 576px) {
    &__phone {
      display: none;
    }
    &__wave {
      margin-left: auto;
    }
  }
}
.fa-city {
  position: relative;

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 30px;
    font-weight: 700;

    .fa-icon:first-child {
      color: var(--fa-accent);
    }
  }
  &__drop {
    position: absolute;
    top: calc(100% + 6px);
    left: -10px;
    z-index: 60;
    display: grid;
    gap: 4px;
    width: 280px;
    padding: 8px;
    border: 1px solid var(--fa-line);
    border-radius: var(--fa-R);
    background: var(--fa-card);
    box-shadow: var(--fa-pop);
    white-space: normal;

    button {
      display: grid;
      gap: 2px;
      padding: 10px 12px;
      border-radius: var(--fa-r);
      text-align: left;

      span {
        color: var(--fa-muted);
        font-size: 14px;
      }
      &:hover {
        background: var(--fa-surface);
      }
      &.is-on {
        background: var(--fa-soft);
      }
    }
  }
}

.fa-bar {
  display: none;
}
.fa-logo {
  flex: none;
  display: block;

  img {
    width: auto;
    height: 52px;
    border-radius: 8px;
  }
}
.fa-catbtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: none;
  height: 48px;
  padding: 0 20px;
  border-radius: var(--fa-r);
  background: var(--fa-accent);
  color: #fff;
  font-weight: 800;
  font-size: 17px;

  &:hover,
  &.is-open {
    background: var(--fa-accent-hover);
  }
}
.fa-searchrow {
  &__in {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 76px;
  }
}
.fa-search {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  height: 48px;
  padding: 0 5px 0 14px;
  border: 1.5px solid var(--fa-accent);
  border-radius: var(--fa-r);
  background: var(--fa-card);

  > .fa-icon {
    flex: none;
    color: var(--fa-muted);
  }
  input {
    flex: 1;
    min-width: 0;
    width: 0;
    height: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    font-size: 16px;

    &::-webkit-search-cancel-button {
      display: none;
    }
  }
  &__go {
    flex: none;
    height: 38px;
    padding: 0 16px;
    border-radius: 7px;
    background: var(--fa-surface);
    color: var(--fa-dark);
    font-weight: 700;

    &:hover {
      background: var(--fa-soft);
    }
  }
  &__drop {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    z-index: 60;
    display: grid;
    padding: 8px;
    border: 1px solid var(--fa-line);
    border-radius: var(--fa-R);
    background: var(--fa-card);
    box-shadow: var(--fa-pop);
  }
  &__hit {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 6px 8px;
    border-radius: var(--fa-r);

    img {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: #fff;
      object-fit: cover;
    }
    &:hover {
      background: var(--fa-surface);
    }
  }
  &__t {
    display: grid;
    min-width: 0;

    b {
      overflow: hidden;
      color: var(--fa-dark);
      font-weight: 500;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    small {
      color: var(--fa-muted);
      font-size: 13px;
    }
  }
  &__p {
    font-weight: 800;
    color: var(--fa-dark);
  }
  &__all {
    margin-top: 4px;
    padding: 10px;
    border-radius: var(--fa-r);
    color: var(--fa-accent);
    font-weight: 700;

    &:hover {
      background: var(--fa-surface);
    }
  }
  &__pop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    padding: 6px;

    span {
      width: 100%;
      color: var(--fa-muted);
      font-size: 14px;
    }
    button {
      height: 34px;
      padding: 0 12px;
      border-radius: 8px;
      background: var(--fa-surface);
      color: var(--fa-dark);

      &:hover {
        background: var(--fa-soft);
      }
    }
  }
}
.fa-acts {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: none;
}
.fa-act {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 48px;
  padding: 0 12px;
  border-radius: var(--fa-r);
  color: var(--fa-dark);
  font-weight: 700;
  white-space: nowrap;

  &:hover {
    background: var(--fa-surface);
  }
  &__n {
    position: absolute;
    top: 4px;
    left: 26px;
    display: grid;
    place-items: center;
    min-width: 19px;
    height: 19px;
    padding: 0 5px;
    border-radius: 10px;
    background: var(--fa-lime);
    color: #12300a;
    font-size: 12px;
    font-style: normal;
    font-weight: 800;
    line-height: 1;
  }
}
.fa-cartbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 168px;
  height: 48px;
  padding: 0 14px;
  border-radius: var(--fa-r);
  background: var(--fa-surface);
  color: var(--fa-dark);
  font-weight: 800;
  white-space: nowrap;

  &:hover {
    background: var(--fa-surface-2);
  }
  &.is-full {
    background: var(--fa-soft);
    color: var(--fa-soft-ink);
  }
  .fa-act__n {
    left: 28px;
  }
}

@media (max-width: 1199px) {
  .fa-act__l {
    display: none;
  }
  .fa-act .fa-act__n {
    left: 24px;
  }
}
@media (max-width: 989px) {
  .fa-search__go {
    display: none;
  }
  .fa-cartbtn {
    width: 136px;
  }
}
@media (max-width: 768px) {
  .fa-logo--desk {
    display: none;
  }
  .fa-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 60px;
  }
  .fa-bar__burger {
    margin-left: -8px;
  }
  .fa-logo img {
    height: 42px;
  }
  .fa-catbtn {
    display: none;
  }
  .fa-bar__theme {
    margin-left: auto;
  }
  .fa-bar__call {
    margin-right: -8px;
  }
  .fa-searchrow__in {
    min-height: 60px;
    padding-top: 0;
  }
  .fa-acts {
    display: none;
  }
  .fa-search {
    height: 46px;
  }
}

.fa-catpanel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  border-top: 1px solid var(--fa-line);
  background: var(--fa-card);
  box-shadow: var(--fa-pop);

  &__in {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px 28px;
    padding-top: 22px;
    padding-bottom: 22px;
  }
  &__gt {
    display: block;
    margin-bottom: 6px;
    padding: 0 10px;
    color: var(--fa-muted);
    font-size: 15px;
    font-weight: 700;
  }
  &__group {
    display: grid;
    align-content: start;
    gap: 2px;
  }
  &__sec {
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 4px 10px;
    border-radius: var(--fa-r);
    color: var(--fa-dark);
    font-weight: 500;

    small {
      color: var(--fa-muted);
      font-size: 14px;
    }
    &:hover,
    &.is-on {
      background: var(--fa-surface);
      color: var(--fa-accent);
    }
  }
  &__ic {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: var(--fa-surface);
    color: var(--fa-dark);

    .fa-mask--cow {
      height: 20px !important;
    }
  }
  &__foot {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 24px;
    padding: 14px 10px 0;
    border-top: 1px solid var(--fa-line);
    font-weight: 700;

    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--fa-accent);
    }
  }
  @media (max-width: 1199px) {
    &__in {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 768px) {
    display: none;
  }
}

.fa-pages {
  border-top: 1px solid var(--fa-line);

  &__in {
    display: flex;
    gap: 4px 26px;
    min-height: 44px;
    align-items: center;
    overflow-x: auto;
    scrollbar-width: none;
    white-space: nowrap;
    font-weight: 500;

    a {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: var(--fa-dark);

      &:hover,
      &.router-link-exact-active {
        color: var(--fa-accent);
      }
    }
  }
  &__b2b {
    margin-left: auto;
    color: var(--fa-accent) !important;
    font-weight: 700;
  }
  @media (max-width: 1199px) {
    &__in {
      gap: 22px;
      mask-image: linear-gradient(90deg, #000 92%, transparent);
    }
    &__b2b {
      margin-left: 0;
    }
  }
  @media (max-width: 768px) {
    display: none;
  }
}

/* ---------- общие блоки страниц ---------- */
.fa-main {
  min-height: 50vh;
}
.fa-section {
  padding-top: 56px;
  padding-bottom: 8px;

  @media (max-width: 768px) {
    padding-top: 40px;
  }
}
.fa-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
  flex-wrap: wrap;
  margin-bottom: 22px;

  p {
    margin-top: 8px;
    color: var(--fa-muted);
  }
  &__more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--fa-accent);
    font-weight: 700;
    white-space: nowrap;
  }
}
.fa-info__h1 {
  margin: 14px 0 22px;
  font-size: clamp(30px, 3.4vw, 44px) !important;
}
.fa-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  padding-top: 20px;
  color: var(--fa-muted);
  font-size: 15px;

  a:hover {
    color: var(--fa-accent);
  }
  span::before {
    content: '/';
    margin-right: 8px;
    opacity: 0.5;
  }
}
.fa-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (max-width: 1199px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}
.fa-shelfbox {
  position: relative;

  &__btn {
    position: absolute;
    top: 30%;
    z-index: 3;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border: 1px solid var(--fa-line);
    border-radius: 50%;
    background: var(--fa-card);
    color: var(--fa-dark);
    box-shadow: 0 2px 6px rgba(21, 69, 57, 0.08), 0 10px 24px rgba(21, 69, 57, 0.16);
    transform: translateY(-50%);
    transition:
      color 0.15s,
      border-color 0.15s;

    &:hover {
      border-color: var(--fa-accent);
      color: var(--fa-accent);
    }
    &--prev {
      left: -14px;
    }
    &--next {
      right: -14px;
    }
  }
  // на телефоне листают пальцем — стрелки только мешают
  @media (max-width: 768px) {
    &__btn {
      display: none;
    }
  }
}
.fa-shelf {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - 5 * 18px) / 5.3);
  gap: 18px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: var(--fa-surface-2) transparent;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: var(--fa-surface-2);
  }
  &:hover {
    scrollbar-color: color-mix(in srgb, var(--fa-dark) 30%, transparent) transparent;
  }

  > * {
    scroll-snap-align: start;
  }
  @media (max-width: 1400px) {
    grid-auto-columns: calc((100% - 4 * 18px) / 4.3);
  }
  @media (max-width: 1199px) {
    grid-auto-columns: calc((100% - 3 * 18px) / 3.3);
  }
  @media (max-width: 768px) {
    grid-auto-columns: calc((100% - 12px) / 2.15);
    gap: 12px;
  }
}
.fa-rowlist {
  display: grid;
  gap: 10px;
}
.fa-empty {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 56px 20px;
  border-radius: var(--fa-R);
  background: var(--fa-surface);
  text-align: center;

  .fa-mask {
    color: var(--fa-dark);
    opacity: 0.8;
  }
  p {
    max-width: 440px;
    color: var(--fa-muted);
  }
}
.fa-panel {
  padding: 24px;
  border-radius: var(--fa-R);
  background: var(--fa-surface);

  @media (max-width: 576px) {
    padding: 18px;
  }
}
.fa-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 14px;
  border: 1px solid var(--fa-line);
  border-radius: 10px;
  background: var(--fa-card);
  color: var(--fa-dark);
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    border-color: var(--fa-accent);
  }
  &.is-on,
  &.is-on:focus {
    border-color: var(--fa-dark);
    background: var(--fa-dark);
    color: var(--fa-bg);
  }
}
.fa-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: var(--fa-surface);

  button {
    flex: 1;
    height: 40px;
    padding: 0 14px;
    border-radius: 9px;
    color: var(--fa-muted);
    font-weight: 700;
    white-space: nowrap;

    &.is-on {
      background: var(--fa-card);
      color: var(--fa-dark);
      box-shadow: 0 1px 3px rgba(21, 69, 57, 0.12);
    }
  }
}

/* поля */
.fa-form {
  display: grid;
  gap: 14px;
}
.fa-field {
  display: grid;
  gap: 6px;
  min-width: 0;

  > span {
    color: var(--fa-muted);
    font-size: 15px;
    font-weight: 500;
  }
  input,
  textarea,
  select {
    width: 100%;
    min-width: 0;
    height: 48px;
    padding: 0 14px;
    border: 1px solid var(--fa-line);
    border-radius: var(--fa-r);
    background: var(--fa-card);
    outline: 0;
    font-size: 16px;

    &:focus {
      border-color: var(--fa-accent);
    }
    &::placeholder {
      color: var(--fa-muted);
    }
  }
  textarea {
    height: 104px;
    padding: 12px 14px;
    resize: vertical;
  }
  select {
    appearance: none;
    padding-right: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' stroke='%2366746f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.5 7l4.5 4.5L13.5 7'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
  }
}
.fa-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 15px;
  line-height: 1.35;
  cursor: pointer;

  input {
    flex: none;
    width: 20px;
    height: 20px;
    margin: 0;
    accent-color: var(--fa-accent);
  }
}

/* счётчик — общий для карточки, товара и корзины */
.fa-qty {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 42px;
  align-items: center;
  height: 44px;
  border-radius: var(--fa-r);
  background: var(--fa-soft);
  color: var(--fa-soft-ink);

  &__btn {
    display: grid;
    place-items: center;
    height: 100%;
    border-radius: var(--fa-r);
    color: var(--fa-soft-ink);

    &:hover {
      background: color-mix(in srgb, var(--fa-soft) 70%, var(--fa-lime));
    }
  }
  &__val {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 3px;
    min-width: 0;
    font-weight: 800;

    input {
      min-width: 2ch;
      max-width: 5ch;
      padding: 0;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--fa-soft-ink);
      font-size: 17px;
      font-weight: 800;
      text-align: center;
    }
    span {
      padding: 0 3px;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

/* карточка «весовая этикетка» */
.fa-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--fa-line);
  border-radius: var(--fa-R);
  background: var(--fa-card);
  overflow: hidden;
  transition: border-color 0.15s;

  &:hover {
    border-color: color-mix(in srgb, var(--fa-line) 50%, var(--fa-accent));

    .fa-card__ph img {
      transform: scale(1.04);
    }
  }
  &__ph {
    position: relative;
    display: block;
    aspect-ratio: 1;
    background: var(--fa-photo);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
  }
  &__labels {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  &__fav {
    position: absolute;
    top: 8px;
    right: 8px;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.92);
    color: #66746f;

    &:hover,
    &.is-on {
      color: var(--fa-red);
    }
  }
  &__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 6px;
    padding: 12px 14px 14px;
  }
  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 10px;
    min-height: 20px;
    color: var(--fa-muted);
    font-size: 14px;
  }
  &__pack {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--fa-craft-ink);
    font-weight: 700;
  }
  &__rate {
    display: inline-flex;
    align-items: center;
    gap: 3px;

    .fa-icon {
      color: var(--fa-gold);
    }
  }
  &__title {
    display: -webkit-box;
    overflow: hidden;
    color: var(--fa-dark);
    font-size: 17px;
    font-weight: 500;
    line-height: 1.25;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    &:hover {
      color: var(--fa-accent);
    }
  }
  &__price {
    display: grid;
    gap: 2px;
    margin-top: auto;
    padding-top: 6px;
  }
  &__now {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 8px;

    b {
      color: var(--fa-dark);
      font-size: 22px;
      font-weight: 800;
      line-height: 1.1;
    }
    s {
      color: var(--fa-muted);
      font-size: 15px;
    }
    small {
      color: var(--fa-muted);
      font-size: 14px;
    }
  }
  &__est {
    color: var(--fa-dark);
    font-size: 15px;
    font-weight: 700;
  }
  &__bonus {
    color: var(--fa-soft-ink);
    font-size: 13px;
    font-weight: 700;
  }
  &__buy {
    margin-top: 8px;
  }
  &__add {
    width: 100%;
    min-height: 44px;
  }
  @media (max-width: 576px) {
    &__body {
      padding: 10px 10px 12px;
    }
    &__title {
      font-size: 16px;
    }
    &__now b {
      font-size: 20px;
    }
    &__add {
      padding: 0 10px;

      .fa-icon {
        display: none;
      }
    }
  }

  // список: фото слева, цена и покупка справа
  &.is-row {
    display: grid;
    grid-template-columns: 120px minmax(0, 1fr);

    .fa-card__ph {
      aspect-ratio: 1;
      height: 100%;
    }
    .fa-card__fav {
      top: 6px;
      right: auto;
      left: 84px;
      width: 32px;
      height: 32px;
    }
    .fa-card__labels {
      top: auto;
      bottom: 6px;
      left: 6px;
    }
    .fa-card__body {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 190px 180px;
      grid-template-areas: 'meta price buy' 'title price buy';
      align-items: center;
      gap: 4px 20px;
    }
    .fa-card__meta {
      grid-area: meta;
    }
    .fa-card__title {
      grid-area: title;
      align-self: start;
    }
    .fa-card__price {
      grid-area: price;
      margin: 0;
      padding: 0;
    }
    .fa-card__buy {
      grid-area: buy;
      margin: 0;
    }
    @media (max-width: 989px) {
      .fa-card__body {
        grid-template-columns: minmax(0, 1fr) 170px;
        grid-template-areas: 'meta meta' 'title title' 'price buy';
      }
    }
    @media (max-width: 576px) {
      grid-template-columns: 96px minmax(0, 1fr);

      .fa-card__fav {
        left: 60px;
      }
      .fa-card__body {
        grid-template-columns: minmax(0, 1fr);
        grid-template-areas: 'meta' 'title' 'price' 'buy';
      }
    }
  }
}

/* неделя фермы */
.fa-week {
  display: grid;
  gap: 14px;

  &__days {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 6px;
  }
  &__day {
    position: relative;
    display: grid;
    justify-items: center;
    gap: 2px;
    padding: 10px 2px 9px;
    border: 1px solid transparent;
    border-radius: 12px;
    background: var(--fa-card);
    color: var(--fa-dark);
    text-align: center;

    &.is-past {
      opacity: 0.5;
    }
    &.is-deadline {
      background: var(--fa-craft);
      color: var(--fa-craft-ink);
    }
    &.is-wave {
      background: var(--fa-accent);
      color: #fff;
      opacity: 1;
    }
    &.is-dl {
      border-color: var(--fa-craft-ink);
    }
    &.is-today::after {
      content: 'сегодня';
      position: absolute;
      top: -9px;
      left: 50%;
      padding: 0 6px;
      border-radius: 6px;
      background: var(--fa-dark);
      color: var(--fa-bg);
      font-size: 11px;
      font-weight: 700;
      line-height: 17px;
      transform: translateX(-50%);
      white-space: nowrap;
    }
  }
  &__dn {
    font-size: 14px;
    font-weight: 500;
    text-transform: capitalize;
  }
  &__num {
    font-size: 22px;
    font-weight: 800;
    line-height: 1.05;
  }
  &__ic {
    display: grid;
    place-items: center;
    height: 18px;
  }
  &__what {
    min-height: 17px;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.3;
    white-space: nowrap;
  }
  &__now {
    display: flex;
    gap: 9px;
    align-items: flex-start;
    color: var(--fa-dark);
    font-size: 17px;
    line-height: 1.4;

    > .fa-icon {
      flex: none;
      margin-top: 2px;
      color: var(--fa-accent);
    }
  }
  &__left {
    color: var(--fa-accent);
    white-space: nowrap;
  }
  &__legend {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    color: var(--fa-muted);
    font-size: 14px;

    span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    i {
      width: 12px;
      height: 12px;
      border-radius: 4px;

      &.is-deliver {
        background: var(--fa-accent);
      }
      &.is-deadline {
        background: var(--fa-craft);
        border: 1px solid var(--fa-craft-ink);
      }
    }
  }
  &.is-compact &__now {
    font-size: 16px;
  }
  @media (max-width: 576px) {
    &__days {
      gap: 4px;
    }
    &__day {
      padding: 8px 0 7px;
      border-radius: 10px;
    }
    &__num {
      font-size: 19px;
    }
    &__what {
      font-size: 11px;
    }
    &__now {
      font-size: 16px;
    }
  }
  @media (max-width: 375px) {
    &__what {
      display: none;
    }
    &__day.is-today::after {
      content: '•';
      padding: 0 5px;
    }
  }
}

/* отзывы */
.fa-review {
  display: grid;
  align-content: start;
  gap: 8px;
  padding: 20px;
  border-radius: var(--fa-R);
  background: var(--fa-surface);

  &__top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 12px;

    b {
      color: var(--fa-dark);
    }
    small {
      color: var(--fa-muted);
      font-size: 14px;
    }
  }
  &__reply {
    margin-top: 4px;
    padding: 12px 14px;
    border-left: 3px solid var(--fa-accent);
    border-radius: 0 var(--fa-r) var(--fa-r) 0;
    background: var(--fa-card);
    font-size: 15px;

    b {
      display: block;
      color: var(--fa-accent);
      font-size: 14px;
    }
  }
}

/* ---------- подвал ---------- */
.fa-foot {
  margin-top: 72px;

  &__body {
    padding: 44px 0 24px;
    background: var(--fa-surface);
  }
  &__grid {
    display: grid;
    grid-template-columns: 1.3fr 0.8fr 1fr 0.9fr 1.2fr;
    gap: 32px;
  }
  &__brand {
    display: grid;
    align-content: start;
    gap: 6px;

    img {
      width: 140px;
      height: auto;
      margin-bottom: 8px;
      border-radius: 10px;
    }
    p {
      max-width: 300px;
      margin-bottom: 8px;
      color: var(--fa-muted);
    }
    span {
      color: var(--fa-muted);
      font-size: 15px;
    }
  }
  &__phone {
    color: var(--fa-dark);
    font-size: 22px;
    font-weight: 800;
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }
  &__col {
    display: grid;
    align-content: start;
    gap: 8px;

    b {
      margin-bottom: 4px;
      color: var(--fa-dark);
      font-weight: 800;
    }
    a:hover {
      color: var(--fa-accent);
    }
  }
  &__sub {
    display: grid;
    align-content: start;
    gap: 10px;

    b {
      color: var(--fa-dark);
      font-weight: 800;
    }
    input[type='text'],
    input[type='email'] {
      height: 46px;
      padding: 0 14px;
      border: 1px solid var(--fa-line);
      border-radius: var(--fa-r);
      background: var(--fa-card);
      outline: 0;

      &:focus {
        border-color: var(--fa-accent);
      }
    }
    .fa-check {
      font-size: 14px;
    }
  }
  &__bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 24px;
    margin-top: 36px;
    padding-top: 18px;
    border-top: 1px solid var(--fa-line);
    color: var(--fa-muted);
    font-size: 14px;
  }
  &__theme {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    color: var(--fa-dark);
    font-weight: 700;
  }
  @media (max-width: 1199px) {
    &__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    &__brand,
    &__sub {
      grid-column: span 3;
    }
    &__sub {
      max-width: 520px;
    }
  }
  @media (max-width: 768px) {
    margin-top: 48px;

    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 28px 20px;
    }
    &__brand,
    &__sub {
      grid-column: span 2;
    }
    &__theme {
      margin-left: 0;
    }
  }
  @media (max-width: 375px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
    &__brand,
    &__sub {
      grid-column: auto;
    }
  }
}

/* ---------- таббар ---------- */
.fa-tabbar {
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
    padding-bottom: env(safe-area-inset-bottom);
    border-top: 1px solid var(--fa-line);
    background: var(--fa-bg);

    a {
      position: relative;
      display: grid;
      justify-items: center;
      align-content: center;
      gap: 2px;
      min-width: 0;
      color: var(--fa-muted);
      font-size: 13px;
      font-weight: 700;

      span {
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &.is-on {
        color: var(--fa-accent);
      }
      .fa-act__n {
        top: 6px;
        left: calc(50% + 4px);
      }
    }
  }
}

/* ---------- меню, модалки, уведомления ---------- */
.fa-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  background: rgba(10, 30, 25, 0.45);

  &--center {
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
}
.fa-drawer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: min(380px, 88vw);
  height: 100%;
  padding: 12px 16px 24px;
  overflow-y: auto;
  background: var(--fa-bg);

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0 8px;

    b {
      color: var(--fa-dark);
      font-size: 20px;
      font-weight: 800;
    }
  }
  &__city {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    margin-bottom: 8px;
    padding: 4px;
    border-radius: 12px;
    background: var(--fa-surface);

    button {
      height: 40px;
      border-radius: 9px;
      font-weight: 700;

      &.is-on {
        background: var(--fa-card);
        color: var(--fa-accent);
      }
    }
  }
  &__group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 50px;
    padding: 0 6px;
    border-bottom: 1px solid var(--fa-line);
    color: var(--fa-dark);
    font-size: 18px;
    font-weight: 700;
  }
  &__pages {
    display: grid;
    gap: 2px;
    padding: 12px 6px;

    a {
      padding: 8px 0;
      color: var(--fa-dark);
    }
  }
  &__contacts {
    display: grid;
    gap: 10px;
    margin-top: auto;
    padding-top: 12px;

    span {
      color: var(--fa-muted);
      font-size: 15px;
    }
    .fa-foot__theme {
      margin-left: 0;
    }
  }
}
.fa-modal {
  position: relative;
  display: grid;
  gap: 16px;
  width: min(440px, 100%);
  max-height: calc(100vh - 32px);
  padding: 28px 24px 24px;
  overflow-y: auto;
  border-radius: 18px;
  background: var(--fa-bg);
  box-shadow: var(--fa-pop);

  &__x {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  &__t {
    padding-right: 40px;
    color: var(--fa-dark);
    font-size: 22px;
    font-weight: 800;
  }
  .fa-tabs {
    margin-right: 44px;
  }
  @media (max-width: 375px) {
    padding: 24px 16px 18px;
  }
}
.fa-cookie {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 70;
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 440px;
  padding: 12px 12px 12px 16px;
  border: 1px solid var(--fa-line);
  border-radius: 14px;
  background: var(--fa-card);
  box-shadow: var(--fa-pop);
  font-size: 15px;
  line-height: 1.35;

  @media (max-width: 768px) {
    left: 10px;
    right: 10px;
    bottom: 74px;
  }
}
.fa-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 90;
  max-width: calc(100vw - 32px);
  padding: 12px 18px;
  border-radius: 12px;
  background: #154539;
  color: #fff;
  font-weight: 500;
  transform: translateX(-50%);

  @media (max-width: 768px) {
    bottom: 76px;
  }
}
.fa-fade-enter-active,
.fa-fade-leave-active {
  transition: opacity 0.2s;
}
.fa-fade-enter-from,
.fa-fade-leave-to {
  opacity: 0;
}
</style>
