<script lang="ts" setup>
import LfCard from '~/components/redesign/lavkafish/LfCard.vue'
import LfIcon from '~/components/redesign/lavkafish/LfIcon.vue'
import LfQty from '~/components/redesign/lavkafish/LfQty.vue'
import LfRow from '~/components/redesign/lavkafish/LfRow.vue'

useSeoMeta({
  title: 'Лавка Fish — охлаждённая форель и морепродукты с доставкой по Томску | Концепт редизайна',
})

const cart = useLavkafishCart()
const ui = useLavkafishUi()

const tue = computed(() => ui.batch('tue'))
const thu = computed(() => ui.batch('thu'))

const hero = lfProducts[0]
const heroVariant = hero.variants[0]

const board = computed(() =>
  cart.city.value === 'tomsk'
    ? [
        {
          date: tue.value,
          what: 'Форель из Хакасии, филе и заморозка, морепродукты, икра, полуфабрикаты, фермерская курица',
        },
        { date: thu.value, what: 'Лосось и форель охлаждённые из Мурманска' },
      ]
    : [
        {
          date: thu.value,
          what: 'Форель из Хакасии, брикеты сёмги, филе форели, креветки',
        },
      ],
)

// Каталог: раздел, поиск и сортировка по цене за кг.
const group = ref<LfGroupId | 'all'>('all')
const query = ref('')
const sort = ref<'default' | 'cheap' | 'dear'>('default')

const inCity = (p: LfProduct) => Boolean(p.batch[cart.city.value])
const matches = (p: LfProduct) => {
  const q = query.value.trim().toLowerCase()
  if (group.value !== 'all' && p.group !== group.value) return false
  return !q || `${p.name} ${p.variants.map((v) => v.label).join(' ')}`.toLowerCase().includes(q)
}
const cards = computed(() => {
  const list = lfProducts.filter((p) => inCity(p) && matches(p))
  const min = (p: LfProduct) => Math.min(...p.variants.map(lfPerKg))
  if (sort.value === 'cheap') return [...list].sort((a, b) => min(a) - min(b))
  if (sort.value === 'dear') return [...list].sort((a, b) => min(b) - min(a))
  return list
})
const resetFilters = () => {
  query.value = ''
  group.value = 'all'
}
const rows = computed(() => lfRows.filter((p) => inCity(p) && matches(p)))
const groupCount = (id: LfGroupId) => lfAll.filter((p) => p.group === id && inCity(p)).length
const groups = computed(() => lfGroups.filter((g) => groupCount(g.id) > 0))
const onlyTomsk = computed(() => lfAll.filter((p) => !p.batch.nsk).length)

watch(
  () => cart.city.value,
  () => {
    if (group.value !== 'all' && !groupCount(group.value)) group.value = 'all'
  },
)

// Курица КФХ — только под заказ, без цены на сайте.
const chicken = reactive({ qty: 1, phone: '', sent: false })
const chickenStop = computed(() => lfChickenStop(tue.value))
const sendChicken = () => {
  if (chicken.phone.replace(/\D/g, '').length < 10) {
    ui.say('Укажите телефон, чтобы менеджер подтвердил заказ')
    return
  }
  chicken.sent = true
}

// Подписка на чат WhatsApp с новыми поступлениями.
const sub = reactive({ name: '', phone: '', sent: false })
const sendSub = () => {
  if (!sub.name.trim() || sub.phone.replace(/\D/g, '').length < 10) {
    ui.say('Нужны имя и телефон, на котором есть WhatsApp')
    return
  }
  sub.sent = true
}
</script>

<template>
  <div class="lf-home">
    <section class="lf-wrap lf-hero">
      <div class="lf-hero__panel">
        <p class="lf-hero__kicker">Андрей и Наталья · семейная лавка в Томске</p>
        <h1>Охлаждённая форель и морепродукты к&nbsp;вашему столу</h1>
        <p class="lf-hero__lead">
          Возим партиями: собираем заказы к ближайшему привозу и сразу везём рыбу к вам в термобоксах со льдом. Цена за килограмм, точную
          сумму считаем после взвешивания.
        </p>

        <ul class="lf-board" aria-label="Ближайшие привозы">
          <li v-for="b in board" :key="b.date.id">
            <span class="lf-board__date">
              <b>{{ b.date.dm }}</b>
              <span>{{ b.date.day }}</span>
            </span>
            <span class="lf-board__what">{{ b.what }}</span>
          </li>
        </ul>

        <div class="lf-hero__actions">
          <a href="#catalog" class="lf-btn">Выбрать к привозу<LfIcon name="arrow" :size="20" /></a>
          <a href="#how" class="lf-btn lf-btn--line">Как считаем цену</a>
        </div>
      </div>

      <figure class="lf-hero__photo">
        <img :src="lfImg('trout-roe.jpg')" alt="Форель из Хакасии с икрой на разделочной доске" width="720" height="720" />
        <figcaption class="lf-hero__plaque">
          <span class="lf-hero__ptext">
            <b>Форель Хакасия, {{ heroVariant.label }}</b>
            <span>{{ heroVariant.note }} · осталось {{ heroVariant.left }} шт</span>
          </span>
          <span class="lf-hero__pprice">{{ lfPrice(heroVariant.price) }}<small>/кг</small></span>
          <LfQty :pid="hero.id" :vid="heroVariant.id" label="В заказ" />
        </figcaption>
      </figure>
    </section>

    <section id="how" class="lf-wrap lf-how" aria-label="Как считаем цену">
      <p>
        <LfIcon name="scale" :size="28" />
        <span><b>Цена за килограмм.</b> Рыбу заказываете в штуках, точную сумму считаем после взвешивания.</span>
      </p>
      <p>
        <LfIcon name="card" :size="28" />
        <span><b>На сайте — за 1 кг.</b> Каждую рыбу оплачиваете за килограмм, доплату по весу отдаёте курьеру.</span>
      </p>
      <p>
        <LfIcon name="whatsapp" :size="28" />
        <span><b>Время — в WhatsApp.</b> В течение суток после заказа пришлём, когда приедет курьер.</span>
      </p>
    </section>

    <section id="catalog" class="lf-wrap lf-section lf-catalog">
      <div class="lf-head">
        <div>
          <h2>К ближайшему привозу</h2>
          <p>
            Цены и остатки из нашего Telegram-канала на 23 октября.
            <template v-if="cart.city.value === 'nsk'"
              >В Новосибирск и на Алтай возим охлаждённую форель, брикеты и креветки, ещё {{ onlyTomsk }} позиций — только по
              Томску.</template
            >
          </p>
        </div>
      </div>

      <div class="lf-tools">
        <div class="lf-tools__groups" role="tablist" aria-label="Разделы">
          <button
            type="button"
            role="tab"
            class="lf-chip"
            :class="{ 'is-active': group === 'all' }"
            :aria-selected="group === 'all'"
            @click="group = 'all'"
          >
            Всё
          </button>
          <button
            v-for="g in groups"
            :key="g.id"
            type="button"
            role="tab"
            class="lf-chip"
            :class="{ 'is-active': group === g.id }"
            :aria-selected="group === g.id"
            @click="group = g.id"
          >
            {{ g.title }}<span class="lf-tools__count">{{ groupCount(g.id) }}</span>
          </button>
        </div>
        <div class="lf-tools__right">
          <label class="lf-search">
            <LfIcon name="search" :size="20" />
            <input v-model="query" type="search" placeholder="Форель, креветки…" aria-label="Поиск по каталогу" />
          </label>
          <label class="lf-field lf-tools__sort">
            <select v-model="sort" aria-label="Сортировка">
              <option value="default">Сначала охлаждённая</option>
              <option value="cheap">Дешевле за кг</option>
              <option value="dear">Дороже за кг</option>
            </select>
          </label>
        </div>
      </div>

      <div v-if="cards.length" class="lf-grid">
        <LfCard v-for="p in cards" :key="p.id" :product="p" />
      </div>

      <div v-if="rows.length" class="lf-rows">
        <h3>Ещё в этот привоз</h3>
        <ul>
          <LfRow v-for="p in rows" :key="p.id" :product="p" />
        </ul>
      </div>

      <div v-if="!cards.length && !rows.length" class="lf-empty">
        <p>Ничего не нашли по запросу «{{ query }}». Напишите нам — возможно, привезём под заказ.</p>
        <button type="button" class="lf-btn lf-btn--line" @click="resetFilters">Показать всё</button>
      </div>
    </section>

    <section v-if="cart.city.value === 'tomsk'" class="lf-wrap" aria-label="Фермерская курица">
      <div class="lf-farm">
        <div class="lf-farm__pic">
          <img
            :src="lfImg('chicken.jpg')"
            alt="Фермерская курица на доске"
            class="lf-farm__photo"
            width="560"
            height="750"
            loading="lazy"
          />
        </div>
        <div class="lf-farm__body">
          <p class="lf-farm__tag"><LfIcon name="clock" :size="18" />Приём заказов: {{ chickenStop }}</p>
          <h2>Охлаждённая фермерская курица КФХ Кузнецова, д.&nbsp;Кандинка</h2>
          <ul class="lf-farm__list">
            <li><LfIcon name="shield" :size="20" /><span>Без гормонов роста и антибиотиков — подтверждено документами</span></li>
            <li><LfIcon name="snow" :size="20" /><span>Мясо охлаждённое, фарш и субпродукты (желудки, печень) — заморозка</span></li>
            <li>
              <LfIcon name="truck" :size="20" /><span>Привезём {{ tue.dayAcc }}, {{ tue.dm }}. Только под заказ, свободной не будет</span>
            </li>
          </ul>
          <form v-if="!chicken.sent" class="lf-farm__form" @submit.prevent="sendChicken">
            <div class="lf-farm__qty">
              <span>Тушек</span>
              <button type="button" class="lf-iconbtn" aria-label="Меньше" @click="chicken.qty = Math.max(1, chicken.qty - 1)">
                <LfIcon name="minus" :size="18" />
              </button>
              <b>{{ chicken.qty }}</b>
              <button type="button" class="lf-iconbtn" aria-label="Больше" @click="chicken.qty = Math.min(20, chicken.qty + 1)">
                <LfIcon name="plus" :size="18" />
              </button>
            </div>
            <label class="lf-field lf-farm__phone">
              <input v-model="chicken.phone" type="tel" inputmode="tel" placeholder="Телефон" aria-label="Телефон" />
            </label>
            <button type="submit" class="lf-btn">Записаться</button>
          </form>
          <p v-else class="lf-done">
            <LfIcon name="check" :size="20" />
            <span>Записали {{ chicken.qty }} шт. Цену по весу назовёт менеджер. Это демо — заявка никуда не ушла.</span>
          </p>
        </div>
      </div>
    </section>

    <section class="lf-wrap lf-section lf-prices">
      <div class="lf-head">
        <div>
          <h2>По прайсу</h2>
          <p>Эти позиции меняются каждую неделю — пришлём актуальный прайс в WhatsApp.</p>
        </div>
      </div>
      <div class="lf-prices__grid">
        <article v-for="p in lfPriceLists" :key="p.id" class="lf-tile">
          <img :src="p.img" :alt="p.title" width="480" height="320" loading="lazy" />
          <div class="lf-tile__body">
            <h3>{{ p.title }}</h3>
            <p>{{ p.text }}</p>
            <button type="button" class="lf-btn lf-btn--line" @click="ui.request.value = p.id">
              <LfIcon name="whatsapp" :size="20" />Запросить прайс
            </button>
          </div>
        </article>
      </div>
    </section>

    <section class="lf-wrap lf-section lf-owners">
      <img
        :src="lfImg('owners.jpg')"
        alt="Андрей и Наталья, владельцы «Лавки Fish»"
        class="lf-owners__photo"
        width="720"
        height="540"
        loading="lazy"
      />
      <div class="lf-owners__body">
        <h2>Мы — Андрей и Наталья</h2>
        <p>
          Однажды после горнолыжного склона мы купили форель на соседнем хозяйстве — её выловили при нас. Шашлык из свежей рыбы не шёл ни в
          какое сравнение с рыбой из супермаркета, которую замораживают и размораживают по несколько раз.
        </p>
        <p>
          В тот вечер мы спросили друг друга: почему у нас в городе нет такой рыбы? И решили — рыбе быть. По очереди уволились с работы и
          теперь возим свежую рыбу вам.
        </p>
        <NuxtLink :to="lfPath('/about')" class="lf-link">О нас и контакты<LfIcon name="arrow" :size="18" /></NuxtLink>

        <div class="lf-sub">
          <h3>Новые поступления — первыми</h3>
          <p>
            Добавим вас в наш чат в WhatsApp или подпишитесь на канал: там
            {{ lfContacts.channelSubs }} человек и новинки каждый день.
          </p>
          <form v-if="!sub.sent" class="lf-sub__form" @submit.prevent="sendSub">
            <input v-model="sub.name" type="text" placeholder="Имя и фамилия" aria-label="Имя и фамилия" />
            <input v-model="sub.phone" type="tel" inputmode="tel" placeholder="Телефон в WhatsApp" aria-label="Телефон в WhatsApp" />
            <button type="submit" class="lf-btn">Добавить в чат</button>
          </form>
          <p v-else class="lf-done">
            <LfIcon name="check" :size="20" /><span>Готово, {{ sub.name }}! Это демо: в чат никого не добавляем.</span>
          </p>
          <a :href="lfContacts.channel" target="_blank" rel="noopener" class="lf-link">
            <LfIcon name="telegram" :size="20" />Канал @LavkaSP
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.lf-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 20px;
  padding-top: 24px;

  &__panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 40px;
    border-radius: var(--lf-r-lg);
    background: var(--lf-surface);
  }

  &__kicker {
    color: var(--lf-muted);
    font-weight: 700;
  }

  h1 {
    font-size: clamp(34px, 4.2vw, 56px);
    font-weight: 900;
    line-height: 1.02;
    letter-spacing: -0.025em;
  }

  &__lead {
    max-width: 560px;
    color: var(--lf-text);
    font-size: 18px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: auto;
  }

  &__photo {
    position: relative;
    min-height: 100%;
    overflow: hidden;
    border-radius: var(--lf-r-lg);
    background: var(--lf-surface);

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__plaque {
    position: absolute;
    right: 16px;
    bottom: 16px;
    left: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 12px 12px 18px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 8px 28px rgba(18, 48, 46, 0.18);
  }

  &__ptext {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    line-height: 1.3;

    b {
      font-weight: 800;
    }

    span {
      color: var(--lf-muted);
      font-size: 14px;
    }
  }

  &__pprice {
    font-size: 22px;
    font-weight: 900;
    white-space: nowrap;

    small {
      color: var(--lf-muted);
      font-size: 14px;
      font-weight: 600;
    }
  }

  .lf-qty__add {
    padding: 0 14px;
  }

  @media (max-width: 1199px) {
    &__panel {
      padding: 32px;
    }

    &__plaque {
      flex-wrap: wrap;
    }

    &__ptext {
      flex-basis: 100%;
    }

    &__pprice {
      margin-right: auto;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__photo {
      order: -1;
      min-height: 0;
      aspect-ratio: 4 / 3;
    }
  }

  @media (max-width: 576px) {
    gap: 12px;
    padding-top: 12px;

    &__panel {
      gap: 16px;
      padding: 22px 18px;
    }

    &__lead {
      font-size: 17px;
    }

    &__photo {
      aspect-ratio: 1;
    }

    &__plaque {
      right: 10px;
      bottom: 10px;
      left: 10px;
      gap: 10px;
      padding: 10px 10px 10px 14px;
    }

    &__actions .lf-btn {
      flex: 1 1 100%;
    }
  }
}

ul.lf-board {
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: grid;
    grid-template-columns: 132px minmax(0, 1fr);
    align-items: center;
    gap: 16px;
    padding: 14px 16px;
    border-radius: 14px;
    background: #fff;
  }

  @media (max-width: 375px) {
    li {
      grid-template-columns: minmax(0, 1fr);
      gap: 4px;
    }
  }
}

.lf-board {
  &__date {
    display: flex;
    flex-direction: column;
    line-height: 1.15;

    b {
      font-size: 21px;
      font-weight: 900;
      white-space: nowrap;
    }

    span {
      color: var(--lf-accent-text);
      font-size: 15px;
      font-weight: 700;
    }
  }

  &__what {
    color: var(--lf-text);
    font-size: 16px;
    line-height: 1.35;
  }
}

.lf-how {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  padding-top: 28px;

  p {
    display: flex;
    gap: 14px;
    color: var(--lf-text);
    font-size: 16px;

    .lf-icon {
      flex: none;
      color: var(--lf-accent-text);
    }

    b {
      color: var(--lf-ink);
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }
}

.lf-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
  margin-bottom: 24px;

  &__groups {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .lf-chip {
      min-height: 40px;
      padding: 0 14px;
    }
  }

  &__count {
    margin-left: 6px;
    opacity: 0.6;
    font-variant-numeric: tabular-nums;
  }

  &__right {
    display: flex;
    gap: 10px;
  }

  &__sort {
    width: 220px;

    select {
      min-height: 46px;
    }
  }

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: minmax(0, 1fr);

    &__groups {
      flex-wrap: nowrap;
      margin: 0 -20px;
      padding: 0 20px;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 40px), transparent);
      mask-image: linear-gradient(90deg, #000 calc(100% - 40px), transparent);
    }

    &__right {
      width: 100%;
    }

    .lf-search {
      flex: 1;
      min-width: 0;
    }

    &__sort {
      width: 190px;
    }
  }

  @media (max-width: 576px) {
    &__right {
      flex-direction: column;
    }

    .lf-search {
      flex: none;
      width: 100%;
      height: 50px;
    }

    &__sort {
      width: 100%;
    }
  }

  @media (max-width: 375px) {
    &__groups {
      margin: 0 -14px;
      padding: 0 14px;
    }
  }
}

.lf-search {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 280px;
  height: 46px;
  padding: 0 14px;
  border: 1px solid var(--lf-line);
  border-radius: var(--lf-r);
  color: var(--lf-muted);

  &:focus-within {
    border-color: var(--lf-ink);
  }

  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: none;
    background: none;
    color: var(--lf-ink);
    font-size: 16px;
  }
}

.lf-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 989px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.lf-rows {
  margin-top: 36px;

  h3 {
    margin-bottom: 12px;
    font-size: 22px;
  }
}

.lf-empty {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 14px;
  padding: 28px;
  border-radius: var(--lf-r-lg);
  background: var(--lf-surface);
}

.lf-farm {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 0;
  overflow: hidden;
  border-radius: var(--lf-r-lg);
  background: var(--lf-surface);

  &__pic {
    position: relative;
    min-height: 320px;
  }

  &__photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 36px 40px;

    h2 {
      font-size: clamp(26px, 2.6vw, 34px);
      line-height: 1.1;
    }
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    align-self: start;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 10px;
    background: #fff;
    font-weight: 700;
  }

  &__form {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 4px;
  }

  &__qty {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 50px;
    padding: 0 4px 0 14px;
    border: 1px solid var(--lf-line);
    border-radius: var(--lf-r);
    background: #fff;

    span {
      margin-right: 4px;
      color: var(--lf-muted);
      font-size: 15px;
    }

    b {
      min-width: 24px;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
  }

  &__phone {
    flex: 1;
    min-width: 180px;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__pic {
      min-height: 0;
      aspect-ratio: 16 / 9;
    }

    &__body {
      padding: 28px 24px;
    }
  }

  @media (max-width: 576px) {
    &__body {
      padding: 22px 18px 24px;
    }

    &__form .lf-btn {
      flex: 1 1 100%;
    }
  }
}

ul.lf-farm__list {
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    gap: 10px;
    color: var(--lf-text);

    .lf-icon {
      flex: none;
      margin-top: 2px;
      color: var(--lf-ok);
    }
  }
}

.lf-prices__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.lf-tile {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--lf-r-lg);
  box-shadow: inset 0 0 0 1px var(--lf-line);

  img {
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: start;
    gap: 10px;
    padding: 18px;

    h3 {
      font-size: 21px;
    }

    p {
      color: var(--lf-text);
      font-size: 16px;
    }

    .lf-btn {
      margin-top: auto;
    }
  }

  @media (max-width: 989px) {
    flex-direction: row;

    img {
      width: 38%;
      aspect-ratio: auto;
    }
  }

  @media (max-width: 576px) {
    flex-direction: column;

    img {
      width: 100%;
      aspect-ratio: 16 / 9;
    }

    .lf-btn {
      width: 100%;
    }
  }
}

.lf-owners {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 40px;

  &__photo {
    width: 100%;
    height: 100%;
    min-height: 360px;
    object-fit: cover;
    border-radius: var(--lf-r-lg);
  }

  &__body {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 14px;

    h2 {
      font-size: clamp(28px, 3.2vw, 40px);
      line-height: 1.1;
    }

    > p {
      color: var(--lf-text);
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;

    &__photo {
      height: auto;
      min-height: 0;
      aspect-ratio: 4 / 3;
    }
  }
}

.lf-sub {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  width: 100%;
  margin-top: 12px;
  padding: 24px;
  border-radius: var(--lf-r-lg);
  background: var(--lf-surface);

  h3 {
    font-size: 22px;
  }

  p {
    color: var(--lf-text);
    font-size: 16px;
  }

  .lf-link {
    align-self: start;
  }

  &__form {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
    gap: 10px;

    input {
      min-width: 0;
      min-height: 50px;
      padding: 12px 14px;
      border: 1px solid var(--lf-line);
      border-radius: var(--lf-r);
      background: #fff;
      font-size: 16px;
      outline: none;

      &:focus {
        border-color: var(--lf-ink);
      }
    }
  }

  @media (max-width: 1199px) {
    &__form {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 576px) {
    padding: 20px 16px;
  }
}
</style>
