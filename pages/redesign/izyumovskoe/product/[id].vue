<script lang="ts" setup>
// Товар: фото, оценка звёздами, цена за кг и «≈ за тушку», счётчик тушками/головами, «Купить в один клик», «Сравнить»,
// «Поделиться»; вкладки «Описание · Как получить · Отзывы», как у оригинала. Отзывы и оценки — в браузере.
import IzIcon from '~/components/redesign/izyumovskoe/IzIcon.vue'
import IzQty from '~/components/redesign/izyumovskoe/IzQty.vue'
import IzCard from '~/components/redesign/izyumovskoe/IzCard.vue'

const route = useRoute()
const cart = useIzyumCart()
const ui = useIzyumUi()

const p = computed(() => izProduct(String(route.params.id)))
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })
const prod = computed(() => p.value as IzProduct)
useSeoMeta({ title: () => `${prod.value.title} — Изюмовское | Концепт редизайна` })

const section = computed(() => izSection(prod.value.section) as IzSection)
const group = computed(() => izGroup(prod.value.group))
const parent = computed(() => (group.value?.parent ? izGroup(group.value.parent) : null))
const per = computed(() => izPerCarcass(prod.value))
const care = computed(() => izCare[prod.value.id] ?? [])
const related = computed(() =>
  izProducts
    .filter((x) => x.section === prod.value.section && x.id !== prod.value.id)
    .sort((a, b) => Number(b.stock) - Number(a.stock))
    .slice(0, 4),
)
const facts = computed(() => {
  const x = prod.value
  const f: { label: string; value: string }[] = []
  if (x.weight) f.push({ label: 'Вес тушки', value: `${x.weight[0].toLocaleString('ru-RU')}–${x.weight[1].toLocaleString('ru-RU')} кг` })
  if (x.age) f.push({ label: x.section === 'myaso' ? 'Возраст птицы' : 'Возраст', value: x.age })
  if (x.cook) f.push({ label: 'Время приготовления', value: x.cook })
  if (x.adult) f.push({ label: 'Вес взрослой птицы', value: x.adult })
  if (x.unit === 'гол.') f.push({ label: 'Минимальный заказ', value: `${x.min} голов, шаг — 1 голова` })
  f.push({ label: 'Как получить', value: x.section === 'molodnyak' ? 'самовывоз с фермы' : 'доставка по Омску, встреча, самовывоз' })
  return f
})

const tab = ref<'about' | 'get' | 'reviews'>('about')
const reviewsOf = computed(() => cart.reviews.value[prod.value.id] ?? [])
const myVote = computed(() => cart.votes.value[prod.value.id] ?? 0)
const votes = computed(() => (myVote.value ? 1 : 0) + reviewsOf.value.length)
const rating = computed(() => {
  const all = [...(myVote.value ? [myVote.value] : []), ...reviewsOf.value.map((r) => r.stars)]
  return all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0
})
const rev = reactive({ name: '', text: '', stars: 5 })
const sendReview = () => {
  cart.addReview(prod.value.id, { name: rev.name || cart.user.value || 'Покупатель', text: rev.text, stars: rev.stars, date: new Date().toLocaleDateString('ru-RU') })
  rev.text = ''
  ui.toast.value = 'Отзыв сохранён в этом браузере — демо'
}

const add = () => {
  cart.add(prod.value)
  ui.toast.value = `${prod.value.title} — в корзине`
}
const share = (net: 'vk' | 'ok' | 'mail') => {
  const u = encodeURIComponent(`https://изюмовское.рф/magazin/product/${prod.value.id}`)
  const links = {
    vk: `https://vk.com/share.php?url=${u}`,
    ok: `https://connect.ok.ru/offer?url=${u}`,
    mail: `https://connect.mail.ru/share?url=${u}`,
  }
  window.open(links[net], '_blank', 'noopener,width=640,height=480')
}
const copy = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    ui.toast.value = 'Ссылка скопирована'
  } catch {
    ui.toast.value = 'Не получилось скопировать'
  }
}
const qtyTotal = computed(() => {
  const n = cart.qtyOf(prod.value.id)
  if (!n || prod.value.price === null) return ''
  if (per.value) return `${izQtyText(prod.value, n)} ≈ ${izMoney(per.value[0] * n)}–${izMoney(per.value[1] * n)}`
  return `${izQtyText(prod.value, n)} — ${izMoney(prod.value.price * n)}`
})
</script>

<template>
  <div class="iz-wrap">
    <nav class="iz-crumbs" aria-label="Путь">
      <NuxtLink :to="izPath()">Главная</NuxtLink>
      <span><NuxtLink :to="izPath(`/catalog/${section.id}`)">{{ section.title }}</NuxtLink></span>
      <span v-if="parent"
        ><NuxtLink :to="{ path: izPath(`/catalog/${section.id}`), query: { g: parent.id } }">{{ parent.title }}</NuxtLink></span
      >
      <span v-if="group && group.title !== prod.title"
        ><NuxtLink :to="{ path: izPath(`/catalog/${section.id}`), query: { g: group.id } }">{{ group.title }}</NuxtLink></span
      >
      <span>{{ prod.title }}</span>
    </nav>

    <div class="iz-prod">
      <div class="iz-prod__photo">
        <img :src="prod.img" :alt="prod.title" width="960" height="720" />
        <span class="iz-card__tags">
          <span v-if="prod.isNew" class="iz-tag iz-tag--new">Новинка</span>
          <span v-else-if="prod.label && prod.stock" class="iz-tag">{{ prod.label }}</span>
        </span>
      </div>

      <div class="iz-prod__info">
        <span class="iz-prod__sec">{{ section.short }}{{ parent ? ` · ${parent.title}` : '' }}</span>
        <h1>{{ prod.title }}</h1>
        <div class="iz-prod__rate">
          <span class="iz-stars" role="group" aria-label="Оценка">
            <button v-for="n in 5" :key="n" type="button" :class="{ 'is-on': n <= Math.round(myVote || rating) }" :aria-label="`${n} из 5`" @click="cart.vote(prod.id, n)">
              <IzIcon name="star" :size="20" fill />
            </button>
          </span>
          <span>{{ votes ? `${rating.toFixed(1).replace('.', ',')} · ${votes} ${izPlural(votes, 'голос', 'голоса', 'голосов')}` : 'Оцените первым' }}</span>
          <button type="button" class="iz-link" @click="tab = 'reviews'">Отзывы ({{ reviewsOf.length }})</button>
        </div>
        <p class="iz-prod__lead">{{ prod.lead }}</p>

        <div class="iz-prod__buy">
          <div class="iz-prod__price">
            <template v-if="prod.price !== null">
              <b>{{ izMoney(prod.price) }}<small> за {{ prod.unit === 'кг' ? 'кг' : 'голову' }}</small></b>
              <span v-if="per">≈ {{ izMoney(per[0]) }}–{{ izMoney(per[1]) }} за тушку. Точную сумму назовём после взвешивания.</span>
              <span v-else-if="prod.unit === 'гол.'">от {{ prod.min }} голов — {{ izMoney(prod.price * prod.min) }}</span>
            </template>
            <template v-else>
              <b class="is-ask">Цена по запросу</b>
              <span>Положите в корзину или купите в один клик — перезвоним и назовём цену.</span>
            </template>
            <span class="iz-prod__stock" :class="{ 'is-out': !prod.stock }">
              <IzIcon :name="prod.stock ? 'check' : 'close'" :size="17" />{{ prod.stock ? 'В наличии' : 'Нет в наличии' }}
            </span>
          </div>

          <div v-if="prod.stock" class="iz-prod__actions">
            <IzQty v-if="cart.qtyOf(prod.id)" :p="prod" big />
            <button v-else type="button" class="iz-btn iz-btn--main" @click="add">
              <IzIcon name="bag" :size="19" />В корзину{{ prod.unit === 'гол.' ? ` · ${prod.min} гол.` : '' }}
            </button>
            <button type="button" class="iz-btn iz-btn--line" @click="ui.oneClick.value = prod.id">Купить в один клик</button>
          </div>
          <div v-else class="iz-prod__actions">
            <NuxtLink :to="{ path: izPath('/kontakty'), query: { about: prod.title }, hash: '#napishite' }" class="iz-btn iz-btn--main">Спросить о поступлении</NuxtLink>
          </div>
          <p v-if="qtyTotal" class="iz-prod__sum">
            {{ qtyTotal }} · <NuxtLink :to="izPath('/cart')">Перейти в корзину</NuxtLink>
          </p>
        </div>

        <dl class="iz-prod__facts">
          <div v-for="f in facts" :key="f.label">
            <dt>{{ f.label }}</dt>
            <dd>{{ f.value }}</dd>
          </div>
        </dl>

        <div class="iz-prod__tools">
          <button type="button" class="iz-btn iz-btn--line" :class="{ 'is-on': cart.inCompare(prod.id) }" @click="cart.toggleCompare(prod.id)">
            <IzIcon name="scales" :size="19" />{{ cart.inCompare(prod.id) ? 'В сравнении' : 'Сравнить' }}
          </button>
          <div class="iz-share">
            <span><IzIcon name="share" :size="18" />Поделиться</span>
            <button type="button" aria-label="ВКонтакте" @click="share('vk')">VK</button>
            <button type="button" aria-label="Одноклассники" @click="share('ok')">OK</button>
            <button type="button" aria-label="Мой Мир" @click="share('mail')">Mail</button>
            <button type="button" aria-label="Скопировать ссылку" @click="copy"><IzIcon name="copy" :size="17" /></button>
          </div>
        </div>
      </div>
    </div>

    <section class="iz-tabs">
      <div class="iz-seg iz-tabs__nav" role="tablist">
        <button type="button" role="tab" :class="{ 'is-on': tab === 'about' }" @click="tab = 'about'">
          {{ prod.section === 'molodnyak' ? 'О породе и содержании' : 'Описание' }}
        </button>
        <button type="button" role="tab" :class="{ 'is-on': tab === 'get' }" @click="tab = 'get'">Как получить</button>
        <button type="button" role="tab" :class="{ 'is-on': tab === 'reviews' }" @click="tab = 'reviews'">Отзывы · {{ reviewsOf.length }}</button>
      </div>

      <div v-if="tab === 'about'" class="iz-tabs__body iz-tabs__text">
        <template v-if="care.length">
          <p v-for="(t, i) in care" :key="i">{{ t }}</p>
        </template>
        <p v-else>{{ prod.lead }}</p>
      </div>

      <div v-else-if="tab === 'get'" class="iz-tabs__body">
        <p v-if="prod.section === 'molodnyak'" class="iz-note iz-note--warn">
          Доставка распространяется только на мясо птицы. Молодняк заберите на ферме: {{ izContacts.address }}.
        </p>
        <div class="iz-tabs__ways">
          <div v-for="w in izWays" :key="w.id" class="iz-tabs__way" :class="{ 'is-off': prod.section === 'molodnyak' && w.id !== 'pickup' }">
            <b>{{ w.title }}</b>
            <span>{{ w.price }}</span>
            <p>{{ w.text }}</p>
          </div>
        </div>
        <NuxtLink :to="izPath('/dostavka')" class="iz-link">Подробнее о доставке и оплате</NuxtLink>
      </div>

      <div v-else class="iz-tabs__body iz-reviews">
        <div v-if="reviewsOf.length" class="iz-reviews__list">
          <article v-for="(r, i) in reviewsOf" :key="i" class="iz-review">
            <div class="iz-review__head">
              <b>{{ r.name }}</b>
              <span class="iz-stars"
                ><span v-for="n in 5" :key="n" :class="{ 'is-on': n <= r.stars }"><IzIcon name="star" :size="16" fill /></span
              ></span>
              <small>{{ r.date }}</small>
            </div>
            <p>{{ r.text }}</p>
          </article>
        </div>
        <p v-else class="iz-reviews__empty">Отзывов пока нет. Купили у нас — расскажите, как вам.</p>
        <form class="iz-form iz-reviews__form" @submit.prevent="sendReview">
          <b>Ваш отзыв</b>
          <span class="iz-stars" role="group" aria-label="Оценка в отзыве">
            <button v-for="n in 5" :key="n" type="button" :class="{ 'is-on': n <= rev.stars }" :aria-label="`${n} из 5`" @click="rev.stars = n">
              <IzIcon name="star" :size="22" fill />
            </button>
          </span>
          <label>Имя<input v-model="rev.name" :placeholder="cart.user.value || 'Как к вам обращаться'" autocomplete="off" /></label>
          <label>Отзыв<textarea v-model="rev.text" required placeholder="Как вам мясо или как прижился молодняк" /></label>
          <button type="submit" class="iz-btn iz-btn--main">Опубликовать</button>
          <small class="iz-form__fine">У оригинала отзыв оставляют после входа. В концепте отзыв сохраняется только в вашем браузере.</small>
        </form>
      </div>
    </section>

    <section v-if="related.length" class="iz-sec">
      <div class="iz-head">
        <h2>Ещё в разделе «{{ section.short }}»</h2>
        <NuxtLink :to="izPath(`/catalog/${section.id}`)" class="iz-head__more">Весь раздел<IzIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="iz-grid">
        <IzCard v-for="r in related" :key="r.id" :p="r" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.iz-prod {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 40px;
  margin-top: 18px;

  &__photo {
    position: relative;
    align-self: start;
    position: sticky;
    top: 100px;
    border-radius: var(--iz-R);
    overflow: hidden;
    background: var(--iz-surface);
    aspect-ratio: 4 / 3;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__info {
    display: grid;
    align-content: start;
    gap: 14px;

    h1 {
      font-size: clamp(30px, 3.6vw, 44px);
    }
  }
  &__sec {
    color: var(--iz-muted);
    font-size: 14px;
  }
  &__rate {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px 14px;
    font-size: 14px;
    color: var(--iz-muted);
  }
  &__lead {
    font-size: 16.5px;
  }
  &__buy {
    display: grid;
    gap: 16px;
    padding: 22px;
    border-radius: var(--iz-R);
    background: var(--iz-surface);
  }
  &__price {
    display: grid;
    gap: 4px;

    b {
      font-family: var(--iz-head);
      font-weight: 800;
      font-size: 34px;
      line-height: 1.1;
      color: var(--iz-dark);

      small {
        font-size: 17px;
        font-weight: 600;
        color: var(--iz-muted);
      }
      &.is-ask {
        font-size: 26px;
      }
    }
    > span {
      font-size: 14px;
    }
  }
  &__stock {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    color: var(--iz-green);
    font-weight: 500;

    &.is-out {
      color: var(--iz-red);
    }
  }
  &__actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 10px;

    .iz-btn {
      min-height: 52px;
    }
    .iz-qty {
      background: #fff;
    }
    > :only-child {
      grid-column: 1 / -1;
    }
  }
  &__sum {
    font-size: 14px;

    a {
      color: var(--iz-ink-accent);
      font-weight: 500;
      text-decoration: underline;
    }
  }
  dl.iz-prod__facts {
    display: grid;
    border-top: 1px solid var(--iz-line);

    div {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--iz-line);
    }
    dt {
      color: var(--iz-muted);
    }
    dd {
      color: var(--iz-dark);
      font-weight: 500;
    }
  }
  &__tools {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    .iz-btn.is-on {
      border-color: var(--iz-accent);
      background: var(--iz-soft);
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;

    &__photo {
      position: relative;
      top: 0;
    }
  }
  @media (max-width: 375px) {
    &__actions {
      grid-template-columns: minmax(0, 1fr);
    }
    &__buy {
      padding: 16px;
    }
    dl.iz-prod__facts div {
      grid-template-columns: minmax(0, 1fr);
      gap: 2px;
    }
  }
}
.iz-share {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--iz-muted);
  font-size: 14px;

  > span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-right: 4px;
  }
  button {
    display: grid;
    place-items: center;
    min-width: 40px;
    height: 36px;
    padding: 0 8px;
    border-radius: 10px;
    background: var(--iz-surface);
    color: var(--iz-dark);
    font-size: 13px;
    font-weight: 700;

    &:hover {
      background: var(--iz-soft);
    }
  }
}
.iz-tabs {
  margin-top: 48px;

  &__nav {
    display: inline-flex;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;

    button {
      flex: none;
    }
  }
  &__body {
    display: grid;
    gap: 16px;
    max-width: 860px;
    margin-top: 22px;
  }
  &__text p {
    font-size: 16px;
  }
  &__ways {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  &__way {
    display: grid;
    align-content: start;
    gap: 4px;
    padding: 18px;
    border-radius: var(--iz-R);
    border: 1px solid var(--iz-line);

    b {
      color: var(--iz-dark);
    }
    span {
      font-family: var(--iz-head);
      font-weight: 700;
      color: var(--iz-ink-accent);
    }
    p {
      font-size: 14px;
    }
    &.is-off {
      opacity: 0.45;
    }
  }

  @media (max-width: 768px) {
    margin-top: 36px;

    &__ways {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
