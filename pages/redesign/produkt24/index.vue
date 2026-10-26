<script lang="ts" setup>
import PkIcon from '~/components/redesign/produkt24/PkIcon.vue'
import PkSearch from '~/components/redesign/produkt24/PkSearch.vue'
import PkTiers from '~/components/redesign/produkt24/PkTiers.vue'
import PkRow from '~/components/redesign/produkt24/PkRow.vue'
import PkLetter from '~/components/redesign/produkt24/PkLetter.vue'
import PkFeedback from '~/components/redesign/produkt24/PkFeedback.vue'
import PkMap from '~/components/redesign/produkt24/PkMap.vue'

useSeoMeta({ title: '24produkt — продукты оптом и в розницу в Красноярске | Концепт редизайна' })

const list = useProdukt24List()
const q = ref('')
const total = pkProducts.length
const countOf = (id: PkSectionId) => pkProducts.filter((p) => p.section === id).length

// Ходовые позиции — первое совпадение по частым запросам, по одной из разных групп.
const popular = pkPopular.map((w) => pkSearch(w)[0]).filter(Boolean) as PkProduct[]

const facts = [
  { icon: 'store', title: 'Свой склад', text: 'Красноярск, Северное шоссе, 5г — контроль качества и условий хранения' },
  { icon: 'truck', title: 'Доставка от 200 кг', text: 'Привозим компаниям по Красноярску, самовывоз со склада' },
  { icon: 'doc', title: 'Полный пакет документов', text: 'Сертификаты и декларации на всю продукцию от поставщиков' },
  { icon: 'card', title: 'Любой расчёт', text: 'Наличные, безнал, терминал, отсрочка платежа' },
]
</script>

<template>
  <div>
    <section class="pk-hero">
      <div class="pk-wrap">
        <div class="pk-hero__panel">
          <h1>Продукты питания оптом и&nbsp;в&nbsp;розницу</h1>
          <p class="pk-hero__lead">
            {{ total }} позиций со склада в Красноярске: мясо, птица, рыба, бакалея, консервы. Найдите нужное, соберите
            список — заявку примем на почту или по телефону.
          </p>
          <PkSearch v-model="q" big />
          <div class="pk-hero__popular">
            <span>Часто ищут:</span>
            <button v-for="w in pkPopular" :key="w" type="button" @click="q = w">{{ pkPopularLabel(w) }}</button>
          </div>
        </div>

        <div class="pk-hero__sections">
          <NuxtLink v-for="s in pkSections" :key="s.id" :to="pkSectionPath(s.id)" class="pk-tile">
            <i class="pk-sil" :style="{ '--pk-sil': `url(${pkIcons[s.id]})` }" />
            <span class="pk-tile__text">
              <b>{{ s.title }}</b>
              <small>{{ s.note }}</small>
            </span>
            <span class="pk-tile__count">{{ countOf(s.id) }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="pk-wrap pk-facts">
      <div v-for="f in facts" :key="f.title" class="pk-facts__item">
        <span class="pk-facts__ico"><PkIcon :name="f.icon" /></span>
        <span>
          <b>{{ f.title }}</b>
          {{ f.text }}
        </span>
      </div>
    </section>

    <section class="pk-wrap pk-section">
      <div class="pk-prices">
        <div class="pk-prices__text">
          <h2>Три цены — как в вашем прайсе</h2>
          <p>
            Каждая позиция стоит по-разному в зависимости от объёма и расчёта. Выберите свои условия — цены во всём прайсе
            и в списке пересчитаются.
          </p>
          <PkTiers />
        </div>
        <div class="pk-prices__table">
          <div class="pk-head">
            <span>Ходовые позиции</span>
            <span>Ед.</span>
            <button
              v-for="t in pkTiers"
              :key="t.id"
              type="button"
              :class="{ 'is-on': list.tier.value === t.id }"
              @click="list.tier.value = t.id"
            >
              {{ t.short }}
            </button>
            <span />
          </div>
          <PkRow v-for="p in popular" :key="p.id" :product="p" group />
          <NuxtLink :to="pkSectionPath()" class="pk-prices__all">Весь прайс: {{ total }} позиций <PkIcon name="arrow" :size="18" /></NuxtLink>
        </div>
      </div>
    </section>

    <section class="pk-wrap pk-section">
      <div class="pk-how">
        <div class="pk-how__text">
          <h2>Как заказать</h2>
          <ul>
            <li>
              <PkIcon name="list" />
              <span><b>Соберите список</b>Нажмите «В список» у нужных позиций и укажите количество — в килограммах, штуках или упаковках.</span>
            </li>
            <li>
              <PkIcon name="mail" />
              <span><b>Отправьте заявку</b>Список сам превратится в готовый текст: отправьте его на почту или продиктуйте менеджеру.</span>
            </li>
            <li>
              <PkIcon name="phone" />
              <span><b>Менеджер перезвонит</b>Подтвердит наличие, сумму и время доставки. Вопросы по заказу — {{ pkContacts.phones[0].label }}.</span>
            </li>
          </ul>
          <NuxtLink :to="list.count.value ? pkPath('/list') : pkSectionPath()" class="pk-btn">
            {{ list.count.value ? `Открыть список · ${list.count.value}` : 'Перейти в прайс' }}
          </NuxtLink>
        </div>
        <PkLetter sample />
      </div>
    </section>

    <section class="pk-wrap pk-section">
      <div class="pk-title">
        <h2>Контакты</h2>
        <NuxtLink :to="pkPath('/contacts')">Доставка, оплата, реквизиты <PkIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="pk-visit">
        <div class="pk-visit__card">
          <div class="pk-visit__phones">
            <a v-for="ph in pkContacts.phones" :key="ph.href" :href="ph.href">{{ ph.label }}</a>
          </div>
          <p><PkIcon name="phone" :size="18" /><span>Обратный звонок: <a :href="pkContacts.callback.href">{{ pkContacts.callback.label }}</a></span></p>
          <p><PkIcon name="mail" :size="18" /><a :href="`mailto:${pkContacts.email}`">{{ pkContacts.email }}</a></p>
          <p><PkIcon name="pin" :size="18" /><span>{{ pkContacts.address }}</span></p>
          <p>
            <PkIcon name="clock" :size="18" />
            <span>Пн–пт 8:30–16:30, сб 9:00–12:00, вс — выходной</span>
          </p>
          <PkMap class="pk-visit__map" />
        </div>
        <PkFeedback />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.pk-hero {
  padding: 40px 0 0;
  background: linear-gradient(var(--pk-surface) 0 72%, #fff 72%);

  &__panel {
    max-width: 860px;
    margin: 0 auto;
    padding: 24px 0 8px;
    text-align: center;

    h1 {
      font-size: 46px;
      letter-spacing: -0.025em;
    }
  }

  &__lead {
    max-width: 640px;
    margin: 14px auto 28px;
    color: var(--pk-text);
    font-size: 17px;
  }

  &__popular {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    color: var(--pk-muted);
    font-size: 14px;

    span {
      align-self: center;
      white-space: nowrap;
    }

    button {
      padding: 5px 12px;
      border: 1px solid var(--pk-line);
      border-radius: 8px;
      background: #fff;
      color: var(--pk-ink);

      &:hover {
        border-color: var(--pk-green);
        color: var(--pk-green);
      }
    }
  }

  &__sections {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
    margin-top: 40px;
  }

  @media (max-width: 989px) {
    &__panel h1 {
      font-size: 38px;
    }

    &__sections {
      grid-template-columns: repeat(2, minmax(0, 1fr));

      .pk-tile:last-child {
        grid-column: 1 / -1;
      }
    }
  }

  @media (max-width: 768px) {
    padding-top: 20px;

    &__panel {
      text-align: left;

      h1 {
        font-size: 30px;
      }
    }

    &__lead {
      margin: 10px 0 20px;
      font-size: 15px;
    }

    &__popular {
      flex-wrap: nowrap;
      justify-content: flex-start;
      overflow-x: auto;
      margin-right: -20px;
      padding-right: 20px;
      scrollbar-width: none;

      button {
        flex: none;
      }
    }

    &__sections {
      margin-top: 28px;
    }
  }

  @media (max-width: 576px) {
    &__sections {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 375px) {
    &__panel h1 {
      font-size: 26px;
    }

    &__popular {
      margin-right: -14px;
    }
  }
}

.pk-tile {
  position: relative;
  display: grid;
  align-content: start;
  gap: 14px;
  min-height: 170px;
  padding: 20px;
  border: 1px solid var(--pk-line);
  border-radius: var(--pk-r-lg);
  background: #fff;
  transition: border-color 0.15s, transform 0.15s;

  .pk-sil {
    width: 76px;
    height: 54px;
    color: var(--pk-green);
    -webkit-mask-position: left center;
    mask-position: left center;
  }

  &__text {
    display: grid;
    gap: 2px;

    b {
      color: var(--pk-ink);
      font-size: 18px;
    }

    small {
      color: var(--pk-muted);
      font-size: 13px;
      line-height: 1.35;
    }
  }

  &__count {
    position: absolute;
    top: 18px;
    right: 18px;
    padding: 2px 9px;
    border-radius: 8px;
    background: var(--pk-surface);
    color: var(--pk-muted);
    font-size: 13px;
  }

  &:hover {
    border-color: var(--pk-green);

    .pk-sil {
      transform: scale(1.06);
    }
  }

  .pk-sil {
    transition: transform 0.2s;
  }

  @media (max-width: 989px) {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    min-height: 0;
    padding: 14px 16px;

    .pk-sil {
      width: 56px;
      height: 40px;
    }

    &__count {
      top: 12px;
      right: 12px;
    }

    &__text b {
      padding-right: 40px;
    }
  }
}

.pk-facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  margin-top: 40px;

  &__item {
    display: flex;
    gap: 12px;
    color: var(--pk-muted);
    font-size: 14px;
    line-height: 1.4;

    b {
      display: block;
      margin-bottom: 2px;
      color: var(--pk-ink);
      font-size: 15px;
    }
  }

  &__ico {
    display: grid;
    place-items: center;
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: var(--pk-r);
    background: var(--pk-soft);
    color: var(--pk-green);
  }

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
}

.pk-prices {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 40px;
  align-items: start;

  &__text {
    position: sticky;
    top: 24px;
    display: grid;
    gap: 16px;

    h2 {
      font-size: 30px;
    }

    p {
      color: var(--pk-muted);
    }

    .pk-tiers {
      grid-auto-flow: row;
    }
  }

  &__table {
    min-width: 0;
    border: 1px solid var(--pk-line);
    border-radius: var(--pk-r-lg);
    overflow: hidden;

    .pk-head > span:first-child {
      color: var(--pk-ink);
      font-weight: 600;
    }
  }

  &__all {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    color: var(--pk-green);
    font-weight: 600;

    &:hover {
      background: var(--pk-surface);
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;

    &__text {
      position: static;

      .pk-tiers {
        grid-auto-flow: column;
      }
    }
  }

  @media (max-width: 989px) {
    &__table {
      padding: 0 14px;
    }

    &__text h2 {
      font-size: 24px;
    }
  }

  @media (max-width: 989px) {
    &__text .pk-tiers {
      grid-auto-flow: row;
    }
  }
}

.pk-how {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 560px);
  gap: 48px;
  align-items: center;
  padding: 40px;
  border-radius: var(--pk-r-lg);
  background: var(--pk-surface);

  &__text {
    display: grid;
    gap: 22px;
    justify-items: start;

    h2 {
      font-size: 30px;
    }

    ul {
      display: grid;
      gap: 18px;
    }

    li {
      display: flex;
      gap: 14px;
      color: var(--pk-muted);

      > .pk-icon {
        flex: none;
        color: var(--pk-green);
      }

      b {
        display: block;
        color: var(--pk-ink);
      }
    }
  }

  .pk-letter__text {
    max-height: 340px;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
    padding: 28px;
  }

  @media (max-width: 576px) {
    margin-left: -20px;
    margin-right: -20px;
    padding: 28px 20px;
    border-radius: 0;

    &__text h2 {
      font-size: 24px;
    }
  }

  @media (max-width: 375px) {
    margin-left: -14px;
    margin-right: -14px;
    padding: 24px 14px;
  }
}

.pk-visit {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 24px;

  // Колонка: карта забирает высоту, которую задаёт форма справа.
  &__card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 24px;
    border-radius: var(--pk-r-lg);
    background: var(--pk-surface);

    p {
      display: flex;
      gap: 10px;

      .pk-icon {
        flex: none;
        margin-top: 2px;
        color: var(--pk-green);
      }

      a {
        color: var(--pk-ink);
        font-weight: 500;
      }
    }

  }

  &__map {
    flex: 1 1 auto;
    margin-top: 8px;
    border-radius: var(--pk-r);
  }

  &__phones {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 24px;
    margin-bottom: 4px;

    a {
      color: var(--pk-ink);
      font-size: 24px;
      font-weight: 700;
      white-space: nowrap;

      &:hover {
        color: var(--pk-green);
      }
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (max-width: 375px) {
    &__card {
      padding: 18px 16px;
    }

    &__phones a {
      font-size: 21px;
    }
  }
}
</style>
