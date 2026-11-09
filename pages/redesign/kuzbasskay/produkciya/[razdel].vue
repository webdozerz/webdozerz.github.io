<script lang="ts" setup>
import { kzAnimals, kzBySection, kzContacts, kzEggCats, kzFeedPlant, kzFeeds, kzImg, kzPath, kzPriceMail, kzSales, kzSection, kzSections } from '~/utils/kuzbasskay'
import type { KzSectionId } from '~/utils/kuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzCard from '~/components/redesign/kuzbasskay/KzCard.vue'
import KzMark from '~/components/redesign/kuzbasskay/KzMark.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'
import KzAsk from '~/components/redesign/kuzbasskay/KzAsk.vue'
import KzEggSorter from '~/components/redesign/kuzbasskay/KzEggSorter.vue'
import { useKzUi } from '~/composables/useKuzbasskay'

const route = useRoute()
const ui = useKzUi()
const section = computed(() => kzSection(String(route.params.razdel)))
if (!section.value) throw createError({ statusCode: 404, statusMessage: 'Раздел не найден' })
const s = computed(() => section.value!)
const products = computed(() => kzBySection(s.value.id as KzSectionId))
const isFeed = computed(() => s.value.id === 'kombikorm' || s.value.id === 'premiksy')

useSeoMeta({ title: () => `${s.value.title} — Кузбасская птицефабрика | Концепт редизайна` })

// Корма: фильтр «кому» и раскрытие «подробнее» (у оригинала — отдельные страницы ПК1, ПК2, ПК5, ДК51, КК60)
const animal = ref('all')
const feeds = computed(() => {
  const groups = s.value.id === 'premiksy' ? ['Премикс'] : ['Комбикорм', 'БВМК']
  const re = kzAnimals.find((a) => a.id === animal.value)!.re
  return kzFeeds.filter((f) => groups.includes(f.group) && re.test(f.purpose))
})
const feedGroups = computed(() => {
  const out: { name: string; items: typeof kzFeeds }[] = []
  for (const f of feeds.value) {
    const name = f.group === 'Комбикорм' ? 'Комбикорма и кормосмеси' : f.group === 'БВМК' ? 'БВМК — белково-витаминно-минеральные концентраты' : 'Премиксы'
    let g = out.find((x) => x.name === name)
    if (!g) out.push((g = { name, items: [] }))
    g.items.push(f)
  }
  return out
})
const opened = ref<string | null>(null)
const toggle = (id: string) => {
  opened.value = opened.value === id ? null : id
}
onMounted(() => {
  const h = route.hash.slice(1)
  if (h && kzFeeds.some((f) => f.id === h)) opened.value = h
})

const kolbFeatures = [
  'Птицефабрика расположена в экологически благополучном районе Кемеровской области.',
  'Работает на питательных и сбалансированных зерновых кормах собственного производства.',
  'Продукция изготавливается из собственного 100% охлаждённого куриного мяса, без сои и ГМО.',
  'Контроль безопасности и качества на всех этапах, система ХАССП (ГОСТ Р ИСО 22000-2005).',
  'Кратчайшие сроки доставки от фабрики до прилавка — всегда свежая продукция.',
]
</script>

<template>
  <div>
    <KzHead :title="s.title" :lead="s.short" :crumbs="[{ label: 'Продукция', to: kzPath('/produkciya') }]">
      <nav class="kz-chips kz-secnav" aria-label="Разделы продукции">
        <NuxtLink v-for="x in kzSections" :key="x.id" :to="kzPath(`/produkciya/${x.id}`)" class="kz-chip" :class="{ 'is-on': x.id === s.id }">
          <KzMark :name="x.icon" :size="16" />{{ x.title }}
        </NuxtLink>
      </nav>
    </KzHead>

    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap kz-intro">
        <div class="kz-prose">
          <p v-if="s.gost" class="kz-gost"><KzIcon name="shield" :size="18" />{{ s.gost }}</p>
          <p v-for="t in s.text" :key="t">{{ t }}</p>
        </div>
        <aside class="kz-panel kz-panel--yellow kz-buy">
          <h3>Как купить</h3>
          <p v-if="isFeed">Поставка в мешках и насыпью, отгрузка в автотранспорт, есть подъездные ж/д пути.</p>
          <p v-else>Оптом — через отдел продаж, в розницу — в магазине «Фирменный» в п. Степной.</p>
          <template v-if="isFeed">
            <a v-for="p in kzFeedPlant.phones" :key="p.tel" :href="`tel:${p.tel}`" class="kz-buy__tel"><b>{{ p.phone }}</b><small>завод: {{ p.label.toLowerCase() }}</small></a>
            <a :href="`mailto:${kzFeedPlant.email}?subject=${encodeURIComponent('Цена: ' + s.title.toLowerCase())}`" class="kz-buy__tel"><b>{{ kzFeedPlant.email }}</b><small>почта завода</small></a>
          </template>
          <template v-else>
            <a v-for="p in kzSales.slice(0, 2)" :key="p.tel" :href="`tel:${p.tel}`" class="kz-buy__tel"><b>{{ p.phone }}</b><small>{{ p.label.toLowerCase() }}</small></a>
            <a :href="kzPriceMail(s.title)" class="kz-buy__tel"><b>{{ kzContacts.email }}</b><small>письмо с темой «Цена: {{ s.title }}»</small></a>
            <NuxtLink :to="kzPath('/magazin')" class="kz-link">Магазин «Фирменный»<KzIcon name="arrow" :size="18" /></NuxtLink>
          </template>
        </aside>
      </div>
    </section>

    <!-- Яйцо: калибровка + таблица ГОСТ + маркировка -->
    <section v-if="s.id === 'yajco'" class="kz-sec kz-sec--tight">
      <div class="kz-wrap">
        <KzEggSorter />
        <div class="kz-eggtab">
          <div class="kz-panel kz-panel--white">
            <h3>Категории по массе</h3>
            <table class="kz-table">
              <thead><tr><th>Категория</th><th>Масса одного яйца</th></tr></thead>
              <tbody>
                <tr v-for="c in kzEggCats" :key="c.code"><td>{{ c.name }} ({{ c.code }})</td><td>{{ c.mass }}</td></tr>
              </tbody>
            </table>
          </div>
          <div class="kz-panel kz-panel--white">
            <h3>Что значит маркировка</h3>
            <ul class="kz-checks">
              <li><KzIcon name="check" :size="18" /><span><b>Д — диетические</b>: срок хранения не превышает 7 суток. На яйце — вид, категория и дата сортировки.</span></li>
              <li><KzIcon name="check" :size="18" /><span><b>С — столовые</b>: хранятся от 8 до 25 суток при температуре от 0 до 20 °С. На яйце — только вид и категория.</span></li>
              <li><KzIcon name="check" :size="18" /><span>Категорию обозначают: высшая — В, отборная — О, первая — 1, вторая — 2, третья — 3.</span></li>
            </ul>
            <NuxtLink :to="kzPath('/stati/127')" class="kz-link">Статья: как выбрать яйца<KzIcon name="arrow" :size="18" /></NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Товары раздела -->
    <section v-if="products.length" class="kz-sec kz-sec--tight">
      <div class="kz-wrap">
        <div class="kz-h2"><h2>{{ s.id === 'yajco' ? 'Фасованное яйцо' : 'Ассортимент' }}</h2></div>
        <div class="kz-grid3">
          <KzCard v-for="p in products" :key="p.id" :p="p" />
        </div>
      </div>
    </section>

    <!-- Колбасы: списка у оригинала нет — баннер, особенности и запрос ассортимента -->
    <section v-if="s.id === 'kolbasy'" class="kz-sec kz-sec--tight">
      <div class="kz-wrap kz-kolb">
        <button type="button" class="kz-kolb__pic" aria-label="Увеличить" @click="ui.open('Колбасная продукция', [{ img: 'kolbasy-banner', cap: 'Куриные деликатесы' }])">
          <img :src="kzImg('kolbasy-banner')" alt="Куриные деликатесы" width="600" height="428" loading="lazy" />
        </button>
        <div>
          <h2 class="kz-kolb__title">5 особенностей колбасных деликатесов</h2>
          <ol class="kz-kolb__list">
            <li v-for="f in kolbFeatures" :key="f">{{ f }}</li>
          </ol>
          <div class="kz-panel kz-kolb__ask">
            <p><b>Около 40 наименований</b> — полукопчёные и варёные колбасы, ветчины, цельные тушки и части бройлера натурального копчения. Полный список и цены пришлёт отдел продаж.</p>
            <KzAsk what="Колбасная продукция — ассортимент и цены" label="Запросить ассортимент" />
          </div>
        </div>
      </div>
    </section>

    <!-- Корма: таблица с фильтром «кому» и раскрытием -->
    <section v-if="isFeed" class="kz-sec kz-sec--tight">
      <div class="kz-wrap">
        <div class="kz-feedbar">
          <span>Для кого:</span>
          <div class="kz-chips">
            <button v-for="a in kzAnimals" :key="a.id" type="button" class="kz-chip" :class="{ 'is-on': animal === a.id }" @click="animal = a.id">{{ a.label }}</button>
          </div>
        </div>
        <div v-for="g in feedGroups" :key="g.name" class="kz-feedgroup">
          <h2>{{ g.name }}</h2>
          <div class="kz-feeds">
            <div v-for="f in g.items" :id="f.id" :key="f.id" class="kz-feed" :class="{ 'is-open': opened === f.id }">
              <div class="kz-feed__row">
                <b class="kz-feed__code">{{ f.code }}</b>
                <span class="kz-feed__purpose">{{ f.purpose }}</span>
                <button v-if="f.more" type="button" class="kz-feed__more" :aria-expanded="opened === f.id" @click="toggle(f.id)">
                  Подробнее<KzIcon name="down" :size="16" />
                </button>
                <span v-else class="kz-feed__more kz-feed__more--empty" />
                <KzAsk :what="`${f.code} — ${f.purpose}`" />
              </div>
              <div v-if="f.more && opened === f.id" class="kz-feed__body">
                <h3>{{ f.more.title }}</h3>
                <p>{{ f.more.text }}</p>
                <ul v-if="f.more.list" class="kz-checks">
                  <li v-for="l in f.more.list" :key="l"><KzIcon name="check" :size="18" /><span>{{ l }}</span></li>
                </ul>
                <p v-if="f.more.note" class="kz-feed__note">{{ f.more.note }}</p>
              </div>
            </div>
          </div>
        </div>
        <p v-if="!feedGroups.length" class="kz-empty">Для этих животных в разделе ничего нет — посмотрите <NuxtLink :to="kzPath(s.id === 'premiksy' ? '/produkciya/kombikorm' : '/produkciya/premiksy')">{{ s.id === 'premiksy' ? 'комбикорма' : 'премиксы' }}</NuxtLink>.</p>
        <div class="kz-panel kz-feedhint">
          <KzIcon name="leaf" />
          <p v-if="s.id === 'premiksy'">При использовании 1% премикса смешайте 1 часть премикса с 99 частями кормовой основы. Лучший способ — в составе комбикормов.</p>
          <p v-else>При использовании 20% БВМК смешайте 20 частей концентрата с 80 частями зерновой основы. Возможна выработка кормов по рецепту заказчика и из давальческого сырья.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.kz-eggtab {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
  .kz-panel {
    display: grid;
    align-content: start;
    gap: 14px;
    justify-items: start;
  }
  .kz-table {
    width: 100%;
  }
}
.kz-kolb {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
  align-items: start;
  gap: 40px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
  &__pic {
    display: block;
    overflow: hidden;
    border-radius: var(--kz-R);
    cursor: zoom-in;

    img {
      width: 100%;
      height: auto;
    }
  }
  &__title {
    font-size: clamp(24px, 2.6vw, 32px);
    font-weight: 900;
  }
  ol.kz-kolb__list {
    display: grid;
    gap: 12px;
    margin: 20px 0 24px;
    counter-reset: k;

    li {
      counter-increment: k;
      display: grid;
      grid-template-columns: 40px minmax(0, 1fr);
      align-items: start;
      font-size: 16px;

      &::before {
        content: counter(k);
        display: grid;
        place-items: center;
        width: 30px;
        height: 30px;
        border-radius: 10px;
        background: var(--kz-strip);
        color: var(--kz-ink);
        font-weight: 900;
      }
    }
  }
  &__ask {
    display: grid;
    gap: 14px;
    justify-items: start;
  }
}
.kz-feedbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
  margin-bottom: 24px;

  > span {
    color: var(--kz-ink);
    font-weight: 800;
  }
}
.kz-feedgroup {
  margin-bottom: 32px;

  h2 {
    margin-bottom: 12px;
    font-size: 22px;
    font-weight: 900;
  }
}
.kz-feeds {
  border: 1px solid var(--kz-line);
  border-radius: var(--kz-R);
  background: #fff;
}
.kz-feed {
  border-bottom: 1px solid var(--kz-line);

  &:last-child {
    border-bottom: 0;
  }
  &__row {
    display: grid;
    grid-template-columns: 110px minmax(0, 1fr) 130px auto;
    align-items: center;
    gap: 16px;
    padding: 12px 16px 12px 20px;

    @media (max-width: 768px) {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px 12px;
      padding: 14px 14px 14px 16px;
    }
  }
  &__code {
    color: var(--kz-green);
    font-size: 17px;
    font-weight: 900;
    white-space: nowrap;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
    }
  }
  &__purpose {
    color: var(--kz-ink);
    font-size: 15px;
    line-height: 1.4;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
    }
  }
  &__more {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--kz-accent-ink);
    font-size: 14px;
    font-weight: 800;
    white-space: nowrap;

    .kz-icon {
      transition: transform 0.15s;
    }
    &--empty {
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
  &.is-open &__more .kz-icon {
    transform: rotate(180deg);
  }
  &__row > .kz-ask {
    @media (max-width: 768px) {
      grid-column: 2;
      grid-row: 3;
      justify-self: end;
    }
  }
  &__more {
    @media (max-width: 768px) {
      grid-column: 1;
      grid-row: 3;
      justify-self: start;
    }
  }
  .kz-ask__btn {
    min-height: 40px;
    padding: 8px 14px;
    font-size: 14px;
  }
  .kz-ask__pop {
    left: auto;
    right: 0;
  }
  &__body {
    display: grid;
    gap: 10px;
    margin: 0 16px 16px;
    padding: 18px 20px;
    border-radius: 18px;
    background: var(--kz-green-soft);
    font-size: 15px;

    h3 {
      font-size: 17px;
      font-weight: 900;
    }
  }
  &__note {
    color: var(--kz-muted);
  }
}
.kz-feedhint {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: 12px;
  background: var(--kz-green-soft);
  color: var(--kz-green);

  p {
    color: var(--kz-text);
  }
}
</style>
