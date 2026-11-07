<script lang="ts" setup>
import GmIcon from '~/components/redesign/gornyimed/GmIcon.vue'
import GmQty from '~/components/redesign/gornyimed/GmQty.vue'
import GmJarCard from '~/components/redesign/gornyimed/GmJarCard.vue'

const route = useRoute()
const shop = useGornyimedShop()
const ui = useGornyimedUi()

const p = computed(() => gmProduct(String(route.params.id)))
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })
const prod = computed(() => p.value!)
const sort = computed(() => gmSort(prod.value.sort)!)
const packs = computed(() => gmPacksOf(prod.value.sort))
const other = computed(() => gmSorts.find((s) => s.id !== prod.value.sort)!)
const key = computed(() => `p:${prod.value.id}`)
const qty = ref(1)
watch(key, () => (qty.value = 1))
const inCart = computed(() => shop.qtyOf(key.value))
const [sergey] = gmContacts.people

useSeoMeta({ title: () => `${prod.value.title} — ${gmMoney(prod.value.price)} | Пасеки Соловьёвых, концепт` })

const buy = () => {
  shop.add(key.value, qty.value)
  ui.say(`В корзине: ${sort.value.title}, ${prod.value.pack} × ${qty.value}`)
}
const zoom = () => ui.open(packs.value.map((x) => ({ src: x.img, cap: x.title })), packs.value.indexOf(prod.value))
</script>

<template>
  <div class="gm-wrap gm-prod">
    <nav class="gm-crumbs" aria-label="Навигация">
      <NuxtLink :to="gmPath()">Главная</NuxtLink>
      <span><NuxtLink :to="gmPath('/shop')">Мёд</NuxtLink></span>
      <span><NuxtLink :to="gmPath(`/shop?s=${sort.id}`)">{{ sort.title }} 2026</NuxtLink></span>
    </nav>

    <div class="gm-prod__grid">
      <div class="gm-prod__media">
        <button type="button" class="gm-prod__photo" aria-label="Увеличить фото" @click="zoom">
          <img :src="prod.img" :alt="prod.title" width="900" height="1200" />
          <span class="gm-label">Сбор 2026</span>
        </button>
        <div class="gm-prod__thumbs">
          <NuxtLink v-for="x in packs" :key="x.id" :to="gmPath(`/product/${x.id}`)" :class="{ 'is-on': x.id === prod.id }" :aria-label="x.title">
            <img :src="x.img" alt="" loading="lazy" />
          </NuxtLink>
        </div>
      </div>

      <div class="gm-prod__info">
        <h1>{{ prod.title }}</h1>
        <p class="gm-prod__note">{{ sort.note }}</p>

        <div class="gm-prod__packs">
          <span>Фасовка</span>
          <div class="gm-packs">
            <NuxtLink v-for="x in packs" :key="x.id" :to="gmPath(`/product/${x.id}`)" class="gm-packs__btn" :class="{ 'is-on': x.id === prod.id }">
              <b>{{ x.pack }}</b>
              <span>{{ gmMoney(x.price) }}</span>
            </NuxtLink>
          </div>
        </div>

        <div class="gm-prod__buy">
          <div class="gm-prod__price">
            <b>{{ gmMoney(prod.price) }}</b>
            <span>{{ gmMoney(gmPerKg(prod)) }} за кг · {{ prod.tara }}</span>
          </div>
          <div class="gm-prod__btns">
            <GmQty v-model="qty" />
            <button type="button" class="gm-btn gm-btn--main" @click="buy"><GmIcon name="bag" :size="19" />В корзину</button>
          </div>
          <p v-if="inCart" class="gm-prod__in">
            <GmIcon name="check" :size="17" />Уже в корзине: {{ inCart }} шт ·
            <NuxtLink :to="gmPath('/cart')" class="gm-link">оформить заказ</NuxtLink>
          </p>
        </div>

        <ul class="gm-prod__facts">
          <li><GmIcon name="truck" :size="20" /><span>Почта России, Boxberry, OZON, DPD или ТК — до транспортной в Барнауле довезём сами</span></li>
          <li><GmIcon name="card" :size="20" /><span>Оплата наличными или безналично</span></li>
          <li><GmIcon name="cube" :size="20" /><span>Нужно больше? <NuxtLink :to="gmPath('/opt')" class="gm-link">Опт куботейнерами</NuxtLink></span></li>
        </ul>

        <a :href="`tel:${sergey.tel}`" class="gm-prod__call">
          <GmIcon name="phone" :size="20" />
          <span><b>{{ sergey.phone }}</b><small>Сергей Владимирович ответит про сорт и фасовку</small></span>
        </a>
      </div>
    </div>

    <section class="gm-section gm-prod__about">
      <h2>О мёде</h2>
      <div>
        <p v-for="t in sort.text" :key="t">{{ t }}</p>
      </div>
    </section>

    <section class="gm-section">
      <div class="gm-head">
        <div><h2>Попробуйте и {{ other.short }}</h2></div>
        <NuxtLink :to="gmPath('/shop')" class="gm-link">Все товары <GmIcon name="arrow" :size="17" /></NuxtLink>
      </div>
      <div class="gm-prod__other">
        <GmJarCard :sort="other.id" :start="`${other.id}${prod.id.slice(prod.sort.length)}`" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.gm-prod {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 48px;
    margin-top: 24px;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }
  }
  &__media {
    display: grid;
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 12px;
    align-items: start;

    @media (max-width: 989px) {
      max-width: 560px;
    }
    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  &__photo {
    position: relative;
    grid-column: 2;
    display: block;
    width: 100%;
    aspect-ratio: 3 / 4;
    border-radius: 18px;
    overflow: hidden;
    background: var(--gm-pack);
    cursor: zoom-in;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .gm-label {
      position: absolute;
      left: 14px;
      bottom: 14px;
    }
    @media (max-width: 576px) {
      grid-column: 1;
    }
  }
  &__thumbs {
    grid-column: 1;
    grid-row: 1;
    display: grid;
    gap: 10px;

    a {
      display: block;
      aspect-ratio: 3 / 4;
      border-radius: var(--gm-r);
      overflow: hidden;
      border: 2px solid transparent;
      background: var(--gm-pack);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      &.is-on {
        border-color: var(--gm-accent);
      }
    }
    @media (max-width: 576px) {
      grid-row: 2;
      grid-template-columns: repeat(3, 72px);
    }
  }
  &__info {
    display: grid;
    align-content: start;
    gap: 22px;

    h1 {
      font-size: clamp(28px, 3.2vw, 38px);
    }
  }
  &__note {
    margin-top: -10px;
    color: var(--gm-muted);
  }
  &__packs {
    display: grid;
    gap: 8px;
    max-width: 440px;

    > span {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--gm-ink);
    }
  }
  &__buy {
    display: grid;
    gap: 14px;
    padding: 22px;
    border-radius: var(--gm-R);
    background: var(--gm-surface);
  }
  &__price {
    display: grid;

    b {
      font-size: 34px;
      line-height: 1.15;
      color: var(--gm-ink);
    }
    span {
      color: var(--gm-muted);
    }
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .gm-qty {
      background: #fff;
    }
  }
  &__in {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 14px;
    color: var(--gm-green);
    font-weight: 600;
  }
  ul.gm-prod__facts {
    display: grid;
    gap: 10px;

    li {
      display: flex;
      gap: 12px;
      font-size: 14.5px;

      .gm-icon {
        color: var(--gm-accent);
      }
    }
  }
  &__call {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid var(--gm-line);
    border-radius: var(--gm-R);
    color: var(--gm-accent);

    span {
      display: grid;
      line-height: 1.3;
    }
    b {
      font-size: 18px;
      color: var(--gm-ink);
    }
    small {
      font-size: 13px;
      color: var(--gm-muted);
    }
    &:hover {
      border-color: var(--gm-accent);
    }
  }
  &__about {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 48px;

    h2 {
      font-size: clamp(26px, 3vw, 34px);
    }
    div {
      display: grid;
      gap: 12px;
      font-size: 16px;
    }
    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
    }
  }
  &__other {
    max-width: 760px;
  }
}
</style>
