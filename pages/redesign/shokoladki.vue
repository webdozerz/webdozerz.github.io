<script lang="ts" setup>
import {
  SK_ORIG, skPath, skLocal, skContacts, skTopLinks, skVisible, skGiftGroups, skCities, skRub, skPlural, skPackTags, skPackDesigns, skSection, skProduct,
} from '~/utils/shokoladki'
import { skProducts } from '~/utils/shokoladki.data'
import { useSkStore, useSkUi } from '~/composables/useShokoladki'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'
import SkPhone from '~/components/redesign/shokoladki/SkPhone.vue'

const route = useRoute()
const router = useRouter()
const store = useSkStore()
const ui = useSkUi()

useSeoMeta({
  title: 'Шоколадная фабрика «Верность качеству» — конфеты и шоколад APRIORI ручной работы | Концепт редизайна',
  description:
    'Концепт редизайна shokoladki.ru: конфеты и шоколад APRIORI ручной работы, подарочные наборы и корзины, конструктор «Соберите набор», бутики в Москве, Касимове и Рязани, подарки для компаний со скидкой до 25%.',
  ogTitle: 'Шоколадная фабрика «Верность качеству» — концепт редизайна',
  ogDescription: 'Соберите свой набор в коробке Deluxe APRIORI: 35 конфет ручной работы, лента и открытка — сумма на глазах.',
  ogImage: 'https://andryushov.me/redesign/shokoladki/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { lang: 'ru' },
  link: [
    { rel: 'icon', type: 'image/png', href: skLocal('favicon.png') },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Prata&display=swap' },
  ],
})

const to = (p: string) => skPath(p)
const year = new Date().getFullYear()
const isOn = (p: string) => route.path.startsWith(skPath(p))
const collection = skVisible('collection')
const souvenirs = skVisible('souvenir')
const saleCount = skProducts.filter((p) => p.o > p.p).length

// Мега-меню оригинала: «Коллекция», «Шоколадные подарки», «Сувениры» — наведение и нажатие
type Mega = '' | 'col' | 'gift' | 'souv'
const mega = ref<Mega>('')
const quiet = ref(false)
let megaTimer: ReturnType<typeof setTimeout> | undefined
const openMega = (k: Mega) => {
  if (quiet.value) return
  clearTimeout(megaTimer)
  mega.value = k
}
const leaveMega = () => {
  quiet.value = false
  megaTimer = setTimeout(() => (mega.value = ''), 140)
}
const toggleMega = (k: Mega) => (mega.value = mega.value === k ? '' : k)
const sec = (id: string) => ({ path: skPath(`/katalog/${id}/`) })

// Поиск с подсказками
const q = ref('')
const focus = ref(false)
const hits = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (s.length < 2) return []
  return skProducts.filter((p) => p.n.toLowerCase().includes(s)).slice(0, 6)
})
const hitCount = computed(() => {
  const s = q.value.trim().toLowerCase()
  return s.length < 2 ? 0 : skProducts.filter((p) => p.n.toLowerCase().includes(s)).length
})
const goSearch = () => {
  const s = q.value.trim()
  focus.value = false
  ui.search.value = false
  ;(document.activeElement as HTMLElement | null)?.blur?.()
  router.push({ path: skPath('/katalog/'), query: s ? { q: s } : {} })
}
const onBlurSearch = () => setTimeout(() => (focus.value = false), 160)

// Город: как попап «Ваш город» оригинала — меняет расчёт доставки
const cityQ = ref('')
const cityList = computed(() => {
  const s = cityQ.value.trim().toLowerCase()
  return s ? skCities.filter((c) => `${c.n} ${c.r}`.toLowerCase().includes(s)) : skCities
})
const pickCity = (n: string) => {
  store.setCity(n)
  ui.modal.value = ''
  cityQ.value = ''
  store.say(`Город доставки: ${n}`)
}

// Формы окон — демо, ничего не отправляют
const fb = reactive({ name: '', email: '', text: '', ok: false, sent: false })
const auth = reactive({ login: '', pass: '', name: '', last: '', email: '', phone: '', pass2: '', ok: false, show: false, sent: false })
const oc = reactive({ name: '', phone: '', addr: '', ok: false, sent: false })
const rv = reactive({ rate: 5, name: '', text: '', sent: false })
const pk = reactive({ tag: 'Все', design: 'd1', name: '', photo: '', sent: false })
const packList = computed(() => skPackDesigns.filter((d) => pk.tag === 'Все' || d.tags.includes(pk.tag)))
const packDesign = computed(() => skPackDesigns.find((d) => d.id === pk.design) || skPackDesigns[0])
const onPhoto = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  const r = new FileReader()
  r.onload = () => (pk.photo = String(r.result || ''))
  r.readAsDataURL(f)
}
const ocItem = computed(() => (ui.oneclick.value && ui.oneclick.value !== 'cart' ? skProduct(ui.oneclick.value) : undefined))
const ocSum = computed(() => (ocItem.value ? ocItem.value.p : store.sum.value))
const rvItem = computed(() => (ui.review.value ? skProduct(ui.review.value) : undefined))
const packItem = computed(() => (ui.pack.value ? skProduct(ui.pack.value) : undefined))
const sendPack = () => {
  if (!packItem.value) return
  store.add(packItem.value.id, 1, { pack: { design: packDesign.value.n, name: pk.name.trim(), photo: !!pk.photo } }, true)
  pk.sent = true
}

const openModal = (m: typeof ui.modal.value) => {
  ui.menu.value = false
  fb.sent = false
  auth.sent = false
  oc.sent = false
  rv.sent = false
  pk.sent = false
  ui.modal.value = m
}
// Окно могут открыть и страницы (товар, корзина) — каждое открытие начинается с чистой формы
watch(
  () => ui.modal.value,
  (m) => {
    if (!m) return
    fb.sent = false
    auth.sent = false
    oc.sent = false
    rv.sent = false
    pk.sent = false
  },
)
const doLogin = () => {
  store.login(auth.name || auth.login.split('@')[0], auth.email || auth.login)
  ui.modal.value = ''
  store.say(`Вы вошли. Демо: личный кабинет работает в этом браузере`, skPath('/kabinet/'), 'Кабинет')
}

// Тост, блокировка прокрутки, куки, «наверх»
let toastTimer: ReturnType<typeof setTimeout> | undefined
watch(
  () => store.toast.value?.id,
  () => {
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => (store.toast.value = null), 3400)
  },
)
const locked = computed(() => ui.menu.value || (!!ui.modal.value && ui.modal.value !== 'filters'))
watch(locked, (v) => {
  if (import.meta.client) document.documentElement.style.overflow = v ? 'hidden' : ''
})
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    ui.search.value = false
    if (ui.modal.value !== 'filters') ui.modal.value = ''
    focus.value = false
    if (mega.value) quiet.value = true
    mega.value = ''
    ;(document.activeElement as HTMLElement | null)?.blur?.()
  },
)
const cookies = ref(false)
const acceptCookies = () => {
  cookies.value = false
  try {
    localStorage.setItem('sk-cookies', '1')
  } catch {}
}
const sub = reactive({ email: '', ok: true, sent: false })
const showUp = ref(false)
const onScroll = () => (showUp.value = window.scrollY > 900)
const up = () => window.scrollTo({ top: 0, behavior: 'smooth' })
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    ui.menu.value = false
    ui.modal.value = ''
    mega.value = ''
  }
}
onMounted(() => {
  store.persist()
  try {
    cookies.value = !localStorage.getItem('sk-cookies')
  } catch {}
  window.addEventListener('keydown', onKey)
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  clearTimeout(toastTimer)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('scroll', onScroll)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div class="sk">
    <div class="sk-concept">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="SK_ORIG" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <!-- верхняя полоса оригинала: уезжает при прокрутке -->
    <div class="sk-strip">
      <div class="sk-wrap sk-strip__in">
        <button type="button" class="sk-strip__city" @click="openModal('city')"><SkIcon name="pin" /><span>{{ store.city.value }}</span><SkIcon name="down" /></button>
        <nav class="sk-strip__nav" aria-label="О компании">
          <NuxtLink v-for="[href, label] in skTopLinks" :key="href" :to="to(href)" :class="{ 'is-on': isOn(href) }">{{ label }}</NuxtLink>
        </nav>
        <div class="sk-strip__right">
          <a class="sk-strip__phone" :href="`tel:${skContacts.tel}`"><SkIcon name="phone" /><span>{{ skContacts.phone }}</span></a>
          <button type="button" class="sk-strip__fb" @click="openModal('feedback')"><SkIcon name="mail" /><span>Обратная связь</span></button>
        </div>
      </div>
    </div>

    <header class="sk-head" @mouseleave="leaveMega">
      <div class="sk-wrap sk-head__in sk-header__row">
        <button type="button" class="sk-iconbtn sk-head__burger" aria-label="Меню" @click="ui.menu.value = true"><SkIcon name="menu" /></button>
        <NuxtLink :to="to('/')" class="sk-logo" aria-label="АПРИОРИ — на главную">
          <img :src="skLocal('logo.png')" alt="АПРИОРИ. С любовью к шоколаду" width="236" height="140" />
        </NuxtLink>

        <nav class="sk-nav" :class="{ 'is-quiet': quiet }" aria-label="Каталог">
          <NuxtLink :to="to('/katalog/')" class="sk-nav__item" :class="{ 'is-open': mega === 'col' }" @mouseenter="openMega('col')" @focus="openMega('col')">Коллекция<SkIcon name="down" /></NuxtLink>
          <button type="button" class="sk-nav__item" :class="{ 'is-open': mega === 'gift' }" :aria-expanded="mega === 'gift'" @mouseenter="openMega('gift')" @click="toggleMega('gift')">
            Шоколадные подарки<SkIcon name="down" />
          </button>
          <button type="button" class="sk-nav__item" :class="{ 'is-open': mega === 'souv' }" :aria-expanded="mega === 'souv'" @mouseenter="openMega('souv')" @click="toggleMega('souv')">
            Сувениры<SkIcon name="down" />
          </button>
          <a :href="skContacts.logoSite" target="_blank" rel="noopener" class="sk-nav__item sk-nav__ext" @mouseenter="mega = ''">Шоколад с логотипом<SkIcon name="right" /></a>
          <NuxtLink :to="to('/nabor/')" class="sk-nav__item sk-nav__set" :class="{ 'is-on': isOn('/nabor') }" @mouseenter="mega = ''"><SkIcon name="candy" />Соберите набор</NuxtLink>
        </nav>

        <form class="sk-search" :class="{ 'is-open': ui.search.value }" role="search" @submit.prevent="goSearch">
          <SkIcon name="search" />
          <input v-model="q" type="search" placeholder="Трюфель, ассорти, корзина…" aria-label="Поиск по каталогу" @focus="focus = true" @blur="onBlurSearch" />
          <div v-if="focus && hits.length" class="sk-search__drop">
            <NuxtLink v-for="p in hits" :key="p.id" :to="to(`/tovar/${p.id}/`)" class="sk-search__hit">
              <img :src="p.img" alt="" width="56" height="45" />
              <span>{{ p.n }}</span>
              <b>{{ skRub(p.p) }}</b>
            </NuxtLink>
            <button type="submit" class="sk-search__all">Все результаты: {{ hitCount }}</button>
          </div>
        </form>

        <div class="sk-head__icons">
          <button type="button" class="sk-iconbtn sk-head__find" aria-label="Поиск" @click="ui.search.value = !ui.search.value"><SkIcon name="search" /></button>
          <NuxtLink v-if="store.user.value" :to="to('/kabinet/')" class="sk-iconbtn sk-head__acc" aria-label="Личный кабинет"><SkIcon name="user" /><small>Кабинет</small></NuxtLink>
          <button v-else type="button" class="sk-iconbtn sk-head__acc" aria-label="Вход" @click="openModal('login')"><SkIcon name="user" /><small>Войти</small></button>
          <NuxtLink :to="to('/izbrannoe/')" class="sk-iconbtn sk-head__fav" aria-label="Избранное">
            <SkIcon name="heart" /><small>Избранное</small>
            <i v-if="store.favCount.value" class="sk-badge">{{ store.favCount.value }}</i>
          </NuxtLink>
          <NuxtLink :to="to('/korzina/')" class="sk-cartbtn" aria-label="Корзина">
            <SkIcon name="cart" />
            <span class="sk-cartbtn__sum">{{ store.count.value ? skRub(store.sum.value) : 'Корзина' }}</span>
            <i v-if="store.count.value" class="sk-badge">{{ store.count.value }}</i>
          </NuxtLink>
        </div>
      </div>

      <!-- выпадающие меню -->
      <div v-if="mega" class="sk-mega" @mouseenter="openMega(mega)">
        <div class="sk-wrap sk-mega__in">
          <template v-if="mega === 'col'">
            <div class="sk-mega__cols sk-mega__cols--col">
              <NuxtLink v-for="s in collection" :key="s.id" :to="sec(s.id)" class="sk-mega__link">
                <span>{{ s.n }}</span><small>{{ s.count }}</small>
              </NuxtLink>
            </div>
            <NuxtLink :to="sec('na-novyy-god')" class="sk-mega__promo">
              <img src="https://www.shokoladki.ru/upload/iblock/efe/v5gitf05hmntk9ww4h9t84dib5if76vz.jpg" alt="" />
              <span><b>Сияние волшебства</b>Новогодняя коллекция · {{ skSection('na-novyy-god')?.count }} подарков</span>
            </NuxtLink>
          </template>
          <template v-else-if="mega === 'gift'">
            <div v-for="g in skGiftGroups" :key="g.g" class="sk-mega__group">
              <b>{{ g.n }}</b>
              <NuxtLink v-for="s in skVisible(g.g)" :key="s.id" :to="sec(s.id)" class="sk-mega__link">
                <span>{{ s.n }}</span><small>{{ s.count }}</small>
              </NuxtLink>
            </div>
          </template>
          <template v-else>
            <div class="sk-mega__cols">
              <NuxtLink v-for="s in souvenirs" :key="s.id" :to="sec(s.id)" class="sk-mega__link">
                <span>{{ s.n }}</span><small>{{ s.count }}</small>
              </NuxtLink>
            </div>
            <NuxtLink :to="to('/korporativnym/')" class="sk-mega__note">
              <SkIcon name="percent" /><span><b>Корпоративным клиентам — скидка до 25%</b>Шоколад с логотипом, подарки коллегам и партнёрам</span>
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <main class="sk-main">
      <NuxtPage />
    </main>

    <footer class="sk-foot">
      <div class="sk-foot__band" aria-hidden="true" />
      <div class="sk-wrap">
        <div class="sk-foot__sub">
          <div>
            <b>Подписывайтесь на новости и специальные предложения</b>
            <span>Никакого спама — только новые коллекции и акции.</span>
          </div>
          <form v-if="!sub.sent" class="sk-foot__form" @submit.prevent="sub.sent = true">
            <input v-model="sub.email" class="sk-input" type="email" required placeholder="Ваш e-mail" aria-label="E-mail для подписки" />
            <button class="sk-btn" type="submit">Подписаться</button>
            <label class="sk-check sk-check--small"><input v-model="sub.ok" type="checkbox" required /><span>Согласен с <NuxtLink :to="to('/politika/')">условиями обработки персональной информации</NuxtLink></span></label>
          </form>
          <p v-else class="sk-done"><SkIcon name="check" />Готово: {{ sub.email }} подписан. Это демо, письма не придут.</p>
        </div>
        <div class="sk-foot__grid">
          <div class="sk-foot__brand">
            <img :src="skLocal('logo.png')" alt="АПРИОРИ" width="236" height="140" />
            <p>Кондитерская фабрика «Верность качеству» — с 2001 года. Производство в Касимове, офис в Москве.</p>
            <div class="sk-foot__social">
              <a :href="skContacts.vk" target="_blank" rel="noopener" aria-label="ВКонтакте «Верность качеству»"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12.9 17.5c-5.6 0-8.8-3.8-8.9-10.2h2.8c.1 4.7 2.1 6.6 3.7 7V7.3h2.6v4c1.6-.2 3.3-2 3.8-4h2.6c-.4 2.5-2.2 4.3-3.5 5 1.3.6 3.4 2.2 4.2 5.2h-2.9c-.6-1.9-2.2-3.4-4.2-3.6v3.6h-.2Z" /></svg>Верность качеству</a>
              <a :href="skContacts.vk2" target="_blank" rel="noopener" aria-label="ВКонтакте «Шоколад Априори»"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12.9 17.5c-5.6 0-8.8-3.8-8.9-10.2h2.8c.1 4.7 2.1 6.6 3.7 7V7.3h2.6v4c1.6-.2 3.3-2 3.8-4h2.6c-.4 2.5-2.2 4.3-3.5 5 1.3.6 3.4 2.2 4.2 5.2h-2.9c-.6-1.9-2.2-3.4-4.2-3.6v3.6h-.2Z" /></svg>Шоколад Априори</a>
            </div>
          </div>
          <nav class="sk-foot__col" aria-label="Каталог">
            <b>Каталог</b>
            <NuxtLink :to="to('/katalog/')">Вся коллекция</NuxtLink>
            <NuxtLink :to="sec('na-novyy-god')">На Новый год</NuxtLink>
            <NuxtLink :to="sec('handmade-chocolates')">Конфеты ручной работы</NuxtLink>
            <NuxtLink :to="sec('gift-baskets')">Подарочные корзины</NuxtLink>
            <NuxtLink :to="sec('individual-packing')">Именные подарки</NuxtLink>
            <NuxtLink :to="{ path: to('/katalog/'), query: { sale: '1' } }">Акции и скидки · {{ saleCount }}</NuxtLink>
            <NuxtLink :to="to('/nabor/')">Соберите набор</NuxtLink>
          </nav>
          <nav class="sk-foot__col" aria-label="О компании">
            <b>О компании</b>
            <NuxtLink :to="to('/o-kompanii/')">О нас</NuxtLink>
            <NuxtLink :to="{ path: to('/blog/'), query: { tab: 'news' } }">Новости компании</NuxtLink>
            <NuxtLink :to="to('/butiki/')">Бутики в Москве и городах России</NuxtLink>
            <NuxtLink :to="to('/vakansii/')">Вакансии</NuxtLink>
            <NuxtLink :to="to('/blog/')">Блог</NuxtLink>
            <NuxtLink :to="to('/otzyvy/')">Отзывы</NuxtLink>
            <NuxtLink :to="to('/faq/')">Вопросы и ответы</NuxtLink>
            <NuxtLink :to="to('/politika/')">Политика и cookies</NuxtLink>
          </nav>
          <div class="sk-foot__col sk-foot__contacts">
            <b>Контакты</b>
            <a :href="`tel:${skContacts.tel}`" class="sk-foot__phone">{{ skContacts.phone }}</a>
            <a :href="`tel:${skContacts.shopTel}`">{{ skContacts.shopPhone }} — интернет-магазин</a>
            <a :href="`mailto:${skContacts.email}`">{{ skContacts.email }}</a>
            <span>{{ skContacts.ordersHours }}</span>
            <span>Офис: {{ skContacts.office }}</span>
          </div>
        </div>
        <div class="sk-foot__legal">
          <span>© 2001–{{ year }} Кондитерская фабрика «Верность качеству» · ООО «Шоколатье», ИНН 5075026911, ОГРН 1145075002984</span>
          <span>Тексты, цены и изображения принадлежат владельцу сайта shokoladki.ru. Концепт редизайна — демонстрация, заказы не принимаются.</span>
        </div>
      </div>
    </footer>

    <!-- мобильный таббар -->
    <nav class="sk-tabbar" aria-label="Быстрые разделы">
      <NuxtLink :to="to('/katalog/')" :class="{ 'is-on': isOn('/katalog') }"><SkIcon name="grid" /><span>Каталог</span></NuxtLink>
      <NuxtLink :to="to('/nabor/')" :class="{ 'is-on': isOn('/nabor') }"><SkIcon name="candy" /><span>Набор</span></NuxtLink>
      <NuxtLink :to="to('/izbrannoe/')" :class="{ 'is-on': isOn('/izbrannoe') }">
        <SkIcon name="heart" /><span>Избранное</span><i v-if="store.favCount.value" class="sk-badge">{{ store.favCount.value }}</i>
      </NuxtLink>
      <NuxtLink :to="to('/korzina/')" class="sk-tabbar__cart" :class="{ 'is-on': isOn('/korzina') }">
        <SkIcon name="cart" /><span>{{ store.count.value ? skRub(store.sum.value) : 'Корзина' }}</span><i v-if="store.count.value" class="sk-badge">{{ store.count.value }}</i>
      </NuxtLink>
    </nav>

    <!-- бургер -->
    <div v-if="ui.menu.value" class="sk-drawer" role="dialog" aria-modal="true" aria-label="Меню" @click.self="ui.menu.value = false">
      <div class="sk-drawer__box">
        <div class="sk-drawer__top">
          <b>Меню</b>
          <button type="button" class="sk-iconbtn" aria-label="Закрыть" @click="ui.menu.value = false"><SkIcon name="close" /></button>
        </div>
        <button type="button" class="sk-drawer__city" @click="openModal('city')"><SkIcon name="pin" />Город: <b>{{ store.city.value }}</b></button>
        <NuxtLink :to="to('/nabor/')" class="sk-drawer__set"><SkIcon name="candy" />Соберите набор</NuxtLink>
        <details class="sk-drawer__grp">
          <summary>Коллекция</summary>
          <NuxtLink v-for="s in collection" :key="s.id" :to="sec(s.id)">{{ s.n }} <small>{{ s.count }}</small></NuxtLink>
        </details>
        <details class="sk-drawer__grp">
          <summary>Шоколадные подарки</summary>
          <template v-for="g in skGiftGroups" :key="g.g">
            <b class="sk-drawer__sub">{{ g.n }}</b>
            <NuxtLink v-for="s in skVisible(g.g)" :key="s.id" :to="sec(s.id)">{{ s.n }} <small>{{ s.count }}</small></NuxtLink>
          </template>
        </details>
        <details class="sk-drawer__grp">
          <summary>Сувениры</summary>
          <NuxtLink v-for="s in souvenirs" :key="s.id" :to="sec(s.id)">{{ s.n }} <small>{{ s.count }}</small></NuxtLink>
        </details>
        <a :href="skContacts.logoSite" target="_blank" rel="noopener" class="sk-drawer__link">Шоколад с логотипом ↗</a>
        <NuxtLink :to="{ path: to('/katalog/'), query: { sale: '1' } }" class="sk-drawer__link">Акции и скидки · {{ saleCount }}</NuxtLink>
        <div class="sk-drawer__links">
          <NuxtLink v-for="[href, label] in skTopLinks" :key="href" :to="to(href)">{{ label }}</NuxtLink>
          <NuxtLink :to="to('/otzyvy/')">Отзывы</NuxtLink>
        </div>
        <div class="sk-drawer__foot">
          <a :href="`tel:${skContacts.tel}`" class="sk-btn sk-btn--line"><SkIcon name="phone" />{{ skContacts.phone }}</a>
          <button type="button" class="sk-btn sk-btn--line" @click="openModal('feedback')"><SkIcon name="mail" />Обратная связь</button>
          <button v-if="!store.user.value" type="button" class="sk-btn sk-btn--line" @click="openModal('login')"><SkIcon name="user" />Войти</button>
        </div>
      </div>
    </div>

    <!-- окна -->
    <div v-if="ui.modal.value && ui.modal.value !== 'filters'" class="sk-modal" role="dialog" aria-modal="true" @click.self="ui.modal.value = ''">
      <div class="sk-modal__box" :class="{ 'sk-modal__box--wide': ui.modal.value === 'pack' }">
        <button type="button" class="sk-iconbtn sk-modal__x" aria-label="Закрыть" @click="ui.modal.value = ''"><SkIcon name="close" /></button>

        <template v-if="ui.modal.value === 'city'">
          <h2 class="sk-modal__title">Ваш город</h2>
          <p class="sk-modal__lead">От города зависят срок и стоимость доставки. В демо — основные города, в рабочей версии — все 1&nbsp;272.</p>
          <input v-model="cityQ" class="sk-input" placeholder="Начните вводить город" aria-label="Поиск города" />
          <div class="sk-modal__cities">
            <button v-for="c in cityList" :key="c.n" type="button" :class="{ 'is-on': c.n === store.city.value }" @click="pickCity(c.n)">
              <b>{{ c.n }}</b><small>{{ c.r }}</small>
            </button>
            <p v-if="!cityList.length" class="sk-muted">Такого города нет в демо-списке — в рабочей версии будут все.</p>
          </div>
        </template>

        <template v-else-if="ui.modal.value === 'feedback'">
          <h2 class="sk-modal__title">Напишите нам</h2>
          <p class="sk-modal__lead">Ответим на почту в рабочее время: пн–пт 10:00–18:00.</p>
          <form v-if="!fb.sent" class="sk-form" @submit.prevent="fb.sent = true">
            <label class="sk-field"><span>Ваше имя</span><input v-model="fb.name" class="sk-input" required autocomplete="name" /></label>
            <label class="sk-field"><span>Ваш e-mail</span><input v-model="fb.email" class="sk-input" type="email" required autocomplete="email" /></label>
            <label class="sk-field"><span>Сообщение</span><textarea v-model="fb.text" class="sk-input" rows="4" required /></label>
            <label class="sk-check sk-check--small"><input v-model="fb.ok" type="checkbox" required /><span>Согласен с <NuxtLink :to="to('/politika/')">условиями обработки персональной информации</NuxtLink></span></label>
            <button class="sk-btn sk-btn--big" type="submit">Отправить</button>
          </form>
          <p v-else class="sk-done"><SkIcon name="check" />Спасибо, {{ fb.name }}! Это демо: сообщение никуда не ушло. Пишите на {{ skContacts.email }}.</p>
        </template>

        <template v-else-if="ui.modal.value === 'login'">
          <h2 class="sk-modal__title">Вход</h2>
          <form class="sk-form" @submit.prevent="doLogin">
            <label class="sk-field"><span>Логин или e-mail</span><input v-model="auth.login" class="sk-input" required autocomplete="username" /></label>
            <label class="sk-field"><span>Пароль</span><input v-model="auth.pass" class="sk-input" :type="auth.show ? 'text' : 'password'" required autocomplete="current-password" /></label>
            <button class="sk-btn sk-btn--big" type="submit">Войти</button>
          </form>
          <div class="sk-modal__links">
            <button type="button" class="sk-link" @click="openModal('register')">Регистрация</button>
            <button type="button" class="sk-link" @click="openModal('forgot')">Забыли пароль?</button>
          </div>
        </template>

        <template v-else-if="ui.modal.value === 'register'">
          <h2 class="sk-modal__title">Регистрация</h2>
          <form class="sk-form sk-form--two" @submit.prevent="doLogin">
            <label class="sk-field"><span>Имя</span><input v-model="auth.name" class="sk-input" required autocomplete="given-name" /></label>
            <label class="sk-field"><span>Фамилия</span><input v-model="auth.last" class="sk-input" autocomplete="family-name" /></label>
            <label class="sk-field"><span>E-mail</span><input v-model="auth.email" class="sk-input" type="email" required autocomplete="email" /></label>
            <label class="sk-field"><span>Ваш телефон</span><SkPhone v-model="auth.phone" class="sk-input" /></label>
            <label class="sk-field"><span>Пароль</span><input v-model="auth.pass" class="sk-input" :type="auth.show ? 'text' : 'password'" required autocomplete="new-password" /></label>
            <label class="sk-field"><span>Подтверждение</span><input v-model="auth.pass2" class="sk-input" :type="auth.show ? 'text' : 'password'" required autocomplete="new-password" /></label>
            <label class="sk-check sk-check--small sk-form__wide"><input v-model="auth.show" type="checkbox" /><span>Показать пароль</span></label>
            <label class="sk-check sk-check--small sk-form__wide"><input v-model="auth.ok" type="checkbox" required /><span>Согласен с <NuxtLink :to="to('/politika/')">условиями обработки персональной информации</NuxtLink></span></label>
            <p v-if="auth.pass2 && auth.pass !== auth.pass2" class="sk-error sk-form__wide">Пароли не совпадают</p>
            <button class="sk-btn sk-btn--big sk-form__wide" type="submit" :disabled="!!auth.pass2 && auth.pass !== auth.pass2">Зарегистрироваться</button>
          </form>
          <div class="sk-modal__links"><button type="button" class="sk-link" @click="openModal('login')">У меня уже есть аккаунт</button></div>
        </template>

        <template v-else-if="ui.modal.value === 'forgot'">
          <h2 class="sk-modal__title">Восстановление пароля</h2>
          <form v-if="!auth.sent" class="sk-form" @submit.prevent="auth.sent = true">
            <label class="sk-field"><span>E-mail</span><input v-model="auth.email" class="sk-input" type="email" required autocomplete="email" /></label>
            <button class="sk-btn sk-btn--big" type="submit">Восстановить</button>
          </form>
          <p v-else class="sk-done"><SkIcon name="check" />Демо: на {{ auth.email }} письмо не уйдёт, в рабочей версии придёт ссылка для смены пароля.</p>
          <div class="sk-modal__links"><button type="button" class="sk-link" @click="openModal('login')">Вернуться ко входу</button></div>
        </template>

        <template v-else-if="ui.modal.value === 'oneclick'">
          <h2 class="sk-modal__title">Купить в один клик</h2>
          <p class="sk-modal__lead">
            <template v-if="ocItem">{{ ocItem.n }} — {{ skRub(ocSum) }}.</template>
            <template v-else>Корзина: {{ store.count.value }} {{ skPlural(store.count.value, 'товар', 'товара', 'товаров') }} на {{ skRub(ocSum) }}.</template>
            Менеджер перезвонит и уточнит доставку. При заказе в один клик бонусы не списываются.
          </p>
          <form v-if="!oc.sent" class="sk-form" @submit.prevent="oc.sent = true">
            <label class="sk-field"><span>Ваше имя</span><input v-model="oc.name" class="sk-input" required autocomplete="name" /></label>
            <label class="sk-field"><span>Ваш телефон</span><SkPhone v-model="oc.phone" class="sk-input" required /></label>
            <label class="sk-field"><span>Адрес</span><input v-model="oc.addr" class="sk-input" autocomplete="street-address" /></label>
            <label class="sk-check sk-check--small"><input v-model="oc.ok" type="checkbox" required /><span>Согласен с <NuxtLink :to="to('/politika/')">условиями обработки персональной информации</NuxtLink></span></label>
            <button class="sk-btn sk-btn--big" type="submit">Заказать</button>
          </form>
          <p v-else class="sk-done"><SkIcon name="check" />Спасибо, {{ oc.name }}! Это демо: заказ никуда не отправлен.</p>
        </template>

        <template v-else-if="ui.modal.value === 'review'">
          <h2 class="sk-modal__title">Написать отзыв</h2>
          <p v-if="rvItem" class="sk-modal__lead">{{ rvItem.n }}</p>
          <form v-if="!rv.sent" class="sk-form" @submit.prevent="rv.sent = true">
            <div class="sk-field">
              <span>Оценка</span>
              <div class="sk-rate" role="radiogroup" aria-label="Оценка">
                <button v-for="n in 5" :key="n" type="button" role="radio" :aria-checked="rv.rate === n" :class="{ 'is-on': n <= rv.rate }" :aria-label="`${n} из 5`" @click="rv.rate = n"><SkIcon name="star" /></button>
              </div>
            </div>
            <label class="sk-field"><span>Ваше имя</span><input v-model="rv.name" class="sk-input" required /></label>
            <label class="sk-field"><span>Отзыв</span><textarea v-model="rv.text" class="sk-input" rows="4" required /></label>
            <button class="sk-btn sk-btn--big" type="submit">Отправить</button>
          </form>
          <p v-else class="sk-done"><SkIcon name="check" />Спасибо за отзыв! Это демо: он не опубликован.</p>
        </template>

        <template v-else-if="ui.modal.value === 'pack' && packItem">
          <h2 class="sk-modal__title">Оформить упаковку</h2>
          <p class="sk-modal__lead">{{ packItem.n }} — {{ skRub(packItem.p) }}. Дизайн крышки, ваше фото и имя.</p>
          <div v-if="!pk.sent" class="sk-pack">
            <div class="sk-pack__preview" :style="{ background: packDesign.bg, color: packDesign.fg }">
              <img v-if="pk.photo && packDesign.tags.includes('С фото')" :src="pk.photo" alt="Ваше фото" />
              <span v-else-if="packDesign.tags.includes('С фото')" class="sk-pack__ph"><SkIcon name="photo" />Здесь будет фото</span>
              <b>{{ pk.name || 'Имя' }}</b>
              <small>{{ packDesign.n }}</small>
            </div>
            <div class="sk-pack__side">
              <div class="sk-chips">
                <button v-for="t in skPackTags" :key="t" type="button" class="sk-chip" :class="{ 'is-on': pk.tag === t }" @click="pk.tag = t">{{ t }}</button>
              </div>
              <div class="sk-pack__designs">
                <button v-for="d in packList" :key="d.id" type="button" :class="{ 'is-on': pk.design === d.id }" :style="{ background: d.bg, color: d.fg }" @click="pk.design = d.id">{{ d.n }}</button>
              </div>
              <label class="sk-field"><span>Фото на упаковку</span><input class="sk-input" type="file" accept="image/*" name="photo" @change="onPhoto" /></label>
              <label class="sk-field"><span>Имя</span><input v-model="pk.name" class="sk-input" maxlength="24" placeholder="Например, Анна" /></label>
              <p class="sk-muted">Демо: дизайны нарисованы для примера, в рабочей версии — ваши ~20 макетов.</p>
              <button type="button" class="sk-btn sk-btn--big" @click="sendPack"><SkIcon name="cart" />В корзину с упаковкой</button>
            </div>
          </div>
          <p v-else class="sk-done"><SkIcon name="check" />Именной подарок в корзине.<NuxtLink :to="to('/korzina/')">Перейти в корзину</NuxtLink></p>
        </template>
      </div>
    </div>

    <div v-if="store.toast.value" class="sk-toast" role="status">
      <SkIcon name="check" /><span>{{ store.toast.value.text }}</span>
      <NuxtLink v-if="store.toast.value.link" :to="store.toast.value.link">{{ store.toast.value.linkText }}</NuxtLink>
    </div>
    <div v-if="cookies" class="sk-cookies">
      <span>Сайт использует cookie и Яндекс.Метрику. Продолжая, вы соглашаетесь с <NuxtLink :to="to('/politika/')">политикой конфиденциальности</NuxtLink>.</span>
      <button type="button" class="sk-btn sk-btn--small" @click="acceptCookies">Я согласен</button>
    </div>
    <button v-if="showUp" type="button" class="sk-up" aria-label="Наверх" @click="up"><SkIcon name="up" /></button>
  </div>
</template>

<style lang="scss">
.sk {
  --sk-acc: #643335;
  --sk-acc-dark: #4c2426;
  --sk-ink: #2b1a19;
  --sk-muted: #77625f;
  --sk-foil: #b57d62;
  --sk-foil-soft: #e3c3b1;
  --sk-soft: #f8eeea;
  --sk-surface: #f6f2f0;
  --sk-line: #ebe2de;
  --sk-green: #4d7a1c;
  --sk-green-soft: #edf5e1;
  --sk-red: #c0303f;
  --sk-head: 'Prata', Georgia, serif;
  --sk-font: 'Manrope', system-ui, sans-serif;
  --sk-headh: 76px;
  min-height: 100vh;
  background: #fff;
  color: var(--sk-ink);
  font: 400 15px/1.55 var(--sk-font);
  -webkit-font-smoothing: antialiased;
}
html:has(.sk) {
  scroll-padding-top: 96px;
}
:where(.sk) {
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
.sk {
  .sk-icon {
    width: 20px;
    height: 20px;
    flex: none;
  }
  .sk-wrap {
    width: 100%;
    max-width: 1360px;
    margin: 0 auto;
    padding-left: 32px;
    padding-right: 32px;
  }
  .sk-main {
    padding-bottom: 80px;
  }
  .sk-muted {
    color: var(--sk-muted);
  }
  .sk-concept {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 12px;
    padding: 8px 16px;
    background: var(--sk-ink);
    color: #ead9d3;
    font-size: 13px;
    text-align: center;
    a {
      color: #fff;
      font-weight: 700;
    }
  }
  :is(.sk-candies, .sk-shelf__track, .sk-gal__thumbs, .sk-build__candies, .sk-tabs, .sk-chips--scroll) {
    scrollbar-color: var(--sk-foil-soft) transparent;
    scrollbar-width: thin;
    &::-webkit-scrollbar {
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--sk-foil-soft);
      border-radius: 6px;
    }
  }

  // кнопки, поля, чипы
  .sk-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 20px;
    border: 0;
    border-radius: 10px;
    background: var(--sk-acc);
    color: #fff;
    font: 700 15px/1.1 var(--sk-font);
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background: var(--sk-acc-dark);
    }
    &:disabled {
      background: #c9b8b4;
      cursor: default;
    }
    .sk-icon {
      width: 19px;
      height: 19px;
    }
  }
  .sk-btn--big {
    min-height: 52px;
    padding: 0 26px;
    font-size: 16px;
  }
  .sk-btn--small {
    min-height: 36px;
    padding: 0 14px;
    font-size: 14px;
  }
  .sk-btn--line,
  .sk-btn--line:focus,
  .sk-btn--line:active {
    background: #fff;
    color: var(--sk-ink);
    border: 1px solid var(--sk-line);
  }
  .sk-btn--line:hover {
    background: #fff;
    border-color: var(--sk-acc);
    color: var(--sk-acc);
  }
  .sk-btn--soft {
    background: var(--sk-soft);
    color: var(--sk-acc);
    &:hover {
      background: #f1ddd6;
    }
  }
  .sk-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
    border: 0;
    background: none;
    color: var(--sk-acc);
    font: 700 14px/1.3 var(--sk-font);
    text-decoration: none;
    cursor: pointer;
    .sk-icon {
      width: 18px;
      height: 18px;
    }
    &:hover {
      color: var(--sk-acc-dark);
      text-decoration: underline;
    }
  }
  .sk-iconbtn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 10px;
    background: none;
    color: var(--sk-ink);
    text-decoration: none;
    cursor: pointer;
    .sk-icon {
      width: 23px;
      height: 23px;
    }
    &:hover {
      color: var(--sk-acc);
    }
  }
  .sk-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    display: grid;
    place-items: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--sk-acc);
    color: #fff;
    font: 800 11px/1 var(--sk-font);
    font-style: normal;
  }
  .sk-input {
    width: 100%;
    min-height: 46px;
    padding: 10px 14px;
    border: 1px solid #ddd1cc;
    border-radius: 10px;
    background: #fff;
    color: var(--sk-ink);
    font: 400 15px/1.4 var(--sk-font);
    &:focus {
      outline: 2px solid var(--sk-foil-soft);
      border-color: var(--sk-foil);
    }
  }
  textarea.sk-input {
    resize: vertical;
  }
  select.sk-input,
  .sk-select select {
    appearance: none;
    padding-right: 40px;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23643335' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") right 14px center / 18px no-repeat;
  }
  .sk-select {
    display: grid;
    gap: 8px;
    span {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 14.5px;
    }
    small {
      color: var(--sk-muted);
      font-weight: 600;
    }
    select {
      width: 100%;
      min-height: 44px;
      padding: 8px 40px 8px 12px;
      border: 1px solid #ddd1cc;
      border-radius: 10px;
      font: 400 14.5px/1.3 var(--sk-font);
      color: var(--sk-ink);
    }
  }
  .sk-field {
    display: grid;
    gap: 8px;
    align-content: start;
    > span {
      font-size: 13.5px;
      font-weight: 700;
      color: var(--sk-ink);
    }
  }
  .sk-form {
    display: grid;
    gap: 14px;
    align-items: start;
  }
  .sk-form--two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .sk-form__wide {
    grid-column: 1 / -1;
  }
  .sk-check {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    cursor: pointer;
    input {
      flex: none;
      width: 20px;
      height: 20px;
      min-height: 0;
      margin: 1px 0 0;
      padding: 0;
      accent-color: var(--sk-acc);
    }
    span {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 8px;
      font-weight: 700;
      font-size: 14.5px;
    }
    small {
      color: var(--sk-muted);
      font-weight: 600;
    }
  }
  .sk-check--small span {
    display: inline;
    font-weight: 500;
    font-size: 13px;
    color: var(--sk-muted);
    a {
      color: var(--sk-acc);
    }
  }
  .sk-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .sk-chips--scroll {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
  }
  .sk-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 38px;
    padding: 0 14px;
    border: 1px solid var(--sk-line);
    border-radius: 999px;
    background: #fff;
    color: var(--sk-ink);
    font: 600 14px/1.2 var(--sk-font);
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    small {
      color: var(--sk-muted);
      font-weight: 500;
    }
    &:hover {
      border-color: var(--sk-foil);
    }
    &.is-on,
    &.router-link-exact-active {
      border-color: var(--sk-acc);
      background: var(--sk-soft);
      color: var(--sk-acc);
    }
  }
  .sk-tag {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    padding: 0 9px;
    border-radius: 7px;
    background: #fff;
    color: var(--sk-ink);
    font: 800 12px/1 var(--sk-font);
    box-shadow: 0 1px 3px rgba(43, 26, 25, 0.12);
  }
  .sk-tag--sale {
    background: var(--sk-red);
    color: #fff;
  }
  .sk-qty {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-height: 42px;
    padding: 3px;
    border-radius: 10px;
    background: var(--sk-soft);
    button {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      border: 0;
      border-radius: 8px;
      background: #fff;
      color: var(--sk-acc);
      cursor: pointer;
      .sk-icon {
        width: 18px;
        height: 18px;
      }
      &:hover {
        background: var(--sk-acc);
        color: #fff;
      }
    }
    b {
      min-width: 28px;
      padding: 0 6px;
      text-align: center;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }
  }
  .sk-done {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 10px;
    padding: 14px 16px;
    border-radius: 12px;
    background: var(--sk-green-soft);
    color: #2f4d10;
    font-weight: 600;
    .sk-icon {
      color: var(--sk-green);
    }
    a {
      color: var(--sk-acc);
    }
  }
  .sk-error {
    color: var(--sk-red);
    font-size: 13.5px;
    font-weight: 600;
  }
  .sk-h1 {
    font: 400 clamp(30px, 3.2vw, 44px) / 1.12 var(--sk-head);
    color: var(--sk-ink);
  }
  .sk-h2 {
    font: 400 clamp(26px, 2.4vw, 34px) / 1.15 var(--sk-head);
    color: var(--sk-ink);
  }
  .sk-crumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 8px;
    padding: 18px 0 12px;
    font-size: 13.5px;
    color: var(--sk-muted);
    a {
      color: var(--sk-muted);
      text-decoration: none;
      &:hover {
        color: var(--sk-acc);
      }
    }
    span::before {
      content: '/';
      margin-right: 8px;
      color: #cdbcb6;
    }
  }
  .sk-page {
    display: grid;
    gap: 28px;
  }
  .sk-pagehead {
    display: grid;
    gap: 10px;
    padding-bottom: 6px;
    p {
      max-width: 70ch;
      color: var(--sk-muted);
      font-size: 16px;
    }
  }
  .sk-sechead {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }
  .sk-section {
    padding-top: 56px;
  }
  .sk-panel {
    padding: 24px;
    border-radius: 18px;
    background: var(--sk-surface);
  }
  .sk-box {
    padding: 24px;
    border: 1px solid var(--sk-line);
    border-radius: 18px;
    background: #fff;
  }
  .sk-text {
    display: grid;
    gap: 12px;
    max-width: 78ch;
    font-size: 16px;
    line-height: 1.65;
    h2,
    h3 {
      margin-top: 12px;
      font: 400 24px/1.2 var(--sk-head);
    }
    ul.sk-text__list {
      display: grid;
      gap: 6px;
      padding-left: 20px;
      list-style: disc;
    }
  }
  .sk-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }
  .sk-empty {
    display: grid;
    justify-items: center;
    gap: 12px;
    padding: 48px 20px;
    border-radius: 18px;
    background: var(--sk-surface);
    text-align: center;
    p {
      color: var(--sk-muted);
    }
  }

  // верхняя полоса
  .sk-strip {
    border-bottom: 1px solid var(--sk-line);
    background: #fff;
    font-size: 13.5px;
  }
  .sk-strip__in {
    display: flex;
    align-items: center;
    gap: 18px;
    min-height: 42px;
  }
  .sk-strip__city,
  .sk-strip__fb {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--sk-ink);
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;
    .sk-icon {
      width: 17px;
      height: 17px;
      color: var(--sk-foil);
    }
    &:hover {
      color: var(--sk-acc);
    }
  }
  .sk-strip__nav {
    display: flex;
    flex: 1;
    gap: 2px 16px;
    min-width: 0;
    a {
      color: var(--sk-muted);
      text-decoration: none;
      white-space: nowrap;
      &:hover,
      &.is-on {
        color: var(--sk-acc);
      }
    }
  }
  .sk-strip__right {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-left: auto;
  }
  .sk-strip__phone {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 800;
    font-size: 14.5px;
    text-decoration: none;
    white-space: nowrap;
    .sk-icon {
      width: 17px;
      height: 17px;
      color: var(--sk-foil);
    }
  }

  // шапка
  .sk-head {
    position: sticky;
    top: 0;
    z-index: 40;
    background: #fff;
    border-bottom: 1px solid var(--sk-line);
  }
  .sk-head__in {
    display: flex;
    align-items: center;
    gap: 20px;
    height: var(--sk-headh);
  }
  .sk-head__burger {
    display: none;
  }
  .sk-logo {
    flex: none;
    display: block;
    img {
      display: block;
      width: auto;
      height: 58px;
    }
  }
  .sk-nav {
    flex: none;
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .sk-nav__item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 44px;
    padding: 0 11px;
    border: 0;
    border-radius: 10px;
    background: none;
    color: var(--sk-ink);
    font: 700 15px/1 var(--sk-font);
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    .sk-icon {
      width: 16px;
      height: 16px;
      color: var(--sk-muted);
      transition: transform 0.2s;
    }
    &:hover,
    &.is-open {
      color: var(--sk-acc);
      background: var(--sk-surface);
    }
    &.is-open .sk-icon {
      transform: rotate(180deg);
    }
  }
  .sk-nav__set {
    color: var(--sk-acc);
    background: var(--sk-soft);
    .sk-icon {
      width: 19px;
      height: 19px;
      color: var(--sk-acc);
    }
    &:hover,
    &.is-on {
      background: #f1ddd6;
    }
  }
  .sk-nav.is-quiet .sk-nav__item:hover {
    background: none;
  }
  .sk-search {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 180px;
    > .sk-icon {
      position: absolute;
      left: 14px;
      color: var(--sk-muted);
      pointer-events: none;
    }
    input {
      width: 100%;
      height: 44px;
      padding: 0 14px 0 44px;
      border: 1px solid transparent;
      border-radius: 10px;
      background: var(--sk-surface);
      color: var(--sk-ink);
      font: 400 15px/1 var(--sk-font);
      &:focus {
        outline: none;
        border-color: var(--sk-foil);
        background: #fff;
      }
    }
  }
  .sk-search__drop {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + 6px);
    z-index: 5;
    display: grid;
    min-width: 320px;
    padding: 6px;
    border: 1px solid var(--sk-line);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 2px 6px rgba(43, 26, 25, 0.08), 0 22px 54px rgba(43, 26, 25, 0.22);
  }
  .sk-search__hit {
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    padding: 6px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 14px;
    img {
      width: 56px;
      height: 45px;
      object-fit: cover;
      border-radius: 8px;
    }
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    b {
      color: var(--sk-acc);
      white-space: nowrap;
    }
    &:hover {
      background: var(--sk-surface);
    }
  }
  .sk-search__all {
    min-height: 40px;
    margin-top: 4px;
    border: 0;
    border-radius: 10px;
    background: var(--sk-soft);
    color: var(--sk-acc);
    font-weight: 700;
    cursor: pointer;
  }
  .sk-head__icons {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-left: auto;
  }
  .sk-head__find {
    display: none;
  }
  .sk-head__acc,
  .sk-head__fav {
    flex-direction: column;
    min-width: 64px;
    small {
      font-size: 11.5px;
      font-weight: 600;
      color: var(--sk-muted);
    }
    .sk-badge {
      right: 12px;
    }
  }
  .sk-cartbtn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: 140px;
    height: 46px;
    margin-left: 6px;
    padding: 0 14px;
    border-radius: 10px;
    background: var(--sk-acc);
    color: #fff;
    text-decoration: none;
    font-weight: 800;
    font-size: 14.5px;
    font-variant-numeric: tabular-nums;
    &:hover {
      background: var(--sk-acc-dark);
    }
    .sk-badge {
      top: -6px;
      right: -6px;
      background: var(--sk-foil);
      box-shadow: 0 0 0 2px #fff;
    }
  }
  .sk-cartbtn__sum {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // выпадающее меню
  .sk-mega {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    border-top: 1px solid var(--sk-line);
    background: #fff;
    box-shadow: 0 2px 6px rgba(43, 26, 25, 0.06), 0 30px 60px rgba(43, 26, 25, 0.18);
    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 100%;
      height: 14px;
    }
  }
  .sk-mega__in {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 28px;
    padding-top: 24px;
    padding-bottom: 28px;
  }
  .sk-mega__cols {
    grid-column: span 3;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2px 24px;
    align-content: start;
  }
  .sk-mega__group {
    display: grid;
    gap: 2px;
    align-content: start;
    > b {
      margin-bottom: 6px;
      font: 400 20px/1.2 var(--sk-head);
      color: var(--sk-acc);
    }
  }
  .sk-mega__link {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    padding: 7px 10px;
    margin: 0 -10px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 14.5px;
    font-weight: 600;
    small {
      color: var(--sk-muted);
      font-weight: 500;
    }
    &:hover {
      background: var(--sk-surface);
      color: var(--sk-acc);
    }
  }
  .sk-mega__promo {
    display: grid;
    gap: 10px;
    align-content: start;
    text-decoration: none;
    img {
      width: 100%;
      aspect-ratio: 860 / 360;
      object-fit: cover;
      border-radius: 14px;
    }
    span {
      display: grid;
      gap: 2px;
      font-size: 14px;
      color: var(--sk-muted);
    }
    b {
      font: 400 20px/1.2 var(--sk-head);
      color: var(--sk-ink);
    }
  }
  .sk-mega__note {
    display: flex;
    gap: 12px;
    align-self: start;
    padding: 18px;
    border-radius: 14px;
    background: var(--sk-soft);
    text-decoration: none;
    font-size: 14px;
    color: var(--sk-muted);
    .sk-icon {
      color: var(--sk-acc);
      width: 26px;
      height: 26px;
    }
    span {
      display: grid;
      gap: 4px;
    }
    b {
      color: var(--sk-ink);
      font-size: 15px;
    }
  }

  // подвал
  .sk-foot {
    position: relative;
    margin-top: 40px;
    padding-bottom: 32px;
    background: var(--sk-surface);
    font-size: 14.5px;
  }
  .sk-foot__band {
    height: 120px;
    background: url('https://www.shokoladki.ru/local/templates/main/images/distr2.jpg') center top / 213px auto repeat-x;
    opacity: 0.85;
    -webkit-mask: linear-gradient(#000 30%, transparent);
    mask: linear-gradient(#000 30%, transparent);
    background-color: #fff;
  }
  .sk-foot__sub {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    gap: 24px;
    align-items: center;
    margin-top: -60px;
    padding: 24px 28px;
    position: relative;
    border-radius: 18px;
    background: #fff;
    border: 1px solid var(--sk-line);
    > div {
      display: grid;
      gap: 4px;
      b {
        font: 400 22px/1.25 var(--sk-head);
      }
      span {
        color: var(--sk-muted);
      }
    }
  }
  .sk-foot__form {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    .sk-check {
      grid-column: 1 / -1;
    }
  }
  .sk-foot__grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr 1.2fr;
    gap: 32px;
    padding: 44px 0 28px;
  }
  .sk-foot__brand {
    display: grid;
    gap: 14px;
    align-content: start;
    img {
      width: 170px;
      height: auto;
      padding: 8px 14px;
      border-radius: 14px;
      background: #fff;
    }
    p {
      color: var(--sk-muted);
      max-width: 34ch;
    }
  }
  .sk-foot__social {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 38px;
      padding: 0 12px 0 8px;
      border-radius: 10px;
      background: #fff;
      color: #0077ff;
      font-weight: 700;
      font-size: 13.5px;
      text-decoration: none;
      span,
      & {
        white-space: nowrap;
      }
      &:hover {
        background: #e8f1ff;
      }
    }
  }
  .sk-foot__col {
    display: grid;
    gap: 8px;
    align-content: start;
    > b {
      margin-bottom: 4px;
      font: 400 19px/1.2 var(--sk-head);
    }
    a {
      color: var(--sk-ink);
      text-decoration: none;
      &:hover {
        color: var(--sk-acc);
      }
    }
    span {
      color: var(--sk-muted);
    }
  }
  .sk-foot__phone {
    font-size: 20px;
    font-weight: 800;
  }
  .sk-foot__legal {
    display: grid;
    gap: 6px;
    padding-top: 20px;
    border-top: 1px solid var(--sk-line);
    font-size: 12.5px;
    color: var(--sk-muted);
  }

  // таббар
  .sk-tabbar {
    display: none;
  }

  // меню-шторка
  .sk-drawer {
    position: fixed;
    inset: 0;
    z-index: 80;
    background: rgba(43, 26, 25, 0.45);
  }
  .sk-drawer__box {
    display: grid;
    align-content: start;
    gap: 6px;
    width: min(400px, 100%);
    height: 100%;
    padding: 12px 18px 28px;
    overflow-y: auto;
    background: #fff;
  }
  .sk-drawer__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
    b {
      font: 400 24px/1 var(--sk-head);
    }
  }
  .sk-drawer__city {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 12px;
    border: 0;
    border-radius: 10px;
    background: var(--sk-surface);
    cursor: pointer;
    text-align: left;
    .sk-icon {
      color: var(--sk-foil);
    }
  }
  .sk-drawer__set {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 48px;
    padding: 0 12px;
    border-radius: 10px;
    background: var(--sk-soft);
    color: var(--sk-acc);
    font-weight: 800;
    text-decoration: none;
  }
  .sk-drawer__grp {
    border-bottom: 1px solid var(--sk-line);
    summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 50px;
      font-weight: 800;
      font-size: 16px;
      cursor: pointer;
      list-style: none;
      &::-webkit-details-marker {
        display: none;
      }
      &::after {
        content: '+';
        font-size: 22px;
        color: var(--sk-foil);
      }
    }
    &[open] summary::after {
      content: '−';
    }
    a {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      text-decoration: none;
      small {
        color: var(--sk-muted);
      }
    }
    &[open] {
      padding-bottom: 10px;
    }
  }
  .sk-drawer__sub {
    display: block;
    margin-top: 10px;
    font-size: 13px;
    color: var(--sk-foil);
    text-transform: none;
  }
  .sk-drawer__link {
    display: flex;
    align-items: center;
    min-height: 50px;
    border-bottom: 1px solid var(--sk-line);
    font-weight: 800;
    font-size: 16px;
    text-decoration: none;
  }
  .sk-drawer__links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 12px;
    padding: 12px 0;
    a {
      padding: 6px 0;
      color: var(--sk-muted);
      text-decoration: none;
    }
  }
  .sk-drawer__foot {
    display: grid;
    gap: 8px;
  }

  // окна
  .sk-modal {
    position: fixed;
    inset: 0;
    z-index: 90;
    display: grid;
    place-items: center;
    padding: 16px;
    background: rgba(43, 26, 25, 0.5);
    overflow-y: auto;
  }
  .sk-modal__box {
    position: relative;
    display: grid;
    gap: 16px;
    width: min(520px, 100%);
    max-height: calc(100vh - 32px);
    overflow-y: auto;
    padding: 28px;
    border-radius: 20px;
    background: #fff;
  }
  .sk-modal__box--wide {
    width: min(860px, 100%);
  }
  .sk-modal__x {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .sk-modal__title {
    padding-right: 40px;
    font: 400 28px/1.15 var(--sk-head);
  }
  .sk-modal__lead {
    color: var(--sk-muted);
  }
  .sk-modal__links {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
  }
  .sk-modal__cities {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
    max-height: 340px;
    overflow-y: auto;
    button {
      display: grid;
      gap: 1px;
      padding: 9px 12px;
      border: 1px solid var(--sk-line);
      border-radius: 10px;
      background: #fff;
      text-align: left;
      cursor: pointer;
      small {
        color: var(--sk-muted);
        font-size: 12px;
      }
      &:hover {
        border-color: var(--sk-foil);
      }
      &.is-on {
        border-color: var(--sk-acc);
        background: var(--sk-soft);
      }
    }
  }
  .sk-rate {
    display: flex;
    gap: 4px;
    button {
      padding: 2px;
      border: 0;
      background: none;
      color: #e0d3cf;
      cursor: pointer;
      .sk-icon {
        width: 30px;
        height: 30px;
        fill: currentColor;
      }
      &.is-on {
        color: var(--sk-foil);
      }
    }
  }
  .sk-pack {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
    gap: 24px;
  }
  .sk-pack__preview {
    position: relative;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 10px;
    aspect-ratio: 1;
    padding: 24px;
    border-radius: 16px;
    text-align: center;
    box-shadow: inset 0 0 0 10px rgba(255, 255, 255, 0.12), inset 0 0 0 11px rgba(181, 125, 98, 0.6);
    img {
      width: 56%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 50%;
      box-shadow: 0 0 0 4px currentColor;
    }
    b {
      font: 400 clamp(26px, 3vw, 36px) / 1.1 var(--sk-head);
      word-break: break-word;
    }
    small {
      opacity: 0.75;
    }
  }
  .sk-pack__ph {
    display: grid;
    place-items: center;
    gap: 6px;
    width: 52%;
    aspect-ratio: 1;
    border: 2px dashed currentColor;
    border-radius: 50%;
    font-size: 13px;
    opacity: 0.8;
  }
  .sk-pack__side {
    display: grid;
    gap: 14px;
    align-content: start;
  }
  .sk-pack__designs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    button {
      min-height: 56px;
      padding: 6px;
      border: 2px solid transparent;
      border-radius: 10px;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      &.is-on {
        border-color: var(--sk-acc);
        box-shadow: 0 0 0 2px #fff inset;
      }
    }
  }

  .sk-toast {
    position: fixed;
    left: 50%;
    bottom: 24px;
    z-index: 95;
    display: flex;
    align-items: center;
    gap: 10px;
    width: max-content;
    max-width: calc(100% - 32px);
    padding: 12px 16px;
    border-radius: 14px;
    transform: translateX(-50%);
    background: var(--sk-ink);
    color: #fff;
    font-size: 14.5px;
    box-shadow: 0 16px 40px rgba(43, 26, 25, 0.3);
    .sk-icon {
      color: #b9d98d;
    }
    a {
      flex: none;
      color: var(--sk-foil-soft);
      font-weight: 800;
    }
  }
  .sk-cookies {
    position: fixed;
    left: 16px;
    bottom: 16px;
    z-index: 70;
    display: grid;
    gap: 10px;
    width: min(360px, calc(100% - 32px));
    padding: 16px;
    border: 1px solid var(--sk-line);
    border-radius: 16px;
    background: #fff;
    font-size: 13px;
    color: var(--sk-muted);
    box-shadow: 0 16px 40px rgba(43, 26, 25, 0.18);
    a {
      color: var(--sk-acc);
    }
    .sk-btn {
      justify-self: start;
    }
  }
  .sk-up {
    position: fixed;
    right: 20px;
    bottom: 24px;
    z-index: 60;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border: 1px solid var(--sk-line);
    border-radius: 50%;
    background: #fff;
    color: var(--sk-acc);
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(43, 26, 25, 0.14);
  }
}

// поиск — кнопкой с выезжающим полем на всех ширинах: меню оригинала из пяти пунктов занимает строку целиком
@media all {
  .sk {
    .sk-search {
      display: none;
      &.is-open {
        display: flex;
        position: absolute;
        left: 32px;
        right: 32px;
        top: calc(100% + 8px);
        z-index: 6;
        input {
          height: 52px;
          background: #fff;
          border-color: var(--sk-foil);
          box-shadow: 0 22px 54px rgba(43, 26, 25, 0.22);
        }
      }
    }
    .sk-head__in {
      position: relative;
    }
    .sk-head__find {
      display: inline-flex;
    }
  }
}
@media (max-width: 1400px) {
  .sk {
    .sk-strip__nav {
      gap: 2px 12px;
      font-size: 13px;
    }
    .sk-strip__fb span {
      display: none;
    }
    .sk-nav__item {
      padding: 0 8px;
      font-size: 14.5px;
    }
    .sk-head__in {
      gap: 12px;
    }
    .sk-head__acc,
    .sk-head__fav {
      min-width: 48px;
      small {
        display: none;
      }
      .sk-badge {
        right: 2px;
      }
    }
    .sk-cartbtn {
      width: auto;
      padding: 0 13px;
    }
    .sk-cartbtn__sum,
    .sk-nav__ext .sk-icon {
      display: none;
    }
  }
}
@media (max-width: 1199px) {
  .sk {
    .sk-wrap {
      padding-left: 24px;
      padding-right: 24px;
    }
    .sk-strip__nav {
      display: none;
    }
    .sk-strip__fb span {
      display: inline;
    }
    .sk-head__burger {
      display: inline-flex;
      margin-left: -8px;
    }
    .sk-nav {
      display: none;
    }
    .sk-search {
      display: flex;
      position: relative;
      max-width: 520px;
      margin: 0 auto;
      &.is-open {
        position: relative;
        left: auto;
        right: auto;
        top: auto;
        input {
          height: 44px;
          box-shadow: none;
        }
      }
    }
    .sk-head__find {
      display: none;
    }
    .sk-head__icons {
      margin-left: 0;
    }
    .sk-mega {
      display: none;
    }
    .sk-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .sk-foot__grid {
      grid-template-columns: 1fr 1fr;
    }
  }
}
@media (max-width: 989px) {
  .sk {
    .sk-foot__sub {
      grid-template-columns: minmax(0, 1fr);
    }
    .sk-pack {
      grid-template-columns: minmax(0, 1fr);
    }
    .sk-pack__preview {
      max-width: 320px;
      width: 100%;
      justify-self: center;
    }
  }
}
@media (max-width: 768px) {
  .sk {
    --sk-headh: 64px;
    .sk-wrap {
      padding-left: 16px;
      padding-right: 16px;
    }
    .sk-main {
      padding-bottom: 48px;
    }
    .sk-strip__in {
      gap: 12px;
      min-height: 38px;
      justify-content: space-between;
    }
    .sk-strip__right {
      gap: 12px;
      margin-left: 0;
    }
    .sk-strip__fb {
      display: none;
    }
    .sk-logo img {
      height: 46px;
    }
    .sk-search {
      display: none;
      &.is-open {
        display: flex;
        position: absolute;
        left: 16px;
        right: 16px;
        top: calc(100% + 8px);
        max-width: none;
        input {
          height: 50px;
          box-shadow: 0 22px 54px rgba(43, 26, 25, 0.22);
        }
      }
    }
    .sk-search__drop {
      min-width: 0;
    }
    .sk-head__find {
      display: inline-flex;
    }
    .sk-head__icons {
      margin-left: auto;
    }
    .sk-head__fav,
    .sk-cartbtn {
      display: none;
    }
    .sk-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    .sk-section {
      padding-top: 40px;
    }
    .sk-form--two {
      grid-template-columns: minmax(0, 1fr);
    }
    .sk-tabbar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 50;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1.3fr;
      padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
      border-top: 1px solid var(--sk-line);
      background: #fff;
      a {
        position: relative;
        display: grid;
        justify-items: center;
        gap: 2px;
        padding: 4px 2px;
        border-radius: 10px;
        color: var(--sk-muted);
        font-size: 11.5px;
        font-weight: 700;
        text-decoration: none;
        .sk-icon {
          width: 23px;
          height: 23px;
        }
        span {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sk-badge {
          top: 0;
          right: calc(50% - 22px);
        }
        &.is-on {
          color: var(--sk-acc);
        }
      }
    }
    .sk-tabbar__cart {
      background: var(--sk-acc);
      color: #fff !important;
      font-variant-numeric: tabular-nums;
      .sk-badge {
        background: var(--sk-foil);
      }
    }
    .sk-foot {
      padding-bottom: 96px;
    }
    .sk-foot__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
    .sk-foot__sub {
      padding: 20px;
    }
    .sk-toast {
      bottom: 84px;
    }
    .sk-cookies {
      bottom: 80px;
    }
    .sk-up {
      display: none;
    }
    .sk-concept {
      padding: 6px 12px;
      font-size: 12px;
      line-height: 1.35;
    }
    .sk-modal__box {
      padding: 24px 18px;
    }
  }
}
@media (max-width: 576px) {
  .sk {
    .sk-strip__city span {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sk-foot__form {
      grid-template-columns: minmax(0, 1fr);
    }
    .sk-modal__cities {
      grid-template-columns: minmax(0, 1fr);
    }
    .sk-ship__opt {
      grid-template-columns: auto minmax(0, 1fr);
      em {
        grid-column: 2;
      }
    }
    .sk-pack__designs {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
@media (max-width: 375px) {
  .sk {
    .sk-strip__phone span {
      font-size: 13.5px;
    }
    .sk-logo img {
      height: 40px;
    }
    .sk-iconbtn {
      min-width: 40px;
    }
  }
}

// --- [...all].vue
.sk .sk-404 {
  display: grid;
  justify-items: center;
  gap: 16px;
  padding-top: 64px;
  text-align: center;
  p {
    color: var(--sk-muted);
  }
  .sk-chips {
    justify-content: center;
    max-width: 760px;
  }
}
.sk .sk-404__code {
  font: 400 140px/1 var(--sk-head);
  color: var(--sk-foil-soft);
}

// --- blog/[id].vue
.sk .sk-article__in {
  display: grid;
  gap: 16px;
  max-width: 820px;
}
.sk .sk-article__meta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--sk-muted);
  .sk-icon {
    width: 16px;
    height: 16px;
  }
}
.sk .sk-article__img {
  width: 100%;
  aspect-ratio: 372 / 200;
  object-fit: cover;
  border-radius: 20px;
}
.sk .sk-article__lead {
  font-size: 18px;
  font-weight: 600;
}
.sk .sk-article__li {
  padding-left: 18px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 0.7em;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--sk-foil);
  }
}
.sk .sk-article .sk-text a {
  color: var(--sk-acc);
}

// --- blog/index.vue
.sk .sk-bloglist {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px 20px;
}
.sk .sk-post__lead {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--sk-muted);
  font-size: 14.5px;
}
.sk .sk-blog__more {
  justify-self: center;
}
@media (max-width: 989px) {
  .sk .sk-bloglist {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 576px) {
  .sk .sk-bloglist {
    grid-template-columns: minmax(0, 1fr);
  }
}

// --- butiki.vue
.sk .sk-shoplist {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.sk .sk-shopcard {
  display: grid;
  grid-template-rows: auto 1fr;
  border: 1px solid var(--sk-line);
  border-radius: 20px;
  overflow: hidden;
  scroll-margin-top: 100px;
}
.sk .sk-shopcard__img {
  position: relative;
  aspect-ratio: 16 / 10;
  padding: 0;
  border: 0;
  background: var(--sk-surface);
  cursor: zoom-in;
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.sk .sk-shopcard__body {
  display: grid;
  gap: 8px;
  align-content: start;
  justify-items: start;
  padding: 20px 22px;
  small {
    color: var(--sk-foil);
    font-weight: 700;
    font-size: 13px;
  }
  h2 {
    font: 400 22px/1.2 var(--sk-head);
  }
  p {
    display: flex;
    gap: 8px;
    font-size: 14.5px;
    color: var(--sk-muted);
    .sk-icon {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      color: var(--sk-foil);
    }
    a {
      color: var(--sk-ink);
      font-weight: 700;
      text-decoration: none;
    }
  }
}
.sk .sk-shopcard__near {
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--sk-green-soft);
  color: var(--sk-green);
  font-weight: 800;
  font-size: 12.5px;
}
.sk .sk-shopbig {
  width: 100%;
  border-radius: 14px;
}
@media (max-width: 1199px) {
  .sk .sk-shoplist {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 768px) {
  .sk .sk-shoplist {
    grid-template-columns: minmax(0, 1fr);
  }
}

// --- dostavka.vue
.sk .sk-page__h {
  margin-bottom: 16px;
}
.sk .sk-page__text {
  margin-top: 18px;
}
.sk .sk-calc {
  display: grid;
  gap: 14px;
  padding: 24px;
  border-radius: 20px;
  background: var(--sk-soft);
  max-width: 760px;
}
.sk .sk-calc__row {
  display: flex;
  align-items: center;
  gap: 14px;
  > span {
    width: 120px;
    color: var(--sk-muted);
  }
  input {
    flex: 1;
    accent-color: var(--sk-acc);
  }
  b {
    width: 90px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
}
.sk .sk-calc__res {
  font-size: 17px;
  b {
    color: var(--sk-acc);
  }
  small {
    color: var(--sk-muted);
  }
}
.sk .sk-zones {
  display: grid;
  border: 1px solid var(--sk-line);
  border-radius: 18px;
  overflow: hidden;
}
.sk .sk-zone {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.4fr) minmax(0, 0.8fr);
  gap: 16px;
  padding: 16px 20px;
  &:nth-child(odd) {
    background: var(--sk-surface);
  }
  span {
    font-weight: 600;
  }
  small {
    color: var(--sk-muted);
    font-size: 14px;
  }
}
.sk .sk-paylist {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  .sk-panel {
    display: grid;
    gap: 8px;
    align-content: start;
    .sk-icon {
      width: 28px;
      height: 28px;
      color: var(--sk-foil);
    }
    b {
      font-size: 16px;
    }
    p {
      color: var(--sk-muted);
      font-size: 14.5px;
    }
    &.is-off {
      opacity: 0.6;
    }
  }
}
.sk .sk-page > .sk-muted a {
  color: var(--sk-acc);
}
@media (max-width: 1199px) {
  .sk .sk-paylist {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 768px) {
  .sk .sk-zone {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
  .sk .sk-paylist {
    grid-template-columns: minmax(0, 1fr);
  }
  .sk .sk-calc__row {
    flex-wrap: wrap;
    > span {
      width: 100%;
    }
  }
}

// --- faq.vue
.sk .sk-pagehead a {
  color: var(--sk-acc);
}
.sk .sk-faq__search {
  position: relative;
  display: block;
  max-width: 520px;
  .sk-icon {
    position: absolute;
    left: 14px;
    top: 13px;
    color: var(--sk-muted);
  }
  .sk-input {
    padding-left: 44px;
  }
}
.sk .sk-faq {
  display: grid;
  gap: 8px;
  max-width: 900px;
}
.sk .sk-faq__item {
  border-radius: 14px;
  background: var(--sk-surface);
  summary {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 20px;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    list-style: none;
    &::-webkit-details-marker {
      display: none;
    }
    &::after {
      content: '+';
      flex: none;
      color: var(--sk-foil);
      font-size: 22px;
      line-height: 1;
    }
  }
  &[open] summary::after {
    content: '−';
  }
  .sk-text {
    padding: 0 20px 18px;
    font-size: 15px;
  }
}

// --- index.vue
.sk .sk-home__hero {
  padding-top: 28px;
}
.sk .sk-ny {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  gap: 32px;
  align-items: center;
  margin-bottom: 24px;
}
.sk .sk-ny__banner img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 860 / 360;
  object-fit: cover;
  border-radius: 20px;
}
.sk .sk-ny__text {
  display: grid;
  gap: 12px;
  justify-items: start;
  p {
    color: var(--sk-muted);
    font-size: 16px;
  }
}
.sk .sk-ny__days {
  display: inline-flex;
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--sk-soft);
  color: var(--sk-acc);
  font-weight: 800;
  font-size: 13.5px;
}
.sk .sk-ny__links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.sk .sk-shelf {
  position: relative;
}
.sk .sk-shelf__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - 4 * 20px) / 4.3);
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-snap-type: x mandatory;
  > * {
    scroll-snap-align: start;
  }
}
.sk .sk-shelf__arrow {
  position: absolute;
  top: calc(50% - 40px);
  z-index: 2;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1px solid var(--sk-line);
  border-radius: 50%;
  background: #fff;
  color: var(--sk-acc);
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(43, 26, 25, 0.14);
  &:hover {
    border-color: var(--sk-acc);
  }
}
.sk .sk-shelf__arrow--l {
  left: -18px;
}
.sk .sk-shelf__arrow--r {
  right: -18px;
}
.sk .sk-tiles {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}
.sk .sk-tile {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 4px;
  height: 100%;
  padding: 10px 10px 16px;
  border-radius: 18px;
  background: var(--sk-surface);
  text-decoration: none;
  b {
    padding: 8px 6px 0;
    font-size: 16px;
    line-height: 1.3;
  }
  small {
    padding: 0 6px;
    color: var(--sk-muted);
  }
  &:hover b {
    color: var(--sk-acc);
  }
  &:hover img {
    transform: scale(1.04);
  }
}
.sk .sk-tile__img {
  position: relative;
  aspect-ratio: 5 / 4;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
  }
}
.sk .sk-gifts {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 2fr);
  gap: 32px;
  padding: 32px;
  border-radius: 24px;
  border: 1px solid var(--sk-line);
}
.sk .sk-gifts__head {
  display: grid;
  gap: 10px;
  align-content: start;
  p {
    color: var(--sk-muted);
  }
}
.sk .sk-gifts__groups {
  display: grid;
  gap: 18px;
}
.sk .sk-gifts__group {
  display: grid;
  gap: 8px;
  > b {
    font-size: 14px;
    color: var(--sk-foil);
  }
}
.sk .sk-home__duo {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 24px;
}
.sk ul.sk-facts {
  display: grid;
  gap: 20px;
  align-content: center;
  padding: 28px;
  border-radius: 24px;
  background: var(--sk-surface);
  li {
    display: flex;
    gap: 16px;
  }
  .sk-icon {
    width: 30px;
    height: 30px;
    color: var(--sk-foil);
  }
  span {
    display: grid;
    gap: 3px;
    color: var(--sk-muted);
  }
  b {
    color: var(--sk-ink);
    font-size: 16px;
  }
}
.sk .sk-bonus {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 28px;
  align-items: center;
  padding: 28px;
  border-radius: 24px;
  border: 1px solid var(--sk-line);
}
.sk .sk-bonus__card {
  display: grid;
  align-content: space-between;
  aspect-ratio: 1.58;
  padding: 16px;
  border-radius: 14px;
  background: var(--sk-acc) url('https://www.shokoladki.ru/local/templates/main/images/distr2.jpg') center / 140px auto;
  background-blend-mode: soft-light;
  color: #fff;
  box-shadow: 0 16px 30px rgba(100, 51, 53, 0.3);
  transform: rotate(-4deg);
  img {
    width: 34px;
    height: 34px;
  }
  b {
    font: 400 30px/1 var(--sk-head);
  }
  span {
    font-size: 12px;
    opacity: 0.85;
  }
}
.sk .sk-bonus__form {
  display: grid;
  gap: 12px;
  p {
    color: var(--sk-muted);
  }
}
.sk .sk-bonus__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  .sk-check {
    grid-column: 1 / -1;
  }
}
.sk .sk-bonus__note {
  font-size: 13px;
}
.sk .sk-reviews {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.sk .sk-review {
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  align-content: start;
  gap: 12px;
  padding: 24px;
  border-radius: 20px;
  background: var(--sk-surface);
  p {
    font-size: 15.5px;
  }
}
.sk .sk-review__by {
  display: flex;
  gap: 10px;
  align-items: baseline;
  span {
    color: var(--sk-muted);
    font-size: 13.5px;
  }
}
.sk .sk-review__item {
  font-size: 13.5px;
  color: var(--sk-acc);
  font-weight: 700;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
.sk .sk-corp {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 32px;
  align-items: end;
  padding: 32px;
  border-radius: 24px;
  background: var(--sk-soft);
}
.sk .sk-corp__text {
  display: grid;
  gap: 12px;
  align-self: center;
  p {
    color: var(--sk-muted);
    font-size: 16px;
  }
}
.sk .sk-corp__links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}
.sk ol.sk-corp__scale {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: end;
  gap: 10px;
  height: 220px;
  li {
    display: grid;
    align-content: start;
    gap: 2px;
    height: var(--h);
    padding: 12px 10px;
    border-radius: 14px 14px 6px 6px;
    background: #fff;
    border-top: 3px solid var(--sk-foil);
    text-align: center;
    &:last-child {
      background: var(--sk-acc);
      border-top-color: var(--sk-acc);
      color: #fff;
      span {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  b {
    font: 400 26px/1.1 var(--sk-head);
  }
  span {
    font-size: 12.5px;
    color: var(--sk-muted);
  }
}
.sk .sk-shops {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.sk .sk-shop {
  display: grid;
  grid-template-rows: auto 1fr;
  border-radius: 20px;
  border: 1px solid var(--sk-line);
  overflow: hidden;
  text-decoration: none;
  img {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
  }
  span {
    display: grid;
    gap: 4px;
    align-content: start;
    padding: 16px 18px 18px;
  }
  b {
    font-size: 16px;
  }
  small {
    color: var(--sk-muted);
    font-size: 13.5px;
  }
  &:hover b {
    color: var(--sk-acc);
  }
}
.sk .sk-posts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.sk .sk-post {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 8px;
  text-decoration: none;
  img {
    width: 100%;
    height: auto;
    aspect-ratio: 372 / 200;
    object-fit: cover;
    border-radius: 16px;
  }
  small {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--sk-muted);
    font-size: 13px;
    .sk-icon {
      width: 15px;
      height: 15px;
      margin-left: 4px;
    }
  }
  b {
    font-size: 16.5px;
    line-height: 1.35;
  }
  &:hover b {
    color: var(--sk-acc);
  }
}
@media (max-width: 1199px) {
  .sk .sk-shelf__track {
    grid-auto-columns: calc((100% - 2 * 20px) / 3.2);
  }
  .sk .sk-shelf__arrow {
    display: none;
  }
  .sk .sk-home__duo {
    grid-template-columns: minmax(0, 1fr);
  }
  .sk .sk-corp {
    grid-template-columns: minmax(0, 1fr);
  }
  .sk .sk-gifts {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
}
@media (max-width: 989px) {
  .sk .sk-ny {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
  .sk .sk-tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .sk .sk-reviews,
  .sk .sk-shops,
  .sk .sk-posts {
    grid-template-columns: minmax(0, 1fr);
  }
  .sk .sk-shop {
    grid-template-columns: 200px minmax(0, 1fr);
    grid-template-rows: none;
    img {
      height: 100%;
      aspect-ratio: auto;
    }
  }
  .sk .sk-posts .sk-post {
    grid-template-columns: 200px minmax(0, 1fr);
    grid-template-rows: auto 1fr;
    column-gap: 16px;
    img {
      grid-row: 1 / 3;
    }
    small {
      align-self: end;
    }
  }
}
@media (max-width: 768px) {
  .sk .sk-home__hero {
    padding-top: 16px;
  }
  .sk .sk-shelf__track {
    grid-auto-columns: calc((100% - 12px) / 2.15);
    gap: 12px;
  }
  .sk .sk-tiles {
    gap: 12px;
  }
  .sk .sk-sechead {
    flex-wrap: wrap;
    align-items: baseline;
    margin-bottom: 16px;
  }
  .sk .sk-bonus {
    grid-template-columns: minmax(0, 1fr);
    padding: 22px;
  }
  .sk .sk-bonus__card {
    width: 190px;
    justify-self: center;
  }
  .sk .sk-gifts,
  .sk .sk-corp,
  .sk ul.sk-facts {
    padding: 22px;
  }
  .sk ol.sk-corp__scale {
    height: 190px;
    gap: 6px;
    li {
      padding: 10px 4px;
    }
    b {
      font-size: 20px;
    }
    span {
      font-size: 11px;
    }
  }
}
@media (max-width: 576px) {
  .sk .sk-tile b {
    font-size: 14.5px;
  }
  .sk .sk-shop {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto 1fr;
    img {
      height: auto;
      aspect-ratio: 16 / 10;
    }
  }
  .sk .sk-posts .sk-post {
    grid-template-columns: 120px minmax(0, 1fr);
    b {
      font-size: 15px;
    }
  }
  .sk .sk-bonus__row {
    grid-template-columns: minmax(0, 1fr);
  }
}

// --- izbrannoe.vue
.sk .sk-fav__head {
  display: grid;
  gap: 16px;
  margin-bottom: 20px;
}
.sk .sk-fav__new {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 640px;
  .sk-input {
    flex: 1 1 260px;
  }
}
.sk .sk-fav__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 20px;
  margin-bottom: 20px;
}
.sk .sk-fav__item {
  display: grid;
  gap: 8px;
}
.sk .sk-fav__move {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--sk-muted);
  select {
    min-height: 38px;
    padding: 6px 36px 6px 10px;
    font-size: 13.5px;
  }
}

// --- kabinet.vue
.sk .sk-cab {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  .sk-panel {
    display: grid;
    gap: 6px;
    align-content: start;
    justify-items: start;
  }
  b {
    font: 400 21px/1.2 var(--sk-head);
  }
  span {
    color: var(--sk-muted);
    overflow-wrap: anywhere;
  }
}
.sk .sk-cab__pass {
  max-width: 520px;
}
@media (max-width: 1199px) {
  .sk .sk-cab {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 576px) {
  .sk .sk-cab {
    grid-template-columns: minmax(0, 1fr);
  }
}

// --- katalog/[[razdel]].vue
.sk .sk-cat__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px 20px;
  margin-bottom: 18px;
}
.sk .sk-cat__group {
  display: block;
  margin-bottom: 6px;
  color: var(--sk-foil);
  font-weight: 700;
  font-size: 13.5px;
}
.sk .sk-cat__count {
  color: var(--sk-muted);
}
.sk .sk-cat__secs {
  margin-bottom: 24px;
}
.sk .sk-cat__body {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}
.sk .sk-filters {
  display: grid;
  gap: 18px;
  padding: 20px;
  border-radius: 18px;
  background: var(--sk-surface);
  scrollbar-width: thin;
}
.sk .sk-filters__top {
  display: none;
}
.sk .sk-filters__group {
  display: grid;
  gap: 8px;
  > b {
    font-size: 14.5px;
  }
}
.sk .sk-filters__price {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  .sk-input {
    min-height: 42px;
    padding: 8px 10px;
  }
}
.sk .sk-check--line span {
  font-weight: 500;
  font-size: 14.5px;
}
.sk .sk-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-weight: 700;
  font-size: 14.5px;
  cursor: pointer;
  input {
    appearance: none;
    flex: none;
    position: relative;
    width: 42px;
    height: 24px;
    margin: 0;
    border-radius: 12px;
    background: #d9cbc6;
    cursor: pointer;
    transition: background 0.2s;
    order: 2;
    &::after {
      content: '';
      position: absolute;
      left: 3px;
      top: 3px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.2s;
    }
    &:checked {
      background: var(--sk-acc);
      &::after {
        transform: translateX(18px);
      }
    }
  }
}
.sk .sk-filters__foot {
  display: none;
}
.sk .sk-cat__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-bottom: 18px;
}
.sk .sk-cat__fbtn {
  display: none;
  position: relative;
}
.sk .sk-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--sk-acc);
}
.sk .sk-cat__sort {
  display: flex;
  align-items: center;
  gap: 10px;
  span {
    color: var(--sk-muted);
    font-size: 14px;
  }
  select {
    width: 230px;
    min-height: 42px;
  }
}
.sk .sk-cat__per {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  color: var(--sk-muted);
  font-size: 14px;
  span {
    margin-right: 4px;
  }
  button {
    min-width: 40px;
    height: 36px;
    border: 0;
    border-radius: 8px;
    background: none;
    font-weight: 700;
    cursor: pointer;
    &.is-on {
      background: var(--sk-soft);
      color: var(--sk-acc);
    }
  }
}
.sk .sk-cat__grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.sk .sk-cat__pager {
  display: grid;
  justify-items: center;
  gap: 16px;
  margin-top: 28px;
}
.sk .sk-pages {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  button {
    min-width: 42px;
    height: 42px;
    border: 1px solid var(--sk-line);
    border-radius: 10px;
    background: #fff;
    font-weight: 700;
    cursor: pointer;
    &.is-on {
      border-color: var(--sk-acc);
      background: var(--sk-acc);
      color: #fff;
    }
  }
}
.sk .sk-cat__note {
  margin-top: 24px;
  font-size: 13px;
  color: var(--sk-muted);
}
@media (min-width: 1521px) {
  .sk .sk-cat__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@media (max-width: 1199px) {
  .sk .sk-cat__body {
    grid-template-columns: minmax(0, 1fr);
  }
  .sk .sk-filters {
    display: none;
    &.is-open {
      position: fixed;
      inset: 0;
      z-index: 85;
      display: grid;
      align-content: start;
      max-height: none;
      border-radius: 0;
      background: #fff;
      padding: 16px 20px 110px;
    }
  }
  .sk .sk-filters__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    b {
      font: 400 24px/1 var(--sk-head);
    }
  }
  .sk .sk-filters__foot {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1px solid var(--sk-line);
  }
  .sk .sk-cat__fbtn {
    display: inline-flex;
  }
}
@media (max-width: 768px) {
  .sk .sk-cat__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .sk .sk-cat__per {
    display: none;
  }
  .sk .sk-cat__bar {
    flex-wrap: nowrap;
    gap: 10px;
  }
  .sk .sk-cat__sort {
    flex: 1;
    min-width: 0;
    span {
      display: none;
    }
    select {
      width: 100%;
    }
  }
}

// --- kontakty.vue
.sk .sk-contacts {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}
.sk .sk-contacts__cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.sk .sk-contact {
  display: flex;
  gap: 12px;
  padding: 18px;
  text-decoration: none;
  .sk-icon {
    color: var(--sk-foil);
  }
  span {
    display: grid;
    gap: 2px;
    min-width: 0;
  }
  small,
  em {
    font-size: 13px;
    color: var(--sk-muted);
    font-style: normal;
  }
  b {
    overflow-wrap: anywhere;
  }
}
a.sk-contact:hover b {
  color: var(--sk-acc);
}
.sk .sk-req .sk-facts-list {
  background: none;
  padding: 0;
}
@media (max-width: 1199px) {
  .sk .sk-contacts {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 576px) {
  .sk .sk-contacts__cards {
    grid-template-columns: minmax(0, 1fr);
  }
  .sk .sk-req .sk-facts-list {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
    dd {
      margin-bottom: 8px;
    }
  }
}

// --- korporativnym.vue
.sk .sk-corpcalc {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 32px;
  align-items: end;
  padding: 32px;
  border-radius: 24px;
  background: var(--sk-soft);
  .sk-corp__scale li.is-on {
    outline: 2px solid var(--sk-acc);
    outline-offset: 2px;
  }
}
.sk .sk-corpcalc__in {
  display: grid;
  gap: 18px;
  input[type='range'] {
    width: 100%;
    accent-color: var(--sk-acc);
  }
}
.sk .sk-corpcalc__res {
  display: grid;
  gap: 4px;
  b {
    font: 400 40px/1.1 var(--sk-head);
  }
  span {
    font-weight: 700;
    color: var(--sk-acc);
  }
  small {
    color: var(--sk-muted);
  }
}
.sk .sk-corpdirs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}
.sk .sk-corpcta {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 20px;
  align-items: stretch;
}
.sk .sk-corpcta__pdf {
  display: grid;
  gap: 12px;
  justify-items: start;
  > .sk-icon {
    width: 36px;
    height: 36px;
    color: var(--sk-foil);
  }
  > b {
    font: 400 22px/1.25 var(--sk-head);
  }
  a:not(.sk-btn):not(.sk-link) {
    color: var(--sk-acc);
  }
}
@media (max-width: 1199px) {
  .sk .sk-corpcalc,
  .sk .sk-corpcta {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 768px) {
  .sk .sk-corpcalc {
    padding: 22px;
  }
  .sk .sk-corpdirs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}

// --- korzina.vue
.sk .sk-cart__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 16px;
  margin-bottom: 24px;
}
.sk .sk-cart__clear {
  margin-left: auto;
}
.sk .sk-cart__done {
  .sk-icon {
    width: 44px;
    height: 44px;
    color: var(--sk-green);
  }
}
.sk .sk-cart__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 32px;
  align-items: start;
}
.sk .sk-cart__main {
  display: grid;
  gap: 20px;
}
.sk .sk-cart__notice {
  padding: 12px 16px;
  border-radius: 12px;
  background: #fff6e8;
  color: #7a4d12;
  font-size: 14px;
}
.sk ul.sk-lines {
  display: grid;
  border-top: 1px solid var(--sk-line);
}
.sk .sk-line {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr) auto 120px 44px;
  align-items: start;
  gap: 18px;
  padding: 18px 0;
  border-bottom: 1px solid var(--sk-line);
  > .sk-qty,
  > .sk-line__sum,
  > .sk-line__x {
    min-height: 42px;
    align-self: start;
  }
}
.sk .sk-line__img {
  position: relative;
  display: block;
  aspect-ratio: 5 / 4;
  border: 1px solid var(--sk-line);
  border-radius: 12px;
  overflow: hidden;
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.sk .sk-line__img--set {
  background: var(--sk-acc);
  img {
    inset: 14%;
    width: 72%;
    height: 72%;
    border-radius: 50%;
  }
}
.sk .sk-line__name {
  display: grid;
  gap: 5px;
  justify-items: start;
  a {
    font-weight: 700;
    text-decoration: none;
    &:hover {
      color: var(--sk-acc);
    }
  }
  small {
    color: var(--sk-muted);
    font-size: 13px;
  }
}
.sk .sk-line__extra {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  .sk-icon {
    width: 16px;
    height: 16px;
    color: var(--sk-foil);
  }
}
.sk .sk-line__fav {
  font-size: 13px;
}
.sk .sk-line__sum {
  display: grid;
  align-content: center;
  justify-items: end;
  b {
    font-size: 17px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  small {
    color: var(--sk-muted);
    font-size: 12.5px;
    white-space: nowrap;
  }
}
.sk .sk-cart__h {
  font: 400 24px/1.2 var(--sk-head);
  margin-bottom: 14px;
}
.sk .sk-cart__ship {
  display: grid;
  gap: 12px;
  .sk-cart__h {
    margin-bottom: 0;
  }
}
.sk .sk-cart__opts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.sk .sk-cart__small {
  font-size: 13px;
}
.sk .sk-pay {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 0;
  padding: 0;
  border: 0;
  legend {
    margin-bottom: 8px;
    font-weight: 700;
    font-size: 13.5px;
  }
  .is-off {
    opacity: 0.55;
    cursor: default;
  }
}
.sk .sk-total {
  position: sticky;
  top: calc(var(--sk-headh) + 16px);
  display: grid;
  gap: 14px;
  padding: 24px;
  border-radius: 20px;
  background: var(--sk-surface);
  a {
    color: var(--sk-acc);
  }
  > .sk-link {
    justify-self: center;
  }
}
.sk .sk-total__rows {
  display: grid;
  gap: 8px;
  div {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  span {
    color: var(--sk-muted);
  }
  b {
    white-space: nowrap;
  }
}
.sk .sk-total__off {
  color: var(--sk-red);
}
.sk .sk-total__sum {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 12px;
  border-top: 1px solid #e3d7d2;
  span {
    font-weight: 700;
  }
  b {
    font-size: 28px;
    font-weight: 800;
    color: var(--sk-acc);
    font-variant-numeric: tabular-nums;
  }
}
.sk .sk-total__promo {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  input {
    width: 0;
    min-width: 100%;
  }
}
@media (max-width: 1199px) {
  .sk .sk-cart__body {
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 24px;
  }
  .sk .sk-line {
    grid-template-columns: 90px minmax(0, 1fr) auto 44px;
    grid-template-areas: 'img name name x' 'img qty sum sum';
    row-gap: 10px;
    > .sk-line__img {
      grid-area: img;
    }
    > .sk-line__name {
      grid-area: name;
    }
    > .sk-qty {
      grid-area: qty;
      justify-self: start;
    }
    > .sk-line__sum {
      grid-area: sum;
    }
    > .sk-line__x {
      grid-area: x;
    }
  }
  .sk .sk-cart__opts,
  .sk .sk-pay {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 989px) {
  .sk .sk-cart__body {
    grid-template-columns: minmax(0, 1fr);
  }
  .sk .sk-total {
    position: static;
  }
}
@media (max-width: 576px) {
  .sk .sk-line {
    grid-template-columns: 72px minmax(0, 1fr) auto 40px;
    gap: 10px 12px;
  }
  .sk .sk-cart__clear {
    margin-left: 0;
  }
  .sk .sk-box,
  .sk .sk-total {
    padding: 18px;
  }
}

// --- loyalnost.vue
.sk .sk-loyal {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  .sk-panel {
    display: grid;
    gap: 4px;
  }
  b {
    font: 400 34px/1.1 var(--sk-head);
    color: var(--sk-acc);
  }
  span {
    color: var(--sk-muted);
  }
}
.sk .sk-loyal__form {
  display: grid;
  gap: 14px;
  max-width: 640px;
}
@media (max-width: 768px) {
  .sk .sk-loyal {
    grid-template-columns: minmax(0, 1fr);
  }
}

// --- nabor.vue
.sk .sk-set__info {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 40px;
  .sk-panel {
    display: grid;
    gap: 6px;
    align-content: start;
  }
  b {
    font: 400 21px/1.2 var(--sk-head);
  }
  p {
    color: var(--sk-muted);
  }
}
@media (max-width: 989px) {
  .sk .sk-set__info {
    grid-template-columns: minmax(0, 1fr);
  }
}

// --- o-kompanii.vue
.sk .sk-about {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 48px;
  align-items: start;
}
.sk .sk-about__side {
  position: sticky;
  top: calc(var(--sk-headh) + 16px);
  display: grid;
  gap: 10px;
}
.sk ul.sk-about__facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 6px;
  li {
    display: grid;
    gap: 2px;
    padding: 16px;
    border-radius: 16px;
    background: var(--sk-surface);
  }
  b {
    font: 400 26px/1.1 var(--sk-head);
    color: var(--sk-acc);
  }
  span {
    font-size: 13px;
    color: var(--sk-muted);
  }
}
@media (max-width: 989px) {
  .sk .sk-about {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
  .sk .sk-about__side {
    position: static;
  }
}

// --- otzyvy.vue
.sk .sk-rhead {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}
.sk .sk-rlist {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.sk .sk-rpages {
  justify-content: center;
}
@media (max-width: 1199px) {
  .sk .sk-rlist {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 768px) {
  .sk .sk-rlist {
    grid-template-columns: minmax(0, 1fr);
  }
}

// --- politika.vue
.sk .sk-text a {
  color: var(--sk-acc);
}

// --- tovar/[id].vue
.sk .sk-item__top {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}
.sk .sk-gal {
  position: sticky;
  top: calc(var(--sk-headh) + 16px);
  display: grid;
  gap: 12px;
}
.sk .sk-gal__main {
  position: relative;
  aspect-ratio: 5 / 4;
  border: 1px solid var(--sk-line);
  border-radius: 22px;
  overflow: hidden;
  background: #fff;
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.sk .sk-gal__tag {
  position: absolute;
  left: 16px;
  top: 16px;
}
.sk .sk-gal__thumbs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  button {
    position: relative;
    flex: none;
    width: 96px;
    aspect-ratio: 5 / 4;
    padding: 0;
    border: 1px solid var(--sk-line);
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    cursor: pointer;
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &.is-on {
      border-color: var(--sk-acc);
      box-shadow: inset 0 0 0 1px var(--sk-acc);
    }
  }
}
.sk .sk-item__info {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
}
.sk .sk-item__title {
  font: 400 clamp(26px, 2.6vw, 38px) / 1.15 var(--sk-head);
}
.sk .sk-item__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 20px;
  font-size: 14px;
  .sk-link.is-on .sk-icon {
    fill: currentColor;
  }
}
.sk .sk-item__rev {
  text-decoration: none;
}
.sk .sk-buy {
  display: grid;
  gap: 16px;
  padding: 22px;
  border-radius: 20px;
  background: var(--sk-surface);
}
.sk .sk-buy__price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 14px;
  b {
    font-size: 34px;
    font-weight: 800;
    color: var(--sk-acc);
    font-variant-numeric: tabular-nums;
  }
  s {
    color: var(--sk-muted);
    font-size: 17px;
  }
}
.sk .sk-buy__stock {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  color: var(--sk-green);
  font-weight: 700;
  font-size: 14px;
  .sk-icon {
    width: 18px;
    height: 18px;
  }
}
.sk .sk-buy__extras {
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 14px;
  background: #fff;
  > b {
    font-size: 14.5px;
  }
}
.sk .sk-buy__card {
  display: grid;
  gap: 8px;
  img {
    width: 180px;
    border-radius: 10px;
    border: 1px solid var(--sk-line);
  }
  .sk-link {
    justify-self: start;
  }
}
.sk .sk-buy__row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  .sk-qty {
    flex: none;
    min-height: 52px;
    background: #fff;
    button {
      background: var(--sk-surface);
    }
  }
}
.sk .sk-buy__main {
  flex: 1 1 220px;
  min-width: 0;
}
.sk .sk-buy__row--two > * {
  flex: 1;
}
.sk .sk-buy__set {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff;
  border: 1px dashed var(--sk-foil);
  text-decoration: none;
  color: var(--sk-muted);
  font-size: 14px;
  .sk-icon {
    width: 28px;
    height: 28px;
    color: var(--sk-acc);
  }
  span {
    display: grid;
  }
  b {
    color: var(--sk-ink);
  }
}
.sk .sk-ship {
  display: grid;
  gap: 10px;
  padding: 20px 22px;
  border: 1px solid var(--sk-line);
  border-radius: 20px;
}
.sk .sk-ship__city {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--sk-muted);
  font-size: 14.5px;
  .sk-link {
    font-size: 15px;
  }
}
.sk .sk-ship__opt {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--sk-line);
  border-radius: 12px;
  cursor: pointer;
  input {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: var(--sk-acc);
  }
  span {
    display: grid;
  }
  small {
    color: var(--sk-muted);
    font-size: 13px;
  }
  em {
    font-style: normal;
    font-weight: 800;
    white-space: nowrap;
  }
  &.is-on {
    border-color: var(--sk-acc);
    background: var(--sk-soft);
  }
}
.sk .sk-ship__free {
  font-size: 13.5px;
  color: var(--sk-green);
  font-weight: 700;
}
.sk .sk-ship__links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 18px;
}
.sk .sk-love {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14.5px;
  color: var(--sk-muted);
  .sk-icon {
    color: var(--sk-red);
    fill: currentColor;
  }
  b {
    color: var(--sk-ink);
  }
}
.sk .sk-share {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
  font-size: 14px;
  color: var(--sk-muted);
  a {
    color: var(--sk-acc);
    font-weight: 700;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
.sk .sk-item__more {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 40px;
  margin-top: 56px;
  align-items: start;
}
.sk .sk-item__desc {
  display: grid;
  gap: 16px;
}
.sk .sk-facts-list {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 8px 24px;
  margin: 0;
  padding: 18px 20px;
  border-radius: 16px;
  background: var(--sk-surface);
  dt {
    color: var(--sk-muted);
  }
  dd {
    margin: 0;
    font-weight: 700;
  }
}
.sk .sk-item__reviews .sk-h2 small {
  color: var(--sk-muted);
  font: 600 18px var(--sk-font);
}
.sk .sk-item__revlist {
  display: grid;
  gap: 12px;
}
.sk .sk-item__relh {
  margin-bottom: 20px;
}
@media (max-width: 1199px) {
  .sk .sk-item__top,
  .sk .sk-item__more {
    gap: 28px;
  }
}
@media (max-width: 989px) {
  .sk .sk-item__top,
  .sk .sk-item__more {
    grid-template-columns: minmax(0, 1fr);
  }
  .sk .sk-gal {
    position: static;
  }
}
@media (max-width: 576px) {
  .sk .sk-buy {
    padding: 16px;
  }
  .sk .sk-buy__price b {
    font-size: 28px;
  }
  .sk .sk-buy__stock {
    margin-left: 0;
  }
  .sk .sk-buy__row--two {
    flex-direction: column;
  }
  .sk .sk-buy__main {
    font-size: 15px;
    padding: 0 12px;
  }
  .sk .sk-gal__thumbs button {
    width: 76px;
  }
  .sk .sk-ship {
    padding: 16px;
  }
}

// --- vakansii.vue
.sk .sk-job {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 24px;
  align-items: start;
}
.sk .sk-job__card {
  display: grid;
  gap: 22px;
}
.sk .sk-job__head {
  display: grid;
  gap: 12px;
}
.sk .sk-job__block {
  display: grid;
  gap: 10px;
  > b {
    font-size: 16px;
  }
}
.sk ul.sk-job__list {
  display: grid;
  gap: 8px;
  li {
    display: flex;
    gap: 10px;
  }
  .sk-icon {
    color: var(--sk-green);
    margin-top: 2px;
  }
}
.sk .sk-job__side {
  position: sticky;
  top: calc(var(--sk-headh) + 16px);
  display: grid;
  gap: 12px;
  a {
    color: var(--sk-acc);
  }
}
@media (max-width: 989px) {
  .sk .sk-job {
    grid-template-columns: minmax(0, 1fr);
  }
  .sk .sk-job__side {
    position: static;
  }
}
</style>
