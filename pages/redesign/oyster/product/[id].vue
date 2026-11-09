<script lang="ts" setup>
import {
  oyBlog,
  oyContacts,
  oyDelivery,
  oyDeliveryRules,
  oyDiscount,
  oyMoney,
  oyMoscowNow,
  oyPath,
  oyPayment,
  oyPrice,
  oyProduct,
  oyProducts,
  oySection,
  oyServices,
  oyStep,
  oyStorage,
  oyUnit,
  oyUnitText,
  oyWhen,
} from '~/utils/oyster'
import { useOyShop, useOyUi } from '~/composables/useOyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'
import OyQty from '~/components/redesign/oyster/OyQty.vue'
import OyShelf from '~/components/redesign/oyster/OyShelf.vue'
import OyPhone from '~/components/redesign/oyster/OyPhone.vue'

const route = useRoute()
const p = computed(() => oyProduct(route.params.id as string))
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })
const prod = p.value!
const sec = oySection(prod.sec)
useSeoMeta({ title: `${prod.name} — Oyster Market | Концепт редизайна` })

const shop = useOyShop()
const ui = useOyUi()
const v = ref(prod.def ?? 0)
const svc = ref(false)
const unit = computed(() => oyUnit(prod, v.value))
const step = computed(() => oyStep(prod, v.value))
const qty = ref(prod.service === 'oyster' ? 6 : step.value)
watch(v, () => {
  if (prod.service !== 'oyster') qty.value = step.value
})
const price = computed(() => oyPrice(prod, v.value))
const svcInfo = prod.service ? oyServices[prod.service] : null
const sum = computed(() => ((price.value ?? 0) + (svc.value && svcInfo ? svcInfo.price : 0)) * qty.value)
const off = oyDiscount(prod)
const weighed = computed(() => unit.value === 'кг' && /рыб|краб|ryba|krab/i.test(prod.sec + prod.name) && !prod.props.some((x) => /весов/i.test(x.join(' '))))

const gallery = [prod.img, ...prod.gal]
const shot = ref(0)

const now = ref<Date | null>(null)
const when = computed(() => (now.value ? oyWhen(now.value) : null))
onMounted(() => (now.value = oyMoscowNow()))

const tabs = ['Описание', 'Отзывы', 'Как купить', 'Оплата', 'Доставка', 'Правила хранения']
const tab = ref(tabs[0])

// Отзыв о товаре — демо-форма, как вкладка «Отзывы» оригинала
const rev = reactive({ name: '', phone: '', text: '', rate: 5 })
const revSent = ref(false)
const sendRev = () => {
  if (rev.name.trim() && rev.text.trim()) revSent.value = true
}

const oneClick = () => {
  shop.add(prod, v.value, svc.value, qty.value)
  ui.open('quick')
}
const similar =computed(() => oyProducts.filter((x) => x.sec === prod.sec && x.id !== prod.id).slice(0, 10))
const articles = oyBlog.posts.slice(0, 3)
</script>

<template>
  <div class="oy-wrap oy-page oy-prod">
    <nav class="oy-crumbs" aria-label="Навигация">
      <NuxtLink :to="oyPath('/')">Главная</NuxtLink>
      <span><NuxtLink :to="oyPath('/catalog/')">Каталог</NuxtLink></span>
      <span v-if="sec"><NuxtLink :to="oyPath(`/catalog/${sec.id}/`)">{{ sec.name }}</NuxtLink></span>
    </nav>

    <div class="oy-prod__top">
      <div class="oy-gallery">
        <div class="oy-gallery__main">
          <img :src="gallery[shot]" :alt="prod.name" width="600" height="600" />
          <div class="oy-card__labels">
            <span v-if="off" class="oy-label oy-label--sale">−{{ off }}%</span>
            <span v-if="prod.order" class="oy-label oy-label--order">Под заказ</span>
            <span v-for="l in prod.labels" :key="l" class="oy-label" :class="`oy-label--${l === 'Хит' ? 'hit' : l === 'Новинка' ? 'new' : 'adv'}`">{{ l }}</span>
          </div>
        </div>
        <div v-if="gallery.length > 1" class="oy-gallery__thumbs">
          <button v-for="(g, i) in gallery" :key="g" type="button" :class="{ 'is-on': shot === i }" :aria-label="`Фото ${i + 1}`" @click="shot = i">
            <img :src="g" alt="" width="80" height="80" loading="lazy" />
          </button>
        </div>
      </div>

      <div class="oy-buybox">
        <h1>{{ prod.name }}</h1>
        <div class="oy-buybox__meta">
          <span v-if="!prod.order" class="oy-buybox__stock"><OyIcon name="check" :size="16" />В наличии</span>
          <span v-else class="oy-buybox__stock oy-buybox__stock--order"><OyIcon name="clock" :size="16" />Под заказ</span>
          <span v-for="pr in prod.props.slice(0, 2)" :key="pr[0]">{{ pr[0] }}: <b>{{ pr[1] }}</b></span>
        </div>

        <div v-if="prod.variants" class="oy-buybox__group">
          <b>{{ prod.service === 'oyster' ? 'Размер устрицы' : unit === 'кг' && prod.sec === 'ryba' ? 'Вес рыбы' : 'Фасовка' }}</b>
          <div class="oy-buybox__sizes">
            <button v-for="(x, i) in prod.variants" :key="x.name" type="button" class="oy-size" :class="{ 'is-on': v === i }" @click="v = i">
              <span>{{ x.name }}</span><small>{{ oyMoney(x.price) }}</small>
            </button>
          </div>
        </div>

        <div class="oy-buybox__price">
          <template v-if="price">
            <b>{{ oyMoney(price) }}</b>
            <span class="oy-unit">{{ oyUnitText(unit) }}</span>
            <s v-if="prod.old && v === (prod.def ?? 0)">{{ oyMoney(prod.old) }}</s>
          </template>
          <b v-else class="oy-buybox__ask">Цена и срок — по запросу</b>
        </div>
        <p v-if="weighed" class="oy-buybox__note"><OyIcon name="tag" :size="16" />Весовой товар: точный вес и сумму назовём после взвешивания.</p>

        <div v-if="svcInfo && price" class="oy-buybox__svc">
          <label class="oy-svc">
            <input v-model="svc" type="checkbox" />
            <span class="oy-svc__box"><OyIcon name="check" :size="14" /></span>
            <span>{{ svcInfo.title }} <em>+{{ svcInfo.price }} ₽/{{ svcInfo.per }}</em></span>
          </label>
          <p>{{ svcInfo.text }}</p>
        </div>

        <div v-if="price" class="oy-buybox__buy">
          <OyQty v-model="qty" :unit="unit" :step="prod.service === 'oyster' ? 1 : step" :min="step" />
          <button type="button" class="oy-btn oy-btn--accent oy-btn--big" @click="shop.add(prod, v, svc, qty)">
            <OyIcon name="cart" :size="20" />В корзину · {{ oyMoney(sum) }}
          </button>
          <button type="button" class="oy-btn oy-btn--line oy-btn--big" @click="oneClick">Купить в 1 клик</button>
        </div>
        <div v-else class="oy-buybox__buy">
          <button type="button" class="oy-btn oy-btn--accent oy-btn--big" @click="ui.open('question', prod.name)"><OyIcon name="chat" :size="20" />Узнать цену и срок</button>
          <a :href="oyContacts.telegram" target="_blank" rel="noopener" class="oy-btn oy-btn--line oy-btn--big">Написать в Telegram</a>
        </div>
        <div class="oy-buybox__acts">
          <button type="button" :class="{ 'is-on': shop.fav.value.includes(prod.id) }" @click="shop.toggle('fav', prod.id)">
            <OyIcon name="heart" :size="18" />{{ shop.fav.value.includes(prod.id) ? 'В избранном' : 'В избранное' }}
          </button>
          <button type="button" :class="{ 'is-on': shop.cmp.value.includes(prod.id) }" @click="shop.toggle('cmp', prod.id)">
            <OyIcon name="compare" :size="18" />{{ shop.cmp.value.includes(prod.id) ? 'В сравнении' : 'Сравнить' }}
          </button>
          <button type="button" @click="ui.open('question', prod.name)"><OyIcon name="chat" :size="18" />Задать вопрос</button>
        </div>

        <div class="oy-buybox__ship">
          <div>
            <OyIcon name="truck" :size="22" />
            <span>
              <b><ClientOnly>{{ when?.text ?? 'Приём заказов с 10 до 19 — привезём сегодня с 12 до 21' }}<template #fallback>Приём заказов с 10 до 19 — привезём сегодня с 12 до 21</template></ClientOnly></b>
              <small>Машиной по МКАД от 3 000 ₽: {{ oyDelivery[0].price }} ₽ до подъезда, {{ oyDelivery[1].price }} ₽ до квартиры</small>
            </span>
          </div>
          <div>
            <OyIcon name="pin" :size="22" />
            <span>
              <b>Самовывоз — Михайловский проезд, 3</b>
              <small v-if="prod.live">Скидка 5% на живые морепродукты при самовывозе</small>
              <small v-else>Сборка заказа от 20 минут до часа</small>
            </span>
          </div>
        </div>
      </div>
    </div>

    <section class="oy-ptabs">
      <div class="oy-seg oy-ptabs__nav" role="tablist">
        <button v-for="t in tabs" :key="t" type="button" role="tab" :aria-selected="tab === t" :class="{ 'is-on': tab === t }" @click="tab = t">{{ t }}</button>
      </div>
      <div class="oy-ptabs__body">
        <div v-if="tab === 'Описание'" class="oy-ptabs__desc">
          <div class="oy-prose">
            <p v-for="d in prod.desc" :key="d.slice(0, 20)">{{ d }}</p>
            <p v-if="!prod.desc.length">Подробное описание — на сайте магазина. Подскажем по вкусу, размеру и подаче по телефону {{ oyContacts.phone }}.</p>
          </div>
          <table v-if="prod.props.length" class="oy-props">
            <tr v-for="pr in prod.props" :key="pr[0]">
              <th>{{ pr[0] }}</th>
              <td>{{ pr[1] }}</td>
            </tr>
          </table>
        </div>
        <div v-else-if="tab === 'Отзывы'" class="oy-ptabs__revs">
          <div class="oy-empty oy-ptabs__norev">
            <h2>Отзывов о товаре пока нет</h2>
            <p>Попробовали — расскажите, как вам. Общие отзывы о магазине — на странице «Отзывы».</p>
            <NuxtLink :to="oyPath('/reviews/')" class="oy-head__link">Отзывы о магазине <OyIcon name="arrow" :size="18" /></NuxtLink>
          </div>
          <form v-if="!revSent" class="oy-box oy-ptabs__form" @submit.prevent="sendRev">
            <h3>Оставить отзыв</h3>
            <div class="oy-rate" role="radiogroup" aria-label="Оценка">
              <button v-for="n in 5" :key="n" type="button" :class="{ 'is-on': n <= rev.rate }" :aria-label="`${n} из 5`" @click="rev.rate = n"><OyIcon name="star" :size="24" /></button>
            </div>
            <div class="oy-form-grid">
              <label class="oy-field"><span>Имя</span><input v-model="rev.name" /></label>
              <label class="oy-field"><span>Телефон</span><OyPhone v-model="rev.phone" /></label>
            </div>
            <label class="oy-field"><span>Отзыв</span><textarea v-model="rev.text" rows="4" /></label>
            <button type="submit" class="oy-btn oy-btn--accent" :disabled="!rev.name.trim() || !rev.text.trim()">Отправить отзыв</button>
          </form>
          <div v-else class="oy-box oy-ptabs__form"><b>Спасибо!</b> В концепте отзыв никуда не уходит — на сайте он появится после проверки.</div>
        </div>
        <div v-else-if="tab === 'Как купить'" class="oy-prose">
          <p>Добавьте товар в корзину, выберите размер и отметьте, открыть ли устрицы, ежей или гребешок к доставке. В корзине нажмите «Оформить заказ» или «Быстрый заказ» — тогда менеджер перезвонит сам с 10:00 до 20:00.</p>
          <p>Заказы принимаем и в Telegram или MAX. Наш сервис запоминает данные прошлого заказа и предложит их в следующий раз.</p>
        </div>
        <div v-else-if="tab === 'Оплата'" class="oy-ptabs__grid">
          <div v-for="pm in oyPayment" :key="pm.title" class="oy-panel"><b>{{ pm.title }}</b><p>{{ pm.text }}</p></div>
        </div>
        <div v-else-if="tab === 'Доставка'" class="oy-ptabs__ship">
          <div class="oy-ptabs__grid">
            <div v-for="d in oyDelivery" :key="d.id" class="oy-panel">
              <b>{{ d.title }}</b>
              <span class="oy-ptabs__price">{{ d.price === null ? 'по тарифу Яндекса' : d.price === 0 ? 'бесплатно' : oyMoney(d.price) }}</span>
              <p>{{ d.note }}</p>
            </div>
          </div>
          <ul class="oy-check">
            <li v-for="r in oyDeliveryRules" :key="r"><OyIcon name="check" :size="18" /><span>{{ r }}</span></li>
          </ul>
        </div>
        <ul v-else class="oy-check">
          <li v-for="r in oyStorage" :key="r"><OyIcon name="snow" :size="18" /><span>{{ r }}</span></li>
        </ul>
      </div>
    </section>

    <section v-if="similar.length" class="oy-sec">
      <div class="oy-head">
        <h2>Похожие товары</h2>
        <NuxtLink v-if="sec" :to="oyPath(`/catalog/${sec.id}/`)" class="oy-head__link">Весь раздел <OyIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <OyShelf :items="similar" />
    </section>

    <section class="oy-sec">
      <div class="oy-head"><h2>Статьи</h2></div>
      <div class="oy-arts">
        <a v-for="a in articles" :key="a.url" :href="a.url" target="_blank" rel="noopener" class="oy-art">
          <img :src="a.img" alt="" loading="lazy" width="400" height="260" />
          <small>{{ a.cat }}</small>
          <b>{{ a.title }}</b>
        </a>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.oy-prod {
  &__top { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 40px; align-items: start; @media (max-width: 989px) { grid-template-columns: minmax(0, 1fr); gap: 24px; } }
}
.oy-gallery {
  position: sticky; top: 100px; display: grid; gap: 12px;
  &__main { position: relative; aspect-ratio: 1; border-radius: 20px; overflow: hidden; background: var(--oy-surface2); img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; } }
  &__thumbs {
    display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none;
    button { flex: 0 0 76px; height: 76px; border-radius: 12px; overflow: hidden; border: 2px solid transparent; &.is-on { border-color: var(--oy-accent); } }
    img { width: 100%; height: 100%; object-fit: cover; }
  }
  @media (max-width: 989px) { position: static; max-width: 560px; }
}
.oy-buybox {
  display: grid; gap: 18px;
  h1 { font-size: 42px; @media (max-width: 768px) { font-size: 32px; } }
  &__meta { display: flex; flex-wrap: wrap; gap: 8px 18px; font-size: 14px; color: var(--oy-muted); b { color: var(--oy-ink); font-weight: 600; } }
  &__stock { display: inline-flex; align-items: center; gap: 6px; color: var(--oy-ok); font-weight: 700; &--order { color: var(--oy-gold); } }
  &__group { display: grid; gap: 10px; > b { font-size: 14px; color: var(--oy-ink); } }
  &__sizes { display: flex; flex-wrap: wrap; gap: 8px; }
  &__price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 6px 10px; b { font-size: 36px; color: var(--oy-ink); font-weight: 700; } s { color: var(--oy-muted); } .oy-unit { font-size: 15px; } }
  &__ask { font-size: 22px !important; color: var(--oy-gold) !important; }
  &__note { display: flex; gap: 8px; align-items: center; font-size: 14px; color: var(--oy-muted); .oy-icon { color: var(--oy-accent); flex: none; } }
  &__svc { display: grid; gap: 6px; padding: 14px 16px; border-radius: 14px; background: var(--oy-surface); p { font-size: 13px; color: var(--oy-muted); padding-left: 28px; } }
  &__buy { display: flex; flex-wrap: wrap; gap: 10px; .oy-qty { height: 52px; } }
  &__acts {
    display: flex; flex-wrap: wrap; gap: 6px 18px;
    button { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--oy-ink); &:hover, &.is-on { color: var(--oy-accent); } }
  }
  &__ship {
    display: grid; gap: 14px; padding: 18px; border-radius: 16px; border: 1px solid var(--oy-line);
    > div { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 12px; color: var(--oy-accent); }
    span { display: grid; gap: 2px; }
    b { color: var(--oy-ink); font-size: 14px; }
    small { color: var(--oy-muted); font-size: 13px; }
  }
  @media (max-width: 576px) {
    &__buy { .oy-qty { width: 100%; grid-template-columns: 52px 1fr 52px; } .oy-btn { flex: 1 1 100%; } }
  }
}
.oy-ptabs {
  margin-top: 56px;
  &__nav { margin-bottom: 20px; @media (max-width: 768px) { flex-wrap: nowrap; overflow-x: auto; max-width: 100%; scrollbar-width: none; &::-webkit-scrollbar { display: none; } } }
  &__desc { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 32px; align-items: start; @media (max-width: 989px) { grid-template-columns: minmax(0, 1fr); } }
  &__revs { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; align-items: start; @media (max-width: 989px) { grid-template-columns: minmax(0, 1fr); } }
  &__norev { justify-items: start; text-align: left; padding: 28px; }
  &__form { display: grid; gap: 14px; h3 { font-size: 26px; } }
  &__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; .oy-panel { display: grid; gap: 6px; align-content: start; } b { color: var(--oy-ink); } p { font-size: 14px; color: var(--oy-muted); } }
  &__price { font-weight: 700; color: var(--oy-accent); }
  &__ship { display: grid; gap: 20px; }
}
.oy-props {
  width: 100%; border-collapse: collapse; font-size: 14px;
  th, td { padding: 10px 0; border-bottom: 1px solid var(--oy-line); text-align: left; vertical-align: top; }
  th { color: var(--oy-muted); font-weight: 500; width: 45%; padding-right: 16px; }
  td { color: var(--oy-ink); font-weight: 600; }
}
.oy-rate { display: flex; gap: 4px; button { color: #c9d6d5; &.is-on { color: #e0a63a; } } .oy-icon path { fill: currentColor; } }
.oy-arts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; @media (max-width: 576px) { grid-template-columns: minmax(0, 1fr); } }
.oy-art {
  display: grid; gap: 8px; align-content: start;
  img { width: 100%; height: auto; aspect-ratio: 400 / 260; object-fit: cover; border-radius: 14px; }
  small { color: var(--oy-muted); font-size: 12px; }
  b { color: var(--oy-ink); line-height: 1.35; }
  &:hover b { color: var(--oy-accent); }
}
</style>
