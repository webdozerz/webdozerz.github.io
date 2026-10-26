<script lang="ts" setup>
import NsIcon from '~/components/redesign/naslagdenia/NsIcon.vue'
import NsCard from '~/components/redesign/naslagdenia/NsCard.vue'
import NsQty from '~/components/redesign/naslagdenia/NsQty.vue'

const order = useNaslagdeniaOrder()
const ui = useNaslagdeniaUi()

const hero = nsFind('maximilian')!
const popular = nsProducts.filter((p) => p.section === 'standard' && p.labels?.includes('hit')).slice(0, 8)
const pies = nsProducts.filter((p) => p.section === 'pie' && p.box).slice(0, 4)
const customSections = nsSections
  .filter((s) => s.kind === 'custom')
  .map((s) => {
    const list = nsProducts.filter((p) => p.section === s.id)
    return { ...s, count: list.length, from: Math.min(...list.map((p) => p.price)), img: list[0].img }
  })
const minKg = Math.min(...customSections.map((s) => s.from))
const reviews = nsReviews.filter((r) => r.rating).slice(0, 3)

// Живое время — только в браузере: страница собирается заранее, и время сборки было бы неверным.
const eta = ref<ReturnType<typeof nsReadyEta> | null>(null)
const clock = ref('')
const nearest = ref('')
const tick = () => {
  eta.value = nsReadyEta()
  clock.value = nsClock()
  nearest.value = nsDateText(nsIsoAfter(3))
}
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  tick()
  timer = setInterval(tick, 30000)
})
onBeforeUnmount(() => clearInterval(timer))

const facts = [
  { icon: 'fresh', title: 'Свежие тортики', text: 'Только свежая, незамороженная продукция' },
  { icon: 'truck', title: 'Бесплатная доставка', text: 'Готовые торты — бесплатно по Новосибирску' },
  { icon: 'cake', title: `${nsProducts.length} тортов и пирожных`, text: 'Найдёте торт на любой праздник' },
  { icon: 'clock', title: 'Доставка в день заказа', text: 'Привезём день в день, даже один торт' },
]
const customRules = [
  { icon: 'calendar', title: 'За 3 дня', text: 'Торт до 7 кг. Тяжелее или по вашему эскизу — за 7 дней' },
  { icon: 'scale', title: 'От 1,5 кг', text: 'Свадебный — от 3 кг. Цена за кг — в карточке торта' },
  { icon: 'slice', title: 'Начинка на выбор', text: 'Любая из наших готовых тортов: Барбара, Нимфа, Тирамису…' },
  { icon: 'wallet', title: 'Предоплата 30\u00a0%', text: 'Вносится в любом фирменном магазине после звонка менеджера' },
]
const mapSrc = nsMapUrl(nsShops)
const addHero = () => {
  order.add(hero)
  ui.say(`${nsShort(hero)} — в заказе`)
}
</script>

<template>
  <div>
    <section class="ns-wrap ns-hero">
      <div class="ns-hero__panel">
        <h1>Живите с&nbsp;наслаждением!</h1>
        <p class="ns-hero__lead">
          Кондитерская в Новосибирске с 1999 года. Свежие торты без заморозки, 12 фирменных магазинов и доставка в день заказа.
        </p>
        <div class="ns-hero__ways">
          <NuxtLink :to="nsPath('/catalog/standard')" class="ns-way">
            <span class="ns-way__icon"><NsIcon name="truck" /></span>
            <span class="ns-way__body">
              <b>Готовый торт сегодня</b>
              <span v-if="eta">
                Сейчас {{ clock }} в Новосибирске — привезём <em>{{ eta.text }}</em
                >. По городу бесплатно.
              </span>
              <span v-else>Заявки с 8:00 до 17:00 — привезём в тот же день. По городу бесплатно.</span>
            </span>
            <NsIcon name="arrow" class="ns-way__arrow" />
          </NuxtLink>
          <NuxtLink :to="nsPath('/catalog/holiday')" class="ns-way">
            <span class="ns-way__icon"><NsIcon name="calendar" /></span>
            <span class="ns-way__body">
              <b>Торт на заказ к дате</b>
              <span v-if="nearest">
                Ближайшая дата — <em>{{ nearest }}</em
                >. От {{ nsMoney(minKg) }} за кг.
              </span>
              <span v-else>Заявка за 3 дня, от {{ nsMoney(minKg) }} за кг.</span>
            </span>
            <NsIcon name="arrow" class="ns-way__arrow" />
          </NuxtLink>
        </div>
      </div>
      <div class="ns-hero__photo">
        <img :src="hero.img" :alt="hero.title" width="1200" height="880" fetchpriority="high" />
        <div class="ns-hero__plate">
          <NuxtLink :to="nsPath(`/product/${hero.id}`)" class="ns-hero__name">
            <b>{{ nsShort(hero) }}</b>
            <span>{{ hero.weight }} · {{ nsMoney(hero.price) }}</span>
          </NuxtLink>
          <NsQty v-if="order.qty(hero.id)" :id="hero.id" />
          <button v-else type="button" class="ns-btn ns-btn--main" @click="addHero">
            <NsIcon name="plus" :size="18" />
            <span>В заказ</span>
          </button>
        </div>
      </div>
    </section>

    <section class="ns-wrap">
      <ul class="ns-facts">
        <li v-for="f in facts" :key="f.title">
          <span class="ns-facts__icon"><NsIcon :name="f.icon" /></span>
          <span>
            <b>{{ f.title }}</b>
            <small>{{ f.text }}</small>
          </span>
        </li>
      </ul>
    </section>

    <section class="ns-wrap ns-section">
      <div class="ns-head">
        <div>
          <h2>Сегодня в магазинах</h2>
          <p>
            Готовые торты — в наших магазинах каждый день. Доставка по Новосибирску бесплатная, кроме Советского и Первомайского районов.
          </p>
        </div>
        <NuxtLink :to="nsPath('/catalog/standard')" class="ns-head__more">
          Все {{ nsCount('standard') }} тортов <NsIcon name="arrow" :size="18" />
        </NuxtLink>
      </div>
      <div class="ns-grid">
        <NsCard v-for="p in popular" :key="p.id" :product="p" />
      </div>
    </section>

    <section class="ns-wrap ns-section">
      <div class="ns-head">
        <div>
          <h2>Торты на заказ</h2>
          <p>Выберите вид торта по фото, начинку — из наших готовых тортов. Вес, сумму и ближайшую дату посчитаем сразу в карточке.</p>
        </div>
      </div>
      <div class="ns-sections">
        <NuxtLink v-for="s in customSections" :key="s.id" :to="nsPath(`/catalog/${s.id}`)" class="ns-sectile">
          <span class="ns-sectile__photo"><img :src="s.img" :alt="s.title" width="600" height="440" loading="lazy" /></span>
          <span class="ns-sectile__body">
            <span class="ns-sectile__icon"><NsIcon :name="s.icon" :size="20" /></span>
            <span>
              <b>{{ s.title }}</b>
              <small>{{ s.count }} {{ nsPlural(s.count, 'дизайн', 'дизайна', 'дизайнов') }} · от {{ nsMoney(s.from) }}/кг</small>
            </span>
          </span>
        </NuxtLink>
      </div>
      <ul class="ns-rules">
        <li v-for="r in customRules" :key="r.title">
          <NsIcon :name="r.icon" />
          <span>
            <b>{{ r.title }}</b>
            <small>{{ r.text }}</small>
          </span>
        </li>
      </ul>
    </section>

    <section class="ns-wrap ns-section">
      <div class="ns-head">
        <div>
          <h2>Пирожные коробками</h2>
          <p>В коробке 8–12 пирожных, цена указана за коробку. Поштучно — в магазинах.</p>
        </div>
        <NuxtLink :to="nsPath('/catalog/pie')" class="ns-head__more">Все пирожные <NsIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="ns-grid">
        <NsCard v-for="p in pies" :key="p.id" :product="p" />
      </div>
    </section>

    <section class="ns-wrap ns-section">
      <div class="ns-head">
        <div>
          <h2>Отзывы</h2>
          <p>Около 150 отзывов за годы работы — читаем каждый.</p>
        </div>
        <NuxtLink :to="nsPath('/otzyvy')" class="ns-head__more">Все отзывы <NsIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="ns-revs">
        <article v-for="r in reviews" :key="r.name + r.date" class="ns-rev">
          <span class="ns-stars" :aria-label="`Оценка ${r.rating} из 5`">
            <NsIcon v-for="i in 5" :key="i" name="star" :size="18" :class="{ 'is-off': i > (r.rating ?? 0) }" />
          </span>
          <p>{{ r.text }}</p>
          <span class="ns-rev__by">{{ r.name }} · {{ nsDateText(r.date, false) }} {{ r.date.slice(0, 4) }}</span>
        </article>
      </div>
    </section>

    <section class="ns-wrap ns-section">
      <div class="ns-shops">
        <div class="ns-shops__list">
          <h2>12 магазинов</h2>
          <p>В Новосибирске и Оби. Готовый торт можно забрать в любом из них, там же вносится предоплата за заказной.</p>
          <ul>
            <li v-for="(s, i) in nsShops" :key="s.id">
              <NuxtLink :to="{ path: nsPath('/magaziny'), hash: `#shop-${s.id}` }">
                <i>{{ i + 1 }}</i>
                <span>{{ s.title }}</span>
              </NuxtLink>
            </li>
          </ul>
          <NuxtLink :to="nsPath('/magaziny')" class="ns-btn ns-btn--line">Как найти магазин</NuxtLink>
        </div>
        <div class="ns-shops__map">
          <iframe :src="mapSrc" title="Магазины «Наслаждение» на карте" loading="lazy" />
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.ns {
  .ns-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    gap: 20px;
    padding-top: 24px;

    &__panel {
      display: flex;
      flex-direction: column;
      padding: 44px 40px 36px;
      background: var(--ns-surface);
      border-radius: var(--ns-r-panel);

      h1 {
        font-size: clamp(42px, 4.6vw, 68px);
        line-height: 1;
      }
    }

    &__lead {
      max-width: 520px;
      margin-top: 18px;
      font-size: 17px;
      color: var(--ns-muted);
    }

    &__ways {
      display: grid;
      gap: 12px;
      margin-top: auto;
      padding-top: 32px;
    }

    &__photo {
      position: relative;
      min-height: 520px;
      overflow: hidden;
      background: var(--ns-terra);
      border-radius: var(--ns-r-panel);

      img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 45% 50%;
      }
    }

    &__plate {
      position: absolute;
      right: 20px;
      bottom: 20px;
      left: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      max-width: 440px;
      padding: 12px 12px 12px 18px;
      background: #fff;
      border-radius: var(--ns-r-card);
    }

    &__name {
      display: grid;
      min-width: 0;
      text-decoration: none;

      b {
        font-family: var(--ns-head);
        font-size: 22px;
        line-height: 1.1;
        color: var(--ns-dark);
      }

      span {
        font-size: 14px;
        color: var(--ns-muted);
        white-space: nowrap;
      }
    }

    @media (max-width: 1199px) {
      grid-template-columns: minmax(0, 1fr);

      &__photo {
        min-height: 0;
        aspect-ratio: 16 / 9;
      }
    }

    @media (max-width: 768px) {
      padding-top: 14px;

      &__panel {
        padding: 28px 20px 20px;
        border-radius: 24px;
      }

      &__photo {
        aspect-ratio: 4 / 3;
        border-radius: 24px;
      }

      &__plate {
        right: 12px;
        bottom: 12px;
        left: 12px;
        padding: 10px 10px 10px 14px;
      }

      &__name b {
        font-size: 19px;
      }
    }

    @media (max-width: 576px) {
      &__panel h1 {
        font-size: 38px;
      }
    }

    @media (max-width: 375px) {
      &__panel h1 {
        font-size: 33px;
      }

      &__name span {
        white-space: normal;
      }
    }
  }

  .ns-way {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 20px;
    color: var(--ns-text);
    text-decoration: none;
    background: #fff;
    border: 1px solid var(--ns-line);
    border-radius: var(--ns-r-card);
    transition: border-color 0.2s;

    &:hover {
      border-color: var(--ns-accent);
    }

    &__icon {
      display: grid;
      flex: none;
      place-items: center;
      width: 48px;
      height: 48px;
      color: #fff;
      background: var(--ns-accent);
      border-radius: 14px;
    }

    &__body {
      display: grid;
      flex: 1;
      gap: 3px;
      min-width: 0;

      b {
        font-size: 18px;
        color: var(--ns-dark);
      }

      > span {
        font-size: 14px;
        line-height: 1.45;
        color: var(--ns-muted);
      }

      em {
        font-style: normal;
        font-weight: 700;
        color: var(--ns-accent);
      }
    }

    &__arrow {
      flex: none;
      color: var(--ns-accent);
    }

    @media (max-width: 576px) {
      align-items: flex-start;
      gap: 12px;
      padding: 14px;

      &__icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
      }

      &__arrow {
        display: none;
      }
    }
  }

  ul.ns-facts {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-top: 20px;

    li {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 18px;
      border: 1px solid var(--ns-line);
      border-radius: var(--ns-r-card);
    }

    b {
      display: block;
      font-size: 15px;
      color: var(--ns-dark);
    }

    small {
      display: block;
      font-size: 13px;
      line-height: 1.4;
      color: var(--ns-muted);
    }

    @media (max-width: 1199px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 8px;

      li {
        padding: 12px 14px;
      }
    }
  }

  .ns-facts__icon {
    display: grid;
    flex: none;
    place-items: center;
    width: 44px;
    height: 44px;
    color: var(--ns-accent);
    background: var(--ns-surface);
    border-radius: 14px;
  }

  .ns-sections {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 16px;

    @media (max-width: 1199px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
  }

  .ns-sectile {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: var(--ns-dark);
    text-decoration: none;
    border: 1px solid var(--ns-line);
    border-radius: var(--ns-r-card);

    &__photo {
      display: block;
      aspect-ratio: 15 / 11;
      overflow: hidden;
      background: var(--ns-terra);

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.35s ease;
      }
    }

    &:hover img {
      transform: scale(1.04);
    }

    &:hover b {
      color: var(--ns-accent);
    }

    &__body {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;

      b {
        display: block;
        font-size: 16px;
        line-height: 1.25;
      }

      small {
        display: block;
        margin-top: 2px;
        font-size: 13px;
        color: var(--ns-muted);
      }
    }

    &__icon {
      display: grid;
      flex: none;
      place-items: center;
      width: 40px;
      height: 40px;
      color: var(--ns-accent);
      background: var(--ns-surface);
      border-radius: 12px;
    }

    @media (max-width: 576px) {
      &__body {
        gap: 8px;
        padding: 10px;
      }

      &__icon {
        display: none;
      }

      &__body b {
        font-size: 15px;
      }
    }
  }

  ul.ns-rules {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
    margin-top: 20px;
    padding: 24px 28px;
    background: var(--ns-surface);
    border-radius: var(--ns-r-card);

    li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .ns-icon {
      flex: none;
      margin-top: 2px;
      color: var(--ns-accent);
    }

    b {
      display: block;
      color: var(--ns-dark);
    }

    small {
      display: block;
      font-size: 13px;
      line-height: 1.45;
      color: var(--ns-muted);
    }

    @media (max-width: 1199px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 16px;
      padding: 20px 16px;
    }
  }

  .ns-revs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }
  }

  .ns-rev {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 22px;
    background: var(--ns-surface);
    border-radius: var(--ns-r-card);

    p {
      flex: 1;
      font-size: 15px;
    }

    &__by {
      font-size: 13px;
      font-weight: 600;
      color: var(--ns-muted);
    }
  }

  .ns-shops {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: 20px;

    &__list {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 14px;
      padding: 32px;
      background: var(--ns-surface);
      border-radius: var(--ns-r-panel);

      h2 {
        font-size: clamp(30px, 3.4vw, 44px);
      }

      > p {
        color: var(--ns-muted);
      }

      ul {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px 16px;
        width: 100%;
        margin: 6px 0 8px;
      }

      a:not(.ns-btn) {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        font-size: 14px;
        color: var(--ns-text);
        text-decoration: none;

        &:hover {
          color: var(--ns-accent);
        }
      }

      i {
        display: grid;
        flex: none;
        place-items: center;
        width: 22px;
        height: 22px;
        font-size: 11px;
        font-style: normal;
        font-weight: 700;
        color: #fff;
        background: var(--ns-accent);
        border-radius: 999px;
      }
    }

    &__map {
      min-height: 460px;
      overflow: hidden;
      background: var(--ns-surface);
      border-radius: var(--ns-r-panel);

      iframe {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 460px;
        border: 0;
      }
    }

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);

      &__map,
      &__map iframe {
        min-height: 360px;
      }
    }

    @media (max-width: 576px) {
      &__list {
        padding: 22px 16px;

        ul {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    }
  }
}
</style>
