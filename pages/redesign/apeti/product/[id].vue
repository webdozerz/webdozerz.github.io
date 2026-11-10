<script lang="ts" setup>
import { AP_ORIG, apAsset, apDisc, apImg, apInSection, apMoney, apNum, apPath, apProduct, apRub, apSection, apServices, apWeight, apWhen } from '~/utils/apeti'
import { apDetails } from '~/utils/apetiData'
import { useApShop, useApUi } from '~/composables/useApeti'
import ApIcon from '~/components/redesign/apeti/ApIcon.vue'
import ApQty from '~/components/redesign/apeti/ApQty.vue'
import ApShelf from '~/components/redesign/apeti/ApShelf.vue'

const route = useRoute()
const shop = useApShop()
const ui = useApUi()
const p = computed(() => apProduct(String(route.params.id)))
const sec = computed(() => (p.value ? apSection(p.value.s) : undefined))
const det = computed(() => (p.value ? apDetails[p.value.id] : undefined))
const disc = computed(() => (p.value ? apDisc(p.value) : 0))
const img = computed(() => (p.value ? (det.value?.big ? AP_ORIG + det.value.big : apImg(p.value)) : ''))

const n = ref(1)
const svc = ref(false)
const service = computed(() => (p.value?.v ? apServices[p.value.v] : null))
const sum = computed(() => (p.value ? Math.round(p.value.p * n.value * 100) / 100 : 0))
const inCart = computed(() => (p.value ? shop.lines.value.filter((l) => l.p.id === p.value!.id).reduce((s, l) => s + l.n, 0) : 0))
const isFav = computed(() => !!p.value && shop.fav.value.includes(p.value.id))
watch(
  () => route.params.id,
  () => {
    n.value = 1
    svc.value = false
    tab.value = 'desc'
  },
)

const chars = computed(() => {
  if (!p.value) return []
  const own: string[][] = det.value?.chars ?? []
  return [...own.filter((c) => c[0] !== 'Вес'), [p.value.k ? 'Продаётся' : 'Единица', p.value.k ? `на вес, шаг ${apNum(p.value.q)} кг` : 'штука'], ['Артикул', p.value.a || '—']]
})
const tab = ref<'desc' | 'rev' | 'del' | 'pay'>('desc')
const myRevs = ref<{ name: string; date: string; plus: string; minus: string; text: string }[]>([])
const revs = computed(() => [...myRevs.value, ...(det.value?.revs ?? [])])
const rev = reactive({ name: '', mail: '', plus: '', minus: '', text: '', sub: false })
const sendRev = () => {
  myRevs.value.unshift({ name: rev.name, date: new Date().toLocaleDateString('ru-RU'), plus: rev.plus, minus: rev.minus, text: rev.text })
  Object.assign(rev, { name: '', mail: '', plus: '', minus: '', text: '', sub: false })
}
const similar = computed(() => (p.value ? apInSection(p.value.s).filter((x) => x.id !== p.value!.id).slice(0, 10) : []))

const now = ref<Date | null>(null)
const when = computed(() => (now.value ? apWhen(now.value) : null))
onMounted(() => (now.value = new Date()))

useSeoMeta({ title: () => `${p.value?.n ?? 'Товар'} — Apeti, концепт редизайна` })
</script>

<template>
  <div class="ap-wrap ap-page">
    <template v-if="p">
      <nav class="ap-crumbs" aria-label="Хлебные крошки">
        <NuxtLink :to="apPath('/')">Главная</NuxtLink>
        <NuxtLink :to="apPath('/catalog')">Каталог</NuxtLink>
        <NuxtLink v-if="sec" :to="apPath(`/catalog/${sec.slug}`)">{{ sec.name }}</NuxtLink>
        <span>{{ p.n }}</span>
      </nav>

      <div class="ap-prod">
        <div class="ap-prod__pic">
          <img :src="img" :alt="p.n" width="600" height="600" />
          <img v-if="p.g" class="ap-prod__sticker" :src="apAsset('label.svg')" alt="Отобрано по качеству" width="72" height="72" />
          <span v-if="disc" class="ap-card__disc">−{{ disc }}%</span>
        </div>

        <div class="ap-prod__info">
          <div class="ap-prod__meta">
            <span>Артикул: {{ p.a || '—' }}</span>
            <span class="is-ok"><ApIcon name="check" />В наличии</span>
            <button v-if="det?.rating" type="button" class="ap-prod__rate" @click="tab = 'rev'"><ApIcon name="star" /><b>{{ det.rating.replace('.', ',') }}</b>{{ revs.length ? ` · отзывов: ${revs.length}` : '' }}</button>
          </div>
          <h1>{{ p.n }}</h1>
          <p v-if="p.g" class="ap-prod__green">Отмечен зелёным стикером — прошёл наш отбор по качеству.</p>

          <div class="ap-buy">
            <div class="ap-buy__price">
              <p><b>{{ apMoney(p.k ? p.r : p.p) }}</b><span>{{ p.k ? '/ 1 кг' : '/ шт' }}</span></p>
              <small v-if="disc">было {{ apMoney(p.k ? Math.round((p.o / p.q) * 100) / 100 : p.o) }}</small>
            </div>
            <div class="ap-buy__row">
              <ApQty :text="apWeight(p, n)" @dec="n = Math.max(1, n - 1)" @inc="n += 1" />
              <div class="ap-buy__sum"><span>Сумма</span><b>{{ apMoney(sum) }}</b></div>
            </div>
            <p v-if="p.k" class="ap-buy__note">Сумма может немного измениться при контрольном взвешивании.</p>
            <label v-if="service" class="ap-check ap-buy__svc"><input v-model="svc" type="checkbox" /><span>{{ service.text }}</span></label>
            <div class="ap-buy__btns">
              <button type="button" class="ap-btn ap-btn--big" @click="shop.add(p, n, svc)"><ApIcon name="cart" />Купить</button>
              <button type="button" class="ap-btn ap-btn--big ap-btn--line" @click="ui.open('quick', p.id)">Купить в 1 клик</button>
              <button type="button" class="ap-buy__fav" :class="{ 'is-on': isFav }" :aria-label="isFav ? 'Убрать из избранного' : 'В избранное'" @click="shop.toggleFav(p.id)"><ApIcon name="heart" /></button>
            </div>
            <p v-if="inCart" class="ap-buy__in"><ApIcon name="check" />В корзине {{ apWeight(p, inCart) }} · <NuxtLink :to="apPath('/cart')">перейти в корзину</NuxtLink></p>
          </div>

          <div class="ap-prod__del">
            <ApIcon name="truck" />
            <p>
              <b v-if="when">{{ when.today ? `Привезём сегодня, ближайшее окно ${when.slot}` : `Привезём завтра, ${when.date}, с 9:00` }}</b>
              <b v-else>Закажите до 19:00 — привезём сегодня</b>
              <span>
                {{ shop.z.value ? `${shop.z.value.short}: заказ от ${apRub(shop.z.value.min)}, доставка ${apRub(shop.z.value.fee)}.` : `Минимальная сумма заказа — от ${apRub(shop.min.value)}.` }}
                <button type="button" class="ap-link" @click="ui.open('zone')">{{ shop.z.value ? 'Изменить район' : 'Выбрать район' }}</button>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div class="ap-ptabs">
        <div class="ap-ptabs__nav" role="tablist">
          <button type="button" :class="{ 'is-on': tab === 'desc' }" @click="tab = 'desc'">Описание</button>
          <button type="button" :class="{ 'is-on': tab === 'rev' }" @click="tab = 'rev'">Отзывы ({{ revs.length }})</button>
          <button type="button" :class="{ 'is-on': tab === 'del' }" @click="tab = 'del'">Доставка</button>
          <button type="button" :class="{ 'is-on': tab === 'pay' }" @click="tab = 'pay'">Оплата</button>
        </div>

        <div v-if="tab === 'desc'" class="ap-ptabs__body ap-ptabs__desc">
          <div class="ap-prose">
            <template v-if="det?.desc.length">
              <template v-for="(l, i) in det.desc" :key="i">
                <h3 v-if="l.length < 28 && !l.startsWith('-')">{{ l }}</h3>
                <p v-else>{{ l.replace(/^- /, '— ') }}</p>
              </template>
            </template>
            <p v-else>{{ p.n }}. Подробное описание, состав и условия хранения — в карточке товара на сайте магазина; в концепт перенесена выборка каталога с ценами.</p>
          </div>
          <dl class="ap-chars">
            <div v-for="c in chars" :key="c[0]"><dt>{{ c[0] }}</dt><dd>{{ c[1] }}</dd></div>
          </dl>
        </div>

        <div v-else-if="tab === 'rev'" class="ap-ptabs__body ap-ptabs__rev">
          <div class="ap-revs">
            <p v-if="!revs.length" class="ap-revs__none">Отзывов пока нет — будьте первым.</p>
            <article v-for="(r, i) in revs" :key="i">
              <header><b>{{ r.name }}</b><time>{{ r.date }}</time></header>
              <p v-if="r.plus"><span>Достоинства:</span> {{ r.plus }}</p>
              <p v-if="r.minus"><span>Недостатки:</span> {{ r.minus }}</p>
              <p v-if="r.text">{{ r.text }}</p>
            </article>
          </div>
          <form class="ap-form ap-panel" @submit.prevent="sendRev">
            <h2>Добавьте свой отзыв</h2>
            <label class="ap-field"><span>Ваше имя</span><input v-model="rev.name" type="text" required /></label>
            <label class="ap-field"><span>Ваш e-mail</span><input v-model="rev.mail" type="email" required /></label>
            <label class="ap-field"><span>Достоинства</span><input v-model="rev.plus" type="text" /></label>
            <label class="ap-field"><span>Недостатки</span><input v-model="rev.minus" type="text" /></label>
            <label class="ap-field"><span>Комментарий</span><textarea v-model="rev.text" required minlength="5" /></label>
            <label class="ap-check"><input v-model="rev.sub" type="checkbox" /><span>Подписаться на отзывы</span></label>
            <button type="submit" class="ap-btn">Отправить отзыв</button>
            <p class="ap-modal__note">Демо: отзыв появится только на этой странице и никуда не отправится.</p>
          </form>
        </div>

        <div v-else-if="tab === 'del'" class="ap-ptabs__body ap-prose">
          <p>Доставим заказ на дом или в офис в Москве и в пределах 30 км от МКАД. Минимальная сумма заказа — от 2 000 руб., для части районов выше.</p>
          <p>Доставка ежедневно с 9:00 до 22:00, окна по три часа. Заказы, оформленные до 19:00, приезжают в тот же день. За час до прибытия позвонит курьер.</p>
          <p>Самовывоз с Преображенского рынка — заказ на любую сумму.</p>
          <p><NuxtLink :to="apPath('/delivery')">Таблица районов с суммой заказа и стоимостью доставки</NuxtLink></p>
        </div>

        <div v-else class="ap-ptabs__body ap-prose">
          <p><b>Наличными.</b> Заказ оплачивается наличными при получении в пункте выдачи или курьеру. Вместе с заказом выдаётся кассовый или товарный чек.</p>
          <p><b>Банковской картой.</b> Картой можно оплатить курьеру при доставке: Mastercard, Visa, SberPay.</p>
          <p><b>Баллами.</b> В корзине можно списать баллы программы лояльности: 1 балл = 1 рубль.</p>
        </div>
      </div>

      <section v-if="similar.length" class="ap-sec ap-prod__similar">
        <div class="ap-head"><h2>Похожие товары</h2></div>
        <ApShelf :items="similar" />
      </section>
    </template>

    <div v-else class="ap-empty ap-prod__none">
      <h2>Такого товара в концепте нет</h2>
      <p>В концепт перенесена выборка каталога. Посмотрите разделы — там товары с настоящими ценами.</p>
      <NuxtLink :to="apPath('/catalog')" class="ap-btn">В каталог</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.ap .ap-prod { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 40px; align-items: start; margin-top: 20px;
  &__pic { position: relative; aspect-ratio: 1; border: 1px solid var(--ap-line); border-radius: var(--ap-R); overflow: hidden; background: #fff;
    > img:first-child { position: absolute; inset: 6%; width: 88%; height: 88%; object-fit: contain; }
  }
  &__sticker { position: absolute; left: 18px; bottom: 16px; width: 72px; height: 72px; }
  &__info { display: grid; gap: 16px; align-content: start; min-width: 0;
    h1 { font-size: clamp(26px, 2.8vw, 38px); }
  }
  &__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 18px; font-size: 13px; color: var(--ap-mute);
    .is-ok { display: inline-flex; align-items: center; gap: 4px; color: var(--ap-acc); font-weight: 600; .ap-icon { width: 16px; height: 16px; } }
  }
  &__rate, &__rate:focus { display: inline-flex; align-items: center; gap: 4px; padding: 0; border: 0; background: none; font-size: 13px; color: var(--ap-mute); .ap-icon { width: 15px; height: 15px; color: var(--ap-or); } b { color: var(--ap-ink); } }
  &__green { font-size: 14px; color: var(--ap-acc-d); }
  &__del { display: flex; gap: 14px; align-items: flex-start; padding: 16px 18px; border: 1px solid var(--ap-line); border-radius: var(--ap-R);
    > .ap-icon { width: 26px; height: 26px; color: var(--ap-acc); }
    p { display: grid; gap: 4px; }
    b { font-weight: 600; }
    span { font-size: 14px; color: var(--ap-mute); }
    .ap-link { font-size: 14px; }
  }
  &__similar { padding-bottom: 0; }
  &__none { margin-top: 32px; }
}
.ap .ap-buy { display: grid; gap: 14px; padding: 22px; border-radius: var(--ap-R); background: var(--ap-sur);
  &__price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 14px;
    p { display: flex; align-items: baseline; gap: 6px; white-space: nowrap; }
    b { font-family: var(--ap-head); font-size: 40px; font-weight: 600; line-height: 1; font-variant-numeric: tabular-nums; }
    span { color: var(--ap-mute); }
    small { color: var(--ap-or-d); font-size: 14px; text-decoration: line-through; }
  }
  &__row { display: grid; grid-template-columns: minmax(150px, 190px) minmax(0, 1fr); gap: 20px; align-items: center;
    .ap-qty { background: #fff; }
  }
  &__sum { display: flex; align-items: baseline; gap: 10px; white-space: nowrap;
    span { color: var(--ap-mute); font-size: 14px; }
    b { font-family: var(--ap-head); font-size: 26px; font-weight: 600; font-variant-numeric: tabular-nums; }
  }
  &__note { font-size: 13px; color: var(--ap-mute); }
  &__svc { padding: 12px 14px; border-radius: var(--ap-r); background: #fff; align-items: center; }
  &__btns { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 52px; gap: 10px; }
  &__fav, &__fav:focus { width: 52px; height: 52px; border: 1px solid var(--ap-line); border-radius: var(--ap-r); background: #fff; color: var(--ap-mute); display: grid; place-items: center;
    &:hover { color: var(--ap-or); border-color: var(--ap-or); }
    &.is-on { color: var(--ap-or); .ap-icon { fill: currentColor; } }
  }
  &__in { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; font-size: 14px; color: var(--ap-acc-d); .ap-icon { width: 18px; height: 18px; } a { text-decoration: underline; text-underline-offset: 3px; } }
}
.ap .ap-ptabs { margin-top: 44px;
  &__nav { display: flex; gap: 6px 26px; flex-wrap: wrap; margin-bottom: 22px; border-bottom: 1px solid var(--ap-line);
    button, button:focus { padding: 6px 0 12px; margin-bottom: -1px; border: 0; border-bottom: 3px solid transparent; background: none; font-family: var(--ap-head); font-size: 20px; font-weight: 600; color: var(--ap-mute); white-space: nowrap; }
    button.is-on, button.is-on:focus { color: var(--ap-ink); border-bottom-color: var(--ap-acc); }
  }
  &__desc { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); gap: 40px; align-items: start; }
  &__rev { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 40px; align-items: start; }
}
.ap dl.ap-chars { display: grid; gap: 0; margin: 0; padding: 6px 20px; border-radius: var(--ap-R); background: var(--ap-sur); font-size: 14px;
  div { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--ap-line); }
  div:last-child { border-bottom: 0; }
  dt { color: var(--ap-mute); }
  dd { margin: 0; font-weight: 500; }
}
.ap .ap-revs { display: grid; gap: 12px;
  &__none { color: var(--ap-mute); }
  article { display: grid; gap: 6px; padding: 16px 18px; border: 1px solid var(--ap-line); border-radius: var(--ap-R); }
  header { display: flex; justify-content: space-between; gap: 12px; time { color: var(--ap-mute); font-size: 13px; } }
  p { font-size: 14.5px; span { color: var(--ap-mute); } }
}
@media (max-width: 989px) {
  .ap .ap-prod { grid-template-columns: minmax(0, 1fr); gap: 20px; &__pic { max-width: 520px; width: 100%; justify-self: center; } }
  .ap .ap-ptabs__desc, .ap .ap-ptabs__rev { grid-template-columns: minmax(0, 1fr); gap: 24px; }
}
@media (max-width: 576px) {
  .ap .ap-buy { padding: 16px; &__price b { font-size: 34px; } &__row { grid-template-columns: minmax(0, 1fr); gap: 10px; } &__btns { grid-template-columns: minmax(0, 1fr) 52px; .ap-btn--line { grid-column: 1 / -1; grid-row: 2; } } }
  .ap .ap-ptabs__nav { gap: 2px 18px; button, button:focus { font-size: 17px; } }
  .ap .ap-prod__sticker { width: 56px; height: 56px; }
}
</style>
