<script lang="ts" setup>
import { AP_ORIG, apAsset, apContacts, apCountText, apIcon, apImg, apMoney, apPath, apProduct, apRub, apSearch, apTopNav, apWeight, apWhen, apZoneList } from '~/utils/apeti'
import { apSections } from '~/utils/apetiData'
import type { ApProduct } from '~/utils/apetiData'
import { useApShop, useApUi } from '~/composables/useApeti'
import ApIcon from '~/components/redesign/apeti/ApIcon.vue'
import ApPhone from '~/components/redesign/apeti/ApPhone.vue'

const route = useRoute()
const router = useRouter()
const shop = useApShop()
const ui = useApUi()

useSeoMeta({
  title: 'Apeti — фермерские продукты с доставкой на дом | Концепт редизайна',
  description:
    'Концепт редизайна apeti.ru: фермерские продукты с Преображенского рынка с доставкой по Москве — весы на первом экране, цена за килограмм и порция, зона доставки с её минимальным заказом, окна по три часа, корзина с промокодом и баллами.',
  ogTitle: 'Apeti — концепт редизайна',
  ogDescription: 'Фермерские продукты с Преображенского рынка: весы на первом экране, цена за килограмм и порция, зоны доставки по Москве, заказ до 19:00 — сегодня.',
  ogImage: 'https://andryushov.me/redesign/apeti/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { lang: 'ru' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Jost:wght@500;600;700&display=swap' },
  ],
})

const year = new Date().getFullYear()
const isOn = (to: string) => route.path.replace(/\/$/, '') === apPath(to).replace(/\/$/, '')

// Липкая шапка: белая строка с районом и меню уезжает, строка «логотип · каталог · поиск · корзина» остаётся
const strip = ref<HTMLElement | null>(null)
const stick = ref(0)
const measure = () => {
  stick.value = strip.value?.offsetHeight ?? 0
}
const scrolled = ref(false)
const onScroll = () => {
  scrolled.value = window.scrollY > 700
}

// Ближайшая доставка — по московскому времени, только в браузере
const now = ref<Date | null>(null)
const when = computed(() => (now.value ? apWhen(now.value) : null))
let timer: ReturnType<typeof setInterval> | undefined

// Поиск с подсказками
const q = ref('')
const focus = ref(false)
const hints = computed(() => (q.value.trim().length > 1 ? apSearch(q.value, 6) : []))
const submitSearch = () => {
  const s = q.value.trim()
  if (!s) return
  focus.value = false
  ;(document.activeElement as HTMLElement | null)?.blur()
  router.push({ path: apPath('/catalog'), query: { q: s } })
}
const blurSearch = () => setTimeout(() => (focus.value = false), 180)

// Меню каталога
const hov = ref(0)
const hovSec = computed(() => apSections[hov.value])
const level = ref<string | null>(null)
const levelSec = computed(() => apSections.find((s) => s.slug === level.value))
const openMenu = () => {
  level.value = null
  ui.menu.value = true
}

// Формы — демо: ничего никуда не отправляется
const loginTab = ref<'in' | 'reg' | 'lost'>('in')
const form = reactive({ name: '', phone: '', mail: '', pass: '', ok: true, way: 'courier' })
const done = ref('')
const sub = ref('')
const subDone = ref(false)
const quickItems = computed<{ p: ApProduct; text: string }[]>(() => {
  const one = apProduct(ui.subject.value)
  if (one) return [{ p: one, text: apWeight(one, 1) }]
  return shop.lines.value.map((l) => ({ p: l.p, text: apWeight(l.p, l.n) }))
})
const send = (kind: string) => {
  if (kind === 'login') {
    shop.login(form.name.trim() || form.mail.trim().split('@')[0] || 'Покупатель')
    ui.modal.value = null
    shop.say('Вы вошли — это демо, баллы и заказы ненастоящие')
    return
  }
  done.value = kind
}
const close = () => {
  ui.modal.value = null
  done.value = ''
}
const favList = computed(() => shop.fav.value.map((id) => apProduct(id)).filter(Boolean) as ApProduct[])
const moscow = computed(() => apZoneList.filter((z) => !z.region))
const region = computed(() => apZoneList.filter((z) => z.region))
const pickZone = (i: number) => {
  shop.setZone(i)
  close()
}

let toastTimer: ReturnType<typeof setTimeout> | undefined
watch(
  () => shop.toast.value?.id,
  () => {
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => (shop.toast.value = null), 3600)
  },
)
const locked = computed(() => !!ui.modal.value || ui.menu.value)
watch(locked, (v) => {
  if (import.meta.client) document.documentElement.style.overflow = v ? 'hidden' : ''
})
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    ui.catalog.value = false
    ui.modal.value = null
    done.value = ''
    focus.value = false
    ;(document.activeElement as HTMLElement | null)?.blur?.()
    if (route.query.q === undefined) q.value = ''
  },
)
const onKey = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  close()
  ui.menu.value = false
  ui.catalog.value = false
}

onMounted(() => {
  shop.persist()
  measure()
  now.value = new Date()
  timer = setInterval(() => (now.value = new Date()), 30000)
  window.addEventListener('resize', measure)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  if (typeof route.query.q === 'string') q.value = route.query.q
})
onBeforeUnmount(() => {
  clearInterval(timer)
  clearTimeout(toastTimer)
  window.removeEventListener('resize', measure)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div class="ap">
    <div class="ap-concept">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="AP_ORIG" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="ap-header" :style="{ top: `-${stick}px` }">
      <div ref="strip" class="ap-strip">
        <div class="ap-wrap ap-strip__in">
          <button type="button" class="ap-zonebtn" @click="ui.open('zone')">
            <ApIcon name="pin" />
            <span class="ap-zonebtn__name">{{ shop.z.value ? shop.z.value.short : 'Куда везём?' }}</span>
            <span class="ap-zonebtn__min">заказ от {{ apRub(shop.min.value) }}</span>
            <ApIcon name="down" />
          </button>
          <p v-if="when" class="ap-strip__when">Ближайшая доставка: <b>{{ when.day }}, {{ when.slot }}</b></p>
          <p class="ap-strip__rate" title="Рейтинг магазина"><b>4,9</b><ApIcon v-for="i in 5" :key="i" name="star" /></p>
          <nav class="ap-strip__nav" aria-label="Меню">
            <NuxtLink v-for="n in apTopNav" :key="n.to" :to="apPath(n.to)" :class="{ 'is-hot': n.hot, 'is-on': isOn(n.to) }">{{ n.name }}</NuxtLink>
          </nav>
        </div>
      </div>

      <div class="ap-bar">
        <div class="ap-wrap ap-bar__in ap-header__row">
          <button type="button" class="ap-bar__burger" aria-label="Меню" @click="openMenu"><ApIcon name="menu" /></button>
          <NuxtLink :to="apPath('/')" class="ap-logo" aria-label="Apeti — на главную">
            <img :src="apAsset('logo.svg')" alt="Apeti" width="124" height="54" />
            <span>Доставка свежих<br />фермерских продуктов</span>
          </NuxtLink>
          <button type="button" class="ap-catbtn" :class="{ 'is-on': ui.catalog.value }" :aria-expanded="ui.catalog.value" @click="ui.catalog.value = !ui.catalog.value">
            <ApIcon :name="ui.catalog.value ? 'close' : 'grid'" />Каталог товаров
          </button>
          <form class="ap-search" role="search" @submit.prevent="submitSearch">
            <input v-model="q" type="search" placeholder="Поиск товаров" aria-label="Поиск по каталогу" autocomplete="off" @focus="focus = true" @blur="blurSearch" />
            <button type="submit" aria-label="Найти"><ApIcon name="search" /></button>
            <div v-if="focus && q.trim().length > 1" class="ap-search__drop">
              <NuxtLink v-for="p in hints" :key="p.id" :to="apPath(`/product/${p.id}`)" class="ap-search__hit">
                <img :src="apImg(p)" alt="" width="44" height="44" loading="lazy" />
                <span>{{ p.n }}</span>
                <b>{{ apMoney(p.k ? p.r : p.p) }}<small>{{ p.k ? '/кг' : '/шт' }}</small></b>
              </NuxtLink>
              <p v-if="!hints.length" class="ap-search__none">В выборке концепта такого нет — в магазине около 4 400 товаров</p>
              <button v-else type="submit" class="ap-search__all">Все результаты</button>
            </div>
          </form>
          <a :href="apContacts.phoneHref" class="ap-tel">
            <ApIcon name="phone" />
            <span><b>{{ apContacts.phone }}</b><small>{{ apContacts.hours }}</small></span>
          </a>
          <div class="ap-acts">
            <button type="button" class="ap-act" @click="shop.user.value ? router.push(apPath('/cart')) : ui.open('login')">
              <ApIcon name="user" /><span>{{ shop.user.value || 'Войти' }}</span>
            </button>
            <button type="button" class="ap-act ap-act--fav" @click="ui.open('fav')">
              <ApIcon name="heart" /><span>Избранное</span><i v-if="shop.fav.value.length">{{ shop.fav.value.length }}</i>
            </button>
            <NuxtLink :to="apPath('/cart')" class="ap-cartbtn" :class="{ 'is-full': shop.count.value }">
              <ApIcon name="cart" />
              <span>{{ shop.count.value ? apRub(shop.total.value) : 'Корзина' }}</span>
            </NuxtLink>
          </div>
        </div>

        <div v-if="ui.catalog.value" class="ap-mega">
          <div class="ap-wrap ap-mega__in">
            <ul class="ap-mega__secs">
              <li v-for="(s, i) in apSections" :key="s.slug">
                <NuxtLink :to="apPath(`/catalog/${s.slug}`)" :class="{ 'is-on': i === hov }" @mouseenter="hov = i" @focus="hov = i">
                  <img :src="apIcon(s.slug)" alt="" width="34" height="34" />{{ s.name }}
                </NuxtLink>
              </li>
            </ul>
            <div class="ap-mega__subs">
              <NuxtLink :to="apPath(`/catalog/${hovSec.slug}`)" class="ap-mega__title">
                {{ hovSec.name }}<small v-if="hovSec.count">{{ apCountText(hovSec) }} товаров</small>
              </NuxtLink>
              <ul v-if="hovSec.sub.length" class="ap-mega__list">
                <li v-for="x in hovSec.sub" :key="x.slug"><NuxtLink :to="apPath(`/catalog/${x.slug}`)">{{ x.name }}</NuxtLink></li>
              </ul>
              <p v-else class="ap-mega__empty">Все товары раздела — одним списком.</p>
              <NuxtLink :to="apPath(`/catalog/${hovSec.slug}`)" class="ap-link">Смотреть раздел <ApIcon name="right" /></NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div v-if="ui.catalog.value" class="ap-megashade" @click="ui.catalog.value = false" />

    <main class="ap-main">
      <NuxtPage />
    </main>

    <footer class="ap-footer">
      <div class="ap-wrap ap-footer__in">
        <div class="ap-footer__brand">
          <img :src="apAsset('logo.svg')" alt="Apeti" width="124" height="54" />
          <p>Доставка свежих фермерских продуктов с Преображенского рынка по Москве и до 30 км от МКАД.</p>
          <a :href="apContacts.phoneHref" class="ap-footer__tel">{{ apContacts.phone }}</a>
          <p>{{ apContacts.hours }}</p>
          <a :href="`mailto:${apContacts.emails[0].mail}`">{{ apContacts.emails[0].mail }}</a>
        </div>
        <nav aria-label="Каталог">
          <h3>Каталог</h3>
          <NuxtLink v-for="s in apSections.slice(0, 8)" :key="s.slug" :to="apPath(`/catalog/${s.slug}`)">{{ s.name }}</NuxtLink>
          <NuxtLink :to="apPath('/catalog')">Все разделы</NuxtLink>
        </nav>
        <nav aria-label="Покупателям">
          <h3>Покупателям</h3>
          <NuxtLink :to="apPath('/delivery')">Доставка и оплата</NuxtLink>
          <NuxtLink :to="apPath('/delivery#return')">Возврат и обмен</NuxtLink>
          <NuxtLink :to="apPath('/catalog/skidki')">Скидки</NuxtLink>
          <NuxtLink :to="apPath('/sale')">Акции</NuxtLink>
          <NuxtLink :to="apPath('/blog')">Блог</NuxtLink>
          <button type="button" @click="ui.open('callback')">Заказать звонок</button>
        </nav>
        <nav aria-label="Компания">
          <h3>Компания</h3>
          <NuxtLink :to="apPath('/about')">О компании</NuxtLink>
          <NuxtLink :to="apPath('/contacts')">Контакты</NuxtLink>
          <NuxtLink :to="apPath('/about#suppliers')">Поставщикам</NuxtLink>
          <NuxtLink :to="apPath('/job')">Вакансии</NuxtLink>
          <a v-for="s in apContacts.social" :key="s.name" :href="s.href" target="_blank" rel="noopener">{{ s.name }}</a>
        </nav>
        <div class="ap-footer__sub">
          <h3>Акции и новинки — на почту</h3>
          <form v-if="!subDone" class="ap-subform" @submit.prevent="subDone = true">
            <input v-model="sub" type="email" required placeholder="Ваш e-mail" aria-label="E-mail для рассылки" />
            <button type="submit" class="ap-btn">Подписаться</button>
          </form>
          <p v-else class="ap-footer__ok">Готово. Это демо — адрес никуда не отправлен.</p>
          <p>Оплата курьеру: наличными или картой — Mastercard, Visa, SberPay.</p>
        </div>
      </div>
      <div class="ap-wrap ap-footer__legal">
        <p>© {{ year }} {{ apContacts.legal }}. Тексты, цены и изображения принадлежат владельцу магазина apeti.ru.</p>
        <p>Концепт редизайна — <NuxtLink to="/redesign/">andryushov.me/redesign</NuxtLink>. Цены и ассортимент сняты с сайта 10.11.2026, в каталоге — выборка.</p>
      </div>
    </footer>

    <!-- мобильная навигация -->
    <nav class="ap-tabbar" aria-label="Быстрая навигация">
      <button type="button" @click="openMenu"><ApIcon name="grid" /><span>Каталог</span></button>
      <NuxtLink :to="apPath('/catalog/skidki')"><ApIcon name="bolt" /><span>Скидки</span></NuxtLink>
      <button type="button" @click="ui.open('fav')"><ApIcon name="heart" /><span>Избранное</span><i v-if="shop.fav.value.length">{{ shop.fav.value.length }}</i></button>
      <NuxtLink :to="apPath('/cart')" :class="{ 'is-full': shop.count.value }"><ApIcon name="cart" /><span>{{ shop.count.value ? apRub(shop.total.value) : 'Корзина' }}</span></NuxtLink>
    </nav>

    <!-- мобильное меню по уровням, как у оригинала: раздел → подразделы, «Вернуться назад» -->
    <div v-if="ui.menu.value" class="ap-drawer" @click.self="ui.menu.value = false">
      <div class="ap-drawer__panel" role="dialog" aria-label="Меню">
        <div class="ap-drawer__head">
          <b>{{ levelSec ? levelSec.name : 'Каталог товаров' }}</b>
          <button type="button" aria-label="Закрыть" @click="ui.menu.value = false"><ApIcon name="close" /></button>
        </div>
        <div v-if="levelSec" class="ap-drawer__body">
          <button type="button" class="ap-drawer__back" @click="level = null"><ApIcon name="left" />Вернуться назад</button>
          <NuxtLink :to="apPath(`/catalog/${levelSec.slug}`)" class="ap-drawer__all">Все товары раздела</NuxtLink>
          <NuxtLink v-for="x in levelSec.sub" :key="x.slug" :to="apPath(`/catalog/${x.slug}`)">{{ x.name }}</NuxtLink>
        </div>
        <div v-else class="ap-drawer__body">
          <template v-for="s in apSections" :key="s.slug">
            <button v-if="s.sub.length" type="button" class="ap-drawer__sec" @click="level = s.slug">
              <img :src="apIcon(s.slug)" alt="" width="30" height="30" />{{ s.name }}<ApIcon name="right" />
            </button>
            <NuxtLink v-else :to="apPath(`/catalog/${s.slug}`)" class="ap-drawer__sec"><img :src="apIcon(s.slug)" alt="" width="30" height="30" />{{ s.name }}</NuxtLink>
          </template>
          <div class="ap-drawer__more">
            <NuxtLink v-for="n in apTopNav" :key="n.to" :to="apPath(n.to)" :class="{ 'is-hot': n.hot }">{{ n.name }}</NuxtLink>
            <NuxtLink :to="apPath('/job')">Вакансии</NuxtLink>
            <button type="button" @click="shop.user.value ? router.push(apPath('/cart')) : ui.open('login')">{{ shop.user.value ? `Личный кабинет · ${shop.user.value}` : 'Личный кабинет' }}</button>
            <button type="button" @click="ui.open('callback')">Заказать звонок</button>
            <a :href="apContacts.phoneHref"><b>{{ apContacts.phone }}</b> · {{ apContacts.hours }}</a>
          </div>
        </div>
      </div>
    </div>

    <!-- окна -->
    <div v-if="ui.modal.value" class="ap-modal" @click.self="close">
      <div class="ap-modal__card" :class="`ap-modal__card--${ui.modal.value}`" role="dialog" aria-modal="true">
        <button type="button" class="ap-modal__x" aria-label="Закрыть" @click="close"><ApIcon name="close" /></button>

        <template v-if="ui.modal.value === 'zone'">
          <h2>Куда везём?</h2>
          <p class="ap-modal__lead">Минимальная сумма заказа и стоимость доставки зависят от района — это таблица со страницы «Доставка».</p>
          <div class="ap-zones">
            <h3>Москва</h3>
            <button v-for="z in moscow" :key="z.i" type="button" :class="{ 'is-on': z.i === shop.zone.value }" @click="pickZone(z.i)">
              <span>{{ z.name }}</span><em>от {{ apRub(z.min) }}</em><b>{{ apRub(z.fee) }}</b>
            </button>
            <h3>За МКАД, до 30 км</h3>
            <button v-for="z in region" :key="z.i" type="button" :class="{ 'is-on': z.i === shop.zone.value }" @click="pickZone(z.i)">
              <span>{{ z.name }}</span><em>от {{ apRub(z.min) }}</em><b>{{ apRub(z.fee) }}</b>
            </button>
          </div>
          <p class="ap-modal__note">Самовывоз с Преображенского рынка — на любую сумму.</p>
        </template>

        <template v-else-if="ui.modal.value === 'login'">
          <div class="ap-seg" role="tablist">
            <button type="button" :class="{ 'is-on': loginTab === 'in' }" @click="loginTab = 'in'">Вход</button>
            <button type="button" :class="{ 'is-on': loginTab === 'reg' }" @click="loginTab = 'reg'">Регистрация</button>
          </div>
          <form v-if="done !== 'lost'" class="ap-form" @submit.prevent="send(loginTab === 'lost' ? 'lost' : 'login')">
            <h2>{{ loginTab === 'in' ? 'Вход' : loginTab === 'reg' ? 'Регистрация' : 'Восстановить пароль' }}</h2>
            <label v-if="loginTab === 'reg'" class="ap-field"><span>Имя</span><input v-model="form.name" type="text" required autocomplete="name" /></label>
            <label class="ap-field"><span>E-mail</span><input v-model="form.mail" type="email" required autocomplete="email" /></label>
            <label v-if="loginTab !== 'lost'" class="ap-field"><span>Пароль</span><input v-model="form.pass" type="password" required minlength="4" autocomplete="off" /></label>
            <button type="submit" class="ap-btn ap-btn--big">{{ loginTab === 'in' ? 'Войти' : loginTab === 'reg' ? 'Зарегистрироваться' : 'Отправить новый пароль' }}</button>
            <button v-if="loginTab === 'in'" type="button" class="ap-link" @click="loginTab = 'lost'">Забыли пароль?</button>
            <p class="ap-modal__note">Демо: вход ненастоящий, введённые данные никуда не отправляются.</p>
          </form>
          <div v-else class="ap-done"><h2>Письмо отправлено</h2><p>В настоящем магазине на почту придёт новый пароль. Это демо.</p></div>
        </template>

        <template v-else-if="ui.modal.value === 'quick'">
          <div v-if="done === 'quick'" class="ap-done"><h2>Заказ оформлен</h2><p>В настоящем магазине менеджер свяжется с вами в ближайшее время. Это демо — заказ никуда не отправлен.</p></div>
          <form v-else class="ap-form" @submit.prevent="send('quick')">
            <h2>Купить в 1 клик</h2>
            <p class="ap-modal__lead">Оставьте данные, и наш оператор свяжется с вами.</p>
            <label class="ap-field"><span>Имя</span><input v-model="form.name" type="text" required autocomplete="name" /></label>
            <label class="ap-field"><span>Телефон</span><ApPhone v-model="form.phone" required /></label>
            <div class="ap-seg">
              <button type="button" :class="{ 'is-on': form.way === 'courier' }" @click="form.way = 'courier'">Доставка курьером</button>
              <button type="button" :class="{ 'is-on': form.way === 'pickup' }" @click="form.way = 'pickup'">Самовывоз</button>
            </div>
            <p class="ap-modal__note">{{ form.way === 'courier' ? `Доставка курьером доступна при заказе от ${apRub(shop.min.value)}.` : 'Заберёте на Преображенском рынке — заказ на любую сумму.' }}</p>
            <div class="ap-quick">
              <b>Товары в заказе:</b>
              <p v-for="x in quickItems" :key="x.p.id"><span>{{ x.p.n }}</span><em>{{ x.text }}</em></p>
            </div>
            <button type="submit" class="ap-btn ap-btn--big">Отправить</button>
          </form>
        </template>

        <template v-else-if="ui.modal.value === 'callback'">
          <div v-if="done === 'callback'" class="ap-done"><h2>Заявка принята</h2><p>В настоящем магазине оператор перезвонит с 8:00 до 20:00. Это демо — номер никуда не отправлен.</p></div>
          <form v-else class="ap-form" @submit.prevent="send('callback')">
            <h2>Заказать звонок</h2>
            <label class="ap-field"><span>Имя</span><input v-model="form.name" type="text" required autocomplete="name" /></label>
            <label class="ap-field"><span>Телефон</span><ApPhone v-model="form.phone" required /></label>
            <label class="ap-check"><input v-model="form.ok" type="checkbox" required /><span>Согласен с политикой конфиденциальности</span></label>
            <button type="submit" class="ap-btn ap-btn--big">Отправить</button>
          </form>
        </template>

        <template v-else-if="ui.modal.value === 'fav'">
          <h2>Избранное</h2>
          <p v-if="!favList.length" class="ap-modal__lead">Пока пусто. Нажмите на сердечко у товара — он появится здесь.</p>
          <div v-else class="ap-favlist">
            <div v-for="p in favList" :key="p.id">
              <NuxtLink :to="apPath(`/product/${p.id}`)"><img :src="apImg(p)" alt="" width="56" height="56" /><span>{{ p.n }}</span></NuxtLink>
              <b>{{ apMoney(p.k ? p.r : p.p) }}<small>{{ p.k ? '/кг' : '/шт' }}</small></b>
              <button type="button" class="ap-btn ap-btn--s" @click="shop.add(p, 1)">Купить</button>
              <button type="button" class="ap-favlist__x" aria-label="Убрать" @click="shop.toggleFav(p.id)"><ApIcon name="trash" /></button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <button v-if="scrolled && !locked" type="button" class="ap-callfab" @click="ui.open('callback')"><ApIcon name="phone" />Заказать звонок</button>

    <Transition name="ap-toast">
      <div v-if="shop.toast.value" :key="shop.toast.value.id" class="ap-toast" role="status">
        <ApIcon name="check" />
        <span>В корзине: {{ shop.toast.value.text }}</span>
        <NuxtLink :to="apPath('/cart')">Корзина</NuxtLink>
      </div>
    </Transition>

    <div v-if="!shop.cookie.value" class="ap-cookie">
      <p>Мы используем cookie-файлы для хранения данных. Продолжая работу с сайтом, вы даёте согласие на работу с этими файлами.</p>
      <button type="button" class="ap-btn ap-btn--s" @click="shop.okCookie()">OK</button>
    </div>
  </div>
</template>

<style lang="scss">
.ap {
  --ap-acc: #63751a; --ap-acc-d: #52620f; --ap-ink: #1c2110; --ap-mute: #666e57; --ap-sur: #f3f5ee; --ap-soft: #e8eed5;
  --ap-line: #e0e4d5; --ap-or: #d97300; --ap-or-d: #b85c00; --ap-or-soft: #fdf0df;
  --ap-head: 'Jost', 'Inter', system-ui, sans-serif; --ap-text: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --ap-r: 12px; --ap-R: 20px; --ap-bar: 76px;
  min-height: 100vh; background: #fff; color: var(--ap-ink); font: 400 15px/1.5 var(--ap-text); -webkit-font-smoothing: antialiased;
  scroll-padding-top: 100px;
}
:where(.ap) { p, h1, h2, h3, h4, dl, dd, figure { margin: 0; } a { color: inherit; text-decoration: none; } img { max-width: 100%; }
  button, input, select, textarea { font: inherit; color: inherit; } button { cursor: pointer; }
  h1, h2, h3 { font-family: var(--ap-head); font-weight: 600; line-height: 1.12; letter-spacing: -.01em; }
}
.ap ul[class] { list-style: none; }
.ap-wrap { max-width: 1360px; margin: 0 auto; padding-left: 32px; padding-right: 32px; box-sizing: border-box; }
.ap-main { display: block; min-height: 50vh; }
.ap-icon { width: 20px; height: 20px; flex: none; }

.ap-concept { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 12px; padding: 8px 16px; font-size: 13px; line-height: 1.4; text-align: center; background: var(--ap-ink); color: #dfe5cf;
  a { color: #fff; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
}

/* ---- кнопки и поля ---- */
.ap .ap-btn, .ap .ap-btn:focus { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 20px; border: 1px solid var(--ap-acc); border-radius: var(--ap-r); background: var(--ap-acc); color: #fff; font-weight: 600; font-size: 15px; white-space: nowrap; box-sizing: border-box; transition: background-color .15s, border-color .15s, color .15s;
  &:hover { background: var(--ap-acc-d); border-color: var(--ap-acc-d); }
  &:disabled { opacity: .5; cursor: default; }
}
.ap .ap-btn--big, .ap .ap-btn--big:focus { min-height: 52px; font-size: 16px; }
.ap .ap-btn--s, .ap .ap-btn--s:focus { min-height: 36px; padding: 0 14px; font-size: 14px; }
.ap .ap-btn--line, .ap .ap-btn--line:focus, .ap .ap-btn--line:active { background: #fff; color: var(--ap-ink); border-color: var(--ap-line);
  &:hover { background: #fff; border-color: var(--ap-acc); color: var(--ap-acc); }
}
.ap .ap-link, .ap .ap-link:focus { display: inline-flex; align-items: center; gap: 4px; padding: 0; border: 0; background: none; color: var(--ap-acc); font-weight: 600; font-size: 15px;
  .ap-icon { width: 18px; height: 18px; }
  &:hover { color: var(--ap-acc-d); }
}
.ap-field { display: grid; gap: 6px; align-content: start; font-size: 14px;
  > span { color: var(--ap-mute); }
  input, select, textarea { width: 100%; min-height: 46px; padding: 10px 14px; border: 1px solid var(--ap-line); border-radius: var(--ap-r); background: #fff; box-sizing: border-box; font-size: 15px; outline: none; appearance: none;
    &:focus { border-color: var(--ap-acc); }
  }
  select { padding-right: 38px; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231c2110' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") right 12px center / 18px no-repeat; }
  textarea { min-height: 96px; resize: vertical; }
}
.ap-check { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; line-height: 1.4; cursor: pointer;
  input { flex: none; width: 20px; height: 20px; margin: 0; accent-color: var(--ap-acc); }
}
.ap-seg { display: flex; gap: 4px; padding: 4px; border-radius: var(--ap-r); background: var(--ap-sur);
  button, button:focus { flex: 1; min-height: 38px; padding: 0 12px; border: 0; border-radius: 9px; background: transparent; font-weight: 500; font-size: 14px; white-space: nowrap; }
  button.is-on, button.is-on:focus { background: #fff; color: var(--ap-acc); font-weight: 600; box-shadow: 0 1px 3px rgba(28, 33, 16, .12); }
}
.ap-qty { display: inline-grid; grid-template-columns: 40px minmax(0, 1fr) 40px; align-items: center; min-height: 44px; border-radius: var(--ap-r); background: var(--ap-soft); width: 100%; box-sizing: border-box;
  button, button:focus { height: 44px; border: 0; background: none; font-size: 22px; line-height: 1; color: var(--ap-acc-d); }
  span { text-align: center; font-weight: 600; font-size: 15px; white-space: nowrap; font-variant-numeric: tabular-nums; }
  &--s { min-height: 38px; grid-template-columns: 34px minmax(64px, 1fr) 34px; button, button:focus { height: 38px; } }
}

/* ---- шапка ---- */
.ap-header { position: sticky; z-index: 40; background: #fff; }
.ap-strip { border-bottom: 1px solid var(--ap-line); font-size: 14px;
  &__in { display: flex; align-items: center; gap: 24px; min-height: 44px; }
  &__when { color: var(--ap-mute); white-space: nowrap; b { color: var(--ap-ink); font-weight: 600; } }
  &__rate { display: flex; align-items: center; gap: 2px; color: var(--ap-or); b { margin-right: 4px; color: var(--ap-ink); } .ap-icon { width: 14px; height: 14px; } }
  &__nav { display: flex; gap: 22px; margin-left: auto; white-space: nowrap;
    a { padding: 4px 0; font-weight: 500; &:hover, &.is-on { color: var(--ap-acc); } }
    a.is-hot { color: var(--ap-or-d); }
  }
}
.ap .ap-zonebtn, .ap .ap-zonebtn:focus { display: inline-flex; align-items: center; gap: 8px; min-height: 32px; padding: 0 10px 0 8px; border: 0; border-radius: 9px; background: var(--ap-sur); white-space: nowrap; font-size: 14px;
  .ap-icon { width: 16px; height: 16px; color: var(--ap-acc); }
  &:hover { background: var(--ap-soft); }
}
.ap-zonebtn__name { font-weight: 600; }
.ap-zonebtn__min { color: var(--ap-mute); }
.ap-bar { position: relative; border-bottom: 1px solid var(--ap-line); background: #fff;
  &__in { display: flex; align-items: center; gap: 20px; min-height: var(--ap-bar); }
  &__burger, &__burger:focus { display: none; width: 44px; height: 44px; border: 0; border-radius: var(--ap-r); background: var(--ap-sur); align-items: center; justify-content: center; }
}
.ap-logo { display: flex; align-items: center; gap: 12px; flex: none;
  img { display: block; width: 110px; height: auto; }
  span { font-size: 12px; line-height: 1.3; color: var(--ap-mute); }
}
.ap .ap-catbtn, .ap .ap-catbtn:focus { display: inline-flex; align-items: center; gap: 8px; min-height: 48px; padding: 0 18px; border: 0; border-radius: var(--ap-r); background: var(--ap-acc); color: #fff; font-weight: 600; white-space: nowrap; flex: none;
  &:hover, &.is-on { background: var(--ap-acc-d); }
}
.ap-search { position: relative; flex: 1; min-width: 0;
  input { width: 100%; height: 48px; padding: 0 52px 0 16px; border: 1.5px solid var(--ap-line); border-radius: var(--ap-r); background: var(--ap-sur); box-sizing: border-box; outline: none; font-size: 15px; appearance: none;
    &:focus { border-color: var(--ap-acc); background: #fff; }
    &::-webkit-search-cancel-button { display: none; }
  }
  > button, > button:focus { position: absolute; right: 4px; top: 4px; width: 40px; height: 40px; border: 0; border-radius: 9px; background: none; color: var(--ap-acc); display: grid; place-items: center; }
  &__drop { position: absolute; left: 0; right: 0; top: calc(100% + 6px); z-index: 5; padding: 6px; border: 1px solid var(--ap-line); border-radius: var(--ap-r); background: #fff; box-shadow: 0 2px 6px rgba(28, 33, 16, .08), 0 22px 54px rgba(28, 33, 16, .22); }
  &__hit { display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 6px 8px; border-radius: 9px;
    &:hover { background: var(--ap-sur); }
    img { width: 44px; height: 44px; object-fit: contain; }
    span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    b { white-space: nowrap; font-weight: 600; small { font-weight: 400; color: var(--ap-mute); } }
  }
  &__none { padding: 12px; color: var(--ap-mute); font-size: 14px; }
  &__all, &__all:focus { width: 100%; margin-top: 4px; min-height: 40px; border: 0; border-radius: 9px; background: var(--ap-sur); color: var(--ap-acc); font-weight: 600; }
}
.ap-tel { display: flex; align-items: center; gap: 10px; flex: none; white-space: nowrap;
  .ap-icon { color: var(--ap-acc); }
  span { display: grid; line-height: 1.25; }
  b { font-family: var(--ap-head); font-size: 18px; font-weight: 600; }
  small { font-size: 12px; color: var(--ap-mute); }
}
.ap-acts { display: flex; align-items: center; gap: 6px; flex: none; }
.ap .ap-act, .ap .ap-act:focus { position: relative; display: grid; justify-items: center; gap: 2px; min-width: 60px; padding: 6px 6px; border: 0; border-radius: var(--ap-r); background: none; font-size: 12px; white-space: nowrap;
  &:hover { background: var(--ap-sur); color: var(--ap-acc); }
  span { max-width: 84px; overflow: hidden; text-overflow: ellipsis; }
  i { position: absolute; top: 0; right: 8px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: var(--ap-or); color: #fff; font: 600 11px/18px var(--ap-text); text-align: center; box-sizing: border-box; }
}
.ap-cartbtn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 132px; height: 48px; border-radius: var(--ap-r); background: var(--ap-sur); font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; box-sizing: border-box; transition: background-color .15s;
  &:hover { background: var(--ap-soft); }
  &.is-full { background: var(--ap-ink); color: #fff; }
}
.ap-mega { position: absolute; left: 0; right: 0; top: 100%; z-index: 6; background: #fff; border-top: 1px solid var(--ap-line); box-shadow: 0 28px 54px -12px rgba(28, 33, 16, .28);
  &__in { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 32px; padding-top: 20px; padding-bottom: 24px; max-height: calc(100vh - 170px); overflow: auto; }
  &__title { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 12px; font-family: var(--ap-head); font-size: 24px; font-weight: 600; small { font: 400 14px var(--ap-text); color: var(--ap-mute); } &:hover { color: var(--ap-acc); } }
  &__subs { display: grid; gap: 14px; align-content: start; padding: 20px; border-radius: var(--ap-R); background: var(--ap-sur); }
  &__empty { color: var(--ap-mute); }
}
.ap ul.ap-mega__secs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2px 12px; margin: 0; padding: 0; align-content: start;
  a { display: flex; align-items: center; gap: 10px; padding: 6px 10px; border-radius: 10px; font-weight: 500; line-height: 1.25;
    img { width: 34px; height: 34px; flex: none; }
    &.is-on, &:hover { background: var(--ap-sur); color: var(--ap-acc); }
  }
}
.ap ul.ap-mega__list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 16px; margin: 0; padding: 0; a:hover { color: var(--ap-acc); } }
.ap-megashade { position: fixed; inset: 0; z-index: 30; background: rgba(28, 33, 16, .32); }

/* ---- общие блоки страниц ---- */
.ap-sec { padding-top: 56px; padding-bottom: 8px; }
.ap-sec:last-child { padding-bottom: 72px; }
.ap-head { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 12px 24px; margin-bottom: 24px;
  h1 { font-size: clamp(30px, 3.2vw, 44px); }
  h2 { font-size: clamp(26px, 2.6vw, 36px); }
  p { max-width: 720px; color: var(--ap-mute); }
  > div { display: grid; gap: 8px; }
}
.ap-crumbs { display: flex; flex-wrap: wrap; gap: 4px 8px; padding-top: 24px; font-size: 13px; color: var(--ap-mute);
  a:hover { color: var(--ap-acc); }
  a::after { content: '/'; margin-left: 8px; color: var(--ap-line); }
}
.ap-page { padding-top: 16px; padding-bottom: 72px; }
.ap-panel { padding: 24px; border-radius: var(--ap-R); background: var(--ap-sur); }
.ap-prose { display: grid; gap: 12px; max-width: 780px; line-height: 1.6;
  h2 { margin-top: 12px; font-size: 24px; }
  h3 { margin-top: 8px; font-size: 19px; }
  a { color: var(--ap-acc); font-weight: 500; }
}
.ap ul.ap-list { display: grid; gap: 8px; margin: 0; padding: 0;
  li { position: relative; padding-left: 22px; }
  li::before { content: ''; position: absolute; left: 4px; top: .62em; width: 7px; height: 7px; border-radius: 50%; background: var(--ap-acc); }
}
.ap-chips { display: flex; flex-wrap: wrap; gap: 8px;
  a, button, button:focus { display: inline-flex; align-items: center; min-height: 36px; padding: 0 14px; border: 1px solid var(--ap-line); border-radius: 18px; background: #fff; font-size: 14px; font-weight: 500; white-space: nowrap; max-width: 100%; box-sizing: border-box; }
  a:hover, button:hover { border-color: var(--ap-acc); color: var(--ap-acc); }
  .is-on, button.is-on:focus { background: var(--ap-ink); border-color: var(--ap-ink); color: #fff; }
}
.ap-empty { display: grid; gap: 14px; justify-items: start; padding: 32px; border-radius: var(--ap-R); background: var(--ap-sur); h2 { font-size: 24px; } p { color: var(--ap-mute); max-width: 560px; } }
.ap-form { display: grid; gap: 14px; h2 { font-size: 26px; } }
.ap-done { display: grid; gap: 10px; padding: 12px 0; h2 { font-size: 26px; } p { color: var(--ap-mute); } }

/* ---- карточка товара K24 ---- */
.ap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(212px, 1fr)); gap: 16px; }
.ap-card { container-type: inline-size; display: flex; flex-direction: column; min-width: 0; border: 1px solid var(--ap-line); border-radius: var(--ap-R); background: #fff; overflow: hidden; transition: border-color .15s;
  &:hover { border-color: #c5cdaf; }
  &__pic { position: relative; aspect-ratio: 1; background: #fff;
    a { position: absolute; inset: 10px; display: block; }
    a img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; transition: transform .25s; }
  }
  &:hover &__pic a img { transform: scale(1.04); }
  &__sticker { position: absolute; left: 10px; bottom: 6px; width: 44px; height: 44px; }
  &__disc { position: absolute; left: 10px; top: 10px; padding: 3px 8px; border-radius: 8px; background: var(--ap-or); color: #fff; font-weight: 600; font-size: 13px; }
  &__fav, &__fav:focus { position: absolute; right: 8px; top: 8px; width: 38px; height: 38px; border: 0; border-radius: 50%; background: rgba(255, 255, 255, .92); color: var(--ap-mute); display: grid; place-items: center;
    &:hover { color: var(--ap-or); }
    &.is-on { color: var(--ap-or); .ap-icon { fill: currentColor; } }
  }
  &__body { display: flex; flex-direction: column; gap: 10px; flex: 1; padding: 4px 14px 14px; }
  &__name { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; min-height: 2.7em; font-size: 14.5px; line-height: 1.35; font-weight: 500; &:hover { color: var(--ap-acc); } }
  &__price { margin-top: auto; display: grid; gap: 2px; }
  &__main { display: flex; align-items: baseline; gap: 4px; white-space: nowrap;
    b { font-family: var(--ap-head); font-size: 23px; font-weight: 600; line-height: 1.1; font-variant-numeric: tabular-nums; }
    span { color: var(--ap-mute); font-size: 14px; }
  }
  &__portion { font-size: 13px; color: var(--ap-mute); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; s { margin-left: 4px; } }
  &__buy { width: 100%; }
  @container (max-width: 170px) {
    &__main b { font-size: 19px; }
    &__body { padding: 2px 10px 10px; }
  }
}
.ap-shelf { position: relative;
  &__track { display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 16px * 5) / 5.3); gap: 16px; overflow-x: auto; scroll-snap-type: x proximity; padding-bottom: 12px; scrollbar-width: thin; scrollbar-color: #cdd5b8 transparent;
    > * { scroll-snap-align: start; }
  }
  &__arrow, &__arrow:focus { position: absolute; top: 34%; width: 44px; height: 44px; border: 1px solid var(--ap-line); border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 6px 18px rgba(28, 33, 16, .14);
    &:disabled { opacity: 0; pointer-events: none; }
    &:hover { border-color: var(--ap-acc); color: var(--ap-acc); }
  }
  &__arrow--l { left: -18px; }
  &__arrow--r { right: -18px; }
}

/* ---- подвал ---- */
.ap-footer { margin-top: 24px; background: var(--ap-sur); font-size: 14px;
  &__in { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1fr 1.4fr; gap: 32px; padding-top: 48px; padding-bottom: 32px; }
  h3 { margin-bottom: 12px; font-size: 17px; }
  nav, &__brand, &__sub { display: grid; gap: 8px; align-content: start; justify-items: start; }
  nav a, nav button, nav button:focus { padding: 0; border: 0; background: none; text-align: left; color: var(--ap-ink); &:hover { color: var(--ap-acc); } }
  &__brand img { width: 110px; height: auto; }
  &__brand p, &__sub p { color: var(--ap-mute); }
  &__tel { font-family: var(--ap-head); font-size: 22px; font-weight: 600; }
  &__ok { color: var(--ap-acc) !important; font-weight: 600; }
  &__legal { display: grid; gap: 6px; padding-top: 18px; padding-bottom: 28px; border-top: 1px solid var(--ap-line); font-size: 13px; color: var(--ap-mute); a { text-decoration: underline; text-underline-offset: 3px; } }
}
.ap-subform { display: flex; gap: 8px; width: 100%;
  input { flex: 1; width: 0; min-width: 0; height: 44px; padding: 0 14px; border: 1px solid var(--ap-line); border-radius: var(--ap-r); background: #fff; outline: none; &:focus { border-color: var(--ap-acc); } }
}

/* ---- мобильная навигация ---- */
.ap-tabbar { display: none; position: fixed; left: 0; right: 0; bottom: 0; z-index: 35; grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 6px 8px calc(6px + env(safe-area-inset-bottom)); background: #fff; border-top: 1px solid var(--ap-line);
  a, button, button:focus { position: relative; display: grid; justify-items: center; gap: 2px; padding: 4px 2px; border: 0; border-radius: 10px; background: none; font-size: 11.5px; font-weight: 500; white-space: nowrap; color: var(--ap-ink); }
  a.is-full { color: var(--ap-acc); font-weight: 600; }
  i { position: absolute; top: 0; left: calc(50% + 6px); min-width: 17px; height: 17px; padding: 0 4px; border-radius: 9px; background: var(--ap-or); color: #fff; font: 600 11px/17px var(--ap-text); box-sizing: border-box; }
}
.ap-drawer { position: fixed; inset: 0; z-index: 60; background: rgba(28, 33, 16, .4);
  &__panel { display: flex; flex-direction: column; width: min(400px, 92vw); height: 100%; background: #fff; }
  &__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--ap-line);
    b { font-family: var(--ap-head); font-size: 20px; font-weight: 600; line-height: 1.2; }
    button, button:focus { width: 40px; height: 40px; border: 0; border-radius: 10px; background: var(--ap-sur); display: grid; place-items: center; flex: none; }
  }
  &__body { display: grid; gap: 2px; align-content: start; padding: 10px 10px 32px; overflow: auto;
    > a, > button, > button:focus { display: flex; align-items: center; gap: 12px; min-height: 46px; padding: 6px 10px; border: 0; border-radius: 10px; background: none; text-align: left; font-weight: 500; font-size: 15px;
      img { width: 30px; height: 30px; flex: none; }
      .ap-icon { margin-left: auto; color: var(--ap-mute); }
    }
  }
  & &__back, & &__back:focus { color: var(--ap-acc); font-weight: 600; .ap-icon { margin-left: 0; color: inherit; } }
  & &__all { font-weight: 600; }
  &__more { display: grid; gap: 2px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--ap-line);
    a, button, button:focus { min-height: 42px; padding: 0 10px; display: flex; align-items: center; gap: 6px; border: 0; background: none; text-align: left; font-size: 15px; }
    a.is-hot { color: var(--ap-or-d); font-weight: 600; }
  }
}

/* ---- окна ---- */
.ap-modal { position: fixed; inset: 0; z-index: 70; display: grid; place-items: center; padding: 16px; background: rgba(28, 33, 16, .45); overflow: auto;
  &__card { position: relative; display: grid; gap: 14px; width: min(100%, 440px); max-height: calc(100vh - 32px); overflow: auto; padding: 28px; border-radius: var(--ap-R); background: #fff; box-sizing: border-box;
    > h2 { font-size: 26px; padding-right: 40px; }
    &--zone, &--fav { width: min(100%, 620px); }
  }
  &__x, &__x:focus { position: absolute; right: 14px; top: 14px; z-index: 1; width: 40px; height: 40px; border: 0; border-radius: 50%; background: var(--ap-sur); display: grid; place-items: center; }
  &__lead { color: var(--ap-mute); }
  &__note { font-size: 13px; color: var(--ap-mute); line-height: 1.45; }
  .ap-seg { margin-right: 44px; }
}
.ap-zones { display: grid; gap: 4px;
  h3 { margin: 10px 0 4px; font-size: 16px; }
  button, button:focus { display: grid; grid-template-columns: minmax(0, 1fr) auto 64px; gap: 12px; align-items: center; min-height: 42px; padding: 6px 12px; border: 1px solid transparent; border-radius: 10px; background: var(--ap-sur); text-align: left; font-size: 14px;
    em { font-style: normal; color: var(--ap-mute); white-space: nowrap; }
    b { text-align: right; white-space: nowrap; font-weight: 600; }
  }
  button:hover { border-color: var(--ap-acc); }
  button.is-on, button.is-on:focus { background: var(--ap-soft); border-color: var(--ap-acc); }
}
.ap-quick { display: grid; gap: 6px; padding: 12px 14px; border-radius: var(--ap-r); background: var(--ap-sur); font-size: 14px; max-height: 180px; overflow: auto;
  p { display: flex; justify-content: space-between; gap: 12px; em { font-style: normal; white-space: nowrap; color: var(--ap-mute); } }
}
.ap-favlist { display: grid; gap: 8px;
  > div { display: grid; grid-template-columns: minmax(0, 1fr) auto auto 36px; gap: 12px; align-items: center; padding: 8px; border: 1px solid var(--ap-line); border-radius: var(--ap-r); }
  a { display: flex; align-items: center; gap: 10px; min-width: 0; img { width: 56px; height: 56px; object-fit: contain; flex: none; } span { font-size: 14px; line-height: 1.3; } }
  b { white-space: nowrap; small { font-weight: 400; color: var(--ap-mute); } }
  &__x, &__x:focus { width: 36px; height: 36px; border: 0; border-radius: 9px; background: none; color: var(--ap-mute); display: grid; place-items: center; &:hover { color: #b3261e; } }
}
.ap .ap-callfab, .ap .ap-callfab:focus { position: fixed; right: 24px; bottom: 24px; z-index: 34; display: inline-flex; align-items: center; gap: 8px; height: 48px; padding: 0 18px; border: 1px solid var(--ap-line); border-radius: 24px; background: #fff; font-weight: 600; box-shadow: 0 10px 28px rgba(28, 33, 16, .18);
  .ap-icon { color: var(--ap-acc); }
  &:hover { border-color: var(--ap-acc); }
}
.ap-toast { position: fixed; left: 50%; bottom: 24px; z-index: 80; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; max-width: min(560px, calc(100vw - 24px)); padding: 12px 14px 12px 16px; border-radius: var(--ap-r); background: var(--ap-ink); color: #fff; font-size: 14px; line-height: 1.35; box-shadow: 0 12px 32px rgba(28, 33, 16, .3); box-sizing: border-box;
  .ap-icon { color: #c4d67a; }
  span { min-width: 0; }
  a { flex: none; padding: 6px 12px; border-radius: 9px; background: #fff; color: var(--ap-ink); font-weight: 600; }
}
.ap-toast-enter-active, .ap-toast-leave-active { transition: opacity .2s, transform .2s; }
.ap-toast-enter-from, .ap-toast-leave-to { opacity: 0; transform: translate(-50%, 12px); }
.ap-cookie { position: fixed; left: 24px; bottom: 24px; z-index: 33; display: flex; align-items: center; gap: 14px; max-width: 460px; padding: 14px 16px; border: 1px solid var(--ap-line); border-radius: var(--ap-r); background: #fff; font-size: 13px; line-height: 1.4; color: var(--ap-mute); box-shadow: 0 10px 28px rgba(28, 33, 16, .14); box-sizing: border-box; }

@media (max-width: 1520px) {
  .ap-shelf__track { grid-auto-columns: calc((100% - 16px * 4) / 4.3); }
}
@media (max-width: 1400px) {
  .ap-logo span, .ap-strip__when { display: none; }
  .ap-bar__in { gap: 16px; }
  .ap-footer__in { grid-template-columns: 1.2fr 1fr 1fr 1fr; }
  .ap-footer__sub { grid-column: 1 / -1; max-width: 560px; }
}
@media (max-width: 1199px) {
  .ap-tel span, .ap .ap-act span { display: none; }
  .ap-tel { width: 44px; height: 44px; justify-content: center; border-radius: var(--ap-r); background: var(--ap-sur); }
  .ap .ap-act, .ap .ap-act:focus { min-width: 44px; height: 44px; align-content: center; }
  .ap-strip__nav { gap: 18px; }
  .ap-strip__rate { display: none; }
  .ap-shelf__track { grid-auto-columns: calc((100% - 16px * 3) / 3.3); }
  .ap-shelf__arrow--l { left: -10px; }
  .ap-shelf__arrow--r { right: -10px; }
  .ap ul.ap-mega__secs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 989px) {
  .ap { --ap-bar: 60px; padding-bottom: 64px; }
  .ap-strip__nav, .ap .ap-catbtn, .ap .ap-act, .ap .ap-callfab, .ap-mega, .ap-megashade { display: none; }
  .ap-strip__in { min-height: 40px; }
  .ap-bar__in { display: grid; grid-template-columns: 44px minmax(0, 1fr) 44px auto; gap: 8px 10px; padding-top: 8px; padding-bottom: 10px; }
  .ap-bar__burger, .ap-bar__burger:focus { display: flex; }
  .ap-logo img { width: 92px; }
  .ap-search { grid-column: 1 / -1; grid-row: 2; input { height: 44px; } > button, > button:focus { top: 2px; } }
  .ap-acts { grid-column: 4; grid-row: 1; }
  .ap-cartbtn { width: auto; min-width: 48px; height: 44px; padding: 0 12px; }
  .ap-tel { grid-column: 3; grid-row: 1; }
  .ap-tabbar { display: grid; }
  .ap-toast { bottom: 76px; }
  .ap-cookie { left: 12px; right: 12px; bottom: 76px; max-width: none; }
  .ap-footer__in { grid-template-columns: 1fr 1fr; }
  .ap-footer__brand { grid-column: 1 / -1; }
}
@media (max-width: 768px) {
  .ap-wrap { padding-left: 16px; padding-right: 16px; }
  .ap-sec { padding-top: 40px; }
  .ap-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .ap-shelf__track { grid-auto-columns: calc((100% - 10px * 2) / 2.2); gap: 10px; }
  .ap-shelf__arrow { display: none; }
  .ap-card__body { padding: 2px 10px 10px; gap: 8px; }
  .ap-card__main b { font-size: 20px; }
  .ap-card__sticker { width: 36px; height: 36px; }
  .ap-modal__card { padding: 22px 18px; }
  .ap-panel, .ap-empty { padding: 18px; }
}
@media (max-width: 576px) {
  .ap-zonebtn__min { display: none; }
  .ap-cartbtn:not(.is-full) span { display: none; }
  .ap-footer__in { grid-template-columns: 1fr; gap: 24px; padding-top: 32px; }
  .ap-subform { flex-direction: column; input { width: 100%; flex: none; } }
  .ap-favlist > div { grid-template-columns: minmax(0, 1fr) auto 36px; b { display: none; } }
  .ap-zones button, .ap-zones button:focus { grid-template-columns: minmax(0, 1fr) auto; b { grid-column: 2; } em { grid-column: 1; grid-row: 2; } span { grid-column: 1; } gap: 0 12px; }
  .ap-zones button b { grid-row: 1 / 3; }
}
@media (max-width: 375px) {
  .ap-concept { font-size: 12px; }
  .ap-card__main b { font-size: 18px; }
  .ap-card__portion { font-size: 12px; }
  .ap-qty { grid-template-columns: 34px minmax(0, 1fr) 34px; span { font-size: 14px; } }
  .ap-tabbar a, .ap-tabbar button { font-size: 11px; }
}
</style>
