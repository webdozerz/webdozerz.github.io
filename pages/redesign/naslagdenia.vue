<script lang="ts" setup>
import NsIcon from '~/components/redesign/naslagdenia/NsIcon.vue'

const route = useRoute()
const order = useNaslagdeniaOrder()
const ui = useNaslagdeniaUi()

useSeoMeta({
  title: 'Кондитерская «Наслаждение» — торты и пирожные в Новосибирске | Концепт редизайна',
  description:
    'Концепт редизайна кондитерской «Наслаждение»: готовые торты с бесплатной доставкой по Новосибирску, торты на заказ с расчётом веса и даты, пирожные коробками, 12 магазинов.',
  ogTitle: 'Кондитерская «Наслаждение» — концепт редизайна',
  ogDescription:
    'Готовый торт сегодня или заказной к дате: расчёт веса по числу гостей, начинка из готовых тортов, ближайшая дата и предоплата сразу видны. 12 магазинов на карте.',
  ogImage: 'https://andryushov.me/redesign/naslagdenia/og.jpg',
  ogType: 'website',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'ns-html', lang: 'ru' },
  bodyAttrs: { class: 'ns-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Bona+Nova:wght@400;700&family=Golos+Text:wght@400;500;600;700&display=swap',
    },
  ],
})

onMounted(() => order.persist())

const customSections = nsSections.filter((s) => s.kind === 'custom')
const dropOpen = ref(false)
watch(
  () => route.fullPath,
  () => {
    ui.closeAll()
    dropOpen.value = false
  },
)
watch([ui.menuOpen, ui.quickOpen, ui.callOpen], (v) => {
  document.documentElement.classList.toggle('ns-locked', v.some(Boolean))
})
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    ui.closeAll()
    dropOpen.value = false
  }
}
const onDocClick = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.ns-drop')) dropOpen.value = false
}
onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.removeEventListener('click', onDocClick)
  document.documentElement.classList.remove('ns-locked')
})

const isActive = (p: string) => route.path.startsWith(nsPath(p))
const isCustomActive = computed(() => customSections.some((s) => route.path.startsWith(nsPath(`/catalog/${s.id}`))))

// «Быстрый заказ» — та же модалка, что у оригинала, но название торта подставляется само.
const quick = reactive({ cake: '', name: '', phone: '', address: '', date: '', slot: '', error: '' })
watch(ui.quickOpen, (open) => {
  if (open) {
    quick.cake = ui.quickCake.value
    quick.date = nsIsoAfter(0)
    quick.error = ''
  }
})
const phoneOk = (v: string) => v.replace(/\D/g, '').length >= 10
const sendQuick = () => {
  if (!quick.cake.trim()) return (quick.error = 'Напишите, какой торт нужен')
  if (!phoneOk(quick.phone)) return (quick.error = 'Проверьте номер телефона')
  order.sent.value = [
    { id: 1000 + order.sent.value.length + 1, date: nsIsoAfter(0), total: 0, lines: [quick.cake.trim()] },
    ...order.sent.value,
  ]
  ui.closeAll()
  ui.say('Заявка принята. Это демо: на сайте менеджер перезвонит для подтверждения')
  Object.assign(quick, { cake: '', address: '', slot: '' })
}

// «Перезвоните мне» вместо виджета Envybox — номер и удобное время.
const call = reactive({ phone: '', when: 'Сейчас', error: '' })
const callTimes = ['Сейчас', 'В течение часа', '9:00–12:00', '12:00–15:00', '15:00–18:00']
const sendCall = () => {
  if (!phoneOk(call.phone)) return (call.error = 'Проверьте номер телефона')
  call.error = ''
  ui.closeAll()
  ui.say(`Перезвоним: ${call.when.toLowerCase()}. Это демо, звонка не будет`)
}

const year = new Date().getFullYear()
</script>

<template>
  <div class="ns">
    <div class="ns-banner">
      <span>Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.</span>
      <a :href="nsContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <header class="ns-header">
      <div class="ns-top">
        <div class="ns-wrap ns-top__row">
          <NuxtLink :to="nsPath('/magaziny')" class="ns-top__item">
            <NsIcon name="store" :size="18" />
            <span class="ns-top__long">12 магазинов в Новосибирске и Оби</span>
            <span class="ns-top__short">12 магазинов</span>
          </NuxtLink>
          <span class="ns-top__item ns-top__hours">
            <NsIcon name="clock" :size="18" />
            <span>Заявки на доставку 8:00–17:00, доставка 9:00–19:00</span>
          </span>
          <span class="ns-top__end">
            <a :href="nsContacts.phoneHref" class="ns-top__phone">{{ nsContacts.phone }}</a>
            <button type="button" class="ns-top__call" @click="ui.openCall()">Перезвоните мне</button>
          </span>
        </div>
      </div>
      <div class="ns-wrap ns-header__row">
        <button type="button" class="ns-hbtn ns-header__burger" aria-label="Меню" @click="ui.menuOpen.value = true">
          <NsIcon name="menu" />
        </button>
        <NuxtLink :to="nsPath()" class="ns-mark" aria-label="Кондитерская «Наслаждение», на главную">
          <span class="ns-mark__sign"><NsIcon name="slice" :size="24" /></span>
          <span class="ns-mark__text">
            <b>Наслаждение</b>
            <small>кондитерская с 1999 года</small>
          </span>
        </NuxtLink>
        <nav class="ns-nav" aria-label="Разделы">
          <NuxtLink :to="nsPath('/catalog/standard')" class="ns-nav__link" :class="{ 'is-on': isActive('/catalog/standard') }"
            >Готовые торты</NuxtLink
          >
          <div class="ns-drop" :class="{ 'is-open': dropOpen }" @mouseenter="dropOpen = true" @mouseleave="dropOpen = false">
            <button
              type="button"
              class="ns-nav__link ns-drop__btn"
              :class="{ 'is-on': isCustomActive }"
              :aria-expanded="dropOpen"
              @click="dropOpen = !dropOpen"
            >
              <span>Торты на заказ</span>
              <NsIcon name="down" :size="16" />
            </button>
            <div v-show="dropOpen" class="ns-drop__menu">
              <NuxtLink v-for="s in customSections" :key="s.id" :to="nsPath(`/catalog/${s.id}`)" class="ns-drop__item">
                <span class="ns-drop__icon"><NsIcon :name="s.icon" :size="20" /></span>
                <span>
                  <b>{{ s.title }}</b>
                  <small>{{ nsCount(s.id) }} {{ nsPlural(nsCount(s.id), 'торт', 'торта', 'тортов') }}</small>
                </span>
              </NuxtLink>
            </div>
          </div>
          <NuxtLink :to="nsPath('/catalog/pie')" class="ns-nav__link" :class="{ 'is-on': isActive('/catalog/pie') }">Пирожные</NuxtLink>
          <NuxtLink :to="nsPath('/dostavka')" class="ns-nav__link" :class="{ 'is-on': isActive('/dostavka') }">Доставка и оплата</NuxtLink>
          <NuxtLink :to="nsPath('/magaziny')" class="ns-nav__link ns-nav__shops" :class="{ 'is-on': isActive('/magaziny') }"
            >Магазины</NuxtLink
          >
          <NuxtLink :to="nsPath('/otzyvy')" class="ns-nav__link" :class="{ 'is-on': isActive('/otzyvy') }">Отзывы</NuxtLink>
        </nav>
        <a :href="nsContacts.phoneHref" class="ns-hbtn ns-header__phone" aria-label="Позвонить">
          <NsIcon name="phone" />
        </a>
        <NuxtLink :to="nsPath('/zakaz')" class="ns-orderbtn" :class="{ 'is-full': order.count.value }">
          <span class="ns-orderbtn__icon">
            <NsIcon name="bag" />
            <i v-if="order.count.value">{{ order.count.value }}</i>
          </span>
          <span class="ns-orderbtn__text">
            <b>Заказ</b>
            <small>{{ order.count.value ? nsMoney(order.total.value) : 'пока пусто' }}</small>
          </span>
        </NuxtLink>
      </div>
    </header>

    <Transition name="ns-fade">
      <div v-if="ui.menuOpen.value" class="ns-menu" @click.self="ui.menuOpen.value = false">
        <div class="ns-menu__panel" role="dialog" aria-label="Меню">
          <div class="ns-menu__head">
            <b>Меню</b>
            <button type="button" class="ns-hbtn" aria-label="Закрыть" @click="ui.menuOpen.value = false">
              <NsIcon name="close" />
            </button>
          </div>
          <NuxtLink :to="nsPath('/catalog')" class="ns-menu__all">Весь каталог <NsIcon name="right" :size="18" /></NuxtLink>
          <div class="ns-menu__group">Сегодня в магазинах</div>
          <NuxtLink
            v-for="s in nsSections.filter((x) => x.kind === 'ready')"
            :key="s.id"
            :to="nsPath(`/catalog/${s.id}`)"
            class="ns-menu__item"
          >
            <span class="ns-drop__icon"><NsIcon :name="s.icon" :size="20" /></span>
            <span>{{ s.title }}</span>
            <small>{{ nsCount(s.id) }}</small>
          </NuxtLink>
          <div class="ns-menu__group">Торты на заказ</div>
          <NuxtLink v-for="s in customSections" :key="s.id" :to="nsPath(`/catalog/${s.id}`)" class="ns-menu__item">
            <span class="ns-drop__icon"><NsIcon :name="s.icon" :size="20" /></span>
            <span>{{ s.title }}</span>
            <small>{{ nsCount(s.id) }}</small>
          </NuxtLink>
          <div class="ns-menu__links">
            <NuxtLink :to="nsPath('/dostavka')">Доставка и оплата</NuxtLink>
            <NuxtLink :to="nsPath('/magaziny')">Магазины</NuxtLink>
            <NuxtLink :to="nsPath('/otzyvy')">Отзывы</NuxtLink>
          </div>
          <div class="ns-menu__contact">
            <a :href="nsContacts.phoneHref" class="ns-btn ns-btn--main"><NsIcon name="phone" :size="18" /> {{ nsContacts.phone }}</a>
            <button type="button" class="ns-btn ns-btn--line" @click="ui.openCall()">Перезвоните мне</button>
          </div>
        </div>
      </div>
    </Transition>

    <main class="ns-main">
      <NuxtPage />
    </main>

    <footer class="ns-footer">
      <div class="ns-wrap ns-footer__grid">
        <div class="ns-footer__brand">
          <NuxtLink :to="nsPath()" class="ns-mark">
            <span class="ns-mark__sign"><NsIcon name="slice" :size="24" /></span>
            <span class="ns-mark__text">
              <b>Наслаждение</b>
              <small>кондитерская с 1999 года</small>
            </span>
          </NuxtLink>
          <p>Живите с наслаждением! Свежие торты и пирожные без заморозки в 12 магазинах Новосибирска и Оби.</p>
          <button type="button" class="ns-btn ns-btn--line" @click="ui.openQuick()">Быстрый заказ</button>
        </div>
        <div>
          <b class="ns-footer__head">Каталог</b>
          <ul class="ns-footer__list">
            <li v-for="s in nsSections" :key="s.id">
              <NuxtLink :to="nsPath(`/catalog/${s.id}`)">{{ s.title }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <b class="ns-footer__head">Покупателям</b>
          <ul class="ns-footer__list">
            <li><NuxtLink :to="nsPath('/dostavka')">Доставка и оплата</NuxtLink></li>
            <li><NuxtLink :to="nsPath('/magaziny')">Магазины на карте</NuxtLink></li>
            <li><NuxtLink :to="nsPath('/otzyvy')">Отзывы</NuxtLink></li>
            <li><NuxtLink :to="nsPath('/zakaz')">Заказ</NuxtLink></li>
          </ul>
        </div>
        <div>
          <b class="ns-footer__head">Контакты</b>
          <ul class="ns-footer__list ns-footer__contacts">
            <li>
              <a :href="nsContacts.phoneHref"
                ><NsIcon name="phone" :size="18" /><span>{{ nsContacts.phone }}</span></a
              >
            </li>
            <li>
              <a :href="`mailto:${nsContacts.email}`"
                ><NsIcon name="mail" :size="18" /><span>{{ nsContacts.email }}</span></a
              >
            </li>
            <li>
              <span class="ns-footer__line"
                ><NsIcon name="clock" :size="18" /><span>Заявки на доставку — ежедневно с 8:00 до 17:00</span></span
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="ns-wrap ns-footer__legal">
        <span>© 1999–{{ year }} Кондитерская «Наслаждение». Тексты, цены и фотографии принадлежат владельцу магазина.</span>
        <span>Концепт редизайна — andryushov.me</span>
      </div>
    </footer>

    <nav class="ns-tabbar" aria-label="Быстрые действия">
      <NuxtLink :to="nsPath('/catalog')" class="ns-tabbar__item" :class="{ 'is-on': isActive('/catalog') || isActive('/product') }">
        <NsIcon name="slice" />
        <span>Каталог</span>
      </NuxtLink>
      <a :href="nsContacts.phoneHref" class="ns-tabbar__item">
        <NsIcon name="phone" />
        <span>Позвонить</span>
      </a>
      <NuxtLink :to="nsPath('/magaziny')" class="ns-tabbar__item" :class="{ 'is-on': isActive('/magaziny') }">
        <NsIcon name="store" />
        <span>Магазины</span>
      </NuxtLink>
      <NuxtLink :to="nsPath('/zakaz')" class="ns-tabbar__item ns-tabbar__order" :class="{ 'is-on': isActive('/zakaz') }">
        <span class="ns-orderbtn__icon">
          <NsIcon name="bag" />
          <i v-if="order.count.value">{{ order.count.value }}</i>
        </span>
        <span>{{ order.count.value ? nsMoney(order.total.value) : 'Заказ' }}</span>
      </NuxtLink>
    </nav>

    <Transition name="ns-fade">
      <div v-if="ui.quickOpen.value" class="ns-modal" @click.self="ui.closeAll()">
        <form class="ns-modal__box" role="dialog" aria-label="Быстрый заказ" @submit.prevent="sendQuick">
          <div class="ns-modal__head">
            <h2>Быстрый заказ</h2>
            <button type="button" class="ns-hbtn" aria-label="Закрыть" @click="ui.closeAll()"><NsIcon name="close" /></button>
          </div>
          <p class="ns-modal__lead">Менеджер перезвонит, уточнит детали и подтвердит заказ.</p>
          <label class="ns-field">
            <span>Какой торт</span>
            <textarea v-model="quick.cake" rows="2" placeholder="Например: торт Барбара, 2 шт." />
          </label>
          <div class="ns-field-row">
            <label class="ns-field">
              <span>Имя</span>
              <input v-model="quick.name" class="ns-input" type="text" autocomplete="given-name" />
            </label>
            <label class="ns-field">
              <span>Телефон*</span>
              <input v-model="quick.phone" class="ns-input" type="tel" autocomplete="tel" placeholder="+7" />
            </label>
          </div>
          <label class="ns-field">
            <span>Адрес доставки</span>
            <input v-model="quick.address" class="ns-input" type="text" placeholder="Улица, дом, квартира — или «заберу сам»" />
          </label>
          <div class="ns-field-row">
            <label class="ns-field">
              <span>Дата</span>
              <input v-model="quick.date" class="ns-input" type="date" :min="nsIsoAfter(0)" />
            </label>
            <label class="ns-field">
              <span>Время</span>
              <span class="ns-select">
                <select v-model="quick.slot">
                  <option value="">Любое</option>
                  <option v-for="s in nsSlots" :key="s" :value="s">{{ s }}</option>
                </select>
                <NsIcon name="down" :size="18" />
              </span>
            </label>
          </div>
          <p v-if="quick.error" class="ns-error">{{ quick.error }}</p>
          <button type="submit" class="ns-btn ns-btn--main ns-btn--lg ns-modal__send">Отправить заявку</button>
        </form>
      </div>
    </Transition>

    <Transition name="ns-fade">
      <div v-if="ui.callOpen.value" class="ns-modal" @click.self="ui.closeAll()">
        <form class="ns-modal__box ns-modal__box--sm" role="dialog" aria-label="Перезвоните мне" @submit.prevent="sendCall">
          <div class="ns-modal__head">
            <h2>Перезвоним</h2>
            <button type="button" class="ns-hbtn" aria-label="Закрыть" @click="ui.closeAll()"><NsIcon name="close" /></button>
          </div>
          <p class="ns-modal__lead">Оставьте номер — перезвоним в удобное время.</p>
          <label class="ns-field">
            <span>Телефон*</span>
            <input v-model="call.phone" class="ns-input" type="tel" autocomplete="tel" placeholder="+7" />
          </label>
          <div class="ns-field">
            <span>Когда удобно</span>
            <div class="ns-seg ns-seg--wrap">
              <button v-for="t in callTimes" :key="t" type="button" :class="{ 'is-on': call.when === t }" @click="call.when = t">
                {{ t }}
              </button>
            </div>
          </div>
          <p v-if="call.error" class="ns-error">{{ call.error }}</p>
          <button type="submit" class="ns-btn ns-btn--main ns-btn--lg ns-modal__send">Жду звонка</button>
        </form>
      </div>
    </Transition>

    <Transition name="ns-fade">
      <div v-if="ui.toast.value" class="ns-toast" role="status">
        <NsIcon name="check" :size="20" />
        <span>{{ ui.toast.value }}</span>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.ns-html.ns-locked {
  overflow: hidden;
}

.ns-body {
  margin: 0;
  background: #fff;
}

.ns {
  --ns-accent: #a63d2d;
  --ns-accent-hover: #8f2e20;
  --ns-dark: #3f0801;
  --ns-text: #3a211c;
  --ns-muted: #7a5f58;
  --ns-surface: #fbf2ee;
  --ns-surface-2: #f6e6df;
  --ns-line: #f0e2db;
  --ns-line-strong: #e2cbc1;
  --ns-gold: #b07b20;
  --ns-gold-soft: #fbf0d9;
  --ns-terra: #a8442f;
  --ns-r-btn: 12px;
  --ns-r-card: 20px;
  --ns-r-panel: 28px;
  --ns-head: 'Bona Nova', Georgia, serif;
  --ns-font: 'Golos Text', system-ui, sans-serif;

  min-height: 100vh;
  font-family: var(--ns-font);
  font-size: 15px;
  line-height: 1.5;
  color: var(--ns-text);
  background: #fff;
  -webkit-font-smoothing: antialiased;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :where(p, h1, h2, h3, ul) {
    margin: 0;
  }

  :where(h1, h2, h3) {
    font-family: var(--ns-head);
    font-weight: 700;
    line-height: 1.1;
    color: var(--ns-dark);
    letter-spacing: -0.01em;
  }

  :where(a) {
    color: inherit;
  }

  :where(img) {
    max-width: 100%;
  }

  :where(button) {
    font: inherit;
    color: inherit;
    cursor: pointer;
  }

  :where(ul) {
    padding: 0;
    list-style: none;
  }

  // Шкала: 1520, 1400, 1199, 989, 768, 576, 375
  .ns-wrap {
    width: 100%;
    max-width: 1360px;
    margin: 0 auto;
    padding-left: 32px;
    padding-right: 32px;

    @media (max-width: 989px) {
      padding-left: 20px;
      padding-right: 20px;
    }

    @media (max-width: 375px) {
      padding-left: 14px;
      padding-right: 14px;
    }
  }

  .ns-section {
    padding-top: 72px;

    @media (max-width: 768px) {
      padding-top: 52px;
    }
  }

  .ns-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px 24px;
    margin-bottom: 28px;

    h2 {
      font-size: clamp(30px, 3.4vw, 44px);
    }

    p {
      max-width: 620px;
      margin-top: 10px;
      color: var(--ns-muted);
    }

    &__more {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      color: var(--ns-accent);
      text-decoration: none;
      white-space: nowrap;

      &:hover {
        color: var(--ns-accent-hover);
      }
    }
  }

  .ns-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;

    @media (max-width: 1199px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
  }

  // Кнопки
  .ns-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 44px;
    padding: 0 18px;
    font-size: 15px;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    text-decoration: none;
    border: 1px solid transparent;
    border-radius: var(--ns-r-btn);
    transition:
      background 0.2s,
      color 0.2s,
      border-color 0.2s;

    &--main {
      color: #fff;
      background: var(--ns-accent);

      &:hover {
        background: var(--ns-accent-hover);
      }
    }

    &--line,
    &--line:focus,
    &--line:active {
      color: var(--ns-dark);
      background: #fff;
      border: 1px solid var(--ns-line-strong);
    }

    &--line:hover {
      border-color: var(--ns-accent);
      color: var(--ns-accent);
    }

    &--soft {
      color: var(--ns-accent);
      background: var(--ns-surface);

      &:hover {
        background: var(--ns-surface-2);
      }
    }

    &--lg {
      height: 52px;
      padding: 0 24px;
      font-size: 16px;
    }

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }

  .ns-hbtn {
    display: inline-grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    color: var(--ns-dark);
    background: transparent;
    border: 0;
    border-radius: var(--ns-r-btn);

    &:hover {
      background: var(--ns-surface);
    }
  }

  // Метки на фото
  .ns-label {
    display: inline-block;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.2;
    border-radius: 999px;
    color: var(--ns-dark);
    background: #fff;

    &--hit {
      color: #5e3e05;
      background: var(--ns-gold-soft);
    }

    &--new {
      color: #fff;
      background: var(--ns-accent);
    }
  }

  // Счётчик: и в карточке, и в заявке
  .ns-qty {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    height: 44px;
    padding: 4px;
    background: var(--ns-surface);
    border-radius: var(--ns-r-btn);

    &__btn {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      padding: 0;
      color: var(--ns-accent);
      background: #fff;
      border: 0;
      border-radius: 9px;

      &:hover:not(:disabled) {
        color: #fff;
        background: var(--ns-accent);
      }

      &:disabled {
        opacity: 0.4;
        cursor: default;
      }
    }

    &__n {
      min-width: 52px;
      font-weight: 700;
      color: var(--ns-dark);
      text-align: center;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    &--big {
      height: 48px;

      .ns-qty__btn {
        width: 40px;
        height: 40px;
      }

      .ns-qty__n {
        min-width: 76px;
      }
    }
  }

  // Поля
  .ns-input,
  .ns-select select,
  .ns-field textarea {
    width: 100%;
    height: 48px;
    padding: 0 14px;
    font: inherit;
    color: var(--ns-dark);
    background: #fff;
    border: 1px solid var(--ns-line-strong);
    border-radius: var(--ns-r-btn);
    outline: none;

    &:focus {
      border-color: var(--ns-accent);
      box-shadow: 0 0 0 3px rgba(166, 61, 45, 0.12);
    }
  }

  .ns-field textarea {
    height: auto;
    padding: 12px 14px;
    resize: vertical;
  }

  .ns-select {
    position: relative;
    display: block;

    select {
      padding-right: 40px;
      appearance: none;
      cursor: pointer;
    }

    .ns-icon {
      position: absolute;
      top: 50%;
      right: 14px;
      color: var(--ns-muted);
      transform: translateY(-50%);
      pointer-events: none;
    }
  }

  .ns-field {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;

    > span:first-child {
      font-size: 14px;
      font-weight: 600;
      color: var(--ns-dark);
    }
  }

  .ns-field-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .ns-seg {
    display: inline-flex;
    gap: 4px;
    padding: 4px;
    background: var(--ns-surface);
    border-radius: 14px;

    button {
      height: 40px;
      padding: 0 16px;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      color: var(--ns-text);
      background: transparent;
      border: 0;
      border-radius: 10px;

      &.is-on {
        color: var(--ns-dark);
        background: #fff;
        box-shadow: 0 1px 3px rgba(63, 8, 1, 0.12);
      }
    }

    &--wrap {
      display: flex;
      flex-wrap: wrap;
    }

    button:disabled {
      opacity: 0.45;
      cursor: default;
    }
  }

  .ns-error {
    padding: 10px 14px;
    font-size: 14px;
    color: #8f2e20;
    background: #fdecea;
    border-radius: 10px;
  }

  .ns-stars {
    display: inline-flex;
    gap: 2px;
    color: var(--ns-gold);

    .is-off {
      color: var(--ns-line-strong);
    }

    .ns-icon:not(.is-off) path {
      fill: currentColor;
    }
  }

  .ns-crumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-top: 22px;
    font-size: 14px;
    color: var(--ns-muted);

    a {
      color: var(--ns-muted);
      text-decoration: none;

      &:hover {
        color: var(--ns-accent);
      }
    }
  }

  .ns-page-title {
    margin-top: 12px;
    overflow-wrap: anywhere;
    text-wrap: balance;
    font-size: clamp(34px, 4.2vw, 56px);
  }

  .ns-page-lead {
    max-width: 720px;
    margin-top: 12px;
    font-size: 17px;
    color: var(--ns-muted);
  }

  // Баннер концепта
  .ns-banner {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 12px;
    padding: 8px 16px;
    font-size: 13px;
    line-height: 1.4;
    text-align: center;
    color: #fff;
    background: var(--ns-dark);

    a {
      font-weight: 600;
      color: #f8d19f;
    }
  }

  // Шапка: верхняя строка с условиями и телефоном, нижняя — знак, разделы, заказ
  .ns-header {
    position: sticky;
    top: 0;
    z-index: 40;
    background: #fff;
    border-bottom: 1px solid var(--ns-line);

    &__row {
      display: flex;
      align-items: center;
      gap: 20px;
      height: 76px;
    }

    &__burger,
    &__phone {
      display: none !important;
    }
  }

  .ns-top {
    background: var(--ns-surface);
    font-size: 13px;

    &__row {
      display: flex;
      align-items: center;
      gap: 24px;
      height: 38px;
    }

    &__item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--ns-text);
      text-decoration: none;
      white-space: nowrap;

      .ns-icon {
        color: var(--ns-accent);
      }
    }

    a.ns-top__item:hover {
      color: var(--ns-accent);
    }

    &__short {
      display: none;
    }

    &__end {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      margin-left: auto;
      white-space: nowrap;
    }

    &__phone {
      font-weight: 700;
      color: var(--ns-dark);
      text-decoration: none;
      font-variant-numeric: tabular-nums;
    }

    &__call {
      padding: 0;
      font-size: 13px;
      font-weight: 600;
      color: var(--ns-accent);
      background: none;
      border: 0;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  .ns-mark {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 10px;
    color: var(--ns-dark);
    text-decoration: none;

    &__sign {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      color: #fff;
      background: var(--ns-accent);
      border-radius: 14px;
    }

    &__text {
      display: grid;
      line-height: 1;

      b {
        font-family: var(--ns-head);
        font-size: 26px;
        font-weight: 700;
        letter-spacing: -0.01em;
      }

      small {
        margin-top: 4px;
        font-size: 12px;
        color: var(--ns-muted);
      }
    }
  }

  .ns-nav {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-width: 0;

    &__link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 40px;
      padding: 0 12px;
      font-size: 15px;
      font-weight: 500;
      white-space: nowrap;
      color: var(--ns-text);
      text-decoration: none;
      background: none;
      border: 0;
      border-radius: 10px;

      &:hover {
        color: var(--ns-accent);
        background: var(--ns-surface);
      }

      &.is-on {
        color: var(--ns-accent);
        font-weight: 600;
      }
    }
  }

  .ns-drop {
    position: relative;

    &__btn .ns-icon {
      transition: transform 0.2s;
    }

    &.is-open &__btn .ns-icon {
      transform: rotate(180deg);
    }

    &__menu {
      position: absolute;
      top: 100%;
      left: 50%;
      z-index: 5;
      display: grid;
      gap: 2px;
      width: 300px;
      margin-top: 4px;
      padding: 8px;
      background: #fff;
      border: 1px solid var(--ns-line);
      border-radius: var(--ns-r-card);
      box-shadow: 0 18px 40px rgba(63, 8, 1, 0.12);
      transform: translateX(-50%);

      &::before {
        content: '';
        position: absolute;
        top: -10px;
        right: 0;
        left: 0;
        height: 10px;
      }
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 10px;
      color: var(--ns-dark);
      text-decoration: none;
      border-radius: 12px;

      &:hover {
        background: var(--ns-surface);
      }

      b {
        display: block;
        font-weight: 600;
      }

      small {
        font-size: 13px;
        color: var(--ns-muted);
      }
    }

    &__icon {
      display: grid;
      flex: none;
      place-items: center;
      width: 40px;
      height: 40px;
      color: var(--ns-accent);
      background: var(--ns-surface);
      border-radius: 12px;
    }
  }

  .ns-orderbtn {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 10px;
    width: 172px;
    height: 52px;
    padding: 0 14px;
    color: var(--ns-dark);
    text-decoration: none;
    background: var(--ns-surface);
    border-radius: 14px;

    &:hover {
      background: var(--ns-surface-2);
    }

    &.is-full {
      color: #fff;
      background: var(--ns-accent);

      small {
        color: rgba(255, 255, 255, 0.85);
      }

      &:hover {
        background: var(--ns-accent-hover);
      }
    }

    &__icon {
      position: relative;
      display: inline-grid;

      i {
        position: absolute;
        top: -7px;
        right: -9px;
        min-width: 19px;
        height: 19px;
        padding: 0 5px;
        font-size: 11px;
        font-style: normal;
        font-weight: 700;
        line-height: 19px;
        text-align: center;
        color: var(--ns-dark);
        background: #f8d19f;
        border-radius: 999px;
      }
    }

    &__text {
      display: grid;
      min-width: 0;
      line-height: 1.15;

      b {
        font-size: 15px;
      }

      small {
        font-size: 13px;
        color: var(--ns-muted);
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }
    }
  }

  @media (max-width: 1400px) {
    .ns-top__hours {
      display: none;
    }

    .ns-nav__link {
      padding: 0 9px;
      font-size: 14px;
    }

    .ns-header__row {
      gap: 14px;
    }
  }

  @media (max-width: 1199px) {
    .ns-nav {
      display: none;
    }

    .ns-header__burger,
    .ns-header__phone {
      display: inline-grid !important;
    }

    .ns-header__phone {
      margin-left: auto;
    }

    .ns-top__hours {
      display: inline-flex;
    }
  }

  @media (max-width: 989px) {
    .ns-top__hours {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .ns-header__row {
      gap: 8px;
      height: 64px;
    }

    .ns-header__phone {
      display: none !important;
    }

    .ns-orderbtn {
      display: none;
    }

    .ns-mark {
      margin-right: auto;
    }

    .ns-mark__sign {
      width: 38px;
      height: 38px;
      border-radius: 12px;
    }

    .ns-mark__text b {
      font-size: 22px;
    }

    .ns-top__row {
      gap: 12px;
      height: 34px;
    }

    .ns-top__call {
      display: none;
    }
  }

  @media (max-width: 576px) {
    .ns-top__long {
      display: none;
    }

    .ns-top__short {
      display: inline;
    }
  }

  @media (max-width: 375px) {
    .ns-mark__text small {
      display: none;
    }
  }

  // Меню на телефоне
  .ns-menu {
    position: fixed;
    inset: 0;
    z-index: 60;
    background: rgba(40, 10, 5, 0.4);

    &__panel {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: min(380px, 100%);
      height: 100%;
      padding: 12px 16px 24px;
      overflow-y: auto;
      background: #fff;
    }

    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0 8px;

      b {
        font-family: var(--ns-head);
        font-size: 26px;
        color: var(--ns-dark);
      }
    }

    &__all {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      font-weight: 600;
      color: #fff;
      text-decoration: none;
      background: var(--ns-accent);
      border-radius: 14px;
    }

    &__group {
      margin-top: 14px;
      padding: 0 4px 4px;
      font-size: 13px;
      font-weight: 600;
      color: var(--ns-muted);
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 4px;
      color: var(--ns-dark);
      text-decoration: none;
      border-radius: 12px;

      span:nth-child(2) {
        flex: 1;
        font-weight: 500;
      }

      small {
        color: var(--ns-muted);
      }
    }

    &__links {
      display: grid;
      margin-top: 14px;
      border-top: 1px solid var(--ns-line);

      a {
        padding: 12px 4px;
        font-weight: 500;
        color: var(--ns-dark);
        text-decoration: none;
        border-bottom: 1px solid var(--ns-line);
      }
    }

    &__contact {
      display: grid;
      gap: 8px;
      margin-top: 18px;
    }
  }

  .ns-main {
    padding-bottom: 72px;
  }

  // Подвал — светлый
  .ns-footer {
    padding: 56px 0 24px;
    background: var(--ns-surface);

    &__grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr 1.3fr;
      gap: 32px;
    }

    &__brand {
      display: grid;
      align-content: start;
      justify-items: start;
      gap: 16px;

      p {
        max-width: 340px;
        color: var(--ns-muted);
      }
    }

    &__head {
      display: block;
      margin-bottom: 12px;
      font-weight: 700;
      color: var(--ns-dark);
    }

    ul.ns-footer__list {
      display: grid;
      gap: 8px;
    }

    &__list a {
      color: var(--ns-text);
      text-decoration: none;

      &:hover {
        color: var(--ns-accent);
      }
    }

    &__contacts a,
    &__line {
      display: flex;
      align-items: flex-start;
      gap: 8px;

      .ns-icon {
        flex: none;
        margin-top: 2px;
        color: var(--ns-accent);
      }

      span {
        min-width: 0;
        overflow-wrap: anywhere;
      }
    }

    &__legal {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 8px 24px;
      margin-top: 40px;
      padding-top: 20px;
      font-size: 13px;
      color: var(--ns-muted);
      border-top: 1px solid var(--ns-line-strong);
    }

    @media (max-width: 989px) {
      &__grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 576px) {
      &__grid {
        grid-template-columns: minmax(0, 1fr);
        gap: 28px;
      }
    }
  }

  // Нижняя панель на телефоне
  .ns-tabbar {
    display: none;
  }

  @media (max-width: 768px) {
    .ns-tabbar {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 45;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
      background: #fff;
      border-top: 1px solid var(--ns-line);

      &__item {
        display: grid;
        justify-items: center;
        gap: 2px;
        padding: 6px 2px;
        font-size: 12px;
        font-weight: 500;
        color: var(--ns-muted);
        text-decoration: none;
        border-radius: 12px;

        > span:last-child {
          max-width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-variant-numeric: tabular-nums;
        }

        &.is-on {
          color: var(--ns-accent);
        }
      }

      &__order {
        color: var(--ns-dark);
      }
    }

    .ns-footer {
      padding-bottom: 96px;
    }
  }

  // Окна
  .ns-modal {
    position: fixed;
    inset: 0;
    z-index: 70;
    display: grid;
    place-items: center;
    padding: 16px;
    overflow-y: auto;
    background: rgba(40, 10, 5, 0.45);

    &__box {
      display: grid;
      gap: 14px;
      width: min(560px, 100%);
      padding: 26px;
      background: #fff;
      border-radius: var(--ns-r-panel);

      &--sm {
        width: min(440px, 100%);
      }
    }

    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      h2 {
        font-size: 30px;
      }
    }

    &__lead {
      margin-top: -6px;
      color: var(--ns-muted);
    }

    &__send {
      width: 100%;
      margin-top: 4px;
    }

    @media (max-width: 576px) {
      align-items: end;
      padding: 0;

      &__box {
        padding: 20px 16px 24px;
        border-radius: 24px 24px 0 0;
      }
    }
  }

  .ns-toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    z-index: 80;
    display: flex;
    align-items: center;
    gap: 10px;
    width: max-content;
    max-width: calc(100% - 32px);
    padding: 12px 18px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    background: var(--ns-dark);
    border-radius: 14px;
    transform: translateX(-50%);

    @media (max-width: 768px) {
      bottom: 84px;
    }
  }

  .ns-fade-enter-active,
  .ns-fade-leave-active {
    transition: opacity 0.2s;
  }

  .ns-fade-enter-from,
  .ns-fade-leave-to {
    opacity: 0;
  }
}
</style>
