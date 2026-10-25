<script lang="ts" setup>
import PcIcon from '~/components/redesign/38pchel/PcIcon.vue'
import PcCard from '~/components/redesign/38pchel/PcCard.vue'
import PcQty from '~/components/redesign/38pchel/PcQty.vue'

const route = useRoute()
const shop = usePchelShop()
const ui = usePchelUi()

const product = computed(() => pcFindProduct(String(route.params.id)))
if (!product.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })
const p = computed(() => product.value!)

const picks = ref<Record<string, string>>(pcDefaults(p.value))
watch(p, (v) => (picks.value = pcDefaults(v)))
const price = computed(() => pcPrice(p.value, picks.value))

// Снимок поля медоноса из дневника сезона — рядом с банкой.
const fields: Record<string, string> = { donnik: 'season-29', esparcet: 'season-21', forest: 'season-44', comb: 'season-31' }
const field = computed(() => pcSeason.find((s) => s.img === fields[p.value.id]))
const photo = ref<'main' | 'field'>('main')
watch(p, () => (photo.value = 'main'))

const tab = ref<'about' | 'reviews'>('about')
const siteReviews = computed(() => pcProductReviews.filter((r) => r.product === p.value.id))
const myReviews = computed(() => shop.reviews.value.filter((r) => r.product === p.value.id))
const reviewTotal = computed(() => p.value.reviews + myReviews.value.length)

const form = reactive({ author: '', plus: '', minus: '', text: '', rating: 0, error: '' })
const sendReview = () => {
  if (!form.author.trim() || form.text.trim().length < 10) return (form.error = 'Напишите имя и отзыв — хотя бы пару слов')
  if (!form.rating) return (form.error = 'Поставьте оценку')
  const parts = [form.plus && `Достоинства: ${form.plus}.`, form.minus && `Недостатки: ${form.minus}.`, form.text].filter(Boolean)
  shop.reviews.value = [
    { product: p.value.id, author: form.author.trim(), rating: form.rating, text: parts.join(' '), date: new Date().toLocaleDateString('ru-RU') },
    ...shop.reviews.value,
  ]
  Object.assign(form, { author: '', plus: '', minus: '', text: '', rating: 0, error: '' })
  ui.say('Отзыв добавлен. В концепте он виден только вам')
}

const related = computed(() => {
  const same = pcProducts.filter((x) => x.id !== p.value.id && x.sections.some((s) => p.value.sections.includes(s)))
  const rest = pcProducts.filter((x) => x.id !== p.value.id && !same.includes(x))
  return [...same, ...rest].slice(0, 4)
})

const valueLabel = (o: PcOption, v: PcValue) => {
  if (o.id === 'tare') return v.id === 'glass' ? `стекло +${v.delta} ₽` : 'пластик, 0 ₽'
  if (o.id === 'state') return v.short ?? v.label
  return v.label
}

useSeoMeta({ title: () => `${p.value.title} — 38пчёл | Концепт редизайна` })
</script>

<template>
  <div class="pc-wrap pc-product">
    <nav class="pc-crumbs" aria-label="Навигация">
      <NuxtLink :to="pcPath()">Главная</NuxtLink>
      <span>/</span>
      <NuxtLink :to="{ path: pcPath('/catalog'), query: { s: p.sections[0] } }">{{ pcSections.find((s) => s.id === p.sections[0])?.title }}</NuxtLink>
      <span>/</span>
      <span>{{ p.title }}</span>
    </nav>

    <div class="pc-product__grid">
      <div class="pc-product__media">
        <div class="pc-product__photo" :class="{ 'is-field': photo === 'field' || p.cover }">
          <img v-if="photo === 'main' || !field" :src="pcImg(p.img)" :alt="p.title" width="720" height="720" />
          <template v-else>
            <img :src="pcImg(field.img)" :alt="field.text" width="1080" height="810" />
            <span class="pc-product__caption"><b>{{ field.date }}.</b> {{ field.text }}</span>
          </template>
          <span v-if="p.options.some((o) => o.id === 'state')" class="pc-card__badge">Урожай 2026</span>
        </div>
        <div v-if="field" class="pc-product__thumbs">
          <button type="button" :class="{ 'is-on': photo === 'main' }" aria-label="Фото мёда" @click="photo = 'main'">
            <img :src="pcImg(p.img)" alt="" width="80" height="80" />
          </button>
          <button type="button" :class="{ 'is-on': photo === 'field' }" aria-label="Фото поля" @click="photo = 'field'">
            <img :src="pcImg(field.img)" alt="" width="80" height="80" />
            <span>поле</span>
          </button>
        </div>
      </div>

      <div class="pc-product__info">
        <h1 class="pc-product__title">{{ p.title }}</h1>
        <div class="pc-product__meta">
          <span class="pc-product__stock"><PcIcon name="check" :size="18" /> В наличии</span>
          <button v-if="reviewTotal" type="button" class="pc-product__rev" @click="tab = 'reviews'">
            {{ reviewTotal }} {{ pcPlural(reviewTotal, 'отзыв', 'отзыва', 'отзывов') }}
          </button>
          <span v-if="p.honey" class="pc-product__shade"><i :style="{ background: p.honey.shade }" /> {{ p.honey.taste }}</span>
        </div>
        <p class="pc-product__lead">{{ p.lead }}</p>

        <div class="pc-product__buy">
          <div v-for="o in p.options" :key="o.id" class="pc-opt">
            <span class="pc-opt__title">{{ o.title }}</span>
            <div v-if="o.id === 'w'" class="pc-opt__weights" :class="{ 'pc-opt__weights--n4': o.values.length === 4 }">
              <button
                v-for="v in o.values"
                :key="v.id"
                type="button"
                class="pc-chip"
                :class="{ 'is-on': picks[o.id] === v.id }"
                @click="picks[o.id] = v.id"
              >
                <span>{{ v.label }}</span>
                <small>{{ pcRub(pcPrice(p, { ...picks, [o.id]: v.id })) }}</small>
              </button>
            </div>
            <div v-else-if="o.values.length > 1" class="pc-opt__seg" :class="{ 'pc-opt__seg--wrap': o.values.length > 3 }">
              <button v-for="v in o.values" :key="v.id" type="button" :class="{ 'is-on': picks[o.id] === v.id }" @click="picks[o.id] = v.id">
                {{ valueLabel(o, v) }}
              </button>
            </div>
            <p v-else class="pc-opt__single">{{ o.values[0].label }}</p>
            <p v-if="o.id === 'state' && o.values.length > 1" class="pc-opt__hint">
              {{
                picks.state === 'sat'
                  ? 'Севший — закристаллизовался естественно: густой, его удобно намазывать.'
                  : 'Прозрачный — жидкий, только что откачанный. Со временем мёд садится, это нормально.'
              }}
            </p>
          </div>

          <div class="pc-product__total">
            <div>
              <b>{{ pcRub(price) }}</b>
              <span>{{ p.options.length ? pcPickLabel(p, picks) : p.per }}</span>
            </div>
            <div class="pc-product__btns">
              <PcQty :pid="p.id" :picks="picks" big />
              <button
                type="button"
                class="pc-product__fav"
                :class="{ 'is-on': shop.isFav(p.id) }"
                :aria-label="shop.isFav(p.id) ? 'Убрать из закладок' : 'В закладки'"
                @click="shop.toggleFav(p.id)"
              >
                <PcIcon name="heart" />
              </button>
            </div>
          </div>
          <p v-if="p.note" class="pc-product__note"><PcIcon name="calendar" :size="18" /> {{ p.note }}</p>
        </div>

        <ul class="pc-product__promises">
          <li><PcIcon name="truck" /> <span>По Иркутску привозим сами, обычно в день заказа. Бесплатно от 1000 ₽</span></li>
          <li><PcIcon name="shield" /> <span>Вернём деньги, если вам не понравится наш товар</span></li>
        </ul>
      </div>
    </div>

    <section class="pc-product__tabs">
      <div class="pc-opt__seg pc-product__tabbar" role="tablist">
        <button type="button" role="tab" :aria-selected="tab === 'about'" :class="{ 'is-on': tab === 'about' }" @click="tab = 'about'">Описание</button>
        <button type="button" role="tab" :aria-selected="tab === 'reviews'" :class="{ 'is-on': tab === 'reviews' }" @click="tab = 'reviews'">
          Отзывы · {{ reviewTotal }}
        </button>
      </div>

      <div v-if="tab === 'about'" class="pc-product__about">
        <div class="pc-product__text">
          <p>{{ p.lead }}</p>
          <p v-for="t in p.text" :key="t">{{ t }}</p>
          <p v-if="p.origin" class="pc-origin"><PcIcon name="pin" :size="18" /> {{ p.origin }}</p>
        </div>
      </div>

      <div v-else class="pc-product__reviews">
        <div class="pc-product__list">
          <article v-for="r in myReviews" :key="r.date + r.text" class="pc-review">
            <span class="pc-review__stars"><PcIcon v-for="n in r.rating" :key="n" name="star" :size="16" /></span>
            <p class="pc-review__text">{{ r.text }}</p>
            <p class="pc-review__meta"><b>{{ r.author }}</b> {{ r.date }} <span class="pc-review__src">ваш отзыв · демо</span></p>
          </article>
          <article v-for="r in siteReviews" :key="r.author + r.date" class="pc-review">
            <span class="pc-review__stars"><PcIcon v-for="n in r.rating" :key="n" name="star" :size="16" /></span>
            <p class="pc-review__text">{{ r.text }}</p>
            <p class="pc-review__meta"><b>{{ r.author }}</b> {{ r.date }}</p>
          </article>
          <p v-if="p.reviews > siteReviews.length" class="pc-product__more">
            Ещё {{ p.reviews - siteReviews.length }} {{ pcPlural(p.reviews - siteReviews.length, 'отзыв', 'отзыва', 'отзывов') }} — на
            <a :href="p.source" target="_blank" rel="noopener">странице товара на сайте</a>.
          </p>
          <p v-if="!reviewTotal" class="pc-product__more">Отзывов пока нет — напишите первым.</p>
        </div>

        <form class="pc-panel pc-product__form" @submit.prevent="sendReview">
          <h3>Написать отзыв</h3>
          <div class="pc-stars" role="radiogroup" aria-label="Оценка">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              role="radio"
              :aria-checked="form.rating === n"
              :aria-label="`${n} из 5`"
              :class="{ 'is-on': n <= form.rating }"
              @click="form.rating = n"
            >
              <PcIcon name="star" :size="28" />
            </button>
          </div>
          <label class="pc-field"><span>Имя</span><input v-model="form.author" type="text" autocomplete="name" /></label>
          <label class="pc-field"><span>Достоинства</span><input v-model="form.plus" type="text" /></label>
          <label class="pc-field"><span>Недостатки</span><input v-model="form.minus" type="text" /></label>
          <label class="pc-field"><span>Отзыв</span><textarea v-model="form.text" /></label>
          <p v-if="form.error" class="pc-modal__error">{{ form.error }}</p>
          <button type="submit" class="pc-btn pc-btn--dark">Отправить отзыв</button>
        </form>
      </div>
    </section>

    <section class="pc-section">
      <div class="pc-head"><h2>Ещё с пасеки</h2></div>
      <div class="pc-grid">
        <PcCard v-for="r in related" :key="r.id" :product="r" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.pc-product {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 40px;
    margin-top: 20px;
  }

  &__media {
    position: sticky;
    top: 150px;
    align-self: start;
  }

  &__photo {
    position: relative;
    border-radius: var(--pc-r-panel);
    overflow: hidden;
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--pc-line);

    img {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 1;
      object-fit: contain;
    }

    &.is-field img {
      object-fit: cover;
    }

    .pc-card__badge {
      left: 16px;
      bottom: 16px;
      font-size: 14px;
    }
  }

  &__caption {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
    padding: 10px 14px;
    border-radius: 14px;
    background: #fff;
    font-size: 14px;
  }

  &__photo.is-field .pc-card__badge {
    display: none;
  }

  &__thumbs {
    display: flex;
    gap: 8px;
    margin-top: 10px;

    button {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: inset 0 0 0 1px var(--pc-line);

      &.is-on {
        box-shadow: 0 0 0 2px var(--pc-ink);
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    span {
      position: absolute;
      left: 6px;
      bottom: 6px;
      padding: 0 6px;
      border-radius: 6px;
      background: #fff;
      font-size: 12px;
      font-weight: 600;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__title {
    font-size: clamp(32px, 3.6vw, 48px);
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 16px;
    font-size: 14px;
  }

  &__stock {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--pc-ok);
    font-weight: 600;
  }

  &__rev {
    color: var(--pc-accent);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__shade {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--pc-muted);

    i {
      width: 12px;
      height: 12px;
      border-radius: 4px;
    }
  }

  &__lead {
    font-size: 17px;
  }

  &__buy {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 24px;
    border-radius: var(--pc-r-panel);
    box-shadow: inset 0 0 0 1px var(--pc-line);
  }

  &__total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-top: 18px;
    border-top: 1px solid var(--pc-line);

    > div:first-child {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    > div:first-child b {
      font-family: var(--pc-head);
      font-size: 36px;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }

    > div:first-child span {
      margin-top: 4px;
      color: var(--pc-muted);
      font-size: 14px;
    }
  }

  &__btns {
    display: flex;
    gap: 8px;

    .pc-qty {
      min-width: 200px;
    }
  }

  &__fav {
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    flex: none;
    border-radius: var(--pc-r);
    box-shadow: inset 0 0 0 1px var(--pc-line-strong);
    color: var(--pc-muted);

    &.is-on {
      color: var(--pc-accent);

      path {
        fill: currentColor;
      }
    }
  }

  &__note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--pc-honey-soft);
    font-size: 14px;
  }

  ul.pc-product__promises {
    display: flex;
    flex-direction: column;
    gap: 10px;

    li {
      display: flex;
      align-items: flex-start;
      gap: 10px;

      svg {
        color: var(--pc-accent);
      }
    }
  }

  &__tabs {
    margin-top: 56px;
  }

  &__tabbar {
    display: inline-grid;
    min-width: 320px;
    margin-bottom: 24px;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 760px;
    font-size: 16px;
  }

  &__reviews {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    gap: 24px;
    align-items: start;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__more {
    color: var(--pc-muted);

    a {
      color: var(--pc-accent);
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 12px;

    h3 {
      font-size: 24px;
    }

    .pc-field input,
    .pc-field textarea {
      border-color: var(--pc-line-strong);
    }
  }

  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }

    &__media {
      position: static;
      max-width: 560px;
    }

    &__reviews {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 576px) {
    &__buy {
      padding: 18px 14px;
      border-radius: var(--pc-r-card);
    }

    &__total {
      flex-direction: column;
      align-items: stretch;
    }

    &__btns .pc-qty {
      flex: 1;
      min-width: 0;
    }

    &__tabbar {
      display: grid;
      min-width: 0;
    }
  }
}

.pc-stars {
  display: flex;
  gap: 4px;

  button {
    color: var(--pc-line-strong);

    &.is-on {
      color: var(--pc-honey);

      path {
        fill: currentColor;
      }
    }
  }
}
</style>
