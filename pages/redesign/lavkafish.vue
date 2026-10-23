<script lang="ts" setup>
import LfIcon from '~/components/redesign/lavkafish/LfIcon.vue'
import LfQty from '~/components/redesign/lavkafish/LfQty.vue'

const route = useRoute()
const cart = useLavkafishCart()
const ui = useLavkafishUi()

const nav = [
  { to: lfPath('/#catalog'), label: 'Каталог' },
  { to: lfPath('/delivery'), label: 'Доставка и оплата' },
  { to: lfPath('/opt'), label: 'Оптовикам' },
  { to: lfPath('/about'), label: 'О нас и контакты' },
]

const tue = computed(() => ui.batch('tue'))
const thu = computed(() => ui.batch('thu'))

const sheet = computed(() => (ui.product.value ? lfFindProduct(ui.product.value) : undefined))
const sheetBatch = computed(() => {
  const id = sheet.value?.batch[cart.city.value]
  return id ? ui.batch(id) : null
})
const request = computed(() => lfPriceLists.find((p) => p.id === ui.request.value))
const requestText = computed(() =>
  request.value
    ? `Здравствуйте! Пришлите, пожалуйста, прайс: ${request.value.title.toLowerCase()}. Доставка — ${lfCities.find((c) => c.id === cart.city.value)?.title}.`
    : '',
)
const copyRequest = async () => {
  try {
    await navigator.clipboard.writeText(requestText.value)
    ui.say('Текст скопирован. В концепте сообщение никуда не отправляется.')
  } catch {
    ui.say('Не получилось скопировать — выделите текст вручную.')
  }
}

const perUnit = (v: LfVariant) => (v.unit === 'pack' ? v.pack || 'шт' : 'кг')

useSeoMeta({
  title: 'Лавка Fish — охлаждённая форель и морепродукты с доставкой по Томску | Концепт редизайна',
  description:
    'Концепт редизайна сайта «Лавка Fish»: форель из Хакасии, лосось из Мурманска, заморозка и морепродукты к ближайшему привозу, расчёт суммы по весу, доставка по Томску и Новосибирску.',
  ogTitle: 'Лавка Fish — концепт редизайна',
  ogDescription:
    'Каталог к ближайшему привозу с ценами из канала, расчёт по весу рыбы, предоплата 1 кг и доставка по зонам Томска и Новосибирска.',
  ogImage: 'https://andryushov.me/redesign/lavkafish/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'lf-html', lang: 'ru' },
  bodyAttrs: { class: 'lf-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Sofia+Sans:wght@400;500;600;700;800;900&display=swap',
    },
  ],
})

onMounted(() => {
  cart.persist()
  ui.now.value = Date.now()
})

watch(
  () => route.fullPath,
  () => {
    ui.menuOpen.value = false
    ui.product.value = null
    ui.request.value = null
  },
)

// Меню и окна закрывают страницу целиком — фон не прокручивается.
watch([ui.menuOpen, ui.product, ui.request], ([menu, product, req]) => {
  document.documentElement.classList.toggle('lf-locked', Boolean(menu || product || req))
})

const onKey = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  ui.product.value = null
  ui.request.value = null
  ui.menuOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('lf-locked')
})

const cityShort = computed(() => (cart.city.value === 'nsk' ? 'Новосибирск' : 'Томск'))
const isHome = computed(() => route.path === lfPath('/') || route.path === lfPath('').replace(/\/$/, ''))
// На первом экране главной плавающая корзина закрывала бы заголовок.
const scrolled = ref(false)
const onScroll = () => {
  scrolled.value = window.scrollY > 480
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const isOrder = computed(() => route.path.startsWith(lfPath('/order')))
const year = new Date().getFullYear()
</script>

<template>
  <div class="lf">
    <div class="lf-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="lfContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="lf-header">
      <div class="lf-wrap lf-header__row">
        <NuxtLink :to="lfPath()" class="lf-mark" aria-label="Лавка Fish, на главную">
          <span class="lf-mark__sign"><LfIcon name="fish" :size="26" /></span>
          <span class="lf-mark__text">
            <span class="lf-mark__name">Лавка <b>Fish</b></span>
            <span class="lf-mark__sub">рыба под привоз · {{ cityShort }}</span>
          </span>
        </NuxtLink>

        <nav class="lf-header__nav" aria-label="Разделы сайта">
          <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        </nav>

        <div class="lf-header__right">
          <a :href="lfContacts.phoneHref" class="lf-header__phone">
            <LfIcon name="phone" :size="20" />
            <span>{{ lfContacts.phone }}</span>
          </a>
          <NuxtLink :to="lfPath('/order')" class="lf-cartbtn" :class="{ 'is-full': cart.count.value, 'is-active': isOrder }">
            <LfIcon name="basket" />
            <span class="lf-cartbtn__label">{{ cart.count.value ? `≈ ${lfPrice(cart.total.value.min)}` : 'Заказ' }}</span>
            <span v-if="cart.count.value" class="lf-dot">{{ cart.count.value }}</span>
          </NuxtLink>
          <button
            type="button"
            class="lf-iconbtn lf-header__menu"
            :aria-expanded="ui.menuOpen.value"
            aria-controls="lf-menu"
            aria-label="Меню"
            @click="ui.menuOpen.value = !ui.menuOpen.value"
          >
            <LfIcon :name="ui.menuOpen.value ? 'close' : 'menu'" />
          </button>
        </div>
      </div>

      <div class="lf-strip">
        <div class="lf-wrap lf-strip__row">
          <div class="lf-city" role="radiogroup" aria-label="Город доставки">
            <button
              v-for="c in lfCities"
              :key="c.id"
              type="button"
              role="radio"
              :aria-checked="cart.city.value === c.id"
              :class="{ 'is-active': cart.city.value === c.id }"
              @click="cart.city.value = c.id"
            >
              {{ c.short }}
            </button>
          </div>
          <p class="lf-strip__dates">
            <LfIcon name="truck" :size="18" />
            <template v-if="cart.city.value === 'tomsk'">
              <span
                ><span class="lf-strip__lbl">Привоз </span><b>{{ tue.short }}, {{ tue.dm }}</b></span
              >
              <span class="lf-strip__more"
                >Мурманск — <b>{{ thu.short }}, {{ thu.dm }}</b></span
              >
            </template>
            <template v-else>
              <span
                ><span class="lf-strip__lbl">Привоз </span><b>{{ thu.short }}, {{ thu.dm }}</b></span
              >
              <span class="lf-strip__more">в Новосибирск и на Алтай</span>
            </template>
          </p>
          <p class="lf-strip__note">Время доставки пришлём в WhatsApp</p>
        </div>
      </div>
    </header>

    <div v-if="ui.menuOpen.value" class="lf-backdrop lf-backdrop--menu" @click="ui.menuOpen.value = false" />
    <aside id="lf-menu" class="lf-menu" :class="{ 'is-open': ui.menuOpen.value }" aria-label="Меню">
      <div class="lf-menu__head">
        <span>Меню</span>
        <button type="button" class="lf-iconbtn" aria-label="Закрыть меню" @click="ui.menuOpen.value = false">
          <LfIcon name="close" />
        </button>
      </div>
      <nav class="lf-menu__nav">
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" @click="ui.menuOpen.value = false">
          {{ item.label }}<LfIcon name="right" :size="18" />
        </NuxtLink>
        <NuxtLink :to="lfPath('/order')" @click="ui.menuOpen.value = false">
          Заказ<span v-if="cart.count.value" class="lf-menu__sum">≈ {{ lfPrice(cart.total.value.min) }}</span>
        </NuxtLink>
      </nav>
      <div class="lf-menu__contacts">
        <a :href="lfContacts.phoneHref" class="lf-btn lf-btn--line"><LfIcon name="phone" :size="20" />{{ lfContacts.phone }}</a>
        <a :href="lfContacts.channel" target="_blank" rel="noopener" class="lf-btn lf-btn--line">
          <LfIcon name="telegram" :size="20" />Канал с новинками
        </a>
      </div>
    </aside>

    <main class="lf-main">
      <NuxtPage />
    </main>

    <footer class="lf-footer">
      <div class="lf-wrap lf-footer__grid">
        <div class="lf-footer__brand">
          <NuxtLink :to="lfPath()" class="lf-mark" aria-label="Лавка Fish, на главную">
            <span class="lf-mark__sign"><LfIcon name="fish" :size="26" /></span>
            <span class="lf-mark__text">
              <span class="lf-mark__name">Лавка <b>Fish</b></span>
              <span class="lf-mark__sub">рыба под привоз · {{ cityShort }}</span>
            </span>
          </NuxtLink>
          <p>Охлаждённая форель из Хакасии, рыба и морепродукты с доставкой по Томску, Северску, Новосибирску и Алтаю.</p>
        </div>
        <nav class="lf-footer__nav" aria-label="Разделы">
          <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
          <NuxtLink :to="lfPath('/order')">Заказ</NuxtLink>
        </nav>
        <div class="lf-footer__contacts">
          <a :href="lfContacts.phoneHref" class="lf-footer__phone">{{ lfContacts.phone }}</a>
          <a :href="`mailto:${lfContacts.email}`">{{ lfContacts.email }}</a>
          <p>{{ lfContacts.address }}, только доставка</p>
          <div class="lf-footer__social">
            <a :href="lfContacts.channel" target="_blank" rel="noopener" aria-label="Telegram-канал"
              ><LfIcon name="telegram" :size="20"
            /></a>
            <a :href="lfContacts.vk" target="_blank" rel="noopener" aria-label="ВКонтакте"><LfIcon name="vk" :size="20" /></a>
          </div>
        </div>
      </div>
      <div class="lf-wrap lf-footer__legal">
        <p>
          © {{ year }} {{ lfContacts.legal.name }}, ИНН
          {{ lfContacts.legal.inn }}
        </p>
        <p>
          Концепт редизайна, не официальный сайт. Тексты, цены и изображения принадлежат «Лавке Fish», цены взяты с сайта и из
          Telegram-канала на 23 октября 2026.
        </p>
      </div>
    </footer>

    <NuxtLink
      v-if="cart.count.value && !isOrder && (scrolled || !isHome)"
      :to="lfPath('/order')"
      class="lf-float"
      :aria-label="`Заказ: ${cart.count.value} поз.`"
    >
      <LfIcon name="basket" />
      <span>{{ cart.count.value }} поз. · ≈ {{ lfPrice(cart.total.value.min) }}</span>
    </NuxtLink>

    <Transition name="lf-fade">
      <div v-if="sheet" class="lf-modal" role="dialog" aria-modal="true" :aria-label="sheet.name" @click.self="ui.product.value = null">
        <div class="lf-sheet">
          <button type="button" class="lf-iconbtn lf-sheet__close" aria-label="Закрыть" @click="ui.product.value = null">
            <LfIcon name="close" />
          </button>
          <div class="lf-sheet__photo">
            <img :src="sheet.img" :alt="sheet.name" width="640" height="480" />
          </div>
          <div class="lf-sheet__body">
            <p v-if="sheet.origin" class="lf-sheet__origin">
              {{ sheet.origin }}
            </p>
            <h2>{{ sheet.name }}</h2>
            <p v-if="sheet.text" class="lf-sheet__text">{{ sheet.text }}</p>
            <ul class="lf-sheet__variants">
              <li v-for="v in sheet.variants" :key="v.id">
                <div class="lf-sheet__vtext">
                  <b>{{ v.label }}</b>
                  <span>
                    {{ lfPrice(v.price) }}/{{ perUnit(v) }}
                    <template v-if="v.note"> · {{ v.note }}</template>
                    <template v-if="v.left"> · осталось {{ v.left }} шт</template>
                  </span>
                  <span v-if="v.tiers" class="lf-sheet__tiers">
                    <template v-for="t in v.tiers" :key="t.from">от {{ t.from }} {{ lfUnitLabel(v) }} — {{ lfPrice(t.price) }}</template>
                  </span>
                  <span v-if="cart.qtyOf(sheet.id, v.id)" class="lf-sheet__est">
                    {{ lfEstimate(v, cart.qtyOf(sheet.id, v.id)).exact ? 'Сумма' : 'Примерно' }}
                    {{ lfRange(lfEstimate(v, cart.qtyOf(sheet.id, v.id))) }}
                  </span>
                </div>
                <LfQty v-if="sheetBatch" :pid="sheet.id" :vid="v.id" />
              </li>
            </ul>
            <p v-if="sheetBatch" class="lf-sheet__batch">
              <LfIcon name="truck" :size="18" />Привезём {{ sheetBatch.dayAcc }}, {{ sheetBatch.dm }}. Рыбу взвешиваем при получении,
              доплату — курьеру.
            </p>
            <p v-else class="lf-sheet__batch">
              <LfIcon name="pin" :size="18" />В Новосибирск эту позицию пока не возим — только по Томску.
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="lf-fade">
      <div
        v-if="request"
        class="lf-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="`Прайс: ${request.title}`"
        @click.self="ui.request.value = null"
      >
        <div class="lf-dialog">
          <button type="button" class="lf-iconbtn lf-sheet__close" aria-label="Закрыть" @click="ui.request.value = null">
            <LfIcon name="close" />
          </button>
          <h2>Прайс: {{ request.title.toLowerCase() }}</h2>
          <p class="lf-dialog__lead">
            На настоящем сайте кнопка откроет WhatsApp лавки с готовым сообщением. В концепте — только текст, его можно скопировать.
          </p>
          <p class="lf-dialog__msg">{{ requestText }}</p>
          <div class="lf-dialog__actions">
            <button type="button" class="lf-btn" @click="copyRequest"><LfIcon name="copy" :size="20" />Скопировать</button>
            <a :href="lfContacts.channel" target="_blank" rel="noopener" class="lf-btn lf-btn--line">
              <LfIcon name="telegram" :size="20" />Цены в канале
            </a>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="lf-fade">
      <p v-if="ui.toast.value" class="lf-toast" role="status">
        {{ ui.toast.value }}
      </p>
    </Transition>
  </div>
</template>

<style lang="scss">
html.lf-html {
  scrollbar-color: #c9d6d3 #ffffff;
  scroll-padding-top: 140px;

  &.lf-locked {
    overflow: hidden;
  }
}

body.lf-body {
  background: #fff;
  color: #12302e;
  font-family: 'Sofia Sans', system-ui, sans-serif;
}

.lf {
  --lf-accent: #f5900a;
  --lf-accent-d: #e5820a;
  --lf-accent-soft: #ffeed6;
  --lf-accent-text: #b45f00;
  --lf-ink: #12302e;
  --lf-text: #2f4a47;
  --lf-muted: #62807c;
  --lf-surface: #edf3f1;
  --lf-line: #dce6e3;
  --lf-ok: #157a4f;
  --lf-ok-soft: #dcf2e6;
  --lf-r: 12px;
  --lf-r-lg: 20px;

  min-height: 100vh;
  background: #fff;
  color: var(--lf-ink);
  font-family: 'Sofia Sans', system-ui, sans-serif;
  font-size: 17px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

:where(.lf) {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  p,
  h1,
  h2,
  h3,
  h4,
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
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
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
    color: var(--lf-ink);
    font-weight: 800;
    letter-spacing: -0.015em;
  }
}

.lf-wrap {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding-right: 32px;
  padding-left: 32px;

  @media (max-width: 989px) {
    padding-right: 20px;
    padding-left: 20px;
  }

  @media (max-width: 375px) {
    padding-right: 14px;
    padding-left: 14px;
  }
}

.lf-banner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
  padding: 8px 16px;
  background: var(--lf-ink);
  color: #e9f1ef;
  font-size: 14px;
  line-height: 1.4;
  text-align: center;

  a {
    color: #ffc070;
    font-weight: 600;
    text-decoration: underline;
  }
}

.lf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 50px;
  padding: 0 22px;
  border-radius: var(--lf-r);
  background: var(--lf-accent);
  color: var(--lf-ink);
  font-weight: 800;
  white-space: nowrap;
  transition:
    background-color 0.15s,
    color 0.15s,
    box-shadow 0.15s;

  &:hover {
    background: var(--lf-accent-d);
  }

  &--line {
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--lf-line);
    font-weight: 700;

    &:hover {
      background: #fff;
      box-shadow: inset 0 0 0 1px var(--lf-ink);
    }
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
}

.lf-iconbtn {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--lf-r);
  color: var(--lf-ink);
  transition: background-color 0.15s;

  &:hover {
    background: var(--lf-surface);
  }
}

.lf-chip {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  background: var(--lf-surface);
  color: var(--lf-text);
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  transition:
    background-color 0.15s,
    color 0.15s;

  &:hover {
    color: var(--lf-ink);
  }

  &.is-active {
    background: var(--lf-ink);
    color: #fff;
  }

  &.is-in:not(.is-active) {
    box-shadow: inset 0 0 0 2px var(--lf-accent);
  }
}

.lf-head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 12px 24px;
  margin-bottom: 24px;

  h2 {
    font-size: clamp(28px, 3.2vw, 40px);
    line-height: 1.1;
  }

  p {
    max-width: 560px;
    margin-top: 8px;
    color: var(--lf-muted);
  }
}

.lf-section {
  padding-top: 64px;
  padding-bottom: 64px;

  @media (max-width: 768px) {
    padding-top: 44px;
    padding-bottom: 44px;
  }
}

.lf-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;

  input,
  textarea,
  select {
    width: 100%;
    min-height: 50px;
    padding: 12px 14px;
    border: 1px solid var(--lf-line);
    border-radius: var(--lf-r);
    background: #fff;
    font-size: 16px;
    font-weight: 400;
    transition: border-color 0.15s;

    &:focus {
      border-color: var(--lf-ink);
      outline: none;
    }
  }

  select {
    padding-right: 44px;
    appearance: none;
    background: #fff
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2312302e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")
      right 14px center / 20px no-repeat;
  }

  textarea {
    min-height: 96px;
    resize: vertical;
  }

  small {
    color: var(--lf-muted);
    font-weight: 400;
  }
}

/* Шапка */
.lf-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: #fff;
  box-shadow: 0 1px 0 var(--lf-line);

  &__row {
    display: flex;
    align-items: center;
    gap: 28px;
    min-height: 76px;
  }

  &__nav {
    display: flex;
    gap: 4px;
    margin-right: auto;

    a {
      padding: 8px 12px;
      border-radius: 10px;
      color: var(--lf-text);
      font-weight: 600;
      white-space: nowrap;
      transition:
        background-color 0.15s,
        color 0.15s;

      &:hover {
        background: var(--lf-surface);
        color: var(--lf-ink);
      }
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__phone {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 800;
    white-space: nowrap;

    &:hover {
      color: var(--lf-accent-text);
    }
  }

  &__menu {
    display: none;
  }

  @media (max-width: 1199px) {
    &__row {
      gap: 16px;
    }

    &__nav a {
      padding: 8px 8px;
      font-size: 16px;
    }

    &__phone span {
      display: none;
    }

    &__phone {
      width: 44px;
      height: 44px;
      justify-content: center;
      border-radius: var(--lf-r);
      background: var(--lf-surface);
    }
  }

  @media (max-width: 989px) {
    &__nav {
      display: none;
    }

    &__right {
      margin-left: auto;
      gap: 8px;
    }

    &__menu {
      display: grid;
    }

    &__row {
      min-height: 64px;
    }
  }

  @media (max-width: 576px) {
    .lf-cartbtn {
      display: none;
    }
  }
}

.lf-mark {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 12px;

  &__sign {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: var(--lf-accent);
    color: var(--lf-ink);
  }

  &__text {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }

  &__name {
    font-size: 23px;
    font-weight: 700;
    letter-spacing: -0.02em;

    b {
      font-weight: 900;
    }
  }

  &__sub {
    margin-top: 3px;
    color: var(--lf-muted);
    font-size: 13px;
    font-weight: 600;
  }

  @media (max-width: 375px) {
    gap: 10px;

    &__sign {
      width: 40px;
      height: 40px;
      border-radius: 12px;
    }

    &__name {
      font-size: 21px;
    }
  }
}

.lf-cartbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 188px;
  height: 48px;
  padding: 0 16px;
  border-radius: var(--lf-r);
  background: var(--lf-surface);
  font-weight: 800;
  white-space: nowrap;
  transition: background-color 0.15s;

  &:hover,
  &.is-active {
    background: var(--lf-accent-soft);
  }

  &.is-full {
    background: var(--lf-accent);

    &:hover {
      background: var(--lf-accent-d);
    }
  }

  &__label {
    font-variant-numeric: tabular-nums;
  }
}

.lf-dot {
  position: absolute;
  top: -6px;
  right: -6px;
  display: grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  background: var(--lf-ink);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
}

.lf-strip {
  background: var(--lf-surface);

  &__row {
    display: flex;
    align-items: center;
    gap: 8px 20px;
    min-height: 52px;
  }

  &__dates {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 16px;
    font-size: 16px;

    .lf-icon {
      flex: none;
    }

    b {
      font-weight: 800;
    }
  }

  &__more {
    color: var(--lf-text);
  }

  b {
    white-space: nowrap;
  }

  &__note {
    margin-left: auto;
    color: var(--lf-muted);
    font-size: 15px;
    white-space: nowrap;
  }

  @media (max-width: 1199px) {
    &__note {
      display: none;
    }
  }

  @media (max-width: 768px) {
    &__row {
      gap: 12px;
      min-height: 50px;
      padding-top: 6px;
      padding-bottom: 6px;
    }

    &__dates {
      font-size: 15px;
      line-height: 1.3;

      .lf-icon {
        display: none;
      }
    }

    &__more {
      display: none;
    }
  }

  @media (max-width: 375px) {
    &__lbl {
      display: none;
    }
  }
}

.lf-city {
  display: inline-flex;
  flex: none;
  padding: 3px;
  border-radius: 12px;
  background: #fff;
  box-shadow: inset 0 0 0 1px var(--lf-line);

  button {
    min-height: 36px;
    padding: 0 14px;
    border-radius: 9px;
    color: var(--lf-text);
    font-size: 15px;
    font-weight: 700;
    white-space: nowrap;
    transition:
      background-color 0.15s,
      color 0.15s;

    &.is-active {
      background: var(--lf-ink);
      color: #fff;
    }
  }

  @media (max-width: 375px) {
    button {
      padding: 0 10px;
      font-size: 14px;
    }
  }
}

/* Меню на телефоне */
.lf-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(18, 48, 46, 0.4);
}

.lf-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 61;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: min(380px, 100%);
  padding: 14px 20px 24px;
  overflow-y: auto;
  background: #fff;
  transform: translateX(100%);
  visibility: hidden;
  transition:
    transform 0.25s,
    visibility 0.25s;

  &.is-open {
    transform: none;
    visibility: visible;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    font-weight: 800;
  }

  &__nav {
    display: flex;
    flex-direction: column;

    a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid var(--lf-line);
      font-size: 19px;
      font-weight: 700;
    }
  }

  &__sum {
    color: var(--lf-accent-text);
    font-variant-numeric: tabular-nums;
  }

  &__contacts {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

.lf-main {
  min-height: 50vh;
}

/* Подвал */
.lf-footer {
  margin-top: 24px;
  padding: 48px 0 28px;
  background: var(--lf-surface);
  font-size: 16px;

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
    gap: 32px;
  }

  &__brand p {
    max-width: 380px;
    margin-top: 16px;
    color: var(--lf-text);
  }

  &__nav,
  &__contacts {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 8px;

    a:hover {
      color: var(--lf-accent-text);
    }
  }

  &__phone {
    font-size: 21px;
    font-weight: 800;
  }

  &__contacts p {
    color: var(--lf-text);
  }

  &__social {
    display: flex;
    gap: 8px;
    margin-top: 6px;

    a {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: var(--lf-r);
      background: #fff;
    }
  }

  &__legal {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px 24px;
    margin-top: 36px;
    padding-top: 20px;
    border-top: 1px solid var(--lf-line);
    color: var(--lf-muted);
    font-size: 14px;

    p:last-child {
      max-width: 640px;
    }
  }

  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }

    &__brand {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 576px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }

    padding-bottom: 100px;
  }
}

/* Плавающая корзина на телефоне */
.lf-float {
  position: fixed;
  right: 16px;
  bottom: calc(16px + env(safe-area-inset-bottom));
  z-index: 45;
  display: none;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 20px;
  border-radius: 16px;
  background: var(--lf-accent);
  color: var(--lf-ink);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(18, 48, 46, 0.25);

  @media (max-width: 576px) {
    display: inline-flex;
  }
}

/* Окна */
.lf-modal {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 24px;
  overflow-y: auto;
  background: rgba(18, 48, 46, 0.45);

  @media (max-width: 576px) {
    align-items: end;
    padding: 0;
  }
}

.lf-sheet {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  width: min(980px, 100%);
  overflow: hidden;
  border-radius: var(--lf-r-lg);
  background: #fff;

  &__close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
    background: #fff;
  }

  &__photo {
    background: var(--lf-surface);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 32px 28px 28px;

    h2 {
      padding-right: 40px;
      font-size: 28px;
      line-height: 1.15;
    }
  }

  &__origin {
    color: var(--lf-accent-text);
    font-weight: 800;
  }

  &__text {
    color: var(--lf-text);
  }

  &__variants {
    display: flex;
    flex-direction: column;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 0;
      border-top: 1px solid var(--lf-line);
    }
  }

  &__vtext {
    display: flex;
    flex-direction: column;
    min-width: 0;
    font-size: 15px;
    color: var(--lf-muted);

    b {
      color: var(--lf-ink);
      font-size: 17px;
    }
  }

  &__tiers {
    color: var(--lf-ok);
    font-weight: 700;
  }

  &__est {
    color: var(--lf-ink);
    font-weight: 700;
  }

  &__batch {
    display: flex;
    gap: 8px;
    padding: 12px 14px;
    border-radius: var(--lf-r);
    background: var(--lf-surface);
    font-size: 15px;

    .lf-icon {
      flex: none;
      margin-top: 2px;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);

    &__photo {
      aspect-ratio: 16 / 10;
    }

    &__body {
      padding: 22px 18px 24px;

      h2 {
        font-size: 24px;
      }
    }
  }

  @media (max-width: 576px) {
    max-height: 92vh;
    overflow-y: auto;
    border-radius: var(--lf-r-lg) var(--lf-r-lg) 0 0;
  }
}

.lf-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min(520px, 100%);
  padding: 28px;
  border-radius: var(--lf-r-lg);
  background: #fff;

  h2 {
    padding-right: 40px;
    font-size: 26px;
    line-height: 1.15;
  }

  &__lead {
    color: var(--lf-text);
  }

  &__msg {
    padding: 14px 16px;
    border-radius: var(--lf-r);
    background: var(--lf-surface);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 576px) {
    padding: 24px 18px 28px;
    border-radius: var(--lf-r-lg) var(--lf-r-lg) 0 0;

    &__actions .lf-btn {
      flex: 1 1 100%;
    }
  }
}

.lf-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 80;
  width: max-content;
  max-width: calc(100% - 32px);
  padding: 12px 18px;
  border-radius: var(--lf-r);
  background: var(--lf-ink);
  color: #fff;
  font-size: 15px;
  transform: translateX(-50%);

  @media (max-width: 576px) {
    bottom: calc(84px + env(safe-area-inset-bottom));
  }
}

/* Общее для внутренних страниц */
.lf-page {
  padding-top: 32px;
  padding-bottom: 48px;

  &__top {
    max-width: 760px;
    margin-bottom: 28px;

    h1 {
      font-size: clamp(32px, 4vw, 48px);
      line-height: 1.05;
    }

    p {
      margin-top: 10px;
      color: var(--lf-text);
      font-size: 18px;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

.lf-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 28px;
  border-radius: var(--lf-r-lg);
  background: var(--lf-surface);

  &--wide {
    grid-column: 1 / -1;
  }

  h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 24px;

    .lf-icon {
      flex: none;
      color: var(--lf-accent-text);
    }
  }

  &__note {
    color: var(--lf-text);
    font-size: 16px;
  }

  &__links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 576px) {
    padding: 20px 16px;

    &__links .lf-btn {
      flex: 1 1 100%;
    }
  }
}

ul.lf-zones {
  display: flex;
  flex-direction: column;

  li {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 0;
    border-top: 1px solid var(--lf-line);

    &:first-child {
      border-top: 0;
    }
  }

  b {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
}

.lf-done {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  border-radius: var(--lf-r);
  background: var(--lf-ok-soft);
  color: var(--lf-ink);

  .lf-icon {
    flex: none;
    margin-top: 2px;
    color: var(--lf-ok);
  }
}

.lf-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  text-decoration: underline;
  text-decoration-color: var(--lf-accent);
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;

  &:hover {
    color: var(--lf-accent-text);
  }
}

.lf-fade-enter-active,
.lf-fade-leave-active {
  transition: opacity 0.2s;
}

.lf-fade-enter-from,
.lf-fade-leave-to {
  opacity: 0;
}
</style>
