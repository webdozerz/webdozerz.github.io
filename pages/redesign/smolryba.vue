<script lang="ts" setup>
import { SR_DATE, SR_ORIG, SR_XLSX, srAsset, srContacts, srMenu, srNowStatus, srPath, srRub0 } from '~/utils/smolryba'
import { useSrList, useSrUi } from '~/composables/useSmolryba'
import SrIcon from '~/components/redesign/smolryba/SrIcon.vue'
import SrPhone from '~/components/redesign/smolryba/SrPhone.vue'

const route = useRoute()
const list = useSrList()
const ui = useSrUi()

useSeoMeta({
  title: 'Рыбная база — рыба, морепродукты и икра оптом и в розницу, Смоленск | Концепт редизайна',
  description:
    'Концепт редизайна смолрыба.рф: прайс на сегодня прямо на первом экране — поиск по 259 позициям, цена за кг и за коробку, список заказа с готовым сообщением в MAX, Telegram или на почту.',
  ogTitle: 'Рыбная база — концепт редизайна',
  ogDescription: 'Рыба, морепродукты и икра оптом и в розницу со склада в Смоленске: найдите позицию в прайсе за секунду и соберите заказ коробками.',
  ogImage: 'https://andryushov.me/redesign/smolryba/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { lang: 'ru' },
  link: [
    { rel: 'icon', type: 'image/png', href: srAsset('fav.png') },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap',
    },
  ],
})

const year = new Date().getFullYear()
const to = (p: string) => srPath(p)
const isOn = (p: string) => !p.includes('#') && route.path.replace(/\/$/, '') === srPath(p).replace(/\/$/, '')

// часы склада по Москве — обновляем раз в минуту
const status = ref({ open: false, text: 'Пн–Пт 8–17, Сб 9–13' })
let tick: ReturnType<typeof setInterval> | undefined

// Курсы ЦБ в подвале, как у оригинала (у них — свой запрос, здесь — открытый JSON ЦБ)
const rates = ref<{ c: string; v: string; d: number }[]>([])
const loadRates = async () => {
  try {
    const r = await fetch('https://www.cbr-xml-daily.ru/daily_json.js').then((x) => x.json())
    rates.value = ['USD', 'EUR'].map((c) => {
      const o = r.Valute[c]
      return { c, v: o.Value.toFixed(2).replace('.', ','), d: ((o.Value - o.Previous) / o.Previous) * 100 }
    })
  } catch {}
}

const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 560)

// «Перезвоните мне» — форма оригинала (у них спрятана), здесь демо
const call = reactive({ name: '', phone: '', ok: true, done: false })
const sendCall = () => {
  if (call.phone.replace(/\D/g, '').length < 11 || !call.ok) return
  call.done = true
}
const closeModal = () => {
  ui.modal.value = null
  call.done = false
}

let toastTimer: ReturnType<typeof setTimeout> | undefined
watch(
  () => list.toast.value?.id,
  () => {
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => (list.toast.value = null), 3400)
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
    ui.modal.value = null
    ;(document.activeElement as HTMLElement | null)?.blur?.()
  },
)
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal()
    ui.menu.value = false
  }
}

onMounted(() => {
  list.persist()
  status.value = srNowStatus()
  tick = setInterval(() => (status.value = srNowStatus()), 60000)
  onScroll()
  loadRates()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  clearInterval(tick)
  clearTimeout(toastTimer)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div class="sr">
    <div class="sr-concept">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="SR_ORIG" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <!-- служебная строка уезжает -->
    <div class="sr-strip">
      <div class="sr-wrap sr-strip__in">
        <span class="sr-strip__item sr-strip__addr"><SrIcon name="pin" />{{ srContacts.address }}</span>
        <span class="sr-strip__item" :class="{ 'is-open': status.open }"><SrIcon name="clock" /><span class="sr-strip__long">Пн–Пт 8–17, Сб 9–13 · </span>{{ status.text }}</span>
        <a class="sr-strip__item sr-strip__mail" :href="`mailto:${srContacts.email}`"><SrIcon name="mail" />{{ srContacts.email }}</a>
        <a class="sr-strip__item sr-strip__xlsx" :href="SR_XLSX" download><SrIcon name="download" />Прайс на {{ SR_DATE }}, .xlsx</a>
      </div>
    </div>

    <header class="sr-head">
      <div class="sr-wrap sr-head__in sr-header__row">
        <button type="button" class="sr-iconbtn sr-head__burger" aria-label="Меню" @click="ui.menu.value = true"><SrIcon name="menu" /></button>
        <NuxtLink :to="to('/')" class="sr-logo" aria-label="Рыбная база — на главную"><span class="sr-logo__img" /></NuxtLink>
        <nav class="sr-nav" aria-label="Меню">
          <NuxtLink v-for="m in srMenu" :key="m.label" :to="to(m.to)" class="sr-nav__a" :class="{ 'is-on': isOn(m.to) }">{{ m.label }}</NuxtLink>
        </nav>
        <div class="sr-head__right">
          <a class="sr-iconbtn sr-head__msg" :href="srContacts.tg" target="_blank" rel="noopener" aria-label="Telegram"><span class="sr-mask" :style="{ '--m': `url(${srAsset('icons/tg.svg')})` }" /></a>
          <a class="sr-iconbtn sr-head__msg" :href="srContacts.max" target="_blank" rel="noopener" aria-label="MAX"><span class="sr-mask" :style="{ '--m': `url(${srAsset('icons/max.svg')})` }" /></a>
          <div class="sr-head__phone">
            <a :href="`tel:${srContacts.phones[0].tel}`">{{ srContacts.phones[0].text }}</a>
            <button type="button" @click="ui.modal.value = 'call'">Перезвоните мне</button>
          </div>
          <a class="sr-iconbtn sr-head__call" :href="`tel:${srContacts.phones[0].tel}`" aria-label="Позвонить"><SrIcon name="phone" /></a>
          <NuxtLink :to="to('/spisok/')" class="sr-btn sr-head__list">
            <SrIcon name="list" /><span class="sr-head__listlabel">Список</span><b v-if="list.count.value">{{ list.count.value }}</b>
          </NuxtLink>
        </div>
      </div>
    </header>
    <!-- на телефоне меню оригинала — лентой под шапкой, не только в бургере -->
    <nav class="sr-mnav" aria-label="Меню">
      <NuxtLink v-for="m in srMenu" :key="m.label" :to="to(m.to)" :class="{ 'is-on': isOn(m.to) }">{{ m.label }}</NuxtLink>
    </nav>

    <main class="sr-main">
      <NuxtPage />
    </main>

    <footer class="sr-foot">
      <div class="sr-wrap sr-foot__in">
        <div class="sr-foot__brand">
          <NuxtLink :to="to('/')" class="sr-logo" aria-label="Рыбная база"><span class="sr-logo__img" /></NuxtLink>
          <p>Рыба, морепродукты и икра оптом и в розницу по самым низким ценам со склада в Смоленске.</p>
          <div v-if="rates.length" class="sr-foot__rates" aria-label="Курсы ЦБ">
            <span v-for="r in rates" :key="r.c">{{ r.c }} {{ r.v }} ₽ <i :class="r.d >= 0 ? 'is-up' : 'is-down'">{{ r.d >= 0 ? '▲' : '▼' }} {{ Math.abs(r.d).toFixed(2).replace('.', ',') }}%</i></span>
          </div>
        </div>
        <nav class="sr-foot__nav" aria-label="Меню в подвале">
          <NuxtLink v-for="m in srMenu" :key="m.label" :to="to(m.to)">{{ m.label }}</NuxtLink>
          <NuxtLink :to="to('/spisok/')">Список заказа</NuxtLink>
        </nav>
        <div class="sr-foot__contacts">
          <a v-for="p in srContacts.phones" :key="p.tel" :href="`tel:${p.tel}`">{{ p.text }}</a>
          <a :href="`mailto:${srContacts.email}`">{{ srContacts.email }}</a>
          <span>{{ srContacts.address }}</span>
          <span>Пн–Пт 8–17, Сб 9–13</span>
          <div class="sr-foot__msg">
            <a :href="srContacts.tg" target="_blank" rel="noopener"><span class="sr-mask" :style="{ '--m': `url(${srAsset('icons/tg.svg')})` }" />Telegram</a>
            <a :href="srContacts.max" target="_blank" rel="noopener"><span class="sr-mask" :style="{ '--m': `url(${srAsset('icons/max.svg')})` }" />MAX</a>
          </div>
        </div>
      </div>
      <div class="sr-wrap sr-foot__legal">
        <span>© {{ year }} Концепт редизайна. Тексты, цены, логотип и изображения принадлежат ГК «Рыбная база» и используются для демонстрации.</span>
        <a :href="SR_ORIG + 'privacy'" target="_blank" rel="noopener">Политика обработки персональных данных</a>
      </div>
    </footer>

    <!-- плавающая «Позвонить» оригинала (десктоп) и нижняя панель (телефон) -->
    <a class="sr-float" :class="{ 'is-on': scrolled }" :href="`tel:${srContacts.phones[0].tel}`"><SrIcon name="phone" />Позвонить</a>
    <nav class="sr-bar" aria-label="Быстрые действия">
      <NuxtLink :to="to('/price/')" :class="{ 'is-on': isOn('/price/') }"><SrIcon name="sheet" />Прайс</NuxtLink>
      <NuxtLink :to="to('/spisok/')" :class="{ 'is-on': isOn('/spisok/') }">
        <span class="sr-bar__ico"><SrIcon name="list" /><b v-if="list.count.value">{{ list.count.value }}</b></span>
        {{ list.count.value ? srRub0(list.total.value.sum) : 'Список' }}
      </NuxtLink>
      <a :href="`tel:${srContacts.phones[0].tel}`"><SrIcon name="phone" />Позвонить</a>
      <a :href="srContacts.max" target="_blank" rel="noopener"><span class="sr-mask" :style="{ '--m': `url(${srAsset('icons/max.svg')})` }" />MAX</a>
    </nav>

    <!-- бургер -->
    <div v-if="ui.menu.value" class="sr-drawer" @click.self="ui.menu.value = false">
      <div class="sr-drawer__panel">
        <div class="sr-drawer__top">
          <span class="sr-logo"><span class="sr-logo__img" /></span>
          <button type="button" class="sr-iconbtn" aria-label="Закрыть меню" @click="ui.menu.value = false"><SrIcon name="close" /></button>
        </div>
        <NuxtLink v-for="m in srMenu" :key="m.label" :to="to(m.to)" class="sr-drawer__a">{{ m.label }}<SrIcon name="right" /></NuxtLink>
        <NuxtLink :to="to('/spisok/')" class="sr-drawer__a">Список заказа<SrIcon name="right" /></NuxtLink>
        <div class="sr-drawer__contacts">
          <a v-for="p in srContacts.phones" :key="p.tel" :href="`tel:${p.tel}`">{{ p.text }}</a>
          <a :href="`mailto:${srContacts.email}`">{{ srContacts.email }}</a>
          <span>{{ srContacts.address }}</span>
          <span :class="{ 'is-open': status.open }">Пн–Пт 8–17, Сб 9–13 · {{ status.text }}</span>
        </div>
        <div class="sr-drawer__btns">
          <button type="button" class="sr-btn" @click="ui.menu.value = false; ui.modal.value = 'call'">Перезвоните мне</button>
          <a class="sr-btn sr-btn--line" :href="SR_XLSX" download><SrIcon name="download" />Прайс .xlsx</a>
        </div>
      </div>
    </div>

    <!-- «Перезвоните мне» -->
    <div v-if="ui.modal.value === 'call'" class="sr-modal" role="dialog" aria-modal="true" aria-label="Перезвоните мне" @click.self="closeModal">
      <div class="sr-modal__box">
        <button type="button" class="sr-iconbtn sr-modal__x" aria-label="Закрыть" @click="closeModal"><SrIcon name="close" /></button>
        <template v-if="!call.done">
          <h2>Перезвоните мне</h2>
          <p class="sr-modal__lead">Менеджер перезвонит в рабочее время: пн–пт 8–17, сб 9–13.</p>
          <form class="sr-form" @submit.prevent="sendCall">
            <label class="sr-field"><span>Имя</span><input v-model="call.name" autocomplete="name" placeholder="Как к вам обращаться" /></label>
            <label class="sr-field"><span>Телефон</span><SrPhone v-model="call.phone" /></label>
            <label class="sr-check"><input v-model="call.ok" type="checkbox" /><span>Я соглашаюсь с политикой обработки персональных данных</span></label>
            <button type="submit" class="sr-btn sr-btn--wide" :disabled="call.phone.replace(/\D/g, '').length < 11 || !call.ok">Отправить</button>
          </form>
        </template>
        <div v-else class="sr-done">
          <span class="sr-done__ico"><SrIcon name="check" /></span>
          <h2>Заявка принята</h2>
          <p>Это демо: в концепте заявка никуда не уходит. На настоящем сайте она придёт менеджеру на почту {{ srContacts.email }}.</p>
          <button type="button" class="sr-btn" @click="closeModal">Хорошо</button>
        </div>
      </div>
    </div>

    <Transition name="sr-toast">
      <div v-if="list.toast.value" :key="list.toast.value.id" class="sr-toast" role="status">
        <span>{{ list.toast.value.text }}</span>
        <NuxtLink v-if="list.toast.value.link" :to="to('/spisok/')">Список · {{ list.count.value }}</NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.sr {
  --sr-acc: #18758f; --sr-acc-d: #105e74; --sr-sea: #63aac0; --sr-aqua: #68c6d5;
  --sr-ink: #052f45; --sr-navy: #003553; --sr-text: #24394a; --sr-mute: #5d7180;
  --sr-line: #dde8ec; --sr-surf: #eef5f7; --sr-soft: #dcf0f5; --sr-sun: #ffe7b8; --sr-green: #23824a;
  --sr-head: 'IBM Plex Sans Condensed', 'IBM Plex Sans', system-ui, sans-serif;
  --sr-font: 'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --sr-r: 12px; --sr-R: 24px; --sr-hh: 76px;
  min-height: 100vh; background: #fff; color: var(--sr-text); font: 400 15px/1.55 var(--sr-font); -webkit-font-smoothing: antialiased;
}
html:has(.sr) { scroll-padding-top: 96px; scroll-behavior: smooth; }
:where(.sr) { p, h1, h2, h3, h4, dl, dd, figure { margin: 0; } a { color: inherit; text-decoration: none; } img { max-width: 100%; }
  button, input, select, textarea { font: inherit; color: inherit; } button { cursor: pointer; }
  h1, h2, h3 { color: var(--sr-ink); font-family: var(--sr-head); font-weight: 700; line-height: 1.1; letter-spacing: -.01em; }
}
.sr ul[class] { list-style: none; }
.sr-wrap { max-width: 1400px; margin: 0 auto; padding-left: 32px; padding-right: 32px; box-sizing: border-box; }
.sr-main { display: block; min-height: 50vh; }
.sr-icon { width: 20px; height: 20px; flex: none; }
.sr-mask { display: inline-block; width: 22px; height: 22px; flex: none; background: currentColor; -webkit-mask: var(--m) center / contain no-repeat; mask: var(--m) center / contain no-repeat; }
.sr-rows { container: srlist / inline-size; }

.sr-concept { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 12px; padding: 8px 16px; font-size: 13px; line-height: 1.4; text-align: center; background: var(--sr-navy); color: #c9dce5;
  a { color: #fff; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
}

/* ---- кнопки, поля ---- */
.sr .sr-btn, .sr .sr-btn:focus { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 20px; border: 1px solid var(--sr-acc); border-radius: var(--sr-r); background: var(--sr-acc); color: #fff; font-weight: 600; font-size: 15px; white-space: nowrap; box-sizing: border-box; transition: background-color .15s, border-color .15s, color .15s;
  &:hover { background: var(--sr-acc-d); border-color: var(--sr-acc-d); }
  &:disabled { opacity: .5; cursor: not-allowed; }
  .sr-icon { width: 18px; height: 18px; }
}
.sr .sr-btn--line, .sr .sr-btn--line:focus, .sr .sr-btn--line:active { background: #fff; color: var(--sr-acc-d); border-color: #b9d9e2;
  &:hover { background: var(--sr-soft); border-color: var(--sr-acc); color: var(--sr-acc-d); }
}
.sr .sr-btn--soft, .sr .sr-btn--soft:focus { background: var(--sr-soft); border-color: var(--sr-soft); color: var(--sr-acc-d); &:hover { background: #c9e7ef; border-color: #c9e7ef; } }
.sr .sr-btn--wide { width: 100%; }
.sr .sr-iconbtn, .sr .sr-iconbtn:focus { display: inline-grid; place-items: center; width: 42px; height: 42px; padding: 0; border: 0; border-radius: 50%; background: var(--sr-surf); color: var(--sr-navy); flex: none; transition: background-color .15s, color .15s;
  &:hover { background: var(--sr-soft); color: var(--sr-acc); }
}
.sr-field { display: grid; gap: 6px; align-content: start; font-size: 13px; color: var(--sr-mute); font-weight: 500;
  input, select, textarea { width: 100%; min-height: 46px; padding: 10px 14px; border: 1px solid #cfdfe5; border-radius: var(--sr-r); background: #fff; color: var(--sr-ink); font-size: 15px; box-sizing: border-box; outline: none; transition: border-color .15s, box-shadow .15s;
    &:focus { border-color: var(--sr-acc); box-shadow: 0 0 0 3px rgba(24, 117, 143, .15); }
  }
  textarea { min-height: 92px; resize: vertical; }
}
.sr-check { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--sr-mute); line-height: 1.45; cursor: pointer;
  input { width: 18px; height: 18px; min-height: 0; margin: 1px 0 0; padding: 0; accent-color: var(--sr-acc); flex: none; }
}
.sr-form { display: grid; gap: 14px; }

/* счётчик — общий для строк прайса и списка */
.sr .sr-qty { display: inline-flex; align-items: center; gap: 2px; height: 44px; padding: 0 4px; border-radius: var(--sr-r); background: var(--sr-soft); color: var(--sr-ink); box-sizing: border-box;
  button, button:focus { display: grid; place-items: center; width: 36px; height: 36px; padding: 0; border: 0; border-radius: 9px; background: transparent; color: var(--sr-acc-d); }
  button:hover { background: #fff; }
  .sr-icon { width: 18px; height: 18px; }
  label { display: flex; align-items: baseline; justify-content: center; min-width: 64px; padding: 0 6px; cursor: text; }
  input { min-width: 1.6ch; padding: 0; border: 0; background: transparent; font-weight: 700; font-size: 16px; text-align: center; outline: none; font-variant-numeric: tabular-nums; }
  span { margin-left: 4px; color: var(--sr-mute); font-size: 13px; white-space: nowrap; }
}

/* заголовки секций */
.sr-sec { padding-top: 72px; padding-bottom: 8px; }
.sr-sec__head { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 12px 24px; margin-bottom: 28px;
  h2 { font-size: clamp(28px, 3vw, 40px); }
  p { max-width: 560px; margin-top: 10px; color: var(--sr-mute); }
}
.sr-link { display: inline-flex; align-items: center; gap: 6px; color: var(--sr-acc); font-weight: 600; white-space: nowrap; .sr-icon { width: 18px; height: 18px; } &:hover { color: var(--sr-acc-d); } }

/* ---- служебная строка ---- */
.sr-strip { border-bottom: 1px solid var(--sr-line); font-size: 13px; color: var(--sr-mute); }
.sr-strip__in { display: flex; align-items: center; gap: 8px 26px; min-height: 40px; }
.sr-strip__item { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; .sr-icon { width: 16px; height: 16px; color: var(--sr-acc); }
  &.is-open { color: var(--sr-green); .sr-icon { color: var(--sr-green); } }
}
a.sr-strip__item:hover { color: var(--sr-acc); }
.sr-strip__xlsx { margin-left: auto; color: var(--sr-acc-d); font-weight: 600; }

/* ---- шапка H18 ---- */
.sr-head { position: sticky; top: 0; z-index: 40; background: rgba(255, 255, 255, .96); backdrop-filter: blur(8px); border-bottom: 1px solid var(--sr-line); }
.sr-head__in { display: flex; align-items: center; gap: 20px; height: var(--sr-hh); }
.sr-logo { display: inline-flex; flex: none; color: var(--sr-navy); }
.sr-logo__img { display: block; width: 158px; height: 43px; background: currentColor; -webkit-mask: url('/redesign/smolryba/logo.png') center / contain no-repeat; mask: url('/redesign/smolryba/logo.png') center / contain no-repeat; }
.sr-nav { display: flex; align-items: center; gap: 2px; margin: 0 auto; padding: 4px; border-radius: 999px; background: var(--sr-surf); }
.sr-nav__a { padding: 9px 12px; border-radius: 999px; font: 500 15px/1.2 var(--sr-head); color: var(--sr-navy); white-space: nowrap; transition: background-color .15s, color .15s;
  &:hover { background: #fff; color: var(--sr-acc); }
  &.is-on { background: var(--sr-acc); color: #fff; }
}
.sr-head__right { display: flex; align-items: center; gap: 8px; flex: none; }
.sr-head__msg .sr-mask { width: 22px; height: 22px; }
.sr-head__phone { display: grid; justify-items: start; margin: 0 6px 0 4px; line-height: 1.2;
  a { color: var(--sr-ink); font: 700 17px/1.2 var(--sr-head); white-space: nowrap; &:hover { color: var(--sr-acc); } }
  button, button:focus { padding: 0; border: 0; background: none; color: var(--sr-acc); font-size: 13px; font-weight: 500; border-bottom: 1px dashed currentColor; }
}
.sr-head__call { display: none !important; }
.sr-head__burger { display: none !important; }
.sr .sr-head__list { min-width: 118px; padding: 0 16px;
  b { display: grid; place-items: center; min-width: 22px; height: 22px; padding: 0 6px; border-radius: 11px; background: #fff; color: var(--sr-acc-d); font-size: 12px; box-sizing: border-box; }
}
.sr-mnav { display: none; }

/* ---- подвал ---- */
.sr-foot { margin-top: 96px; background: var(--sr-surf); }
.sr-foot__in { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 32px 48px; padding-top: 48px; padding-bottom: 32px; }
.sr-foot__brand { display: grid; gap: 14px; align-content: start; p { max-width: 380px; color: var(--sr-mute); } }
.sr-foot__rates { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 13px; color: var(--sr-text); font-variant-numeric: tabular-nums;
  i { font-style: normal; margin-left: 4px; &.is-up { color: var(--sr-green); } &.is-down { color: #b03a2e; } }
}
.sr-foot__nav, .sr-foot__contacts { display: grid; gap: 8px; align-content: start; a:hover { color: var(--sr-acc); } }
.sr-foot__nav a { font: 500 16px/1.4 var(--sr-head); color: var(--sr-navy); }
.sr-foot__contacts { color: var(--sr-mute); a { color: var(--sr-ink); font-weight: 500; } }
.sr-foot__msg { display: flex; gap: 10px; margin-top: 6px;
  a { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; background: #fff; color: var(--sr-navy) !important; font-weight: 500; }
  .sr-mask { width: 18px; height: 18px; color: var(--sr-acc); }
}
.sr-foot__legal { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px; padding-top: 18px; padding-bottom: 28px; padding-right: 200px; border-top: 1px solid var(--sr-line); font-size: 13px; color: var(--sr-mute);
  a { text-decoration: underline; text-underline-offset: 3px; &:hover { color: var(--sr-acc); } }
}

/* ---- плавающее и нижняя панель ---- */
.sr-float { position: fixed; right: 24px; bottom: 24px; z-index: 30; display: inline-flex; align-items: center; gap: 8px; height: 52px; padding: 0 22px 0 18px; border-radius: 999px; background: var(--sr-acc); color: #fff !important; font-weight: 600; box-shadow: 0 8px 24px rgba(0, 53, 83, .25); opacity: 0; transform: translateY(12px); pointer-events: none; transition: opacity .2s, transform .2s, background-color .15s;
  &.is-on { opacity: 1; transform: none; pointer-events: auto; }
  &:hover { background: var(--sr-acc-d); }
}
.sr-bar { display: none; }

/* ---- бургер, модалка, тост ---- */
.sr-drawer { position: fixed; inset: 0; z-index: 60; background: rgba(0, 30, 48, .45); }
.sr-drawer__panel { display: flex; flex-direction: column; gap: 2px; width: min(380px, 100%); height: 100%; padding: 14px 20px 24px; background: #fff; overflow-y: auto; box-sizing: border-box; }
.sr-drawer__top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.sr-drawer__a { display: flex; align-items: center; justify-content: space-between; padding: 13px 4px; border-bottom: 1px solid var(--sr-line); font: 600 18px/1.3 var(--sr-head); color: var(--sr-ink); .sr-icon { color: var(--sr-acc); } }
.sr-drawer__contacts { display: grid; gap: 6px; margin-top: 18px; color: var(--sr-mute); a { color: var(--sr-ink); font-weight: 600; } .is-open { color: var(--sr-green); } }
.sr-drawer__btns { display: grid; gap: 10px; margin-top: 20px; }
.sr-modal { position: fixed; inset: 0; z-index: 70; display: grid; place-items: center; padding: 16px; background: rgba(0, 30, 48, .5); }
.sr-modal__box { position: relative; width: min(440px, 100%); max-height: calc(100vh - 32px); overflow-y: auto; padding: 32px; border-radius: var(--sr-R); background: #fff; box-sizing: border-box;
  h2 { font-size: 28px; padding-right: 40px; }
}
.sr-modal__x { position: absolute; top: 16px; right: 16px; }
.sr-modal__lead { margin: 8px 0 20px; color: var(--sr-mute); }
.sr-done { display: grid; gap: 12px; justify-items: start; p { color: var(--sr-mute); } }
.sr-done__ico { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; background: #e2f3e8; color: var(--sr-green); .sr-icon { width: 26px; height: 26px; } }
.sr-toast { position: fixed; left: 50%; bottom: 28px; z-index: 80; display: flex; align-items: center; gap: 16px; max-width: calc(100vw - 32px); padding: 12px 14px 12px 18px; border-radius: 14px; background: var(--sr-navy); color: #fff; font-size: 14px; transform: translateX(-50%); box-shadow: 0 10px 30px rgba(0, 30, 48, .3); box-sizing: border-box;
  span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  a { flex: none; padding: 6px 12px; border-radius: 9px; background: #fff; color: var(--sr-navy); font-weight: 600; white-space: nowrap; }
}
.sr-toast-enter-active, .sr-toast-leave-active { transition: opacity .2s, transform .2s; }
.sr-toast-enter-from, .sr-toast-leave-to { opacity: 0; transform: translate(-50%, 10px); }

/* ---- адаптив ---- */
@media (max-width: 1400px) {
  .sr-head__phone { display: none; }
  .sr-head__call { display: inline-grid !important; }
  .sr-head__msg { display: none !important; }
  .sr-nav__a { padding: 9px 10px; }
}
@media (max-width: 1199px) {
  .sr-strip__mail { display: none; }
  .sr-head__in { gap: 14px; }
  .sr-logo__img { width: 136px; height: 37px; }
  .sr-nav__a { padding: 8px 10px; font-size: 14px; }
  .sr .sr-head__list { min-width: 0; padding: 0 12px; }
  .sr-head__listlabel { display: none; }
}
@media (max-width: 989px) {
  .sr { --sr-hh: 64px; }
  .sr-nav { display: none; }
  .sr-strip__addr { display: none; }
  .sr-head__burger { display: inline-grid !important; }
  .sr-head__right { margin-left: auto; }
  .sr-mnav { display: flex; gap: 6px; padding: 10px 32px; overflow-x: auto; scrollbar-width: none; border-bottom: 1px solid var(--sr-line);
    &::-webkit-scrollbar { display: none; }
    a { flex: none; padding: 7px 14px; border-radius: 999px; background: var(--sr-surf); color: var(--sr-navy); font: 500 14px/1.2 var(--sr-head); white-space: nowrap; &.is-on { background: var(--sr-acc); color: #fff; } }
  }
  .sr-foot__in { grid-template-columns: 1fr 1fr; .sr-foot__brand { grid-column: 1 / -1; } }
}
@media (max-width: 768px) {
  .sr-wrap { padding-left: 20px; padding-right: 20px; }
  .sr-mnav { padding-left: 20px; padding-right: 20px; }
  .sr-strip__addr, .sr-strip__xlsx { display: none; }
  .sr-strip__in { justify-content: center; min-height: 34px; }
  .sr-head__list { display: none !important; }
  .sr-float { display: none; }
  .sr-sec { padding-top: 52px; }
  .sr-foot { margin-top: 64px; padding-bottom: 72px; }
  .sr-foot__legal { padding-bottom: 24px; padding-right: 20px; }
  .sr-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 45; display: grid; grid-template-columns: repeat(4, 1fr); padding: 6px 6px calc(6px + env(safe-area-inset-bottom)); background: #fff; border-top: 1px solid var(--sr-line); box-shadow: 0 -6px 20px rgba(0, 30, 48, .06);
    a { display: grid; justify-items: center; gap: 3px; padding: 6px 2px; border-radius: 10px; color: var(--sr-navy); font-size: 12px; font-weight: 500; white-space: nowrap; font-variant-numeric: tabular-nums;
      &.is-on { color: var(--sr-acc); background: var(--sr-surf); }
    }
    .sr-icon, .sr-mask { width: 22px; height: 22px; }
    .sr-mask { color: var(--sr-acc); }
  }
  .sr-bar__ico { position: relative; display: inline-grid;
    b { position: absolute; top: -6px; right: -12px; display: grid; place-items: center; min-width: 18px; height: 18px; padding: 0 4px; border-radius: 9px; background: var(--sr-acc); color: #fff; font-size: 11px; box-sizing: border-box; }
  }
  .sr-toast { bottom: 84px; }
  .sr-modal__box { padding: 24px 20px; }
}
@media (max-width: 576px) {
  .sr-foot__in { grid-template-columns: 1fr; }
  .sr-strip__long { display: none; }
}
@media (max-width: 375px) {
  .sr-wrap { padding-left: 16px; padding-right: 16px; }
  .sr-mnav { padding-left: 16px; padding-right: 16px; }
  .sr-logo__img { width: 120px; height: 33px; }
  .sr-head__in { gap: 10px; }
}
</style>
