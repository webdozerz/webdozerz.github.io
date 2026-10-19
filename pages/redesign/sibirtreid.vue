<script lang="ts" setup>
import SbIcon from '~/components/redesign/sibirtreid/SbIcon.vue'
import SbPriceForm from '~/components/redesign/sibirtreid/SbPriceForm.vue'

const route = useRoute()
const router = useRouter()
const req = useSibirtreidRequest()

const menuOpen = ref(false)
const catOpen = ref(false)
const searchOpen = ref(false)
const activeSec = ref<SbSectionId>(sbSections[0].id)
const mobileSec = ref<SbSectionId | null>(null)

const nav = [
  { to: sbPath('/about'), label: 'О компании' },
  { to: sbPath('/delivery'), label: 'Доставка и оплата' },
  { to: sbPath('/suppliers'), label: 'Поставщикам' },
  { to: sbPath('/blog'), label: 'Блог' },
  { to: sbPath('/contacts'), label: 'Контакты' },
]

const totalItems = sbItems.length
const sectionCounts = Object.fromEntries(sbSections.map((s) => [s.id, sbCount(s.id)]))
const subCount = (sec: string, sub: string) => sbCount(sec, sub)
const current = computed(() => sbSection(activeSec.value)!)
const mobileCurrent = computed(() => (mobileSec.value ? sbSection(mobileSec.value) : null))

const reqLabel = computed(() => (req.count.value ? `от ${sbRub(req.total.value)}` : 'Заявка'))

// ---------- поиск ----------
const q = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const found = computed(() => sbSearch(q.value))
const openSearch = (preset = '') => {
  q.value = preset
  searchOpen.value = true
  catOpen.value = false
  menuOpen.value = false
  nextTick(() => searchInput.value?.focus())
}
const goSearch = () => {
  if (!q.value.trim()) return
  router.push({ path: sbCatalogPath(), query: { q: q.value.trim() } })
}

// ---------- 18+ ----------
const adultSection = computed(() => {
  const p = route.path
  if (p.startsWith(sbCatalogPath('low-alcohol-drinks'))) return true
  if (p.startsWith(sbPath('/item/'))) return sbFind(String(route.params.id))?.sec === 'low-alcohol-drinks'
  return false
})
const ageGate = computed(() => req.ready.value && adultSection.value && !req.adult.value)
const notAdult = () => router.push(sbCatalogPath())

// ---------- модалки и блокировка прокрутки ----------
const anyOverlay = computed(() => menuOpen.value || catOpen.value || searchOpen.value || req.priceModal.value.open || ageGate.value)
watch(anyOverlay, (open) => {
  if (import.meta.client) document.documentElement.classList.toggle('sb-locked', open)
})
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    catOpen.value = false
    searchOpen.value = false
    mobileSec.value = null
  },
)
const closeAll = () => {
  menuOpen.value = false
  catOpen.value = false
  searchOpen.value = false
  req.priceModal.value = { open: false, topic: '' }
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeAll()
}
const toggleCatalog = () => {
  catOpen.value = !catOpen.value
  searchOpen.value = false
  menuOpen.value = false
  mobileSec.value = null
}

useSeoMeta({
  title: 'СибирьТрейд — продукты питания оптом | Концепт редизайна',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { class: 'sb-html', lang: 'ru' },
  bodyAttrs: { class: 'sb-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Wix+Madefor+Text:wght@400;500;600;700&display=swap',
    },
  ],
})

onMounted(() => {
  req.persist()
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('sb-locked')
})
</script>

<template>
  <div class="sb">
    <div class="sb-banner">
      <span>Концепт редизайна. Это не официальный сайт компании, заявки здесь никуда не отправляются.</span>
      <a :href="sbContacts.original" target="_blank" rel="noopener">Оригинал</a>
    </div>

    <div v-if="req.notice.value" class="sb-notice">
      <div class="sb-wrap sb-notice__row">
        <span class="sb-notice__mark" aria-hidden="true">!</span>
        <p>{{ sbAnnouncement }}</p>
        <NuxtLink :to="sbPath('/delivery')" class="sb-notice__more">Подробнее</NuxtLink>
        <button type="button" class="sb-notice__close" aria-label="Скрыть объявление" @click="req.notice.value = false">
          <SbIcon name="close" :size="18" />
        </button>
      </div>
    </div>

    <header class="sb-header">
      <div class="sb-util">
        <div class="sb-wrap sb-util__row">
          <span class="sb-util__geo">
            <SbIcon name="pin" :size="16" />
            Новосибирск → от Урала до Сахалина
          </span>
          <nav class="sb-util__nav" aria-label="О компании">
            <NuxtLink v-for="n in nav" :key="n.to" :to="n.to">{{ n.label }}</NuxtLink>
          </nav>
          <a :href="sbContacts.wb" target="_blank" rel="noopener" class="sb-util__wb">Мы на WB</a>
          <div class="sb-util__social">
            <a :href="sbContacts.telegram" target="_blank" rel="noopener" aria-label="Telegram отдела продаж"><SbIcon name="send" :size="17" /></a>
            <a :href="sbContacts.whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp отдела продаж"><SbIcon name="chat" :size="17" /></a>
            <a :href="sbContacts.max" target="_blank" rel="noopener" aria-label="MAX" class="sb-util__max">MAX</a>
            <a :href="`mailto:${sbContacts.email}`" aria-label="Почта"><SbIcon name="mail" :size="17" /></a>
          </div>
        </div>
      </div>

      <div class="sb-wrap sb-header__row">
        <NuxtLink :to="sbPath()" class="sb-mark" aria-label="СибирьТрейд, на главную">
          <span class="sb-mark__sign" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path class="sb-mark__leaf" d="M12 13.4c-3.6-.1-6.6-2-7.2-5.9 3.9-.2 6.8 1.9 7.2 5.9z" />
              <path class="sb-mark__leaf" d="M12 11.2c.3-4.6 3.3-7.8 7.6-8.2.3 4.6-3 7.9-7.6 8.2z" />
              <path d="M12 20.5V11M6.5 20.5h11" />
            </svg>
          </span>
          <span class="sb-mark__text">
            <span class="sb-mark__name">СибирьТрейд</span>
            <span class="sb-mark__sub">Растём вместе!</span>
          </span>
        </NuxtLink>

        <button type="button" class="sb-btn sb-header__cat" :aria-expanded="catOpen" aria-controls="sb-catalog" @click="toggleCatalog">
          <SbIcon :name="catOpen ? 'close' : 'grid'" :size="18" />
          <span>Каталог</span>
        </button>

        <button type="button" class="sb-header__search" @click="openSearch()">
          <SbIcon name="search" :size="18" />
          <span>Поиск по {{ totalItems }} позициям и 65 разделам</span>
        </button>

        <a :href="sbContacts.phoneHref" class="sb-header__phone">
          <strong>{{ sbContacts.phone }}</strong>
          <small>{{ sbContacts.hours }}, {{ sbContacts.tz }}</small>
        </a>

        <NuxtLink :to="sbPath('/request')" class="sb-header__req" :class="{ 'is-full': req.count.value }">
          <span class="sb-header__req-icon">
            <SbIcon name="list" :size="20" />
            <span v-if="req.count.value" class="sb-badge">{{ req.count.value }}</span>
          </span>
          <span class="sb-header__req-label">{{ reqLabel }}</span>
        </NuxtLink>

        <button type="button" class="sb-btn sb-btn--orange sb-header__price" @click="req.askPrice()">Запросить прайс</button>

        <button type="button" class="sb-iconbtn sb-header__icon sb-header__find" aria-label="Поиск" @click="openSearch()">
          <SbIcon name="search" :size="22" />
        </button>
        <button
          type="button"
          class="sb-iconbtn sb-header__icon sb-header__burger"
          :aria-expanded="menuOpen"
          aria-controls="sb-menu"
          :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
          @click="menuOpen = !menuOpen; catOpen = false"
        >
          <SbIcon :name="menuOpen ? 'close' : 'menu'" :size="22" />
        </button>
      </div>

      <!-- мега-каталог: разделы слева, подразделы справа; на телефоне — по уровням -->
      <div v-if="catOpen" id="sb-catalog" class="sb-cat" @click.self="catOpen = false">
        <div class="sb-cat__panel">
          <div class="sb-wrap sb-cat__grid">
            <nav class="sb-cat__secs" aria-label="Разделы каталога">
              <NuxtLink
                v-for="s in sbSections"
                :key="s.id"
                :to="sbCatalogPath(s.id)"
                class="sb-cat__sec"
                :class="{ 'is-active': activeSec === s.id }"
                @mouseenter="activeSec = s.id"
                @focus="activeSec = s.id"
              >
                <img :src="s.img" alt="" loading="lazy" />
                <span>{{ s.label }}</span>
                <small>{{ sectionCounts[s.id] || 'по запросу' }}</small>
              </NuxtLink>
            </nav>
            <div class="sb-cat__subs" :class="`sb-tone--${current.tone}`">
              <div class="sb-cat__head">
                <h2>{{ current.label }}</h2>
                <NuxtLink :to="sbCatalogPath(current.id)" class="sb-link">
                  Все позиции раздела
                  <SbIcon name="arrow" :size="16" />
                </NuxtLink>
              </div>
              <ul>
                <li v-for="sub in current.subs" :key="sub.id">
                  <NuxtLink :to="sbCatalogPath(current.id, sub.id)">
                    <span>{{ sub.label }}</span>
                    <small :class="{ 'is-empty': !subCount(current.id, sub.id) }">{{ subCount(current.id, sub.id) || 'прайс' }}</small>
                  </NuxtLink>
                </li>
              </ul>
              <img :src="current.img" alt="" class="sb-cat__img" />
              <p v-if="current.adult" class="sb-cat__note">Раздел для покупателей старше 18 лет</p>
            </div>
          </div>
        </div>
      </div>

      <!-- каталог на телефоне: два уровня -->
      <div v-if="catOpen" class="sb-mcat" role="dialog" aria-label="Каталог">
        <div class="sb-mcat__head">
          <button v-if="mobileCurrent" type="button" class="sb-mcat__back" @click="mobileSec = null">
            <SbIcon name="left" :size="20" />
            Назад
          </button>
          <strong v-else>Каталог</strong>
          <button type="button" class="sb-iconbtn" aria-label="Закрыть каталог" @click="catOpen = false">
            <SbIcon name="close" :size="22" />
          </button>
        </div>
        <div v-if="!mobileCurrent" class="sb-mcat__list">
          <button v-for="s in sbSections" :key="s.id" type="button" class="sb-mcat__item" @click="mobileSec = s.id">
            <img :src="s.img" alt="" loading="lazy" />
            <span>
              {{ s.label }}
              <small>{{ sectionCounts[s.id] ? sbPositions(sectionCounts[s.id]) : 'позиции по запросу' }}</small>
            </span>
            <SbIcon name="right" :size="18" />
          </button>
        </div>
        <div v-else class="sb-mcat__list">
          <h2 class="sb-mcat__title">{{ mobileCurrent.label }}</h2>
          <NuxtLink :to="sbCatalogPath(mobileCurrent.id)" class="sb-mcat__item sb-mcat__item--all">
            <span>Все позиции раздела</span>
            <SbIcon name="arrow" :size="18" />
          </NuxtLink>
          <NuxtLink v-for="sub in mobileCurrent.subs" :key="sub.id" :to="sbCatalogPath(mobileCurrent.id, sub.id)" class="sb-mcat__item">
            <span>
              {{ sub.label }}
              <small>{{ subCount(mobileCurrent.id, sub.id) ? sbPositions(subCount(mobileCurrent.id, sub.id)) : 'позиции по запросу' }}</small>
            </span>
            <SbIcon name="right" :size="18" />
          </NuxtLink>
        </div>
      </div>

      <div v-if="menuOpen" id="sb-menu" class="sb-menu" @click.self="menuOpen = false">
        <div class="sb-menu__panel">
          <nav class="sb-menu__nav" aria-label="Разделы сайта">
            <NuxtLink :to="sbPath()">Главная</NuxtLink>
            <NuxtLink :to="sbCatalogPath()">Каталог</NuxtLink>
            <NuxtLink :to="sbPath('/request')">Заявка{{ req.count.value ? ` · ${req.count.value}` : '' }}</NuxtLink>
            <NuxtLink v-for="n in nav" :key="n.to" :to="n.to">{{ n.label }}</NuxtLink>
          </nav>
          <div class="sb-menu__phones">
            <a v-for="p in sbContacts.phones" :key="p.href" :href="p.href">
              <strong>{{ p.label }}</strong>
              <small>{{ p.note }}</small>
            </a>
          </div>
          <div class="sb-menu__social">
            <a :href="sbContacts.telegram" target="_blank" rel="noopener">Telegram</a>
            <a :href="sbContacts.whatsapp" target="_blank" rel="noopener">WhatsApp</a>
            <a :href="sbContacts.max" target="_blank" rel="noopener">MAX</a>
            <a :href="sbContacts.wb" target="_blank" rel="noopener">Мы на WB</a>
          </div>
          <a :href="`mailto:${sbContacts.email}`" class="sb-menu__mail">{{ sbContacts.email }}</a>
        </div>
      </div>
    </header>

    <main class="sb-main">
      <NuxtPage />
    </main>

    <footer class="sb-footer">
      <div class="sb-wrap">
        <div class="sb-footer__panel">
          <div class="sb-footer__about">
            <NuxtLink :to="sbPath()" class="sb-mark" aria-label="СибирьТрейд, на главную">
              <span class="sb-mark__sign" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26">
                  <path class="sb-mark__leaf" d="M12 13.4c-3.6-.1-6.6-2-7.2-5.9 3.9-.2 6.8 1.9 7.2 5.9z" />
                  <path class="sb-mark__leaf" d="M12 11.2c.3-4.6 3.3-7.8 7.6-8.2.3 4.6-3 7.9-7.6 8.2z" />
                  <path d="M12 20.5V11M6.5 20.5h11" />
                </svg>
              </span>
              <span class="sb-mark__text">
                <span class="sb-mark__name">СибирьТрейд</span>
                <span class="sb-mark__sub">Растём вместе!</span>
              </span>
            </NuxtLink>
            <p>
              Крупнооптовые поставки продуктов питания и слабого алкоголя со склада в Новосибирске —
              от Урала до Сахалина. Заказ от 100 000 ₽.
            </p>
            <div class="sb-footer__badges">
              <span v-for="c in sbCompliance" :key="c">{{ c }}</span>
            </div>
          </div>
          <div class="sb-footer__col sb-footer__col--cat">
            <div class="sb-footer__title">Каталог</div>
            <NuxtLink v-for="s in sbSections" :key="s.id" :to="sbCatalogPath(s.id)">{{ s.label }}</NuxtLink>
          </div>
          <div class="sb-footer__col">
            <div class="sb-footer__title">Компания</div>
            <NuxtLink v-for="n in nav" :key="n.to" :to="n.to">{{ n.label }}</NuxtLink>
            <NuxtLink :to="sbPath('/contacts') + '#requisites'">Реквизиты</NuxtLink>
            <a :href="sbContacts.wb" target="_blank" rel="noopener">Мы на WB</a>
          </div>
          <div class="sb-footer__col">
            <div class="sb-footer__title">Контакты</div>
            <a v-for="p in sbContacts.phones" :key="p.href" :href="p.href" class="sb-footer__phone">{{ p.label }}</a>
            <a :href="`mailto:${sbContacts.email}`">{{ sbContacts.email }}</a>
            <span>{{ sbContacts.address }}</span>
            <span>{{ sbContacts.hours }} ({{ sbContacts.tz }})</span>
          </div>
        </div>
        <div class="sb-footer__legal">
          <span>
            Концепт редизайна сайта sibirtreid.ru. Тексты, цены, логотипы и изображения принадлежат
            ООО «СибирьТрейд» и их правообладателям и используются только для демонстрации.
          </span>
          <a :href="sbContacts.original" target="_blank" rel="noopener">Оригинал сайта</a>
        </div>
      </div>
    </footer>

    <!-- нижняя панель на телефоне -->
    <nav class="sb-dock" aria-label="Быстрые действия">
      <a :href="sbContacts.phoneHref" class="sb-dock__item">
        <SbIcon name="phone" :size="20" />
        <span>Позвонить</span>
      </a>
      <button type="button" class="sb-dock__item" :class="{ 'is-on': catOpen }" @click="toggleCatalog">
        <SbIcon name="grid" :size="20" />
        <span>Каталог</span>
      </button>
      <NuxtLink :to="sbPath('/request')" class="sb-dock__item" :class="{ 'is-full': req.count.value }">
        <span class="sb-dock__icon">
          <SbIcon name="list" :size="20" />
          <span v-if="req.count.value" class="sb-badge">{{ req.count.value }}</span>
        </span>
        <span class="sb-dock__sum">{{ req.count.value ? sbRub(req.total.value) : 'Заявка' }}</span>
      </NuxtLink>
      <button type="button" class="sb-dock__price" @click="req.askPrice()">Прайс</button>
    </nav>

    <!-- поиск -->
    <div v-if="searchOpen" class="sb-overlay sb-overlay--top" @click.self="searchOpen = false">
      <div class="sb-search" role="dialog" aria-label="Поиск по каталогу">
        <form class="sb-search__bar" @submit.prevent="goSearch">
          <SbIcon name="search" :size="22" />
          <input ref="searchInput" v-model="q" type="search" placeholder="Бренд, товар или раздел: «Добрый», мука, энергетики" aria-label="Поиск по каталогу" />
          <button type="button" class="sb-iconbtn" aria-label="Закрыть поиск" @click="searchOpen = false">
            <SbIcon name="close" :size="22" />
          </button>
        </form>
        <div v-if="q.trim().length < 2" class="sb-search__empty">
          <div class="sb-search__label">Часто ищут</div>
          <div class="sb-chips">
            <button v-for="s in sbQueries" :key="s" type="button" class="sb-chip" @click="q = s">{{ s }}</button>
          </div>
          <div class="sb-search__label">Разделы</div>
          <div class="sb-search__secs">
            <NuxtLink v-for="s in sbSections.slice(0, 8)" :key="s.id" :to="sbCatalogPath(s.id)" :class="`sb-tone--${s.tone}`">
              <img :src="s.img" alt="" loading="lazy" />
              <span>{{ s.label }}</span>
            </NuxtLink>
          </div>
        </div>
        <div v-else class="sb-search__res">
          <template v-if="found.subs.length">
            <div class="sb-search__label">Разделы</div>
            <div class="sb-chips">
              <NuxtLink v-for="f in found.subs.slice(0, 8)" :key="f.sec.id + f.sub.id" :to="sbCatalogPath(f.sec.id, f.sub.id)" class="sb-chip">
                {{ f.sub.label }} <small>· {{ f.sec.label }}</small>
              </NuxtLink>
            </div>
          </template>
          <div class="sb-search__label">Позиции · {{ found.items.length }}</div>
          <ul v-if="found.items.length" class="sb-search__items">
            <li v-for="i in found.items.slice(0, 8)" :key="i.id">
              <NuxtLink :to="sbPath(`/item/${i.id}`)">
                <span class="sb-search__brand" :class="`sb-tone--${sbSection(i.sec)?.tone}`">{{ i.brand.slice(0, 2) }}</span>
                <span class="sb-search__name">
                  {{ i.name }}
                  <small>{{ sbSection(i.sec)?.label }}{{ sbVols(i) ? ` · ${sbVols(i)}` : '' }}</small>
                </span>
                <strong>от {{ sbRub(i.price) }}</strong>
              </NuxtLink>
            </li>
          </ul>
          <p v-else class="sb-search__none">
            На сайте такой позиции нет — но на складе больше 10 000 наименований.
            <button type="button" class="sb-link" @click="searchOpen = false; req.askPrice(q)">Спросить менеджера</button>
          </p>
          <button v-if="found.items.length > 8" type="button" class="sb-btn sb-btn--soft sb-btn--wide" @click="goSearch">
            Показать все {{ found.items.length }}
          </button>
        </div>
      </div>
    </div>

    <!-- модалка прайса -->
    <div v-if="req.priceModal.value.open" class="sb-overlay" @click.self="req.priceModal.value.open = false">
      <div class="sb-modal" role="dialog" aria-label="Запросить прайс">
        <button type="button" class="sb-modal__close" aria-label="Закрыть" @click="req.priceModal.value.open = false">
          <SbIcon name="close" :size="22" />
        </button>
        <SbPriceForm :topic="req.priceModal.value.topic" modal @done="req.priceModal.value.open = false" />
      </div>
    </div>

    <!-- подтверждение возраста -->
    <div v-if="ageGate" class="sb-overlay">
      <div class="sb-age" role="dialog" aria-label="Подтверждение возраста">
        <span class="sb-age__badge">18+</span>
        <h2>Вам уже есть 18 лет?</h2>
        <p>В разделе — пиво и слабоалкогольные напитки. Продажа только совершеннолетним покупателям.</p>
        <div class="sb-age__actions">
          <button type="button" class="sb-btn" @click="req.adult.value = true">Мне есть 18</button>
          <button type="button" class="sb-btn sb-btn--line" @click="notAdult">Мне нет 18</button>
        </div>
      </div>
    </div>

    <div v-if="req.ready.value && !req.cookies.value" class="sb-cookie" role="region" aria-label="Cookie">
      <p>Сайт использует cookie, чтобы работать удобнее. <NuxtLink :to="sbPath('/contacts') + '#policy'">Политика конфиденциальности</NuxtLink></p>
      <button type="button" class="sb-btn sb-btn--sm" @click="req.cookies.value = true">Хорошо</button>
    </div>
  </div>
</template>

<style lang="scss">
// Тема концепта. Всё привязано к классам, которые живут только пока открыт этот концепт,
// плюс сброс тёмных глобальных стилей портфолио.
html.sb-html {
  scrollbar-color: #bcd9c7 #ffffff;

  &::-webkit-scrollbar-track {
    background: #fff;
  }
  &::-webkit-scrollbar-thumb {
    background: #bcd9c7;
    border-color: #fff;
  }

  &.sb-locked {
    overflow: hidden;
  }
}

body.sb-body {
  background: #fff;
  color: #10241e;
  font-family: 'Wix Madefor Text', system-ui, sans-serif;
}

.sb {
  --sb-green: #00705a;
  --sb-green-d: #005a48;
  --sb-ink: #10241e;
  --sb-muted: #5c6d66;
  --sb-mint: #e8f4ec;
  --sb-mint-2: #d5ebdc;
  --sb-peach: #fff0e6;
  --sb-peach-2: #ffdfca;
  --sb-orange: #f0641e;
  --sb-orange-d: #c94a10;
  --sb-lime: #a0d773;
  --sb-lime-soft: #eef7e2;
  --sb-line: #e2ebe5;
  --sb-display: 'Wix Madefor Display', 'Wix Madefor Text', system-ui, sans-serif;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: var(--sb-ink);
  font-family: 'Wix Madefor Text', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

// Сброс через :where — нулевая специфичность, чтобы классы блоков могли задавать отступы.
:where(.sb) {
  a {
    color: inherit;
    text-decoration: none;
  }

  h1,
  h2,
  h3 {
    margin: 0;
    font-family: var(--sb-display);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.025em;
    color: var(--sb-ink);
  }

  p,
  ul,
  ol,
  figure,
  dl,
  dd {
    margin: 0;
  }

  ul,
  ol {
    padding: 0;
    list-style: none;
  }

  img {
    max-width: 100%;
    display: block;
  }

  button {
    font: inherit;
    color: inherit;
    cursor: pointer;
    background: none;
    border: 0;
    padding: 0;
  }

  input,
  select,
  textarea {
    font: inherit;
    color: inherit;
  }

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.9;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex-shrink: 0;
  }

  :focus-visible {
    outline: 2px solid var(--sb-orange);
    outline-offset: 2px;
  }
}

// тона разделов: мятный, персиковый, лаймовый — как чередование плиток у оригинала
.sb .sb-tone--mint {
  --tone-bg: var(--sb-mint);
  --tone-ink: var(--sb-green-d);
}
.sb .sb-tone--peach {
  --tone-bg: var(--sb-peach);
  --tone-ink: #a93f0b;
}
.sb .sb-tone--lime {
  --tone-bg: var(--sb-lime-soft);
  --tone-ink: #3d6b16;
}

.sb {
  .sb-wrap {
    width: min(1280px, 100% - 32px);
    margin-inline: auto;
  }

  .sb-main {
    flex: 1;
    padding-bottom: 96px;
  }

  .sb-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .sb-muted {
    color: var(--sb-muted);
  }

  .sb-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--sb-green);
    font-weight: 700;

    &:hover {
      color: var(--sb-green-d);
    }
  }

  .sb-badge {
    position: absolute;
    top: -6px;
    right: -8px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--sb-orange);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    line-height: 18px;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  // ---------- кнопки: пилюли ----------
  .sb-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 48px;
    padding: 0 24px;
    border-radius: 999px;
    background: var(--sb-green);
    color: #fff;
    font-weight: 700;
    white-space: nowrap;
    transition: background-color 0.15s, color 0.15s;

    &:hover {
      background: var(--sb-green-d);
    }

    &:disabled {
      background: var(--sb-mint-2);
      color: var(--sb-muted);
      cursor: not-allowed;
    }

    &--orange {
      background: var(--sb-orange-d);

      &:hover {
        background: #b03f0b;
      }
    }

    &--dark {
      background: var(--sb-ink);

      &:hover {
        background: #000;
      }
    }

    &--soft {
      background: var(--sb-mint);
      color: var(--sb-green-d);

      &:hover {
        background: var(--sb-mint-2);
      }
    }

    &--line {
      background: #fff;
      color: var(--sb-ink);
      box-shadow: inset 0 0 0 1.5px var(--sb-line);

      &:hover {
        background: var(--sb-mint);
      }
    }

    &--sm {
      min-height: 40px;
      padding: 0 16px;
      font-size: 14px;
    }

    &--lg {
      min-height: 56px;
      padding: 0 30px;
      font-size: 16px;
    }

    &--wide {
      width: 100%;
    }
  }

  .sb-iconbtn {
    position: relative;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 999px;
    color: var(--sb-ink);
    transition: background-color 0.15s;

    &:hover {
      background: var(--sb-mint);
    }
  }

  .sb-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .sb-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 38px;
    padding: 0 16px;
    border-radius: 999px;
    background: var(--sb-mint);
    color: var(--sb-ink);
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    transition: background-color 0.15s, color 0.15s;

    small {
      color: var(--sb-muted);
      font-weight: 500;
    }

    &:hover {
      background: var(--sb-mint-2);
    }

    &.is-on,
    &.router-link-exact-active {
      background: var(--sb-green);
      color: #fff;

      small {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  // ---------- поля ----------
  .sb-field {
    display: grid;
    gap: 6px;
    min-width: 0;

    > span {
      font-size: 13px;
      font-weight: 600;
      color: var(--sb-muted);
    }

    input,
    textarea,
    select {
      width: 100%;
      min-width: 0;
      min-height: 52px;
      padding: 0 18px;
      border: 0;
      border-radius: 16px;
      background: #fff;
      box-shadow: inset 0 0 0 1.5px var(--sb-line);
      outline: none;
      transition: box-shadow 0.15s;

      &:focus {
        box-shadow: inset 0 0 0 2px var(--sb-green);
      }

      &[aria-invalid='true'] {
        box-shadow: inset 0 0 0 2px var(--sb-orange-d);
      }
    }

    textarea {
      padding: 14px 18px;
      resize: vertical;
      min-height: 96px;
    }

    small {
      font-size: 12.5px;
      color: var(--sb-orange-d);
      font-weight: 600;
    }
  }

  .sb-select {
    position: relative;
    display: block;
    min-width: 0;

    select {
      appearance: none;
      width: 100%;
      min-width: 0;
      height: 40px;
      padding: 0 40px 0 16px;
      border: 0;
      border-radius: 999px;
      background: #fff;
      box-shadow: inset 0 0 0 1.5px var(--sb-line);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      text-overflow: ellipsis;
    }

    .sb-icon {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: var(--sb-muted);
    }
  }

  // ---------- заголовки секций ----------
  .sb-section {
    margin-top: clamp(56px, 8vw, 96px);
  }

  .sb-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px 24px;
    flex-wrap: wrap;
    margin-bottom: 24px;

    h2 {
      font-size: clamp(28px, 3.6vw, 42px);
    }

    p {
      max-width: 560px;
      margin-top: 10px;
      color: var(--sb-muted);
      font-size: 16px;
    }
  }

  .sb-crumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 20px 0 14px;
    font-size: 13px;
    color: var(--sb-muted);

    a:hover {
      color: var(--sb-green);
    }

    span[aria-hidden] {
      opacity: 0.5;
    }
  }

  .sb-page-title {
    font-size: clamp(32px, 4.6vw, 54px);
  }

  // ---------- баннер концепта и объявление ----------
  .sb-banner {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 4px 12px;
    padding: 8px 16px;
    background: var(--sb-ink);
    color: #cfe0d7;
    font-size: 13px;
    text-align: center;

    a {
      color: var(--sb-lime);
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  .sb-notice {
    background: var(--sb-peach);

    &__row {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 48px;
      padding: 8px 0;
      font-size: 14px;
    }

    &__mark {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--sb-orange);
      color: #fff;
      font-weight: 800;
      font-size: 15px;
    }

    p {
      flex: 1;
      min-width: 0;
    }

    &__more {
      flex-shrink: 0;
      color: var(--sb-orange-d);
      font-weight: 700;
    }

    &__close {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      color: var(--sb-muted);

      &:hover {
        background: var(--sb-peach-2);
      }
    }

    @media (max-width: 700px) {
      &__row {
        align-items: flex-start;
        font-size: 13px;
        line-height: 1.45;
      }

      &__more {
        display: none;
      }
    }
  }

  // ---------- шапка ----------
  .sb-header {
    position: sticky;
    top: 0;
    z-index: 40;
    background: #fff;
    box-shadow: 0 1px 0 var(--sb-line);
  }

  .sb-util {
    border-bottom: 1px solid var(--sb-line);
    font-size: 13.5px;

    &__row {
      display: flex;
      align-items: center;
      gap: 24px;
      min-height: 40px;
    }

    &__geo {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--sb-muted);
      white-space: nowrap;
    }

    &__nav {
      display: flex;
      gap: 22px;
      margin-left: auto;

      a {
        font-weight: 600;
        white-space: nowrap;

        &:hover,
        &.router-link-active {
          color: var(--sb-green);
        }
      }
    }

    &__wb {
      padding: 3px 12px;
      border-radius: 999px;
      background: #f3e9ff;
      color: #7f1472;
      font-weight: 700;
      white-space: nowrap;
    }

    &__social {
      display: flex;
      gap: 4px;

      a {
        display: grid;
        place-items: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        color: var(--sb-green);

        &:hover {
          background: var(--sb-mint);
        }
      }
    }

    &__max {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    @media (max-width: 1100px) {
      &__geo {
        display: none;
      }

      &__nav {
        margin-left: 0;
      }
    }

    @media (max-width: 860px) {
      display: none;
    }
  }

  .sb-header__row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 80px;
  }

  .sb-mark {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;

    &__sign {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: var(--sb-green);
      color: #fff;

      svg {
        stroke-width: 1.8;
      }
    }

    &__leaf {
      fill: var(--sb-lime);
      stroke: none;
    }

    &__text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    &__name {
      font-family: var(--sb-display);
      font-size: 21px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--sb-green-d);
    }

    &__sub {
      margin-top: 3px;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--sb-muted);
    }
  }

  .sb-header__cat {
    margin-left: 12px;
  }

  .sb-header__search {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    padding: 0 18px;
    border-radius: 999px;
    background: var(--sb-mint);
    color: var(--sb-muted);
    text-align: left;
    transition: box-shadow 0.15s;

    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &:hover {
      box-shadow: inset 0 0 0 1.5px var(--sb-mint-2);
    }
  }

  .sb-header__phone {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    white-space: nowrap;
    padding: 0 6px;

    strong {
      font-family: var(--sb-display);
      font-size: 17px;
      font-weight: 800;
    }

    small {
      font-size: 12px;
      color: var(--sb-muted);
    }

    &:hover strong {
      color: var(--sb-green);
    }
  }

  .sb-header__req {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    padding: 0 18px 0 16px;
    border-radius: 999px;
    background: var(--sb-mint);
    color: var(--sb-green-d);
    font-weight: 700;
    white-space: nowrap;
    transition: background-color 0.15s;

    &:hover {
      background: var(--sb-mint-2);
    }

    &-icon {
      position: relative;
      display: grid;
    }

    &-label {
      min-width: 92px;
      font-variant-numeric: tabular-nums;
    }
  }

  .sb-header__icon {
    display: none;
  }

  @media (max-width: 1240px) {
    .sb-header__phone {
      display: none;
    }
  }

  @media (max-width: 1020px) {
    .sb-header__price {
      display: none;
    }
  }

  @media (max-width: 860px) {
    .sb-header__row {
      min-height: 64px;
      gap: 4px;
    }

    .sb-header__cat,
    .sb-header__search,
    .sb-header__req {
      display: none;
    }

    .sb-header__icon {
      display: grid;
    }

    .sb-header__find {
      margin-left: auto;
    }

    .sb-mark__sign {
      width: 40px;
      height: 40px;
      border-radius: 12px;
    }

    .sb-mark__name {
      font-size: 19px;
    }
  }

  // ---------- мега-каталог ----------
  .sb-cat {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 100vh;
    z-index: 30;
    background: rgba(16, 36, 30, 0.35);

    &__panel {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: #fff;
      border-radius: 0 0 28px 28px;
      padding: 20px 0 28px;
      max-height: calc(100vh - 140px);
      overflow: auto;
    }

    &__grid {
      display: grid;
      grid-template-columns: 340px minmax(0, 1fr);
      gap: 20px;
    }

    &__secs {
      display: grid;
      gap: 2px;
    }

    &__sec {
      display: grid;
      grid-template-columns: 40px minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      padding: 6px 14px 6px 8px;
      border-radius: 16px;
      font-weight: 600;
      transition: background-color 0.15s;

      img {
        width: 40px;
        height: 34px;
        object-fit: contain;
      }

      small {
        color: var(--sb-muted);
        font-size: 12.5px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }

      &:hover,
      &.is-active {
        background: var(--sb-mint);
      }

      &.is-active {
        color: var(--sb-green-d);
      }
    }

    &__subs {
      position: relative;
      overflow: hidden;
      padding: 28px 32px;
      border-radius: 28px;
      background: var(--tone-bg);
      min-height: 100%;

      ul {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 260px));
        gap: 4px 24px;
      }

      a {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        padding: 9px 12px;
        border-radius: 12px;
        font-weight: 600;

        &:hover {
          background: rgba(255, 255, 255, 0.7);
          color: var(--sb-green-d);
        }
      }

      small {
        flex-shrink: 0;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--tone-ink);
        font-variant-numeric: tabular-nums;

        &.is-empty {
          color: var(--sb-muted);
          font-weight: 500;
        }
      }
    }

    &__head {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 18px;
      max-width: 560px;

      h2 {
        font-size: 30px;
      }
    }

    &__img {
      position: absolute;
      right: 24px;
      bottom: 16px;
      width: 260px;
      height: 220px;
      object-fit: contain;
    }

    &__note {
      position: relative;
      z-index: 1;
      margin-top: 18px;
      font-size: 13px;
      font-weight: 600;
      color: var(--tone-ink);
    }

    @media (max-width: 1100px) {
      &__img {
        width: 160px;
        height: 140px;
        opacity: 0.9;
      }
    }

    @media (max-width: 860px) {
      display: none;
    }
  }

  .sb-mcat {
    display: none;

    @media (max-width: 860px) {
      position: fixed;
      inset: 0;
      z-index: 60;
      display: flex;
      flex-direction: column;
      background: #fff;
    }

    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 64px;
      padding: 0 12px 0 16px;
      border-bottom: 1px solid var(--sb-line);

      strong {
        font-family: var(--sb-display);
        font-size: 20px;
        font-weight: 800;
      }
    }

    &__back {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      min-height: 44px;
      font-weight: 700;
      color: var(--sb-green);
    }

    &__list {
      flex: 1;
      overflow: auto;
      padding: 8px 8px 96px;
    }

    &__title {
      padding: 14px 10px 8px;
      font-size: 26px;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: 60px;
      padding: 8px 10px;
      border-radius: 16px;
      text-align: left;
      font-weight: 700;

      img {
        width: 48px;
        height: 40px;
        object-fit: contain;
      }

      > span {
        flex: 1;
        display: flex;
        flex-direction: column;
        line-height: 1.25;
        min-width: 0;
      }

      small {
        font-size: 13px;
        font-weight: 500;
        color: var(--sb-muted);
      }

      .sb-icon {
        color: var(--sb-muted);
      }

      &:active,
      &:hover {
        background: var(--sb-mint);
      }

      &--all {
        color: var(--sb-green);
        background: var(--sb-mint);
        margin-bottom: 4px;
      }
    }
  }

  // ---------- бургер ----------
  .sb-menu {
    position: fixed;
    inset: 0;
    z-index: 60;
    background: rgba(16, 36, 30, 0.4);

    &__panel {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: min(380px, 100%);
      padding: 72px 20px 110px;
      background: #fff;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    &__nav {
      display: grid;

      a {
        padding: 12px 4px;
        border-bottom: 1px solid var(--sb-line);
        font-family: var(--sb-display);
        font-size: 19px;
        font-weight: 700;

        &.router-link-exact-active {
          color: var(--sb-green);
        }
      }
    }

    &__phones {
      display: grid;
      gap: 10px;

      a {
        display: flex;
        flex-direction: column;
        line-height: 1.25;
      }

      strong {
        font-size: 18px;
      }

      small {
        color: var(--sb-muted);
      }
    }

    &__social {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      a {
        padding: 8px 14px;
        border-radius: 999px;
        background: var(--sb-mint);
        font-weight: 700;
        font-size: 14px;
        color: var(--sb-green-d);
      }
    }

    &__mail {
      font-weight: 700;
      color: var(--sb-green);
    }
  }

  // ---------- подвал ----------
  .sb-footer {
    padding: 0 0 24px;

    &__panel {
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1.3fr) minmax(0, 0.9fr) minmax(0, 1fr);
      gap: 32px;
      padding: clamp(28px, 4vw, 48px);
      border-radius: 32px;
      background: var(--sb-mint);
    }

    &__about {
      display: flex;
      flex-direction: column;
      gap: 16px;

      p {
        color: var(--sb-muted);
        max-width: 340px;
      }
    }

    &__badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      span {
        padding: 4px 10px;
        border-radius: 999px;
        background: #fff;
        font-size: 12.5px;
        font-weight: 700;
        color: var(--sb-green-d);
      }
    }

    &__col {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
      font-size: 14.5px;

      a:hover {
        color: var(--sb-green);
      }

      span {
        color: var(--sb-muted);
      }

      &--cat {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        align-content: start;
        column-gap: 18px;

        .sb-footer__title {
          grid-column: 1 / -1;
        }
      }
    }

    &__title {
      font-family: var(--sb-display);
      font-weight: 800;
      font-size: 17px;
      margin-bottom: 6px;
    }

    &__phone {
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }

    &__legal {
      display: flex;
      justify-content: space-between;
      gap: 12px 24px;
      flex-wrap: wrap;
      padding: 18px 8px 0;
      font-size: 13px;
      color: var(--sb-muted);

      span {
        max-width: 760px;
      }

      a {
        font-weight: 700;
        color: var(--sb-green);
      }
    }

    @media (max-width: 1080px) {
      &__panel {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 600px) {
      &__panel {
        grid-template-columns: minmax(0, 1fr);
        border-radius: 24px;
      }
    }
  }

  // ---------- нижняя панель ----------
  .sb-dock {
    display: none;

    @media (max-width: 860px) {
      position: fixed;
      left: 8px;
      right: 8px;
      bottom: 8px;
      z-index: 50;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 1.15fr);
      align-items: center;
      gap: 2px;
      padding: 6px;
      border-radius: 24px;
      background: #fff;
      box-shadow: 0 8px 30px rgba(16, 36, 30, 0.16), inset 0 0 0 1px var(--sb-line);
    }

    &__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      min-height: 52px;
      min-width: 0;
      border-radius: 18px;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--sb-ink);

      &.is-on,
      &.router-link-active {
        background: var(--sb-mint);
        color: var(--sb-green-d);
      }

      &.is-full {
        color: var(--sb-green-d);
      }
    }

    &__icon {
      position: relative;
      display: grid;
    }

    &__sum {
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-variant-numeric: tabular-nums;
    }

    &__price {
      min-height: 52px;
      border-radius: 18px;
      background: var(--sb-orange-d);
      color: #fff;
      font-weight: 800;
      font-size: 14px;
    }
  }

  // ---------- оверлеи ----------
  .sb-overlay {
    position: fixed;
    inset: 0;
    z-index: 70;
    display: grid;
    place-items: center;
    padding: 16px;
    background: rgba(16, 36, 30, 0.45);
    overflow: auto;

    &--top {
      place-items: start center;
      padding-top: 72px;
    }
  }

  .sb-modal {
    position: relative;
    width: min(720px, 100%);

    &__close {
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 5;
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #fff;
      color: var(--sb-ink);
    }

    .sb-pform__stamp {
      right: 72px;
    }

    .sb-pform__title {
      padding-right: 150px;
    }

    @media (max-width: 560px) {
      .sb-pform__stamp {
        display: none;
      }

      .sb-pform__title {
        padding-right: 48px;
      }
    }
  }

  .sb-search {
    width: min(760px, 100%);
    border-radius: 28px;
    background: #fff;
    overflow: hidden;

    &__bar {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 10px 10px 22px;
      border-bottom: 1px solid var(--sb-line);
      color: var(--sb-muted);

      input {
        flex: 1;
        min-width: 0;
        height: 48px;
        border: 0;
        outline: none;
        font-size: 17px;
        color: var(--sb-ink);
        background: none;
      }
    }

    &__empty,
    &__res {
      display: grid;
      gap: 12px;
      padding: 20px 22px 24px;
      max-height: min(70vh, 640px);
      overflow: auto;
    }

    &__label {
      font-size: 13px;
      font-weight: 700;
      color: var(--sb-muted);
    }

    &__secs {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;

      a {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 12px;
        border-radius: 18px;
        background: var(--tone-bg);
        font-size: 13.5px;
        font-weight: 700;
        line-height: 1.25;
      }

      img {
        width: 100%;
        height: 60px;
        object-fit: contain;
      }
    }

    &__items {
      display: grid;
      gap: 4px;

      a {
        display: grid;
        grid-template-columns: 44px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        padding: 8px;
        border-radius: 16px;

        &:hover {
          background: var(--sb-mint);
        }
      }

      strong {
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
    }

    &__brand {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: var(--tone-bg);
      color: var(--tone-ink);
      font-family: var(--sb-display);
      font-weight: 800;
    }

    &__name {
      display: flex;
      flex-direction: column;
      font-weight: 600;
      line-height: 1.3;
      min-width: 0;

      small {
        color: var(--sb-muted);
        font-weight: 500;
      }
    }

    &__none {
      color: var(--sb-muted);
    }

    @media (max-width: 600px) {
      &__secs {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      &__items a {
        grid-template-columns: 40px minmax(0, 1fr);
      }

      &__items strong {
        grid-column: 2;
        font-size: 14px;
      }
    }
  }

  .sb-age {
    width: min(460px, 100%);
    padding: 32px;
    border-radius: 28px;
    background: #fff;
    text-align: center;

    &__badge {
      display: inline-grid;
      place-items: center;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: var(--sb-lime);
      font-family: var(--sb-display);
      font-size: 24px;
      font-weight: 800;
    }

    h2 {
      margin-top: 16px;
      font-size: 28px;
    }

    p {
      margin-top: 10px;
      color: var(--sb-muted);
    }

    &__actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 24px;
    }

    @media (max-width: 400px) {
      &__actions {
        grid-template-columns: 1fr;
      }
    }
  }

  .sb-cookie {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 45;
    display: flex;
    align-items: center;
    gap: 14px;
    max-width: 440px;
    padding: 14px 14px 14px 20px;
    border-radius: 22px;
    background: #fff;
    box-shadow: 0 10px 30px rgba(16, 36, 30, 0.16), inset 0 0 0 1px var(--sb-line);
    font-size: 13.5px;

    a {
      color: var(--sb-green);
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    @media (max-width: 860px) {
      left: 8px;
      right: 8px;
      bottom: 90px;
      max-width: none;
    }
  }
}

// общие для главной, блога и заявки
.sb .sb-post {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 190px;
  padding: 22px;
  border-radius: 26px;
  background: var(--tone-bg);
  overflow: hidden;

  img {
    position: absolute;
    right: -10px;
    bottom: -10px;
    width: 120px;
    height: 100px;
    object-fit: contain;
    opacity: 0.95;
  }

  &__date {
    font-size: 13px;
    font-weight: 600;
    color: var(--tone-ink);
  }

  &__title {
    position: relative;
    max-width: 82%;
    font-family: var(--sb-display);
    font-size: 19px;
    font-weight: 800;
    line-height: 1.25;
  }

  &:hover .sb-post__title {
    color: var(--sb-green-d);
  }
}

.sb .sb-meter {
  height: 12px;
  border-radius: 999px;
  background: var(--sb-mint);
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: var(--sb-lime);
    transform-origin: left;
    transition: transform 0.3s;
  }
}
</style>
