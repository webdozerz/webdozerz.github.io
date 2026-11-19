<script lang="ts" setup>
import { skPath, skPlural, skProduct, skSection, skInSection, skVisible, skGiftGroups, skShops, skCorpScale, skContacts, skNewYear, skDay } from '~/utils/shokoladki'
import { skProducts } from '~/utils/shokoladki.data'
import { skReviews, skPosts } from '~/utils/shokoladki.texts'
import { useSkStore } from '~/composables/useShokoladki'
import SkBuilder from '~/components/redesign/shokoladki/SkBuilder.vue'
import SkCard from '~/components/redesign/shokoladki/SkCard.vue'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'
import SkPhone from '~/components/redesign/shokoladki/SkPhone.vue'
import SkStars from '~/components/redesign/shokoladki/SkStars.vue'

useSeoMeta({ title: 'Шоколадная фабрика «Верность качеству» — конфеты и шоколад APRIORI | Концепт редизайна' })
const store = useSkStore()
const to = (p: string) => skPath(p)

const newYear = skInSection(skNewYear.section)
const hits = [...skProducts].sort((a, b) => b.b - a.b).slice(0, 10)
const tiles = ['handmade-chocolates', 'chocolate-sets', 'a-priori', 'gift-baskets', 'chocolate-figures', 'individual-packing', 'chocolate-sets-spezzano', 'candy-bouquets']
  .map((id) => ({ s: skSection(id)!, img: skInSection(id)[0]?.img || '' }))
  .filter((t) => t.s)
const collections = skVisible('collection').length
const reviews = skReviews.slice(0, 3)
const posts = skPosts.filter((p) => p.k === 'articles').slice(0, 3)
const msk = skShops.filter((s) => s.city === 'Москва')

// До Нового года: честный отсчёт по календарю
const daysToNY = ref(0)
onMounted(() => {
  const now = new Date()
  const ny = new Date(now.getFullYear() + 1, 0, 1)
  daysToNY.value = Math.ceil((ny.getTime() - now.getTime()) / 86400000)
})
const tomorrow = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return skDay(d)
})

// Полка с прокруткой стрелками
const shelves = ref<Record<string, HTMLElement | null>>({})
const scrollShelf = (k: string, dir: number) => {
  const el = shelves.value[k]
  if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
}

// Бонусная карта: «Оформите бонусную карту на сайте и получите в подарок 500 бонусных рублей!»
const bonus = reactive({ phone: '', ok: false })
const issue = () => {
  if (bonus.phone.replace(/\D/g, '').length < 11) return
  store.issueCard(bonus.phone)
}
</script>

<template>
  <div class="sk-home">
    <div class="sk-wrap sk-home__hero">
      <SkBuilder />
    </div>

    <!-- сезон: новогодняя коллекция -->
    <section class="sk-section">
      <div class="sk-wrap">
        <div class="sk-ny">
          <NuxtLink :to="to(`/katalog/${skNewYear.section}/`)" class="sk-ny__banner">
            <img :src="skNewYear.banner" alt="Сияние волшебства. Новогодняя коллекция подарков" width="860" height="360" />
          </NuxtLink>
          <div class="sk-ny__text">
            <span class="sk-ny__days" v-if="daysToNY">До Нового года {{ daysToNY }} {{ skPlural(daysToNY, 'день', 'дня', 'дней') }}</span>
            <h2 class="sk-h2">{{ skNewYear.title }}</h2>
            <p>Новогодняя коллекция: {{ skSection(skNewYear.section)?.count }} подарков — ассорти, фигуры, корзины и наборы в зимней упаковке. По Москве привезём уже {{ tomorrow }}.</p>
            <div class="sk-ny__links">
              <NuxtLink :to="to(`/katalog/${skNewYear.section}/`)" class="sk-btn">Смотреть коллекцию</NuxtLink>
              <NuxtLink :to="to('/katalog/predzakaz-na-novyy-god/')" class="sk-btn sk-btn--line">Предзаказ на Новый год</NuxtLink>
            </div>
          </div>
        </div>
        <div class="sk-shelf">
          <button type="button" class="sk-shelf__arrow sk-shelf__arrow--l" aria-label="Назад" @click="scrollShelf('ny', -1)"><SkIcon name="left" /></button>
          <div :ref="(el) => (shelves.ny = el as HTMLElement)" class="sk-shelf__track">
            <SkCard v-for="p in newYear" :key="p.id" :p="p" />
          </div>
          <button type="button" class="sk-shelf__arrow sk-shelf__arrow--r" aria-label="Вперёд" @click="scrollShelf('ny', 1)"><SkIcon name="right" /></button>
        </div>
      </div>
    </section>

    <!-- разделы -->
    <section class="sk-section">
      <div class="sk-wrap">
        <div class="sk-sechead">
          <h2 class="sk-h2">Коллекция</h2>
          <NuxtLink :to="to('/katalog/')" class="sk-link">Все {{ collections }} {{ skPlural(collections, 'раздел', 'раздела', 'разделов') }} · 219 товаров<SkIcon name="right" /></NuxtLink>
        </div>
        <div class="sk-tiles">
          <NuxtLink v-for="t in tiles" :key="t.s.id" :to="to(`/katalog/${t.s.id}/`)" class="sk-tile">
            <span class="sk-tile__img"><img :src="t.img" :alt="t.s.n" loading="lazy" /></span>
            <b>{{ t.s.n }}</b>
            <small>{{ t.s.count }} {{ skPlural(t.s.count, 'товар', 'товара', 'товаров') }}</small>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- подарок по поводу -->
    <section class="sk-section">
      <div class="sk-wrap">
        <div class="sk-gifts">
          <div class="sk-gifts__head">
            <h2 class="sk-h2">Шоколадные подарки</h2>
            <p>По случаю, для кого и к празднику — как в каталоге фабрики.</p>
          </div>
          <div class="sk-gifts__groups">
            <div v-for="g in skGiftGroups.slice(0, 3)" :key="g.g" class="sk-gifts__group">
              <b>{{ g.n }}</b>
              <div class="sk-chips">
                <NuxtLink v-for="s in skVisible(g.g)" :key="s.id" :to="to(`/katalog/${s.id}/`)" class="sk-chip">{{ s.n }} <small>{{ s.count }}</small></NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- хиты -->
    <section class="sk-section">
      <div class="sk-wrap">
        <div class="sk-sechead">
          <h2 class="sk-h2">Любимое покупателей</h2>
          <NuxtLink :to="{ path: to('/katalog/'), query: { sort: 'pop' } }" class="sk-link">Все популярные<SkIcon name="right" /></NuxtLink>
        </div>
        <div class="sk-shelf">
          <button type="button" class="sk-shelf__arrow sk-shelf__arrow--l" aria-label="Назад" @click="scrollShelf('hit', -1)"><SkIcon name="left" /></button>
          <div :ref="(el) => (shelves.hit = el as HTMLElement)" class="sk-shelf__track">
            <SkCard v-for="p in hits" :key="p.id" :p="p" />
          </div>
          <button type="button" class="sk-shelf__arrow sk-shelf__arrow--r" aria-label="Вперёд" @click="scrollShelf('hit', 1)"><SkIcon name="right" /></button>
        </div>
      </div>
    </section>

    <!-- преимущества оригинала + бонусная карта -->
    <section class="sk-section">
      <div class="sk-wrap sk-home__duo">
        <ul class="sk-facts">
          <li><SkIcon name="truck" /><span><b>Самая быстрая доставка</b>По Москве — со следующего дня, от 4 000 ₽ бесплатно. Курьеры работают 9:00–21:00 без выходных.</span></li>
          <li><SkIcon name="shield" /><span><b>Качество и натуральные продукты</b>Бельгийский шоколад Barry Callebaut и какао из Франции, Швейцарии, Шри-Ланки и Южной Америки.</span></li>
          <li><SkIcon name="medal" /><span><b>Верность качеству с 2001 года</b>Своя фабрика в Касимове, конфеты и шоколад APRIORI ручной работы.</span></li>
        </ul>
        <div class="sk-bonus">
          <div class="sk-bonus__card" aria-hidden="true">
            <img src="/redesign/shokoladki/favicon.png" alt="" width="40" height="40" />
            <b>500 ₽</b>
            <span>бонусная карта APRIORI</span>
          </div>
          <div class="sk-bonus__form">
            <h2 class="sk-h2">Бонусная карта</h2>
            <p>Оформите карту на сайте и получите в подарок 500 бонусных рублей. С каждой покупки — 3–5% бонусами, карту можно добавить в Wallet.</p>
            <form v-if="!store.bonusCard.value" class="sk-bonus__row" @submit.prevent="issue">
              <SkPhone v-model="bonus.phone" class="sk-input" required aria-label="Телефон для бонусной карты" />
              <button class="sk-btn" type="submit">Оформить карту</button>
              <label class="sk-check sk-check--small"><input v-model="bonus.ok" type="checkbox" required /><span>Согласен с <a :href="skContacts.offer" target="_blank" rel="noopener">договором публичной оферты</a></span></label>
            </form>
            <p v-else class="sk-done"><SkIcon name="check" />Карта на {{ store.bonusCard.value }} — демо, бонусы не начислены.</p>
            <p class="sk-bonus__note">Оплата заказа бонусами временно приостановлена. Акции и скидки на сайте действуют.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- отзывы -->
    <section class="sk-section">
      <div class="sk-wrap">
        <div class="sk-sechead">
          <h2 class="sk-h2">Отзывы покупателей</h2>
          <NuxtLink :to="to('/otzyvy/')" class="sk-link">Все отзывы<SkIcon name="right" /></NuxtLink>
        </div>
        <div class="sk-reviews">
          <article v-for="r in reviews" :key="r.n + r.d" class="sk-review">
            <SkStars :value="r.r" />
            <p>{{ r.t }}</p>
            <NuxtLink v-if="skProduct(r.pid)" :to="to(`/tovar/${r.pid}/`)" class="sk-review__item">{{ r.pn }}</NuxtLink>
            <span v-else class="sk-review__item sk-muted">{{ r.pn }}</span>
            <div class="sk-review__by">
              <b>{{ r.n }}</b><span>{{ r.d }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- корпоративным -->
    <section class="sk-section">
      <div class="sk-wrap">
        <div class="sk-corp">
          <div class="sk-corp__text">
            <h2 class="sk-h2">Подарки для компаний</h2>
            <p>Шоколад с логотипом, наборы коллегам и партнёрам. Чем больше заказ — тем больше скидка.</p>
            <div class="sk-corp__links">
              <NuxtLink :to="to('/korporativnym/')" class="sk-btn">Корпоративным клиентам</NuxtLink>
              <a :href="skContacts.pdf" target="_blank" rel="noopener" class="sk-btn sk-btn--line"><SkIcon name="download" />Каталог APRIORI Deluxe, PDF</a>
            </div>
          </div>
          <ol class="sk-corp__scale">
            <li v-for="s in skCorpScale" :key="s.from" :style="{ '--h': 30 + s.pct * 2.6 + '%' }">
              <b>{{ s.pct }}%</b><span>{{ s.label }}</span>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- бутики -->
    <section class="sk-section">
      <div class="sk-wrap">
        <div class="sk-sechead">
          <h2 class="sk-h2">Бутики в Москве</h2>
          <NuxtLink :to="to('/butiki/')" class="sk-link">Все {{ skShops.length }} бутиков — Москва, Касимов, Рязань<SkIcon name="right" /></NuxtLink>
        </div>
        <div class="sk-shops">
          <NuxtLink v-for="s in msk" :key="s.id" :to="{ path: to('/butiki/'), hash: `#${s.id}` }" class="sk-shop">
            <img :src="s.photo" :alt="s.n" loading="lazy" />
            <span>
              <b>{{ s.n }}</b>
              <small>м. {{ s.metro }} · {{ s.addr }}</small>
              <small>{{ s.hours }}</small>
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- блог -->
    <section class="sk-section">
      <div class="sk-wrap">
        <div class="sk-sechead">
          <h2 class="sk-h2">Блог</h2>
          <NuxtLink :to="to('/blog/')" class="sk-link">Все записи<SkIcon name="right" /></NuxtLink>
        </div>
        <div class="sk-posts">
          <NuxtLink v-for="p in posts" :key="p.id" :to="to(`/blog/${p.id}/`)" class="sk-post">
            <img :src="p.img" :alt="p.t" loading="lazy" width="372" height="200" />
            <small>{{ p.date }} · <SkIcon name="eye" />{{ p.views.toLocaleString('ru-RU') }}</small>
            <b>{{ p.t }}</b>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
