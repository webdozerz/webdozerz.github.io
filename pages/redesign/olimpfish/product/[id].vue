<script lang="ts" setup>
import { olContacts, olDisc, olGrams, olOld, olPath, olPrice, olProduct, olRub, olSection, olSrc, olUnit } from '~/utils/olimpfish'
import { olProducts } from '~/utils/olimpfishData'
import OlShelf from '~/components/redesign/olimpfish/OlShelf.vue'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'
import { useOlShop, useOlUi } from '~/composables/useOlimpfish'

const route = useRoute()
const shop = useOlShop()
const ui = useOlUi()

const p = computed(() => olProduct(String(route.params.id)))
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден', fatal: true })
useSeoMeta({ title: () => `${p.value?.n ?? 'Товар'} — Олимп | Концепт редизайна` })

const sec = computed(() => olSection(p.value!.sec))
const g = ref(p.value!.w ? p.value!.w.g[0] : 0)
const n = ref(1)
const price = computed(() => olPrice(p.value!, g.value))
const old = computed(() => olOld(p.value!, g.value))
const tab = ref<'about' | 'info'>(p.value!.about ? 'about' : 'info')
const on = computed(() => shop.fav.value.includes(p.value!.id))
const inCart = computed(() => shop.qtyOf(p.value!.id, g.value))
const same = computed(() => olProducts.filter((x) => x.sec === p.value!.sec && x.id !== p.value!.id).slice(0, 10))
const other = computed(() => olProducts.filter((x) => x.sec !== p.value!.sec && !x.out && (x.sec === 'ikra' || x.sec === 'osetr' || x.sec === 'nabory')).slice(0, 10))
const add = () => {
  shop.add(p.value!, g.value, n.value)
  n.value = 1
}
watch(
  () => route.params.id,
  () => {
    g.value = p.value?.w ? p.value.w.g[0] : 0
    n.value = 1
    tab.value = p.value?.about ? 'about' : 'info'
  },
)
onMounted(() => shop.persist())
</script>

<template>
  <div v-if="p" class="ol-wrap ol-page ol-prod">
    <nav class="ol-crumbs" aria-label="Навигация">
      <NuxtLink :to="olPath('/')">Главная</NuxtLink>
      <span><NuxtLink :to="olPath('/catalog')">Продукция</NuxtLink></span>
      <span><NuxtLink :to="olPath(`/catalog/${p.sec}`)">{{ sec?.name }}</NuxtLink></span>
    </nav>

    <div class="ol-prod__grid">
      <div class="ol-prod__ph">
        <img :src="olSrc(p.img)" :alt="p.full" width="900" height="900" />
        <span v-if="olDisc(p)" class="ol-card__tag">−{{ olDisc(p) }}%</span>
      </div>

      <div class="ol-prod__info">
        <h1>{{ p.w ? p.n : p.full }}</h1>
        <p v-if="p.out" class="ol-prod__stock is-out">Нет в наличии</p>
        <p v-else class="ol-prod__stock"><OlIcon name="check" />В наличии · заказ 24/7, привезём завтра</p>

        <div v-if="p.w" class="ol-prod__weights">
          <span>Вес</span>
          <div class="ol-chips">
            <button v-for="x in p.w.g" :key="x" type="button" class="ol-chip" :class="{ 'is-on': g === x }" @click="g = x">{{ olGrams(x) }}</button>
          </div>
        </div>
        <p v-else-if="p.u" class="ol-prod__unit">Фасовка: <b>{{ olUnit(p) }}</b></p>

        <div class="ol-prod__price">
          <b>{{ olRub(price) }}</b>
          <s v-if="old">{{ olRub(old) }}</s>
          <span v-if="p.w">{{ olRub(p.w.kg) }} за кг · {{ olGrams(g) }}</span>
        </div>
        <p v-if="p.w" class="ol-prod__note">Товар весовой, итоговая сумма может измениться при формировании заказа на складе. Уточняйте детали заказа у менеджера.</p>

        <div v-if="!p.out" class="ol-prod__buy">
          <div class="ol-qty">
            <button type="button" aria-label="Меньше" @click="n = Math.max(1, n - 1)"><OlIcon name="minus" /></button>
            <span>{{ n }}&nbsp;шт</span>
            <button type="button" aria-label="Больше" @click="n = Math.min(99, n + 1)"><OlIcon name="plus" /></button>
          </div>
          <button type="button" class="ol-btn ol-btn--acc ol-btn--big" @click="add">{{ inCart ? `В корзине ${inCart} · добавить` : 'В корзину' }}</button>
          <button type="button" class="ol-btn ol-btn--line ol-btn--big" @click="ui.open('quick', p.id, g)"><OlIcon name="bolt" />Быстрая покупка</button>
          <button type="button" class="ol-prod__fav" :class="{ 'is-on': on }" :aria-pressed="on" aria-label="В избранное" @click="shop.toggleFav(p.id)"><OlIcon name="heart" /></button>
        </div>
        <div v-else class="ol-prod__buy">
          <button type="button" class="ol-btn ol-btn--line ol-btn--big" @click="ui.open('callback')">Узнать о поступлении</button>
        </div>

        <ul class="ol-prod__ship">
          <li><OlIcon name="truck" /><span><b>По Москве в пределах МКАД — 350 ₽</b>при заказе от 5 000 ₽, сегодня на завтра</span></li>
          <li><OlIcon name="bolt" /><span><b>Срочная доставка за 3 часа</b>от 500 ₽, оплата онлайн</span></li>
          <li><OlIcon name="pin" /><span><b>Самовывоз бесплатно</b>{{ olContacts.address }}, {{ olContacts.metro }}</span></li>
        </ul>
        <NuxtLink :to="olPath('/delivery')" class="ol-link">Все условия доставки и оплаты<OlIcon name="right" /></NuxtLink>
      </div>
    </div>

    <section class="ol-prod__tabs">
      <div class="ol-seg" role="tablist">
        <button type="button" role="tab" :aria-selected="tab === 'about'" :class="{ 'is-on': tab === 'about' }" @click="tab = 'about'">Описание</button>
        <button type="button" role="tab" :aria-selected="tab === 'info'" :class="{ 'is-on': tab === 'info' }" @click="tab = 'info'">Детали</button>
      </div>
      <div v-if="tab === 'about'" class="ol-prod__about">
        <p v-if="p.about">{{ p.about }}</p>
        <p v-else>Натуральный продукт производства ООО «ТК «Олимп». Подробности о составе, сроке и условиях хранения — во вкладке «Детали».</p>
      </div>
      <dl v-else class="ol-prod__table">
        <div v-for="[k, v] in p.info" :key="k"><dt>{{ k }}</dt><dd>{{ v }}</dd></div>
        <div><dt>Раздел</dt><dd>{{ sec?.name }}</dd></div>
        <div v-if="!p.info.length"><dt>Производитель</dt><dd>ООО «ТК «Олимп»</dd></div>
      </dl>
    </section>

    <section v-if="same.length" class="ol-sec">
      <div class="ol-head"><h2>Похожие товары</h2></div>
      <OlShelf :items="same" />
    </section>
    <section class="ol-sec">
      <div class="ol-head"><h2>Вам также будет интересно</h2></div>
      <OlShelf :items="other" />
    </section>
  </div>
</template>

<style lang="scss">
.ol .ol-prod {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 40px;
    align-items: start;
  }
  &__ph {
    position: sticky;
    top: calc(var(--ol-bar) + 20px);
    aspect-ratio: 1;
    border: 1px solid var(--ol-line);
    border-radius: 20px;
    background: #fff;
    overflow: hidden;
    img {
      position: absolute;
      inset: 24px;
      width: calc(100% - 48px);
      height: calc(100% - 48px);
      object-fit: contain;
    }
  }
  &__info {
    display: grid;
    gap: 16px;
    justify-items: start;
    h1 {
      font-size: 32px;
    }
  }
  &__stock {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: var(--ol-green);
    .ol-icon {
      width: 18px;
      height: 18px;
    }
    &.is-out {
      color: var(--ol-mute);
    }
  }
  &__weights {
    display: grid;
    gap: 8px;
    > span {
      font-size: 13px;
      font-weight: 600;
      color: var(--ol-mute);
    }
    .ol-chip {
      min-height: 38px;
      padding: 0 14px;
      font-size: 14px;
    }
  }
  &__unit b {
    color: var(--ol-ink);
  }
  &__price {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 14px;
    font-variant-numeric: tabular-nums;
    b {
      font-size: 36px;
      font-weight: 800;
      color: var(--ol-ink);
    }
    s {
      font-size: 18px;
      color: var(--ol-mute);
    }
    span {
      font-size: 15px;
      color: var(--ol-mute);
    }
  }
  &__note {
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--ol-soft);
    font-size: 14px;
    color: var(--ol-text);
  }
  &__buy {
    display: grid;
    grid-template-columns: 150px minmax(0, 1fr) 52px;
    grid-template-areas: 'q a f' 'k k k';
    gap: 10px;
    width: 100%;
    max-width: 560px;
    .ol-qty {
      grid-area: q;
    }
    .ol-btn--acc {
      grid-area: a;
    }
    .ol-btn--line {
      grid-area: k;
    }
    .ol-prod__fav {
      grid-area: f;
    }
    .ol-qty {
      width: 150px;
      min-height: 52px;
      button {
        height: 52px;
      }
    }
  }
  &__buy:has(> :only-child) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'k';
  }
  &__fav,
  &__fav:focus {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    border: 1px solid var(--ol-line);
    border-radius: var(--ol-r);
    background: #fff;
    color: var(--ol-mute);
    &:hover {
      color: var(--ol-acc);
    }
    &.is-on {
      color: var(--ol-hi);
      .ol-icon {
        fill: currentColor;
      }
    }
  }
  ul.ol-prod__ship {
    margin: 4px 0 0;
    padding: 18px;
    display: grid;
    gap: 12px;
    border-radius: var(--ol-R);
    background: var(--ol-surf);
    width: 100%;
    box-sizing: border-box;
    li {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .ol-icon {
      color: var(--ol-acc);
      margin-top: 2px;
    }
    span {
      display: grid;
      font-size: 14px;
      color: var(--ol-mute);
    }
    b {
      color: var(--ol-ink);
      font-size: 14.5px;
    }
  }
  &__tabs {
    margin-top: 48px;
    display: grid;
    gap: 18px;
    justify-items: start;
  }
  &__about {
    max-width: 860px;
    font-size: 16px;
    line-height: 1.7;
  }
  &__table {
    width: 100%;
    max-width: 860px;
    display: grid;
    > div {
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      gap: 12px;
      padding: 11px 0;
      border-bottom: 1px solid var(--ol-line);
    }
    dt {
      color: var(--ol-mute);
    }
    dd {
      color: var(--ol-ink);
      font-weight: 500;
    }
  }
}
@media (max-width: 989px) {
  .ol .ol-prod {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
    &__ph {
      position: relative;
      top: 0;
      max-width: 520px;
      width: 100%;
    }
  }
}
@media (max-width: 576px) {
  .ol .ol-prod {
    &__info h1 {
      font-size: 24px;
    }
    &__price b {
      font-size: 30px;
    }
    &__buy {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 52px;
      grid-template-areas: 'q f' 'a a' 'k k';
      width: 100%;
      .ol-qty {
        grid-area: q;
        width: auto;
      }
      .ol-btn--acc {
        grid-area: a;
      }
      .ol-btn--line {
        grid-area: k;
      }
      .ol-prod__fav {
        grid-area: f;
      }
    }

    &__table > div {
      grid-template-columns: minmax(0, 1fr);
      gap: 2px;
    }
  }
}
</style>
