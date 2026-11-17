<script lang="ts" setup>
// Карточка товара: как у них — фото, вес/фасовка, условия хранения, срок годности, города доставки, «Назад»;
// плюс оптовая цена с датой и ссылкой на новость/прайс, сумма за коробку, «В заявку», вопрос через «Написать нам».
import { mlByBox, mlCities, mlContacts, mlDate, mlFresh, mlGroupOf, mlPath, mlProduct, mlRub, mlRub0, mlSrcNews, mlStale, mlSubName, mlUnitShort } from '~/utils/moreland'
import { mlProducts } from '~/utils/moreland.data'
import { useMlList, useMlUi } from '~/composables/useMoreland'
import MlBuy from '~/components/redesign/moreland/MlBuy.vue'
import MlCard from '~/components/redesign/moreland/MlCard.vue'
import MlIcon from '~/components/redesign/moreland/MlIcon.vue'

const route = useRoute()
const router = useRouter()
const p = computed(() => mlProduct(String(route.params.slug)))
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден', fatal: false })

useSeoMeta({ title: () => `${p.value?.n ?? 'Товар'} — Морелэнд | Концепт редизайна` })

const list = useMlList()
const ui = useMlUi()
const group = computed(() => mlGroupOf(p.value!.sec))
const news = computed(() => mlSrcNews(p.value!))
const q = computed(() => list.qty(p.value!.id))
const pack = computed(() => (mlByBox(p.value!) ? `в коробке ${p.value!.box} кг` : p.value!.pack || ''))
const rows = computed(() =>
  [
    ['Вес', pack.value],
    ['Условия хранения', p.value!.storage],
    ['Срок годности', p.value!.life],
    ['Раздел', mlSubName(p.value!.sec)],
  ].filter((r) => r[1]) as [string, string][],
)
const related = computed(() => mlProducts.filter((x) => x.sec === p.value!.sec && x.id !== p.value!.id).slice(0, 4))
const ask = () =>
  (ui.write.value = { open: true, text: `Здравствуйте! Интересует «${p.value!.n}». Подскажите цену и наличие на ближайшую отгрузку.` })
const back = () => (window.history.length > 1 ? router.back() : router.push(mlPath(`/produkcija/${group.value.id}/`)))
</script>

<template>
  <div v-if="p" class="ml-wrap ml-prod">
    <nav class="ml-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mlPath('/')">Главная</NuxtLink></span>
      <span><NuxtLink :to="mlPath('/produkcija/')">Продукция</NuxtLink></span>
      <span><NuxtLink :to="mlPath(`/produkcija/${group.id}/`)">{{ group.name }}</NuxtLink></span>
      <span>{{ p.n }}</span>
    </nav>

    <div class="ml-prod__grid">
      <div class="ml-prod__ph">
        <img :src="p.img" :alt="p.n" width="540" height="405" />
        <span v-if="mlFresh(p)" class="ml-tag ml-tag--fresh"><MlIcon name="smoke" />Свежая партия</span>
      </div>

      <div class="ml-prod__info">
        <span class="ml-card__sec">{{ mlSubName(p.sec) }}</span>
        <h1>{{ p.n }}</h1>
        <div class="ml-card__chips">
          <span v-if="pack" class="ml-chip"><MlIcon name="box" />{{ pack }}</span>
          <span v-if="p.life" class="ml-chip"><MlIcon name="clock" />{{ p.life }}</span>
          <span v-if="p.storage" class="ml-chip"><MlIcon name="snow" />{{ p.storage }}</span>
        </div>

        <div class="ml-buybox">
          <template v-if="p.price">
            <div class="ml-buybox__price">
              <b>{{ mlRub(p.price) }}</b><span>за {{ mlUnitShort(p) }}, опт{{ p.sec === 'pr' ? ', с НДС' : '' }}</span>
            </div>
            <p v-if="mlByBox(p)" class="ml-buybox__box">Коробка {{ p.box }} кг ≈ <b>{{ mlRub0(p.price * p.box!) }}</b></p>
            <p v-if="p.old" class="ml-buybox__old">В прайсе от 01.01.2026 было {{ mlRub0(p.old) }} за кг</p>
          </template>
          <div v-else class="ml-buybox__price"><b class="is-ask">Цена по запросу</b></div>
          <p class="ml-buybox__src" :class="{ 'is-stale': mlStale(p) }">
            <MlIcon name="doc" />
            <span v-if="p.pdate">
              Цена от {{ mlDate(p.pdate) }} —
              <NuxtLink v-if="news" :to="mlPath(`/novosti/${news.id}/`)">{{ p.src }}</NuxtLink>
              <template v-else>{{ p.src }}</template>.
              {{ mlStale(p) ? 'Цена старше года — уточните у менеджера.' : 'Точную цену на день отгрузки подтвердит менеджер.' }}
            </span>
            <span v-else>Цены нет в прайсе — назовём при заявке.</span>
          </p>
          <div class="ml-buybox__acts">
            <MlBuy :p="p" big />
            <button type="button" class="ml-btn ml-btn--line" @click="ask"><MlIcon name="mail" />Спросить</button>
          </div>
          <NuxtLink v-if="q" :to="mlPath('/zayavka/')" class="ml-buybox__go">В заявке: {{ q }} {{ mlByBox(p) ? 'кор.' : 'шт' }} — перейти к заявке<MlIcon name="right" /></NuxtLink>
        </div>

        <table class="ml-specs">
          <tbody>
            <tr v-for="r in rows" :key="r[0]"><th>{{ r[0] }}</th><td>{{ r[1] }}</td></tr>
          </tbody>
        </table>

        <div class="ml-prod__ship">
          <MlIcon name="truck" />
          <p>Бесплатная доставка в черте Омска. Отгружаем в {{ mlCities.slice(1).join(', ') }} и другие регионы России и Казахстана. Работаем с юр. лицами и ИП, опт от коробки. Вопросы — {{ mlContacts.phone }}.</p>
        </div>
        <button type="button" class="ml-prod__back" @click="back"><MlIcon name="left" />Назад</button>
      </div>
    </div>

    <section v-if="related.length" class="ml-section">
      <div class="ml-sechead">
        <h2 class="ml-h2">Ещё в разделе</h2>
        <NuxtLink :to="mlPath(`/produkcija/${group.id}/`)" class="ml-sechead__link">{{ group.name }}<MlIcon name="right" /></NuxtLink>
      </div>
      <div class="ml-grid"><MlCard v-for="x in related" :key="x.id" :p="x" /></div>
    </section>
  </div>
</template>

<style lang="scss">
.ml-prod {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 40px;
    align-items: start;
    padding-top: 20px;
  }
  &__ph {
    position: sticky;
    top: calc(var(--ml-head) + 16px);
    aspect-ratio: 4 / 3;
    border-radius: 20px;
    overflow: hidden;
    background: var(--ml-surf);
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .ml-tag {
      position: absolute;
      left: 14px;
      top: 14px;
    }
  }
  &__info {
    min-width: 0;
    h1 {
      margin-top: 4px;
      font-size: clamp(28px, 3vw, 40px);
      font-weight: 800;
    }
    .ml-card__chips {
      margin-top: 14px;
    }
  }
  &__ship {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    padding: 16px 18px;
    border-radius: var(--ml-R);
    background: var(--ml-surf);
    font-size: 14px;
    .ml-icon {
      color: var(--ml-acc);
      margin-top: 2px;
    }
  }
  &__back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 18px;
    padding: 0;
    border: 0;
    background: none;
    font-weight: 800;
    color: var(--ml-acc);
  }
  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 20px;
    }
    &__ph {
      position: relative;
      top: 0;
    }
  }
}
.ml-buybox {
  margin-top: 22px;
  padding: 22px;
  border: 1px solid var(--ml-line);
  border-radius: var(--ml-R);
  &__price {
    display: flex;
    align-items: baseline;
    gap: 4px 10px;
    flex-wrap: wrap;
    b {
      font: 800 34px/1.1 'Nunito Sans', sans-serif;
      color: var(--ml-ink);
      font-variant-numeric: tabular-nums;
      &.is-ask {
        font-size: 24px;
      }
    }
    span {
      color: var(--ml-mute);
    }
  }
  &__box {
    margin-top: 6px !important;
    font-size: 16px;
    b {
      color: var(--ml-ink);
    }
  }
  &__old {
    margin-top: 4px !important;
    font-size: 13.5px;
    color: var(--ml-mute);
  }
  &__src {
    display: flex;
    gap: 8px;
    margin-top: 14px !important;
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--ml-surf);
    font-size: 13.5px;
    .ml-icon {
      width: 18px;
      height: 18px;
      color: var(--ml-acc);
      margin-top: 1px;
    }
    a {
      color: var(--ml-acc);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    &.is-stale {
      background: var(--ml-amb-soft);
      color: var(--ml-amb);
      .ml-icon {
        color: var(--ml-amb);
      }
    }
  }
  &__acts {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    margin-top: 16px;
  }
  &__go {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 12px;
    font-weight: 800;
    font-size: 14px;
    color: var(--ml-acc);
    .ml-icon {
      width: 16px;
      height: 16px;
    }
  }
  @media (max-width: 576px) {
    padding: 16px;
    &__price b {
      font-size: 28px;
    }
  }
}
table.ml-specs {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  font-size: 14.5px;
  th,
  td {
    padding: 10px 0;
    border-bottom: 1px solid var(--ml-line);
    text-align: left;
    vertical-align: top;
  }
  th {
    width: 42%;
    font-weight: 600;
    color: var(--ml-mute);
    padding-right: 16px;
  }
  td {
    color: var(--ml-ink);
    font-weight: 700;
  }
}
</style>
