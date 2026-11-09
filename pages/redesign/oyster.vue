<script lang="ts" setup>
import {
  OY_BASE,
  oyContacts,
  oyImg,
  oyMatch,
  oyMoney,
  oyMoreNav,
  oyMoscowNow,
  oyOrig,
  oyPath,
  oyPrice,
  oyProducts,
  oySectionByName,
  oySections,
  oyShort,
  oyTopNav,
  oyTree,
  oyTreeName,
  oyUnit,
  oyUnitText,
  oyWhen,
} from '~/utils/oyster'
import type { OyTreeNode } from '~/utils/oyster'
import { useOyShop, useOyUi } from '~/composables/useOyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'
import OyPhone from '~/components/redesign/oyster/OyPhone.vue'

const route = useRoute()
const router = useRouter()
const shop = useOyShop()
const ui = useOyUi()

useSeoMeta({
  title: 'Oyster Market — живые морепродукты с доставкой по Москве | Концепт редизайна',
  description:
    'Концепт редизайна oyster.market: устрицы, морские ежи, гребешки, камчатский краб, рыба и икра с доставкой в день заказа, услуга «Открывание» под ценой, сеты, выездной устричный бар, опт для HoReCa.',
  ogTitle: 'Oyster Market — концепт редизайна',
  ogDescription: 'Живые морепродукты с доставкой по Москве в день заказа: устрицы по размерам, открывание к доставке, сеты, опт для ресторанов.',
  ogImage: 'https://andryushov.me/redesign/oyster/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'oy-html', lang: 'ru' },
  bodyAttrs: { class: 'oy-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Advent+Pro:wght@600;700&family=Montserrat:wght@400;500;600;700&display=swap' },
  ],
})

const isOn = (to: string) => {
  const p = oyPath(to.split(/[?#]/)[0]).replace(/\/$/, '')
  return route.path.replace(/\/$/, '') === p
}
const year = new Date().getFullYear()

// Липкая шапка: белая строка с меню оригинала уезжает, строка «знак · Каталог · поиск · корзина» остаётся
const strip = ref<HTMLElement | null>(null)
const stick = ref(0)
const measure = () => {
  stick.value = strip.value?.offsetHeight ?? 0
}

// Живое «когда привезём» — только в браузере, чтобы SSR не расходился со временем посетителя
const now = ref<Date | null>(null)
const when = computed(() => (now.value ? oyWhen(now.value) : null))
let timer: ReturnType<typeof setInterval> | undefined

// Мега-меню каталога: разделы слева, подразделы оригинала справа
const hoverSec = ref(oySections[1].id)
const treeOf = (id: string): OyTreeNode[] => {
  const s = oySections.find((x) => x.id === id)
  const node = oyTree.find((n) => typeof n !== 'string' && oySectionByName(n.name)?.id === s?.id)
  return node && typeof node !== 'string' ? (node.children ?? []) : []
}
const subLink = (sec: string, name: string) => oyPath(`/catalog/${sec}/?sub=${encodeURIComponent(name)}`)
const hoverInfo = computed(() => oySections.find((s) => s.id === hoverSec.value)!)
const closeAll = () => {
  ui.catalog.value = false
  ui.menu.value = false
  q.value = ''
  searchOpen.value = false
}

// Поиск с подсказками: фото, название, цена
const q = ref('')
const searchOpen = ref(false)
const hits = computed(() => (q.value.trim().length < 2 ? [] : oyProducts.filter((p) => oyMatch(p, q.value)).slice(0, 6)))
const hitsAll = computed(() => (q.value.trim().length < 2 ? 0 : oyProducts.filter((p) => oyMatch(p, q.value)).length))
const submitSearch = () => {
  if (!q.value.trim()) return
  const term = q.value.trim()
  closeAll()
  router.push(oyPath(`/catalog/?q=${encodeURIComponent(term)}`))
}
const onSearchBlur = () => setTimeout(() => (searchOpen.value = false), 160)

// Модалки: заказать звонок, задать вопрос, вход, быстрый заказ — демо, никуда не отправляются
const form = reactive({ name: '', phone: '', email: '', text: '', code: '' })
const sent = ref(false)
const loginStep = ref(1)
watch(
  () => ui.modal.value,
  (m) => {
    sent.value = false
    loginStep.value = 1
    if (m === 'question' && ui.subject.value) form.text = `Здравствуйте! Подскажите цену и срок: ${ui.subject.value}`
    if (m && shop.last.value) {
      form.name ||= shop.last.value.name
      form.phone ||= shop.last.value.phone
    }
  },
)
const phoneOk = computed(() => form.phone.replace(/\D/g, '').length === 11)
const submitModal = () => {
  if (ui.modal.value === 'login') {
    if (loginStep.value === 1 && phoneOk.value) loginStep.value = 2
    else if (loginStep.value === 2 && form.code.length >= 4) sent.value = true
    return
  }
  if (!phoneOk.value || !form.name.trim()) return
  if (ui.modal.value === 'quick') shop.remember({ ...shop.emptyCustomer(), name: form.name, phone: form.phone })
  sent.value = true
}
const modalTitle = computed(
  () => ({ callback: 'Заказать звонок', question: 'Задать вопрос', login: 'Вход в личный кабинет', quick: 'Быстрый заказ' })[ui.modal.value ?? 'callback'],
)

// Подписка на рассылку в подвале
const sub = ref('')
const subDone = ref(false)
const subscribe = () => {
  if (/.+@.+\..+/.test(sub.value)) subDone.value = true
}

// Плавающая кнопка MAX — после первого экрана
const scrolled = ref(false)
const onScroll = () => {
  scrolled.value = window.scrollY > 700
}

// Тост «Добавлено» сам гаснет
let toastTimer: ReturnType<typeof setTimeout> | undefined
watch(
  () => shop.toast.value?.id,
  () => {
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => (shop.toast.value = null), 3200)
  },
)

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    ui.modal.value = null
    closeAll()
  }
}

watch(
  () => route.fullPath,
  () => {
    closeAll()
    ;(document.activeElement as HTMLElement | null)?.blur?.()
  },
)
watch(
  () => [ui.menu.value, ui.modal.value],
  ([m, d]) => {
    if (import.meta.client) document.documentElement.classList.toggle('oy-lock', !!m || !!d)
  },
)

onMounted(() => {
  shop.persist()
  measure()
  now.value = oyMoscowNow()
  timer = setInterval(() => (now.value = oyMoscowNow()), 30000)
  window.addEventListener('resize', measure)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  window.removeEventListener('resize', measure)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('oy-lock')
})
</script>

<template>
  <div class="oy" :style="{ '--oy-stick': `${stick}px` }">
    <div class="oy-concept">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="oyOrig" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="oy-header" :style="{ top: `-${stick}px` }">
      <div ref="strip" class="oy-strip">
        <div class="oy-wrap oy-strip__in">
          <nav class="oy-strip__nav" aria-label="Меню">
            <NuxtLink
              v-for="n in oyTopNav"
              :key="n.to"
              :to="oyPath(n.to)"
              class="oy-strip__link"
              :class="{ 'is-hot': n.hot, 'is-on': isOn(n.to) }"
            >
              <span v-if="n.hot" class="oy-mask oy-strip__ic" :style="{ '--m': `url(${oyImg('ic/oyster.png')})` }" />{{ n.title }}
            </NuxtLink>
            <div class="oy-strip__more">
              <button type="button" class="oy-strip__link">Ещё <OyIcon name="down" :size="14" /></button>
              <div class="oy-drop">
                <NuxtLink v-for="n in oyMoreNav" :key="n.to" :to="oyPath(n.to)">{{ n.title }}</NuxtLink>
              </div>
            </div>
          </nav>
          <div class="oy-strip__side">
            <a :href="oyContacts.telegram" target="_blank" rel="noopener" class="oy-msg">Telegram</a>
            <a :href="oyContacts.max" target="_blank" rel="noopener" class="oy-msg">MAX</a>
            <a :href="oyContacts.phoneHref" class="oy-strip__phone">{{ oyContacts.phone }}</a>
            <button type="button" class="oy-strip__call" @click="ui.open('callback')">Заказать звонок</button>
          </div>
        </div>
      </div>

      <div class="oy-bar">
        <div class="oy-wrap oy-bar__in oy-header__row">
          <button type="button" class="oy-bar__burger" aria-label="Меню" @click="ui.menu.value = true"><OyIcon name="menu" /></button>
          <NuxtLink :to="oyPath('/')" class="oy-logo" aria-label="Oyster Market — на главную">
            <span class="oy-logo__mark" :style="{ '--m': `url(${oyImg('logo.png')})` }" />
          </NuxtLink>
          <button type="button" class="oy-btn oy-btn--accent oy-bar__cat" :aria-expanded="ui.catalog.value" @click="ui.catalog.value = !ui.catalog.value">
            <OyIcon :name="ui.catalog.value ? 'close' : 'grid'" :size="20" /><span>Каталог</span>
          </button>
          <form class="oy-search" role="search" @submit.prevent="submitSearch">
            <OyIcon name="search" :size="20" class="oy-search__ic" />
            <input
              v-model="q"
              type="search"
              placeholder="Устрицы, краб, икра…"
              aria-label="Поиск по каталогу"
              @focus="searchOpen = true"
              @input="searchOpen = true"
              @blur="onSearchBlur"
            />
            <button type="submit" class="oy-search__go">Найти</button>
            <div v-if="searchOpen && q.trim().length >= 2" class="oy-suggest">
              <NuxtLink v-for="p in hits" :key="p.id" :to="oyPath(`/product/${p.id}/`)" class="oy-suggest__row">
                <img :src="p.img" alt="" width="48" height="48" />
                <span class="oy-suggest__name">{{ oyShort(p.name, 52) }}</span>
                <b v-if="oyPrice(p)">{{ oyMoney(oyPrice(p)!) }}<small> {{ oyUnitText(oyUnit(p)) }}</small></b>
                <b v-else class="oy-suggest__ask">под заказ</b>
              </NuxtLink>
              <p v-if="!hits.length" class="oy-suggest__none">Ничего не нашли — попробуйте «устрица», «краб» или позвоните, подберём.</p>
              <button v-else type="submit" class="oy-suggest__all">Все результаты · {{ hitsAll }}</button>
            </div>
          </form>
          <ClientOnly>
            <NuxtLink v-if="when" :to="oyPath('/help/?tab=delivery')" class="oy-when" :title="when.text">
              <OyIcon name="truck" :size="20" />
              <span><b>{{ when.short }}</b><small>{{ when.today ? 'заказ до 19:00' : 'приём с 10:00' }}</small></span>
            </NuxtLink>
          </ClientOnly>
          <div class="oy-bar__icons">
            <a :href="oyContacts.phoneHref" class="oy-ib oy-ib--phone" aria-label="Позвонить"><OyIcon name="phone" /></a>
            <button type="button" class="oy-ib oy-ib--login" @click="ui.open('login')"><OyIcon name="user" /><span>Войти</span></button>
            <NuxtLink :to="oyPath('/favorites/')" class="oy-ib oy-ib--fav" aria-label="Избранное">
              <OyIcon name="heart" /><span>Избранное</span><i v-if="shop.fav.value.length">{{ shop.fav.value.length }}</i>
            </NuxtLink>
            <NuxtLink :to="oyPath('/compare/')" class="oy-ib oy-ib--cmp" aria-label="Сравнение">
              <OyIcon name="compare" /><span>Сравнить</span><i v-if="shop.cmp.value.length">{{ shop.cmp.value.length }}</i>
            </NuxtLink>
            <NuxtLink :to="oyPath('/cart/')" class="oy-cartbtn" aria-label="Корзина">
              <OyIcon name="cart" />
              <span class="oy-cartbtn__sum">{{ shop.count.value ? oyMoney(shop.total.value) : 'Корзина' }}</span>
              <i v-if="shop.count.value">{{ shop.count.value }}</i>
            </NuxtLink>
          </div>
        </div>

        <Transition name="oy-fade">
          <div v-if="ui.catalog.value" class="oy-mega" @mouseleave="hoverSec = hoverSec">
            <div class="oy-wrap oy-mega__in">
              <ul class="oy-mega__list">
                <li v-for="s in oySections" :key="s.id">
                  <NuxtLink
                    :to="oyPath(`/catalog/${s.id}/`)"
                    class="oy-mega__sec"
                    :class="{ 'is-on': hoverSec === s.id }"
                    @mouseenter="hoverSec = s.id"
                    @focus="hoverSec = s.id"
                  >
                    <span class="oy-mask oy-mega__ic" :style="{ '--m': `url(${oyImg(`ic/${s.icon}.png`)})` }" />
                    <span>{{ s.name }}</span>
                    <small>{{ s.count }}</small>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="oyPath('/services/#bar')" class="oy-mega__sec" @mouseenter="hoverSec = 'bar'">
                    <span class="oy-mask oy-mega__ic" :style="{ '--m': `url(${oyImg('ic/truck.png')})` }" />
                    <span>Выездной устричный бар</span>
                  </NuxtLink>
                </li>
              </ul>
              <div v-if="hoverSec !== 'bar'" class="oy-mega__side">
                <div class="oy-mega__head">
                  <NuxtLink :to="oyPath(`/catalog/${hoverInfo.id}/`)" class="oy-mega__title">{{ hoverInfo.name }} <OyIcon name="arrow" :size="18" /></NuxtLink>
                  <span>{{ hoverInfo.count }} {{ hoverInfo.count % 10 === 1 && hoverInfo.count !== 11 ? 'товар' : 'товаров' }} на сайте</span>
                </div>
                <div v-if="treeOf(hoverInfo.id).length" class="oy-mega__cols">
                  <div v-for="n in treeOf(hoverInfo.id)" :key="oyTreeName(n)" class="oy-mega__col">
                    <NuxtLink :to="subLink(hoverInfo.id, oyTreeName(n))" class="oy-mega__sub">{{ oyTreeName(n) }}</NuxtLink>
                    <template v-if="typeof n !== 'string' && n.children">
                      <NuxtLink v-for="c in n.children" :key="oyTreeName(c)" :to="subLink(hoverInfo.id, oyTreeName(c))" class="oy-mega__leaf">{{ oyTreeName(c) }}</NuxtLink>
                    </template>
                  </div>
                </div>
                <div class="oy-mega__pics">
                  <NuxtLink
                    v-for="p in oyProducts.filter((x) => x.sec === hoverInfo.id && x.price).slice(0, 4)"
                    :key="p.id"
                    :to="oyPath(`/product/${p.id}/`)"
                    class="oy-mega__pic"
                  >
                    <img :src="p.img" :alt="p.name" loading="lazy" width="120" height="120" />
                    <span>{{ oyShort(p.name, 34) }}</span>
                    <b>{{ oyMoney(oyPrice(p)!) }}</b>
                  </NuxtLink>
                </div>
              </div>
              <div v-else class="oy-mega__side">
                <div class="oy-mega__head">
                  <NuxtLink :to="oyPath('/services/#bar')" class="oy-mega__title">Выездной устричный бар <OyIcon name="arrow" :size="18" /></NuxtLink>
                  <span>Кейтеринг: фирменная ладья, мастер-класс по открыванию устриц</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </header>
    <div v-if="ui.catalog.value" class="oy-mega-shade" @click="ui.catalog.value = false" />

    <main class="oy-main">
      <NuxtPage />
    </main>

    <footer class="oy-footer">
      <div class="oy-wrap">
        <div class="oy-footer__top">
          <div class="oy-footer__brand">
            <img :src="oyImg('seal.png')" alt="Oyster Market" width="96" height="96" />
            <p>Живые морепродукты и деликатесы с доставкой по Москве в день заказа. С 2012 года — для дома и ресторанов.</p>
            <div class="oy-footer__msg">
              <a :href="oyContacts.telegram" target="_blank" rel="noopener" class="oy-msg">Telegram</a>
              <a :href="oyContacts.max" target="_blank" rel="noopener" class="oy-msg">MAX</a>
              <a :href="oyContacts.wechat" target="_blank" rel="noopener" class="oy-msg">WeChat</a>
            </div>
          </div>
          <nav class="oy-footer__col" aria-label="Каталог">
            <b>Каталог</b>
            <NuxtLink v-for="s in oySections.slice(0, 9)" :key="s.id" :to="oyPath(`/catalog/${s.id}/`)">{{ s.name }}</NuxtLink>
          </nav>
          <nav class="oy-footer__col" aria-label="Покупателям">
            <b>Покупателям</b>
            <NuxtLink v-for="n in [...oyTopNav.filter((x) => !x.hot), ...oyMoreNav]" :key="n.to" :to="oyPath(n.to)">{{ n.title }}</NuxtLink>
          </nav>
          <div class="oy-footer__col oy-footer__contacts">
            <b>Контакты</b>
            <a :href="oyContacts.phoneHref" class="oy-footer__phone">{{ oyContacts.phone }}</a>
            <a :href="`mailto:${oyContacts.email}`">{{ oyContacts.email }}</a>
            <span>{{ oyContacts.address }}</span>
            <span>{{ oyContacts.orders }}</span>
            <form class="oy-subscribe" @submit.prevent="subscribe">
              <label for="oy-sub">Будьте в курсе наших акций и новостей</label>
              <div v-if="!subDone" class="oy-subscribe__row">
                <input id="oy-sub" v-model="sub" type="email" placeholder="Ваш e-mail" />
                <button type="submit" class="oy-btn oy-btn--accent">Подписаться</button>
              </div>
              <p v-else class="oy-subscribe__ok"><OyIcon name="check" :size="18" /> Подписали {{ sub }} — демо, письма не придут</p>
            </form>
          </div>
        </div>
        <div class="oy-footer__social">
          <a v-for="s in oyContacts.social" :key="s.name" :href="s.url" target="_blank" rel="noopener">{{ s.name }}</a>
        </div>
        <div class="oy-footer__bottom">
          <span>© {{ year }} Ойстер маркет — интернет-магазин свежих морепродуктов и деликатесов · {{ oyContacts.legal.name }}</span>
          <a href="https://oyster.market/include/licenses_detail.php" target="_blank" rel="noopener">Политика конфиденциальности</a>
          <a href="https://oyster.market/include/offer_detail.php" target="_blank" rel="noopener">Оферта</a>
        </div>
        <p class="oy-footer__rights">
          Концепт редизайна, выполнен Ильёй Андрюшовым. Тексты, цены, фотографии и логотип принадлежат Oyster Market и взяты с сайта
          <a :href="oyOrig" target="_blank" rel="noopener">oyster.market</a> для демонстрации.
        </p>
      </div>
    </footer>

    <nav class="oy-tabbar" aria-label="Быстрые разделы">
      <NuxtLink :to="oyPath('/')" class="oy-tabbar__item" :class="{ 'is-on': route.path.replace(/\/$/, '') === OY_BASE }"><OyIcon name="home" /><span>Главная</span></NuxtLink>
      <button type="button" class="oy-tabbar__item" :class="{ 'is-on': ui.menu.value }" @click="ui.menu.value = true"><OyIcon name="grid" /><span>Каталог</span></button>
      <NuxtLink :to="oyPath('/catalog/ustritsy/')" class="oy-tabbar__item" :class="{ 'is-on': isOn('/catalog/ustritsy/') }">
        <span class="oy-mask oy-tabbar__oy" :style="{ '--m': `url(${oyImg('ic/oyster.png')})` }" /><span>Устрицы</span>
      </NuxtLink>
      <NuxtLink :to="oyPath('/favorites/')" class="oy-tabbar__item" :class="{ 'is-on': isOn('/favorites/') }">
        <OyIcon name="heart" /><span>Избранное</span><i v-if="shop.fav.value.length">{{ shop.fav.value.length }}</i>
      </NuxtLink>
      <NuxtLink :to="oyPath('/cart/')" class="oy-tabbar__item" :class="{ 'is-on': isOn('/cart/') }">
        <OyIcon name="cart" /><span>{{ shop.count.value ? oyMoney(shop.total.value) : 'Корзина' }}</span><i v-if="shop.count.value">{{ shop.count.value }}</i>
      </NuxtLink>
    </nav>

    <Transition name="oy-fade">
      <div v-if="ui.menu.value" class="oy-drawer" role="dialog" aria-label="Меню" @click.self="ui.menu.value = false">
        <div class="oy-drawer__panel">
          <div class="oy-drawer__head">
            <span class="oy-logo__mark oy-logo__mark--sm" :style="{ '--m': `url(${oyImg('logo.png')})` }" />
            <button type="button" class="oy-drawer__close" @click="ui.menu.value = false"><span>Меню</span><OyIcon name="close" /></button>
          </div>
          <NuxtLink :to="oyPath('/catalog/ustritsy/')" class="oy-drawer__hot">
            <span class="oy-mask" :style="{ '--m': `url(${oyImg('ic/oyster.png')})` }" />Устрицы в наличии
          </NuxtLink>
          <b class="oy-drawer__cap">Каталог</b>
          <div class="oy-drawer__secs">
            <NuxtLink v-for="s in oySections" :key="s.id" :to="oyPath(`/catalog/${s.id}/`)" class="oy-drawer__sec">
              <span class="oy-mask" :style="{ '--m': `url(${oyImg(`ic/${s.icon}.png`)})` }" />
              <span>{{ s.name }}</span>
            </NuxtLink>
          </div>
          <b class="oy-drawer__cap">Покупателям</b>
          <div class="oy-drawer__links">
            <NuxtLink v-for="n in [...oyTopNav.filter((x) => !x.hot), ...oyMoreNav]" :key="n.to" :to="oyPath(n.to)">{{ n.title }}</NuxtLink>
            <NuxtLink :to="oyPath('/compare/')">Сравнение<template v-if="shop.cmp.value.length"> · {{ shop.cmp.value.length }}</template></NuxtLink>
            <button type="button" @click="ui.open('login')">Войти в кабинет</button>
          </div>
          <div class="oy-drawer__contacts">
            <a :href="oyContacts.phoneHref" class="oy-drawer__phone">{{ oyContacts.phone }}</a>
            <span>{{ oyContacts.orders }}</span>
            <div class="oy-drawer__msg">
              <a :href="oyContacts.telegram" target="_blank" rel="noopener" class="oy-msg">Telegram</a>
              <a :href="oyContacts.max" target="_blank" rel="noopener" class="oy-msg">MAX</a>
              <button type="button" class="oy-btn oy-btn--line" @click="ui.open('callback')">Заказать звонок</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="oy-fade">
      <div v-if="ui.modal.value" class="oy-modal" role="dialog" :aria-label="modalTitle" @click.self="ui.modal.value = null">
        <form class="oy-modal__box" @submit.prevent="submitModal">
          <button type="button" class="oy-modal__x" aria-label="Закрыть" @click="ui.modal.value = null"><OyIcon name="close" /></button>
          <h2>{{ modalTitle }}</h2>
          <template v-if="!sent">
            <template v-if="ui.modal.value === 'login'">
              <p class="oy-modal__lead">Кабинет хранит историю заказов и адреса. Войдите по номеру телефона — пришлём код в SMS.</p>
              <label class="oy-field"><span>Телефон</span><OyPhone v-model="form.phone" /></label>
              <label v-if="loginStep === 2" class="oy-field"><span>Код из SMS</span><input v-model="form.code" inputmode="numeric" maxlength="6" placeholder="Любые 4 цифры" /></label>
              <button type="submit" class="oy-btn oy-btn--accent oy-btn--block" :disabled="loginStep === 1 ? !phoneOk : form.code.length < 4">
                {{ loginStep === 1 ? 'Получить код' : 'Войти' }}
              </button>
            </template>
            <template v-else>
              <p v-if="ui.modal.value === 'callback'" class="oy-modal__lead">Перезвоним с 10:00 до 20:00, подскажем по размерам устриц и доставке.</p>
              <p v-if="ui.modal.value === 'quick'" class="oy-modal__lead">
                Оставьте телефон — менеджер перезвонит, уточнит заказ на {{ oyMoney(shop.total.value) }}, оплату и доставку.
              </p>
              <label class="oy-field"><span>Имя</span><input v-model="form.name" autocomplete="name" placeholder="Как к вам обращаться" /></label>
              <label class="oy-field"><span>Телефон</span><OyPhone v-model="form.phone" /></label>
              <template v-if="ui.modal.value === 'question'">
                <label class="oy-field"><span>E-mail</span><input v-model="form.email" type="email" placeholder="Необязательно" /></label>
                <label class="oy-field"><span>Вопрос</span><textarea v-model="form.text" rows="4" placeholder="Например: какие устрицы есть сегодня №2?" /></label>
              </template>
              <button type="submit" class="oy-btn oy-btn--accent oy-btn--block" :disabled="!phoneOk || !form.name.trim()">
                {{ ui.modal.value === 'quick' ? 'Жду звонка' : ui.modal.value === 'question' ? 'Отправить вопрос' : 'Перезвоните мне' }}
              </button>
              <small class="oy-modal__note">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</small>
            </template>
          </template>
          <div v-else class="oy-modal__done">
            <span class="oy-modal__ok"><OyIcon name="check" :size="28" /></span>
            <p v-if="ui.modal.value === 'login'">Готово, вы в кабинете. Это демо: история заказов на сайте оригинала.</p>
            <p v-else>Спасибо{{ form.name ? `, ${form.name}` : '' }}! В концепте заявка никуда не уходит — на настоящем сайте менеджер перезвонит на {{ form.phone }}.</p>
            <button type="button" class="oy-btn oy-btn--line" @click="ui.modal.value = null">Закрыть</button>
          </div>
        </form>
      </div>
    </Transition>

    <Transition name="oy-up">
      <div v-if="shop.toast.value" :key="shop.toast.value.id" class="oy-toast" role="status">
        <OyIcon name="check" :size="20" />
        <span><b>В корзине:</b> {{ oyShort(shop.toast.value.text, 70) }}</span>
        <NuxtLink :to="oyPath('/cart/')" class="oy-toast__go">Оформить</NuxtLink>
      </div>
    </Transition>

    <a v-show="scrolled" :href="oyContacts.max" target="_blank" rel="noopener" class="oy-float" aria-label="Написать в MAX"><OyIcon name="chat" /><span>Написать в MAX</span></a>
  </div>
</template>

<style lang="scss">
/* ===== Oyster Market — концепт. Брейкпоинты: 1520, 1400, 1199, 989, 768, 576, 375 (max-width) ===== */
.oy-html {
  scroll-padding-top: 150px;
  &.oy-lock { overflow: hidden; }
}
.oy-body { margin: 0; background: #fff; }
.oy {
  --oy-accent: #0b6f6a;
  --oy-accent-h: #08605c;
  --oy-ink: #00353f;
  --oy-text: #20373b;
  --oy-muted: #5f7579;
  --oy-line: #dae5e4;
  --oy-surface: #eef4f3;
  --oy-surface2: #f6f9f9;
  --oy-soft: #e1efed;
  --oy-gold: #8a6326;
  --oy-gold-soft: #f6eedf;
  --oy-sale: #cc3d33;
  --oy-ok: #1b7a4b;
  --oy-ok-soft: #e2f2e9;
  --oy-r: 10px;
  --oy-R: 16px;
  font-family: 'Montserrat', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  color: var(--oy-text);
  background: #fff;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  overflow-x: clip;
}
:where(.oy) {
  h1, h2, h3, h4, p, ul, ol, figure { margin: 0; }
  ul, ol { padding: 0; list-style: none; }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }
  button { font: inherit; color: inherit; cursor: pointer; background: none; border: 0; padding: 0; }
  input, textarea, select { font: inherit; color: inherit; }
  h1, h2, h3 { font-family: 'Advent Pro', 'Montserrat', sans-serif; font-weight: 700; color: var(--oy-ink); line-height: 1.08; letter-spacing: -0.01em; }
}
.oy-wrap { max-width: 1360px; margin: 0 auto; padding-left: 32px; padding-right: 32px; box-sizing: border-box; }
@media (max-width: 989px) { .oy-wrap { padding-left: 24px; padding-right: 24px; } }
@media (max-width: 576px) { .oy-wrap { padding-left: 16px; padding-right: 16px; } }

.oy-mask {
  display: inline-block;
  width: 24px;
  height: 24px;
  flex: none;
  background: currentColor;
  -webkit-mask: var(--m) center / contain no-repeat;
  mask: var(--m) center / contain no-repeat;
}

/* ---- баннер концепта ---- */
.oy-concept {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 12px;
  padding: 8px 16px; font-size: 13px; line-height: 1.4; text-align: center;
  background: var(--oy-ink); color: #dcebe9;
  a { color: #fff; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
}

/* ---- кнопки ---- */
.oy-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 44px; padding: 0 18px; border-radius: var(--oy-r);
  font-weight: 600; font-size: 15px; white-space: nowrap; box-sizing: border-box;
  transition: background-color .15s, color .15s, border-color .15s;
  &--accent { background: var(--oy-accent); color: #fff; &:hover { background: var(--oy-accent-h); } }
  &--line, &--line:focus, &--line:active { background: #fff; color: var(--oy-ink); border: 1px solid var(--oy-line); &:hover { border-color: var(--oy-accent); color: var(--oy-accent); } }
  &--soft { background: var(--oy-soft); color: var(--oy-ink); &:hover { background: #d3e8e5; } }
  &--done { background: var(--oy-ok-soft); color: var(--oy-ok); &:hover { background: #d3ecdf; } }
  &--block { width: 100%; }
  &--big { min-height: 52px; padding: 0 24px; font-size: 16px; }
  &:disabled { opacity: .45; cursor: default; }
}
.oy-chip {
  display: inline-flex; align-items: center; min-height: 30px; padding: 0 10px; border-radius: 8px;
  font-size: 13px; font-weight: 600; white-space: nowrap; background: var(--oy-surface); color: var(--oy-ink);
  border: 1px solid transparent; transition: border-color .15s, background-color .15s;
  &:hover { border-color: var(--oy-line); }
  &.is-on { background: #fff; border-color: var(--oy-accent); color: var(--oy-accent); box-shadow: inset 0 0 0 1px var(--oy-accent); }
}
.oy-size {
  display: grid; gap: 2px; min-width: 96px; padding: 8px 14px; border-radius: 12px; border: 1px solid var(--oy-line); text-align: left; background: #fff;
  span { font-weight: 700; color: var(--oy-ink); font-size: 14px; }
  small { color: var(--oy-muted); font-size: 12px; }
  &:hover { border-color: #a8c4c1; }
  &.is-on { border-color: var(--oy-accent); background: var(--oy-soft); box-shadow: inset 0 0 0 1px var(--oy-accent); }
}
/* глобальное button:focus { border: none } портфолио снимает рамку после клика — держим её явно */
.oy .oy-chip:focus, .oy .oy-chip:active { border: 1px solid transparent; }
.oy .oy-chip.is-on:focus, .oy .oy-chip.is-on:active { border: 1px solid var(--oy-accent); }
.oy .oy-size:focus, .oy .oy-size:active { border: 1px solid var(--oy-line); }
.oy .oy-size.is-on:focus, .oy .oy-size.is-on:active { border: 1px solid var(--oy-accent); }
.oy .oy-search__go:focus, .oy .oy-search__go:active { border: 1px solid var(--oy-line); }
.oy-label {
  display: inline-flex; align-items: center; height: 24px; padding: 0 9px; border-radius: 7px;
  font-size: 12px; font-weight: 700; line-height: 1;
  &--sale { background: var(--oy-sale); color: #fff; }
  &--hit { background: var(--oy-ink); color: #fff; }
  &--new { background: #fff; color: var(--oy-accent); }
  &--adv { background: rgba(255, 255, 255, .92); color: var(--oy-ink); }
  &--order { background: var(--oy-gold-soft); color: var(--oy-gold); }
}
.oy-unit { font-size: 13px; color: var(--oy-muted); font-weight: 500; }

/* ---- счётчик ---- */
.oy-qty {
  display: inline-grid; grid-template-columns: 40px minmax(56px, auto) 40px; align-items: center;
  height: 44px; border-radius: var(--oy-r); background: var(--oy-surface); box-sizing: border-box;
  &__btn { display: grid; place-items: center; height: 100%; color: var(--oy-ink); border-radius: var(--oy-r); &:hover:not(:disabled) { color: var(--oy-accent); } &:disabled { opacity: .35; cursor: default; } }
  &__val { padding: 0 6px; text-align: center; font-weight: 600; font-size: 14px; white-space: nowrap; font-variant-numeric: tabular-nums; }
  &--small { grid-template-columns: 34px minmax(48px, auto) 34px; height: 40px; }
}

/* ---- услуга «Открыть» под ценой ---- */
.oy-svc {
  display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; font-weight: 600; color: var(--oy-ink); user-select: none;
  input { position: absolute; opacity: 0; pointer-events: none; }
  em { font-style: normal; color: var(--oy-accent); white-space: nowrap; }
  &__box { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid #9fb7b5; color: transparent; flex: none; transition: .15s; }
  input:checked + &__box { background: var(--oy-accent); border-color: var(--oy-accent); color: #fff; }
  input:focus-visible + &__box { outline: 2px solid var(--oy-accent); outline-offset: 2px; }
}

/* ---- карточка K22 ---- */
.oy-card {
  display: flex; flex-direction: column; min-width: 0; background: #fff; border: 1px solid var(--oy-line); border-radius: var(--oy-R); overflow: hidden;
  &__media { position: relative; }
  &__img {
    display: block; position: relative; aspect-ratio: 1; background: var(--oy-surface2); overflow: hidden;
    img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
    &:hover img { transform: scale(1.04); }
  }
  &__labels { position: absolute; left: 10px; top: 10px; display: flex; flex-wrap: wrap; gap: 6px; max-width: calc(100% - 64px); }
  &__acts { position: absolute; right: 10px; top: 10px; display: grid; gap: 6px; }
  &__act {
    display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: rgba(255, 255, 255, .94); color: var(--oy-ink);
    &:hover { color: var(--oy-accent); }
    &.is-on { color: #fff; background: var(--oy-accent); }
  }
  &__body { display: flex; flex-direction: column; gap: 8px; padding: 14px 14px 16px; flex: 1; }
  &__sub { font-size: 12px; color: var(--oy-muted); font-weight: 500; }
  &__name { font-weight: 600; color: var(--oy-ink); line-height: 1.35; min-height: calc(1.35em * 2); &:hover { color: var(--oy-accent); } }
  &__sizes { display: flex; flex-wrap: wrap; gap: 6px; }
  &__select { width: 100%; select { height: 34px; font-size: 13px; padding: 0 34px 0 10px; background: var(--oy-surface); border-color: transparent; } .oy-icon { right: 10px; } }
  &__price {
    display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; margin-top: auto;
    b { font-size: 21px; color: var(--oy-ink); font-weight: 700; white-space: nowrap; }
    s { font-size: 13px; color: var(--oy-muted); }
  }
  &__ask { font-weight: 600; color: var(--oy-gold); font-size: 14px; }
  &__buy { display: flex; gap: 8px; align-items: center; }
  &__add { flex: 1; min-width: 0; padding: 0 12px; min-height: 40px; }
  &__add--wide { width: 100%; }
}
@container (max-width: 250px) {
  .oy-card__buy { flex-wrap: wrap; }
  .oy-card__buy .oy-qty { width: 100%; grid-template-columns: 40px 1fr 40px; }
  .oy-card__add { width: 100%; flex-basis: 100%; }
}
@container (max-width: 160px) {
  .oy-card__buy .oy-qty { grid-template-columns: 28px minmax(0, 1fr) 28px; }
  .oy-card__buy .oy-qty__val { padding: 0 2px; font-size: 13px; }
  .oy-card__add .oy-icon { display: none; }
  .oy-card__add { padding: 0 8px; font-size: 14px; }
  .oy-card__body { padding-left: 10px; padding-right: 10px; }
}
.oy-card { container-type: inline-size; }

.oy-grid {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px;
  @media (max-width: 1199px) { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
  @media (max-width: 768px) { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
}
@media (max-width: 576px) {
  .oy-card__body { padding: 12px 12px 14px; gap: 7px; }
  .oy-card__price b { font-size: 18px; }
  .oy-card__labels { left: 8px; top: 8px; }
  .oy-card__acts { right: 8px; top: 8px; }
  .oy-card__act { width: 30px; height: 30px; }
}

/* ---- полка ---- */
.oy-shelf {
  position: relative;
  &__track {
    display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 3 * 20px) / 4.25); gap: 20px;
    overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 10px; scrollbar-width: thin; scrollbar-color: #b9cfcc transparent;
    > * { scroll-snap-align: start; }
  }
  &__arrow {
    position: absolute; top: 34%; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center;
    background: #fff; color: var(--oy-ink); border: 1px solid var(--oy-line); box-shadow: 0 4px 14px rgba(0, 53, 63, .12); z-index: 2;
    &--l { left: -18px; } &--r { right: -18px; }
    &:disabled { opacity: 0; pointer-events: none; }
    &:hover { color: var(--oy-accent); }
  }
  @media (max-width: 1199px) { &__track { grid-auto-columns: calc((100% - 2 * 16px) / 3.2); gap: 16px; } }
  @media (max-width: 768px) { &__arrow { display: none; } &__track { grid-auto-columns: calc((100% - 12px) / 2.15); gap: 12px; } }
}

/* ---- секции и заголовки ---- */
.oy-sec { padding-top: 64px; padding-bottom: 0; @media (max-width: 768px) { padding-top: 44px; } }
.oy-head {
  display: flex; align-items: end; justify-content: space-between; gap: 12px 24px; flex-wrap: wrap; margin-bottom: 22px;
  h2 { font-size: 38px; }
  p { color: var(--oy-muted); margin-top: 6px; max-width: 640px; }
  &__link { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: var(--oy-accent); white-space: nowrap; &:hover { color: var(--oy-ink); } }
  @media (max-width: 768px) { h2 { font-size: 30px; } margin-bottom: 16px; }
}
.oy-page { padding-top: 24px; padding-bottom: 72px; @media (max-width: 768px) { padding-bottom: 48px; } }
.oy-crumbs {
  display: flex; flex-wrap: wrap; gap: 6px; font-size: 13px; color: var(--oy-muted); margin-bottom: 14px;
  a:hover { color: var(--oy-accent); }
  span::before { content: '/'; margin-right: 6px; color: #b5c6c4; }
}
.oy-title { font-size: 46px; margin-bottom: 8px; @media (max-width: 768px) { font-size: 34px; } }
.oy-lead { color: var(--oy-muted); max-width: 720px; font-size: 16px; }
.oy-panel { background: var(--oy-surface); border-radius: var(--oy-R); padding: 24px; @media (max-width: 576px) { padding: 18px; } }
.oy-box { background: #fff; border: 1px solid var(--oy-line); border-radius: var(--oy-R); padding: 24px; @media (max-width: 576px) { padding: 18px; } }
.oy-prose {
  p + p { margin-top: 12px; }
  p { max-width: 760px; }
}
.oy-empty {
  display: grid; justify-items: center; gap: 12px; padding: 48px 16px; text-align: center; background: var(--oy-surface2); border-radius: var(--oy-R);
  .oy-mask { width: 64px; height: 64px; color: #9fbcb9; }
  h2 { font-size: 28px; }
  p { color: var(--oy-muted); max-width: 440px; }
}
.oy-check {
  display: grid; gap: 10px;
  li { display: flex; gap: 10px; align-items: flex-start; }
  li .oy-icon { flex: none; color: var(--oy-accent); margin-top: 1px; }
}

/* ---- поля ---- */
.oy-field {
  display: grid; gap: 6px; align-content: start;
  > span { font-size: 13px; font-weight: 600; color: var(--oy-ink); }
  input, textarea, select {
    width: 100%; box-sizing: border-box; min-height: 46px; padding: 11px 14px; border-radius: var(--oy-r);
    border: 1px solid var(--oy-line); background: #fff; outline: none; transition: border-color .15s;
    &:focus { border-color: var(--oy-accent); }
  }
  textarea { resize: vertical; min-height: 96px; }
}
.oy-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; align-items: start; @media (max-width: 576px) { grid-template-columns: minmax(0, 1fr); } }
.oy-seg {
  display: inline-flex; flex-wrap: wrap; gap: 6px; padding: 4px; border-radius: 12px; background: var(--oy-surface);
  button { min-height: 38px; padding: 0 14px; border-radius: 9px; font-weight: 600; font-size: 14px; color: var(--oy-ink); white-space: nowrap; }
  button.is-on { background: #fff; color: var(--oy-accent); box-shadow: 0 1px 4px rgba(0, 53, 63, .12); }
}
.oy-msg {
  display: inline-flex; align-items: center; min-height: 30px; padding: 0 10px; border-radius: 8px; font-size: 13px; font-weight: 600;
  background: var(--oy-soft); color: var(--oy-ink); white-space: nowrap;
  &:hover { background: var(--oy-accent); color: #fff; }
}

/* ---- шапка ---- */
.oy-header { position: sticky; z-index: 40; background: #fff; }
.oy-strip {
  border-bottom: 1px solid var(--oy-line); font-size: 14px;
  &__in { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 44px; }
  &__nav { display: flex; align-items: center; gap: 4px; min-width: 0; }
  &__link {
    display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; border-radius: 8px; font-weight: 500; color: var(--oy-text); white-space: nowrap;
    &:hover, &.is-on { color: var(--oy-accent); }
    &.is-hot { background: var(--oy-soft); color: var(--oy-ink); font-weight: 700; &:hover { background: var(--oy-accent); color: #fff; } }
  }
  &__ic { width: 20px; height: 18px; }
  &__more { position: relative; &:hover .oy-drop, &:focus-within .oy-drop { display: grid; } }
  &__side { display: flex; align-items: center; gap: 8px; flex: none; }
  &__phone { font-weight: 700; color: var(--oy-ink); white-space: nowrap; margin-left: 6px; }
  &__call { font-weight: 600; color: var(--oy-accent); white-space: nowrap; &:hover { color: var(--oy-ink); } }
  @media (max-width: 1400px) { &__side .oy-msg { display: none; } }
  @media (max-width: 1199px) { &__call { display: none; } &__link { padding: 0 8px; } }
  @media (max-width: 989px) { display: none; }
}
.oy-drop {
  display: none; position: absolute; left: 0; top: 100%; min-width: 200px; padding: 8px; z-index: 50; background: #fff; border: 1px solid var(--oy-line); border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 53, 63, .08), 0 22px 54px rgba(0, 53, 63, .2);
  &::before { content: ''; position: absolute; left: 0; right: 0; top: -8px; height: 8px; }
  a { padding: 8px 12px; border-radius: 8px; white-space: nowrap; &:hover { background: var(--oy-surface); color: var(--oy-accent); } }
}
.oy-bar {
  position: relative; border-bottom: 1px solid var(--oy-line); background: #fff;
  &__in { display: flex; align-items: center; gap: 16px; height: 76px; }
  &__burger { display: none; place-items: center; width: 40px; height: 40px; color: var(--oy-ink); margin-left: -8px; }
  &__cat { flex: none; }
  &__icons { display: flex; align-items: center; gap: 4px; flex: none; margin-left: auto; }
}
.oy-logo { flex: none; display: block; color: var(--oy-ink); }
.oy-logo__mark {
  display: block; width: 86px; height: 56px; background: currentColor;
  -webkit-mask: var(--m) center / contain no-repeat; mask: var(--m) center / contain no-repeat;
  &--sm { width: 64px; height: 42px; color: var(--oy-ink); }
}
.oy-search {
  position: relative; flex: 1; min-width: 0; display: flex; align-items: center; height: 46px; border-radius: var(--oy-r);
  background: var(--oy-surface); border: 1px solid transparent; transition: border-color .15s, background-color .15s;
  &:focus-within { border-color: var(--oy-accent); background: #fff; }
  &__ic { margin-left: 14px; color: var(--oy-muted); flex: none; }
  input { flex: 1; min-width: 0; height: 100%; padding: 0 10px; border: 0; background: transparent; outline: none; font-size: 15px; &::-webkit-search-cancel-button { display: none; } }
  &__go { height: 36px; margin-right: 5px; padding: 0 14px; border-radius: 8px; background: #fff; color: var(--oy-ink); font-weight: 600; font-size: 14px; border: 1px solid var(--oy-line); &:hover { color: var(--oy-accent); } }
}
.oy-suggest {
  position: absolute; left: 0; right: 0; top: calc(100% + 6px); z-index: 60; padding: 6px; background: #fff; border: 1px solid var(--oy-line); border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 53, 63, .08), 0 22px 54px rgba(0, 53, 63, .2);
  &__row {
    display: grid; grid-template-columns: 48px minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 6px; border-radius: 10px;
    img { width: 48px; height: 48px; object-fit: cover; border-radius: 8px; }
    b { font-size: 14px; color: var(--oy-ink); white-space: nowrap; small { font-weight: 500; color: var(--oy-muted); } }
    &:hover { background: var(--oy-surface); }
  }
  &__name { font-size: 14px; line-height: 1.3; }
  &__ask { color: var(--oy-gold) !important; }
  &__none { padding: 12px; color: var(--oy-muted); font-size: 14px; }
  &__all { width: 100%; margin-top: 4px; padding: 10px; border-radius: 10px; font-weight: 600; color: var(--oy-accent); &:hover { background: var(--oy-surface); } }
}
.oy-when {
  display: flex; align-items: center; gap: 10px; flex: none; padding: 0 12px; height: 46px; border-radius: var(--oy-r); background: var(--oy-gold-soft); color: var(--oy-gold);
  span { display: grid; line-height: 1.2; }
  b { font-size: 14px; color: var(--oy-ink); white-space: nowrap; }
  small { font-size: 12px; white-space: nowrap; }
  @media (max-width: 1400px) { display: none; }
}
.oy-ib {
  position: relative; display: grid; justify-items: center; gap: 2px; min-width: 64px; padding: 4px 4px 2px; color: var(--oy-ink); font-size: 12px; font-weight: 500;
  &:hover { color: var(--oy-accent); }
  i { position: absolute; top: -2px; left: 50%; margin-left: 6px; min-width: 18px; height: 18px; padding: 0 5px; box-sizing: border-box; border-radius: 9px; background: var(--oy-accent); color: #fff; font-style: normal; font-size: 11px; font-weight: 700; line-height: 18px; text-align: center; }
  &--phone { display: none; }
}
.oy-cartbtn {
  position: relative; display: inline-flex; align-items: center; gap: 8px; width: 148px; height: 46px; margin-left: 8px; padding: 0 14px; box-sizing: border-box;
  border-radius: var(--oy-r); background: var(--oy-ink); color: #fff; font-weight: 600; font-size: 14px;
  &:hover { background: var(--oy-accent); }
  &__sum { white-space: nowrap; font-variant-numeric: tabular-nums; }
  i { position: absolute; top: -6px; right: -6px; min-width: 20px; height: 20px; padding: 0 5px; box-sizing: border-box; border-radius: 10px; background: var(--oy-sale); color: #fff; font-style: normal; font-size: 11px; font-weight: 700; line-height: 20px; text-align: center; }
}
@media (max-width: 1199px) {
  .oy-ib span { display: none; }
  .oy-ib { min-width: 40px; height: 40px; align-content: center; }
  .oy-ib i { top: 0; margin-left: 4px; }
  .oy-bar__in { gap: 12px; }
  .oy-cartbtn { width: 134px; }
}
@media (max-width: 989px) {
  .oy-bar__burger { display: grid; }
  .oy-bar__cat { display: none; }
  .oy-bar__in { height: 64px; flex-wrap: wrap; }
  .oy-logo__mark { width: 70px; height: 46px; }
  .oy-ib--login, .oy-ib--cmp { display: none; }
  .oy-ib--phone { display: grid; }
}
@media (max-width: 768px) {
  .oy-bar__in { height: auto; padding-top: 8px; padding-bottom: 10px; row-gap: 8px; }
  .oy-search { order: 5; flex-basis: 100%; height: 44px; }
  .oy-cartbtn, .oy-ib--fav { display: none; }
}

/* ---- мега-меню ---- */
.oy-mega {
  position: absolute; left: 0; right: 0; top: 100%; z-index: 45; background: #fff; border-bottom: 1px solid var(--oy-line);
  box-shadow: 0 22px 54px rgba(0, 53, 63, .18); max-height: calc(100vh - 180px); overflow-y: auto;
  &__in { display: grid; grid-template-columns: 320px minmax(0, 1fr); gap: 32px; padding-top: 20px; padding-bottom: 28px; }
  &__list { display: grid; gap: 2px; align-content: start; }
  &__sec {
    display: grid; grid-template-columns: 32px minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 8px 12px; border-radius: 10px; font-weight: 600; font-size: 14px; color: var(--oy-ink);
    small { color: var(--oy-muted); font-weight: 500; font-size: 12px; }
    &.is-on, &:hover { background: var(--oy-surface); color: var(--oy-accent); }
  }
  &__ic { width: 32px; height: 26px; color: var(--oy-accent); }
  &__side { display: grid; gap: 22px; align-content: start; }
  &__head { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; span { color: var(--oy-muted); font-size: 14px; } }
  &__title { display: inline-flex; align-items: center; gap: 8px; font-family: 'Advent Pro', sans-serif; font-size: 32px; font-weight: 700; color: var(--oy-ink); &:hover { color: var(--oy-accent); } }
  &__cols { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px 24px; }
  &__col { display: grid; gap: 6px; align-content: start; }
  &__sub { font-weight: 700; color: var(--oy-ink); &:hover { color: var(--oy-accent); } }
  &__leaf { font-size: 14px; color: var(--oy-muted); &:hover { color: var(--oy-accent); } }
  &__pics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
  &__pic {
    display: grid; gap: 6px; font-size: 13px; line-height: 1.3;
    img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; height: auto; }
    b { color: var(--oy-ink); }
    &:hover span { color: var(--oy-accent); }
  }
  @media (max-width: 1199px) { &__in { grid-template-columns: 280px minmax(0, 1fr); } &__pics { grid-template-columns: repeat(3, minmax(0, 1fr)); a:nth-child(4) { display: none; } } }
}
.oy-mega-shade { position: fixed; inset: 0; z-index: 30; background: rgba(0, 30, 36, .28); }

/* ---- мобильное меню ---- */
.oy-drawer {
  position: fixed; inset: 0; z-index: 90; background: rgba(0, 30, 36, .4);
  &__panel { position: absolute; left: 0; top: 0; bottom: 0; width: min(400px, 100%); box-sizing: border-box; overflow-y: auto; background: #fff; padding: 12px 20px 32px; }
  &__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  &__close { display: inline-flex; align-items: center; gap: 6px; height: 40px; padding: 0 12px; border-radius: 10px; background: var(--oy-surface); font-weight: 600; color: var(--oy-ink); }
  &__hot { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 12px; background: var(--oy-soft); color: var(--oy-ink); font-weight: 700; .oy-mask { width: 28px; height: 24px; color: var(--oy-accent); } }
  &__cap { display: block; margin: 18px 0 8px; font-family: 'Advent Pro', sans-serif; font-size: 22px; color: var(--oy-ink); }
  &__secs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
  &__sec { display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 10px; background: var(--oy-surface2); font-size: 13px; font-weight: 600; line-height: 1.25; color: var(--oy-ink); .oy-mask { width: 26px; height: 22px; color: var(--oy-accent); } }
  &__links { display: grid; a, button { padding: 10px 0; border-bottom: 1px solid var(--oy-line); text-align: left; font-weight: 500; } }
  &__contacts { display: grid; gap: 6px; margin-top: 20px; color: var(--oy-muted); font-size: 14px; }
  &__phone { font-size: 20px; font-weight: 700; color: var(--oy-ink); }
  &__msg { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; .oy-btn { min-height: 32px; font-size: 13px; padding: 0 12px; } }
}

/* ---- таббар ---- */
.oy-tabbar {
  display: none; position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; background: #fff; border-top: 1px solid var(--oy-line);
  padding-bottom: env(safe-area-inset-bottom);
  grid-template-columns: repeat(5, minmax(0, 1fr));
  &__item {
    position: relative; display: grid; justify-items: center; gap: 2px; padding: 8px 2px 7px; font-size: 11px; font-weight: 600; color: var(--oy-muted);
    span:last-of-type { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-variant-numeric: tabular-nums; }
    &.is-on { color: var(--oy-accent); }
    i { position: absolute; top: 3px; left: 50%; margin-left: 6px; min-width: 17px; height: 17px; padding: 0 4px; box-sizing: border-box; border-radius: 9px; background: var(--oy-sale); color: #fff; font-style: normal; font-size: 10px; line-height: 17px; text-align: center; }
  }
  &__oy { width: 26px; height: 22px; }
  @media (max-width: 768px) { display: grid; }
}
@media (max-width: 768px) { .oy-main { padding-bottom: 64px; } .oy-footer { padding-bottom: 80px !important; } }

/* ---- подвал ---- */
.oy-footer {
  margin-top: 80px; padding: 56px 0 28px; background: var(--oy-surface); font-size: 14px;
  &__top { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1.4fr; gap: 32px; }
  &__brand { display: grid; gap: 14px; align-content: start; img { width: 96px; height: 96px; } p { color: var(--oy-muted); max-width: 300px; } }
  &__msg { display: flex; gap: 8px; flex-wrap: wrap; .oy-msg { background: #fff; } }
  &__col { display: grid; gap: 8px; align-content: start; b { font-family: 'Advent Pro', sans-serif; font-size: 20px; color: var(--oy-ink); margin-bottom: 4px; } a:hover { color: var(--oy-accent); } }
  &__contacts span { color: var(--oy-muted); }
  &__phone { font-size: 20px; font-weight: 700; color: var(--oy-ink); }
  &__social { display: flex; flex-wrap: wrap; gap: 8px 20px; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--oy-line); font-weight: 600; a:hover { color: var(--oy-accent); } }
  &__bottom { display: flex; flex-wrap: wrap; gap: 8px 20px; margin-top: 16px; color: var(--oy-muted); font-size: 13px; a:hover { color: var(--oy-accent); } }
  &__rights { margin-top: 10px; color: var(--oy-muted); font-size: 12px; a { text-decoration: underline; } }
  @media (max-width: 1199px) { &__top { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 576px) { &__top { grid-template-columns: minmax(0, 1fr); gap: 24px; } margin-top: 56px; padding-top: 40px; }
}
.oy-subscribe {
  display: grid; gap: 8px; margin-top: 10px;
  label { font-weight: 600; color: var(--oy-ink); }
  &__row { display: flex; gap: 8px; input { flex: 1; width: 0; min-width: 0; height: 44px; padding: 0 12px; border-radius: var(--oy-r); border: 1px solid var(--oy-line); background: #fff; outline: none; &:focus { border-color: var(--oy-accent); } } }
  &__ok { display: flex; gap: 6px; align-items: center; color: var(--oy-ok); font-weight: 600; }
}

/* ---- модалки, тост, плавающая кнопка ---- */
.oy-modal {
  position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 16px; background: rgba(0, 30, 36, .45);
  &__box { position: relative; display: grid; gap: 14px; width: min(440px, 100%); box-sizing: border-box; max-height: calc(100vh - 32px); overflow-y: auto; padding: 28px; border-radius: 20px; background: #fff; }
  h2 { font-size: 30px; padding-right: 36px; }
  &__x { position: absolute; right: 14px; top: 14px; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 10px; background: var(--oy-surface); color: var(--oy-ink); }
  &__lead { color: var(--oy-muted); font-size: 14px; }
  &__note { color: var(--oy-muted); font-size: 12px; }
  &__done { display: grid; gap: 14px; justify-items: start; }
  &__ok { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; background: var(--oy-ok-soft); color: var(--oy-ok); }
  @media (max-width: 576px) { &__box { padding: 22px 18px; } }
}
.oy-toast {
  position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 80; display: flex; align-items: center; gap: 12px;
  width: max-content; max-width: calc(100vw - 32px); box-sizing: border-box; padding: 12px 12px 12px 16px; border-radius: 14px; background: var(--oy-ink); color: #fff; font-size: 14px;
  box-shadow: 0 16px 40px rgba(0, 30, 36, .3);
  > .oy-icon { flex: none; color: #8fd8cf; }
  span { min-width: 0; }
  &__go { flex: none; padding: 8px 12px; border-radius: 9px; background: #fff; color: var(--oy-ink); font-weight: 700; &:hover { background: var(--oy-soft); } }
  @media (max-width: 768px) { bottom: 76px; }
}
.oy-float {
  position: fixed; right: 20px; bottom: 20px; z-index: 70; display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 52px; min-width: 52px; padding: 0 14px; box-sizing: border-box;
  border-radius: 24px; background: var(--oy-accent); color: #fff; font-weight: 600; box-shadow: 0 10px 28px rgba(0, 53, 63, .3);
  span { display: none; }
  &:hover { background: var(--oy-ink); padding: 0 18px; span { display: inline; } }
  @media (max-width: 768px) { display: none !important; }
}
.oy-fade-enter-active, .oy-fade-leave-active { transition: opacity .18s; }
.oy-fade-enter-from, .oy-fade-leave-to { opacity: 0; }
.oy-up-enter-active, .oy-up-leave-active { transition: opacity .2s, transform .2s; }
.oy-up-enter-from, .oy-up-leave-to { opacity: 0; transform: translate(-50%, 12px); }
</style>
