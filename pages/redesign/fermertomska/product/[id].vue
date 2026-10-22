<script lang="ts" setup>
import FtCard from '~/components/redesign/fermertomska/FtCard.vue'
import FtQty from '~/components/redesign/fermertomska/FtQty.vue'
import FtWhen from '~/components/redesign/fermertomska/FtWhen.vue'
import FtReviews from '~/components/redesign/fermertomska/FtReviews.vue'
import FtIcon from '~/components/redesign/fermertomska/FtIcon.vue'

const route = useRoute()
const cart = useFermertomskaCart()
const ui = useFermertomskaUi()
const october = useState('ft-october', () => false)

const product = computed(() => ftFindProduct(route.params.id as string))
if (!product.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден', fatal: true })

const family = computed(() => ftFamilyOf(product.value!.family))
const variants = computed(() => ftVariantsOf(family.value.id))
const section = computed(() => ftSectionOf(family.value.section))
const qty = computed(() => cart.qtyOf(product.value!.id))
const photo = ref(0)
watch(() => route.params.id, () => (photo.value = 0))

const similar = computed(() =>
  ftFamilies.filter((f) => f.section === family.value.section && f.id !== family.value.id).concat(
    ftFamilies.filter((f) => f.section !== family.value.section && ftHasTag(f.id, 'hit')),
  ).slice(0, 4),
)

const specs = computed(() => [
  family.value.fat && ['Жирность', family.value.fat],
  ['Фасовка', product.value!.unit === 'кг' ? 'весовой товар, цена за 1 кг' : product.value!.variant],
  family.value.shelf && ['Срок хранения', family.value.shelf],
  ['Производитель', 'ПСПК «Куендатский», с. Первомайское'],
  ['Страна', 'Россия'],
].filter(Boolean) as [string, string][])

useSeoMeta({ title: () => `${product.value?.name} | Куендатское, концепт редизайна` })
</script>

<template>
  <div v-if="product" class="ft-wrap ft-product">
    <nav class="ft-crumbs" aria-label="Навигация">
      <NuxtLink :to="ftPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink :to="ftPath(`/catalog/${section.id}`)">{{ section.title }}</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>{{ family.title }}</span>
    </nav>

    <div class="ft-product__top">
      <div class="ft-product__gallery">
        <div class="ft-product__photo">
          <img :src="product.images[photo] ?? product.images[0]" :alt="product.name" width="480" height="600" />
          <div class="ft-product__tags">
            <span v-if="product.tags.includes('sale')" class="ft-badge">Акция</span>
            <span v-if="product.tags.includes('hit')" class="ft-badge">Хит продаж</span>
            <span v-if="product.tags.includes('new')" class="ft-badge ft-badge--new">Новинка</span>
          </div>
        </div>
        <div v-if="product.images.length > 1" class="ft-product__thumbs">
          <button
            v-for="(src, i) in product.images"
            :key="src"
            type="button"
            :class="{ 'is-on': i === photo }"
            :aria-label="`Фото ${i + 1}`"
            @click="photo = i"
          >
            <img :src="src" alt="" width="72" height="90" loading="lazy" />
          </button>
        </div>
      </div>

      <div class="ft-product__info">
        <h1 class="ft-product__title">
          <span v-if="family.fat" class="ft-card__fat" :style="{ background: family.tone }">{{ family.fat }}</span>
          {{ ftShortTitle(family) }}
        </h1>
        <p class="ft-product__stock">
          <FtIcon name="check" :size="18" />
          В наличии<template v-if="product.stock"> · осталось {{ product.stock }} {{ product.unit }}</template>
        </p>
        <p v-if="family.note" class="ft-badge ft-badge--note ft-product__note">{{ family.note }}</p>

        <div v-if="variants.length > 1" class="ft-product__variants">
          <span>{{ family.section === 'kefir' && family.id !== 'kefir' ? 'Вкус' : 'Фасовка' }}</span>
          <div role="radiogroup" :aria-label="family.title">
            <NuxtLink
              v-for="v in variants"
              :key="v.id"
              :to="ftPath(`/product/${v.id}`)"
              role="radio"
              :aria-checked="v.id === product.id"
              :class="{ 'is-on': v.id === product.id }"
              replace
            >
              <strong>{{ v.variant }}</strong>
              <small>{{ ftPrice(v.price) }}</small>
            </NuxtLink>
          </div>
        </div>

        <div class="ft-product__buybox">
          <div class="ft-product__price">
            <strong>{{ ftPrice(product.price) }}</strong>
            <span v-if="product.unit === 'кг'">за 1 кг · итог уточним при сборке</span>
            <span v-else>за {{ /\d/.test(product.variant) ? product.variant : 'шт' }}</span>
          </div>
          <div class="ft-product__actions">
            <button v-if="!qty" type="button" class="ft-btn ft-product__add" @click="cart.add(product.id)">
              <FtIcon name="bag" :size="20" /> В корзину
            </button>
            <FtQty v-else :product="product" />
            <NuxtLink v-if="qty" :to="ftPath('/cart')" class="ft-btn ft-product__go">Перейти в корзину</NuxtLink>
            <button v-else type="button" class="ft-btn ft-btn--soft ft-product__go" @click="ui.open({ kind: 'oneclick', productId: product.id })">
              Купить в 1 клик
            </button>
            <button
              type="button"
              class="ft-iconbtn ft-product__fav"
              :class="{ 'is-on': cart.isFav(family.id) }"
              :aria-pressed="cart.isFav(family.id)"
              :aria-label="cart.isFav(family.id) ? 'Убрать из избранного' : 'В избранное'"
              @click="cart.toggleFav(family.id)"
            >
              <FtIcon name="heart" />
            </button>
          </div>
          <p v-if="qty" class="ft-product__incart">
            В корзине {{ ftQtyLabel(qty, product.unit) }} на {{ ftPrice(product.price * qty) }}
          </p>
        </div>

        <div class="ft-product__when">
          <FtWhen v-model:october="october" />
          <p>
            Доставка {{ ftPrice(ftDelivery.courier) }}, бесплатно от {{ ftPrice(ftDelivery.freeFrom) }} ·
            самовывоз с Бердской, 29 · оплата картой онлайн
          </p>
        </div>

        <div class="ft-product__about">
          <h2>О продукте</h2>
          <p>{{ family.text }}</p>
          <dl>
            <template v-for="[k, v] in specs" :key="k">
              <dt>{{ k }}</dt>
              <dd>{{ v }}</dd>
            </template>
          </dl>
        </div>
      </div>
    </div>

    <section class="ft-section" aria-labelledby="ft-prod-reviews">
      <div class="ft-head"><h2 id="ft-prod-reviews" class="ft-h2">Отзывы</h2></div>
      <FtReviews :reviews="[]" :store-key="family.id" empty="Отзывов о товаре пока нет — будьте первым." />
    </section>

    <section class="ft-section ft-product__similar" aria-labelledby="ft-prod-similar">
      <div class="ft-head"><h2 id="ft-prod-similar" class="ft-h2">С этим берут</h2></div>
      <div class="ft-grid">
        <FtCard v-for="f in similar" :key="f.id" :family="f" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.ft .ft-product {
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 6fr) minmax(0, 6fr);
    align-items: start;
    gap: 48px;
    padding-top: 8px;
  }

  &__gallery {
    position: sticky;
    top: calc(var(--ft-header) + 20px);
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 14px;
  }

  &__photo {
    position: relative;
    grid-column: 2;
    border-radius: var(--ft-r-lg);
    overflow: hidden;
    background: var(--ft-surface);

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 5;
      object-fit: cover;
    }
  }

  &__tags {
    position: absolute;
    top: 16px;
    left: 16px;
    display: flex;
    gap: 6px;

    .ft-badge {
      background: #fff;
    }
  }

  &__thumbs {
    grid-column: 1;
    grid-row: 1;
    display: grid;
    align-content: start;
    gap: 10px;

    button {
      border-radius: 14px;
      overflow: hidden;
      box-shadow: inset 0 0 0 2px transparent;
      opacity: 0.7;
      transition: opacity 0.15s;

      &.is-on {
        opacity: 1;
        outline: 2px solid var(--ft-accent);
        outline-offset: 2px;
      }

      &:hover {
        opacity: 1;
      }
    }

    img {
      width: 72px;
      height: 90px;
      object-fit: cover;
    }
  }

  &__info {
    display: grid;
    gap: 20px;
  }

  &__title {
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 900;
    line-height: 1.12;

    .ft-card__fat {
      font-size: 0.45em;
      line-height: 1.8;
      padding: 0 10px;
      border-radius: 10px;
      vertical-align: 0.3em;
    }
  }

  &__stock {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: -8px;
    color: var(--ft-accent);
    font-weight: 800;
  }

  &__note {
    justify-self: start;
    height: auto;
    padding: 6px 12px;
    font-size: 14px;
  }

  &__variants {
    display: grid;
    gap: 10px;

    > span {
      color: var(--ft-muted);
      font-weight: 800;
    }

    div {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    a {
      display: grid;
      min-width: 110px;
      padding: 10px 16px;
      border-radius: var(--ft-r);
      background: #fff;
      box-shadow: inset 0 0 0 1px var(--ft-line);
      transition: box-shadow 0.15s;

      small {
        color: var(--ft-muted);
        font-weight: 700;
      }

      &:hover {
        box-shadow: inset 0 0 0 1px var(--ft-ink);
      }

      &.is-on {
        background: var(--ft-accent-soft);
        box-shadow: inset 0 0 0 2px var(--ft-accent);
      }
    }
  }

  &__buybox {
    display: grid;
    gap: 14px;
    padding: 20px;
    border-radius: var(--ft-r-lg);
    background: var(--ft-surface);
  }

  &__price {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 12px;

    strong {
      font-size: 34px;
      font-weight: 900;
      line-height: 1;
      white-space: nowrap;
    }

    span {
      color: var(--ft-muted);
      font-weight: 700;
    }
  }

  &__actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 48px;
    gap: 10px;

    .ft-qty {
      background: #fff;
    }

    .ft-btn--soft {
      background: #fff;
    }
  }

  &__incart {
    color: var(--ft-accent-d);
    font-weight: 800;
  }

  &__fav {
    width: 48px;
    height: 48px;
    border-radius: var(--ft-r);
    background: #fff;

    &.is-on {
      color: #d0306f;

      svg {
        fill: currentColor;
      }
    }
  }

  &__when {
    display: grid;
    gap: 12px;
    padding: 20px;
    border-radius: var(--ft-r-lg);
    box-shadow: inset 0 0 0 1px var(--ft-line);

    > p {
      color: var(--ft-muted);
      font-size: 14px;
    }
  }

  &__about {
    display: grid;
    gap: 12px;

    h2 {
      font-size: 22px;
      font-weight: 900;
    }

    > p {
      color: var(--ft-text);
    }

    dl {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 0;
      margin-top: 4px;
    }

    dt,
    dd {
      padding: 10px 0;
      border-bottom: 1px solid var(--ft-line);
    }

    dt {
      padding-right: 24px;
      color: var(--ft-muted);
    }

    dd {
      font-weight: 700;
    }
  }

  @media (max-width: 1199px) {
    &__top {
      gap: 32px;
    }

    &__actions {
      grid-template-columns: minmax(0, 1fr) 48px;

      .ft-product__go {
        grid-column: 1 / -1;
        grid-row: 2;
      }
    }
  }

  @media (max-width: 989px) {
    &__top {
      grid-template-columns: minmax(0, 1fr);
    }

    &__gallery {
      position: static;
      grid-template-columns: minmax(0, 1fr);
      max-width: 560px;
      width: 100%;
      margin: 0 auto;
    }

    &__photo {
      grid-column: 1;
    }

    // Лента с прокруткой обрезает всё за своими краями: отступ 4 px — место под рамку выбранного фото.
    &__thumbs {
      grid-row: 2;
      display: flex;
      margin: -4px;
      padding: 4px;
      overflow-x: auto;
      scrollbar-width: none;

      button {
        flex-shrink: 0;
      }

      img {
        width: 60px;
        height: 75px;
      }
    }
  }

  @media (max-width: 576px) {
    &__buybox,
    &__when {
      padding: 16px;
    }

    &__price strong {
      font-size: 28px;
    }

    &__variants a {
      min-width: 0;
      flex: 1 1 30%;
    }

    &__about dl {
      grid-template-columns: minmax(0, 1fr);

      dt {
        padding-bottom: 0;
        border: 0;
      }

      dd {
        padding-top: 2px;
      }
    }
  }
}
</style>
