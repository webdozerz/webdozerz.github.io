<script lang="ts" setup>
import {
  oyBar,
  oyBlog,
  oyContacts,
  oyImg,
  oyMoney,
  oyMoscowNow,
  oyOrigin,
  oyPath,
  oyPhotos,
  oyPrice,
  oyProduct,
  oyProducts,
  oyReviews,
  oySections,
  oyServices,
  oyUnit,
  oySetBanners,
} from '~/utils/oyster'
import type { OyProduct } from '~/utils/oyster'
import { useOyShop, useOyUi } from '~/composables/useOyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'
import OyQty from '~/components/redesign/oyster/OyQty.vue'
import OyShelf from '~/components/redesign/oyster/OyShelf.vue'

useSeoMeta({ title: 'Oyster Market — живые морепродукты с доставкой по Москве | Концепт редизайна' })
const shop = useOyShop()
const ui = useOyUi()

// Тикающий отсчёт по Москве: до начала приёма (до 10:00), до конца приёма на сегодня (10–19), после 19 — на завтра
const clock = ref<{ label: string; when: string; h: string; m: string; s: string } | null>(null)
const tick = () => {
  const now = oyMoscowNow()
  const sec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
  let target = 19 * 3600
  let label = 'До конца приёма заказов на сегодня'
  let when = 'Привезём сегодня с 12 до 21'
  if (sec < 10 * 3600) {
    target = 10 * 3600
    label = 'До начала приёма заказов'
  } else if (sec >= 19 * 3600) {
    target = 24 * 3600 + 19 * 3600
    label = 'Приём заказов на завтра — ещё'
    when = 'Привезём завтра с 12 до 21 или к интервалу'
  }
  const left = target - sec
  const pad = (n: number) => String(n).padStart(2, '0')
  clock.value = { label, when, h: pad(Math.floor(left / 3600)), m: pad(Math.floor((left % 3600) / 60)), s: pad(left % 60) }
}
let tickTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  tick()
  tickTimer = setInterval(tick, 1000)
})
onBeforeUnmount(() => clearInterval(tickTimer))

// Точки на их фото блюда: координаты — в процентах снимка 1280×853
const spots = [
  { id: 'fin', p: oyProduct('1758')!, x: 54, y: 21, title: 'Устрица Фин де Клер', note: 'Франция · цена за штуку', qty: 6 },
  { id: 'ezh', p: oyProduct('1306')!, x: 45.5, y: 43, title: 'Ёж морской живой', note: 'Цена за штуку · откроем к доставке', qty: 3 },
  { id: 'sous', p: oyProduct('1849')!, x: 70.5, y: 37, title: 'Соус для устриц', note: 'К устрицам — в одном заказе', qty: 1 },
  { id: 'spec', p: oyProduct('1773')!, x: 38, y: 63, title: 'Устрица Специаль де Клер', note: 'Цена за штуку, №2 крупнее', qty: 6 },
  { id: 'set', p: oyProduct('1960')!, x: 24, y: 30, title: 'Такое блюдо — сет «Баланс»', note: 'Устрицы и ежи уже собраны на блюде', qty: 1 },
].map((s) => ({ ...s, step: 1 }))
const spot = ref<number | null>(null)
const cur = computed(() => (spot.value === null ? null : spots[spot.value]))
const popV = ref(0)
const popSvc = ref(false)
const popQty = ref(1)
watch(spot, (i) => {
  if (i === null) return
  popV.value = spots[i].p.def ?? 0
  popSvc.value = false
  popQty.value = spots[i].qty
})
const popSum = computed(() => (cur.value ? ((oyPrice(cur.value.p, popV.value) ?? 0) + (popSvc.value ? 30 : 0)) * popQty.value : 0))
const popBuy = () => {
  if (!cur.value) return
  shop.add(cur.value.p, popV.value, popSvc.value, popQty.value)
  spot.value = null
}

// «Наши предложения» — вкладки оригинала
const tabs = [
  { id: 'Советуем', pick: (p: OyProduct) => p.labels.includes('Советуем') },
  { id: 'Новинка', pick: (p: OyProduct) => p.labels.includes('Новинка') },
  { id: 'Хит', pick: (p: OyProduct) => p.labels.includes('Хит') },
  { id: 'Акция', pick: (p: OyProduct) => p.labels.includes('Акция') || !!p.old },
  { id: 'Под заказ', pick: (p: OyProduct) => p.order },
]
const tab = ref(tabs[0].id)
const tabItems = computed(() => oyProducts.filter(tabs.find((t) => t.id === tab.value)!.pick).slice(0, 12))

// Устричная карта: все устрицы выборки, размеры с ценой, быстрые «полдюжины / дюжина / две»
const oysters = oyProducts.filter((p) => p.service === 'oyster')
const ov = reactive<Record<string, number>>(Object.fromEntries(oysters.map((p) => [p.id, p.def ?? 0])))
const oq = reactive<Record<string, number>>(Object.fromEntries(oysters.map((p) => [p.id, 6])))
const os = reactive<Record<string, boolean>>(Object.fromEntries(oysters.map((p) => [p.id, false])))
const rowSum = (p: OyProduct) => ((oyPrice(p, ov[p.id]) ?? 0) + (os[p.id] ? 30 : 0)) * oq[p.id]
const shortName = (n: string) => n.replace(/^Устрица\s+/, '').replace(/\s+(№\d|\d+[-‑]\d+\s+г)$/, '')

// Плитки главной — 9 главных разделов, остальные в «Все разделы»
const homeSecs = ['ustritsy', 'ezhi', 'sety', 'krab', 'krevetki', 'ryba', 'ikra', 'chernaya', 'premium'].map((id) => oySections.find((s) => s.id === id)!)
const sets = oyProducts.filter((p) => p.sec === 'sety' && p.price)
const prep = (['oyster', 'scallop', 'urchin', 'fish'] as const).map((k) => oyServices[k])
const reviews = oyReviews.filter((r) => r.text.length > 90).slice(0, 3)
</script>

<template>
  <div class="oy-home">
    <!-- AB2 «блюдо на льду»: их фото блюда во всю сцену, точки на продуктах, крупный тикающий отсчёт до конца приёма заказов -->
    <section class="oy-wrap oy-hero-wrap">
      <div class="oy-scene">
        <div class="oy-scene__text">
          <h1>Живые морепродукты с доставкой в день заказа</h1>
          <p class="oy-scene__lead">Устрицы, ежи, гребешки, краб и икра — для дома и ресторанов Москвы с 2012 года.</p>
          <div class="oy-timer" aria-live="off">
            <span class="oy-timer__label">{{ clock?.label ?? 'Приём заказов с 10:00 до 19:00' }}</span>
            <ClientOnly>
              <b v-if="clock" class="oy-timer__digits">
                <span>{{ clock.h }}</span><i>:</i><span>{{ clock.m }}</span><i>:</i><span>{{ clock.s }}</span>
              </b>
              <template #fallback><b class="oy-timer__digits"><span>--</span><i>:</i><span>--</span><i>:</i><span>--</span></b></template>
            </ClientOnly>
            <span class="oy-timer__when"><OyIcon name="truck" :size="18" />{{ clock?.when ?? 'Привезём сегодня с 12 до 21' }}</span>
          </div>
          <div class="oy-scene__btns">
            <NuxtLink :to="oyPath('/catalog/ustritsy/')" class="oy-btn oy-btn--accent oy-btn--big">Устрицы в наличии</NuxtLink>
            <NuxtLink :to="oyPath('/catalog/')" class="oy-btn oy-btn--glass oy-btn--big">Весь каталог</NuxtLink>
          </div>
        </div>

        <div class="oy-scene__pic">
          <div class="oy-scene__stage" @click.self="spot = null">
          <img :src="oyPhotos.platter" alt="Устрицы и морские ежи на блюде со льдом — фото Oyster Market" width="1280" height="853" @click="spot = null" />
          <button
            v-for="(s, i) in spots"
            :key="s.id"
            type="button"
            class="oy-spot"
            :class="{ 'is-on': spot === i }"
            :style="{ left: `${s.x}%`, top: `${s.y}%` }"
            :aria-label="s.p.name"
            @click.stop="spot = spot === i ? null : i"
          >
            <i />
          </button>
          <span class="oy-scene__hint"><OyIcon name="plus" :size="16" />Нажмите на устрицу или ежа</span>
          </div>
          <Transition name="oy-fade">
            <div v-if="cur" :key="cur.p.id" class="oy-pop" :class="{ 'oy-pop--left': cur.x > 52, 'oy-pop--up': cur.y > 48 }" :style="{ left: `${cur.x}%`, top: `${cur.y}%` }" @click.stop>
              <button type="button" class="oy-pop__x" aria-label="Закрыть" @click="spot = null"><OyIcon name="close" :size="16" /></button>
              <div class="oy-pop__top">
                <img :src="cur.p.img" alt="" width="52" height="52" />
                <div>
                  <NuxtLink :to="oyPath(`/product/${cur.p.id}/`)" class="oy-pop__name">{{ cur.title }}</NuxtLink>
                  <span>{{ cur.note }}</span>
                </div>
              </div>
              <div v-if="cur.p.variants" class="oy-pop__sizes">
                <button v-for="(x, i) in cur.p.variants" :key="x.name" type="button" class="oy-size" :class="{ 'is-on': popV === i }" @click="popV = i">
                  <span>{{ x.name }}</span><small>{{ x.price }} ₽</small>
                </button>
              </div>
              <label v-if="cur.p.service" class="oy-svc">
                <input v-model="popSvc" type="checkbox" />
                <span class="oy-svc__box"><OyIcon name="check" :size="14" /></span>
                <span>Открыть к доставке <em>+30&nbsp;₽/шт</em></span>
              </label>
              <div class="oy-pop__buy">
                <OyQty v-model="popQty" :unit="oyUnit(cur.p, popV)" :step="cur.step" :min="cur.step" small />
                <button type="button" class="oy-btn oy-btn--accent" @click="popBuy">{{ oyMoney(popSum) }} · В корзину</button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      <ul class="oy-hero__facts">
        <li><b>−5%</b><span>на живое при самовывозе со склада</span></li>
        <li><b>30 ₽</b><span>откроем устрицу, ежа или гребешок</span></li>
        <li><b>HoReCa</b><span>договор, отсрочка, эВСД в Меркурии</span></li>
        <li><b>с 2012</b><span>поставщики напрямую, еженедельный завоз</span></li>
      </ul>
    </section>

    <!-- Разделы с их линейными иконками -->
    <section class="oy-wrap oy-cats" aria-label="Разделы каталога">
      <NuxtLink v-for="s in homeSecs" :key="s.id" :to="oyPath(`/catalog/${s.id}/`)" class="oy-cats__item">
        <span class="oy-mask oy-cats__ic" :style="{ '--m': `url(${oyImg(`ic/${s.icon}.png`)})` }" />
        <span class="oy-cats__name">{{ s.name.replace('Устричные и другие сеты', 'Сеты').replace('Морепродукты для гриля BBQ', 'Для гриля BBQ').replace('Премиальные деликатесы', 'Деликатесы') }}</span>
        <small>{{ s.count }}</small>
      </NuxtLink>
      <NuxtLink :to="oyPath('/catalog/')" class="oy-cats__item oy-cats__item--all">
        <OyIcon name="grid" :size="30" />
        <span class="oy-cats__name">Все разделы</span>
        <small>16</small>
      </NuxtLink>
    </section>

    <section class="oy-wrap oy-sec">
      <div class="oy-head">
        <div>
          <h2>Наши предложения</h2>
        </div>
        <div class="oy-seg oy-home__tabs" role="tablist">
          <button v-for="t in tabs" :key="t.id" type="button" role="tab" :aria-selected="tab === t.id" :class="{ 'is-on': tab === t.id }" @click="tab = t.id">
            {{ t.id }}
          </button>
        </div>
      </div>
      <OyShelf :items="tabItems" />
    </section>

    <!-- Фирменная деталь: устричная карта — размеры, быстрые полдюжины/дюжина, открывание под ценой -->
    <section class="oy-wrap oy-sec">
      <div class="oy-oymap">
        <div class="oy-oymap__head">
          <div>
            <h2>Устрицы в наличии</h2>
            <p>Цена за штуку. Выберите размер, сколько штук и открыть ли к доставке — откроем, уложим на лёд в термобокс и сразу отправим.</p>
          </div>
          <NuxtLink :to="oyPath('/catalog/ustritsy/')" class="oy-head__link">Все устрицы <OyIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <div class="oy-oymap__list">
          <div v-for="p in oysters" :key="p.id" class="oy-oyrow">
            <NuxtLink :to="oyPath(`/product/${p.id}/`)" class="oy-oyrow__pic"><img :src="p.img" :alt="p.name" loading="lazy" width="72" height="72" /></NuxtLink>
            <div class="oy-oyrow__name">
              <NuxtLink :to="oyPath(`/product/${p.id}/`)">{{ shortName(p.name) }}</NuxtLink>
              <span v-if="oyOrigin(p) || p.old">{{ oyOrigin(p) }}<template v-if="oyOrigin(p) && p.old"> · </template><s v-if="p.old">{{ oyMoney(p.old) }}</s></span>
            </div>
            <div class="oy-oyrow__sizes">
              <template v-if="p.variants">
                <button v-for="(x, i) in p.variants" :key="x.name" type="button" class="oy-chip" :class="{ 'is-on': ov[p.id] === i }" @click="ov[p.id] = i">
                  {{ x.name }} <b>{{ x.price }} ₽</b>
                </button>
              </template>
              <span v-else class="oy-chip is-on oy-chip--static"><b>{{ oyPrice(p) }} ₽</b>&nbsp;за шт</span>
            </div>
            <div class="oy-oyrow__dozen" role="group" aria-label="Количество">
              <button v-for="n in [6, 12, 24]" :key="n" type="button" :class="{ 'is-on': oq[p.id] === n }" @click="oq[p.id] = n">{{ n }}</button>
              <OyQty v-model="oq[p.id]" unit="шт" small />
            </div>
            <label class="oy-svc oy-oyrow__svc">
              <input v-model="os[p.id]" type="checkbox" />
              <span class="oy-svc__box"><OyIcon name="check" :size="14" /></span>
              <span>Открыть <em>+30 ₽</em></span>
            </label>
            <button type="button" class="oy-btn oy-btn--soft oy-oyrow__add" @click="shop.add(p, ov[p.id], os[p.id], oq[p.id])">
              <span>{{ oyMoney(rowSum(p)) }}</span><OyIcon name="plus" :size="18" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="oy-wrap oy-sec">
      <div class="oy-head">
        <div>
          <h2>Сеты на компанию</h2>
          <p>Устрицы, ежи, гребешок и краб уже собраны на блюде — на двоих, на день рождения, на праздник.</p>
        </div>
        <NuxtLink :to="oyPath('/catalog/sety/')" class="oy-head__link">Все сеты <OyIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="oy-banners">
        <NuxtLink v-for="b in oySetBanners" :key="b.title" :to="oyPath(`/catalog/sety/?q=${encodeURIComponent(b.q)}`)" class="oy-banners__item">
          <img :src="b.img" :alt="b.title" loading="lazy" width="1484" height="1060" />
        </NuxtLink>
      </div>
      <OyShelf :items="sets" class="oy-home__sets" />
    </section>

    <section class="oy-wrap oy-sec">
      <div class="oy-head">
        <div>
          <h2>Доставка и самовывоз</h2>
          <p>{{ oyContacts.orders }}. День в день привозим с 12 до 21, к интервалу — 11–16 или 15–21, если заказ принят за день.</p>
        </div>
        <NuxtLink :to="oyPath('/help/?tab=delivery')" class="oy-head__link">Подробнее о доставке <OyIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="oy-ways">
        <div class="oy-ways__item">
          <OyIcon name="truck" :size="28" />
          <b>Нашей машиной по Москве</b>
          <p>800 ₽ до подъезда, 1 200 ₽ до квартиры — при заказе от 3 000 ₽, в пределах МКАД.</p>
        </div>
        <div class="oy-ways__item">
          <OyIcon name="send" :size="28" />
          <b>Яндекс Доставка</b>
          <p>Для заказов меньше 3 000 ₽ и за МКАД — по тарифам Яндекса, с 10:00 до 20:00.</p>
        </div>
        <div class="oy-ways__item oy-ways__item--hot">
          <OyIcon name="pin" :size="28" />
          <b>Самовывоз −5% на живое</b>
          <p>Михайловский проезд, 3, «Кирпичный лофт». Соберём заказ за 20–60 минут.</p>
        </div>
        <NuxtLink :to="oyPath('/opt/')" class="oy-ways__item oy-ways__item--opt">
          <OyIcon name="doc" :size="28" />
          <b>Ресторанам и магазинам</b>
          <p>Договор, отсрочка платежа, эВСД в Меркурии, доставка по России. Бесплатно по Москве от 5 000 ₽.</p>
          <span class="oy-head__link">Оптовым клиентам <OyIcon name="arrow" :size="18" /></span>
        </NuxtLink>
      </div>
      <div class="oy-keep">
        <OyIcon name="snow" :size="26" />
        <p><b>Как хранить:</b> открытая продукция — в термобоксе на льду до 4 часов, закрытая — до 8 часов, потом в холодильник ещё на 12–18 часов. Моллюсков замораживать нельзя.</p>
      </div>
    </section>

    <section class="oy-wrap oy-sec">
      <div class="oy-services">
        <NuxtLink :to="oyPath('/services/#bar')" class="oy-services__bar">
          <img :src="oyPhotos.bar" alt="Выездной устричный бар Oyster Market — ладья с морепродуктами" loading="lazy" width="1280" height="960" />
          <div>
            <h2>{{ oyBar.title }}</h2>
            <p>{{ oyBar.text[0] }}</p>
            <span class="oy-btn oy-btn--accent">Рассчитать мероприятие</span>
          </div>
        </NuxtLink>
        <div class="oy-services__prep">
          <h3>Подготовим к столу</h3>
          <p>Отметьте услугу под ценой товара — сделаем перед отправкой.</p>
          <ul>
            <li v-for="s in prep" :key="s.title">
              <OyIcon name="knife" :size="22" />
              <span><b>{{ s.title }}</b><small>{{ s.text.split('.')[0] }}.</small></span>
              <em>{{ s.price }} ₽/{{ s.per }}</em>
            </li>
          </ul>
          <NuxtLink :to="oyPath('/services/')" class="oy-head__link">Все услуги <OyIcon name="arrow" :size="18" /></NuxtLink>
        </div>
      </div>
    </section>

    <section class="oy-wrap oy-sec">
      <div class="oy-head">
        <div>
          <h2>Отзывы покупателей</h2>
          <p>{{ oyReviews.length }} отзывов на сайте — о свежести, упаковке и доставке.</p>
        </div>
        <NuxtLink :to="oyPath('/reviews/')" class="oy-head__link">Все отзывы <OyIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="oy-revs">
        <figure v-for="r in reviews" :key="r.name + r.text.slice(0, 10)" class="oy-rev">
          <OyIcon name="quote" :size="26" />
          <blockquote>{{ r.text }}</blockquote>
          <figcaption>{{ r.name }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="oy-wrap oy-sec">
      <div class="oy-about">
        <img :src="oyImg('seal.png')" alt="" width="120" height="120" class="oy-about__seal" />
        <div class="oy-about__text">
          <h2>С 2012 года ищем поставщиков напрямую</h2>
          <p>
            С Дальнего Востока, из Новой Зеландии, Латинской Америки — сначала для себя и друзей, потом для ресторанов и частных лиц. Еженедельный завоз, подскажем
            сезонную продукцию и покажем, как открывать устрицы.
          </p>
          <NuxtLink :to="oyPath('/company/')" class="oy-head__link">О компании <OyIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <div class="oy-about__blog">
          <b>Из блога</b>
          <a v-for="b in oyBlog.posts.slice(0, 3)" :key="b.url" :href="b.url" target="_blank" rel="noopener">
            <img :src="b.img" alt="" loading="lazy" width="64" height="64" />
            <span>{{ b.title }}<small>{{ b.cat }}</small></span>
          </a>
        </div>
      </div>
    </section>

    <section class="oy-wrap oy-sec">
      <div class="oy-ask">
        <div>
          <h2>Не знаете, какие устрицы выбрать?</h2>
          <p>Подскажем по размеру, вкусу и количеству на компанию — по телефону, в Telegram или MAX.</p>
        </div>
        <div class="oy-ask__btns">
          <a :href="oyContacts.phoneHref" class="oy-btn oy-btn--accent oy-btn--big"><OyIcon name="phone" :size="20" />{{ oyContacts.phone }}</a>
          <a :href="oyContacts.telegram" target="_blank" rel="noopener" class="oy-btn oy-btn--line oy-btn--big">Telegram</a>
          <button type="button" class="oy-btn oy-btn--line oy-btn--big" @click="ui.open('question')">Задать вопрос</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
/* ---- AB2: сцена «блюдо на льду» ---- */
.oy-hero-wrap { padding-top: 20px; container-type: inline-size; }
.oy-scene {
  --scene-bg: #1d1c21;
  position: relative; overflow: hidden; border-radius: 24px; background: var(--scene-bg); color: #fff;
  /* высота такая, чтобы левый край блюда (16% снимка) начинался правее текста: W − 1,26·H ≥ 470 */
  height: clamp(572px, calc((100cqw - 470px) / 1.26), 680px);
  &__pic {
    position: absolute; right: 0; top: 0; height: 100%; aspect-ratio: 1280 / 853;
  }
  &__stage {
    position: absolute; inset: 0;
    > img {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
      -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 14%); mask-image: linear-gradient(90deg, transparent 0, #000 14%);
    }
  }
  &__text { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 18px; width: 436px; height: 100%; box-sizing: border-box; padding: 40px 0 36px 40px; }
  h1 { color: #fff; font-size: 54px; line-height: .98; }
  &__lead { color: #c9d4d3; font-size: 16px; }
  &__btns { display: flex; flex-wrap: nowrap; gap: 10px; margin-top: auto; .oy-btn { padding: 0 20px; } }
  &__hint {
    position: absolute; right: 18px; bottom: 16px; display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 10px;
    background: rgba(0, 0, 0, .45); color: #fff; font-size: 13px; font-weight: 600; pointer-events: none;
  }
}
.oy-btn--glass, .oy-btn--glass:focus, .oy-btn--glass:active { background: rgba(255, 255, 255, .1); color: #fff; border: 1px solid rgba(255, 255, 255, .28); &:hover { background: #fff; color: var(--oy-ink); } }

.oy-timer {
  display: grid; gap: 6px; padding: 16px 18px 18px; border-radius: 16px; background: rgba(255, 255, 255, .07); border: 1px solid rgba(255, 255, 255, .12);
  &__label { font-size: 13px; font-weight: 600; color: #f0d9ae; }
  &__digits {
    display: flex; align-items: baseline; font-family: 'Advent Pro', sans-serif; font-weight: 700; font-size: 64px; line-height: .95; color: #fff; font-variant-numeric: tabular-nums;
    span { display: inline-block; min-width: 1.05em; text-align: center; }
    i { font-style: normal; color: #7fa9a5; padding: 0 2px; animation: oy-blink 1s ease-in-out infinite; }
  }
  &__when { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #c9d4d3; .oy-icon { color: #8fd8cf; flex: none; } }
}
@keyframes oy-blink { 50% { opacity: .25; } }

.oy-spot {
  position: absolute; z-index: 3; width: 34px; height: 34px; margin: -17px 0 0 -17px; border-radius: 50%; display: grid; place-items: center;
  background: rgba(255, 255, 255, .25); border: 0;
  i { width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 2px 8px rgba(0, 0, 0, .35); transition: transform .2s; }
  &::before { content: ''; position: absolute; inset: 0; border-radius: 50%; border: 2px solid #fff; animation: oy-ping 2.2s ease-out infinite; }
  &:hover i, &.is-on i { transform: scale(1.25); background: #8fd8cf; }
  &.is-on::before { animation: none; opacity: 0; }
}
@keyframes oy-ping { 0% { transform: scale(.6); opacity: .9; } 80%, 100% { transform: scale(1.7); opacity: 0; } }

.oy-pop {
  position: absolute; z-index: 4; width: 320px; box-sizing: border-box; display: grid; gap: 10px; padding: 14px; margin: 26px 0 0 -40px;
  border-radius: 16px; background: #fff; color: var(--oy-text); box-shadow: 0 18px 44px rgba(0, 0, 0, .4);
  &--left { margin-left: -280px; }
  &--up { margin-top: -26px; transform: translateY(-100%); }
  &__x { position: absolute; right: 8px; top: 8px; width: 30px; height: 30px; display: grid; place-items: center; border-radius: 8px; background: var(--oy-surface); color: var(--oy-ink); }
  &__top { display: grid; grid-template-columns: 52px minmax(0, 1fr); gap: 10px; align-items: center; padding-right: 30px; img { width: 52px; height: 52px; border-radius: 10px; object-fit: cover; } span { font-size: 12px; color: var(--oy-muted); } }
  &__name { display: block; font-weight: 700; color: var(--oy-ink); line-height: 1.3; &:hover { color: var(--oy-accent); } }
  &__sizes { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 6px; .oy-size { min-width: 0; padding: 6px 10px; } }
  &__buy { display: flex; gap: 8px; .oy-btn { flex: 1; min-width: 0; min-height: 40px; padding: 0 10px; font-size: 14px; } }
}

ul.oy-hero__facts {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-top: 16px; padding: 18px 22px; border-radius: 18px; background: var(--oy-surface);
  li { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 12px; align-items: center; }
  b { font-family: 'Advent Pro', sans-serif; font-size: 30px; line-height: 1; color: var(--oy-accent); white-space: nowrap; }
  span { font-size: 13px; color: var(--oy-muted); line-height: 1.4; }
  @media (max-width: 1199px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 576px) { grid-template-columns: minmax(0, 1fr); gap: 10px; padding: 16px; li { grid-template-columns: 76px minmax(0, 1fr); } b { font-size: 26px; } }
}

@media (max-width: 1400px) { .oy-scene h1 { font-size: 48px; } .oy-scene__lead { font-size: 15px; } .oy-timer__digits { font-size: 56px; } .oy-scene__text { gap: 16px; } }
/* ≤1199: текст сверху, снимок целиком ниже — точки остаются на продуктах */
@media (max-width: 1199px) {
  .oy-scene { height: auto; display: grid; }
  .oy-scene__text { width: auto; height: auto; padding: 32px 32px 8px; }
  .oy-scene__btns { margin-top: 0; }
  .oy-scene__pic { position: relative; width: 100%; height: auto; aspect-ratio: auto; }
  .oy-scene__stage { position: relative; aspect-ratio: 1280 / 853; > img { -webkit-mask-image: none; mask-image: none; } }
}
@media (max-width: 768px) {
  .oy-scene { border-radius: 18px; }
  .oy-scene__text { padding: 20px 20px 22px; gap: 16px; }
  /* снимок с точками — первым, иначе на телефоне его не видно на первом экране */
  .oy-scene__pic { order: -1; }
  .oy-scene h1 { font-size: 40px; }
  .oy-scene__lead { font-size: 15px; }
  .oy-timer__digits { font-size: 52px; }
  .oy-scene__btns { flex-wrap: wrap; .oy-btn { flex: 1 1 100%; } }
  .oy-scene__hint { right: 10px; bottom: 10px; font-size: 12px; }
  .oy-spot { width: 30px; height: 30px; margin: -15px 0 0 -15px; i { width: 14px; height: 14px; } }
  /* карточка под снимком, а не поверх: на телефоне поверх она закрыла бы всё блюдо */
  .oy-pop, .oy-pop--left, .oy-pop--up { transform: none; position: relative; left: auto !important; top: auto !important; width: auto; margin: 0 12px 12px; box-shadow: none; }
}
@media (max-width: 576px) { .oy-scene h1 { font-size: 36px; } }
@media (max-width: 375px) { .oy-scene h1 { font-size: 32px; } .oy-timer__digits { font-size: 46px; } }

.oy-cats {
  display: flex; gap: 8px; margin-top: 20px !important; overflow-x: auto; scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  &__item {
    display: grid; justify-items: center; align-content: start; gap: 6px; padding: 14px 6px 12px; border-radius: 14px; text-align: center; color: var(--oy-ink);
    flex: 1 0 118px; background: var(--oy-surface2); transition: background-color .15s;
    small { font-size: 11px; color: var(--oy-muted); }
    &:hover { background: var(--oy-soft); .oy-cats__ic { transform: translateY(-2px); } }
    &--all { color: var(--oy-accent); }
  }
  &__ic { width: 44px; height: 38px; color: var(--oy-accent); transition: transform .2s; }
  &__name { font-size: 12.5px; font-weight: 600; line-height: 1.25; max-width: 100%; }
  @media (max-width: 1199px) { mask-image: linear-gradient(90deg, #000 92%, transparent); }
  @media (max-width: 989px) {
    margin-left: -24px; margin-right: -24px; padding-left: 24px; padding-right: 24px; mask-image: none;
    &__item { flex: 0 0 104px; }
  }
  @media (max-width: 576px) { margin-left: -16px; margin-right: -16px; padding-left: 16px; padding-right: 16px; &__item { flex-basis: 92px; } }
}
.oy-home__tabs { @media (max-width: 768px) { flex-wrap: nowrap; overflow-x: auto; max-width: 100%; scrollbar-width: none; &::-webkit-scrollbar { display: none; } } }

.oy-oymap {
  padding: 32px; border-radius: 22px; background: var(--oy-surface);
  &__head { display: flex; justify-content: space-between; align-items: end; gap: 12px 24px; flex-wrap: wrap; margin-bottom: 20px; h2 { font-size: 38px; } p { color: var(--oy-muted); margin-top: 6px; max-width: 640px; } }
  &__list { display: grid; gap: 8px; }
  @media (max-width: 768px) { padding: 20px 16px; margin-left: -8px; margin-right: -8px; &__head h2 { font-size: 30px; } }
}
.oy-oyrow {
  display: grid; grid-template-columns: 64px minmax(160px, 1.1fr) minmax(0, 1.6fr) auto auto 128px; gap: 16px; align-items: center; padding: 10px 14px 10px 10px; border-radius: 14px; background: #fff;
  &__pic img { width: 64px; height: 64px; border-radius: 10px; object-fit: cover; }
  &__name { display: grid; gap: 2px; min-width: 0; a { font-weight: 700; color: var(--oy-ink); line-height: 1.3; &:hover { color: var(--oy-accent); } } span { font-size: 12px; color: var(--oy-muted); } s { color: var(--oy-muted); } }
  &__sizes { display: flex; flex-wrap: wrap; gap: 6px; .oy-chip b { margin-left: 4px; } }
  &__dozen {
    display: flex; align-items: center; gap: 4px;
    > button { width: 36px; height: 32px; border-radius: 8px; font-weight: 600; font-size: 13px; color: var(--oy-ink); background: var(--oy-surface); &.is-on { background: var(--oy-ink); color: #fff; } }
    .oy-qty { margin-left: 4px; }
  }
  &__add { min-height: 40px; padding: 0 12px; justify-content: space-between; font-variant-numeric: tabular-nums; }
  @media (max-width: 1400px) {
    grid-template-columns: 64px minmax(0, 1fr) auto 128px; row-gap: 10px;
    &__sizes { grid-column: 2 / 3; grid-row: 2; }
    &__dozen { grid-column: 3 / 4; grid-row: 1; }
    &__svc { grid-column: 3 / 4; grid-row: 2; justify-self: end; }
    &__add { grid-column: 4; grid-row: 1 / 3; align-self: stretch; }
    &__pic { grid-row: 1 / 3; }
  }
  @media (max-width: 768px) {
    grid-template-columns: 56px minmax(0, 1fr); gap: 10px 12px; padding: 12px;
    &__pic { grid-row: 1; img { width: 56px; height: 56px; } }
    &__name { grid-column: 2; grid-row: 1; }
    &__sizes { grid-column: 1 / -1; grid-row: 2; }
    &__dozen { grid-column: 1 / -1; grid-row: 3; .oy-qty { margin-left: auto; } }
    &__svc { grid-column: 1; grid-row: 4; justify-self: start; white-space: nowrap; }
    &__add { grid-column: 2; grid-row: 4; justify-self: end; width: 140px; }
  }
  @media (max-width: 375px) { &__dozen > button { width: 32px; } }
}
.oy-chip--static { cursor: default; }

.oy-banners {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-bottom: 20px;
  &__item { display: block; border-radius: var(--oy-R); overflow: hidden; img { width: 100%; height: auto; aspect-ratio: 1484 / 1060; object-fit: cover; transition: transform .3s; } &:hover img { transform: scale(1.03); } }
  @media (max-width: 768px) { display: flex; overflow-x: auto; scrollbar-width: none; gap: 12px; &__item { flex: 0 0 78%; } &::-webkit-scrollbar { display: none; } }
}

.oy-ways {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px;
  &__item {
    display: flex; flex-direction: column; gap: 10px; padding: 22px; border-radius: var(--oy-R); background: var(--oy-surface2); color: var(--oy-accent);
    b { font-size: 17px; color: var(--oy-ink); line-height: 1.3; }
    p { color: var(--oy-muted); font-size: 14px; }
    &--hot { background: var(--oy-gold-soft); color: var(--oy-gold); }
    &--opt { background: #fff; border: 1px solid var(--oy-line); .oy-head__link { margin-top: auto; } &:hover { border-color: var(--oy-accent); } }
  }
  @media (max-width: 1199px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 576px) { grid-template-columns: minmax(0, 1fr); gap: 10px; &__item { padding: 18px; } }
}
.oy-keep {
  display: flex; gap: 14px; align-items: flex-start; margin-top: 16px; padding: 16px 20px; border-radius: 14px; border: 1px dashed #b7cfcc; color: var(--oy-accent);
  > .oy-icon { flex: none; }
  p { color: var(--oy-text); font-size: 14px; }
  b { color: var(--oy-ink); }
}

.oy-services {
  display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 20px;
  &__bar {
    position: relative; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); border-radius: 22px; overflow: hidden; background: var(--oy-surface);
    img { width: 100%; height: 100%; object-fit: cover; min-height: 320px; }
    > div { display: flex; flex-direction: column; gap: 14px; justify-content: center; padding: 32px; }
    h2 { font-size: 36px; }
    p { color: var(--oy-muted); }
    .oy-btn { align-self: flex-start; }
  }
  &__prep {
    display: flex; flex-direction: column; gap: 12px; padding: 28px; border-radius: 22px; border: 1px solid var(--oy-line);
    h3 { font-size: 28px; }
    > p { color: var(--oy-muted); font-size: 14px; }
    ul { display: grid; gap: 4px; }
    li {
      display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; gap: 12px; align-items: start; padding: 10px 0; border-bottom: 1px solid var(--oy-line);
      .oy-icon { color: var(--oy-accent); margin-top: 2px; }
      span { display: grid; gap: 2px; }
      b { color: var(--oy-ink); font-size: 15px; }
      small { color: var(--oy-muted); font-size: 13px; line-height: 1.4; }
      em { font-style: normal; font-weight: 700; color: var(--oy-ink); white-space: nowrap; }
    }
    .oy-head__link { margin-top: auto; }
  }
  @media (max-width: 1199px) { grid-template-columns: minmax(0, 1fr); }
  @media (max-width: 768px) {
    &__bar { grid-template-columns: minmax(0, 1fr); img { min-height: 0; aspect-ratio: 4 / 3; height: auto; } > div { padding: 22px; } h2 { font-size: 30px; } }
    &__prep { padding: 20px; }
  }
}

.oy-revs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; @media (max-width: 989px) { grid-template-columns: minmax(0, 1fr); } }
.oy-rev {
  display: flex; flex-direction: column; gap: 12px; padding: 24px; border-radius: var(--oy-R); background: var(--oy-surface2); color: var(--oy-accent);
  blockquote { margin: 0; color: var(--oy-text); font-size: 15px; }
  figcaption { margin-top: auto; font-weight: 700; color: var(--oy-ink); }
}

.oy-about {
  display: grid; grid-template-columns: 120px minmax(0, 1.3fr) minmax(0, 1fr); gap: 32px; align-items: start; padding: 32px; border-radius: 22px; border: 1px solid var(--oy-line);
  &__seal { width: 120px; height: 120px; }
  &__text { display: grid; gap: 12px; h2 { font-size: 34px; } p { color: var(--oy-muted); } }
  &__blog {
    display: grid; gap: 10px;
    > b { font-family: 'Advent Pro', sans-serif; font-size: 22px; color: var(--oy-ink); }
    a { display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: 12px; align-items: center; font-weight: 600; font-size: 14px; color: var(--oy-ink); line-height: 1.3; &:hover { color: var(--oy-accent); } }
    img { width: 64px; height: 64px; border-radius: 10px; object-fit: cover; }
    small { display: block; margin-top: 2px; font-weight: 500; color: var(--oy-muted); font-size: 12px; }
  }
  @media (max-width: 1199px) { grid-template-columns: 96px minmax(0, 1fr); &__seal { width: 96px; height: 96px; } &__blog { grid-column: 1 / -1; } }
  @media (max-width: 576px) { grid-template-columns: minmax(0, 1fr); padding: 22px 18px; gap: 18px; &__text h2 { font-size: 28px; } &__seal { width: 80px; height: 80px; } }
}

.oy-ask {
  display: flex; justify-content: space-between; align-items: center; gap: 20px 32px; flex-wrap: wrap; padding: 32px; border-radius: 22px; background: var(--oy-soft);
  h2 { font-size: 34px; }
  p { color: var(--oy-text); margin-top: 6px; }
  &__btns { display: flex; flex-wrap: wrap; gap: 10px; }
  @media (max-width: 576px) { padding: 22px 18px; h2 { font-size: 28px; } &__btns .oy-btn { flex: 1 1 100%; } }
}
</style>
