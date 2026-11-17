<script lang="ts" setup>
import { SV_ORIG, svAsset, svCats, svContacts, svImg, svMarkets, svNotes, svPath, svSocial, svWeight } from '~/utils/sovelan'
import { svProducts } from '~/utils/sovelan.data'
import { svKg, useSvOrder, useSvUi } from '~/composables/useSovelan'
import SvIcon from '~/components/redesign/sovelan/SvIcon.vue'

const route = useRoute()
const router = useRouter()
const order = useSvOrder()
const ui = useSvUi()

useSeoMeta({
  title: 'Ореховые Эланки и Виланки — кондитерское производство «Созвездие вкуса», Пенза | Концепт редизайна',
  description:
    'Концепт редизайна sovelan.ru: зефир, суфле, мармелад и пирожное «картошка» с декорацией из глазури — 574 позиции в 21 коллекции, опт по договору, розница на маркетплейсах.',
  ogTitle: 'Созвездие вкуса — концепт редизайна',
  ogDescription: 'Ореховые Эланки® и Виланки®: коллекции к праздникам на год вперёд, каталог с поиском, заявка с весом заказа.',
  ogImage: 'https://andryushov.me/redesign/sovelan/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { lang: 'ru' },
  link: [
    { rel: 'icon', type: 'image/png', href: svAsset('favicon.png') },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&family=Raleway:wght@700;800&display=swap' },
  ],
})

const to = (p: string) => svPath(p)
const isOn = (p: string) => route.path.startsWith(svPath(p).replace(/\/$/, ''))
const year = new Date().getFullYear()

// Поиск с подсказками: по названию, линейке и типу изделия
const q = ref('')
const focus = ref(false)
const hits = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (s.length < 2) return []
  return svProducts.filter((p) => `${p.b} ${p.t} ${p.k}`.toLowerCase().includes(s)).slice(0, 6)
})
const goSearch = () => {
  const s = q.value.trim()
  focus.value = false
  ;(document.activeElement as HTMLElement | null)?.blur?.()
  router.push({ path: svPath('/katalog/'), query: s ? { q: s } : {} })
}
const onBlurSearch = () => setTimeout(() => (focus.value = false), 150)

// Тост после «В заявку»
let toastTimer: ReturnType<typeof setTimeout> | undefined
watch(
  () => order.toast.value?.id,
  () => {
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => (order.toast.value = null), 3200)
  },
)

const locked = computed(() => ui.menu.value || ui.retail.value)
watch(locked, (v) => {
  if (import.meta.client) document.documentElement.style.overflow = v ? 'hidden' : ''
})
const closeAll = () => {
  ui.menu.value = false
  ui.retail.value = false
  ui.cats.value = false
}
watch(
  () => route.fullPath,
  () => {
    closeAll()
    focus.value = false
    ;(document.activeElement as HTMLElement | null)?.blur?.()
  },
)
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeAll()
}
const onDoc = (e: MouseEvent) => {
  if (ui.cats.value && !(e.target as HTMLElement).closest('.sv-catalog, .sv-head__cats')) ui.cats.value = false
}
const up = () => window.scrollTo({ top: 0, behavior: 'smooth' })
onMounted(() => {
  order.persist()
  window.addEventListener('keydown', onKey)
  document.addEventListener('click', onDoc)
})
onBeforeUnmount(() => {
  clearTimeout(toastTimer)
  window.removeEventListener('keydown', onKey)
  document.removeEventListener('click', onDoc)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div class="sv">
    <div class="sv-concept">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="SV_ORIG" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <!-- служебная строка уезжает при прокрутке -->
    <div class="sv-strip">
      <div class="sv-wrap sv-strip__in">
        <span class="sv-strip__item sv-strip__what">Кондитерское производство в Пензе · опт по договору</span>
        <span class="sv-strip__item sv-strip__addr"><SvIcon name="pin" />{{ svContacts.address }}</span>
        <a class="sv-strip__item sv-strip__mail" :href="`mailto:${svContacts.sales}`"><SvIcon name="mail" />{{ svContacts.sales }}</a>
        <a v-for="ph in svContacts.phones" :key="ph.tel" class="sv-strip__item sv-strip__phone" :href="`tel:${ph.tel}`"><SvIcon name="phone" />{{ ph.label }}</a>
        <span class="sv-strip__social">
          <a v-for="s in svSocial" :key="s.name" :href="s.url" target="_blank" rel="noopener" :aria-label="s.name"><img :src="svImg(s.icon)" :alt="s.name" width="20" height="20" /></a>
        </span>
      </div>
    </div>

    <header class="sv-head">
      <div class="sv-wrap sv-head__in sv-header__row">
        <button type="button" class="sv-iconbtn sv-head__burger" aria-label="Меню" @click="ui.menu.value = true"><SvIcon name="menu" /></button>
        <NuxtLink :to="to('/')" class="sv-logo" aria-label="Созвездие вкуса — на главную">
          <img :src="svImg('logo.jpg')" alt="Созвездие вкуса" width="400" height="120" />
        </NuxtLink>
        <button type="button" class="sv-btn sv-head__cats" :class="{ 'is-open': ui.cats.value }" :aria-expanded="ui.cats.value" @click="ui.cats.value = !ui.cats.value">
          <SvIcon :name="ui.cats.value ? 'close' : 'grid'" /><span>Каталог</span>
        </button>
        <form class="sv-search" role="search" @submit.prevent="goSearch">
          <SvIcon name="search" />
          <input v-model="q" type="search" placeholder="Овечка, суфле, зайчик…" aria-label="Поиск по каталогу" @focus="focus = true" @blur="onBlurSearch" />
          <button type="submit" class="sv-search__go">Найти</button>
          <div v-if="focus && hits.length" class="sv-search__drop">
            <NuxtLink v-for="p in hits" :key="p.id" :to="{ path: to(`/katalog/${p.c[0]}/`), query: { q: p.t } }" class="sv-search__hit">
              <img :src="svImg(p.i)" :alt="p.t" width="44" height="44" />
              <span><b>{{ p.t }}</b><small>{{ p.b || 'Созвездие вкуса' }} · {{ svWeight(p.w) }}</small></span>
            </NuxtLink>
            <button type="button" class="sv-search__all" @mousedown.prevent="goSearch">Все результаты<SvIcon name="right" /></button>
          </div>
        </form>
        <div class="sv-retail" aria-label="Купить в розницу">
          <span class="sv-retail__label">В розницу</span>
          <a v-for="m in svMarkets" :key="m.id" :href="m.url" target="_blank" rel="noopener" class="sv-retail__a" :title="`${m.name} — магазин производителя`"
            ><img :src="svImg(m.icon)" :alt="m.name" width="26" height="26"
          /></a>
        </div>
        <a class="sv-iconbtn sv-head__call" :href="`tel:${svContacts.phones[0].tel}`" aria-label="Позвонить"><SvIcon name="phone" /></a>
        <NuxtLink :to="to('/zayavka/')" class="sv-btn sv-head__order" :class="{ 'is-full': order.count.value }">
          <SvIcon name="bag" />
          <span class="sv-head__ordertext">
            <b>Заявка</b>
            <small>{{ order.count.value ? `${order.pcs.value} шт. · ${svKg(order.grams.value)}` : 'пока пусто' }}</small>
          </span>
          <em v-if="order.count.value" class="sv-badge">{{ order.count.value }}</em>
        </NuxtLink>
      </div>
      <!-- выпадающий каталог: 21 раздел их обложками -->
      <div v-if="ui.cats.value" class="sv-catalog">
        <div class="sv-wrap">
          <div class="sv-catalog__grid">
            <NuxtLink v-for="c in svCats" :key="c.id" :to="to(`/katalog/${c.id}/`)" class="sv-catalog__a">
              <img :src="svImg(c.img)" :alt="c.name" width="260" height="320" loading="lazy" />
              <span>{{ c.name }}</span><small>{{ c.count }}</small>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <main class="sv-main"><NuxtPage /></main>

    <footer class="sv-foot">
      <div class="sv-wrap sv-foot__grid">
        <div class="sv-foot__brand">
          <img :src="svImg('logo.jpg')" alt="Созвездие вкуса" width="400" height="120" />
          <p>{{ svContacts.legal }}. Ореховые Эланки® и Виланки® — кондитерское производство в Пензе.</p>
          <p class="sv-foot__fake"><SvIcon name="shield" /><span>{{ svNotes.fake }}</span></p>
        </div>
        <div>
          <h3>Коллекции</h3>
          <ul class="sv-foot__list">
            <li v-for="c in svCats.slice(0, 11)" :key="c.id"><NuxtLink :to="to(`/katalog/${c.id}/`)">{{ c.name }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3>Линейки</h3>
          <ul class="sv-foot__list">
            <li v-for="c in svCats.slice(11)" :key="c.id"><NuxtLink :to="to(`/katalog/${c.id}/`)">{{ c.name }}</NuxtLink></li>
          </ul>
        </div>
        <div class="sv-foot__contacts">
          <h3>Оптовым покупателям</h3>
          <a v-for="ph in svContacts.phones" :key="ph.tel" class="sv-foot__phone" :href="`tel:${ph.tel}`">{{ ph.label }}</a>
          <a :href="`mailto:${svContacts.sales}`">{{ svContacts.sales }}</a>
          <small>{{ svContacts.salesNote }}</small>
          <a :href="`mailto:${svContacts.info}`">{{ svContacts.info }}</a>
          <small>{{ svContacts.infoNote }}</small>
          <span>{{ svContacts.address }}</span>
          <span class="sv-foot__social">
            <a v-for="s in svSocial" :key="s.name" :href="s.url" target="_blank" rel="noopener" :aria-label="s.name"><img :src="svImg(s.icon)" :alt="s.name" width="22" height="22" /></a>
          </span>
        </div>
      </div>
      <div class="sv-wrap sv-foot__bottom">
        <span>© {{ svContacts.legal }}, {{ year }}. {{ svNotes.consent }}</span>
        <span>Тексты, изображения и товарные знаки принадлежат владельцу сайта sovelan.ru и показаны в концепте для примера.</span>
        <button type="button" class="sv-iconbtn sv-foot__up" aria-label="Наверх" @click="up"><SvIcon name="up" /></button>
      </div>
    </footer>

    <!-- нижняя панель на телефоне -->
    <nav class="sv-tabbar" aria-label="Быстрые действия">
      <NuxtLink :to="to('/katalog/')" class="sv-tabbar__a" :class="{ 'is-on': isOn('/katalog/') }"><SvIcon name="grid" /><span>Каталог</span></NuxtLink>
      <button type="button" class="sv-tabbar__a" @click="ui.retail.value = true"><SvIcon name="gift" /><span>В розницу</span></button>
      <a :href="`tel:${svContacts.phones[0].tel}`" class="sv-tabbar__a"><SvIcon name="phone" /><span>Позвонить</span></a>
      <NuxtLink :to="to('/zayavka/')" class="sv-tabbar__a" :class="{ 'is-on': isOn('/zayavka/') }">
        <span class="sv-tabbar__ic"><SvIcon name="bag" /><em v-if="order.count.value" class="sv-badge">{{ order.count.value }}</em></span>
        <span>{{ order.count.value ? svKg(order.grams.value) : 'Заявка' }}</span>
      </NuxtLink>
    </nav>

    <!-- меню на телефоне -->
    <div v-if="ui.menu.value" class="sv-drawer" @click.self="ui.menu.value = false">
      <div class="sv-drawer__panel" role="dialog" aria-label="Меню">
        <div class="sv-drawer__top">
          <img :src="svImg('logo.jpg')" alt="Созвездие вкуса" width="400" height="120" />
          <button type="button" class="sv-iconbtn" aria-label="Закрыть меню" @click="ui.menu.value = false"><SvIcon name="close" /></button>
        </div>
        <div class="sv-drawer__cats">
          <NuxtLink v-for="c in svCats" :key="c.id" :to="to(`/katalog/${c.id}/`)" :class="{ 'is-on': route.path === to(`/katalog/${c.id}/`) }">
            <img :src="svImg(c.img)" :alt="c.name" width="260" height="320" loading="lazy" /><span>{{ c.name }}</span><small>{{ c.count }}</small>
          </NuxtLink>
        </div>
        <div class="sv-drawer__retail">
          <span>В розницу — на маркетплейсах</span>
          <div>
            <a v-for="m in svMarkets" :key="m.id" :href="m.url" target="_blank" rel="noopener"><img :src="svImg(m.icon)" :alt="m.name" width="24" height="24" />{{ m.name }}</a>
          </div>
        </div>
        <div class="sv-drawer__contacts">
          <a v-for="ph in svContacts.phones" :key="ph.tel" class="sv-drawer__phone" :href="`tel:${ph.tel}`"><SvIcon name="phone" />{{ ph.label }}</a>
          <a :href="`mailto:${svContacts.sales}`"><SvIcon name="mail" />{{ svContacts.sales }}</a>
          <span><SvIcon name="pin" />{{ svContacts.address }}</span>
        </div>
      </div>
    </div>

    <!-- «В розницу» на телефоне -->
    <div v-if="ui.retail.value" class="sv-sheet" @click.self="ui.retail.value = false">
      <div class="sv-sheet__panel" role="dialog" aria-label="Купить в розницу">
        <div class="sv-sheet__head">
          <b>Купить в розницу</b>
          <button type="button" class="sv-iconbtn" aria-label="Закрыть" @click="ui.retail.value = false"><SvIcon name="close" /></button>
        </div>
        <p>{{ svNotes.opt }}</p>
        <a v-for="m in svMarkets" :key="m.id" :href="m.url" target="_blank" rel="noopener" class="sv-sheet__a"><img :src="svImg(m.icon)" :alt="m.name" width="28" height="28" />{{ m.name }}<SvIcon name="right" /></a>
      </div>
    </div>

    <Transition name="sv-fade">
      <div v-if="order.toast.value" :key="order.toast.value.id" class="sv-toast" role="status">
        <SvIcon name="check" />
        <span>«{{ order.toast.value.text }}» в заявке</span>
        <NuxtLink :to="to('/zayavka/')">Оформить</NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.sv {
  --sv-acc: #b12b5d;
  --sv-acc-h: #962149;
  --sv-dark: #3d2216;
  --sv-brown: #60341b;
  --sv-text: #33261f;
  --sv-muted: #7b6c66;
  --sv-surface: #f3f3f6;
  --sv-soft: #fbeef3;
  --sv-line: #e7e3e7;
  --sv-ok: #2f7a4a;
  --sv-head: 'Raleway', 'Golos Text', system-ui, sans-serif;
  --sv-body: 'Golos Text', system-ui, sans-serif;
  --sv-r: 14px;
  --sv-R: 24px;
  --sv-headh: 84px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: var(--sv-text);
  font: 400 15px/1.5 var(--sv-body);
  -webkit-font-smoothing: antialiased;
  font-variant-numeric: lining-nums;
}
html:has(.sv) {
  scroll-padding-top: calc(var(--sv-headh, 84px) + 16px);
}
:where(.sv) {
  h1,
  h2,
  h3,
  p {
    margin: 0;
  }
  h1,
  h2,
  h3 {
    font-family: var(--sv-head);
    font-weight: 800;
    color: var(--sv-dark);
    letter-spacing: -0.01em;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  img {
    max-width: 100%;
    display: block;
  }
  button {
    font: inherit;
    color: inherit;
  }
  input,
  textarea {
    font: inherit;
    color: var(--sv-text);
  }
}
.sv-wrap {
  width: 100%;
  max-width: 1384px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
}
.sv-main {
  flex: 1 0 auto;
  padding-bottom: 72px;
}
.sv-icon {
  width: 20px;
  height: 20px;
  flex: none;
}

/* баннер концепта */
.sv-concept {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px 12px;
  padding: 8px 16px;
  background: var(--sv-dark);
  color: #fff;
  font-size: 13px;
  text-align: center;
  a {
    color: #fff;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

/* кнопки */
.sv-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border: 0;
  border-radius: 12px;
  background: var(--sv-acc);
  color: #fff !important;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: var(--sv-acc-h);
  }
  &--line,
  &--line:focus,
  &--line:active {
    background: #fff;
    color: var(--sv-dark) !important;
    border: 1px solid var(--sv-line);
    &:hover {
      background: var(--sv-surface);
    }
  }
  &--soft {
    background: var(--sv-soft);
    color: var(--sv-acc) !important;
    &:hover {
      background: #f7dfe8;
    }
  }
}
.sv-iconbtn {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: none;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: var(--sv-surface);
  color: var(--sv-dark);
  cursor: pointer;
  &:hover {
    background: #e9e8ee;
  }
}
.sv-badge {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 10px;
  background: var(--sv-acc);
  color: #fff;
  font: 700 12px/1 var(--sv-body);
  font-style: normal;
}

/* служебная строка */
.sv-strip {
  border-bottom: 1px solid var(--sv-line);
  font-size: 13px;
  color: var(--sv-muted);
  &__in {
    display: flex;
    align-items: center;
    gap: 22px;
    min-height: 40px;
  }
  &__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    .sv-icon {
      width: 16px;
      height: 16px;
      color: var(--sv-acc);
    }
  }
  a.sv-strip__item:hover {
    color: var(--sv-acc);
  }
  &__what {
    font-weight: 600;
    color: var(--sv-dark);
    margin-right: auto;
  }
  &__phone {
    font-weight: 600;
    color: var(--sv-dark);
  }
  &__social {
    display: inline-flex;
    gap: 10px;
    img {
      width: 18px;
      height: 18px;
    }
  }
}

/* шапка: липкая строка «знак · Каталог · поиск · В розницу · Заявка» */
.sv-head {
  position: sticky;
  top: 0;
  z-index: 40;
  background: #fff;
  border-bottom: 1px solid var(--sv-line);
  &__in {
    display: flex;
    align-items: center;
    gap: 16px;
    height: var(--sv-headh);
  }
  &__burger,
  &__call {
    display: none !important;
  }
  &__cats {
    flex: none;
    &.is-open {
      background: var(--sv-dark);
    }
  }
  &__order {
    position: relative;
    flex: none;
    width: 186px;
    justify-content: flex-start;
    gap: 10px;
    min-height: 52px;
    padding: 0 14px;
    background: var(--sv-soft);
    color: var(--sv-acc) !important;
    &:hover {
      background: #f7dfe8;
    }
    &.is-full {
      background: var(--sv-acc);
      color: #fff !important;
      &:hover {
        background: var(--sv-acc-h);
      }
    }
    .sv-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      background: var(--sv-dark);
      border: 2px solid #fff;
      height: 24px;
      min-width: 24px;
      border-radius: 12px;
    }
  }
  &__ordertext {
    display: grid;
    line-height: 1.15;
    text-align: left;
    b {
      font-size: 15px;
    }
    small {
      font-size: 12px;
      font-weight: 500;
      opacity: 0.85;
      font-variant-numeric: tabular-nums;
    }
  }
}
.sv-logo {
  flex: none;
  img {
    width: auto;
    height: 64px;
  }
}
.sv-search {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 5px 0 14px;
  border: 1.5px solid var(--sv-line);
  border-radius: 14px;
  background: #fff;
  transition: border-color 0.2s;
  &:focus-within {
    border-color: var(--sv-acc);
  }
  > .sv-icon {
    color: var(--sv-muted);
  }
  input {
    flex: 1 1 auto;
    width: 0;
    min-width: 0;
    height: 100%;
    padding: 0 10px;
    border: 0;
    outline: 0;
    background: none;
    &::placeholder {
      color: #a2959a;
    }
    &::-webkit-search-cancel-button {
      display: none;
    }
  }
  &__go {
    flex: none;
    height: 38px;
    padding: 0 16px;
    border: 0;
    border-radius: 10px;
    background: var(--sv-surface);
    color: var(--sv-dark);
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background: #e9e8ee;
    }
  }
  &__drop {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: 5;
    padding: 8px;
    border: 1px solid var(--sv-line);
    border-radius: 18px;
    background: #fff;
    box-shadow:
      0 2px 6px rgba(61, 34, 22, 0.08),
      0 22px 54px rgba(61, 34, 22, 0.18);
  }
  &__hit {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 8px;
    border-radius: 12px;
    &:hover {
      background: var(--sv-surface);
    }
    img {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      object-fit: cover;
    }
    span {
      display: grid;
      min-width: 0;
    }
    b {
      font-weight: 600;
      color: var(--sv-dark);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    small {
      color: var(--sv-muted);
      font-size: 13px;
    }
  }
  &__all {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
    margin-top: 4px;
    padding: 10px 8px;
    border: 0;
    border-top: 1px solid var(--sv-line);
    background: none;
    color: var(--sv-acc);
    font-weight: 600;
    cursor: pointer;
    .sv-icon {
      width: 16px;
      height: 16px;
    }
  }
}
.sv-retail {
  flex: none;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 4px 4px 12px;
  border-radius: 14px;
  background: var(--sv-surface);
  &__label {
    font-size: 13px;
    font-weight: 600;
    color: var(--sv-dark);
    margin-right: 4px;
    white-space: nowrap;
  }
  &__a {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: #fff;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.06);
    }
    img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
  }
}
.sv-catalog {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 20px 0 26px;
  background: #fff;
  border-bottom: 1px solid var(--sv-line);
  box-shadow: 0 30px 60px rgba(61, 34, 22, 0.16);
  max-height: calc(100vh - var(--sv-headh) - 20px);
  overflow-y: auto;
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 8px;
  }
  &__a {
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    padding: 6px 10px 6px 6px;
    border-radius: 12px;
    &:hover {
      background: var(--sv-surface);
      span {
        color: var(--sv-acc);
      }
    }
    img {
      width: 40px;
      height: 48px;
      border-radius: 8px;
      object-fit: cover;
    }
    span {
      font-weight: 600;
      line-height: 1.25;
      color: var(--sv-dark);
    }
    small {
      color: var(--sv-muted);
      font-size: 13px;
      font-variant-numeric: tabular-nums;
    }
  }
}

/* общие блоки страниц */
.sv-section {
  padding-top: 64px;
}
.sv-sechead {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  h2 {
    font-size: 32px;
    line-height: 1.15;
  }
  p {
    margin-top: 6px;
    color: var(--sv-muted);
  }
  > a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex: none;
    color: var(--sv-acc);
    font-weight: 600;
    .sv-icon {
      width: 18px;
      height: 18px;
    }
  }
}
.sv-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 22px;
  font-size: 13px;
  color: var(--sv-muted);
  a:hover {
    color: var(--sv-acc);
  }
}
.sv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 228px), 1fr));
  gap: 18px;
}

/* карточка K28 */
.sv-card {
  display: grid;
  grid-template-rows: auto auto 1fr;
  min-width: 0;
  padding: 10px;
  border: 1px solid var(--sv-line);
  border-radius: 20px;
  background: #fff;
  transition: border-color 0.2s;
  &.is-in {
    border-color: #e8b6c9;
  }
  &__photo {
    position: relative;
    aspect-ratio: 1;
    border-radius: 14px;
    overflow: hidden;
    background: #fff;
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: opacity 0.25s;
    }
    .is-off {
      opacity: 0;
    }
  }
  &__switch {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    margin: 8px 0 0;
    padding: 3px;
    border-radius: 10px;
    background: var(--sv-surface);
    button {
      min-height: 30px;
      padding: 0 6px;
      border: 0;
      border-radius: 8px;
      background: none;
      color: var(--sv-muted);
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      &.is-on {
        background: #fff;
        color: var(--sv-dark);
        box-shadow: 0 1px 3px rgba(61, 34, 22, 0.12);
      }
    }
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 6px 4px;
  }
  &__brand {
    font-size: 13px;
    font-weight: 600;
    color: var(--sv-acc);
  }
  &__title {
    font: 800 18px/1.2 var(--sv-head) !important;
    min-height: 2.4em;
  }
  &__kind {
    margin-bottom: 12px !important;
    font-size: 13px;
    line-height: 1.4;
    color: var(--sv-muted);
  }
  ul.sv-card__facts {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 6px 0 2px;
    padding: 0;
    list-style: none;
    li {
      padding: 3px 10px;
      border-radius: 8px;
      background: var(--sv-surface);
      font-size: 13px;
      color: var(--sv-dark);
      white-space: nowrap;
    }
  }
  .sv-buy {
    margin-top: auto;
  }
}
.sv-buy {
  .sv-buy__add {
    width: 100%;
  }
}
.sv-qty {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) 46px;
  align-items: center;
  height: 46px;
  border-radius: 12px;
  background: var(--sv-soft);
  &__b {
    display: grid;
    place-items: center;
    height: 100%;
    padding: 0;
    border: 0;
    background: none;
    color: var(--sv-acc);
    cursor: pointer;
    border-radius: 12px;
    &:hover {
      background: #f7dfe8;
    }
  }
  &__v {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 3px;
    color: var(--sv-dark);
    input {
      min-width: 2ch;
      padding: 0;
      border: 0;
      outline: 0;
      background: none;
      text-align: center;
      font-weight: 700;
      font-size: 16px;
      color: var(--sv-dark);
      font-variant-numeric: tabular-nums;
    }
    span {
      font-size: 13px;
      color: var(--sv-muted);
      padding-right: 4px;
    }
  }
}
.sv-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid var(--sv-line);
  border-radius: 12px;
  background: #fff;
  color: var(--sv-dark);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  &.is-on {
    border-color: var(--sv-acc);
    background: var(--sv-soft);
    color: var(--sv-acc);
  }
}
.sv-field {
  display: grid;
  align-content: start;
  gap: 6px;
  > span {
    font-size: 14px;
    font-weight: 600;
    color: var(--sv-dark);
  }
  input {
    height: 50px;
    padding: 0 14px;
    border: 1.5px solid var(--sv-line);
    border-radius: 12px;
    background: #fff;
    outline: 0;
    &:focus {
      border-color: var(--sv-acc);
    }
  }
  &.is-err input {
    border-color: #d23c3c;
  }
  small {
    color: #c03535;
    font-size: 13px;
  }
}

/* подвал */
.sv-foot {
  margin-top: auto;
  padding: 48px 0 20px;
  background: var(--sv-surface);
  font-size: 14px;
  &__grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr 1.1fr;
    gap: 32px;
  }
  &__brand {
    display: grid;
    align-content: start;
    gap: 12px;
    img {
      width: 220px;
      height: auto;
      border-radius: 12px;
      mix-blend-mode: multiply;
    }
    p {
      color: var(--sv-muted);
    }
  }
  &__fake {
    display: flex;
    gap: 8px;
    font-size: 13px;
    .sv-icon {
      color: var(--sv-acc);
    }
  }
  h3 {
    margin-bottom: 12px;
    font-size: 16px;
  }
  ul.sv-foot__list {
    display: grid;
    gap: 7px;
    margin: 0;
    padding: 0;
    list-style: none;
    a:hover {
      color: var(--sv-acc);
    }
  }
  &__contacts {
    display: grid;
    align-content: start;
    gap: 4px;
    a:hover {
      color: var(--sv-acc);
    }
    small {
      margin-bottom: 6px;
      color: var(--sv-muted);
      font-size: 12px;
    }
  }
  &__phone {
    font: 800 18px/1.4 var(--sv-head);
    color: var(--sv-dark);
  }
  &__social {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    a {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: #fff;
    }
  }
  &__bottom {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 36px;
    padding-top: 18px;
    border-top: 1px solid var(--sv-line);
    font-size: 12px;
    color: var(--sv-muted);
    span:first-child {
      flex: 1 1 auto;
    }
  }
  &__up {
    background: #fff;
  }
}

/* таббар, меню, лист «В розницу», тост */
.sv-tabbar {
  display: none;
}
.sv-drawer,
.sv-sheet {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(30, 18, 12, 0.42);
}
.sv-drawer__panel {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: min(380px, 92vw);
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 14px 16px 24px;
  background: #fff;
  overflow-y: auto;
}
.sv-drawer {
  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: auto;
      height: 50px;
    }
  }
  &__cats {
    display: grid;
    gap: 2px;
    a {
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
      padding: 5px 6px;
      border-radius: 10px;
      &.is-on {
        background: var(--sv-soft);
      }
    }
    img {
      width: 34px;
      height: 40px;
      border-radius: 7px;
      object-fit: cover;
    }
    span {
      font-weight: 600;
      color: var(--sv-dark);
    }
    small {
      color: var(--sv-muted);
    }
  }
  &__retail {
    display: grid;
    gap: 8px;
    padding: 14px;
    border-radius: 16px;
    background: var(--sv-surface);
    > span {
      font-weight: 600;
      color: var(--sv-dark);
    }
    div {
      display: grid;
      gap: 6px;
    }
    a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 10px;
      background: #fff;
      font-weight: 500;
    }
  }
  &__contacts {
    display: grid;
    gap: 10px;
    a,
    span {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sv-icon {
      color: var(--sv-acc);
    }
  }
  &__phone {
    font-weight: 700;
    color: var(--sv-dark);
  }
}
.sv-sheet__panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  gap: 10px;
  padding: 16px 16px calc(20px + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0;
  background: #fff;
  p {
    color: var(--sv-muted);
    font-size: 14px;
  }
}
.sv-sheet {
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    b {
      font: 800 20px var(--sv-head);
      color: var(--sv-dark);
    }
  }
  &__a {
    display: grid;
    grid-template-columns: 28px 1fr 20px;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 14px;
    background: var(--sv-surface);
    font-weight: 600;
    color: var(--sv-dark);
  }
}
.sv-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 70;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: calc(100vw - 32px);
  padding: 12px 14px 12px 16px;
  border-radius: 16px;
  background: var(--sv-dark);
  color: #fff;
  box-shadow: 0 20px 40px rgba(30, 18, 12, 0.25);
  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sv-icon {
    color: #ffb3cf;
  }
  a {
    flex: none;
    padding: 6px 12px;
    border-radius: 10px;
    background: var(--sv-acc);
    font-weight: 600;
  }
}
.sv-fade-enter-active,
.sv-fade-leave-active {
  transition: opacity 0.25s;
}
.sv-fade-enter-from,
.sv-fade-leave-to {
  opacity: 0;
}

/* адаптив */
@media (max-width: 1520px) {
  .sv-strip__addr {
    display: none;
  }
}
@media (max-width: 1400px) {
  .sv-retail__label {
    display: none;
  }
  .sv-strip__phone:nth-of-type(2) {
    display: none;
  }
}
@media (max-width: 1199px) {
  .sv-head__in {
    gap: 12px;
  }
  .sv-logo img {
    height: 54px;
  }
  .sv-search__go {
    display: none;
  }
  .sv-head__order {
    width: auto;
    small {
      display: none;
    }
  }
  .sv-strip__mail {
    display: none;
  }
  .sv-foot__grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 989px) {
  .sv {
    --sv-headh: 128px;
  }
  .sv-head__in {
    flex-wrap: wrap;
    height: auto;
    padding-top: 10px;
    padding-bottom: 10px;
    row-gap: 10px;
  }
  .sv-search {
    order: 5;
    flex: 1 0 100%;
    height: 46px;
  }
  .sv-logo {
    margin-right: auto;
  }
  .sv-strip__what {
    margin-right: auto;
  }
  .sv-sechead h2 {
    font-size: 28px;
  }
}
@media (max-width: 768px) {
  .sv {
    --sv-headh: 118px;
  }
  .sv-wrap {
    padding-left: 16px;
    padding-right: 16px;
  }
  .sv-strip {
    display: none;
  }
  .sv-head__burger,
  .sv-head__call {
    display: inline-grid !important;
  }
  .sv-head__in {
    gap: 8px;
  }
  .sv-head__cats,
  .sv-retail,
  .sv-head__order {
    display: none !important;
  }
  .sv-logo img {
    height: 48px;
  }
  .sv-catalog {
    display: none;
  }
  .sv-main {
    padding-bottom: 40px;
  }
  .sv-section {
    padding-top: 48px;
  }
  .sv-sechead {
    flex-wrap: wrap;
    margin-bottom: 18px;
    h2 {
      font-size: 24px;
    }
  }
  .sv-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .sv-card {
    padding: 6px;
    border-radius: 16px;
    &__body {
      padding: 10px 4px 2px;
    }
    &__title {
      font-size: 16px !important;
    }
    &__switch button {
      font-size: 12px;
      padding: 0 2px;
    }
  }
  .sv-qty {
    grid-template-columns: 38px minmax(0, 1fr) 38px;
  }
  .sv-foot {
    padding-bottom: 96px;
  }
  .sv-foot__grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .sv-foot__bottom {
    flex-wrap: wrap;
    gap: 10px;
  }
  .sv-foot__up {
    display: none;
  }
  .sv-toast {
    bottom: 84px;
  }
  .sv-tabbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1px solid var(--sv-line);
    box-shadow: 0 -8px 24px rgba(61, 34, 22, 0.06);
    &__a {
      display: grid;
      justify-items: center;
      gap: 2px;
      padding: 6px 2px;
      border: 0;
      border-radius: 12px;
      background: none;
      color: var(--sv-muted);
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      &.is-on {
        color: var(--sv-acc);
        background: var(--sv-soft);
      }
      &:last-child:not(.is-on) {
        color: var(--sv-acc);
      }
    }
    &__ic {
      position: relative;
      display: grid;
      height: 20px;
      .sv-badge {
        position: absolute;
        top: -6px;
        right: -12px;
        min-width: 18px;
        height: 18px;
        font-size: 11px;
      }
    }
  }
}
@media (max-width: 375px) {
  .sv-logo img {
    height: 42px;
  }
  .sv-head__in {
    gap: 6px;
  }
  .sv-card__switch button {
    font-size: 11px;
  }
}
</style>
