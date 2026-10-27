<script lang="ts" setup>
import PlBuy from '~/components/redesign/papinalavka/PlBuy.vue'
import PlCard from '~/components/redesign/papinalavka/PlCard.vue'
import PlIcon from '~/components/redesign/papinalavka/PlIcon.vue'
import { plTexts } from '~/utils/papinalavkaText'

const route = useRoute()
const p = computed(() => plFind(String(route.params.id)))
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден', fatal: true })

const ui = usePapinalavkaUi()
const product = computed(() => p.value!)
const sec = computed(() => plSection(product.value.sec))
const info = computed(() => plTexts[product.value.id] ?? { p: [], f: [], r: [] })
const related = computed(() => plInSection(product.value.sec).filter((x) => x.id !== product.value.id).slice(0, 4))
const photo = computed(() => plImg(product.value.big ?? product.value.img))

// Факты карточки оригинала: «КБЖУ на 100 г…», «Срок и условия хранения…» -> подпись и значение.
const facts = computed(() =>
  info.value.f.map((f) => {
    const i = f.indexOf(':')
    return i > 0 ? { k: f.slice(0, i), v: f.slice(i + 1).trim() } : { k: '', v: f }
  }),
)

// Отзывы и вопросы концепта живут в браузере: так владелец видит, что форма работает, но ничего не публикуется.
const myReviews = useState<Record<number, { name: string; text: string; date: string }[]>>('pl-my-reviews', () => ({}))
const form = ref<'review' | 'question' | ''>('')
const draft = ref({ name: '', text: '', phone: '' })
const send = () => {
  if (!draft.value.text.trim()) return
  if (form.value === 'review') {
    const list = myReviews.value[product.value.id] ?? []
    myReviews.value = {
      ...myReviews.value,
      [product.value.id]: [{ name: draft.value.name || 'Без имени', text: draft.value.text, date: 'только что' }, ...list],
    }
    ui.say('Отзыв добавлен — в концепте он виден только вам')
  } else {
    ui.say('Вопрос сохранён. На сайте его получил бы оператор')
  }
  draft.value = { name: '', text: '', phone: '' }
  form.value = ''
}
const reviews = computed(() => [...(myReviews.value[product.value.id] ?? []), ...info.value.r])

useSeoMeta({ title: () => `${product.value.name} — Папина лавка | Концепт редизайна` })
</script>

<template>
  <div class="pl-wrap pl-prod">
    <nav class="pl-crumbs" aria-label="Навигация">
      <NuxtLink :to="plPath()">Главная</NuxtLink>
      <NuxtLink :to="plSectionPath()">Каталог</NuxtLink>
      <NuxtLink v-if="sec" :to="plSectionPath(sec.id)">{{ sec.name }}</NuxtLink>
    </nav>

    <div class="pl-prod__top">
      <div class="pl-prod__photo">
        <img :src="photo" :alt="product.name" width="800" height="533" />
        <span v-if="product.label" class="pl-label" :class="`pl-label--${product.label}`">{{ plLabels[product.label] }}</span>
      </div>

      <div class="pl-prod__info">
        <p v-if="product.kicker" class="pl-prod__kicker">{{ product.kicker }}</p>
        <h1>{{ product.name }}</h1>
        <p v-if="product.note" class="pl-prod__note">{{ product.note }}</p>

        <div class="pl-prod__buy">
          <div class="pl-tag pl-prod__tag">
            <s v-if="product.old">{{ plFmt(product.old) }}</s>
            <b>{{ plFmt(product.price) }}</b>
            <small>{{ product.unit }}</small>
          </div>
          <PlBuy :product="product" big />
        </div>

        <div class="pl-prod__when">
          <template v-if="product.stock">
            <p class="pl-when is-stock"><PlIcon name="check" :size="18" /><span>Есть в наличии</span></p>
            <p>Экспресс-доставка за 2–3 часа (кроме четверга) или самовывоз сегодня из 7 офисов.</p>
          </template>
          <template v-else-if="product.next">
            <p class="pl-when"><PlIcon name="calendar" :size="18" /><span>Ближайшая поставка {{ plWeekdayAcc(product.next) }}, {{ plDay(product.next) }}</span></p>
            <p>
              Привозим под заказ. Заказ {{ plDeadlineLabel(product.next) }} —
              <NuxtLink :to="{ path: plSectionPath(), query: { date: product.next } }">что ещё едет этой поставкой</NuxtLink>
            </p>
          </template>
          <p v-else class="pl-when"><PlIcon name="calendar" :size="18" /><span>Под заказ, дату поставки подскажет оператор</span></p>
          <p v-if="plByWeight(product)" class="pl-prod__weigh">
            Цена за килограмм, а продаём поштучно — точную сумму назовём после взвешивания.
          </p>
        </div>

        <dl v-if="facts.length" class="pl-prod__facts">
          <div v-for="f in facts" :key="f.k + f.v">
            <dt v-if="f.k">{{ f.k }}</dt>
            <dd>{{ f.v }}</dd>
          </div>
        </dl>

        <div class="pl-prod__ask">
          <button type="button" class="pl-btn pl-btn--line pl-btn--sm" @click="form = form === 'question' ? '' : 'question'">
            <PlIcon name="question" :size="18" />Задать вопрос
          </button>
          <a :href="plTel(plContacts.phone)" class="pl-prod__call"><PlIcon name="phone" :size="18" />{{ plContacts.phone }}</a>
        </div>
        <form v-if="form === 'question'" class="pl-prod__form" @submit.prevent="send">
          <label class="pl-field"><span>Телефон или почта для ответа</span><input v-model="draft.phone" type="text" /></label>
          <label class="pl-field"><span>Вопрос</span><textarea v-model="draft.text" required /></label>
          <div><button type="submit" class="pl-btn pl-btn--main">Отправить</button> <span class="pl-demo">демо</span></div>
        </form>
      </div>
    </div>

    <div class="pl-prod__bottom">
      <section v-if="info.p.length" class="pl-prod__text">
        <h2>О продукте</h2>
        <p v-for="(t, i) in info.p" :key="i">{{ t }}</p>
      </section>

      <section class="pl-prod__reviews">
        <div class="pl-prod__rhead">
          <h2>Отзывы <small v-if="reviews.length">{{ reviews.length }}</small></h2>
          <button type="button" class="pl-btn pl-btn--line pl-btn--sm" @click="form = form === 'review' ? '' : 'review'">
            <PlIcon name="edit" :size="18" />Добавить отзыв
          </button>
        </div>
        <form v-if="form === 'review'" class="pl-prod__form" @submit.prevent="send">
          <label class="pl-field"><span>Имя</span><input v-model="draft.name" type="text" autocomplete="given-name" /></label>
          <label class="pl-field"><span>Отзыв</span><textarea v-model="draft.text" required /></label>
          <div><button type="submit" class="pl-btn pl-btn--main">Опубликовать</button> <span class="pl-demo">демо</span></div>
        </form>
        <p v-if="!reviews.length" class="pl-prod__noreview">Отзывов пока нет — будьте первым.</p>
        <article v-for="(r, i) in reviews" :key="i" class="pl-prod__review">
          <p>{{ r.text }}</p>
          <footer>
            <b>{{ r.name }}</b><span>{{ r.date }}</span>
          </footer>
          <div v-if="'reply' in r && r.reply" class="pl-prod__reply">
            <b>Ответ «Папиной лавки»</b>
            <p>{{ r.reply }}</p>
          </div>
        </article>
      </section>
    </div>

    <section v-if="related.length" class="pl-section">
      <div class="pl-head">
        <h2>Ещё в разделе «{{ sec?.name }}»</h2>
        <NuxtLink v-if="sec" :to="plSectionPath(sec.id)">Весь раздел <PlIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="pl-grid">
        <PlCard v-for="r in related" :key="r.id" :product="r" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.pl-prod {
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 40px;
  }

  // Фото — обложкой на высоту колонки с ценой и фактами, без дыры под снимком.
  &__photo {
    position: relative;
    min-height: 420px;
    border-radius: 22px;
    background: var(--pl-kraft);
    overflow: hidden;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .pl-label {
      top: 16px;
      left: 16px;
      font-size: 14px;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;

    h1 {
      font-size: clamp(26px, 2.8vw, 36px);
    }
  }

  &__kicker {
    color: var(--pl-muted);
    font-size: 14px;
    font-weight: 700;
    margin-bottom: -8px;
  }

  &__note {
    color: var(--pl-wood);
    font-family: var(--pl-hand);
    font-size: 26px;
    font-weight: 700;
    line-height: 1;
  }

  &__buy {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px 18px;
    padding: 18px;
    border-radius: 18px;
    background: var(--pl-kraft);

    .pl-buy {
      flex: 1 1 200px;
    }

    // На крафте светлый счётчик сливается — белый с рамкой.
    .pl-qty {
      border: 1px solid var(--pl-field);
      background: #fff;
    }
  }

  &__tag {
    background: #fff;

    &::before {
      background: var(--pl-kraft);
    }

    b {
      font-size: 28px;
    }

    small {
      font-size: 15px;
    }
  }

  &__when {
    display: grid;
    gap: 6px;
    font-size: 15px;

    .pl-when {
      font-size: 16px;
      color: var(--pl-dark);
      font-weight: 700;
    }

    .pl-when.is-stock {
      color: var(--pl-accent);
    }

    a {
      color: var(--pl-accent);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  &__weigh {
    color: var(--pl-muted);
  }

  &__facts {
    display: grid;
    gap: 0;
    margin: 0;
    border-top: 1px solid var(--pl-line);

    div {
      display: grid;
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr);
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--pl-line);
      font-size: 15px;
    }

    dt {
      color: var(--pl-muted);
    }

    dd {
      margin: 0;
      color: var(--pl-dark);
    }

    dd:only-child {
      grid-column: 1 / -1;
    }
  }

  &__ask {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 20px;
  }

  &__call {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--pl-dark);
    font-weight: 700;
  }

  &__form {
    display: grid;
    gap: 12px;
    padding: 18px;
    border: 1px solid var(--pl-line);
    border-radius: 16px;

    > div {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  &__bottom {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 40px;
    margin-top: 48px;
    align-items: start;

    h2 {
      margin-bottom: 16px;
      font-size: 26px;
    }
  }

  &__text p + p {
    margin-top: 12px;
  }

  &__reviews {
    display: grid;
    gap: 14px;
  }

  &__rhead {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    h2 {
      margin-bottom: 0;
    }

    small {
      color: var(--pl-muted);
      font-size: 18px;
      font-weight: 400;
    }
  }

  &__noreview {
    color: var(--pl-muted);
  }

  &__review {
    display: grid;
    gap: 10px;
    padding: 18px;
    border-radius: 16px;
    background: var(--pl-kraft);
    font-size: 15px;

    footer {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 10px;
      align-items: baseline;

      b {
        color: var(--pl-dark);
        font-family: var(--pl-hand);
        font-size: 22px;
        line-height: 1;
      }

      span {
        color: var(--pl-muted);
        font-size: 14px;
      }
    }
  }

  &__reply {
    padding: 12px 14px;
    border-left: 3px solid var(--pl-accent);
    border-radius: 0 10px 10px 0;
    background: #fff;
    font-size: 14px;

    b {
      display: block;
      margin-bottom: 4px;
      color: var(--pl-accent-d);
    }
  }

  @media (max-width: 989px) {
    &__photo {
      min-height: 0;

      img {
        position: static;
        aspect-ratio: 3 / 2;
        height: auto;
      }
    }

    &__top,
    &__bottom {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }

    &__bottom {
      margin-top: 36px;
    }
  }

  @media (max-width: 768px) {
    &__photo {
      margin: 0 -16px;
      border-radius: 0;
    }

    &__buy .pl-buy {
      max-width: none;
    }

    &__facts div {
      grid-template-columns: minmax(0, 1fr);
      gap: 2px;
    }
  }
}
</style>
