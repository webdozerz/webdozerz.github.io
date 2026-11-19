<script lang="ts" setup>
// Карточка товара: галерея, оформление (лента +100 ₽ со своим текстом, открытка +30 ₽), расчёт доставки по городу,
// «Купить в один клик», именная упаковка, отзывы и «С этим товаром покупают» — всё как на сайте фабрики.
import {
  skPath, skProduct, skSection, skInSection, skRub, skPlural, skDiscount, skWeight, skCards, skDeliveryDates, skCourierPrice, SK_RIBBON, SK_CARD, SK_FREE_FROM,
} from '~/utils/shokoladki'
import { skReviews } from '~/utils/shokoladki.texts'
import { useSkStore, useSkUi } from '~/composables/useShokoladki'
import SkCard from '~/components/redesign/shokoladki/SkCard.vue'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'
import SkStars from '~/components/redesign/shokoladki/SkStars.vue'

const route = useRoute()
const store = useSkStore()
const ui = useSkUi()
const to = (p: string) => skPath(p)
const p = computed(() => skProduct(String(route.params.id)))
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден', fatal: false })
useSeoMeta({ title: () => `${p.value?.n || 'Товар'} — АПРИОРИ | Концепт редизайна` })

const sec = computed(() => (p.value ? skSection(p.value.c) : undefined))
const photo = ref(0)
watch(
  () => route.params.id,
  () => {
    photo.value = 0
    qty.value = 1
  },
)
const qty = ref(1)
const ribbonOn = ref(false)
const ribbonText = ref('')
const cardOn = ref(false)
const card = ref(skCards[0].id)
const showCard = ref(false)
const ship = ref<'courier' | '5post'>('courier')
const extra = computed(() => (ribbonOn.value ? SK_RIBBON : 0) + (cardOn.value ? SK_CARD : 0))
const total = computed(() => ((p.value?.p || 0) + extra.value) * qty.value)
const off = computed(() => (p.value ? skDiscount(p.value) : 0))
const weight = computed(() => (p.value ? skWeight(p.value) : ''))
const isPack = computed(() => !!p.value?.s.includes('individual-packing'))
const isSingle = computed(() => !!p.value && p.value.p <= 200 && p.value.s.includes('handmade-chocolates'))
const courier = computed(() => skCourierPrice(store.cityInfo.value.zone, total.value))
const dates = ref('')
onMounted(() => (dates.value = skDeliveryDates(store.cityInfo.value.zone)))
watch(
  () => store.city.value,
  () => (dates.value = skDeliveryDates(store.cityInfo.value.zone)),
)

const reviews = computed(() => skReviews.filter((r) => r.pid === p.value?.id))
const related = computed(() => (p.value ? skInSection(p.value.c).filter((x) => x.id !== p.value!.id).slice(0, 4) : []))
const facts = computed(() => Object.entries(p.value?.f || {}))

const buy = () => {
  if (!p.value) return
  if (ribbonOn.value || cardOn.value) {
    store.add(p.value.id, qty.value, { ribbon: ribbonOn.value ? ribbonText.value.trim() : null, card: cardOn.value ? card.value : null })
    ribbonOn.value = false
    cardOn.value = false
    ribbonText.value = ''
  } else store.add(p.value.id, qty.value)
}
const oneClick = () => {
  ui.oneclick.value = p.value?.id || ''
  ui.modal.value = 'oneclick'
}
const review = () => {
  ui.review.value = p.value?.id || ''
  ui.modal.value = 'review'
}
const pack = () => {
  ui.pack.value = p.value?.id || ''
  ui.modal.value = 'pack'
}
const pageUrl = computed(() => `https://andryushov.me${skPath(`/tovar/${p.value?.id}/`)}`)
const copied = ref(false)
const copy = async () => {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {}
}
</script>

<template>
  <div v-if="p" class="sk-wrap sk-item">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span><NuxtLink :to="to('/katalog/')">Каталог</NuxtLink></span>
      <span v-if="sec"><NuxtLink :to="to(`/katalog/${sec.id}/`)">{{ sec.n }}</NuxtLink></span>
    </nav>

    <div class="sk-item__top">
      <div class="sk-gal">
        <div class="sk-gal__main">
          <img :src="p.gal[photo] || p.img" :alt="p.n" width="750" height="600" />
          <span v-if="off" class="sk-tag sk-tag--sale sk-gal__tag">−{{ off }}%</span>
        </div>
        <div v-if="p.gal.length > 1" class="sk-gal__thumbs">
          <button v-for="(g, i) in p.gal" :key="g" type="button" :class="{ 'is-on': i === photo }" :aria-label="`Фото ${i + 1}`" @click="photo = i">
            <img :src="g" alt="" loading="lazy" />
          </button>
        </div>
      </div>

      <div class="sk-item__info">
        <h1 class="sk-item__title">{{ p.n }}</h1>
        <div class="sk-item__meta">
          <a href="#otzyvy" class="sk-item__rev"><SkStars :value="p.st" :count="reviews.length || p.r" /></a>
          <button type="button" class="sk-link" :class="{ 'is-on': store.isFav(p.id) }" @click="store.toggleFav(p.id)">
            <SkIcon name="heart" />{{ store.isFav(p.id) ? 'В избранном' : 'В избранное' }}
          </button>
          <span v-if="p.sku" class="sk-muted">Артикул: {{ p.sku }}</span>
        </div>

        <div class="sk-buy">
          <div class="sk-buy__price">
            <b>{{ skRub(p.p) }}</b>
            <s v-if="p.o > p.p">{{ skRub(p.o) }}</s>
            <span v-if="weight" class="sk-muted">{{ weight }}</span>
            <span class="sk-buy__stock"><SkIcon name="check" />Товар в наличии</span>
          </div>

          <!-- оформление товара -->
          <div class="sk-buy__extras">
            <b>Выберите оформление товара</b>
            <label class="sk-check">
              <input v-model="ribbonOn" type="checkbox" />
              <span><SkIcon name="ribbon" />Лента <small>+{{ skRub(SK_RIBBON) }}</small></span>
            </label>
            <input v-if="ribbonOn" v-model="ribbonText" class="sk-input" maxlength="40" placeholder="Текст на ленточке" />
            <label class="sk-check">
              <input v-model="cardOn" type="checkbox" />
              <span><SkIcon name="card" />Открытка <small>+{{ skRub(SK_CARD) }}</small></span>
            </label>
            <div v-if="cardOn" class="sk-buy__card">
              <select v-model="card" class="sk-input" aria-label="Открытка">
                <option v-for="c in skCards" :key="c.id" :value="c.id">{{ c.n }}</option>
              </select>
              <button type="button" class="sk-link" @click="showCard = !showCard"><SkIcon name="eye" />{{ showCard ? 'Скрыть' : 'Показать открытку' }}</button>
              <img v-if="showCard" :src="skCards.find((c) => c.id === card)?.img" :alt="skCards.find((c) => c.id === card)?.n" />
            </div>
          </div>

          <div class="sk-buy__row">
            <div class="sk-qty">
              <button type="button" aria-label="Меньше" @click="qty = Math.max(1, qty - 1)"><SkIcon name="minus" /></button>
              <b>{{ qty }}</b>
              <button type="button" aria-label="Больше" @click="qty = Math.min(99, qty + 1)"><SkIcon name="plus" /></button>
            </div>
            <button type="button" class="sk-btn sk-btn--big sk-buy__main" @click="buy"><SkIcon name="cart" />Добавить в корзину · {{ skRub(total) }}</button>
          </div>
          <div class="sk-buy__row sk-buy__row--two">
            <button type="button" class="sk-btn sk-btn--line" @click="oneClick"><SkIcon name="bolt" />Купить в один клик</button>
            <button v-if="isPack" type="button" class="sk-btn sk-btn--soft" @click="pack"><SkIcon name="photo" />Оформить упаковку</button>
          </div>
          <NuxtLink v-if="isSingle" :to="to('/nabor/')" class="sk-buy__set">
            <SkIcon name="candy" /><span><b>Выгоднее в наборе</b>Соберите коробку из конфет поштучно — от 5 до 64 штук</span>
          </NuxtLink>
        </div>

        <!-- доставка по городу -->
        <div class="sk-ship">
          <div class="sk-ship__city">
            <span>Ваш регион:</span>
            <button type="button" class="sk-link" @click="ui.modal.value = 'city'">{{ store.city.value }}<SkIcon name="down" /></button>
          </div>
          <label class="sk-ship__opt" :class="{ 'is-on': ship === 'courier' }">
            <input v-model="ship" type="radio" value="courier" />
            <span><b>Доставка курьером</b><small>{{ dates || '…' }}</small></span>
            <em>{{ courier === 0 ? 'бесплатно' : courier ? (store.cityInfo.value.zone === 'msk' ? skRub(courier) : `от ${skRub(courier)}`) : '—' }}</em>
          </label>
          <label class="sk-ship__opt" :class="{ 'is-on': ship === '5post' }">
            <input v-model="ship" type="radio" value="5post" />
            <span><b>Пункт выдачи 5Post</b><small>в «Пятёрочке» и «Перекрёстке»</small></span>
            <em>при оформлении</em>
          </label>
          <p v-if="store.cityInfo.value.zone === 'msk' && total < SK_FREE_FROM" class="sk-ship__free">До бесплатной доставки — {{ skRub(SK_FREE_FROM - total) }}</p>
          <div class="sk-ship__links">
            <NuxtLink :to="to('/butiki/')" class="sk-link">Посмотреть бутики для самовывоза</NuxtLink>
            <NuxtLink :to="to('/dostavka/')" class="sk-link">Условия доставки</NuxtLink>
          </div>
        </div>

        <div v-if="p.b" class="sk-love">
          <SkIcon name="heart" /><span><b>Этот товар любят!</b> {{ p.b }} {{ skPlural(p.b, 'человек купил', 'человека купили', 'человек купили') }} за последние 2 месяца</span>
        </div>
        <div class="sk-share">
          <span>Поделиться:</span>
          <a :href="`https://vk.com/share.php?url=${encodeURIComponent(pageUrl)}`" target="_blank" rel="noopener">ВКонтакте</a>
          <a :href="`https://connect.ok.ru/offer?url=${encodeURIComponent(pageUrl)}`" target="_blank" rel="noopener">Одноклассники</a>
          <a :href="`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}`" target="_blank" rel="noopener">Telegram</a>
          <button type="button" class="sk-link" @click="copy"><SkIcon name="copy" />{{ copied ? 'Скопировано' : 'Ссылка' }}</button>
        </div>
      </div>
    </div>

    <div class="sk-item__more">
      <section class="sk-item__desc">
        <h2 class="sk-h2">Описание</h2>
        <div class="sk-text">
          <p v-for="(d, i) in p.d" :key="i">{{ d }}</p>
          <p v-if="!p.d.length" class="sk-muted">Описание появится в рабочей версии — в выборке концепта его нет.</p>
        </div>
        <dl v-if="facts.length" class="sk-facts-list">
          <template v-for="[k, v] in facts" :key="k">
            <dt>{{ k }}</dt>
            <dd>{{ v }}</dd>
          </template>
        </dl>
      </section>

      <section id="otzyvy" class="sk-item__reviews">
        <div class="sk-sechead">
          <h2 class="sk-h2">Отзывы покупателей <small>{{ reviews.length }}</small></h2>
          <button type="button" class="sk-btn sk-btn--line" @click="review">Написать отзыв</button>
        </div>
        <div v-if="reviews.length" class="sk-item__revlist">
          <article v-for="r in reviews" :key="r.n + r.d" class="sk-review">
            <SkStars :value="r.r" />
            <p>{{ r.t }}</p>
            <div class="sk-review__by"><b>{{ r.n }}</b><span>{{ r.d }}</span></div>
          </article>
        </div>
        <p v-else class="sk-empty">Отзывов пока нет — будьте первым.</p>
      </section>
    </div>

    <section v-if="related.length" class="sk-section">
      <h2 class="sk-h2 sk-item__relh">С этим товаром покупают</h2>
      <div class="sk-grid">
        <SkCard v-for="r in related" :key="r.id" :p="r" />
      </div>
    </section>
  </div>
</template>
