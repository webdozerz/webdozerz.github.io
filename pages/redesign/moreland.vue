<script lang="ts" setup>
import { ML_ORIG, mlAsset, mlContacts, mlGroups, mlMenu, mlPath, mlRub0 } from '~/utils/moreland'
import { useMlList, useMlUi } from '~/composables/useMoreland'
import MlIcon from '~/components/redesign/moreland/MlIcon.vue'

const route = useRoute()
const list = useMlList()
const ui = useMlUi()

useSeoMeta({
  title: 'Морелэнд — копчёная и вяленая рыба, пресервы оптом, Омск | Концепт редизайна',
  description:
    'Концепт редизайна moreland.ru: рыбный цех в Омске с 1998 года — 74 позиции копчёной, вяленой рыбы и пресервов с оптовыми ценами из прайса и новостей, заявка коробками.',
  ogTitle: 'Морелэнд — концепт редизайна',
  ogDescription: 'Копчёная и вяленая рыба, пресервы оптом от коробки: цена за кг и за коробку, свежие партии из коптильни, заявка в пару кликов.',
  ogImage: 'https://andryushov.me/redesign/moreland/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { lang: 'ru' },
  link: [
    { rel: 'icon', type: 'image/png', href: mlAsset('logo.png') },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bitter:wght@600;700;800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800&display=swap' },
  ],
})

const to = (p: string) => mlPath(p)
const isOn = (p: string) => route.path.startsWith(mlPath(p).replace(/\/$/, ''))
const left = mlMenu.slice(0, 2)
const right = mlMenu.slice(2)
const year = new Date().getFullYear()

// «Написать нам» — их попап: Имя, E-mail, Текст сообщения, все поля обязательны
const form = reactive({ name: '', mail: '', text: '', done: false, tried: false })
const mailOk = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.mail.trim()))
watch(
  () => ui.write.value.open,
  (v) => {
    if (v) {
      form.text = ui.write.value.text || form.text
      form.done = false
      form.tried = false
    }
  },
)
const send = () => {
  form.tried = true
  if (!form.name.trim() || !mailOk.value || !form.text.trim()) return
  form.done = true
}
const closeWrite = () => (ui.write.value = { open: false, text: '' })
const openWrite = () => (ui.write.value = { open: true, text: '' })

let toastTimer: ReturnType<typeof setTimeout> | undefined
watch(
  () => list.toast.value?.id,
  () => {
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => (list.toast.value = null), 3600)
  },
)
const locked = computed(() => ui.write.value.open || ui.menu.value)
watch(locked, (v) => {
  if (import.meta.client) document.documentElement.style.overflow = v ? 'hidden' : ''
})
watch(
  () => route.fullPath,
  () => {
    ui.menu.value = false
    closeWrite()
    ;(document.activeElement as HTMLElement | null)?.blur?.()
  },
)
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeWrite()
    ui.menu.value = false
  }
}
const up = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => {
  list.persist()
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  clearTimeout(toastTimer)
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div class="ml">
    <div class="ml-concept">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="ML_ORIG" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <!-- служебная строка уезжает при прокрутке -->
    <div class="ml-strip">
      <div class="ml-wrap ml-strip__in">
        <span class="ml-strip__item ml-strip__addr"><MlIcon name="pin" />{{ mlContacts.addressShort }}</span>
        <span class="ml-strip__item ml-strip__opt"><MlIcon name="box" />Опт от коробки · юр. лица и ИП</span>
        <a class="ml-strip__item ml-strip__mail" :href="`mailto:${mlContacts.email}`"><MlIcon name="mail" />{{ mlContacts.email }}</a>
        <NuxtLink class="ml-strip__item ml-strip__sub" :to="to('/podpiska/')"><MlIcon name="bell" />Подписаться на новости и цены</NuxtLink>
      </div>
    </div>

    <header class="ml-head">
      <div class="ml-wrap ml-head__in ml-header__row">
        <div class="ml-head__side">
          <button type="button" class="ml-iconbtn ml-head__burger" aria-label="Меню" @click="ui.menu.value = true"><MlIcon name="menu" /></button>
          <a class="ml-head__phone" :href="`tel:${mlContacts.tel}`"><MlIcon name="phone" /><span>{{ mlContacts.phone }}</span></a>
          <nav class="ml-nav" aria-label="Меню">
            <NuxtLink v-for="m in left" :key="m.to" :to="to(m.to)" class="ml-nav__a" :class="{ 'is-on': isOn(m.to) }">{{ m.label }}</NuxtLink>
          </nav>
        </div>
        <NuxtLink :to="to('/')" class="ml-logo" aria-label="Морелэнд — на главную"><img :src="mlAsset('logo.png')" alt="Морелэнд" width="173" height="99" /></NuxtLink>
        <div class="ml-head__side ml-head__side--r">
          <nav class="ml-nav" aria-label="Меню, продолжение">
            <NuxtLink v-for="m in right" :key="m.to" :to="to(m.to)" class="ml-nav__a" :class="{ 'is-on': isOn(m.to) }">{{ m.label }}</NuxtLink>
          </nav>
          <button type="button" class="ml-btn ml-btn--line ml-head__write" @click="openWrite"><MlIcon name="mail" /><span>Написать нам</span></button>
          <NuxtLink :to="to('/zayavka/')" class="ml-btn ml-head__list" :class="{ 'is-full': list.count.value }">
            <MlIcon name="list" /><span class="ml-head__listword">Заявка</span>
            <em v-if="list.count.value" class="ml-badge">{{ list.count.value }}</em>
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="ml-main"><NuxtPage /></main>

    <footer class="ml-foot">
      <div class="ml-foot__wave" aria-hidden="true" />
      <div class="ml-wrap ml-foot__grid">
        <div class="ml-foot__brand">
          <img :src="mlAsset('logo.png')" alt="Морелэнд" width="173" height="99" />
          <p>Рыбный цех в Омске: холодное и горячее копчение, вяленая и слабосолёная рыба, пресервы. Лучшее качество с 1998 года.</p>
        </div>
        <div>
          <h3>Продукция</h3>
          <ul class="ml-foot__list">
            <li v-for="g in mlGroups" :key="g.id"><NuxtLink :to="to(`/produkcija/${g.id}/`)">{{ g.name }}</NuxtLink></li>
            <li><NuxtLink :to="to('/zayavka/')">Заявка</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3>Компания</h3>
          <ul class="ml-foot__list">
            <li v-for="m in mlMenu" :key="m.to"><NuxtLink :to="to(m.to)">{{ m.label }}</NuxtLink></li>
            <li><NuxtLink :to="to('/podpiska/')">Подписаться</NuxtLink></li>
            <li><NuxtLink :to="to('/auth/')">Вход</NuxtLink></li>
          </ul>
        </div>
        <div class="ml-foot__contacts">
          <h3>Контакты</h3>
          <a class="ml-foot__phone" :href="`tel:${mlContacts.tel}`">{{ mlContacts.phone }}</a>
          <a :href="`mailto:${mlContacts.email}`">{{ mlContacts.email }}</a>
          <span>{{ mlContacts.address }}</span>
          <button type="button" class="ml-btn ml-btn--line" @click="openWrite">Написать нам</button>
        </div>
      </div>
      <div class="ml-wrap ml-foot__bottom">
        <span>© Морелэнд — {{ year }}. {{ mlContacts.legal }}</span>
        <span>Тексты, цены и изображения принадлежат владельцу сайта moreland.ru и показаны в концепте для примера.</span>
        <button type="button" class="ml-iconbtn ml-foot__up" aria-label="Наверх" @click="up"><MlIcon name="up" /></button>
      </div>
    </footer>

    <!-- нижняя панель на телефоне -->
    <nav class="ml-tabbar" aria-label="Быстрые действия">
      <NuxtLink :to="to('/produkcija/')" class="ml-tabbar__a" :class="{ 'is-on': isOn('/produkcija/') }"><MlIcon name="box" /><span>Продукция</span></NuxtLink>
      <NuxtLink :to="to('/novosti/')" class="ml-tabbar__a" :class="{ 'is-on': isOn('/novosti/') }"><MlIcon name="smoke" /><span>Новости</span></NuxtLink>
      <a :href="`tel:${mlContacts.tel}`" class="ml-tabbar__a"><MlIcon name="phone" /><span>Позвонить</span></a>
      <NuxtLink :to="to('/zayavka/')" class="ml-tabbar__a ml-tabbar__list" :class="{ 'is-on': isOn('/zayavka/') }">
        <span class="ml-tabbar__ic"><MlIcon name="list" /><em v-if="list.count.value" class="ml-badge">{{ list.count.value }}</em></span>
        <span>{{ list.total.value ? mlRub0(list.total.value) : 'Заявка' }}</span>
      </NuxtLink>
    </nav>

    <!-- меню на телефоне -->
    <div v-if="ui.menu.value" class="ml-drawer" @click.self="ui.menu.value = false">
      <div class="ml-drawer__panel" role="dialog" aria-label="Меню">
        <div class="ml-drawer__top">
          <img :src="mlAsset('logo.png')" alt="Морелэнд" width="173" height="99" />
          <button type="button" class="ml-iconbtn" aria-label="Закрыть меню" @click="ui.menu.value = false"><MlIcon name="close" /></button>
        </div>
        <nav class="ml-drawer__nav">
          <NuxtLink v-for="m in mlMenu" :key="m.to" :to="to(m.to)" :class="{ 'is-on': isOn(m.to) }">{{ m.label }}<MlIcon name="right" /></NuxtLink>
        </nav>
        <div class="ml-drawer__groups">
          <NuxtLink v-for="g in mlGroups" :key="g.id" :to="to(`/produkcija/${g.id}/`)"><img :src="g.img" :alt="g.name" width="64" height="64" />{{ g.name }}</NuxtLink>
        </div>
        <div class="ml-drawer__contacts">
          <a class="ml-drawer__phone" :href="`tel:${mlContacts.tel}`"><MlIcon name="phone" />{{ mlContacts.phone }}</a>
          <a :href="`mailto:${mlContacts.email}`"><MlIcon name="mail" />{{ mlContacts.email }}</a>
          <NuxtLink :to="to('/podpiska/')"><MlIcon name="bell" />Подписаться на новости и цены</NuxtLink>
          <button type="button" class="ml-btn" @click="openWrite"><MlIcon name="mail" />Написать нам</button>
        </div>
      </div>
    </div>

    <!-- попап «Написать нам» -->
    <div v-if="ui.write.value.open" class="ml-modal" @click.self="closeWrite">
      <div class="ml-modal__box" role="dialog" aria-labelledby="ml-write-h">
        <button type="button" class="ml-iconbtn ml-modal__x" aria-label="Закрыть" @click="closeWrite"><MlIcon name="close" /></button>
        <template v-if="!form.done">
          <h2 id="ml-write-h">Написать нам</h2>
          <p class="ml-modal__lead">Менеджер ответит на {{ mlContacts.email }} — по поставкам, ценам и отгрузке.</p>
          <form class="ml-form" novalidate @submit.prevent="send">
            <label class="ml-field" :class="{ 'is-err': form.tried && !form.name.trim() }">
              <span>Имя</span><input v-model="form.name" autocomplete="name" placeholder="Как к вам обращаться" />
            </label>
            <label class="ml-field" :class="{ 'is-err': form.tried && !mailOk }">
              <span>E-mail</span><input v-model="form.mail" type="email" autocomplete="email" placeholder="name@company.ru" />
            </label>
            <label class="ml-field" :class="{ 'is-err': form.tried && !form.text.trim() }">
              <span>Текст сообщения</span><textarea v-model="form.text" rows="6" placeholder="Что нужно, в каком объёме, куда отгрузить" />
            </label>
            <p class="ml-form__note">Все поля обязательны. Демо: сообщение никуда не уйдёт.</p>
            <button type="submit" class="ml-btn ml-btn--wide">Отправить</button>
          </form>
        </template>
        <div v-else class="ml-modal__done">
          <span class="ml-modal__ok"><MlIcon name="check" /></span>
          <h2>Сообщение отправлено</h2>
          <p>В настоящем сайте оно уйдёт менеджерам на {{ mlContacts.email }}. Это демо-макет — ничего не отправлено.</p>
          <button type="button" class="ml-btn" @click="closeWrite">Хорошо</button>
        </div>
      </div>
    </div>

    <Transition name="ml-fade">
      <div v-if="list.toast.value" class="ml-toast" role="status">
        <MlIcon name="check" />
        <span>В заявке: <b>{{ list.toast.value.text }}</b></span>
        <NuxtLink :to="to('/zayavka/')">Открыть</NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.ml {
  --ml-acc: #0b62c0;
  --ml-acc-h: #0950a0;
  --ml-ink: #0d2742;
  --ml-text: #34475d;
  --ml-mute: #66788c;
  --ml-surf: #f1f4f8;
  --ml-soft: #e3edf9;
  --ml-line: #dde4ec;
  --ml-amb: #9a5410;
  --ml-amb-soft: #fbf0e2;
  --ml-r: 10px;
  --ml-R: 16px;
  --ml-head: 76px;
  background: #fff;
  color: var(--ml-text);
  font: 400 15px/1.55 'Nunito Sans', system-ui, sans-serif;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;

  :where(&) p,
  :where(&) h1,
  :where(&) h2,
  :where(&) h3 {
    margin: 0;
  }
  :where(&) a {
    color: inherit;
    text-decoration: none;
  }
  :where(&) img {
    display: block;
    max-width: 100%;
  }
  :where(&) button {
    font: inherit;
    color: inherit;
    cursor: pointer;
  }
  :where(&) input,
  :where(&) textarea,
  :where(&) select {
    font: inherit;
    color: var(--ml-ink);
  }
  h1,
  h2,
  h3 {
    font-family: 'Bitter', Georgia, serif;
    color: var(--ml-ink);
    letter-spacing: -0.01em;
    line-height: 1.15;
  }
  .ml-icon {
    width: 20px;
    height: 20px;
    flex: none;
  }
}

.ml-wrap {
  max-width: 1320px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
  @media (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
}

.ml-concept {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 7px 16px;
  background: var(--ml-ink);
  color: #dce6f2;
  font-size: 13px;
  text-align: center;
  a {
    color: #fff;
    text-decoration: underline;
    font-weight: 700;
  }
}

/* служебная строка */
.ml-strip {
  border-bottom: 1px solid var(--ml-line);
  font-size: 13.5px;
  color: var(--ml-mute);
  &__in {
    display: flex;
    align-items: center;
    gap: 24px;
    min-height: 40px;
  }
  &__item {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
    .ml-icon {
      width: 16px;
      height: 16px;
      color: var(--ml-acc);
    }
  }
  a.ml-strip__item:hover {
    color: var(--ml-acc);
  }
  &__sub {
    margin-left: auto;
    color: var(--ml-ink);
    font-weight: 700;
  }
  @media (max-width: 989px) {
    &__opt {
      display: none !important;
    }
  }
  @media (max-width: 768px) {
    &__addr,
    &__mail {
      display: none !important;
    }
    &__sub {
      margin: 0 auto;
    }
  }
}

/* шапка: меню оригинала вокруг логотипа по центру */
.ml-head {
  position: sticky;
  top: 0;
  z-index: 40;
  background: #fff;
  border-bottom: 1px solid var(--ml-line);
  &__in {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 20px;
    height: var(--ml-head);
  }
  &__side {
    display: flex;
    align-items: center;
    gap: 22px;
    min-width: 0;
    &--r {
      justify-content: flex-end;
      gap: 12px;
      .ml-nav {
        margin-right: 10px;
      }
    }
  }
  &__burger {
    display: none !important;
  }
  &__phone {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 800;
    color: var(--ml-ink);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    .ml-icon {
      color: var(--ml-acc);
    }
    &:hover {
      color: var(--ml-acc);
    }
  }
  &__list {
    position: relative;
    .ml-badge {
      margin-left: 2px;
    }
  }
  @media (max-width: 1400px) {
    &__write span {
      display: none;
    }
    &__write {
      padding: 0 12px !important;
    }
  }
  @media (max-width: 1199px) {
    --ml-head: 68px;
    .ml-nav {
      display: none;
    }
    &__burger {
      display: inline-flex !important;
    }
  }
  @media (max-width: 768px) {
    &__in {
      gap: 8px;
    }
    &__phone span,
    .ml-head__write {
      display: none !important;
    }
    &__phone {
      width: 42px;
      height: 42px;
      justify-content: center;
      border-radius: var(--ml-r);
      background: var(--ml-surf);
    }
    &__side {
      gap: 6px;
    }
  }
  @media (max-width: 576px) {
    &__listword {
      display: none;
    }
    &__list {
      padding: 0 13px !important;
    }
  }
}
.ml-logo {
  display: block;
  img {
    height: 58px;
    width: auto;
  }
  @media (max-width: 1199px) {
    img {
      height: 50px;
    }
  }
  @media (max-width: 375px) {
    img {
      height: 44px;
    }
  }
}
.ml-nav {
  display: flex;
  gap: 4px;
  &__a {
    position: relative;
    padding: 8px 10px;
    border-radius: 8px;
    font-weight: 700;
    color: var(--ml-ink);
    white-space: nowrap;
    &:hover {
      color: var(--ml-acc);
    }
    &.is-on {
      color: var(--ml-acc);
      &::after {
        content: '';
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: -4px;
        height: 7px;
        background: currentColor;
        -webkit-mask: url('/redesign/moreland/wave.png') repeat-x left center / 23px 7px;
        mask: url('/redesign/moreland/wave.png') repeat-x left center / 23px 7px;
      }
    }
  }
}

/* кнопки */
.ml-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid var(--ml-acc);
  border-radius: var(--ml-r);
  background: var(--ml-acc);
  color: #fff !important;
  font-weight: 800;
  font-size: 15px;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  &:hover {
    background: var(--ml-acc-h);
    border-color: var(--ml-acc-h);
  }
  &--line,
  &--line:focus,
  &--line:active {
    background: #fff;
    color: var(--ml-ink) !important;
    border: 1px solid var(--ml-line);
  }
  &--line:hover {
    background: #fff;
    border-color: var(--ml-acc);
    color: var(--ml-acc) !important;
  }
  &--soft {
    background: var(--ml-soft);
    border-color: var(--ml-soft);
    color: var(--ml-acc) !important;
    &:hover {
      background: #d4e4f6;
      border-color: #d4e4f6;
    }
  }
  &--wide {
    width: 100%;
  }
  .ml-icon {
    width: 18px;
    height: 18px;
  }
}
.ml-iconbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: var(--ml-r);
  background: var(--ml-surf);
  color: var(--ml-ink);
  flex: none;
  &:hover {
    color: var(--ml-acc);
  }
}
.ml-badge {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 10px;
  background: #fff;
  color: var(--ml-acc);
  font: 800 12px/1 'Nunito Sans', sans-serif;
  font-style: normal;
}
.ml-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 800;
  &--fresh {
    background: var(--ml-amb-soft);
    color: var(--ml-amb);
  }
  .ml-icon {
    width: 15px;
    height: 15px;
  }
}
.ml-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 8px;
  background: var(--ml-surf);
  color: var(--ml-text);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  .ml-icon {
    width: 15px;
    height: 15px;
    color: var(--ml-mute);
  }
}

/* заголовок секции с волной оригинала */
.ml-h2 {
  font-size: clamp(26px, 2.6vw, 36px);
  font-weight: 800;
  &::after {
    content: '';
    display: block;
    width: 69px;
    height: 7px;
    margin-top: 12px;
    background: var(--ml-acc);
    -webkit-mask: url('/redesign/moreland/wave.png') repeat-x left center / 23px 7px;
    mask: url('/redesign/moreland/wave.png') repeat-x left center / 23px 7px;
  }
}
.ml-sechead {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;
  flex-wrap: wrap;
  margin-bottom: 28px;
  &__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 800;
    color: var(--ml-acc);
    white-space: nowrap;
    .ml-icon {
      width: 18px;
      height: 18px;
    }
  }
}
.ml-section {
  padding-top: 72px;
  padding-bottom: 0;
  @media (max-width: 768px) {
    padding-top: 52px;
  }
}

/* шапка внутренней страницы */
.ml-crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 22px;
  font-size: 13.5px;
  color: var(--ml-mute);
  a:hover {
    color: var(--ml-acc);
  }
  span + span::before {
    content: '/';
    margin-right: 6px;
    color: #b6c1cd;
  }
}
.ml-pagehead {
  padding-top: 14px;
  padding-bottom: 28px;
  h1 {
    font-size: clamp(30px, 3.4vw, 44px);
    font-weight: 800;
  }
  p {
    margin-top: 10px;
    max-width: 760px;
    color: var(--ml-mute);
    font-size: 16px;
  }
}

/* сетка карточек */
.ml-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  @media (max-width: 1199px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  @media (max-width: 375px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* карточка K27 «Коробка» */
.ml-card {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  border: 1px solid var(--ml-line);
  border-radius: var(--ml-R);
  overflow: hidden;
  background: #fff;
  &__ph {
    position: relative;
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--ml-surf);
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    &:hover img {
      transform: scale(1.04);
    }
    .ml-tag {
      position: absolute;
      left: 10px;
      top: 10px;
    }
  }
  &__body {
    display: flex;
    flex-direction: column;
    padding: 14px 16px 16px;
    min-width: 0;
  }
  &__sec {
    font-size: 12.5px;
    color: var(--ml-mute);
    font-weight: 600;
  }
  &__name {
    margin-top: 3px;
    font-weight: 800;
    color: var(--ml-ink);
    font-size: 16px;
    line-height: 1.3;
    min-height: 2.6em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    &:hover {
      color: var(--ml-acc);
    }
  }
  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
    min-height: 26px;
  }
  &__price {
    margin-top: auto;
    padding-top: 14px;
  }
  &__main {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 2px 6px;
    b {
      font: 800 22px/1.1 'Nunito Sans', sans-serif;
      color: var(--ml-ink);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    > span {
      color: var(--ml-mute);
      font-size: 13.5px;
    }
    s {
      color: var(--ml-mute);
      font-size: 13.5px;
    }
    &--ask b {
      font-size: 18px;
      color: var(--ml-text);
      white-space: normal;
    }
  }
  &__box {
    display: block;
    margin-top: 2px;
    font-size: 13.5px;
    font-weight: 700;
    color: var(--ml-text);
    min-height: 1.5em;
  }
  &__src {
    margin: 6px 0 12px !important;
    font-size: 12.5px;
    color: var(--ml-mute);
    min-height: 1.5em;
    a {
      color: var(--ml-acc);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    &.is-stale {
      color: var(--ml-amb);
    }
  }
  @media (max-width: 576px) {
    &__body {
      padding: 12px;
    }
    &__name {
      font-size: 15px;
    }
    &__main b {
      font-size: 19px;
    }
    &__main--ask b {
      font-size: 16px;
    }
    &__chips .ml-chip + .ml-chip {
      display: none;
    }
  }
}

/* «В заявку» и счётчик */
.ml-buy {
  .ml-buy__add {
    width: 100%;
  }
}
.ml-qty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  border-radius: var(--ml-r);
  background: var(--ml-soft);
  color: var(--ml-ink);
  &__b {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: var(--ml-r);
    background: transparent;
    color: var(--ml-acc);
    flex: none;
    &:hover {
      background: #d2e2f5;
    }
  }
  &__v {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    min-width: 0;
    input {
      min-width: 2ch;
      border: 0;
      background: transparent;
      text-align: center;
      font-weight: 800;
      font-size: 16px;
      padding: 0;
      outline: none;
    }
    span {
      padding: 0 6px 0 2px;
      font-size: 14px;
      white-space: nowrap;
    }
  }
}

/* карточка новости */
.ml-ncard {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  border-radius: var(--ml-R);
  background: var(--ml-surf);
  overflow: hidden;
  &__ph {
    position: relative;
    aspect-ratio: 4 / 3;
    background: var(--ml-soft);
    overflow: hidden;
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    &--doc {
      display: grid;
      place-items: center;
      color: var(--ml-acc);
      .ml-icon {
        width: 56px;
        height: 56px;
        stroke-width: 1.2;
      }
    }
  }
  &:hover &__ph img {
    transform: scale(1.04);
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 18px 18px;
  }
  &__date {
    font-size: 13px;
    color: var(--ml-mute);
    font-weight: 600;
  }
  &__t {
    font: 700 18px/1.25 'Bitter', Georgia, serif;
    color: var(--ml-ink);
  }
  &__text {
    font-size: 14.5px;
    color: var(--ml-text);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  &__price {
    margin-top: auto;
    padding-top: 4px;
    font-weight: 800;
    color: var(--ml-amb);
  }
}

/* поля форм */
.ml-form {
  display: grid;
  gap: 14px;
  align-items: start;
  &__note {
    font-size: 13px;
    color: var(--ml-mute);
  }
}
.ml-field {
  display: grid;
  gap: 6px;
  align-content: start;
  > span {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--ml-ink);
  }
  input,
  textarea,
  select {
    width: 100%;
    min-height: 46px;
    padding: 11px 14px;
    border: 1px solid var(--ml-line);
    border-radius: var(--ml-r);
    background: #fff;
    outline: none;
    transition: border-color 0.15s;
    &:focus {
      border-color: var(--ml-acc);
      box-shadow: 0 0 0 3px rgba(11, 98, 192, 0.12);
    }
  }
  textarea {
    resize: vertical;
  }
  &.is-err input,
  &.is-err textarea {
    border-color: #c8372d;
  }
}
.ml-check {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  input {
    width: 18px;
    height: 18px;
    min-height: 0;
    padding: 0;
    accent-color: var(--ml-acc);
  }
}

/* панели (белая на поверхности) */
.ml-panel {
  padding: 28px;
  border-radius: var(--ml-R);
  background: var(--ml-surf);
  @media (max-width: 576px) {
    padding: 20px 16px;
  }
}

/* подвал */
.ml-main {
  padding-bottom: 88px;
  @media (max-width: 768px) {
    padding-bottom: 64px;
  }
}
.ml-foot {
  position: relative;
  background: var(--ml-surf);
  color: var(--ml-text);
  font-size: 14.5px;
  &__wave {
    height: 15px;
    background: var(--ml-surf);
    margin-top: -15px;
    -webkit-mask: url('/redesign/moreland/topwave.png') repeat-x left bottom / 39px 15px;
    mask: url('/redesign/moreland/topwave.png') repeat-x left bottom / 39px 15px;
    transform: scaleY(-1);
  }
  &__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
    gap: 32px;
    padding-top: 48px;
    padding-bottom: 36px;
  }
  &__brand {
    img {
      height: 64px;
      width: auto;
    }
    p {
      margin-top: 16px;
      max-width: 320px;
      color: var(--ml-mute);
    }
  }
  h3 {
    font-size: 17px;
    margin-bottom: 14px;
  }
  ul.ml-foot__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
    a:hover {
      color: var(--ml-acc);
    }
  }
  &__contacts {
    display: grid;
    gap: 8px;
    align-content: start;
    justify-items: start;
    a:hover {
      color: var(--ml-acc);
    }
    .ml-btn {
      margin-top: 8px;
    }
  }
  &__phone {
    font-size: 19px;
    font-weight: 800;
    color: var(--ml-ink);
  }
  &__bottom {
    display: flex;
    align-items: center;
    gap: 12px 24px;
    flex-wrap: wrap;
    padding-top: 18px;
    padding-bottom: 22px;
    border-top: 1px solid var(--ml-line);
    font-size: 13px;
    color: var(--ml-mute);
    span:nth-child(2) {
      flex: 1;
      min-width: 240px;
    }
  }
  &__up {
    background: #fff !important;
  }
  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (max-width: 768px) {
    padding-bottom: 68px;
  }
  @media (max-width: 576px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
  }
}

/* нижняя панель на телефоне */
.ml-tabbar {
  display: none;
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 45;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1px solid var(--ml-line);
    box-shadow: 0 -6px 24px rgba(13, 39, 66, 0.06);
    &__a {
      display: grid;
      justify-items: center;
      gap: 2px;
      padding: 4px 2px;
      border-radius: 10px;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--ml-mute);
      white-space: nowrap;
      overflow: hidden;
      &.is-on {
        color: var(--ml-acc);
      }
      > span {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    &__ic {
      position: relative;
      display: block;
      .ml-badge {
        position: absolute;
        top: -6px;
        right: -12px;
        background: var(--ml-acc);
        color: #fff;
      }
    }
    &__list {
      color: var(--ml-ink);
    }
  }
}

/* выезжающее меню */
.ml-drawer {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(13, 39, 66, 0.45);
  &__panel {
    width: min(380px, 100%);
    height: 100%;
    overflow-y: auto;
    background: #fff;
    padding: 16px 20px 28px;
  }
  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      height: 48px;
      width: auto;
    }
  }
  &__nav {
    display: grid;
    margin-top: 16px;
    a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 13px 0;
      border-bottom: 1px solid var(--ml-line);
      font: 700 18px/1.2 'Bitter', Georgia, serif;
      color: var(--ml-ink);
      &.is-on {
        color: var(--ml-acc);
      }
      .ml-icon {
        color: var(--ml-mute);
      }
    }
  }
  &__groups {
    display: grid;
    gap: 8px;
    margin-top: 18px;
    a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px;
      border-radius: 12px;
      background: var(--ml-surf);
      font-weight: 800;
      color: var(--ml-ink);
    }
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  &__contacts {
    display: grid;
    gap: 12px;
    margin-top: 22px;
    a {
      display: flex;
      align-items: center;
      gap: 10px;
      .ml-icon {
        color: var(--ml-acc);
      }
    }
  }
  &__phone {
    font-size: 18px;
    font-weight: 800;
    color: var(--ml-ink);
  }
}

/* попап */
.ml-modal {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(13, 39, 66, 0.5);
  overflow-y: auto;
  &__box {
    position: relative;
    width: min(520px, 100%);
    padding: 32px;
    border-radius: 20px;
    background: #fff;
    h2 {
      font-size: 26px;
      padding-right: 40px;
    }
    @media (max-width: 576px) {
      padding: 24px 18px;
    }
  }
  &__x {
    position: absolute;
    top: 16px;
    right: 16px;
  }
  &__lead {
    margin: 8px 0 20px !important;
    color: var(--ml-mute);
  }
  &__done {
    display: grid;
    justify-items: start;
    gap: 12px;
    p {
      color: var(--ml-mute);
    }
  }
  &__ok {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--ml-soft);
    color: var(--ml-acc);
  }
}

/* тост */
.ml-toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  z-index: 55;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: calc(100% - 32px);
  padding: 12px 16px;
  border-radius: 14px;
  background: var(--ml-ink);
  color: #fff;
  box-shadow: 0 12px 40px rgba(13, 39, 66, 0.3);
  font-size: 14.5px;
  > span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ml-icon {
    color: #8fc2ff;
  }
  a {
    flex: none;
    font-weight: 800;
    color: #8fc2ff;
  }
  @media (max-width: 768px) {
    bottom: 84px;
  }
}
.ml-fade-enter-active,
.ml-fade-leave-active {
  transition: opacity 0.2s;
}
.ml-fade-enter-from,
.ml-fade-leave-to {
  opacity: 0;
}
.ml-pill {
  flex: none;
  padding: 8px 14px;
  border: 1px solid var(--ml-line);
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  &.is-on,
  &.is-on:focus {
    background: var(--ml-soft);
    border-color: var(--ml-soft);
    color: var(--ml-acc);
  }
}
.ml-empty {
  display: grid;
  gap: 10px;
  justify-items: start;
  p {
    color: var(--ml-mute);
  }
}
.ml-grid--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 375px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.ml-file {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--ml-line);
  .ml-icon {
    color: var(--ml-acc);
  }
  span {
    display: grid;
    min-width: 0;
  }
  b {
    color: var(--ml-ink);
    font-size: 14.5px;
    line-height: 1.3;
  }
  small {
    color: var(--ml-mute);
    font-size: 12.5px;
  }
  &:hover {
    border-color: var(--ml-acc);
  }
}
</style>
