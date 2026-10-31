<script lang="ts" setup>
import BpIcon from '~/components/redesign/baltikprodukt/BpIcon.vue'
import BpRow from '~/components/redesign/baltikprodukt/BpRow.vue'

useSeoMeta({ title: 'Балтик продукт — рыба и морепродукты оптом и в розницу в Туле | Концепт редизайна' })

const q = useState<string>('bp-q', () => '')
const ui = useBaltikproduktUi()
// «Поделиться ссылкой» у спецпредложений оригинала: системное меню на телефоне, иначе копия ссылки.
const share = async (o: (typeof bpOffers)[number]) => {
  const url = `${location.origin}${bpSectionPath()}?q=${encodeURIComponent(o.q)}`
  if (navigator.share) {
    try {
      await navigator.share({ title: `${o.title} — Балтик продукт`, url })
    } catch {
      /* пользователь закрыл меню */
    }
    return
  }
  try {
    await navigator.clipboard.writeText(url)
    ui.say('Ссылка на спецпредложение скопирована')
  } catch {
    ui.say(`Ссылка: ${decodeURI(url)}`)
  }
}
const find = (text: string) => {
  q.value = text
  navigateTo({ path: bpSectionPath(), query: { q: text } })
}

// «Выгодно сейчас»: метки владельца «Акция/Новинка» и позиции с ценой «от 1 кор».
const tabs = [
  { id: 'flag', label: 'Акции и новинки', items: bpProducts.filter((p) => p.flag === 'sale' || p.flag === 'new') },
  { id: 'box', label: 'Коробкой дешевле', items: bpProducts.filter((p) => p.boxPrice && p.flag !== 'wait').slice(0, 8) },
]
const tab = ref('flag')
const shown = computed(() => tabs.find((t) => t.id === tab.value)!.items)
const boxCount = bpProducts.filter((p) => p.boxPrice).length
const own = bpProducts.filter((p) => p.origin === 'Узловая рыба').length
const brand = bpProducts.filter((p) => p.name.includes('За родину')).length

const facts = [
  { n: '1995', t: 'работаем с этого года' },
  { n: String(bpProducts.length), t: 'позиции в прайсе' },
  { n: '−25 °C', t: 'в холодильных камерах' },
  { n: String(own), t: 'позиции своего завода' },
]
const terms = [
  { icon: 'store', title: 'Опт и розница', text: bpTerms.retail },
  { icon: 'scale', title: 'Минимальный заказ', text: bpTerms.minimum },
  { icon: 'card', title: 'Оплата', text: 'Наличными, картой, безналичным расчётом для юрлиц.' },
  { icon: 'truck', title: 'Доставка «до порога»', text: 'По Тульской области и в другие регионы. Декларации и ветеринарные документы на всё.' },
]
const mapSrc = 'https://yandex.ru/map-widget/v1/?text=%D0%A2%D1%83%D0%BB%D0%B0%2C%20%D1%83%D0%BB.%20%D0%94%D0%B5%D0%BC%D0%BE%D0%BD%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%2C%20197%D0%B0&z=15'
</script>

<template>
  <div class="bp-home">
    <section class="bp-wrap bp-hero">
      <div class="bp-hero__panel">
        <h1>Рыба и&nbsp;морепродукты оптом и&nbsp;в&nbsp;розницу</h1>
        <p class="bp-hero__lead">
          Рыбная база в&nbsp;Туле с&nbsp;1995 года. Свежемороженая рыба, креветки, икра, копчение и&nbsp;консервы&nbsp;— весь прайс с&nbsp;ценами,
          без звонка и&nbsp;регистрации.
        </p>
        <div class="bp-hero__actions">
          <NuxtLink :to="bpSectionPath()" class="bp-btn">Открыть прайс <BpIcon name="arrow" :size="20" /></NuxtLink>
          <a :href="bpContacts.price" class="bp-btn bp-btn--line" download><BpIcon name="download" :size="20" /> Скачать .xlsx</a>
        </div>
        <ul class="bp-hero__facts">
          <li v-for="f in facts" :key="f.t">
            <b>{{ f.n }}</b>
            <span>{{ f.t }}</span>
          </li>
        </ul>
      </div>

      <div class="bp-hero__side">
        <NuxtLink :to="bpSectionPath('smoked')" class="bp-hero__photo">
          <img src="/redesign/baltikprodukt/img/salmon.jpg" alt="Сёмга холодного копчения" width="1400" height="606" />
          <span class="bp-hero__tag">Холодное копчение · {{ bpPositions(bpSection('smoked')?.count ?? 0) }}</span>
        </NuxtLink>
        <div class="bp-hero__offers">
          <article v-for="o in bpOffers" :key="o.title" class="bp-offer">
            <img :src="bpImg(o.img)" alt="" width="200" height="200" />
            <span>
              <b>{{ o.title }}</b>
              <small>{{ o.text }}</small>
              <span class="bp-offer__actions">
                <button type="button" class="bp-offer__find" @click="find(o.q)">Цены в прайсе <BpIcon name="arrow" :size="16" /></button>
                <button type="button" class="bp-offer__share" aria-label="Поделиться ссылкой" @click="share(o)"><BpIcon name="share" :size="18" /></button>
              </span>
            </span>
          </article>
        </div>
      </div>
    </section>

    <section class="bp-wrap bp-section">
      <div class="bp-head">
        <div>
          <h2 class="bp-h2">Прайс по разделам</h2>
          <p>Цены опт за кг или штуку, вес коробки и производитель — как в вашем прайсе, только с поиском.</p>
        </div>
        <NuxtLink :to="bpSectionPath()" class="bp-more">Весь прайс <BpIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="bp-tiles">
        <NuxtLink v-for="s in bpSections" :key="s.id" :to="bpSectionPath(s.id)" class="bp-tile">
          <img :src="bpImg(s.img)" alt="" width="60" height="60" loading="lazy" />
          <span>
            <b>{{ s.title }}</b>
            <small>{{ s.count }} поз.</small>
          </span>
        </NuxtLink>
      </div>
    </section>

    <section class="bp-wrap bp-section">
      <div class="bp-head">
        <div>
          <h2 class="bp-h2">Выгодно сейчас</h2>
          <p>У {{ boxCount }} позиций цена ниже, если брать коробку целиком, — список пересчитает сам.</p>
        </div>
      </div>
      <div class="bp-seg bp-home__tabs" role="tablist">
        <button
          v-for="t in tabs"
          :key="t.id"
          type="button"
          role="tab"
          :aria-selected="tab === t.id"
          :class="{ 'is-on': tab === t.id }"
          @click="tab = t.id"
        >
          {{ t.label }}
        </button>
      </div>
      <div class="bp-rows">
        <BpRow v-for="p in shown" :key="p.id" :product="p" />
      </div>
    </section>

    <section class="bp-wrap bp-section bp-own">
      <NuxtLink :to="{ path: bpSectionPath('canned'), query: { q: 'За родину' } }" class="bp-own__card bp-own__card--brand">
        <img src="/redesign/baltikprodukt/img/zarodinu.jpg" alt="Консервы «За родину»" width="296" height="262" class="bp-own__stamp" />
        <span>
          <h2>Консервы «За&nbsp;родину»</h2>
          <p>Балтийская килька, салака, паштеты и&nbsp;салаты из&nbsp;тунца из&nbsp;Калининграда. {{ bpPositions(brand) }}, коробкой дешевле.</p>
          <em class="bp-more">Смотреть в прайсе <BpIcon name="arrow" :size="18" /></em>
        </span>
      </NuxtLink>
      <NuxtLink :to="{ path: bpSectionPath(), query: { q: 'Узловая' } }" class="bp-own__card bp-own__card--plant">
        <img src="/redesign/baltikprodukt/img/hot-smoked.jpg" alt="Рыба горячего копчения" width="1400" height="547" class="bp-own__photo" />
        <span>
          <h2>Своё производство «Узловая рыба»</h2>
          <p>Солёная, вяленая, копчёная рыба и&nbsp;пресервы с&nbsp;завода в&nbsp;Тульской области. Без полифосфатов, текстурата и&nbsp;красителей.</p>
          <em class="bp-more">{{ bpPositions(own) }} в прайсе <BpIcon name="arrow" :size="18" /></em>
        </span>
      </NuxtLink>
    </section>

    <section class="bp-wrap bp-section">
      <div class="bp-head">
        <h2 class="bp-h2">Как у нас покупают</h2>
        <NuxtLink :to="bpPath('/contacts')" class="bp-more">Оплата и доставка <BpIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <ul class="bp-terms">
        <li v-for="t in terms" :key="t.title">
          <span class="bp-terms__ico"><BpIcon :name="t.icon" /></span>
          <span>
            <b>{{ t.title }}</b>
            <span>{{ t.text }}</span>
          </span>
        </li>
      </ul>
    </section>

    <section class="bp-wrap bp-section">
      <div class="bp-head">
        <div>
          <h2 class="bp-h2">Отзывы партнёров</h2>
          <p>Магазины и сети из Тулы и соседних областей.</p>
        </div>
        <NuxtLink :to="{ path: bpPath('/about'), hash: '#reviews' }" class="bp-more">Все отзывы <BpIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="bp-reviews">
        <blockquote v-for="r in bpReviews.slice(2, 5)" :key="r.name" class="bp-review">
          <p>{{ r.text }}</p>
          <footer>{{ r.name }}</footer>
        </blockquote>
      </div>
    </section>

    <section class="bp-wrap bp-section">
      <div class="bp-visit">
        <div class="bp-visit__info">
          <h2 class="bp-h2">Открыты ежедневно</h2>
          <p class="bp-visit__addr">{{ bpContacts.address }}</p>
          <ul class="bp-hours">
            <li v-for="h in bpContacts.hours" :key="h.days">
              <span>{{ h.days }}</span>
              <b>{{ h.time }}</b>
            </li>
          </ul>
          <div class="bp-visit__actions">
            <a :href="bpContacts.phones[0].href" class="bp-btn"><BpIcon name="phone" :size="20" /> {{ bpContacts.phones[0].label }}</a>
            <a :href="`mailto:${bpContacts.email}`" class="bp-btn bp-btn--line"><BpIcon name="mail" :size="20" /> {{ bpContacts.email }}</a>
          </div>
        </div>
        <div class="bp-map">
          <div class="bp-map__pin"><BpIcon name="pin" :size="28" /><span>{{ bpContacts.address }}</span></div>
          <iframe :src="mapSrc" title="Карта: Балтик продукт" loading="lazy" />
          <a :href="bpContacts.map" target="_blank" rel="noopener" class="bp-map__link">Открыть в Яндекс Картах</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.bp-hero {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 20px;
  padding-top: 24px;

  &__panel {
    display: flex;
    flex-direction: column;
    padding: 40px;
    border-radius: var(--bp-R);
    background: var(--bp-surface);

    h1 {
      font-size: clamp(32px, 3.6vw, 52px);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.02em;
    }
  }
  &__lead {
    margin-top: 18px;
    max-width: 46ch;
    color: var(--bp-muted);
    font-size: 17px;
  }
  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 28px 0 32px;

    .bp-btn {
      min-height: 52px;
    }
  }
  &__facts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 20px;
    margin-top: auto;
    padding-top: 36px;

    li {
      display: grid;
      align-content: start;
    }
    b {
      font-family: 'Inter Tight', sans-serif;
      font-size: 28px;
      font-weight: 800;
      line-height: 1.1;
      color: var(--bp-accent);
    }
    span {
      color: var(--bp-muted);
      font-size: 14px;
    }
  }
  &__side {
    display: grid;
    grid-template-rows: minmax(260px, 1fr) auto;
    gap: 20px;
    min-width: 0;
  }
  &__photo {
    position: relative;
    overflow: hidden;
    border-radius: var(--bp-R);
    background: #e9e2da;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    &:hover img {
      transform: scale(1.03);
    }
  }
  &__tag {
    position: absolute;
    left: 16px;
    bottom: 16px;
    padding: 8px 14px;
    border-radius: 12px;
    background: #fff;
    font-weight: 600;
    font-size: 14px;
  }
  &__offers {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

    &__panel {
      padding: 32px;
    }
    &__offers {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__side {
      grid-template-rows: auto;
    }
    &__photo {
      aspect-ratio: 16 / 7;
    }
    &__offers {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 768px) {
    &__offers {
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
    }
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-top: 14px;

    &__side {
      display: contents;
    }
    &__photo {
      order: -1;
      aspect-ratio: 16 / 8;
    }
    &__panel {
      padding: 24px 20px;
    }
    &__lead {
      font-size: 16px;
    }
    &__facts {
      gap: 14px;
      padding-top: 24px;

      b {
        font-size: 24px;
      }
    }
  }
  @media (max-width: 576px) {
    &__offers {
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
    }
    &__actions .bp-btn {
      flex: 1 1 100%;
    }
  }
}

.bp-offer {
  display: flex;
  align-items: stretch;
  gap: 16px;
  padding: 12px;
  border-radius: 18px;
  background: var(--bp-surface);
  text-align: left;
  transition: background 0.15s;

  img {
    flex: none;
    width: 104px;
    height: 104px;
    border-radius: 12px;
    object-fit: cover;
  }
  > span {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    padding: 2px 4px 2px 0;
  }
  b {
    font-family: 'Inter Tight', sans-serif;
    font-size: 17px;
    font-weight: 700;
  }
  small {
    color: var(--bp-muted);
    font-size: 13px;
    line-height: 1.4;
  }
  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: auto;
    padding: 0 !important;
  }
  &__find {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--bp-accent);
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
  }
  &__share {
    display: grid;
    place-items: center;
    flex: none;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: #fff;
    color: var(--bp-muted);

    &:hover {
      color: var(--bp-accent);
    }
  }
  &:hover {
    background: var(--bp-soft);
  }

  @media (max-width: 375px) {
    img {
      width: 80px;
      height: 80px;
    }
  }
}

.bp-seg.bp-home__tabs {
  display: inline-grid;
  margin-bottom: 16px;

  @media (max-width: 576px) {
    display: grid;
  }
  @media (max-width: 375px) {
    button {
      padding: 0 6px;
      font-size: 14px;
    }
  }
}

.bp-own {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px;

  &__card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: var(--bp-R);
    background: var(--bp-surface);
    transition: background 0.15s;

    > span {
      display: grid;
      gap: 10px;
      padding: 24px 28px 28px;
    }
    h2 {
      font-size: clamp(22px, 2vw, 28px);
      font-weight: 800;
      line-height: 1.15;
    }
    p {
      color: var(--bp-muted);
    }
    em {
      font-style: normal;
    }
    &:hover {
      background: var(--bp-soft);
    }
  }
  &__card--brand {
    flex-direction: row;
    align-items: center;
    background: #fbeceb;

    > span {
      padding-left: 40px;
    }
    &:hover {
      background: #f8e1df;
    }
  }
  &__stamp {
    flex: none;
    width: 190px;
    height: auto;
    margin: 24px 0 24px 24px;
    border-radius: 10px;
    transform: rotate(-3deg);
  }
  &__photo {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
  @media (max-width: 576px) {
    &__card--brand {
      flex-direction: column;
      align-items: flex-start;

      > span {
        padding-left: 24px;
        padding-top: 4px;
      }
    }
    &__stamp {
      width: 130px;
      margin: 20px 0 8px 24px;
    }
    &__card > span {
      padding: 20px 20px 24px;
    }
    &__photo {
      height: 160px;
    }
  }
}

.bp-terms {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  li {
    display: flex;
    gap: 14px;
    padding: 20px;
    border-radius: 18px;
    background: var(--bp-surface);

    > span:last-child {
      display: grid;
      gap: 4px;
      align-content: start;
      color: var(--bp-muted);
      font-size: 14px;
    }
    b {
      color: var(--bp-ink);
      font-size: 16px;
    }
  }
  &__ico {
    display: grid;
    place-items: center;
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #fff;
    color: var(--bp-accent);
  }

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}


.bp-visit {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 20px;

  &__info {
    padding: 36px;
    border-radius: var(--bp-R);
    background: var(--bp-surface);
  }
  &__addr {
    margin-top: 10px;
    font-size: 17px;
    font-weight: 600;
  }
  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
  @media (max-width: 576px) {
    &__info {
      padding: 24px 20px;
    }
    &__actions .bp-btn {
      flex: 1 1 100%;
      min-width: 0;
      padding: 0 12px;
    }
  }
}


// ul[class] { margin: 0 } портфолио сильнее одного класса
ul.bp-hero__facts {
  margin-top: auto;
}
.bp-visit__actions .bp-btn {
  flex: 1 1 auto;
}
</style>
