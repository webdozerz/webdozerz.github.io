<script lang="ts" setup>
import { DM_ORIG, dmCities, dmContacts, dmImg, dmKitchen, dmMech, dmMessengers, dmPath, dmSeries, dmChairStyles, dmTypes, dmTypeName, dmFindOffer, dmOfferImg } from '~/utils/domoteka'
import { dmProducts } from '~/utils/domoteka.data'
import { useDmStore, useDmUi } from '~/composables/useDomoteka'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'
import DmAskForm from '~/components/redesign/domoteka/DmAskForm.vue'

const route = useRoute()
const router = useRouter()
const store = useDmStore()
const ui = useDmUi()

useSeoMeta({
  title: 'Домотека — фабрика кухонных и письменных столов и стульев, Москва | Концепт редизайна',
  description:
    'Концепт редизайна domoteka.com: столы из ЛДСП, с камнем, керамогранитом и стеклом, стулья Модена — 33 модели и 132 варианта цвета и ножек, где купить в Москве и на маркетплейсах, кабинет дилера.',
  ogTitle: 'Домотека — концепт редизайна',
  ogDescription: 'Фабрика столов и стульев с 1989 года: соберите стол из образцов столешницы и ножек, план сверху, где купить рядом.',
  ogImage: 'https://andryushov.me/redesign/domoteka/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { lang: 'ru' },
  link: [
    { rel: 'icon', type: 'image/png', href: '/redesign/domoteka/favicon.png' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,100..125,400..800&display=swap' },
  ],
})

const to = (p: string) => dmPath(p)
const year = new Date().getFullYear()
const saleCount = dmProducts.filter((p) => p.tags.includes('sale')).length
const isOn = (p: string) => route.path.startsWith(dmPath(p))

// Выпадающее меню «Столы / Стулья»: наведение и нажатие; после перехода прячется до ухода курсора
const mega = ref<'' | 'stoly' | 'stulya'>('')
const quiet = ref(false)
const megaTimer = ref<ReturnType<typeof setTimeout>>()
const openMega = (k: 'stoly' | 'stulya') => {
  if (quiet.value) return
  clearTimeout(megaTimer.value)
  mega.value = k
}
const leaveMega = () => {
  quiet.value = false
  megaTimer.value = setTimeout(() => (mega.value = ''), 120)
}
const typeCount = (id: string) => dmProducts.filter((p) => p.type === id).length
const seriesImg = (s: string) => {
  const p = dmProducts.find((x) => x.series === s)
  return p ? dmOfferImg(p.offers[0]) : ''
}

// Поиск с подсказками по названию, серии и разделу
const q = ref('')
const focus = ref(false)
const hits = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (s.length < 2) return []
  return dmProducts.filter((p) => `${p.n} ${p.series} ${dmTypeName(p.type)}`.toLowerCase().includes(s)).slice(0, 6)
})
const goSearch = () => {
  const s = q.value.trim()
  focus.value = false
  ui.search.value = false
  ;(document.activeElement as HTMLElement | null)?.blur?.()
  router.push({ path: dmPath('/katalog/'), query: s ? { q: s } : {} })
}
const onBlurSearch = () => setTimeout(() => (focus.value = false), 150)

// Город: как в шапке оригинала — выбор ведёт к магазинам этого города
const cityOpen = ref(false)
const pickCity = (c: string) => {
  ui.city.value = c
  cityOpen.value = false
  router.push({ path: dmPath('/gde-kupit/'), hash: '#magaziny' })
}

// Вход и восстановление пароля — демо
const login = reactive({ user: '', pass: '', remember: true, sent: false, forgot: '' })
const doLogin = () => (login.sent = true)

let toastTimer: ReturnType<typeof setTimeout> | undefined
watch(
  () => store.toast.value?.id,
  () => {
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => (store.toast.value = null), 3200)
  },
)
const locked = computed(() => ui.menu.value || !!ui.modal.value)
watch(locked, (v) => {
  if (import.meta.client) document.documentElement.style.overflow = v ? 'hidden' : ''
})
const closeAll = () => {
  ui.menu.value = false
  ui.modal.value = ''
  cityOpen.value = false
}
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    ui.search.value = false
    cityOpen.value = false
    if (ui.modal.value !== 'filters') ui.modal.value = ''
    focus.value = false
    if (mega.value) quiet.value = true
    mega.value = ''
    ;(document.activeElement as HTMLElement | null)?.blur?.()
  },
)
const openModal = (m: typeof ui.modal.value) => {
  ui.menu.value = false
  login.sent = false
  ui.modal.value = m
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeAll()
    mega.value = ''
  }
}
const onDoc = (e: MouseEvent) => {
  const t = e.target as HTMLElement
  if (cityOpen.value && !t.closest('.dm-city')) cityOpen.value = false
}
const showUp = ref(false)
const onScroll = () => (showUp.value = window.scrollY > 900)
const up = () => window.scrollTo({ top: 0, behavior: 'smooth' })
onMounted(() => {
  store.persist()
  window.addEventListener('keydown', onKey)
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onDoc)
})
onBeforeUnmount(() => {
  clearTimeout(toastTimer)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDoc)
  document.documentElement.style.overflow = ''
})
const stripLinks = [
  ['/o-fabrike/', 'О фабрике'],
  ['/gde-kupit/', 'Как купить'],
  ['/dileram/', 'Дилерам'],
  ['/instrukcii/', 'Инструкции'],
  ['/novosti/', 'Новости'],
  ['/kontakty/', 'Контакты'],
]
</script>

<template>
  <div class="dm">
    <div class="dm-concept">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="DM_ORIG" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <!-- служебная строка уезжает при прокрутке -->
    <div class="dm-strip">
      <div class="dm-wrap dm-strip__in">
        <div class="dm-city">
          <button type="button" class="dm-city__btn" :aria-expanded="cityOpen" @click="cityOpen = !cityOpen">
            <DmIcon name="pin" /><span>{{ ui.city.value }}</span><DmIcon name="down" />
          </button>
          <div v-if="cityOpen" class="dm-city__drop">
            <p>Магазины с нашей мебелью — в 268 городах</p>
            <button v-for="c in dmCities" :key="c" type="button" :class="{ 'is-on': c === ui.city.value }" @click="pickCity(c)">{{ c }}</button>
          </div>
        </div>
        <nav class="dm-strip__nav" aria-label="О компании">
          <NuxtLink v-for="[href, label] in stripLinks" :key="href" :to="to(href)" :class="{ 'is-on': isOn(href) }">{{ label }}</NuxtLink>
        </nav>
        <div class="dm-strip__right">
          <a class="dm-strip__phone" :href="`tel:${dmContacts.tel}`"><DmIcon name="phone" />{{ dmContacts.phone }}</a>
          <span class="dm-strip__hours">{{ dmContacts.hoursShort }}</span>
          <button type="button" class="dm-strip__link" @click="openModal('ask')"><DmIcon name="chat" />Задать вопрос</button>
          <button type="button" class="dm-strip__link" @click="openModal('login')"><DmIcon name="user" />Войти</button>
        </div>
      </div>
    </div>

    <header class="dm-head" @mouseleave="leaveMega">
      <div class="dm-wrap dm-head__in dm-header__row">
        <button type="button" class="dm-iconbtn dm-head__burger" aria-label="Меню" @click="ui.menu.value = true"><DmIcon name="menu" /></button>
        <NuxtLink :to="to('/')" class="dm-logo" aria-label="Домотека — на главную">
          <img :src="dmImg('logo.png')" alt="Домотека" width="210" height="69" />
        </NuxtLink>

        <nav class="dm-nav" aria-label="Каталог" :class="{ 'is-quiet': quiet }">
          <NuxtLink
            :to="to('/katalog/stoly/')"
            class="dm-nav__item"
            :class="{ 'is-open': mega === 'stoly', 'is-on': isOn('/katalog/stoly') }"
            @mouseenter="openMega('stoly')"
            @focus="openMega('stoly')"
          >
            Столы<DmIcon name="down" />
          </NuxtLink>
          <NuxtLink
            :to="to('/katalog/stulya/')"
            class="dm-nav__item"
            :class="{ 'is-open': mega === 'stulya', 'is-on': isOn('/katalog/stulya') }"
            @mouseenter="openMega('stulya')"
            @focus="openMega('stulya')"
          >
            Стулья<DmIcon name="down" />
          </NuxtLink>
          <NuxtLink :to="to('/katalog/akcii/')" class="dm-nav__item dm-nav__sale" :class="{ 'is-on': isOn('/katalog/akcii') }" @mouseenter="leaveMega">
            <i>%</i>Акции<b>{{ saleCount }}</b>
          </NuxtLink>
        </nav>

        <form class="dm-search" :class="{ 'is-open': ui.search.value }" role="search" @submit.prevent="goSearch">
          <DmIcon name="search" />
          <input v-model="q" type="search" placeholder="Вита, письменный, со стеклом…" aria-label="Поиск по каталогу" @focus="focus = true" @blur="onBlurSearch" />
          <button type="submit" class="dm-search__go">Найти</button>
          <div v-if="focus && hits.length" class="dm-search__drop">
            <NuxtLink v-for="p in hits" :key="p.id" :to="to(`/model/${p.id}/`)" class="dm-search__hit">
              <img :src="dmOfferImg(p.offers[0])" :alt="p.n" width="48" height="48" />
              <span><b>{{ p.n }}</b><small>{{ dmTypeName(p.type) }} · серия {{ p.series }}</small></span>
            </NuxtLink>
            <button type="button" class="dm-search__all" @mousedown.prevent="goSearch">Все результаты<DmIcon name="right" /></button>
          </div>
        </form>

        <div class="dm-head__icons">
          <button type="button" class="dm-iconbtn dm-head__searchbtn" aria-label="Поиск" @click="ui.search.value = !ui.search.value"><DmIcon :name="ui.search.value ? 'close' : 'search'" /></button>
          <NuxtLink :to="to('/sravnenie/')" class="dm-iconbtn" aria-label="Сравнение" title="Сравнение">
            <DmIcon name="compare" /><b v-if="store.cmp.value.length" class="dm-badge">{{ store.cmp.value.length }}</b>
          </NuxtLink>
          <NuxtLink :to="to('/izbrannoe/')" class="dm-iconbtn" aria-label="Избранное" title="Избранное">
            <DmIcon name="heart" /><b v-if="store.fav.value.length" class="dm-badge">{{ store.fav.value.length }}</b>
          </NuxtLink>
          <NuxtLink :to="to('/gde-kupit/')" class="dm-btn dm-head__buy"><DmIcon name="store" /><span>Где купить</span></NuxtLink>
        </div>
      </div>

      <!-- выпадающее меню: колонки «Тип» и «Серия», как у оригинала, плюс их фильтры размера кухни и механизма -->
      <div v-if="mega === 'stoly'" class="dm-mega" @mouseenter="openMega('stoly')">
        <div class="dm-wrap dm-mega__in">
          <div class="dm-mega__col">
            <b>Тип</b>
            <NuxtLink v-for="t in dmTypes" :key="t.id" :to="{ path: to('/katalog/stoly/'), query: { type: t.id } }">
              {{ t.n }}<small>{{ typeCount(t.id) }}</small>
            </NuxtLink>
          </div>
          <div class="dm-mega__col dm-mega__series">
            <b>Серия</b>
            <div>
              <NuxtLink v-for="s in dmSeries" :key="s" :to="{ path: to('/katalog/stoly/'), query: { series: s } }">
                <img :src="seriesImg(s)" alt="" width="40" height="40" loading="lazy" />{{ s }}
              </NuxtLink>
            </div>
          </div>
          <div class="dm-mega__col">
            <b>Размер кухни</b>
            <NuxtLink v-for="k in dmKitchen" :key="k.id" :to="{ path: to('/katalog/stoly/'), query: { kitchen: k.id } }">{{ k.n }}<small>{{ k.hint }}</small></NuxtLink>
            <b class="dm-mega__sub">Механизм раскладки</b>
            <NuxtLink v-for="mm in dmMech" :key="mm.id" :to="{ path: to('/katalog/stoly/'), query: { mech: mm.id } }">{{ mm.n }}</NuxtLink>
          </div>
        </div>
      </div>
      <div v-if="mega === 'stulya'" class="dm-mega" @mouseenter="openMega('stulya')">
        <div class="dm-wrap dm-mega__in dm-mega__in--chairs">
          <div class="dm-mega__col">
            <b>Тип</b>
            <NuxtLink :to="to('/katalog/stulya/')">Кухонные стулья<small>{{ dmProducts.filter((p) => p.sec === 'stulya').length }}</small></NuxtLink>
            <b class="dm-mega__sub">Серия</b>
            <NuxtLink :to="{ path: to('/katalog/stulya/'), query: { series: 'Модена' } }">Модена</NuxtLink>
          </div>
          <div class="dm-mega__col">
            <b>Стиль</b>
            <NuxtLink v-for="s in dmChairStyles" :key="s" :to="{ path: to('/katalog/stulya/'), query: { style: s } }">{{ s }}</NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <main class="dm-main">
      <NuxtPage />
    </main>

    <footer class="dm-foot">
      <div class="dm-wrap">
        <div class="dm-foot__grid">
          <div class="dm-foot__brand">
            <img :src="dmImg('logo.png')" alt="Домотека" width="210" height="69" />
            <p>Фабрика кухонных, письменных и компьютерных столов и стульев. Работаем с 1989 года, более 400 дилеров и 1500 точек продаж.</p>
            <img class="dm-foot__mosprom" :src="dmImg('mosprom.png')" alt="Участник «Моспрома»" width="426" height="64" loading="lazy" />
            <div class="dm-msgs">
              <a v-for="m in dmMessengers" :key="m.id" :href="m.url" target="_blank" rel="noopener" class="dm-msg" :class="`dm-msg--${m.id}`" :aria-label="m.n">
                <svg v-if="m.id === 'tg'" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.9 4.3 18.6 19.8c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.2-8.3c.4-.4-.1-.6-.6-.2L6 13.4l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6l19.1-7.4c.9-.3 1.7.2 1.5 1.4Z" /></svg>
                <svg v-else-if="m.id === 'wa'" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.7-3-1.3-5-4.3-5.1-4.5-.2-.2-1.2-1.6-1.2-3s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.1.1.7-.1 1.5Z" /></svg>
                <svg v-else-if="m.id === 'vk'" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 18c-6 0-9.4-4.1-9.5-11h3c.1 5 2.3 7.2 4.1 7.6V7h2.8v4.3c1.7-.2 3.5-2.2 4.1-4.3h2.8c-.5 2.7-2.4 4.6-3.8 5.4 1.4.7 3.6 2.4 4.4 5.6h-3.1c-.7-2.2-2.4-3.8-4.5-4V18H13Z" /></svg>
                <span v-else>MAX</span>
              </a>
            </div>
          </div>
          <nav class="dm-foot__col" aria-label="Каталог">
            <b>Каталог</b>
            <NuxtLink v-for="t in dmTypes" :key="t.id" :to="{ path: to('/katalog/stoly/'), query: { type: t.id } }">{{ t.n }}</NuxtLink>
            <NuxtLink :to="to('/katalog/stulya/')">Стулья</NuxtLink>
            <NuxtLink :to="to('/katalog/akcii/')">Акции</NuxtLink>
          </nav>
          <nav class="dm-foot__col" aria-label="Покупателям">
            <b>Покупателям</b>
            <NuxtLink :to="to('/gde-kupit/')">Как купить</NuxtLink>
            <NuxtLink :to="{ path: to('/gde-kupit/'), hash: '#magaziny' }">Магазины в вашем городе</NuxtLink>
            <NuxtLink :to="{ path: to('/gde-kupit/'), hash: '#internet' }">Интернет-магазины</NuxtLink>
            <NuxtLink :to="to('/instrukcii/')">Инструкции по сборке</NuxtLink>
            <NuxtLink :to="to('/izbrannoe/')">Избранное</NuxtLink>
            <NuxtLink :to="to('/sravnenie/')">Сравнение</NuxtLink>
          </nav>
          <nav class="dm-foot__col" aria-label="Компания">
            <b>Компания</b>
            <NuxtLink :to="to('/o-fabrike/')">О фабрике</NuxtLink>
            <NuxtLink :to="to('/dileram/')">Дилерам</NuxtLink>
            <NuxtLink :to="to('/novosti/')">Новости</NuxtLink>
            <NuxtLink :to="to('/kontakty/')">Контакты</NuxtLink>
            <NuxtLink :to="to('/karta-sajta/')">Карта сайта</NuxtLink>
          </nav>
          <div class="dm-foot__col dm-foot__contacts">
            <b>Контакты</b>
            <a :href="`tel:${dmContacts.tel}`" class="dm-foot__phone">{{ dmContacts.phone }}</a>
            <a :href="`mailto:${dmContacts.sales}`">{{ dmContacts.sales }}</a>
            <span>{{ dmContacts.hours }}</span>
            <span>{{ dmContacts.addressShort }}</span>
            <button type="button" class="dm-btn dm-btn--line" @click="openModal('feedback')"><DmIcon name="mail" />Обратная связь</button>
          </div>
        </div>
        <div class="dm-foot__bottom">
          <span>© 1989–{{ year }} ООО «ДОМОТЕКА». Тексты, цены и изображения принадлежат владельцу сайта domoteka.com; здесь использованы для демонстрации концепта.</span>
          <NuxtLink :to="to('/politika/')">Политика обработки персональных данных</NuxtLink>
        </div>
      </div>
    </footer>

    <!-- мобильная навигация -->
    <nav class="dm-tabbar" aria-label="Быстрые разделы">
      <NuxtLink :to="to('/katalog/stoly/')" :class="{ 'is-on': isOn('/katalog') }"><DmIcon name="grid" /><span>Каталог</span></NuxtLink>
      <NuxtLink :to="to('/gde-kupit/')" :class="{ 'is-on': isOn('/gde-kupit') }"><DmIcon name="store" /><span>Где купить</span></NuxtLink>
      <NuxtLink :to="to('/izbrannoe/')" :class="{ 'is-on': isOn('/izbrannoe') }">
        <DmIcon name="heart" /><span>Избранное</span><b v-if="store.fav.value.length" class="dm-badge">{{ store.fav.value.length }}</b>
      </NuxtLink>
      <NuxtLink :to="to('/sravnenie/')" :class="{ 'is-on': isOn('/sravnenie') }">
        <DmIcon name="compare" /><span>Сравнение</span><b v-if="store.cmp.value.length" class="dm-badge">{{ store.cmp.value.length }}</b>
      </NuxtLink>
    </nav>

    <div v-if="ui.menu.value" class="dm-drawer" @click.self="ui.menu.value = false">
      <div class="dm-drawer__box">
        <div class="dm-drawer__head">
          <b>Меню</b>
          <button type="button" class="dm-iconbtn" aria-label="Закрыть меню" @click="ui.menu.value = false"><DmIcon name="close" /></button>
        </div>
        <details open>
          <summary>Столы<DmIcon name="down" /></summary>
          <NuxtLink :to="to('/katalog/stoly/')">Все столы</NuxtLink>
          <NuxtLink v-for="t in dmTypes" :key="t.id" :to="{ path: to('/katalog/stoly/'), query: { type: t.id } }">{{ t.n }}<small>{{ typeCount(t.id) }}</small></NuxtLink>
        </details>
        <details>
          <summary>Серии столов<DmIcon name="down" /></summary>
          <NuxtLink v-for="s in dmSeries" :key="s" :to="{ path: to('/katalog/stoly/'), query: { series: s } }">{{ s }}</NuxtLink>
        </details>
        <NuxtLink :to="to('/katalog/stulya/')" class="dm-drawer__link">Стулья</NuxtLink>
        <NuxtLink :to="to('/katalog/akcii/')" class="dm-drawer__link dm-drawer__sale"><i>%</i>Акции<b>{{ saleCount }}</b></NuxtLink>
        <div class="dm-drawer__sep" />
        <NuxtLink v-for="[href, label] in stripLinks" :key="href" :to="to(href)" class="dm-drawer__link">{{ label }}</NuxtLink>
        <div class="dm-drawer__sep" />
        <button type="button" class="dm-drawer__link" @click="openModal('ask')"><DmIcon name="chat" />Задать вопрос</button>
        <button type="button" class="dm-drawer__link" @click="openModal('login')"><DmIcon name="user" />Войти</button>
        <a :href="`tel:${dmContacts.tel}`" class="dm-drawer__phone">{{ dmContacts.phone }}<small>{{ dmContacts.hours }}</small></a>
      </div>
    </div>

    <!-- окна -->
    <div v-if="ui.modal.value && ui.modal.value !== 'filters'" class="dm-modal" role="dialog" aria-modal="true" @click.self="ui.modal.value = ''">
      <div class="dm-modal__box">
        <button type="button" class="dm-iconbtn dm-modal__x" aria-label="Закрыть" @click="ui.modal.value = ''"><DmIcon name="close" /></button>
        <template v-if="ui.modal.value === 'ask'">
          <h2>Задать вопрос</h2>
          <p class="dm-modal__lead">Ответим на почту в рабочее время: {{ dmContacts.hours }}.</p>
          <DmAskForm kind="ask" />
        </template>
        <template v-else-if="ui.modal.value === 'feedback'">
          <h2>Форма обратной связи</h2>
          <p class="dm-modal__lead">Пожелания, отзывы и предложения о работе фабрики.</p>
          <DmAskForm kind="feedback" />
        </template>
        <template v-else-if="ui.modal.value === 'login'">
          <h2>Вход</h2>
          <p class="dm-modal__lead">Личный кабинет дилера: остатки, заказы и рекламные материалы.</p>
          <div v-if="login.sent" class="dm-form__done">
            <DmIcon name="check" /><b>Демо-вход</b>
            <p>В концепте кабинета нет — на сайте здесь откроется личный кабинет Битрикса.</p>
          </div>
          <form v-else class="dm-form" @submit.prevent="doLogin">
            <label class="dm-field"><span>Логин или e-mail</span><input v-model="login.user" type="text" autocomplete="username" required /></label>
            <label class="dm-field"><span>Пароль</span><input v-model="login.pass" type="password" autocomplete="current-password" required /></label>
            <label class="dm-check"><input v-model="login.remember" type="checkbox" /><span>Запомнить меня</span></label>
            <button type="submit" class="dm-btn dm-btn--big">Войти</button>
            <div class="dm-modal__links">
              <button type="button" @click="openModal('forgot')">Забыли пароль?</button>
              <NuxtLink :to="{ path: to('/dileram/'), hash: '#registraciya' }">Стать дилером — регистрация</NuxtLink>
            </div>
          </form>
        </template>
        <template v-else-if="ui.modal.value === 'forgot'">
          <h2>Восстановление пароля</h2>
          <p class="dm-modal__lead">Пришлём ссылку для смены пароля на e-mail, указанный при регистрации.</p>
          <div v-if="login.sent" class="dm-form__done"><DmIcon name="check" /><b>Демо</b><p>В концепте письма не отправляются.</p></div>
          <form v-else class="dm-form" @submit.prevent="doLogin">
            <label class="dm-field"><span>Логин или e-mail</span><input v-model="login.forgot" type="text" required /></label>
            <button type="submit" class="dm-btn dm-btn--big">Выслать</button>
            <div class="dm-modal__links"><button type="button" @click="openModal('login')">Вернуться ко входу</button></div>
          </form>
        </template>
      </div>
    </div>

    <Transition name="dm-toast">
      <div v-if="store.toast.value" :key="store.toast.value.id" class="dm-toast" role="status">
        <span>{{ store.toast.value.text }}</span>
        <NuxtLink v-if="store.toast.value.link" :to="store.toast.value.link">{{ store.toast.value.linkText }}</NuxtLink>
      </div>
    </Transition>
    <button v-show="showUp" type="button" class="dm-up" aria-label="Наверх" @click="up"><DmIcon name="up" /></button>
  </div>
</template>

<style lang="scss">
.dm {
  --dm-acc: #1c3583;
  --dm-acc-h: #142768;
  --dm-ink: #161f3a;
  --dm-or: #f28c00;
  --dm-or-d: #b35f00;
  --dm-soft: #fff1df;
  --dm-blue-soft: #e9edf8;
  --dm-surf: #f2f3f7;
  --dm-line: #e2e5ed;
  --dm-muted: #5b6278;
  --dm-r: 8px;
  --dm-r2: 14px;
  --dm-head: 'Roboto Flex', 'Roboto', system-ui, sans-serif;
  --dm-text: 'Roboto Flex', 'Roboto', system-ui, sans-serif;
  min-height: 100vh;
  background: #fff;
  color: var(--dm-ink);
  font: 400 15px/1.5 var(--dm-text);
  -webkit-font-smoothing: antialiased;
  scroll-padding-top: 96px;
}
html:has(.dm) {
  scroll-padding-top: 96px;
}
:where(.dm) {
  h1,
  h2,
  h3,
  p {
    margin: 0;
  }
  a {
    color: inherit;
  }
  img {
    max-width: 100%;
  }
  button {
    font: inherit;
    color: inherit;
  }
  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }
}
.dm {
  .dm-icon {
    width: 20px;
    height: 20px;
    flex: none;
  }
  .dm-wrap {
    width: 100%;
    max-width: 1360px;
    margin: 0 auto;
    padding-left: 32px;
    padding-right: 32px;
  }
  .dm-main {
    padding-bottom: 72px;
  }
  .dm-concept {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 12px;
    padding: 8px 16px;
    background: var(--dm-ink);
    color: #dfe3f0;
    font-size: 13px;
    text-align: center;
    a {
      color: #fff;
      font-weight: 600;
    }
  }

  // кнопки и общие элементы
  .dm-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 18px;
    border: 1px solid var(--dm-acc);
    border-radius: var(--dm-r);
    background: var(--dm-acc);
    color: #fff;
    font: 600 15px/1 var(--dm-text);
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    &:hover {
      background: var(--dm-acc-h);
      border-color: var(--dm-acc-h);
    }
    &--big {
      min-height: 50px;
      padding: 0 24px;
      font-size: 16px;
    }
    &--line,
    &--line:focus,
    &--line:active {
      background: #fff;
      color: var(--dm-ink);
      border: 1px solid #cfd4e1;
    }
    &--line:hover {
      background: #fff;
      color: var(--dm-acc);
      border-color: var(--dm-acc);
    }
    &--soft {
      background: var(--dm-blue-soft);
      border-color: var(--dm-blue-soft);
      color: var(--dm-acc);
      &:hover {
        background: #dce3f5;
        border-color: #dce3f5;
      }
    }
  }
  .dm-iconbtn {
    position: relative;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: var(--dm-r);
    background: none;
    color: var(--dm-ink);
    cursor: pointer;
    text-decoration: none;
    &:hover {
      background: var(--dm-surf);
      color: var(--dm-acc);
    }
    .dm-icon {
      width: 23px;
      height: 23px;
    }
  }
  .dm-badge {
    position: absolute;
    top: 3px;
    right: 1px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--dm-or);
    color: #fff;
    font: 700 11px/18px var(--dm-text);
    text-align: center;
  }
  .dm-seg {
    min-height: 40px;
    padding: 0 16px;
    border: 1px solid #cfd4e1;
    border-radius: 999px;
    background: #fff;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
    &:hover {
      border-color: var(--dm-acc);
    }
    &.is-on,
    &.is-on:focus {
      background: var(--dm-ink);
      border-color: var(--dm-ink);
      color: #fff;
    }
  }
  .dm-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 14px;
    border: 1px solid var(--dm-line);
    border-radius: 999px;
    background: #fff;
    font-size: 14px;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    &:hover {
      border-color: var(--dm-acc);
      color: var(--dm-acc);
    }
    &.is-on {
      background: var(--dm-blue-soft);
      border-color: var(--dm-acc);
      color: var(--dm-acc);
    }
    small {
      color: var(--dm-muted);
    }
  }
  .dm-tag {
    display: inline-block;
    padding: 4px 9px;
    border-radius: 6px;
    font: 600 12px/1.2 var(--dm-text);
    &--new {
      background: var(--dm-acc);
      color: #fff;
    }
    &--hit {
      background: var(--dm-blue-soft);
      color: var(--dm-acc);
    }
    &--sale {
      background: var(--dm-or-d);
      color: #fff;
    }
  }
  .dm-swrow {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .dm-sw {
    position: relative;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    padding: 2px;
    border: 1.5px solid transparent;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    transition: border-color 0.2s;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
      outline: 1px solid rgba(22, 31, 58, 0.12);
      outline-offset: -1px;
    }
    &:hover {
      border-color: #aab1c5;
    }
    &.is-on,
    &.is-on:focus {
      border-color: var(--dm-or);
    }
    &.is-off {
      opacity: 0.3;
      cursor: not-allowed;
    }
    &--leg {
      width: 26px;
      height: 26px;
      border-radius: 8px;
      background: var(--dm-surf);
      img {
        border-radius: 6px;
        outline-color: rgba(22, 31, 58, 0.28);
      }
    }
  }
  .dm-swrow--big {
    gap: 8px;
    .dm-sw {
      width: 50px;
      height: 50px;
      border-width: 2px;
      padding: 3px;
    }
    .dm-sw--leg {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      img {
        border-radius: 8px;
      }
    }
  }

  // секции
  .dm-sec {
    padding-top: 64px;
  }
  .dm-sec__head {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    justify-content: space-between;
    gap: 12px 24px;
    margin-bottom: 24px;
    a {
      color: var(--dm-acc);
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  }
  .dm-h2 {
    font: 800 clamp(26px, 2.6vw, 36px) / 1.1 var(--dm-head);
    font-stretch: 115%;
    letter-spacing: -0.01em;
  }
  .dm-h1 {
    font: 800 clamp(28px, 3vw, 42px) / 1.08 var(--dm-head);
    font-stretch: 116%;
    letter-spacing: -0.01em;
  }
  .dm-lead {
    max-width: 760px;
    margin-top: 12px;
    font-size: 17px;
    color: var(--dm-muted);
  }
  .dm-page-head {
    padding-top: 24px;
    padding-bottom: 8px;
  }
  .dm-crumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 8px;
    margin-bottom: 14px;
    font-size: 13px;
    color: var(--dm-muted);
    a {
      color: var(--dm-muted);
      text-decoration: none;
      &:hover {
        color: var(--dm-acc);
      }
    }
    span::before {
      content: '/';
      margin-right: 8px;
      color: #b6bccc;
    }
  }
  .dm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
  .dm-empty {
    display: grid;
    justify-items: center;
    gap: 12px;
    padding: 56px 20px;
    border-radius: var(--dm-r2);
    background: var(--dm-surf);
    text-align: center;
    .dm-icon {
      width: 40px;
      height: 40px;
      color: var(--dm-acc);
    }
    b {
      font: 700 20px/1.2 var(--dm-head);
    }
    p {
      max-width: 460px;
      color: var(--dm-muted);
    }
  }
  // полосы прокрутки лент, миниатюр и таблиц — тонкие, в цветах концепта, а не системные тёмные
  :is(.dm-shelf__track, .dm-gal__thumbs, .dm-cmp__scroll, .dm-tabs) {
    scrollbar-width: thin;
    scrollbar-color: #c3c9da transparent;
    &::-webkit-scrollbar {
      height: 6px;
      background: transparent;
    }
    &::-webkit-scrollbar-track {
      background: var(--dm-surf);
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb {
      background: #c3c9da;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: var(--dm-acc);
    }
  }
  .dm-shelf {
    position: relative;
  }
  .dm-shelf__track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: calc((100% - 3 * 16px) / 4.25);
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 12px;
    scrollbar-width: thin;
    scrollbar-color: #c3c9da transparent;
    > * {
      scroll-snap-align: start;
    }
  }
  .dm-shelf__arrow {
    position: absolute;
    top: 40%;
    z-index: 2;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid var(--dm-line);
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 4px 14px rgba(22, 31, 58, 0.12);
    cursor: pointer;
    &:hover {
      color: var(--dm-acc);
    }
    &--l {
      left: -18px;
    }
    &--r {
      right: -18px;
    }
  }

  // формы
  .dm-form {
    form,
    &:is(form) {
      display: grid;
      gap: 14px;
      align-items: start;
    }
    .dm-btn {
      justify-self: start;
    }
  }
  .dm-form__alt {
    font-size: 14px;
    color: var(--dm-muted);
    a {
      color: var(--dm-acc);
    }
  }
  .dm-form__done {
    display: grid;
    justify-items: start;
    gap: 8px;
    padding: 20px;
    border-radius: var(--dm-r2);
    background: var(--dm-blue-soft);
    .dm-icon {
      width: 32px;
      height: 32px;
      color: var(--dm-acc);
    }
    b {
      font: 700 19px/1.2 var(--dm-head);
    }
    p {
      color: var(--dm-muted);
    }
  }
  .dm-field {
    display: grid;
    gap: 8px;
    align-content: start;
    > span {
      font-size: 14px;
      font-weight: 500;
      i {
        color: var(--dm-or-d);
        font-style: normal;
      }
    }
    input,
    select,
    textarea {
      width: 100%;
      min-height: 46px;
      padding: 11px 14px;
      border: 1px solid #cfd4e1;
      border-radius: var(--dm-r);
      background: #fff;
      font: 400 15px/1.4 var(--dm-text);
      color: var(--dm-ink);
      outline: none;
      transition: border-color 0.2s;
      &:focus {
        border-color: var(--dm-acc);
      }
    }
    select {
      appearance: none;
      padding-right: 40px;
      background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23161f3a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 14px center / 16px;
    }
    textarea {
      resize: vertical;
    }
    &.is-err input,
    &.is-err textarea,
    &.is-err select {
      border-color: #c43a2c;
    }
  }
  .dm-check {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    line-height: 1.4;
    cursor: pointer;
    input {
      flex: none;
      width: 18px;
      height: 18px;
      min-height: 0;
      margin: 1px 0 0;
      padding: 0;
      accent-color: var(--dm-acc);
    }
    a {
      color: var(--dm-acc);
    }
    &.is-err {
      color: #c43a2c;
    }
  }

  // служебная строка
  .dm-strip {
    border-bottom: 1px solid var(--dm-line);
    background: #fff;
    font-size: 14px;
  }
  .dm-strip__in {
    display: flex;
    align-items: center;
    gap: 24px;
    min-height: 44px;
  }
  .dm-city {
    position: relative;
  }
  .dm-city__btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 0;
    border: 0;
    background: none;
    font-weight: 600;
    cursor: pointer;
    .dm-icon {
      width: 17px;
      height: 17px;
      color: var(--dm-or-d);
    }
    .dm-icon:last-child {
      color: var(--dm-muted);
      width: 15px;
    }
  }
  .dm-city__drop {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 60;
    display: grid;
    gap: 2px;
    width: 250px;
    padding: 10px;
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r2);
    background: #fff;
    box-shadow: 0 2px 6px rgba(22, 31, 58, 0.08), 0 22px 54px rgba(22, 31, 58, 0.22);
    p {
      padding: 4px 8px 8px;
      font-size: 13px;
      color: var(--dm-muted);
    }
    button {
      padding: 8px;
      border: 0;
      border-radius: 6px;
      background: none;
      text-align: left;
      cursor: pointer;
      &:hover,
      &.is-on {
        background: var(--dm-surf);
        color: var(--dm-acc);
      }
    }
  }
  .dm-strip__nav {
    display: flex;
    gap: 22px;
    a {
      color: var(--dm-muted);
      text-decoration: none;
      white-space: nowrap;
      &:hover,
      &.is-on {
        color: var(--dm-acc);
      }
    }
  }
  .dm-strip__right {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-left: auto;
  }
  .dm-strip__phone {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    .dm-icon {
      width: 17px;
      height: 17px;
      color: var(--dm-acc);
    }
  }
  .dm-strip__hours {
    color: var(--dm-muted);
    white-space: nowrap;
  }
  .dm-strip__link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--dm-ink);
    white-space: nowrap;
    cursor: pointer;
    .dm-icon {
      width: 17px;
      height: 17px;
      color: var(--dm-muted);
    }
    &:hover {
      color: var(--dm-acc);
    }
  }

  // шапка
  .dm-head {
    position: sticky;
    top: 0;
    z-index: 50;
    background: #fff;
    border-bottom: 1px solid var(--dm-line);
  }
  .dm-head__in {
    display: flex;
    align-items: center;
    gap: 18px;
    min-height: 76px;
  }
  .dm-head__burger,
  .dm-head__searchbtn {
    display: none;
  }
  .dm-logo {
    flex: none;
    display: block;
    img {
      display: block;
      width: auto;
      height: 48px;
    }
  }
  .dm-nav {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .dm-nav__item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-height: 44px;
    padding: 0 12px;
    border-radius: var(--dm-r);
    font: 700 17px/1 var(--dm-head);
    font-stretch: 110%;
    text-decoration: none;
    white-space: nowrap;
    .dm-icon {
      width: 16px;
      height: 16px;
      color: var(--dm-muted);
      transition: transform 0.2s;
    }
    &:hover,
    &.is-open {
      background: var(--dm-surf);
      color: var(--dm-acc);
    }
    &.is-open .dm-icon {
      transform: rotate(180deg);
    }
    &.is-on {
      color: var(--dm-acc);
    }
  }
  .dm-nav__sale {
    gap: 7px;
    i {
      display: grid;
      place-items: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--dm-or);
      color: #fff;
      font: 800 13px/1 var(--dm-text);
      font-style: normal;
    }
    b {
      min-width: 20px;
      padding: 3px 6px;
      border-radius: 10px;
      background: var(--dm-soft);
      color: var(--dm-or-d);
      font: 700 12px/1 var(--dm-text);
      text-align: center;
    }
  }
  .dm-search {
    position: relative;
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 46px;
    padding: 0 4px 0 14px;
    border: 1px solid #cfd4e1;
    border-radius: var(--dm-r);
    background: #fff;
    transition: border-color 0.2s;
    &:focus-within {
      border-color: var(--dm-acc);
    }
    > .dm-icon {
      color: var(--dm-muted);
    }
    input {
      flex: 1;
      width: 0;
      min-width: 0;
      height: 100%;
      border: 0;
      background: none;
      font: 400 15px var(--dm-text);
      color: var(--dm-ink);
      outline: none;
    }
  }
  .dm-search__go {
    height: 36px;
    padding: 0 14px;
    border: 0;
    border-radius: 6px;
    background: var(--dm-surf);
    color: var(--dm-ink);
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background: var(--dm-blue-soft);
      color: var(--dm-acc);
    }
  }
  .dm-search__drop {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    z-index: 70;
    display: grid;
    gap: 2px;
    padding: 8px;
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r2);
    background: #fff;
    box-shadow: 0 2px 6px rgba(22, 31, 58, 0.08), 0 22px 54px rgba(22, 31, 58, 0.22);
  }
  .dm-search__hit {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 8px;
    border-radius: var(--dm-r);
    text-decoration: none;
    img {
      width: 48px;
      height: 48px;
      object-fit: contain;
      border-radius: 6px;
      border: 1px solid var(--dm-line);
    }
    span {
      display: grid;
    }
    small {
      color: var(--dm-muted);
      font-size: 13px;
    }
    &:hover {
      background: var(--dm-surf);
    }
  }
  .dm-search__all {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 10px;
    border: 0;
    border-radius: var(--dm-r);
    background: none;
    color: var(--dm-acc);
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background: var(--dm-surf);
    }
  }
  .dm-head__icons {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .dm-head__buy {
    margin-left: 8px;
  }
  .dm-mega {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border-top: 1px solid var(--dm-line);
    background: #fff;
    box-shadow: 0 22px 44px rgba(22, 31, 58, 0.16);
    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 100%;
      height: 12px;
    }
  }
  .dm-mega__in {
    display: grid;
    grid-template-columns: 1fr 1.6fr 1fr;
    gap: 40px;
    padding-top: 28px;
    padding-bottom: 32px;
    &--chairs {
      grid-template-columns: repeat(2, minmax(0, 260px));
    }
  }
  .dm-mega__col {
    display: grid;
    align-content: start;
    gap: 2px;
    b {
      margin-bottom: 8px;
      font: 700 13px/1 var(--dm-text);
      color: var(--dm-muted);
    }
    .dm-mega__sub {
      margin-top: 18px;
    }
    a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 8px 10px;
      border-radius: var(--dm-r);
      text-decoration: none;
      white-space: nowrap;
      &:hover {
        background: var(--dm-surf);
        color: var(--dm-acc);
      }
      small {
        color: var(--dm-muted);
        font-size: 13px;
      }
    }
  }
  .dm-mega__series > div {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2px 8px;
    a {
      justify-content: flex-start;
      padding: 5px 8px;
    }
    img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      border-radius: 6px;
      background: #fff;
      border: 1px solid var(--dm-line);
    }
  }
  .dm-nav.is-quiet + .dm-mega {
    display: none;
  }

  // подвал
  .dm-foot {
    padding-top: 56px;
    padding-bottom: 28px;
    background: var(--dm-surf);
  }
  .dm-foot__grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1.3fr;
    gap: 32px;
  }
  .dm-foot__brand {
    display: grid;
    align-content: start;
    gap: 16px;
    img {
      width: 150px;
      height: auto;
      mix-blend-mode: multiply;
    }
    p {
      font-size: 14px;
      color: var(--dm-muted);
    }
    .dm-foot__mosprom {
      width: auto;
      height: 14px;
      opacity: 0.55;
      mix-blend-mode: normal;
    }
  }
  .dm-msgs {
    display: flex;
    gap: 8px;
  }
  .dm-msg {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #fff;
    text-decoration: none;
    font: 800 10px/1 var(--dm-text);
    svg {
      width: 21px;
      height: 21px;
      fill: currentColor;
    }
    &--tg {
      background: #229ed9;
    }
    &--wa {
      background: #25d366;
    }
    &--vk {
      background: #0077ff;
    }
    &--max {
      background: linear-gradient(135deg, #3d7bff, #8a3dff);
    }
  }
  .dm-foot__col {
    display: grid;
    align-content: start;
    gap: 9px;
    font-size: 14px;
    b {
      margin-bottom: 4px;
      font: 700 15px/1.2 var(--dm-head);
    }
    a {
      color: var(--dm-muted);
      text-decoration: none;
      &:hover {
        color: var(--dm-acc);
      }
    }
    span {
      color: var(--dm-muted);
    }
  }
  .dm-foot__contacts {
    .dm-foot__phone {
      color: var(--dm-ink);
      font: 700 19px/1.2 var(--dm-head);
    }
    .dm-btn {
      justify-self: start;
      margin-top: 6px;
    }
  }
  .dm-foot__bottom {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px 24px;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #dde0e9;
    font-size: 13px;
    color: var(--dm-muted);
    a {
      color: var(--dm-muted);
    }
  }

  // мобильное
  .dm-tabbar {
    display: none;
  }
  .dm-drawer {
    position: fixed;
    inset: 0;
    z-index: 120;
    background: rgba(22, 31, 58, 0.45);
  }
  .dm-drawer__box {
    display: grid;
    align-content: start;
    gap: 2px;
    width: min(360px, 88vw);
    height: 100%;
    padding: 12px 16px 32px;
    overflow-y: auto;
    background: #fff;
    details {
      border-radius: var(--dm-r);
      summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 10px;
        font: 700 17px/1.2 var(--dm-head);
        list-style: none;
        cursor: pointer;
        &::-webkit-details-marker {
          display: none;
        }
      }
      &[open] summary .dm-icon {
        transform: rotate(180deg);
      }
      a {
        display: flex;
        justify-content: space-between;
        padding: 9px 10px 9px 20px;
        color: var(--dm-muted);
        text-decoration: none;
        small {
          color: #9aa1b5;
        }
      }
    }
  }
  .dm-drawer__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 8px 10px;
    b {
      font: 800 20px/1 var(--dm-head);
    }
  }
  .dm-drawer__link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 10px;
    border: 0;
    border-radius: var(--dm-r);
    background: none;
    font: 600 16px/1.2 var(--dm-text);
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    .dm-icon {
      color: var(--dm-muted);
    }
    &:hover {
      background: var(--dm-surf);
    }
  }
  .dm-drawer__sale {
    i {
      display: grid;
      place-items: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--dm-or);
      color: #fff;
      font: 800 13px/1 var(--dm-text);
      font-style: normal;
    }
    b {
      padding: 3px 7px;
      border-radius: 10px;
      background: var(--dm-soft);
      color: var(--dm-or-d);
      font-size: 12px;
    }
  }
  .dm-drawer__sep {
    height: 1px;
    margin: 8px 0;
    background: var(--dm-line);
  }
  .dm-drawer__phone {
    display: grid;
    gap: 2px;
    padding: 12px 10px;
    font: 700 19px/1.2 var(--dm-head);
    text-decoration: none;
    small {
      font: 400 13px var(--dm-text);
      color: var(--dm-muted);
    }
  }
  .dm-modal {
    position: fixed;
    inset: 0;
    z-index: 130;
    display: grid;
    place-items: center;
    padding: 16px;
    background: rgba(22, 31, 58, 0.5);
    overflow-y: auto;
  }
  .dm-modal__box {
    position: relative;
    width: min(520px, 100%);
    padding: 28px;
    border-radius: 18px;
    background: #fff;
    h2 {
      padding-right: 40px;
      font: 800 26px/1.15 var(--dm-head);
      font-stretch: 112%;
    }
  }
  .dm-modal__lead {
    margin: 8px 0 18px;
    color: var(--dm-muted);
  }
  .dm-modal__x {
    position: absolute;
    top: 14px;
    right: 14px;
  }
  .dm-modal__links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    font-size: 14px;
    button,
    a {
      padding: 0;
      border: 0;
      background: none;
      color: var(--dm-acc);
      text-decoration: underline;
      text-underline-offset: 3px;
      cursor: pointer;
    }
  }
  .dm-toast {
    position: fixed;
    left: 50%;
    bottom: 24px;
    z-index: 140;
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: calc(100vw - 32px);
    padding: 12px 18px;
    border-radius: 12px;
    background: var(--dm-ink);
    color: #fff;
    font-size: 14px;
    box-shadow: 0 12px 32px rgba(22, 31, 58, 0.3);
    transform: translateX(-50%);
    a {
      flex: none;
      color: #ffc06b;
      font-weight: 700;
    }
  }
  .dm-toast-enter-active,
  .dm-toast-leave-active {
    transition: opacity 0.25s;
  }
  .dm-toast-enter-from,
  .dm-toast-leave-to {
    opacity: 0;
  }
  .dm-up {
    position: fixed;
    right: 20px;
    bottom: 24px;
    z-index: 40;
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border: 1px solid var(--dm-line);
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 6px 18px rgba(22, 31, 58, 0.14);
    cursor: pointer;
    &:hover {
      color: var(--dm-acc);
    }
  }

  // магазины и маркетплейсы — главная, «Где купить», модель
  .dm-markets {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
  .dm-market {
    display: grid;
    place-items: center;
    height: 72px;
    padding: 12px 16px;
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r2);
    background: #fff;
    transition: border-color 0.2s;
    img {
      max-width: 100%;
      max-height: 40px;
      object-fit: contain;
    }
    &:hover {
      border-color: var(--dm-acc);
    }
  }
  .dm-dealer {
    display: grid;
    gap: 4px;
    padding: 16px 18px;
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r2);
    background: #fff;
    b {
      font: 700 16px/1.25 var(--dm-head);
    }
    span {
      font-size: 14px;
      color: var(--dm-muted);
    }
    a {
      justify-self: start;
      color: var(--dm-acc);
      font-weight: 600;
      text-decoration: none;
    }
  }
  .dm-map {
    position: relative;
    min-height: 360px;
    border-radius: var(--dm-r2);
    background: var(--dm-surf) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23e2e5ed'/%3E%3C/svg%3E");
    overflow: hidden;
    iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
  .dm-map__fallback {
    position: absolute;
    left: 12px;
    top: 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: var(--dm-r);
    background: #fff;
    color: var(--dm-acc);
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(22, 31, 58, 0.12);
  }
  .dm-facts {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
    li {
      display: grid;
      gap: 4px;
      padding: 18px 20px;
      border-radius: var(--dm-r2);
      background: var(--dm-surf);
    }
    b {
      font: 800 30px/1 var(--dm-head);
      font-stretch: 115%;
      color: var(--dm-acc);
      white-space: nowrap;
    }
    span {
      font-size: 14px;
      color: var(--dm-muted);
    }
  }
  .dm-adv {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 10px;
    li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-radius: var(--dm-r2);
      background: #fff;
      border: 1px solid var(--dm-line);
      font-size: 15px;
      line-height: 1.35;
    }
    .dm-icon {
      width: 26px;
      height: 26px;
      color: var(--dm-or-d);
    }
  }
}

@media (max-width: 1520px) {
  .dm .dm-strip__hours {
    display: none;
  }
}
@media (max-width: 1400px) {
  .dm {
    .dm-strip__nav {
      gap: 16px;
    }
  }
}
@media (max-width: 1199px) {
  .dm {
    .dm-strip__nav a:nth-child(n + 4) {
      display: none;
    }
    .dm-head__in {
      gap: 10px;
    }
    .dm-nav__item {
      padding: 0 9px;
      font-size: 16px;
    }
    .dm-head__buy span {
      display: none;
    }
    .dm-head__buy {
      width: 44px;
      padding: 0;
      margin-left: 4px;
    }
    .dm-mega__in {
      gap: 24px;
    }
    .dm-foot__grid {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .dm-foot__brand {
      grid-column: 1 / -1;
    }
    .dm-facts {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .dm-shelf__track {
      grid-auto-columns: calc((100% - 2 * 16px) / 3.2);
    }
  }
}
@media (max-width: 989px) {
  .dm {
    scroll-padding-top: 76px;
    .dm-strip__nav,
    .dm-strip__link {
      display: none;
    }
    .dm-head__in {
      min-height: 64px;
    }
    .dm-head__burger,
    .dm-head__searchbtn {
      display: grid;
    }
    .dm-logo img {
      height: 40px;
    }
    .dm-nav,
    .dm-mega {
      display: none;
    }
    .dm-head__icons {
      margin-left: auto;
    }
    .dm-search {
      display: none;
      position: absolute;
      top: 100%;
      left: 16px;
      right: 16px;
      margin-top: 8px;
      box-shadow: 0 12px 30px rgba(22, 31, 58, 0.18);
      &.is-open {
        display: flex;
      }
    }
    .dm-shelf__arrow {
      display: none;
    }
  }
}
@media (max-width: 768px) {
  .dm {
    .dm-wrap {
      padding-left: 16px;
      padding-right: 16px;
    }
    .dm-main {
      padding-bottom: 48px;
    }
    .dm-sec {
      padding-top: 48px;
    }
    .dm-tabbar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 45;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      padding: 6px 4px calc(6px + env(safe-area-inset-bottom));
      border-top: 1px solid var(--dm-line);
      background: #fff;
      a {
        position: relative;
        display: grid;
        justify-items: center;
        gap: 2px;
        padding: 4px 0;
        color: var(--dm-muted);
        font-size: 11px;
        text-decoration: none;
        &.is-on {
          color: var(--dm-acc);
        }
      }
      .dm-badge {
        top: 0;
        right: calc(50% - 22px);
      }
    }
    .dm-foot {
      padding-bottom: 96px;
    }
    .dm-foot__grid {
      grid-template-columns: 1fr 1fr;
    }
    .dm-head__icons > a:not(.dm-head__buy) {
      display: none;
    }
    .dm-toast {
      bottom: 84px;
    }
    .dm-up {
      display: none !important;
    }
    .dm-facts {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      li {
        padding: 14px 16px;
      }
      b {
        font-size: 23px;
      }
    }
    .dm-shelf__track {
      grid-auto-columns: calc((100% - 16px) / 2.15);
      gap: 12px;
    }
    .dm-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
  }
}
@media (max-width: 576px) {
  .dm {
    .dm-strip__phone {
      font-size: 13px;
    }
    .dm-head__in {
      gap: 4px;
    }
    .dm-logo img {
      height: 36px;
    }
    .dm-foot__grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .dm-modal__box {
      padding: 22px 18px;
    }
    .dm-shelf__track {
      grid-auto-columns: 72%;
    }
    .dm-grid {
      grid-template-columns: minmax(0, 1fr);
    }
    .dm-card .dm-card__body {
      padding: 4px 14px 14px;
    }
  }
}
@media (max-width: 375px) {
  .dm {
    .dm-strip__in {
      gap: 12px;
    }
    .dm-strip__phone .dm-icon {
      display: none;
    }
  }
}
</style>
