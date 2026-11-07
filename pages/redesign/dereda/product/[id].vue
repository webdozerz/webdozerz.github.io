<script lang="ts" setup>
import DrIcon from '~/components/redesign/dereda/DrIcon.vue'
import DrQty from '~/components/redesign/dereda/DrQty.vue'
import DrShelf from '~/components/redesign/dereda/DrShelf.vue'
import DrTickets from '~/components/redesign/dereda/DrTickets.vue'

const route = useRoute()
const shop = useDeredaShop()
const ui = useDrUi()

const p = computed(() => drProduct(String(route.params.id)))
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })
const prod = computed(() => p.value!)
const sec = computed(() => drSection(prod.value.sec))
const farmer = computed(() => drFarmer(prod.value.farmer))

const v = ref(drFirstOn(prod.value))
watch(
  () => route.params.id,
  () => (v.value = drFirstOn(prod.value)),
)
const price = computed(() => drPriceOf(prod.value, v.value))
const old = computed(() => drOldOf(prod.value, v.value))
const off = computed(() => drDiscount(prod.value, v.value))
const on = computed(() => drAvailable(prod.value, v.value))
const qty = computed(() => shop.qtyOf(prod.value, v.value))
const weighed = computed(() => drWeighed(prod.value) || prod.value.byKg)
const stockText = computed(() => {
  if (!on.value) return 'Нет в наличии — можно оставить предзаказ'
  if (prod.value.stock === 'part') return `В наличии, кроме: ${prod.value.stockNote.replace(/^нет\s*/, '')}`
  return 'В наличии'
})
// описание из выборки обрезано на ~150 знаках — заканчиваем на последней целой фразе или многоточием
const fullNote = (t: string) => {
  const s = t.trim().replace(/[,\s]+$/, '')
  if (!s || /[.!?)»]$/.test(s)) return s
  const cut = s.lastIndexOf('. ')
  return cut > 60 ? s.slice(0, cut + 1) : `${s.slice(0, s.lastIndexOf(' '))}…`
}
const desc = computed(() => fullNote(prod.value.note).replace(/(Состав|Упаковка|Вес продукта|Срок годности|Условия хранения):/g, '\n$1:').trim())

const add = () => {
  shop.add(prod.value, v.value)
  ui.toast.value = `В корзине: ${drShort(prod.value.title)}`
  ui.toastCart.value = true
}

// Лайтбокс фото: в разметке оригинала фото 1000 px открывается по клику
const zoom = ref(false)
const bigImg = computed(() => prod.value.img.replace('/large_', '/'))

// Отзывы: опубликованные с сайта + свои (на модерации, хранятся в браузере)
const published = computed(() => drReviews.filter((r) => prod.value.title.startsWith(r.match)))
const mine = computed(() => shop.reviews.value[prod.value.id] ?? [])
const rv = reactive({ name: '', email: '', text: '', open: false, sent: false })
const sendReview = () => {
  if (!rv.name.trim() || !rv.email.includes('@') || rv.text.trim().length < 3) return
  shop.addReview(prod.value.id, { name: rv.name.trim(), text: rv.text.trim(), date: new Date().toLocaleDateString('ru-RU') })
  rv.text = ''
  rv.open = false
  rv.sent = true
}

const fromFarmer = computed(() => (farmer.value ? drFarmerProducts(farmer.value.id).filter((x) => x.id !== prod.value.id) : []))
const fromSec = computed(() => drSecProducts(prod.value.sec).filter((x) => x.id !== prod.value.id && x.farmer !== prod.value.farmer))

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') zoom.value = false
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

useSeoMeta({ title: () => `${prod.value.title} — Дереда | Концепт редизайна` })
</script>

<template>
  <div class="dr-wrap dr-page dr-prod">
    <nav class="dr-crumbs" aria-label="Навигация">
      <NuxtLink :to="drPath('/')">Главная</NuxtLink>
      <span><NuxtLink :to="drPath('/catalog')">Каталог</NuxtLink></span>
      <span v-if="sec"><NuxtLink :to="drPath(`/catalog/${sec.id}`)">{{ sec.title }}</NuxtLink></span>
      <span v-if="prod.sub"><NuxtLink :to="{ path: drPath(`/catalog/${prod.sec}`), query: { sub: prod.sub } }">{{ prod.sub }}</NuxtLink></span>
    </nav>

    <div class="dr-prod__top">
      <div class="dr-prod__media">
        <button type="button" class="dr-prod__photo" aria-label="Увеличить фото" @click="zoom = true">
          <img :src="prod.img" :alt="prod.title" width="480" height="480" />
          <span class="dr-prod__zoom"><DrIcon name="search" :size="20" /></span>
        </button>
        <div class="dr-prod__marks">
          <span v-if="off" class="dr-mark dr-mark--sale">−{{ off }}&nbsp;%</span>
          <span v-if="prod.isNew" class="dr-mark dr-mark--new">Новинка</span>
        </div>
      </div>

      <div class="dr-prod__info">
        <NuxtLink v-if="farmer" :to="{ path: drPath('/catalog'), query: { farmer: farmer.id } }" class="dr-prod__farmer">
          <DrIcon name="farmer" :size="22" />
          <span>
            <small>Делает</small>
            <b>{{ farmer.name }}</b>
          </span>
          <DrIcon name="right" :size="18" />
        </NuxtLink>
        <h1>{{ prod.title }}</h1>
        <p class="dr-prod__stock" :class="{ 'is-out': !on }">
          <DrIcon :name="on ? 'check' : 'clock'" :size="18" />{{ stockText }}
        </p>

        <div v-if="prod.variants.length" class="dr-prod__variants">
          <span>Фасовка</span>
          <div role="group" aria-label="Фасовка">
            <button v-for="(x, i) in prod.variants" :key="x.t" type="button" :class="{ 'is-on': v === i, 'is-off': !x.on }" @click="v = i">
              <b>{{ x.t }}</b>
              <small>{{ drMoney(x.price) }}</small>
            </button>
          </div>
        </div>
        <p v-else-if="prod.pack" class="dr-prod__pack">Фасовка: {{ prod.pack }}</p>

        <div class="dr-prod__buy">
          <div class="dr-prod__price">
            <b>{{ drMoney(price) }}</b>
            <s v-if="old">{{ drMoney(old) }}</s>
          </div>
          <div class="dr-prod__btns">
            <DrQty v-if="qty" :qty="qty" big @inc="shop.inc(prod, v)" @dec="shop.dec(prod, v)" @set="shop.setQty(prod, v, $event)" />
            <button v-else-if="on" type="button" class="dr-btn dr-btn--main dr-btn--big" @click="add"><DrIcon name="basket" :size="20" />В корзину</button>
            <button v-else type="button" class="dr-btn dr-btn--main dr-btn--big" @click="ui.preorder.value = prod.id">Оставить предзаказ</button>
            <button
              type="button"
              class="dr-btn dr-btn--line dr-btn--big dr-prod__fav"
              :class="{ 'is-on': shop.isFav(prod.id) }"
              :aria-label="shop.isFav(prod.id) ? 'Убрать из избранного' : 'В избранное'"
              @click="shop.toggleFav(prod.id)"
            >
              <DrIcon name="heart" :size="22" :fill="shop.isFav(prod.id)" />
            </button>
          </div>
          <NuxtLink v-if="qty" :to="drPath('/cart')" class="dr-prod__tocart">В корзине {{ qty }} шт — перейти к оформлению</NuxtLink>
          <p v-if="weighed" class="dr-prod__weight">
            <DrIcon name="info" :size="18" />Весовой товар: итоговая сумма заказа после взвешивания может измениться в большую или меньшую сторону.
          </p>
        </div>

        <div class="dr-prod__deliv">
          <h3>Когда привезём</h3>
          <DrTickets :n="2" />
          <p>
            Фермеры делают продукцию под заказ и привозят в день доставки. Бесплатно — от 1 500 ₽ в Академгородке, от 2 000 ₽ в центральных районах.
            <NuxtLink :to="drPath('/dostavka')">Все зоны</NuxtLink>
          </p>
          <p><DrIcon name="cash" :size="18" />Оплата наличными или переводом при получении</p>
        </div>
      </div>
    </div>

    <div class="dr-prod__more">
      <section v-if="desc" class="dr-prod__desc">
        <h2>Описание</h2>
        <p>{{ desc }}</p>
      </section>
      <section class="dr-prod__reviews" :class="{ 'is-wide': !desc }">
        <div class="dr-prod__revhead">
          <h2>Отзывы</h2>
          <button v-if="!rv.open" type="button" class="dr-btn dr-btn--line" @click="rv.open = true; rv.sent = false">Написать отзыв</button>
        </div>
        <p v-if="rv.sent" class="dr-prod__sent"><DrIcon name="check" :size="18" />Спасибо! Перед публикацией отзывы проходят модерацию — в концепте он виден только вам.</p>
        <form v-if="rv.open" class="dr-form dr-prod__revform" @submit.prevent="sendReview">
          <div class="dr-prod__revrow">
            <label class="dr-field"><span>Имя *</span><input v-model="rv.name" autocomplete="name" required /></label>
            <label class="dr-field"><span>Email *</span><input v-model="rv.email" type="email" autocomplete="email" required /></label>
          </div>
          <label class="dr-field"><span>Отзыв *</span><textarea v-model="rv.text" rows="4" required /></label>
          <p class="dr-muted">Перед публикацией отзывы проходят модерацию.</p>
          <div class="dr-prod__revbtns">
            <button type="submit" class="dr-btn dr-btn--main">Отправить</button>
            <button type="button" class="dr-btn dr-btn--line" @click="rv.open = false">Отмена</button>
          </div>
        </form>
        <ul v-if="mine.length || published.length" class="dr-prod__revlist">
          <li v-for="(r, i) in mine" :key="`m${i}`">
            <b>{{ r.name }}</b><small>{{ r.date }} · на модерации</small>
            <p>{{ r.text }}</p>
          </li>
          <li v-for="r in published" :key="r.name">
            <b>{{ r.name }}</b><small>{{ r.date }}</small>
            <p>{{ r.text }}</p>
          </li>
        </ul>
        <p v-else-if="!rv.open" class="dr-muted">Отзывов пока нет — расскажите, как вам {{ farmer ? `товар от ${farmer.name}` : 'этот товар' }}.</p>
      </section>
    </div>

    <section v-if="fromFarmer.length" class="dr-sec">
      <div class="dr-sechead">
        <h2>Ещё от {{ farmer!.id === 'dereda' ? 'Дереды' : farmer!.name }}</h2>
        <NuxtLink :to="{ path: drPath('/catalog'), query: { farmer: farmer!.id } }">Все товары фермера<DrIcon name="right" :size="18" /></NuxtLink>
      </div>
      <DrShelf :items="fromFarmer" />
    </section>
    <section v-if="fromSec.length" class="dr-sec">
      <div class="dr-sechead">
        <h2>{{ sec?.title }}: другие фермеры</h2>
        <NuxtLink :to="drPath(`/catalog/${prod.sec}`)">Весь раздел<DrIcon name="right" :size="18" /></NuxtLink>
      </div>
      <DrShelf :items="fromSec" />
    </section>

    <div v-if="zoom" class="dr-lightbox" role="dialog" aria-modal="true" aria-label="Фото товара" @click="zoom = false">
      <img :src="bigImg" :alt="prod.title" />
      <button type="button" aria-label="Закрыть"><DrIcon name="close" :size="26" /></button>
    </div>
  </div>
</template>

<style lang="scss">
.dr-prod {
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 48px;
    align-items: start;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
  }

  &__media {
    position: sticky;
    top: calc(var(--dr-stuck, 120px) + 16px);

    @media (max-width: 989px) {
      position: relative;
      top: 0;
    }
  }

  &__photo {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    padding: 0;
    border: 0;
    border-radius: var(--dr-R);
    background: var(--dr-surface);
    cursor: zoom-in;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 989px) {
      max-width: 560px;
    }
  }

  &__zoom {
    position: absolute;
    right: 14px;
    bottom: 14px;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.92);
    color: var(--dr-dark);
  }

  &__marks {
    position: absolute;
    top: 14px;
    left: 14px;
    display: flex;
    gap: 6px;
  }

  &__info {
    display: grid;
    gap: 18px;
  }

  &__farmer {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    justify-self: start;
    padding: 8px 14px 8px 10px;
    border-radius: 14px;
    background: var(--dr-surface);
    color: var(--dr-brown);

    > span {
      display: grid;
      line-height: 1.2;
    }

    small {
      color: var(--dr-muted);
      font-size: 13px;
    }

    &:hover {
      background: var(--dr-accent-soft);
    }
  }

  &__stock {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--dr-green);
    font-weight: 600;

    &.is-out {
      color: var(--dr-muted);
    }
  }

  &__variants {
    display: grid;
    gap: 8px;

    > span {
      font-weight: 600;
    }

    div {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    button {
      display: grid;
      min-width: 96px;
      padding: 8px 14px;
      border: 1px solid var(--dr-line);
      border-radius: var(--dr-r);
      background: #fff;
      color: var(--dr-text);
      text-align: left;
      cursor: pointer;

      small {
        color: var(--dr-muted);
      }

      &.is-on {
        border-color: var(--dr-brown);
        box-shadow: inset 0 0 0 1px var(--dr-brown);
      }

      &.is-off b {
        color: var(--dr-muted);
        text-decoration: line-through;
      }
    }
  }

  &__buy {
    display: grid;
    gap: 12px;
    padding: 22px;
    border-radius: var(--dr-R);
    background: var(--dr-surface);
  }

  &__price {
    display: flex;
    align-items: baseline;
    gap: 12px;

    b {
      font-size: 32px;
      line-height: 1.1;
    }

    s {
      color: var(--dr-muted);
      font-size: 18px;
    }
  }

  &__btns {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 54px;
    gap: 10px;

    .dr-qty {
      background: #fff;
    }
  }

  &__fav {
    padding: 0;

    &.is-on {
      color: var(--dr-accent);
    }
  }

  &__tocart {
    color: var(--dr-green);
    font-weight: 600;
  }

  &__weight {
    display: flex;
    gap: 8px;
    color: var(--dr-muted);
    font-size: 14px;

    svg {
      flex: none;
      margin-top: 2px;
    }
  }

  &__deliv {
    display: grid;
    gap: 12px;

    p {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 6px;
      color: var(--dr-muted);
      font-size: 15px;
    }

    a {
      color: var(--dr-accent);
      font-weight: 600;
    }
  }

  &__more {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 48px;
    margin-top: 48px;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 36px;
    }
  }

  &__desc {
    display: grid;
    align-content: start;
    gap: 14px;

    p {
      font-size: 17px;
      white-space: pre-line;
    }
  }

  &__reviews {
    display: grid;
    align-content: start;
    gap: 16px;

    &.is-wide {
      grid-column: 1 / -1;
    }
  }

  &__revhead {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__sent {
    display: flex;
    gap: 8px;
    padding: 12px 14px;
    border-radius: var(--dr-r);
    background: var(--dr-green-soft);
    color: var(--dr-green);

    svg {
      flex: none;
      margin-top: 3px;
    }
  }

  &__revrow {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__revbtns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  ul.dr-prod__revlist {
    display: grid;
    gap: 12px;

    li {
      display: grid;
      gap: 2px;
      padding: 16px 18px;
      border-radius: var(--dr-r);
      background: var(--dr-surface);
    }

    small {
      color: var(--dr-muted);
    }

    p {
      margin-top: 6px;
    }
  }
}

.dr-lightbox {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(20, 14, 12, 0.88);
  cursor: zoom-out;

  img {
    max-width: min(1000px, 100%);
    max-height: calc(100vh - 48px);
    border-radius: 14px;
  }

  button {
    position: absolute;
    top: 16px;
    right: 16px;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: #fff;
    color: var(--dr-dark);
    cursor: pointer;
  }
}
</style>
