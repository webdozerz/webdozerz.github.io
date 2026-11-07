<script lang="ts" setup>
import GmIcon from '~/components/redesign/gornyimed/GmIcon.vue'
import GmQty from '~/components/redesign/gornyimed/GmQty.vue'

useSeoMeta({ title: 'Мёд оптом в куботейнерах и на экспорт | Пасеки Соловьёвых, концепт редизайна' })

const shop = useGornyimedShop()
const ui = useGornyimedUi()
const [sergey] = gmContacts.people

const add = (id: string) => {
  shop.add(`b:${id}`)
  ui.say(`В корзине: опт, ${gmBulkOf(id)?.short} — ${gmCubes(shop.qtyOf(`b:${id}`))}`)
}
const docsShown = ref(12)
const openDoc = (i: number) => ui.open(gmDocs.map((d, k) => ({ src: d.full, cap: `Документы 2018–2021, ${k + 1}` })), i)
const stickMail = `mailto:${gmContacts.email}?subject=${encodeURIComponent('Мёд в стиках для кафе')}`
</script>

<template>
  <div class="gm-wrap gm-opt">
    <nav class="gm-crumbs" aria-label="Навигация">
      <NuxtLink :to="gmPath()">Главная</NuxtLink>
      <span>Опт и экспорт</span>
    </nav>
    <h1 class="gm-title">Мёд оптом и на экспорт</h1>
    <p class="gm-lead">Куботейнеры для магазинов и переработчиков, стики для кафе, контейнеры за рубеж. Документы и сертификаты качества — к каждой партии.</p>
    <div class="gm-opt__top">
      <a :href="gmContacts.price" class="gm-btn gm-btn--main"><GmIcon name="down" :size="19" />Скачать прайс, xlsx</a>
      <a :href="`tel:${sergey.tel}`" class="gm-btn gm-btn--line"><GmIcon name="phone" :size="19" />{{ sergey.phone }}, Сергей</a>
    </div>

    <section class="gm-section">
      <div class="gm-head">
        <div>
          <h2>Мёд в куботейнерах</h2>
          <p>Цены — за килограмм, сумма — за полный куботейнер. Куботейнер добавляется в общую корзину вместе с банками.</p>
        </div>
      </div>
      <ul class="gm-bulk">
        <li v-for="b in gmBulk" :id="b.id" :key="b.id" class="gm-brow">
          <div class="gm-brow__img gm-cube">
            <GmIcon name="cube" :size="34" />
            <small>{{ b.cube ? `${b.cube} кг` : 'куботейнер' }}</small>
          </div>
          <div class="gm-brow__info">
            <h3>{{ b.title }}</h3>
            <p>{{ b.note }}</p>
            <span class="gm-brow__stock">{{ b.stock }}</span>
          </div>
          <dl class="gm-brow__nums">
            <div>
              <dt>Куботейнер</dt>
              <dd>{{ b.cube ? `${b.cube} кг` : 'уточним' }}</dd>
            </div>
            <div>
              <dt>Опт</dt>
              <dd>
                <b>{{ b.perKg ? `${gmMoney(b.perKg)}/кг` : 'по телефону' }}</b>
              </dd>
            </div>
            <div>
              <dt>{{ b.retailKg ? b.retailNote : 'За куботейнер' }}</dt>
              <dd>{{ b.retailKg ? `${gmMoney(b.retailKg)}/кг` : '—' }}</dd>
            </div>
          </dl>
          <div class="gm-brow__buy">
            <span class="gm-brow__sum">
              <template v-if="shop.qtyOf(`b:${b.id}`)">
                {{ gmCubes(shop.qtyOf(`b:${b.id}`)) }}<template v-if="b.cube">, {{ gmKg(b.cube * shop.qtyOf(`b:${b.id}`)) }}</template>
                <b v-if="b.perKg && b.cube">{{ gmMoney(b.perKg * b.cube * shop.qtyOf(`b:${b.id}`)) }}</b>
              </template>
              <template v-else-if="b.perKg && b.cube">куботейнер — <b>{{ gmMoney(b.perKg * b.cube) }}</b></template>
              <template v-else>цену подтвердит Сергей</template>
            </span>
            <GmQty
              v-if="shop.qtyOf(`b:${b.id}`)"
              :model-value="shop.qtyOf(`b:${b.id}`)"
              :min="0"
              unit="куб."
              @update:model-value="shop.setQty(`b:${b.id}`, $event)"
            />
            <button v-else type="button" class="gm-btn gm-btn--main" @click="add(b.id)"><GmIcon name="cube" :size="19" />В заказ</button>
          </div>
        </li>
      </ul>
      <div class="gm-opt__tara">
        <GmIcon name="cube" :size="22" />
        <p><b>Пустые куботейнеры</b> из пищевого полиэтилена — 270 ₽/шт, от 100 шт — 260 ₽. В наличии в Барнауле, минимальная партия — 1 шт.</p>
      </div>
    </section>

    <section class="gm-section">
      <div class="gm-opt__stick">
        <img :src="gmStick.img2" alt="Мёд в стик-пакетах" loading="lazy" />
        <div>
          <h2>Порционный мёд в стиках</h2>
          <p>Для кафе, ресторанов, гостиниц и подарков с логотипом.</p>
          <ul>
            <li v-for="f in gmStick.facts" :key="f"><GmIcon name="check" :size="18" />{{ f }}</li>
          </ul>
          <a :href="stickMail" class="gm-btn gm-btn--line"><GmIcon name="mail" :size="19" />Запросить стики</a>
        </div>
      </div>
    </section>

    <section id="eksport" class="gm-section">
      <div class="gm-head">
        <div>
          <h2>Мёд на экспорт</h2>
          <p>{{ gmExport.text }}</p>
        </div>
      </div>
      <ul class="gm-facts gm-opt__facts">
        <li v-for="f in gmExport.facts" :key="f.n"><b>{{ f.n }}</b><span>{{ f.t }}</span></li>
      </ul>
      <div class="gm-regions">
        <div v-for="[r, c] in gmExport.regions" :key="r" class="gm-regions__item">
          <GmIcon name="ship" :size="20" />
          <div><b>{{ r }}</b><span>{{ c }}</span></div>
        </div>
      </div>
    </section>

    <section id="dokumenty" class="gm-section">
      <div class="gm-head">
        <div>
          <h2>Прайс и документы</h2>
          <p>Актуальный прайс — файлом. Ниже сканы документов 2018–2021 годов, нажмите, чтобы рассмотреть.</p>
        </div>
        <a :href="gmContacts.price" class="gm-link"><GmIcon name="down" :size="17" />Скачать прайс</a>
      </div>
      <ul class="gm-docs">
        <li v-for="(d, i) in gmDocs.slice(0, docsShown)" :key="d.full">
          <button type="button" :aria-label="`Документ ${i + 1}`" @click="openDoc(i)"><img :src="d.thumb" alt="" loading="lazy" /></button>
        </li>
      </ul>
      <button v-if="docsShown < gmDocs.length" type="button" class="gm-btn gm-btn--line gm-opt__moredocs" @click="docsShown = gmDocs.length">
        Показать все {{ gmDocs.length }} документов
      </button>
    </section>
  </div>
</template>

<style lang="scss">
.gm-opt {
  &__top {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 22px;
  }
  &__tara {
    display: flex;
    gap: 12px;
    align-items: start;
    margin-top: 16px;
    padding: 16px 18px;
    border-radius: var(--gm-R);
    background: var(--gm-surface);

    .gm-icon {
      color: var(--gm-accent);
    }
    b {
      color: var(--gm-ink);
    }
  }
  &__stick {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 32px;
    align-items: center;
    padding: 28px;
    border: 1px solid var(--gm-line);
    border-radius: 18px;

    img {
      width: 100%;
      border-radius: var(--gm-R);
    }
    > div {
      display: grid;
      justify-items: start;
      gap: 12px;
    }
    h2 {
      font-size: clamp(24px, 2.6vw, 30px);
    }
    p {
      color: var(--gm-muted);
    }
    ul {
      display: grid;
      gap: 6px;
    }
    li {
      display: flex;
      gap: 8px;

      .gm-icon {
        margin-top: 3px;
        color: var(--gm-green);
      }
    }
    @media (max-width: 768px) {
      grid-template-columns: minmax(0, 1fr);
      padding: 18px;

      img {
        max-width: 240px;
      }
    }
  }
  &__moredocs {
    margin-top: 18px;
  }
}
ul.gm-facts.gm-opt__facts {
  margin-bottom: 28px;
}
ul.gm-bulk {
  display: grid;
  gap: 12px;
}
.gm-brow {
  display: grid;
  grid-template-columns: 96px minmax(0, 1.2fr) minmax(0, 1fr) 230px;
  gap: 20px;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--gm-line);
  border-radius: var(--gm-R);

  &__img {
    display: grid;
    place-items: center;
    width: 96px;
    height: 120px;
    border-radius: var(--gm-r);
    overflow: hidden;
    background: var(--gm-pack);
    color: var(--gm-honey);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__info {
    display: grid;
    justify-items: start;
    gap: 6px;

    h3 {
      font-size: 21px;
    }
    p {
      font-size: 14px;
      color: var(--gm-muted);
    }
  }
  &__stock {
    padding: 2px 9px;
    border-radius: 6px;
    background: #e7f2e6;
    color: var(--gm-green);
    font-size: 12.5px;
    font-weight: 700;
  }
  dl.gm-brow__nums {
    display: grid;
    gap: 5px;

    div {
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }
    dt {
      font-size: 13.5px;
      color: var(--gm-muted);
    }
    dd {
      font-weight: 600;
      color: var(--gm-ink);
      white-space: nowrap;

      b {
        color: var(--gm-accent);
        font-size: 17px;
      }
    }
  }
  &__buy {
    display: grid;
    gap: 8px;
    justify-items: stretch;

    .gm-qty {
      justify-content: space-between;
    }
  }
  &__sum {
    font-size: 13.5px;
    color: var(--gm-muted);
    text-align: center;

    b {
      margin-left: 4px;
      color: var(--gm-ink);
      font-size: 15px;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: 96px minmax(0, 1fr) 220px;
    grid-template-areas:
      'img info buy'
      'img nums buy';

    &__img {
      grid-area: img;
      align-self: start;
    }
    &__info {
      grid-area: info;
    }
    &__nums {
      grid-area: nums;
      max-width: 360px;
    }
    &__buy {
      grid-area: buy;
    }
  }
  @media (max-width: 768px) {
    grid-template-columns: 72px minmax(0, 1fr);
    grid-template-areas:
      'img info'
      'nums nums'
      'buy buy';
    gap: 14px;

    &__img {
      width: 72px;
      height: 90px;
    }
    &__nums {
      max-width: none;
      padding-top: 12px;
      border-top: 1px solid var(--gm-line);
    }
  }
}
.gm-regions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  &__item {
    display: flex;
    gap: 12px;
    padding: 16px;
    border-radius: var(--gm-R);
    background: var(--gm-surface);

    .gm-icon {
      color: var(--gm-accent);
    }
    div {
      display: grid;
      gap: 2px;
    }
    b {
      color: var(--gm-ink);
    }
    span {
      font-size: 14px;
      color: var(--gm-muted);
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
ul.gm-docs {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;

  button {
    display: block;
    width: 100%;
    aspect-ratio: 3 / 4;
    border: 1px solid var(--gm-line);
    border-radius: var(--gm-r);
    overflow: hidden;
    background: var(--gm-surface);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &:hover {
      border-color: var(--gm-accent);
    }
  }
  @media (max-width: 989px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
