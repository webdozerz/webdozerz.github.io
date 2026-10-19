<script lang="ts" setup>
import SbIcon from '~/components/redesign/sibirtreid/SbIcon.vue'
import SbPriceForm from '~/components/redesign/sibirtreid/SbPriceForm.vue'

const req = useSibirtreidRequest()

const description =
  'Крупнооптовые поставки продуктов питания и слабого алкоголя со склада в Новосибирске: каталог с ценами за упаковку, заявка с расчётом суммы, прайс за 5 минут, доставка в Якутию.'
useSeoMeta({
  title: 'СибирьТрейд — концепт редизайна',
  ogTitle: 'СибирьТрейд — концепт редизайна',
  description,
  ogDescription: description,
  ogImage: 'https://andryushov.me/redesign/sibirtreid/og.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

// ---------- сцена: страница останавливается на блоке, пока товары не проедут ----------
// Блок обычной высоты и не закрепляется. Когда панель доезжает до шапки, колесо и свайп двигают
// карусель (по товару за шаг), фон идёт от мятного к оранжевому; после последнего товара
// прокрутка отпускается. Обратно — так же. Наверху страницы карусель листается сама.
const stageItems = sbStage.map((s) => {
  const item = 'item' in s.to ? sbFind(s.to.item) : undefined
  const to = 'item' in s.to ? sbPath(`/item/${s.to.item}`) : sbCatalogPath(s.to.sec, s.to.sub)
  return { ...s, item, href: to }
})
const N = stageItems.length
const base = ref(0) // сдвиг от автопрокрутки, точек и свайпа
const c = ref(0) // сколько товаров проехало за остановку: 0…N-1
const active = computed(() => (((base.value + c.value) % N) + N) % N)
const forward = ref(true)
watch(active, (now, before) => {
  forward.value = now === (before + 1) % N
})
const p = computed(() => c.value / (N - 1))
const fact = computed(() => Math.min(sbFacts.length - 1, Math.floor((c.value * sbFacts.length) / N)))

const stops = [
  [232, 244, 236],
  [205, 233, 174],
  [255, 216, 189],
  [240, 100, 30],
]
const bg = computed(() => {
  const t = p.value * (stops.length - 1)
  const i = Math.min(stops.length - 2, Math.floor(t))
  const f = t - i
  const col = stops[i].map((v, k) => Math.round(v + (stops[i + 1][k] - v) * f))
  return `rgb(${col.join(',')})`
})
const hot = computed(() => p.value > 0.8)

// Карусель по кругу: видны центральный товар и по одному с боков, остальные спрятаны.
const offset = (i: number) => ((i - active.value + N + Math.floor(N / 2)) % N) - Math.floor(N / 2)
const itemStyle = (i: number) => {
  const t = offset(i)
  const a = Math.abs(t)
  const scale = Math.max(0.4, 1 - Math.min(a, 2) * 0.27)
  // товар, который перескочил с левого края на правый, не должен лететь через сцену
  const jumped = forward.value && t === N - 1 - Math.floor(N / 2)
  return {
    transform: `translate(-50%, -50%) translateX(${t * 34}%) translateY(${a * a * 7}%) rotate(${t * 9}deg) scale(${scale})`,
    opacity: a >= 1.9 ? 0 : 1 - Math.max(0, a - 1) * 0.5,
    zIndex: String(10 - a * 2),
    transition: jumped ? 'none' : undefined,
    '--w': String(stageItems[i].w),
  }
}

let timer: ReturnType<typeof setInterval> | undefined
const paused = ref(false)
const reduced = ref(false)
const next = () => {
  if (paused.value || document.hidden || c.value > 0) return
  base.value += 1
}
const start = () => {
  clearInterval(timer)
  if (!reduced.value) timer = setInterval(next, 3200)
}
const go = (i: number) => {
  base.value = i - c.value
  start()
}

// ---------- остановка прокрутки на блоке ----------
const stage = ref<HTMLElement | null>(null)
const GAP = 16
const dist = () => {
  const panel = stage.value?.querySelector<HTMLElement>('.sb-stage__panel')
  // высота закреплённой шапки, а не её текущий низ: плашка концепта и объявление над ней
  // должны уехать, иначе на телефоне сцена встанет, когда панель ещё не помещается на экран
  const head = document.querySelector<HTMLElement>('.sb-header')?.offsetHeight ?? 120
  const gap = window.innerWidth <= 860 ? 8 : GAP
  return panel ? panel.getBoundingClientRect().top - head - gap : Infinity
}
let acc = 0
let lastStep = 0
const COOLDOWN = 380
// Возвращает true, если жест съеден сценой (страница не прокручивается).
const consume = (delta: number, threshold: number) => {
  const d = dist()
  const now = performance.now()
  const down = delta > 0
  const finished = down ? c.value >= N - 1 : c.value <= 0
  if (finished) {
    // хвост инерции тачпада после последнего товара не должен сразу утащить страницу
    return Math.abs(d) < 2 && now - lastStep < 450
  }
  // подъезжаем к блоку: доводим панель ровно под шапку и встаём
  if (down ? d > 2 : d < -2) {
    if (Math.abs(delta) >= Math.abs(d)) {
      // мгновенно: у сайта глобально scroll-behavior: smooth, плавная доводка спорила бы с колесом
      window.scrollBy({ top: d, behavior: 'instant' })
      acc = 0
      lastStep = now
      return true
    }
    return false
  }
  // блок уже проехали в эту сторону (полоса прокрутки, якорь) — не держим
  if (down ? d < -2 : d > 2) return false
  acc += delta
  if (now - lastStep > COOLDOWN && Math.abs(acc) >= threshold) {
    c.value += down ? 1 : -1
    lastStep = now
    acc = 0
  }
  return true
}
const onWheel = (e: WheelEvent) => {
  if (reduced.value || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
  const delta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY
  if (consume(delta, 30)) e.preventDefault()
}
let touchY = 0
const onPageTouchStart = (e: TouchEvent) => {
  touchY = e.touches[0].clientY
}
const onPageTouchMove = (e: TouchEvent) => {
  if (reduced.value) return
  const y = e.touches[0].clientY
  const delta = touchY - y
  touchY = y
  if (delta && consume(delta, 24)) e.preventDefault()
}
// прокрутили мимо без колеса (полоса, клавиши, якорь) — состояние сцены по положению страницы
const onScroll = () => {
  const d = dist()
  if (d < -40) c.value = N - 1
  else if (d > 40) c.value = 0
}

// свайп по товарам вбок
let touchX = 0
const onTouchStart = (e: TouchEvent) => {
  touchX = e.touches[0].clientX
}
const onTouchEnd = (e: TouchEvent) => {
  const dx = e.changedTouches[0].clientX - touchX
  if (Math.abs(dx) < 40) return
  go(dx < 0 ? active.value + 1 : active.value - 1)
}
onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  start()
  onScroll()
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('touchstart', onPageTouchStart, { passive: true })
  window.addEventListener('touchmove', onPageTouchMove, { passive: false })
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  clearInterval(timer)
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('touchstart', onPageTouchStart)
  window.removeEventListener('touchmove', onPageTouchMove)
  window.removeEventListener('scroll', onScroll)
})

// ---------- разделы и полки ----------
const tiles = sbSections.map((s) => ({ ...s, count: sbCount(s.id), from: sbFrom(sbOf(s.id)) }))
const popular = sbPopular.map((p) => {
  const list = sbOf(p.sec, p.sub)
  return { ...p, count: list.length, from: sbFrom(list), tone: sbSection(p.sec)!.tone }
})

const track = ref<HTMLElement | null>(null)
const trackP = ref(0)
const onTrack = () => {
  const el = track.value
  if (!el) return
  trackP.value = el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth)
}
const slide = (dir: 1 | -1) => {
  const el = track.value
  if (!el) return
  el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
}

const posts = sbPosts.slice(0, 3)
const progress = computed(() => Math.min(1, req.total.value / SB_MIN_ORDER))
</script>

<template>
  <div class="sb-home">
    <!-- 1. сцена с прокруткой -->
    <section
      ref="stage"
      class="sb-stage"
      :class="{ 'is-hot': hot }"
      aria-label="СибирьТрейд — крупный опт продуктов"
    >
      <div class="sb-stage__sticky">
        <div class="sb-wrap sb-stage__frame">
          <div
            class="sb-stage__panel"
            :style="{ background: bg }"
            @mouseenter="paused = true"
            @mouseleave="paused = false"
            @focusin="paused = true"
            @focusout="paused = false"
          >
            <div class="sb-stage__copy">
              <span class="sb-stage__tag">Оптовый поставщик продуктов · с 2012 года</span>
              <h1>Крупный опт продуктов и слабого алкоголя от Урала до Сахалина</h1>
              <div class="sb-stage__fact" aria-live="polite">
                <Transition name="sb-fact" mode="out-in">
                  <p :key="fact">
                    <strong>{{ sbFacts[fact].big }}</strong>
                    <span>{{ sbFacts[fact].text }}</span>
                  </p>
                </Transition>
              </div>
              <div class="sb-stage__bars" role="tablist" aria-label="Факты о компании">
                <button
                  v-for="(f, i) in sbFacts"
                  :key="f.big"
                  type="button"
                  role="tab"
                  :aria-selected="i === fact"
                  :aria-label="f.big"
                  :class="{ 'is-on': i <= fact }"
                  @click="c = Math.min(N - 1, Math.ceil((i * N) / sbFacts.length))"
                />
              </div>
              <div class="sb-stage__actions">
                <NuxtLink :to="sbCatalogPath()" class="sb-btn sb-btn--lg" :class="{ 'sb-btn--dark': hot }">
                  Собрать заявку
                  <SbIcon name="arrow" :size="18" />
                </NuxtLink>
                <button type="button" class="sb-btn sb-btn--lg sb-stage__price" @click="req.askPrice()">Запросить прайс</button>
              </div>
              <p class="sb-stage__min">Заказ от 100 000 ₽ · договор, ЭДО, полный пакет сертификатов</p>
            </div>

            <div class="sb-stage__belt" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
              <NuxtLink
                v-for="(it, i) in stageItems"
                :key="it.img"
                :to="it.href"
                class="sb-stage__item"
                :class="{ 'is-active': i === active }"
                :style="itemStyle(i)"
                :tabindex="i === active ? 0 : -1"
                :aria-hidden="i !== active"
              >
                <img :src="sbImg(it.img)" :alt="it.label" :loading="i < 3 ? 'eager' : 'lazy'" />
              </NuxtLink>
              <NuxtLink :to="stageItems[active].href" class="sb-stage__label">
                <span>{{ stageItems[active].label }}</span>
                <strong v-if="stageItems[active].item">от {{ sbRub(stageItems[active].item!.price) }} / уп.</strong>
                <strong v-else>прайс по запросу</strong>
              </NuxtLink>
            </div>

            <div class="sb-stage__dots" role="tablist" aria-label="Товары">
              <button
                v-for="(it, i) in stageItems"
                :key="it.img"
                type="button"
                role="tab"
                :aria-selected="i === active"
                :aria-label="it.label"
                :class="{ 'is-on': i === active }"
                @click="go(i)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. разделы каталога -->
    <section class="sb-wrap sb-section sb-sections">
      <div class="sb-head">
        <div>
          <h2>Каталог по разделам</h2>
          <p>{{ sbItems.length }} позиций с ценой за упаковку на сайте и больше 10 000 наименований на складе в Новосибирске.</p>
        </div>
        <button type="button" class="sb-btn sb-btn--soft" @click="$router.push(sbCatalogPath())">
          Весь каталог
          <SbIcon name="arrow" :size="18" />
        </button>
      </div>
      <div class="sb-tiles">
        <NuxtLink v-for="t in tiles" :key="t.id" :to="sbCatalogPath(t.id)" class="sb-tile" :class="`sb-tone--${t.tone}`">
          <span class="sb-tile__label">{{ t.label }}</span>
          <span class="sb-tile__meta">
            <template v-if="t.count">{{ sbPositions(t.count) }} · от {{ sbRub(t.from) }}</template>
            <template v-else>позиции по запросу</template>
          </span>
          <img :src="t.img" alt="" loading="lazy" class="sb-tile__img" />
          <span class="sb-tile__go" aria-hidden="true"><SbIcon name="arrow" :size="18" /></span>
          <span v-if="t.adult" class="sb-tile__age">18+</span>
        </NuxtLink>
      </div>
    </section>

    <!-- 3. часто заказывают — карусель -->
    <section class="sb-section sb-popular">
      <div class="sb-wrap sb-head">
        <div>
          <h2>Часто заказывают</h2>
          <p>Подразделы, которые магазины и кафе берут чаще всего. Цена — от минимальной упаковки.</p>
        </div>
        <div class="sb-popular__nav">
          <button type="button" class="sb-iconbtn sb-popular__arrow" aria-label="Назад" :disabled="trackP <= 0.01" @click="slide(-1)">
            <SbIcon name="left" :size="22" />
          </button>
          <button type="button" class="sb-iconbtn sb-popular__arrow" aria-label="Вперёд" :disabled="trackP >= 0.99" @click="slide(1)">
            <SbIcon name="right" :size="22" />
          </button>
        </div>
      </div>
      <div ref="track" class="sb-wrap sb-popular__track" :class="{ 'is-start': trackP <= 0.01, 'is-end': trackP >= 0.99 }" @scroll.passive="onTrack">
        <NuxtLink v-for="c in popular" :key="c.sub" :to="sbCatalogPath(c.sec, c.sub)" class="sb-pop" :class="`sb-tone--${c.tone}`">
          <span class="sb-pop__img"><img :src="c.img" :alt="c.label" loading="lazy" /></span>
          <span class="sb-pop__label">{{ c.label }}</span>
          <span class="sb-pop__meta">
            <strong>от {{ sbRub(c.from) }}</strong>
            <span>{{ sbPositions(c.count) }}</span>
          </span>
        </NuxtLink>
      </div>
      <div class="sb-wrap">
        <div class="sb-popular__bar" aria-hidden="true"><span :style="{ transform: `scaleX(${0.18 + trackP * 0.82})` }" /></div>
      </div>
    </section>

    <!-- 4. заявка вместо звонка -->
    <section class="sb-wrap sb-section">
      <div class="sb-reqdemo">
        <div class="sb-reqdemo__copy">
          <h2>Соберите заявку прямо на сайте</h2>
          <p>
            Выберите позиции, объём и число упаковок — сумма и шкала до минимального заказа посчитаются сами.
            Менеджер получит готовый список с ИНН и перезвонит с точной ценой и наличием.
          </p>
          <ul>
            <li><SbIcon name="check" :size="18" /> Цена «от» за упаковку видна сразу, без звонка</li>
            <li><SbIcon name="check" :size="18" /> Минимум 10 упаковок на позицию — счётчик подскажет</li>
            <li><SbIcon name="check" :size="18" /> Заявку можно скачать таблицей для бухгалтерии</li>
          </ul>
        </div>
        <div class="sb-reqdemo__card">
          <div class="sb-reqdemo__top">
            <span>Ваша заявка</span>
            <strong>{{ req.count.value ? `от ${sbRub(req.total.value)}` : '0 ₽' }}</strong>
          </div>
          <div class="sb-meter" role="progressbar" :aria-valuenow="Math.round(progress * 100)" aria-valuemin="0" aria-valuemax="100" aria-label="До минимального заказа">
            <span :style="{ transform: `scaleX(${progress})` }" />
          </div>
          <p class="sb-reqdemo__left">
            <template v-if="!req.count.value">Минимальный заказ — 100 000 ₽. Добавьте позиции из каталога.</template>
            <template v-else-if="req.left.value">До минимального заказа ещё {{ sbRub(req.left.value) }}</template>
            <template v-else>Минимальный заказ набран — можно отправлять</template>
          </p>
          <ul v-if="req.count.value" class="sb-reqdemo__lines">
            <li v-for="r in req.rows.value.slice(0, 3)" :key="r.key">
              <span>{{ r.item.name }}<small v-if="r.vol"> · {{ r.vol }} {{ r.item.unit }}</small></span>
              <strong>{{ r.qty }} уп.</strong>
            </li>
            <li v-if="req.count.value > 3" class="sb-muted">и ещё {{ sbPositions(req.count.value - 3) }}</li>
          </ul>
          <NuxtLink v-if="req.count.value" :to="sbPath('/request')" class="sb-btn sb-btn--wide">Открыть заявку</NuxtLink>
          <NuxtLink v-else :to="sbCatalogPath('drinks')" class="sb-btn sb-btn--wide">Начать с напитков</NuxtLink>
        </div>
      </div>
    </section>

    <!-- 5. как работаем -->
    <section class="sb-wrap sb-section">
      <div class="sb-head">
        <div>
          <h2>Как мы работаем</h2>
          <p>Упаковка и погрузка уже включены в стоимость доставки. Условия оплаты обсуждаем индивидуально.</p>
        </div>
        <NuxtLink :to="sbPath('/delivery')" class="sb-link">Доставка и оплата <SbIcon name="arrow" :size="16" /></NuxtLink>
      </div>
      <ol class="sb-steps">
        <li v-for="(st, i) in sbSteps" :key="st.title">
          <span class="sb-steps__n">Шаг {{ i + 1 }}</span>
          <h3>{{ st.title }}</h3>
          <p>{{ st.text }}</p>
        </li>
      </ol>
    </section>

    <!-- 6. логистика -->
    <section class="sb-wrap sb-section">
      <div class="sb-route">
        <div class="sb-route__copy">
          <h2>Из Новосибирска — в Якутию и на Дальний Восток</h2>
          <p>
            Склад и распределительный центр — в крупнейшем логистическом хабе Сибири. Северный завоз знаем
            досконально: возим только проверенными транспортными компаниями, следим за температурой
            и целостностью упаковки.
          </p>
          <div class="sb-route__facts">
            <div><strong>0 ₽</strong><span>до ТК или вашего склада в Новосибирске от 100 000 ₽</span></div>
            <div><strong>9</strong><span>колл-центров в Якутии</span></div>
          </div>
          <div class="sb-route__docs">
            <span>Работаем через</span>
            <span v-for="c in sbCompliance" :key="c" class="sb-route__doc">{{ c }}</span>
          </div>
        </div>
        <div class="sb-route__map" aria-label="Города, куда возим">
          <div class="sb-route__hub">
            <SbIcon name="box" :size="22" />
            <span><strong>Новосибирск</strong><small>склад, Северный проезд, 33</small></span>
          </div>
          <ul>
            <li v-for="c in sbCities" :key="c.city">
              <span>{{ c.city }}</span>
              <small>{{ c.phone ?? c.address }}</small>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 7. почему выбирают -->
    <section class="sb-wrap sb-section">
      <div class="sb-why">
        <div class="sb-why__item">
          <strong>от 100 000 ₽</strong>
          <p>Работаем с крупным оптом. Ежемесячные промо-акции и гибкие скидки от объёма.</p>
        </div>
        <div class="sb-why__item">
          <strong>10 000+</strong>
          <p>Наименований на складе: закупаете всё в одном месте и экономите на документообороте.</p>
        </div>
        <div class="sb-why__item">
          <strong>с 2012</strong>
          <p>Года на рынке, на собственные оборотные средства. Договор, ЭДО, полный пакет сертификатов.</p>
        </div>
      </div>
      <p class="sb-why__brands">
        Прямые контракты с брендами:
        <span v-for="b in sbBrands" :key="b">{{ b }}</span>
      </p>
    </section>

    <!-- 8. партнёры -->
    <section class="sb-section sb-partners" aria-label="Наши партнёры">
      <div class="sb-wrap sb-head">
        <h2>Наши партнёры</h2>
      </div>
      <div class="sb-wrap sb-marquee">
        <div class="sb-marquee__row">
          <span v-for="(src, i) in [...sbPartners, ...sbPartners]" :key="i" class="sb-marquee__logo" :aria-hidden="i >= sbPartners.length">
            <img :src="src" alt="" loading="lazy" />
          </span>
        </div>
      </div>
    </section>

    <!-- 9. блог -->
    <section class="sb-wrap sb-section">
      <div class="sb-head">
        <h2>Статьи для закупщиков</h2>
        <NuxtLink :to="sbPath('/blog')" class="sb-link">Все статьи <SbIcon name="arrow" :size="16" /></NuxtLink>
      </div>
      <div class="sb-posts">
        <a
          v-for="post in posts"
          :key="post.slug"
          :href="`https://sibirtreid.ru/blog/${post.slug}/`"
          target="_blank"
          rel="noopener"
          class="sb-post"
          :class="`sb-tone--${sbSection(post.sec)?.tone}`"
        >
          <img :src="sbSection(post.sec)?.img" alt="" loading="lazy" />
          <span class="sb-post__date">{{ sbDate(post.date) }}</span>
          <span class="sb-post__title">{{ post.title }}</span>
        </a>
      </div>
    </section>

    <!-- 10. цветная форма -->
    <section class="sb-wrap sb-section">
      <SbPriceForm />
    </section>
  </div>
</template>

<style lang="scss">
.sb .sb-home {
  // ---------- сцена ----------
  .sb-stage {
    position: relative;

    &__sticky {
      padding: 16px 0 0;
    }

    &__frame {
      height: auto;
    }

    &__panel {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
      height: clamp(560px, 72vh, 720px);
      border-radius: 36px;
      transition: color 0.3s, background-color 0.8s;
      overflow: hidden;
      color: var(--sb-ink);
    }



    &__copy {
      position: relative;
      z-index: 20;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 16px;
      padding: 40px clamp(28px, 4vw, 56px);

      h1 {
        font-size: clamp(30px, 3.7vw, 56px);
        line-height: 1.02;
        letter-spacing: -0.035em;
        color: inherit;
        max-width: 620px;
      }
    }

    &__tag {
      align-self: flex-start;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.7);
      color: var(--sb-green-d);
      font-size: 13.5px;
      font-weight: 700;
    }

    &__fact {
      min-height: 66px;

      p {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 4px 12px;
        max-width: 520px;
      }

      strong {
        font-family: var(--sb-display);
        font-size: clamp(24px, 2.6vw, 34px);
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--sb-green-d);
        white-space: nowrap;
        transition: color 0.3s;
      }

      span {
        font-size: 16px;
        font-weight: 500;
        min-width: 0;
      }
    }

    &.is-hot .sb-stage__fact strong {
      color: var(--sb-ink);
    }

    &__bars {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      max-width: 320px;

      button {
        height: 20px;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 8px;
          height: 4px;
          border-radius: 4px;
          background: rgba(16, 36, 30, 0.14);
          transition: background-color 0.25s;
        }

        &.is-on::before {
          background: var(--sb-green);
        }
      }
    }

    &.is-hot .sb-stage__bars button.is-on::before {
      background: var(--sb-ink);
    }

    &__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    &__price {
      background: #fff;
      color: var(--sb-orange-d);

      &:hover {
        background: var(--sb-peach);
      }
    }

    &__min {
      font-size: 14px;
      font-weight: 600;
      opacity: 0.8;
    }

    &__belt {
      position: relative;
      z-index: 10;
    }

    &__item {
      position: absolute;
      left: 50%;
      top: 46%;
      width: calc(min(30vw, 440px) * var(--w));
      transition:
        transform 0.9s cubic-bezier(0.22, 0.8, 0.3, 1),
        opacity 0.5s;
      will-change: transform;

      img {
        width: 100%;
        height: auto;
        filter: drop-shadow(0 24px 30px rgba(16, 36, 30, 0.22));
        pointer-events: none;
      }
    }

    &__label {
      position: absolute;
      left: 50%;
      bottom: 9%;
      z-index: 20;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 8px 8px 18px;
      border-radius: 999px;
      background: #fff;
      color: var(--sb-ink);
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 10px 30px rgba(16, 36, 30, 0.12);

      strong {
        padding: 6px 12px;
        border-radius: 999px;
        background: var(--sb-lime);
        font-variant-numeric: tabular-nums;
      }
    }

    &__dots {
      position: absolute;
      right: 28px;
      top: 50%;
      z-index: 20;
      display: grid;
      gap: 8px;
      transform: translateY(-50%);

      button {
        display: grid;
        place-items: center;
        width: 20px;
        height: 20px;

        &::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.25;
          transition: opacity 0.2s, transform 0.2s;
        }

        &:hover::before {
          opacity: 0.6;
        }

        &.is-on::before {
          opacity: 0.9;
          transform: scale(1.4);
        }
      }
    }

    @media (min-width: 861px) and (max-height: 820px) {
      &__tag,
      &__min {
        display: none;
      }
    }

    @media (min-width: 861px) and (max-height: 680px) {
      &__fact {
        display: none;
      }
    }

    @media (max-width: 860px) {
      &__sticky {
        padding: 8px 0 0;
      }

      &__panel {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: auto minmax(0, 1fr);
        // между шапкой (64 px + 8) и нижней панелью (~84 px с отступом), чтобы кнопки не уходили под неё
        height: clamp(400px, calc(100vh - 64px - 8px - 92px), 660px);
        height: clamp(400px, calc(100svh - 64px - 8px - 92px), 660px);
        border-radius: 28px;
      }

      &__copy {
        position: static;
        justify-content: flex-start;
        gap: 12px;
        padding: 22px 20px 0;

        > * {
          position: relative;
          z-index: 20;
        }

        h1 {
          font-size: clamp(26px, 7.4vw, 36px);
        }
      }

      &__tag,
      &__min {
        display: none;
      }

      &__fact {
        min-height: 52px;

        strong {
          font-size: 22px;
        }

        span {
          font-size: 14px;
        }
      }

      &__bars {
        max-width: 200px;
      }

      .sb-stage__actions {
        position: absolute;
        left: 16px;
        right: 16px;
        bottom: 16px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        z-index: 30;

        .sb-btn {
          min-height: 50px;
          padding: 0 12px;
          font-size: 14.5px;
        }

        .sb-icon {
          display: none;
        }
      }

      &__item {
        top: 47%;
        width: calc(min(74vw, 340px) * var(--w));
      }

      &__label {
        bottom: 84px;
        font-size: 14px;
        padding-left: 14px;
      }

      &__dots {
        display: none;
      }
    }

    @media (max-width: 860px) and (max-height: 700px) {
      &__fact {
        display: none;
      }
    }
  }

  .sb-fact-enter-active,
  .sb-fact-leave-active {
    transition: opacity 0.2s, transform 0.2s;
  }
  .sb-fact-enter-from {
    opacity: 0;
    transform: translateY(8px);
  }
  .sb-fact-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }

  // ---------- разделы ----------
  .sb-tiles {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .sb-tile {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 200px;
    padding: 22px 22px 20px;
    border-radius: 28px;
    background: var(--tone-bg);
    overflow: hidden;
    isolation: isolate;

    &__label {
      position: relative;
      z-index: 1;
      max-width: 70%;
      font-family: var(--sb-display);
      font-size: 21px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.015em;
    }

    &__meta {
      position: relative;
      z-index: 1;
      font-size: 13.5px;
      font-weight: 600;
      color: var(--tone-ink);
    }

    &__img {
      position: absolute;
      right: -8px;
      bottom: -6px;
      width: 62%;
      height: 66%;
      object-fit: contain;
      object-position: right bottom;
      transition: transform 0.35s;
    }

    &:hover .sb-tile__img {
      transform: scale(1.06);
    }

    &__go {
      position: absolute;
      left: 22px;
      bottom: 20px;
      z-index: 1;
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff;
      color: var(--sb-green);
      transition: background-color 0.15s, color 0.15s;
    }

    &:hover .sb-tile__go {
      background: var(--sb-green);
      color: #fff;
    }

    &__age {
      position: absolute;
      top: 18px;
      right: 18px;
      z-index: 1;
      padding: 2px 8px;
      border-radius: 999px;
      background: #fff;
      font-size: 12px;
      font-weight: 800;
    }

    @media (max-width: 1080px) {
      min-height: 180px;
    }
  }

  @media (max-width: 1080px) {
    .sb-tiles {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 720px) {
    .sb-tiles {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .sb-tile {
      min-height: 168px;
      padding: 16px;
      border-radius: 22px;

      &__label {
        max-width: 100%;
        font-size: 16.5px;
      }

      &__meta {
        font-size: 12.5px;
      }

      &__img {
        width: 64%;
        height: 52%;
      }

      &__go {
        left: 16px;
        bottom: 16px;
        width: 34px;
        height: 34px;
      }
    }
  }

  // ---------- карусель «Часто заказывают» ----------
  .sb-popular {
    &__nav {
      display: flex;
      gap: 8px;
    }

    &__arrow {
      width: 52px;
      height: 52px;
      background: var(--sb-mint);
      color: var(--sb-green-d);

      &:disabled {
        opacity: 0.4;
        cursor: default;
      }

      &:hover:not(:disabled) {
        background: var(--sb-mint-2);
      }
    }

    &__track {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 240px;
      gap: 14px;
      padding: 4px 0 8px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      // край карусели затухает, пока есть что листать
      mask-image: linear-gradient(90deg, transparent, #000 48px, #000 calc(100% - 48px), transparent);

      &.is-start {
        mask-image: linear-gradient(90deg, #000 calc(100% - 48px), transparent);
      }

      &.is-end {
        mask-image: linear-gradient(90deg, transparent, #000 48px);
      }

      &.is-start.is-end {
        mask-image: none;
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__bar {
      height: 4px;
      margin-top: 18px;
      border-radius: 4px;
      background: var(--sb-mint);
      overflow: hidden;

      span {
        display: block;
        height: 100%;
        background: var(--sb-green);
        transform-origin: left;
        transition: transform 0.15s;
      }
    }

    @media (max-width: 720px) {
      &__nav {
        display: none;
      }

      &__track {
        grid-auto-columns: 62%;
        gap: 10px;
      }
    }
  }

  .sb-pop {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 14px 18px;
    border-radius: 26px;
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--sb-line);
    scroll-snap-align: start;
    transition: box-shadow 0.15s;

    &:hover {
      box-shadow: inset 0 0 0 2px var(--sb-mint-2);
    }

    &__img {
      display: grid;
      place-items: center;
      height: 170px;
      margin-bottom: 8px;
      border-radius: 20px;
      background: var(--tone-bg);

      img {
        width: 82%;
        height: 82%;
        object-fit: contain;
        transition: transform 0.3s;
      }
    }

    &:hover .sb-pop__img img {
      transform: scale(1.06) rotate(-2deg);
    }

    &__label {
      padding: 0 4px;
      font-family: var(--sb-display);
      font-size: 18px;
      font-weight: 800;
      line-height: 1.2;
    }

    &__meta {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      padding: 0 4px;
      font-size: 13.5px;

      strong {
        font-variant-numeric: tabular-nums;
      }

      span {
        color: var(--sb-muted);
      }
    }
  }

  // ---------- заявка-демо ----------
  .sb-reqdemo {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: clamp(24px, 4vw, 56px);
    align-items: center;
    padding: clamp(28px, 5vw, 56px);
    border-radius: 32px;
    background: var(--sb-lime-soft);

    h2 {
      font-size: clamp(28px, 3.6vw, 42px);
      max-width: 520px;
    }

    &__copy p {
      margin-top: 14px;
      max-width: 540px;
      font-size: 16px;
      color: var(--sb-muted);
    }

    &__copy ul {
      display: grid;
      gap: 10px;
      margin-top: 22px;

      li {
        display: flex;
        gap: 10px;
        font-weight: 600;
      }

      .sb-icon {
        color: var(--sb-green);
        margin-top: 2px;
      }
    }

    &__card {
      display: grid;
      gap: 14px;
      padding: 24px;
      border-radius: 26px;
      background: #fff;
      box-shadow: 0 20px 50px rgba(61, 107, 22, 0.12);
    }

    &__top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;

      span {
        font-weight: 700;
      }

      strong {
        font-family: var(--sb-display);
        font-size: 28px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
      }
    }

    &__left {
      font-size: 14px;
      color: var(--sb-muted);
    }

    &__lines {
      display: grid;
      gap: 8px;
      padding-top: 10px;
      border-top: 1px solid var(--sb-line);
      font-size: 14px;

      li {
        display: flex;
        justify-content: space-between;
        gap: 12px;

        span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      small {
        color: var(--sb-muted);
      }

      strong {
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }
    }

    @media (max-width: 900px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  // ---------- шаги ----------
  .sb-steps {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;

    li {
      position: relative;
      padding: 24px;
      border-radius: 26px;
      background: #fff;
      box-shadow: inset 0 0 0 1px var(--sb-line);
    }

    &__n {
      font-size: 13px;
      font-weight: 700;
      color: var(--sb-orange-d);
    }

    h3 {
      margin-top: 30px;
      font-size: 22px;
    }

    p {
      margin-top: 8px;
      color: var(--sb-muted);
      font-size: 14.5px;
    }

    li:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 34px;
      right: -14px;
      width: 14px;
      height: 2px;
      background: var(--sb-mint-2);
    }

    @media (max-width: 960px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));

      li::after {
        display: none;
      }
    }

    @media (max-width: 520px) {
      grid-template-columns: minmax(0, 1fr);

      h3 {
        margin-top: 12px;
      }
    }
  }

  // ---------- маршрут ----------
  .sb-route {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
    gap: clamp(24px, 4vw, 56px);
    padding: clamp(28px, 5vw, 56px);
    border-radius: 32px;
    background: var(--sb-mint);

    h2 {
      font-size: clamp(28px, 3.6vw, 42px);
    }

    &__copy > p {
      margin-top: 14px;
      color: var(--sb-muted);
      font-size: 16px;
      max-width: 560px;
    }

    &__facts {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 24px;

      div {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 18px;
        border-radius: 22px;
        background: #fff;
      }

      strong {
        font-family: var(--sb-display);
        font-size: 32px;
        font-weight: 800;
        color: var(--sb-green-d);
      }

      span {
        font-size: 14px;
        color: var(--sb-muted);
      }
    }

    &__docs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 20px;
      font-size: 14px;
      font-weight: 600;
    }

    &__doc {
      padding: 5px 12px;
      border-radius: 999px;
      background: var(--sb-lime);
      font-weight: 700;
    }

    &__map {
      padding: 22px;
      border-radius: 26px;
      background: #fff;

      ul {
        position: relative;
        display: grid;
        gap: 2px;
        margin-top: 10px;
        padding-left: 26px;

        &::before {
          content: '';
          position: absolute;
          left: 9px;
          top: 4px;
          bottom: 14px;
          border-left: 2px dashed var(--sb-mint-2);
        }
      }

      li {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 12px;
        padding: 7px 0;
        font-weight: 700;

        &::before {
          content: '';
          position: absolute;
          left: -22px;
          top: 13px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--sb-orange);
          box-shadow: 0 0 0 3px #fff;
        }
      }

      small {
        font-size: 13px;
        font-weight: 500;
        color: var(--sb-muted);
        text-align: right;
      }
    }

    &__hub {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      padding: 12px 14px;
      border-radius: 18px;
      background: var(--sb-green);
      color: #fff;

      span {
        display: flex;
        flex-direction: column;
        min-width: 0;
        line-height: 1.25;
      }

      strong {
        font-size: 17px;
      }

      small {
        color: rgba(255, 255, 255, 0.82);
        font-size: 13px;
        text-align: left;
      }
    }

    @media (max-width: 900px) {
      grid-template-columns: minmax(0, 1fr);
    }

    @media (max-width: 480px) {
      &__facts {
        grid-template-columns: minmax(0, 1fr);
      }

      &__map li {
        flex-direction: column;
        gap: 0;

        small {
          text-align: left;
        }
      }
    }
  }

  // ---------- почему ----------
  .sb-why {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;

    &__item {
      padding: 28px;
      border-radius: 28px;
      background: var(--sb-peach);

      strong {
        display: block;
        font-family: var(--sb-display);
        font-size: clamp(32px, 3.6vw, 44px);
        font-weight: 800;
        letter-spacing: -0.03em;
        color: var(--sb-orange-d);
      }

      p {
        margin-top: 10px;
        color: #5a4a40;
      }
    }

    &__brands {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 10px;
      margin-top: 18px;
      color: var(--sb-muted);
      font-weight: 600;

      span {
        padding: 5px 14px;
        border-radius: 999px;
        box-shadow: inset 0 0 0 1.5px var(--sb-line);
        color: var(--sb-ink);
        font-weight: 700;
      }
    }

    @media (max-width: 800px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  // ---------- партнёры ----------
  .sb-marquee {
    overflow: hidden;
    mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);

    &__row {
      display: flex;
      align-items: center;
      gap: 14px;
      width: max-content;
      height: 96px;
      padding: 4px 0;
      animation: sb-marquee 60s linear infinite;
    }

    &:hover .sb-marquee__row {
      animation-play-state: paused;
    }

    &__logo {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 168px;
      width: 168px;
      height: 88px;
      padding: 14px 22px;
      border-radius: 22px;
      background: #fff;
      box-shadow: inset 0 0 0 1px var(--sb-line);
      overflow: hidden;

      img {
        display: block;
        width: 124px;
        height: 60px;
        object-fit: contain;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      overflow-x: auto;

      &__row {
        animation: none;
      }
    }
  }

  // ---------- статьи ----------
  .sb-posts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;

    @media (max-width: 860px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

@keyframes sb-marquee {
  to {
    transform: translateX(calc(-50% - 7px));
  }
}

</style>
