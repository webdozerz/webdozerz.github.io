<script lang="ts" setup>
// Модель: выбор столешницы и ножек меняет снимки, название варианта и адрес (?v=ID, как -offer-ID у оригинала).
import { dmCode, dmColorName, dmDealers, dmImg, dmInstructionFor, dmMarkets, dmOrig, dmPath, dmSizeText, dmExtText, dmTypeName, dmYoutubeId } from '~/utils/domoteka'
import { dmProducts } from '~/utils/domoteka.data'
import { useDmStore } from '~/composables/useDomoteka'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'
import DmCard from '~/components/redesign/domoteka/DmCard.vue'

const route = useRoute()
const router = useRouter()
const store = useDmStore()
const p = computed(() => dmProducts.find((x) => x.id === route.params.id))
const offer = computed(() => p.value?.offers.find((o) => o.id === route.query.v) || p.value?.offers[0] || { id: '', c: '', l: '', ph: [] })
const colorName = computed(() => p.value!.colors.find((x) => x.id === offer.value.c)?.n || '')
const legName = computed(() => p.value!.legs.find((x) => x.id === offer.value.l)?.n || '')
const legsFor = computed(() => new Set(p.value!.offers.filter((o) => o.c === offer.value.c).map((o) => o.l)))
const setOffer = (id: string) => router.replace({ query: id === p.value!.offers[0].id ? {} : { v: id } })
const pickC = (c: string) => {
  const o = p.value!.offers.find((x) => x.c === c && x.l === offer.value.l) || p.value!.offers.find((x) => x.c === c)
  if (o) setOffer(o.id)
}
const pickL = (l: string) => {
  const o = p.value!.offers.find((x) => x.c === offer.value.c && x.l === l)
  if (o) setOffer(o.id)
}

useSeoMeta({ title: () => `${p.value?.n} — ${dmTypeName(p.value?.type || '').toLowerCase()} | Домотека, концепт редизайна` })

// Галерея: первый снимок — свой, сжатый; остальные снимки варианта — с сайта фабрики
const photos = computed(() => [dmImg(`p/${offer.value.id}.jpg`), ...offer.value.ph.map(dmOrig)])
const cur = ref(0)
watch(offer, () => (cur.value = 0))
const step = (d: number) => (cur.value = (cur.value + d + photos.value.length) % photos.value.length)
const thumbs = ref<HTMLElement | null>(null)
watch(cur, (i) => (thumbs.value?.children[i] as HTMLElement | undefined)?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }))

const isFav = computed(() => store.fav.value.includes(p.value!.id))
const isCmp = computed(() => store.cmp.value.includes(p.value!.id))
const shareOpen = ref(false)
const pageUrl = computed(() => `https://andryushov.me${route.fullPath}`)
const copy = async () => {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    store.say('Ссылка скопирована')
  } catch {
    store.say('Не удалось скопировать ссылку')
  }
  shareOpen.value = false
}
const printPdf = () => window.print()
const buy = ref<'online' | 'shop'>('online')
const video = ref(false)
const yt = computed(() => dmYoutubeId(p.value!.video))
const instr = computed(() => dmInstructionFor(p.value!))
const related = computed(() => {
  const same = dmProducts.filter((x) => x.id !== p.value!.id && x.series === p.value!.series)
  const more = dmProducts.filter((x) => x.id !== p.value!.id && x.series !== p.value!.series && x.type === p.value!.type)
  return [...same, ...more].slice(0, 8)
})
const rel = ref<HTMLElement | null>(null)
const scrollRel = (d: number) => rel.value?.scrollBy({ left: d * rel.value.clientWidth * 0.8, behavior: 'smooth' })
const crumbsType = computed(() => (p.value!.sec === 'stulya' ? null : { n: dmTypeName(p.value!.type), to: { path: dmPath('/katalog/stoly/'), query: { type: p.value!.type } } }))
</script>

<template>
  <div v-if="p" class="dm-wrap dm-model">
    <nav class="dm-crumbs dm-model__crumbs" aria-label="Навигация">
      <NuxtLink :to="dmPath('/')">Главная</NuxtLink>
      <span><NuxtLink :to="dmPath(p.sec === 'stulya' ? '/katalog/stulya/' : '/katalog/stoly/')">{{ p.sec === 'stulya' ? 'Стулья' : 'Столы' }}</NuxtLink></span>
      <span v-if="crumbsType"><NuxtLink :to="crumbsType.to">{{ crumbsType.n }}</NuxtLink></span>
      <span>{{ p.n }}</span>
    </nav>

    <div class="dm-model__top">
      <div class="dm-gal">
        <div class="dm-gal__main">
          <img :key="photos[cur]" :src="photos[cur]" :alt="`${p.n}, ${colorName}, ножки ${legName} — фото ${cur + 1}`" width="1100" height="1100" :class="{ 'is-first': cur === 0 }" />
          <button v-if="photos.length > 1" type="button" class="dm-gal__arrow dm-gal__arrow--l" aria-label="Предыдущее фото" @click="step(-1)"><DmIcon name="left" /></button>
          <button v-if="photos.length > 1" type="button" class="dm-gal__arrow dm-gal__arrow--r" aria-label="Следующее фото" @click="step(1)"><DmIcon name="right" /></button>
          <span class="dm-gal__count">{{ cur + 1 }} / {{ photos.length }}</span>
        </div>
        <div ref="thumbs" class="dm-gal__thumbs">
          <button v-for="(ph, i) in photos" :key="ph" type="button" class="dm-gal__thumb" :class="{ 'is-on': i === cur }" :aria-label="`Фото ${i + 1}`" @click="cur = i">
            <img :src="ph" alt="" width="96" height="96" loading="lazy" />
          </button>
        </div>
      </div>

      <div class="dm-info">
        <div class="dm-info__meta">
          <span>Серия {{ p.series }}</span>
          <span v-for="t in p.tags" :key="t" class="dm-tag" :class="`dm-tag--${t}`">{{ { new: 'Новинка', hit: 'Хит продаж', sale: 'Акция' }[t] }}</span>
        </div>
        <h1 class="dm-h1 dm-info__title">{{ p.n }}</h1>
        <p class="dm-info__variant">{{ dmCode(colorName) }}<template v-if="legName"> · ножки {{ legName }}</template></p>

        <ul class="dm-info__facts">
          <li v-if="p.size"><DmIcon name="ruler" /><span><small>Размер</small>{{ dmSizeText(p) }}<template v-if="p.size.h && p.sec === 'stoly'">, высота {{ p.size.h }} см</template></span></li>
          <li v-if="p.size?.ext"><DmIcon name="expand" /><span><small>Разложенный</small>{{ dmExtText(p) }}</span></li>
          <li v-if="p.mech"><DmIcon name="layers" /><span><small>Механизм</small>{{ p.mech }}</span></li>
          <li v-if="p.shape"><DmIcon name="table" /><span><small>Форма</small>{{ p.shape }}</span></li>
        </ul>

        <div class="dm-info__pick">
          <div class="dm-info__row">
            <span class="dm-info__label">{{ p.colorLabel }}: <b>{{ dmColorName(colorName) }}</b></span>
            <div class="dm-swrow dm-swrow--big">
              <button
                v-for="o in p.colors"
                :key="o.id"
                type="button"
                class="dm-sw"
                :class="{ 'is-on': o.id === offer.c }"
                :title="o.n"
                :aria-label="`${p.colorLabel}: ${o.n}`"
                @click="pickC(o.id)"
              >
                <img :src="dmImg(`sw/${o.sw}`)" alt="" width="44" height="44" />
              </button>
            </div>
          </div>
          <div v-if="p.legs.length" class="dm-info__row">
            <span class="dm-info__label">Ножки: <b>{{ legName }}</b></span>
            <div class="dm-swrow dm-swrow--big">
              <button
                v-for="o in p.legs"
                :key="o.id"
                type="button"
                class="dm-sw dm-sw--leg"
                :class="{ 'is-on': o.id === offer.l, 'is-off': !legsFor.has(o.id) }"
                :disabled="!legsFor.has(o.id)"
                :title="legsFor.has(o.id) ? o.n : `${o.n} — не сочетается с этим цветом`"
                :aria-label="`Ножки: ${o.n}`"
                @click="pickL(o.id)"
              >
                <img :src="dmImg(`sw/${o.sw}`)" alt="" width="44" height="44" />
              </button>
            </div>
          </div>
          <p class="dm-info__stock"><DmIcon name="box" />В наличии на складе фабрики · {{ p.offers.length }} {{ p.offers.length === 1 ? 'вариант' : p.offers.length < 5 ? 'варианта' : 'вариантов' }}</p>
        </div>

        <div class="dm-buy" id="kupit">
          <div class="dm-buy__tabs" role="tablist" aria-label="Где купить">
            <button type="button" role="tab" :aria-selected="buy === 'online'" :class="{ 'is-on': buy === 'online' }" @click="buy = 'online'"><DmIcon name="globe" />Интернет-магазины</button>
            <button type="button" role="tab" :aria-selected="buy === 'shop'" :class="{ 'is-on': buy === 'shop' }" @click="buy = 'shop'"><DmIcon name="store" />Ближайший магазин</button>
          </div>
          <div v-if="buy === 'online'" class="dm-buy__pane">
            <div class="dm-markets dm-buy__markets">
              <a v-for="m in dmMarkets" :key="m.n" :href="m.url" target="_blank" rel="noopener" class="dm-market" :title="`${m.n} — магазин «Домотеки»`"><img :src="dmImg(m.img)" :alt="m.n" width="200" height="60" loading="lazy" /></a>
            </div>
            <p class="dm-buy__note">Ссылки ведут в магазины «Домотеки» на площадках — ищите «{{ p.n }}».</p>
          </div>
          <div v-else class="dm-buy__pane">
            <ul class="dm-buy__shops">
              <li v-for="d in dmDealers.filter((x) => x.geo)" :key="d.id">
                <b>{{ d.n }}</b><span>{{ d.addr }}</span><a v-if="d.tel" :href="`tel:${d.tel}`">{{ d.phone }}</a>
              </li>
            </ul>
            <NuxtLink :to="{ path: dmPath('/gde-kupit/'), query: { model: p.id }, hash: '#magaziny' }" class="dm-btn dm-btn--soft">Все магазины на карте<DmIcon name="right" /></NuxtLink>
          </div>
        </div>

        <div class="dm-info__acts">
          <button type="button" class="dm-act" :class="{ 'is-on': isFav }" :aria-pressed="isFav" @click="store.toggleFav(p.id, p.n)"><DmIcon name="heart" />{{ isFav ? 'В избранном' : 'В избранное' }}</button>
          <button type="button" class="dm-act" :class="{ 'is-on': isCmp }" :aria-pressed="isCmp" @click="store.toggleCmp(p.id, p.n)"><DmIcon name="compare" />{{ isCmp ? 'В сравнении' : 'К сравнению' }}</button>
          <div class="dm-share">
            <button type="button" class="dm-act" :aria-expanded="shareOpen" @click="shareOpen = !shareOpen"><DmIcon name="share" />Поделиться</button>
            <div v-if="shareOpen" class="dm-share__drop">
              <a :href="`https://vk.com/share.php?url=${encodeURIComponent(pageUrl)}`" target="_blank" rel="noopener">ВКонтакте</a>
              <a :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`" target="_blank" rel="noopener">Facebook</a>
              <a :href="`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}`" target="_blank" rel="noopener">Telegram</a>
              <button type="button" @click="copy"><DmIcon name="copy" />Скопировать ссылку</button>
            </div>
          </div>
          <button type="button" class="dm-act" @click="printPdf"><DmIcon name="download" />Сохранить в PDF</button>
        </div>
      </div>
    </div>

    <div class="dm-model__more" :class="{ 'is-single': !p.desc && !yt }">
      <div v-if="p.desc || yt" class="dm-model__col">
        <section v-if="p.desc" class="dm-model__block">
          <h2>Описание</h2>
          <div class="dm-model__desc">
            <p>{{ p.desc }}</p>
            <p class="dm-model__shade">Оттенок столешницы на снимке может немного отличаться от настоящего: так передают цвет экраны, а допустимые различия рисунка декора — по ГОСТ 13025.3-85.</p>
          </div>
        </section>
        <section v-if="yt" class="dm-model__block dm-video">
          <h2>Crash-test</h2>
          <div class="dm-video__frame">
            <iframe
              v-if="video"
              :src="`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1`"
              title="Crash-test стола"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowfullscreen
            />
            <button v-else type="button" class="dm-video__poster" aria-label="Смотреть crash-test" @click="video = true">
              <img :src="`https://i.ytimg.com/vi/${yt}/hqdefault.jpg`" alt="" width="480" height="360" loading="lazy" />
              <span><DmIcon name="play" /></span>
            </button>
          </div>
          <p>Проверяем столы нагрузкой — смотрите, что выдерживает {{ p.n }}.</p>
        </section>
      </div>
      <div class="dm-model__col">
        <section class="dm-model__block">
          <h2>Характеристики</h2>
          <dl class="dm-specs">
            <template v-for="[k, v] in p.specs" :key="k">
              <dt>{{ k }}</dt>
              <dd>{{ v }}<template v-if="k === 'Общий вес' && /^[\d,]+$/.test(v)"> кг</template><template v-if="k === 'Объем' && /^[\d,]+$/.test(v)"> м³</template></dd>
            </template>
            <dt>Цвет</dt>
            <dd>{{ colorName }}</dd>
            <template v-if="legName">
              <dt>Ножки</dt>
              <dd>{{ legName }}</dd>
            </template>
          </dl>
        </section>
        <a v-if="instr" :href="instr.url" target="_blank" rel="noopener" class="dm-instr">
          <DmIcon name="doc" />
          <span><b>Инструкция по сборке</b><small>{{ instr.n }}, PDF</small></span>
          <DmIcon name="download" />
        </a>
        <p v-if="!p.desc" class="dm-model__shade">Оттенок столешницы на снимке может немного отличаться от настоящего: так передают цвет экраны, а допустимые различия рисунка декора — по ГОСТ 13025.3-85.</p>
      </div>
    </div>

    <section v-if="related.length" class="dm-sec">
      <div class="dm-sec__head">
        <h2 class="dm-h2">{{ related[0].series === p.series ? `Серия ${p.series} и похожие` : 'Похожие модели' }}</h2>
      </div>
      <div class="dm-shelf">
        <button type="button" class="dm-shelf__arrow dm-shelf__arrow--l" aria-label="Назад" @click="scrollRel(-1)"><DmIcon name="left" /></button>
        <div ref="rel" class="dm-shelf__track">
          <DmCard v-for="r in related" :key="r.id" :p="r" />
        </div>
        <button type="button" class="dm-shelf__arrow dm-shelf__arrow--r" aria-label="Вперёд" @click="scrollRel(1)"><DmIcon name="right" /></button>
      </div>
    </section>
  </div>
  <div v-else class="dm-wrap dm-sec">
    <div class="dm-empty">
      <DmIcon name="search" />
      <b>Такой модели нет</b>
      <p>Возможно, её сняли с производства. Посмотрите другие столы фабрики.</p>
      <NuxtLink :to="dmPath('/katalog/stoly/')" class="dm-btn">В каталог</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.dm .dm-model {
  .dm-model__crumbs {
    margin: 20px 0 16px;
  }
  .dm-model__top {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: 40px;
    align-items: start;
  }
  .dm-gal {
    position: sticky;
    top: 96px;
    display: grid;
    gap: 10px;
  }
  .dm-gal__main {
    position: relative;
    aspect-ratio: 1;
    border: 1px solid var(--dm-line);
    border-radius: 18px;
    background: #fff;
    overflow: hidden;
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      &.is-first {
        inset: 6%;
        width: 88%;
        height: 88%;
        object-fit: contain;
      }
    }
  }
  .dm-gal__arrow {
    position: absolute;
    top: 50%;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    margin-top: -22px;
    border: 1px solid var(--dm-line);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    cursor: pointer;
    &:hover {
      color: var(--dm-acc);
    }
    &--l {
      left: 12px;
    }
    &--r {
      right: 12px;
    }
  }
  .dm-gal__count {
    position: absolute;
    right: 12px;
    bottom: 12px;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(22, 31, 58, 0.75);
    color: #fff;
    font-size: 13px;
  }
  .dm-gal__thumbs {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 76px;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 6px;
    scrollbar-width: thin;
  }
  .dm-gal__thumb {
    position: relative;
    aspect-ratio: 1;
    padding: 0;
    border: 1.5px solid var(--dm-line);
    border-radius: 10px;
    background: #fff;
    overflow: hidden;
    cursor: pointer;
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &.is-on {
      border-color: var(--dm-or);
    }
  }
  .dm-info {
    display: grid;
    gap: 18px;
  }
  .dm-info__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    font-size: 14px;
    color: var(--dm-muted);
  }
  .dm-info__title {
    margin-top: -8px;
  }
  .dm-info__variant {
    margin-top: -10px;
    font-size: 17px;
    color: var(--dm-muted);
  }
  .dm-info__facts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      border-radius: var(--dm-r);
      background: var(--dm-surf);
      font-size: 15px;
      line-height: 1.3;
    }
    .dm-icon {
      margin-top: 2px;
      color: var(--dm-or-d);
    }
    span {
      display: grid;
      gap: 2px;
      min-width: 0;
    }
    small {
      font-size: 12px;
      color: var(--dm-muted);
    }
  }
  .dm-info__pick {
    display: grid;
    gap: 16px;
    padding: 18px 0;
    border-top: 1px solid var(--dm-line);
    border-bottom: 1px solid var(--dm-line);
  }
  .dm-info__row {
    display: grid;
    gap: 10px;
  }
  .dm-info__label {
    font-size: 14px;
    color: var(--dm-muted);
    b {
      color: var(--dm-ink);
      font-weight: 600;
    }
  }
  .dm-info__stock {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    .dm-icon {
      color: #2c7a3f;
    }
  }
  .dm-buy {
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r2);
    overflow: hidden;
  }
  .dm-buy__tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 52px;
      padding: 0 12px;
      border: 0;
      border-bottom: 1px solid var(--dm-line);
      background: var(--dm-surf);
      font-weight: 600;
      cursor: pointer;
      &.is-on {
        background: #fff;
        border-bottom-color: transparent;
        color: var(--dm-acc);
      }
      & + button {
        border-left: 1px solid var(--dm-line);
      }
    }
  }
  .dm-buy__pane {
    display: grid;
    gap: 12px;
    padding: 16px;
    .dm-btn {
      justify-self: start;
    }
  }
  .dm-buy__markets {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    .dm-market {
      height: 60px;
    }
  }
  .dm-buy__note {
    font-size: 13px;
    color: var(--dm-muted);
  }
  .dm-buy__shops {
    display: grid;
    gap: 10px;
    li {
      display: grid;
      font-size: 14px;
      span {
        color: var(--dm-muted);
      }
      a {
        color: var(--dm-acc);
        font-weight: 600;
        text-decoration: none;
      }
    }
  }
  .dm-info__acts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .dm-act,
  .dm-act:focus {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r);
    background: #fff;
    font-size: 14px;
    cursor: pointer;
    .dm-icon {
      width: 18px;
      height: 18px;
      color: var(--dm-muted);
    }
    &:hover {
      border-color: var(--dm-acc);
      color: var(--dm-acc);
    }
    &.is-on {
      border-color: var(--dm-or);
      background: var(--dm-soft);
      .dm-icon {
        color: var(--dm-or-d);
      }
    }
  }
  .dm-share {
    position: relative;
  }
  .dm-share__drop {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 20;
    display: grid;
    min-width: 220px;
    padding: 6px;
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r2);
    background: #fff;
    box-shadow: 0 2px 6px rgba(22, 31, 58, 0.08), 0 22px 54px rgba(22, 31, 58, 0.22);
    a,
    button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 9px 10px;
      border: 0;
      border-radius: 6px;
      background: none;
      text-align: left;
      text-decoration: none;
      cursor: pointer;
      &:hover {
        background: var(--dm-surf);
        color: var(--dm-acc);
      }
    }
    .dm-icon {
      width: 17px;
      height: 17px;
    }
  }
  .dm-model__more {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: 24px 40px;
    margin-top: 48px;
  }
  .dm-model__block {
    h2 {
      margin-bottom: 14px;
      font: 800 24px/1.15 var(--dm-head);
      font-stretch: 112%;
    }
  }
  .dm-model__col {
    display: grid;
    align-content: start;
    gap: 32px;
  }
  .dm-model__more.is-single {
    grid-template-columns: minmax(0, 1fr);
    .dm-model__col {
      max-width: 760px;
    }
  }
  .dm-model__desc {
    display: grid;
    gap: 12px;
    p {
      font-size: 16px;
      line-height: 1.6;
    }
  }
  .dm-model__shade {
    padding: 12px 14px;
    border-radius: var(--dm-r);
    background: var(--dm-soft);
    font-size: 14px !important;
    line-height: 1.5;
  }
  .dm-model__toggle {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 10px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--dm-acc);
    font-weight: 600;
    cursor: pointer;
    .dm-icon {
      width: 17px;
      height: 17px;
    }
  }
  .dm-specs {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    margin: 0;
    dt,
    dd {
      margin: 0;
      padding: 10px 0;
      border-bottom: 1px solid var(--dm-line);
      font-size: 15px;
    }
    dt {
      color: var(--dm-muted);
    }
    dd {
      font-weight: 500;
    }
  }

  .dm-video {
    display: grid;
    gap: 10px;
    p {
      color: var(--dm-muted);
      font-size: 14px;
    }
  }
  .dm-video__frame {
    position: relative;
    aspect-ratio: 16 / 9;
    border-radius: var(--dm-r2);
    overflow: hidden;
    background: var(--dm-ink);
    iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
  .dm-video__poster {
    position: absolute;
    inset: 0;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    span {
      position: absolute;
      top: 50%;
      left: 50%;
      display: grid;
      place-items: center;
      width: 68px;
      height: 68px;
      margin: -34px 0 0 -34px;
      border-radius: 50%;
      background: var(--dm-or-d);
      color: #fff;
      .dm-icon {
        width: 28px;
        height: 28px;
        fill: currentColor;
      }
    }
  }
  .dm-instr {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 20px;
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r2);
    text-decoration: none;
    > .dm-icon:first-child {
      width: 44px;
      height: 44px;
      padding: 10px;
      border-radius: 12px;
      background: var(--dm-blue-soft);
      color: var(--dm-acc);
    }
    span {
      flex: 1;
      display: grid;
    }
    b {
      font: 700 17px/1.25 var(--dm-head);
    }
    small {
      color: var(--dm-muted);
    }
    &:hover {
      border-color: var(--dm-acc);
      color: var(--dm-acc);
    }
  }
}
@media print {
  .dm .dm-concept,
  .dm .dm-strip,
  .dm .dm-head,
  .dm .dm-foot,
  .dm .dm-tabbar,
  .dm .dm-up,
  .dm .dm-buy,
  .dm .dm-info__acts,
  .dm .dm-gal__thumbs,
  .dm .dm-gal__arrow,
  .dm .dm-sec,
  .dm .dm-model__toggle,
  .dm .dm-video {
    display: none !important;
  }
  .dm .dm-model .dm-gal {
    position: static;
  }

}
@media (max-width: 1199px) {
  .dm .dm-model {
    .dm-model__top,
    .dm-model__more {
      gap: 24px 28px;
    }
    .dm-info__facts {
      grid-template-columns: minmax(0, 1fr);
    }
    .dm-buy__tabs button {
      font-size: 14px;
    }
  }
}
@media (max-width: 989px) {
  .dm .dm-model {
    .dm-model__top,
    .dm-model__more {
      grid-template-columns: minmax(0, 1fr);
    }
    .dm-gal {
      position: static;
    }
    .dm-info__facts {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .dm-model__more {
      margin-top: 36px;
    }
  }
}
@media (max-width: 576px) {
  .dm .dm-model {
    .dm-info__facts {
      grid-template-columns: minmax(0, 1fr);
    }
    .dm-buy__tabs {
      grid-template-columns: minmax(0, 1fr);
      button + button {
        border-left: 0;
      }
    }
    .dm-buy__markets {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .dm-gal__thumbs {
      grid-auto-columns: 62px;
    }
    .dm-info__acts .dm-act {
      flex: 1 1 calc(50% - 4px);
      justify-content: center;
    }
    .dm-specs {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
  }
}
</style>
