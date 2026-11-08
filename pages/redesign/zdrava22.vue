<script lang="ts" setup>
import { ZD_BASE, zdContacts, zdHighlight, zdNav, zdOrig, zdPath } from '~/utils/zdrava22'
import { useZdNote, useZdUi } from '~/composables/useZdrava22'
import ZdIcon from '~/components/redesign/zdrava22/ZdIcon.vue'

const route = useRoute()
const note = useZdNote()
const ui = useZdUi()

useSeoMeta({
  title: 'Пасека «Ширяев и сыновья» — алтайский мёд | Концепт редизайна',
  description:
    'Концепт редизайна сайта zdrava22.ru: пять сортов алтайского мёда в рознице коробкой 12 кг и оптом куботейнером 34 кг, пыльца, перга, прополис, трутневый гомогенат, пчелопакеты, 148 отзывов, видео и фото пасеки.',
  ogTitle: 'Пасека «Ширяев и сыновья» — концепт редизайна',
  ogDescription: 'Алтайский мёд натуральный напрямую от производителя: розница коробкой, опт куботейнером, продукты пчеловодства.',
  ogImage: 'https://andryushov.me/redesign/zdrava22/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'zd-html', lang: 'ru' },
  bodyAttrs: { class: 'zd-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Roboto+Slab:wght@600;700&display=swap' },
  ],
})

const isHome = computed(() => route.path.replace(/\/$/, '') === ZD_BASE)
const isOn = (to: string) => {
  const p = to.split(/[?#]/)[0].replace(/\/$/, '')
  const r = route.path.replace(/\/$/, '')
  if (p.endsWith('/produkciya')) return r === p || r.startsWith(zdPath('/produkt'))
  return r === p
}
const year = new Date().getFullYear()

// Липкая шапка: белая строка «почта · слоган · адрес» уезжает, строка с меню остаётся у верха
const strip = ref<HTMLElement | null>(null)
const stick = ref(0)
const measure = () => {
  stick.value = strip.value?.offsetHeight ?? 0
}

// Выпадашки меню закрываются после перехода, пока курсор не уйдёт (иначе висят под мышью)
const quiet = ref(false)
const open = ref<string | null>(null)

// Лайтбокс
const shot = computed(() => (ui.gallery.value ? ui.gallery.value.items[ui.gallery.value.index] : null))
const step = (d: number) => {
  const g = ui.gallery.value
  if (!g) return
  g.index = (g.index + d + g.items.length) % g.items.length
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    ui.gallery.value = null
    ui.video.value = null
    ui.menu.value = false
  }
  if (ui.gallery.value && e.key === 'ArrowRight') step(1)
  if (ui.gallery.value && e.key === 'ArrowLeft') step(-1)
}

const locked = computed(() => !!ui.gallery.value || !!ui.video.value || ui.menu.value)
watch(locked, (v) => document.documentElement.classList.toggle('zd-lock', v))
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    ui.gallery.value = null
    ui.video.value = null
    open.value = null
    quiet.value = true
    ;(document.activeElement as HTMLElement | null)?.blur?.()
  },
)

onMounted(() => {
  note.persist()
  measure()
  window.addEventListener('resize', measure)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', measure)
  document.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('zd-lock')
})
</script>

<template>
  <div class="zd">
    <div class="zd-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="zdContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="zd-header" :style="{ top: `${-stick}px` }">
      <div ref="strip" class="zd-top">
        <div class="zd-wrap zd-top__row">
          <a :href="`mailto:${zdContacts.email}`" class="zd-top__item"><ZdIcon name="mail" :size="17" />{{ zdContacts.email }}</a>
          <NuxtLink :to="zdPath('/produkciya')" class="zd-top__slogan">{{ zdContacts.slogan }}</NuxtLink>
          <span class="zd-top__item zd-top__where"><ZdIcon name="pin" :size="17" />{{ zdContacts.addressShort }}</span>
        </div>
      </div>

      <div class="zd-wrap zd-bar zd-header__row" :class="{ 'is-quiet': quiet }" @mouseleave="quiet = false">
        <button type="button" class="zd-iconbtn zd-bar__burger" aria-label="Меню" @click="ui.menu.value = true"><ZdIcon name="menu" /></button>
        <NuxtLink :to="zdPath()" class="zd-logo" aria-label="Пасека «Ширяев и сыновья», на главную">
          <img :src="zdContacts.logo" alt="" width="165" height="188" />
          <span class="zd-logo__name"><b>Ширяев и сыновья</b><small>пасека на Алтае с 40-летним опытом</small></span>
        </NuxtLink>

        <nav class="zd-nav" aria-label="Разделы">
          <div v-for="n in zdNav" :key="n.label" class="zd-nav__item" :class="{ 'has-sub': n.sub, 'is-open': open === n.label }" @mouseleave="open = null">
            <NuxtLink :to="n.to" class="zd-nav__link" :class="{ 'is-on': isOn(n.to) }">
              {{ n.label }}<ZdIcon v-if="n.sub" name="right" :size="14" class="zd-nav__chev" />
            </NuxtLink>
            <div v-if="n.sub" class="zd-nav__pop">
              <NuxtLink v-for="s in n.sub" :key="s.label" :to="s.to">{{ s.label }}</NuxtLink>
            </div>
          </div>
        </nav>

        <a :href="`tel:${zdContacts.tel}`" class="zd-call">
          <ZdIcon name="phone" :size="20" />
          <span class="zd-call__txt"><b>{{ zdContacts.phone }}</b><small>Алексей Васильевич</small></span>
        </a>
        <NuxtLink :to="zdPath('/kontakty') + '#zakaz'" class="zd-btn zd-bar__order">
          Оформить заказ<span v-if="note.count.value" class="zd-bar__n">{{ note.count.value }}</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Выделенный жёлтый блок оригинала — его словами под шапкой каждой внутренней страницы (на главной он в первом экране) -->
    <div v-if="!isHome" class="zd-hl">
      <div class="zd-wrap zd-hl__row">
        <b class="zd-hl__title">{{ zdContacts.highlight }}</b>
        <div class="zd-hl__links">
          <NuxtLink v-for="h in zdHighlight" :key="h.label" :to="h.to">{{ h.label }}</NuxtLink>
        </div>
      </div>
    </div>

    <main class="zd-main">
      <NuxtPage />
    </main>

    <footer class="zd-foot">
      <div class="zd-wrap zd-foot__grid">
        <div class="zd-foot__brand">
          <NuxtLink :to="zdPath()" class="zd-logo zd-logo--foot">
            <img :src="zdContacts.logo" alt="" width="165" height="188" />
            <span class="zd-logo__name"><b>Ширяев и сыновья</b><small>{{ zdContacts.slogan }}</small></span>
          </NuxtLink>
          <p class="zd-foot__call">Просто позвоните мне:<a :href="`tel:${zdContacts.tel}`">{{ zdContacts.phone }}</a></p>
          <p class="zd-foot__muted">{{ zdContacts.motto }}</p>
        </div>
        <div>
          <h4>Продукция</h4>
          <ul class="zd-foot__list">
            <li v-for="s in zdNav[0].sub" :key="s.label"><NuxtLink :to="s.to">{{ s.label }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4>Пасека</h4>
          <ul class="zd-foot__list">
            <li v-for="n in zdNav.slice(1)" :key="n.label"><NuxtLink :to="n.to">{{ n.label }}</NuxtLink></li>
            <li><a :href="zdOrig('/karta-sajta')" target="_blank" rel="noopener">Карта сайта</a></li>
          </ul>
        </div>
        <div class="zd-foot__contacts">
          <h4>Контакты</h4>
          <a :href="`tel:${zdContacts.tel}`"><b>{{ zdContacts.phone }}</b><span>{{ zdContacts.owner }}</span></a>
          <a :href="`tel:${zdContacts.tel2}`"><b>{{ zdContacts.phone2 }}</b><span>{{ zdContacts.owner2 }}</span></a>
          <a :href="`mailto:${zdContacts.email}`"><b>{{ zdContacts.email }}</b><span>заказы и вопросы</span></a>
          <p>{{ zdContacts.address }}</p>
        </div>
      </div>
      <div class="zd-wrap zd-foot__legal">
        <span>© {{ year }} {{ zdContacts.legal }}</span>
        <span>Тексты, цены и изображения принадлежат пасеке «Ширяев и сыновья» (zdrava22.ru). Это концепт редизайна, не официальный сайт.</span>
      </div>
    </footer>

    <!-- Телефон: нижняя панель — заказ здесь звонком, СМС и письмом, как у оригинала -->
    <nav class="zd-dock" aria-label="Связаться">
      <a :href="`tel:${zdContacts.tel}`"><ZdIcon name="phone" /><span>Позвонить</span></a>
      <a :href="`sms:${zdContacts.tel}`"><ZdIcon name="sms" /><span>СМС</span></a>
      <a :href="`mailto:${zdContacts.email}`"><ZdIcon name="mail" /><span>Почта</span></a>
      <NuxtLink :to="zdPath('/kontakty') + '#zakaz'" class="zd-dock__main">
        <ZdIcon name="list" /><span>Заказ<i v-if="note.count.value">{{ note.count.value }}</i></span>
      </NuxtLink>
    </nav>

    <!-- Мобильное меню -->
    <div v-if="ui.menu.value" class="zd-drawer" @click.self="ui.menu.value = false">
      <div class="zd-drawer__panel">
        <div class="zd-drawer__head">
          <b>Меню</b>
          <button type="button" class="zd-iconbtn" aria-label="Закрыть" @click="ui.menu.value = false"><ZdIcon name="close" /></button>
        </div>
        <a :href="`tel:${zdContacts.tel}`" class="zd-drawer__call"><ZdIcon name="phone" /><span><b>{{ zdContacts.phone }}</b><small>Алексей Васильевич · лучше звонить с апреля по ноябрь</small></span></a>
        <div class="zd-drawer__hl">
          <b>{{ zdContacts.highlight }}</b>
          <NuxtLink v-for="h in zdHighlight" :key="h.label" :to="h.to">{{ h.label }}</NuxtLink>
        </div>
        <template v-for="n in zdNav" :key="n.label">
          <details v-if="n.sub" class="zd-drawer__group">
            <summary>{{ n.label }}<ZdIcon name="right" :size="16" /></summary>
            <NuxtLink :to="n.to">Все: {{ n.label.toLowerCase() }}</NuxtLink>
            <NuxtLink v-for="s in n.sub" :key="s.label" :to="s.to">{{ s.label }}</NuxtLink>
          </details>
          <NuxtLink v-else :to="n.to" class="zd-drawer__link">{{ n.label }}<ZdIcon name="right" :size="16" /></NuxtLink>
        </template>
        <a :href="`mailto:${zdContacts.email}`" class="zd-drawer__link zd-drawer__mail"><ZdIcon name="mail" :size="18" />{{ zdContacts.email }}</a>
      </div>
    </div>

    <!-- Лайтбокс -->
    <div v-if="ui.gallery.value && shot" class="zd-lightbox" @click.self="ui.gallery.value = null">
      <button type="button" class="zd-lightbox__close" aria-label="Закрыть" @click="ui.gallery.value = null"><ZdIcon name="close" /></button>
      <button v-if="ui.gallery.value.items.length > 1" type="button" class="zd-lightbox__nav zd-lightbox__nav--prev" aria-label="Предыдущее" @click="step(-1)"><ZdIcon name="left" /></button>
      <figure>
        <img :src="shot.full" :alt="ui.gallery.value.title" />
        <figcaption>{{ ui.gallery.value.title }} · {{ ui.gallery.value.index + 1 }} из {{ ui.gallery.value.items.length }}</figcaption>
      </figure>
      <button v-if="ui.gallery.value.items.length > 1" type="button" class="zd-lightbox__nav zd-lightbox__nav--next" aria-label="Следующее" @click="step(1)"><ZdIcon name="right" /></button>
    </div>

    <!-- Видео -->
    <div v-if="ui.video.value" class="zd-lightbox" @click.self="ui.video.value = null">
      <button type="button" class="zd-lightbox__close" aria-label="Закрыть" @click="ui.video.value = null"><ZdIcon name="close" /></button>
      <figure class="zd-lightbox__video">
        <video :src="ui.video.value.src" controls autoplay playsinline preload="metadata" />
        <figcaption>{{ ui.video.value.title }}</figcaption>
      </figure>
    </div>

    <div v-if="ui.toast.value" class="zd-toast" role="status">{{ ui.toast.value }}</div>
  </div>
</template>

<style lang="scss">
.zd-body {
  background: #fff;
}
html.zd-html {
  scroll-padding-top: 96px;
  scroll-behavior: smooth;

  @media (max-width: 1199px) {
    scroll-padding-top: 80px;
  }
}
html.zd-lock {
  overflow: hidden;
}

.zd {
  --zd-accent: #243182;
  --zd-accent-hover: #1a2466;
  --zd-soft: #e8ebf7;
  --zd-ink: #1c2133;
  --zd-text: #363a48;
  --zd-muted: #686d80;
  --zd-surface: #f2f3f8;
  --zd-line: #e2e4ed;
  --zd-yellow: #ffcc00;
  --zd-yellow-soft: #fff3c4;
  --zd-r: 12px;
  --zd-R: 24px;
  --zd-pop: 0 2px 6px rgba(28, 33, 51, 0.08), 0 22px 54px rgba(28, 33, 51, 0.22);
  min-height: 100vh;
  background: #fff;
  color: var(--zd-text);
  font-family: 'Open Sans', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.6;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    padding-bottom: 64px;
  }
}

:where(.zd) h1,
:where(.zd) h2,
:where(.zd) h3,
:where(.zd) h4,
:where(.zd) p,
:where(.zd) figure,
:where(.zd) blockquote,
:where(.zd) dl,
:where(.zd) dd {
  margin: 0;
}
:where(.zd) h1,
:where(.zd) h2,
:where(.zd) h3,
:where(.zd) h4 {
  color: var(--zd-ink);
  font-family: 'Roboto Slab', Georgia, serif;
  font-weight: 700;
  line-height: 1.2;
}
:where(.zd) a {
  color: inherit;
  text-decoration: none;
}
:where(.zd) img {
  display: block;
  max-width: 100%;
}
:where(.zd) button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  border: 0;
  background: none;
  padding: 0;
}
:where(.zd) input,
:where(.zd) textarea,
:where(.zd) select {
  font: inherit;
  color: inherit;
}
:where(.zd) ul,
:where(.zd) ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

.zd-wrap {
  width: 100%;
  max-width: 1360px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 32px;
  padding-right: 32px;

  @media (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
}

/* ---------- Кнопки, метки ---------- */
.zd-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 20px;
  border-radius: var(--zd-r);
  background: var(--zd-accent);
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.2;
  white-space: nowrap;
  text-align: center;
  transition: background 0.15s, color 0.15s, border-color 0.15s;

  &:hover {
    background: var(--zd-accent-hover);
  }
  &--line,
  &--line:focus,
  &--line:active {
    background: #fff;
    color: var(--zd-ink);
    border: 1px solid #cfd3e2;
  }
  &--line:hover {
    background: #fff;
    border-color: var(--zd-accent);
    color: var(--zd-accent);
  }
  &--yellow {
    background: var(--zd-yellow);
    color: var(--zd-ink);

    &:hover {
      background: #f2c000;
    }
  }
  &--big {
    min-height: 52px;
    padding: 12px 26px;
    font-size: 16px;
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}
.zd-iconbtn {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--zd-r);
  color: var(--zd-ink);

  &:hover {
    background: var(--zd-surface);
  }
}
.zd-mark {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 8px;
  background: var(--zd-yellow-soft);
  color: #6a5300;
  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
}
.zd-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--zd-accent);
  font-weight: 600;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

/* ---------- Баннер концепта ---------- */
.zd-banner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
  padding: 8px 16px;
  background: var(--zd-ink);
  color: #fff;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;

  a {
    color: var(--zd-yellow);
    font-weight: 600;
    text-decoration: underline;
  }
}

/* ---------- Шапка ---------- */
.zd-header {
  position: sticky;
  z-index: 40;
  background: #fff;
  border-bottom: 1px solid var(--zd-line);
}
.zd-top {
  border-bottom: 1px solid var(--zd-line);
  font-size: 13px;
  color: var(--zd-muted);

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 38px;
  }
  &__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
  a.zd-top__item:hover {
    color: var(--zd-accent);
  }
  &__slogan {
    font-family: 'Roboto Slab', serif;
    font-weight: 600;
    color: var(--zd-accent);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    &__where {
      display: none;
    }
  }
  @media (max-width: 576px) {
    &__row {
      justify-content: center;
    }
    &__slogan {
      display: none;
    }
  }
}
.zd-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 76px;

  &__burger {
    display: none;
  }
  &__order {
    position: relative;
    flex: none;
  }
  &__n {
    display: inline-grid;
    place-items: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 11px;
    background: var(--zd-yellow);
    color: var(--zd-ink);
    font-size: 12px;
    font-weight: 700;
  }

  @media (max-width: 1199px) {
    gap: 10px;
    min-height: 64px;

    &__burger {
      display: inline-grid;
      margin-left: -10px;
    }
  }
  @media (max-width: 576px) {
    &__order {
      display: none;
    }
  }
}
.zd-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: none;

  img {
    width: auto;
    height: 52px;
  }
  &__name {
    display: grid;
    line-height: 1.25;

    b {
      font-family: 'Roboto Slab', serif;
      font-size: 18px;
      color: var(--zd-ink);
    }
    small {
      font-size: 12px;
      color: var(--zd-muted);
    }
  }
  .zd-bar &__name {
    display: none;
  }

  @media (max-width: 1199px) {
    img {
      height: 44px;
    }
    .zd-bar & {
      margin-right: auto;
    }
    .zd-bar &__name {
      display: grid;

      small {
        display: none;
      }
      b {
        font-size: 16px;
      }
    }
  }
  @media (max-width: 375px) {
    gap: 8px;

    .zd-bar &__name b {
      font-size: 15px;
    }
  }
}
.zd-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-right: auto;

  &__item {
    position: relative;
  }
  &__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 10px 11px;
    border-radius: 10px;
    font-weight: 600;
    color: var(--zd-ink);
    white-space: nowrap;

    &:hover,
    &.is-on {
      color: var(--zd-accent);
    }
    &.is-on {
      background: var(--zd-soft);
    }
  }
  &__chev {
    transform: rotate(90deg);
    opacity: 0.6;
  }
  &__pop {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 5;
    display: none;
    min-width: 260px;
    padding: 8px;
    border-radius: 16px;
    border: 1px solid var(--zd-line);
    background: #fff;
    box-shadow: var(--zd-pop);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: -10px;
      height: 10px;
    }
    a {
      display: block;
      padding: 8px 12px;
      border-radius: 10px;
      white-space: nowrap;
      font-size: 14px;

      &:hover {
        background: var(--zd-surface);
        color: var(--zd-accent);
      }
    }
  }
  &__item:hover &__pop,
  &__item:focus-within &__pop {
    display: block;
  }
  .is-quiet &__item &__pop {
    display: none;
  }

  @media (max-width: 1199px) {
    display: none;
  }
}
.zd-call {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex: none;
  color: var(--zd-ink);

  svg {
    color: var(--zd-accent);
  }
  &__txt {
    display: grid;
    line-height: 1.25;

    b {
      font-size: 16px;
      white-space: nowrap;
    }
    small {
      font-size: 12px;
      color: var(--zd-muted);
    }
  }
  &:hover b {
    color: var(--zd-accent);
  }

  @media (max-width: 1400px) {
    &__txt {
      display: none;
    }
    width: 44px;
    height: 44px;
    justify-content: center;
    border-radius: var(--zd-r);
    background: var(--zd-soft);
  }
  @media (max-width: 1199px) {
    background: none;
  }
}

/* ---------- Жёлтая полоса — выделенное меню оригинала ---------- */
.zd-hl {
  background: var(--zd-yellow);
  color: var(--zd-ink);

  &__row {
    display: flex;
    align-items: center;
    gap: 20px;
    min-height: 50px;
  }
  &__title {
    flex: none;
    font-family: 'Roboto Slab', serif;
    font-size: 14px;
    line-height: 1.3;
    max-width: 260px;
  }
  &__links {
    display: flex;
    gap: 4px;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
    mask-image: linear-gradient(90deg, #000 calc(100% - 32px), transparent);

    &::-webkit-scrollbar {
      display: none;
    }
    a {
      flex: none;
      padding: 6px 12px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;

      &:hover,
      &.router-link-exact-active {
        background: rgba(255, 255, 255, 0.55);
      }
    }
  }

  @media (max-width: 989px) {
    &__row {
      display: grid;
      gap: 2px;
      padding-top: 8px;
      padding-bottom: 6px;
    }
    &__title {
      max-width: none;
      font-size: 13px;
    }
    &__links {
      margin-left: -12px;

      a {
        font-size: 13px;
      }
    }
  }
}

/* ---------- Общие блоки страниц ---------- */
.zd-main {
  padding-bottom: 72px;

  @media (max-width: 768px) {
    padding-bottom: 48px;
  }
}
.zd-sec {
  padding-top: 64px;

  @media (max-width: 768px) {
    padding-top: 44px;
  }
}
.zd-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
  margin-bottom: 24px;

  h2 {
    font-size: 32px;
  }
  p {
    margin-top: 6px;
    color: var(--zd-muted);
    max-width: 640px;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 25px;
    }
  }
}
.zd-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  padding-top: 20px;
  font-size: 13px;
  color: var(--zd-muted);

  a:hover {
    color: var(--zd-accent);
  }
  span::before {
    content: '/';
    margin-right: 8px;
    opacity: 0.5;
  }
}
.zd-pagehead {
  padding-top: 12px;

  h1 {
    font-size: 40px;
  }
  p {
    margin-top: 10px;
    max-width: 760px;
    font-size: 16px;
    color: var(--zd-muted);
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 28px;
    }
    p {
      font-size: 15px;
    }
  }
}
.zd-facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  li {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 18px;
    border-radius: 20px;
    background: var(--zd-surface);
  }
  svg {
    flex: none;
    color: var(--zd-accent);
  }
  b {
    display: block;
    font-family: 'Roboto Slab', serif;
    font-size: 18px;
    color: var(--zd-ink);
    line-height: 1.25;
  }
  span {
    display: block;
    margin-top: 3px;
    font-size: 13px;
    line-height: 1.45;
    color: var(--zd-muted);
  }

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;

    li {
      padding: 14px 16px;
    }
  }
}
.zd-review {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 22px;
  border-radius: 20px;
  background: var(--zd-surface);

  &__head {
    display: grid;
    gap: 0;

    b {
      color: var(--zd-ink);
    }
    time {
      color: var(--zd-muted);
      font-size: 13px;
    }
  }
  p {
    font-size: 15px;
    overflow-wrap: anywhere;
  }
}
.zd-steps {
  display: grid;
  gap: 4px;

  li {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid var(--zd-line);

    &:last-child {
      border-bottom: 0;
    }
  }
  i {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: var(--zd-yellow-soft);
    color: var(--zd-ink);
  }
  b {
    display: block;
    color: var(--zd-ink);
  }
  span {
    display: block;
    margin-top: 2px;
    color: var(--zd-muted);
    font-size: 14px;
  }
}
.zd-partners {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  &__card {
    display: grid;
    gap: 2px;
    padding: 18px 20px;
    border-radius: 18px;
    border: 1px solid var(--zd-line);
    background: #fff;

    small {
      color: var(--zd-muted);
      font-size: 13px;
    }
    b {
      font-family: 'Roboto Slab', serif;
      font-size: 19px;
      color: var(--zd-ink);
    }
    a {
      margin-top: 6px;
      color: var(--zd-accent);
      font-weight: 600;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.zd-field {
  display: grid;
  align-content: start;
  gap: 6px;
  min-width: 0;

  > span {
    font-size: 13px;
    font-weight: 600;
    color: var(--zd-ink);
  }
  input,
  textarea,
  select {
    width: 100%;
    min-width: 0;
    padding: 12px 14px;
    border-radius: var(--zd-r);
    border: 1px solid #cfd3e2;
    background: #fff;
    font-size: 15px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:focus {
      border-color: var(--zd-accent);
      box-shadow: 0 0 0 3px rgba(36, 49, 130, 0.14);
    }
  }
  textarea {
    resize: vertical;
    min-height: 96px;
  }
  small {
    font-size: 12px;
    color: var(--zd-muted);
    line-height: 1.45;
  }
}
.zd-qty {
  display: inline-grid;
  grid-template-columns: 40px auto 40px;
  align-items: center;
  height: 40px;
  border-radius: 12px;
  background: var(--zd-surface);

  &__btn {
    display: grid;
    place-items: center;
    height: 40px;
    border-radius: 12px;
    color: var(--zd-ink);

    &:hover {
      background: var(--zd-soft);
      color: var(--zd-accent);
    }
  }
  &__val {
    min-width: 76px;
    padding: 0 6px;
    text-align: center;
    font-weight: 700;
    font-size: 14px;
    color: var(--zd-ink);
    white-space: nowrap;
  }
}
.zd-pager {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-top: 28px;

  button {
    min-width: 44px;
    height: 44px;
    padding: 0 14px;
    border-radius: 12px;
    background: var(--zd-surface);
    font-weight: 600;

    &.is-on {
      background: var(--zd-accent);
      color: #fff;
    }
    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
}

/* ---------- Мёд ---------- */
.zd-honey {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 20px;
  align-items: start;

  &__list {
    display: grid;
    gap: 12px;
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.zd-tare {
  position: sticky;
  top: 96px;
  border-radius: 20px;
  background: var(--zd-surface);
  overflow: hidden;

  &__ph {
    position: relative;
    aspect-ratio: 4 / 3;
    background: #fff;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__body {
    display: grid;
    gap: 14px;
    padding: 18px 20px 20px;

    h3 {
      font-size: 19px;
    }
  }
  ul.zd-tare__facts {
    display: grid;
    gap: 8px;

    li {
      display: flex;
      gap: 8px;
      font-size: 14px;
    }
    svg {
      flex: none;
      margin-top: 2px;
      color: var(--zd-accent);
    }
  }

  @media (max-width: 1199px) {
    position: static;
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);

    &__ph {
      aspect-ratio: auto;
      min-height: 200px;
    }
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);

    &__ph {
      aspect-ratio: 16 / 9;
      min-height: 0;
    }
  }
}

/* ---------- Продукты пчеловодства ---------- */
.zd-items {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 989px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.zd-pack {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 16px;
  padding: 12px 24px 12px 12px;
  border-radius: 20px;
  background: var(--zd-surface);

  img {
    flex: none;
    width: 120px;
    height: 84px;
    border-radius: 14px;
    object-fit: cover;
  }
  &__txt {
    display: grid;
    flex: 1;
    min-width: 0;

    b {
      font-family: 'Roboto Slab', serif;
      font-size: 18px;
      color: var(--zd-ink);
    }
    small {
      color: var(--zd-muted);
      font-size: 14px;
    }
  }
  &__price {
    font-size: 21px;
    font-weight: 700;
    color: var(--zd-ink);
    white-space: nowrap;

    small {
      font-size: 14px;
      color: var(--zd-muted);
    }
  }
  > svg {
    flex: none;
    color: var(--zd-accent);
  }
  &:hover b {
    color: var(--zd-accent);
  }

  @media (max-width: 576px) {
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px;

    img {
      width: 96px;
      height: 72px;
    }
    &__txt {
      flex: 1 1 150px;
    }
    &__price {
      padding-left: 4px;
    }
    > svg {
      margin-left: auto;
    }
  }
}

/* ---------- Подвал ---------- */
.zd-foot {
  background: var(--zd-surface);
  border-top: 1px solid var(--zd-line);
  padding-top: 48px;
  font-size: 14px;

  &__grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr 0.8fr 1.1fr;
    gap: 32px;
  }
  h4 {
    margin-bottom: 12px;
    font-size: 16px;
  }
  &__list {
    display: grid;
    gap: 6px;

    a:hover {
      color: var(--zd-accent);
    }
  }
  &__call {
    display: grid;
    margin-top: 18px;
    color: var(--zd-muted);

    a {
      font-family: 'Roboto Slab', serif;
      font-size: 24px;
      font-weight: 700;
      color: var(--zd-accent);
    }
  }
  &__muted {
    margin-top: 6px;
    color: var(--zd-muted);
  }
  &__contacts {
    display: grid;
    align-content: start;
    gap: 10px;

    a {
      display: grid;

      b {
        color: var(--zd-ink);
      }
      span {
        font-size: 13px;
        color: var(--zd-muted);
      }
      &:hover b {
        color: var(--zd-accent);
      }
    }
    p {
      color: var(--zd-muted);
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
    border-top: 1px solid var(--zd-line);
    font-size: 12px;
    color: var(--zd-muted);
  }

  @media (max-width: 1199px) {
    &__grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (max-width: 576px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
  }
}
.zd-logo--foot img {
  height: 64px;
}

/* ---------- Нижняя панель на телефоне ---------- */
.zd-dock {
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 45;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4px;
    padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1px solid var(--zd-line);
    box-shadow: 0 -6px 20px rgba(28, 33, 51, 0.06);

    a {
      display: grid;
      justify-items: center;
      gap: 2px;
      padding: 4px 2px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      color: var(--zd-ink);

      svg {
        color: var(--zd-accent);
      }
      i {
        display: inline-grid;
        place-items: center;
        min-width: 17px;
        height: 17px;
        margin-left: 4px;
        border-radius: 9px;
        background: var(--zd-yellow);
        font-style: normal;
        font-size: 11px;
      }
    }
    &__main {
      background: var(--zd-accent);
      color: #fff !important;

      svg {
        color: #fff !important;
      }
      i {
        color: var(--zd-ink);
      }
    }
  }
}

/* ---------- Меню на телефоне ---------- */
.zd-drawer {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(28, 33, 51, 0.45);

  &__panel {
    width: min(400px, 100%);
    height: 100%;
    overflow-y: auto;
    padding: 12px 16px 32px;
    background: #fff;
  }
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    b {
      font-family: 'Roboto Slab', serif;
      font-size: 20px;
      color: var(--zd-ink);
    }
  }
  &__call {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 14px;
    border-radius: 16px;
    background: var(--zd-soft);
    color: var(--zd-accent);

    span {
      display: grid;
      color: var(--zd-ink);
    }
    b {
      font-size: 18px;
    }
    small {
      font-size: 12px;
      color: var(--zd-muted);
    }
  }
  &__hl {
    display: grid;
    margin-top: 12px;
    padding: 14px 16px;
    border-radius: 16px;
    background: var(--zd-yellow);
    color: var(--zd-ink);

    b {
      font-family: 'Roboto Slab', serif;
      font-size: 15px;
      line-height: 1.3;
      margin-bottom: 6px;
    }
    a {
      padding: 6px 0;
      font-weight: 600;
      border-top: 1px solid rgba(28, 33, 51, 0.12);
    }
  }
  &__group,
  &__link {
    border-bottom: 1px solid var(--zd-line);
  }
  &__link,
  &__group summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 14px 4px;
    font-weight: 600;
    font-size: 16px;
    color: var(--zd-ink);
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }
  }
  &__group[open] summary svg {
    transform: rotate(90deg);
  }
  &__group a {
    display: block;
    padding: 8px 12px;
    color: var(--zd-text);
  }
  &__group a:last-child {
    margin-bottom: 10px;
  }
  &__mail {
    justify-content: flex-start;
    color: var(--zd-accent);
    border-bottom: 0;
  }
}

/* ---------- Лайтбокс и видео ---------- */
.zd-lightbox {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 56px 72px;
  background: rgba(14, 17, 28, 0.9);

  figure {
    display: grid;
    gap: 10px;
    justify-items: center;
    max-width: 100%;
    max-height: 100%;
  }
  img,
  video {
    max-width: 100%;
    max-height: calc(100vh - 140px);
    border-radius: 14px;
    background: #000;
  }
  &__video {
    width: min(960px, 100%);

    video {
      width: 100%;
    }
  }
  figcaption {
    color: #fff;
    font-size: 14px;
    text-align: center;
  }
  &__close,
  &__nav {
    position: absolute;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;

    &:hover {
      background: rgba(255, 255, 255, 0.24);
    }
  }
  &__close {
    top: 16px;
    right: 16px;
  }
  &__nav {
    top: 50%;
    transform: translateY(-50%);

    &--prev {
      left: 16px;
    }
    &--next {
      right: 16px;
    }
  }

  @media (max-width: 768px) {
    padding: 72px 12px;

    &__nav {
      top: auto;
      bottom: 16px;
      transform: none;
    }
  }
}
.zd-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 80;
  transform: translateX(-50%);
  width: max-content;
  max-width: calc(100% - 32px);
  padding: 12px 18px;
  border-radius: 14px;
  background: var(--zd-ink);
  color: #fff;
  font-size: 14px;
  box-shadow: var(--zd-pop);

  @media (max-width: 768px) {
    bottom: 80px;
  }
}
</style>
