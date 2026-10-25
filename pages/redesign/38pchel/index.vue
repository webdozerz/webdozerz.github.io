<script lang="ts" setup>
import PcIcon from '~/components/redesign/38pchel/PcIcon.vue'
import PcCard from '~/components/redesign/38pchel/PcCard.vue'
import PcQty from '~/components/redesign/38pchel/PcQty.vue'

const shop = usePchelShop()

// Медовая линейка: сорт выбирается в ряду стопок, ниже — фасовка, состояние и тара.
const honeyId = ref(pcHoneys[0].id)
const honey = computed(() => pcFindProduct(honeyId.value)!)
const picks = ref<Record<string, string>>(pcDefaults(honey.value))
watch(honeyId, () => {
  picks.value = pcDefaults(honey.value)
})
const option = (id: string) => honey.value.options.find((o) => o.id === id)
const price = computed(() => pcPrice(honey.value, picks.value))
const kgPrice = computed(() => pcPrice(honey.value, { ...picks.value, w: '1000', tare: 'plastic' }))

const more = ['comb', 'perga', 'pollen', 'propolis', 'zabrus', 'cedar-honey', 'hazelnut', 'perga-comb']
  .map((id) => pcFindProduct(id)!)
  .filter(Boolean)

const sectionCount = (id: PcSectionId) => pcProducts.filter((p) => p.sections.includes(id)).length
const zones = pcZones
const reviews = pcStoreReviews.slice(0, 4)

const diary = ref<HTMLElement | null>(null)
const scrollDiary = (dir: number) => diary.value?.scrollBy({ left: dir * diary.value.clientWidth * 0.8, behavior: 'smooth' })
</script>

<template>
  <div class="pc-home">
    <section class="pc-wrap pc-hero">
      <div class="pc-hero__panel">
        <p class="pc-hero__kicker"><PcIcon name="hive" :size="20" /> Пасека Черепановых с 1991 года</p>
        <h1>Мёд с нашей пасеки под Иркутском</h1>
        <p class="pc-hero__lead">
          Сергей и Юлия Черепановы. Пасека в Иркутском районе, в 10 км от Оёка: на время медосбора вывозим пчёл на поля донника и
          эспарцета, подальше от дорог и дач.
        </p>
        <div class="pc-hero__actions">
          <a href="#honey" class="pc-btn pc-btn--accent">Выбрать мёд <PcIcon name="arrow" :size="18" /></a>
          <a :href="pcContacts.phoneHref" class="pc-btn pc-btn--line"><PcIcon name="phone" :size="18" /> {{ pcContacts.phone }}</a>
        </div>
        <ul class="pc-hero__facts">
          <li>
            <PcIcon name="calendar" />
            <span><b>Урожай 2026 года</b> прозрачный и севший мёд</span>
          </li>
          <li>
            <PcIcon name="truck" />
            <span><b>В день заказа</b> по Иркутску, бесплатно от 1000 ₽</span>
          </li>
          <li>
            <PcIcon name="shield" />
            <span><b>Вернём деньги</b>, если вам не понравится</span>
          </li>
        </ul>
      </div>
      <div class="pc-hero__photo">
        <img :src="pcImg('family')" alt="Семья Черепановых на пасеке" width="1080" height="717" />
        <figure class="pc-hero__inset">
          <img :src="pcImg('season-42')" alt="Две банки мёда урожая 2026 года на крышке улья" width="320" height="240" />
          <figcaption><b>17 июля</b> Откачали эспарцетовый и луговой мёд урожая 2026</figcaption>
        </figure>
      </div>
    </section>

    <section id="honey" class="pc-wrap pc-section pc-line">
      <div class="pc-head">
        <div>
          <h2>Шесть сортов — от светлого к тёмному</h2>
          <p>Нажмите на стопку: покажем вкус, откуда мёд и сколько стоит каждая фасовка.</p>
        </div>
        <NuxtLink :to="{ path: pcPath('/catalog'), query: { s: 'honey' } }" class="pc-head__link">Весь мёд <PcIcon name="arrow" :size="18" /></NuxtLink>
      </div>

      <div class="pc-line__row" role="tablist" aria-label="Сорта мёда">
        <button
          v-for="h in pcHoneys"
          :key="h.id"
          type="button"
          role="tab"
          class="pc-line__item"
          :aria-selected="honeyId === h.id"
          :class="{ 'is-on': honeyId === h.id }"
          @click="honeyId = h.id"
        >
          <img :src="pcImg(h.img)" :alt="h.title" width="200" height="240" loading="lazy" />
          <span class="pc-line__shade" :style="{ background: h.honey!.shade }" />
          <b>{{ h.short }}</b>
          <small>от {{ pcRub(h.base) }}</small>
        </button>
      </div>

      <div class="pc-line__detail">
        <div class="pc-line__info">
          <img :src="pcImg(honey.img)" :alt="honey.title" width="425" height="510" class="pc-line__glass" />
          <p class="pc-line__flower">
            <span :style="{ background: honey.honey!.shade }" />
            {{ honey.honey!.flower }}
          </p>
          <h3>{{ honey.title }}</h3>
          <p class="pc-line__lead">{{ honey.lead }}</p>
          <p v-for="t in honey.text" :key="t" class="pc-line__text">{{ t }}</p>
          <p v-if="honey.origin" class="pc-origin"><PcIcon name="pin" :size="18" /> {{ honey.origin }}</p>
          <NuxtLink :to="pcPath(`/product/${honey.id}`)" class="pc-line__more">
            {{ honey.reviews ? `${honey.reviews} ${pcPlural(honey.reviews, 'отзыв', 'отзыва', 'отзывов')} и подробности` : 'Подробнее о мёде' }}
            <PcIcon name="arrow" :size="16" />
          </NuxtLink>
        </div>

        <div class="pc-line__buy">
          <div v-if="option('state')" class="pc-opt">
            <span class="pc-opt__title">Состояние</span>
            <div class="pc-opt__seg">
              <button
                v-for="v in option('state')!.values"
                :key="v.id"
                type="button"
                :class="{ 'is-on': picks.state === v.id }"
                @click="picks.state = v.id"
              >
                {{ v.short }}
              </button>
            </div>
            <p class="pc-opt__hint">
              {{
                picks.state === 'sat'
                  ? 'Севший — закристаллизовался естественно: густой, белеет, его удобно намазывать.'
                  : 'Прозрачный — жидкий, только что откачанный. Со временем мёд садится, это признак натурального мёда.'
              }}
            </p>
          </div>

          <div class="pc-opt">
            <span class="pc-opt__title">Фасовка</span>
            <div class="pc-opt__weights pc-opt__weights--n4">
              <button
                v-for="v in option('w')!.values"
                :key="v.id"
                type="button"
                class="pc-chip"
                :class="{ 'is-on': picks.w === v.id }"
                @click="picks.w = v.id"
              >
                <span>{{ v.label }}</span>
                <small>{{ pcRub(pcPrice(honey, { ...picks, w: v.id })) }}</small>
              </button>
            </div>
          </div>

          <div class="pc-opt">
            <span class="pc-opt__title">Тара</span>
            <div class="pc-opt__seg">
              <button
                v-for="v in option('tare')!.values"
                :key="v.id"
                type="button"
                :class="{ 'is-on': picks.tare === v.id }"
                @click="picks.tare = v.id"
              >
                {{ v.id === 'glass' ? 'стекло +50 ₽' : 'пластик, 0 ₽' }}
              </button>
            </div>
          </div>

          <div class="pc-line__total">
            <div>
              <b>{{ pcRub(price) }}</b>
              <span>{{ pcRub(kgPrice) }} за 1 кг</span>
            </div>
            <PcQty :pid="honey.id" :picks="picks" big />
          </div>
        </div>
      </div>
    </section>

    <section class="pc-wrap pc-section">
      <div class="pc-head">
        <div>
          <h2>Всё с пасеки</h2>
          <p>Кроме мёда — соты, перга, пыльца, прополис и пчёлы для пчеловодов.</p>
        </div>
      </div>
      <div class="pc-sections">
        <NuxtLink v-for="s in pcSections" :key="s.id" :to="{ path: pcPath('/catalog'), query: { s: s.id } }" class="pc-sections__item">
          <span class="pc-sections__icon"><PcIcon :name="s.icon" :size="28" /></span>
          <b>{{ s.title }}</b>
          <small>{{ s.text }}</small>
          <em>{{ sectionCount(s.id) }}</em>
        </NuxtLink>
      </div>
    </section>

    <section class="pc-wrap pc-section">
      <div class="pc-head">
        <div>
          <h2>Соты, перга и мёд с орехами</h2>
        </div>
        <NuxtLink :to="pcPath('/catalog')" class="pc-head__link">Весь каталог <PcIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="pc-grid">
        <PcCard v-for="p in more" :key="p.id" :product="p" />
      </div>
    </section>

    <section class="pc-wrap pc-section">
      <div class="pc-story">
        <div class="pc-story__text">
          <h2>Тридцать пять лет с пчёлами</h2>
          <p>
            В 1991 году отец купил несколько пчелосемей — с них началась наша семейная пасека. Сергей познакомился с пчёлами в 11 лет. Сейчас у
            нас больше 70 пчелосемей, а вместе с родителями — больше 140.
          </p>
          <p>Пчёл держим в деревянных ульях, лечение проводим осенью, уже после откачки мёда.</p>
          <NuxtLink :to="pcPath('/about')" class="pc-btn pc-btn--dark">История пасеки <PcIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <ol class="pc-story__years">
          <li v-for="h in pcHistory.filter((x) => x.img)" :key="h.year">
            <img :src="pcImg(h.img!)" :alt="h.text" width="300" height="220" loading="lazy" />
            <b>{{ h.year }}</b>
            <span>{{ h.text }}</span>
          </li>
        </ol>
      </div>
    </section>

    <section class="pc-wrap pc-section">
      <div class="pc-head">
        <div>
          <h2>Сезон 2026 на пасеке</h2>
          <p>Что цвело и когда откачивали мёд — фотодневник Сергея.</p>
        </div>
        <div class="pc-arrows">
          <button type="button" class="pc-btn pc-btn--line" aria-label="Назад" @click="scrollDiary(-1)"><PcIcon name="left" /></button>
          <button type="button" class="pc-btn pc-btn--line" aria-label="Вперёд" @click="scrollDiary(1)"><PcIcon name="right" /></button>
        </div>
      </div>
      <ul ref="diary" class="pc-diary">
        <li v-for="d in pcSeason" :key="d.img">
          <img :src="pcImg(d.img)" :alt="d.text" width="420" height="315" loading="lazy" />
          <b>{{ d.date }}</b>
          <span>{{ d.text }}</span>
        </li>
      </ul>
    </section>

    <section class="pc-wrap pc-section">
      <div class="pc-head">
        <div>
          <h2>{{ pcReviewsTotal }} отзыва о пасеке</h2>
          <p>Собираем отзывы с 2ГИС, Яндекс Карт и Авито.</p>
        </div>
        <NuxtLink :to="pcPath('/reviews')" class="pc-head__link">Все отзывы <PcIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="pc-reviews">
        <article v-for="r in reviews" :key="r.author + r.date" class="pc-review">
          <p class="pc-review__text">{{ r.text }}</p>
          <p class="pc-review__meta">
            <b>{{ r.author }}</b> {{ r.date }} <span class="pc-review__src">{{ r.source }}</span>
          </p>
        </article>
      </div>
    </section>

    <section class="pc-wrap pc-section">
      <div class="pc-head">
        <div>
          <h2>Доставка</h2>
          <p>Привозим сами, обычно в день заказа. Минимальная сумма для доставки — 600 ₽.</p>
        </div>
        <NuxtLink :to="pcPath('/delivery')" class="pc-head__link">Доставка и оплата <PcIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="pc-zones">
        <div v-for="z in zones" :key="z.id" class="pc-zones__item">
          <PcIcon :name="z.id === 'pickup' ? 'pin' : z.id === 'russia' ? 'mail' : 'truck'" />
          <b>{{ z.title }}</b>
          <span>{{ z.text }}</span>
          <em>
            {{
              z.freeFrom
                ? `${pcRub(z.price!)}, бесплатно от ${pcRub(z.freeFrom)}`
                : z.price === 0
                  ? 'бесплатно'
                  : 'по тарифу перевозчика'
            }}
          </em>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.pc-hero {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  gap: 16px;
  padding-top: 24px;

  &__panel {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 40px;
    border-radius: var(--pc-r-panel);
    background: var(--pc-surface);

    h1 {
      font-size: clamp(38px, 4.6vw, 64px);
      line-height: 1;
    }
  }

  &__kicker {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: var(--pc-accent);
  }

  &__lead {
    font-size: 17px;
    max-width: 520px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  ul.pc-hero__facts {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: auto;
    padding-top: 18px;
    border-top: 1px solid var(--pc-line-strong);

    li {
      display: flex;
      align-items: flex-start;
      gap: 12px;

      svg {
        color: var(--pc-accent);
      }
    }

    b {
      font-weight: 600;
    }
  }

  &__photo {
    position: relative;
    min-height: 560px;
    border-radius: var(--pc-r-panel);
    overflow: hidden;

    > img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 30%;
    }
  }

  &__inset {
    position: absolute;
    right: 16px;
    bottom: 16px;
    display: grid;
    grid-template-columns: 112px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    width: min(360px, calc(100% - 32px));
    padding: 8px 14px 8px 8px;
    border-radius: 18px;
    background: #fff;
    font-size: 14px;
    line-height: 1.35;

    img {
      width: 112px;
      height: 84px;
      object-fit: cover;
      border-radius: 12px;
    }

    b {
      display: block;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

    &__panel {
      padding: 28px;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__photo {
      order: -1;
      min-height: 0;
      aspect-ratio: 3 / 2;
    }
  }

  @media (max-width: 576px) {
    padding-top: 12px;

    &__panel {
      padding: 22px 18px;
      border-radius: var(--pc-r-card);
    }

    &__photo {
      order: 0;
      aspect-ratio: 4 / 3;
      border-radius: var(--pc-r-card);
    }

    &__inset {
      display: none;
    }

    &__actions .pc-btn {
      flex: 1 1 100%;
    }
  }
}

.pc-line {
  &__row {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 10px;
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 8px 14px;
    border-radius: var(--pc-r-card);
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--pc-line);
    transition: box-shadow 0.15s;

    img {
      width: 100%;
      max-width: 170px;
      height: auto;
      aspect-ratio: 5 / 6;
      object-fit: contain;
    }

    b {
      font-family: var(--pc-head);
      font-size: 18px;
    }

    small {
      color: var(--pc-muted);
      font-size: 13px;
    }

    &:hover {
      box-shadow: inset 0 0 0 1px var(--pc-line-strong);
    }

    &.is-on {
      box-shadow: inset 0 0 0 2px var(--pc-ink);
    }
  }

  &__shade {
    width: 100%;
    height: 8px;
    margin: 4px 0 6px;
    border-radius: 4px;
  }

  &__detail {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 16px;
    margin-top: 16px;
  }

  &__info {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 28px 248px 28px 28px;
    border-radius: var(--pc-r-panel);
    background: var(--pc-surface);

    h3 {
      font-size: 34px;
    }
  }

  &__glass {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 208px;
    height: auto;
    aspect-ratio: 5 / 6;
    object-fit: contain;
    border-radius: 20px;
    background: #fff;
    mix-blend-mode: multiply;
  }

  &__flower {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;

    span {
      width: 14px;
      height: 14px;
      border-radius: 5px;
    }
  }

  &__lead {
    font-size: 17px;
    font-weight: 500;
  }

  &__text {
    color: #403a32;
  }

  &__origin {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 12px;
    background: #fff;
    font-size: 14px;

    svg {
      margin-top: 1px;
      color: var(--pc-accent);
    }
  }

  &__more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: auto;
    padding-top: 6px;
    font-weight: 600;
    color: var(--pc-accent);
  }

  &__buy {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 28px;
    border-radius: var(--pc-r-panel);
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--pc-line);
  }

  &__total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: auto;
    padding-top: 18px;
    border-top: 1px solid var(--pc-line);

    > div {
      display: flex;
      flex-direction: column;
    }

    b {
      font-family: var(--pc-head);
      font-size: 34px;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }

    > div > span {
      margin-top: 4px;
      color: var(--pc-muted);
      font-size: 14px;
    }

    .pc-qty {
      min-width: 200px;
    }
  }

  @media (max-width: 1199px) {
    &__row {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    &__item {
      display: grid;
      grid-template-columns: 64px minmax(0, 1fr);
      grid-template-areas: 'img name' 'img price' 'shade shade';
      align-items: center;
      column-gap: 10px;
      row-gap: 2px;
      text-align: left;

      img {
        grid-area: img;
        width: 64px;
        aspect-ratio: 5 / 6;
      }

      b {
        grid-area: name;
        align-self: end;
        hyphens: auto;
      }

      small {
        grid-area: price;
        align-self: start;
      }
    }

    &__shade {
      grid-area: shade;
      margin: 6px 0 0;
      height: 6px;
    }
  }

  @media (max-width: 1199px) {
    &__info {
      padding-right: 28px;
    }

    &__glass {
      display: none;
    }
  }

  @media (max-width: 989px) {
    &__detail {
      grid-template-columns: minmax(0, 1fr);
    }

    &__info {
      padding-right: 248px;
    }

    &__glass {
      display: block;
    }
  }

  @media (max-width: 768px) {
    &__info {
      padding-right: 28px;
    }

    &__glass {
      display: none;
    }
  }

  @media (max-width: 768px) {
    &__row {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    &__item {
      grid-template-columns: 44px minmax(0, 1fr);
      column-gap: 8px;
      padding: 8px 10px 10px;

      img {
        width: 44px;
      }

      b {
        font-size: 15px;
      }
    }
  }

  @media (max-width: 576px) {
    &__info,
    &__buy {
      padding: 20px 16px;
      border-radius: var(--pc-r-card);
    }

    &__info h3 {
      font-size: 28px;
    }

    &__total {
      flex-direction: column;
      align-items: stretch;

      .pc-qty {
        min-width: 0;
        width: 100%;
      }
    }
  }
}

.pc-sections {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;

  &__item {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 18px 16px;
    border-radius: var(--pc-r-card);
    background: var(--pc-surface);
    transition: box-shadow 0.15s;

    b {
      margin-top: 10px;
      font-family: var(--pc-head);
      font-size: 18px;
      line-height: 1.15;
    }

    small {
      color: var(--pc-muted);
      font-size: 13px;
      line-height: 1.3;
    }

    em {
      position: absolute;
      top: 16px;
      right: 16px;
      font-style: normal;
      font-size: 13px;
      color: var(--pc-muted);
    }

    &:hover {
      box-shadow: inset 0 0 0 1px var(--pc-line-strong);
    }
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: var(--pc-honey);
    color: var(--pc-ink);
  }

  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
}

.pc-story {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
  gap: 32px;
  align-items: center;

  &__text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;

    h2 {
      font-size: clamp(28px, 3.2vw, 40px);
    }

    p {
      color: #403a32;
    }
  }

  ol.pc-story__years {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;

    li {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 13px;
      line-height: 1.35;
      color: var(--pc-muted);
    }

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 3 / 4;
      object-fit: cover;
      border-radius: 16px;
      margin-bottom: 6px;
    }

    b {
      font-family: var(--pc-head);
      font-size: 22px;
      color: var(--pc-ink);
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (max-width: 576px) {
    ol.pc-story__years {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

.pc-arrows {
  display: flex;
  gap: 8px;

  .pc-btn {
    width: 48px;
    padding: 0;
  }

  @media (max-width: 576px) {
    display: none;
  }
}

ul.pc-diary {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - 32px) / 3);
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  li {
    display: flex;
    flex-direction: column;
    gap: 4px;
    scroll-snap-align: start;
  }

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: var(--pc-r-card);
    margin-bottom: 8px;
  }

  b {
    font-family: var(--pc-head);
    font-size: 20px;
  }

  span {
    color: #403a32;
  }

  @media (max-width: 989px) {
    grid-auto-columns: calc((100% - 16px) / 2);
  }

  @media (max-width: 576px) {
    grid-auto-columns: 82%;
    gap: 12px;
  }
}

</style>
