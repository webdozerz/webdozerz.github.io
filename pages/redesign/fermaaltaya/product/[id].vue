<script lang="ts" setup>
import FaIcon from '~/components/redesign/fermaaltaya/FaIcon.vue'
import FaCard from '~/components/redesign/fermaaltaya/FaCard.vue'
import FaShelf from '~/components/redesign/fermaaltaya/FaShelf.vue'
import FaQty from '~/components/redesign/fermaaltaya/FaQty.vue'
import FaStars from '~/components/redesign/fermaaltaya/FaStars.vue'
import FaWeek from '~/components/redesign/fermaaltaya/FaWeek.vue'

const route = useRoute()
const cart = useFermaAltaya()
const ui = useFaUi()
const share = inject<() => void>('fa-share', () => {})

const p = computed(() => faProduct(String(route.params.id)))
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })
const prod = computed(() => p.value!)
const sec = computed(() => faSection(prod.value.sec)!)
useSeoMeta({ title: () => `${prod.value.title} — Ферма Алтая | Концепт редизайна` })

const each = computed(() => faEach(prod.value))
const weighed = computed(() => faWeighed(prod.value))
const facts = computed(() => faFacts(prod.value))
const inCart = computed(() => cart.qtyOf(prod.value.id))
const sale = computed(() => (prod.value.old ? Math.round((1 - prod.value.price / prod.value.old) * 100) : 0))
// описание без повтора состава и ГОСТа — они вынесены отдельными строками
const about = computed(() => prod.value.desc.replace(/Состав:.*$/s, '').trim())

// Оценка: средняя оригинала + голос этого браузера
const my = computed(() => cart.votes.value[prod.value.id] ?? 0)
const votes = computed(() => prod.value.votes + (my.value ? 1 : 0))
const rating = computed(() => (my.value ? (prod.value.rating * prod.value.votes + my.value) / votes.value : prod.value.rating))
const vote = (n: number) => {
  cart.vote(prod.value.id, n)
  ui.toast.value = `Ваша оценка — ${n} из 5. Спасибо!`
}

const tab = ref<'about' | 'reviews'>('about')
const reviews = computed(() => cart.myReviews.value[prod.value.id] ?? [])
const form = reactive({ name: '', email: '', text: '', agree: false })
const sendReview = () => {
  if (!form.text.trim()) return
  cart.addReview(prod.value.id, { name: form.name || 'Покупатель', date: new Date().toISOString().slice(0, 10), text: form.text.trim(), stars: my.value || undefined })
  form.text = ''
  ui.toast.value = 'Отзыв добавлен — в концепте он виден только вам'
}

const buy = () => {
  cart.add(prod.value)
  ui.toast.value = `«${prod.value.title}» — в корзине`
}
const related = computed(() => faInSection(prod.value.sec).filter((x) => x.id !== prod.value.id).slice(0, 10))
watch(
  () => route.params.id,
  () => (tab.value = 'about'),
)
</script>

<template>
  <div class="fa-wrap fa-prod">
    <nav class="fa-crumbs" aria-label="Навигация">
      <NuxtLink :to="faPath()">Главная</NuxtLink>
      <span><NuxtLink :to="faPath('/catalog')">Каталог</NuxtLink></span>
      <span><NuxtLink :to="faPath(`/catalog/${sec.id}`)">{{ sec.title }}</NuxtLink></span>
    </nav>

    <div class="fa-prod__top">
      <figure class="fa-prod__ph">
        <img :src="faBig(prod.img)" :alt="prod.title" width="800" height="800" />
        <span v-if="prod.hit || prod.isNew || sale" class="fa-card__labels">
          <span v-if="sale" class="fa-label fa-label--sale">−{{ sale }}&nbsp;%</span>
          <span v-if="prod.hit" class="fa-label fa-label--hit">Хит</span>
          <span v-if="prod.isNew" class="fa-label fa-label--new">Новинка</span>
        </span>
      </figure>

      <div class="fa-prod__info">
        <h1>{{ prod.title }}</h1>
        <div class="fa-prod__rate">
          <template v-if="votes">
            <FaStars :value="rating" />
            <b>{{ rating.toFixed(1).replace('.', ',') }}</b>
            <button type="button" class="fa-link" @click="tab = 'reviews'">{{ faPlural(votes, 'оценка', 'оценки', 'оценок') }}</button>
          </template>
          <button v-else type="button" class="fa-link" @click="tab = 'reviews'">Оценок пока нет — оцените первым</button>
          <span class="fa-prod__stock"><FaIcon name="check" :size="16" />Готовим под заказ</span>
        </div>

        <div class="fa-prod__buybox">
          <div class="fa-prod__price">
            <div>
              <b>{{ faMoney(prod.price) }}</b>
              <s v-if="prod.old">{{ faMoney(prod.old) }}</s>
              <span>{{ faUnitLabel(prod) }}</span>
            </div>
            <p v-if="weighed" class="fa-prod__est">
              ≈ {{ faRange(each) }} {{ prod.sec === 'ptitsa' ? 'за тушку' : 'за упаковку' }}<small>
                {{ prod.pack }} в упаковке — точную сумму пришлём после сборки, оплата после взвешивания</small
              >
            </p>
            <p v-else-if="prod.pack" class="fa-prod__est"><small>Упаковка {{ prod.pack }}</small></p>
          </div>
          <div class="fa-prod__buy">
            <FaQty v-if="inCart" :p="prod" />
            <button v-else type="button" class="fa-btn fa-btn--main" @click="buy"><FaIcon name="bag" :size="18" />В корзину</button>
            <button
              type="button"
              class="fa-btn fa-btn--line fa-prod__fav"
              :class="{ 'is-on': cart.isFav(prod.id) }"
              :aria-label="cart.isFav(prod.id) ? 'Убрать из избранного' : 'В избранное'"
              @click="cart.toggleFav(prod.id)"
            >
              <FaIcon name="heart" :size="20" :fill="cart.isFav(prod.id)" />
            </button>
            <button type="button" class="fa-btn fa-btn--line fa-prod__share" aria-label="Поделиться" @click="share()">
              <FaIcon name="share" :size="20" />
            </button>
          </div>
          <NuxtLink v-if="inCart" :to="faPath('/cart')" class="fa-prod__tocart">В корзине {{ inCart }} · перейти к оформлению<FaIcon name="arrow" :size="16" /></NuxtLink>
          <p class="fa-prod__bonus"><FaIcon name="coin" :size="18" />+{{ Math.floor(each[0] * FA_BONUS) }} баллов на бонусный счёт после оплаты</p>
        </div>

        <dl class="fa-prod__facts">
          <div v-if="prod.comp"><dt>Состав</dt><dd>{{ prod.comp }}</dd></div>
          <div v-if="facts.kcal"><dt>Энергетическая ценность</dt><dd>{{ facts.kcal }} ккал на 100 г</dd></div>
          <div v-if="facts.term"><dt>Срок годности</dt><dd>{{ facts.term }}</dd></div>
          <div v-if="facts.gost"><dt>Стандарт</dt><dd>{{ facts.gost }}</dd></div>
        </dl>

        <div class="fa-prod__ship">
          <FaWeek compact />
        </div>
      </div>
    </div>

    <section class="fa-prod__tabs">
      <div class="fa-tabs">
        <button type="button" :class="{ 'is-on': tab === 'about' }" @click="tab = 'about'">Описание</button>
        <button type="button" :class="{ 'is-on': tab === 'reviews' }" @click="tab = 'reviews'">Отзывы и оценки</button>
      </div>
      <div v-if="tab === 'about'" class="fa-prod__about">
        <p>{{ about || prod.desc }}</p>
        <p v-if="prod.desc.includes('Состав')" class="fa-prod__full">{{ prod.desc.slice(prod.desc.indexOf('Состав')) }}</p>
      </div>
      <div v-else class="fa-prod__reviews">
        <div class="fa-panel fa-prod__vote">
          <b>{{ my ? 'Ваша оценка' : 'Оцените товар' }}</b>
          <FaStars :value="my" pick :size="28" @pick="vote" />
        </div>
        <article v-for="(r, i) in reviews" :key="i" class="fa-review">
          <div class="fa-review__top">
            <b>{{ r.name }}</b><FaStars v-if="r.stars" :value="r.stars" /><small>{{ faNewsDate(r.date) }}</small>
          </div>
          <p>{{ r.text }}</p>
        </article>
        <p v-if="!reviews.length" class="fa-demo">Отзывов о товаре пока нет. Отзывы о ферме — на <NuxtLink :to="faPath('/otzyvy')" class="fa-link">странице отзывов</NuxtLink>.</p>
        <form class="fa-form fa-prod__form" @submit.prevent="sendReview">
          <b>Написать отзыв</b>
          <div class="fa-prod__form2">
            <label class="fa-field"><span>Имя</span><input v-model="form.name" type="text" autocomplete="name" /></label>
            <label class="fa-field"><span>Эл. почта</span><input v-model="form.email" type="email" autocomplete="email" /></label>
          </div>
          <label class="fa-field"><span>Отзыв</span><textarea v-model="form.text" required /></label>
          <label class="fa-check"><input v-model="form.agree" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
          <button type="submit" class="fa-btn fa-btn--main">Отправить</button>
        </form>
      </div>
    </section>

    <section v-if="related.length" class="fa-section">
      <div class="fa-head">
        <h2>Ещё в разделе «{{ sec.title }}»</h2>
        <NuxtLink :to="faPath(`/catalog/${sec.id}`)" class="fa-head__more">Весь раздел<FaIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <FaShelf :key="prod.id">
        <FaCard v-for="r in related" :key="r.id" :p="r" />
      </FaShelf>
    </section>
  </div>
</template>

<style lang="scss">
.fa-prod {
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
    gap: 40px;
    padding-top: 20px;
  }
  &__ph {
    position: relative;
    align-self: start;
    position: sticky;
    top: 140px;
    aspect-ratio: 1;
    border: 1px solid var(--fa-line);
    border-radius: 20px;
    background: #fff;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .fa-card__labels {
      top: 16px;
      left: 16px;
    }
  }
  &__info {
    display: grid;
    align-content: start;
    gap: 18px;

    h1 {
      font-size: clamp(28px, 3vw, 40px);
    }
  }
  &__rate {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 10px;

    > b {
      color: var(--fa-dark);
    }
  }
  &__stock {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-left: auto;
    color: var(--fa-soft-ink);
    font-weight: 700;
  }
  &__buybox {
    display: grid;
    gap: 14px;
    padding: 22px;
    border-radius: 18px;
    background: var(--fa-surface);
  }
  &__price {
    display: grid;
    gap: 6px;

    > div {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 4px 10px;
    }
    b {
      color: var(--fa-dark);
      font-size: 36px;
      font-weight: 800;
      line-height: 1;
    }
    s {
      color: var(--fa-muted);
      font-size: 18px;
    }
    span {
      color: var(--fa-muted);
    }
  }
  &__est {
    display: grid;
    gap: 2px;
    color: var(--fa-dark);
    font-size: 19px;
    font-weight: 800;

    small {
      color: var(--fa-text);
      font-size: 15px;
      font-weight: 400;
    }
  }
  &__buy {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 48px 48px;
    gap: 8px;

    .fa-qty,
    .fa-btn {
      height: 50px;
    }
  }
  &__fav,
  &__share {
    padding: 0 !important;

    &.is-on {
      color: var(--fa-red);
    }
  }
  &__tocart {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--fa-accent);
    font-weight: 700;
  }
  &__bonus {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--fa-soft-ink);
    font-weight: 700;
  }
  dl.fa-prod__facts {
    display: grid;
    gap: 0;

    > div {
      display: grid;
      grid-template-columns: 210px minmax(0, 1fr);
      gap: 16px;
      padding: 10px 0;
      border-bottom: 1px solid var(--fa-line);
    }
    dt {
      color: var(--fa-muted);
    }
    dd {
      color: var(--fa-dark);
    }
  }
  &__ship {
    padding: 18px;
    border: 1px solid var(--fa-line);
    border-radius: 18px;
  }
  &__tabs {
    display: grid;
    gap: 20px;
    margin-top: 48px;

    > .fa-tabs {
      justify-self: start;
      min-width: 360px;
    }
  }
  &__about {
    display: grid;
    gap: 12px;
    max-width: 860px;
    font-size: 17px;
  }
  &__full {
    color: var(--fa-muted);
    font-size: 15px;
  }
  &__reviews {
    display: grid;
    gap: 14px;
    max-width: 860px;
  }
  &__vote {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 16px;

    b {
      color: var(--fa-dark);
    }
  }
  &__form {
    margin-top: 8px;

    > b {
      color: var(--fa-dark);
      font-size: 20px;
    }
    .fa-btn {
      justify-self: start;
    }
  }
  &__form2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  @media (max-width: 1199px) {
    &__top {
      gap: 28px;
    }
    dl.fa-prod__facts > div {
      grid-template-columns: 160px minmax(0, 1fr);
    }
  }
  @media (max-width: 768px) {
    &__top {
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
      padding-top: 14px;
    }
    &__ph {
      position: relative;
      top: 0;
      width: min(100%, 420px);
      justify-self: center;
    }
    &__tabs > .fa-tabs {
      justify-self: stretch;
      min-width: 0;
    }
  }
  @media (max-width: 576px) {
    &__buybox {
      padding: 16px;
    }
    &__price b {
      font-size: 30px;
    }
    &__stock {
      margin-left: 0;
    }
    dl.fa-prod__facts > div {
      grid-template-columns: minmax(0, 1fr);
      gap: 2px;
    }
    &__ship {
      padding: 14px;
    }
    &__form2 {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
