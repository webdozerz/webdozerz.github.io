<script lang="ts" setup>
// «Корпоративным клиентам»: шкала скидок оригинала (у них — картинками) с калькулятором, PDF-каталог, 4 направления и форма.
import { skPath, skRub, skCorpScale, skContacts, skSection, skInSection } from '~/utils/shokoladki'
import SkFeedback from '~/components/redesign/shokoladki/SkFeedback.vue'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'

useSeoMeta({ title: 'Корпоративные подарки оптом — скидка до 25% — АПРИОРИ | Концепт редизайна' })
const to = (p: string) => skPath(p)
const amount = ref(30000)
const tier = computed(() => [...skCorpScale].reverse().find((s) => amount.value >= s.from))
const next = computed(() => skCorpScale.find((s) => amount.value < s.from))
const dirs = [
  { n: 'Шоколад APRIORI', id: 'a-priori' },
  { n: 'Подарочные корзины', id: 'gift-baskets' },
  { n: 'Подарочные наборы', id: 'chocolate-sets' },
  { n: 'Шоколадные фигуры', id: 'chocolate-figures' },
].map((d) => ({ ...d, img: skInSection(d.id)[0]?.img || '', count: skSection(d.id)?.count || 0 }))
</script>

<template>
  <div class="sk-wrap sk-page">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>Корпоративным клиентам</span>
    </nav>
    <div class="sk-pagehead">
      <h1 class="sk-h1">Подарки оптом для корпоративных клиентов</h1>
      <p>Новогодние наборы сотрудникам, подарки партнёрам и шоколад с логотипом компании. Скидка зависит от суммы заказа — до 25%.</p>
    </div>

    <div class="sk-corpcalc">
      <div class="sk-corpcalc__in">
        <label class="sk-field">
          <span>Сумма заказа</span>
          <input v-model.number="amount" type="range" min="5000" max="150000" step="1000" aria-label="Сумма заказа" />
        </label>
        <div class="sk-corpcalc__res">
          <b>{{ skRub(amount) }}</b>
          <span v-if="tier">скидка {{ tier.pct }}% — к оплате {{ skRub(amount * (1 - tier.pct / 100)) }}</span>
          <span v-else>скидка начинается от 10 000 ₽</span>
          <small v-if="next">До скидки {{ next.pct }}% — ещё {{ skRub(next.from - amount) }}</small>
        </div>
      </div>
      <ol class="sk-corp__scale">
        <li v-for="s in skCorpScale" :key="s.from" :style="{ '--h': 30 + s.pct * 2.6 + '%' }" :class="{ 'is-on': tier?.from === s.from }">
          <b>{{ s.pct }}%</b><span>{{ s.label }}</span>
        </li>
      </ol>
    </div>

    <div class="sk-corpdirs">
      <NuxtLink v-for="d in dirs" :key="d.id" :to="to(`/katalog/${d.id}/`)" class="sk-tile">
        <span class="sk-tile__img"><img :src="d.img" :alt="d.n" loading="lazy" /></span>
        <b>{{ d.n }}</b>
        <small>{{ d.count }} товаров</small>
      </NuxtLink>
    </div>

    <div class="sk-corpcta">
      <div class="sk-panel sk-corpcta__pdf">
        <SkIcon name="doc" />
        <b>Каталог APRIORI Deluxe — Новый год 2027</b>
        <p>Все корпоративные наборы с ценами, PDF 8,9 МБ.</p>
        <a :href="skContacts.pdf" target="_blank" rel="noopener" class="sk-btn"><SkIcon name="download" />Скачать каталог</a>
        <a :href="skContacts.logoSite" target="_blank" rel="noopener" class="sk-link">Шоколад с логотипом — отдельный сайт<SkIcon name="right" /></a>
        <p class="sk-muted">Опт и сотрудничество: <a :href="`mailto:${skContacts.email}`">{{ skContacts.email }}</a>, <a :href="`tel:${skContacts.coopTel}`">{{ skContacts.coopPhone }}</a></p>
      </div>
      <SkFeedback lead="Расскажите, сколько подарков нужно и к какой дате — подберём наборы и пришлём расчёт." />
    </div>
  </div>
</template>
