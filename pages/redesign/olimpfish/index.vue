<script lang="ts" setup>
import { olBenefits, olContacts, olDate, olGallery, olNews, olOptTerms, olPartners, olPath, olProduct, olReviews, olSecImg, olSections, olUp } from '~/utils/olimpfish'
import { olProducts } from '~/utils/olimpfishData'
import type { OlProduct } from '~/utils/olimpfishData'
import OlCut from '~/components/redesign/olimpfish/OlCut.vue'
import OlShelf from '~/components/redesign/olimpfish/OlShelf.vue'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'
import OlPhone from '~/components/redesign/olimpfish/OlPhone.vue'
import { useOlShop } from '~/composables/useOlimpfish'

useSeoMeta({ title: 'Олимп — рыба, икра и морепродукты от производителя | Концепт редизайна' })
const shop = useOlShop()

const ids = (list: string[]) => list.map((id) => olProduct(id)).filter(Boolean) as OlProduct[]
const hits = ids(['7694', '2924', '355', '3016', '4503', '352', '5022', '1136', '377', '4665'])
const sale = olProducts.filter((p) => p.op > 0)
const fresh = olProducts.filter((p) => p.sec === 'polufabrikaty')

const opt = reactive({ name: '', phone: '', mail: '', what: 'Икра', ok: true })
const optDone = ref(false)
const ask = reactive({ name: '', phone: '', text: '', ok: true })
const askDone = ref(false)
onMounted(() => shop.persist())
</script>

<template>
  <div>
    <!-- первый экран: девиз + «Отрез» на всю ширину -->
    <section class="ol-wrap ol-hero">
      <div class="ol-hero__top">
        <div>
          <h1>Вкусная рыба, качеству которой доверяют</h1>
          <p class="ol-hero__lead">Своё натуральное копчение осетра и белуги с 1980 года, красная и чёрная икра, морепродукты. Отрежем столько, сколько нужно, — цена посчитается сразу.</p>
        </div>
        <ul class="ol-hero__facts">
          <li><OlIcon name="clock" /><span><b>Заказы 24/7</b>сегодня на завтра</span></li>
          <li><OlIcon name="truck" /><span><b>По МКАД — 350 ₽</b>при заказе от 5 000 ₽</span></li>
          <li><OlIcon name="bolt" /><span><b>Срочно — за 3 часа</b>от 500 ₽</span></li>
        </ul>
      </div>
      <OlCut />
    </section>

    <!-- разделы -->
    <section class="ol-wrap ol-sec">
      <div class="ol-head">
        <h2>Продукция</h2>
        <NuxtLink :to="olPath('/catalog')" class="ol-link">Весь каталог · 155 товаров<OlIcon name="right" /></NuxtLink>
      </div>
      <ul class="ol-cats">
        <li v-for="s in olSections" :key="s.slug">
          <NuxtLink :to="olPath(`/catalog/${s.slug}`)" class="ol-cats__tile">
            <span class="ol-cats__ph"><img :src="olSecImg(s.slug)" :alt="s.name" width="300" height="300" loading="lazy" /></span>
            <b>{{ s.name }}</b>
            <small>{{ s.count }} товаров</small>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- акция -->
    <section class="ol-wrap ol-sec">
      <div class="ol-promo">
        <img class="ol-promo__img" :src="olNews[0].img" alt="Акция: скидка 5% на икру нерки" width="600" height="500" loading="lazy" />
        <div class="ol-promo__text">
          <span class="ol-promo__date">Акция с {{ olDate(olNews[0].date) }}</span>
          <h2>Скидка 5% на всю икру нерки</h2>
          <p>{{ olNews[0].text }}</p>
          <NuxtLink :to="olPath('/catalog/sale')" class="ol-btn ol-btn--acc">Все акции</NuxtLink>
        </div>
        <div class="ol-promo__shelf">
          <OlShelf :items="sale" />
        </div>
      </div>
    </section>

    <!-- выбор покупателей -->
    <section class="ol-wrap ol-sec">
      <div class="ol-head">
        <h2>Выбор покупателей</h2>
        <NuxtLink :to="olPath('/catalog/osetr')" class="ol-link">Осётр и белуга<OlIcon name="right" /></NuxtLink>
      </div>
      <OlShelf :items="hits" />
    </section>

    <!-- новинка -->
    <section class="ol-wrap ol-sec">
      <div class="ol-head">
        <div>
          <h2>Новинка: кулинарные полуфабрикаты</h2>
          <p>Шашлык из осетра, кальмары, креветки и филе в маринадах — разогреть и подать.</p>
        </div>
        <NuxtLink :to="olPath('/catalog/polufabrikaty')" class="ol-link">Все 14 позиций<OlIcon name="right" /></NuxtLink>
      </div>
      <OlShelf :items="fresh" />
    </section>

    <!-- производство -->
    <section class="ol-wrap ol-sec">
      <div class="ol-made">
        <div class="ol-made__text">
          <h2>Эксперт в натуральном копчении рыбы</h2>
          <p>Мы специализируемся на продуктах из осетровых: осётр, белуга, бестер, севрюга, калуга. Классическая рецептура, ручной труд и опыт ремесла. Честный состав и натуральный вкус — без консервантов и усилителей вкуса, с низким содержанием соли. Поэтому у нашей рыбы короткие сроки хранения.</p>
          <ul class="ol-made__list">
            <li v-for="b in olBenefits" :key="b.title"><OlIcon :name="b.icon" /><span><b>{{ b.title }}</b>{{ b.text }}</span></li>
          </ul>
          <NuxtLink :to="olPath('/about')" class="ol-btn ol-btn--line">О компании и декларации</NuxtLink>
        </div>
        <div class="ol-made__pics">
          <img v-for="(g, i) in olGallery.slice(0, 3)" :key="g.th" :src="g.th" :alt="`Производство «Олимп», фото ${i + 1}`" width="768" height="512" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- опт -->
    <section class="ol-wrap ol-sec" id="opt">
      <div class="ol-optbox">
        <div class="ol-optbox__text">
          <h2>Партнёрам и оптовикам</h2>
          <p>Минимальная сумма заказа — от 7000 рублей. Оставьте заявку — свяжемся в течение 30 минут.</p>
          <ul class="ol-optbox__terms">
            <li v-for="t in olOptTerms" :key="t.title"><OlIcon :name="t.icon" /><span><b>{{ t.title }}</b>{{ t.text }}</span></li>
          </ul>
          <NuxtLink :to="olPath('/opt')" class="ol-link">Как мы работаем с оптом<OlIcon name="right" /></NuxtLink>
        </div>
        <div class="ol-optbox__form">
          <div v-if="optDone" class="ol-done">
            <span class="ol-done__ic"><OlIcon name="check" /></span>
            <h3>Заявка принята</h3>
            <p>Это демо: на настоящем сайте менеджер перезвонит в течение 30 минут.</p>
            <button type="button" class="ol-btn ol-btn--line" @click="optDone = false">Отправить ещё</button>
          </div>
          <form v-else class="ol-optform" @submit.prevent="optDone = true">
            <label class="ol-field"><span>Имя</span><input v-model="opt.name" required autocomplete="name" /></label>
            <label class="ol-field"><span>Телефон</span><OlPhone v-model="opt.phone" required /></label>
            <label class="ol-field"><span>E-mail</span><input v-model="opt.mail" type="email" autocomplete="email" /></label>
            <label class="ol-field"><span>Что интересует</span>
              <select v-model="opt.what"><option>Икра</option><option>Рыба</option><option>Икра и рыба</option></select>
            </label>
            <label class="ol-check"><input v-model="opt.ok" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
            <button type="submit" class="ol-btn ol-btn--acc">Отправить заявку</button>
          </form>
        </div>
      </div>
      <ul class="ol-partners ol-partners--home">
        <li v-for="p in olPartners" :key="p.name"><img :src="olUp(p.img)" :alt="p.name" loading="lazy" /></li>
      </ul>
    </section>

    <!-- отзывы -->
    <section class="ol-wrap ol-sec">
      <div class="ol-head">
        <h2>Мнение покупателей</h2>
        <NuxtLink :to="olPath('/reviews')" class="ol-link">Все {{ olReviews.length }} отзывов<OlIcon name="right" /></NuxtLink>
      </div>
      <div class="ol-revs">
        <article v-for="r in olReviews.slice(0, 4)" :key="r.name + r.text.length" class="ol-rev">
          <span class="ol-rev__stars"><OlIcon v-for="i in 5" :key="i" name="star" /></span>
          <p>{{ r.text }}</p>
          <b>{{ r.name }}</b>
        </article>
      </div>
    </section>

    <!-- новости -->
    <section class="ol-wrap ol-sec">
      <div class="ol-head">
        <h2>Новости</h2>
        <NuxtLink :to="olPath('/news')" class="ol-link">Все новости<OlIcon name="right" /></NuxtLink>
      </div>
      <div class="ol-newsrow">
        <a v-for="n in olNews.slice(0, 3)" :key="n.title" :href="n.url" target="_blank" rel="noopener" class="ol-newscard">
          <span class="ol-newscard__ph"><img :src="n.img" :alt="n.title" width="600" height="500" loading="lazy" /></span>
          <small>{{ olDate(n.date) }}</small>
          <b>{{ n.title }}</b>
        </a>
      </div>
    </section>

    <!-- вопрос -->
    <section class="ol-wrap ol-sec ol-sec--last">
      <div class="ol-ask">
        <div>
          <h2>Остались вопросы?</h2>
          <p>Напишите — менеджер перезвонит. Или звоните: <a :href="olContacts.phones[0].href">{{ olContacts.phones[0].text }}</a>, {{ olContacts.hours.toLowerCase() }}.</p>
        </div>
        <div v-if="askDone" class="ol-ask__done"><OlIcon name="check" />Спасибо! Это демо — вопрос никуда не ушёл.</div>
        <form v-else class="ol-ask__form" @submit.prevent="askDone = true">
          <label class="ol-field"><span>Имя</span><input v-model="ask.name" required autocomplete="name" /></label>
          <label class="ol-field"><span>Телефон</span><OlPhone v-model="ask.phone" required /></label>
          <label class="ol-field ol-ask__wide"><span>Вопрос</span><textarea v-model="ask.text" rows="2" required /></label>
          <label class="ol-check ol-ask__wide"><input v-model="ask.ok" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
          <button type="submit" class="ol-btn ol-btn--acc">Задать вопрос</button>
        </form>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.ol .ol-hero {
  padding-top: 28px;
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 20px 48px;
    align-items: end;
    margin-bottom: 22px;
  }
  h1 {
    font-size: 40px;
    max-width: 760px;
  }
  &__lead {
    margin-top: 12px;
    font-size: 17px;
    color: var(--ol-mute);
    max-width: 720px;
  }
  ul.ol-hero__facts {
    margin: 0;
    padding: 0;
    display: grid;
    gap: 10px;
    li {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .ol-icon {
      width: 38px;
      height: 38px;
      padding: 9px;
      box-sizing: border-box;
      border-radius: 10px;
      background: var(--ol-soft);
      color: var(--ol-acc);
    }
    span {
      display: grid;
      font-size: 13.5px;
      color: var(--ol-mute);
      line-height: 1.35;
    }
    b {
      font-size: 15px;
      color: var(--ol-ink);
    }
  }
}
.ol ul.ol-cats {
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 14px;
}
.ol .ol-cats__tile {
  display: grid;
  gap: 2px;
  padding: 10px 10px 14px;
  border: 1px solid var(--ol-line);
  border-radius: var(--ol-R);
  background: #fff;
  text-align: center;
  transition: border-color 0.2s;
  b {
    margin-top: 6px;
    font-size: 14px;
    line-height: 1.3;
    color: var(--ol-ink);
  }
  small {
    font-size: 12.5px;
    color: var(--ol-mute);
  }
  &:hover {
    border-color: #c4cddb;
    b {
      color: var(--ol-acc);
    }
    img {
      transform: scale(1.05);
    }
  }
}
.ol .ol-cats__ph {
  position: relative;
  display: block;
  aspect-ratio: 1;
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s;
  }
}
.ol .ol-promo {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 22px 32px;
  padding: 26px;
  border-radius: 24px;
  background: var(--ol-soft);
  &__img {
    width: 300px;
    height: auto;
    border-radius: var(--ol-R);
    align-self: start;
  }
  &__text {
    display: grid;
    align-content: start;
    justify-items: start;
    gap: 12px;
    h2 {
      font-size: 30px;
    }
    p {
      color: var(--ol-text);
      max-width: 560px;
    }
  }
  &__date {
    padding: 5px 10px;
    border-radius: 8px;
    background: #fff;
    font-size: 13px;
    font-weight: 700;
    color: var(--ol-acc);
  }
  &__shelf {
    grid-column: 1 / -1;
    min-width: 0;
  }
}
.ol .ol-made {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 40px;
  align-items: start;
  &__text {
    display: grid;
    gap: 18px;
    justify-items: start;
    h2 {
      font-size: 30px;
    }
    > p {
      color: var(--ol-text);
    }
  }
  ul.ol-made__list {
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 22px;
    li {
      display: flex;
      gap: 12px;
    }
    .ol-icon {
      width: 40px;
      height: 40px;
      padding: 9px;
      box-sizing: border-box;
      border-radius: 10px;
      background: var(--ol-surf);
      color: var(--ol-acc);
    }
    span {
      display: grid;
      gap: 3px;
      align-content: start;
      font-size: 14px;
      color: var(--ol-mute);
    }
    b {
      color: var(--ol-ink);
      font-size: 15px;
      line-height: 1.3;
    }
  }
  &__pics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    img {
      width: 100%;
      height: 100%;
      aspect-ratio: 3 / 2;
      object-fit: cover;
      border-radius: var(--ol-R);
    }
    img:first-child {
      grid-column: 1 / -1;
    }
  }
}
.ol .ol-optbox {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 32px;
  padding: 32px;
  border-radius: 24px;
  background: var(--ol-surf);
  &__text {
    display: grid;
    gap: 16px;
    align-content: start;
    justify-items: start;
    h2 {
      font-size: 30px;
    }
  }
  ul.ol-optbox__terms {
    margin: 0;
    padding: 0;
    display: grid;
    gap: 12px;
    li {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .ol-icon {
      width: 40px;
      height: 40px;
      padding: 9px;
      box-sizing: border-box;
      border-radius: 10px;
      background: #fff;
      color: var(--ol-acc);
    }
    span {
      display: grid;
      font-size: 14px;
      color: var(--ol-mute);
    }
    b {
      color: var(--ol-ink);
      font-size: 15px;
    }
  }
  &__form {
    padding: 24px;
    border-radius: var(--ol-R);
    background: #fff;
    align-self: start;
  }
}
.ol ul.ol-partners--home {
  margin: 40px 0 0;
  padding: 0;
}
.ol .ol-revs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.ol .ol-newsrow {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.ol .ol-newscard {
  display: grid;
  gap: 8px;
  align-content: start;
  &__ph {
    display: block;
    aspect-ratio: 6 / 5;
    border-radius: var(--ol-R);
    overflow: hidden;
    background: var(--ol-surf);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
  }
  small {
    color: var(--ol-mute);
    font-size: 13px;
  }
  b {
    font-size: 17px;
    line-height: 1.3;
    color: var(--ol-ink);
  }
  &:hover b {
    color: var(--ol-acc);
  }
  &:hover img {
    transform: scale(1.03);
  }
}
.ol .ol-sec--last {
  padding-bottom: 72px;
}
.ol .ol-ask {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 32px;
  align-items: start;
  padding: 32px;
  border-radius: 24px;
  border: 1px solid var(--ol-line);
  h2 {
    font-size: 28px;
    margin-bottom: 10px;
  }
  p {
    color: var(--ol-mute);
    a {
      color: var(--ol-ink);
      font-weight: 700;
      white-space: nowrap;
    }
  }
  &__form {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 14px;
    align-items: start;
    .ol-btn {
      justify-self: start;
    }
  }
  &__wide {
    grid-column: 1 / -1;
  }
  &__done {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 18px;
    border-radius: var(--ol-R);
    background: var(--ol-soft);
    font-weight: 600;
    color: var(--ol-ink);
    .ol-icon {
      color: var(--ol-acc);
    }
  }
}

@media (max-width: 1400px) {
  .ol ul.ol-cats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .ol .ol-cats__tile {
    grid-template-columns: 84px minmax(0, 1fr);
    grid-template-rows: auto auto;
    text-align: left;
    align-items: center;
    column-gap: 12px;
    padding: 10px;
    b {
      margin-top: 0;
      align-self: end;
    }
    small {
      align-self: start;
    }
  }
  .ol .ol-cats__ph {
    grid-row: 1 / 3;
  }
}
@media (max-width: 1199px) {
  .ol .ol-hero h1 {
    font-size: 38px;
  }
  .ol .ol-revs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .ol .ol-made ul.ol-made__list {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 989px) {
  .ol .ol-hero__top {
    grid-template-columns: minmax(0, 1fr);
  }
  .ol .ol-hero ul.ol-hero__facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .ol ul.ol-cats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .ol .ol-promo {
    grid-template-columns: 220px minmax(0, 1fr);
    &__img {
      width: 220px;
    }
  }
  .ol .ol-made,
  .ol .ol-optbox,
  .ol .ol-ask {
    grid-template-columns: minmax(0, 1fr);
  }
  .ol .ol-newsrow {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    > :nth-child(3) {
      display: none;
    }
  }
}
@media (max-width: 768px) {
  .ol .ol-hero {
    padding-top: 18px;
    h1 {
      font-size: 29px;
    }
    &__lead {
      font-size: 15.5px;
    }
    ul.ol-hero__facts {
      display: none;
    }
    &__top {
      margin-bottom: 16px;
    }
  }
  .ol .ol-promo {
    grid-template-columns: minmax(0, 1fr);
    padding: 18px;
    &__img {
      width: 100%;
      max-width: 340px;
    }
    &__text h2 {
      font-size: 24px;
    }
  }
  .ol .ol-made__text h2,
  .ol .ol-optbox__text h2 {
    font-size: 24px;
  }
  .ol .ol-optbox,
  .ol .ol-ask {
    padding: 20px;
  }
  .ol .ol-optbox__form {
    padding: 18px;
  }
  .ol .ol-ask__form {
    grid-template-columns: minmax(0, 1fr);
    .ol-btn {
      justify-self: stretch;
    }
  }
}
@media (max-width: 576px) {
  .ol .ol-revs,
  .ol .ol-newsrow {
    grid-template-columns: minmax(0, 1fr);
  }
  .ol .ol-newsrow > :nth-child(3) {
    display: grid;
  }
  .ol ul.ol-cats {
    gap: 8px;
  }
  .ol .ol-cats__tile {
    grid-template-columns: minmax(0, 1fr);
    text-align: center;
    padding: 8px 8px 12px;
    b {
      font-size: 13px;
      align-self: start;
      hyphens: auto;
      overflow-wrap: break-word;
    }
    small {
      font-size: 12px;
    }
  }
  .ol .ol-cats__ph {
    grid-row: auto;
    aspect-ratio: 4 / 3;
  }
  .ol .ol-made__pics {
    grid-template-columns: minmax(0, 1fr);
    img:not(:first-child) {
      display: none;
    }
  }
}
</style>
