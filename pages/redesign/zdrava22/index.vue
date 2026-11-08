<script lang="ts" setup>
import { zdContacts, zdFacts, zdHighlight, zdImg, zdItem, zdItems, zdMoney, zdPartners, zdPath, zdSorts, zdSteps, zdTare, zdVideos } from '~/utils/zdrava22'
import { zdReviews } from '~/utils/zdrava22Reviews'
import { useZdUi } from '~/composables/useZdrava22'
import ZdIcon from '~/components/redesign/zdrava22/ZdIcon.vue'
import ZdSortRow from '~/components/redesign/zdrava22/ZdSortRow.vue'
import ZdItemCard from '~/components/redesign/zdrava22/ZdItemCard.vue'
import ZdTierSwitch from '~/components/redesign/zdrava22/ZdTierSwitch.vue'

useSeoMeta({ title: 'Алтайский мёд с пасеки «Ширяев и сыновья» | Концепт редизайна' })

const ui = useZdUi()
const tare = computed(() => zdTare[ui.tier.value])
const bee = zdItems.filter((i) => i.group === 'bee')
const pack = zdItem('pchelopakety')!
const reviews = zdReviews.slice(0, 3)
const short = (t: string) => (t.length > 190 ? `${t.slice(0, 165).replace(/\s+\S*$/, '').replace(/[,.;:!?—-]+$/, '')}…` : t)
const [mainVideo, ...moreVideos] = zdVideos
const partners = zdPartners.filter((p) => p.phone)
</script>

<template>
  <div>
    <!-- AA «Пчеловод на пасеке»: выделенное жёлтое меню оригинала ↔ их фото Алексея среди ульев -->
    <section class="zd-wrap zd-hero">
      <div class="zd-hero__main">
        <div class="zd-hero__photo">
          <img :src="zdImg('hero.jpg')" alt="Алексей Ширяев на пасеке среди ульев" width="860" height="503" />
          <p class="zd-hero__motto">
            <b>«{{ zdContacts.motto }}»</b>
            <span>Алексей Ширяев, пчеловод</span>
          </p>
        </div>
        <div class="zd-hero__panel">
          <h1>Алтайский мёд с пасеки «Ширяев и&nbsp;сыновья»</h1>
          <p>Натуральный мёд оптом и в розницу с одной из крупнейших пасек в Алтайском крае. Отправляем в любой город России.</p>
          <div class="zd-hero__btns">
            <NuxtLink :to="zdPath('/produkciya')" class="zd-btn zd-btn--big">Продукция и цены</NuxtLink>
            <a :href="`tel:${zdContacts.tel}`" class="zd-btn zd-btn--line zd-btn--big"><ZdIcon name="phone" :size="18" />{{ zdContacts.phone }}</a>
          </div>
        </div>
      </div>

      <nav class="zd-hero__hl" aria-label="Алтайский мёд натуральный напрямую от производителя">
        <ZdIcon name="hex" :size="34" class="zd-hero__hex" />
        <h2>{{ zdContacts.highlight }}</h2>
        <NuxtLink v-for="h in zdHighlight" :key="h.label" :to="h.to" class="zd-hero__row" @click="h.tier && (ui.tier.value = h.tier)">
          <span><b>{{ h.label }}</b><small>{{ h.price }}</small></span>
          <ZdIcon name="arrow" :size="18" />
        </NuxtLink>
      </nav>
    </section>

    <section class="zd-wrap zd-sec zd-sec--tight">
      <ul class="zd-facts">
        <li v-for="f in zdFacts" :key="f.b">
          <ZdIcon :name="f.icon" :size="28" />
          <div><b>{{ f.b }}</b><span>{{ f.s }}</span></div>
        </li>
      </ul>
    </section>

    <!-- Мёд: пять сортов от светлого к тёмному, розница коробкой / опт куботейнером -->
    <section id="med" class="zd-wrap zd-sec">
      <div class="zd-head">
        <div>
          <h2>Алтайский мёд с наших пасек</h2>
          <p>Пять сортов — от светлого акациевого до почти чёрного молочаевого. Цена за килограмм зависит от тары и объёма.</p>
        </div>
        <ZdTierSwitch />
      </div>
      <div class="zd-honey">
        <aside class="zd-tare">
          <div class="zd-tare__ph"><img :src="tare.img" :alt="tare.what" width="348" height="261" loading="lazy" /></div>
          <div class="zd-tare__body">
            <h3>{{ tare.label }}: {{ tare.what }}</h3>
            <ul class="zd-tare__facts">
              <li v-for="f in tare.facts" :key="f"><ZdIcon name="check" :size="18" />{{ f }}</li>
            </ul>
            <NuxtLink :to="zdPath('/produkciya') + '#prajs'" class="zd-link">Прайс на мёд<ZdIcon name="arrow" :size="16" /></NuxtLink>
          </div>
        </aside>
        <div class="zd-honey__list">
          <ZdSortRow v-for="s in zdSorts" :key="s.id" :sort="s" :tier="ui.tier.value" />
        </div>
      </div>
    </section>

    <section id="produkty" class="zd-wrap zd-sec">
      <div class="zd-head">
        <div>
          <h2>Продукты пчеловодства</h2>
          <p>Пыльцу, пергу и гомогенат отпускаем от 50 г, от 10 кг — по оптовой цене.</p>
        </div>
        <NuxtLink :to="zdPath('/produkciya') + '#produkty'" class="zd-link">Вся продукция<ZdIcon name="arrow" :size="16" /></NuxtLink>
      </div>
      <div class="zd-items">
        <ZdItemCard v-for="i in bee" :key="i.id" :item="i" />
      </div>
      <NuxtLink :to="zdPath('/produkt/pchelopakety')" class="zd-pack">
        <img :src="pack.img" alt="Пчелопакет" width="348" height="261" loading="lazy" />
        <span class="zd-pack__txt"><b>Пчелопакеты для пчеловодов</b><small>{{ pack.note }}</small></span>
        <span class="zd-pack__price">{{ zdMoney(pack.price) }}<small> / шт</small></span>
        <ZdIcon name="arrow" />
      </NuxtLink>
    </section>

    <!-- О пасеке словами Алексея -->
    <section class="zd-wrap zd-sec">
      <div class="zd-story">
        <div class="zd-story__txt">
          <h2>Делать мёд — это призвание</h2>
          <p>Пчеловод с 40-летним опытом Алексей Ширяев и его сыновья Иван и Василий работают на собственной пасеке. Пасеки стоят в экологически чистых Калманском и Чарышском районах, зимовники на главной усадьбе — на 450 пчелосемей.</p>
          <p>«Моя главная задача, как ответственного пчеловода — избавить людей от некачественной продукции и защитить славу настоящего Алтайского мёда».</p>
          <blockquote>
            <ZdIcon name="quote" :size="28" />
            Хоть у нас и большие объемы производства мёда, мы остаемся простыми и честными пчеловодами! И всегда готовы лично привезти даже самый маленький заказ.
          </blockquote>
          <div class="zd-story__links">
            <NuxtLink :to="zdPath('/o-nas')" class="zd-btn zd-btn--line">О нас</NuxtLink>
            <NuxtLink :to="zdPath('/foto')" class="zd-link">Фото пасеки<ZdIcon name="arrow" :size="16" /></NuxtLink>
          </div>
        </div>
        <div class="zd-story__photos">
          <img :src="zdImg('sons.jpg')" alt="Пчеловоды пасеки среди цветущих медоносов" width="900" height="600" loading="lazy" class="zd-story__big" />
          <img :src="zdImg('two.jpg')" alt="Пчеловоды у ульев" width="900" height="600" loading="lazy" />
          <img :src="zdImg('hives.jpg')" alt="Ульи на главной усадьбе" width="900" height="600" loading="lazy" />
        </div>
      </div>
    </section>

    <section class="zd-wrap zd-sec">
      <div class="zd-head">
        <div>
          <h2>Видео с пасеки</h2>
          <p>Как мы работаем с пчёлами и мёдом — включите звук.</p>
        </div>
        <NuxtLink :to="zdPath('/video')" class="zd-link">Все {{ zdVideos.length }} видео<ZdIcon name="arrow" :size="16" /></NuxtLink>
      </div>
      <div class="zd-vids">
        <button type="button" class="zd-vids__main" @click="ui.video.value = mainVideo">
          <img :src="zdImg('video.jpg')" alt="" width="500" height="281" loading="lazy" />
          <span class="zd-vids__play"><ZdIcon name="play" :size="30" /></span>
          <span class="zd-vids__cap">{{ mainVideo.title }}</span>
        </button>
        <ul class="zd-vids__list">
          <li v-for="v in moreVideos.slice(0, 5)" :key="v.src">
            <button type="button" @click="ui.video.value = v"><ZdIcon name="film" :size="22" /><span>{{ v.title }}</span><ZdIcon name="play" :size="16" /></button>
          </li>
        </ul>
      </div>
    </section>

    <section class="zd-wrap zd-sec">
      <div class="zd-head">
        <div>
          <h2>{{ zdReviews.length }} отзывов покупателей</h2>
          <p>Исключительно реальные отзывы — с именем, городом и датой.</p>
        </div>
        <NuxtLink :to="zdPath('/otzyvy')" class="zd-link">Все отзывы и оставить свой<ZdIcon name="arrow" :size="16" /></NuxtLink>
      </div>
      <div class="zd-revs">
        <article v-for="r in reviews" :key="r.author + r.date" class="zd-review">
          <div class="zd-review__head"><b>{{ r.author }}</b><time>{{ r.date }}</time></div>
          <p>{{ short(r.text) }}</p>
          <NuxtLink v-if="r.text.length > 190" :to="zdPath('/otzyvy')" class="zd-link zd-review__more">Читать полностью</NuxtLink>
        </article>
      </div>
    </section>

    <section class="zd-wrap zd-sec">
      <div class="zd-order">
        <div>
          <h2>Как заказать</h2>
          <ul class="zd-steps">
            <li v-for="s in zdSteps" :key="s.title">
              <i><ZdIcon :name="s.icon" /></i>
              <div><b>{{ s.title }}</b><span>{{ s.text }}</span></div>
            </li>
          </ul>
        </div>
        <div class="zd-order__call">
          <p class="zd-order__lead">Просто позвоните мне:</p>
          <a :href="`tel:${zdContacts.tel}`" class="zd-order__phone">{{ zdContacts.phone }}</a>
          <p class="zd-order__who">Алексей Васильевич Ширяев</p>
          <div class="zd-order__btns">
            <a :href="`sms:${zdContacts.tel}`" class="zd-btn zd-btn--line"><ZdIcon name="sms" :size="18" />СМС</a>
            <a :href="`mailto:${zdContacts.email}`" class="zd-btn zd-btn--line"><ZdIcon name="mail" :size="18" />Письмо</a>
          </div>
          <NuxtLink :to="zdPath('/kontakty') + '#zakaz'" class="zd-btn zd-btn--big zd-order__form">Собрать заказ в форме</NuxtLink>
          <p class="zd-order__note">{{ zdContacts.season }}</p>
        </div>
      </div>
    </section>

    <section class="zd-wrap zd-sec">
      <div class="zd-head">
        <div>
          <h2>Наши партнёры в городах</h2>
          <p>Мёд пасеки можно купить и у партнёров — звоните им напрямую.</p>
        </div>
        <NuxtLink :to="zdPath('/partnery')" class="zd-link">Все партнёры<ZdIcon name="arrow" :size="16" /></NuxtLink>
      </div>
      <div class="zd-partners">
        <div v-for="p in partners" :key="p.id" class="zd-partners__card">
          <b>{{ p.city }}</b>
          <small>{{ p.name }}</small>
          <a :href="`tel:${p.tel}`">{{ p.phone }}</a>
        </div>
        <NuxtLink :to="zdPath('/partnery') + '#anapa'" class="zd-partners__card">
          <b>Анапа</b>
          <small>контакты — на странице партнёра</small>
          <span class="zd-link">Смотреть<ZdIcon name="arrow" :size="16" /></span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.zd-sec--tight {
  padding-top: 20px;
}

/* ---------- Первый экран ---------- */
.zd-hero {
  display: grid;
  grid-template-columns: 400px minmax(0, 1fr);
  gap: 20px;
  padding-top: 24px;

  &__main {
    position: relative;
    order: 2;
    min-height: 580px;
    border-radius: var(--zd-R);
    overflow: hidden;
    background: var(--zd-surface);
  }
  &__photo {
    position: absolute;
    inset: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 80% 30%;
    }
  }
  &__motto {
    position: absolute;
    left: 20px;
    top: 20px;
    display: grid;
    max-width: 300px;
    padding: 12px 16px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.92);
    line-height: 1.35;

    b {
      font-family: 'Roboto Slab', serif;
      font-size: 15px;
      color: var(--zd-ink);
    }
    span {
      margin-top: 2px;
      font-size: 12px;
      color: var(--zd-muted);
    }
  }
  &__panel {
    position: absolute;
    left: 20px;
    bottom: 20px;
    width: min(520px, calc(100% - 40px));
    padding: 28px;
    border-radius: 20px;
    background: #fff;

    h1 {
      font-size: 34px;
      line-height: 1.15;
    }
    p {
      margin-top: 10px;
      color: var(--zd-muted);
    }
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
  }
  &__hl {
    order: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 26px 24px 18px;
    border-radius: var(--zd-R);
    background: var(--zd-yellow);
    color: var(--zd-ink);

    h2 {
      max-width: 300px;
      padding-right: 40px;
      margin-bottom: 14px;
      font-size: 24px;
      line-height: 1.2;
    }
  }
  &__hex {
    position: absolute;
    top: 22px;
    right: 22px;
    color: rgba(28, 33, 51, 0.35);
  }
  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 11px 4px;
    border-top: 1px solid rgba(28, 33, 51, 0.14);

    span {
      display: grid;
      line-height: 1.3;
    }
    b {
      font-size: 16px;
    }
    small {
      font-size: 13px;
      color: rgba(28, 33, 51, 0.7);
    }
    svg {
      flex: none;
      transition: transform 0.15s;
    }
    &:hover {
      color: var(--zd-accent);

      svg {
        transform: translateX(3px);
      }
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: 340px minmax(0, 1fr);

    &__panel h1 {
      font-size: 30px;
    }
    &__hl h2 {
      font-size: 21px;
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    padding-top: 16px;

    &__main {
      display: flex;
      flex-direction: column-reverse;
      min-height: 0;
      overflow: visible;
      background: none;
    }
    &__photo {
      position: relative;
      aspect-ratio: 860 / 503;
      border-radius: var(--zd-R);
      overflow: hidden;
    }
    &__panel {
      position: static;
      width: auto;
      padding: 0 0 18px;
      background: none;
    }
    &__hl {
      order: 3;
    }
  }
  @media (max-width: 576px) {
    &__panel {
      h1 {
        font-size: 26px;
      }
    }
    &__btns .zd-btn {
      flex: 1 1 auto;
    }
    &__motto {
      left: 12px;
      right: auto;
      top: auto;
      bottom: 12px;
      max-width: calc(100% - 24px);
      padding: 8px 12px;

      b {
        font-size: 13px;
      }
    }
    &__hl {
      padding: 20px 18px 12px;

      h2 {
        max-width: 250px;
        font-size: 19px;
      }
    }
    &__hex {
      top: 18px;
      right: 16px;
    }
  }
}

/* ---------- О пасеке ---------- */
.zd-story {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 40px;
  align-items: stretch;

  &__txt {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 8px 0;

    h2 {
      font-size: 32px;
    }
    p {
      font-size: 16px;
    }
    blockquote {
      position: relative;
      padding: 18px 20px 18px 62px;
      border-radius: 18px;
      background: var(--zd-yellow-soft);
      color: var(--zd-ink);
      font-weight: 600;

      svg {
        position: absolute;
        left: 20px;
        top: 18px;
        color: #b38f00;
      }
    }
  }
  &__links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    margin-top: 4px;
  }
  &__photos {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1.4fr 1fr;
    gap: 12px;
    min-height: 460px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 18px;
    }
  }
  &__big {
    grid-column: 1 / -1;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;

    &__photos {
      min-height: 0;
      grid-template-rows: auto auto;

      img {
        aspect-ratio: 3 / 2;
        height: auto;
      }
    }
  }
  @media (max-width: 768px) {
    &__txt h2 {
      font-size: 25px;
    }
    &__txt p {
      font-size: 15px;
    }
  }
}

/* ---------- Видео ---------- */
.zd-vids {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 20px;

  &__main {
    position: relative;
    display: block;
    aspect-ratio: 16 / 9;
    border-radius: 20px;
    overflow: hidden;
    background: var(--zd-ink);
    text-align: left;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.88;
      transition: transform 0.3s;
    }
    &:hover img {
      transform: scale(1.03);
    }
  }
  &__play {
    position: absolute;
    left: 50%;
    top: 50%;
    display: grid;
    place-items: center;
    width: 76px;
    height: 76px;
    margin: -38px 0 0 -38px;
    border-radius: 50%;
    background: var(--zd-yellow);
    color: var(--zd-ink);

    svg {
      margin-left: 4px;
    }
  }
  &__cap {
    position: absolute;
    left: 16px;
    bottom: 16px;
    right: 16px;
    width: fit-content;
    padding: 8px 14px;
    border-radius: 12px;
    background: #fff;
    font-weight: 600;
    color: var(--zd-ink);
  }
  &__list {
    display: grid;
    align-content: start;
    gap: 8px;

    button {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 14px 16px;
      border-radius: 16px;
      background: var(--zd-surface);
      text-align: left;
      font-weight: 600;
      color: var(--zd-ink);

      span {
        flex: 1;
        min-width: 0;
      }
      svg {
        flex: none;
        color: var(--zd-accent);
      }
      &:hover {
        background: var(--zd-soft);
      }
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* ---------- Отзывы ---------- */
.zd-revs {
  display: grid;
  align-items: stretch;

  .zd-review__more {
    align-self: flex-start;
    margin-top: auto;
    font-size: 14px;
  }
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* ---------- Как заказать ---------- */
.zd-order {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 40px;
  align-items: start;

  h2 {
    margin-bottom: 12px;
    font-size: 32px;
  }
  &__call {
    display: grid;
    gap: 6px;
    padding: 32px;
    border-radius: var(--zd-R);
    background: var(--zd-surface);
  }
  &__lead {
    color: var(--zd-muted);
  }
  &__phone {
    font-family: 'Roboto Slab', serif;
    font-size: 38px;
    font-weight: 700;
    line-height: 1.15;
    color: var(--zd-accent);
    white-space: nowrap;
  }
  &__who {
    color: var(--zd-ink);
    font-weight: 600;
  }
  &__btns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 14px;
  }
  &__form {
    margin-top: 4px;
  }
  &__note {
    margin-top: 10px;
    font-size: 13px;
    color: var(--zd-muted);
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
  @media (max-width: 768px) {
    h2 {
      font-size: 25px;
    }
    &__call {
      padding: 22px 18px;
    }
    &__phone {
      font-size: 30px;
    }
  }
  @media (max-width: 375px) {
    &__phone {
      font-size: 26px;
    }
  }
}
.zd-vids__main .zd-vids__cap {
  @media (max-width: 576px) {
    left: 10px;
    bottom: 10px;
    padding: 6px 10px;
    font-size: 13px;
  }
}
.zd-vids__main .zd-vids__play {
  @media (max-width: 576px) {
    top: 40%;
    width: 56px;
    height: 56px;
    margin: -28px 0 0 -28px;
  }
}
</style>
