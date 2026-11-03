<script lang="ts" setup>
import BzIcon from '~/components/redesign/22bee/BzIcon.vue'
import BzQty from '~/components/redesign/22bee/BzQty.vue'

// Страница сорта: у оригинала все сорта на одной странице, и в поиске «гречишный мёд оптом Алтай» его не найти.
const route = useRoute()
const sort = computed(() => bzSort(String(route.params.id)))
if (!sort.value) throw createError({ statusCode: 404, statusMessage: 'Сорт не найден' })

const order = useBee22Order()
const ui = useBee22Ui()
const qty = computed(() => order.qtyOf(sort.value!.id))
const line = computed(() => (qty.value ? order.lineOf(sort.value!, qty.value) : null))
const others = computed(() => bzSorts.filter((s) => s.id !== sort.value!.id))

// Пример расчёта до добавления: 1 куботейнер и 6 куботейнеров (204 кг)
const examples = computed(() =>
  sort.value!.frames
    ? []
    : [1, Math.ceil(bzBulk / bzCube)].map((n) => {
        const kg = n * bzCube
        const t = bzTierOf(sort.value!, kg)
        return { n, kg, price: t.price, sum: kg * t.price }
      }),
)

useSeoMeta({
  title: () => `${sort.value!.title} оптом от ${bzMoney(sort.value!.tiers[1].price)}/кг — Мёд и Соты | Концепт редизайна`,
})
</script>

<template>
  <div v-if="sort" class="bz-wrap bz-sort">
    <nav class="bz-crumbs" aria-label="Навигация">
      <NuxtLink :to="bzPath()">Главная</NuxtLink>
      <span>/</span>
      <NuxtLink :to="{ path: bzPath(), hash: '#sorta' }">Сорта и цены</NuxtLink>
      <span>/</span>
      <span>{{ sort.short }}</span>
    </nav>

    <div class="bz-sort__main">
      <button type="button" class="bz-sort__photo" :class="{ 'is-out': !sort.stock }" @click="ui.open([{ img: sort.img, title: sort.title }], 0)">
        <img :src="sort.img" :alt="sort.title" width="550" height="311" />
        <span class="bz-sort__badge">Сбор {{ bzYear }}</span>
      </button>

      <div class="bz-sort__panel">
        <h1>{{ sort.title }}</h1>
        <p class="bz-sort__meta">
          <span class="bz-stock" :class="{ 'is-out': !sort.stock }">{{ sort.stock ? 'В наличии' : 'Нет в наличии' }}</span>
          <span>{{ sort.frames ? `Мёд в рамках, заказ от ${bzMinFrames} рамок` : 'Весовой, в куботейнере 34 кг' }}</span>
        </p>

        <dl class="bz-sort__tiers">
          <div v-for="(t, i) in sort.tiers" :key="t.from" class="bz-tier" :class="{ 'is-bulk': i === 1, 'is-active': line && !sort.frames && (line.bulk ? 1 : 0) === i }">
            <dt>от {{ t.from }} кг</dt>
            <dd><b>{{ bzMoney(t.price) }}</b><span>/кг</span></dd>
          </div>
        </dl>

        <div class="bz-sort__calc">
          <BzQty :sort="sort" big />
          <div v-if="line && !sort.frames" class="bz-sort__result">
            <p>{{ bzCubes(line.qty) }} · {{ bzKg(line.kg) }} × {{ bzMoney(line.price) }}</p>
            <b>{{ bzMoney(line.sum) }}</b>
            <small v-if="line.toBulk">Ещё {{ bzCubes(line.toBulk) }} — и цена {{ bzMoney(sort.tiers[1].price) }}/кг</small>
            <small v-else class="is-ok">Считаем по цене от 200 кг</small>
          </div>
          <div v-else-if="line" class="bz-sort__result">
            <p>{{ bzFramesLabel(line.qty) }}</p>
            <small>Сумму посчитаем по весу рамок: {{ bzMoney(sort.tiers[0].price) }}/кг, от 200 кг — {{ bzMoney(sort.tiers[1].price) }}/кг</small>
          </div>
          <ul v-else-if="examples.length" class="bz-sort__examples">
            <li v-for="e in examples" :key="e.n">
              <span>{{ bzCubes(e.n) }}, {{ bzKg(e.kg) }}</span>
              <b>{{ bzMoney(e.sum) }}</b>
            </li>
          </ul>
        </div>

        <NuxtLink v-if="qty" :to="bzPath('/zayavka')" class="bz-btn bz-btn--line is-big">Перейти к заявке <BzIcon name="arrow" :size="18" /></NuxtLink>
        <button v-else-if="!sort.stock" type="button" class="bz-btn bz-btn--line is-big" @click="ui.priceModal.value = true">Узнать о новом сборе</button>
      </div>
    </div>

    <div class="bz-sort__info">
      <article>
        <BzIcon name="doc" />
        <h2>Документы к поставке</h2>
        <p>Договор поставки, паспорт пасеки, протокол испытаний мёда в лаборатории, вет. свидетельство. Работаем в Меркурии.</p>
        <NuxtLink :to="{ path: bzPath(), hash: '#dokumenty' }" class="bz-link">Посмотреть документы</NuxtLink>
      </article>
      <article>
        <BzIcon name="card" />
        <h2>Оплата</h2>
        <p>Предоплата 100%: по QR-коду или счёту на расчётный счёт ИП, через СБП.</p>
      </article>
      <article>
        <BzIcon name="truck" />
        <h2>Отправка</h2>
        <p>2–5 рабочих дней после оплаты, из Барнаула транспортной компанией. Доставку оплачиваете при получении.</p>
        <NuxtLink :to="{ path: bzPath(), hash: '#dostavka' }" class="bz-link">Условия целиком</NuxtLink>
      </article>
    </div>

    <section class="bz-section">
      <div class="bz-head">
        <h2 class="bz-h2">Другие сорта</h2>
      </div>
      <div class="bz-others">
        <NuxtLink v-for="s in others" :key="s.id" :to="bzSortPath(s.id)" :class="{ 'is-out': !s.stock }">
          <img :src="s.img" :alt="s.title" width="550" height="311" loading="lazy" />
          <span>
            <b>{{ s.short }}</b>
            <small>{{ s.stock ? `от ${bzMoney(s.tiers[1].price)}/кг` : 'нет в наличии' }}</small>
          </span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss">


.bz-sort {
  &__main {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: 24px 40px;
    align-items: start;
  }

  &__photo {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    background: var(--bz-surface);

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 550 / 311;
      object-fit: cover;
    }

    &.is-out img {
      filter: grayscale(0.7);
    }
  }

  &__badge {
    position: absolute;
    left: 16px;
    top: 16px;
    padding: 6px 12px;
    border-radius: 8px;
    background: var(--bz-accent);
    color: var(--bz-ink);
    font-weight: 700;
    font-size: 14px;
  }

  &__panel {
    display: grid;
    gap: 18px;

    h1 {
      font-size: clamp(30px, 3.2vw, 44px);
      line-height: 1.08;
    }
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
    color: var(--bz-muted);
  }

  &__tiers {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    .bz-tier {
      padding: 14px 16px;

      dd b {
        font-size: 26px;
      }
    }
  }

  &__calc {
    display: grid;
    grid-template-columns: minmax(0, 220px) minmax(0, 1fr);
    gap: 12px 20px;
    align-items: center;
    padding: 16px;
    border-radius: var(--bz-R);
    background: var(--bz-surface);
  }

  &__result {
    display: grid;
    gap: 2px;

    p {
      color: var(--bz-muted);
      font-size: 14px;
    }

    b {
      color: var(--bz-ink);
      font-size: 24px;
      line-height: 1.2;
    }

    small {
      color: var(--bz-copper);
      font-size: 14px;

      &.is-ok {
        color: var(--bz-green);
      }
    }
  }

  ul.bz-sort__examples {
    display: grid;
    gap: 4px;
    font-size: 14px;

    li {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      color: var(--bz-muted);

      b {
        color: var(--bz-ink);
        white-space: nowrap;
      }
    }
  }

  &__info {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: 40px;

    article {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 24px;
      border-radius: var(--bz-R);
      border: 1px solid var(--bz-line);

      > .bz-icon {
        color: var(--bz-copper);
      }

      h2 {
        font-size: 19px;
      }

      .bz-link {
        align-self: flex-start;
        margin-top: auto;
      }
    }
  }

  @media (max-width: 989px) {
    &__main {
      grid-template-columns: minmax(0, 1fr);
    }
    &__info {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 576px) {
    &__photo {
      border-radius: 18px;
    }

    &__calc {
      grid-template-columns: minmax(0, 1fr);
    }

    &__tiers .bz-tier dd b {
      font-size: 22px;
    }

    &__panel > .bz-btn {
      width: 100%;
    }

    &__info article {
      padding: 20px 16px;
    }
  }
}

.bz-others {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  a {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding: 8px;
    border-radius: var(--bz-R);
    border: 1px solid var(--bz-line);
    transition: border-color 0.2s;

    &:hover {
      border-color: var(--bz-ink);
    }

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 550 / 311;
      object-fit: cover;
      border-radius: 10px;
    }

    span {
      display: grid;
      min-width: 0;
    }

    b {
      color: var(--bz-ink);
      line-height: 1.25;
    }

    small {
      color: var(--bz-copper);
      font-size: 14px;
    }

    &.is-out small {
      color: var(--bz-muted);
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 989px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
