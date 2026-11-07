<script lang="ts" setup>
import GmIcon from '~/components/redesign/gornyimed/GmIcon.vue'
import GmQty from '~/components/redesign/gornyimed/GmQty.vue'
import GmMore from '~/components/redesign/gornyimed/GmMore.vue'

useSeoMeta({ title: 'Мёд 2026 года в банках | Пасеки Соловьёвых, концепт редизайна' })

const route = useRoute()
const router = useRouter()
const shop = useGornyimedShop()
const ui = useGornyimedUi()

const sortId = computed(() => (typeof route.query.s === 'string' ? route.query.s : ''))
const order = computed(() => (typeof route.query.o === 'string' ? route.query.o : 'title'))
const setQuery = (q: Record<string, string>) => router.replace({ query: { ...route.query, ...q } })

const sections = computed(() => [
  { id: '', title: 'Все товары', count: gmProducts.length },
  ...gmSorts.map((s) => ({ id: s.id, title: `${s.title} 2026`, count: gmPacksOf(s.id).length })),
])
const orders = [
  { id: 'title', label: 'По названию' },
  { id: 'price', label: 'Дешевле' },
  { id: 'price-desc', label: 'Дороже' },
  { id: 'kg', label: 'Цена за кг' },
]
const list = computed(() => {
  const l = gmProducts.filter((p) => !sortId.value || p.sort === sortId.value)
  const by = order.value
  return [...l].sort((a, b) => {
    if (by === 'price') return a.price - b.price || a.title.localeCompare(b.title)
    if (by === 'price-desc') return b.price - a.price || a.title.localeCompare(b.title)
    if (by === 'kg') return gmPerKg(a) - gmPerKg(b)
    return a.title.localeCompare(b.title, 'ru')
  })
})
const title = computed(() => (sortId.value ? `Мёд ${gmSort(sortId.value)?.short} 2026` : 'Мёд 2026 года'))

const buy = (id: string) => {
  shop.add(`p:${id}`)
  const p = gmProduct(id)!
  ui.say(`В корзине: ${gmSort(p.sort)?.title}, ${p.pack}`)
}
</script>

<template>
  <div class="gm-wrap gm-shop">
    <nav class="gm-crumbs" aria-label="Навигация">
      <NuxtLink :to="gmPath()">Главная</NuxtLink>
      <span>Мёд</span>
    </nav>
    <h1 class="gm-title">{{ title }}</h1>
    <p class="gm-lead">Алтайский мёд урожая 2026 года с наших пасек. Без сахара и нагрева, в стекле и пищевом пластике.</p>

    <div class="gm-shop__grid">
      <aside class="gm-shop__side">
        <nav class="gm-sects" aria-label="Разделы">
          <NuxtLink v-for="s in sections" :key="s.id" :to="{ query: { ...route.query, s: s.id || undefined } }" :class="{ 'is-on': s.id === sortId }">
            <span>{{ s.title }}</span><small>{{ s.count }}</small>
          </NuxtLink>
          <NuxtLink :to="gmPath('/opt')"><span>Мёд в куботейнерах — опт</span><small>4</small></NuxtLink>
          <a href="#more"><span>Соты, перга, прополис и другое</span><small>20</small></a>
        </nav>
        <div class="gm-shop__note">
          <GmIcon name="truck" :size="20" />
          <p>Отправим Почтой, Boxberry, OZON, DPD или транспортной компанией. До ТК в Барнауле довезём за свой счёт.</p>
        </div>
      </aside>

      <div>
        <div class="gm-sortbar">
          <span class="gm-sortbar__count">{{ list.length }} {{ gmPlural(list.length, 'товар', 'товара', 'товаров') }}</span>
          <div class="gm-sortbar__seg" role="radiogroup" aria-label="Сортировка">
            <GmIcon name="sort" :size="18" />
            <button
              v-for="o in orders"
              :key="o.id"
              type="button"
              role="radio"
              :aria-checked="order === o.id"
              :class="{ 'is-on': order === o.id }"
              @click="setQuery({ o: o.id })"
            >
              {{ o.label }}
            </button>
          </div>
        </div>

        <ul class="gm-tiles">
          <li v-for="p in list" :key="p.id" class="gm-tile">
            <NuxtLink :to="gmPath(`/product/${p.id}`)" class="gm-tile__photo">
              <img :src="p.img" :alt="p.title" width="900" height="1200" loading="lazy" />
              <span class="gm-label">Сбор 2026</span>
            </NuxtLink>
            <div class="gm-tile__body">
              <NuxtLink :to="gmPath(`/product/${p.id}`)" class="gm-tile__name">{{ gmSort(p.sort)?.title }} · {{ p.pack }}</NuxtLink>
              <span class="gm-tile__tara">{{ p.tara }}</span>
              <div class="gm-tile__price">
                <b>{{ gmMoney(p.price) }}</b>
                <span>{{ gmMoney(gmPerKg(p)) }}/кг</span>
              </div>
              <GmQty
                v-if="shop.qtyOf(`p:${p.id}`)"
                :model-value="shop.qtyOf(`p:${p.id}`)"
                :min="0"
                class="gm-tile__qty"
                @update:model-value="shop.setQty(`p:${p.id}`, $event)"
              />
              <button v-else type="button" class="gm-btn gm-btn--main gm-btn--wide" @click="buy(p.id)"><GmIcon name="bag" :size="19" />В корзину</button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <section id="more" class="gm-section">
      <div class="gm-head">
        <div>
          <h2>Ещё с пасеки</h2>
          <p>Эти позиции бывают не всегда — наличие и цену подскажет Сергей Владимирович.</p>
        </div>
      </div>
      <GmMore />
    </section>
  </div>
</template>

<style lang="scss">
.gm-shop {
  &__grid {
    display: grid;
    grid-template-columns: 270px minmax(0, 1fr);
    gap: 32px;
    align-items: start;
    margin-top: 32px;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
    }
  }
  &__side {
    position: sticky;
    top: 146px;
    display: grid;
    gap: 16px;

    @media (max-width: 989px) {
      position: static;
    }
  }
  &__note {
    display: flex;
    gap: 10px;
    padding: 14px;
    border-radius: var(--gm-R);
    background: var(--gm-surface);
    font-size: 13.5px;
    color: var(--gm-muted);

    .gm-icon {
      color: var(--gm-accent);
    }
    @media (max-width: 989px) {
      display: none;
    }
  }
}
.gm-sects {
  display: grid;
  gap: 4px;

  a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--gm-r);
    font-weight: 600;
    color: var(--gm-ink);
    line-height: 1.3;

    small {
      flex: none;
      min-width: 26px;
      padding: 1px 7px;
      border-radius: 10px;
      background: var(--gm-surface);
      font-size: 12.5px;
      text-align: center;
      color: var(--gm-muted);
    }
    &:hover {
      background: var(--gm-surface);
    }
    &.is-on {
      background: var(--gm-soft);
      color: var(--gm-accent);

      small {
        background: #fff;
      }
    }
  }
  @media (max-width: 989px) {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: thin;
    scrollbar-color: #d8cfc4 transparent;

    a {
      flex: none;
      white-space: nowrap;
      background: var(--gm-surface);
    }
  }
}
.gm-sortbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;

  &__count {
    font-weight: 600;
    color: var(--gm-muted);
  }
  &__seg {
    display: flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    overflow-x: auto;

    .gm-icon {
      margin-right: 4px;
      color: var(--gm-muted);
    }
    button {
      flex: none;
      padding: 7px 12px;
      border-radius: var(--gm-r);
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      color: var(--gm-text);

      &:hover {
        background: var(--gm-surface);
      }
      &.is-on {
        background: var(--gm-soft);
        color: var(--gm-accent);
      }
    }
  }
}
ul.gm-tiles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 989px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
}
.gm-tile {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--gm-line);
  border-radius: var(--gm-R);
  overflow: hidden;
  background: #fff;

  &__photo {
    position: relative;
    display: block;
    aspect-ratio: 3 / 4;
    background: var(--gm-pack);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }
    &:hover img {
      transform: scale(1.03);
    }
    .gm-label {
      position: absolute;
      left: 10px;
      bottom: 10px;
    }
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    padding: 14px;
  }
  &__name {
    font-family: 'Lora', Georgia, serif;
    font-weight: 700;
    font-size: 18px;
    color: var(--gm-ink);
    line-height: 1.25;

    &:hover {
      color: var(--gm-accent);
    }
  }
  &__tara {
    font-size: 13.5px;
    color: var(--gm-muted);
  }
  &__price {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 2px 10px;
    margin: auto 0 8px;
    padding-top: 6px;

    b {
      font-size: 21px;
      color: var(--gm-ink);
    }
    span {
      font-size: 13px;
      color: var(--gm-green);
      font-weight: 600;
    }
  }
  .gm-qty.gm-tile__qty {
    width: 100%;
    justify-content: space-between;
  }
  @media (max-width: 576px) {
    &__body {
      padding: 10px;
    }
    &__name {
      font-size: 16px;
    }
    &__price b {
      font-size: 18px;
    }
    .gm-btn {
      padding: 0 10px;
      font-size: 14px;
    }
  }
  @media (max-width: 375px) {
    .gm-btn .gm-icon {
      display: none;
    }
  }
}
</style>
