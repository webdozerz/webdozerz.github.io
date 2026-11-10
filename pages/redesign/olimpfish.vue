<script lang="ts" setup>
import { OL_ORIG, olAboutMenu, olAsset, olContacts, olGrams, olPath, olPrice, olProduct, olRub, olSearch, olSecImg, olSections, olSrc, olTopNav, olUnit } from '~/utils/olimpfish'
import { useOlShop, useOlUi } from '~/composables/useOlimpfish'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'
import OlPhone from '~/components/redesign/olimpfish/OlPhone.vue'

const route = useRoute()
const router = useRouter()
const shop = useOlShop()
const ui = useOlUi()

useSeoMeta({
  title: 'Олимп — рыба, икра и морепродукты от производителя | Концепт редизайна',
  description:
    'Концепт редизайна olimp-fish.ru: своё натуральное копчение осетра и белуги, красная и чёрная икра, морепродукты с доставкой по Москве — «отрез» нужного веса на первом экране, цена за любой вес по ₽/кг, корзина с тарифами доставки по зонам МКАД, заявка для оптовиков.',
  ogTitle: 'Олимп — концепт редизайна',
  ogDescription: 'Рыба, икра и морепродукты от производителя: отрежьте нужный вес осетра или балыка — цена посчитается сразу, доставка по Москве «сегодня на завтра».',
  ogImage: 'https://andryushov.me/redesign/olimpfish/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { lang: 'ru' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap' },
  ],
})

const year = new Date().getFullYear()
const isOn = (to: string) => route.path.replace(/\/$/, '') === olPath(to).replace(/\/$/, '')
const inCatalog = computed(() => route.path.startsWith(olPath('/catalog')))

// Липкая шапка: строка «Приём заказов 24/7 · почта · телефоны» уезжает, строка «логотип · меню · корзина» остаётся
const strip = ref<HTMLElement | null>(null)
const stick = ref(0)
const measure = () => {
  stick.value = strip.value?.offsetHeight ?? 0
}
const scrolled = ref(false)
const onScroll = () => {
  scrolled.value = window.scrollY > 640
}

// Поиск с подсказками — строкой под шапкой
const q = ref('')
const qInput = ref<HTMLInputElement | null>(null)
const hints = computed(() => (q.value.trim().length > 1 ? olSearch(q.value, 6) : []))
const openSearch = () => {
  ui.menu.value = false
  ui.search.value = !ui.search.value
  if (ui.search.value) nextTick(() => qInput.value?.focus())
}
const submitSearch = () => {
  const s = q.value.trim()
  if (!s) return
  ui.search.value = false
  router.push({ path: olPath('/catalog'), query: { q: s } })
}

// Мобильное меню: вкладки «Меню / Каталог», как у оригинала
const menuTab = ref<'menu' | 'cat'>('menu')
const openMenu = (tab: 'menu' | 'cat' = 'menu') => {
  menuTab.value = tab
  ui.search.value = false
  ui.menu.value = true
}
const openSub = ref<string | null>(null)
// выпадашки шапки прячем после клика по пункту, пока курсор не уйдёт
const quiet = ref(false)

// Формы — демо: ничего никуда не отправляется
const loginTab = ref<'in' | 'reg' | 'lost'>('in')
const form = reactive({ name: '', phone: '', mail: '', pass: '', text: '', ok: true })
const done = ref('')
const quick = computed(() => {
  const p = olProduct(ui.subject.value.id)
  if (!p) return null
  const g = p.w ? ui.subject.value.g || p.w.g[0] : 0
  return { p, g, price: olPrice(p, g) }
})
const send = (kind: string) => {
  if (kind === 'login') {
    shop.login(form.name.trim() || form.mail.trim().split('@')[0] || 'Покупатель')
    ui.modal.value = null
    shop.say('Вы вошли — это демо, заказы и бонусы ненастоящие')
    return
  }
  done.value = kind
}
const close = () => {
  ui.modal.value = null
  done.value = ''
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
    ui.search.value = false
    ui.modal.value = null
    done.value = ''
    quiet.value = true
    ;(document.activeElement as HTMLElement | null)?.blur?.()
    if (route.query.q === undefined) q.value = ''
  },
)
const onKey = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  close()
  ui.menu.value = false
  ui.search.value = false
}
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => {
  shop.persist()
  measure()
  onScroll()
  window.addEventListener('resize', measure)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  if (typeof route.query.q === 'string') q.value = route.query.q
})
onBeforeUnmount(() => {
  clearTimeout(toastTimer)
  window.removeEventListener('resize', measure)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div class="ol">
    <div class="ol-concept">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="OL_ORIG" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="ol-header" :style="{ top: `-${stick}px` }">
      <div ref="strip" class="ol-strip">
        <div class="ol-wrap ol-strip__in">
          <p class="ol-strip__orders"><OlIcon name="clock" />{{ olContacts.orders }} <span>· сегодня на завтра</span></p>
          <a class="ol-strip__mail" :href="`mailto:${olContacts.mail}`"><OlIcon name="mail" />{{ olContacts.mail }}</a>
          <div class="ol-strip__phones">
            <a v-for="ph in olContacts.phones.slice(0, 2)" :key="ph.href" :href="ph.href">{{ ph.text }}</a>
          </div>
          <div class="ol-strip__soc">
            <a :href="olContacts.vk" target="_blank" rel="noopener" aria-label="ВКонтакте">VK</a>
            <a :href="olContacts.tg" target="_blank" rel="noopener" aria-label="Telegram">TG</a>
          </div>
          <button type="button" class="ol-strip__call" @click="ui.open('callback')"><OlIcon name="phone" />Заказать звонок</button>
        </div>
      </div>

      <div class="ol-bar">
        <div class="ol-wrap ol-bar__in ol-header__row">
          <button type="button" class="ol-bar__burger" aria-label="Меню" @click="openMenu('menu')"><OlIcon name="menu" /></button>
          <NuxtLink :to="olPath('/')" class="ol-logo" aria-label="Олимп — на главную">
            <img :src="olAsset('logo.jpg')" alt="Олимп — рыба, морепродукты, икра" width="627" height="164" />
          </NuxtLink>
          <nav class="ol-nav" :class="{ 'is-quiet': quiet }" aria-label="Главное меню" @mouseleave="quiet = false">
            <div class="ol-nav__item ol-nav__item--drop">
              <NuxtLink :to="olPath('/catalog')" class="ol-nav__link" :class="{ 'is-on': inCatalog }">Продукция<OlIcon name="down" /></NuxtLink>
              <div class="ol-mega">
                <div class="ol-mega__grid">
                  <NuxtLink v-for="s in olSections" :key="s.slug" :to="olPath(`/catalog/${s.slug}`)" class="ol-mega__sec">
                    <img :src="olSecImg(s.slug)" alt="" width="64" height="64" loading="lazy" />
                    <span>
                      <b>{{ s.name }}</b>
                      <small v-if="s.subs">{{ s.subs.map((x) => x.name).join(' · ') }}</small>
                      <small v-else>{{ s.count }} товаров</small>
                    </span>
                  </NuxtLink>
                </div>
                <NuxtLink :to="olPath('/catalog')" class="ol-link">Вся продукция<OlIcon name="right" /></NuxtLink>
              </div>
            </div>
            <NuxtLink :to="olPath(olTopNav[0].to)" class="ol-nav__link ol-nav__link--hot" :class="{ 'is-on': isOn(olTopNav[0].to) }">{{ olTopNav[0].name }}</NuxtLink>
            <div class="ol-nav__item ol-nav__item--drop">
              <NuxtLink :to="olPath('/about')" class="ol-nav__link" :class="{ 'is-on': isOn('/about') }">О компании<OlIcon name="down" /></NuxtLink>
              <div class="ol-drop">
                <NuxtLink v-for="m in olAboutMenu" :key="m.to" :to="olPath(m.to)">{{ m.name }}</NuxtLink>
              </div>
            </div>
            <NuxtLink v-for="n in olTopNav.slice(1)" :key="n.to" :to="olPath(n.to)" class="ol-nav__link" :class="{ 'is-on': isOn(n.to) }">{{ n.name }}</NuxtLink>
          </nav>
          <div class="ol-tools">
            <button type="button" class="ol-tool" :class="{ 'is-on': ui.search.value }" aria-label="Поиск" @click="openSearch"><OlIcon :name="ui.search.value ? 'close' : 'search'" /></button>
            <NuxtLink :to="olPath('/account')" class="ol-tool ol-tool--user" :aria-label="shop.user.value ? 'Личный кабинет' : 'Войти'"><OlIcon name="user" /></NuxtLink>
            <NuxtLink :to="olPath('/favorites')" class="ol-tool" aria-label="Избранное">
              <OlIcon name="heart" /><i v-if="shop.fav.value.length">{{ shop.fav.value.length }}</i>
            </NuxtLink>
            <NuxtLink :to="olPath('/cart')" class="ol-cartbtn" :class="{ 'is-full': shop.count.value }" aria-label="Корзина">
              <OlIcon name="cart" /><i v-if="shop.count.value">{{ shop.count.value }}</i>
              <span>{{ shop.count.value ? olRub(shop.total.value) : 'Корзина' }}</span>
            </NuxtLink>
          </div>
        </div>
        <div v-if="ui.search.value" class="ol-find">
          <form class="ol-wrap ol-find__in" role="search" @submit.prevent="submitSearch">
            <div class="ol-find__field">
              <OlIcon name="search" />
              <input ref="qInput" v-model="q" type="search" placeholder="Начните вводить: осётр, икра нерки, краб…" aria-label="Поиск по каталогу" autocomplete="off" />
              <button type="submit" class="ol-btn ol-btn--acc">Найти</button>
            </div>
            <div v-if="q.trim().length > 1" class="ol-find__drop">
              <NuxtLink v-for="p in hints" :key="p.id" :to="olPath(`/product/${p.id}`)" class="ol-find__hit">
                <img :src="olSrc(p.th || p.img)" alt="" width="48" height="48" loading="lazy" />
                <span>{{ p.n }}<small>{{ olUnit(p) }}</small></span>
                <b>{{ p.w ? `${olRub(p.w.kg)}/кг` : olRub(p.p) }}</b>
              </NuxtLink>
              <p v-if="!hints.length" class="ol-find__none">Ничего не нашлось — попробуйте «осётр» или «икра»</p>
            </div>
          </form>
        </div>
      </div>
    </header>

    <main class="ol-main">
      <NuxtPage />
    </main>

    <footer class="ol-foot">
      <div class="ol-wrap">
        <div class="ol-foot__grid">
          <div class="ol-foot__brand">
            <img :src="olAsset('logo.jpg')" alt="Олимп" width="627" height="164" loading="lazy" />
            <p>Эксперт в натуральном копчении рыбы. Вкусная рыба, качеству которой доверяют.</p>
            <div class="ol-foot__soc">
              <a :href="olContacts.vk" target="_blank" rel="noopener">ВКонтакте</a>
              <a :href="olContacts.tg" target="_blank" rel="noopener">Telegram</a>
            </div>
          </div>
          <nav aria-label="Продукция">
            <h3>Продукция</h3>
            <NuxtLink v-for="s in olSections" :key="s.slug" :to="olPath(`/catalog/${s.slug}`)">{{ s.name }}</NuxtLink>
            <NuxtLink :to="olPath('/catalog/sale')">Акции</NuxtLink>
          </nav>
          <nav aria-label="Покупателям">
            <h3>Покупателям</h3>
            <NuxtLink v-for="m in olAboutMenu" :key="m.to" :to="olPath(m.to)">{{ m.name }}</NuxtLink>
            <NuxtLink :to="olPath('/opt')">Партнёрам и оптовикам</NuxtLink>
            <NuxtLink :to="olPath('/card')">Карта привилегий</NuxtLink>
          </nav>
          <div class="ol-foot__contacts">
            <h3>Контакты</h3>
            <a v-for="ph in olContacts.phones" :key="ph.href" :href="ph.href" class="ol-foot__phone">{{ ph.text }}</a>
            <a :href="`mailto:${olContacts.mail}`">{{ olContacts.mail }}</a>
            <p>{{ olContacts.address }}, {{ olContacts.metro }}</p>
            <p>Магазин: {{ olContacts.hours }}<br />{{ olContacts.orders }}</p>
            <button type="button" class="ol-btn ol-btn--line" @click="ui.open('callback')">Заказать звонок</button>
          </div>
        </div>
        <div class="ol-foot__legal">
          <p>{{ olContacts.legal }}</p>
          <p>
            Концепт редизайна, {{ year }}. Тексты, цены, фотографии и логотип принадлежат ООО «ТК «Олимп» и взяты с
            <a :href="OL_ORIG" target="_blank" rel="noopener">olimp-fish.ru</a> для демонстрации. Не является публичной офертой.
          </p>
        </div>
      </div>
    </footer>

    <!-- нижняя панель на телефоне — их пятёрка: Магазин · Фильтры/Поиск · Избранное · Заказ · Аккаунт -->
    <nav class="ol-tabbar" aria-label="Быстрые разделы">
      <button type="button" :class="{ 'is-on': ui.menu.value && menuTab === 'cat' }" @click="openMenu('cat')"><OlIcon name="grid" /><span>Магазин</span></button>
      <button type="button" :class="{ 'is-on': ui.search.value }" @click="openSearch"><OlIcon name="search" /><span>Поиск</span></button>
      <NuxtLink :to="olPath('/favorites')" :class="{ 'is-on': isOn('/favorites') }">
        <OlIcon name="heart" /><i v-if="shop.fav.value.length">{{ shop.fav.value.length }}</i><span>Избранное</span>
      </NuxtLink>
      <NuxtLink :to="olPath('/cart')" :class="{ 'is-on': isOn('/cart') }">
        <OlIcon name="cart" /><i v-if="shop.count.value">{{ shop.count.value }}</i><span class="ol-tabbar__sum">{{ shop.count.value ? olRub(shop.total.value) : 'Корзина' }}</span>
      </NuxtLink>
      <NuxtLink :to="olPath('/account')" :class="{ 'is-on': isOn('/account') }"><OlIcon name="user" /><span>Кабинет</span></NuxtLink>
    </nav>

    <button v-if="scrolled" type="button" class="ol-chatbtn" aria-label="Написать в чат" @click="ui.open('chat')"><OlIcon name="chat" /><span>Чат</span></button>
    <button v-if="scrolled" type="button" class="ol-topbtn" aria-label="Наверх" @click="toTop"><OlIcon name="down" /></button>

    <!-- мобильное меню -->
    <Transition name="ol-fade">
      <div v-if="ui.menu.value" class="ol-drawer" @click.self="ui.menu.value = false">
        <div class="ol-drawer__panel">
          <div class="ol-drawer__head">
            <div class="ol-seg">
              <button type="button" :class="{ 'is-on': menuTab === 'menu' }" @click="menuTab = 'menu'">Меню</button>
              <button type="button" :class="{ 'is-on': menuTab === 'cat' }" @click="menuTab = 'cat'">Каталог</button>
            </div>
            <button type="button" class="ol-x" aria-label="Закрыть" @click="ui.menu.value = false"><OlIcon name="close" /></button>
          </div>
          <div v-if="menuTab === 'cat'" class="ol-drawer__list">
            <template v-for="s in olSections" :key="s.slug">
              <div class="ol-drawer__row">
                <NuxtLink :to="olPath(`/catalog/${s.slug}`)" class="ol-drawer__sec">
                  <img :src="olSecImg(s.slug)" alt="" width="40" height="40" loading="lazy" /><span>{{ s.name }}</span>
                </NuxtLink>
                <button v-if="s.subs" type="button" class="ol-drawer__more" :aria-expanded="openSub === s.slug" aria-label="Подразделы" @click="openSub = openSub === s.slug ? null : s.slug">
                  <OlIcon :name="openSub === s.slug ? 'minus' : 'plus'" />
                </button>
              </div>
              <div v-if="s.subs && openSub === s.slug" class="ol-drawer__subs">
                <NuxtLink v-for="x in s.subs" :key="x.slug" :to="olPath(`/catalog/${s.slug}?sub=${x.slug}`)">{{ x.name }}</NuxtLink>
              </div>
            </template>
            <NuxtLink :to="olPath('/catalog/sale')" class="ol-drawer__sec ol-drawer__sec--hot"><span>Акции</span></NuxtLink>
          </div>
          <div v-else class="ol-drawer__list">
            <NuxtLink :to="olPath('/catalog')" class="ol-drawer__link">Продукция</NuxtLink>
            <NuxtLink :to="olPath('/catalog/sale')" class="ol-drawer__link ol-drawer__link--hot">Акции</NuxtLink>
            <details class="ol-drawer__det">
              <summary>О компании<OlIcon name="down" /></summary>
              <NuxtLink v-for="m in olAboutMenu" :key="m.to" :to="olPath(m.to)">{{ m.name }}</NuxtLink>
            </details>
            <NuxtLink v-for="n in olTopNav.slice(1)" :key="n.to" :to="olPath(n.to)" class="ol-drawer__link">{{ n.name }}</NuxtLink>
            <NuxtLink :to="olPath('/account')" class="ol-drawer__link">{{ shop.user.value ? 'Личный кабинет' : 'Войти / Создать аккаунт' }}</NuxtLink>
          </div>
          <div class="ol-drawer__foot">
            <p>{{ olContacts.orders }}</p>
            <a v-for="ph in olContacts.phones.slice(0, 2)" :key="ph.href" :href="ph.href">{{ ph.text }}</a>
            <a :href="`mailto:${olContacts.mail}`">{{ olContacts.mail }}</a>
            <div class="ol-drawer__btns">
              <button type="button" class="ol-btn ol-btn--acc" @click="ui.open('callback')">Заказать звонок</button>
              <button type="button" class="ol-btn ol-btn--line" @click="ui.open('chat')">Чат</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- окна -->
    <Transition name="ol-fade">
      <div v-if="ui.modal.value" class="ol-modal" @click.self="close">
        <div class="ol-modal__box" role="dialog" aria-modal="true">
          <button type="button" class="ol-x ol-modal__x" aria-label="Закрыть" @click="close"><OlIcon name="close" /></button>

          <template v-if="done">
            <div class="ol-done">
              <span class="ol-done__ic"><OlIcon name="check" /></span>
              <h2>{{ done === 'quick' ? 'Заказ принят' : done === 'chat' ? 'Сообщение отправлено' : 'Заявка принята' }}</h2>
              <p>Это демо-версия: на настоящем сайте менеджер перезвонит{{ done === 'chat' ? ' или ответит в чате' : '' }}. Заказы — по телефону {{ olContacts.phones[0].text }}.</p>
              <button type="button" class="ol-btn ol-btn--acc" @click="close">Хорошо</button>
            </div>
          </template>

          <template v-else-if="ui.modal.value === 'login'">
            <h2>{{ loginTab === 'reg' ? 'Создать аккаунт' : loginTab === 'lost' ? 'Восстановить пароль' : 'Войти' }}</h2>
            <div class="ol-seg ol-seg--wide">
              <button type="button" :class="{ 'is-on': loginTab === 'in' }" @click="loginTab = 'in'">Вход</button>
              <button type="button" :class="{ 'is-on': loginTab === 'reg' }" @click="loginTab = 'reg'">Регистрация</button>
            </div>
            <form class="ol-form" @submit.prevent="loginTab === 'lost' ? send('lost') : send('login')">
              <label v-if="loginTab === 'reg'" class="ol-field"><span>Имя</span><input v-model="form.name" required autocomplete="name" /></label>
              <label class="ol-field"><span>{{ loginTab === 'in' ? 'Имя пользователя или e-mail' : 'E-mail' }}</span><input v-model="form.mail" required autocomplete="email" /></label>
              <label v-if="loginTab !== 'lost'" class="ol-field"><span>Пароль</span><input v-model="form.pass" type="password" required autocomplete="current-password" /></label>
              <label v-if="loginTab === 'in'" class="ol-check"><input type="checkbox" checked /><span>Запомнить меня</span></label>
              <button type="submit" class="ol-btn ol-btn--acc">{{ loginTab === 'reg' ? 'Зарегистрироваться' : loginTab === 'lost' ? 'Сбросить пароль' : 'Войти' }}</button>
              <button v-if="loginTab === 'in'" type="button" class="ol-link" @click="loginTab = 'lost'">Забыли пароль?</button>
            </form>
          </template>

          <template v-else-if="ui.modal.value === 'quick'">
            <h2>Быстрая покупка</h2>
            <div v-if="quick" class="ol-quick">
              <img :src="olSrc(quick.p.th || quick.p.img)" alt="" width="72" height="72" />
              <div>
                <b>{{ quick.p.n }}</b>
                <span>{{ quick.p.w ? olGrams(quick.g) : olUnit(quick.p) }} · <strong>{{ olRub(quick.price) }}</strong></span>
              </div>
            </div>
            <form class="ol-form" @submit.prevent="send('quick')">
              <label class="ol-field"><span>Имя</span><input v-model="form.name" required autocomplete="name" /></label>
              <label class="ol-field"><span>Телефон</span><OlPhone v-model="form.phone" required /></label>
              <label class="ol-field"><span>Комментарий</span><textarea v-model="form.text" rows="2" placeholder="Удобное время, адрес" /></label>
              <label class="ol-check"><input v-model="form.ok" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
              <button type="submit" class="ol-btn ol-btn--acc">Отправить заказ</button>
              <p class="ol-form__note">Без регистрации — менеджер перезвонит и уточнит итоговый вес и сумму.</p>
            </form>
          </template>

          <template v-else-if="ui.modal.value === 'callback'">
            <h2>Заказать звонок</h2>
            <p class="ol-modal__lead">Перезвоним в рабочее время: {{ olContacts.hours }}.</p>
            <form class="ol-form" @submit.prevent="send('callback')">
              <label class="ol-field"><span>Имя</span><input v-model="form.name" required autocomplete="name" /></label>
              <label class="ol-field"><span>Телефон</span><OlPhone v-model="form.phone" required /></label>
              <label class="ol-check"><input v-model="form.ok" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
              <button type="submit" class="ol-btn ol-btn--acc">Жду звонка</button>
            </form>
          </template>

          <template v-else-if="ui.modal.value === 'chat'">
            <h2>Отправьте нам сообщение</h2>
            <p class="ol-modal__lead">Онлайн-чат на сайте (у оригинала — Jivo). Ответим в рабочее время.</p>
            <form class="ol-form" @submit.prevent="send('chat')">
              <label class="ol-field"><span>Сообщение</span><textarea v-model="form.text" rows="3" required placeholder="Например: есть ли сегодня осётр горячего копчения 1,5 кг?" /></label>
              <label class="ol-field"><span>Имя</span><input v-model="form.name" autocomplete="name" /></label>
              <label class="ol-field"><span>Телефон или e-mail</span><input v-model="form.mail" /></label>
              <button type="submit" class="ol-btn ol-btn--acc">Отправить</button>
            </form>
          </template>
        </div>
      </div>
    </Transition>

    <Transition name="ol-fade">
      <div v-if="shop.toast.value" :key="shop.toast.value.id" class="ol-toast" role="status">
        <OlIcon name="check" />
        <span>{{ shop.toast.value.text }}</span>
        <NuxtLink v-if="!/избранн|вошли/i.test(shop.toast.value.text)" :to="olPath('/cart')">Корзина · {{ olRub(shop.total.value) }}</NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.ol {
  --ol-acc: #c85d00; --ol-acc-d: #ad4f00; --ol-hi: #ff8000; --ol-soft: #fff1e3;
  --ol-ink: #0e1c3d; --ol-navy: #011744; --ol-text: #253047; --ol-mute: #5f6a7d;
  --ol-line: #e1e6ee; --ol-surf: #f1f4f8; --ol-green: #2f7d3a;
  --ol-font: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --ol-r: 10px; --ol-R: 16px; --ol-bar: 78px;
  min-height: 100vh; background: #fff; color: var(--ol-text); font: 400 15px/1.55 var(--ol-font); -webkit-font-smoothing: antialiased;
}
html:has(.ol) { scroll-padding-top: 100px; }
:where(.ol) { p, h1, h2, h3, h4, dl, dd, figure, blockquote { margin: 0; } a { color: inherit; text-decoration: none; } img { max-width: 100%; }
  button, input, select, textarea { font: inherit; color: inherit; } button { cursor: pointer; }
  h1, h2, h3 { color: var(--ol-ink); font-weight: 800; line-height: 1.15; letter-spacing: -.015em; }
}
.ol ul[class] { list-style: none; }
.ol-wrap { max-width: 1360px; margin: 0 auto; padding-left: 32px; padding-right: 32px; box-sizing: border-box; }
.ol-main { display: block; min-height: 50vh; }
.ol-icon { width: 20px; height: 20px; flex: none; }

.ol-concept { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 12px; padding: 8px 16px; font-size: 13px; line-height: 1.4; text-align: center; background: var(--ol-navy); color: #d3dbea;
  a { color: #fff; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
}

/* ---- кнопки, поля, общие элементы ---- */
.ol .ol-btn, .ol .ol-btn:focus { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 20px; border: 1px solid var(--ol-acc); border-radius: var(--ol-r); background: var(--ol-acc); color: #fff; font-weight: 700; font-size: 15px; white-space: nowrap; box-sizing: border-box; transition: background-color .15s, border-color .15s, color .15s;
  &:hover { background: var(--ol-acc-d); border-color: var(--ol-acc-d); }
  &:disabled { opacity: .5; cursor: default; }
  .ol-icon { width: 18px; height: 18px; }
}
.ol .ol-btn--big, .ol .ol-btn--big:focus { min-height: 52px; padding: 0 26px; font-size: 16px; }
.ol .ol-btn--line, .ol .ol-btn--line:focus, .ol .ol-btn--line:active { background: #fff; color: var(--ol-ink); border: 1px solid var(--ol-line);
  &:hover { background: #fff; border-color: var(--ol-acc); color: var(--ol-acc); }
}
.ol .ol-btn--ink, .ol .ol-btn--ink:focus { background: var(--ol-ink); border-color: var(--ol-ink); &:hover { background: #1d2c52; border-color: #1d2c52; } }
.ol .ol-btn--off { background: var(--ol-surf); border-color: var(--ol-surf); color: var(--ol-mute); cursor: default; &:hover { background: var(--ol-surf); border-color: var(--ol-surf); } }
.ol .ol-link, .ol .ol-link:focus { display: inline-flex; align-items: center; gap: 4px; padding: 0; border: 0; background: none; color: var(--ol-acc); font-weight: 700; font-size: 15px;
  &:hover { color: var(--ol-acc-d); } .ol-icon { width: 18px; height: 18px; }
}
.ol .ol-x, .ol .ol-x:focus { width: 40px; height: 40px; display: grid; place-items: center; border: 0; border-radius: 50%; background: var(--ol-surf); color: var(--ol-ink); &:hover { background: #e4e9f0; } }
.ol .ol-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.ol .ol-chip, .ol .ol-chip:focus { min-height: 32px; padding: 0 10px; border: 1px solid var(--ol-line); border-radius: 8px; background: #fff; font-size: 13px; font-weight: 600; color: var(--ol-ink); white-space: nowrap; font-variant-numeric: tabular-nums;
  &:hover { border-color: #c4cddb; }
  &.is-on { border: 1px solid var(--ol-ink); background: var(--ol-ink); color: #fff; }
}
.ol .ol-qty { display: inline-grid; grid-template-columns: 40px minmax(0, 1fr) 40px; align-items: center; min-height: 44px; border-radius: var(--ol-r); background: var(--ol-soft); box-sizing: border-box;
  button { height: 44px; display: grid; place-items: center; border: 0; background: none; color: var(--ol-acc); border-radius: var(--ol-r); &:hover { background: #ffe2c4; } .ol-icon { width: 18px; height: 18px; } }
  span { text-align: center; padding: 0 6px; font-weight: 700; color: var(--ol-ink); white-space: nowrap; font-variant-numeric: tabular-nums; }
}
.ol .ol-seg { display: inline-flex; padding: 4px; gap: 4px; border-radius: 12px; background: var(--ol-surf);
  button { padding: 8px 16px; border: 0; border-radius: 9px; background: none; font-weight: 600; font-size: 14px; color: var(--ol-mute); white-space: nowrap; &.is-on { background: #fff; color: var(--ol-ink); box-shadow: 0 1px 3px rgb(14 28 61 / .1); } }
  &--wide { display: flex; button { flex: 1; } }
}
.ol .ol-form { display: grid; gap: 14px; align-items: start; }
.ol .ol-field { display: grid; gap: 8px; align-content: start;
  > span { font-size: 13px; font-weight: 600; color: var(--ol-mute); }
  input, textarea, select { width: 100%; min-height: 46px; padding: 11px 14px; border: 1px solid var(--ol-line); border-radius: var(--ol-r); background: #fff; font-size: 15px; box-sizing: border-box; outline: none; transition: border-color .15s;
    &:focus { border-color: var(--ol-acc); box-shadow: 0 0 0 3px rgb(255 128 0 / .15); } }
  textarea { resize: vertical; }
  select { appearance: none; padding-right: 40px; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%235f6a7d' stroke-width='1.8'%3E%3Cpath d='M1 1.5l5 5 5-5'/%3E%3C/svg%3E") no-repeat right 16px center; }
}
.ol .ol-check { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; color: var(--ol-mute); cursor: pointer;
  input { width: 18px; height: 18px; min-height: 0; padding: 0; margin: 2px 0 0; accent-color: var(--ol-acc); flex: none; box-shadow: none; }
}
.ol .ol-form__note { font-size: 13px; color: var(--ol-mute); }
.ol .ol-head { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 10px 24px; margin-bottom: 22px;
  h2 { font-size: 30px; }
  p { color: var(--ol-mute); max-width: 640px; }
  h2 + p { margin-top: 8px; }
}
.ol .ol-sec { padding-top: 64px; padding-bottom: 0; }
.ol .ol-page { padding-top: 28px; padding-bottom: 72px; }
.ol .ol-crumbs { display: flex; flex-wrap: wrap; gap: 6px; font-size: 13px; color: var(--ol-mute); margin-bottom: 14px;
  a:hover { color: var(--ol-acc); } span::before { content: '/'; margin-right: 6px; color: #b5bfcd; }
}
.ol .ol-title { font-size: 38px; margin-bottom: 10px; }
.ol .ol-lead { font-size: 17px; color: var(--ol-mute); max-width: 760px; }
.ol .ol-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
.ol .ol-panel { padding: 24px; border-radius: var(--ol-R); background: var(--ol-surf); }
.ol .ol-empty { display: grid; justify-items: center; gap: 12px; padding: 56px 20px; border-radius: var(--ol-R); background: var(--ol-surf); text-align: center;
  h2 { font-size: 22px; } p { color: var(--ol-mute); max-width: 440px; }
  .ol-icon { width: 40px; height: 40px; color: var(--ol-acc); }
}
/* отзывы — на главной и на странице «Отзывы» */
.ol .ol-rev { display: flex; flex-direction: column; gap: 12px; padding: 22px; border-radius: var(--ol-R); background: var(--ol-surf);
  p { font-size: 15px; line-height: 1.6; color: var(--ol-text); }
  b { margin-top: auto; color: var(--ol-ink); font-weight: 700; }
  &__stars { display: flex; gap: 2px; color: var(--ol-hi); .ol-icon { width: 16px; height: 16px; } }
}
/* партнёры — на главной и на «Опте» */
.ol .ol-partners { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px;
  li { height: 92px; display: grid; place-items: center; padding: 0 18px; border: 1px solid var(--ol-line); border-radius: var(--ol-R); background: #fff; }
  img { max-height: 40px; max-width: 100%; object-fit: contain; }
}
/* форма заявки опта — на главной и на «Опте» */
.ol .ol-optform { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px;
  .ol-field--wide, .ol-check, .ol-btn { grid-column: 1 / -1; }
  .ol-btn { justify-self: start; }
}

/* ---- шапка ---- */
.ol-header { position: sticky; z-index: 60; background: #fff; }
.ol-strip { border-bottom: 1px solid var(--ol-line); font-size: 13.5px; color: var(--ol-mute);
  &__in { display: flex; align-items: center; gap: 22px; min-height: 42px; }
  .ol-icon { width: 17px; height: 17px; color: var(--ol-acc); }
  p, a, button { display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; }
  &__orders { font-weight: 600; color: var(--ol-ink); span { font-weight: 400; color: var(--ol-mute); } }
  a:hover { color: var(--ol-acc); }
  &__phones { display: flex; gap: 16px; margin-left: auto; a { font-weight: 700; color: var(--ol-ink); } }
  &__soc { display: flex; gap: 6px; a { width: 30px; height: 26px; justify-content: center; border-radius: 7px; background: var(--ol-surf); font-size: 11px; font-weight: 800; color: var(--ol-ink); &:hover { background: var(--ol-soft); } } }
  &__call, &__call:focus { padding: 0; border: 0; background: none; font-weight: 700; color: var(--ol-acc); &:hover { color: var(--ol-acc-d); } }
}
.ol-bar { border-bottom: 1px solid var(--ol-line); background: #fff;
  &__in { display: flex; align-items: center; gap: 22px; height: var(--ol-bar); }
  &__burger, &__burger:focus { display: none; width: 44px; height: 44px; place-items: center; border: 0; border-radius: var(--ol-r); background: var(--ol-surf); color: var(--ol-ink); .ol-icon { width: 22px; height: 22px; } }
}
.ol-logo { flex: none; display: block; img { display: block; width: 186px; height: auto; } }
.ol-nav { display: flex; align-items: center; gap: 2px; min-width: 0;
  &__item { position: relative; }
  &__link { display: inline-flex; align-items: center; gap: 4px; padding: 10px 11px; border-radius: 9px; font-size: 14.5px; font-weight: 600; color: var(--ol-ink); white-space: nowrap;
    .ol-icon { width: 16px; height: 16px; color: var(--ol-mute); transition: transform .15s; }
    &:hover, &.is-on { color: var(--ol-acc); }
    &--hot { background: var(--ol-soft); color: var(--ol-acc); &:hover { background: #ffe2c4; } }
  }
  &__item--drop:hover .ol-nav__link .ol-icon, &__item--drop:focus-within .ol-nav__link .ol-icon { transform: rotate(180deg); }
}
.ol-mega, .ol-drop { position: absolute; top: 100%; left: 0; z-index: 5; visibility: hidden; opacity: 0; transform: translateY(6px); transition: opacity .15s, transform .15s, visibility .15s; background: #fff; border: 1px solid var(--ol-line); border-radius: var(--ol-R); box-shadow: 0 2px 6px rgb(14 28 61 / .08), 0 22px 54px rgb(14 28 61 / .2);
  &::before { content: ''; position: absolute; left: 0; right: 0; top: -14px; height: 14px; }
}
.ol-nav__item--drop:hover > .ol-mega, .ol-nav__item--drop:focus-within > .ol-mega, .ol-nav__item--drop:hover > .ol-drop, .ol-nav__item--drop:focus-within > .ol-drop { visibility: visible; opacity: 1; transform: none; }
.ol-nav.is-quiet .ol-mega, .ol-nav.is-quiet .ol-drop { visibility: hidden !important; opacity: 0 !important; }
.ol-mega { width: 680px; margin-top: 10px; padding: 18px; display: grid; gap: 14px;
  &__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  &__sec { display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: 12px;
    img { width: 56px; height: 56px; object-fit: contain; border-radius: 10px; background: #fff; border: 1px solid var(--ol-line); flex: none; }
    span { display: grid; gap: 1px; min-width: 0; } b { font-weight: 700; color: var(--ol-ink); font-size: 15px; } small { color: var(--ol-mute); font-size: 12.5px; }
    &:hover { background: var(--ol-surf); b { color: var(--ol-acc); } }
  }
  .ol-link { justify-self: start; padding-left: 8px; }
}
.ol-drop { min-width: 230px; margin-top: 10px; padding: 8px; display: grid;
  a { padding: 9px 12px; border-radius: 9px; font-size: 14.5px; font-weight: 500; color: var(--ol-ink); white-space: nowrap; &:hover { background: var(--ol-surf); color: var(--ol-acc); } }
}
.ol-tools { display: flex; align-items: center; gap: 6px; margin-left: auto; flex: none; }
.ol .ol-tool, .ol .ol-tool:focus { position: relative; width: 44px; height: 44px; display: grid; place-items: center; border: 0; border-radius: var(--ol-r); background: none; color: var(--ol-ink);
  .ol-icon { width: 23px; height: 23px; }
  &:hover, &.is-on { background: var(--ol-surf); color: var(--ol-acc); }
  i { position: absolute; top: 3px; right: 2px; min-width: 18px; height: 18px; padding: 0 4px; box-sizing: border-box; border-radius: 9px; background: var(--ol-hi); color: #fff; font: 700 11px/18px var(--ol-font); text-align: center; font-style: normal; }
}
.ol-cartbtn { position: relative; display: inline-flex; align-items: center; gap: 8px; width: 160px; height: 46px; padding: 0 14px; box-sizing: border-box; border-radius: var(--ol-r); background: var(--ol-acc); color: #fff !important; font-weight: 700; font-size: 15px; white-space: nowrap; font-variant-numeric: tabular-nums;
  .ol-icon { width: 22px; height: 22px; }
  i { position: absolute; top: -6px; left: 26px; min-width: 20px; height: 20px; padding: 0 5px; box-sizing: border-box; border-radius: 10px; background: var(--ol-ink); border: 2px solid #fff; font: 700 11px/16px var(--ol-font); text-align: center; font-style: normal; }
  &:hover { background: var(--ol-acc-d); }
}
.ol-find { position: absolute; left: 0; right: 0; top: 100%; background: #fff; border-bottom: 1px solid var(--ol-line); box-shadow: 0 22px 40px rgb(14 28 61 / .12);
  &__in { position: relative; padding-top: 14px; padding-bottom: 14px; }
  &__field { display: flex; align-items: center; gap: 10px; padding: 0 6px 0 16px; border: 1px solid #c9d2df; border-radius: 12px; background: #fff;
    > .ol-icon { color: var(--ol-mute); }
    input { flex: 1; min-width: 0; width: 0; height: 52px; border: 0; outline: none; font-size: 16px; background: none; }
    .ol-btn { min-height: 40px; }
  }
  &__drop { margin-top: 10px; display: grid; gap: 2px; max-height: 60vh; overflow: auto; }
  &__hit { display: flex; align-items: center; gap: 14px; padding: 8px; border-radius: 10px;
    img { width: 48px; height: 48px; object-fit: contain; border: 1px solid var(--ol-line); border-radius: 8px; flex: none; }
    span { flex: 1; min-width: 0; display: grid; font-weight: 600; color: var(--ol-ink); small { font-weight: 400; color: var(--ol-mute); } }
    b { white-space: nowrap; color: var(--ol-ink); }
    &:hover { background: var(--ol-surf); }
  }
  &__none { padding: 12px 8px; color: var(--ol-mute); }
}

/* ---- подвал ---- */
.ol-foot { margin-top: 0; padding: 56px 0 120px; background: var(--ol-surf); border-top: 1px solid var(--ol-line); font-size: 14.5px;
  &__grid { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1.2fr; gap: 32px; }
  h3 { font-size: 16px; margin-bottom: 12px; }
  nav { display: grid; align-content: start; gap: 7px; a { color: var(--ol-text); &:hover { color: var(--ol-acc); } } }
  &__brand { display: grid; align-content: start; gap: 14px; img { width: 190px; height: auto; mix-blend-mode: multiply; } p { color: var(--ol-mute); max-width: 300px; } }
  &__soc { display: flex; gap: 8px; a { padding: 7px 12px; border-radius: 9px; background: #fff; border: 1px solid var(--ol-line); font-weight: 600; font-size: 13.5px; color: var(--ol-ink); &:hover { border-color: var(--ol-acc); color: var(--ol-acc); } } }
  &__contacts { display: grid; align-content: start; gap: 6px; p { color: var(--ol-mute); } a:hover { color: var(--ol-acc); } .ol-btn { justify-self: start; margin-top: 8px; } }
  &__phone { font-weight: 700; font-size: 16px; color: var(--ol-ink); }
  &__legal { display: grid; gap: 6px; margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--ol-line); font-size: 12.5px; color: var(--ol-mute); a { text-decoration: underline; } }
}

/* ---- нижняя панель, плавающие кнопки ---- */
.ol-tabbar { display: none; }
.ol .ol-chatbtn, .ol .ol-chatbtn:focus { position: fixed; right: 24px; bottom: 24px; z-index: 50; display: inline-flex; align-items: center; gap: 8px; height: 50px; padding: 0 20px; border: 0; border-radius: 25px; background: var(--ol-ink); color: #fff; font-weight: 700; box-shadow: 0 10px 30px rgb(14 28 61 / .28); &:hover { background: #1d2c52; } }
.ol .ol-topbtn, .ol .ol-topbtn:focus { position: fixed; right: 24px; bottom: 86px; z-index: 50; width: 46px; height: 46px; display: grid; place-items: center; border: 1px solid var(--ol-line); border-radius: 50%; background: #fff; color: var(--ol-ink); box-shadow: 0 6px 18px rgb(14 28 61 / .14); .ol-icon { transform: rotate(180deg); } }

/* ---- меню, окна, тост ---- */
.ol-drawer { position: fixed; inset: 0; z-index: 90; background: rgb(14 28 61 / .4);
  &__panel { position: absolute; left: 0; top: 0; bottom: 0; width: min(400px, 92vw); display: flex; flex-direction: column; background: #fff; overflow-y: auto; }
  &__head { position: sticky; top: 0; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; background: #fff; border-bottom: 1px solid var(--ol-line); }
  &__list { display: grid; padding: 8px 12px; }
  &__row { display: flex; align-items: center; gap: 6px; }
  &__sec { flex: 1; display: flex; align-items: center; gap: 12px; padding: 8px 6px; border-radius: 10px; font-weight: 600; color: var(--ol-ink);
    img { width: 40px; height: 40px; object-fit: contain; border: 1px solid var(--ol-line); border-radius: 8px; }
    &--hot { color: var(--ol-acc); padding: 12px 6px; }
  }
  &__more, &__more:focus { width: 40px; height: 40px; display: grid; place-items: center; border: 0; border-radius: 10px; background: var(--ol-surf); color: var(--ol-ink); }
  &__subs { display: grid; padding: 0 0 6px 58px; a { padding: 7px 0; color: var(--ol-text); } }
  &__link { padding: 13px 6px; border-bottom: 1px solid var(--ol-line); font-weight: 600; color: var(--ol-ink); &--hot { color: var(--ol-acc); } }
  &__det { border-bottom: 1px solid var(--ol-line);
    summary { display: flex; justify-content: space-between; align-items: center; padding: 13px 6px; font-weight: 600; color: var(--ol-ink); list-style: none; cursor: pointer; &::-webkit-details-marker { display: none; } }
    &[open] summary .ol-icon { transform: rotate(180deg); }
    a { display: block; padding: 8px 6px 8px 18px; color: var(--ol-text); }
  }
  &__foot { display: grid; gap: 6px; margin-top: auto; padding: 18px; background: var(--ol-surf); p { font-weight: 700; color: var(--ol-ink); } a { font-weight: 600; } }
  &__btns { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
}
.ol-modal { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 16px; background: rgb(14 28 61 / .45); overflow-y: auto;
  &__box { position: relative; width: min(460px, 100%); padding: 28px; box-sizing: border-box; border-radius: 20px; background: #fff; display: grid; gap: 16px;
    h2 { font-size: 24px; padding-right: 40px; }
  }
  &__x { position: absolute; top: 16px; right: 16px; }
  &__lead { color: var(--ol-mute); margin-top: -6px; }
}
.ol-quick { display: flex; gap: 14px; align-items: center; padding: 12px; border-radius: 12px; background: var(--ol-surf);
  img { width: 72px; height: 72px; object-fit: contain; background: #fff; border-radius: 10px; flex: none; }
  div { display: grid; gap: 4px; min-width: 0; } b { color: var(--ol-ink); line-height: 1.3; } span { color: var(--ol-mute); font-size: 14px; } strong { color: var(--ol-ink); }
}
.ol-done { display: grid; justify-items: center; gap: 12px; text-align: center; padding: 8px 0;
  &__ic { width: 60px; height: 60px; display: grid; place-items: center; border-radius: 50%; background: var(--ol-soft); color: var(--ol-acc); .ol-icon { width: 30px; height: 30px; } }
  h2 { padding: 0 !important; } p { color: var(--ol-mute); }
}
.ol-toast { position: fixed; left: 50%; bottom: 28px; z-index: 110; transform: translateX(-50%); display: flex; align-items: center; gap: 12px; max-width: calc(100vw - 32px); padding: 12px 18px; box-sizing: border-box; border-radius: 14px; background: var(--ol-ink); color: #fff; font-size: 14.5px; box-shadow: 0 12px 34px rgb(14 28 61 / .3);
  .ol-icon { color: var(--ol-hi); }
  span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  a { flex: none; padding: 6px 12px; border-radius: 9px; background: var(--ol-acc); font-weight: 700; white-space: nowrap; }
}
.ol-fade-enter-active, .ol-fade-leave-active { transition: opacity .2s; }
.ol-fade-enter-from, .ol-fade-leave-to { opacity: 0; }

@media (max-width: 1520px) {
  .ol-wrap { max-width: 1280px; }
}
@media (max-width: 1400px) {
  .ol-nav__link { padding: 10px 8px; font-size: 14px; }
  .ol-bar__in { gap: 14px; }
  .ol-logo img { width: 164px; }
  .ol-cartbtn { width: 46px; padding: 0; justify-content: center; span { display: none; } i { left: auto; right: -6px; } }
}
@media (max-width: 1199px) {
  .ol-nav { display: none; }
  .ol-bar__burger, .ol-bar__burger:focus { display: grid; }
  .ol-strip__mail { display: none !important; }
  .ol .ol-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .ol-foot__grid { grid-template-columns: 1fr 1fr; }
  .ol-cartbtn { width: 160px; padding: 0 14px; justify-content: flex-start; span { display: inline; } i { left: 26px; right: auto; } }
}
@media (max-width: 989px) {
  .ol-strip__soc, .ol-strip__orders span { display: none; }
  .ol .ol-title { font-size: 32px; }
  .ol .ol-partners { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 768px) {
  .ol { --ol-bar: 64px; }
  .ol-wrap { padding-left: 16px; padding-right: 16px; }
  .ol-strip__phones a + a, .ol-strip__orders span { display: none; }
  .ol-strip__in { gap: 14px; min-height: 38px; }
  .ol-strip__call { margin-left: 0; }
  .ol-logo img { width: 140px; }
  .ol .ol-tool--user, .ol-tools .ol-tool:nth-child(3) { display: none; }
  .ol-cartbtn { width: 46px; padding: 0; justify-content: center; span { display: none; } i { left: auto; right: -6px; } }
  .ol .ol-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .ol .ol-sec { padding-top: 48px; }
  .ol .ol-head h2 { font-size: 24px; }
  .ol .ol-title { font-size: 27px; }
  .ol .ol-lead { font-size: 16px; }
  .ol .ol-optform { grid-template-columns: minmax(0, 1fr); .ol-btn { justify-self: stretch; } }
  .ol-foot { padding-bottom: 100px; }
  .ol-tabbar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 70; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); padding: 6px 4px calc(6px + env(safe-area-inset-bottom)); background: #fff; border-top: 1px solid var(--ol-line); box-shadow: 0 -6px 20px rgb(14 28 61 / .06);
    > a, > button { position: relative; display: grid; justify-items: center; gap: 2px; padding: 4px 0; border: 0; background: none; font-size: 11px; font-weight: 600; color: var(--ol-mute); min-width: 0;
      .ol-icon { width: 23px; height: 23px; }
      span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      i { position: absolute; top: 0; left: calc(50% + 4px); min-width: 17px; height: 17px; padding: 0 4px; box-sizing: border-box; border-radius: 9px; background: var(--ol-hi); color: #fff; font: 700 10.5px/17px var(--ol-font); font-style: normal; }
      &.is-on { color: var(--ol-acc); }
    }
  }
  .ol-tabbar__sum { font-variant-numeric: tabular-nums; }
  .ol .ol-chatbtn, .ol .ol-chatbtn:focus { right: 14px; bottom: 82px; height: 46px; width: 46px; padding: 0; justify-content: center; span { display: none; } }
  .ol .ol-topbtn, .ol .ol-topbtn:focus { right: 14px; bottom: 138px; width: 42px; height: 42px; }
  .ol-toast { bottom: 84px; }
  .ol .ol-partners li { height: 76px; padding: 0 12px; }
}
@media (max-width: 576px) {
  .ol-strip__phones { margin-left: 0; }
  .ol-strip__orders { display: none !important; }
  .ol-strip__in { justify-content: space-between; }
  .ol .ol-partners { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ol-foot__grid { grid-template-columns: 1fr; gap: 26px; }
  .ol-modal__box { padding: 22px 18px; }
  .ol .ol-panel { padding: 18px; }
  .ol-toast a { display: none; }
}
@media (max-width: 375px) {
  .ol-logo img { width: 124px; }
  .ol-bar__in { gap: 10px; }
  .ol .ol-grid { gap: 8px; }
}
</style>
