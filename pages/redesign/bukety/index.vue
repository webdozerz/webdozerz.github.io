<script lang="ts" setup>
import BkIcon from '~/components/redesign/bukety/BkIcon.vue'
import BkCard from '~/components/redesign/bukety/BkCard.vue'

useSeoMeta({ title: 'Любимые Букеты — доставка цветов в Томске за час, круглосуточно | Концепт редизайна' })

const shop = useBuketyShop()
const ui = useBuketyUi()
const { now, eta } = useBuketyClock()

// Подбор на первом экране: кому и бюджет -> три подходящих букета.
const whom = ref('lyubimoj-devushke')
const budget = ref('mid')
// В разделах «Кому» у оригинала по 15 букетов, в бюджет попадает 1–2 — добираем до трёх
// букетами того же бюджета из роз и сборных.
const flowerGroups = new Set(['roses', 'bouquets'])
const inBudget = computed(() => {
  const b = bkBudgets.find((x) => x.id === budget.value)!
  return bkProducts.filter((p) => p.price >= b.min && p.price <= b.max)
})
const tagged = computed(() => (whom.value ? inBudget.value.filter((p) => p.occ.includes(whom.value)) : []))
const matches = computed(() => {
  const rest = inBudget.value.filter((p) => !tagged.value.includes(p) && flowerGroups.has(bkGroupOf(p.sec)?.id ?? ''))
  return [...tagged.value, ...rest].slice(0, 3)
})
const pickQuery = computed(() => ({ ...(tagged.value.length >= 3 ? { o: whom.value } : {}), p: budget.value }))

const first = (secId: string) => bkProducts.find((p) => p.sec === secId)
const tiles = bkRibbon.slice(0, 8).map((r) => ({ ...r, section: bkFindSection(r.id)!, product: first(r.id)! }))

// Популярное по вкладкам: первые товары разделов, как «Самые популярные» оригинала.
const tabs = [
  { id: 'roses', title: 'Розы', secs: ['rozy-ekvador', 'rozy-eksklyuzivnye', 'rozy-kustovye'] },
  { id: 'mixed', title: 'Сборные', secs: ['sostavnye-bukety', 'bukety-s-pionami', 'bukety-s-gortenziej'] },
  { id: 'box', title: 'В коробке и корзине', secs: ['cvety-v-shlyapnyh-korobkah', 'cvetochnye-korziny', 'serdca-iz-cvetov'] },
  { id: 'gifts', title: 'К букету', secs: ['igrushki', 'shariki', 'sladosti-konfety'] },
]
const tab = ref('roses')
const tabProducts = computed(() => {
  const t = tabs.find((x) => x.id === tab.value)!
  const lists = t.secs.map((s) => bkProducts.filter((p) => p.sec === s))
  const out: BkProduct[] = []
  for (let i = 0; out.length < 8 && i < 6; i++) lists.forEach((l) => l[i] && out.length < 8 && out.push(l[i]))
  return out
})

// У каждого повода своё фото: товар, который ещё не стоит на соседней плитке.
const usedOcc = new Set<string>()
const occTiles = bkOccasions.slice(0, 6).map((o) => {
  const product = bkProducts.find((p) => p.occ.includes(o.id) && !usedOcc.has(p.id))!
  usedOcc.add(product.id)
  return { ...o, product }
})

// Открытка: текст сразу уходит в черновик оформления заказа.
const card = computed({
  get: () => shop.form.value.card,
  set: (v: string) => (shop.form.value = { ...shop.form.value, card: v.slice(0, 200) }),
})
const cardIdeas = ['С днём рождения! Ты — самое лучшее, что со мной случилось', 'Мамочка, спасибо за всё. Люблю', 'Просто так. Улыбнись!']
const saveCard = () => ui.say(card.value ? 'Текст открытки сохранили — он уже в оформлении заказа' : 'Напишите текст открытки')
</script>

<template>
  <div class="bk-home">
    <section class="bk-wrap bk-hero">
      <div class="bk-hero__panel">
        <h1>Цветы с доставкой по Томску за час</h1>
        <p class="bk-hero__lead">Круглосуточно и без выходных. По Томску бесплатно, открытка и фото вручения — в подарок.</p>
        <p class="bk-hero__eta">
          <BkIcon name="clock" :size="20" />
          <span v-if="now">Сейчас в Томске {{ bkHM(now) }} — привезём к <b>{{ eta }}</b></span>
          <span v-else>Привезём в течение часа</span>
        </p>

        <div class="bk-hero__pick">
          <div>
            <h2>Кому</h2>
            <div class="bk-seg">
              <button v-for="o in bkWhom" :key="o.id" type="button" :class="{ 'is-on': whom === o.id }" @click="whom = o.id">{{ o.title }}</button>
              <button type="button" :class="{ 'is-on': !whom }" @click="whom = ''">Всем</button>
            </div>
          </div>
          <div>
            <h2>Бюджет</h2>
            <div class="bk-seg">
              <button v-for="b in bkBudgets" :key="b.id" type="button" :class="{ 'is-on': budget === b.id }" @click="budget = b.id">{{ b.short }}</button>
            </div>
          </div>
        </div>
        <NuxtLink :to="{ path: bkPath('/catalog'), query: pickQuery }" class="bk-btn bk-btn--accent bk-btn--big bk-hero__go">
          Показать все букеты
          <BkIcon name="arrow" :size="20" />
        </NuxtLink>
      </div>

      <div class="bk-hero__matches" aria-live="polite">
        <BkCard v-for="(p, i) in matches.slice(0, 3)" :key="p.id" :product="p" :eager="i < 3" />
        <div v-if="!matches.length" class="bk-hero__none">
          <BkIcon name="bouquet" :size="40" />
          <p>В этом бюджете готовых букетов нет — флорист соберёт под вашу сумму.</p>
          <a :href="bkContacts.phoneHref" class="bk-btn bk-btn--line">{{ bkContacts.phone }}</a>
        </div>
      </div>
    </section>

    <section class="bk-wrap bk-free">
      <ul>
        <li v-for="f in bkFree" :key="f.title">
          <span class="bk-free__icon"><BkIcon :name="f.icon" /></span>
          <span>
            <b>{{ f.title }}</b>
            <small>{{ f.text }}</small>
          </span>
        </li>
      </ul>
    </section>

    <section class="bk-wrap bk-section">
      <div class="bk-head">
        <div>
          <h2>Каталог</h2>
          <p>{{ bkTotalProducts.toLocaleString('ru-RU') }} букетов, цветов поштучно и подарков</p>
        </div>
        <NuxtLink :to="bkPath('/catalog')">Весь каталог <BkIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="bk-tiles">
        <NuxtLink v-for="t in tiles" :key="t.id" :to="{ path: bkPath('/catalog'), query: { s: t.id } }" class="bk-tile">
          <img :src="t.product.img" alt="" width="500" height="625" loading="lazy" />
          <span class="bk-tile__text">
            <b><BkIcon :name="t.icon" :size="20" /> {{ t.title }}</b>
            <small>{{ t.section.count }} {{ bkPlural(t.section.count, 'товар', 'товара', 'товаров') }}</small>
          </span>
        </NuxtLink>
      </div>
    </section>

    <section class="bk-wrap bk-section">
      <div class="bk-head">
        <h2>Чаще всего заказывают</h2>
        <div class="bk-tabs" role="tablist">
          <button v-for="t in tabs" :key="t.id" type="button" role="tab" class="bk-tag" :class="{ 'is-on': tab === t.id }" :aria-selected="tab === t.id" @click="tab = t.id">
            {{ t.title }}
          </button>
        </div>
      </div>
      <div class="bk-grid">
        <BkCard v-for="p in tabProducts" :key="p.id" :product="p" />
      </div>
    </section>

    <section class="bk-wrap bk-section">
      <div class="bk-postcard">
        <div class="bk-postcard__preview" aria-hidden="true">
          <div class="bk-postcard__card">
            <BkIcon name="rose" :size="30" />
            <p v-if="card">{{ card }}</p>
            <p v-else class="is-empty">Здесь будет ваш текст</p>
            <small>любимые букеты</small>
          </div>
        </div>
        <div class="bk-postcard__form">
          <h2>Открытка — бесплатно к любому букету</h2>
          <p>Напишите пожелание сейчас: текст сохранится и сам появится в оформлении заказа. Можно не подписываться — доставим анонимно.</p>
          <label class="bk-field">
            <span>Текст открытки</span>
            <textarea v-model="card" rows="3" maxlength="200" placeholder="Например: С днём рождения!" />
            <small>{{ card.length }} / 200</small>
          </label>
          <div class="bk-postcard__ideas">
            <button v-for="c in cardIdeas" :key="c" type="button" class="bk-tag" @click="card = c">{{ c.length > 30 ? c.slice(0, 28) + '…' : c }}</button>
          </div>
          <button type="button" class="bk-btn bk-btn--accent" @click="saveCard">Сохранить текст</button>
        </div>
      </div>
    </section>

    <section class="bk-wrap bk-section">
      <div class="bk-head">
        <h2>Букеты по поводу</h2>
        <NuxtLink :to="bkPath('/catalog')">Все поводы <BkIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="bk-occ">
        <NuxtLink v-for="o in occTiles" :key="o.id" :to="{ path: bkPath('/catalog'), query: { o: o.id } }" class="bk-occ__item">
          <img :src="o.product.img" alt="" width="500" height="625" loading="lazy" />
          <span>
            <b>{{ o.title }}</b>
            <small>{{ o.count }} {{ bkPlural(o.count, 'букет', 'букета', 'букетов') }}</small>
          </span>
        </NuxtLink>
      </div>
    </section>

    <section class="bk-wrap bk-section bk-section--last">
      <div class="bk-deliv">
        <div class="bk-deliv__main">
          <h2>Доставка по Томску и области</h2>
          <p>Курьер привезёт букет за час в любое время суток. Не знаете адрес — укажите телефон получателя, курьер сам договорится о месте и времени.</p>
          <ul class="bk-deliv__zones">
            <li v-for="z in bkZones.filter((x) => x.id !== 'pickup')" :key="z.id">
              <span>
                <b>{{ z.title }}</b>
                <small>{{ z.text }}</small>
              </span>
              <em>{{ z.price === null ? 'по телефону' : z.price ? bkRub(z.price) : 'бесплатно' }}</em>
            </li>
          </ul>
          <NuxtLink :to="bkPath('/delivery')" class="bk-btn bk-btn--line">Доставка и оплата</NuxtLink>
        </div>
        <div class="bk-deliv__side">
          <div class="bk-deliv__rating">
            <div v-for="r in bkContacts.rating" :key="r.title">
              <b><span class="bk-stars"><BkIcon name="star" :size="22" /></span> {{ r.value }}</b>
              <small>{{ r.title }}</small>
            </div>
          </div>
          <ul class="bk-deliv__facts">
            <li><BkIcon name="clock" /> Самовывоз круглосуточно, без выходных</li>
            <li><BkIcon name="mask" /> Анонимная доставка — без подписи и имени</li>
            <li><BkIcon name="wallet" /> Наличными или картой курьеру, онлайн через СБП</li>
          </ul>
          <a :href="bkContacts.whatsapp" target="_blank" rel="noopener" class="bk-btn bk-btn--accent bk-btn--wide">
            <BkIcon name="chat" :size="20" /> Спросить в WhatsApp
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.bk-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.25fr);
  gap: 24px;
  padding-top: 28px;

  &__panel {
    display: flex;
    flex-direction: column;
    padding: 40px;
    border-radius: var(--bk-r-panel);
    background: var(--bk-surface);

    h1 {
      font-size: clamp(34px, 3.4vw, 50px);
      letter-spacing: -0.02em;
    }
  }

  &__lead {
    margin-top: 14px !important;
    font-size: 18px;
    color: var(--bk-muted);
  }

  &__eta {
    display: flex;
    align-items: center;
    gap: 10px;
    align-self: flex-start;
    margin-top: 20px !important;
    padding: 10px 16px;
    border-radius: 12px;
    background: #fff;
    font-weight: 600;

    svg {
      flex: none;
      color: var(--bk-accent);
    }

    b {
      color: var(--bk-accent);
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }
  }

  &__pick {
    display: grid;
    gap: 18px;
    margin-top: 28px;

    h2 {
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: 800;
    }
  }

  &__go {
    align-self: flex-start;
    margin-top: auto;
  }

  &__pick + &__go {
    margin-top: 28px;
  }

  &__matches {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;

    .bk-card__plate {
      flex: none;
    }

    // Снимки растягиваются на высоту панели слева, без пустоты сверху и снизу.
    .bk-card__photo {
      position: relative;
      flex: 1;
      min-height: 280px;

      img {
        position: absolute;
        inset: 0;
        height: 100%;
        aspect-ratio: auto;
      }
    }
  }

  &__none {
    grid-column: 1 / -1;
    display: grid;
    justify-items: center;
    gap: 14px;
    padding: 40px;
    border-radius: var(--bk-r-panel);
    background: var(--bk-gray);
    text-align: center;
    color: var(--bk-muted);

    svg {
      color: var(--bk-accent);
    }
  }
}

.bk-free {
  margin-top: 24px;

  ul {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    border-radius: 18px;
    border: 1px solid var(--bk-line);

    > span:last-child {
      display: grid;
      line-height: 1.3;
    }

    b {
      font-weight: 800;
    }

    small {
      color: var(--bk-muted);
      font-size: 14px;
    }
  }

  &__icon {
    display: grid;
    place-items: center;
    flex: none;
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: var(--bk-rose-soft);
    color: var(--bk-rose);
  }
}

.bk-tiles {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.bk-tile {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: var(--bk-r-card);
  background: var(--bk-gray);

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 5 / 4;
    object-fit: cover;
    object-position: 50% 30%;
    transition: transform 0.3s;
  }

  &:hover img {
    transform: scale(1.04);
  }

  &__text {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 14px;
    background: #fff;

    b {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 800;
      white-space: nowrap;

      svg {
        color: var(--bk-accent);
      }
    }

    small {
      color: var(--bk-muted);
      font-size: 13px;
      white-space: nowrap;
    }
  }
}

.bk-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.bk-postcard {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  overflow: hidden;
  border-radius: var(--bk-r-panel);
  background: var(--bk-surface);

  &__preview {
    display: grid;
    place-items: center;
    padding: 40px;
    background: var(--bk-rose-soft);
  }

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: min(380px, 100%);
    min-height: 260px;
    padding: 28px 28px 22px;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 20px 40px rgba(200, 49, 75, 0.14);
    text-align: center;
    transform: rotate(-2deg);

    svg {
      color: var(--bk-rose);
    }

    p {
      flex: 1;
      display: grid;
      place-items: center;
      font-size: 22px;
      font-weight: 600;
      line-height: 1.35;
      overflow-wrap: anywhere;

      &.is-empty {
        color: var(--bk-line-strong);
      }
    }

    small {
      color: var(--bk-accent);
      font-weight: 800;
    }
  }

  &__form {
    display: grid;
    gap: 16px;
    align-content: center;
    padding: 40px;

    h2 {
      font-size: clamp(26px, 2.4vw, 34px);
    }

    > p {
      color: var(--bk-muted);
    }

    > .bk-btn {
      justify-self: start;
    }
  }

  &__ideas {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .bk-tag {
      background: #fff;
    }
  }
}

.bk-occ {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;

  &__item {
    display: grid;
    gap: 10px;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 50%;
      background: var(--bk-gray);
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.04);
    }

    span {
      display: grid;
      text-align: center;
    }

    b {
      font-weight: 800;
    }

    small {
      color: var(--bk-muted);
      font-size: 14px;
    }
  }
}

.bk-deliv {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: 24px;

  &__main {
    display: grid;
    gap: 18px;
    align-content: start;
    padding: 36px;
    border-radius: var(--bk-r-panel);
    border: 1px solid var(--bk-line);

    h2 {
      font-size: clamp(26px, 2.4vw, 34px);
    }

    > p {
      color: var(--bk-muted);
    }

    > .bk-btn {
      justify-self: start;
    }
  }

  ul.bk-deliv__zones {
    display: grid;

    li {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 0;
      border-top: 1px solid var(--bk-line);
    }

    span {
      display: grid;
      min-width: 0;
    }

    b {
      font-weight: 800;
    }

    small {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: var(--bk-muted);
      font-size: 14px;
    }

    em {
      flex: none;
      font-style: normal;
      font-weight: 800;
      white-space: nowrap;
    }
  }

  &__side {
    display: grid;
    gap: 16px;
    align-content: start;
    padding: 28px;
    border-radius: var(--bk-r-panel);
    background: var(--bk-surface);
  }

  &__rating {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    > div {
      display: grid;
      justify-items: start;
      gap: 2px;
      padding: 16px;
      border-radius: 16px;
      background: #fff;
    }

    b {
      font-size: 32px;
      font-weight: 800;
      line-height: 1;
    }

    small {
      color: var(--bk-muted);
      font-weight: 700;
    }
  }

  ul.bk-deliv__facts {
    display: grid;
    gap: 12px;

    li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      line-height: 1.35;
    }

    svg {
      flex: none;
      color: var(--bk-accent);
    }
  }
}

@media (max-width: 1400px) {
  .bk-occ {
    gap: 12px;
  }
}

@media (max-width: 1199px) {
  .bk-hero {
    grid-template-columns: minmax(0, 1fr);

    &__panel {
      padding: 32px;
    }

    &__go {
      margin-top: 28px;
    }
  }

  .bk-free ul {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .bk-tiles {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .bk-occ {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px 16px;

    &__item img {
      width: 72%;
      justify-self: center;
    }
  }

  .bk-deliv {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 989px) {
  .bk-hero {
    padding-top: 16px;
  }

  .bk-postcard {
    grid-template-columns: minmax(0, 1fr);

    &__preview {
      padding: 32px 20px;
    }

    &__form {
      padding: 28px;
    }
  }
}

@media (max-width: 768px) {
  .bk-hero {
    &__panel {
      padding: 22px 20px;
      border-radius: 22px;
    }

    &__lead {
      font-size: 16px;
    }

    &__eta {
      font-size: 15px;
    }

    &__go {
      width: 100%;
    }

    &__matches {
      display: flex;
      gap: 12px;
      margin: 0 -16px;
      padding: 0 16px 6px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-padding-inline: 16px;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      .bk-card {
        flex: 0 0 56%;
        scroll-snap-align: start;
      }

      .bk-card__photo {
        flex: none;
        min-height: 0;

        img {
          position: static;
          height: auto;
          aspect-ratio: 4 / 5;
        }
      }
    }
  }

  .bk-hero__pick .bk-seg button {
    min-height: 40px;
    padding: 4px 12px;
    font-size: 14px;
  }

  .bk-free ul {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }

  .bk-free li {
    padding: 12px 14px;
  }

  .bk-tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .bk-tile {
    border-radius: 18px;

    img {
      aspect-ratio: 4 / 5;
    }

    &__text {
      left: 6px;
      right: 6px;
      bottom: 6px;
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
      padding: 8px 10px;
      border-radius: 12px;

      b {
        font-size: 15px;
      }
    }
  }

  .bk-head .bk-tabs {
    flex-wrap: nowrap;
    width: calc(100% + 32px);
    margin: 0 -16px;
    padding: 0 16px;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .bk-postcard {
    border-radius: 22px;

    &__card {
      min-height: 200px;

      p {
        font-size: 19px;
      }
    }

    &__form {
      padding: 22px 20px;

      > .bk-btn {
        justify-self: stretch;
      }
    }
  }

  .bk-occ {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px 10px;

    &__item {
      img {
        width: 100%;
      }

      b {
        font-size: 15px;
      }

      small {
        font-size: 13px;
      }
    }
  }

  .bk-deliv {
    &__main,
    &__side {
      padding: 22px 20px;
      border-radius: 22px;
    }

    &__main > .bk-btn {
      justify-self: stretch;
    }
  }
}

@media (max-width: 375px) {
  .bk-hero__matches .bk-card {
    flex-basis: 62%;
  }

  .bk-occ {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
