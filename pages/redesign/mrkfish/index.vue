<script lang="ts" setup>
import MfIcon from '~/components/redesign/mrkfish/MfIcon.vue'
import MfCard from '~/components/redesign/mrkfish/MfCard.vue'
import MfLetter from '~/components/redesign/mrkfish/MfLetter.vue'

const ui = useMrkfishUi()
const smoked = mfInSection('smoked').slice(0, 4)
const salted = ['assorti-rybnoe-iz-file-kusochkov-seldi-i-gorbush-2', 'seld-s-ukropom-150-g', 'morskaya-kapusta-v-masle-650-g', 'skumbriya-malosolenaya-5-kg']
  .map((id) => mfFind(id))
  .filter((p): p is MfProduct => !!p)
const more = ref<MfSectionId>('dried')
const moreList = computed(() => mfInSection(more.value).slice(0, 4))
</script>

<template>
  <div>
    <section class="mf-wrap mf-hero">
      <div class="mf-hero__panel">
        <h1>Копчёная, солёная и вяленая рыба от производителя</h1>
        <p class="mf-hero__lead">
          Оптом с 1993 года из Миякинского района Башкортостана. Каждый день возим своим транспортом по Башкортостану, Оренбургской
          области и Татарстану.
        </p>
        <div class="mf-hero__actions">
          <NuxtLink :to="mfSectionPath()" class="mf-btn">Смотреть каталог <MfIcon name="arrow" :size="20" /></NuxtLink>
          <button type="button" class="mf-btn mf-btn--line" @click="ui.modal.value = 'price'"><MfIcon name="doc" :size="20" /> Оптовый прайс</button>
        </div>
        <ul class="mf-hero__facts mf-hero__desk">
          <li v-for="f in mfFacts" :key="f.value">
            <b>{{ f.value }}</b>
            <span>{{ f.label }}</span>
          </li>
        </ul>
        <a :href="mfSites[0].mapLink" target="_blank" rel="noopener" class="mf-hero__rating mf-hero__desk">
          <MfIcon name="star" :size="18" />
          <b>{{ mfSites[0].rating }}</b> в Яндекс Картах · {{ mfSites[0].reviews.split(' · ')[0] }}
        </a>
      </div>
      <div class="mf-hero__secs">
        <NuxtLink v-for="s in mfSections" :key="s.id" :to="mfSectionPath(s.id)" class="mf-sec">
          <span class="mf-sec__photo"><img :src="mfImg(s.cover)" :alt="s.title" width="760" height="507" /></span>
          <span class="mf-sec__text">
            <b>{{ s.title }}</b>
            <small>{{ mfPositions(mfInSection(s.id).length) }}</small>
          </span>
          <span class="mf-sec__go"><MfIcon name="arrow" :size="20" /></span>
        </NuxtLink>
      </div>
      <!-- На телефоне цифры идут после разделов: так в первый экран попадает рыба, а не только текст. -->
      <ul class="mf-hero__facts mf-hero__mob">
        <li v-for="f in mfFacts" :key="f.value">
          <b>{{ f.value }}</b>
          <span>{{ f.label }}</span>
        </li>
      </ul>
    </section>

    <section class="mf-wrap mf-section">
      <div class="mf-smoke">
        <div class="mf-smoke__text">
          <h2>Коптим на ольхе и буке</h2>
          <p>Холодное копчение на натуральном дыме и родниковой воде — так, как 33 года назад.</p>
        </div>
        <ul class="mf-smoke__list">
          <li v-for="c in mfSmoke" :key="c.title">
            <span><MfIcon :name="c.icon" :size="22" /></span>
            <p>
              <b>{{ c.title }}</b>
              {{ c.text }}
            </p>
          </li>
        </ul>
      </div>
      <div class="mf-head mf-head--after">
        <div>
          <h2>Копчёная рыба</h2>
          <p>Филе и тушки холодного копчения, слабосолёные. Продаём на вес.</p>
        </div>
        <NuxtLink :to="mfSectionPath('smoked')" class="mf-head__more">Все {{ mfPositions(mfInSection('smoked').length) }} <MfIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="mf-shelf">
        <MfCard v-for="p in smoked" :key="p.id" :product="p" />
      </div>
    </section>

    <section class="mf-wrap mf-section">
      <div class="mf-head">
        <div>
          <h2>Солёная рыба и пресервы</h2>
          <p>Фасовки от 150 г для магазинов и вёдра по 3–5 кг для столовых и кафе.</p>
        </div>
        <NuxtLink :to="mfSectionPath('salted')" class="mf-head__more">Все {{ mfPositions(mfInSection('salted').length) }} <MfIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="mf-shelf">
        <MfCard v-for="p in salted" :key="p.id" :product="p" />
      </div>
    </section>

    <section class="mf-wrap mf-section">
      <div class="mf-req">
        <div class="mf-req__text">
          <h2>Прайс — по заявке, ответ за {{ mfContacts.answer }}</h2>
          <p class="mf-req__lead">Цены у производителя зависят от объёма и региона, поэтому прайс высылаем под ваш заказ.</p>
          <ul class="mf-req__list">
            <li>
              <span><MfIcon name="fish" /></span>
              <p><b>Отметьте позиции и объём</b> в каталоге — весовую рыбу в килограммах, пресервы в упаковках.</p>
            </li>
            <li>
              <span><MfIcon name="truck" /></span>
              <p><b>Укажите город</b> — подскажем день, когда туда идёт наша машина.</p>
            </li>
            <li>
              <span><MfIcon name="mail" /></span>
              <p><b>Отправьте заявку</b> на почту или в WhatsApp — пришлём цены и наличие.</p>
            </li>
          </ul>
          <div class="mf-req__actions">
            <NuxtLink :to="mfSectionPath()" class="mf-btn">Собрать заявку</NuxtLink>
            <button type="button" class="mf-btn mf-btn--line" @click="ui.modal.value = 'price'">Весь прайс на почту</button>
          </div>
        </div>
        <MfLetter sample />
      </div>
    </section>

    <section class="mf-wrap mf-section">
      <div class="mf-head">
        <div>
          <h2>Ещё в каталоге</h2>
          <div class="mf-tabs" role="tablist">
            <button
              v-for="id in ['dried', 'frozen'] as MfSectionId[]"
              :key="id"
              type="button"
              role="tab"
              class="mf-tabs__item"
              :class="{ 'is-on': more === id }"
              :aria-selected="more === id"
              @click="more = id"
            >
              {{ mfSection(id).title }}
            </button>
          </div>
        </div>
        <NuxtLink :to="mfSectionPath(more)" class="mf-head__more">Все {{ mfPositions(mfInSection(more).length) }} <MfIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="mf-shelf">
        <MfCard v-for="p in moreList" :key="p.id" :product="p" />
      </div>
    </section>

    <section class="mf-wrap mf-section">
      <div class="mf-fleet">
        <img src="/redesign/mrkfish/g/fleet.jpg" alt="Здание компании и машины автопарка" width="1400" height="785" loading="lazy" />
        <div class="mf-fleet__text">
          <h2>Свой автопарк — каждый день</h2>
          <p>Возим продукцию собственным транспортом в три региона. В другие регионы России — по договорённости с отделом продаж.</p>
          <ul>
            <li v-for="r in mfRegions" :key="r"><MfIcon name="pin" :size="20" />{{ r }}</li>
          </ul>
          <NuxtLink :to="mfPath('/about')" class="mf-head__more">О производстве и доставке <MfIcon name="arrow" :size="18" /></NuxtLink>
        </div>
      </div>
    </section>

    <section class="mf-wrap mf-section">
      <div class="mf-head">
        <div>
          <h2>Нам доверяют</h2>
          <p>Оценки обеих площадок в Яндекс Картах и знаки качества продукции.</p>
        </div>
      </div>
      <div class="mf-trust">
        <a v-for="s in mfSites" :key="s.id" :href="s.mapLink" target="_blank" rel="noopener" class="mf-rating">
          <span class="mf-rating__score">
            <b>{{ s.rating }}</b>
            <span class="mf-rating__stars"><MfIcon v-for="i in 5" :key="i" name="star" :size="16" /></span>
          </span>
          <span class="mf-rating__text">
            <b>{{ s.title }}</b>
            <small>{{ s.reviews }}</small>
            <em>Читать в Яндекс Картах <MfIcon name="external" :size="15" /></em>
          </span>
        </a>
        <ul class="mf-badges">
          <li v-for="b in mfBadges" :key="b.title">
            <img :src="`/redesign/mrkfish/g/${b.img}`" :alt="b.title" width="120" height="120" loading="lazy" />
            <span>{{ b.title }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.mf-hero {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 16px;
  padding-top: 24px;

  &__panel {
    display: flex;
    flex-direction: column;
    padding: clamp(24px, 3.4vw, 44px);
    border-radius: var(--mf-r-lg);
    background: var(--mf-surface);

    h1 {
      font-size: clamp(30px, 3.4vw, 46px);
      line-height: 1.06;
    }
  }

  &__lead {
    margin-top: 16px !important;
    font-size: 17px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 24px;
  }

  &__facts {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 16px 20px;
    margin-top: auto !important;
    padding-top: 32px !important;

    li {
      display: grid;
      align-content: start;
      padding-top: 12px;
      border-top: 1px solid var(--mf-field);
    }

    b {
      color: var(--mf-navy);
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.15;
    }

    span {
      color: var(--mf-muted);
      font-size: 14px;
      line-height: 1.35;
    }
  }

  &__rating {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 20px;
    color: var(--mf-text);
    font-size: 14px;

    svg {
      color: #e0a400;
      fill: currentColor;
    }

    b {
      color: var(--mf-ink);
    }

    &:hover {
      color: var(--mf-navy);
    }
  }

  &__secs {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 16px;
  }

  &__mob {
    display: none !important;
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);

    &__facts {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  @media (max-width: 768px) {
    padding-top: 16px;

    &__facts {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }

    &__desk {
      display: none !important;
    }

    &__mob {
      display: grid !important;
      padding-top: 8px !important;
    }

    &__secs {
      gap: 10px;
    }
  }

  @media (max-width: 576px) {
    &__actions .mf-btn {
      flex: 1 1 100%;
    }

    &__facts b {
      font-size: 20px;
    }
  }
}

.mf-sec {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--mf-r-lg);
  background: var(--mf-surface);

  &__photo {
    display: block;
    flex: none;
    aspect-ratio: 3 / 2;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      mix-blend-mode: multiply;
      transition: transform 0.3s;
    }
  }

  &__text {
    display: grid;
    flex: 1;
    align-content: start;
    padding: 14px 64px 16px 18px;
    line-height: 1.3;

    b {
      color: var(--mf-ink);
      font-size: 18px;
      font-weight: 800;
    }

    small {
      color: var(--mf-muted);
      font-size: 14px;
    }
  }

  &__go {
    position: absolute;
    right: 14px;
    bottom: 16px;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    color: var(--mf-red);
    transition:
      background 0.2s,
      color 0.2s;
  }

  &:hover {
    img {
      transform: scale(1.04);
    }

    .mf-sec__go {
      background: var(--mf-red);
      color: #fff;
    }
  }

  @media (max-width: 576px) {
    &__text {
      padding: 10px 12px 12px;

      b {
        font-size: 15px;
      }

      small {
        font-size: 13px;
      }
    }

    &__go {
      display: none;
    }
  }
}

.mf-smoke {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  align-items: center;
  gap: 24px 40px;
  padding: clamp(22px, 3vw, 36px);
  border-radius: var(--mf-r-lg);
  background: var(--mf-navy-soft);

  h2 {
    font-size: clamp(24px, 2.6vw, 32px);
  }

  &__text p {
    margin-top: 8px !important;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 24px;

    li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    span {
      display: grid;
      flex: none;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: #fff;
      color: var(--mf-navy);
    }

    p {
      color: var(--mf-muted);
      font-size: 14px;
      line-height: 1.4;
    }

    b {
      display: block;
      color: var(--mf-ink);
      font-size: 15px;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (max-width: 576px) {
    &__list {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

.mf-head--after {
  margin-top: 40px;
}

.mf-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;

  &__item {
    height: 40px;
    padding: 0 16px;
    border: 1px solid var(--mf-line) !important;
    border-radius: 999px;
    color: var(--mf-ink);
    font-weight: 700;
    white-space: nowrap;

    &.is-on {
      border-color: var(--mf-navy) !important;
      background: var(--mf-navy-soft);
      color: var(--mf-navy);
    }
  }
}

.mf-req {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
  gap: 40px;

  h2 {
    font-size: clamp(26px, 3vw, 36px);
  }

  &__lead {
    margin-top: 10px !important;
    color: var(--mf-muted);
  }

  &__list {
    display: grid;
    gap: 16px;
    margin-top: 24px !important;

    li {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    span {
      display: grid;
      flex: none;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--mf-red-soft);
      color: var(--mf-red);
    }

    p {
      padding-top: 2px;
    }

    b {
      color: var(--mf-ink);
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 28px;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }

  @media (max-width: 576px) {
    &__actions .mf-btn {
      flex: 1 1 100%;
    }
  }
}


.mf-trust {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;

  .mf-badges {
    grid-column: 1 / -1;
  }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.mf-rating {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px;
  border: 1px solid var(--mf-line);
  border-radius: var(--mf-r-lg);
  transition: border-color 0.2s;

  &__score {
    display: grid;
    justify-items: center;
    gap: 4px;

    > b {
      color: var(--mf-ink);
      font-size: 40px;
      font-weight: 800;
      line-height: 1;
    }
  }

  &__stars {
    display: flex;
    color: #e0a400;

    svg {
      fill: currentColor;
    }
  }

  &__text {
    display: grid;
    gap: 2px;
    min-width: 0;
    line-height: 1.35;

    b {
      color: var(--mf-ink);
      font-size: 17px;
    }

    small {
      color: var(--mf-muted);
      font-size: 14px;
    }

    em {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 6px;
      color: var(--mf-navy);
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
    }
  }

  &:hover {
    border-color: var(--mf-navy);
  }
}

</style>
