<script lang="ts" setup>
import BkIcon from '~/components/redesign/bukety/BkIcon.vue'
import BkCard from '~/components/redesign/bukety/BkCard.vue'
import BkQty from '~/components/redesign/bukety/BkQty.vue'

const route = useRoute()
const shop = useBuketyShop()
const ui = useBuketyUi()
const { now, eta } = useBuketyClock()

const product = computed(() => bkFind(String(route.params.id)))
if (!product.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден', fatal: true })
const p = computed(() => product.value!)

useSeoMeta({ title: () => `${p.value.title} — ${bkRub(p.value.price)} | Любимые Букеты, концепт редизайна` })

const section = computed(() => bkFindSection(p.value.sec)!)
const group = computed(() => bkGroupOf(p.value.sec)!)
const siblings = computed(() => bkProducts.filter((x) => x.sec === p.value.sec))
const index = computed(() => siblings.value.findIndex((x) => x.id === p.value.id))
const prev = computed(() => siblings.value[index.value - 1])
const next = computed(() => siblings.value[index.value + 1])
// Игрушкам, шарам, сладостям и фруктам советы по уходу за цветами не нужны.
const isFlower = computed(() => !['igrushki', 'shariki', 'sladosti-konfety', 'fruktovye-korziny'].includes(p.value.sec))
const myRating = computed(() =>
  myReviews.value.length ? Math.round(myReviews.value.reduce((n, r) => n + r.rating, 0) / myReviews.value.length) : 0,
)
const similar = computed(() => siblings.value.filter((x) => x.id !== p.value.id).slice(0, 4))

const photo = ref(0)
const pick = ref(p.value.opt?.values[0].label ?? '')
watch(
  () => p.value.id,
  () => {
    photo.value = 0
    pick.value = p.value.opt?.values[0].label ?? ''
  },
)
const price = computed(() => bkPrice(p.value, pick.value))

// Карусель фото на телефоне: точки следуют за прокруткой.
const strip = ref<HTMLElement | null>(null)
const onStrip = () => {
  const el = strip.value
  if (el) photo.value = Math.round(el.scrollLeft / el.clientWidth)
}
const goPhoto = (i: number) => {
  photo.value = i
  strip.value?.scrollTo({ left: i * strip.value.clientWidth, behavior: 'smooth' })
}

// Отзывы: на сайте у товаров отзывов пока нет, форма добавляет отзыв в этот браузер.
const myReviews = computed(() => shop.reviews.value.filter((r) => r.product === p.value.id))
const review = reactive({ author: '', rating: 5, text: '' })
const sendReview = () => {
  if (!review.author.trim() || review.text.trim().length < 5) return ui.say('Напишите имя и пару слов о букете')
  shop.reviews.value = [
    { product: p.value.id, author: review.author.trim(), rating: review.rating, text: review.text.trim(), date: new Date().toISOString() },
    ...shop.reviews.value,
  ]
  review.text = ''
  ui.say('Спасибо! Отзыв виден только вам — это демо')
}
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
</script>

<template>
  <div class="bk-wrap bk-prod">
    <div class="bk-prod__bar">
      <nav class="bk-crumbs">
        <NuxtLink :to="bkPath()">Главная</NuxtLink>
        <span><NuxtLink :to="{ path: bkPath('/catalog'), query: { g: group.id } }">{{ group.title }}</NuxtLink></span>
        <span><NuxtLink :to="{ path: bkPath('/catalog'), query: { s: section.id } }">{{ section.title }}</NuxtLink></span>
      </nav>
      <div class="bk-prod__near">
        <NuxtLink v-if="prev" :to="bkPath(`/product/${prev.id}`)"><BkIcon name="left" :size="18" /> Предыдущий</NuxtLink>
        <NuxtLink v-if="next" :to="bkPath(`/product/${next.id}`)">Следующий <BkIcon name="right" :size="18" /></NuxtLink>
      </div>
    </div>

    <div class="bk-prod__main">
      <div class="bk-gallery">
        <div ref="strip" class="bk-gallery__strip" @scroll.passive="onStrip">
          <img
            v-for="(src, i) in p.photos"
            :key="src"
            :src="src"
            :alt="`${p.title}, фото ${i + 1}`"
            width="1000"
            height="1250"
            :loading="i ? 'lazy' : 'eager'"
            :class="{ 'is-on': photo === i }"
          />
        </div>
        <div v-if="p.photos.length > 1" class="bk-gallery__thumbs">
          <button v-for="(src, i) in p.photos" :key="src" type="button" :class="{ 'is-on': photo === i }" :aria-label="`Фото ${i + 1}`" @click="goPhoto(i)">
            <img :src="i === 0 ? p.img : src" alt="" width="80" height="100" loading="lazy" />
          </button>
        </div>
        <div v-if="p.photos.length > 1" class="bk-gallery__dots">
          <i v-for="(src, i) in p.photos" :key="src" :class="{ 'is-on': photo === i }" />
        </div>
      </div>

      <div class="bk-prod__info">
        <h1>{{ p.title }}</h1>
        <a href="#reviews" class="bk-prod__rev">
          <span class="bk-stars"><BkIcon v-for="n in 5" :key="n" name="star" :size="16" :class="{ 'is-off': n > myRating }" /></span>
          {{ myReviews.length ? `${myReviews.length} ${bkPlural(myReviews.length, 'отзыв', 'отзыва', 'отзывов')}` : 'Отзывов пока нет — напишите первым' }}
        </a>

        <div class="bk-prod__comp">
          <h2>Состав</h2>
          <p>{{ p.comp }}</p>
        </div>

        <div v-if="p.opt" class="bk-prod__opt">
          <h2>{{ p.opt.title }}</h2>
          <div class="bk-seg">
            <button v-for="v in p.opt.values" :key="v.label" type="button" :class="{ 'is-on': pick === v.label }" @click="pick = v.label">
              {{ v.label }}
              <small v-if="bkHasChoice(p)">{{ bkRub(v.price) }}</small>
            </button>
          </div>
        </div>

        <div class="bk-prod__buy">
          <b class="bk-prod__price">{{ bkRub(price) }}</b>
          <BkQty :pid="p.id" :pick="p.opt ? pick : ''" big />
          <button
            type="button"
            class="bk-prod__fav"
            :class="{ 'is-on': shop.isFav(p.id) }"
            :aria-label="shop.isFav(p.id) ? 'Убрать из избранного' : 'В избранное'"
            @click="shop.toggleFav(p.id)"
          >
            <BkIcon name="heart" />
          </button>
        </div>

        <ul class="bk-prod__deliv">
          <li>
            <BkIcon name="truck" />
            <span v-if="now">Закажите сейчас — привезём к <b>{{ eta }}</b>, по Томску бесплатно</span>
            <span v-else>Привезём в течение часа, по Томску бесплатно</span>
          </li>
          <li><BkIcon name="card" /><span>Открытка с вашим текстом и фото вручения — бесплатно</span></li>
          <li v-if="isFlower"><BkIcon name="shield" /><span>Если какого-то цветка нет, флорист заменит его похожим только с вашего согласия</span></li>
        </ul>

        <div v-if="p.occ.length" class="bk-prod__occ">
          <h2>Подойдёт</h2>
          <div>
            <NuxtLink v-for="o in p.occ" :key="o" :to="{ path: bkPath('/catalog'), query: { o } }" class="bk-tag">{{ bkOccTitle(o) }}</NuxtLink>
          </div>
        </div>

        <div v-if="isFlower" class="bk-prod__care">
          <h2>Как ухаживать</h2>
          <ul>
            <li v-for="c in bkCare" :key="c.title">
              <BkIcon :name="c.icon" />
              <span><b>{{ c.title }}</b><small>{{ c.text }}</small></span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <section id="reviews" class="bk-section bk-prod__reviews">
      <div class="bk-head"><h2>Отзывы</h2></div>
      <div class="bk-revgrid">
        <div>
          <ul v-if="myReviews.length" class="bk-reviews">
            <li v-for="r in myReviews" :key="r.date">
              <div>
                <b>{{ r.author }}</b>
                <span class="bk-stars"><BkIcon v-for="n in 5" :key="n" name="star" :size="16" :class="{ 'is-off': n > r.rating }" /></span>
              </div>
              <p>{{ r.text }}</p>
              <small>{{ fmtDate(r.date) }} · <span class="bk-demo">виден только вам</span></small>
            </li>
          </ul>
          <p v-else class="bk-prod__norev">Об этом букете ещё не писали. Отзывы о магазине — на странице <NuxtLink :to="bkPath('/reviews')">«Отзывы»</NuxtLink>.</p>
        </div>
        <form class="bk-panel bk-revform" @submit.prevent="sendReview">
          <h3>Написать отзыв</h3>
          <div class="bk-revform__stars" role="radiogroup" aria-label="Оценка">
            <button v-for="n in 5" :key="n" type="button" :aria-label="`${n} из 5`" :class="{ 'is-on': n <= review.rating }" @click="review.rating = n">
              <BkIcon name="star" :size="26" />
            </button>
          </div>
          <label class="bk-field"><span>Имя</span><input v-model="review.author" type="text" autocomplete="name" /></label>
          <label class="bk-field"><span>Отзыв</span><textarea v-model="review.text" rows="3" /></label>
          <button type="submit" class="bk-btn bk-btn--accent">Отправить</button>
        </form>
      </div>
    </section>

    <section v-if="similar.length" class="bk-section">
      <div class="bk-head">
        <h2>Ещё в разделе «{{ section.title }}»</h2>
        <NuxtLink :to="{ path: bkPath('/catalog'), query: { s: section.id } }">Все {{ section.count }} <BkIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="bk-grid">
        <BkCard v-for="x in similar" :key="x.id" :product="x" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.bk-prod {
  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__near {
    display: flex;
    gap: 16px;
    flex: none;
    padding-top: 20px;
    font-size: 14px;
    font-weight: 700;

    a {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      color: var(--bk-muted);

      &:hover {
        color: var(--bk-accent);
      }
    }
  }

  &__main {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 48px;
    margin-top: 12px;
    align-items: start;
  }

  &__info {
    display: grid;
    gap: 22px;

    h1 {
      font-size: clamp(30px, 3vw, 42px);
    }

    h2 {
      margin-bottom: 10px;
      font-size: 17px;
    }
  }

  &__rev {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: -10px;
    color: var(--bk-muted);
    font-size: 15px;

    &:hover {
      color: var(--bk-accent);
    }
  }

  &__comp {
    padding: 18px 20px;
    border-radius: 18px;
    background: var(--bk-surface);

    p {
      font-size: 17px;
    }
  }

  &__buy {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 56px;
    align-items: center;
    gap: 16px;
  }

  &__price {
    font-size: 36px;
    font-weight: 800;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  &__fav {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 14px;
    border: 1px solid var(--bk-line-strong);
    transition: color 0.15s;

    &:hover,
    &.is-on {
      color: var(--bk-rose);
      border-color: var(--bk-rose);
    }

    &.is-on svg {
      fill: currentColor;
    }
  }

  ul.bk-prod__deliv {
    display: grid;
    gap: 12px;
    padding: 18px 20px;
    border-radius: 18px;
    border: 1px solid var(--bk-line);

    li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      line-height: 1.4;
    }

    svg {
      flex: none;
      color: var(--bk-accent);
    }

    b {
      color: var(--bk-accent);
      font-variant-numeric: tabular-nums;
    }
  }

  &__occ div {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__care ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;

    li {
      display: grid;
      gap: 8px;
      align-content: start;
      padding: 14px;
      border-radius: 16px;
      background: var(--bk-gray);
    }

    svg {
      color: var(--bk-accent);
    }

    span {
      display: grid;
      line-height: 1.3;
    }

    b {
      font-weight: 800;
      font-size: 15px;
    }

    small {
      color: var(--bk-muted);
      font-size: 13px;
    }
  }

  &__norev {
    color: var(--bk-muted);

    a {
      color: var(--bk-accent);
      font-weight: 700;
    }
  }
}

.bk-gallery {
  position: relative;
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 14px;

  &__strip {
    grid-column: 2;
    grid-row: 1;
    display: grid;
    overflow: hidden;
    border-radius: var(--bk-r-card);
    background: var(--bk-gray);

    img {
      grid-area: 1 / 1;
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 5;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.25s;

      &.is-on {
        opacity: 1;
      }
    }
  }

  &__thumbs {
    grid-column: 1;
    grid-row: 1;
    display: grid;
    gap: 10px;
    align-content: start;

    button {
      overflow: hidden;
      border-radius: 12px;
      border: 2px solid transparent;
      transition: border-color 0.15s;

      &.is-on {
        border-color: var(--bk-accent);
      }
    }

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 5;
      object-fit: cover;
    }
  }

  &__dots {
    display: none;
  }
}

@media (max-width: 1199px) {
  .bk-prod {
    &__main {
      gap: 32px;
    }

    &__buy {
      grid-template-columns: minmax(0, 1fr) 56px;

      .bk-prod__price {
        grid-column: 1 / -1;
      }
    }

    &__care ul {
      grid-template-columns: minmax(0, 1fr);

      li {
        grid-template-columns: auto minmax(0, 1fr);
        align-items: center;
        gap: 12px;
      }
    }
  }

  .bk-gallery {
    grid-template-columns: 68px minmax(0, 1fr);
  }
}

@media (max-width: 989px) {
  .bk-prod {
    &__main {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
  }

  .bk-gallery {
    display: block;
    margin: 0 -32px;

    &__strip {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      border-radius: 0;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      img {
        flex: 0 0 100%;
        opacity: 1;
        scroll-snap-align: start;
        max-height: 78vh;
      }
    }

    &__thumbs {
      display: none;
    }

    &__dots {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 14px;
      display: flex;
      justify-content: center;
      gap: 6px;

      i {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        box-shadow: 0 0 0 1px rgba(34, 48, 62, 0.15);

        &.is-on {
          background: #fff;
          width: 22px;
          border-radius: 4px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .bk-gallery {
    margin: 0 -16px;
  }

  .bk-prod__bar {
    align-items: flex-start;
  }

  .bk-prod__near {
    gap: 10px;
  }

  .bk-prod {
    &__price {
      font-size: 30px;
    }

    &__comp,
    ul.bk-prod__deliv {
      padding: 16px;
    }
  }
}
</style>
