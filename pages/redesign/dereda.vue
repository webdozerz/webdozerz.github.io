<script lang="ts" setup>
import DrIcon from '~/components/redesign/dereda/DrIcon.vue'
import DrPhone from '~/components/redesign/dereda/DrPhone.vue'

const route = useRoute()
const router = useRouter()
const shop = useDeredaShop()
const ui = useDrUi()
const now = useDrNow()

useSeoMeta({
  title: 'Дереда — деревенская еда на дом в Новосибирске | Концепт редизайна',
  description:
    'Концепт редизайна dereda.ru: фермерские продукты с доставкой по вторникам и пятницам. Товары с именем фермера, страница фермеров, выбор дня доставки с отсчётом до конца приёма, зоны с порогом бесплатной доставки.',
  ogTitle: 'Дереда — концепт редизайна',
  ogDescription: 'Деревенская еда на дом в Новосибирске: у каждого товара — фермер, который его сделал, доставка вт и пт с отсчётом до конца приёма.',
  ogImage: 'https://andryushov.me/redesign/dereda/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'dr-html', lang: 'ru' },
  bodyAttrs: { class: 'dr-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Yeseva+One&family=Source+Sans+3:wght@400;500;600;700&display=swap',
    },
    { rel: 'icon', type: 'image/png', href: '/redesign/dereda/favicon.png' },
  ],
})

const year = new Date().getFullYear()
const isMenu = (to: string) => (to === '/' ? route.path === drPath('/') : route.path.startsWith(drPath(to)))

// Ближайшая доставка для полосы шапки
const next = computed(() => drDeliveries(now.value, 1)[0])

// Липкая шапка: строка меню уезжает (на телефоне — и строка со знаком), у верха остаются поиск и полоса доставки
const head = ref<HTMLElement | null>(null)
const top = ref<HTMLElement | null>(null)
const bar = ref<HTMLElement | null>(null)
const stick = ref(0)
const scrolled = ref(false)
const measure = () => {
  const mobile = window.matchMedia('(max-width: 989px)').matches
  // на телефоне поиск стоит в той же строке абсолютом снизу (58 px) — уезжает только строка со знаком
  stick.value = mobile ? 64 : (top.value?.offsetHeight ?? 0)
  const h = (head.value?.offsetHeight ?? 0) - stick.value
  document.documentElement.style.setProperty('--dr-stuck', `${h}px`)
}
const onScroll = () => {
  scrolled.value = window.scrollY > 640
}

// Поиск с подсказками: фото, фермер и цена; Enter — каталог с запросом
const q = ref('')
const searchFocus = ref(false)
const hits = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (s.length < 2) return []
  return drProducts
    .filter((p) => p.name.toLowerCase().includes(s) || drSection(p.sec)?.title.toLowerCase().includes(s) || p.sub.toLowerCase().includes(s))
    .slice(0, 6)
})
const goSearch = () => {
  router.push({ path: drPath('/catalog'), query: q.value.trim() ? { q: q.value.trim() } : {} })
  searchFocus.value = false
  ;(document.activeElement as HTMLElement | null)?.blur()
}
const blurSearch = () => setTimeout(() => (searchFocus.value = false), 160)
const popular = ['Пельмени', 'Творог', 'Мёд', 'Сало', 'Яйцо']
const pickPopular = (s: string) => {
  q.value = s
  goSearch()
}

// Каталог-панель: 12 разделов с фото и подразделами, как плитки «Каталога» оригинала
const catHover = ref(drSections[0].id)
const catSec = computed(() => drSection(catHover.value)!)
const subTo = (sec: string, sub = '') => ({ path: drPath(`/catalog/${sec}`), query: sub ? { sub } : {} })
const mobOpen = ref('')

// Обратный звонок
const cb = reactive({ name: '', phone: '', text: '', agree: false, sent: false })
watch(
  () => ui.callback.value,
  () => {
    cb.sent = false
  },
)
const sendCb = () => {
  if (cb.phone.replace(/\D/g, '').length < 11 || !cb.agree) return
  cb.sent = true
}

// Предзаказ товара, которого нет в наличии
const pre = reactive({ name: '', phone: '', agree: false, sent: false })
const preProduct = computed(() => drProduct(ui.preorder.value))
watch(
  () => ui.preorder.value,
  () => {
    pre.sent = false
  },
)
const sendPre = () => {
  if (pre.phone.replace(/\D/g, '').length < 11 || !pre.agree) return
  pre.sent = true
}

// Виджет мессенджеров оригинала (WhatsApp, ВКонтакте, Telegram-бот)
const chat = ref(false)

let toastTimer: ReturnType<typeof setTimeout> | undefined
watch(
  () => ui.toast.value,
  (v) => {
    clearTimeout(toastTimer)
    if (v) toastTimer = setTimeout(() => {
      ui.toast.value = ''
      ui.toastCart.value = false
    }, 3200)
  },
)

const onKey = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  ui.menu.value = false
  ui.callback.value = false
  ui.preorder.value = ''
  ui.catalog.value = false
  chat.value = false
}
const onDoc = (e: MouseEvent) => {
  const t = e.target as HTMLElement
  if (ui.catalog.value && !t.closest('.dr-catpanel') && !t.closest('.dr-catbtn')) ui.catalog.value = false
  if (chat.value && !t.closest('.dr-chat')) chat.value = false
}
const locked = computed(() => ui.menu.value || ui.callback.value || !!ui.preorder.value)
watch([() => ui.callback.value, () => ui.preorder.value], () =>
  nextTick(() => document.querySelector<HTMLInputElement>('.dr-modal form input')?.focus()),
)
watch(locked, (v) => document.documentElement.classList.toggle('dr-lock', v))
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    ui.catalog.value = false
    ;(document.activeElement as HTMLElement | null)?.blur?.()
  },
)

let tick: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  shop.persist()
  now.value = Date.now()
  tick = setInterval(() => (now.value = Date.now()), 30000)
  measure()
  onScroll()
  window.addEventListener('resize', measure)
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKey)
  document.addEventListener('click', onDoc)
})
onBeforeUnmount(() => {
  clearInterval(tick)
  window.removeEventListener('resize', measure)
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('click', onDoc)
  document.documentElement.classList.remove('dr-lock')
})
</script>

<template>
  <div class="dr">
    <div class="dr-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="drOriginal" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header ref="head" class="dr-head" :style="{ top: `-${stick}px` }">
      <div ref="top" class="dr-head__top">
        <div class="dr-wrap dr-head__toprow">
          <nav class="dr-head__menu" aria-label="Меню магазина">
            <NuxtLink v-for="m in drMenu" :key="m.to" :to="drPath(m.to)" :class="{ 'is-on': isMenu(m.to) }">{{ m.label }}</NuxtLink>
          </nav>
          <div class="dr-head__contacts">
            <a :href="drContacts.telegramPost" target="_blank" rel="noopener" class="dr-head__tg"><DrIcon name="telegram" :size="18" />Мы в Telegram</a>
            <a :href="`mailto:${drContacts.email}`">{{ drContacts.email }}</a>
            <a :href="drContacts.tel" class="dr-head__phone">{{ drContacts.phone }}</a>
            <button type="button" class="dr-link" @click="ui.callback.value = true">Обратный звонок</button>
          </div>
        </div>
      </div>

      <div class="dr-head__main">
        <div ref="bar" class="dr-wrap dr-head__bar dr-header__row">
          <button type="button" class="dr-head__burger" aria-label="Меню" @click="ui.menu.value = true"><DrIcon name="menu" :size="26" /></button>
          <NuxtLink :to="drPath('/')" class="dr-logo" aria-label="Дереда — на главную">
            <img src="/redesign/dereda/logo.png" alt="Дереда — №1 в Новосибирске, деревенская еда на дом" width="320" height="92" />
          </NuxtLink>
          <button type="button" class="dr-btn dr-btn--main dr-catbtn" :aria-expanded="ui.catalog.value" @click="ui.catalog.value = !ui.catalog.value">
            <DrIcon :name="ui.catalog.value ? 'close' : 'grid'" :size="20" />Каталог
          </button>
          <form class="dr-search" role="search" @submit.prevent="goSearch">
            <DrIcon name="search" :size="20" />
            <input
              v-model="q"
              type="search"
              placeholder="Пельмени, творог, мёд…"
              aria-label="Поиск по каталогу"
              @focus="searchFocus = true"
              @blur="blurSearch"
            />
            <button type="submit" class="dr-search__go">Найти</button>
            <div v-if="searchFocus" class="dr-search__pop">
              <template v-if="hits.length">
                <NuxtLink v-for="p in hits" :key="p.id" :to="drPath(`/product/${p.id}`)" class="dr-search__hit">
                  <img :src="p.img" alt="" width="44" height="44" />
                  <span>
                    <b>{{ drShort(p.title) }}</b>
                    <small>{{ drFarmer(p.farmer)?.name ?? drSection(p.sec)?.title }}</small>
                  </span>
                  <em>{{ drMoney(drPriceOf(p, drFirstOn(p))) }}</em>
                </NuxtLink>
                <button type="button" class="dr-search__all" @mousedown.prevent="goSearch">Все результаты</button>
              </template>
              <template v-else>
                <p>{{ q.trim().length >= 2 ? 'Ничего не нашли — попробуйте другое слово' : 'Часто ищут' }}</p>
                <div class="dr-search__pop-chips">
                  <button v-for="s in popular" :key="s" type="button" @mousedown.prevent="pickPopular(s)">{{ s }}</button>
                </div>
              </template>
            </div>
          </form>
          <nav class="dr-head__icons" aria-label="Покупателю">
            <NuxtLink :to="drPath('/fermery')" class="dr-hicon dr-hicon--farm" :class="{ 'is-on': isMenu('/fermery') }">
              <DrIcon name="farmer" :size="24" /><span>Фермеры</span>
            </NuxtLink>
            <NuxtLink :to="drPath('/izbrannoe')" class="dr-hicon dr-hicon--fav">
              <DrIcon name="heart" :size="24" /><span>Избранное</span>
              <i v-if="shop.fav.value.length">{{ shop.fav.value.length }}</i>
            </NuxtLink>
            <NuxtLink :to="drPath('/kabinet')" class="dr-hicon dr-hicon--user">
              <DrIcon name="user" :size="24" /><span>{{ shop.user.value ? shop.user.value.name : 'Войти' }}</span>
            </NuxtLink>
            <a :href="drContacts.tel" class="dr-hicon dr-hicon--call" aria-label="Позвонить"><DrIcon name="phone" :size="24" /></a>
            <NuxtLink :to="drPath('/cart')" class="dr-cartbtn" :class="{ 'is-full': shop.count.value }">
              <DrIcon name="basket" :size="22" />
              <span v-if="shop.count.value">{{ drMoney(shop.goods.value) }}</span>
              <span v-else>Корзина</span>
              <i v-if="shop.count.value">{{ shop.count.value }}</i>
            </NuxtLink>
          </nav>
        </div>
        <div class="dr-head__strip">
          <div class="dr-wrap dr-head__striprow">
            <span class="dr-head__deliv"><DrIcon name="truck" :size="18" /><b>Доставка вт и пт</b><span class="dr-hide-s"> с 10:00 до 20:00</span></span>
            <span v-if="next" class="dr-head__next">
              <span class="dr-hide-s">Ближайшая — </span><b>{{ next.short }}</b>, приём {{ next.untilLabel }}
              <em class="dr-hide-s">· осталось {{ drLeft(next.until - now) }}</em>
            </span>
            <NuxtLink :to="drPath('/dostavka')" class="dr-head__zones dr-hide-m">Зоны и стоимость<DrIcon name="right" :size="16" /></NuxtLink>
          </div>
        </div>

        <div v-if="ui.catalog.value" class="dr-catpanel">
          <div class="dr-wrap dr-catpanel__in">
            <ul class="dr-catpanel__list">
              <li v-for="s in drSections" :key="s.id">
                <NuxtLink :to="subTo(s.id)" :class="{ 'is-on': catHover === s.id }" @mouseenter="catHover = s.id" @focus="catHover = s.id">
                  <img :src="drSecImg(s.id)" alt="" width="40" height="40" />
                  <span>{{ s.title }}</span>
                  <small>{{ s.total }}</small>
                </NuxtLink>
              </li>
            </ul>
            <div class="dr-catpanel__side">
              <NuxtLink :to="subTo(catSec.id)" class="dr-catpanel__title">{{ catSec.title }}<DrIcon name="arrow" :size="20" /></NuxtLink>
              <div v-if="drSubsOf(catSec.id).length" class="dr-catpanel__subs">
                <NuxtLink v-for="s in drSubsOf(catSec.id)" :key="s.title" :to="subTo(catSec.id, s.title)">
                  {{ s.title }} <small>{{ s.total }}</small>
                </NuxtLink>
              </div>
              <div class="dr-catpanel__goods">
                <NuxtLink v-for="p in drSecProducts(catSec.id).slice(0, 4)" :key="p.id" :to="drPath(`/product/${p.id}`)">
                  <img :src="p.img" alt="" width="120" height="120" />
                  <span>{{ drShort(p.title) }}</span>
                  <b>{{ drMoney(drPriceOf(p, drFirstOn(p))) }}</b>
                </NuxtLink>
              </div>
              <div class="dr-catpanel__sets">
                <NuxtLink :to="{ path: drPath('/catalog'), query: { tag: 'new' } }"><DrIcon name="star" :size="18" />Новинки</NuxtLink>
                <NuxtLink :to="{ path: drPath('/catalog'), query: { tag: 'sale' } }"><DrIcon name="tag" :size="18" />Товары по акции</NuxtLink>
                <NuxtLink :to="drPath('/fermery')"><DrIcon name="farmer" :size="18" />Все фермеры</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="dr-main">
      <NuxtPage />
    </main>

    <footer class="dr-foot">
      <div class="dr-wrap dr-foot__grid">
        <div class="dr-foot__brand">
          <img src="/redesign/dereda/logo.png" alt="Дереда" width="200" height="58" />
          <p>Первый в Новосибирске сервис доставки деревенских продуктов напрямую от фермеров области. С 2012 года.</p>
          <div class="dr-foot__soc">
            <a :href="drContacts.vk" target="_blank" rel="noopener" aria-label="ВКонтакте"><DrIcon name="vk" :size="22" /></a>
            <a :href="drContacts.ok" target="_blank" rel="noopener" aria-label="Одноклассники"><DrIcon name="ok" :size="22" /></a>
            <a :href="drContacts.telegram" target="_blank" rel="noopener" aria-label="Telegram"><DrIcon name="telegram" :size="22" /></a>
            <a :href="drContacts.whatsappGroup" target="_blank" rel="noopener" aria-label="Группа в WhatsApp"><DrIcon name="whatsapp" :size="22" /></a>
          </div>
        </div>
        <nav aria-label="Покупателям">
          <h3>Покупателям</h3>
          <NuxtLink :to="drPath('/dostavka')">Оплата и доставка</NuxtLink>
          <NuxtLink :to="drPath('/dostavka#reglament')">Регламент работы</NuxtLink>
          <NuxtLink :to="drPath('/akcii')">Акции и скидки</NuxtLink>
          <NuxtLink :to="drPath('/o-nas#ceny')">Почему такие цены</NuxtLink>
          <NuxtLink :to="drPath('/o-nas#kachestvo')">Качество</NuxtLink>
          <NuxtLink :to="drPath('/otzyvy')">Отзывы</NuxtLink>
        </nav>
        <nav aria-label="Магазин">
          <h3>Дереда</h3>
          <NuxtLink :to="drPath('/o-nas')">О нас</NuxtLink>
          <NuxtLink :to="drPath('/fermery')">Наши фермеры</NuxtLink>
          <NuxtLink :to="drPath('/novosti')">Новости</NuxtLink>
          <NuxtLink :to="drPath('/o-nas#postavshchikam')">Поставщикам</NuxtLink>
          <NuxtLink :to="drPath('/o-nas#partnery')">Партнёры</NuxtLink>
          <NuxtLink :to="drPath('/o-nas#zdorovie')">Про здоровье</NuxtLink>
        </nav>
        <div class="dr-foot__contacts">
          <h3>Контакты</h3>
          <a :href="drContacts.tel" class="dr-foot__phone">{{ drContacts.phone }}</a>
          <a :href="`mailto:${drContacts.email}`">{{ drContacts.email }}</a>
          <span>Самовывоз: {{ drContacts.address }}, {{ drContacts.office }}</span>
          <span>Доставка: {{ drContacts.delivery }}</span>
          <span class="dr-foot__pay"><DrIcon name="cash" :size="18" />Оплата наличными или переводом при получении</span>
        </div>
      </div>
      <div class="dr-wrap dr-foot__legal">
        <span>© 2012–{{ year }} Дереда. Тексты, цены и изображения принадлежат владельцу магазина dereda.ru.</span>
        <span>Концепт редизайна, не официальный сайт.</span>
      </div>
    </footer>

    <nav class="dr-tabbar" aria-label="Разделы">
      <NuxtLink :to="drPath('/')" :class="{ 'is-on': route.path === drPath('/') }"><DrIcon name="home" :size="23" /><span>Главная</span></NuxtLink>
      <NuxtLink :to="drPath('/catalog')" :class="{ 'is-on': route.path.startsWith(drPath('/catalog')) }">
        <DrIcon name="grid" :size="23" /><span>Каталог</span>
      </NuxtLink>
      <NuxtLink :to="drPath('/fermery')" :class="{ 'is-on': isMenu('/fermery') }"><DrIcon name="farmer" :size="23" /><span>Фермеры</span></NuxtLink>
      <NuxtLink :to="drPath('/izbrannoe')" :class="{ 'is-on': isMenu('/izbrannoe') }">
        <DrIcon name="heart" :size="23" /><span>Избранное</span><i v-if="shop.fav.value.length">{{ shop.fav.value.length }}</i>
      </NuxtLink>
      <NuxtLink :to="drPath('/cart')" class="dr-tabbar__cart" :class="{ 'is-on': isMenu('/cart') }">
        <DrIcon name="basket" :size="23" />
        <span>{{ shop.count.value ? drMoney(shop.goods.value) : 'Корзина' }}</span>
        <i v-if="shop.count.value">{{ shop.count.value }}</i>
      </NuxtLink>
    </nav>

    <div class="dr-chat" :class="{ 'is-shown': scrolled || chat }">
      <div v-if="chat" class="dr-chat__pop">
        <b>Напишите нам</b>
        <a :href="drContacts.whatsapp" target="_blank" rel="noopener"><DrIcon name="whatsapp" :size="22" />WhatsApp</a>
        <a :href="drContacts.vkMessage" target="_blank" rel="noopener"><DrIcon name="vk" :size="22" />ВКонтакте</a>
        <a :href="drContacts.bot" target="_blank" rel="noopener"><DrIcon name="telegram" :size="22" />Telegram-бот</a>
      </div>
      <button type="button" class="dr-chat__btn" :aria-expanded="chat" aria-label="Написать в мессенджер" @click="chat = !chat">
        <DrIcon :name="chat ? 'close' : 'chat'" :size="26" />
      </button>
    </div>

    <Transition name="dr-fade">
      <div v-if="ui.toast.value" class="dr-toast" role="status">
        <span>{{ ui.toast.value }}</span>
        <NuxtLink v-if="ui.toastCart.value" :to="drPath('/cart')">Оформить</NuxtLink>
      </div>
    </Transition>

    <!-- Мобильное меню -->
    <div v-if="ui.menu.value" class="dr-drawer" @click.self="ui.menu.value = false">
      <aside class="dr-drawer__panel" aria-label="Меню">
        <div class="dr-drawer__head">
          <b>Меню</b>
          <button type="button" aria-label="Закрыть меню" @click="ui.menu.value = false"><DrIcon name="close" :size="24" /></button>
        </div>
        <nav class="dr-drawer__menu">
          <NuxtLink v-for="m in drMenu" :key="m.to" :to="drPath(m.to)">{{ m.label }}</NuxtLink>
          <NuxtLink :to="drPath('/fermery')">Наши фермеры</NuxtLink>
          <NuxtLink :to="drPath('/kabinet')">{{ shop.user.value ? 'Личный кабинет' : 'Войти' }}</NuxtLink>
        </nav>
        <h3>Каталог</h3>
        <div class="dr-drawer__cats">
          <div v-for="s in drSections" :key="s.id" class="dr-drawer__cat">
            <div class="dr-drawer__catrow">
              <NuxtLink :to="subTo(s.id)">{{ s.title }}</NuxtLink>
              <button
                v-if="drSubsOf(s.id).length"
                type="button"
                :aria-expanded="mobOpen === s.id"
                :aria-label="`Подразделы: ${s.title}`"
                @click="mobOpen = mobOpen === s.id ? '' : s.id"
              >
                <DrIcon :name="mobOpen === s.id ? 'minus' : 'plus'" :size="20" />
              </button>
            </div>
            <div v-if="mobOpen === s.id" class="dr-drawer__subs">
              <NuxtLink v-for="x in drSubsOf(s.id)" :key="x.title" :to="subTo(s.id, x.title)">{{ x.title }}</NuxtLink>
            </div>
          </div>
        </div>
        <div class="dr-drawer__contacts">
          <a :href="drContacts.tel" class="dr-drawer__phone">{{ drContacts.phone }}</a>
          <a :href="`mailto:${drContacts.email}`">{{ drContacts.email }}</a>
          <button type="button" class="dr-btn dr-btn--line" @click="ui.callback.value = true; ui.menu.value = false">Обратный звонок</button>
          <div class="dr-drawer__msg">
            <a :href="drContacts.whatsapp" target="_blank" rel="noopener"><DrIcon name="whatsapp" :size="20" />WhatsApp</a>
            <a :href="drContacts.telegramPost" target="_blank" rel="noopener"><DrIcon name="telegram" :size="20" />Telegram</a>
            <a :href="drContacts.vkMessage" target="_blank" rel="noopener"><DrIcon name="vk" :size="20" />ВКонтакте</a>
          </div>
        </div>
      </aside>
    </div>

    <!-- Обратный звонок -->
    <div v-if="ui.callback.value" class="dr-modal" @click.self="ui.callback.value = false">
      <div class="dr-modal__box" role="dialog" aria-modal="true" aria-label="Обратный звонок">
        <button type="button" class="dr-modal__close" aria-label="Закрыть" @click="ui.callback.value = false"><DrIcon name="close" :size="22" /></button>
        <template v-if="!cb.sent">
          <h2>Обратный звонок</h2>
          <p class="dr-muted">Перезвоним в рабочее время офиса: {{ drContacts.office }}.</p>
          <form class="dr-form" @submit.prevent="sendCb">
            <label class="dr-field"><span>Имя</span><input v-model="cb.name" autocomplete="name" /></label>
            <label class="dr-field"><span>Телефон *</span><DrPhone v-model="cb.phone" required /></label>
            <label class="dr-field"><span>Сообщение</span><textarea v-model="cb.text" rows="3" /></label>
            <label class="dr-check"><input v-model="cb.agree" type="checkbox" /><span>Согласен с условиями оферты и политики конфиденциальности</span></label>
            <button type="submit" class="dr-btn dr-btn--main" :disabled="cb.phone.replace(/\D/g, '').length < 11 || !cb.agree">Перезвоните мне</button>
          </form>
        </template>
        <div v-else class="dr-done">
          <DrIcon name="check" :size="36" />
          <h2>Заявка принята</h2>
          <p>Это демо: в концепте заявка никуда не уходит. На сайте магазина её получит оператор.</p>
          <button type="button" class="dr-btn dr-btn--line" @click="ui.callback.value = false">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- Предзаказ -->
    <div v-if="preProduct" class="dr-modal" @click.self="ui.preorder.value = ''">
      <div class="dr-modal__box" role="dialog" aria-modal="true" aria-label="Предзаказ">
        <button type="button" class="dr-modal__close" aria-label="Закрыть" @click="ui.preorder.value = ''"><DrIcon name="close" :size="22" /></button>
        <template v-if="!pre.sent">
          <h2>Предзаказ</h2>
          <div class="dr-modal__product">
            <img :src="preProduct.img" alt="" width="64" height="64" />
            <span>
              <b>{{ drShort(preProduct.title) }}</b>
              <small>{{ drFarmer(preProduct.farmer)?.name ?? 'Сейчас нет в наличии' }}</small>
            </span>
          </div>
          <p class="dr-muted">Фермер делает под заказ — сообщим, когда товар появится, и добавим его в ближайшую доставку.</p>
          <form class="dr-form" @submit.prevent="sendPre">
            <label class="dr-field"><span>Имя</span><input v-model="pre.name" autocomplete="name" /></label>
            <label class="dr-field"><span>Телефон *</span><DrPhone v-model="pre.phone" required /></label>
            <label class="dr-check"><input v-model="pre.agree" type="checkbox" /><span>Согласен с условиями оферты и политики конфиденциальности</span></label>
            <button type="submit" class="dr-btn dr-btn--main" :disabled="pre.phone.replace(/\D/g, '').length < 11 || !pre.agree">Оставить предзаказ</button>
          </form>
        </template>
        <div v-else class="dr-done">
          <DrIcon name="check" :size="36" />
          <h2>Предзаказ оставлен</h2>
          <p>Это демо: в концепте заявка никуда не уходит.</p>
          <button type="button" class="dr-btn dr-btn--line" @click="ui.preorder.value = ''">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.dr-body {
  background: #fff;
}
html.dr-html {
  scroll-padding-top: calc(var(--dr-stuck, 110px) + 16px);
}
html.dr-lock {
  overflow: hidden;
}

.dr {
  --dr-accent: #d23f22;
  --dr-accent-hover: #b8341b;
  --dr-accent-soft: #fdeee9;
  --dr-brown: #6b3527;
  --dr-dark: #3a2420;
  --dr-text: #2e2523;
  --dr-muted: #7a6e69;
  --dr-surface: #f4f4f2;
  --dr-surface-2: #ebeae7;
  --dr-line: #e4e0dc;
  --dr-green: #1f7d63;
  --dr-green-soft: #e3f1ec;
  --dr-card: #fff;
  --dr-r: 12px;
  --dr-R: 22px;
  --dr-head: 'Yeseva One', Georgia, serif;
  --dr-pop: 0 2px 6px rgba(58, 36, 32, 0.08), 0 22px 54px rgba(58, 36, 32, 0.2);
  min-height: 100vh;
  background: #fff;
  color: var(--dr-text);
  font-family: 'Source Sans 3', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
  color-scheme: light;

  @media (max-width: 989px) {
    padding-bottom: 66px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

:where(.dr) h1,
:where(.dr) h2,
:where(.dr) h3,
:where(.dr) p,
:where(.dr) figure,
:where(.dr) dl,
:where(.dr) dd,
:where(.dr) ol,
:where(.dr) ul,
:where(.dr) blockquote {
  margin: 0;
}
:where(.dr) ol,
:where(.dr) ul {
  padding: 0;
  list-style: none;
}
:where(.dr) h1,
:where(.dr) h2 {
  color: var(--dr-brown);
  font-family: var(--dr-head);
  font-weight: 400;
  line-height: 1.12;
  font-variant-numeric: normal;
}
:where(.dr) h1 {
  font-size: clamp(30px, 3.6vw, 48px);
  text-wrap: balance;
}
:where(.dr) h2 {
  font-size: clamp(26px, 2.6vw, 36px);
}
:where(.dr) h3 {
  color: var(--dr-dark);
  font-size: 19px;
  font-weight: 700;
  line-height: 1.3;
}
:where(.dr) a {
  color: inherit;
  text-decoration: none;
}
:where(.dr) img {
  display: block;
  max-width: 100%;
  height: auto;
}
:where(.dr) button {
  font: inherit;
}

.dr-wrap {
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }

  @media (max-width: 375px) {
    padding-left: 16px;
    padding-right: 16px;
  }
}

.dr-muted {
  color: var(--dr-muted);
}

.dr-link {
  padding: 0;
  border: 0;
  background: none;
  color: var(--dr-accent);
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: 576px) {
  .dr-hide-s {
    display: none;
  }
}
@media (max-width: 375px) {
  .dr-hide-xs {
    display: none;
  }
}
@media (max-width: 768px) {
  .dr-hide-m {
    display: none !important;
  }
}

// Кнопки
.dr-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: var(--dr-r);
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;

  &--main {
    background: var(--dr-accent);
    color: #fff;

    &:hover {
      background: var(--dr-accent-hover);
    }

    &:disabled {
      background: var(--dr-surface-2);
      color: var(--dr-muted);
      cursor: not-allowed;
    }
  }

  &--line,
  &--line:focus,
  &--line:active {
    border: 1px solid var(--dr-line);
    background: #fff;
    color: var(--dr-dark);

    &:hover {
      border-color: var(--dr-brown);
    }
  }

  &--soft {
    background: var(--dr-accent-soft);
    color: var(--dr-accent-hover);

    &:hover {
      background: #fbdcd2;
    }
  }

  &--big {
    height: 54px;
    padding: 0 28px;
    font-size: 17px;
  }
}

// Метки на фото
.dr-mark {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 9px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;

  &--sale {
    background: var(--dr-accent);
    color: #fff;
  }

  &--new {
    background: #fff;
    color: var(--dr-green);
  }

  &--out {
    background: rgba(255, 255, 255, 0.94);
    color: var(--dr-dark);
  }
}

// Поля форм
.dr-form {
  display: grid;
  gap: 14px;
}
.dr-field {
  display: grid;
  gap: 8px;
  min-width: 0;

  > span {
    color: var(--dr-dark);
    font-size: 14px;
    font-weight: 600;
  }

  input,
  select,
  textarea {
    width: 100%;
    min-width: 0;
    height: 48px;
    padding: 0 14px;
    border: 1px solid var(--dr-line);
    border-radius: var(--dr-r);
    background: #fff;
    color: var(--dr-text);
    font: inherit;
    outline: none;

    &:focus {
      border-color: var(--dr-brown);
      box-shadow: 0 0 0 3px rgba(107, 53, 39, 0.12);
    }
  }

  textarea {
    height: auto;
    padding: 12px 14px;
    resize: vertical;
  }

  select {
    appearance: none;
    padding-right: 40px;
    background: #fff
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236b3527' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")
      no-repeat right 14px center;
  }
}
.dr-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 15px;
  line-height: 1.4;
  cursor: pointer;

  input {
    flex: none;
    width: 20px;
    height: 20px;
    margin: 0;
    accent-color: var(--dr-accent);
  }
}

// Общие блоки страниц
.dr-page {
  padding-top: 28px;
  padding-bottom: 72px;

  @media (max-width: 768px) {
    padding-top: 18px;
    padding-bottom: 48px;
  }
}
.dr-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  margin-bottom: 14px;
  color: var(--dr-muted);
  font-size: 14px;

  a:hover {
    color: var(--dr-accent);
  }

  span::before {
    content: '/';
    margin-right: 8px;
  }
}
.dr-sec {
  padding-top: 56px;

  @media (max-width: 768px) {
    padding-top: 40px;
  }
}
.dr-sechead {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px 20px;
  margin-bottom: 22px;

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--dr-accent);
    font-weight: 600;
  }
}
.dr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 28px 20px;

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 12px;
  }
}
.dr-panel {
  padding: 28px;
  border-radius: var(--dr-R);
  background: var(--dr-surface);

  @media (max-width: 576px) {
    padding: 20px;
  }
}
.dr-empty {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 48px 20px;
  border-radius: var(--dr-R);
  background: var(--dr-surface);
  text-align: center;

  img {
    width: 120px;
  }
}
.dr-done {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 12px 0;
  text-align: center;

  > svg {
    width: 56px;
    height: 56px;
    padding: 10px;
    border-radius: 50%;
    background: var(--dr-green-soft);
    color: var(--dr-green);
  }
}
.dr-prose {
  display: grid;
  gap: 14px;
  max-width: 760px;
  font-size: 17px;
  line-height: 1.6;
}

// Баннер концепта
.dr-banner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
  padding: 8px 16px;
  background: var(--dr-dark);
  color: #fff;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;

  a {
    color: #ffd2c4;
    font-weight: 700;
    text-decoration: underline;
  }
}

// Шапка
.dr-head {
  position: sticky;
  z-index: 40;
  background: #fff;
  box-shadow: 0 1px 0 var(--dr-line);

  &__top {
    border-bottom: 1px solid var(--dr-line);
    font-size: 15px;

    @media (max-width: 989px) {
      display: none;
    }
  }

  &__toprow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    min-height: 42px;
  }

  &__menu {
    display: flex;
    gap: 2px;

    a {
      padding: 10px 10px;
      color: var(--dr-dark);
      font-weight: 600;
      white-space: nowrap;

      &:first-child {
        padding-left: 0;
      }

      &:hover,
      &.is-on {
        color: var(--dr-accent);
      }
    }
  }

  &__contacts {
    display: flex;
    align-items: center;
    gap: 18px;
    white-space: nowrap;

    a:hover {
      color: var(--dr-accent);
    }

    @media (max-width: 1199px) {
      > a:not(.dr-head__phone) {
        display: none;
      }
    }
  }

  &__tg {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__phone {
    color: var(--dr-dark);
    font-weight: 700;
  }

  &__main {
    position: relative;
  }

  &__bar {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 80px;

    @media (max-width: 989px) {
      min-height: 64px;
      gap: 8px;
    }
  }

  &__burger {
    display: none;
    place-items: center;
    width: 44px;
    height: 44px;
    margin-left: -8px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--dr-dark);
    cursor: pointer;

    @media (max-width: 989px) {
      display: grid;
    }
  }

  &__icons {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
  }

  &__strip {
    background: var(--dr-accent-soft);
    color: var(--dr-dark);
    font-size: 15px;
  }

  &__striprow {
    display: flex;
    align-items: center;
    gap: 6px 22px;
    min-height: 38px;
    white-space: nowrap;

    @media (max-width: 768px) {
      justify-content: space-between;
      font-size: 14px;
    }
  }

  &__deliv {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--dr-accent-hover);

    svg {
      flex: none;
    }
  }

  &__next {
    overflow: hidden;
    text-overflow: ellipsis;

    em {
      color: var(--dr-accent-hover);
      font-style: normal;
      font-weight: 600;
    }
  }

  &__zones {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    margin-left: auto;
    color: var(--dr-accent-hover);
    font-weight: 600;
  }
}

.dr-logo {
  flex: none;
  display: block;

  img {
    width: 174px;
    height: auto;

    @media (max-width: 1199px) {
      width: 150px;
    }

    @media (max-width: 989px) {
      width: 136px;
    }

    @media (max-width: 375px) {
      width: 118px;
    }
  }
}

.dr-catbtn {
  flex: none;

  @media (max-width: 989px) {
    display: none;
  }
}

.dr-search {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
  height: 48px;
  padding-left: 14px;
  border: 1px solid var(--dr-line);
  border-radius: var(--dr-r);
  background: var(--dr-surface);
  color: var(--dr-muted);

  &:focus-within {
    border-color: var(--dr-brown);
    background: #fff;
  }

  input {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0 10px;
    border: 0;
    background: none;
    color: var(--dr-text);
    font: inherit;
    outline: none;
  }

  &__go {
    height: 38px;
    margin-right: 4px;
    padding: 0 16px;
    border: 0;
    border-radius: 9px;
    background: var(--dr-brown);
    color: #fff;
    font-weight: 600;
    cursor: pointer;

    @media (max-width: 576px) {
      display: none;
    }
  }

  &__pop {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: 5;
    display: grid;
    gap: 2px;
    padding: 10px;
    border: 1px solid var(--dr-line);
    border-radius: var(--dr-R);
    background: #fff;
    box-shadow: var(--dr-pop);
    color: var(--dr-text);

    > p {
      padding: 4px 8px;
      color: var(--dr-muted);
      font-size: 14px;
    }
  }

  &__pop-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 4px 8px 6px;

    button {
      height: 34px;
      padding: 0 14px;
      border: 0;
      border-radius: 999px;
      background: var(--dr-surface);
      color: var(--dr-dark);
      cursor: pointer;

      &:hover {
        background: var(--dr-accent-soft);
      }
    }
  }

  &__hit {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 6px 8px;
    border-radius: 10px;

    &:hover {
      background: var(--dr-surface);
    }

    img {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
    }

    span {
      display: grid;
      min-width: 0;
    }

    b {
      overflow: hidden;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      color: var(--dr-brown);
      font-size: 13px;
    }

    em {
      font-style: normal;
      font-weight: 700;
    }
  }

  &__all {
    height: 40px;
    margin-top: 4px;
    border: 0;
    border-radius: 10px;
    background: var(--dr-surface);
    color: var(--dr-accent);
    font-weight: 600;
    cursor: pointer;
  }

  @media (max-width: 989px) {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 64px;
    height: 46px;
  }

  @media (max-width: 375px) {
    left: 16px;
    right: 16px;
  }
}

@media (max-width: 989px) {
  // строка со знаком 64 px + поиск 46 px + отступ 12 px снизу; поиск стоит абсолютом с top: 64px
  .dr-head__bar {
    position: relative;
    min-height: 122px;
    padding-top: 10px;
    padding-bottom: 58px;
  }
}

.dr-hicon {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 2px;
  min-width: 64px;
  padding: 4px 6px;
  color: var(--dr-dark);
  font-size: 13px;
  font-weight: 600;

  span {
    max-width: 84px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  i {
    position: absolute;
    top: -2px;
    right: 12px;
    min-width: 19px;
    height: 19px;
    padding: 0 5px;
    border-radius: 10px;
    background: var(--dr-accent);
    color: #fff;
    font-size: 12px;
    font-style: normal;
    line-height: 19px;
    text-align: center;
  }

  &:hover,
  &.is-on {
    color: var(--dr-accent);
  }

  &--call {
    display: none;
  }

  @media (max-width: 1199px) {
    min-width: 46px;

    span {
      display: none;
    }

    i {
      right: 2px;
    }
  }

  @media (max-width: 989px) {
    &--farm,
    &--fav,
    &--user {
      display: none;
    }

    &--call {
      display: grid;
    }
  }
}

.dr-cartbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 148px;
  height: 48px;
  margin-left: 6px;
  border-radius: var(--dr-r);
  background: var(--dr-surface);
  color: var(--dr-dark);
  font-weight: 700;
  white-space: nowrap;

  &.is-full {
    background: var(--dr-accent-soft);
    color: var(--dr-accent-hover);
  }

  i {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 21px;
    height: 21px;
    padding: 0 6px;
    border-radius: 11px;
    background: var(--dr-accent);
    color: #fff;
    font-size: 12px;
    font-style: normal;
    line-height: 21px;
    text-align: center;
  }

  @media (max-width: 989px) {
    display: none;
  }
}

// Каталог-панель
.dr-catpanel {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  z-index: 3;
  border-top: 1px solid var(--dr-line);
  background: #fff;
  box-shadow: 0 30px 50px rgba(58, 36, 32, 0.16);

  &__in {
    display: grid;
    grid-template-columns: 330px minmax(0, 1fr);
    gap: 32px;
    padding-top: 20px;
    padding-bottom: 26px;
  }

  &__list a {
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    margin-bottom: 3px;
    padding: 5px 10px 5px 6px;
    border-radius: 10px;
    font-weight: 600;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    small {
      color: var(--dr-muted);
      font-weight: 500;
    }

    &.is-on {
      background: var(--dr-accent-soft);
      color: var(--dr-accent-hover);
    }
  }

  &__side {
    display: grid;
    align-content: start;
    gap: 18px;
  }

  &__title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--dr-brown);
    font-family: var(--dr-head);
    font-size: 30px;
  }

  &__subs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    a {
      padding: 8px 14px;
      border-radius: 999px;
      background: var(--dr-surface);
      font-weight: 600;

      small {
        color: var(--dr-muted);
        font-weight: 500;
      }

      &:hover {
        background: var(--dr-accent-soft);
      }
    }
  }

  &__goods {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;

    a {
      display: grid;
      gap: 6px;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.3;
    }

    img {
      width: 100%;
      aspect-ratio: 1;
      height: auto;
      border-radius: 14px;
      object-fit: cover;
    }

    span {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    b {
      font-size: 16px;
    }
  }

  &__sets {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 22px;
    padding-top: 14px;
    border-top: 1px solid var(--dr-line);

    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--dr-accent);
      font-weight: 600;
    }
  }

  @media (max-width: 1199px) {
    &__goods {
      grid-template-columns: repeat(3, minmax(0, 1fr));

      a:nth-child(4) {
        display: none;
      }
    }
  }
}

// Подвал
.dr-foot {
  margin-top: 24px;
  padding-top: 48px;
  border-top: 1px solid var(--dr-line);
  background: var(--dr-surface);

  &__grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr 1.3fr;
    gap: 32px;

    h3 {
      margin-bottom: 12px;
      font-size: 16px;
    }

    nav,
    .dr-foot__contacts {
      display: grid;
      align-content: start;
      gap: 8px;
    }

    nav a:hover,
    .dr-foot__contacts a:hover {
      color: var(--dr-accent);
    }

    @media (max-width: 989px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 26px;
    }
  }

  &__brand {
    display: grid;
    align-content: start;
    gap: 14px;

    img {
      width: 180px;
    }

    p {
      color: var(--dr-muted);
    }
  }

  &__soc {
    display: flex;
    gap: 8px;

    a {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #fff;
      color: var(--dr-brown);

      &:hover {
        color: var(--dr-accent);
      }
    }
  }

  &__phone {
    color: var(--dr-dark);
    font-size: 20px;
    font-weight: 700;
  }

  &__pay {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    color: var(--dr-muted);

    svg {
      flex: none;
      margin-top: 3px;
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
    border-top: 1px solid var(--dr-line);
    color: var(--dr-muted);
    font-size: 14px;
  }
}

// Таббар
.dr-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 45;
  display: none;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid var(--dr-line);
  background: #fff;

  a {
    position: relative;
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 2px;
    min-width: 0;
    color: var(--dr-muted);
    font-size: 12px;
    font-weight: 600;

    span {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    i {
      position: absolute;
      top: 6px;
      left: calc(50% + 6px);
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      border-radius: 9px;
      background: var(--dr-accent);
      color: #fff;
      font-size: 11px;
      font-style: normal;
      line-height: 18px;
      text-align: center;
    }

    &.is-on {
      color: var(--dr-accent);
    }
  }

  &__cart span {
    color: var(--dr-dark);
    font-weight: 700;
  }

  @media (max-width: 989px) {
    display: grid;
  }
}

// Мессенджеры
.dr-chat {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 44;
  display: grid;
  justify-items: end;
  gap: 10px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(12px);
  transition:
    opacity 0.2s,
    transform 0.2s;

  &.is-shown {
    opacity: 1;
    pointer-events: auto;
    transform: none;
  }

  &__btn {
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: var(--dr-green);
    color: #fff;
    box-shadow: 0 10px 26px rgba(31, 125, 99, 0.35);
    cursor: pointer;
  }

  &__pop {
    display: grid;
    gap: 4px;
    min-width: 220px;
    padding: 14px;
    border: 1px solid var(--dr-line);
    border-radius: var(--dr-R);
    background: #fff;
    box-shadow: var(--dr-pop);

    b {
      padding: 0 8px 6px;
    }

    a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 8px;
      border-radius: 10px;
      font-weight: 600;

      &:hover {
        background: var(--dr-surface);
        color: var(--dr-green);
      }
    }
  }

  @media (max-width: 989px) {
    display: none;
  }
}

// Уведомление
.dr-toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: min(560px, calc(100vw - 32px));
  padding: 12px 14px 12px 20px;
  border-radius: 14px;
  background: var(--dr-dark);
  color: #fff;
  box-shadow: var(--dr-pop);
  transform: translateX(-50%);

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  a {
    flex: none;
    padding: 8px 14px;
    border-radius: 9px;
    background: var(--dr-accent);
    font-weight: 700;
  }

  @media (max-width: 989px) {
    bottom: 78px;
  }
}
.dr-fade-enter-active,
.dr-fade-leave-active {
  transition: opacity 0.2s;
}
.dr-fade-enter-from,
.dr-fade-leave-to {
  opacity: 0;
}

// Мобильное меню
.dr-drawer {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: rgba(30, 20, 18, 0.45);

  &__panel {
    width: min(380px, 92vw);
    height: 100%;
    overflow-y: auto;
    padding: 0 20px 28px;
    background: #fff;

    h3 {
      margin: 18px 0 6px;
    }
  }

  &__head {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    border-bottom: 1px solid var(--dr-line);
    background: #fff;
    font-size: 18px;

    button {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      margin-right: -10px;
      padding: 0;
      border: 0;
      background: none;
      color: var(--dr-dark);
      cursor: pointer;
    }
  }

  &__menu {
    display: grid;
    padding: 8px 0;
    border-bottom: 1px solid var(--dr-line);

    a {
      padding: 9px 0;
      font-weight: 600;
    }
  }

  &__catrow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 44px;
    border-bottom: 1px solid var(--dr-surface-2);

    a {
      flex: 1;
      padding: 10px 0;
    }

    button {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      padding: 0;
      border: 0;
      background: none;
      color: var(--dr-brown);
      cursor: pointer;
    }
  }

  &__subs {
    display: grid;
    padding: 4px 0 8px 14px;

    a {
      padding: 7px 0;
      color: var(--dr-muted);
    }
  }

  &__contacts {
    display: grid;
    gap: 10px;
    margin-top: 22px;
  }

  &__phone {
    font-size: 20px;
    font-weight: 700;
  }

  &__msg {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;

    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--dr-green);
      font-weight: 600;
    }
  }
}

// Окна
.dr-modal {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 16px;
  overflow-y: auto;
  background: rgba(30, 20, 18, 0.5);

  &__box {
    position: relative;
    display: grid;
    gap: 14px;
    width: min(480px, 100%);
    padding: 32px;
    border-radius: var(--dr-R);
    background: #fff;

    @media (max-width: 576px) {
      padding: 24px 20px;
    }

    h2 {
      padding-right: 36px;
    }
  }

  &__close {
    position: absolute;
    top: 14px;
    right: 14px;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: var(--dr-surface);
    color: var(--dr-dark);
    cursor: pointer;
  }

  &__product {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border-radius: var(--dr-r);
    background: var(--dr-surface);

    img {
      width: 64px;
      height: 64px;
      border-radius: 10px;
      object-fit: cover;
    }

    span {
      display: grid;
    }

    small {
      color: var(--dr-brown);
    }
  }
}
</style>
